---
lab: lab-03
type: ssot-commands
title: "Referencia de Comandos — Seguridad OWASP en APIs"
status: "stub"
---

# GUÍA RÁPIDA: Comandos SSoT — Lab 03 "OWASP API Defense"

> Fuente única de verdad (Single Source of Truth) para auditoría de APIs HTTP y tokens JWT.

---

## FASE 1: Auditoría de Endpoints y Tokens

### Inspección de respuestas HTTP y headers
```bash
curl -i -X GET http://127.0.0.1:8080/api/v1/profile -H "Authorization: Bearer <token>"
```
> CIA: Confidencialidad, Integridad | CIS: 16.1

### Decodificación de tokens JWT
```bash
echo "<jwt_token>" | cut -d. -f2 | base64 -d 2>/dev/null | jq .
```
> CIA: Integridad | CIS: 16.2
