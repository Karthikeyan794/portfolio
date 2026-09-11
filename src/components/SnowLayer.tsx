import { useEffect, useRef } from 'react'

type Flake = { x: number; y: number; size: number; speed: number; sway: number; phase: number; rot: number; spin: number; alpha: number; scale: number }
type Shard = {
  kind: 'crystal' | 'dust' | 'flake'
  x: number; y: number; vx: number; vy: number
  size: number; rot: number; spin: number
  life: number; ttl: number
  tint: string
}
type Flash = { x: number; y: number; life: number; ttl: number; max: number; rot: number }

const ICE = ['#eaf6ff', '#cfe8ff', '#9ec9ff', '#6fb0ff', '#ffffff']

/** an elongated crystal shard: kite shape with a lighter facet down the middle */
function drawCrystal(ctx: CanvasRenderingContext2D, size: number, tint: string) {
  const L = size
  const W = size * 0.34
  ctx.beginPath()
  ctx.moveTo(0, -L)
  ctx.lineTo(W, -L * 0.2)
  ctx.lineTo(0, L * 0.55)
  ctx.lineTo(-W, -L * 0.2)
  ctx.closePath()
  ctx.fillStyle = tint
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(0, -L * 0.9)
  ctx.lineTo(W * 0.35, -L * 0.2)
  ctx.lineTo(0, L * 0.4)
  ctx.closePath()
  ctx.fillStyle = 'rgba(255,255,255,0.65)'
  ctx.fill()
}

/**
 * Smooth snowfall over the landing screen: a canvas of sprite flakes falling
 * at depth-based speeds with a gentle sway and slow spin. Time-based so it is
 * smooth at any frame rate; sleeps while the hero is off-screen or the tab is
 * hidden; skipped entirely for reduced-motion users. Click a flake and it
 * shatters like ice: a bright flash, crystal shards flying out with drag and
 * gravity, and a dusting of fine sparkle (buttons underneath still work — the
 * layer never takes pointer events, it only listens to the page's clicks).
 * If public/burst.png exists it is drawn as an expanding flash behind the shards.
 */
export default function SnowLayer({ sprite = '/snowflake.svg', burstSprite = '/burst.png', density = 1 }: { sprite?: string; burstSprite?: string; density?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const img = new Image()
    img.src = sprite
    // optional burst artwork — silently unused when the file is missing
    const burstImg = new Image()
    let burstOk = false
    burstImg.onload = () => { burstOk = burstImg.naturalWidth > 0 }
    burstImg.src = burstSprite
    let flakes: Flake[] = []
    let shards: Shard[] = []
    let flashes: Flash[] = []
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
        scale: 1,
      }
    }

    // hover: the flake under the pointer swells a little and the cursor becomes a hand
    let hovered: Flake | null = null
    const host = canvas.parentElement as HTMLElement | null
    const nearestFlake = (px: number, py: number) => {
      let hit: Flake | null = null
      let best = Infinity
      for (const f of flakes) {
        if (f.y < -f.size) continue
        const d = Math.hypot(f.x - px, f.y - py)
        const reach = Math.max(42, f.size * 1.6)
        if (d < reach && d < best) {
          best = d
          hit = f
        }
      }
      return hit
    }
    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      const px = e.clientX - r.left
      const py = e.clientY - r.top
      const inside = px >= 0 && py >= 0 && px <= r.width && py <= r.height
      const next = inside ? nearestFlake(px, py) : null
      if (next !== hovered) {
        hovered = next
        if (host) host.style.cursor = hovered ? 'pointer' : ''
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
      const power = 0.7 + f.size / 30 // bigger flake → bigger blast
      const push = (kind: Shard['kind'], n: number, speed: number, size: () => number, ttl: () => number) => {
        for (let i = 0; i < n; i++) {
          const a = Math.random() * Math.PI * 2
          const v = speed * (0.45 + Math.random()) * power
          shards.push({
            kind,
            x: f.x,
            y: f.y,
            vx: Math.cos(a) * v,
            vy: Math.sin(a) * v - 30 * power,
            size: size(),
            rot: a + Math.PI / 2, // crystals point away from the centre
            spin: (Math.random() - 0.5) * 6,
            life: 0,
            ttl: ttl(),
            tint: ICE[Math.floor(Math.random() * ICE.length)],
          })
        }
      }
      push('crystal', 9 + Math.round(power * 6), 210, () => 4 + Math.random() * 9 * power, () => 0.75 + Math.random() * 0.5)
      push('flake', 3 + Math.round(power * 2), 150, () => 4 + Math.random() * 6, () => 0.6 + Math.random() * 0.4)
      push('dust', 26 + Math.round(power * 14), 260, () => 0.8 + Math.random() * 1.8, () => 0.35 + Math.random() * 0.45)
      flashes.push({ x: f.x, y: f.y, life: 0, ttl: 0.6, max: 40 + f.size * 2.2, rot: Math.random() * Math.PI * 2 })
      Object.assign(f, make(true))
    }

    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      const px = e.clientX - r.left
      const py = e.clientY - r.top
      if (px < 0 || py < 0 || px > r.width || py > r.height) return
      // generous hit-test: nearest flake within reach (moving targets are hard to click exactly)
      const hit = nearestFlake(px, py)
      if (hit) {
        if (hovered === hit) hovered = null
        burst(hit)
        if (host) host.style.cursor = ''
      } else sparkle(px, py) // missed — still give a little feedback
    }

    /** a tiny puff for clicks that don't land on a flake */
    const sparkle = (x: number, y: number) => {
      for (let i = 0; i < 10; i++) {
        const a = Math.random() * Math.PI * 2
        const v = 40 + Math.random() * 70
        shards.push({ kind: 'dust', x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 20, size: 0.8 + Math.random() * 1.4, rot: 0, spin: 0, life: 0, ttl: 0.3 + Math.random() * 0.25, tint: ICE[Math.floor(Math.random() * ICE.length)] })
      }
      flashes.push({ x, y, life: 0, ttl: 0.35, max: 14, rot: 0 })
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
        // ease towards the hover size (1.4×) or back to normal
        const targetScale = f === hovered ? 1.4 : 1
        f.scale += (targetScale - f.scale) * Math.min(1, dt * 9)
        if (!img.complete) continue
        const sz = f.size * f.scale
        ctx.globalAlpha = f === hovered ? Math.min(1, f.alpha + 0.3) : f.alpha
        ctx.translate(f.x, f.y)
        ctx.rotate(f.rot)
        ctx.drawImage(img, -sz / 2, -sz / 2, sz, sz)
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
      // flash: a soft radial glow (or the burst artwork) that blooms and fades
      for (const g of flashes) {
        g.life += dt
        const k = g.life / g.ttl
        if (k >= 1) continue
        const ease = 1 - Math.pow(1 - k, 3)
        const r = 6 + g.max * ease
        ctx.globalAlpha = (1 - k) * 0.9
        if (burstOk) {
          ctx.translate(g.x, g.y)
          ctx.rotate(g.rot)
          const sz = r * 2.4
          ctx.drawImage(burstImg, -sz / 2, -sz / 2, sz, sz)
          ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
        } else {
          const grad = ctx.createRadialGradient(g.x, g.y, 0, g.x, g.y, r)
          grad.addColorStop(0, 'rgba(255,255,255,0.9)')
          grad.addColorStop(0.35, 'rgba(190,225,255,0.5)')
          grad.addColorStop(1, 'rgba(120,180,255,0)')
          ctx.fillStyle = grad
          ctx.beginPath()
          ctx.arc(g.x, g.y, r, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      flashes = flashes.filter((g) => g.life < g.ttl)
      // shards: fly out with drag, fall, spin, fade — eased so it feels like ice, not confetti
      for (const p of shards) {
        p.life += dt
        p.vy += (p.kind === 'dust' ? 140 : 300) * dt
        const drag = p.kind === 'dust' ? 2.6 : 1.9
        p.vx *= 1 - drag * dt
        p.vy *= 1 - drag * 0.35 * dt
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.rot += p.spin * dt
        const k = 1 - p.life / p.ttl
        if (k <= 0) continue
        ctx.globalAlpha = Math.min(1, k * k * 1.6)
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        if (p.kind === 'crystal') drawCrystal(ctx, p.size, p.tint)
        else if (p.kind === 'flake') { if (img.complete) ctx.drawImage(img, -p.size / 2, -p.size / 2, p.size, p.size) }
        else {
          ctx.fillStyle = p.tint
          ctx.beginPath()
          ctx.arc(0, 0, p.size, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      }
      shards = shards.filter((p) => p.life < p.ttl)
      ctx.globalAlpha = 1
    }

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0 })
    io.observe(canvas)
    const onVis = () => { hidden = document.visibilityState === 'hidden' }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('resize', resize)
    window.addEventListener('pointerdown', onPointer)
    window.addEventListener('pointermove', onMove, { passive: true })
    resize()
    if (import.meta.env.DEV) {
      // dev-only probe for testing the hit-test without a real mouse
      ;(window as unknown as { __snow?: unknown }).__snow = {
        flakes: () => flakes,
        shards: () => shards.length,
        flashes: () => flashes.length,
        rect: () => canvas.getBoundingClientRect(),
        hovered: () => (hovered ? { x: hovered.x, y: hovered.y, scale: hovered.scale } : null),
        cursor: () => host?.style.cursor ?? '',
      }
    }
    raf = requestAnimationFrame((t) => { last = t; frame(t) })

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointerdown', onPointer)
      window.removeEventListener('pointermove', onMove)
      if (host) host.style.cursor = ''
    }
  }, [sprite, burstSprite, density])

  return <canvas ref={ref} className="snow" aria-hidden="true" />
}
