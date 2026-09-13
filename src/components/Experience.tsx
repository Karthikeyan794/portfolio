import { motion } from 'motion/react'
import { useState } from 'react'
import { experience, type Role } from '../data'

/**
 * One company, as a row that opens. Shut it is a single line — company,
 * title, years. Point at it and it opens to show what the work actually
 * was, with a picture beside it.
 */
function Stop({ role, open, onOpen }: { role: Role; open: boolean; onOpen: () => void }) {
  return (
    <div className="xrow" data-open={open}>
      <button
        type="button"
        className="xrow__head"
        onPointerEnter={onOpen}
        onFocus={onOpen}
        onClick={onOpen}
        aria-expanded={open}
      >
        <span className="xrow__marker">{role.marker}</span>
        <span className="xrow__company">{role.company}</span>
        <span className="xrow__title">{role.title}</span>
        <span className="xrow__period">{role.period}</span>
        <span className="xrow__chev" aria-hidden="true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 5 7 7-7 7" />
          </svg>
        </span>
      </button>

      <div className="xrow__body">
        <div className="xrow__inner">
          <div className="xrow__text">
            {role.place && <span className="xrow__place">{role.place}</span>}
            <ul className="xrow__points">
              {role.points.map((pt) => (
                <li key={pt.slice(0, 24)}>{pt}</li>
              ))}
            </ul>
            {role.stack && (
              <div className="chips">
                {role.stack.map((t) => (
                  <span className="chip" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {role.image && (
            <div className="xrow__shot">
              <img src={role.image} alt="" loading="lazy" decoding="async" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Experience() {
  // the newest role is open to begin with
  const [open, setOpen] = useState(0)

  return (
    <section className="section experience" id="experience">
      <div className="wrap wrap--wide">
        <motion.div
          className="exp__head"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 70, damping: 18 }}
        >
          <span className="eyebrow">04 — Experience</span>
          <h2>Where I've worked</h2>
        </motion.div>

        <motion.div
          className="xlist"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ type: 'spring', stiffness: 66, damping: 19, delay: 0.06 }}
        >
          {experience.map((r, i) => (
            <Stop key={r.company + r.period} role={r} open={i === open} onOpen={() => setOpen(i)} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
