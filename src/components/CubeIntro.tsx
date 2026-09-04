import CubeLoader from './CubeLoader'

const RIBBON_TEXT = 'VIBING WITH CODE & DESIGN   ·   DESIGN × VIBE CODING   ·   BUILD · SHIP · REPEAT'

/**
 * A wavy snake through the cube (viewBox 1000×600, cube centre at 500,300),
 * like a trim-path stroke in After Effects. The band is a thick stroke whose
 * dash slides along the path; the text rides the same path with a textPath.
 * x only ever increases, so the left half can be drawn behind the cube and
 * the right half in front — the ribbon wraps the cube.
 */
const PATH = 'M -280 320 C -80 320, 20 170, 190 200 S 360 410, 500 300 S 690 150, 820 235 S 990 440, 1280 300'

function Ribbon({ side }: { side: 'behind' | 'front' }) {
  const id = `ribbon-path-${side}`
  return (
    <svg className={`ribbon ribbon--${side}`} viewBox="0 0 1000 600" aria-hidden="true">
      <defs>
        <path id={id} d={PATH} pathLength="1000" />
      </defs>
      {/* the band: a 700‰ dash sliding from before the start to past the end */}
      <use href={`#${id}`} className="ribbon__band" />
      <text className="ribbon__text" dy="9">
        <textPath href={`#${id}`} startOffset="-70%" textLength="1150" lengthAdjust="spacingAndGlyphs">
          {RIBBON_TEXT}
          {/* SMIL keeps the text in step with the CSS dash animation */}
          <animate
            attributeName="startOffset"
            values="-70%;100%"
            begin="1.2s"
            dur="3.8s"
            calcMode="spline"
            keySplines="0.55 0.05 0.35 1"
            fill="freeze"
          />
        </textPath>
      </text>
    </svg>
  )
}

type Props = { size?: number }

/**
 * Loader sequence: pieces combine into the cube → the ribbon curves in from
 * the left, passes behind then in front → the hit sets the cube spinning and
 * twisting → it lands solved with Figma facing front and stops (cube.css).
 */
export default function CubeIntro({ size = 34 }: Props) {
  return (
    <div className="stage">
      <Ribbon side="behind" />
      <CubeLoader size={size} />
      <Ribbon side="front" />
    </div>
  )
}
