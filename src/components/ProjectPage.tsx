import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { useEffect, useRef } from 'react'
import { profile, projectBySlug, type Project, type Slice } from '../data'
import { closeProject } from '../router'

function isEmbed(src: string) {
  return /^https?:\/\//.test(src)
}

/**
 * Every project has a page, even the ones without a hand-written case study —
 * this fills in a sensible one from the fields we already have.
 */
function detailFor(p: Project) {
  if (p.detail) return p.detail
  return {
    intro: p.blurb,
    facts: [
      { label: 'Type', value: p.tags[0] ?? 'Design' },
      { label: 'Year', value: p.year },
      { label: 'Focus', value: p.tags.slice(1, 3).join(' · ') || '—' },
      { label: 'Kind', value: p.kind === 'practice' ? 'Self-set study' : 'Project work' },
    ],
    slices: [
      {
        heading: 'The screens',
        body: 'Add the screens for this project — drop images in public/work/ and list them here. Each one can carry its own note, which appears when you point at it.',
        image: p.cover,
        caption: `${p.title} — replace with the real screens.`,
      },
      { heading: 'Walkthrough', body: '', video: '' },
    ] as Slice[],
  }
}

/** One media block on the right with its explanation on the left. */
function Row({ slice, index }: { slice: Slice; index: number }) {
  const hasMedia = Boolean(slice.image || slice.video)
  return (
    <motion.section
      className="row"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ type: 'spring', stiffness: 66, damping: 18 }}
    >
      {/* left: the words */}
      <div className="row__text">
        <span className="row__no">{String(index + 1).padStart(2, '0')}</span>
        {slice.heading && <h2 className="row__h">{slice.heading}</h2>}
        {slice.body && <p className="row__p">{slice.body}</p>}
      </div>

      {/* right: the screens or the video */}
      <div className="row__media">
        {slice.video ? (
          <div className="frame frame--video">
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
        ) : slice.image ? (
          /* point at the image and its note slides up over it */
          <figure className="frame frame--shot">
            <img src={slice.image} alt={slice.caption ?? slice.heading ?? ''} loading="lazy" decoding="async" />
            {slice.caption && <figcaption>{slice.caption}</figcaption>}
          </figure>
        ) : (
          <div className="frame frame--empty">
            <strong>Demo video goes here.</strong>
            <span>
              Drop an MP4 in <code>public/</code> or paste a YouTube / Loom link into this slice's <code>video</code> field.
            </span>
          </div>
        )}
        {!hasMedia && null}
      </div>
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
  const heroY = useTransform(heroProgress, [0, 1], ['0%', '16%'])
  const heroFade = useTransform(heroProgress, [0, 0.85], [1, 0.3])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeProject()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [slug])

  if (!project) {
    return (
      <main className="case case--missing">
        <p>No project with that name.</p>
        <button className="btn btn--primary" onClick={closeProject}>
          Back to work
        </button>
      </main>
    )
  }

  const detail = detailFor(project)

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
        <div className="case__nav-right">
          {project.behance && (
            <a className="case__link" href={project.behance} target="_blank" rel="noreferrer">
              Behance ↗
            </a>
          )}
          {project.demo?.href && (
            <a className="case__demo" href={project.demo.href} target="_blank" rel="noreferrer">
              {project.demo.label}
            </a>
          )}
        </div>
      </header>

      {/* the thumbnail, up top */}
      <div className="case__hero" ref={heroRef}>
        {project.cover && (
          <motion.img className="case__hero-img" src={project.cover} alt="" style={{ scale: heroScale, y: heroY, opacity: heroFade }} />
        )}
        <div className="case__hero-shade" aria-hidden="true" />
        <div className="wrap wrap--wide case__hero-text">
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

      <div className="wrap wrap--wide case__body">
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

        <div className="rows">
          {detail.slices.map((s, i) => (
            <Row key={(s.heading ?? '') + i} slice={s} index={i} />
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
