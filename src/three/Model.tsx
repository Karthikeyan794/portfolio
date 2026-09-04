import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'
import { CYAN } from './primitives'

/**
 * Kenney Furniture Kit models (CC0). Each has a few flat, named materials —
 * we swap them for the lab palette so everything reads as one set.
 */
export type ModelName =
  | 'desk' | 'chairDesk' | 'laptop' | 'computerScreen' | 'computerKeyboard' | 'computerMouse'
  | 'bookcaseOpen' | 'books' | 'lampRoundFloor' | 'lampSquareTable' | 'plantSmall1' | 'pottedPlant'
  | 'speaker' | 'cardboardBoxClosed' | 'cardboardBoxOpen' | 'sideTable' | 'trashcan' | 'rugRectangle'
  | 'cabinetTelevision' | 'televisionModern'

/** Bounding-box centre (x, z) in model units, so we can position models by their middle. */
const CENTER: Record<ModelName, [number, number]> = {
  desk: [0.355, -0.1],
  chairDesk: [0.07, -0.06],
  laptop: [0.3, -0.275],
  computerScreen: [0.195, -0.05],
  computerKeyboard: [0.14, -0.06],
  computerMouse: [0, -0.045],
  bookcaseOpen: [0.2, -0.125],
  books: [0.075, -0.045],
  lampRoundFloor: [0.06, -0.06],
  lampSquareTable: [0.06, -0.06],
  plantSmall1: [0, 0],
  pottedPlant: [0.085, -0.095],
  speaker: [0.075, -0.075],
  cardboardBoxClosed: [0.105, -0.105],
  cardboardBoxOpen: [0.105, -0.105],
  sideTable: [0.255, -0.1],
  trashcan: [-0.01, 0],
  rugRectangle: [0.785, -0.46],
  cabinetTelevision: [0.4, -0.125],
  televisionModern: [0, 0],
}

const materialCache = new Map<string, THREE.Material>()

function themed(name: string): THREE.Material {
  const cached = materialCache.get(name)
  if (cached) return cached
  let m: THREE.Material
  switch (name) {
    case 'wood':
      m = new THREE.MeshStandardMaterial({ color: '#141c2c', metalness: 0.55, roughness: 0.4 })
      break
    case 'metal':
      m = new THREE.MeshStandardMaterial({ color: '#9fb3c8', metalness: 0.9, roughness: 0.25 })
      break
    case 'metalDark':
      m = new THREE.MeshStandardMaterial({ color: '#0b1220', metalness: 0.7, roughness: 0.35 })
      break
    case 'metalMedium':
      m = new THREE.MeshStandardMaterial({ color: '#1c2638', metalness: 0.7, roughness: 0.4 })
      break
    case 'carpet':
      m = new THREE.MeshStandardMaterial({ color: '#0f1a2e', roughness: 0.9 })
      break
    case 'lamp':
      m = new THREE.MeshStandardMaterial({ color: CYAN, emissive: CYAN, emissiveIntensity: 1.6, toneMapped: false })
      break
    case 'plant':
      m = new THREE.MeshStandardMaterial({ color: '#14b8a6', roughness: 0.8 })
      break
    default:
      m = new THREE.MeshStandardMaterial({ color: '#1c2638', metalness: 0.6, roughness: 0.45 })
  }
  materialCache.set(name, m)
  return m
}

type Props = {
  name: ModelName
  position?: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  /** Replace specific named materials for this instance (e.g. a glowing screen). */
  overrides?: Record<string, THREE.Material>
  /** Debug: colour each material differently to see which part is which. */
  debug?: boolean
}

export function Model({ name, position, rotation, scale = 2, overrides, debug = false }: Props) {
  const { scene } = useGLTF(`/models/${name}.glb`)

  const object = useMemo(() => {
    const clone = scene.clone(true)
    const debugColors = ['#ff3b3b', '#3bff5c', '#3b7bff', '#ffd23b', '#ff3bd6']
    const seen: string[] = []
    clone.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        o.castShadow = true
        o.receiveShadow = true
        const mats = Array.isArray(o.material) ? o.material : [o.material]
        const next = mats.map((mat) => {
          const n = (mat as THREE.Material).name
          if (debug) {
            if (!seen.includes(n)) seen.push(n)
            return new THREE.MeshBasicMaterial({ color: debugColors[seen.indexOf(n) % debugColors.length] })
          }
          return overrides?.[n] ?? themed(n)
        })
        o.material = Array.isArray(o.material) ? next : next[0]
      }
    })
    return clone
  }, [scene, debug, overrides])

  const [cx, cz] = CENTER[name]

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={object} position={[-cx, 0, -cz]} />
    </group>
  )
}

export function preloadModels(names: ModelName[]) {
  names.forEach((n) => useGLTF.preload(`/models/${n}.glb`))
}
