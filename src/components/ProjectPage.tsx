import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import { Fragment, useEffect, useRef } from 'react'
import { profile, projectBySlug, type Project, type Slice } from '../data'
import { closeProject } from '../router'
import Diagram from './Diagrams'

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

/* the row plays in: number, heading, body, then the screen settles and a light
   sweeps across it once. Everything below is one variant tree so the order holds. */
const groupV = { rest: {}, in: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } } }
const lineV = {
  rest: { opacity: 0, y: 18 },
  in: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 92, damping: 18 } },
} as const
const frameV = {
  rest: { opacity: 0, y: 48 },
  in: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60, damping: 18 } },
} as const
const shotV = {
  rest: { scale: 1.09 },
  in: { scale: 1, transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } },
} as const
const sheenV = {
  rest: { x: '-130%' },
  in: { x: '130%', transition: { duration: 1.15, delay: 0.4, ease: 'easeInOut' } },
} as const

/** One media block on the right with its explanation on the left. */
function Row({ slice, no }: { slice: Slice; no: number }) {
  const ref = useRef<HTMLDivElement>(null)
  // a slice with no image and no video field is prose — it gets the full width
  const hasMedia = Boolean(slice.image || slice.diagram || slice.pair || slice.stats) || slice.video !== undefined

  // the screen drifts a few pixels against the page as it passes, so a still
  // screenshot still moves. It is the frame that travels, never the image
  // inside it, so nothing ever gets cropped.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const drift = useTransform(scrollYProgress, [0, 1], [26, -26])
  const float = useSpring(drift, { stiffness: 80, damping: 24, restDelta: 0.4 })

  return (
    <motion.section
      className={hasMedia ? 'row' : 'row row--text'}
      ref={ref}
      variants={groupV}
      initial="rest"
      whileInView="in"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* left: the words */}
      <motion.div className="row__text" variants={groupV}>
        <motion.span className="row__no" variants={lineV}>
          {String(no).padStart(2, '0')}
        </motion.span>
        {slice.heading && (
          <motion.h2 className="row__h" variants={lineV}>
            {slice.heading}
          </motion.h2>
        )}
        {slice.body && (
          <motion.p className="row__p" variants={lineV}>
            {slice.body}
          </motion.p>
        )}
      </motion.div>

      {/* right: the screens or the video */}
      {hasMedia && (
        <motion.div className="row__media" style={{ y: float }}>
          {slice.video !== undefined ? (
            slice.video ? (
              <motion.div className="frame frame--video" variants={frameV}>
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
              </motion.div>
            ) : (
              <motion.div className="frame frame--empty" variants={frameV}>
                <strong>Demo video goes here.</strong>
                <span>
                  Drop an MP4 in <code>public/</code> or paste a YouTube / Loom link into this slice's <code>video</code> field.
                </span>
              </motion.div>
            )
          ) : slice.diagram ? (
            <motion.div className="frame frame--dia" variants={frameV}>
              <Diagram id={slice.diagram} />
            </motion.div>
          ) : slice.pair ? (
            <motion.div className="frame frame--pair" variants={frameV}>
              <div className="pair">
                <span className="pair__k">The problem</span>
                <p>{slice.pair.problem}</p>
              </div>
              <div className="pair pair--good">
                <span className="pair__k">What I did</span>
                <p>{slice.pair.solution}</p>
              </div>
            </motion.div>
          ) : slice.stats ? (
            <motion.div className="frame frame--stats" variants={frameV}>
              {slice.stats.map((st) => (
                <motion.div className="stat" key={st.label} variants={lineV}>
                  <span className="stat__v">{st.value}</span>
                  <span className="stat__l">{st.label}</span>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* point at the image and its note slides up over it */
            <motion.figure className="frame frame--shot" variants={frameV}>
              <motion.img
                src={slice.image}
                alt={slice.caption ?? slice.heading ?? ''}
                loading="lazy"
                decoding="async"
                variants={shotV}
              />
              <motion.span className="frame__sheen" variants={sheenV} aria-hidden="true" />
              {slice.caption && <figcaption>{slice.caption}</figcaption>}
            </motion.figure>
          )}
        </motion.div>
      )}
    </motion.section>
  )
}

/** Slices carry a chapter label; this turns them into chapters that number from 01. */
function chaptered(slices: Slice[]) {
  let current = ''
  let n = 0
  return slices.map((slice) => {
    const opens = Boolean(slice.chapter && slice.chapter !== current)
    if (opens) {
      current = slice.chapter as string
      n = 0
    }
    n += 1
    return { slice, opens: opens ? current : null, no: n }
  })
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
        <div className="case__hero-blur" aria-hidden="true" />
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

          {/* the facts sit on the banner as a frosted strip */}
          <motion.dl
            className="case__facts"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, type: 'spring', stiffness: 70, damping: 18 }}
          >
            {detail.facts.map((f) => (
              <div key={f.label}>
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>
      </div>

      <div className="wrap wrap--wide case__body">
        <motion.div className="case__lead" initial={{ opacity: 0, y: 26 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7 }}>
          <span className="case__lead-label">Overview</span>
          <p className="case__intro">{detail.intro}</p>
        </motion.div>

        <div className="rows">
          {chaptered(detail.slices).map((item, i) => (
            <Fragment key={(item.slice.heading ?? '') + i}>
              {item.opens && (
                <motion.h2
                  className="chapter"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.7 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className="chapter__name">{item.opens}</span>
                  <motion.span
                    className="chapter__rule"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true, amount: 0.7 }}
                    transition={{ duration: 0.9, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                    aria-hidden="true"
                  />
                </motion.h2>
              )}
              <Row slice={item.slice} no={item.no} />
            </Fragment>
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
