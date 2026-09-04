import { experience } from '../data'
import Section from './Section'

export default function Experience() {
  return (
    <Section id="experience" eyebrow="04 — Experience" title="Where I've worked">
      <div className="timeline">
        {experience.map((role) => (
          <article className="gcard role" key={role.company + role.period}>
            <div className="role__period">{role.period}</div>
            <div>
              <h3 className="role__company">{role.company}</h3>
              <div className="role__title">{role.title}</div>
              <ul className="role__points">
                {role.points.map((point) => (
                  <li key={point.slice(0, 24)}>{point}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
