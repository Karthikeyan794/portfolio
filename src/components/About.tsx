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

/** One tool, as a floating pill: its mark on a disc, then its name. */
function ToolChip({ tool }: { tool: Tool }) {
  return (
    <span className="tchip">
      <i className="tchip__mark" aria-hidden="true">
        {tool.mark ? (
          <svg viewBox="0 0 24 24">
            <path d={marks[tool.mark]} />
          </svg>
        ) : (
          <b>{tool.mono}</b>
        )}
      </i>
      {tool.name}
    </span>
  )
}

/**
 * The toolkit, as a deck: one category at a time filling the card, sliding
 * left to right on its own. Pointing at it holds the slide so you can read
 * it, and the pips at the foot jump straight to one.
 */
const SLIDE_MS = 4200

function StackCard() {
  const glow = useGlow<HTMLDivElement>()
  const [i, setI] = useState(0)
  const [held, setHeld] = useState(false)
  // +1 walking forward, -1 walking back. The deck turns round at each end
  // rather than wrapping, so it never rewinds past every slide at once.
  const dir = useRef(1)

  const step = () =>
    setI((n) => {
      if (n + dir.current >= stackCards.length) dir.current = -1
      else if (n + dir.current < 0) dir.current = 1
      return n + dir.current
    })

  useEffect(() => {
    if (held) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(step, SLIDE_MS)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [held])

  // the label has to allow for the turn, or it names the current slide
  // again at either end
  const peek = (() => {
    let d = dir.current
    if (i + d >= stackCards.length) d = -1
    else if (i + d < 0) d = 1
    return i + d
  })()
  const upNext = stackCards[peek]

  return (
    <div
      className="pcard pcard--stack"
      style={{ gridArea: 's' }}
      ref={glow.ref}
      onPointerMove={glow.onPointerMove}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
    >
      <Glow />
      <span className="pcard__label">Toolkit</span>

      <div className="deck">
        <div className="deck__track" style={{ transform: `translateX(-${i * 100}%)` }}>
          {stackCards.map((c, n) => (
            <article className="slide" key={c.no} aria-hidden={n !== i}>
              <img
                className="slide__bg"
                src={c.image}
                alt=""
                loading="lazy"
                decoding="async"
                style={c.shift ? { objectPosition: `center calc(32% + ${c.shift}px)` } : undefined}
              />
              <span className="slide__veil" aria-hidden="true" />
              <span className="slide__body">
                <span className="slide__name">{c.label}</span>
                <span className="slide__apps">
                  {c.tools.map((t) => (
                    <ToolChip key={t.name} tool={t} />
                  ))}
                </span>
              </span>
            </article>
          ))}
        </div>
      </div>

      <div className="deck__nav">
        <span className="pips">
          {stackCards.map((c, n) => (
            <button
              type="button"
              className="pip"
              key={c.no}
              data-on={n === i}
              onClick={() => {
                dir.current = n >= i ? 1 : -1
                setI(n)
              }}
              aria-label={c.label}
            >
              <i style={{ animationDuration: `${SLIDE_MS}ms`, animationPlayState: held ? 'paused' : 'running' }} />
            </button>
          ))}
        </span>

        <button type="button" className="deck__next" onClick={step} aria-label="Next">
          {upNext.label}
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 5 7 7-7 7" />
          </svg>
        </button>
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

      <div className="place__foot">
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

        <div className="pchips">
          {places.map((pl, i) => (
            <button
              type="button"
              className="pchip"
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
      {/* muted ambience behind the crate */}
      {playlist.video && (
        <video
          className="crate__video"
          src={playlist.video}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        />
      )}
      <span className="crate__veil" aria-hidden="true" />

      <span className="np__head">
        <span className="pcard__label pcard__label--over">Playlist</span>
        <a className="np__out" href={playlist.href} target="_blank" rel="noreferrer" aria-label="Open in Spotify">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </a>
      </span>

      {/* words on the left, record on the right */}
      <div className="np">
        <span className="disc" data-spin={playing} aria-hidden="true">
          <span
            className="disc__label"
            style={track.cover ? { backgroundImage: `url(${track.cover})` } : { background: track.art }}
          />
        </span>

        <span className="np__meta">
          <strong>{track.title}</strong>
          <span>{track.artist}</span>
        </span>

        {/* controls sit at the foot, to the right of the track */}
      <span className="np__ctrl">
          <button
            type="button"
            className="np__skip"
            onClick={() => setCur((c) => (c + 1) % playlist.tracks.length)}
            aria-label="Next track"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M5 4l10 8-10 8zM17 4h3v16h-3z" /></svg>
          </button>
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
        </span>

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

          {/* where else to find me */}
          <ul className="plinks">
            {aboutLinks.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noreferrer" title={l.handle} style={{ ['--brand' as string]: l.brand }}>
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
                </a>
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
        </motion.div>
      </div>

    </section>
  )
}
