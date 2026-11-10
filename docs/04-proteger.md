# 4) Proteger <!-- id: 04-protect -->

Un diseño arquitectónico de ciberseguridad carece de valor defensivo si permanece únicamente en un plano conceptual mientras los servidores y estaciones de trabajo continúan operando con contraseñas predeterminadas, servicios innecesarios en ejecución y permisos excesivos. Una vez que la organización ha comprendido sus riesgos (01. COMPRENDER), inventariado sus activos (02. DESCUBRIR) y estructurado su plano de defensa en profundidad (03. DISEÑAR), llega el momento de transformar las especificaciones de ingeniería en barreras técnicas activas. El reto operativo primordial en esta etapa consiste en implementar los controles sobre los sistemas operativos, las redes de comunicación, los directorios de identidad y los motores de bases de datos garantizando que la actividad comercial cotidiana no sufra interrupciones ni bloqueos involuntarios.

En el marco de referencia de lilium, la capa **PROTECT** (Implementación de controles preventivos y de resiliencia) ejecuta las decisiones acordadas en la fase de diseño. Siguiendo el orden riguroso del Plan de Acción e Hitos (_Plan of Action and Milestones_ o POA&M), este módulo guía paso a paso la ejecución de instrucciones en terminal, el ajuste de parámetros en archivos de configuración y la puesta en marcha de utilidades nativas y de código abierto. Cada procedimiento está respaldado por sus correspondientes copias de resguardo previas, pautas de reversión (_rollback_) y pruebas de verificación positivas y negativas que aportan evidencia objetiva de su efectividad.

## **¿Qué vas a encontrar?**

- **Endurecimiento de identidades y privilegios locales (IAM & RBAC):** Implementación técnica del Control de Acceso Basado en Roles (_Role-Based Access Control_ o RBAC), delimitación estricta de privilegios administrativos mediante `sudo`, fijación de políticas de caducidad con `chage`, permisos avanzados mediante Listas de Control de Acceso (_POSIX ACLs_) y activación de Autenticación Multifactor (_MFA_) con módulos PAM (_Pluggable Authentication Modules_).
- **Segmentación de tráfico y cortafuegos con estado:** Creación de subinterfaces virtuales con etiquetado VLAN (estándar IEEE 802.1Q), sincronización horaria mediante Network Time Protocol (_NTP_) y programación de directivas de filtrado con estado (_stateful filtering_) bajo la premisa de denegación por defecto (_Default Deny_) utilizando `nftables`.
- **Accesos remotos seguros, bastiones y túneles VPN:** Puesta en marcha de túneles criptográficos basados en el protocolo WireGuard, confinamiento estricto de subredes para personal externo y despliegue de servidores bastión (_Jump-boxes_) con directivas de salto seguro en OpenSSH.
- **Endurecimiento de sistemas operativos (_hardening_) y gestión de parches:** Cierre sistemático de puertos y servicios innecesarios mediante `systemctl` y `ss`, blindaje del demonio `sshd`, ajuste de directivas de seguridad en el núcleo (_kernel_) con `sysctl`, confinamiento de aplicaciones mediante perfiles AppArmor y automatización de actualizaciones críticas desatendidas.
- **Protección de aplicaciones, balanceo seguro y cifrado:** Despliegue de servidores proxy inversos en la DMZ con Nginx bajo terminación TLS 1.3, cifrado robusto de volúmenes de almacenamiento en reposo con LUKS (`cryptsetup`) y aplicación estricta del principio de mínimo privilegio en bases de datos relacionales PostgreSQL.
- **Arquitectura de copias de seguridad aisladas e inmutables:** Configuración de respaldos automatizados bajo el modelo de extracción (_Pull Backup_) en la Zona de Resiliencia, aseguramiento de inmutabilidad conforme a la regla 3-2-1-1-0 y ejecución periódica de protocolos de prueba de restauración con cero errores.

## **¿Para quién es?**

Este módulo posee un perfil eminentemente práctico, prescriptivo y técnico. Asume que el lector dispone de los esquemas de diseño elaborados en el módulo anterior (la Matriz de Flujos de Red, la Matriz de Asignación de Roles y el POA&M) y posee soltura para interactuar con la consola de comandos de Linux y editar archivos de configuración del sistema.

| Perfil de usuario                                                            | Nivel esperado            | Conocimientos previos recomendados                                                                                                                                                       |
| :--------------------------------------------------------------------------- | :------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Responsables de infraestructura y SysAdmins**                              | Intermedio - Principiante | Manejo de terminal Linux (`bash`), navegación por el árbol del sistema de archivos, edición de texto en consola (`nano` o `vim`) y comprensión de direccionamiento IPv4 y notación CIDR. |
| **Desarrolladores y líderes técnicos (DevOps/SecOps)**                       | Intermedio                | Comprensión del funcionamiento de servidores web (`Nginx`/`Apache`), motores de bases de datos relacionales (`PostgreSQL`), sesiones SSH y ciclo de vida del software.                   |
| **Estudiantes de ciberseguridad**                                            | Principiante - Avanzado   | Haber completado los módulos `01. UNDERSTAND`, `02. DISCOVER` y `03. DESIGN`. Disponer de los planos de arquitectura y la hoja de ruta de transición.                                    |
| _Perfiles recomendados y prerrequisitos técnicos para abordar el módulo 04._ |

:::subindex
title="Índice del módulo"
:::

## **Laboratorio interactivo — Escenario react-ui-os**

Para afianzar los conocimientos y destrezas de este módulo sin exponer a riesgo sistemas en producción, dispones de un escenario de simulación integrado en el navegador mediante nuestro entorno virtualizado react-ui-os.

:::group title="Escenario virtualizado: Migración y blindaje de infraestructura en react-ui-os" description="Entorno multi-nodo interactivo con simulación de zonas de red, terminal de comandos e inspector de estados"

- **Contexto del entorno** [default]: Iniciarás sesión en una topología funcional que emula la infraestructura previa a la transición: una red plana donde el servidor web público, el motor de base de datos PostgreSQL y el almacenamiento de respaldos conviven sin aislamiento, con la cuenta de superusuario (`root`) accesible por SSH, cuentas de exempleados activas y permisos abiertos.
- **Misión técnica** [required]: Utilizando la terminal interactiva, el editor de archivos de configuración y el inspector de topología, ejecutarás los hitos prioritarios del POA&M: aislar la subred de resiliencia (VLAN 40), sanear el directorio de cuentas aplicando la matriz RBAC, activar reglas de cortafuegos con `nftables` sin cortar el tráfico web en el puerto `TCP 443`, levantar el túnel WireGuard y asegurar el servicio SSH y PostgreSQL.
- **Habilidades en juego**: Gestión de permisos y módulos PAM en Linux, programación de reglas de cortafuegos con estado, manipulación de certificados TLS y llaves asimétricas, configuración de volúmenes cifrados LUKS, ejecución de procedimientos de reversión (_rollback_) ante contingencias y validación con escaneos de `nmap` y pruebas de conectividad con `ss` y `curl`.
- **Sistema de validación en vivo**: El motor evaluará en tiempo real la efectividad de las defensas (simulando ataques de fuerza bruta, intentos de inyección SQL mediante cuentas de servicio y tentativas de movimiento lateral entre subredes) verificando simultáneamente que los servicios comerciales permanezcan operativos.
  :::

> [!NOTE:Precaución con configuraciones de red]
> En el entorno de prácticas, al igual que en un servidor de producción, si aplicas una regla de cortafuegos con política de descarte (_DROP ALL_) o reinicias el servicio SSH sin haber autorizado previamente tu canal de gestión en la VLAN administrativa, perderás la conexión de red y deberás recurrir a la consola de emergencia para ejecutar el plan de reversión.

## **Cómo abordar este módulo**

:::steps

### 1. Utilizar las matrices del Módulo 3 como hoja de ruta

Mantén abiertas las matrices de diseño construidas previamente: la Matriz de Flujos Autorizados (sección 3.2), la Matriz RBAC (sección 3.3), las mitigaciones del modelado STRIDE (sección 3.5) y el cronograma del POA&M (sección 3.6). Cada comando ejecutado en este módulo responde directamente a una exigencia de esos documentos; evita aplicar configuraciones sin comprender qué requerimiento arquitectónico resuelven.

### 2. Respetar el ciclo de Respaldo → Implementación → Verificación

Antes de modificar archivos esenciales del sistema (tales como `/etc/ssh/sshd_config`, `/etc/sudoers` o `/etc/nftables.conf`), crea siempre una copia de seguridad con extensión `.bak` y mantén una segunda consola abierta con privilegios administrativos activos. Esto garantiza la capacidad de revertir cualquier fallo sintáctico en segundos sin provocar caídas del servicio.

### 3. Ejecutar pruebas en ambos sentidos (positivas y negativas)

No des por concluida una tarea únicamente porque el servicio reinició sin arrojar advertencias. Realiza la prueba positiva (confirmar que el usuario o servicio legítimo opera normalmente) y la prueba negativa (intentar vulnerar el control desde una cuenta o subred no autorizada para comprobar que el intento es rechazado y registrado en la bitácora).
:::

## 4.1. Identidades, Cuentas y PAM <!-- id: endurecimiento-identidades-iam, icon: LockKeyIcon, displayTitle: 04.1 — Identidades, Cuentas y PAM, description: Matriz RBAC, separación administrativa, módulo PAM, MFA con TOTP y bloqueo por inactividad. -->

Esta subsección aborda y resuelve el problema de las cuentas huérfanas, los permisos acumulados sin control, el uso cotidiano de credenciales con privilegios máximos y la fragilidad de las contraseñas estáticas. Traduce la Matriz de Asignación de Roles (_RBAC_) y los hitos del Plan de Acción e Hitos (POA&M) en directivas operativas aplicables sobre el sistema operativo, los módulos de autenticación y los servicios de identidad.

### Introducción operativa y contexto de riesgo

Para entender cómo un sistema operativo resguarda sus recursos, podemos imaginar una empresa donde las oficinas cuentan con cerraduras y llaves diferenciadas. En el entorno digital, el sistema operativo implementa un principio similar: cada persona, servicio o proceso que interactúa con el servidor recibe un identificador numérico interno invisible denominado Identificador de Usuario (_UID_, del inglés _User Identifier_) y uno o varios Identificadores de Grupo (_GID_, del inglés _Group Identifier_). Cuando un proceso solicita leer, escribir o ejecutar un archivo, el núcleo (_kernel_) compara su UID y GID contra los permisos asignados a ese recurso para autorizar o denegar la solicitud.

En la operativa cotidiana de muchas pequeñas y medianas empresas, la comodidad y la falta de protocolos de administración provocan desvíos graves: administradores que inician sesión a diario utilizando directamente la cuenta de superusuario (`root`), credenciales compartidas genéricas (como `soporte` o `ventas`) y cuentas de exempleados que continúan activas meses después de su partida. Para un atacante, estas deficiencias representan el camino de menor resistencia: no requiere desarrollar herramientas complejas ni vulnerar cortafuegos si puede autenticarse con una credencial legítima en desuso para obtener privilegios administrativos pasando inadvertido ante las alarmas de seguridad.

> [!NOTE:Límite de alcance de la subsección]
> Este capítulo se concentra en el aseguramiento de cuentas locales, la estructuración de permisos en el sistema de archivos, el control de privilegios mediante `sudo` y módulos PAM, y la centralización básica de identidades. El endurecimiento específico de la conectividad remota de OpenSSH (`/etc/ssh/sshd_config`) y el acceso por redes privadas virtuales se desarrollan en las secciones 4.3 y 4.4.

### 4.1.1. Higiene del ciclo de vida de cuentas y neutralización de cuentas predeterminadas

En sistemas tipo Unix y Linux, la información de usuarios se organiza en archivos planos de texto bajo el directorio `/etc/`. El archivo `/etc/passwd` contiene el listado público del sistema: nombres de cuenta, UID, GID, directorio de inicio (_home_) y el intérprete de comandos asignado (_shell_). El archivo `/etc/shadow`, accesible exclusivamente por el superusuario, almacena de forma segura los resúmenes criptográficos (_hashes_) de las contraseñas y los parámetros temporales de caducidad. Por último, `/etc/group` define los grupos lógicos y sus integrantes.

Al iniciar el aseguramiento de un servidor, el primer paso consiste en auditar las cuentas existentes para contrastarlas con el inventario formal de la organización.

:::steps

### 1. Auditoría de cuentas con intérprete interactivo válido

Ejecuta en la terminal el siguiente comando para filtrar aquellas cuentas que posean una consola interactiva asignada, descartando los servicios del sistema que operan en segundo plano:

```bash:terminal
grep -E "/bin/(bash|sh|zsh)" /etc/passwd
```

```text:salida-terminal
root:x:0:0:root:/root:/bin/bash
adm_seguridad:x:1000:1000:Administrador:/home/adm_seguridad:/bin/bash
juan.perez:x:1001:1001:Finanzas:/home/juan.perez:/bin/bash
maria.gomez:x:1002:1002:Ventas:/home/maria.gomez:/bin/bash
```

Resultado esperado: Una lista breve y controlada que refleje exclusivamente a los usuarios humanos y administradores autorizados. Cualquier cuenta no reconocida debe catalogarse de inmediato para su desactivación.

### 2. Detección de cuentas ocultas con UID 0

Cualquier cuenta que posea el identificador numérico `0` comparte exactamente los mismos privilegios totales del superusuario `root`, sin importar el nombre que tenga asignado. Comprueba que no existan identidades secundarias con UID 0 ejecutando:

```bash:terminal
awk -F: '($3 == "0") {print $1, $3}' /etc/passwd
```

```text:salida-terminal
root 0
```

Resultado esperado: Debe retornar única y exclusivamente la línea correspondiente a `root`. Si se detecta cualquier otro usuario con UID 0, indica un compromiso previo del sistema o una mala práctica de administración que debe remediarse de inmediato.

### 3. Revisión de actividad reciente con last y lastlog

Examina las fechas del último inicio de sesión de cada cuenta registrada en el sistema para detectar cuentas inactivas o conexiones en horarios fuera de la ventana habitual:

```bash:terminal
sudo lastlog -b 45
```

Resultado esperado: Identificar aquellas cuentas que no hayan registrado actividad durante los últimos 45 días continuos para proceder a su bloqueo preventivo conforme a la Salvaguarda 5.3 de CIS Controls.
:::

#### Ejecución de bajas (_Leaver_) y bloqueo de cuentas huérfanas

Cuando un colaborador se desvincula de la organización, se presenta el dilema técnico entre suprimir el usuario mediante `userdel` o inhabilitarlo conservando sus metadatos. Borrar la cuenta elimina su UID, lo que genera archivos huérfanos que podrían ser reclamados si en el futuro se crea un nuevo usuario que herede ese mismo número. La buena práctica técnica prescribe deshabilitar la cuenta preservando su registro para conservar la cadena de custodia en auditorías forenses.

:::steps

### 1. Bloqueo de contraseña y expiración inmediata de la cuenta

Aplica las siguientes instrucciones para invalidar la contraseña en `/etc/shadow` y forzar el vencimiento inmediato de la cuenta:

```bash:terminal
# Bloquear la contraseña asignando un hash no resoluble
sudo passwd -l nombre_usuario

# Forzar la fecha de caducidad de la cuenta al inicio de la época Unix (1 de enero de 1970)
sudo usermod -L -e 1 nombre_usuario
```

### 2. Invalidación de la consola interactiva

Modifica el intérprete de comandos asignado al usuario, reemplazándolo por una utilidad nula que impida cualquier intento de sesión interactiva por terminal o túnel seguro:

```bash:terminal
sudo usermod -s /usr/sbin/nologin nombre_usuario
```

:::

#### Aprovisionamiento seguro para terceros y cuentas de servicio

Las cuentas concedidas a consultores externos o proveedores de soporte no deben crearse con vigencia indeterminada. Deben configurarse desde su origen con una fecha de caducidad automática vinculada al contrato de servicio:

```bash:terminal
# Crear usuario con fecha de caducidad predefinida al 31 de diciembre de 2026
sudo useradd -m -s /bin/bash -e 2026-12-31 ext_proveedor
```

Para auditar y fijar plazos de inactividad obligatorios tras los cuales el sistema operativo inhabilite la cuenta si el usuario no se conecta (cumpliendo la salvaguarda de inactividad de 45 días), se utiliza la herramienta `chage`:

```bash:terminal
# Consultar parámetros vigentes de la cuenta
sudo chage -l ext_proveedor

# Fijar inhabilitación tras 45 días de inactividad y fecha límite de expiración
sudo chage -I 45 -E 2026-12-31 ext_proveedor
```

El parámetro `-I 45` (_inactive_) instruye al sistema para que bloquee de forma permanente la contraseña de la cuenta si transcurren 45 días consecutivos sin que el usuario inicie sesión.

Por su parte, las cuentas de servicio —empleadas por demonios, aplicaciones web o motores de base de datos para ejecutar tareas en segundo plano— deben crearse como cuentas de sistema (_system users_), sin directorio personal asignado y sin acceso a intérpretes interactivos:

```bash:terminal
# Crear cuenta de servicio de sistema sin shell ni directorio interactivo
sudo useradd -r -s /usr/sbin/nologin svc_erp
```

### 4.1.2. Implementación técnica de la Matriz RBAC en el sistema de archivos

En los sistemas operativos estándar, los permisos de archivos y directorios se estructuran en tres niveles: Propietario (`u` / _user_), Grupo asignado (`g` / _group_) y Otros (`o` / _others_), con permisos de Lectura (`r`), Escritura (`w`) y Ejecución (`x`), expresados frecuentemente en notación octal (por ejemplo, `750`).

No obstante, cuando distintos departamentos requieren interactuar sobre un mismo árbol de directorios con privilegios asimétricos (por ejemplo, el área comercial con acceso total y el área contable con acceso de solo lectura), los permisos tradicionales resultan insuficientes. Para solucionar este requisito sin comprometer la seguridad, se combinan permisos especiales con Listas de Control de Acceso (_POSIX ACLs_).

:::steps

### 1. Creación de grupos funcionales y asignación de usuarios

Crea los grupos que representan los roles de negocio definidos en la Matriz RBAC del Módulo 3 y vincula a los usuarios correspondientes:

```bash:terminal
# Crear grupos funcionales
sudo groupadd rol_finanzas
sudo groupadd rol_ventas

# Incorporar usuarios a sus respectivos grupos
sudo usermod -aG rol_finanzas juan.perez
sudo usermod -aG rol_ventas maria.gomez
```

### 2. Configuración de directorios departamentales con bit SGID

Para que cualquier archivo generado dentro de una carpeta compartida herede automáticamente el grupo propietario de dicha carpeta (en lugar del grupo primario del usuario que lo creó), se activa el permiso especial SGID (_Set Group ID_, bit octal 2000):

```bash:terminal
# Crear la estructura de directorios
sudo mkdir -p /srv/datos/finanzas /srv/datos/crm

# Asignar propiedad a las cuentas administrativas y a los grupos de área
sudo chown root:rol_finanzas /srv/datos/finanzas
sudo chown root:rol_ventas /srv/datos/crm

# Aplicar permisos 2770 (rwxrws---)
sudo chmod 2770 /srv/datos/finanzas
sudo chmod 2770 /srv/datos/crm
```

El dígito `2` inicial activa el bit SGID; los dígitos `770` otorgan control total al propietario y al grupo asignado, cerrando por completo cualquier acceso al resto de usuarios del sistema (`0` final).

### 3. Asignación de permisos granulares mediante POSIX ACLs

Supongamos el caso en que el rol de Finanzas requiere consultar la información comercial de `/srv/datos/crm` sin tener autorización para modificar ni borrar archivos, mientras que el rol de Ventas conserva control total. Esto se implementa mediante utilidades de listas de control de acceso:

```bash:terminal
# Otorgar acceso de lectura y ejecución al grupo de finanzas sobre el directorio
sudo setfacl -m g:rol_finanzas:rx /srv/datos/crm

# Definir permisos por defecto para que los nuevos archivos creados en el futuro hereden esta regla
sudo setfacl -d -m g:rol_finanzas:rx /srv/datos/crm
sudo setfacl -d -m g:rol_ventas:rwx /srv/datos/crm
```

### 4. Verificación de permisos vigentes con getfacl

Comprueba la asignación de permisos extendidos ejecutando:

```bash:terminal
getfacl /srv/datos/crm
```

```text:salida-terminal
# file: srv/datos/crm
# owner: root
# group: rol_ventas
# flags: -s-
user::rwx
group::rwx
group:rol_finanzas:r-x
mask::rwx
other::---
default:user::rwx
default:group::rwx
default:group:rol_finanzas:r-x
default:group:rol_ventas:rwx
default:mask::rwx
default:other::---
```

:::

### 4.1.3. Gestión de Acceso Privilegiado (PAM básico), sudo y Cuentas de Emergencia

La elevación controlada de privilegios permite que un operador técnico realice tareas administrativas específicas sin permanecer conectado de forma continua como superusuario. La utilidad `sudo` (_SuperUser DO_) actúa como pasarela de control: consulta el archivo de políticas `/etc/sudoers`, valida la identidad del operador y registra cada instrucción ejecutada en la bitácora de auditoría del sistema.

#### Separación de cuentas cotidianas y administrativas

La directiva central de la higiene de accesos establece que ningún operador debe realizar tareas ordinarias utilizando credenciales con privilegios elevados. Cada integrante del equipo técnico debe disponer de dos identidades nominales independientes: una cuenta estándar para sus actividades diarias y una cuenta administrativa dedicada (por ejemplo, `adm_jperez`).

:::steps

### 1. Creación de la cuenta administrativa dedicada

Crea la cuenta nominal de gestión técnica separada del usuario diario:

```bash:terminal
sudo useradd -m -s /bin/bash adm_jperez
sudo passwd adm_jperez
```

### 2. Revocación de privilegios administrativos en la cuenta ordinaria

Retira la cuenta de uso diario del usuario del grupo con capacidad de elevación (`sudo` o `wheel`):

```bash:terminal
sudo gpasswd -d jperez sudo
```

:::

#### Configuración segura y modular de /etc/sudoers

Para prevenir errores de sintaxis que puedan bloquear el acceso administrativo al sistema, las modificaciones sobre las directivas de elevación deben realizarse exclusivamente a través de la herramienta `visudo`, la cual valida la integridad del archivo antes de aplicar los cambios en disco.

> [!WARNING:Respaldo previo y edición mediante visudo]
> Antes de alterar las directivas de elevación de privilegios, respalda el archivo maestro ejecutando `sudo cp /etc/sudoers /etc/sudoers.bak` y mantén una segunda consola activa con privilegios de superusuario para revertir cualquier contingencia antes de desconectarte.

Se recomienda estructurar las directivas en archivos modulares dentro del directorio `/etc/sudoers.d/`, como por ejemplo `/etc/sudoers.d/administradores`:

```text:/etc/sudoers.d/administradores
# Configuración granular de privilegios administrativos para lilium
Defaults logfile="/var/log/sudo.log"
Defaults timestamp_timeout=5
adm_jperez ALL=(ALL:ALL) ALL
```

La directiva `logfile="/var/log/sudo.log"` centraliza el registro de instrucciones ejecutadas con privilegios en un archivo de auditoría específico. Por su parte, `timestamp_timeout=5` limita a 5 minutos el período de gracia durante el cual la consola recuerda la contraseña ingresada, exigiendo que el operador vuelva a autenticarse ante cualquier inactividad prolongada.

#### Neutralización de root y aprovisionamiento de cuenta de emergencia (_Break-glass_)

Una vez comprobado que la cuenta administrativa dedicada opera de manera fluida a través de `sudo`, se bloquea la contraseña local de la cuenta `root` para impedir accesos directos por consola:

```bash:terminal
# Bloquear la contraseña de root
sudo passwd -l root
```

Adicionalmente, se genera una cuenta local de contingencia (_break-glass account_, como `breakglass_admin`) protegida por una frase de paso de alta complejidad, dividida y resguardada físicamente bajo custodia segura. Esta cuenta garantiza la capacidad de recuperar el acceso a la máquina si se presenta una caída general de los servicios centrales de directorio o de red.

### 4.1.4. Endurecimiento de Autenticación Local: Políticas de Contraseñas y Bloqueo (Linux PAM)

Los Módulos de Autenticación Conectables (_Pluggable Authentication Modules_ o PAM) constituyen la arquitectura modular estándar en sistemas tipo Unix y Linux. Actúan como una capa intermedia que permite a los servicios del sistema operativo (acceso local, SSH o aplicaciones) delegar la verificación de credenciales en directivas configurables sin alterar el código fuente de los programas.

#### Aplicación de estándares de complejidad mediante pam_pwquality

Para prevenir la selección de contraseñas cortas o predecibles, se implementa el módulo de calidad de claves `pam_pwquality`.

:::steps

### 1. Instalación del módulo pam_pwquality

Instala el paquete correspondiente en el sistema operativo:

```bash:terminal
sudo apt update && sudo apt install libpam-pwquality -y
```

### 2. Configuración de directivas estrictas en pwquality.conf

Edita el archivo `/etc/security/pwquality.conf` para fijar los umbrales de seguridad acordados:

```ini:/etc/security/pwquality.conf
# Directivas de complejidad de contraseñas en lilium
minlen = 14
dcredit = -1
ucredit = -1
ocredit = -1
lcredit = -1
difok = 3
```

Los parámetros exigen una longitud mínima de 14 caracteres (`minlen`), la presencia obligatoria de al menos un dígito numérico (`dcredit = -1`), una letra mayúscula (`ucredit = -1`), un carácter especial (`ocredit = -1`) y una letra minúscula (`lcredit = -1`). El valor `difok = 3` obliga a que al menos 3 caracteres difieran respecto a la contraseña anterior.
:::

#### Protección contra fuerza bruta local mediante pam_faillock

Para contener ataques de prueba y error automatizados en terminales locales, se activa el módulo de bloqueo temporal `pam_faillock` configurando el archivo `/etc/security/faillock.conf`:

```ini:/etc/security/faillock.conf
# Bloqueo temporal por intentos fallidos consecutivos
deny = 5
unlock_time = 900
fail_interval = 900
even_deny_root
```

Esta directiva bloquea el acceso durante 15 minutos (`unlock_time = 900` segundos) si se registran 5 intentos erróneos (`deny = 5`) dentro de una ventana de 15 minutos (`fail_interval = 900`). Si un usuario legítimo se bloquea accidentalmente, el administrador puede auditar el contador y rehabilitarlo mediante los comandos:

```bash:terminal
# Consultar fallos registrados en la cuenta
sudo faillock --user nombre_usuario

# Restablecer el contador y desbloquear la cuenta
sudo faillock --user nombre_usuario --reset
```

#### Control de sesiones inactivas en terminal

Para garantizar el cierre automático de sesiones de consola abandonadas, se crea un script de perfil global en `/etc/profile.d/timeout.sh`:

```bash:terminal
# Configurar tiempo de desconexión por inactividad a 15 minutos (900 segundos)
sudo tee /etc/profile.d/timeout.sh << 'EOF'
TMOUT=900
readonly TMOUT
export TMOUT
EOF
sudo chmod +x /etc/profile.d/timeout.sh
```

### 4.1.5. Implementación de Autenticación Multifactor (MFA) y Centralización de Identidades

El uso de contraseñas estáticas, aun cuando cumplan estándares de longitud y complejidad, resulta insuficiente frente a ataques de ingeniería social o filtraciones externas. La Autenticación Multifactor (_MFA_) exige combinar un factor de conocimiento (la contraseña del usuario) con un factor de posesión dinámico (un generador de códigos en un dispositivo móvil del usuario).

Técnicamente, este control se fundamenta en el algoritmo de Contraseñas de Un Solo Uso Basadas en el Tiempo (_Time-based One-Time Password_ o TOTP, formalizado en el RFC 6238). Consiste en una semilla criptográfica compartida entre el servidor y la aplicación del usuario que, combinada con la hora actual sincronizada, genera un código numérico efímero de 6 dígitos con 30 segundos de vigencia.

#### Implementación de MFA en consola Linux mediante libpam-google-authenticator

:::steps

### 1. Instalación del módulo PAM TOTP

Instala el paquete en el sistema operativo:

```bash:terminal
sudo apt install libpam-google-authenticator -y
```

### 2. Enrolamiento interactivo individual del usuario

Cada usuario con privilegios ejecuta el comando de aprovisionamiento en su propia consola:

```bash:terminal
google-authenticator -t -d -f -r 3 -R 30 -w 3
```

El parámetro `-t` fija la generación basada en tiempo; `-d` desactiva la reutilización inmediata del mismo código para prevenir ataques de repetición; `-f` guarda la configuración en el directorio del usuario; `-r 3 -R 30` establece una limitación de tasa (_rate limit_) permitiendo un máximo de 3 intentos cada 30 segundos; y `-w 3` admite una ventana de tolerancia de hasta 3 intervalos de tiempo adyacentes para amortiguar desincronizaciones horarias menores.

### 3. Integración en la cadena de autenticación PAM

Edita el archivo de configuración correspondiente (por ejemplo, `/etc/pam.d/common-auth`) para exigir la validación del código temporal junto con la credencial del usuario:

```text:/etc/pam.d/common-auth
# Exigir módulo TOTP en la cadena de autenticación
auth required pam_google_authenticator.so nullok
```

:::

#### Arquitectura de centralización: Soluciones abiertas frente a comerciales

A medida que el entorno tecnológico de la organización crece, administrar usuarios de forma individual en cada servidor se vuelve ineficiente y propenso a desajustes. La gestión de identidades debe centralizarse mediante un Proveedor de Identidad (_Identity Provider_ o IdP):

- **Soluciones abiertas autohospedadas:** Plataformas como Keycloak o Authentik permiten implementar servicios de autenticación federada mediante contenedores livianos con Docker Compose. Brindan inicio de sesión único (_Single Sign-On_ o SSO) mediante protocolos estándar como OpenID Connect (_OIDC_) o SAML 2.0 y gestión de doble factor. Para la custodia compartida de credenciales y secretos de equipo se implementa Vaultwarden.
- **Servicios comerciales en la nube:** Soluciones como Microsoft Entra ID o Google Workspace permiten unificar la gestión de identidades con el servicio de correo corporativo, reduciendo la carga operativa de mantenimiento a cambio de costos recurrentes de licenciamiento por usuario.

### Verificación de la Subsección

Para certificar con evidencia técnica que los controles de identidad operan según lo proyectado, ejecuta el siguiente protocolo de pruebas:

1. **Verificación de inhabilitación y caducidad de cuentas (T-02):**
   - _Procedimiento:_ Examina `/etc/shadow` para comprobar que la cuenta tratada presente caracteres de bloqueo (`!` o `!!`) en el campo de contraseña. Consulta sus parámetros con `sudo chage -l ext_proveedor` e intenta autenticarte con dicho usuario.
   - _Resultado esperado:_ El sistema rechaza el intento de autenticación y registra la negativa en `/var/log/auth.log`.
2. **Verificación de la Matriz RBAC y Listas de Control de Acceso (T-06):**
   - _Prueba Positiva:_ Inicia sesión con el usuario de ventas (`su - maria.gomez`), crea un archivo en `/srv/datos/crm` y verifica con `ls -l` y `getfacl` que el recurso hereda la propiedad del grupo `rol_ventas`.
   - _Prueba Negativa (Separación horizontal):_ Con la misma sesión de `maria.gomez`, intenta listar o leer `/srv/datos/finanzas` (`ls /srv/datos/finanzas`). El sistema debe denegar el acceso con el mensaje `Permission denied`.
   - _Prueba de Lectura Cruzada:_ Inicia sesión con el usuario de finanzas (`su - juan.perez`), accede a un documento en `/srv/datos/crm` con `cat` confirmando que la lectura es exitosa, e intenta modificarlo para constatar que el sistema rechaza la escritura.
3. **Verificación de separación administrativa (sudo):**
   - _Procedimiento:_ Intenta ejecutar un comando privilegiado (`sudo apt update`) desde la cuenta cotidiana `jperez`.
   - _Resultado esperado:_ El sistema rechaza la elevación e informa el intento en `/var/log/sudo.log`. A continuación, ejecuta la misma instrucción desde la cuenta dedicada `adm_jperez` verificando la correcta autorización y el registro de la traza de auditoría.
4. **Verificación de directivas de complejidad y bloqueo PAM (T-03):**
   - _Procedimiento:_ Intenta asignar a una cuenta una contraseña de menos de 14 caracteres o sin caracteres especiales para constatar el rechazo de `pam_pwquality`. Simula 5 accesos fallidos consecutivos para verificar el bloqueo en `faillock` y comprueba la exigencia del token TOTP al autenticarte.
5. **Procedimiento de reversión (_rollback_):**
   - Ante cualquier desajuste o bloqueo involuntario en las directivas de `sudo` o PAM, utiliza la segunda terminal administrativa de emergencia abierta para restablecer los archivos de respaldo: `sudo cp /etc/sudoers.bak /etc/sudoers` o restaurar las configuraciones en `/etc/pam.d/`, reanudando el funcionamiento normal de forma inmediata.

## 4.2. Segmentación VLAN y Cortafuegos <!-- id: filtrado-red-cortafuegos, icon: NetworkIcon, displayTitle: 04.2 — Segmentación VLAN y Cortafuegos, description: Interfaces etiquetadas IEEE 802.1Q, sincronización horaria y reglas nftables con denegación por defecto. -->

Esta subsección aborda el problema de las redes planas, eliminando la capacidad de los dispositivos de comunicarse libremente sin control y neutralizando las tentativas de movimiento lateral de un atacante. Traduce la Matriz de Flujos de Red y las zonas de seguridad diseñadas en la sección 3.2 mediante el etiquetado de interfaces VLAN y la programación de reglas de filtrado con estado en `nftables`.

### Introducción operativa y contexto de riesgo

Para visualizar la circulación de datos en una empresa, imaginemos una red local (_LAN_) como un edificio donde todas las oficinas tienen sus puertas abiertas y conectadas al mismo pasillo. En el nivel técnico, los dispositivos operan en dos niveles principales: la Capa 2 del modelo OSI (enlace de datos mediante direcciones MAC, donde las tramas se difunden a todos los equipos conectados al mismo conmutador) y la Capa 3 (red lógica mediante direcciones IP, donde los paquetes se enrutan entre subredes). Cuando una organización conecta sus servidores, estaciones de trabajo e impresoras en un único segmento compartido de Capa 2, cualquier equipo infectado puede comunicarse directamente con los demás sin pasar por ningún filtro de inspección.

El peligro crítico de una red plana radica en que anula la eficacia de las defensas internas. Si un adversario compromete una estación de trabajo mediante un correo electrónico malicioso, el tráfico Este-Oeste no regulado le permite escanear la red local, localizar servidores de bases de datos y saltar entre equipos sin oposición. Para contener esta amenaza, este bloque convierte las especificaciones de diseño en directivas de segmentación lógica y cortafuegos con estado.

> [!NOTE:Límite de alcance de la subsección]
> Este capítulo se enfoca en el etiquetado de interfaces virtuales, los servicios base de red, la puesta en marcha de cortafuegos con estado y la codificación de la Matriz de Flujos de Red. La configuración de túneles VPN y servidores bastión se cubre en la sección 4.3, mientras que los sensores de monitoreo de intrusiones se abordan en el Módulo 05 (05. DETECT).

### 4.2.1. Configuración de interfaces virtuales y etiquetado VLAN (IEEE 802.1Q)

Para aislar segmentos de red sobre una infraestructura de cableado compartida, la tecnología estándar de la industria es la VLAN (_Virtual Local Area Network_ / Red de Área Local Virtual). Las VLANs utilizan el estándar internacional IEEE 802.1Q para insertar una etiqueta numérica de 4 bytes en las tramas Ethernet transmitidas por un enlace troncal (_trunk_), permitiendo que múltiples redes virtuales coexistan en el mismo equipamiento físico sin que el tráfico de una subred sea visible para las demás en la Capa 2.

#### Implementación técnica en Linux con Netplan

En servidores que actúan como enrutadores internos o cortafuegos perimetrales bajo distribuciones Linux modernas (como Ubuntu Server o Debian), la definición de interfaces virtuales se gestiona mediante el subsistema Netplan.

:::steps

### 1. Respaldo y edición del archivo de configuración de red

Genera una copia de seguridad del archivo YAML en `/etc/netplan/` y procede a su edición:

```bash:terminal
sudo cp /etc/netplan/01-netcfg.yaml /etc/netplan/01-netcfg.yaml.bak
sudo nano /etc/netplan/01-netcfg.yaml
```

### 2. Definición de subinterfaces virtuales y direccionamiento estático

Configura la interfaz de red física principal (por ejemplo, `eth0`) para declarar las subinterfaces etiquetadas correspondientes a las zonas definidas en el diseño del Módulo 3:

```yaml:/etc/netplan/01-netcfg.yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    eth0:
      dhcp4: no
  vlans:
    eth0.10:
      id: 10
      link: eth0
      addresses: [10.10.10.1/28]
    eth0.20:
      id: 20
      link: eth0
      addresses: [10.10.20.1/24]
    eth0.30:
      id: 30
      link: eth0
      addresses: [10.10.30.1/28]
    eth0.40:
      id: 40
      link: eth0
      addresses: [10.10.40.1/28]
```

Esta configuración segmenta la tarjeta `eth0` en cuatro interfaces virtuales: `eth0.10` para la DMZ (`10.10.10.0/28`), `eth0.20` para la red de usuarios (`10.10.20.0/24`), `eth0.30` para la Zona Restringida (`10.10.30.0/28`) y `eth0.40` para la Zona de Resiliencia y respaldos (`10.10.40.0/28`).

### 3. Validación y aplicación segura de la configuración

Aplica los cambios utilizando el mecanismo de prueba asistida de Netplan, el cual revierte automáticamente la configuración si el operador no confirma la estabilidad dentro de una ventana de tiempo:

```bash:terminal
sudo netplan try
```

:::

#### Verificación matemática de subredes mediante ipcalc

Antes de programar las reglas de filtrado, es indispensable corroborar que los rangos de direcciones asignados a cada VLAN no se solapen y cubran la cantidad prevista de equipos. La utilidad `ipcalc` permite desglosar los límites de cada bloque en notación CIDR (_Classless Inter-Domain Routing_):

```bash:terminal
ipcalc 10.10.20.0/24
```

```text:salida-terminal
Address:   10.10.20.0          00001010.00001010.00010100. 00000000
Netmask:   255.255.255.0 = 24  11111111.11111111.11111111. 00000000
Wildcard:  0.0.0.255           00000000.00000000.00000000. 11111111
=>
Network:   10.10.20.0/24       00001010.00001010.00010100. 00000000
HostMin:   10.10.20.1          00001010.00001010.00010100. 00000001
HostMax:   10.10.20.254        00001010.00001010.00010100. 11111110
Broadcast: 10.10.20.255        00001010.00001010.00010100. 11111111
Hosts/Net: 254                 (rango utilizable para equipos de usuario)
```

### 4.2.2. Configuración de servicios base de infraestructura como prerrequisito de red

Antes de establecer reglas estrictas en el cortafuegos, es necesario asegurar los servicios esenciales de soporte de red. Si estos componentes fallan o quedan aislados por error, los equipos segmentados perderán la sincronización horaria o la capacidad de resolver nombres de dominio.

#### Sincronización horaria obligatoria (NTP)

Para que los eventos registrados en las distintas subredes tengan marcas de tiempo coherentes durante una auditoría o investigación de incidentes, se configura el servicio de sincronización horaria mediante `chrony` o `timedatectl`:

:::steps

### 1. Configuración del huso horario y activación de NTP

Ajusta la zona horaria del sistema a UTC y activa el protocolo de tiempo de red:

```bash:terminal
sudo timedatectl set-timezone UTC
sudo timedatectl set-ntp on
```

### 2. Verificación de fuentes horarias de referencia con chrony

Comprueba que el demonio mantenga comunicación activa con los servidores de referencia:

```bash:terminal
chronyc sources -v
```

```text:salida-terminal
  .-- Source mode  '^' = server, '=' = peer, '#' = local clock.
 / .- Source state '*' = current best, '+' = combined, '-' = not combined,
| /             'x' = may be in error, '~' = too variable
||                                                 Last rx   Stratum Poll Reach LastRx Last sample
===============================================================================
^* time.cloudflare.com            3   6    77    23   -120us[ -180us] +/-   12ms
```

:::

#### Aislamiento y encaminamiento de servicios base (DNS y DHCP)

La asignación dinámica de direcciones IP (protocolo DHCP, puertos `UDP 67` y `68`) debe operar de manera independiente dentro de cada VLAN para que los equipos adquieran la configuración de red que les corresponde. A su vez, para evitar que software malicioso consulte resolvedores arbitrarios para evadir controles o exfiltrar datos, el tráfico de resolución de nombres (protocolo DNS, puertos `TCP` y `UDP 53`) debe encaminarse exclusivamente hacia los servidores DNS internos autorizados, bloqueando las consultas directas hacia servidores públicos externos desde las subredes de trabajo.

### 4.2.3. Implementación de Cortafuegos con Estado (Stateful) y Denegación por Defecto (nftables)

La diferencia fundamental entre un cortafuegos clásico sin estado (_stateless_) y un cortafuegos moderno con estado (_stateful_) radica en su capacidad de memoria contextual. Un cortafuegos _stateful_ realiza un seguimiento continuo de las sesiones de comunicación (como el establecimiento de conexiones TCP o el intercambio de datagramas UDP). Cuando un equipo interno inicia una conexión legítima hacia el exterior, el cortafuegos registra la sesión y autoriza automáticamente los paquetes de respuesta correspondientes, descartando cualquier intento de conexión externa no solicitada.

#### Arquitectura del motor nftables y política Default Deny

En sistemas Linux actuales, el subsistema oficial para el filtrado de paquetes es `nftables`. Su estructura organiza las reglas en tablas lógicas compuestas por cadenas (_chains_) que evalúan el tráfico en momentos específicos: paquetes dirigidos al host local (`input`), paquetes originados en el host (`output`) y paquetes enrutados entre interfaces (`forward`).

Para aplicar el principio de defensa diseñado en el Módulo 3, las interfaces de red deben configurarse bajo la premisa de **Denegación por Defecto** (_Default Deny_ / política `drop`), lo que implica que todo paquete no autorizado expresamente por una regla será descartado y registrado.

:::steps

### 1. Respaldo de la configuración de filtrado previa

Genera una copia de seguridad del archivo maestro de reglas:

```bash:terminal
sudo cp /etc/nftables.conf /etc/nftables.conf.bak
```

### 2. Estructuración del conjunto de reglas base con política de descarte

Configura `/etc/nftables.conf` estableciendo políticas de descarte estricto en las cadenas `input` y `forward`:

```text:/etc/nftables.conf
#!/usr/sbin/nft -f

flush ruleset

table inet filter {
    chain input {
        type filter hook input priority 0; policy drop;

        # Permitir tráfico en la interfaz de bucle local
        iif "lo" accept

        # Permitir tráfico de conexiones establecidas o relacionadas
        ct state { established, related } accept

        # Permitir paquetes ICMP de diagnóstico controlados
        ip protocol icmp accept

        # Permitir administración local SSH únicamente desde la subred administrativa
        ip saddr 10.10.50.0/24 tcp dport 22 accept comment "SSH administrativo autorizado"
    }

    chain forward {
        type filter hook forward priority 0; policy drop;

        # Autorizar respuestas de conexiones ya establecidas
        ct state { established, related } accept
    }

    chain output {
        type filter hook output priority 0; policy accept;
    }
}
```

### 3. Validación de sintaxis y carga de reglas en el núcleo

Verifica la sintaxis del archivo antes de aplicarlo en el sistema operativo:

```bash:terminal
sudo nft -c -f /etc/nftables.conf && sudo nft -f /etc/nftables.conf
```

:::

### 4.2.4. Traducción de la Matriz de Flujos a reglas técnicas de filtrado

La traducción de la Matriz de Flujos diseñada en la sección 3.2 consiste en convertir las necesidades de negocio en tuplas técnicas de dirección origen, dirección destino, protocolo y puerto dentro de la cadena `forward` del cortafuegos.

#### 1. Flujo DMZ a Zona Restringida (F-02): Consulta a Base de Datos

Para permitir que el servidor proxy inverso en la DMZ (`10.10.10.10`) consulte al servidor de base de datos (`10.10.30.20`) exclusivamente en el puerto de PostgreSQL (`TCP 5432`), se incorpora la regla:

```text:reglas-nftables
# Flujo F-02: DMZ hacia motor de base de datos
ip saddr 10.10.10.10 ip daddr 10.10.30.20 tcp dport 5432 accept comment "Permitir proxy web a PostgreSQL"
```

#### 2. Bloqueo de Movimiento Lateral Este-Oeste (F-05): Estaciones hacia Servidores

Para mitigar la propagación interna de amenazas, se prohíbe que las estaciones de trabajo de los usuarios (`10.10.20.0/24`) inicien sesiones administrativas o de recursos compartidos sobre los servidores internos (`10.10.30.0/28`), registrando cualquier intento anómalo:

```text:reglas-nftables
# Flujo F-05: Bloqueo de servicios administrativos desde usuarios a servidores internos
ip saddr 10.10.20.0/24 ip daddr 10.10.30.0/28 tcp dport { 22, 3389, 445 } log prefix "BLOQUEO-MOV-LATERAL: " drop
```

#### 3. Protección Unidireccional de Respaldos (F-08): Producción a Zona de Resiliencia

Para evitar que un servidor de producción infectado por secuestro de datos (_ransomware_) comprometa las copias de seguridad alojadas en la Zona de Resiliencia (`10.10.40.10`), se prohíbe que los servidores inicien nuevas sesiones hacia el repositorio de respaldo:

```text:reglas-nftables
# Flujo F-08: Bloquear nuevas sesiones originadas en producción hacia resiliencia
ip saddr 10.10.30.0/28 ip daddr 10.10.40.10 ct state new drop comment "Bloquear nuevas sesiones hacia backups"
```

#### 4. Aislamiento Estricto de la Red de Invitados (F-10): Wi-Fi Visitantes

Para garantizar que los dispositivos en la red inalámbrica de invitados (`10.10.99.0/24`) únicamente naveguen hacia Internet sin alcanzar las direcciones privadas de la organización, se descarta cualquier paquete destinado a rangos RFC 1918:

```text:reglas-nftables
# Flujo F-10: Bloquear acceso de invitados a subredes corporativas privadas
ip saddr 10.10.99.0/24 ip daddr { 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16 } drop comment "Aislamiento total de red de invitados"
```

### Verificación de la Subsección

Para certificar con evidencia técnica que la segmentación de red y las reglas de filtrado operan correctamente, ejecuta el siguiente protocolo de validación:

1. **Verificación de interfaces VLAN e ipcalc:** Comprueba el dimensionamiento matemático de las subredes con `ipcalc` y valida que las interfaces virtuales se encuentren activas y asociadas a sus identificadores de etiqueta mediante `ip -d link show`.
2. **Validación de la Matriz de Flujos (Casos positivos y negativos):**
   - _Prueba Positiva (Flujo comercial permitido):_ Desde un equipo en la red de usuarios (VLAN 20), realiza una consulta web HTTPS hacia el proxy inverso en la DMZ (`curl -k https://10.10.10.10`), constatando una respuesta satisfactoria.
   - _Prueba Negativa (Bloqueo de movimiento lateral):_ Desde la misma estación de trabajo, intenta establecer una sesión SSH o RDP hacia un servidor en la Zona Restringida (`ssh 10.10.30.20`). Verifica que la conexión sea rechazada (`Connection timed out` o `Connection refused`) y que el evento quede asentado en la bitácora del cortafuegos (`sudo journalctl -k -g BLOQUEO-MOV-LATERAL`).
   - _Prueba Negativa (Aislamiento de red de invitados):_ Desde un dispositivo conectado a la VLAN 99, lanza pruebas de eco (`ping`) y escaneos hacia los servidores corporativos, constatando un descarte total de paquetes (100% _packet loss_).
3. **Procedimiento de reversión (_rollback_):**
   - Si una regla de filtrado errónea interrumpe la gestión administrativa legítima, accede mediante la consola física de emergencia y restaura la copia previa de las reglas:

```bash:terminal
sudo cp /etc/nftables.conf.bak /etc/nftables.conf && sudo nft -f /etc/nftables.conf
```

## 4.3. Acceso Remoto, Bastiones y VPN <!-- id: seguridad-acceso-remoto, icon: ServerIcon, displayTitle: 04.3 — Acceso Remoto, Bastiones y VPN, description: Túneles WireGuard, confinamiento de subredes, servidor bastión con ProxyJump y accesos Just-in-Time. -->

Esta subsección aborda el riesgo de la exposición directa de servicios de administración a redes públicas y el acceso remoto descontrolado hacia el entorno corporativo. Traduce las pautas de conectividad híbrida y acceso seguro diseñadas en el módulo previo en túneles VPN basados en WireGuard, confinamiento de subredes y servidores bastión con canales de salto obligatorio.

### Introducción operativa y contexto de riesgo

Para comprender la protección en accesos remotos, consideremos un edificio corporativo de alta seguridad. En el plano físico, las visitas externas no ingresan de forma directa a las áreas de trabajo; deben registrarse obligatoriamente en una garita de control perimetral donde se valida su identidad antes de escoltarlas al sector autorizado. En el entorno digital, una Red Privada Virtual (_Virtual Private Network_ o VPN) funciona como un túnel cifrado que transporta las comunicaciones del empleado a través de Internet de forma segura. Paralelamente, un servidor bastión (_Jump-box_) actúa como esa garita de seguridad técnica: un host reforzado y monitoreado que sirve como escala obligatoria para que los administradores gestionen servidores internos sin exponer las consolas directamente hacia redes externas.

El riesgo técnico crítico surge cuando una organización, buscando agilizar las tareas de soporte remoto, publica puertos de administración —como el Protocolo de Escritorio Remoto (_RDP_, puerto `TCP/UDP 3389`) o el Shell Seguro (_SSH_, puerto `TCP 22`)— directamente hacia Internet sin protección perimetral. Los motores de búsqueda automatizados rastrean de continuo el espacio de direccionamiento público y localizan estos puertos en minutos, haciéndolos blanco de ataques continuos de fuerza bruta, robo de credenciales y explotación de vulnerabilidades de desbordamiento (técnica catalogada en MITRE ATT&CK como _External Remote Services_ — T1133).

> [!NOTE:Límite de alcance de la subsección]
> Este capítulo se focaliza en el despliegue del túnel criptográfico WireGuard, el confinamiento de subredes remotas, la configuración de saltos en OpenSSH mediante `ProxyJump` y la gestión de accesos temporales para terceros. El aseguramiento interno del servicio `sshd` se trata en la sección 4.4, mientras que el análisis de eventos y detección de anomalías se aborda en el Módulo 05 (05. DETECT).

### 4.3.1. Despliegue de túneles criptográficos con WireGuard

Para conectar a los colaboradores remotos con la red corporativa sin arrastrar la complejidad técnica de protocolos heredados (como IPsec o OpenVPN clásico), se utiliza WireGuard. WireGuard es un protocolo de red privada virtual de alto rendimiento que opera en la Capa 3 del modelo OSI. Utiliza algoritmos criptográficos modernos de curva elíptica (como ChaCha20 para cifrado simétrico y Curve25519 para intercambio de claves) y posee una base de código compacta que facilita su auditoría técnica y mantenimiento.

:::steps

### 1. Instalación de paquetes y módulos de red

En el servidor Linux destinado a concentrador VPN, actualiza los repositorios e instala WireGuard:

```bash:terminal
sudo apt update && sudo apt install wireguard iptables -y
```

### 2. Habilitación del reenvío de paquetes en el núcleo

Para que el concentrador encamine el tráfico entre la interfaz virtual de la VPN y las subredes internas autorizadas, activa el reenvío de paquetes en `/etc/sysctl.d/99-wireguard.conf`:

```text:/etc/sysctl.d/99-wireguard.conf
# Habilitar reenvío de paquetes IPv4 para concentrador VPN
net.ipv4.ip_forward=1
```

Aplica los cambios en el núcleo en tiempo de ejecución:

```bash:terminal
sudo sysctl --system
```

### 3. Generación de claves asimétricas del servidor

WireGuard se fundamenta en pares de claves asimétricas públicas y privadas. Genera el par criptográfico del concentrador protegiendo los permisos de lectura:

```bash:terminal
sudo mkdir -p /etc/wireguard && cd /etc/wireguard
umask 077
wg genkey | tee server_private.key | wg pubkey > server_public.key
```

### 4. Redacción del archivo de configuración del concentrador VPN

Crea el archivo `/etc/wireguard/wg0.conf` definiendo la interfaz virtual, su direccionamiento en la subred VPN (`10.10.70.1/24`), el puerto de escucha UDP (`51820`) y las reglas de traducción de direcciones (_NAT_):

```ini:/etc/wireguard/wg0.conf
[Interface]
Address = 10.10.70.1/24
ListenPort = 51820
PrivateKey = <CONTENIDO_DE_server_private.key>
PostUp = iptables -A FORWARD -i %i -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i %i -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
```

Las instrucciones `PostUp` y `PostDown` aplican y retiran automáticamente las directivas necesarias en el cortafuegos local para encaminar el tráfico proveniente de la interfaz virtual hacia la red interna (`eth0`).

### 5. Generación de perfiles de cliente y división de túnel (_Split Tunneling_)

Para cada usuario o equipo autorizado se genera un par de claves y se redacta un archivo de configuración de cliente (por ejemplo, `client_comercial.conf`):

```ini:client_comercial.conf
[Interface]
PrivateKey = <CLAVE_PRIVADA_DEL_CLIENTE>
Address = 10.10.70.2/32
DNS = 10.10.30.1

[Peer]
PublicKey = <CONTENIDO_DE_server_public.key>
Endpoint = 203.0.113.50:51820
AllowedIPs = 10.10.20.0/24, 10.10.30.0/28
PersistentKeepalive = 25
```

La directiva `AllowedIPs = 10.10.20.0/24, 10.10.30.0/28` implementa un túnel dividido (_split tunnel_): el dispositivo remoto canaliza a través de la VPN exclusivamente el tráfico dirigido a las subredes corporativas internas autorizadas, permitiendo que la navegación web ordinaria del empleado continúe transitando por su proveedor de Internet doméstico sin sobrecargar los enlaces de la empresa.
:::

### 4.3.2. Confinamiento de subredes VPN y separación de perfiles

Conceder acceso remoto a un usuario mediante VPN no implica otorgarle conectividad irrestricta a toda la infraestructura. Si una estación de trabajo doméstica infectada se conecta al túnel sin barreras intermedias, el adversario adquiere un puente directo hacia los servidores del negocio.

El tráfico procedente del rango de clientes VPN (`10.10.70.0/24`) debe regirse por las mismas directivas estrictas de la Matriz de Flujos del Módulo 3. Mediante directivas de filtrado en el cortafuegos, se restringe a los clientes remotos para que alcancen únicamente los servicios específicos asignados a su rol (por ejemplo, el sistema de gestión CRM en el puerto `TCP 8080`), bloqueando cualquier intento de movimiento lateral hacia controladores de dominio, la zona de respaldos o estaciones de otros empleados.

### 4.3.3. Configuración y endurecimiento de un Servidor Bastión (Jump-box)

Un servidor bastión (_Jump-box_) es un host dedicado, aislado y auditado que reside en la subred de administración técnica (VLAN 50). Su función consiste en actuar como único punto de acceso autorizado para que el personal de informática realice labores de mantenimiento sobre los servidores internos de producción.

Para que los administradores no requieran conectar directamente desde sus equipos portátiles personales a las consolas de los servidores productivos (lo que expondría credenciales maestras y facilitaría accesos desde máquinas no controladas), se implementa el mecanismo de salto transparente mediante la directiva `ProxyJump` en la configuración SSH del cliente (`~/.ssh/config`):

```text:~/.ssh/config
# Definición del servidor bastión perimetral
Host bastion-it
    HostName 10.10.50.5
    User adm_jperez
    Port 2222
    IdentityFile ~/.ssh/id_ed25519_admin

# Acceso al servidor interno con salto obligatorio a través del bastión
Host servidor-erp
    HostName 10.10.30.15
    User adm_jperez
    ProxyJump bastion-it
    IdentityFile ~/.ssh/id_ed25519_admin
```

Al ejecutar `ssh servidor-erp`, el equipo del administrador establece primero una sesión autenticada con el bastión (`10.10.50.5`); desde esa sesión segura, el bastión encamina la conexión hacia el servidor productivo (`10.10.30.15`). Con este esquema, los servidores internos jamás reciben tráfico de administración originado directamente en estaciones de trabajo no auditadas o redes externas.

### 4.3.4. Políticas de acceso temporal (Just-in-Time) para terceros

Los consultores externos y proveedores de software que realizan tareas de mantenimiento puntual en los sistemas de la empresa representan un riesgo elevado si sus accesos permanecen habilitados de forma permanente (24/7). Conforme al Control CIS 15, la organización debe implementar el principio de acceso bajo demanda (_Just-in-Time_).

:::steps

### 1. Deshabilitación permanente por defecto

Las cuentas de usuario y los perfiles de WireGuard asignados a proveedores externos deben permanecer bloqueados (_locked_) de forma predeterminada en los servidores y concentradores VPN.

### 2. Activación temporal bajo demanda y fecha de expiración

Ante una ventana de mantenimiento programada y autorizada por la dirección técnica, el administrador activa puntualmente la cuenta del proveedor fijando una fecha límite automática:

```bash:terminal
# Desbloquear la cuenta del proveedor externo
sudo usermod -U ext_proveedor

# Fijar vencimiento automático para el 15 de noviembre de 2026
sudo chage -E 2026-11-15 ext_proveedor
```

### 3. Revocación automática post-mantenimiento

Al alcanzarse la fecha de vencimiento, el sistema operativo bloquea automáticamente la cuenta sin requerir intervenciones manuales ni recordatorios administrativos.
:::

### Verificación de la Subsección

Para certificar con evidencia técnica que los controles de acceso remoto y servidores bastión funcionan de forma segura, ejecuta los siguientes protocolos:

1. **Verificación del enlace WireGuard (`wg show`):** Conéctate desde una estación cliente autorizada y consulta en el servidor el estado del canal cifrado:

```bash:terminal
sudo wg show
```

```text:salida-terminal
interface: wg0
  public key: oP8qF1y...server_key=
  private key: (hidden)
  listening port: 51820

peer: aK9mX2z...client_key=
  endpoint: 198.51.100.25:48321
  allowed ips: 10.10.70.2/32
  latest handshake: 14 seconds ago
  transfer: 4.12 KiB received, 8.45 KiB sent
```

Resultado esperado: Confirmación de intercambio activo de paquetes (_latest handshake_ reciente), verificación de la llave pública del cliente y asignación correcta de la IP interna en la subred de la VPN.

2. **Verificación de confinamiento de clientes remotos:**
   - _Prueba Positiva:_ Desde el cliente VPN conectado, verifica la conectividad hacia los servidores y puertos expresamente permitidos para su rol.
   - _Prueba Negativa:_ Intenta acceder desde el mismo enlace a subredes restringidas (como la Zona de Resiliencia VLAN 40), comprobando que el cortafuegos bloquea el intento arrojando un error de tiempo de espera (`Connection timed out`).
3. **Verificación de servidor bastión y ProxyJump:** Intenta conectar por SSH directamente a un servidor interno desde una red externa confirmando el rechazo de la conexión. Realiza a continuación el acceso mediante `ProxyJump` a través del bastión, verificando el inicio de sesión y la generación del registro correspondiente en `/var/log/auth.log` del host bastión.
4. **Verificación de revocación temporal:** Comprueba con `sudo chage -l ext_proveedor` que la fecha de caducidad fijada se encuentre activa e intenta autenticarte con dicha cuenta una vez transcurrida la fecha programada para constatar el bloqueo automático.
5. **Procedimiento de reversión (_rollback_):**
   - Ante fallas de enrutamiento o inconsistencias en la VPN, detén la interfaz de WireGuard ejecutando `sudo wg-quick down wg0` y revierte el reenvío de paquetes con `sudo sysctl -w net.ipv4.ip_forward=0`, restableciendo la topología previa sin afectar los servicios locales.

## 4.4. Hardening de SO y Endpoints <!-- id: hardening-endpoints-parches, icon: Shield01Icon, displayTitle: 04.4 — Hardening de SO y Endpoints, description: Reducción de servicios, blindaje de OpenSSH, parámetros sysctl de red y kernel, y parches desatendidos. -->

Esta subsección aborda el problema de la vulnerabilidad predeterminada en sistemas operativos y estaciones de trabajo, reduciendo al mínimo la superficie de ataque y automatizando la aplicación de parches de seguridad. Aplica las directivas de endurecimiento preventivo de la Capa 04 de la arquitectura técnica de lilium.

### Introducción operativa y contexto de riesgo

Para entender el endurecimiento de un sistema operativo (_hardening_), consideremos una vivienda recién construida entregada con las puertas traseras sin cerrojo, las ventanas abiertas y herramientas esparcidas en la acera. En el ámbito digital, cuando un sistema operativo o paquete de software se instala con sus opciones de fábrica, se prioriza la compatibilidad universal inmediata por sobre la seguridad. Esto conlleva servicios de red secundarios encendidos, cuentas accesorias activas, parámetros del núcleo relajados y parches pendientes de instalación.

El problema técnico crítico radica en que cada servicio innecesario y cada día de demora en la aplicación de un parche amplían la superficie de ataque de la máquina. Los actores de amenaza escanean de manera continua estas debilidades en Internet para explotar fallas reportadas (técnicas de _Exploit Public-Facing Application_ en MITRE ATT&CK). El proceso de endurecimiento consiste en un protocolo metódico para cerrar puertos prescindibles, revocar privilegios sobrantes, blindar los parámetros del núcleo y automatizar la instalación de actualizaciones críticas, asegurando que el equipo opere exclusivamente con los componentes requeridos para su función de negocio.

> [!NOTE:Límite de alcance de la subsección]
> Este capítulo se concentra en la auditoría de servicios locales, el aseguramiento de OpenSSH, el blindaje del núcleo con `sysctl`, el confinamiento mediante AppArmor y la gestión de actualizaciones desatendidas en sistemas Linux (con mención de equivalencias en entornos Windows). La gestión de usuarios locales se cubrió en la sección 4.1 y la centralización de eventos de auditoría corresponde al Módulo 05 (05. DETECT).

### 4.4.1. Reducción de la superficie de ataque y auditoría de servicios locales

Todo servicio que se ejecuta en segundo plano y escucha en un puerto de red representa una potencial puerta de entrada para un atacante. La primera medida defensiva sobre un host consiste en identificar qué procesos tienen puertos abiertos y desactivar de forma permanente todo componente que no justifique su presencia en la arquitectura.

:::steps

### 1. Auditoría de sockets y puertos de escucha activos

Ejecuta la siguiente instrucción en terminal para relevar los servicios de red activos (TCP y UDP) junto con el proceso y PID correspondiente:

```bash:terminal
sudo ss -tulpn
```

```text:salida-terminal
Netid State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess
tcp   LISTEN 0      128          0.0.0.0:22         0.0.0.0:*    users:(("sshd",pid=782,fd=3))
tcp   LISTEN 0      100        127.0.0.1:25         0.0.0.0:*    users:(("master",pid=1120,fd=13))
tcp   LISTEN 0      128        127.0.0.1:5432       0.0.0.0:*    users:(("postgres",pid=934,fd=6))
```

Resultado esperado: Un listado acotado donde cada puerto en escucha (por ejemplo, `22` para SSH o `5432` para PostgreSQL local) responda estrictamente a una necesidad técnica documentada en el diseño del Módulo 3.

### 2. Revisión de unidades de servicio activas en systemd

Inspecciona los servicios del sistema operativo para identificar demonios redundantes en ejecución:

```bash:terminal
sudo systemctl list-units --type=service --state=running
```

### 3. Detención, deshabilitación y enmascaramiento de servicios innecesarios

Si durante el relevamiento se detectan servicios innecesarios para el rol del servidor (como servidores de impresión `cups`, servidores de correo locales `postfix` sin uso o servicios de descubrimiento `avahi-daemon`), se procede a detenerlos, inhabilitarlos y enmascararlos:

```bash:terminal
# Detener el servicio activo
sudo systemctl stop avahi-daemon cups

# Deshabilitar el inicio automático al arrancar el sistema
sudo systemctl disable avahi-daemon cups

# Enmascarar el servicio para impedir su reactivación accidental
sudo systemctl mask avahi-daemon cups
```

El comando `mask` vincula el archivo del servicio a `/dev/null`, imposibilitando que otro paquete o proceso lo reactive de manera imprevista.
:::

### 4.4.2. Aseguramiento y endurecimiento del demonio OpenSSH (/etc/ssh/sshd_config)

El servicio OpenSSH constituye el canal principal de administración remota en servidores Linux. Sus configuraciones predeterminadas suelen admitir métodos de autenticación obsoletos o inicios directos con la cuenta de superusuario, lo que lo vuelve blanco prioritario de ataques de adivinación de contraseñas.

Para blindar el servicio, se respalda el archivo de configuración y se aplican directivas estrictas en `/etc/ssh/sshd_config.d/99-hardening.conf` (o en el archivo principal `/etc/ssh/sshd_config`):

```text:/etc/ssh/sshd_config.d/99-hardening.conf
# Directivas estrictas de endurecimiento OpenSSH para lilium
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
PermitEmptyPasswords no
Protocol 2
AllowUsers adm_jperez@*
ClientAliveInterval 300
ClientAliveCountMax 2
```

- `PermitRootLogin no`: Prohíbe el inicio directo de sesión mediante la cuenta `root`.
- `PasswordAuthentication no`: Desactiva la autenticación con contraseñas estáticas, exigiendo obligatoriamente llaves criptográficas asimétricas.
- `AllowUsers`: Restringe el acceso remoto exclusivamente a las cuentas de gestión autorizadas.
- `ClientAliveInterval 300` y `ClientAliveCountMax 2`: Cierran automáticamente las sesiones remotas inactivas transcurridos 10 minutos (2 intervalos de 300 segundos).

Valida la sintaxis del archivo antes de reiniciar el demonio para evitar bloqueos operativos:

```bash:terminal
sudo sshd -t && sudo systemctl restart ssh
```

### 4.4.3. Blindaje del núcleo (Kernel) Linux mediante parámetros sysctl

El núcleo del sistema operativo administra los recursos de memoria, hardware y redes. A través del subsistema `sysctl`, es posible ajustar el comportamiento defensivo del kernel ante ataques habituales de suplantación de direcciones (_spoofing_) o saturación de recursos.

Crea el archivo modular `/etc/sysctl.d/99-security.conf` con las siguientes directivas:

```ini:/etc/sysctl.d/99-security.conf
# Blindaje de red y memoria del kernel para lilium

# Deshabilitar enrutamiento de paquetes en hosts que no sean routers
net.ipv4.ip_forward = 0

# Mitigar ataques de suplantación de paquetes (IP Spoofing)
net.ipv4.conf.all.rp_filter = 1
net.ipv4.conf.default.rp_filter = 1

# Ignorar paquetes con rutas de origen forzadas (Source Routing)
net.ipv4.conf.all.accept_source_route = 0
net.ipv4.conf.default.accept_source_route = 0

# Desactivar redirecciones ICMP para evitar envenenamiento de tablas de enrutamiento
net.ipv4.conf.all.accept_redirects = 0
net.ipv4.conf.default.accept_redirects = 0
net.ipv4.conf.all.secure_redirects = 0

# Mitigar ataques de denegación de servicio SYN Flood
net.ipv4.tcp_syncookies = 1

# Protección contra ataques mediante enlaces simbólicos y duros en directorios compartidos
fs.protected_symlinks = 1
fs.protected_hardlinks = 1

# Evitar volcados de memoria (core dumps) de procesos privilegiados para no exponer secretos
fs.suid_dumpable = 0
```

Aplica las directivas inmediatamente en el núcleo sin necesidad de reiniciar la máquina:

```bash:terminal
sudo sysctl --system
```

### 4.4.4. Confinamiento de procesos y control de ejecución de aplicaciones

Incluso en un host con servicios reducidos y parámetros del núcleo blindados, subsiste el peligro de que una vulnerabilidad en una aplicación web o en un servicio permita a un atacante ejecutar código malicioso. Para contener el alcance de un fallo local e impedir que derive en el control total del servidor, se implementan mecanismos de Control de Acceso Obligatorio (_Mandatory Access Control_ o MAC).

En distribuciones Ubuntu y Debian, se utiliza el motor nativo AppArmor, el cual confina los procesos mediante perfiles de seguridad específicos.

:::steps

### 1. Auditoría del estado del motor AppArmor

Comprueba que el módulo se encuentre cargado y en ejecución en el sistema:

```bash:terminal
sudo aa-status
```

```text:salida-terminal
apparmor module is loaded.
24 profiles are loaded.
24 profiles are in enforce mode.
0 profiles are in complain mode.
```

### 2. Aplicación obligatoria del modo de cumplimiento (enforce)

Asegura que los perfiles críticos no operen en modo permisivo o de sola advertencia (_complain mode_), sino en modo de bloqueo estricto (_enforce mode_):

```bash:terminal
sudo aa-enforce /etc/apparmor.d/*
```

En entornos corporativos basados en Red Hat Enterprise Linux o Rocky Linux, este mismo nivel de confinamiento se implementa mediante SELinux (_Security-Enhanced Linux_), verificando su activación con `sudo getenforce` y aplicando el modo estricto con `sudo setenforce 1`.
:::

### 4.4.5. Automatización de parches de seguridad y actualizaciones desatendidas

La aplicación manual de parches de software genera ventanas de exposición críticas durante las cuales los atacantes aprovechan vulnerabilidades públicas conocidas antes de que el personal de informática aplique las correcciones. La automatización de parches de seguridad sobre el sistema base es una salvaguarda indispensable para mantener el software protegido.

:::steps

### 1. Instalación del paquete unattended-upgrades

En sistemas Debian y Ubuntu, instala la utilidad oficial:

```bash:terminal
sudo apt update && sudo apt install unattended-upgrades -y
```

### 2. Configuración de orígenes de seguridad permitidos

Edita `/etc/apt/apt.conf.d/50unattended-upgrades` para limitar las actualizaciones automáticas exclusivamente a los repositorios oficiales de parches de seguridad:

```text:/etc/apt/apt.conf.d/50unattended-upgrades
Unattended-Upgrades::Allowed-Origins {
    "${distro_id}:${distro_codename}-security";
};
Unattended-Upgrades::Automatic-Reboot "false";
Unattended-Upgrades::Remove-Unused-Dependencies "true";
```

Esta configuración instala exclusivamente parches de seguridad, desactiva reinicios automáticos imprevistos (`Automatic-Reboot "false"`, reservando los reinicios para ventanas de mantenimiento programadas) y purga paquetes y dependencias huérfanas.

### 3. Habilitación del temporizador periódico de ejecución

Fija la periodicidad de actualización en `/etc/apt/apt.conf.d/20auto-upgrades`:

```text:/etc/apt/apt.conf.d/20auto-upgrades
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
```

:::

> [!TIP:Entornos Windows Server y estaciones corporativas]
> En entornos Windows Server o flotas de equipos gestionadas de forma centralizada mediante soluciones EDR o MDM (_Mobile Device Management_), este principio se implementa aplicando directivas de grupo (GPO) o políticas de Windows Update for Business para programar la descarga e instalación automática de actualizaciones críticas.

### Verificación de la Subsección

Para verificar con evidencia técnica que los controles de endurecimiento operan correctamente, ejecuta el siguiente protocolo:

1. **Verificación de sockets de escucha (`ss -tulpn`):** Comprueba que los únicos puertos expuestos en red correspondan a los servicios justificados en la arquitectura del Módulo 3.
2. **Verificación de directivas SSH:**
   - _Prueba Negativa:_ Intenta conectar por SSH utilizando la cuenta `root` (`ssh root@ip_servidor`) desde un equipo externo. El servidor debe rechazar la autenticación de inmediato.
   - _Prueba Positiva:_ Inicia sesión utilizando la cuenta administrativa dedicada (`adm_jperez`) empleando su llave criptográfica asimétrica.
3. **Verificación de parámetros del núcleo (`sysctl`):** Inspecciona los valores activos para confirmar la aplicación de los parámetros de blindaje:

```bash:terminal
sudo sysctl net.ipv4.tcp_syncookies fs.suid_dumpable
```

```text:salida-terminal
net.ipv4.tcp_syncookies = 1
fs.suid_dumpable = 0
```

4. **Verificación de parches automáticos:** Consulta el estado operativo del servicio con `sudo systemctl status unattended-upgrades` y revisa los eventos asentados en `/var/log/unattended-upgrades/unattended-upgrades.log`.
5. **Procedimiento de reversión (_rollback_):**
   - Ante errores en la configuración de OpenSSH o parámetros del sistema, accede mediante la consola de emergencia y restaura las copias de respaldo: `sudo cp /etc/ssh/sshd_config.bak /etc/ssh/sshd_config && sudo systemctl restart ssh`, reanudando el acceso administrativo normal.

## 4.5. Proxies Inversos y Cifrado <!-- id: proteccion-aplicaciones-cifrado, icon: ShieldCheckIcon, displayTitle: 04.5 — Proxies Inversos y Cifrado, description: Proxy inverso Nginx con TLS 1.3, cifrado en reposo con LUKS y mínimo privilegio en bases de datos PostgreSQL. -->

Esta subsección aborda el riesgo de la exposición directa de servicios web hacia Internet, la ausencia de cifrado en reposo y en tránsito sobre información sensible, y los privilegios excesivos concedidos a las aplicaciones sobre los motores de bases de datos. Materializa las especificaciones de seguridad en la capa de aplicación y datos y las mitigaciones asociadas al modelado de amenazas STRIDE.

### Introducción operativa y contexto de riesgo

Para comprender la protección en el nivel de aplicaciones y almacenamiento, consideremos una instalación fabril donde los productos terminados se resguardan en bóvedas acorazadas y los visitantes son recibidos en una recepción perimetral sin acceso directo a las áreas de manufactura. En el entorno digital, un servidor proxy inverso (_Reverse Proxy_) cumple exactamente el rol de esa recepción obligatoria: se sitúa en la Zona Desmilitarizada (DMZ) recibiendo todas las peticiones procedentes de Internet, inspecciona el tráfico, termina la sesión cifrada y redirige las consultas válidas hacia los servidores de aplicaciones internos, evitando que usuarios externos interactúen directamente con el backend del negocio.

Por su parte, el cifrado en tránsito mediante el protocolo Transport Layer Security (_TLS_) protege los datos mientras viajan por redes públicas o locales para evitar su interceptación (_packet sniffing_). Paralelamente, el cifrado en reposo a nivel de bloques mediante LUKS (_Linux Unified Key Setup_) resguarda los discos duros, garantizando que si una unidad física o un servidor es sustraído, la información permanezca completamente inaccesible sin la clave de descifrado.

El problema técnico frecuente en pequeñas empresas radica en conectar aplicaciones web directamente a bases de datos utilizando la cuenta de superusuario (`postgres` o `sa`), transmitiendo contraseñas en texto claro o almacenando datos sensibles sin cifrado. Si la aplicación sufre una vulnerabilidad de inyección SQL, el atacante adquiere control inmediato sobre la totalidad de los datos y esquemas de la organización.

> [!NOTE:Límite de alcance de la subsección]
> Este capítulo se focaliza en el despliegue del proxy inverso Nginx con TLS 1.3, el cifrado de almacenamiento de discos con LUKS y la aplicación del mínimo privilegio en bases de datos PostgreSQL. La segmentación perimetral de red se abordó en la sección 4.2 y las tareas de análisis forense post-incidente corresponden al Módulo 06.

### 4.5.1. Despliegue de un Proxy Inverso en la DMZ con Nginx y Terminación TLS

Para publicar aplicaciones web corporativas hacia Internet sin exponer los servidores de aplicaciones internos, se implementa Nginx actuando como proxy inverso en la DMZ (VLAN 10). Esta disposición centraliza los certificados digitales y aísla la Zona Restringida.

:::steps

### 1. Instalación de Nginx en la subred perimetral (DMZ)

Actualiza los repositorios e instala el servidor web:

```bash:terminal
sudo apt update && sudo apt install nginx -y
```

### 2. Configuración del bloque de servidor con terminación TLS y proxy_pass

Crea el archivo `/etc/nginx/sites-available/corporativo.conf` estableciendo redirección forzada de HTTP a HTTPS y habilitando únicamente protocolos criptográficos robustos (TLS 1.2 y TLS 1.3):

```nginx:/etc/nginx/sites-available/corporativo.conf
server {
    listen 80;
    server_name portal.empresa.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name portal.empresa.com;

    ssl_certificate /etc/letsencrypt/live/portal.empresa.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/portal.empresa.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5:!3DES;
    ssl_prefer_server_ciphers on;

    # Encabezados de seguridad para mitigar ataques web habituales
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location / {
        proxy_pass http://10.10.30.20:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

La directiva `proxy_pass` redirige las peticiones previamente descifradas e inspeccionadas hacia el servidor interno de backend (`10.10.30.20:8080`), el cual permanece aislado del tráfico público.

### 3. Emisión y renovación automatizada de certificados con Certbot

Para automatizar la emisión y renovación periódica de los certificados TLS con Let's Encrypt, se instala y ejecuta Certbot:

```bash:terminal
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d portal.empresa.com
```

:::

### 4.5.2. Cifrado de discos y particiones en reposo mediante cryptsetup (LUKS)

Para proteger la confidencialidad de los datos frente al robo de equipamiento o la sustracción de discos duros en los centros de datos, se aplica cifrado a nivel de bloques mediante LUKS (_Linux Unified Key Setup_). LUKS implementa el estándar oficial de cifrado de almacenamiento en sistemas Linux utilizando algoritmos simétricos robustos como AES en modo XTS con claves de 512 bits.

:::steps

### 1. Inicialización y formateo del contenedor criptográfico

Suponiendo un disco o partición dedicada `/dev/sdb1`, inicializa el contenedor cifrado:

```bash:terminal
sudo cryptsetup -v --cipher aes-xts-plain64 --key-size 512 --hash sha256 --iter-time 2000 luksFormat /dev/sdb1
```

### 2. Mapeo y apertura del dispositivo lógico cifrado

Abre el contenedor asignándole un nombre de mapeo lógico (por ejemplo, `datos_cifrados`):

```bash:terminal
sudo cryptsetup luksOpen /dev/sdb1 datos_cifrados
```

### 3. Creación del sistema de archivos y montaje temporal

Formatea el volumen mapeado con un sistema de archivos estándar (`ext4`) y procede a su montaje:

```bash:terminal
sudo mkfs.ext4 /dev/mapper/datos_cifrados
sudo mkdir -p /srv/datos_seguros
sudo mount /dev/mapper/datos_cifrados /srv/datos_seguros
```

### 4. Configuración persistente en crypttab y fstab

Para que el sistema reconozca y monte el volumen cifrado al iniciar, identifica su identificador único (_UUID_) ejecutando `sudo blkid /dev/sdb1` y configúralo en `/etc/crypttab`:

```text:/etc/crypttab
datos_cifrados UUID=12345678-abcd-ef01-2345-6789abcdef01 none luks
```

Añade la entrada correspondiente en `/etc/fstab` para definir el punto de montaje automático:

```text:/etc/fstab
/dev/mapper/datos_cifrados /srv/datos_seguros ext4 defaults 0 2
```

:::

### 4.5.3. Aplicación estricta del principio de mínimo privilegio en PostgreSQL

Conectar las aplicaciones al motor de bases de datos empleando la cuenta de superusuario (`postgres`) representa un error crítico de arquitectura: cualquier vulnerabilidad en el código web permitiría al atacante alterar estructuras de tablas, leer información contable o ejecutar comandos en el sistema subyacente. Para mitigar esta debilidad, se implementa una cuenta de servicio de privilegios estrictos.

:::steps

### 1. Creación de la cuenta de servicio dedicada

Conéctate a la consola de administración de PostgreSQL y genera un usuario específico para la aplicación web, sin permisos de superusuario ni facultad de crear bases de datos:

```sql:postgresql
CREATE USER svc_erp WITH PASSWORD 'FraseDePasoMuySeguraYUnica_2026!';
```

### 2. Revocación de permisos globales predeterminados

Retira los permisos genéricos concedidos históricamente al rol público sobre la base de datos:

```sql:postgresql
REVOKE ALL ON DATABASE db_corporativa FROM PUBLIC;
GRANT CONNECT ON DATABASE db_corporativa TO svc_erp;
```

### 3. Concesión granular de privilegios por tabla

Concede únicamente las operaciones indispensables (`SELECT`, `INSERT`, `UPDATE`) sobre las tablas de clientes y pedidos que la aplicación web necesita consultar, excluyendo cualquier acceso a esquemas de auditoría, recursos humanos o contabilidad:

```sql:postgresql
\c db_corporativa;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO svc_erp;
GRANT SELECT, INSERT, UPDATE ON TABLE clientes_web, pedidos_web TO svc_erp;
```

Resultado esperado: Si un adversario compromete el servidor web, las credenciales de `svc_erp` solo le permitirán consultar y registrar pedidos en esas tablas específicas, recibiendo un error inmediato de denegación (`Permission denied`) si intenta eliminar tablas (`DROP TABLE`) o leer esquemas restringidos.
:::

### Verificación de la Subsección

Para comprobar con evidencia técnica que la protección de aplicaciones, el proxy inverso y los mecanismos de cifrado operan de forma correcta, ejecuta el siguiente protocolo:

1. **Verificación de TLS en el Proxy Inverso:** Evalúa la negociación criptográfica del servidor web mediante una consulta detallada con `curl`:

```bash:terminal
curl -Iv https://portal.empresa.com
```

```text:salida-terminal
* Connected to portal.empresa.com (203.0.113.10) port 443
* ALPN: offers h2,http/1.1
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384
* Server certificate:
*  subject: CN=portal.empresa.com
*  issuer: C=US, O=Let's Encrypt, CN=R3
< HTTP/2 200
< strict-transport-security: max-age=31536000; includeSubDomains
< x-content-type-options: nosniff
< x-frame-options: DENY
```

2. **Verificación de cifrado en reposo con LUKS:** Inspecciona el estado del contenedor cifrado en disco:

```bash:terminal
sudo cryptsetup status datos_cifrados
```

```text:salida-terminal
/dev/mapper/datos_cifrados is active and is in use.
  type:    LUKS2
  cipher:  aes-xts-plain64
  keysize: 512 bits
  device:  /dev/sdb1
```

3. **Verificación de privilegios en PostgreSQL:**
   - _Prueba Positiva:_ Inicia sesión con la cuenta de servicio (`psql -U svc_erp -d db_corporativa`) y realiza una consulta sobre la tabla autorizada: `SELECT COUNT(*) FROM pedidos_web;`, constatando una respuesta satisfactoria.
   - _Prueba Negativa:_ Intenta ejecutar una instrucción destructiva o acceder a información no autorizada (`DROP TABLE clientes_web;` o `SELECT * FROM salarios_empleados;`). El motor debe abortar la instrucción con el mensaje `ERROR: permission denied for table`.
4. **Procedimiento de reversión (_rollback_):**
   - Ante errores sintácticos en Nginx, restaura los archivos previos en `/etc/nginx/sites-available/` y ejecuta `sudo nginx -t && sudo systemctl reload nginx`. Para desmontar y cerrar volúmenes LUKS de forma segura en caso de mantenimiento, utiliza `sudo umount /srv/datos_seguros && sudo cryptsetup luksClose datos_cifrados`.

## 4.6. Respaldos Aislados e Inmutables <!-- id: copias-seguridad-inmutables, icon: Database01Icon, displayTitle: 04.6 — Respaldos Aislados e Inmutables, description: Arquitectura Pull Backup, inmutabilidad WORM, automatización con Restic y pruebas de restauración 3-2-1-1-0. -->

Esta subsección aborda el peligro de destrucción o cifrado de copias de seguridad durante ataques de secuestro de datos (_ransomware_), garantizando la resiliencia operativa de la empresa mediante una arquitectura de respaldos aislados e inmutables. Conecta con el eje transversal de resiliencia del Módulo 3 y la tarea prioritaria T-01 del POA&M.

### Introducción operativa y contexto de riesgo

Para entender la resiliencia en la protección de datos, consideremos una organización que guardaba sus duplicados contables en una caja de seguridad dentro de la misma oficina de operaciones. Si un incendio o un asalto afectaba al edificio, tanto los libros originales como sus copias de resguardo se destruían simultáneamente. En el ámbito digital, una copia de seguridad (_backup_) es el duplicado de la información crítica del negocio. Sin embargo, los esquemas tradicionales en red —donde los servidores productivos cuentan con contraseñas permanentes y permisos de escritura y borrado sobre las carpetas compartidas de respaldo— resultan vulnerables frente a las técnicas actuales de ataque.

El riesgo crítico radica en que los grupos de ciberdelincuencia modernos no cifran inmediatamente el primer equipo que vulneran; exploran la red interna durante semanas buscando los repositorios de respaldos. Utilizan credenciales robadas para purgar o cifrar las copias de seguridad antes de activar el secuestro de datos en producción, neutralizando cualquier alternativa de restauración (técnica catalogada en MITRE ATT&CK como _Inhibit System Recovery_ — T1490). Para que un respaldo cumpla su función protectora, debe concebirse bajo criterios de aislamiento lógico y operativo estricto.

> [!NOTE:Límite de alcance de la subsección]
> Este capítulo se focaliza en la arquitectura de extracción (_Pull Backup_), la inmutabilidad de almacenamiento (_WORM_), la automatización mediante Restic y los protocolos de simulacro de recuperación con cero errores. Los planes globales de continuidad de negocio y la gestión de crisis ante incidentes declarados corresponden al Módulo 06 (06. RESPOND & RECOVER).

### 4.6.1. Arquitectura de Extracción (Pull Backup) y Separación de Credenciales

Para neutralizar el vector que permite a un servidor productivo infectado destruir sus propios respaldos, se implementa una arquitectura basada en extracción (_Pull Backup_) en reemplazo del modelo clásico de empuje (_Push_).

En un esquema de empuje (_Push_), el servidor productivo posee credenciales para conectarse al almacenamiento de respaldo y depositar archivos; si el servidor es tomado por un atacante, este utiliza esas mismas credenciales para borrar el histórico. Por el contrario, en el esquema de extracción (_Pull_), el repositorio de respaldo opera en un servidor dedicado dentro de la Zona de Resiliencia (VLAN 40) con credenciales administrativas totalmente aisladas. Es el servidor de respaldos el que inicia la conexión hacia producción de forma programada para extraer los datos, bloqueando cualquier conexión originada en sentido inverso desde producción hacia resiliencia.

:::steps

### 1. Generación de llaves criptográficas exclusivas para el servidor de respaldos

En el host de resiliencia (`10.10.40.10`), genera un par de llaves asimétricas dedicadas exclusivamente a la tarea de respaldo:

```bash:terminal
ssh-keygen -t ed25519 -f /root/.ssh/id_ed25519_backup -C "backup-pull-service"
```

### 2. Restricción forzada de comandos en authorized_keys del servidor de producción

En el servidor de producción (`10.10.30.15`), incorpora la llave pública del servidor de respaldos en `/root/.ssh/authorized_keys`, restringiendo de forma permanente el comando ejecutable mediante la directiva `command=`:

```text:~/.ssh/authorized_keys
command="rsync --server --sender -vlogDtpr . /srv/produccion",no-pty,no-agent-forwarding,no-port-forwarding ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... backup-pull-service
```

Esta directiva restringe el uso de la llave exclusivamente a la lectura y transferencia de archivos mediante Rsync, impidiendo que el servidor de respaldos obtenga una consola interactiva en producción si sus credenciales se vieran comprometidas.
:::

### 4.6.2. Inmutabilidad y Bloqueo de Almacenamiento (Regla 3-2-1-1-0)

Para blindar las copias frente a instrucciones de borrado o cifrado malicioso, la industria adoptó la regla de respaldo 3-2-1-1-0: mantener 3 copias de la información en 2 tipos de soporte distintos, con 1 copia fuera de la sede principal (_offsite_), 1 copia inmutable o desconectada de la red (_air-gapped_), y 0 errores tras simulacros periódicos de restauración.

La inmutabilidad se sustenta en tecnologías WORM (_Write Once, Read Many_ / Escribir una vez, leer muchas). Consiste en un bloqueo lógico o físico que impide modificar, sobrescribir o eliminar un archivo respaldado —incluso utilizando privilegios de superusuario (`root`)— durante un intervalo de retención fijado previamente.

- **Implementación en sistemas de archivos Linux:** Aplicación de atributos de inmutabilidad del sistema de archivos sobre los respaldos consolidados:

```bash:terminal
# Fijar atributo de inmutabilidad del sistema de archivos
sudo chattr +i /srv/resiliencia/respaldo_cifrado.bak
```

- **Implementación en repositorios en la nube:** Activación del bloqueo de objetos (_Object Lock_) en modo cumplimiento (_Compliance Mode_), garantizando que ningún usuario ni administrador pueda purgar los objetos hasta que concluya el plazo de retención fijado por la política de la empresa.

### 4.6.3. Automatización y Verificación de Integridad con Restic o BorgBackup

Para optimizar el espacio de almacenamiento y garantizar que las copias no presenten fallas silenciosas de corrupción de bloques, se utilizan utilidades de respaldo modernas con cifrado, deduplicación y compresión en origen, como Restic.

:::steps

### 1. Inicialización del repositorio criptográfico en la Zona de Resiliencia

En el host de respaldos, inicializa el repositorio cifrado asignando una contraseña de alta entropía:

```bash:terminal
export RESTIC_REPOSITORY=/srv/resiliencia/repo_corporativo
export RESTIC_PASSWORD='FraseMaestraDeCifradoExtremadamenteSegura_2026!'
restic init
```

### 2. Creación del script de extracción automatizado y verificación de integridad

Crea el script operativo en `/usr/local/bin/ejecutar_backup.sh`:

```bash:/usr/local/bin/ejecutar_backup.sh
#!/bin/bash
set -euo pipefail

export RESTIC_REPOSITORY=/srv/resiliencia/repo_corporativo
export RESTIC_PASSWORD='FraseMaestraDeCifradoExtremadamenteSegura_2026!'

# Extracción de datos desde el servidor de producción mediante SSH
restic backup --exclude="/var/tmp" --exclude="/proc" --exclude="/sys" \
    ssh://root@10.10.30.15/srv/produccion

# Verificación matemática de la integridad estructural del repositorio
restic check
```

Otorga permisos de ejecución exclusivos al administrador:

```bash:terminal
sudo chmod 700 /usr/local/bin/ejecutar_backup.sh
```

### 3. Programación desatendida mediante temporizadores de systemd

Crea la unidad de servicio `/etc/systemd/system/lilium-backup.service` y su temporizador `/etc/systemd/system/lilium-backup.timer` para ejecutar la extracción todas las noches a las 02:00 UTC:

```ini:/etc/systemd/system/lilium-backup.timer
[Unit]
Description=Temporizador nocturno para extraccion de respaldos inmutables lilium

[Timer]
OnCalendar=*-*-* 02:00:00
Persistent=true

[Install]
WantedBy=timers.target
```

Activa y arranca el temporizador en el sistema:

```bash:terminal
sudo systemctl daemon-reload && sudo systemctl enable --now lilium-backup.timer
```

:::

### 4.6.4. El Protocolo de Prueba de Restauración (El cero errores de la regla 3-2-1-1-0)

El axioma fundamental de la resiliencia en ciberseguridad señala que un respaldo que nunca ha sido probado no es una garantía de recuperación, sino una hipótesis no comprobada. La corrupción de medios de almacenamiento, los fallos sintácticos en bases de datos o la pérdida inadvertida de llaves criptográficas solo se descubren en una emergencia si no existen ensayos periódicos programados.

El protocolo de la PyME debe establecer simulacros mensuales obligatorios en los cuales se extraiga una muestra representativa de los respaldos inmutables y se restaure en un entorno de pruebas aislado (VLAN 60). En dicho entorno se comprueba el montaje de los sistemas de archivos y el levantamiento de las bases de datos para validar su integridad funcional antes de certificar la copia como válida.

### Verificación de la Subsección

Para certificar con evidencia técnica que la arquitectura de respaldos opera de manera óptima, ejecuta el siguiente protocolo:

1. **Verificación de la extracción automatizada (Prueba Positiva):** Ejecuta manualmente el script de extracción (`sudo /usr/local/bin/ejecutar_backup.sh`) o activa el temporizador (`sudo systemctl start lilium-backup.service`). Comprueba que los datos cifrados y deduplicados se almacenen en el repositorio de la VLAN 40 sin advertencias ni errores en el registro de `restic check`.
2. **Verificación de inmutabilidad (Prueba Negativa de Borrado):** Intenta eliminar o modificar un archivo dentro del repositorio de resiliencia utilizando la cuenta `root`:

```bash:terminal
sudo rm /srv/resiliencia/respaldo_cifrado.bak
```

```text:salida-terminal
rm: cannot remove '/srv/resiliencia/respaldo_cifrado.bak': Operation not permitted
```

Resultado esperado: El sistema operativo bloquea la acción debido al atributo de inmutabilidad activo (`chattr +i` o _Object Lock_), confirmando que ningún usuario ni software de rescate puede purgar los respaldos.

3. **Verificación de restauración con validación criptográfica:** Selecciona un archivo de prueba en producción, calcula su resumen criptográfico (`sha256sum archivo.db`), elimínalo intencionalmente, ejecute la orden de restauración:

```bash:terminal
restic restore latest --target /tmp/recuperacion
```

Comprueba mediante `sha256sum /tmp/recuperacion/srv/produccion/archivo.db` que el código _hash_ coincide bit a bit con el archivo original, demostrando una restauración con cero errores.

4. **Procedimiento de reversión y mantenimiento (_rollback_):**
   - Para depurar de forma autorizada copias antiguas conforme al ciclo de retención formal de la empresa, el administrador debe remover temporalmente el atributo de inmutabilidad mediante `sudo chattr -i /srv/resiliencia/archivo.bak` utilizando la cuenta de custodia, aplicar las instrucciones de purga (`restic forget --prune`) y reactivar la inmutabilidad de inmediato.
