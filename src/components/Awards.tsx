import { awards, type Award } from '../data'
import Section from './Section'

const ICONS: Record<Award['kind'], string> = {
  award: '🏆',
  certificate: '📜',
  hackathon: '⚡',
}

export default function Awards() {
  return (
    <Section id="awards" eyebrow="03 — Awards" title="Recognition" meta={`${awards.length} so far`}>
      <div className="awards">
        {awards.map((a) => (
          <article className="award" key={a.title}>
            <div className="award__icon" aria-hidden="true">
              {ICONS[a.kind]}
            </div>
            <div>
              <h3 className="award__title">{a.title}</h3>
              <div className="award__meta">
                {a.issuer} · {a.year}
              </div>
              {a.note && <p className="award__note">{a.note}</p>}
            </div>
          </article>
        ))}
      </div>
    </Section>
  )
}
