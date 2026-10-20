import { Link } from 'react-router-dom'
import LiliumIcon from './LiliumIcon'
import FaultyTerminal from './FaultyTerminal'
import SpecularButton from './SpecularButton'
import styles from './Footer.module.css'

export interface FooterProps {
  id?: string
  className?: string
  showCta?: boolean
}

export default function Footer({ id = 'contact', className, showCta = true }: FooterProps) {
  const handleScrollToStats = (e: React.MouseEvent) => {
    const statsEl = document.getElementById('stats')
    if (statsEl) {
      e.preventDefault()
      statsEl.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleHomeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.location.pathname === '/') {
      e.preventDefault()
      if (window.location.hash) {
        window.history.pushState(null, '', '/')
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleScrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (window.location.pathname === '/') {
      e.preventDefault()
      const element = document.getElementById(targetId)
      if (element) {
        window.history.pushState(null, '', `#${targetId}`)
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <footer
      className={`${styles.footerSection}${!showCta ? ` ${styles.noCta}` : ''}${className ? ` ${className}` : ''}`}
      id={id}
    >
      <div className={styles.footerContainer}>
        {/* ── Overlapping CTA Card ── */}
        {showCta && (
          <div className={styles.ctaCard}>
          {/* Terminal WebGL background */}
          <div className={styles.terminalCanvasWrapper}>
            <FaultyTerminal
              scale={1.4}
              gridMul={[2, 1]}
              digitSize={1.1}
              timeScale={0.2}
              pause={false}
              scanlineIntensity={0.12}
              glitchAmount={0.22}
              flickerAmount={0.28}
              noiseAmp={0.7}
              chromaticAberration={0}
              dither={8}
              curvature={0.25}
              tint="#00ff66"
              tintThreat="#ff0055ff"
              mouseReact={true}
              mouseStrength={0.4}
              pageLoadAnimation={false}
              brightness={5}
              lightMode={true}
            />
            <div className={styles.terminalOverlay} />
          </div>

          {/* CTA Card Content */}
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaHeading}>Construye una empresa más segura, hoy</h2>

            <div className={styles.ctaButtons}>
              <SpecularButton
                as={Link}
                to="/docs/getting-started"
                id="cta-get-started"
                size="md"
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
                id="cta-learn-more"
                size="md"
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
                onClick={handleScrollToStats}
              >
                Saber Más
              </SpecularButton>
            </div>
          </div>
        </div>
      )}

        {/* ── Footer Bottom Row ── */}
        <div className={styles.footerBottom}>
          {/* Left brand */}
          <div className={styles.brandGroup}>
            <Link
              to="/"
              onClick={handleHomeClick}
              className={styles.brandContainer}
              aria-label="Lilium Home"
            >
              <LiliumIcon size={20} className={styles.brandIcon} alt="Lilium logo" />
              <span className={styles.brandName}>lilium</span>
            </Link>
            <p className={styles.brandTagline}>
              Lineamientos, Inventario, Lógica, Implementación, Umbrales y Mitigación.
            </p>
            <p className={styles.brandCopyright}>
              © {new Date().getFullYear()} Lilium. Todos los derechos reservados.
            </p>
          </div>

          {/* Right navigation columns */}
          <div className={styles.navColumns}>
            {/* Column 1: PLAYBOOK */}
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>PLAYBOOK</h3>
              <ul className={styles.linkList}>
                <li>
                  <Link to="/docs/getting-started" className={styles.link}>
                    Primeros pasos
                  </Link>
                </li>
                <li>
                  <Link to="/docs/architecture" className={styles.link}>
                    Arquitectura
                  </Link>
                </li>
                <li>
                  <Link to="/docs/labs" className={styles.link}>
                    Laboratorios
                  </Link>
                </li>
                <li>
                  <Link to="/docs/simulations" className={styles.link}>
                    Simulaciones
                  </Link>
                </li>
                <li>
                  <Link to="/docs/scenarios" className={styles.link}>
                    Escenarios
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2: PLATAFORMA */}
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>PLATAFORMA</h3>
              <ul className={styles.linkList}>
                <li>
                  <Link to="/" onClick={handleHomeClick} className={styles.link}>
                    Inicio
                  </Link>
                </li>
                <li>
                  <a
                    href="/#about"
                    onClick={(e) => handleScrollToSection(e, 'about')}
                    className={styles.link}
                  >
                    Sobre Lilium
                  </a>
                </li>
                <li>
                  <a
                    href="/#security-framework"
                    onClick={(e) => handleScrollToSection(e, 'security-framework')}
                    className={styles.link}
                  >
                    Framework
                  </a>
                </li>
                <li></li>
              </ul>
            </div>

            {/* Column 3: CONTACTO */}
            <div className={styles.column}>
              <h3 className={styles.columnTitle}>CONTACTO</h3>
              <ul className={styles.linkList}>
                <li>
                  <a
                    href="https://github.com/jossmarsala"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    GitHub (Open Source)
                  </a>
                </li>
                <li>
                  <a
                    href="https://linkedin.com/jossmarsala"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
