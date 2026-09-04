import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from 'motion/react'
import { useEffect, type RefObject } from 'react'
import { floaters, type Floater } from '../data'

type Props = { boundsRef: RefObject<HTMLDivElement | null> }

function Item({ f, i, mx, my }: { f: Floater; i: number; mx: MotionValue<number>; my: MotionValue<number> }) {
  // parallax: deeper items move more with the mouse
  const px = useTransform(mx, (v) => v * 18 * f.depth)
  const py = useTransform(my, (v) => v * 14 * f.depth)
  return (
    <motion.div style={{ position: 'absolute', left: `${f.x}%`, top: `${f.y}%`, x: px, y: py, zIndex: 1 }}>
      <motion.div
        drag
        dragMomentum={false}
        dragElastic={0.15}
        whileHover={{ scale: 1.06 }}
        whileDrag={{ scale: 1.12, zIndex: 10 }}
        style={{ rotate: f.rotate, cursor: 'grab' }}
      >
        {/* inner element drifts up and down forever; outer handles drag so they don't fight */}
        <motion.div
          className={`floater${f.big ? ' floater--big' : ''}${f.hideOnMobile ? ' floater--hide-sm' : ''}`}
          animate={{ y: [0, -10 - (i % 3) * 3, 0], rotate: [0, i % 2 ? 2.5 : -2.5, 0] }}
          transition={{ duration: 5.5 + i * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}
          aria-label={f.label ? `${f.label} — drag me` : 'decorative, drag me'}
        >
          <span className="floater__emoji" aria-hidden="true">{f.emoji}</span>
          {f.label}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

/** Floating "objects" around the hero: drift, react to the mouse, and can be dragged. */
export default function Floaters({ boundsRef }: Props) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const mx = useSpring(rawX, { stiffness: 50, damping: 18 })
  const my = useSpring(rawY, { stiffness: 50, damping: 18 })

  useEffect(() => {
    const el = boundsRef.current
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
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [boundsRef, rawX, rawY])

  return (
    <>
      {floaters.map((f, i) => (
        <Item key={f.emoji + f.label} f={f} i={i} mx={mx} my={my} />
      ))}
    </>
  )
}
