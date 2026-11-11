# Component Showcase <!-- id: showcase, hidden: true, icon: ToolsIcon -->

Catálogo exhaustivo y entorno interactivo de pruebas para todos los componentes de la plataforma de documentación y diseño de Cyber Range. Esta sección oculta sirve como banco de pruebas visual y guía de implementación técnica para desarrolladores y autores de contenido.

## Callouts & Alertas <!-- id: callouts, icon: Alert01Icon -->

Los callouts comunican información contextual clasificada por severidad. Se adaptan a notas informativas, consejos de optimización, advertencias operativas y riesgos críticos.

### Variantes Estándar

> [!NOTE]
> Este es un callout informativo (`note`). Se utiliza para contextualizar conceptos, citar estándares como ISO/IEC 27001 o detallar dependencias arquitectónicas secundarias.

> [!TIP]
> Este es un callout de consejo (`tip`). Es ideal para resaltar buenas prácticas, optimizaciones de rendimiento y trucos como el uso de índices b-tree o cachés distribuidas.

> [!WARNING]
> Este es un callout de advertencia (`warning`). Debe utilizarse cuando una acción puede ocasionar fallos de sincronización, incompatibilidades de versión o fugas accidentales de parámetros en endpoints públicos.

> [!CRITICAL]
> Este es un callout de severidad crítica (`critical`). Empléalo ante riesgos inminentes de seguridad, compromiso del kernel, ejecución remota de código (RCE) o borrado destructivo de particiones.

### Etiquetas Personalizadas

Puedes sobreescribir la etiqueta por defecto agregando un sufijo tras los dos puntos:

> [!WARNING:Acceso Restringido al Kernel]
> La modificación de parámetros `sysctl` en caliente requiere privilegios de `CAP_SYS_ADMIN` en el contenedor Docker.

> [!CRITICAL:Amenaza Activa Detectada]
> Se ha detectado una anomalía de tráfico outbound hacia una IP catalogada en la lista de bloqueo de C2 (Command & Control). Proceda con aislamiento perimetral.

> [!NOTE:Requisito de Cumplimiento NIST CSF]
> Esta política satisface el control PR.AC-4 del marco NIST para la segregación de privilegios en el plano de control.

### Callouts con Listas de Viñetas

Los callouts admiten listas de viñetas (`-`) para agrupar recomendaciones, controles o procedimientos clave:

> [!TIP:Buenas Prácticas de Red]
> Pautas esenciales para mitigar vectores de ataque en infraestructura crítica:
>
> - Deshabilitar servicios legados no cifrados como Telnet, FTP o HTTP plano.
> - Habilitar autenticación multifactor (MFA) obligatoria en todas las sesiones VPN.
> - Segmentar la red en zonas DMZ con firewalls perimetrales e inspección profunda de paquetes (DPI).

### Especificación de Sintaxis

```markdown:docs.md
> [!NOTE]
> Nota informativa con soporte para `código en línea` y **texto en negrita**.

> [!WARNING:Título Personalizado]
> Advertencia con etiqueta adaptada al contexto del procedimiento.

> [!TIP:Recomendaciones]
> Texto introductorio con lista de viñetas:
>
> - Primer punto clave
> - Segundo punto clave
```

## Bloques de Código <!-- id: code-blocks, icon: CommandLineIcon -->

Los bloques de código ofrecen soporte para resaltado de sintaxis enriquecido, numeración de líneas, botón integrado de copiado al portapapeles y barra de cabecera con pestaña de archivo o terminal.

### Comandos de Terminal (`bash`)

```bash:terminal
# Clonar el entorno seguro de pruebas
git clone https://github.com/cyber-range/telemetry-agent.git
cd telemetry-agent

# Instalar dependencias del sistema y compilar binarios
npm install
npm run build -- --production
```

### TypeScript y Tipado Estricto

```typescript:src/middleware/jwtValidator.ts
import type { Request, Response, NextFunction } from 'express'
import { verifyJwtToken } from '@/utils/crypto'

export interface AuthenticatedUser {
  id: string
  role: 'operator' | 'admin' | 'observer'
  fingerprint: string
}

export async function requireAuthorization(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/, '')
  if (!token) {
    return res.status(401).json({ error: 'Missing session authorization token' })
  }

  try {
    const session = await verifyJwtToken<AuthenticatedUser>(token)
    req.user = session
    next()
  } catch (error) {
    res.status(403).json({ error: 'Invalid or revoked token signature' })
  }
}
```

### Configuración en Formato JSON

```json:config/cyber-range.production.json
{
  "environment": "production",
  "telemetry": {
    "enabled": true,
    "port": 8443,
    "flushIntervalMs": 500,
    "maxBatchSize": 2048
  },
  "security": {
    "tls": {
      "minVersion": "TLSv1.3",
      "cipherSuites": ["TLS_AES_256_GCM_SHA384", "TLS_CHACHA20_POLY1305_SHA256"]
    },
    "rateLimiting": {
      "requestsPerMinute": 120,
      "burstCapacity": 30
    }
  }
}
```

### Script de Detección en Python

```python:scripts/honeypot_sniffer.py
import socket
import json
from datetime import datetime

def inspect_inbound_packet(packet_payload: bytes, source_addr: str) -> bool:
    """Inspecciona paquetes de red capturados en busca de cadenas maliciosas."""
    signatures = [b"union select", b"cmd.exe", b"/bin/sh", b"powershell -nop"]
    for signature in signatures:
        if signature in packet_payload.lower():
            print(f"[{datetime.utcnow().isoformat()}] ALERTA: Coincidencia con {signature} desde {source_addr}")
            return True
    return False
```

## Pasos Interactivos <!-- id: interactive-steps, icon: Layers01Icon -->

El componente de pasos interactivos (`:::steps`) permite modelar flujos de trabajo secuenciales, instrucciones de instalación y procedimientos operativos de respuesta a incidentes.

:::steps

### 1. Identificar y aislar el host comprometido

Desconecta la máquina afectada de la red local para impedir el movimiento lateral del atacante, manteniendo la máquina encendida para preservar la memoria volátil:

```bash:terminal
sudo iptables -A INPUT -j DROP
sudo iptables -A OUTPUT -p tcp --dport 514 -j ACCEPT  # Permitir exclusivamente syslog forense
```

### 2. Capturar volcado de memoria RAM (Forense)

Extrae una instantánea de la memoria volátil utilizando herramientas especializadas como LiME o LiME-Forensics antes de reiniciar o alterar procesos en memoria:

```bash:terminal
sudo lime-collector --output /mnt/external-drive/incident-dump-01.raw
```

> outcome: Volcado de 16 GB completado y verificado con suma SHA-256

### 3. Ejecutar análisis heurístico de firmas con Yara

Analiza los binarios en ejecución contra la base de datos de firmas de software malicioso para determinar el vector de ataque y la familia de malware:

```bash:terminal
yara -r /rules/ransomware_signatures.yar /proc/*/exe
```

> outcome: Coincidencia detectada: Trojan.Linux.Backdoor.Generic (PID 4821)

### 4. [x] Revocar tokens de sesión y claves comprometidas

Deshabilita de forma inmediata todas las claves SSH activas y expira las sesiones JWT del usuario sospechoso en el proveedor de identidad central:

> outcome: 38 tokens de sesión invalidados y 4 pares de claves SSH revocados

### 5. Restaurar servicios a partir de respaldos inmutables

Restaura la configuración limpia y los datos desde una copia de seguridad fuera de línea (_Air-Gapped_) cuya integridad haya sido auditada previamente:

> outcome: Servicios restablecidos exitosamente con verificación de integridad

:::

## Tablas de Datos <!-- id: tables, icon: Database01Icon -->

Las tablas permiten organizar matrices de riesgo, especificaciones de hardware, comparativas de herramientas y parámetros de configuración con scroll horizontal responsivo.

### Matriz de Evaluación de Amenazas Cibernéticas

| Amenaza / CVE    | Severidad          | Vector de Ataque             | Impacto en el Negocio                      | Mitigación Recomendada                                  |
| :--------------- | :----------------- | :--------------------------- | :----------------------------------------- | :------------------------------------------------------ |
| `CVE-2024-3094`  | **Crítico (9.8)**  | Inyección en `xz-utils`      | Acceso root no autenticado en SSH          | Degradar de inmediato a versión `5.4.6` aislada         |
| `CVE-2023-4863`  | **Alto (8.8)**     | Desbordamiento en `libwebp`  | Ejecución de código arbitrario             | Aplicar parche oficial y actualizar dependencias        |
| `CVE-2023-44487` | **Alto (7.5)**     | Ataque HTTP/2 Rapid Reset    | Caída por denegación de servicio (DoS)     | Habilitar limitadores de tasa en reverse proxy          |
| `CVE-2021-44228` | **Crítico (10.0)** | Inyección JNDI en Log4j      | Control total del servidor de aplicaciones | Actualizar a Log4j 2.17+ y deshabilitar búsqueda remota |
| Fuerza Bruta RDP | **Medio (5.3)**    | Diccionario en puerto `3389` | Intento de intrusión por credencial débil  | Requerir VPN con MFA y bloquear tras 5 intentos         |

_Matriz de Evaluación de Amenazas Cibernéticas y Respuestas Operativas._

### Requisitos Mínimos de Infraestructura

| Componente         | Requisito Mínimo                      | Recomendado                          | Verificación de Estado   |
| :----------------- | :------------------------------------ | :----------------------------------- | :----------------------- |
| **CPU**            | 2 núcleos (x86_64 / ARM64)            | 4 núcleos de alta frecuencia         | `nproc` o `lscpu`        |
| **Memoria RAM**    | 4 GB dedicados                        | 8 GB con memoria swap activa         | `free -h`                |
| **Almacenamiento** | 20 GB SSD NVMe                        | 50 GB con cifrado LUKS               | `df -h /`                |
| **Node.js**        | Versión 18.x LTS                      | Versión 20.x o 22.x LTS              | `node -v`                |
| **Navegador Web**  | Chrome 110+, Safari 16+, Firefox 115+ | Última versión con aceleración WebGL | Verificación en DevTools |

_Especificaciones técnicas para despliegue y simulación local._

## Grupos y Parámetros <!-- id: groups-badges, icon: ServerIcon -->

Los grupos estructuran variables de entorno, banderas CLI y opciones de configuración con etiquetas visuales de obligatoriedad (`[required]`, `[optional]`, `[default]`).

:::group title="Variables de Entorno del Cyber Range" description=".env.production"

- **CYBER_RANGE_API_URL** [required]: Dirección base del backend de telemetría y escenarios simulados.
- **DATABASE_REPLICA_URL** [required]: Cadena de conexión cifrada hacia la base de datos réplica de solo lectura.
- **PORT** [default]: Puerto de escucha para el servidor web local. Por defecto `5173`.
- **TELEMETRY_LOG_LEVEL** [default]: Nivel de detalle de registro en consola. Valores: `info`, `warn`, `debug`.
- **METRICS_SAMPLING_RATE** [optional]: Tasa de muestreo de trazas de rendimiento entre `0.0` y `1.0`.
- **ENABLE_ANOMALY_DETECTOR**: Activa el motor heurístico local para alertar sobre patrones de red inusuales.
  :::

:::group title="Banderas CLI de Ejecución" description="npx cyber-range-cli run [opciones]"

- **--scenario** [required]: Nombre o identificador del escenario de ciberseguridad a ejecutar (ej. `ransomware-triage`).
- **--concurrency** [default]: Número de agentes defensivos simultáneos en la simulación. Por defecto `4`.
- **--dry-run** [optional]: Ejecuta la simulación en modo solo lectura sin persistir cambios en disco.
- **--output-dir** [optional]: Directorio de destino para el informe forense final en formato JSON y PDF.
  :::

## Árbol de Archivos <!-- id: file-trees, icon: Folder01Icon -->

El bloque de árbol de archivos representa esquemas de directorios y arquitectura de proyectos con tipografía monospace y anotaciones explicativas.

```filetree:Estructura del Repositorio Cyber Range
cyber-range/
├── docs/                      # Documentación modular en Markdown (00-06, showcase)
├── scripts/
│   └── md-to-docs.mjs         # Compilador Markdown a estructura JSON
├── src/
│   ├── components/            # Biblioteca de componentes visuales
│   │   ├── CodeBlock.tsx      # Visor de código con pestañas y copiado
│   │   ├── DocsCallout.tsx    # Mensajes de advertencia y notas
│   │   ├── DocsContent.tsx    # Orquestador y renderizador dinámico
│   │   ├── DocsList.tsx       # Listas y tarjetas de grupos clave-valor
│   │   ├── DocsSidebar.tsx    # Navegación en árbol lateral (BranchedMenu)
│   │   ├── DocsSteps.tsx      # Pasos numerados con estados de éxito
│   │   ├── DocsTable.tsx      # Tablas responsivas con formato markdown
│   │   ├── Pill.tsx           # Píldoras de estado, badges e indicadores
│   │   ├── RubberSegment.tsx  # Conmutador táctil segmentado con física
│   │   └── SpecularButton.tsx # Botón 3D con reflejo especular en WebGL
│   ├── data/
│   │   ├── docs.json          # Árbol de documentación compilado
│   │   └── docs.ts            # Tipos e interfaces TypeScript estrictas
│   ├── pages/
│   │   ├── DocsPage.tsx       # Navegador dinámico de documentación
│   │   └── HomePage.tsx       # Página principal con hero y BentoGrid
│   └── utils/
│       ├── docIcons.ts        # Registro centralizado de iconos HugeIcons
│       └── renderInline.tsx   # Parser de negrita, cursiva y código
├── package.json               # Dependencias y scripts de construcción
└── vite.config.ts             # Configuración del empaquetador Vite
```

## Tipografía y Listas <!-- id: typography-lists, icon: Book02Icon -->

Demostración de jerarquía de encabezados, ritmo vertical de párrafos y listas ordenadas y no ordenadas.

### Jerarquía de Encabezados

#### Encabezado de Nivel 4 (H4)

Este es un encabezado menor utilizado para subsecciones específicas y notas técnicas directas.

### Formato de Texto en Línea

Los párrafos soportan múltiples tipos de formato combinables de manera fluida:

- **Texto en negrita (`strong`):** Para destacar conceptos críticos como **Gestión de Riesgos** o **Integridad de Datos**.
- _Texto en cursiva (`em`):_ Para términos técnicos en otros idiomas como _zero-day exploit_ o _man-in-the-middle_.
- `Código en línea (`code`):` Para comandos como `npm test`, rutas como `src/data/docs.ts` o variables como `process.env.NODE_ENV`.
- **Combinaciones:** Puedes combinar negrita con código: **`TOKEN_SECRET`**, o negrita con cursiva: **_Prioridad Alta_**.

### Listas con Viñetas (No Ordenadas) y Sub-niveles

- **Prevención proactiva:** Implementación de cortafuegos de aplicaciones web (WAF) y filtrado DNS.
- **Monitoreo continuo y auditoría:** Recolección de registros de eventos en un sistema centralizado de gestión de información y eventos de seguridad (SIEM).
  - **Detección de anomalías:** Análisis comportamental de tráfico anómalo en tiempo real.
  - **Correlación de eventos:** Agrupación automatizada de trazas provenientes de múltiples sensores.
- **Capacitación del personal:** Programas periódicos de concienciación sobre ingeniería social.
- **Pruebas de penetración periódicas:** Evaluaciones de seguridad ofensiva para identificar vulnerabilidades.

### Listas Numeradas (Ordenadas) con Sub-niveles

1. **Fase de Preparación:** Establecer políticas defensivas y herramientas forenses.
2. **Fase de Detección y Análisis:** Identificar anomalías y determinar el alcance.
   a) **Triaje inicial:** Clasificación de severidad y recolección de telemetría.
   b) **Análisis forense:** Examen de volcados de memoria y artefactos en disco.
3. **Fase de Contención:** Aislar los sistemas afectados para prevenir la propagación.
4. **Fase de Erradicación:** Eliminar puertas traseras y cuentas comprometidas.
5. **Fase de Lecciones Aprendidas:** Documentar el incidente, revisar la matriz de riesgos y actualizar los procedimientos de defensa.

## Componentes UI Interactivos <!-- id: ui-components, icon: CpuIcon -->

Además de los bloques de documentación de texto, Cyber Range cuenta con una suite de componentes UI de diseño avanzado diseñados para interacción en tiempo real:

:::preview component="all"
:::

### Guía de Uso de Componentes en Código TSX

```tsx:src/components/MyCustomPage.tsx
import SpecularButton from '@/components/SpecularButton'
import { Pill } from '@/components/Pill'
import RubberSegment from '@/components/RubberSegment'

export function DashboardHeader() {
  return (
    <div className="header-container">
      {/* Botón con reflejo dinámico en WebGL */}
      <SpecularButton onClick={() => console.log('Simulating...')}>
        Ejecutar Simulación
      </SpecularButton>

      {/* Píldoras de estado con indicadores pulsantes */}
      <Pill variant="dark" dot dotActive badge="PRO">
        Sistema en Línea
      </Pill>

      {/* Selector elástico con física de resorte */}
      <RubberSegment
        items={['Monitoreo', 'Defensa', 'Forense']}
        defaultValue="Monitoreo"
        onChange={(val) => console.log('Modo seleccionado:', val)}
      />
    </div>
  )
}
```

## Kitchen Sink (Todos Juntos) <!-- id: kitchen-sink, icon: Wrench01Icon -->

Esta página integra **absolutamente todos** los componentes de la documentación en un escenario real y cohesivo de respuesta ante un ciberataque de ransomware empresarial.

### 01. Contexto del Incidente

A las `03:42 UTC`, el sistema de detección perimetral generó una alarma tras registrar múltiples intentos de cifrado de archivos en el clúster de base de datos de producción `db-node-04`.

> [!CRITICAL:Amenaza Activa de Ransomware]
> Se ha detectado una cepa de ransomware con propagación lateral activa mediante explotación de SMB. Proceda de inmediato a la contención física y lógica de la subred `10.240.12.0/24`.

:::group title="Credenciales de Operación de Emergencia" description="Gestor de Secretos Vault"

- **INCIDENT_TICKET_ID** [required]: Identificador único de seguimiento `INC-2026-9042`.
- **WAR_ROOM_BRIDGE** [required]: Enlace seguro a la sala de crisis técnica.
- **ISOLATION_STRATEGY** [default]: Modalidad de aislamiento `StrictQuarantine` con preservación de RAM.
- **FORENSIC_OFFICER**: Responsable a cargo de la custodia de evidencias digitales.
  :::

### 02. Protocolo de Aislamiento y Contención

Siga de manera rigurosa los pasos indicados a continuación para mitigar el avance del ataque:

:::steps

### 1. Desconectar la interfaz de red del nodo afectado

Ejecuta el corte de conectividad inmediata a nivel de hipervisor o tabla de enrutamiento local:

```bash:terminal
ip link set dev eth0 down
```

### 2. Preservar la memoria RAM para análisis de claves criptográficas

Extrae la memoria antes de reiniciar el nodo, ya que las claves de descifrado temporal suelen residir en memoria volátil:

```bash:terminal
sudo dd if=/dev/fmem of=/evidence/ram_snapshot.bin bs=1M
```

> outcome: Volcado de 32 GB guardado en almacenamiento externo cifrado

### 3. [x] Aislar credenciales de dominio de Active Directory

Inhabilita la cuenta de servicio comprometida y fuerza el cambio de contraseña en todas las cuentas con privilegios de administrador de dominio:

> outcome: 12 cuentas de administración temporalmente bloqueadas

:::

### 03. Evaluación de Daños y Superficie Afectada

| Servidor / Host   | Rol del Sistema             | Estado Actual                    | Datos Comprometidos | Nivel de Riesgo |
| :---------------- | :-------------------------- | :------------------------------- | :------------------ | :-------------- |
| `db-node-04`      | Base de datos relacional    | **Aislado / En cuarentena**      | 14 tablas cifradas  | **Crítico**     |
| `api-gateway-01`  | Puerta de enlace perimetral | **Operativo (Monitoreado)**      | Ninguno detectado   | **Bajo**        |
| `storage-nas-02`  | Almacenamiento de archivos  | **Bloqueado (Solo lectura)**     | Respaldos a salvo   | **Medio**       |
| `auth-service-01` | Servidor de autenticación   | **Operativo (Claves renovadas)** | Sin anomalías       | **Bajo**        |

_Resumen de auditoría de hosts inspeccionados en la primera hora de crisis._

### 04. Inspección del Binario Involucrado

```python:scripts/ransomware_triage.py
import hashlib
import os

def calculate_evidence_hash(filepath: str) -> str:
    """Calcula el hash SHA-256 de una muestra sospechosa preservando metadatos."""
    sha256 = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(8192):
            sha256.update(chunk)
    return sha256.hexdigest()

sample_path = "/quarantine/payload.elf"
if os.path.exists(sample_path):
    print("Firma del artefacto:", calculate_evidence_hash(sample_path))
```

### 05. Topología de Infraestructura en Cuarentena

```filetree:Topología de Segmentos Aislados
datacenter-prod/
├── dmz-zone/             # Zona perimetral accesible desde Internet
│   ├── web-proxy-01      [ONLINE]
│   └── web-proxy-02      [ONLINE]
├── internal-zone/        # Red interna de aplicaciones
│   ├── app-cluster-01    [ONLINE]
│   └── app-cluster-02    [ONLINE]
└── secure-db-zone/       # Subred de bases de datos
    ├── db-node-01        [ONLINE]
    ├── db-node-02        [ONLINE]
    ├── db-node-03        [ONLINE]
    └── db-node-04        [AISLADO / CUARENTENA]
```

### 06. Conclusiones y Tareas de Cierre

- **Confirmación de copias inmutables:** Se verificó que los respaldos en frío (_air-gapped_) de las 00:00 UTC están intactos.
- **Análisis de causa raíz:** El vector inicial de entrada fue una credencial VPN sin segundo factor de autenticación (MFA).
- **Notificación regulatoria:** Se activó el plazo legal de 72 horas para reporte ante el organismo de protección de datos.
- **Refuerzo defensivo:** Se habilitó autenticación basada en hardware FIDO2 en todas las cuentas de infraestructura.
