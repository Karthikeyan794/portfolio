import { MotionConfig } from 'motion/react'
import { useState } from 'react'
import Lab from './components/Lab'
import Site2D from './components/Site2D'

function webglOk() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/** Phones and touch devices get the 2D page; everyone else starts in the 3D lab. */
function prefers2D() {
  return window.matchMedia('(max-width: 820px), (pointer: coarse)').matches || !webglOk()
}

export default function App() {
  const [mode, setMode] = useState<'3d' | '2d'>(() => (prefers2D() ? '2d' : '3d'))
  const canLab = webglOk()

  return (
    <MotionConfig reducedMotion="user">
      {mode === '3d' ? (
        <Lab onSwitch2D={() => setMode('2d')} />
      ) : (
        <Site2D onEnterLab={canLab ? () => setMode('3d') : undefined} />
      )}
    </MotionConfig>
  )
}
