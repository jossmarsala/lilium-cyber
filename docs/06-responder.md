# 6) Responder y Recuperar <!-- id: layer-6 -->

En el sexto y último módulo se establecen los procedimientos operativos para responder a incidentes de ciberseguridad, limitar su impacto, investigar las causas del compromiso y recuperar los servicios afectados de manera segura.

A lo largo de los cinco módulos anteriores construimos una estrategia defensiva: comprendimos los activos y riesgos de la organización, identificamos amenazas, diseñamos una arquitectura de seguridad, implementamos controles de protección y desarrollamos capacidades para detectar e investigar actividades sospechosas. Sin embargo, ninguna infraestructura puede considerarse completamente inmune a una intrusión. Incluso cuando existen controles preventivos y mecanismos de monitoreo, un incidente puede superar las defensas existentes y afectar la disponibilidad, integridad o confidencialidad de los sistemas.

Cuando una señal investigada en el Módulo 05 cumple los criterios de declaración de incidente de la organización y es formalmente escalada, comienza una nueva etapa: **responder de manera coordinada, limitar el daño y recuperar la operación sin reintroducir el compromiso**. El propósito es transformar lo que podría ser unaa reacción improvisada, en un proceso documentado, proporcional a las capacidades de la organización y verificable, que permita gestionar incidentes desde su activación hasta la recuperación y el análisis posterior.

> [!NOTE: La diferencia entre Responder y Recuperar]
> Aunque ambas funciones forman parte de la gestión de un mismo incidente, Responder y Recuperar tienen _objetivos diferentes_:
> La **Respuesta** se concentra en gestionar la amenaza: coordinar acciones, limitar su propagación, preservar evidencias, investigar el compromiso y eliminar los mecanismos de acceso no autorizado.
> La **Recuperación** se concentra en restablecer la operación: seleccionar recursos de restauración confiables, reconstruir sistemas, validar datos y servicios y reincorporar los activos a la infraestructura productiva.
>
> Estas actividades no siempre ocurren de forma estrictamente consecutiva. Según la situación, algunas pueden desarrollarse en paralelo o requerir nuevas intervenciones durante el proceso.

### ¿Para quién es?

El contenido está orientado a personas con conocimientos fundamentales de sistemas, redes y seguridad informática que buscan comprender y aplicar procedimientos de respuesta y recuperación. Se contemplan tres perfiles principales:

- **Responsables de infraestructura, administradores de sistemas y soporte técnico:** personas que necesitan coordinar acciones de contención, investigar sistemas afectados y recuperar servicios sin introducir nuevos riesgos.
- **Desarrolladores de software y responsables técnicos:** equipos que deben comprender cómo gestionar credenciales comprometidas, evaluar el impacto sobre aplicaciones y servicios y participar en la restauración de entornos tecnológicos.
- **Estudiantes de ciberseguridad y analistas defensivos (Blue Team):** personas que ya comprenden los fundamentos de monitoreo y análisis de alertas y buscan profundizar en la gestión de incidentes y la recuperación operativa.

:::subindex
title="Índice del módulo"
:::

### Cómo abordar este módulo

La respuesta a incidentes requiere tomar decisiones bajo presión y una sólida base de conicmientos previos. Por ello, recomendamos haber realizado primero los 5 módulos previos de este Playbook.

:::steps

### 1. Comprende el ciclo de respuesta antes de ejecutar acciones

Recorre las secciones `6.1` a `6.4` para entender cómo se declara un incidente, se coordinan los responsables, se limita el impacto y se recuperan los servicios. Ten presente que las actividades pueden desarrollarse simultáneamente y que las decisiones dependen del contexto.

### 2. Practica en entornos aislados

Se recomienda usar máquinas virtuales y laboratorios controlados para experimentar con la revisión de procesos, la adquisición de información del sistema, el aislamiento de red y la investigación de mecanismos de persistencia. Los procedimientos y comandos de práctica no deben trasladarse automáticamente a sistemas productivos.

### 3. Adapta los playbooks a la realidad de tu organización

Consulta las guías de la sección `06.5`, identificá los responsables, contactos, proveedores y recursos disponibles en tu entorno y prepará copias accesibles fuera de la infraestructura principal. Un procedimiento solo resulta útil si puede consultarse cuando los sistemas habituales no están disponibles.

## 6.1. Preparación y Activación de la Respuesta <!-- id: response-activation, icon: AlertDiamondIcon, displayTitle: 6.1 — Preparación y Activación de la Respuesta, description: Establecimiento de roles, criterios y procedimientos necesarios para activar y coordinar una respuesta organizada ante un incidente de seguridad. -->

Cuando el proceso de triaje del confirma que estamos ante un ataque real en curso, el reloj comienza a correr en contra de la organización. En una pequeña o mediana empresa, el mayor peligro durante los primeros treinta minutos de una intrusión es el caos de la respuesta improvisada. Sin un orden preestablecido, el personal técnico puede actuar por impulso: reinician servidores en pánico borrando la memoria volátil donde reside la evidencia del ataque, eliminan archivos maliciosos sin haber guardado una copia para investigar cómo entraron, o discuten la estrategia defensiva a través del mismo servidor de correo o chat corporativo que el intruso ya tiene intervenido.

Aquí entra en juego la **Gestión de Incidentes** (_Incident Management_), que es el conjunto de procedimientos, roles y canales de comunicación diseñados para dirigir las acciones técnicas y de negocio desde que se declara una emergencia hasta que la empresa recupera su operación normal. Esta sección establece la estructura organizativa y técnica mínima para gobernar una crisis sin paralizar a la organización. Aprenderás a estructurar un plan de respuesta ligero y realista, asignar roles con autoridad clara para desconectar servicios, recibir formalmente el paquete de traspaso (_handoff_) desde la fase de detección, activar canales de comunicación fuera del alcance del atacante e iniciar el registro forense preservando la integridad de las primeras pruebas.

### Diseño de un Plan de Respuesta a Incidentes (IRP) proporcional a una PyME

Un **Plan de Respuesta a Incidentes** (IRP, por sus siglas en inglés: _Incident Response Plan_) es el documento operativo breve que define quién hace qué, cómo se comunican los involucrados y qué pasos seguir cuando se confirma una brecha de seguridad. Un error común en muchas organizaciones consiste en descargar plantillas corporativas genéricas de muchas páginas llenas de definiciones teóricas; cuando ocurre un ataque inesperado, nadie tiene tiempo para leer un manual burocrático.

Para que un IRP sea verdaderamente útil en una pequeña organización, debe diseñarse bajo un enfoque práctico y directo, concentrándose en cinco elementos esenciales que quepan en pocas páginas:

:::group title="Estructura Mínima de un IRP Operativo"

- Directorio de contactos de emergencia y roles [requerido]: Lista actualizada con nombres reales, teléfonos móviles personales, correos alternativos y roles asignados tanto para titulares como para suplentes, incluyendo contactos de proveedores críticos (como el proveedor de servicios de Internet, soporte de servidores en la nube o asesoría legal).
- Criterios de activación y matriz de autoridad [requerido]: Definición explícita de qué eventos obligan a activar el plan y qué persona exacta de la empresa tiene la autoridad para ordenar la desconexión temporal de un sistema que genera ingresos o facturación.
- Protocolo de comunicación fuera de banda [requerido]: Instrucciones precisas sobre qué canal alternativo utilizar para hablar entre el equipo técnico y la dirección cuando se sospecha que la red interna o el correo empresarial están comprometidos.
- Plantillas de bitácora y custodia de evidencia [requerido]: Formularios listos para completar donde se registrarán cronológicamente las acciones tomadas y el inventario de los archivos o registros recolectados.
- Guías rápidas por escenario (Runbooks) [opcional]: Procedimientos técnicos específicos de una página para los incidentes más probables (como secuestro de datos por _ransomware_ o robo de cuentas de correo, que desarrollaremos en profundidad en la sección `06.5`).
  :::

De nada sirve redactar el mejor Plan de Respuesta a Incidentes si el único archivo PDF está guardado dentro del servidor de archivos corporativo, en la intranet local o en la unidad compartida en la nube de la empresa. Si un ataque de _ransomware_ cifra el servidor central o si el equipo debe cortar el acceso al directorio corporativo para frenar al intruso, **el equipo técnico se quedará sin acceso al plan y a los teléfonos de emergencia justo cuando más los necesita**.

Todo IRP debe almacenarse obligatoriamente bajo la regla de disponibilidad fuera de banda: se recomienda mantener **al menos dos copias físicas impresas en papel** en poder de los responsables principales y guardar una copia digital cifrada en un dispositivo o servicio externo independiente que no comparta contraseñas ni inicio de sesión único (_Single Sign-On_) con la red de la empresa.

```filetree:Kit_de_Respuesta
Carpeta_Aislada_Respuesta_Incidentes/
├── 01_IRP_Contactos_y_Autoridades      # Matriz de roles, telefonos moviles, suplentes y proveedores externos
├── 02_Inventario_Activos_Criticos      # Exportacion mensual del Modulo 02 (IPs, VLANs, RTO/RPO y propietarios)
├── 03_Plantilla_Bitacora_y_Custodia    # Formularios vacios listos para documentar acciones y hashes SHA-256
└── 04_Runbooks_Emergencia/             # Guias rapidas de contencion (Linux, Windows, Cloud) sin depender de Internet

```

### Roles, responsabilidades y autoridad de decisión

En una gran corporación, el equipo de respuesta a incidentes está compuesto por decenas de especialistas divididos en múltiples turnos. En una PyME, donde el área de tecnología suele contar con entre una y cinco personas, intentar replicar esa estructura no es igual de viable. La clave en organizaciones pequeñas y medianas es **separar claramente las funciones para que ninguna tarea crítica quede huérfana**.

Incluso en un equipo pequeño —donde una misma persona puede asumir más de un rol si la estructura lo exige—, deben asignarse formalmente cinco funciones operativas con titulares y suplentes:

| Rol en el Incidente                                                                                                                                                                                                                                     | Misión Principal durante la Crisis                                                                                                                                           | Quién suele ocuparlo en una PyME                                                             | Nivel de Autoridad                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| **1. Coordinador del Incidente** (_Incident Commander_)                                                                                                                                                                                                 | Dirige la operación general, prioriza tareas, lleva el control de tiempos, protege al técnico de interrupciones externas y asegura que todo quede registrado en la bitácora. | Líder de tecnología, jefe de sistemas o responsable de operaciones técnicas.                 | Autoridad táctica para coordinar al equipo y escalar alertas.                                        |
| **2. Responsable Técnico** (_Tech Lead / Responder_)                                                                                                                                                                                                    | Ejecuta las manos en la consola: recolecta evidencia volátil, aplica reglas de aislamiento en firewalls, analiza registros y limpia los sistemas afectados.                  | Administrador de sistemas, ingeniero DevOps o analista de soporte senior.                    | Autoridad técnica para aislar equipos individuales de inmediato ante peligro inminente.              |
| **3. Responsable de Negocio** (_Executive Sponsor_)                                                                                                                                                                                                     | Evalúa el impacto económico y operativo. Toma las decisiones que afectan la facturación, autoriza gastos de emergencia y aprueba la baja temporal de servicios críticos.     | Dueño de la PyME, socio gerente, director general (CEO) o gerente financiero.                | **Autoridad máxima** para aprobar el apagado total de sistemas productivos o comercios electrónicos. |
| **4. Responsable de Comunicaciones**                                                                                                                                                                                                                    | Redacta y envía los avisos internos al personal para evitar rumores, y gestiona la comunicación con clientes, bancos o proveedores según lo apruebe la dirección.            | Responsable de atención al cliente, recursos humanos, operaciones o dirección.               | Autoridad exclusiva de vocería (ningún otro miembro habla en nombre de la empresa).                  |
| **5. Soporte Externo y Legal** _(Bajo demanda)_                                                                                                                                                                                                         | Asiste cuando el incidente supera la capacidad interna: especialistas forenses externos, soporte del proveedor en la nube o asesor legal en protección de datos.             | Proveedor de servicios administrados (MSP), consultora de seguridad o abogado de la empresa. | Consultivo y de ejecución especializada bajo supervisión del Coordinador.                            |
| _Matriz de roles adaptada a la realidad de una PyME. En equipos muy reducidos, una misma persona puede acumular el rol de Coordinador y Comunicaciones, pero siempre debe protegerse la concentración de quien ejecuta las tareas técnicas en consola._ |                                                                                                                                                                              |                                                                                              |                                                                                                      |

> [!TIP:Define de antemano la autoridad de corte ("Kill Switch Authority")]
> La demora más costosa durante un incidente ocurre cuando el técnico detecta el ataque a las 03:00 AM, sabe que debe desconectar el servidor principal para salvar el resto de la red, pero no se atreve a hacerlo por miedo a ser sancionado al día siguiente por frenar las ventas, y el dueño de la empresa no atiende el teléfono.
> El Plan de Respuesta debe incluir una **cláusula de delegación preaprobada**: si ante un incidente de severidad crítica confirmada el Responsable de Negocio ni su suplente responden al llamado en un plazo máximo de **15 minutos**, el Coordinador del Incidente o el Responsable Técnico quedan automáticamente autorizados por la dirección para aislar el servicio afectado a fin de proteger la continuidad de la organización.

### Criterios de activación y recepción de la alerta

No toda anomalía técnica justifica despertar a la dirección de la empresa ni activar el protocolo de emergencia. Un intento de intrusión bloqueado en el firewall perimetral o un archivo malicioso aislado por el antivirus se gestionan como tareas operativas de rutina. El Plan de Respuesta a Incidentes se debe activar formalmente cuando el proceso de triaje confirma cualquiera de las siguientes condiciones objetivas:

1. **Ejecución o persistencia no autorizada:** Un atacante o código malicioso logró superar las barreras preventivas y ejecutó comandos, creó cuentas o instaló mecanismos de persistencia dentro de un servidor o estación de trabajo.
2. **Compromiso de identidades privilegiadas o críticas:** Se confirma el uso no autorizado de cuentas de administración (`root`, Administrador de Dominio, consola de nube) o buzones de correo de dirección y finanzas.
3. **Exposición o extracción de datos sensibles:** Existe evidencia de acceso no autorizado, modificación o salida hacia redes externas de bases de datos de clientes, propiedad intelectual, código fuente o información financiera.
4. **Degradación o sabotaje operativo:** Un ataque en curso (como cifrado por _ransomware_, borrado de datos o denegación de servicio crítica) interrumpe o amenaza de forma inminente los procesos esenciales del negocio.

#### Recepción estructurada del paquete de transferencia (_Handoff_)

Cuando el analista que realizó el triaje en la sección `05.5` confirma una de estas condiciones, entrega el caso al Coordinador del Incidente mediante el paquete de transferencia o **Handoff**. Para evitar perder minutos valiosos volviendo a investigar desde cero lo que ya se descubrió en la etapa de detección, la recepción del incidente valida cinco datos fundamentales:

1. Activos e identidades afectadas confirmadas hasta el momento
2. Resumen cronologico de alertas que dispararon el caso
3. Indicadores observados (IoC / IoA)
4. Hipotesis preliminar y estado actual
5. Fecha y hora registradas de la detección

Debajo se detalla un ejemplo utilizable como plantilla de _handoff_:

```yaml:ficha_handoff_incidente.yml
# Ficha de Transferencia (Handoff)
incidente_id: "INC-2026-1110-001"
fecha_hora_declaracion_utc: "2026-11-10T13:45:00Z"
severidad_y_prioridad: "Prioridad Critica (Activo Critico + Confianza Muy Alta)"

# 1. Activos e identidades afectadas confirmadas hasta el momento
activos_involucrados:
  - hostname: "srv-erp-prod-01"
    ip_interna: "10.10.20.15"
    vlan: "VLAN 20 - Servidores"
    criticidad_negocio: "Alta (Facturacion y Stock)"
cuentas_involucradas:
  - usuario: "svc_backup_admin"
    origen_acceso: "203.0.113.88 (IP externa no reconocida)"

# 2. Resumen cronologico de alertas que dispararon el caso
evidencia_deteccion:
  - "13:32:10 UTC - Alerta SIEM 100202: Login SSH exitoso tras multiples fallos desde 203.0.113.88"
  - "13:36:45 UTC - Alerta Wazuh FIM Rule 550: Modificacion de /etc/crontab y creacion de binario en /tmp/.sysd"

# 3. Indicadores observados (IoC / IoA)
indicadores:
  ip_atacante: "203.0.113.88"
  hash_sha256_artefacto: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08"
  tecnica_mitre: ["T1078 (Valid Accounts)", "T1053.003 (Cron)"]

# 4. Hipotesis preliminar y estado actual
hipotesis_inicial: "Compromiso de credencial del usuario de servicio por fuerza bruta o filtracion previa, con instalacion de persistencia local."
acciones_previas_ejecutadas: "Ninguna sobre el servidor para no alterar memoria volatil. Consultas OSINT realizadas de forma pasiva."

```

Con esta ficha en mano, el Coordinador del Incidente declara formalmente abierto el caso, asigna el número identificador único (`INC-2026-1110-001`) y convoca al equipo a través de los canales seguros.

### Canales de comunicación fuera de banda (_Out-of-Band_)

Cuando sufrimos un problema técnico común —como la caída de una base de datos por un disco lleno—, lo natural es abrir el chat interno de la empresa (Microsoft Teams, Slack, Google Chat) o enviar un correo electrónico al grupo de soporte. Sin embargo, hacer esto durante un incidente de ciberseguridad es un error crítico.

La comunicación **fuera de banda** (OOB, por sus siglas en inglés: _Out-of-Band_) consiste en utilizar un medio de comunicación completamente separado e independiente de la red y de los sistemas informáticos habituales de la organización.

> [!WARNING:El adversario lee tus canales internos]
> En una intrusión real donde el atacante logró comprometer una cuenta de administración, el controlador de dominio o el panel de correo corporativo (como Microsoft 365 o Google Workspace), **el intruso suele tener acceso de lectura a los correos internos, grupos de chat y carpetas compartidas de IT**. Si el equipo defensivo utiliza esos mismos canales para avisar qué servidores va a desconectar, qué contraseñas está cambiando o qué pistas encontró, le estará entregando al atacante un informe en vivo de cada movimiento defensivo, permitiéndole anticiparse, borrar pruebas o activar un ataque destructivo antes de ser bloqueado.

Para garantizar que la coordinación de la respuesta sea confidencial y siga funcionando incluso si toda la red corporativa queda apagada, toda empresa debe dejar preconfigurados sus canales fuera de banda antes de que ocurra una emergencia:

1. **Canal primario de mensajería y voz cifrada independiente:** Crear un grupo cerrado de respuesta a incidentes en una aplicación de mensajería con cifrado de extremo a extremo (como **Signal** o **WhatsApp** con verificación de código de seguridad activada) instalada en los teléfonos móviles de los integrantes del equipo, operando a través de la red de datos móviles (`4G`/`5G`) y no del Wi-Fi corporativo afectado.
2. **Canal secundario de contingencia (Puente telefónico o correo externo aislado):** Mantener los números de línea móvil directa para llamadas de voz tradicionales y, opcionalmente, cuentas de correo electrónico gratuitas o en un dominio externo de contingencia (protegidas con autenticación multifactor de hardware o aplicación independiente) reservadas exclusivamente para emergencias.
3. **Regla de verificación de identidad verbal:** Si durante un incidente alguien escribe por un canal nuevo pidiendo acceso urgente a un servidor o solicitando una copia de seguridad en nombre de un directivo, el técnico debe validar la orden mediante una llamada de voz o videollamada breve a la persona conocida antes de entregar cualquier credencial o archivo.

### Bitácora del incidente y Cadena de Custodia inicial

En medio de la tensión por contener un ataque, la memoria humana falla: dos horas después de haber intervenido tres servidores, nadie recuerda con certeza si una regla de firewall la borró el atacante o la desactivó un técnico del propio equipo para hacer una prueba, ni a qué hora exacta se reinició un servicio.

Para evitar confusiones técnicas y resguardar la responsabilidad legal de la empresa, desde el minuto uno de la activación se deben poner en marcha dos registros complementarios: la **Bitácora Cronológica del Incidente** y el registro de **Cadena de Custodia**.

#### 1. Cómo llevar la Bitácora Cronológica del Incidente

La bitácora es el diario de vuelo inalterable de la emergencia. El Coordinador del Incidente (o una persona designada como escriba) debe anotar cada hallazgo, cada decisión de negocio y cada comando relevante ejecutado sobre los sistemas, utilizando siempre el **Tiempo Universal Coordinado (`UTC`)** para que las anotaciones coincidan exactamente con las marcas de tiempo de los registros del SIEM.

A continuación se presenta una plantilla práctica basada en los formatos operativos de equipos de respuesta a incidentes (CSIRT), lista para usar en cualquier editor de texto o planilla aislada:

| Fecha y Hora (`UTC`)                                                                                                                                                                             | Autor / Rol          | Activo / Sistema                  | Tipo de Entrada          | Descripción Exacta (Hallazgo, Decisión o Comando Ejecutado)                                                                                                              | Resultado / Evidencia Asociada                  |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------- | --------------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------- |
| `2026-11-10 13:45`                                                                                                                                                                               | M. Gómez _(Coord)_   | General                           | **Activación**           | Se recibe Handoff desde detección por acceso no autorizado en `srv-erp-prod-01`. Se declara abierto `INC-2026-1110-001` y se convoca al equipo por canal OOB (WhatsApp). | Ticket `INC-2026-1110-001`                      |
| `2026-11-10 13:49`                                                                                                                                                                               | L. Pérez _(Técnico)_ | `srv-erp-prod-01` (`10.10.20.15`) | **Acción / Recolección** | Antes de aislar el servidor, se exporta lista de conexiones de red activas y procesos en memoria a carpeta de resguardo `/var/ossec/quarantine/evidencia_01.tar.gz`.     | Archivo `EVID-001` (Hash `SHA-256` registrado). |
| `2026-11-10 13:52`                                                                                                                                                                               | R. Sosa _(Negocio)_  | `srv-erp-prod-01`                 | **Decisión**             | El socio gerente aprueba por llamada OOB desconectar temporalmente el servidor ERP de la red interna para evitar propagación hacia la base de datos contable.            | Aprobación verbal registrada.                   |
| `2026-11-10 13:54`                                                                                                                                                                               | L. Pérez _(Técnico)_ | `srv-erp-prod-01`                 | **Acción / Contención**  | Se aplica bloqueo de tráfico en host mediante `nftables` permitiendo únicamente SSH desde la IP de administración `10.10.99.5`.                                          | Servidor aislado; sesión de análisis activa.    |
| _Ejemplo realista de una Bitácora Cronológica del Incidente. Registrar qué comando hizo cada técnico evita que el propio equipo confunda sus acciones defensivas con la actividad del atacante._ |                      |                                   |                          |                                                                                                                                                                          |                                                 |

#### 2. Qué es la Cadena de Custodia y cómo preservar la evidencia inicial

La **Cadena de Custodia** (_Chain of Custody_) es el procedimiento documentado que garantiza la trazabilidad e integridad de cualquier prueba digital desde el instante en que se recolecta hasta que se analiza o se presenta ante un tercero (como una auditoría, una compañía de seguros o un juzgado penal).

En términos sencillos: si se copia un archivo de registro donde se ve qué hizo el atacante y es guardado en una carpeta común donde cualquier empleado puede abrirlo y modificarle una línea con el bloc de notas, esa prueba pierde su valor técnico y legal porque nadie puede demostrar que no fue alterada luego del incidente. Para establecer una cadena de custodia sólida pero ágil, cada vez que un _log_ es recolectado, una captura de memoria es realizada o un archivo sospechoso revisado, se deben cumplir cuatro reglas:

1. **Trabajar siempre sobre copias:** Nunca analices ni abras el archivo único original; genera una copia para investigar y guarda el original intacto.
2. **Calcular el sello criptográfico (`SHA-256`) en el acto:** Apenas empaquetes el archivo de evidencia, calcula su resumen criptográfico y anótalo inmediatamente en la bitácora junto con la hora `UTC`. Si meses después alguien cuestiona si el archivo fue modificado, bastará volver a calcular su hash `SHA-256` para demostrar matemáticamente que no fue alterado.
3. **Bloquear permisos de escritura (Solo Lectura):** Remueve los permisos de modificación sobre el archivo recolectado y guárdalo en un medio seguro o carpeta restringida donde solo el Coordinador o Responsable Técnico tengan acceso.
4. **Registrar cada transferencia:** Registra quién recolectó el archivo, dónde quedó guardado y, si se entrega una copia a un especialista externo o asesor legal, dejar constancia de la fecha, hora y receptor.

#### Cómo crear de un contenedor de evidencia inicial con sello de integridad

A continuación se detalla cómo crear un directorio de resguardo, empaquetar los registros iniciales de un incidente, generar su manifiesto criptográfico `SHA-256` y proteger los archivos contra modificaciones accidentales tanto en **Linux** como en **Windows PowerShell**. _Es necesario contar con permisos administrativos (`sudo` en Linux / macOS o consola de PowerShell ejecutada como Administrador en Windows) en el equipo donde se resguardarán las evidencias iniciales._

:::steps

### 1. Empaquetar y sellar evidencia inicial en Linux y macOS

En un servidor Linux (Debian/Ubuntu) o estación macOS, crea un directorio seguro para el incidente, empaqueta los archivos de registro relevantes conservando sus metadatos originales de fecha y permisos (`-p`), genera el archivo de firma criptográfica y aplica permisos estrictos de solo lectura (`0400`):

- Definir el identificador del incidente y crear el directorio seguro de custodia

```bash:terminal
INC_ID="INC-2026-1110-001"
sudo install -d -m 0700 /var/evidencias/${INC_ID}
```

- Empaquetar los logs de autenticacion y del sistema conservando atributos originales (-p)

```bash:terminal
sudo tar -czpf /var/evidencias/${INC_ID}/EVID-001_logs_sistema_$(hostname).tar.gz /var/log/auth.log /var/log/syslog 2>/dev/null
```

- Calcular el hash SHA-256 y guardarlo en el manifiesto de cadena de custodia

```bash:terminal
sudo sh -c "sha256sum /var/evidencias/${INC_ID}/EVID-001_logs_sistema_$(hostname).tar.gz > /var/evidencias/${INC_ID}/EVID-001_manifiesto.sha256"
```

- Blindar tanto la evidencia como el manifiesto en modo solo lectura (0400) e inmutable (+i en Linux)

```bash:terminal
sudo chmod 0400 /var/evidencias/${INC_ID}/*
sudo chattr +i /var/evidencias/${INC_ID}/* 2>/dev/null || true
```

Verifica que el paquete y su firma hayan quedado registrados y que el hash coincida al validarlo con la bandera `-c`:

```bash:terminal
# Comprobar matematicamente que el archivo coincide con su manifiesto SHA-256
sudo sha256sum -c /var/evidencias/INC-2026-1110-001/EVID-001_manifiesto.sha256
sudo ls -la /var/evidencias/INC-2026-1110-001/
```

El sistema devolverá la confirmación `OK` junto con los permisos restringidos `-r--------`:

```text:salida-terminal
/var/evidencias/INC-2026-1110-001/EVID-001_logs_sistema_srv-erp.tar.gz: OK
total 148
drwx------ 2 root root   4096 Nov 10 13:50 .
drwxr-xr-x 3 root root   4096 Nov 10 13:50 ..
-r-------- 1 root root 139264 Nov 10 13:50 EVID-001_logs_sistema_srv-erp.tar.gz
-r-------- 1 root root    122 Nov 10 13:50 EVID-001_manifiesto.sha256

```

### 2. Empaquetar y sellar registros de eventos en Windows (PowerShell e Interfaz Gráfica)

En sistemas Windows, utiliza la herramienta nativa `wevtutil` para exportar de forma íntegra el canal de eventos de Seguridad en su formato binario original (`.evtx`), calcula su huella `SHA-256` con `Get-FileHash` y marca el archivo como de solo lectura:

```powershell:terminal
# 1. Crear carpeta aislada para la custodia del incidente
$IncId = "INC-2026-1110-001"
$EvidPath = "C:Evidencias$IncId"
New-Item -ItemType Directory -Path $EvidPath -Force | Out-Null

# 2. Exportar el registro de Seguridad de Windows completo a un archivo .evtx nativo
$EvtxFile = "$EvidPathEVID-001_Security_$($env:COMPUTERNAME).evtx"
wevtutil epl Security $EvtxFile

# 3. Calcular el hash SHA-256 y guardar el acta de cadena de custodia con fecha UTC
$HashObj = Get-FileHash -LiteralPath $EvtxFile -Algorithm SHA256
$Manifest = @"
INCIDENTE: $IncId
FECHA_RECOLECCION_UTC: $((Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ"))
RECOLECTADO_POR: $env:USERNAME
ARCHIVO: $($HashObj.Path)
ALGORITMO: $($HashObj.Algorithm)
HASH_SHA256: $($HashObj.Hash)
"@
$Manifest | Out-File -FilePath "$EvidPathEVID-001_manifiesto.txt" -Encoding UTF8

# 4. Establecer el atributo de Solo Lectura (ReadOnly) sobre los archivos generados
Set-ItemProperty -Path $EvtxFile, "$EvidPathEVID-001_manifiesto.txt" -Name IsReadOnly -Value $true

```

Verifica en la consola que el manifiesto contenga la firma criptográfica y que el archivo tenga el atributo `ReadOnly` (`-ar---`) activo:

```powershell:terminal
Get-Content "$EvidPathEVID-001_manifiesto.txt"
Get-ChildItem $EvidPath | Select-Object Mode, Name, Length
```

- **Alternativa por Interfaz Gráfica (GUI) en Windows:** Si necesitas exportar el registro de eventos visualmente, abre el **Visor de Eventos** (`eventvwr.msc`), despliega **Registros de Windows**, haz clic derecho sobre **Seguridad** y selecciona **Guardar todos los eventos como...**. Elige el formato `.evtx`, guárdalo en la carpeta de evidencia y luego calcula su hash `SHA-256` con clic derecho mediante _7-Zip (CRC SHA → SHA-256)_ o `Get-FileHash` para anotarlo en tu bitácora.
  :::

### Criterios de escalamiento a terceros

Reconocer a tiempo cuándo un incidente supera las capacidades técnicas internas de la PyME no es una señal de debilidad, sino una decisión madura de gestión de riesgos. Intentar resolver en soledad un ataque complejo sobre una infraestructura que no se domina suele prolongar el tiempo de inactividad de días a semanas.

El Coordinador del Incidente y el Responsable de Negocio deben activar el contacto con especialistas externos en cualquiera de los siguientes cuatro escenarios:

:::group title="Cuándo y a quién escalar fuera de la organización"

- Especialistas en Respuesta a Incidentes y Forense Digital (DFIR): Se debe escalar de inmediato cuando el atacante ha comprometido el controlador de dominio central (_Active Directory_), cuando existe un cifrado masivo por _ransomware_ que afecta a múltiples servidores críticos en simultáneo, o cuando el equipo interno no logra identificar por dónde está entrando el atacante tras las primeras horas de contención. Si la organización cuenta con una póliza de ciberseguro, se debe llamar primero al teléfono de emergencia de la aseguradora para que asignen su equipo forense autorizado sin invalidar la cobertura.
- Proveedor de Servicios Administrados (MSP) o Soporte de Nube / Hosting: Se debe contactar cuando el activo comprometido reside en infraestructura administrada por un tercero (como instancias en AWS, Microsoft Azure, Google Cloud o servidores dedicados en un centro de datos externo) y se requiere asistencia para tomar instantáneas de discos (_snapshots_) desde el panel de control del proveedor, aislar redes virtuales a nivel de hipervisor o revisar registros del plano de control de la nube.
- Proveedor de Servicios de Internet (ISP) o Carrier de Telecomunicaciones: Se debe escalar cuando la organización sufre un ataque volumétrico de Denegación de Servicio Distribuido (DDoS) que satura por completo el ancho de banda del enlace de fibra óptica antes de llegar al cortafuegos de la empresa, requiriendo que el proveedor filtre el tráfico malicioso en su propia red troncal.
- Asesoría Legal y Especialistas en Protección de Datos: Se debe involucrar desde el momento en que se sospecha o confirma la sustracción o exposición de datos personales de clientes, historias clínicas, información de tarjetas de pago o secretos confidenciales de terceros bajo contrato, así como cuando se evalúa radicar una denuncia penal por delitos informáticos (aspectos que abordaremos en detalle en la sección `6.6`).
  :::

### Escalonamiento PyME: De la preparación básica a la coordinación madura

Siguiendo la filosofía progresiva de lilium, ninguna pequeña empresa necesita redactar manuales extensos para estar preparada hoy mismo. La siguiente tabla resume qué implementar según el nivel de madurez operativa de la organización:

| Nivel de Madurez                                                                      | Objetivo Operativo                                                                                                  | Qué implementar en la práctica                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| :------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nivel Base (CIS IG1)**<br>_(PyME pequeña con equipo técnico reducido)_              | Eliminar la parálisis inicial, saber a quién llamar y tener un canal seguro fuera de la red de la empresa.          | **1. Matriz de 1 página:** Definir quién actúa como Coordinador, Técnico y Decisor de Negocio (con sus teléfonos personales y suplentes) e imprimir dos copias físicas.<br>**2. Canal OOB listo:** Crear hoy mismo el grupo de emergencia en una aplicación cifrada móvil independiente del correo corporativo.<br>**3. Plantilla de bitácora:** Tener lista la tabla cronológica y saber ejecutar `sha256sum` o `Get-FileHash` antes de tocar un archivo sospechoso. |
| **Nivel Intermedio (CIS IG2)**<br>_(PyME estructurada con área de TI definida)_       | Formalizar el Plan de Respuesta escrito, el flujo de recepción desde el SIEM y los acuerdos con terceros.           | **1. IRP documentado y offline:** Mantener el kit completo de respuesta (contactos, inventario crítico exportado del Módulo 02 y cláusula de autoridad de corte de 15 minutos) fuera de la red empresarial.<br>**2. Handoff estandarizado:** Conectar el cierre del triaje (`05.5`) con la ficha YAML/Markdown de apertura de incidente y un repositorio dedicado de custodia de evidencias.                                                                          |
| **Nivel Maduro (CIS IG3)**<br>_(Organización con servicios críticos 24/7 o regulada)_ | Validar la coordinación bajo presión mediante ejercicios periódicos y acuerdos de respuesta externa precontratados. | Ejecutar al menos una vez al año un simulacro de escritorio (_Tabletop Exercise_) con la dirección y el equipo técnico para medir los tiempos de activación del canal OOB y toma de decisiones; y contar con contactos preacordados de especialistas forenses (DFIR) y asesoría legal antes de que ocurra una crisis.                                                                                                                                                 |

_Hoja de ruta práctica para implementar la preparación y activación de respuesta a incidentes según el tamaño de la organización._

### Verificación rápida de la subsección

Antes de pasar a la sección `06.2` para ejecutar maniobras técnicas de contención, comprueba mediante estos tres pasos que tu estructura de mando y resguardo está operativa:

:::steps

### 1. Comprobar la disponibilidad offline del Plan y la Matriz de Roles

Verifica que la matriz de roles (con los nombres reales de tu equipo, números de teléfono móvil personal, suplentes y la cláusula de autoridad de corte de 15 minutos) esté completa y que exista al menos una copia impresa en papel y una copia digital accesible desde un dispositivo que no dependa del servidor ni del correo de la empresa.

### 2. Ejecutar una prueba real del canal fuera de banda (Out-of-Band)

Envía un mensaje de prueba a través del canal alternativo designado (por ejemplo, el grupo de emergencia en Signal o WhatsApp operando con datos móviles, desconectado del Wi-Fi corporativo) y verifica que todos los integrantes titulares y suplentes puedan recibirlo y confirmar lectura sin utilizar ninguna herramienta interna de la organización.

### 3. Validar la creación y sellado de un paquete de evidencia inicial

Ejecuta el procedimiento práctico de esta sección en un servidor Linux o estación Windows de prueba para exportar un archivo de registro, generar su manifiesto con el resumen criptográfico `SHA-256`, aplicarle permisos de solo lectura y anotar el resultado en tu plantilla de bitácora cronológica con hora `UTC`.
:::

## 6.2. Contención del Incidente <!-- id: incident-containment, icon: ShieldAlertIcon, displayTitle: 6.2 — Contención y Preservación de Evidencia, description: Cómo aplicar medidas para limitar el impacto del incidente y preservar la información necesaria para su posterior investigación. -->

Una vez que el equipo de respuesta ha sido activado, comienza la fase técnica: detener el ataque en curso. Mientras un adversario mantiene acceso activo a la red de una organización, cada minuto adicional le permite saltar hacia otros servidores, extraer bases de datos confidenciales o desplegar un cifrado destructivo. Sin embargo, precipitarse sobre el equipo afectado sin un método claro —por ejemplo, desenchufando el cable de corriente de un servidor o reiniciándolo de inmediato— suele destruir para siempre las únicas pistas que explican cómo entró el intruso y qué hizo exactamente.

Para resolver esta tensión operativa debemos comprender dos conceptos fundamentales que entran en juego simultáneamente: la **Contención** y la **Evidencia Volátil**.

La **Contención** es el conjunto de acciones técnicas destinadas a limitar el alcance y la magnitud de un incidente, aislando los sistemas comprometidos para evitar que el daño se propague al resto de la organización antes de pasar a la limpieza definitiva.

Por su parte, la **Evidencia Volátil** comprende todos aquellos datos temporales de un sistema informático que residen en la memoria de acceso aleatorio (RAM) y en el estado activo del procesador, los cuales desaparecen de forma instantánea e irrecuperable en el segundo en que el equipo se apaga, se reinicia o pierde energía. En esa memoria temporal viven las conexiones de red abiertas en ese instante, los comandos que el atacante está ejecutando en vivo, las sesiones de usuarios conectados y las amenazas modernas que operan íntegramente en memoria sin dejar archivos en el disco duro (_fileless malware_).

Esta sección enseña a equilibrar ambas necesidades bajo presión: Definimos cuándo priorizar la contención inmediata frente a la recolección de datos, cómo capturar rápidamente la evidencia volátil siguiendo estándares forenses, cómo aislar servidores y estaciones de trabajo en Linux, Windows y macOS sin perder el control administrativo remoto, y cómo revocar cuentas y sesiones en la nube para cortar de raíz el acceso del atacante.

### El dilema operativo: ¿Contener de inmediato o capturar evidencia primero?

En un escenario ideal de laboratorio, siempre capturaríamos una copia completa de la memoria RAM y de todos los procesos activos antes de tocar un solo cable o regla de firewall. En la realidad de una pequeña empresa que está sufriendo un ataque real, esperar cuarenta minutos mientras se copia la memoria de un servidor puede significar la pérdida total de activos críticos.

> [!CRITICAL: La regla de prioridad ante daños destructivos en curso]
> La preservación de evidencia forense **nunca debe retrasar la contención** cuando existe un daño destructivo o irreversible en progreso. Si se detecta un ataque de secuestro de datos que está cifrando archivos activamente en la red, o que un intruso está descargando gigabytes de información confidencial hacia el exterior en este mismo instante, **la prioridad absoluta es aislar la red de inmediato**. Es preferible perder algunos datos volátiles en la memoria de un servidor que permitir que el atacante termine de cifrar todas las carpetas compartidas de la empresa.

Para tomar esta decisión, es necesario evaluar el escenario frente la siguiente matriz operativa:

| Escenario del Incidente Confirmado                                                                                                 | Velocidad del Daño                                       | Decisión Operativa Recomendada                                                                                                                                                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Cifrado activo (_Ransomware_) o borrado masivo de archivos en curso.**                                                           | Extrema (segundos a minutos).                            | **1. Contención inmediata:** Cortar el tráfico de red del equipo y de los servidores de copias de seguridad al instante.<br>**2. Evidencia:** Capturar procesos y conexiones locales después de haber cortado la red (nunca apagar la máquina si basta con desconectar la red). |
| **Exfiltración masiva de bases de datos o documentos hacia una IP externa.**                                                       | Alta (minutos).                                          | **1. Contención inmediata en perímetro:** Bloquear la IP de destino o aislar el puerto de salida en el cortafuegos.<br>**2. Evidencia:** Con la salida bloqueada, capturar los procesos activos y conexiones en el servidor antes de matar el proceso malicioso.                |
| **Puerta trasera (_webshell_), cuenta comprometida silenciosa o minero de criptomonedas.**                                         | Baja a moderada (el atacante busca pasar desapercibido). | **1. Preservación volátil primero:** Ejecutar la captura rápida de conexiones, sesiones y procesos en memoria (toma menos de 3 minutos).<br>**2. Contención:** Aplicar el aislamiento de red y la revocación de credenciales inmediatamente después de guardar la captura.      |
| _Criterio práctico para decidir el orden de intervención entre la preservación de memoria volátil y el aislamiento de emergencia._ |                                                          |                                                                                                                                                                                                                                                                                 |

### Estrategias y prioridades de contención

No todos los equipos se contienen de la misma manera. Bloquear por completo una computadora portátil de un empleado administrativo no detiene la empresa, pero desconectar abruptamente un servidor central crítico paralizará las operaciones en el acto.

Antes de ejecutar un bloqueo, el equipo debe cruzar cuatro factores: la **criticidad del activo** (documentada en el inventario del Módulo 2), el **impacto operativo** de dejarlo fuera de línea, la **velocidad de propagación** de la amenaza y el **alcance conocido** hasta ese momento. A partir de esa evaluación, la ingeniería de respuesta divide la contención en dos fases temporales complementarias:

:::group title="Fases Estratégicas de Contención"

- Contención a Corto Plazo (Short-Term Containment): Son medidas tácticas de aplicación instantánea (en minutos) diseñadas para frenar la emergencia de inmediato con los recursos disponibles en el momento. Ejemplos concretos incluyen aislar el equipo mediante su firewall local, deshabilitar el puerto de red en el _switch_, desconectar el cable Ethernet (sin apagar el equipo), bloquear una dirección IP en el firewall perimetral o suspender una cuenta de usuario comprometida.
- Contención a Largo Plazo (Long-Term Containment): Son medidas arquitectónicas temporales que se aplican cuando el incidente requiere horas o días de investigación forense y erradicación, pero el negocio necesita seguir operando de forma segura. Incluye levantar una copia temporal del servicio en una subred aislada y vigilada, aplicar reglas estrictas de microsegmentación en las redes virtuales (VLANs) para que el servidor afectado solo pueda hablar con un puerto específico mientras se prepara su reemplazo limpio, o redirigir el tráfico de los clientes hacia un servidor secundario libre de infección.
  :::

### Orden de Volatilidad y adquisición rápida antes de intervenir

Cuando el escenario permite capturar la evidencia antes de alterar el sistema (o inmediatamente después de haber cortado su conexión a la red), el técnico debe recolectar los datos siguiendo una secuencia estricta establecida en el estándar internacional **RFC 3227** de la IETF (_Guidelines for Evidence Collection and Archiving_): el Orden de Volatilidad.

El principio del Orden de Volatilidad es simple: **siempre hay que recolectar primero lo que desaparece más rápido**. Si se empieza haciendo una copia de los archivos del disco duro (que son estáticos y no se borran al apagar la máquina), el propio uso del procesador y la espera harán que las conexiones de red activas se cierren y que los datos en la memoria RAM se sobrescriban antes de que alcanzar a mirarlos.

```filetree:Orden_de_Volatilidad_RFC3227
De_lo_mas_efimero_a_lo_mas_persistente/
├── 1_Registros_CPU_y_Cache/       # [Milisegundos] Contenido interno del procesador (cambia en cada ciclo de reloj)
├── 2_Memoria_RAM_y_Tablas_Red/    # [Segundos/Minutos] Procesos vivos, conexiones TCP/UDP abiertas, tablas ARP y rutas en memoria
├── 3_Sesiones_y_Sistemas_Temp/    # [Minutos/Horas] Usuarios conectados actualmente y archivos en sistemas temporales (/tmp, /proc)
├── 4_Datos_en_Disco_Duro_Local/   # [Persistente] Archivos del sistema operativo, ejecutables y registros locales (/var/log, .evtx)
├── 5_Registros_Remotos_en_SIEM/   # [Persistente Externo] Eventos ya transmitidos al colector centralizado o SIEM (Modulo 05)
└── 6_Copias_de_Seguridad_y_Frios/ # [Inmutable / Historico] Respaldos offline, cintas o repositorios aislados (Modulo 04)

```

#### Cómo adquirir rapidamente evidencia volátil

En una pequeña organización, realizar un volcado completo de 16 GB o 32 GB de memoria RAM suele demorar demasiado tiempo durante los primeros minutos de una crisis. Por ello, la práctica estándar recomendada consiste en ejecutar una **captura rápida de estado vivo (_Live Triage_)** que recolecta en menos de sesenta segundos la lista exacta de conexiones de red abiertas, los procesos en ejecución con sus rutas reales en disco, los usuarios conectados y los módulos cargados, empaquetando todo con su firma criptográfica `SHA-256`.

_Es necesaria una consola con privilegios administrativos (`root` / `sudo` en Linux y macOS, o PowerShell como Administrador en Windows) sobre el equipo afectado._

:::steps

### 1. Capturar evidencia volátil en Linux (Debian/Ubuntu/RHEL)

Ejecuta el siguiente bloque de comandos para recolectar las conexiones activas, el árbol completo de procesos, los binarios reales en memoria (incluso si el atacante borró el archivo del disco, Linux mantiene el enlace vivo en `/proc/<PID>/exe`), las sesiones abiertas y la tabla de red, guardando todo en una carpeta sellada:

Definir directorio de captura volatil con marca de tiempo UTC

```bash:terminal
SNAP_DIR="/var/evidencias/volatil_$(hostname)_$(date -u +%Y%m%dT%H%M%SZ)"
sudo install -d -m 0700 "${SNAP_DIR}"
```

Capturar fecha exacta UTC, tiempo de actividad (uptime) y usuarios conectados actualmente

```bash:terminal
date -u > "${SNAP_DIR}/01_fecha_utc.txt"
w >> "${SNAP_DIR}/01_fecha_utc.txt"
last -n 50 > "${SNAP_DIR}/02_ultimos_accesos.txt"
```

Capturar todas las conexiones de red abiertas y puertos en escucha junto al proceso (PID) dueño

```bash:terminal
sudo ss -tulpan > "${SNAP_DIR}/03_conexiones_red_ss.txt"
ip neigh show > "${SNAP_DIR}/04_tabla_arp_vecinos.txt"
ip route show > "${SNAP_DIR}/05_tabla_rutas.txt"
```

Capturar el arbol jerarquico completo de procesos y sus argumentos de linea de comandos

```bash:terminal
ps auxwwf > "${SNAP_DIR}/06_arbol_procesos_ps.txt"
```

Identificar ejecutables reales en memoria y detectar binarios que fueron borrados del disco ("deleted")

```bash:terminal
sudo ls -la /proc/*/exe 2>/dev/null > "${SNAP_DIR}/07_rutas_binarios_proc.txt"
sudo lsof -nP -i > "${SNAP_DIR}/08_archivos_red_abiertos_lsof.txt" 2>/dev/null || true
lsmod > "${SNAP_DIR}/09_modulos_kernel.txt"
```

Empaquetar la captura volatil y generar su sello de cadena de custodia SHA-256

```bash:terminal
sudo tar -czpf "${SNAP_DIR}.tar.gz" "${SNAP_DIR}"
sudo sh -c "sha256sum ${SNAP_DIR}.tar.gz > ${SNAP_DIR}.sha256"
sudo chmod 0400 "${SNAP_DIR}.tar.gz" "${SNAP_DIR}.sha256"
```

Verifica inmediatamente que el archivo comprimido y su hash `SHA-256` se hayan creado de forma íntegra y busca rápidamente si existe algún proceso ejecutándose desde un archivo que el atacante intentó borrar para esconderse (`(deleted)`):

```bash:terminal
# Verificar integridad del paquete volatil y buscar procesos ocultos borrados en disco
sudo sha256sum -c "${SNAP_DIR}.sha256"
grep "(deleted)" "${SNAP_DIR}/07_rutas_binarios_proc.txt" || echo "Sin binarios borrados en ejecucion"
```

- **Nota en macOS:** En estaciones macOS es posible emplear los mismos comandos de consola (`date -u`, `w`, `last`, `ps auxww`, `lsof -nP -i`), reemplazando únicamente `ss -tulpan` por `netstat -anv` para visualizar las conexiones de red junto al identificador de proceso (`pid`).

### 2. Capturar evidencia volátil en Windows (PowerShell)

En entornos Windows, abre PowerShell como Administrador y ejecuta esta secuencia nativa para registrar las conexiones TCP/UDP asociadas a cada identificador de proceso (`OwningProcess`), la ruta completa y línea de comandos de todos los programas en memoria (mediante `CIM`/`WMI`), las sesiones iniciadas y la caché de nombres DNS que consultó la máquina:

Crear carpeta de recoleccion volatil con marca de tiempo UTC

```powershell:terminal
$TimeUtc = (Get-Date).ToUniversalTime().ToString("yyyyMMddTHHmmssZ")
$SnapDir = "C:\Evidencias\Volatil_$($env:COMPUTERNAME)_$TimeUtc"
New-Item -ItemType Directory -Path $SnapDir -Force | Out-Null
```

Capturar sesiones de usuario activas (locales y por Escritorio Remoto RDP)

```powershell:terminal
quser 2>&1 | Out-File "$SnapDir\01_sesiones_usuarios.txt" -Encoding UTF8
Get-Date -Format o | Out-File "$SnapDir\00_timestamp_inicio.txt" -Encoding UTF8
```

Capturar conexiones TCP activas cruzando con el nombre del proceso y su PID

```powershell:terminal
Get-NetTCPConnection | Select-Object LocalAddress, LocalPort, RemoteAddress, RemotePort, State, OwningProcess, @{Name="ProcessName";Expression={(Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).ProcessName}} | Sort-Object State | Format-Table -AutoSize | Out-String -Width 4096 | Out-File "$SnapDir\02_conexiones_tcp.txt" -Encoding UTF8
```

Capturar todos los procesos incluyendo su proceso padre (ParentProcessId) y la linea de comandos exacta (CommandLine)

```powershell:terminal
Get-CimInstance Win32_Process | Select-Object ProcessId, ParentProcessId, Name, ExecutablePath, CommandLine, CreationDate | Export-Csv -Path "$SnapDir\03_procesos_completos.csv" -NoTypeInformation -Encoding UTF8
```

Capturar la cache DNS local (muestra que dominios consulto el malware recientemente) y tabla ARP

```powershell:terminal
Get-DnsClientCache | Select-Object Entry, Name, Data, TimeToLive | Out-File "$SnapDir\04_cache_dns.txt" -Encoding UTF8
Get-NetNeighbor | Out-File "$SnapDir\05_tabla_arp.txt" -Encoding UTF8
```

Comprimir la carpeta y calcular el hash SHA-256 para la cadena de custodia

```powershell:terminal
$ZipFile = "$SnapDir.zip"
Compress-Archive -Path "$SnapDir\*" -DestinationPath $ZipFile -Force
$Hash = Get-FileHash -LiteralPath $ZipFile -Algorithm SHA256
"$($Hash.Hash)  $($Hash.Path)" | Out-File "$SnapDir.sha256" -Encoding UTF8
Set-ItemProperty -Path $ZipFile, "$SnapDir.sha256" -Name IsReadOnly -Value $true
```

Verifica que el archivo `.zip` y su firma `.sha256` estén listos en `C:\Evidencias\`:

```powershell:terminal
Get-Content "$SnapDir.sha256"
```

:::

> [!TIP:Volcado completo de memoria RAM (Nivel CIS IG3)]
> Si la organización cuenta con personal experimentado o soporte forense externo (DFIR) y enfrenta un ataque sofisticado en un servidor crítico, antes de aislar o apagar el equipo se puede realizar una copia bit a bit de toda la memoria RAM hacia un disco externo. En **Windows** se utiliza la herramienta gratuita de línea de comandos `WinPmem` o `DumpIt`, mientras que en **Linux** se emplea el proyecto de código abierto `LiME` (_Linux Memory Extractor_) o `avml` de Microsoft (que no requiere compilar módulos del kernel). Este archivo `.raw` o `.lime` permite luego analizar con herramientas como Volatility contraseñas en texto claro y código inyectado en memoria.

### Contención técnica en el Endpoint y la Red

Una vez resguardada la fotografía volátil del sistema, el paso inmediato es **incomunicar al equipo comprometido** para que el atacante pierda el control remoto y el código malicioso no pueda propagarse hacia las máquinas vecinas ni extraer datos a Internet.

Sin embargo, al aislar un servidor remoto (por ejemplo, un servidor alojado en un centro de datos, en otra oficina o en la nube), existe un riesgo operativo clásico: si se ejecuta un comando que apaga la placa de red (como `ip link set eth0 down`) o bloquea el 100% de los puertos sin excepción, se perderá la propia conexión administrativa de consola y quedando fuera del servidor.

La técnica correcta de contención consiste en aplicar una **regla de cuarentena en el firewall del propio sistema operativo** que bloquee absolutamente todo el tráfico entrante y saliente, **excepto la dirección IP exacta de la computadora del administrador** desde la cual estás realizando la respuesta.

#### Parte A (Nivel IG1): Aislamiento de emergencia con herramientas nativas

A continuación se presenta el procedimiento exacto para poner en cuarentena un equipo Linux, Windows o macOS utilizando únicamente las herramientas que ya vienen instaladas de fábrica en el sistema operativo, guardando primero la configuración previa para que la medida sea 100% reversible.

_Se requieren privilegios de administrador (`sudo` / Administrador) y conocer con certeza la dirección IP de la propia estación de trabajo administrativa (en los ejemplos se usará `10.10.99.5`; reemplázala siempre por tu IP real)._

:::steps

### 1. Aislar un servidor en Linux con `iptables` o `nftables`

Antes de tocar el cortafuegos, guarda siempre un respaldo de las reglas actuales para poder restaurarlas después del incidente. Luego, aplica las políticas de bloqueo total (`DROP`) permitiendo exclusivamente el tráfico desde y hacia tu IP de administración (`10.10.99.5`):

Definir la direccion IP de tu estacion de administracion segura (CAMBIAR POR TU IP REAL)

```bash:terminal
ADMIN_IP="10.10.99.5"
```

Guardar respaldo del estado actual de reglas para garantizar reversibilidad

```bash:terminal
sudo iptables-save > /var/evidencias/backup_iptables_pre_contencion.rules
```

Insertar en la posicion #1 el permiso exclusivo para nuestra IP de administracion (Entrada y Salida)

```bash:terminal
sudo iptables -I INPUT 1 -s "${ADMIN_IP}" -j ACCEPT
sudo iptables -I OUTPUT 1 -d "${ADMIN_IP}" -j ACCEPT
```

Permitir interfaz local interna (loopback) para no colapsar procesos internos del sistema

```bash:terminal
sudo iptables -I INPUT 2 -i lo -j ACCEPT
sudo iptables -I OUTPUT 2 -o lo -j ACCEPT
```

Establecer politica por defecto DROP (Bloquear todo el resto del trafico entrante, saliente y reenviado)

```bash:terminal
sudo iptables -P INPUT DROP
sudo iptables -P FORWARD DROP
sudo iptables -P OUTPUT DROP
```

Eliminar cualquier otra regla previa que pudiera estar permitiendo trafico en las cadenas

```bash:terminal
sudo iptables -F INPUT
sudo iptables -F OUTPUT
sudo iptables -F FORWARD
sudo iptables -A INPUT -i lo -j ACCEPT
sudo iptables -A OUTPUT -o lo -j ACCEPT
sudo iptables -A INPUT -s "${ADMIN_IP}" -j ACCEPT
sudo iptables -A OUTPUT -d "${ADMIN_IP}" -j ACCEPT
```

- **Equivalente si el servidor utiliza `nftables` puro:**

```bash:terminal
# Respaldar reglas actuales de nftables y aplicar tabla de cuarentena
sudo nft list ruleset > /var/evidencias/backup_nftables_pre_contencion.nft
sudo nft flush ruleset
sudo nft add table inet cuarentena
sudo nft 'add chain inet cuarentena input { type filter hook input priority 0; policy drop; }'
sudo nft 'add chain inet cuarentena output { type filter hook output priority 0; policy drop; }'
sudo nft add rule inet cuarentena input iif lo accept
sudo nft add rule inet cuarentena output oif lo accept
sudo nft add rule inet cuarentena input ip saddr 10.10.99.5 accept
sudo nft add rule inet cuarentena output ip daddr 10.10.99.5 accept
```

### 2. Aislar un servidor o estación en Windows (PowerShell e Interfaz Gráfica)

En sistemas Windows, se utiliza `netsh` y los comandos de `Windows Defender Firewall` desde PowerShell como Administrador para exportar un respaldo de la configuración actual, bloquear todas las conexiones entrantes y salientes, y crear únicamente la regla de excepción para tu IP de administración:

Definir la IP de la estacion de administracion segura

```powershell:terminal
$AdminIP = "10.10.99.5"
```

Exportar la configuracion actual del firewall para poder revertir los cambios al finalizar

```powershell:terminal
netsh advfirewall export "C:\Evidencias\backup_firewall_pre_contencion.wfw"
```

Crear reglas de permiso exclusivo (Entrada y Salida) para la IP del administrador

```powershell:terminal
New-NetFirewallRule -DisplayName "LILIUM-CUARENTENA-Admin-In" -Direction Inbound -RemoteAddress $AdminIP -Action Allow -Profile Any
New-NetFirewallRule -DisplayName "LILIUM-CUARENTENA-Admin-Out" -Direction Outbound -RemoteAddress $AdminIP -Action Allow -Profile Any
```

Deshabilitar temporalmente las reglas permisivas existentes o fijar bloqueo total por defecto (Nota: Para que el bloqueo saliente sea absoluto en Windows, desactivamos las reglas Allow activas salvo las de cuarentena)

```powershell:terminal
Get-NetFirewallRule | Where-Object { $_.Enabled -eq 'True' -and $_.Action -eq 'Allow' -and $_.DisplayName -notlike 'LILIUM-CUARENTENA-*' } | Select-Object -ExpandProperty Name | Out-File "C:\Evidencias\reglas_allow_previas.txt"

Set-NetFirewallProfile -Profile Domain,Public,Private -DefaultInboundAction Block -DefaultOutboundAction Block
Get-Content "C:\Evidencias\reglas_allow_previas.txt" | ForEach-Object { Disable-NetFirewallRule -Name $_ }
```

- **Alternativa por Interfaz Gráfica (GUI) en Windows:** Si estás frente al equipo afectado o conectado por consola del hipervisor, abre Windows Defender Firewall con seguridad avanzada (`wf.msc`). En el panel central haz clic en **Propiedades de Windows Defender Firewall** y, dentro de las pestañas _Perfil de dominio_, _Perfil privado_ y _Perfil público_, cambia tanto **Conexiones entrantes** como **Conexiones salientes** a **Bloquear**. Si estás frente a una computadora portátil de oficina comprometida y no requieres acceso remoto, el método físico inmediato consiste en **apagar el interruptor de Wi-Fi y desconectar el cable de red Ethernet**, manteniendo el equipo encendido con su cargador conectado.

### 3. Aislar un equipo en macOS (Firewall `pfctl` o Interfaz Gráfica)

En sistemas macOS, el motor de firewall nativo a nivel de kernel es **Packet Filter (`pf`)**. Para aislar una Mac por terminal permitiendo solo la IP administrativa:

1. Crear archivo de reglas de cuarentena PF permitiendo solo loopback y la IP administrativa

```bash:terminal
sudo tee /etc/pf.cuarentena.conf >/dev/null <<'EOF'
set skip on lo0
block drop all
pass in quick from 10.10.99.5 to any
pass out quick from any to 10.10.99.5
EOF
```

2. Activar el motor pf cargando exclusivamente el archivo de cuarentena

```bash:terminal
sudo pfctl -f /etc/pf.cuarentena.conf -e
```

- **Por Interfaz Gráfica en macOS:** Si el analista se encuentra físicamente frente a la Mac, basta con hacer clic en el icono de **Wi-Fi** en la barra superior de menús para desactivarlo y desconectar cualquier adaptador Ethernet, dejando la sesión abierta para la recolección local.
  :::

#### Parte B (Nivel IG2/IG3): Contención asistida por Wazuh Active Response y EDR

Cuando la organización opera en un nivel de madurez intermedio o avanzado y ya desplegó agentes de monitoreo (como Wazuh visto en el Módulo 05 o una solución comercial de Detección y Respuesta en Endpoints), la contención puede ejecutarse de forma remota o automatizada en segundos desde el panel central:

:::group title="Mecanismos de Contención mediante Agentes de Seguridad"

- Wazuh Active Response (Código Abierto) [opcional]: El agente de Wazuh incluye módulos de respuesta activa (`active-response`) preinstalados en `/var/ossec/active-response/bin/` (en Linux/macOS) y `C:\Program Files (x86)\ossec-agent\active-response\bin\` (en Windows). Permite ejecutar scripts automáticos o manuales desde el Wazuh Manager cuando se dispara una regla crítica: por ejemplo, `firewall-drop` o `route-null` (que bloquean al instante la dirección IP del atacante en el cortafuegos local del servidor durante el tiempo configurado) o `disable-account` (que bloquea la cuenta de usuario comprometida en el acto).
- Aislamiento Nativo de Host en EDR (Host Isolation) [opcional]: En plataformas EDR dedicadas, el operador cuenta con un botón de **Aislamiento de Red (_Isolate Host_)** en la consola web. Al presionarlo, el controlador a nivel de kernel del agente bloquea todas las comunicaciones de red de la máquina comprometida en tiempo real, manteniendo abierto única y exclusivamente el túnel cifrado entre el agente y el servidor central del EDR. Esto permite investigar el equipo, abrir una consola remota y recolectar archivos sin que el atacante pueda comunicarse con el exterior ni moverse hacia la red local.
  :::

> [!WARNING:Limitación de las respuestas automáticas (Riesgo de autodenegación de servicio)]
> Si configuras un módulo de respuesta activa automática como `firewall-drop` en Wazuh para que bloquee cualquier dirección IP que genere alertas, **declara siempre en la lista blanca (`<white_list>` en `ossec.conf`) las direcciones IP de tus propios servidores DNS internos, puertas de enlace (gateways), controladores de dominio y estaciones de administración**. De lo contrario, un atacante habilidoso podría falsificar el origen de un paquete malicioso (_IP Spoofing_) haciéndolo pasar por la IP de tu servidor DNS interno, provocando que tu propio servidor se bloquee a sí mismo y quede incomunicado.

### Revocación de accesos e identidades comprometidas (`MITRE T1078`)

Aislar un servidor mediante su cortafuegos detiene el tráfico sobre esa máquina específica, pero en la mayoría de los incidentes actuales el atacante también ha robado contraseñas o credenciales de usuario (técnica catalogada en MITRE ATT&CK como **`T1078: Valid Accounts`**). Si contienes el servidor `A` pero el intruso ya conoce la contraseña o tiene una sesión abierta del usuario administrador, simplemente la usará un minuto después para entrar al servidor `B` o al correo corporativo en la nube.

> [!CRITICAL:Por qué cambiar la contraseña NO alcanza para expulsar a un atacante]
> Uno de los errores técnicos más peligrosos al responder ante el robo de una cuenta (especialmente en servicios en la nube como Microsoft 365, Google Workspace o aplicaciones web modernas) consiste en **cambiar únicamente la contraseña del usuario** y dar el problema por resuelto.
> Los sistemas modernos no verifican la contraseña en cada clic; cuando alguien inicia sesión con éxito, el servidor le entrega al navegador o aplicación un **Token de Sesión** (_Session Cookie_, _Access Token_ o _Refresh Token_ de OAuth/SAML) que puede durar días o semanas. Si el atacante ya inició sesión —o si robó la cookie de sesión del navegador del empleado—, **aunque cambies la contraseña diez veces, la sesión abierta del atacante seguirá siendo válida y continuará dentro de la cuenta sin que nadie le vuelva a pedir la clave**.
> Para contener una identidad comprometida es obligatorio ejecutar tres acciones conjuntas: **1) Deshabilitar o cambiar la credencial**, **2) Revocar todas las sesiones activas y tokens emitidos**, y **3) Eliminar métodos de autenticación multifactor (MFA) o claves que el atacante haya agregado**.

#### Procedimiento práctico: Corte inmediato de cuentas y sesiones activas

A continuación se detalla cómo expulsar en el acto a un usuario comprometido en Linux, Windows / Active Directory y plataformas de identidad en la nube:

:::steps

### 1. Bloquear cuenta y matar sesiones activas en Linux

En Linux, bloquear la contraseña de un usuario impide futuros ingresos, pero no cierra las terminales SSH que el atacante ya tenga abiertas ni detiene los programas que dejó corriendo en segundo plano. Ejecuta esta secuencia de tres pasos para bloquear la cuenta, invalidar su consola de inicio y terminar todos sus procesos vivos:

```bash:terminal
# Definir el nombre de la cuenta comprometida
COMP_USER="jperez"

# 1. Bloquear la contrasena (-L) y expirar la cuenta inmediatamente (-e 1)
sudo usermod -L -e 1 "${COMP_USER}"

# 2. Cambiar su interprete de comandos a /usr/sbin/nologin (impide entrar incluso si puso una clave SSH)
sudo usermod -s /usr/sbin/nologin "${COMP_USER}"

# 3. Matar de inmediato todas las sesiones SSH y procesos en ejecucion de ese usuario
sudo pkill -9 -u "${COMP_USER}"

# 4. Verificar que no quede ningun proceso vivo perteneciente a la cuenta
ps -u "${COMP_USER}"

```

### 2. Bloquear cuenta y cerrar sesiones en Windows y Active Directory (PowerShell)

En entornos Windows, deshabilita la cuenta local o de dominio y fuerza el cierre de cualquier sesión interactiva o de Escritorio Remoto (`RDP`) que el usuario mantenga abierta en el servidor:

```powershell:terminal
$CompUser = "jperez"

# Opcion A: Si es una cuenta local del servidor Windows
Disable-LocalUser -Name $CompUser
Get-LocalUser -Name $CompUser | Select-Object Name, Enabled

# Opcion B: Si es una cuenta de Dominio Active Directory (ejecutar en Controlador de Dominio o con modulo AD)
# Disable-ADAccount -Identity $CompUser

# Identificar si el usuario tiene una sesion activa en el servidor y cerrarla forzosamente (logoff)
quser
# Si 'quser' muestra que jperez tiene el ID de sesion 3, se expulsa en el acto con:
# logoff 3

```

### 3. Revocar sesiones, tokens y aplicaciones en la Nube (Microsoft 365 / Google Workspace)

Si la cuenta comprometida pertenece al entorno de correo o identidad en la nube de la PyME, realiza de inmediato estos pasos desde la consola de administración (con una cuenta de administrador limpia):

- **En Microsoft Entra ID (Microsoft 365):**

1. Ingresa al centro de administración (`entra.microsoft.com`) → **Usuarios** → **Todos los usuarios** y selecciona la cuenta afectada.
2. En el menú superior, haz clic en **Revocar sesiones** (_Revoke sessions_). Esto invalida instantáneamente todos los _Refresh Tokens_ y cookies en todos los dispositivos del mundo.
3. En la sección **Propiedades**, cambia **Bloquear el inicio de sesión** a **Sí** mientras investigas, o restablece la contraseña.
4. Entra en **Métodos de autenticación** de ese usuario y verifica que el atacante no haya registrado un teléfono o aplicación autenticadora propia; si ves un dispositivo desconocido, elimínalo y haz clic en **Requerir nuevo registro de autenticación multifactor**.

- **En Google Workspace:**

1. Ingresa a la consola de administración (`admin.google.com`) → **Directorio** → **Usuarios** y selecciona al usuario.
2. En la sección **Seguridad** del usuario, desplázate hasta **Cookies de inicio de sesión** y haz clic en **Restablecer** (_Reset Sign-In Cookies_).
3. Revisa **Aplicaciones conectadas** (aplicaciones de terceros con acceso OAuth) y revoca cualquier aplicación sospechosa, además de verificar en la configuración de Gmail del usuario que no existan direcciones de reenvío automático ocultas.
   :::

> [!NOTE:No olvides las claves API, tokens de código y accesos de proveedores]
> Si el activo comprometido es un servidor de aplicaciones web o la computadora de un desarrollador de software, el atacante pudo haber leído los archivos de configuración (como archivos `.env` o repositorios Git) donde se guardan las claves de conexión (`API Keys`) hacia pasarelas de pago, servicios de almacenamiento en la nube (AWS S3, Vercel, Cloudflare) o bases de datos externas. Durante la contención, identifica qué llaves residían en esa máquina y **revócalas o desactívalas desde el panel del proveedor externo**, además de suspender temporalmente cualquier cuenta de soporte técnico de proveedores externos (_MSP_) que tuviera acceso al equipo afectado.

### Registro, reversibilidad y verificación de la contención

Toda acción de contención modifica el comportamiento de la red o de los sistemas en medio de una urgencia. Si el técnico bloquea puertos, desactiva cuentas de servicio y modifica rutas sin anotar exactamente qué tocó, cuando la empresa quiera volver a trabajar dos días después nadie sabrá por qué el sistema de facturación sigue sin conectarse.

Por ello, el cierre de cada maniobra de contención exige cumplir tres reglas de control:

1. **Registro inmediato en la bitácora del incidente (`06.1`):** Cada regla de cortafuegos aplicada y cada cuenta deshabilitada debe anotarse con su hora `UTC` y la ruta donde se guardó el archivo de respaldo previo (`backup_iptables_pre_contencion.rules` o `backup_firewall_pre_contencion.wfw`).
2. **Garantía de reversibilidad:** Todo bloqueo de contención temporal debe tener documentado su comando exacto de reversión (por ejemplo, `sudo iptables-restore < /var/evidencias/backup_iptables_pre_contencion.rules` en Linux o `netsh advfirewall import "C:\Evidencias\backup_firewall_pre_contencion.wfw"` en Windows) para ejecutarlo únicamente cuando se complete la fase de erradicación y recuperación (`06.4`).
3. **Verificación técnica del aislamiento:** Nunca des por sentado que un equipo quedó contenido solo porque el comando no dio error; debes probar activamente que el servidor ya no puede comunicarse con el resto de la red ni con Internet.

### Escalonamiento PyME: De la contención manual a la respuesta automatizada

La siguiente matriz resume cómo aplicar la preservación de evidencia y la contención de acuerdo con los recursos y el nivel de madurez de tu organización:

| Nivel de Madurez                                                                                                 | Objetivo Operativo                                                                                          | Qué implementar en la práctica (Enfoque "Take as is")                                                                                                                                                                                                                                                                                                                                                                               |
| ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nivel Base (Core — CIS IG1)**<br>_(PyME pequeña sin herramientas EDR dedicadas)_                               | Frenar el ataque en minutos con herramientas nativas sin destruir pistas clave por apagar equipos a ciegas. | **1. No desenchufar por impulso:** Aplicar la matriz de decisión (solo cortar red de inmediato ante _ransomware_ o robo masivo; nunca apagar la corriente salvo emergencia extrema).<br>**2. Comandos listos:** Tener a mano en el kit offline los comandos de captura volátil (`ss`, `ps`, `Get-NetTCPConnection`), el aislamiento con `iptables` / `netsh` y los pasos para revocar sesiones en Microsoft 365 / Google Workspace. |
| **Nivel Intermedio (Avanzado — CIS IG2)**<br>_(PyME estructurada con SIEM / Wazuh o VLANs)_                      | Agilizar el aislamiento desde consolas centralizadas y contener a nivel de segmentación de red.             | **1. Scripts de captura automatizados:** Mantener un script `.sh` y `.ps1` firmado para que cualquier administrador recolecte toda la evidencia volátil y su hash `SHA-256` ejecutando un solo comando.<br>**2. Contención en red y agente:** Aislar servidores cambiando su puerto a una VLAN de cuarentena en el switch/firewall (Módulo 03) o utilizando **Wazuh Active Response** con lista blanca segura configurada.          |
| **Nivel Maduro (Avanzado — CIS IG3)**<br>_(Organización con operación crítica o regulada)_                       | Aislamiento instantáneo de endpoints a nivel de kernel y adquisición forense profunda de memoria RAM.       | Utilizar capacidades de aislamiento de host en un clic (_Host Isolation_) mediante agentes EDR comerciales o integraciones avanzadas, y contar con utilidades predesplegadas (`LiME`, `avml`, `WinPmem`) para realizar volcados completos de memoria RAM ante intrusiones complejas antes de pasar a la erradicación.                                                                                                               |
| _Escalonamiento práctico de contención y preservación de evidencia volátil según la madurez de la organización._ |                                                                                                             |                                                                                                                                                                                                                                                                                                                                                                                                                                     |

### Verificación rápida de la subsección

Antes de avanzar a la subsección `06.3` para investigar la causa raíz del ataque y erradicar los mecanismos de persistencia, ejecuta este ciclo práctico (**Configurar → Verificar → Simular**) en una máquina virtual o entorno de prueba para dominar la maniobra antes de enfrentarte a una emergencia real:

:::steps

### 1. Ejecutar y verificar la captura de evidencia volátil

Corre en tu máquina de prueba la secuencia de captura volátil correspondiente a su sistema operativo (Linux o Windows PowerShell). Comprueba que se haya generado el archivo comprimido (`.tar.gz` o `.zip`), que dentro de él sean legibles las listas de procesos y conexiones de red, y que la validación de su firma criptográfica (`sha256sum -c` o `Get-FileHash`) confirme su integridad.

### 2. Aplicar el aislamiento de emergencia preservando tu sesión administrativa

Anota la dirección IP de tu computadora principal y aplica en la máquina de prueba las reglas de cuarentena de cortafuegos (`iptables`/`nftables` en Linux o `netsh` / `Set-NetFirewallProfile` en Windows) permitiendo únicamente tu IP. Verifica que **no has perdido tu sesión remota de consola**.

### 3. Simular un intento de conexión saliente y practicar la reversión

Desde dentro de la máquina puesta en cuarentena, intenta hacer una conexión hacia Internet o hacia otro equipo de tu red local (por ejemplo, `ping -c 3 8.8.8.8` o `curl -I [https://example.com](https://example.com)`).

- **Resultado esperado de contención:** El sistema debe devolver un error inmediato de operación no permitida o bloqueo (`Operation not permitted` / `General failure`), demostrando que un código malicioso en esa máquina ya no puede comunicarse con el atacante ni propagarse.
- **Prueba de reversibilidad:** Ejecuta el comando de restauración del respaldo de tu cortafuegos (`iptables-restore` o `netsh advfirewall import`) y comprueba que la máquina recupera su conectividad normal sin errores.
  :::

## 6.3. Investigación y Erradicación <!-- id: incident-investigation, icon: SearchCheckIcon, displayTitle: 6.3 — Investigación y Erradicación, description: Reconstrucción de lo ocurrido, determinando el alcance del compromiso y eliminando las amenazas. -->

## 6.4. Recuperación y Restauración <!-- id: secure-recovery, icon: RefreshCwIcon, displayTitle: 6.4 — Recuperación y Restauración Segura, description: Restauración de los sistemas y servicios afectados de forma controlada, verificando su integridad, funcionamiento y seguridad antes de volver a operarlos. -->

## 6.5. Playbooks de Respuesta <!-- id: incident-playbooks, icon: ClipboardListIcon, displayTitle: 6.5 — Playbooks de Respuesta, description: Playbooks con procedimientos prácticos detallados para gestionar escenarios frecuentes de seguridad, como el compromiso de cuentas, el ransomware y la exposición de servicios. -->

## 6.6. Cierre del Incidente <!-- id: incident-closure, icon: MessageSquareTextIcon, displayTitle: 6.6 — Cierre de un Incidente, description: Gestioón de las comunicaciones durante el incidente para formalizar su cierre y transformar las lecciones aprendidas en mejoras para la seguridad. -->
