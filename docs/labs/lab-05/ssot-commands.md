---
lab: lab-05
type: ssot-commands
title: "Referencia de Comandos — Triage de Ransomware"
status: "stub"
---

# GUÍA RÁPIDA: Comandos SSoT — Lab 05 "Ransomware Triage"

> Fuente única de verdad (Single Source of Truth) para respuesta a incidentes de cifrado no autorizado.

---

## FASE 1: Aislamiento y Búsqueda de Artefactos

### Aislamiento de red inmediato
```bash
sudo ip link set eth0 down
```
> CIA: Disponibilidad, Confidencialidad | CIS: 17.1

### Búsqueda de archivos modificados recientemente
```bash
find / -type f -mmin -60 2>/dev/null | grep -E "\.(locked|crypto|enc)$"
```
> CIA: Integridad | CIS: 8.5
