import { motion } from 'motion/react'
import { marks } from '../logos'
import { useEffect, useRef, useState } from 'react'
import type { Tool } from '../data'
import { aboutLinks, awards, awardsCard, currently, education, intro_about, place, places, playlist, roleList, stackCards } from '../data'

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

/** One tool, as a small tile. Real mark where there is one, monogram otherwise. */
function ToolChip({ tool }: { tool: Tool }) {
  return (
    <span className="tchip" title={tool.name}>
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

/**
 * The stack, as a board rather than a folder drawer: every tool is on show
 * at once, grouped by what it's for. Nothing to hover to find out what's
 * inside, and no dead space waiting for a folder to open.
 */
function StackCard() {
  const glow = useGlow<HTMLDivElement>()
  return (
    <div className="pcard pcard--stack" style={{ gridArea: 's' }} ref={glow.ref} onPointerMove={glow.onPointerMove}>
      <Glow />
      <span className="pcard__label">Toolkit</span>
      <div className="tools">
        {stackCards.map((c) => (
          <div className="trow" key={c.no}>
            <span className="trow__name">{c.label}</span>
            <span className="trow__apps">
              {c.tools.map((t) => (
                <ToolChip key={t.name} tool={t} />
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

/** Recognition, as a card rather than a column of text. */
function AwardsCard() {
  const glow = useGlow<HTMLDivElement>()
  return (
    <div className="pcard pcard--awards" style={{ gridArea: 'w' }} ref={glow.ref} onPointerMove={glow.onPointerMove}>
      <Glow />
      <img className="awards__bg" src={awardsCard.image} alt="" loading="lazy" decoding="async" />
      <span className="awards__veil" aria-hidden="true" />
      <span className="pcard__label pcard__label--over">Recognition</span>
      <div className="atags">
        {awards.map((a, i) => (
          <span className="atag" key={`${a.title}-${i}`}>
            <b>{a.title}</b>
            <i>{a.issuer}</i>
          </span>
        ))}
      </div>
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
      {/* the map is the card's ground; the dot slides between the two pins */}
      <div className="place" aria-hidden="true">
        <span className="place__dot" style={{ left: `${here.pin.x}%`, top: `${here.pin.y}%` }}>
          <span className="place__pin" />
          <span className="place__ring" />
        </span>
      </div>

      <span className="pcard__label">Based in</span>

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
          <a key={l.label} href={l.href} target="_blank" rel="noreferrer" title={l.handle} style={{ ['--brand' as string]: l.brand }}>
            <span className="plinks__mark" aria-hidden="true">
              {l.mark ? (
                <svg viewBox="0 0 24 24">
                  <path d={marks[l.mark]} />
                </svg>
              ) : (
                <b>{l.mono}</b>
              )}
            </span>
            <span className="plinks__label">{l.label}</span>
            <span className="plinks__handle">{l.handle}</span>
            <svg className="plinks__go" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  )
}

/**
 * The crate: a glass folder that fans its covers out when you point at it,
 * with a working player underneath. The player drives a real <audio>; with
 * no file behind a track it falls back to the Spotify link.
 */
function MusicCard() {
  const glow = useGlow<HTMLDivElement>()
  const audio = useRef<HTMLAudioElement>(null)
  const [cur, setCur] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [pct, setPct] = useState(0)

  const track = playlist.tracks[cur]
  const playable = Boolean(track.src)

  // swapping tracks while playing should keep playing
  useEffect(() => {
    const el = audio.current
    if (!el || !playable) return
    el.load()
    if (playing) void el.play().catch(() => setPlaying(false))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur])

  function toggle() {
    const el = audio.current
    if (!el || !playable) return
    if (el.paused) void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
    else {
      el.pause()
      setPlaying(false)
    }
  }

  return (
    <div className="pcard pcard--music" style={{ gridArea: 'y' }} ref={glow.ref} onPointerMove={glow.onPointerMove}>
      <Glow />
      <span className="pcard__label">Playlist</span>

      <div className="crate">
        {/* the covers sit behind the folder and rise out of it on hover */}
        <span className="crate__covers" aria-hidden="true">
          {playlist.tracks.map((t, i) => {
            const mid = (playlist.tracks.length - 1) / 2
            return (
              <button
                type="button"
                className="cover"
                key={t.title}
                title={`${t.title} — ${t.artist}`}
                data-on={i === cur}
                onClick={() => setCur(i)}
                style={{
                  ['--x' as string]: `${(i - mid) * 36}px`,
                  ['--r' as string]: `${(i - mid) * 8}deg`,
                  ['--d' as string]: `${i * 55}ms`,
                  ['--art' as string]: t.art,
                  ...(t.cover ? { ['--cover' as string]: `url(${t.cover})` } : {}),
                  zIndex: playlist.tracks.length - Math.abs(i - mid),
                }}
              >
                <span className="cover__art" />
                {!t.cover && <span className="cover__name">{t.title}</span>}
              </button>
            )
          })}
        </span>

        {/* the glass folder front */}
        <span className="crate__folder">
          <span className="crate__brand">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d={marks.spotify} />
            </svg>
            Anirudh · {playlist.tracks.length} tracks
          </span>
        </span>
      </div>

      {/* now playing */}
      <div className="np">
        <button
          type="button"
          className="np__play"
          onClick={toggle}
          disabled={!playable}
          aria-label={playing ? `Pause ${track.title}` : `Play ${track.title}`}
          title={playable ? undefined : 'Add the MP3 to /public/music to play it here'}
        >
          {playing ? (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M7 4h4v16H7zM13 4h4v16h-4z" /></svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M7 3.5 20 12 7 20.5z" /></svg>
          )}
        </button>

        <span className="np__meta">
          <strong>{track.title}</strong>
          <span>{track.artist}</span>
        </span>

        <a className="np__out" href={playlist.href} target="_blank" rel="noreferrer" aria-label="Open in Spotify">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </a>

        <span className="np__bar">
          <i style={{ width: `${pct}%` }} />
        </span>
      </div>

      {playable && (
        <audio
          ref={audio}
          src={track.src}
          preload="none"
          onTimeUpdate={(e) => {
            const el = e.currentTarget
            setPct(el.duration ? (el.currentTime / el.duration) * 100 : 0)
          }}
          onEnded={() => {
            setPct(0)
            setCur((c) => (c + 1) % playlist.tracks.length)
          }}
        />
      )}
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

          {/* Experience — panels, the current role picked out */}
          <div className="fact fact--exp">
            <h3 className="about__sub">Experience</h3>
            <ul className="roles">
              {roleList.map((r, i) => (
                <li className="role" key={r.org} data-now={i === 0}>
                  <span className="role__org">{r.org}</span>
                  <span className="role__title">{r.role}</span>
                  {r.years && <span className="role__years">{r.years}</span>}
                  {i === 0 && <span className="role__now">Current</span>}
                </li>
              ))}
            </ul>
          </div>

          {/* Education — year-led rows, deliberately not panels */}
          <div className="fact fact--edu">
            <h3 className="about__sub">Education</h3>
            <ul className="roles">
              {education.map((e) => (
                <li className="role" key={e.school}>
                  <span className="role__years">{e.years}</span>
                  <span className="role__org">{e.school}</span>
                  <span className="role__title">{e.course}</span>
                </li>
              ))}
            </ul>
          </div>

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

          <MusicCard />
          <StackCard />
          <AwardsCard />
          <PlaceCard />
          <LinksCard />
        </motion.div>
      </div>

    </section>
  )
}
