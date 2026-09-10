import { useEffect, useState } from 'react'
import { ambience } from '../audio/ambience'

const KEY = 'portfolio:sound' // 'off' when the visitor muted it

type State = 'waiting' | 'on' | 'off'

/**
 * Nature ambience for the landing page. Browsers only allow sound after a
 * user gesture, so we arm the first click / tap / key anywhere on the page;
 * until then the button shows a hint. Ducks when you scroll past the hero.
 */
export default function SoundToggle() {
  const [state, setState] = useState<State>(() => {
    try {
      return localStorage.getItem(KEY) === 'off' ? 'off' : 'waiting'
    } catch {
      return 'waiting'
    }
  })

  // first gesture anywhere starts the ambience (unless muted earlier);
  // if a start attempt fails, the next gesture tries again
  useEffect(() => {
    if (state !== 'waiting') return
    const off = () => {
      window.removeEventListener('pointerdown', arm)
      window.removeEventListener('keydown', arm)
    }
    async function arm() {
      try {
        await ambience.start()
        off()
        setState('on')
      } catch {
        /* blocked this time — stay armed for the next gesture */
      }
    }
    window.addEventListener('pointerdown', arm)
    window.addEventListener('keydown', arm)
    return off
  }, [state])

  // quieter once the hero has scrolled away; pause while the tab is hidden
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
      void ambience.stop()
      setState('off')
      try { localStorage.setItem(KEY, 'off') } catch { /* ignore */ }
    } else {
      void ambience.start().then(() => setState('on'))
      try { localStorage.removeItem(KEY) } catch { /* ignore */ }
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
