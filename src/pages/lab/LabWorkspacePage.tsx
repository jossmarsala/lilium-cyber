/**
 * LabWorkspacePage — renders the full lab environment shell.
 *
 * Route: /lab/:labId
 *
 * Layout:
 *   ┌─────────────────────────────────────────────────┐
 *   │  LabWorkspaceHeader (top bar)                    │
 *   ├────────────┬────────────────────────────────────┤
 *   │ LabGuide   │  OSCanvas (react-ui-os Desktop)     │
 *   │ Sidebar    │                                     │
 *   │ (collaps.) │                                     │
 *   └────────────┴────────────────────────────────────┘
 *
 * The OS desktop component lives only inside OSCanvas; the
 * surrounding chrome (header + sidebar) is fully external to it.
 */

import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  persistThemeChoice,
  readInitialThemeChoice,
  type DemoThemeChoice,
} from '@react-ui-os/demo'
import { LABS } from '@/data/labsData'
import LabWorkspaceHeader from '@/components/lab-workspace/LabWorkspaceHeader'
import OSCanvas from '@/components/lab-workspace/OSCanvas'
import styles from './LabWorkspacePage.module.css'

export default function LabWorkspacePage() {
  const { labId } = useParams<{ labId: string }>()
  const navigate = useNavigate()
  const [themeChoice, setThemeChoice] = useState<DemoThemeChoice>(readInitialThemeChoice)

  const lab = LABS.find((l) => l.id === labId) ?? LABS[0]

  const handleBack = () => navigate('/labs')

  const handleThemeChange = (choice: DemoThemeChoice) => {
    setThemeChoice(choice)
    persistThemeChoice(choice)
  }

  return (
    <div className={styles.workspace}>
      <LabWorkspaceHeader
        lab={lab}
        onBack={handleBack}
        themeChoice={themeChoice}
        onThemeChange={handleThemeChange}
      />

      <div className={styles.body}>
        <OSCanvas
          labId={lab.id}
          themeChoice={themeChoice}
          onThemeChange={handleThemeChange}
        />
      </div>
    </div>
  )
}

