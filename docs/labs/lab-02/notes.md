---
lab: lab-02
type: notes-seed
title: "Notas iniciales — Detección de Phishing"
status: "stub"
---

# NOTE: Bitácora de Triaje de Phishing

Este archivo define las notas pre-sembradas en la app Notes cuando el usuario inicia Lab 02.

---

## NOTE: Ticket SOC — Alerta de Phishing Dirigido

```
TICKET LILIUM-ITSM: INC-2044 — Campaña de Phishing por Suplantación de Identidad
=============================================================================
ESTADO: Abierto / Prioridad: Alta
ORIGEN: Reporte de usuario corporativo (Finanzas)

DESCRIPCIÓN:
Múltiples colaboradores han recibido correos solicitando actualización urgente
de credenciales bancarias provenientes aparentemente del dominio corporativo.

OBJETIVOS DEFENSIVOS:
1. Inspeccionar cabeceras Authentication-Results (SPF, DKIM, DMARC).
2. Extraer dominios y direcciones IP de los servidores de envío (Received: from).
3. Confirmar si existe spoofing o typosquatting en los remitentes.
4. Aplicar bloqueo y cuarentena en el MTA corporativo.
```

---

## NOTE: Matriz de Verificación SPF / DKIM / DMARC

```
REGISTRO     PROPÓSITO                           COMANDO
─────────────────────────────────────────────────────────────────────────────
SPF          Autoriza IPs de envío para el dominio dig TXT <dominio>
DKIM         Firma criptográfica del cuerpo/cabecera openssl dgst -verify ...
DMARC        Política de rechazo/cuarentena      dig TXT _dmarc.<dominio>
```
