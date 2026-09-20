import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { projects, socials, type Project } from '../data'
import { marks } from '../logos'
import { openProject } from '../router'

/**
 * One bento rectangle, subdivided by named grid areas into interlocking boxes:
 * the five projects worth opening, plus a tile that sends everything else to
 * Behance rather than padding the grid out with thumbnails.
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
  const hitRef = useRef<HTMLButtonElement>(null)
  const raf = useRef(0)

  /**
   * Track the cursor and light the border where it is, so the two edges
   * nearest the pointer glow. rAF-throttled and written straight to CSS
   * variables, so React never re-renders while the cursor moves.
   */
  function onMove(e: React.PointerEvent<HTMLButtonElement>) {
    const el = hitRef.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width) * 100
    const y = ((e.clientY - r.top) / r.height) * 100
    if (raf.current) return
    raf.current = requestAnimationFrame(() => {
      raf.current = 0
      el.style.setProperty('--gx', `${x.toFixed(1)}%`)
      el.style.setProperty('--gy', `${y.toFixed(1)}%`)
    })
  }

  useEffect(() => () => cancelAnimationFrame(raf.current), [])

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
        ref={hitRef}
        type="button"
        className="box__hit"
        onClick={() => openProject(project.slug)}
        onPointerMove={onMove}
        aria-label={`${project.title} — ${project.tagline}`}
      >
        <span className="box__glow" aria-hidden="true" />
        {project.cover && <img className="box__img" src={project.cover} alt="" loading="lazy" decoding="async" />}
        <span className="box__veil" aria-hidden="true" />

        {/* both corners stay empty until you point at the tile: what it was
            built with on the left, the way in on the right */}
        {project.tools && project.tools.length > 0 && (
          <span className="box__tools" aria-hidden="true">
            {project.tools.map((t) => (
              <span className="box__tool" key={t}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d={marks[t]} />
                </svg>
              </span>
            ))}
          </span>
        )}

        <span className="box__open" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </span>

        <span className="box__label">
          <span className="box__kicker">
            {project.year}
            {project.kind === 'practice' && <span className="box__tag box__tag--ghost">Practice</span>}
          </span>
          <span className="box__title">{project.title}</span>
          <span className="box__tagline">{project.tagline}</span>
        </span>
      </motion.button>
      </div>
    </motion.article>
  )
}

/** The tile that carries everything not worth its own case study. */
function MoreBox({ slot, index, count, href, onHot }: { slot: string; index: number; count: number; href: string; onHot: (s: string | null) => void }) {
  return (
    <motion.article
      className={`box box--${slot} box--more`}
      onPointerEnter={() => onHot(slot)}
      onPointerLeave={() => onHot(null)}
      onFocus={() => onHot(slot)}
      onBlur={() => onHot(null)}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="box__lift">
        <a className="box__hit" href={href} target="_blank" rel="noreferrer" aria-label={`${count} more projects on Behance`}>
          <span className="box__glow" aria-hidden="true" />
          <span className="box__label">
            <span className="box__kicker">
              Behance
              <span className="box__tag box__tag--ghost">{count} more</span>
            </span>
            <span className="box__title">The rest of the work</span>
            <span className="box__tagline">Branding, motion, redesign studies and drawings.</span>
            <span className="box__cta">
              Open Behance
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                <path d="M7 17 17 7M9 7h8v8" />
              </svg>
            </span>
          </span>
        </a>
      </div>
    </motion.article>
  )
}

export default function Bento() {
  const [hot, setHot] = useState<string | null>(null)
  const featured = projects.filter((p) => p.featured).sort((a, b) => (a.featured ?? 99) - (b.featured ?? 99))
  const rest = projects.length - featured.length
  const behance = socials.find((s) => s.label === 'Behance')?.href ?? 'https://www.behance.net/karthikbabu13'
  const count = featured.length + 1

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
        <div className={`bento bento--${count}`} data-hot={hot ?? undefined} onPointerLeave={() => setHot(null)}>
          {featured.map((p, i) => (
            <Box key={p.slug} project={p} slot={SLOTS[i]} index={i} onHot={setHot} />
          ))}
          <MoreBox slot={SLOTS[featured.length]} index={featured.length} count={rest} href={behance} onHot={setHot} />
        </div>
      </div>
    </section>
  )
}
