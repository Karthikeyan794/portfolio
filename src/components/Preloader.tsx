import { motion } from 'motion/react'
import { profile } from '../data'
import CubeIntro from './CubeIntro'

/** Full-screen loader for the 2D page — the Rubik's cube twists until the page is ready. */
export default function Preloader() {
  return (
    <motion.div
      className="preloader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04, transition: { duration: 0.45, ease: 'easeInOut' } }}
      aria-live="polite"
    >
      <div className="preloader__card">
        <CubeIntro size={36} />
        <div className="preloader__name">
          <b>{profile.name}</b> · vibing with code &amp; design
        </div>
      </div>
    </motion.div>
  )
}
