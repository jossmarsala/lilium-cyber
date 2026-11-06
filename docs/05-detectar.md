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
