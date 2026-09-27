import { useEffect, useRef } from 'react'

/**
 * Fireflies over the night garden on the landing screen.
 *
 * Canvas, not DOM. Each firefly has a depth: the far ones are small, sharp
 * points of light with a little starburst when they flare; the nearer ones
 * are bigger, softer glows. Every one
 * comes and goes — it fades in somewhere, drifts on a slow curving path,
 * glows, and fades out, then turns up again elsewhere — so the garden is
 * always changing but never fills up. Tiny specks twinkle between them.
 *
 * They drift away from the pointer when it comes near, and a click on the
 * picture lets a few more loose from that spot. The layer takes no pointer
 * events itself — it listens to the page — so the buttons above it work as
 * normal. It sleeps when scrolled away or when the tab is hidden, and holds
 * still for anyone who asks for reduced motion.
 */

type Fly = {
  x: number; y: number; vx: number; vy: number
  heading: number; turn: number; speed: number
  z: number // 0 = far and sharp, 1 = near and soft
  phase: number; rate: number
  life: number; ttl: number
  tint: number
  burst: boolean // let loose by a click: gone for good when it fades
}
type Speck = { x: number; y: number; phase: number; rate: number; r: number }

const WARM = ['255, 214, 140', '255, 196, 112', '255, 234, 176']

/** a firefly's light: a white-hot core, a warm glow, a wide faint halo */
function glow(rgb: string) {
  const c = document.createElement('canvas')
  c.width = c.height = 96
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(48, 48, 0, 48, 48, 48)
  grad.addColorStop(0, 'rgba(255, 252, 235, 1)')
  grad.addColorStop(0.07, 'rgba(255, 246, 210, 1)')
  grad.addColorStop(0.16, `rgba(${rgb}, 0.9)`)
  grad.addColorStop(0.38, `rgba(${rgb}, 0.26)`)
  grad.addColorStop(0.7, `rgba(${rgb}, 0.07)`)
  grad.addColorStop(1, `rgba(${rgb}, 0)`)
  g.fillStyle = grad
  g.fillRect(0, 0, 96, 96)
  return c
}

/** the starburst a sharp firefly throws when it flares */
function rays(rgb: string) {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  g.translate(64, 64)
  for (let i = 0; i < 6; i++) {
    g.rotate(Math.PI / 6 + (i % 2 ? 0.12 : -0.08))
    const len = i % 3 === 0 ? 62 : 38
    const grad = g.createLinearGradient(-len, 0, len, 0)
    grad.addColorStop(0, `rgba(${rgb}, 0)`)
    grad.addColorStop(0.5, `rgba(255, 244, 205, 0.85)`)
    grad.addColorStop(1, `rgba(${rgb}, 0)`)
    g.fillStyle = grad
    g.fillRect(-len, -0.7, len * 2, 1.4)
  }
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
    const glows = WARM.map(glow)
    const flares = WARM.map(rays)

    let w = 0, h = 0, dpr = 1
    let flies: Fly[] = []
    let specks: Speck[] = []
    const pointer = { x: -9999, y: -9999 }
    let raf = 0, last = 0, t = 0
    let visible = true

    // most low, in the bushes and round the desk; a few up by the shelves
    const spot = () => {
      const low = Math.random() < 0.7
      return { x: Math.random() * w, y: h * (low ? 0.5 + Math.random() * 0.45 : 0.22 + Math.random() * 0.3) }
    }

    const make = (x: number, y: number, burst = false): Fly => {
      // depth: mostly far and sharp, the rest nearer and softer
      const z = burst ? 0.2 + Math.random() * 0.3 : Math.random() < 0.65 ? Math.random() * 0.45 : 0.45 + Math.random() * 0.4
      const heading = Math.random() * Math.PI * 2
      const kick = burst ? 0.8 + Math.random() * 0.9 : 0
      return {
        x, y,
        vx: Math.cos(heading) * kick, vy: Math.sin(heading) * kick - (burst ? 0.4 : 0),
        heading,
        turn: (Math.random() - 0.5) * 0.9,
        // the near ones cross the frame faster: parallax
        speed: 0.12 + z * 0.4 + Math.random() * 0.12,
        z,
        phase: Math.random() * Math.PI * 2,
        rate: 0.5 + Math.random() * 1.2,
        life: burst ? 0 : -Math.random() * 3, // ambient ones start staggered
        ttl: burst ? 3 + Math.random() * 3 : 7 + Math.random() * 9,
        tint: Math.floor(Math.random() * WARM.length),
        burst,
      }
    }

    const seed = () => {
      const n = Math.min(50, Math.max(22, Math.round((w * h) / 26000)))
      flies = Array.from({ length: n }, () => {
        const p = spot()
        const f = make(p.x, p.y)
        f.life = Math.random() * f.ttl * 0.8 // some already mid-glow on arrival
        return f
      })
      const m = Math.min(90, Math.round((w * h) / 16000))
      specks = Array.from({ length: m }, () => ({
        x: Math.random() * w,
        y: h * (0.25 + Math.random() * 0.75),
        phase: Math.random() * Math.PI * 2,
        rate: 0.8 + Math.random() * 2.2,
        r: 0.6 + Math.random() * 0.9,
      }))
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

    /** 0 → 1 → 0 over a fly's life: fade in, glow, fade out */
    const presence = (f: Fly) => {
      if (f.life <= 0) return 0
      const fadeIn = f.burst ? 0.35 : 1.4
      const fadeOut = f.burst ? 1.4 : 2.2
      return Math.min(1, f.life / fadeIn) * Math.min(1, Math.max(0, (f.ttl - f.life) / fadeOut))
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'

      // the specks: pin-points that twinkle between the fireflies
      ctx.fillStyle = 'rgba(255, 238, 190, 1)'
      for (const s of specks) {
        const a = Math.pow(Math.max(0, Math.sin(t * s.rate + s.phase)), 6) * 0.8
        if (a < 0.03) continue
        ctx.globalAlpha = a
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fill()
      }

      for (const f of flies) {
        const on = presence(f)
        if (on < 0.01) continue
        // a slow breath, with a brighter flare now and then
        const pulse = Math.pow(Math.max(0, Math.sin(t * f.rate + f.phase)), 2)
        const a = on * (0.55 + 0.45 * pulse)
        // far ones are smaller; the middle ones bigger and softer
        const d = (18 + f.z * 46) * (1 + pulse * 0.6)
        ctx.globalAlpha = Math.min(1, a * (0.9 + f.z * 0.3))
        ctx.drawImage(glows[f.tint], f.x - d / 2, f.y - d / 2, d, d)
        // the sharp ones throw a small starburst at the peak of a flare
        if (f.z < 0.45 && pulse > 0.75) {
          const r = d * 1.5
          ctx.globalAlpha = Math.min(1, a * (pulse - 0.75) * 3.2)
          ctx.drawImage(flares[f.tint], f.x - r / 2, f.y - r / 2, r, r)
        }
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
        f.life += dt
        // a slow curving path: the heading turns a little, and now and then
        // changes its mind about which way
        f.turn += (Math.random() - 0.5) * 0.08 * k
        f.turn = Math.max(-1.1, Math.min(1.1, f.turn))
        f.heading += f.turn * 0.012 * k
        const ax = Math.cos(f.heading) * f.speed, ay = Math.sin(f.heading) * f.speed * 0.7 - 0.02
        f.vx += (ax - f.vx) * 0.04 * k
        f.vy += (ay - f.vy) * 0.04 * k
        // shy of the pointer
        const dx = f.x - pointer.x, dy = f.y - pointer.y
        const dd = dx * dx + dy * dy
        if (dd < 150 * 150 && dd > 1) {
          const d = Math.sqrt(dd), push = (1 - d / 150) * 0.3 * k
          f.vx += (dx / d) * push
          f.vy += (dy / d) * push
        }
        f.x += f.vx * k; f.y += f.vy * k
        // keep off the sky, wrap round the sides
        if (f.y < h * 0.15) f.heading = Math.PI / 2
        if (f.y > h + 30) f.y = h * 0.6
        if (f.x < -60) f.x = w + 60
        if (f.x > w + 60) f.x = -60
      }
      // the ones that have faded turn up again somewhere else; the ones a
      // click let loose are gone for good
      flies = flies.filter((f) => !f.burst || f.life < f.ttl)
      for (let i = 0; i < flies.length; i++) {
        const f = flies[i]
        if (!f.burst && f.life >= f.ttl) {
          const p = spot()
          flies[i] = make(p.x, p.y)
        }
      }
      for (const s of specks) s.y -= 0.03 * k
      for (const s of specks) if (s.y < h * 0.2) { s.y = h; s.x = Math.random() * w }
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
      // not when the click is for a button or a link
      if ((e.target as Element | null)?.closest('input, button, a, textarea, label')) return
      const room = 84 - flies.length
      for (let i = 0; i < Math.min(7, room); i++) flies.push(make(p.x, p.y, true))
    }
    const onVis = () => (document.visibilityState === 'hidden' ? halt() : run())

    size()
    if (still) {
      // one quiet frame: everyone lit, nothing moving
      for (const f of flies) f.life = f.ttl / 2
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
