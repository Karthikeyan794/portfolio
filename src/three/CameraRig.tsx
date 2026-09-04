import { CameraControls, type CameraControlsImpl } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { VIEWS, type ViewId } from './views'

type Props = { view: ViewId; animate: boolean }

/** Moves the camera between presets; the user can still look around within limits. */
export default function CameraRig({ view, animate }: Props) {
  const ref = useRef<CameraControlsImpl>(null)

  useEffect(() => {
    const c = ref.current
    if (!c) return
    const v = VIEWS[view]
    void c.setLookAt(...v.position, ...v.target, animate)
  }, [view, animate])

  return (
    <CameraControls
      ref={ref}
      makeDefault
      smoothTime={0.75}
      minDistance={0.8}
      maxDistance={10}
      minPolarAngle={0.55}
      maxPolarAngle={1.62}
      dollySpeed={0.5}
      truckSpeed={0}
    />
  )
}
