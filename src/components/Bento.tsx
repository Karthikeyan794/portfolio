import { motion } from 'motion/react'
import { projects, type Project } from '../data'
import { openProject } from '../router'
import Section from './Section'

/**
 * A true bento: one rectangle subdivided into interlocking boxes of different
 * sizes. Seven projects per block, placed by named grid areas (see styles.css),
 * so the block reads as a single object rather than a row of cards.
 *
 * Reveal follows the reference reel: each box scales up from 0.9 and fades in,
 * staggered a beat apart, the whole block landing in well under a second.
 */
const SLOTS = ['a', 'b', 'c', 'd', 'e', 'f', 'g'] as const
const PER_BLOCK = SLOTS.length

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
  const blocks: Project[][] = []
  for (let i = 0; i < projects.length; i += PER_BLOCK) blocks.push(projects.slice(i, i + PER_BLOCK))

  return (
    <Section
      id="work"
      eyebrow="02 — Work"
      title="Selected work"
      desc="Product work with case studies first, then design explorations. Click any box to open it."
      meta={`${projects.length} projects`}
    >
      <div className="bentos">
        {blocks.map((block, b) => (
          <div className={`bento bento--${b % 2 === 0 ? 'l' : 'r'}`} key={b}>
            {block.map((p, i) => (
              <Box key={p.slug} project={p} slot={SLOTS[i]} index={i} />
            ))}
          </div>
        ))}
      </div>
    </Section>
  )
}
