# 1) Comprender <!-- id: layer-1 -->

Everything you need to set up and run the Cyber Range locally for the first time.

## Fundamentos <!-- id: introduction, icon: Book02Icon -->

# 01. UNDERSTAND

La ciberseguridad consiste en proteger los sistemas, la información y las operaciones frente a amenazas que puedan comprometer su funcionamiento. Para una organización, esto no implica únicamente prevenir ataques: también significa preservar la confianza, reducir pérdidas y mantener la continuidad del negocio.

## 1.1. Fundamentos de ciberseguridad y gestión del riesgo

Tradicionalmente, la ciberseguridad ha sido considerada un problema exclusivo de los departamentos de tecnología. Sin embargo, en el entorno interconectado actual, un fallo en los sistemas de información detiene por completo la producción, la facturación y la prestación de servicios.

La ciberseguridad es la práctica de garantizar la confidencialidad, integridad y disponibilidad de la información mediante la protección de redes, dispositivos, personas y datos contra el acceso no autorizado o la explotación delictiva. Su propósito fundamental es minimizar riesgos y posibles daños para garantizar la continuidad operativa del negocio.

Para las pequeñas y medianas empresas (PyMEs), la ciberseguridad es una necesidad de supervivencia. Estas organizaciones suelen tener una tolerancia muy baja al tiempo de inactividad, ya que su principal preocupación es mantener las operaciones comerciales diarias. Además, las PyMEs suelen contar con experiencia técnica limitada y presupuestos ajustados, lo que las convierte en objetivos atractivos y altamente vulnerables si no adoptan medidas defensivas fundamentales.

### El impacto en el negocio

Un incidente de seguridad rara vez se limita a la pérdida de un equipo o a la caída temporal de un servidor. Las consecuencias se extienden a través de toda la estructura de la organización y pueden clasificarse en varias dimensiones críticas:

- **Impacto financiero:** Las brechas de seguridad y los ataques de software malicioso generan consecuencias económicas directas. Esto incluye la interrupción de operaciones, los costos asociados a la recuperación de sistemas y restauración de datos, y las posibles sanciones legales o multas por el incumplimiento de normativas de protección de datos.

- **Impacto operativo y en la disponibilidad:** Los incidentes dirigidos a los sistemas de tecnología de la información afectan directamente el servicio que estos ofrecen. Cuando los datos no están disponibles o los sistemas colapsan, la empresa no puede cumplir con sus compromisos diarios, afectando la cadena de suministro y la entrega de valor.

- **Robo de información y exposición legal:** Almacenar datos sensibles de clientes, empleados y proveedores implica un riesgo inherente. La filtración de Información de Identificación Personal (PII, por sus siglas en inglés) expone a las personas a fraudes y acarrea graves responsabilidades legales para la organización que no supo custodiarla.

- **Daño a la reputación:** Una brecha de seguridad puede afectar gravemente la confianza del mercado. Los clientes pueden optar por trasladar su negocio a competidores que les brinden mayor seguridad, dificultando la retención y la atracción de nuevos clientes o inversores.

### La tríada CIA: El núcleo de la protección

Para comprender qué se intenta proteger, la industria utiliza un modelo fundamental conocido como la tríada CIA (por sus siglas en inglés: _Confidentiality, Integrity, Availability_). Este modelo ayuda a las organizaciones a evaluar los riesgos y a establecer controles y políticas de seguridad adecuados.

Cualquier esfuerzo defensivo debe apuntar a preservar - uno o más- de estos tres pilares:

| Principio            | Definición                                                                                                                                                        | Ejemplo en el entorno empresarial                                                                                                                                |
| :------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Confidencialidad** | Implica que solo los usuarios autorizados pueden acceder a datos o activos específicos. Se enfoca en restringir la visualización y copia de información sensible. | Un sistema de nómina donde solo el departamento de Recursos Humanos y la gerencia pueden ver los salarios de los empleados.                                      |
| **Integridad**       | Implica que los datos son correctos, auténticos y confiables. Asegura que la información no ha sido alterada o destruida de forma no autorizada.                  | El uso de controles de acceso y cifrado para evitar que un atacante o un empleado modifique los números de cuenta bancaria en el sistema de pagos a proveedores. |
| **Disponibilidad**   | Conlleva que quien esté autorizado tenga acceso a los datos y sistemas cuando los necesite. Los datos inaccesibles no son útiles y paralizan el trabajo.          | Mantener los servidores de una tienda en línea operativos durante un pico de ventas, utilizando medidas contra ataques de sobrecarga.                            |

_La Tríada CIA como base de la protección corporativa._

### El ecosistema del riesgo

Para gestionar la seguridad, es imperativo establecer un lenguaje común. Los conceptos de activo, amenaza, vulnerabilidad y riesgo suelen confundirse, pero representan componentes distintos de una misma ecuación.

1. **Activo:** Es cualquier elemento percibido como valioso para una organización. Puede ser físico (servidores, computadoras de escritorio, espacios de oficina) o digital (bases de datos de clientes, propiedad intelectual, aplicaciones corporativas). El valor del activo determina el nivel de protección que requiere.

2. **Amenaza:** Es una circunstancia o evento que puede afectar negativamente a los activos. Las amenazas pueden ser externas (hackers, desastres naturales) o internas (empleados que abusan de su acceso o cometen errores accidentales).

3. **Vulnerabilidad:** Es una debilidad o fallo en un sistema, proceso o configuración que puede ser aprovechada por una amenaza. Ejemplos comunes incluyen software desactualizado, contraseñas débiles, datos confidenciales desprotegidos o la falta de capacitación del personal.

4. **Riesgo:** Es la probabilidad de que una amenaza explote una vulnerabilidad y cause un impacto negativo en la confidencialidad, integridad o disponibilidad de un activo.

> [!NOTE]
> Para que exista un riesgo real, debe existir tanto una amenaza activa como una vulnerabilidad explotable. Por ejemplo: Si un sistema tiene una vulnerabilidad pero está completamente aislado y desconectado de cualquier red o interacción física, el riesgo se reduce drásticamente.

### Introducción a la gestión del riesgo

Las organizaciones no pueden eliminar todos los riesgos; los recursos son limitados y las defensas absolutas no existen. La gestión de riesgos es el proceso que busca identificar qué controles o medidas se pueden tomar para minimizar los problemas antes de que ocurran. Estas actividades de gestión deben estar integradas en los procesos generales de gestión de riesgos empresariales (ERM, por sus siglas en inglés).

La gestión estructurada del riesgo permite a los directivos tomar decisiones operativas basadas en datos, alineando la seguridad con los objetivos comerciales.

### Procedimiento: Identificación y priorización básica

Para una PyME que recién comienza a estructurar su seguridad, el proceso de gestión de riesgos se puede abordar mediante los siguientes pasos fundamentales:

:::steps

### 1. Identificar los activos críticos

Catalogar qué información y qué sistemas necesitan protegerse. Identificar los activos de alto riesgo (información regulada o crítica), riesgo medio (información no pública que afectaría las finanzas) y bajo riesgo (información pública).

### 2. Identificar amenazas y vulnerabilidades

Reconocer qué podría salir mal. ¿Existen sistemas operativos sin parches de seguridad? ¿Los empleados utilizan la misma contraseña para todo? ¿Alguien podría tener excesivos privilegios de acceso al sistema?

### 3. Evaluar el impacto y la probabilidad

Estimar el daño que causaría la materialización de la amenaza (pérdida económica, daño reputacional) y la probabilidad real de que ocurra basándose en el panorama actual.

### 4. Definir la respuesta al riesgo

Una vez priorizados, la organización debe decidir cómo abordar cada riesgo. Las estrategias habituales son:
:::

- **Aceptación:** Reconocer el riesgo pero decidir no actuar, generalmente porque el costo de la solución es mayor que el impacto potencial, aceptando el riesgo para no interrumpir la continuidad del negocio.

- **Prevención (o Evitación):** Crear un plan o alterar la arquitectura para evitar el riesgo por completo (por ejemplo, deshabilitar un servicio innecesario y vulnerable).

- **Transferencia:** Trasladar el riesgo financiero a un tercero, como la contratación de una póliza de seguro de ciberseguridad o la externalización a un proveedor especializado.

- **Mitigación:** Implementar controles técnicos o administrativos para disminuir la probabilidad o el impacto de un riesgo conocido (por ejemplo, instalar un `firewall` o requerir autenticación multifactor).
  :::

### Verificación de la gestión del riesgo

La gestión del riesgo no es un documento estático. Para comprobar que el proceso es efectivo, la organización debe auditar periódicamente sus decisiones.

**Cómo verificar:**

- Revisar el registro de activos y verificar si los sistemas adquiridos en los últimos seis meses fueron incorporados y clasificados.
- Analizar un incidente de seguridad reciente (por menor que sea) y cruzarlo con la matriz de riesgos: ¿La vulnerabilidad explotada estaba identificada? ¿El impacto real coincidió con el impacto estimado? Si la respuesta es negativa, los criterios de estimación deben ajustarse.

> [!WARNING:Limitaciones]
> La gestión del riesgo se basa en predicciones y en el conocimiento disponible en el momento. No garantiza que no ocurran incidentes (especialmente frente a vulnerabilidades de "día cero" o amenazas no documentadas), sino que asegura que la organización invierte sus recursos defensivos en los problemas que estadísticamente causarán el mayor daño.

## Panorama de amenazas <!-- id: threats-attacks, icon: threat -->

## 1.2. Panorama de amenazas y vectores de ataque

Comprender una amenaza requiere entender quién ejecuta los ataques, qué busca, por dónde ingresa y qué herramientas utiliza. Un entorno tecnológico se vuelve vulnerable cuando no se mapean adecuadamente estos factores frente a la infraestructura de la organización.

Las amenazas a la seguridad pueden tener orígenes diversos, pero todas persiguen vulnerar la confidencialidad, la integridad o la disponibilidad de los activos corporativos.

### Actores de amenazas y motivaciones

Los incidentes no ocurren en el vacío; son perpetrados por entidades con objetivos, capacidades y recursos específicos. Conocer el perfil del atacante permite a las organizaciones ajustar sus defensas.

| Tipo de actor             | Descripción                                                                                                     | Motivación principal |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------- |
| **Sindicatos criminales** | Grupos organizados que operan como empresas ilícitas. Utilizan ataques masivos o dirigidos para obtener dinero. |

| Beneficio económico (ej. extorsión mediante _ransomware_ o venta de datos).

|
| **Amenazas Internas (_Insiders_)** | Empleados, proveedores o excolaboradores que abusan de su acceso autorizado. Pueden actuar con intención o por negligencia.

| Sabotaje, espionaje corporativo, corrupción o error humano accidental.

|
| **Amenaza Avanzada Persistente (APT)** | Procesos informáticos sigilosos realizados por terceros (frecuentemente actores estatales o patrocinados por Estados) con gran capacidad técnica.

| Espionaje, robo de propiedad intelectual, sabotaje estratégico a infraestructuras críticas.

|
| **Hacktivistas** | Individuos o grupos que utilizan ataques cibernéticos para promover una agenda ideológica.

| Protesta social, propaganda, búsqueda de notoriedad, difamación de marcas.

|
| _Clasificación de actores de amenazas y sus objetivos operativos._ | | |

### Superficie de ataque y vectores de entrada

La superficie de ataque comprende todas las vulnerabilidades potenciales que un atacante puede aprovechar en un sistema dado.

Un vector de ataque es la ruta o método específico que utiliza un actor de la amenaza para penetrar en la red. Los vectores de entrada más comunes incluyen:

- **Usuarios:** Manipulación directa del personal mediante tácticas de engaño.

- **Servicios expuestos y software:** Aplicaciones con configuraciones de seguridad incorrectas, sistemas heredados (_legacy_) obsoletos y software sin parches de seguridad.

- **Proveedores y cadena de suministro:** Acceso a través de terceros o servicios externalizados que tienen permisos en la red de la organización.

- **Dispositivos de red y configuraciones de fábrica:** Dispositivos instalados con credenciales predeterminadas, protocolos antiguos o servicios innecesarios habilitados.

### Ingeniería social y manipulación humana

La ingeniería social es una técnica de manipulación que explota el error humano para engañar a las personas y lograr que revelen información confidencial o realicen acciones perjudiciales. Es a menudo el camino de menor resistencia para un atacante.

- **Phishing (Suplantación de identidad):** Uso de comunicaciones digitales masivas (generalmente correo electrónico) simulando ser una fuente confiable para robar datos o distribuir _malware_.

- **Spear phishing:** Un ataque de _phishing_ focalizado y personalizado contra un individuo o grupo específico.

- **Whaling:** Variante de _spear phishing_ dirigida exclusivamente a altos ejecutivos o personal con altos privilegios.

- **BEC (Compromiso del correo electrónico empresarial):** El atacante falsifica o compromete una cuenta corporativa legítima para solicitar transferencias de fondos o información sensible, buscando un beneficio financiero directo.

- **Vishing y Smishing:** Uso de llamadas telefónicas (_vishing_) o mensajes de texto SMS/WhatsApp (_smishing_) para suplantar identidades.

- **Baiting (Cebo):** Engaño que ofrece una recompensa falsa o utiliza medios físicos (ej. dejar un USB infectado, conocido como cebo USB) para infectar una red.

> [!CRITICAL]
> Los ataques BEC (_Business Email Compromise_) y el _phishing_ representan los vectores de amenaza más comunes y efectivos contra las empresas, ya que eluden los controles técnicos perimetrales al interactuar directamente con el usuario final.

### Malware (Software Malicioso)

El _malware_ es código diseñado para infiltrarse, dañar o explotar sistemas informáticos sin el consentimiento del usuario.

- **Ransomware:** Cifra los datos de una organización o bloquea el acceso a los sistemas, exigiendo el pago de un rescate. Las variantes modernas también exfiltran datos antes de cifrarlos para extorsionar a la víctima con su publicación.

- **Troyanos:** Programas que se presentan como software legítimo para engañar al usuario, pero que ocultan funciones maliciosas, actuando frecuentemente como puerta de entrada para otras amenazas.

- **Gusanos (_Worms_):** _Malware_ autónomo que se duplica y se propaga a través de la red sin necesidad de intervención humana, saturando recursos y sistemas.

- **Spyware:** Diseñado para recopilar información personal, correos y credenciales de forma encubierta y enviarla al atacante.

- **Botnets:** Red de equipos infectados (zombis) controlados remotamente por un atacante para lanzar ataques a gran escala, como ataques de denegación de servicio distribuido (DDoS).

### Explotación de vulnerabilidades y control de acceso

Cuando los atacantes no utilizan la ingeniería social, buscan explotar debilidades técnicas o fallos en el control de acceso.

- **Software sin actualizar:** Las vulnerabilidades en sistemas operativos o aplicaciones que no han recibido sus parches de seguridad son explotadas rutinariamente. Los _exploits de día cero_ (_zero-days_) atacan vulnerabilidades aún desconocidas por el fabricante.

- **Software mal codificado:** Aquellos sistemas que han sido programados y distribuidos sin tener en cuenta las buenas prácticas de seguridad.

- **Configuraciones inseguras:** El uso de componentes con ajustes de fábrica, cuentas predeterminadas o la falta de cifrado facilita la infiltración.

- **Compromiso de credenciales:** Los atacantes obtienen acceso mediante el robo de contraseñas, la reutilización de claves comprometidas en otros servicios, o mediante **ataques de fuerza bruta** (prueba sistemática de combinaciones). El uso de _tablas Arcoíris_ (_Rainbow tables_) permite revertir contraseñas almacenadas de forma insegura.

### El ciclo de vida de un ataque

Un ciberataque rara vez es un evento instantáneo; sigue una progresión táctica. El **Cyber Kill Chain** (Cadena de Muerte Cibernética) es un modelo utilizado en la industria para explicar las fases secuenciales que los adversarios suelen atravesar para ejecutar un ataque con éxito:

:::steps

### 1. Reconocimiento (_Reconnaissance_)

El atacante recopila información sobre su objetivo sin contacto directo. Esto incluye búsqueda en fuentes abiertas (OSINT), escaneo de puertos y análisis de la superficie de ataque pública.

### 2. Armado (_Weaponization_)

Creación o adaptación del arma combinando un _exploit_ con un _payload_. El producto resultante es un arma entregable: un documento malicioso, un ejecutable empaquetado o un script ofuscado.

### 3. Entrega (_Delivery_)

Transmisión del arma al objetivo a través de un vector de entrada como el correo electrónico (_phishing_).

### 4. Explotación (_Exploitation_)

El arma se activa y aprovecha la vulnerabilidad para ejecutar código malicioso en el sistema víctima. La vulnerabilidad explotada puede ser técnica (_bug_ de software) o humana (factor social).

### 5. Instalación (_Installation_)

Se instala un mecanismo persistente en el sistema comprometido para garantizar el acceso futuro, incluso tras reinicios.

### 6. Comando y Control (_Command & Control_)

Se establece un canal de comunicación cifrado entre el _malware_ y el servidor del atacante (C2). El canal permite al atacante enviar instrucciones y recibir resultados.

### 7. Acción sobre objetivos (_Actions on Objectives_)

El atacante ejecuta su objetivo final. Puede incluir exfiltración de datos, cifrado de archivos (_ransomware_), sabotaje de sistemas, creación de accesos adicionales o movimiento hacia otros objetivos.
:::

### Defensa y reducción del riesgo: El Marco del NIST

La mitigación de estas amenazas requiere una estrategia de **defensa en profundidad**, agregando múltiples capas de seguridad para que, si una falla, otra detenga el ataque.

El Marco de Ciberseguridad del NIST (NIST CSF 2.0) organiza las medidas defensivas en seis _Core Functions_. Estas funciones no son pasos aislados, sino un ciclo continuo que abarca toda la seguridad:

- **Gobernar (_Govern_):** Establece, comunica y monitorea la estrategia de gestión de riesgos, las expectativas y las políticas corporativas. Esta función central guía a todas las demás, asegurando que las decisiones de ciberseguridad se alineen con la misión del negocio, los requisitos legales y las expectativas de las partes interesadas.

- **Identificar (_Identify_):** Permite comprender los riesgos actuales de ciberseguridad a los que se enfrenta la organización. Implica mantener un inventario exhaustivo y priorizado de los activos, servicios y proveedores de la cadena de suministro para dirigir los esfuerzos defensivos.

- **Proteger (_Protect_):** Implementa las salvaguardas necesarias para prevenir o reducir la probabilidad y el impacto de los eventos cibernéticos adversos. Abarca desde el control de acceso y la autenticación, hasta la capacitación del personal y la seguridad de los datos.

- **Detectar (_Detect_):** Facilita el descubrimiento y análisis oportuno de posibles ataques e incidentes. Implica el monitoreo continuo para identificar anomalías o indicadores de compromiso (IoC) que señalen que las barreras de protección han sido superadas.

- **Responder (_Respond_):** Ejecuta acciones críticas frente a un incidente de ciberseguridad previamente detectado. El objetivo es contener los efectos del ataque mediante la gestión del incidente, el análisis forense, la mitigación técnica y la comunicación obligatoria con las partes afectadas.

- **Recuperar (_Recover_):** Restaura los activos y las operaciones comerciales afectadas por el incidente de seguridad. Garantiza el restablecimiento oportuno de la normalidad operativa y la coordinación de las comunicaciones públicas e internas durante la recuperación.

> [!NOTE]
> Las primeras 4 funciones pueden operan de manera simultánea y continua para prevenir amenazas, mientras que "Responder" y "Recuperar" se mantienen preparadas en todo momento para activarse en el instante en que ocurre una brecha.

## Frameworks y Referencias <!-- id: frameworks-references, icon: Bookmark01Icon -->

## Kit de Herramientas <!-- id: toolkit, icon: ToolsIcon -->

The source tree follows a feature-based layout:

```filetree:Project Structure
src/
  components/   # Shared, reusable UI components
  data/         # Static JSON / typed data files (docs, lab manifests, …)
  features/     # Feature modules (labs/, scenarios/, simulations/)
  hooks/        # Custom React hooks
  layouts/      # Page shell / persistent UI wrappers
  pages/        # Route-level page components
  router/       # Centralised routing config
  types/        # Shared TypeScript interfaces
```

## Redes y Sistema Operativo <!-- id: networks-operating-systems, icon: ServerIcon -->

The source tree follows a feature-based layout:

```filetree:Project Structure
src/
  components/   # Shared, reusable UI components
  data/         # Static JSON / typed data files (docs, lab manifests, …)
  features/     # Feature modules (labs/, scenarios/, simulations/)
  hooks/        # Custom React hooks
  layouts/      # Page shell / persistent UI wrappers
  pages/        # Route-level page components
  router/       # Centralised routing config
  types/        # Shared TypeScript interfaces
```

## Mentalidad de Seguridad <!-- id: security-mentality, icon: BrainIcon -->

The source tree follows a feature-based layout:

```filetree:Project Structure
src/
  components/   # Shared, reusable UI components
  data/         # Static JSON / typed data files (docs, lab manifests, …)
  features/     # Feature modules (labs/, scenarios/, simulations/)
  hooks/        # Custom React hooks
  layouts/      # Page shell / persistent UI wrappers
  pages/        # Route-level page components
  router/       # Centralised routing config
  types/        # Shared TypeScript interfaces
```

# 2) Descubrir <!-- id: layer-2 -->

High-level design decisions and conventions used across the codebase.

# 3) Diseñar <!-- id: layer-3 -->

High-level design decisions and conventions used across the codebase.

# 4) Proteger <!-- id: layer-4 -->

High-level design decisions and conventions used across the codebase.

# 5) Detectar <!-- id: layer-5 -->

High-level design decisions and conventions used across the codebase.

# 3) Responder y Recuperar <!-- id: layer-6 -->

High-level design decisions and conventions used across the codebase.

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

### Especificación de Sintaxis

```markdown:docs.md
> [!NOTE]
> Nota informativa con soporte para `código en línea` y **texto en negrita**.

> [!WARNING:Título Personalizado]
> Advertencia con etiqueta adaptada al contexto del procedimiento.
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
├── docs/
│   └── docs.md                # Fuente principal de documentación Markdown
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

### Listas con Viñetas (No Ordenadas)

- **Prevención proactiva:** Implementación de cortafuegos de aplicaciones web (WAF) y filtrado DNS.
- **Monitoreo continuo:** Recolección de registros de eventos en un sistema centralizado de gestión de información y eventos de seguridad (SIEM).
- **Capacitación del personal:** Programas periódicos de concienciación sobre ingeniería social y técnicas de _phishing_.
- **Pruebas de penetración periódicas:** Evaluaciones de seguridad ofensiva para identificar vulnerabilidades antes de que sean explotadas por ciberdelincuentes.

### Listas Numeradas (Ordenadas)

1. **Fase de Preparación:** Establecer políticas defensivas, capacitar al equipo de respuesta y verificar herramientas forenses.
2. **Fase de Detección y Análisis:** Identificar anomalías en los registros y determinar el alcance del incidente.
3. **Fase de Contención:** Aislar los sistemas afectados para prevenir la propagación de la amenaza.
4. **Fase de Erradicación:** Eliminar artefactos maliciosos, puertas traseras y cuentas no autorizadas.
5. **Fase de Recuperación:** Restaurar sistemas desde respaldos limpios y monitorizar el comportamiento normal del tráfico.
6. **Fase de Lecciones Aprendidas:** Documentar el incidente, revisar la matriz de riesgos y actualizar los procedimientos de defensa.

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
