import { Edges, Text } from '@react-three/drei'
import * as THREE from 'three'

export const CYAN = '#22d3ee'
export const METAL_DARK = '#0f1522'
export const METAL = '#141c2c'

type Vec3 = [number, number, number]

/** Thin emissive bar — reads as a light strip and blooms. */
export function Strip({
  position,
  size,
  intensity = 2,
  color = CYAN,
}: {
  position: Vec3
  size: Vec3
  intensity?: number
  color?: string
}) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} toneMapped={false} />
    </mesh>
  )
}

/** Translucent hologram panel with glowing edges, a title and a subtitle. */
export function HoloPanel({
  width,
  height,
  title,
  subtitle,
}: {
  width: number
  height: number
  title: string
  subtitle?: string
}) {
  return (
    <group>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshPhysicalMaterial
          color={CYAN}
          transparent
          opacity={0.12}
          roughness={0.2}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
        <Edges>
          <lineBasicMaterial color={[0.3, 2.4, 2.8]} toneMapped={false} />
        </Edges>
      </mesh>
      {/* scanlines */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[0, -height / 2 + 0.1 + i * 0.075, 0.004]}>
          <planeGeometry args={[width * 0.72, 0.006]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.28 - i * 0.045} />
        </mesh>
      ))}
      <Text
        position={[0, height * 0.16, 0.01]}
        fontSize={height * 0.15}
        color="#e0fbff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
      >
        {title}
      </Text>
      {subtitle && (
        <Text
          position={[0, -height * 0.05, 0.01]}
          fontSize={height * 0.075}
          color="#67e8f9"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.25}
        >
          {subtitle}
        </Text>
      )}
    </group>
  )
}
