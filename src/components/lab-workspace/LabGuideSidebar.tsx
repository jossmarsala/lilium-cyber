/**
 * LabGuideSidebar — collapsible left panel external to the OS desktop.
 *
 * Shows:
 *  - Lab mission / briefing
 *  - Objectives per phase (from compiled phases)
 *  - Per-step hints (collapsible inline)
 *  - A "rendered" view of the full playbook sections
 *
 * When collapsed, renders a narrow icon rail with a toggle button.
 */

import { useState } from 'react'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import {
  BookOpen01Icon,
  Target01Icon,
  BulbIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  InformationCircleIcon,
  SidebarLeftIcon,
} from '@hugeicons/core-free-icons'
import type { LabItem } from '@/data/labsData'
import type { CompiledLab } from '@/data/compiledLabs'
import styles from './LabGuideSidebar.module.css'

interface LabGuideSidebarProps {
  open: boolean
  onToggle: () => void
  lab: LabItem
  compiled?: CompiledLab
}

/** Lightweight inline markdown renderer (headings, bold, code, lists, blockquotes). */
function renderMarkdownLine(text: string, key: string | number) {
  // Bold: **text**
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return (
    <span key={key}>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i}>{part.slice(2, -2)}</strong>
        }
        if (part.startsWith('`') && part.endsWith('`')) {
          return <code key={i}>{part.slice(1, -1)}</code>
        }
        return part
      })}
    </span>
  )
}

interface CollapsibleHintProps {
  tool: string
  description: string
  command?: string
}

function CollapsibleHint({ tool, description, command }: CollapsibleHintProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className={styles.hint}>
      <button
        type="button"
        className={styles.hintToggle}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <HugeiconsIcon
          icon={open ? ChevronDownIcon as IconSvgElement : ChevronRightIcon as IconSvgElement}
          size={12}
          strokeWidth={2}
          aria-hidden="true"
        />
        <span className={styles.hintTool}>{tool}</span>
      </button>
      {open && (
        <div className={styles.hintBody}>
          <p className={styles.hintDesc}>{description}</p>
          {command && (
            <pre className={styles.hintCmd}><code>{command}</code></pre>
          )}
        </div>
      )}
    </div>
  )
}

interface PhaseAccordionProps {
  phase: CompiledLab['phases'][0]
  index: number
}

function PhaseAccordion({ phase, index }: PhaseAccordionProps) {
  const [open, setOpen] = useState(index === 0)
  const [hintsOpen, setHintsOpen] = useState(false)

  return (
    <div className={styles.phase}>
      <button
        type="button"
        className={styles.phaseToggle}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className={styles.phaseNum}>{String(index + 1).padStart(2, '0')}</span>
        <span className={styles.phaseTitle}>{phase.title.replace(/^FASE \d+:\s*/i, '')}</span>
        <HugeiconsIcon
          icon={open ? ChevronDownIcon as IconSvgElement : ChevronRightIcon as IconSvgElement}
          size={13}
          strokeWidth={1.8}
          aria-hidden="true"
          className={styles.phaseChevron}
        />
      </button>

      {open && (
        <div className={styles.phaseBody}>
          {phase.subtitle && (
            <p className={styles.phaseSubtitle}>{phase.subtitle}</p>
          )}

          {/* Directives list */}
          <ol className={styles.directiveList}>
            {phase.directives.map((d, di) => (
              <li key={di} className={styles.directiveItem}>
                <span className={styles.directiveTitle}>
                  {renderMarkdownLine(d.title, `t-${di}`)}
                </span>
                <p className={styles.directiveText}>
                  {renderMarkdownLine(d.text, `b-${di}`)}
                </p>
              </li>
            ))}
          </ol>

          {/* Collapsible hints section */}
          {phase.hints && phase.hints.length > 0 && (
            <div className={styles.hintsSection}>
              <button
                type="button"
                className={styles.hintsSectionToggle}
                onClick={() => setHintsOpen((v) => !v)}
                aria-expanded={hintsOpen}
              >
                <HugeiconsIcon
                  icon={BulbIcon as IconSvgElement}
                  size={12}
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                <span>Pistas y comandos</span>
                <HugeiconsIcon
                  icon={hintsOpen ? ChevronDownIcon as IconSvgElement : ChevronRightIcon as IconSvgElement}
                  size={12}
                  strokeWidth={2}
                  aria-hidden="true"
                />
              </button>
              {hintsOpen && (
                <div className={styles.hintsList}>
                  {phase.hints.map((hint, hi) => (
                    <CollapsibleHint key={hi} {...hint} />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function LabGuideSidebar({ open, onToggle, lab, compiled }: LabGuideSidebarProps) {
  const [activeTab, setActiveTab] = useState<'mission' | 'phases'>('mission')

  return (
    <aside
      className={`${styles.sidebar} ${!open ? styles.collapsed : ''}`}
      aria-label="Guía de laboratorio"
      onClick={!open ? onToggle : undefined}
    >
      {/* ── Collapsed icon rail ── */}
      <div className={styles.rail} aria-hidden={open}>
        <button
          type="button"
          className={styles.railToggleBtn}
          onClick={(e) => {
            e.stopPropagation()
            onToggle()
          }}
          title="Desplegar guía del laboratorio"
          aria-label="Desplegar guía del laboratorio"
        >
          <HugeiconsIcon
            icon={SidebarLeftIcon as IconSvgElement}
            size={15}
            strokeWidth={1.8}
          />
        </button>

        <div className={styles.railIcons}>
          <button
            type="button"
            className={styles.railIconBtn}
            onClick={(e) => {
              e.stopPropagation()
              setActiveTab('mission')
              onToggle()
            }}
            title="Misión del lab (clic para desplegar)"
            aria-label="Misión del lab"
          >
            <HugeiconsIcon icon={BookOpen01Icon as IconSvgElement} size={16} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            className={styles.railIconBtn}
            onClick={(e) => {
              e.stopPropagation()
              setActiveTab('phases')
              onToggle()
            }}
            title="Fases y objetivos (clic para desplegar)"
            aria-label="Fases y objetivos"
          >
            <HugeiconsIcon icon={Target01Icon as IconSvgElement} size={16} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            className={styles.railIconBtn}
            onClick={(e) => {
              e.stopPropagation()
              setActiveTab('phases')
              onToggle()
            }}
            title="Pistas y comandos (clic para desplegar)"
            aria-label="Pistas y comandos"
          >
            <HugeiconsIcon icon={BulbIcon as IconSvgElement} size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* ── Expanded full content ── */}
      <div className={styles.expandedContent} aria-hidden={!open}>
        {/* ── Sidebar header ── */}
        <div className={styles.sidebarHead}>
          <div className={styles.sidebarTitle}>
            <HugeiconsIcon
              icon={BookOpen01Icon as IconSvgElement}
              size={14}
              strokeWidth={1.8}
              aria-hidden="true"
            />
            <span>Guía del Lab</span>
          </div>
          <div className={styles.headActions}>
            <span className={styles.labTag}>{lab.tag}</span>
            <button
              type="button"
              className={styles.collapseBtn}
              onClick={(e) => {
                e.stopPropagation()
                onToggle()
              }}
              title="Colapsar guía"
              aria-label="Colapsar guía"
            >
              <HugeiconsIcon
                icon={SidebarLeftIcon as IconSvgElement}
                size={14}
                strokeWidth={1.8}
              />
            </button>
          </div>
        </div>

      {/* ── Tab switcher ── */}
      <div className={styles.tabs} role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === 'mission'}
          className={`${styles.tab} ${activeTab === 'mission' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('mission')}
        >
          Misión
        </button>
        <button
          role="tab"
          aria-selected={activeTab === 'phases'}
          className={`${styles.tab} ${activeTab === 'phases' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('phases')}
        >
          Fases
        </button>
      </div>

      {/* ── Scrollable body ── */}
      <div className={styles.scrollBody}>

        {/* MISSION TAB */}
        {activeTab === 'mission' && (
          <div className={styles.missionTab}>
            {/* Lab title + meta */}
            <div className={styles.labMeta}>
              <span className={styles.labCategory}>{lab.category}</span>
              <h2 className={styles.labName}>{lab.title}</h2>
              <p className={styles.labDesc}>{lab.description}</p>
            </div>

            {/* Mission block */}
            {compiled?.mission && (
              <div className={styles.missionBlock}>
                <div className={styles.blockLabel}>
                  <HugeiconsIcon
                    icon={InformationCircleIcon as IconSvgElement}
                    size={12}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  Tu misión
                </div>
                <p className={styles.missionText}>{compiled.mission}</p>
              </div>
            )}

            {/* Work rules */}
            {compiled?.rules && compiled.rules.length > 0 && (
              <div className={styles.rulesBlock}>
                <div className={styles.blockLabel}>Reglas de trabajo</div>
                <ul className={styles.rulesList}>
                  {compiled.rules.map((rule, i) => (
                    <li key={i} className={styles.rulesItem}>
                      {renderMarkdownLine(rule, i)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Highlights */}
            {lab.highlights && lab.highlights.length > 0 && (
              <div className={styles.highlightsBlock}>
                <div className={styles.blockLabel}>
                  <HugeiconsIcon
                    icon={Target01Icon as IconSvgElement}
                    size={12}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                  Temas cubiertos
                </div>
                <ul className={styles.highlightsList}>
                  {lab.highlights.map((h, i) => (
                    <li key={i} className={styles.highlightItem}>{h}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Lab metadata strip */}
            <div className={styles.metaStrip}>
              <span className={styles.metaPair}>
                <span className={styles.metaKey}>Dificultad</span>
                <span className={styles.metaVal}>{lab.difficulty}</span>
              </span>
              <span className={styles.metaPair}>
                <span className={styles.metaKey}>Duración</span>
                <span className={styles.metaVal}>{lab.duration}</span>
              </span>
              <span className={styles.metaPair}>
                <span className={styles.metaKey}>Pasos</span>
                <span className={styles.metaVal}>{lab.totalSteps}</span>
              </span>
            </div>
          </div>
        )}

        {/* PHASES TAB */}
        {activeTab === 'phases' && (
          <div className={styles.phasesTab}>
            {compiled?.phases && compiled.phases.length > 0 ? (
              compiled.phases.map((phase, i) => (
                <PhaseAccordion key={phase.id} phase={phase} index={i} />
              ))
            ) : (
              <p className={styles.emptyState}>No hay fases disponibles para este laboratorio.</p>
            )}
          </div>
        )}
      </div>
    </div>
  </aside>
)
}
