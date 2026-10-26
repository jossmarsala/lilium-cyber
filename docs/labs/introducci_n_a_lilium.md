# Bienvenido a LILIUM <!-- id: 00-introduccion -->
LILIUM es un playbook prescriptivo de ciberseguridad e infraestructura diseñado para conectar la comprensión del riesgo con la implementación práctica y su verificación. Combina documentación técnica aplicable con laboratorios interactivos en el navegador para ayudar a organizaciones y estudiantes a construir defensas reales capa por capa.

## ¿Qué es LILIUM y cómo funciona? <!-- id: que-es-lilium, icon: Book02Icon -->
En muchas organizaciones, la ciberseguridad suele abordarse de forma reactiva: instalando herramientas aisladas sin comprender primero qué activos se están protegiendo ni qué problemas reales se intentan resolver. **LILIUM** nace para ordenar ese proceso mediante una guía estructurada, directa y libre de teoría innecesaria.

Su propósito es doble: brindar a las **pequeñas y medianas empresas (PyMEs)** una ruta clara para proteger su infraestructura con recursos limitados, y ofrecer a **principiantes, estudiantes y perfiles técnicos** un primer acercamiento práctico y realista a la seguridad defensiva.

> [!NOTE:¿Qué NO es LILIUM?]
> LILIUM no es un catálogo comercial de software, un curso puramente teórico ni una plataforma de retos de hacking ofensivo (`CTF`). Aquí las herramientas no son el punto de partida, sino el medio final para implementar un control que mitiga un riesgo concreto.

Toda la metodología del proyecto se rige por un único flujo lógico:
**Problema → Riesgo → Práctica de seguridad → Herramienta → Implementación → Verificación**

---

### Un ecosistema en dos partes
Para garantizar que el conocimiento teórico se traduzca en capacidad operativa real, LILIUM se divide en dos componentes integrados:

1. **El Playbook (Documentación prescriptiva):** Una guía técnica paso a paso que explica qué proteger, por qué importa para la continuidad del negocio y cómo implementar controles concretos basados en estándares reconocidos (`NIST CSF 2.0`, `CIS Controls v8.1`, `OWASP` y `MITRE ATT&CK`). Todo el contenido se presenta listo para aplicar en entornos reales.
2. **Los Laboratorios Interactivos (Entornos simulados):** Cada módulo del playbook cuenta con su propio laboratorio práctico que se ejecuta **100% en el navegador**. Sin necesidad de instalar máquinas virtuales pesadas ni contar con equipos potentes, accederás a un sistema operativo simulado (con terminal `Bash`, explorador de archivos, visor de registros y herramientas de red) donde pondrás a prueba lo aprendido resolviendo escenarios cotidianos de forma segura y guiada.

---

### Las 6 capas del framework
Las siglas de **LILIUM** definen las 6 subcapas progresivas que componen el framework, agrupadas en tres grandes etapas operativas:

:::group title="CAPA 01 — COMPRENDER" description="Entender el entorno y reconocer qué está expuesto antes de actuar"
- 01. UNDERSTAND (Lineamientos) [nivelatorio]: Fundamentos de ciberseguridad, impacto en el negocio, tríada `CIA`, redes, sistemas operativos y mentalidad defensiva.
- 02. DISCOVER (Inventario) [diagnóstico]: Identificación práctica de hardware, software, flujos de datos, cuentas privilegiadas y evaluación de vulnerabilidades en la superficie de ataque.
:::

:::group title="CAPA 02 — CONSTRUIR" description="Estructurar la arquitectura y aplicar controles preventivos"
- 03. DESIGN (Lógica) [arquitectura]: Diseño de defensa en profundidad, segmentación de redes (`DMZ`), modelos de acceso por roles (`RBAC`) y modelado de amenazas.
- 04. PROTECT (Implementación) [controles]: Aplicación técnica de autenticación multifactor (`MFA`), endurecimiento de sistemas (`hardening`), gestión de parches, `firewalls` y respaldos.
:::

:::group title="CAPA 03 — OPERAR" description="Mantener la visibilidad, detectar ataques y recuperar la operación"
- 05. DETECT (Umbrales) [monitoreo]: Centralización de registros (`logs`), configuración de sistemas de detección de intrusiones (`IDS`), correlación en `SIEM` y ajuste de alertas.
- 06. RESPOND & RECOVER (Mitigación) [continuidad]: Ejecución de planes de respuesta a incidentes, contención de `ransomware`, análisis forense básico y restauración segura del negocio.
:::

> [!TIP:La verificación como principio transversal]
> En LILIUM no basta con instalar un programa o cambiar una configuración. Cada práctica y cada laboratorio a lo largo de los 6 módulos exige **verificar** que el control implementado funcione correctamente y comprender cuáles son sus limitaciones.

---

### ¿Es LILIUM adecuado para ti?
Revisa la siguiente tabla para identificar cómo aprovechar la plataforma según tu perfil actual:

| Perfil | Qué te aporta LILIUM | Qué necesitas saber antes de empezar |
| :--- | :--- | :--- |
| **Estudiantes y principiantes** | Una ruta estructurada desde cero para entender cómo se defiende una infraestructura real, combinando lectura clara con práctica en terminal y herramientas de seguridad. | Nociones básicas de uso de una computadora. El primer módulo funciona como nivelatorio completo. |
| **PyMEs y responsables de IT** | Un plan de acción priorizado para reducir riesgos críticos, ordenar activos y proteger la continuidad operativa sin depender de un equipo de seguridad dedicado. | Conocimiento general de cómo opera tu organización y qué servicios tecnológicos utiliza a diario. |
| **Desarrolladores y SysAdmins** | Criterio arquitectónico para diseñar sistemas seguros por defecto, limitar privilegios, segmentar servicios y auditar vulnerabilidades. | Conceptos base de programación o administración de sistemas que quieras formalizar bajo un marco de seguridad. |
*Perfiles de usuario y alcance formativo del proyecto.*

---

### Cómo comenzar tu recorrido

:::steps
### 1. Inicia en el módulo nivelatorio
Dirígete a **[01 — UNDERSTAND](/01-understand/overview-understand)**. Es el único módulo diseñado específicamente para partir desde cero, establecer el vocabulario común del proyecto y nivelar tus conocimientos en redes, sistemas operativos y gestión del riesgo.

### 2. Avanza capa por capa
Sigue el orden numérico de los módulos (`01` al `06`). En ciberseguridad, intentar proteger (`04`) o monitorear (`05`) una red sin haber inventariado sus activos (`02`) ni diseñado su lógica (`03`) conduce a configuraciones frágiles e incompletas.

### 3. Valida en el laboratorio
Al finalizar la lectura de cada módulo, abre su laboratorio interactivo correspondiente. Utiliza la guía lateral para completar las tareas en el sistema operativo simulado y comprobar que dominas la práctica antes de avanzar al siguiente nivel.
:::