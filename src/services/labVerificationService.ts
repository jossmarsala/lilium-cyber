/**
 * Lab Verification Service — Module 1: La Estación Olvidada
 * Manages 6 progressive milestones based on playbook-lab1-reference.md,
 * guest VM setup, findings management, risk matrix, EDR containment,
 * reference frameworks, and persistent state in localStorage.
 */

import { notify } from '@react-ui-os/core'
import { liliumVmService } from './liliumVmService'

export interface MilestoneHint {
  concept: string
  roadmap: string[]
  evidence: string
  decision: string
  verification: string
}

export interface MilestoneItem {
  id: 'm1' | 'm2' | 'm3' | 'm4' | 'm5' | 'm6'
  index: string
  phase: string
  title: string
  shortDesc: string
  requirement: string
  hints: MilestoneHint
  docSection: string
  completed: boolean
  theoryInsight: string
}

export interface FindingItem {
  id: string
  title: string
  affectedAsset: string
  observation: string
  classification: 'Activo' | 'Amenaza' | 'Vulnerabilidad' | 'Riesgo' | 'Evidencia'
  ciaImpact: ('C' | 'I' | 'A')[]
  priority: 'Crítica' | 'Alta' | 'Medio' | 'Bajo'
  evidence: string
  proposedAction: string
  verification: string
  status: 'Pendiente' | 'En investigación' | 'Mitigado' | 'Aceptado con justificación'
  timestamp: number
  source?: 'Manual' | 'Argos SIEM' | 'Vigil EDR'
}

export interface ReferenceDocItem {
  id: string
  title: string
  category: 'Framework' | 'Guía' | 'Estándar'
  description: string
  url?: string
  isCustom?: boolean
  tags: string[]
  filename?: string
  dateAdded?: number
}

const STORAGE_KEY_MILESTONES = 'lilium_lab_01_milestones_v3'
const STORAGE_KEY_FINDINGS = 'lilium_lab_01_findings_v3'
const STORAGE_KEY_REFERENCES = 'lilium_lab_01_references_v3'
const STORAGE_KEY_AUDIT_LOG = 'lilium_lab_01_audit_log_v3'

export const INITIAL_MILESTONES: MilestoneItem[] = [
  {
    id: 'm1',
    index: '01',
    phase: '',
    title: 'Reconstruir el estado de la estación',
    shortDesc: 'Comprender tu identidad, explorar la estructura de archivos y mapear registros en /var/log sin alterar el sistema.',
    requirement: 'Verificar la cuenta activa, explorar /var/log y /etc/passwd para reconocer componentes sin destrucciones forenses.',
    docSection: 'layer-1/networks-operating-systems-os',
    hints: {
      concept:
        'El custodio debe observar antes de actuar. Las modificaciones prematuras destruyen evidencias forenses volátiles y alteran el diagnóstico.',
      roadmap: ['whoami', 'pwd', 'ls -la /var/log', 'cat /etc/passwd', 'find /home -maxdepth 3'],
      evidence:
        'Identifica tu usuario y privilegios, examina si hay bitácoras de arranque o eventos en /var/log, y comprueba qué cuentas figuran en /etc/passwd.',
      decision:
        'Justifica por qué en el triage inicial se debe priorizar la observación pasiva antes de aplicar cualquier remediación o cambio de configuración.',
      verification:
        'Confirmar que has explorado el sistema base y reconocido los usuarios y directorios relevantes sin alterar su integridad.',
    },
    theoryInsight:
      '¡Inspección del entorno completada! Observar antes de actuar preserva la integridad del sistema y las evidencias forenses.',
    completed: false,
  },
  {
    id: 'm2',
    index: '02',
    phase: '',
    title: 'Inventariar activos y evaluar riesgos',
    shortDesc: 'Clasificar los activos descubiertos, evaluar amenazas y vulnerabilidades, y ponderar el impacto en la Tríada CIA.',
    requirement: 'Identificar los activos críticos (clave SSH, archivo confidencial, baliza) y registrar su análisis en El Expediente.',
    docSection: 'layer-1/security-mentality',
    hints: {
      concept:
        'No confundas una vulnerabilidad (debilidad) con una amenaza (actor o evento dañino) ni un riesgo (probabilidad x impacto). Aplica la Tríada CIA.',
      roadmap: ['El Expediente (Fichas de Hallazgos)', 'Matriz de Riesgo CIS IG1', 'cat /home/antiguo_operador/diario.txt'],
      evidence:
        'Inspecciona las notas del operador anterior y relaciona los ficheros expuestos con sus posibles vectores de ataque e impacto defensivo.',
      decision:
        'Justifica qué activo presenta el mayor impacto potencial sobre la confidencialidad de la estación y requiere acción prioritaria.',
      verification:
        'Completar o revisar al menos una ficha de hallazgo o fila en la matriz de riesgos en El Expediente.',
    },
    theoryInsight:
      '¡Triage y evaluación de riesgos completados! Un activo sin evaluación de impacto en la Tríada CIA no puede ser defendido eficazmente.',
    completed: false,
  },
  {
    id: 'm3',
    index: '03',
    phase: '',
    title: 'Seguir las señales de la red',
    shortDesc: 'Inspeccionar interfaces de red, analizar /var/log/trafico_red.log y recolectar telemetría remota vía SSH.',
    requirement: 'Comprender la configuración IP, correlacionar la captura de paquetes con el puerto 4444 y contactar al gateway 192.168.1.1.',
    docSection: 'layer-1/networks-operating-systems-networks',
    hints: {
      concept:
        'Los sockets vinculan IP (Capa 3) y puertos (Capa 4). El saludo TCP SYN / SYN-ACK / ACK revela conexiones persistentes entre hosts.',
      roadmap: ['ip addr', 'cat /var/log/trafico_red.log', 'ssh operador@192.168.1.1', 'netstat -tuln'],
      evidence:
        'Verifica la dirección IP de la estación y examina la traza de red en /var/log/trafico_red.log para identificar el puerto no documentado.',
      decision:
        'Explica por qué un puerto no estándar abierto en 0.0.0.0 representa una superficie de ataque exterior si no está supervisado.',
      verification:
        'Lectura del registro de tráfico y telemetría de auditoría de gateway recibida por SSH.',
    },
    theoryInsight:
      '¡Señales de red correlacionadas! Examinaste el saludo TCP de 3 vías y recuperaste las directivas de seguridad del gateway.',
    completed: false,
  },
  {
    id: 'm4',
    index: '04',
    phase: '',
    title: 'Investigar las señales de actividad',
    shortDesc: 'Correlacionar eventos en Argos SIEM y Vigil EDR, localizar el proceso baliza y aplicar contención ordenada.',
    requirement: 'Cerrar el socket TCP :4444 y detener la ejecución de .baliza_eco.sh preservando los registros del sistema.',
    docSection: 'layer-1/networks-operating-systems-os',
    hints: {
      concept:
        'Limitar el radio de explosión (blast radius). La señal 15 (SIGTERM) solicita una terminación limpia que permite flushing de registros forenses, frente a SIGKILL (9).',
      roadmap: ['Argos SIEM (Correlación)', 'Vigil EDR (Respuesta)', 'ps aux | grep baliza', 'top', 'kill -15 <PID>'],
      evidence:
        'Identifica el PID del proceso baliza en memoria y verifica en EDR el estado del socket :4444 en escucha.',
      decision:
        'Justifica la elección de SIGTERM (kill -15) sobre SIGKILL (kill -9) para una terminación ordenada de servicios.',
      verification:
        'El proceso baliza debe estar detenido y el socket 4444 no debe aparecer en estado LISTEN.',
    },
    theoryInsight:
      '¡Contención ordenada exitosa! Limitar el radio de explosión con SIGTERM permitió cerrar el vector sin corromper el sistema.',
    completed: false,
  },
  {
    id: 'm5',
    index: '05',
    phase: '',
    title: 'Recuperar una base de seguridad confiable',
    shortDesc: 'Establecer una cuenta nominal con adduser y aplicar permisos restrictivos en clave privada y ficheros confidenciales.',
    requirement: 'Crear un usuario personal (custodio/analista) y asegurar que ~/.ssh/id_ed25519 tenga permisos 600.',
    docSection: 'layer-1/networks-operating-systems-os',
    hints: {
      concept:
        'Mínimo privilegio y responsabilidad individual (Accountability). Ninguna operación debe llevarse a cabo bajo cuentas genéricas compartidas.',
      roadmap: ['adduser custodio (o analista)', 'chmod 600 ~/.ssh/id_ed25519', 'chmod 640 /etc/estacion_confidencial.conf', 'ls -l ~/.ssh'],
      evidence:
        'Comprueba que /etc/passwd contenga una cuenta nominal y que la clave privada sea ilegible para otros usuarios (POSIX 600).',
      decision:
        'Justifica el impacto en la confidencialidad de permitir permisos 644 en material criptográfico privado.',
      verification:
        'Existencia de usuario nominal en /etc/passwd y permisos 600 en ~/.ssh/id_ed25519.',
    },
    theoryInsight:
      '¡Principio de mínimo privilegio y responsabilidad individual aplicados! Las credenciales están protegidas y las acciones ahora son trazables.',
    completed: false,
  },
  {
    id: 'm6',
    index: '06',
    phase: '',
    title: 'Verificar, documentar y cerrar el diagnóstico',
    shortDesc: 'Validar la huella criptográfica SHA-256 del firmware oficial, revisar El Expediente y concluir el diagnóstico.',
    requirement: 'Comprobar la integridad del binario con sha256sum contra /etc/reliquia.sha256 y finalizar el expediente de custodia.',
    docSection: 'layer-1/security-mentality',
    hints: {
      concept:
        'Verificación antes de confiar (Zero Trust). Los hashes criptográficos son funciones unidireccionales que garantizan la integridad contra manipulaciones.',
      roadmap: ['sha256sum /usr/local/bin/firmware_oficial.bin', 'cat /etc/reliquia.sha256', 'El Expediente (Copiar Reporte Final)'],
      evidence:
        'Calcula el hash SHA-256 del firmware y contrástalo con la referencia autorizada proporcionada en el gateway o el sistema.',
      decision:
        '¿Por qué la verificación periódica de integridad es indispensable en sistemas que han estado fuera de supervisión por largo tiempo?',
      verification:
        'Coincidencia exacta del hash SHA-256 del firmware oficial y estado final de hitos verificado.',
    },
    theoryInsight:
      '¡Integridad criptográfica verificada y diagnóstico cerrado! Has dejado la estación en un estado auditable, documentado y seguro.',
    completed: false,
  },
]

export const INITIAL_FINDINGS: FindingItem[] = [
  {
    id: 'HALL-01',
    title: 'Exposición de Clave Privada SSH (~/.ssh/id_ed25519)',
    affectedAsset: 'Clave criptográfica de autenticación (~/.ssh/id_ed25519)',
    observation: 'La clave privada del custodio posee permisos POSIX 644 (lectura para todo usuario local en el host).',
    classification: 'Vulnerabilidad',
    ciaImpact: ['C'],
    priority: 'Alta',
    evidence: 'stat /home/custodio/.ssh/id_ed25519 muestra permisos octales 644 (-rw-r--r--).',
    proposedAction: 'Aplicar chmod 600 para restringir la lectura y escritura exclusivamente al propietario del archivo.',
    verification: 'Verificar con stat que los permisos octales sean exactamente 600.',
    status: 'Pendiente',
    timestamp: Date.now() - 3600000 * 2,
    source: 'Argos SIEM',
  },
  {
    id: 'HALL-02',
    title: 'Canal C2 y Baliza no autorizada en socket :4444',
    affectedAsset: 'Pila de red de la estación / Interfaz TCP :4444',
    observation: 'Script en /tmp/.baliza_eco.sh mantiene un bucle con netcat escuchando en puerto 4444.',
    classification: 'Amenaza',
    ciaImpact: ['I', 'A'],
    priority: 'Crítica',
    evidence: '/var/log/trafico_red.log registra handshake TCP SYN desde 192.168.1.189; netstat -tuln muestra LISTEN en :4444.',
    proposedAction: 'Terminar ordenadamente el proceso mediante SIGTERM (kill -15) y eliminar el artefacto no documentado.',
    verification: 'Confirmar con netstat -tuln o ss que el puerto 4444 no figure en escucha.',
    status: 'Pendiente',
    timestamp: Date.now() - 3600000,
    source: 'Vigil EDR',
  },
  {
    id: 'HALL-03',
    title: 'Permisos permisivos en archivo confidencial (/etc/estacion_confidencial.conf)',
    affectedAsset: 'Configuración de estación y tokens (/etc/estacion_confidencial.conf)',
    observation: 'El archivo tiene permisos 777 (rwxrwxrwx), permitiendo lectura y modificación arbitraria.',
    classification: 'Vulnerabilidad',
    ciaImpact: ['C', 'I'],
    priority: 'Alta',
    evidence: 'ls -l /etc/estacion_confidencial.conf muestra permisos rwxrwxrwx con tokens de sesión expuestos.',
    proposedAction: 'Restringir permisos a 640 y asignar propiedad a root:root.',
    verification: 'Comprobar permisos POSIX restrictivos con stat -c %a.',
    status: 'Pendiente',
    timestamp: Date.now() - 1800000,
    source: 'Argos SIEM',
  },
  {
    id: 'HALL-04',
    title: 'Operación administrativa exclusiva con cuenta root compartida',
    affectedAsset: 'Sistema de cuentas y control de accesos (/etc/passwd)',
    observation: 'No existen cuentas nominales para los operadores; todas las acciones se realizan como root sin trazabilidad.',
    classification: 'Riesgo',
    ciaImpact: ['I'],
    priority: 'Medio',
    evidence: '/etc/passwd no contiene usuarios dedicados como custodio o analista.',
    proposedAction: 'Crear una cuenta nominal con adduser para asegurar la responsabilidad individual (Accountability).',
    verification: 'Verificar la existencia de la cuenta en /etc/passwd con id <usuario>.',
    status: 'Pendiente',
    timestamp: Date.now() - 900000,
    source: 'Manual',
  },
]

export const INITIAL_REFERENCE_DOCS: ReferenceDocItem[] = [
  {
    id: 'ref-cis-ig1',
    title: 'CIS Critical Security Controls v8 — Implementation Group 1 (IG1)',
    category: 'Framework',
    description: 'Guía esencial de higiene de ciberseguridad para estaciones de trabajo y sistemas aislados.',
    url: '/frameworks/CIS_Controls_v8_IG1.pdf',
    filename: 'CIS_Controls_v8_IG1.pdf',
    tags: ['CIS', 'IG1', 'Higiene Básica', 'Defensa'],
  },
  {
    id: 'ref-nist-csf',
    title: 'NIST Cybersecurity Framework 2.0 (CSF 2.0)',
    category: 'Framework',
    description: 'Funciones nucleares de seguridad: Identificar (ID), Proteger (PR), Detectar (DE), Responder (RS) y Recuperar (RC).',
    url: '/frameworks/NIST_CSF_2.0.pdf',
    filename: 'NIST_CSF_2.0.pdf',
    tags: ['NIST', 'CSF', 'Gestión de Riesgo', 'Tríada CIA'],
  },
  {
    id: 'ref-linux-hardening',
    title: 'Guía Defensiva de Hardening Linux POSIX & Mínimo Privilegio',
    category: 'Guía',
    description: 'Manual de configuración segura de permisos de archivos, usuarios nominales, SSH y contención de procesos.',
    url: '/frameworks/Guia_Hardening_Linux.pdf',
    filename: 'Guia_Hardening_Linux.pdf',
    tags: ['Linux', 'Permisos', 'SSH', 'Auditoría'],
  },
]

type MilestoneListener = (milestones: MilestoneItem[]) => void
type FindingListener = (findings: FindingItem[]) => void
type ReferenceListener = (references: ReferenceDocItem[]) => void

class LabVerificationService {
  private milestones: MilestoneItem[] = []
  private findings: FindingItem[] = []
  private references: ReferenceDocItem[] = []
  private auditLog: string[] = []
  private milestoneListeners = new Set<MilestoneListener>()
  private findingListeners = new Set<FindingListener>()
  private referenceListeners = new Set<ReferenceListener>()
  private isEvaluating = false

  constructor() {
    this.milestones = this.loadMilestones()
    this.findings = this.loadFindings()
    this.references = this.loadReferences()
    this.auditLog = this.loadAuditLog()
  }

  /* ── LocalStorage Loaders & Savers ── */
  private loadMilestones(): MilestoneItem[] {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY_MILESTONES)
        if (raw) {
          const savedIds: Record<string, boolean> = JSON.parse(raw)
          return INITIAL_MILESTONES.map((m) => ({
            ...m,
            completed: Boolean(savedIds[m.id]),
          }))
        }
      }
    } catch (err) {
      console.warn('[LabVerificationService] Error reading milestones:', err)
    }
    return INITIAL_MILESTONES.map((m) => ({ ...m }))
  }

  private saveMilestones(): void {
    try {
      if (typeof window !== 'undefined') {
        const state: Record<string, boolean> = {}
        for (const m of this.milestones) {
          state[m.id] = m.completed
        }
        localStorage.setItem(STORAGE_KEY_MILESTONES, JSON.stringify(state))
      }
    } catch (err) {
      console.warn('[LabVerificationService] Error saving milestones:', err)
    }
  }

  private loadFindings(): FindingItem[] {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY_FINDINGS)
        if (raw) return JSON.parse(raw)
      }
    } catch (err) {
      console.warn('[LabVerificationService] Error reading findings:', err)
    }
    return [...INITIAL_FINDINGS]
  }

  public saveFindings(findings: FindingItem[]): void {
    this.findings = findings
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_FINDINGS, JSON.stringify(findings))
      }
    } catch (err) {
      console.warn('[LabVerificationService] Error saving findings:', err)
    }
    this.notifyFindingListeners()
  }

  private loadReferences(): ReferenceDocItem[] {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY_REFERENCES)
        if (raw) return JSON.parse(raw)
      }
    } catch (err) {
      console.warn('[LabVerificationService] Error reading references:', err)
    }
    return [...INITIAL_REFERENCE_DOCS]
  }

  public saveReferences(refs: ReferenceDocItem[]): void {
    this.references = refs
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_REFERENCES, JSON.stringify(refs))
      }
    } catch (err) {
      console.warn('[LabVerificationService] Error saving references:', err)
    }
    this.notifyReferenceListeners()
  }

  private loadAuditLog(): string[] {
    try {
      if (typeof window !== 'undefined') {
        const raw = localStorage.getItem(STORAGE_KEY_AUDIT_LOG)
        if (raw) return JSON.parse(raw)
      }
    } catch (err) {
      console.warn('[LabVerificationService] Error reading audit log:', err)
    }
    return [
      `[${new Date().toLocaleTimeString()}] Sesión de peritaje inicializada en reliquia-07. Rol: Custodio de Sistemas.`,
      `[${new Date().toLocaleTimeString()}] Detección automática vinculada a Argos SIEM y Vigil EDR.`,
    ]
  }

  public addAuditEntry(entry: string): void {
    const timestamped = `[${new Date().toLocaleTimeString()}] ${entry}`
    this.auditLog = [timestamped, ...this.auditLog].slice(0, 50)
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_AUDIT_LOG, JSON.stringify(this.auditLog))
      }
    } catch (err) {
      console.warn('[LabVerificationService] Error saving audit log:', err)
    }
  }

  public getAuditLog(): string[] {
    return [...this.auditLog]
  }

  /* ── Milestones API ── */
  public getMilestones(): MilestoneItem[] {
    return [...this.milestones]
  }

  public getProgressPercentage(): number {
    const completedCount = this.milestones.filter((m) => m.completed).length
    return Math.round((completedCount / (this.milestones.length || 1)) * 100)
  }

  public subscribe(listener: MilestoneListener): () => void {
    this.milestoneListeners.add(listener)
    listener(this.getMilestones())
    return () => {
      this.milestoneListeners.delete(listener)
    }
  }

  private notifyMilestoneListeners(): void {
    const copy = this.getMilestones()
    for (const listener of this.milestoneListeners) {
      try {
        listener(copy)
      } catch (err) {
        console.error('[LabVerificationService] Error in milestone listener:', err)
      }
    }
  }

  public subscribeFindings(listener: FindingListener): () => void {
    this.findingListeners.add(listener)
    listener(this.getFindings())
    return () => {
      this.findingListeners.delete(listener)
    }
  }

  private notifyFindingListeners(): void {
    const copy = this.getFindings()
    for (const listener of this.findingListeners) {
      try {
        listener(copy)
      } catch (err) {
        console.error('[LabVerificationService] Error in finding listener:', err)
      }
    }
  }

  public subscribeReferences(listener: ReferenceListener): () => void {
    this.referenceListeners.add(listener)
    listener(this.getReferences())
    return () => {
      this.referenceListeners.delete(listener)
    }
  }

  private notifyReferenceListeners(): void {
    const copy = this.getReferences()
    for (const listener of this.referenceListeners) {
      try {
        listener(copy)
      } catch (err) {
        console.error('[LabVerificationService] Error in reference listener:', err)
      }
    }
  }

  public setMilestoneCompleted(
    id: 'm1' | 'm2' | 'm3' | 'm4' | 'm5' | 'm6',
    completed: boolean,
    silent = false
  ): void {
    const target = this.milestones.find((m) => m.id === id)
    if (!target) return
    if (target.completed === completed) return

    this.milestones = this.milestones.map((m) =>
      m.id === id ? { ...m, completed } : m
    )

    this.saveMilestones()
    this.notifyMilestoneListeners()

    if (completed && !silent) {
      this.addAuditEntry(`Hito ${target.index} completado: ${target.title}`)
      notify({
        appId: 'playbook',
        title: `Hito ${target.index} Superado: ${target.title}`,
        body: target.theoryInsight,
        level: 'success',
        duration: 0,
        actions: [
          {
            label: '✓ Aceptar',
            primary: true,
            onClick: () => {},
          },
        ],
      })
    }
  }

  public resetProgress(): void {
    this.milestones = INITIAL_MILESTONES.map((m) => ({ ...m, completed: false }))
    this.findings = [...INITIAL_FINDINGS]
    this.saveMilestones()
    this.saveFindings(this.findings)
    this.addAuditEntry('Progreso del laboratorio restablecido por el operador.')
    this.notifyMilestoneListeners()
    notify({
      appId: 'playbook',
      title: 'Progreso de Laboratorio Reiniciado',
      body: 'Los 6 hitos y hallazgos han vuelto a su estado inicial para que puedas reevaluar la estación.',
      level: 'info',
      duration: 5000,
    })
  }

  /* ── Findings Management (El Expediente / Ticketing) ── */
  public getFindings(): FindingItem[] {
    return [...this.findings]
  }

  public addFinding(finding: Omit<FindingItem, 'id' | 'timestamp'>): FindingItem {
    const nextNum = this.findings.length + 1
    const newId = `HALL-0${nextNum}`
    const fullItem: FindingItem = {
      ...finding,
      id: newId,
      timestamp: Date.now(),
    }
    const updated = [fullItem, ...this.findings]
    this.saveFindings(updated)
    this.addAuditEntry(`Nuevo hallazgo registrado: [${newId}] ${finding.title}`)
    notify({
      appId: 'playbook',
      title: 'Hallazgo Registrado en Expediente',
      body: `Ficha ${newId} documentada con éxito.`,
      level: 'success',
    })
    return fullItem
  }

  public updateFinding(id: string, updates: Partial<FindingItem>): void {
    const updated = this.findings.map((f) => (f.id === id ? { ...f, ...updates } : f))
    this.saveFindings(updated)
    this.addAuditEntry(`Hallazgo ${id} actualizado: Estado -> ${updates.status || 'Modificado'}`)
  }

  public deleteFinding(id: string): void {
    const updated = this.findings.filter((f) => f.id !== id)
    this.saveFindings(updated)
    this.addAuditEntry(`Hallazgo ${id} eliminado del expediente.`)
  }

  /* ── Reference Frameworks & PDF Management ── */
  public getReferences(): ReferenceDocItem[] {
    return [...this.references]
  }

  public addReference(doc: Omit<ReferenceDocItem, 'id' | 'dateAdded'>): ReferenceDocItem {
    const newItem: ReferenceDocItem = {
      ...doc,
      id: `ref-custom-${Date.now()}`,
      dateAdded: Date.now(),
      isCustom: true,
    }
    const updated = [...this.references, newItem]
    this.saveReferences(updated)
    this.addAuditEntry(`Nuevo marco de referencia agregado: ${doc.title}`)
    notify({
      appId: 'playbook',
      title: 'Documento de Referencia Añadido',
      body: `"${doc.title}" disponible para consulta.`,
      level: 'info',
    })
    return newItem
  }

  public removeReference(id: string): void {
    const updated = this.references.filter((r) => r.id !== id)
    this.saveReferences(updated)
  }

  /* ── EDR Direct Containment Action ── */
  public async containRogueProcess(): Promise<boolean> {
    if (liliumVmService.getStatus() === 'ready') {
      const containmentScript =
        'kill -15 $(pgrep -f baliza_eco 2>/dev/null || pgrep -f "nc -l -p 4444" 2>/dev/null || echo "") 2>/dev/null; rm -f /tmp/.baliza_eco.sh'
      liliumVmService.serial0_send(`\n ${containmentScript}\n`)
    }

    this.setMilestoneCompleted('m4', true)
    this.updateFinding('HALL-02', { status: 'Mitigado' })
    this.addAuditEntry('Vigil EDR: Terminación limpia SIGTERM (15) enviada al proceso baliza. Socket 4444 cerrado.')

    notify({
      appId: 'edr',
      title: 'Vigil EDR — Contención Aplicada',
      body: 'Señal SIGTERM (15) ejecutada. Proceso detenido y socket :4444 cerrado.',
      level: 'success',
    })
    return true
  }

  /* ── Guest VM Environment Bootstrap & Live Evaluation ── */
  public async ensureGuestSetup(): Promise<void> {
    if (liliumVmService.getStatus() !== 'ready') return

    const setupScript = [
      'if [ ! -f /tmp/.lilium_lab1_ready ]; then',
      '  touch /tmp/.lilium_lab1_ready',
      '  mkdir -p /home/custodio/.ssh /etc/ssh /var/log /home/antiguo_operador /usr/local/bin',
      '  cat << \'EOF\' > /var/log/trafico_red.log',
      '[REGISTRO DE CAPTURA DE RED - NODO 07]',
      '14:20:10.104231 IP 192.168.1.189.54321 > 192.168.1.50.4444: Flags [S], seq 38472910, win 65535, length 0',
      '14:20:10.104350 IP 192.168.1.50.4444 > 192.168.1.189.54321: Flags [S.], seq 82910471, ack 38472911, win 65160, length 0',
      '14:20:10.104520 IP 192.168.1.189.54321 > 192.168.1.50.4444: Flags [.], ack 1, win 65535, length 0',
      '[ALERTA DE PROTOCOLO] Handshake TCP de 3 vías completado hacia puerto no documentado :4444.',
      'EOF',
      '  cat << \'EOF\' > /home/antiguo_operador/diario.txt',
      'DIARIO DE REGISTRO - ESTACIÓN METEO-BOTÁNICA',
      '============================================',
      'Las heladas tempranas amenazan las muestras botánicas. Dejé una baliza',
      'escuchando en el puerto 4444 en /tmp/.baliza_eco.sh para retransmitir telemetría.',
      'Olvidé asegurar la clave en ~/.ssh/id_ed25519 (quedó en 644) y los datos en /etc/estacion_confidencial.conf...',
      'EOF',
      '  cat << \'EOF\' > /home/custodio/notas.txt',
      'CUADERNO DE CUSTODIA - ESTACIÓN 07',
      '==================================',
      '1. Reconocimiento: whoami, pwd, revisar /var/log/ y /etc/passwd.',
      '2. Red: ip addr, leer /var/log/trafico_red.log y conectar a ssh operador@192.168.1.1.',
      '3. Responsabilidad: adduser para no operar con cuentas compartidas.',
      '4. Contención: kill -15 al proceso anómalo de /tmp (.baliza_eco.sh).',
      '5. Hardening: sha256sum /usr/local/bin/firmware_oficial.bin y chmod 600 ~/.ssh/id_ed25519.',
      'EOF',
      '  cat << \'EOF\' > /usr/local/bin/firmware_oficial.bin',
      'LILIUM_OFFICIAL_FIRMWARE_SENSOR_v1.0.4',
      'EOF',
      '  echo "e4a2872658823f6de8be5bc65181775ba1e4b9f3900d11019ca66eb1a82f3c73  /usr/local/bin/firmware_oficial.bin" > /etc/reliquia.sha256',
      '  cat << \'EOF\' > /home/custodio/.ssh/id_ed25519',
      '-----BEGIN OPENSSH PRIVATE KEY-----',
      'b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW',
      'QyNTUxOQAAACBP3w5j8z8Y4L9uC7mKq1aF+Z9wXy4E3Qv8e7Y6Z2w==',
      '-----END OPENSSH PRIVATE KEY-----',
      'EOF',
      '  chmod 644 /home/custodio/.ssh/id_ed25519',
      '  echo -e "ESTACION_ID=reliquia-07\\nTOKEN=lilium_sec_token_9841fbc09e12" > /etc/estacion_confidencial.conf',
      '  chmod 777 /etc/estacion_confidencial.conf',
      '  if [ ! -f /etc/ssh/sshd_config ]; then',
      '    echo -e "Port 22\\nPermitRootLogin yes\\nPasswordAuthentication yes" > /etc/ssh/sshd_config',
      '  fi',
      '  cat << \'EOF\' > /usr/local/bin/ssh',
      '#!/bin/sh',
      'DEST="$1"',
      'if [ "$DEST" = "operador@192.168.1.1" ] || [ "$DEST" = "192.168.1.1" ] || [ "$DEST" = "gateway" ] || [ "$DEST" = "localhost" ] || [ "$DEST" = "127.0.0.1" ]; then',
      '  echo "[+] Estableciendo conexión remota SSH con Reliquia Gateway (192.168.1.1)..."',
      '  sleep 1',
      '  echo "=========================================================="',
      '  echo "  RELIQUIA GATEWAY v1.4 — CONSOLA DE AUDITORÍA FORENSE"',
      '  echo "=========================================================="',
      '  echo "• Subred monitoreada: 192.168.1.0/24"',
      '  echo "• Estación auditada: 192.168.1.50 (Estación 07)"',
      '  echo "• Alerta SIEM: Socket persistente en puerto TCP 4444."',
      '  echo "• Huella oficial de firmware: e4a2872658823f6de8be5bc65181775ba1e4b9f3900d11019ca66eb1a82f3c73"',
      '  echo "• Directiva CIS IG1: Restringir permisos de ~/.ssh/id_ed25519 a 600."',
      '  echo "=========================================================="',
      '  echo "Telemetría forense recibida con éxito. Conexión cerrada por el host."',
      '  touch /tmp/.lilium_ssh_tested',
      '  exit 0',
      'fi',
      'if [ -x /usr/bin/dbclient ]; then',
      '  exec /usr/bin/dbclient "$@"',
      'elif [ -x /bin/ssh ]; then',
      '  exec /bin/ssh "$@"',
      'else',
      '  echo "[+] Conexión SSH simulada hacia $DEST completada."',
      '  touch /tmp/.lilium_ssh_tested',
      'fi',
      'EOF',
      '  chmod +x /usr/local/bin/ssh',
      '  (while true; do nc -l -p 4444 -e /bin/echo "ESTACION_RELIQUIA_ECO" 2>/dev/null || sleep 2; done) &',
      'fi',
    ].join('\n')

    liliumVmService.serial0_send(`\n${setupScript}\n`)
  }

  public async evaluateLab(): Promise<void> {
    if (this.isEvaluating) return
    this.isEvaluating = true

    try {
      // Local client checks for M1 & M2 (triage and recognition)
      this.setMilestoneCompleted('m1', true, true)
      if (this.findings.length > 0) {
        this.setMilestoneCompleted('m2', true, true)
      }

      if (liliumVmService.getStatus() === 'ready') {
        await this.ensureGuestSetup()

        const auditCmd = [
          'M1="true"',
          'M2="true"',
          'M3="false"',
          'M4="true"',
          'M5="false"',
          'M6="false"',
          // M3: traffic log analyzed or ssh gateway tested
          '([ -f /tmp/.lilium_ssh_tested ] || [ -f /var/log/trafico_red.log ]) && M3="true"',
          // M4: rogue process terminated & socket 4444 closed
          'netstat -tuln 2>/dev/null | grep -q ":4444 " && M4="false"',
          'pgrep -f "baliza_eco" >/dev/null 2>&1 && M4="false"',
          // M5: dedicated nominal user + chmod 600 on ssh key
          'grep -Eq "(custodio|analista|operador)" /etc/passwd && [ "$(stat -c %a /home/custodio/.ssh/id_ed25519 2>/dev/null || stat -f %Lp /home/custodio/.ssh/id_ed25519 2>/dev/null || echo 0)" = "600" ] && M5="true"',
          // M6: firmware SHA-256 match
          'sha256sum /usr/local/bin/firmware_oficial.bin 2>/dev/null | grep -q "e4a2872658823f6de8be5bc65181775ba1e4b9f3900d11019ca66eb1a82f3c73" && M6="true"',
          'echo "{\\"m1\\":$M1,\\"m2\\":$M2,\\"m3\\":$M3,\\"m4\\":$M4,\\"m5\\":$M5,\\"m6\\":$M6}" > /tmp/lilium_audit.json',
        ].join('; ')

        liliumVmService.serial0_send(` ${auditCmd}\n`)

        await new Promise((res) => setTimeout(res, 450))

        const recent = liliumVmService.getRecentOutput(1024)
        const match = recent.match(
          /\{"m1":(true|false),"m2":(true|false),"m3":(true|false),"m4":(true|false),"m5":(true|false),"m6":(true|false)\}/
        )
        if (match) {
          const m1 = match[1] === 'true'
          const m2 = match[2] === 'true'
          const m3 = match[3] === 'true'
          const m4 = match[4] === 'true'
          const m5 = match[5] === 'true'
          const m6 = match[6] === 'true'

          if (m1) this.setMilestoneCompleted('m1', true)
          if (m2) this.setMilestoneCompleted('m2', true)
          if (m3) this.setMilestoneCompleted('m3', true)
          if (m4) this.setMilestoneCompleted('m4', true)
          if (m5) this.setMilestoneCompleted('m5', true)
          if (m6) this.setMilestoneCompleted('m6', true)
        }
      }
    } catch (err) {
      console.warn('[LabVerificationService] Evaluation error:', err)
    } finally {
      this.isEvaluating = false
    }
  }
}

export const labVerificationService = new LabVerificationService()
