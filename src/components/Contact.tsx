import { aboutLinks, profile, socials } from '../data'
import { marks } from '../logos'
import { useReveal } from '../hooks'
import ContactForm from './ContactForm'

export default function Contact() {
  const ref = useReveal<HTMLDivElement>()

  return (
    <section className="section" id="contact">
      <div className="wrap reveal" ref={ref}>
        <div className="contact">
          <div className="contact__left">
            <div>
              <span className="eyebrow">03 — Contact</span>
              <h2>Let's build something.</h2>
            </div>
            <p>
              The fastest way to reach me is email — I read everything and reply to anything
              that isn't a template.
            </p>
            <a className="mailto" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>

            {/* where else to find me */}
            <ul className="plinks">
              {aboutLinks.map((l) => (
                <li key={l.label}>
                  <a href={l.href} target="_blank" rel="noreferrer" title={l.handle} style={{ ['--brand' as string]: l.brand }}>
                    <span className="plinks__mark" aria-hidden="true">
                      {l.mark ? (
                        <svg viewBox="0 0 24 24">
                          <path d={marks[l.mark]} />
                        </svg>
                      ) : (
                        <b>{l.mono}</b>
                      )}
                    </span>
                    <span className="plinks__label">{l.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <ContactForm />
        </div>

        <footer className="footer">
          <span>
            © {new Date().getFullYear()} {profile.name} · 3D furniture by{' '}
            <a href="https://kenney.nl" target="_blank" rel="noreferrer">Kenney</a> (CC0)
          </span>
          <div className="footer__links">
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </div>
        </footer>
      </div>
    </section>
  )
}
