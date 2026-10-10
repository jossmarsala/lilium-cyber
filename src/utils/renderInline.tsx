import type { ReactNode } from 'react'
import styles from './renderInline.module.css'

/**
 * Parses markdown inline formatting:
 * - `inline code`
 * - **bold text**
 * - _italic text_ or *italic text*
 *
 * Recursively parses nested formatting (e.g. bold containing code or italic).
 * Returns safe React elements without dangerouslySetInnerHTML.
 */
export function renderInline(text: string, key?: string | number): ReactNode {
  if (!text) return null

  // Fast path: plain text with no markdown characters
  if (
    !text.includes('`') &&
    !text.includes('**') &&
    !text.includes('_') &&
    !text.includes('*')
  ) {
    return key !== undefined ? <span key={key}>{text}</span> : text
  }

  // Split by `code`, **bold**, _italic_, or *italic*
  const regex = /(`[^`]+`|\*\*[^*]+?\*\*|_[^_]+?_|\*[^*]+?\*)/g
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

    return part
  })

  if (key !== undefined) {
    return <span key={key}>{elements}</span>
  }
  return <>{elements}</>
}

export default renderInline
