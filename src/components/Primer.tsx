import { motion } from 'motion/react'
import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Primer as PrimerData } from '../data'

/**
 * The plain-English layer, before any of the process: what this app is and
 * what it does. Somebody who has never heard of the desk should understand it
 * from this block alone.
 */

/** `*like this*` in the copy comes out in the display italic, in the accent */
function marked(text: string) {
  return text.split(/(\*[^*]+\*)/g).map((part, i) =>
    part.length > 2 && part.startsWith('*') && part.endsWith('*') ? (
      <em className="hi" key={i}>
        {part.slice(1, -1)}
      </em>
    ) : (
      <span key={i}>{part}</span>
    ),
  )
}

const group = { rest: {}, in: { transition: { staggerChildren: 0.07 } } }
const item = {
  rest: { opacity: 0, y: 16 },
  in: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 90, damping: 18 } },
} as const


/** one line icon per feature — drawn here so the cards carry no image weight */
const ICONS: Record<string, ReactNode> = {
  queue: (
    <>
      <rect x="3" y="4" width="18" height="4.5" rx="1.6" />
      <rect x="3" y="11" width="18" height="4.5" rx="1.6" />
      <path d="M6.5 19.5h11" />
    </>
  ),
  owner: (
    <>
      <circle cx="10" cy="8" r="3.4" />
      <path d="M4 19.5a6 6 0 0 1 10.5-3.9" />
      <path d="M15 18.6l1.9 1.9 3.6-3.9" />
    </>
  ),
  reply: (
    <>
      <path d="M9 7 4 12l5 5" />
      <path d="M4 12h9a7 7 0 0 1 7 7v1" />
    </>
  ),
  customer: (
    <>
      <path d="M4 20V6.5a1.5 1.5 0 0 1 1.5-1.5h7A1.5 1.5 0 0 1 14 6.5V20" />
      <path d="M14 11h4.5A1.5 1.5 0 0 1 20 12.5V20" />
      <path d="M7 9h4M7 13h4M17 15h1M3 20h18" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M12 7.4V12l3.2 2" />
    </>
  ),
  insight: (
    <>
      <path d="M4 20h16" />
      <path d="M7 20v-5.5M12 20V8M17 20v-9" />
      <path d="M5.5 6.5 10 9l4-4.5 4.5 2" />
    </>
  ),
}

function Icon({ name }: { name?: string }) {
  const art = name ? ICONS[name] : null
  if (!art) return null
  return (
    <span className="does__icon" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {art}
      </svg>
    </span>
  )
}

export default function Primer({ primer }: { primer: PrimerData }) {
  // one card is open at a time — the first, until you point at another
  const [hot, setHot] = useState(0)

  return (
    <section className="primer" id="overview" aria-label="What this is, in plain words">
      <motion.div
        className="primer__top"
        variants={group}
        initial="rest"
        whileInView="in"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h3 className="primer__h" variants={item}>
          Overview
        </motion.h3>
        <motion.p className="primer__what" variants={item}>
          {marked(primer.what)}
        </motion.p>

        {primer.showcase && (
          <motion.div className="shot" variants={item}>
            {primer.showcase.bg && <img className="shot__bg" src={primer.showcase.bg} alt="" aria-hidden="true" />}
            <span className="shot__wash" aria-hidden="true" />
            <div className="shot__frame">
              {primer.showcase.clip ? (
                /\.gif$/.test(primer.showcase.clip) ? (
                  <img src={primer.showcase.clip} alt="Support Desk in use" loading="lazy" decoding="async" />
                ) : (
                  <video src={primer.showcase.clip} autoPlay loop muted playsInline preload="metadata" />
                )
              ) : (
                <img src={primer.showcase.poster} alt="The Support Desk queue" loading="lazy" decoding="async" />
              )}
            </div>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="primer__block"
        variants={group}
        initial="rest"
        whileInView="in"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h3 className="primer__h" variants={item}>
          What it does
        </motion.h3>
        <div className="feats" data-hot={hot}>
          {primer.does.map((d, i) => (
            <motion.article
              className={i === hot ? 'feat feat--on' : 'feat'}
              key={d.title}
              variants={item}
              onPointerEnter={() => setHot(i)}
              onFocus={() => setHot(i)}
              tabIndex={0}
              aria-expanded={i === hot}
            >
              <span className="feat__no" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}.
              </span>
              <div className="feat__body">
                <Icon name={d.icon} />
                <h4 className="feat__title">{d.title}</h4>
                <p className="feat__text">{d.text}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </motion.div>

    </section>
  )
}
