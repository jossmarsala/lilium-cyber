import type { DocSection, DocSubSection } from '@/data/docs'
import defaultDocs from '@/data/docs'

export interface DocNavItem {
  type: 'section' | 'subsection'
  sectionId: string
  subSectionId?: string
  title: string
  sectionTitle: string
  icon?: string
  path: string
}

/**
 * Flattens the hierarchical documentation structure into a linear reading order:
 * Section Overview -> SubSection 1 -> SubSection 2 -> Next Section Overview -> ...
 */
export function flattenDocs(sections: DocSection[] = defaultDocs): DocNavItem[] {
  const items: DocNavItem[] = []

  for (const section of sections) {
    if (section.hidden) continue

    // Section overview
    items.push({
      type: 'section',
      sectionId: section.id,
      title: section.title,
      sectionTitle: section.title,
      icon: section.icon,
      path: `/docs/${section.id}`,
    })

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
    }
  }

  return items
}

/**
 * Returns previous, next, and current navigation items for the given section & subsection.
 */
export function getDocNavigation(
  sections: DocSection[] = defaultDocs,
  currentSectionId?: string,
  currentSubSectionId?: string
): {
  prev: DocNavItem | null
  next: DocNavItem | null
  current: DocNavItem | null
  subsections: DocSubSection[]
} {
  const flat = flattenDocs(sections)

  const currentIndex = flat.findIndex((item) => {
    if (currentSubSectionId) {
      return item.sectionId === currentSectionId && item.subSectionId === currentSubSectionId
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
