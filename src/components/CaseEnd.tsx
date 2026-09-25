import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { feedback, profile, projects } from '../data'
import { closeProject, openProject } from '../router'
import ContactModal from './ContactModal'
import Words from './Words'

/**
 * The end of a case study, as a bento — somewhere to go next, and a way to
 * say how this one landed.
 *
 *   ┌──────────┬───────────────┬──────────┐
 *   │          │  keep going   │  12+     │
 *   │ up next  │  (a project)  │  more    │
 *   │ (a       ├───────────────┼──────────┤
 *   │ project) │  your take    │ contact  │
 *   └──────────┴───────────────┴──────────┘
 *
 * The two project tiles are the next two on the home grid after this one,
 * wrapping round, so every case study hands on to a different pair and
 * reading them in order visits them all.
 *
 * "Your take" is private by design. A public tally of dislikes on a
 * portfolio helps nobody, and an open comment wall invites the kind nobody
 * wants a recruiter to read first. Each answer goes to `feedback.endpoint`
 * when one is set (any form service that takes a JSON POST), and a written
 * note falls back to the visitor's own email app when it is not, so nothing
 * anyone takes the time to write is silently dropped.
 */

type Reaction = 'like' | 'dislike'
type Saved = { reaction: Reaction | null; sent?: boolean }

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
    if (!res.ok) return false
    // A service can answer 200 and still say no — FormSubmit does exactly that
    // before its one-time activation — so the body has the last word.
    const data = (await res.json().catch(() => null)) as { success?: boolean | string } | null
    return !(data && (data.success === false || data.success === 'false'))
  } catch {
    return false
  }
}

/** the next two on the home grid after this project, wrapping round */
function neighbours(slug: string) {
  const ring = projects
    .filter((p) => p.featured)
    .sort((a, b) => (a.featured ?? 0) - (b.featured ?? 0))
  const i = ring.findIndex((p) => p.slug === slug)
  const after = i < 0 ? ring : [...ring.slice(i + 1), ...ring.slice(0, i)]
  return after.slice(0, 2)
}

const COPY = {
  like: {
    label: 'Liked it',
    placeholder: 'What worked for you? Optional.',
    thanks: 'Glad it landed.',
    subject: 'liked it',
  },
  dislike: {
    label: 'Not for me',
    placeholder: 'What was missing, or what would you change? Optional.',
    thanks: 'Thank you — that is the useful kind.',
    subject: 'not for me',
  },
  none: {
    placeholder: 'Share your thoughts about this project. Optional.',
    thanks: 'Thank you — it is with me.',
    subject: 'a thought',
  },
} as const

/* ── small marks ─────────────────────────────────────────────────────────── */

/** the little sun either side of a tile's label */
function Sun() {
  return (
    <svg className="cend__sun" viewBox="0 0 16 16" width="11" height="11" aria-hidden="true">
      <circle cx="8" cy="8" r="2.3" fill="currentColor" />
      <path
        d="M8 1.2v2.4M8 12.4v2.4M1.2 8h2.4M12.4 8h2.4M3.2 3.2l1.7 1.7M11.1 11.1l1.7 1.7M12.8 3.2l-1.7 1.7M4.9 11.1l-1.7 1.7"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Thumb({ down }: { down?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={down ? { transform: 'rotate(180deg)' } : undefined}>
      <path d="M7 10v11" />
      <path d="M15 5.9 14 10h5.8a2 2 0 0 1 1.9 2.6l-2.3 8a2 2 0 0 1-1.9 1.4H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.8a2 2 0 0 0 1.8-1.1L12 2a3.1 3.1 0 0 1 3 3.9Z" />
    </svg>
  )
}

function ArrowOut({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  )
}

/** a soft light that follows the pointer across a tile */
function spot(e: React.PointerEvent<HTMLElement>) {
  const el = e.currentTarget
  const b = el.getBoundingClientRect()
  el.style.setProperty('--sx', `${e.clientX - b.left}px`)
  el.style.setProperty('--sy', `${e.clientY - b.top}px`)
}

/** each tile rises in on its own beat */
function rise(i: number, reduce: boolean | null) {
  return {
    initial: reduce ? false : ({ opacity: 0, y: 22 } as const),
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { delay: i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }
}

/* ── the tiles ───────────────────────────────────────────────────────────── */

function ProjectTile({ slug, label, area, i }: { slug: string; label: string; area: 'next' | 'other'; i: number }) {
  const reduce = useReducedMotion()
  const p = projects.find((x) => x.slug === slug)
  if (!p) return null
  return (
    <motion.button
      type="button"
      className={`ctile ctile--shot ctile--${area}`}
      onClick={() => openProject(p.slug)}
      aria-label={`${label}: ${p.title} — ${p.tagline}`}
      {...rise(i, reduce)}
    >
      {p.cover && <img className="ctile__img" src={p.cover} alt="" loading="lazy" decoding="async" />}
      <span className="ctile__veil" aria-hidden="true" />
      <span className="cend__eye cend__eye--center">
        <Sun />
        {label}
        <Sun />
      </span>
      <span className="ctile__open" aria-hidden="true">
        <ArrowOut size={15} />
      </span>
      <span className="ctile__foot">
        <span className="ctile__year">{p.year}</span>
        <span className="ctile__title">{p.title}</span>
        <span className="ctile__tag">{p.tagline}</span>
      </span>
    </motion.button>
  )
}

function MoreTile({ count, i }: { count: number; i: number }) {
  const reduce = useReducedMotion()
  return (
    <motion.button type="button" className="ctile ctile--more" onClick={closeProject} aria-label={`${count} more projects — back to all work`} {...rise(i, reduce)}>
      <span className="ctile__beam" aria-hidden="true" />
      <span className="ctile__bokeh" aria-hidden="true" />
      <span className="ctile__num">
        {count}
        <span className="ctile__plus">+</span>
      </span>
      <span className="ctile__numsub">
        more projects
        <span className="ctile__back">
          Back to all work <ArrowOut size={13} />
        </span>
      </span>
    </motion.button>
  )
}

function ReachTile({ onOpen, i }: { onOpen: () => void; i: number }) {
  const reduce = useReducedMotion()
  const [copied, setCopied] = useState(false)

  async function copy(e: React.MouseEvent) {
    // the email copies; everywhere else on the tile opens the dialog
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(profile.email)
    } catch {
      const t = document.createElement('textarea')
      t.value = profile.email
      document.body.appendChild(t)
      t.select()
      document.execCommand('copy')
      t.remove()
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <motion.div className="ctile ctile--reach ctile--glass" onPointerMove={reduce ? undefined : spot} onClick={onOpen} {...rise(i, reduce)}>
      <span className="cend__eye">
        <Sun />
        Contact
      </span>
      <button type="button" className="ctile__arrow" onClick={(e) => { e.stopPropagation(); onOpen() }} aria-label="Write to me">
        <ArrowOut size={24} />
      </button>
      <div className="ctile__lines">
        <button type="button" className="ctile__line" onClick={copy} aria-label={`Copy ${profile.email}`}>
          <span className={copied ? 'ctile__copied' : undefined}>{copied ? 'Copied — paste it anywhere' : profile.email}</span>
        </button>
        {profile.phone && (
          <a className="ctile__line" href={`tel:${profile.phone.replace(/\s+/g, '')}`} onClick={(e) => e.stopPropagation()}>
            {profile.phone}
          </a>
        )}
      </div>
    </motion.div>
  )
}

function TakeTile({ slug, title, i }: { slug: string; title: string; i: number }) {
  const reduce = useReducedMotion()
  const [reaction, setReaction] = useState<Reaction | null>(null)
  const [note, setNote] = useState('')
  const [phase, setPhase] = useState<'idle' | 'sending' | 'sent' | 'failed'>('idle')
  // a field no person can see or reach; anything typed into it was typed by a bot
  const honey = useRef<HTMLInputElement>(null)
  const live = Boolean(feedback.endpoint)
  // neither half is required, but there has to be something to send
  const ready = Boolean(reaction || note.trim())

  // coming back to a project you already answered for shows the answer
  useEffect(() => {
    const saved = recall(slug)
    if (!saved) return
    setReaction(saved.reaction)
    if (saved.sent) setPhase('sent')
  }, [slug])

  function pick(next: Reaction) {
    // the same button again takes the answer back. Nothing is sent on a click:
    // each send is one email, so it waits for the visitor to press Send.
    const value = next === reaction ? null : next
    setReaction(value)
    if (phase === 'failed') setPhase('idle')
    remember(slug, value ? { reaction: value } : null)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!ready || phase === 'sending') return
    const say = COPY[reaction ?? 'none']
    const thought = note.trim()

    if (honey.current?.value) {
      // a bot: look like it worked, send nothing
      setPhase('sent')
      return
    }

    if (!live) {
      const body = thought || `(${say.subject}, no note)`
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(`${title} — ${say.subject}`)}&body=${encodeURIComponent(body)}`
      setPhase('sent')
      remember(slug, { reaction, sent: true })
      return
    }

    setPhase('sending')
    const ok = await send({
      _subject: `Portfolio · ${title} — ${say.subject}`,
      _template: 'table',
      project: title,
      reaction: reaction ? COPY[reaction].label : '—',
      thought: thought || '—',
      page: location.href,
    })
    setPhase(ok ? 'sent' : 'failed')
    if (ok) remember(slug, { reaction, sent: true })
  }

  function reset() {
    setReaction(null)
    setNote('')
    setPhase('idle')
    remember(slug, null)
  }

  const say = COPY[reaction ?? 'none']

  return (
    <motion.div className="ctile ctile--take ctile--glass" onPointerMove={reduce ? undefined : spot} aria-live="polite" {...rise(i, reduce)}>
      <span className="cend__eye">
        <Sun />
        Your take
      </span>

      {phase === 'sent' ? (
        <motion.div
          className="cend__thanks"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className={`cend__badge cend__badge--${reaction ?? 'none'}`} aria-hidden="true">
            {reaction ? <Thumb down={reaction === 'dislike'} /> : <Sun />}
          </span>
          <div>
            <p className="cend__q">{say.thanks}</p>
            <p className="cend__qsub">{live ? 'It is in my inbox. I read every one.' : 'Your email app has it, ready to send.'}</p>
          </div>
          <button className="cend__change" onClick={reset}>
            Send another
          </button>
        </motion.div>
      ) : (
        <form className="cend__form" onSubmit={submit}>
          <div>
            <p className="cend__q">How did this one land?</p>
            <p className="cend__qsub">Pick one, write a line, or both. None of it is required.</p>
          </div>

          <div className="cend__pick" role="group" aria-label="Your reaction to this case study">
            {(['like', 'dislike'] as const).map((r) => {
              const on = reaction === r
              return (
                <button key={r} type="button" className={`react react--${r}`} aria-pressed={on} onClick={() => pick(r)}>
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

          <label className="cend__field">
            <span className="sr-only">Share your thoughts about this project (optional)</span>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder={say.placeholder} rows={3} maxLength={1200} />
          </label>
          <input ref={honey} className="cend__honey" type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" />

          <div className="cend__row">
            <p className="cend__fine">{live ? 'Goes straight to my inbox. Nothing here is published.' : 'Opens your email with it filled in. Nothing is published.'}</p>
            <button className="btn btn--primary cend__send" type="submit" disabled={!ready || phase === 'sending'}>
              {phase === 'sending' ? 'Sending…' : 'Send'}
            </button>
          </div>
          {phase === 'failed' && (
            <p className="cend__err" role="alert">
              That did not go through.{' '}
              <a href={`mailto:${profile.email}?subject=${encodeURIComponent(`${title} — ${say.subject}`)}&body=${encodeURIComponent(note)}`}>Email it instead</a>
            </p>
          )}
        </form>
      )}
    </motion.div>
  )
}

/* ── the section ─────────────────────────────────────────────────────────── */

export default function CaseEnd({ slug, title }: { slug: string; title: string }) {
  const reduce = useReducedMotion()
  const [contact, setContact] = useState(false)
  const [next, other] = neighbours(slug)
  const shown = [next, other].filter(Boolean).length
  const here = projects.some((p) => p.slug === slug) ? 1 : 0
  const more = projects.length - here - shown

  return (
    <>
      <section className="cend" aria-label="End of the case study">
        <motion.header
          className="cend__head"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <h2 className="cend__h">
              <Words text="Want the full story?" />
            </h2>
            <p className="cend__p">
              <Words text="Happy to walk through the decisions, the dead ends and what I'd change — or pick another project below." />
            </p>
          </div>
        </motion.header>

        <div className="cend__grid">
          {/* source order is reading order — the next project, the one after,
              how many more, your take, contact — so tab and screen reader
              follow the same path the eye does */}
          {next && <ProjectTile slug={next.slug} label="Up next" area="next" i={0} />}
          {other && <ProjectTile slug={other.slug} label="Keep going" area="other" i={1} />}
          <MoreTile count={more} i={2} />
          <TakeTile slug={slug} title={title} i={3} />
          <ReachTile onOpen={() => setContact(true)} i={4} />
        </div>
      </section>

      <ContactModal open={contact} onClose={() => setContact(false)} />
    </>
  )
}
