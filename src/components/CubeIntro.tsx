import CubeLoader from './CubeLoader'

const RIBBON_TEXT = 'vibing with code & design  ·  '

type Props = { size?: number }

/**
 * The loader sequence: pieces combine into a cube → a text ribbon sweeps in
 * from the left, passes behind then in front of the cube → the impact sets
 * the cube tumbling and twisting to reveal the logos (timing in cube.css).
 */
export default function CubeIntro({ size = 34 }: Props) {
  const text = RIBBON_TEXT.repeat(18)
  return (
    <div className="stage">
      <div className="ribbon-wrap" aria-hidden="true">
        <div className="ribbon-half ribbon-half--behind">
          <div className="ribbon">{text}</div>
        </div>
        <div className="ribbon-half ribbon-half--front">
          <div className="ribbon">{text}</div>
        </div>
      </div>
      <CubeLoader size={size} />
    </div>
  )
}
