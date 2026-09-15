import { motion } from 'motion/react'
import type { Phase } from '../data'

/**
 * The phases of the work, as a numbered spine with the cards alternating
 * either side of it — the layout my case studies use on Behance.
 *
 * The spine draws itself down as the section arrives, each node pops, and each
 * card comes in from its own side.
 */

const spine = {
  rest: { scaleY: 0 },
  in: { scaleY: 1, transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] } },
} as const
const node = {
  rest: { scale: 0.5, opacity: 0 },
  in: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 18 } },
} as const
const cardIn = (fromLeft: boolean) =>
  ({
    rest: { opacity: 0, x: fromLeft ? -28 : 28 },
    in: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 80, damping: 18 } },
  }) as const

function Tick() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.2l2.4 2.4 4.6-4.8" />
    </svg>
  )
}

export default function Phases({ phases, note }: { phases: Phase[]; note?: string }) {
  return (
    <section className="phases" id="process" aria-label="How the work ran">
      <div className="phases__head">
        <h2 className="phases__title">
          Design
          <br />
          phases
        </h2>
        {note && <p className="phases__note">{note}</p>}
      </div>

      <div className="phases__track">
        <motion.span
          className="phases__spine"
          variants={spine}
          initial="rest"
          whileInView="in"
          viewport={{ once: true, amount: 0.05 }}
          aria-hidden="true"
        />
        {phases.map((p, i) => {
          const left = i % 2 === 0
          return (
            <motion.div
              className={left ? 'phase phase--left' : 'phase phase--right'}
              key={p.name}
              initial="rest"
              whileInView="in"
              viewport={{ once: true, amount: 0.45 }}
            >
              <motion.div className={p.accent ? 'phase__card phase__card--accent' : 'phase__card'} variants={cardIn(left)}>
                <div className="phase__top">
                  <h3 className="phase__name">{p.name}</h3>
                  <span className="phase__time">{p.duration}</span>
                </div>
                <ul className="phase__list">
                  {p.items.map((it) => (
                    <li key={it}>
                      <Tick />
                      {it}
                    </li>
                  ))}
                </ul>
              </motion.div>
              <motion.span className="phase__node" variants={node}>
                {i + 1}
              </motion.span>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
