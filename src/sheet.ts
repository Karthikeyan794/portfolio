import { useEffect, useRef, useState } from 'react'

/** the width at which a sheet stops floating and becomes a page of its own */
export const PHONE = '(max-width: 640px)'

/** true on a phone-sized screen, and kept up to date if the screen turns */
export function usePhone() {
  const [phone, setPhone] = useState(() => typeof window !== 'undefined' && window.matchMedia(PHONE).matches)
  useEffect(() => {
    const mq = window.matchMedia(PHONE)
    const on = () => setPhone(mq.matches)
    on()
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return phone
}

/**
 * A sheet that behaves like a page on a phone: every level it opens (the
 * sheet itself, and in the drawings a single drawing inside it) adds a step
 * to the browser's history, so the back gesture takes you back one level —
 * `onBack` is told each time and brings `depth` down to match. Closing any
 * other way (the Back button, Escape) takes those steps back out, so the
 * history never fills with dead entries. The address never changes: the
 * steps are the same URL, which the hash router does not see.
 */
export function useBackSteps(depth: number, onBack: () => void, enabled: boolean) {
  const back = useRef(onBack)
  back.current = onBack
  const pushed = useRef(0)
  // a history.go() of our own raises one popstate, which is not the reader
  const ignore = useRef(0)

  useEffect(() => {
    if (!enabled) return
    const onPop = () => {
      if (ignore.current > 0) {
        ignore.current -= 1
        return
      }
      if (pushed.current > 0) {
        pushed.current -= 1
        back.current()
      }
    }
    window.addEventListener('popstate', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      if (pushed.current > 0) {
        history.go(-pushed.current)
        pushed.current = 0
      }
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled) return
    while (pushed.current < depth) {
      pushed.current += 1
      history.pushState({ ...(history.state ?? {}), sheet: pushed.current }, '')
    }
    if (pushed.current > depth) {
      ignore.current += 1
      history.go(depth - pushed.current)
      pushed.current = depth
    }
  }, [depth, enabled])
}
