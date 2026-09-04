import { marquee } from '../data'

/** Endless scrolling strip of skills — decorative, duplicated for a seamless loop. */
export default function Marquee() {
  const items = [...marquee, ...marquee]
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {items.map((m, i) => (
          <span className="marquee__item" key={`${m}-${i}`}>
            {m}
            <i className="marquee__dot" />
          </span>
        ))}
      </div>
    </div>
  )
}
