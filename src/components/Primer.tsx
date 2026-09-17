import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef } from 'react'
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
/* each row slides in from the left a beat after the one before it */
const row = {
  rest: { opacity: 0, x: -14 },
  in: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 80, damping: 18 } },
} as const


/**
 * A block's title: one line, underscored in the accent. `text` overrides the
 * block's own name where a different wording reads better.
 */
function Head({ kick, text }: { kick: string; text?: string }) {
  return (
    <motion.div className="primer__head" variants={item}>
      <h3 className="primer__h">{text ?? kick}</h3>
    </motion.div>
  )
}

export default function Primer({ primer }: { primer: PrimerData }) {
  // the picture travels against the page as the section passes, so it and the
  // words beside it never scroll at quite the same rate
  const shotRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: shotRef, offset: ['start end', 'end start'] })
  const drift = useTransform(scrollYProgress, [0, 1], [46, -46])
  const float = useSpring(drift, { stiffness: 70, damping: 24, restDelta: 0.4 })

  return (
    <section className="primer" id="overview" aria-label="What this is, in plain words">
      <motion.div
        className="primer__top"
        variants={group}
        initial="rest"
        whileInView="in"
        viewport={{ once: true, amount: 0.3 }}
      >
        <Head kick="Overview" text={primer.heads?.what} />
        <motion.p className="primer__what" variants={item}>
          {marked(primer.what)}
        </motion.p>

        {primer.showcase && (
          <motion.div className="oshot__track" ref={shotRef} style={{ y: float }}>
            <motion.div
              className="oshot"
              initial={{ opacity: 0, y: 26, scale: 0.975 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            >
            {primer.showcase.bg && <img className="oshot__bg" src={primer.showcase.bg} alt="" aria-hidden="true" />}
            <span className="oshot__wash" aria-hidden="true" />
            <div className="oshot__frame">
              <span className="oshot__sheen" aria-hidden="true" />
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
        <Head kick="What it does" text={primer.heads?.does} />
        <ol className="flist">
          {primer.does.map((d, i) => (
            <motion.li className="fl" key={d.title} variants={row}>
              <span className="fl__no" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}.
              </span>
              <div className="fl__body">
                <h4 className="fl__title">{d.title}</h4>
                <p className="fl__text">{d.text}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </motion.div>

    </section>
  )
}
