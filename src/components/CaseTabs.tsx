import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

/**
 * The section nav for a case study: plain names in the top bar that scroll you
 * to the part you asked for. The one you are reading lights up
 * on its own — an observer watches each section rather than doing the maths on
 * every scroll frame.
 *
 * It rides in the top bar, on the right, level with the back button.
 */
export type Tab = { id: string; label: string }

/** the single top bar the tabs now live in (65), plus a little air */
const BAR = 92

export default function CaseTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(tabs[0]?.id ?? '')

  // light the section you are in: the lowest one whose top has passed the bar
  useEffect(() => {
    const nodes = tabs.map((t) => document.getElementById(t.id)).filter(Boolean) as HTMLElement[]
    if (!nodes.length) return
    const pick = () => {
      const line = 200
      let current = nodes[0]
      for (const n of nodes) if (n.getBoundingClientRect().top <= line) current = n
      setActive(current.id)
    }
    pick()
    window.addEventListener('scroll', pick, { passive: true })
    window.addEventListener('resize', pick)
    return () => {
      window.removeEventListener('scroll', pick)
      window.removeEventListener('resize', pick)
    }
  }, [tabs])

  const go = (id: string) => {
    const el = document.getElementById(id)
    if (!el) return
    // the top bar and this one both float, so land the section below them
    const top = el.getBoundingClientRect().top + window.scrollY - BAR
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <motion.nav
      className="ctabs"
      aria-label="Sections"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="ctabs__wrap">
        <div className="ctabs__row">
          {tabs.map((t) => (
            <button
            key={t.id}
            type="button"
            className={t.id === active ? 'ctab ctab--on' : 'ctab'}
            onClick={() => go(t.id)}
            aria-current={t.id === active ? 'true' : undefined}
          >
            {t.id === active && <motion.span className="ctab__pill" layoutId="ctab-pill" aria-hidden="true" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
            <span className="ctab__label">{t.label}</span>
          </button>
          ))}
        </div>
      </div>
    </motion.nav>
  )
}
