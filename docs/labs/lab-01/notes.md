---
lab: lab-01
type: notes-seed
title: "Notas iniciales — Estación Invernadero-Central"
---

# NOTE: Bitácora de Auditoría Técnica

Este archivo define las notas pre-sembradas en la app Notes cuando el usuario inicia Lab 01.
Cada bloque `## NOTE:` se convierte en una nota separada en el gestor de notas del OS ficticio.

---

## NOTE: Plantilla de Bitácora NIST CSF

```
📋 BITÁCORA DE AUDITORÍA TÉCNICA — NIST CSF / CIS Controls
Estación Botánica Automatizada N.º 4 — Invernadero Central
Operario: ___________________   Fecha: ___________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BLOQUE 0 — IDENTIFICACIÓN DEL INCIDENTE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 [Orientación metodológica — NO EDITAR ESTA LÍNEA]
 Antes de cualquier acción técnica, el operario debe
 identificar el alcance del incidente y los activos
 en riesgo. Alineado con NIST CSF → Función: IDENTIFICAR
 y CIS Control 1 (Inventario de Activos de Hardware).

  Host objetivo: invernadero-central
  IP del host:   192.168.1.50 / localhost
  Fecha inicio:  ___________________
  Hora inicio:   ___________________
  Gravedad inicial (crítica/alta/media/baja): ___________
  Descubierto por (herramienta):  Terminal / ps aux / ss -tulpn

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BLOQUE 1 — FASE: IDENTIFICAR (NIST CSF ID)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 [Guía] Documenta los activos críticos descubiertos.
 Aplica la TRÍADA CIA a cada activo.
 Ref: CIS Control 2, 3 | NIST CSF ID.AM-2

 1.1 INVENTARIO DE ACTIVOS CRÍTICOS
 ─────────────────────────────────────
 Activo 1: ___________________________________
   Ruta/IP: __________________________________
   Impacto CIA: [ ] Confidencialidad  [ ] Integridad  [ ] Disponibilidad

 Activo 2: ___________________________________
   Ruta/IP: __________________________________
   Impacto CIA: [ ] Confidencialidad  [ ] Integridad  [ ] Disponibilidad

 Activo 3: ___________________________________
   Ruta/IP: __________________________________
   Impacto CIA: [ ] Confidencialidad  [ ] Integridad  [ ] Disponibilidad

 1.2 RESULTADO DEL COMANDO "ps aux"
 ─────────────────────────────────────
 [Pega aquí la salida relevante de: ps aux | grep -v grep]


 1.3 RESULTADO DE "ss -tulpn" (puertos en escucha)
 ─────────────────────────────────────────────────


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BLOQUE 2 — FASE: PROTEGER (NIST CSF PR)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 2.1 PERMISOS INSEGUROS DETECTADOS
 ─────────────────────────────────────
 Archivo: /etc/shadow
   Permisos actuales: ________  Permisos correctos: 640
   Comando aplicado: sudo chmod _____ /etc/shadow
   Estado: [ ] Pendiente  [ ] Mitigado

 Archivo: /home/cuidador/.ssh/id_ed25519
   Permisos actuales: ________  Permisos correctos: 600
   Comando aplicado: chmod _____ ~/.ssh/id_ed25519
   Estado: [ ] Pendiente  [ ] Mitigado

 2.2 SERVICIOS VULNERABLES IDENTIFICADOS
 ─────────────────────────────────────────
 Servicio: in.telnetd (Puerto 23 — Texto plano)
   Riesgo CIA: Confidencialidad (credenciales expuestas)
   Acción: sudo systemctl stop telnet.service
   Estado: [ ] Pendiente  [ ] Mitigado

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BLOQUE 3 — FASE: DETECTAR (NIST CSF DE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 3.1 PROCESOS SOSPECHOSOS (ps aux)
 ─────────────────────────────────────
 Proceso 1: polilla_emisora
   Tipo: [x] Amenaza Real  [ ] Falso Positivo
   Usuario: www-data  |  Conexión: 198.51.100.44:4444
   PID: _________
   Acción: kill -15 <PID>  o  kill -9 <PID>
   Estado: [ ] Activo  [ ] Terminado

 Proceso 2: riego_nocturno.sh
   Tipo: [ ] Amenaza Real  [x] Falso Positivo
   Usuario: cuidador  |  Verificado con: cat /opt/sensores/riego_nocturno.sh
   Decisión: [ ] Mantener en ejecución
   Razonamiento: _________________________________

 3.2 ANÁLISIS DE LOGS (/var/log/auth.log)
 ─────────────────────────────────────
 NTP activo: [ ] Sí  [ ] No
 Comando: grep -i "failed" /var/log/auth.log
 Evento crítico:
   Timestamp: _____________  IP atacante: _____________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BLOQUE 4 — FASE: RESPONDER (NIST CSF RS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 4.1 ACCIONES DE CONTENCIÓN APLICADAS
 ──────────────────────────────────────
 [ ] Proceso malicioso terminado (kill -15 ____  PID: ___)
 [ ] Archivo malicioso eliminado (rm /tmp/catalogo_orquideas.pdf)
 [ ] Permisos restaurados (chmod 600 en shadow y id_ed25519)
 [ ] Telnet detenido y deshabilitado
 [ ] DNS corregido en /etc/resolv.conf

 4.2 VERIFICACIÓN POST-CONTENCIÓN
 ────────────────────────────────────
 Sockets abiertos (ss -tulpn): ____________
 Directorio /tmp limpio: [ ] Sí  [ ] No

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BLOQUE 5 — FASE: RECUPERAR (NIST CSF RC)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 5.1 LECCIONES APRENDIDAS
 ─────────────────────────────────────
 a) ¿Por qué el PDF era en realidad un ELF?
    ___________________________________________________

 b) ¿Qué principio viola operar como root?
    ___________________________________________________

 c) ¿Qué relación existe entre NTP y la auditabilidad?
    ___________________________________________________

 5.2 CONTROLES PREVENTIVOS (CIS IG1)
 ─────────────────────────────────────────────────
 [ ] CIS 3.3  — chmod 600 en claves SSH
 [ ] CIS 4.1  — Eliminar servicios no necesarios (Telnet)
 [ ] CIS 4.8  — Deshabilitar protocolos en texto plano
 [ ] CIS 8.2  — NTP activo para timestamps confiables
 [ ] CIS 10.5 — noexec en /tmp

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 FIRMA Y CIERRE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Operario: _______________________
 Fecha de cierre: ____________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## NOTE: Ticket INC-1049 — Anomalía Estación 07

```
TICKET LILIUM-ITSM: INC-1049 — Anomalía en Estación 07
======================================================
ESTADO: Abierto / Prioridad: Alta
ORIGEN: Telemetría de SOC / Alerta automatizada del sistema

DESCRIPCIÓN DEL INCIDENTE:
Se ha detectado un socket persistente no estándar en el
puerto TCP 4444 de la Estación 07. Se presume la presencia
de un script de persistencia ejecutándose en /tmp.

OBJETIVOS DEL ANALISTA DEFENSIVO (NIVEL CIS IG1):
1. [Inventario] Validar qué activos corren en la máquina
   → whoami, ip addr, ps aux
2. [Contención] Terminar el proceso anómalo con kill -15
   → Preserva la integridad de los logs forenses
3. [Control de Acceso] Crear usuario nominal con adduser
   → Evitar cuentas compartidas
4. [Hardening] Permisos 600 en ~/.ssh/id_ed25519
   → Blindar /etc/ssh/sshd_config (PermitRootLogin no)
```

---

## NOTE: Plantilla Matriz de Riesgos

```
PLANTILLA: Matriz de Activos, Amenazas y Riesgos
Módulo 1 — Lab 01 "La Estación Olvidada"
=========================================

1. ACTIVO CRÍTICO:
   - Activo: Servidor invernadero-central / Clave privada SSH
   - Pilar CIA comprometido: Confidencialidad e Integridad

2. AMENAZA:
   - Actor: Proceso no autorizado o actor externo
   - Vector de entrada: Binario en /tmp y socket TCP :4444

3. VULNERABILIDAD:
   - Permisos globales laxos (644 en clave privada)
   - Acceso root directo habilitado en sshd_config
   - Telnet activo en puerto 23 (texto plano)
   - DNS desviado a servidor malicioso 10.66.6.6

4. RESPUESTA AL RIESGO (Módulo 1.1):
   - Estrategia: MITIGAR aplicando controles CIS IG1
   - Control: chmod 600, kill -15, systemctl stop telnet
   - Prioridad: Crítica (impacto en toda la Tríada CIA)
```

---

## NOTE: Diario del Antiguo Cuidador

```
DIARIO: Notas del Antiguo Cuidador
===================================
12 de Octubre —

"El jardín de reliquias no puede quedarse sin telemetría
durante el invierno. Las heladas destruyen los bulbos de
lilium silvestre si la temperatura desciende de los 2°C.

Por eso dejé corriendo esa baliza en /tmp... sé que no
es la mejor práctica, pero era una emergencia.

Temo que alguien descubra que dejé la clave privada con
permisos 644 y el servidor Telnet abierto en el puerto 23.
El DNS también lo cambié temporalmente a 10.66.6.6 para
pruebas, pero nunca lo revertí. Lo siento.

Si alguien encuentra esto: por favor, asegura la estación
antes de que caiga la primera nieve."
```

---

## NOTE: Comandos Defensivos Esenciales

```
GUÍA RÁPIDA: Comandos Defensivos Esenciales de Linux
=====================================================

RECONOCIMIENTO INICIAL
• whoami              → Cuenta activa en la sesión
• ip addr / ip a      → Interfaces y direcciones IP
• uname -a            → Versión del kernel Linux

PROCESOS Y MEMORIA
• ps aux              → Lista estática de procesos
• top                 → Monitor dinámico (q para salir)
• kill -15 <PID>      → Terminación ordenada (SIGTERM)
• kill -9 <PID>       → Desalojo forzado (SIGKILL)

SISTEMA DE ARCHIVOS
• ls -la              → Listado con archivos ocultos (.)
• cat / less / head   → Lectura segura de archivos
• file <archivo>      → Tipo real por magic numbers
• sha256sum <archivo> → Huella hash criptográfica
• find / -name "*.sh" → Búsqueda en el sistema

PERMISOS (chmod octal)
• chmod 600 <archivo> → Solo propietario: leer + escribir
• chmod 644 <archivo> → Propietario: rw | Grupo/Otros: r
• chmod 700 <dir>     → Solo propietario: rwx (directorio)
• chown user:group    → Cambiar propietario y grupo

RED Y SERVICIOS
• ss -tulpn           → Sockets TCP/UDP en escucha
• dig <dominio>       → Consulta DNS
• curl -I <url>       → Cabeceras HTTP
• ping -c 4 <IP>      → Test de conectividad ICMP
• systemctl status    → Estado de un servicio systemd
• systemctl start/stop/restart/disable <servicio>
```
