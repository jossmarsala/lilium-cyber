/**
 * Top navigation bar.
 * Brand: "lilium" in Arial Black, "playbook" in Arial Regular.
 * Navigation: RubberSegment component from React Bits.
 * Styled as a fully white, round-shaped floating navbar with icons for Playbook and Labs.
 */
import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { BookOpen01Icon, FlaskConicalIcon } from '@hugeicons/core-free-icons'
import LiliumIcon from './LiliumIcon'
import RubberSegment, { type RubberSegmentItem } from './RubberSegment'
import { DOCS_SCROLL_PROGRESS_EVENT, type DocsScrollProgressDetail } from './DocsContent'
import styles from './NavBar.module.css'

const NAV_ITEMS: RubberSegmentItem[] = [
  {
    value: 'Playbook',
    label: 'Playbook',
    icon: (
      <HugeiconsIcon
        icon={BookOpen01Icon as IconSvgElement}
        size={15}
        strokeWidth={1.8}
        aria-hidden="true"
      />
    ),
  },
  {
    value: 'Labs',
    label: 'Labs',
    icon: (
      <HugeiconsIcon
        icon={FlaskConicalIcon as IconSvgElement}
        size={15}
        strokeWidth={1.8}
        aria-hidden="true"
      />
    ),
  },
]

export default function NavBar() {
  const location = useLocation()
  const navigate = useNavigate()

  const isHome = location.pathname === '/'
  const isDocs = location.pathname.startsWith('/docs')
  const isLabs = location.pathname.startsWith('/labs')
  const activeValue = isHome ? 'both' : isDocs ? 'Playbook' : isLabs ? 'Labs' : 'both'

  const [activeSection, setActiveSection] = useState<'home' | 'about' | 'contact'>('home')

  useEffect(() => {
    if (!isHome) return

    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight

      // Check if user is scrolled near bottom of page
      if (scrollY + windowHeight >= docHeight - 80) {
        setActiveSection('contact')
        return
      }

      // Check if Contact (Footer) section has scrolled into focus
      const contactEl = document.getElementById('contact')
      if (contactEl) {
        const contactRect = contactEl.getBoundingClientRect()
        if (contactRect.top <= windowHeight * 0.45) {
          setActiveSection('contact')
          return
        }
      }

      // Check if About (BentoGrid) section has scrolled into focus
      const aboutEl = document.getElementById('about')
      if (aboutEl) {
        const aboutRect = aboutEl.getBoundingClientRect()
        if (aboutRect.top <= windowHeight * 0.45) {
          setActiveSection('about')
          return
        }
      }

      setActiveSection('home')
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isHome, location.hash])

  // Subindex detection in docs: /docs/:sectionId/:subSectionId
  const pathSegments = location.pathname.split('/').filter(Boolean)
  const isReadingSubIndex = isDocs && pathSegments.length >= 3

  const [docProgress, setDocProgress] = useState(0)
  const [isDocScrolling, setIsDocScrolling] = useState(false)
  const scrollIdleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!isDocs) return

    const handleDocsProgress = (e: Event) => {
      const detail = (e as CustomEvent<DocsScrollProgressDetail>).detail
      if (!detail) return

      setDocProgress(detail.progress)

      if (detail.scrollTop > 8) {
        setIsDocScrolling(true)
        if (scrollIdleTimeoutRef.current) {
          clearTimeout(scrollIdleTimeoutRef.current)
        }
        scrollIdleTimeoutRef.current = setTimeout(() => {
          setIsDocScrolling(false)
        }, 1400)
      } else {
        setIsDocScrolling(false)
      }
    }

    window.addEventListener(DOCS_SCROLL_PROGRESS_EVENT, handleDocsProgress)

    // Direct fallback capturing listener for the docs scroll container
    const handleCaptureScroll = (e: Event) => {
      const target = e.target as HTMLElement | null
      if (target && target.id === 'docs-scroll-container') {
        const scrollTop = target.scrollTop
        const maxScroll = target.scrollHeight - target.clientHeight
        const progress = maxScroll > 0 ? Math.min(Math.max(scrollTop / maxScroll, 0), 1) : 0
        setDocProgress(progress)

        if (scrollTop > 8) {
          setIsDocScrolling(true)
          if (scrollIdleTimeoutRef.current) {
            clearTimeout(scrollIdleTimeoutRef.current)
          }
          scrollIdleTimeoutRef.current = setTimeout(() => {
            setIsDocScrolling(false)
          }, 1400)
        } else {
          setIsDocScrolling(false)
        }
      }
    }

    window.addEventListener('scroll', handleCaptureScroll, { capture: true, passive: true })

    return () => {
      window.removeEventListener(DOCS_SCROLL_PROGRESS_EVENT, handleDocsProgress)
      window.removeEventListener('scroll', handleCaptureScroll, { capture: true })
      if (scrollIdleTimeoutRef.current) {
        clearTimeout(scrollIdleTimeoutRef.current)
      }
      setDocProgress(0)
      setIsDocScrolling(false)
    }
  }, [isDocs, location.pathname])

  const effectiveProgress = isReadingSubIndex ? docProgress : 0
  const effectiveScrolling = isReadingSubIndex ? isDocScrolling : false
  const showProgressBar = isReadingSubIndex && effectiveProgress > 0.002

  const handleChange = (value: string) => {
    if (value === 'Playbook') {
      navigate('/docs')
    } else if (value === 'Labs') {
      navigate('/labs')
    }
  }

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHome) {
      e.preventDefault()
      if (window.location.hash) {
        window.history.pushState(null, '', '/')
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
      setActiveSection('home')
    }
  }

  const handleSectionClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: 'about' | 'contact'
  ) => {
    if (isHome) {
      e.preventDefault()
      const element = document.getElementById(sectionId)
      if (element) {
        window.history.pushState(null, '', `#${sectionId}`)
        element.scrollIntoView({ behavior: 'smooth' })
        setActiveSection(sectionId)
      }
    }
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link
          to="/"
          onClick={handleHomeClick}
          className={styles.brandContainer}
          aria-label="Lilium Playbook"
        >
          <div className={styles.brand}>
            <LiliumIcon size={20} className={styles.brandIcon} alt="Lilium logo" />
            <span className={styles.brandText}>
              <span className={styles.brandName}>lilium</span>
            </span>
          </div>
        </Link>

        <div className={styles.middleLinks}>
          <Link
            to="/"
            onClick={handleHomeClick}
            className={`${styles.middleLink} ${isHome && activeSection === 'home' ? styles.active : ''}`}
          >
            Inicio
          </Link>
          <Link
            to="/#about"
            onClick={(e) => handleSectionClick(e, 'about')}
            className={`${styles.middleLink} ${isHome && activeSection === 'about' ? styles.active : ''}`}
          >
            Sobre lilium
          </Link>
          <Link
            to="/#contact"
            onClick={(e) => handleSectionClick(e, 'contact')}
            className={`${styles.middleLink} ${isHome && activeSection === 'contact' ? styles.active : ''}`}
          >
            Contacto
          </Link>
        </div>

        <div className={styles.segmentContainer}>
          <RubberSegment
            items={NAV_ITEMS}
            value={activeValue}
            onChange={handleChange}
            trackColor="#f0f0f0"
            thumbColor="#111111"
            textColor="#555555"
            activeTextColor="#ffffff"
            size="md"
            radius={999}
            inset={3}
            equalSlots
            stretch={100}
            squash={3}
            speed={1}
            glide={75}
            draggable
          />
        </div>

        {/* Bottom border fade progress bar for docs subindexes */}
        {isDocs && (
          <div
            className={`${styles.progressBarTrack} ${showProgressBar ? styles.visible : ''} ${
              effectiveScrolling ? styles.scrolling : styles.idle
            }`}
            aria-hidden="true"
          >
            <div
              className={styles.progressBarFill}
              style={{
                transform: `scaleX(${effectiveProgress})`,
              }}
            />
          </div>
        )}
      </nav>
    </header>
  )
}
