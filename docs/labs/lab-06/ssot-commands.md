---
lab: lab-06
type: ssot-commands
title: "Referencia de Comandos — Hardening CIS Benchmark"
status: "stub"
---

# GUÍA RÁPIDA: Comandos SSoT — Lab 06 "CIS Hardening"

> Fuente única de verdad (Single Source of Truth) para auditoría y remediación de controles CIS.

---

## FASE 1: Parámetros del Kernel y Servicios

### Verificación de configuración segura del kernel
```bash
sysctl net.ipv4.ip_forward
sysctl net.ipv4.conf.all.rp_filter
```
> CIA: Integridad | CIS: 3.1

### Auditoría de cuentas sin contraseñas o con UID 0
```bash
awk -F: '($3 == "0") {print}' /etc/passwd
```
> CIA: Confidencialidad, Integridad | CIS: 5.4
