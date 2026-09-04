import { profile, sectionIds, sections } from '../data'
import { useActiveSection, useScrolled, useTheme } from '../hooks'
import { MoonIcon, SunIcon } from './Icons'

export default function Nav() {
  const active = useActiveSection(sectionIds)
  const stuck = useScrolled()
  const { resolved, toggle } = useTheme()

  return (
    <header className="nav" data-stuck={stuck}>
      <nav className="wrap nav__inner" aria-label="Primary">
        <a href="#top" className="nav__mark">
          <span className="nav__dot" aria-hidden="true" />
          {profile.name}
        </a>

        <div className="nav__links">
          {sections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="nav__link"
              aria-current={active === s.id ? 'true' : undefined}
            >
              {s.label}
            </a>
          ))}
        </div>

        <button
          className="iconbtn"
          onClick={toggle}
          aria-label={`Switch to ${resolved === 'dark' ? 'light' : 'dark'} theme`}
        >
          {resolved === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </nav>
    </header>
  )
}
