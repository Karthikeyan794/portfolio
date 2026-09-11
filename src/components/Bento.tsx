import { motion } from 'motion/react'
import { useState } from 'react'
import { groups, projects, type Project } from '../data'
import { openProject } from '../router'

/**
 * Two bento blocks, one per group, each its own rectangle subdivided by named
 * grid areas into interlocking boxes. A labelled rule separates the blocks.
 *
 * Reveal follows the reference reel: boxes scale up from 0.9 and fade in a
 * beat apart, so the rectangle assembles rather than appearing at once.
 *
 * Hover: the block records which slot is hot, so the hovered box grows while
 * its siblings give up a little room (see .bento[data-hot] in styles.css).
 */
const SLOTS = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] as const

type BoxProps = {
  project: Project
  slot: string
  index: number
  onHot: (slot: string | null) => void
}

function Box({ project, slot, index, onHot }: BoxProps) {
  return (
    <motion.article
      className={`box box--${slot}`}
      onPointerEnter={() => onHot(slot)}
      onPointerLeave={() => onHot(null)}
      onFocus={() => onHot(slot)}
      onBlur={() => onHot(null)}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* The block's grid tracks do the growing (see [data-hot] in styles.css);
          the dim of the other boxes is plain CSS, so no JS animation competes
          with the relayout. */}
      <div className="box__lift">
      {/* every project opens inside the site — nothing jumps out to Behance */}
      <motion.button
        type="button"
        className="box__hit"
        onClick={() => openProject(project.slug)}
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
            {project.detail ? 'Read case study' : 'Open project'}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </span>
        </span>
      </motion.button>
      </div>
    </motion.article>
  )
}

/** One group's rectangle; tracks which box is hovered so the others can react. */
function Block({ group, items, index }: { group: (typeof groups)[number]; items: Project[]; index: number }) {
  const [hot, setHot] = useState<string | null>(null)

  return (
    <div className="blockwrap">
      <motion.div
        className="blockrule"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 0.6 }}
      >
        <span className="blockrule__no">{String(index + 1).padStart(2, '0')}</span>
        <span className="blockrule__label">{group.label}</span>
        <span className="blockrule__line" aria-hidden="true" />
        <span className="blockrule__note">{group.note}</span>
        <span className="blockrule__count">{items.length}</span>
      </motion.div>

      <div
        className={`bento bento--${items.length} bento--${index % 2 === 0 ? 'l' : 'r'}`}
        data-hot={hot ?? undefined}
        onPointerLeave={() => setHot(null)}
      >
        {items.map((p, i) => (
          <Box key={p.slug} project={p} slot={SLOTS[i]} index={i} onHot={setHot} />
        ))}
      </div>
    </div>
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
        <span className="eyebrow">02 — Work</span>
        <h2>Selected work</h2>
      </motion.div>

      <div className="wrap wrap--wide bentos">
        {groups.map((group, gi) => (
          <Block
            key={group.id}
            group={group}
            index={gi}
            items={projects.filter((p) => p.group === group.id).slice(0, SLOTS.length)}
          />
        ))}
      </div>
    </section>
  )
}
