import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { aboutLinks, profile } from '../data'
import { marks } from '../logos'

/**
 * Writing to me, in a dialog.
 *
 * The send button is a real mailto link rather than a submitted form: it is
 * built from what you type and opens your own mail app, so the message arrives
 * from your address and lands in mine. Until there is a server to post to, a
 * link is the honest version of this — and it can be copied, dragged, or
 * opened in a new tab like any other.
 */
export default function ContactModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [name, setName] = useState('')
  const [from, setFrom] = useState('')
  const [message, setMessage] = useState('')
  const [copied, setCopied] = useState<'email' | 'phone' | null>(null)
  const firstField = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  // the picture leans towards the pointer — a little life, no layout cost
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  // the banner pans a little against the pointer — the image is scaled past
  // its frame so there is something to pan into, and nothing ever shows an edge
  const ax = useSpring(useTransform(px, [-0.5, 0.5], [14, -14]), { stiffness: 110, damping: 20 })
  const ay = useSpring(useTransform(py, [-0.5, 0.5], [10, -10]), { stiffness: 110, damping: 20 })

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    const kept = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    const t = window.setTimeout(() => firstField.current?.focus(), 260)
    return () => {
      document.body.style.overflow = kept
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
    }
  }, [open, onClose])

  const ready = name.trim() !== '' && from.trim() !== '' && message.trim() !== ''
  const href =
    `mailto:${profile.email}` +
    `?subject=${encodeURIComponent(`Portfolio — ${name.trim() || 'hello'}`)}` +
    `&body=${encodeURIComponent(`${message}\n\n— ${name} (${from})`)}`

  /**
   * Copy any of the contact rows; the row that was copied says so itself.
   *
   * The async clipboard API is refused outright in plenty of places — an
   * insecure origin, an embedded frame, a browser with the permission off —
   * and a copy button that silently does nothing is worse than no button.
   * So it falls back to the old execCommand path, and only gives up if that
   * fails too.
   */
  async function copy(what: 'email' | 'phone', value: string) {
    const done = () => {
      setCopied(what)
      window.setTimeout(() => setCopied(null), 1600)
    }
    try {
      await navigator.clipboard.writeText(value)
      done()
      return
    } catch {
      /* fall through to the older way */
    }
    try {
      const ta = document.createElement('textarea')
      ta.value = value
      ta.setAttribute('readonly', '')
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0'
      document.body.appendChild(ta)
      ta.select()
      const ok = document.execCommand('copy')
      ta.remove()
      if (ok) done()
    } catch {
      /* genuinely cannot copy — the address is on screen to read */
    }
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="cmod"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Write to me"
        >
          <motion.div
            className="cmod__box"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 130, damping: 18 }}
            onClick={(e) => e.stopPropagation()}
            onPointerMove={(e) => {
              const r = e.currentTarget.getBoundingClientRect()
              px.set((e.clientX - r.left) / r.width - 0.5)
              py.set((e.clientY - r.top) / r.height - 0.5)
            }}
            onPointerLeave={() => { px.set(0); py.set(0) }}
          >
            <button className="cmod__x" onClick={onClose} aria-label="Close">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>

            {/* the picture across the top, fading into the form under it */}
            <div className="cmod__banner">
              <motion.img className="cmod__art" src="/bento/contact.jpg" alt="" style={{ x: ax, y: ay, scale: 1.06 }} aria-hidden="true" />
              <span className="cmod__wash" aria-hidden="true" />
              <span className="cmod__fade" aria-hidden="true" />
              <div className="cmod__pitch">
                <span className="cmod__kick">Say hello</span>
                <h3>I read everything.</h3>
                <p>A line about what you are building is enough.</p>
              </div>
            </div>

            {/* right: the message itself */}
            <div className="cmod__form" ref={formRef}>
              <label className="cfield">
                <span>Your name</span>
                <input ref={firstField} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Karthikeyan" />
              </label>
              <label className="cfield">
                <span>Your email</span>
                <input value={from} onChange={(e) => setFrom(e.target.value)} type="email" autoComplete="email" placeholder="you@studio.com" />
              </label>
              <label className="cfield cfield--grow">
                <span>Message</span>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="What are you building?" rows={5} />
              </label>

              {/* always the primary button. Pressing it before the fields are
                  filled does not do nothing — it focuses the first empty one,
                  which is the answer to 'why is this not working'. */}
              <a
                className="cbtn"
                href={ready ? href : undefined}
                aria-disabled={!ready}
                onClick={(e) => {
                  if (ready) return
                  e.preventDefault()
                  const empty = formRef.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>(
                    'input:placeholder-shown, textarea:placeholder-shown',
                  )
                  empty?.focus()
                }}
              >
                Send it
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 12h15M13 5l7 7-7 7" />
                </svg>
              </a>

              {/* the other ways, under the button that is the main one */}
              <div className="cmod__ways">
                <span className="cmod__ways-k">or reach me at</span>
                <ul className="cmod__links">
                  {aboutLinks.map((l) => (
                    <li key={l.label}>
                      <a href={l.href} target="_blank" rel="noreferrer" title={l.handle}>
                        <span className="cmod__mark" aria-hidden="true">
                          {l.mark ? <svg viewBox="0 0 24 24"><path d={marks[l.mark]} /></svg> : <b>{l.mono}</b>}
                        </span>
                        {l.label}
                      </a>
                    </li>
                  ))}
                  {/* the two direct ways, wearing the same chip as the profiles */}
                  <li>
                    <a href={`mailto:${profile.email}`} target="_blank" rel="noreferrer" title={profile.email}>
                      <span className="cmod__mark" aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
                          <path d="M3 7l9 6 9-6" />
                        </svg>
                      </span>
                      Email
                    </a>
                  </li>
                  {profile.phone && (
                    <li>
                      {/* tel: raises the dialler on a phone; on a desktop where
                          it raises nothing, the click has still copied it */}
                      <a
                        href={`tel:${profile.phone.replace(/[^+\d]/g, '')}`}
                        title={profile.phone}
                        onClick={() => copy('phone', profile.phone)}
                      >
                        <span className="cmod__mark" aria-hidden="true">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 006 6l1.5-2 4 1.5v3a2 2 0 01-2.2 2A16.5 16.5 0 014.5 5.7 2 2 0 016.5 3.5z" />
                          </svg>
                        </span>
                        {copied === 'phone' ? 'Copied' : 'Phone'}
                      </a>
                    </li>
                  )}
                </ul>
              </div>

              {/* the number, only once there is one to put here */}
              {profile.phone && (
                <ul className="reach">
                  <li className="reach__row">
                    <a className="reach__to" href={`tel:${profile.phone.replace(/[^+\d]/g, '')}`}>
                      <span className="reach__k">Phone</span>
                      <span className="reach__v">{profile.phone}</span>
                    </a>
                    <button className="reach__copy" type="button" onClick={() => copy('phone', profile.phone)} aria-label="Copy phone number">
                      {copied === 'phone' ? 'Copied' : 'Copy'}
                    </button>
                  </li>
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
