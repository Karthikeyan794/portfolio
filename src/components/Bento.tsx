import { motion } from 'motion/react'
import { groups, projects, type Project } from '../data'
import { openProject } from '../router'

/**
 * Two bento blocks, one per group, each its own rectangle subdivided by named
 * grid areas into interlocking boxes. A labelled rule separates the blocks.
 * Reveal follows the reference reel: boxes scale up from 0.9 and fade in a
 * beat apart, so the rectangle assembles rather than appearing at once.
 */
const SLOTS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const

function Box({ project, slot, index }: { project: Project; slot: string; index: number }) {
  const hasCase = Boolean(project.detail)
  const Hit = hasCase ? motion.button : motion.a

  return (
    <motion.article
      className={`box box--${slot}`}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <Hit
        className="box__hit"
        {...(hasCase
          ? { type: 'button' as const, onClick: () => openProject(project.slug) }
          : { href: project.href, target: '_blank', rel: 'noreferrer' })}
        aria-label={`${project.title} — ${project.tagline}`}
      >
        {project.cover && <img className="box__img" src={project.cover} alt="" loading="lazy" decoding="async" />}
        <span className="box__veil" aria-hidden="true" />

        <span className="box__label">
          <span className="box__kicker">
            {project.year}
            {project.detail && <span className="box__tag">Case study</span>}
            {project.kind === 'practice' && <span className="box__tag box__tag--ghost">Practice</span>}
          </span>
          <span className="box__title">{project.title}</span>
          <span className="box__tagline">{project.tagline}</span>
          <span className="box__cta">
            {hasCase ? 'Read case study' : 'View on Behance'}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </span>
        </span>
      </Hit>
    </motion.article>
  )
}

export default function Bento() {
  return (
    <section className="section work" id="work">
      <motion.div
        className="wrap wrap--wide work__head"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ type: 'spring', stiffness: 70, damping: 18 }}
      >
        <div>
          <span className="eyebrow">02 — Work</span>
          <h2>Selected work</h2>
        </div>
        <p className="section__desc">
          Product work with case studies first, then the craft. Click any box to open it.
        </p>
      </motion.div>

      <div className="wrap wrap--wide bentos">
        {groups.map((group, gi) => {
          const items = projects.filter((p) => p.group === group.id).slice(0, SLOTS.length)
          return (
            <div className="blockwrap" key={group.id}>
              <motion.div
                className="blockrule"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6 }}
              >
                <span className="blockrule__no">{String(gi + 1).padStart(2, '0')}</span>
                <span className="blockrule__label">{group.label}</span>
                <span className="blockrule__line" aria-hidden="true" />
                <span className="blockrule__note">{group.note}</span>
                <span className="blockrule__count">{items.length}</span>
              </motion.div>

              <div className={`bento bento--${items.length} bento--${gi % 2 === 0 ? 'l' : 'r'}`}>
                {items.map((p, i) => (
                  <Box key={p.slug} project={p} slot={SLOTS[i]} index={i} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
