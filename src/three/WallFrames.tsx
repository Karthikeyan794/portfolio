import { Edges, Text } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'
import Hotspot from './Hotspot'
import type { PanelId } from './views'

type Props = { onSelect: (id: PanelId) => void }

type FrameSpec = { x: number; y: number; w: number; h: number; label: string; hue: number }

const FRAMES: FrameSpec[] = [
  { x: -3.25, y: 2.0, w: 0.9, h: 0.62, label: 'AWARD', hue: 195 },
  { x: -2.20, y: 2.05, w: 0.66, h: 0.86, label: 'PHOTO', hue: 215 },
  { x: -1.35, y: 1.95, w: 0.7, h: 0.52, label: 'AWARD', hue: 185 },
  { x: -2.80, y: 1.22, w: 0.8, h: 0.5, label: 'PHOTO', hue: 230 },
  { x: -1.70, y: 1.22, w: 0.8, h: 0.5, label: 'CERTIFICATE', hue: 200 },
]

/** Placeholder "photo": a soft gradient with a faint grid, drawn on a canvas. */
function usePlaceholderTexture(hue: number, label: string) {
  return useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512
    c.height = 384
    const ctx = c.getContext('2d')!
    const g = ctx.createLinearGradient(0, 0, 512, 384)
    g.addColorStop(0, `hsl(${hue} 60% 22%)`)
    g.addColorStop(1, `hsl(${hue + 30} 70% 10%)`)
    ctx.fillStyle = g
    ctx.fillRect(0, 0, 512, 384)
    ctx.strokeStyle = 'rgba(120,200,255,0.12)'
    ctx.lineWidth = 1
    for (let i = 0; i <= 512; i += 32) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 384); ctx.stroke()
    }
    for (let j = 0; j <= 384; j += 32) {
      ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(512, j); ctx.stroke()
    }
    const glow = ctx.createRadialGradient(256, 170, 10, 256, 170, 220)
    glow.addColorStop(0, 'rgba(34,211,238,0.35)')
    glow.addColorStop(1, 'rgba(34,211,238,0)')
    ctx.fillStyle = glow
    ctx.fillRect(0, 0, 512, 384)
    ctx.fillStyle = 'rgba(224,251,255,0.9)'
    ctx.font = '600 44px Rajdhani, Inter, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(label, 256, 192)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [hue, label])
}

function Frame({ x, y, w, h, label, hue }: FrameSpec) {
  const tex = usePlaceholderTexture(hue, label)
  return (
    <group position={[x, y, 0]}>
      <mesh position={[0, 0, 0.02]} castShadow>
        <boxGeometry args={[w + 0.08, h + 0.08, 0.04]} />
        <meshStandardMaterial color="#111a2b" metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial map={tex} roughness={0.6} emissive="#0e7490" emissiveIntensity={0.12} />
        <Edges>
          <lineBasicMaterial color={[0.3, 2.4, 2.8]} toneMapped={false} />
        </Edges>
      </mesh>
    </group>
  )
}

/** Award and photo frames on the back wall — one hotspot for the whole gallery. */
export default function WallFrames({ onSelect }: Props) {
  return (
    <Hotspot id="awards" label="Awards & photos" position={[0, 0, -3.96]} labelOffset={[-2.25, 2.7, 0.3]} onSelect={onSelect}>
      {FRAMES.map((f) => (
        <Frame key={`${f.x}-${f.y}`} {...f} />
      ))}
      <Text position={[-2.3, 2.62, 0.05]} fontSize={0.09} color="#67e8f9" anchorX="center" anchorY="middle" letterSpacing={0.35}>
        RECOGNITION
      </Text>
      <pointLight position={[-2.2, 2.7, 0.8]} intensity={5} distance={4.5} color="#67e8f9" />
    </Hotspot>
  )
}
