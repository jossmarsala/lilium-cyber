# 3) Diseñar <!-- id: layer-3 -->

## Módulo 3: Diseño de Arquitectura de Seguridad

El módulo de diseño traduce los riesgos y vulnerabilidades descubiertas en la etapa anterior en un plano arquitectónico estructurado, estableciendo la lógica defensiva antes de implementar cualquier herramienta.

En el _framework_ de LILIUM, la subcapa **DESIGN (Lógica arquitectónica)** representa la continuación estratégica del módulo anterior. Este módulo enseña a pensar la seguridad como un plano de ingeniería. Utilizando el inventario y las debilidades mapeadas en la capa anterior, aquí se decide cómo segmentar la red, cómo agrupar a los usuarios y cómo distribuir los controles para aislar los activos críticos, garantizando que si una barrera falla, el impacto operativo esté estrictamente limitado.

### ¿Qué vas a aprender?

- Aplicar del modelo de defensa en profundidad para proteger el perímetro, la red, el _endpoint_ y los datos.
- Diseñar de zonas de confianza, subredes, aislamientos y zonas desmilitarizadas (`DMZ`).
- Estructurar de permisos mediante Control de Acceso Basado en Roles (`RBAC`) y la lógica de mínimo privilegio.
- Diseñar vías seguras para el trabajo remoto y la conexión con proveedores de servicios en la nube (`IaaS`, `SaaS`).
- Modelar amenazas evaluando el diseño propuesto mediante la simulación de vectores de ataque (`Threat Modeling`).
- Planificar la transición, elaborando de un plan de acción escalonado para migrar hacia la nueva arquitectura sin interrumpir el negocio.

### ¿Para quién es?

Este módulo asume que el lector ya comprende los fundamentos del riesgo y conoce el estado actual de su infraestructura. Su enfoque es analítico y de planificación arquitectónica.

| Perfil de usuario                                                  | Nivel esperado            | Conocimientos previos recomendados                                                                                                                      |
| :----------------------------------------------------------------- | :------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Responsables de infraestructura e IT**                           | Intermedio - Principiante | Comprensión de topologías de red básicas y administración general de sistemas. Capacidad para leer diagramas de red.                                    |
| **Líderes técnicos y arquitectos**                                 | Intermedio                | Experiencia en el diseño de soluciones tecnológicas. Interés en alinear la arquitectura existente con los marcos de referencia (ej. CIS Controls v8.1). |
| **Estudiantes de ciberseguridad**                                  | Principiante - Avanzado   | Haber completado los módulos `01. UNDERSTAND` y `02. DISCOVER`. Familiaridad con conceptos como puertos, direcciones IP y vulnerabilidades.             |
| _Perfiles recomendados y requisitos de entrada para el módulo 03._ |

:::subindex
title="Índice del módulo"
:::

### Cómo abordar este módulo

:::steps

### 1. Revisión de la línea base

Antes de comenzar, asegúrate de tener claros los hallazgos críticos que priorizaste al finalizar el módulo `02. DISCOVER`. El diseño que construyas aquí debe responder directamente a esas debilidades.

### 2. Entregables de la sección

Al leer las secciones, irás construyendo matrices y diagramas de arquitectura que te ayudarán a lograr un diseño de seguridad sólido. Procura ir realizando estos entregables antes de llegar al siguiente módulo.

### 3. Creación del mapa de ruta

Finaliza el módulo construyendo tu propio plan de transición (sección `03.6`). Este documento será tu guía exacta de instrucciones cuando pases al módulo `04. PROTECT` para ejecutar los comandos y configurar las herramientas reales.
:::

## 3.1. Defensa en Profundidad <!-- id: defensa-en-profundidad, icon: Layers01Icon -->

Terminar el inventario de activos y la evaluación de vulnerabilidades del Módulo 2 suele generar cierta abrumación en los equipos técnicos. De pronto, la empresa se encuentra frente a una lista extensa de equipos desactualizados, permisos excesivos y servicios expuestos. La reacción instintiva más común en ese momento es intentar apagar incendios de forma aislada. Sin embargo, al aplicar parches desconectados sin un diseño previo, no es posible construir un sistema de seguridad sólido.

En esta sección establecerás las bases de la arquitectura de seguridad de la organización. El objetivo aquí es dar un paso atrás antes de tocar cualquier configuración técnica para conectar los riesgos descubiertos con decisiones de diseño coherentes. Antes de dividir la red, estructurar los permisos de los usuarios o endurecer servidores en el Módulo 4 (`04. PROTECT`), aprenderemos a distribuir nuestras defensas en capas coordinadas para que, cuando una barrera inevitablemente falle, exista otra detrás lista para contener el impacto.

### Fundamentos de arquitectura de seguridad

Para diseñar un entorno verdaderamente seguro es fundamental ordenar el vocabulario operativo.

- **Arquitectura de seguridad**: Es el plano lógico y físico que define cómo se organizan los equipos, las zonas de red, los flujos de datos y las barreras defensivas para proteger la confidencialidad, integridad y disponibilidad de la información.
- **Política de seguridad**: Es la regla general dictada por la dirección de la empresa que define qué activos se deben proteger y por qué, alineando a todo el personal bajo un mismo criterio de cuidado.
- **Estándar**: Es el requisito técnico medible y uniforme que traduce la política a la realidad (por ejemplo, definir que toda cuenta sin autenticación multifactor deberá tener una contraseña de al menos 14 caracteres).
- **Procedimiento**: Es la guía paso a paso (conocida como Procedimiento Operativo Estándar o `SOP`) que explica exactamente cómo ejecutar una tarea técnica sin cometer errores ni omitir validaciones.
- **Control de seguridad (Salvaguarda)**: Es la medida defensiva concreta (administrativa, técnica o física) diseñada e implementada para reducir la probabilidad o el impacto de un riesgo específico.
- Herramienta : Es el programa o equipo específico (como un _firewall_ `OPNsense` o un gestor de identidades `Keycloak`) que se utiliza como vehículo para implementar y automatizar un control.

> [!NOTE]
> Para una arquitectura de seguridad sólida, se recomienda primero definir qué riesgo desea mitigar (política y evaluación), bajo qué criterio medible lo hará (estándar), qué mecanismo necesita (control), y finalmente, qué herramienta será utilizada para dicho fin.

#### Principios rectores del diseño arquitectónico

Para evitar que la seguridad dependa de la improvisación, la ingeniería de sistemas seguros se apoya en principios de diseño de marcos profesionales (como los dominios de arquitectura de `CISSP`, _Certified Information Systems Security Professional_, y las guías del Proyecto Abierto de Seguridad de Aplicaciones Web u `OWASP`). Pensar como arquitecto implica filtrar cada decisión a través de seis reglas fundamentales:

1.  **Defensa en profundidad (_Defense in Depth_):** Ningún control individual es infalible. La arquitectura debe superponer múltiples barreras independientes y heterogéneas para que, si un atacante vulnera el perímetro o engaña a un usuario, deba enfrentarse a controles internos de red, de dispositivo, de aplicación y de cifrado antes de alcanzar los activos críticos.
2.  **Simplicidad y economía de mecanismo:** La complejidad excesiva juega siempre a favor del atacante. Un diseño difícil de entender para el propio equipo técnico es un diseño imposible de auditar, propenso a errores humanos de configuración y fácil de abandonar con el paso de los meses.
3.  **Fallar de forma segura (_Fail-safe_ / _Fail-secure_):** Cuando un sistema, servicio o control de seguridad sufre un error operativo, pierde energía o se detiene de manera inesperada, debe restablecerse automáticamente a su estado más restrictivo y seguro, bloqueando el acceso no autorizado en lugar de quedar abierto por defecto.
4.  **Seguridad por diseño y configuraciones seguras por defecto:** La protección debe integrarse desde el trazado inicial de la infraestructura y el ciclo de vida del software, nunca como un agregado posterior. Asimismo, el estado predeterminado de cualquier activo o aplicación al desplegarse debe ser el más seguro posible, exigiendo una acción deliberada y documentada para habilitar permisos o abrir servicios.
5.  **Evitar la seguridad por oscuridad (_Security by Obscurity_):** La resistencia de una arquitectura jamás debe depender de mantener en secreto su diseño, el nombre de sus servidores, la ubicación de sus rutas o el funcionamiento de sus algoritmos. El diseño debe ser público para los auditores y seguir siendo seguro gracias a la solidez de sus controles.
6.  **Alineación entre seguridad y usabilidad (Fricción proporcional):** Un control que impide trabajar será inevitablemente saboteado por los propios usuarios. Si la arquitectura exige procesos absurdos para tareas cotidianas de bajo riesgo, los empleados anotarán las contraseñas en papeles adhesivos o usarán sus correos personales sin aprobación (_Shadow IT_). El diseño debe concentrar la fricción únicamente en las acciones críticas o sensibles.

#### Adecuación al contexto de Pequeñas y Medianas Empresas

Uno de los mayores riesgos al leer manuales de ciberseguridad es intentar aplicar controles diseñados para grandes corporaciones dentro de una empresa de veinte o cincuenta empleados. Las PyMEs operan con presupuestos acotados, personal de tecnología de la información (`TI`) reducido o multifunción, y una tolerancia casi nula a la interrupción de sus actividades comerciales diarias

Para adaptar la arquitectura a la realidad operativa de cada organización, marcos internacionales como los Controles Críticos de `CIS` (_Center for Internet Security_) estructuran sus salvaguardas en tres **Grupos de Implementación (`IG`, _Implementation Groups_)** acumulativos, los cuales se complementan con los **Niveles de Madurez (_Tiers_ 1 a 4)** del Marco de Ciberseguridad del Instituto Nacional de Estándares y Tecnología (`NIST CSF` 2.0). Es importante encontrar el adecuado para cada empresa.

| Nivel de Madurez                                                                                                            | Perfil operativo de la organización                                                                                                                                                                                            | Cómo se traduce al diseño arquitectónico                                                                                                                                                                                                                                                       |
| :-------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nivel Base: CIS IG1 _(Higiene Cibernética Esencial)_ / **NIST Tier 1–2                                                    | Pequeñas y medianas empresas con experiencia limitada en `TI` y ciberseguridad. Su prioridad crítica es mantener el negocio operativo y proteger datos de empleados y financieros frente a ataques generales y oportunistas.   | Arquitectura simple, de bajo costo y alta eficacia operativa. Se diseña priorizando visibilidad de activos, copias de seguridad aisladas, autenticación multifactor (MFA), parches automatizados y _firewall_ básicos usando herramientas comerciales estándar o nativas del sistema operativo |
| **Nivel Intermedio: CIS IG2 _(Complejidad Operativa Intermedia)_ / **NIST Tier 2–3                                          | Organizaciones que cuentan con personal dedicado a administrar y proteger la infraestructura de `TI`, múltiples departamentos con distintos perfiles de riesgo, datos sensibles de clientes o cargas regulatorias específicas. | El diseño incorpora segmentación formal de redes (`VLANs`, DMZ), centralización de identidades y registros de auditoría (SIEM), escaneos periódicos de vulnerabilidades y procesos documentados repetibles                                                                                     |
| **Nivel Avanzado:: CIS IG3 _(Defensa Avanzada)_ / **NIST Tier 3–4                                                           | Empresas con equipos especializados en diversas ramas de seguridad (pruebas de penetración, seguridad de aplicaciones, respuesta a incidentes) y activos críticos sujetos a estricta supervisión regulatoria.                  | Arquitectura adaptativa diseñada para resistir adversarios sofisticados, ataques dirigidos y vulnerabilidades de día cero (`zero-day`), incluyendo microsegmentación, control de acceso en tiempo real, prevención de pérdida de datos (`DLP`) y caza proactiva de amenazas.                   |
| _Escalonamiento realista de la arquitectura según los Grupos de Implementación (IG) de CIS y los Niveles del NIST CSF 2.0._ |

### Diseño estructurado por capas: Los 5 anillos defensivos y el eje transversal

Diseñar en profundidad significa visualizar la empresa como una serie de anillos concéntricos. El activo más valioso —los datos críticos del negocio— se ubica en el núcleo interno, rodeado por capas sucesivas de contención. Cada capa tiene responsabilidades específicas y asume que la capa exterior puede haber sido superada.

```filetree:Arquitectura_Defensa_en_Profundidad
Infraestructura_Organizacional/
├── Capa_00_Fisica_y_Entorno/          # Instalaciones, energía, acceso físico a gabinetes y equipos
├── Capa_01_Perimetral/                # Frontera con Internet, filtrado DNS, pasarela de correo, VPN
├── Capa_02_Red_Interna/               # Segmentación por zonas (VLAN/Subredes), Firewall interno, IDS/IPS
├── Capa_03_Identidad_y_Acceso_IAM/    # Autenticación (MFA/SSO), Autorización por rol (RBAC) y Auditoría
├── Capa_04_Endpoint_y_Host/           # Configuración base (Hardening), Firewall local, Antimalware/EDR
├── Capa_05_Aplicacion_y_Datos/        # Seguridad en código, Reverse Proxy, Cifrado (TLS/AES) y Hashing
└── Eje_Transversal_Resiliencia_Logs/  # Colector central de registros (SIEM/Syslog) y Backups aislados (3-2-1)
```

#### 1. Capa Física y del Entorno (El cimiento tangible)

Incluso en empresas que utilizan servicios en la nube, siempre existen equipos físicos en las oficinas o plantas: computadoras portátiles, enrutadores (_routers_), conmutadores de red (_switches_) o algún servidor local. La mejor configuración virtual resulta inútil si cualquier visitante puede entrar a un cuarto sin llave, conectar un cable a un _switch_, insertar una memoria `USB` maliciosa o llevarse físicamente el disco duro donde están las bases de datos.

El diseño en esta capa contempla el cierre con llave de gabinetes de telecomunicaciones y salas de servidores, controles de acceso físico a las oficinas (tarjetas o registros), vigilancia mediante circuito cerrado de televisión (`CCTV`) en áreas sensibles, y protección ambiental (sistemas de alimentación ininterrumpida o `UPS` y control de temperatura) para preservar la disponibilidad del hardware.

#### 2. Capa Perimetral (La frontera externa)

Es la primera barrera lógica que separa las redes internas controladas por la organización de las redes públicas no controladas, como Internet. Su función en el plano arquitectónico es repeler el ruido constante de ataques automatizados y validar quién intenta entrar o hacia dónde intentan conectarse los equipos internos.

En esta capa se diseñan los puntos únicos de entrada y salida de la organización mediante _firewalls_ perimetrales, el uso de servicios de filtrado del Sistema de Nombres de Dominio (DNS) para bloquear la resolución hacia dominios maliciosos conocidos, pasarelas de filtrado de correo electrónico con validación de autenticidad de dominio y concentradores de Red Privada Virtual (VPN) o proxies inversos para regular el acceso remoto.

#### 3. Capa de Red Interna (Contención del movimiento lateral)

Tradicionalmente, cuando un atacante lograba atravesar el perímetro (por ejemplo, cuando un empleado abría un archivo infectado), se encontraba con una red interna completamente plana donde todas las computadoras podían verse entre sí. La capa de red interna se diseña específicamente para romper esa libertad de movimiento.

Arquitectónicamente, esta capa se diseña dividiendo la red en zonas de seguridad aisladas (subredes y redes locales virtuales o _VLANs_), interponiendo firewalls internos o firewalls de última generación (NGFW) con inspección profunda de paquetes (DPI) entre segmentos, y ubicando sensores de detección o prevención de intrusiones (IDS/IPS) para vigilar las comunicaciones internas.

#### 4. Capa de Identidad y Accesos (`IAM`)

En el entorno actual, donde los empleados acceden a sistemas desde sus casas y utilizan aplicaciones en la nube (`SaaS`), la identidad se ha convertido en una barrera defensiva fundamental que atraviesa toda la arquitectura. Esta capa se diseña aplicando la estructura `AAA` (_Authentication, Authorization, Accounting_):

- **Autenticación:** Confirmar quién es realmente el usuario exigiendo más de una prueba de identidad mediante Autenticación Multifactor (MFA), combinando algo que sabe (contraseña) con algo que posee (aplicación generadora de códigos o llave física) y algo que es (datos biométricos).

- **Autorización:** Aplicar estrictamente el principio de **mínimo privilegio** y la **separación de funciones**, asegurando que cada cuenta humana o de servicio tenga permiso para tocar únicamente los archivos o sistemas indispensables para su rol diario.

- **Trazabilidad (_Accounting_):** Garantizar que cada inicio de sesión y cada acción relevante quede vinculada a una persona identificable, eliminando el uso de cuentas genéricas o compartidas.

#### 5. Capa de Punto de Conexión (_Endpoint_) y Host

Comprende todos los dispositivos finales que interactúan con la red: computadoras portátiles, estaciones de escritorio, dispositivos móviles y servidores físicos o virtuales. Como los usuarios leen correos, abren documentos y navegan por la web desde estos equipos, el _endpoint_ es el campo de batalla donde se originan la mayoría de los incidentes.

El diseño de esta capa exige que cada equipo sea capaz de defenderse por sí mismo incluso si la red local está comprometida. Esto incluye el diseño de imágenes de línea base con configuraciones seguras (_hardening_ del sistema operativo), la activación de _firewalls_ locales basados en host con denegación por defecto, la gestión automatizada de parches, la prevención de ejecución de código no autorizado y el despliegue de agentes antimalware basados en comportamiento o soluciones de Detección y Respuesta en el Punto Final (EDRs).

#### 6. Capa de Aplicación y Datos

La capa de aplicación comprende el software (portales web, sistemas de gestión,`APIs`) que sirve de puente entre los usuarios y la información. Su diseño exige separar por completo los entornos de prueba o desarrollo de los sistemas reales de producción, validar que las aplicaciones filtren cualquier dato ingresado por el usuario para evitar ataques de inyección (como inyección `SQL` o _Cross-Site Scripting_ `XSS`), y colocar proxies inversos delante de los servicios web expuestos.

En el centro absoluto reside la Capa de Datos, donde se almacena la información crítica y la Información de Identificación Personal (PII). El diseño arquitectónico de esta capa debe estructurar controles específicos para los tres estados del dato:

- **Datos en reposo (_Data at rest_):** Es la información guardada de forma pasiva en discos duros, servidores de archivos, bases de datos o memorias extraíbles. Se protege diseñando el cifrado completo de los discos en todos los equipos portátiles y servidores (mediante tecnologías nativas de cada SO) y algoritmos robustos como `AES-256`. Además, las contraseñas almacenadas en bases de datos jamás deben guardarse en texto legible ni cifradas de forma reversible, sino transformadas mediante funciones `hash` unidireccionales robustas (como `SHA-256` o algoritmos derivados específicos) combinadas con cadenas aleatorias únicas (`salting`) para inutilizar ataques de tablas precalculadas (_Rainbow tables_).

- **Datos en tránsito (_Data in transit_):** Es la información que viaja por cables o señales inalámbricas de un equipo a otro o hacia Internet. Se protege obligando por diseño a que toda comunicación utilice canales cifrados modernos (`TLS 1.2/1.3`, `HTTPS`, `SSH`, `SFTP` o túneles VPN) y erradicando protocolos antiguos que transmiten contraseñas y datos en texto claro, como `HTTP`, `Telnet` o `FTP`.

- **Datos en uso (_Data in use_):** Es la información mientras está cargada temporalmente en la memoria `RAM` o siendo procesada por el procesador (`CPU`). Se protege mediante controles estrictos de permisos de sesión, aislamiento de procesos del sistema operativo y activación de protecciones nativas de memoria contra explotación de código (como la Prevención de Ejecución de Datos o `DEP`).

### El eje transversal: Diseñar para Ver (Visibilidad) y para Sobrevivir (Resiliencia)

Uno de los errores más graves al diseñar por primera vez la seguridad de una empresa es concentrar el 100% del esfuerzo en evitar que el atacante entre, olvidando preparar el terreno para dos preguntas inevitables: **¿cómo nos daremos cuenta si alguien logra entrar?** y **¿cómo volveremos a operar si logra hacer daño?**.

Aunque el monitoreo diario se profundiza en el Módulo 5 (`05. DETECTAR`) y la gestión de incidentes en el Módulo 6 (`06. RESPONDER & RECUPERAR`), si los conductos de registro y las bóvedas de respaldo no se diseñan ahora, los controles posteriores carecerán de base física o lógica donde apoyarse.

#### 1. Arquitectura de visibilidad y recolección de registros (`Logs`)

Cuando un atacante compromete un servidor, una de las primeras acciones que ejecuta para asegurar su impunidad es borrar los registros de eventos (`logs`) guardados en esa misma máquina. Si la arquitectura de la empresa deja que cada computadora guarde sus registros únicamente en su propio disco duro, el equipo de seguridad se quedará ciego exactamente cuando más necesita investigar qué ocurrió.

Por ello, el diseño arquitectónico debe incorporar tres requisitos de visibilidad desde el primer día:

- **Relojes sincronizados en toda la red:** Todos los servidores, equipos de red y computadoras deben sincronizar su hora automáticamente contra al menos dos fuentes confiables utilizando el Protocolo de Tiempo de Red (NTP). Si el reloj del `firewall` está adelantado cinco minutos respecto al reloj del servidor web, será imposible reconstruir la línea de tiempo real de un ataque.

- **Envío centralizado e inalterable:** La arquitectura debe contemplar un punto central de recolección de registros (ya sea un servidor `Syslog` interno protegido o un sistema de Gestión de Información y Eventos de Seguridad, SIEM, local o en la nube). Los equipos deben enviar una copia de sus eventos en tiempo real hacia ese repositorio central, el cual debe estar configurado para que los servidores de origen puedan _enviar_ datos nuevos, pero no tengan permisos para _borrar_ ni _modificar_ lo que ya fue registrado.

- **Espacio de retención suficiente:** Muchos ataques no se descubren el mismo día en que ocurren; el tiempo de permanencia (_dwell time_) de un intruso dentro de una red suele ser de semanas o meses. El diseño del almacenamiento central debe calcularse para conservar los registros de auditoría durante un mínimo recomendado de **90 días** para permitir investigaciones retrospectivas.

#### 2. Arquitectura de copias de seguridad frente al secuestro de datos (ransomware)

En los ataques actuales de ransomware, los criminales no cifran la primera computadora que infectan de forma inmediata. Primero exploran silenciosamente la red buscando dónde están las carpetas compartidas de copias de seguridad (_backups_), acceden al servidor de respaldos utilizando las mismas credenciales de administrador que robaron en la red principal, eliminan o cifran todas las copias de seguridad y recién entonces detonan el cifrado masivo sobre toda la empresa para obligarla a pagar el rescate.

Si desde una computadora de oficina o desde un servidor de producción es posible abrir una carpeta compartida y borrar los archivos de respaldo, ese respaldo será destruido durante un ataque de ransomware. Para que la arquitectura garantice la supervivencia del negocio, el diseño de recuperación debe basarse en dos pilares estructurales:

1. **Estrategia 3-2-1:** Diseñar el flujo para mantener siempre al menos **3** copias de los datos importantes (los datos originales de trabajo más dos copias extra), guardadas en **2** tipos de almacenamiento o tecnologías distintas (por ejemplo, un servidor de almacenamiento local y un servicio en la nube), asegurando que al menos **1** de esas copias esté fuera de la oficina física (_off-site_).
2. **Estrategia 3-2-1-1-0:** Para llevar la resiliencia un paso más allá frente a las variantes modernas de ransomware, la industria ha evolucionado la estrategia anterior hacia la **regla 3-2-1-1-0**. Este estándar exige mantener al menos **3** copias de los datos, guardadas en **2** soportes tecnológicos distintos, con **1** copia ubicada fuera de las instalaciones físicas de la empresa; a esto se le suma el requisito de mantener **1** copia completamente fuera de línea o inmutable (como una instancia aislada o bloqueada que no pueda ser cifrada ni borrada ni siquiera por un atacante que haya vulnerado la red con privilegios administrativos), y culmina garantizando **0** errores mediante la ejecución de pruebas de restauración periódicas para comprobar en la práctica que los sistemas y datos recuperados son totalmente funcionales y confiables.
3. **Aislamiento e inmutabilidad (`Pull Backup` y bloqueo):** El repositorio de respaldos debe vivir en una zona de red separada, utilizar credenciales administrativas totalmente independientes de las del resto de la empresa (nunca compartir el mismo usuario administrador del dominio) y contar con una instancia aislada o inmutable. Técnicamente, se diseña bajo un esquema de "extracción" (_Pull_): el servidor de producción no tiene permiso para conectarse al servidor de respaldos; es el servidor de respaldos aislado quien se despierta a la hora programada, se conecta al servidor de producción para extraer la copia y vuelve a cerrar la puerta, o bien envía los datos a un almacenamiento en la nube con bloqueo de inmutabilidad temporal activado (donde ningún usuario, ni siquiera el administrador principal, puede borrar el archivo hasta que venza el plazo configurado).

### Selección y clasificación funcional de controles

Un diseño equilibrado no utiliza un único tipo de defensa. Para proteger cada activo crítico, necesitamos combinar controles según su **naturaleza** (cómo están hechos) y según su **función en el tiempo** (en qué momento del ataque entran en acción).

#### La matriz de funciones defensivas

Al diseñar la protección de un sistema, conviene hacerse tres preguntas cronológicas: _¿Qué pongo para evitar que ocurra el problema? (Preventivo)_, _¿Qué pongo para enterarme rápido si el control preventivo falla? (Detectivo)_ y _¿Qué pongo para apagar el incendio y restaurar todo si el ataque avanza? (Correctivo y de Recuperación)_.

| Momento de acción<br>                                                                                                       | Controles Administrativos y Humanos<br>                                                                                                                                                                                                                                  | Controles Técnicos y Lógicos<br>                                                                                                                                                                                                                                                         | Controles Físicos y de Entorno<br>                                                                                                                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. Preventivos**<br>_(Actúan **antes** del incidente para bloquear el ataque o reducir la exposición)_                    | • Políticas de mínimo privilegio y bajas inmediatas de exempleados.<br>• Separación de tareas críticas entre dos personas.<br>• Entrenamiento práctico al personal contra engaños de `phishing` y fraude financiero (`BEC`).<br>• Revisión de contratos con proveedores. | • Reglas de `firewall` que cierran puertos innecesarios.<br>• Exigencia de MFA.<br>• Cifrado de discos y de tráfico web (`HTTPS`/`TLS`).<br>• Actualización periódica de parches de seguridad.<br>• Listas que bloquean la ejecución de programas desconocidos.                          | • Llaves o tarjetas de acceso para ingresar a oficinas y cuartos de telecomunicaciones.<br>• Gabinetes cerrados para servidores y _switches_.<br>• Deshabilitación de tomas de red de pared en salas de espera públicas.                        |
| **2. Detectivos**<br>_(Actúan **durante** el incidente para descubrir anomalías y reducir el tiempo de permanencia)_        | • Auditorías periódicas para revisar qué permisos acumulan los usuarios.<br>• Rutinas semanales de revisión de registros de eventos.<br>• Canales claros y sin castigo para que un empleado avise rápido si hizo clic en un enlace sospechoso.                           | • Sensores de detección de intrusiones en la red (`IDS`).<br>• Alertas centralizadas en un SIEM ante inicios de sesión fuera de horario o por fuerza bruta.<br>• Verificación de cambios en archivos críticos mediante funciones `hash` (`SHA-256`).<br>• Uso de señuelos (`honeypots`). | • Cámaras de circuito cerrado (`CCTV`) y sensores de movimiento en accesos.<br>• Libro de registro de visitas y proveedores de mantenimiento.<br>• Sensores de apertura de puertas en racks de servidores o alarmas de humo y temperatura.      |
| **3. Correctivos y de Recuperación**<br>_(Actúan **después** de detectar el fallo para contener el daño y volver a operar)_ | • Manuales de respuesta a incidentes (`playbooks`) claros y asignados a responsables.<br>• Planes de Continuidad del Negocio (`BCP`) y Recuperación ante Desastres (`DRP`).<br>• Reuniones post-incidente para aprender de los errores y ajustar el diseño.              | • Bloqueo y aislamiento automático de un equipo infectado en la red mediante `EDR` o `IPS`.<br>• Restauración probada de servidores y bases de datos desde copias de seguridad aisladas.<br>• Revocación inmediata de sesiones activas y cambio forzado de contraseñas.                  | • Baterías de respaldo (`UPS`) y grupos electrógenos para mantener servidores vivos o apagarlos ordenadamente.<br>• Extintores aptos para salas técnicas.<br>• Uso de oficinas o servidores de contingencia (sitios fríos, tibios o calientes). |
| _Clasificación operativa de controles combinando su naturaleza con el momento en que intervienen frente a una amenaza._     |                                                                                                                                                                                                                                                                          |                                                                                                                                                                                                                                                                                          |                                                                                                                                                                                                                                                 |

> [!NOTE]
> Las técnicas de ciberengaño complementan la defensa mediante la creación de señuelos tecnológicos, como los _honeypots_, que simulan sistemas o datos vulnerables para atraer y detectar a atacantes. Dado que estos equipos o servicios falsos no tienen ninguna función operativa legítima en la red de la empresa, cualquier intento de conexión o interacción con ellos es intrínsecamente sospechoso y activa alertas inmediatas, lo que facilita la identificación temprana de amenazas y mejora la capacidad de respuesta de los equipos de seguridad antes de que el incidente alcance los activos reales.

Cuando diseñes la protección para un proceso crítico de tu empresa (por ejemplo, el sistema de facturación o la base de datos de clientes), asegúrate de no dejar ninguna fila vacía en la tabla anterior. Si inviertes todo el presupuesto en prevención pero no tienes ningún control detectivo ni de recuperación, el primer ataque novedoso que logre sortear la entrada pasará meses dentro de tu red sin que nadie lo note y destruirá activos que no sabrás cómo restaurar.

#### Cómo diseñar Controles Compensatorios para sistemas antiguos (`Legacy` / `EOL`)

En el papel es fácil decir _"actualiza todo el software de la empresa a su última versión"_. Sin embargo, en la realidad de las PyMEs es muy frecuente encontrar equipos o programas que han llegado al final de su vida útil (_End-of-Life_ o `EOL`) y ya no reciben parches de seguridad del fabricante, pero que no pueden apagarse ni actualizarse mañana porque controlan una maquinaria industrial costosa, ejecutan un sistema contable a medida antiguo o dependen de un proveedor que ya no existe.

Cuando un activo vulnerable no puede repararse directamente en su propio sistema operativo o código, la arquitectura debe rodearlo con **Controles Compensatorios**: barreras adicionales ubicadas en las capas vecinas que reduzcan drásticamente la posibilidad de que alguien llegue a explotar esa debilidad.

:::steps

### 1. Encapsular el equipo en una zona de red aislada

Como el sistema antiguo es vulnerable por naturaleza, se diseña una subred o `VLAN` exclusiva para él. En el `firewall` interno se bloquea por completo su conexión hacia y desde Internet, y se prohíbe que las computadoras normales de la oficina puedan verlo. Solo se permite el paso del puerto exacto e indispensable desde un único equipo intermediario autorizado.

### 2. Interponer un guardián de identidad moderno

Si el programa antiguo tiene contraseñas débiles y no soporta Autenticación Multifactor (MFA), no se permite que los usuarios inicien sesión directamente contra él. Se diseña el acceso a través de un escritorio intermedio seguro (conocido como servidor bastión o _jump-box_) o un proxy inverso moderno: el usuario debe autenticarse con MFA y permisos estrictos en el bastión, y recién desde allí puede operar el sistema heredado.

### 3. Multiplicar la vigilancia y la capacidad de clonación

Al tratarse de un activo frágil, se diseña una regla de alerta específica en el colector de registros: cualquier intento de conexión hacia esa dirección `IP` desde un equipo no habitual o fuera del horario de trabajo dispara un aviso inmediato al equipo técnico. Además, se mantiene una imagen completa clonada del disco de ese sistema en un respaldo aislado para poder restaurarlo íntegro en pocos minutos si llegara a fallar.

### 4. Registrar la excepción con fecha de caducidad

Ningún control compensatorio debe convertirse en una excusa para el olvido. El diseño debe ir acompañado de un documento breve de excepción firmado por el responsable del negocio donde conste por qué se mantiene encendido el equipo sin soporte, qué controles compensatorios lo rodean, qué **riesgo residual** se está aceptando y en qué fecha exacta se volverá a evaluar su reemplazo definitivo.
:::

### Confianza en la arquitectura: El cambio de mentalidad hacia `Zero Trust`

Durante décadas, las redes de las empresas se dibujaron como un castillo medieval rodeado por un foso: todo lo que estaba afuera (en Internet) se consideraba peligroso, y todo lo que lograba cruzar el puente levadizo hacia adentro (la red local `LAN` de la oficina) se consideraba amigo y digno de confianza.

Hoy sabemos que esa suposición es la causa principal por la que los incidentes pequeños se convierten en desastres totales:

- **El perímetro se desdibujó:** Los empleados trabajan desde redes domésticas, usan teléfonos móviles y guardan documentos en plataformas en la nube que no están detrás del `firewall` de la oficina.

- **El peligro ya está adentro:** Si la red interna confía ciegamente en cualquiera que esté conectado a ella, basta con que un solo trabajador caiga en un engaño de `phishing` o que alguien conecte un dispositivo infectado al Wi-Fi de la empresa para que el atacante tenga vía libre hacia todos los servidores internos.

#### Cómo aplicar principios de Confianza Cero (`Zero Trust`) en una PyME

El modelo de Arquitectura de Confianza Cero (definido formalmente en el estándar **NIST SP 800-207**) propone abandonar la idea del castillo y adoptar una premisa mucho más sana para el diseño: **"Nunca asumir confianza implícita; verificar siempre cada solicitud"**.

Llevar `Zero Trust` a la realidad de una PyME requiere diseñar las próximas secciones de este módulo bajo cuatro reglas lógicas:

1. **Estar en la red local no da derechos automáticos:** Que una conexión provenga de un cable conectado en la oficina o de una VPN válida no significa que tenga permiso para ver los servidores. La ubicación de red deja de ser sinónimo de confianza.

2. **Verificar identidad, dispositivo y contexto en cada acceso:** Antes de permitir que alguien abra una aplicación o carpeta sensible, la arquitectura debe validar quién es el usuario (MFA), si su dispositivo cumple con los requisitos mínimos de seguridad (por ejemplo, estar actualizado y cifrado) y si tiene sentido que acceda a ese recurso en ese momento.

3. **Conectar al usuario con la aplicación, no con toda la red:** Siempre que sea posible, en lugar de darle a un trabajador remoto o a un proveedor externo acceso abierto a toda la subred de servidores, el diseño debe darle acceso puntual únicamente al servicio o aplicación específica que necesita usar.

4. **Diseñar asumiendo la brecha (_Assume Breach_):** Al trazar cada parte del plano, hazte siempre esta pregunta: _"Si doy por sentado que un atacante ya tomó el control de esta computadora o de esta cuenta de usuario hoy mismo, ¿qué barrera inmediata le impide avanzar hacia el activo de al lado?"_.

### Trazabilidad arquitectónica y selección inteligente de soluciones

Un plano de arquitectura profesional tiene que poder explicarse tanto a un técnico como al dueño o director de la empresa. Cada control y cada herramienta que incorpores al diseño debe responder directamente a un riesgo detectado en el Módulo 2 y a una etapa concreta de cómo operan los atacantes en la vida real (siguiendo la lógica de tácticas de **MITRE ATT&CK**, como el Acceso Inicial, el Robo de Credenciales, el Movimiento Lateral o el Impacto final sobre los datos).

#### Construcción de la Matriz de Trazabilidad

Para no perder el hilo entre los problemas que encontraste en el Módulo 2 y las soluciones que vas a implementar en el Módulo 4, debes construir una **Matriz de Trazabilidad**. Esta herramienta documental asegura que ningún riesgo crítico quede olvidado y define de antemano cómo vas a comprobar que cada medida realmente funcione.

A continuación se presenta la estructura del registro de trazabilidad y tres fichas prácticas de ejemplo listas para adaptar a tu organización:

| Columna de la Matriz                                                                  | Qué debes documentar en ella                                                                                                                                                            |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1. ID y Escenario de Riesgo**                                                       | El identificador del riesgo priorizado en el Módulo 2 y qué táctica adversaria busca frenar (por ejemplo, `R-01: Acceso remoto expuesto` o `R-02: Propagación de Ransomware`).          |
| **2. Requisito Arquitectónico**                                                       | La regla de diseño que resuelve el problema de raíz sin hablar todavía de marcas de software (por ejemplo, _"Ningún servicio administrativo estará expuesto directamente a Internet"_). |
| **3. Capas Involucradas**                                                             | En qué anillos de la arquitectura se colocarán las barreras para asegurar que haya defensa en profundidad (por ejemplo, _Perimetral + Identidad + Endpoint_).                           |
| **4. Combinación de Controles**                                                       | El desglose concreto de qué medida **Preventiva**, qué medida **Detectiva** y qué medida **Correctiva/Recuperación** protegerán el activo.                                              |
| **5. Familia de Solución**                                                            | Qué categoría de tecnología se utilizará para materializar esos controles (por ejemplo, _*firewall* perimetral + Proveedor de MFA + Colector de registros_).                            |
| **6. Verificación Esperada**                                                          | La prueba técnica exacta que ejecutarás en el Módulo 4 (`04. PROTECT`) para demostrar con evidencia que el control quedó funcionando y no solo dibujado en el papel.                    |
| _Estructura base para construir la Matriz de Trazabilidad del diseño arquitectónico._ |                                                                                                                                                                                         |

A continuación se presentan algunas de ejemplo para consultar a la hora de redactar las fichas propias de la organización:

:::group title="Ficha de Trazabilidad R-01: Compromiso de accesos remotos o cuentas administrativas" description="Prioridad: Crítica | Tácticas ATT&CK: Initial Access / Valid Accounts"

- Problema detectado en Módulo 2 [riesgo]: Existen puertos de administración remota (`SSH` o Escritorio Remoto `RDP`) abiertos directamente hacia Internet o cuentas de administrador que utilizan solo contraseña simple.

- Requisito arquitectónico [diseño]: Prohibir la exposición directa de interfaces administrativas a redes públicas, separar las cuentas de uso diario de las cuentas de administración y exigir múltiples factores de autenticación.

- Capas que intervienen [defensa]: Capa Perimetral + Capa de Identidad (`IAM`) + Eje Transversal de Visibilidad.

- Controles Preventivos [antes]: Cerrar los puertos administrativos en el perímetro; obligar a entrar mediante un túnel VPN o proxy autenticado con MFA; asignar a los técnicos una cuenta estándar para usar el correo y otra cuenta dedicada exclusivamente para administrar servidores.

- Controles Detectivos [durante]: Enviar al colector central todos los registros de inicios de sesión exitosos y fallidos en la VPN y en las cuentas de administrador, generando una alerta ante múltiples fallos seguidos o accesos en horarios inusuales.

- Controles Correctivos [después]: Configurar el bloqueo temporal automático de la cuenta o del dispositivo tras superar un umbral de intentos fallidos y documentar el paso para revocar credenciales comprometidas de inmediato.

- Verificación para Módulo 4 [prueba]: Ejecutar un escaneo externo con `Nmap` contra la `IP` pública comprobando que los puertos administrativos figuren cerrados/filtrados, e intentar iniciar sesión sin el segundo factor MFA verificando que el acceso sea denegado.
  :::

:::group title="Ficha de Trazabilidad R-02: Infección y propagación lateral de Ransomware" description="Prioridad: Crítica | Tácticas ATT&CK: Execution / Lateral Movement / Impact"

- Problema detectado en Módulo 2 [riesgo]: La red de la empresa es plana (todas las computadoras ven a los servidores y entre sí) y las copias de seguridad se guardan en una carpeta compartida accesible desde la misma red.

- Requisito arquitectónico [diseño]: Aislar los segmentos de usuarios respecto de los servidores, impedir la comunicación directa entre estaciones de trabajo y garantizar un repositorio de respaldos aislado e inmutable.

- Capas que intervienen [defensa]: Capa de Endpoint + Capa de Red Interna + Eje Transversal de Resiliencia.

- Controles Preventivos [antes]: Dividir la red en zonas (`VLANs`) separando usuarios, invitados y servidores; activar el `firewall` local en cada computadora bloqueando conexiones entrantes entre pares; mantener antimalware actualizado y deshabilitar la ejecución automática de memorias `USB`.

- Controles Detectivos [durante]: Activar detección antimalware basada en comportamiento en los equipos y registrar en el `firewall` interno cualquier intento bloqueado de conexión desde la zona de usuarios hacia puertos administrativos de servidores.

- Controles Correctivos [después]: Capacidad de aislar de la red un equipo sospechoso y esquema de copias de seguridad automatizadas bajo la regla 3-2-1 con extracción aislada (_Pull Backup_) o bloqueo inmutable en la nube.

- Verificación para Módulo 4 [prueba]: Intentar conectarse desde una computadora de oficina hacia otra computadora compañera o hacia el servidor de respaldos y comprobar que el tráfico es rechazado; realizar un simulacro restaurando un respaldo en un entorno de prueba aislado.
  :::

:::group title="Ficha de Trazabilidad R-03: Robo o filtración de base de datos con información sensible (PII)" description="Prioridad: Alta | Tácticas ATT&CK: Initial Access / Collection / Exfiltration"

- Problema detectado en Módulo 2 [riesgo]: El servidor que aloja la aplicación web pública guarda en su mismo disco y sin cifrar la base de datos con información personal y financiera de los clientes.

- Requisito arquitectónico [diseño]: Separar la cara pública de la aplicación respecto del almacenamiento de datos sensibles y proteger la información mediante cifrado tanto en tránsito como en reposo.

- Capas que intervienen [defensa]: Capa de Red (DMZ) + Capa de Aplicación + Capa de Datos.

- Controles Preventivos [antes]: Colocar un proxy inverso o el frontal web en una Zona Desmilitarizada (DMZ) y mover la base de datos a una Zona Restringida interna que solo acepte consultas desde la DMZ; exigir conexiones `HTTPS`/`TLS` y cifrar el disco o las tablas de la base de datos con `AES`.

- Controles Detectivos [durante]: Registrar los eventos de acceso, modificación o consultas masivas sobre la base de datos y monitorear picos anómalos de tráfico saliente (posible exfiltración) fuera del horario comercial.

- Controles Correctivos [después]: Procedimiento para revocar al instante las credenciales de la cuenta de servicio que conecta la aplicación web con la base de datos y bloquear la salida del servidor en el `firewall`.

- Verificación para Módulo 4 [prueba]: Comprobar desde Internet que es imposible conectarse directamente a la dirección `IP` o puerto de la base de datos, y verificar mediante un analizador de protocolos o inspección local que los datos viajan y se almacenan cifrados.
  :::

#### Cómo elegir herramientas: Código Abierto vs. Comerciales y el Costo Total (`TCO`)

Una vez que tienes claro _qué_ familias de soluciones necesitas en tu matriz, llega el momento de pensar con qué software o equipamiento las vas a implementar. Aquí las empresas suelen debatirse entre dos extremos: _"usemos todo gratis y de código abierto para no gastar"_ o _"compremos una licencia empresarial conocida que lo resuelva todo"_.

Ambas posturas implican riesgos ocultos si no se evalúa el **Costo Total de Propiedad (`TCO`)**, es decir, cuánto cuesta realmente mantener esa solución viva y funcionando bien durante dos o tres años:

- **Soluciones de Código Abierto (_Open Source_):** Herramientas excelentes como `OPNsense` o `pfSense` (para `firewalls` y segmentación), `Wazuh` (para monitoreo de seguridad e integridad en equipos), `Keycloak` (para gestión de identidades) o servidores Linux con `nftables` no tienen costo de licencia, son auditables, transparentes y ofrecen control absoluto sin atarse a un proveedor comercial. **¿Dónde está su costo real?** En las horas de estudio, configuración y mantenimiento del equipo técnico. Si nadie en la empresa sabe mantener un servidor Linux ni tiene dos horas a la semana para revisar y ajustar las reglas de `Wazuh`, la herramienta quedará desactualizada o mal configurada en pocos meses.

- **Soluciones Comerciales y Servicios en la Nube (`SaaS`):** Plataformas pagas (como las funciones de seguridad avanzadas incluidas en `Microsoft 365` / `Entra ID`, `Google Workspace`, firewalls comerciales unificados o soluciones `EDR` gestionadas) tienen un costo mensual o anual por usuario que impacta en el presupuesto. **¿Cuál es su ventaja arquitectónica en una PyME?** Ahorran tiempo operativo crítico: el proveedor mantiene los servidores funcionando, actualiza las detecciones automáticamente y ofrece interfaces gráficas más sencillas para equipos pequeños. Su límite es la dependencia de un presupuesto para mantener la licencia activa.

> [!WARNING:Regla para seleccionar tecnologías]
> Antes de instalar una herramienta nueva (sea gratuita o paga), verifica primero qué capacidades de seguridad **ya tienes pagadas o instaladas** en tus sistemas actuales y no estás usando. Encender el `firewall` nativo que ya viene en `Windows` o Linux, activar el cifrado de disco integrado (`BitLocker`/`FileVault`) o habilitar el MFA que ya incluye tu proveedor de correo actual reduce el riesgo de inmediato, tiene costo cero de adquisición y no agrega herramientas nuevas que aprender a manejar.

### Verificación de tu arquitectura antes de avanzar

En este módulo todavía no estamos instalando programas ni escribiendo comandos; estamos validando que los planos sean sólidos antes de empezar la obra. Para comprobar que tu arquitectura de defensa en profundidad no tiene fisuras graves antes de pasar a diseñar el detalle de la red en la siguiente sección, realiza estas dos comprobaciones prácticas sobre tus documentos:

:::steps

### 1. Prueba de cobertura completa sobre tu Matriz de Trazabilidad

Toma la lista de riesgos **Críticos** y **Altos** que obtuviste al final del Módulo 2 y ponla al lado de tus fichas de trazabilidad:

- Confirma que cada uno de esos riesgos tenga asignada una ficha de diseño o, en caso de que la empresa decida no hacer nada al respecto por razones de costo, que exista un documento formal de **aceptación de riesgo** firmado por la dirección.

- Revisa que en ninguna ficha hayas dejado huérfana la detección o la recuperación: toda medida **Preventiva** debe estar acompañada siempre de una forma de **Detectar** si alguien la salta y una forma de **Recuperar** el sistema si el ataque tiene éxito.

### 2. Ejercicio de simulación de fallo ("¿Qué pasa si esta capa cae?")

Observa tu diagrama general de capas y haz el ejercicio mental de "apagar" o dar por vencida una barrera completa para descubrir **Puntos Únicos de Falla (`SPOF`, _Single Point of Failure_)**:

- _Pregunta 1 (Fallo en el Endpoint):_ Supongamos que mañana un empleado recibe un archivo malicioso nuevo que el antivirus no reconoce y lo ejecuta en su computadora. Según tu diseño, ¿qué barrera concreta en la **Capa de Red Interna** o en la **Capa de Identidad** impide que ese código malicioso salte automáticamente al servidor principal o borre las copias de seguridad?

- _Pregunta 2 (Robo de contraseña):_ Supongamos que un atacante adivina o roba la contraseña de un usuario o de un administrador. Según tu diseño, ¿qué control le impide iniciar sesión desde su casa y, si lograra entrar, cómo te enterarías en menos de una hora de lo que está haciendo?

- _Criterio de aprobación:_ Si al responder cualquiera de estas dos preguntas notas que el fallo de un solo control le entrega al atacante las llaves de toda la empresa sin que suene ninguna alarma, tu diseño todavía no tiene defensa en profundidad. Regresa a la matriz y agrega una barrera independiente en la capa siguiente antes de avanzar.
  :::

## 3.2. Segmentación de Red <!-- id: segmentacion-red, icon: NetworkIcon -->

La mayoría de las PyMEs inician sus operaciones conectando todos sus equipos al mismo router provisto por el ISP (_Internet Service Provider_) o a un único _switch_ central. A medida que la organización crece, se agregan servidores de facturación, impresoras de red, cámaras de vigilancia, teléfonos móviles de empleados y puntos de acceso inalámbrico (WAPs) para visitantes sobre ese mismo espacio compartido. El resultado es una **red plana**: una arquitectura donde todos los dispositivos residen en el mismo segmento lógico y pueden comunicarse directamente entre sí sin pasar por ningún control intermedio.

En una red plana, la seguridad de toda la empresa queda reducida a la seguridad de su dispositivo más débil. Si un atacante compromete la computadora portátil de un empleado mediante un correo de suplantación de identidad (_phishing_) o aprovecha una falla en una impresora sin soporte técnico, obtiene visibilidad inmediata sobre el servidor de bases de datos y el sistema de copias de seguridad. Esta sección desarrolla la capa de red de nuestra arquitectura de defensa en profundidad, dividiendo la infraestructura en **zonas de confianza aisladas** y diseñando las reglas de negocio que limitarán el radio de impacto ante cualquier intrusión.

### Fundamentos de segmentación y flujos de tráfico

Para diseñar una topología de red segura sin adquirir equipamiento innecesario, primero es fundamental distinguir los conceptos físicos, lógicos y arquitectónicos que permiten separar grupos de dispositivos dentro de una organización.

:::group title="Conceptos estructurales de segmentación"

- Topología física [hardware]: Es la disposición real de cables, WAPs, _switches_ y _routers_ que transportan las señales eléctricas o de radio en la Capa 1 y 2 del modelo de OSI.
- Subred IP (Subnetting y CIDR) [lógico - Capa 3]: Es la subdivisión matemática de una red mediante direcciones del Protocolo de Internet (`IP`) y máscaras de red utilizando el `CIDR`, _Classless Inter-Domain Routing_, como `192.168.10.0/24`. Los dispositivos en distintas subredes no pueden hablar directamente entre sí a través de un _switch_ básico; requieren que un enrutador o _firewall_ intermedio encamine el tráfico.
- Red de Área Local Virtual (VLAN) [lógico - Capa 2]: Es una tecnología definida en el estándar `IEEE 802.1Q` que permite a un único _switch_ físico comportarse como si fueran múltiples _switches_ independientes. Al etiquetar las tramas de datos con un identificador numérico (`VLAN ID`), dos computadoras conectadas al mismo equipo físico quedan aisladas en dominios de difusión (_broadcast_) separados.
- Zona de seguridad [arquitectura]: Es una agrupación lógica de uno o más segmentos de red o activos que comparten un mismo nivel de sensibilidad de datos, exposición al riesgo y políticas de control de acceso.
- Límite de confianza (Trust Boundary) [frontera]: Es el punto exacto de la arquitectura donde el tráfico cruza desde una zona con un nivel de confianza determinado hacia otra con un nivel distinto (por ejemplo, desde la red de oficinas hacia el segmento de servidores). Todo límite de confianza exige un punto de inspección y filtrado obligatorio.
  :::

### Identificadores de VLAN (`VLAN ID`) y Buenas Prácticas

En la Capa 2 de la red, el estándar `IEEE 802.1Q` utiliza etiquetas numéricas llamadas **`VLAN ID`** (del 1 al 4094) para dividir un mismo _switch_ físico en redes lógicas totalmente independientes. Cada etiqueta aísla el tráfico en su propio dominio, impidiendo que los equipos de un segmento se comuniquen con otros sin la intervención de un _router_ o _firewall_.

Los números de VLAN no tienen un significado obligatorio por defecto, pero las empresas adoptan esquemas ordenados (por decenas o centenas) que permiten asociar intuitivamente el número de la VLAN con el de su subred (por ejemplo, asignar la `VLAN 10` a la subred `10.10.10.0`). Suele considerarse buena práctica dividirlas de esta forma y en manuales o documentación técnica pueden mencionarse directamente.

- **Prohibido usar la `VLAN 1` (Predeterminada):** Es la red que viene configurada de fábrica en todos los _switches_. Por seguridad, **nunca debe usarse para tráfico operativo o sensible**, ya que dejar los puertos activos allí expone a la red a ataques de salto de VLAN (_VLAN Hopping_).
- **Estructura recomendada por rangos:**
  - **`VLAN 10`:** Zona Desmilitarizada (DMZ) y servicios públicos o servidores principales.
  - **`VLAN 20`:** Áreas sensibles que manejan datos financieros o confidenciales (PII).
  - **`VLAN 30` / `VLAN 40`:** Estaciones de trabajo para empleados y usuarios generales.
  - **`VLAN 50` a `VLAN 99`:** Redes de invitados, Wi-Fi pública, dispositivos `IoT` y gestión de infraestructura.

#### Notación `CIDR` aplicada al dimensionamiento en PyMEs

Al diseñar las subredes que alojarán cada zona de seguridad, el uso de `CIDR` permite ajustar el tamaño del segmento a la cantidad real de dispositivos que necesita la empresa, evitando desperdiciar direcciones y facilitando la lectura de las reglas del _firewall_. El número que sigue a la barra diagonal (`/`) indica cuántos de los 32 bits de una dirección `IPv4` están fijos para identificar a la red, dejando los bits restantes para asignar a los dispositivos (_hosts_):

| Prefijo CIDR                                                                                                 | Máscara de subred decimal | Direcciones totales | Hosts utilizables _(menos red y broadcast)_ | Uso recomendado en PyMEs                                                                                                                   |
| :----------------------------------------------------------------------------------------------------------- | :------------------------ | :------------------ | :------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------- |
| `/24`                                                                                                        | `255.255.255.0`           | 256                 | 254                                         | Red principal de estaciones de trabajo de usuarios o red general de invitados en empresas medianas.                                        |
| `/26`                                                                                                        | `255.255.255.192`         | 64                  | 62                                          | Departamentos específicos (ej. Finanzas o Desarrollo) o segmento para dispositivos de Internet de las Cosas (`IoT`), cámaras e impresoras. |
| `/28`                                                                                                        | `255.255.255.240`         | 16                  | 14                                          | Zonas altamente acotadas, como una Zona Desmilitarizada (DMZ), el segmento de servidores críticos o la red exclusiva de administración.    |
| `/30`                                                                                                        | `255.255.255.252`         | 4                   | 2                                           | Enlaces punto a punto directos entre dos enrutadores o entre el _firewall_ perimetral y un _firewall_ interno.                             |
| _Dimensionamiento práctico de subredes privadas IPv4 (RFC 1918) para la segmentación de zonas corporativas._ |

#### Tráfico Norte-Sur frente a Tráfico Este-Oeste

Para comprender por qué un único _firewall_ en la puerta de enlace a Internet resulta insuficiente, la arquitectura de redes distingue dos direcciones de flujo de datos dentro de la infraestructura:

1.  **Tráfico Norte-Sur (Perimetral):** Describe el flujo de paquetes que entra a la organización desde redes externas no controladas (como Internet) o que sale desde la red interna hacia el exterior. Este tráfico atraviesa el enrutador o _firewall_ perimetral mediante Traducción de Direcciones de Red (`NAT`, _Network Address Translation_), el cual convierte las direcciones `IP` privadas internas en la dirección `IP` pública de la empresa.
2.  **Tráfico Este-Oeste (Lateral o Interno):** Describe las comunicaciones que ocurren horizontalmente entre dispositivos dentro de la propia infraestructura local o en la nube (por ejemplo, una computadora de recepción comunicándose con la computadora de contabilidad, o un servidor web consultando un servidor de archivos interno).

> [!CRITICAL:El punto ciego del movimiento lateral]
> En una red plana (`192.168.1.0/24`), el tráfico **Este-Oeste** viaja directamente a través del _switch_ en la Capa 2 usando direcciones físicas de Control de Acceso al Medio (`MAC`), sin pasar jamás por el _firewall_ perimetral. Cuando un atacante logra el acceso inicial en un equipo, utiliza tácticas de **Movimiento Lateral** y el uso de **Servicios Remotos** —como el Bloque de Mensajes del Servidor (`SMB`, puerto `445`), el Protocolo de Escritorio Remoto (`RDP`, puerto `3389`) o el Shell Seguro (`SSH`, puerto `22`)— para saltar de máquina en máquina con total invisibilidad. La segmentación de red obliga a que el tráfico Este-Oeste entre distintas áreas deba cruzar un _firewall_ interno, convirtiendo un movimiento silencioso en un evento bloqueado y registrado.

### Criterios para definir Zonas de Seguridad en una PyME

Segmentar no significa crear una subred distinta para cada empleado, lo cual generaría una carga administrativa inmanejable en el día a día. Siguiendo la Salvaguarda `CIS 3.12` y la categoría `PR.IR-01` del **NIST CSF 2.0**, el diseño de zonas debe agrupar los activos según tres criterios objetivos: la **sensibilidad de los datos** que procesan (basada en la clasificación del Módulo 2), la **criticidad operativa** del servicio y el **nivel de exposición** o desconfianza del entorno.

```filetree:Topologia_Zonas_de_Confianza
Arquitectura_de_Red_Segmentada/
├── Zona_00_No_Controlada/               # Internet público, redes domésticas y enlaces ISP (Confianza Nula)
└── Zona_Controlada_Corporativa/         # Protegida tras el Firewall / Enrutador principal
    ├── VLAN_10_DMZ_Servicios_Publicos/  # (10.10.10.0/28) Reverse Proxy, Servidor Web público
    ├── VLAN_20_LAN_Usuarios_General/    # (10.10.20.0/24) Estaciones de trabajo estándar (Ventas, Operaciones)
    ├── VLAN_25_LAN_Finanzas_RRHH/       # (10.10.25.0/26) Equipos que procesan PII sensible y pagos
    ├── VLAN_30_Restringida_Core_Datos/  # (10.10.30.0/28) Bases de datos, ERP interno, Servidor de archivos
    ├── VLAN_40_Resiliencia_y_Logs/      # (10.10.40.0/28) Repositorio de Backups aislados y Colector SIEM/Syslog
    ├── VLAN_50_Administracion_IT/       # (10.10.50.0/28) Jump-box e interfaces de gestión de infraestructura
    ├── VLAN_60_No_Produccion_DevTest/   # (10.10.60.0/26) Entornos de desarrollo, pruebas y staging
    ├── VLAN_80_IoT_y_ Dispositivos_No_IT/# (10.10.80.0/26) Impresoras, cámaras CCTV, sensores, Smart TVs
    └── VLAN_99_Invitados_y_BYOD/        # (10.10.99.0/24) Wi-Fi de visitantes y móviles personales (Solo Internet)
```

#### 1. Zona No Controlada (Externa)

Comprende cualquier red fuera de la administración y gobernanza directa de la empresa, siendo Internet el ejemplo principal. En el diseño arquitectónico, la zona no controlada se asume permanentemente hostil: ningún paquete que provenga de ella debe ingresar a las redes internas sin haber sido solicitado previamente o sin atravesar un filtro estricto de inspección en una zona intermedia.

#### 2. Zona Desmilitarizada (DMZ)

Cuando una empresa necesita publicar servicios propios hacia Internet —como un sitio web institucional autoalojado, una tienda de comercio electrónico, una pasarela de aplicaciones (`API`) o un servidor de correo—, colocar ese servidor dentro de la red local de la oficina equivale a abrir una puerta directa desde el exterior hacia las estaciones de trabajo.

La **Zona Desmilitarizada (DMZ)** actúa como un área de amortiguación o "escudo" perimetral ubicada entre la Zona No Controlada (Internet) y la red interna. Si un atacante externo logra explotar una vulnerabilidad en el servidor web alojado en la DMZ, queda contenido dentro de esa subred aislada: las reglas del _firewall_ le impiden iniciar conexiones hacia la red de empleados o hacia el resto de la empresa.

#### 3. Zona de Usuarios (`LAN` Corporativa)

Aloja las computadoras de escritorio y portátiles administradas por la empresa que el personal utiliza para sus funciones diarias. En una empresa pequeña, puede comenzar como una única zona de usuarios bien separada de los servidores y de los invitados. En organizaciones de mayor tamaño o en transición hacia `CIS IG2`, resulta recomendable subdividir esta zona separando a los departamentos que manejan datos altamente sensibles —como Finanzas, Contabilidad y Recursos Humanos— del resto de las áreas operativas o comerciales (`CIS 3.12`).

#### 4. Zona de Invitados y Dispositivos Personales (`BYOD`)

Los clientes que visitan la oficina, los proveedores externos temporales y los teléfonos inteligentes personales de los propios empleados (_Bring Your Own Device_ o `BYOD`) son activos no gestionados de los cuales la empresa desconoce su estado de parches o si portan software malicioso. El diseño debe asignarles una red inalámbrica (`SSID`, nombre asignado a una red Wi-Fi para identificarla y distinguirla de otras al buscar conexión desde algún dispositivo) asociada a una `VLAN` completamente independiente. Esta zona solo tiene permiso para salir hacia Internet (puertos web `80` y `443` y consultas DNS públicas) y tiene bloqueada por completo cualquier ruta hacia las direcciones `IP` privadas de la organización.

#### 5. Zona de Dispositivos `IoT` y Equipamiento No Computacional

Las impresoras multifunción en red, cámaras de seguridad (`CCTV`), relojes de control de asistencia biométrico, televisores inteligentes y sensores industriales suelen ejecutar sistemas operativos embebidos o _firmware_ que rara vez se actualizan, contienen contraseñas predeterminadas y no admiten la instalación de agentes antivirus. Ubicarlos en una zona aislada garantiza que, si una cámara o impresora es vulnerada, el atacante no pueda usarla como plataforma de salto (_pivoting_) ni capturar tráfico de las computadoras de los empleados.

#### 6. Zona Restringida (Servidores Críticos y Datos)

Representa el núcleo de alta seguridad de la red corporativa. Aquí residen los servidores de bases de datos relacionales, los sistemas de planificación de recursos empresariales (`ERP`), los repositorios de archivos confidenciales y la propiedad intelectual. Por diseño, esta zona **jamás debe ser accesible directamente desde Internet**, y tampoco debe permitir conexiones libres desde la Zona de Usuarios: las estaciones de trabajo solo pueden interactuar con la Zona Restringida a través de las aplicaciones e interfaces específicas autorizadas para su rol.

#### 7. Zona de Resiliencia y Telemetría (Backups y Registros)

Para materializar la protección transversal diseñada en la sección `03.1`, los servidores que almacenan las copias de seguridad y el servidor central que recolecta los registros (_logs_) de auditoría deben ubicarse en un segmento separado incluso de la Zona Restringida de producción. De este modo, si un atacante toma el control total del servidor principal de producción, las barreras de red le impedirán conectarse por consola administrativa al servidor de respaldos para formatear los discos de recuperación.

#### 8. Zona de Administración (`Out-of-Band` / Gestión de TI)

Las interfaces de administración de los propios equipos de red (paneles web o consolas `SSH` de enrutadores, _switches_, _firewalls_, hipervisores de máquinas virtuales y controladores de dominio) no deben estar expuestas en la misma red por la que navegan los usuarios finales. Siguiendo el **Control CIS 12 (Salvaguarda 12.8)**, el diseño ideal separa lógica o físicamente una subred administrativa a la que solo pueden conectarse las estaciones dedicadas del personal de soporte técnico o a través de un servidor bastión (_jump-box_) fuertemente autenticado.

#### 9. Zona de No-Producción (Desarrollo y Pruebas)

En las empresas tecnológicas o empresas que desarrollan y mantienen software propio, ejecutar pruebas o compilar código nuevo en la misma red donde operan las bases de datos reales es un riesgo crítico. Conforme a la **Salvaguarda CIS 16.8**, los entornos de desarrollo, pruebas (_testing_) y preproducción (_staging_) deben residir en un segmento de red separado de los sistemas de producción, prohibiendo además el uso de datos sensibles reales de clientes dentro de las bases de datos de prueba.

> [!TIP:Progresión realista de zonas según la madurez de la PyME]
> No todas las organizaciones necesitan implementar las nueve zonas desde el primer día. Las salvaguardas formales de arquitectura segmentada (`CIS 12.2`, `3.12`, `16.8`) corresponden al nivel **`IG2`**, mientras que la red administrativa dedicada sin salida a Internet (`CIS 12.8`) pertenece a **`IG3`**.
>
> - **Diseño Mínimo Viable (`IG1` — Oficina pequeña):** Crear al menos **3 zonas**: Red Interna de Trabajo, Red de Servidores/NAS y Red Wi-Fi de Invitados/IoT aislada.
>
> - **Diseño Estándar Recomendado (`IG2` — PyME estructurada):** Separar en **5 a 7 zonas**: DMZ (si hay servicios públicos), `LAN` Usuarios, `LAN` Administración/Finanzas, Zona Restringida (Servidores/Datos), Zona de Backups/Logs, Zona de No-Producción (si aplica) y Zona de Invitados/IoT.

### Mecanismos arquitectónicos de aislamiento y control de tráfico

Definir zonas en un papel o crear subredes en un conmutador no proporciona seguridad si un enrutador conecta automáticamente todas las redes entre sí sin restricciones. Para transformar una subred en una verdadera **Zona de Confianza**, la arquitectura debe interponer mecanismos técnicos de filtrado en cada frontera.

#### 1. Cortafuegos (`Firewalls`) y Listas de Control de Acceso (`ACL`)

El _firewall_ es el componente central encargado de inspeccionar el tráfico que intenta cruzar de una zona a otra y decidir si lo autoriza o lo descarta según reglas predefinidas. Al diseñar qué tipo de filtrado se colocará en cada límite de confianza, es indispensable distinguir la capacidad técnica de cada mecanismo:

- **Filtrado sin estado (_Stateless_ / `ACL` de capa 3 y 4):** Evalúa cada paquete de datos de manera aislada, mirando únicamente su encabezado (dirección `IP` de origen, `IP` de destino, protocolo TCP/UDP y número de puerto) sin recordar si ese paquete forma parte de una conversación previa. Suele utilizarse en Listas de Control de Acceso (`ACL`) dentro de _switches_ o enrutadores internos por su alta velocidad de procesamiento, pero requiere configurar reglas explícitas tanto de ida como de vuelta.

- **Firewall con estado (_Stateful Firewall_):** Mantiene en memoria una tabla de estado de las sesiones activas (por ejemplo, el saludo de tres vías `SYN`, `SYN/ACK`, `ACK` del protocolo TCP). Si un equipo de una zona interna tiene permiso para iniciar una consulta hacia otra zona, el _firewall_ _stateful_ permite automáticamente los paquetes de respuesta legítimos que regresan por esa misma sesión, bloqueando cualquier paquete externo que intente entrar sin haber sido solicitado.

- **Firewall de Última Generación (`NGFW`, _Next-Generation Firewall_):** Además de realizar seguimiento de estado de sesiones, opera hasta la Capa 7 (Aplicación) mediante la **Inspección Profunda de Paquetes (`DPI`, _Deep Packet Inspection_)**. Esto le permite examinar la carga útil (_payload_) del paquete para identificar qué aplicación real está viajando por el puerto (por ejemplo, detectar si un atacante está ocultando un canal de Comando y Control `C2` o tráfico de transferencia de archivos no autorizado dentro del puerto `443 HTTPS`) y permite integrar motores de Prevención de Intrusiones (`IPS`) y listas de inteligencia de amenazas.

> [!NOTE:El principio de Denegación por Defecto (Default Deny)]
> Toda frontera entre zonas de confianza debe diseñarse bajo una política de **denegación implícita o explícita por defecto** (`CIS 4.5`). Esto significa que la última regla al final de la tabla de cualquier _firewall_ debe ser `DROP ALL` / `DENY ANY ANY` (bloquear todo tráfico de cualquier origen a cualquier destino y registrarlo en el `log`). Sobre esa base cerrada, el arquitecto abre únicamente los puertos y direcciones exactos justificados por una necesidad operativa documentada.

#### 2. Servidores Intermediarios (Forward y Reverse Proxy)

En los límites de confianza donde interactúan aplicaciones críticas o tráfico hacia Internet, el diseño se fortalece evitando que el cliente y el servidor establezcan una conexión directa de red, interponiendo en su lugar un servidor **Proxy**:

- **Proxy Directo (`Forward Proxy` — Control de Salida):** Se ubica entre la Zona de Usuarios y la Zona No Controlada (Internet). Cuando una estación de trabajo solicita visitar una página web, la petición va dirigida al proxy; este evalúa las políticas de filtrado de `URL`, verifica que el destino no esté catalogado como distribuidor de malware y realiza la conexión en nombre del usuario, ocultando las direcciones internas y bloqueando canales de exfiltración de datos.

- **Proxy Inverso (`Reverse Proxy` — Protección de Entrada en la DMZ):** Es el patrón arquitectónico estándar para publicar aplicaciones web o `APIs` de la empresa sin exponer los servidores internos. El proxy inverso se coloca en la **DMZ** y es el único que recibe las conexiones desde Internet en el puerto `443 HTTPS`. Allí termina la conexión cifrada, inspecciona la petición en busca de ataques web (pudiendo actuar como un _firewall_ de Aplicaciones Web) y, solo si la solicitud es válida, abre una nueva conexión interna controlada hacia el servidor de aplicaciones o base de datos ubicado en la Zona Restringida. De esta manera, un atacante en Internet jamás interactúa directamente con el servidor donde residen los datos.

#### 3. Defensa de última milla: Firewalls de Host, Microsegmentación y Nube

La segmentación mediante VLANs y firewalls de red protege el tráfico que cruza de una zona a otra, pero ¿qué impide que una computadora infectada en la `VLAN 20` (Usuarios) ataque a la computadora del escritorio de al lado que también está en la `VLAN 20`?

Para cerrar esa brecha dentro de una misma subred, el diseño incorpora tres controles de grano fino:

1. **_Firewall_ basados en Host:** Cada servidor y cada estación de trabajo individual (Windows, macOS o Linux) debe mantener activo su propio firewall de software local. En las estaciones de trabajo de usuarios, el diseño es taxativo: se bloquean **todas las conexiones entrantes** desde otros pares de la misma subred, permitiendo únicamente las respuestas al tráfico que la propia estación inició y, de ser necesario, la conexión administrativa proveniente exclusivamente de la `VLAN` de Administración.

2. **Aislamiento de clientes inalámbricos (_Client Isolation_) y de puertos:** En zonas como la red Wi-Fi de Invitados (`VLAN 99`), el punto de acceso inalámbrico se diseña con la función de aislamiento de clientes activada, la cual impide a nivel de Capa 2 que dos teléfonos conectados al mismo Wi-Fi puedan verse o enviarse paquetes entre sí.

3. **Grupos de Seguridad en la Nube (`Security Groups`) y Microsegmentación:** Cuando la organización aloja servidores en proveedores de Infraestructura como Servicio (`IaaS`), la segmentación tradicional se complementa con Grupos de Seguridad virtuales que envuelven a cada instancia o contenedor de forma individual, aplicando reglas de entrada y salida independientes de la subred en la que se encuentren.

### Diseño de la Matriz de Flujos Autorizados

Antes de escribir un solo comando de configuración en el Módulo 4, toda la lógica de segmentación debe volcarse en una **Matriz de Flujos de Red Autorizados** (requisito central de la subcategoría `ID.AM-03` del **NIST CSF 2.0** y la Salvaguarda `CIS 3.8`). Este documento traduce las necesidades operativas de la empresa en especificaciones exactas de origen, destino, puerto y protocolo.

#### Flujos de soporte vitales que todo diseño debe contemplar

Un error común al diseñar una matriz bajo el principio de denegación por defecto es olvidar los protocolos de infraestructura de los que dependen los sistemas para funcionar y ser monitoreados. Si no se diseñan explícitamente, al aplicar las reglas se caerá la red o se perderá la visibilidad de seguridad:

- **Resolución de nombres (DNS — Puerto `UDP/TCP 53`):** En lugar de permitir que cualquier equipo consulte servidores DNS arbitrarios en Internet (técnica usada por el malware para evadir controles), las zonas internas deben tener permitido consultar únicamente al servidor DNS interno o al servicio de filtrado DNS corporativo, bloqueando el puerto `53` directo hacia el exterior.

- **Asignación dinámica de direcciones (DHCP — Puertos `UDP 67/68`):** Necesario en las zonas de usuarios e invitados para que los equipos obtengan su configuración `IP` automáticamente y sus concesiones queden registradas para el inventario. En la Zona Restringida y en la DMZ, por el contrario, el diseño exige direccionamiento `IP` estático.

- **Sincronización de tiempo (NTP — Puerto `UDP 123`):** Todos los segmentos controlados deben poder consultar las fuentes de tiempo autorizadas (idealmente el propio cortafuegos local actuando como servidor NTP interno) para mantener la coherencia de las marcas de tiempo en las auditorías.

- **Envío de registros de auditoría (`Syslog` / Agentes SIEM):** Los datos deben poder viajar en una sola dirección: desde los equipos hacia el recolector de datos, y nunca al revés.

- **Extracción de copias de seguridad (Pull Backup):** El flujo debe diseñarse iniciándose desde la Zona de Resiliencia (servidor de backups) hacia la Zona Restringida (servidores de producción), bloqueando cualquier intento de conexión que nazca desde producción hacia el servidor de respaldos.

#### Ejemplo de Matriz de Flujos de Red Autorizados (Plantilla aplicable)

Las reglas de un cortafuegos funcionan como un filtro que evalúa cada paquete de datos que intenta cruzar los límites de la red. El dispositivo compara parámetros clave del encabezado, como la dirección IP de origen, de destino y el puerto solicitado, contra una lista predefinida de políticas. Si el tráfico coincide con una regla, se aplica la acción correspondiente (permitir o bloquear el paso); si el paquete no coincide con ninguna política explícita de la lista, el cortafuegos lo descarta automáticamente respaldándose en el principio de denegación por defecto.

La siguiente matriz ilustra cómo estructurar las reglas de comunicación para el diagrama de red:

| ID Flujo                                                                                                              | Zona Origen                | Activo / Subred Origen                  | Zona Destino               | Activo / Subred Destino                          | Protocolo y Puerto                   | Acción               | Justificación Operativa y de Seguridad                                                                   |
| --------------------------------------------------------------------------------------------------------------------- | -------------------------- | --------------------------------------- | -------------------------- | ------------------------------------------------ | ------------------------------------ | -------------------- | -------------------------------------------------------------------------------------------------------- |
| **F-01**                                                                                                              | No Controlada _(Internet)_ | `ANY` (`0.0.0.0/0`)                     | `VLAN 10` _(DMZ)_          | Proxy Inverso (`10.10.10.10`)                    | `TCP 443` (`HTTPS`)                  | **PERMITIR**         | Acceso público de clientes al portal web corporativo cifrado con `TLS`.                                  |
| **F-02**                                                                                                              | `VLAN 10` _(DMZ)_          | Proxy Inverso (`10.10.10.10`)           | `VLAN 30` _(Restringida)_  | Servidor App/BD (`10.10.30.20`)                  | `TCP 5432` (`PostgreSQL`)            | **PERMITIR**         | Consulta desde el servicio web hacia la base de datos únicamente desde la `IP` del proxy.                |
| **F-03**                                                                                                              | `VLAN 10` _(DMZ)_          | Toda la DMZ (`10.10.10.0/28`)           | `VLAN 20/25/30/40/50`      | Todas las zonas internas                         | `ANY`                                | **BLOQUEAR** _(Log)_ | Contención crítica: si la DMZ es vulnerada, no puede iniciar tráfico hacia la red interna.               |
| **F-04**                                                                                                              | `VLAN 20/25` _(Usuarios)_  | Estaciones (`10.10.20.0/24`, `25.0/26`) | `VLAN 30` _(Restringida)_  | Servidor ERP Interno (`10.10.30.15`)             | `TCP 443` (`HTTPS`)                  | **PERMITIR**         | Uso de la aplicación de gestión interna por parte de empleados autenticados.                             |
| **F-05**                                                                                                              | `VLAN 20/25` _(Usuarios)_  | Estaciones de usuarios                  | `VLAN 30` _(Restringida)_  | Todos los servidores (`10.10.30.0/28`)           | `TCP 22` (`SSH`), `TCP 3389` (`RDP`) | **BLOQUEAR** _(Log)_ | Mitigación de movimiento lateral (`T1021`): los usuarios normales no administran servidores por consola. |
| **F-06**                                                                                                              | `VLAN 50` _(Admin IT)_     | Bastión / Admin (`10.10.50.5`)          | `VLAN 10/30/40`            | Servidores e infraestructura                     | `TCP 22` (`SSH`), `TCP 443`          | **PERMITIR**         | Gestión centralizada y segura desde recursos dedicados de administración (`CIS 4.6`, `12.8`).            |
| **F-07**                                                                                                              | `VLAN 40` _(Resiliencia)_  | Servidor Backup (`10.10.40.10`)         | `VLAN 30` _(Restringida)_  | Servidores Críticos (`10.10.30.0/28`)            | `TCP 22` (`SFTP` / `Rsync`)          | **PERMITIR**         | Extracción programada de respaldos (_Pull Backup_) iniciada desde la zona aislada (`CIS 11.4`).          |
| **F-08**                                                                                                              | `VLAN 30` _(Restringida)_  | Servidores Críticos (`10.10.30.0/28`)   | `VLAN 40` _(Resiliencia)_  | Servidor Backup (`10.10.40.10`)                  | `ANY` _(Nuevas sesiones)_            | **BLOQUEAR** _(Log)_ | Protección contra ransomware: un servidor de producción comprometido no puede conectarse al backup.      |
| **F-09**                                                                                                              | `VLAN 10/20/25/30`         | Todos los activos gestionados           | `VLAN 40` _(Resiliencia)_  | Colector SIEM/Syslog (`10.10.40.20`)             | `TCP 6514` (`Syslog-TLS`)            | **PERMITIR**         | Envío unidireccional de registros de auditoría hacia el repositorio central (`CIS 8.9`).                 |
| **F-10**                                                                                                              | `VLAN 99` _(Invitados)_    | Red Wi-Fi Invitados (`10.10.99.0/24`)   | Todas las `VLANs` internas | Rangos privados (`10.0.0.0/8`, `192.168.0.0/16`) | `ANY`                                | **BLOQUEAR**         | Aislamiento total de visitantes y equipos personales respecto a los activos de la empresa.               |
| **F-99**                                                                                                              | Cualquier Zona             | `ANY`                                   | Cualquier Zona             | `ANY`                                            | `ANY`                                | **BLOQUEAR** _(Log)_ | Regla de cierre obligatoria: **Denegación por Defecto** (_Default Deny_) para todo tráfico no listado.   |
| _Matriz de diseño de flujos autorizados aplicando mínimo privilegio de red y protección unidireccional de respaldos._ |                            |                                         |                            |                                                  |                                      |                      |                                                                                                          |

> [!WARNING:Gestión de excepciones en la matriz de flujos]
> En ocasiones, un proveedor externo o un software específico exigirá abrir un puerto adicional de forma temporal (por ejemplo, para una migración de datos). Toda excepción en la matriz debe documentarse con un propietario responsable y una **fecha de caducidad automática**, dado que las excepciones temporales olvidadas en las reglas del cortafuegos pueden sere una vía de intrusión explotada por atacantes.

### Cómo hacer un diagrama de red paso a paso

Un diagrama de arquitectura de red tiene como objetivo principal otorgar visibilidad sobre dónde residen los activos y qué barreras lógicas los separan. Utilizando herramientas gratuitas como [Draw.io](draw.io), Excalidraw o Penpot, puedes desarrollar la topología de tu empresa visualmente antes de configurar cualquier equipo.

<Diagrama title="Ejemplo de Diagrama de Red" />

:::steps

### 1. Establecer el perímetro y el núcleo

Empieza dibujando la nube de Internet (Zona No Controlada) en la parte superior del lienzo y los activos más críticos (como la Zona Restringida y los respaldos) en la parte inferior. El objetivo visual del diseño será interponer barreras de seguridad claras entre ambos extremos.

### 2. Ubicar los controles de frontera

Dibuja el enrutador o cortafuegos (firewall) principal inmediatamente debajo de Internet. Todo el tráfico que entra o sale de la organización, así como el tráfico que cruza entre zonas internas, debe conectarse obligatoriamente a este dispositivo para ser inspeccionado.

### 3. Agrupar los activos en Zonas de Confianza

Toma el inventario de dispositivos del Módulo 2 y agrúpalos en bloques o "cajas" lógicas. Dibuja una caja para la DMZ (si tienes servidores públicos), otra para la Zona de Usuarios y otra para la Zona de Invitados o `IoT`. Conecta cada una de estas cajas al cortafuegos central, representando que están aisladas entre sí.

### 4. Etiquetar direccionamiento y flujos

Añade el rango de red a cada caja utilizando la notación `CIDR` (por ejemplo, `10.10.20.0/24` para la red de usuarios y `10.10.30.0/28` para los servidores críticos). Finalmente, traza flechas unidireccionales para indicar qué zona tiene permiso para iniciar una conexión hacia otra, reflejando visualmente las reglas documentadas en tu Matriz de Flujos Autorizados.
:::

> [!TIP:Menos es más]
> No dibujes cada computadora, teléfono o impresora individual de la oficina. Representa los departamentos o redes como un solo bloque conceptual (por ejemplo: "LAN Usuarios - 40 equipos"). Mantén el diagrama limpio y enfocado exclusivamente en los límites de confianza, las subredes y los puntos de filtrado.

### Verificación del diseño de segmentación

Un diagrama de red bien dibujado no garantiza que el aislamiento sea real. Antes de avanzar al diseño de identidades, pon a prueba tu diagrama topológico y tu Matriz de Flujos con estas dos verificaciones prácticas:

:::steps

### 1. Prueba de enrutamiento sobre el papel (Tabletop Routing Test)

Toma tu diagrama de zonas y simula mentalmente (o dibujando con un lápiz) el recorrido de un ataque en tres situaciones críticas:

- **Ataque desde Internet hacia los datos:** Traza todas las flechas posibles que entren desde la Zona No Controlada. Verifica que **ninguna línea** llegue directamente a la Zona Restringida (`VLAN 30`) ni a la Zona de Resiliencia (`VLAN 40`). El único camino válido para una conexión externa debe terminar obligatoriamente en el Proxy Inverso dentro de la `DMZ` (`VLAN 10`).
- **Infección interna hacia los respaldos:** Imagina que una estación de la Zona de Usuarios (`VLAN 20`) se infecta con ransomware. Revisa tu Matriz de Flujos: no debe existir ninguna regla configurada en **PERMITIR** que deje a la `VLAN 20` o `VLAN 30` alcanzar los puertos de almacenamiento o administración del Servidor de Backups (`VLAN 40`).
- **Validación matemática de subredes (`CIDR`):** Confirma que ningún rango de direcciones IP se pise con otro. Si usas una terminal Linux, la herramienta `ipcalc` te ayuda a comprobar dónde empieza y termina cada bloque exactamente:

```bash:terminal
ipcalc 10.10.30.0/28

```

_Resultado esperado:_ La herramienta te confirmará que el bloque va desde `HostMin: 10.10.30.1` hasta `HostMax: 10.10.30.14` (14 equipos disponibles para la Zona Restringida), demostrando que es correcto y no invade la `VLAN 40` (`10.10.40.0/28`).

### 2. Definir las pruebas de aceptación para la fase de implementación

No esperes a configurar los equipos para pensar cómo probarlos. Documenta al pie de tu Matriz de Flujos una lista de Casos de Prueba Positivos y Negativos que ejecutarás en el Módulo `04. PROTECT` para demostrar que tu diseño funciona en la realidad:

- **Caso Positivo (El negocio funciona):** Desde una computadora en la `VLAN 20`, abrir el navegador e ir a `https://10.10.30.15:443` (Servidor ERP). _Resultado exigido:_ La pantalla de inicio de sesión carga correctamente (esto confirma que el flujo `F-04` está bien diseñado).
- **Caso Negativo (Bloqueo de movimiento lateral administrativo):** Desde esa misma computadora en la `VLAN 20`, abrir la terminal e intentar conectarse por SSH (`ssh admin@10.10.30.15`) o por Escritorio Remoto (RDP). _Resultado exigido:_ La conexión es rechazada o se agota el tiempo de espera (`Connection timed out`), y el sistema central genera una alerta de bloqueo (esto confirma que el flujo `F-05` nos protege frente a un atacante en la red).
- **Caso Negativo (Aislamiento de invitados):** Conectarse a la red Wi-Fi de Invitados (`VLAN 99`) e intentar escanear la red interna con `nmap -sn 10.10.20.0/24` o hacer `ping 10.10.30.15`. _Resultado exigido:_ El escaneo muestra `0 hosts up` o `100% packet loss` hacia adentro, pero permite navegar por sitios web públicos en Internet (esto confirma que el flujo `F-10` aísla a los visitantes con éxito).
  :::

## 3.3. Modelos de Identidad y Control de Acceso (IAM) <!-- id: modelos-identidad-iam, icon: LockKeyIcon -->

Para un atacante moderno, tanto externo como interno, resulta significativamente más sencillo obtener acceso a los activos de una empresa utilizando credenciales válidas de un usuario que desarrollando un ataque técnico complejo para vulnerar el perímetro de la red. En la operativa diaria de una pequeña o mediana empresa, las cuentas suelen crearse a medida que surgen urgencias operativas: se comparten contraseñas entre compañeros de un mismo sector, los empleados cambian de puesto conservando los permisos de sus funciones anteriores, y las cuentas de antiguos contratistas permanecen activas meses después de haber finalizado su labor.

Cuando una organización carece de una arquitectura de identidades definida, la segmentación de red pierde gran parte de su efectividad, ya que un adversario puede simplemente iniciar sesión por la puerta principal empleando una identidad legítima comprometida. Esta sección desarrolla el diseño de la Gestión de Identidades y Accesos (IAM, por sus siglas en inglés: _Identity and Access Management_), unificando los procesos y tecnologías necesarios para administrar las identidades digitales y regular qué recursos puede utilizar cada entidad dentro del entorno corporativo. El propósito arquitectónico es erradicar la asignación improvisada de permisos detectada en el Módulo 2 y sustituirla por un modelo estructurado y verificable.

### El marco AAA y la taxonomía de cuentas en la arquitectura

Todo sistema de control de acceso robusto se diseña sobre una estructura funcional conocida como el marco AAA (_Authentication, Authorization, and Accounting_), a la cual se antepone la fase de identificación. Comprender la diferencia entre estas funciones evita el error común de asumir que un usuario, por el simple hecho de haber iniciado sesión correctamente, debería tener visibilidad sobre todos los recursos internos.

:::group title="Componentes estructurales de IAM (Marco AAA)"

- Identificación [declaración]: Es el paso inicial donde una persona o proceso declara quién es ante el sistema mediante un identificador único, como un nombre de usuario, un correo corporativo o una tarjeta de acceso físico.
- Autenticación [verificación]: Es el proceso de comprobar que la entidad es realmente quien dice ser, respondiendo a la pregunta "¿Quién eres?". Se valida contrastando la identidad declarada con uno o más factores: algo que el usuario sabe (conocimiento, como una contraseña o PIN), algo que posee (posesión, como un token físico o un dispositivo móvil que genera códigos de un solo uso) o algo que es (inherencia, como una huella dactilar o reconocimiento facial).
- Autorización [permisos]: Una vez confirmada la identidad, este componente determina exactamente a qué datos, aplicaciones o segmentos de red tiene permiso de acceder ese usuario y qué acciones puede ejecutar sobre ellos, limitando el alcance a lo estrictamente necesario.
- Responsabilidad y Trazabilidad (Accounting / Auditing) [evidencia]: Consiste en monitorear y registrar de forma cronológica las acciones realizadas por cada identidad (inicios de sesión, marcas de tiempo, direcciones IP de origen y archivos modificados) en registros de auditoría para garantizar el no repudio y respaldar investigaciones forenses.
  :::

#### Taxonomía de cuentas a estructurar

El diseño arquitectónico no puede tratar a todas las identidades por igual. Siguiendo las directrices de gestión de cuentas de referencia internacional (como los Controles 5 y 6 de CIS y la categoría `PR.AA` del NIST CSF 2.0), la arquitectura debe separar y catalogar cuatro categorías de cuentas con reglas de protección diferenciadas:

1.  **Cuentas de Usuario Estándar:** Destinadas al personal de la organización para ejecutar sus tareas cotidianas generales (correo electrónico, navegación web, suites de ofimática y acceso a aplicaciones departamentales). Por diseño, estas cuentas tienen privilegios limitados y no deben tener permisos para instalar software ni modificar configuraciones del sistema operativo.
2.  **Cuentas de Administrador (Privilegiadas):** Cuentas diseñadas exclusivamente para usuarios que requieren privilegios elevados con el fin de configurar sistemas operativos, gestionar dominios de red, administrar bases de datos o alterar controles de seguridad (como el superusuario `root` en sistemas Linux o el Administrador de Dominio en entornos Windows). Su compromiso otorga al atacante el control total de la infraestructura.
3.  **Cuentas de Servicio (Identidades de máquina):** Cuentas no humanas creadas específicamente para que una aplicación ejecute procesos en segundo plano, consulte una base de datos o realice copias de seguridad automatizadas. Cada cuenta de servicio debe diseñarse para un propósito único, tener asignado un propietario humano responsable, carecer de permisos para iniciar sesión de forma interactiva por consola y rotar sus credenciales o tokens periódicamente.
4.  **Cuentas de Terceros y Proveedores Externos:** Identidades otorgadas a consultores de soporte técnico, auditores o socios comerciales que requieren acceso al entorno de la empresa. Deben diseñarse bajo un aislamiento estricto, acotadas únicamente al activo que deben mantener y con una fecha de expiración predefinida.

> [!CRITICAL:Prohibición de cuentas compartidas y neutralización de cuentas predeterminadas]
> En una arquitectura segura quedan terminantemente prohibidas las cuentas genéricas o compartidas entre varias personas (como `administracion@empresa.com`, `soporte` o `ventas1`), dado que destruyen la trazabilidad del marco AAA: ante un incidente o robo de información, resulta imposible determinar qué individuo ejecutó la acción. Asimismo, conforme a la Salvaguarda CIS 4.7, toda cuenta preconfigurada de fábrica por los fabricantes en sistemas operativos, bases de datos o enrutadores (`root`, `admin`, `guest` o `sa`) debe diseñarse para ser renombrada, deshabilitada o bloqueada para el inicio de sesión directo antes de que el equipo entre en producción.

### Modelos arquitectónicos de autorización

Al definir cómo se concederán los permisos sobre las carpetas, bases de datos y aplicaciones de la PyME, es necesario distinguir entre los dos roles que interactúan con los activos de información: el **Propietario de los datos** (generalmente un directivo o responsable de área que decide estratégicamente quién tiene necesidad legítima de acceder a la información según su clasificación) y el **Custodio de los datos** (el responsable técnico o administrador de sistemas encargado de configurar los controles para hacer cumplir las decisiones del propietario).

Para traducir las decisiones del propietario en reglas lógicas dentro de los sistemas, existen tres modelos clásicos de control de acceso:

| Modelo de Control de Acceso                                                                  | Mecanismo de funcionamiento                                                                                                                                                                                                                                                              | Ventajas operativas                                                                                                                                      | Riesgos y limitaciones                                                                                                                                                                       |
| :------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Control de Acceso Discrecional (DAC)** _(Discretionary Access Control)_                    | El creador o propietario de un archivo o carpeta decide libremente a qué usuarios compartirle el recurso y con qué permisos (lectura, escritura o edición). Es el comportamiento predeterminado en suites de almacenamiento en la nube como Google Drive o carpetas compartidas básicas. | Alta flexibilidad y rapidez para compartir documentos puntuales sin intervención del área técnica.                                                       | Genera pérdida total de control a mediano plazo: enlaces compartidos públicamente por error, permisos que nunca se revocan y proliferación caótica de accesos directos difíciles de auditar. |
| **Control de Acceso Obligatorio (MAC)** _(Mandatory Access Control)_                         | El sistema operativo o una autoridad central impone el acceso basándose en etiquetas de clasificación de seguridad estrictas y niveles de autorización jerárquicos. El usuario no puede alterar ni compartir por su cuenta los permisos de los archivos que crea.                        | Máxima rigidez y protección contra la divulgación no autorizada; utilizado en entornos militares, gubernamentales o en módulos de núcleo como `SELinux`. | Excesivamente complejo e inflexible para la operación comercial dinámica de una PyME; requiere una carga administrativa constante para etiquetar cada recurso.                               |
| **Control de Acceso Basado en Roles (RBAC)** _(Role-Based Access Control)_                   | Los permisos no se asignan a personas individuales, sino a **roles** o grupos que representan una función laboral dentro de la empresa (ej. Analista Contable, Desarrollador, Atención al Cliente), y los usuarios son asignados a esos roles.                                           | Estandariza los permisos, simplifica las altas y bajas de personal, facilita las auditorías y aplica el mínimo privilegio de forma escalable.            | Si se diseña sin criterio, puede derivar en una multiplicación inmanejable de roles o en roles demasiado amplios que otorgan permisos innecesarios.                                          |
| _Comparativa de modelos arquitectónicos de autorización para la estructuración de permisos._ |

#### Cómo diseñar un esquema RBAC limpio para una organización

Aunque la implementación formal y completa de RBAC con auditorías anuales figura en el nivel avanzado de madurez (`CIS 6.8`), su lógica de diseño debe adoptarse desde el primer día en cualquier empresa para evitar la asignación manual de permisos usuario por usuario. El diseño correcto desacopla a la persona física del recurso técnico mediante una cadena de cuatro eslabones:

```filetree:Arquitectura_Logica_RBAC
Directorio_Central_de_Identidades/
├── 1_Usuarios/                              # Personas físicas con cuentas únicas
│   ├── juan.perez
│   └── maria.gomez
├── 2_Roles_de_Negocio/                      # Puestos de trabajo en la PyME
│   ├── Rol_Finanzas
│   │   └── Miembros: juan.perez             # Juan asume este puesto
│   └── Rol_Ventas
│       └── Miembros: maria.gomez            # María asume este puesto
├── 3_Grupos_de_Seguridad/                   # Paquetes técnicos de permisos
│   ├── Acceso_Contabilidad_Total
│   │   └── Otorgado a: Rol_Finanzas         # Quien esté en Finanzas hereda esto
│   └── Acceso_Clientes_Lectura
│       └── Otorgado a: Rol_Ventas           # Quien esté en Ventas hereda esto
└── 4_Recursos_y_Sistemas/                   # Los activos donde se pone el candado
    ├── Carpeta_Compartida_Pagos             # Acepta al grupo: Acceso_Contabilidad_Total
    └── Base_de_Datos_CRM                    # Acepta al grupo: Acceso_Clientes_Lectura
```

En este esquema, cuando se contrata a un nuevo empleado en el área contable, el administrador no recorre cinco servidores otorgándole permisos sueltos sobre carpetas y tablas; simplemente agrega su usuario al grupo correspondiente a su rol (`Rol_Administracion_Finanzas`) y el usuario hereda instantáneamente todos los accesos exactos que su puesto requiere y ningún otro.

#### Antipatrones de diseño en RBAC que deben evitarse

Al proyectar la estructura de roles, el arquitecto debe prevenir tres deformaciones habituales que arruinan el modelo con el paso del tiempo:

- **Explosión de roles (_Role Explosion_):** Ocurre cuando se crea un rol nuevo por cada pequeña variación de tareas, terminando en una empresa de 30 empleados con 45 roles distintos. La regla práctica para una PyME es mantener entre **5 y 12 roles base** alineados con los departamentos o funciones reales del negocio.
- **Roles "comodín" por comodidad operativa:** Agrupar a todo el personal de oficina bajo un único rol `Empleados_Oficina` con acceso de lectura y escritura a todas las carpetas compartidas de la empresa. Si una sola computadora de recepción es infectada por un programa de secuestro de datos (_ransomware_), ese permiso amplio le permitirá al código malicioso cifrar los documentos de recursos humanos, ingeniería y contabilidad al mismo tiempo.

- **Asignaciones directas fuera de rol (Excepciones permanentes):** Cuando un usuario necesita acceso urgente a una carpeta de otro sector y el administrador agrega su nombre de usuario directamente a la Lista de Control de Acceso (`ACL`) del archivo en lugar de usar un grupo temporal. Esas excepciones individuales quedan ocultas y jamás se eliminan cuando la tarea termina.

### Principios de diseño para cuentas privilegiadas (PAM básico)

Las cuentas con privilegios administrativos representan el activo de identidad más crítico de la organización. Si un empleado utiliza una cuenta con permisos de administrador local o de dominio para leer su correo electrónico y navegar por la web, cualquier código malicioso que se descargue accidentalmente se ejecutará de inmediato con los mismos privilegios máximos del usuario, pudiendo desactivar el software antivirus, extraer credenciales de la memoria y comprometer todo el sistema operativo.

Para neutralizar este vector sin necesidad de adquirir costosas suites empresariales de Gestión de Acceso Privilegiado (PAM, por sus siglas en inglés: _Privileged Access Management_), la arquitectura debe incorporar tres controles estructurales:

#### 1. Separación estricta de cuentas administrativas y cotidianas (CIS 5.4)

Ningún miembro de la organización —incluyendo a los dueños de la empresa, desarrolladores principales y administradores de sistemas— debe utilizar una cuenta con privilegios administrativos para sus actividades diarias. Toda persona que realice tareas de soporte o administración técnica debe poseer **dos cuentas nominales separadas**:

- Una cuenta estándar sin privilegios (ej. `jperez`) para usar en su estación de trabajo habitual, abrir el correo, participar en videollamadas y editar documentos.

- Una cuenta administrativa dedicada (ej. `adm_jperez`) cuyas credenciales se utilizan exclusivamente en el momento puntual de administrar un servidor, instalar un parche o modificar una regla de seguridad, cerrando la sesión inmediatamente después de finalizar la tarea. En sistemas operativos basados en Unix y Linux, este diseño se refuerza deshabilitando el inicio de sesión directo de la cuenta `root` y obligando a los administradores autorizados en el archivo `/etc/sudoers` a elevar privilegios temporalmente por comando mediante la instrucción `sudo`, lo que garantiza que quede registrado qué usuario humano ejecutó cada instrucción privilegiada.

#### 2. Separación de funciones (_Separation of Duties_)

Este principio arquitectónico impide que un único individuo o cuenta posea el control absoluto de extremo a extremo sobre un proceso crítico del negocio o de la infraestructura. Al dividir una operación sensible en dos roles distintos, se previene tanto el abuso intencional (amenaza interna o robo de una cuenta) como los errores humanos accidentales no detectados:

- _En operaciones financieras:_ El rol que tiene permiso en el sistema para cargar un nuevo proveedor o modificar su número de cuenta bancaria no debe ser el mismo rol que tiene autorización para aprobar y liberar la transferencia de fondos.
- _En desarrollo e infraestructura:_ El desarrollador que escribe código en el entorno de pruebas no debería aprobar ni ejecutar por sí solo el pase directo a producción sin la revisión o validación de otro par, y el administrador que gestiona los servidores de producción no debería tener permisos para eliminar los registros de auditoría en el servidor colector de eventos ni borrar las copias de seguridad aisladas.

#### 3. Cuentas de emergencia (_Break-glass accounts_)

Cuando una organización centraliza su autenticación mediante un proveedor de identidad o exige autenticación multifactor en todos los accesos, surge un riesgo arquitectónico de disponibilidad: ¿qué sucede si el proveedor de identidad en la nube sufre una caída global o si un error de configuración en las políticas de acceso bloquea a todos los administradores fuera del sistema?

Para evitar un bloqueo total, se diseña una o dos **cuentas de emergencia** (conocidas como cuentas _break-glass_ o de "romper el cristal"):

- **Aislamiento de dependencias:** Son cuentas locales del directorio o de la plataforma principal que no dependen de servicios externos para funcionar.
- **Custodia física y dividida:** Sus contraseñas deben ser extremadamente extensas (por ejemplo, generadas aleatoriamente con más de 24 caracteres), no se almacenan en los gestores de uso diario y se resguardan divididas o en sobres sellados dentro de una caja fuerte física bajo custodia de la dirección de la empresa.
- **Monitoreo de severidad máxima:** Dado que esta cuenta nunca debe usarse en operaciones normales, el sistema de recolección de registros debe diseñarse para que el simple intento de inicio de sesión con la cuenta de emergencia dispare inmediatamente una alerta crítica a los responsables de seguridad. Una vez superada la emergencia que motivó su uso, su contraseña debe rotarse de forma obligatoria.

### Diseño del ciclo de vida de la identidad (JML: Joiner, Mover, Leaver)

Junto con un buen sistema de permisos, es necesario incorporar un control formal para cuando entra o sale personal de la empresa. En la industria, esta gestión del ciclo de vida de las identidades se estructura bajo el modelo **JML (_Joiner, Mover, Leaver_)**, el cual abarca la incorporación, la movilidad interna y la desvinculación de cualquier trabajador o colaborador externo.

:::steps

### 1. Incorporación o Alta (_Joiner_)

Cuando ingresa un nuevo empleado o se contrata un proveedor, queda prohibido crear cuentas por solicitud verbal o copiando ("clonando") el perfil de un empleado antiguo, ya que eso replica todos los permisos residuales que el empleado anterior haya acumulado por error. El proceso de alta exige una solicitud formal firmada por el responsable del área que indique únicamente el **Rol Funcional** y la fecha de inicio (y fecha de fin en caso de pasantes o contratistas). La cuenta se aprovisiona asignándola exclusivamente a la plantilla base de ese rol en la matriz RBAC.

### 2. Cambio de puesto o función (_Mover_)

Cuando una persona cambia de departamento o asciende dentro de la PyME (por ejemplo, pasa del área de Soporte Técnico al área de Ventas), se produce el principal foco de **arrastre de privilegios (_privilege creep_)**: se le agregan los permisos del nuevo puesto sin quitarle los del puesto anterior. El diseño arquitectónico del flujo de cambio exige una regla de **revocación previa**: al cambiar de rol, se remueve al usuario de todos los grupos de seguridad de su puesto anterior y se le asignan limpia y exclusivamente los grupos de su nuevo rol. Si necesita consultar información de su antiguo sector durante una semana de transición, se le otorga un permiso temporal con fecha de expiración documentada.

### 3. Desvinculación o Baja (_Leaver_)

La terminación del vínculo laboral de un empleado o el fin del contrato de una consultora externa representa un momento de riesgo crítico, especialmente ante salidas conflictivas. El flujo de baja debe coordinarse entre Recursos Humanos (o la gerencia) y el responsable de sistemas para ejecutarse en el instante exacto de la desvinculación:

- **Deshabilitación inmediata, no eliminación:** Las cuentas del usuario en el directorio central, correo y aplicaciones deben deshabilitarse (bloquearse) de inmediato en lugar de borrarse definitivamente en ese instante. Eliminar una cuenta de inmediato puede destruir identificadores únicos (`UID`) o registros asociados que son indispensables para preservar la integridad de los registros de auditoría (`logs`) si semanas después se descubre un incidente o se requiere investigar sus últimas acciones.

- **Revocación de sesiones y tokens activos:** Deshabilitar la contraseña no siempre corta una sesión web ya iniciada en un teléfono móvil o navegador. El procedimiento debe incluir el cierre forzado de todas las sesiones activas, la revocación de tokens de autorización (`OAuth` / claves `API`), la anulación de certificados de Red Privada Virtual (VPN) y, si corresponde, el borrado remoto de los datos corporativos en dispositivos portátiles.

- **Archivado y baja definitiva:** Transcurrido el período de retención legal y de auditoría definido por la empresa (por ejemplo, entre 30 y 90 días tras haber respaldado sus archivos de trabajo y redirigido su correo institucional), se procede a la eliminación definitiva de la cuenta.
  :::

#### Controles automáticos de higiene: Inactividad y auditorías periódicas

Dado que en la práctica algún aviso de baja o fin de proyecto puede omitirse por error humano, la arquitectura debe diseñar una red de contención automática basada en el tiempo y la revisión periódica:

- **Bloqueo por inactividad a los 45 días:** Toda cuenta que no registre inicios de sesión durante un período máximo de 45 días debe ser deshabilitada automáticamente por el sistema o marcada para su bloqueo inmediato.

- **Caducidad predeterminada para terceros:** Las cuentas creadas para proveedores externos, auditores o soporte técnico deben configurarse en el momento mismo de su creación con una fecha de expiración automática (por ejemplo, a los 7 o 30 días), obligando a renovar la autorización explícitamente si el trabajo se extiende. En un sistema Linux, por ejemplo, el diseño contempla el uso de parámetros nativos de expiración al aprovisionar o auditar cuentas en `/etc/shadow` mediante la utilidad `chage`:

```bash:terminal
sudo chage -l proveedor_externo

```

Este comando permite verificar la fecha exacta de expiración de la cuenta (`Account expires`) y los días de inactividad permitidos antes del bloqueo automático, asegurando que ninguna cuenta temporal quede abierta indefinidamente.

- **Calendario de auditorías de identidad (CIS 5.1, 5.5 y 6.8):** El diseño operativo establece una revisión **trimestral** del inventario de cuentas de usuario y de cuentas de servicio para validar que todas sigan asociadas a personal activo o a procesos vigentes, y una auditoría **semestral o anual** de los privilegios asignados a cada rol para purgar permisos innecesarios.

### Políticas de autenticación robusta

Una estructura de roles impecable carece de valor si el mecanismo para verificar la identidad del usuario puede ser vulnerado mediante un ataque de fuerza bruta, un ataque de diccionario o el uso de bases de datos de contraseñas filtradas en incidentes públicos.

#### Criterios modernos de contraseñas y gestión de secretos

Durante años se obligó a los usuarios a crear contraseñas llenas de símbolos complejos que debían cambiarse obligatoriamente cada 30 o 60 días. La evidencia técnica recopilada en las **Directrices de Identidad Digital del NIST (NIST SP 800-63B)** demostró que esa práctica resultaba contraproducente: llevaba a los empleados a elegir contraseñas predecibles variando únicamente el número final (ej. `Lilium2025!`, `Lilium2026!`) o a anotarlas en papeles pegados al monitor.

El diseño moderno de políticas de contraseñas (alineado con `NIST SP 800-63B` y la Salvaguarda `CIS 5.2`) prioriza la **longitud (entropía)** y la **unicidad** por encima de la complejidad arbitraria:

:::group title="Estándar arquitectónico de credenciales"

- Longitud mínima con MFA [8 a 12 caracteres]: Cuando la cuenta está protegida obligatoriamente por Autenticación Multifactor (MFA), la contraseña debe tener un mínimo absoluto de 8 caracteres (recomendándose 12 caracteres como estándar corporativo).

- Longitud mínima sin MFA [14+ caracteres]: Para cualquier cuenta de usuario, sistema local o servicio que por limitaciones técnicas no admita MFA, se exige el uso de frases de paso (_passphrases_) con un mínimo estricto de 14 caracteres. Una _passphrase_ es una contraseña compuesta de varias palabras o caracteres comunes unidos (por ejemplo, "gato azul salta ventana 42"), resultan mucho más sencillas de memorizar para las personas que una contraseña corta con símbolos extraños.

- Prohibición de reutilización y listas negras [unicidad]: Cada activo y servicio empresarial debe poseer una contraseña única. El sistema debe comparar las nuevas contraseñas contra diccionarios de credenciales comprometidas conocidas para impedir el uso de claves filtradas o triviales.

- Rotación basada en compromiso [no periódica]: No se fuerza el cambio periódico de contraseñas de usuarios humanos por mero transcurso del tiempo si no hay indicios de compromiso, pero se exige el cambio inmediato ante cualquier sospecha de filtración, uso de cuenta de emergencia o incidente de seguridad.

- Gestor de contraseñas corporativo [soporte]: La organización debe proveer y estandarizar el uso de un administrador de contraseñas cifrado para que los empleados almacenen sus credenciales de forma segura, prohibiendo guardarlas en hojas de cálculo, documentos de texto plano o navegadores sin protección.
  :::

#### Diseño de Autenticación Multifactor (MFA) según criticidad y resistencia

La Autenticación Multifactor (MFA) exige combinar al menos dos factores de distinta naturaleza (por ejemplo, una contraseña que el usuario _sabe_ más un dispositivo criptográfico o aplicación móvil que el usuario _posee_). Incluso si un atacante roba la contraseña mediante un formulario falso de _phishing_, la ausencia del segundo factor bloquea la intrusión.

Conforme a las Salvaguardas **CIS 6.3, 6.4 y 6.5**, el diseño arquitectónico debe declarar el uso de MFA como **obligatorio e innegociable** en tres perímetros críticos:

1. **Todas las cuentas con acceso administrativo o privilegiado:** Tanto para gestionar infraestructura local como consolas en la nube o paneles de proveedores.

2. **Todos los accesos remotos a la red:** Cualquier conexión entrante mediante VPN, escritorios remotos o servidores bastión desde fuera de la oficina.

3. **Todas las aplicaciones expuestas externamente:** Correo electrónico corporativo, suites de colaboración en la nube (`SaaS`), gestores de proyectos y sistemas de facturación o `CRM` accesibles desde Internet.

No obstante, no todos los métodos de segundo factor ofrecen el mismo nivel de resistencia técnica. El arquitecto debe seleccionar el mecanismo adecuado al nivel de riesgo del rol:

| Método de Segundo Factor (MFA)                             | Mecanismo técnico                                                                           | Nivel de seguridad y vulnerabilidades conocidas | Aplicación recomendada en la arquitectura |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ----------------------------------------------- | ----------------------------------------- |
| **Código de un solo uso (`OTP`) por SMS o llamada de voz** | Envío de un código numérico de 6 dígitos a través de la red de telefonía móvil tradicional. |

| **Bajo (Desaconsejado):** Vulnerable a la interceptación en red telefónica, duplicación de tarjeta SIM (_SIM swapping_) e ingeniería social telefónica (_vishing_).

| Usar únicamente como último recurso en servicios de bajo riesgo que no admitan ningún otro estándar técnico.

|
| **Notificación _Push_ simple en aplicación móvil** | El teléfono muestra un cartel de "Aprobar / Rechazar" cuando alguien intenta iniciar sesión.

| **Moderado:** Vulnerable a ataques de **fatiga de MFA (_MFA Fatigue / Push Bombing_)**, donde el atacante envía decenas de notificaciones seguidas hasta que el usuario acepta una por error o cansancio.

| Aceptable para usuarios estándar **solo si** se configura con emparejamiento numérico (_Number Matching_, donde el usuario debe tipear el número que ve en la pantalla de su computadora). |
| **Generador de códigos temporales (`TOTP` — RFC 6238)** | Aplicaciones autenticadoras (como _Entra Authenticator_, _Google Authenticator_, _2FAS_ o _Bitwarden_) que generan un código local cada 30 segundos basado en una semilla secreta compartida.

| **Alto:** No depende de la señal telefónica ni de mensajes SMS. Sin embargo, puede ser capturado en tiempo real si el usuario lo introduce en un sitio de _phishing_ con proxy inverso (_Adversary-in-the-Middle_).

| **Estándar base recomendado** para toda la fuerza laboral de una PyME en accesos cotidianos, correo y VPN.

| **Llaves de seguridad criptográficas (`FIDO2` / `WebAuthn` / `Passkeys`)** | Tokens físicos por `USB`/`NFC` (ej. _YubiKey_) o autenticadores biométricos integrados en el chip de seguridad del dispositivo que realizan un desafío-respuesta con criptografía asimétrica vinculado al dominio web real. | **Muy Alto (_Phishing-Resistant_):** Técnicamente inmune a la suplantación de identidad; si el dominio web es falso, la llave criptográfica simplemente no firma la petición aunque el usuario haya sido engañado. | **Altamente recomendado para cuentas de Administrador**, directivos que aprueban transferencias bancarias y custodios de infraestructura crítica. |
| _Jerarquía técnica de factores de autenticación y criterios de selección arquitectónica._ |

### Diseño de la Matriz RBAC y artefactos de identidad

Al igual que en la capa de red diseñamos una matriz de flujos antes de tocar el cortafuegos, en la capa de identidad debemos construir la **Matriz de Control de Acceso Basado en Roles (RBAC)** antes de crear usuarios o grupos en los servidores. Este documento cruza los roles definidos en la empresa con los activos inventariados y clasificados en el Módulo 2, especificando el nivel exacto de acceso (`N` = Ninguno / Sin acceso, `L` = Solo Lectura, `E` = Lectura y Escritura, `A` = Administración total) y los requisitos de autenticación:

| Rol Funcional                                                                                                                                                                                                                                                                               | Tipo de Cuenta           | Requisito MFA             | Carpeta Pública _(Datos Públicos)_ | Sistema CRM _(Datos Internos)_        | Módulo Contable ERP _(Confidencial)_ | Base de Datos / Backups _(Restringido)_    | Consola Firewall / Switches _(Infraestructura)_ |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------ | ------------------------- | ---------------------------------- | ------------------------------------- | ------------------------------------ | ------------------------------------------ | ----------------------------------------------- |
| **Atención Comercial / Ventas**                                                                                                                                                                                                                                                             | Estándar                 | `TOTP` Obligatorio        | Lectura (`L`)                      | Lectura / Escritura (`E`)             | Ninguno (`N`)                        | Ninguno (`N`)                              | Ninguno (`N`)                                   |
| **Analista de Finanzas y RRHH**                                                                                                                                                                                                                                                             | Estándar                 | `TOTP` Obligatorio        | Lectura (`L`)                      | Solo Lectura (`L`)                    | Lectura / Escritura (`E`)            | Ninguno (`N`)                              | Ninguno (`N`)                                   |
| **Desarrollador de Software**                                                                                                                                                                                                                                                               | Estándar _(Entorno Dev)_ | `TOTP` / `FIDO2`          | Lectura (`L`)                      | Ninguno (`N`) _(Usa datos ficticios)_ | Ninguno (`N`)                        | Ninguno en Prod (`N`) _(Solo entorno Dev)_ | Ninguno (`N`)                                   |
| **Soporte TI (Cuenta Diaria)**                                                                                                                                                                                                                                                              | Estándar                 | `TOTP` Obligatorio        | Lectura / Escritura (`E`)          | Ninguno (`N`)                         | Ninguno (`N`)                        | Ninguno (`N`)                              | Ninguno (`N`)                                   |
| **Administrador TI (`adm_`)**                                                                                                                                                                                                                                                               | Privilegiada Dedicada    | `FIDO2` / `TOTP` Estricto | Administración (`A`)               | Administración técnica (`A`)          | Sin acceso a datos de negocio (`N`)* | Administración de plataforma (`A`)*        | Administración (`A`) _(Desde VLAN 50)_          |
| **Servicio Web ERP (`svc_erp`)**                                                                                                                                                                                                                                                            | Cuenta de Servicio       | Clave larga / Certificado | Ninguno (`N`)                      | Ninguno (`N`)                         | Proceso de aplicación (`E`)          | Lectura / Escritura en tabla ERP (`E`)     | Ninguno (`N`)                                   |
| **Proveedor Soporte Contable**                                                                                                                                                                                                                                                              | Tercero _(Temporal)_     | `TOTP` Obligatorio        | Ninguno (`N`)                      | Ninguno (`N`)                         | Lectura / Diagnóstico temporal (`L`) | Ninguno (`N`)                              | Ninguno (`N`)                                   |
| _Ejemplo de Matriz RBAC aplicando mínimo privilegio, separación de cuentas administrativas y separación de entornos. (Nota: El administrador gestiona la infraestructura pero se audita o restringe su lectura directa de registros salariales o financieros salvo incidencia autorizada)._ |

### Herramientas representativas para la gestión de identidades

La centralización de cuentas evita la pesadilla operativa de tener que crear, modificar y borrar usuarios computadora por computadora. Para llevar este diseño a la realidad en el Módulo 4, una PyME puede elegir entre herramientas gratuitas que requieren mantenimiento propio o servicios en la nube listos para usar:

**Soluciones de Código Abierto (_Open Source_):**
Requieren conocimientos técnicos para instalar y mantener el servidor, pero no cobran licencias por cantidad de usuarios.

- **Para unificar la red local (Directorios):** `FreeIPA` o `Samba Active Directory`. Sirven para centralizar las cuentas de los empleados y los permisos de las computadoras de la oficina en un solo lugar.
- **Para unificar aplicaciones web (SSO y MFA):** `Keycloak` o `Authentik`. Funcionan como la "puerta de entrada principal" de la empresa. Permiten que un usuario inicie sesión una sola vez para acceder a múltiples sistemas internos, soportando códigos temporales y llaves de seguridad físicas.
- **Para resguardar secretos (Gestores de contraseñas):** `Vaultwarden` o `Passbolt`. Reemplazan los peligrosos archivos de Excel compartidos por cajas fuertes digitales, donde el equipo técnico guarda y audita credenciales sin pagar suscripciones.

**Soluciones Comerciales y en la Nube:**
El proveedor se encarga del mantenimiento de los servidores a cambio de un pago mensual o anual por usuario.

- **Identidad como Servicio (`IDaaS`):** `Microsoft Entra ID` (antes conocido como _Azure AD_), `Google Workspace Cloud Identity` u `Okta`.
- **Gestores de contraseñas empresariales:** `Bitwarden Teams/Enterprise` o `1Password Business`. Bóvedas listas para usar en la nube, ideales para equipos que necesitan compartir contraseñas de forma segura desde el primer día.

> [!TIP]
> **La decisión más eficiente:** Si la PyME ya paga licencias de correo corporativo y ofimática (como Microsoft 365 o Google Workspace), la estrategia arquitectónica más inteligente es utilizar su directorio nativo. Esto permite activar el control de roles (`RBAC`) y el MFA de inmediato, sin incurrir en costos adicionales ni administrar plataformas nuevas.

### Verificación del diseño de identidad y control de acceso

Antes de avanzar hacia la extensión del diseño para trabajo remoto y nube (`3.4`), somete tu Matriz RBAC y tu flujo de ciclo de vida a las siguientes comprobaciones:

:::steps

### 1. Prueba de reducción al mínimo privilegio (Desafío de necesidad operativa)

Recorre cada intersección de tu Matriz RBAC donde hayas colocado un permiso de Escritura (`E`) o Administración (`A`) y formula dos preguntas de control:

- _"¿Qué proceso diario del negocio se detiene si rebajo este permiso de Escritura (`E`) a Solo Lectura (`L`) o a Ninguno (`N`)?"_ Si ninguna tarea legítima del puesto se ve impedida, el permiso es excesivo y debe reducirse en el plano antes de implementarse.

- _"¿Puede un usuario estándar desde su cuenta de trabajo diario modificar o borrar las copias de seguridad o los registros de auditoría?"_ La intersección entre cualquier rol de usuario estándar y los repositorios de respaldos/logs debe ser estrictamente `N` (Ninguno).

### 2. Auditoría de orfandad y trazabilidad nominal

Revisa el catálogo proyectado de cuentas administrativas y de servicio verificando que se cumplan tres condiciones sin excepción:

- No existe ninguna cuenta en el diseño cuyo propietario sea "El departamento de TI" o "Uso compartido"; toda cuenta administrativa (`adm_`) y toda cuenta de servicio (`svc_`) tiene asignado el nombre y apellido de un responsable humano único.

- Ningún administrador utiliza su cuenta con privilegios elevados para acceder al correo electrónico o navegar por Internet.

- El 100% de las cuentas con permisos administrativos, de acceso remoto o con visibilidad desde Internet tiene asignado un requisito obligatorio de MFA en la matriz.

### 3. Definición de casos de prueba de autorización para `04. PROTECT`

Deja documentados los casos de prueba que se ejecutarán al configurar el sistema real para confirmar que la matriz se cumple:

- **Prueba Positiva de Rol:** Iniciar sesión con una cuenta de prueba asignada al rol `Atención Comercial` y verificar que puede consultar y editar fichas en el sistema `CRM`, previa solicitud exitosa del segundo factor MFA.

- **Prueba Negativa de Separación Horizontal:** Con esa misma sesión activa de `Atención Comercial`, intentar acceder a la ruta de red o al módulo del sistema contable (`Finanzas`). El sistema debe devolver un error explícito de `Acceso Denegado` (_Permission Denied_) y generar un evento de auditoría de intento de acceso no autorizado en el registro central.

- **Prueba Negativa de Escalada Vertical:** Desde una sesión de usuario estándar en una estación de trabajo, intentar ejecutar un comando administrativo (`sudo` o instalación de un paquete de software). El sistema debe rechazar la operación e impedir la elevación de privilegios.
  :::

## 3.4. Entornos Híbridos Seguros <!-- id: entornos-hibridos, icon: ServerIcon -->

Actualmente, en la realidad operativa de cualquier pequeña o mediana empresa, los datos ya no se encuentran confinados detrás del _router_ local: el correo electrónico, las suites de ofimática y los sistemas de gestión suelen operar en plataformas en la nube, los empleados se conectan desde sus hogares utilizando redes domésticas o dispositivos portátiles, y los proveedores externos requieren acceso remoto para dar soporte técnico a los servidores.

Esta transformación disuelve el perímetro físico tradicional, entonces se crea un entorno híbrido donde cada conexión externa y cada servicio contratado amplían la superficie de ataque de la empresa. Cuando las organizaciones habilitan el trabajo remoto o migran hacia la nube de forma apresurada para ganar agilidad operativa, suelen abrir brechas críticas: exponen escritorios remotos directamente a Internet, delegan ciegamente la seguridad en sus proveedores tecnológicos o permiten que computadoras personales sin protección se conecten a los servidores centrales. Esta sección extiende los planos de red e identidad hacia el exterior, estableciendo los patrones arquitectónicos para conectar usuarios remotos, plataformas en la nube y terceros de una forma segura.

### Arquitectura en la nube y el Modelo de Responsabilidad Compartida

En lugar de adquirir, cablear y mantener servidores físicos propios, las empresas alquilan capacidad de cómputo, almacenamiento y aplicaciones a través de Proveedores de Servicios en la Nube (CSP, por sus siglas en inglés: _Cloud Service Providers_). Sin embargo, uno de los errores estratégicos más graves consiste en asumir que, al contratar un servicio en la nube de primera línea, el proveedor se encarga automáticamente de toda la ciberseguridad.

En toda arquitectura en la nube rige el **Modelo de Responsabilidad Compartida**: el proveedor es responsable de la seguridad _de_ la nube (que incluye los centros de datos físicos, el cableado, el hardware y los hipervisores de virtualización), mientras que la organización cliente retiene la responsabilidad intransferible sobre lo que coloca _en_ la nube. La frontera exacta de qué controles debe diseñar cada PyME depende del modelo de servicio contratado:

:::group title="Modelos de servicio en la nube y alcance del diseño" description="Distribución del control arquitectónico entre la PyME y el proveedor"

- Infraestructura como Servicio (IaaS) [máximo control técnico]: La empresa alquila los bloques básicos de infraestructura virtualizada (máquinas virtuales, discos de almacenamiento y redes definidas por software). El proveedor asegura el hardware físico, pero la empresa cliente debe diseñar y mantener la seguridad del sistema operativo invitado, la aplicación de parches, las reglas del _firewall_ virtual, la configuración de las aplicaciones, las identidades y los datos.
- Plataforma como Servicio (PaaS) [control intermedio]: El proveedor aloja y mantiene tanto el hardware como el sistema operativo y los motores de ejecución o bases de datos subyacentes para que los desarrolladores desplieguen sus propias aplicaciones. La empresa queda liberada de administrar el sistema operativo base, pero es enteramente responsable de diseñar la seguridad del código fuente de su aplicación, actualizar sus bibliotecas de terceros, configurar las interfaces de programación y gestionar quién accede a los datos.
- Software como Servicio (SaaS) [control de configuración y datos]: El proveedor entrega la aplicación final lista para usar a través de un navegador web (como _Gmail_, sistemas contables en línea o gestores de relaciones con clientes). Aunque el proveedor gestiona toda la infraestructura y el software, las configuraciones predeterminadas suelen priorizar la facilidad de uso por sobre la seguridad. La empresa usuaria es responsable absoluta de configurar el servicio de forma segura, administrar las cuentas de usuario, exigir autenticación multifactor, restringir el uso compartido de archivos y respaldar su propia información.
  :::

| Capa de la Arquitectura                                                         | Local (On-Premise)   | IaaS (Infraestructura)   | PaaS (Plataforma)        | SaaS (Software)                           |
| :------------------------------------------------------------------------------ | :------------------- | :----------------------- | :----------------------- | :---------------------------------------- |
| **Datos, clasificación y respaldos**                                            | Responsabilidad PyME | Responsabilidad PyME     | Responsabilidad PyME     | **Responsabilidad PyME**                  |
| **Identidades, cuentas, roles y MFA**                                           | Responsabilidad PyME | Responsabilidad PyME     | Responsabilidad PyME     | **Responsabilidad PyME**                  |
| **Dispositivos finales (Endpoints)**                                            | Responsabilidad PyME | Responsabilidad PyME     | Responsabilidad PyME     | **Responsabilidad PyME**                  |
| **Configuración y código de aplicación**                                        | Responsabilidad PyME | Responsabilidad PyME     | **Responsabilidad PyME** | Compartida _(Ajustes de seguridad: PyME)_ |
| **Controles de red y cortafuegos lógicos**                                      | Responsabilidad PyME | **Responsabilidad PyME** | Compartida               | Proveedor CSP                             |
| **Sistema Operativo y parches de host**                                         | Responsabilidad PyME | **Responsabilidad PyME** | Proveedor CSP            | Proveedor CSP                             |
| **Virtualización, servidores físicos y edificio**                               | Responsabilidad PyME | Proveedor CSP            | Proveedor CSP            | Proveedor CSP                             |
| _Matriz de Responsabilidad Compartida según el entorno tecnológico desplegado._ |

> [!WARNING:La trampa de la disponibilidad vs. la recuperación en SaaS]
> Que un proveedor de correo o almacenamiento en la nube garantice que sus servidores físicos no se caerán no significa que proteja a la PyME contra el borrado masivo de archivos por parte de un empleado descontento o el cifrado de carpetas por un ataque de secuestro de datos (_ransomware_). En la fila superior de la matriz, la protección de los datos y la existencia de copias de seguridad independientes nunca se delegan por completo al proveedor de la aplicación.

#### Aislamiento de recursos e imágenes base en la nube

Cuando la organización despliega servidores en entornos IaaS o PaaS, debe replicar los mismos principios de segmentación diseñados para la red física. Los recursos deben agruparse dentro de Redes Privadas Virtuales aisladas (conocidas como `VPC`, _Virtual Private Cloud_), separando estrictamente los servidores orientados al cliente de las bases de datos internas y aislando los entornos de desarrollo respecto a los de producción. Asimismo, para contrarrestar la velocidad de cambios en la nube y evitar errores manuales al crear nuevos servidores, el diseño exige definir una **imagen de línea base segura**: una plantilla de servidor preconfigurada, endurecida y sin servicios innecesarios que sirva como molde estandarizado para desplegar cualquier nueva instancia y detectar alteraciones no autorizadas.

### Patrones de diseño para el Acceso Remoto Seguro

Cuando el personal necesita trabajar desde fuera de la oficina o un administrador requiere gestionar un servidor a distancia, la tentación más peligrosa consiste en abrir un puerto en el _firewall_ perimetral y redirigirlo directamente hacia el equipo interno.

> [!CRITICAL:Prohibido exponer servicios de administración]
> Exponer directamente hacia Internet el Protocolo de Escritorio Remoto de Windows (`RDP`, puerto `TCP/UDP 3389`), el Shell Seguro (`SSH`, puerto `TCP 22`), consolas de bases de datos o paneles de administración de infraestructura constituye una vulnerabilidad crítica de diseño. Los actores de amenaza utilizan motores de búsqueda automatizados que escanean todo el espacio de direcciones `IPv4` de Internet en minutos para localizar estos puertos abiertos (técnica catalogada en MITRE ATT&CK como Servicios Remotos Externos — `T1133`) y lanzar ataques masivos de fuerza bruta, explotación de vulnerabilidades de preautenticación o inyección de credenciales robadas (`T1078`). En una arquitectura segura, ningún servicio de administración o recurso interno se publica jamás de forma directa hacia la Zona No Controlada de la red.

Para permitir el trabajo a distancia sin exponer los servicios internos, el arquitecto debe seleccionar entre tres patrones de diseño según el tipo de usuario y el recurso que necesita alcanzar:

```filetree:Patrones_Acceso_Remoto_Hibrido
Accesos_Externos_Internet/
├── Patron_01_Tunel_VPN_Corporativo/
│   ├── Autenticacion: Directorio AAA + MFA Obligatorio
│   └── Destino: Subred especifica de VPN -> Filtrado Firewall -> Recurso Interno
├── Patron_02_Proxy_Inverso_Autenticado_ZTNA/
│   ├── Autenticacion: Proveedor de Identidad (SSO + MFA) en el borde
│   └── Destino: Acceso exclusivo a la aplicacion web interna (Sin acceso a la red LAN)
└── Patron_03_Servidor_Bastion_JumpBox/
    ├── Autenticacion: Conexion previa + MFA estricto + Cuenta Admin dedicada
    └── Destino: VLAN 50 (Administracion IT) para gestion tecnica de servidores
```

#### 1. Conectividad mediante Red Privada Virtual (VPN)

Una Red Privada Virtual (VPN, _Virtual Private Network_) establece una extensión lógica segura a través de una red pública no confiable como Internet. Su funcionamiento se basa en dos mecanismos simultáneos: el **cifrado** (que codifica el contenido de los datos mediante claves criptográficas para que ningún intruso en una red Wi-Fi pública o proveedor de Internet pueda leerlos) y el **encapsulamiento** (que oculta el paquete de datos original envolviéndolo dentro de uno nuevo, formando lo que se denomina un **túnel VPN**).

Al diseñar una arquitectura basada en VPN, se deben definir tres decisiones estructurales:

- **Integración con AAA y MFA obligatorio:** El concentrador VPN nunca debe autenticarse únicamente con una contraseña estática o una clave precompartida igual para todos los empleados. Debe conectarse al servicio central de autenticación de la empresa (`AAA`) y exigir obligatoriamente un segundo factor (MFA) en cada inicio de sesión.

- **Túnel Completo (_Full Tunnel_) vs. Túnel Dividido (_Split Tunnel_):**
  - En un diseño de **Túnel Completo**, el 100% del tráfico de red de la computadora remota (tanto el acceso a los servidores de la empresa como la navegación general hacia sitios de Internet) se envía por el túnel cifrado hacia el firewall de la oficina antes de salir a la web. Esto ofrece máxima visibilidad y protección (ya que el empleado remoto queda protegido por el filtrado `DNS` y el cortafuegos corporativo), pero consume todo el ancho de banda del enlace de Internet de la oficina central.

  - En un diseño de **Túnel Dividido**, solo el tráfico dirigido específicamente a las subredes privadas de la empresa (`10.10.X.X`) viaja por el túnel VPN, mientras que el tráfico general de Internet (como videollamadas o descargas pesadas) sale directamente por la conexión doméstica del empleado. Si se elige túnel dividido por razones de rendimiento, es obligatorio asegurar que el dispositivo remoto cuente con su propio servicio de filtrado `DNS` local y firewall de host activo (`CIS 4.5` y `9.2`).

- **Subred de VPN aislada y filtrada:** Un error clásico de diseño consiste en configurar la VPN para que otorgue al usuario remoto acceso libre a toda la red interna. Si la computadora remota está infectada, el túnel VPN actuará como un puente directo para propagar el malware hacia los servidores. El diseño correcto asigna a los clientes VPN un bloque de subred propio (por ejemplo, `10.10.70.0/24`) y le aplica la Matriz de Flujos Autorizados de la sección `03.2`, permitiendo que cada usuario alcance únicamente los puertos y servidores específicos que su rol requiere.

#### 2. Alternativas modernas: Proxies Autenticados y Acceso de Confianza Cero (ZTNA)

Para muchos empleados administrativos o comerciales que solo necesitan utilizar una aplicación web interna (como el sistema de facturación o la intranet), entregarles un VPN que conecta su equipo a nivel de Capa 3 de red resulta excesivo y riesgoso.

Siguiendo los principios de Confianza Cero (_Zero Trust Network Access_ o `ZTNA`), el diseño puede sustituir la VPN tradicional para aplicaciones web mediante un **Proxy Inverso con Autenticación Previa en el Borde**. En este patrón, el usuario abre su navegador desde casa; antes de que su paquete llegue siquiera al servidor de la aplicación, un proxy o pasarela de identidad interpuesto exige el inicio de sesión con MFA, verifica los permisos del rol del usuario y valida la postura del dispositivo. Si todo es correcto, le permite interactuar exclusivamente con esa aplicación web específica en Capa 7, sin otorgarle jamás una dirección `IP` dentro de la red local ni visibilidad para escanear otros equipos internos.

#### 3. Servidores Bastión (_Jump-boxes_) para administración técnica

Como establecen las recomendaciones del **Control CIS 6**, cuando un administrador de sistemas o un especialista externo necesita conectarse por consola (`SSH` o `RDP`) a los servidores de la Zona Restringida desde una ubicación remota, no debe hacerlo saltando directamente desde su portátil hasta el servidor de base de datos. El diseño seguro interpone un **Servidor Bastión (_Jump-box_)**: un único equipo endurecido, intensamente monitoreado y ubicado en la Zona de Administración, el cual actúa como el único punto de salto autorizado desde donde se pueden abrir sesiones administrativas hacia el resto de la infraestructura.

### Centralización y Federación de Identidad (SSO)

A medida que una PyME adopta múltiples herramientas en la nube (correo, almacenamiento, gestor de tareas, contabilidad, plataforma de diseño), si cada servicio mantiene su propia lista de usuarios independiente, los empleados terminan gestionando decenas de contraseñas distintas. Las consecuencias operativas son predecibles: los usuarios reutilizan la misma contraseña en todos los portales y, cuando un empleado se desvincula de la empresa, el administrador olvida darlo de baja en tres o cuatro plataformas secundarias.

Para resolver esta fragmentación, la arquitectura centraliza el control de accesos mediante el **Inicio de Sesión Único (SSO, _Single Sign-On_)**. Este modelo evita que cada aplicación verifique al usuario de forma independiente; en su lugar, delega esa tarea estableciendo una relación de confianza criptográfica entre dos partes:

1. **El Proveedor de Identidad (IdP, _Identity Provider_):** Es el directorio central donde reside la verdad única sobre los usuarios, sus grupos de rol y sus factores de autenticación MFA.

2. **Los Proveedores de Servicios (SP, _Service Providers_):** Son las distintas aplicaciones en la nube o internas que el usuario desea utilizar. Cuando el empleado intenta entrar a una aplicación, esta no le pide una contraseña propia, sino que lo redirige al Proveedor de Identidad; una vez que el IdP autentica al usuario una sola vez, emite un **token de acceso cifrado y firmado digitalmente** hacia el SP confirmando la identidad y los permisos del empleado.

#### Selección de protocolos de identidad según el entorno

Al diseñar cómo se comunicarán las aplicaciones con el directorio central, es fundamental distinguir qué protocolo estándar corresponde a cada escenario técnico:

| Protocolo / Estándar                                           | Propósito principal                                                  | Entorno de uso | Funcionamiento y consideraciones |
| -------------------------------------------------------------- | -------------------------------------------------------------------- | -------------- | -------------------------------- |
| **`LDAP` / `LDAPS`** _(Lightweight Directory Access Protocol)_ | Consulta y autenticación contra servicios de directorio jerárquicos. |

| **Entornos locales (_On-Premise_)** o redes privadas internas (servidores Linux, NAS, cortafuegos, Active Directory).

| No está diseñado para exponerse a Internet. Debe diseñarse siempre sobre su variante cifrada con `TLS` (`LDAPS`, puerto `636`) para evitar que las credenciales viajen en texto claro por la red local.

|
| **`SAML 2.0`** _(Security Assertion Markup Language)_ | Federación de identidad y autenticación SSO basada en documentos `XML` firmados.

| Entornos en la nube (`SaaS`) y portales web empresariales.

| Permite que el `IdP` transmita afirmaciones de identidad seguras a través del navegador hacia proveedores externos sin compartir jamás la contraseña del usuario.

|
| **`OIDC` (_OpenID Connect_)** | Capa de **autenticación** de identidad moderna construida sobre el marco `OAuth 2.0` usando tokens `JSON` (`JWT`). | Aplicaciones web modernas, aplicaciones móviles y APIs. | Más ligero que `SAML`; permite verificar quién es el usuario y obtener atributos básicos de su perfil para iniciar sesión (SSO). |
| **`OAuth 2.0`** | Protocolo abierto de **autorización delegada** (no de autenticación por sí mismo).

| **Integración entre aplicaciones, servicios en la nube y APIs de terceros**.

| Permite que un usuario autorice a una aplicación a acceder a recursos específicos de otra cuenta mediante el intercambio de Tokens API temporales y acotados, sin entregar sus credenciales reales.

| _Mapa de protocolos de identidad y autorización para el diseño de arquitecturas híbridas._

#### El riesgo de centralización en el Proveedor de Identidad

Unificar el acceso mediante SSO simplifica drásticamente el cumplimiento del ciclo de vida de las cuentas (al deshabilitar al usuario en el IdP, pierde acceso instantáneo a todas las aplicaciones conectadas), pero convierte al Proveedor de Identidad en el activo más sensible de toda la arquitectura. Si un atacante logra comprometer una cuenta en un sistema SSO que solo pide contraseña, obtiene acceso automático a todos los servicios de la empresa.

Por ello, el diseño arquitectónico de un entorno SSO exige tres salvaguardas obligatorias:

- **Combinación SSO + MFA:** Ningún sistema de Inicio de Sesión Único debe diseñarse sin exigir Autenticación Multifactor obligatoria en el `IdP`.

- **Gobernanza de consentimiento `OAuth`:** Los atacantes suelen engañar a los empleados mediante campañas de _phishing_ de consentimiento, donde en lugar de robarles la contraseña, les piden que autoricen una aplicación de terceros maliciosa mediante `OAuth` para que esta lea sus correos o archivos en la nube usando un Token API. El diseño del IdP debe restringir la capacidad de los usuarios estándar para autorizar aplicaciones `OAuth` de terceros no verificadas sin aprobación previa del administrador.

- **Contingencia y disponibilidad:** Mantener las cuentas de emergencia (_break-glass_) definidas en la sección `03.3` y auditar los registros de cambios de configuración del propio IdP.

### Diseño de requisitos para el Endpoint Remoto y Dispositivos Personales (BYOD)

Cuando un empleado trabaja desde su casa o en movimiento, su computadora portátil o su teléfono inteligente se convierte en el perímetro físico de la empresa. Si el dispositivo es robado en la vía pública con el disco duro sin cifrar, quien lo obtenga podrá extraer todos los documentos confidenciales sincronizados localmente sin siquiera necesitar conocer la contraseña del sistema operativo. Del mismo modo, si un equipo remoto con el antivirus desactivado se conecta a la VPN, podría introducir amenazas directamente en las zonas internas.

#### Condiciones de postura del dispositivo para el acceso remoto (CIS 13.5)

Siguiendo la Salvaguarda CIS 13.5 y las guías para teletrabajo (NIST SP 800-46 Rev. 2), la arquitectura debe definir una **Política de Postura de Dispositivo**: un conjunto de controles técnicos mínimos que todo activo remoto debe cumplir para estar autorizado a conectarse a los recursos empresariales:

:::group title="Estándar de diseño para Endpoints Remotos" description="Controles obligatorios en equipos portátiles que acceden a datos de la empresa"

- Cifrado de disco completo (FDE) [CIS 3.6 — IG1]: Todo dispositivo portátil o estación remota que almacene o procese datos de la empresa debe tener cifrado su almacenamiento completo mediante herramientas nativas robustas (`Microsoft BitLocker` en Windows, `Apple FileVault` en macOS o `LUKS`/`dm-crypt` en Linux), asegurando que el robo físico del equipo no derive en una brecha de confidencialidad.

- Bloqueo automático por inactividad [CIS 4.3 — IG1]: El sistema operativo debe diseñarse para bloquear automáticamente la sesión y exigir reautenticación tras un máximo de **15 minutos** de inactividad en computadoras de escritorio/portátiles, y tras un máximo de **2 minutos** en teléfonos inteligentes y tabletas.

- Bloqueo por intentos fallidos locales [CIS 4.10 — IG2]: Para mitigar intentos de adivinación física de claves en equipos perdidos o robados, las portátiles deben bloquearse tras un máximo de **20 intentos fallidos** de inicio de sesión local, y los dispositivos móviles tras un máximo de **10 intentos fallidos**.

- Capacidad de borrado remoto [CIS 4.11 — IG2]: La arquitectura debe contemplar el uso de agentes o perfiles de Gestión de Dispositivos Móviles (`MDM`, _Mobile Device Management_) que permitan ejecutar un borrado remoto (_remote wipe_) de los datos empresariales en caso de extravío, robo o desvinculación del trabajador.

- Higiene activa verificada [CIS 13.5 — IG2]: Condicionar el nivel de acceso remoto verificando que el equipo cuente con su cortafuegos local encendido, el servicio de filtrado `DNS` activo, el software antimalware actualizado y los parches de seguridad al día.
  :::

#### Diferenciación arquitectónica: Equipos corporativos frente a BYOD

En muchas pequeñas empresas no resulta financieramente viable entregar un teléfono móvil corporativo o una computadora portátil de la empresa a cada empleado o colaborador externo, por lo que se permite el uso de dispositivos personales para fines laborales (_Bring Your Own Device_ o `BYOD`).

El error arquitectónico consiste en otorgar al dispositivo personal (`BYOD`) exactamente los mismos permisos de red y descarga de datos que a un equipo propiedad de la empresa y administrado al 100% por el área de sistemas. El diseño debe establecer una frontera clara de capacidades según la propiedad y gestión del dispositivo:

| Criterio Arquitectónico    | Dispositivo Corporativo Gestionado                                                   | Dispositivo Personal (`BYOD`) en Móviles | Computadora Personal (`BYOD`) de Escritorio/Portátil |
| -------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------- | ---------------------------------------------------- |
| **Control administrativo** | Total por parte de la empresa (sin permisos de administrador local para el usuario). |

| Parcial, limitado exclusivamente a un contenedor de trabajo aislado.

| Nulo o muy bajo sobre el sistema operativo privado del empleado.

|
| **Diseño de aislamiento de datos** | Disco completo cifrado y políticas de sistema corporativas.

| **Espacios de trabajo separados:** Uso de _Perfil de Trabajo de Android_ o _Cuentas Administradas / Perfiles de Configuración de Apple_ para aislar las aplicaciones y datos de la empresa respecto a las fotos y aplicaciones personales del usuario.

| Prohibición de sincronizar bases de datos completas o carpetas críticas en el disco local; trabajo a través de aplicaciones en el navegador web o escritorio virtual remoto. |
| **Conectividad de red permitida** | Elegible para túnel VPN hacia zonas autorizadas o `ZTNA` tras validar postura.

| Solo acceso a aplicaciones en la nube (`SaaS`) o mediante proxy autenticado con MFA; en la oficina se conecta a la `VLAN` aislada (`VLAN 99`).

| **Sin acceso directo a VPN de red interna**; acceso exclusivo a portales web publicados con MFA o mediante una sesión hacia un escritorio/servidor bastión intermedio.

|
| **Acción ante robo o baja laboral (CIS 4.11)** | Borrado completo del dispositivo o bloqueo total del equipo.

| **Borrado selectivo:** Se elimina remotamente solo el contenedor/perfil de trabajo empresarial sin tocar los datos personales del dueño del teléfono.

| Revocación de credenciales SSO, cierre forzado de sesiones web activas y anulación de tokens.

|
| _Diseño de controles diferenciados entre activos gestionados por la empresa y dispositivos personales._

### Diseño de Gobernanza y Accesos de Proveedores Externos

Ninguna organización opera en aislamiento: depende de estudios contables externos, agencias de marketing que administran su sitio web, técnicos tercerizados que mantienen su sistema de facturación y proveedores de alojamiento en la nube. Como advierte el Control CIS 15 (_Gestión de Proveedores de Servicios_) y la categoría `GV.SC` (_Gestión de Riesgos de la Cadena de Suministro_) del NIST CSF 2.0, los atacantes suelen infiltrarse primero en un proveedor pequeño o consultor externo para usar sus conexiones de confianza como puente directo hacia las empresas clientes, o bien un ataque de ransomware en un proveedor paraliza indirectamente las operaciones de la PyME.

Para evitar que la cadena de suministro se convierta en una puerta trasera hacia la arquitectura diseñada, el acceso y la relación con terceros deben estructurarse bajo cuatro reglas de diseño:

#### 1. Clasificación de proveedores por impacto y riesgo

A partir del inventario de proveedores levantado en el Módulo 2, el arquitecto debe clasificar a cada tercero en niveles de criticidad evaluando qué tipo de datos toca, el volumen de información que procesa y cuánto afectaría al negocio si ese proveedor sufre una caída o una brecha:

- **Nivel 1 — Crítico (Alto Riesgo):** Proveedores con acceso administrativo a la infraestructura de TI (soporte externo / servicios gestionados), desarrolladores externos con acceso a bases de datos o proveedores SaaS /IaaS que alojan datos financieros y personales.

- **Nivel 2 — Operativo (Riesgo Medio):** Proveedores que interactúan con datos internos no críticos o sistemas aislados (por ejemplo, una agencia que administra únicamente el contenido público del blog institucional en la DMZ o el soporte técnico de las impresoras en la `VLAN 80`).
- **Nivel 3 — Bajo Impacto (Riesgo Bajo):** Proveedores de insumos o servicios generales que no poseen cuentas de usuario en los sistemas de la empresa ni almacenan datos digitales corporativos.

#### 2. Diseño técnico del acceso para soporte externo

Cuando un proveedor de Nivel 1 o 2 necesita conectarse remotamente a un servidor de la empresa para solucionar un fallo o actualizar un sistema, quedan prohibidas las prácticas inseguras habituales: nunca se instalan herramientas de control remoto desatendido con contraseñas fijas sin supervisión, nunca se le entrega la contraseña de administrador principal de la empresa, y nunca se deja su acceso abierto las 24 horas de los 365 días del año.

El patrón arquitectónico seguro para terceros exige:

- **Cuentas individuales y nominales:** Si tres técnicos de una consultora externa dan soporte a la PyME, se diseñan tres cuentas individuales identificables (`ext_nombre`) sujetas a MFA obligatorio, prohibiendo el uso de una cuenta única compartida por toda la consultora.

- **Acceso Justo a Tiempo (_Just-in-Time_ / Bajo demanda):** Las cuentas o las reglas de acceso remoto para proveedores externos permanecen **deshabilitadas por defecto** en condiciones normales. Solo se habilitan a pedido cuando existe un ticket de mantenimiento programado y se vuelven a deshabilitar automáticamente al concluir la ventana de trabajo.
- **Confinamiento de red:** La conexión del proveedor externo (ya sea vía VPN o servidor bastión) debe estar restringida en la Matriz de Flujos (`03.2`) para alcanzar exclusivamente la dirección `IP` y el puerto del servidor específico que ese proveedor mantiene, impidiéndole ver o conectarse a cualquier otro activo de la organización.

#### 3. Requisitos contractuales y Desactivación Segura

En el plano administrativo del diseño, los contratos o acuerdos de servicio con proveedores de Nivel 1 y 2 deben incorporar cláusulas mínimas de seguridad: la obligación de notificar de inmediato a la empresa ante cualquier incidente o filtración de seguridad que afecte sus sistemas, el requisito de cifrar los datos compartidos y el compromiso formal sobre cómo devolverán o eliminarán la información al finalizar la relación.

Asimismo, el diseño debe prever el procedimiento de **Desactivación Segura de Proveedores (_Offboarding_)** para el momento en que concluya o se rescinda un contrato:

:::steps

### 1. Corte de identidad y accesos técnicos

Revocar inmediatamente todas las cuentas de usuario asignadas al personal del proveedor, deshabilitar las cuentas de servicio asociadas a sus integraciones, anular los tokens `API` u `OAuth` concedidos y eliminar sus certificados o perfiles de VPN.

### 2. Cierre de flujos de datos y reglas de red

Eliminar de la Matriz de Flujos Autorizados y de la configuración de los cortafuegos cualquier excepción de puerto, túnel sitio a sitio o dirección `IP` autorizada que se hubiera habilitado para comunicarse con la infraestructura de ese proveedor.

### 3. Recuperación y sanitización de datos empresariales

Extraer una copia íntegra y verificada de todos los datos e históricos pertenecientes a la PyME que residan en la plataforma del proveedor, y exigir la confirmación de la eliminación segura de los datos empresariales remanentes en los servidores del tercero.
:::

### Herramientas representativas para entornos híbridos y remotos

Para materializar estos patrones de diseño cuando avancemos al módulo de implementación (`04. PROTECT`), el ecosistema tecnológico ofrece alternativas tanto de código abierto como gestionadas que se adaptan a distintos presupuestos operativos:

- **Soluciones de Conectividad Remota (`VPN` y `ZTNA`):**
  - _Código abierto:_ **`WireGuard`** es el protocolo moderno por excelencia: rápido, ligero y muy seguro. **`OpenVPN`** es la opción clásica y robusta, ideal si la PyME necesita integrarse con infraestructuras o directorios más antiguos.
  - _Acceso Zero Trust (Opciones con planes gratuitos):_ Soluciones como **`Tailscale`** (basado en `WireGuard`) o **`Cloudflare Zero Trust`** permiten a los empleados acceder a las aplicaciones internas de forma segura. Su gran ventaja arquitectónica es que exigen autenticación con MFA antes de conectar al usuario, sin necesidad de abrir ningún puerto en el cortafuegos de la oficina.
- **Soluciones de Gestión de Dispositivos (`MDM`):**
  - Para garantizar desde un panel central que los equipos remotos tengan el disco cifrado, se bloqueen por inactividad o puedan borrarse en caso de robo, se utilizan gestores corporativos. Si la empresa ya utiliza ecosistemas comerciales, las opciones naturales son **`Microsoft Intune`**, **`Google Endpoint Management`** o **`Apple Business Manager`**. Para entornos mixtos, existen alternativas como **`Fleet`**, que permite auditar continuamente sistemas Windows, macOS y Linux.

### Verificación del diseño de entornos híbridos y acceso remoto

Antes de someter toda nuestra arquitectura (redes, identidades y accesos híbridos) al modelado de amenazas en la sección `03.5`, debemos validar los entregables de este capítulo mediante tres comprobaciones de diseño:

:::steps

### 1. Verificación de exposición cero de servicios administrativos

Revisa tu Matriz de Flujos Autorizados para confirmar que se cumple la regla de oro de acceso externo:

- Verifica que ningún puerto de gestión técnica (`TCP 22` para `SSH`, `TCP/UDP 3389` para `RDP`, puertos de motores de bases de datos como `3306`, `5432` o `1433`, ni puertos web de consolas de hipervisores o routers) esté expuesto directamente hacia la Zona No Controlada (Internet).

### 2. Auditoría de la Matriz de Responsabilidad Compartida

Toma el inventario de plataformas en la nube (SaaS, PaaS, IaaS) y proveedores externos de la organización y comprueba que ninguna casilla de responsabilidad del cliente haya quedado huérfana:

- Para cada servicio en la nube, debe figurar con nombre y apellido quién dentro de la empresa es responsable de: (a) administrar las altas y bajas de usuarios y verificar que el MFA esté activo, (b) revisar las configuraciones de seguridad y privacidad de la plataforma, y (c) ejecutar y probar las copias de seguridad independientes de los datos alojados allí.

### 3. Validación de controles sobre dispositivos perdidos o proveedores desvinculados

Realiza dos preguntas de simulación operativa sobre tu diseño de acceso remoto:

- _"Si hoy a las 19:00 roban en la calle la computadora portátil o el teléfono móvil de un socio o gerente que tiene acceso a todo el sistema financiero, ¿qué impide en mi diseño que el ladrón lea los archivos del disco duro y qué procedimiento técnico ejecutamos en menos de 15 minutos para revocar sus sesiones y borrar los datos corporativos?"_ (Si la respuesta no incluye cifrado de disco previamente activo y capacidad de revocación/borrado, el diseño de endpoint remoto está incompleto).

- _"¿Qué proveedores externos tienen hoy credenciales válidas para entrar a nuestros servidores y cuál es la fecha exacta en que esas cuentas se bloquean solas si nadie las renueva?"_ (Toda cuenta de tercero en el plano debe ser nominal, requerir MFA y operar bajo activación temporal o caducidad programada).
  :::

## 3.5. Modelado de Amenazas <!-- id: modelado-amenazas, icon: ShieldAlertIcon -->

Un buen diseño en papel organiza la infraestructura: define subredes claras, establece zonas de confianza y estructura tablas de permisos coherentes. Sin embargo, el verdadero valor de una arquitectura se demuestra cuando la ponemos a prueba frente a la creatividad de un adversario real. Quienes buscan vulnerar un sistema no siguen el camino previsto en el diagrama. Exploran las intersecciones entre una zona y otra, aprovechan la confianza legítima entre servidores o combinan el factor humano con sutiles brechas lógicas que un escáner automatizado no está diseñado para detectar.

Por eso, antes de invertir presupuesto, adquirir licencias o dedicar semanas de trabajo técnico a la implementación en el Módulo 4, tenemos la oportunidad estratégica de validar nuestros planos mediante una simulación analítica. Esta disciplina es el **Modelado de Amenazas** (o _Threat Modeling_): un ejercicio de ingeniería que adopta la mirada del atacante para anticipar escenarios y descubrir puntos ciegos en la estructura. Su ventaja estratégica reside en que permite perfeccionar los controles preventivos, detectivos y correctivos en el momento exacto en que modificar el diseño resulta más ágil, inteligente y económico.

### Fundamentos y propósito del Modelado de Amenazas

> [!TIP]
> **Navegación rápida:** Esta sección cubre fundamentos, el Diagrama de Flujo de Datos (DFD), el proceso de 7 pasos, la metodología STRIDE, árboles de ataque con MITRE ATT&CK y un caso práctico completo. Si ya conoces los fundamentos de DFD y STRIDE, puedes saltar directamente al [caso práctico](#caso-práctico-modelado-stride-sobre-la-arquitectura-diseñada).

> [!IMPORTANT]
> **Entregable de esta sección — Informe de Modelado de Amenazas:** Al completar esta sección, deberás haber producido cuatro artefactos verificables: (1) un **DFD anotado** con Límites de Confianza marcados, (2) una **tabla de análisis STRIDE** sobre cada cruce de frontera crítico, (3) al menos un **Árbol de Ataque** para el escenario de mayor impacto, y (4) un **Registro de Riesgo Residual** con las amenazas aceptadas formalmente por la dirección.

En la gestión operativa de una pequeña o mediana empresa, suele confundirse la ejecución de un escaneo de vulnerabilidades con el modelado de amenazas. Aunque ambas actividades buscan reducir el riesgo, operan en momentos distintos y detectan problemas de naturaleza completamente diferente:

- **Escaneo de vulnerabilidades (Diagnóstico de implementación):** Como se abordó al cierre del Módulo 2, un escáner automatizado inspecciona sistemas que ya están instalados y funcionando para compararlos contra bases de datos de errores conocidos (como un servidor al que le falta un parche de seguridad o tiene una contraseña de fábrica). Un escáner puede confirmar si un programa está actualizado, pero es incapaz de comprender la lógica de negocio de la empresa.
- **Modelado de amenazas (Diagnóstico de arquitectura y diseño):** Es un análisis proactivo que evalúa cómo están conectados los componentes, cómo fluye la información y dónde se deposita la confianza antes de escribir código o configurar equipos. Por ejemplo, si una empresa diseña un portal web que consulta directamente la base de datos de nóminas sin exigir validación de permisos por rol, ningún escáner de parches marcará un error de versión; se trata de una **vulnerabilidad de diseño**, la cual suele ser mucho más grave y costosa de corregir si se descubre una vez que el sistema ya está en producción.

Para guiar este análisis sin perderse en teorías abstractas, la industria estructuró el proceso en torno a las **Cuatro Preguntas Centrales del Modelado de Amenazas** (formuladas originalmente por Adam Shostack y adoptadas por el Proyecto Abierto de Seguridad de Aplicaciones Web, OWASP):

:::group title="Las 4 preguntas fundamentales del Modelado de Amenazas"

- 1. ¿Qué estamos construyendo o diseñando? [alcance y topología]: Implica delimitar el sistema a evaluar, identificar los activos críticos involucrados y trazar cómo viajan los datos entre usuarios, aplicaciones, redes y proveedores externos.
- 2. ¿Qué puede salir mal? [identificación de amenazas]: Consiste en analizar el diagrama con mentalidad de atacante utilizando metodologías estructuradas y árboles de ataque para descubrir cómo podrían suplantar identidades, alterar datos o interrumpir la operación.
- 3. ¿Qué vamos a hacer al respecto? [tratamiento y controles]: Define qué medidas de seguridad concretas (preventivas, detectivas o correctivas) se agregarán al diseño para bloquear o mitigar cada amenaza identificada, o qué riesgos residuales serán aceptados formalmente.
- 4. ¿Hicimos un buen trabajo? [verificación y retroalimentación]: Valida que el modelo sea coherente, que no hayan quedado límites de confianza sin proteger y que los hallazgos hayan modificado efectivamente los planos arquitectónicos antes de pasar a la implementación.
     :::

### Diagrama de Flujo de Datos (DFD) como lienzo del modelado

El lienzo sobre el que se aplican las cuatro preguntas no es un diagrama de red convencional. Un diagrama de red muestra _dónde_ están los equipos; un **Diagrama de Flujo de Datos (DFD, _Data Flow Diagram_)** muestra _qué información viaja_, _entre quiénes_ y _en qué dirección_. Esta distinción es fundamental: el modelado de amenazas analiza la circulación de los datos, no la topología de los cables.

Un DFD orientado al modelado de amenazas se compone de cuatro elementos estándar:

| Elemento                                |       Símbolo convencional        | Qué representa en la arquitectura                                                                                                                                                                              |
| :-------------------------------------- | :-------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Proceso (_Process_)**                 |          Círculo u óvalo          | Un componente activo que recibe, transforma o envía datos: una aplicación web, un servidor de autenticación, un módulo de facturación o una tarea automatizada programada.                                     |
| **Almacén de datos (_Data Store_)**     | Dos líneas paralelas horizontales | Cualquier repositorio donde la información persiste en reposo: una base de datos relacional, un servidor de archivos, una tabla de configuración o un repositorio de registros (`logs`).                       |
| **Entidad externa (_External Entity_)** |            Rectángulo             | Actores fuera del control directo de la organización que interactúan con el sistema: un usuario final desde su navegador, un sistema de pago de terceros, una `API` de un proveedor o un administrador remoto. |
| **Flujo de datos (_Data Flow_)**        |  Flecha direccional con etiqueta  | El canal de comunicación entre dos elementos, indicando qué tipo de dato viaja (por ejemplo: `Credenciales de acceso`, `Registros de auditoría` o `Datos de factura`) y en qué dirección.                      |

_Elementos estándar de notación para construir un DFD orientado al Modelado de Amenazas._

<Diagrama title="Ejemplo de Diagrama de Flujo de Datos (DFD)" variant="dfd" caption="DFD genérico con los cuatro elementos estándar y dos Límites de Confianza diferenciados por nivel de privilegio: Límite 1 (Azul · Nivel Estándar) y Límite 2 (Rojo · Alto Privilegio)." />

Para construir el DFD de un proceso crítico de la organización de forma sistemática, sigue esta secuencia de cuatro etapas:

:::steps

### 1. Definir las Entidades Externas y el alcance del sistema

Coloca un rectángulo en los bordes del lienzo por cada actor que interactúa con el proceso pero está fuera del control directo de la empresa: el cliente web que envía un pedido, el proveedor de pasarela de pago, el técnico externo que da soporte remoto o el sistema de sincronización con la nube. Dibuja una caja punteada grande que encuadre todo lo que _sí_ controla la organización; esta caja exterior ya representa tu primer Límite de Confianza implícito.

### 2. Mapear los Procesos y Almacenes de datos internos

Dentro de la caja de alcance, coloca un óvalo por cada componente activo del flujo: el proxy inverso, el servidor de aplicaciones, el motor de autenticación, el módulo de facturación. Agrega las barras dobles de los almacenes de datos donde la información descansa: la base de datos de clientes, el repositorio de copias de seguridad y el colector central de registros.

### 3. Trazar los Flujos de Datos con etiquetas precisas

Conecta los elementos con flechas y etiqueta cada flecha describiendo _qué tipo de dato_ circula, no solo _entre qué componentes_. Escribir `«Consulta SQL»` o `«Token JWT de sesión»` en lugar de una flecha anónima es lo que le da al análisis su valor: una flecha sin etiqueta no puede clasificarse bajo STRIDE.

### 4. Superponer los Límites de Confianza

Una vez colocados todos los elementos y flujos, traza líneas punteadas (en color rojo en herramientas digitales) sobre el lienzo, rodeando los grupos de componentes que comparten el mismo nivel de privilegio o el mismo entorno de red. Cada flecha que cruce una de estas líneas punteadas es un punto que deberás analizar sistemáticamente con la metodología STRIDE (que se detalla más adelante en esta sección).

:::

> [!TIP]
> En lugar de intentar modelar toda la infraestructura de una sola vez, construye el DFD comenzando por el proceso de mayor riesgo identificado en el Módulo 2. Un único diagrama bien delimitado —por ejemplo, el flujo de facturación desde el portal web hasta la base de datos— produce hallazgos mucho más accionables que un mapa general y complejo donde ningún componente se analiza en profundidad.

### El proceso práctico en 7 pasos aplicado a una PyME

Realizar un modelado de amenazas no requiere semanas de burocracia ni el estudio de toda la empresa en simultáneo. Para que resulte accionable en el contexto de una organización pequeña, el ejercicio se enfoca sobre los procesos o flujos más sensibles del negocio siguiendo una secuencia ordenada de siete etapas:

:::steps

### 1. Definición del alcance y selección de activos críticos

En lugar de intentar modelar toda la infraestructura de una sola vez, selecciona un proceso comercial crítico o un segmento de alto riesgo diseñado en las secciones anteriores. Por ejemplo: el flujo de acceso remoto de los administradores hacia los servidores internos, el proceso de facturación y cobro en el portal web de clientes, o el flujo de extracción de copias de seguridad hacia la zona de resiliencia. Identifica qué activos y qué tipos de datos clasificados (restringidos o confidenciales) intervienen en ese alcance específico.

### 2. Identificación de los agentes de amenaza plausibles

Cataloga qué perfiles de atacantes o fuentes de fallo tienen motivación o capacidad real para afectar ese proceso. En una PyME, esto abarca cuatro frentes concretos:

- **Atacantes externos oportunistas o criminales organizados:** Grupos que escanean direcciones IP públicas de forma automatizada buscando desplegar programas de secuestro de datos (_ransomware_) o robar información personal identificable para extorsionar a la empresa.
- **Amenazas internas maliciosas o negligentes:** Empleados actuales, personal descontento en proceso de desvinculación o usuarios que cometen errores operativos involuntarios (como compartir una carpeta sensible o caer en un engaño de ingeniería social).
- **Proveedores externos y cadena de suministro:** Consultoras de soporte técnico, servicios de alojamiento o bibliotecas de software de terceros cuyas credenciales o conexiones con nuestra empresa puedan verse comprometidas.
- **Competencia desleal o actores dirigidos:** Terceros interesados en interrumpir la disponibilidad del servicio comercial o sustraer propiedad intelectual y carteras de clientes.

### 3. Caracterización del entorno y trazado de Límites de Confianza (_Trust Boundaries_)

Toma el DFD construido en la sección anterior e incorpora sobre él todas las entidades que interactúan con el alcance seleccionado. Dibuja líneas punteadas (habitualmente en color rojo) en cada punto donde los datos cambian de nivel de privilegio o cruzan de un entorno a otro: estos son los **Límites de Confianza** (_Trust Boundaries_). Existe un límite de confianza en cada uno de estos cruces típicos:

- Cuando el tráfico pasa de **Internet** a la **Zona Desmilitarizada (DMZ)**.
- Cuando el proxy inverso en la DMZ consulta al **servidor de base de datos** en la **Zona Restringida**.
- Cuando un **empleado remoto** ingresa a la red a través del concentrador de **Red Privada Virtual (VPN)**.
- Cuando una **aplicación local** envía datos hacia la interfaz de un **proveedor en la nube**.

### 4. Creación de Árboles de Ataque (_Attack Trees_)

Para comprender cómo un adversario intentaría vulnerar el activo principal de nuestro alcance, construye un **Árbol de Ataque**. Se trata de un diagrama jerárquico invertido donde el nodo superior (la raíz) representa la meta final del atacante (por ejemplo: _Cifrar o robar la base de datos de clientes y paralizar los respaldos_), y las ramas inferiores desglosan las distintas combinaciones de sub-tareas técnicas o humanas necesarias para lograrlo.

### 5. Identificación sistemática de amenazas en cada frontera

Recorre cada flecha de flujo de datos que atraviesa un Límite de Confianza en tu diagrama y aplica una metodología estructurada de preguntas (como el modelo **STRIDE**, que se detallará a continuación) para listar qué fallas de autenticación, integridad, trazabilidad, confidencialidad, disponibilidad o autorización podrían ocurrir en ese cruce exacto.

### 6. Análisis de brechas y tratamiento del riesgo

Contrasta cada amenaza descubierta en el árbol y en el análisis sistemático contra los controles que habías proyectado en las secciones anteriores. Si descubres una ruta de ataque donde no existe ningún control preventivo que la detenga ni ningún control detectivo que emita una alerta, has encontrado una **brecha arquitectónica**. En ese punto debes elegir una de las cuatro estrategias de tratamiento del riesgo:

- **Mitigar:** Rediseñar el flujo o agregar un control específico que reduzca la probabilidad o el impacto de la amenaza.
- **Evitar:** Eliminar la funcionalidad o cerrar el servicio expuesto que genera la amenaza.
- **Transferir:** Delegar el procesamiento crítico a un tercero especializado o cubrir el impacto financiero mediante seguros.
- **Aceptar:** Documentar el riesgo residual con aprobación expresa de la dirección cuando el costo del control supera el daño potencial.

### 7. Documentación y retroalimentación del diseño

El modelado de amenazas solo tiene valor si modifica la realidad de la arquitectura. Toda corrección decidida en el paso anterior debe trasladarse de inmediato a los entregables maestros del módulo: agregar la regla faltante en la Matriz de Flujos de Red (sección `3.2`), restringir el permiso excesivo en la Matriz de Control de Acceso Basado en Roles (sección `3.3`) o sumar el requisito de dispositivo en el diseño de acceso remoto (sección `3.4`).
:::

### Metodologías estándar: STRIDE y marcos complementarios

Cuando un equipo técnico observa un diagrama de red y se pregunta de forma abierta _"¿cómo nos podrían atacar?"_, suele bloquearse o pensar únicamente en el tipo de ataque que el equipo leyó recientemente en las noticias. Las metodologías de modelado existen para evitar esa ceguera, proporcionando una lista de verificación sistemática que garantiza cubrir todas las dimensiones de seguridad.

#### Aplicación profunda del modelo STRIDE

Desarrollada originalmente en Microsoft y ampliamente adoptada por OWASP por su claridad didáctica y rigor técnico, la metodología **STRIDE** clasifica las amenazas en seis categorías cuyas iniciales en inglés forman el acrónimo. Su gran fortaleza arquitectónica reside en que cada amenaza representa exactamente la violación de una propiedad específica de seguridad de la información, indicando de inmediato qué familia de control se necesita para contrarrestarla:

| Categoría STRIDE               | Significado en Español     | Propiedad violada             | Qué pregunta hacer frente al diagrama                                                                                                                                                                                          | Controles arquitectónicos de mitigación típicos                                                                                                                                                                                                    |
| :----------------------------- | :------------------------- | :---------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **S — Spoofing**               | Suplantación de identidad  | **Autenticación**             | ¿Puede un atacante, un equipo no autorizado o un sitio falso fingir ser un usuario legítimo, un servidor interno o un proveedor de confianza en este flujo?                                                                    | Autenticación Multifactor (MFA) resistente a phishing, certificados digitales (TLS mutuo o infraestructura de clave pública), validación de correo (SPF, DKIM, DMARC) y prohibición de protocolos sin validación.                                  |
| **T — Tampering**              | Manipulación de datos      | **Integridad**                | ¿Puede alguien interceptar y modificar los paquetes que viajan por este enlace, alterar registros de la base de datos, inyectar código o modificar archivos de configuración o respaldos sin permiso?                          | Cifrado y verificación de integridad en tránsito (TLS, IPsec, SSH), funciones hash criptográficas (`sha256sum`), firmas digitales en código y scripts, listas de control de acceso estrictas, consultas SQL parametrizadas y respaldos inmutables. |
| **R — Repudiation**            | Repudio                    | **No repudio y Trazabilidad** | Si un usuario, administrador o proceso realiza una acción fraudulenta o destructiva en este punto, ¿podría negar haberlo hecho porque no queda evidencia confiable o porque puede borrar sus huellas?                          | Eliminación total de cuentas compartidas, registro detallado de eventos de auditoría con marcas de tiempo sincronizadas (NTP) y envío inmediato a un servidor colector centralizado fuera del alcance del usuario.                                 |
| **I — Information Disclosure** | Divulgación de información | **Confidencialidad**          | ¿Puede una persona no autorizada leer datos sensibles mientras viajan por la red (rastreo de paquetes), acceder a carpetas o tablas de otros sectores, o extraer secretos desde mensajes de error detallados o discos robados? | Cifrado de datos en tránsito y en reposo (AES-256 en discos y bases de datos), segmentación de red, principio de privilegio mínimo en la matriz de roles y desactivación de mensajes de depuración en producción.                                  |
| **D — Denial of Service**      | Denegación de servicio     | **Disponibilidad**            | ¿Puede un atacante externo o un fallo interno agotar el ancho de banda, la memoria, el procesador o el espacio en disco de este componente para dejar inoperativa a la empresa?                                                | Cortafuegos perimetrales con limitación de tasa de conexiones (_rate limiting_), proxies inversos o redes de distribución de contenido, cuotas de almacenamiento para registros, redundancia eléctrica y copias de seguridad probadas.             |
| **E — Elevation of Privilege** | Elevación de privilegios   | **Autorización**              | ¿Puede un usuario con una cuenta estándar o un atacante que comprometió un servicio web básico saltar las restricciones para ejecutar comandos como administrador (`root` o `SYSTEM`) o acceder a la red de gestión?           | Separación de cuentas cotidianas y administrativas, validación y saneamiento estricto de entradas de usuario en aplicaciones, ejecución de servicios con cuentas de mínimo privilegio y segmentación de la red administrativa.                     |

_Matriz de análisis STRIDE vinculando cada categoría de amenaza con la propiedad afectada y su respuesta arquitectónica._

Aunque `STRIDE` es el punto de partida más directo y efectivo para evaluar la arquitectura técnica de una organización, existen otros marcos reconocidos en la industria que resultan útiles en escenarios específicos donde el enfoque debe ser distinto:

- **PASTA (_Process for Attack Simulation and Threat Analysis_):** Es un marco de 7 etapas centrado explícitamente en el riesgo comercial y el impacto en el negocio. A diferencia de STRIDE, que parte de los componentes técnicos, PASTA comienza definiendo los objetivos estratégicos de la empresa e integra inteligencia de amenazas activas para simular ataques viables en función del contexto real de la organización.
  - _Cuándo aporta a la empresa:_ Útil si necesitas justificar cada inversión de seguridad directamente ante la junta directiva en términos de pérdidas financieras e impacto en la misión comercial. A menudo la gerencia de una organización no llega a comprender el riesgo técnico si no es explicado en términos de dinero. (Más información en la [guía de PASTA en OWASP](https://owasp.org/www-community/Threat_Modeling_Process)).

- **Trike:** Es una metodología de código abierto enfocada en la auditoría de seguridad desde una perspectiva defensiva centrada en la gestión de permisos y control de acceso.
  - _Cuándo aporta a la empresa:_ Resulta valiosa si el núcleo del problema de la PyME es un sistema con matrices complejas de privilegios y operaciones críticas de bases de datos donde se necesita asegurar estrictamente el acceso a la información. (Repositorio y recursos en la [documentación de Trike](https://owasp.org/www-community/Threat_Modeling)).
- **VAST (_Visual, Agile, and Simple Threat modeling_):** Está diseñado para organizaciones con múltiples equipos de desarrollo ágil (_DevOps_), separa el modelado en dos vistas: aplicaciones (para desarrolladores) y operaciones (para infraestructura).
  - _Cuándo aporta a la PyME:_ No suele ser necesario para empresas tradicionales, pero es altamente aplicable si la empresa desarrolla su propio software y necesita integrar el modelado de amenazas de forma automatizada en sus ciclos de entrega continua. (Detalles en el sitio oficial de [ThreatModeler / VAST](https://threatmodeler.com/)).

- **LINDDUN:** Marco especializado en privacidad y protección de datos personales (_Linkability, Identifiability, Non-repudiation, Detectability, Disclosure of information, Unawareness, Non-compliance_).
  - _Cuándo aporta a la empresa:_ Esencial si la PyME recopila datos personales regulados (como clientes de la Unión Europea bajo RGPD o normativas locales de datos) y necesita modelar riesgos de filtración, perfilado no autorizado o incumplimiento de privacidad más allá de los ataques puramente técnicos. (Detalles en el sitio oficial de [LINDDUN](https://linddun.org/)).

> [!NOTE: No acumular metodologías innecesarias]
> En una PyME no se obtiene mayor seguridad aplicando cuatro marcos distintos sobre el mismo diagrama. La combinación de un **Árbol de Ataque** (para pensar el recorrido completo de un adversario) junto con una tabla **STRIDE** en los límites de confianza críticos cubre con creces las necesidades de validación arquitectónica sin generar parálisis por análisis. Los marcos extra propuestos en este índice son opcionales y utilizables en casos puntuales.

### Uso práctico de MITRE ATT&CK para armar un Árbol de Ataque

La metodología STRIDE responde a la pregunta _«¿qué tipo de amenaza puede ocurrir aquí?»_, pero no detalla _cómo_ la ejecutaría un adversario en la práctica. Para cerrar esa brecha y evitar imaginar escenarios poco realistas o de ciencia ficción, podemos estructurar un árbol de ataque apoyándonos en la base de conocimientos pública de [MITRE ATT&CK](https://attack.mitre.org/). Este marco internacional cataloga las Tácticas, Técnicas y Procedimientos (TTP) observadas en miles de incidentes documentados alrededor del mundo. Combinando ambos marcos, STRIDE identifica **dónde buscar** y ATT&CK muestra **qué encontrar**: juntos transforman la teoría en un mapa de acciones verificables.

Un árbol de ataque es simplemente un mapa paso a paso que conecta una meta maliciosa con las acciones necesarias para alcanzarla. Su propósito es comprobar si las capas diseñadas en las secciones anteriores cortan el camino del atacante antes de que logre su objetivo.

:::steps

### 1. Define el objetivo final (La Raíz)

Establece el peor escenario realista para las operaciones de tu empresa. Por ejemplo: _"Paralizar las operaciones mediante ransomware y destruir las copias de seguridad"_ o _"Exfiltración masiva de datos personales de clientes y propiedad intelectual"_.

### 2. Desglosa los pasos encadenados del atacante

Divide el recorrido del adversario en tres fases lógicas sencillas y asígnale los códigos de referencia de MITRE ATT&CK:

- **Acceso Inicial:** ¿Cómo ingresaría el atacante? (Ej. mediante un correo de _phishing_ con un enlace o archivo malicioso, técnica [Phishing - T1566](https://attack.mitre.org/techniques/T1566/)).
- **Movimiento Lateral:** ¿Cómo se propagaría hacia los servidores internos? (Ej. utilizando cuentas válidas o protocolos de acceso remoto, técnica [Remote Services - T1021](https://attack.mitre.org/techniques/T1021/)).
- **Impacto Final:** ¿Cómo buscaría asegurar el daño económico? (Ej. inhibiendo la recuperación del sistema al borrar o cifrar los respaldos, técnica [Inhibit System Recovery - T1490](https://attack.mitre.org/techniques/T1490/)).

### 3. Contrasta cada paso contra tus capas de diseño

Revisa tus planos arquitectónicos para verificar qué barrera frena cada eslabón de la cadena:

- Si el paso de acceso inicial se enfrenta a una política que exige Autenticación Multifactor, el robo de credenciales pierde su efecto.
- Si la segmentación de red diseñada en la sección `3.2` impide que las computadoras de los usuarios se conecten libremente con la zona de servidores, el movimiento lateral se detiene.
- Si las copias de seguridad de la sección `3.1` están aisladas en un modelo unidireccional, el intento de destruir los respaldos fracasa por completo.
  :::

Al visualizarlo de esta forma, el valor del diseño en capas se vuelve evidente: para que un ataque triunfe, el adversario necesita superar **todos** los eslabones de la cadena; para detenerlo, a la arquitectura le basta con bloquear con éxito al menos uno de ellos **en cada cadena de ataque plausible**. Esto no garantiza invulnerabilidad —siempre pueden existir cadenas que no se han mapeado—, pero reduce drásticamente la superficie de ataque real.

### Caso práctico: Modelado STRIDE sobre la arquitectura diseñada

Para ilustrar cómo se documenta el entregable de esta sección en una empresa real, tomemos el flujo más sensible de la arquitectura proyectada: **la interacción entre Clientes Externos, Empleados Remotos, la aplicación comercial e infraestructura de datos y respaldos**.

Al examinar los cruces de frontera en nuestro diagrama preliminar, realizamos el análisis STRIDE y descubrimos **cuatro brechas de diseño** que habían pasado desapercibidas al redactar las secciones anteriores:

:::group title="TM-01 — Suplantación de sesión en acceso al ERP"

- **Cruce evaluado:** Zona Usuarios (`VLAN 20`) → Zona Restringida (`VLAN 30` — Servidor ERP)
- **Categoría STRIDE:** **S** (_Spoofing_) / **E** (_Elevation of Privilege_) · Táctica ATT&CK: _Valid Accounts_ (`T1078`)
- **Escenario detectado:** Un atacante compromete la sesión activa de un empleado comercial mediante un robo de cookies en su navegador (_session hijacking_) y accede al sistema interno sin conocer la contraseña ni el segundo factor.
- **¿Cubierto en diseño inicial?** **Parcialmente** — Se había diseñado MFA al inicio, pero sin políticas de sesión.
- **Corrección obligatoria (Actualizar `03.3` y `03.4`):** Incorporar expiración corta de tokens de sesión, reautenticación obligatoria para acciones sensibles (exportación masiva de datos) y vinculación de la sesión a la dirección IP interna o túnel VPN.
  :::

:::group title="TM-02 — Inyección SQL desde la DMZ hacia la base de datos"

- **Cruce evaluado:** `DMZ` (`VLAN 10` — Proxy Inverso) → Zona Restringida (`VLAN 30` — Base de Datos)
- **Categoría STRIDE:** **T** (_Tampering_) / **I** (_Information Disclosure_) · Táctica ATT&CK: _Exploit Public-Facing App_ (`T1190`)
- **Escenario detectado:** En la Matriz de Flujos `03.2` (Flujo `F-02`), el servidor web consultaba a la base de datos en el puerto `5432`. Si el aplicativo usa una única cuenta de servicio con permisos de administrador sobre toda la base de datos, una inyección SQL permitiría borrar todas las tablas o leer datos de otros módulos.
- **¿Cubierto en diseño inicial?** **No (Brecha detectada).**
- **Corrección obligatoria (Actualizar `03.1` y `03.3`):** Diseñar dos cuentas de servicio separadas en la base de datos: la cuenta del portal público solo tendrá permisos `SELECT`/`INSERT` sobre las tablas de pedidos web, prohibiendo comandos `DROP`/`ALTER` y bloqueando la lectura de tablas financieras o de recursos humanos.
  :::

:::group title="TM-03 — Inundación del colector de registros"

- **Cruce evaluado:** Todos los segmentos (`VLAN 10/20/30`) → Zona Resiliencia (`VLAN 40` — Colector de Logs)
- **Categoría STRIDE:** **R** (_Repudiation_) / **D** (_Denial of Service_) · Táctica ATT&CK: _Impair Defenses_ (`T1562`)
- **Escenario detectado:** Si un servidor en la `DMZ` es comprometido, el atacante podría enviar millones de eventos falsos por segundo hacia el puerto `6514` del colector de registros (Flujo `F-09`) hasta llenar su disco duro, dejando a la empresa ciega ante el resto del ataque.
- **¿Cubierto en diseño inicial?** **No (Brecha detectada).**
- **Corrección obligatoria (Actualizar `03.1` y `03.2`):** Agregar en el diseño del colector de registros cuotas máximas de ingesta por host de origen (_rate limiting_ de logs), rotación con alerta al llegar al 80% de disco (`CIS 8.3`) y autenticación mutua por certificado para que solo hosts registrados puedan escribir eventos.
  :::

:::group title="TM-04 — Acceso lateral del proveedor externo vía VPN"

- **Cruce evaluado:** Proveedor Externo de Soporte → Túnel VPN → Zona Restringida (`VLAN 30`)
- **Categoría STRIDE:** **E** (_Elevation of Privilege_) / **T** (_Tampering_) · Táctica ATT&CK: _External Remote Services_ (`T1133`)
- **Escenario detectado:** Cuando el proveedor contable externo se conecta por VPN para diagnosticar un fallo, si el túnel le asigna una dirección IP dentro del mismo grupo que los administradores de TI (`VLAN 50`), podría conectarse por el puerto `22` a otros servidores que no le corresponden.
- **¿Cubierto en diseño inicial?** **No (Brecha detectada).**
- **Corrección obligatoria (Actualizar `03.2` y `03.4`):** Crear un grupo de direcciones de VPN exclusivo para proveedores externos cuyas reglas de cortafuegos solo permitan alcanzar la dirección IP y puerto exactos del servidor contable asignado, y únicamente cuando su cuenta temporal sea habilitada bajo demanda.
  :::

_Modelado de Amenazas aplicando STRIDE y MITRE ATT&CK para descubrir y corregir brechas en el diseño previo._

> [!WARNING: Documentación transparente del Riesgo Residual]
> Ninguna arquitectura reduce el riesgo a cero. Por ejemplo, tras aplicar todas las correcciones de la tabla anterior, aún existe el **riesgo residual** de que un administrador de TI con acceso legítimo a la consola física del hipervisor decida sabotear intencionalmente los servidores locales. Si la PyME no cuenta con presupuesto ni personal para exigir que dos administradores distintos introduzcan sus llaves físicas al mismo tiempo para abrir el gabinete (control de doble custodia), ese riesgo residual no se oculta: se registra explícitamente en la tabla indicando que se mitiga parcialmente mediante alertas de inicio de sesión enviadas a la gerencia y copias de seguridad en la nube bajo una cuenta custodiada por el director de la empresa.

### Herramientas representativas para el Modelado de Amenazas

El valor del modelado reside en el razonamiento crítico del equipo sobre el diagrama, no en la sofisticación del software utilizado. Según la preferencia operativa de la organización, existen dos caminos prácticos para generar y mantener estos artefactos:

1. **Enfoque ligero integrado en la documentación (Recomendado para PyMEs en nivel `IG1`/`IG2`):**

- En lugar de aprender a usar un programa nuevo desde cero, se reutiliza el mismo diagrama topológico y de flujos de datos creado en `Draw.io` (`diagrams.net`) o `Excalidraw` durante las secciones `03.2` y `03.4`. Ambas herramientas soportan la notación estándar de DFD: los óvalos y rectángulos para procesos y entidades, las barras dobles para almacenes de datos y las flechas etiquetadas para flujos, tal como se describió en la etapa 3 de la construcción del DFD (_Trazar los Flujos de Datos con etiquetas precisas_).

- Sobre una copia o capa adicional de ese diagrama, se trazan las cajas o líneas punteadas rojas numeradas (`TB-01`, `TB-02`, `TB-03`) para representar cada **Límite de Confianza**, y se mantiene la tabla de análisis STRIDE y el árbol de ataque en un archivo Markdown o planilla de cálculo versionada junto a la documentación de la red.

2. **Herramientas específicas y gratuitas de Modelado de Amenazas:**

- **`OWASP Threat Dragon`:** Es una herramienta gratuita y de código abierto (disponible como aplicación web o de escritorio para Linux, macOS y Windows). Incorpora de forma nativa los cuatro elementos del DFD —Procesos, Almacenes de Datos, Entidades Externas y Flujos— junto con una paleta dedicada para marcar los Límites de Confianza. Una vez dibujado el DFD, la herramienta analiza automáticamente cada componente y sugiere amenazas organizadas bajo el marco STRIDE, guardando todo el modelo en archivos de texto estructurado (`JSON`) que pueden versionarse en un repositorio `Git`.

- **`Microsoft Threat Modeling Tool`:** Aplicación gratuita para sistemas Windows que permite diagramar arquitecturas locales o en la nube usando plantillas predefinidas para entornos `Azure` o servidores genéricos. Genera automáticamente una lista de amenazas potenciales basadas en STRIDE a partir de los elementos y conectores dibujados en el lienzo, reduciendo el tiempo necesario para completar el análisis por primera vez.

### Verificación del Modelado de Amenazas

Antes de dar por cerrado el diseño técnico, el modelo de amenazas debe superar tres comprobaciones de calidad documental, trazabilidad y ciclo de vida:

:::steps

### 1. Auditoría de cobertura de Límites de Confianza (Cruces de frontera)

Observa tu Diagrama de Flujo de Datos con los Límites de Confianza marcados y verifica cada flecha que cruza una línea roja punteada:

- **Validación de extremo a extremo:** Ningún flujo que transporte datos clasificados como _Restringidos_ o _Confidenciales_ puede cruzar un límite de confianza desde o hacia una zona de menor seguridad sin tener documentado en la tabla cómo se resuelve su autenticación (**S**), cómo se protege su integridad y confidencialidad en tránsito (**T** / **I**) y dónde se registra el evento (**R**).
- **Verificación del camino de respaldos y registros:** Confirma que el límite de confianza que rodea a la Zona de Resiliencia (`VLAN 40`) haya sido evaluado específicamente contra las amenazas de Manipulación (**T**), Denegación de Servicio (**D**) y Elevación de Privilegios (**E**), garantizando que el árbol de ataque de _ransomware_ quede truncado antes de alcanzar las copias de recuperación.

### 2. Verificación de retroalimentación efectiva (Cierre del circuito de diseño)

Un informe de modelado de amenazas que encuentra brechas pero deja los planos anteriores intactos es un ejercicio inútil. Revisa cada entrada de tu análisis STRIDE donde el estado de cobertura inicial haya sido registrado como **"No"** o **"Parcialmente"**:

- Comprueba que por cada una de esas filas exista una modificación real y verificable aplicada en la versión final de tu **Matriz de Flujos Autorizados (`03.2`)**, en tu **Matriz RBAC (`03.3`)** o en tu **Arquitectura de Acceso Remoto (`03.4`)**.
- Verifica que todo riesgo que se haya decidido no mitigar técnicamente por limitaciones presupuestarias u operativas cuente con su entrada correspondiente en el **Registro de Riesgo Residual**, especificando qué control compensatorio o detectivo amortiguará su impacto y quién dentro de la dirección de la PyME aprueba esa condición.

### 3. Definición de disparadores de actualización del modelo (Ciclo de vida)

El modelado de amenazas no es una foto estática ni un trámite de una sola vez. Establece formalmente en la gobernanza de TI qué eventos obligan a reabrir y actualizar este artefacto:

- **Cambios arquitectónicos mayores:** Incorporación de un nuevo proveedor en la nube (SaaS/IaaS), migración de base de datos o apertura de nuevos puertos/servicios hacia Internet.
- **Modificación en el flujo de datos sensibles:** Tratamiento de nuevos tipos de datos regulados, bancarios o de nómina.
- **Incidentes o cuasi-incidentes de seguridad:** Tras cualquier intento de intrusión o anomalía, se debe contrastar el evento contra el modelo para determinar qué límite de confianza o hipótesis falló.
- **Revisión periódica anual:** Como mínimo una revalidación formal al año, coordinada con la actualización del inventario del Módulo 2.
  :::

## 3.6. Planear la transición <!-- id: planificacion-transicion, icon: ToolsIcon -->

Llegar a este punto significa que la organización ya dejó atrás la incertidumbre: ahora conoce sus activos y cuenta con un diseño defensivo sólido para protegerlos. El siguiente gran paso es llevar esa visión a la práctica de forma inteligente.

Esta sección convierte todas las decisiones de red, identidad y acceso en un plan de acción realista y listo para ejecutarse. Su objetivo es conectar directamente con el Módulo 4 (Proteger) mediante una estrategia escalonada: definirás qué controles activar hoy mismo para neutralizar los riesgos más urgentes con el menor esfuerzo, qué secuencia técnica seguir para que cada cambio se apoye en el anterior y cómo asegurar que cada avance sea verificable, predecible y seguro para el negocio.

### Del Perfil Actual al Perfil Objetivo: El Análisis de Brechas

Para saber qué camino recorrer, primero es necesario contrastar el punto de partida con el destino diseñado. Los marcos de gestión de riesgos estandarizan este ejercicio mediante la comparación de dos fotografías organizacionales conocidas como Perfiles:

:::group title="Análisis de Brechas (_Gap Analysis_)"

- Perfil Actual (_Current Profile_) [punto de partida]: Representa el estado real de la infraestructura tal como fue descubierto y documentado al cierre del Módulo 2. Incluye las redes planas existentes, los permisos acumulados, los activos sin soporte y las vulnerabilidades activas.
- Perfil Objetivo (_Target Profile_) [meta de diseño]: Representa la arquitectura deseada que acabamos de construir entre las secciones `3.1` y `3.5` (zonas de red segmentadas, matriz de roles, acceso remoto seguro y controles validados frente a amenazas).
- Brecha (Gap) [trabajo por realizar]: Es la diferencia exacta entre el estado actual y el objetivo. Cada brecha identificada se convierte en una tarea concreta o proyecto técnico dentro de nuestra hoja de ruta.
  :::

Al evaluar esas brechas, el diseño debe pasar por un filtro de realismo operativo. Si una PyME se encuentra hoy en un nivel inicial de madurez (donde las prácticas son informales o reactivas) y pretende saltar en un solo mes a una arquitectura de seguridad extremadamente compleja, el proyecto fracasará por falta de presupuesto y agotamiento del personal técnico. La hoja de ruta debe escalonar el avance asegurando primero los cimientos de higiene cibernética esencial (IG1).

### Criterios de priorización: Las 3 olas de implementación

No todas las brechas de seguridad tienen la misma urgencia ni exigen el mismo esfuerzo. Para evitar la parálisis por análisis, las tareas pendientes se ordenan cruzando dos variables: cuánto riesgo real reduce la medida frente a cuánta fricción operativa, tiempo o presupuesto demanda su ejecución.

Para tomar decisiones rápidas al organizar las tareas y definir qué priorizar, aplica esta regla de ponderación operativa:

- **Alto Impacto + Baja Fricción = Ola 1 (Quick Win):** Actívalo de inmediato.
- **Alto Impacto + Alta Fricción = Ola 2 (Proyecto Estructural):** Planifícalo con ventanas de mantenimiento.
- **Bajo Impacto + Alta Fricción = Ola 3 o Descartar:** Postérgalo a largo plazo o deséchalo si no aporta valor defensivo real.

A partir de ese cruce, la transición se divide en tres horizontes u olas progresivas. Este enfoque garantiza que la organización reduzca drásticamente su exposición desde las primeras semanas:

| Horizonte                                                                                         | Enfoque arquitectónico                                                                                              | Acciones típicas incluidas                                                                                                                                                                                                                                                                                                                                          | Impacto en riesgo vs. Esfuerzo                                                                                          |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| **Ola 1: Cimientos** _(Semanas 1 a 4 — Base esencial)_                                            | Contener los riesgos críticos inmediatos que podrían destruir la continuidad del negocio con baja fricción técnica. | Aislar y automatizar copias de seguridad críticas; activar Autenticación Multifactor (MFA) en correo, accesos remotos y cuentas administrativas; deshabilitar cuentas huérfanas o de exempleados; cerrar puertos administrativos expuestos directamente a Internet y aplicar parches críticos.                                                                      | **Impacto Muy Alto / Esfuerzo Bajo a Moderado.** Resuelve hasta el 80% de los vectores de ataques oportunistas comunes. |
| **Ola 2: Estructuración y Control** _(Meses 2 a 3 — Consolidación)_                               | Implementar las barreras estructurales diseñadas en las matrices de red e identidad.                                | Configurar las Redes de Área Local Virtuales (VLAN) y la Zona Desmilitarizada (DMZ) en conmutadores y firewalls; aplicar la matriz de Control de Acceso Basado en Roles (RBAC) en carpetas y sistemas; separar cuentas de administrador de las de uso diario; desplegar la Red Privada Virtual (VPN) o proxy inverso y centralizar la recolección básica de _logs_. | **Impacto Alto / Esfuerzo Moderado a Alto.** Requiere ventanas de mantenimiento planificadas y pruebas con usuarios.    |
| **Ola 3: Madurez y Optimización** _(Meses 4 a 6+ — Mejora continua)_                              | Endurecer configuraciones avanzadas, automatizar defensas y afinar la detección.                                    | Aplicar plantillas completas de configuración segura (imágenes base) en todos los puestos; implementar listas blancas de ejecución de software; ajustar umbrales finos de alertas de seguridad; formalizar auditorías de proveedores externos y ejercicios periódicos de simulación de incidentes.                                                                  | **Impacto Moderado a Alto / Esfuerzo Alto.** Sostiene la postura defensiva a largo plazo frente a amenazas dirigidas.   |
| _Plan de transición en tres olas progresivas según retorno de seguridad y complejidad operativa._ |                                                                                                                     |                                                                                                                                                                                                                                                                                                                                                                     |                                                                                                                         |

> [!TIP:Prioriza siempre la capacidad de recuperación antes de tocar la producción]
> La primera tarea de la Ola 1 debe ser invariablemente asegurar y probar una copia de seguridad aislada de los servidores y configuraciones actuales. Esto no solo protege a la empresa contra un ataque de secuestro de datos hoy mismo, sino que actúa como un salvavidas de seguridad técnica en caso de que se cometa un error humano al reconfigurar redes o permisos en las etapas siguientes.

### Secuencia lógica y mapeo de dependencias técnicas

En ingeniería de sistemas, el orden de los factores altera por completo el resultado. Muchas tareas de seguridad dependen técnicamente de que otra condición previa ya esté funcionando. Si se ignora esta secuencia lógica en la hoja de ruta, el propio equipo técnico provocará una denegación de servicio interna contra su propia empresa.

Antes de ordenar las fechas del plan, verifica que tu secuencia respete estas cuatro reglas de dependencia técnica:

1. **Visibilidad y cuentas de servicio antes de revocar permisos o cambiar contraseñas:** No se deben revocar permisos masivos en carpetas compartidas ni rotar contraseñas de cuentas antiguas sin haber identificado primero qué procesos automatizados, scripts o sistemas de facturación utilizan esas credenciales como cuentas de servicio (mapeadas en la sección 03.3). Hacerlo a ciegas detendrá las integraciones entre aplicaciones y bases de datos.
2. **Enrutamiento y servicios base antes de activar el bloqueo por defecto en la red:** Al implementar la segmentación diseñada en la sección 03.2, primero se deben crear las subredes, verificar que el servicio de asignación dinámica de direcciones (en los puertos `UDP 67` y `UDP 68`) y la resolución de nombres (en el puerto `UDP 53`) respondan correctamente en cada nueva zona, y cargar las reglas que permiten el tráfico legítimo. Recién cuando se ha comprobado en los registros del firewall que el tráfico operativo fluye por las reglas permitidas, se activa la regla final de denegación por defecto (`DROP ALL`).
3. **Canal alternativo verificado antes de cerrar puertos de administración remota:** Nunca se debe bloquear en el firewall el puerto de consola remota (como `TCP 22` o `TCP 3389`) ni deshabilitar el acceso del usuario `root` en `/etc/ssh/sshd_config` sin haber probado antes, en una segunda ventana de terminal simultánea, que la nueva cuenta administrativa dedicada puede iniciar sesión a través del túnel privado y elevar privilegios con `sudo`.
4. **Sincronización horaria antes de centralizar registros:** Antes de conectar los servidores al colector central de eventos, es requisito configurar la sincronización de relojes mediante el protocolo de tiempo en el puerto `UDP 123`. De lo contrario, los eventos entrantes se almacenarán con marcas de tiempo desfasadas, inutilizando las alertas por correlación.

### Gestión del cambio y protección de la continuidad operativa

La resistencia de los usuarios y directivos hacia las medidas de ciberseguridad rara vez nace de un rechazo a estar protegidos; surge cuando los controles se imponen por sorpresa a mitad de la jornada laboral, impidiendo trabajar. Para que la transición hacia el Módulo 4 sea fluida, cada cambio estructural debe ejecutarse bajo tres normas de gestión del cambio:

#### 1. Comunicación previa y ventanas de mantenimiento

Ningún cambio con potencial de interrumpir la conectividad o el inicio de sesión debe ejecutarse en horario pico comercial. Las modificaciones de red o de directorio deben programarse en **ventanas de mantenimiento** acordadas (por ejemplo, fuera del horario de atención o durante el fin de semana), notificando previamente a los usuarios qué cambiará, cuándo ocurrirá y a quién contactar si encuentran un inconveniente al día siguiente.

#### 2. Despliegue mediante grupos piloto

Cuando se implementa un control que modifica la experiencia diaria del personal —como exigir Autenticación Multifactor, aplicar restricciones de navegador o mover computadoras a una nueva subred restringida—, nunca se despliega a toda la empresa de una sola vez. Se selecciona un **grupo piloto** reducido (de 2 a 5 usuarios representativos de distintas áreas) durante unos días. Esto permite descubrir aplicaciones internas que fallan o permisos faltantes en la matriz con un impacto controlado antes de extender la medida al resto de la organización.

#### 3. El Plan de Reversión (_Rollback Plan_)

Todo ingeniero debe asumir que una configuración puede fallar en el mundo real. Por ello, ninguna tarea de impacto medio o alto puede entrar al Módulo 4 sin tener redactado su **Plan de Reversión (_Rollback_)**: el procedimiento exacto para deshacer el cambio y devolver el sistema a su estado funcional anterior dentro de la misma ventana de mantenimiento.

:::steps

### 1. Respaldo previo de la configuración (Snapshot)

Minutos antes de aplicar el cambio en el módulo siguiente, se guarda una copia exacta del archivo de configuración original o una instantánea de la máquina virtual. Por ejemplo, antes de editar las reglas de red o el servicio de acceso remoto en un servidor Linux:

```bash:terminal
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.bak

```

Esto garantiza tener un archivo idéntico y funcional listo para restaurar en segundos.

### 2. Definición del disparador y tiempo límite (Go / No-Go)

Se establece de antemano qué síntoma indica que el cambio falló (por ejemplo, que el sistema de facturación no conecte con la base de datos) y se fija un **tiempo máximo de resolución** (por ejemplo, 20 minutos antes de que termine la ventana de mantenimiento). Si cumplido ese minuto el problema no se ha resuelto, queda prohibido seguir improvisando: se ejecuta obligatoriamente la reversión.

### 3. Ejecución de los pasos de vuelta atrás y prueba segura

Se aplican las instrucciones documentadas para restaurar la configuración previa (por ejemplo, restaurar el archivo de respaldo ejecutando `sudo cp /etc/ssh/sshd_config.bak /etc/ssh/sshd_config && sudo systemctl restart sshd`) y se verifica que la operación normal se haya restablecido. El fallo se analiza con calma al día siguiente para corregir el diseño antes de volver a intentarlo.

> [!WARNING:Consejo de oro de administración]
> **Jamás cierres la sesión actual de la terminal** desde la cual estás realizando el cambio hasta haber abierto una segunda ventana y verificado con éxito que la nueva configuración responde y permite el acceso. Si te quedas fuera en la primera sesión y ya la cerraste, el rollback será mucho más complejo.
> :::

### Criterios de Aceptación: La definición de "Terminado"

Una tarea de la hoja de ruta no se marca como completada cuando se termina de instalar un programa, sino cuando se obtiene la **evidencia técnica verificable** de que el control cumple su propósito y no ha roto la operación.

En la hoja de ruta, cada tarea debe llevar predefinido su **Criterio de Aceptación** (que se ejecutará al cierre de cada práctica en el Módulo 4):

- **Evidencia de efectividad de seguridad (Prueba negativa):** Qué resultado debe arrojar una prueba para confirmar que el riesgo fue mitigado (por ejemplo: un escaneo con `nmap -p 22,3389` desde fuera de la subred que devuelva estado `filtered` o `closed`; o un intento de inicio de sesión que sea rechazado al no proporcionar el código de segundo factor MFA).
- **Evidencia de continuidad operativa (Prueba positiva):** Qué comprobación confirma que el negocio sigue funcionando sin degradación (por ejemplo: un usuario del rol autorizado inicia sesión en el sistema contable, emite un comprobante de prueba y la operación queda registrada en el colector de eventos).

:::

### Hoja de Ruta de Implementación (Roadmap)

Como cierre de todo el Módulo 03, consolidamos las decisiones tomadas en un único documento rector conocido en los estándares de gestión como **Plan de Acción e Hitos (POA&M, _Plan of Action and Milestones_)**.

Esta tabla constituye una lista de trabajo ejemplificadora y expandible para la organización. No requiere software especializado de gestión de proyectos; mantener esta matriz actualizada en una hoja de cálculo o documento en un repositorio es suficiente para guiar la implementación de principio a fin:

| ID / Ola                                                            | Tarea y Responsable                                                                                                         | Riesgo y Prerrequisito                                                                                                      | Impacto Operativo                              | Plan de Reversión (Rollback)                                                                               | Criterio de Aceptación (Verificación en Mód. 4)                                                                                        |
| :------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------- | :--------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- |
| **T-01**<br>_Ola 1 (Sem 1)_                                         | Configurar respaldo automatizado en servidor aislado por extracción (_Pull_).<br>**Resp:** Admin TI                         | **Riesgo:** Pérdida total por Ransomware.<br>**Prerreq:** Almacenamiento separado y cuenta de servicio dedicada.            | **Nulo**<br>_(Se ejecuta en horario nocturno)_ | Deshabilitar tarea programada si satura el ancho de banda o el disco de producción.                        | Copia completada sin errores y prueba exitosa de restauración de un archivo en carpeta de prueba.                                      |
| **T-02**<br>_Ola 1 (Sem 1)_                                         | Deshabilitar cuentas huérfanas de exempleados y bloquear cuentas predeterminadas.<br>**Resp:** Admin TI + RRHH              | **Riesgo:** Acceso con credenciales válidas.<br>**Prerreq:** Validar lista activa con RRHH y verificar cuentas de servicio. | **Nulo** para empleados activos.               | Rehabilitar la cuenta bloqueada en el directorio en caso de falso positivo operativo.                      | Intento de login con cuenta deshabilitada rechazado y registrado en el log de autenticación.                                           |
| **T-03**<br>_Ola 1 (Sem 2)_                                         | Activar MFA obligatorio en cuentas de administrador, correo y accesos externos.<br>**Resp:** Admin TI                       | **Riesgo:** Robo de contraseñas / Phishing.<br>**Prerreq:** Cuenta de emergencia _break-glass_ y aviso a usuarios.          | **Bajo**<br>_(Enrolamiento app móvil 5 min)_   | Excluir temporalmente al usuario afectado de la política de MFA por 24 h mientras se reconfigura su token. | Login administrativo y remoto exige código temporal; intento sin segundo factor es bloqueado.                                          |
| **T-04**<br>_Ola 2 (Mes 2)_                                         | Segmentar red en zonas (`VLAN 10, 20, 30, 40, 99`) y aplicar Matriz de Flujos.<br>**Resp:** Admin TI / Redes                | **Riesgo:** Movimiento lateral y exposición.<br>**Prerreq:** T-01 completado y servicios probados.                          | **Medio**<br>_(Reconexión de equipos)_         | Restaurar archivo de configuración previo del cortafuegos/switch si en 30 min no hay conectividad interna. | Estaciones de usuarios acceden al sistema interno por puerto `TCP 443`, pero fallan al intentar conectar por `TCP 22` o hacia backups. |
| **T-05**<br>_Ola 2 (Mes 2)_                                         | Desplegar acceso remoto por VPN con MFA y cerrar puertos administrativos públicos.<br>**Resp:** Admin TI                    | **Riesgo:** Explotación de servicios expuestos.<br>**Prerreq:** T-03 completado y prueba en grupo piloto de 3 usuarios.     | **Medio**<br>_(Uso de cliente VPN)_            | Reactivar temporalmente la regla de acceso anterior restringida por dirección IP fija de origen.           | Escaneo externo a la IP pública muestra puertos `TCP 22` y `TCP 3389` cerrados; acceso funcional vía túnel VPN.                        |
| **T-06**<br>_Ola 2 (Mes 3)_                                         | Aplicar Matriz RBAC en servidor de archivos y aplicaciones; separar cuentas admin (`adm_`).<br>**Resp:** Admin TI + Líderes | **Riesgo:** Fuga de datos y abuso de privilegios.<br>**Prerreq:** Aprobación de la Matriz RBAC (03.3).                      | **Bajo**<br>_(Usuarios operan en su sector)_   | Reasignar al usuario al grupo de permisos anterior si una tarea legítima queda bloqueada.                  | Usuario de Ventas lee y escribe en CRM pero recibe `Permission Denied` al intentar abrir la carpeta de Finanzas.                       |
| _POA&M de ejemplo para guiar la ejecución técnica en el Módulo 04._ |

> [!WARNING:Gestión de Riesgos Diferidos]
> Si por limitaciones presupuestarias o técnicas la dirección decide posponer o no implementar alguna de las tareas previstas en el diseño, esa decisión **nunca debe ignorarse en silencio**. Debe registrarse formalmente al pie de la hoja de ruta como un **Riesgo Diferido / Aceptado**, especificando quién autorizó la excepción y fijando una fecha obligatoria para su reevaluación futura.
