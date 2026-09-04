import { motion } from 'motion/react'
import type { ReactNode } from 'react'

type Props = {
  id: string
  eyebrow: string
  title: string
  desc?: ReactNode
  meta?: string
  children: ReactNode
}

const inView = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.15 },
  transition: { type: 'spring' as const, stiffness: 70, damping: 18 },
}

export default function Section({ id, eyebrow, title, desc, meta, children }: Props) {
  return (
    <section className="section" id={id}>
      <motion.div className="wrap" {...inView}>
        <div className="section__head">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
          </div>
          <div>
            {desc && <p className="section__desc">{desc}</p>}
            {meta && <div className="section__count">{meta}</div>}
          </div>
        </div>
        {children}
      </motion.div>
    </section>
  )
}
