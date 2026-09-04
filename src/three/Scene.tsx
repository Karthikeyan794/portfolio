import { Sparkles } from '@react-three/drei'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import AICore from './AICore'
import CameraRig from './CameraRig'
import Desk from './Desk'
import Room from './Room'
import WallFrames from './WallFrames'
import type { PanelId, ViewId } from './views'

type Props = {
  view: ViewId
  entered: boolean
  quality: 'high' | 'low'
  onSelect: (id: PanelId) => void
}

export default function Scene({ view, entered, quality, onSelect }: Props) {
  return (
    <>
      <color attach="background" args={['#04070f']} />
      <fog attach="fog" args={['#04070f', 9, 20]} />

      <ambientLight intensity={0.28} color="#8bb8ff" />
      <hemisphereLight args={['#1e3a5f', '#03050a', 0.4]} />
      <pointLight position={[0, 2.9, -1.2]} intensity={12} distance={8} color="#bfe3ff" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[0, 2.9, 1.2]} intensity={6} distance={8} color="#bfe3ff" />

      <Room />
      <Desk onSelect={onSelect} />
      <WallFrames onSelect={onSelect} />
      <AICore onSelect={onSelect} />

      {/* dust in the air */}
      <Sparkles count={90} scale={[7, 3, 7]} position={[0, 1.6, 0]} size={1.1} speed={0.2} opacity={0.35} color="#7dd3fc" />

      <CameraRig view={view} animate={entered} />

      {quality === 'high' && (
        <EffectComposer>
          <Bloom mipmapBlur luminanceThreshold={1} intensity={0.85} />
          <Vignette offset={0.3} darkness={0.7} />
        </EffectComposer>
      )}
    </>
  )
}
