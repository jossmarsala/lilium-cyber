/**
 * DocsSidebar — renders the full docs navigation tree using the BranchedMenu
 * component from React Bits. Sections collapse/expand; subsections appear
 * nested beneath their parent with animated branch lines.
 *
 * Data flows: DocSection[] → BranchedMenuItem[] → BranchedMenu
 * Navigation: BranchedMenu.onSelect → react-router useNavigate
 */
import { useNavigate } from 'react-router-dom'
import type { DocSection } from '@/data/docs'
import BranchedMenu, { type BranchedMenuItem } from './BranchedMenu'
import { resolveDocIcon } from '@/utils/docIcons'
import styles from './DocsSidebar.module.css'

interface Props {
  sections: DocSection[]
  activeSectionId?: string
  activeSubSectionId?: string
}

const SUBSECTION_CHAR_LIMIT = 26

/**
 * Truncates subsection titles that exceed the character limit and appends "..."
 */
function truncateTitle(title: string, limit = SUBSECTION_CHAR_LIMIT): string {
  if (title.length <= limit) return title
  return `${title.slice(0, limit).trimEnd()}...`
}

/**
 * Map the app's DocSection[] into the shape BranchedMenu expects.
 *
 * Routing values:
 *   - subsection leaf  → "<sectionId>/<subSectionId>"
 *   - section-only     → "<sectionId>"  (no children case)
 */
function toMenuItems(sections: DocSection[]): BranchedMenuItem[] {
  return sections.map((section) => {
    if (section.subsections.length > 0) {
      return {
        label: section.title,
        children: section.subsections.map((sub) => {
          const icon = resolveDocIcon(sub.icon, sub.id)

          return {
            value: `${section.id}/${sub.id}`,
            label: truncateTitle(sub.title),
            icon,
          }
        }),
      }
    }
    // Section with no subsections acts as a leaf
    return {
      label: section.title,
      value: section.id,
      icon: section.icon ? resolveDocIcon(section.icon, section.id) : undefined,
    }
  })
}

export default function DocsSidebar({ sections, activeSectionId, activeSubSectionId }: Props) {
  const navigate = useNavigate()

  const items = toMenuItems(sections)

  /** Which section index should be open on first render */
  const activeSectionIndex = sections.findIndex((s) => s.id === activeSectionId)
  const defaultOpen = activeSectionIndex >= 0 ? activeSectionIndex : 0

  /**
   * The currently active value mirrors the routing value format:
   *   - "<sectionId>/<subSectionId>" when a subsection is active
   *   - "<sectionId>"                when only the section root is active
   */
  const defaultActive = activeSubSectionId
    ? `${activeSectionId}/${activeSubSectionId}`
    : (activeSectionId ?? '')

  const handleSelect = (value: string) => {
    // value is either "sectionId/subSectionId" or plain "sectionId"
    navigate(`/docs/${value}`)
  }

  return (
    <aside className={styles.sidebar} aria-label="Documentation navigation">
      {/* Up and bottom gradient borders that blend seamlessly */}
      <div className={styles.topBorder} aria-hidden="true" />
      <div className={styles.bottomBorder} aria-hidden="true" />
      <div className={styles.rightBorder} aria-hidden="true" />

      {/* Top and bottom subtle gradient fades for scrolling list */}
      <div className={styles.topFade} aria-hidden="true" />
      <div className={styles.bottomFade} aria-hidden="true" />

      <div className={styles.scrollArea}>
        <BranchedMenu
          items={items}
          defaultOpen={defaultOpen}
          defaultActive={defaultActive}
          onSelect={handleSelect}
          color="#1a1a1a"
          accentColor="#000"
          lineColor="rgba(0, 0, 0, 0.09)"
          width={280}
          rowHeight={34}
          indent={36}
          trunk={12}
          radius={8}
          lineWidth={1.25}
          fontSize={13}
          drawDuration={400}
          foldDuration={280}
        />
      </div>
    </aside>
  )
}
