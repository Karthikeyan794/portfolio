import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { inProgressNote } from '../data'
import { marks } from '../logos'

/**
 * The glass tag in a project card's top-right corner, saying where a click
 * goes when it is not a case study here: "Behance" (opens the gallery in a
 * new tab) or "In progress" (opens the note below). Used by the home grid
 * and by the tiles at the end of a case study.
 */
export function CardTag({ mode }: { mode: 'behance' | 'wip' }) {
  return mode === 'behance' ? (
    <span className="ctag" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d={marks.behance} />
      </svg>
      Behance
    </span>
  ) : (
    <span className="ctag ctag--wip" aria-hidden="true">
      <i />
      {inProgressNote.tag}
    </span>
  )
}

/**
 * The small note a project still being made opens instead of a page: what
 * it is, that it is on its way, and one button to close. Escape, a click
 * outside, or the button closes it, and focus goes back to the card.
 */
export function InProgressNote({ open, title, onClose }: { open: boolean; title: string; onClose: () => void }) {
  const reduce = useReducedMotion()
  const ok = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const returnTo = document.activeElement as HTMLElement | null
    const kept = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      // one button: Tab stays on it
      if (e.key === 'Tab') { e.preventDefault(); ok.current?.focus() }
    }
    window.addEventListener('keydown', onKey)
    const t = window.setTimeout(() => ok.current?.focus({ preventScroll: true }), reduce ? 0 : 200)
    return () => {
      document.body.style.overflow = kept
      window.removeEventListener('keydown', onKey)
      window.clearTimeout(t)
      returnTo?.focus?.({ preventScroll: true })
    }
  }, [open, onClose, reduce])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="wipdlg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.18 } }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="wipdlg-title"
          aria-describedby="wipdlg-body"
        >
          <motion.div
            className="wipdlg__sheet"
            initial={{ opacity: 0, y: reduce ? 0 : 18, scale: reduce ? 1 : 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : 10, scale: reduce ? 1 : 0.98, transition: { duration: 0.18, ease: 'easeIn' } }}
            transition={{ type: 'spring', stiffness: 220, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
          >
            <span className="ctag ctag--wip ctag--still">
              <i />
              {inProgressNote.tag}
            </span>
            <h2 className="wipdlg__h" id="wipdlg-title">
              {inProgressNote.title}
            </h2>
            <p className="wipdlg__p" id="wipdlg-body">
              {inProgressNote.body.replace('{title}', title)}
            </p>
            <button type="button" className="wipdlg__ok" ref={ok} onClick={onClose}>
              {inProgressNote.close}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
