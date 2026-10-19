/**
 * HomePage — hero landing page.
 * Left: large heading + CTA buttons + stat strip.
 * Right: FaultyTerminal WebGL background (light-mode).
 */
import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import FaultyTerminal from '@/components/FaultyTerminal'
import SpecularButton from '@/components/SpecularButton'
import BentoGrid from '@/components/BentoGrid'
import SecurityFramework from '@/components/SecurityFramework'
import Footer from '@/components/Footer'
import styles from './HomePage.module.css'

interface TiltMagneticBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  maxTilt?: number
  maxMagnetic?: number
  baseZ?: number
  className?: string
  style?: React.CSSProperties
}

function TiltMagneticBadge({
  children,
  maxTilt = 3,
  maxMagnetic = 2,
  baseZ = 28,
  className,
  style,
  ...props
}: TiltMagneticBadgeProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState('')
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left - rect.width / 2
    const y = e.clientY - rect.top - rect.height / 2
    const normX = Math.min(Math.max(x / (rect.width / 2), -1), 1)
    const normY = Math.min(Math.max(y / (rect.height / 2), -1), 1)

    const rotX = -normY * maxTilt
    const rotY = normX * maxTilt
    const transX = normX * maxMagnetic
    const transY = normY * maxMagnetic

    setTransform(
      `translate3d(${transX.toFixed(1)}px, ${transY.toFixed(1)}px, ${baseZ + 8}px) rotateX(${rotX.toFixed(1)}deg) rotateY(${rotY.toFixed(1)}deg)`
    )
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true)
    handleMouseMove(e)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setTransform(`translate3d(0px, 0px, ${baseZ}px) rotateX(0deg) rotateY(0deg)`)
  }

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        transform: transform || `translate3d(0px, 0px, ${baseZ}px)`,
        transition: isHovered
          ? 'transform 0.08s ease-out'
          : 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.25s ease',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>
  )
}

export default function HomePage() {
  const terminalWrapperRef = useRef<HTMLDivElement>(null)
  const cursorTagRef = useRef<HTMLDivElement>(null)
  const [isTerminalHovered, setIsTerminalHovered] = useState(false)
  const [blockTilt, setBlockTilt] = useState({ rotX: 0, rotY: 0, transX: 0, transY: 0 })
  const [tagDelta, setTagDelta] = useState({ x: 0, y: 0 })

  const handleWrapperMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!terminalWrapperRef.current) return
    const rect = terminalWrapperRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (cursorTagRef.current) {
      const restingX = cursorTagRef.current.offsetLeft
      const restingY = cursorTagRef.current.offsetTop
      setTagDelta({
        x: x - restingX + 4,
        y: y - restingY + 4,
      })
    }

    const normX = Math.min(Math.max((x - rect.width / 2) / (rect.width / 2), -1), 1)
    const normY = Math.min(Math.max((y - rect.height / 2) / (rect.height / 2), -1), 1)

    const maxTilt = 1.5
    const maxTrans = 1.5
    setBlockTilt({
      rotX: -normY * maxTilt,
      rotY: normX * maxTilt,
      transX: normX * maxTrans,
      transY: normY * maxTrans,
    })
    if (!isTerminalHovered) {
      setIsTerminalHovered(true)
    }
  }

  const handleWrapperMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsTerminalHovered(true)
    handleWrapperMouseMove(e)
  }

  const handleWrapperMouseLeave = () => {
    setIsTerminalHovered(false)
    setBlockTilt({ rotX: 0, rotY: 0, transX: 0, transY: 0 })
  }

  // Smooth scroll to hash anchor on page mount/navigation if hash present
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace('#', '')
      const el = document.getElementById(id)
      if (el) {
        const timer = setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' })
        }, 100)
        return () => clearTimeout(timer)
      }
    }
  }, [])

  return (
    <div className={styles.page}>
      {/* ── Hero section ── */}
      <section className={styles.hero} id="hero">
        {/* Left column — content */}
        <div className={styles.heroContent}>
          <h1 className={styles.heroHeading}>
            Aprende
            <br />
            ciberseguridad
            <br />
            para tu empresa
          </h1>
          <p className={styles.heroDesc}>
            Lilium (Threat Understanding Layered Infrastructure Protection) es un playbook enfocado
            en construir una arquitectura digital segura para tu PyME con laboratorios interactivos.
          </p>
          <div className={styles.heroCta}>
            <SpecularButton
              as={Link}
              to="/docs/getting-started"
              id="hero-get-started"
              size="lg"
              radius={999}
              tint="#111111"
              tintOpacity={1}
              textColor="#ffffff"
              lineColor="#ffffff"
              baseColor="#333333"
              intensity={1.25}
              shineSize={12}
              shineFade={35}
              thickness={1.2}
              speed={0.35}
              followMouse={true}
              proximity={250}
              autoAnimate={false}
            >
              Empezar ahora
            </SpecularButton>

            <SpecularButton
              as="a"
              href="#stats"
              id="hero-learn-more"
              size="lg"
              radius={999}
              tint="#ffffff"
              tintOpacity={0.8}
              blur={10}
              textColor="#111111"
              lineColor="#111111"
              baseColor="#d4d4d4"
              intensity={1}
              shineSize={12}
              shineFade={35}
              thickness={1.2}
              speed={0.35}
              followMouse={true}
              proximity={250}
              autoAnimate={false}
              onClick={(e: React.MouseEvent) => {
                e.preventDefault()
                document.getElementById('stats')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Saber Más
            </SpecularButton>
          </div>
        </div>

        {/* Right column — terminal card + stats */}
        <div className={styles.heroRight}>
          <div className={styles.heroVisual}>
            {/* ── Terminal Card Wrapper (allows add-ons to float offside) ── */}
            <div
              ref={terminalWrapperRef}
              className={styles.terminalWrapper}
              style={{
                transform: `perspective(1000px) translate3d(${blockTilt.transX.toFixed(1)}px, ${blockTilt.transY.toFixed(1)}px, 0px) rotateX(${blockTilt.rotX.toFixed(1)}deg) rotateY(${blockTilt.rotY.toFixed(1)}deg)`,
                transition: isTerminalHovered
                  ? 'transform 0.08s ease-out'
                  : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)',
                transformStyle: 'preserve-3d',
              }}
              onMouseMove={handleWrapperMouseMove}
              onMouseEnter={handleWrapperMouseEnter}
              onMouseLeave={handleWrapperMouseLeave}
            >
              {/* ── The rounded square card containing FaultyTerminal WebGL ── */}
              <div className={styles.terminalCard}>
                <FaultyTerminal
                  scale={1.5}
                  gridMul={[2, 1]}
                  digitSize={1.2}
                  timeScale={0.2}
                  pause={false}
                  scanlineIntensity={0.08}
                  glitchAmount={0.12}
                  flickerAmount={0.15}
                  noiseAmp={0.7}
                  chromaticAberration={0}
                  dither={15}
                  curvature={0.25}
                  tint="#00cc66"
                  tintThreat="#ff3366"
                  mouseReact={true}
                  mouseStrength={0.4}
                  pageLoadAnimation={false}
                  brightness={5}
                  lightMode={true}
                />

                {/* Subtle static vignette overlay */}
                <div className={styles.cardInnerOverlay} aria-hidden="true" />
              </div>

              {/* ── Add-on: Top badges ── */}
              <div className={styles.cardBadgeRow}>
                <TiltMagneticBadge
                  className={styles.cardBadgeRight}
                  maxTilt={4}
                  maxMagnetic={5}
                  baseZ={20}
                >
                  <span>Playbook</span>
                  <span className={styles.cardPillBadgeDark}>v1.0</span>
                </TiltMagneticBadge>
              </div>

              {/* ── Add-on: Informative Lilium card (floating offside left) ── */}
              <TiltMagneticBadge
                className={styles.liliumInfoCard}
                maxTilt={3}
                maxMagnetic={2}
                baseZ={20}
              >
                <div className={styles.liliumCardHeader}>
                  <div className={styles.liliumCardIcon}>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                      <path d="M9 12l2 2 4-4" />
                    </svg>
                  </div>
                  <div className={styles.liliumCardMeta}>
                    <span className={styles.liliumCardTitle}>Defensa en Capas</span>
                    <span className={styles.liliumCardSub}>Metodología Lilium</span>
                  </div>
                </div>
              </TiltMagneticBadge>

              {/* ── Add-on: Reference-style pointer tag (follows cursor when terminal is hovered) ── */}
              <div
                ref={cursorTagRef}
                className={`${styles.cursorTag} ${isTerminalHovered ? styles.cursorTagFollowing : ''}`}
                style={{
                  transform: isTerminalHovered
                    ? `translate3d(${tagDelta.x.toFixed(1)}px, ${tagDelta.y.toFixed(1)}px, 36px)`
                    : 'translate3d(0px, 0px, 28px)',
                  transition: isTerminalHovered
                    ? 'transform 0.06s ease-out'
                    : 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease',
                }}
                aria-hidden="true"
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 16 16"
                  fill="currentColor"
                  className={styles.cursorArrow}
                >
                  <path d="M0 0l5 14 3-5 5-3z" />
                </svg>
                <span>Lab 01</span>
              </div>

              {/* ── Add-on: Status pill (floating offside bottom-right) ── */}
              <TiltMagneticBadge
                className={styles.statusPill}
                maxTilt={3}
                maxMagnetic={6}
                baseZ={28}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={styles.statusIcon}
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>Protección pensada para PyMEs</span>
              </TiltMagneticBadge>
            </div>
          </div>

          <div className={styles.stats} id="stats">
            <Stat label="Laboratorios" value="5+" />
            <Stat label="Open-Source" value="100%" />
            <Stat label="Experiencia" value="de 0 a 100" />
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className={styles.divider} />

      {/* ── Bento Grid Section (About) ── */}
      <BentoGrid id="about" />

      {/* ── Security Framework Overview Section ── */}
      <SecurityFramework />

      {/* ── Footer with CTA Card (Contact) ── */}
      <Footer id="contact" />
    </div>
  )
}

interface StatProps {
  label: string
  value: string
}

function Stat({ label, value }: StatProps) {
  return (
    <div className={styles.stat}>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}
