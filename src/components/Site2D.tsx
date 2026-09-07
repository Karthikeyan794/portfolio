import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import About from './About'
import Awards from './Awards'
import Contact from './Contact'
import Experience from './Experience'
import Intro, { INTRO_NAV_DELAY } from './Intro'
import Marquee from './Marquee'
import Nav from './Nav'
import Preloader from './Preloader'
import Work from './Work'

type Props = { onEnterLab?: () => void }

const MIN_LOADER_MS = 5800

/** The scrolling page — phones, fallback, and anyone who prefers it. */
export default function Site2D({ onEnterLab }: Props) {
  const [loading, setLoading] = useState(true)
  // perspective is only needed during the intro; dropping it afterwards keeps
  // sticky/backdrop-filter compositing cheap and avoids a 3D rendering context
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    const start = performance.now()
    let cancelled = false
    const fonts = 'fonts' in document ? document.fonts.ready : Promise.resolve()
    fonts.then(() => {
      const wait = Math.max(0, MIN_LOADER_MS - (performance.now() - start))
      window.setTimeout(() => {
        if (!cancelled) setLoading(false)
      }, wait)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
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
              <Work />
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
