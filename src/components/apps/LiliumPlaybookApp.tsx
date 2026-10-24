'use client'

import React, { useState, useMemo } from 'react'
import type { AppContentProps } from '@react-ui-os/core'
import { getCompiledLab, COMPILED_LABS } from '@/data/compiledLabs'
import { useLabVerifier } from '@/hooks/useLabVerifier'
import { getLabVerificationConfig, type VerificationRule } from '@/services/verification'
import styles from './LiliumPlaybookApp.module.css'

function findMatchingRule(
  phaseRules: VerificationRule[],
  stepId: string,
  command?: string
): VerificationRule | undefined {
  if (!command) return undefined
  const normCmd = command.trim().toLowerCase()
  return (
    phaseRules.find(
      (r) =>
        r.stepId === stepId &&
        r.command &&
        r.command.trim().toLowerCase() === normCmd
    ) ||
    phaseRules.find(
      (r) => r.command && r.command.trim().toLowerCase() === normCmd
    )
  )
}

export interface PlaybookPhase {
  id: string
  number: string
  title: string
  subtitle: string
  directives: {
    title: string
    text: string
  }[]
  hints: {
    tool: string
    description: string
    command?: string
  }[]
  pedagogicalGuide: {
    sectionTitle: string
    rationale: string
    steps: {
      action: string
      command?: string
      detail?: string
    }[]
  }[]
  verification: {
    id: string
    label: string
  }[]
}

/**
 * Extracts matching hint and pedagogical guide for a given directive (subphase).
 * Matches by step identifier (e.g. "1.1", "2.3") or falls back to index.
 */
function getSubphaseData(
  phase: PlaybookPhase,
  dir: { title: string; text: string },
  idx: number
) {
  const match = dir.title.match(/(\d+\.\d+)/)
  const stepId = match ? match[1] : null

  const matchingHints = phase.hints.filter(
    (h) => stepId && h.tool.includes(stepId)
  )
  const hints =
    matchingHints.length > 0
      ? matchingHints
      : phase.hints[idx]
      ? [phase.hints[idx]]
      : []

  const matchingGuide =
    phase.pedagogicalGuide.find(
      (g) => stepId && g.sectionTitle.includes(stepId)
    ) ?? phase.pedagogicalGuide[idx]

  return {
    stepId: stepId ?? `${phase.number}.${idx + 1}`,
    hints,
    guide: matchingGuide,
  }
}

/**
 * Lightweight inline markdown parser for bold, inline code, and italics.
 * Supports:
 * - `code` -> <code className={styles.inlineCode}>
 * - **bold** -> <strong className={styles.inlineBold}>
 * - *italic* or _italic_ -> <em className={styles.inlineItalic}>
 * Recursively parses nested markdown (e.g. bold or code within italics).
 */
export function renderPlaybookMarkdown(
  text: string,
  keyPrefix: string | number = 'pb'
): React.ReactNode {
  if (!text) return null

  // Fast path: plain text without markdown markers
  if (!text.includes('`') && !text.includes('*') && !text.includes('_')) {
    return text
  }

  // Regex matching:
  // 1. `inline code`
  // 2. **bold**
  // 3. *italic* (with lookaround to avoid mid-word matching)
  // 4. _italic_ (with lookaround to avoid snake_case e.g. ex_cuidador)
  const regex =
    /(`[^`]+`|\*\*[^*]+?\*\*|(?<!\w)\*[^*]+?\*(?!\w)|(?<!\w)_[^_]+?_(?!\w))/g

  const parts = text.split(regex)

  const elements = parts.map((part, i) => {
    if (!part) return null

    // Inline code: `...`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={`${keyPrefix}-c-${i}`} className={styles.inlineCode}>
          {part.slice(1, -1)}
        </code>
      )
    }

    // Bold: **...**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      const inner = part.slice(2, -2)
      return (
        <strong key={`${keyPrefix}-b-${i}`} className={styles.inlineBold}>
          {renderPlaybookMarkdown(inner, `${keyPrefix}-b-${i}`)}
        </strong>
      )
    }

    // Italic: *...*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      const inner = part.slice(1, -1)
      return (
        <em key={`${keyPrefix}-i-${i}`} className={styles.inlineItalic}>
          {renderPlaybookMarkdown(inner, `${keyPrefix}-i-${i}`)}
        </em>
      )
    }

    // Italic: _..._
    if (part.startsWith('_') && part.endsWith('_') && part.length >= 2) {
      const inner = part.slice(1, -1)
      return (
        <em key={`${keyPrefix}-u-${i}`} className={styles.inlineItalic}>
          {renderPlaybookMarkdown(inner, `${keyPrefix}-u-${i}`)}
        </em>
      )
    }

    return part
  })

  return <React.Fragment key={keyPrefix}>{elements}</React.Fragment>
}

function DropdownChevron({ isOpen }: { isOpen: boolean }) {
  return (
    <span
      className={`${styles.subphaseBtnChevron} ${
        isOpen ? styles.subphaseBtnChevronOpen : ''
      }`}
      aria-hidden="true"
    >
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </span>
  )
}

export function LiliumPlaybookApp({ focused }: AppContentProps) {
  // Active Lab detection (from ?lab=lab-XX URL query or fallback to lab-01)
  const activeLabId = useMemo(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      return params.get('lab') || 'lab-01'
    }
    return 'lab-01'
  }, [])

  const currentLab = useMemo(() => {
    return (
      getCompiledLab(activeLabId) ??
      getCompiledLab('lab-01') ??
      COMPILED_LABS[0]
    )
  }, [activeLabId])

  const playbookPhases = useMemo(() => {
    return currentLab?.phases ?? []
  }, [currentLab])

  // Real-time declarative lab verification engine hook
  const {
    checkedItems,
    completedPhases,
    isPhaseLocked,
    toggleCheckItem,
    togglePhaseCompleted,
  } = useLabVerifier(activeLabId)

  // Declarative lab verification rules configuration
  const verificationConfig = useMemo(() => {
    return getLabVerificationConfig(activeLabId)
  }, [activeLabId])

  const allRulesMap = useMemo(() => {
    const map: Record<string, VerificationRule[]> = {}
    for (const phase of verificationConfig.phases) {
      map[phase.id] = phase.rules
    }
    return map
  }, [verificationConfig])

  // Prelude dropdown state (Misión & Reglas from playbook.md)
  const [showPrelude, setShowPrelude] = useState(true)

  // Collapsible dropdowns per SUBPHASE: Herramientas Sugeridas & Solución
  const [openSubphaseHints, setOpenSubphaseHints] = useState<Record<string, boolean>>({})
  const [openSubphaseSolutions, setOpenSubphaseSolutions] = useState<Record<string, boolean>>({})

  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const toggleSubphaseHint = (subId: string) => {
    setOpenSubphaseHints((prev) => ({ ...prev, [subId]: !prev[subId] }))
  }

  const toggleSubphaseSolution = (subId: string) => {
    setOpenSubphaseSolutions((prev) => ({ ...prev, [subId]: !prev[subId] }))
  }

  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {})
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    }
  }



  const hasPreludeData = Boolean(
    currentLab?.mission || (currentLab?.rules && currentLab.rules.length > 0)
  )

  return (
    <div className={styles.container}>
      {/* ── Dynamic Header loaded from playbook.md ── */}
      <div className={styles.header}>
        <div className={styles.headerTitleRow}>
          <h2 className={styles.title}>
            {currentLab?.title || 'Playbook de Seguridad'}
          </h2>
          <span className={styles.labBadge}>
            {currentLab?.metadata?.laboratorio ||
              currentLab?.id?.toUpperCase() ||
              'LAB 01'}
          </span>
        </div>

        {currentLab?.metadata?.referencia && (
          <div className={styles.headerMeta}>
            <span>{currentLab.metadata.referencia}</span>
          </div>
        )}

        {/* ── Collapsible Prelude: Misión & Reglas de Trabajo (from playbook.md) ── */}
        {hasPreludeData && (
          <div
            className={`${styles.preludeContainer} ${
              !showPrelude ? styles.preludeContainerCollapsed : ''
            }`}
          >
            <button
              type="button"
              className={styles.preludeHeader}
              onClick={() => setShowPrelude((prev) => !prev)}
              aria-expanded={showPrelude}
              title={showPrelude ? 'Plegar sección' : 'Desplegar sección'}
            >
              <h4 className={styles.preludeHeading}>
                {currentLab?.mission ? 'Tu Misión' : 'Reglas de Trabajo'}
              </h4>
              <span
                className={`${styles.preludeArrow} ${
                  showPrelude ? styles.preludeArrowOpen : ''
                }`}
                aria-hidden="true"
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </span>
            </button>

            <div
              className={`${styles.preludeCollapseWrapper} ${
                showPrelude ? styles.preludeCollapseWrapperOpen : ''
              }`}
              aria-hidden={!showPrelude}
            >
              <div className={styles.preludeCollapseInner}>
                <div className={styles.preludeBody}>
                  {currentLab?.mission && (
                    <div className={styles.preludeParagraph}>
                      {currentLab.mission.split('\n\n').map((para, pIdx) => (
                        <p key={pIdx} className={styles.preludeParaBlock}>
                          {renderPlaybookMarkdown(para, `m-${pIdx}`)}
                        </p>
                      ))}
                    </div>
                  )}
                  {currentLab?.rules && currentLab.rules.length > 0 && (
                    <div className={styles.preludeSection}>
                      <h5 className={styles.preludeSubheading}>Reglas de Trabajo</h5>
                      <ul className={styles.rulesList}>
                        {currentLab.rules.map((rule, rIdx) => (
                          <li key={rIdx} className={styles.ruleItem}>
                            {renderPlaybookMarkdown(rule, `r-${rIdx}`)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Directives & Phases List ── */}
      <div className={styles.milestonesList}>
        {playbookPhases.length === 0 ? (
          <div
            style={{
              padding: '36px 20px',
              textAlign: 'center',
              borderRadius: 8,
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px dashed rgba(255, 255, 255, 0.15)',
              margin: '8px 0',
            }}
          >
            <strong style={{ fontSize: 15, display: 'block', marginBottom: 6 }}>
              Laboratorio en Desarrollo ({currentLab?.id?.toUpperCase()})
            </strong>
            <p style={{ margin: 0, opacity: 0.7, fontSize: 13, lineHeight: 1.5 }}>
              Las directivas operativas y verificaciones interactivas para este laboratorio se compilan directamente desde los archivos SSoT en <code>docs/labs/{currentLab?.id}/</code>.
            </p>
          </div>
        ) : (
          playbookPhases.map((phase) => {
            const isPhaseDone = Boolean(completedPhases[phase.id])
            const isLocked = isPhaseLocked(phase.id)
            const phaseRules = allRulesMap[phase.id] ?? []

            // Calculate subtasks completion stats for clear minimal phase indicator
            const phaseSubtasksDoneCount = phase.directives.filter((dir, idx) => {
              const subData = getSubphaseData(phase, dir, idx)
              const stepsWithCommand = subData.guide?.steps.filter((s) => s.command) || []
              if (stepsWithCommand.length === 0) return false
              return stepsWithCommand.every((s) => {
                const r = findMatchingRule(phaseRules, subData.stepId, s.command)
                return Boolean(r && checkedItems[r.id])
              })
            }).length

            const phaseProgressPct =
              phase.directives.length > 0
                ? (phaseSubtasksDoneCount / phase.directives.length) * 100
                : 0

            return (
              <div
                key={phase.id}
                className={`${styles.milestoneItem} ${
                  isPhaseDone ? styles.milestoneItemCompleted : ''
                } ${isLocked ? styles.milestoneItemLocked : ''}`}
              >
                {/* Phase Header */}
                <div className={styles.milestoneHead}>
                  <div
                    className={`${styles.milestoneCheckbox} ${
                      isPhaseDone ? styles.milestoneCheckboxCompleted : ''
                    }`}
                    onClick={() => {
                      if (!isLocked) togglePhaseCompleted(phase.id)
                    }}
                    title={
                      isPhaseDone
                        ? 'Marcar fase como pendiente'
                        : isLocked
                        ? 'Fase bloqueada — Completa la fase anterior'
                        : 'Marcar fase como completada'
                    }
                  >
                    {isPhaseDone && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>

                  <div className={styles.milestoneMeta}>
                    <div className={styles.milestoneTitleRow}>
                      <span className={styles.milestoneTitle}>
                        {phase.title}
                      </span>
                      <div className={styles.phaseStatusBadgeGroup}>
                        {isPhaseDone ? (
                          <span className={styles.phaseBadgeDone}>
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3.2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                            Completada
                          </span>
                        ) : isLocked ? (
                          <span className={styles.phaseBadgeLocked}>
                            <svg
                              width="10"
                              height="10"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              aria-hidden="true"
                            >
                              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            Bloqueada
                          </span>
                        ) : (
                          <span className={styles.phaseBadgeActive}>
                            {phaseSubtasksDoneCount}/{phase.directives.length} sub-tareas
                          </span>
                        )}
                      </div>
                    </div>
                    <p className={styles.milestoneDesc}>
                      {renderPlaybookMarkdown(phase.subtitle, `ps-${phase.id}`)}
                    </p>
                    {!isLocked && phase.directives.length > 0 && (
                      <div
                        className={styles.phaseProgressBarTrack}
                        title={`Progreso de la fase: ${Math.round(isPhaseDone ? 100 : phaseProgressPct)}%`}
                      >
                        <div
                          className={`${styles.phaseProgressBarFill} ${
                            isPhaseDone ? styles.phaseProgressBarFillDone : ''
                          }`}
                          style={{ width: `${isPhaseDone ? 100 : phaseProgressPct}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Subphases (Each with its own Herramientas and Solución) ── */}
                <div className={styles.subphasesContainer}>
                  {phase.directives.map((dir, idx) => {
                    const subId = `${phase.id}-${idx}`
                    const isHintOpen = Boolean(openSubphaseHints[subId])
                    const isSolOpen = Boolean(openSubphaseSolutions[subId])
                    const subData = getSubphaseData(phase, dir, idx)

                    const stepsWithCommand =
                      subData.guide?.steps.filter((s) => s.command) || []
                    const completedStepsCount = stepsWithCommand.filter((s) => {
                      const r = findMatchingRule(
                        phaseRules,
                        subData.stepId,
                        s.command
                      )
                      return r && checkedItems[r.id]
                    }).length
                    const isSubtaskDone =
                      stepsWithCommand.length > 0 &&
                      completedStepsCount === stepsWithCommand.length

                    const titleParts = dir.title.split('—')
                    const stepNumberLabel =
                      titleParts[0]?.trim() || `Paso ${idx + 1}`
                    const stepTitleText =
                      titleParts.length > 1
                        ? titleParts.slice(1).join('—').trim()
                        : dir.title

                    return (
                      <div
                        key={idx}
                        className={`${styles.subphaseCard} ${
                          isSubtaskDone ? styles.subphaseCardDone : ''
                        }`}
                      >
                        <div className={styles.subphaseHeader}>
                          <div className={styles.subphaseTitleGroup}>
                            <span className={styles.subphaseNumber}>
                              {renderPlaybookMarkdown(stepNumberLabel, `sn-${subId}`)}
                            </span>
                            <h4 className={styles.subphaseTitle}>
                              {renderPlaybookMarkdown(stepTitleText, `st-${subId}`)}
                            </h4>
                          </div>

                          {/* Minimal Progress / Completion Indicator on each subtask */}
                          {stepsWithCommand.length > 0 && (
                            <div
                              className={`${styles.subtaskProgressBadge} ${
                                isSubtaskDone
                                  ? styles.subtaskProgressBadgeDone
                                  : completedStepsCount > 0
                                  ? styles.subtaskProgressBadgeActive
                                  : styles.subtaskProgressBadgePending
                              }`}
                              title={
                                isSubtaskDone
                                  ? `Sub-tarea completada (${completedStepsCount}/${stepsWithCommand.length})`
                                  : completedStepsCount > 0
                                  ? `Progreso de sub-tarea: ${completedStepsCount} de ${stepsWithCommand.length} completados`
                                  : `Sub-tarea pendiente (0 de ${stepsWithCommand.length})`
                              }
                            >
                              {isSubtaskDone ? (
                                <>
                                  <svg
                                    width="10"
                                    height="10"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3.2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                  >
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                  <span>{completedStepsCount}/{stepsWithCommand.length}</span>
                                </>
                              ) : (
                                <span>{completedStepsCount}/{stepsWithCommand.length}</span>
                              )}
                            </div>
                          )}
                        </div>

                        <p className={styles.subphaseText}>
                          {renderPlaybookMarkdown(dir.text, `dt-${subId}`)}
                        </p>

                        {/* Dedicated Action Buttons per Subphase */}
                        <div className={styles.subphaseButtonsRow}>
                          <button
                            type="button"
                            onClick={() => toggleSubphaseHint(subId)}
                            className={`${styles.subphaseBtn} ${
                              isHintOpen ? styles.subphaseBtnActive : ''
                            }`}
                            aria-expanded={isHintOpen}
                          >
                            <span>
                              {isHintOpen
                                ? 'Ocultar herramientas'
                                : 'Herramientas sugeridas'}
                            </span>
                            <DropdownChevron isOpen={isHintOpen} />
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleSubphaseSolution(subId)}
                            className={`${styles.subphaseBtn} ${
                              isSolOpen ? styles.subphaseBtnActive : ''
                            }`}
                            aria-expanded={isSolOpen}
                          >
                            <span>{isSolOpen ? 'Ocultar solución' : 'Solución'}</span>
                            <DropdownChevron isOpen={isSolOpen} />
                          </button>
                        </div>

                        {/* ── Dropdown: Herramientas Sugeridas ── */}
                        <div
                          className={`${styles.dropdownCollapseWrapper} ${
                            isHintOpen ? styles.dropdownCollapseWrapperOpen : ''
                          }`}
                          aria-hidden={!isHintOpen}
                        >
                          <div className={styles.dropdownCollapseInner}>
                            <div className={styles.subphaseDropdown}>
                              <div className={styles.dropdownHeader}>
                                <span className={styles.dropdownTitle}>
                                  Herramientas sugeridas
                                </span>
                              </div>

                              {subData.hints.length === 0 ? (
                                <p className={styles.emptyNote}>
                                  No hay herramientas registradas para este paso.
                                </p>
                              ) : (
                                <div className={styles.hintsList}>
                                  {subData.hints.map((hint, hIdx) => (
                                    <div key={hIdx} className={styles.hintItem}>
                                      <div className={styles.hintMeta}>
                                        <span className={styles.hintTool}>
                                          {renderPlaybookMarkdown(hint.tool, `ht-${subId}-${hIdx}`)}:
                                        </span>
                                        <span className={styles.hintDesc}>
                                          {renderPlaybookMarkdown(hint.description, `hd-${subId}-${hIdx}`)}
                                        </span>
                                      </div>
                                      {hint.command && (
                                        <div className={styles.codeBlockRow}>
                                          <code className={styles.codeSnippet}>
                                            {hint.command}
                                          </code>
                                          <button
                                            type="button"
                                            className={`${styles.inlineCopyBtn} ${
                                              copiedKey === `cmd-${subId}-${hIdx}`
                                                ? styles.inlineCopyBtnCopied
                                                : ''
                                            }`}
                                            onClick={() =>
                                              handleCopy(
                                                hint.command!,
                                                `cmd-${subId}-${hIdx}`
                                              )
                                            }
                                            title={
                                              copiedKey === `cmd-${subId}-${hIdx}`
                                                ? 'Copiado'
                                                : 'Copiar comando'
                                            }
                                            aria-label={
                                              copiedKey === `cmd-${subId}-${hIdx}`
                                                ? 'Copiado'
                                                : 'Copiar comando'
                                            }
                                          >
                                            {copiedKey === `cmd-${subId}-${hIdx}` ? (
                                              <CheckIcon size={12} />
                                            ) : (
                                              <CopyIcon size={12} />
                                            )}
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* ── Dropdown: Solución ── */}
                        <div
                          className={`${styles.dropdownCollapseWrapper} ${
                            isSolOpen ? styles.dropdownCollapseWrapperOpen : ''
                          }`}
                          aria-hidden={!isSolOpen}
                        >
                          <div className={styles.dropdownCollapseInner}>
                            <div className={styles.subphaseDropdown}>
                              <div className={styles.dropdownHeader}>
                                <span className={styles.dropdownTitle}>
                                  Solución y guía paso a paso
                                </span>
                              </div>

                              {!subData.guide ? (
                                <p className={styles.emptyNote}>
                                  No hay guía de solución registrada para este paso.
                                </p>
                              ) : (
                                <div className={styles.solutionContent}>
                                  {subData.guide.rationale && (
                                    <div className={styles.solutionRationale}>
                                      {renderPlaybookMarkdown(subData.guide.rationale, `sr-${subId}`)}
                                    </div>
                                  )}

                                  <div className={styles.stepsList}>
                                    {subData.guide.steps.map((step, sIdx) => {
                                      const matchedRule = findMatchingRule(
                                        phaseRules,
                                        subData.stepId,
                                        step.command
                                      )
                                      const isStepDone = Boolean(
                                        matchedRule && checkedItems[matchedRule.id]
                                      )

                                      return (
                                        <div
                                          key={sIdx}
                                          className={`${styles.stepItem} ${
                                            isStepDone ? styles.stepItemDone : ''
                                          }`}
                                        >
                                          <div className={styles.stepAction}>
                                            {isStepDone ? (
                                              <span
                                                className={styles.stepBulletDone}
                                                title={
                                                  matchedRule
                                                    ? `Sub-paso cumplido [${matchedRule.id}]`
                                                    : 'Sub-paso cumplido'
                                                }
                                                style={{
                                                  cursor:
                                                    matchedRule && !isLocked
                                                      ? 'pointer'
                                                      : 'default',
                                                }}
                                                onClick={() => {
                                                  if (matchedRule && !isLocked) {
                                                    toggleCheckItem(
                                                      matchedRule.id,
                                                      phase.id
                                                    )
                                                  }
                                                }}
                                              >
                                                ✓
                                              </span>
                                            ) : (
                                              <span
                                                className={styles.stepBullet}
                                                title={
                                                  matchedRule && !isLocked
                                                    ? `Marcar como verificado [${matchedRule.id}]`
                                                    : undefined
                                                }
                                                style={{
                                                  cursor:
                                                    matchedRule && !isLocked
                                                      ? 'pointer'
                                                      : 'default',
                                                }}
                                                onClick={() => {
                                                  if (matchedRule && !isLocked) {
                                                    toggleCheckItem(
                                                      matchedRule.id,
                                                      phase.id
                                                    )
                                                  }
                                                }}
                                              >
                                                →
                                              </span>
                                            )}
                                            <span>
                                              {renderPlaybookMarkdown(
                                                step.action,
                                                `sa-${subId}-${sIdx}`
                                              )}
                                            </span>
                                            {isStepDone && (
                                              <span className={styles.stepBadgeDone}>
                                                Cumplido
                                              </span>
                                            )}
                                          </div>
                                          {step.command && (
                                            <div className={styles.codeBlockRow}>
                                              <code
                                                className={`${styles.codeSnippet} ${
                                                  isStepDone
                                                    ? styles.codeSnippetDone
                                                    : ''
                                                }`}
                                              >
                                                {step.command}
                                              </code>
                                              <button
                                                type="button"
                                                className={`${styles.inlineCopyBtn} ${
                                                  copiedKey ===
                                                  `solcmd-${subId}-${sIdx}`
                                                    ? styles.inlineCopyBtnCopied
                                                    : ''
                                                }`}
                                                onClick={() =>
                                                  handleCopy(
                                                    step.command!,
                                                    `solcmd-${subId}-${sIdx}`
                                                  )
                                                }
                                                title={
                                                  copiedKey ===
                                                  `solcmd-${subId}-${sIdx}`
                                                    ? 'Copiado'
                                                    : 'Copiar comando'
                                                }
                                                aria-label={
                                                  copiedKey ===
                                                  `solcmd-${subId}-${sIdx}`
                                                    ? 'Copiado'
                                                    : 'Copiar comando'
                                                }
                                              >
                                                {copiedKey ===
                                                `solcmd-${subId}-${sIdx}` ? (
                                                  <CheckIcon size={12} />
                                                ) : (
                                                  <CopyIcon size={12} />
                                                )}
                                              </button>
                                            </div>
                                          )}
                                          {step.detail && (
                                            <div className={styles.stepDetail}>
                                              {renderPlaybookMarkdown(
                                                step.detail,
                                                `sd-${subId}-${sIdx}`
                                              )}
                                            </div>
                                          )}
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* ── Verification Checklist (Monochrome) ── */}
                {phase.verification && phase.verification.length > 0 && (
                  <div className={styles.verificationBox}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 6 }}>
                      <span className={styles.verificationTitle}>
                        Verificación de Fase {phase.number} ({phase.verification.filter((v) => checkedItems[v.id]).length} de {phase.verification.length}):
                      </span>
                    </div>

                    {isLocked ? (
                      <div className={styles.lockedBanner}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span>Fase bloqueada secuencialmente. Completa todas las verificaciones de la fase anterior para desbloquearla.</span>
                      </div>
                    ) : (
                      phase.verification.map((v) => {
                        const isChecked = Boolean(checkedItems[v.id])
                        return (
                          <div
                            key={v.id}
                            className={`${styles.verificationItem} ${
                              isChecked ? styles.verificationItemChecked : ''
                            }`}
                            onClick={() => toggleCheckItem(v.id, phase.id)}
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleCheckItem(v.id, phase.id)}
                            />
                            <span>{renderPlaybookMarkdown(v.label, `vl-${v.id}`)}</span>
                          </div>
                        )
                      })
                    )}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

function CopyIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width={13} height={13} x={9} y={9} rx={2} ry={2} />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function CheckIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default LiliumPlaybookApp
