import { useState, useEffect } from 'react'
import styles from './CablesGraphic.module.css'

export interface CablesGraphicProps {
  isExternalHovered?: boolean
}

const TOOLS = [
  {
    name: 'Wazuh',
    badge: 'SIEM',
    title: 'Wazuh · Plataforma SIEM y XDR de código abierto',
    icon: (
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    name: 'Suricata',
    badge: 'IDS',
    title: 'Suricata · Motor IDS/IPS y monitoreo de tráfico',
    icon: (
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    name: 'Wireshark',
    badge: 'PCAP',
    title: 'Wireshark · Análisis e inspección profunda de paquetes',
    icon: (
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
  {
    name: 'pfSense',
    badge: 'FW',
    title: 'pfSense · Cortafuegos perimetral y enrutamiento seguro',
    icon: (
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
  },
]

export default function CablesGraphic({ isExternalHovered }: CablesGraphicProps) {
  const [isInternalHovered, setIsInternalHovered] = useState(false)
  const [hoveredSource, setHoveredSource] = useState<number | null>(null)
  const isHovered = Boolean(isExternalHovered || isInternalHovered)

  // Staged progression as tools are added when hovered
  const [activeStage, setActiveStage] = useState(0)

  useEffect(() => {
    if (!isHovered) {
      setActiveStage(0)
      return
    }

    // Sequentially add tools when hovered
    setActiveStage(1)
    const t1 = setTimeout(() => setActiveStage(2), 350)
    const t2 = setTimeout(() => setActiveStage(3), 700)
    const t3 = setTimeout(() => setActiveStage(4), 1050)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [isHovered])

  // Progress percentage advances as tools are added
  const progressPercent = !isHovered
    ? 10
    : activeStage === 1
      ? 32
      : activeStage === 2
        ? 55
        : activeStage === 3
          ? 78
          : 99

  // Bezier curve paths converging from the 4 pills to Connect
  const cable1 = 'M 60 31 C 60 54, 195 57, 240 58'
  const cable2 = 'M 180 31 C 180 50, 225 55, 240 58'
  const cable3 = 'M 300 31 C 300 50, 255 55, 240 58'
  const cable4 = 'M 420 31 C 420 54, 285 57, 240 58'
  const verticalCable = 'M 240 82 L 240 122'

  const cables = [cable1, cable2, cable3, cable4]

  const isToolActive = (idx: number) => isHovered && (activeStage > idx || hoveredSource === idx)

  return (
    <div
      className={`${styles.container} ${isHovered ? styles.containerHovered : ''}`}
      onMouseEnter={() => setIsInternalHovered(true)}
      onMouseLeave={() => {
        setIsInternalHovered(false)
        setHoveredSource(null)
      }}
    >
      {/* Background radial dot grid */}
      <div className={styles.dotGrid} />

      {/* Top 4 source pills with open-source cybersecurity tools */}
      <div className={styles.topPillsRow}>
        {TOOLS.map((tool, idx) => {
          const active = isToolActive(idx)
          return (
            <div
              key={tool.name}
              className={`${styles.sourcePill} ${active ? styles.sourcePillActive : ''}`}
              onMouseEnter={() => setHoveredSource(idx)}
              onMouseLeave={() => setHoveredSource(null)}
              title={tool.title}
            >
              <span className={styles.sourcePillLeft}>
                {tool.icon}
                <span>{tool.name}</span>
              </span>
              <span className={styles.sourcePillBadge}>{tool.badge}</span>
            </div>
          )
        })}
      </div>

      {/* Converging animated flowing cables */}
      <svg
        className={styles.cablesSvg}
        viewBox="0 0 480 168"
        preserveAspectRatio="none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Base static tracks */}
        {cables.map((d, i) => (
          <path
            key={`track-${i}`}
            d={d}
            className={`${styles.cableTrack} ${isToolActive(i) ? styles.cableTrackActive : ''}`}
          />
        ))}
        <path
          d={verticalCable}
          className={`${styles.cableTrack} ${
            isHovered && activeStage >= 4 ? styles.cableTrackActive : ''
          }`}
        />

        {/* Animated flowing beams: subtle continuous flow on idle, intensified sequential activation on hover */}
        {cables.map((d, i) => (
          <path
            key={`beam-${i}`}
            d={d}
            pathLength={100}
            className={`${styles.cableBeam} ${isToolActive(i) ? styles.cableBeamActive : ''}`}
            style={{ animationDelay: `${i * 0.25}s` }}
          />
        ))}

        {/* Vertical beam down to destination sync panel */}
        <path
          d={verticalCable}
          pathLength={100}
          className={`${styles.cableBeam} ${
            isHovered && activeStage >= 4 ? styles.cableBeamActive : ''
          }`}
          style={{ animationDelay: '1.05s' }}
        />
      </svg>

      {/* Center branching "Código Abierto" button */}
      <div className={styles.connectWrapper}>
        <div
          className={`${styles.connectButton} ${
            isHovered && activeStage >= 4 ? styles.connectButtonActive : ''
          }`}
          title="Ecosistema 100% de Código Abierto"
        >
          <span className={styles.connectButtonLeft}>
            {/* Git branching open-source icon */}
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="18" r="3" />
              <circle cx="6" cy="6" r="3" />
              <circle cx="18" cy="6" r="3" />
              <path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9" />
              <path d="M12 12v3" />
            </svg>
            <span>Código Abierto</span>
          </span>
        </div>
      </div>

      {/* Bottom destination status panel with animated progress bar */}
      <div className={styles.syncPanel}>
        <div className={styles.syncHeader}>
          <div className={styles.syncTitle}>
            <span className={styles.greenDot} />
            <span>Arquitectura de seguridad</span>
          </div>
          <span className={styles.syncCount}>{progressPercent}% segura</span>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressBar} style={{ width: `${progressPercent}%` }}>
            <div className={styles.progressShimmer} />
          </div>
        </div>
      </div>
    </div>
  )
}
