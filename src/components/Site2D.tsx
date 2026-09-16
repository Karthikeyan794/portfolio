import { motion } from 'motion/react'
import { useState } from 'react'
import About from './About'
import Contact from './Contact'
import GridBg from './GridBg'
import Intro, { INTRO_NAV_DELAY } from './Intro'
import Marquee from './Marquee'
import Nav from './Nav'
import Notice from './Notice'
import Bento from './Bento'

type Props = { onEnterLab?: () => void }

/* The intro loader is gone. It held the page back ~6s on a first visit, which
   is a long time to ask of someone who followed a link off a CV. `Preloader`
   is still in the tree, unmounted, if it is ever wanted back. */

/** The scrolling page — phones, fallback, and anyone who prefers it. */
export default function Site2D({ onEnterLab }: Props) {
  // perspective is only needed while the page settles; dropping it afterwards
  // keeps sticky/backdrop-filter compositing cheap and avoids a 3D context
  const [settled, setSettled] = useState(false)

  return (
    <>
      <GridBg />

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
            <Contact />
          </main>
        </motion.div>
      </div>

      <Notice delay={(INTRO_NAV_DELAY + 0.4) * 1000} />
    </>
  )
}
