import { AnimatePresence, motion } from 'motion/react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

/** what the lightbox is currently showing, or null */
export type Zoomed = { src: string; alt?: string; video?: boolean } | null

/** the little round control that sits on a picture and opens it full screen */
export function ZoomButton({ onOpen, label }: { onOpen: () => void; label?: string }) {
  return (
    <button
      type="button"
      className="zoomb"
      onClick={onOpen}
      aria-label={label ? `Open ${label} full screen` : 'Open full screen'}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7" />
      </svg>
    </button>
  )
}

/**
 * The picture, filling the screen. Escape closes it, so does the backdrop and
 * the button; while it is open the page behind cannot scroll, so closing it
 * leaves you exactly where you were.
 */
export function Lightbox({ shot, onClose }: { shot: Zoomed; onClose: () => void }) {
  useEffect(() => {
    if (!shot) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    const kept = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = kept
      window.removeEventListener('keydown', onKey)
    }
  }, [shot, onClose])

  return createPortal(
    <AnimatePresence>
      {shot && (
        <motion.div
          className="zoom"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={shot.alt ?? 'Full screen view'}
        >
          <button type="button" className="zoom__x" onClick={onClose} aria-label="Close">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <motion.div
            className="zoom__stage"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            {shot.video ? (
              <video src={shot.src} autoPlay loop muted playsInline controls />
            ) : (
              <img src={shot.src} alt={shot.alt ?? ''} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
