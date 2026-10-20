import type { StorageAdapter } from '@react-ui-os/core'
export interface LabNote {
  id: string
  body: string
  createdAt: number
  updatedAt: number
}

export const AUDIT_TEMPLATE = `# 📋 BITÁCORA DE AUDITORÍA TÉCNICA — NIST CSF / CIS Controls
# Estación Botánica Automatizada N.º 4 — Invernadero Central
# Operario: ___________________   Fecha: ___________________

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
 Aplica la TRÍADA CIA (Confidencialidad, Integridad,
 Disponibilidad) a cada activo. Referencia:
 CIS Control 2 (Inventario de Software), CIS Control 3
 (Protección de Datos), NIST CSF ID.AM-2.

 1.1 INVENTARIO DE ACTIVOS CRÍTICOS
 ─────────────────────────────────────
 Activo 1: ___________________________________
   Ruta/IP: __________________________________
   Propietario del activo: ___________________
   Impacto CIA: [ ] Confidencialidad  [ ] Integridad  [ ] Disponibilidad

 Activo 2: ___________________________________
   Ruta/IP: __________________________________
   Propietario del activo: ___________________
   Impacto CIA: [ ] Confidencialidad  [ ] Integridad  [ ] Disponibilidad

 1.2 RESULTADO DEL COMANDO "ps aux"
 ─────────────────────────────────────
 [Pega aquí la salida relevante de: ps aux | grep -v grep]


 1.3 RESULTADO DE "ss -tulpn" (puertos en escucha)
 ─────────────────────────────────────────────────


━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BLOQUE 2 — FASE: PROTEGER (NIST CSF PR)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 [Guía] Registra las vulnerabilidades de permisos y
 credenciales. Referencia: CIS Control 4 (Configuración
 Segura), CIS Control 3.3 (Protección de Material
 Criptográfico), NIST CSF PR.AC.

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

 Archivo personalizado: _________________________
   Permisos actuales: ________  Permisos correctos: ______
   Justificación del cambio: ____________________
   Estado: [ ] Pendiente  [ ] Mitigado

 2.2 SERVICIOS VULNERABLES IDENTIFICADOS
 ─────────────────────────────────────────
 Servicio: in.telnetd (Puerto 23 — Texto plano)
   Riesgo CIA: Confidencialidad (credenciales expuestas)
   Acción correctiva: sudo systemctl stop telnet.service
   Estado: [ ] Pendiente  [ ] Mitigado

 Otro servicio: _________________________________
   Puerto: _______  Protocolo: ___________________
   Riesgo: _______________________________________
   Acción: _______________________________________
   Estado: [ ] Pendiente  [ ] Mitigado

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BLOQUE 3 — FASE: DETECTAR (NIST CSF DE)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 [Guía] Documenta los hallazgos obtenidos directamente
 desde la terminal Linux. Distingue entre ANOMALÍAS
 (comportamientos fuera de norma) y AMENAZAS CONFIRMADAS
 (actividad maliciosa verificada mediante comandos).
 Referencia: NIST CSF DE.AE, CIS Control 8 (Gestión
 de Registros de Auditoría).

 3.1 PROCESOS SOSPECHOSOS (ps aux)
 ─────────────────────────────────────
 Proceso 1: polilla_emisora
   Tipo: [x] Amenaza Real  [ ] Falso Positivo
   Usuario que lo ejecuta: www-data
   PID detectado con: $ ps aux | grep polilla
   PID: _________
   Evidencia (pega salida de ps aux aqui):


   CPU observada: ________%  Conexion: 198.51.100.44:4444
   Accion: kill -15 <PID>  o  kill -9 <PID>
   Estado: [ ] Activo  [ ] Terminado

 Proceso 2: riego_nocturno.sh
   Tipo: [ ] Amenaza Real  [x] Falso Positivo
   Usuario que lo ejecuta: cuidador
   Evidencia: $ cat /opt/sensores/riego_nocturno.sh
     → Solo riega los helechos a las 03:00 AM (benigno)
   Decision justificada: [ ] Mantener en ejecucion
   Razonamiento: _________________________________

 3.2 SOCKETS EN ESCUCHA (ss -tulpn)
 ─────────────────────────────────────
 [Guia] Ejecuta: ss -tulpn  y documenta los puertos abiertos.

 Puerto sospechoso: :4444
   Proceso asociado: polilla_emisora
   Accion: cerrar con kill -15 <PID>

 Puerto de riesgo: :23 (Telnet — texto plano)
   Servicio: in.telnetd
   Accion: sudo systemctl stop telnet.service

 3.3 ANALISIS DE LOGS (/var/log/auth.log)
 ─────────────────────────────────────
 [Guia] Comando: grep -i "failed" /var/log/auth.log
 NTP activo para timestamps confiables: [ ] Si  [ ] No
 Comando para activar NTP: sudo systemctl start ntp.service

 Evento mas critico en auth.log:
   Timestamp: _____________  IP atacante: _____________
   Cadena de eventos (orden cronologico):
   1. ___________________________________________
   2. ___________________________________________
   3. ___________________________________________

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BLOQUE 4 — FASE: RESPONDER (NIST CSF RS)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 [Guía] Documenta las acciones de contención y
 erradicación aplicadas. Cada acción debe ser
 auditablemente verificable. Referencia:
 NIST CSF RS.MI, CIS Control 13 (Protección de Redes).

 4.1 ACCIONES DE CONTENCIÓN APLICADAS
 ──────────────────────────────────────
 [ ] Proceso malicioso terminado:
       Comando: kill -15 ____  o  kill -9 ____
       PID objetivo: _________
       Resultado esperado: socket :4444 cerrado

 [ ] Archivo malicioso eliminado o aislado:
       Comando: rm /tmp/catalogo_orquideas.pdf
       o mover a cuarentena: mv /tmp/catalogo_orquideas.pdf /root/cuarentena/
       SHA-256 antes de eliminar: ____________________

 [ ] Permisos restaurados:
       Archivo: ___________  Permiso aplicado: _________

 [ ] Servicio detenido:
       sudo systemctl stop ___________________________

 4.2 VERIFICACIÓN POST-CONTENCIÓN
 ────────────────────────────────────
 Salud del host (procesos activos ps aux): _______%
 Procesos amenazantes restantes (ps aux): ___________
 Sockets abiertos restantes (ss -tulpn): ____________
 Directorio /tmp limpio: [ ] Sí  [ ] No

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 BLOQUE 5 — FASE: RECUPERAR (NIST CSF RC)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 [Guía] ¿Qué medidas preventivas evitarían este
 incidente en el futuro? Alineado con NIST CSF RC.IM
 y CIS Control 17 (Gestión de Respuesta a Incidentes).

 5.1 LECCIONES APRENDIDAS
 ─────────────────────────────────────
 a) ¿Por qué el archivo PDF era en realidad un ELF?
    ___________________________________________________

 b) ¿Por qué /tmp no debería tener el bit de ejecución?
    ___________________________________________________

 c) ¿Qué principio de seguridad viola operar como root?
    ___________________________________________________

 d) ¿Qué relación existe entre NTP y la auditabilidad?
    ___________________________________________________

 5.2 CONTROLES PREVENTIVOS PROPUESTOS (CIS IG1)
 ─────────────────────────────────────────────────
 [ ] CIS 3.3  — Gestión del material criptográfico: chmod 600 en claves SSH
 [ ] CIS 4.1  — Configuración segura: Eliminar servicios no necesarios (Telnet)
 [ ] CIS 6.2  — Cuentas inactivas: Crear usuario nominal, no operar como root
 [ ] CIS 8.2  — Logs centralizados: Mantener NTP activo para timestamps confiables
 [ ] CIS 10.5 — Whitelist de ejecutables: Prohibir ejecución en /tmp (noexec)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 FIRMA Y CIERRE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Operario responsable: _______________________
 Fecha de cierre: ____________________________
 Revisado por (instructor): __________________

 Declaración: "Certifico que la información registrada
 en esta bitácora es fiel reflejo de las acciones
 técnicas realizadas durante el laboratorio."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`

import { getCompiledLab } from '@/data/compiledLabs'

const STORAGE_KEY = 'notes'

export function seedLabNotes(storage: StorageAdapter, targetLabId?: string): void {
  try {
    const labId =
      targetLabId ||
      (typeof window !== 'undefined'
        ? new URLSearchParams(window.location.search).get('lab') || 'lab-01'
        : 'lab-01')

    const seededFlag = `lilium_notes_seeded_${labId}_v2`
    const isSeeded = storage.get<boolean>(seededFlag)
    if (isSeeded) return

    const now = Date.now()
    const compiled = getCompiledLab(labId) ?? getCompiledLab('lab-01')

    let labNotes: LabNote[] = []

    if (compiled && compiled.notes.length > 0) {
      labNotes = compiled.notes.map((n, idx) => ({
        id: n.id,
        body: n.body,
        createdAt: now - (compiled.notes.length - idx) * 3_600_000,
        updatedAt: now - (compiled.notes.length - idx) * 3_600_000,
      }))

      // If the compiled lab has SSoT commands and not already a note, seed it as a note
      if (compiled.ssotCommands && !labNotes.some((n) => n.body.includes('SSoT'))) {
        labNotes.push({
          id: `${labId}-note-ssot-commands`,
          body: compiled.ssotCommands,
          createdAt: now,
          updatedAt: now,
        })
      }
    } else {
      // Fallback default notes for Lab 01
      labNotes = [
        {
          id: 'note-audit-template',
          body: AUDIT_TEMPLATE,
          createdAt: now,
          updatedAt: now,
        },
      ]
    }

    const existing = storage.get<LabNote[]>(STORAGE_KEY)
    if (!existing || existing.length === 0) {
      storage.set(STORAGE_KEY, labNotes)
    }
    storage.set(seededFlag, true)
  } catch (err) {
    console.warn('[seedLabNotes] Error seeding notes:', err)
  }
}

