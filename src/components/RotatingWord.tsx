import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

/**
 * A line whose last words keep changing: the outgoing phrase lifts away and
 * blurs while the incoming one rises into its place.
 *
 * Two details make it feel settled rather than twitchy. The slot's width is
 * measured off-screen for every phrase and animated between them, so the line
 * around it glides instead of snapping. And nothing is clipped — the words
 * fade and blur as they travel, which means a descender on the italic serif
 * never gets sliced off.
 */
const EVERY_MS = 3400

export default function RotatingWord({ lead, words }: { lead: string; words: string[] }) {
  const [i, setI] = useState(0)
  const [widths, setWidths] = useState<number[]>([])
  const sizer = useRef<HTMLSpanElement>(null)
  const still = useReducedMotion()

  // measure each phrase once, and again when the webfont lands or the box resizes
  useEffect(() => {
    const measure = () => {
      const el = sizer.current
      if (!el) return
      const next = Array.from(el.children).map((c) => (c as HTMLElement).getBoundingClientRect().width)
      setWidths((prev) => (next.some((w, k) => Math.abs(w - (prev[k] ?? 0)) > 0.5) ? next : prev))
    }
    measure()
    document.fonts?.ready.then(measure).catch(() => {})
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [words])

  useEffect(() => {
    if (still || words.length < 2) return
    const id = window.setInterval(() => setI((n) => (n + 1) % words.length), EVERY_MS)
    return () => window.clearInterval(id)
  }, [still, words.length])

  return (
    <span className="rotline">
      {lead}{' '}
      <motion.span
        className="rotline__slot"
        aria-live="polite"
        animate={{ width: widths[i] ?? 'auto' }}
        transition={{ type: 'spring', stiffness: 120, damping: 22, mass: 0.7 }}
      >
        {/* laid out, never shown — purely to measure each phrase at this face */}
        <span className="rotline__sizer" ref={sizer} aria-hidden="true">
          {words.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </span>

        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={words[i]}
            className="rotline__word"
            initial={{ opacity: 0, y: '0.48em', scale: 0.96, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: '0em', scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: '-0.42em', scale: 0.98, filter: 'blur(8px)', position: 'absolute' }}
            transition={{ duration: 0.78, ease: [0.16, 1, 0.3, 1] }}
          >
            {words[i]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </span>
  )
}
