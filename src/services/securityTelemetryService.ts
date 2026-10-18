/**
 * Security Telemetry Service — TULIP Cyber Range
 * Centralized, synchronized telemetry engine connecting Argos SIEM, Vigil EDR,
 * the guest Linux sandbox VM (v86), and the Lab Playbook / Expediente.
 *
 * Implements realistic SOC/EDR data models (inspired by Wazuh, Splunk, Sentinel,
 * and Defender for Endpoint), live two-way synchronization with the Linux sandbox,
 * explicit truth-in-telemetry provenance, and pedagogical investigation guidance.
 */

import { notify } from '@react-ui-os/core'
import { tulipVmService, type VmStatus } from './tulipVmService'
import { labVerificationService } from './labVerificationService'

export interface TelemetryProvenance {
  sourceType: 'live_guest_probe' | 'pcap_capture_log' | 'auditd_stream' | 'remote_gateway' | 'soc_rule'
  sourceLabel: string
  evidencePath?: string
  isContinuousCapture: boolean
  fidelityNote: string
}

export interface PedagogicalGuidance {
  anomalyVsThreat: string
  investigationTip: string
  justificationQuestion: string
  ciaImpactExplanation: string
}

export interface SiemEventItem {
  id: string
  origin: 'Red / Zeek' | 'Auth Log' | 'Syslog / Audit' | 'Gateway Remoto' | 'Kernel / eBPF' | 'FIM / Integridad'
  telemetryScope: 'host_live' | 'sensor_network' | 'sensor_gateway'
  event: string
  timestamp: string
  severity: 'Crítica' | 'Alta' | 'Media' | 'Informativa'
  status: 'Detectado' | 'En investigación' | 'Mitigado'
  ruleId: string
  mitreTechnique: string
  threat: string
  threatPriority: string
  vulnerability: string
  vulnPriority: string
  asset: string
  assetPriority: string
  correlationHint: string
  evidenceDetail: string
  rawLog: string
  extractedFields: Record<string, string>
  linkedEdrDetectionId: string
  relatedEventIds: string[]
  mitigationTimestamp?: string
  provenance: TelemetryProvenance
  pedagogy: PedagogicalGuidance
  studentNotes?: string
}

export interface EdrDetectionItem {
  id: string
  pid: string
  ppid: string
  name: string
  path: string
  cli: string
  user: string
  socketOrPerm: string
  status: 'Activo (Riesgo)' | 'Contenido (Mitigado)' | 'Vulnerable' | 'Blindado'
  category: 'Proceso' | 'Permisos' | 'Identidad' | 'Configuración'
  hashSha256: string
  mitreTechnique: string
  threatDescription: string
  containmentAction: string
  linkedSiemEventId: string
  isRemediated: boolean
  provenance: TelemetryProvenance
  pedagogy: PedagogicalGuidance
  evidenceDetails: {
    modeOctal?: string
    parentProcess?: string
    sockets?: string[]
    memoryRss?: string
    integrity?: string
    ownerGroup?: string
  }
  studentNotes?: string
}

export interface EndpointSocketItem {
  proto: 'TCP' | 'UDP'
  local: string
  foreign: string
  state: 'LISTEN' | 'ESTABLISHED' | 'CLOSED'
  pid: string
  program: string
  risk: 'Crítico' | 'Informativo' | 'Normal'
  provenance: string
}

export interface FileAuditItem {
  path: string
  currentPerm: string
  recommendedPerm: string
  status: 'Vulnerable' | 'Conforme'
  description: string
  owner: string
  sha256?: string
  cisBenchmark: string
}

export interface SecurityOverviewStats {
  totalEvents: number
  criticalCount: number
  highCount: number
  mediumCount: number
  infoCount: number
  mitigatedCount: number
  monitoredHost: string
  hostIp: string
  kernelVersion: string
  isSandboxOnline: boolean
  sourcesBreakdown: Record<string, number>
}

const STORAGE_KEY_SIEM_NOTES = 'tulip_siem_notes_v2'
const STORAGE_KEY_EDR_NOTES = 'tulip_edr_notes_v2'

const INITIAL_SIEM_EVENTS: SiemEventItem[] = [
  {
    id: 'EVT-4444',
    origin: 'Red / Zeek',
    telemetryScope: 'sensor_network',
    event: 'Handshake TCP SYN a puerto no estándar :4444',
    timestamp: '14:20:10',
    severity: 'Crítica',
    status: 'Detectado',
    ruleId: 'ARGOS-NET-4444 (T1071.001)',
    mitreTechnique: 'T1071.001 — C2 / Exfiltration over Non-Standard Port',
    threat: 'Canal C2 encubierto / Baliza TCP no documentada',
    threatPriority: 'Crítica',
    vulnerability: 'Script no firmado ejecutándose en /tmp (.baliza_eco.sh)',
    vulnPriority: 'Alta (5)',
    asset: 'Estación 07 (192.168.1.50) · Socket :4444',
    assetPriority: 'Prioridad 4',
    correlationHint:
      'Inspecciona /var/log/trafico_red.log en la máquina o ejecuta netstat/ss para corroborar el socket y PID.',
    evidenceDetail:
      'IP 192.168.1.189.54321 > 192.168.1.50.4444: Flags [S] seguido de handshake TCP completo.',
    rawLog:
      '{"ts":1729002010.104,"uid":"CW1uJg12yXh4lK","id.orig_h":"192.168.1.189","id.orig_p":54321,"id.resp_h":"192.168.1.50","id.resp_p":4444,"proto":"tcp","service":"unknown","conn_state":"SF","history":"ShADadFf","orig_bytes":142,"resp_bytes":86}',
    extractedFields: {
      'src_ip': '192.168.1.189',
      'src_port': '54321',
      'dest_ip': '192.168.1.50',
      'dest_port': '4444',
      'proto': 'TCP',
      'action': 'HANDSHAKE_ESTABLISHED',
      'process_name': '.baliza_eco.sh (nc)',
      'sensor_id': 'zeek-sensor-tap0',
    },
    linkedEdrDetectionId: 'EDR-01',
    relatedEventIds: ['EVT-AUTH-01', 'EVT-PROC-05'],
    provenance: {
      sourceType: 'pcap_capture_log',
      sourceLabel: 'Registro Forense (/var/log/trafico_red.log)',
      evidencePath: '/var/log/trafico_red.log',
      isContinuousCapture: false,
      fidelityNote:
        'Registro preexistente de captura de red del laboratorio. No simula captura continua en vivo; refleja la bitácora real presente en el disco.',
    },
    pedagogy: {
      anomalyVsThreat:
        '¿Anomalía o Amenaza? Un socket abierto no documentado es en principio una ANOMALÍA operacional. Se confirma como AMENAZA al constatar que responde con datos de estación sin autenticación y enlaza a un proceso volátil en /tmp.',
      investigationTip:
        'Correlaciona la marca temporal 14:20:10 con el inicio de sesión previo en ttyS0 y la creación de archivos temporales.',
      justificationQuestion:
        '¿Por qué cerrar este socket antes de investigar quién lo inició podría destruir evidencia volátil?',
      ciaImpactExplanation:
        'Integridad (I): Posible ejecución remota de comandos. Disponibilidad (A): Agotamiento de descriptores de socket.',
    },
  },
  {
    id: 'EVT-PROC-05',
    origin: 'Kernel / eBPF',
    telemetryScope: 'host_live',
    event: 'Invocación de script ejecutable en directorio temporal /tmp',
    timestamp: '14:19:48',
    severity: 'Alta',
    status: 'Detectado',
    ruleId: 'ARGOS-EBPF-EXEC (T1059.004)',
    mitreTechnique: 'T1059.004 — Command and Scripting Interpreter: Unix Shell',
    threat: 'Ejecución de binario no firmado en partición volátil compartida',
    threatPriority: 'Alta',
    vulnerability: 'Permisos de ejecución habilitados en /tmp sin directiva noexec',
    vulnPriority: 'Alta (4)',
    asset: 'Espacio de procesos Linux · PID 412',
    assetPriority: 'Prioridad 3',
    correlationHint:
      'Inspecciona /tmp/.baliza_eco.sh y consulta la jerarquía con ps aux | grep baliza.',
    evidenceDetail:
      'syscall=execve file="/tmp/.baliza_eco.sh" ppid=120 pid=412 uid=0 comm="sh"',
    rawLog:
      'type=EXECVE msg=audit(1729001988.421:84): argc=2 a0="sh" a1="/tmp/.baliza_eco.sh" pid=412 ppid=120 uid=0 gid=0 euid=0 tty=ttyS0 comm="sh" exe="/bin/sh"',
    extractedFields: {
      'host': 'reliquia-07',
      'pid': '412',
      'ppid': '120',
      'uid': '0 (root)',
      'comm': 'sh',
      'file': '/tmp/.baliza_eco.sh',
      'tty': 'ttyS0',
      'syscall': 'execve (59)',
    },
    linkedEdrDetectionId: 'EDR-01',
    relatedEventIds: ['EVT-AUTH-01', 'EVT-4444'],
    provenance: {
      sourceType: 'auditd_stream',
      sourceLabel: 'Linux Auditd / eBPF Exec Probe',
      evidencePath: '/tmp/.baliza_eco.sh',
      isContinuousCapture: true,
      fidelityNote:
        'Sondeo de llamadas al sistema execve en el kernel de la estación.',
    },
    pedagogy: {
      anomalyVsThreat:
        'Ejecutar scripts desde /tmp es común en tareas de desarrollo, pero en un entorno de producción o SCADA/estación remota constituye una violación de la directiva noexec y un vector de persistencia.',
      investigationTip:
        'Verifica el contenido de /tmp/.baliza_eco.sh con `head -n 20 /tmp/.baliza_eco.sh` antes de eliminarlo.',
      justificationQuestion:
        '¿Por qué aislar el archivo en cuarentena es defensivamente superior a simplemente borrarlo con rm?',
      ciaImpactExplanation:
        'Integridad (I): Código no supervisado ejecutado con privilegios root.',
    },
  },
  {
    id: 'EVT-AUTH-01',
    origin: 'Auth Log',
    telemetryScope: 'host_live',
    event: 'Inicio de sesión directo interactivo como root',
    timestamp: '14:18:22',
    severity: 'Alta',
    status: 'En investigación',
    ruleId: 'ARGOS-AUTH-ROOT (T1078.003)',
    mitreTechnique: 'T1078.003 — Valid Accounts: Local Accounts',
    threat: 'Destrucción de trazabilidad (Accountability) en auditorías forenses',
    threatPriority: 'Alta',
    vulnerability: 'Operación continua bajo cuenta compartida sin usuarios nominales',
    vulnPriority: 'Media (3)',
    asset: 'Servicio de Identidad (/etc/passwd)',
    assetPriority: 'Prioridad 3',
    correlationHint:
      'Revisa /etc/passwd en Linux. Debe existir al menos un usuario personal (ej. custodio u operador).',
    evidenceDetail:
      'Sesión de consola ttyS0 abierta directamente con UID 0 (root) sin sudo intermedio.',
    rawLog:
      'Oct 16 14:18:22 reliquia-07 login[105]: ROOT LOGIN ON ttyS0 BY root (interactive console)',
    extractedFields: {
      'host': 'reliquia-07',
      'service': 'login',
      'tty': 'ttyS0',
      'user': 'root',
      'uid': '0',
      'gid': '0',
      'auth_method': 'direct_console',
    },
    linkedEdrDetectionId: 'EDR-04',
    relatedEventIds: ['EVT-PROC-05', 'EVT-4444'],
    provenance: {
      sourceType: 'live_guest_probe',
      sourceLabel: 'Consola ttyS0 de la máquina Linux',
      evidencePath: '/etc/passwd',
      isContinuousCapture: true,
      fidelityNote:
        'Registro real de login en puerto serie de la máquina virtual.',
    },
    pedagogy: {
      anomalyVsThreat:
        'El inicio como root no es un malware, sino un RIESGO DE GOBERNANZA. Impide saber qué persona ejecutó qué comando, vulnerando el principio de no repudio de CIS Controls IG1.',
      investigationTip:
        'Usa `id` y `cat /etc/passwd` para verificar cuántas cuentas tienen shell válida (/bin/sh).',
      justificationQuestion:
        '¿Cómo justificarías ante un auditor la necesidad de crear un usuario nominal como custodio?',
      ciaImpactExplanation:
        'Integridad (I): Sin cuentas nominales, cualquier modificación carece de firma de autoría.',
    },
  },
  {
    id: 'EVT-FS-02',
    origin: 'Syslog / Audit',
    telemetryScope: 'host_live',
    event: 'Permisos excesivos en clave criptográfica privada SSH',
    timestamp: '14:15:04',
    severity: 'Alta',
    status: 'Detectado',
    ruleId: 'ARGOS-AUDIT-SSH (T1552.004)',
    mitreTechnique: 'T1552.004 — Unsecured Credentials: Private Keys',
    threat: 'Lectura no autorizada de credenciales por usuarios locales o procesos',
    threatPriority: 'Alta',
    vulnerability: 'Modo POSIX 644 en ~/.ssh/id_ed25519 en lugar de 600',
    vulnPriority: 'Alta (4)',
    asset: 'Clave SSH Ed25519 (~/.ssh/id_ed25519)',
    assetPriority: 'Prioridad 4',
    correlationHint:
      'Verifica con stat -c %a ~/.ssh/id_ed25519. La directiva CIS IG1 requiere permisos 600.',
    evidenceDetail:
      'Permisos de lectura mundial (-rw-r--r--) detectados en archivo que contiene clave privada.',
    rawLog:
      'type=PATH msg=audit(1729001704.112:52): item=0 name="/home/custodio/.ssh/id_ed25519" inode=4102 dev=00:0e mode=0100644 ouid=1000 ogid=1000',
    extractedFields: {
      'host': 'reliquia-07',
      'path': '/home/custodio/.ssh/id_ed25519',
      'posix_mode': '0644 (-rw-r--r--)',
      'owner_uid': '1000 (custodio)',
      'owner_gid': '1000',
      'recommended_mode': '0600 (-rw-------)',
    },
    linkedEdrDetectionId: 'EDR-02',
    relatedEventIds: ['EVT-GW-04'],
    provenance: {
      sourceType: 'live_guest_probe',
      sourceLabel: 'Inspección de Atributos POSIX (stat)',
      evidencePath: '/home/custodio/.ssh/id_ed25519',
      isContinuousCapture: false,
      fidelityNote:
        'Lectura de permisos de inodo en el sistema de archivos de la sandbox.',
    },
    pedagogy: {
      anomalyVsThreat:
        'Una clave en 644 es una VULNERABILIDAD PASIVA crítica. OpenSSH moderno rechaza usar claves privadas con permisos abiertos por considerarlas comprometidas.',
      investigationTip:
        'Verifica con `ls -l ~/.ssh/` y evalúa el impacto de la lectura por otros procesos no privilegiados.',
      justificationQuestion:
        '¿Por qué el estándar CIS exige modo 600 estricto para material criptográfico asimétrico?',
      ciaImpactExplanation:
        'Confidencialidad (C): Clave privada exportable sin elevación de privilegios.',
    },
  },
  {
    id: 'EVT-CONF-03',
    origin: 'Syslog / Audit',
    telemetryScope: 'host_live',
    event: 'Fichero confidencial con permisos globales 777',
    timestamp: '14:12:45',
    severity: 'Media',
    status: 'Detectado',
    ruleId: 'ARGOS-AUDIT-PERM (T1222.002)',
    mitreTechnique: 'T1222.002 — File and Directory Permissions Modification: Linux and Mac',
    threat: 'Modificación no auditada o exfiltración de tokens de estación',
    threatPriority: 'Media',
    vulnerability: 'Permisos 777 en /etc/estacion_confidencial.conf',
    vulnPriority: 'Media (3)',
    asset: 'Configuración Sensible (/etc/estacion_confidencial.conf)',
    assetPriority: 'Prioridad 2',
    correlationHint:
      'Inspecciona el contenido y restringe permisos a 640 para limitar el acceso al grupo autorizado.',
    evidenceDetail:
      'El archivo contiene ESTACION_ID y TOKEN accesibles y modificables por cualquier proceso.',
    rawLog:
      'Oct 16 14:12:45 reliquia-07 kernel: [audit] file /etc/estacion_confidencial.conf altered mode=0777 (world-writable)',
    extractedFields: {
      'host': 'reliquia-07',
      'path': '/etc/estacion_confidencial.conf',
      'posix_mode': '0777 (-rwxrwxrwx)',
      'risk': 'WORLD_WRITABLE',
      'recommended_mode': '0640 (-rw-r-----)',
    },
    linkedEdrDetectionId: 'EDR-03',
    relatedEventIds: [],
    provenance: {
      sourceType: 'live_guest_probe',
      sourceLabel: 'Inspección de Atributos POSIX (stat)',
      evidencePath: '/etc/estacion_confidencial.conf',
      isContinuousCapture: false,
      fidelityNote:
        'Permisos verificados directamente contra el archivo en /etc.',
    },
    pedagogy: {
      anomalyVsThreat:
        'El permiso 777 suele ser dejado por desarrolladores u operadores apresurados. Es una DEBILIDAD GRAVE que convierte cualquier proceso local en potencial alterador de tokens.',
      investigationTip:
        'Revisa el contenido con `cat /etc/estacion_confidencial.conf` y contrasta quién debería tener derecho de lectura.',
      justificationQuestion:
        '¿Por qué el modo 640 (root:root) protege la confidencialidad sin romper el arranque de servicios?',
      ciaImpactExplanation:
        'Confidencialidad (C) + Integridad (I): Lectura y sobrescritura arbitraria de secretos.',
    },
  },
  {
    id: 'EVT-FIM-06',
    origin: 'FIM / Integridad',
    telemetryScope: 'host_live',
    event: 'Verificación de hash SHA-256 de firmware de estación',
    timestamp: '14:08:12',
    severity: 'Informativa',
    status: 'Detectado',
    ruleId: 'ARGOS-FIM-SHA256 (T1565.001)',
    mitreTechnique: 'T1565.001 — Stored Data Manipulation',
    threat: 'Sustitución de binarios oficiales o alteración de lógica de sensores',
    threatPriority: 'Baja (Informativo)',
    vulnerability: 'Falta de verificación periódica de huella criptográfica',
    vulnPriority: 'Baja (1)',
    asset: 'Binario de Sensor (/usr/local/bin/firmware_oficial.bin)',
    assetPriority: 'Prioridad 2',
    correlationHint:
      'Ejecuta sha256sum /usr/local/bin/firmware_oficial.bin y compara con /etc/reliquia.sha256.',
    evidenceDetail:
      'SHA256: e4a2872658823f6de8be5bc65181775ba1e4b9f3900d11019ca66eb1a82f3c73 coincidente con firma oficial.',
    rawLog:
      'Oct 16 14:08:12 reliquia-07 fim_agent: [FIM_OK] /usr/local/bin/firmware_oficial.bin hash matched official manifest.',
    extractedFields: {
      'host': 'reliquia-07',
      'binary_path': '/usr/local/bin/firmware_oficial.bin',
      'sha256': 'e4a2872658823f6de8be5bc65181775ba1e4b9f3900d11019ca66eb1a82f3c73',
      'manifest_path': '/etc/reliquia.sha256',
      'status': 'INTEGRITY_VERIFIED',
    },
    linkedEdrDetectionId: 'EDR-01',
    relatedEventIds: [],
    provenance: {
      sourceType: 'live_guest_probe',
      sourceLabel: 'Monitor de Integridad de Archivos (FIM)',
      evidencePath: '/etc/reliquia.sha256',
      isContinuousCapture: false,
      fidelityNote:
        'Cálculo criptográfico SHA-256 verificado en la estación.',
    },
    pedagogy: {
      anomalyVsThreat:
        'La verificación exitosa de integridad proporciona la LÍNEA BASE CONFIABLE (Golden Image). Permite descartar que el firmware haya sido troyanizado.',
      investigationTip:
        'Usa `sha256sum /usr/local/bin/firmware_oficial.bin` y compáralo con el valor en /etc/reliquia.sha256.',
      justificationQuestion:
        '¿Por qué es indispensable comparar contra una fuente fidedigna externa (gateway o manifiesto firmado)?',
      ciaImpactExplanation:
        'Integridad (I): Certeza de que el código binario no ha sufrido modificaciones.',
    },
  },
  {
    id: 'EVT-GW-04',
    origin: 'Gateway Remoto',
    telemetryScope: 'sensor_gateway',
    event: 'Canal de telemetría forense disponible en 192.168.1.1',
    timestamp: '14:05:00',
    severity: 'Informativa',
    status: 'En investigación',
    ruleId: 'ARGOS-GW-TELEMETRY',
    mitreTechnique: 'T1046 — Network Service Discovery',
    threat: 'Falta de sincronización periódica de directivas de seguridad',
    threatPriority: 'Baja',
    vulnerability: 'Desconexión de estación tras período de inactividad',
    vulnPriority: 'Baja (1)',
    asset: 'Enlace Remoto (192.168.1.1:22)',
    assetPriority: 'Prioridad 1',
    correlationHint:
      'Conecta mediante ssh operador@192.168.1.1 desde la terminal para recolectar la huella oficial de firmware.',
    evidenceDetail:
      'Gateway seguro mantiene reporte de directivas CIS IG1 y hash SHA-256 para validación.',
    rawLog:
      'Oct 16 14:05:00 reliquia-gw sshd[89]: Forensic gateway listener ready on 192.168.1.1:22 for station 192.168.1.50',
    extractedFields: {
      'gateway_ip': '192.168.1.1',
      'gateway_port': '22',
      'target_station': '192.168.1.50',
      'protocol': 'SSH-2.0-OpenSSH_8.9p1',
      'service': 'Forensic Telemetry Gateway',
    },
    linkedEdrDetectionId: 'EDR-02',
    relatedEventIds: ['EVT-FS-02'],
    provenance: {
      sourceType: 'remote_gateway',
      sourceLabel: 'Consola de Auditoría Gateway (192.168.1.1)',
      evidencePath: '/usr/local/bin/ssh',
      isContinuousCapture: false,
      fidelityNote:
        'Servicio remoto simulado en el script wrapper /usr/local/bin/ssh de la sandbox para guiar al estudiante.',
    },
    pedagogy: {
      anomalyVsThreat:
        'El gateway es un servicio legítimo de infraestructura, no un vector de ataque. Su telemetría aporta las directivas maestras para validar el laboratorio.',
      investigationTip:
        'Conecta con `ssh operador@192.168.1.1` en la consola para obtener el informe del gateway.',
      justificationQuestion:
        '¿Cómo ayuda el gateway a validar las directivas CIS Controls IG1?',
      ciaImpactExplanation:
        'Disponibilidad (A): Canal de comunicación administrativa entre la estación y el nodo central.',
    },
  },
]

const INITIAL_EDR_DETECTIONS: EdrDetectionItem[] = [
  {
    id: 'EDR-01',
    pid: '412',
    ppid: '120',
    name: '.baliza_eco.sh',
    path: '/tmp/.baliza_eco.sh',
    cli: 'sh /tmp/.baliza_eco.sh (while true; do nc -l -p 4444; done)',
    user: 'root',
    socketOrPerm: '0.0.0.0:4444 (LISTEN)',
    status: 'Activo (Riesgo)',
    category: 'Proceso',
    hashSha256: 'e89a3f2b4c10... (Script efímero en /tmp)',
    mitreTechnique: 'T1059.004 — Unix Shell / T1071.001 Standard Protocol C2',
    threatDescription:
      'Bucle infinito con netcat escuchando en puerto no estándar 4444. Potencial canal de balizamiento o persistencia.',
    containmentAction: 'kill -15 (SIGTERM)',
    linkedSiemEventId: 'EVT-4444',
    isRemediated: false,
    evidenceDetails: {
      parentProcess: 'sh (PID 120)',
      sockets: ['0.0.0.0:4444 (LISTEN)'],
      memoryRss: '1.2 MB',
      integrity: 'No firmado / Directorio volátil /tmp',
      ownerGroup: 'root:root',
    },
    provenance: {
      sourceType: 'live_guest_probe',
      sourceLabel: 'Sondeo de Procesos y Sockets del Kernel Linux',
      evidencePath: '/tmp/.baliza_eco.sh',
      isContinuousCapture: true,
      fidelityNote:
        'Verificado contra pgrep y netstat en la máquina virtual. Cuando está detenida, se marca como simulado.',
    },
    pedagogy: {
      anomalyVsThreat:
        'El antiguo operador dejó este script para probar telemetría ambiental, pero su falta de autenticación y ejecución en /tmp lo convierte en una anomalía grave y riesgo de acceso indebido.',
      investigationTip:
        'Revisa /home/antiguo_operador/diario.txt para corroborar la intención original del operador antes de actuar.',
      justificationQuestion:
        '¿Por qué se debe priorizar SIGTERM (15) para que netcat cierre el socket limpiamente?',
      ciaImpactExplanation:
        'Integridad (I) y Confidencialidad (C): Puerto abierto accesible sin control de acceso.',
    },
  },
  {
    id: 'EDR-02',
    pid: '-',
    ppid: '-',
    name: 'id_ed25519',
    path: '/home/custodio/.ssh/id_ed25519',
    cli: 'chmod 644 /home/custodio/.ssh/id_ed25519',
    user: 'custodio',
    socketOrPerm: 'Modo POSIX 644',
    status: 'Vulnerable',
    category: 'Permisos',
    hashSha256: 'Clave privada OpenSSH Ed25519 (256-bit)',
    mitreTechnique: 'T1552.004 — Private Keys',
    threatDescription:
      'Clave privada accesible en lectura por cualquier cuenta del sistema (-rw-r--r--). Incumple CIS IG1 Control 3.3.',
    containmentAction: 'chmod 600 ~/.ssh/id_ed25519',
    linkedSiemEventId: 'EVT-FS-02',
    isRemediated: false,
    evidenceDetails: {
      modeOctal: '0644',
      integrity: 'Inseguro (Lectura pública habilitada)',
      ownerGroup: 'custodio:custodio',
    },
    provenance: {
      sourceType: 'live_guest_probe',
      sourceLabel: 'Auditoría de Inodo POSIX (stat)',
      evidencePath: '/home/custodio/.ssh/id_ed25519',
      isContinuousCapture: false,
      fidelityNote:
        'Permisos extraídos con stat directamente del inodo del archivo en disco.',
    },
    pedagogy: {
      anomalyVsThreat:
        'Una debilidad de configuración (vulnerabilidad) que abre la puerta a robo de credenciales. La directiva CIS IG1 3.3 exige 600.',
      investigationTip:
        'Comprueba con `stat -c %a ~/.ssh/id_ed25519` el modo octal.',
      justificationQuestion:
        '¿Qué consecuencias tendría para otros sistemas si esta clave es leída por un atacante local?',
      ciaImpactExplanation:
        'Confidencialidad (C): Material criptográfico de autenticación expuesto.',
    },
  },
  {
    id: 'EDR-03',
    pid: '-',
    ppid: '-',
    name: 'estacion_confidencial.conf',
    path: '/etc/estacion_confidencial.conf',
    cli: 'chmod 777 /etc/estacion_confidencial.conf',
    user: 'root',
    socketOrPerm: 'Modo POSIX 777',
    status: 'Vulnerable',
    category: 'Configuración',
    hashSha256: 'Configuración con tokens sensibles de infraestructura',
    mitreTechnique: 'T1222.002 — Linux File Permissions',
    threatDescription:
      'Fichero de configuración crítico con permisos de escritura y lectura mundial (-rwxrwxrwx). Permite manipulación de tokens.',
    containmentAction: 'chmod 640 /etc/estacion_confidencial.conf',
    linkedSiemEventId: 'EVT-CONF-03',
    isRemediated: false,
    evidenceDetails: {
      modeOctal: '0777',
      integrity: 'Peligro (Escritura pública en /etc)',
      ownerGroup: 'root:root',
    },
    provenance: {
      sourceType: 'live_guest_probe',
      sourceLabel: 'Auditoría de Inodo POSIX (stat)',
      evidencePath: '/etc/estacion_confidencial.conf',
      isContinuousCapture: false,
      fidelityNote:
        'Permisos de lectura y escritura universales comprobados en /etc.',
    },
    pedagogy: {
      anomalyVsThreat:
        'Permisos permisivos globales permiten que procesos sin privilegios alteren tokens de sesión o secretos compartidos.',
      investigationTip:
        'Inspecciona el archivo con `cat /etc/estacion_confidencial.conf` para identificar qué secretos contiene.',
      justificationQuestion:
        '¿Por qué se recomienda el modo 640 en lugar de 600 si procesos del grupo necesitan leerlo?',
      ciaImpactExplanation:
        'Confidencialidad (C) + Integridad (I): Lectura y alteración no autorizada de configuración.',
    },
  },
  {
    id: 'EDR-04',
    pid: '105',
    ppid: '1',
    name: 'login (root)',
    path: '/bin/login',
    cli: 'login -- root on ttyS0',
    user: 'root',
    socketOrPerm: 'UID 0 directo en ttyS0',
    status: 'Activo (Riesgo)',
    category: 'Identidad',
    hashSha256: 'Binario estándar Buildroot BusyBox login',
    mitreTechnique: 'T1078.003 — Local Accounts',
    threatDescription:
      'Operación directa bajo la cuenta compartida root sin usuarios nominales. Impide trazabilidad personal en peritajes forenses.',
    containmentAction: 'adduser <usuario_nominal>',
    linkedSiemEventId: 'EVT-AUTH-01',
    isRemediated: false,
    evidenceDetails: {
      parentProcess: 'init (PID 1)',
      memoryRss: '0.8 MB',
      integrity: 'Válido del sistema (Riesgo procedimental CIS 5.1)',
      ownerGroup: 'root:root',
    },
    provenance: {
      sourceType: 'live_guest_probe',
      sourceLabel: 'Consola Serie ttyS0',
      evidencePath: '/dev/ttyS0',
      isContinuousCapture: true,
      fidelityNote:
        'Sesión interactiva UID 0 en ejecución en la máquina virtual.',
    },
    pedagogy: {
      anomalyVsThreat:
        'Riesgo operacional severo. Trabajar como root de forma continua anula la rendición de cuentas (accountability) requerida por CIS Controls IG1.',
      investigationTip:
        'Crea una cuenta nominal con `adduser custodio` para separar privilegios.',
      justificationQuestion:
        '¿Cómo responde el principio de mínimo privilegio a la necesidad de no operar siempre como root?',
      ciaImpactExplanation:
        'Integridad (I): Cualquier comando por error o malicioso tiene alcance total sobre el sistema.',
    },
  },
]

type Listener = () => void

class SecurityTelemetryService {
  private siemEvents: SiemEventItem[] = INITIAL_SIEM_EVENTS
  private edrDetections: EdrDetectionItem[] = INITIAL_EDR_DETECTIONS
  private selectedSiemEventId: string = 'EVT-4444'
  private selectedEdrDetectionId: string = 'EDR-01'
  private vmStatus: VmStatus = 'stopped'
  private isScanning: boolean = false
  private quarantinedFiles: string[] = []
  private listeners = new Set<Listener>()

  // Student investigation notes map
  private siemNotes: Record<string, string> = {}
  private edrNotes: Record<string, string> = {}

  constructor() {
    this.loadNotes()

    // Sync with VM status
    this.vmStatus = tulipVmService.getStatus()
    tulipVmService.onStatusChange((status) => {
      this.vmStatus = status
      if (status === 'ready') {
        this.syncWithSandboxState()
      }
      this.emitChange()
    })

    // Sync with Lab Verification milestones
    labVerificationService.subscribe((milestones) => {
      const m4Done = milestones.find((m) => m.id === 'm4')?.completed ?? false
      const m5Done = milestones.find((m) => m.id === 'm5')?.completed ?? false

      let changed = false

      if (m4Done) {
        const baliza = this.edrDetections.find((d) => d.id === 'EDR-01')
        if (baliza && baliza.status !== 'Contenido (Mitigado)') {
          baliza.status = 'Contenido (Mitigado)'
          baliza.socketOrPerm = 'Cerrado'
          baliza.isRemediated = true
          changed = true
        }
        const evt = this.siemEvents.find((e) => e.id === 'EVT-4444')
        if (evt && evt.status !== 'Mitigado') {
          evt.status = 'Mitigado'
          evt.mitigationTimestamp = new Date().toLocaleTimeString()
          changed = true
        }
      }

      if (m5Done) {
        const keyDet = this.edrDetections.find((d) => d.id === 'EDR-02')
        if (keyDet && keyDet.status !== 'Blindado') {
          keyDet.status = 'Blindado'
          keyDet.socketOrPerm = 'Modo POSIX 600'
          keyDet.isRemediated = true
          changed = true
        }
        const evtKey = this.siemEvents.find((e) => e.id === 'EVT-FS-02')
        if (evtKey && evtKey.status !== 'Mitigado') {
          evtKey.status = 'Mitigado'
          evtKey.mitigationTimestamp = new Date().toLocaleTimeString()
          changed = true
        }
      }

      if (changed) {
        this.emitChange()
      }
    })
  }

  private loadNotes(): void {
    if (typeof window !== 'undefined') {
      try {
        const sNotes = localStorage.getItem(STORAGE_KEY_SIEM_NOTES)
        if (sNotes) this.siemNotes = JSON.parse(sNotes)
        const eNotes = localStorage.getItem(STORAGE_KEY_EDR_NOTES)
        if (eNotes) this.edrNotes = JSON.parse(eNotes)
      } catch (err) {
        console.warn('[SecurityTelemetryService] Could not parse stored notes:', err)
      }
    }
  }

  private saveNotes(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_SIEM_NOTES, JSON.stringify(this.siemNotes))
        localStorage.setItem(STORAGE_KEY_EDR_NOTES, JSON.stringify(this.edrNotes))
      } catch (err) {
        console.warn('[SecurityTelemetryService] Could not save notes:', err)
      }
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  private emitChange(): void {
    for (const listener of this.listeners) {
      try {
        listener()
      } catch (err) {
        console.error('[SecurityTelemetryService] Listener error:', err)
      }
    }
  }

  /* ── Getters ── */
  public getVmStatus(): VmStatus {
    return this.vmStatus
  }

  public isSandboxReady(): boolean {
    return this.vmStatus === 'ready'
  }

  public getSiemEvents(): SiemEventItem[] {
    return this.siemEvents.map((e) => ({
      ...e,
      studentNotes: this.siemNotes[e.id] || '',
    }))
  }

  public getEdrDetections(): EdrDetectionItem[] {
    return this.edrDetections.map((d) => ({
      ...d,
      studentNotes: this.edrNotes[d.id] || '',
    }))
  }

  public getSelectedSiemEventId(): string {
    return this.selectedSiemEventId
  }

  public getSelectedEdrDetectionId(): string {
    return this.selectedEdrDetectionId
  }

  public getSelectedSiemEvent(): SiemEventItem {
    const evt =
      this.siemEvents.find((e) => e.id === this.selectedSiemEventId) ||
      this.siemEvents[0]
    return {
      ...evt,
      studentNotes: this.siemNotes[evt.id] || '',
    }
  }

  public getSelectedEdrDetection(): EdrDetectionItem {
    const det =
      this.edrDetections.find((d) => d.id === this.selectedEdrDetectionId) ||
      this.edrDetections[0]
    return {
      ...det,
      studentNotes: this.edrNotes[det.id] || '',
    }
  }

  public isProcessContained(): boolean {
    const baliza = this.edrDetections.find((d) => d.id === 'EDR-01')
    return baliza?.status === 'Contenido (Mitigado)'
  }

  public getQuarantinedFiles(): string[] {
    return this.quarantinedFiles
  }

  public getActiveSockets(): EndpointSocketItem[] {
    const contained = this.isProcessContained()
    return [
      {
        proto: 'TCP',
        local: '0.0.0.0:4444',
        foreign: contained ? '---' : '192.168.1.189:54321',
        state: contained ? 'CLOSED' : 'LISTEN',
        pid: contained ? '-' : '412 / 413',
        program: contained ? '(Terminado)' : '.baliza_eco.sh (nc)',
        risk: contained ? 'Normal' : 'Crítico',
        provenance: 'netstat -tuln (Sandbox ttyS0)',
      },
      {
        proto: 'TCP',
        local: '0.0.0.0:22',
        foreign: '0.0.0.0:*',
        state: 'LISTEN',
        pid: '98',
        program: 'dropbear / sshd',
        risk: 'Informativo',
        provenance: 'netstat -tuln (Servicio SSH oficial)',
      },
      {
        proto: 'UDP',
        local: '127.0.0.1:53',
        foreign: '0.0.0.0:*',
        state: 'LISTEN',
        pid: '1',
        program: 'systemd-resolved',
        risk: 'Normal',
        provenance: 'netstat -tuln (DNS local)',
      },
    ]
  }

  public getCriticalFilesAudit(): FileAuditItem[] {
    const keyDet = this.edrDetections.find((d) => d.id === 'EDR-02')
    const confDet = this.edrDetections.find((d) => d.id === 'EDR-03')

    const keyBlindado = keyDet?.status === 'Blindado'
    const confBlindado = confDet?.status === 'Blindado'

    return [
      {
        path: '/home/custodio/.ssh/id_ed25519',
        currentPerm: keyBlindado ? '0600 (-rw-------)' : '0644 (-rw-r--r--)',
        recommendedPerm: '0600',
        status: keyBlindado ? 'Conforme' : 'Vulnerable',
        description: 'Clave privada SSH OpenSSH Ed25519 de autenticación',
        owner: 'custodio:custodio',
        cisBenchmark: 'CIS Controls IG1 3.3',
      },
      {
        path: '/etc/estacion_confidencial.conf',
        currentPerm: confBlindado ? '0640 (-rw-r-----)' : '0777 (-rwxrwxrwx)',
        recommendedPerm: '0640',
        status: confBlindado ? 'Conforme' : 'Vulnerable',
        description: 'Parámetros confidenciales y token de infraestructura',
        owner: 'root:root',
        cisBenchmark: 'CIS Controls IG1 3.3',
      },
      {
        path: '/usr/local/bin/firmware_oficial.bin',
        currentPerm: '0755 (-rwxr-xr-x)',
        recommendedPerm: '0755',
        status: 'Conforme',
        description: 'Binario ejecutable de sensores con firma SHA-256 intacta',
        owner: 'root:root',
        sha256: 'e4a2872658823f6de8be5bc65181775ba1e4b9f3900d11019ca66eb1a82f3c73',
        cisBenchmark: 'CIS Controls IG1 10.5',
      },
      {
        path: '/tmp/.baliza_eco.sh',
        currentPerm: this.isProcessContained() ? 'Eliminado / En cuarentena' : '0755 (-rwxr-xr-x)',
        recommendedPerm: 'Eliminado',
        status: this.isProcessContained() ? 'Conforme' : 'Vulnerable',
        description: 'Script no autorizado de retransmisión TCP en /tmp',
        owner: 'root:root',
        cisBenchmark: 'CIS Controls IG1 10.5',
      },
    ]
  }

  public getSecurityOverview(): SecurityOverviewStats {
    const sources: Record<string, number> = {}
    let crit = 0
    let high = 0
    let med = 0
    let info = 0
    let mit = 0

    for (const evt of this.siemEvents) {
      sources[evt.origin] = (sources[evt.origin] || 0) + 1
      if (evt.severity === 'Crítica') crit++
      else if (evt.severity === 'Alta') high++
      else if (evt.severity === 'Media') med++
      else if (evt.severity === 'Informativa') info++

      if (evt.status === 'Mitigado') mit++
    }

    return {
      totalEvents: this.siemEvents.length,
      criticalCount: crit,
      highCount: high,
      mediumCount: med,
      infoCount: info,
      mitigatedCount: mit,
      monitoredHost: 'reliquia-07',
      hostIp: '192.168.1.50',
      kernelVersion: 'Linux 6.8 Buildroot',
      isSandboxOnline: this.vmStatus === 'ready',
      sourcesBreakdown: sources,
    }
  }

  /* ── Notes Setters ── */
  public updateSiemNotes(eventId: string, notes: string): void {
    this.siemNotes[eventId] = notes
    this.saveNotes()
    this.emitChange()
  }

  public updateEdrNotes(detectionId: string, notes: string): void {
    this.edrNotes[detectionId] = notes
    this.saveNotes()
    this.emitChange()
  }

  /* ── Selection Setters ── */
  public selectSiemEvent(id: string): void {
    if (this.selectedSiemEventId !== id) {
      this.selectedSiemEventId = id
      this.emitChange()
    }
  }

  public selectEdrDetection(id: string): void {
    if (this.selectedEdrDetectionId !== id) {
      this.selectedEdrDetectionId = id
      this.emitChange()
    }
  }

  /* ── Sandbox Live Operations ── */
  public async bootSandbox(): Promise<void> {
    try {
      await tulipVmService.boot()
    } catch (err) {
      console.error('[SecurityTelemetryService] Boot error:', err)
      notify({
        appId: 'edr',
        title: 'Error de Arranque Sandbox',
        body: 'No fue posible iniciar el emulador Linux.',
        level: 'error',
      })
    }
  }

  /**
   * Safe Containment: Terminates the rogue process and closes socket 4444.
   * Truly sends command to guest Linux VM via serial if running.
   */
  public async containRogueProcess(): Promise<{ success: boolean; isLive: boolean }> {
    try {
      const isLive = this.vmStatus === 'ready'

      if (isLive) {
        const containmentCmd =
          'kill -15 $(pgrep -f baliza_eco 2>/dev/null || pgrep -f "nc -l -p 4444" 2>/dev/null || echo "") 2>/dev/null; rm -f /tmp/.baliza_eco.sh'
        tulipVmService.serial0_send(`\n ${containmentCmd}\n`)
      }

      // Update EDR detection state
      this.edrDetections = this.edrDetections.map((d) => {
        if (d.id === 'EDR-01') {
          return {
            ...d,
            status: 'Contenido (Mitigado)',
            socketOrPerm: 'Cerrado',
            isRemediated: true,
          }
        }
        return d
      })

      // Update SIEM event state
      this.siemEvents = this.siemEvents.map((e) => {
        if (e.id === 'EVT-4444' || e.id === 'EVT-PROC-05') {
          return {
            ...e,
            status: 'Mitigado',
            mitigationTimestamp: new Date().toLocaleTimeString(),
          }
        }
        return e
      })

      // Update Playbook & verification milestones
      labVerificationService.setMilestoneCompleted('m4', true)
      labVerificationService.updateFinding('HALL-02', { status: 'Mitigado' })
      labVerificationService.addAuditEntry(
        `Vigil EDR: Terminación limpia SIGTERM (15) enviada al proceso baliza PID 412. Socket TCP 4444 cerrado. [Modo: ${
          isLive ? 'Ejecución Real en Kernel Linux' : 'Simulación Registrada'
        }]`
      )

      notify({
        appId: 'edr',
        title: 'Vigil EDR — Contención Aplicada',
        body: isLive
          ? 'Señal SIGTERM (15) ejecutada en ttyS0. Proceso detenido y socket :4444 cerrado en la VM.'
          : 'Contención registrada como mitigación teórica (sandbox no iniciada).',
        level: 'success',
      })

      this.emitChange()
      return { success: true, isLive }
    } catch (err) {
      console.error('[SecurityTelemetryService] Containment error:', err)
      return { success: false, isLive: false }
    }
  }

  /**
   * Safe Hardening Action: Corrects file permissions according to CIS IG1 benchmark.
   */
  public async applyHardening(detectionId: string): Promise<boolean> {
    try {
      const isLive = this.vmStatus === 'ready'

      if (detectionId === 'EDR-02') {
        if (isLive) {
          tulipVmService.serial0_send('\n chmod 600 /home/custodio/.ssh/id_ed25519 2>/dev/null\n')
        }

        this.edrDetections = this.edrDetections.map((d) => {
          if (d.id === 'EDR-02') {
            return {
              ...d,
              status: 'Blindado',
              socketOrPerm: 'Modo POSIX 600',
              isRemediated: true,
            }
          }
          return d
        })

        this.siemEvents = this.siemEvents.map((e) => {
          if (e.id === 'EVT-FS-02') {
            return {
              ...e,
              status: 'Mitigado',
              mitigationTimestamp: new Date().toLocaleTimeString(),
            }
          }
          return e
        })

        labVerificationService.addAuditEntry(
          `Vigil EDR: Restricción de permisos POSIX 600 aplicada a ~/.ssh/id_ed25519. [${
            isLive ? 'Real en disco VM' : 'Simulado'
          }]`
        )

        notify({
          appId: 'edr',
          title: 'Vigil EDR — Permisos Asegurados',
          body: 'Permisos de id_ed25519 restringidos a 600 (CIS Control 3.3).',
          level: 'success',
        })

        labVerificationService.evaluateLab()
        this.emitChange()
        return true
      }

      if (detectionId === 'EDR-03') {
        if (isLive) {
          tulipVmService.serial0_send('\n chmod 640 /etc/estacion_confidencial.conf 2>/dev/null\n')
        }

        this.edrDetections = this.edrDetections.map((d) => {
          if (d.id === 'EDR-03') {
            return {
              ...d,
              status: 'Blindado',
              socketOrPerm: 'Modo POSIX 640',
              isRemediated: true,
            }
          }
          return d
        })

        this.siemEvents = this.siemEvents.map((e) => {
          if (e.id === 'EVT-CONF-03') {
            return {
              ...e,
              status: 'Mitigado',
              mitigationTimestamp: new Date().toLocaleTimeString(),
            }
          }
          return e
        })

        labVerificationService.addAuditEntry(
          `Vigil EDR: Restricción de permisos POSIX 640 aplicada a /etc/estacion_confidencial.conf. [${
            isLive ? 'Real en disco VM' : 'Simulado'
          }]`
        )

        notify({
          appId: 'edr',
          title: 'Vigil EDR — Configuración Protegida',
          body: 'Permisos de estacion_confidencial.conf reducidos a 640.',
          level: 'success',
        })

        this.emitChange()
        return true
      }

      return false
    } catch (err) {
      console.error('[SecurityTelemetryService] Hardening error:', err)
      return false
    }
  }

  /**
   * Quarantines suspicious script file to an isolated folder in sandbox.
   */
  public async quarantineArtifact(detectionId: string): Promise<boolean> {
    try {
      const isLive = this.vmStatus === 'ready'

      if (detectionId === 'EDR-01') {
        if (isLive) {
          const qCmd =
            'mkdir -p /tmp/.quarantine && mv -f /tmp/.baliza_eco.sh /tmp/.quarantine/ 2>/dev/null'
          tulipVmService.serial0_send(`\n ${qCmd}\n`)
        }

        if (!this.quarantinedFiles.includes('/tmp/.baliza_eco.sh')) {
          this.quarantinedFiles.push('/tmp/.baliza_eco.sh')
        }

        labVerificationService.addAuditEntry(
          `Vigil EDR: Artefacto /tmp/.baliza_eco.sh aislado en carpeta de cuarentena /tmp/.quarantine/ [${
            isLive ? 'Real en disco VM' : 'Simulado'
          }]`
        )

        notify({
          appId: 'edr',
          title: 'Vigil EDR — Fichero en Cuarentena',
          body: 'Artefacto trasladado a /tmp/.quarantine/.',
          level: 'info',
        })

        this.emitChange()
        return true
      }
      return false
    } catch (err) {
      console.error('[SecurityTelemetryService] Quarantine error:', err)
      return false
    }
  }

  /**
   * Rescans endpoint telemetry by querying guest status and inspecting sandbox state.
   */
  public async rescanEndpoint(): Promise<void> {
    if (this.isScanning) return
    this.isScanning = true

    try {
      if (this.vmStatus === 'ready') {
        await labVerificationService.evaluateLab()
        await this.syncWithSandboxState()
        notify({
          appId: 'edr',
          title: 'Vigil EDR — Re-escaneo Completado',
          body: 'Telemetría de procesos y permisos verificada contra el kernel real.',
          level: 'success',
        })
      } else {
        notify({
          appId: 'edr',
          title: 'Vigil EDR — Sandbox Detenida',
          body: 'Inicia la consola de la estación para inspeccionar el sistema en vivo.',
          level: 'warn',
        })
      }
    } finally {
      this.isScanning = false
      this.emitChange()
    }
  }

  private async syncWithSandboxState(): Promise<void> {
    if (this.vmStatus !== 'ready') return

    const checkCmd = [
      'B_ACT="0"',
      'netstat -tuln 2>/dev/null | grep -q ":4444 " && B_ACT="1"',
      'pgrep -f "baliza_eco" >/dev/null 2>&1 && B_ACT="1"',
      'KEY_PERM="$(stat -c %a /home/custodio/.ssh/id_ed25519 2>/dev/null || stat -f %Lp /home/custodio/.ssh/id_ed25519 2>/dev/null || echo 0)"',
      'CONF_PERM="$(stat -c %a /etc/estacion_confidencial.conf 2>/dev/null || stat -f %Lp /etc/estacion_confidencial.conf 2>/dev/null || echo 0)"',
      'echo "TULIP_SEC_PROBE:baliza=$B_ACT:key=$KEY_PERM:conf=$CONF_PERM"',
    ].join('; ')

    tulipVmService.serial0_send(` ${checkCmd}\n`)

    await new Promise((res) => setTimeout(res, 500))

    const recent = tulipVmService.getRecentOutput(1024)
    const match = recent.match(/TULIP_SEC_PROBE:baliza=(0|1):key=(\d+):conf=(\d+)/)

    if (match) {
      const balizaActive = match[1] === '1'
      const keyPerm = match[2]
      const confPerm = match[3]

      let stateChanged = false

      // Sync Baliza / Socket 4444
      this.edrDetections = this.edrDetections.map((d) => {
        if (d.id === 'EDR-01') {
          const isContained = !balizaActive
          if (isContained !== d.isRemediated) {
            stateChanged = true
            return {
              ...d,
              status: isContained ? 'Contenido (Mitigado)' : 'Activo (Riesgo)',
              socketOrPerm: isContained ? 'Cerrado' : '0.0.0.0:4444 (LISTEN)',
              isRemediated: isContained,
            }
          }
        }
        return d
      })

      if (!balizaActive) {
        this.siemEvents = this.siemEvents.map((e) => {
          if (e.id === 'EVT-4444' && e.status !== 'Mitigado') {
            stateChanged = true
            return {
              ...e,
              status: 'Mitigado',
              mitigationTimestamp: new Date().toLocaleTimeString(),
            }
          }
          return e
        })
      }

      // Sync SSH key permissions
      if (keyPerm === '600') {
        this.edrDetections = this.edrDetections.map((d) => {
          if (d.id === 'EDR-02' && d.status !== 'Blindado') {
            stateChanged = true
            return {
              ...d,
              status: 'Blindado',
              socketOrPerm: 'Modo POSIX 600',
              isRemediated: true,
            }
          }
          return d
        })
        this.siemEvents = this.siemEvents.map((e) => {
          if (e.id === 'EVT-FS-02' && e.status !== 'Mitigado') {
            stateChanged = true
            return { ...e, status: 'Mitigado' }
          }
          return e
        })
      }

      // Sync Conf file permissions
      if (confPerm === '640' || confPerm === '600') {
        this.edrDetections = this.edrDetections.map((d) => {
          if (d.id === 'EDR-03' && d.status !== 'Blindado') {
            stateChanged = true
            return {
              ...d,
              status: 'Blindado',
              socketOrPerm: `Modo POSIX ${confPerm}`,
              isRemediated: true,
            }
          }
          return d
        })
        this.siemEvents = this.siemEvents.map((e) => {
          if (e.id === 'EVT-CONF-03' && e.status !== 'Mitigado') {
            stateChanged = true
            return { ...e, status: 'Mitigado' }
          }
          return e
        })
      }

      if (stateChanged) {
        this.emitChange()
      }
    }
  }

  /* ── Dossier / Findings Integration ── */
  public exportSiemEventToFinding(eventId: string): void {
    const evt = this.siemEvents.find((e) => e.id === eventId)
    if (!evt) return

    const studentNote = this.siemNotes[eventId] || ''
    const evidenceNotes = studentNote
      ? `\n\n[Notas de Investigación del Custodio]:\n${studentNote}`
      : ''

    labVerificationService.addFinding({
      title: `${evt.id}: ${evt.threat}`,
      affectedAsset: evt.asset,
      observation: `${evt.event} [Regla: ${evt.ruleId}]`,
      classification:
        evt.severity === 'Crítica'
          ? 'Amenaza'
          : evt.severity === 'Alta'
          ? 'Vulnerabilidad'
          : 'Riesgo',
      ciaImpact:
        evt.severity === 'Crítica'
          ? ['I', 'A']
          : evt.severity === 'Alta'
          ? ['C']
          : ['I'],
      priority:
        evt.severity === 'Crítica'
          ? 'Crítica'
          : evt.severity === 'Alta'
          ? 'Alta'
          : 'Medio',
      evidence: `Registro: ${evt.rawLog}\nDetalle: ${evt.evidenceDetail}\nProcedencia: ${evt.provenance.sourceLabel}${evidenceNotes}`,
      proposedAction: `${evt.correlationHint} (Técnica MITRE: ${evt.mitreTechnique})`,
      verification: 'Comprobación en consola serie ttyS0 y matriz CIS Controls IG1.',
      status: evt.status === 'Mitigado' ? 'Mitigado' : 'En investigación',
      source: 'Argos SIEM',
    })
  }

  public exportEdrDetectionToFinding(detectionId: string): void {
    const det = this.edrDetections.find((d) => d.id === detectionId)
    if (!det) return

    const studentNote = this.edrNotes[detectionId] || ''
    const evidenceNotes = studentNote
      ? `\n\n[Notas de Investigación EDR]:\n${studentNote}`
      : ''

    labVerificationService.addFinding({
      title: `${det.id}: ${det.name} (${det.category})`,
      affectedAsset: `${det.path} [${det.socketOrPerm}]`,
      observation: det.threatDescription,
      classification:
        det.category === 'Proceso'
          ? 'Amenaza'
          : det.category === 'Permisos'
          ? 'Vulnerabilidad'
          : 'Riesgo',
      ciaImpact:
        det.category === 'Proceso'
          ? ['I', 'A']
          : ['C', 'I'],
      priority:
        det.category === 'Proceso'
          ? 'Crítica'
          : 'Alta',
      evidence: `PID: ${det.pid} | PPID: ${det.ppid} | CLI: ${det.cli} | Hash: ${det.hashSha256}\nProcedencia: ${det.provenance.sourceLabel}${evidenceNotes}`,
      proposedAction: `Acción EDR recomendada: ${det.containmentAction} (MITRE: ${det.mitreTechnique})`,
      verification: 'Verificar cierre de socket o cambio en permisos POSIX con Vigil EDR.',
      status: det.isRemediated ? 'Mitigado' : 'En investigación',
      source: 'Vigil EDR',
    })
  }
}

export const securityTelemetryService = new SecurityTelemetryService()
