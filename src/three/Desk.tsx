import { Float, Text } from '@react-three/drei'
import Hotspot from './Hotspot'
import { Model } from './Model'
import * as THREE from 'three'
import { CYAN, HoloPanel } from './primitives'
import type { PanelId } from './views'

type Props = { onSelect: (id: PanelId) => void }

const TOP = 0.76 // desk height (model 0.38 × scale 2)

// the laptop's "metal" material is its screen — make it glow
const LAPTOP_SCREEN = {
  metal: new THREE.MeshStandardMaterial({ color: '#0b3a46', emissive: CYAN, emissiveIntensity: 1.1, toneMapped: false }),
}

/** Glowing screen overlay for a monitor: sits just in front of the panel. */
function Screen({ w, h, label, sub }: { w: number; h: number; label: string; sub?: string }) {
  return (
    <group>
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial color="#061a24" emissive={CYAN} emissiveIntensity={0.55} toneMapped={false} />
      </mesh>
      <Text position={[0, h * 0.12, 0.002]} fontSize={h * 0.2} color="#e0fbff" anchorX="center" anchorY="middle" letterSpacing={0.18}>
        {label}
      </Text>
      {sub && (
        <Text position={[0, -h * 0.18, 0.002]} fontSize={h * 0.09} color="#67e8f9" anchorX="center" anchorY="middle" letterSpacing={0.12}>
          {sub}
        </Text>
      )}
      {/* scanlines */}
      {[0.3, 0.36, 0.42].map((f) => (
        <mesh key={f} position={[0, -h * f, 0.001]}>
          <planeGeometry args={[w * 0.8, 0.004]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.35} />
        </mesh>
      ))}
    </group>
  )
}

/** The workstation: two desks, monitors, laptop, chair, speakers and the hotspots on them. */
export default function Desk({ onSelect }: Props) {
  return (
    <group position={[0, 0, -1.6]}>
      <Model name="rugRectangle" position={[0, 0.004, 0.35]} scale={2.2} />

      {/* two desks side by side = one long bench */}
      <Model name="desk" position={[-0.73, 0, 0]} />
      <Model name="desk" position={[0.73, 0, 0]} />

      {/* chair facing the desk */}
      <Model name="chairDesk" position={[0.1, 0, 0.75]} rotation={[0, Math.PI, 0]} />

      {/* dual monitors with glowing screens */}
      <group position={[-0.32, TOP, -0.3]} rotation={[0, 0.18, 0]}>
        <Model name="computerScreen" scale={1.5} />
        <group position={[0, 0.255, 0.078]}>
          <Screen w={0.5} h={0.3} label="SYSTEM" sub="ONLINE" />
        </group>
      </group>
      <group position={[0.32, TOP, -0.3]} rotation={[0, -0.18, 0]}>
        <Model name="computerScreen" scale={1.5} />
        <group position={[0, 0.255, 0.078]}>
          <Screen w={0.5} h={0.3} label="LAB v1.0" sub="KARTHIKEYAN B" />
        </group>
      </group>
      <Model name="computerKeyboard" position={[0, TOP, 0.12]} scale={1.5} />
      <Model name="computerMouse" position={[0.36, TOP, 0.12]} scale={1.5} />

      {/* laptop → Projects */}
      <Hotspot id="projects" label="Projects" position={[-1.1, TOP, 0.05]} labelOffset={[0, 0.5, 0]} onSelect={onSelect}>
        <group rotation={[0, 0.42, 0]}>
          <Model name="laptop" scale={0.7} overrides={LAPTOP_SCREEN} />
        </group>
      </Hotspot>

      {/* tablet → Contact */}
      <Hotspot id="contact" label="Contact" position={[1.0, TOP + 0.005, 0.15]} labelOffset={[0, 0.3, 0]} onSelect={onSelect}>
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
      <Hotspot id="resume" label="Résumé" position={[0.72, TOP + 0.002, 0.3]} labelOffset={[0, 0.3, 0]} onSelect={onSelect}>
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

      {/* small plant + table lamp on the right desk */}
      <Model name="plantSmall1" position={[1.3, TOP, -0.25]} scale={1.4} />
      <Model name="lampSquareTable" position={[-1.35, TOP, -0.3]} scale={1.6} />

      {/* floating hologram → About */}
      <Hotspot id="about" label="About me" position={[0, 1.75, -0.45]} labelOffset={[0, 0.55, 0]} onSelect={onSelect}>
        <Float speed={1.6} rotationIntensity={0.06} floatIntensity={0.3} floatingRange={[-0.03, 0.03]}>
          <HoloPanel width={1.5} height={0.8} title="KARTHIKEYAN B" subtitle="FRONTEND ENGINEER" />
        </Float>
      </Hotspot>

      {/* floor speakers flanking the bench */}
      <Model name="speaker" position={[-1.85, 0, -0.1]} />
      <Model name="speaker" position={[1.85, 0, -0.1]} />

      <pointLight position={[0, 1.4, 0.3]} intensity={3} distance={3.5} color="#bfe3ff" />
    </group>
  )
}
