import { useState } from 'react'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import {
  ArrowUpRight01Icon,
  CheckIcon,
  Search01Icon,
  Layers01Icon,
  Settings02Icon,
  Shield01Icon,
  Target01Icon,
  ZapIcon,
} from '@hugeicons/core-free-icons'
import styles from './SecurityFramework.module.css'
import { Pill } from './Pill'

interface ReferenceItem {
  name: string
  description: string
  url: string
}

interface FunctionItem {
  code: string
  name: string
  icon: IconSvgElement
}

interface LayerItem {
  num: string

  title: string
  subtitle: string
  functions: FunctionItem[]
}

const LAYERS: LayerItem[] = [
  {
    num: '01',
    title: 'Comprender.',
    subtitle: 'Conocer el entorno antes de tomar decisiones de seguridad.',
    functions: [
      { code: '01. UNDERSTAND', name: 'Aprender fundamentos teóricos', icon: Search01Icon },
      {
        code: '02. DISCOVER',
        name: 'Identificar activos y riesgos en la PyME',
        icon: Layers01Icon,
      },
    ],
  },
  {
    num: '02',
    title: 'Construir.',
    subtitle: 'Diseñar e implementar una arquitectura que reduzca los riesgos.',
    functions: [
      { code: '03. DESIGN', name: 'Diseñar controles y segmentación', icon: Settings02Icon },
      { code: '04. PROTECT', name: 'Proteger accesos, datos y sistemas', icon: Shield01Icon },
    ],
  },
  {
    num: '03',
    title: 'Operar.',
    subtitle: 'Detectar amenazas, responder ante incidentes y recuperar la operación.',
    functions: [
      { code: '05. DETECT', name: 'Detectar anomalías y amenazas', icon: Target01Icon },
      { code: '06. RESPOND & RECOVER', name: 'Responder y restaurar operación', icon: ZapIcon },
    ],
  },
]

const REFERENCES: ReferenceItem[] = [
  {
    name: 'NIST CSF y RMF',
    description: 'Gestión de riesgos y funciones de ciberseguridad.',
    url: 'https://www.nist.gov/cyberframework',
  },
  {
    name: 'MITRE ATT&CK',
    description: 'Tácticas y técnicas de adversarios para contextualizar amenazas y detecciones.',
    url: 'https://attack.mitre.org/',
  },
  {
    name: 'CIS Controls',
    description: 'Salvaguardas priorizadas para reducir riesgos comunes.',
    url: 'https://www.cisecurity.org/controls/',
  },
  {
    name: 'OWASP',
    description: 'Guías y metodologías para la seguridad de aplicaciones web.',
    url: 'https://owasp.org/',
  },
]

export default function SecurityFramework() {
  const [hoveredLayerIndex, setHoveredLayerIndex] = useState<number | null>(null)

  return (
    <section className={styles.section} id="security-framework">
      {/* ── Section Header ── */}
      <div className={styles.header}>
        <h2 className={styles.title}>
          El método:
          <br />
          capa por capa
        </h2>
        <p className={styles.subtitle}>
          Framework para comprender, implementar y responder, basado en referencias reconocidas de
          ciberseguridad.
        </p>
      </div>

      {/* ── Timeline Section (Pills + Connecting line + Node dots) ── */}
      <div className={styles.timelineWrapper}>
        <div className={styles.timelineTrackLine} aria-hidden="true">
          <div
            className={styles.timelineTrackProgress}
            style={{
              width:
                hoveredLayerIndex === null
                  ? '0%'
                  : hoveredLayerIndex === 0
                    ? '0%'
                    : hoveredLayerIndex === 1
                      ? '50%'
                      : '100%',
              opacity: hoveredLayerIndex === null ? 0 : 1,
            }}
          />
          <div className={styles.timelineTrackBeam}>
            <div className={styles.timelineTrackSpark} />
          </div>
        </div>
        <div className={styles.timelineGrid}>
          {LAYERS.map((layer, index) => {
            const isHovered = hoveredLayerIndex === index
            return (
              <div
                key={layer.num}
                className={`${styles.timelineStep} ${isHovered ? styles.timelineStepActive : ''}`}
                onMouseEnter={() => setHoveredLayerIndex(index)}
                onMouseLeave={() => setHoveredLayerIndex(null)}
              >
                <Pill
                  variant={isHovered ? 'dark' : 'light'}
                  size="lg"
                  badge={layer.num}
                  badgeClassName={styles.timelineBadge}
                  pointer={true}
                  className={styles.timelinePill}
                >
                  Capa
                </Pill>
                <div className={styles.timelineNode} aria-hidden="true">
                  <div className={styles.timelineNodeInner} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── 3-Card Milestone Checklist Grid ── */}
      <div className={styles.cardsGrid}>
        {LAYERS.map((layer, index) => {
          const isHovered = hoveredLayerIndex === index
          return (
            <div
              key={layer.num}
              className={`${styles.card} ${isHovered ? styles.cardActive : ''}`}
              onMouseEnter={() => setHoveredLayerIndex(index)}
              onMouseLeave={() => setHoveredLayerIndex(null)}
            >
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{layer.title}</h3>
                <p className={styles.cardSubtitle}>{layer.subtitle}</p>
              </div>

              <div className={styles.checklist}>
                {layer.functions.map((fn) => (
                  <div key={fn.code} className={styles.checkItem}>
                    <div className={styles.checkIconWrapper} aria-hidden="true">
                      <HugeiconsIcon
                        icon={fn.icon}
                        size={15}
                        strokeWidth={1.8}
                        className={styles.fnIcon}
                      />
                    </div>
                    <div className={styles.checkContent}>
                      <div className={styles.functionCodeRow}>
                        <span className={styles.functionCode}>{fn.code}</span>
                        <HugeiconsIcon
                          icon={CheckIcon as IconSvgElement}
                          size={12}
                          strokeWidth={2.4}
                          className={styles.checkBadgeIcon}
                        />
                      </div>
                      <span className={styles.functionName}>{fn.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── References Section ── */}
      <div className={styles.referencesWrap}>
        <div className={styles.referencesHeader}>
          <h3 className={styles.subtitle}>Basado en referencias reconocidas: </h3>
        </div>

        <div className={styles.referencesGrid}>
          {REFERENCES.map((ref) => (
            <a
              key={ref.name}
              href={ref.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.refCard}
              title={`Visitar sitio oficial de ${ref.name}`}
              aria-label={`${ref.name}: ${ref.description} (abre enlace externo en una nueva pestaña)`}
            >
              <div className={styles.refCardHeader}>
                <h4 className={styles.refName}>{ref.name}</h4>
                <span className={styles.refLinkSignifier} aria-hidden="true">
                  <HugeiconsIcon
                    icon={ArrowUpRight01Icon as IconSvgElement}
                    size={13}
                    strokeWidth={2.2}
                    className={styles.refLinkIcon}
                  />
                </span>
              </div>
              <p className={styles.refDesc}>{ref.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
