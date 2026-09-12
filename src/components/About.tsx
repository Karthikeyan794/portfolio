import { motion } from 'motion/react'
import { marks } from '../logos'
import { useEffect, useRef, useState } from 'react'
import type { Tool } from '../data'
import { aboutLinks, awards, currently, education, intro_about, photoSets, place, places, playlist, roleList, stackCards } from '../data'

/**
 * Light the card's border where the cursor is, exactly like the work bento.
 * rAF-throttled and written straight to CSS variables, so nothing re-renders
 * while the pointer moves.
 */
function useGlow<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const raf = useRef(0)

  function onPointerMove(e: React.PointerEvent<T>) {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 100
    const y = ((e.clientY - r.top) / r.height) * 100
    if (raf.current) return
    raf.current = requestAnimationFrame(() => {
      raf.current = 0
      el.style.setProperty('--gx', `${x.toFixed(1)}%`)
      el.style.setProperty('--gy', `${y.toFixed(1)}%`)
    })
  }

  useEffect(() => () => cancelAnimationFrame(raf.current), [])
  return { ref, onPointerMove }
}

const Glow = () => <span className="pcard__glow" aria-hidden="true" />

/** One tool, as a frosted tile that lifts out of the folder. */
function ToolTile({ tool, i, count }: { tool: Tool; i: number; count: number }) {
  // fan them from the middle: the more there are, the wider the spread
  const mid = (count - 1) / 2
  const spread = count > 3 ? 30 : 36
  return (
    <span
      className="app"
      title={tool.name}
      style={{
        ['--x' as string]: `${(i - mid) * spread}px`,
        ['--r' as string]: `${(i - mid) * 9}deg`,
        ['--d' as string]: `${i * 45}ms`,
        zIndex: count - Math.abs(i - mid),
      }}
    >
      {tool.mark ? (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d={marks[tool.mark]} />
        </svg>
      ) : (
        <b>{tool.mono}</b>
      )}
    </span>
  )
}

/** Folder tabs stacked front to back; point at one and it slides forward. */
function StackCard() {
  const [open, setOpen] = useState(0)
  const glow = useGlow<HTMLDivElement>()
  return (
    <div className="pcard pcard--stack" style={{ gridArea: 's' }} ref={glow.ref} onPointerMove={glow.onPointerMove}>
      <Glow />
      <span className="pcard__label">Stack / {stackCards.length} folders</span>
      <div className="folders" onPointerLeave={() => setOpen(0)}>
        {stackCards.map((c, i) => (
          <div className="folder" key={c.no} data-open={i === open} onPointerEnter={() => setOpen(i)}>
            {/* the tools sit behind the folder face and rise above its lip */}
            <span className="folder__apps" aria-hidden="true">
              {c.tools.map((t, j) => (
                <ToolTile key={t.name} tool={t} i={j} count={c.tools.length} />
              ))}
            </span>

            <span className="folder__face">
              <span className="folder__top">
                <span className="folder__no">{c.no}</span>
                <span className="folder__label">{c.label}</span>
              </span>
              <span className="folder__tools">{c.tools.map((t) => t.name).join(' · ')}</span>
            </span>
          </div>
        ))}
      </div>
      <span className="pcard__hint">Hover a folder to peek inside</span>
    </div>
  )
}

/** Where I am — a drawn panel rather than a map image. */
function PlaceCard() {
  const glow = useGlow<HTMLDivElement>()
  const time = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  }).format(new Date())

  const [which, setWhich] = useState(0)
  const here = places[which]

  return (
    <div className="pcard pcard--place" style={{ gridArea: 'l' }} ref={glow.ref} onPointerMove={glow.onPointerMove}>
      <Glow />
      <span className="pcard__label">Based in</span>

      {/* the dot slides between the two pins rather than cutting */}
      <div className="place" aria-hidden="true">
        <span className="place__dot" style={{ left: `${here.pin.x}%`, top: `${here.pin.y}%` }}>
          <span className="place__pin" />
          <span className="place__ring" />
        </span>
      </div>

      <div className="pchips pchips--flow">
        {places.map((pl, i) => (
          <button
            type="button"
            className="pchip pchip--ink"
            key={pl.key}
            data-on={i === which}
            onPointerEnter={() => setWhich(i)}
            onFocus={() => setWhich(i)}
            onClick={() => setWhich(i)}
          >
            {pl.label}
          </button>
        ))}
      </div>

      <div className="place__meta">
        <strong>
          {here.href ? (
            <a href={here.href} target="_blank" rel="noreferrer">
              {here.city}, {here.country}
            </a>
          ) : (
            <>
              {here.city}, {here.country}
            </>
          )}
        </strong>
        <span>{here.coords}</span>
        <span className="place__time">
          {time} {place.tzLabel}
        </span>
      </div>
    </div>
  )
}

/** Where else to find me — a full-width tile at the foot of the collage. */
function LinksCard() {
  const glow = useGlow<HTMLDivElement>()
  return (
    <div className="pcard pcard--links" style={{ gridArea: 'n' }} ref={glow.ref} onPointerMove={glow.onPointerMove}>
      <Glow />
      <span className="pcard__label">Elsewhere</span>
      <div className="plinks">
        {aboutLinks.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer">
            <span className="plinks__label">{l.label}</span>
            <span className="plinks__handle">{l.handle}</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  )
}

/** What's on while I build — the record is drawn, not an image. */
function PlaylistCard() {
  const glow = useGlow<HTMLAnchorElement>()
  return (
    <a
      className="pcard pcard--vinyl"
      href={playlist.href}
      target="_blank"
      rel="noreferrer"
      style={{ gridArea: 'y' }}
      ref={glow.ref}
      onPointerMove={glow.onPointerMove}
    >
      <Glow />
      <span className="pcard__label">Playlist</span>
      <span className="pcard__go" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <path d="M7 17 17 7M9 7h8v8" />
        </svg>
      </span>
      <span className="pcard__hint">{playlist.title}</span>
      {/* the disc sits half out of frame and turns while you point at it */}
      <span className="vinyl" aria-hidden="true">
        <span className="vinyl__label" />
      </span>
    </a>
  )
}

/** Recent pictures — the chips swap the shot. */
function PhotosCard() {
  const glow = useGlow<HTMLDivElement>()
  const [set, setSet] = useState(0)

  return (
    <div className="pcard pcard--photos" style={{ gridArea: 'c' }} ref={glow.ref} onPointerMove={glow.onPointerMove}>
      <Glow />
      {photoSets.map((ps, i) => (
        <img
          key={ps.label}
          className="photos__img"
          src={ps.src}
          alt=""
          data-on={i === set}
          loading="lazy"
          decoding="async"
        />
      ))}
      <span className="photos__veil" aria-hidden="true" />
      <span className="pcard__label pcard__label--over">Recent photos</span>

      <div className="pchips">
        {photoSets.map((ps, i) => (
          <button
            type="button"
            className="pchip"
            key={ps.label}
            data-on={i === set}
            onPointerEnter={() => setSet(i)}
            onFocus={() => setSet(i)}
            onClick={() => setSet(i)}
          >
            {ps.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function About() {
  const portraitGlow = useGlow<HTMLElement>()
  const shotGlow = useGlow<HTMLAnchorElement>()

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

          <div className="fact">
            <h3 className="about__sub">Experience</h3>
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
          </div>

          <div className="fact">
            <h3 className="about__sub">Education</h3>
            <ul className="roles">
              {education.map((e) => (
                <li className="role" key={e.school}>
                  <span className="role__org">{e.school}</span>
                  <span className="role__slash">/</span>
                  <span className="role__title">{e.course}</span>
                  <span className="role__years">{e.years}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* hides itself while the awards list is empty */}
          {awards.length > 0 && (
            <div className="fact">
              <h3 className="about__sub">Recognition</h3>
              <ul className="roles">
                {awards.map((a) => (
                  <li className="role" key={a.title}>
                    <span className="role__org">{a.title}</span>
                    <span className="role__slash">/</span>
                    <span className="role__title">{a.issuer}</span>
                    <span className="role__years">{a.year}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </motion.div>

        {/* right: the collage */}
        <motion.div
          className="collage"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ type: 'spring', stiffness: 62, damping: 18, delay: 0.08 }}
        >
          <figure className="pcard pcard--portrait" style={{ gridArea: 'p' }} ref={portraitGlow.ref} onPointerMove={portraitGlow.onPointerMove}>
            <Glow />
            <img src={currently.portrait} alt="" loading="lazy" decoding="async" />
            <figcaption>
              <span className="pcard__now">
                <i aria-hidden="true" />
                {currently.role} · {currently.at}
              </span>
            </figcaption>
          </figure>

          <a className="pcard pcard--shot" href="#/project/drawings" style={{ gridArea: 'd' }} ref={shotGlow.ref} onPointerMove={shotGlow.onPointerMove}>
            <Glow />
            <img src="/bento/art.jpg" alt="" loading="lazy" decoding="async" />
            <span className="pcard__label pcard__label--over">Drawings</span>
            <span className="pcard__go" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </span>
          </a>

          <PlaylistCard />
          <PhotosCard />
          <StackCard />
          <PlaceCard />
          <LinksCard />
        </motion.div>
      </div>

    </section>
  )
}
