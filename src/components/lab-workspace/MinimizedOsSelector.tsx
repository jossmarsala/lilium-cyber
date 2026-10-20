import { type ReactNode } from 'react'
import type { DemoThemeChoice } from '@react-ui-os/demo'
import styles from './MinimizedOsSelector.module.css'

interface MinimizedOsSelectorProps {
  currentTheme: DemoThemeChoice
  onThemeChange: (choice: DemoThemeChoice) => void
  className?: string
}

const OS_ITEMS: {
  id: DemoThemeChoice
  label: string
  nextLabel: string
  icon: (size?: number) => ReactNode
}[] = [
  {
    id: 'macos',
    label: 'macOS',
    nextLabel: 'Windows',
    icon: (size = 14) => (
      <svg width={size} height={size} viewBox="0 0 170 170" fill="currentColor" aria-hidden="true">
        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.05-7.66-7.85-11.9-14.4-5.44-8.38-9.76-17.75-12.96-28.11-3.2-10.36-4.8-20.2-4.8-29.54 0-14.44 3.59-26.04 10.77-34.8 7.18-8.76 16.34-13.26 27.5-13.5 5.02 0 10.51 1.25 16.48 3.75 5.97 2.5 10.02 3.82 12.16 3.96 1.7-.14 5.92-1.54 12.67-4.21 6.74-2.67 12.44-3.88 17.1-3.63 13.23.63 23.51 5.37 30.84 14.22-11.77 7.1-17.5 16.92-17.18 29.47.33 9.8 4.2 17.84 11.62 24.12 7.42 6.28 16.14 9.94 26.17 10.98-2.3 6.9-5.17 14.43-8.61 22.58zM119.22 31.84c0-7.39 2.65-14.34 7.95-20.85 5.3-6.51 11.85-10.51 19.64-12 0 .97.07 1.87.21 2.7-.28 7.25-2.99 14.15-8.14 20.7-5.15 6.55-11.75 10.37-19.8 11.45.09-.7.14-1.37.14-2z" />
      </svg>
    ),
  },
  {
    id: 'windows',
    label: 'Windows',
    nextLabel: 'Ubuntu',
    icon: (size = 14) => (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <path d="M0 0h7.2v7.2H0V0zm8.8 0H16v7.2H8.8V0zM0 8.8h7.2V16H0V8.8zm8.8 0H16V16H8.8V8.8z" />
      </svg>
    ),
  },
  {
    id: 'ubuntu',
    label: 'Ubuntu',
    nextLabel: 'macOS',
    icon: (size = 14) => (
      <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
        <circle cx="8" cy="8" r="6.8" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="8" cy="3.5" r="1.4" />
        <circle cx="4.1" cy="10.3" r="1.4" />
        <circle cx="11.9" cy="10.3" r="1.4" />
      </svg>
    ),
  },
]

const CYCLE_MAP: Record<DemoThemeChoice, DemoThemeChoice> = {
  macos: 'windows',
  windows: 'ubuntu',
  ubuntu: 'macos',
}

export default function MinimizedOsSelector({
  currentTheme,
  onThemeChange,
  className,
}: MinimizedOsSelectorProps) {
  const currentItem = OS_ITEMS.find((c) => c.id === currentTheme) ?? OS_ITEMS[0]

  const handleCycle = () => {
    const next = CYCLE_MAP[currentTheme] || 'macos'
    onThemeChange(next)
  }

  return (
    <button
      type="button"
      className={`${styles.osBtn} ${className || ''}`}
      onClick={handleCycle}
      title={`Entorno OS: ${currentItem.label} (clic para alternar a ${currentItem.nextLabel})`}
      aria-label={`Entorno OS: ${currentItem.label}. Clic para alternar a ${currentItem.nextLabel}`}
    >
      <span className={styles.iconWrapper}>
        {currentItem.icon(14)}
      </span>
    </button>
  )
}
