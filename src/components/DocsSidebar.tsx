/**
 * DocsSidebar — renders the full docs navigation tree using the BranchedMenu
 * component from React Bits. Sections collapse/expand; subsections appear
 * nested beneath their parent with animated branch lines.
 *
 * Data flows: DocSection[] → BranchedMenuItem[] → BranchedMenu
 * Navigation: BranchedMenu.onSelect → react-router useNavigate
 *
 * Supports a folded rail mode (desktop only): click the toggle chevron to
 * collapse the sidebar to a narrow strip showing only module numbers + icons.
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { ToolsIcon, Book02Icon, Cancel01Icon, SidebarLeft01Icon } from '@hugeicons/core-free-icons'
import type { DocSection } from '@/data/docs'
import BranchedMenu, { type BranchedMenuItem } from './BranchedMenu'
import { resolveDocIcon } from '@/utils/docIcons'
import styles from './DocsSidebar.module.css'

interface Props {
  sections: DocSection[]
  activeSectionId?: string
  activeSubSectionId?: string
  activeSubSubSectionId?: string
  isOpen?: boolean
  onClose?: () => void
  onFoldChange?: (folded: boolean) => void
}

const SUBSECTION_CHAR_LIMIT = 48

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
 *   - sub-subsection leaf → "<sectionId>/<subSectionId>/<subSubSectionId>"
 *   - subsection leaf     → "<sectionId>/<subSectionId>"
 *   - section-only        → "<sectionId>"  (no children case)
 */
function toMenuItems(sections: DocSection[]): BranchedMenuItem[] {
  return sections.map((section) => {
    if (section.subsections.length > 0) {
      const isSingleSub =
        section.id === '00-introduccion' ||
        (section.subsections.length === 1 && (!section.blocks || section.blocks.length === 0))

      const redirectTo = isSingleSub ? `${section.id}/${section.subsections[0].id}` : undefined

      return {
        label: section.title,
        value: section.id,
        redirectTo,
        children: section.subsections.map((sub) => {
          const icon = resolveDocIcon(sub.icon, sub.id)

          const subChildren =
            sub.subsections && sub.subsections.length > 0
              ? sub.subsections.map((subsub) => ({
                  value: `${section.id}/${sub.id}/${subsub.id}`,
                  label: truncateTitle(subsub.title),
                  icon: resolveDocIcon(subsub.icon, subsub.id),
                }))
              : undefined

          return {
            value: `${section.id}/${sub.id}`,
            label: truncateTitle(sub.title),
            icon,
            children: subChildren,
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

export default function DocsSidebar({
  sections,
  activeSectionId,
  activeSubSectionId,
  activeSubSubSectionId,
  isOpen = false,
  onClose,
  onFoldChange,
}: Props) {
  const navigate = useNavigate()

  // Track mobile viewport for responsive row height, font, and drawer width
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    setIsMobile(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Desktop-only folded rail state — persisted in sessionStorage
  const [isFolded, setIsFolded] = useState(() => {
    if (typeof window === 'undefined') return false
    return sessionStorage.getItem('sidebar-folded') === 'true'
  })

  const toggleFolded = () => {
    setIsFolded((prev) => {
      const next = !prev
      sessionStorage.setItem('sidebar-folded', String(next))
      onFoldChange?.(next)
      return next
    })
  }

  // Notify parent of initial fold state on mount
  useEffect(() => {
    if (isFolded) onFoldChange?.(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const isShowcaseActive =
    activeSectionId === 'showcase' ||
    activeSectionId === 'components' ||
    activeSectionId === 'component-showcase'

  // Filter hidden sections unless currently viewing that section
  const visibleSections = sections.filter(
    (s) =>
      !s.hidden ||
      s.id === activeSectionId ||
      ((s.id === 'showcase' || s.id === 'components') && isShowcaseActive)
  )

  const items = toMenuItems(visibleSections)

  /** Which section index should be open on first render */
  const activeSectionIndex = visibleSections.findIndex((s) => s.id === activeSectionId)
  const defaultOpen = activeSectionIndex >= 0 ? activeSectionIndex : 0

  /**
   * The currently active value mirrors the routing value format:
   *   - "<sectionId>/<subSectionId>/<subSubSectionId>" when a sub-subsection is active
   *   - "<sectionId>/<subSectionId>"                   when a subsection is active
   *   - "<sectionId>"                                  when only the section root is active
   */
  const defaultActive = activeSubSubSectionId
    ? `${activeSectionId}/${activeSubSectionId}/${activeSubSubSectionId}`
    : activeSubSectionId
      ? `${activeSectionId}/${activeSubSectionId}`
      : (activeSectionId ?? '')

  const handleSelect = (value: string) => {
    onClose?.()

    // If selecting a section that should redirect to its first subsection directly
    const section = sections.find((s) => s.id === value)
    if (
      section &&
      (section.id === '00-introduccion' ||
        (section.subsections.length === 1 && (!section.blocks || section.blocks.length === 0))) &&
      section.subsections[0]
    ) {
      navigate(`/docs/${section.id}/${section.subsections[0].id}`)
      return
    }

    // value is either "sectionId/subSectionId" or plain "sectionId"
    navigate(`/docs/${value}`)
  }

  const handleFooterClick = () => {
    onClose?.()
    navigate(isShowcaseActive ? '/docs/layer-1' : '/docs/showcase')
  }

  return (
    <aside
      className={`${styles.sidebar} ${isOpen ? styles.open : ''} ${!isMobile && isFolded ? styles.folded : ''}`}
      aria-label="Documentation navigation"
    >
      {/* Mobile drawer header with close button */}
      <div className={styles.mobileHeader}>
        <div className={styles.mobileHeaderBrand}>
          <HugeiconsIcon
            icon={Book02Icon as IconSvgElement}
            size={18}
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <span className={styles.mobileHeaderTitle}>Documentación</span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className={styles.closeButton}
          aria-label="Cerrar índice de documentación"
        >
          <HugeiconsIcon
            icon={Cancel01Icon as IconSvgElement}
            size={18}
            strokeWidth={2}
            aria-hidden="true"
          />
        </button>
      </div>

      {/* Up and bottom gradient borders that blend seamlessly */}
      <div className={styles.topBorder} aria-hidden="true" />
      <div className={styles.bottomBorder} aria-hidden="true" />
      <div className={styles.rightBorder} aria-hidden="true" />

      {/* Top and bottom subtle gradient fades for scrolling list */}
      <div className={styles.topFade} aria-hidden="true" />
      <div className={styles.bottomFade} aria-hidden="true" />

      {/* Desktop fold toggle button */}
      {!isMobile && (
        <button
          type="button"
          className={styles.foldToggle}
          onClick={toggleFolded}
          aria-label={isFolded ? 'Expandir índice' : 'Contraer índice'}
          title={isFolded ? 'Expandir índice' : 'Contraer índice'}
        >
          <HugeiconsIcon
            icon={SidebarLeft01Icon as IconSvgElement}
            size={14}
            strokeWidth={1.9}
            aria-hidden="true"
          />
        </button>
      )}

      <div className={styles.scrollArea}>
        <BranchedMenu
          items={items}
          defaultOpen={defaultOpen}
          defaultActive={defaultActive}
          active={defaultActive}
          onSelect={handleSelect}
          color="#1a1a1a"
          accentColor="#000"
          lineColor="rgba(0, 0, 0, 0.09)"
          width={isMobile ? '100%' : isFolded ? '100%' : 280}
          rowHeight={isMobile ? 42 : 34}
          indent={isMobile ? 38 : 36}
          trunk={12}
          radius={8}
          lineWidth={1.25}
          fontSize={isMobile ? 14 : 13}
          drawDuration={400}
          foldDuration={280}
          folded={!isMobile && isFolded}
        />
      </div>

      {/* Discreet footer button for hidden Component Showcase */}
      <div className={styles.sidebarFooter}>
        <button
          type="button"
          onClick={handleFooterClick}
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
            {!isFolded && (
              <span className={styles.footerLabel}>
                {isShowcaseActive ? 'Volver al Playbook' : 'Component Showcase'}
              </span>
            )}
          </div>
          {!isFolded && (
            <span className={styles.footerBadge}>{isShowcaseActive ? 'activo' : 'oculto'}</span>
          )}
        </button>
      </div>
    </aside>
  )
}
