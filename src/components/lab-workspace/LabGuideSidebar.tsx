/**
 * LabGuideSidebar — renders the lab playbook guide in the style and shape of
 * DocsSidebar (eased hairline gradient borders, light #fafafb surface,
 * branch tree line hierarchy, collapsible sections).
 *
 * Includes:
 *  - App quick-launch pills that trigger opening OS apps (Terminal, Bitácora, Playbook)
 *  - The full text of playbook.md (Tu misión, Reglas de trabajo, Fases con directivas y pistas)
 *  - Interactive command copying and direct terminal launch
 *  - Collapsible to a 44px icon rail that spreads on click
 */

import { useState } from 'react'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import {
  TerminalIcon,
  NoteIcon,
  BookOpen01Icon,
  ChevronDownIcon,
  ChevronRightIcon,
  BulbIcon,
  InformationCircleIcon,
  Copy01Icon,
  Tick02Icon,
  SidebarLeftIcon,
} from '@hugeicons/core-free-icons'
import type { LabItem } from '@/data/labsData'
import type { CompiledLab } from '@/data/compiledLabs'
import { triggerOpenOsApp } from './OSCanvas'
import styles from './LabGuideSidebar.module.css'

interface LabGuideSidebarProps {
  open: boolean
  onToggle: () => void
  lab: LabItem
  compiled?: CompiledLab
}

/** Lightweight inline markdown parser for bold, inline code, and backticks. */
function renderMarkdownLine(text: string, keyPrefix: string | number) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return (
    <span key={keyPrefix}>
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

interface HintItemProps {
  tool: string
  description: string
  command?: string
}

function HintItem({ tool, description, command }: HintItemProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!command) return
    navigator.clipboard.writeText(command)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRun = (e: React.MouseEvent) => {
    e.stopPropagation()
    triggerOpenOsApp('terminal')
  }

  return (
    <div className={styles.hintCard}>
      <span className={styles.hintToolName}>{tool}</span>
      <p className={styles.hintDesc}>{description}</p>
      {command && (
        <div className={styles.cmdBox}>
          <code className={styles.cmdText}>{command}</code>
          <div className={styles.cmdActions}>
            <button
              type="button"
              className={`${styles.copyBtn} ${copied ? styles.copyBtnActive : ''}`}
              onClick={handleCopy}
              title="Copiar comando al portapapeles"
            >
              <HugeiconsIcon
                icon={(copied ? Tick02Icon : Copy01Icon) as IconSvgElement}
                size={11}
                strokeWidth={2}
              />
              <span>{copied ? 'Listo' : 'Copiar'}</span>
            </button>
            <button
              type="button"
              className={styles.runBtn}
              onClick={handleRun}
              title="Abrir Terminal en el escritorio"
            >
              <HugeiconsIcon icon={TerminalIcon as IconSvgElement} size={11} strokeWidth={2} />
              <span>Terminal</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

interface PhaseSectionProps {
  phase: CompiledLab['phases'][0]
  index: number
}

function PhaseSection({ phase, index }: PhaseSectionProps) {
  const [open, setOpen] = useState(true)
  const [hintsOpen, setHintsOpen] = useState(false)

  return (
    <div className={styles.sectionCard}>
      <button
        type="button"
        className={styles.sectionToggle}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <div className={styles.sectionToggleLeft}>
          <span className={styles.sectionNumberBadge}>
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className={styles.sectionTitle}>
            {phase.title.replace(/^FASE \d+:\s*/i, '')}
          </span>
        </div>
        <HugeiconsIcon
          icon={(open ? ChevronDownIcon : ChevronRightIcon) as IconSvgElement}
          size={13}
          strokeWidth={1.8}
          className={styles.chevron}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div className={styles.sectionBody}>
          {phase.subtitle && (
            <p className={styles.sectionSubtitle}>{phase.subtitle}</p>
          )}

          {/* Directives with branch tree line */}
          <div className={styles.directivesTree}>
            {phase.directives.map((d, di) => {
              const mentionsTerminal = /terminal|comando|bash|whoami|dpkg|ip|ss|cat|grep|sudo/i.test(
                d.text + d.title
              )
              const mentionsNotes = /bit[aá]cora|registro|documenta|anotar/i.test(
                d.text + d.title
              )

              return (
                <div key={di} className={styles.directiveItem}>
                  <div className={styles.directiveHeader}>
                    <span className={styles.directiveTitle}>
                      {renderMarkdownLine(d.title, `dt-${di}`)}
                    </span>
                  </div>
                  <p className={styles.directiveText}>
                    {renderMarkdownLine(d.text, `db-${di}`)}
                  </p>

                  {/* Contextual OS launcher pill */}
                  {mentionsTerminal && (
                    <button
                      type="button"
                      className={styles.directiveActionPill}
                      onClick={() => triggerOpenOsApp('terminal')}
                      title="Abrir Terminal en el escritorio"
                    >
                      <HugeiconsIcon
                        icon={TerminalIcon as IconSvgElement}
                        size={10}
                        strokeWidth={2}
                      />
                      <span>Abrir Terminal</span>
                    </button>
                  )}
                  {!mentionsTerminal && mentionsNotes && (
                    <button
                      type="button"
                      className={styles.directiveActionPill}
                      onClick={() => triggerOpenOsApp('notes')}
                      title="Abrir Bitácora en el escritorio"
                    >
                      <HugeiconsIcon
                        icon={NoteIcon as IconSvgElement}
                        size={10}
                        strokeWidth={2}
                      />
                      <span>Abrir Bitácora</span>
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {/* Collapsible hints */}
          {phase.hints && phase.hints.length > 0 && (
            <div className={styles.hintsContainer}>
              <button
                type="button"
                className={styles.hintsToggle}
                onClick={() => setHintsOpen((v) => !v)}
                aria-expanded={hintsOpen}
              >
                <div className={styles.hintsToggleLeft}>
                  <HugeiconsIcon icon={BulbIcon as IconSvgElement} size={12} strokeWidth={2} />
                  <span>Pistas y comandos ({phase.hints.length})</span>
                </div>
                <HugeiconsIcon
                  icon={(hintsOpen ? ChevronDownIcon : ChevronRightIcon) as IconSvgElement}
                  size={12}
                  strokeWidth={2}
                />
              </button>
              {hintsOpen && (
                <div className={styles.hintsList}>
                  {phase.hints.map((hint, hi) => (
                    <HintItem key={hi} {...hint} />
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

export default function LabGuideSidebar({
  open,
  onToggle,
  compiled,
}: LabGuideSidebarProps) {
  const [missionOpen, setMissionOpen] = useState(true)

  return (
    <aside
      className={`${styles.sidebar} ${!open ? styles.collapsed : ''}`}
      aria-label="Playbook del laboratorio"
      onClick={!open ? onToggle : undefined}
    >
      {/* ── Gradient borders (Docs style) ── */}
      <div className={styles.topBorder} aria-hidden="true" />
      <div className={styles.bottomBorder} aria-hidden="true" />
      <div className={styles.rightBorder} aria-hidden="true" />

      {/* ── Collapsed icon rail ── */}
      <div className={styles.rail} aria-hidden={open}>
        <button
          type="button"
          className={styles.railToggleBtn}
          onClick={(e) => {
            e.stopPropagation()
            onToggle()
          }}
          title="Desplegar Playbook"
          aria-label="Desplegar Playbook"
        >
          <HugeiconsIcon icon={SidebarLeftIcon as IconSvgElement} size={15} strokeWidth={2} />
        </button>

        <span className={styles.railDivider} aria-hidden="true" />

        <div className={styles.railIcons}>
          <button
            type="button"
            className={styles.railIconBtn}
            onClick={(e) => {
              e.stopPropagation()
              triggerOpenOsApp('terminal')
            }}
            title="Abrir Terminal en el escritorio"
            aria-label="Abrir Terminal"
          >
            <HugeiconsIcon icon={TerminalIcon as IconSvgElement} size={16} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            className={styles.railIconBtn}
            onClick={(e) => {
              e.stopPropagation()
              triggerOpenOsApp('notes')
            }}
            title="Abrir Bitácora en el escritorio"
            aria-label="Abrir Bitácora"
          >
            <HugeiconsIcon icon={NoteIcon as IconSvgElement} size={16} strokeWidth={1.8} />
          </button>
          <button
            type="button"
            className={styles.railIconBtn}
            onClick={(e) => {
              e.stopPropagation()
              triggerOpenOsApp('playbook')
            }}
            title="Abrir Playbook interno en el escritorio"
            aria-label="Abrir Playbook"
          >
            <HugeiconsIcon icon={BookOpen01Icon as IconSvgElement} size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* ── Expanded content ── */}
      <div className={styles.expandedContent} aria-hidden={!open}>
        {/* Header */}
        <div className={styles.sidebarHeader}>
          <div className={styles.headerTitleGroup}>
            <HugeiconsIcon icon={BookOpen01Icon as IconSvgElement} size={14} strokeWidth={2} />
            <span className={styles.headerTitle}>Playbook</span>
          </div>
          <button
            type="button"
            className={styles.collapseToggleBtn}
            onClick={(e) => {
              e.stopPropagation()
              onToggle()
            }}
            title="Colapsar panel"
            aria-label="Colapsar panel"
          >
            <HugeiconsIcon icon={SidebarLeftIcon as IconSvgElement} size={14} strokeWidth={2} />
          </button>
        </div>

        {/* OS App Launcher Pills Bar */}
        <div className={styles.appPillsBar}>
          <div className={styles.pillsHeader}>
            <span className={styles.pillsLabel}>Apps del OS</span>
            <span className={styles.pillsSubLabel}>clic para abrir</span>
          </div>
          <div className={styles.pillsList}>
            <button
              type="button"
              className={styles.appPill}
              onClick={() => triggerOpenOsApp('terminal')}
              title="Abrir Terminal en el escritorio"
            >
              <HugeiconsIcon icon={TerminalIcon as IconSvgElement} size={13} strokeWidth={2} />
              <span>Terminal</span>
            </button>
            <button
              type="button"
              className={styles.appPill}
              onClick={() => triggerOpenOsApp('notes')}
              title="Abrir Bitácora de notas en el escritorio"
            >
              <HugeiconsIcon icon={NoteIcon as IconSvgElement} size={13} strokeWidth={2} />
              <span>Bitácora</span>
            </button>
            <button
              type="button"
              className={styles.appPill}
              onClick={() => triggerOpenOsApp('playbook')}
              title="Abrir Playbook interactivo en el escritorio"
            >
              <HugeiconsIcon icon={BookOpen01Icon as IconSvgElement} size={13} strokeWidth={2} />
              <span>Playbook OS</span>
            </button>
          </div>
        </div>

        {/* Scroll area with top/bottom fades */}
        <div className={styles.topFade} aria-hidden="true" />
        <div className={styles.bottomFade} aria-hidden="true" />

        <div className={styles.scrollArea}>
          {/* Misión y Reglas Card */}
          <div className={styles.sectionCard}>
            <button
              type="button"
              className={styles.sectionToggle}
              onClick={() => setMissionOpen((v) => !v)}
              aria-expanded={missionOpen}
            >
              <div className={styles.sectionToggleLeft}>
                <HugeiconsIcon
                  icon={InformationCircleIcon as IconSvgElement}
                  size={15}
                  strokeWidth={2}
                />
                <span className={styles.sectionTitle}>Misión y Reglas</span>
              </div>
              <HugeiconsIcon
                icon={(missionOpen ? ChevronDownIcon : ChevronRightIcon) as IconSvgElement}
                size={13}
                strokeWidth={1.8}
                className={styles.chevron}
                aria-hidden="true"
              />
            </button>

            {missionOpen && (
              <div className={styles.sectionBody}>
                {compiled?.mission && (
                  <p className={styles.missionText}>{compiled.mission}</p>
                )}

                {compiled?.rules && compiled.rules.length > 0 && (
                  <ul className={styles.rulesList}>
                    {compiled.rules.map((rule, ri) => (
                      <li key={ri} className={styles.ruleItem}>
                        {renderMarkdownLine(rule, `r-${ri}`)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Phases from playbook.md */}
          {compiled?.phases && compiled.phases.length > 0 ? (
            compiled.phases.map((phase, pi) => (
              <PhaseSection key={phase.id} phase={phase} index={pi} />
            ))
          ) : (
            <p className={styles.missionText}>No hay fases disponibles.</p>
          )}
        </div>
      </div>
    </aside>
  )
}
