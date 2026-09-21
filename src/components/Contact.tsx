import { useEffect, useState } from 'react'
import { profile, socials } from '../data'
import { useReveal } from '../hooks'
import ContactModal from './ContactModal'

export default function Contact() {
  const ref = useReveal<HTMLDivElement>()
  const [open, setOpen] = useState(false)

  // the nav's Contact button opens the same dialog
  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener('open-contact', onOpen)
    return () => window.removeEventListener('open-contact', onOpen)
  }, [])

  return (
    <section className="section" id="contact">
      <div className="wrap reveal" ref={ref}>
        {/* the whole invitation is one line and one button — the form itself
            lives in a dialog, where it has room to be a nicer thing */}
        <div className="cband">
          <span className="eyebrow">03 — Contact</span>
          <h2 className="cband__h">Let's build something.</h2>
          <p className="cband__p">
            The fastest way to reach me is email — I read everything and reply to anything
            that isn't a template.
          </p>
          <button className="cband__btn" onClick={() => setOpen(true)}>
            Write to me
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 12h15M13 5l7 7-7 7" />
            </svg>
          </button>
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

      <ContactModal open={open} onClose={() => setOpen(false)} />
    </section>
  )
}
