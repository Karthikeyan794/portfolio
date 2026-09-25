import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { intro } from '../data'
import { useTyped } from '../useTyped'
import { useTheme } from '../theme'
import Fireflies from './Fireflies'

/**
 * Opening hero: the night-library picture fills the screen with slow life in
 * it — the shelf light breathing, fireflies in the bushes, the whole picture
 * leaning a little toward the pointer — while the headline (serif punch word
 * on its own line), copy, email → "Say Hello." pill and tool wordmarks
 * appear; the nav slides in last. Sound needs a click, so the voice waits for
 * the small "Play intro voice" control. The clip path is still here for
 * `intro.video` if `intro.image` is ever emptied. No file → drawn scene.
 */

const T = { hello: 0.55, line: 0.95, word: 0.085, para: 1.75, cta: 2.05, tools: 2.35, nav: 2.8 }
export const INTRO_NAV_DELAY = T.nav

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 22, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { delay, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] as const },
})


function Scene({ show }: { show: boolean }) {
  return (
    <div className="scene" aria-hidden="true" data-fallback={show}>
      <div className="scene__sun" />
      <svg className="scene__hills scene__hills--far" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path d="M0 220 C 200 150, 380 260, 560 200 S 900 90, 1100 180 S 1350 250, 1440 200 V 320 H 0 Z" />
      </svg>
      <svg className="scene__hills scene__hills--near" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path d="M0 280 C 240 210, 420 300, 640 250 S 980 170, 1200 240 S 1380 290, 1440 260 V 320 H 0 Z" />
      </svg>
      <div className="scene__figure" />
      <div className="scene__grass" />
    </div>
  )
}

/**
 * The line that types itself above the headline, like a prompt: the name
 * first, then what I do, then where. Each phrase types at a slightly uneven,
 * hand-typed pace, holds, deletes, and the next begins. Timers rather than
 * animation frames, so a throttled tab only slows it down — the text is plain
 * DOM and is there whether or not a frame ever arrives. A screen reader gets
 * every phrase at once instead of letters arriving.
 */
function Hello({ phrases, delay }: { phrases: string[]; delay: number }) {
  const reduce = useReducedMotion()
  // the name stays up longest: it is the one that matters
  const text = useTyped(phrases, { delay, firstHold: 2800, hold: 1800, still: Boolean(reduce) })

  return (
    <motion.p className="intro__hello" {...rise(Math.max(0, delay - 0.3))}>
      <span className="sr-only">{phrases.join(', ')}</span>
      <span aria-hidden="true">
        <span className="intro__prompt">$</span> {text}
        <span className="intro__caret" data-still={reduce ? 'true' : undefined} />
      </span>
    </motion.p>
  )
}

/** 'I *design* and *build*' → its words, the starred ones set in the serif */
function wordsOf(line: string) {
  return line.split(' ').map((w) => {
    const m = w.match(/^\*(.+?)\*([.,!?;:]*)$/)
    return m ? { text: m[1], tail: m[2], serif: true } : { text: w, tail: '', serif: false }
  })
}

export default function Intro() {
  const [ready, setReady] = useState<boolean | null>(null) // null = loading, false = missing
  const theme = useTheme()
  const dark = theme === 'dark'
  // the night clip is only fetched the first time dark is chosen, then kept warm
  const [darkWanted, setDarkWanted] = useState(dark)
  const [darkReady, setDarkReady] = useState(false)
  const lightRef = useRef<HTMLVideoElement>(null)
  const darkRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (dark) setDarkWanted(true)
  }, [dark])
  // With no night version of the clip, the one clip plays in both themes.
  // Without this, dark theme marked it inactive and faded it out, leaving only
  // the still — a video that stopped the moment the theme switched.
  const oneClip = !intro.videoDark
  const lightOn = !dark || oneClip
  // Motion people have asked the system to reduce: the still, not a loop.
  const reduce = useReducedMotion()
  // Off screen, a 2560x1440 decode is pure cost — and it would compete with
  // the scroll the rest of the page depends on. Paused while it is out of view.
  const offscreen = useRef(false)
  const sectionRef = useRef<HTMLElement>(null)
  const mayPlay = () => !offscreen.current && !reduce

  // keep only the visible clip decoding; pause the other after the crossfade
  useEffect(() => {
    const show = lightOn ? lightRef.current : darkRef.current
    const hide = lightOn ? darkRef.current : lightRef.current
    if (mayPlay()) show?.play().catch(() => {})
    const t = window.setTimeout(() => hide?.pause(), 1700)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightOn, darkReady, reduce])

  useEffect(() => {
    const el = sectionRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([entry]) => {
      offscreen.current = !entry.isIntersecting
      const v = lightOn ? lightRef.current : darkRef.current
      if (!v) return
      if (mayPlay()) v.play().catch(() => {})
      else v.pause()
    })
    io.observe(el)
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightOn, reduce])
  const reduce2 = useReducedMotion()
  const useImage = Boolean(intro.image)
  // Light theme shows the library by day, dark theme the same library at
  // night, and switching crossfades between them. Each is fetched the first
  // time its theme is chosen, so a visitor who never leaves light never
  // downloads the night picture at all.
  const hasNight = Boolean(intro.imageDark)
  const showNight = dark && hasNight
  const [wantDay, setWantDay] = useState(!showNight)
  const [wantNight, setWantNight] = useState(showNight)
  const [dayReady, setDayReady] = useState(false)
  const [nightReady, setNightReady] = useState(false)
  useEffect(() => {
    if (showNight) setWantNight(true)
    else setWantDay(true)
  }, [showNight])
  // the section fades in once the picture for the current theme is here
  useEffect(() => {
    if (useImage && (showNight ? nightReady : dayReady)) setReady(true)
  }, [useImage, showNight, nightReady, dayReady])

  // the picture leans a few pixels toward the pointer, so it reads as a place
  // rather than a flat backdrop
  const media = useRef<HTMLDivElement>(null)
  function lean(e: React.PointerEvent<HTMLElement>) {
    const el = media.current
    if (!el || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    el.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3))
    el.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3))
  }

  return (
    <section className="intro" id="top" aria-label="Intro" onPointerMove={lean} ref={sectionRef}>
      {/* Everything that is picture, and nothing that is words: the photo, its
          shade, the fireflies and the hairline frame fade out together over the
          bottom of the hero, so it dissolves into About rather than stopping at
          an edge. One mask on one still wrapper — the picture inside leans and
          breathes, and a mask on that would move with it. */}
      <div className="intro__art">
      <div className="intro__media" ref={media} data-ready={ready === true}>
        {useImage && ready !== false && (
          <div className="intro__pic">
            {wantDay && (
              <div className="intro__layer" data-on={dayReady}>
                <img
                  className="intro__img"
                  src={intro.image}
                  alt=""
                  style={{ objectPosition: intro.imageFocus }}
                  onLoad={() => setDayReady(true)}
                  onError={() => { if (!showNight) setReady(false) }}
                />
              </div>
            )}
            {/* night sits over day, so the switch is one layer fading in or
                out — never both at half, which would dip through the dark */}
            {wantNight && (
              <div className="intro__layer" data-on={showNight && nightReady}>
                <img
                  className="intro__img"
                  src={intro.imageDark}
                  alt=""
                  style={{ objectPosition: intro.imageFocus }}
                  onLoad={() => setNightReady(true)}
                  onError={() => { if (showNight) setReady(false) }}
                />
                {/* the shelf lights, breathing: the same picture blurred and
                    laid over itself in screen mode, so only what is already lit
                    — shelves, desk, globe — swells. Night only: on the day
                    picture it would wash the whole sky out every few seconds. */}
                <img className="intro__img intro__bloom" src={intro.imageDark} alt="" aria-hidden="true" style={{ objectPosition: intro.imageFocus }} />
              </div>
            )}
          </div>
        )}
        {!useImage && ready !== false && (
          <div className="intro__zoom" data-zoom={intro.zoom}>
            {/* the still sits under the clip so there is no empty moment while it loads */}
            {intro.poster && <img className="intro__poster" src={intro.poster} alt="" style={{ objectPosition: intro.imageFocus }} />}
            <video
              ref={lightRef}
              className="intro__video"
              data-active={lightOn}
              src={intro.video}
              poster={intro.poster || undefined}
              style={{ objectPosition: intro.imageFocus }}
              autoPlay={!reduce}
              muted
              loop={intro.loop}
              playsInline
              preload="auto"
              onCanPlay={(e) => {
                setReady(true)
                if (lightOn && mayPlay()) e.currentTarget.play().catch(() => {})
              }}
              onPause={(e) => {
                // browsers pause background media when a tab is hidden — pick
                // it back up, unless it was paused on purpose (off screen, or
                // reduced motion)
                const v = e.currentTarget
                if (lightOn && mayPlay() && !v.ended && document.visibilityState === 'visible') v.play().catch(() => {})
              }}
              onError={() => setReady(false)}
            />
            {darkWanted && intro.videoDark && (
              <video
                ref={darkRef}
                className="intro__video intro__video--dark"
                data-active={dark && darkReady}
                src={intro.videoDark}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                onCanPlay={(e) => {
                  setDarkReady(true)
                  if (dark) e.currentTarget.play().catch(() => {})
                }}
                onPause={(e) => {
                  const v = e.currentTarget
                  if (dark && !v.ended && document.visibilityState === 'visible') v.play().catch(() => {})
                }}
              />
            )}
          </div>
        )}
        <Scene show={ready !== true} />
      </div>
      {/* one shade per picture, crossfading with them: the night one is the
          original, heavier one; the day one keeps the sky bright and pools
          its dark only behind the words (see .intro__shade--day) */}
      <div className="intro__shade" data-on={!useImage || showNight} aria-hidden="true" />
      {useImage && <div className="intro__shade intro__shade--day" data-on={!showNight} aria-hidden="true" />}
      {/* fireflies belong to the night garden — in daylight they are specks */}
      {(!useImage || showNight) && <Fireflies />}
      <div className="intro__frame" aria-hidden="true">
        <i /><i /><i /><i />
      </div>
      </div>

      <div className="wrap intro__grid">
        <div className="intro__main">
          <Hello phrases={intro.hello} delay={T.hello} />

          {/* each word clears out of a blur on its own beat, left to right */}
          <h1 className="intro__h1">
            {(() => {
              let k = 0
              return intro.headline.map((line) => (
                <span className="intro__l" key={line}>
                  {wordsOf(line).map((w, wi, all) => {
                    const at = k++
                    return (
                      <span key={wi}>
                        <motion.span
                          className={w.serif ? 'intro__w intro__serif' : 'intro__w'}
                          initial={reduce2 ? false : { opacity: 0, y: 14, filter: 'blur(10px)' }}
                          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                          transition={{ delay: T.line + at * T.word, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
                        >
                          {w.serif ? <em>{w.text}</em> : w.text}
                          {w.tail}
                        </motion.span>
                        {wi < all.length - 1 ? ' ' : ''}
                      </span>
                    )
                  })}
                </span>
              ))
            })()}
          </h1>

          <motion.p className="intro__p" {...rise(T.para)}>
            {intro.paragraph}
          </motion.p>

          <motion.a className="intro__go" href={intro.cta.href} {...rise(T.cta)}>
            {intro.cta.label}
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M12 5v14M6 13l6 6 6-6" />
            </svg>
          </motion.a>
        </div>

        <motion.aside className="intro__tools" {...rise(T.tools)}>
          <span className="intro__tools-label">{intro.toolsLabel}</span>
          <div className="intro__marks">
            {intro.tools.map((t) => (
              <span key={t.name} className={`mark mark--${t.style}`}>
                {t.name}
              </span>
            ))}
          </div>
        </motion.aside>
      </div>

    </section>
  )
}
