# Documento de Diseño y Contexto: Laboratorio 1

## "El Invernadero" (Estación Botánica Automatizada N.º 4)

**Módulo:** 1 — Comprender (Fundamentos de Ciberseguridad, Redes y Sistemas Operativos y Mentalidad de Seguridad)

---

## 1. Filosofía del Laboratorio: "Exploración Curiosa, Cero Presión"

Este laboratorio se aleja deliberadamente de dos clichés habituales en la enseñanza de ciberseguridad: el estrés competitivo de los _Capture The Flag_ (CTF) y el aburrimiento corporativo de las "PyMEs ficticias de contabilidad o tornillos".

Nuestra filosofía de diseño e interacción se rige por cuatro pilares:

1. **Misterio Analógico y _Whimsy_ (Toque Fantástico/Curioso):**
   El estudiante no audita una oficina gris, sino que toma el control de una máquina con alma e historia: un invernadero automatizade que cultiva especies botánicas raras y escucha señales atmosféricas. Investigar el sistema se siente como abrir un reloj antiguo o explorar una cabaña abandonada llena de notas y aparatos funcionando a medias.
2. **Anti-CTF (Sin relojes ni banderas crípticas):**
   La validación ocurre de forma orgánica: cuando el usuario repara un permiso o apaga un servicio inseguro desde la terminal de Linux, **el entorno reacciona en vivo**. Las luces del invernadero se estabilizan, las alertas rojas se calman y el _Cuaderno de Campo_ registra el hallazgo como una anotación de bitácora.
3. **Espíritu _Sandbox_ (Libertad para tocar y romper):**
   El sistema no es un camino lineal rígido que responde _"Comando no permitido"_ cada vez que el usuario se sale del guion. El sistema de archivos virtual (FHS), la tabla de procesos y la pila de red están interconectados. Si el usuario siente curiosidad por ver qué pasa si le pone permisos `000` al catálogo web o si detiene el servidor principal, **el laboratorio se lo permite** y le muestra la consecuencia real (ej. caída de la Disponibilidad en la Tríada CIA).
4. **Red de Seguridad Visible (_Snapshots_):**
   Para que la experimentación sea 100% libre de ansiedad, el escritorio cuenta siempre con el botón **"Rebobinar Cinta (Restaurar Snapshot)"**. Romper el sistema operativo deja de ser un error y pasa a ser un experimento didáctico seguro.

---

## 2. Narrativa y Contexto del Caso (Texto de Bienvenida para el Usuario)

> ### Bienvenido/a a la Estación Botánica
>
> Has sido reclutado de forma anónima para operar y restaurar la seguridad de una estación botánica olvidada. Acabas de conectarte de forma remota a **`invernadero-central`**, el servidor Linux que mantiene con vida la Estación Botánica Automatizada N.º 4. En este domo de vidrio se cultivan helechos raros, y semillas antiguas que requieren condiciones exactas de humedad, temperatura y luz ultravioleta.
>
> Has encontrado esta computadora en un estado olvidado: Aparentemente el cuidador anterior, desapareció misteriosamente y dejó todo funcionando "en piloto automático".
>
> Desde ayer a la medianoche, el invernadero empezó a comportarse de forma extraña:
>
> - Los ventiladores se prenden al máximo sin motivo aparente (el procesador del servidor está al límite).
> - Las lámparas UV parpadean como si alguien estuviera enviando mensajes por la red local.
> - El registro central de eventos parece haber viajado en el tiempo: mezcla alertas de 1999 con eventos de hoy.
> - Hay notas ocultas del antiguo cuidador repartidas por las carpetas del sistema advirtiendo sobre "visitantes nocturnos en los cables".
>
> Tu misión es entrar al sistema como operario de seguridad, explorar sus rincones desde la terminal, entender qué está pasando ayudándote con las apps de los monitores de la estación y devolverle el equilibrio al invernadero sin interrumpir el cuidado de las plantas.

---

## 3. Ecosistema del Escritorio: Terminal + Aplicaciones Conectadas

Para que los conceptos abstractos del Módulo 1 cobren sentido físico, el laboratorio presenta un entorno compartido donde **la Terminal de Linux es el motor real** y las aplicaciones gráficas son **espejos reactivos** de ese mismo estado:

### A. `Terminal.sh` (El Corazón Operativo)

Una consola Linux estándar donde el usuario opera inicialmente como `cuidador@invernadero-central:~$` y puede elevar privilegios con `sudo`.

- Permite navegar libremente por `/etc`, `/var/log`, `/tmp`, `/home/cuidador`, `/opt` y `/var/www`.
- Soporta tuberías (`|`), redirecciones (`>`, `>>`) y las banderas reales de los comandos de diagnóstico, archivos, permisos, procesos y red vistos en el módulo.

### B. `BioMonitor_EDR.app` (Tu EDR resignificado como "Monitor Biológico del Host")

En lugar de un panel corporativo estático, el EDR es el **sensor de signos vitales del servidor del invernadero**. Lee en tiempo real la tabla de procesos (`ps`/`top`) y el directorio `/tmp`.

- **Para qué sirve en el Lab:** Enseña cómo funciona la detección por comportamiento/heurística y el concepto crítico de **Falsos Positivos**.
- **Interacción real:** El EDR muestra dos alertas activas al iniciar:
  1. **Alerta Amarilla (Falso Positivo):** Detecta un script automatizado llamado `/opt/riego_helechos.sh` que se ejecuta cada hora. El usuario debe ir a la terminal, leer el código con `cat` o `less`, comprobar que es inofensivo y marcarlo en el EDR como _Actividad Legítima Validada_.
  2. **Alerta Roja (Amenaza Real):** Detecta un comportamiento anómalo ejecutándose bajo el usuario del servidor web (`www-data`) y un archivo sospechoso en `/tmp`. Cuando el usuario usa `file`, `kill` y `rm` en la terminal, el EDR actualiza su telemetría en vivo a estado saludable.

### C. `CronoLog_SIEM.app` (El SIEM resignificado como "Bitácora de Correlación")

El SIEM centraliza los registros de `/var/log/auth.log`, `/var/log/syslog` y los eventos del firewall interno.

- **Para qué sirve en el Lab:** Enseña centralización de logs, reducción de ruido, detección de fuerza bruta y la importancia vital del protocolo **NTP (sincronización de tiempo)**.
- **Interacción real:**
  - Al abrir el SIEM por primera vez, la línea de tiempo está rota (los eventos saltan entre el año 1999 y el presente porque el reloj del sistema perdió sincronía).
  - Cuando el usuario va a la terminal, revisa `systemctl status ntp.service` y lo enciende con `sudo systemctl start ntp.service`, **la tabla del SIEM se ordena mágicamente en vivo**, revelando la secuencia exacta (Cyber Kill Chain) de cómo entró una conexión no autorizada por un puerto obsoleto.

### D. `Domo_Control.web` y `Termómetro_CIA` (El Impacto en el Negocio/Operación)

Un pequeño widget o vista del invernadero que muestra las plantas, los sensores y tres medidores correspondientes a la **Tríada CIA (Confidencialidad, Integridad, Disponibilidad)**.

- Si el usuario apaga el servidor web (`nginx.service`) o bloquea todos los puertos por miedo, el medidor de **Disponibilidad** cae a cero y las plantas entran en alerta de sequía.
- Si deja `/etc/shadow` o las llaves SSH con permisos `777`, el medidor de **Confidencialidad** parpadea en peligro.
- Si el archivo de configuración de nutrientes no coincide con su hash original (`sha256sum`), se alerta un fallo de **Integridad**.

---

## 4. Recorrido de Investigación ("la app de Playbook")

El usuario cuenta con una serie de curiosidades y anomalías anotadas en su cuaderno (roadmap, paso a paso, reescrito) que puede resolver en el orden que prefiera, explorando a su propio ritmo:

### Fase 1: Reconocimiento del Terreno y Secretos en el Disco

- **Conceptos del Módulo 1:** Jerarquía FHS (`/etc`, `/var/log`, `/tmp`, `/home`), `pwd`, `ls -lah`, `cd`, `cat`, `less`, `head`, `tail`, `grep`, `find`, `file`, `sha256sum`, Integridad.
- **El Misterio:** El cuidador anterior dejó una nota diciendo que escondió la guía de mantenimiento en una carpeta oculta dentro de su directorio personal, y que descargó un "catálogo de semillas en PDF" en `/tmp` justo antes de que todo empezara a fallar.
- **Lo que hace el usuario:**
  1. Usa `ls -la` en `/home/cuidador` para descubrir la carpeta oculta `.bitacora_botanica` y lee las pistas con `cat`.
  2. Va a `/tmp` y analiza `catalogo_semillas_raras.pdf` usando el comando `file`. Descubre que **no es un documento PDF**, sino un ejecutable binario (`ELF 64-bit LSB executable`) disfrazado (Troyano).
  3. En `/opt/formulas/` hay tres respaldos de la fórmula de nutrientes minerales (`formula_v1.dat`, `formula_v2.dat`, `formula_backup.dat`). Usando `sha256sum` y comparando contra el hash anotado por el cuidador en su bitácora, descubre cuál de los archivos fue adulterado y restaura el íntegro usando `cp` y `mv`.

### Fase 2: Domando los Fantasmas en la Memoria y Cerrando Candados

- **Conceptos del Módulo 1:** Procesos (`ps aux`, `top`, `kill -15`, `kill -9`), Servicios (`systemctl`), Permisos (`chmod`, `chown`), `/etc/passwd` vs `/etc/shadow`, Principio de Mínimo Privilegio, Falsos Positivos en EDR.
- **El Misterio:** El `BioMonitor_EDR` marca dos alertas de comportamiento y el ventilador del servidor no para de girar. Además, el cuidador dejó varios candados abiertos "por comodidad".
- **Lo que hace el usuario:**
  1. Abre el EDR, ve los PIDs sospechosos y los contrasta en la terminal con `ps aux` o `top`.
  2. Inspecciona `/opt/riego_helechos.sh`, confirma que es un proceso benigno de mantenimiento y descarta el **Falso Positivo** en el EDR.
  3. Identifica el proceso intruso (`./transmisor_esporas` corriendo bajo el usuario `www-data` con alto uso de CPU) y lo detiene limpiamente con `kill -15 <PID>`.
  4. Audita los permisos de archivos críticos: descubre que `/etc/shadow` y `/home/cuidador/.ssh/id_ed25519` tienen permisos abiertos (`777` / `644`). Aplica endurecimiento (_hardening_) ejecutando `sudo chmod 600` sobre ambos para restituir la Confidencialidad.

### Fase 3: El Reloj Desfasado y los Susurros en la Red

- **Conceptos del Módulo 1:** Sincronización `NTP`, Correlación en `SIEM`, Análisis de logs (`grep`, `tail -f`), Comandos de red (`ip a`, `ping -c 4`, `ss -tulpn`, `dig`, `curl -I`), Protocolos inseguros vs. seguros (`Telnet 23` vs `SSH 22`, `HTTP 80` vs `HTTPS 443`), DNS (`/etc/resolv.conf`).
- **El Misterio:** El `CronoLog_SIEM` muestra eventos desordenados en el tiempo y alguien parece seguir intentando entrar a la consola del invernadero desde afuera. Además, el dominio interno `panel.invernadero.local` no resuelve bien.
- **Lo que hace el usuario:**
  1. Levanta el servicio de tiempo con `sudo systemctl start ntp.service`. Al instante, el SIEM ordena los logs y revela múltiples intentos de acceso en `/var/log/auth.log`.
  2. Filtra el registro desde la terminal con `grep -i "failed" /var/log/auth.log` para identificar qué servicio están atacando.
  3. Ejecuta `ss -tulpn` para listar los puertos en escucha (`LISTEN`). Descubre que el vetusto servicio **Telnet (puerto 23)** sigue abierto transmitiendo todo en texto plano.
  4. Aplica **Reducción de Superficie de Ataque**: apaga Telnet (`sudo systemctl stop telnet.service`) y verifica que `ssh.service` (puerto 22) esté activo y seguro.
  5. Revisa `/etc/resolv.conf`, nota que el servidor DNS apunta a una IP desconocida, lo corrige con `nano /etc/resolv.conf` hacia el DNS interno legítimo (`10.0.1.1`) y comprueba la resolución con `dig` y `curl -I`.

---

## 5. Libertad Sandbox y "Easter Eggs" (Para Aprender Explorando)

Para premiar la curiosidad del estudiante que investiga más allá de las consignas:

- **Experimento SSH en vivo:** Si el estudiante intenta hacer `ssh localhost` mientras la llave privada `id_ed25519` tiene permisos `777`, la terminal emula el mensaje exacto de OpenSSH (`WARNING: UNPROTECTED PRIVATE KEY FILE!`) y rechaza la conexión hasta que lo cambie a `600`.
- **El peligro de apagar sin investigar:** Si el estudiante detiene `nginx.service` o mata el proceso del sensor de humedad sin leer antes para qué sirve, el panel visual del invernadero muestra una alerta amistosa: _"¡Ups! Las orquídeas acaban de quedarse sin telemetría de riego (Disponibilidad: 0%). Recuerda que en ciberseguridad buscamos proteger la continuidad operativa, no apagar todo por pánico."_
- **Curiosidades ocultas en el sistema de archivos:**
  - Hacer `cat /proc/cpuinfo` muestra especificaciones ficticias encantadoras (_"Procesador Bio-Cuántico Modelo Helecho v2.4"_).
  - Revisar `.bash_history` muestra los comandos torpes que tiró el cuidador anterior antes de irse de viaje (dando pistas naturales de qué tocó mal).
  - Usar `ping -c 4` hacia las IPs que figuran en `/etc/hosts` descubre sensores ocultos en el jardín exterior que responden con pequeños mensajes ASCII.

---

## 6. Mapeo Pedagógico con el Módulo 1

| Unidad del Módulo 1                         | Cómo se vive en "El Invernadero de Señales"                                                                                                                                                                                                                                                                                            |
| :------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1.1 Fundamentos y Riesgo (Tríada CIA)**   | Medidores vivos de Confidencialidad, Integridad y Disponibilidad que reaccionan a los cambios en la consola.                                                                                                                                                                                                                           |
| **1.2 Panorama de Amenazas**                | Detección de un binario camuflado como `.pdf` en `/tmp` (`file`) y trazabilidad del incidente en los logs.                                                                                                                                                                                                                             |
| **1.3 Marcos y Controles (NIST / CIS IG1)** | El _Cuaderno de Campo_ organiza las tareas siguiendo el ciclo _Identificar -> Proteger -> Detectar -> Responder_.                                                                                                                                                                                                                      |
| **1.4 Kit de Herramientas (SIEM / EDR)**    | Interacción real con `BioMonitor_EDR` (validación de falsos positivos vs amenazas) y `CronoLog_SIEM` (correlación de logs), creación de una platilla de bitácora en la app de notas con partes editables (+ notas estáticas) que el usuario puede completar y editar para documentar su proceso (apoya la parte teórica del módulo 1). |
| **1.5.A Redes y Protocolos**                | Uso de `ip a`, `ss -tulpn`, `ping`, `dig`, `curl -I`. Transición de Telnet (23) a SSH (22) y arreglo de DNS/NTP.                                                                                                                                                                                                                       |
| **1.5.B Sistemas Operativos (Linux)**       | Navegación FHS, `ls -la`, `cat/less/grep/find`, hashes con `sha256sum`, permisos con `chmod`, procesos con `ps/top/kill` y `systemctl`.                                                                                                                                                                                                |
| **1.6 Mentalidad de Seguridad**             | Aplicación práctica de Mínimo Privilegio, Reducción de Superficie de Ataque e Investigación Contextual antes de actuar.                                                                                                                                                                                                                |
