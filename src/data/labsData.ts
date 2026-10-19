/**
 * Educational Interactive Labs Data Definition
 * Provides metadata and manifest for LILIUM interactive cyber-range labs.
 */

export type LabDifficulty = 'Principiante' | 'Intermedio' | 'Avanzado'

export interface LabItem {
  id: string
  slug: string
  title: string
  category: string
  description: string
  duration: string
  difficulty: LabDifficulty
  totalSteps: number
  completedSteps: number
  recommendedFor: string
  isNewUserDefault: boolean
  tag: string
  accentColor: string
  relatedDocSection?: string
  highlights?: string[]
}

export const LABS: LabItem[] = [
  {
    id: 'lab-01',
    slug: 'estacion-olvidada',
    title: 'La estación olvidada: Primer contacto con la terminal',
    category: 'Fundamentos de Sistemas y Seguridad',
    description:
      'Un equipo olvidado vuelve a encenderse, nadie sabe en qué estado quedó. Tendrás que asumir el rol de custodio/a del sistema: explora a través de la terminal sus archivos, usuarios y procesos, documenta tus hallazgos, trabaja con herramientas SIEM y EDR ficticias y aplica medidas básicas de seguridad aprendidas en el Módulo 1. Investiga a tu ritmo, y descubre qué rastros dejó el tiempo.',
    duration: '25 min',
    difficulty: 'Principiante',
    totalSteps: 4,
    completedSteps: 0,
    recommendedFor: 'Recomendado para nuevos usuarios y principiantes',
    isNewUserDefault: true,
    tag: 'Lab Módulo 1',
    accentColor: '#ff3366',
    relatedDocSection: 'layer-1/networks-operating-systems-os',
    highlights: [
      'Exploración del sistema de archivos Linux y sus componentes.',
      'Identificación de usuarios, procesos y recursos relevantes.',
      'Reconocimiento de configuraciones y permisos que pueden representar riesgos.',
      'Aplicación de buenas practicas y una mentalidad de seguridad',
    ],
  },
  {
    id: 'lab-02',
    slug: 'phishing-defense',
    title: 'Detección y Análisis de Phishing Corporativo',
    category: 'Defensa Activa & Concienciación',
    description:
      'Inspecciona cabeceras SPF, DKIM y DMARC en un cliente de correo simulado e intercepta vectores de ingeniería social dirigidos a identidades empresariales.',
    duration: '15 min',
    difficulty: 'Principiante',
    totalSteps: 4,
    completedSteps: 0,
    recommendedFor: 'Recomendado por Fundamentos de Amenazas',
    isNewUserDefault: true,
    tag: 'Prioridad PyME',
    accentColor: '#10b981',
    relatedDocSection: 'layer-1/threats-attacks',
    highlights: ['Validación DNS & DKIM', 'Detección de Spoofing', 'Análisis de Payloads'],
  },
  {
    id: 'lab-03',
    slug: 'owasp-api-defense',
    title: 'Mitigación de Vulnerabilidades OWASP en APIs',
    category: 'Seguridad Web & APIs',
    description:
      'Identifica y remedia inyecciones SQL ciegas, fallos de validación en tokens JWT y desconfiguraciones CORS críticas en servicios expuestos.',
    duration: '30 min',
    difficulty: 'Intermedio',
    totalSteps: 8,
    completedSteps: 0,
    recommendedFor: 'Basado en Arquitectura Segura',
    isNewUserDefault: false,
    tag: 'OWASP Top 10',
    accentColor: '#6366f1',
    relatedDocSection: 'layer-3',
    highlights: ['JWT Tampering', 'Prepared Statements', 'CORS & WAF Rules'],
  },
  {
    id: 'lab-04',
    slug: 'zero-trust-network',
    title: 'Segmentación Zero-Trust y Políticas de Red',
    category: 'Arquitectura & Microsegmentación',
    description:
      'Modela zonas de contención de tráfico este-oeste, túneles VPN autenticados y aislamiento perimetral para evitar movimientos laterales del adversario.',
    duration: '25 min',
    difficulty: 'Intermedio',
    totalSteps: 5,
    completedSteps: 0,
    recommendedFor: 'Basado en Redes y Sistemas',
    isNewUserDefault: false,
    tag: 'Zero-Trust',
    accentColor: '#0ea5e9',
    relatedDocSection: 'layer-4',
    highlights: ['VLANs aisladas', 'Reglas de Microsegmentación', 'Control de Acceso IAM'],
  },
  {
    id: 'lab-05',
    slug: 'siem-incident-triage',
    title: 'Triaje de Incidentes y Detección con Reglas SIEM',
    category: 'Detección & Monitorización',
    description:
      'Rastrea eventos anómalos en logs unificados de servidores, correlaciona ataques de fuerza bruta concurrentes y dispara alertas automáticas.',
    duration: '35 min',
    difficulty: 'Avanzado',
    totalSteps: 7,
    completedSteps: 0,
    recommendedFor: 'Basado en Detección & Logs',
    isNewUserDefault: false,
    tag: 'SIEM & SOC',
    accentColor: '#f59e0b',
    relatedDocSection: 'layer-5',
    highlights: ['Reglas Sigma / YARA', 'Correlación Temporal', 'Alertas de Fuerza Bruta'],
  },
  {
    id: 'lab-06',
    slug: 'ransomware-response',
    title: 'Respuesta a Incidentes y Recuperación de Ransomware',
    category: 'Respuesta a Incidentes & Resiliencia',
    description:
      'Ejecuta el protocolo de contención inmediata: aislamiento de host comprometido, validación de respaldos inmutables y reapertura segura del servicio.',
    duration: '40 min',
    difficulty: 'Avanzado',
    totalSteps: 9,
    completedSteps: 0,
    recommendedFor: 'Basado en Resiliencia PyME',
    isNewUserDefault: false,
    tag: 'Simulación de Crisis',
    accentColor: '#ec4899',
    relatedDocSection: 'layer-6',
    highlights: ['Aislamiento de Carga', 'Snapshots Inmutables', 'Plan de Continuidad'],
  },
]
