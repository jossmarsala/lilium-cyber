/**
 * DocsSidebar — renders the full docs navigation tree using the BranchedMenu
 * component from React Bits. Sections collapse/expand; subsections appear
 * nested beneath their parent with animated branch lines.
 *
 * Data flows: DocSection[] → BranchedMenuItem[] → BranchedMenu
 * Navigation: BranchedMenu.onSelect → react-router useNavigate
 */
import { useNavigate } from 'react-router-dom'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { ToolsIcon, Book02Icon } from '@hugeicons/core-free-icons'
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

  const isShowcaseActive =
    activeSectionId === 'showcase' ||
    activeSectionId === 'components' ||
    activeSectionId === 'component-showcase'

  // Filter hidden sections unless currently viewing that section
  const visibleSections = sections.filter(
    (s) =>
      !s.hidden ||
      s.id === activeSectionId ||
      ((s.id === 'showcase' || s.id === 'components') && isShowcaseActive),
  )

  const items = toMenuItems(visibleSections)

  /** Which section index should be open on first render */
  const activeSectionIndex = visibleSections.findIndex((s) => s.id === activeSectionId)
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

      {/* Discreet footer button for hidden Component Showcase */}
      <div className={styles.sidebarFooter}>
        <button
          type="button"
          onClick={() => navigate(isShowcaseActive ? '/docs/layer-1' : '/docs/showcase')}
          className={`${styles.footerButton} ${isShowcaseActive ? styles.footerButtonActive : ''}`}
          title={
            isShowcaseActive
              ? 'Volver a la documentación'
              : 'Explorar Component Showcase (sección oculta)'
          }
        >
          <div className={styles.footerButtonLeft}>
            <HugeiconsIcon
              icon={(isShowcaseActive ? Book02Icon : ToolsIcon) as IconSvgElement}
              size={14}
              strokeWidth={1.8}
              aria-hidden="true"
            />
            <span className={styles.footerLabel}>
              {isShowcaseActive ? 'Volver al Playbook' : 'Component Showcase'}
            </span>
          </div>
          <span className={styles.footerBadge}>
            {isShowcaseActive ? 'activo' : 'oculto'}
          </span>
        </button>
      </div>
    </aside>
  )
}
