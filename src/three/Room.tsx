import { Grid, MeshReflectorMaterial } from '@react-three/drei'
import { Model } from './Model'
import { Strip } from './primitives'

const WALL = '#0b1220'

type Props = { quality: 'high' | 'low' }

/** Walls, reflective floor, light strips and the furniture that fills the room. */
export default function Room({ quality }: Props) {
  return (
    <group>
      {/* floor — glossy in high quality */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        {quality === 'high' ? (
          <MeshReflectorMaterial
            blur={[400, 120]}
            resolution={1024}
            mixBlur={1}
            mixStrength={30}
            roughness={0.9}
            depthScale={1.1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.3}
            color="#060a14"
            metalness={0.55}
            mirror={0}
          />
        ) : (
          <meshStandardMaterial color="#070b14" roughness={0.8} metalness={0.35} />
        )}
      </mesh>
      <Grid
        position={[0, 0.004, 0]}
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
      <mesh position={[0, 1.6, -4]} receiveShadow>
        <planeGeometry args={[8, 3.2]} />
        <meshStandardMaterial color={WALL} roughness={0.9} />
      </mesh>
      <mesh position={[-4, 1.6, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 3.2]} />
        <meshStandardMaterial color={WALL} roughness={0.9} />
      </mesh>
      <mesh position={[4, 1.6, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
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

      {/* left wall: bookcases with a strip light on top */}
      <Model name="bookcaseOpen" position={[-3.72, 0, 1.0]} rotation={[0, Math.PI / 2, 0]} />
      <Model name="bookcaseOpen" position={[-3.72, 0, 1.85]} rotation={[0, Math.PI / 2, 0]} />
      <Model name="books" position={[-3.72, 1.77, 1.0]} rotation={[0, Math.PI / 2, 0]} />
      <Strip position={[-3.72, 1.8, 1.42]} size={[0.5, 0.01, 1.7]} intensity={0.8} />

      {/* right wall: console + wall TV */}
      <Model name="cabinetTelevision" position={[3.7, 0, 0.2]} rotation={[0, -Math.PI / 2, 0]} />
      <group position={[3.93, 1.65, 0.2]} rotation={[0, -Math.PI / 2, 0]}>
        <Model name="televisionModern" scale={1.6} />
        <mesh position={[0, 0.36, 0.11]}>
          <planeGeometry args={[0.98, 0.56]} />
          <meshStandardMaterial color="#061a24" emissive="#22d3ee" emissiveIntensity={0.45} toneMapped={false} />
        </mesh>
      </group>

      {/* plants, lamp, crates */}
      <Model name="pottedPlant" position={[-3.5, 0, -3.5]} />
      <Model name="pottedPlant" position={[3.5, 0, 2.4]} />
      <Model name="lampRoundFloor" position={[-3.35, 0, -3.3]} />
      <Model name="cardboardBoxClosed" position={[-3.4, 0, 3.1]} />
      <Model name="cardboardBoxClosed" position={[-3.4, 0.56, 3.1]} rotation={[0, 0.4, 0]} />
      <Model name="cardboardBoxOpen" position={[-2.9, 0, 3.4]} rotation={[0, -0.3, 0]} />
      <Model name="trashcan" position={[1.9, 0, -2.9]} scale={0.7} />
      <Model name="sideTable" position={[-3.65, 0, -1.6]} rotation={[0, Math.PI / 2, 0]} />
    </group>
  )
}
