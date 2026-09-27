/**
 * Let one firefly loose from a point on the page, flying the way the swarm
 * on the landing picture does: it faces where it is going, its wings
 * flutter, it wanders on a slow curving path — here with a pull upwards, so
 * it leaves — and it fades out after a few seconds. The See my work button
 * and the experience timeline both send theirs off with this.
 *
 * Plain DOM and one requestAnimationFrame loop per firefly; it removes
 * itself when done. Nothing flies for anyone who asks for reduced motion.
 */

const SRC = '/intro/firefly.png'
// in the drawing the head points up and to the left: this turns it to face +x
const FACE = 125

export function releaseFirefly(pageX: number, pageY: number, opts: { size?: number; life?: number } = {}) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const size = opts.size ?? 26
  const life = opts.life ?? 5.5

  const el = document.createElement('span')
  el.className = 'flyer'
  el.setAttribute('aria-hidden', 'true')
  el.style.width = `${size}px`
  el.style.height = `${size}px`
  const img = document.createElement('img')
  img.src = SRC
  img.alt = ''
  el.appendChild(img)
  document.body.appendChild(el)

  let x = pageX, y = pageY
  // it sets off upwards, a little to one side
  let heading = -Math.PI / 2 + (Math.random() - 0.5) * 1.1
  let turn = (Math.random() - 0.5) * 0.8
  let vx = Math.cos(heading) * 0.4, vy = Math.sin(heading) * 0.4
  const speed = 1 + Math.random() * 0.35
  const beat = 16 + Math.random() * 6
  let t = 0, last = 0

  const step = (now: number) => {
    const dt = Math.min(0.05, (now - (last || now)) / 1000)
    last = now
    t += dt
    const k = dt * 60
    // the swarm's flight: the heading turns a little, and changes its mind
    turn += (Math.random() - 0.5) * 0.08 * k
    turn = Math.max(-1, Math.min(1, turn))
    heading += turn * 0.014 * k
    // …with a gentle pull upwards, so it goes rather than hovers
    const ax = Math.cos(heading) * speed
    const ay = Math.sin(heading) * speed - 0.35
    vx += (ax - vx) * 0.05 * k
    vy += (ay - vy) * 0.05 * k
    x += vx * k
    y += vy * k

    const face = Math.atan2(vy, vx)
    const flutter = 0.82 + 0.18 * Math.abs(Math.sin(t * beat * Math.PI))
    // fade in over a moment, out over the last second and a half
    const a = Math.min(1, t / 0.25) * Math.min(1, Math.max(0, (life - t) / 1.5))
    el.style.opacity = String(a)
    el.style.transform =
      `translate(${x - size / 2}px, ${y - size / 2}px) rotate(${face}rad) scale(1, ${flutter}) rotate(${FACE}deg)`

    if (t < life) requestAnimationFrame(step)
    else el.remove()
  }
  requestAnimationFrame(step)
}

/** the middle of an element, in page coordinates */
export function pageCentre(el: Element) {
  const r = el.getBoundingClientRect()
  return { x: r.left + r.width / 2 + window.scrollX, y: r.top + r.height / 2 + window.scrollY }
}
