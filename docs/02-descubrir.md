# 2) Descubrir <!-- id: 02-discover -->

Identificación sistemática, inventario y evaluación de la superficie de ataque, los activos tecnológicos y las vulnerabilidades de la infraestructura. Este módulo establece la línea de base operativa necesaria para comprender qué elementos componen el entorno corporativo, qué nivel de exposición presentan y qué debilidades exigen atención prioritaria antes de diseñar e implementar controles defensivos.

**Pregunta central:** ¿Qué activos tenemos, cuáles se encuentran expuestos y dónde residen las debilidades del entorno?

En el modelo de defensa por capas de lilium, resulta inviable proteger aquello que se desconoce. Antes de configurar un cortafuegos, redactar políticas restrictivas de seguridad o adquirir licencias de software defensivo, la organización debe comprender con exactitud cómo opera su entorno tecnológico en el día a día.

El módulo 2 articula este relevamiento a través de cinco bloques secuenciales:

1. **Auditoría de la red actual y superficie de ataque:** Medición de flujos de tráfico, carga operativa, patrones de uso y delimitación de zonas de seguridad.
2. **Detección de cuentas y dispositivos:** Identificación de activos de hardware (físicos y virtuales), descubrimiento de identidades huérfanas y control de privilegios acumulados.
3. **Clasificación y mapeo de datos:** Determinación de niveles de sensibilidad (información personal, sensible y corporativa), identificación de estados del dato y trazabilidad de su ciclo de vida.
4. **Detección de software, permisos y dependencias:** Detección de aplicaciones sin soporte (_End-of-Life_), servicios con privilegios excesivos, tecnología en las sombras (_Shadow IT_) y riesgos derivados de proveedores externos (_SaaS_ y cadenas de suministro).
5. **Metodología de descubrimiento y evaluación:** Ejecución de escaneos de vulnerabilidades autenticados y no autenticados, correlación con bases públicas internacionales (_CVE_, _NVD_) y priorización de riesgo basada en _CVSS_.

| Bloque de Descubrimiento                                                           | Problema / Ceguera Inicial                                                                                          | Riesgo Asociado                                                                                                               | Práctica de Seguridad                                                                                                        | Implementación y Verificación                                                                        |
| :--------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- |
| **02.1. Red Actual**                                                               | Desconocimiento del tráfico normal y de la topología existente.                                                     | Infiltraciones inadvertidas y exfiltración encubierta de datos fuera de horario.                                              | Levantamiento de línea de base (_baseline_) y diagramación de zonas (DMZ, red local y zona restringida).                     | Captura de flujos (`wireshark` / `tcpdump`) y actualización periódica del diagrama de red.           |
| **02.2. Cuentas y Dispositivos**                                                   | Equipos no registrados en el inventario y cuentas de exempleados activas.                                           | Acceso no autorizado mediante credenciales legítimas o dispositivos no auditados.                                             | Inventario formal de hardware, control de identidades y bloqueo de cuentas tras 45 días de inactividad.                      | Descubrimiento activo de red, auditoría de arrendamientos DHCP y revisión de privilegios locales.    |
| **02.3. Datos**                                                                    | Tratamiento homogéneo de los datos o desconocimiento de su ubicación.                                               | Filtración de datos personales, sanciones legales por incumplimiento regulatorio y pérdida de propiedad intelectual.          | Clasificación en cuatro niveles jerárquicos y protección según el estado del dato (reposo, tránsito y uso).                  | Mapeo continuo de flujos de información y formalización de Propietarios y Custodios.                 |
| **02.4. Software y Terceros**                                                      | Ejecución de software sin parches (_EOL_), permisos de administrador cotidiano y servicios en la nube no regulados. | Compromiso por código malicioso (_malware_), secuestro de datos (_ransomware_) o brechas a través de la cadena de suministro. | Inventario de software, listas de aplicaciones permitidas (_allowlisting_), catálogo _SBOM_ y control de proveedores _SaaS_. | Auditoría recurrente de soporte técnico de bibliotecas y evaluación anual de riesgos de terceros.    |
| **02.5. Metodología de Evaluación**                                                | Inexistencia de búsqueda proactiva de fallas o carencia de criterios para priorizar la mitigación.                  | Ventana prolongada de exposición ante vulnerabilidades críticas conocidas y explotables.                                      | Escaneos internos y externos (autenticados y no autenticados) combinados con análisis de impacto contextual.                 | Escaneos automatizados periódicos, triaje mediante métricas _CVSS_ y plan de remediación escalonado. |
| _Matriz de bloques de descubrimiento, riesgos asociados y prácticas de seguridad._ |

:::subindex
title="Índice del módulo"
:::

## 2.1. Red Actual y Superficie <!-- id: auditoria-red-superficie-ataque, icon: NetworkIcon, displayTitle: 02.1 — Red Actual y Superficie, description: Relevamiento de flujos de tráfico, topología y zonas de seguridad para establecer una línea de base operativa. -->

Para planificar y diseñar una arquitectura de red segura, es indispensable relevar y comprender cómo opera la infraestructura existente. Una estrategia de seguridad no se impone de forma teórica sobre una empresa; se diseña a partir de la dinámica real del negocio: las modalidades de trabajo del personal, el volumen habitual de tráfico, el número de usuarios concurrentes, las transferencias diarias de archivos y el grado de dependencia de servicios externos alojados en la nube (_Software as a Service_ o SaaS). El objetivo de este primer bloque es descubrir las comunicaciones existentes para trabajar sobre datos objetivos.

### Establecimiento de la línea de base operativa (_baseline_)

El tráfico de red está constituido por el intercambio de paquetes de datos entre equipos interconectados. Su comportamiento y densidad varían según la actividad comercial y el tamaño de la organización. Auditar el tráfico para establecer una línea de base (_baseline_) —un perfil de comportamiento considerado normal— exige examinar tres dimensiones principales:

- **Patrones temporales y modo de trabajo:** Consiste en mapear los horarios y jornadas en los que se concentra la actividad de los usuarios (por ejemplo, flujos intensivos de lunes a viernes de 08:00 a 18:00 horas), identificando las modalidades de conexión (presencial, remota o híbrida). Conocer este comportamiento permite configurar sistemas de detección para que alerten ante anomalías, tales como picos masivos de transferencia de datos en horarios no laborales o fines de semana, lo cual suele ser indicio de exfiltración de información.
- **Carga esperada y rendimiento:** Se evalúa a través del ancho de banda consumido (volumen de datos transferidos por segundo) y la tasa de utilización de los enlaces. Identificar los valores promedio y máximos habituales permite dimensionar correctamente el equipamiento y distinguir entre una congestión operativa por alta demanda comercial y un incidente de seguridad, como un ataque de denegación de servicio (_Denial of Service_ o DoS).
- **Flujos de comunicación y conexiones hacia la nube:** Implica documentar las trayectorias que recorren los datos dentro de la red de área local (_Local Area Network_ o LAN), hacia la red de área amplia (_Wide Area Network_ o WAN / Internet) y, de forma particular, hacia proveedores de infraestructura (_IaaS_), plataformas (_PaaS_) o aplicaciones en la nube (_SaaS_).

Para obtener datos reales sobre los protocolos activos en la red, los administradores emplean utilidades de captura de paquetes como `tcpdump` o `wireshark`:

```bash:terminal
# Capturar una muestra representativa de 50 paquetes TCP o UDP en la interfaz principal
sudo tcpdump -i eth0 -nn -c 50 'ip and (tcp or udp)'
```

```text:salida-terminal
14:22:01.104522 IP 192.168.10.15.54322 > 192.168.10.200.443: Flags [P.], seq 1:518, ack 1
14:22:01.104910 IP 192.168.10.15.53 > 1.1.1.1.53: 1245+ A? portal.empresa.com. (36)
14:22:01.108210 IP 1.1.1.1.53 > 192.168.10.15.53: 1245 1/0/0 A 203.0.113.10 (52)
```

### Reconocimiento topológico y zonas de seguridad

Cualquier conexión hacia el exterior incrementa la superficie de ataque de la organización, entendida como la suma total de puntos de entrada, interfaces y vulnerabilidades que un adversario podría intentar explotar. Para evaluar esta exposición de manera clara, se confeccionan diagramas de arquitectura de red que representan la interconexión entre enrutadores (_routers_), conmutadores (_switches_), cortafuegos (_firewalls_), puntos de acceso inalámbrico (_Wireless Access Points_ o WAP) y servidores.

El diseño de red organiza estos activos en distintas zonas de seguridad según el nivel de confianza y control requerido:

| Zona de Red                                                             | Nivel de Control   | Descripción y Activos Habituales                                                                                                                                           | Exposición al Riesgo                                                                                                                                   |
| :---------------------------------------------------------------------- | :----------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Zona No Controlada**                                                  | Nulo               | Redes públicas externas fuera del perímetro de la organización, principalmente Internet.                                                                                   | **Máxima:** Origen de ataques automatizados, escaneos masivos e intentos de intrusión no dirigidos.                                                    |
| **DMZ (Zona Desmilitarizada)**                                          | Medio (Perimetral) | Subred perimetral controlada que funciona como zona intermedia entre Internet y la red corporativa. Aloja servidores web públicos, pasarelas de correo y servidores proxy. | **Alta:** Requiere aislamiento estricto mediante cortafuegos para evitar que un compromiso del servidor público afecte la red interna.                 |
| **Red Interna (LAN / Subredes)**                                        | Alto               | Entorno donde operan las estaciones de trabajo de los empleados, impresoras de red y servicios corporativos cotidianos.                                                    | **Media:** Vulnerable al movimiento lateral si no se implementa segmentación lógica (_subnetting_ y VLANs).                                            |
| **Zona Restringida**                                                    | Crítico            | Núcleo de la infraestructura donde residen bases de datos confidenciales, controladores de dominio y almacenamiento de respaldos.                                          | **Baja exposición externa, pero impacto crítico:** El acceso debe estar limitado exclusivamente a servicios autorizados y personal técnico calificado. |
| _Zonas de seguridad de red, niveles de control y exposición al riesgo._ |

> [!TIP:Relevamiento empírico de protocolos]
> Antes de adquirir o reconfigurar un cortafuegos, utiliza analizadores de protocolos (como `wireshark` o `tcpdump`) junto con registros de flujo (_flow logs_) para relevar qué servicios y puertos (`HTTP`/`HTTPS` en los puertos `TCP 80`/`443`, `DNS` en `UDP 53`, `SMB` en `TCP 445` o `SSH` en `TCP 22`) presentan tráfico legítimo continuo durante una jornada laboral representativa.

> [!NOTE:Alineación con marcos de referencia]
> El marco de ciberseguridad NIST CSF 2.0 formaliza este control en la subcategoría `ID.AM-03`, exigiendo el mantenimiento de mapas actualizados de comunicación y flujos de datos. A su vez, los Controles de Seguridad Críticos de CIS (versión 8.1, Salvaguarda 12.4) establecen la obligación de revisar y actualizar los diagramas de arquitectura de red al menos una vez al año o tras modificaciones de infraestructura.

## 2.2. Cuentas y Dispositivos <!-- id: deteccion-cuentas-dispositivos, icon: ServerIcon, displayTitle: 02.2 — Cuentas y Dispositivos, description: Inventario de hardware, identificación de activos no autorizados y saneamiento de identidades inactivas o huérfanas. -->

Durante la etapa de descubrimiento se debe relevar la totalidad de los dispositivos físicos y virtuales conectados al entorno, así como auditar las cuentas de usuario existentes en el sistema. Documentar estos elementos en inventarios formales permite determinar con precisión qué activos son indispensables para la operación del negocio, qué identidades permanecen activas y qué privilegios posee cada una dentro de la infraestructura.

### Auditoría de dispositivos conectados

Un activo corporativo es cualquier dispositivo con capacidad de procesar, transmitir o almacenar datos de la organización. En las empresas contemporáneas —especialmente en aquellas con esquemas de trabajo flexible o políticas de uso de dispositivos propios (_Bring Your Own Device_ o BYOD)— el parque informático es dinámico: equipos portátiles que se conectan de forma intermitente, teléfonos móviles en la red inalámbrica corporativa, máquinas virtuales efímeras y periféricos o cámaras de seguridad (_IoT_) conectadas a la red local.

Para garantizar una cobertura integral, el relevamiento de hardware abarca cuatro categorías fundamentales:

- **Dispositivos de usuario final:** Computadoras de escritorio, estaciones de trabajo, equipos portátiles (_laptops_), tabletas y teléfonos inteligentes corporativos.
- **Servidores e infraestructura de cómputo:** Servidores físicos locales, servidores virtualizados en hipervisores, contenedores de aplicaciones e instancias de cómputo en la nube (servidores web, de archivos, de bases de datos o de correo).
- **Equipamiento de conectividad y red:** Enrutadores, conmutadores gestionables, cortafuegos perimetrales, equilibradores de carga y puntos de acceso inalámbrico.
- **Dispositivos IoT y periféricos no convencionales:** Impresoras de red, terminales de punto de venta (POS), sensores ambientales, cámaras de videovigilancia (_CCTV_) y sistemas de control de acceso físico.

> [!NOTE:Campos mínimos del inventario de hardware (CIS 1.1)]
> Siguiendo la Salvaguarda 1.1 de CIS Controls v8.1, cada entrada del inventario de hardware debe registrar como mínimo:
>
> - Nombre de red del dispositivo (_hostname_).
> - Dirección IP asignada (indicando si es estática o reservada por DHCP).
> - Dirección de control de acceso al medio (dirección MAC).
> - Fabricante, modelo y número de serie.
> - Responsable o custodio asignado (persona o departamento).
> - Estado de autorización formal para operar en la red corporativa.

### Detección de cuentas huérfanas, inactivas y privilegios excesivos

Para un adversario, resulta sustancialmente más sencillo ingresar a un sistema empleando credenciales legítimas no revocadas que descubrir y explotar una vulnerabilidad compleja de software. Al auditar los directorios de usuarios y las cuentas locales de los sistemas operativos, se identifican con frecuencia tres problemas críticos:

1. **Cuentas huérfanas o inactivas:** Identidades que permanecen activas en el sistema tras la desvinculación laboral de empleados, pasantes o contratistas, así como cuentas de prueba temporales que nunca fueron dadas de baja. La Salvaguarda 5.3 de CIS Controls v8.1 prescribe la inhabilitación o eliminación de cuentas que presenten más de 45 días continuos de inactividad.
2. **Acumulación indebida de privilegios (_privilege creep_):** Situación en la cual un usuario acumula permisos a medida que asume nuevas responsabilidades o transita por distintos puestos dentro de la empresa, sin que se le revoquen los accesos asociados a sus funciones anteriores.
3. **Uso indiscriminado de cuentas con privilegios administrativos:** Empleados y técnicos que realizan sus labores diarias ordinarias (navegación web, consulta de correo electrónico y procesamiento de texto) iniciando sesión como administradores locales o superusuarios (`root`). Esta práctica multiplica el impacto de un incidente: cualquier archivo malicioso ejecutado por el usuario adquiere control total e inmediato sobre el sistema operativo. Asimismo, suelen existir cuentas de servicio compartidas entre múltiples personas sin contraseñas seguras ni mecanismos de rotación.

| Tipo de Auditoría de Cuentas                                     | Objetivo Principal en lilium                                                                                                                  | Hallazgo Crítico Habitual                                                                                               |
| :--------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------- |
| **Auditoría de Uso**                                             | Examinar los registros de inicio de sesión (_logs_) para determinar qué identidades interactúan con los sistemas y en qué ventanas de tiempo. | Cuentas activas sin actividad durante meses (cuentas huérfanas) o inicios de sesión en horarios inusuales.              |
| **Auditoría de Privilegios**                                     | Verificar que los permisos asignados a cada usuario respondan estrictamente a su rol operativo vigente (_Principio de Mínimo Privilegio_).    | Personal administrativo con privilegios de administrador de dominio o acceso de escritura a bases de datos de clientes. |
| **Auditoría de Cambios de Cuenta**                               | Monitorear altas, bajas, restablecimiento de contraseñas y asignación a grupos privilegiados en los servicios de directorio.                  | Cuentas compartidas genéricas (`admin`, `soporte`, `ventas`) con contraseñas históricas que nunca han sido modificadas. |
| _Tipos de auditoría de cuentas, objetivos y hallazgos críticos._ |

En sistemas Linux, es posible auditar las cuentas locales que poseen intérpretes de comandos interactivos mediante el comando:

```bash:terminal
# Listar usuarios del sistema con shells interactivas válidas
awk -F: '($7 ~ /\/(bash|sh|zsh)$/) {print "Usuario:", $1, "| UID:", $3, "| Directorio:", $6, "| Shell:", $7}' /etc/passwd
```

```text:salida-terminal
Usuario: root | UID: 0 | Directorio: /root | Shell: /bin/bash
Usuario: adm_seguridad | UID: 1000 | Directorio: /home/adm_seguridad | Shell: /bin/bash
Usuario: juan.perez | UID: 1001 | Directorio: /home/juan.perez | Shell: /bin/bash
```

> [!WARNING:Desvinculación y preservación de evidencia]
> Al gestionar la baja de un exempleado, la Salvaguarda 6.2 de CIS Controls v8.1 recomienda deshabilitar la cuenta de inmediato en lugar de eliminarla del directorio de forma abrupta. Esta medida bloquea el acceso en tiempo real y, simultáneamente, preserva la coherencia de los identificadores de usuario (_UID_) y la trazabilidad de los registros históricos (_logs_) asociados a sus actividades pasadas.

## 2.3. Clasificación de Datos <!-- id: clasificacion-mapeo-datos, icon: Database01Icon, displayTitle: 02.3 — Clasificación de Datos, description: Esquemas de sensibilidad (PII, SPII, PHI), ciclo de vida y protección del dato en reposo, tránsito y uso. -->

La eficacia de los controles preventivos depende de la capacidad de la organización para identificar qué información almacena y qué valor representa para el negocio. Aplicar mecanismos extremos de cifrado y aislamiento sobre la totalidad de los archivos de una empresa resulta económicamente inviable y degrada la productividad operativa. Por el contrario, no clasificar la información expone los activos críticos a fugas, sanciones legales y pérdidas financieras severas.

### Esquema de clasificación por sensibilidad

El primer paso consiste en adoptar un modelo formal de clasificación de datos basado en el impacto potencial que provocaría una afectación a la tríada **CIA** (_Confidencialidad, Integridad y Disponibilidad_).

El marco normativo internacional presta especial atención a tres categorías de datos regulados:

- **PII (_Personally Identifiable Information_ / Información de Identificación Personal):** Datos que permiten identificar directa o indirectamente a una persona física (nombres y apellidos, números telefónicos, direcciones postales y correos electrónicos).
- **SPII (_Sensitive Personally Identifiable Information_ / Información Personal Sensible):** Subconjunto de datos personales cuya divulgación no autorizada conlleva un perjuicio grave o directo para el individuo (números de documentos nacionales de identidad, datos de tarjetas bancarias, contraseñas de acceso y registros biométricos).
- **PHI (_Protected Health Information_ / Información de Salud Protegida):** Registros médicos, diagnósticos clínicos, recetas farmacológicas e historiales de salud física o mental.

Para implementar una clasificación clara y comprensible para todo el personal, lilium adopta un esquema estructurado en cuatro niveles:

1. **Restringido / Crítico:** Información altamente sensible protegida por regulaciones legales estrictas (como el RGPD o leyes locales de protección de datos personales) o sujeta a secreto comercial. El acceso se limita bajo necesidad estricta de conocer (_need-to-know_).
   - _Ejemplos:_ Bases de datos de clientes con datos bancarios (_SPII_), registros médicos (_PHI_), claves privadas criptográficas, código fuente principal de software propietario y credenciales maestras.
   - _Impacto:_ Crítico (sanciones regulatorias millonarias, demandas legales y parálisis operativa del negocio).
2. **Confidencial:** Datos corporativos internos cuya divulgación externa perjudicaría la competitividad, la confianza de clientes o los acuerdos contractuales de la empresa.
   - _Ejemplos:_ Contratos con proveedores, nóminas salariales de los empleados, balances contables trimestrales no publicados y listas mayoristas de precios.
   - _Impacto:_ Alto (pérdida de ventaja estratégica en el mercado y litigios comerciales).
3. **Uso Interno:** Información operativa ordinaria accesible para el personal de la empresa, pero no concebida para difusión pública externa.
   - _Ejemplos:_ Manuales de procedimientos, políticas internas de trabajo, organigramas organizacionales y minutas de reuniones de equipo.
   - _Impacto:_ Moderado a bajo (daño financiero directo reducido, aunque puede facilitar el reconocimiento previo en ataques de ingeniería social).
4. **Público:** Datos concebidos y autorizados formalmente para divulgación general sin restricciones de acceso.
   - _Ejemplos:_ Catálogos comerciales en el sitio web institucional, comunicados de prensa, especificaciones públicas de productos y horarios de atención al cliente.
   - _Impacto:_ Nulo en términos de confidencialidad, si bien debe resguardarse su integridad para evitar desinformación o desfiguraciones no autorizadas.

### Estados de la información y ciclo de vida

Los datos en una organización no permanecen estáticos. De acuerdo con el estándar NIST CSF 2.0 (categoría `PR.DS`) y las mejores prácticas de arquitectura, los datos deben protegerse en función de los tres estados en los que pueden encontrarse:

1. **Datos en reposo (_Data at Rest_ — NIST PR.DS-01):** Información almacenada de forma estática en soportes físicos o lógicos, tales como discos de servidores, estaciones de trabajo, bases de datos relacionales, cintas de respaldo o unidades de almacenamiento extraíbles. Son vulnerables a la sustracción física de discos, a accesos locales indebidos y a infecciones por software de rescate (_ransomware_).
2. **Datos en tránsito (_Data in Transit_ — NIST PR.DS-02):** Información que se transmite activamente a través de redes locales o públicas mediante cables o señales inalámbricas. Su principal riesgo radica en la interceptación no autorizada de paquetes (_packet sniffing_) y los ataques de intermediario (_Man-in-the-Middle_).
3. **Datos en uso (_Data in Use_ — NIST PR.DS-10):** Información que está siendo procesada, leída o modificada en tiempo real en la memoria de acceso aleatorio (RAM) de un equipo o presentada en pantalla ante un operador.

Adicionalmente, se debe documentar el ciclo de vida de los datos, abarcando desde su creación o captura inicial, pasando por su almacenamiento y procesamiento, hasta su archivo histórico o eliminación definitiva segura (Salvaguardas 3.1 y 3.8 de CIS Controls v8.1).

> [!NOTE:Diferenciación de roles sobre la información]
> Al documentar el mapa de datos, es vital separar dos figuras complementarias:
>
> - **Propietario de los datos (_Data Owner_):** Representante del área de negocio o directivo que define la clasificación de la información y autoriza formalmente los privilegios de acceso.
> - **Custodio de los datos (_Data Custodian_):** Equipo técnico, administrador de sistemas o proveedor de servicios en la nube responsable de implementar los controles técnicos para almacenar, respaldar y transportar los datos de forma segura.

## 2.4. Software y Terceros <!-- id: software-permisos-terceros, icon: CpuIcon, displayTitle: 02.4 — Software y Terceros, description: Auditoría de privilegios, software sin soporte (EOL), Shadow IT y gestión de riesgos en la cadena de suministro. -->

En esta fase se audita la capa lógica de los sistemas informáticos. El objetivo es identificar aplicaciones vulnerables, programas no autorizados o servicios legítimos que se ejecuten con permisos superiores a los requeridos. Simultáneamente, se identifican las dependencias externas —desde bibliotecas de programación de código abierto hasta servicios alojados en la nube— para conformar un inventario centralizado de dependencias tecnológicas.

### Detección de software vulnerable, permisos excesivos y aplicaciones no autorizadas

Los atacantes rastrean activamente las redes empresariales para identificar programas desactualizados o configuraciones permisivas. Durante el relevamiento de software (alineado con CIS Control 2 y NIST `ID.AM-02`), la auditoría examina cuatro vectores principales:

- **Servicios y aplicaciones con privilegios excesivos:** Programas de uso cotidiano (navegadores web, lectores de documentos o servidores de soporte) ejecutados con privilegios de Administrador local o `root`. Si un usuario abre un archivo malicioso en una aplicación que corre con permisos de superusuario, el código adquiere control inmediato e irrestricto sobre la máquina.
- **Software sin soporte del fabricante (_End-of-Life_ o EOL):** Sistemas operativos antiguos o paquetes de software que han dejado de recibir parches de seguridad oficiales (Salvaguarda CIS 2.2). Al no disponer de correcciones ante nuevas vulnerabilidades descubiertas, representan puertas traseras permanentes en la red.
- **Aplicaciones no deseadas (_PUA_), software no regulado (_Shadow IT_) y código malicioso:** Herramientas gratuitas o extensiones de navegador instaladas por los empleados sin autorización del departamento de informática, así como programas de minería de criptomonedas (_cryptojacking_), programas espía (_spyware_) o troyanos.
- **Técnicas de vida sobre el terreno (_Living off the Land_ o LotL):** Métodos de ataque avanzados donde el adversario no introduce ejecutables externos en el disco, sino que abusa de herramientas de administración legítimas y preinstaladas en el sistema operativo (como PowerShell en Windows o `bash` y `curl` en Linux) para ejecutar comandos en memoria sin ser detectado por antivirus convencionales.

### Inventario de dependencias externas, código abierto y plataformas SaaS

Las organizaciones contemporáneas dependen de un ecosistema interconectado de proveedores. La gestión del riesgo en la cadena de suministro (_Supply Chain Risk Management_, abordado en NIST `GV.SC` y CIS Control 15) es crítica porque cualquier vulnerabilidad en un servicio externo integrado a la empresa puede comprometer el entorno local.

Para estructurar este relevamiento, el inventario de dependencias se divide en dos categorías:

1. **Proveedores de servicios y plataformas en la nube (SaaS / PaaS / IaaS):** Muchas pequeñas y medianas empresas canalizan sus comunicaciones, facturación contable, administración de clientes (CRM) y repositorios documentales a través de plataformas SaaS. Siguiendo las Salvaguardas 15.1 y 15.3 de CIS Controls, se debe registrar cada proveedor, la tipología de datos corporativos que procesa, el volumen de información involucrado, el responsable interno de la relación comercial y el plan de contingencia ante caídas del servicio o incidentes de seguridad del proveedor.
2. **Bibliotecas de código y lista de materiales de software (_SBOM_):** Cuando la organización desarrolla software a medida o adapta plataformas web, incorpora bibliotecas de código abierto, módulos de desarrollo y conectores de interfaz de programación de aplicaciones (API). La Salvaguarda CIS 16.4 y la guía de riesgos web de OWASP (Riesgo A06: Componentes vulnerables y desactualizados) exigen elaborar un inventario detallado de componentes (_Software Bill of Materials_ o SBOM) para detectar con rapidez componentes afectados por vulnerabilidades críticas, como la ocurrida históricamente con la biblioteca _Log4j_.

> [!TIP:Auditoría técnica de permisos y autorizaciones SaaS]
> En sistemas Linux, es posible auditar archivos locales que posean permisos de escritura abiertos para cualquier usuario (_world-writable_) ejecutando:
>
> ```bash:terminal
> # Buscar archivos con permisos de escritura para terceros y reportar sus rutas
> sudo find / -xdev -type f -perm -0002 -exec ls -l {} + 2>/dev/null
> ```
>
> En plataformas en la nube corporativas (como Google Workspace o Microsoft 365), audita periódicamente qué aplicaciones de terceros poseen permisos delegados (_tokens_ de autorización OAuth) para leer correos, archivos compartidos o calendarios institucionales.

## 2.5. Metodología y Evaluación <!-- id: metodologia-descubrimiento-evaluacion, icon: Target01Icon, displayTitle: 02.5 — Metodología y Evaluación, description: Estrategias de escaneo interno y externo, análisis con CVE/NVD y priorización de riesgo basada en CVSS. -->

Para trasladar los relevamientos teóricos a un proceso técnico riguroso y reproducible, la organización debe planificar y ejecutar escaneos de seguridad periódicos sobre su infraestructura. Una vez recopilados los hallazgos técnicos, se utilizan sistemas estandarizados de medición de severidad combinados con el contexto de negocio de la empresa para determinar el orden de remediación de las debilidades descubiertas.

### 1. Estrategia de escaneo de vulnerabilidades

Un escáner de vulnerabilidades es una herramienta especializada que inspecciona equipos, conmutadores, cortafuegos y aplicaciones para contrastar sus versiones y configuraciones frente a bases de datos de fallas conocidas. Conforme a las Salvaguardas 7.5 y 7.6 de CIS Controls v8.1, la evaluación de la infraestructura requiere combinar distintas perspectivas de escaneo:

| Modalidad de Escaneo                                                              | Perspectiva y Alcance                                                                               | Qué nos permite descubrir                                                                                                                                | Frecuencia Recomendada (CIS v8.1)                                            |
| :-------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| **Escaneo de Descubrimiento**                                                     | Sondeo rápido preliminar sobre los rangos de direcciones IP del entorno local.                      | Identifica equipos encendidos en la red (_hosts_ vivos), dispositivos nuevos no autorizados y puertos abiertos.                                          | Frecuencia semanal o continua automatizada.                                  |
| **Escaneo Externo**                                                               | Simulación de la perspectiva de un atacante situado en Internet, fuera del perímetro institucional. | Puertos de administración expuestos involuntariamente a la web pública, certificados TLS caducados, fallas perimetrales y paneles web accesibles.        | Frecuencia mensual o tras cualquier cambio perimetral (**Salvaguarda 7.6**). |
| **Escaneo Interno**                                                               | Sondeo ejecutado desde el interior de la red corporativa (LAN).                                     | Falta de parches en servidores internos, estaciones de trabajo no actualizadas y vías propicias para el movimiento lateral de intrusos.                  | Frecuencia trimestral como mínimo (**Salvaguarda 7.5**).                     |
| **Escaneo No Autenticado**                                                        | La herramienta sondea los servicios de los equipos sin utilizar credenciales de acceso.             | Evalúa la exposición visible para un visitante o intruso que no posee cuentas en el sistema (por ejemplo, carpetas compartidas abiertas sin contraseña). | Frecuencia trimestral en conjunto con escaneos internos.                     |
| **Escaneo Autenticado**                                                           | La herramienta inicia sesión en los servidores utilizando credenciales de auditoría dedicadas.      | Inspección exhaustiva de versiones de software instaladas, parches faltantes del núcleo, configuraciones erróneas y directivas locales débiles.          | Frecuencia trimestral obligatoria (**Salvaguarda 7.5**).                     |
| _Modalidades de escaneo de vulnerabilidades, alcance y periodicidad recomendada._ |

Un ejemplo básico de escaneo de descubrimiento y enumeración de versiones mediante la utilidad de red `nmap` se ejecuta de la siguiente manera:

```bash:terminal
# Descubrimiento de hosts activos y enumeración de servicios en una subred interna
sudo nmap -sS -sV -T4 --top-ports 100 -oN escaneo_descubrimiento.txt 192.168.10.0/24
```

```text:salida-terminal
Starting Nmap 7.94 ( https://nmap.org ) at 2026-11-09 15:30 UTC
Nmap scan report for srv-bd.empresa.local (192.168.10.20)
Host is up (0.00045s latency).
Not shown: 97 closed tcp ports
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.6 (Ubuntu Linux; protocol 2.0)
5432/tcp open  pgsql   PostgreSQL DB 14.11
```

### 2. Identificación y medición de severidad: CVE, NVD y CVSS

Cuando los escaneos detectan fallas en los sistemas, los analistas de seguridad utilizan un estándar público internacional para clasificar e interpretar los hallazgos:

- **CVE (_Common Vulnerabilities and Exposures_):** Identificador alfanumérico único estandarizado (por ejemplo, `CVE-2021-44228`) asignado a cada vulnerabilidad pública documentada en la industria.
- **NVD (_National Vulnerability Database_):** Repositorio del gobierno de los Estados Unidos administrado por el NIST que consolida y analiza técnicamente cada registro CVE, asociándole vectores de ataque, documentación y notas de remediación.
- **CVSS (_Common Vulnerability Scoring System_):** Marco internacional estandarizado para calificar la severidad técnica de una vulnerabilidad en una escala numérica que va desde `0.0` hasta `10.0`.

| Rango de Puntuación CVSS                                              | Nivel de Gravedad | Criterio de Acción y Priorización en lilium                                                                                                                                                                  |
| :-------------------------------------------------------------------- | :---------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **9.0 – 10.0**                                                        | Crítico           | **Intervención urgente e inmediata:** Vulnerabilidades que admiten ejecución remota de código arbitrario (_RCE_) o compromiso total del sistema sin requerir privilegios previos ni interacción de usuarios. |
| **4.0 – 8.9**                                                         | Medio a Alto      | **Planificación en plazos breves:** Debilidades que comprometen la integridad o confidencialidad, requiriendo parches en el ciclo mensual de mantenimiento o controles compensatorios provisionales.         |
| **0.0 – 3.9**                                                         | Bajo              | **Sin urgencia operativa inmediata:** Fallas de baja explotabilidad o impacto residual marginal; se corrigen durante las ventanas ordinarias de actualización de software.                                   |
| _Escala de gravedad CVSS v3.1 y criterios de priorización en lilium._ |

### 3. Del puntaje técnico a la priorización real del riesgo

Una calificación técnica alta en CVSS no implica necesariamente que la vulnerabilidad represente un peligro inminente para la empresa si no existen condiciones de contexto que permitan su materialización. Antes de asignar los recursos del equipo a una tarea de remediación, se deben formular tres preguntas fundamentales de evaluación de riesgo contextual:

1. **¿Existe un código de ataque activo y disponible (_exploit_ público)?** Una vulnerabilidad calificada con 7.2 que cuente con herramientas automatizadas de ataque circulando en Internet reviste mayor urgencia práctica que una vulnerabilidad calificada con 9.1 de complejidad puramente teórica que requiera acceso físico al hardware.
2. **¿Cuál es la ubicación y nivel de exposición del activo vulnerable?** Una vulnerabilidad en un servidor web alojado en la DMZ y accesible desde cualquier punto de Internet posee una probabilidad de explotación drásticamente superior a la misma debilidad radicada en un servidor interno aislado en la red restringida.
3. **¿Qué criticidad operativa y qué datos alberga el equipo afectado?** Si el sistema procesa transacciones bancarias, resguarda registros clasificados como Restringidos (_SPII_) o sostiene la facturación continua del negocio, el impacto potencial de su compromiso eleva la prioridad de respuesta al nivel máximo.
