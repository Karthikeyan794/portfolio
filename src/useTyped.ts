import { useEffect, useState } from 'react'

/**
 * Text that types itself, a phrase at a time: each types at a slightly uneven,
 * hand-typed pace, holds, deletes, and the next begins. Used by the line above
 * the landing headline and by the prompt in the contact dialog's empty box.
 *
 * Timers rather than animation frames, so a throttled tab only slows it down;
 * the text is plain state and is on screen whether or not a frame arrives.
 * With `still` (reduced motion) it shows the first phrase and never moves.
 */
export function useTyped(
  phrases: readonly string[],
  { delay = 0, firstHold = 1800, hold = 1800, still = false }: { delay?: number; firstHold?: number; hold?: number; still?: boolean } = {},
) {
  const [text, setText] = useState(still ? phrases[0] ?? '' : '')
  useEffect(() => {
    if (still || !phrases.length) {
      setText(phrases[0] ?? '')
      return
    }
    let i = 0
    let n = 0
    let typing = true
    let t = 0
    const tick = () => {
      const phrase = phrases[i]
      if (typing) {
        n += 1
        setText(phrase.slice(0, n))
        if (n >= phrase.length) {
          typing = false
          t = window.setTimeout(tick, i === 0 ? firstHold : hold)
          return
        }
        t = window.setTimeout(tick, 52 + Math.random() * 46)
      } else {
        n -= 1
        setText(phrase.slice(0, n))
        if (n <= 0) {
          typing = true
          i = (i + 1) % phrases.length
          t = window.setTimeout(tick, 380)
          return
        }
        t = window.setTimeout(tick, 28)
      }
    }
    t = window.setTimeout(tick, delay * 1000)
    return () => window.clearTimeout(t)
  }, [phrases, delay, firstHold, hold, still])
  return text
}
