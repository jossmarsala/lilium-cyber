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

  // Support aliases: /docs/components or /docs/component-showcase -> /docs/showcase
  const resolvedSectionId =
    sectionId === 'components' || sectionId === 'component-showcase' ? 'showcase' : sectionId

  const activeSection =
    docs.find((s) => s.id === resolvedSectionId || s.id === sectionId) ?? docs[0]
  const activeSubSection = subSectionId
    ? activeSection?.subsections.find((ss) => ss.id === subSectionId)
    : undefined

  // Default to first section / subsection when arriving at /docs with no params,
  // or when navigating to an index with no standalone content of its own
  useEffect(() => {
    if (!sectionId && docs.length > 0) {
      const first = docs[0]
      if (
        (first.id === '00-introduccion' ||
          (first.subsections.length === 1 && (!first.blocks || first.blocks.length === 0))) &&
        first.subsections[0]
      ) {
        navigate(`/docs/${first.id}/${first.subsections[0].id}`, { replace: true })
      } else {
        navigate(`/docs/${first.id}`, { replace: true })
      }
    } else if (
      !subSectionId &&
      activeSection &&
      (activeSection.id === '00-introduccion' ||
        (activeSection.subsections.length === 1 &&
          (!activeSection.blocks || activeSection.blocks.length === 0))) &&
      activeSection.subsections[0]
    ) {
      navigate(`/docs/${activeSection.id}/${activeSection.subsections[0].id}`, { replace: true })
    }
  }, [sectionId, subSectionId, activeSection, navigate])

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
