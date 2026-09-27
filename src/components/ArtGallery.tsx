import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { artworks } from '../data'
import { useBackSteps, usePhone } from '../sheet'

/**
 * The drawings, in a dark glass sheet over the page — what the Drawings card
 * opens. It opens on all of them at once, three to a row (small JPG copies
 * from /art/thumbs, so the grid is light); a click opens that one large, one
 * at a time, and "All drawings" goes back to the grid.
 *
 * One at a time:
 * The sheet rises in; each drawing arrives blurred and a little large and
 * settles sharp once it has loaded, and moving on slides the next one in from
 * the side you went. Arrows, the keyboard (← →), a swipe or the dots move
 * between them; Escape, a click outside or the close button shuts it and
 * hands focus back to the card. Only the drawing on screen and its two
 * neighbours are fetched — the files are the originals, and all of them at
 * once would be a lot to ask of a phone.
 */
export default function ArtGallery({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion()
  const n = artworks.length
  const [[i, dir], setPage] = useState<[number, number]>([0, 0])
  const [view, setView] = useState<'grid' | 'one'>('grid')
  const thumb = (src: string) => src.replace('/art/', '/art/thumbs/').replace(/\.png$/, '.jpg')
  const [loaded, setLoaded] = useState<Record<string, boolean>>({})
  const sheet = useRef<HTMLDivElement>(null)
  const viewRef = useRef(view)
  viewRef.current = view
  const closeBtn = useRef<HTMLButtonElement>(null)
  // on a phone the drawings are a page: full screen, in from the right, a
  // Back button, and the back gesture goes one drawing -> the grid -> out
  const phone = usePhone()
  useBackSteps(open ? (view === 'one' ? 2 : 1) : 0, () => (viewRef.current === 'one' ? setView('grid') : onClose()), phone)

  const go = useCallback((d: number) => setPage(([k]) => [(k + d + n) % n, d]), [n])
  const jump = (k: number) => setPage(([cur]) => [k, k === cur ? 0 : k > cur ? 1 : -1])

  // every opening starts on the grid
  useEffect(() => {
    if (open) {
      setPage([0, 0])
      setView('grid')
    }
  }, [open])
  const openOne = (k: number) => {
    setPage([k, 0])
    setView('one')
  }

  // open: freeze the page, take focus, keys; closed: give it all back
  useEffect(() => {
    if (!open) return
    const returnTo = document.activeElement as HTMLElement | null
    const kept = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      // Escape steps back: from one drawing to the grid, from the grid out
      if (e.key === 'Escape') {
        if (viewRef.current === 'one') setView('grid')
        else onClose()
      } else if (viewRef.current === 'one' && e.key === 'ArrowRight') go(1)
      else if (viewRef.current === 'one' && e.key === 'ArrowLeft') go(-1)
      else if (e.key === 'Tab' && sheet.current) {
        const focusable = sheet.current.querySelectorAll<HTMLElement>('button:not([disabled])')
        if (!focusable.length) return
        const first = focusable[0], last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    window.addEventListener('keydown', onKey)
    const t = window.setTimeout(() => closeBtn.current?.focus({ preventScroll: true }), reduce ? 0 : 260)
    return () => {
      document.body.style.overflow = kept
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
      returnTo?.focus?.({ preventScroll: true })
    }
  }, [open, onClose, go, reduce])

  // the neighbours load behind the one on screen, so moving on is instant
  useEffect(() => {
    if (!open || view !== 'one') return
    for (const d of [1, -1]) {
      const im = new Image()
      im.src = artworks[(i + d + n) % n].src
    }
  }, [open, view, i, n])

  const art = artworks[i]
  const slide = {
    enter: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * 70 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: reduce ? 0 : d * -70 }),
  }

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="agal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Drawings"
        >
          <motion.div
            className="agal__sheet"
            ref={sheet}
            onClick={(e) => e.stopPropagation()}
            initial={phone && !reduce ? { x: '100%' } : { opacity: 0, y: reduce ? 0 : 28, scale: reduce ? 1 : 0.96 }}
            animate={phone && !reduce ? { x: 0 } : { opacity: 1, y: 0, scale: 1 }}
            exit={phone && !reduce ? { x: '100%', transition: { duration: 0.28, ease: [0.4, 0, 1, 1] } } : { opacity: 0, y: reduce ? 0 : 12, scale: reduce ? 1 : 0.98, transition: { duration: 0.18, ease: 'easeIn' } }}
            transition={phone && !reduce ? { duration: 0.42, ease: [0.22, 1, 0.36, 1] } : { type: 'spring', stiffness: 160, damping: 22 }}
          >
            {view === 'grid' ? (
              <>
                <div className="agal__head">
                  {phone && (
                    <button type="button" className="agal__pageback" onClick={onClose}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6" /></svg>
                      Back
                    </button>
                  )}
                  <p className="agal__cap">
                    Drawings
                    <span className="agal__no">{String(n).padStart(2, '0')}</span>
                  </p>
                </div>
                <motion.ul
                  className="agal__grid"
                  initial="rest"
                  animate="in"
                  variants={{ rest: {}, in: { transition: { staggerChildren: reduce ? 0 : 0.035 } } }}
                >
                  {artworks.map((a, k) => (
                    <motion.li
                      key={a.src}
                      variants={{ rest: { opacity: 0, y: reduce ? 0 : 16, scale: reduce ? 1 : 0.97 }, in: { opacity: 1, y: 0, scale: 1 } }}
                      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <button type="button" className="agal__tile" onClick={() => openOne(k)} aria-label={`Open ${a.title}`}>
                        <img src={thumb(a.src)} alt={a.alt} loading="lazy" decoding="async" />
                        <span className="agal__tile-name">{a.title}</span>
                      </button>
                    </motion.li>
                  ))}
                </motion.ul>
              </>
            ) : (
              <>
                <button type="button" className="agal__back" onClick={() => setView('grid')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" />
                  </svg>
                  All drawings
                </button>
                <div className="agal__stage">
                  <AnimatePresence initial={false} custom={dir}>
                    <motion.figure
                      key={art.src}
                      className="agal__fig"
                      custom={dir}
                      variants={slide}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      drag={reduce ? false : 'x'}
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.18}
                      onDragEnd={(_, info) => {
                        if (info.offset.x < -60) go(1)
                        else if (info.offset.x > 60) go(-1)
                      }}
                    >
                      <img
                        className={loaded[art.src] ? 'agal__img agal__img--in' : 'agal__img'}
                        src={art.src}
                        alt={art.alt}
                        decoding="async"
                        draggable={false}
                        onLoad={() => setLoaded((l) => ({ ...l, [art.src]: true }))}
                      />
                      {!loaded[art.src] && <span className="agal__wait" aria-hidden="true" />}
                    </motion.figure>
                  </AnimatePresence>

                  <button type="button" className="agal__nav agal__nav--prev" onClick={() => go(-1)} aria-label="Previous drawing">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m15 5-7 7 7 7" />
                    </svg>
                  </button>
                  <button type="button" className="agal__nav agal__nav--next" onClick={() => go(1)} aria-label="Next drawing">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="m9 5 7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="agal__bar">
                  <p className="agal__cap" aria-live="polite">
                    <span className="agal__no">
                      {String(i + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
                    </span>
                    {art.title}
                  </p>
                  <div className="agal__dots">
                    {artworks.map((a, k) => (
                      <button
                        key={a.src}
                        type="button"
                        className={k === i ? 'agal__dot agal__dot--on' : 'agal__dot'}
                        aria-label={`Drawing ${k + 1}: ${a.title}`}
                        aria-current={k === i ? 'true' : undefined}
                        onClick={() => jump(k)}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}

            <button type="button" className="agal__close" ref={closeBtn} onClick={onClose} aria-label="Close the drawings">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6 6 18" />
              </svg>
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
