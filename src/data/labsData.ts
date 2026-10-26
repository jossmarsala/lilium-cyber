/**
 * Educational Interactive Labs Data Definition
 * Provides metadata and manifest for LILIUM interactive cyber-range labs.
 */

export type LabDifficulty =
  'Módulo 1' | 'Módulo 2' | 'Módulo 3' | 'Módulo 4' | 'Módulo 5' | 'Módulo 6'

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
  available?: boolean
  relatedDocSection?: string
  highlights?: string[]
}

export const LABS: LabItem[] = [
  {
    id: 'lab-01',
    slug: 'estacion-olvidada',
    title: 'Lab 1: Primer Contacto con la Ciberseguridad',
    category: 'Fundamentos de Sistemas y Seguridad',
    description:
      'Una estación botánica lleva semanas en piloto automático y nadie conoce su estado actual. Como operario/a de seguridad tendrás que usar la terminal de Linux para investigar y documentar tus evidencias en la Bitácora.',
    duration: '25 min',
    difficulty: 'Módulo 1',
    totalSteps: 4,
    completedSteps: 0,
    recommendedFor: 'Recomendado para nuevos usuarios y principiantes',
    isNewUserDefault: true,
    tag: 'Lab Módulo 1',
    accentColor: '#ff3366',
    available: true,
    relatedDocSection: 'layer-1/networks-operating-systems-os',
    highlights: [
      'Exploración del sistema de archivos Linux y sus componentes.',
      'Identificación de usuarios, procesos y recursos relevantes.',
      'Reconocimiento y documentación de activos y riesgos.',
      'Aplicación de buenas practicas y una mentalidad de seguridad',
    ],
  },
  {
    id: 'lab-02',
    slug: 'phishing-defense',
    title: 'Lab 2',
    category: 'En desarrollo',
    description:
      'Este laboratorio se encuentra actualmente en desarrollo y no está disponible aún.',
    duration: '-- min',
    difficulty: 'Módulo 2',
    totalSteps: 0,
    completedSteps: 0,
    recommendedFor: 'En desarrollo',
    isNewUserDefault: false,
    tag: 'Próximamente',
    accentColor: '#10b981',
    available: false,
  },
  {
    id: 'lab-03',
    slug: 'owasp-api-defense',
    title: 'Lab 3',
    category: 'En desarrollo',
    description:
      'Este laboratorio se encuentra actualmente en desarrollo y no está disponible aún.',
    duration: '-- min',
    difficulty: 'Módulo 3',
    totalSteps: 0,
    completedSteps: 0,
    recommendedFor: 'En desarrollo',
    isNewUserDefault: false,
    tag: 'Próximamente',
    accentColor: '#6366f1',
    available: false,
  },
  {
    id: 'lab-04',
    slug: 'zero-trust-network',
    title: 'Lab 4',
    category: 'En desarrollo',
    description:
      'Este laboratorio se encuentra actualmente en desarrollo y no está disponible aún.',
    duration: '-- min',
    difficulty: 'Módulo 4',
    totalSteps: 0,
    completedSteps: 0,
    recommendedFor: 'En desarrollo',
    isNewUserDefault: false,
    tag: 'Próximamente',
    accentColor: '#0ea5e9',
    available: false,
  },
  {
    id: 'lab-05',
    slug: 'siem-incident-triage',
    title: 'Lab 5',
    category: 'En desarrollo',
    description:
      'Este laboratorio se encuentra actualmente en desarrollo y no está disponible aún.',
    duration: '-- min',
    difficulty: 'Módulo 5',
    totalSteps: 0,
    completedSteps: 0,
    recommendedFor: 'En desarrollo',
    isNewUserDefault: false,
    tag: 'Próximamente',
    accentColor: '#f59e0b',
    available: false,
  },
  {
    id: 'lab-06',
    slug: 'ransomware-response',
    title: 'Lab 6',
    category: 'En desarrollo',
    description:
      'Este laboratorio se encuentra actualmente en desarrollo y no está disponible aún.',
    duration: '-- min',
    difficulty: 'Módulo 6',
    totalSteps: 0,
    completedSteps: 0,
    recommendedFor: 'En desarrollo',
    isNewUserDefault: false,
    tag: 'Próximamente',
    accentColor: '#ec4899',
    available: false,
  },
]
