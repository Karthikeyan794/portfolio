import { motion } from 'motion/react'
import { profile, socials } from '../data'
import ContactForm from './ContactForm'

export default function Contact() {
  return (
    <section className="section" id="contact">
      <motion.div
        className="wrap"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ type: 'spring', stiffness: 70, damping: 18 }}
      >
        <div className="contact">
          <div className="contact__left">
            <div>
              <span className="eyebrow">05 — Contact</span>
              <h2>Let's build something.</h2>
            </div>
            <p>The fastest way to reach me is email — I read everything and reply to anything that isn't a template.</p>
            <a className="mailto" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
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
      </motion.div>
    </section>
  )
}
