import { useMemo } from 'react'
import { siClaude, siCursor, siGithub, siReact, siTypescript } from 'simple-icons'

/**
 * CSS-3D Rubik's "picture cube": each face is ONE big die-cut logo sticker,
 * sliced across the 9 tiles like a photo cube, so the layer twists scramble
 * the logos and the tumble reveals them. Pieces fly in and combine first.
 */

/** Official Figma mark (38×57), five coloured shapes. */
const FIGMA = [
  { d: 'M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38C23.2533 38 19 33.7467 19 28.5Z', fill: '#1ABCFE' },
  { d: 'M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z', fill: '#0ACF83' },
  { d: 'M19 0V19H28.5C33.7467 19 38 14.7467 38 9.5C38 4.25329 33.7467 0 28.5 0H19Z', fill: '#FF7262' },
  { d: 'M0 9.5C0 14.7467 4.25329 19 9.5 19H19V0H9.5C4.25329 0 0 4.25329 0 9.5Z', fill: '#F24E1E' },
  { d: 'M0 28.5C0 33.7467 4.25329 38 9.5 38H19V19H9.5C4.25329 19 0 23.2533 0 28.5Z', fill: '#A259FF' },
]

type Shape = { d: string; fill: string }

/** Centre + scale a set of paths into the 100×100 sticker canvas with a white die-cut outline. */
function dieCut(paths: Shape[], vw: number, vh: number, size: number): string {
  const s = size / Math.max(vw, vh)
  const tx = (100 - vw * s) / 2
  const ty = (100 - vh * s) / 2
  const outline = paths
    .map((p) => `<path d="${p.d}" fill="#fff" stroke="#fff" stroke-width="${(7 / s).toFixed(2)}" stroke-linejoin="round"/>`)
    .join('')
  const color = paths.map((p) => `<path d="${p.d}" fill="${p.fill}"/>`).join('')
  return `<g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(4)})">${outline}${color}</g>`
}

/** Claude: a rounded white sticker with the starburst and wordmark, like the reference. */
function claudeSticker(): string {
  return (
    `<rect x="14" y="14" width="72" height="72" rx="16" fill="#fff"/>` +
    `<g transform="translate(35.5 21) scale(1.2)"><path d="${siClaude.path}" fill="#D97757"/></g>` +
    `<text x="50" y="77" text-anchor="middle" font-family="Inter, Helvetica, Arial, sans-serif" font-weight="700" font-size="15.5" fill="#1a1a1a">Claude</text>`
  )
}

/** Face → base colour (theme) + sticker artwork. */
const FACES = {
  front: { base: '#0b1220', art: dieCut(FIGMA, 38, 57, 64) },
  right: { base: '#f5b14a', art: claudeSticker() },
  back: { base: '#22d3ee', art: dieCut([{ d: siCursor.path, fill: '#0b0b0b' }], 24, 24, 58) }, // TODO: ChatGPT once its logo is approved
  left: { base: '#2b8cff', art: dieCut([{ d: siGithub.path, fill: '#181717' }], 24, 24, 60) },
  top: { base: '#0f1a30', art: dieCut([{ d: siReact.path, fill: '#61DAFB' }], 24, 24, 62) },
  bottom: { base: '#0f766e', art: dieCut([{ d: siTypescript.path, fill: '#3178C6' }], 24, 24, 60) },
} as const

type FaceName = keyof typeof FACES

const stickerCache = new Map<string, string>()

function sticker(name: FaceName): string {
  const cached = stickerCache.get(name)
  if (cached) return cached
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">${FACES[name].art}</svg>`
  const uri = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`
  stickerCache.set(name, uri)
  return uri
}

/**
 * Which 1/9 slice of the face picture a tile shows. Derived from how each
 * face is rotated in cube.css: local +x/+y of the face mapped to world axes.
 */
function slice(name: FaceName, x: number, y: number, z: number): [number, number] {
  switch (name) {
    case 'front': return [x, y]
    case 'back': return [2 - x, y]
    case 'right': return [z, y]
    case 'left': return [2 - z, y]
    case 'top': return [x, z]
    case 'bottom': return [x, 2 - z]
  }
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
  const gap = Math.round(size * 0.07)
  const step = size + gap

  const cubelets = useMemo(() => {
    const out: { x: number; y: number; z: number }[] = []
    for (let y = 0; y < 3; y++) for (let x = 0; x < 3; x++) for (let z = 0; z < 3; z++) out.push({ x, y, z })
    return out
  }, [])

  const faceStyle = (name: FaceName, outward: boolean, c: { x: number; y: number; z: number }) => {
    if (!outward) return { backgroundColor: '#0b1220' }
    const [col, row] = slice(name, c.x, c.y, c.z)
    return {
      backgroundColor: FACES[name].base,
      backgroundImage: sticker(name),
      backgroundSize: '300% 300%',
      backgroundPosition: `${col * 50}% ${row * 50}%`,
      backgroundRepeat: 'no-repeat',
    }
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
                    <i className="face face--front" style={faceStyle('front', c.z === 2, c)} />
                    <i className="face face--back" style={faceStyle('back', c.z === 0, c)} />
                    <i className="face face--right" style={faceStyle('right', c.x === 2, c)} />
                    <i className="face face--left" style={faceStyle('left', c.x === 0, c)} />
                    <i className="face face--top" style={faceStyle('top', c.y === 0, c)} />
                    <i className="face face--bottom" style={faceStyle('bottom', c.y === 2, c)} />
                  </div>
                )
              })}
          </div>
        ))}
      </div>
    </div>
  )
}
