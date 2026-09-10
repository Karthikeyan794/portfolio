import { useEffect, useRef } from 'react'

type Flake = { x: number; y: number; size: number; speed: number; sway: number; phase: number; rot: number; spin: number; alpha: number }

/**
 * Smooth snowfall over the landing screen: a canvas of sprite flakes falling
 * at depth-based speeds with a gentle sway and slow spin. Time-based so it is
 * smooth at any frame rate; sleeps while the hero is off-screen or the tab is
 * hidden; skipped entirely for reduced-motion users.
 */
export default function SnowLayer({ sprite = '/snowflake.svg', density = 1 }: { sprite?: string; density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.src = sprite
    let flakes: Flake[] = []
    let w = 0
    let h = 0
    let dpr = 1
    let raf = 0
    let last = 0
    let visible = true
    let hidden = document.visibilityState === 'hidden'

    const make = (fromTop: boolean): Flake => {
      const depth = Math.random() // 0 = far/small/slow, 1 = near/big/fast
      const size = 8 + depth * depth * 26
      return {
        x: Math.random() * w,
        y: fromTop ? -size - Math.random() * 40 : Math.random() * h,
        size,
        speed: 14 + depth * 34, // px per second
        sway: 8 + Math.random() * 22,
        phase: Math.random() * Math.PI * 2,
        rot: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.5,
        alpha: 0.35 + depth * 0.55,
      }
    }

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round(Math.min(90, Math.max(35, w / 16)) * density)
      flakes = Array.from({ length: count }, () => make(false))
    }

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame)
      if (!visible || hidden) {
        last = t
        return
      }
      const dt = Math.min(0.05, (t - last) / 1000 || 0.016)
      last = t
      ctx.clearRect(0, 0, w, h)
      const wind = Math.sin(t / 9000) * 10 // slow global drift, px/s
      for (const f of flakes) {
        f.y += f.speed * dt
        f.phase += dt * (0.6 + f.speed / 60)
        f.x += (Math.sin(f.phase) * f.sway * 0.4 + wind) * dt
        f.rot += f.spin * dt
        if (f.y > h + f.size) Object.assign(f, make(true))
        if (f.x < -f.size) f.x = w + f.size
        if (f.x > w + f.size) f.x = -f.size
        if (!img.complete) continue
        ctx.globalAlpha = f.alpha
        ctx.translate(f.x, f.y)
        ctx.rotate(f.rot)
        ctx.drawImage(img, -f.size / 2, -f.size / 2, f.size, f.size)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
      ctx.globalAlpha = 1
    }

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0 })
    io.observe(canvas)
    const onVis = () => { hidden = document.visibilityState === 'hidden' }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('resize', resize)
    resize()
    raf = requestAnimationFrame((t) => { last = t; frame(t) })

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('resize', resize)
    }
  }, [sprite, density])

  return <canvas ref={ref} className="snow" aria-hidden="true" />
}
