---
lab: lab-03
title: "Mitigación de Vulnerabilidades OWASP en APIs"
narrative: "Servicios Backend y Microservicios — Seguridad en APIs"
status: "stub"
---

# Lab 03 — OWASP API Defense

> Este laboratorio está en desarrollo. El contenido será compilado desde este archivo cuando esté listo.

## Fases planificadas

1. Identificación de vulnerabilidades Broken Object Level Authorization (BOLA)
2. Detección de inyecciones SQL ciegas y evasión de filtros
3. Verificación y hardening de tokens JWT
4. Configuración segura de encabezados CORS y rate limiting

## Comandos de referencia (borrador)

- `curl -i -H "Authorization: Bearer <token>" http://api.local/v1/user`
- `jq . /var/log/nginx/api_access.log`
