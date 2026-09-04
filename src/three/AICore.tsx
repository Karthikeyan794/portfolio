import { Float, Sparkles } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import Hotspot from './Hotspot'
import { CYAN, METAL_DARK } from './primitives'
import type { PanelId } from './views'

type Props = { onSelect: (id: PanelId) => void }

/** The glowing AI core in the corner — home of the lab assistant. */
export default function AICore({ onSelect }: Props) {
  const ring1 = useRef<THREE.Mesh>(null)
  const ring2 = useRef<THREE.Mesh>(null)

  useFrame((_, dt) => {
    if (ring1.current) {
      ring1.current.rotation.x += dt * 0.6
      ring1.current.rotation.y += dt * 0.35
    }
    if (ring2.current) {
      ring2.current.rotation.z -= dt * 0.5
      ring2.current.rotation.x += dt * 0.2
    }
  })

  return (
    <Hotspot id="bot" label="Ask the AI" position={[2.9, 0, -2.9]} labelOffset={[0, 2.25, 0]} onSelect={onSelect}>
      {/* pedestal */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.45, 0.6, 32]} />
        <meshStandardMaterial color={METAL_DARK} metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.605, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.28, 0.35, 48]} />
        <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={2} toneMapped={false} side={THREE.DoubleSide} />
      </mesh>

      {/* core + rings */}
      <Float speed={2} floatIntensity={0.4} rotationIntensity={0}>
        <group position={[0, 1.35, 0]}>
          <mesh>
            <sphereGeometry args={[0.17, 32, 32]} />
            <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={2.6} toneMapped={false} />
          </mesh>
          <mesh ref={ring1}>
            <torusGeometry args={[0.36, 0.012, 12, 80]} />
            <meshStandardMaterial color="#67e8f9" emissive="#67e8f9" emissiveIntensity={1.6} toneMapped={false} />
          </mesh>
          <mesh ref={ring2} rotation={[Math.PI / 3, 0, 0]}>
            <torusGeometry args={[0.5, 0.008, 12, 80]} />
            <meshStandardMaterial color="#67e8f9" emissive="#67e8f9" emissiveIntensity={1.3} toneMapped={false} />
          </mesh>
        </group>
      </Float>

      <pointLight position={[0, 1.4, 0]} intensity={9} distance={5.5} color={CYAN} />
      <Sparkles count={40} scale={[1.3, 2.2, 1.3]} position={[0, 1.3, 0]} size={2} speed={0.4} color="#a5f3fc" />
    </Hotspot>
  )
}
