import { motion } from 'motion/react'
import { useEffect, useState, type FormEvent } from 'react'
import { intro, profile } from '../data'

/**
 * Opening hero: the picture (or clip) fills the screen with slow life in it —
 * clouds drifting, mist moving over the valley, a breeze in the grass — while
 * the headline (serif punch word), copy, email → "Say Hello." pill and tool
 * wordmarks appear; the nav slides in last. Sound needs a click, so the voice
 * waits for the small "Play intro voice" control. No file → drawn sunset scene.
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

  return (
    <section className="intro" id="top" aria-label="Intro">
      <div className="intro__media" data-ready={ready === true}>
        {useImage && ready !== false && (
          <>
            <img
              className="intro__img"
              src={intro.image}
              alt=""
              style={{ objectPosition: intro.imageFocus }}
              onLoad={() => setReady(true)}
              onError={() => setReady(false)}
            />
            {/* breeze layer: same picture, masked to the grass, swaying */}
            <div className="intro__grass" aria-hidden="true">
              <img className="intro__img" src={intro.image} alt="" style={{ objectPosition: intro.imageFocus }} />
            </div>
            <div className="intro__clouds" aria-hidden="true">
              <i />
              <i />
            </div>
            <div className="intro__mist" aria-hidden="true" />
          </>
        )}
        {!useImage && ready !== false && (
          <div className="intro__zoom" data-zoom={intro.zoom}>
            <video
              className="intro__video"
              src={intro.video}
              autoPlay
              muted
              loop={intro.loop}
              playsInline
              preload="auto"
              onCanPlay={() => setReady(true)}
              onError={() => setReady(false)}
            />
          </div>
        )}
        <Scene show={ready !== true} />
      </div>
      <div className="intro__shade" aria-hidden="true" />
      <div className="intro__frame" aria-hidden="true">
        <i /><i /><i /><i />
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

      <motion.a
        className="intro__scroll"
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: T.nav + 0.4, duration: 0.8 }}
        aria-label="Scroll down"
      >
        <span />
      </motion.a>
    </section>
  )
}
