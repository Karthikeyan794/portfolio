import { useEffect, useRef } from 'react'
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
 */
export default function AutoClip({ src, poster, label }: { src: string; poster?: string; label?: string }) {
  const ref = useRef<HTMLVideoElement>(null)

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
  }, [src])

  return (
    <video ref={ref} src={src} poster={poster} aria-label={label} loop muted playsInline preload="metadata" />
  )
}
