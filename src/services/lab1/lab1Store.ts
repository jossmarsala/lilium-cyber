import { useSyncExternalStore } from 'react';
import type {
  FSNode,
  SystemProcess,
  LabSnapshot,
  Lab1State,
  Lab1Mutators,
  MutatorResult,
} from './types';
import { createInitialFileSystem } from './initialFs';
import { createInitialProcesses } from './initialProcesses';
import {
  evaluateCiaTriad,
  evaluateGreenhouseTelemetry,
  evaluateSiemEvents,
  evaluateEdrAlerts,
  deriveOpenSockets,
} from './evaluators';
import { computeSha256 } from './cryptoUtils';

/**
 * Deep clones serializable state for snapshots and immutable updates
 */
function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Builds the fully evaluated derived state from raw state properties
 */
function buildFullState(
  fs: Record<string, FSNode>,
  processes: SystemProcess[],
  edrResolutions: Record<string, boolean>,
  snapshots: LabSnapshot[],
  currentUser = 'operario',
  cwd = '/home/operario',
  hostname = 'invernadero-central',
): Lab1State {
  const isNtpSynced = processes.some((p) => p.serviceName === 'ntp.service' && p.status === 'running');
  const sshKeyNode = fs['/home/cuidador/.ssh/id_ed25519'];
  const isSshKeyUnprotected = sshKeyNode?.perms === '777';

  // Parse DNS server from /etc/resolv.conf
  let dnsServer = '10.66.6.6';
  const resolvConf = fs['/etc/resolv.conf'];
  if (resolvConf?.content) {
    const match = resolvConf.content.match(/nameserver\s+([0-9.]+)/);
    if (match) {
      dnsServer = match[1];
    }
  }

  // Calculate CPU and Memory consumption from running processes
  let totalCpuPercent = 0;
  let totalMemPercent = 0;
  for (const proc of processes) {
    if (proc.status === 'running') {
      totalCpuPercent += proc.cpu;
      totalMemPercent += proc.mem;
    }
  }
  totalCpuPercent = Math.round(totalCpuPercent * 10) / 10;
  totalMemPercent = Math.round(totalMemPercent * 10) / 10;

  // Pure evaluators
  const cia = evaluateCiaTriad(fs, processes);
  const greenhouse = evaluateGreenhouseTelemetry(fs, processes, cia);
  const siemEvents = evaluateSiemEvents(processes, isNtpSynced);
  const edrAlerts = evaluateEdrAlerts(fs, processes, edrResolutions);
  const openSockets = deriveOpenSockets(processes);

  return {
    hostname,
    currentUser,
    cwd,
    fs,
    processes,
    edrResolutions,
    snapshots,
    cia,
    greenhouse,
    siemEvents,
    edrAlerts,
    openSockets,
    totalCpuPercent,
    totalMemPercent,
    isNtpSynced,
    isSshKeyUnprotected,
    dnsServer,
  };
}

/**
 * Reactive Singleton Store for Lab 1 "El Invernadero"
 */
class Lab1Store implements Lab1Mutators {
  private state: Lab1State;
  private listeners = new Set<(state: Lab1State) => void>();

  constructor() {
    const fs = createInitialFileSystem();
    const processes = createInitialProcesses();
    const edrResolutions: Record<string, boolean> = {};
    const snapshots: LabSnapshot[] = [];

    this.state = buildFullState(fs, processes, edrResolutions, snapshots);

    // Create initial base snapshot so the user can always revert to pristine state
    const initialSnapshot: LabSnapshot = {
      id: 'snapshot-pristine-0',
      label: 'Estado Inicial (Estación en Piloto Automático)',
      createdAt: new Date().toISOString(),
      fs: deepClone(fs),
      processes: deepClone(processes),
      edrResolutions: deepClone(edrResolutions),
      notes: 'Punto de partida antes de iniciar las investigaciones de seguridad.',
    };
    this.state.snapshots.push(initialSnapshot);
  }

  public getState = (): Lab1State => {
    return this.state;
  };

  public subscribe = (listener: (state: Lab1State) => void): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private notify(): void {
    const currentState = this.state;
    for (const listener of this.listeners) {
      try {
        listener(currentState);
      } catch (err) {
        console.error('[Lab1Store] Error in state listener:', err);
      }
    }
  }

  private updateState(
    newFs: Record<string, FSNode>,
    newProcesses: SystemProcess[],
    newEdrResolutions: Record<string, boolean>,
    newSnapshots?: LabSnapshot[],
  ): void {
    this.state = buildFullState(
      newFs,
      newProcesses,
      newEdrResolutions,
      newSnapshots ?? this.state.snapshots,
      this.state.currentUser,
      this.state.cwd,
      this.state.hostname,
    );
    this.notify();
  }

  // =========================================================================
  // File System Mutators
  // =========================================================================

  public readFile = (path: string, user: string = this.state.currentUser): MutatorResult => {
    const normalized = this.normalizePath(path);
    const node = this.state.fs[normalized];

    if (!node) {
      return { success: false, error: `cat: ${path}: No existe el archivo o el directorio` };
    }

    if (node.type === 'dir') {
      return { success: false, error: `cat: ${path}: Es un directorio` };
    }

    // Permission check
    if (user !== 'root') {
      const perms = node.perms;
      const isOwner = user === node.owner;
      const readBit = isOwner
        ? perms.charAt(0) === '4' || perms.charAt(0) === '5' || perms.charAt(0) === '6' || perms.charAt(0) === '7'
        : perms.charAt(2) === '4' || perms.charAt(2) === '5' || perms.charAt(2) === '6' || perms.charAt(2) === '7';

      if (!readBit) {
        return { success: false, error: `cat: ${path}: Permiso denegado` };
      }
    }

    return { success: true, content: node.content ?? '' };
  };

  public writeFile = (path: string, content: string, user: string = this.state.currentUser): MutatorResult => {
    const normalized = this.normalizePath(path);
    const fs = { ...this.state.fs };
    const existing = fs[normalized];

    // Check parent directory exists
    const parentPath = this.getParentPath(normalized);
    if (parentPath !== '/' && !fs[parentPath]) {
      return { success: false, error: `No se puede escribir en '${path}': El directorio padre no existe` };
    }

    if (existing && existing.type === 'dir') {
      return { success: false, error: `No se puede escribir en '${path}': Es un directorio` };
    }

    // Permissions check on existing file
    if (existing && user !== 'root') {
      const perms = existing.perms;
      const isOwner = user === existing.owner;
      const writeBit = isOwner
        ? perms.charAt(0) === '2' || perms.charAt(0) === '3' || perms.charAt(0) === '6' || perms.charAt(0) === '7'
        : perms.charAt(2) === '2' || perms.charAt(2) === '3' || perms.charAt(2) === '6' || perms.charAt(2) === '7';

      if (!writeBit) {
        return { success: false, error: `No se puede escribir en '${path}': Permiso denegado` };
      }
    }

    const sha256 = computeSha256(content);
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    fs[normalized] = {
      type: 'file',
      perms: existing ? existing.perms : '644',
      owner: existing ? existing.owner : user,
      group: existing ? existing.group : user,
      size: content.length,
      modified: now,
      magic: 'ASCII text',
      sha256,
      content,
    };

    this.updateState(fs, this.state.processes, this.state.edrResolutions);
    return { success: true, message: `Archivo '${path}' guardado correctamente (${content.length} bytes).` };
  };

  public deleteNode = (path: string, recursive = false, user: string = this.state.currentUser): MutatorResult => {
    const normalized = this.normalizePath(path);
    const fs = { ...this.state.fs };
    const target = fs[normalized];

    if (!target) {
      return { success: false, error: `rm: no se puede borrar '${path}': No existe el archivo o el directorio` };
    }

    if (normalized === '/') {
      return { success: false, error: 'rm: es peligroso operar recursivamente en /' };
    }

    // Check write permissions in parent directory unless root
    if (user !== 'root' && target.owner !== user) {
      return { success: false, error: `rm: no se puede borrar '${path}': Permiso denegado` };
    }

    if (target.type === 'dir') {
      if (!recursive) {
        return { success: false, error: `rm: no se puede borrar '${path}': Es un directorio (use -r)` };
      }

      // Delete directory and all children matching path prefix
      const prefix = normalized === '/' ? '/' : normalized + '/';
      for (const key of Object.keys(fs)) {
        if (key === normalized || key.startsWith(prefix)) {
          delete fs[key];
        }
      }
    } else {
      delete fs[normalized];
    }

    this.updateState(fs, this.state.processes, this.state.edrResolutions);
    return { success: true, message: `Nodo '${path}' eliminado.` };
  };

  public chmod = (path: string, perms: string, user: string = this.state.currentUser): MutatorResult => {
    const normalized = this.normalizePath(path);
    const fs = { ...this.state.fs };
    const target = fs[normalized];

    if (!target) {
      return { success: false, error: `chmod: no se puede acceder a '${path}': No existe el archivo o el directorio` };
    }

    // Permission to chmod requires root or owner
    if (user !== 'root' && target.owner !== user) {
      return { success: false, error: `chmod: cambiando permisos de '${path}': Operación no permitida` };
    }

    // Clean and validate octal format (e.g. 777, 600, 0777, 1777, 000)
    let cleanPerms = perms.trim();
    if (cleanPerms.startsWith('0') && cleanPerms.length === 4) {
      cleanPerms = cleanPerms.slice(1);
    }

    if (!/^[0-7]{3,4}$/.test(cleanPerms)) {
      return { success: false, error: `chmod: modo no válido: '${perms}'` };
    }

    // Normalize 4 digits to 3 if first digit is 0
    if (cleanPerms.length === 4 && cleanPerms.startsWith('0')) {
      cleanPerms = cleanPerms.slice(1);
    }

    fs[normalized] = {
      ...target,
      perms: cleanPerms,
      modified: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    this.updateState(fs, this.state.processes, this.state.edrResolutions);
    return { success: true, message: `Permisos de '${path}' actualizados a ${cleanPerms}.` };
  };

  public chown = (path: string, owner: string, group?: string, user: string = this.state.currentUser): MutatorResult => {
    const normalized = this.normalizePath(path);
    const fs = { ...this.state.fs };
    const target = fs[normalized];

    if (!target) {
      return { success: false, error: `chown: no se puede acceder a '${path}': No existe el archivo o el directorio` };
    }

    if (user !== 'root') {
      return { success: false, error: `chown: cambiando el propietario de '${path}': Operación no permitida` };
    }

    fs[normalized] = {
      ...target,
      owner,
      group: group ?? target.group,
      modified: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    this.updateState(fs, this.state.processes, this.state.edrResolutions);
    return { success: true, message: `Propietario de '${path}' cambiado a ${owner}:${group ?? target.group}.` };
  };

  public createDir = (
    path: string,
    perms = '755',
    owner: string = this.state.currentUser,
    group: string = this.state.currentUser,
  ): MutatorResult => {
    const normalized = this.normalizePath(path);
    const fs = { ...this.state.fs };

    if (fs[normalized]) {
      return { success: false, error: `mkdir: no se puede crear el directorio '${path}': El archivo ya existe` };
    }

    fs[normalized] = {
      type: 'dir',
      perms,
      owner,
      group,
      size: 4096,
      modified: new Date().toISOString().replace('T', ' ').slice(0, 19),
      magic: 'directory',
    };

    this.updateState(fs, this.state.processes, this.state.edrResolutions);
    return { success: true, message: `Directorio '${path}' creado.` };
  };

  public copyNode = (srcPath: string, destPath: string, user: string = this.state.currentUser): MutatorResult => {
    const normalizedSrc = this.normalizePath(srcPath);
    const normalizedDest = this.normalizePath(destPath);
    const fs = { ...this.state.fs };
    const srcNode = fs[normalizedSrc];

    if (!srcNode) {
      return { success: false, error: `cp: no se puede obtener el estado de '${srcPath}': No existe el archivo o el directorio` };
    }

    let finalDest = normalizedDest;
    const destNode = fs[normalizedDest];
    if (destNode && destNode.type === 'dir') {
      const srcBase = normalizedSrc.split('/').pop() || '';
      finalDest = normalizedDest === '/' ? `/${srcBase}` : `${normalizedDest}/${srcBase}`;
    }

    fs[finalDest] = {
      ...srcNode,
      owner: user,
      group: user,
      modified: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };

    this.updateState(fs, this.state.processes, this.state.edrResolutions);
    return { success: true, message: `'${srcPath}' copiado a '${finalDest}'.` };
  };

  public moveNode = (srcPath: string, destPath: string, user: string = this.state.currentUser): MutatorResult => {
    const copyRes = this.copyNode(srcPath, destPath, user);
    if (!copyRes.success) return copyRes;
    this.deleteNode(srcPath, true, user);
    return { success: true, message: `'${srcPath}' movido a '${destPath}'.` };
  };

  public getFileMagic = (path: string): string => {
    const normalized = this.normalizePath(path);
    const node = this.state.fs[normalized];
    if (!node) {
      return `${path}: cannot open (No such file or directory)`;
    }
    return `${path}: ${node.magic}`;
  };

  public getFileSha256 = (path: string): string | undefined => {
    const normalized = this.normalizePath(path);
    const node = this.state.fs[normalized];
    return node?.sha256;
  };

  // =========================================================================
  // Process & Service Mutators
  // =========================================================================

  public killProcess = (pid: number, signal: 9 | 15 = 15, user: string = this.state.currentUser): MutatorResult => {
    const processes = [...this.state.processes];
    const targetIdx = processes.findIndex((p) => p.pid === pid);

    if (targetIdx === -1) {
      return { success: false, error: `kill: (${pid}) - No existe tal proceso` };
    }

    const proc = processes[targetIdx];
    if (proc.status === 'dead') {
      return { success: false, error: `kill: (${pid}) - El proceso ya está detenido` };
    }

    if (user !== 'root' && proc.user !== user) {
      return { success: false, error: `kill: (${pid}) - Operación no permitida` };
    }

    // Termination handling
    let shutdownMessage = '';
    if (proc.command.includes('polilla_emisora')) {
      if (signal === 15) {
        shutdownMessage = `polilla_emisora[${pid}]: SIGTERM recibido. Cerrando sockets y limpiando descriptores... Proceso finalizado.`;
      } else {
        shutdownMessage = `polilla_emisora[${pid}]: Proceso terminado de forma forzada por señal SIGKILL.`;
      }
    } else {
      shutdownMessage = `Proceso ${pid} (${proc.command.split(' ')[0]}) terminado con señal SIG${signal === 9 ? 'KILL' : 'TERM'}.`;
    }

    // Update process status and clear port
    processes[targetIdx] = {
      ...proc,
      status: 'dead',
      cpu: 0,
      mem: 0,
      port: undefined,
    };

    // Append log event to /var/log/syslog if fs has it
    const fs = { ...this.state.fs };
    const syslog = fs['/var/log/syslog'];
    if (syslog && syslog.content) {
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      syslog.content += `\n[${now}] invernadero-central kernel: ${shutdownMessage}`;
    }

    this.updateState(fs, processes, this.state.edrResolutions);
    return { success: true, message: shutdownMessage };
  };

  public startService = (serviceName: string, user: string = this.state.currentUser): MutatorResult => {
    if (user !== 'root') {
      return { success: false, error: 'Acceso denegado: Se requieren privilegios de superusuario (sudo systemctl).' };
    }

    const cleanName = serviceName.endsWith('.service') ? serviceName : `${serviceName}.service`;
    const processes = [...this.state.processes];
    const targetIdx = processes.findIndex((p) => p.serviceName === cleanName);

    if (targetIdx === -1) {
      return { success: false, error: `Failed to start ${cleanName}: Unit ${cleanName} not found.` };
    }

    const proc = processes[targetIdx];
    if (proc.status === 'running') {
      return { success: true, message: `El servicio ${cleanName} ya está activo y en ejecución.` };
    }

    // Service-specific reactivation parameters
    let newCpu = 0.2;
    let newMem = 0.8;
    let newPort = proc.port;

    if (cleanName === 'ntp.service') {
      newPort = 123;
      newCpu = 0.1;
      newMem = 0.4;
    } else if (cleanName === 'nginx.service') {
      newPort = 80;
      newCpu = 1.2;
      newMem = 2.5;
    } else if (cleanName === 'ssh.service') {
      newPort = 22;
      newCpu = 0.3;
      newMem = 1.1;
    } else if (cleanName === 'telnet.service') {
      newPort = 23;
      newCpu = 0.2;
      newMem = 0.6;
    }

    processes[targetIdx] = {
      ...proc,
      pid: proc.pid === 0 ? Math.floor(Math.random() * 2000) + 1000 : proc.pid,
      status: 'running',
      cpu: newCpu,
      mem: newMem,
      port: newPort,
    };

    // Append to syslog
    const fs = { ...this.state.fs };
    const syslog = fs['/var/log/syslog'];
    if (syslog && syslog.content) {
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      syslog.content += `\n[${now}] invernadero-central systemd[1]: Started ${cleanName}.`;
    }

    this.updateState(fs, processes, this.state.edrResolutions);
    return { success: true, message: `Servicio ${cleanName} iniciado correctamente.` };
  };

  public stopService = (serviceName: string, user: string = this.state.currentUser): MutatorResult => {
    if (user !== 'root') {
      return { success: false, error: 'Acceso denegado: Se requieren privilegios de superusuario (sudo systemctl).' };
    }

    const cleanName = serviceName.endsWith('.service') ? serviceName : `${serviceName}.service`;
    const processes = [...this.state.processes];
    const targetIdx = processes.findIndex((p) => p.serviceName === cleanName);

    if (targetIdx === -1) {
      return { success: false, error: `Failed to stop ${cleanName}: Unit ${cleanName} not loaded.` };
    }

    const proc = processes[targetIdx];
    processes[targetIdx] = {
      ...proc,
      status: 'dead',
      cpu: 0,
      mem: 0,
    };

    // Append to syslog
    const fs = { ...this.state.fs };
    const syslog = fs['/var/log/syslog'];
    if (syslog && syslog.content) {
      const now = new Date().toISOString().replace('T', ' ').slice(0, 19);
      syslog.content += `\n[${now}] invernadero-central systemd[1]: Stopped ${cleanName}.`;
    }

    this.updateState(fs, processes, this.state.edrResolutions);
    return { success: true, message: `Servicio ${cleanName} detenido.` };
  };

  public restartService = (serviceName: string, user: string = this.state.currentUser): MutatorResult => {
    this.stopService(serviceName, user);
    return this.startService(serviceName, user);
  };

  // =========================================================================
  // EDR & Resolution Mutators
  // =========================================================================

  public markEdrResolution = (
    alertId: string,
    action: 'allow_false_positive' | 'quarantine' | 'terminate',
  ): MutatorResult => {
    const resolutions = { ...this.state.edrResolutions };

    if (action === 'allow_false_positive') {
      resolutions[alertId] = true;
      this.updateState(this.state.fs, this.state.processes, resolutions);
      return { success: true, message: `Alerta ${alertId} marcada como Falso Positivo (Actividad Legítima Validada).` };
    }

    if (action === 'terminate') {
      if (alertId === 'EDR-THREAT-01') {
        const threat = this.state.processes.find((p) => p.command.includes('polilla_emisora'));
        if (threat) {
          return this.killProcess(threat.pid, 15, 'root');
        }
      }
    }

    if (action === 'quarantine') {
      if (alertId === 'EDR-FILE-03') {
        this.createDir('/root/cuarentena', '700', 'root', 'root');
        return this.moveNode('/tmp/catalogo_orquideas.pdf', '/root/cuarentena/catalogo_orquideas.pdf', 'root');
      }
    }

    return { success: false, error: `Acción '${action}' no reconocida para ${alertId}` };
  };

  // =========================================================================
  // Network & SSH Mutators
  // =========================================================================

  public checkSshClientAccess = (
    keyPath = '/home/cuidador/.ssh/id_ed25519',
  ): { allowed: boolean; warning?: string } => {
    const normalized = this.normalizePath(keyPath);
    const keyNode = this.state.fs[normalized];

    if (!keyNode) {
      return { allowed: false, warning: `ssh: No existe el archivo de clave privada: ${keyPath}` };
    }

    if (keyNode.perms === '777' || keyNode.perms.endsWith('7') || keyNode.perms.endsWith('6') || keyNode.perms.endsWith('4')) {
      const banner = `@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Permissions 0${keyNode.perms} for '${keyPath}' are too open.
It is required that your private key files are NOT accessible by others.
This private key will be ignored.
Load key "${keyPath}": bad permissions
Permission denied (publickey).`;
      return { allowed: false, warning: banner };
    }

    return { allowed: true };
  };

  public resolveDomain = (domain: string): string | null => {
    // 1. Check if DNS server in resolv.conf is rogue 10.66.6.6
    if (this.state.dnsServer === '10.66.6.6') {
      if (domain.includes('invernadero') || domain.includes('boveda')) {
        // Hijacked redirection to malicious C2 server
        return '198.51.100.44';
      }
    }

    // 2. Check /etc/hosts file
    const hostsNode = this.state.fs['/etc/hosts'];
    if (hostsNode?.content) {
      const lines = hostsNode.content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('#') || !trimmed) continue;
        const parts = trimmed.split(/\s+/);
        if (parts.length >= 2) {
          const ip = parts[0];
          const hostnames = parts.slice(1);
          if (hostnames.includes(domain)) {
            return ip;
          }
        }
      }
    }

    // 3. Fallback standard local resolution
    if (domain === 'localhost' || domain === 'invernadero-central') {
      return '127.0.0.1';
    }

    return null;
  };

  // =========================================================================
  // Snapshot & Time Travel Mutators
  // =========================================================================

  public createSnapshot = (label?: string): LabSnapshot => {
    const count = this.state.snapshots.length + 1;
    const now = new Date().toISOString();
    const snapshot: LabSnapshot = {
      id: `snapshot-${Date.now()}`,
      label: label ?? `Snapshot N.º ${count} (${now.slice(11, 19)})`,
      createdAt: now,
      fs: deepClone(this.state.fs),
      processes: deepClone(this.state.processes),
      edrResolutions: deepClone(this.state.edrResolutions),
      notes: `Snapshot manual con ${Object.keys(this.state.fs).length} archivos y ${this.state.processes.length} procesos.`,
    };

    const newSnapshots = [...this.state.snapshots, snapshot];
    this.updateState(this.state.fs, this.state.processes, this.state.edrResolutions, newSnapshots);
    return snapshot;
  };

  public restoreSnapshot = (snapshotIdOrIndex: string | number): boolean => {
    let target: LabSnapshot | undefined;

    if (typeof snapshotIdOrIndex === 'number') {
      target = this.state.snapshots[snapshotIdOrIndex];
    } else {
      target = this.state.snapshots.find((s) => s.id === snapshotIdOrIndex);
    }

    if (!target) {
      console.warn(`[Lab1Store] Snapshot '${snapshotIdOrIndex}' no encontrado.`);
      return false;
    }

    // Rewind state back to the snapshot's state
    this.updateState(
      deepClone(target.fs),
      deepClone(target.processes),
      deepClone(target.edrResolutions),
      this.state.snapshots,
    );
    return true;
  };

  public getSnapshots = (): LabSnapshot[] => {
    return this.state.snapshots;
  };

  public deleteSnapshot = (snapshotId: string): boolean => {
    const filtered = this.state.snapshots.filter((s) => s.id !== snapshotId);
    if (filtered.length === this.state.snapshots.length) return false;
    this.updateState(this.state.fs, this.state.processes, this.state.edrResolutions, filtered);
    return true;
  };

  public resetToPristine = (): void => {
    const fs = createInitialFileSystem();
    const processes = createInitialProcesses();
    const edrResolutions: Record<string, boolean> = {};
    this.state.currentUser = 'operario';
    this.state.cwd = '/home/operario';
    this.updateState(fs, processes, edrResolutions, this.state.snapshots);
  };

  // =========================================================================
  // Session Mutators
  // =========================================================================

  public setCurrentUser = (user: string): void => {
    this.state = { ...this.state, currentUser: user };
    this.notify();
  };

  public setCwd = (path: string): void => {
    this.state = { ...this.state, cwd: this.normalizePath(path) };
    this.notify();
  };

  // =========================================================================
  // Path Resolution Helpers
  // =========================================================================

  private normalizePath(rawPath: string): string {
    let p = rawPath.trim();
    if (!p) return this.state.cwd;

    if (p.startsWith('~/')) {
      p = `/home/${this.state.currentUser}/${p.slice(2)}`;
    } else if (p === '~') {
      p = `/home/${this.state.currentUser}`;
    } else if (!p.startsWith('/')) {
      p = this.state.cwd === '/' ? `/${p}` : `${this.state.cwd}/${p}`;
    }

    // Resolve . and ..
    const parts = p.split('/').filter(Boolean);
    const stack: string[] = [];
    for (const part of parts) {
      if (part === '.') continue;
      if (part === '..') {
        stack.pop();
      } else {
        stack.push(part);
      }
    }

    return '/' + stack.join('/');
  }

  private getParentPath(path: string): string {
    if (path === '/') return '/';
    const parts = path.split('/').filter(Boolean);
    parts.pop();
    return '/' + parts.join('/');
  }
}

/**
 * Singleton Store Instance
 */
export const lab1Store = new Lab1Store();

/**
 * React 19 Custom Hook for React Components
 * Provides tearing-free, flicker-free external store synchronization.
 */
export function useLab1Store<T = Lab1State>(selector: (state: Lab1State) => T = (s) => s as unknown as T): T {
  return useSyncExternalStore(
    lab1Store.subscribe,
    () => selector(lab1Store.getState()),
    () => selector(lab1Store.getState()),
  );
}
