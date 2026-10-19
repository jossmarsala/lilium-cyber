---
titulo: 'La estación olvidada: Primer contacto con la ciberseguridad'
laboratorio: 'Lab 01 — LILIUM'
idioma: 'Español neutro'
referencia: 'CIS Critical Security Controls v8.1 (IG1)'
formato: 'Playbook interactivo con pistas y soluciones desplegables'
---

# La estación olvidada: Primer contacto con la ciberseguridad

### Tu misión

La Estación Botánica Automatizada N.º 4 lleva un tiempo funcionando en piloto automático. El cuidador principal desapareció sin dejar instrucciones y una alerta en el servidor central exige revisar el estado de la infraestructura. Tu función es actuar como operario responsable de una primera auditoría de seguridad: identificar qué existe, reconocer los riesgos, preservar evidencias y aplicar correcciones proporcionadas sin interrumpir la operación.

### Reglas de trabajo

- Documenta: Registra cada hallazgo, comando relevante y evidencia observada en la app de Bitácora; en auditoría, lo que no queda registrado no existe.
- Respeta el modo solo lectura en la Fase 1: No alteres archivos, servicios ni configuraciones durante la inspección inicial.
- Sigue el orden secuencial: Completa y valida los criterios de cada fase antes de avanzar a la siguiente.
- Preserva la operatividad: Aplica correcciones justificadas y verifica que no interrumpan los servicios esenciales de la estación.
- Cada fase dispone de dos botones desplegables interactivos: "Herramientas" Ofrece pistas y comandos sugeridos para investigar. "Solución" presenta una ruta de resolución paso a paso.

## FASE 1: Auditoría: conocer el estado inicial

> subtitle: Construir una línea base sin alterar el entorno. Regla de la fase: solo lectura.

### Directivas

1. **Paso 1.1 — Identifica el sistema que tienes delante** — Antes de investigar una anomalía, debes saber en qué máquina estás trabajando y con qué usuario. Consulta tu usuario actual, el nombre del equipo, la fecha del sistema y los datos de la versión de Linux (puedes apoyarte en el archivo `/etc/os-release`). ¿Qué datos incluirías en una línea base inicial y por qué?
2. **Paso 1.2 — Contrasta el inventario declarado con el software instalado** — En la carpeta `/etc/invernadero` encontrarás la documentación oficial de la estación, incluyendo el inventario de activos y una lista de software autorizado. Explora ese directorio, lee sus archivos y compáralos con la lista de paquetes realmente instalados en el sistema. ¿Qué activos puedes verificar desde esta máquina y cuáles son solo referencias documentales?
3. **Paso 1.3 — Revisa usuarios, grupos y privilegios** — En una organización que ha cambiado de personal sin procedimientos formales, una cuenta antigua puede seguir representando un riesgo. Revisa las cuentas y grupos registrados en `/etc/passwd` y `/etc/group`, y verifica el estado de la contraseña de la cuenta `ex_cuidador`. ¿Qué cuentas tienen privilegios de administración (`sudo`) y cuáles requieren revisión?
4. **Paso 1.4 — Examina archivos, clasificación y permisos** — La confidencialidad depende de que cada dato solo sea accesible para quienes lo necesitan. Explora las carpetas de operación (`/opt/invernadero`, `/srv/invernadero` y `/var/backups/invernadero`), revisa la carpeta oculta `/home/cuidador/.ssh` y examina el archivo sospechoso ubicado en `/tmp/catalogo_orquideas.pdf`. ¿Los permisos actuales coinciden con la sensibilidad de cada archivo?
5. **Paso 1.5 — Construye la línea base de servicios y red** — Un servicio escuchando en red puede ser necesario para la operación o representar una puerta abierta innecesaria. Identifica la dirección IP de la máquina, los puertos abiertos y los servicios activos en el sistema (prestando atención a `nginx` y `ssh`). ¿Qué servicio está limitado al acceso local y cuál escucha hacia el exterior?
6. **Paso 1.6 — Lee los registros sin confundir indicios con hechos** — En la carpeta `/var/log/invernadero` se guardan los registros de la estación junto con una nota aclaratoria (`README-lab.txt`), además de los avisos generales del sistema. Examina estos archivos para reconstruir qué ocurrió. ¿Qué secuencia de eventos parece relevante y por qué debes distinguir los registros simulados de la actividad real del sistema?

### Pistas

- **Paso 1.1: Identificación del sistema y de la sesión** | Consultar usuario actual, nombre de equipo, fecha, versión de kernel y sistema operativo | `whoami && id && hostname && date && uname -a && cat /etc/os-release`
- **Paso 1.2: Inventario de activos y software** | Listar y leer la documentación en `/etc/invernadero` y ver los paquetes instalados | `ls -la /etc/invernadero && cat /etc/invernadero/inventario.csv && cat /etc/invernadero/software-autorizado.txt && dpkg -l`
- **Paso 1.3: Cuentas, grupos y privilegios** | Leer los archivos de usuarios y grupos del sistema y consultar el estado de `ex_cuidador` | `cat /etc/passwd && cat /etc/group && id cuidador && sudo passwd -S ex_cuidador`
- **Paso 1.4: Archivos, permisos y clasificación** | Listar permisos en las carpetas del invernadero y `.ssh`, y comprobar el tipo real y huella del archivo en `/tmp` | `ls -la /srv/invernadero/catalogo /srv/invernadero/informes /home/cuidador/.ssh && file /tmp/catalogo_orquideas.pdf && sha256sum /tmp/catalogo_orquideas.pdf`
- **Paso 1.5: Servicios activos e interfaces de red** | Consultar dirección IP, puertos en escucha y estado de los servicios del sistema | `ip -br addr && sudo ss -tulpn && systemctl --type=service && systemctl status nginx`
- **Paso 1.6: Registros y trazabilidad de eventos** | Listar y leer los registros de `/var/log/invernadero` y consultar el registro del sistema | `ls -la /var/log/invernadero && sudo cat /var/log/invernadero/README-lab.txt && sudo cat /var/log/invernadero/*.log && sudo journalctl`

### Guía Pedagógica

#### Paso 1.1: Identifica el sistema que tienes delante

> Qué debe quedar en la bitácora: una descripción breve de la máquina examinada y el contexto de la observación. Esta información sirve como punto de partida para comparar el antes y el después.

- Identificar cuenta activa y grupos `whoami && id`
  - _whoami e id permiten identificar la cuenta activa y sus grupos. Esto ayuda a entender por qué algunos archivos pueden leerse y por qué ciertas acciones administrativas requieren autorización._
- Consultar nombre del equipo, fecha y sistema operativo `hostname && date && uname -a && cat /etc/os-release`
  - _El nombre del host, la fecha de observación, el kernel y la distribución permiten contextualizar los resultados y comparar futuras revisiones._
- Consultar tiempo de funcionamiento `uptime`
  - _Usa uptime como referencia del tiempo que lleva encendido el sistema. No lo interpretes, por sí solo, como una prueba de compromiso o de estabilidad._
- Registrar contexto inicial en la bitácora
  - _Registra la fecha y hora de la inspección, el nombre del sistema, la distribución, la versión del kernel y la cuenta con la que trabajaste._

#### Paso 1.2: Contrasta el inventario declarado con el software instalado

> Interpretación importante: el inventario de activos y el inventario de software cumplen funciones relacionadas, pero no idénticas. El primero describe qué recursos deben protegerse; el segundo ayuda a identificar qué programas están instalados y si responden a una necesidad legítima.

- Explorar la carpeta de configuración y leer el inventario `ls -la /etc/invernadero && cat /etc/invernadero/inventario.csv`
  - _Contiene seis activos declarados: servidor central, estación administrativa, portátil técnico, sensor IoT, panel web y router/firewall._
- Distinguir entre activo documentado y activo técnicamente verificable
  - _Esta máquina virtual representa el servidor Linux central; desde aquí no puedes comprobar directamente el estado físico de los equipos externos ni del router/firewall._
- Leer software autorizado y contrastar con paquetes instalados `cat /etc/invernadero/software-autorizado.txt && dpkg -l`
  - _Compara la lista autorizada con la salida de dpkg -l. Identifica los programas vinculados al servidor web (nginx) y al acceso remoto (openssh-server). Si notas diferencias, documéntalas para validación._
- Mantener la regla de solo lectura en la línea base
  - _No actualices ni desinstales paquetes ni cambies configuraciones en esta fase. Registra qué activos pueden observarse directamente y cuáles solo aparecen documentados._

#### Paso 1.3: Revisa usuarios, grupos y privilegios

> Qué debe quedar en la bitácora: las cuentas observadas, sus grupos relevantes, el estado comprobado y una propuesta razonada sobre los accesos que deberían revisarse. No supongas que toda cuenta con privilegios administrativos es incorrecta: debe evaluarse según su función.

- Revisar las cuentas registradas en el sistema `cat /etc/passwd`
  - _Observa al final de la lista los usuarios creados para la estación (operario, cuidador, admin-it, ana, proveedor, ex_cuidador) y verifica que aún conservan una terminal interactiva (/bin/bash)._
- Evaluar pertenencia a grupos y permisos de administración `cat /etc/group && id cuidador && id ex_cuidador`
  - _Revisa quiénes integran cada grupo funcional (riego-ops, administracion, it-admins, proveedores) y quiénes pertenecen al grupo sudo._
- Inspeccionar el estado de contraseña de la cuenta antigua `sudo passwd -S ex_cuidador`
  - _La letra "L" (Locked) indica que la contraseña está bloqueada, pero la cuenta sigue teniendo una shell interactiva asignada en /etc/passwd._
- Contrastar con las funciones del escenario y documentar hallazgos
  - _Cada usuario responde a un rol, excepto ex_cuidador, que pertenece a personal que ya no trabaja en la estación y requiere medidas adicionales en la fase de endurecimiento. No modifiques la cuenta todavía._

#### Paso 1.4: Examina archivos, clasificación y permisos

> Hallazgos esperables: el archivo confidencial permite lectura a cualquier usuario del sistema (`-rw-r--r--` / 0644) y la clave privada SSH también tiene permisos demasiado abiertos (`-rw-r--r--` / 0644). Ambos deben corregirse en la fase 3, después de registrar la línea base.

- Explorar las carpetas de datos y operación `ls -la /opt/invernadero /srv/invernadero/catalogo /srv/invernadero/informes /var/backups/invernadero`
  - _/opt contiene programas y lecturas de sensores, /srv almacena el catálogo público y los informes, y /var/backups guarda las copias de respaldo._
- Examinar los permisos del informe confidencial y de la clave privada SSH `ls -la /srv/invernadero/informes/registro_confidencial.csv /home/cuidador/.ssh/id_ed25519`
  - _Observa los bloques de permisos (-rw-r--r--). Ambos archivos pueden ser leídos por cualquier usuario local, lo cual expone información confidencial y una clave privada._
- Comprobar el tipo real del archivo ubicado en `/tmp` `file /tmp/catalogo_orquideas.pdf`
  - _La extensión .pdf no garantiza el formato real; el comando file analiza su contenido e indica que en realidad es texto plano (ASCII text)._
- Calcular huellas criptográficas SHA-256 `sha256sum /tmp/catalogo_orquideas.pdf /var/backups/invernadero/catalogo_2026-10-17.bak`
  - _Genera el código hash de ambos archivos para dejar constancia en tu bitácora de que no fueron alterados durante tu revisión. No cambies permisos ni borres nada en esta fase._

#### Paso 1.5: Construye la línea base de servicios y red

> Criterio técnico: la dirección en la que escucha un puerto importa. `127.0.0.1` limita el acceso únicamente al propio equipo local; `0.0.0.0` indica que el servicio escucha en todas las interfaces de red, quedando expuesto a conexiones externas.

- Inspeccionar las interfaces de red y direcciones IP `ip -br addr && ip route`
  - _Muestra de forma resumida las tarjetas de red del equipo (lo y eth0), su dirección IP local (10.0.2.15) y su ruta de salida._
- Identificar puertos abiertos y procesos asociados `sudo ss -tulpn`
  - _Muestra qué puertos están en estado LISTEN (escuchando): verás el puerto 22 (sshd en 0.0.0.0) y el puerto 8080 (nginx en 127.0.0.1)._
- Listar los servicios activos del sistema `systemctl --type=service`
  - _Permite ver de un vistazo qué servicios de fondo se están ejecutando (cron, nginx y ssh)._
- Comprobar el detalle del servidor web Nginx `systemctl status nginx`
  - _En este escenario, Nginx sirve el panel interno de la estación en 127.0.0.1:8080. Es un servicio legítimo y necesario para la operación, por lo que debe mantenerse activo._

#### Paso 1.6: Lee los registros sin confundir indicios con hechos

> Qué debe quedar en la bitácora: una cronología inicial, los indicios seleccionados para investigar en la siguiente fase y una aclaración de por qué los registros del laboratorio deben contrastarse con el sistema real.

- Listar los archivos de registro y leer la nota del laboratorio `ls -la /var/log/invernadero && sudo cat /var/log/invernadero/README-lab.txt`
  - _El archivo README-lab.txt aclara que los registros en esta carpeta son eventos sintéticos creados para el entrenamiento y que debes contrastarlos con los comandos reales del sistema._
- Leer los registros de accesos y actividad `sudo cat /var/log/invernadero/accesos.log && sudo cat /var/log/invernadero/actividad.log`
  - _accesos.log muestra intentos fallidos de ex_cuidador y un ingreso fuera de horario. actividad.log menciona el script riego_nocturno.sh, el supuesto PDF en /tmp y un proceso desconocido llamado polilla_emisora._
- Leer los registros de respaldos e incidentes `sudo cat /var/log/invernadero/backup.log && sudo cat /var/log/invernadero/incidentes.log`
  - _Indican que la última copia de seguridad terminó con advertencias y que su integridad está pendiente de revisión._
- Consultar el registro general del sistema `sudo journalctl`
  - _Muestra los avisos generales registrados en el sistema junto con las alertas del laboratorio (LILIUM-LAB). Anota la secuencia temporal en tu bitácora._

### Verificaciones

- v1-base | Descripción básica del sistema y fecha/hora de observación.
- v1-inv | Comparación del inventario declarado con lo que puede verificarse en esta VM.
- v1-users | Revisión inicial de cuentas, grupos y estado de ex_cuidador.
- v1-perms | Evidencia de permisos para la clave de prueba y el informe confidencial.
- v1-net | Línea base de servicios/puertos, con atención a la dirección de escucha de Nginx.
- v1-logs | Cronología inicial que identifica los logs sintéticos como tales y distingue hechos de hipótesis.
- v1-nobrk | Confirmación de que no se hicieron cambios durante la auditoría.

---

## FASE 2: Evidencia: triaje y contención controlada

> subtitle: Preservar primero, decidir después. Contrastar indicios y tomar decisiones proporcionadas sin destruir evidencia.

### Directivas

1. **Paso 2.1 — Correlaciona los eventos y formula una hipótesis** — En los registros de `/var/log/invernadero/actividad.log` aparecieron dos procesos mencionados: `riego_nocturno.sh` y `polilla_emisora`. Consulta la lista de procesos que se están ejecutando actualmente en memoria y compáralos con lo que leíste en los registros. ¿Ambos procesos siguen activos? Redacta una hipótesis inicial antes de intervenir.
2. **Paso 2.2 — Inspecciona el proceso sospechoso en ejecución** — Antes de detener `polilla_emisora`, debes documentar qué es y qué está haciendo realmente. Anota su número identificador de proceso (PID), fíjate desde qué ruta se está ejecutando y lee el contenido de ambos scripts (`/tmp/polilla_emisora` y `/opt/invernadero/scripts/riego_nocturno.sh`). ¿Cuál de los dos cumple una tarea operativa real y qué hace exactamente el proceso sospechoso?
3. **Paso 2.3 — Valida el archivo con extensión engañosa** — Los registros también mencionaron `/tmp/catalogo_orquideas.pdf`. En la Fase 1 viste que no era un PDF real. Ahora inspecciona sus detalles, lee su contenido de texto de forma segura en la terminal y registra su huella SHA-256. ¿Qué dice el archivo en su interior y por qué no debemos borrarlo?
4. **Paso 2.4 — Evalúa si el respaldo puede utilizarse** — El registro de backup advirtió sobre problemas en la última copia. Revisa los archivos dentro de `/var/backups/invernadero` (`manifest.txt` y `catalogo_2026-10-17.bak`) y compara su contenido con el catálogo real que está en producción (`/srv/invernadero/catalogo/catalogo_publico.csv`). ¿Es seguro restaurar ese backup o dañarías la información actual?
5. **Paso 2.5 — Contén solo después de registrar la evidencia** — Ya tienes documentada toda la evidencia en tu bitácora. Ahora detén únicamente el proceso `polilla_emisora` utilizando su PID, y comprueba inmediatamente después que la tarea legítima (`riego_nocturno.sh`) y el servidor web (`nginx`) sigan funcionando sin interrupciones.

### Pistas

- **Paso 2.1: Correlación de registros e hipótesis** | Repasar el registro de actividad y listar todos los procesos en ejecución | `sudo cat /var/log/invernadero/actividad.log && ps aux`
- **Paso 2.2: Inspección del proceso sospechoso** | Filtrar los procesos de interés y leer el código de ambos scripts | `ps aux | grep polilla_emisora && cat /tmp/polilla_emisora && cat /opt/invernadero/scripts/riego_nocturno.sh`
- **Paso 2.3: Validación del artefacto con extensión engañosa** | Ver permisos, comprobar tipo de archivo, leer su contenido y calcular su hash | `ls -la /tmp/catalogo_orquideas.pdf && file /tmp/catalogo_orquideas.pdf && cat /tmp/catalogo_orquideas.pdf && sha256sum /tmp/catalogo_orquideas.pdf`
- **Paso 2.4: Inspección y validación del respaldo** | Listar la carpeta de backups y comparar el contenido del archivo `.bak` con el catálogo activo | `ls -la /var/backups/invernadero && cat /var/backups/invernadero/manifest.txt && cat /var/backups/invernadero/catalogo_2026-10-17.bak && cat /srv/invernadero/catalogo/catalogo_publico.csv`
- **Paso 2.5: Contención controlada del proceso** | Detener el proceso sospechoso por su PID y verificar que los servicios legítimos sigan activos | `sudo kill -15 PID && ps aux`

### Guía Pedagógica

#### Paso 2.1: Correlaciona los eventos y formula una hipótesis

> Una buena investigación no fuerza una conclusión cuando los datos no la respaldan; primero cruza los avisos de los registros con lo que realmente está ocurriendo en el sistema.

- Repasar las alertas de los registros `sudo cat /var/log/invernadero/actividad.log && sudo cat /var/log/invernadero/incidentes.log`
  - _Recuerda los elementos señalados a partir de las 21:03: el script de riego, el archivo en /tmp y el proceso desconocido polilla_emisora._
- Contrastar con los procesos reales en ejecución `ps aux`
  - _Al listar todos los procesos activos en memoria, verás que tanto `/opt/invernadero/scripts/riego_nocturno.sh` como `/tmp/polilla_emisora` se están ejecutando en este momento._
- Formular hipótesis provisional fundamentada
  - _Ambos procesos existen en memoria, pero el hecho de que polilla_emisora se ejecute desde la carpeta temporal (/tmp) y no esté documentado exige inspeccionar su contenido antes de tomar una decisión._

#### Paso 2.2: Inspecciona el proceso sospechoso en ejecución

> Por qué se inspecciona primero: si detienes un proceso antes de revisarlo, pierdes su rastro en ejecución (como su PID o qué usuario lo inició). Además, debes asegurarte de no detener por error una tarea crítica del sistema.

- Identificar el PID y la ruta del proceso sospechoso `ps aux | grep polilla_emisora`
  - _En la salida de ps aux, anota el número de la primera columna (PID) correspondiente a `/tmp/polilla_emisora`._
- Leer el contenido del script sospechoso `cat /tmp/polilla_emisora`
  - _Como es un script de texto, puedes leer su código con cat. Verás que solo ejecuta un bucle de espera (`sleep 60`): es un proceso simulado e inofensivo creado para esta práctica._
- Comparar con el script legítimo de riego `cat /opt/invernadero/scripts/riego_nocturno.sh`
  - _Este script escribe periódicamente la verificación del ciclo en `/var/log/invernadero/riego.log`. Es parte de la operación normal de la estación y no debe detenerse._
- Registrar la evidencia antes de actuar
  - _Anota en el Cuaderno de Campo el PID, la ruta `/tmp/polilla_emisora` y lo que contiene el script antes de pasar a la contención._

#### Paso 2.3: Valida el archivo con extensión engañosa

> No es correcto afirmar que se encontró malware real: al inspeccionar el archivo comprobamos que es un señuelo de texto plano creado por el laboratorio.

- Inspeccionar detalles y tipo del archivo `ls -la /tmp/catalogo_orquideas.pdf && file /tmp/catalogo_orquideas.pdf`
  - _Registra su propietario, permisos y la confirmación de que su contenido real es texto plano (ASCII text) a pesar de terminar en .pdf._
- Leer el contenido del archivo de forma segura `cat /tmp/catalogo_orquideas.pdf`
  - _Al ser texto plano, podemos leerlo en la terminal con cat (o head). El texto confirma explícitamente que es un archivo de simulación del laboratorio LILIUM._
- Registrar la huella SHA-256 y preservar el archivo `sha256sum /tmp/catalogo_orquideas.pdf`
  - _Guarda el hash en tu bitácora como evidencia. No borres el archivo de `/tmp`: conservarlo permite respaldar tus conclusiones en la auditoría._

#### Paso 2.4: Evalúa si el respaldo puede utilizarse

> Límite del escenario: nunca se debe restaurar una copia de seguridad a ciegas sin antes comprobar que su contenido esté completo, ya que un backup defectuoso puede destruir datos válidos en producción.

- Explorar la carpeta de copias de seguridad `ls -la /var/backups/invernadero && cat /var/backups/invernadero/manifest.txt`
  - _El archivo manifest.txt indica que el respaldo corresponde a `catalogo_publico.csv`, pero debemos revisar el archivo `.bak` real._
- Leer el contenido del archivo de respaldo `cat /var/backups/invernadero/catalogo_2026-10-17.bak`
  - _Al leerlo, verás que solo contiene la frase `BACKUP SIMULADO: CONTENIDO INCOMPLETO`, por lo que no posee los datos reales de las plantas._
- Comparar con el catálogo activo en producción `cat /srv/invernadero/catalogo/catalogo_publico.csv`
  - _El catálogo en `/srv/invernadero/catalogo/catalogo_publico.csv` sí tiene los registros completos y válidos. Si restauráramos el backup encima de este archivo, provocaríamos pérdida de información._
- Registrar decisión de no restauración
  - _Documenta en la bitácora que el respaldo es inválido/incompleto y que no debe utilizarse para restaurar hasta generar una copia íntegra._

#### Paso 2.5: Contén solo después de registrar la evidencia

> Conclusión apropiada: se detiene únicamente el proceso no autorizado tras haber documentado su evidencia, verificando que los servicios esenciales continúen operando.

- Confirmar el PID de `polilla_emisora` `ps aux | grep polilla_emisora`
  - _Verifica el número de PID del proceso `/tmp/polilla_emisora` (no uses la palabra "PID" literal, sino el número que te muestre la terminal)._
- Detener el proceso de forma ordenada `sudo kill -15 PID`
  - _Reemplaza PID por el número correspondiente. La señal `-15` (SIGTERM) solicita al proceso que finalice de manera limpia y controlada._
- Verificar que el proceso sospechoso ya no esté activo `ps aux`
  - _Revisa la lista de procesos y confirma que `/tmp/polilla_emisora` desapareció._
- Confirmar la continuidad de la operación legítima `ps aux | grep riego_nocturno.sh && systemctl status nginx`
  - _Comprueba que el script `riego_nocturno.sh` sigue corriendo en memoria y que el servidor web `nginx` permanece activo (running). No borres los archivos de `/tmp`._

### Verificaciones

- v2-hyp | Hipótesis provisional apoyada por fuentes identificadas y cronología.
- v2-proc | Evidencia del proceso registrada antes de detenerlo.
- v2-pdf | Naturaleza del archivo .pdf comprobada sin ejecutarlo.
- v2-bak | Respaldo validado y clasificado correctamente como incompleto.
- v2-kill | Acción de contención justificada y resultado comprobado.
- v2-srv | Verificación de que los procesos y servicios legítimos no se detuvieron como efecto colateral.
- v2-rigor | La bitácora no presenta las simulaciones como un ataque real.

---

## FASE 3: Hardening: aplicar y verificar controles

> subtitle: Reducir debilidades identificadas con medidas proporcionales al riesgo, verificando que no se dañe la continuidad operativa.

### Directivas

1. **Paso 3.1 — Restringe la cuenta obsoleta** — La cuenta `ex_cuidador` pertenece a alguien que ya no trabaja en la estación. Aunque su contraseña figuraba bloqueada, en `/etc/passwd` viste que aún tiene asignada una terminal interactiva (`/bin/bash`). Utiliza `usermod` para cambiar su shell a `/usr/sbin/nologin` y asegurar el bloqueo de la cuenta sin borrar el usuario ni su carpeta personal.
2. **Paso 3.2 — Protege la clave de prueba y el informe confidencial** — En la Fase 1 detectaste que tanto la clave privada `/home/cuidador/.ssh/id_ed25519` como el archivo `/srv/invernadero/informes/registro_confidencial.csv` tenían permisos `0644` (`-rw-r--r--`), permitiendo que cualquiera los lea. Utiliza `chmod` para restringir sus permisos a `600` (solo lectura y escritura para su propietario) y comprueba el cambio con `ls -l`.
3. **Paso 3.3 — Reduce la superficie de ataque sin afectar el panel** — Al revisar los puertos con `ss -tulpn`, viste que el servicio `ssh` escucha en todas las interfaces (`0.0.0.0:22`), mientras que `nginx` atiende el panel local (`127.0.0.1:8080`). Dado que trabajas desde la consola local de la estación y el acceso remoto por SSH no es necesario, deshabilita y detén el servicio `ssh` con `systemctl`, asegurándote de que `nginx` siga funcionando.
4. **Paso 3.4 — Revisa el estado de actualización y define la acción segura** — Los programas desactualizados pueden tener fallos de seguridad, pero actualizar paquetes a ciegas en medio de una auditoría puede interrumpir servicios críticos. Consulta con `apt` qué paquetes tienen actualizaciones pendientes y registra por qué la decisión correcta es programar una ventana de mantenimiento en lugar de actualizar ahora.
5. **Paso 3.5 — Verifica los controles y cierra el Cuaderno de Campo** — Ninguna mejora de seguridad está completa sin comprobar su resultado. Vuelve a revisar `/etc/passwd`, los permisos de los dos archivos protegidos, los puertos en escucha y los procesos activos para confirmar que todos tus controles quedaron aplicados y que tanto `nginx` como `riego_nocturno.sh` siguen funcionando normalmente.

### Pistas

- **Paso 3.1: Restricción de cuenta obsoleta** | Asignar shell `/usr/sbin/nologin`, asegurar el bloqueo de `ex_cuidador` y comprobar `/etc/passwd` | `sudo usermod -s /usr/sbin/nologin ex_cuidador && sudo usermod -L ex_cuidador && grep ex_cuidador /etc/passwd`
- **Paso 3.2: Protección de archivos sensibles** | Cambiar los permisos de ambos archivos a `600` y verificar con `ls -l` | `sudo chmod 600 /home/cuidador/.ssh/id_ed25519 && sudo chmod 600 /srv/invernadero/informes/registro_confidencial.csv && ls -l /home/cuidador/.ssh/id_ed25519 /srv/invernadero/informes/registro_confidencial.csv`
- **Paso 3.3: Reducción de superficie de red** | Deshabilitar y detener el servicio `ssh` y comprobar el estado de los puertos y de `nginx` | `sudo systemctl disable --now ssh && systemctl status ssh && systemctl status nginx && sudo ss -tulpn`
- **Paso 3.4: Estado de actualización y parches** | Consultar la versión del kernel y listar los paquetes con actualizaciones disponibles | `uname -r && apt list --upgradable`
- **Paso 3.5: Verificación global de controles y cierre** | Comprobar el estado final de la cuenta, permisos, servicios, puertos y procesos | `grep ex_cuidador /etc/passwd && ls -l /home/cuidador/.ssh/id_ed25519 /srv/invernadero/informes/registro_confidencial.csv && sudo ss -tulpn && ps aux`

### Guía Pedagógica

#### Paso 3.1: Restringe la cuenta obsoleta

> Por qué importa: las cuentas de ex-empleados aumentan el riesgo de accesos no autorizados. Impedir su inicio de sesión interactivo y bloquearlas reduce ese riesgo, mientras que conservar la cuenta (sin borrarla) mantiene el registro histórico para la auditoría.

- Revisar el estado actual de la cuenta `grep ex_cuidador /etc/passwd && sudo passwd -S ex_cuidador`
  - _Observa que aunque la contraseña aparece bloqueada (L), al final de la línea en /etc/passwd todavía figura `/bin/bash`._
- Asignar una shell que impida iniciar sesión `sudo usermod -s /usr/sbin/nologin ex_cuidador`
  - _Reemplaza `/bin/bash` por `/usr/sbin/nologin`, evitando que la cuenta pueda abrir una terminal interactiva incluso si se intentara otro método de acceso._
- Confirmar el bloqueo de la cuenta `sudo usermod -L ex_cuidador`
  - _Asegura formalmente el estado de bloqueo de la contraseña de la cuenta._
- Verificar que el cambio se aplicó correctamente `grep ex_cuidador /etc/passwd && sudo passwd -S ex_cuidador`
  - _Comprueba que la línea de `ex_cuidador` en `/etc/passwd` ahora termina en `/usr/sbin/nologin`. No elimines el usuario ni su carpeta `/home/ex_cuidador`._

#### Paso 3.2: Protege la clave de prueba y el informe confidencial

> Por qué importa: el principio de mínimo privilegio establece que solo quienes necesitan un archivo deben poder leerlo. El permiso `600` (`-rw-------`) garantiza que únicamente el propietario tenga lectura y escritura, quitando el acceso al grupo y al resto de usuarios.

- Revisar los permisos actuales antes de modificarlos `ls -l /home/cuidador/.ssh/id_ed25519 /srv/invernadero/informes/registro_confidencial.csv`
  - _Ambos archivos muestran `-rw-r--r--` (0644), lo que significa que el grupo y otros usuarios pueden leer su contenido._
- Restringir los permisos de la clave privada SSH `sudo chmod 600 /home/cuidador/.ssh/id_ed25519`
  - _Las claves privadas SSH siempre deben tener permisos `600` para que ningún otro usuario del sistema pueda copiarlas y suplantar esa identidad._
- Restringir los permisos del informe confidencial `sudo chmod 600 /srv/invernadero/informes/registro_confidencial.csv`
  - _Protege el archivo dejándolo accesible solo a su propietario hasta que la administración defina formalmente qué usuarios requieren acceso._
- Comprobar los nuevos permisos aplicados `ls -l /home/cuidador/.ssh/id_ed25519 /srv/invernadero/informes/registro_confidencial.csv`
  - _Verifica que ambos archivos muestren ahora `-rw-------`. Anota esta evidencia en tu Cuaderno de Campo._

#### Paso 3.3: Reduce la superficie de ataque sin afectar el panel

> El objetivo no es apagar todos los servicios, sino desactivar aquellos que exponen puertos innecesarios en la red, conservando los que sostienen la operación del invernadero.

- Revisar los servicios y puertos abiertos actualmente `systemctl --type=service && sudo ss -tulpn`
  - _Observa que `ssh` escucha en `0.0.0.0:22` (abierto a la red) y `nginx` en `127.0.0.1:8080` (panel local)._
- Evaluar el estado de Nginx y SSH `systemctl status nginx && systemctl status ssh`
  - _Nginx cumple una función operativa declarada en el inventario; en cambio, el servidor SSH no es necesario para la operación local de la estación y ya registró intentos de acceso fallidos._
- Deshabilitar y detener el servicio SSH `sudo systemctl disable --now ssh`
  - _El comando `disable --now` detiene el servicio inmediatamente y evita que vuelva a iniciarse cuando se reinicie el equipo._
- Comprobar el resultado en los servicios y puertos `systemctl status ssh && systemctl status nginx && sudo ss -tulpn`
  - _Verifica que `ssh` aparezca como `inactive (dead)` y que el puerto 22 ya no esté en la lista de `ss -tulpn`, mientras que `nginx` sigue activo en el puerto 8080._

#### Paso 3.4: Revisa el estado de actualización y define la acción segura

> Resultado esperado: identificar qué paquetes tienen actualizaciones disponibles y documentar un plan de mantenimiento, sin ejecutar actualizaciones a ciegas que puedan afectar el entorno auditado.

- Consultar la versión del kernel y los paquetes instalados `uname -r && dpkg -l`
  - _Permite dejar registro de las versiones exactas que están corriendo actualmente en el servidor._
- Consultar qué paquetes tienen actualizaciones pendientes `apt list --upgradable`
  - _Verás que `openssh-server` aparece con una actualización disponible en los repositorios._
- Decidir no actualizar durante la auditoría
  - _No ejecutes `apt upgrade`. En un entorno productivo o bajo investigación, aplicar actualizaciones sin una ventana de mantenimiento ni un respaldo válido previo (recuerda que el backup estaba incompleto) puede interrumpir el servicio._
- Documentar la recomendación en la bitácora
  - _Registra el paquete pendiente de actualización y recomienda programar su aplicación una vez que se cuente con un respaldo íntegro del sistema._

#### Paso 3.5: Verifica los controles y cierra el Cuaderno de Campo

> Criterio de cierre: toda medida aplicada debe verificarse con un comando que confirme el estado final, dejando asentados también los temas pendientes que requieren seguimiento.

- Verificar la restricción de la cuenta `ex_cuidador` `grep ex_cuidador /etc/passwd && sudo passwd -S ex_cuidador`
  - _Confirma que tiene asignado `/usr/sbin/nologin` y su contraseña continúa bloqueada (L)._
- Verificar los permisos de los archivos sensibles `ls -l /home/cuidador/.ssh/id_ed25519 /srv/invernadero/informes/registro_confidencial.csv`
  - _Confirma que ambos muestran `-rw-------` (modo 600)._
- Verificar los puertos abiertos y el funcionamiento de Nginx `systemctl status nginx && sudo ss -tulpn`
  - _Confirma que solo el puerto `127.0.0.1:8080` de Nginx sigue en escucha y que el puerto 22 de SSH ya no está expuesto._
- Verificar los procesos en ejecución `ps aux`
  - _Confirma que `polilla_emisora` ya no existe en memoria y que `riego_nocturno.sh` sigue funcionando normalmente._
- Completar el Cuaderno de Campo y documentar riesgos pendientes
  - _Resume el estado inicial, las evidencias encontradas, los controles aplicados y los puntos que quedan pendientes para el equipo de TI (generar un backup completo del catálogo, aplicar actualizaciones programadas y verificar físicamente el router/firewall)._

### Verificaciones

- v3-acc | La cuenta obsoleta quedó restringida sin ser eliminada.
- v3-perms | Los permisos de los archivos sensibles coinciden con la decisión documentada (modo 600).
- v3-ssh | Los servicios innecesarios (SSH) se deshabilitaron solo tras confirmar que no eran requeridos.
- v3-alive | Nginx y el proceso legítimo de riego conservan el estado esperado.
- v3-patch | El estado de actualización quedó documentado sin ejecutar una actualización fuera de control.
- v3-post | Cada control tiene una evidencia posterior que demuestra su resultado.
- v3-residual | Se documentaron los riesgos residuales y las acciones que exceden el alcance de esta VM.
