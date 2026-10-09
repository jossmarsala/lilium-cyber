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
import styles from './DocsCallout.module.css'

export type CalloutVariant = 'note' | 'tip' | 'warning' | 'critical'

interface Props {
  variant?: CalloutVariant
  /** Overrides the default label (e.g. "Breaking Change", "Good to know") */
  label?: string
  children: ReactNode
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
  children,
}: Props) {
  const { defaultLabel, icon } = META[variant]

  return (
    <div className={`${styles.callout} ${styles[variant]}`} role="note">
      <span className={styles.icon} aria-hidden="true">{icon}</span>
      <div className={styles.body}>
        <span className={styles.label}>{label ?? defaultLabel}</span>
        <p className={styles.text}>{children}</p>
      </div>
    </div>
  )
}
