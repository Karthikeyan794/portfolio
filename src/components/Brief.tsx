import { motion } from 'motion/react'
import { useState } from 'react'
import type { Brief as BriefData } from '../data'
import Words from './Words'
import ParticleShot from './ParticleShot'

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
          <span className="bpoints__mark" aria-hidden="true">{good ? <Check /> : <Minus />}</span>
          <span>
            <Words text={t} />
          </span>
        </motion.li>
      ))}
    </ul>
  )
}

/**
 * The picture beside a block, as a field of points the cursor can push
 * through. It removes itself if the file is not there, so a slot can be
 * wired up before the artwork lands without leaving a broken frame.
 */
function Shot({ src, alt, onFail }: { src: string; alt: string; onFail: () => void }) {
  return (
    <motion.figure className="wshot" variants={item}>
      <ParticleShot src={src} alt={alt} onFail={onFail} />
    </motion.figure>
  )
}

/** one side of the argument: the words, and the picture that sits with them */
function Block({ id, title, lead, items, image, good }: {
  id: string; title: string; lead: string; items: string[]; image?: string; good?: boolean
}) {
  // the second column exists only while a picture is actually in it: a path
  // whose file is not there yet collapses the block back to one column rather
  // than holding an empty half open
  const [shot, setShot] = useState(image)
  return (
    <div className={shot ? 'wblock' : 'wblock wblock--solo'} id={id}>
      <div className="wcol">
        <Title>{title}</Title>
        <motion.p className="bpanel__lead" variants={item}>
          <Words text={lead} />
        </motion.p>
        <Points items={items} good={good} />
      </div>
      {shot && <Shot src={shot} alt={`${title} — illustration`} onFail={() => setShot(undefined)} />}
    </div>
  )
}

export default function Brief({ brief }: { brief: BriefData }) {
  return (
    <>
      <motion.section
        className="brief brief--why"
        aria-label="Problem and solution"
        variants={group}
        initial="rest"
        whileInView="in"
        viewport={{ amount: 0.12 }}
      >
        <Block id="problem" title="Problem" lead={brief.problem.lead} items={brief.problem.items} image={brief.problem.image} />
        <Block id="solution" title="Solution" lead={brief.solution.lead} items={brief.solution.items} image={brief.solution.image} good />
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
        {/* title on the left, the run of benefits on the right */}
        <div className="bsplit">
          <div className="bsplit__head">
            <Title>Benefits</Title>
            {/* the line belongs to the title, not to the list */}
            <motion.p className="bsplit__sub" variants={item}>
              <Words text={brief.benefits.lead} />
            </motion.p>
          </div>

          <div className="bsplit__body">
            <ol className="brun">
              {brief.benefits.items.map((b, i) => (
                <motion.li className="brun__row" key={b.title} variants={item}>
                  <span className="brun__no" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <p className="brun__line">
                    <strong className="brun__t">
                      {/* a title that already ends in punctuation does not take a second stop */}
                      <Words text={/[.?!”"]$/.test(b.title) ? b.title : `${b.title}.`} />
                    </strong>{' '}
                    <Words text={b.text} />
                  </p>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </motion.section>
    </>
  )
}
