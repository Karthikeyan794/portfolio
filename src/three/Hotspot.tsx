import { Html, useCursor } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef, useState, type ReactNode } from 'react'
import * as THREE from 'three'
import type { PanelId } from './views'

type Vec3 = [number, number, number]

type Props = {
  id: PanelId
  label: string
  position?: Vec3
  labelOffset?: Vec3
  onSelect: (id: PanelId) => void
  children: ReactNode
}

/** Clickable group: grows slightly on hover, shows a HUD tag, opens a panel on click. */
export default function Hotspot({ id, label, position, labelOffset = [0, 0.4, 0], onSelect, children }: Props) {
  const [hover, setHover] = useState(false)
  const inner = useRef<THREE.Group>(null)
  useCursor(hover)

  useFrame((_, dt) => {
    const g = inner.current
    if (!g) return
    const target = hover ? 1.04 : 1
    const s = THREE.MathUtils.damp(g.scale.x, target, 12, dt)
    g.scale.setScalar(s)
  })

  return (
    <group
      position={position}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHover(true)
      }}
      onPointerOut={() => setHover(false)}
      onClick={(e) => {
        e.stopPropagation()
        onSelect(id)
      }}
    >
      <group ref={inner}>{children}</group>
      {hover && (
        <Html position={labelOffset} center distanceFactor={5} style={{ pointerEvents: 'none' }}>
          <div className="hud-tag">{label}</div>
        </Html>
      )}
    </group>
  )
}
