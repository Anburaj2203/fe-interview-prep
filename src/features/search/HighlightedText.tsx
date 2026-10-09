import { Fragment } from 'react'

type HighlightedTextProps = {
  text: string
  query: string
}

type TextPart = {
  start: number
  value: string
  isMatch: boolean
}

function splitOnQuery(text: string, query: string): TextPart[] {
  if (query === '') {
    return [{ start: 0, value: text, isMatch: false }]
  }

  const haystack = text.toLowerCase()
  const needle = query.toLowerCase()
  const parts: TextPart[] = []
  let cursor = 0

  while (cursor < text.length) {
    const match = haystack.indexOf(needle, cursor)

    if (match === -1) {
      parts.push({ start: cursor, value: text.slice(cursor), isMatch: false })
      break
    }

    if (match > cursor) {
      parts.push({ start: cursor, value: text.slice(cursor, match), isMatch: false })
    }

    parts.push({ start: match, value: text.slice(match, match + needle.length), isMatch: true })
    cursor = match + needle.length
  }

  return parts
}

export function HighlightedText({ text, query }: HighlightedTextProps) {
  const parts = splitOnQuery(text, query)

  return (
    <>
      {parts.map((part) =>
        part.isMatch ? (
          <mark className="search__match" key={part.start}>
            {part.value}
          </mark>
        ) : (
          <Fragment key={part.start}>{part.value}</Fragment>
        ),
      )}
    </>
  )
}
