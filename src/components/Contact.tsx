import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState, type PointerEvent } from 'react'
import { contact, profile, socials } from '../data'
import ContactModal from './ContactModal'

/**
 * The end of the home page: your picture full bleed, and one frosted panel
 * over it holding the whole invitation — a line that writes itself in, a
 * short note, your links, and your mail.
 *
 * The panel is glass, not a card: `backdrop-filter` smears the glowing
 * shelves behind it, so the orange comes through soft instead of the panel
 * sitting on the picture like a sticker. The contact dialog still lives
 * here, because the nav's Contact button opens it with an `open-contact`
 * event and this is the component listening.
 */

const EASE = [0.16, 1, 0.3, 1] as const
const words = { rest: {}, in: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } } }
const word = {
  rest: { opacity: 0, y: '0.45em', filter: 'blur(12px)' },
  in: { opacity: 1, y: '0em', filter: 'blur(0px)', transition: { duration: 0.9, ease: EASE } },
} as const
const after = {
  rest: { opacity: 0, y: 14 },
  in: (i: number) => ({ opacity: 1, y: 0, transition: { delay: 0.55 + i * 0.1, duration: 0.7, ease: EASE } }),
} as const

export default function Contact() {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const reduce = useReducedMotion()
  const root = useRef<HTMLElement>(null)
  const glass = useRef<HTMLDivElement>(null)

  // the nav's Contact button opens the same dialog
  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener('open-contact', onOpen)
    return () => window.removeEventListener('open-contact', onOpen)
  }, [])

  // the picture drifts a little slower than the page, so the panel floats over it
  const { scrollYProgress } = useScroll({ target: root, offset: ['start end', 'end start'] })
  const drift = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-7%', '7%'])

  // a soft light follows the pointer across the glass
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const el = glass.current
    if (!el) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section className="reach" id="contact" ref={root} aria-label="Contact">
      <motion.img className="reach__bg" src={contact.bg} alt="" aria-hidden="true" style={{ y: drift }} />
      <span className="reach__shade" aria-hidden="true" />

      <div className="reach__stage">
        <motion.div
          className="reach__glass"
          ref={glass}
          onPointerMove={onMove}
          variants={words}
          initial="rest"
          whileInView="in"
          viewport={{ once: true, amount: 0.45 }}
        >
          <h2 className="reach__h">
            {contact.heading.split(' ').map((w, i) => (
              <motion.span className="reach__w" key={i} variants={word}>
                {w}
              </motion.span>
            ))}
          </h2>

          <motion.p className="reach__p" variants={after} custom={0}>
            {contact.body}
          </motion.p>

          <motion.ul className="reach__links" variants={after} custom={1}>
            {socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer">
                  {s.label}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </a>
              </li>
            ))}
          </motion.ul>

          <motion.div className="reach__mail" variants={after} custom={2}>
            <a className="reach__addr" href={`mailto:${profile.email}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="5" width="18" height="14" rx="2.5" />
                <path d="m4 7 8 6 8-6" />
              </svg>
              {profile.email}
            </a>
            <button
              className={copied ? 'reach__copy reach__copy--done' : 'reach__copy'}
              onClick={copy}
              aria-label={copied ? 'Email copied' : 'Copy email'}
              title={copied ? 'Copied' : 'Copy email'}
            >
              {copied ? (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="m5 12.5 4.5 4.5L19 7.5" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="9" y="9" width="11" height="11" rx="2.5" />
                  <path d="M5 15V6.5A1.5 1.5 0 0 1 6.5 5H15" />
                </svg>
              )}
            </button>
          </motion.div>
        </motion.div>
      </div>

      <footer className="reach__foot">
        <span className="reach__mark">{profile.name}</span>
        <span>
          © {new Date().getFullYear()} {profile.name} · 3D furniture by{' '}
          <a href="https://kenney.nl" target="_blank" rel="noreferrer">Kenney</a> (CC0)
        </span>
      </footer>

      <ContactModal open={open} onClose={() => setOpen(false)} />
    </section>
  )
}
