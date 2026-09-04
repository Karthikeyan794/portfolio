import { about, skills } from '../data'
import Section from './Section'

export default function About() {
  return (
    <Section id="about" eyebrow="01 — About" title="What I do">
      <div className="about-grid">
        <div className="prose">
          {about.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>

        <div className="skills">
          {skills.map((group) => (
            <div className="skills__group" key={group.group}>
              <h3>{group.group}</h3>
              <div className="chips">
                {group.items.map((item) => (
                  <span className="chip" key={item}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  )
}
