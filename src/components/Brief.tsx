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
        className="brief brief--split"
        id="why"
        aria-label="Problem and solution"
        variants={group}
        initial="rest"
        whileInView="in"
        viewport={{ amount: 0.15 }}
      >
        <div className="bcol">
          <Title>Problem</Title>
          <motion.p className="bpanel__lead" variants={item}>
            <Words text={brief.problem.lead} />
          </motion.p>
          <Points items={brief.problem.items} />
          {brief.problem.close && (
            <motion.p className="bclose" variants={item}>
              <Words text={brief.problem.close} />
            </motion.p>
          )}
        </div>

        <div className="bcol">
          <Title>Solution</Title>
          <motion.p className="bpanel__lead" variants={item}>
            <Words text={brief.solution.lead} />
          </motion.p>
          <Points items={brief.solution.items} good />
          {brief.solution.close && (
            <motion.p className="bclose" variants={item}>
              <Words text={brief.solution.close} />
            </motion.p>
          )}
        </div>
      </motion.section>

      <motion.section
        className="brief"
        id="benefits"
        aria-label="Benefits"
        variants={group}
        initial="rest"
        whileInView="in"
        viewport={{ amount: 0.2 }}
      >
        <div className="bblock">
          <Title>Benefits</Title>
          <motion.p className="bpanel__lead" variants={item}>
            <Words text={brief.benefits.lead} />
          </motion.p>

          <ul className="bcards">
              {brief.benefits.items.map((b) => (
                <motion.li className="bcard" key={b.title} variants={item}>
                  <span className="bcard__tick" aria-hidden="true">
                    <Check />
                  </span>
                  <h4 className="bcard__title">
                    <Words text={b.title} />
                  </h4>
                  <p className="bcard__text">
                    <Words text={b.text} />
                  </p>
                </motion.li>
              ))}
          </ul>
        </div>
      </motion.section>
    </>
  )
}
