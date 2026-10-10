import { useState } from 'react'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { Shield01Icon, PlayIcon, Activity01Icon, CpuIcon } from '@hugeicons/core-free-icons'
import SpecularButton from './SpecularButton'
import { Pill } from './Pill'
import RubberSegment, { type RubberSegmentItem } from './RubberSegment'
import DocsNextButton from './DocsNextButton'
import DocsSubindexCard from './DocsSubindexCard'
import styles from './DocsUIPreview.module.css'

interface Props {
  component?: 'specularButton' | 'pills' | 'rubberSegment' | 'nextButton' | 'all'
}

export default function DocsUIPreview({ component = 'all' }: Props) {
  // State for interactive Pill preview
  const [activePillIndex, setActivePillIndex] = useState<number>(0)
  const [clickCount, setClickCount] = useState<number>(0)

  // State for interactive RubberSegment preview
  const [selectedSegment, setSelectedSegment] = useState<string>('análisis')

  // State for SpecularButton interactive feedback
  const [buttonStatus, setButtonStatus] = useState<string>('Listo para ejecutar')

  const segmentItems: RubberSegmentItem[] = [
    {
      value: 'análisis',
      label: 'Análisis',
      icon: (
        <HugeiconsIcon
          icon={Activity01Icon as IconSvgElement}
          size={14}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      ),
    },
    {
      value: 'defensa',
      label: 'Defensa Activa',
      icon: (
        <HugeiconsIcon
          icon={Shield01Icon as IconSvgElement}
          size={14}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      ),
    },
    {
      value: 'simulación',
      label: 'Simulación',
      icon: (
        <HugeiconsIcon
          icon={PlayIcon as IconSvgElement}
          size={14}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      ),
    },
    {
      value: 'forense',
      label: 'Forense',
      icon: (
        <HugeiconsIcon
          icon={CpuIcon as IconSvgElement}
          size={14}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      ),
    },
  ]

  const showSpecular = component === 'all' || component === 'specularButton'
  const showPills = component === 'all' || component === 'pills'
  const showRubber = component === 'all' || component === 'rubberSegment'
  const showNextButton = component === 'all' || component === 'nextButton'

  return (
    <div className={styles.previewWrapper}>
      {/* ── 1. SpecularButton Showcase ── */}
      {showSpecular && (
        <div className={styles.previewCard}>
          <div className={styles.cardHeader}>
            <div className={styles.headerLeft}>
              <span className={styles.cardTitle}>SpecularButton (WebGL Shader)</span>
              <span className={styles.cardBadge}>Interactivo</span>
            </div>
            <span className={styles.cardBadge}>OGL 3D</span>
          </div>
          <p className={styles.cardDescription}>
            Botón de alta gama con efecto especular dinámico renderizado con shaders OGL. Responde a
            la inclinación de la luz y al movimiento del puntero.
          </p>
          <div className={styles.darkStage}>
            <SpecularButton
              onClick={() => {
                setButtonStatus('Simulación iniciada en tiempo real')
                setTimeout(() => setButtonStatus('Listo para ejecutar'), 3000)
              }}
            >
              Iniciar Simulación Defensiva
            </SpecularButton>
            <span className={styles.darkStatusText}>Estado: {buttonStatus}</span>
          </div>
        </div>
      )}

      {/* ── 2. Pill Component Showcase ── */}
      {showPills && (
        <div className={styles.previewCard}>
          <div className={styles.cardHeader}>
            <div className={styles.headerLeft}>
              <span className={styles.cardTitle}>Pill (Indicadores y Badges)</span>
              <span className={styles.cardBadge}>Interactivo</span>
            </div>
            <span className={styles.cardBadge}>React UI</span>
          </div>
          <p className={styles.cardDescription}>
            Píldoras multifuncionales con variantes de contraste (dark/light), indicadores de estado
            pulsantes (dots), badges numéricos o de versión, y cursores activos. Haz clic en las
            píldoras para interactuar.
          </p>
          <div className={styles.cardStage}>
            <div className={styles.pillRow}>
              <Pill
                variant="dark"
                pointer
                active={activePillIndex === 0}
                onClick={() => {
                  setActivePillIndex(0)
                  setClickCount((c) => c + 1)
                }}
                badge="ACTIVO"
                badgeVariant="accent"
              >
                Servidor Principal
              </Pill>

              <Pill
                variant="dark"
                dot
                dotActive
                pointer
                active={activePillIndex === 1}
                onClick={() => {
                  setActivePillIndex(1)
                  setClickCount((c) => c + 1)
                }}
              >
                Telemetría en Vivo
              </Pill>

              <Pill
                variant="light"
                pointer
                active={activePillIndex === 2}
                onClick={() => {
                  setActivePillIndex(2)
                  setClickCount((c) => c + 1)
                }}
                badge="v2.4.0"
              >
                Versión Motor
              </Pill>

              <Pill
                variant="light"
                dot
                pointer
                active={activePillIndex === 3}
                onClick={() => {
                  setActivePillIndex(3)
                  setClickCount((c) => c + 1)
                }}
              >
                Modo Seguro
              </Pill>
            </div>

            <div className={styles.pillRow}>
              <Pill size="sm" variant="dark" badge="SM">
                Compacto
              </Pill>
              <Pill size="md" variant="dark" badge="MD">
                Estándar
              </Pill>
              <Pill size="lg" variant="dark" badge="LG">
                Prominente
              </Pill>
            </div>

            <span className={styles.statusText}>
              Píldora activa seleccionada: {activePillIndex + 1} | Clics totales: {clickCount}
            </span>
          </div>
        </div>
      )}

      {/* ── 3. RubberSegment Showcase ── */}
      {showRubber && (
        <div className={styles.previewCard}>
          <div className={styles.cardHeader}>
            <div className={styles.headerLeft}>
              <span className={styles.cardTitle}>RubberSegment (Segmented Switch)</span>
              <span className={styles.cardBadge}>Interactivo</span>
            </div>
            <span className={styles.cardBadge}>Framer Motion</span>
          </div>
          <p className={styles.cardDescription}>
            Control segmentado con física elástica tipo goma ("rubber band physics"). Diseñado para
            conmutación táctil fluida entre vistas o modos de trabajo.
          </p>
          <div className={styles.cardStage}>
            <div className={styles.segmentWrapper}>
              <RubberSegment
                items={segmentItems}
                value={selectedSegment}
                onChange={(val) => setSelectedSegment(val)}
                size="md"
              />
              <span className={styles.statusText}>
                Modo activo actual: <strong>{selectedSegment.toUpperCase()}</strong>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. DocsNextButton Showcase ── */}
      {showNextButton && (
        <div className={styles.previewCard}>
          <div className={styles.cardHeader}>
            <div className={styles.headerLeft}>
              <span className={styles.cardTitle}>
                Navegación de Subíndices (DocsNextButton & Cards)
              </span>
              <span className={styles.cardBadge}>Minimal</span>
            </div>
            <span className={styles.cardBadge}>Premium UI</span>
          </div>
          <p className={styles.cardDescription}>
            Navegación minimalista y refinada para saltar entre subíndices de la documentación, con
            micro-interacciones sutiles en flechas y estados de reposo silenciosos.
          </p>

          <div className={styles.cardStage}>
            <div className={styles.showcaseStack}>
              {/* Pagination cards */}
              <div>
                <span className={styles.previewSubheading}>
                  Paginación Inferior (Anterior / Siguiente):
                </span>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '0.85rem',
                  }}
                >
                  <DocsNextButton
                    direction="prev"
                    variant="card"
                    to="/docs/layer-1/introduction"
                    title="Fundamentos"
                  />
                  <DocsNextButton
                    direction="next"
                    variant="card"
                    to="/docs/layer-1/frameworks-references"
                    title="Frameworks y Referencias"
                  />
                </div>
              </div>

              {/* Subindex Cards */}
              <div>
                <span className={styles.previewSubheading}>
                  Filas de Subíndice (Vista general de sección):
                </span>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '0.65rem',
                  }}
                >
                  <DocsSubindexCard
                    sectionId="layer-1"
                    subSection={{
                      id: 'introduction',
                      title: 'Fundamentos',
                      icon: 'Book02Icon',
                    }}
                    index={1}
                  />
                  <DocsSubindexCard
                    sectionId="layer-1"
                    subSection={{
                      id: 'frameworks-references',
                      title: 'Frameworks y Referencias',
                      icon: 'Bookmark01Icon',
                    }}
                    index={2}
                  />
                </div>
              </div>

              {/* Inline Pill / Compact */}
              <div>
                <span className={styles.previewSubheading}>
                  Variantes en línea (Pill & Compact):
                </span>
                <div
                  style={{
                    display: 'flex',
                    gap: '0.65rem',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                  }}
                >
                  <DocsNextButton
                    variant="pill"
                    to="/docs/layer-1/frameworks-references"
                    title="Frameworks y Referencias"
                    icon="Bookmark01Icon"
                  />
                  <DocsNextButton
                    variant="compact"
                    to="/docs/layer-1/toolkit"
                    title="Kit de Herramientas"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
