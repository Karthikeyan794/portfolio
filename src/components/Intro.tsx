import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { intro, profile } from '../data'

/**
 * Opening hero: a full-screen clip slowly zooms towards the person while the
 * intro lines appear one by one; the nav slides in afterwards (see Site2D).
 * Sound needs a click, so the voice waits for the "Play with voice" button.
 * No clip on disk → a drawn sunset scene in the theme colours takes its place.
 */

const LINE_DELAY = 0.9 // seconds between lines
const FIRST_LINE = 0.9

export const INTRO_NAV_DELAY = FIRST_LINE + LINE_DELAY * (intro.lines.length - 1) + 1.1

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
  u.pitch = 1
  u.onend = onEnd
  u.onerror = onEnd
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(u)
  return true
}

export default function Intro() {
  const [videoOk, setVideoOk] = useState<boolean | null>(null)
  const [speaking, setSpeaking] = useState(false)
  const [spoken, setSpoken] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => () => window.speechSynthesis?.cancel(), [])

  function playVoice() {
    if (speaking) return
    const ok = speak(intro.voice, () => {
      setSpeaking(false)
      setSpoken(true)
    })
    if (ok) setSpeaking(true)
  }

  const focus = `${intro.focus.x}% ${intro.focus.y}%`

  return (
    <section className="intro" id="top" aria-label="Intro">
      {/* backdrop: the clip, or the drawn scene while it loads / if it fails */}
      <div className="intro__zoom" style={{ transformOrigin: focus }}>
        {videoOk !== false && (
          <video
            ref={videoRef}
            className="intro__video"
            data-ready={videoOk === true}
            src={intro.video}
            poster={intro.poster || undefined}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlay={() => setVideoOk(true)}
            onError={() => setVideoOk(false)}
          />
        )}
        <div className="scene" aria-hidden="true" data-fallback={videoOk !== true}>
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
      </div>
      <div className="intro__shade" aria-hidden="true" />

      <div className="wrap intro__content">
        <motion.span
          className="eyebrow intro__eyebrow"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: FIRST_LINE - 0.4, duration: 0.6 }}
        >
          {profile.role} · {profile.location}
        </motion.span>

        <h1 className="intro__lines">
          {intro.lines.map((line, i) => (
            <motion.span
              key={line}
              className="intro__line"
              initial={{ opacity: 0, y: 26, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{ delay: FIRST_LINE + i * LINE_DELAY, duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
            >
              {line}
            </motion.span>
          ))}
        </h1>

        <motion.div
          className="intro__actions"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: INTRO_NAV_DELAY - 0.5, duration: 0.6 }}
        >
          <button className="btn btn--primary" onClick={playVoice} disabled={speaking} aria-pressed={speaking}>
            {speaking ? 'Speaking…' : spoken ? 'Play voice again' : '🔊 Play with voice'}
          </button>
          <a className="btn btn--ghost intro__ghost" href="#work">
            See the work
          </a>
        </motion.div>
      </div>

      <motion.a
        className="intro__scroll"
        href="#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: INTRO_NAV_DELAY + 0.4, duration: 0.8 }}
        aria-label="Scroll to about"
      >
        <span />
      </motion.a>
    </section>
  )
}
