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
import type { ReactNode } from 'react'
import styles from './DocsList.module.css'

/* ─── DocsList ──────────────────────────────────── */

interface ListProps {
  children: ReactNode
}

export function DocsList({ children }: ListProps) {
  return <ul className={styles.list}>{children}</ul>
}

/* ─── DocsListItem ──────────────────────────────── */

interface ListItemProps {
  children: ReactNode
}

export function DocsListItem({ children }: ListItemProps) {
  return (
    <li className={styles.item}>
      <span className={styles.bullet} aria-hidden="true" />
      <span>{children}</span>
    </li>
  )
}

/* ─── DocsGroup ─────────────────────────────────── */

type BadgeKind = 'required' | 'optional' | 'default'

interface GroupProps {
  /** Header title (monospace-style label) */
  title: string
  /** Optional muted descriptor shown on the right of the header */
  description?: string
  /** Optional header icon (16×16 SVG element) */
  icon?: ReactNode
  children: ReactNode
}

export function DocsGroup({ title, description, icon, children }: GroupProps) {
  return (
    <div className={styles.group} role="region" aria-label={title}>
      <div className={styles.groupHeader}>
        {icon && <span className={styles.groupIcon} aria-hidden="true">{icon}</span>}
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
  default:  styles.badgeDefault,
}

export function DocsGroupRow({ keyLabel, badge, children }: GroupRowProps) {
  return (
    <div className={styles.row}>
      <span className={styles.rowKey}>{keyLabel}</span>
      <span className={styles.rowVal}>{children}</span>
      {badge && (
        <span className={`${styles.rowBadge} ${BADGE_CLASS[badge]}`}>
          {badge}
        </span>
      )}
    </div>
  )
}
