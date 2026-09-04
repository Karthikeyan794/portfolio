import { useProgress } from '@react-three/drei'
import { profile } from '../data'

type Props = { onEnter: () => void; onSwitch2D: () => void }

export default function EnterScreen({ onEnter, onSwitch2D }: Props) {
  const { progress, active } = useProgress()
  const ready = !active || progress >= 100

  return (
    <div className="enter">
      <div className="enter__card">
        <span className="eyebrow">Welcome to</span>
        <h1 className="enter__title">{profile.name.split(' ')[0]}'s Lab</h1>
        <p className="enter__sub">{profile.role} · {profile.location}</p>
        <div className="enter__bar" aria-hidden="true">
          <i style={{ width: `${ready ? 100 : Math.max(8, progress)}%` }} />
        </div>
        <button className="enter__btn" onClick={onEnter} disabled={!ready}>
          {ready ? 'Enter the lab' : `Loading ${Math.round(progress)}%`}
        </button>
        <button className="hud__ghost" onClick={onSwitch2D}>
          View the 2D version instead
        </button>
        <p className="enter__hint">Drag to look around · Click glowing objects</p>
      </div>
    </div>
  )
}
