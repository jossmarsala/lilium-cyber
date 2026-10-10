import { useParams } from 'react-router-dom'
import docsData from '@/data/docs'
import { getDocNavigation, type DocNavItem } from '@/utils/docsNav'
import DocsNextButton from './DocsNextButton'
import styles from './DocsPagination.module.css'

export interface DocsPaginationProps {
  sectionId?: string
  subSectionId?: string
  prev?: Partial<DocNavItem> | null
  next?: Partial<DocNavItem> | null
  className?: string
}

export default function DocsPagination({
  sectionId,
  subSectionId,
  prev,
  next,
  className = '',
}: DocsPaginationProps) {
  const routeParams = useParams<{ sectionId?: string; subSectionId?: string }>()
  const effSectionId = sectionId ?? routeParams.sectionId
  const effSubSectionId = subSectionId ?? routeParams.subSectionId

  const nav = effSectionId ? getDocNavigation(docsData, effSectionId, effSubSectionId) : null

  const resolvedPrev = prev !== undefined ? prev : nav?.prev
  const resolvedNext = next !== undefined ? next : nav?.next

  // If neither previous nor next exists, nothing to paginate
  if (!resolvedPrev && !resolvedNext) {
    return null
  }

  const hasPrev = Boolean(resolvedPrev?.path && resolvedPrev?.title)
  const hasNext = Boolean(resolvedNext?.path && resolvedNext?.title)

  const gridClass = !hasPrev ? styles.gridOnlyNext : !hasNext ? styles.gridOnlyPrev : styles.grid

  return (
    <nav className={`${styles.container} ${className}`} aria-label="Paginación de documentación">
      <div className={gridClass}>
        {hasPrev && (
          <div className={`${styles.slot} ${styles.slotPrev}`}>
            <DocsNextButton
              direction="prev"
              variant="card"
              to={resolvedPrev!.path}
              title={resolvedPrev!.title}
              sectionTitle={resolvedPrev!.sectionTitle}
              icon={resolvedPrev!.icon}
              label="Anterior"
            />
          </div>
        )}

        {hasNext && (
          <div className={`${styles.slot} ${styles.slotNext}`}>
            <DocsNextButton
              direction="next"
              variant="card"
              to={resolvedNext!.path}
              title={resolvedNext!.title}
              sectionTitle={resolvedNext!.sectionTitle}
              icon={resolvedNext!.icon}
              label={
                resolvedNext!.type === 'subsection' ? 'Siguiente subíndice' : 'Siguiente sección'
              }
            />
          </div>
        )}
      </div>
    </nav>
  )
}
