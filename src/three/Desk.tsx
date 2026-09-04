import { Float, Text } from '@react-three/drei'
import Hotspot from './Hotspot'
import { CYAN, HoloPanel, METAL, METAL_DARK, Strip } from './primitives'
import type { PanelId } from './views'

type Props = { onSelect: (id: PanelId) => void }

function Laptop() {
  return (
    <group rotation={[0, 0.22, 0]}>
      {/* base */}
      <mesh position={[0, 0.01, 0]} castShadow>
        <boxGeometry args={[0.52, 0.02, 0.36]} />
        <meshStandardMaterial color={METAL_DARK} metalness={0.7} roughness={0.3} />
      </mesh>
      {/* keyboard glow */}
      <mesh position={[0, 0.021, 0.03]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.42, 0.2]} />
        <meshStandardMaterial color="#0b1220" emissive={CYAN} emissiveIntensity={0.35} />
      </mesh>
      {/* screen, hinged at the back edge and tilted back */}
      <group position={[0, 0.02, -0.17]} rotation={[-0.32, 0, 0]}>
        <mesh position={[0, 0.17, 0]} castShadow>
          <boxGeometry args={[0.52, 0.34, 0.015]} />
          <meshStandardMaterial color={METAL_DARK} metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.17, 0.009]}>
          <planeGeometry args={[0.48, 0.3]} />
          <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.25} toneMapped={false} />
        </mesh>
        <Text position={[0, 0.19, 0.012]} fontSize={0.05} color="#04121a" anchorX="center" anchorY="middle" letterSpacing={0.2}>
          PROJECTS
        </Text>
        <Text position={[0, 0.12, 0.012]} fontSize={0.022} color="#0e3b46" anchorX="center" anchorY="middle" letterSpacing={0.1}>
          click to open
        </Text>
      </group>
    </group>
  )
}

/** Desk, chair and every clickable object on the desk. */
export default function Desk({ onSelect }: Props) {
  return (
    <group position={[0, 0, -1.6]}>
      {/* desk top + glowing front edge */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.06, 0.9]} />
        <meshStandardMaterial color={METAL} metalness={0.6} roughness={0.35} />
      </mesh>
      <Strip position={[0, 0.72, 0.451]} size={[2.4, 0.01, 0.01]} intensity={1.3} />

      {/* legs */}
      {(
        [
          [-1.1, 0.36, -0.36],
          [1.1, 0.36, -0.36],
          [-1.1, 0.36, 0.36],
          [1.1, 0.36, 0.36],
        ] as [number, number, number][]
      ).map((p) => (
        <mesh key={p.join()} position={p}>
          <boxGeometry args={[0.06, 0.72, 0.06]} />
          <meshStandardMaterial color={METAL_DARK} metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* chair */}
      <group position={[0, 0, 0.95]}>
        <mesh position={[0, 0.5, 0]} castShadow>
          <boxGeometry args={[0.55, 0.06, 0.55]} />
          <meshStandardMaterial color="#111827" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.85, 0.26]} castShadow>
          <boxGeometry args={[0.55, 0.7, 0.06]} />
          <meshStandardMaterial color="#111827" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.035, 0.035, 0.5, 12]} />
          <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.03, 24]} />
          <meshStandardMaterial color="#1f2937" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* laptop → Projects */}
      <Hotspot id="projects" label="Projects" position={[-0.38, 0.78, 0.05]} labelOffset={[0, 0.5, 0]} onSelect={onSelect}>
        <Laptop />
      </Hotspot>

      {/* tablet → Contact */}
      <Hotspot id="contact" label="Contact" position={[0.72, 0.785, 0.12]} labelOffset={[0, 0.3, 0]} onSelect={onSelect}>
        <mesh rotation={[-Math.PI / 2, 0, 0.3]}>
          <boxGeometry args={[0.28, 0.2, 0.012]} />
          <meshStandardMaterial color="#0b1220" metalness={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0.007, 0]} rotation={[-Math.PI / 2, 0, 0.3]}>
          <planeGeometry args={[0.25, 0.17]} />
          <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.1} toneMapped={false} />
        </mesh>
      </Hotspot>

      {/* paper → Résumé */}
      <Hotspot id="resume" label="Résumé" position={[0.3, 0.782, 0.28]} labelOffset={[0, 0.3, 0]} onSelect={onSelect}>
        <mesh rotation={[-Math.PI / 2, 0, -0.2]}>
          <planeGeometry args={[0.21, 0.297]} />
          <meshStandardMaterial color="#dbe7ff" roughness={0.9} />
        </mesh>
        {[0.09, 0.05, 0.01, -0.03].map((y, i) => (
          <mesh key={y} position={[-0.02 * i, 0.001, -y]} rotation={[-Math.PI / 2, 0, -0.2]}>
            <planeGeometry args={[0.14 - i * 0.02, 0.008]} />
            <meshBasicMaterial color="#7b8db0" />
          </mesh>
        ))}
      </Hotspot>

      {/* floating hologram above the desk → About */}
      <Hotspot id="about" label="About me" position={[0, 1.6, -0.3]} labelOffset={[0, 0.55, 0]} onSelect={onSelect}>
        <Float speed={1.6} rotationIntensity={0.06} floatIntensity={0.3} floatingRange={[-0.03, 0.03]}>
          <HoloPanel width={1.4} height={0.8} title="KARTHIKEYAN B" subtitle="FRONTEND ENGINEER" />
        </Float>
      </Hotspot>

      {/* desk lamp light */}
      <pointLight position={[0, 1.3, 0.2]} intensity={3} distance={3} color="#bfe3ff" />
    </group>
  )
}
