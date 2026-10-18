/**
 * Lab 1 "El Invernadero" — Core Types & Single Source of Truth Interfaces
 * Based strictly on docs/lab1-context.md.
 *
 * All in-universe lore, log outputs, filenames, and UI labels are in Spanish.
 * Code architecture, interfaces, and mutator methods are written in clean English.
 */

/**
 * Single Node in the Deep Virtual File System (Full FHS Tree)
 */
export interface FSNode {
  type: 'file' | 'dir' | 'symlink';
  perms: string; // Octal e.g. '755', '600', '777'
  owner: string; // e.g. 'root', 'cuidador', 'www-data'
  group: string;
  size: number;
  modified: string;
  magic: string; // Output returned when running `file <path>`
  sha256?: string; // Output returned when running `sha256sum <path>`
  content?: string; // Full text content for cat, less, head, tail, grep, nano
  target?: string; // Target path if type === 'symlink'
}

/**
 * Unified Process & Service Table entry (systemd, ps aux, top, ss -tulpn, kill)
 */
export interface SystemProcess {
  pid: number;
  user: string;
  cpu: number;
  mem: number;
  command: string;
  serviceName?: string;
  status: 'running' | 'dead';
  port?: number;
  proto?: 'tcp' | 'udp';
  listenAddress?: '0.0.0.0' | '127.0.0.1';
  edrClassification?: 'clean' | 'false_positive' | 'threat';
  edrResolved?: boolean;
}

/**
 * CIA Triad Individual Pillar Status
 */
export interface CiaPillar {
  score: number; // 0 to 100
  status: 'optimal' | 'warning' | 'critical';
  title: string;
  summary: string;
  findings: string[];
}

/**
 * Live Evaluated CIA Triad (Confidencialidad, Integridad, Disponibilidad)
 */
export interface CiaTriadEvaluation {
  confidentiality: CiaPillar;
  integrity: CiaPillar;
  availability: CiaPillar;
  overallScore: number;
}

/**
 * Individual Botanical Specimen Health & Condition
 */
export interface BotanicalSpecimen {
  id: string;
  commonName: string;
  scientificName: string;
  healthPercent: number;
  status: 'flourishing' | 'stressed' | 'critical_danger';
  targetMoisture: string;
  currentMoisture: string;
  targetPh: string;
  notes: string;
}

/**
 * Greenhouse Domo Control & Botanical Telemetry
 */
export interface GreenhouseTelemetry {
  domoState: 'online' | 'degraded' | 'offline';
  webPanelHttpCode: 200 | 403 | 503;
  webPanelMessage: string;
  temperatureC: number;
  humidityPercent: number;
  coolingFansRpm: number;
  uvLampState: 'calm' | 'flickering' | 'offline';
  irrigationPumpState: 'optimal' | 'toxic_flooding' | 'drought_stopped';
  specimens: BotanicalSpecimen[];
}

/**
 * SIEM Correlated Log Event
 */
export interface SiemEvent {
  id: string;
  timestampOriginal: string; // Ground truth chronological timestamp
  timestampDisplay: string; // Scrambled (e.g. 1999) if NTP dead, normalized if NTP running
  origin: 'Auth Log' | 'Syslog / Audit' | 'Red / Zeek' | 'Kernel / eBPF' | 'FIM / Integridad';
  severity: 'Crítica' | 'Alta' | 'Media' | 'Informativa';
  event: string;
  rawLog: string;
  evidenceDetail: string;
  ruleId: string;
  mitreTechnique: string;
  sourceIp?: string;
  destPort?: number;
  isCleartextLeak?: boolean;
}

/**
 * EDR Detection / Vital Sign Alert
 */
export interface EdrDetectionAlert {
  id: string;
  title: string;
  targetType: 'process' | 'file' | 'permission';
  targetIdentifier: string; // PID or File Path
  classification: 'clean' | 'false_positive' | 'threat';
  severity: 'Crítica' | 'Alta' | 'Media' | 'Informativa';
  heuristicReason: string;
  investigationTip: string;
  status: 'Activo (Riesgo)' | 'Contenido (Mitigado)' | 'Actividad Legítima Validada';
  resolved: boolean;
  canMarkFalsePositive?: boolean;
}

/**
 * Open Network Socket representation (ss -tulpn)
 */
export interface NetworkSocket {
  proto: 'tcp' | 'udp';
  port: number;
  listenAddress: '0.0.0.0' | '127.0.0.1';
  pid: number;
  process: string;
  user: string;
  serviceName?: string;
}

/**
 * Saved VM-Style Snapshot for Time-Travel Rewind
 */
export interface LabSnapshot {
  id: string;
  label: string;
  createdAt: string;
  fs: Record<string, FSNode>;
  processes: SystemProcess[];
  edrResolutions: Record<string, boolean>;
  notes?: string;
}

/**
 * Complete Reactive Lab 1 State
 */
export interface Lab1State {
  hostname: string;
  currentUser: string;
  cwd: string;
  fs: Record<string, FSNode>;
  processes: SystemProcess[];
  edrResolutions: Record<string, boolean>;
  snapshots: LabSnapshot[];

  // Dynamic / Derived reactive telemetry
  cia: CiaTriadEvaluation;
  greenhouse: GreenhouseTelemetry;
  siemEvents: SiemEvent[];
  edrAlerts: EdrDetectionAlert[];
  openSockets: NetworkSocket[];
  totalCpuPercent: number;
  totalMemPercent: number;
  isNtpSynced: boolean;
  isSshKeyUnprotected: boolean;
  dnsServer: string;
}

/**
 * Result of executing a file or system action
 */
export interface MutatorResult {
  success: boolean;
  message?: string;
  content?: string;
  error?: string;
}

/**
 * Public Mutator API for the Reactive State Store
 */
export interface Lab1Mutators {
  // File System
  readFile: (path: string, user?: string) => MutatorResult;
  writeFile: (path: string, content: string, user?: string) => MutatorResult;
  deleteNode: (path: string, recursive?: boolean, user?: string) => MutatorResult;
  chmod: (path: string, perms: string, user?: string) => MutatorResult;
  chown: (path: string, owner: string, group?: string, user?: string) => MutatorResult;
  createDir: (path: string, perms?: string, owner?: string, group?: string) => MutatorResult;
  copyNode: (srcPath: string, destPath: string, user?: string) => MutatorResult;
  moveNode: (srcPath: string, destPath: string, user?: string) => MutatorResult;
  getFileMagic: (path: string) => string;
  getFileSha256: (path: string) => string | undefined;

  // Process & Service
  killProcess: (pid: number, signal?: 9 | 15, user?: string) => MutatorResult;
  startService: (serviceName: string, user?: string) => MutatorResult;
  stopService: (serviceName: string, user?: string) => MutatorResult;
  restartService: (serviceName: string, user?: string) => MutatorResult;

  // EDR & Triage
  markEdrResolution: (alertId: string, action: 'allow_false_positive' | 'quarantine' | 'terminate') => MutatorResult;

  // Network & SSH
  checkSshClientAccess: (keyPath?: string) => { allowed: boolean; warning?: string };
  resolveDomain: (domain: string) => string | null;

  // Snapshots & Time Travel
  createSnapshot: (label?: string) => LabSnapshot;
  restoreSnapshot: (snapshotIdOrIndex: string | number) => boolean;
  getSnapshots: () => LabSnapshot[];
  deleteSnapshot: (snapshotId: string) => boolean;
  resetToPristine: () => void;

  // Session
  setCurrentUser: (user: string) => void;
  setCwd: (path: string) => void;
}
