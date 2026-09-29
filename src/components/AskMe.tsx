import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { askMe, profile } from '../data'

/**
 * "Ask about me": a small button in the corner that opens a chat. A visitor
 * asks about my work and an AI answers from my portfolio and résumé, in the
 * first person, through the private helper at /api/ask (api/ask.ts), which
 * holds the key. The conversation stays for the visit (sessionStorage) and is
 * never sent anywhere else. The button steps aside while a product demo fills
 * the screen, and Escape closes the chat.
 */
type Msg = { role: 'user' | 'model'; text: string; error?: boolean }

const KEY = 'ask.chat.v1'
const errorText = (code?: string) =>
  code === 'limit'
    ? `That's a lot of questions at once. Give me a minute, or email me at ${profile.email}.`
    : code === 'bad'
      ? "I couldn't read that one. Could you ask it another way?"
      : `${askMe.offline} ${profile.email}`

function load(): Msg[] {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Msg[]).slice(-30) : []
  } catch {
    return []
  }
}

/** plain text, with links and email addresses made clickable (and nothing else) */
const LINK = /(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g
function Rich({ text }: { text: string }) {
  const parts = text.split(LINK)
  return (
    <>
      {parts.map((part, i) => {
        if (i % 2 === 0) return <Fragment key={i}>{part}</Fragment>
        // a sentence's full stop is not part of the address
        const [, core, tail] = part.match(/^(.*?)([.,;:!?]*)$/) ?? [part, part, '']
        const href = core.includes('@') && !core.startsWith('http') ? `mailto:${core}` : core
        const self = href.startsWith('https://www.karthikeyan.design')
        return (
          <Fragment key={i}>
            <a href={self ? href.replace('https://www.karthikeyan.design', '') || '/' : href} {...(self || href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noreferrer' })}>
              {core.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
            {tail}
          </Fragment>
        )
      })}
    </>
  )
}

function Spark() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.5c.5 4.7 2.3 6.9 7 7.5-4.7.6-6.5 2.8-7 7.5-.5-4.7-2.3-6.9-7-7.5 4.7-.6 6.5-2.8 7-7.5Z" fill="currentColor" />
      <path d="M19 15.5c.25 1.9 1 2.8 2.8 3-1.8.25-2.55 1.1-2.8 3-.25-1.9-1-2.75-2.8-3 1.8-.2 2.55-1.1 2.8-3Z" fill="currentColor" opacity=".7" />
    </svg>
  )
}

export default function AskMe() {
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [msgs, setMsgs] = useState<Msg[]>(load)
  const [draft, setDraft] = useState('')
  const [busy, setBusy] = useState(false)
  const [demo, setDemo] = useState(false)
  const input = useRef<HTMLTextAreaElement>(null)
  const list = useRef<HTMLDivElement>(null)
  const launcher = useRef<HTMLButtonElement>(null)

  // the conversation lasts the visit, across pages
  useEffect(() => {
    try {
      sessionStorage.setItem(KEY, JSON.stringify(msgs.slice(-30)))
    } catch {
      /* private mode: it just won't be remembered */
    }
  }, [msgs])

  // a product demo fills the screen; the button steps aside while it is in view
  useEffect(() => {
    const on = (e: Event) => setDemo(Boolean((e as CustomEvent<boolean>).detail))
    window.addEventListener('demo-inview', on)
    return () => window.removeEventListener('demo-inview', on)
  }, [])

  // open: the box takes focus (not on a touch screen, where that would throw
  // the keyboard up over the chat); Escape closes and hands focus back
  useEffect(() => {
    if (!open) return
    if (!window.matchMedia('(pointer: coarse)').matches) input.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      requestAnimationFrame(() => launcher.current?.focus())
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // the newest message in view
  useEffect(() => {
    const el = list.current
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduce ? 'auto' : 'smooth' })
  }, [msgs, busy, open, reduce])

  async function ask(q: string) {
    const text = q.trim().slice(0, 500)
    if (!text || busy) return
    const shown: Msg[] = [...msgs, { role: 'user', text }]
    setMsgs(shown)
    setDraft('')
    setBusy(true)
    try {
      // the model sees the conversation, not the error notes
      const messages = shown.filter((m) => !m.error).map(({ role, text }) => ({ role, text }))
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages }),
      })
      const data = (await res.json().catch(() => ({}))) as { answer?: string; error?: string }
      setMsgs((m) => [...m, data.answer ? { role: 'model', text: data.answer } : { role: 'model', text: errorText(data.error), error: true }])
    } catch {
      setMsgs((m) => [...m, { role: 'model', text: errorText(), error: true }])
    } finally {
      setBusy(false)
      if (!window.matchMedia('(pointer: coarse)').matches) input.current?.focus()
    }
  }

  const rise = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : { initial: { opacity: 0, y: 16, scale: 0.97 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: 12, scale: 0.98 } }

  return (
    <>
      <AnimatePresence>
        {!open && !demo && (
          <motion.button
            key="launch"
            ref={launcher}
            type="button"
            className="ask__launch"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            {...rise}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
          >
            <Spark />
            <span className="ask__launch-label">{askMe.label}</span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div key="chat" className="ask" role="dialog" aria-label={askMe.title} {...rise} transition={{ type: 'spring', stiffness: 300, damping: 28 }}>
            <header className="ask__head">
              <img className="ask__face" src="/favicon.png" alt="" />
              <div className="ask__who">
                <strong>{askMe.title}</strong>
                <span>{askMe.sub}</span>
              </div>
              <button type="button" className="ask__x" onClick={() => setOpen(false)} aria-label="Close the chat">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" />
                </svg>
              </button>
            </header>

            <div className="ask__list" ref={list} aria-live="polite">
              <p className="ask__msg ask__msg--model">{askMe.hello}</p>
              {msgs.length === 0 && (
                <div className="ask__starters">
                  {askMe.starters.map((s) => (
                    <button key={s} type="button" onClick={() => ask(s)}>
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {msgs.map((m, i) => (
                <p key={i} className={`ask__msg ask__msg--${m.role}${m.error ? ' ask__msg--error' : ''}`}>
                  {m.role === 'model' ? <Rich text={m.text} /> : m.text}
                </p>
              ))}
              {busy && (
                <p className="ask__msg ask__msg--model ask__typing" aria-label="Writing an answer">
                  <i />
                  <i />
                  <i />
                </p>
              )}
            </div>

            <form
              className="ask__form"
              onSubmit={(e) => {
                e.preventDefault()
                void ask(draft)
              }}
            >
              <textarea
                ref={input}
                rows={1}
                value={draft}
                maxLength={500}
                placeholder={askMe.placeholder}
                aria-label="Your question"
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  // Enter sends; Shift+Enter makes a new line
                  if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
                    e.preventDefault()
                    void ask(draft)
                  }
                }}
              />
              <button type="submit" className="ask__send" disabled={!draft.trim() || busy} aria-label="Send">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
