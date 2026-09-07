import type { CSSProperties } from 'react'
import { projects, type Project } from '../data'
import { ArrowUpRight } from './Icons'
import Section from './Section'

function initialsOf(title: string) {
  return title
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function Card({ project, index }: { project: Project; index: number }) {
  const Wrapper = project.href ? 'a' : 'div'
  const hue = 150 + index * 14 // greens, slightly different per card

  return (
    <Wrapper
      className={`card${project.featured ? ' card--featured' : ''}`}
      {...(project.href ? { href: project.href, target: '_blank', rel: 'noreferrer' } : {})}
    >
      {/* placeholder screenshot: a tiny browser window with the project's initials */}
      <div className="thumb" aria-hidden="true">
        <div className="thumb__bar">
          <i />
          <i />
          <i />
        </div>
        <div className="thumb__body" style={{ '--hue': hue } as CSSProperties}>
          <span>{initialsOf(project.title)}</span>
        </div>
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
    <Section id="work" eyebrow="02 — Work" title="Selected projects" meta={`${projects.length} projects`}>
      <div className="cards">
        {projects.map((p, i) => (
          <Card key={p.title} project={p} index={i} />
        ))}
      </div>
    </Section>
  )
}
