import { useState, type ReactNode } from 'react'
import styles from './DeploymentGraphic.module.css'

export type LayerType = 'comprender' | 'implementar' | 'responder'

export interface DeploymentGraphicProps {
  isExternalHovered?: boolean
}

export default function DeploymentGraphic({ isExternalHovered }: DeploymentGraphicProps) {
  const [isInternalHovered, setIsInternalHovered] = useState(false)
  const [hoveredLayer, setHoveredLayer] = useState<LayerType | null>(null)

  const isHovered = Boolean(isExternalHovered || isInternalHovered)
  // Default active layer is 'comprender' when idle, or hovered layer
  const activeLayer: LayerType = hoveredLayer ?? (isHovered ? 'implementar' : 'comprender')

  // Contextual telemetry pill text based on active layer
  const telemetryByLayer: Record<LayerType, string> = {
    comprender: 'Descubrir entorno, activos y riesgos',
    implementar: 'Diseñar arquitectura y proteger',
    responder: 'Responder ante incidentes',
  }

  // Base Y coordinates
  const topCy = 65
  const midCy = 85
  const botCy = 105

  // Isometric slab geometry builder
  const renderSlab = (type: LayerType, cy: number, translateY: number, icon: ReactNode) => {
    const isActive = activeLayer === type

    // Clean light mode palette matching web design tokens:
    // Active slab: crisp pure white top face, soft grey bevels, elevated shadow
    // Inactive slab: soft light-zinc (#f4f4f5) top face, shaded bevels, muted icon
    const topFill = isActive ? '#ffffff' : '#f4f4f5'
    const leftFill = isActive ? '#f0f0f2' : '#e4e4e7'
    const rightFill = isActive ? '#e2e2e5' : '#d4d4d8'
    const strokeColor = isActive ? 'rgba(0, 0, 0, 0.16)' : 'rgba(0, 0, 0, 0.08)'
    const lineStroke = isActive ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.07)'
    const iconColor = isActive ? '#111111' : '#71717a'

    return (
      <g
        className={`${styles.slabGroup} ${isActive ? styles.slabActive : ''}`}
        style={{
          transform: `translateY(${translateY}px)`,
          filter: isActive
            ? 'drop-shadow(0 14px 24px rgba(0, 0, 0, 0.12))'
            : 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.04))',
        }}
        onMouseEnter={() => setHoveredLayer(type)}
        onMouseLeave={() => setHoveredLayer(null)}
      >
        {/* Technical connector guide line pointing toward side pill */}
        <line
          x1={175}
          y1={cy}
          x2={192}
          y2={cy}
          className={`${styles.connectorLine} ${isActive ? styles.connectorLineActive : ''}`}
        />
        <circle
          cx={192}
          cy={cy}
          r={isActive ? 2.2 : 1.4}
          className={`${styles.connectorDot} ${isActive ? styles.connectorDotActive : ''}`}
        />

        {/* Inner floating group with continuous out-of-phase levitation animation */}
        <g className={`${styles.slabFloat} ${styles[`slabFloat_${type}`]}`}>
          {/* Left 3D bevel face */}
          <path
            className={styles.slabLeftFace}
            d={`M 45 ${cy} L 110 ${cy + 33} L 110 ${cy + 46} L 45 ${cy + 13} Z`}
            fill={leftFill}
            stroke={strokeColor}
            strokeWidth="0.5"
          />

          {/* Right 3D bevel face */}
          <path
            className={styles.slabRightFace}
            d={`M 110 ${cy + 33} L 175 ${cy} L 175 ${cy + 13} L 110 ${cy + 46} Z`}
            fill={rightFill}
            stroke={strokeColor}
            strokeWidth="0.5"
          />

          {/* Top diamond face */}
          <path
            className={styles.slabTopFace}
            d={`M 110 ${cy - 33} L 175 ${cy} L 110 ${cy + 33} L 45 ${cy} Z`}
            fill={topFill}
            stroke={strokeColor}
            strokeWidth="0.8"
          />

          {/* Diagonal center split line */}
          <line
            className={styles.slabLine}
            x1={77.5}
            y1={cy - 16.5}
            x2={142.5}
            y2={cy + 16.5}
            stroke={lineStroke}
            strokeWidth="0.8"
          />

          {/* Center isometric icon */}
          <g className={styles.slabIcon} style={{ color: iconColor, stroke: iconColor }}>
            {icon}
          </g>
        </g>
      </g>
    )
  }

  // Vertical offsets when hovered vs idle (layers spread subtly on hover)
  const topOffsetY = isHovered ? -26 : 0
  const midOffsetY = 0
  const botOffsetY = isHovered ? 26 : 0

  return (
    <div
      className={`${styles.container} ${isHovered ? styles.containerHovered : ''}`}
      onMouseEnter={() => setIsInternalHovered(true)}
      onMouseLeave={() => {
        setIsInternalHovered(false)
        setHoveredLayer(null)
      }}
    >
      {/* Background dot grid */}
      <div className={styles.dotGrid} />

      {/* Dashed orbit ring with slow ambient rotation */}
      <div className={styles.orbitRing} />

      {/* 3D Isometric Stack SVG */}
      <svg
        className={styles.stackSvg}
        viewBox="0 0 220 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <filter id="groundBlur" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" />
          </filter>
        </defs>

        {/* Diffuse Ground Shadow Ellipse beneath stack (softly breathing) */}
        <ellipse
          cx="110"
          cy={148 + (isHovered ? 12 : 0)}
          rx={isHovered ? 52 : 44}
          ry={isHovered ? 13 : 11}
          fill="rgba(0, 0, 0, 0.07)"
          filter="url(#groundBlur)"
          className={styles.groundShadow}
        />

        {/* Vertical dotted connector axis visible through stack */}
        <line
          x1="110"
          y1={topCy + topOffsetY + 10}
          x2="110"
          y2={botCy + botOffsetY - 8}
          stroke="rgba(0, 0, 0, 0.22)"
          strokeWidth="1"
          strokeDasharray="2 3"
          className={`${styles.verticalGuide} ${isHovered ? styles.guideVisible : ''}`}
        />

        {/* Continuous signal pulse packet traveling down the central axis */}
        <g
          className={`${styles.signalPacketGroup} ${
            isHovered ? styles.signalPacketGroupHovered : ''
          }`}
          style={{ transform: `translate(110px, ${topCy + topOffsetY + 10}px)` }}
        >
          <circle cx="0" cy="0" r="2.2" className={styles.signalPacketDot} />
          <circle cx="0" cy="0" r="4.5" className={styles.signalPacketHalo} />
        </g>

        {/* Bottom layer: 3. Responder (Threat response lightning bolt) */}
        {renderSlab(
          'responder',
          botCy,
          botOffsetY,
          <g strokeWidth="1.2" fill="none">
            <path
              d={`M 111.8 ${botCy - 7.5} L 105.5 ${botCy} L 109.5 ${botCy} L 108.2 ${botCy + 7.5} L 115 ${botCy - 0.5} L 111 ${botCy - 0.5} Z`}
              stroke="currentColor"
              strokeWidth="1.3"
              fill="currentColor"
              strokeLinejoin="round"
              strokeLinecap="round"
              className={styles.lightningIcon}
            />
          </g>
        )}

        {/* Middle layer: 2. Implementar (Security defense shield with checkmark) */}
        {renderSlab(
          'implementar',
          midCy,
          midOffsetY,
          <g strokeWidth="1.2" fill="none">
            <path
              d={`M 110 ${midCy - 6.5} L 117 ${midCy - 3} L 117 ${midCy + 2.5} C 117 ${midCy + 6.8} 110 ${midCy + 8.8} 110 ${midCy + 8.8} C 110 ${midCy + 8.8} 103 ${midCy + 6.8} 103 ${midCy + 2.5} L 103 ${midCy - 3} Z`}
              stroke="currentColor"
              strokeWidth="1.3"
              fill="none"
            />
            <path
              d={`M 106.8 ${midCy - 0.2} L 109.2 ${midCy + 2.2} L 113.4 ${midCy - 2}`}
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        )}

        {/* Top layer: 1. Comprender (Perimeter radar / visibility scanning reticle) */}
        {renderSlab(
          'comprender',
          topCy,
          topOffsetY,
          <g strokeWidth="1.2" fill="none">
            <ellipse
              cx="110"
              cy={topCy}
              rx="8.5"
              ry="8.5"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeDasharray="2 2"
            />
            <circle cx="110" cy={topCy} r="1.1" fill="currentColor" className={styles.radarBlip} />
          </g>
        )}
      </svg>

      {/* Right side interactive phase buttons */}
      <div className={styles.sidePills}>
        <button
          type="button"
          className={`${styles.pill} ${
            activeLayer === 'comprender' ? styles.pillActive : styles.pillInactive
          }`}
          onMouseEnter={() => setHoveredLayer('comprender')}
          onMouseLeave={() => setHoveredLayer(null)}
          onClick={() => setHoveredLayer('comprender')}
        >
          <span>Comprender</span>
          <span className={styles.pillBadge}>01</span>
        </button>
        <button
          type="button"
          className={`${styles.pill} ${
            activeLayer === 'implementar' ? styles.pillActive : styles.pillInactive
          }`}
          onMouseEnter={() => setHoveredLayer('implementar')}
          onMouseLeave={() => setHoveredLayer(null)}
          onClick={() => setHoveredLayer('implementar')}
        >
          <span>Implementar</span>
          <span className={styles.pillBadge}>02</span>
        </button>
        <button
          type="button"
          className={`${styles.pill} ${
            activeLayer === 'responder' ? styles.pillActive : styles.pillInactive
          }`}
          onMouseEnter={() => setHoveredLayer('responder')}
          onMouseLeave={() => setHoveredLayer(null)}
          onClick={() => setHoveredLayer('responder')}
        >
          <span>Responder</span>
          <span className={styles.pillBadge}>03</span>
        </button>
      </div>

      {/* Bottom telemetry pill with active stage indicator */}
      <div className={`${styles.bottomPill} ${isHovered ? styles.bottomPillHovered : ''}`}>
        <span className={styles.bottomTelemetryText}>{telemetryByLayer[activeLayer]}</span>
        <span className={styles.bottomStepBadge}>
          {activeLayer === 'comprender'
            ? 'Paso 1'
            : activeLayer === 'implementar'
              ? 'Paso 2'
              : 'Paso 3'}
        </span>
      </div>
    </div>
  )
}
