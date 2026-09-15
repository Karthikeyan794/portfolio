import { useEffect, useRef, useState } from 'react'

/**
 * A line whose last words keep changing: the outgoing phrase lifts away and
 * blurs while the incoming one rises into its place.
 *
 * Three details make it behave. The slot's width is measured off-screen for
 * every phrase and eased between them, so the line never snaps. Nothing is
 * clipped — the words blur as they travel, which keeps the descenders on the
 * italic serif. And the outgoing word is dropped by a timer rather than by an
 * exit animation: an animation that never runs (a background tab freezes them)
 * would leave every old word in the DOM, and with all of them positioned out
 * of flow the slot collapses and the line breaks apart.
 */
const EVERY_MS = 3400
const OUT_MS = 800

export default function RotatingWord({ lead, words }: { lead: string; words: string[] }) {
  const [i, setI] = useState(0)
  const [out, setOut] = useState<number | null>(null)
  const [widths, setWidths] = useState<number[]>([])
  const sizer = useRef<HTMLSpanElement>(null)

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
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (still || words.length < 2) return
    const id = window.setInterval(() => {
      setI((n) => {
        setOut(n)
        return (n + 1) % words.length
      })
    }, EVERY_MS)
    return () => window.clearInterval(id)
  }, [words.length])

  // drop the outgoing word once its exit has had time to play
  useEffect(() => {
    if (out == null) return
    const t = window.setTimeout(() => setOut(null), OUT_MS)
    return () => window.clearTimeout(t)
  }, [out])

  return (
    <span className="rotline">
      {lead}{' '}
      <span className="rotline__slot" aria-live="polite" style={widths[i] ? { width: `${widths[i]}px` } : undefined}>
        {/* laid out, never shown — purely to measure each phrase at this face */}
        <span className="rotline__sizer" ref={sizer} aria-hidden="true">
          {words.map((w) => (
            <span key={w}>{w}</span>
          ))}
        </span>

        {out != null && out !== i && (
          <span className="rotline__word rotline__word--out" key={`out-${out}`} aria-hidden="true">
            {words[out]}
          </span>
        )}
        <span className="rotline__word rotline__word--in" key={`in-${i}`}>
          {words[i]}
        </span>
      </span>
    </span>
  )
}
