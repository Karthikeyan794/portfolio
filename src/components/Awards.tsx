import { awards, type Award } from '../data'
import Section from './Section'

const ICONS: Record<Award['kind'], string> = { award: '🏆', certificate: '📜', hackathon: '⚡' }

export default function Awards() {
  return (
    <Section
      id="awards"
      eyebrow="03 — Awards"
      title="Recognition"
      desc="Placeholders for now — real awards and photos go here."
      meta={`${awards.length} so far`}
    >
      <div className="awards">
        {awards.map((a) => (
          <article className="gcard award" key={a.title}>
            <div className="puck" aria-hidden="true">
              <span>{ICONS[a.kind]}</span>
            </div>
            <div>
              <h3 className="award__title">{a.title}</h3>
              <div className="award__meta">
                {a.issuer} · {a.year}
              </div>
            </div>
            {a.note && <p className="award__note">{a.note}</p>}
          </article>
        ))}
      </div>
    </Section>
  )
}
