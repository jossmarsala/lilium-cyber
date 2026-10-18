import type {
  FSNode,
  SystemProcess,
  CiaTriadEvaluation,
  GreenhouseTelemetry,
  SiemEvent,
  EdrDetectionAlert,
  NetworkSocket,
} from './types';
import { HASH_CALIBRACION_V1, HASH_CALIBRACION_V2 } from './initialFs';

/**
 * Evaluates the CIA Triad (Confidencialidad, Integridad, Disponibilidad)
 * based strictly on the current virtual filesystem and process table.
 */
export function evaluateCiaTriad(
  fs: Record<string, FSNode>,
  processes: SystemProcess[],
): CiaTriadEvaluation {
  // -----------------------------------------------------------------
  // 1. Confidentiality (Confidencialidad)
  // -----------------------------------------------------------------
  let confScore = 100;
  const confFindings: string[] = [];

  const shadowNode = fs['/etc/shadow'];
  if (!shadowNode) {
    confScore -= 40;
    confFindings.push('Archivo /etc/shadow eliminado o inaccesible.');
  } else if (shadowNode.perms === '777' || shadowNode.perms.endsWith('7') || shadowNode.perms.endsWith('6') || shadowNode.perms.endsWith('4')) {
    confScore -= 35;
    confFindings.push('Permisos excesivos en /etc/shadow (' + shadowNode.perms + '): los hashes de contraseñas son legibles por cualquier usuario.');
  }

  const sshKeyNode = fs['/home/cuidador/.ssh/id_ed25519'];
  if (sshKeyNode && sshKeyNode.perms === '777') {
    confScore -= 30;
    confFindings.push('Clave privada SSH (~/.ssh/id_ed25519) con permisos 777: OpenSSH la rechaza por estar abierta al mundo.');
  }

  const telnetProc = processes.find((p) => p.serviceName === 'telnet.service' && p.status === 'running');
  if (telnetProc) {
    confScore -= 20;
    confFindings.push('Servicio obsoleto Telnet (puerto 23) activo transmitiendo credenciales en texto plano sin cifrado.');
  }

  const sshdConfig = fs['/etc/ssh/sshd_config'];
  if (sshdConfig && sshdConfig.content?.includes('PermitRootLogin yes')) {
    confScore -= 10;
    confFindings.push('Directiva "PermitRootLogin yes" activa en /etc/ssh/sshd_config (permite inicio directo interactivo de root).');
  }

  const resolvNode = fs['/etc/resolv.conf'];
  if (resolvNode && resolvNode.content?.includes('10.66.6.6')) {
    confScore -= 5;
    confFindings.push('Servidor DNS no confiable configurado en /etc/resolv.conf (10.66.6.6).');
  }

  confScore = Math.max(0, Math.min(100, confScore));
  const confStatus: 'optimal' | 'warning' | 'critical' =
    confScore >= 85 ? 'optimal' : confScore >= 50 ? 'warning' : 'critical';

  // -----------------------------------------------------------------
  // 2. Integrity (Integridad)
  // -----------------------------------------------------------------
  let intScore = 100;
  const intFindings: string[] = [];

  const activeCalibration = fs['/opt/sensores/calibracion_riego.conf'];
  if (!activeCalibration) {
    intScore -= 40;
    intFindings.push('Archivo de calibración de riego ausente en /opt/sensores/calibracion_riego.conf.');
  } else if (activeCalibration.sha256 === HASH_CALIBRACION_V2) {
    intScore -= 35;
    intFindings.push('Calibración de riego adulterada (hash coincide con respaldo tóxico v2: pH 3.1 ácido e inundación al 99%).');
  } else if (activeCalibration.sha256 !== HASH_CALIBRACION_V1) {
    intScore -= 20;
    intFindings.push('La calibración activa de riego no coincide con el hash SHA-256 oficial del cuaderno de campo (' + HASH_CALIBRACION_V1.slice(0, 16) + '...).');
  }

  const masqueradedPdf = fs['/tmp/catalogo_orquideas.pdf'];
  if (masqueradedPdf && masqueradedPdf.magic.includes('ELF')) {
    intScore -= 25;
    intFindings.push('Binario ejecutable malicioso camuflado como archivo PDF detectado en /tmp/catalogo_orquideas.pdf.');
  }

  const dropScript = fs['/tmp/.semilla_rara.sh'];
  if (dropScript) {
    intScore -= 15;
    intFindings.push('Script dropper oculto detectado en /tmp/.semilla_rara.sh con comandos de conexión remota.');
  }

  const threatProc = processes.find((p) => p.command.includes('polilla_emisora') && p.status === 'running');
  if (threatProc) {
    intScore -= 25;
    intFindings.push('Proceso intruso activo (polilla_emisora, PID ' + threatProc.pid + ') alterando la telemetría del host.');
  }

  intScore = Math.max(0, Math.min(100, intScore));
  const intStatus: 'optimal' | 'warning' | 'critical' =
    intScore >= 85 ? 'optimal' : intScore >= 50 ? 'warning' : 'critical';

  // -----------------------------------------------------------------
  // 3. Availability (Disponibilidad)
  // -----------------------------------------------------------------
  let availScore = 100;
  const availFindings: string[] = [];

  const nginxProc = processes.find((p) => p.serviceName === 'nginx.service' && p.status === 'running');
  if (!nginxProc) {
    availScore -= 45;
    availFindings.push('Servidor Web Nginx inactivo: el panel de control del domo responde con 503 Conexión Rechazada.');
  }

  const webIndexNode = fs['/var/www/invernadero/index.html'];
  if (!webIndexNode) {
    availScore -= 25;
    availFindings.push('Página principal web no encontrada en /var/www/invernadero/index.html.');
  } else if (webIndexNode.perms === '000' || webIndexNode.perms === '200' || webIndexNode.perms === '300') {
    availScore -= 25;
    availFindings.push('Permisos restrictivos (' + webIndexNode.perms + ') en index.html impiden al servidor web leer el archivo (403 Forbidden).');
  }

  if (threatProc && threatProc.cpu > 50) {
    availScore -= 20;
    availFindings.push('Procesador sobrecargado por polilla_emisora (' + threatProc.cpu + '% CPU), provocando aceleración extrema de ventiladores.');
  }

  const fernScript = fs['/opt/sensores/riego_nocturno.sh'];
  if (!fernScript) {
    availScore -= 10;
    availFindings.push('Script de riego nocturno de helechos eliminado: riesgo de sequía en bancal de pteridofitas.');
  }

  availScore = Math.max(0, Math.min(100, availScore));
  const availStatus: 'optimal' | 'warning' | 'critical' =
    availScore >= 85 ? 'optimal' : availScore >= 50 ? 'warning' : 'critical';

  const overallScore = Math.round((confScore + intScore + availScore) / 3);

  return {
    confidentiality: {
      score: confScore,
      status: confStatus,
      title: 'Confidencialidad',
      summary:
        confScore === 100
          ? 'Claves y hashes protegidos. Superficie de red blindada con SSH.'
          : 'Contraseñas expuestas o canales de texto claro abiertos en la red.',
      findings: confFindings,
    },
    integrity: {
      score: intScore,
      status: intStatus,
      title: 'Integridad',
      summary:
        intScore === 100
          ? 'Calibraciones de riego validadas por SHA-256. Directorio /tmp limpio.'
          : 'Parámetros químicos adulterados o ejecutables troyanizados en el disco.',
      findings: intFindings,
    },
    availability: {
      score: availScore,
      status: availStatus,
      title: 'Disponibilidad',
      summary:
        availScore === 100
          ? 'Panel web del invernadero en línea. Telemetría y ciclos de riego fluidos.'
          : 'Servidor web fuera de línea o CPU saturada al límite de sobrecalentamiento.',
      findings: availFindings,
    },
    overallScore,
  };
}

/**
 * Evaluates the Greenhouse Domo state and Botanical Telemetry
 */
export function evaluateGreenhouseTelemetry(
  fs: Record<string, FSNode>,
  processes: SystemProcess[],
  cia: CiaTriadEvaluation,
): GreenhouseTelemetry {
  const nginxProc = processes.find((p) => p.serviceName === 'nginx.service' && p.status === 'running');
  const webIndex = fs['/var/www/invernadero/index.html'];
  const threatProc = processes.find((p) => p.command.includes('polilla_emisora') && p.status === 'running');
  const calibration = fs['/opt/sensores/calibracion_riego.conf'];

  // Determine Web Panel HTTP Response Code
  let webPanelHttpCode: 200 | 403 | 503 = 200;
  let webPanelMessage = '200 OK: Panel de Telemetría Botánica y Domo Central en línea.';

  if (!nginxProc) {
    webPanelHttpCode = 503;
    webPanelMessage = '503 Conexión Rechazada: El servidor web central (nginx.service) está detenido o no responde.';
  } else if (!webIndex || webIndex.perms === '000' || webIndex.perms === '200' || webIndex.perms === '300') {
    webPanelHttpCode = 403;
    webPanelMessage = '403 Prohibido (Forbidden): Permisos insuficientes para leer /var/www/invernadero/index.html. El proceso www-data carece de acceso de lectura.';
  }

  // Cooling Fans & CPU Load
  const coolingFansRpm = threatProc ? 9800 : 1200;
  const uvLampState = threatProc ? 'flickering' : 'calm';

  // Irrigation state & plant condition based on calibration hash
  let irrigationPumpState: 'optimal' | 'toxic_flooding' | 'drought_stopped' = 'optimal';
  let humidityPercent = 68;
  let temperatureC = 22.4;

  if (!calibration) {
    irrigationPumpState = 'drought_stopped';
    humidityPercent = 38;
  } else if (calibration.sha256 === HASH_CALIBRACION_V2) {
    irrigationPumpState = 'toxic_flooding';
    humidityPercent = 99;
  } else if (calibration.sha256 === HASH_CALIBRACION_V1) {
    irrigationPumpState = 'optimal';
    humidityPercent = 68;
  } else {
    irrigationPumpState = 'optimal';
    humidityPercent = 75;
  }

  if (threatProc) {
    temperatureC = 28.6; // CPU heat radiates into dome
  }

  const isFlooded = irrigationPumpState === 'toxic_flooding';
  const isHealthy = irrigationPumpState === 'optimal' && cia.integrity.score >= 85;

  const specimens = [
    {
      id: 'planta-01',
      commonName: 'Orquídea Fantasma de Señal',
      scientificName: 'Dendrophylax lindenii var. radio',
      healthPercent: isFlooded ? 28 : isHealthy ? 98 : 65,
      status: isFlooded ? ('critical_danger' as const) : isHealthy ? ('flourishing' as const) : ('stressed' as const),
      targetMoisture: '68.0%',
      currentMoisture: `${humidityPercent}.0%`,
      targetPh: '6.4 pH',
      notes: isFlooded
        ? 'Inundación por exceso de acidez y sales minerales (pH 3.1). Las raíces epífitas se están pudriendo por la calibración tóxica v2.'
        : isHealthy
        ? 'Brotación translúcida saludable. Emisión tenue de bioluminiscencia en sintonía con las señales del domo.'
        : 'Estrés hídrico moderado. Esperando ajuste de calibración de nutrientes.',
    },
    {
      id: 'planta-02',
      commonName: 'Helecho Arbóreo Milenario',
      scientificName: 'Cyathea cooperi antiqua',
      healthPercent: isFlooded ? 45 : isHealthy ? 95 : 70,
      status: isFlooded ? ('critical_danger' as const) : isHealthy ? ('flourishing' as const) : ('stressed' as const),
      targetMoisture: '70-75%',
      currentMoisture: `${humidityPercent}.0%`,
      targetPh: '6.2 pH',
      notes: isFlooded
        ? 'Hojas quemadas por nitrógeno concentrado (850 ppm). Desecación química en los extremos de las frondas.'
        : isHealthy
        ? 'Frondas abiertas y dispersión normal de esporas nocturnas. El script de riego benigno nutre el bancal sin anomalías.'
        : 'Comportamiento estable pero con fluctuaciones de humedad en suelo.',
    },
    {
      id: 'planta-03',
      commonName: 'Bóveda de Semillas Criogénicas',
      scientificName: 'Banco Germoplasma Estación 4',
      healthPercent: cia.availability.score < 50 ? 50 : 100,
      status: cia.availability.score < 50 ? ('stressed' as const) : ('flourishing' as const),
      targetMoisture: '15.0%',
      currentMoisture: '14.8%',
      targetPh: 'Neutro (7.0)',
      notes:
        cia.availability.score < 50
          ? 'Alerta térmica: La caída del servidor y los ventiladores al 100% comprometen el aislamiento del banco criogénico.'
          : 'Contenedores sellados a -18 °C. La colección de 42 especies raras permanece intacta y protegida.',
    },
  ];

  const domoState: 'online' | 'degraded' | 'offline' =
    webPanelHttpCode === 503
      ? 'offline'
      : isFlooded || threatProc
      ? 'degraded'
      : 'online';

  return {
    domoState,
    webPanelHttpCode,
    webPanelMessage,
    temperatureC,
    humidityPercent,
    coolingFansRpm,
    uvLampState,
    irrigationPumpState,
    specimens,
  };
}

/**
 * Evaluates SIEM correlated log events.
 * Key reactive behavior:
 * If ntp.service is dead -> timestamps are scrambled (1999 vs 2026), warning of clock drift.
 * If ntp.service is running -> timestamps are chronologically ordered and normalized.
 */
export function evaluateSiemEvents(
  processes: SystemProcess[],
  isNtpSynced: boolean,
): SiemEvent[] {
  const telnetProc = processes.find((p) => p.serviceName === 'telnet.service' && p.status === 'running');

  // Baseline authentic events chronologically arranged
  const rawEvents: Array<{
    id: string;
    tsNormal: string;
    tsScrambled: string;
    origin: SiemEvent['origin'];
    severity: SiemEvent['severity'];
    event: string;
    rawLog: string;
    evidenceDetail: string;
    ruleId: string;
    mitreTechnique: string;
    sourceIp?: string;
    destPort?: number;
    isCleartextLeak?: boolean;
  }> = [
    {
      id: 'SIEM-001',
      tsNormal: '2026-10-16 02:14:02',
      tsScrambled: '1999-12-31 23:59:12',
      origin: 'Auth Log',
      severity: 'Alta',
      event: 'Intento de conexión SSH entrante desde IP no autorizada',
      rawLog: 'Oct 16 02:14:02 invernadero-central sshd[712]: Connection from 198.51.100.44 port 54112 on 0.0.0.0:22',
      evidenceDetail: 'Múltiples handshakes TCP rechazados contra el puerto 22.',
      ruleId: 'ARGOS-SSH-UNAUTH',
      mitreTechnique: 'T1021.004 — SSH',
      sourceIp: '198.51.100.44',
      destPort: 22,
    },
    {
      id: 'SIEM-002',
      tsNormal: '2026-10-16 02:14:06',
      tsScrambled: '1999-01-01 00:00:04',
      origin: 'Auth Log',
      severity: 'Alta',
      event: 'Fuerza bruta fallida contra cuenta root en SSH',
      rawLog: 'Oct 16 02:14:06 invernadero-central sshd[715]: Failed password for root from 198.51.100.44 port 54116 ssh2',
      evidenceDetail: 'Tres intentos continuos con contraseñas del diccionario común.',
      ruleId: 'ARGOS-AUTH-BRUTEFORCE',
      mitreTechnique: 'T1110.001 — Password Guessing',
      sourceIp: '198.51.100.44',
      destPort: 22,
    },
    {
      id: 'SIEM-003',
      tsNormal: '2026-10-16 02:15:22',
      tsScrambled: '2026-10-16 02:15:22',
      origin: 'Red / Zeek',
      severity: 'Crítica',
      event: 'Conexión entrante a servicio obsoleto Telnet (puerto 23)',
      rawLog: 'Oct 16 02:15:22 invernadero-central in.telnetd[842]: connect from 198.51.100.44 to 0.0.0.0:23',
      evidenceDetail: 'Handshake TCP completado en socket no cifrado :23.',
      ruleId: 'ARGOS-NET-TELNET',
      mitreTechnique: 'T1021.002 — Remote Services',
      sourceIp: '198.51.100.44',
      destPort: 23,
    },
    {
      id: 'SIEM-004',
      tsNormal: '2026-10-16 02:15:30',
      tsScrambled: '1999-06-15 11:22:00',
      origin: 'Auth Log',
      severity: 'Crítica',
      event: 'Inicio de sesión interactivo Telnet con transmisión en texto claro',
      rawLog: 'Oct 16 02:15:30 invernadero-central login[843]: TELNET INSECURE LOGIN: user cuidador authenticated in CLEARTEXT over port 23',
      evidenceDetail: 'Credenciales capturables por cualquier sniffer en tránsito.',
      ruleId: 'ARGOS-TELNET-CLEARTEXT',
      mitreTechnique: 'T1040 — Network Sniffing',
      sourceIp: '198.51.100.44',
      destPort: 23,
      isCleartextLeak: true,
    },
    {
      id: 'SIEM-005',
      tsNormal: '2026-10-16 02:16:01',
      tsScrambled: '2026-10-16 02:16:01',
      origin: 'Syslog / Audit',
      severity: 'Crítica',
      event: 'Modificación de permisos críticos: chmod 777 sobre /etc/shadow',
      rawLog: 'Oct 16 02:16:01 invernadero-central sudo[850]: cuidador : TTY=pts/0 ; COMMAND=/bin/chmod 777 /etc/shadow',
      evidenceDetail: 'Permisos mundiales de lectura y escritura asignados a la base de hashes.',
      ruleId: 'ARGOS-AUDIT-SHADOW',
      mitreTechnique: 'T1222.002 — File Permissions Modification',
    },
    {
      id: 'SIEM-006',
      tsNormal: '2026-10-16 02:18:10',
      tsScrambled: '1999-08-20 04:30:15',
      origin: 'FIM / Integridad',
      severity: 'Alta',
      event: 'Creación de archivo binario camuflado como PDF en /tmp',
      rawLog: 'Oct 16 02:18:10 invernadero-central fim: [DROPPER] /tmp/catalogo_orquideas.pdf created. File magic: ELF 64-bit LSB executable.',
      evidenceDetail: 'El archivo tiene extensión .pdf pero cabecera mágica de ejecutable ELF x86-64.',
      ruleId: 'ARGOS-FIM-MASQUERADE',
      mitreTechnique: 'T1036.008 — Masquerading: File Type Extensions',
    },
    {
      id: 'SIEM-007',
      tsNormal: '2026-10-16 02:18:44',
      tsScrambled: '2026-10-16 02:18:44',
      origin: 'Kernel / eBPF',
      severity: 'Crítica',
      event: 'Baliza C2 establecida en puerto 4444 con 68.4% de CPU',
      rawLog: 'Oct 16 02:18:44 invernadero-central kernel: polilla_emisora[4412]: connection established to 198.51.100.44:4444 (user=www-data, cpu=68.4%)',
      evidenceDetail: 'Socket TCP :4444 activo consumiendo ciclos de procesamiento en el domo.',
      ruleId: 'ARGOS-EBPF-C2',
      mitreTechnique: 'T1071.001 — Web Protocols / Non-Standard C2 Port',
      sourceIp: '198.51.100.44',
      destPort: 4444,
    },
  ];

  // If Telnet service is currently active, insert a live cleartext packet alert
  if (telnetProc) {
    rawEvents.push({
      id: 'SIEM-LIVE-TELNET',
      tsNormal: '2026-10-16 14:28:50',
      tsScrambled: '1999-01-01 00:03:10',
      origin: 'Red / Zeek',
      severity: 'Crítica',
      event: 'Tráfico Telnet en vivo: Fuga continua de credenciales en puerto 23',
      rawLog: 'Oct 16 14:28:50 invernadero-central in.telnetd[842]: [PACKET_CAPTURE] TCP segment captured payload: "PASS *** (plaintext)"',
      evidenceDetail: 'El servicio telnet.service sigue escuchando en 0.0.0.0:23.',
      ruleId: 'ARGOS-LIVE-CLEARTEXT',
      mitreTechnique: 'T1040 — Network Sniffing',
      destPort: 23,
      isCleartextLeak: true,
    });
  }

  // Format and order events based on isNtpSynced
  const mapped = rawEvents.map((e) => ({
    id: e.id,
    timestampOriginal: e.tsNormal,
    timestampDisplay: isNtpSynced ? e.tsNormal : e.tsScrambled,
    origin: e.origin,
    severity: e.severity,
    event: e.event,
    rawLog: e.rawLog,
    evidenceDetail: e.evidenceDetail,
    ruleId: e.ruleId,
    mitreTechnique: e.mitreTechnique,
    sourceIp: e.sourceIp,
    destPort: e.destPort,
    isCleartextLeak: e.isCleartextLeak,
  }));

  if (isNtpSynced) {
    // Sorted strictly chronologically
    return mapped.sort((a, b) => a.timestampOriginal.localeCompare(b.timestampOriginal));
  } else {
    // Return desynchronized order reflecting clock drift
    return mapped;
  }
}

/**
 * Evaluates EDR alerts and biological host telemetry.
 */
export function evaluateEdrAlerts(
  fs: Record<string, FSNode>,
  processes: SystemProcess[],
  edrResolutions: Record<string, boolean>,
): EdrDetectionAlert[] {
  const alerts: EdrDetectionAlert[] = [];

  // 1. Real Threat: polilla_emisora process
  const threatProc = processes.find((p) => p.command.includes('polilla_emisora'));
  const isThreatRunning = threatProc?.status === 'running';
  alerts.push({
    id: 'EDR-THREAT-01',
    title: 'Proceso Intruso No Firmado: polilla_emisora (C2)',
    targetType: 'process',
    targetIdentifier: threatProc ? `PID ${threatProc.pid}` : 'polilla_emisora',
    classification: 'threat',
    severity: 'Crítica',
    heuristicReason: 'Proceso con alto consumo de CPU (68.4%) y conexión persistente al puerto 4444 de 198.51.100.44 bajo el usuario web www-data.',
    investigationTip: 'Inspecciona con "ps aux | grep polilla" y usa "kill -15 <pid>" o "kill -9 <pid>" para terminar la transmisión maliciosa.',
    status: isThreatRunning ? 'Activo (Riesgo)' : 'Contenido (Mitigado)',
    resolved: !isThreatRunning,
  });

  // 2. False Positive: riego_nocturno.sh
  const fpProc = processes.find((p) => p.command.includes('riego_nocturno.sh'));
  const isFpResolved = edrResolutions['EDR-FP-02'] === true;
  alerts.push({
    id: 'EDR-FP-02',
    title: 'Comportamiento Anómalo por Horario: riego_nocturno.sh',
    targetType: 'process',
    targetIdentifier: fpProc ? `PID ${fpProc.pid}` : '/opt/sensores/riego_nocturno.sh',
    classification: 'false_positive',
    severity: 'Media',
    heuristicReason: 'Script invocándose a las 03:00 AM desde cron. Heurística de actividad fuera del horario de oficina disparada.',
    investigationTip: 'Inspecciona el script con "cat /opt/sensores/riego_nocturno.sh". Comprobarás que es un rocío inofensivo de helechos. Márcalo en el EDR como actividad legítima.',
    status: isFpResolved ? 'Actividad Legítima Validada' : 'Activo (Riesgo)',
    resolved: isFpResolved,
    canMarkFalsePositive: true,
  });

  // 3. Masqueraded executable in /tmp
  const disguisedPdf = fs['/tmp/catalogo_orquideas.pdf'];
  const isPdfPresent = disguisedPdf && disguisedPdf.magic.includes('ELF');
  alerts.push({
    id: 'EDR-FILE-03',
    title: 'Extensión Disfrazada: /tmp/catalogo_orquideas.pdf (ELF)',
    targetType: 'file',
    targetIdentifier: '/tmp/catalogo_orquideas.pdf',
    classification: 'threat',
    severity: 'Alta',
    heuristicReason: 'El archivo tiene extensión .pdf pero la firma de bytes corresponde a un binario ejecutable ELF de 64 bits para Linux.',
    investigationTip: 'Verifica con el comando "file /tmp/catalogo_orquideas.pdf" y elimina el artefacto malicioso con "rm".',
    status: isPdfPresent ? 'Activo (Riesgo)' : 'Contenido (Mitigado)',
    resolved: !isPdfPresent,
  });

  // 4. Overly permissive /etc/shadow
  const shadowNode = fs['/etc/shadow'];
  const isShadowOpen = shadowNode && shadowNode.perms === '777';
  alerts.push({
    id: 'EDR-PERM-04',
    title: 'Permisos Inseguros Críticos: /etc/shadow (0777)',
    targetType: 'permission',
    targetIdentifier: '/etc/shadow',
    classification: 'threat',
    severity: 'Crítica',
    heuristicReason: 'Permisos 777 asignados a /etc/shadow. La base de datos de hashes es accesible para cualquier usuario o proceso local.',
    investigationTip: 'Ejecuta "sudo chmod 600 /etc/shadow" para restituir el Mínimo Privilegio.',
    status: isShadowOpen ? 'Activo (Riesgo)' : 'Contenido (Mitigado)',
    resolved: !isShadowOpen,
  });

  // 5. Unprotected SSH Private Key
  const sshKeyNode = fs['/home/cuidador/.ssh/id_ed25519'];
  const isSshKeyOpen = sshKeyNode && sshKeyNode.perms === '777';
  alerts.push({
    id: 'EDR-SSH-05',
    title: 'Clave Criptográfica Desprotegida: ~/.ssh/id_ed25519 (0777)',
    targetType: 'permission',
    targetIdentifier: '/home/cuidador/.ssh/id_ed25519',
    classification: 'threat',
    severity: 'Alta',
    heuristicReason: 'Clave asimétrica privada con permisos 777. Vulnerabilidad que compromete la confidencialidad de acceso.',
    investigationTip: 'Aplica "chmod 600 ~/.ssh/id_ed25519". De lo contrario, OpenSSH rehusará operar la clave.',
    status: isSshKeyOpen ? 'Activo (Riesgo)' : 'Contenido (Mitigado)',
    resolved: !isSshKeyOpen,
  });

  return alerts;
}

/**
 * Derives open listening network sockets from the process table.
 */
export function deriveOpenSockets(processes: SystemProcess[]): NetworkSocket[] {
  const sockets: NetworkSocket[] = [];

  for (const proc of processes) {
    if (proc.status === 'running' && proc.port) {
      sockets.push({
        proto: proc.proto ?? 'tcp',
        port: proc.port,
        listenAddress: proc.listenAddress ?? '0.0.0.0',
        pid: proc.pid,
        process: proc.command.split(' ')[0],
        user: proc.user,
        serviceName: proc.serviceName,
      });
    }
  }

  return sockets.sort((a, b) => a.port - b.port);
}
