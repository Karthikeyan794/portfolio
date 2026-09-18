import { motion } from 'motion/react'
import Words from './Words'

/**
 * The intro band under the banner: role, time, stack, where it stands.
 * Not the usual row of labels penned between two rules — each fact stands
 * behind its own vertical hairline, and the hairline is what lights up.
 */
const group = { rest: {}, in: { transition: { staggerChildren: 0.09 } } }
const item = {
  rest: { opacity: 0, y: 12 },
  in: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
} as const
const rule = {
  rest: { scaleY: 0 },
  in: { scaleY: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
} as const

export default function Credits({ facts }: { facts: { label: string; value: string }[] }) {
  return (
    <motion.dl
      className="credits"
      variants={group}
      initial="rest"
      whileInView="in"
      viewport={{ once: true, amount: 0.5 }}
      aria-label="Project credits"
    >
      {facts.map((f) => (
        <div className="credit" key={f.label}>
          <motion.span className="credit__rule" variants={rule} aria-hidden="true" />
          <motion.dt className="credit__k" variants={item}>
            {f.label}
          </motion.dt>
          <motion.dd className="credit__v" variants={item}>
            <Words text={f.value} />
          </motion.dd>
        </div>
      ))}
    </motion.dl>
  )
}
