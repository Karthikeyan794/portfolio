import { ContactShadows, Environment, Lightformer, Sparkles } from '@react-three/drei'
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

      <ambientLight intensity={0.42} color="#8bb8ff" />
      <hemisphereLight args={['#1e3a5f', '#03050a', 0.4]} />
      <pointLight position={[0, 2.9, -1.2]} intensity={14} distance={8} color="#bfe3ff" castShadow shadow-mapSize={[1024, 1024]} shadow-bias={-0.0005} />
      <pointLight position={[0, 2.9, 1.2]} intensity={7} distance={8} color="#bfe3ff" />
      {/* warm accent from the right — a little Iron Man gold against all the cyan */}
      <pointLight position={[3.2, 1.2, 1.5]} intensity={3} distance={5} color="#f5b14a" />

      {/* soft studio reflections without loading an HDR file */}
      <Environment resolution={128} frames={1}>
        <Lightformer intensity={1.5} color="#7dd3fc" position={[0, 4, -6]} scale={[8, 1.5, 1]} />
        <Lightformer intensity={0.8} color="#22d3ee" position={[-6, 2, 0]} rotation-y={Math.PI / 2} scale={[6, 1, 1]} />
        <Lightformer intensity={0.6} color="#f5b14a" position={[6, 1, 2]} rotation-y={-Math.PI / 2} scale={[4, 1, 1]} />
        <Lightformer intensity={1} color="#dbeafe" position={[0, 6, 0]} rotation-x={Math.PI / 2} scale={[3, 3, 1]} />
      </Environment>

      <Room quality={quality} />
      <Desk onSelect={onSelect} />
      <WallFrames onSelect={onSelect} />
      <AICore onSelect={onSelect} />

      <ContactShadows position={[0, 0.005, -0.8]} scale={9} blur={2.2} far={2} opacity={0.6} resolution={512} frames={1} color="#000814" />

      {/* dust in the air */}
      <Sparkles count={90} scale={[7, 3, 7]} position={[0, 1.6, 0]} size={1.1} speed={0.2} opacity={0.35} color="#7dd3fc" />

      <CameraRig view={view} animate={entered} />

      {quality === 'high' && (
        <EffectComposer>
          <Bloom mipmapBlur luminanceThreshold={1} intensity={0.8} />
          <Vignette offset={0.3} darkness={0.65} />
        </EffectComposer>
      )}
    </>
  )
}
