import type { DocSection, DocSubSection } from '@/data/docs'
import defaultDocs from '@/data/docs'

export interface DocNavItem {
  type: 'section' | 'subsection' | 'sub-subsection'
  sectionId: string
  subSectionId?: string
  subSubSectionId?: string
  title: string
  sectionTitle: string
  icon?: string
  path: string
}

/**
 * Flattens the hierarchical documentation structure into a linear reading order:
 * Section Overview -> SubSection 1 -> Sub-subsections -> SubSection 2 -> ...
 */
export function flattenDocs(sections: DocSection[] = defaultDocs): DocNavItem[] {
  const items: DocNavItem[] = []

  for (const section of sections) {
    if (section.hidden) continue

    // Section overview (skipped if section has no standalone overview content and only 1 sub)
    const shouldSkipSectionOverview =
      section.id === '00-introduccion' ||
      (section.subsections.length === 1 && (!section.blocks || section.blocks.length === 0))

    if (!shouldSkipSectionOverview) {
      items.push({
        type: 'section',
        sectionId: section.id,
        title: section.title,
        sectionTitle: section.title,
        icon: section.icon,
        path: `/docs/${section.id}`,
      })
    }

    // Subsections (subindexes)
    for (const sub of section.subsections) {
      if (sub.hidden) continue
      items.push({
        type: 'subsection',
        sectionId: section.id,
        subSectionId: sub.id,
        title: sub.title,
        sectionTitle: section.title,
        icon: sub.icon,
        path: `/docs/${section.id}/${sub.id}`,
      })

      // Sub-subsections
      if (sub.subsections && sub.subsections.length > 0) {
        for (const subsub of sub.subsections) {
          if (subsub.hidden) continue
          items.push({
            type: 'sub-subsection',
            sectionId: section.id,
            subSectionId: sub.id,
            subSubSectionId: subsub.id,
            title: subsub.title,
            sectionTitle: sub.title,
            icon: subsub.icon,
            path: `/docs/${section.id}/${sub.id}/${subsub.id}`,
          })
        }
      }
    }
  }

  return items
}

/**
 * Returns previous, next, and current navigation items for the given section, subsection & sub-subsection.
 */
export function getDocNavigation(
  sections: DocSection[] = defaultDocs,
  currentSectionId?: string,
  currentSubSectionId?: string,
  currentSubSubSectionId?: string
): {
  prev: DocNavItem | null
  next: DocNavItem | null
  current: DocNavItem | null
  subsections: DocSubSection[]
} {
  const flat = flattenDocs(sections)

  const currentIndex = flat.findIndex((item) => {
    if (currentSubSubSectionId) {
      return (
        item.sectionId === currentSectionId &&
        item.subSectionId === currentSubSectionId &&
        item.subSubSectionId === currentSubSubSectionId
      )
    }
    if (currentSubSectionId) {
      return (
        item.sectionId === currentSectionId &&
        item.subSectionId === currentSubSectionId &&
        !item.subSubSectionId
      )
    }
    return item.sectionId === currentSectionId && !item.subSectionId
  })

  const current = currentIndex >= 0 ? flat[currentIndex] : null
  const prev = currentIndex > 0 ? flat[currentIndex - 1] : null
  const next = currentIndex >= 0 && currentIndex < flat.length - 1 ? flat[currentIndex + 1] : null

  const activeSection = sections.find((s) => s.id === currentSectionId)
  const subsections = activeSection ? activeSection.subsections.filter((s) => !s.hidden) : []

  return {
    prev,
    next,
    current,
    subsections,
  }
}
