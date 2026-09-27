import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { intro } from '../data'
import { marks } from '../logos'
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

const T = { hello: 0.55, line: 0.95, para: 1.75, cta: 2.05, nav: 2.8 }
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

/**
 * The headline: "I design and build" stays put, the line under it finishes
 * the sentence and turns over — "interfaces in Figma." then "front-ends in
 * React." then "faster with Claude." Only the words that change move, and
 * they roll: inside a clipped line, the old word's letters leave upward one
 * after another while the new word's letters rise in from below, so the two
 * never sit on top of each other half-blurred. The words go one after
 * another, left to right, like the line being read; a word that is the same
 * both times ("in") stays and just slides over to make room. The tool is set
 * in its own colour, and its logo lands at the shoulder once the letters
 * have. Timers, not frames, so a throttled tab only slows it. A screen reader
 * gets every line at once.
 */
const EASE = [0.2, 0.8, 0.2, 1] as const
const ROLL_STEP = 0.028 // seconds between one letter and the next
const WORD_GAP = 0.09 // seconds between one word of the line and the next
const letter = {
  in: { y: '110%', opacity: 0 },
  rest: { y: '0%', opacity: 1 },
  out: { y: '-110%', opacity: 0 },
}
const logoPop = {
  in: { scale: 0, rotate: -30, opacity: 0 },
  rest: { scale: 1, rotate: 0, opacity: 1 },
  out: { scale: 0.4, opacity: 0, transition: { duration: 0.2 } },
}

/** logos drawn in their own brand colours, where one colour would not do them justice */
const COLOUR_LOGOS: Record<string, { viewBox: string; paths: [string, string][] }> = {
  figma: {
    viewBox: '0 0 38 57',
    paths: [
      ['M19 28.5a9.5 9.5 0 1 1 19 0 9.5 9.5 0 0 1-19 0z', '#1ABCFE'],
      ['M0 47.5A9.5 9.5 0 0 1 9.5 38H19v9.5a9.5 9.5 0 1 1-19 0z', '#0ACF83'],
      ['M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z', '#FF7262'],
      ['M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z', '#F24E1E'],
      ['M0 28.5A9.5 9.5 0 0 0 9.5 38H19V19H9.5A9.5 9.5 0 0 0 0 28.5z', '#A259FF'],
    ],
  },
}

/**
 * One word that turns over by rolling its letters through a clipped line.
 * `after` is drawn with the word (the tool's logo) and leaves with it.
 */
function Roll({ text, className, style, delay = 0, after }: { text: string; className?: string; style?: React.CSSProperties; delay?: number; after?: React.ReactNode }) {
  return (
    <motion.span className="intro__slot" layout="position" transition={{ layout: { duration: 0.5, ease: EASE } }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={text} className={className ? `intro__roll ${className}` : 'intro__roll'} style={style} initial="in" animate="rest" exit="out">
          {[...text].map((ch, k) => (
            <motion.span key={k} className="intro__ch" variants={letter} transition={{ duration: 0.52, ease: EASE, delay: delay + k * ROLL_STEP }}>
              {ch}
            </motion.span>
          ))}
          {after}
        </motion.span>
      </AnimatePresence>
    </motion.span>
  )
}

function Headline({ start }: { start: number }) {
  const reduce = useReducedMotion()
  const lines = intro.headline
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduce || lines.length < 2) return
    let t: number
    // a hidden tab keeps its timers but not its animations: wait, don't pile up
    const next = () => {
      if (!document.hidden) setI((n) => (n + 1) % lines.length)
      t = window.setTimeout(next, 3200)
    }
    t = window.setTimeout(next, start * 1000 + 2600)
    return () => window.clearTimeout(t)
  }, [reduce, lines.length, start])
  const h = lines[i]

  return (
    <motion.h1 className="intro__h1" {...rise(start)}>
      <span className="sr-only">{`${intro.headlineTop.replace(/\*| \|/g, '')} ${lines.map((l) => `${l.what} ${l.prep} ${l.tool}`).join(', ')}.`}</span>
      <span aria-hidden="true">
        {/* the top line stays put; a word between *asterisks* is the grey
            serif. Its groups (split at ` | `) never break inside, so a narrow
            screen can only wrap it between them. */}
        <span className="intro__l">
          {intro.headlineTop.split(' | ').map((group, gi) => (
            <span key={gi}>
              {gi ? ' ' : ''}
              <span className="intro__keep">
                {group.split(' ').map((w, wi) => {
                  const m = w.match(/^\*(.+)\*$/)
                  return (
                    <span key={wi}>
                      {wi ? ' ' : ''}
                      <span className={m ? 'intro__w intro__serif' : 'intro__w'}>{m ? m[1] : w}</span>
                    </span>
                  )
                })}
              </span>
            </span>
          ))}
        </span>
        <span className="intro__l">
          <Roll text={h.what} />{' '}
          <Roll text={h.prep} delay={WORD_GAP} />{' '}
          <Roll
            text={`${h.tool}.`}
            className="intro__tool"
            style={{ color: h.color }}
            delay={WORD_GAP * 2}
            after={
              (COLOUR_LOGOS[h.mark] || marks[h.mark]) && (
                <motion.svg
                  className={COLOUR_LOGOS[h.mark] ? 'intro__logo intro__logo--tall' : 'intro__logo'}
                  viewBox={COLOUR_LOGOS[h.mark]?.viewBox ?? '0 0 24 24'}
                  variants={logoPop}
                  transition={{ type: 'spring', stiffness: 320, damping: 15, delay: reduce ? 0 : WORD_GAP * 2 + (h.tool.length + 1) * ROLL_STEP + 0.3 }}
                >
                  {COLOUR_LOGOS[h.mark]
                    ? COLOUR_LOGOS[h.mark].paths.map(([d, fill]) => <path key={fill} d={d} fill={fill} />)
                    : <path d={marks[h.mark]} fill="currentColor" />}
                </motion.svg>
              )
            }
          />
        </span>
      </span>
    </motion.h1>
  )
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
  // the hairline frame fades out over the first stretch of scrolling
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const frameFade = useTransform(scrollYProgress, [0, 0.3], [1, 0])
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

  // Where the words start, as --copy-top on the section, so the blur behind
  // them (.intro__veil) begins just above them. The blur lives with the
  // picture, under the frame, so it cannot simply sit behind the words in
  // their own box. Offsets, not boxes: the entrance scales the page, and a
  // measured box would be off by that much.
  const copy = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const section = sectionRef.current
    const main = copy.current
    if (!section || !main || !('ResizeObserver' in window)) return
    const place = () => {
      let top = 0
      let el: HTMLElement | null = main
      while (el && el !== section) {
        top += el.offsetTop
        el = el.offsetParent as HTMLElement | null
      }
      section.style.setProperty('--copy-top', `${top}px`)
    }
    const ro = new ResizeObserver(place)
    ro.observe(section)
    ro.observe(main)
    return () => ro.disconnect()
  }, [])

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
      {/* a light blur across the screen behind the words (see .intro__veil);
          under the fireflies and the frame, which stay sharp on top of it */}
      <div className="intro__veil" aria-hidden="true" />
      {/* fireflies belong to the night garden — in daylight they are specks */}
      {(!useImage || showNight) && <Fireflies />}
      <motion.div className="intro__frame" aria-hidden="true" style={{ opacity: frameFade }}>
        <i /><i /><i /><i />
      </motion.div>
      </div>

      <div className="wrap intro__grid">
        <div className="intro__main" ref={copy}>
          <Hello phrases={intro.hello} delay={T.hello} />

          <Headline start={T.line} />

          <motion.p className="intro__p" {...rise(T.para)}>
            {intro.paragraph}
          </motion.p>

          {/* two ways on: talk to me, or down to the work */}
          <div className="intro__ctas">
            <motion.a
              className="intro__talk"
              href={intro.contactCta.href}
              onClick={(e) => {
                // the contact section is a dialog: open it rather than scroll
                // to it. The href stays, so it still works without JS.
                e.preventDefault()
                window.dispatchEvent(new CustomEvent('open-contact'))
              }}
              {...rise(T.cta)}
            >
              {/* two stacked labels; hover slides the second one up into view */}
              <span className="intro__talk-label">
                <span>{intro.contactCta.label}</span>
                <span aria-hidden="true">{intro.contactCta.hover}</span>
              </span>
              <span className="intro__talk-icon">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </span>
            </motion.a>
            <motion.a className="intro__go" href={intro.cta.href} {...rise(T.cta + 0.1)}>
              {intro.cta.label}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
            </motion.a>
          </div>
        </div>

      </div>

    </section>
  )
}
