import { useEffect, useState } from 'react'
import { ambience } from '../audio/ambience'

type State = 'waiting' | 'on' | 'off'

function current(): State {
  return ambience.running ? 'on' : ambience.muted ? 'off' : 'waiting'
}

/**
 * Nature-sound toggle for the nav. The ambience itself is armed at app level
 * (first click / tap / key anywhere starts it); this button reflects its state,
 * lets the visitor switch it off (remembered) or back on, ducks it below the
 * hero and pauses it while the tab is hidden.
 */
export default function SoundToggle() {
  const [state, setState] = useState<State>(current)

  useEffect(() => ambience.subscribe(() => setState(current())), [])

  useEffect(() => {
    const onScroll = () => ambience.setLevel(window.scrollY > window.innerHeight * 0.7 ? 0.3 : 1)
    const onVis = () => (document.visibilityState === 'hidden' ? ambience.suspend() : ambience.resume())
    window.addEventListener('scroll', onScroll, { passive: true })
    document.addEventListener('visibilitychange', onVis)
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  function toggle(e: React.MouseEvent) {
    e.stopPropagation()
    if (state === 'on') {
      ambience.muted = true
      void ambience.stop()
    } else {
      ambience.muted = false
      void ambience.start()
    }
  }

  const on = state === 'on'
  return (
    <button
      type="button"
      className="sound"
      data-state={state}
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Turn nature sound off' : 'Turn nature sound on'}
      title={on ? 'Sound on' : 'Sound off'}
    >
      <span className="sound__bars" aria-hidden="true">
        <i /><i /><i /><i />
      </span>
      <span className="sound__label">{state === 'waiting' ? 'Tap for sound' : on ? 'Sound on' : 'Sound off'}</span>
    </button>
  )
}
