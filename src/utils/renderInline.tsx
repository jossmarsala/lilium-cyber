import type { ReactNode } from 'react'
import styles from './renderInline.module.css'

interface ParsedLink {
  label: string
  url: string
  title?: string
}

function parseMarkdownLink(part: string): ParsedLink | null {
  const m = part.match(/^\[([^\]]+)\]\((.*)\)$/)
  if (!m) return null
  const label = m[1].trim()
  let rest = m[2].trim()
  let title: string | undefined = undefined

  // Extract optional 'title' or "title" at the end of the URL target
  const titleMatch = rest.match(/\s+['"]([^'"]*)['"]$/)
  if (titleMatch) {
    title = titleMatch[1].trim()
    rest = rest.slice(0, titleMatch.index).trim()
  }

  return { label, url: rest, title }
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

  // Fast path: plain text with no markdown characters
  if (
    !text.includes('`') &&
    !text.includes('**') &&
    !text.includes('_') &&
    !text.includes('*') &&
    !text.includes('[')
  ) {
    return key !== undefined ? <span key={key}>{text}</span> : text
  }

  // Split by `code`, **bold**, _italic_, *italic*, or [link](url 'title')
  const regex = /(`[^`]+`|\*\*[^*]+?\*\*|_[^_]+?_|\*[^*]+?\*|\[[^\]]+\]\([^)]+\))/g
  const parts = text.split(regex)

  const elements = parts.map((part, i) => {
    if (!part) return null

    // Inline code: `...`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={i} className={styles.code}>
          {part.slice(1, -1)}
        </code>
      )
    }

    // Bold: **...**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const inner = part.slice(2, -2)
      return (
        <strong key={i} className={styles.strong}>
          {renderInline(inner, `b-${i}`)}
        </strong>
      )
    }

    // Italic: _..._
    if (part.startsWith('_') && part.endsWith('_') && part.length >= 2) {
      const inner = part.slice(1, -1)
      return (
        <em key={i} className={styles.em}>
          {renderInline(inner, `i-${i}`)}
        </em>
      )
    }

    // Italic: *...*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      const inner = part.slice(1, -1)
      return (
        <em key={i} className={styles.em}>
          {renderInline(inner, `i-${i}`)}
        </em>
      )
    }

    // Markdown link: [text](url) or [text](url 'title')
    if (part.startsWith('[') && part.endsWith(')')) {
      const parsed = parseMarkdownLink(part)
      if (parsed) {
        const { label, url, title } = parsed
        const href = normalizeUrl(url)
        const isExternal = /^https?:\/\//i.test(href) || href.startsWith('//')
        const isRef = Boolean(title) || /referencia/i.test(label)

        if (isRef) {
          return (
            <a
              key={i}
              href={href}
              target={isExternal ? '_blank' : undefined}
              rel={isExternal ? 'noopener noreferrer' : undefined}
              className={styles.externalRefLink}
              title={title ? `${label}: ${title}` : label}
            >
              <span className={styles.refIcon} aria-hidden="true">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6.5 3.5H3.5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V9.5" />
                  <path d="M10 2h4v4" />
                  <path d="M7.5 8.5L14 2" />
                </svg>
              </span>
              <span className={styles.refLabel}>{renderInline(label, `lbl-${i}`)}</span>
              {title && (
                <>
                  <span className={styles.refDivider} aria-hidden="true" />
                  <span className={styles.refBadge}>{title}</span>
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

        // Standard inline link
        return (
          <a
            key={i}
            href={href}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            className={styles.inlineLink}
            title={title}
          >
            <span>{renderInline(label, `lbl-${i}`)}</span>
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

    return part
  })

  if (key !== undefined) {
    return <span key={key}>{elements}</span>
  }
  return <>{elements}</>
}

export default renderInline
