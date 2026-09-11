import { motion, useScroll, useTransform } from 'motion/react'
import { useRef } from 'react'
import { projects, type Project } from '../data'
import { openProject } from '../router'
import Section from './Section'

/** Each tile drifts at its own rate as the grid passes — a light parallax, never a jolt. */
function Tile({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const depth = [34, 16, 26, 10][index % 4]
  const y = useTransform(scrollYProgress, [0, 1], [depth, -depth])
  const imgY = useTransform(scrollYProgress, [0, 1], ['-6%', '6%'])

  const hasCase = Boolean(project.detail)
  const Wrapper = hasCase ? motion.button : motion.a

  return (
    <motion.article
      ref={ref}
      className={`tile tile--${project.size ?? 'small'} tile--${project.tone ?? 'cream'}`}
      style={{ y }}
      initial={{ opacity: 0, y: 44, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: 'spring', stiffness: 64, damping: 18, delay: (index % 3) * 0.07 }}
    >
      <Wrapper
        className="tile__hit"
        {...(hasCase
          ? { type: 'button' as const, onClick: () => openProject(project.slug) }
          : { href: project.href, target: '_blank', rel: 'noreferrer' })}
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <div className="tile__shot">
          {project.cover ? (
            <motion.img src={project.cover} alt="" style={{ y: imgY }} loading="lazy" decoding="async" />
          ) : (
            <span className="tile__emoji" aria-hidden="true">
              {project.emoji}
            </span>
          )}
        </div>

        <div className="tile__body">
          <div className="tile__meta">
            <span className="tile__year">{project.year}</span>
            {project.kind === 'practice' && <span className="tile__badge">Practice</span>}
            {project.detail && <span className="tile__badge tile__badge--case">Case study</span>}
          </div>
          <h3 className="tile__title">{project.title}</h3>
          <p className="tile__tagline">{project.tagline}</p>
          {(project.size === 'hero' || project.size === 'wide') && <p className="tile__blurb">{project.blurb}</p>}
          <span className="tile__cta">
            {hasCase ? 'Read the case study' : 'View on Behance'}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
              <path d="M7 17 17 7M9 7h8v8" />
            </svg>
          </span>
        </div>
      </Wrapper>
    </motion.article>
  )
}

export default function Bento() {
  return (
    <Section
      id="work"
      eyebrow="02 — Work"
      title="Selected work"
      desc={
        <>
          Product work with case studies first, then design explorations. Click any tile to open it.
        </>
      }
      meta={`${projects.length} projects`}
    >
      <div className="bento">
        {projects.map((p, i) => (
          <Tile key={p.slug} project={p} index={i} />
        ))}
      </div>
    </Section>
  )
}
