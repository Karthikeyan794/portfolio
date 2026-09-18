import { Fragment } from 'react'
import type { ReactNode } from 'react'

/**
 * Copy, cut into one span per word, so the word under the pointer can answer
 * it. Whitespace stays as real text nodes, so the line still wraps and still
 * copies out as a normal sentence.
 *
 * A `*marked*` run keeps its own <em> wrapper — the mark is the phrase, the
 * hover is still per word inside it.
 */
function split(text: string, key: string): ReactNode[] {
  return text.split(/(\s+)/).map((tok, i) =>
    tok === '' || /^\s+$/.test(tok) ? (
      tok
    ) : (
      <span className="hw" key={`${key}.${i}`}>
        {tok}
      </span>
    ),
  )
}

export default function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*[^*]+\*)/g).map((part, i) =>
        part.length > 2 && part.startsWith('*') && part.endsWith('*') ? (
          <em className="hi" key={i}>
            {split(part.slice(1, -1), String(i))}
          </em>
        ) : (
          <Fragment key={i}>{split(part, String(i))}</Fragment>
        ),
      )}
    </>
  )
}
