import React, {
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
  type CSSProperties,
  type HTMLAttributes,
  type SVGProps,
} from 'react'
import styles from './Diagrama.module.css'

/* ═══════════════════════════════════════════════════════════════════
   TYPES & INTERFACES
   ═══════════════════════════════════════════════════════════════════ */

export type DiagramaGridType = boolean | 'dots' | 'lines' | 'none'

export interface DiagramaProps extends HTMLAttributes<HTMLDivElement> {
  /** Título visible en la barra superior minimalista */
  title?: string
  /** Subtítulo o descripción breve */
  description?: string
  /** Badge / etiqueta técnica en la esquina superior izquierda */
  badge?: string
  /** Elemento o botones personalizados para la esquina superior derecha */
  headerRight?: ReactNode
  /** Leyenda o pie de información en la parte inferior */
  caption?: string
  /** Contenido personalizado del pie de diagrama */
  footer?: ReactNode
  /**
   * Coordenadas SVG viewBox (ej: "0 0 960 700").
   */
  viewBox?: string
  /** Relación de aspecto CSS (ej: "16/9", "4/3", "21/9", "auto") */
  aspectRatio?: string
  /** Altura explícita del contenedor (número en px o string CSS) */
  height?: number | string
  /** Altura mínima (default: 480px) */
  minHeight?: number | string
  /** Estilo de cuadrícula de fondo: 'dots' (default) | 'lines' | 'none' | boolean */
  grid?: DiagramaGridType
  /** Resplandor ambiental radial sutil en el fondo (color HEX/RGB o boolean) */
  glow?: boolean | string
  /** Habilitar efectos de hover / interacción en el diagrama (default: false) */
  hover?: boolean | string
  /** Desactivar explícitamente cualquier efecto de hover */
  noHover?: boolean
  /** Habilitar controles interactivos de Zoom in / Zoom out (default: true) */
  zoomable?: boolean
  /** Nivel de zoom inicial (default: 1) */
  defaultZoom?: number
  /** Nivel de zoom mínimo (default: 0.6) */
  minZoom?: number
  /** Nivel de zoom máximo (default: 2.2) */
  maxZoom?: number
  /** Habilitar arrastre / paneo interactivo (default: true cuando zoomable está activo) */
  draggable?: boolean
  /** Clases CSS adicionales */
  className?: string
  /** Estilos inline adicionales */
  style?: CSSProperties
  /** Contenido personalizado o SVG libre */
  children?: ReactNode
}

/* ═══════════════════════════════════════════════════════════════════
   ICONOS SVG VECTORIALES ESTÁNDAR
   ═══════════════════════════════════════════════════════════════════ */

function SvgIcon({
  name,
  color = 'currentColor',
  size = 16,
}: {
  name: string
  color?: string
  size?: number
}) {
  const p = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: color,
    strokeWidth: '1.75',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (name) {
    case 'cloud':
      return (
        <svg {...p}>
          <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
        </svg>
      )
    case 'router':
      return (
        <svg {...p}>
          <rect x="2" y="14" width="20" height="7" rx="2" />
          <path d="M6 18h.01M10 18h.01M14 18h.01" />
          <path d="M7 14V6M17 14V6" />
          <circle cx="7" cy="5" r="1" fill={color} />
          <circle cx="17" cy="5" r="1" fill={color} />
        </svg>
      )
    case 'firewall':
      return (
        <svg {...p}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="3" y1="15" x2="21" y2="15" />
          <line x1="9" y1="4" x2="9" y2="9" />
          <line x1="15" y1="4" x2="15" y2="9" />
          <line x1="6" y1="9" x2="6" y2="15" />
          <line x1="12" y1="9" x2="12" y2="15" />
          <line x1="18" y1="9" x2="18" y2="15" />
          <line x1="9" y1="15" x2="9" y2="20" />
          <line x1="15" y1="15" x2="15" y2="20" />
        </svg>
      )
    case 'switch':
      return (
        <svg {...p}>
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <path d="M6 9h4M14 9h4M6 15h4M14 15h4" />
          <path d="M10 7l2 2-2 2M14 13l-2 2 2 2" />
        </svg>
      )
    case 'server':
      return (
        <svg {...p}>
          <rect x="2" y="3" width="20" height="8" rx="2" />
          <rect x="2" y="13" width="20" height="8" rx="2" />
          <line x1="6" y1="7" x2="6.01" y2="7" />
          <line x1="6" y1="17" x2="6.01" y2="17" />
          <line x1="10" y1="7" x2="14" y2="7" />
          <line x1="10" y1="17" x2="14" y2="17" />
        </svg>
      )
    case 'database':
      return (
        <svg {...p}>
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
          <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3" />
        </svg>
      )
    case 'computer':
      return (
        <svg {...p}>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      )
    case 'laptop':
      return (
        <svg {...p}>
          <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55A1 1 0 0 1 20.38 20H3.62a1 1 0 0 1-.9-1.45L4 16" />
        </svg>
      )
    case 'vault':
      return (
        <svg {...p}>
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="12" cy="12" r="4" />
          <path d="M12 12l2.5-2.5M16 12h2M6 12h2M12 6v2M12 16v2" />
        </svg>
      )
    case 'terminal':
      return (
        <svg {...p}>
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>
      )
    case 'wifi':
      return (
        <svg {...p}>
          <path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0" />
          <line x1="12" y1="20" x2="12.01" y2="20" />
        </svg>
      )
    case 'phone':
      return (
        <svg {...p}>
          <rect x="6" y="2" width="12" height="20" rx="3" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
      )
    case 'printer':
      return (
        <svg {...p}>
          <polyline points="6 9 6 2 18 2 18 9" />
          <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <rect x="6" y="14" width="12" height="8" />
        </svg>
      )
    case 'activity':
      return (
        <svg {...p}>
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      )
    case 'zoomIn':
      return (
        <svg {...p}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="11" y1="8" x2="11" y2="14" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      )
    case 'zoomOut':
      return (
        <svg {...p}>
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
          <line x1="8" y1="11" x2="14" y2="11" />
        </svg>
      )
    case 'rotateCcw':
      return (
        <svg {...p}>
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
        </svg>
      )
    default:
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      )
  }
}

/* ═══════════════════════════════════════════════════════════════════
   SUBCOMPONENTES MODULARES
   ═══════════════════════════════════════════════════════════════════ */

export interface DiagramaZoneProps extends SVGProps<SVGGElement> {
  x: number
  y: number
  width: number
  height: number
  label?: string
  sublabel?: string
  badge?: string
  variant?: 'subtle' | 'dashed' | 'accent' | 'critical'
  rx?: number
}

export function DiagramaZone({
  x,
  y,
  width,
  height,
  label,
  sublabel,
  badge,
  variant = 'dashed',
  rx = 10,
  className = '',
  ...rest
}: DiagramaZoneProps) {
  return (
    <g className={`diagrama-zone ${className}`} {...rest}>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={rx}
        fill="rgba(0, 0, 0, 0.012)"
        stroke="rgba(0, 0, 0, 0.12)"
        strokeWidth={1}
        strokeDasharray={variant === 'subtle' ? undefined : '4 4'}
      />
      {label && (
        <g transform={`translate(${x + 12}, ${y + 16})`}>
          <text
            fill="#111827"
            fontSize="9.5"
            fontWeight="700"
            letterSpacing="0.05em"
            fontFamily="var(--font-family, system-ui, sans-serif)"
          >
            {label.toUpperCase()}
          </text>
          {sublabel && (
            <text
              x={label.length * 6.5 + 8}
              y={0}
              fill="#6b7280"
              fontSize="8.5"
              fontWeight="500"
              fontFamily="var(--font-mono, monospace)"
            >
              · {sublabel}
            </text>
          )}
          {badge && (
            <g transform={`translate(${width - 24 - badge.length * 6}, -10)`}>
              <rect
                x={0}
                y={0}
                width={badge.length * 6 + 10}
                height={15}
                rx={7.5}
                fill="#f3f4f6"
                stroke="rgba(0,0,0,0.08)"
                strokeWidth={0.75}
              />
              <text
                x={(badge.length * 6 + 10) / 2}
                y={10.5}
                textAnchor="middle"
                fill="#374151"
                fontSize="7.5"
                fontWeight="700"
                fontFamily="var(--font-mono, monospace)"
              >
                {badge}
              </text>
            </g>
          )}
        </g>
      )}
    </g>
  )
}

export interface DiagramaConnectorProps extends Omit<SVGProps<SVGPathElement>, 'from' | 'to'> {
  from: [number, number]
  to: [number, number]
  curvature?: 'straight' | 'curved' | 'orthogonal'
  animated?: boolean
  arrow?: boolean
  variant?: 'default' | 'subtle' | 'accent' | 'dark'
  label?: string
}

export function DiagramaConnector({
  from,
  to,
  curvature = 'straight',
  animated = false,
  arrow = true,
  variant = 'default',
  label,
  className = '',
  ...rest
}: DiagramaConnectorProps) {
  const [x1, y1] = from
  const [x2, y2] = to

  let d = ''
  if (curvature === 'straight') {
    d = `M ${x1} ${y1} L ${x2} ${y2}`
  } else if (curvature === 'orthogonal') {
    const midY = (y1 + y2) / 2
    d = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`
  } else {
    const dy = Math.abs(y2 - y1) * 0.45
    d = `M ${x1} ${y1} C ${x1} ${y1 + dy}, ${x2} ${y2 - dy}, ${x2} ${y2}`
  }

  const strokeColor = variant === 'dark' ? '#111827' : 'rgba(0, 0, 0, 0.22)'
  const markerId = 'url(#diagrama-arrow-default)'
  const midX = (x1 + x2) / 2
  const midY = (y1 + y2) / 2

  return (
    <g className={`diagrama-connector-group ${className}`}>
      <path
        d={d}
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd={arrow ? markerId : undefined}
        {...rest}
      />
      {animated && (
        <path d={d} fill="none" stroke="#111827" strokeWidth={2} className={styles.packetStream} />
      )}
      {label && (
        <g transform={`translate(${midX}, ${midY})`}>
          <rect
            x={-(label.length * 3.2 + 8)}
            y={-8}
            width={label.length * 6.4 + 16}
            height={16}
            rx={8}
            fill="#ffffff"
            stroke="rgba(0, 0, 0, 0.12)"
            strokeWidth={1}
            filter="url(#diagrama-card-shadow)"
          />
          <text
            y={3}
            textAnchor="middle"
            fill="#111827"
            fontSize="8"
            fontWeight="700"
            fontFamily="var(--font-mono, monospace)"
          >
            {label}
          </text>
        </g>
      )}
    </g>
  )
}

export interface DiagramaNodeProps {
  x: number | string
  y: number | string
  label: string
  sublabel?: string
  icon?: ReactNode
  status?: 'online' | 'warning' | 'alert' | 'offline'
  variant?: 'light' | 'white' | 'dark' | 'accent'
  className?: string
  onClick?: () => void
}

export function DiagramaNode({
  x,
  y,
  label,
  sublabel,
  icon,
  status,
  variant = 'white',
  className = '',
  onClick,
}: DiagramaNodeProps) {
  const statusColors = {
    online: '#10b981',
    warning: '#f59e0b',
    alert: '#ef4444',
    offline: '#9ca3af',
  }

  const variantClasses = {
    white: 'bg-white text-gray-900 border-gray-200 shadow-sm hover:border-gray-300',
    light: 'bg-gray-50 text-gray-800 border-gray-200/80 shadow-xs hover:bg-white',
    dark: 'bg-gray-900 text-white border-gray-800 shadow-md',
    accent: 'bg-white text-gray-900 border-[#ff3366]/40 shadow-sm',
  }

  const left = typeof x === 'number' ? `${x}%` : x
  const top = typeof y === 'number' ? `${y}%` : y

  return (
    <div
      onClick={onClick}
      style={{ left, top }}
      className={`
        absolute -translate-x-1/2 -translate-y-1/2 z-10
        inline-flex items-center gap-2 px-3 py-1.5
        rounded-xl border text-xs font-medium
        transition-all duration-150 cursor-pointer select-none
        ${variantClasses[variant]}
        ${onClick ? 'active:scale-95' : ''}
        ${className}
      `.trim()}
    >
      {icon && <span className="flex items-center justify-center text-sm">{icon}</span>}
      <div className="flex flex-col leading-tight">
        <span className="font-semibold tracking-tight">{label}</span>
        {sublabel && <span className="text-[10px] text-gray-400 font-normal">{sublabel}</span>}
      </div>
      {status && (
        <span
          className="relative inline-flex rounded-full h-2 w-2 ml-0.5"
          style={{ backgroundColor: statusColors[status] }}
        />
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   PRESET: TOPOLOGÍA DE RED JERÁRQUICA Y ESTRUCTURALMENTE SIMPLE
   Bloques rectangulares claros por VLAN y dispositivos generalizados
   ═══════════════════════════════════════════════════════════════════ */

export function NetworkSegmentationArchitecture() {
  return (
    <svg
      className={styles.svgCanvas}
      viewBox="0 0 960 675"
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Marcador de flecha direccional simple */}
        <marker
          id="diagrama-arrow-default"
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 2 L 7 5 L 0 8 z" fill="rgba(0, 0, 0, 0.4)" />
        </marker>

        {/* Marcador de flecha para flujos de control / backup */}
        <marker
          id="diagrama-arrow-dash"
          viewBox="0 0 10 10"
          refX="7"
          refY="5"
          markerWidth="5"
          markerHeight="5"
          orient="auto-start-reverse"
        >
          <path d="M 0 2 L 7 5 L 0 8 z" fill="#4f46e5" />
        </marker>

        {/* Sombra suave para tarjetas */}
        <filter id="diagrama-card-shadow" x="-5%" y="-10%" width="120%" height="135%">
          <feDropShadow
            dx="0"
            dy="1.5"
            stdDeviation="2.5"
            floodColor="#000000"
            floodOpacity="0.04"
          />
        </filter>
        <filter id="diagrama-dark-shadow" x="-5%" y="-10%" width="120%" height="135%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="5" floodColor="#000000" floodOpacity="0.15" />
        </filter>
      </defs>

      {/* ─────────────────────────────────────────────────────────────
          1. LÍNEAS DE TOPOLOGÍA DIRECTAS Y JERÁRQUICAS
          ───────────────────────────────────────────────────────────── */}
      {/* Troncal: Internet -> Router */}
      <line
        x1="480"
        y1="63"
        x2="480"
        y2="95"
        stroke="rgba(0,0,0,0.22)"
        strokeWidth="1.25"
        markerEnd="url(#diagrama-arrow-default)"
      />
      <line
        x1="480"
        y1="63"
        x2="480"
        y2="95"
        stroke="#111827"
        strokeWidth="2"
        className={styles.packetStream}
      />

      {/* Troncal: Router -> Firewall */}
      <line
        x1="480"
        y1="133"
        x2="480"
        y2="165"
        stroke="rgba(0,0,0,0.22)"
        strokeWidth="1.25"
        markerEnd="url(#diagrama-arrow-default)"
      />
      <line
        x1="480"
        y1="133"
        x2="480"
        y2="165"
        stroke="#111827"
        strokeWidth="2"
        className={styles.packetStream}
      />

      {/* Conexión directa: Firewall -> DMZ */}
      <line
        x1="560"
        y1="186"
        x2="645"
        y2="186"
        stroke="rgba(0,0,0,0.22)"
        strokeWidth="1.25"
        markerEnd="url(#diagrama-arrow-default)"
      />
      <line
        x1="560"
        y1="186"
        x2="645"
        y2="186"
        stroke="#111827"
        strokeWidth="2"
        className={styles.packetStreamFast}
      />
      {/* Etiqueta de flujo DMZ */}
      <g transform="translate(602, 186)">
        <rect
          x="-22"
          y="-8"
          width="44"
          height="16"
          rx="8"
          fill="#ffffff"
          stroke="rgba(0,0,0,0.12)"
          filter="url(#diagrama-card-shadow)"
        />
        <text
          y="3"
          textAnchor="middle"
          fill="#111827"
          fontSize="8"
          fontWeight="700"
          fontFamily="var(--font-mono, monospace)"
        >
          HTTPS
        </text>
      </g>

      {/* Troncal: Firewall -> Switch Principal */}
      <line
        x1="480"
        y1="207"
        x2="480"
        y2="240"
        stroke="rgba(0,0,0,0.22)"
        strokeWidth="1.25"
        markerEnd="url(#diagrama-arrow-default)"
      />
      <line
        x1="480"
        y1="207"
        x2="480"
        y2="240"
        stroke="#111827"
        strokeWidth="2"
        className={styles.packetStream}
      />
      {/* Etiqueta 802.1Q Trunk */}
      <g transform="translate(480, 223.5)">
        <rect
          x="-34"
          y="-8"
          width="68"
          height="16"
          rx="8"
          fill="#ffffff"
          stroke="rgba(0,0,0,0.12)"
          filter="url(#diagrama-card-shadow)"
        />
        <text
          y="3.5"
          textAnchor="middle"
          fill="#111827"
          fontSize="8"
          fontWeight="700"
          fontFamily="var(--font-mono, monospace)"
        >
          802.1Q Trunk
        </text>
      </g>

      {/* Bus de distribución troncal hacia todas las 6 zonas internas */}
      {/* Troncal central que baja desde Switch Principal */}
      <line x1="480" y1="280" x2="480" y2="496" stroke="rgba(0,0,0,0.22)" strokeWidth="1.25" />
      <line
        x1="480"
        y1="280"
        x2="480"
        y2="496"
        stroke="#111827"
        strokeWidth="2"
        className={styles.packetStream}
      />

      {/* Bus Horizontal Fila 1 (hacia VLAN 20, VLAN 30, VLAN 25) */}
      <line x1="175" y1="305" x2="785" y2="305" stroke="rgba(0,0,0,0.22)" strokeWidth="1.25" />
      <line
        x1="175"
        y1="305"
        x2="175"
        y2="330"
        stroke="rgba(0,0,0,0.22)"
        strokeWidth="1.25"
        markerEnd="url(#diagrama-arrow-default)"
      />
      <line
        x1="480"
        y1="305"
        x2="480"
        y2="330"
        stroke="rgba(0,0,0,0.22)"
        strokeWidth="1.25"
        markerEnd="url(#diagrama-arrow-default)"
      />
      <line
        x1="785"
        y1="305"
        x2="785"
        y2="330"
        stroke="rgba(0,0,0,0.22)"
        strokeWidth="1.25"
        markerEnd="url(#diagrama-arrow-default)"
      />

      {/* Bus Horizontal Fila 2 (hacia VLAN 50, VLAN 40, VLAN 99 en paralelo directo) */}
      <line x1="175" y1="496" x2="785" y2="496" stroke="rgba(0,0,0,0.22)" strokeWidth="1.25" />
      <line
        x1="175"
        y1="496"
        x2="175"
        y2="505"
        stroke="rgba(0,0,0,0.22)"
        strokeWidth="1.25"
        markerEnd="url(#diagrama-arrow-default)"
      />
      <line
        x1="480"
        y1="496"
        x2="480"
        y2="505"
        stroke="rgba(0,0,0,0.22)"
        strokeWidth="1.25"
        markerEnd="url(#diagrama-arrow-default)"
      />
      <line
        x1="785"
        y1="496"
        x2="785"
        y2="505"
        stroke="rgba(0,0,0,0.22)"
        strokeWidth="1.25"
        markerEnd="url(#diagrama-arrow-default)"
      />

      {/* ─────────────────────────────────────────────────────────────
          2. DISPOSITIVOS PRINCIPALES DE CABECERA (TOPOLOGY CORE)
          ───────────────────────────────────────────────────────────── */}

      {/* Nivel 1: Internet */}
      <g transform="translate(410, 25)" className={styles.nodeCard}>
        <rect
          x="0"
          y="0"
          width="140"
          height="38"
          rx="10"
          fill="#ffffff"
          stroke="rgba(0,0,0,0.12)"
          filter="url(#diagrama-card-shadow)"
        />
        <g transform="translate(14, 11)">
          <SvgIcon name="cloud" size={16} color="#111827" />
        </g>
        <text
          x="40"
          y="24"
          fill="#111827"
          fontSize="12"
          fontWeight="700"
          fontFamily="var(--font-family, system-ui, sans-serif)"
        >
          Internet
        </text>
      </g>

      {/* Nivel 2: Router */}
      <g transform="translate(405, 95)" className={styles.nodeCard}>
        <rect
          x="0"
          y="0"
          width="150"
          height="38"
          rx="10"
          fill="#ffffff"
          stroke="rgba(0,0,0,0.12)"
          filter="url(#diagrama-card-shadow)"
        />
        <g transform="translate(14, 11)">
          <SvgIcon name="router" size={16} color="#111827" />
        </g>
        <text
          x="40"
          y="24"
          fill="#111827"
          fontSize="12"
          fontWeight="700"
          fontFamily="var(--font-family, system-ui, sans-serif)"
        >
          Router
        </text>
      </g>

      {/* Nivel 3: Firewall Central */}
      <g transform="translate(400, 165)" className={styles.nodeCard}>
        <rect
          x="0"
          y="0"
          width="160"
          height="42"
          rx="10"
          fill="#111827"
          stroke="#27272a"
          filter="url(#diagrama-dark-shadow)"
        />
        <g transform="translate(14, 12)">
          <SvgIcon name="firewall" size={18} color="#ffffff" />
        </g>
        <text
          x="42"
          y="26"
          fill="#ffffff"
          fontSize="12.5"
          fontWeight="700"
          fontFamily="var(--font-family, system-ui, sans-serif)"
        >
          Firewall
        </text>
      </g>

      {/* Bloque Rectangular DMZ (Aislado lateralmente) */}
      <g transform="translate(645, 145)">
        <rect
          x="0"
          y="0"
          width="280"
          height="80"
          rx="10"
          fill="rgba(0, 0, 0, 0.015)"
          stroke="rgba(0, 0, 0, 0.12)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text
          x="12"
          y="18"
          fill="#111827"
          fontSize="9.5"
          fontWeight="700"
          letterSpacing="0.05em"
          fontFamily="var(--font-family, system-ui, sans-serif)"
        >
          VLAN 10 · DMZ
        </text>
        <text
          x="100"
          y="18"
          fill="#6b7280"
          fontSize="8.5"
          fontWeight="500"
          fontFamily="var(--font-mono, monospace)"
        >
          · 10.10.10.0/28
        </text>

        {/* Dispositivo en DMZ */}
        <g transform="translate(12, 28)" className={styles.nodeCard}>
          <rect
            x="0"
            y="0"
            width="256"
            height="40"
            rx="8"
            fill="#ffffff"
            stroke="rgba(0,0,0,0.1)"
            filter="url(#diagrama-card-shadow)"
          />
          <g transform="translate(14, 11)">
            <SvgIcon name="server" size={17} color="#111827" />
          </g>
          <text
            x="42"
            y="25"
            fill="#111827"
            fontSize="12"
            fontWeight="600"
            fontFamily="var(--font-family, system-ui, sans-serif)"
          >
            Proxy Inverso / Web
          </text>
        </g>
      </g>

      {/* Nivel 4: Switch Principal */}
      <g transform="translate(395, 240)" className={styles.nodeCard}>
        <rect
          x="0"
          y="0"
          width="170"
          height="40"
          rx="10"
          fill="#ffffff"
          stroke="rgba(0,0,0,0.12)"
          filter="url(#diagrama-card-shadow)"
        />
        <g transform="translate(14, 11)">
          <SvgIcon name="switch" size={17} color="#111827" />
        </g>
        <text
          x="40"
          y="25"
          fill="#111827"
          fontSize="12"
          fontWeight="700"
          fontFamily="var(--font-family, system-ui, sans-serif)"
        >
          Switch Principal
        </text>
      </g>

      {/* ─────────────────────────────────────────────────────────────
          3. BLOQUES RECTANGULARES POR VLAN — FILA 1 (Y = 330 A 480)
          ───────────────────────────────────────────────────────────── */}

      {/* ── BLOQUE 1: VLAN 20 — USUARIOS ── */}
      <g transform="translate(35, 330)">
        <rect
          x="0"
          y="0"
          width="280"
          height="150"
          rx="10"
          fill="rgba(0, 0, 0, 0.012)"
          stroke="rgba(0, 0, 0, 0.12)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text
          x="12"
          y="18"
          fill="#111827"
          fontSize="9.5"
          fontWeight="700"
          letterSpacing="0.05em"
          fontFamily="var(--font-family, system-ui, sans-serif)"
        >
          VLAN 20 · USUARIOS
        </text>
        <text
          x="142"
          y="18"
          fill="#6b7280"
          fontSize="8.5"
          fontWeight="500"
          fontFamily="var(--font-mono, monospace)"
        >
          · 10.10.20.0/24
        </text>

        {/* Dispositivo 1: Computadoras */}
        <g transform="translate(12, 36)" className={styles.nodeCard}>
          <rect
            x="0"
            y="0"
            width="256"
            height="42"
            rx="8"
            fill="#ffffff"
            stroke="rgba(0,0,0,0.09)"
            filter="url(#diagrama-card-shadow)"
          />
          <g transform="translate(14, 12)">
            <SvgIcon name="computer" size={17} color="#111827" />
          </g>
          <text
            x="42"
            y="26"
            fill="#111827"
            fontSize="12"
            fontWeight="600"
            fontFamily="var(--font-family, system-ui, sans-serif)"
          >
            Computadoras
          </text>
        </g>

        {/* Dispositivo 2: Laptops */}
        <g transform="translate(12, 90)" className={styles.nodeCard}>
          <rect
            x="0"
            y="0"
            width="256"
            height="42"
            rx="8"
            fill="#ffffff"
            stroke="rgba(0,0,0,0.09)"
            filter="url(#diagrama-card-shadow)"
          />
          <g transform="translate(14, 12)">
            <SvgIcon name="laptop" size={17} color="#111827" />
          </g>
          <text
            x="42"
            y="26"
            fill="#111827"
            fontSize="12"
            fontWeight="600"
            fontFamily="var(--font-family, system-ui, sans-serif)"
          >
            Laptops
          </text>
        </g>
      </g>

      {/* ── BLOQUE 2: VLAN 30 — SERVIDORES ── */}
      <g transform="translate(340, 330)">
        <rect
          x="0"
          y="0"
          width="280"
          height="150"
          rx="10"
          fill="rgba(0, 0, 0, 0.012)"
          stroke="rgba(0, 0, 0, 0.14)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text
          x="12"
          y="18"
          fill="#111827"
          fontSize="9.5"
          fontWeight="700"
          letterSpacing="0.05em"
          fontFamily="var(--font-family, system-ui, sans-serif)"
        >
          VLAN 30 · RESTRINGIDA (CORE)
        </text>
        <text
          x="195"
          y="18"
          fill="#6b7280"
          fontSize="8.5"
          fontWeight="500"
          fontFamily="var(--font-mono, monospace)"
        >
          · 10.10.30.0/28
        </text>

        {/* Dispositivo 1: Servidor ERP / App */}
        <g transform="translate(12, 36)" className={styles.nodeCard}>
          <rect
            x="0"
            y="0"
            width="256"
            height="42"
            rx="8"
            fill="#ffffff"
            stroke="rgba(0,0,0,0.1)"
            filter="url(#diagrama-card-shadow)"
          />
          <g transform="translate(14, 12)">
            <SvgIcon name="server" size={17} color="#111827" />
          </g>
          <text
            x="42"
            y="26"
            fill="#111827"
            fontSize="12"
            fontWeight="600"
            fontFamily="var(--font-family, system-ui, sans-serif)"
          >
            Servidor ERP / App
          </text>
        </g>

        {/* Dispositivo 2: Base de Datos */}
        <g transform="translate(12, 90)" className={styles.nodeCard}>
          <rect
            x="0"
            y="0"
            width="256"
            height="42"
            rx="8"
            fill="#ffffff"
            stroke="rgba(0,0,0,0.1)"
            filter="url(#diagrama-card-shadow)"
          />
          <g transform="translate(14, 12)">
            <SvgIcon name="database" size={17} color="#111827" />
          </g>
          <text
            x="42"
            y="26"
            fill="#111827"
            fontSize="12"
            fontWeight="600"
            fontFamily="var(--font-family, system-ui, sans-serif)"
          >
            Base de Datos
          </text>
        </g>
      </g>

      {/* ── BLOQUE 3: VLAN 25 — ADMINISTRACIÓN ── */}
      <g transform="translate(645, 330)">
        <rect
          x="0"
          y="0"
          width="280"
          height="150"
          rx="10"
          fill="rgba(0, 0, 0, 0.012)"
          stroke="rgba(0, 0, 0, 0.12)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text
          x="12"
          y="18"
          fill="#111827"
          fontSize="9.5"
          fontWeight="700"
          letterSpacing="0.05em"
          fontFamily="var(--font-family, system-ui, sans-serif)"
        >
          VLAN 25 · FINANZAS & RRHH
        </text>
        <text
          x="185"
          y="18"
          fill="#6b7280"
          fontSize="8.5"
          fontWeight="500"
          fontFamily="var(--font-mono, monospace)"
        >
          · 10.10.25.0/26
        </text>

        {/* Dispositivo 1: Estaciones de Trabajo */}
        <g transform="translate(12, 36)" className={styles.nodeCard}>
          <rect
            x="0"
            y="0"
            width="256"
            height="42"
            rx="8"
            fill="#ffffff"
            stroke="rgba(0,0,0,0.09)"
            filter="url(#diagrama-card-shadow)"
          />
          <g transform="translate(14, 12)">
            <SvgIcon name="computer" size={17} color="#111827" />
          </g>
          <text
            x="42"
            y="26"
            fill="#111827"
            fontSize="12"
            fontWeight="600"
            fontFamily="var(--font-family, system-ui, sans-serif)"
          >
            Estaciones de Trabajo
          </text>
        </g>

        {/* Dispositivo 2: Equipos de Finanzas */}
        <g transform="translate(12, 90)" className={styles.nodeCard}>
          <rect
            x="0"
            y="0"
            width="256"
            height="42"
            rx="8"
            fill="#ffffff"
            stroke="rgba(0,0,0,0.09)"
            filter="url(#diagrama-card-shadow)"
          />
          <g transform="translate(14, 12)">
            <SvgIcon name="laptop" size={17} color="#111827" />
          </g>
          <text
            x="42"
            y="26"
            fill="#111827"
            fontSize="12"
            fontWeight="600"
            fontFamily="var(--font-family, system-ui, sans-serif)"
          >
            Equipos de Finanzas
          </text>
        </g>
      </g>

      {/* ─────────────────────────────────────────────────────────────
          4. BLOQUES RECTANGULARES POR VLAN — FILA 2 (Y = 505 A 655)
          ───────────────────────────────────────────────────────────── */}

      {/* ── BLOQUE 4: VLAN 50 — GESTIÓN ── */}
      <g transform="translate(35, 505)">
        <rect
          x="0"
          y="0"
          width="280"
          height="150"
          rx="10"
          fill="rgba(0, 0, 0, 0.012)"
          stroke="rgba(0, 0, 0, 0.12)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text
          x="12"
          y="18"
          fill="#111827"
          fontSize="9.5"
          fontWeight="700"
          letterSpacing="0.05em"
          fontFamily="var(--font-family, system-ui, sans-serif)"
        >
          VLAN 50 · GESTIÓN
        </text>
        <text
          x="132"
          y="18"
          fill="#6b7280"
          fontSize="8.5"
          fontWeight="500"
          fontFamily="var(--font-mono, monospace)"
        >
          · 10.10.50.0/28
        </text>

        {/* Dispositivo 1: Servidor Bastión */}
        <g transform="translate(12, 36)" className={styles.nodeCard}>
          <rect
            x="0"
            y="0"
            width="256"
            height="42"
            rx="8"
            fill="#ffffff"
            stroke="rgba(0,0,0,0.09)"
            filter="url(#diagrama-card-shadow)"
          />
          <g transform="translate(14, 12)">
            <SvgIcon name="terminal" size={17} color="#111827" />
          </g>
          <text
            x="42"
            y="26"
            fill="#111827"
            fontSize="12"
            fontWeight="600"
            fontFamily="var(--font-family, system-ui, sans-serif)"
          >
            Servidor Bastión
          </text>
        </g>

        {/* Dispositivo 2: Consola de Gestión */}
        <g transform="translate(12, 90)" className={styles.nodeCard}>
          <rect
            x="0"
            y="0"
            width="256"
            height="42"
            rx="8"
            fill="#ffffff"
            stroke="rgba(0,0,0,0.09)"
            filter="url(#diagrama-card-shadow)"
          />
          <g transform="translate(14, 12)">
            <SvgIcon name="computer" size={17} color="#111827" />
          </g>
          <text
            x="42"
            y="26"
            fill="#111827"
            fontSize="12"
            fontWeight="600"
            fontFamily="var(--font-family, system-ui, sans-serif)"
          >
            Consola de Gestión
          </text>
        </g>
      </g>

      {/* ── BLOQUE 5: VLAN 40 — RESPALDOS & LOGS ── */}
      <g transform="translate(340, 505)">
        <rect
          x="0"
          y="0"
          width="280"
          height="150"
          rx="10"
          fill="rgba(0, 0, 0, 0.012)"
          stroke="rgba(0, 0, 0, 0.12)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text
          x="12"
          y="18"
          fill="#111827"
          fontSize="9.5"
          fontWeight="700"
          letterSpacing="0.05em"
          fontFamily="var(--font-family, system-ui, sans-serif)"
        >
          VLAN 40 · RESPALDOS & LOGS
        </text>
        <text
          x="192"
          y="18"
          fill="#6b7280"
          fontSize="8.5"
          fontWeight="500"
          fontFamily="var(--font-mono, monospace)"
        >
          · 10.10.40.0/28
        </text>

        {/* Dispositivo 1: Servidor de Respaldo */}
        <g transform="translate(12, 36)" className={styles.nodeCard}>
          <rect
            x="0"
            y="0"
            width="256"
            height="42"
            rx="8"
            fill="#ffffff"
            stroke="rgba(0,0,0,0.09)"
            filter="url(#diagrama-card-shadow)"
          />
          <g transform="translate(14, 12)">
            <SvgIcon name="vault" size={17} color="#111827" />
          </g>
          <text
            x="42"
            y="26"
            fill="#111827"
            fontSize="12"
            fontWeight="600"
            fontFamily="var(--font-family, system-ui, sans-serif)"
          >
            Servidor de Respaldo
          </text>
        </g>

        {/* Dispositivo 2: Servidor de Logs */}
        <g transform="translate(12, 90)" className={styles.nodeCard}>
          <rect
            x="0"
            y="0"
            width="256"
            height="42"
            rx="8"
            fill="#ffffff"
            stroke="rgba(0,0,0,0.09)"
            filter="url(#diagrama-card-shadow)"
          />
          <g transform="translate(14, 12)">
            <SvgIcon name="activity" size={17} color="#111827" />
          </g>
          <text
            x="42"
            y="26"
            fill="#111827"
            fontSize="12"
            fontWeight="600"
            fontFamily="var(--font-family, system-ui, sans-serif)"
          >
            Servidor de Logs
          </text>
        </g>
      </g>

      {/* ── BLOQUE 6: VLAN 99 — INVITADOS & IOT ── */}
      <g transform="translate(645, 505)">
        <rect
          x="0"
          y="0"
          width="280"
          height="150"
          rx="10"
          fill="rgba(0, 0, 0, 0.012)"
          stroke="rgba(0, 0, 0, 0.12)"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        <text
          x="12"
          y="18"
          fill="#111827"
          fontSize="9.5"
          fontWeight="700"
          letterSpacing="0.05em"
          fontFamily="var(--font-family, system-ui, sans-serif)"
        >
          VLAN 99 · INVITADOS & IOT
        </text>
        <text
          x="175"
          y="18"
          fill="#6b7280"
          fontSize="8.5"
          fontWeight="500"
          fontFamily="var(--font-mono, monospace)"
        >
          · 10.10.99.0/24
        </text>

        {/* Dispositivo 1: Punto de Acceso Wi-Fi */}
        <g transform="translate(12, 36)" className={styles.nodeCard}>
          <rect
            x="0"
            y="0"
            width="256"
            height="42"
            rx="8"
            fill="#ffffff"
            stroke="rgba(0,0,0,0.09)"
            filter="url(#diagrama-card-shadow)"
          />
          <g transform="translate(14, 12)">
            <SvgIcon name="wifi" size={17} color="#111827" />
          </g>
          <text
            x="42"
            y="26"
            fill="#111827"
            fontSize="12"
            fontWeight="600"
            fontFamily="var(--font-family, system-ui, sans-serif)"
          >
            Punto de Acceso Wi-Fi
          </text>
        </g>

        {/* Fila inferior de 2 dispositivos: Móviles e Impresora */}
        <g transform="translate(12, 90)" className={styles.nodeCard}>
          <rect
            x="0"
            y="0"
            width="122"
            height="42"
            rx="8"
            fill="#ffffff"
            stroke="rgba(0,0,0,0.09)"
            filter="url(#diagrama-card-shadow)"
          />
          <g transform="translate(12, 12)">
            <SvgIcon name="phone" size={16} color="#111827" />
          </g>
          <text
            x="36"
            y="26"
            fill="#111827"
            fontSize="11.5"
            fontWeight="600"
            fontFamily="var(--font-family, system-ui, sans-serif)"
          >
            Móviles
          </text>
        </g>

        <g transform="translate(146, 90)" className={styles.nodeCard}>
          <rect
            x="0"
            y="0"
            width="122"
            height="42"
            rx="8"
            fill="#ffffff"
            stroke="rgba(0,0,0,0.09)"
            filter="url(#diagrama-card-shadow)"
          />
          <g transform="translate(12, 12)">
            <SvgIcon name="printer" size={16} color="#111827" />
          </g>
          <text
            x="36"
            y="26"
            fill="#111827"
            fontSize="11.5"
            fontWeight="600"
            fontFamily="var(--font-family, system-ui, sans-serif)"
          >
            Impresora
          </text>
        </g>
      </g>
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   PLACEHOLDER VACÍO / WIREFRAME
   ═══════════════════════════════════════════════════════════════════ */

function DiagramaEmptyPlaceholder() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 text-neutral-400 pointer-events-none">
      <svg
        className="w-12 h-12 mb-3 stroke-current opacity-40"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <circle cx="15.5" cy="15.5" r="1.5" />
        <path d="M8.5 8.5 L 15.5 15.5" strokeDasharray="2 2" />
      </svg>
      <span className="text-xs font-semibold text-neutral-500 tracking-tight">
        Lienzo de Diagrama Listo
      </span>
      <span className="text-[11px] text-neutral-400 mt-0.5">
        Agrega tus elementos SVG, nodos o componentes visuales específicos
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL: Diagrama
   ═══════════════════════════════════════════════════════════════════ */

export default function Diagrama({
  title,
  description,
  badge,
  headerRight,
  caption,
  footer,
  viewBox,
  aspectRatio,
  height,
  minHeight = 440,
  grid = 'dots',
  glow,
  hover = false,
  noHover = false,
  zoomable = true,
  defaultZoom = 1,
  minZoom = 0.6,
  maxZoom = 2.2,
  draggable = true,
  className = '',
  style,
  children,
  ...restProps
}: DiagramaProps) {
  const [zoom, setZoom] = useState<number>(defaultZoom)
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState<boolean>(false)

  const isPanningRef = useRef(false)
  const startPosRef = useRef({ x: 0, y: 0 })
  const panStartRef = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement | null>(null)

  const handleZoomIn = useCallback(() => {
    setZoom((prev) => Math.min(maxZoom, Math.round((prev + 0.15) * 100) / 100))
  }, [maxZoom])

  const handleZoomOut = useCallback(() => {
    setZoom((prev) => Math.max(minZoom, Math.round((prev - 0.15) * 100) / 100))
  }, [minZoom])

  const handleResetZoom = useCallback(() => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }, [])

  // Drag / Pan handlers
  const canDrag = draggable && (zoomable || zoom > 1 || pan.x !== 0 || pan.y !== 0)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // Solo botón izquierdo del ratón y si arrastre está permitido
      if (e.button !== 0 || !canDrag) return
      isPanningRef.current = true
      setIsDragging(true)
      startPosRef.current = { x: e.clientX, y: e.clientY }
      panStartRef.current = { ...pan }
    },
    [canDrag, pan]
  )

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanningRef.current) return
    const dx = e.clientX - startPosRef.current.x
    const dy = e.clientY - startPosRef.current.y
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    })
  }, [])

  const handleMouseUp = useCallback(() => {
    if (isPanningRef.current) {
      isPanningRef.current = false
      setIsDragging(false)
    }
  }, [])

  // Zoom con rueda del ratón (Ctrl/Meta + Wheel o Wheel libre si zoomable)
  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (!zoomable) return
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault()
        const delta = e.deltaY > 0 ? -0.1 : 0.1
        setZoom((prev) =>
          Math.min(maxZoom, Math.max(minZoom, Math.round((prev + delta) * 100) / 100))
        )
      }
    },
    [zoomable, minZoom, maxZoom]
  )

  // Touch handlers para dispositivos táctiles
  const handleTouchStart = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!canDrag || e.touches.length !== 1) return
      const touch = e.touches[0]
      isPanningRef.current = true
      setIsDragging(true)
      startPosRef.current = { x: touch.clientX, y: touch.clientY }
      panStartRef.current = { ...pan }
    },
    [canDrag, pan]
  )

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isPanningRef.current || e.touches.length !== 1) return
    const touch = e.touches[0]
    const dx = touch.clientX - startPosRef.current.x
    const dy = touch.clientY - startPosRef.current.y
    setPan({
      x: panStartRef.current.x + dx,
      y: panStartRef.current.y + dy,
    })
  }, [])

  const handleTouchEnd = useCallback(() => {
    isPanningRef.current = false
    setIsDragging(false)
  }, [])

  const isHoverEnabled = !noHover && (hover === true || hover === 'true')
  const showHeader = Boolean(title || headerRight || zoomable)
  const showFooter = Boolean(caption || footer)

  const resolvedGrid = grid === true ? 'dots' : grid === false ? 'none' : grid

  const containerStyle: CSSProperties = {
    minHeight: typeof minHeight === 'number' ? `${minHeight}px` : minHeight,
    height: typeof height === 'number' ? `${height}px` : height,
    aspectRatio: aspectRatio ?? undefined,
    ...style,
  }

  const glowBackground =
    typeof glow === 'string' ? glow : glow ? 'var(--color-accent, #ff3366)' : null

  return (
    <div
      ref={containerRef}
      className={`
        diagrama-container
        ${styles.container}
        ${isHoverEnabled ? styles.hasHover : styles.noHover}
        relative w-full overflow-hidden select-none
        rounded-2xl border border-neutral-200/80
        bg-[#f8f9fa] text-neutral-800
        transition-all duration-200
        ${className}
      `.trim()}
      style={containerStyle}
      {...restProps}
    >
      {/* 1. Fondo: Cuadrícula ultra-minimalista */}
      {resolvedGrid === 'dots' && <div className={styles.gridDots} aria-hidden="true" />}
      {resolvedGrid === 'lines' && <div className={styles.gridLines} aria-hidden="true" />}

      {glowBackground && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20 blur-3xl"
          style={{
            background: `radial-gradient(circle at center, ${glowBackground} 0%, transparent 68%)`,
          }}
          aria-hidden="true"
        />
      )}

      {/* 2. Cabecera minimalista limpia con controles de zoom */}
      {showHeader && (
        <header className={styles.header}>
          {title ? <span className={styles.title}>{title}</span> : <span aria-hidden="true" />}
          <div className={styles.headerRight}>
            {zoomable && (
              <div className={styles.zoomControls} role="group" aria-label="Controles de zoom">
                <button
                  type="button"
                  onClick={handleZoomOut}
                  disabled={zoom <= minZoom}
                  className={styles.zoomButton}
                  title="Alejar (Zoom out)"
                  aria-label="Alejar diagrama"
                >
                  <SvgIcon name="zoomOut" size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleResetZoom}
                  className={styles.zoomLevel}
                  title="Restablecer zoom y posición"
                  aria-label="Restablecer zoom y posición"
                >
                  {Math.round(zoom * 100)}%
                </button>
                <button
                  type="button"
                  onClick={handleZoomIn}
                  disabled={zoom >= maxZoom}
                  className={styles.zoomButton}
                  title="Acercar (Zoom in)"
                  aria-label="Acercar diagrama"
                >
                  <SvgIcon name="zoomIn" size={14} />
                </button>
              </div>
            )}
            {headerRight}
          </div>
        </header>
      )}

      {/* 3. Canvas principal con escala de zoom y paneo / arrastre */}
      <div
        className={`
          ${styles.canvasWrapper}
          ${canDrag ? styles.canDrag : ''}
          ${isDragging ? styles.isDragging : ''}
        `.trim()}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        <div
          className={`
            ${styles.zoomableContent}
            ${isDragging ? styles.isPanning : ''}
          `.trim()}
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          {children ? (
            viewBox ? (
              <svg
                className={styles.svgCanvas}
                viewBox={viewBox}
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <marker
                    id="diagrama-arrow-default"
                    viewBox="0 0 10 10"
                    refX="8"
                    refY="5"
                    markerWidth="6"
                    markerHeight="6"
                    orient="auto-start-reverse"
                  >
                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="rgba(0, 0, 0, 0.35)" />
                  </marker>
                </defs>
                {children}
              </svg>
            ) : (
              children
            )
          ) : (
            <NetworkSegmentationArchitecture />
          )}
        </div>
      </div>

      {/* 4. Pie de diagrama / Leyenda */}
      {showFooter && (
        <footer className={styles.footer}>
          {caption && <span className="opacity-75">{caption}</span>}
          {footer}
        </footer>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════════
   ASIGNACIÓN DE SUBCOMPONENTES (COMPOUND PATTERN)
   ═══════════════════════════════════════════════════════════════════ */

Diagrama.Zone = DiagramaZone
Diagrama.Connector = DiagramaConnector
Diagrama.Node = DiagramaNode
Diagrama.NetworkArchitecture = NetworkSegmentationArchitecture
