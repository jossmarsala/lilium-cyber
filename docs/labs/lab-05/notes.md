---
lab: lab-05
type: notes-seed
title: "Notas iniciales — Triage de Ransomware"
status: "stub"
---

# NOTE: Bitácora de Incidente Ransomware

Este archivo define las notas pre-sembradas en la app Notes cuando el usuario inicia Lab 05.

---

## NOTE: Ticket INC-5099 — Cifrado Anómalo de Archivos

```
TICKET LILIUM-ITSM: INC-5099 — Cifrado no autorizado en compartido de archivos
=============================================================================
ESTADO: Crítico / Prioridad: P1
ALERTA: Extensiones .locked detectadas en /var/share/plantas/.
DIRECTIVAS:
1. No reiniciar el equipo para preservar claves de cifrado en memoria volátil.
2. Desconectar interfaces de red inmediatamente para detener propagación.
3. Preservar logs de autenticación y rastros del binario malicioso.
```
