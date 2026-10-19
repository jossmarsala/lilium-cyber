---
lab: lab-01
type: ssot-setup-commands
title: 'Script SSoT de Inicialización del Entorno Linux — Lab 01'
description: 'Comandos de terminal Linux ejecutados para aprovisionar el escenario vulnerable de la Estación Invernadero-Central'
---

# Script SSoT de Inicialización — Lab 01 "La Estación Olvidada"

> **Fuente Única de Verdad (Single Source of Truth) para la configuración del sistema operativo emulado.**
> Los comandos de terminal Linux a continuación son ejecutados directamente en la máquina virtual Linux (v86) al iniciar el laboratorio para provisionar archivos, usuarios, servicios, vulnerabilidades y artefactos.

```bash
#!/bin/sh
umask 022
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
echo "invernadero-central" > /etc/hostname
hostname invernadero-central 2>/dev/null || true

cat > /etc/hosts << 'EOF'
127.0.0.1 localhost
127.0.1.1 invernadero-central.local invernadero-central
10.0.2.15 invernadero-central
EOF

cat > /etc/resolv.conf << 'EOF'
nameserver 10.0.2.3
search invernadero.local
EOF

cat > /etc/os-release << 'EOF'
PRETTY_NAME="Debian GNU/Linux 12 (bookworm)"
NAME="Debian GNU/Linux"
VERSION_ID="12"
EOF

mkdir -p /bin /usr/bin /usr/local/bin /usr/sbin /var/lib/lilium/services
ln -sf /bin/sh /bin/bash 2>/dev/null || true

cat > /usr/local/bin/hostname << 'EOF'
#!/bin/sh
[ $# -gt 0 ] && echo "$1" > /etc/hostname && /bin/hostname "$1" 2>/dev/null
cat /etc/hostname 2>/dev/null || echo "invernadero-central"
EOF
chmod 755 /usr/local/bin/hostname

cat > /usr/local/bin/whoami << 'EOF'
#!/bin/sh
echo "${USER:-operario}"
EOF
chmod 755 /usr/local/bin/whoami

cat > /usr/local/bin/id << 'EOF'
#!/bin/sh
t="${1:-${USER:-operario}}"
l="$(grep -E "^${t}:" /etc/passwd 2>/dev/null | head -n 1)"
[ -z "$l" ] && echo "id: '$t': no such user" >&2 && exit 1
u="$(echo "$l" | cut -d: -f3)"; g="$(echo "$l" | cut -d: -f4)"
gn="$(grep -E "^[^:]+:[^:]*:${g}:" /etc/group 2>/dev/null | head -n 1 | cut -d: -f1)"
[ -z "$gn" ] && gn="$t"
s="${g}(${gn})"
for gl in $(grep -E "(^|:|,)${t}(,|$)" /etc/group 2>/dev/null); do
  sn="$(echo "$gl" | cut -d: -f1)"; sg="$(echo "$gl" | cut -d: -f3)"
  [ "$sg" != "$g" ] && s="${s},${sg}(${sn})"
done
echo "uid=${u}(${t}) gid=${g}(${gn}) groups=${s}"
EOF
chmod 755 /usr/local/bin/id

cat > /usr/bin/sudo << 'EOF'
#!/bin/sh
exec "$@"
EOF
chmod 755 /usr/bin/sudo
ln -sf /usr/bin/sudo /bin/sudo 2>/dev/null || true

cat > /usr/bin/getent << 'EOF'
#!/bin/sh
d="$1"; shift
case "$d" in
  passwd) [ $# -eq 0 ] && cat /etc/passwd && exit 0; for u in "$@"; do grep -E "^${u}:" /etc/passwd 2>/dev/null; done ;;
  group) [ $# -eq 0 ] && cat /etc/group && exit 0; for g in "$@"; do grep -E "^${g}:" /etc/group 2>/dev/null; done ;;
esac
EOF
chmod 755 /usr/bin/getent

cat > /usr/bin/usermod << 'EOF'
#!/bin/sh
sh=""; lk=0; gp=""; tg=""
while [ $# -gt 0 ]; do
  case "$1" in -s) sh="$2"; shift 2 ;; -L) lk=1; shift ;; -aG) gp="$2"; shift 2 ;; *) tg="$1"; shift ;; esac
done
[ -n "$sh" ] && [ -n "$tg" ] && sed -i "s|^\\(${tg}:[^:]*:[^:]*:[^:]*:[^:]*:[^:]*:\\).*|\\1${sh}|" /etc/passwd
if [ "$lk" = "1" ] && [ -n "$tg" ]; then
  echo "$tg" >> /var/lib/lilium/locked_users
  [ -f /etc/shadow ] && sed -i "s|^\\(${tg}:\\)\\([^!].*\\)|\\1!\\2|" /etc/shadow
fi
EOF
chmod 755 /usr/bin/usermod

cat > /usr/local/bin/passwd << 'EOF'
#!/bin/sh
if [ "$1" = "-S" ]; then
  u="$2"; k=0
  [ -f /var/lib/lilium/locked_users ] && grep -q "^${u}$" /var/lib/lilium/locked_users && k=1
  [ "$u" = "ex_cuidador" ] && k=1
  [ "$k" = "1" ] && echo "$u L 10/17/2026 0 99999 7 -1" || echo "$u P 10/17/2026 0 99999 7 -1"
  exit 0
fi
exec /usr/bin/passwd "$@"
EOF
chmod 755 /usr/local/bin/passwd

cat > /usr/bin/dpkg << 'EOF'
#!/bin/sh
[ "$1" = "-l" ] && cat << 'DPKG_EOF'
Desired=Unknown/Install/Remove/Purge/Hold
| Status=Not/Inst/Conf-files/Unpacked/halF-conf/Half-inst/trig-aWait/Trig-pend
|/ Err?=(none)/Reinst-required (Status,Err: uppercase=bad)
||/ Name           Version               Architecture Description
+++-==============-=====================-============-===================================================
ii  acl            2.3.1-1               amd64        access control list - utilities
ii  bash           5.2.15-2+b7           amd64        GNU Bourne Again SHell
ii  coreutils      9.1-1                 amd64        GNU core utilities
ii  nginx          1.22.1-9              amd64        web server
ii  openssh-server 1:9.2p1-2+deb12u3     amd64        secure shell
DPKG_EOF
exit 0
EOF
chmod 755 /usr/bin/dpkg

cat > /usr/bin/apt << 'EOF'
#!/bin/sh
[ "$1" = "list" ] && [ "$2" = "--upgradable" ] && echo "openssh-server/stable 1:9.2p1-2+deb12u4 amd64 [upgradable from: 1:9.2p1-2+deb12u3]"
exit 0
EOF
chmod 755 /usr/bin/apt

cat > /usr/bin/systemctl << 'EOF'
#!/bin/sh
S="/var/lib/lilium/services"; mkdir -p "$S"
[ ! -f "$S/ssh" ] && echo "running" > "$S/ssh"
[ ! -f "$S/nginx" ] && echo "running" > "$S/nginx"
case "$1" in
  status)
    v="$(echo "$2" | sed 's/\.service$//')"; st="$(cat "$S/$v" 2>/dev/null || echo "dead")"
    if [ "$v" = "nginx" ] || [ "$v" = "ssh" ]; then
      [ "$st" = "running" ] && echo -e "● $v.service\n   Active: active (running)" || echo -e "● $v.service\n   Active: inactive (dead)"
    else
      echo -e "● $v.service\n   Active: $st"
    fi ;;
  disable|stop)
    shift; while [ $# -gt 0 ]; do [ "$1" != "--now" ] && echo "stopped" > "$S/$(echo "$1" | sed 's/\.service$//')"; shift; done ;;
  enable|start)
    shift; while [ $# -gt 0 ]; do [ "$1" != "--now" ] && echo "running" > "$S/$(echo "$1" | sed 's/\.service$//')"; shift; done ;;
  --type=service)
    echo "  UNIT          LOAD   ACTIVE SUB"
    echo "  cron.service  loaded active running"
    [ "$(cat "$S/nginx" 2>/dev/null)" = "running" ] && echo "  nginx.service loaded active running"
    [ "$(cat "$S/ssh" 2>/dev/null)" = "running" ] && echo "  ssh.service   loaded active running" ;;
esac
EOF
chmod 755 /usr/bin/systemctl

cat > /usr/bin/ss << 'EOF'
#!/bin/sh
S="/var/lib/lilium/services"
echo "Netid  State   Recv-Q  Send-Q   Local Address:Port   Peer Address:Port  Process"
[ "$(cat "$S/ssh" 2>/dev/null)" != "stopped" ] && echo "tcp    LISTEN  0       128            0.0.0.0:22          0.0.0.0:*      users:((\"sshd\",pid=312,fd=3))"
[ "$(cat "$S/nginx" 2>/dev/null)" != "stopped" ] && echo "tcp    LISTEN  0       128          127.0.0.1:8080        0.0.0.0:*      users:((\"nginx\",pid=345,fd=6))"
EOF
chmod 755 /usr/bin/ss

cat > /usr/bin/journalctl << 'EOF'
#!/bin/sh
cat << 'J_EOF'
-- Boot b2e4c85910fa4a91b248466e3981881b --
Oct 17 20:41:12 invernadero-central sshd[289]: Failed password for invalid user ex_cuidador
Oct 17 21:07:42 invernadero-central LILIUM-LAB[412]: SIMULADO: revisar accesos fuera de horario
Oct 17 21:08:01 invernadero-central LILIUM-LAB[412]: SIMULADO: artefacto detectado en /tmp
Oct 17 22:00:04 invernadero-central LILIUM-LAB[412]: SIMULADO: backup con verificacion pendiente
J_EOF
EOF
chmod 755 /usr/bin/journalctl

cat > /usr/bin/file << 'EOF'
#!/bin/sh
for t in "$@"; do
  [ ! -e "$t" ] && echo "$t: cannot open" && continue
  fl="$(head -n 1 "$t" 2>/dev/null)"
  case "$fl" in
    *ELF*) echo "$t: ELF 64-bit LSB pie executable" ;;
    *PDF*) echo "$t: PDF document" ;;
    *) echo "$t: ASCII text" ;;
  esac
done
EOF
chmod 755 /usr/bin/file

cat > /usr/local/bin/ps << 'EOF'
#!/bin/sh
if [ "$1" = "aux" ] || [ "$1" = "-ef" ]; then
  echo "USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND"
  for d in /proc/[0-9]*; do
    p="${d#/proc/}"
    if [ -r "$d/cmdline" ]; then
      c="$(tr '\0' ' ' < "$d/cmdline" 2>/dev/null | sed 's/ $//')"
      [ -z "$c" ] && c="[$(cat "$d/comm" 2>/dev/null)]"
      u="root"
      case "$c" in *polilla_emisora*) u="www-data" ;; *riego_nocturno*) u="cuidador" ;; esac
      printf "%-8s %5s  0.0  0.1   2480   512 ?        S    08:00   0:00 %s\n" "$u" "$p" "$c"
    fi
  done
  exit 0
fi
exec /bin/ps "$@"
EOF
chmod 755 /usr/local/bin/ps

cat > /usr/local/bin/ip << 'EOF'
#!/bin/sh
if [ "$1" = "-br" ]; then
  echo "lo               UNKNOWN        127.0.0.1/8 ::1/128"
  echo "eth0             UP             10.0.2.15/24 fe80::5054:ff:fe12:3456/64"
elif [ "$1" = "route" ]; then
  echo "default via 10.0.2.2 dev eth0"
  echo "10.0.2.0/24 dev eth0 proto kernel scope link src 10.0.2.15"
else
  exec /sbin/ip "$@"
fi
EOF
chmod 755 /usr/local/bin/ip

cat > /etc/group << 'EOF'
root:x:0:
sudo:x:27:operario,admin-it,cuidador
operario:x:1000:operario
riego-ops:x:1001:cuidador,www-data
administracion:x:1002:ana
it-admins:x:1003:admin-it
proveedores:x:1004:proveedor
www-data:x:33:
EOF

cat > /etc/passwd << 'EOF'
root:x:0:0:root:/root:/bin/sh
operario:x:1000:1000:Operario:/home/operario:/bin/bash
cuidador:x:1001:1001:Cuidador:/home/cuidador:/bin/bash
admin-it:x:1002:1003:IT:/home/admin-it:/bin/bash
ana:x:1003:1002:Admin:/home/ana:/bin/bash
proveedor:x:1004:1004:Proveedor:/home/proveedor:/bin/bash
ex_cuidador:x:1005:1001:Ex_Cuidador:/home/ex_cuidador:/bin/bash
www-data:x:33:33:www-data:/opt/invernadero/web:/usr/sbin/nologin
EOF

mkdir -p /etc/sudoers.d
echo "operario ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/99-lilium
echo "cuidador ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/99-lilium
chmod 0440 /etc/sudoers.d/99-lilium

mkdir -p /opt/invernadero/scripts /srv/invernadero/catalogo /srv/invernadero/informes /var/log/invernadero /var/backups/invernadero /etc/invernadero /home/operario /home/cuidador/.ssh

chown -R root:root /opt/invernadero
chown -R root:riego-ops /srv/invernadero
chmod 0750 /srv/invernadero /srv/invernadero/catalogo /srv/invernadero/informes
chown -R operario:operario /home/operario 2>/dev/null || true
chown -R cuidador:riego-ops /home/cuidador 2>/dev/null || true
chmod 0750 /home/operario
chmod 0700 /home/cuidador/.ssh

cat > /etc/invernadero/inventario.csv << 'EOF'
asset_id,tipo,ubicacion,responsable,criticidad,estado
SRV-INV-01,Servidor central,Invernadero Central,admin-it,Alta,En uso
EOF
cat > /etc/invernadero/software-autorizado.txt << 'EOF'
nginx
openssh-server
EOF

cat > /srv/invernadero/catalogo/catalogo_publico.csv << 'EOF'
id,nombre,estado
001,Azucena,Disponible
EOF

cat > /srv/invernadero/informes/registro_confidencial.csv << 'EOF'
id,operador,evento
001,ana,ajuste de riego
EOF
chmod 0644 /srv/invernadero/informes/registro_confidencial.csv
chown root:riego-ops /srv/invernadero/informes/registro_confidencial.csv

cat > /home/cuidador/.ssh/id_ed25519 << 'EOF'
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACBA1vK0r+vH7h2Y7vK4jL8nK3lPqW1sK3xL9vO0j5m8QwAAAJgAwvQDAM
-----END OPENSSH PRIVATE KEY-----
EOF
chmod 0644 /home/cuidador/.ssh/id_ed25519
chown cuidador:riego-ops /home/cuidador/.ssh/id_ed25519

cat > /tmp/catalogo_orquideas.pdf << 'EOF'
SIMULACION LILIUM: archivo de prueba con extension .pdf.
Este archivo es texto plano.
EOF
chmod 0644 /tmp/catalogo_orquideas.pdf

echo "BACKUP SIMULADO: CONTENIDO INCOMPLETO" > /var/backups/invernadero/catalogo_2026-10-17.bak
echo "catalogo_publico.csv" > /var/backups/invernadero/manifest.txt

cat > /var/log/invernadero/README-lab.txt << 'EOF'
Eventos sinteticos. Correlacionarlos con la salida de comandos.
EOF
cat > /var/log/invernadero/accesos.log << 'EOF'
2026-10-17T20:41:12 SIMULADO ssh login fallido usuario=ex_cuidador
EOF
cat > /var/log/invernadero/actividad.log << 'EOF'
2026-10-17T21:03:00 SIMULADO proceso observado nombre=riego_nocturno.sh
2026-10-17T21:07:42 SIMULADO proceso desconocido nombre=polilla_emisora
EOF
chmod 0640 /var/log/invernadero/*.log /var/log/invernadero/README-lab.txt

pkill -f riego_nocturno.sh 2>/dev/null || true
pkill -f polilla_emisora 2>/dev/null || true

cat > /opt/invernadero/scripts/riego_nocturno.sh << 'EOF'
#!/bin/sh
while true; do sleep 60; done
EOF
chmod 0755 /opt/invernadero/scripts/riego_nocturno.sh
/bin/sh /opt/invernadero/scripts/riego_nocturno.sh >/dev/null 2>&1 &

cat > /tmp/polilla_emisora << 'EOF'
#!/bin/sh
while true; do sleep 60; done
EOF
chmod 0755 /tmp/polilla_emisora
/bin/sh /tmp/polilla_emisora >/dev/null 2>&1 &

cat > /home/operario/.profile << 'EOF'
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
export USER=operario
export HOME=/home/operario
export HOSTNAME=invernadero-central
export PS1="operario@invernadero-central:\w$ "
EOF
cp /home/operario/.profile /home/operario/.bashrc
chown -R operario:operario /home/operario 2>/dev/null || true

export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
export USER=operario
export HOME=/home/operario
export HOSTNAME=invernadero-central
export PS1="operario@invernadero-central:\w$ "

clear
printf "\n  Estacion Botanica Automatizada N. 4 — invernadero-central\n"
printf "  Usuario activo: operario\n"
printf "  ALERTA: Sistema comprometido — inicia la auditoria de seguridad.\n\n"
cd /home/operario
```
