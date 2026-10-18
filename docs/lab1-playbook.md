# MANUAL DE OPERACIONES Y AUDITORÍA: ESTACIÓN `INVERNADERO-CENTRAL`

**CLASIFICACIÓN:** Confidencial / Uso exclusivo del Operador Asignado

**ESTADO DE LA ESTACIÓN:** Modo Autónomo (Tiempo transcurrido desde la última intervención humana: _Indeterminado_)

### Directiva de Incorporación

Bienvenido a la consola de administración de `invernadero-central`. Usted ha sido convocado de manera anónima para asumir el control técnico de esta estación botánica y observatorio de señales. El cuidador anterior interrumpió toda comunicación de forma abrupta; sin embargo, los registros locales sugieren que dejó notas y rastros deliberados en el sistema antes de su desaparición. Desde entonces, la infraestructura ha operado en piloto automático.

Durante este período sin supervisión, la configuración del servidor se ha degradado y nuestros monitores perimetrales indican anomalías activas. Su misión es auditar el sistema, contener las amenazas y restaurar la seguridad de la estación.

> **ADVERTENCIA CRÍTICA DE CONTINUIDAD OPERATIVA:**
> Las especies botánicas alojadas en los sectores hidropónicos dependen estrictamente de los sistemas automatizados de riego, telemetría y control lumínico. En ciberseguridad, proteger un sistema no significa apagarlo: usted debe garantizar en todo momento el equilibrio de la **Tríada CIA (Confidencialidad, Integridad y Disponibilidad)**. Si detiene servicios vitales por precaución excesiva o bloquea el flujo legítimo de los sensores, la **Disponibilidad** caerá a cero y los especímenes biológicos perecerán.
>
> - **Documentación:** Se recomienda registrar cada hallazgo, hash criptográfico, puerto anómalo y decisión tomada en su aplicación **Cuaderno de Campo (Bitácora)**.
> - **Red de seguridad:** Antes de ejecutar modificaciones destructivas o experimentales, utilice la función de **Instantánea (Snapshot)** en la barra superior para poder restaurar el estado del sistema en caso de error.

---

## FASE 1: Sincronización Temporal y Exploración de Rastros

_Reconocimiento del sistema de archivos, verificación de integridad y normalización de registros._

### A. Instrucciones Operativas (Vista por defecto)

Antes de intervenir en la configuración del servidor, es necesario comprender qué ocurrió durante la ausencia del cuidador anterior y asegurar que las herramientas de monitoreo sean confiables.

1. **Normalización de la línea de tiempo (SIEM):** Al abrir la consola del **SIEM**, observará que los registros de auditoría presentan marcas de tiempo incoherentes (fechas desfasadas), lo que impide reconstruir la cronología de los eventos. Verifique el estado de los servicios del sistema encargados de la sincronización horaria e inicie el demonio correspondiente para restablecer la precisión temporal.
2. **Rastreo de notas y validación de copias de seguridad:** Explore el directorio personal del cuidador (`/home/cuidador`). Busque archivos ocultos dejados por su predecesor. En ellos encontrará la referencia criptográfica (huella digital) de los archivos de calibración de riego alojados en la carpeta de respaldos (`backups`). Compare las huellas digitales de las tres versiones disponibles para identificar cuál conserva su **Integridad** intacta y elimine o aísle las versiones adulteradas.
3. **Inspección de áreas temporales:** El directorio temporal del sistema (`/tmp`) permite la escritura a cualquier usuario y suele utilizarse para alojar artefactos sospechosos. Inspeccione su contenido sin ejecutar ningún archivo. Verifique la naturaleza real de los documentos allí alojados (más allá de su extensión visible) y elimine cualquier binario ejecutable camuflado.

---

### B. Pista: Herramientas y Comandos Sugeridos (Desplegable)

> **Caja de Herramientas para la Fase 1:**
>
> - **Gestión de servicios de tiempo:** `systemctl status ntp.service` y `sudo systemctl start ntp.service`.
> - **Navegación y descubrimiento de archivos ocultos:** `cd`, `pwd` y `ls -la` (el modificador `-a` revela elementos que comienzan con un punto `.`).
> - **Lectura segura de textos y registros:** `cat`, `less` o `grep`.
> - **Verificación criptográfica de integridad:** `sha256sum <archivo>`.
> - **Análisis de encabezados reales (Magic Numbers):** `file <archivo>` y eliminación con `rm <archivo>`.

---

### C. Guía Pedagógica y Solución Asistida (Desplegable)

> **Fundamento Teórico y Procedimiento Paso a Paso:**
> **1. ¿Por qué fallaba el SIEM? El rol del protocolo NTP**
> Para correlacionar eventos de seguridad y realizar un análisis forense válido, todos los relojes de una infraestructura deben estar sincronizados mediante **NTP (Network Time Protocol)**. Si el servicio está detenido, los registros (`logs`) pierden su valor probatorio.
>
> - Consulte el estado del servicio ejecutando:
>   `systemctl status ntp.service`
> - Al confirmar que se encuentra inactivo (`dead`), inícielo con privilegios administrativos:
>   `sudo systemctl start ntp.service`
> - _Observe cómo la tabla del SIEM ordena automáticamente todos los eventos de forma cronológica._
>
> **2. Descubrimiento de archivos ocultos y preservación de la Integridad**
> En sistemas Linux, los archivos cuyos nombres inician con un punto (`.`) están ocultos por defecto para evitar modificaciones accidentales.
>
> - Sitúese en el directorio del usuario y liste absolutamente todos los archivos con formato detallado:
>   `cd /home/cuidador && ls -la`
> - Verá el archivo oculto `.notas_cuidador.txt`. Lea su contenido de forma segura:
>   `cat .notas_cuidador.txt`
> - La nota indica el hash **SHA-256** legítimo del archivo de calibración. Una función hash genera una huella alfanumérica única; si un atacante o un fallo altera un solo carácter del archivo, el hash resultante cambiará por completo. Calcule los hashes de las copias de seguridad:
>   `sha256sum /home/cuidador/backups/*`
> - Compare los resultados con la nota del cuidador, registre el archivo legítimo en su **Bitácora** y elimine el archivo corrupto utilizando `rm`.
>
> **3. Detección de archivos camuflados en `/tmp**`
> Los atacantes frecuentemente disfrazan programas maliciosos (como troyanos) utilizando extensiones inofensivas como `.pdf` o `.jpg`. Nunca debe confiarse en el nombre de un archivo.
>
> - Inspeccione la carpeta temporal:
>   `ls -la /tmp`
> - Utilice la herramienta `file`, la cual examina los primeros bytes internos del archivo (_magic numbers_) para determinar su verdadera estructura sin abrirlo ni ejecutarlo:
>   `file /tmp/catalogo_orquideas.pdf`
> - La salida revelará que no es un documento PDF, sino un binario ejecutable (`ELF 64-bit LSB executable`). Elimine este artefacto malicioso de inmediato:
>   `rm /tmp/catalogo_orquideas.pdf`

**Verificación de Fase 1:**

- [ ] El servicio `ntp.service` se encuentra en estado `running` y la línea de tiempo del SIEM está sincronizada.
- [ ] El archivo de calibración adulterado ha sido identificado y purgado de `/home/cuidador/backups`.
- [ ] El ejecutable camuflado `catalogo_orquideas.pdf` ha sido eliminado de `/tmp`.

---

## FASE 2: Triaje de Telemetría y Procesos en Ejecución

_Análisis de comportamiento en el EDR, distinción de falsos positivos y erradicación de procesos anómalos._

### A. Instrucciones Operativas (Vista por defecto)

Los ventiladores del servidor operan a máxima capacidad y el panel del **EDR (Endpoint Detection and Response)** reporta dos alertas de comportamiento en tiempo real. Sin embargo, las herramientas heurísticas pueden equivocarse: como operador, su criterio es indispensable para no interrumpir procesos vitales del invernadero.

1. **Auditoría de procesos activos:** Inspeccione desde la terminal todos los procesos que se están ejecutando en memoria, prestando especial atención a qué cuenta de usuario los invocó y qué porcentaje de procesador (CPU) consumen.
2. **Validación de Falsos Positivos:** Una de las alertas del EDR señala un script de automatización ubicado en `/opt/sensores/`. Antes de tomar una decisión drástica, inspeccione el código fuente de dicho script desde la terminal. Si comprueba que su lógica es legítima y necesaria para la supervivencia de las plantas, clasifíquelo como **Falso Positivo** en la interfaz del EDR sin detener su ejecución.
3. **Neutralización de amenazas activas:** Identifique el proceso no autorizado que se ejecuta bajo el usuario del servidor web (`www-data`), el cual mantiene una conexión hacia un servidor de Comando y Control (C2) externo. Detenga su ejecución enviando una señal de terminación a su identificador de proceso (PID).

---

### B. Pista: Herramientas y Comandos Sugeridos (Desplegable)

> **Caja de Herramientas para la Fase 2:**
>
> - **Fotografía estática y monitor dinámico de procesos:** `ps aux` o `top` (presione `q` para salir de `top`).
> - **Inspección del script sospechoso:** `cat /opt/sensores/riego_nocturno.sh`.
> - **Terminación de procesos por PID:** `sudo kill -15 <PID>` (terminación ordenada) o `sudo kill -9 <PID>` (terminación forzada).

---

### C. Guía Pedagógica y Solución Asistida (Desplegable)

> **Fundamento Teórico y Procedimiento Paso a Paso:**
> **1. Investigación contextual frente al pánico operativo**
> Un EDR no depende únicamente de firmas estáticas, sino que monitorea comportamientos inusuales (como scripts ejecutándose de madrugada). Esto genera inevitablemente **falsos positivos**. Si usted detiene todos los procesos marcados sin investigarlos primero, destruirá la **Disponibilidad** del sistema de riego.
> **2. Lectura de la tabla de procesos (`ps aux`)**
>
> - Ejecute en la terminal:
>   `ps aux`
> - Analice las columnas `USER`, `PID`, `%CPU` y `COMMAND`. Notará dos procesos relevantes:
>
> 1. Un script ejecutado por `cuidador`: `/bin/bash /opt/sensores/riego_nocturno.sh`.
> 2. Un binario ejecutado por `www-data`: `./polilla_emisora --c2 198.51.100.44` consumiendo más del 60% de CPU.
>
> **3. Descarte del Falso Positivo**
>
> - Revise qué hace realmente el script de riego leyendo su contenido:
>   `cat /opt/sensores/riego_nocturno.sh`
> - Al verificar que únicamente activa las válvulas de humedad para las orquídeas, diríjase a la aplicación **EDR** y marque la alerta como **Falso Positivo / Permitir**.
>
> **4. Erradicación del proceso intruso**
> Que la cuenta del servidor web (`www-data`) ejecute un programa oculto conectado a una IP externa es un indicador claro de explotación y comunicación de **Comando y Control (C2)**.
>
> - Tome nota del número `PID` correspondiente a `polilla_emisora` en la salida de `ps aux`.
> - Envíe una señal de terminación limpia (`SIGTERM`, código `-15`), la cual solicita al proceso cerrar sus conexiones antes de finalizar, permitiendo que el sistema registre el evento en las bitácoras:
>   `sudo kill -15 <PID>` _(reemplace `<PID>` por el número real, por ejemplo `890`)_.
> - Si el proceso persiste congelado, utilice `sudo kill -9 <PID>` (`SIGKILL`) para que el Kernel lo desaloje inmediatamente de la memoria RAM.

**Verificación de Fase 2:**

- [ ] El script `riego_nocturno.sh` continúa en ejecución (`running`) y su alerta fue descartada en el EDR como falso positivo.
- [ ] El proceso malicioso `polilla_emisora` ha sido terminado y ya no figura en la salida de `ps aux`.

---

## FASE 3: Control de Identidades, Privilegios y Criptografía Local

_Aplicación del principio de mínimo privilegio y protección de credenciales._

### A. Instrucciones Operativas (Vista por defecto)

Una revisión preliminar indica que las barreras de control de acceso interno han sido relajadas peligrosamente, comprometiendo la **Confidencialidad** del servidor. Cualquier cuenta con acceso básico podría leer información crítica o impedir el funcionamiento de herramientas criptográficas.

1. **Protección del archivo de contraseñas cifradas:** En Linux, mientras que la lista de usuarios es pública para el sistema, el archivo que almacena los hashes de las contraseñas en `/etc/` debe ser estrictamente confidencial. Audite sus permisos actuales y corríjalos para que ningún usuario estándar pueda leerlo.
2. **Reparación de llaves criptográficas SSH:** El cuidador utilizaba un par de claves asimétricas (`Ed25519`) alojadas en su directorio oculto de configuración SSH para conectarse a otros módulos del invernadero. Actualmente, el cliente SSH se niega a operar debido a que la clave privada tiene permisos excesivamente abiertos. Restrinja los permisos de la clave privada para que sea legible y modificable exclusivamente por su propietario.
3. **Endurecimiento del demonio SSH:** Edite el archivo de configuración del servidor SSH en `/etc/ssh/` para deshabilitar el inicio de sesión directo del superusuario (`root`), obligando a que toda administración se realice mediante cuentas nominales con elevación temporal de privilegios.

---

### B. Pista: Herramientas y Comandos Sugeridos (Desplegable)

> **Caja de Herramientas para la Fase 3:**
>
> - **Inspección de permisos actuales:** `ls -l /etc/shadow` y `ls -la /home/cuidador/.ssh/`.
> - **Modificación de permisos en notación octal:** `sudo chmod 600 <ruta_archivo>` (o `640` según corresponda).
> - **Edición de archivos de configuración en terminal:** `sudo nano /etc/ssh/sshd_config` (guarde con `Ctrl+O` y salga con `Ctrl+X`).
> - **Reinicio del servicio tras cambios:** `sudo systemctl restart ssh.service`.

---

### C. Guía Pedagógica y Solución Asistida (Desplegable)

> **Fundamento Teórico y Procedimiento Paso a Paso:**
> **1. Separación entre `/etc/passwd` y `/etc/shadow**`
> El archivo `/etc/passwd` enumera las cuentas del sistema y necesita ser legible por todos los procesos (`644`). Por el contrario, `/etc/shadow` contiene los hashes criptográficos de las contraseñas. Si `/etc/shadow` tiene permisos `777` (lectura, escritura y ejecución para todos), cualquier atacante local puede copiar los hashes y descifrarlos mediante fuerza bruta fuera de línea.
>
> - Verifique el problema ejecutando:
>   `ls -l /etc/shadow`
> - Aplique el **Principio de Mínimo Privilegio** restringiendo los permisos a `600` (solo lectura y escritura para `root`, cero permisos para el grupo y otros):
>   `sudo chmod 600 /etc/shadow`
>
> **2. Permisos estrictos en claves privadas SSH (`id_ed25519`)**
> La criptografía asimétrica de SSH utiliza una clave pública (el cerrojo que se comparte) y una clave privada (la llave secreta que jamás debe divulgarse). Por seguridad por diseño, el propio cliente SSH bloquea cualquier conexión si detecta que otros usuarios del sistema tienen permiso de lectura sobre su clave privada.
>
> - Compruebe el error intentando usar la clave o listando la carpeta:
>   `ls -la ~/.ssh`
> - Ajuste los permisos de la clave privada a `600` (lectura `4` + escritura `2` = `6` únicamente para el propietario `cuidador`):
>   `chmod 600 ~/.ssh/id_ed25519`
>
> **3. Prohibición de acceso directo como `root` en SSH**
> Permitir que múltiples operadores o atacantes intenten conectarse directamente como `root` destruye la trazabilidad (_accountability_) y facilita ataques de fuerza bruta.
>
> - Abra la configuración del servidor SSH con el editor de texto de terminal:
>   `sudo nano /etc/ssh/sshd_config`
> - Localice la directiva `PermitRootLogin yes` y cámbiela por `PermitRootLogin no`.
> - Presione `Ctrl+O` seguido de `Enter` para guardar, y `Ctrl+X` para salir. Reinicie el servicio para aplicar la directiva:
>   `sudo systemctl restart ssh.service`

**Verificación de Fase 3:**

- [ ] `/etc/shadow` posee permisos restrictivos (`600` o `640`).
- [ ] `/home/cuidador/.ssh/id_ed25519` posee permisos `600` y no arroja advertencias al invocar `ssh`.
- [ ] `/etc/ssh/sshd_config` establece `PermitRootLogin no` y el servicio fue reiniciado.

---

## FASE 4: Higiene de Red, Puertos en Escucha y Resolución DNS

_Reducción de la superficie de ataque, reemplazo de protocolos en texto plano y corrección de enrutamiento de nombres._

### A. Instrucciones Operativas (Vista por defecto)

Cada puerto abierto y cada protocolo obsoleto amplían la **superficie de ataque** de la estación. Además, el navegador interno del invernadero no logra cargar correctamente los paneles locales por nombre de dominio, redirigiendo el tráfico hacia un destino sospechoso.

1. **Auditoría de puertos y sockets en escucha:** Enumere todas las conexiones TCP y UDP que se encuentran esperando solicitudes entrantes (`LISTEN`) en el servidor, identificando qué proceso mantiene abierto cada puerto.
2. **Transición de protocolos obsoletos a cifrados:** Si observa el **Monitor de Tráfico**, notará que las sesiones de administración remota por el puerto TCP `23` exponen las credenciales letra por letra en texto plano. Desactive de forma definitiva este servicio obsoleto y asegúrese de que únicamente el servicio de administración remota cifrada en el puerto TCP `22` permanezca activo. _(Recuerde no detener el servidor web en el puerto 80 para no interrumpir el panel hidropónico)._
3. **Restauración de la resolución de nombres (DNS):** Investigue cómo el sistema operativo está traduciendo los nombres de dominio. Inspeccione el archivo de configuración del resolutor DNS local en `/etc/`, elimine la dirección IP del servidor DNS no autorizado y apúntelo al servidor DNS legítimo de la red interna (`10.0.2.1` o `1.1.1.1`).

---

### B. Pista: Herramientas y Comandos Sugeridos (Desplegable)

> **Caja de Herramientas para la Fase 4:**
>
> - **Inspección de interfaces y puertos en escucha:** `ip a` y `sudo ss -tulpn`.
> - **Desactivación de servicios inseguros:** `sudo systemctl stop telnet.service` y `sudo systemctl disable telnet.service`.
> - **Diagnóstico DNS y cabeceras web:** `dig invernadero.local` y `curl -I [http://127.0.0.1](http://127.0.0.1)`.
> - **Corrección del servidor DNS:** `cat /etc/resolv.conf` y edición con `sudo nano /etc/resolv.conf`.

---

### C. Guía Pedagógica y Solución Asistida (Desplegable)

> **Fundamento Teórico y Procedimiento Paso a Paso:**
> **1. Identificación de servicios expuestos con `ss**`
> Un servicio en escucha (_listening service_) es un programa que aguarda conexiones en un socket (combinación de dirección IP y puerto). Para reducir la superficie de ataque, todo servicio innecesario o inseguro debe cerrarse.
>
> - Liste todos los puertos TCP (`-t`) y UDP (`-u`) en estado de escucha (`-l`), mostrando el proceso asociado (`-p`) y el número exacto de puerto (`-n`):
>   `sudo ss -tulpn`
> - Identificará el puerto `:23` asociado a **Telnet**, un protocolo antiguo que carece de cifrado en tránsito.
>
> **2. Reemplazo de Telnet por SSH**
> Cualquier atacante que realice _packet sniffing_ (captura de paquetes) en la red puede leer contraseñas transmitidas por Telnet (TCP 23), mientras que **SSH** (TCP 22) protege la confidencialidad e integridad mediante un túnel cifrado.
>
> - Detenga y deshabilite el servicio Telnet para que tampoco vuelva a iniciarse si el servidor se reinicia:
>   `sudo systemctl stop telnet.service`
>   `sudo systemctl disable telnet.service`
> - Verifique que `ssh.service` esté activo (`systemctl status ssh.service`) y vuelva a ejecutar `sudo ss -tulpn` para comprobar que el puerto 23 ha desaparecido.
>
> **3. Remediación de envenenamiento / desvío DNS**
> El protocolo **DNS** traduce nombres legibles (como `panel.invernadero.local`) en direcciones IP. Si un atacante modifica el archivo `/etc/resolv.conf` (por ejemplo, mediante un servidor _Rogue DHCP_ o acceso indebido), puede redirigir a los operadores hacia sitios falsos de suplantación (_phishing_).
>
> - Consulte qué servidor DNS está utilizando el sistema:
>   `cat /etc/resolv.conf`
> - Verá la línea `nameserver 10.66.6.6` (un servidor malicioso). Edite el archivo:
>   `sudo nano /etc/resolv.conf`
> - Cambie la dirección por el DNS interno confiable `nameserver 10.0.2.1` (o `1.1.1.1`), guarde los cambios y compruebe con `dig invernadero.local` que el dominio ahora resuelve a la IP legítima del invernadero.
> - _Pista de exploración opcional:_ Revise `/etc/hosts` con `cat /etc/hosts` para descubrir anotaciones internas que dejó el antiguo cuidador sobre otros nodos de la red.

**Verificación de Fase 4:**

- [ ] El puerto TCP `23` (`telnet.service`) se encuentra cerrado y deshabilitado.
- [ ] Los puertos TCP `22` (SSH) y TCP `80` (Servidor Web del panel) permanecen activos y operativos.
- [ ] El archivo `/etc/resolv.conf` apunta a un servidor DNS confiable y el navegador interno carga el panel legítimo.

---

## FASE 5: Segmentación de Red, Defensa en Profundidad y Cierre de Bitácora

_Aislamiento de zonas de confianza, contención del radio de explosión y validación final de la Tríada CIA._

### A. Instrucciones Operativas (Vista por defecto)

En esta última etapa, usted debe asegurar la arquitectura general de la estación aplicando una mentalidad de **Asumir la Brecha (Assume Breach)** y **Defensa en Profundidad**. Actualmente, la red opera de forma excesivamente plana: los sensores de humedad e iluminación IoT (`10.0.3.0/24`) tienen acceso irrestricto hacia el segmento administrativo y hacia Internet.

1. **Aislamiento y Segmentación en el Firewall:** Abra el **Tablero de Zonas y Firewall**. Configure las reglas de filtrado para limitar el movimiento lateral (tráfico este-oeste) y la exposición externa (tráfico norte-sur):

- Bloquee el acceso directo desde Internet (`Zona Pública`) hacia la subred de `Sensores IoT` y hacia la base de datos interna.
- Restrinja el acceso de administración remota (SSH, puerto 22) para que solo se permita desde el segmento interno autorizado y no desde cualquier dirección pública (`0.0.0.0/0`).
- **Atención a la Disponibilidad:** Mantenga permitido el canal de comunicación estrictamente necesario entre la subred de `Sensores IoT` (`10.0.3.0/24`) y el servidor central del invernadero para que los reportes de humedad y temperatura sigan llegando.

2. **Comprobación del equilibrio CIA y entrega de Bitácora:** Verifique que los indicadores de **Confidencialidad, Integridad y Disponibilidad** se encuentren simultáneamente en niveles óptimos (superiores al 90%) y complete el reporte final en su **Cuaderno de Campo** detallando los activos protegidos, las vulnerabilidades mitigadas y el estado en el que queda la estación.

---

### B. Pista: Herramientas y Comandos Sugeridos (Desplegable)

> **Caja de Herramientas para la Fase 5:**
>
> - **Verificación de rutas y conectividad entre subredes:** `ip route` y `ping -c 4 <IP_destino>`.
> - **Interfaz de Control de Acceso (ACL / Firewall):** Utilice el **Tablero de Zonas y Firewall** para alternar las reglas de tráfico entre la Subred Pública (`10.0.1.0/24`), el Laboratorio Interno (`10.0.2.0/24`) y la Red de Sensores IoT (`10.0.3.0/24`).
> - **Documentación:** Aplicación **Cuaderno de Campo (Bitácora)**.

---

### C. Guía Pedagógica y Solución Asistida (Desplegable)

> **Fundamento Teórico y Procedimiento Paso a Paso:**
> **1. ¿Por qué segmentar los dispositivos IoT?**
> Los sensores automatizados (cámaras, medidores de humedad, controladores lumínicos) suelen poseer capacidades de seguridad limitadas y configuraciones vulnerables. En una red plana, si un atacante compromete una lámpara UV conectada a Internet, puede desplazarse lateralmente hacia el servidor principal. La **segmentación** divide la red en zonas de confianza aisladas mediante subredes y reglas de firewall (ACL), conteniendo el _radio de explosión_ (_blast radius_).
> **2. Configuración del Firewall sin destruir la Disponibilidad**
> Si usted aplica una política de bloqueo total ("denegar todo el tráfico en todas las direcciones"), alcanzará un nivel teórico máximo de Confidencialidad, pero provocará una denegación de servicio autoinfligida: las válvulas de riego perderán contacto con el servidor y el invernadero colapsará.
>
> - En el **Tablero de Firewall**, aplique las siguientes reglas basadas en el principio de **Confianza Cero (Zero Trust)** y **Mínimo Privilegio**:
>
> 1. **Tráfico Norte-Sur (Internet -> Sensores IoT `10.0.3.0/24`):** **BLOQUEAR (DENY)**. Los sensores no deben ser accesibles directamente desde el exterior.
> 2. **Tráfico Norte-Sur (Internet `0.0.0.0/0` -> Puerto 22 SSH):** **BLOQUEAR (DENY)** o restringir exclusivamente a la red de administración/VPN.
> 3. **Tráfico Este-Oeste (Sensores IoT `10.0.3.0/24` -> Servidor Invernadero Puerto 80/443):** **PERMITIR (ALLOW)**. Es el único canal indispensable para recibir la telemetría botánica.
>
> - Compruebe desde la terminal que aún recibe respuesta de los sensores ejecutando cuatro paquetes de prueba ICMP:
>   `ping -c 4 10.0.3.10`
>
> **3. Registro y Auditoría Continua**
> La seguridad no es un estado estático, sino un ciclo continuo de identificación, protección, detección, respuesta y recuperación (como establece el marco **NIST CSF 2.0**). Finalice su intervención completando las secciones asistidas del **Cuaderno de Campo**, dejando constancia clara para cualquier operador futuro sobre los controles implementados.

**Verificación Final de Misión (Fase 5):**

- [ ] El tráfico directo desde Internet hacia la subred de Sensores IoT y hacia el puerto 22 público está bloqueado.
- [ ] La comunicación interna de telemetría entre los sensores y el servidor central sigue activa (`ping` y reporte web exitosos).
- [ ] El medidor de la **Tríada CIA** registra niveles óptimos en Confidencialidad, Integridad y Disponibilidad simultáneamente.
- [ ] El **Cuaderno de Campo (Bitácora)** ha sido completado y guardado.
