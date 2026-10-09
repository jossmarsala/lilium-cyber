import React, { type ReactNode, type CSSProperties } from 'react'
import styles from './Pill.module.css'

export type PillVariant = 'dark' | 'light' | 'primary' | 'secondary'
export type PillSize = 'sm' | 'md' | 'lg'

export interface PillProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  variant?: PillVariant
  size?: PillSize
  badge?: ReactNode
  badgeVariant?: 'contrast' | 'accent' | 'subtle'
  badgeClassName?: string
  pointer?: boolean
  dot?: boolean
  dotActive?: boolean
  active?: boolean
  icon?: ReactNode
  className?: string
  style?: CSSProperties
}

export function Pill({
  children,
  variant = 'dark',
  size = 'md',
  badge,
  badgeVariant = 'contrast',
  badgeClassName = '',
  pointer = false,
  dot = false,
  dotActive = false,
  active = false,
  icon,
  className = '',
  style,
  ...restProps
}: PillProps) {
  // Normalize variant aliases
  const resolvedVariant = variant === 'primary' ? 'dark' : variant === 'secondary' ? 'light' : variant

  return (
    <div
      className={`
        ${styles.pill}
        ${styles[resolvedVariant]}
        ${styles[`size_${size}`]}
        ${badge ? styles.hasBadge : ''}
        ${pointer ? styles.hasPointer : ''}
        ${active ? styles.active : ''}
        ${className}
      `.trim()}
      style={style}
      {...restProps}
    >
      {dot && (
        <span
          className={`${styles.dot} ${dotActive ? styles.dotActive : ''}`}
          aria-hidden="true"
        />
      )}

      {icon && (
        <span className={styles.iconWrapper} aria-hidden="true">
          {icon}
        </span>
      )}

      {children && <span className={styles.label}>{children}</span>}

      {badge !== undefined && badge !== null && (
        <span
          className={`${styles.badge} ${styles[`badge_${badgeVariant}`]} ${badgeClassName}`.trim()}
        >
          {badge}
        </span>
      )}
    </div>
  )
}
