/**
 * DocsList — structured list and grouped content block components.
 *
 * Exports:
 *   DocsList     — simple bullet list
 *   DocsListItem — item inside DocsList (supports inline code via children)
 *   DocsGroup    — titled group container with optional description
 *   DocsGroupRow — key/value row inside DocsGroup (with optional badge)
 *
 * Usage:
 *
 *   // Bullet list
 *   <DocsList>
 *     <DocsListItem>Supports <code>npm</code> and <code>yarn</code></DocsListItem>
 *     <DocsListItem>Hot module replacement included</DocsListItem>
 *   </DocsList>
 *
 *   // Grouped key-value block
 *   <DocsGroup title="Environment Variables" description="src/.env">
 *     <DocsGroupRow keyLabel="PORT" badge="optional">Port the dev server listens on. Defaults to 5173.</DocsGroupRow>
 *     <DocsGroupRow keyLabel="VITE_API_URL" badge="required">Base URL for the REST API.</DocsGroupRow>
 *   </DocsGroup>
 */
import { createContext, useContext, type ReactNode } from 'react'
import styles from './DocsList.module.css'

/* ─── List Context ──────────────────────────────── */

interface ListContextValue {
  ordered: boolean
  start: number
}

const ListContext = createContext<ListContextValue>({ ordered: false, start: 1 })

/* ─── DocsList ──────────────────────────────────── */

interface ListProps {
  children: ReactNode
  ordered?: boolean
  start?: number
}

export function DocsList({ children, ordered = false, start = 1 }: ListProps) {
  const Tag = ordered ? 'ol' : 'ul'
  return (
    <ListContext.Provider value={{ ordered, start }}>
      <Tag
        className={ordered ? styles.orderedList : styles.list}
        start={ordered ? start : undefined}
      >
        {children}
      </Tag>
    </ListContext.Provider>
  )
}

interface ListItemProps {
  children: ReactNode
  index?: number
  ordered?: boolean
  level?: number
}

function getOrderLabel(index: number, level: number): string {
  if (level === 2) {
    // 1 -> a), 2 -> b), etc.
    const char = String.fromCharCode(96 + ((index - 1) % 26) + 1)
    return `${char})`
  }
  return `${index}.`
}

export function DocsListItem({ children, index, ordered: itemOrdered, level = 1 }: ListItemProps) {
  const ctx = useContext(ListContext)
  const isOrdered = itemOrdered ?? ctx.ordered

  const itemClass = [isOrdered ? styles.orderedItem : styles.item, level === 2 ? styles.level2 : '']
    .filter(Boolean)
    .join(' ')

  const bulletClass = [styles.bullet, level === 2 ? styles.bulletLevel2 : '']
    .filter(Boolean)
    .join(' ')

  const orderClass = [styles.orderNumber, level === 2 ? styles.orderNumberLevel2 : '']
    .filter(Boolean)
    .join(' ')

  return (
    <li className={itemClass}>
      {isOrdered ? (
        <span className={orderClass} aria-hidden="true">
          {index !== undefined ? getOrderLabel(index, level) : ''}
        </span>
      ) : (
        <span className={bulletClass} aria-hidden="true" />
      )}
      <div className={styles.itemBody}>{children}</div>
    </li>
  )
}

/* ─── DocsGroup ─────────────────────────────────── */

type BadgeKind = 'required' | 'optional' | 'default'

interface GroupProps {
  /** Header title (monospace-style label) */
  title: ReactNode
  /** Optional muted descriptor shown on the right of the header */
  description?: ReactNode
  /** Optional header icon (16×16 SVG element) */
  icon?: ReactNode
  children: ReactNode
}

export function DocsGroup({ title, description, icon, children }: GroupProps) {
  return (
    <div
      className={styles.group}
      role="region"
      aria-label={typeof title === 'string' ? title : undefined}
    >
      <div className={styles.groupHeader}>
        {icon && (
          <span className={styles.groupIcon} aria-hidden="true">
            {icon}
          </span>
        )}
        <h3 className={styles.groupTitle}>{title}</h3>
        {description && <span className={styles.groupDesc}>{description}</span>}
      </div>
      <div className={styles.groupBody}>{children}</div>
    </div>
  )
}

/* ─── DocsGroupRow ──────────────────────────────── */

interface GroupRowProps {
  /** The key / field name (rendered monospace) */
  keyLabel: string
  /** Badge variant: 'required', 'optional', or 'default' */
  badge?: BadgeKind
  children: ReactNode
}

const BADGE_CLASS: Record<BadgeKind, string> = {
  required: styles.badgeRequired,
  optional: styles.badgeOptional,
  default: styles.badgeDefault,
}

export function DocsGroupRow({ keyLabel, badge, children }: GroupRowProps) {
  const bracketMatch = keyLabel.match(/^(.*?)(?:\s*\[(.*?)\])$/)
  const titleText = bracketMatch ? bracketMatch[1].trim() : keyLabel
  const tagText = bracketMatch ? bracketMatch[2].trim() : null

  return (
    <div className={styles.row}>
      <span className={styles.rowKey}>
        <span className={styles.rowKeyTitle}>{titleText}</span>
        {tagText && <span className={styles.rowKeyTag}>{tagText}</span>}
      </span>
      <span className={styles.rowVal}>{children}</span>
      {badge && <span className={`${styles.rowBadge} ${BADGE_CLASS[badge]}`}>{badge}</span>}
    </div>
  )
}
