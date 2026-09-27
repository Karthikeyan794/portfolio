import { motion } from 'motion/react'
import { marks } from '../logos'
import { useEffect, useRef, useState } from 'react'
import type { Tool } from '../data'
import { aboutLinks, awardsCard, currently, education, experience, intro_about, place, places, playlist, profile, stackCards } from '../data'

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
      {/* one line of type over the picture — no tags */}
      <p className="awards__title">{awardsCard.title}</p>
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
      {/* each place brings its own picture; they cross-fade as you switch */}
      <div className="place" aria-hidden="true">
        {places.map((pl, n) => (
          <img
            key={pl.key}
            className="place__bg"
            src={pl.image}
            alt=""
            data-on={n === which}
            loading="lazy"
            decoding="async"
          />
        ))}
        <span className="place__veil" />
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
  const video = useRef<HTMLVideoElement>(null)
  const [cur, setCur] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [pct, setPct] = useState(0)

  // the video behind the crate is still until a song plays, and runs only
  // while one does
  useEffect(() => {
    const v = video.current
    if (!v) return
    v.muted = true
    if (playing) void v.play().catch(() => {})
    else v.pause()
  }, [playing])

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

  const count = playlist.tracks.length
  const next = () => setCur((c) => (c + 1) % count)
  // a few seconds in, "previous" goes back to the start of this song first
  const prev = () => {
    const el = audio.current
    if (el && el.currentTime > 3) {
      el.currentTime = 0
      return
    }
    setCur((c) => (c - 1 + count) % count)
  }

  /** jump to a point in the song (0..1), and play from there */
  function seek(ratio: number) {
    const el = audio.current
    if (!el || !playable) return
    const r = Math.max(0, Math.min(1, ratio))
    const go = () => {
      if (!el.duration) return
      el.currentTime = r * el.duration
      setPct(r * 100)
      if (el.paused) void el.play().catch(() => setPlaying(false))
    }
    if (el.duration) go()
    else {
      // nothing loaded yet (preload is none): fetch enough to know its length
      el.preload = 'auto'
      el.addEventListener('loadedmetadata', go, { once: true })
      el.load()
    }
  }
  const bar = useRef<HTMLSpanElement>(null)
  const dragging = useRef(false)
  const ratioAt = (clientX: number) => {
    const r = bar.current?.getBoundingClientRect()
    return r && r.width ? (clientX - r.left) / r.width : 0
  }

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
      {/* muted ambience behind the crate: its first frame at rest (#t= asks
          Safari to paint one), moving only while the music plays */}
      {playlist.video && (
        <video
          ref={video}
          className="crate__video"
          src={`${playlist.video}#t=0.1`}
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
        {playlist.href && (
          <a className="np__out" href={playlist.href} target="_blank" rel="noreferrer" aria-label="Open in Spotify">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </a>
        )}
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
          <button type="button" className="np__skip np__skip--prev" onClick={prev} aria-label="Previous track">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4 9 12l10 8zM4 4h3v16H4z" /></svg>
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
          <button type="button" className="np__skip" onClick={next} aria-label="Next track">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M5 4l10 8-10 8zM17 4h3v16h-3z" /></svg>
          </button>
        </span>

        {/* the progress bar is also the way to jump: click or drag anywhere
            on it to play from there; arrow keys step 5 seconds */}
        <span
          ref={bar}
          className="np__bar"
          role="slider"
          tabIndex={playable ? 0 : -1}
          aria-label={`Position in ${track.title}`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pct)}
          onPointerDown={(e) => {
            if (!playable) return
            dragging.current = true
            e.currentTarget.setPointerCapture(e.pointerId)
            const r = ratioAt(e.clientX)
            setPct(Math.max(0, Math.min(1, r)) * 100)
          }}
          onPointerMove={(e) => {
            if (dragging.current) setPct(Math.max(0, Math.min(1, ratioAt(e.clientX))) * 100)
          }}
          onPointerUp={(e) => {
            if (!dragging.current) return
            dragging.current = false
            seek(ratioAt(e.clientX))
          }}
          onPointerCancel={() => { dragging.current = false }}
          onKeyDown={(e) => {
            const el = audio.current
            if (!el || !el.duration) return
            const step = 5 / el.duration
            if (e.key === 'ArrowRight') { e.preventDefault(); seek(el.currentTime / el.duration + step) }
            if (e.key === 'ArrowLeft') { e.preventDefault(); seek(el.currentTime / el.duration - step) }
          }}
        >
          <i style={{ width: `${pct}%` }} />
          <b className="np__knob" style={{ left: `${pct}%` }} aria-hidden="true" />
        </span>
      </div>

      {playable && (
        <audio
          ref={audio}
          src={track.src}
          preload="none"
          onTimeUpdate={(e) => {
            // while the bar is being dragged, the finger decides where it is
            if (dragging.current) return
            const el = e.currentTarget
            setPct(el.duration ? (el.currentTime / el.duration) * 100 : 0)
          }}
          // a pause from the keyboard's media keys or the system's controls
          // still stops the record and the video
          onPlay={() => setPlaying(true)}
          onPause={(e) => { if (!e.currentTarget.ended) setPlaying(false) }}
          onEnded={() => {
            setPct(0)
            next()
          }}
        />
      )}
    </div>
  )
}

export default function About() {
  // both steppers start shut; a stop opens only while you point at it
  const greetingRef = useRef<HTMLHeadingElement>(null)
  const [greetingSeen, setGreetingSeen] = useState(false)
  /**
   * Plain rect maths rather than useInView. The intro wraps the whole page
   * in a 3D transform for its first couple of seconds, and an
   * IntersectionObserver under a 3D ancestor is never called at all — so a
   * `once: true` observer that is missed in that window would leave this
   * heading blank for good.
   */
  useEffect(() => {
    if (greetingSeen) return
    const check = () => {
      const el = greetingRef.current
      if (!el) return
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight * 0.92 && r.bottom > 0) setGreetingSeen(true)
    }
    check()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [greetingSeen])
  const [job, setJob] = useState(-1)
  // each time a job opens, a firefly rises from its dot and drifts away;
  // the count remounts it, so every opening sends a new one
  const [flight, setFlight] = useState(0)
  const openJob = (n: number) => {
    if (n !== job) setFlight((f) => f + 1)
    setJob(n)
  }
  const [school, setSchool] = useState(-1)
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
          <span className="eyebrow">About</span>
          {/* Driven by useInView on the heading rather than whileInView.
              The words start translated fully below their own masks, and an
              element clipped away by an ancestor's overflow never registers
              as intersecting — so the trigger has to watch the heading, and
              watching it explicitly is the version that actually fires. */}
          <h2 className="about__greeting" ref={greetingRef}>
            {intro_about.greeting.split(' ').map((word, i, all) => (
              <span className="rise" key={`${word}-${i}`}>
                <motion.span
                  initial={{ y: '108%' }}
                  animate={greetingSeen ? { y: 0 } : { y: '108%' }}
                  transition={{ delay: 0.08 + i * 0.09, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* the space sits inside the mask, so the heading still
                      reads and copies as a sentence */}
                  {i < all.length - 1 ? `${word}\u00a0` : word}
                </motion.span>
              </span>
            ))}
          </h2>
          <div className="about__text">
            {intro_about.paragraphs.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>

          {/* Experience — a stepper: each stop opens to what the work was */}
          <div className="fact fact--exp">
            <h3 className="about__sub">Experience</h3>
            <ol className="step" onPointerLeave={() => setJob(-1)}>
              {experience.map((r, n) => (
                <li className="step__item" key={r.company} data-open={n === job}>
                  {n === job && (
                    <span className="flybee" key={flight} aria-hidden="true">
                      <img src="/intro/firefly.png" alt="" />
                    </span>
                  )}
                  <button type="button" className="step__head" onPointerEnter={() => openJob(n)} onFocus={() => openJob(n)} onClick={() => openJob(n)} aria-expanded={n === job}>
                    <span className="step__org">{r.short ?? r.company}</span>
                    <span className="step__role">{r.title}</span>
                    <span className="step__when">{r.period}</span>
                  </button>
                  <div className="step__body">
                    <div className="step__inner">
                      <ul className="step__points">
                        {r.points.map((pt) => (
                          <li key={pt.slice(0, 22)}>{pt}</li>
                        ))}
                      </ul>
                      {r.stack && (
                        <span className="step__stack">{r.stack.join(' · ')}</span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Education — the same stepper, hollow markers and a dashed rail */}
          <div className="fact fact--edu">
            <h3 className="about__sub">Education</h3>
            <ol className="step step--edu" onPointerLeave={() => setSchool(-1)}>
              {education.map((e, n) => (
                <li className="step__item" key={e.school} data-open={n === school}>
                  <button type="button" className="step__head" onPointerEnter={() => setSchool(n)} onFocus={() => setSchool(n)} onClick={() => setSchool(n)} aria-expanded={n === school}>
                    <span className="step__org">{e.school}</span>
                    <span className="step__when">{e.years}</span>
                  </button>
                  <div className="step__body">
                    <div className="step__inner">
                      <span className="step__course">{e.course}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
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
            {/* the résumé, beside the profiles: opens the PDF in a new tab */}
            {profile.resumeUrl && (
              <li>
                <a href={profile.resumeUrl} target="_blank" rel="noreferrer" title="Résumé · PDF" style={{ ['--brand' as string]: '#12715b' }}>
                  <span className="plinks__mark" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ fill: 'none' }}>
                      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                      <path d="M14 3v5h5M9 13h6M9 17h4" />
                    </svg>
                  </span>
                  <span className="plinks__label">Resume</span>
                </a>
              </li>
            )}
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
            <img src="/about/drawings.jpg" alt="An ink drawing of two monsters in a sketchbook, held up against the sky" loading="lazy" decoding="async" />
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
