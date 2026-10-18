import FaultyTerminal from '@/components/FaultyTerminal'
import styles from './LabThumbnail.module.css'

interface TerminalConfig {
  tint: string
  tintThreat: string
  scale: number
  gridMul: [number, number]
  digitSize: number
  scanlineIntensity: number
  glitchAmount: number
  flickerAmount: number
  noiseAmp: number
  chromaticAberration: number
  curvature: number
  timeScale: number
  brightness: number
  lightMode: boolean
  mouseReact: boolean
  mouseStrength: number
  pageLoadAnimation: boolean
}

/**
 * Unique FaultyTerminal configurations for each lab.
 * Varies color palettes, glitch amount, curvature, scale, and grid dimensions
 * to match the cybersecurity discipline of each scenario.
 */
export const LAB_TERMINAL_CONFIGS: Record<string, TerminalConfig> = {
  // Lab 01: La Estación Olvidada — Triage & Hardening en Linux (Atmósfera Analógica & Misterio Silencioso)
  'lab-01': {
    tint: '#ec4899',
    tintThreat: '#8b5cf6',
    scale: 1.7,
    gridMul: [2.5, 1.3],
    digitSize: 1.7,
    scanlineIntensity: 0.6,
    glitchAmount: 0.65,
    flickerAmount: 0.22,
    noiseAmp: 1.5,
    chromaticAberration: 2.2,
    curvature: 0.14,
    timeScale: 0.27,
    brightness: 2.5,
    lightMode: false,
    mouseReact: true,
    mouseStrength: 0.35,
    pageLoadAnimation: false,
  },

  // Lab 02: Phishing Defense & Mail Headers (Cyber Emerald & Amber Warning)
  'lab-02': {
    tint: '#10b981',
    tintThreat: '#eab308',
    scale: 1.05,
    gridMul: [1.8, 1.5],
    digitSize: 1.25,
    scanlineIntensity: 0.45,
    glitchAmount: 0.18,
    flickerAmount: 0.14,
    noiseAmp: 0.95,
    chromaticAberration: 0.5,
    curvature: 0.1,
    timeScale: 0.32,
    brightness: 2.6,
    lightMode: false,
    mouseReact: true,
    mouseStrength: 0.28,
    pageLoadAnimation: false,
  },

  // Lab 03: OWASP API Defense (Electric Indigo & Vulnerability Crimson)
  'lab-03': {
    tint: '#f59e0b',
    tintThreat: '#ef4444',
    scale: 1.4,
    gridMul: [1.5, 2.2],
    digitSize: 1.55,
    scanlineIntensity: 0.65,
    glitchAmount: 0.5,
    flickerAmount: 0.25,
    noiseAmp: 1.4,
    chromaticAberration: 1.8,
    curvature: 0.11,
    timeScale: 0.38,
    brightness: 2.7,
    lightMode: false,
    mouseReact: true,
    mouseStrength: 0.4,
    pageLoadAnimation: false,
  },

  // Lab 04: Zero-Trust Network & Microsegmentation (Electric Sky Blue & High-Tech Cyan)
  'lab-04': {
    tint: '#d61313ff',
    tintThreat: '#25d406ff',
    scale: 1.15,
    gridMul: [1.7, 1.8],
    digitSize: 1.3,
    scanlineIntensity: 0.3,
    glitchAmount: 0.14,
    flickerAmount: 0.08,
    noiseAmp: 0.85,
    chromaticAberration: 0.4,
    curvature: 0.03,
    timeScale: 0.28,
    brightness: 2.5,
    lightMode: false,
    mouseReact: true,
    mouseStrength: 0.22,
    pageLoadAnimation: false,
  },

  // Lab 05: SIEM Incident Triage & Correlation (Amber Gold & SOC Alert Red)
  'lab-05': {
    tint: '#6366f1',
    tintThreat: '#f43f5e',
    scale: 1.5,
    gridMul: [2.8, 1.1],
    digitSize: 1.65,
    scanlineIntensity: 0.55,
    glitchAmount: 0.35,
    flickerAmount: 0.18,
    noiseAmp: 1.3,
    chromaticAberration: 1.6,
    curvature: 0.09,
    timeScale: 0.22,
    brightness: 2.4,
    lightMode: false,
    mouseReact: true,
    mouseStrength: 0.35,
    pageLoadAnimation: false,
  },

  // Lab 06: Ransomware Recovery & Business Continuity (Hot Magenta Fuchsia & Ultra Violet)
  'lab-06': {
    tint: '#ff3366',
    tintThreat: '#ff8800',
    scale: 1.25,
    gridMul: [2.2, 1.2],
    digitSize: 1.4,
    scanlineIntensity: 0.35,
    glitchAmount: 0.25,
    flickerAmount: 0.1,
    noiseAmp: 1.1,
    chromaticAberration: 0.8,
    curvature: 0.04,
    timeScale: 0.25,
    brightness: 2.5,
    lightMode: false,
    mouseReact: true,
    mouseStrength: 0.25,
    pageLoadAnimation: false,
  },
}

interface LabThumbnailProps {
  labId: string
  className?: string
}

export default function LabThumbnail({ labId, className = '' }: LabThumbnailProps) {
  const config = LAB_TERMINAL_CONFIGS[labId] || LAB_TERMINAL_CONFIGS['lab-01']

  return (
    <div className={`${styles.thumbnailWrapper} ${className}`}>
      {/* ── WebGL Faulty Terminal Living Canvas ── */}
      <div className={styles.terminalBgWrapper}>
        <FaultyTerminal {...config} dpr={1} />
      </div>

      {/* ── Ambient Vignette for Depth ── */}
      <div className={styles.ambientVignette} />

      {/* ── Subtle Cyber Grid Overlay ── */}
      <div className={styles.gridOverlay} />
    </div>
  )
}
