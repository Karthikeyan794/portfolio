import { motion } from 'motion/react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { intro, profile } from '../data'
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

const T = { line: 0.8, gap: 0.45, punch: 1.75, para: 2.2, form: 2.65, tools: 2.95, nav: 3.35 }
export const INTRO_NAV_DELAY = T.nav

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 22, filter: 'blur(6px)' },
  animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  transition: { delay, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] as const },
})

function speak(text: string, onEnd: () => void) {
  if (!('speechSynthesis' in window)) return false
  const u = new SpeechSynthesisUtterance(text)
  const voices = window.speechSynthesis.getVoices()
  const pick =
    voices.find((v) => /en-(IN|GB)/i.test(v.lang) && /female|Samantha|Karen|Moira|Google/i.test(v.name)) ??
    voices.find((v) => /^en/i.test(v.lang)) ??
    null
  if (pick) u.voice = pick
  u.rate = 0.96
  u.onend = onEnd
  u.onerror = onEnd
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(u)
  return true
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m3 8 9 6 9-6" />
    </svg>
  )
}

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
  // keep only the visible clip decoding; pause the other after the crossfade
  useEffect(() => {
    const show = dark ? darkRef.current : lightRef.current
    const hide = dark ? lightRef.current : darkRef.current
    show?.play().catch(() => {})
    const t = window.setTimeout(() => hide?.pause(), 1700)
    return () => window.clearTimeout(t)
  }, [dark, darkReady])
  const [speaking, setSpeaking] = useState(false)
  const [spoken, setSpoken] = useState(false)

  useEffect(() => () => window.speechSynthesis?.cancel(), [])

  function playVoice() {
    if (speaking) return
    const ok = speak(intro.voice, () => {
      setSpeaking(false)
      setSpoken(true)
    })
    if (ok) setSpeaking(true)
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = String(new FormData(e.currentTarget).get('email') ?? '')
    const subject = encodeURIComponent(`Hello from ${email}`)
    const body = encodeURIComponent(`Hi ${profile.name.split(' ')[0]},\n\n`)
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`
  }

  const [ctaA, ctaB] = intro.cta
  const useImage = Boolean(intro.image)

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
    <section className="intro" id="top" aria-label="Intro" onPointerMove={lean}>
      {/* Everything that is picture, and nothing that is words: the photo, its
          shade, the fireflies and the hairline frame fade out together over the
          bottom of the hero, so it dissolves into About rather than stopping at
          an edge. One mask on one still wrapper — the picture inside leans and
          breathes, and a mask on that would move with it. */}
      <div className="intro__art">
      <div className="intro__media" ref={media} data-ready={ready === true}>
        {useImage && ready !== false && (
          <>
            <div className="intro__pic">
              <img
                className="intro__img"
                src={intro.image}
                alt=""
                style={{ objectPosition: intro.imageFocus }}
                onLoad={() => setReady(true)}
                onError={() => setReady(false)}
              />
              {/* the shelf lights, breathing: the same picture blurred and
                  laid over itself in screen mode, so only what is already lit
                  — shelves, desk, globe — swells, and it lines up at any crop */}
              <img className="intro__img intro__bloom" src={intro.image} alt="" aria-hidden="true" style={{ objectPosition: intro.imageFocus }} />
            </div>
          </>
        )}
        {!useImage && ready !== false && (
          <div className="intro__zoom" data-zoom={intro.zoom}>
            {/* the still sits under the clip so there is no empty moment while it loads */}
            {intro.poster && <img className="intro__poster" src={intro.poster} alt="" style={{ objectPosition: intro.imageFocus }} />}
            <video
              ref={lightRef}
              className="intro__video"
              data-active={!dark}
              src={intro.video}
              poster={intro.poster || undefined}
              autoPlay
              muted
              loop={intro.loop}
              playsInline
              preload="auto"
              onCanPlay={(e) => {
                setReady(true)
                if (!dark) e.currentTarget.play().catch(() => {})
              }}
              onPause={(e) => {
                // browsers pause background media when a tab is hidden — pick it back up
                const v = e.currentTarget
                if (!dark && !v.ended && document.visibilityState === 'visible') v.play().catch(() => {})
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
      <div className="intro__shade" aria-hidden="true" />
      <Fireflies />
      <div className="intro__frame" aria-hidden="true">
        <i /><i /><i /><i />
      </div>
      </div>

      <div className="wrap intro__grid">
        <div className="intro__main">
          <h1 className="intro__h1">
            {intro.headline.map((line, i) => (
              <motion.span className="intro__l" key={line} {...rise(T.line + i * T.gap)}>
                {line}
                {i === intro.headline.length - 1 && (
                  <>
                    {' '}
                    <motion.em className="intro__punch" {...rise(T.punch)}>
                      {intro.punch}
                    </motion.em>
                  </>
                )}
              </motion.span>
            ))}
          </h1>

          <motion.p className="intro__p" {...rise(T.para)}>
            {intro.paragraph}
          </motion.p>

          <motion.form className="intro__form" onSubmit={onSubmit} {...rise(T.form)}>
            <label className="intro__field">
              <MailIcon />
              <input name="email" type="email" required placeholder={intro.placeholder} aria-label="Your email" autoComplete="email" />
            </label>
            <button type="submit" className="intro__cta">
              {ctaA} <em>{ctaB}</em>
            </button>
          </motion.form>

          <motion.button
            type="button"
            className="intro__voice"
            onClick={playVoice}
            disabled={speaking}
            aria-pressed={speaking}
            {...rise(T.form + 0.2)}
          >
            {speaking ? 'Speaking…' : spoken ? 'Play intro voice again' : 'Play intro voice'}
          </motion.button>
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
