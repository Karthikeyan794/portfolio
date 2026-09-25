import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { aboutLinks, profile } from '../data'
import { marks } from '../logos'
import { formLive, sendForm } from '../sendForm'
import { useTyped } from '../useTyped'

/**
 * Contact me, in a dialog: the night library behind, one glass card in front.
 *
 * The card holds only what a visitor needs — whether I am looking, every way
 * to reach me, and one box to share their words. There is no name field and
 * no email field. That keeps it to a single thing to fill in, but it means the
 * note alone carries no way to answer it, so two things make up for it: the
 * box asks for a way to reply, and if the words contain an email address it
 * becomes the reply-to, so answering is one click from the inbox.
 *
 * The note goes straight to the inbox through the same form service as the
 * "Your take" tile (src/sendForm.ts). If none is configured, or the send fails,
 * it opens the visitor's own mail app with the note already written instead —
 * nothing anyone types is dropped. The draft survives closing the dialog until
 * it is sent.
 */

/** the scene behind the card — the landing page's night picture */
const SCENE = '/contact/night-library.webp'
const DRAFT_KEY = 'contact-draft'
const EMAIL = /[^\s@<>()]+@[^\s@<>()]+\.[^\s@<>()]{2,}/

function Icon({ name }: { name: 'mail' | 'phone' | 'copy' | 'check' | 'arrow' | 'out' }) {
  const common = { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  switch (name) {
    case 'mail': return <svg {...common}><rect x="2.5" y="4.5" width="19" height="15" rx="2.5" /><path d="M3 7l9 6 9-6" /></svg>
    case 'phone': return <svg {...common}><path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 006 6l1.5-2 4 1.5v3a2 2 0 01-2.2 2A16.5 16.5 0 014.5 5.7 2 2 0 016.5 3.5z" /></svg>
    case 'copy': return <svg {...common}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 012-2h9" /></svg>
    case 'check': return <svg {...common}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
    case 'arrow': return <svg {...common}><path d="M4 12h15M13 5l7 7-7 7" /></svg>
    case 'out': return <svg {...common}><path d="M7 17 17 7M8 7h9v9" /></svg>
  }
}

/**
 * What the empty box says, typing itself the way the line above the landing
 * headline does — so the dialog needs no label: the prompt is the label, and
 * it moves. It sits over the box and never takes the pointer; it goes the
 * moment there is a word in the box, and a screen reader gets the textarea's
 * own name instead. Its caret shows only while the box is not focused, so it
 * never blinks beside the real one.
 */
const PROMPTS = [
  'Say hello…',
  'Ask me anything…',
  "Tell me what you're building…",
  "Add your email if you'd like a reply.",
] as const

function Prompt({ caret }: { caret: boolean }) {
  const reduce = useReducedMotion()
  const text = useTyped(PROMPTS, { delay: 0.5, firstHold: 1500, hold: 1500, still: Boolean(reduce) })
  return (
    <span className="cdlg__prompt" aria-hidden="true">
      {text}
      {caret && !reduce && <span className="cdlg__caret" />}
    </span>
  )
}

export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion()
  const [message, setMessage] = useState('')
  const [phase, setPhase] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle')
  const [copied, setCopied] = useState<string | null>(null)
  const [focused, setFocused] = useState(false)
  const sheet = useRef<HTMLDivElement>(null)
  const field = useRef<HTMLTextAreaElement>(null)
  // a field no person can see or reach; anything typed into it was typed by a bot
  const honey = useRef<HTMLInputElement>(null)
  const returnTo = useRef<HTMLElement | null>(null)
  const live = formLive()

  // ── the draft survives the dialog closing, until it is actually sent ──
  useEffect(() => {
    if (!open) return
    try {
      const d = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null')
      if (d && typeof d.message === 'string') setMessage(d.message)
    } catch { /* a browser without storage is still a browser */ }
  }, [open])
  useEffect(() => {
    if (!open || phase === 'sent') return
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ message })) } catch { /* same */ }
  }, [open, phase, message])

  // ── closing after a send starts clean next time; closing mid-draft keeps it ──
  useEffect(() => {
    if (open || phase !== 'sent') return
    setPhase('idle')
    setMessage('')
  }, [open, phase])

  // ── open: freeze the page, remember where focus was, take it; Escape closes ──
  useEffect(() => {
    if (!open) return
    returnTo.current = document.activeElement as HTMLElement | null
    const kept = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      // Tab stays inside the sheet
      if (e.key === 'Tab' && sheet.current) {
        const focusable = sheet.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])')
        if (!focusable.length) return
        const first = focusable[0], last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    const t = window.setTimeout(() => field.current?.focus({ preventScroll: true }), reduce ? 0 : 320)
    return () => {
      document.body.style.overflow = kept
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
      returnTo.current?.focus?.()
    }
  }, [open, onClose, reduce])

  const copy = useCallback(async (key: string, value: string) => {
    const done = () => { setCopied(key); window.setTimeout(() => setCopied(null), 1600) }
    try { await navigator.clipboard.writeText(value); done(); return } catch { /* fall through */ }
    try {
      const ta = document.createElement('textarea')
      ta.value = value; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:-1000px;opacity:0'
      document.body.appendChild(ta); ta.select()
      if (document.execCommand('copy')) done()
      ta.remove()
    } catch { /* the address is on screen to read */ }
  }, [])

  const words = message.trim()
  const subject = 'Portfolio · a note from the contact dialog'
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(words)}`

  function forget() {
    try { localStorage.removeItem(DRAFT_KEY) } catch { /* fine */ }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!words || phase === 'sending') return
    if (honey.current?.value) { setPhase('sent'); return } // a bot: look done, send nothing
    if (!live) {
      window.location.href = mailto
      setPhase('sent')
      forget()
      return
    }
    setPhase('sending')
    const replyTo = words.match(EMAIL)?.[0]
    const ok = await sendForm({
      _subject: subject,
      _template: 'table',
      ...(replyTo ? { _replyto: replyTo } : {}),
      message: words,
      page: location.href,
    })
    setPhase(ok ? 'sent' : 'failed')
    if (ok) forget()
  }

  // the scene drifts a little against the pointer, like the landing page does
  function lean(e: React.PointerEvent<HTMLDivElement>) {
    if (reduce || e.pointerType !== 'mouse') return
    const el = sheet.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
    el.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
  }

  const tel = profile.phone ? profile.phone.replace(/[^+\d]/g, '') : ''
  const stagger = { rest: {}, in: { transition: { staggerChildren: reduce ? 0 : 0.06, delayChildren: reduce ? 0 : 0.14 } } }
  const rise = { rest: { opacity: 0, y: reduce ? 0 : 10 }, in: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 160, damping: 20 } } } as const

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="cdlg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="cdlg-title"
        >
          <motion.div
            className="cdlg__sheet"
            ref={sheet}
            onPointerMove={lean}
            initial={{ opacity: 0, y: reduce ? 0 : 28, scale: reduce ? 1 : 0.975 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 14, scale: reduce ? 1 : 0.985 }}
            transition={{ type: 'spring', stiffness: 150, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img className="cdlg__scene" src={SCENE} alt="" aria-hidden="true" />
            <span className="cdlg__veil" aria-hidden="true" />

            <button className="cdlg__x" onClick={onClose} aria-label="Close">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>

            <motion.div className="cdlg__glass" variants={stagger} initial="rest" animate="in">
              <motion.div variants={rise}>
                <h3 className="cdlg__h" id="cdlg-title">Contact me</h3>
                {profile.available && (
                  <p className="cdlg__status">
                    <span className="cdlg__dot" aria-hidden="true" />
                    {profile.availableNote}
                  </p>
                )}
              </motion.div>

              <motion.ul className="cdlg__links" variants={rise}>
                <li className="cdlg__link cdlg__link--wide">
                  <a className="cdlg__go" href={`mailto:${profile.email}`}>
                    <Icon name="mail" />
                    <span className="cdlg__v">{profile.email}</span>
                  </a>
                  <button className="cdlg__copy" type="button" onClick={() => copy('email', profile.email)} aria-label="Copy email address">
                    {copied === 'email' ? <Icon name="check" /> : <Icon name="copy" />}
                  </button>
                </li>
                {profile.phone && (
                  <li className="cdlg__link cdlg__link--wide">
                    <a className="cdlg__go" href={`tel:${tel}`}>
                      <Icon name="phone" />
                      <span className="cdlg__v">{profile.phone}</span>
                    </a>
                    <button className="cdlg__copy" type="button" onClick={() => copy('phone', profile.phone)} aria-label="Copy phone number">
                      {copied === 'phone' ? <Icon name="check" /> : <Icon name="copy" />}
                    </button>
                  </li>
                )}
                {aboutLinks.map((l) => (
                  <li className="cdlg__link" key={l.label}>
                    <a className="cdlg__go" href={l.href} target="_blank" rel="noreferrer">
                      <span className="cdlg__mark" aria-hidden="true">
                        {l.mark ? <svg viewBox="0 0 24 24" width="14" height="14"><path d={marks[l.mark]} fill="currentColor" /></svg> : <b>{l.mono}</b>}
                      </span>
                      <span className="cdlg__v">{l.label}</span>
                      <span className="cdlg__out"><Icon name="out" /></span>
                    </a>
                  </li>
                ))}
              </motion.ul>

              <motion.div variants={rise}>
                {phase === 'sent' ? (
                  <motion.div
                    className="cdlg__done"
                    initial={{ opacity: 0, y: reduce ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 170, damping: 20 }}
                  >
                    <span className="cdlg__tick" aria-hidden="true"><Icon name="check" /></span>
                    <div>
                      <p className="cdlg__done-h">{live ? 'Thank you — it is in my inbox.' : 'Your mail app has it, ready to send.'}</p>
                      <p className="cdlg__done-p">I read every one.</p>
                    </div>
                    <button className="cdlg__again" type="button" onClick={() => { setPhase('idle'); setMessage(''); window.setTimeout(() => field.current?.focus(), 40) }}>
                      Write another
                    </button>
                  </motion.div>
                ) : (
                  <form className="cdlg__form" onSubmit={submit}>
                    <div className="cdlg__field">
                      <textarea
                        id="cdlg-words"
                        ref={field}
                        className="cdlg__area"
                        value={message}
                        onChange={(e) => { setMessage(e.target.value); if (phase === 'failed') setPhase('idle') }}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        rows={4}
                        maxLength={3000}
                        aria-label="Your message. Say hello, ask anything, or tell me what you're building. Add your email if you'd like a reply."
                      />
                      {!message && <Prompt caret={!focused} />}
                    </div>
                    <input ref={honey} className="cdlg__honey" type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" />
                    <div className="cdlg__row">
                      <p className="cdlg__fine">{live ? 'Goes straight to my inbox.' : 'Opens your mail app, written.'}</p>
                      <button className="cdlg__send" type="submit" disabled={!words || phase === 'sending'}>
                        <span>{phase === 'sending' ? 'Sending…' : 'Send'}</span>
                        <Icon name="arrow" />
                      </button>
                    </div>
                    {phase === 'failed' && (
                      <p className="cdlg__err" role="alert">
                        That did not go through. <a href={mailto}>Send it from your mail app</a> instead.
                      </p>
                    )}
                  </form>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
