import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { useEffect, useRef } from 'react'
import { projectBySlug, profile, type Slice } from '../data'
import { closeProject } from '../router'

function isEmbed(src: string) {
  return /^https?:\/\//.test(src)
}

function SliceBlock({ slice, index }: { slice: Slice; index: number }) {
  return (
    <motion.section
      className={`slice slice--${slice.span ?? 'full'}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ type: 'spring', stiffness: 64, damping: 18, delay: (index % 2) * 0.08 }}
    >
      {slice.heading && <h2 className="slice__h">{slice.heading}</h2>}
      {slice.body && <p className="slice__p">{slice.body}</p>}

      {slice.image && (
        <figure className="slice__figure">
          <img src={slice.image} alt="" loading="lazy" decoding="async" />
          {slice.caption && <figcaption>{slice.caption}</figcaption>}
        </figure>
      )}

      {slice.video ? (
        <div className="slice__video">
          {isEmbed(slice.video) ? (
            <iframe
              src={slice.video}
              title={slice.heading ?? 'Demo video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video src={slice.video} controls playsInline preload="metadata" />
          )}
        </div>
      ) : (
        slice.heading === 'Walkthrough' && (
          <div className="slice__placeholder">
            <strong>Demo video goes here.</strong>
            <span>Drop an MP4 in <code>public/</code> or paste a YouTube / Loom link into this project's <code>video</code> field.</span>
          </div>
        )
      )}
    </motion.section>
  )
}

export default function ProjectPage({ slug }: { slug: string }) {
  const project = projectBySlug(slug)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 })

  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.12])
  const heroY = useTransform(heroProgress, [0, 1], ['0%', '18%'])
  const heroFade = useTransform(heroProgress, [0, 0.8], [1, 0.25])

  // open at the top, and let Esc take you back
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProject()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [slug])

  if (!project || !project.detail) {
    return (
      <main className="case case--missing">
        <p>That project doesn't have a case study yet.</p>
        <button className="btn btn--primary" onClick={closeProject}>
          Back to work
        </button>
      </main>
    )
  }

  const { detail } = project

  return (
    <main className="case">
      <motion.div className="case__bar" style={{ scaleX: bar }} aria-hidden="true" />

      <header className="case__nav">
        <button className="case__back" onClick={closeProject}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          All work
        </button>
        {project.demo?.href && (
          <a className="case__demo" href={project.demo.href} target="_blank" rel="noreferrer">
            {project.demo.label}
          </a>
        )}
      </header>

      {/* banner: the thumbnail up top, parallaxing under the title */}
      <div className="case__hero" ref={heroRef}>
        {project.cover && (
          <motion.img className="case__hero-img" src={project.cover} alt="" style={{ scale: heroScale, y: heroY, opacity: heroFade }} />
        )}
        <div className="case__hero-shade" aria-hidden="true" />
        <div className="wrap case__hero-text">
          <motion.span className="eyebrow case__eyebrow" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.6 }}>
            {project.tags.join(' · ')}
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18, type: 'spring', stiffness: 70, damping: 18 }}>
            {project.title}
          </motion.h1>
          <motion.p className="case__tagline" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }}>
            {project.tagline}
          </motion.p>
        </div>
      </div>

      <div className="wrap case__body">
        <motion.div className="case__facts" initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }}>
          {detail.facts.map((f) => (
            <div key={f.label}>
              <span className="case__fact-label">{f.label}</span>
              <span className="case__fact-value">{f.value}</span>
            </div>
          ))}
        </motion.div>

        <motion.p className="case__intro" initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7 }}>
          {detail.intro}
        </motion.p>

        <div className="slices">
          {detail.slices.map((s, i) => (
            <SliceBlock key={(s.heading ?? '') + i} slice={s} index={i} />
          ))}
        </div>

        <motion.div className="case__end" initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}>
          <h2>Want the full story?</h2>
          <p>Happy to walk through the decisions, the dead ends and what I'd change.</p>
          <div className="case__end-actions">
            <a className="btn btn--primary" href={`mailto:${profile.email}?subject=${encodeURIComponent(project.title)}`}>
              Get in touch
            </a>
            <button className="btn btn--ghost" onClick={closeProject}>
              Back to all work
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
