import { useEffect, useRef } from 'react'

/**
 * Fireflies over the night garden on the landing screen.
 *
 * Canvas, not DOM: forty soft lights that wander, blink on and off, and
 * drift away from the pointer when it comes near. A click anywhere on the
 * picture lets a few more loose from that spot; those fade out after a few
 * seconds, so the garden never fills up. The layer takes no pointer events
 * itself — it listens to the page — so the form and buttons above it work as
 * normal. It sleeps when scrolled away or when the tab is hidden, and holds
 * still for anyone who asks for reduced motion.
 */

type Fly = {
  x: number; y: number; vx: number; vy: number
  r: number; phase: number; rate: number
  life: number; ttl: number // ttl 0 = lives forever
}

const WARM = ['255, 214, 140', '255, 190, 110', '255, 232, 170']

/** one glow, drawn once and stamped for every fly */
function sprite(rgb: string) {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, `rgba(255, 250, 225, 1)`)
  grad.addColorStop(0.12, `rgba(${rgb}, 0.95)`)
  grad.addColorStop(0.4, `rgba(${rgb}, 0.28)`)
  grad.addColorStop(1, `rgba(${rgb}, 0)`)
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  return c
}

export default function Fireflies({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const sprites = WARM.map(sprite)

    let w = 0, h = 0, dpr = 1
    let flies: (Fly & { s: number })[] = []
    const pointer = { x: -9999, y: -9999 }
    let raf = 0, last = 0, t = 0
    let visible = true

    const make = (x: number, y: number, ttl = 0, burst = false): Fly & { s: number } => {
      const a = Math.random() * Math.PI * 2
      const kick = burst ? 0.6 + Math.random() * 0.9 : 0.08
      return {
        x, y,
        vx: Math.cos(a) * kick, vy: Math.sin(a) * kick - (burst ? 0.3 : 0),
        r: 5 + Math.random() * 7,
        phase: Math.random() * Math.PI * 2,
        rate: 0.6 + Math.random() * 1.1,
        life: 0, ttl,
        s: Math.floor(Math.random() * sprites.length),
      }
    }

    // most of them low, in the bushes and round the desk; a few up by the shelves
    const seed = () => {
      const n = Math.min(44, Math.max(18, Math.round((w * h) / 34000)))
      flies = Array.from({ length: n }, () => {
        const low = Math.random() < 0.72
        return make(Math.random() * w, h * (low ? 0.55 + Math.random() * 0.42 : 0.3 + Math.random() * 0.3))
      })
    }

    const size = () => {
      // layout size, not getBoundingClientRect: the page tilts in on first
      // load, and a transformed box would size the canvas wrong for good
      dpr = Math.min(2, window.devicePixelRatio || 1)
      const first = w === 0
      w = canvas.clientWidth; h = canvas.clientHeight
      if (!w || !h) return
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (first) seed()
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'
      for (const f of flies) {
        // blink: mostly dim, then a slow swell of light
        const pulse = Math.pow(Math.max(0, Math.sin(t * f.rate + f.phase)), 3)
        let a = 0.12 + 0.88 * pulse
        if (f.ttl) a *= Math.min(1, f.life / 0.4) * Math.max(0, 1 - f.life / f.ttl)
        if (a < 0.02) continue
        const d = f.r * (1.6 + pulse * 1.2) * 2
        ctx.globalAlpha = a
        ctx.drawImage(sprites[f.s], f.x - d / 2, f.y - d / 2, d, d)
      }
      ctx.globalAlpha = 1
      ctx.globalCompositeOperation = 'source-over'
    }

    const step = (now: number) => {
      raf = requestAnimationFrame(step)
      const dt = Math.min(0.05, (now - (last || now)) / 1000)
      last = now
      t += dt
      const k = dt * 60
      for (const f of flies) {
        // wander
        f.vx += (Math.random() - 0.5) * 0.035 * k
        f.vy += ((Math.random() - 0.5) * 0.035 - 0.0015) * k
        // shy of the pointer
        const dx = f.x - pointer.x, dy = f.y - pointer.y
        const dd = dx * dx + dy * dy
        if (dd < 140 * 140 && dd > 1) {
          const d = Math.sqrt(dd), push = (1 - d / 140) * 0.22 * k
          f.vx += (dx / d) * push
          f.vy += (dy / d) * push
        }
        const damp = Math.pow(0.965, k)
        f.vx *= damp; f.vy *= damp
        f.x += f.vx * k; f.y += f.vy * k
        // round the edges, never lost
        if (f.x < -20) f.x = w + 20
        if (f.x > w + 20) f.x = -20
        if (f.y < h * 0.18) f.vy += 0.02 * k
        if (f.y > h + 20) f.y = h * 0.6
        if (f.ttl) f.life += dt
      }
      flies = flies.filter((f) => !f.ttl || f.life < f.ttl)
      draw()
    }

    const run = () => {
      if (still || raf || !visible || document.visibilityState === 'hidden') return
      last = 0
      raf = requestAnimationFrame(step)
    }
    const halt = () => {
      cancelAnimationFrame(raf)
      raf = 0
    }

    const inside = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      const sx = r.width ? w / r.width : 1, sy = r.height ? h / r.height : 1
      return { x: (e.clientX - r.left) * sx, y: (e.clientY - r.top) * sy, in: e.clientY >= r.top && e.clientY <= r.bottom }
    }
    const onMove = (e: PointerEvent) => {
      const p = inside(e)
      pointer.x = p.in ? p.x : -9999
      pointer.y = p.in ? p.y : -9999
    }
    const onDown = (e: PointerEvent) => {
      const p = inside(e)
      if (!p.in || still) return
      // not when the click is for the form or a button
      if ((e.target as Element | null)?.closest('input, button, a, textarea, label')) return
      const room = 80 - flies.length
      for (let i = 0; i < Math.min(7, room); i++) flies.push(make(p.x, p.y, 4 + Math.random() * 4, true))
    }
    const onVis = () => (document.visibilityState === 'hidden' ? halt() : run())

    size()
    if (still) {
      t = 1.3
      draw()
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible) run()
      else halt()
    })
    io.observe(canvas)
    const ro = new ResizeObserver(() => {
      size()
      if (still) draw()
    })
    ro.observe(canvas)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown)
    document.addEventListener('visibilitychange', onVis)
    run()

    return () => {
      halt()
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas ref={ref} className={`fireflies ${className}`.trim()} aria-hidden="true" />
}
