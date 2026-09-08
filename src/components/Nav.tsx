import { motion } from 'motion/react'
import { navCta, sectionIds, sections } from '../data'
import { useActiveSection, useScrolled } from '../hooks'

type Props = { onEnterLab?: () => void; delay?: number }

function ArrowIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  )
}

export default function Nav({ onEnterLab, delay = 0 }: Props) {
  const active = useActiveSection(sectionIds)
  // the nav sits over the intro picture; it turns solid once you scroll past it
  const stuck = useScrolled(Math.round(window.innerHeight * 0.72))

  const link = (s: (typeof sections)[number]) => (
    <a
      key={s.id}
      href={`#${s.id}`}
      className="nav__link"
      aria-current={active === s.id ? 'true' : undefined}
    >
      {s.label}
    </a>
  )

  return (
    <motion.header
      className="nav"
      data-stuck={stuck}
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 90, damping: 18 }}
    >
      <nav className="wrap nav__inner" aria-label="Primary">
        {/* empty first column keeps the links centred */}
        <span aria-hidden="true" />

        {/* Contact has its own button on the right, so it leaves the link row */}
        <div className="nav__links">{sections.filter((s) => s.id !== 'contact').map(link)}</div>

        <div className="nav__actions">
          {onEnterLab && (
            <button className="btn btn--lab" onClick={onEnterLab}>
              Enter 3D lab
            </button>
          )}
          {/* pops in once the nav has landed; the arrow badge spins in a beat later */}
          <motion.a
            href="#contact"
            className="nav__cta"
            initial={{ opacity: 0, scale: 0.6, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: delay + 0.45, type: 'spring', stiffness: 240, damping: 15 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* two stacked labels; hover slides the second one up into view */}
            <span className="nav__cta-label">
              <span>{navCta.label}</span>
              <span aria-hidden="true">{navCta.hover}</span>
            </span>
            <motion.span
              className="nav__cta-icon"
              initial={{ rotate: -120, scale: 0.4, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              transition={{ delay: delay + 0.7, type: 'spring', stiffness: 220, damping: 14 }}
            >
              <ArrowIcon />
            </motion.span>
          </motion.a>
        </div>
      </nav>
    </motion.header>
  )
}
