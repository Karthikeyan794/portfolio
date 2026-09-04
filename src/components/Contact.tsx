import { profile, socials } from '../data'
import { useReveal } from '../hooks'

export default function Contact() {
  const ref = useReveal<HTMLDivElement>()

  return (
    <section className="section" id="contact">
      <div className="wrap reveal" ref={ref}>
        <div className="contact">
          <div>
            <span className="eyebrow">04 — Contact</span>
            <h2>Let's build something.</h2>
          </div>
          <p>
            The fastest way to reach me is email — I read everything and reply to anything
            that isn't a template.
          </p>
          <a className="mailto" href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
        </div>

        <footer className="footer">
          <span>
            © {new Date().getFullYear()} {profile.name}
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
