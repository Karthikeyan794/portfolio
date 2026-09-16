import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { socials } from '../data'

/** Remembered per browser, so a returning visitor isn't told twice. */
const KEY = 'portfolio:notice-wip'

/**
 * The standing note on the state of the site: newer case studies are still
 * being written, and the earlier design work lives on Behance.
 *
 * It mounts OUTSIDE `.page3d__inner`. That wrapper carries a matrix3d
 * transform while the intro settles, and anything inside it inherits the
 * transform — a fixed-position card would be dragged across the screen and
 * land in the wrong place.
 */
export default function Notice({ delay = 1400 }: { delay?: number }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // localStorage throws outright in some privacy modes, so a read that
    // fails simply means the note shows — never that the card breaks.
    let dismissed = false
    try {
      dismissed = localStorage.getItem(KEY) === '1'
    } catch {
      dismissed = false
    }
    if (dismissed) return
    const t = window.setTimeout(() => setShow(true), delay)
    return () => window.clearTimeout(t)
  }, [delay])

  const close = () => {
    setShow(false)
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      /* a visitor who can't be remembered just sees it again next time */
    }
  }

  const behance = socials.find((s) => s.label === 'Behance')?.href

  return (
    <AnimatePresence>
      {show && (
        <motion.aside
          className="notice"
          role="status"
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98, transition: { duration: 0.22, ease: 'easeOut' } }}
          transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.7 }}
        >
          <span className="notice__dot" aria-hidden="true" />

          <div className="notice__body">
            <strong className="notice__title">Still being built</strong>
            <p className="notice__text">
              The newer case studies are going up one at a time. The earlier design work opens on
              {behance ? (
                <>
                  {' '}
                  <a href={behance} target="_blank" rel="noreferrer">
                    Behance
                  </a>
                  .
                </>
              ) : (
                ' Behance.'
              )}
            </p>
          </div>

          <button className="notice__x" onClick={close} aria-label="Dismiss this note" type="button">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
              <path d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
