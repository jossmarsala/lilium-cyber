---
lab: lab-02
type: ssot-setup-commands
title: "Script SSoT de Inicialización del Entorno Linux — Lab 02"
description: "Comandos de terminal Linux para aprovisionar el escenario de triaje y análisis de phishing"
---

# Script SSoT de Inicialización — Lab 02 "Phishing Defense"

> **Fuente Única de Verdad (Single Source of Truth) para la configuración del sistema operativo emulado.**

```bash
#!/bin/sh
# ==============================================================================
# SSoT SETUP SCRIPT: LAB 02 — PHISHING DEFENSE
# ==============================================================================

echo "[LILIUM] Inicializando escenario Lab 02: Detección y Análisis de Phishing..."

# 1. DIRECTORIOS DE CORREO Y MUESTRAS
mkdir -p /var/mail/inbox
mkdir -p /home/operario/muestras
mkdir -p /etc/postfix

# 2. MUESTRA DE CORREO SOSPECHOSO CON CABECERAS SPOOFED
cat > /var/mail/inbox/notificacion_banco.eml << 'EOF'
From: Soporte Seguridad <seguridad@lilium-bank.local>
Return-Path: <bounce@phish-attacker.xyz>
Received: from mail.phish-attacker.xyz (198.51.100.99)
Authentication-Results: dkim=fail reason="signature missing"; spf=softfail (sender IP 198.51.100.99); dmarc=fail action=none
Subject: [URGENTE] Actualización inmediata de certificado corporativo
Date: Mon, 19 Oct 2026 09:12:00 -0300
Message-ID: <202610190912.fake001@phish-attacker.xyz>

Estimado colaborador:
Su clave de acceso al domo expirará en 2 horas.
Acceda urgentemente al enlace para validar su identidad:
http://198.51.100.99/login-lilium.php
EOF

chmod 644 /var/mail/inbox/*.eml
chown -R 1001:1001 /home/operario/muestras 2>/dev/null || true

clear
printf "\n  Escenario Lab 02 — Deteccion de Phishing Corporativo\n"
printf "  Buzon de correo entrante disponible en /var/mail/inbox/\n\n"
cd /home/operario
```
