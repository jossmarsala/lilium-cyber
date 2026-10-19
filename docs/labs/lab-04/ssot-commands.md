---
lab: lab-04
type: ssot-commands
title: "Referencia de Comandos — Políticas de Red Zero-Trust"
status: "stub"
---

# GUÍA RÁPIDA: Comandos SSoT — Lab 04 "Zero-Trust Network"

> Fuente única de verdad (Single Source of Truth) para segmentación y políticas de firewall.

---

## FASE 1: Filtrado y Reglas de Red

### Inspección de interfaces y rutas
```bash
ip addr show
ip route show
```
> CIA: Disponibilidad | CIS: 12.1

### Políticas de filtrado con iptables
```bash
sudo iptables -L -v -n
sudo iptables -A INPUT -p tcp --dport 22 -s 10.0.1.0/24 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 22 -j DROP
```
> CIA: Confidencialidad, Integridad | CIS: 4.4
