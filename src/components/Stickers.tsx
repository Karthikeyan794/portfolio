import { motion } from 'motion/react'
import type { RefObject } from 'react'
import { stickers } from '../data'

type Props = { boundsRef: RefObject<HTMLDivElement | null> }

/** Playful draggable stickers scattered over the hero visual. */
export default function Stickers({ boundsRef }: Props) {
  return (
    <>
      {stickers.map((s) => (
        <motion.button
          key={s.label}
          type="button"
          className={`sticker sticker--${s.tone}`}
          style={{ left: `${s.x}%`, top: `${s.y}%`, rotate: s.rotate }}
          drag
          dragConstraints={boundsRef}
          dragElastic={0.12}
          dragMomentum={false}
          whileHover={{ scale: 1.05, rotate: 0 }}
          whileDrag={{ scale: 1.1, zIndex: 10 }}
          aria-label={`${s.label} sticker — drag me around`}
        >
          <span aria-hidden="true">{s.emoji}</span>
          {s.label}
        </motion.button>
      ))}
    </>
  )
}
