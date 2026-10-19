import type { LabVerificationConfig, VerificationRule } from '../types'

/**
 * Declarative verification rules for Lab 01: La Estación Olvidada
 * Based on docs/labs/lab-01/playbook.md and docs/labs/lab-01/ssot-commands.md.
 */

export const lab01Phase1Rules: VerificationRule[] = [
  {
    id: 'v1-base',
    phaseId: 'fase-1',
    title: '[v1-base] Descripción básica del sistema',
    description: 'Descripción básica del sistema y fecha/hora de observación.',
    commandPatterns: [
      /\b(whoami|id|uname|hostname|date|uptime)\b/i,
      /cat\s+\/etc\/os-release/i,
    ],
    outputPatterns: [
      /operario/i,
      /Debian GNU\/Linux/i,
      /invernadero-central/i,
      /PRETTY_NAME=/i,
    ],
  },
  {
    id: 'v1-inv',
    phaseId: 'fase-1',
    title: '[v1-inv] Inventario declarado vs instalado',
    description: 'Comparación del inventario declarado con lo que puede verificarse en esta VM.',
    commandPatterns: [
      /inventario\.csv/i,
      /software-autorizado/i,
      /dpkg\s+.*-l/i,
      /ls.*\/etc\/invernadero/i,
    ],
    outputPatterns: [
      /servidor-central/i,
      /estacion-admin/i,
      /router-firewall/i,
      /openssh-server/i,
      /nginx\s+1\.22/i,
      /Desired=Unknown/i,
    ],
  },
  {
    id: 'v1-users',
    phaseId: 'fase-1',
    title: '[v1-users] Cuentas, grupos y ex_cuidador',
    description: 'Revisión inicial de cuentas, grupos y estado de ex_cuidador.',
    commandPatterns: [
      /(?:cat|getent|grep).*\/etc\/passwd/i,
      /(?:cat|getent|grep).*\/etc\/group/i,
      /passwd\s+-S/i,
      /id\s+(?:cuidador|ex_cuidador)/i,
    ],
    outputPatterns: [
      /ex_cuidador.*(?:L|\/bin\/bash|\/usr\/sbin\/nologin)/i,
      /cuidador:.*1001/i,
      /riego-ops/i,
      /ex_cuidador\s+L/i,
    ],
  },
  {
    id: 'v1-perms',
    phaseId: 'fase-1',
    title: '[v1-perms] Permisos y clasificación',
    description: 'Evidencia de permisos para la clave de prueba y el informe confidencial.',
    commandPatterns: [
      /ls\s+.*(?:catalogo|informes|\.ssh|opt\/invernadero|registro_confidencial|id_ed25519)/i,
      /file\s+.*catalogo_orquideas/i,
      /sha256sum\s+.*(?:catalogo_orquideas|catalogo.*bak)/i,
    ],
    outputPatterns: [
      /-rw-r--r--.*(?:registro_confidencial|id_ed25519)/i,
      /catalogo_orquideas\.pdf:.*ASCII/i,
    ],
  },
  {
    id: 'v1-net',
    phaseId: 'fase-1',
    title: '[v1-net] Línea base de servicios y red',
    description: 'Línea base de servicios/puertos, con atención a la dirección de escucha de Nginx.',
    commandPatterns: [
      /ip\s+(-br\s+)?addr/i,
      /ip\s+route/i,
      /ss\s+.*-[a-z]*[tlupn]/i,
      /netstat\s+.*-[a-z]*l/i,
      /systemctl\s+.*(?:service|status\s+nginx|status\s+ssh)/i,
    ],
    outputPatterns: [
      /10\.0\.2\.15/i,
      /127\.0\.0\.1:8080/i,
      /0\.0\.0\.0:22/i,
      /nginx\.service.*active/i,
    ],
  },
  {
    id: 'v1-logs',
    phaseId: 'fase-1',
    title: '[v1-logs] Cronología de registros',
    description: 'Cronología inicial que identifica los logs sintéticos como tales y distingue hechos de hipótesis.',
    commandPatterns: [
      /(?:cat|tail|head|less|more|ls).*\/var\/log\/invernadero/i,
      /journalctl/i,
    ],
    outputPatterns: [
      /README-lab\.txt/i,
      /polilla_emisora/i,
      /riego_nocturno/i,
      /LILIUM-LAB/i,
      /accesos\.log/i,
      /incidentes\.log/i,
      /backup\.log/i,
    ],
  },
  {
    id: 'v1-nobrk',
    phaseId: 'fase-1',
    title: '[v1-nobrk] Integridad sin cambios destructivos',
    description: 'Confirmación de que no se hicieron cambios durante la auditoría.',
    disallowedCommandPatterns: [
      /\b(rm\s|rmdir\s|kill\b|pkill\b|killall\b|chmod\s|chown\s|usermod\s|userdel\s|systemctl\s+(?:disable|stop))/i,
    ],
    evaluate: (ctx) => {
      // Must have performed reconnaissance checks in phase 1 (at least 2 items completed)
      const p1DoneCount = ['v1-base', 'v1-inv', 'v1-users', 'v1-perms', 'v1-net', 'v1-logs'].filter(
        (id) => ctx.checkedItems[id]
      ).length
      if (p1DoneCount < 2) return false

      // Check if any command in phase 1 history matches destructive operations
      const destructiveRegex =
        /\b(rm\s|rmdir\s|kill\b|pkill\b|killall\b|chmod\s|chown\s|usermod\s|userdel\s|systemctl\s+(?:disable|stop))/i
      const hasDestructive = ctx.commandHistory.some(
        (c) => c.phaseId === 'fase-1' && destructiveRegex.test(c.command)
      )
      return !hasDestructive
    },
  },
]

export const lab01Phase2Rules: VerificationRule[] = [
  {
    id: 'v2-hyp',
    phaseId: 'fase-2',
    title: '[v2-hyp] Hipótesis provisional',
    description: 'Hipótesis provisional apoyada por fuentes identificadas y cronología.',
    commandPatterns: [/ps\s+(?:aux|-ef)/i, /top\b/i],
    evaluate: (ctx) => {
      const ranPs = ctx.commandHistory.some(
        (c) => c.phaseId === 'fase-2' && /ps\s+(?:aux|-ef)|top/i.test(c.command)
      )
      const hasBitacora =
        ctx.findings.some(
          (f) =>
            f.faseAsociada.includes('2') ||
            f.hallazgo.toLowerCase().includes('polilla') ||
            f.hallazgo.toLowerCase().includes('proceso') ||
            f.hallazgo.toLowerCase().includes('hipótesis')
        ) || ctx.consignas.some((c) => c.faseId === 'fase-2' && c.studentNotes.trim().length > 0)
      return ranPs || hasBitacora
    },
  },
  {
    id: 'v2-proc',
    phaseId: 'fase-2',
    title: '[v2-proc] Evidencia del proceso sospechoso',
    description: 'Evidencia del proceso registrada antes de detenerlo.',
    commandPatterns: [
      /(?:cat|tail|head|less)\s+\/tmp\/polilla_emisora/i,
      /cat\s+\/opt\/invernadero\/scripts\/riego_nocturno\.sh/i,
      /ps\s+aux\s+\|\s*grep\s+polilla/i,
      /pgrep\s+.*polilla/i,
    ],
    outputPatterns: [/sleep 60/i, /riego\.log/i, /\/tmp\/polilla_emisora/i],
  },
  {
    id: 'v2-pdf',
    phaseId: 'fase-2',
    title: '[v2-pdf] Validación de artefacto PDF',
    description: 'Naturaleza del archivo .pdf comprobada sin ejecutarlo.',
    commandPatterns: [
      /file\s+\/tmp\/catalogo_orquideas\.pdf/i,
      /cat\s+\/tmp\/catalogo_orquideas\.pdf/i,
      /sha256sum\s+\/tmp\/catalogo_orquideas\.pdf/i,
      /head\s+\/tmp\/catalogo_orquideas\.pdf/i,
    ],
    outputPatterns: [
      /catalogo_orquideas\.pdf:.*ASCII/i,
      /SIMULACIÓN LILIUM/i,
      /LABORATORIO LILIUM/i,
    ],
  },
  {
    id: 'v2-bak',
    phaseId: 'fase-2',
    title: '[v2-bak] Validación del respaldo',
    description: 'Respaldo validado y clasificado correctamente como incompleto.',
    commandPatterns: [
      /(?:cat|head|tail|less)\s+\/var\/backups\/invernadero\/catalogo_2026-10-17\.bak/i,
      /cat\s+\/var\/backups\/invernadero\/manifest\.txt/i,
      /cat\s+\/srv\/invernadero\/catalogo\/catalogo_publico\.csv/i,
      /ls\s+.*\/var\/backups\/invernadero/i,
    ],
    outputPatterns: [
      /BACKUP SIMULADO: CONTENIDO INCOMPLETO/i,
      /catalogo_2026-10-17\.bak/i,
      /manifest\.txt/i,
    ],
  },
  {
    id: 'v2-kill',
    phaseId: 'fase-2',
    title: '[v2-kill] Contención con SIGTERM',
    description: 'Acción de contención justificada y resultado comprobado.',
    commandPatterns: [
      /(?:sudo\s+)?kill\s+(?:-15|-s\s+15|-TERM|-s\s+TERM)\s+\d+/i,
      /pkill\s+(?:-15|-TERM)\s+polilla/i,
      /kill\s+-15/i,
    ],
    evaluate: (ctx) => {
      const killRegex =
        /(?:sudo\s+)?kill\s+(?:-15|-s\s+15|-TERM|-s\s+TERM)\s+\d+|pkill\s+(?:-15|-TERM)\s+polilla|kill\s+-15/i
      const hasKillCmd = ctx.commandHistory.some(
        (c) => c.phaseId === 'fase-2' && killRegex.test(c.command)
      )
      return hasKillCmd
    },
  },
  {
    id: 'v2-srv',
    phaseId: 'fase-2',
    title: '[v2-srv] Continuidad de servicios legítimos',
    description: 'Verificación de que los procesos y servicios legítimos no se detuvieron como efecto colateral.',
    commandPatterns: [
      /ps\s+aux\s+\|\s*grep\s+riego_nocturno/i,
      /systemctl\s+status\s+nginx/i,
      /systemctl\s+is-active\s+nginx/i,
    ],
    evaluate: (ctx) => {
      const ranSrvCheck = ctx.commandHistory.some(
        (c) =>
          c.phaseId === 'fase-2' &&
          (/riego_nocturno/i.test(c.command) || /status\s+nginx/i.test(c.command))
      )
      return ranSrvCheck
    },
  },
  {
    id: 'v2-rigor',
    phaseId: 'fase-2',
    title: '[v2-rigor] Rigor técnico en evidencias',
    description: 'La bitácora no presenta las simulaciones como un ataque real.',
    evaluate: (ctx) => {
      const hasExamined =
        Boolean(ctx.checkedItems['v2-pdf']) ||
        ctx.commandHistory.some(
          (c) => c.phaseId === 'fase-2' && /catalogo_orquideas/i.test(c.command)
        )
      const hasRemoved = ctx.commandHistory.some((c) =>
        /rm\s+.*catalogo_orquideas/i.test(c.command)
      )
      const hasBitacora =
        ctx.findings.some(
          (f) =>
            f.activo.includes('catalogo_orquideas') ||
            f.hallazgo.toLowerCase().includes('señuelo') ||
            f.hallazgo.toLowerCase().includes('simulado') ||
            f.hallazgo.toLowerCase().includes('texto')
        ) || ctx.consignas.some((c) => c.faseId === 'fase-2' && c.studentNotes.trim().length > 0)

      return (hasExamined && !hasRemoved) || hasBitacora
    },
  },
]

export const lab01Phase3Rules: VerificationRule[] = [
  {
    id: 'v3-acc',
    phaseId: 'fase-3',
    title: '[v3-acc] Restricción de cuenta obsoleta',
    description: 'La cuenta obsoleta quedó restringida sin ser eliminada.',
    commandPatterns: [
      /usermod\s+.*-s\s+\/usr\/sbin\/nologin\s+ex_cuidador/i,
      /usermod\s+.*-L\s+ex_cuidador/i,
    ],
    outputPatterns: [/ex_cuidador:.*\/usr\/sbin\/nologin/i],
    evaluate: (ctx) => {
      const p3Cmds = ctx.commandHistory.filter((c) => c.phaseId === 'fase-3')
      const hasNologin = p3Cmds.some((c) =>
        /usermod\s+.*-s\s+\/usr\/sbin\/nologin.*ex_cuidador/i.test(c.command)
      )
      const hasLock = p3Cmds.some((c) =>
        /usermod\s+.*-L.*ex_cuidador/i.test(c.command)
      )
      const hasOutput = /ex_cuidador:.*\/usr\/sbin\/nologin/i.test(ctx.terminalOutput)
      return (hasNologin && hasLock) || (hasNologin && hasOutput) ||
        p3Cmds.some((c) => /usermod\s+.*-s\s+\/usr\/sbin\/nologin.*-L|usermod\s+.*-L.*-s\s+\/usr\/sbin\/nologin/i.test(c.command))
    },
  },
  {
    id: 'v3-perms',
    phaseId: 'fase-3',
    title: '[v3-perms] Protección de archivos sensibles (modo 600)',
    description: 'Los permisos de los archivos sensibles coinciden con la decisión documentada (modo 600).',
    commandPatterns: [
      /chmod\s+.*600\s+.*(?:id_ed25519|registro_confidencial)/i,
    ],
    outputPatterns: [
      /-rw-------.*(?:id_ed25519|registro_confidencial)/i,
    ],
    evaluate: (ctx) => {
      const p3Cmds = ctx.commandHistory.filter((c) => c.phaseId === 'fase-3')
      const hasKey = p3Cmds.some((c) => /chmod\s+.*600.*id_ed25519/i.test(c.command))
      const hasConf = p3Cmds.some((c) => /chmod\s+.*600.*registro_confidencial/i.test(c.command))
      const has600Output = /-rw-------.*(?:id_ed25519|registro_confidencial)/i.test(
        ctx.terminalOutput
      )
      return (hasKey && hasConf) || (hasKey && has600Output) || has600Output
    },
  },
  {
    id: 'v3-ssh',
    phaseId: 'fase-3',
    title: '[v3-ssh] Deshabilitación de SSH innecesario',
    description: 'Los servicios innecesarios (SSH) se deshabilitaron solo tras confirmar que no eran requeridos.',
    commandPatterns: [
      /systemctl\s+.*disable\s+(--now\s+)?ssh/i,
      /systemctl\s+.*stop\s+ssh/i,
    ],
    outputPatterns: [
      /(?:ssh\.service.*inactive|Active:\s+inactive\s+\(dead\)|sshd.*stopped)/i,
    ],
  },
  {
    id: 'v3-alive',
    phaseId: 'fase-3',
    title: '[v3-alive] Continuidad operativa verificada',
    description: 'Nginx y el proceso legítimo de riego conservan el estado esperado.',
    commandPatterns: [
      /systemctl\s+status\s+nginx/i,
      /systemctl\s+is-active\s+nginx/i,
      /ss\s+-tulpn/i,
      /ps\s+aux\s+\|\s*grep\s+riego/i,
    ],
    outputPatterns: [
      /(?:Active:\s+active\s+\(running\).*nginx|127\.0\.0\.1:8080)/i,
    ],
    evaluate: (ctx) => {
      const p3Cmds = ctx.commandHistory.filter((c) => c.phaseId === 'fase-3')
      const checkedNginx =
        p3Cmds.some((c) => /nginx/i.test(c.command)) ||
        /nginx\.service.*active/i.test(ctx.terminalOutput)
      const checkedRiego = p3Cmds.some(
        (c) => /riego/i.test(c.command) || /ps\s+aux/i.test(c.command)
      )
      return checkedNginx && checkedRiego
    },
  },
  {
    id: 'v3-patch',
    phaseId: 'fase-3',
    title: '[v3-patch] Documentación de parches sin actualizar a ciegas',
    description: 'El estado de actualización quedó documentado sin ejecutar una actualización fuera de control.',
    commandPatterns: [
      /apt\s+list\s+--upgradable/i,
      /apt-get\s+-u\s+upgrade\s+--dry-run/i,
      /uname\s+-r/i,
    ],
    outputPatterns: [/openssh-server.*upgradable/i],
    evaluate: (ctx) => {
      const p3Cmds = ctx.commandHistory.filter((c) => c.phaseId === 'fase-3')
      const ranCheck =
        p3Cmds.some((c) => /apt\s+list\s+--upgradable|uname\s+-r/i.test(c.command)) ||
        /upgradable/i.test(ctx.terminalOutput)
      const ranAptUpgrade = p3Cmds.some(
        (c) => /\bapt\s+(?:-y\s+)?upgrade\b/i.test(c.command) && !/--dry-run/i.test(c.command)
      )
      return ranCheck && !ranAptUpgrade
    },
  },
  {
    id: 'v3-post',
    phaseId: 'fase-3',
    title: '[v3-post] Comprobación global de controles',
    description: 'Cada control tiene una evidencia posterior que demuestra su resultado.',
    commandPatterns: [
      /(?:grep\s+ex_cuidador\s+\/etc\/passwd|ls\s+-l\s+.*(?:id_ed25519|registro_confidencial)|ss\s+-tulpn|ps\s+aux)/i,
    ],
    evaluate: (ctx) => {
      const p3Cmds = ctx.commandHistory.filter((c) => c.phaseId === 'fase-3')
      let count = 0
      if (p3Cmds.some((c) => /ex_cuidador/i.test(c.command) || /passwd\s+-S/i.test(c.command)))
        count++
      if (p3Cmds.some((c) => /ls\s+-l.*(?:id_ed25519|registro_confidencial)/i.test(c.command)))
        count++
      if (p3Cmds.some((c) => /ss\s+-tulpn/i.test(c.command))) count++
      if (p3Cmds.some((c) => /ps\s+aux/i.test(c.command))) count++
      return count >= 2
    },
  },
  {
    id: 'v3-residual',
    phaseId: 'fase-3',
    title: '[v3-residual] Riesgos residuales y cierre',
    description: 'Se documentaron los riesgos residuales y las acciones que exceden el alcance de esta VM.',
    evaluate: (ctx) => {
      const hasResidualFinding = ctx.findings.some(
        (f) =>
          f.faseAsociada.includes('3') ||
          f.hallazgo.toLowerCase().includes('residual') ||
          f.hallazgo.toLowerCase().includes('mantenimiento') ||
          f.hallazgo.toLowerCase().includes('ex_cuidador')
      )
      const hasConsignaNotes = ctx.consignas.some(
        (c) => c.faseId === 'fase-3' && c.studentNotes.trim().length > 0
      )
      const p3DoneCount = [
        'v3-acc',
        'v3-perms',
        'v3-ssh',
        'v3-alive',
        'v3-patch',
        'v3-post',
      ].filter((id) => ctx.checkedItems[id]).length
      return hasResidualFinding || hasConsignaNotes || p3DoneCount >= 4
    },
  },
]

export const lab01VerificationConfig: LabVerificationConfig = {
  labId: 'lab-01',
  phases: [
    {
      id: 'fase-1',
      number: '1',
      title: 'Auditoría: conocer el estado inicial',
      rules: lab01Phase1Rules,
    },
    {
      id: 'fase-2',
      number: '2',
      title: 'Evidencia: triaje y contención controlada',
      rules: lab01Phase2Rules,
    },
    {
      id: 'fase-3',
      number: '3',
      title: 'Hardening: aplicar y verificar controles',
      rules: lab01Phase3Rules,
    },
  ],
}
