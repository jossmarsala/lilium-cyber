# 5) Detectar <!-- id: layer-5 -->

# **Módulo 5: Detección y Visibilidad Operativa**

Ningún control preventivo es infalible. Cuando un adversario sortea una barrera —por ejemplo, usando credenciales legítimas robadas— la diferencia entre un incidente contenido y una catástrofe operativa reside en una única capacidad: la visibilidad. Sin monitoreo, una organización puede permanecer ciega durante semanas mientras el atacante explora la red, extrae información y compromete las copias de seguridad.

Pero activar todas las alertas posibles sin criterio genera el problema opuesto: miles de notificaciones irrelevantes que saturan al equipo técnico hasta que las advertencias críticas se ignoran. Este módulo enseña a construir una capacidad de detección proporcional a la madurez de la organización, desde la gestión de registros y el monitoreo de red hasta el triaje estructurado de alertas que abre paso al Módulo 6.

## **¿Qué vas a aprender?**

- Distinguir eventos, alertas e incidentes, y gestionar el ciclo de vida de los registros.
- Monitorear el tráfico de red e identificar intrusiones con las herramientas adecuadas.
- Comprender la visibilidad en endpoints y el monitoreo de integridad de archivos.
- Centralizar datos en un SIEM y diseñar reglas de correlación.
- Aplicar inteligencia de amenazas, indicadores de compromiso y caza proactiva de adversarios.
- Ejecutar un triaje riguroso de alertas y declarar incidentes de forma fundamentada.

## **¿Para quién está pensado?**

Este módulo está dirigido a quienes ya comprenden los controles preventivos de los módulos anteriores y necesitan dar el siguiente paso: operar con visibilidad real. Está estructurado en dos niveles —**Base — IG1** para empresas con recursos limitados y **Avanzado — IG2/IG3** para equipos con infraestructura dedicada— de modo que cada perfil pueda priorizar lo que le resulta más útil sin sentirse desbordado por herramientas que aún no corresponden a su contexto.

:::subindex
title="Índice del módulo"
:::

## 5.1. Básicos de Visibilidad <!-- id: fundamentos-visibilidad-logs, icon: CommandLineIcon -->

Implementar controles de seguridad reduce drásticamente la superficie de exposición de una empresa, pero ninguna barrera preventiva es infalible. Cuando un atacante logra saltear un control inicial —por ejemplo, empleando las credenciales válidas de un empleado obtenidas mediante ingeniería social—, la diferencia entre un incidente contenido a tiempo y una catástrofe operativa reside en una única capacidad: la visibilidad. En la mayoría de las pequeñas empresas, los servidores y estaciones de trabajo operan a ciegas; no registran qué ocurre en su interior o sobrescriben sus historiales cada pocos días, permitiendo que un intruso explore la red durante semanas sin que nadie note su presencia.

Esta subsección establece los cimientos de la etapa de detección: define qué materia prima informativa (_logs_) debemos generar, cómo proteger su integridad desde que nace hasta que se elimina y cómo auditar la infraestructura respetando la privacidad y el secreto de los datos.

### Distinción conceptual y operativa: Evento, Alerta e Incidente

En operaciones de seguridad, los términos evento, alerta e incidente son ampliamente utilizados, por ello es conveniente entender a qué se refieren.

:::group title="Estructura base para detectar amenazas"

- Evento [ocurrencia]: Es cualquier suceso observable y verificable que tiene lugar en un sistema, dispositivo de red o aplicación en un momento determinado. La inmensa mayoría de los eventos son completamente benignos y reflejan la operación normal del negocio: un usuario que inicia sesión por la mañana, una consulta al Sistema de Nombres de Dominio (DNS) para abrir un sitio web, la creación de un proceso en memoria o una tarea programada de copia de seguridad.
- Alerta [señal]: Es una notificación generada de forma automática cuando un evento individual o una secuencia correlacionada de eventos supera un umbral predefinido, coincide con una regla de detección o se desvía de un perfil estadístico de normalidad. Una alerta no confirma por sí misma que exista un ataque; es un llamado de atención técnico que exige validación humana (triaje) para determinar si se trata de una amenaza real o de una actividad legítima inusual (como un administrador realizando mantenimiento nocturno).
- Incidente de seguridad [compromiso confirmado]: Es un evento o serie de eventos adversos verificados que vulneran las políticas de seguridad o comprometen de forma real o inminente la confidencialidad, la integridad o la disponibilidad de los activos. A diferencia de la alerta, el incidente exige activar formalmente los procedimientos de respuesta, contención y recuperación.
  :::

Comprender esta jerarquía transforma la mentalidad del responsable de infraestructura: los sistemas generan millones de **eventos** registrados en archivos de texto; los motores de monitoreo filtran esos eventos para producir decenas de **alertas**; y el análisis técnico depura esas alertas para identificar y escalar los contados **incidentes** verdaderos que requieren intervención.

### El ciclo de vida del registro (_Log Lifecycle_)

Un registro de auditoría (conocido universalmente como _log_) es la constancia cronológica e inmutable que deja un sistema sobre los eventos que ocurren en él. Para que un registro sirva como herramienta de detección en vivo y como evidencia válida durante una investigación forense, no basta con que el software lo escriba en un archivo local; debe administrarse a través de un ciclo de vida continuo de cuatro etapas.

#### 1. Generación y recolección

La primera etapa consiste en definir qué activos emitirán registros y qué nivel de detalle incluirán. Todo registro de seguridad útil debe ser capaz de responder a las cinco dimensiones básicas de cualquier investigación:

- **Quién (_Who_):** Qué identidad de usuario, cuenta de servicio o proceso ejecutó la acción.
- **Qué (_What_):** Qué operación específica se intentó realizar (inicio de sesión, lectura de archivo, ejecución de comando, cambio de permisos) y cuál fue su resultado (éxito o fallo).
- **Cuándo (_When_):** La marca de tiempo exacta (_timestamp_) en la que ocurrió el evento, idealmente expresada en Tiempo Universal Coordinado (UTC) o con su desplazamiento de zona horaria explícito (estándar ISO 8601) para evitar ambigüedades.
- **Dónde (_Where_):** En qué activo específico (nombre de host, servidor, contenedor o aplicación) se registró la actividad.
- **Origen y Destino (_Source / Destination_):** Desde qué dirección IP, puerto o terminal provino la solicitud y hacia qué recurso iba dirigida.

> [!NOTE:El requisito indispensable de la sincronización horaria]
> Estandarizar la sincronización de tiempo mediante el Protocolo de Tiempo de Red (NTP, _Network Time Protocol_, en el puerto `UDP 123`) contra fuentes confiables es un pilar obligatorio para dar validez cronológica a cualquier registro.

#### 2. Normalización y análisis sintáctico o _Parsing_

En una infraestructura real, cada fabricante escribe sus registros con una estructura diferente: un servidor Linux genera líneas de texto separadas por espacios bajo el estándar Syslog, una aplicación web moderna emite objetos estructurados en formato JSON, y un servidor Microsoft Windows registra eventos en un formato binario propio (EVTX) identificado por códigos numéricos.

Cuando la organización escala y centraliza sus registros, entra en juego el proceso de **análisis sintáctico (_parsing_) y normalización**: el sistema recolector descompone cada línea cruda para extraer sus valores y los traduce a un diccionario de nombres de campos unificado (por ejemplo, convirtiendo `src_ip`, `ClientIP` y `IpAddress` en un único campo estándar llamado `source.ip`). Esto permite buscar una dirección sospechosa en toda la empresa con una sola consulta, sin importar qué tipo de equipo generó el dato.

#### 3. Almacenamiento, rotación y retención

Los archivos de registro crecen de manera ininterrumpida. Si un servidor web o un controlador de dominio sufre un ataque de fuerza bruta que genera miles de eventos por minuto y no cuenta con límites de almacenamiento, la partición del disco se llenará al 100%, provocando la caída del sistema operativo o deteniendo la escritura de nuevos _logs_.

Para evitar esta denegación de servicio autoinfligida y cumplir a la vez con los plazos de investigación, la arquitectura aplica dos mecanismos:

- **Rotación automática de registros:** Utilidades nativas como `logrotate` en sistemas Linux comprimen periódicamente los archivos de registro antiguos (por ejemplo, a diario o cuando superan un tamaño determinado en megabytes), crean un archivo nuevo limpio y eliminan los archivos comprimidos más viejos una vez cumplido el ciclo.
- **Política de retención mínima:** Dado que una PyME puede tardar semanas o meses en notar una intrusión silenciosa, conservar únicamente los registros de las últimas 48 horas impide saber cómo ingresó el atacante. Mientras que en un nivel inicial de seguridad (IG1) se asegura el espacio en disco disponible, en un nivel más consolidado (IG2+) se establece una retención mínima de **90 días** en almacenamiento activo o archivado.

```bash:terminal
# Inspeccionar la política de rotación general en un servidor Debian/Ubuntu
cat /etc/logrotate.conf | grep -E "weekly|rotate|compress"
```

El comando anterior permite verificar cuántas semanas o ciclos se conservan localmente los archivos antes de ser sobrescritos y si se aplica compresión para optimizar el espacio en disco.

#### 4. Control de acceso e integridad del registro

Desde la perspectiva de un atacante que ha logrado obtener privilegios de administrador (`root` o `SYSTEM`) en un servidor, su prioridad inmediata después de asegurar su acceso es borrar las huellas de su intrusión (táctica catalogada en MITRE ATT&CK bajo la técnica `T1070`: _Indicator Removal_). Si los registros residen únicamente en el disco local del equipo vulnerado con permisos de escritura normales, el intruso simplemente podrá editar o vaciar los archivos en `/var/log/` o ejecutar el borrado del visor de eventos.

Para garantizar la integridad de la evidencia se aplican dos barreras complementarias:

1. **Atributos locales de solo anexado:** En sistemas de archivos Linux (`ext4` / `xfs`), los archivos de _logs_ críticos pueden protegerse aplicando el atributo de "solo anexado" (_append-only_), el cual permite que el sistema agregue nuevas líneas al final del archivo pero impide que se modifiquen o borren las líneas existentes sin retirar antes explícitamente el atributo:

```bash:terminal
# Aplicar atributo append-only (+a) a un archivo de registro crítico y verificarlo
sudo chattr +a /var/log/auth.log
lsattr /var/log/auth.log
```

2. **Reenvío en tiempo real hacia un colector aislado (Avanzado):** Frente a un administrador local comprometido, la única garantía real es transmitir cada línea de registro en el instante mismo en que se genera (mediante protocolos como `rsyslog` sobre TLS en el puerto `TCP 6514` o agentes ligeros) hacia un servidor recolector en otra zona de la red. En este esquema, el origen solo cuenta con permisos para añadir nuevos eventos, sin acceso para leer, modificar o borrar lo ya almacenado.

### Fuentes de telemetría y por qué el historial de consola no es auditoría

Para construir una visibilidad efectiva sin saturar la infraestructura, el administrador debe conocer dónde residen las fuentes primarias de telemetría del sistema operativo y de las aplicaciones.

> [!NOTE:¿Qué es la telemetría?]
> La telemetría en ciberseguridad se refiere a la recopilación y el envío automático de datos sobre lo que ocurre dentro de los sistemas, redes y dispositivos de una organización. Esta información se analiza en tiempo real para detectar comportamientos anómalos, detener amenazas y mejorar las defensas.

#### Principales fuentes de registros en sistemas y red

```filetree:Rutas_Criticas_de_Logs_Linux
/var/log/
├── auth.log (o /var/log/secure)  # Autenticaciones SSH, uso de sudo, creación de usuarios y sesiones PAM (permisos elevados)
├── syslog (o /var/log/messages)  # Eventos generales del sistema operativo, daemons y servicios de red
├── kern.log                      # Mensajes del núcleo (kernel), fallos de memoria y bloqueos de firewall (UFW/nftables)
├── nginx/ o apache2/             # Registros de aplicaciones web publicadas
│   ├── access.log                # Cada petición HTTP recibida (IP, ruta, código de estado, User-Agent)
│   └── error.log                 # Fallos de ejecución, errores de configuración o intentos de explotación
└── audit/
    └── audit.log                 # Registros inmutables del subsistema de auditoría del kernel (auditd)

```

En entornos basados en **Microsoft Windows Server y estaciones Windows**, esta misma telemetría se organiza de forma nativa dentro del Visor de Eventos (_Event Viewer_) en canales específicos, destacándose el canal **Security** (donde se registran eventos fundamentales como el `Event ID 4624` para inicios de sesión exitosos, `4625` para intentos de inicio de sesión fallidos, `4672` para asignación de privilegios administrativos especiales y `4720` para la creación de nuevas cuentas de usuario), junto con los canales **System** y **Application**.

> [!WARNING:Limitaciones de .bash_history como registro de auditoría]
> El historial de la terminal (`~/.bash_history` o `~/.zsh_history`) es una función de comodidad para el usuario, no un control de seguridad. Dado que el archivo reside en el directorio personal, pertenece al propio usuario y solo se vuelca a disco al cerrar la sesión, y resulta fácil de evadir o alterar. Un usuario o atacante puede omitir el registro anteponiendo un espacio al comando, deshabilitarlo en memoria (`unset HISTFILE`, `HISTSIZE=0`, `history -c`), cerrar la sesión abruptamente (`kill -9 $$`) o editar el archivo directamente. Además, por defecto carece de contexto forense esencial como _timestamps_ confiables o distinción entre sesiones simultáneas.

#### Cómo implementar auditoría real de línea de comandos (IG2)

Para cumplir con la auditoría real de línea de comandos y procesos, la captura de _logs_ debe realizarse a nivel del **núcleo del sistema operativo (_kernel_)** o de los subsistemas profundos de ejecución, fuera del control de la consola del usuario:

- **En entornos Linux (`auditd` — _Linux Audit Daemon_):** El demonio `auditd` intercepta directamente las llamadas al sistema (_system calls_) dentro del núcleo del sistema operativo. Cuando cualquier usuario o proceso ejecuta un binario o script, el kernel registra en `/var/log/audit/audit.log` el comando exacto con todos sus argumentos, el directorio de trabajo, el identificador del usuario original que inició la sesión (`auid`, que se mantiene intacto incluso si la persona luego escaló a `root` con `sudo` o `su`) y el identificador del usuario efectivo (`uid`). Aunque el atacante ejecute `unset HISTFILE`, la llamada al sistema queda grabada inmediatamente.

:::steps

### 1. Instalación y verificación del demonio auditd

En un servidor basado en Debian o Ubuntu (requiere permisos de superusuario), instala el paquete oficial de auditoría del kernel y comprueba que el servicio se encuentre activo:

```bash:terminal
sudo apt update && sudo apt install -y auditd audispd-plugins
sudo systemctl status auditd
```

El servicio debe mostrarse como `active (running)`.

### 2. Configuración de una regla persistente para auditar ejecuciones

Crea un archivo de reglas estándar en `/etc/audit/rules.d/50-execve.rules` para registrar toda llamada al sistema `execve` (ejecución de programas en arquitecturas de 64 y 32 bits), etiquetándola con la clave `exec`.

```bash:terminal
sudo tee /etc/audit/rules.d/50-execve.rules << 'EOF'
-a always,exit -F arch=b64 -S execve -k exec
-a always,exit -F arch=b32 -S execve -k exec
EOF
sudo augenrules --load
```

Resultado esperado: `augenrules` compilará las reglas dentro de `/etc/audit/audit.rules` y las cargará en el kernel sin devolver errores de sintaxis.

### 3. Búsqueda y verificación de comandos ejecutados

Ejecuta cualquier comando de prueba y luego utiliza la herramienta nativa `ausearch` filtrando por la clave `exec` con el modificador `-i` para interpretar los identificadores numéricos a nombres legibles:

```bash:terminal
sudo ausearch -k exec -i | tail -n 20
```

Verás el registro exacto con la marca de tiempo, el comando completo (`proctitle`), la ruta del binario ejecutado, el usuario original de inicio de sesión (`auid`) y el resultado de la ejecución, independientemente de lo que ocurra con `.bash_history`.

:::

- **En entornos Windows:** A diferencia de Linux, Windows utiliza el Visor de Eventos nativo, pero por defecto no registra qué comandos exactos ejecuta un usuario en la terminal. Para obtener visibilidad real, se deben activar tres componentes clave mediante comandos (ejecutados en una consola PowerShell como Administrador):

:::steps

### 1. Activar auditoría de procesos con línea de comandos

Primero, se habilita la política para que Windows registre cada vez que se crea un proceso (`Event ID 4688`). Luego, se modifica el registro del sistema para forzar la inclusión del texto exacto que el usuario ingresó (parámetros y argumentos):

```powershell:terminal
auditpol /set /subcategory:"Process Creation" /success:enable /failure:enable
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System\Audit" /v ProcessCreationIncludeCmdLine_Enabled /t REG_DWORD /d 1 /f
```

### 2. Habilitar el registro de scripts en PowerShell

Este control (_Script Block Logging_ — `Event ID 4104`) es vital porque captura el código directamente desde la memoria. Aunque el atacante encripte u ofusque sus comandos en Base64, el sistema registrará el texto limpio justo antes de su ejecución:

```powershell:terminal
reg add "HKLM\SOFTWARE\Policies\Microsoft\Windows\PowerShell\ScriptBlockLogging" /v EnableScriptBlockLogging /t REG_DWORD /d 1 /f
```

### 3. Instalar Sysmon (System Monitor)

Sysmon es una utilidad oficial de Microsoft Sysinternals que amplía enormemente los registros. Captura las creaciones de procesos con su firma criptográfica o _hash_ (`Event ID 1`), qué proceso específico abrió una conexión de red (`Event ID 3`) y qué consultas DNS se realizaron (`Event ID 22`). Su instalación requiere descargar el ejecutable oficial y aplicar un archivo de configuración `.xml` (como las plantillas estándar de la comunidad):

```powershell:terminal
# Se ejecuta en el directorio donde se descargó Sysmon y su configuración
.\Sysmon64.exe -accepteula -i config.xml
```

:::

### Privacidad, minimización de datos y protección de secretos en los registros

Un error grave al configurar _logs_ detallados de aplicaciones o servidores web consiste en transformar el propio sistema de logs en una fuente de filtración de datos. Si los registros capturan sin filtro todo lo que ingresa por un formulario o una API, información altamente confidencial terminará escrita en texto plano dentro de archivos de registro a los que tienen acceso desarrolladores, personal de soporte o proveedores externos.

#### Riesgos críticos de exposición en los archivos de registro

Al diseñar qué campos se guardarán en las trazas de sistemas y aplicaciones propias de la empresa, se debe evitar estrictamente registrar cuatro tipos de datos:

- **Contraseñas tipeadas por error en el campo de usuario:** Es sumamente frecuente que un empleado distraído escriba su contraseña en la casilla de "Nombre de usuario", presione la tecla Enter y falle el inicio de sesión. Si el sistema registra textualmente _"Fallo de autenticación para el usuario: MiClaveSecreta123!"_, cualquier administrador que revise `/var/log/auth.log` o el colector central verá la contraseña real del empleado junto a su intento exitoso un segundo después.
- **Secretos técnicos, tokens de sesión y claves API:** Si un servidor web registra las cabeceras HTTP completas y cookies de sesión o si una aplicación envía tokens de recuperación de contraseña como parámetros dentro de la dirección URL, esos secretos quedarán expuestos en `access.log`, permitiendo que cualquiera con permiso de lectura sobre los registros secuestre las sesiones activas de los usuarios.
- **Información de Identificación Personal (PII) y datos financieros:** Registrar el cuerpo completo (_payload_) de las peticiones `POST` en una tienda en línea o sistema administrativo puede volcar números completos de tarjetas de crédito, documentos de identidad, domicilios o diagnósticos médicos en archivos de texto sin cifrar, violando normativas de protección de datos personales y estándares como PCI-DSS.

> [!TIP:Principios de minimización y sanitización de logs]
> Aplica siempre el principio de **minimización de datos** al configurar el nivel de detalle (_verbosity_) en producción: los niveles `DEBUG` o `TRACE` (que vuelcan variables internas y memoria completa) solo deben activarse temporalmente en entornos de desarrollo con datos ficticios, nunca en producción. En producción, las aplicaciones deben aplicar funciones de **enmascaramiento (_masking_) o sanitización** antes de escribir el registro (por ejemplo, registrando únicamente los últimos 4 caracteres de un token o tarjeta `****-****-****-1234`, y reemplazando el nombre de un usuario inexistente por un identificador genérico `[USUARIO_INVALIDO]` en los fallos de inicio de sesión).

Asimismo, desde el punto de vista legal y organizacional, la implementación de registros que monitorean la actividad de los empleados (como las consultas DNS o solicitudes de direcciones URL en niveles avanzados) debe estar respaldada por una **Política de Uso Aceptable (AUP)** comunicada y firmada previamente por el personal, informando de manera transparente que los equipos y redes corporativas son auditados exclusivamente con fines de seguridad operativa y protección de activos.

### Del nivel básico de visibilidad al nivel Avanzado

Una pequeña organización no debe intentar desplegar todas las capacidades de auditoría el mismo día. La siguiente tabla estructura la hoja de ruta de visibilidad separando los cimientos obligatorios (**CIS IG1**) de las capacidades de madurez intermedia y avanzada (**CIS IG2 e IG3**):

| Nivel de Madurez                                                                                    | Práctica de Visibilidad y Gestión de Registros                                                                                                                                                    | Problema operativo que resuelve                                                                                                 |
| --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Base obligatoria — IG1                                                                              | **Proceso básico y recolección local de logs:** Definir qué activos críticos generan registros, activarlos localmente y asignar un responsable de su cuidado.                                     | Evita que ante un incidente o fallo técnico el servidor tenga las bitácoras desactivadas de fábrica.                            |
| Base obligatoria — IG1                                                                              | **Dimensionamiento de almacenamiento y rotación:** Configurar cuotas de disco y rotación automática (`logrotate` / tamaño máximo de EVTX) en cada activo.                                         | Previene que el llenado de los archivos de registro bloquee el sistema operativo o sobrescriba evidencias del mismo día.        |
| Base recomendada                                                                                    | **Sanitización y privacidad en logs:** Excluir contraseñas, tokens de sesión y datos personales en texto plano de las trazas de producción.                                                       | Impide que los archivos de registro se conviertan en un repositorio de credenciales robables.                                   |
| **Avanzado** _(Estructuración — IG2)_                                                               | **Sincronización horaria estandarizada (`NTP`):** Configurar al menos dos fuentes de tiempo confiables en todos los activos empresariales.                                                        | Permite correlacionar eventos entre distintos servidores y firewalls con precisión de milisegundos.                             |
| **Avanzado** _(Estructuración — IG2)_                                                               | **Registros detallados, DNS, URL y línea de comandos real:** Activar auditoría profunda de cuentas, consultas DNS, peticiones web y ejecución en kernel (`auditd` / `Sysmon`).                    | Descubrir qué ejecutó realmente un atacante aunque borre `.bash_history`, y detectar conexiones hacia dominios de malware.      |
| **Avanzado** _(Estructuración — IG2)_                                                               | **Retención mínima de 90 días y revisiones periódicas:** Conservar registros durante al menos tres meses y establecer una rutina formal (semanal o mensual) de revisión de anomalías.             | Permite investigar intrusiones descubiertas tardíamente y asegura que los logs no se recolecten en vano sin que nadie los mire. |
| **Avanzado** _(Defensa madura — IG3)_                                                               | **Auditoría de acceso a datos sensibles y logs de proveedores:** Registrar cada lectura/modificación de archivos confidenciales y recolectar bitácoras de plataformas en la nube (`SaaS`/`IaaS`). | Detecta exfiltración silenciosa de bases de datos internas o compromisos originados en servicios administrados por terceros.    |
| _Escalonamiento de controles de visibilidad desde la higiene esencial hasta la auditoría avanzada._ |                                                                                                                                                                                                   |                                                                                                                                 |

### Verificación de la base de visibilidad

Para confirmar que los fundamentos de esta sección están correctamente aplicados en un servidor o estación de trabajo antes de pasar al monitoreo de tráfico de red (`05.2`), ejecuta la siguiente secuencia de verificación:

:::steps

### 1. Comprobación de generación activa de eventos de autenticación

Verifica que el sistema esté escribiendo eventos en tiempo real al producirse una elevación de privilegios o inicio de sesión, y comprueba que sus permisos impidan la lectura por parte de usuarios sin privilegios:

```bash:terminal
sudo ls -la /var/log/auth.log
sudo tail -n 5 /var/log/auth.log
```

Resultado esperado: el archivo debe tener tamaño mayor a cero, pertenecer al usuario `root` o `syslog` con grupo `adm` (permisos `0640`, nunca `0644` ni `0777` que permitirían a cualquier usuario leer o alterar el log) y mostrar en la última línea la ejecución misma del comando `sudo` que acabas de correr con la fecha y hora exactas.

### 2. Verificación del estado de sincronización horaria

Comprueba que el reloj del sistema esté sincronizado activamente contra un servidor de tiempo mediante la utilidad nativa `timedatectl`:

```bash:terminal
timedatectl status
```

Resultado esperado: la línea `System clock synchronized:` debe indicar explícitamente `yes` y el servicio `NTP service:` debe figurar como `active`. Si figura como `no`, las marcas de tiempo de este equipo no serán confiables durante un incidente.

### 3. Auditoría rápida de no exposición de secretos en logs web (buena práctica)

Si el servidor aloja una aplicación web o API, realiza una búsqueda rápida mediante expresiones regulares (_regex_) en los _logs_ de acceso para verificar que no se estén guardando tokens, claves o contraseñas como parámetros en texto claro dentro de las direcciones URL.

```bash:terminal
sudo grep -iE "(password=|passwd=|token=|apikey=|secret=)" /var/log/nginx/access.log
```

Resultado esperado: el comando no debe devolver ninguna coincidencia. Si devuelve líneas con credenciales visibles, la aplicación debe modificarse para enviar esos datos en el cuerpo cifrado de una petición `POST` y filtrarlos antes de registrar la traza.
:::

## 5.2. Monitoreo de Red <!-- id: monitoreo-red, icon: NetworkIcon, displayTitle: 05.2 — Monitoreo de Red, description: Fundamentos conceptuales del monitoreo de tráfico de red, enfoques de observación, arquitectura del sensor, limitaciones del cifrado y consideraciones prácticas para PyMEs. -->

La sección anterior estableció los cimientos de la visibilidad interna: registrar y proteger lo que ocurre _dentro_ de cada sistema. Esta sección extiende esa visibilidad hacia la infraestructura de comunicaciones que conecta todos esos sistemas entre sí y con el exterior. Cuando un atacante utiliza credenciales robadas para ingresar a la red corporativa, o cuando un código malicioso logra ejecutarse desde un correo electrónico, la intrusión deja de ser un problema de un solo equipo y se convierte en un problema de red. La diferencia entre contenerla a tiempo o descubrirla semanas después depende, en gran medida, de lo que seamos capaces de observar en el tráfico que circula entre los dispositivos.

Esta sección cubre exclusivamente los conceptos, enfoques y herramientas de monitoreo de red.

### Fundamentos del Monitoreo de Red

#### ¿Por qué monitorear el tráfico de red?

Cuando dos dispositivos se comunican, intercambian información mediante paquetes de red. Estos paquetes contienen datos sobre quién envía la información, quién la recibe, qué protocolo utiliza y, dependiendo de las condiciones de la comunicación, también el contenido transmitido. Observar estas comunicaciones **en conjunto** permite detectar comportamientos que no necesariamente resultan evidentes al mirar cada equipo por separado. Por ejemplo:

- Una computadora que establece conexiones repetitivas cada pocos minutos con un servidor desconocido en Internet.
- Un equipo de oficina que intenta conectarse a cientos de dispositivos de la red local en pocos segundos.
- Un servidor interno que comienza a transferir grandes cantidades de información hacia el exterior durante la madrugada.
- Un dispositivo que establece conexiones hacia servicios o puertos que normalmente nunca utiliza.

Estas situaciones no demuestran automáticamente que exista un ataque, pero representan comportamientos anómalos que merecen investigarse.

#### ¿Por qué no alcanza con revisar los registros de cada equipo?

Los registros locales de cada sistema operativo o aplicación son fundamentales, pero tienen una debilidad estructural: si un atacante compromete una máquina y se mueve lateralmente a otra, realizando acciones aisladas en diferentes endpoints, el equipo de seguridad tendría que revisar _logs_ en cada máquina de forma individual. La observación de red proporciona una fuente independiente de visibilidad, ya que registra las comunicaciones desde los equipos de interconexión (como un _switch_ o un sensor dedicado), fuera del alcance directo del dispositivo comprometido.

La clave en una pequeña o mediana empresa consiste en combinar los registros de los equipos con la observación de la red para obtener una imagen completa de los eventos.

#### Direcciones del tráfico a observar

Como vimos anteriormente, existen dos "direcciones principales" de tráfico:

:::group title="Direcciones del tráfico a observar"

- Tráfico Norte-Sur [Perimetral]: Comunicaciones que entran o salen de la organización, generalmente entre la red interna e Internet. Permite vigilar si un equipo interno se comunica con servidores de atacantes externos o si alguien intenta vulnerar un servicio publicado.
- Tráfico Este-Oeste [Interno / Lateral]: Comunicaciones horizontales entre dispositivos, servidores o diferentes subredes (VLAN) dentro de la propia empresa. Es indispensable para detectar el movimiento lateral cuando un intruso intenta saltar desde una computadora infectada hacia el servidor principal.
  :::

Muchas organizaciones pequeñas solo monitorizan el tráfico Norte-Sur (lo que entra y sale por el _firewall_ perimetral) y pasan por alto el tráfico Este-Oeste. Esta es una omisión costosa: una vez que un atacante está dentro de la red, todo su movimiento posterior ocurre en el eje interno. Una solución de monitoreo que solo mira el perímetro no detectará ese desplazamiento hasta que sea demasiado tarde.

### Enfoques de Observación de Red

Con la motivación clara, el siguiente paso es entender qué clase de datos puede recolectar un sistema de monitoreo de red. No todas las técnicas guardan la misma cantidad de información. En una pequeña organización con espacio de disco limitado, distinguir los tres enfoques principales es fundamental para elegir cuál aplicar en cada situación.

#### 1. Análisis de flujos de red (_NetFlow_ / IPFIX)

Un flujo de red representa el resumen estadístico de una conversación entre dos equipos. En lugar de guardar el contenido de cada paquete enviado, el router o cortafuegos anota únicamente una ficha resumen de la sesión: quién se comunicó con quién, por qué puerto, durante cuánto tiempo y cuántos bytes intercambiaron.

| Campo registrado                                                                                           | Ejemplo de valor                    | Utilidad para el análisis                                              |
| :--------------------------------------------------------------------------------------------------------- | :---------------------------------- | :--------------------------------------------------------------------- |
| **IP de origen**                                                                                           | `10.10.30.20`                       | Identifica al servidor contable interno que inició la conexión.        |
| **IP de destino**                                                                                          | `203.0.113.15`                      | Muestra la dirección pública externa con la que habló.                 |
| **Puerto y Protocolo**                                                                                     | `TCP 443`                           | Indica una comunicación web cifrada estándar.                          |
| **Duración**                                                                                               | `120 segundos`                      | Tiempo total que duró la sesión abierta.                               |
| **Bytes enviados vs. recibidos**                                                                           | `18 GB` enviados / `4 MB` recibidos | Alerta sobre una transferencia masiva e inusual de datos hacia afuera. |
| _Ejemplo de registro de flujo de red evidenciando una posible exfiltración de datos durante la madrugada._ |                                     |                                                                        |

- **Ventaja:** Consume muy poco espacio de almacenamiento en disco, permitiendo guardar historial de meses para conocer el comportamiento normal de la empresa.
- **Limitación:** No guarda el contenido de los paquetes; sabemos que enviaron 18 GB, pero el flujo no dice qué archivos eran.

#### 2. Captura completa de paquetes (PCAP)

Una captura completa graba exactamente cada paquete que circula por la interfaz de red, incluyendo todos sus encabezados técnicos y el contenido transmitido (siempre que no esté cifrado). El resultado se guarda en archivos con extensión `.pcap` o `.pcapng`.

- **Ventaja:** Ofrece el máximo nivel de detalle posible para investigar un incidente puntual y reconstruir paso a paso qué ocurrió en una comunicación sospechosa.
- **Limitación:** Consume mucho espacio en disco y puede almacenar información privada o contraseñas en texto claro, por lo que suele utilizarse para diagnósticos puntuales y no para grabar toda la red 24/7.

#### 3. Detección y prevención de intrusiones de red (NIDS / NIPS)

A diferencia de los métodos anteriores que solo registran datos, estos sistemas analizan el tráfico en vivo buscando patrones de ataques conocidos (firmas) o comportamientos anormales en los protocolos para alertar al equipo técnico:

- **NIDS (Sistema de Detección de Intrusiones de Red):** Funciona de manera pasiva. Recibe una copia del tráfico, la analiza y genera una alerta cuando detecta algo sospechoso (como un escaneo de puertos), sin interrumpir ni frenar la comunicación original.
- **NIPS (Sistema de Prevención de Intrusiones de Red):** Se coloca en medio del flujo del tráfico. Además de generar la alerta, tiene la capacidad de bloquear y descartar los paquetes maliciosos en tiempo real para cortar el ataque.

| Método                                                                    | ¿Qué registra principalmente?             | ¿Para qué se utiliza en una PyME?                                            |
| :------------------------------------------------------------------------ | :---------------------------------------- | :--------------------------------------------------------------------------- |
| **NetFlow / IPFIX**                                                       | Metadatos y estadísticas de las sesiones. | Identificar patrones horarios, consumos anómalos y salidas masivas de datos. |
| **Captura PCAP**                                                          | Paquetes de red completos.                | Diagnosticar problemas puntuales e investigar incidentes en detalle.         |
| **NIDS / NIPS**                                                           | Eventos y alertas de seguridad.           | Detectar en tiempo real (o bloquear) actividades maliciosas conocidas.       |
| _Comparación de los tres enfoques complementarios de observación de red._ |                                           |                                                                              |

Los tres enfoques son complementarios, no excluyentes. Una arquitectura madura los combina: NetFlow para la historia larga y barata, PCAP para la investigación forense detallada y NIDS para las alertas en tiempo real. La siguiente subsección explica dónde y cómo ubicar físicamente un sensor dedicado que implementará estos enfoques.

### Arquitectura del Sensor y Ubicación

Antes de decidir dónde ubicar un sensor, es importante entender que no todas las organizaciones necesitan implementar uno dedicado para comenzar a monitorear su red. Existen alternativas más básicas como consultar los _logs_ del router o firewall y realizar capturas puntuales con herramientas como tcpdump o Wireshark. Sin embargo, cuando se busca obtener visibilidad continua y automatizar la detección de actividades sospechosas, incorporar un sensor de red puede ser una buena opción.

Entender qué tipo de datos recolectar es solo la mitad del problema. La otra mitad es ubicar el sensor de tal forma que realmente _vea_ el tráfico que nos interesa. Un sensor mal ubicado puede estar funcionando perfectamente y aun así ser completamente ciego al ataque que está ocurriendo.

#### El problema fundamental: cómo funciona un switch

Un conmutador (_switch_) moderno, a diferencia de los hubs antiguos, es un dispositivo inteligente: envía cada paquete únicamente al puerto donde está conectado el destinatario correcto. Si enchufas tu servidor de monitoreo en un puerto libre del switch, **solo verá su propio tráfico**, no el de las otras computadoras de la red. Para que un sensor pueda analizar las comunicaciones de la organización, el switch debe enviarle activamente una copia del tráfico que le interesa.

#### Puerto espejo (SPAN / _Port Mirroring_)

La solución estándar en redes empresariales pequeñas es configurar un **puerto espejo** (_SPAN: Switched Port Analyzer_ o _Port Mirroring_) en el switch administrable. Esta función le ordena al switch que copie todo el tráfico que pasa por uno o varios puertos (o por una VLAN completa) y lo reenvíe simultáneamente hacia el puerto donde está conectado el sensor.

La configuración se realiza desde la interfaz de administración web o CLI del switch (cada fabricante tiene su propia sintaxis, pero el concepto es universal). No requiere comprar hardware adicional. La única limitación es que, en redes muy cargadas, el puerto espejo puede descartar algunas copias si la suma del tráfico a espejar supera el ancho de banda del puerto de destino.

> [!NOTE:Network TAP para entornos de mayor criticidad]
> En organizaciones que necesitan garantía de captura sin pérdida de paquetes, se instala un dispositivo físico llamado **TAP** (_Test Access Point_) que se intercala directamente en el cable entre dos dispositivos. A diferencia del SPAN, el TAP es completamente pasivo (no consume energía para su función de captura) y no puede descartarse paquetes por saturación. Es la solución estándar en entornos medianos y grandes, o en segmentos críticos.

Para consultar procedimientos reales sobre cómo implementar un sensor, configurar la captura de tráfico e infraestructura, existen **referencias oficiales**, se sugiere consultar:

- [Cisco — Management Configuration Guide](https://www.cisco.com/c/en/us/td/docs/switches/lan/c9000/mgmt/management-configuration-guide.pdf): Documentación técnica que explica cómo configurar un puerto espejo para enviar copias del tráfico de red hacia un equipo de monitoreo.
- [Suricata — Quickstart Guide](https://docs.suricata.io/en/latest/quickstart.html): Guía oficial para instalar Suricata en Ubuntu, configurar la interfaz de captura y comenzar a inspeccionar tráfico de red.

#### Las tres posiciones clave donde ubicar el sensor

No todos los puntos de la red tienen el mismo valor para el monitoreo. Para una empresa típica, existen tres posiciones prioritarias:

1. **Detrás del firewall perimetral (Norte-Sur filtrado):** Esta posición permite ver todo el tráfico que el cortafuegos _ya aprobó_ y dejó pasar hacia la red interna, y todo el tráfico interno que salió hacia Internet. Es el punto más valioso para detectar conexiones hacia servidores de comando y control (_infraestructura que los atacantes usan para comunicarse, gestionar y enviar instrucciones a dispositivos infectados con malware_), descargas de malware que el firewall no bloqueó, y exfiltración de datos.

2. **En la zona de servidores públicos (DMZ):** Si la empresa tiene servidores accesibles desde Internet (web, correo, VPN), un sensor en la DMZ permite detectar intentos de explotación directa, escaneos de puertos y ataques a servicios publicados, antes de que lleguen a la red interna.

3. **En el enlace entre VLANs internas (Este-Oeste crítico):** Esta posición detecta el movimiento lateral: un atacante que ya comprometió una estación de trabajo en la red de oficinas e intenta conectarse al servidor de archivos o de base de datos en otra VLAN. Sin visibilidad aquí, ese desplazamiento pasa completamente desapercibido.

> [!IMPORTANT:Monitoreo en entornos virtualizados]
> Si los servidores son máquinas virtuales corriendo sobre un mismo host físico (VMware, Proxmox, KVM), el tráfico entre ellas nunca toca el switch físico: circula internamente por el **switch virtual del hipervisor**. En ese caso, el puerto espejo debe configurarse en el switch virtual de la plataforma de virtualización, no en el switch físico. Este es un punto ciego muy frecuente en infraestructuras pequeñas que comenzaron a virtualizar sus servidores pero no actualizaron su arquitectura de monitoreo.

### Limitaciones y Visibilidad Parcial

Con el sensor correctamente ubicado, es tentador asumir que tenemos visibilidad completa sobre la red. No es así, y es fundamental comprenderlo antes de dimensionar las expectativas del equipo y de la dirección de la organización.

Hoy prácticamente toda la comunicación relevante viaja cifrada: la navegación web usa `HTTPS` con `TLS 1.3`, el acceso remoto usa `SSH`, las VPNs cifran todo el túnel, y la mayoría de las aplicaciones modernas cifran sus APIs por defecto. Esto significa que en Wireshark o Suricata **no es posible leer el contenido interno de esas conversaciones ni ver los archivos transferidos**.

Intentar descifrar el tráfico en tránsito mediante técnicas específicas (como _SSL inspection_ o _TLS intercept_) es técnicamente posible pero introduce complejidad significativa: suele romper aplicaciones que usan _certificate pinning_, requiere instalar certificados raíz en todos los equipos de la organización, crea un nuevo punto de fallo crítico, y plantea implicaciones legales y de privacidad que deben evaluarse cuidadosamente. En la mayoría de las pequeñas empresas, el costo operativo supera el beneficio.

Aunque el contenido viaje cifrado, el _sobre_ siempre está a la vista. Con Zeek y los flujos de red seguimos teniendo acceso a información de alto valor analítico:

- **Direcciones IP** de origen y destino, y su geolocalización aproximada.
- **Puertos y protocolos** utilizados, que revelan el tipo de servicio utilizado, aunque no el contenido.
- **Volumen de datos transferidos** y la dirección del flujo (cuánto salió vs. cuánto entró).
- **Frecuencia y periodicidad de las conexiones** (por ejemplo, un equipo infectado que se reporta a su servidor de comando y control exactamente cada 60 segundos es detectable aunque el contenido esté cifrado).
- **Consultas DNS previas** al establecimiento de cada conexión cifrada.
- **Metadatos del saludo TLS** (_TLS handshake_): el nombre del servidor solicitado (_Server Name Indication_, SNI), la versión de TLS, la suite de cifrado y las huellas digitales de la negociación (`JA3` para el cliente, `JA3S` para el servidor, y el estándar más reciente `JA4`), que permiten identificar familias de malware aunque todo el canal esté cifrado.

#### Otros puntos ciegos a tener en cuenta

Más allá del cifrado, existen situaciones donde el sensor no capturará tráfico relevante aunque esté bien ubicado:

- **Tráfico WiFi entre dispositivos del mismo segmento:** Dos computadoras conectadas al mismo punto de acceso inalámbrico (WAP) que se comunican directamente pueden no pasar por el puerto espejo del switch, dependiendo de cómo esté configurada la red inalámbrica.
- **Exfiltración hacia servicios legítimos en la nube:** Si un atacante sube la información robada a Google Drive, OneDrive o Dropbox, el tráfico hacia esas plataformas parece indistinguible del uso legítimo desde la perspectiva del monitoreo de red.
- **Saturación del sensor en horas pico:** Un servidor sensor con recursos insuficientes (poca RAM o CPU) descartará paquetes durante los momentos de mayor carga de red, creando ventanas ciegas precisamente cuando la red está más activa.
- **Ataques completamente locales:** Si el atacante ya tiene acceso físico a un equipo de la red o explota una vulnerabilidad que no genera tráfico de red externo, el monitoreo perimetral no lo detectará.

Por estas razones, el monitoreo de red debe acompañarse siempre con la visibilidad dentro de los propios endpoints que se trata en la sección `05.3`.

Con los fundamentos conceptuales, la arquitectura del sensor y sus limitaciones claras, el siguiente paso es tomar decisiones prácticas sobre qué implementar primero.

#### Cómo se complementan las cinco herramientas

Las cinco herramientas que se detallan en las subsecciones siguientes ocupan un rol distinto en la arquitectura de monitoreo:

1. **`tcpdump`** es la herramienta de captura de emergencia: siempre disponible en cualquier servidor Linux, sin instalación adicional. Permite obtener rápidamente una muestra de tráfico (pcap) ante una sospecha concreta.
2. **Wireshark** es la lupa de análisis: toma el archivo `.pcap` generado por `tcpdump` u otra fuente y permite examinar cada paquete visualmente, reconstruir conversaciones (como el _Three-Way Handshake_) y verificar protocolos.
3. **Suricata** es la alarma continua (IDS/IPS): corre en segundo plano las 24 horas comparando cada paquete contra miles de firmas de ataques conocidos y genera alertas inmediatas.
4. **Snort** es el referente académico e histórico del formato de reglas: comprender su sintaxis permite leer y adaptar cualquier regla IDS del mercado, y validarla contra capturas sin necesidad de un entorno de producción. (_Las reglas IDS son condiciones predefinidas que utiliza un Sistema de Detección de Intrusos para analizar el tráfico de red. Funciona como un "patrón de búsqueda": si un paquete de datos coincide exactamente con los criterios de la regla, el sistema salta y genera una alerta de seguridad_)
5. **Zeek** es el libro de actas: en lugar de buscar ataques específicos, registra silenciosamente un historial organizado de todas las conexiones, consultas DNS y transferencias de archivos, permitiendo investigar qué ocurrió días o semanas atrás.

#### Hoja de ruta práctica: escalonamiento para una PyME

No intentes implementar todo de una vez. Avanza paso a paso según la capacidad real del equipo:

| Etapa                                    | Objetivo concreto                                                                  | Qué implementar en la práctica                                                                                                                                                                                                             |
| :--------------------------------------- | :--------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nivel 1 — Base Esencial (IG1)**        | Conocer la red y poder investigar cuando algo anda mal.                            | Revisar los registros de bloqueos del firewall actual; documentar qué servicios son normales en la empresa; instalar `tcpdump` y **Wireshark** en el equipo de soporte para inspeccionar capturas ante sospechas puntuales.                |
| **Nivel 2 — Visibilidad Continua (IG2)** | Tener historial de conexiones y alertas automáticas sin arriesgar las operaciones. | Configurar un puerto espejo (SPAN) en el switch principal apuntando a un servidor Linux modesto donde corran **Zeek** (historial de conexiones y DNS) y **Suricata en modo pasivo (IDS)** con reglas actualizadas.                         |
| **Nivel 3 — Prevención Activa (IG3)**    | Bloquear ataques en tránsito automáticamente.                                      | Una vez conocidas bien las alertas de la red y eliminados los falsos positivos, convertir reglas específicas de alta confianza a modo de bloqueo en línea (**IPS** con Suricata) e implementar autenticación por puerto en los _switches_. |

La sección `Guía de implementación` ofrece una guía de selección detallada que ayuda a determinar exactamente qué herramienta o combinación de herramientas corresponde a cada situación concreta.

### La herramienta base para la captura de tcpdump

Cuando un incidente ocurre en un servidor remoto accesible exclusivamente por terminal, o cuando un equipo técnico necesita comprobar de inmediato si un puerto específico está recibiendo tráfico sin alterar el sistema, la primera herramienta de la línea de defensa es **`tcpdump`**.

`tcpdump` es el analizador y capturador de paquetes de línea de comandos estándar de los sistemas tipo Unix y Linux. Basado en la biblioteca central `libpcap`, permite interceptar, filtrar y mostrar en tiempo real las cabeceras y contenidos de los paquetes que atraviesan cualquier tarjeta de red. No requiere interfaz gráfica, consume recursos mínimos de procesador y memoria, y se encuentra disponible de forma nativa en casi cualquier distribución Linux empresarial.

#### ¿Cuándo conviene utilizar `tcpdump`?

- **Servidores sin interfaz gráfica (_headless_):** Permite verificar en vivo la conectividad y el tráfico de red directamente en servidores de producción o contenedores sin instalar escritorios gráficos ni herramientas pesadas.
- **Triage de emergencia:** Ante la sospecha de una exfiltración activa de datos, una conexión de comando y control (C2) o un escaneo de puertos, `tcpdump` permite confirmar en pocos segundos si el tráfico anómalo está circulando por la interfaz.
- **Generación de capturas forenses (`.pcap`):** Funciona como la fuente de extracción: captura los paquetes con fidelidad absoluta a nivel de bit y los guarda en disco para que luego puedan analizarse visualmente en Wireshark o procesarse con Zeek.
- **Filtrado previo para ahorro de espacio:** A diferencia de una captura ciega, `tcpdump` utiliza expresiones BPF (_Berkeley Packet Filters_) para descartar en memoria el tráfico irrelevante antes de escribirlo a disco.

#### Parámetros esenciales y sintaxis de filtros BPF

Dominar `tcpdump` requiere conocer sus banderas de control más importantes:

| Parámetro           | Significado y efecto operativo                                                                                                                                                                                                                                                                        |
| :------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-i <interfaz>`     | Especifica la tarjeta de red a escuchar (por ejemplo, `-i eth0` o `-i enp1s0`). Si se indica `-i any`, captura en todas las interfaces activas a la vez.                                                                                                                                              |
| `-nn`               | **Crítico:** Deshabilita la resolución de nombres DNS (primer `n`) y la traducción de números de puerto a nombres de servicios (segundo `n`). Muestra `192.168.1.10.443` en vez de `servidor.local.https`. Evita demoras en la terminal y previene que el propio sensor genere tráfico DNS adicional. |
| `-s 0`              | Configura la longitud de captura (_snaplen_) a 0 (paquete completo sin truncar, equivalente a `-s 65535`). Garantiza que se guarde todo el contenido y no solo los primeros bytes.                                                                                                                    |
| `-w <archivo.pcap>` | En lugar de imprimir el texto en pantalla, escribe los paquetes crudos directamente en un archivo con formato estándar PCAP.                                                                                                                                                                          |
| `-r <archivo.pcap>` | Modo lectura: procesa y muestra en la terminal los paquetes de un archivo PCAP previamente grabado.                                                                                                                                                                                                   |
| `-c <número>`       | Limita la captura a una cantidad exacta de paquetes y se detiene automáticamente (por ejemplo, `-c 100`).                                                                                                                                                                                             |
| `-X` / `-XX`        | Imprime las cabeceras y el cuerpo del paquete simultáneamente en formato hexadecimal y texto legible ASCII. Útil para inspeccionar tráfico web no cifrado o protocolos legacy.                                                                                                                        |
| `-v` / `-vv`        | Aumenta el nivel de detalle técnico mostrado (TTL, identificación de fragmentación, opciones IP y TCP).                                                                                                                                                                                               |

Las **expresiones BPF** se agregan al final del comando entre comillas. Permiten combinar primitivas como `host`, `net`, `port`, `src`, `dst` mediante operadores lógicos (`and`, `or`, `not`):

```bash:terminal
# Ejemplo de BPF: capturar tráfico web sin cifrar que no provenga de la red de administración
sudo tcpdump -i eth0 -nn "port 80 and not src net 192.168.10.0/24"
```

> [!CAUTION:Evita el bucle infinito al capturar por SSH]
> Si estás conectado a un servidor remoto mediante una sesión SSH en el puerto `22` y ejecutas `sudo tcpdump -i eth0` sin filtros, cada línea que `tcpdump` imprima en tu pantalla generará un nuevo paquete SSH saliente, el cual será capturado por `tcpdump`, imprimiendo otra línea y saturando tu conexión en un ciclo interminable. Utiliza **siempre** la exclusión del puerto de tu sesión:
> `sudo tcpdump -i eth0 -nn "not port 22"`

#### Tutorial paso a paso: Captura y análisis con `tcpdump`

:::steps

### 1. Identificar las interfaces de red disponibles

Antes de capturar, verifica los nombres exactos asignados por el sistema operativo a cada tarjeta de red:

```bash:terminal
sudo tcpdump -D
```

Resultado esperado: una lista numerada de interfaces activas (como `1.eth0 [Up, Running]`, `2.lo [Loopback]`, etc.). Localiza el identificador de la interfaz conectada a la red a investigar.

### 2. Captura quirúrgica hacia un archivo PCAP

Inicia una captura orientada a un puerto (por ejemplo, tráfico DNS en el puerto `53` o tráfico HTTPS en el `443`), guardando los paquetes completos en un archivo temporal:

```bash:terminal
sudo tcpdump -i eth0 -nn -s 0 "port 53 or port 443" -w /tmp/captura_prueba.pcap
```

Deja correr la captura durante el tiempo necesario. Para detenerla de forma limpia, presiona `Ctrl + C`. tcpdump mostrará en pantalla cuántos paquetes fueron capturados y cuántos fueron descartados por el kernel.

### 3. Inspeccionar el contenido de paquetes en vivo con ASCII

Si necesitas verificar si una aplicación interna está transmitiendo credenciales o datos sensibles en texto plano sin cifrar sobre el puerto `8080`, ejecuta:

```bash:terminal
sudo tcpdump -i eth0 -nn -s 0 -X -c 5 "tcp port 8080"
```

En la salida verás cada paquete desglosado: a la izquierda los valores hexadecimales y a la derecha los caracteres legibles, permitiendo detectar solicitudes `POST`, cabeceras `Authorization` o parámetros de autenticación sin cifrar.

### 4. Filtrar una captura existente desde la terminal

Puedes reutilizar las expresiones BPF para inspeccionar archivos `.pcap` ya guardados sin necesidad de copiarlos a otra computadora:

```bash:terminal
tcpdump -nn -r /tmp/captura_ejemplo.pcap "tcp[tcpflags] & (tcp-syn) != 0 and tcp[tcpflags] & (tcp-ack) == 0"
```

Este comando procesa el archivo offline y muestra únicamente los paquetes TCP SYN de apertura de conexión, lo que permite auditar rápidamente qué destinos externos intentaron ser contactados.
:::

#### Seguridad en el manejo de archivos PCAP

Un archivo `.pcap` es un registro fiel de la actividad real de la empresa y puede contener correos electrónicos, peticiones HTTP con datos personales o secretos comerciales si viajaron sin cifrar. Aplica siempre dos reglas de higiene:

1. **Permisos restrictivos:** Ajusta los permisos del archivo inmediatamente después de crearlo para que solo el usuario `root` o el analista autorizado pueda leerlo (`sudo chmod 600 /tmp/*.pcap`).
2. **Transferencia cifrada y eliminación:** Transfiere las capturas a la estación de análisis utilizando canales protegidos (`scp` o `sftp`) y elimina los archivos temporales del servidor intervenido una vez concluida la recolección (`rm -f /tmp/*.pcap`).

### 5.2.1. Wireshark <!-- id: herramienta-wireshark, icon: EyeIcon, displayTitle: 05.2.7 — Wireshark, description: Inspección y análisis visual de paquetes, filtros de visualización, reconstrucción de flujos TCP y análisis de protocolos. -->

Cuando necesitamos investigar en profundidad qué ocurrió durante una conexión sospechosa, leer miles de líneas de texto crudo en la consola resulta agotador y poco práctico. [**Wireshark**](https://www.wireshark.org) es un analizador de protocolos gratuito y de código abierto con interfaz gráfica que toma cualquier archivo de captura `.pcap` (o escucha la red en vivo) y lo traduce en una vista ordenada, permitiéndonos explorar cada capa del paquete y reconstruir conversaciones completas.

#### ¿Cuándo conviene utilizar Wireshark?

- **Análisis forense de incidentes:** Tras recibir una alerta de IDS o detectar una anomalía con Zeek, el archivo `.pcap` asociado se puede abrir en Wireshark para examinar los paquetes exactos que dispararon el incidente.
- **Diagnóstico y verificación de protocolos:** Comprobar si los equipos están aplicando cifrado TLS de forma correcta, validar configuraciones de DNS o resolver fallos de comunicación en servicios internos.
- **Auditoría de aplicaciones sin cifrar:** Demostrar el riesgo operativo al exponer contraseñas o tokens en claro dentro de la red corporativa.

### Instalación rápida de Wireshark

En la estación de trabajo del analista de seguridad o administrador de TI:

- **En distribuciones Ubuntu/Debian:** Descargando el instalador oficial desde su web o mediante la terminal:

```bash:terminal
sudo apt update && sudo apt install -y wireshark
# Permitir capturar paquetes a usuarios no-root y agregar tu usuario al grupo:
sudo usermod -aG wireshark $USER
# Cierra la sesión y vuelve a iniciarla para que el cambio de grupo tenga efecto
```

- **En macOS:** Descargando el instalador oficial desde su web o mediante Homebrew con el comando `brew install --cask wireshark`.
- **En Microsoft Windows:** Descargando el instalador oficial desde el sitio web del proyecto, asegurándose de incluir el controlador de captura **Npcap**.

[Wireshark](https://www.wireshark.org/#download 'Sitio de descarga oficial')

#### Paso a paso: Cómo usar Wireshark desde cero

En la siguiente imagen podemos ver cómo es la interfaz básica de la aplicación; Debajo, se detalla cómo utilizarla para analizar el tráfico de red.

<DocsImage
  src="https://www.wireshark.org/docs/wsug_html_chunked/images/ws-main.png"
  alt="Interfaz principal de Wireshark con sus tres paneles: lista de paquetes, detalles del protocolo y volcado en bytes"
  caption="Ventana principal de Wireshark mostrando la captura de paquetes dividida en tres paneles sincronizados: Packet List, Packet Details y Packet Bytes."
/>

:::steps

### 1. Abrir una captura de tráfico

Si ya capturaste un archivo con `tcpdump` en un servidor y lo copiaste a tu computadora de trabajo, puedes abrirlo directamente desde el menú **File → Open** de la aplicación o lanzándolo desde tu terminal: `wireshark /tmp/captura.pcap`.

Al abrirse, verás la pantalla dividida en tres paneles horizontales que trabajan conectados entre sí:

- **Panel superior — Lista de paquetes (_Packet List_):** Muestra una tabla donde cada fila es un paquete numerado (`No.`), indicando el segundo exacto en que ocurrió (`Time`), quién lo envió (`Source`), quién lo recibió (`Destination`), el protocolo (`Protocol`), el tamaño (`Length`) y un resumen de lo que hace (`Info`).
- **Panel central — Detalles del paquete (_Packet Details_):** Al hacer clic sobre cualquier fila del panel superior, aquí verás el paquete desarmado capa por capa (direcciones físicas MAC en Ethernet, direcciones IP en IPv4, puertos y banderas en TCP, y datos de aplicación como DNS o HTTP). Puedes desplegar cada signo `+` o flecha para leer sus campos individuales.
- **Panel inferior — Bytes del paquete (_Packet Bytes_):** Muestra los datos crudos tal como viajaron por el cable, tanto en formato hexadecimal como en texto legible (ASCII) a la derecha.

### 2. Aplicar filtros de visualización para limpiar el ruido

Una captura de pocos minutos puede tener decenas de miles de paquetes. Para encontrar lo que buscas sin perder horas desplazando la pantalla, utiliza la **barra de filtros de visualización (_Display Filters_)** ubicada en la parte superior de la ventana. Escribe la condición y presiona `Enter`. El siguiente filtro ocultará temporalmente todo el resto del tráfico y dejará en pantalla únicamente los paquetes donde participe el equipo `192.168.1.10` (sin borrar nada del archivo original):

```text:wireshark
ip.addr == 192.168.1.10
```

### 3. Verificar cómo se establecen las conexiones (Saludo de tres vías TCP)

Para saber si un intento de conexión hacia un puerto tuvo éxito o fue rechazado por un cortafuegos, observa la columna `Info` en los paquetes TCP. Una conexión exitosa siempre inicia con tres paquetes consecutivos (_Three-Way Handshake_):

- **`[SYN]`:** El equipo origen pide abrir comunicación.
- **`[SYN, ACK]`:** El servidor destino responde que el puerto está abierto y acepta.
- **`[ACK]`:** El origen confirma y comienza a enviar datos.

Si en lugar de eso observas cientos de paquetes `[SYN]` enviados desde una misma computadora hacia distintos puertos seguidos de respuestas `[RST, ACK]` (Reinicio), estás viendo en pantalla la evidencia clara de un escaneo de puertos.

### 4. Reconstruir el contenido de una conversación (Follow Stream)

Si encuentras una comunicación en texto claro (como tráfico HTTP no cifrado o un protocolo interno) y quieres leer todo el diálogo de corrido sin ir paquete por paquete, haz **clic derecho** sobre cualquiera de los paquetes de esa sesión y selecciona **Follow → TCP Stream**. Wireshark abrirá una ventana emergente mostrando en un color lo que pidió el cliente y en otro color todo lo que respondió el servidor.
:::

| Filtro de visualización en Wireshark        | ¿Qué muestra exactamente en pantalla?                                                                                                   |
| :------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------- |
| `ip.addr == 192.168.1.10`                   | Todos los paquetes donde esa dirección IP sea origen o destino.                                                                         |
| `ip.src == 192.168.1.10`                    | Únicamente los paquetes enviados desde esa dirección IP.                                                                                |
| `ip.dst == 192.168.1.10`                    | Únicamente los paquetes recibidos por esa dirección IP.                                                                                 |
| `dns`                                       | Todas las consultas y respuestas de nombres de dominio.                                                                                 |
| `http`                                      | Tráfico web sin cifrar.                                                                                                                 |
| `tcp.port == 443`                           | Comunicaciones TCP que utilicen el puerto 443.                                                                                          |
| `tcp.flags.syn == 1 and tcp.flags.ack == 0` | Solo los paquetes iniciales de solicitud de conexión TCP (ideal para buscar escaneos).                                                  |
| `tls.handshake.type == 1`                   | Solicitudes iniciales de conexión TLS (_Client Hello_), donde se puede inspeccionar el campo SNI con el nombre del servidor solicitado. |

> [!NOTE:Diferencia entre Filtro de Captura y Filtro de Visualización]
> No confundas ambos conceptos: un **Filtro de Captura** (como `port 443` en `tcpdump` o en la pantalla de inicio de Wireshark) decide qué paquetes se guardan en el disco mientras se graba y descarta el resto para siempre. Un **Filtro de Visualización** en Wireshark (`tcp.port == 443`) solo filtra la vista en tu monitor sobre un archivo ya guardado; al borrar el texto de la barra, todos los paquetes vuelven a aparecer.

#### Aplicación práctica en una PyME

Wireshark no es un programa para dejar corriendo en segundo plano esperando ataques, sino la herramienta de diagnóstico cuando ya tienes una duda concreta. Úsala en tu organización cuando un servidor presente tráfico inusual, cuando necesites comprobar si una aplicación interna antigua está enviando contraseñas sin cifrar por la red local, o para analizar el archivo `.pcap` de un incidente puntual. Recuerda almacenar los archivos `.pcap` en carpetas seguras, ya que contienen datos reales de la red.

### 5.2.2. Suricata <!-- id: herramienta-suricata, icon: ShieldAlertIcon, displayTitle: 05.2.8 — Suricata, description: Detección y prevención continua de intrusiones (NIDS/NIPS), motor multihilo, gestión de reglas y análisis de alertas en eve.json. -->

Mientras que Wireshark requiere que una persona mire la pantalla paquete por paquete, [**Suricata**](https://suricata.io) automatiza la vigilancia las 24 horas del día. Es un motor gratuito y de código abierto capaz de funcionar simultáneamente como detector de intrusiones pasivo (IDS), sistema de prevención en línea (IPS) y generador de registros de seguridad de red (NSM), aprovechando múltiples núcleos del procesador gracias a su arquitectura multihilo.

Su lógica se basa en comparar cada paquete que circula por la red contra una lista de miles de **reglas o firmas de detección** actualizadas por la comunidad (como el catálogo libre _Emerging Threats Open_). Cuando detecta una comunicación que coincide con el patrón de un ataque o malware conocido, registra una alerta detallada al instante.

#### Tutorial desde cero: Instalación y puesta en marcha en modo IDS (Ubuntu)

Para una pequeña empresa, se sugiere comenzar implementando Suricata en **modo pasivo (IDS)**. De este modo, el motor observa el tráfico y genera alertas sin riesgo de bloquear por error las operaciones diarias del negocio.

:::steps

### 1. Instalar Suricata y la utilidad de lectura JSON

En un servidor Ubuntu destinado a funcionar como sensor, agrega el repositorio oficial estable del proyecto e instala tanto el motor como la herramienta `jq` (que nos servirá para leer sus registros fácilmente en la terminal):

```bash:terminal
sudo apt-get update && sudo apt-get install -y software-properties-common
sudo add-apt-repository -y ppa:oisf/suricata-stable
sudo apt-get update && sudo apt-get install -y suricata jq
```

Verifica que el paquete se haya instalado correctamente consultando su versión:

```bash:terminal
sudo suricata --build-info
```

### 2. Identificar tu interfaz de red y configurar `suricata.yaml`

Consulta cómo se llama la tarjeta de red por la cual tu servidor recibirá el tráfico a monitorear con `ip -br addr`. Supongamos que tu interfaz se llama `enp1s0` y tu red local de la empresa utiliza el rango `192.168.1.0/24`. Abre el archivo de configuración principal ubicado en `/etc/suricata/suricata.yaml`. Allí debes asegurarte de ajustar dos elementos clave:

- En la variable `HOME_NET`, define los rangos IP de tu red interna para que Suricata distinga qué equipos son tuyos y cuáles son externos.
- En la sección de captura `af-packet`, coloca el nombre exacto de tu interfaz:

```yaml:/etc/suricata/suricata.yaml
vars:
  address-groups:
    HOME_NET: "[192.168.1.0/24,10.0.0.0/8]"
    EXTERNAL_NET: "!$HOME_NET"

af-packet:
  - interface: enp1s0
    cluster-id: 99
    cluster-type: cluster_flow
    defrag: yes
    tpacket-v3: yes
```

### 3. Descargar las reglas de detección y validar la configuración

Un motor recién instalado no tiene firmas de ataques cargadas. Ejecuta la herramienta integrada `suricata-update` para que descargue automáticamente el conjunto gratuito de reglas _Emerging Threats Open_:

```bash:terminal
sudo suricata-update
```

Antes de encender el servicio, comprueba siempre que no hayas cometido errores de tipeo en el archivo `.yaml` ejecutando la prueba de validación (`-T`):

```bash:terminal
sudo suricata -T -c /etc/suricata/suricata.yaml
```

Si las últimas líneas indican que la configuración es válida, reinicia el servicio y verifica que esté activo:

```bash:terminal
sudo systemctl restart suricata
sudo systemctl status suricata
```

### 4. Consultar las alertas en tiempo real

Suricata guarda sus hallazgos en el directorio `/var/log/suricata/`. Tienes dos formas prácticas de vigilar qué está detectando:

- **Lectura rápida en una línea (`fast.log`):** Ideal para ver alertas simples de texto a medida que ocurren:

```bash:terminal
sudo tail -f /var/log/suricata/fast.log
```

- **Lectura estructurada (`eve.json` con `jq`):** El archivo `eve.json` guarda toda la riqueza de datos en formato JSON. Puedes filtrar en vivo únicamente los eventos que sean alertas de seguridad ejecutando:

```bash:terminal
sudo tail -f /var/log/suricata/eve.json | jq 'select(.event_type == "alert")'
```

Allí verás con claridad la fecha y hora, la dirección IP atacante, la dirección IP víctima, el puerto y el nombre exacto de la regla que se disparó (`alert.signature`).
:::

#### Cómo aplicarlo en una pequeña empresa

En una pequeña organización, instala Suricata en un equipo modesto conectado a un puerto espejo (SPAN) de tu _switch_ principal (justo detrás del firewall de salida a Internet). Programa una tarea semanal o diaria para que `suricata-update` mantenga las firmas al día y revisa las alertas generadas. Recuerda que una alerta no siempre confirma que el ataque haya tenido éxito: te avisa que alguien lo intentó, permitiéndote verificar si el equipo destino está parcheado o si debes bloquear esa dirección IP en tu firewall.

[Suricata](https://suricata.io/download/ 'Sitio oficial de instalación')

### 5.2.3. Snort <!-- id: herramienta-snort, icon: Settings02Icon, displayTitle: 05.2.9 — Snort, description: Motor clásico de detección por firmas, formato universal de reglas IDS y validación contra archivos de captura con Snort 3. -->

**Snort** es el sistema de detección y prevención de intrusiones (IDS/IPS) de código abierto más conocido históricamente y el que definió el formato de reglas utilizado en la industria. Cumple exactamente el mismo rol arquitectónico que Suricata: inspeccionar los paquetes frente a una lista de reglas para alertar o bloquear amenazas.

> [!TIP:¿Debes instalar Suricata y Snort al mismo tiempo?]
> **No.** En una PyME no tiene sentido instalar ambos motores en el mismo servidor porque consumen recursos haciendo el mismo trabajo. En este módulo explicamos Suricata como motor principal por su facilidad de instalación mediante paquetes listos para usar y su rendimiento multihilo nativo. Sin embargo, conocer cómo se escribe una regla en **Snort 3** y cómo probarla contra un archivo `.pcap` te dará una habilidad fundamental que sirve para entender cualquier sistema IDS del mercado.

#### Tutorial desde cero: Cómo escribir una regla y probarla con Snort 3

A diferencia de Suricata, la instalación completa de Snort 3 en producción suele requerir compilar componentes desde el código fuente según su documentación oficial. Una forma muy práctica y segura de utilizarlo para aprender o analizar incidentes consiste en escribir nuestras propias reglas locales y pasarle un archivo `.pcap` ya capturado para ver qué detecta.

:::steps

### 1. Comprender la anatomía de una regla de detección

Toda regla en Snort o Suricata se divide en dos secciones principales:

- **Encabezado (_Header_):** Define la acción a tomar (`alert`, `drop`, etc.), el protocolo (`tcp`, `udp`, `icmp`), las direcciones IP y los puertos de origen y destino, junto con el operador de dirección (`->`).
- **Opciones (_Rule Options_):** Encerradas entre paréntesis y separadas por punto y coma `;`, detallan los metadatos y los patrones que activan la alerta.

Crea un archivo llamado `local.rules` con una regla básica de cabecera:

```text:local.rules
alert tcp $EXTERNAL_NET any -> $HOME_NET 80 (
    msg:"Conexion TCP entrante hacia servicio HTTP puerto 80";
    sid:1000001;
    rev:1;
)
```

- `msg`: Texto descriptivo que aparecerá en el registro o pantalla cuando la regla coincida.
- `sid` (_Signature ID_): Identificador numérico único de la regla. Por convención, los identificadores menores a 1.000.000 están reservados para reglas oficiales de Snort y Suricata; las reglas locales o personalizadas deben usar números a partir de `1000001` para evitar colisiones.
- `rev`: Número de revisión (inicia en 1 y se incrementa cada vez que edites la regla).

### 2. Inspeccionar la carga útil (_payload_) y controlar el flujo TCP

Una regla basada únicamente en puertos dispararía una alerta con cada visita legítima a tu web. Para escribir reglas efectivas que detecten ataques reales sin generar falsos positivos, se inspecciona el contenido del paquete y el estado de la sesión:

```text:local.rules
alert tcp $EXTERNAL_NET any -> $HOME_NET 80 (
    msg:"POSIBLE ATAQUE - Intento de Path Traversal a /etc/passwd";
    flow:to_server,established;
    content:"etc/passwd";
    nocase;
    classtype:web-application-attack;
    sid:1000002;
    rev:1;
)
```

- `flow:to_server,established`: Evalúa solo paquetes dirigidos hacia el servidor dentro de una sesión TCP ya establecida (_three-way handshake_ completado). Evita falsos positivos con escaneos a ciegas o respuestas devueltas por el propio servidor.
- `content:"etc/passwd"`: Busca esa secuencia exacta de texto dentro de la carga útil (_payload_) del paquete.
- `nocase`: Modificador que ignora mayúsculas y minúsculas (coincide con `etc/passwd`, `Etc/Passwd` o `ETC/PASSWD`), evitando evasiones simples.
- `classtype:web-application-attack`: Asigna la categoría estándar de la alerta para facilitar la priorización y el triaje en un SIEM o consola central.

### 3. Ejecutar Snort 3 contra un archivo `.pcap` existente

Una vez verificado que tienes Snort 3 disponible en tu entorno (`snort -V`), no necesitas conectarlo a la red viva de la empresa para probar tus reglas. Puedes ordenarle que lea el archivo `captura.pcap` y aplique tu archivo `local.rules` mostrando las alertas en pantalla:

```bash:terminal
snort -q -c /etc/snort/snort.lua -R local.rules -r /tmp/captura.pcap -A alert_fast
```

- `-q`: Modo silencioso (evita imprimir banners largos de inicio en la terminal).
- `-c`: Indica la ruta al archivo de configuración base de Snort 3 (`snort.lua`).
- `-R local.rules`: Carga tu archivo de reglas personalizado.
- `-r /tmp/captura.pcap`: Analiza los paquetes grabados en ese archivo y se cierra al terminar.
- `-A alert_fast`: Imprime en pantalla un resumen limpio por cada paquete que haya coincidido con tus reglas.

### 4. Tráfico coincidente

Si la captura contiene tráfico que coincide con la regla de ataque, Snort mostrará una línea como esta:

```text
05/12-10:15:22.451020 [**] [1:1000002:1] POSIBLE ATAQUE - Intento de Path Traversal a /etc/passwd [**] [Classification: Web Application Attack] [Priority: 1] {TCP} 203.0.113.50:42188 -> 192.168.1.10:80
```

:::

#### ¿Qué hace el motor cuando un paquete coincide con la condición?

Cuando un paquete coincide con una regla o condición del IDS (Sistema de Detección de Intrusos) o IPS (Sistema de Prevención de Intrusos), la acción del motor depende fundamentalmente de si el dispositivo está configurado para detectar o para prevenir.

:::group title="Acciones posibles en una regla"

- alert [Modo IDS]: Genera una alerta registrando el evento, pero deja pasar el paquete normalmente.
- log [Modo Registro]: Guarda el paquete para análisis sin disparar una alerta de seguridad.
- pass [Exclusión]: Ignora el paquete y permite que pase sin evaluarlo contra el resto de las reglas (útil para silenciar falsos positivos de equipos confiables).
- drop [Modo IPS en línea]: Descarta ese paquete inmediatamente e impide que llegue a su destino.
- block [Modo IPS en línea]: Descarta el paquete actual y bloquea todos los paquetes siguientes de esa misma sesión.
  :::

### 5.2.4. Zeek <!-- id: herramienta-zeek, icon: Database01Icon, displayTitle: 05.2.10 — Zeek, description: Monitoreo de seguridad de red (NSM), generación de registros estructurados por protocolo y trazabilidad de sesiones mediante UID. -->

Hasta aquí vimos cómo inspeccionar paquetes sueltos con Wireshark y cómo recibir alertas de ataques conocidos con Suricata o Snort. Pero, ¿qué ocurre cuando un atacante utiliza un malware nuevo o se conecta a un servidor desconocido para el cual **todavía nadie escribió una regla de detección**? Cuando una amenaza no coincide con ninguna regla o condición de detección disponible, estas herramientas pueden no generar una alerta. Esto no significa que la actividad sea invisible, sino que necesitamos otras formas de analizar el comportamiento de la red.

Aquí es donde entra [**Zeek**](https://zeek.org). Zeek no busca firmas de ataques ni bloquea paquetes; su función es observar silenciosamente todo el tráfico y **anotar un diario detallado y ordenado de cada conversación en archivos de registro (`.log`)** estructurados y separados por protocolo.

| Archivo generado por Zeek | ¿Qué información guarda automáticamente?                                                                  | Ejemplo de pregunta que permite responder en una PyME                                                   |
| :------------------------ | :-------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------ |
| **`conn.log`**            | Todas las conexiones TCP/UDP/ICMP: IPs, puertos, cuánto duró la charla y cuántos bytes se enviaron.       | _¿Qué computadoras internas se conectaron a la IP sospechosa `198.51.100.40` durante la última semana?_ |
| **`dns.log`**             | Cada consulta de nombre de dominio que hizo cualquier equipo y qué IP le respondió el servidor DNS.       | _¿Algún equipo de la oficina intentó buscar el dominio malicioso reportado hoy en las noticias?_        |
| **`http.log`**            | Detalles de navegación web sin cifrar (dirección URL, navegador utilizado, respuesta del servidor).       | _¿Desde qué página interna sin cifrar se descargó un archivo ejecutable?_                               |
| **`ssl.log`**             | Datos visibles de las conexiones cifradas TLS (nombres de servidor solicitados, validez de certificados). | _¿Hacia qué sitios HTTPS se están conectando los servidores de noche?_                                  |
| **`files.log`**           | Metadatos y resúmenes criptográficos (hashes) de los archivos que viajaron por la red.                    | _¿Qué archivo exacto circuló por la red en esa conexión?_                                               |
| **`weird.log`**           | Comportamientos extraños de red o paquetes malformados que no respetan los estándares técnicos.           | _¿Hay algún equipo mal configurado o intentando técnicas raras de evasión en la red local?_             |

Todos estos archivos comparten un campo fundamental llamado **`uid`** (identificador único de conexión). Si localizas una conexión extraña en `conn.log`, copias su código `uid`, lo buscas en `dns.log`, `ssl.log` o `http.log` y descubres al instante qué nombre de dominio pidió y qué hizo en esa misma sesión sin necesidad de abrir Wireshark ni reconstruir paquetes manualmente.

#### Tutorial desde cero: Análisis de tráfico y trazabilidad con Zeek

Este tutorial guía paso a paso desde la instalación y la preparación de una captura de prueba, pasando por la generación de registros y consultas analíticas, hasta el pivote forense por `uid` y la inspección en vivo.

:::steps

### 1. Instalar Zeek en tu entorno de trabajo

Puedes instalar Zeek directamente en tu sistema operativo o utilizar el contenedor Docker oficial:

- **En Ubuntu / Debian:** `sudo apt update && sudo apt install -y zeek jq`. Si tu distribución ubica los ejecutables en `/opt/zeek/bin`, asegúrate de incluir esa ruta en tu variable de entorno: `export PATH=$PATH:/opt/zeek/bin`.
- **En macOS (con Homebrew):** `brew install zeek jq`
- **Alternativa universal con Docker (sin instalar dependencias en el host):** `docker pull zeek/zeek:latest`

```bash:terminal
#  Comprueba que Zeek responda correctamente consultando su versión:
zeek --version
```

### 2. Preparar el directorio de trabajo y la captura de prueba

Para practicar desde cero de forma ordenada, crea un directorio limpio. Si ya cuentas con un archivo `.pcap` previo, cópialo a este directorio; si no dispones de ninguno, puedes generar una muestra rápida de 100 paquetes en vivo con `tcpdump`:

```bash:terminal
# Crear y acceder a la carpeta de práctica
mkdir -p ~/analisis-zeek && cd ~/analisis-zeek

# (Opcional) Capturar tráfico de prueba si no tienes un archivo .pcap previo
sudo tcpdump -i any -c 100 -w /tmp/captura_prueba.pcap
cp /tmp/captura_prueba.pcap ./captura.pcap
```

### 3. Procesar el archivo `.pcap` y generar registros estructurados

Ejecuta Zeek con el comando de abajo, indicando la lectura de la captura mediante el parámetro `-r`. Agregamos la opción `LogAscii::use_json=T` para que guarde los eventos en formato JSON (una línea por evento), lo que facilita enormemente su posterior filtrado y consulta. Luego, Zeek habrá creado de manera automática únicamente los archivos correspondientes a los protocolos presentes en la captura (como `conn.log`, `dns.log`, `ssl.log`, etc.).

```bash:terminal
zeek -r captura.pcap LogAscii::use_json=T
```

### 4. Consultar conexiones y nombres de dominio con `jq`

Al tener los registros en formato JSON, puedes interrogar los archivos directamente desde la terminal como si fuesen una base de datos liviana:

- **Resumen de conexiones de red (`conn.log`):** Identifica quién se comunicó con quién, el protocolo de transporte, el servicio detectado y la duración de la sesión:

```bash:terminal
jq '{origen: .["id.orig_h"], destino: .["id.resp_h"], proto: .proto, servicio: .service, duracion: .duration}' conn.log
```

- **Auditoría de resolución de nombres (`dns.log`):** Averigua qué máquinas internas realizaron consultas DNS y qué dirección IP obtuvieron como respuesta:

```bash:terminal
jq '{equipo: .["id.orig_h"], dominio_buscado: .query, ip_devuelta: .answers}' dns.log
```

- **Visibilidad sobre tráfico TLS/HTTPS (`ssl.log`):** Descubre a qué sitios web cifrados se conectaron los usuarios inspeccionando el campo SNI (_Server Name Indication_):

```bash:terminal
jq '{cliente: .["id.orig_h"], servidor_sni: .server_name, version_tls: .version}' ssl.log
```

### 5. Trazabilidad forense mediante el identificador único (`uid`)

El mayor superpoder de Zeek para un analista es el campo `uid` (_Unique ID_). Supongamos que en `conn.log` observas una conexión sospechosa saliente y su identificador es `CHhAvV32JBEArr62kN`.

Puedes buscar ese identificador en todos los archivos generados para reconstruir toda la sesión de punta a punta:

```bash:terminal
# Filtrar en todos los registros el identificador sospechoso
grep "CHhAvV32JBEArr62kN" *.log
```

O de forma estructurada con `jq`:

```bash:terminal
jq 'select(.uid == "CHhAvV32JBEArr62kN")' dns.log ssl.log http.log
```

En segundos verás la secuencia completa: qué dominio consultó la máquina en `dns.log`, a qué servidor web se conectó en `ssl.log` o `http.log` y qué volumen transfirió en `conn.log`, sin necesidad de buscar paquete por paquete en Wireshark.

### 6. Enriquecer el análisis cargando scripts (cálculo de hashes de archivos)

Zeek incorpora su propio lenguaje de scripting para extender su comportamiento. Por ejemplo, puedes ordenarle que calcule resúmenes criptográficos (MD5 y SHA1) de cualquier archivo transferido sin cifrar en la captura, invocando el script preinstalado `hash-all-files`:

```bash:terminal
zeek -r captura.pcap frameworks/files/hash-all-files LogAscii::use_json=T
```

Luego revisa `files.log` para ver los hashes calculados:

```bash:terminal
jq '{archivo: .filename, mime: .mime_type, md5: .md5, sha1: .sha1}' files.log
```

Estos hashes pueden contrastarse directamente en servicios de inteligencia de amenazas (como VirusTotal) para verificar si circuló malware en la red.

### 7. Monitorear una interfaz de red en tiempo real

Para poner a Zeek a escuchar una tarjeta de red en vivo (por ejemplo `enp1s0` o `eth0`), utiliza el parámetro `-i` junto con `-C` (esta bandera le indica ignorar posibles errores en los checksums de red ocasionados por la descarga por hardware o _checksum offloading_ de la placa):

```bash:terminal
sudo zeek -i enp1s0 -C LogAscii::use_json=T
```

Para detener la captura en vivo, presiona `Ctrl + C`. En un despliegue de monitoreo permanente de 24/7 para una PyME, se utiliza el componente gestor incluido `zeekctl` (_ZeekControl_), el cual administra el inicio automático, la rotación de logs diaria y el archivado comprimido.
:::

#### Aplicación práctica en una PyME y recursos oficiales

Zeek es la solución idónea para una PyME que necesita mantener un **registro histórico de auditoría de red sin saturar el almacenamiento**. Guardar archivos `.pcap` crudos de toda la empresa durante meses es inviable por el volumen de gigabytes diarios que requiere; en cambio, los archivos `.log` estructurados de Zeek comprimidos ocupan apenas una fracción de espacio (alrededor del 1% del tráfico crudo) y conservan toda la información forense indispensable para responder auditorías o investigar incidentes pasados.

Para profundizar en el desarrollo de scripts personalizados, despliegue en clúster con `zeekctl` y paquetes de la comunidad:

- [Sitio web oficial de Zeek](https://zeek.org): Portal central del proyecto, descargas y anuncios de versiones.
- [Documentación oficial de Zeek](https://docs.zeek.org): Manual de usuario, referencia del lenguaje de scripts y guías operativas.

### 5.2.5. Guía de Implementación <!-- id: seleccion-implementacion-red, icon: ToolsIcon, displayTitle: 05.2.5 — Selección e Implementación, description: Matriz de decisión técnica para elegir herramientas de red y guía práctica para desplegar un sensor pasivo integrado en una PyME. -->

Una vez estudiadas las cinco herramientas, el desafío para el responsable técnico de una organización radica en **no dispersar recursos**: saber con exactitud cuál de ellas activar ante una necesidad concreta y cómo desplegar una arquitectura de sensores que no interrumpa las operaciones del negocio.

#### Matriz de decisión: ¿Qué herramienta seleccionar según el caso?

No existe una única herramienta que resuelva todas las necesidades de visibilidad de red. La siguiente matriz guía la elección según el escenario operativo, los recursos técnicos disponibles y el objetivo inmediato:

| Escenario operativo                                                                    | Herramienta recomendada                | ¿Por qué elegirla?                                                                                                                                         | Requisitos / Limitación clave                                                                                       |
| :------------------------------------------------------------------------------------- | :------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------ |
| **Diagnóstico de emergencia en servidor remoto sin interfaz gráfica**                  | **`tcpdump`**                          | Siempre disponible, ultra liviano, no satura memoria y captura paquetes crudos con filtros quirúrgicos (BPF).                                              | Salida en consola de difícil interpretación masiva; exige descargar el PCAP para análisis profundo.                 |
| **Investigación forense visual detallada tras un incidente**                           | **`Wireshark`**                        | Permite reconstruir flujos completos (Follow Stream), explorar cada campo de cabecera y filtrar visualmente sin pérdida de datos.                          | No debe ejecutarse de forma continua como demonio en servidores; se utiliza en la estación de trabajo del analista. |
| **Vigilancia perimetral y detección automatizada de amenazas 24/7**                    | **`Suricata`**                         | Motor multihilo de alto rendimiento, reglas actualizadas de la comunidad (Emerging Threats) y emisión nativa de alertas en JSON estructurado (`eve.json`). | Requiere puerto espejo (SPAN) o TAP; solo detecta lo que coincide con una firma o regla conocida.                   |
| **Validación de reglas locales, laboratorio y análisis académico**                     | **`Snort 3`**                          | Formato de firmas estándar de la industria, ideal para aprender la sintaxis universal de reglas y probarlas offline contra capturas.                       | Instalación en producción más compleja desde fuentes; en entornos PyME se prefiere Suricata para producción.        |
| **Historial de auditoría, trazabilidad de protocolos y amenazas sin firma (Zero-Day)** | **`Zeek`**                             | No depende de firmas; registra cada sesión TCP/UDP, consulta DNS y certificado TLS con identificadores unificados (`uid`).                                 | Demanda mayor consumo de almacenamiento para conservar archivos de log históricos a lo largo del tiempo.            |
| **Arquitectura de Monitoreo Integral para PyMEs (Stack Lilium)**                       | **`Suricata` + `Zeek` en sensor SPAN** | Combinación ideal: Suricata actúa como el **sistema de alarma** en tiempo real y Zeek como el **libro de actas forense**.                                  | Requiere un servidor o VM dedicado con dos tarjetas de red (una de gestión y una de captura sin IP).                |

#### Guía práctica de implementación: Despliegue de un Sensor Pasivo Integrado

Para una PyME, la forma más sólida y segura de implementar visibilidad de red consiste en construir un **sensor pasivo dedicado**. Este diseño utiliza un equipo físico modesto o una máquina virtual con **dos interfaces de red físicas o virtuales**:

1. **Interfaz de Gestión (`eth0`):** Conectada a la red administrativa de la empresa, con dirección IP estática protegida y acceso SSH restringido exclusivamente a los operadores.
2. **Interfaz de Escucha / Sniffing (`eth1`):** Conectada directamente al puerto espejo (SPAN) del switch. Esta interfaz opera en **modo promiscuo y SIN dirección IP asignada**, lo que la vuelve matemáticamente invisible: nadie en la red monitoreada puede escanear, atacar ni comunicarse con el sensor a través del cable de monitoreo.

```
       [ Tráfico de Internet ]
                  │
          ┌───────┴───────┐
          │ Cortafuegos   │
          └───────┬───────┘
                  │  (Enlace perimetral)
          ┌───────┴───────────────────────┐
          │ Switch Administrable (Core)   │
          │  Puerto SPAN (Copia de flujo) ───┐ (Cable de monitoreo)
          └───────┬───────────────────────┘  │
                  │                          ▼
          ┌───────┴───────┐        ┌─────────────────────────┐
          │ Red de PyME   │        │ SENSOR DEDICADO         │
          │ (VLANs / DMZ) │        │  NIC 1: Sin IP (Sniff)  │
          └───────────────┘        │         Suricata + Zeek │
                                   │  NIC 2: Gestión (SSH/IP)│
                                   └────────────┬────────────┘
                                                │ (Alertas JSON)
                                                ▼
                                   [ SIEM / Colector Logs ]
```

:::steps

### 1. Configurar la interfaz de escucha en modo promiscuo y sin dirección IP

En el servidor Linux (Debian o Ubuntu) destinado al sensor, identifica la interfaz conectada al puerto espejo (por ejemplo, `enp2s0`). Para garantizar que no tenga IP y que arranque en modo promiscuo tras cada reinicio, configúrala en `/etc/netplan/01-sensor.yaml`:

```yaml:/etc/netplan/01-sensor.yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp1s0:
      dhcp4: false
      addresses: [192.168.10.50/24] # IP de gestión administrativa
      routes:
        - to: default
          via: 192.168.10.1
    enp2s0:
      dhcp4: false
      dhcp6: false
      activation-mode: off
```

Aplica el modo promiscuo mediante un comando directo o una regla de inicio con `ip link`:

```bash:terminal
sudo ip link set enp2s0 promisc on
sudo ip link set enp2s0 up
```

Verifica con `ip -br addr show enp2s0`: la interfaz debe figurar en estado `UP`, sin ninguna dirección IPv4 o IPv6 asociada y con la bandera `PROMISC`.

### 2. Puesta en marcha de Suricata para detección continua de intrusiones

Asigna la interfaz `enp2s0` dentro de `/etc/suricata/suricata.yaml` en la sección `af-packet`. Habilita el hilo de actualización automática de firmas mediante un temporizador del sistema:

```bash:terminal
sudo suricata-update
sudo systemctl enable --now suricata
```

A partir de este momento, cualquier ataque conocido o escaneo que cruce el switch principal quedará registrado de inmediato en `/var/log/suricata/eve.json`.

### 3. Puesta en marcha de Zeek para trazabilidad y metadatos de sesión

Configura Zeek para que escuche la misma tarjeta de red (`enp2s0`) editando `/opt/zeek/etc/node.cfg`:

```ini:/opt/zeek/etc/node.cfg
[zeek]
type=standalone
host=localhost
interface=enp2s0
```

Si deseas que Zeek genere automáticamente sus registros en formato JSON para facilitar su correlación futura con Suricata y con el SIEM del Módulo 5.4, añade al final de `/opt/zeek/share/zeek/site/local.zeek`:

```zeek:/opt/zeek/share/zeek/site/local.zeek
@load policy/tuning/json-logs.zeek
```

Inicia la supervisión del servicio mediante ZeekControl:

```bash:terminal
sudo zeekctl check
sudo zeekctl deploy
```

Zeek comenzará a estructurar el historial cronológico de todas las conexiones en `/opt/zeek/logs/current/`.

### 4. Flujo de trabajo del analista: Inspección puntual con Wireshark

Cuando una alerta crítica aparezca en el archivo `eve.json` de Suricata, no intentes descargar gigabytes de capturas indiscriminadas. Utiliza `tcpdump` en el propio sensor para extraer únicamente los minutos y las IPs involucradas en el incidente:

```bash:terminal
sudo tcpdump -i enp2s0 -nn -s 0 "host 192.168.1.150 and port 443" -c 1000 -w /tmp/incidente_extraido.pcap
```

Transfiere ese archivo acotado a tu estación de trabajo mediante SCP:

```bash:terminal
scp analista@192.168.10.50:/tmp/incidente_extraido.pcap ~/analisis/
```

Ábrelo en Wireshark en tu computadora para reconstruir la conversación y validar la gravedad del evento. Una vez descargado, elimina el archivo del sensor para mantener la higiene de evidencias.

:::

### 5. Rutina operativa de triaje diario (15 minutos)

Para que el sensor no se convierta en un repositorio pasivo de datos ignorados, establece una rutina diaria matutina de 15 minutos:

1. **Revisar alertas críticas de Suricata:**
   ```bash:terminal
   sudo tail -n 100 /var/log/suricata/eve.json | jq 'select(.event_type=="alert" and .alert.severity <= 2) | {hora: .timestamp, origen: .src_ip, destino: .dest_ip, regla: .alert.signature}'
   ```
2. **Auditar consultas DNS sospechosas en Zeek:**
   ```bash:terminal
   tail -n 200 /opt/zeek/logs/current/dns.log | jq 'select(.query | test("\\.xyz$|\\.top$|\\.onion$")) | {equipo: .["id.orig_h"], dominio: .query}'
   ```
3. **Comprobar paquetes malformados o evasiones:**
   ```bash:terminal
   tail -n 50 /opt/zeek/logs/current/weird.log | jq '{tipo: .name, origen: .["id.orig_h"], mensaje: .notice}'
   ```

Esta arquitectura proporciona a una pequeña o mediana empresa una capacidad de detección de nivel profesional con costo de licenciamiento cero, preparando la telemetría de red para su integración con la visibilidad en endpoints que abordaremos en la sección `05.3`.

## 5.3. Visibilidad en el Endpoint <!-- id: visibilidad-endpoint, icon: Shield01Icon -->

Una amenaza no siempre necesita atravesar una conexión de red sospechosa para comprometer una organización. Puede ejecutarse directamente en una estación de trabajo, aprovechar herramientas legítimas del sistema operativo o modificar archivos críticos sin generar señales evidentes en el tráfico de red. Para detectar estas actividades es necesario observar lo que sucede dentro de cada dispositivo, no solamente lo que entra y sale de él.

La visibilidad en el _endpoint_ (punto final) incorpora mecanismos de protección, monitoreo y detección directamente en servidores y estaciones de trabajo. Mediante tecnologías como el antimalware, los sistemas de detección de intrusiones basados en host, las plataformas EDR y el monitoreo de integridad de archivos, una organización puede identificar comportamientos anómalos, alteraciones no autorizadas y posibles indicadores de compromiso en los propios sistemas que necesita proteger.

### El problema: ¿qué sucede dentro de un dispositivo?

En la subsección anterior se estudió cómo observar las comunicaciones que circulan por la infraestructura de una organización. Los sistemas de detección de intrusiones en red permiten identificar conexiones sospechosas, patrones de comunicación inusuales, reconocimiento de servicios y otros comportamientos que pueden indicar un ataque.

Sin embargo, esta observación tiene un límite importante: **el tráfico de red no siempre permite conocer qué está sucediendo dentro del dispositivo que origina una comunicación.**

Una estación de trabajo puede establecer una conexión HTTPS aparentemente legítima hacia un servidor externo. Desde el punto de observación de la red, la comunicación puede parecer normal, especialmente cuando su contenido está cifrado. Sin embargo, el proceso que la inició podría ser un script ejecutado por un atacante, un programa no autorizado o una herramienta administrativa utilizada fuera de su contexto habitual.

Los metadatos de la comunicación pueden seguir siendo observables, pero conocer la dirección de destino y el volumen de datos transmitidos no necesariamente permite determinar qué programa inició la conexión, qué instrucciones ejecutó o qué modificaciones realizó en el dispositivo.

Esta limitación se vuelve especialmente relevante frente a dos categorías de técnicas adversarias.

#### Abuso de herramientas legítimas del sistema (Living off the Land)

Los atacantes pueden utilizar componentes que ya existen en el sistema operativo para realizar actividades maliciosas. En lugar de instalar un programa desconocido, aprovechan herramientas legítimas como PowerShell, Windows Management Instrumentation (WMI), Bash o diferentes utilidades administrativas.

Esta estrategia se conoce como _Living off the Land_ (LotL). Su principal ventaja para el atacante es que las herramientas utilizadas pueden ser habituales en las operaciones de la organización. Por lo tanto, su mera presencia o ejecución no constituye una señal suficiente para identificar una intrusión.

Un intérprete de comandos, por ejemplo, puede utilizarse tanto para realizar tareas administrativas como para ejecutar instrucciones maliciosas. La diferencia depende del contexto: quién lo ejecutó, desde qué proceso, con qué argumentos, en qué momento y con qué consecuencias.

#### Malware sin archivos tradicionales (Fileless Malware)

Otra dificultad aparece cuando el código malicioso se ejecuta principalmente en memoria o aprovecha componentes legítimos del sistema para llevar a cabo sus acciones.

En estos escenarios puede no existir un ejecutable malicioso convencional almacenado en disco que permita una detección sencilla mediante firmas. Esto dificulta el trabajo de los mecanismos centrados exclusivamente en analizar archivos.

> [!NOTE] Una precisión importante
> El término _fileless_ no significa necesariamente que nunca se escriba información en disco. Una amenaza de este tipo puede utilizar scripts temporales, registros, archivos auxiliares u otros artefactos. Lo que caracteriza a estas técnicas es que no dependen necesariamente de un ejecutable malicioso tradicional como principal mecanismo de ejecución.

Ambas situaciones demuestran por qué una estrategia de detección no puede depender exclusivamente del análisis de archivos o del tráfico de red. También necesita observar procesos, actividad del sistema operativo, cambios en los archivos y comportamientos durante la ejecución.

#### ¿Qué información necesitamos observar?

Un dispositivo contiene diferentes fuentes de información que pueden revelar actividades sospechosas. Entre las más relevantes se encuentran:

- **Procesos:** programas que se encuentran en ejecución, su origen y las relaciones entre los procesos que los iniciaron y aquellos que posteriormente crearon.
- **Ejecución de comandos:** intérpretes utilizados, argumentos de línea de comandos y scripts ejecutados.
- **Archivos:** creación, eliminación y modificación de archivos, especialmente los pertenecientes al sistema operativo o a aplicaciones críticas.
- **Configuraciones:** cambios en parámetros de seguridad, mecanismos de inicio automático, servicios y permisos.
- **Actividad de usuarios:** operaciones realizadas por cuentas locales, administradores y usuarios con privilegios elevados.
- **Conexiones asociadas a procesos:** direcciones remotas, puertos y comunicaciones que pueden relacionarse con un proceso específico, cuando el sistema y la herramienta proporcionan esa telemetría.

Esta información constituye la base de la visibilidad en el endpoint. Su recopilación permite pasar de observar conexiones aisladas a comprender mejor la actividad que se desarrolla dentro de cada dispositivo.

### Tecnologías de seguridad en el endpoint

No todas las herramientas de seguridad instaladas en un dispositivo cumplen la misma función. Algunas se especializan en identificar archivos maliciosos, otras supervisan los eventos internos del sistema y otras registran comportamientos para facilitar la investigación de amenazas.

Comprender estas diferencias permite seleccionar controles complementarios en lugar de acumular herramientas que realizan tareas similares o dejan necesidades importantes sin cubrir.

#### Antivirus y antimalware tradicional (AV)

El software antivirus (AV, _Antivirus_) es uno de los mecanismos más extendidos para proteger estaciones de trabajo y servidores frente a programas maliciosos.

Su propósito principal es identificar, bloquear o poner en cuarentena archivos y códigos que puedan representar una amenaza. Para hacerlo, utiliza diferentes mecanismos de detección.

**Detección basada en firmas**

Una firma es un patrón identificable asociado a una amenaza conocida. El motor antimalware compara los archivos analizados con una base de datos que contiene firmas de malware previamente identificado.

Cuando encuentra una coincidencia, puede clasificar el archivo como malicioso y ejecutar la acción configurada.

Este mecanismo resulta especialmente útil para detectar amenazas conocidas y variantes que mantienen características reconocibles. Su principal limitación es que necesita disponer de información previa sobre las amenazas o de otros mecanismos capaces de identificar variantes nuevas.

**Análisis heurístico**

El análisis heurístico busca identificar características que podrían indicar actividad maliciosa, incluso cuando el archivo no coincide exactamente con una firma conocida.

Puede evaluar estructuras, instrucciones, características del código y otros patrones que suelen aparecer en programas sospechosos.

A diferencia de la detección basada exclusivamente en firmas, permite identificar algunas variantes desconocidas. Sin embargo, puede generar falsos positivos cuando un programa legítimo presenta características similares a las de una amenaza.

**Detección basada en comportamiento**

Los motores antimalware modernos también pueden supervisar determinadas acciones realizadas durante la ejecución de un programa.

Por ejemplo, podrían detectar comportamientos asociados con el cifrado masivo de archivos, intentos de modificar componentes protegidos o actividades sospechosas sobre otros procesos.

Esta capacidad amplía la protección más allá del análisis estático de archivos y permite reconocer amenazas que no dependen de firmas conocidas.

> [!TIP] No todos los antivirus funcionan igual
> La clasificación tradicional de los antivirus como herramientas exclusivamente basadas en firmas es una simplificación. Las soluciones modernas pueden combinar firmas, reputación, análisis heurístico, servicios de inteligencia y detección basada en comportamiento. Las capacidades disponibles dependen del producto, su configuración y su licencia.

**Limitaciones operativas**

Un antimalware no garantiza que todos los programas maliciosos sean identificados. Puede no detectar una variante desconocida, una ejecución realizada principalmente en memoria o el abuso de una herramienta administrativa legítima cuyo comportamiento no resulte suficientemente anómalo para el motor de detección.

Tampoco sustituye la necesidad de monitorear procesos, investigar eventos o verificar modificaciones en archivos críticos.

**Ejemplos de herramientas:**

- **Microsoft Defender Antivirus:** solución integrada en las versiones compatibles de Windows, con protección en tiempo real, análisis de archivos y diferentes mecanismos de detección. No debe confundirse con Microsoft Defender for Endpoint, que incorpora capacidades empresariales de detección y respuesta.
- **ClamAV:** motor antimalware de código abierto utilizado principalmente en sistemas Linux y servidores para analizar archivos. Dispone de análisis bajo demanda y capacidades de monitoreo de acceso en Linux mediante `clamonacc`, sujetas a requisitos específicos. No ofrece por sí solo las capacidades de telemetría e investigación propias de una plataforma EDR.

La diferencia entre estas herramientas no se limita a su licencia: también importa el sistema operativo, el modelo de protección y las funciones que cada solución proporciona.

#### Sistema de Detección de Intrusiones basado en Host (HIDS)

Un sistema de detección de intrusiones basado en host (HIDS, _Host-Based Intrusion Detection System_) supervisa la actividad de un dispositivo individual para identificar eventos que puedan indicar una intrusión o una desviación respecto de las políticas de seguridad establecidas.

A diferencia de un sistema NIDS, que observa el tráfico de una red, un HIDS obtiene información directamente del sistema operativo donde se encuentra instalado.

Generalmente funciona mediante un agente o servicio que recopila información y la compara con reglas, patrones o referencias previamente definidos.

**¿Qué puede supervisar?**

Según la herramienta y los módulos habilitados, un HIDS puede recopilar y analizar:

- Registros de eventos del sistema operativo.
- Intentos de autenticación exitosos y fallidos.
- Actividades relacionadas con usuarios y privilegios.
- Cambios en archivos y configuraciones.
- Determinadas actividades de procesos y servicios.
- Indicadores asociados con la presencia de rootkits u otras alteraciones del sistema.

Por ejemplo, un servidor Linux podría registrar una modificación inesperada en la configuración de SSH o una actividad de autenticación que no corresponde con su comportamiento habitual. Un HIDS puede supervisar estas fuentes y generar una alerta cuando encuentra una condición sospechosa.

**Agentes y administración**

El agente es el componente instalado en el endpoint. Su función es recopilar información local y ejecutar las verificaciones configuradas.

En organizaciones con múltiples dispositivos, estos agentes pueden enviar los eventos a una plataforma de administración centralizada. Esto permite revisar el estado de los equipos sin tener que acceder individualmente a cada uno.

Una herramienta de este tipo es **Wazuh**, que ofrece capacidades de detección basadas en host, análisis de registros, monitoreo de integridad y otras funciones de seguridad. Su agente puede instalarse en diferentes sistemas operativos y enviar información a un servidor Wazuh.

Otra alternativa es **OSSEC**, una plataforma de detección de intrusiones basada en host de código abierto, sobre cuya base se desarrolló Wazuh.

> [!NOTE] HIDS y FIM no son sinónimos
> El monitoreo de integridad de archivos puede formar parte de un HIDS, pero no todos los HIDS implementan exactamente las mismas capacidades. Un HIDS puede incorporar análisis de registros y otras fuentes de eventos, mientras que FIM se concentra específicamente en detectar modificaciones sobre archivos y componentes supervisados.

**Limitaciones operativas**

Un HIDS depende de la información que puede recopilar del sistema y de las reglas con las que analiza los eventos. Si una actividad maliciosa no genera un evento supervisado o no coincide con ningún criterio de detección, puede pasar inadvertida.

Además, requiere mantenimiento de los agentes, revisión de reglas y administración de las alertas. En un entorno donde nadie verifica los resultados, su capacidad de detección pierde gran parte de su utilidad.

#### Sistema de Prevención de Intrusiones basado en Host (HIPS)

Un sistema de prevención de intrusiones basado en host (HIPS, _Host-Based Intrusion Prevention System_) incorpora mecanismos destinados a bloquear actividades potencialmente maliciosas directamente en el dispositivo.

Su principal diferencia respecto de un HIDS está en el propósito: mientras el HIDS busca detectar y alertar, el HIPS puede intervenir para impedir que una acción sospechosa continúe.

Según su implementación, un HIPS puede incorporar controles como:

- Restricciones sobre la ejecución de determinadas aplicaciones.
- Bloqueo de comportamientos asociados con la explotación de vulnerabilidades.
- Prevención de modificaciones no autorizadas en componentes protegidos.
- Restricciones sobre determinadas operaciones de procesos.
- Bloqueo de actividades consideradas incompatibles con las políticas de seguridad.

Por ejemplo, una política de prevención puede impedir que un proceso no autorizado modifique un archivo protegido o que una aplicación descargada ejecute determinadas instrucciones.

**Diferencia entre detección y prevención**

La diferencia no está necesariamente en la información recopilada, sino en la acción que ejecuta el mecanismo de seguridad.

Un HIDS puede detectar que un proceso intenta alterar una configuración crítica y generar una alerta. Un HIPS, cuando dispone de una regla apropiada, puede bloquear esa operación antes de que se complete.

Sin embargo, la prevención también introduce riesgos operativos. Una regla demasiado restrictiva puede bloquear una aplicación legítima, interrumpir un servicio o impedir una tarea administrativa necesaria.

Por eso, las políticas preventivas deben definirse de acuerdo con el comportamiento esperado del sistema y probarse antes de aplicarse de manera generalizada.

#### Detección y Respuesta en el Punto Final (EDR)

La detección y respuesta en el punto final (EDR, _Endpoint Detection and Response_) proporciona una capacidad de observación mucho más amplia sobre la actividad de los dispositivos.

Mientras un antivirus tradicional se concentra principalmente en identificar y bloquear amenazas, una solución EDR recopila telemetría del endpoint para detectar comportamientos sospechosos, reconstruir secuencias de actividad e investigar posibles incidentes.

Puede entenderse como una caja negra de aviación: no se limita a informar que ocurrió un problema, sino que conserva información sobre determinados acontecimientos previos y posteriores para ayudar a comprender qué sucedió.

**Telemetría del endpoint**

La telemetría es la información generada y recopilada sobre el estado y la actividad de un sistema.

Una solución EDR puede registrar diferentes tipos de eventos, entre ellos:

- **Creación de procesos:** qué programa se ejecutó, cuándo y bajo qué usuario.
- **Relaciones entre procesos:** qué proceso inició a otro, permitiendo construir árboles de ejecución.
- **Argumentos de ejecución:** instrucciones y parámetros utilizados al iniciar un programa.
- **Actividad sobre archivos:** creación, modificación, eliminación y acceso a determinados componentes.
- **Cambios en el sistema:** modificaciones de configuraciones o claves del Registro de Windows, según la plataforma.
- **Conexiones de red:** direcciones remotas, puertos y procesos asociados a determinadas comunicaciones.
- **Carga de módulos y bibliotecas:** componentes adicionales incorporados durante la ejecución de procesos, cuando el agente puede observarlos.

La disponibilidad de estos eventos varía entre fabricantes, sistemas operativos, configuraciones y niveles de licencia. No todos los productos registran la totalidad de esta información.

**Detección por correlación de comportamientos**

El principal valor de un EDR reside en que permite analizar eventos relacionados entre sí, en lugar de evaluar cada actividad de forma aislada.

Consideremos una secuencia de operaciones:

1. Un documento es abierto por un usuario.
2. El proceso asociado inicia un intérprete de comandos.
3. El intérprete ejecuta una serie de instrucciones inusuales.
4. Se inicia otro proceso que intenta establecer una conexión externa.
5. Se producen modificaciones en determinados archivos del sistema.

Cada evento, considerado individualmente, podría tener una explicación legítima. Sin embargo, su secuencia y sus relaciones pueden revelar un comportamiento sospechoso.

Un EDR permite reconstruir esta cadena de actividad y proporcionar contexto para determinar si existe una amenaza.

**Capacidades de respuesta**

Además de detectar e investigar, muchas soluciones EDR incorporan mecanismos que permiten actuar sobre el endpoint desde una consola de administración.

Entre las capacidades disponibles pueden encontrarse:

- Aislar un equipo de la red, conservando determinados canales de administración.
- Finalizar procesos identificados como maliciosos.
- Poner archivos en cuarentena.
- Ejecutar análisis adicionales.
- Obtener información complementaria del dispositivo.

La disponibilidad de estas acciones depende de la solución implementada y de los permisos configurados.

> [!WARNING] EDR no significa prevención absoluta
> Una plataforma EDR puede detectar comportamientos que no son reconocidos por un antivirus tradicional, pero también puede ser evadida, tener cobertura incompleta o carecer de telemetría para determinados eventos. Su eficacia depende de la configuración del agente, las políticas de detección, las actualizaciones y la revisión de las alertas.

**EDR frente a HIDS y HIPS**

Aunque estas tecnologías pueden compartir fuentes de información, sus objetivos principales son diferentes.

| Tecnología | Función principal                                 | Tipo de control                                        | Resultado esperado                                          |
| ---------- | ------------------------------------------------- | ------------------------------------------------------ | ----------------------------------------------------------- |
| AV         | Identificar y bloquear malware.                   | Preventivo y detectivo.                                | Archivo detectado, bloqueado o puesto en cuarentena.        |
| HIDS       | Supervisar eventos internos del sistema.          | Detectivo.                                             | Alerta ante actividad sospechosa.                           |
| HIPS       | Bloquear acciones no autorizadas.                 | Preventivo.                                            | Acción sospechosa impedida.                                 |
| EDR        | Registrar, analizar e investigar comportamientos. | Detectivo y de respuesta; puede incorporar prevención. | Secuencia de actividad identificada y acciones disponibles. |
| FIM        | Supervisar modificaciones en archivos críticos.   | Detectivo.                                             | Alerta ante cambios respecto de una referencia.             |

_Comparación funcional de las principales tecnologías de seguridad en el endpoint. Las capacidades reales pueden superponerse según la solución implementada._

Una misma plataforma comercial puede incorporar funciones de antivirus, prevención de intrusiones y EDR. Esto no significa que los conceptos sean intercambiables: cada capacidad responde a una necesidad de seguridad diferente.

En particular, CIS Controls v8.1 contempla expresamente un cliente EDR como ejemplo de implementación de una solución de prevención de intrusiones basada en host en la salvaguarda 13.7. Esta relación reconoce que las plataformas EDR modernas pueden incorporar mecanismos preventivos, pero no convierte ambas categorías en sinónimos.

#### Monitoreo de Integridad de Archivos (FIM)

El monitoreo de integridad de archivos (FIM, _File Integrity Monitoring_) es un mecanismo que permite detectar modificaciones en archivos, directorios y determinados componentes del sistema.

Su propósito es identificar cambios que podrían indicar una alteración no autorizada, una configuración incorrecta o una actividad maliciosa.

Esto es especialmente importante porque un atacante que obtiene acceso a un dispositivo puede intentar modificar componentes existentes en lugar de instalar herramientas nuevas.

Por ejemplo, podría alterar un archivo de configuración para debilitar la autenticación, reemplazar un ejecutable legítimo o modificar un mecanismo de inicio automático para mantener su acceso después de un reinicio.

**¿Qué elementos conviene supervisar?**

La selección depende del sistema operativo, los servicios instalados y la importancia de los activos.

:::group title="Linux" description="Archivos y configuraciones relevantes en servidores y estaciones de trabajo">

- `/etc/passwd`: información de las cuentas locales. Las modificaciones deben corresponder a operaciones administrativas autorizadas.
- `/etc/shadow`: información protegida relacionada con las credenciales locales.
- `/etc/ssh/sshd_config`: parámetros de configuración del servicio SSH.
- `/usr/bin` y `/usr/sbin`: directorios que contienen numerosos ejecutables y utilidades del sistema.
- `/etc/systemd/system`: archivos de unidades de servicios que pueden intervenir en mecanismos de inicio y persistencia.
  :::

:::group title="Windows" description="Componentes y configuraciones críticas">

- `C:\Windows\System32`: contiene componentes y ejecutables fundamentales del sistema operativo.
- Directorios de aplicaciones críticas: binarios y archivos de configuración de software empresarial.
- Claves de inicio automático del Registro de Windows, como las correspondientes a `Run` y `RunOnce`.
- Directorios de inicio automático de usuarios y del sistema.
- Archivos relacionados con servicios y componentes de seguridad.
  :::

No es necesario monitorear indiscriminadamente todos los archivos del equipo. La prioridad debe estar en aquellos cuya modificación podría afectar la seguridad, la disponibilidad o el funcionamiento de los servicios.

**Tipos de modificaciones detectables**

Según las capacidades del motor FIM, pueden supervisarse:

- Creación de nuevos archivos.
- Eliminación de archivos existentes.
- Modificación del contenido.
- Cambios en los permisos de acceso.
- Cambios de propietario y grupo.
- Modificaciones de atributos y metadatos.
- Cambios en claves del Registro de Windows, cuando la solución incorpora esa capacidad.

La herramienta puede comparar los atributos actuales con los registrados anteriormente y generar una alerta ante una discrepancia.

**Monitoreo periódico y monitoreo en tiempo real**

Existen diferentes estrategias para observar los elementos protegidos.

- **Monitoreo periódico:** realiza verificaciones en intervalos establecidos. Permite comparar el estado actual de los archivos con una referencia, aunque una modificación puede permanecer sin detectar hasta el siguiente análisis.
- **Monitoreo en tiempo real:** utiliza mecanismos del sistema operativo para identificar cambios poco después de que ocurren. Es especialmente útil en directorios críticos, aunque puede generar una cantidad considerable de eventos.

Ambos enfoques pueden complementarse. Una organización puede aplicar monitoreo continuo sobre determinados directorios y análisis periódicos sobre otros elementos.

> [!WARNING] Una modificación no siempre representa un ataque
> Las actualizaciones del sistema operativo, la instalación de aplicaciones y los cambios administrativos autorizados también modifican archivos. FIM identifica diferencias respecto del estado registrado, pero no determina automáticamente si cada cambio es malicioso. Esa evaluación necesita contexto operativo y autorización documentada.

### Integridad criptográfica: cómo saber si un archivo fue alterado

Monitorear los archivos importantes permite identificar cambios, pero es necesario comprender cómo se determina que un archivo mantiene su integridad.

Uno de los mecanismos más utilizados para esta tarea es el cálculo de funciones hash criptográficas.

#### Funciones hash y SHA-256

Una función hash criptográfica recibe una entrada de cualquier tamaño y produce un resumen de longitud fija, denominado _hash_ o huella digital.

SHA-256 (_Secure Hash Algorithm 256-bit_) es una función de la familia SHA-2 que genera un resumen de 256 bits, representado habitualmente mediante una cadena hexadecimal de 64 caracteres.

Su utilidad para la verificación de integridad se fundamenta en varias propiedades:

- El mismo contenido produce el mismo resumen.
- Una pequeña modificación en el contenido produce, con altísima probabilidad, un resumen diferente.
- No resulta computacionalmente viable reconstruir el contenido original a partir del resumen.
- Encontrar dos archivos distintos que produzcan el mismo resumen resulta computacionalmente inviable con los recursos actuales, bajo los supuestos de seguridad del algoritmo.

Por ejemplo, modificar un solo carácter de un archivo de configuración puede producir una huella completamente diferente.

Esto permite utilizar los hashes como identificadores del contenido de un archivo y compararlos en distintos momentos.

#### Por qué calcular un hash no demuestra integridad

Existe una confusión frecuente: asumir que obtener el hash de un archivo permite determinar si ese archivo es legítimo.

En realidad, el cálculo aislado no proporciona esa garantía.

Supongamos que un atacante consigue modificar un ejecutable del sistema. El archivo original tenía un contenido legítimo y, por lo tanto, un hash determinado. Después de la modificación, el ejecutable contiene instrucciones maliciosas.

Si un administrador ejecuta `sha256sum` sobre ese archivo, el comando calculará correctamente el resumen criptográfico de su contenido actual.

El resultado será técnicamente válido, aunque el archivo esté comprometido.

Por lo tanto:

**Un hash permite identificar el contenido de un archivo, pero no demuestra por sí solo que ese contenido sea confiable.**

Para realizar una verificación de integridad es indispensable disponer de una referencia confiable con la cual comparar el resultado.

#### Línea base confiable (Trusted Baseline)

Una línea base confiable es una referencia que representa el estado legítimo y verificado de un archivo, directorio o sistema en un momento determinado.

En el contexto de FIM, contiene los valores de referencia que permitirán reconocer modificaciones posteriores.

Para que una comparación tenga valor, la línea base debe cumplir determinadas condiciones.

**Debe haberse generado en un estado confiable.**

La referencia debe obtenerse durante el aprovisionamiento inicial de un sistema verificado o a partir de una fuente legítima y autenticada.

Por ejemplo:

- Una instalación limpia y validada del sistema operativo.
- Un paquete oficial cuya autenticidad e integridad se hayan comprobado.
- Un manifiesto de hashes publicado por el proveedor y cuya firma digital pueda verificarse.
- Una imagen de sistema previamente aprobada por la organización.

No debe establecerse una línea base a partir de un dispositivo cuya integridad todavía está en duda.

**Debe estar protegida contra modificaciones no autorizadas.**

La referencia no debería depender exclusivamente del mismo dispositivo que se está supervisando.

Si un atacante obtiene privilegios administrativos o de sistema, podría modificar tanto el archivo original como el registro local utilizado para verificarlo.

Por eso, las referencias deben almacenarse en un sistema separado, con acceso restringido, permisos de solo lectura para los procesos de verificación y mecanismos de protección frente a modificaciones.

Cuando corresponda, pueden protegerse mediante firmas digitales y almacenamiento inmutable.

**Debe corresponder al activo y a su versión.**

Los archivos pueden diferir legítimamente entre equipos, distribuciones y versiones de software.

Una línea base debe identificar el dispositivo, la versión del sistema, los paquetes instalados y los componentes incluidos. No conviene asumir que dos equipos con el mismo sistema operativo deben tener exactamente los mismos hashes.

**Debe actualizarse mediante cambios autorizados.**

La instalación de un parche puede modificar cientos de archivos legítimos.

Por lo tanto, después de una actualización aprobada, es necesario verificar el nuevo estado y actualizar las referencias correspondientes. La nueva línea base debe generarse a partir de un sistema cuya legitimidad se haya comprobado, no mediante una aceptación automática de cualquier cambio detectado.

> [!CRITICAL] La línea base también debe ser confiable
> Si un atacante modifica un archivo y posteriormente actualiza la referencia local para que ambos hashes coincidan, la comparación deja de proporcionar evidencia útil. La protección de la línea base es una parte fundamental del mecanismo de integridad, no un detalle secundario.

#### Verificación práctica mediante SHA-256

Los sistemas operativos proporcionan herramientas nativas para calcular y comparar hashes.

**Linux: `sha256sum`**

Requisitos previos:

- Distribución Linux que incluya GNU Coreutils.
- Acceso de lectura al archivo evaluado.
- Para archivos protegidos, privilegios administrativos mediante `sudo`.
- Una línea base obtenida previamente en un estado confiable y almacenada en una ubicación protegida.

Para calcular el hash de un archivo:

```bash:terminal
sudo sha256sum /etc/ssh/sshd_config
```

El resultado tendrá una estructura similar a esta:

```text:salida-terminal
<hash-sha256>  /etc/ssh/sshd_config
```

La cadena hexadecimal representa el contenido actual del archivo.

Sin embargo, este comando todavía no permite determinar si el contenido es legítimo.

Para realizar una comparación, se necesita un manifiesto que contenga los hashes esperados.

:::steps

### Generar la referencia inicial

Durante el aprovisionamiento de un servidor verificado, se calculan los hashes de los archivos seleccionados y se guarda el resultado en un manifiesto.

En este ejemplo se utiliza un servidor Linux y dos archivos seleccionados para supervisión:

```bash:terminal
cd /

sudo sha256sum etc/passwd etc/ssh/sshd_config | sudo tee /root/servidor01.sha256 >/dev/null
```

El archivo generado contiene los resúmenes criptográficos y las rutas de los archivos originales.

Esta operación debe realizarse cuando se haya verificado que el sistema está en un estado legítimo. Si alguno de los archivos no existe en la distribución o configuración utilizada, debe sustituirse por otro archivo cuya ubicación y función se hayan confirmado.

### Proteger la referencia

La copia del manifiesto debe trasladarse a un repositorio o almacenamiento independiente, con acceso restringido y protección frente a modificaciones.

No debe utilizarse únicamente la copia almacenada en `/root` como referencia definitiva, porque sigue estando dentro del dispositivo evaluado.

Para la verificación posterior, se supone que el manifiesto se encuentra disponible en `/mnt/secure-baseline/servidor01.sha256`, montado desde un almacenamiento protegido.

### Comprobar el estado actual

Ejecuta la verificación desde la raíz del sistema para que las rutas relativas del manifiesto se interpreten correctamente:

```bash:terminal
cd /

sudo sha256sum --check /mnt/secure-baseline/servidor01.sha256
```

### Interpretar el resultado

Si el archivo coincide con la referencia, el comando devuelve:

```text:salida-terminal
etc/passwd: OK
etc/ssh/sshd_config: OK
```

Si el contenido de uno de los archivos es diferente, aparecerá:

```text:salida-terminal
etc/ssh/sshd_config: FAILED
```

Una discrepancia debe investigarse antes de concluir que existe una intrusión. Puede corresponder a una actualización, una modificación administrativa autorizada o una alteración maliciosa.

:::

**Windows: `Get-FileHash`**

En Windows, PowerShell proporciona el cmdlet `Get-FileHash`, que permite calcular el resumen criptográfico de un archivo utilizando SHA-256.

Requisitos previos:

- Windows con PowerShell y el módulo estándar `Microsoft.PowerShell.Utility` disponible.
- Permisos de lectura sobre el archivo.
- Una referencia confiable previamente generada.

Ejemplo:

```powershell:terminal
Get-FileHash -LiteralPath "C:\Windows\System32\notepad.exe" -Algorithm SHA256
```

El resultado muestra tres campos:

- `Algorithm`: algoritmo utilizado.
- `Hash`: resumen criptográfico calculado.
- `Path`: ubicación del archivo analizado.

Para verificar la integridad es necesario comparar el valor de `Hash` con el correspondiente a la referencia confiable del mismo archivo y versión del sistema.

> [!NOTE] Hashes, firmas y autenticidad
> Un hash y una firma digital no son equivalentes. El hash identifica el contenido, mientras que una firma digital permite verificar su autenticidad e integridad mediante una clave pública confiable. Cuando un proveedor ofrece manifiestos firmados, verificar la firma antes de utilizar sus hashes agrega una capa importante de confianza.

#### Integridad mediante herramientas automatizadas

Calcular manualmente hashes de decenas o cientos de archivos no es una estrategia operativa sostenible para una organización.

Aquí es donde las soluciones FIM automatizan el proceso.

Una herramienta de monitoreo de integridad puede:

1. Identificar los archivos y directorios seleccionados.
2. Obtener sus hashes y atributos relevantes.
3. Registrar un estado inicial de referencia.
4. Realizar verificaciones periódicas o monitoreo continuo.
5. Comparar el estado actual con la referencia registrada.
6. Generar alertas ante discrepancias.

Por ejemplo, Wazuh incorpora un módulo de _File Integrity Monitoring_ que almacena hashes y otros atributos de los archivos supervisados. Cuando identifica una modificación, puede generar una alerta que indique qué archivo cambió y qué diferencias fueron detectadas.

Esto permite supervisar múltiples endpoints sin depender de verificaciones manuales realizadas individualmente.

No obstante, es importante comprender cómo se protege la base de datos de integridad: una referencia almacenada localmente puede verse comprometida si el atacante obtiene suficiente control sobre el dispositivo. Por eso, las soluciones de monitoreo deben complementarse con administración externa de los agentes, protección de las alertas y almacenamiento independiente de las referencias críticas.

### Implementación progresiva en una PyME

La visibilidad en el endpoint no requiere necesariamente implementar una plataforma empresarial compleja desde el primer día.

Para una pequeña o mediana empresa, la prioridad es establecer una protección consistente sobre los activos que utiliza, mantenerla operativa y ampliar progresivamente la capacidad de detección según los riesgos identificados.

La implementación puede organizarse en niveles de madurez siguiendo los Grupos de Implementación de CIS Controls v8.1.

#### Protección antimalware: nivel básico (IG1)

El primer objetivo es evitar que los dispositivos operen sin una protección antimalware funcional.

Una PyME debería:

- Identificar las estaciones de trabajo y servidores compatibles con soluciones antimalware.
- Instalar y mantener una herramienta autorizada en todos los activos que la admitan.
- Habilitar la protección en tiempo real cuando esté disponible.
- Configurar la actualización automática de firmas.
- Comprobar periódicamente que los motores de detección y las bases de firmas estén actualizados.
- Evitar que los usuarios deshabiliten la protección sin autorización.
- Establecer un procedimiento para revisar archivos detectados y alertas de seguridad.

En esta etapa, una solución integrada en el sistema operativo puede ser suficiente para cubrir las necesidades iniciales, siempre que se encuentre correctamente configurada y mantenida.

**Ejemplos de implementación:**

- Microsoft Defender Antivirus en equipos Windows compatibles.
- ClamAV para análisis antimalware en servidores Linux y determinados flujos de archivos, teniendo en cuenta que no sustituye una plataforma completa de protección de endpoints.

La prioridad no es adquirir varias herramientas, sino asegurar que todos los activos relevantes cuenten con una protección efectiva y que esta no quede desactualizada.

#### Detección y monitoreo de integridad: nivel intermedio (IG2)

Una vez establecida la protección antimalware, la organización puede incorporar mecanismos que permitan identificar actividades sospechosas dentro de los dispositivos.

Las prioridades pasan a ser:

- Administrar centralmente las soluciones antimalware.
- Incorporar detección basada en comportamiento.
- Desplegar agentes HIDS en servidores y otros activos seleccionados.
- Implementar FIM sobre archivos y configuraciones críticas.
- Establecer líneas base confiables.
- Definir qué modificaciones requieren autorización y cuáles generan alertas.
- Revisar periódicamente los eventos detectados.

**Ejemplo de implementación: Wazuh**

Una PyME puede utilizar Wazuh para incorporar agentes en sus servidores y supervisar registros, configuraciones y archivos relevantes.

Su módulo FIM permite establecer directorios y archivos que deben monitorearse, ejecutar verificaciones periódicas y generar alertas ante modificaciones.

Es importante distinguir el alcance de la herramienta: Wazuh ofrece capacidades de HIDS y FIM, pero no debe presentarse automáticamente como equivalente a una plataforma EDR comercial con telemetría y capacidades de respuesta especializadas.

En esta etapa, la empresa obtiene una capacidad adicional para identificar cambios internos sin depender únicamente de las alertas del antivirus.

#### Detección y prevención integradas: nivel avanzado (IG3)

Las organizaciones con mayor exposición, activos críticos o necesidades de monitoreo más exigentes pueden incorporar soluciones EDR y mecanismos adicionales de prevención.

La implementación puede incluir:

- Despliegue de agentes EDR en servidores y estaciones de trabajo prioritarios.
- Recolección continua de telemetría sobre procesos y actividad del sistema.
- Análisis de relaciones entre procesos y secuencias de ejecución.
- Identificación de comportamientos compatibles con técnicas adversarias.
- Incorporación de políticas de prevención mediante capacidades HIPS o funciones preventivas integradas en EDR.
- Configuración de acciones de contención disponibles en la plataforma.
- Validación periódica de la cobertura y del estado de los agentes.

En esta etapa, la empresa debería tener capacidad para investigar no solamente qué archivo fue detectado, sino también qué proceso lo ejecutó, qué actividad realizó y qué otros dispositivos podrían estar relacionados.

La implementación de estas soluciones requiere considerar el costo de licenciamiento, los recursos de hardware, la retención de telemetría y la disponibilidad de personal que pueda interpretar las alertas.

#### Correspondencia con CIS Controls v8.1

El marco CIS permite organizar estas medidas mediante salvaguardas concretas.

| Salvaguarda | Nombre oficial                                     | Grupo de implementación |
| ----------- | -------------------------------------------------- | ----------------------- |
| `10.1`      | Deploy and Maintain Anti-Malware Software          | IG1, IG2, IG3           |
| `10.2`      | Configure Automatic Anti-Malware Signature Updates | IG1, IG2, IG3           |
| `10.6`      | Centrally Manage Anti-Malware Software             | IG2, IG3                |
| `10.7`      | Use Behavior-Based Anti-Malware Software           | IG2, IG3                |
| `13.2`      | Deploy a Host-Based Intrusion Detection Solution   | IG2, IG3                |
| `13.7`      | Deploy a Host-Based Intrusion Prevention Solution  | IG3                     |

_Correspondencia de las salvaguardas de CIS Controls v8.1 con los mecanismos desarrollados en esta subsección._

Es importante observar que CIS establece una progresión acumulativa: IG2 incorpora las salvaguardas de IG1, e IG3 incorpora las de los grupos anteriores.

La salvaguarda 13.7 contempla expresamente como ejemplos de implementación un cliente EDR o un agente de prevención de intrusiones basado en host. Por lo tanto, las capacidades preventivas de una solución EDR pueden formar parte de esta implementación avanzada.

FIM, por su parte, constituye una práctica técnica complementaria de monitoreo de integridad. Su fundamento específico se desarrolla en el control SI-7 de NIST SP 800-53.

### Desafíos operativos y mantenimiento de los controles

Desplegar herramientas de seguridad constituye solamente una parte de la implementación. Para que los mecanismos de detección sean útiles, deben mantenerse correctamente configurados y adaptarse al funcionamiento normal de la organización.

En una PyME, donde los recursos técnicos suelen ser limitados, los problemas de mantenimiento pueden reducir considerablemente la efectividad de estas tecnologías.

#### Ruido generado por actualizaciones legítimas

Uno de los desafíos más frecuentes de FIM es la cantidad de modificaciones producidas por las operaciones normales del sistema.

Una actualización del sistema operativo puede reemplazar numerosos ejecutables, bibliotecas y archivos de configuración. Desde la perspectiva de un motor FIM, estos cambios representan diferencias respecto de la línea base anterior.

Si cada modificación produce una alerta sin considerar su contexto, la organización puede recibir cientos o miles de notificaciones durante una ventana de mantenimiento.

El resultado es una sobrecarga de información que dificulta identificar cambios verdaderamente sospechosos.

**Buenas prácticas para administrar estos eventos:**

- Identificar las ventanas de mantenimiento de los sistemas.
- Registrar las actualizaciones y modificaciones autorizadas.
- Verificar el origen y la legitimidad de los cambios.
- Actualizar las referencias después de las modificaciones aprobadas.
- Aplicar exclusiones específicas cuando exista una justificación técnica.
- Evitar excluir directorios completos únicamente para reducir la cantidad de alertas.

Las exclusiones deben ser controladas y documentadas. Una excepción demasiado amplia puede crear puntos ciegos que permitan ocultar modificaciones maliciosas.

#### Gestión de falsos positivos

Un falso positivo ocurre cuando un mecanismo de seguridad identifica una actividad como sospechosa, aunque en realidad corresponda a una operación legítima.

Por ejemplo, una herramienta administrativa puede ejecutar un script que modifica archivos protegidos durante una tarea de mantenimiento. El cambio puede activar una alerta de HIDS o FIM sin representar una intrusión.

Para evaluar correctamente estas situaciones es necesario considerar:

- Qué usuario o proceso realizó la modificación.
- Si la actividad estaba prevista.
- Si existía una autorización.
- Si ocurrió dentro de una ventana de mantenimiento.
- Si el archivo modificado corresponde a un componente crítico.
- Si la modificación coincide con una actualización legítima.

La respuesta no debería consistir en desactivar el monitoreo ante cada alerta incómoda, sino en mejorar las reglas y los criterios de evaluación.

#### Consumo de recursos y cobertura

Los agentes de seguridad utilizan recursos del endpoint para recopilar información, analizar archivos y supervisar eventos.

Un análisis demasiado frecuente o una configuración excesivamente amplia puede producir:

- Mayor consumo de CPU y memoria.
- Incremento de operaciones de lectura y escritura.
- Mayor utilización del almacenamiento.
- Generación de grandes volúmenes de eventos.
- Demoras en operaciones habituales del sistema.

En equipos antiguos o servidores con recursos limitados, estos efectos pueden afectar la continuidad operativa.

La organización debe seleccionar cuidadosamente los directorios y procesos que necesitan supervisión, ajustar las frecuencias de análisis y verificar el rendimiento después de implementar cada herramienta.

También es necesario distinguir entre tener un agente instalado y contar con cobertura efectiva. Un agente detenido, desconectado o que dejó de transmitir información no está proporcionando la visibilidad esperada.

#### Protección frente a la manipulación de los mecanismos de detección

Los controles de seguridad instalados en un endpoint también pueden convertirse en objetivos de un atacante.

Si una persona consigue privilegios elevados, podría intentar deshabilitar un antivirus, detener un agente de monitoreo o alterar los archivos y registros utilizados para detectar modificaciones.

Por eso, una organización debería:

- Restringir quién puede modificar las configuraciones de seguridad.
- Proteger los servicios y procesos de monitoreo.
- Supervisar la interrupción inesperada de los agentes.
- Recibir alertas fuera del dispositivo supervisado.
- Mantener las consolas de administración separadas de los endpoints.
- Proteger las líneas base y los registros mediante controles de acceso independientes.

> [!CRITICAL] No confiar exclusivamente en el dispositivo supervisado
> Si el mismo endpoint almacena los archivos críticos, las referencias de integridad y las únicas copias de sus alertas, un atacante con privilegios suficientes podría alterar o eliminar todas esas evidencias. La administración externa y la conservación independiente de los registros reducen este riesgo.

### Detección de técnicas adversarias: MITRE ATT&CK

El valor de la visibilidad en el endpoint se comprende mejor cuando se relaciona con los comportamientos que los atacantes pueden ejecutar sobre los dispositivos.

MITRE ATT&CK es una base de conocimiento que organiza tácticas y técnicas utilizadas por adversarios durante operaciones informáticas maliciosas.

No es una herramienta de detección ni una lista de alertas predeterminadas. Su utilidad consiste en proporcionar un lenguaje común para describir comportamientos adversarios y orientar el diseño de mecanismos de detección.

En esta subsección resultan especialmente relevantes tres técnicas.

#### T1059 — Command and Scripting Interpreter

Esta técnica describe el abuso de intérpretes de comandos y lenguajes de scripting para ejecutar instrucciones o código.

Entre los mecanismos que pueden aprovecharse se encuentran:

- PowerShell en Windows.
- Windows Command Shell.
- Bash y otros intérpretes de comandos Unix.
- Python y otros lenguajes disponibles en el sistema.

Un atacante puede utilizarlos para ejecutar instrucciones, automatizar operaciones o iniciar otros procesos sin necesidad de introducir un ejecutable convencional en el dispositivo.

**¿Qué puede observarse en el endpoint?**

Un EDR puede registrar información sobre la creación de procesos, sus argumentos, los usuarios que los ejecutaron y sus relaciones con otros procesos.

Un HIDS también puede identificar determinados eventos registrados por el sistema operativo, si dispone de las fuentes y reglas correspondientes.

El objetivo no es bloquear todos los intérpretes de comandos, ya que forman parte del funcionamiento normal de muchos sistemas, sino reconocer ejecuciones que no coinciden con el comportamiento esperado.

#### T1218 — System Binary Proxy Execution

Esta técnica describe el uso de binarios legítimos y confiables del sistema operativo para ejecutar contenido malicioso.

Un binario firmado digitalmente no es necesariamente seguro en todos sus usos. Aunque el archivo sea legítimo, un atacante puede aprovechar determinadas funcionalidades para ejecutar contenido no autorizado o evadir mecanismos de detección basados exclusivamente en firmas.

Por ejemplo, determinados ejecutables de Windows pueden utilizarse como intermediarios para cargar bibliotecas, ejecutar scripts o invocar componentes externos.

**¿Qué puede observarse en el endpoint?**

- Ejecución de binarios legítimos desde ubicaciones o contextos inusuales.
- Argumentos de línea de comandos incompatibles con las tareas habituales.
- Relaciones sospechosas entre procesos padre e hijo.
- Carga de bibliotecas o componentes inesperados.
- Conexiones de red iniciadas por procesos que normalmente no las necesitan.

El EDR resulta especialmente útil en este escenario porque permite analizar no solamente la identidad del ejecutable, sino también cómo fue iniciado y qué acciones realizó.

Un antivirus basado exclusivamente en firmas puede no considerar malicioso un binario legítimo que está siendo utilizado de forma abusiva.

#### T1547 — Boot or Logon Autostart Execution

Esta técnica describe la modificación de mecanismos de inicio automático para conseguir que un programa se ejecute cada vez que el sistema arranca o un usuario inicia sesión.

Un atacante puede modificar claves del Registro de Windows, agregar archivos a directorios de inicio automático o alterar servicios y mecanismos equivalentes en otros sistemas operativos.

El objetivo suele ser mantener la presencia dentro del dispositivo incluso después de reiniciarlo. Este comportamiento se conoce como _persistencia_.

**¿Qué puede observarse en el endpoint?**

- Creación o modificación de entradas de inicio automático.
- Cambios inesperados en archivos de configuración de servicios.
- Incorporación de ejecutables desconocidos en directorios de inicio.
- Ejecución de procesos inusuales durante el arranque o el inicio de sesión.
- Modificaciones de permisos o propietarios de archivos relacionados con servicios.

FIM puede identificar modificaciones en los archivos y configuraciones supervisados. Un HIDS puede detectar cambios registrados por el sistema operativo, mientras que un EDR puede relacionarlos con los procesos que realizaron las modificaciones y con las ejecuciones posteriores.

Por ejemplo, una modificación en una clave de inicio automático no demuestra por sí sola que exista una intrusión. Sin embargo, si la modificación fue realizada por un proceso desconocido y posteriormente provoca la ejecución de un programa no autorizado, la secuencia merece investigación.

#### Relación entre las técnicas y los mecanismos de detección

Las técnicas anteriores muestran por qué resulta importante combinar distintas fuentes de información. Ninguna herramienta detecta necesariamente todos los comportamientos adversarios, y cada mecanismo aporta una perspectiva diferente.

| Comportamiento adversario                                | Información relevante                                                               | Mecanismos útiles                          |
| -------------------------------------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------ |
| Ejecución de comandos sospechosos (T1059).               | Creación de procesos, argumentos y relaciones entre procesos.                       | EDR, HIDS.                                 |
| Abuso de binarios legítimos (T1218).                     | Ejecución de binarios, argumentos, módulos cargados y conexiones asociadas.         | EDR, antimalware basado en comportamiento. |
| Modificación de mecanismos de inicio automático (T1547). | Cambios en archivos, servicios, registros y procesos iniciados durante el arranque. | FIM, HIDS, EDR.                            |

_Relación orientativa entre técnicas de MITRE ATT&CK y fuentes de telemetría del endpoint. La capacidad de detección depende de los eventos recopilados y las reglas configuradas._

> [!NOTE] Detectar una técnica no equivale a identificar un incidente completo
> MITRE ATT&CK describe comportamientos que pueden utilizarse durante un ataque, pero también pueden aparecer en actividades administrativas legítimas. La detección debe considerar el contexto, la identidad del usuario, el activo afectado y la secuencia de eventos.

### Implementación práctica de FIM con Wazuh

Para comprender cómo se traduce el monitoreo de integridad a una implementación real, se puede utilizar Wazuh como ejemplo de solución de código abierto.

Wazuh incorpora un módulo denominado _File Integrity Monitoring_ (FIM), que permite supervisar archivos y directorios, calcular hashes, registrar atributos y generar alertas ante modificaciones.

Su funcionamiento combina dos mecanismos:

- **Análisis programado:** realiza verificaciones periódicas y compara los archivos con los valores almacenados anteriormente.
- **Monitoreo en tiempo real:** identifica cambios en directorios seleccionados mediante mecanismos de notificación del sistema operativo.

La solución permite centralizar los eventos de diferentes agentes en una consola de administración, facilitando la supervisión de múltiples dispositivos.

#### Requisitos previos

Para implementar el ejemplo se necesita:

- Un equipo Linux con una distribución compatible con la versión de Wazuh instalada.
- Un agente Wazuh instalado y registrado en un servidor o plataforma de administración.
- Acceso administrativo al endpoint.
- El servicio `wazuh-agent` operativo.
- Una copia de seguridad de la configuración original del agente.

El ejemplo se centra en la supervisión de un directorio de prueba de Linux. No requiere instalar un motor adicional de cálculo de hashes.

#### Preparación del directorio

Antes de configurar el monitoreo, se debe crear el directorio que se utilizará para la prueba:

```bash:terminal
sudo install -d -m 0750 /opt/fim-lab
```

El directorio debe existir antes de reiniciar el agente para habilitar el monitoreo en tiempo real.

#### Configuración del monitoreo

El agente Wazuh utiliza el archivo `ossec.conf` para configurar diferentes capacidades de supervisión.

En Linux, su ubicación habitual es `/var/ossec/etc/ossec.conf`.

Para supervisar el directorio `/opt/fim-lab` en tiempo real, se puede incorporar la siguiente configuración dentro de la sección `<syscheck>` existente:

```xml:ossec.conf
<syscheck>
    <directories realtime="yes" check_all="yes">/opt/fim-lab</directories>
</syscheck>
```

:::group title="Parámetros de configuración" description="Configuración básica del módulo FIM">

- `syscheck`: sección que contiene los parámetros del módulo de monitoreo de integridad.
- `directories`: define el directorio que debe supervisarse.
- `realtime`: habilita el monitoreo continuo de los cambios en el directorio.
- `check_all`: solicita la comprobación de los atributos de archivo compatibles con el módulo.
  :::

En Linux, el monitoreo en tiempo real de Wazuh utiliza mecanismos de notificación del sistema operativo. En esta modalidad se supervisan directorios, no archivos individuales.

> [!WARNING] No reemplazar la configuración existente
> La sección presentada es un ejemplo de los parámetros relevantes, no un archivo completo para sustituir la configuración original. Si el agente ya contiene una sección `<syscheck>`, se debe incorporar el elemento `<directories>` dentro de ella, evitando duplicar estructuras. También se debe conservar la configuración existente y revisar que el XML sea válido.

#### Aplicación de los cambios

Una vez guardada la configuración, es necesario reiniciar el agente para que aplique los cambios.

```bash:terminal
sudo systemctl restart wazuh-agent
```

Para comprobar el estado del servicio:

```bash:terminal
sudo systemctl status wazuh-agent --no-pager
```

El resultado esperado es que el servicio figure como `active (running)`.

Si el agente no inicia correctamente, se deben revisar sus registros y verificar que el archivo XML no contenga errores de sintaxis.

#### Comprobación del monitoreo

Con el agente operativo, se puede realizar una modificación controlada sobre un archivo de prueba dentro del directorio supervisado.

**Crear un archivo:**

```bash:terminal
printf 'prueba de integridad\n' | sudo tee /opt/fim-lab/archivo-prueba.txt >/dev/null
```

El módulo FIM debería registrar el nuevo archivo y generar un evento de creación, siempre que la configuración y la comunicación con el servidor estén funcionando correctamente.

**Modificar el contenido:**

```bash:terminal
printf 'contenido modificado\n' | sudo tee /opt/fim-lab/archivo-prueba.txt >/dev/null
```

La modificación debería generar otro evento que permita identificar el cambio de contenido.

**Eliminar el archivo:**

```bash:terminal
sudo rm /opt/fim-lab/archivo-prueba.txt
```

La eliminación también debería producir un evento asociado.

Estos cambios deben poder consultarse desde la plataforma de administración de Wazuh, donde se identifica el agente que reportó la actividad, el archivo afectado y el tipo de modificación.

> [!TIP] Realizar pruebas con archivos temporales
> No es necesario modificar archivos reales de configuración de SSH para comprobar que FIM funciona. Utilizar un archivo temporal evita alterar el servicio y permite verificar los eventos de creación, modificación y eliminación de forma controlada.

Una vez comprobados los eventos, el directorio de prueba puede eliminarse cuando ya no sea necesario.

La documentación oficial de Wazuh contempla estas modalidades de supervisión, así como opciones adicionales para registrar propietarios, permisos, atributos y diferencias de contenido. También permite ajustar la frecuencia de los análisis para reducir la generación excesiva de eventos.

### Verificación operativa de los controles

Instalar un agente o habilitar una herramienta no demuestra por sí solo que la organización disponga de visibilidad efectiva sobre sus endpoints.

La verificación debe comprobar que los mecanismos están activos, que recopilan la información esperada y que las alertas pueden llegar a un punto de administración independiente.

Para ello, una PyME debería establecer controles periódicos sobre los siguientes aspectos:

| Elemento    | Qué comprobar                                       | Evidencia esperada                                            |
| ----------- | --------------------------------------------------- | ------------------------------------------------------------- |
| Antimalware | Estado de protección y actualización.               | Motor activo y firmas actualizadas.                           |
| HIDS        | Estado del agente y recepción de eventos.           | Eventos del endpoint visibles en la plataforma.               |
| HIPS        | Aplicación efectiva de las políticas preventivas.   | Registro de una acción bloqueada en una prueba controlada.    |
| EDR         | Disponibilidad de telemetría y detección.           | Eventos de procesos y relaciones entre procesos consultables. |
| FIM         | Supervisión de archivos críticos.                   | Alerta ante una modificación de prueba.                       |
| Línea base  | Correspondencia con el estado confiable registrado. | Comparación satisfactoria o discrepancia investigable.        |

_Evidencias mínimas para comprobar el funcionamiento de los mecanismos de seguridad del endpoint._

#### Comprobación del antimalware en Windows

En sistemas Windows que utilizan Microsoft Defender Antivirus, PowerShell proporciona un cmdlet para consultar el estado de la protección.

Requisitos previos:

- Windows compatible con Microsoft Defender Antivirus.
- PowerShell con el módulo Defender disponible.
- Una sesión con permisos suficientes para consultar el estado del producto.

Ejecuta:

```powershell:terminal
Get-MpComputerStatus |
    Select-Object AMRunningMode,
                  AntivirusEnabled,
                  RealTimeProtectionEnabled,
                  AntivirusSignatureLastUpdated,
                  AntivirusSignatureAge
```

Entre los valores que conviene revisar se encuentran:

- `AMRunningMode`: indica el modo de funcionamiento del producto.
- `AntivirusEnabled`: informa si la protección antivirus está habilitada.
- `RealTimeProtectionEnabled`: indica si la protección en tiempo real está activa.
- `AntivirusSignatureLastUpdated`: muestra cuándo se actualizaron las firmas.
- `AntivirusSignatureAge`: informa la antigüedad de las firmas.

El estado esperado depende de la configuración y del modo de operación del producto. En equipos donde existe otro antivirus registrado, Microsoft Defender Antivirus puede funcionar en modo pasivo, por lo que no debe interpretarse su estado sin considerar la solución que realmente protege el dispositivo.

Este comando permite consultar el estado, pero no constituye una prueba completa de detección. La verificación también debe contemplar los eventos generados y la actualización efectiva del motor antimalware.

#### Prueba de integridad

La organización debe seleccionar archivos representativos y comprobar que una modificación controlada produce una alerta.

La prueba debe incluir:

- Identificación del archivo supervisado.
- Confirmación de su estado inicial.
- Modificación controlada.
- Recepción de la alerta correspondiente.
- Verificación de que se identifica correctamente el archivo afectado.
- Documentación del resultado y restauración del estado original.

#### Prueba de cobertura

También es necesario comprobar qué dispositivos cuentan efectivamente con protección.

Para ello, se puede mantener un inventario que relacione cada activo con su estado de monitoreo.

Por ejemplo:

| Activo                | Antimalware | Agente de monitoreo | Último reporte |
| --------------------- | ----------- | ------------------- | -------------- |
| Servidor de archivos  | Activo      | Activo              | Recibido       |
| Equipo administrativo | Activo      | Activo              | Recibido       |
| Estación de trabajo   | Activo      | Desconectado        | Sin reporte    |

_Ejemplo de registro operativo de cobertura. Los datos son ilustrativos y deben reemplazarse por el inventario real de la organización._

El tercer dispositivo representa una situación que requiere revisión: aunque tenga un agente instalado, no está proporcionando información a la plataforma central.

La organización debe investigar si el problema se debe a una interrupción del servicio, una falla de conectividad, una desinstalación o una alteración deliberada.

#### Prueba de detección y prevención

Cuando la solución implementada lo permita, se pueden utilizar archivos de prueba y mecanismos de simulación controlados para comprobar que los eventos generan las alertas esperadas.

Por ejemplo, EICAR es un archivo de prueba estandarizado utilizado para verificar la respuesta de determinados productos antimalware sin utilizar malware real.

Su uso debe realizarse en un entorno controlado y siguiendo las instrucciones del proveedor, ya que algunos productos lo bloquean automáticamente.

La prueba permite comprobar que el motor antimalware está operativo, aunque no demuestra que pueda detectar todas las amenazas reales.

### Criterios de aceptación

Al finalizar la implementación, la organización debería poder demostrar que:

- Los activos definidos cuentan con protección antimalware activa y actualizada.
- Los agentes de monitoreo están operativos y reportan información.
- Los archivos críticos seleccionados tienen una referencia de integridad confiable.
- Las modificaciones relevantes producen eventos o alertas.
- Las alertas llegan a una ubicación donde pueden ser revisadas.
- Las exclusiones y excepciones de monitoreo están justificadas y documentadas.
- Existe un procedimiento para investigar discrepancias y determinar si requieren intervención.
- La organización conoce qué dispositivos no están cubiertos o dejaron de reportar.

La cobertura puede expresarse mediante indicadores sencillos. Por ejemplo:

\[
\text{Cobertura antimalware} =
\frac{\text{Activos correctamente protegidos}}
{\text{Activos compatibles identificados}}
\times 100
\]

\[
\text{Cobertura FIM} =
\frac{\text{Activos seleccionados con FIM operativo}}
{\text{Activos seleccionados para FIM}}
\times 100
\]

Estos indicadores ayudan a medir el alcance real de los controles y a identificar dispositivos que todavía no están protegidos o supervisados.
