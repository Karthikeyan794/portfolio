import { useMemo } from 'react'
/**
 * CSS-3D Rubik's "picture cube": each face is ONE big die-cut sticker,
 * sliced across the 9 tiles like a photo cube, so the layer twists scramble
 * the stickers and the spin reveals them. Pieces fly in and combine first.
 * Sticker style: bold shapes, thick navy outlines, white die-cut border.
 */

const NAVY = '#0b1220'
const CYAN = '#22d3ee'
const BLUE = '#2b8cff'
const PAPER = '#e6f0ff'
const FONT = `font-family="Roboto, 'Arial Black', Helvetica, Arial, sans-serif" font-weight="900"`
/** die-cut text: white border behind the letters */
const CUT = `stroke="#fff" stroke-width="6" stroke-linejoin="round" paint-order="stroke"`
/** thin navy outline behind white letters */
const INK = `stroke="${NAVY}" stroke-width="2.6" stroke-linejoin="round" paint-order="stroke"`

const spark = (x: number, y: number, r: number, fill = CYAN) =>
  `<path d="M${x} ${y - r} Q${x} ${y} ${x + r} ${y} Q${x} ${y} ${x} ${y + r} Q${x} ${y} ${x - r} ${y} Q${x} ${y} ${x} ${y - r}Z" fill="${fill}" stroke="#fff" stroke-width="2" paint-order="stroke"/>`

/** 1 · SLEEP / DESIGN / REPEAT — stacked heavy type */
const sleepDesignRepeat =
  `<g ${FONT} font-size="21" text-anchor="middle" fill="${NAVY}" ${CUT}>` +
  `<text x="50" y="36" textLength="72" lengthAdjust="spacingAndGlyphs">SLEEP</text>` +
  `<text x="50" y="60" textLength="78" lengthAdjust="spacingAndGlyphs">DESIGN</text>` +
  `<text x="50" y="84" textLength="78" lengthAdjust="spacingAndGlyphs">REPEAT</text></g>` +
  spark(88, 14, 7)

/** 2 · smiley blob — GET THINGS DONE */
const getThingsDone =
  `<circle cx="50" cy="38" r="31" fill="#fff"/>` +
  `<circle cx="50" cy="38" r="27" fill="${CYAN}" stroke="${NAVY}" stroke-width="3"/>` +
  `<ellipse cx="41" cy="28" rx="7" ry="3" fill="#fff" opacity="0.7"/>` +
  `<rect x="38" y="30" width="6" height="12" rx="3" fill="${NAVY}"/><rect x="56" y="30" width="6" height="12" rx="3" fill="${NAVY}"/>` +
  `<path d="M37 48 Q50 60 63 48" fill="none" stroke="${NAVY}" stroke-width="3.5" stroke-linecap="round"/>` +
  `<g ${FONT} text-anchor="middle" fill="#fff" ${INK}>` +
  `<text x="50" y="80" font-size="14" textLength="76" lengthAdjust="spacingAndGlyphs">GET THINGS</text>` +
  `<text x="50" y="95" font-size="15" textLength="40" lengthAdjust="spacingAndGlyphs">DONE</text></g>`

/** 3 · BUILD DIFFERENT — label badge */
const buildDifferent =
  `<rect x="7" y="22" width="86" height="56" rx="11" fill="#fff"/>` +
  `<rect x="11" y="26" width="78" height="48" rx="8" fill="#fff" stroke="${NAVY}" stroke-width="3"/>` +
  `<g ${FONT} text-anchor="middle" fill="${NAVY}">` +
  `<text x="50" y="47" font-size="16" textLength="52" lengthAdjust="spacingAndGlyphs">BUILD</text>` +
  `<text x="50" y="62" font-size="13" textLength="66" lengthAdjust="spacingAndGlyphs">DIFFERENT</text></g>` +
  `<rect x="13" y="65" width="74" height="7" fill="${CYAN}"/>` +
  `<text x="50" y="70.5" ${FONT} font-size="4.6" fill="${NAVY}" text-anchor="middle" letter-spacing="0.4" textLength="68" lengthAdjust="spacingAndGlyphs">KB STUDIO · KB STUDIO · KB STUDIO</text>`

/** 4 · ★ VIBE CODING ★ — wavy blob badge */
const BLOB = 'M12 50 C 12 34, 28 25, 50 27 C 72 25, 88 34, 88 50 C 88 66, 72 75, 50 73 C 28 75, 12 66, 12 50 Z'
const vibeCoding =
  `<path d="${BLOB}" fill="#fff" stroke="#fff" stroke-width="9" stroke-linejoin="round"/>` +
  `<path d="${BLOB}" fill="${CYAN}" stroke="${NAVY}" stroke-width="3"/>` +
  `<text x="50" y="55" ${FONT} font-size="13" text-anchor="middle" fill="#fff" ${INK} textLength="64" lengthAdjust="spacingAndGlyphs">★ VIBE CODING ★</text>` +
  spark(16, 22, 6) + spark(86, 78, 5)

/** 5 · SHIP IT! — browser window */
const shipIt =
  `<rect x="11" y="19" width="78" height="62" rx="9" fill="#fff"/>` +
  `<rect x="15" y="23" width="70" height="54" rx="6" fill="${NAVY}"/>` +
  `<path d="M15 29 a6 6 0 0 1 6 -6 h58 a6 6 0 0 1 6 6 v9 h-70 z" fill="${CYAN}"/>` +
  `<circle cx="23" cy="30.5" r="2.2" fill="${NAVY}"/><circle cx="30" cy="30.5" r="2.2" fill="${NAVY}"/><circle cx="37" cy="30.5" r="2.2" fill="${NAVY}"/>` +
  `<text x="50" y="63" ${FONT} font-size="18" text-anchor="middle" fill="#fff" textLength="50" lengthAdjust="spacingAndGlyphs">SHIP IT!</text>` +
  `<rect x="30" y="68" width="40" height="3" rx="1.5" fill="${CYAN}"/>`

/** 6 · LOADING… — retro computer */
const loading =
  `<rect x="18" y="9" width="64" height="52" rx="8" fill="#fff"/><rect x="11" y="55" width="78" height="17" rx="5" fill="#fff"/>` +
  `<rect x="22" y="13" width="56" height="44" rx="5" fill="${PAPER}" stroke="${NAVY}" stroke-width="3"/>` +
  `<rect x="28" y="18" width="44" height="31" rx="3" fill="${BLUE}" stroke="${NAVY}" stroke-width="2.5"/>` +
  `<rect x="41" y="26" width="4" height="7" fill="#fff"/><rect x="55" y="26" width="4" height="7" fill="#fff"/>` +
  `<path d="M40 40 Q50 47 60 40" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round"/>` +
  `<rect x="15" y="58" width="70" height="11" rx="3" fill="${PAPER}" stroke="${NAVY}" stroke-width="3"/>` +
  `<rect x="61" y="61.5" width="16" height="4" rx="1" fill="${NAVY}"/><circle cx="22" cy="63.5" r="1.8" fill="${CYAN}"/>` +
  `<text x="50" y="84" font-family="'Courier New', Menlo, monospace" font-weight="900" font-size="11.5" text-anchor="middle" fill="#fff" ${INK} letter-spacing="1.2">LOADING...</text>` +
  `<rect x="20" y="88" width="60" height="8" fill="#fff" stroke="${NAVY}" stroke-width="2"/>` +
  [0, 1, 2, 3].map((i) => `<rect x="${22.5 + i * 11.5}" y="90" width="9" height="4" fill="${CYAN}"/>`).join('') +
  spark(14, 16, 6, NAVY)

/** Face → base colour (theme) + sticker artwork. */
const FACES = {
  front: { base: '#0b1220', art: sleepDesignRepeat },
  right: { base: '#0f766e', art: getThingsDone },
  back: { base: '#1e3a8a', art: buildDifferent },
  left: { base: '#111827', art: vibeCoding },
  top: { base: '#f5b14a', art: shipIt },
  bottom: { base: '#1e293b', art: loading },
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
