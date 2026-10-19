---
lab: lab-03
type: notes-seed
title: "Notas iniciales — Seguridad OWASP en APIs"
status: "stub"
---

# NOTE: Bitácora de Auditoría OWASP API

Este archivo define las notas pre-sembradas en la app Notes cuando el usuario inicia Lab 03.

---

## NOTE: Ticket INC-3011 — Fuga de Datos por Endpoint Expuesto

```
TICKET LILIUM-ITSM: INC-3011 — Vulnerabilidad BOLA reportada en /api/v1/users
===========================================================================
ESTADO: En Investigación / Prioridad: Crítica
HALLAZGO: Modificando el parámetro ID en la petición REST se obtienen perfiles de terceros sin validación de rol.
ACCIONES:
- Implementar validación estricta de propiedad de recursos en el controlador.
- Validar firma criptográfica del JWT (evitar algoritmo 'none').
```
