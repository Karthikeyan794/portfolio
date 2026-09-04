import { Grid } from '@react-three/drei'
import { Strip } from './primitives'

const WALL = '#0b1220'

/** Walls, floor grid and the light strips that make the room read as a lab. */
export default function Room() {
  return (
    <group>
      {/* floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#070b14" roughness={0.8} metalness={0.35} />
      </mesh>
      <Grid
        position={[0, 0.003, 0]}
        args={[8, 8]}
        cellSize={0.5}
        cellThickness={0.6}
        cellColor="#10305a"
        sectionSize={2}
        sectionThickness={1.1}
        sectionColor="#1c8aa8"
        fadeDistance={16}
        fadeStrength={1}
      />

      {/* walls + ceiling */}
      <mesh position={[0, 1.6, -4]}>
        <planeGeometry args={[8, 3.2]} />
        <meshStandardMaterial color={WALL} roughness={0.9} />
      </mesh>
      <mesh position={[-4, 1.6, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[8, 3.2]} />
        <meshStandardMaterial color={WALL} roughness={0.9} />
      </mesh>
      <mesh position={[4, 1.6, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[8, 3.2]} />
        <meshStandardMaterial color={WALL} roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#080d18" roughness={1} />
      </mesh>

      {/* wall panel seams */}
      {[-2.7, -1.35, 0, 1.35, 2.7].map((x) => (
        <mesh key={x} position={[x, 1.6, -3.995]}>
          <planeGeometry args={[0.012, 3.2]} />
          <meshStandardMaterial color="#132038" />
        </mesh>
      ))}

      {/* floor edge strips */}
      <Strip position={[0, 0.02, -3.97]} size={[7.9, 0.02, 0.04]} intensity={1.6} />
      <Strip position={[-3.97, 0.02, 0]} size={[0.04, 0.02, 7.9]} intensity={1.6} />
      <Strip position={[3.97, 0.02, 0]} size={[0.04, 0.02, 7.9]} intensity={1.6} />

      {/* ceiling strips */}
      <Strip position={[0, 3.18, -1.4]} size={[3.2, 0.02, 0.08]} intensity={1.4} color="#9fdcff" />
      <Strip position={[0, 3.18, 1.0]} size={[3.2, 0.02, 0.08]} intensity={1.4} color="#9fdcff" />

      {/* back-wall accent line */}
      <Strip position={[0, 2.85, -3.99]} size={[7.6, 0.015, 0.01]} intensity={1.2} />

      {/* left-wall shelf with a few boxes */}
      <group position={[-3.9, 0, 1.6]}>
        <mesh position={[0.25, 1.5, 0]}>
          <boxGeometry args={[0.5, 0.04, 1.6]} />
          <meshStandardMaterial color="#141c2c" metalness={0.6} roughness={0.4} />
        </mesh>
        {[-0.55, -0.2, 0.15, 0.5].map((z, i) => (
          <mesh key={z} position={[0.25, 1.52 + 0.09 + i * 0.02, z]}>
            <boxGeometry args={[0.3, 0.18 + i * 0.04, 0.22]} />
            <meshStandardMaterial color={['#0e2a3a', '#0a1f30', '#12314a', '#0b2236'][i]} roughness={0.7} />
          </mesh>
        ))}
        <Strip position={[0.25, 1.47, 0]} size={[0.5, 0.01, 1.6]} intensity={0.9} />
      </group>
    </group>
  )
}
