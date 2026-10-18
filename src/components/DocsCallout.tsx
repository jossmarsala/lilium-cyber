/**
 * DocsCallout — contextual callout blocks for documentation.
 *
 * Variants: 'note' | 'tip' | 'warning' | 'critical'
 *
 * Usage:
 *   <DocsCallout variant="note">
 *     Node.js ≥ 18 is required before proceeding.
 *   </DocsCallout>
 *
 *   <DocsCallout variant="warning" label="Breaking Change">
 *     This API was removed in v2.0.
 *   </DocsCallout>
 */
import type { ReactNode } from 'react'
import { renderInline } from '@/utils/renderInline'
import styles from './DocsCallout.module.css'

import type { DocListItem } from '@/data/docs'

export type CalloutVariant = 'note' | 'tip' | 'warning' | 'critical'

export interface DocsCalloutProps {
  variant?: CalloutVariant
  /** Overrides the default label (e.g. "Breaking Change", "Good to know") */
  label?: string
  text?: string
  items?: (string | DocListItem)[]
  children?: ReactNode
}

const META: Record<
  CalloutVariant,
  { defaultLabel: string; icon: ReactNode }
> = {
  note: {
    defaultLabel: 'Note',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="6.5" />
        <line x1="8" y1="7" x2="8" y2="11" />
        <circle cx="8" cy="5" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  tip: {
    defaultLabel: 'Tip',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 12h4M8 2a4 4 0 0 1 2.83 6.83L10 10H6l-.83-1.17A4 4 0 0 1 8 2z" />
        <path d="M6.5 12v1a1.5 1.5 0 0 0 3 0v-1" />
      </svg>
    ),
  },
  warning: {
    defaultLabel: 'Warning',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 1.5 1.2 13.5h13.6z" />
        <line x1="8" y1="6.5" x2="8" y2="9.5" />
        <circle cx="8" cy="11.5" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  critical: {
    defaultLabel: 'Critical',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="8" r="6.5" />
        <line x1="8" y1="5" x2="8" y2="9" />
        <circle cx="8" cy="11" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
}

export default function DocsCallout({
  variant = 'note',
  label,
  text,
  items,
  children,
}: DocsCalloutProps) {
  const { defaultLabel, icon } = META[variant]

  let resolvedItems = items
  let content = children ?? (text ? renderInline(text, 'callout-text') : null)

  // Auto-parse markdown bullet lists if children is a string without explicit items
  if (!resolvedItems && typeof children === 'string' && /(?:^|\n)\s*[-*]\s+/.test(children)) {
    const lines = children.split('\n')
    const prose: string[] = []
    const parsedList: string[] = []
    for (const raw of lines) {
      const line = raw.trim()
      const m = line.match(/^[-*]\s+(.*)$/)
      if (m) {
        parsedList.push(m[1].trim())
      } else if (line) {
        prose.push(line)
      }
    }
    content = prose.length > 0 ? renderInline(prose.join(' '), 'parsed-callout-text') : null
    resolvedItems = parsedList.length > 0 ? parsedList : undefined
  }

  return (
    <div className={`${styles.callout} ${styles[variant]}`} role="note">
      <span className={styles.icon} aria-hidden="true">{icon}</span>
      <div className={styles.body}>
        <span className={styles.label}>{label ?? defaultLabel}</span>
        {content && <div className={styles.text}>{content}</div>}
        {resolvedItems && resolvedItems.length > 0 && (
          <ul className={styles.list}>
            {resolvedItems.map((item, idx) => {
              const isObj = typeof item === 'object' && item !== null
              const itemText = isObj ? item.text : item
              const itemLevel = isObj && item.level ? item.level : 1

              return (
                <li
                  key={idx}
                  className={`${styles.item} ${itemLevel === 2 ? styles.level2 : ''}`}
                >
                  <span
                    className={`${styles.bullet} ${itemLevel === 2 ? styles.bulletLevel2 : ''}`}
                    aria-hidden="true"
                  />
                  <span className={styles.itemText}>
                    {renderInline(itemText, `callout-item-${idx}`)}
                  </span>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
