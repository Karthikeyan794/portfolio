import { useEffect, useRef, useState } from 'react'

/**
 * The artwork beside Problem and Solution is a stipple — white dots on black.
 * So rather than lighting a picture of dots, this turns it into actual dots
 * and lets the cursor push them around: they flee the pointer, then spring
 * home. A wake through a particle field, which is what the image already
 * looks like.
 *
 * How it works: the image is drawn once into a small offscreen canvas, its
 * pixels are read, and every pixel bright enough to be part of the artwork
 * becomes a particle. From then on nothing touches the image again — each
 * frame just moves points and paints them.
 *
 * It falls back to the plain <img> when any of that is a bad idea: reduced
 * motion, no pointer to follow, a canvas that will not give up its pixels,
 * or a file that is not there.
 */

/** roughly how many dots to end up with — the sampling step is derived from it */
const TARGET = 7000
/** a pixel this bright or brighter is part of the artwork, not the ground */
const CUTOFF = 60
/** how far the cursor's push reaches, in canvas pixels */
const REACH = 110
const REACH2 = REACH * REACH

type P = {
  hx: number // home
  hy: number
  x: number
  y: number
  vx: number
  vy: number
  r: number
  a: number
}

export default function ParticleShot({ src, alt, onFail }: { src: string; alt: string; onFail?: () => void }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    // the cases where the plain picture is simply the right answer
    const still =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(hover: none)').matches
    if (still) return

    const wrap = wrapRef.current
    const canvas = canvasRef.current
    if (!wrap || !canvas) return

    let raf = 0
    let stopped = false
    let particles: P[] = []
    // pointer in canvas space; -1 parks it outside so nothing is pushed
    let px = -1e4
    let py = -1e4
    let dpr = 1
    let w = 0
    let h = 0

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.decoding = 'async'

    /** read the image once and turn its bright pixels into points */
    const build = () => {
      const box = wrap.getBoundingClientRect()
      if (!box.width || !box.height) return false
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = Math.round(box.width)
      h = Math.round(box.height)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`

      // contain the image in the box, the way object-fit: contain would
      const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight)
      const dw = Math.round(img.naturalWidth * scale)
      const dh = Math.round(img.naturalHeight * scale)
      const dx = Math.round((w - dw) / 2)
      const dy = Math.round((h - dh) / 2)

      const off = document.createElement('canvas')
      off.width = dw
      off.height = dh
      const octx = off.getContext('2d', { willReadFrequently: true })
      if (!octx) return false
      octx.drawImage(img, 0, 0, dw, dh)

      let data: Uint8ClampedArray
      try {
        data = octx.getImageData(0, 0, dw, dh).data
      } catch {
        return false // tainted canvas — leave the <img> in place
      }

      // one pass to count what is bright, so the step lands near TARGET
      let bright = 0
      for (let i = 0; i < data.length; i += 4) {
        if (data[i] + data[i + 1] + data[i + 2] > CUTOFF * 3) bright++
      }
      if (!bright) return false
      const step = Math.max(1, Math.round(Math.sqrt(bright / TARGET)))

      const out: P[] = []
      for (let y = 0; y < dh; y += step) {
        for (let x = 0; x < dw; x += step) {
          const i = (y * dw + x) * 4
          const lum = (data[i] + data[i + 1] + data[i + 2]) / 3
          if (lum < CUTOFF) continue
          out.push({
            hx: dx + x,
            hy: dy + y,
            x: dx + x,
            y: dy + y,
            vx: 0,
            vy: 0,
            // brighter pixels sit slightly larger and more opaque, which is
            // what keeps the orb reading as an orb once it is only points
            r: lum > 190 ? 1.15 : 0.8,
            a: 0.42 + (lum / 255) * 0.58,
          })
        }
      }
      if (out.length < 200) return false
      particles = out
      return true
    }

    /** one repaint. Split out from the loop so the very first frame can be
     *  drawn synchronously — the <img> is hidden the moment the canvas is
     *  shown, and if that handoff waited on rAF (throttled tab, battery
     *  saver) the reader would be handed an empty black box. */
    const paint = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#fff'

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        const dx = p.x - px
        const dy = p.y - py
        const d2 = dx * dx + dy * dy
        if (d2 < REACH2 && d2 > 0.01) {
          // push hardest at the centre, fading to nothing at the edge
          const d = Math.sqrt(d2)
          const push = (1 - d / REACH) ** 2 * 26
          p.vx += (dx / d) * push
          p.vy += (dy / d) * push
        }
        // spring home, and lose speed so it settles rather than orbits
        p.vx = (p.vx + (p.hx - p.x) * 0.055) * 0.82
        p.vy = (p.vy + (p.hy - p.y) * 0.055) * 0.82
        p.x += p.vx
        p.y += p.vy

        ctx.globalAlpha = p.a
        ctx.fillRect(p.x, p.y, p.r, p.r)
      }
      ctx.globalAlpha = 1
    }

    const frame = () => {
      if (stopped) return
      paint()
      raf = requestAnimationFrame(frame)
    }

    const onMove = (e: PointerEvent) => {
      const b = canvas.getBoundingClientRect()
      px = e.clientX - b.left
      py = e.clientY - b.top
    }
    const onLeave = () => {
      px = -1e4
      py = -1e4
    }

    // only run while it is on screen; a field of 7000 points costs battery
    let io: IntersectionObserver | null = null
    const start = () => {
      if (!raf) raf = requestAnimationFrame(frame)
    }
    const pause = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
    }

    img.onload = () => {
      if (stopped || !build()) return
      paint() // fill the canvas before it is ever shown
      setLive(true)
      wrap.addEventListener('pointermove', onMove)
      wrap.addEventListener('pointerleave', onLeave)
      io = new IntersectionObserver(([en]) => (en.isIntersecting ? start() : pause()), { threshold: 0.05 })
      io.observe(canvas)
    }
    img.onerror = () => onFail?.()
    img.src = src

    const onResize = () => {
      if (!particles.length) return
      pause()
      if (build()) {
        paint()
        start()
      }
    }
    window.addEventListener('resize', onResize)

    return () => {
      stopped = true
      pause()
      io?.disconnect()
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [src, onFail])

  return (
    <div className="pshot" ref={wrapRef}>
      {/* the picture stays in the DOM: it is what a reader without the canvas
          sees, and it is what carries the alt text either way */}
      <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => onFail?.()} data-hidden={live} />
      <canvas ref={canvasRef} aria-hidden="true" data-on={live} />
    </div>
  )
}
