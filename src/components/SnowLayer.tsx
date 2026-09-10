import { useEffect, useRef } from 'react'

type Flake = { x: number; y: number; size: number; speed: number; sway: number; phase: number; rot: number; spin: number; alpha: number }
type Shard = { x: number; y: number; vx: number; vy: number; size: number; rot: number; spin: number; life: number; ttl: number }
type Ring = { x: number; y: number; life: number; ttl: number; max: number }

/**
 * Smooth snowfall over the landing screen: a canvas of sprite flakes falling
 * at depth-based speeds with a gentle sway and slow spin. Time-based so it is
 * smooth at any frame rate; sleeps while the hero is off-screen or the tab is
 * hidden; skipped entirely for reduced-motion users. Click a flake and it
 * bursts into shards with a small ice ring (buttons underneath still work —
 * the layer never takes pointer events, it only listens to the page's clicks).
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
    let shards: Shard[] = []
    let rings: Ring[] = []
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

    const burst = (f: Flake) => {
      const n = 10 + Math.round(f.size / 3)
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2
        const v = 90 + Math.random() * 190 + f.size * 3
        shards.push({
          x: f.x,
          y: f.y,
          vx: Math.cos(a) * v,
          vy: Math.sin(a) * v - 40,
          size: 2 + Math.random() * Math.max(3, f.size * 0.28),
          rot: Math.random() * Math.PI * 2,
          spin: (Math.random() - 0.5) * 12,
          life: 0,
          ttl: 0.55 + Math.random() * 0.5,
        })
      }
      rings.push({ x: f.x, y: f.y, life: 0, ttl: 0.5, max: 22 + f.size * 1.4 })
      Object.assign(f, make(true))
    }

    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      const px = e.clientX - r.left
      const py = e.clientY - r.top
      if (px < 0 || py < 0 || px > r.width || py > r.height) return
      let hit: Flake | null = null
      let best = Infinity
      for (const f of flakes) {
        const d = Math.hypot(f.x - px, f.y - py)
        const reach = Math.max(16, f.size * 0.75)
        if (d < reach && d < best) {
          best = d
          hit = f
        }
      }
      if (hit) burst(hit)
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
      // shards: fly out, fall, spin, fade
      for (const p of shards) {
        p.life += dt
        p.vy += 320 * dt
        p.vx *= 1 - 1.6 * dt
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.rot += p.spin * dt
        const k = 1 - p.life / p.ttl
        if (k <= 0) continue
        ctx.globalAlpha = Math.min(1, k * 1.4)
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        if (img.complete) ctx.drawImage(img, -p.size / 2, -p.size / 2, p.size, p.size)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
      shards = shards.filter((p) => p.life < p.ttl)
      // ice rings
      for (const g of rings) {
        g.life += dt
        const k = g.life / g.ttl
        if (k >= 1) continue
        ctx.globalAlpha = (1 - k) * 0.7
        ctx.strokeStyle = '#eaf6ff'
        ctx.lineWidth = 2 * (1 - k) + 0.5
        ctx.beginPath()
        ctx.arc(g.x, g.y, 4 + g.max * (1 - Math.pow(1 - k, 2)), 0, Math.PI * 2)
        ctx.stroke()
      }
      rings = rings.filter((g) => g.life < g.ttl)
      ctx.globalAlpha = 1
    }

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0 })
    io.observe(canvas)
    const onVis = () => { hidden = document.visibilityState === 'hidden' }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('resize', resize)
    window.addEventListener('pointerdown', onPointer)
    resize()
    raf = requestAnimationFrame((t) => { last = t; frame(t) })

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointerdown', onPointer)
    }
  }, [sprite, density])

  return <canvas ref={ref} className="snow" aria-hidden="true" />
}
