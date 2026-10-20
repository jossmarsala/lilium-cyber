import type { LabVerificationConfig, VerificationRule } from '../types'

/**
 * Automated Verification Rules for Lab 01: La Estación Olvidada
 * Based on docs/labs/lab-01/playbook.md (Directivas, Pistas y Guía Pedagógica / Solución).
 * Maps every single command in the solution into an individual, verifiable sub-step.
 */

/* ─────────────────────────────────────────────────────────────────────────────
   FASE 1: Auditoría — Reconocimiento y línea base
   ───────────────────────────────────────────────────────────────────────────── */

export const lab01Phase1Rules: VerificationRule[] = [
  // Paso 1.1: Identifica el sistema bajo tu control
  {
    id: 'v1.1-whoami',
    phaseId: 'fase-1',
    stepId: '1.1',
    command: 'whoami',
    title: 'Paso 1.1: whoami',
    description: 'Identificar el nombre de tu usuario en la sesión activa.',
    commandPatterns: [/\bwhoami\b/i],
    outputPatterns: [/operario/i],
  },
  {
    id: 'v1.1-id',
    phaseId: 'fase-1',
    stepId: '1.1',
    command: 'id',
    title: 'Paso 1.1: id',
    description: 'Consultar los identificadores y grupos de tu cuenta.',
    commandPatterns: [/(?:^|\s|;)id(?:\s+|$|;)/i],
    outputPatterns: [/uid=\d+.*gid=\d+/i],
  },
  {
    id: 'v1.1-hostname',
    phaseId: 'fase-1',
    stepId: '1.1',
    command: 'hostname',
    title: 'Paso 1.1: hostname',
    description: 'Obtener el nombre del equipo en la red.',
    commandPatterns: [/\bhostname\b/i],
    outputPatterns: [/invernadero-central/i],
  },
  {
    id: 'v1.1-date',
    phaseId: 'fase-1',
    stepId: '1.1',
    command: 'date',
    title: 'Paso 1.1: date',
    description: 'Registrar la marca temporal del sistema.',
    commandPatterns: [/(?:^|\s|;)date(?:\s+|$|;)/i],
  },
  {
    id: 'v1.1-uname',
    phaseId: 'fase-1',
    stepId: '1.1',
    command: 'uname -a',
    title: 'Paso 1.1: uname -a',
    description: 'Consultar la versión del kernel y arquitectura del procesador.',
    commandPatterns: [/\buname(\s+(-a|--all))?\b/i],
    outputPatterns: [/Linux\s+invernadero-central/i],
  },
  {
    id: 'v1.1-os-release',
    phaseId: 'fase-1',
    stepId: '1.1',
    command: 'cat /etc/os-release',
    title: 'Paso 1.1: cat /etc/os-release',
    description: 'Revisar los detalles de la distribución Linux instalada.',
    commandPatterns: [/(?:cat|less|head|tail|more)\s+\/etc\/os-release/i],
    outputPatterns: [/PRETTY_NAME=/i, /Debian GNU\/Linux/i],
  },
  {
    id: 'v1.1-uptime',
    phaseId: 'fase-1',
    stepId: '1.1',
    command: 'uptime',
    title: 'Paso 1.1: uptime',
    description: 'Consultar el tiempo de actividad continua del servidor.',
    commandPatterns: [/\buptime\b/i],
    outputPatterns: [/up\s+/i, /load average/i],
  },

  // Paso 1.2: Contrasta el inventario oficial con el software real
  {
    id: 'v1.2-ls-invernadero',
    phaseId: 'fase-1',
    stepId: '1.2',
    command: 'ls -la /etc/invernadero',
    title: 'Paso 1.2: ls -la /etc/invernadero',
    description: 'Listar los archivos de configuración del invernadero.',
    commandPatterns: [/\bls\s+.*\/etc\/invernadero\b/i],
    outputPatterns: [/inventario\.csv/i, /software-autorizado\.txt/i],
  },
  {
    id: 'v1.2-cat-inventario',
    phaseId: 'fase-1',
    stepId: '1.2',
    command: 'cat /etc/invernadero/inventario.csv',
    title: 'Paso 1.2: cat /etc/invernadero/inventario.csv',
    description: 'Leer el inventario declarado de activos.',
    commandPatterns: [/(?:cat|less|head|tail|more)\s+\/etc\/invernadero\/inventario\.csv/i],
    outputPatterns: [/servidor-central/i, /estacion-admin/i, /router-firewall/i],
  },
  {
    id: 'v1.2-cat-software',
    phaseId: 'fase-1',
    stepId: '1.2',
    command: 'cat /etc/invernadero/software-autorizado.txt',
    title: 'Paso 1.2: cat /etc/invernadero/software-autorizado.txt',
    description: 'Leer la lista de software autorizado para el servidor.',
    commandPatterns: [/(?:cat|less|head|tail|more)\s+\/etc\/invernadero\/software-autorizado\.txt/i],
    outputPatterns: [/openssh-server/i, /nginx/i],
  },
  {
    id: 'v1.2-dpkg-l',
    phaseId: 'fase-1',
    stepId: '1.2',
    command: 'dpkg -l',
    title: 'Paso 1.2: dpkg -l',
    description: 'Listar todos los paquetes instalados en el sistema.',
    commandPatterns: [/\bdpkg\s+.*-l\b/i],
    outputPatterns: [/Desired=Unknown/i, /openssh-server/i, /nginx\s+1\.22/i],
  },

  // Paso 1.3: Audita cuentas, grupos y privilegios
  {
    id: 'v1.3-cat-passwd',
    phaseId: 'fase-1',
    stepId: '1.3',
    command: 'cat /etc/passwd',
    title: 'Paso 1.3: cat /etc/passwd',
    description: 'Inspeccionar el listado de usuarios locales.',
    commandPatterns: [/(?:cat|less|head|tail|more|grep.*)\s+\/etc\/passwd|getent\s+passwd/i],
    outputPatterns: [/cuidador:.*1001/i, /ex_cuidador/i],
  },
  {
    id: 'v1.3-cat-group',
    phaseId: 'fase-1',
    stepId: '1.3',
    command: 'cat /etc/group',
    title: 'Paso 1.3: cat /etc/group',
    description: 'Revisar los grupos de trabajo y de administración.',
    commandPatterns: [/(?:cat|less|head|tail|more|grep.*)\s+\/etc\/group|getent\s+group/i],
    outputPatterns: [/riego-ops/i, /it-admins/i, /sudo:.*operario/i],
  },
  {
    id: 'v1.3-cat-sudoers',
    phaseId: 'fase-1',
    stepId: '1.3',
    command: 'sudo cat /etc/sudoers',
    title: 'Paso 1.3: sudo cat /etc/sudoers',
    description: 'Inspeccionar las reglas de elevación de privilegios.',
    commandPatterns: [/(?:sudo\s+)?cat\s+\/etc\/sudoers/i],
    outputPatterns: [/it-admins/i, /sudo\s+ALL=/i, /cuidador/i],
  },
  {
    id: 'v1.3-id-cuidador',
    phaseId: 'fase-1',
    stepId: '1.3',
    command: 'id cuidador',
    title: 'Paso 1.3: id cuidador',
    description: 'Consultar el detalle de grupos del cuidador actual.',
    commandPatterns: [/\bid\s+cuidador\b/i],
    outputPatterns: [/cuidador.*riego-ops/i],
  },
  {
    id: 'v1.3-id-ex-cuidador',
    phaseId: 'fase-1',
    stepId: '1.3',
    command: 'id ex_cuidador',
    title: 'Paso 1.3: id ex_cuidador',
    description: 'Consultar el detalle de grupos del antiguo empleado.',
    commandPatterns: [/\bid\s+ex_cuidador\b/i],
    outputPatterns: [/ex_cuidador/i],
  },
  {
    id: 'v1.3-passwd-ex-cuidador',
    phaseId: 'fase-1',
    stepId: '1.3',
    command: 'sudo passwd -S ex_cuidador',
    title: 'Paso 1.3: sudo passwd -S ex_cuidador',
    description: 'Comprobar el estado de la contraseña de la cuenta antigua.',
    commandPatterns: [/(?:sudo\s+)?passwd\s+-S\s+ex_cuidador/i],
    outputPatterns: [/ex_cuidador\s+L\b/i],
  },

  // Paso 1.4: Evalúa permisos y clasificación de archivos críticos
  {
    id: 'v1.4-ls-dirs',
    phaseId: 'fase-1',
    stepId: '1.4',
    command: 'ls -la /opt/invernadero /srv/invernadero/catalogo /srv/invernadero/informes /var/backups/invernadero',
    title: 'Paso 1.4: ls -la /opt /srv /var/backups',
    description: 'Explorar las carpetas operativas, de datos y de respaldos.',
    commandPatterns: [
      /\bls\s+.*(?:\/opt\/invernadero|\/srv\/invernadero|\/var\/backups\/invernadero)/i,
    ],
  },
  {
    id: 'v1.4-ls-sensitive',
    phaseId: 'fase-1',
    stepId: '1.4',
    command: 'ls -la /srv/invernadero/informes/registro_confidencial.csv /home/cuidador/.ssh/id_ed25519',
    title: 'Paso 1.4: ls -la registro_confidencial.csv id_ed25519',
    description: 'Inspeccionar en detalle los permisos del informe confidencial y la clave SSH.',
    commandPatterns: [
      /\bls\s+.*(?:registro_confidencial|id_ed25519|\.ssh)/i,
    ],
    outputPatterns: [/-rw-r--r--.*(?:registro_confidencial|id_ed25519)/i],
  },
  {
    id: 'v1.4-file-tmp',
    phaseId: 'fase-1',
    stepId: '1.4',
    command: 'file /tmp/catalogo_orquideas.pdf',
    title: 'Paso 1.4: file /tmp/catalogo_orquideas.pdf',
    description: 'Analizar el tipo de contenido real del archivo sospechoso en /tmp.',
    commandPatterns: [/\bfile\s+.*catalogo_orquideas/i],
    outputPatterns: [/ELF\s+64-bit|ASCII/i],
  },
  {
    id: 'v1.4-sha256',
    phaseId: 'fase-1',
    stepId: '1.4',
    command: 'sha256sum /tmp/catalogo_orquideas.pdf /var/backups/invernadero/catalogo_2026-10-17.bak',
    title: 'Paso 1.4: sha256sum catalogo_orquideas.pdf ...',
    description: 'Generar la huella criptográfica SHA-256 de los archivos clave.',
    commandPatterns: [/\bsha256sum\s+.*(?:catalogo_orquideas|catalogo.*\.bak)/i],
  },

  // Paso 1.5: Traza la línea base de red y servicios
  {
    id: 'v1.5-ip-addr',
    phaseId: 'fase-1',
    stepId: '1.5',
    command: 'ip -br addr',
    title: 'Paso 1.5: ip -br addr',
    description: 'Consultar las interfaces de red y sus direcciones IP asignadas.',
    commandPatterns: [/\bip\s+(-br\s+)?(?:a|addr|address)\b|\bifconfig\b/i],
    outputPatterns: [/10\.0\.2\.15/i, /127\.0\.0\.1/i],
  },
  {
    id: 'v1.5-ip-route',
    phaseId: 'fase-1',
    stepId: '1.5',
    command: 'ip route',
    title: 'Paso 1.5: ip route',
    description: 'Revisar la tabla de enrutamiento de red.',
    commandPatterns: [/\bip\s+(?:r|route)\b|\broute\b/i],
    outputPatterns: [/default\s+via/i],
  },
  {
    id: 'v1.5-ss-tulpn',
    phaseId: 'fase-1',
    stepId: '1.5',
    command: 'sudo ss -tulpn',
    title: 'Paso 1.5: sudo ss -tulpn',
    description: 'Identificar puertos abiertos en escucha y qué proceso los controla.',
    commandPatterns: [
      /(?:sudo\s+)?ss\s+.*-[a-z]*[tlupn]|(?:sudo\s+)?netstat\s+.*-[a-z]*l/i,
    ],
    outputPatterns: [/127\.0\.0\.1:8080/i, /0\.0\.0\.0:22/i, /:8080\b/i],
  },
  {
    id: 'v1.5-systemctl-services',
    phaseId: 'fase-1',
    stepId: '1.5',
    command: 'systemctl --type=service',
    title: 'Paso 1.5: systemctl --type=service',
    description: 'Listar los servicios activos en segundo plano.',
    commandPatterns: [/\bsystemctl\s+.*(?:--type=service|list-units.*service)/i],
    outputPatterns: [/nginx\.service/i, /ssh\.service/i],
  },
  {
    id: 'v1.5-nginx-status',
    phaseId: 'fase-1',
    stepId: '1.5',
    command: 'systemctl status nginx',
    title: 'Paso 1.5: systemctl status nginx',
    description: 'Consultar el estado detallado del servidor web Nginx.',
    commandPatterns: [/\bsystemctl\s+(?:status|is-active)\s+nginx/i],
    outputPatterns: [/Active:\s+active\s+\(running\)/i, /nginx\.service/i],
  },

  // Paso 1.6: Analiza los registros sin confundir indicios con hechos
  {
    id: 'v1.6-ls-log',
    phaseId: 'fase-1',
    stepId: '1.6',
    command: 'ls -la /var/log/invernadero',
    title: 'Paso 1.6: ls -la /var/log/invernadero',
    description: 'Listar los archivos dentro del directorio de logs del invernadero.',
    commandPatterns: [/\bls\s+.*\/var\/log\/invernadero/i],
    outputPatterns: [/README-lab\.txt/i, /actividad\.log/i],
  },
  {
    id: 'v1.6-cat-readme',
    phaseId: 'fase-1',
    stepId: '1.6',
    command: 'sudo cat /var/log/invernadero/README-lab.txt',
    title: 'Paso 1.6: sudo cat README-lab.txt',
    description: 'Leer la nota técnica del entorno de entrenamiento.',
    commandPatterns: [/(?:sudo\s+)?cat\s+.*README-lab\.txt/i],
    outputPatterns: [/README-lab\.txt/i, /LILIUM/i, /laboratorio/i],
  },
  {
    id: 'v1.6-cat-accesos',
    phaseId: 'fase-1',
    stepId: '1.6',
    command: 'sudo cat /var/log/invernadero/accesos.log',
    title: 'Paso 1.6: sudo cat accesos.log',
    description: 'Inspeccionar el registro de accesos de usuarios.',
    commandPatterns: [/(?:sudo\s+)?cat\s+.*accesos\.log/i],
    outputPatterns: [/accesos\.log/i, /Failed password/i, /ex_cuidador/i],
  },
  {
    id: 'v1.6-cat-actividad',
    phaseId: 'fase-1',
    stepId: '1.6',
    command: 'sudo cat /var/log/invernadero/actividad.log',
    title: 'Paso 1.6: sudo cat actividad.log',
    description: 'Inspeccionar el registro de actividad operativa.',
    commandPatterns: [/(?:sudo\s+)?cat\s+.*actividad\.log/i],
    outputPatterns: [/polilla_emisora/i, /riego_nocturno/i],
  },
  {
    id: 'v1.6-cat-backup',
    phaseId: 'fase-1',
    stepId: '1.6',
    command: 'sudo cat /var/log/invernadero/backup.log',
    title: 'Paso 1.6: sudo cat backup.log',
    description: 'Inspeccionar el registro de copias de seguridad.',
    commandPatterns: [/(?:sudo\s+)?cat\s+.*backup\.log/i],
    outputPatterns: [/backup\.log/i, /incompleto|truncado|alerta/i],
  },
  {
    id: 'v1.6-cat-incidentes',
    phaseId: 'fase-1',
    stepId: '1.6',
    command: 'sudo cat /var/log/invernadero/incidentes.log',
    title: 'Paso 1.6: sudo cat incidentes.log',
    description: 'Inspeccionar el resumen de incidentes reportados.',
    commandPatterns: [/(?:sudo\s+)?cat\s+.*incidentes\.log/i],
    outputPatterns: [/incidentes\.log/i, /INCIDENTE/i, /polilla/i],
  },
  {
    id: 'v1.6-journalctl',
    phaseId: 'fase-1',
    stepId: '1.6',
    command: 'sudo journalctl',
    title: 'Paso 1.6: sudo journalctl',
    description: 'Consultar el registro general del sistema operativo.',
    commandPatterns: [/(?:sudo\s+)?journalctl\b/i],
    outputPatterns: [/LILIUM-LAB|systemd|kernel/i],
  },

  // Integridad no destructiva
  {
    id: 'v1-nobrk',
    phaseId: 'fase-1',
    title: 'Integridad sin cambios destructivos',
    description: 'Confirmación de que no se hicieron cambios durante la auditoría.',
    disallowedCommandPatterns: [
      /\b(rm\s|rmdir\s|kill\b|pkill\b|killall\b|chmod\s|chown\s|usermod\s|userdel\s|systemctl\s+(?:disable|stop))/i,
    ],
    evaluate: (ctx) => {
      const p1DoneCount = Object.keys(ctx.checkedItems).filter(
        (id) => id.startsWith('v1.') && ctx.checkedItems[id]
      ).length
      if (p1DoneCount < 3) return false

      const destructiveRegex =
        /\b(rm\s|rmdir\s|kill\b|pkill\b|killall\b|chmod\s|chown\s|usermod\s|userdel\s|systemctl\s+(?:disable|stop))/i
      const hasDestructive = ctx.commandHistory.some(
        (c) => c.phaseId === 'fase-1' && destructiveRegex.test(c.command)
      )
      return !hasDestructive
    },
  },
]

/* ─────────────────────────────────────────────────────────────────────────────
   FASE 2: Evidencia — Triaje y contención controlada
   ───────────────────────────────────────────────────────────────────────────── */

export const lab01Phase2Rules: VerificationRule[] = [
  // Paso 2.1: Cruza los registros con la memoria viva y formula tu hipótesis
  {
    id: 'v2.1-cat-actividad',
    phaseId: 'fase-2',
    stepId: '2.1',
    command: 'sudo cat /var/log/invernadero/actividad.log',
    title: 'Paso 2.1: sudo cat actividad.log',
    description: 'Repasar las entradas del registro de actividad.',
    commandPatterns: [/(?:sudo\s+)?cat\s+.*actividad\.log/i],
    outputPatterns: [/polilla_emisora/i],
  },
  {
    id: 'v2.1-cat-incidentes',
    phaseId: 'fase-2',
    stepId: '2.1',
    command: 'sudo cat /var/log/invernadero/incidentes.log',
    title: 'Paso 2.1: sudo cat incidentes.log',
    description: 'Repasar las alertas del registro de incidentes.',
    commandPatterns: [/(?:sudo\s+)?cat\s+.*incidentes\.log/i],
    outputPatterns: [/incidentes\.log/i],
  },
  {
    id: 'v2.1-ps-aux',
    phaseId: 'fase-2',
    stepId: '2.1',
    command: 'ps aux',
    title: 'Paso 2.1: ps aux',
    description: 'Listar todos los procesos que están corriendo actualmente en el servidor.',
    commandPatterns: [/\bps\s+(?:aux|-ef)\b|\btop\b/i],
    outputPatterns: [/polilla_emisora/i, /riego_nocturno/i],
  },

  // Paso 2.2: Analiza el código de los procesos antes de actuar
  {
    id: 'v2.2-grep-polilla',
    phaseId: 'fase-2',
    stepId: '2.2',
    command: 'ps aux | grep polilla_emisora',
    title: 'Paso 2.2: ps aux | grep polilla_emisora',
    description: 'Aislar la línea del proceso sospechoso para obtener su PID.',
    commandPatterns: [/\bps\s+.*\|\s*grep\s+polilla|\bpgrep\s+.*polilla/i],
    outputPatterns: [/\/tmp\/polilla_emisora/i],
  },
  {
    id: 'v2.2-cat-polilla',
    phaseId: 'fase-2',
    stepId: '2.2',
    command: 'cat /tmp/polilla_emisora',
    title: 'Paso 2.2: cat /tmp/polilla_emisora',
    description: 'Leer el código fuente del proceso sospechoso.',
    commandPatterns: [/(?:cat|less|head|tail)\s+\/tmp\/polilla_emisora/i],
    outputPatterns: [/sleep 60/i],
  },
  {
    id: 'v2.2-cat-riego',
    phaseId: 'fase-2',
    stepId: '2.2',
    command: 'cat /opt/invernadero/scripts/riego_nocturno.sh',
    title: 'Paso 2.2: cat riego_nocturno.sh',
    description: 'Leer el código fuente del script de riego.',
    commandPatterns: [
      /(?:cat|less|head|tail)\s+\/opt\/invernadero\/scripts\/riego_nocturno\.sh/i,
    ],
    outputPatterns: [/riego\.log/i],
  },

  // Paso 2.3: Analiza el binario con extensión engañosa
  {
    id: 'v2.3-ls-pdf',
    phaseId: 'fase-2',
    stepId: '2.3',
    command: 'ls -la /tmp/catalogo_orquideas.pdf',
    title: 'Paso 2.3: ls -la /tmp/catalogo_orquideas.pdf',
    description: 'Consultar permisos, propietario y tamaño del archivo.',
    commandPatterns: [/\bls\s+.*\/tmp\/catalogo_orquideas/i],
  },
  {
    id: 'v2.3-file-pdf',
    phaseId: 'fase-2',
    stepId: '2.3',
    command: 'file /tmp/catalogo_orquideas.pdf',
    title: 'Paso 2.3: file /tmp/catalogo_orquideas.pdf',
    description: 'Confirmar el formato binario real del archivo.',
    commandPatterns: [/\bfile\s+.*\/tmp\/catalogo_orquideas/i],
    outputPatterns: [/ELF\s+64-bit|ASCII/i],
  },
  {
    id: 'v2.3-strings-pdf',
    phaseId: 'fase-2',
    stepId: '2.3',
    command: 'strings /tmp/catalogo_orquideas.pdf',
    title: 'Paso 2.3: strings /tmp/catalogo_orquideas.pdf',
    description: 'Leer el contenido interno en la terminal.',
    commandPatterns: [/(?:strings|cat|head)\s+\/tmp\/catalogo_orquideas/i],
    outputPatterns: [/ORQ-014|VIV-B02|SIMULACI[OÓ]N|LABORATORIO/i],
  },
  {
    id: 'v2.3-sha256-pdf',
    phaseId: 'fase-2',
    stepId: '2.3',
    command: 'sha256sum /tmp/catalogo_orquideas.pdf',
    title: 'Paso 2.3: sha256sum /tmp/catalogo_orquideas.pdf',
    description: 'Registrar la huella SHA-256 y preservar el artefacto.',
    commandPatterns: [/\bsha256sum\s+.*\/tmp\/catalogo_orquideas/i],
  },

  // Paso 2.4: Audita la integridad de la copia de seguridad
  {
    id: 'v2.4-ls-backups',
    phaseId: 'fase-2',
    stepId: '2.4',
    command: 'ls -la /var/backups/invernadero',
    title: 'Paso 2.4: ls -la /var/backups/invernadero',
    description: 'Listar el contenido del directorio de respaldos.',
    commandPatterns: [/\bls\s+.*\/var\/backups\/invernadero/i],
    outputPatterns: [/catalogo_2026-10-17\.bak/i, /manifest\.txt/i],
  },
  {
    id: 'v2.4-cat-manifest',
    phaseId: 'fase-2',
    stepId: '2.4',
    command: 'cat /var/backups/invernadero/manifest.txt',
    title: 'Paso 2.4: cat manifest.txt',
    description: 'Leer el archivo manifiesto del respaldo.',
    commandPatterns: [/(?:cat|less|head|tail)\s+.*\/manifest\.txt/i],
    outputPatterns: [/manifest\.txt/i, /catalogo_publico\.csv/i],
  },
  {
    id: 'v2.4-cat-bak',
    phaseId: 'fase-2',
    stepId: '2.4',
    command: 'cat /var/backups/invernadero/catalogo_2026-10-17.bak',
    title: 'Paso 2.4: cat catalogo_2026-10-17.bak',
    description: 'Inspeccionar el contenido real de la copia de seguridad.',
    commandPatterns: [/(?:cat|less|head|tail)\s+.*catalogo_2026-10-17\.bak/i],
    outputPatterns: [/BACKUP SIMULADO|CONTENIDO INCOMPLETO|TRUNCATED|LIL-001/i],
  },
  {
    id: 'v2.4-cat-prod',
    phaseId: 'fase-2',
    stepId: '2.4',
    command: 'cat /srv/invernadero/catalogo/catalogo_publico.csv',
    title: 'Paso 2.4: cat catalogo_publico.csv',
    description: 'Comparar contra el catálogo activo en producción.',
    commandPatterns: [/(?:cat|less|head|tail)\s+.*catalogo_publico\.csv/i],
    outputPatterns: [/LIL-001/i, /ORQ-014/i],
  },

  // Paso 2.5: Ejecuta una contención quirúrgica
  {
    id: 'v2.5-grep-polilla',
    phaseId: 'fase-2',
    stepId: '2.5',
    command: 'ps aux | grep polilla_emisora',
    title: 'Paso 2.5: ps aux | grep polilla_emisora',
    description: 'Confirmar el número de PID activo de polilla_emisora.',
    commandPatterns: [/\bps\s+.*\|\s*grep\s+polilla|\bpgrep\s+.*polilla/i],
  },
  {
    id: 'v2.5-kill-polilla',
    phaseId: 'fase-2',
    stepId: '2.5',
    command: 'sudo kill -15 PID',
    title: 'Paso 2.5: sudo kill -15 PID',
    description: 'Detener el proceso sospechoso de forma controlada.',
    commandPatterns: [
      /(?:sudo\s+)?kill\s+(?:-15|-s\s+15|-TERM|-s\s+TERM)\s+\d+/i,
      /pkill\s+(?:-15|-TERM)\s+polilla/i,
      /kill\s+-15/i,
    ],
    evaluate: (ctx) => {
      const killRegex =
        /(?:sudo\s+)?kill\s+(?:-15|-s\s+15|-TERM|-s\s+TERM)\s+\d+|pkill\s+(?:-15|-TERM)\s+polilla|kill\s+-15/i
      return ctx.commandHistory.some(
        (c) => c.phaseId === 'fase-2' && killRegex.test(c.command)
      )
    },
  },
  {
    id: 'v2.5-ps-verify',
    phaseId: 'fase-2',
    stepId: '2.5',
    command: 'ps aux',
    title: 'Paso 2.5: ps aux (verificar contención)',
    description: 'Comprobar que el proceso anómalo desapareció de la memoria.',
    commandPatterns: [/\bps\s+(?:aux|-ef)\b/i],
    evaluate: (ctx) => {
      const hasKill =
        Boolean(ctx.checkedItems['v2.5-kill-polilla']) ||
        ctx.commandHistory.some(
          (c) => c.phaseId === 'fase-2' && /kill\s+(-15|-TERM)/i.test(c.command)
        )
      const ranPsAfter = ctx.commandHistory.some(
        (c) => c.phaseId === 'fase-2' && /ps\s+(?:aux|-ef)/i.test(c.command)
      )
      return hasKill && ranPsAfter
    },
  },
  {
    id: 'v2.5-ps-riego',
    phaseId: 'fase-2',
    stepId: '2.5',
    command: 'ps aux | grep riego_nocturno.sh',
    title: 'Paso 2.5: ps aux | grep riego_nocturno.sh',
    description: 'Verificar que el script de riego continúa operando.',
    commandPatterns: [/\bps\s+.*\|\s*grep\s+riego|\bpgrep\s+.*riego/i],
    outputPatterns: [/riego_nocturno\.sh/i],
  },
  {
    id: 'v2.5-nginx-status',
    phaseId: 'fase-2',
    stepId: '2.5',
    command: 'systemctl status nginx',
    title: 'Paso 2.5: systemctl status nginx',
    description: 'Verificar que el panel web local sigue en línea.',
    commandPatterns: [/\bsystemctl\s+(?:status|is-active)\s+nginx/i],
    outputPatterns: [/Active:\s+active\s+\(running\)/i],
  },
]

/* ─────────────────────────────────────────────────────────────────────────────
   FASE 3: Hardening — Aplicación y verificación de controles
   ───────────────────────────────────────────────────────────────────────────── */

export const lab01Phase3Rules: VerificationRule[] = [
  // Paso 3.1: Neutraliza la cuenta del antiguo empleado
  {
    id: 'v3.1-grep-excuidador-init',
    phaseId: 'fase-3',
    stepId: '3.1',
    command: 'grep ex_cuidador /etc/passwd',
    title: 'Paso 3.1: grep ex_cuidador /etc/passwd',
    description: 'Verificar el estado inicial de la cuenta en /etc/passwd.',
    commandPatterns: [/\bgrep\s+.*ex_cuidador\s+\/etc\/passwd/i],
    outputPatterns: [/ex_cuidador:/i],
  },
  {
    id: 'v3.1-passwd-status-init',
    phaseId: 'fase-3',
    stepId: '3.1',
    command: 'sudo passwd -S ex_cuidador',
    title: 'Paso 3.1: sudo passwd -S ex_cuidador',
    description: 'Verificar el estado inicial de bloqueo de contraseña.',
    commandPatterns: [/(?:sudo\s+)?passwd\s+-S\s+ex_cuidador/i],
    outputPatterns: [/ex_cuidador\s+L/i],
  },
  {
    id: 'v3.1-usermod-nologin',
    phaseId: 'fase-3',
    stepId: '3.1',
    command: 'sudo usermod -s /usr/sbin/nologin ex_cuidador',
    title: 'Paso 3.1: sudo usermod -s /usr/sbin/nologin ex_cuidador',
    description: 'Retirar la consola interactiva asignando nologin.',
    commandPatterns: [/\busermod\s+.*-s\s+\/usr\/sbin\/nologin\s+ex_cuidador/i],
  },
  {
    id: 'v3.1-usermod-lock',
    phaseId: 'fase-3',
    stepId: '3.1',
    command: 'sudo usermod -L ex_cuidador',
    title: 'Paso 3.1: sudo usermod -L ex_cuidador',
    description: 'Reafirmar el bloqueo de la cuenta.',
    commandPatterns: [/\busermod\s+.*-L\s+ex_cuidador/i],
  },
  {
    id: 'v3.1-grep-excuidador-verify',
    phaseId: 'fase-3',
    stepId: '3.1',
    command: 'grep ex_cuidador /etc/passwd',
    title: 'Paso 3.1: grep ex_cuidador /etc/passwd (verificación)',
    description: 'Comprobar que el cambio en /etc/passwd quedó aplicado.',
    commandPatterns: [/\bgrep\s+.*ex_cuidador\s+\/etc\/passwd/i],
    outputPatterns: [/ex_cuidador:.*\/usr\/sbin\/nologin/i],
    evaluate: (ctx) => {
      const hasNologin =
        Boolean(ctx.checkedItems['v3.1-usermod-nologin']) ||
        ctx.commandHistory.some(
          (c) => c.phaseId === 'fase-3' && /usermod.*nologin/i.test(c.command)
        )
      const ranGrep = ctx.commandHistory.some(
        (c) => c.phaseId === 'fase-3' && /grep.*ex_cuidador.*passwd/i.test(c.command)
      )
      return hasNologin && (ranGrep || /ex_cuidador:.*\/usr\/sbin\/nologin/i.test(ctx.terminalOutput))
    },
  },
  {
    id: 'v3.1-passwd-status-verify',
    phaseId: 'fase-3',
    stepId: '3.1',
    command: 'sudo passwd -S ex_cuidador',
    title: 'Paso 3.1: sudo passwd -S ex_cuidador (verificación)',
    description: 'Comprobar el estado final de la contraseña.',
    commandPatterns: [/(?:sudo\s+)?passwd\s+-S\s+ex_cuidador/i],
    evaluate: (ctx) => {
      const hasLock =
        Boolean(ctx.checkedItems['v3.1-usermod-lock']) ||
        ctx.commandHistory.some(
          (c) => c.phaseId === 'fase-3' && /usermod.*-L/i.test(c.command)
        )
      const ranPasswd = ctx.commandHistory.some(
        (c) => c.phaseId === 'fase-3' && /passwd\s+-S/i.test(c.command)
      )
      return hasLock && ranPasswd
    },
  },

  // Paso 3.2: Blinda los permisos de los archivos sensibles
  {
    id: 'v3.2-ls-init',
    phaseId: 'fase-3',
    stepId: '3.2',
    command: 'ls -l /home/cuidador/.ssh/id_ed25519 /srv/invernadero/informes/registro_confidencial.csv',
    title: 'Paso 3.2: ls -l id_ed25519 registro_confidencial',
    description: 'Revisar los permisos abiertos antes de aplicar el cambio.',
    commandPatterns: [/\bls\s+.*(?:id_ed25519|registro_confidencial)/i],
  },
  {
    id: 'v3.2-chmod-ssh',
    phaseId: 'fase-3',
    stepId: '3.2',
    command: 'sudo chmod 600 /home/cuidador/.ssh/id_ed25519',
    title: 'Paso 3.2: sudo chmod 600 id_ed25519',
    description: 'Restringir los permisos de la clave privada SSH.',
    commandPatterns: [/\bchmod\s+.*600\s+.*id_ed25519/i],
  },
  {
    id: 'v3.2-chmod-conf',
    phaseId: 'fase-3',
    stepId: '3.2',
    command: 'sudo chmod 600 /srv/invernadero/informes/registro_confidencial.csv',
    title: 'Paso 3.2: sudo chmod 600 registro_confidencial.csv',
    description: 'Restringir los permisos del informe confidencial.',
    commandPatterns: [/\bchmod\s+.*600\s+.*registro_confidencial/i],
  },
  {
    id: 'v3.2-ls-verify',
    phaseId: 'fase-3',
    stepId: '3.2',
    command: 'ls -l /home/cuidador/.ssh/id_ed25519 /srv/invernadero/informes/registro_confidencial.csv',
    title: 'Paso 3.2: ls -l id_ed25519 registro_confidencial (verificación)',
    description: 'Verificar que los nuevos permisos se aplicaron con éxito.',
    commandPatterns: [/\bls\s+.*(?:id_ed25519|registro_confidencial)/i],
    outputPatterns: [/-rw-------.*(?:id_ed25519|registro_confidencial)/i],
    evaluate: (ctx) => {
      const hasChmod =
        Boolean(ctx.checkedItems['v3.2-chmod-ssh']) ||
        Boolean(ctx.checkedItems['v3.2-chmod-conf'])
      const ranLs = ctx.commandHistory.some(
        (c) =>
          c.phaseId === 'fase-3' &&
          /ls\s+-l.*(?:id_ed25519|registro_confidencial)/i.test(c.command)
      )
      return (
        (hasChmod && ranLs) ||
        /-rw-------.*(?:id_ed25519|registro_confidencial)/i.test(ctx.terminalOutput)
      )
    },
  },

  // Paso 3.3: Cierra los servicios de red innecesarios
  {
    id: 'v3.3-services-init',
    phaseId: 'fase-3',
    stepId: '3.3',
    command: 'systemctl --type=service',
    title: 'Paso 3.3: systemctl --type=service',
    description: 'Listar los servicios activos antes del cambio.',
    commandPatterns: [/\bsystemctl\s+.*(?:--type=service|list-units.*service)/i],
  },
  {
    id: 'v3.3-ss-init',
    phaseId: 'fase-3',
    stepId: '3.3',
    command: 'sudo ss -tulpn',
    title: 'Paso 3.3: sudo ss -tulpn',
    description: 'Revisar los puertos actualmente en escucha.',
    commandPatterns: [/(?:sudo\s+)?ss\s+.*-[a-z]*[tlupn]/i],
  },
  {
    id: 'v3.3-nginx-init',
    phaseId: 'fase-3',
    stepId: '3.3',
    command: 'systemctl status nginx',
    title: 'Paso 3.3: systemctl status nginx',
    description: 'Verificar el estado del servidor web Nginx.',
    commandPatterns: [/\bsystemctl\s+status\s+nginx/i],
  },
  {
    id: 'v3.3-ssh-init',
    phaseId: 'fase-3',
    stepId: '3.3',
    command: 'systemctl status ssh',
    title: 'Paso 3.3: systemctl status ssh',
    description: 'Verificar el estado actual del servidor SSH.',
    commandPatterns: [/\bsystemctl\s+status\s+ssh/i],
  },
  {
    id: 'v3.3-disable-ssh',
    phaseId: 'fase-3',
    stepId: '3.3',
    command: 'sudo systemctl disable --now ssh',
    title: 'Paso 3.3: sudo systemctl disable --now ssh',
    description: 'Deshabilitar y detener el servicio SSH en un solo paso.',
    commandPatterns: [
      /\bsystemctl\s+.*disable\s+(--now\s+)?ssh|\bsystemctl\s+.*stop\s+ssh/i,
    ],
  },
  {
    id: 'v3.3-ssh-verify',
    phaseId: 'fase-3',
    stepId: '3.3',
    command: 'systemctl status ssh',
    title: 'Paso 3.3: systemctl status ssh (verificación)',
    description: 'Confirmar que el servicio SSH quedó detenido.',
    commandPatterns: [/\bsystemctl\s+status\s+ssh/i],
    outputPatterns: [
      /(?:ssh\.service.*inactive|Active:\s+inactive\s+\(dead\)|sshd.*stopped)/i,
    ],
    evaluate: (ctx) => {
      const hasDisabled =
        Boolean(ctx.checkedItems['v3.3-disable-ssh']) ||
        ctx.commandHistory.some(
          (c) => c.phaseId === 'fase-3' && /disable.*ssh|stop\s+ssh/i.test(c.command)
        )
      const ranCheck = ctx.commandHistory.some(
        (c) => c.phaseId === 'fase-3' && /status\s+ssh/i.test(c.command)
      )
      return hasDisabled && (ranCheck || /inactive\s+\(dead\)/i.test(ctx.terminalOutput))
    },
  },
  {
    id: 'v3.3-nginx-verify',
    phaseId: 'fase-3',
    stepId: '3.3',
    command: 'systemctl status nginx',
    title: 'Paso 3.3: systemctl status nginx (verificación)',
    description: 'Confirmar que Nginx no sufrió interrupciones.',
    commandPatterns: [/\bsystemctl\s+status\s+nginx/i],
    outputPatterns: [/Active:\s+active\s+\(running\)/i],
  },
  {
    id: 'v3.3-ss-verify',
    phaseId: 'fase-3',
    stepId: '3.3',
    command: 'sudo ss -tulpn',
    title: 'Paso 3.3: sudo ss -tulpn (verificación)',
    description: 'Comprobar en la tabla de red que el puerto 22 se cerró.',
    commandPatterns: [/(?:sudo\s+)?ss\s+.*-[a-z]*[tlupn]/i],
    evaluate: (ctx) => {
      const hasDisabled = Boolean(ctx.checkedItems['v3.3-disable-ssh'])
      const ranSs = ctx.commandHistory.some(
        (c) => c.phaseId === 'fase-3' && /ss\s+-tulpn/i.test(c.command)
      )
      return hasDisabled && ranSs
    },
  },

  // Paso 3.4: Evalúa las actualizaciones pendientes con criterio operativo
  {
    id: 'v3.4-uname',
    phaseId: 'fase-3',
    stepId: '3.4',
    command: 'uname -r',
    title: 'Paso 3.4: uname -r',
    description: 'Consultar la versión actual del kernel.',
    commandPatterns: [/\buname\s+(-r|--kernel-release)/i],
  },
  {
    id: 'v3.4-dpkg',
    phaseId: 'fase-3',
    stepId: '3.4',
    command: 'dpkg -l',
    title: 'Paso 3.4: dpkg -l',
    description: 'Listar los paquetes instalados actualmente.',
    commandPatterns: [/\bdpkg\s+.*-l/i],
  },
  {
    id: 'v3.4-apt-upgradable',
    phaseId: 'fase-3',
    stepId: '3.4',
    command: 'apt list --upgradable',
    title: 'Paso 3.4: apt list --upgradable',
    description: 'Consultar qué paquetes tienen actualizaciones disponibles.',
    commandPatterns: [
      /\bapt\s+list\s+--upgradable|\bapt-get\s+-u\s+upgrade\s+--dry-run/i,
    ],
    outputPatterns: [/openssh-server.*upgradable/i],
  },

  // Paso 3.5: Ejecuta la verificación final y cierra la Bitácora
  {
    id: 'v3.5-grep-excuidador',
    phaseId: 'fase-3',
    stepId: '3.5',
    command: 'grep ex_cuidador /etc/passwd',
    title: 'Paso 3.5: grep ex_cuidador /etc/passwd',
    description: 'Comprobar la consola asignada a ex_cuidador.',
    commandPatterns: [/\bgrep\s+.*ex_cuidador\s+\/etc\/passwd/i],
    outputPatterns: [/ex_cuidador:.*\/usr\/sbin\/nologin/i],
  },
  {
    id: 'v3.5-passwd-excuidador',
    phaseId: 'fase-3',
    stepId: '3.5',
    command: 'sudo passwd -S ex_cuidador',
    title: 'Paso 3.5: sudo passwd -S ex_cuidador',
    description: 'Comprobar el bloqueo de contraseña de ex_cuidador.',
    commandPatterns: [/(?:sudo\s+)?passwd\s+-S\s+ex_cuidador/i],
    outputPatterns: [/ex_cuidador\s+L/i],
  },
  {
    id: 'v3.5-ls-files',
    phaseId: 'fase-3',
    stepId: '3.5',
    command: 'ls -l /home/cuidador/.ssh/id_ed25519 /srv/invernadero/informes/registro_confidencial.csv',
    title: 'Paso 3.5: ls -l id_ed25519 registro_confidencial',
    description: 'Comprobar el blindaje de permisos en los archivos sensibles.',
    commandPatterns: [/\bls\s+.*(?:id_ed25519|registro_confidencial)/i],
    outputPatterns: [/-rw-------/i],
  },
  {
    id: 'v3.5-nginx',
    phaseId: 'fase-3',
    stepId: '3.5',
    command: 'systemctl status nginx',
    title: 'Paso 3.5: systemctl status nginx',
    description: 'Comprobar la salud operativa del servidor web Nginx.',
    commandPatterns: [/\bsystemctl\s+status\s+nginx/i],
    outputPatterns: [/Active:\s+active\s+\(running\)/i],
  },
  {
    id: 'v3.5-ss',
    phaseId: 'fase-3',
    stepId: '3.5',
    command: 'sudo ss -tulpn',
    title: 'Paso 3.5: sudo ss -tulpn',
    description: 'Comprobar el cierre de puertos expuestos.',
    commandPatterns: [/(?:sudo\s+)?ss\s+.*-[a-z]*[tlupn]/i],
  },
  {
    id: 'v3.5-ps',
    phaseId: 'fase-3',
    stepId: '3.5',
    command: 'ps aux',
    title: 'Paso 3.5: ps aux',
    description: 'Comprobar la limpieza y continuidad de los procesos en memoria.',
    commandPatterns: [/\bps\s+(?:aux|-ef)\b/i],
  },
]

export const lab01VerificationConfig: LabVerificationConfig = {
  labId: 'lab-01',
  phases: [
    {
      id: 'fase-1',
      number: '1',
      title: 'Auditoría: Reconocimiento y línea base',
      rules: lab01Phase1Rules,
    },
    {
      id: 'fase-2',
      number: '2',
      title: 'Evidencia: Triaje y contención controlada',
      rules: lab01Phase2Rules,
    },
    {
      id: 'fase-3',
      number: '3',
      title: 'Hardening: Aplicación y verificación de controles',
      rules: lab01Phase3Rules,
    },
  ],
}
