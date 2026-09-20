import { motion } from 'motion/react'
import { useRef, useState } from 'react'
import type { Brief as BriefData } from '../data'
import Words from './Words'

/**
 * What was wrong, what answers it, and what the team gets — one at a time,
 * on a tab you click. Three short panels rather than one long wall: somebody
 * skimming reads the problem and leaves, somebody interested opens the rest.
 */

const group = { rest: {}, in: { transition: { staggerChildren: 0.05 } } }
const item = {
  rest: { opacity: 0, y: 12 },
  in: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 18 } },
} as const

const PANELS = [
  { id: 'problem', label: 'Problem' },
  { id: 'solution', label: 'Solution' },
  { id: 'benefits', label: 'Benefits' },
] as const

type PanelId = (typeof PANELS)[number]['id']

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

/** a plain list of one-liners — the problem and the benefits both read this way */
function Points({ lead, items, good }: { lead: string; items: string[]; good?: boolean }) {
  return (
    <>
      <motion.p className="bpanel__lead" variants={item}>
        <Words text={lead} />
      </motion.p>
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
    </>
  )
}

export default function Brief({ brief }: { brief: BriefData }) {
  const [open, setOpen] = useState<PanelId>('problem')
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  // a real tablist answers the arrow keys, or it is only a row of buttons
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (i + step + PANELS.length) % PANELS.length
    setOpen(PANELS[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <section className="brief" id="why" aria-label="Problem, solution and benefits">
      <div className="btabs" role="tablist" aria-label="Problem, solution and benefits">
        {PANELS.map((p, i) => (
          <button
            key={p.id}
            ref={(el) => {
              tabRefs.current[i] = el
            }}
            type="button"
            role="tab"
            id={`btab-${p.id}`}
            aria-selected={open === p.id}
            aria-controls={`bpanel-${p.id}`}
            tabIndex={open === p.id ? 0 : -1}
            className={open === p.id ? 'btab btab--on' : 'btab'}
            onClick={() => setOpen(p.id)}
            onKeyDown={(e) => onKey(e, i)}
          >
            {open === p.id && (
              <motion.span className="btab__pill" layoutId="btab-pill" aria-hidden="true" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />
            )}
            <span className="btab__label">{p.label}</span>
          </button>
        ))}
      </div>

      {/* Deliberately NOT wrapped in AnimatePresence. mode="wait" holds the
          outgoing panel until its exit animation finishes, and an exit
          animation needs frames — in a throttled tab the panel would never
          swap at all. Keying on `open` replaces it outright, so the click
          always lands; the stagger below is decoration on top of that. */}
        <motion.div
          key={open}
          className="bpanel"
          role="tabpanel"
          id={`bpanel-${open}`}
          aria-labelledby={`btab-${open}`}
          variants={group}
          initial="rest"
          animate="in"
        >
          {open === 'problem' && <Points lead={brief.problem.lead} items={brief.problem.items} />}

          {open === 'benefits' && <Points lead={brief.benefits.lead} items={brief.benefits.items} good />}

          {open === 'solution' && (
            <>
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
            </>
          )}
        </motion.div>
    </section>
  )
}
