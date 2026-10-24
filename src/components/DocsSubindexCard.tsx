import { Link } from 'react-router-dom'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { ArrowRight01Icon } from '@hugeicons/core-free-icons'
import type { DocSubSection } from '@/data/docs'
import { resolveDocIcon } from '@/utils/docIcons'
import styles from './DocsSubindexCard.module.css'

export interface DocsSubindexCardProps {
  sectionId: string
  subSection: DocSubSection
  index: number
  className?: string
  onClick?: () => void
}

export default function DocsSubindexCard({
  sectionId,
  subSection,
  index,
  className = '',
  onClick,
}: DocsSubindexCardProps) {
  const iconSvg = resolveDocIcon(subSection.icon, subSection.id)
  const formattedIndex = String(index).padStart(2, '0')
  const title = subSection.displayTitle || subSection.title
  const description = subSection.description

  return (
    <Link
      to={`/docs/${sectionId}/${subSection.id}`}
      onClick={onClick}
      className={`${styles.card} ${className}`}
      aria-label={`${formattedIndex}. ${title}`}
    >
      <div className={styles.leftCluster}>
        <div className={styles.iconWrapper} aria-hidden="true">
          <HugeiconsIcon icon={iconSvg} size={18} strokeWidth={1.8} />
        </div>
        <div className={styles.textCluster}>
          <div className={styles.titleRow}>
            <span className={styles.title}>{title}</span>
          </div>
          {description && <p className={styles.description}>{description}</p>}
        </div>
      </div>

      <span className={styles.arrow} aria-hidden="true">
        <HugeiconsIcon icon={ArrowRight01Icon as IconSvgElement} size={15} strokeWidth={2} />
      </span>
    </Link>
  )
}
