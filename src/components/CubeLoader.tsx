import { useMemo } from 'react'

/**
 * CSS-3D Rubik's cube: the whole cube tumbles while its three horizontal
 * layers snap-twist 90° in turn (see cube.css for the timing). 27 cubelets,
 * only outward faces get stickers; stickers carry a small pixel glyph.
 */

const FACE_COLORS = {
  front: ['#22d3ee', '#06202a'], // cyan
  back: ['#2b8cff', '#0a1d3f'], // blue
  right: ['#e6f0ff', '#1b2a45'], // white
  left: ['#f5b14a', '#3a2405'], // gold
  top: ['#0f1a30', '#22d3ee'], // navy with cyan pixels
  bottom: ['#a5f3fc', '#0b1220'],
} as const

type FaceName = keyof typeof FACE_COLORS

/** 5×5 pixel glyphs — half code, half design. */
const GLYPHS = [
  ['..#..', '.#...', '#....', '.#...', '..#..'], // <
  ['..#..', '...#.', '....#', '...#.', '..#..'], // >
  ['....#', '...#.', '..#..', '.#...', '#....'], // /
  ['.##..', '.#...', '##...', '.#...', '.##..'], // {
  ['#....', '##...', '###..', '####.', '#.#..'], // cursor
  ['....#', '...##', '..##.', '.##..', '#....'], // pen stroke
  ['.###.', '#...#', '#...#', '.###.', '..#..'], // colour swatch / pin
  ['#.#.#', '.....', '#.#.#', '.....', '#.#.#'], // dot grid
  ['.#.#.', '#####', '#####', '.###.', '..#..'], // heart
  ['#####', '#...#', '#.#.#', '#...#', '#####'], // frame
  ['..#..', '..#..', '#####', '..#..', '..#..'], // plus
  ['##...', '##...', '...##', '...##', '#####'], // layers
]

/** One glyph as an SVG data URI, picked deterministically. */
function glyph(seed: number, fg: string): string {
  const bitmap = GLYPHS[Math.abs(seed) % GLYPHS.length]
  let rects = ''
  bitmap.forEach((row, y) => {
    ;[...row].forEach((cell, x) => {
      if (cell === '#') rects += `<rect x="${x * 20}" y="${y * 20}" width="20" height="20" fill="${fg}"/>`
    })
  })
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" shape-rendering="crispEdges">${rects}</svg>`
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
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

  const faceStyle = (name: FaceName, outward: boolean, seed: number) => {
    const [bg, fg] = FACE_COLORS[name]
    return outward
      ? { backgroundColor: bg, backgroundImage: glyph(seed, fg), backgroundSize: '70% 70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }
      : { backgroundColor: '#0b1220' }
  }

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
              .map((c, i) => {
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
                    <i className="face face--front" style={faceStyle('front', c.z === 2, seed + i)} />
                    <i className="face face--back" style={faceStyle('back', c.z === 0, seed + 7)} />
                    <i className="face face--right" style={faceStyle('right', c.x === 2, seed + 13)} />
                    <i className="face face--left" style={faceStyle('left', c.x === 0, seed + 19)} />
                    <i className="face face--top" style={faceStyle('top', c.y === 0, seed + 23)} />
                    <i className="face face--bottom" style={faceStyle('bottom', c.y === 2, seed + 29)} />
                  </div>
                )
              })}
          </div>
        ))}
      </div>
    </div>
  )
}
