import { motion } from 'motion/react'
import { useState } from 'react'
import About from './About'
import Awards from './Awards'
import Contact from './Contact'
import Experience from './Experience'
import Hero from './Hero'
import Marquee from './Marquee'
import Nav from './Nav'
import Work from './Work'

type Props = { onEnterLab?: () => void }

/** The scrolling page — phones, fallback, and anyone who prefers it. Tilts into view like a product reveal. */
export default function Site2D({ onEnterLab }: Props) {
  // perspective is only needed during the intro; dropping it afterwards keeps
  // sticky/backdrop-filter compositing cheap and avoids a 3D rendering context
  const [settled, setSettled] = useState(false)

  return (
    <div className={settled ? undefined : 'page3d'}>
      <motion.div
        className="page3d__inner"
        initial={{ opacity: 0, rotateX: 14, y: 80, scale: 0.94 }}
        animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 60, damping: 20, mass: 1.1 }}
        onAnimationComplete={() => setSettled(true)}
        style={settled ? { transform: 'none' } : undefined}
      >
        <Nav onEnterLab={onEnterLab} />
        <main>
          <Hero />
          <Marquee />
          <About />
          <Work />
          <Awards />
          <Experience />
          <Contact />
        </main>
      </motion.div>
    </div>
  )
}
