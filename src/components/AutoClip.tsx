import { useEffect, useRef } from 'react'

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
    play()
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? play() : v.pause()),
      { threshold: 0.15 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [src])

  return (
    <video ref={ref} src={src} poster={poster} aria-label={label} autoPlay loop muted playsInline preload="metadata" />
  )
}
