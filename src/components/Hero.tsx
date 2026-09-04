import { profile, socials } from '../data'

export default function Hero() {
  const firstName = profile.name.split(' ')[0]

  return (
    <section className="hero" id="top">
      <div className="wrap">
        {profile.available && (
          <span className="pill">
            <span className="pill__blip" aria-hidden="true" />
            {profile.availableNote}
          </span>
        )}

        <h1>
          {firstName}. <span>{profile.role}.</span>
        </h1>

        <p className="hero__sub">{profile.tagline}</p>

        <div className="hero__meta">
          <span>{profile.location}</span>
          <span aria-hidden="true">·</span>
          <span>{new Date().getFullYear()}</span>
        </div>

        <div className="cta-row">
          <a className="btn btn--primary" href={`mailto:${profile.email}`}>
            Get in touch
          </a>
          {profile.resumeUrl && (
            <a className="btn btn--ghost" href={profile.resumeUrl}>
              Résumé
            </a>
          )}
          {socials.map((s) => (
            <a key={s.label} className="btn btn--ghost" href={s.href} target="_blank" rel="noreferrer">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
