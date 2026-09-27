import { useEffect, useRef } from 'react'
import { ambience } from '../audio/ambience'

/**
 * Fireflies over the night garden on the landing screen.
 *
 * Canvas, not DOM. A small swarm — fourteen on a wide screen, eight on a
 * phone — each the drawn firefly (/intro/firefly.png) rather than a dot of
 * light. Each one faces the way it flies, flutters its wings, and its tail
 * glows in a slow breath. Now and then it flares: a little starburst, and
 * with the sound on a small chime from its side of the screen. Every one
 * comes and goes — it fades in somewhere, wanders on a slow curving path,
 * and fades out, then turns up again elsewhere.
 *
 * They drift away from the pointer when it comes near. The layer takes no
 * pointer events itself — it listens to the page — so the buttons above it
 * work as normal. It sleeps when scrolled away or when the tab is hidden,
 * and holds still for anyone who asks for reduced motion.
 */

type Fly = {
  x: number; y: number; vx: number; vy: number
  heading: number; turn: number; speed: number
  size: number
  phase: number; rate: number; beat: number
  life: number; ttl: number
  flared: boolean // mid-flare already: chime once per flare, not every frame
  spark: boolean // whether this breath ends in a sparkle — most just glow
  rolled: boolean // already decided at this dim point
}

const SRC = '/intro/firefly.png'
// in the picture the head points up and to the left: this turns it to face +x
const FACE = (125 * Math.PI) / 180

/** the tail's light: a white-hot core, a warm glow, a wide faint halo */
function glow() {
  const c = document.createElement('canvas')
  c.width = c.height = 96
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(48, 48, 0, 48, 48, 48)
  grad.addColorStop(0, 'rgba(255, 252, 235, 1)')
  grad.addColorStop(0.1, 'rgba(255, 238, 190, 0.95)')
  grad.addColorStop(0.3, 'rgba(255, 200, 110, 0.35)')
  grad.addColorStop(0.65, 'rgba(255, 190, 100, 0.08)')
  grad.addColorStop(1, 'rgba(255, 190, 100, 0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 96, 96)
  return c
}

/** the starburst of a flare */
function rays() {
  const c = document.createElement('canvas')
  c.width = c.height = 128
  const g = c.getContext('2d')!
  g.translate(64, 64)
  for (let i = 0; i < 6; i++) {
    g.rotate(Math.PI / 6 + (i % 2 ? 0.12 : -0.08))
    const len = i % 3 === 0 ? 62 : 38
    const grad = g.createLinearGradient(-len, 0, len, 0)
    grad.addColorStop(0, 'rgba(255, 214, 140, 0)')
    grad.addColorStop(0.5, 'rgba(255, 244, 205, 0.85)')
    grad.addColorStop(1, 'rgba(255, 214, 140, 0)')
    g.fillStyle = grad
    g.fillRect(-len, -0.7, len * 2, 1.4)
  }
  return c
}

export default function Fireflies({ className = '', on = true }: { className?: string; on?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const light = glow()
    const flare = rays()
    const bug = new Image()
    bug.src = SRC

    let w = 0, h = 0, dpr = 1
    let flies: Fly[] = []
    const pointer = { x: -9999, y: -9999 }
    let raf = 0, last = 0, t = 0
    let visible = true

    // over the garden, not the sky: mostly low, a few up by the shelves
    const spot = () => ({ x: w * (0.08 + Math.random() * 0.84), y: h * (0.3 + Math.random() * 0.6) })

    const make = (x: number, y: number): Fly => {
      const heading = Math.random() * Math.PI * 2
      const small = w < 720
      return {
        x, y, vx: 0, vy: 0,
        heading,
        turn: (Math.random() - 0.5) * 0.9,
        speed: 0.35 + Math.random() * 0.3,
        // small, like a real firefly across a garden; a little variety for depth
        size: (small ? 18 : 22) + Math.random() * (small ? 6 : 10),
        phase: Math.random() * Math.PI * 2,
        rate: 0.5 + Math.random() * 0.6,
        beat: 16 + Math.random() * 6, // wing beats a second
        life: -Math.random() * 2,
        ttl: 9 + Math.random() * 8,
        flared: false,
        spark: Math.random() < 0.15,
        rolled: false,
      }
    }

    const seed = () => {
      const n = w < 720 ? 8 : 14
      flies = Array.from({ length: n }, () => {
        const p = spot()
        const f = make(p.x, p.y)
        f.life = Math.random() * f.ttl * 0.7 // some already about on arrival
        return f
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

    /** 0 → 1 → 0 over a fly's life: fade in, about, fade out */
    const presence = (f: Fly) => {
      if (f.life <= 0) return 0
      return Math.min(1, f.life / 1.6) * Math.min(1, Math.max(0, (f.ttl - f.life) / 2.2))
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const f of flies) {
        const on = presence(f)
        if (on < 0.01) continue
        // the tail breathes; now and then it flares
        const pulse = Math.pow(Math.max(0, Math.sin(t * f.rate + f.phase)), 2)
        const face = Math.atan2(f.vy, f.vx) || f.heading
        // the tail is behind the middle of the body
        const tx = f.x - Math.cos(face) * f.size * 0.28
        const ty = f.y - Math.sin(face) * f.size * 0.28

        // its light first, so the body sits on its own glow
        ctx.globalCompositeOperation = 'lighter'
        const g = f.size * (1.3 + pulse * 1.1)
        ctx.globalAlpha = on * (0.45 + pulse * 0.55)
        ctx.drawImage(light, tx - g / 2, ty - g / 2, g, g)

        // the firefly, facing where it flies, wings a-flutter
        if (bug.complete && bug.naturalWidth) {
          ctx.globalCompositeOperation = 'source-over'
          ctx.globalAlpha = on * (0.85 + pulse * 0.15)
          const flutter = still ? 1 : 0.82 + 0.18 * Math.abs(Math.sin(t * f.beat * Math.PI))
          const bw = f.size, bh = f.size * (bug.naturalHeight / bug.naturalWidth)
          ctx.save()
          ctx.translate(f.x, f.y)
          ctx.rotate(face)
          ctx.scale(1, flutter) // across the body: the wings
          ctx.rotate(FACE)
          ctx.drawImage(bug, -bw / 2, -bh / 2, bw, bh)
          ctx.restore()
        }

        // the flare: a starburst at the tail, and a chime with the sound on
        if (f.spark && pulse > 0.82) {
          if (!f.flared && on > 0.6) ambience.sparkle((f.x / w) * 2 - 1, 0.7)
          f.flared = true
          ctx.globalCompositeOperation = 'lighter'
          const r = f.size * 1.6
          ctx.globalAlpha = Math.min(1, on * (pulse - 0.82) * 5)
          ctx.drawImage(flare, tx - r / 2, ty - r / 2, r, r)
        }
        // at the dimmest point between breaths, decide the next one: with a
        // swarm about, only one breath in seven ends in a sparkle
        if (pulse < 0.05) {
          if (!f.rolled) {
            f.spark = Math.random() < 0.15
            f.flared = false
            f.rolled = true
          }
        } else if (pulse > 0.5) {
          f.rolled = false
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
      for (let i = 0; i < flies.length; i++) {
        const f = flies[i]
        f.life += dt
        // a slow curving path: the heading turns a little, and now and then
        // changes its mind about which way
        f.turn += (Math.random() - 0.5) * 0.08 * k
        f.turn = Math.max(-1, Math.min(1, f.turn))
        f.heading += f.turn * 0.012 * k
        const ax0 = Math.cos(f.heading) * f.speed, ay0 = Math.sin(f.heading) * f.speed
        // stay over the garden: steer back from the edges and the sky
        let ax = ax0, ay = ay0
        if (f.y < h * 0.22) ay += 0.25
        if (f.y > h * 0.94) ay -= 0.25
        if (f.x < w * 0.04) ax += 0.25
        if (f.x > w * 0.96) ax -= 0.25
        if (ax !== ax0 || ay !== ay0) f.heading = Math.atan2(ay, ax)
        f.vx += (ax - f.vx) * 0.04 * k
        f.vy += (ay - f.vy) * 0.04 * k
        // shy of the pointer
        const dx = f.x - pointer.x, dy = f.y - pointer.y
        const dd = dx * dx + dy * dy
        if (dd < 160 * 160 && dd > 1) {
          const d = Math.sqrt(dd), push = (1 - d / 160) * 0.3 * k
          f.vx += (dx / d) * push
          f.vy += (dy / d) * push
        }
        f.x += f.vx * k; f.y += f.vy * k
        // faded out: it turns up again somewhere else
        if (f.life >= f.ttl) {
          const p = spot()
          flies[i] = make(p.x, p.y)
        }
      }
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

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      const sx = r.width ? w / r.width : 1, sy = r.height ? h / r.height : 1
      const inside = e.clientY >= r.top && e.clientY <= r.bottom
      pointer.x = inside ? (e.clientX - r.left) * sx : -9999
      pointer.y = inside ? (e.clientY - r.top) * sy : -9999
    }
    const onVis = () => (document.visibilityState === 'hidden' ? halt() : run())

    // one quiet frame for reduced motion: everyone about, nothing moving
    const stillFrame = () => {
      for (const f of flies) f.life = f.ttl / 2
      t = 1.3
      draw()
    }
    bug.onload = () => { if (still) stillFrame() }

    size()
    if (still) stillFrame()
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
    document.addEventListener('visibilitychange', onVis)
    run()

    return () => {
      halt()
      io.disconnect()
      ro.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas ref={ref} className={`fireflies ${className}`.trim()} data-on={on} aria-hidden="true" />
}
