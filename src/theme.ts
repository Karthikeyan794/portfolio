import { useSyncExternalStore } from 'react'

export type Theme = 'light' | 'dark'
const KEY = 'portfolio:theme:v3'

let theme: Theme = (() => {
  try {
    const v = localStorage.getItem(KEY)
    if (v === 'dark' || v === 'light') return v
  } catch {
    /* ignore */
  }
  return 'light'
})()

const listeners = new Set<() => void>()

function apply() {
  document.documentElement.setAttribute('data-theme', theme)
}
apply()

export function getTheme() {
  return theme
}

export function setTheme(next: Theme) {
  if (next === theme) return
  theme = next
  apply()
  try {
    localStorage.setItem(KEY, next)
  } catch {
    /* ignore */
  }
  listeners.forEach((fn) => fn())
}

export function toggleTheme() {
  setTheme(theme === 'dark' ? 'light' : 'dark')
}

/** Shared light/dark state — the nav toggle sets it, the hero and tokens react to it. */
export function useTheme(): Theme {
  return useSyncExternalStore(
    (fn) => {
      listeners.add(fn)
      return () => listeners.delete(fn)
    },
    getTheme,
    getTheme,
  )
}
