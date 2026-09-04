import { useMemo } from 'react'
import { siClaude, siCursor, siFigma, siGithub, siReact, siTypescript } from 'simple-icons'

/**
 * CSS-3D Rubik's cube: the pieces fly in and combine, then the whole cube
 * tumbles while its three horizontal layers snap-twist 90° in turn (see
 * cube.css). Only outward faces get stickers — the tools I work with.
 */

/**
 * Each face of the cube is one tool — like each face of a real Rubik's cube
 * is one colour — so the twists mix the logos. base = sticker colour, fg = logo colour.
 */
const FACES = {
  front: { icon: siFigma, base: '#ffffff', fg: '#F24E1E' },
  right: { icon: siClaude, base: '#D97757', fg: '#ffffff' },
  back: { icon: siCursor, base: '#0b0b0b', fg: '#ffffff' }, // TODO: ChatGPT once its logo is approved for download
  left: { icon: siGithub, base: '#ffffff', fg: '#181717' },
  top: { icon: siReact, base: '#20232a', fg: '#61DAFB' },
  bottom: { icon: siTypescript, base: '#3178C6', fg: '#ffffff' },
} as const

type FaceName = keyof typeof FACES

const stickerCache = new Map<string, string>()

/** A tool logo as an SVG data URI (simple-icons paths are 24×24). */
function sticker(name: FaceName): string {
  const cached = stickerCache.get(name)
  if (cached) return cached
  const { icon, fg } = FACES[name]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="${icon.path}" fill="${fg}"/></svg>`
  const uri = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
  stickerCache.set(name, uri)
  return uri
}

/** Deterministic scatter offsets so the pieces fly in from the same places every time. */
function scatter(i: number) {
  const r = (k: number) => {
    const v = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453
    return v - Math.floor(v) - 0.5
  }
  return { dx: r(1) * 320, dy: r(2) * 260, dz: r(3) * 300, rx: r(4) * 540, ry: r(5) * 540 }
}

type Props = { size?: number }

export default function CubeLoader({ size = 34 }: Props) {
  const gap = Math.round(size * 0.09)
  const step = size + gap

  const cubelets = useMemo(() => {
    const out: { x: number; y: number; z: number }[] = []
    for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) for (let z = 0; z < 3; z++) out.push({ x, y, z })
    return out
  }, [])

  const faceStyle = (name: FaceName, outward: boolean) =>
    outward
      ? {
          backgroundColor: FACES[name].base,
          backgroundImage: sticker(name),
          backgroundSize: '58% 58%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }
      : { backgroundColor: '#0b1220' }

  return (
    <div
      className="rubik"
      style={{ '--s': `${size}px`, '--h': `${size / 2}px`, width: step * 3, height: step * 3 } as React.CSSProperties}
      role="img"
      aria-label="Loading"
    >
      <div className="rubik__body">
        {[0, 1, 2].map((layer) => (
          <div className={`rubik__layer rubik__layer--${layer}`} key={layer}>
            {cubelets
              .filter((c) => c.y === layer)
              .map((c) => {
                const seed = c.x * 9 + c.y * 3 + c.z + 1
                const sc = scatter(seed)
                return (
                  <div
                    className="cubelet"
                    key={`${c.x}${c.y}${c.z}`}
                    style={
                      {
                        '--tx': `${(c.x - 1) * step}px`,
                        '--ty': `${(c.y - 1) * step}px`,
                        '--tz': `${(c.z - 1) * step}px`,
                        '--dx': `${sc.dx.toFixed(0)}px`,
                        '--dy': `${sc.dy.toFixed(0)}px`,
                        '--dz': `${sc.dz.toFixed(0)}px`,
                        '--rx': `${sc.rx.toFixed(0)}deg`,
                        '--ry': `${sc.ry.toFixed(0)}deg`,
                        '--i': seed,
                      } as React.CSSProperties
                    }
                  >
                    <i className="face face--front" style={faceStyle('front', c.z === 2)} />
                    <i className="face face--back" style={faceStyle('back', c.z === 0)} />
                    <i className="face face--right" style={faceStyle('right', c.x === 2)} />
                    <i className="face face--left" style={faceStyle('left', c.x === 0)} />
                    <i className="face face--top" style={faceStyle('top', c.y === 0)} />
                    <i className="face face--bottom" style={faceStyle('bottom', c.y === 2)} />
                  </div>
                )
              })}
          </div>
        ))}
      </div>
    </div>
  )
}
