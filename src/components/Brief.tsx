import { motion } from 'motion/react'
import type { Brief as BriefData } from '../data'

/**
 * Problems beside solutions, then the two goals — the opening spread every
 * case study on my Behance uses, before the process starts.
 */

const group = { rest: {}, in: { transition: { staggerChildren: 0.06 } } }
const item = {
  rest: { opacity: 0, y: 14 },
  in: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 96, damping: 18 } },
} as const

function Bullet({ good }: { good?: boolean }) {
  return good ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.2l2.4 2.4 4.6-4.8" />
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12h6" />
    </svg>
  )
}

function Column({ title, lead, items, good }: { title: string; lead: string; items: string[]; good?: boolean }) {
  return (
    <motion.div className={good ? 'brief__col brief__col--good' : 'brief__col'} variants={group}>
      <motion.h3 className="brief__h" variants={item}>
        {title}
      </motion.h3>
      <motion.p className="brief__lead" variants={item}>
        {lead}
      </motion.p>
      <ul className="brief__list">
        {items.map((t) => (
          <motion.li key={t} variants={item}>
            <Bullet good={good} />
            <span>{t}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}

export default function Brief({ brief }: { brief: BriefData }) {
  return (
    <section className="brief" aria-label="Problems, solutions and goals">
      <motion.div
        className="brief__split"
        id="why"
        variants={group}
        initial="rest"
        whileInView="in"
        viewport={{ once: true, amount: 0.25 }}
      >
        <Column title="Problems" lead={brief.problems.lead} items={brief.problems.items} />
        <Column title="Solutions" lead={brief.solutions.lead} items={brief.solutions.items} good />
      </motion.div>

      <motion.div
        className="brief__goals"
        id="benefit"
        variants={group}
        initial="rest"
        whileInView="in"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h3 className="brief__goals-h" variants={item}>
          Goals
        </motion.h3>
        <div className="brief__goal-grid">
          {brief.goals.map((g) => (
            <motion.article className="goal" key={g.label} variants={item}>
              <span className="goal__label">{g.label}</span>
              <p className="goal__text">{g.text}</p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
