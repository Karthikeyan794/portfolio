import { animate, motion, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { facets, manifesto, skills, stats } from '../data'

/** Counts from 0 to `value` the first time it scrolls into view. */
function Stat({ value, suffix, label, delay }: { value: number; suffix?: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInView(ref, { once: true, amount: 0.6 })
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!seen) return
    const controls = animate(0, value, {
      duration: 1.1,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setN(Math.round(v)),
    })
    return () => controls.stop()
  }, [seen, value, delay])

  return (
    <div className="stat" ref={ref}>
      <span className="stat__value">
        {n}
        {suffix}
      </span>
      <span className="stat__label">{label}</span>
    </div>
  )
}

/**
 * Slats side by side in a fixed-width strip. The open one takes most of the
 * room and shows its story; the rest collapse to a spine with a vertical
 * label. Pointer or keyboard both drive it, and one is always open so the
 * strip never looks empty.
 */
function Facets() {
  const [open, setOpen] = useState(0)

  return (
    <motion.div
      className="facets"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: 'spring', stiffness: 62, damping: 18 }}
    >
      {facets.map((f, i) => (
        <button
          type="button"
          className="facet"
          key={f.label}
          data-open={i === open}
          aria-expanded={i === open}
          onPointerEnter={() => setOpen(i)}
          onFocus={() => setOpen(i)}
          onClick={() => setOpen(i)}
        >
          <img className="facet__img" src={f.image} alt="" loading="lazy" decoding="async" />
          <span className="facet__veil" aria-hidden="true" />
          <span className="facet__spine">{f.label}</span>
          <span className="facet__story">
            <span className="facet__label">{f.label}</span>
            <span className="facet__title">{f.title}</span>
            <span className="facet__body">{f.body}</span>
          </span>
        </button>
      ))}
    </motion.div>
  )
}

/** Kept deliberately spare: one statement, the strip, the numbers, the tools. */
export default function About() {
  return (
    <section className="section about" id="about">
      <div className="wrap wrap--wide">
        <motion.div
          className="about__head"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ type: 'spring', stiffness: 68, damping: 18 }}
        >
          <span className="eyebrow">01 — About</span>
          <p className="about__manifesto">{manifesto}</p>
        </motion.div>

        <Facets />

        <motion.div
          className="about__foot"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.7 }}
        >
          <div className="stats">
            {stats.map((s, i) => (
              <Stat key={s.label} {...s} delay={i * 0.08} />
            ))}
          </div>

          <div className="toolkit">
            <span className="about__label">Toolkit</span>
            <div className="chips">
              {skills.flatMap((g) => g.items).map((item) => (
                <span className="chip" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
