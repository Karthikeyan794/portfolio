import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { profile } from '../data'
import Scene from '../three/Scene'
import { PANEL_VIEW, VIEWS, VIEW_ORDER, type PanelId, type ViewId } from '../three/views'
import EnterScreen from './EnterScreen'
import Panel from './Panel'

type Props = { onSwitch2D: () => void }

/** The 3D experience: canvas + HUD + slide-over panel + enter screen. */
export default function Lab({ onSwitch2D }: Props) {
  const [entered, setEntered] = useState(false)
  const [view, setView] = useState<ViewId>('intro')
  const [panel, setPanel] = useState<PanelId | null>(null)
  const quality = useMemo<'high' | 'low'>(
    () => (window.matchMedia('(max-width: 900px)').matches ? 'low' : 'high'),
    [],
  )

  function select(id: PanelId) {
    setPanel(id)
    setView(PANEL_VIEW[id])
  }

  function enter() {
    setEntered(true)
    setView('overview')
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPanel(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="lab">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        camera={{ position: VIEWS.intro.position, fov: 42 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onPointerMissed={() => setPanel(null)}
      >
        <Suspense fallback={null}>
          <Scene view={view} entered={entered} quality={quality} onSelect={select} />
        </Suspense>
      </Canvas>

      <div className="hud">
        <div className="hud__top">
          <div className="hud__brand">
            <i aria-hidden="true" />
            {profile.name}
          </div>
          <button className="hud__ghost" onClick={onSwitch2D}>
            2D version
          </button>
        </div>

        {entered && (
          <>
            <nav className="hud__views" aria-label="Camera views">
              {VIEW_ORDER.map((v) => (
                <button
                  key={v}
                  className="hud__btn"
                  aria-pressed={view === v}
                  onClick={() => {
                    setView(v)
                    setPanel(null)
                  }}
                >
                  {VIEWS[v].label}
                </button>
              ))}
              <button className="hud__btn hud__btn--accent" onClick={() => select('bot')}>
                Ask AI
              </button>
            </nav>
            <div className="hud__hint">Drag to look · Scroll to zoom · Click glowing objects · Esc closes</div>
          </>
        )}
      </div>

      <Panel id={panel} onClose={() => setPanel(null)} />
      {!entered && <EnterScreen onEnter={enter} onSwitch2D={onSwitch2D} />}
    </div>
  )
}
