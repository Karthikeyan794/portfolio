import { useEffect, useRef } from 'react'

/** Graph-paper canvas whose lines brighten in a soft circle around the pointer. */
export default function GridBg() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    let raf = 0
    let x = -999
    let y = -999
    const onMove = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        el.style.setProperty('--mx', `${x}px`)
        el.style.setProperty('--my', `${y}px`)
      })
    }
    const onLeave = () => {
      el.style.setProperty('--mx', '-999px')
      el.style.setProperty('--my', '-999px')
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <div className="gridbg" ref={ref} aria-hidden="true" />
}
