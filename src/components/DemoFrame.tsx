import { useEffect, useRef, useState } from 'react'

export type DemoPage = { label: string; hash: string }

/**
 * The product itself, running inside the case study.
 *
 * A window drawn around an iframe: a tab strip that drives the app's own
 * router through its hash (same origin, so no reload), an address line, a
 * button to open it full screen. Until you click into it the iframe takes no
 * pointer events, so scrolling the page past it never gets caught inside the
 * app; move the pointer out of the window and it goes quiet again.
 */
export default function DemoFrame({ src, pages = [], art, title = 'Product demo' }: {
  src: string; pages?: DemoPage[]; art?: string; title?: string
}) {
  const [hash, setHash] = useState(pages[0]?.hash ?? '')
  const [live, setLive] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const frame = useRef<HTMLIFrameElement>(null)
  const view = useRef<HTMLDivElement>(null)
  const root = useRef<HTMLDivElement>(null)

  // while the window is on screen the page's fixed header steps out of the
  // way — it would sit over the top of the app. Announced as an event so the
  // header, which lives two components up, can listen without a prop chain.
  useEffect(() => {
    const el = root.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => window.dispatchEvent(new CustomEvent('demo-inview', { detail: entry.isIntersecting })),
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

  function go(h: string) {
    setHash(h)
    try {
      const w = frame.current?.contentWindow
      if (w) w.location.hash = h
    } catch {
      /* not same-origin after all — the src below still carries the hash */
    }
  }

  const path = hash.replace(/^#/, '')
  return (
    <div className="dfr" ref={root}>
      {art && <img className="dfr__desk" src={art} alt="" aria-hidden="true" />}
      <span className="dfr__tint" aria-hidden="true" />

      <div className={live ? 'dfr__win dfr__win--live' : 'dfr__win'} onMouseLeave={() => setLive(false)}>
        <div className="dfr__bar">
          <span className="dfr__dots" aria-hidden="true"><i /><i /><i /></span>
          {pages.length > 0 && (
            <div className="dfr__tabs" role="tablist" aria-label="Pages of the demo">
              {pages.map((p) => (
                <button
                  key={p.hash}
                  type="button"
                  role="tab"
                  aria-selected={hash === p.hash}
                  className={hash === p.hash ? 'dfr__tab dfr__tab--on' : 'dfr__tab'}
                  onClick={() => go(p.hash)}
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
            support-desk.demo<b>{path}</b>
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
          {!loaded && <span className="dfr__wait">Loading the desk…</span>}
          {!live && (
            <button type="button" className="dfr__go" onClick={() => setLive(true)}>
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
