import { motion } from 'motion/react'
import { useRef } from 'react'
import { profile, socials } from '../data'
import Floaters from './Floaters'

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring' as const, stiffness: 90, damping: 18, delay },
})

export default function Hero() {
  const initials = profile.name.split(' ').map((w) => w[0]).join('').slice(0, 2)
  const panelRef = useRef<HTMLDivElement>(null)

  return (
    <section className="hero wrap" id="top">
      <div className="hero__panel" ref={panelRef}>
        <Floaters boundsRef={panelRef} />

        <div className="hero__content">
          <motion.span className="pill" {...rise(0.15)}>
            <span className="pill__avatar" aria-hidden="true">{initials}</span>
            {profile.name} · {profile.location.split(',')[0]}
            {profile.available && (
              <>
                <span className="pill__blip" aria-hidden="true" />
                {profile.availableNote}
              </>
            )}
          </motion.span>

          <motion.h1 {...rise(0.25)}>
            The frontend engineer <span>who designs.</span>
          </motion.h1>

          <motion.p className="hero__sub" {...rise(0.35)}>
            {profile.tagline}
          </motion.p>

          <motion.div className="cta-row" {...rise(0.45)}>
            <a className="btn btn--primary" href={`mailto:${profile.email}`}>
              Get in touch
            </a>
            <a className="btn btn--white" href="#work">
              See projects
            </a>
            {profile.resumeUrl && (
              <a className="btn btn--white" href={profile.resumeUrl}>
                Résumé
              </a>
            )}
          </motion.div>

          <motion.div className="hero__meta" {...rise(0.55)}>
            {socials.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer">
                {s.label} ↗
              </a>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
