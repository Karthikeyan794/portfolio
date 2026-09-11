import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import About from './About'
import Awards from './Awards'
import Contact from './Contact'
import GridBg from './GridBg'
import Experience from './Experience'
import Intro, { INTRO_NAV_DELAY } from './Intro'
import Marquee from './Marquee'
import Nav from './Nav'
import Preloader from './Preloader'
import Bento from './Bento'

type Props = { onEnterLab?: () => void }

/** The intro loader belongs to the first visit only — coming back from a
 *  project page must not replay it. Module scope survives remounts. */
let introPlayed = false

const MIN_LOADER_MS = 5800
const FONT_WAIT_MS = 2500 // never let slow web fonts hold the loader hostage
const HARD_CAP_MS = MIN_LOADER_MS + 3000 // absolute worst case: the page always appears

/** The scrolling page — phones, fallback, and anyone who prefers it. */
export default function Site2D({ onEnterLab }: Props) {
  const [loading, setLoading] = useState(!introPlayed)
  // perspective is only needed during the intro; dropping it afterwards keeps
  // sticky/backdrop-filter compositing cheap and avoids a 3D rendering context
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    const start = performance.now()
    let cancelled = false
    const done = () => {
      introPlayed = true
      if (!cancelled) setLoading(false)
    }
    if (introPlayed) return
    // fonts.ready can hang for a long time when a font host is slow or blocked — race it
    const fonts = 'fonts' in document ? document.fonts.ready.then(() => undefined) : Promise.resolve()
    const fontsOrTimeout = Promise.race([fonts, new Promise<void>((r) => window.setTimeout(r, FONT_WAIT_MS))])
    fontsOrTimeout.then(() => {
      const wait = Math.max(0, MIN_LOADER_MS - (performance.now() - start))
      window.setTimeout(done, wait)
    })
    const cap = window.setTimeout(done, HARD_CAP_MS)
    return () => {
      cancelled = true
      window.clearTimeout(cap)
    }
  }, [])

  return (
    <>
      <GridBg />
      <AnimatePresence>{loading && <Preloader key="preloader" />}</AnimatePresence>

      {!loading && (
        <div className={settled ? undefined : 'page3d'}>
          <motion.div
            className="page3d__inner"
            initial={{ opacity: 0, rotateX: 14, y: 80, scale: 0.94 }}
            animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 60, damping: 20, mass: 1.1 }}
            onAnimationComplete={() => setSettled(true)}
            style={settled ? { transform: 'none' } : undefined}
          >
            <Nav onEnterLab={onEnterLab} delay={INTRO_NAV_DELAY} />
            <main>
              <Intro />
              <Marquee />
              <About />
              <Bento />
              <Awards />
              <Experience />
              <Contact />
            </main>
          </motion.div>
        </div>
      )}
    </>
  )
}
