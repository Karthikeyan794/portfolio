import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useEffect, type RefObject } from 'react'
import { stickers, type Sticker } from '../data'

type Props = { boundsRef: RefObject<HTMLDivElement | null> }

function Item({ s, i, mx, my, boundsRef }: { s: Sticker; i: number; mx: MotionValue<number>; my: MotionValue<number>; boundsRef: Props['boundsRef'] }) {
  // parallax: deeper stickers move more with the mouse
  const px = useTransform(mx, (v) => v * 16 * s.depth)
  const py = useTransform(my, (v) => v * 12 * s.depth)
  return (
    <motion.div style={{ position: 'absolute', left: `${s.x}%`, top: `${s.y}%`, x: px, y: py }}>
      <motion.button
        type="button"
        drag
        dragConstraints={boundsRef}
        dragElastic={0.12}
        dragMomentum={false}
        whileHover={{ scale: 1.05 }}
        whileDrag={{ scale: 1.1, zIndex: 10 }}
        style={{ rotate: s.rotate, background: 'transparent', border: 0, padding: 0, cursor: 'grab' }}
        aria-label={`${s.label} sticker — drag me around`}
      >
        {/* inner element drifts forever; the outer button handles drag so they don't fight */}
        <motion.span
          className={`sticker sticker--${s.tone}`}
          style={{ position: 'static' }}
          animate={{ y: [0, -9 - (i % 3) * 3, 0], rotate: [0, i % 2 ? 2.5 : -2.5, 0] }}
          transition={{ duration: 5.5 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
        >
          <span aria-hidden="true">{s.emoji}</span>
          {s.label}
        </motion.span>
      </motion.button>
    </motion.div>
  )
}

/** Draggable stickers that drift and follow the mouse — the floating-objects motion from the reference. */
export default function Stickers({ boundsRef }: Props) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mx = useSpring(rawX, { stiffness: 50, damping: 18 })
  const my = useSpring(rawY, { stiffness: 50, damping: 18 })

  useEffect(() => {
    const el = boundsRef.current?.closest('.hero') ?? boundsRef.current
    if (!el) return
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      rawX.set(((e.clientX - r.left) / r.width - 0.5) * 2)
      rawY.set(((e.clientY - r.top) / r.height - 0.5) * 2)
    }
    const onLeave = () => {
      rawX.set(0)
      rawY.set(0)
    }
    el.addEventListener('pointermove', onMove as EventListener)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove as EventListener)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [boundsRef, rawX, rawY])

  return (
    <>
      {stickers.map((s, i) => (
        <Item key={s.label} s={s} i={i} mx={mx} my={my} boundsRef={boundsRef} />
      ))}
    </>
  )
}
