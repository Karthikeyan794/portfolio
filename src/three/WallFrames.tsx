import { Edges, Text } from '@react-three/drei'
import Hotspot from './Hotspot'
import type { PanelId } from './views'

type Props = { onSelect: (id: PanelId) => void }

type FrameSpec = { x: number; y: number; w: number; h: number; label: string }

const FRAMES: FrameSpec[] = [
  { x: -2.7, y: 1.95, w: 0.9, h: 0.62, label: 'AWARD' },
  { x: -1.65, y: 2.0, w: 0.66, h: 0.86, label: 'PHOTO' },
  { x: -0.8, y: 1.9, w: 0.7, h: 0.52, label: 'AWARD' },
  { x: -2.25, y: 1.2, w: 0.8, h: 0.5, label: 'PHOTO' },
  { x: -1.2, y: 1.2, w: 0.8, h: 0.5, label: 'CERTIFICATE' },
]

function Frame({ x, y, w, h, label }: FrameSpec) {
  return (
    <group position={[x, y, 0]}>
      <mesh position={[0, 0, 0.02]} castShadow>
        <boxGeometry args={[w + 0.06, h + 0.06, 0.04]} />
        <meshStandardMaterial color="#111a2b" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color="#0c2233" emissive="#0ea5c9" emissiveIntensity={0.3} />
        <Edges>
          <lineBasicMaterial color={[0.3, 2.4, 2.8]} toneMapped={false} />
        </Edges>
      </mesh>
      <Text position={[0, 0, 0.05]} fontSize={Math.min(0.07, w * 0.09)} color="#a5f3fc" anchorX="center" anchorY="middle" letterSpacing={0.25}>
        {label}
      </Text>
    </group>
  )
}

/** Award and photo frames on the back wall — one hotspot for the whole gallery. */
export default function WallFrames({ onSelect }: Props) {
  return (
    <Hotspot id="awards" label="Awards & photos" position={[0, 0, -3.96]} labelOffset={[-1.7, 2.65, 0.3]} onSelect={onSelect}>
      {FRAMES.map((f) => (
        <Frame key={`${f.x}-${f.y}`} {...f} />
      ))}
      <pointLight position={[-1.7, 2.7, 0.7]} intensity={4} distance={4} color="#67e8f9" />
    </Hotspot>
  )
}
