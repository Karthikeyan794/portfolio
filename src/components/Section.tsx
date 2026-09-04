import type { ReactNode } from 'react'
import { useReveal } from '../hooks'

type Props = {
  id: string
  eyebrow: string
  title: string
  meta?: string
  children: ReactNode
}

export default function Section({ id, eyebrow, title, meta, children }: Props) {
  const ref = useReveal<HTMLDivElement>()

  return (
    <section className="section" id={id}>
      <div className="wrap reveal" ref={ref}>
        <div className="section__head">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2>{title}</h2>
          </div>
          {meta && <span className="section__count">{meta}</span>}
        </div>
        {children}
      </div>
    </section>
  )
}
