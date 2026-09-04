import { projects, type Project } from '../data'
import { ArrowUpRight } from './Icons'
import Section from './Section'

function Card({ project }: { project: Project }) {
  const Wrapper = project.href ? 'a' : 'div'

  return (
    <Wrapper
      className={`card${project.featured ? ' card--featured' : ''}`}
      {...(project.href ? { href: project.href, target: '_blank', rel: 'noreferrer' } : {})}
    >
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
      meta={`${projects.length} projects`}
    >
      <div className="cards">
        {projects.map((p) => (
          <Card key={p.title} project={p} />
        ))}
      </div>
    </Section>
  )
}
