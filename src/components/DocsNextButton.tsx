import { Link, useParams } from 'react-router-dom'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { ArrowRight01Icon, ArrowLeft01Icon } from '@hugeicons/core-free-icons'
import docsData from '@/data/docs'
import { getDocNavigation } from '@/utils/docsNav'
import { resolveDocIcon } from '@/utils/docIcons'
import styles from './DocsNextButton.module.css'

export type DocsButtonVariant = 'card' | 'banner' | 'pill' | 'compact'
export type DocsButtonDirection = 'next' | 'prev'

export interface DocsNextButtonProps {
  /** Target link route (e.g. "/docs/layer-1/frameworks-references"). If omitted, resolved automatically */
  to?: string
  /** Destination title (e.g. "Frameworks y Referencias") */
  title?: string
  /** Parent section name (optional) */
  sectionTitle?: string
  /** Custom label (e.g. "Siguiente" or "Anterior") */
  label?: string
  /** Optional excerpt */
  description?: string
  /** Hugeicon name or alias */
  icon?: string
  /** Direction: 'next' (default) or 'prev' */
  direction?: DocsButtonDirection
  /** Visual variant */
  variant?: DocsButtonVariant
  /** Current section ID for auto-calculation */
  currentSectionId?: string
  /** Current subsection ID for auto-calculation */
  currentSubSectionId?: string
  className?: string
  onClick?: () => void
}

export default function DocsNextButton({
  to,
  title,
  label,
  icon,
  direction = 'next',
  variant = 'card',
  currentSectionId,
  currentSubSectionId,
  className = '',
  onClick,
}: DocsNextButtonProps) {
  const routeParams = useParams<{ sectionId?: string; subSectionId?: string }>()
  const effSectionId = currentSectionId ?? routeParams.sectionId
  const effSubSectionId = currentSubSectionId ?? routeParams.subSectionId

  // Auto-resolve target if not explicitly passed
  let resolvedTo = to
  let resolvedTitle = title
  let resolvedIcon = icon

  if (!resolvedTo && effSectionId) {
    const nav = getDocNavigation(docsData, effSectionId, effSubSectionId)
    const targetItem = direction === 'next' ? nav.next : nav.prev
    if (targetItem) {
      resolvedTo = targetItem.path
      resolvedTitle = targetItem.title
      resolvedIcon = targetItem.icon
    }
  }

  if (!resolvedTo || !resolvedTitle) {
    return null
  }

  const defaultCaption = direction === 'next' ? 'Siguiente' : 'Anterior'
  const caption = label ?? defaultCaption
  const ArrowIcon = direction === 'next' ? ArrowRight01Icon : ArrowLeft01Icon
  const ResolvedIcon = resolvedIcon ? resolveDocIcon(resolvedIcon, resolvedTo) : undefined

  // ── VARIANT: PILL ──
  if (variant === 'pill') {
    return (
      <Link
        to={resolvedTo}
        onClick={onClick}
        className={`${styles.button} ${styles.variant_pill} ${
          direction === 'prev' ? styles.direction_prev : styles.direction_next
        } ${className}`}
        aria-label={`${caption}: ${resolvedTitle}`}
      >
        {direction === 'prev' && (
          <span className={styles.arrow} aria-hidden="true">
            <HugeiconsIcon icon={ArrowLeft01Icon as IconSvgElement} size={14} strokeWidth={2} />
          </span>
        )}
        {ResolvedIcon && (
          <HugeiconsIcon icon={ResolvedIcon} size={13} strokeWidth={1.8} aria-hidden="true" />
        )}
        <span className={styles.pillText}>{resolvedTitle}</span>
        {direction === 'next' && (
          <span className={styles.arrow} aria-hidden="true">
            <HugeiconsIcon icon={ArrowRight01Icon as IconSvgElement} size={14} strokeWidth={2} />
          </span>
        )}
      </Link>
    )
  }

  // ── VARIANT: COMPACT ──
  if (variant === 'compact') {
    return (
      <Link
        to={resolvedTo}
        onClick={onClick}
        className={`${styles.button} ${styles.variant_compact} ${
          direction === 'prev' ? styles.direction_prev : styles.direction_next
        } ${className}`}
        aria-label={`${caption}: ${resolvedTitle}`}
      >
        {direction === 'prev' && (
          <span className={styles.arrow} aria-hidden="true">
            <HugeiconsIcon icon={ArrowLeft01Icon as IconSvgElement} size={13} strokeWidth={2} />
          </span>
        )}
        <span>{resolvedTitle}</span>
        {direction === 'next' && (
          <span className={styles.arrow} aria-hidden="true">
            <HugeiconsIcon icon={ArrowRight01Icon as IconSvgElement} size={13} strokeWidth={2} />
          </span>
        )}
      </Link>
    )
  }

  // ── VARIANT: BANNER ──
  if (variant === 'banner') {
    return (
      <Link
        to={resolvedTo}
        onClick={onClick}
        className={`${styles.button} ${styles.variant_banner} ${className}`}
        aria-label={`${caption}: ${resolvedTitle}`}
      >
        <div className={styles.bannerLeft}>
          {ResolvedIcon && (
            <div className={styles.bannerIcon} aria-hidden="true">
              <HugeiconsIcon icon={ResolvedIcon} size={18} strokeWidth={1.8} />
            </div>
          )}
          <div className={styles.bannerContent}>
            <span className={styles.bannerCaption}>{caption}</span>
            <span className={styles.bannerTitle}>{resolvedTitle}</span>
          </div>
        </div>

        <span className={styles.bannerArrow} aria-hidden="true">
          <HugeiconsIcon icon={ArrowRight01Icon as IconSvgElement} size={16} strokeWidth={2} />
        </span>
      </Link>
    )
  }

  // ── VARIANT: CARD (Default pagination button) ──
  return (
    <Link
      to={resolvedTo}
      onClick={onClick}
      className={`${styles.button} ${styles.variant_card} ${
        direction === 'prev' ? styles.direction_prev : styles.direction_next
      } ${className}`}
      aria-label={`${caption}: ${resolvedTitle}`}
    >
      <div className={styles.captionRow}>
        {direction === 'prev' && (
          <span className={styles.arrow} aria-hidden="true">
            <HugeiconsIcon icon={ArrowIcon as IconSvgElement} size={13} strokeWidth={2} />
          </span>
        )}
        <span>{caption}</span>
        {direction === 'next' && (
          <span className={styles.arrow} aria-hidden="true">
            <HugeiconsIcon icon={ArrowIcon as IconSvgElement} size={13} strokeWidth={2} />
          </span>
        )}
      </div>
      <div className={styles.title}>{resolvedTitle}</div>
    </Link>
  )
}
