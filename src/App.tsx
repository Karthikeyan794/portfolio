import { MotionConfig } from 'motion/react'
import { useEffect, useState } from 'react'
import { ambience } from './audio/ambience'
import Lab from './components/Lab'
import ProjectPage from './components/ProjectPage'
import Site2D from './components/Site2D'
import { useRoute } from './router'

function webglOk() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/** The 3D lab is parked for now — flip this to bring back the "Enter 3D lab" button and 3D-by-default on desktop. */
const LAB_ENABLED = false

/** Phones and touch devices get the 2D page; everyone else starts in the 3D lab (when enabled). */
function prefers2D() {
  return !LAB_ENABLED || window.matchMedia('(max-width: 820px), (pointer: coarse)').matches || !webglOk()
}

export default function App() {
  const [mode, setMode] = useState<'3d' | '2d'>(() => (prefers2D() ? '2d' : '3d'))
  const canLab = LAB_ENABLED && webglOk()

  // nature sound starts on the first tap anywhere — armed before the loader even finishes
  useEffect(() => ambience.armOnGesture(), [])

  const projectSlug = useRoute()

  return (
    <MotionConfig reducedMotion="user">
      {projectSlug ? (
        <ProjectPage slug={projectSlug} />
      ) : mode === '3d' ? (
        <Lab onSwitch2D={() => setMode('2d')} />
      ) : (
        <Site2D onEnterLab={canLab ? () => setMode('3d') : undefined} />
      )}
    </MotionConfig>
  )
}
