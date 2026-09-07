import { motion } from 'motion/react'
import { useState } from 'react'
import { profile, sectionIds, sections } from '../data'
import { useActiveSection, useScrolled, useTheme } from '../hooks'
import { MoonIcon, SunIcon } from './Icons'

type Props = { onEnterLab?: () => void; delay?: number }

export default function Nav({ onEnterLab, delay = 0 }: Props) {
  const active = useActiveSection(sectionIds)
  const stuck = useScrolled()
  const { resolved, toggle } = useTheme()
  const [open, setOpen] = useState(false)

  const links = sections.map((s) => (
    <a
      key={s.id}
      href={`#${s.id}`}
      className="nav__link"
      aria-current={active === s.id ? 'true' : undefined}
      onClick={() => setOpen(false)}
    >
      {s.label}
    </a>
  ))

  return (
    <motion.header
      className="nav"
      data-stuck={stuck}
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 90, damping: 18 }}
    >
      <nav className="wrap nav__inner" aria-label="Primary">
        <a href="#top" className="nav__mark">
          <span className="nav__dot" aria-hidden="true" />
          {profile.name}
        </a>

        <div className="nav__links">{links}</div>

        <div className="nav__actions">
          {onEnterLab && (
            <button className="btn btn--lab" onClick={onEnterLab}>
              Enter 3D lab
            </button>
          )}
          <button
            className="iconbtn"
            onClick={toggle}
            aria-label={`Switch to ${resolved === 'dark' ? 'light' : 'dark'} theme`}
          >
            {resolved === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
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
          {links}
        </div>
      )}
    </motion.header>
  )
}
