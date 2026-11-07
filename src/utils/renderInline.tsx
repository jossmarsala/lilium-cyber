import type { ReactNode } from 'react'
import styles from './renderInline.module.css'

function parseMarkdownLinkTarget(raw: string): { url: string; title?: string } {
  const trimmed = raw.trim()
  const titleMatch = trimmed.match(/\s+['"]([^'"]*)['"]$/)
  if (titleMatch) {
    const title = titleMatch[1].trim()
    const url = trimmed.slice(0, titleMatch.index).trim()
    return { url, title }
  }
  return { url: trimmed }
}

function normalizeUrl(url: string): string {
  const trimmed = url.trim()
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('#')
  ) {
    return trimmed
  }
  return `https://${trimmed}`
}

function findLinkEnd(text: string, startIdx: number): number {
  let bracketDepth = 1
  let j = startIdx + 1
  while (j < text.length && bracketDepth > 0) {
    if (text[j] === '`') {
      const nextTick = text.indexOf('`', j + 1)
      j = nextTick !== -1 ? nextTick + 1 : j + 1
      continue
    }
    if (text[j] === '\\' && j + 1 < text.length) {
      j += 2
      continue
    }
    if (text[j] === '[') bracketDepth++
    else if (text[j] === ']') bracketDepth--
    if (bracketDepth === 0) break
    j++
  }
  if (bracketDepth === 0 && j + 1 < text.length && text[j + 1] === '(') {
    let parenDepth = 1
    let k = j + 2
    let inQuote: string | null = null
    while (k < text.length && parenDepth > 0) {
      const ch = text[k]
      if (inQuote) {
        if (ch === inQuote && text[k - 1] !== '\\') {
          inQuote = null
        }
      } else {
        if (ch === '"' || ch === "'") {
          inQuote = ch
        } else if (ch === '(') {
          parenDepth++
        } else if (ch === ')') {
          parenDepth--
          if (parenDepth === 0) return k + 1
        }
      }
      k++
    }
  }
  return -1
}

type InlineToken =
  | { type: 'text'; text: string }
  | { type: 'br' }
  | { type: 'code'; code: string }
  | { type: 'bold_italic'; inner: string }
  | { type: 'bold'; inner: string }
  | { type: 'italic'; inner: string }
  | { type: 'link'; label: string; url: string; title?: string }

function tokenizeInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = []
  let i = 0
  let textBuf = ''

  const flushText = () => {
    if (textBuf) {
      tokens.push({ type: 'text', text: textBuf })
      textBuf = ''
    }
  }

  while (i < text.length) {
    // 1. Escaped characters: \* \_ \` \[ \] \\
    if (text[i] === '\\' && i + 1 < text.length && /[*_`[\]\\]/.test(text[i + 1])) {
      textBuf += text[i + 1]
      i += 2
      continue
    }

    // 2. Line breaks: <br> or <br/> or <br />
    const brMatch = text.slice(i).match(/^<br\s*\/?>/i)
    if (brMatch) {
      flushText()
      tokens.push({ type: 'br' })
      i += brMatch[0].length
      continue
    }

    // 3. Inline code: `...`
    if (text[i] === '`') {
      const closeIdx = text.indexOf('`', i + 1)
      if (closeIdx !== -1) {
        flushText()
        tokens.push({ type: 'code', code: text.slice(i + 1, closeIdx) })
        i = closeIdx + 1
        continue
      }
    }

    // 4. Markdown link: [label](url 'optional title')
    if (text[i] === '[') {
      const linkEnd = findLinkEnd(text, i)
      if (linkEnd !== -1) {
        const fullLink = text.slice(i, linkEnd)
        const splitIdx = fullLink.indexOf('](')
        const label = fullLink.slice(1, splitIdx)
        const rawTarget = fullLink.slice(splitIdx + 2, -1)
        const { url, title } = parseMarkdownLinkTarget(rawTarget)
        flushText()
        tokens.push({ type: 'link', label, url, title })
        i = linkEnd
        continue
      }
    }

    // 5. Bold + Italic: ***...***
    if (text.startsWith('***', i)) {
      let closeIdx = -1
      let j = i + 3
      while (j < text.length) {
        if (text[j] === '`') {
          const nextTick = text.indexOf('`', j + 1)
          j = nextTick !== -1 ? nextTick + 1 : j + 1
          continue
        }
        if (text.startsWith('***', j)) {
          closeIdx = j
          break
        }
        j++
      }
      if (closeIdx !== -1) {
        flushText()
        tokens.push({ type: 'bold_italic', inner: text.slice(i + 3, closeIdx) })
        i = closeIdx + 3
        continue
      }
    }

    // 6. Bold: **...** or __...__
    if (text.startsWith('**', i)) {
      let closeIdx = -1
      let j = i + 2
      while (j < text.length) {
        if (text[j] === '`') {
          const nextTick = text.indexOf('`', j + 1)
          j = nextTick !== -1 ? nextTick + 1 : j + 1
          continue
        }
        if (text.startsWith('**', j)) {
          closeIdx = j
          break
        }
        j++
      }
      if (closeIdx !== -1) {
        flushText()
        tokens.push({ type: 'bold', inner: text.slice(i + 2, closeIdx) })
        i = closeIdx + 2
        continue
      }
    }

    if (text.startsWith('__', i)) {
      const prevChar = i > 0 ? text[i - 1] : ''
      const nextChar = i + 2 < text.length ? text[i + 2] : ''
      const canOpen =
        (i === 0 || !/[a-zA-Z0-9]/.test(prevChar)) && !/\s/.test(nextChar)
      if (canOpen) {
        let closeIdx = -1
        let j = i + 2
        while (j < text.length) {
          if (text[j] === '`') {
            const nextTick = text.indexOf('`', j + 1)
            j = nextTick !== -1 ? nextTick + 1 : j + 1
            continue
          }
          if (text.startsWith('__', j)) {
            const cPrev = text[j - 1]
            const cNext = j + 2 < text.length ? text[j + 2] : ''
            const canClose =
              !/\s/.test(cPrev) &&
              (j + 2 === text.length || !/[a-zA-Z0-9]/.test(cNext))
            if (canClose) {
              closeIdx = j
              break
            }
          }
          j++
        }
        if (closeIdx !== -1) {
          flushText()
          tokens.push({ type: 'bold', inner: text.slice(i + 2, closeIdx) })
          i = closeIdx + 2
          continue
        }
      }
    }

    // 7. Italic: *...*
    if (text[i] === '*' && text[i + 1] !== '*') {
      const nextChar = i + 1 < text.length ? text[i + 1] : ''
      if (!/\s/.test(nextChar)) {
        let closeIdx = -1
        let j = i + 1
        while (j < text.length) {
          if (text[j] === '`') {
            const nextTick = text.indexOf('`', j + 1)
            j = nextTick !== -1 ? nextTick + 1 : j + 1
            continue
          }
          if (text[j] === '*' && text[j - 1] !== '*' && text[j + 1] !== '*') {
            if (!/\s/.test(text[j - 1])) {
              closeIdx = j
              break
            }
          }
          j++
        }
        if (closeIdx !== -1) {
          flushText()
          tokens.push({ type: 'italic', inner: text.slice(i + 1, closeIdx) })
          i = closeIdx + 1
          continue
        }
      }
    }

    // 8. Italic: _..._
    if (text[i] === '_' && text[i + 1] !== '_') {
      const prevChar = i > 0 ? text[i - 1] : ''
      const nextChar = i + 1 < text.length ? text[i + 1] : ''
      const canOpen =
        (i === 0 || !/[a-zA-Z0-9]/.test(prevChar)) &&
        !/\s/.test(nextChar) &&
        nextChar !== '_'

      if (canOpen) {
        let closeIdx = -1
        let j = i + 1
        while (j < text.length) {
          if (text[j] === '`') {
            const nextTick = text.indexOf('`', j + 1)
            j = nextTick !== -1 ? nextTick + 1 : j + 1
            continue
          }
          if (text[j] === '[') {
            const lEnd = findLinkEnd(text, j)
            if (lEnd !== -1) {
              j = lEnd
              continue
            }
          }
          if (text[j] === '_') {
            const cPrev = text[j - 1]
            const cNext = j + 1 < text.length ? text[j + 1] : ''
            const canClose =
              !/\s/.test(cPrev) &&
              (j + 1 === text.length || !/[a-zA-Z0-9]/.test(cNext))
            if (canClose) {
              closeIdx = j
              break
            }
          }
          j++
        }
        if (closeIdx !== -1) {
          flushText()
          tokens.push({ type: 'italic', inner: text.slice(i + 1, closeIdx) })
          i = closeIdx + 1
          continue
        }
      }
    }

    textBuf += text[i]
    i++
  }

  flushText()
  return tokens
}

/**
 * Parses markdown inline formatting:
 * - `inline code`
 * - **bold text**
 * - _italic text_ or *italic text*
 * - [link text](url 'optional title')
 *
 * Recursively parses nested formatting.
 * Returns safe React elements without dangerouslySetInnerHTML.
 */
export function renderInline(text: string, key?: string | number): ReactNode {
  if (!text) return null

  // Fast path: plain text with no markdown characters or HTML line breaks
  if (
    !text.includes('`') &&
    !text.includes('**') &&
    !text.includes('_') &&
    !text.includes('*') &&
    !text.includes('[') &&
    !text.includes('\\') &&
    !text.toLowerCase().includes('<br')
  ) {
    return key !== undefined ? <span key={key}>{text}</span> : text
  }

  const tokens = tokenizeInline(text)

  const elements = tokens.map((token, i) => {
    switch (token.type) {
      case 'text':
        return token.text

      case 'br':
        return <br key={`br-${i}`} />

      case 'code':
        return (
          <code key={`c-${i}`} className={styles.code}>
            {token.code}
          </code>
        )

      case 'bold_italic':
        return (
          <strong key={`bi-${i}`} className={styles.strong}>
            <em className={styles.em}>
              {renderInline(token.inner, `bi-inner-${i}`)}
            </em>
          </strong>
        )

      case 'bold':
        return (
          <strong key={`b-${i}`} className={styles.strong}>
            {renderInline(token.inner, `b-inner-${i}`)}
          </strong>
        )

      case 'italic':
        return (
          <em key={`i-${i}`} className={styles.em}>
            {renderInline(token.inner, `i-inner-${i}`)}
          </em>
        )

      case 'link': {
        const href = normalizeUrl(token.url)
        const isExternal = /^https?:\/\//i.test(href) || href.startsWith('//')
        const isRef = Boolean(token.title) || /referencia/i.test(token.label)

        if (isRef) {
          return (
            <a
              key={`ref-${i}`}
              href={href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className={styles.externalRefLink}
              title={token.title ? `${token.label}: ${token.title}` : token.label}
            >
              <span className={styles.refLabel}>
                {renderInline(token.label, `lbl-${i}`)}
              </span>
              {token.title && (
                <>
                  <span className={styles.refDivider} aria-hidden="true" />
                  <span className={styles.refBadge}>{token.title}</span>
                </>
              )}
              <span className={styles.refArrow} aria-hidden="true">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5" />
                </svg>
              </span>
            </a>
          )
        }

        return (
          <a
            key={`a-${i}`}
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className={styles.inlineLink}
            title={token.title}
          >
            <span>{renderInline(token.label, `lbl-${i}`)}</span>
            {isExternal && (
              <svg
                className={styles.inlineLinkArrow}
                width="10"
                height="10"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3.5 8.5L8.5 3.5M8.5 3.5H4.5M8.5 3.5V7.5" />
              </svg>
            )}
          </a>
        )
      }
    }
  })

  if (key !== undefined) {
    return <span key={key}>{elements}</span>
  }
  return <>{elements}</>
}

export default renderInline
