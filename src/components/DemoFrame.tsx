import { useEffect, useRef, useState } from 'react'

export type DemoPage = { label: string; hash: string; role?: 'admin' | 'support' | 'viewer' | 'user'; hint?: string }

/**
 * The product itself, running inside the case study.
 *
 * A window drawn around an iframe: a tab strip that drives the app's own
 * router through its hash (same origin, so no reload), an address line, a
 * button to open it full screen. Until you click into it the iframe takes no
 * pointer events, so scrolling the page past it never gets caught inside the
 * app; move the pointer out of the window and it goes quiet again.
 * Clicking in also brings the whole window up to the top of the screen, so
 * the app is never half below the fold while you use it.
 */
export default function DemoFrame({ src, pages = [], art, title = 'Product demo', host = 'product.demo', roleKey = 'sd.demoRole' }: {
  src: string; pages?: DemoPage[]; art?: string; title?: string; host?: string
  /** the localStorage key the demo reads its signed-in role from at start-up */
  roleKey?: string
}) {
  const [hash, setHash] = useState(pages[0]?.hash ?? '')
  const [tab, setTab] = useState(0)
  const [live, setLive] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const frame = useRef<HTMLIFrameElement>(null)
  const view = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLDivElement>(null)
  const win = useRef<HTMLDivElement>(null)
  // true while the page glides up to the window: the pointer stays still and
  // the window moves under it, which is not the reader leaving
  const gliding = useRef(false)

  // click to interact: the app wakes, and the page glides until the window's
  // top sits just under the top of the screen (the header has stepped away)
  function start(e: React.MouseEvent) {
    setLive(true)
    const el = win.current
    if (!el) return
    const mouse = (e.nativeEvent as PointerEvent).pointerType !== 'touch' && (e.nativeEvent as PointerEvent).pointerType !== 'pen'
    let at = { x: e.clientX, y: e.clientY }
    const track = (ev: PointerEvent) => { at = { x: ev.clientX, y: ev.clientY } }
    gliding.current = true
    let ended = false
    const done = () => {
      if (ended) return
      ended = true
      gliding.current = false
      window.removeEventListener('pointermove', track)
      window.removeEventListener('scrollend', done)
      // a mouse that has ended up outside the window after all puts it back to
      // sleep, so scrolling the page never gets caught inside the app
      const r = win.current?.getBoundingClientRect()
      if (mouse && r && (at.x < r.left || at.x > r.right || at.y < r.top || at.y > r.bottom)) setLive(false)
    }
    window.addEventListener('pointermove', track, { passive: true })
    window.addEventListener('scrollend', done)
    window.setTimeout(done, 1200) // where there is no scrollend, or nothing to scroll
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const top = el.getBoundingClientRect().top + window.scrollY - 16
    window.scrollTo({ top: Math.max(0, top), behavior: still ? 'auto' : 'smooth' })
    // keys go straight to the app, without the focus itself scrolling anything
    frame.current?.focus({ preventScroll: true })
  }

  // the first tab's role, set before the demo starts and reads it: without
  // this a role left over from an earlier visit would open under the wrong tab
  useEffect(() => {
    const r = pages[0]?.role
    if (!r) return
    try {
      localStorage.setItem(roleKey, r)
    } catch {
      /* storage blocked: the demo falls back to its own default */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // while the window is on screen the page's fixed header steps out of the
  // way — it would sit over the top of the app. Announced as an event so the
  // header, which lives two components up, can listen without a prop chain.
  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        window.dispatchEvent(new CustomEvent('demo-inview', { detail: entry.isIntersecting }))
        // off screen, the app goes back to sleep — the way a touch screen,
        // which has no pointer to leave, puts it down
        if (!entry.isIntersecting) setLive(false)
      },
      { threshold: 0.2 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.dispatchEvent(new CustomEvent('demo-inview', { detail: false }))
    }
  }, [])
  // the app is built for a desktop. Below DESIGN px of room it is not squeezed
  // but drawn at DESIGN px and scaled down to fit, so a phone sees the desk
  // whole — and the height follows the viewport rather than a fixed ratio.
  const DESIGN = 1100
  const [fit, setFit] = useState({ scale: 1, height: 0 })
  useEffect(() => {
    const el = view.current
    if (!el) return
    const measure = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      setFit({ scale: Math.min(1, w / DESIGN), height: h })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  const scaled = fit.scale < 1
  const frameStyle = scaled && fit.height
    ? { width: `${DESIGN}px`, height: `${fit.height / fit.scale}px`, transform: `scale(${fit.scale})`, transformOrigin: 'top left' }
    : undefined

  function go(i: number) {
    const p = pages[i]
    if (!p) return
    setTab(i)
    setHash(p.hash)
    try {
      const w = frame.current?.contentWindow
      if (!w) return
      if (p.role) {
        // the demo reads its signed-in role once, at start-up, from `roleKey`
        // (the Support Desk build is patched for it — see its clips README;
        // Atom reads labs.roleView as it ships), so a change of role is a
        // reload; a change of page alone is just the hash
        w.localStorage.setItem(roleKey, p.role)
        setLoaded(false)
        w.location.hash = p.hash
        w.location.reload()
      } else {
        w.location.hash = p.hash
      }
    } catch {
      /* not same-origin after all — the src below still carries the hash */
    }
  }

  const path = hash.replace(/^#/, '')
  return (
    <div className="dfr" ref={root}>
      {art && <img className="dfr__desk" src={art} alt="" aria-hidden="true" />}
      <span className="dfr__tint" aria-hidden="true" />

      <div
        className={live ? 'dfr__win dfr__win--live' : 'dfr__win'}
        ref={win}
        onPointerLeave={(e) => {
          if (e.pointerType === 'mouse' && !gliding.current) setLive(false)
        }}
      >
        <div className="dfr__bar">
          <span className="dfr__dots" aria-hidden="true"><i /><i /><i /></span>
          {pages.length > 0 && (
            <div className="dfr__tabs" role="tablist" aria-label="Pages of the demo">
              {pages.map((p, i) => (
                <button
                  key={p.label}
                  type="button"
                  role="tab"
                  aria-selected={tab === i}
                  className={tab === i ? 'dfr__tab dfr__tab--on' : 'dfr__tab'}
                  onClick={() => go(i)}
                  title={p.hint}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
          <span className="dfr__pill"><i aria-hidden="true" />Product demo</span>
        </div>

        <div className="dfr__url">
          <span className="dfr__addr" aria-hidden="true">
            {host}<b>{path}</b>
            {pages[tab]?.role && <em className="dfr__as">signed in as {pages[tab].role === 'viewer' ? 'view only' : pages[tab].role}</em>}
          </span>
          <a className="dfr__full" href={src + hash} target="_blank" rel="noreferrer">
            <span>Open in full screen</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M14 4h6v6M20 4l-8 8M10 20H4v-6M4 20l8-8" />
            </svg>
          </a>
        </div>

        <div className="dfr__view" ref={view}>
          <iframe
            ref={frame}
            src={src + (pages[0]?.hash ?? '')}
            title={title}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            style={frameStyle}
          />
          {!loaded && <span className="dfr__wait">Loading the demo…</span>}
          {!live && (
            <button type="button" className="dfr__go" onClick={start}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 3l14 9-7 1-4 7z" />
              </svg>
              Click to interact
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
