/**
 * LabWorkspaceHeader — top navigation bar for the interactive lab shell.
 * Reuses the actual NavBar shape design (floating white bar with inverted radius ears,
 * drop-shadow, curved bottom corners).
 *
 * Layout:
 *  - Left: Lilium logo
 *  - Middle: Lab name and number (nothing else)
 *  - Right: Volver y Reiniciar buttons
 */

import { Link } from 'react-router-dom'
import { HugeiconsIcon, type IconSvgElement } from '@hugeicons/react'
import { ArrowLeft01Icon, Refresh01Icon } from '@hugeicons/core-free-icons'
import LiliumIcon from '@/components/LiliumIcon'
import type { LabItem } from '@/data/labsData'
import type { DemoThemeChoice } from '@react-ui-os/demo'
import MinimizedOsSelector from '@/components/lab-workspace/MinimizedOsSelector'
import styles from './LabWorkspaceHeader.module.css'

interface LabWorkspaceHeaderProps {
  lab: LabItem
  onBack: () => void
  themeChoice?: DemoThemeChoice
  onThemeChange?: (choice: DemoThemeChoice) => void
}

export default function LabWorkspaceHeader({
  lab,
  onBack,
  themeChoice,
  onThemeChange,
}: LabWorkspaceHeaderProps) {
  // Format lab number, e.g. "lab-01" -> "01"
  const labNum = lab.id.replace(/^lab-/, '').padStart(2, '0')

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="Navegación del laboratorio">
        {/* Left: Lilium logo */}
        <Link to="/" className={styles.brandContainer} aria-label="Lilium Playbook">
          <div className={styles.brand}>
            <LiliumIcon size={20} className={styles.brandIcon} alt="Lilium logo" />
            <span className={styles.brandText}>
              <span className={styles.brandName}>lilium</span>
            </span>
          </div>
        </Link>

        {/* Middle: Lab name and number (nothing else) */}
        <div className={styles.middle}>
          <div className={styles.labTitle}>
            <span className={styles.labNumber}>Lab {labNum}</span>
            <span className={styles.labSep}>·</span>
            <span className={styles.labName}>{lab.title}</span>
          </div>
        </div>

        {/* Right: Volver y Reiniciar buttons */}
        <div className={styles.rightActions}>
          <button
            type="button"
            className={styles.volverBtn}
            onClick={onBack}
            title="Volver a los laboratorios"
            aria-label="Volver a los laboratorios"
          >
            <HugeiconsIcon
              icon={ArrowLeft01Icon as IconSvgElement}
              size={15}
              strokeWidth={2}
            />
            <span className={styles.btnLabel}>Volver</span>
          </button>

          {themeChoice && onThemeChange && (
            <MinimizedOsSelector
              currentTheme={themeChoice}
              onThemeChange={onThemeChange}
            />
          )}

          <button
            type="button"
            className={styles.reiniciarBtn}
            onClick={() => window.location.reload()}
            title="Reiniciar entorno"
            aria-label="Reiniciar entorno"
          >
            <HugeiconsIcon
              icon={Refresh01Icon as IconSvgElement}
              size={14}
              strokeWidth={2}
            />
            <span className={styles.btnLabel}>Reiniciar</span>
          </button>
        </div>
      </nav>
    </header>
  )
}
