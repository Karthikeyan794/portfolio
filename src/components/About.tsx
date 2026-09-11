import { animate, motion, useInView } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { about, currently, manifesto, principles, skills, stats } from '../data'

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

        <div className="about__grid">
          {/* left: the portrait, sticky, with a frosted caption and the stats */}
          <motion.aside
            className="about__side"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: 'spring', stiffness: 62, damping: 18 }}
          >
            <figure className="portrait">
              <img src={currently.portrait} alt="" loading="lazy" decoding="async" />
              <figcaption className="portrait__cap">
                <span className="portrait__now">
                  <i aria-hidden="true" />
                  Currently
                </span>
                <strong>
                  {currently.role} · {currently.at}
                </strong>
                <span className="portrait__focus">Working on {currently.focus}</span>
              </figcaption>
            </figure>

            <div className="stats">
              {stats.map((s, i) => (
                <Stat key={s.label} {...s} delay={i * 0.08} />
              ))}
            </div>
          </motion.aside>

          {/* right: the prose, the three principles, then the toolkit */}
          <div className="about__main">
            <motion.div
              className="prose"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7 }}
            >
              {about.map((p) => (
                <p key={p.slice(0, 24)}>{p}</p>
              ))}
            </motion.div>

            <div className="principles">
              <span className="about__label">How I work</span>
              {principles.map((p, i) => (
                <motion.article
                  className="principle"
                  key={p.title}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                >
                  <span className="principle__no">{String(i + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{p.title}</h3>
                    <p>{p.body}</p>
                  </div>
                </motion.article>
              ))}
            </div>

            <motion.div
              className="toolkit"
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              <span className="about__label">Toolkit</span>
              <div className="toolkit__groups">
                {skills.map((g) => (
                  <div className="toolkit__group" key={g.group}>
                    <h4>{g.group}</h4>
                    <div className="chips">
                      {g.items.map((item) => (
                        <span className="chip" key={item}>
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
