import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { aboutLinks, profile } from '../data'
import { marks } from '../logos'

/**
 * Writing to me, in a dialog.
 *
 * Two panels. The left is the person: whether I am looking, what time it is
 * where I am, and every way to reach me, each one copyable. The right is the
 * message: say what it is about, then who you are, then the message itself.
 *
 * Sending is a real mailto: link built from what you typed. It opens your own
 * mail app, so the reply lands with you. Because that can fail quietly on a
 * desktop with no mail app set up, the dialog then offers the whole message
 * to copy — nothing you wrote is ever lost, and the draft survives closing
 * the dialog until it is sent.
 */

const INTENTS = [
  { id: 'role', label: 'A role', hint: 'Tell me about the team, and the problem it spends its days on.' },
  { id: 'project', label: 'A project', hint: 'What are you building, and where does it hurt right now?' },
  { id: 'hello', label: 'Just hello', hint: 'Anything at all. I read everything.' },
] as const
type Intent = (typeof INTENTS)[number]['id']

const DRAFT_KEY = 'contact-draft'
const TIMEZONE = 'Asia/Kolkata'

/** the clock where I am, ticking on the half minute */
function useLocalTime() {
  const read = () =>
    new Intl.DateTimeFormat('en-GB', { timeZone: TIMEZONE, hour: 'numeric', minute: '2-digit', hour12: true })
      .format(new Date())
      .replace(/\s?(am|pm)/i, (m) => m.trim().toLowerCase())
  const [time, setTime] = useState(read)
  useEffect(() => {
    const id = window.setInterval(() => setTime(read()), 30_000)
    return () => window.clearInterval(id)
  }, [])
  return time
}

function Icon({ name }: { name: 'mail' | 'phone' | 'copy' | 'check' | 'arrow' | 'edit' }) {
  const common = { width: 15, height: 15, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.9, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true }
  switch (name) {
    case 'mail': return <svg {...common}><rect x="2.5" y="4.5" width="19" height="15" rx="2.5" /><path d="M3 7l9 6 9-6" /></svg>
    case 'phone': return <svg {...common}><path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 006 6l1.5-2 4 1.5v3a2 2 0 01-2.2 2A16.5 16.5 0 014.5 5.7 2 2 0 016.5 3.5z" /></svg>
    case 'copy': return <svg {...common}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 012-2h9" /></svg>
    case 'check': return <svg {...common}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
    case 'arrow': return <svg {...common}><path d="M4 12h15M13 5l7 7-7 7" /></svg>
    case 'edit': return <svg {...common}><path d="M4 20h4l10.5-10.5a2.1 2.1 0 00-3-3L5 17v3z" /></svg>
  }
}

export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion()
  const [intent, setIntent] = useState<Intent>('project')
  const [name, setName] = useState('')
  const [from, setFrom] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)
  const sheet = useRef<HTMLDivElement>(null)
  const firstField = useRef<HTMLInputElement>(null)
  const returnTo = useRef<HTMLElement | null>(null)
  const time = useLocalTime()

  // ── the draft survives the dialog closing, until it is actually sent ──
  useEffect(() => {
    if (!open) return
    try {
      const d = JSON.parse(localStorage.getItem(DRAFT_KEY) ?? 'null')
      if (d && typeof d === 'object') {
        if (typeof d.name === 'string') setName(d.name)
        if (typeof d.from === 'string') setFrom(d.from)
        if (typeof d.message === 'string') setMessage(d.message)
        if (INTENTS.some((i) => i.id === d.intent)) setIntent(d.intent)
      }
    } catch { /* a browser without storage is still a browser */ }
  }, [open])
  useEffect(() => {
    if (!open || sent) return
    try { localStorage.setItem(DRAFT_KEY, JSON.stringify({ name, from, message, intent })) } catch { /* same */ }
  }, [open, sent, name, from, message, intent])

  // ── closing after a send starts clean next time; closing mid-draft keeps it ──
  useEffect(() => {
    if (open || !sent) return
    setSent(false)
    setName('')
    setFrom('')
    setMessage('')
  }, [open, sent])

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
        const focusable = sheet.current.querySelectorAll<HTMLElement>('a[href], button, input, textarea, [tabindex]:not([tabindex="-1"])')
        if (!focusable.length) return
        const first = focusable[0], last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    const t = window.setTimeout(() => firstField.current?.focus(), reduce ? 0 : 320)
    return () => {
      document.body.style.overflow = kept
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
      returnTo.current?.focus?.()
    }
  }, [open, onClose, reduce])

  const current = INTENTS.find((i) => i.id === intent) ?? INTENTS[1]
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(from.trim())
  const ready = name.trim().length > 0 && emailOk && message.trim().length > 1

  const subject = `Portfolio · ${current.label} — ${name.trim() || 'hello'}`
  const body = `${message.trim()}\n\n— ${name.trim()}\n${from.trim()}`
  const href = `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  const whole = useMemo(() => `To: ${profile.email}\nSubject: ${subject}\n\n${body}`, [subject, body])

  const copy = useCallback(async (key: string, value: string) => {
    const done = () => { setCopied(key); window.setTimeout(() => setCopied(null), 1600) }
    try { await navigator.clipboard.writeText(value); done(); return } catch { /* fall through */ }
    try {
      const ta = document.createElement('textarea')
      ta.value = value; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:-1000px;opacity:0'
      document.body.appendChild(ta); ta.select()
      if (document.execCommand('copy')) done()
      ta.remove()
    } catch { /* the text is on screen to read */ }
  }, [])

  function send() {
    // the link does the opening; this only records that it happened and
    // lets the draft go
    setSent(true)
    try { localStorage.removeItem(DRAFT_KEY) } catch { /* fine */ }
  }
  function again() { setSent(false); window.setTimeout(() => firstField.current?.focus(), 50) }

  const city = profile.location.split(',')[0].trim()
  const tel = profile.phone ? profile.phone.replace(/[^+\d]/g, '') : ''

  const stagger = { rest: {}, in: { transition: { staggerChildren: reduce ? 0 : 0.055, delayChildren: reduce ? 0 : 0.12 } } }
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
            initial={{ opacity: 0, y: reduce ? 0 : 28, scale: reduce ? 1 : 0.975 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 14, scale: reduce ? 1 : 0.985 }}
            transition={{ type: 'spring', stiffness: 150, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="cdlg__x" onClick={onClose} aria-label="Close">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>

            {/* ── the person ─────────────────────────────────── */}
            <motion.aside className="cdlg__side" variants={stagger} initial="rest" animate="in">
              <img className="cdlg__art" src="/bento/contact.jpg" alt="" aria-hidden="true" />
              <span className="cdlg__wash" aria-hidden="true" />

              <div className="cdlg__top">
                <motion.span className="cdlg__kick" variants={rise}>Say hello</motion.span>
                <motion.h3 className="cdlg__h" id="cdlg-title" variants={rise}>
                  Tell me what you’re building.
                </motion.h3>
              </div>

              <div className="cdlg__facts">
                {profile.available && (
                  <motion.p className="cdlg__status" variants={rise}>
                    <span className="cdlg__dot" aria-hidden="true" />
                    {profile.availableNote}
                  </motion.p>
                )}
                <motion.p className="cdlg__time" variants={rise}>
                  <span>{city}</span>
                  <span className="cdlg__sep" aria-hidden="true">·</span>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.span key={time} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.25 }}>
                      {time}
                    </motion.span>
                  </AnimatePresence>
                  <span className="cdlg__muted"> local</span>
                </motion.p>

                <motion.ul className="cdlg__ways" variants={rise}>
                  <li className="way">
                    <a className="way__go" href={`mailto:${profile.email}`}>
                      <span className="way__ic"><Icon name="mail" /></span>
                      <span className="way__v">{profile.email}</span>
                    </a>
                    <button className="way__copy" type="button" onClick={() => copy('email', profile.email)} aria-label="Copy email address">
                      {copied === 'email' ? <Icon name="check" /> : <Icon name="copy" />}
                    </button>
                  </li>
                  {profile.phone && (
                    <li className="way">
                      <a className="way__go" href={`tel:${tel}`}>
                        <span className="way__ic"><Icon name="phone" /></span>
                        <span className="way__v">{profile.phone}</span>
                      </a>
                      <button className="way__copy" type="button" onClick={() => copy('phone', profile.phone)} aria-label="Copy phone number">
                        {copied === 'phone' ? <Icon name="check" /> : <Icon name="copy" />}
                      </button>
                    </li>
                  )}
                  {aboutLinks.map((l) => (
                    <li className="way" key={l.label}>
                      <a className="way__go" href={l.href} target="_blank" rel="noreferrer">
                        <span className="way__ic" aria-hidden="true">
                          {l.mark ? <svg viewBox="0 0 24 24" width="15" height="15"><path d={marks[l.mark]} fill="currentColor" /></svg> : <b>{l.mono}</b>}
                        </span>
                        <span className="way__v">{l.label}<span className="cdlg__muted"> · {l.handle}</span></span>
                      </a>
                    </li>
                  ))}
                </motion.ul>
              </div>
            </motion.aside>

            {/* ── the message ────────────────────────────────── */}
            <div className="cdlg__main">
              <AnimatePresence mode="wait" initial={false}>
                {!sent ? (
                  <motion.form
                    key="write"
                    className="cdlg__form"
                    variants={stagger}
                    initial="rest"
                    animate="in"
                    exit={{ opacity: 0, y: reduce ? 0 : -8, transition: { duration: 0.18 } }}
                    onSubmit={(e) => { e.preventDefault() }}
                  >
                    <motion.div className="intent" role="radiogroup" aria-label="What is this about" variants={rise}>
                      {INTENTS.map((i) => (
                        <button
                          key={i.id}
                          type="button"
                          role="radio"
                          aria-checked={intent === i.id}
                          className={intent === i.id ? 'intent__opt intent__opt--on' : 'intent__opt'}
                          onClick={() => setIntent(i.id)}
                        >
                          {intent === i.id && (
                            <motion.span className="intent__pill" layoutId="intent-pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} aria-hidden="true" />
                          )}
                          <span className="intent__txt">{i.label}</span>
                        </button>
                      ))}
                    </motion.div>

                    <motion.div className="cdlg__row" variants={rise}>
                      <label className={name ? 'ff ff--filled' : 'ff'}>
                        <input ref={firstField} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder=" " />
                        <span className="ff__label">Your name</span>
                      </label>
                      <label className={from ? (emailOk ? 'ff ff--filled' : 'ff ff--filled ff--off') : 'ff'}>
                        <input value={from} onChange={(e) => setFrom(e.target.value)} type="email" inputMode="email" autoComplete="email" placeholder=" " />
                        <span className="ff__label">Your email</span>
                        {from && !emailOk && <span className="ff__hint">Needs an @ and a dot</span>}
                      </label>
                    </motion.div>

                    <motion.label className={message ? 'ff ff--area ff--filled' : 'ff ff--area'} variants={rise}>
                      <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={6} placeholder=" " />
                      <span className="ff__label">Message</span>
                      <AnimatePresence mode="wait" initial={false}>
                        {!message && (
                          <motion.span className="ff__ghost" key={current.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }} aria-hidden="true">
                            {current.hint}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </motion.label>

                    <motion.div className="cdlg__foot" variants={rise}>
                      <a
                        className={ready ? 'cdlg__send' : 'cdlg__send cdlg__send--wait'}
                        href={ready ? href : undefined}
                        aria-disabled={!ready}
                        onClick={(e) => {
                          if (!ready) {
                            e.preventDefault()
                            sheet.current?.querySelector<HTMLElement>('.ff:not(.ff--filled) input, .ff:not(.ff--filled) textarea, .ff--off input')?.focus()
                            return
                          }
                          send()
                        }}
                      >
                        <span>{ready ? 'Send it' : 'Send it'}</span>
                        <Icon name="arrow" />
                      </a>
                      <span className="cdlg__note">
                        {ready ? 'Opens in your mail app, addressed and written.' : 'Name, a real email, and a line or two.'}
                      </span>
                    </motion.div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="sent"
                    className="cdlg__done"
                    initial={{ opacity: 0, y: reduce ? 0 : 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 160, damping: 20 }}
                  >
                    <motion.span className="cdlg__tick" initial={{ scale: reduce ? 1 : 0.6, rotate: reduce ? 0 : -20 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.1 }} aria-hidden="true">
                      <Icon name="check" />
                    </motion.span>
                    <h4>Your mail app should be open.</h4>
                    <p>The message is in it, addressed to me, with your name on the end. If nothing opened, take the whole thing and paste it anywhere you like.</p>
                    <pre className="cdlg__pre">{whole}</pre>
                    <div className="cdlg__done-actions">
                      <button className="cdlg__send" type="button" onClick={() => copy('whole', whole)}>
                        {copied === 'whole' ? <Icon name="check" /> : <Icon name="copy" />}
                        <span>{copied === 'whole' ? 'Copied' : 'Copy the message'}</span>
                      </button>
                      <button className="cdlg__ghostbtn" type="button" onClick={again}>
                        <Icon name="edit" /><span>Edit it</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
