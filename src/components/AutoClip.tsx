import { useEffect, useRef, useState } from 'react'
import { isScrolling, onScrollState } from '../scrollIdle'

/**
 * A clip that plays itself.
 *
 * Autoplay needs `muted` to be true on the element — React sets it as a
 * property, and a browser that has not seen the attribute treats the video as
 * sound-on and refuses to start it, leaving a still first frame that looks
 * simply broken. So mute it here, ask it to play, and ask again whenever it
 * comes back into view. It pauses off-screen: decoding a clip nobody is
 * looking at is wasted battery.
 *
 * `fallback` is the second address to try. The largest recordings are served
 * from a GitHub release rather than from /public, because they are over the
 * 100 MB a file may be in a repository — and anything off this deploy can be
 * absent or served with a content type the browser will not play. So a failure
 * is a normal event here, not an exception: drop to the smaller copy, and if
 * that fails too say so, rather than leaving a dead frame on the page.
 */
export default function AutoClip({
  src,
  poster,
  label,
  fallback,
  onFail,
  onFallback,
}: {
  src: string
  poster?: string
  label?: string
  fallback?: string
  onFail?: () => void
  /** told which address was settled on, when the first one did not work */
  onFallback?: (src: string) => void
}) {
  const ref = useRef<HTMLVideoElement>(null)
  // which address is in the element right now; starts at the good one
  const [using, setUsing] = useState(src)
  useEffect(() => setUsing(src), [src])

  useEffect(() => {
    const v = ref.current
    if (!v) return
    v.muted = true
    const play = () => { void v.play().catch(() => {}) }
    // Nothing plays on mount. Asking every clip to play as it mounts starts
    // nine decodes at once on a page where only one is ever in view — the
    // pile-up this is meant to prevent. The observer below starts the one
    // that is actually being looked at.
    //
    // Two conditions, not one: a clip plays only while it is properly on
    // screen AND the page is still. 0.15 started playback when a clip was
    // barely in view, so two or three decoded at once during a scroll — on
    // this page that is three 4K decodes competing with the scroll itself.
    let onScreen = false
    const settle = () => {
      if (onScreen && !isScrolling()) play()
      else v.pause()
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        settle()
      },
      { threshold: 0.55 },
    )
    io.observe(v)
    const off = onScrollState(settle)
    return () => {
      io.disconnect()
      off()
    }
  }, [using])

  return (
    <video
      ref={ref}
      src={using}
      poster={poster}
      aria-label={label}
      loop
      muted
      playsInline
      preload="metadata"
      onError={() => {
        if (fallback && using !== fallback) {
          setUsing(fallback)
          onFallback?.(fallback)
        } else onFail?.()
      }}
    />
  )
}
