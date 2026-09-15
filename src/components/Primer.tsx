import { motion } from 'motion/react'
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

export default function Primer({ primer }: { primer: PrimerData }) {
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
        <div className="primer__grid">
          {primer.does.map((d, i) => (
            <motion.article className="does" key={d.title} variants={item}>
              <span className="does__no">{String(i + 1).padStart(2, '0')}</span>
              <h4 className="does__title">{d.title}</h4>
              <p className="does__text">{d.text}</p>
            </motion.article>
          ))}
        </div>
      </motion.div>

    </section>
  )
}
