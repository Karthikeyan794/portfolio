import { motion } from 'motion/react'
import { useState } from 'react'
import { profile, sectionIds, sections } from '../data'
import { useActiveSection, useScrolled } from '../hooks'

type Props = { onEnterLab?: () => void; delay?: number }

function ArrowIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17 17 7M9 7h8v8" />
    </svg>
  )
}

export default function Nav({ onEnterLab, delay = 0 }: Props) {
  const active = useActiveSection(sectionIds)
  // the nav sits over the intro picture; it turns solid once you scroll past it
  const stuck = useScrolled(Math.round(window.innerHeight * 0.72))
  const [open, setOpen] = useState(false)

  const link = (s: (typeof sections)[number]) => (
    <a
      key={s.id}
      href={`#${s.id}`}
      className="nav__link"
      aria-current={active === s.id ? 'true' : undefined}
      onClick={() => setOpen(false)}
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
        {/* just the mark — no name text */}
        <a href="#top" className="nav__mark" aria-label={`${profile.name} — back to top`}>
          <span className="nav__dot" aria-hidden="true" />
        </a>

        {/* Contact has its own button on the right, so it leaves the link row */}
        <div className="nav__links">{sections.filter((s) => s.id !== 'contact').map(link)}</div>

        <div className="nav__actions">
          {onEnterLab && (
            <button className="btn btn--lab" onClick={onEnterLab}>
              Enter 3D lab
            </button>
          )}
          <a href="#contact" className="nav__cta">
            Contact Me
            <span className="nav__cta-icon">
              <ArrowIcon />
            </span>
          </a>
          <button
            className="iconbtn nav__burger"
            aria-expanded={open}
            aria-controls="nav-menu"
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </nav>
      {open && (
        <div id="nav-menu" className="nav__menu">
          {sections.map(link)}
        </div>
      )}
    </motion.header>
  )
}
