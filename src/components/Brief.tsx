import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { useRef, useState } from 'react'
import type { Brief as BriefData } from '../data'
import Words from './Words'
import ParticleShot from './ParticleShot'

/**
 * Two sections, each one a stop on the top bar: Why (what was wrong, and what
 * answers it) and Benefits (what you get out of it). No inline tabs — the bar
 * at the top of the page is already the way around this case study, and a
 * second row of tabs underneath it only competed with it.
 */

const group = { rest: {}, in: { transition: { staggerChildren: 0.05 } } }
const item = {
  rest: { opacity: 0, y: 12 },
  in: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 18 } },
} as const

/** the section title, set like the overview's so the page has one voice */
function Title({ children }: { children: string }) {
  return (
    <motion.h3 className="bhead" variants={item}>
      <Words text={children} />
    </motion.h3>
  )
}

/**
 * The picture beside a block, as a field of points the cursor can push
 * through. It removes itself if the file is not there, so a slot can be
 * wired up before the artwork lands without leaving a broken frame.
 *
 * It also travels against the page as the block passes, the same way the
 * overview's screen does — so the picture and the words beside it never
 * scroll at quite the same rate.
 */
function Shot({ src, alt, onFail }: { src: string; alt: string; onFail: () => void }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const drift = useTransform(scrollYProgress, [0, 1], [46, -46])
  const float = useSpring(drift, { stiffness: 70, damping: 24, restDelta: 0.4 })

  return (
    <motion.figure className="wshot" variants={item} ref={ref}>
      {/* the drift lives on an inner element on purpose: the figure's reveal
          variant already animates y, and a style y on the same node would be
          fighting it for the same property */}
      <motion.div className="wshot__track" style={reduce ? undefined : { y: float }}>
        <ParticleShot src={src} alt={alt} onFail={onFail} />
      </motion.div>
    </motion.figure>
  )
}

/** one side of the argument: two paragraphs, and the picture that sits with them */
function Block({ id, title, lead, body, image }: {
  id: string; title: string; lead: string; body: string; image?: string
}) {
  // the second column exists only while a picture is actually in it: a path
  // whose file is not there yet collapses the block back to one column rather
  // than holding an empty half open
  const [shot, setShot] = useState(image)
  return (
    <div className={shot ? 'wblock' : 'wblock wblock--solo'} id={id}>
      <div className="wcol">
        <Title>{title}</Title>
        <motion.p className="bpanel__lead" variants={item}>
          <Words text={lead} />
        </motion.p>
        {/* a blank line in the copy starts a new paragraph */}
        {body.split('\n\n').map((para) => (
          <motion.p className="bpanel__body" variants={item} key={para.slice(0, 24)}>
            <Words text={para} />
          </motion.p>
        ))}
      </div>
      {shot && <Shot src={shot} alt={`${title} — illustration`} onFail={() => setShot(undefined)} />}
    </div>
  )
}

export default function Brief({ brief }: { brief: BriefData }) {
  return (
    <>
      <motion.section
        className="brief brief--why"
        aria-label="Problem and solution"
        variants={group}
        initial="rest"
        whileInView="in"
        viewport={{ amount: 0.12 }}
      >
        <Block id="problem" title="Problem" lead={brief.problem.lead} body={brief.problem.body} image={brief.problem.image} />
        <Block id="solution" title="Solution" lead={brief.solution.lead} body={brief.solution.body} image={brief.solution.image} />
      </motion.section>

    </>
  )
}
