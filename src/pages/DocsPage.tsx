/**
 * DocsPage — dynamic documentation browser.
 *
 * Structure is driven entirely by `src/data/docs.ts`.
 * To add a new section or subsection, edit that file — no changes needed here.
 *
 * URL scheme:
 *   /docs                          → overview (first section)
 *   /docs/:sectionId               → section overview
 *   /docs/:sectionId/:subSectionId → subsection content
 */
import { useParams, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import docs from '@/data/docs'
import DocsSidebar from '@/components/DocsSidebar'
import DocsContent from '@/components/DocsContent'
import styles from './DocsPage.module.css'

export default function DocsPage() {
  const { sectionId, subSectionId } = useParams<{
    sectionId?: string
    subSectionId?: string
  }>()
  const navigate = useNavigate()

  // Default to first section when arriving at /docs with no params
  useEffect(() => {
    if (!sectionId && docs.length > 0) {
      navigate(`/docs/${docs[0].id}`, { replace: true })
    }
  }, [sectionId, navigate])

  // Support aliases: /docs/components or /docs/component-showcase -> /docs/showcase
  const resolvedSectionId =
    sectionId === 'components' || sectionId === 'component-showcase' ? 'showcase' : sectionId

  const activeSection =
    docs.find((s) => s.id === resolvedSectionId || s.id === sectionId) ?? docs[0]
  const activeSubSection = subSectionId
    ? activeSection?.subsections.find((ss) => ss.id === subSectionId)
    : undefined

  return (
    <div className={styles.layout}>
      <DocsSidebar
        sections={docs}
        activeSectionId={activeSection?.id}
        activeSubSectionId={activeSubSection?.id}
      />
      <DocsContent section={activeSection} subSection={activeSubSection} />
    </div>
  )
}
