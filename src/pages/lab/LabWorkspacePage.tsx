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
import { LABS } from '@/data/labsData'
import { COMPILED_LABS } from '@/data/compiledLabs'
import LabWorkspaceHeader from '@/components/lab-workspace/LabWorkspaceHeader'
import LabGuideSidebar from '@/components/lab-workspace/LabGuideSidebar'
import OSCanvas from '@/components/lab-workspace/OSCanvas'
import styles from './LabWorkspacePage.module.css'

export default function LabWorkspacePage() {
  const { labId } = useParams<{ labId: string }>()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const lab = LABS.find((l) => l.id === labId) ?? LABS[0]
  const compiled = COMPILED_LABS.find((l) => l.id === lab.id)

  const handleBack = () => navigate('/labs')

  return (
    <div className={styles.workspace}>
      <LabWorkspaceHeader
        lab={lab}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onBack={handleBack}
      />

      <div className={styles.body}>
        <LabGuideSidebar
          open={sidebarOpen}
          onToggle={() => setSidebarOpen((v) => !v)}
          lab={lab}
          compiled={compiled}
        />

        <OSCanvas labId={lab.id} />
      </div>
    </div>
  )
}
