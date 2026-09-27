import { useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

/**
 * A project card's cover, moving: the project's own recording, muted and on
 * a loop, laid over the still cover. It only plays while the card is on
 * screen and pauses when it leaves, so a grid of cards never decodes more
 * than it shows. For anyone who asks for reduced motion it stays on its first
 * frame, and if the file will not load it removes itself and the still cover
 * under it is what shows.
 */
export default function CardClip({ src, poster, className }: { src: string; poster?: string; className: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()
  const [dead, setDead] = useState(false)

  useEffect(() => {
    const v = ref.current
    if (!v || reduce) return
    // React's `muted` prop alone does not set the attribute autoplay checks
    v.muted = true
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) void v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.3 },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [reduce, dead])

  if (dead) return null
  return (
    <video
      ref={ref}
      className={className}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      onError={() => setDead(true)}
    />
  )
}
