import { motion } from 'motion/react'
import { projects, type Project } from '../data'
import { ArrowUpRight } from './Icons'
import Section from './Section'

function Card({ project, index }: { project: Project; index: number }) {
  const Wrapper = project.href ? motion.a : motion.div
  return (
    <Wrapper
      className="gcard card"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: 'spring', stiffness: 80, damping: 18, delay: index * 0.08 }}
      {...(project.href ? { href: project.href, target: '_blank', rel: 'noreferrer' } : {})}
    >
      <div className="puck" aria-hidden="true">
        <span>{project.emoji}</span>
      </div>
      <div className="card__top">
        <span className="card__title">{project.title}</span>
        {project.href ? <ArrowUpRight /> : <span className="card__year">{project.year}</span>}
      </div>
      <p className="card__blurb">{project.blurb}</p>
      <div className="card__tags">
        {project.tags.map((t) => (
          <span className="tag" key={t}>
            {t}
          </span>
        ))}
      </div>
    </Wrapper>
  )
}

export default function Work() {
  return (
    <Section
      id="work"
      eyebrow="02 — Work"
      title="Selected projects"
      desc="A few things I've shipped. Each card opens the live project or its repo when a link exists."
      meta={`${projects.length} projects`}
    >
      <div className="cards">
        {projects.map((p, i) => (
          <Card key={p.title} project={p} index={i} />
        ))}
      </div>
    </Section>
  )
}
