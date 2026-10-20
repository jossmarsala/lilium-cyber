/**
 * OSCanvas — framed viewport container for the react-ui-os Desktop component.
 *
 * The Desktop fills this container entirely; the canvas itself fills the
 * remaining workspace width/height after the header and sidebar.
 * Overflow is clipped so the OS manages its own scrolling internally.
 */

import { useEffect, useMemo, useState } from 'react'
import type { App as OsApp, OsTheme } from '@react-ui-os/core'
import { useWindowManager } from '@react-ui-os/core'
import {
  Desktop,
  pickInitialBounds,
  registerSystemWindow,
  useApps,
  useDesktopContext,
  useTheme,
} from '@react-ui-os/desktop'
import {
  applyDemoIcons,
  applyDemoSettingsIcon,
  buildDemoTheme,
  localIcon,
  persistThemeChoice,
  readInitialThemeChoice,
  type DemoThemeChoice,
} from '@react-ui-os/demo'
import { exampleApps } from '@react-ui-os/example-apps'
import { liliumTerminalApp } from '@/os-apps/terminal'
import { liliumPlaybookApp } from '@/os-apps/playbook'
import { notesApp } from '@/os-apps/notes'
import { seedLabNotes } from '@/pages/desktop/seedLabNotes'
import { hasRecents } from '@/pages/desktop/recents'
import { RecentsFolder } from '@/pages/desktop/RecentsFolder'
import { RecentsIcon } from '@/pages/desktop/RecentsIcon'
import { StartRecents } from '@/pages/desktop/StartRecents'
import { ThemeSwitcher } from '@/pages/desktop/ThemeSwitcher'
import { UbuntuQuickSettings } from '@/pages/desktop/UbuntuQuickSettings'
import { labVerificationEngine } from '@/services/verification'
import styles from './OSCanvas.module.css'

const ASSET_BASE = '/'

// Register system windows once at module load (idempotent-safe because
// registerSystemWindow ignores duplicate registrations by id).
registerSystemWindow('recents', {
  name: 'Recents',
  tagline: 'Recently created items',
  accent: '#6b8afd',
  defaultBounds: { w: 560, h: 420 },
  content: RecentsFolder,
  icon: RecentsIcon,
  icons: { fluent: localIcon(`${ASSET_BASE}local/win11/recents.png`, RecentsIcon) },
  appearsAsDesktopIcon: (storage) => hasRecents(storage),
})

applyDemoSettingsIcon(ASSET_BASE)

function DesktopInitializer() {
  const { storage } = useDesktopContext()
  useEffect(() => {
    seedLabNotes(storage)
    labVerificationEngine.evaluate()
  }, [storage])
  return null
}

const desktopApps: OsApp[] = [
  liliumPlaybookApp,
  liliumTerminalApp,
  notesApp,
  ...exampleApps.filter((app) => app.id !== 'terminal' && app.id !== 'notes'),
]

const apps: OsApp[] = applyDemoIcons(desktopApps, ASSET_BASE)

function LabAutoLauncher() {
  const { openWindow, state } = useWindowManager()
  const appsCtx = useApps()
  const theme = useTheme()

  useEffect(() => {
    if (state.windows.length === 0) {
      const leftX = Math.max(20, Math.floor((window.innerWidth - 1340) / 2))
      const playbookW = Math.min(580, Math.floor(window.innerWidth * 0.46))
      const terminalW = Math.min(780, Math.floor(window.innerWidth * 0.54))
      const targetH = Math.min(650, window.innerHeight - 110)

      const playbookBounds = pickInitialBounds(
        { kind: 'app', appId: 'playbook' },
        theme,
        appsCtx,
        undefined,
        0
      )
      openWindow(
        { kind: 'app', appId: 'playbook' },
        { ...playbookBounds, x: leftX, y: 48, w: playbookW, h: targetH }
      )

      const termBounds = pickInitialBounds(
        { kind: 'app', appId: 'terminal' },
        theme,
        appsCtx,
        undefined,
        1
      )
      openWindow(
        { kind: 'app', appId: 'terminal' },
        { ...termBounds, x: leftX + playbookW + 16, y: 48, w: terminalW, h: targetH }
      )
    }
  }, [state.windows.length, openWindow, theme, appsCtx])

  return null
}

export const OPEN_OS_APP_EVENT = 'lilium:open-os-app'

export function triggerOpenOsApp(appId: string) {
  window.dispatchEvent(new CustomEvent(OPEN_OS_APP_EVENT, { detail: { appId } }))
}

function ExternalAppLauncher() {
  const { openWindow, focusWindow, restoreWindow, windows } = useWindowManager()
  const appsCtx = useApps()
  const theme = useTheme()

  useEffect(() => {
    const handleOpen = (e: Event) => {
      const { appId } = (e as CustomEvent<{ appId: string }>).detail
      if (!appId) return

      let targetId = appId.toLowerCase()
      if (targetId === 'term' || targetId === 'terminal') targetId = 'terminal'
      if (targetId === 'notes' || targetId === 'bitacora' || targetId === 'bitácora') targetId = 'notes'
      if (targetId === 'playbook') targetId = 'playbook'

      const existing = windows.find(
        (w) => w.payload.kind === 'app' && w.payload.appId === targetId
      )
      if (existing) {
        restoreWindow(existing.id)
        focusWindow(existing.id)
        return
      }

      const bounds = pickInitialBounds(
        { kind: 'app', appId: targetId },
        theme,
        appsCtx,
        undefined,
        windows.length
      )
      openWindow({ kind: 'app', appId: targetId }, bounds)
    }

    window.addEventListener(OPEN_OS_APP_EVENT, handleOpen)
    return () => window.removeEventListener(OPEN_OS_APP_EVENT, handleOpen)
  }, [openWindow, focusWindow, restoreWindow, windows, theme, appsCtx])

  return null
}

interface OSCanvasProps {
  /** Lab id passed for context — unused in render, reserved for future per-lab config */
  labId: string
}

export default function OSCanvas({ labId: _labId }: OSCanvasProps) {
  const [themeChoice, setThemeChoice] = useState<DemoThemeChoice>(readInitialThemeChoice)
  const theme = useMemo<OsTheme>(
    () => buildDemoTheme(themeChoice, ASSET_BASE),
    [themeChoice]
  )

  const handleThemeChange = (choice: DemoThemeChoice) => {
    setThemeChoice(choice)
    persistThemeChoice(choice)
  }

  return (
    <div className={styles.canvasFrame}>
      <Desktop apps={apps} theme={theme}>
        <DesktopInitializer />
        {themeChoice === 'ubuntu' && <UbuntuQuickSettings />}
        <StartRecents />
        <ThemeSwitcher value={themeChoice} onChange={handleThemeChange} />
        <LabAutoLauncher />
        <ExternalAppLauncher />
      </Desktop>
    </div>
  )
}
