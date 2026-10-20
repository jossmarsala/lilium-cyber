/**
 * LabWorkspaceHeader — top navigation bar for the interactive lab shell.
 *
 * Contains:
 *  - "Back to Playbook" arrow button (navigates to /labs)
 *  - LILIUM logo + module badge + lab title
 *  - Sidebar toggle, environment status pill, reset button, progress counter
 */

import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import {
  ArrowLeft01Icon,
  SidebarLeftIcon,
  Refresh01Icon,
  CheckmarkCircle01Icon,
  FlaskConicalIcon,
} from '@hugeicons/core-free-icons'
import LiliumIcon from '@/components/LiliumIcon'
import type { LabItem } from '@/data/labsData'
import styles from './LabWorkspaceHeader.module.css'

interface LabWorkspaceHeaderProps {
  lab: LabItem
  sidebarOpen: boolean
  onToggleSidebar: () => void
  onBack: () => void
}

/** Map lab id → module number string e.g. "01. UNDERSTAND" */
function getModuleBadge(lab: LabItem): string {
  const num = lab.id.replace('lab-', '')
  const labels: Record<string, string> = {
    '01': '01. ENTENDER',
    '02': '02. DEFENDER',
    '03': '03. ANALIZAR',
    '04': '04. ARQUITECTURA',
    '05': '05. DETECTAR',
    '06': '06. RESPONDER',
  }
  return labels[num] ?? `${num}. LAB`
}

export default function LabWorkspaceHeader({
  lab,
  sidebarOpen,
  onToggleSidebar,
  onBack,
}: LabWorkspaceHeaderProps) {
  const moduleBadge = getModuleBadge(lab)
  const completedSteps = lab.completedSteps ?? 0
  const totalSteps = lab.totalSteps ?? 0

  return (
    <header className={styles.header} role="banner">
      {/* ── Left cluster ── */}
      <div className={styles.left}>
        {/* Back button */}
        <button
          type="button"
          className={styles.backBtn}
          onClick={onBack}
          aria-label="Volver al Playbook"
          title="Volver al Playbook"
        >
          <HugeiconsIcon
            icon={ArrowLeft01Icon as IconSvgElement}
            size={15}
            strokeWidth={2}
          />
          <span className={styles.backLabel}>Laboratorios</span>
        </button>

        <span className={styles.divider} aria-hidden="true" />

        {/* Sidebar toggle */}
        <button
          type="button"
          className={`${styles.iconBtn} ${sidebarOpen ? styles.iconBtnActive : ''}`}
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? 'Colapsar guía' : 'Desplegar guía'}
          title={sidebarOpen ? 'Colapsar guía' : 'Desplegar guía'}
        >
          <HugeiconsIcon
            icon={SidebarLeftIcon as IconSvgElement}
            size={15}
            strokeWidth={1.8}
          />
        </button>
      </div>

      {/* ── Center identity ── */}
      <div className={styles.center}>
        <div className={styles.brand}>
          <LiliumIcon size={16} alt="Lilium" />
          <span className={styles.brandName}>lilium</span>
        </div>

        <span className={styles.centerSep} aria-hidden="true">/</span>

        <span className={styles.moduleBadge}>
          <HugeiconsIcon
            icon={FlaskConicalIcon as IconSvgElement}
            size={11}
            strokeWidth={1.8}
            aria-hidden="true"
          />
          {moduleBadge}
        </span>

        <span className={styles.centerSep} aria-hidden="true">/</span>

        <span className={styles.labTitle}>{lab.title}</span>
      </div>

      {/* ── Right controls ── */}
      <div className={styles.right}>
        {/* Environment status */}
        <div className={styles.statusPill} title="Entorno de lab activo">
          <span className={styles.statusDot} aria-hidden="true" />
          <span>Entorno activo</span>
        </div>

        {/* Progress tracker */}
        <div className={styles.progressGroup} aria-label={`Progreso: ${completedSteps} de ${totalSteps} pasos`}>
          <HugeiconsIcon
            icon={CheckmarkCircle01Icon as IconSvgElement}
            size={13}
            strokeWidth={1.8}
            aria-hidden="true"
          />
          <span className={styles.progressLabel}>
            {completedSteps}/{totalSteps}
          </span>
          <div
            className={styles.progressBar}
            role="progressbar"
            aria-valuenow={completedSteps}
            aria-valuemin={0}
            aria-valuemax={totalSteps}
          >
            <div
              className={styles.progressFill}
              style={{ width: totalSteps > 0 ? `${(completedSteps / totalSteps) * 100}%` : '0%' }}
            />
          </div>
        </div>

        {/* Reset environment */}
        <button
          type="button"
          className={styles.resetBtn}
          title="Reiniciar entorno de lab"
          aria-label="Reiniciar entorno"
          onClick={() => window.location.reload()}
        >
          <HugeiconsIcon
            icon={Refresh01Icon as IconSvgElement}
            size={13}
            strokeWidth={2}
          />
          <span>Reiniciar</span>
        </button>
      </div>
    </header>
  )
}
