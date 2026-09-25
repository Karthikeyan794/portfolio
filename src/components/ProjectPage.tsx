import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { profile, projectBySlug, type Project, type Slice } from '../data'
import { closeProject } from '../router'
import GridBg from './GridBg'
import Brief from './Brief'
import AutoClip from './AutoClip'
import Credits from './Credits'
import DemoFrame from './DemoFrame'
import { Lightbox, ZoomButton, type Zoomed } from './Zoom'
import Words from './Words'
import Primer from './Primer'
import CaseTabs, { type Tab } from './CaseTabs'
import RotatingWord from './RotatingWord'

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
    facts: [
      { label: 'Type', value: p.tags[0] ?? 'Design' },
      { label: 'Year', value: p.year },
      { label: 'Focus', value: p.tags.slice(1, 3).join(' · ') || '—' },
      { label: 'Kind', value: p.kind === 'practice' ? 'Self-set study' : 'Project work' },
    ],
    slices: [
      {
        heading: 'The work',
        // This project has no written case study yet, so the page says what it
        // is in its own words and hands people to the full set on Behance. It
        // must never print build instructions at a visitor.
        body: p.behance
          ? `${p.blurb} The full set of screens is on Behance.`
          : p.blurb,
        // Only show a picture when it IS the work. The bento covers are
        // decorative stock, so putting one under "The work" would misrepresent
        // it — better a clean text slice and a link to the real thing.
        image: p.cover && !p.cover.startsWith('/bento/') ? p.cover : undefined,
        caption: p.tagline,
      },
    ] as Slice[],
  }
}

/* the hero opens one piece at a time: the tags, then the title rising out of
   its own mask, the line under it, and last the facts strip wiping open from
   the left with each fact arriving behind the wipe. */
const heroV = { rest: {}, in: { transition: { staggerChildren: 0.14, delayChildren: 0.25 } } }
const heroLine = {
  rest: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 74, damping: 18 } },
} as const
const heroMask = {
  rest: { y: '112%' },
  in: { y: '0%', transition: { duration: 0.95, ease: [0.16, 1, 0.3, 1] } },
} as const

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
  const hasMedia = Boolean(slice.image || slice.pair || slice.stats || slice.clip || slice.video)
  const [zoom, setZoom] = useState<Zoomed>(null)

  // the screen drifts a few pixels against the page as it passes, so a still
  // screenshot still moves. It is the frame that travels, never the image
  // inside it, so nothing ever gets cropped.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const drift = useTransform(scrollYProgress, [0, 1], [26, -26])
  const float = useSpring(drift, { stiffness: 80, damping: 24, restDelta: 0.4 })

  // The section holds full contrast through the middle of its travel and sits
  // back as it arrives and leaves, so the page stays alive the whole way down
  // instead of each block animating once and then going static. Reusing the
  // scroll progress above — no second listener.
  //
  // Deliberately NOT sprung: opacity is a pure function of scroll position, so
  // no half-finished animation can leave it resting dim.
  const dim = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [0.35, 1, 1, 0.35])
  const back = useTransform(scrollYProgress, [0, 0.22, 0.78, 1], [0.985, 1, 1, 0.985])
  // dimming is motion; someone who asked for less of it should just read
  const reduce = useReducedMotion()

  // It has to FAIL SAFE. Scroll-linked values are written by motion's rAF
  // loop, and rAF is throttled to nothing whenever the document is hidden —
  // a backgrounded tab, another window focused, battery saver. Applying the
  // dim before that loop has ever run would render the whole case study at
  // 35% until it woke up, which for body copy is not readable. So the rows
  // stay at the full opacity CSS gives them until scroll actually reports a
  // position, and only then does the scrub take over.
  const [scrubLive, setScrubLive] = useState(false)
  useEffect(() => scrollYProgress.on('change', () => setScrubLive(true)), [scrollYProgress])

  return (
    <motion.section
      className={hasMedia ? 'row' : 'row row--text'}
      id={slice.anchor}
      ref={ref}
      variants={groupV}
      initial="rest"
      whileInView="in"
      viewport={{ once: true, amount: 0.2 }}
      style={reduce || !scrubLive ? undefined : { opacity: dim, scale: back }}
    >
      {/* left: the words */}
      <motion.div className="row__text" variants={groupV}>
        <motion.span className="row__no" variants={lineV}>
          {String(no).padStart(2, '0')}
        </motion.span>
        {slice.heading && (
          <motion.h2 className="row__h" variants={lineV}>
            <Words text={slice.heading} />
          </motion.h2>
        )}
        {/* a blank line in the copy starts a new paragraph, the same way it
            does in Brief — the longer flows earn a break, and without this
            the two halves ran together into one wall */}
        {slice.body?.split('\n\n').map((para) => (
          <motion.p className="row__p" variants={lineV} key={para.slice(0, 24)}>
            <Words text={para} />
          </motion.p>
        ))}
      </motion.div>

      {/* the product itself, under the words and across the whole row */}
      {slice.embed && <DemoFrame src={slice.embed.src} pages={slice.embed.pages} art={slice.embed.art} title={slice.heading} />}

      {/* right: the screens or the video */}
      {hasMedia && (
        <motion.div className="row__media" style={{ y: float }}>
          {slice.video ? (
            <motion.div className="frame frame--video" variants={frameV}>
                {isEmbed(slice.video) ? (
                  <iframe
                    src={slice.video}
                    title={slice.heading ?? 'Demo video'}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <video src={slice.video} controls loop playsInline preload="metadata" />
                )}
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
          ) : slice.image ? (
            /* point at the image and its note slides up over it. Guarded: a
               slice can carry only a clip, and an <img> with no src renders as
               a broken-picture icon with the heading as its alt text. */
            /* the line sits UNDER the picture, not over it. The inner wrapper
               is a motion.div and not a plain one on purpose: variants only
               travel through motion components, and the image's own reveal
               rides down this chain. */
            <motion.figure className="shotfig" variants={frameV}>
              <motion.div className="frame frame--shot">
                <motion.img
                  src={slice.image}
                  alt={slice.caption ?? slice.heading ?? ''}
                  loading="lazy"
                  decoding="async"
                  variants={shotV}
                />
                <motion.span className="frame__sheen" variants={sheenV} aria-hidden="true" />
                <ZoomButton onOpen={() => setZoom({ src: slice.image!, alt: slice.caption ?? slice.heading })} label={slice.heading} />
              </motion.div>
              {slice.caption && <figcaption className="frame__cap">{slice.caption}</figcaption>}
            </motion.figure>
          ) : null}

          {/* the flow, recorded — sits under whatever explains it */}
          {slice.clip && <ClipFigure slice={slice} onZoom={setZoom} />}
        </motion.div>
      )}
      <Lightbox shot={zoom} onClose={() => setZoom(null)} />
    </motion.section>
  )
}

/**
 * A recorded flow, and its own opinion about whether it can be shown.
 *
 * The biggest recordings are served from a GitHub release rather than from
 * /public — they are over the 100 MB a repository allows a single file — so
 * this address can legitimately be missing: not uploaded yet, or served with a
 * content type the browser refuses. AutoClip drops to the smaller copy in
 * /public on its own; if there is no copy to drop to, the whole figure removes
 * itself, because an empty frame with a caption under it reads as a bug.
 */
function ClipFigure({
  slice,
  onZoom,
}: {
  slice: Slice
  onZoom: (s: { src: string; alt?: string; video?: boolean }) => void
}) {
  const [dead, setDead] = useState(false)
  // the address that actually loaded, so zooming opens the same thing the page is showing
  const [live, setLive] = useState(slice.clip!)
  if (dead) return null
  const isGif = /\.gif$/.test(live)
  return (
    <motion.figure className="shotfig" variants={frameV}>
      <motion.div className="frame frame--clip">
        {isGif ? (
          <img src={live} alt={slice.heading ?? ''} loading="lazy" decoding="async" onError={() => setDead(true)} />
        ) : (
          <AutoClip
            src={slice.clip!}
            fallback={slice.clipFallback}
            poster={slice.poster}
            label={slice.heading}
            onFail={() => setDead(true)}
            onFallback={setLive}
          />
        )}
        <ZoomButton onOpen={() => onZoom({ src: live, alt: slice.heading, video: !isGif })} label={slice.heading} />
      </motion.div>
      {/* a clip carries its line the same way a still does */}
      {slice.caption && !slice.image && <figcaption className="frame__cap">{slice.caption}</figcaption>}
    </motion.figure>
  )
}

/** a chapter name as an id the top bar can scroll to: 'How it works' -> 'how-it-works' */
export function chapterId(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

/** Slices carry a chapter label; this turns them into chapters that number from 01. */
function chaptered(slices: Slice[]) {
  let current = ''
  let n = 0
  // A slice that asks for a video but has no URL yet is not ready to show —
  // its prose promises a clip that isn't there. Drop it here, before the
  // numbering runs, so nothing renders and no number is skipped. Paste a URL
  // into the field and the slice reappears in place, prose and all.
  // (Prose slices never set `video`, so they are untouched.)
  const ready = slices.filter((slice) => slice.video !== '')
  return ready.map((slice) => {
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
  // the demo window asks the header to leave while it is on screen
  const [navAway, setNavAway] = useState(false)
  useEffect(() => {
    const onDemo = (e: Event) => setNavAway(Boolean((e as CustomEvent<boolean>).detail))
    window.addEventListener('demo-inview', onDemo)
    return () => window.removeEventListener('demo-inview', onDemo)
  }, [])
  const { scrollYProgress } = useScroll()
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 26, restDelta: 0.001 })

  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroScale = useTransform(heroProgress, [0, 1], [1, 1.12])
  const heroY = useTransform(heroProgress, [0, 1], ['0%', '16%'])
  const heroFade = useTransform(heroProgress, [0, 0.85], [1, 0.3])
  // the banner starts as an inset card and opens to the full width of the
  // screen as you begin to scroll. Driven as a plain 0-1 number the CSS does
  // the arithmetic with: insets and the corner radius are calc()'d off it, so
  // nothing here touches layout and nothing reflows on a scroll frame.
  const heroOpen = useTransform(heroProgress, [0, 0.4], [0, 1])

  // the nav floats on the cover, and takes a background the moment the cover
  // leaves — measured off the hero itself, not a guessed share of the screen,
  // so it still lines up if the cover's height changes
  const [solid, setSolid] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      const h = heroRef.current?.offsetHeight ?? window.innerHeight
      setSolid(window.scrollY > h - 72)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [slug])

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
  // only the sections this project really has get a tab
  // the walk through the page, in the order you meet it
  const chapters = [...new Set(detail.slices.map((s) => s.chapter).filter(Boolean) as string[])]
  const tabs: Tab[] = [
    detail.primer && { id: 'overview', label: 'Overview' },
    detail.brief && { id: 'problem', label: 'Problem' },
    detail.brief && { id: 'solution', label: 'Solution' },
    chapters.includes('How it works') && { id: chapterId('How it works'), label: 'How it works' },
    detail.slices.some((s) => s.anchor === 'demo') && { id: 'demo', label: 'Demo' },
  ].filter(Boolean) as Tab[]

  return (
    <>
      <GridBg />
      <main className="case">
      <motion.div className="case__bar" style={{ scaleX: bar }} aria-hidden="true" />

      <header className={[ 'case__nav', solid && 'case__nav--solid', navAway && 'case__nav--away' ].filter(Boolean).join(' ')}>
        <button className="case__back" onClick={closeProject}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          Back
        </button>
        <div className="case__nav-right">
          {tabs.length > 1 && <CaseTabs tabs={tabs} />}
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

      {/* full screen, and the nav sits on top of it */}
      <div className="case__hero" ref={heroRef}>
        <motion.div className="case__hero-frame" style={{ '--grow': heroOpen } as React.CSSProperties}>
          {project.cover && (
            <motion.div
              className="case__hero-media"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden="true"
            >
              <motion.img className="case__hero-img" src={project.cover} alt="" style={{ scale: heroScale, y: heroY, opacity: heroFade }} />
            </motion.div>
          )}
          <div className="case__hero-blur" aria-hidden="true" />
          <div className="case__hero-shade" aria-hidden="true" />
        </motion.div>
        <motion.div className="wrap wrap--wide case__hero-text" variants={heroV} initial="rest" animate="in">
          <span className="case__h1">
            <motion.h1 variants={heroMask}>{project.title}</motion.h1>
          </span>
          {detail.hook && (
            <motion.p className="case__hook" variants={heroLine}>
              <RotatingWord lead={detail.hook.lead} words={detail.hook.words} />
            </motion.p>
          )}
        </motion.div>
      </div>


      <div className="wrap wrap--wide case__body">
        {detail.facts.length > 0 && <Credits facts={detail.facts} />}

        {detail.primer && <Primer primer={detail.primer} />}


        {detail.brief && <Brief brief={detail.brief} />}

        <div className="rows">
          {chaptered(detail.slices).map((item, i) => (
            <Fragment key={(item.slice.heading ?? '') + i}>
              {item.opens && (
                <motion.h2
                  className="chapter"
                  id={chapterId(item.opens)}
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
          <h2>
            <Words text="Want the full story?" />
          </h2>
          <p>
            <Words text="Happy to walk through the decisions, the dead ends and what I'd change." />
          </p>
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
    </>
  )
}
