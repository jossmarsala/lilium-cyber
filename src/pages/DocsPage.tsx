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
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { SidebarLeft01Icon } from '@hugeicons/core-free-icons'
import docs from '@/data/docs'
import DocsSidebar from '@/components/DocsSidebar'
import DocsContent from '@/components/DocsContent'
import SEO from '@/components/SEO'
import styles from './DocsPage.module.css'

export default function DocsPage() {
  const { sectionId, subSectionId } = useParams<{
    sectionId?: string
    subSectionId?: string
  }>()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  // Support aliases: /docs/components or /docs/component-showcase -> /docs/showcase
  const resolvedSectionId =
    sectionId === 'components' || sectionId === 'component-showcase' ? 'showcase' : sectionId

  const activeSection =
    docs.find((s) => s.id === resolvedSectionId || s.id === sectionId) ?? docs[0]
  const activeSubSection = subSectionId
    ? activeSection?.subsections.find((ss) => ss.id === subSectionId)
    : undefined

  // Auto-close mobile drawer when route changes
  useEffect(() => {
    setIsMobileOpen(false)
  }, [location.pathname])

  // Close mobile drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

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

  const currentDisplayTitle = activeSubSection
    ? activeSubSection.title
    : (activeSection?.title ?? 'Documentación')

  const docTitle = activeSubSection
    ? `${activeSubSection.title} — ${activeSection?.title ?? 'Playbook'}`
    : `${activeSection?.title ?? 'Documentación'} — Playbook`

  const firstParagraph = activeSubSection?.blocks?.find(
    (b) => b.type === 'paragraph' && 'text' in b
  ) as { text?: string } | undefined

  const rawDescription =
    firstParagraph?.text ||
    activeSubSection?.content ||
    activeSection?.overview ||
    'Documentación prescriptiva del playbook de ciberseguridad e infraestructura Lilium.'

  const docDescription = rawDescription
    .replace(/[*_#`[\]]/g, '')
    .slice(0, 160)
    .trim()

  const breadcrumbsList = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Inicio',
      item: 'https://lilium-playbook.com/',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Playbook',
      item: 'https://lilium-playbook.com/docs',
    },
  ]

  if (activeSection) {
    breadcrumbsList.push({
      '@type': 'ListItem',
      position: 3,
      name: activeSection.title,
      item: `https://lilium-playbook.com/docs/${activeSection.id}`,
    })
  }

  if (activeSubSection && activeSection) {
    breadcrumbsList.push({
      '@type': 'ListItem',
      position: 4,
      name: activeSubSection.title,
      item: `https://lilium-playbook.com/docs/${activeSection.id}/${activeSubSection.id}`,
    })
  }

  const docJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbsList,
      },
      {
        '@type': 'TechArticle',
        headline: currentDisplayTitle,
        description: docDescription,
        author: {
          '@type': 'Organization',
          name: 'Lilium Playbook',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Lilium',
        },
      },
    ],
  }

  return (
    <div className={styles.layout}>
      <SEO
        title={docTitle}
        description={docDescription}
        keywords={`${currentDisplayTitle}, ${activeSection?.title || ''}, playbook ciberseguridad, lilium docs, arquitectura segura`}
        ogType="article"
        jsonLd={docJsonLd}
      />
      {/* Mobile drawer backdrop */}
      <div
        className={`${styles.backdrop} ${isMobileOpen ? styles.backdropActive : ''}`}
        onClick={() => setIsMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile sticky subheader bar with index toggle */}
      <div className={styles.mobileNav}>
        <button
          type="button"
          className={styles.mobileNavToggle}
          onClick={() => setIsMobileOpen((prev) => !prev)}
          aria-expanded={isMobileOpen}
          aria-label="Abrir índice de la documentación"
        >
          <div className={styles.mobileNavIconWrap}>
            <HugeiconsIcon
              icon={SidebarLeft01Icon as IconSvgElement}
              size={16}
              strokeWidth={2}
              aria-hidden="true"
            />
          </div>
          <span className={styles.mobileNavLabel}>Índice</span>
          <span className={styles.mobileNavDivider} aria-hidden="true" />
          <span className={styles.mobileNavCurrent} title={currentDisplayTitle}>
            {currentDisplayTitle}
          </span>
        </button>
      </div>

      <DocsSidebar
        sections={docs}
        activeSectionId={activeSection?.id}
        activeSubSectionId={activeSubSection?.id}
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />
      <DocsContent section={activeSection} subSection={activeSubSection} />
    </div>
  )
}
