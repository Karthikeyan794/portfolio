import { motion } from 'motion/react'
import type { Brief as BriefData } from '../data'
import Words from './Words'

/**
 * Two sections, each one a stop on the top bar: Why (what was wrong, and what
 * answers it) and Benefits (what you get out of it). No inline tabs — the bar
 * at the top of the page is already the way around this case study, and a
 * second row of tabs underneath it only competed with it.
 */

const group = { rest: {}, in: { transition: { staggerChildren: 0.05 } } }
const item = {
  rest: { opacity: 0, y: 12 },
  in: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 18 } },
} as const

function Minus() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M9 12h6" />
    </svg>
  )
}

function Check() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M8.5 12.2l2.4 2.4 4.6-4.8" />
    </svg>
  )
}

/** the section title, set like the overview's so the page has one voice */
function Title({ children }: { children: string }) {
  return (
    <motion.h3 className="bhead" variants={item}>
      <Words text={children} />
    </motion.h3>
  )
}

/** a list of one-liners — the problem and the benefits both read this way */
function Points({ items, good }: { items: string[]; good?: boolean }) {
  return (
    <ul className={good ? 'bpoints bpoints--good' : 'bpoints'}>
      {items.map((t) => (
        <motion.li key={t} variants={item}>
          {good ? <Check /> : <Minus />}
          <span>
            <Words text={t} />
          </span>
        </motion.li>
      ))}
    </ul>
  )
}

export default function Brief({ brief }: { brief: BriefData }) {
  return (
    <>
      <motion.section
        className="brief"
        id="why"
        aria-label="Problem and solution"
        variants={group}
        initial="rest"
        whileInView="in"
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="bblock">
          <Title>Problem</Title>
          <motion.p className="bpanel__lead" variants={item}>
            <Words text={brief.problem.lead} />
          </motion.p>
          <Points items={brief.problem.items} />
        </div>

        <div className="bblock">
          <Title>Solution</Title>
          <motion.p className="bpanel__lead" variants={item}>
            <Words text={brief.solution.lead} />
          </motion.p>
          <ol className="flist">
            {brief.solution.items.map((d, i) => (
              <motion.li className="fl" key={d.title} variants={item}>
                {/* the numeral steps aside on hover and hands the row to an arrow */}
                <span className="fl__mark" aria-hidden="true">
                  <span className="fl__no">{String(i + 1).padStart(2, '0')}.</span>
                  <svg className="fl__arw" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12h16" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>
                </span>
                <div className="fl__body">
                  <h4 className="fl__title">
                    <Words text={d.title} />
                  </h4>
                  <p className="fl__text">
                    <Words text={d.text} />
                  </p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>
      </motion.section>

      <motion.section
        className="brief"
        id="benefits"
        aria-label="Benefits"
        variants={group}
        initial="rest"
        whileInView="in"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="bblock">
          <Title>Benefits</Title>
          <motion.p className="bpanel__lead" variants={item}>
            <Words text={brief.benefits.lead} />
          </motion.p>
          <Points items={brief.benefits.items} good />
        </div>
      </motion.section>
    </>
  )
}
