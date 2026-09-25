import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { feedback, profile } from '../data'
import { closeProject } from '../router'
import ContactModal from './ContactModal'
import Words from './Words'

/**
 * The end of a case study: two things, side by side.
 *
 * On the left, the invitation that was always here — talk to me, or go back
 * to the rest of the work. "Get in touch" opens the contact dialog now rather
 * than a bare mailto: the project page replaces the home page, so the dialog
 * the nav opens is not mounted here, and a visitor this far down deserves the
 * nicer form, not their mail client springing open.
 *
 * On the right, the one question worth asking someone who read to the end:
 * did it land? Two buttons, then an optional line of why. It is private by
 * design — a public tally of dislikes on a portfolio helps nobody, and a wall
 * of comments invites the kind nobody wants a recruiter to read. Each answer
 * goes to `feedback.endpoint` when one is set (any form service that takes a
 * JSON POST), and falls back to the visitor's own email app when it is not,
 * so a written note is never silently dropped.
 *
 * A visitor's own answer is remembered on their device, so coming back shows
 * what they said instead of asking again.
 */

type Reaction = 'like' | 'dislike'
type Saved = { reaction: Reaction; sent?: boolean }

const keyFor = (slug: string) => `portfolio.feedback.${slug}`

function recall(slug: string): Saved | null {
  try {
    const raw = localStorage.getItem(keyFor(slug))
    return raw ? (JSON.parse(raw) as Saved) : null
  } catch {
    return null
  }
}
function remember(slug: string, value: Saved | null) {
  try {
    if (value) localStorage.setItem(keyFor(slug), JSON.stringify(value))
    else localStorage.removeItem(keyFor(slug))
  } catch {
    /* private window or blocked storage: the answer simply is not remembered */
  }
}

/** one POST to whatever form service is configured; false when none is, or it fails */
async function send(payload: Record<string, string>): Promise<boolean> {
  if (!feedback.endpoint) return false
  try {
    const body = feedback.accessKey ? { access_key: feedback.accessKey, ...payload } : payload
    const res = await fetch(feedback.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(body),
    })
    return res.ok
  } catch {
    return false
  }
}

const COPY = {
  like: {
    label: 'Liked it',
    placeholder: 'What worked for you? A line is plenty.',
    thanks: 'Glad it landed.',
  },
  dislike: {
    label: 'Not for me',
    placeholder: 'What was missing, or what would you change?',
    thanks: 'Thank you — that is the useful kind.',
  },
} as const

function Thumb({ down }: { down?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={down ? { transform: 'rotate(180deg)' } : undefined}>
      <path d="M7 10v11" />
      <path d="M15 5.9 14 10h5.8a2 2 0 0 1 1.9 2.6l-2.3 8a2 2 0 0 1-1.9 1.4H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.8a2 2 0 0 0 1.8-1.1L12 2a3.1 3.1 0 0 1 3 3.9Z" />
    </svg>
  )
}

function Arrow({ back }: { back?: boolean }) {
  return (
    <svg className="cend__arrow" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {back ? <path d="M13 8H3m4-4L3 8l4 4" /> : <path d="M3 8h10m-4-4 4 4-4 4" />}
    </svg>
  )
}

export default function CaseEnd({ slug, title }: { slug: string; title: string }) {
  const reduce = useReducedMotion()
  const cardRef = useRef<HTMLElement>(null)
  const [contact, setContact] = useState(false)

  const [reaction, setReaction] = useState<Reaction | null>(null)
  const [note, setNote] = useState('')
  const [who, setWho] = useState('')
  const [phase, setPhase] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle')
  const noteRef = useRef<HTMLTextAreaElement>(null)

  // coming back to a project you already answered for shows the answer
  useEffect(() => {
    const saved = recall(slug)
    if (!saved) return
    setReaction(saved.reaction)
    if (saved.sent) setPhase('sent')
  }, [slug])

  const live = Boolean(feedback.endpoint)

  function pick(next: Reaction) {
    // the same button again takes the answer back
    if (next === reaction && phase !== 'sent') {
      setReaction(null)
      remember(slug, null)
      return
    }
    setReaction(next)
    setPhase('idle')
    remember(slug, { reaction: next })
    // a bare thumbs is still worth knowing, so it goes on its own
    void send({ project: title, reaction: next, page: location.href })
    // hand the cursor to the note, without yanking the page to it
    window.setTimeout(() => noteRef.current?.focus({ preventScroll: true }), 60)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!reaction || !note.trim()) return
    if (!live) {
      // no form service configured: the note goes through the visitor's own mail
      const verdict = reaction === 'like' ? 'liked it' : 'not for me'
      const body = `${note.trim()}${who.trim() ? `\n\n— ${who.trim()}` : ''}`
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(`${title} — ${verdict}`)}&body=${encodeURIComponent(body)}`
      setPhase('sent')
      remember(slug, { reaction, sent: true })
      return
    }
    setPhase('sending')
    const ok = await send({ project: title, reaction, message: note.trim(), from: who.trim(), page: location.href })
    setPhase(ok ? 'sent' : 'failed')
    if (ok) remember(slug, { reaction, sent: true })
  }

  function reset() {
    setReaction(null)
    setNote('')
    setWho('')
    setPhase('idle')
    remember(slug, null)
  }

  // a soft light that follows the pointer across the card
  function onMove(e: React.PointerEvent<HTMLElement>) {
    const el = cardRef.current
    if (!el || reduce) return
    const b = el.getBoundingClientRect()
    el.style.setProperty('--sx', `${e.clientX - b.left}px`)
    el.style.setProperty('--sy', `${e.clientY - b.top}px`)
  }

  return (
    <>
      <motion.section
        ref={cardRef}
        className="cend"
        aria-label="End of the case study"
        onPointerMove={onMove}
        initial={{ opacity: 0, y: 26 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="cend__talk">
          <span className="cend__eyebrow">
            <span className="cend__dot" aria-hidden="true" />
            That's the case study
          </span>
          <h2 className="cend__h">
            <Words text="Want the full story?" />
          </h2>
          <p className="cend__p">
            <Words text="Happy to walk through the decisions, the dead ends and what I'd change." />
          </p>
          <div className="cend__actions">
            <button className="btn btn--primary cend__cta" onClick={() => setContact(true)}>
              Get in touch
              <Arrow />
            </button>
            <button className="btn btn--ghost cend__back" onClick={closeProject}>
              <Arrow back />
              Back to all work
            </button>
          </div>
        </div>

        <div className="cend__vote" aria-live="polite">
          {phase === 'sent' && reaction ? (
            <motion.div
              className="cend__thanks"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={`cend__badge cend__badge--${reaction}`} aria-hidden="true">
                <Thumb down={reaction === 'dislike'} />
              </span>
              <div>
                <p className="cend__q">{COPY[reaction].thanks}</p>
                <p className="cend__qsub">
                  {live ? 'Your note is with me. I read every one.' : 'Your email app has the note, ready to send.'}
                </p>
              </div>
              <button className="cend__change" onClick={reset}>
                Change my answer
              </button>
            </motion.div>
          ) : (
            <>
              <div>
                <p className="cend__q">How did this one land?</p>
                <p className="cend__qsub">One click is enough. A line of why is even better.</p>
              </div>

              <div className="cend__pick" role="group" aria-label="Your reaction to this case study">
                {(['like', 'dislike'] as const).map((r) => {
                  const on = reaction === r
                  return (
                    <button
                      key={r}
                      type="button"
                      className={`react react--${r}`}
                      aria-pressed={on}
                      onClick={() => pick(r)}
                    >
                      <span className="react__icon">
                        {/* re-keyed when switched on, so the pop replays every time */}
                        <motion.span
                          key={on ? 'on' : 'off'}
                          style={{ display: 'inline-flex' }}
                          initial={on && !reduce ? { scale: 0.55, rotate: r === 'like' ? -14 : 14 } : false}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 560, damping: 13 }}
                        >
                          <Thumb down={r === 'dislike'} />
                        </motion.span>
                        {on && !reduce && (
                          <motion.span
                            className="react__ring"
                            initial={{ scale: 0.6, opacity: 0.55 }}
                            animate={{ scale: 1.9, opacity: 0 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            aria-hidden="true"
                          />
                        )}
                      </span>
                      {COPY[r].label}
                    </button>
                  )
                })}
              </div>

              {reaction && (
                <motion.form
                  className="cend__note"
                  onSubmit={submit}
                  initial={reduce ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <label className="cend__field">
                    <span className="sr-only">Your note</span>
                    <textarea
                      ref={noteRef}
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder={COPY[reaction].placeholder}
                      rows={3}
                      maxLength={1200}
                    />
                  </label>
                  <label className="cend__field">
                    <span className="sr-only">Your name or role, optional</span>
                    <input value={who} onChange={(e) => setWho(e.target.value)} placeholder="Your name or role — optional" autoComplete="name" maxLength={120} />
                  </label>
                  <div className="cend__row">
                    <p className="cend__fine">
                      {live ? 'Goes to me only — nothing here is published.' : 'Opens your email with the note filled in. Nothing is published.'}
                    </p>
                    <button className="btn btn--primary cend__send" type="submit" disabled={!note.trim() || phase === 'sending'}>
                      {phase === 'sending' ? 'Sending…' : 'Send note'}
                    </button>
                  </div>
                  {phase === 'failed' && (
                    <p className="cend__err" role="alert">
                      That did not go through.{' '}
                      <a href={`mailto:${profile.email}?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(note)}`}>Email it instead</a>
                    </p>
                  )}
                </motion.form>
              )}
            </>
          )}
        </div>
      </motion.section>

      <ContactModal open={contact} onClose={() => setContact(false)} />
    </>
  )
}
