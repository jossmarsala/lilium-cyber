---
lab: lab-04
type: notes-seed
title: "Notas iniciales — Políticas de Red Zero-Trust"
status: "stub"
---

# NOTE: Bitácora de Segmentación Zero-Trust

Este archivo define las notas pre-sembradas en la app Notes cuando el usuario inicia Lab 04.

---

## NOTE: Matriz de Zonas y Reglas de Segmentación

```
ZONA ORIGEN       ZONA DESTINO       PUERTO/PROTO    ACCIÓN    JUSTIFICACIÓN
─────────────────────────────────────────────────────────────────────────────
Internet (WAN)    Servidor Web       80, 443 / TCP   ALLOW     Acceso público legítimo
Internet (WAN)    Sensores IoT       Cualquiera      DROP      Aislamiento de dispositivos
Red Gestión       Servidor Web       22 / TCP        ALLOW     Administración SSH interna
Internet (WAN)    Servidor Web       22 / TCP        DROP      Mitigación fuerza bruta
```
