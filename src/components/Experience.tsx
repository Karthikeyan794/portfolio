import { motion, useScroll, useSpring } from 'motion/react'
import { useRef } from 'react'
import { experience, type Role } from '../data'

/** One stop on the timeline: marker on the rail, the role, and a picture. */
function Stop({ role, index }: { role: Role; index: number }) {
  return (
    <motion.article
      className="stop"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ type: 'spring', stiffness: 66, damping: 18, delay: index * 0.06 }}
    >
      <div className="stop__rail" aria-hidden="true">
        <span className="stop__dot" />
        <span className="stop__marker">{role.marker}</span>
      </div>

      <div className="stop__card">
        <div className="stop__text">
          <span className="stop__period">{role.period}</span>
          <h3 className="stop__company">{role.company}</h3>
          <span className="stop__title">{role.title}</span>
          {role.place && <span className="stop__place">{role.place}</span>}
          <ul className="stop__points">
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
          <div className="stop__shot">
            <img src={role.image} alt="" loading="lazy" decoding="async" />
          </div>
        )}
      </div>
    </motion.article>
  )
}

export default function Experience() {
  const ref = useRef<HTMLDivElement>(null)
  // the rail draws itself as the section passes
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.4'] })
  const draw = useSpring(scrollYProgress, { stiffness: 90, damping: 28, restDelta: 0.001 })

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

        <div className="timeline" ref={ref}>
          <div className="timeline__track" aria-hidden="true">
            <motion.span className="timeline__drawn" style={{ scaleY: draw }} />
          </div>
          {experience.map((r, i) => (
            <Stop key={r.company + r.period} role={r} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
