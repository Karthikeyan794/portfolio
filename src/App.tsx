import { MotionConfig } from 'motion/react'
import { lazy, Suspense, useEffect, useState } from 'react'
import { ambience } from './audio/ambience'
import AskMe from './components/AskMe'
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

// the parked 3D lab (three.js and its helpers, most of the code by weight) is
// its own file, fetched only if the lab is ever switched on — not by every visitor
const Lab = lazy(() => import('./components/Lab'))

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
        // keyed, so moving from one case study to the next from its footer
        // builds a fresh page: no answer, zoom or scrub state carries across
        <ProjectPage key={projectSlug} slug={projectSlug} />
      ) : mode === '3d' ? (
        <Suspense fallback={null}>
          <Lab onSwitch2D={() => setMode('2d')} />
        </Suspense>
      ) : (
        <Site2D onEnterLab={canLab ? () => setMode('3d') : undefined} />
      )}
      {/* outside the pages, so a conversation carries on from one to the next */}
      <AskMe />
    </MotionConfig>
  )
}
