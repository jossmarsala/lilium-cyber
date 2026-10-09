import React, { useState, useRef, useCallback } from 'react'
import styles from './SearchPreviewGraphic.module.css'

export interface SearchPreviewGraphicProps {
  isExternalHovered?: boolean
}

const IDLE_POS = { x: 24, y: 18 }

export default function SearchPreviewGraphic({ isExternalHovered }: SearchPreviewGraphicProps) {
  const sheetRef = useRef<HTMLDivElement>(null)
  const [isInternalHovered, setIsInternalHovered] = useState(false)
  const [activePill, setActivePill] = useState<string | null>(null)
  // Magnifier position: starts at idle floating anchor, tracks close to cursor on hover
  const [magnifierPos, setMagnifierPos] = useState(IDLE_POS)
  const [hoverLineIndex, setHoverLineIndex] = useState<number | null>(null)

  const isHovered = Boolean(isExternalHovered || isInternalHovered)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!sheetRef.current) return
    const rect = sheetRef.current.getBoundingClientRect()
    const relX = e.clientX - rect.left
    const relY = e.clientY - rect.top

    // Center of lens circle is (24, 24) inside the 64x64 lensWrapper.
    // Placing lens directly under cursor so hover interaction is close to cursor:
    const targetX = Math.round(relX - 24)
    const targetY = Math.round(relY - 24)

    // Allow magnifier to float a bit off the paper edges when following cursor:
    const clampedX = Math.max(-20, Math.min(rect.width - 18, targetX))
    const clampedY = Math.max(-16, Math.min(rect.height - 16, targetY))

    setMagnifierPos({ x: clampedX, y: clampedY })

    // Determine which line is currently under the magnifying lens
    const lensCenterY = clampedY + 24
    const lineIndex =
      lensCenterY < 42 ? 1 :
      lensCenterY < 56 ? 2 :
      lensCenterY < 70 ? 3 :
      lensCenterY < 84 ? 4 :
      lensCenterY < 98 ? 5 :
      lensCenterY < 112 ? 6 :
      lensCenterY < 126 ? 7 : 8
    setHoverLineIndex(lineIndex)
  }, [])

  const handleMouseEnter = () => {
    setIsInternalHovered(true)
  }

  const handleMouseLeave = () => {
    setIsInternalHovered(false)
    setMagnifierPos(IDLE_POS)
    setHoverLineIndex(null)
  }

  return (
    <div
      className={`${styles.container} ${isHovered ? styles.containerHovered : ''} ${
        isInternalHovered ? styles.containerInternalHovered : ''
      }`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Background dot grid */}
      <div className={styles.dotGrid} />

      {/* Dashed circular orbit ring */}
      <div className={styles.orbitRing} />

      {/* Top Pills: 6 módulos */}
      <div className={styles.topPillsRow}>
        <div
          className={`${styles.topPill} ${activePill === 'modulos' ? styles.topPillActive : ''}`}
          onMouseEnter={() => setActivePill('modulos')}
          onMouseLeave={() => setActivePill(null)}
          title="6 módulos estructurados de ciberseguridad"
        >
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
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
          <span>6 módulos</span>
        </div>
      </div>

      {/* Layered Document Sheet Stack */}
      <div className={styles.docWrapper}>
        {/* Layer 2 back sheet */}
        <div className={styles.docSheetBack2} />
        {/* Layer 1 mid sheet */}
        <div className={styles.docSheetBack1} />

        {/* Primary Document Sheet */}
        <div ref={sheetRef} className={styles.docSheet}>
          {/* Document Header */}
          <div className={styles.docHeader}>
            <div className={styles.docHeaderLeft}>
              <span className={styles.docHeaderDot} />
              <span className={styles.docHeaderTitle}>Docs</span>
            </div>
            <span className={styles.docHeaderBadge}>v1.0</span>
          </div>

          {/* Skeleton lines resembling text spread across full height of paper */}
          <div className={styles.linesList}>
            <div
              className={`${styles.docLine} ${styles.line1} ${
                hoverLineIndex === 1 ? styles.docLineActive : ''
              }`}
            />
            <div
              className={`${styles.docLine} ${styles.line2} ${
                hoverLineIndex !== null
                  ? hoverLineIndex === 2
                    ? styles.docLineActive
                    : ''
                  : styles.line2Ambient
              }`}
            />
            <div
              className={`${styles.docLine} ${styles.line3} ${
                hoverLineIndex === 3 ? styles.docLineActive : ''
              }`}
            />
            <div
              className={`${styles.docLine} ${styles.line4} ${
                hoverLineIndex !== null
                  ? hoverLineIndex === 4
                    ? styles.docLineActive
                    : ''
                  : styles.line4Ambient
              }`}
            />
            <div
              className={`${styles.docLine} ${styles.line5} ${
                hoverLineIndex !== null
                  ? hoverLineIndex === 5
                    ? styles.docLineActive
                    : ''
                  : styles.line5Ambient
              }`}
            />
            <div
              className={`${styles.docLine} ${styles.line6} ${
                hoverLineIndex === 6 ? styles.docLineActive : ''
              }`}
            />
            <div
              className={`${styles.docLine} ${styles.line7} ${
                hoverLineIndex !== null
                  ? hoverLineIndex === 7
                    ? styles.docLineActive
                    : ''
                  : styles.line7Ambient
              }`}
            />
            <div
              className={`${styles.docLine} ${styles.line8} ${
                hoverLineIndex === 8 ? styles.docLineActive : ''
              }`}
            />
          </div>

          {/* Animated Magnifier Assembly: Tracks close to cursor on hover, floats organically on idle */}
          <div
            className={styles.magnifierAssemblyParallax}
            style={{
              transform: `translate3d(${magnifierPos.x}px, ${magnifierPos.y}px, 0)`,
              transition: isInternalHovered
                ? 'transform 0.08s cubic-bezier(0.2, 0, 0, 1)'
                : 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            <div className={styles.magnifierAssembly}>
            {/* Integrated SVG Magnifying Glass with properly attached handle */}
            <div className={styles.lensWrapper}>
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                className={styles.lensSvg}
              >
                <defs>
                  <radialGradient id="lensGlassGrad" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                    <stop offset="55%" stopColor="#ffffff" stopOpacity="0.28" />
                    <stop offset="100%" stopColor="#e4e4e7" stopOpacity="0.12" />
                  </radialGradient>
                  <linearGradient id="lensReflectionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="75%" stopColor="#ffffff" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Metal collar joint seamlessly connecting rim to handle */}
                <rect
                  x="35"
                  y="37"
                  width="6"
                  height="4"
                  rx="1"
                  transform="rotate(45 38 39)"
                  fill="#111111"
                />

                {/* Handle bar angled at 45 degrees with rounded cap */}
                <line
                  x1="39"
                  y1="39"
                  x2="57"
                  y2="57"
                  stroke="#111111"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                {/* Specular grip line along handle */}
                <line
                  x1="41"
                  y1="41"
                  x2="54"
                  y2="54"
                  stroke="#3f3f46"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Lens glass surface */}
                <circle cx="24" cy="24" r="20" fill="url(#lensGlassGrad)" />

                {/* Lens outer metal ring */}
                <circle cx="24" cy="24" r="20" stroke="#111111" strokeWidth="2.75" />

                {/* Specular glare reflection */}
                <ellipse
                  cx="18"
                  cy="14"
                  rx="9"
                  ry="4"
                  transform="rotate(-28 18 14)"
                  fill="url(#lensReflectionGrad)"
                />
              </svg>

              {/* Contextual Preview tooltip badge positioned cleanly at top-right */}
              <div className={styles.previewBadge}>Aprende</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}
