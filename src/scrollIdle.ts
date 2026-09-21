/**
 * One scroll listener for the whole page, reporting only whether the page is
 * moving right now.
 *
 * The case study carries nine autoplaying clips, three of them near 4K. A
 * frame of video has to be decoded whether or not the pixels are wanted, and
 * three 4K decodes plus a scroll is more than a laptop can keep at 60fps —
 * which is felt as the scroll stuttering, not as the video being slow.
 *
 * So everything that decodes subscribes here and stops while the page is
 * moving. Scrolling gets the whole frame budget; playback resumes a beat
 * after the page settles, which is early enough that nobody sees a paused
 * video unless they were scrolling past it anyway.
 *
 * One listener, not one per clip: nine passive listeners each doing their own
 * timer is its own small tax.
 */

const IDLE_AFTER = 140

let scrolling = false
let timer = 0
const subs = new Set<(moving: boolean) => void>()
let attached = false

function tell(v: boolean) {
  scrolling = v
  for (const fn of subs) fn(v)
}

function onScroll() {
  if (!scrolling) tell(true)
  window.clearTimeout(timer)
  timer = window.setTimeout(() => tell(false), IDLE_AFTER)
}

function attach() {
  if (attached || typeof window === 'undefined') return
  attached = true
  window.addEventListener('scroll', onScroll, { passive: true })
}

/** true while the page is being scrolled */
export function isScrolling() {
  return scrolling
}

/** subscribe to scroll start/stop; returns an unsubscribe */
export function onScrollState(fn: (moving: boolean) => void) {
  attach()
  subs.add(fn)
  return () => {
    subs.delete(fn)
  }
}
