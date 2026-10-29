/**
 * LabsPage — Gallery view for interactive cyber-range educational labs.
 *
 * Layout inspired by modern learning platforms (learnformula design pattern):
 * - Row 1: Recommended Labs (prominent cards with ambient cybersecurity visuals,
 *   recommended tags, step metrics and floating play action buttons).
 * - Row 2: All other 4 Labs (responsive 4-column card grid with thumbnail previews,
 *   step overlay pills, play button overlays, category tags and difficulty badges).
 *
 * 100% styled using LILIUM's existing design system tokens and typography.
 */

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import {
  PlayIcon,
  Clock01Icon,
  BookOpen01Icon,
  ArrowRight01Icon,
  Layers01Icon,
  LockKeyIcon,
} from '@hugeicons/core-free-icons'

import { LABS, type LabItem } from '@/data/labsData'
import LabThumbnail from '@/features/labs/LabThumbnail'
import { Pill } from '@/components/Pill'
import SpecularButton from '@/components/SpecularButton'
import Footer from '@/components/Footer'
import SEO from '@/components/SEO'
import styles from './LabsPage.module.css'

export default function LabsPage() {
  const navigate = useNavigate()
  // Static view state for now
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos')
  const [activeModalLab, setActiveModalLab] = useState<LabItem | null>(null)

  // 1st row: 2 Recommended labs
  const recommendedLabs = LABS.slice(0, 2)

  // 2nd row: All 6 labs (including recommended ones)
  const filterTabs = [
    { label: 'Todos' },
    { label: 'Fundamentos' },
    { label: 'Web & APIs' },
    { label: 'Redes & Zero-Trust' },
    { label: 'Respuesta & Crisis' },
  ]

  const filteredLabs =
    selectedCategory === 'Todos'
      ? LABS
      : LABS.filter((lab) => {
          const target = `${lab.category} ${lab.tag} ${lab.title}`.toLowerCase()
          if (selectedCategory === 'Fundamentos')
            return target.includes('fundamento') || target.includes('defensa')
          if (selectedCategory === 'Web & APIs')
            return target.includes('web') || target.includes('api')
          if (selectedCategory === 'Redes & Zero-Trust')
            return target.includes('red') || target.includes('zero-trust')
          if (selectedCategory === 'Respuesta & Crisis')
            return target.includes('respuesta') || target.includes('ransomware')
          return target.includes(selectedCategory.toLowerCase())
        })

  const handleLabClick = (lab: LabItem) => {
    setActiveModalLab(lab)
  }

  return (
    <div className={styles.page}>
      <SEO
        title="Laboratorios Interactivos de Ciberseguridad"
        description="Aprende ciberseguridad resolviendo escenarios reales en entornos Linux simulados directamente en tu navegador, sin instalaciones previas."
        keywords="laboratorios ciberseguridad, cyber range interactivo, hacking etico educativo, simulador linux web, lilium labs, defensa en profundidad"
        ogType="website"
      />
      <div className={styles.contentWrapper}>
        {/* ── Page Header / Introduction ── */}
        <section className={styles.headerSection} aria-label="Introducción de laboratorios">
          <h1 className={styles.headerTitle}>Laboratorios Interactivos</h1>
          <p className={styles.headerSubtitle}>
            Aprende ciberseguridad de forma práctica resolviendo escenarios reales en entornos
            simulados.
          </p>
        </section>

        {/* ── ROW 1: RECOMMENDED LABS (2 Featured Cards) ── */}
        <section className={styles.sectionBlock} aria-labelledby="recommended-heading">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleGroup}>
              <h2 id="recommended-heading" className={styles.sectionTitle}>
                Sugeridos para ti
              </h2>
            </div>
          </div>

          <div className={styles.recommendedGrid}>
            {/* Card 1 (Main Featured Recommended Lab) */}
            {recommendedLabs[0] && (
              <div
                className={styles.featuredCard}
                onClick={() => handleLabClick(recommendedLabs[0])}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleLabClick(recommendedLabs[0])}
                aria-label={`Abrir ${recommendedLabs[0].title}`}
              >
                <div className={styles.featuredCardBg}>
                  <LabThumbnail labId={recommendedLabs[0].id} />
                </div>
                <div className={styles.featuredCardBackdropOverlay} />

                <div className={styles.featuredCardContent}>
                  <div className={styles.featuredTopArea}>
                    <h3 className={styles.featuredTitle}>{recommendedLabs[0].title}</h3>
                    <p className={styles.featuredDesc}>{recommendedLabs[0].description}</p>
                  </div>

                  <div className={styles.featuredBottomRow}>
                    <div className={styles.featuredMetrics}>
                      <Pill variant="dark" size="sm" dot>
                        {recommendedLabs[0].difficulty}
                      </Pill>
                      <span className={styles.featuredDuration}>
                        <HugeiconsIcon
                          icon={Clock01Icon as IconSvgElement}
                          size={13}
                          strokeWidth={1.8}
                        />
                        {recommendedLabs[0].duration}
                      </span>
                    </div>

                    <SpecularButton
                      radius={999}
                      tint="#ffffff"
                      tintOpacity={1}
                      blur={0}
                      textColor="#111111"
                      lineColor="#ffffff"
                      baseColor="#e0e0e0"
                      intensity={1.2}
                      thickness={1.5}
                      className={styles.playSpecularBtnLarge}
                      title="Iniciar laboratorio"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLabClick(recommendedLabs[0])
                      }}
                    >
                      <HugeiconsIcon
                        icon={PlayIcon as IconSvgElement}
                        size={18}
                        strokeWidth={2.4}
                        className={styles.playIconSvg}
                      />
                    </SpecularButton>
                  </div>
                </div>
              </div>
            )}

            {/* Card 2 (Secondary Featured Recommended Lab) */}
            {recommendedLabs[1] && (
              <div
                className={`${styles.featuredCard} ${styles.featuredCardSecondary} ${recommendedLabs[1].available === false ? styles.featuredCardDisabled : ''}`}
                onClick={() => handleLabClick(recommendedLabs[1])}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleLabClick(recommendedLabs[1])}
                aria-label={`Abrir ${recommendedLabs[1].title}`}
              >
                <div className={styles.featuredCardBg}>
                  <LabThumbnail labId={recommendedLabs[1].id} />
                </div>
                <div className={styles.featuredCardBackdropOverlay} />

                {recommendedLabs[1].available === false && (
                  <div className={styles.deactivatedBadge}>
                    <HugeiconsIcon icon={LockKeyIcon as IconSvgElement} size={12} strokeWidth={2} />
                    <span>Próximamente</span>
                  </div>
                )}

                <div className={styles.featuredCardContent}>
                  <div className={styles.featuredTopArea}>
                    <h3 className={styles.featuredTitle}>{recommendedLabs[1].title}</h3>
                    <p className={styles.featuredDesc}>{recommendedLabs[1].description}</p>
                  </div>

                  <div className={styles.featuredBottomRow}>
                    <div className={styles.featuredMetrics}>
                      <Pill variant="dark" size="sm" dot>
                        {recommendedLabs[1].difficulty}
                      </Pill>
                      <span className={styles.featuredDuration}>
                        <HugeiconsIcon
                          icon={Clock01Icon as IconSvgElement}
                          size={13}
                          strokeWidth={1.8}
                        />
                        {recommendedLabs[1].duration}
                      </span>
                    </div>

                    <SpecularButton
                      radius={999}
                      tint="#ffffff"
                      tintOpacity={1}
                      blur={0}
                      textColor="#111111"
                      lineColor="#ffffff"
                      baseColor="#e0e0e0"
                      intensity={1.2}
                      thickness={1.5}
                      className={`${styles.playSpecularBtnLarge} ${recommendedLabs[1].available === false ? styles.playBtnDisabled : ''}`}
                      title={recommendedLabs[1].available === false ? 'No disponible' : 'Iniciar laboratorio'}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleLabClick(recommendedLabs[1])
                      }}
                    >
                      <HugeiconsIcon
                        icon={(recommendedLabs[1].available === false ? LockKeyIcon : PlayIcon) as IconSvgElement}
                        size={18}
                        strokeWidth={2.4}
                        className={recommendedLabs[1].available === false ? undefined : styles.playIconSvg}
                      />
                    </SpecularButton>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── ROW 2: ALL OTHER LABS (4 Labs Grid with filters) ── */}
        <section className={styles.sectionBlock} aria-labelledby="all-labs-heading">
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTitleGroup}>
              <h2 id="all-labs-heading" className={styles.sectionTitle}>
                Todos los laboratorios
              </h2>
            </div>
          </div>

          {/* Filter Toolbar (inspired by All / Courses / Videos / Quizzes in reference) */}
          <div className={styles.filtersToolbar}>
            <div className={styles.filterTabs} role="tablist" aria-label="Filtrar por categoría">
              {filterTabs.map((tab) => {
                const isActive = selectedCategory === tab.label
                return (
                  <button
                    key={tab.label}
                    role="tab"
                    aria-selected={isActive}
                    className={`${styles.filterTabBtn} ${isActive ? styles.filterTabActive : ''}`}
                    onClick={() => setSelectedCategory(tab.label)}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>

            <div className={styles.sortDropdownIndicator}>
              <HugeiconsIcon
                icon={Layers01Icon as IconSvgElement}
                size={14}
                strokeWidth={1.8}
                aria-hidden="true"
              />
              <span>1 activo · 5 en desarrollo</span>
            </div>
          </div>

          {/* 6 Cards Grid (3 columns x 2 rows) */}
          <div className={styles.otherLabsGrid}>
            {filteredLabs.map((lab) => {
              const isDeactivated = lab.available === false
              return (
                <div
                  key={lab.id}
                  className={`${styles.labCard} ${isDeactivated ? styles.labCardDisabled : ''}`}
                  onClick={() => handleLabClick(lab)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleLabClick(lab)}
                  aria-label={`Ver detalles de ${lab.title}`}
                >
                  {/* Thumbnail Preview Area with FaultyTerminal Cover and Play Button */}
                  <div className={styles.labCardMedia}>
                    <div className={styles.thumbnailContainer}>
                      <LabThumbnail labId={lab.id} />
                    </div>

                    {isDeactivated && (
                      <div className={styles.deactivatedBadge}>
                        <HugeiconsIcon icon={LockKeyIcon as IconSvgElement} size={11} strokeWidth={2} />
                        <span>Próximamente</span>
                      </div>
                    )}

                    <div className={styles.mediaPlayBtnContainer}>
                      <SpecularButton
                        size="sm"
                        radius={999}
                        tint="#ffffff"
                        tintOpacity={1}
                        blur={0}
                        textColor="#111111"
                        lineColor="#ffffff"
                        baseColor="#e0e0e0"
                        intensity={1.2}
                        thickness={1.5}
                        className={`${styles.playSpecularBtnSmall} ${isDeactivated ? styles.playBtnDisabled : ''}`}
                        title={isDeactivated ? 'No disponible' : 'Iniciar'}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLabClick(lab)
                        }}
                      >
                        <HugeiconsIcon
                          icon={(isDeactivated ? LockKeyIcon : PlayIcon) as IconSvgElement}
                          size={14}
                          strokeWidth={2.4}
                          className={isDeactivated ? undefined : styles.playIconSvg}
                        />
                      </SpecularButton>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className={styles.labCardBody}>
                    <div className={styles.cardTopInfo}>
                      <h4 className={styles.cardTitle}>{lab.title}</h4>
                      <p className={styles.cardDesc}>{lab.description}</p>
                    </div>

                    <div className={styles.cardFooter}>
                      <span className={styles.metaItem}>
                        <HugeiconsIcon
                          icon={Clock01Icon as IconSvgElement}
                          size={13}
                          strokeWidth={1.8}
                        />
                        {lab.duration}
                      </span>

                      <Pill variant="light" size="sm" dot>
                        {lab.difficulty}
                      </Pill>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      {/* ── Modal / Lab Detail Preview (for static stage) ── */}
      {activeModalLab && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setActiveModalLab(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Pill variant="light" size="sm">
                    {activeModalLab.category}
                  </Pill>
                  {activeModalLab.available === false && (
                    <Pill variant="dark" size="sm" dot>
                      En desarrollo
                    </Pill>
                  )}
                </div>
                <h3
                  style={{
                    fontSize: '1.45rem',
                    fontWeight: 800,
                    margin: '0.65rem 0 0.25rem 0',
                    color: '#111111',
                  }}
                >
                  {activeModalLab.title}
                </h3>
                <span style={{ fontSize: '0.85rem', color: '#666' }}>
                  {activeModalLab.available === false
                    ? 'Próximamente disponible'
                    : `${activeModalLab.totalSteps} pasos interactivos · Estimado ${activeModalLab.duration}`}
                </span>
              </div>
              <button
                className={styles.modalCloseBtn}
                onClick={() => setActiveModalLab(null)}
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            <p style={{ margin: 0, fontSize: '0.925rem', color: '#444', lineHeight: 1.6 }}>
              {activeModalLab.description}
            </p>

            {activeModalLab.available === false ? (
              <div className={styles.deactivatedNotice}>
                <HugeiconsIcon icon={LockKeyIcon as IconSvgElement} size={18} strokeWidth={2} />
                <span>
                  Este entorno interactivo está en proceso de construcción pedagógica y técnica. Pronto estará disponible en Lilium.
                </span>
              </div>
            ) : (
              activeModalLab.highlights && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    background: '#f8f8f8',
                    padding: '1rem',
                    borderRadius: '12px',
                  }}
                >
                  <strong style={{ fontSize: '0.825rem', color: '#111' }}>
                    Temas cubiertos en este laboratorio:
                  </strong>
                  <ul
                    style={{
                      margin: 0,
                      paddingLeft: '1.25rem',
                      fontSize: '0.85rem',
                      color: '#555',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                    }}
                  >
                    {activeModalLab.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>
              )
            )}

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '0.75rem',
                borderTop: '1px solid #e5e5e5',
              }}
            >
              {activeModalLab.relatedDocSection ? (
                <Link
                  to={`/docs/${activeModalLab.relatedDocSection}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.825rem',
                    color: '#111',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  <HugeiconsIcon
                    icon={BookOpen01Icon as IconSvgElement}
                    size={14}
                    strokeWidth={1.8}
                  />
                  Ver documentación relacionada
                </Link>
              ) : (
                <span />
              )}

              <div className={styles.modalCtaRow}>
                {activeModalLab.available === false ? (
                  <button
                    type="button"
                    disabled
                    className={styles.modalBtnDisabled}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.65rem 1.35rem',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '999px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                    }}
                  >
                    <HugeiconsIcon
                      icon={LockKeyIcon as IconSvgElement}
                      size={14}
                      strokeWidth={2}
                    />
                    No disponible
                  </button>
                ) : (
                  <button
                    type="button"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      padding: '0.65rem 1.35rem',
                      background: '#111111',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '999px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      navigate(`/lab/${activeModalLab.id}`)
                    }}
                  >
                    Iniciar Lab
                    <HugeiconsIcon
                      icon={ArrowRight01Icon as IconSvgElement}
                      size={14}
                      strokeWidth={2}
                    />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Page Footer ── */}
      <Footer id="contact" showCta={false} />
    </div>
  )
}
