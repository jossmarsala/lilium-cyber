---
titulo: 'La estación olvidada: Primer contacto con la ciberseguridad'
laboratorio: 'Lab 01 — LILIUM'
idioma: 'Español neutro'
formato: 'Playbook interactivo con pistas y soluciones desplegables'
---

# La estación olvidada: Primer contacto con la ciberseguridad

### Tu misión

La Estación Botánica Automatizada N.º 4 lleva semanas operando en piloto automático. El cuidador principal desapareció sin dejar instrucciones de entrega y una alerta en el servidor central exige una revisión inmediata de la infraestructura.

Has sido asignado como operario responsable de la primera auditoría de seguridad. Tu objetivo es tomar el control de la situación: relevar qué activos existen, identificar brechas de seguridad, preservar evidencias sin contaminar la escena y aplicar medidas de contención y endurecimiento sin interrumpir los sistemas vitales del invernadero.

### Reglas de operación

- **Todo va a la Bitácora:** Registra cada hallazgo, comando ejecutado y evidencia observada en la app de **Bitácora**. En una auditoría forense y operativa, lo que no queda documentado no existe.
- **Fase 1 en modo solo lectura:** Durante el relevamiento inicial está prohibido modificar archivos, reiniciar servicios o alterar configuraciones. Primero observa; luego actúa.
- **Orden secuencial estricto:** Completa y valida cada fase antes de avanzar a la siguiente.
- **Continuidad operativa:** El invernadero aloja especímenes vivos. Toda corrección debe ser quirúrgica y verificada para no interrumpir los servicios críticos de riego y monitoreo.
- **Asistencia en consola:** En cada fase cuentas con dos paneles desplegables de apoyo: **"Herramientas"** son comandos individuales sugeridos para ejecutar tu investigación. **"Solución"** es una guía paso a paso con la explicación técnica de cada comando.

## FASE 1: Auditoría — Reconocimiento y línea base

> subtitle: Relevar el estado inicial del servidor sin alterar el entorno. Regla de fase: estricto modo solo lectura.

### Directivas

1. **Paso 1.1 — Identifica el sistema bajo tu control** — Antes de rastrear cualquier anomalía, necesitas confirmar dónde estás parado y con qué nivel de acceso operas. Releva tu usuario actual, el nombre del servidor, la fecha/hora del sistema, el tiempo de actividad y la versión exacta de Linux (revisa `/etc/os-release`). _Reporte en Bitácora: ¿Qué datos exactos componen tu línea base del sistema y por qué es crítico registrarlos antes de tocar nada?_
2. **Paso 1.2 — Contrasta el inventario oficial con el software real** — En el directorio `/etc/invernadero` se aloja la documentación declarada de la estación (inventario de activos y lista de software autorizado). Inspecciona esos archivos y compáralos contra los paquetes realmente instalados en el servidor. _Reporte en Bitácora: ¿Qué activos del inventario puedes auditar directamente desde esta terminal y cuáles son equipos externos que solo figuran en los papeles?_
3. **Paso 1.3 — Audita cuentas, grupos y privilegios** — En instalaciones donde el personal rota sin protocolos de baja, las cuentas olvidadas son vectores de entrada. Inspecciona `/etc/passwd`, `/etc/group` y `/etc/sudoers`. Verifica en particular el estado de bloqueo de la cuenta `ex_cuidador`. _Reporte en Bitácora: ¿Qué usuarios poseen privilegios administrativos (`sudo`) y por qué la cuenta `ex_cuidador` sigue representando un riesgo técnico?_
4. **Paso 1.4 — Evalúa permisos y clasificación de archivos críticos** — La confidencialidad se rompe cuando los permisos de lectura están abiertos de más. Audita los directorios operativos (`/opt/invernadero`, `/srv/invernadero` y `/var/backups/invernadero`), inspecciona la carpeta oculta `/home/cuidador/.ssh` y analiza la naturaleza real del archivo sospechoso alojado en `/tmp/catalogo_orquideas.pdf`. _Reporte en Bitácora: ¿Qué archivos exponen información sensible por permisos mal configurados y cuál es el verdadero formato del supuesto PDF en `/tmp`?_
5. **Paso 1.5 — Traza la línea base de red y servicios** — Todo puerto en escucha es un punto de contacto potencial. Identifica la dirección IP de la máquina, los puertos abiertos y los servicios activos (prestando especial atención a `nginx` y `ssh`). _Reporte en Bitácora: ¿Cuál de los servicios está confinado al acceso interno local y cuál está expuesto a conexiones desde el exterior?_
6. **Paso 1.6 — Analiza los registros sin confundir indicios con hechos** — El directorio `/var/log/invernadero` concentra los eventos de la estación junto con una nota técnica (`README-lab.txt`), complementados por el registro general del sistema. Revisa estos archivos para reconstruir la línea de tiempo del incidente. _Reporte en Bitácora: ¿Qué secuencia de eventos anómalos detectas y por qué debes contrastar los logs del directorio con el estado real del sistema?_

### Pistas

- **Paso 1.1: Identificación del sistema y de la sesión** | Consultar el nombre del usuario actual | `whoami`
- **Paso 1.1: Identificación del sistema y de la sesión** | Ver el identificador de usuario (UID) y grupos asignados | `id`
- **Paso 1.1: Identificación del sistema y de la sesión** | Consultar el nombre de red del equipo | `hostname`
- **Paso 1.1: Identificación del sistema y de la sesión** | Verificar la fecha y hora actuales del servidor | `date`
- **Paso 1.1: Identificación del sistema y de la sesión** | Consultar la versión del kernel y arquitectura | `uname -a`
- **Paso 1.1: Identificación del sistema y de la sesión** | Leer los datos de la distribución de Linux | `cat /etc/os-release`
- **Paso 1.2: Inventario de activos y software** | Listar el contenido del directorio de configuración | `ls -la /etc/invernadero`
- **Paso 1.2: Inventario de activos y software** | Leer el inventario oficial de activos | `cat /etc/invernadero/inventario.csv`
- **Paso 1.2: Inventario de activos y software** | Leer el listado de software autorizado | `cat /etc/invernadero/software-autorizado.txt`
- **Paso 1.2: Inventario de activos y software** | Listar todos los paquetes instalados en el sistema | `dpkg -l`
- **Paso 1.3: Cuentas, grupos y privilegios** | Leer el registro de cuentas de usuario del sistema | `cat /etc/passwd`
- **Paso 1.3: Cuentas, grupos y privilegios** | Leer el registro de grupos del sistema | `cat /etc/group`
- **Paso 1.3: Cuentas, grupos y privilegios** | Inspeccionar la política de privilegios administrativos | `sudo cat /etc/sudoers`
- **Paso 1.3: Cuentas, grupos y privilegios** | Consultar grupos y privilegios de la cuenta `cuidador` | `id cuidador`
- **Paso 1.3: Cuentas, grupos y privilegios** | Verificar el estado de la contraseña de `ex_cuidador` | `sudo passwd -S ex_cuidador`
- **Paso 1.4: Archivos, permisos y clasificación** | Listar permisos en los directorios del catálogo, informes y `.ssh` | `ls -la /srv/invernadero/catalogo /srv/invernadero/informes /home/cuidador/.ssh`
- **Paso 1.4: Archivos, permisos y clasificación** | Determinar el tipo de datos real del archivo en `/tmp` | `file /tmp/catalogo_orquideas.pdf`
- **Paso 1.4: Archivos, permisos y clasificación** | Calcular la huella criptográfica SHA-256 del archivo en `/tmp` | `sha256sum /tmp/catalogo_orquideas.pdf`
- **Paso 1.5: Servicios activos e interfaces de red** | Consultar de forma resumida las interfaces de red y sus IPs | `ip -br addr`
- **Paso 1.5: Servicios activos e interfaces de red** | Listar puertos abiertos en escucha y los procesos asociados | `sudo ss -tulpn`
- **Paso 1.5: Servicios activos e interfaces de red** | Listar las unidades de tipo servicio activas en el sistema | `systemctl --type=service`
- **Paso 1.5: Servicios activos e interfaces de red** | Verificar el estado operativo del servidor web Nginx | `systemctl status nginx`
- **Paso 1.6: Registros y trazabilidad de eventos** | Listar los archivos de registro de la estación | `ls -la /var/log/invernadero`
- **Paso 1.6: Registros y trazabilidad de eventos** | Leer la nota aclaratoria del entorno de laboratorio | `sudo cat /var/log/invernadero/README-lab.txt`
- **Paso 1.6: Registros y trazabilidad de eventos** | Leer el contenido de todos los registros de la estación | `sudo cat /var/log/invernadero/*.log`
- **Paso 1.6: Registros y trazabilidad de eventos** | Consultar el registro general del sistema (systemd journal) | `sudo journalctl`

### Guía Pedagógica

#### Paso 1.1: Identifica el sistema bajo tu control

> **Qué registrar en la Bitácora:** Una ficha técnica breve del servidor examinado y el momento exacto de tu observación. Esto establece tu punto de referencia (línea base) para demostrar el antes y el después de tu intervención.

- Identificar el nombre de tu usuario en la sesión activa `whoami`
  - _Muestra con qué cuenta estás operando actualmente en la terminal._
- Consultar los identificadores y grupos de tu cuenta `id`
  - _Detalla tu UID, GID y los grupos a los que perteneces (como `sudo`). Esto explica qué archivos puedes leer directamente y por qué necesitas anteponer `sudo` para tareas administrativas._
- Obtener el nombre del equipo en la red `hostname`
  - _Identifica de forma inequívoca en qué servidor estás ejecutando los comandos._
- Registrar la marca temporal del sistema `date`
  - _Permite correlacionar el horario del servidor con las marcas de tiempo que verás más adelante en los archivos de registro (logs)._
- Consultar la versión del kernel y arquitectura del procesador `uname -a`
  - _Entrega el panorama técnico del núcleo del sistema operativo en ejecución._
- Revisar los detalles de la distribución Linux instalada `cat /etc/os-release`
  - _Muestra el nombre oficial y la versión de la distribución (por ejemplo, Debian o Ubuntu)._
- Consultar el tiempo de actividad continua del servidor `uptime`
  - _Indica cuánto tiempo lleva encendido el sistema desde su último arranque. Tómalo como dato de contexto, no como prueba de estabilidad por sí solo._
- Documentar el contexto inicial en la Bitácora
  - _Asienta en tu Bitácora la fecha/hora de inicio, hostname, distribución, versión de kernel y usuario operativo._

#### Paso 1.2: Contrasta el inventario oficial con el software real

> **Criterio de auditoría:** El inventario de activos define qué equipos físicos o lógicos existen en la organización; la lista de software autorizado define qué programas tienen permiso de correr en este servidor. Nunca asumas que el papel coincide con la realidad sin verificarlo.

- Listar los archivos de configuración del invernadero `ls -la /etc/invernadero`
  - _Permite confirmar qué documentos de referencia existen en el directorio y revisar sus permisos y fechas de modificación._
- Leer el inventario declarado de activos `cat /etc/invernadero/inventario.csv`
  - _Verás seis activos registrados: servidor central, estación administrativa, portátil técnico, sensor IoT, panel web y router/firewall._
- Distinguir entre el alcance local y los activos externos
  - _Tu terminal corresponde únicamente al servidor Linux central. Desde aquí no tienes visibilidad física directa sobre las portátiles ni el router/firewall; debes dejar constancia de ese límite de alcance en tu Bitácora._
- Leer la lista de software autorizado para el servidor `cat /etc/invernadero/software-autorizado.txt`
  - _Conoce qué herramientas y servicios están formalmente aprobados para operar en esta máquina._
- Listar todos los paquetes instalados en el sistema `dpkg -l`
  - _Compara esta salida con la lista autorizada, prestando atención al servidor web (`nginx`) y al servidor de acceso remoto (`openssh-server`). ***Tip de consola:*** Si la lista se abre en un visor paginado, usa las flechas para desplazarte y presiona la tecla `q` para salir y recuperar el control de la terminal._
- Respetar la regla de solo lectura
  - _No instales, actualices ni elimines paquetes en esta fase. Limítate a documentar qué pudiste verificar y qué discrepancias observaste._

#### Paso 1.3: Audita cuentas, grupos y privilegios

> **Qué registrar en la Bitácora:** Las cuentas de usuario detectadas, a qué grupos pertenecen, el estado de `ex_cuidador` y qué accesos deberán ajustarse en la fase de endurecimiento. Tener privilegios `sudo` no es un error en sí mismo, siempre que responda a un rol activo y válido.

- Inspeccionar el listado de usuarios locales `cat /etc/passwd`
  - _Presta atención a las últimas líneas del archivo: verás las cuentas creadas para la operación (`operario`, `cuidador`, `admin-it`, `ana`, `proveedor`, `ex_cuidador`). Nota que todas terminan en `/bin/bash`, lo que significa que tienen asignada una consola interactiva._
- Revisar los grupos de trabajo y de administración `cat /etc/group`
  - _Identifica quiénes integran los grupos operativos (`riego-ops`, `administracion`, `it-admins`, `proveedores`) y qué cuentas forman parte del grupo privilegiado `sudo`._
- Inspeccionar las reglas de elevación de privilegios `sudo cat /etc/sudoers`
  - _Observa que `admin-it` tiene permisos administrativos por `it-admins`, mientras que el grupo `sudo` dispone de una lista limitada de comandos para el operario. `cuidador` no pertenece a ese grupo. La VM usa un wrapper didáctico de `sudo`; el archivo representa la política que se está auditando, no un control de privilegios real._
- Consultar el detalle de grupos del cuidador actual `id cuidador`
  - _Muestra de forma rápida y limpia los grupos asociados al rol operativo principal._
- Consultar el detalle de grupos del antiguo empleado `id ex_cuidador`
  - _Permite verificar si la cuenta obsoleta aún retiene pertenencia a grupos internos de la estación._
- Comprobar el estado de la contraseña de la cuenta antigua `sudo passwd -S ex_cuidador`
  - _En la segunda columna verás una letra `L` (Locked). Esto confirma que la contraseña está bloqueada, pero como aún conserva `/bin/bash` en `/etc/passwd`, la cuenta todavía no está completamente neutralizada._
- Documentar los hallazgos sin alterar el sistema
  - _Registra en la Bitácora que `ex_cuidador` requiere restricción de consola en la Fase 3. No ejecutes cambios todavía._

#### Paso 1.4: Evalúa permisos y clasificación de archivos críticos

> **Hallazgos clave:** Tanto el informe confidencial como la clave privada SSH tienen permisos `0644` (`-rw-r--r--`), lo que permite que cualquier usuario local los lea. Además, el archivo en `/tmp` finge ser un PDF por su nombre, pero su contenido real es un binario ELF de práctica, inocuo y sin permiso de ejecución.

- Explorar las carpetas operativas, de datos y de respaldos `ls -la /opt/invernadero /srv/invernadero/catalogo /srv/invernadero/informes /var/backups/invernadero`
  - _Releva la estructura: `/opt` guarda scripts y sensores, `/srv` aloja el catálogo público y los informes internos, y `/var/backups` almacena copias de resguardo._
- Inspeccionar en detalle los permisos del informe confidencial y la clave SSH `ls -la /srv/invernadero/informes/registro_confidencial.csv /home/cuidador/.ssh/id_ed25519`
  - _Observa el bloque `-rw-r--r--` al inicio de cada línea. La última `r` indica que cualquier usuario del servidor puede leer tanto los datos confidenciales como la llave privada SSH._
- Analizar el tipo de contenido real del archivo sospechoso en `/tmp` `file /tmp/catalogo_orquideas.pdf`
  - _En Linux, la extensión no determina el formato. `file` inspecciona la cabecera binaria y debe identificar un ejecutable ELF de 64 bits, no un PDF. El archivo tiene modo `0644`, sin permiso de ejecución; es un artefacto de entrenamiento y no debe ejecutarse._
- Generar la huella criptográfica SHA-256 de los archivos clave `sha256sum /tmp/catalogo_orquideas.pdf /var/backups/invernadero/catalogo_2026-10-17.bak`
  - _Copia estos códigos hash en tu Bitácora. Funcionan como un precinto digital para demostrar que la evidencia no fue alterada durante tu auditoría._

#### Paso 1.5: Traza la línea base de red y servicios

> **Criterio técnico de red:** Fíjate siempre en la dirección IP donde escucha cada puerto. Si escucha en `127.0.0.1` (loopback), solo acepta conexiones originadas dentro de la misma máquina. Si escucha en `0.0.0.0`, está abierto a recibir conexiones desde cualquier red externa.

- Consultar las interfaces de red y sus direcciones IP asignadas `ip -br addr`
  - _Muestra un resumen limpio con la interfaz local (`lo`) y la interfaz de red principal (`eth0` con la IP `10.0.2.15`)._
- Revisar la tabla de enrutamiento de red `ip route`
  - _Indica por qué puerta de enlace (gateway) sale el tráfico del servidor hacia el exterior._
- Identificar puertos abiertos en escucha y qué proceso los controla `sudo ss -tulpn`
  - _Detecta dos puntos clave en estado `LISTEN`: el puerto `22` controlado por `sshd` escuchando hacia el exterior (`0.0.0.0:22`), y el puerto `8080` controlado por `nginx` limitado al entorno local (`127.0.0.1:8080`)._
- Listar los servicios activos en segundo plano `systemctl --type=service`
  - _Verifica qué servicios están corriendo actualmente (como `cron`, `nginx` y `ssh`). ***Tip de consola:*** Si se abre el paginador e impide escribir nuevos comandos, presiona la tecla `q` para salir._
- Consultar el estado detallado del servidor web Nginx `systemctl status nginx`
  - _Confirma que Nginx está activo (`active (running)`). Este servicio mantiene vivo el panel interno de la estación, por lo que es crítico no detenerlo. (Si queda en vista paginada, presiona `q`)._

#### Paso 1.6: Analiza los registros sin confundir indicios con hechos

> **Qué registrar en la Bitácora:** Una cronología clara de los eventos observados, separando qué es un aviso registrado en texto y qué elementos deberás comprobar en vivo en la Fase 2.

- Listar los archivos dentro del directorio de logs del invernadero `ls -la /var/log/invernadero`
  - _Identifica los seis archivos `.log` disponibles y la nota de lectura obligatoria `README-lab.txt`._
- Leer la nota técnica del entorno de entrenamiento `sudo cat /var/log/invernadero/README-lab.txt`
  - _Aclara un punto fundamental: los registros de esta carpeta son eventos sintéticos diseñados para el escenario y tu deber como auditor es contrastarlos contra los procesos y archivos reales del sistema._
- Inspeccionar el registro de accesos de usuarios `sudo cat /var/log/invernadero/accesos.log`
  - _Detecta intentos fallidos de inicio de sesión asociados a `ex_cuidador` y un acceso registrado fuera del horario habitual._
- Inspeccionar el registro de actividad operativa `sudo cat /var/log/invernadero/actividad.log`
  - _Correlaciona la ejecución del script de riego a las 21:03, la detección de `polilla_emisora` entre las 21:06:58 y las 21:07:42, y la alerta sobre `/tmp/catalogo_orquideas.pdf` a las 21:08:01._
- Inspeccionar el registro de copias de seguridad `sudo cat /var/log/invernadero/backup.log`
  - _Advierte que el último respaldo finalizó con alertas y que su contenido podría estar incompleto._
- Inspeccionar el resumen de incidentes reportados `sudo cat /var/log/invernadero/incidentes.log`
  - _Consolida las alertas previas y deja pendiente la verificación de integridad del backup._
- Consultar el registro general del sistema operativo `sudo journalctl`
  - _Permite ver la actividad global del sistema junto con las etiquetas del escenario (`LILIUM-LAB`). ***Tip de consola:*** Usa las flechas o `AvPág` para recorrer el historial y presiona `q` para volver a la línea de comandos._

---

## FASE 2: Evidencia — Triaje y contención controlada

> subtitle: Preservar la evidencia antes de intervenir. Analizar los artefactos sospechosos y contener amenazas sin afectar la operación del invernadero.

### Directivas

1. **Paso 2.1 — Cruza los registros con la memoria viva y formula tu hipótesis** — En `actividad.log` viste referencias a dos procesos: `riego_nocturno.sh` y `polilla_emisora`. Consulta la tabla de procesos que están corriendo ahora mismo en la memoria del servidor y compáralos con el log. _Reporte en Bitácora: ¿Siguen ambos procesos en ejecución? Redacta tu hipótesis inicial sobre cuál es legítimo y cuál es anómalo._
2. **Paso 2.2 — Analiza el código de los procesos antes de actuar** — Matar un proceso a ciegas destruye evidencia en memoria y puede apagar un sistema vital. Identifica el número de proceso (PID) de `polilla_emisora`, revisa desde qué carpeta se ejecuta y lee el código fuente tanto de `/tmp/polilla_emisora` como de `/opt/invernadero/scripts/riego_nocturno.sh`. _Reporte en Bitácora: ¿Cuál es el PID del proceso anómalo y qué instrucciones exactas tiene escritas adentro cada script?_
3. **Paso 2.3 — Analiza el binario con extensión engañosa** — En la Fase 1 confirmaste que `/tmp/catalogo_orquideas.pdf` no es un PDF: `file` lo identifica como un binario ELF de 64 bits. Verifica sus metadatos, extrae sus cadenas legibles con `strings` y registra su huella SHA-256. Después compara esa huella con la del catálogo botánico legítimo ubicado en `/srv/invernadero/catalogo/catalogo_orquideas.pdf`. No ejecutes el binario ni lo abras con un visor de documentos. _Reporte en Bitácora: ¿Qué cadenas legibles contiene y por qué debemos preservarlo sin ejecutarlo ni borrarlo?_
4. **Paso 2.4 — Audita la integridad de la copia de seguridad** — El log de respaldos alertó sobre fallos en la última copia. Revisa los archivos de `/var/backups/invernadero` (`manifest.txt` y `catalogo_2026-10-17.bak`) y compáralos con el catálogo real en producción (`/srv/invernadero/catalogo/catalogo_publico.csv`). _Reporte en Bitácora: ¿Qué ocurriría con los datos del invernadero si restauraras ese backup ahora mismo?_
5. **Paso 2.5 — Ejecuta una contención quirúrgica** — Con toda la evidencia asegurada y documentada en tu Bitácora, detén únicamente el proceso no autorizado (`polilla_emisora`) utilizando su PID. Verifica de inmediato que el sistema de riego (`riego_nocturno.sh`) y el panel web (`nginx`) continúen operando sin impacto. _Reporte en Bitácora: Registra el comando de contención ejecutado y la prueba de que los servicios vitales siguen activos._

### Pistas

- **Paso 2.1: Correlación de registros e hipótesis** | Repasar las alertas del registro de actividad | `sudo cat /var/log/invernadero/actividad.log`
- **Paso 2.1: Correlación de registros e hipótesis** | Listar todos los procesos activos en memoria | `ps aux`
- **Paso 2.2: Inspección del proceso sospechoso** | Filtrar la lista de procesos para ubicar `polilla_emisora` y su PID | `ps aux | grep polilla_emisora`
- **Paso 2.2: Inspección del proceso sospechoso** | Leer el código interno del proceso alojado en `/tmp` | `cat /tmp/polilla_emisora`
- **Paso 2.2: Inspección del proceso sospechoso** | Leer el código del script operativo de riego | `cat /opt/invernadero/scripts/riego_nocturno.sh`
- **Paso 2.3: Validación del binario con extensión engañosa** | Consultar propietario, fecha y permisos del archivo en `/tmp` | `ls -la /tmp/catalogo_orquideas.pdf`
- **Paso 2.3: Validación del binario con extensión engañosa** | Confirmar el formato real del archivo | `file /tmp/catalogo_orquideas.pdf`
- **Paso 2.3: Validación del binario con extensión engañosa** | Extraer cadenas legibles del binario sin ejecutarlo | `strings /tmp/catalogo_orquideas.pdf`
- **Paso 2.3: Validación del binario con extensión engañosa** | Obtener el hash SHA-256 del archivo como evidencia | `sha256sum /tmp/catalogo_orquideas.pdf`
- **Paso 2.3: Comparación de integridad entre artefactos** | Comparar los hashes SHA-256 del binario ELF disfrazado y del catálogo PDF legítimo; registrar ambos resultados en la Bitácora. Deben ser distintos porque sus bytes y contenidos son diferentes; esa diferencia por sí sola no demuestra actividad maliciosa | `sha256sum /tmp/catalogo_orquideas.pdf /srv/invernadero/catalogo/catalogo_orquideas.pdf`
- **Paso 2.4: Inspección y validación del respaldo** | Listar los archivos dentro del directorio de backups | `ls -la /var/backups/invernadero`
- **Paso 2.4: Inspección y validación del respaldo** | Leer el archivo manifiesto del respaldo | `cat /var/backups/invernadero/manifest.txt`
- **Paso 2.4: Inspección y validación del respaldo** | Inspeccionar el contenido del archivo `.bak` | `cat /var/backups/invernadero/catalogo_2026-10-17.bak`
- **Paso 2.4: Inspección y validación del respaldo** | Leer el catálogo real en producción para comparar | `cat /srv/invernadero/catalogo/catalogo_publico.csv`
- **Paso 2.5: Contención controlada del proceso** | Enviar señal de terminación limpia al PID del proceso sospechoso | `sudo kill -15 PID`
- **Paso 2.5: Contención controlada del proceso** | Verificar en la lista de procesos que la amenaza fue detenida | `ps aux`

### Guía Pedagógica

#### Paso 2.1: Cruza los registros con la memoria viva y formula tu hipótesis

> **Regla de investigación:** Un log te cuenta lo que ocurrió en el pasado; el comando `ps` te muestra lo que está vivo ahora mismo en la memoria RAM. Cruzar ambas fuentes te permite saber si un incidente sigue activo.

- Repasar las entradas del registro de actividad `sudo cat /var/log/invernadero/actividad.log`
  - _Recuerda los eventos de las 21:03: inicio del script de riego, creación del archivo en `/tmp` y aparición de `polilla_emisora`._
- Repasar las alertas del registro de incidentes `sudo cat /var/log/invernadero/incidentes.log`
  - _Ten presente las advertencias sobre el proceso no reconocido y el estado del backup._
- Listar todos los procesos que están corriendo actualmente en el servidor `ps aux`
  - _Busca en la columna derecha (`COMMAND`): comprobarás que tanto `/opt/invernadero/scripts/riego_nocturno.sh` como `/tmp/polilla_emisora` siguen ejecutándose en este instante._
- Redactar tu hipótesis en la Bitácora
  - _Dejar un ejecutable corriendo desde la carpeta temporal (`/tmp`) fuera de los directorios operativos es una anomalía clara. Anota tu hipótesis antes de pasar a inspeccionar su código._

#### Paso 2.2: Analiza el código de los procesos antes de actuar

> **Por qué inspeccionar antes de detener:** Si matas un proceso de inmediato, pierdes sus datos en ejecución (PID, usuario que lo lanzó, ruta activa). Además, siempre debes leer qué hace un script para no interrumpir por error una tarea crítica del sistema.

- Aislar la línea del proceso sospechoso para obtener su PID `ps aux | grep polilla_emisora`
  - _Observa la salida correspondiente a `/tmp/polilla_emisora`: la primera columna indica el usuario que lo ejecuta y el número de la ***segunda columna*** es su identificador único de proceso (_**PID**_). Anótalo._
- Leer el código fuente del proceso sospechoso `cat /tmp/polilla_emisora`
  - _Al ser un script en texto plano, puedes ver sus instrucciones sin riesgo. Descubrirás que solo contiene un bucle de espera (`sleep 60`): es un artefacto inofensivo simulado para evaluar tu procedimiento de respuesta._
- Leer el código fuente del script de riego `cat /opt/invernadero/scripts/riego_nocturno.sh`
  - _Comprueba que este script registra periódicamente el ciclo de riego en `/var/log/invernadero/riego.log`. Es una pieza vital de la operación de la estación y no debe tocarse._
- Asegurar la evidencia en la Bitácora
  - _Registra el PID exacto, la ruta `/tmp/polilla_emisora` y el análisis comparativo de ambos scripts antes de ejecutar cualquier acción de contención._

#### Paso 2.3: Analiza el binario con extensión engañosa

> **Rigor forense:** No reportes que encontraste malware solo porque la extensión sea engañosa. `file` identifica la cabecera ELF; `strings` permite examinar texto legible sin ejecutar el artefacto. El binario del laboratorio es inerte y no tiene permiso de ejecución.

- Consultar permisos, propietario y tamaño del archivo `ls -la /tmp/catalogo_orquideas.pdf`
  - _Toma nota de quién es el dueño del archivo y en qué fecha/hora fue depositado en `/tmp`._
- Confirmar el formato binario real del archivo `file /tmp/catalogo_orquideas.pdf`
  - _Verifica que el resultado sea `ELF 64-bit LSB executable`. La extensión `.pdf` es engañosa; el modo `0644` evita la ejecución directa. No ejecutes el artefacto para analizarlo._
- Leer el contenido interno en la terminal `strings /tmp/catalogo_orquideas.pdf`
  - _La salida de `strings` expone el mensaje de entrenamiento embebido: referencia la especie ORQ-014, la zona VIV-B02 y una lectura de humedad fuera del objetivo. Es un binario inerte para el ejercicio; no hay que ejecutarlo para analizarlo._
- Registrar la huella SHA-256 y preservar el artefacto `sha256sum /tmp/catalogo_orquideas.pdf`
  - _Guarda el hash en tu Bitácora. ***Importante:*** No elimines el archivo de `/tmp`; en una auditoría real, los artefactos en disco se preservan como prueba del incidente._

#### Paso 2.4: Audita la integridad de la copia de seguridad

> **Criterio operativo:** Restaurar un backup a ciegas durante un incidente es uno de los errores más destructivos en administración de sistemas. Si el respaldo está corrupto o incompleto, sobrescribirás y destruirás los datos sanos que están en producción.

- Listar el contenido del directorio de respaldos `ls -la /var/backups/invernadero`
  - _Identifica los archivos disponibles y revisa qué tamaño en bytes tiene el archivo `.bak`._
- Leer el manifiesto del respaldo `cat /var/backups/invernadero/manifest.txt`
  - _Indica que la copia corresponde al archivo `catalogo_publico.csv`, pero debemos comprobar si los datos están realmente allí._
- Inspeccionar el contenido real de la copia de seguridad `cat /var/backups/invernadero/catalogo_2026-10-17.bak`
  - _La copia incluye metadatos y tres filas botánicas (LIL-001, ORQ-014 y CAL-006), luego se declara truncada. El encabezado indica 7 registros esperados y 3 exportados; la verificación figura como `NOT_PERFORMED`._
- Comparar contra el catálogo activo en producción `cat /srv/invernadero/catalogo/catalogo_publico.csv`
  - _Compara la fuente con el backup: producción contiene 7 registros, pero la copia solo conserva 3. Las cuatro filas restantes no deben suponerse recuperables._
- Documentar la decisión de no restauración en la Bitácora
  - _Deja asentado que el backup es parcial y no verificado; restaurarlo podría perder cuatro registros del catálogo y el informe confidencial completo._

#### Paso 2.5: Ejecuta una contención quirúrgica

> **Criterio de contención:** Neutralizar únicamente el proceso no autorizado tras haber asegurado su evidencia, verificando al instante que los sistemas productivos sigan intactos.

- Confirmar el número de PID activo de `polilla_emisora` `ps aux | grep polilla_emisora`
  - _Asegúrate de tener el número exacto de la segunda columna (por ejemplo, `1234`). No escribas la palabra literal `PID` en el siguiente comando._
- Detener el proceso sospechoso de forma controlada `sudo kill -15 PID`
  - _Reemplaza `PID` por el número que obtuviste en el paso anterior. La señal `-15` (SIGTERM) ordena al proceso cerrarse de forma limpia sin dañar el sistema._
- Comprobar que el proceso anómalo desapareció de la memoria `ps aux`
  - _Revisa el listado general de procesos y confirma que `/tmp/polilla_emisora` ya no figura en ejecución._
- Verificar que el script de riego continúa operando `ps aux | grep riego_nocturno.sh`
  - _Confirma que la tarea automatizada del invernadero sigue corriendo en memoria sin interrupciones._
- Verificar que el panel web local sigue en línea `systemctl status nginx`
  - _Confirma que `nginx` permanece en estado `active (running)`. (Presiona `q` si necesitas salir del visor de estado)._

---

## FASE 3: Hardening — Aplicación y verificación de controles

> subtitle: Reducir la superficie de ataque corrigiendo las debilidades detectadas, sin comprometer la operación de la estación.

### Directivas

1. **Paso 3.1 — Neutraliza la cuenta del antiguo empleado** — La cuenta `ex_cuidador` pertenece a personal dado de baja. Aunque su contraseña figura bloqueada, en `/etc/passwd` viste que conserva asignada una consola interactiva (`/bin/bash`). Utiliza `usermod` para cambiar su shell a `/usr/sbin/nologin` y reafirmar el bloqueo de la cuenta, sin eliminar el usuario ni borrar su directorio personal. _Reporte en Bitácora: Registra el cambio en `/etc/passwd` y explica por qué en auditoría se prefiere deshabilitar la cuenta en lugar de destruirla._
2. **Paso 3.2 — Blinda los permisos de los archivos sensibles** — En la Fase 1 detectaste que la clave privada `/home/cuidador/.ssh/id_ed25519` y el informe `/srv/invernadero/informes/registro_confidencial.csv` tenían permisos `0644` (`-rw-r--r--`), quedando expuestos a lectura por cualquier usuario local. Utiliza `chmod` para restringir ambos archivos al modo `600` (lectura y escritura exclusiva para su propietario). _Reporte en Bitácora: Documenta la salida de `ls -l` que demuestra el nuevo estado de permisos (`-rw-------`)._
3. **Paso 3.3 — Cierra los servicios de red innecesarios** — En tu relevamiento de red viste que `ssh` escucha conexiones externas en todas las interfaces (`0.0.0.0:22`), mientras que `nginx` opera solo para el panel local (`127.0.0.1:8080`). Dado que la administración se realiza desde la consola local de la estación y el acceso por SSH no es requerido (además de haber recibido intentos de acceso fallidos), deshabilita y detén el servicio `ssh` con `systemctl`. _Reporte en Bitácora: Comprueba con `ss -tulpn` que el puerto 22 dejó de escuchar y que el puerto 8080 de Nginx sigue activo._
4. **Paso 3.4 — Evalúa las actualizaciones pendientes con criterio operativo** — Mantener paquetes desactualizados entraña riesgos, pero lanzar una actualización general del sistema en medio de una auditoría —y sin un backup válido— puede dejar inoperativa la estación. Consulta con `apt` qué paquetes tienen actualizaciones disponibles y define el plan de acción. _Reporte en Bitácora: ¿Qué paquete figura pendiente de actualización y por qué la decisión profesional es programar una ventana de mantenimiento en vez de ejecutar `apt upgrade` ahora?_
5. **Paso 3.5 — Ejecuta la verificación final y cierra la Bitácora** — Ningún control de seguridad se da por válido hasta verificar su efectividad. Realiza un chequeo integral de cierre revisando `/etc/passwd`, los permisos de los dos archivos blindados, los puertos en escucha y los procesos en memoria. _Reporte en Bitácora: Asienta el resumen ejecutivo de cierre confirmando que todos los controles están activos, que `nginx` y `riego_nocturno.sh` operan con normalidad y cuáles son las tareas pendientes para el equipo de TI._

### Pistas

- **Paso 3.1: Restricción de cuenta obsoleta** | Reemplazar la consola de `ex_cuidador` por `/usr/sbin/nologin` | `sudo usermod -s /usr/sbin/nologin ex_cuidador`
- **Paso 3.1: Restricción de cuenta obsoleta** | Asegurar el bloqueo formal de la cuenta `ex_cuidador` | `sudo usermod -L ex_cuidador`
- **Paso 3.1: Restricción de cuenta obsoleta** | Comprobar el cambio en el archivo de usuarios | `grep ex_cuidador /etc/passwd`
- **Paso 3.2: Protección de archivos sensibles** | Restringir a `600` los permisos de la clave privada SSH | `sudo chmod 600 /home/cuidador/.ssh/id_ed25519`
- **Paso 3.2: Protección de archivos sensibles** | Restringir a `600` los permisos del informe confidencial | `sudo chmod 600 /srv/invernadero/informes/registro_confidencial.csv`
- **Paso 3.2: Protección de archivos sensibles** | Verificar los nuevos permisos aplicados en ambos archivos | `ls -l /home/cuidador/.ssh/id_ed25519 /srv/invernadero/informes/registro_confidencial.csv`
- **Paso 3.3: Reducción de superficie de red** | Deshabilitar del arranque y detener inmediatamente el servicio SSH | `sudo systemctl disable --now ssh`
- **Paso 3.3: Reducción de superficie de red** | Comprobar que el servicio SSH quedó inactivo | `systemctl status ssh`
- **Paso 3.3: Reducción de superficie de red** | Confirmar que el servidor web Nginx continúa activo | `systemctl status nginx`
- **Paso 3.3: Reducción de superficie de red** | Verificar que el puerto 22 ya no figura en escucha | `sudo ss -tulpn`
- **Paso 3.4: Estado de actualización y parches** | Consultar la versión exacta del kernel activo | `uname -r`
- **Paso 3.4: Estado de actualización y parches** | Listar los paquetes que tienen actualizaciones pendientes | `apt list --upgradable`
- **Paso 3.5: Verificación global de controles y cierre** | Confirmar la restricción final de `ex_cuidador` | `grep ex_cuidador /etc/passwd`
- **Paso 3.5: Verificación global de controles y cierre** | Confirmar los permisos `600` en los archivos críticos | `ls -l /home/cuidador/.ssh/id_ed25519 /srv/invernadero/informes/registro_confidencial.csv`
- **Paso 3.5: Verificación global de controles y cierre** | Confirmar que solo los puertos necesarios siguen abiertos | `sudo ss -tulpn`
- **Paso 3.5: Verificación global de controles y cierre** | Confirmar la ausencia de procesos anómalos y la continuidad del riego | `ps aux`

### Guía Pedagógica

#### Paso 3.1: Neutraliza la cuenta del antiguo empleado

> **Por qué importa:** Las cuentas de ex-empleados sin desactivar son un clásico vector de intrusión. Asignar `/usr/sbin/nologin` impide cualquier inicio de sesión interactivo en consola, mientras que conservar la cuenta (sin borrarla con `userdel`) preserva la trazabilidad de sus archivos e historial para futuras auditorías.

- Verificar el estado inicial de la cuenta en `/etc/passwd` `grep ex_cuidador /etc/passwd`
  - _Observa que al final de la línea todavía tiene asignada la consola `/bin/bash`._
- Verificar el estado inicial de bloqueo de contraseña `sudo passwd -S ex_cuidador`
  - _Confirma el estado previo antes de aplicar el control._
- Retirar la consola interactiva asignando `nologin` `sudo usermod -s /usr/sbin/nologin ex_cuidador`
  - _Modifica el intérprete de comandos del usuario a `/usr/sbin/nologin`, rechazando de plano cualquier intento de abrir una terminal con esa cuenta._
- Reafirmar el bloqueo de la cuenta `sudo usermod -L ex_cuidador`
  - _Asegura el bloqueo administrativo del acceso por contraseña._
- Comprobar que el cambio en `/etc/passwd` quedó aplicado `grep ex_cuidador /etc/passwd`
  - _Verifica que la línea de `ex_cuidador` ahora termine en `/usr/sbin/nologin`._
- Comprobar el estado final de la contraseña `sudo passwd -S ex_cuidador`
  - _Registra ambas salidas en tu Bitácora como evidencia del control aplicado._

#### Paso 3.2: Blinda los permisos de los archivos sensibles

> **Principio de mínimo privilegio:** Ningún usuario debe tener acceso a datos que no necesita para su función. El permiso octal `600` (`-rw-------`) garantiza que solo el dueño del archivo pueda leerlo y modificarlo, eliminando por completo el acceso para el grupo y para el resto de los usuarios del sistema.

- Revisar los permisos abiertos antes de aplicar el cambio `ls -l /home/cuidador/.ssh/id_ed25519 /srv/invernadero/informes/registro_confidencial.csv`
  - _Observa los permisos actuales `-rw-r--r--` (0644)._
- Restringir los permisos de la clave privada SSH `sudo chmod 600 /home/cuidador/.ssh/id_ed25519`
  - _Protege la credencial criptográfica para que ningún otro usuario local pueda leerla ni copiarla._
- Restringir los permisos del informe confidencial `sudo chmod 600 /srv/invernadero/informes/registro_confidencial.csv`
  - _Cierra el acceso público local al documento hasta que la administración defina formalmente los permisos de grupo._
- Verificar que los nuevos permisos se aplicaron con éxito `ls -l /home/cuidador/.ssh/id_ed25519 /srv/invernadero/informes/registro_confidencial.csv`
  - _Comprueba que ambos archivos muestren exactamente `-rw-------` al inicio de la línea y regístralo en la Bitácora._

#### Paso 3.3: Cierra los servicios de red innecesarios

> **Reducción de superficie de ataque:** Cada servicio escuchando en red es una puerta que mantener vigilada. Si un servicio (como SSH) no se requiere para operar la estación y está expuesto a toda la red (`0.0.0.0`), la medida más segura es desactivarlo, cuidando de no tocar los servicios productivos (`nginx`).

- Listar los servicios activos antes del cambio `systemctl --type=service`
  - _Repasa qué servicios están corriendo en el sistema. (Recuerda usar `q` si se abre el paginador)._
- Revisar los puertos actualmente en escucha `sudo ss -tulpn`
  - _Observa el puerto `22` (`sshd` en `0.0.0.0`) y el puerto `8080` (`nginx` en `127.0.0.1`)._
- Verificar el estado del servidor web Nginx `systemctl status nginx`
  - _Confirma su estado operativo antes de intervenir en la red._
- Verificar el estado actual del servidor SSH `systemctl status ssh`
  - _Observa que se encuentra activo (`active (running)`) y habilitado en el arranque._
- Deshabilitar y detener el servicio SSH en un solo paso `sudo systemctl disable --now ssh`
  - _El parámetro `disable` evita que el servicio inicie cuando el servidor se reinicie, y `--now` lo detiene inmediatamente en la sesión actual._
- Confirmar que el servicio SSH quedó detenido `systemctl status ssh`
  - _Verifica que ahora figure como `inactive (dead)`._
- Confirmar que Nginx no sufrió interrupciones `systemctl status nginx`
  - _Asegúrate de que el servidor del panel interno continúe `active (running)`._
- Comprobar en la tabla de red que el puerto 22 se cerró `sudo ss -tulpn`
  - _Confirma que ya no existe ningún proceso escuchando en el puerto 22 y que solo permanece activo el puerto local `127.0.0.1:8080`. Registra esta evidencia en la Bitácora._

#### Paso 3.4: Evalúa las actualizaciones pendientes con criterio operativo

> **Gestión de cambios y parches:** Aplicar parches de seguridad es vital, pero ejecutar actualizaciones en caliente sobre un servidor sin respaldo válido puede romper dependencias y detener la operación. La decisión correcta en auditoría es relevar la deuda técnica y programar una ventana de mantenimiento controlada.

- Consultar la versión actual del kernel `uname -r`
  - _Registra la versión exacta del núcleo activo._
- Listar los paquetes instalados actualmente `dpkg -l`
  - _Permite tener constancia de las versiones en producción (recuerda presionar `q` para salir del visor)._
- Consultar qué paquetes tienen actualizaciones disponibles `apt list --upgradable`
  - _Notarás que el paquete `openssh-server` tiene una versión más reciente disponible en los repositorios._
- Documentar el plan de mantenimiento sin actualizar ahora
  - _**No ejecutes `apt upgrade`.** Registra en tu Bitácora el paquete desactualizado y recomienda aplicar el parche dentro de una ventana de mantenimiento programada, únicamente después de haber generado un backup íntegro y verificado del sistema._

#### Paso 3.5: Ejecuta la verificación final y cierra la Bitácora

> **Protocolo de cierre:** Antes de dar por finalizada tu intervención en la estación, debes ejecutar una ronda de comprobación final que demuestre que todos los controles persisten y los sistemas vitales operan sin fallos.

- Comprobar la consola asignada a `ex_cuidador` `grep ex_cuidador /etc/passwd`
  - _Confirma que finaliza en `/usr/sbin/nologin`._
- Comprobar el bloqueo de contraseña de `ex_cuidador` `sudo passwd -S ex_cuidador`
  - _Confirma que mantiene el indicador `L` (Locked)._
- Comprobar el blindaje de permisos en los archivos sensibles `ls -l /home/cuidador/.ssh/id_ed25519 /srv/invernadero/informes/registro_confidencial.csv`
  - _Confirma que ambos exhiben permisos `-rw-------` (`600`)._
- Comprobar la salud operativa del servidor web Nginx `systemctl status nginx`
  - _Confirma que sigue activo (`active (running)`)._
- Comprobar el cierre de puertos expuestos `sudo ss -tulpn`
  - _Confirma que solo `127.0.0.1:8080` está en escucha y que el puerto `22` permanece cerrado._
- Comprobar la limpieza y continuidad de los procesos en memoria `ps aux`
  - _Confirma que `polilla_emisora` sigue ausente y que `/opt/invernadero/scripts/riego_nocturno.sh` continúa ejecutándose con normalidad._
- Redactar el cierre ejecutivo en la Bitácora
  - _Completa tu Bitácora resumiendo los controles aplicados y dejando asentadas las tres tareas pendientes para el equipo de TI: 1) Corregir y generar un backup completo del catálogo, 2) Programar la ventana de mantenimiento para actualizar paquetes y 3) Auditar físicamente el router/firewall y los equipos externos que exceden a este servidor._
