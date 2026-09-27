import { motion } from 'motion/react'
import { useScrolled } from '../hooks'
import SoundToggle from './SoundToggle'
import ThemeToggle from './ThemeToggle'

type Props = { onEnterLab?: () => void; delay?: number }

export default function Nav({ onEnterLab, delay = 0 }: Props) {
  // the nav sits over the intro picture; it turns solid once you scroll past it
  const stuck = useScrolled(Math.round(window.innerHeight * 0.72))

  return (
    <motion.header
      className="nav"
      data-stuck={stuck}
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 90, damping: 18 }}
    >
      <nav className="wrap nav__inner" aria-label="Primary">
        {/* left slot: nature-sound toggle */}
        <div className="nav__left">
          <SoundToggle />
          <ThemeToggle />
        </div>

        <div className="nav__actions">
          {onEnterLab && (
            <button className="btn btn--lab" onClick={onEnterLab}>
              Enter 3D lab
            </button>
          )}
        </div>
      </nav>
    </motion.header>
  )
}
