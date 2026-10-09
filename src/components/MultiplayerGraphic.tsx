import React, { useState, useRef, useCallback } from 'react'
import styles from './MultiplayerGraphic.module.css'

export interface MultiplayerGraphicProps {
  isExternalHovered?: boolean
}

interface ClickRipple {
  id: number
  x: number
  y: number
}

export default function MultiplayerGraphic({ isExternalHovered }: MultiplayerGraphicProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isInside, setIsInside] = useState(false)
  // Default resting position (Image reference: near top center card)
  const [youPos, setYouPos] = useState({ x: 148, y: 28 })
  const [ripples, setRipples] = useState<ClickRipple[]>([])
  const [activeCardId, setActiveCardId] = useState<number | null>(2)

  const isHovered = Boolean(isExternalHovered || isInside)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = Math.max(8, Math.min(rect.width - 40, e.clientX - rect.left))
    const y = Math.max(4, Math.min(rect.height - 24, e.clientY - rect.top))
    setYouPos({ x, y })
  }, [])

  const handleMouseEnter = () => {
    setIsInside(true)
  }

  const handleMouseLeave = () => {
    setIsInside(false)
    // Return to resting position near center card
    setYouPos({ x: 148, y: 28 })
    setActiveCardId(2)
  }

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const newRipple: ClickRipple = { id: Date.now(), x, y }
    setRipples((prev) => [...prev.slice(-3), newRipple])
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
    }, 600)
  }

  // Cursor arrow polygon icon (exact Figma/collaboration pointer)
  const PointerArrow = () => (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="#ffffff"
      stroke="#111111"
      strokeWidth="1.6"
      strokeLinejoin="round"
      className={styles.cursorArrow}
    >
      <polygon points="3 3 10.5 21 14 14 21 10.5 3 3" />
    </svg>
  )

  // Collaborative Avatar SVGs
  const MayaAvatar = () => (
    <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#fbcfe8" />
      <circle cx="16" cy="13" r="6" fill="#be185d" />
      <path d="M7 27c0-5 4-8 9-8s9 3 9 8" fill="#9d174d" />
    </svg>
  )

  const PriyaAvatar = () => (
    <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#fed7aa" />
      <circle cx="16" cy="13" r="6" fill="#c2410c" />
      <path d="M7 27c0-5 4-8 9-8s9 3 9 8" fill="#9a3412" />
    </svg>
  )

  const KaiAvatar = () => (
    <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="16" fill="#cbd5e1" />
      <circle cx="16" cy="13" r="6" fill="#334155" />
      <path d="M7 27c0-5 4-8 9-8s9 3 9 8" fill="#1e293b" />
    </svg>
  )

  return (
    <div className={`${styles.container} ${isHovered ? styles.containerHovered : ''}`}>
      {/* Top Header Bar */}
      <div className={styles.headerBar}>
        <div className={styles.docTitleGroup}>
          <span className={styles.liveIndicator} />
          <span className={styles.docTitle}>Laboratorio</span>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.avatarStack}>
            <div className={styles.avatarImg} title="Analista (Monitoreo)">
              <MayaAvatar />
            </div>
            <div className={styles.avatarImg} title="Auditor (Inspección)">
              <KaiAvatar />
            </div>
            <div className={styles.avatarImg} title="SOC (Respuesta)">
              <PriyaAvatar />
            </div>
            <div className={styles.youBadge}>Tú</div>
          </div>
        </div>
      </div>

      {/* Canvas Area with Dot Grid & Scattered Document Cards */}
      <div
        ref={canvasRef}
        className={styles.canvasArea}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      >
        {/* Background Dot Grid */}
        <div className={styles.dotGrid} />

        {/* Click ripples */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className={styles.clickRipple}
            style={{ left: ripple.x, top: ripple.y }}
          />
        ))}

        {/* Card 1: Top-Left (Analista focus) */}
        <div
          className={`${styles.docCard} ${styles.card1} ${
            activeCardId === 1 ? styles.cardSelected : ''
          }`}
          onMouseEnter={() => setActiveCardId(1)}
        >
          <div className={styles.cardHeaderMini}>
            <span className={styles.cardDotMini} />
            <span className={styles.cardTagMini}>Firewall</span>
          </div>
          <div className={`${styles.cardLine} ${styles.cardLineLong}`} />
          <div className={`${styles.cardLine} ${styles.cardLineShort}`} />
        </div>

        {/* Card 2: Top-Middle / Center (User's initial focus) */}
        <div
          className={`${styles.docCard} ${styles.card2} ${
            activeCardId === 2 ? styles.cardSelected : ''
          }`}
          onMouseEnter={() => setActiveCardId(2)}
        >
          <div className={styles.cardHeaderMini}>
            <span className={styles.cardDotMini} />
            <span className={styles.cardTagMini}>Logs</span>
          </div>
          <div className={`${styles.cardLine} ${styles.cardLineLong}`} />
          <div className={`${styles.cardLine} ${styles.cardLineShort}`} />
        </div>

        {/* Card 3: Bottom-Left */}
        <div
          className={`${styles.docCard} ${styles.card3} ${
            activeCardId === 3 ? styles.cardSelected : ''
          }`}
          onMouseEnter={() => setActiveCardId(3)}
        >
          <div className={`${styles.cardLine} ${styles.cardLineLong}`} />
          <div className={`${styles.cardLine} ${styles.cardLineShort}`} />
        </div>

        {/* Card 4: Bottom-Center (SOC focus) */}
        <div
          className={`${styles.docCard} ${styles.card4} ${
            activeCardId === 4 ? styles.cardSelected : ''
          }`}
          onMouseEnter={() => setActiveCardId(4)}
        >
          <div className={styles.cardHeaderMini}>
            <span className={styles.cardDotMini} />
            <span className={styles.cardTagMini}>Antivirus</span>
          </div>
          <div className={`${styles.cardLine} ${styles.cardLineLong}`} />
          <div className={`${styles.cardLine} ${styles.cardLineShort}`} />
        </div>

        {/* Card 5: Bottom-Right (Auditor focus) */}
        <div
          className={`${styles.docCard} ${styles.card5} ${
            activeCardId === 5 ? styles.cardSelected : ''
          }`}
          onMouseEnter={() => setActiveCardId(5)}
        >
          <div className={`${styles.cardLine} ${styles.cardLineLong}`} />
          <div className={`${styles.cardLine} ${styles.cardLineShort}`} />
        </div>

        {/* Maya Cursor -> Analista */}
        <div className={`${styles.cursorWrapper} ${styles.cursorMaya}`}>
          <PointerArrow />
          <div className={styles.cursorPill}>
            <div className={styles.cursorAvatar}>
              <MayaAvatar />
            </div>
            <span>Analista</span>
          </div>
        </div>

        {/* Priya Cursor -> SOC */}
        <div className={`${styles.cursorWrapper} ${styles.cursorPriya}`}>
          <PointerArrow />
          <div className={styles.cursorPill}>
            <div className={styles.cursorAvatar}>
              <PriyaAvatar />
            </div>
            <span>SOC</span>
          </div>
        </div>

        {/* Kai Cursor -> Auditor */}
        <div className={`${styles.cursorWrapper} ${styles.cursorKai}`}>
          <PointerArrow />
          <div className={styles.cursorPill}>
            <div className={styles.cursorAvatar}>
              <KaiAvatar />
            </div>
            <span>Auditor</span>
          </div>
        </div>

        {/* Interactive "Tú" Cursor that follows mouse pointer */}
        <div
          className={styles.youCursorWrapper}
          style={{
            transform: `translate(${youPos.x}px, ${youPos.y}px)`,
            transition: isInside
              ? 'transform 0.08s ease-out'
              : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <PointerArrow />
          <div className={styles.youPill}>Tú</div>
        </div>
      </div>
    </div>
  )
}
