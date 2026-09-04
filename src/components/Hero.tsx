import { useRef } from 'react'
import { profile, socials } from '../data'
import Stickers from './Stickers'

export default function Hero() {
  const firstName = profile.name.split(' ')[0]
  const initials = profile.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
  const boundsRef = useRef<HTMLDivElement>(null)

  return (
    <section className="hero" id="top">
      <div className="wrap hero__grid">
        <div className="hero__text">
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

        <div className="hero__visual" ref={boundsRef}>
          <figure className="polaroid">
            <div className="polaroid__img">
              {profile.photo ? (
                <img src={profile.photo} alt={profile.name} />
              ) : (
                <span aria-hidden="true">{initials}</span>
              )}
            </div>
            <figcaption className="polaroid__caption">
              <span>
                {firstName} · {profile.location.split(',')[0]}
              </span>
              {!profile.photo && <small>your photo here</small>}
            </figcaption>
          </figure>
          <Stickers boundsRef={boundsRef} />
        </div>
      </div>
    </section>
  )
}
