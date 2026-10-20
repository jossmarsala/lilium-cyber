import { buildDemoTheme, type DemoThemeChoice } from '@react-ui-os/demo'
import type { OsTheme } from '@react-ui-os/core'

/**
 * Builds the OsTheme with customized chrome metrics:
 * - menuBarHeight: 20px (reduced from 24px in macOS / 30px in Ubuntu) for a slimmer, more compact top navbar
 * - dockSmallButtons: 'always' for a more compact bottom taskbar on Windows styles (32px instead of 48px)
 */
export function buildCustomOsTheme(choice: DemoThemeChoice, assetBase: string): OsTheme {
  const baseTheme = buildDemoTheme(choice, assetBase)
  return {
    ...baseTheme,
    chrome: {
      ...baseTheme.chrome,
      menuBarHeight: 25,
      ...(choice === 'windows' ? { dockSmallButtons: 'always' } : {}),
    },
  }
}
