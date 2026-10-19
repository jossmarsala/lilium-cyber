---
lab: lab-02
title: "Detección y Análisis de Phishing Corporativo"
narrative: "Cliente de Correo Corporativo Simulado — Defensa Activa"
status: "stub"
---

# Lab 02 — Phishing Defense

> Este laboratorio está en desarrollo. El contenido será compilado desde este archivo cuando esté listo.

## Fases planificadas

1. Inspección de cabeceras SPF, DKIM y DMARC
2. Análisis de URLs sospechosas y detección de spoofing
3. Identificación de payloads en adjuntos
4. Reporte y contención del incidente

## Comandos de referencia (borrador)

- `nslookup -type=TXT <dominio>` — Consultar registros SPF
- `dig TXT _dmarc.<dominio>` — Verificar política DMARC
- `cat /var/mail/inbox/<correo>.eml` — Leer cabeceras raw del correo

---

> **TODO:** Completar directivas, pistas, guía pedagógica y verificaciones siguiendo
> el mismo esquema que `lab-01/playbook.md`.
