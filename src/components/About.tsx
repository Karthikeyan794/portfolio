import { motion } from 'motion/react'
import { useState } from 'react'
import { currently, intro_about, place, roleList, stackCards } from '../data'

/** Folder tabs stacked front to back; point at one and it slides forward. */
function StackCard() {
  const [open, setOpen] = useState(0)
  return (
    <div className="pcard pcard--stack" style={{ gridArea: 's' }}>
      <span className="pcard__label">Stack / {stackCards.length} folders</span>
      <div className="folders" onPointerLeave={() => setOpen(0)}>
        {stackCards.map((c, i) => (
          <div className="folder" key={c.no} data-open={i === open} onPointerEnter={() => setOpen(i)}>
            <span className="folder__top">
              <span className="folder__no">{c.no}</span>
              <span className="folder__label">{c.label}</span>
            </span>
            <span className="folder__tools">{c.tools}</span>
          </div>
        ))}
      </div>
      <span className="pcard__hint">Hover a folder to peek inside</span>
    </div>
  )
}

/** Where I am — a drawn panel rather than a map image. */
function PlaceCard() {
  const time = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  }).format(new Date())

  return (
    <div className="pcard pcard--place" style={{ gridArea: 'l' }}>
      <span className="pcard__label">Based in</span>
      <div className="place" aria-hidden="true">
        <span className="place__pin" />
        <span className="place__ring" />
      </div>
      <div className="place__meta">
        <strong>
          {place.city}, {place.country}
        </strong>
        <span>{place.coords}</span>
        <span className="place__time">
          {time} {place.tzLabel}
        </span>
      </div>
    </div>
  )
}

export default function About() {
  return (
    <section className="section about" id="about">
      <div className="wrap wrap--wide about__grid">
        {/* left: the words and the roles */}
        <motion.div
          className="about__col"
          initial={{ opacity: 0, y: 34 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ type: 'spring', stiffness: 66, damping: 18 }}
        >
          <span className="eyebrow">01 — About</span>
          <h2 className="about__greeting">{intro_about.greeting}</h2>
          <div className="about__text">
            {intro_about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          <ul className="roles">
            {roleList.map((r) => (
              <li className="role" key={r.org}>
                <span className="role__org">{r.org}</span>
                <span className="role__slash">/</span>
                <span className="role__title">{r.role}</span>
                <span className="role__years">{r.years}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* right: the collage */}
        <motion.div
          className="collage"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ type: 'spring', stiffness: 62, damping: 18, delay: 0.08 }}
        >
          <figure className="pcard pcard--portrait" style={{ gridArea: 'p' }}>
            <img src={currently.portrait} alt="" loading="lazy" decoding="async" />
            <figcaption>
              <span className="pcard__now">
                <i aria-hidden="true" />
                {currently.role} · {currently.at}
              </span>
            </figcaption>
          </figure>

          <a className="pcard pcard--shot" href="#/project/drawings" style={{ gridArea: 'd' }}>
            <img src="/bento/art.jpg" alt="" loading="lazy" decoding="async" />
            <span className="pcard__label pcard__label--over">Drawings</span>
            <span className="pcard__go" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </span>
          </a>

          <StackCard />
          <PlaceCard />
        </motion.div>
      </div>
    </section>
  )
}
