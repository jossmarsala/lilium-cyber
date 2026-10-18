'use client'

import React, { useEffect, useState, useMemo, type CSSProperties } from 'react'
import type { AppContentProps } from '@react-ui-os/core'
import { notify, useWindowManager } from '@react-ui-os/core'
import { useDesktopContext, useTheme } from '@react-ui-os/desktop'
import {
  labVerificationService,
  type FindingItem,
  type ReferenceDocItem,
} from '@/services/labVerificationService'
import { lab1Store, useLab1Store } from '@/services/lab1/lab1Store'
import { addRecent } from '@/pages/desktop/recents'
import {
  PdfDocIcon,
} from './SecurityIcons'
import styles from './TulipPlaybookApp.module.css'

export interface PlaybookPhase {
  id: string
  number: string
  title: string
  subtitle: string
  directives: {
    title: string
    text: string
  }[]
  hints: {
    tool: string
    description: string
    command?: string
  }[]
  pedagogicalGuide: {
    sectionTitle: string
    rationale: string
    steps: {
      action: string
      command?: string
      detail?: string
    }[]
  }[]
  verification: {
    id: string
    label: string
  }[]
}

const PLAYBOOK_PHASES: PlaybookPhase[] = [
  {
    id: 'fase-1',
    number: '01',
    title: 'FASE 1: Sincronización Temporal y Exploración de Rastros',
    subtitle: 'Reconocimiento del sistema de archivos, verificación de integridad y normalización de registros.',
    directives: [
      {
        title: 'Normalización de la línea de tiempo en registros',
        text: 'Los registros de auditoría presentan marcas de tiempo incoherentes (fechas desfasadas), lo que impide reconstruir la cronología de los eventos. Verifique el estado de los servicios del sistema encargados de la sincronización horaria e inicie el demonio correspondiente para restablecer la precisión temporal.',
      },
      {
        title: 'Rastreo de notas y validación de copias de seguridad',
        text: 'Explore el directorio personal del cuidador (/home/cuidador). Busque archivos ocultos dejados por su predecesor. En ellos encontrará la referencia criptográfica (huella digital) de los archivos de calibración de riego alojados en la carpeta de respaldos (backups). Compare las huellas digitales de las tres versiones disponibles para identificar cuál conserva su Integridad intacta y elimine o aísle las versiones adulteradas.',
      },
      {
        title: 'Inspección de áreas temporales',
        text: 'El directorio temporal del sistema (/tmp) permite la escritura a cualquier usuario y suele utilizarse para alojar artefactos sospechosos. Inspeccione su contenido sin ejecutar ningún archivo. Verifique la naturaleza real de los documentos allí alojados (más allá de su extensión visible) y elimine cualquier binario ejecutable camuflado.',
      },
    ],
    hints: [
      {
        tool: 'Gestión de servicios de tiempo',
        description: 'Consultar estado e iniciar el demonio NTP.',
        command: 'systemctl status ntp.service && sudo systemctl start ntp.service',
      },
      {
        tool: 'Navegación y archivos ocultos',
        description: 'El modificador -a revela elementos que inician con un punto.',
        command: 'cd /home/cuidador && ls -la',
      },
      {
        tool: 'Lectura segura de textos',
        description: 'Inspeccionar contenido sin alterar marcas de modificación.',
        command: 'cat .notas_cuidador.txt',
      },
      {
        tool: 'Verificación de Integridad',
        description: 'Calcular huella digital SHA-256 de archivos.',
        command: 'sha256sum /home/cuidador/backups/*',
      },
      {
        tool: 'Análisis de encabezados reales (Magic Numbers)',
        description: 'Determinar la naturaleza real del archivo y erradicarlo.',
        command: 'file /tmp/catalogo_orquideas.pdf && rm /tmp/catalogo_orquideas.pdf',
      },
    ],
    pedagogicalGuide: [
      {
        sectionTitle: '1. El rol del protocolo NTP en los registros de auditoría',
        rationale:
          'Para correlacionar eventos de seguridad y realizar un análisis forense válido, todos los relojes de una infraestructura deben estar sincronizados mediante NTP (Network Time Protocol). Si el servicio está detenido, los registros (logs) pierden su valor probatorio.',
        steps: [
          {
            action: 'Consulte el estado del servicio de sincronización horaria:',
            command: 'systemctl status ntp.service',
          },
          {
            action: 'Al confirmar que se encuentra inactivo (dead), inícielo con privilegios administrativos:',
            command: 'sudo systemctl start ntp.service',
            detail: 'Los registros se ordenan automáticamente de forma cronológica una vez sincronizado el tiempo.',
          },
        ],
      },
      {
        sectionTitle: '2. Descubrimiento de archivos ocultos y preservación de la Integridad',
        rationale:
          'En sistemas Linux, los archivos cuyos nombres inician con un punto (.) están ocultos por defecto para evitar modificaciones accidentales. Las funciones hash criptográficas generan huellas unívocas que permiten detectar cualquier manipulación de datos.',
        steps: [
          {
            action: 'Sitúese en el directorio del usuario y liste todos los archivos con formato detallado:',
            command: 'cd /home/cuidador && ls -la',
          },
          {
            action: 'Lea la nota dejada por el cuidador anterior:',
            command: 'cat .notas_cuidador.txt',
          },
          {
            action: 'Calcule los hashes criptográficos de las copias de seguridad de calibración:',
            command: 'sha256sum /home/cuidador/backups/*',
            detail: 'Compare los resultados con la nota del cuidador, registre el archivo legítimo en su Bitácora y elimine el archivo corrupto utilizando rm.',
          },
        ],
      },
      {
        sectionTitle: '3. Detección de archivos camuflados en /tmp',
        rationale:
          'Los atacantes frecuentemente disfrazan programas maliciosos utilizando extensiones inofensivas como .pdf o .jpg. Nunca debe confiarse en el nombre de un archivo; las herramientas forenses examinan los números mágicos del encabezado binario.',
        steps: [
          {
            action: 'Inspeccione la carpeta temporal:',
            command: 'ls -la /tmp',
          },
          {
            action: 'Examine los primeros bytes internos (magic numbers) sin abrir ni ejecutar:',
            command: 'file /tmp/catalogo_orquideas.pdf',
            detail: 'La salida revelará que no es un documento PDF, sino un binario ejecutable (ELF 64-bit LSB executable).',
          },
          {
            action: 'Elimine el artefacto malicioso de inmediato:',
            command: 'rm /tmp/catalogo_orquideas.pdf',
          },
        ],
      },
    ],
    verification: [
      {
        id: 'v1-ntp',
        label: 'El servicio ntp.service se encuentra en estado running y los registros del sistema están sincronizados.',
      },
      {
        id: 'v1-hash',
        label: 'El archivo de calibración adulterado ha sido identificado y purgado de /home/cuidador/backups.',
      },
      {
        id: 'v1-tmp',
        label: 'El ejecutable camuflado catalogo_orquideas.pdf ha sido eliminado de /tmp.',
      },
    ],
  },
  {
    id: 'fase-2',
    number: '02',
    title: 'FASE 2: Triaje de Telemetría y Procesos en Ejecución',
    subtitle: 'Análisis de comportamiento de procesos, distinción de falsos positivos y erradicación de procesos anómalos.',
    directives: [
      {
        title: 'Auditoría de procesos activos',
        text: 'Inspeccione desde la terminal todos los procesos que se están ejecutando en memoria, prestando especial atención a qué cuenta de usuario los invocó y qué porcentaje de procesador (CPU) consumen.',
      },
      {
        title: 'Validación de Falsos Positivos',
        text: 'Una de las alertas de proceso señala un script de automatización ubicado en /opt/sensores/. Antes de tomar una decisión drástica, inspeccione el código fuente de dicho script desde la terminal. Si comprueba que su lógica es legítima y necesaria para la supervivencia de las plantas, márcelo como Falso Positivo sin detener su ejecución.',
      },
      {
        title: 'Neutralización de amenazas activas',
        text: 'Identifique el proceso no autorizado que se ejecuta bajo el usuario del servidor web (www-data), el cual mantiene una conexión hacia un servidor de Comando y Control (C2) externo. Detenga su ejecución enviando una señal de terminación a su identificador de proceso (PID).',
      },
    ],
    hints: [
      {
        tool: 'Fotografía estática y monitor dinámico',
        description: 'Listar procesos o abrir monitor dinámico (presione q para salir).',
        command: 'ps aux',
      },
      {
        tool: 'Inspección del script sospechoso',
        description: 'Leer la rutina de control de humedad de las orquídeas.',
        command: 'cat /opt/sensores/riego_nocturno.sh',
      },
      {
        tool: 'Terminación limpia de procesos por PID',
        description: 'Enviar señal SIGTERM para cierre ordenado y flushing de logs.',
        command: 'sudo kill -15 <PID>',
      },
      {
        tool: 'Terminación forzada (último recurso)',
        description: 'Enviar SIGKILL si el proceso rehúsa liberar memoria.',
        command: 'sudo kill -9 <PID>',
      },
    ],
    pedagogicalGuide: [
      {
        sectionTitle: '1. Investigación contextual frente al pánico operativo',
        rationale:
          'Investigar el comportamiento de un proceso antes de bloquearlo preserva la Disponibilidad del sistema. Si usted detiene todos los procesos marcados sin investigarlos primero, destruirá la continuidad del sistema de riego botánico.',
        steps: [
          {
            action: 'Consulte la tabla de procesos activos en la máquina:',
            command: 'ps aux',
            detail: 'Notará dos procesos relevantes: /bin/bash /opt/sensores/riego_nocturno.sh (ejecutado por cuidador) y ./polilla_emisora --c2 198.51.100.44 (ejecutado por www-data consumiendo >60% de CPU).',
          },
        ],
      },
      {
        sectionTitle: '2. Descarte de Falso Positivo en procesos del sistema',
        rationale:
          'La investigación previa al bloqueo preserva la continuidad del negocio. Descartar un falso positivo evita la muerte de los especímenes vivos del domo.',
        steps: [
          {
            action: 'Revise qué hace realmente el script de riego:',
            command: 'cat /opt/sensores/riego_nocturno.sh',
          },
          {
            action: 'Marque la alerta de riego como Actividad Legítima Validada / Falso Positivo.',
          },
        ],
      },
      {
        sectionTitle: '3. Erradicación del proceso intruso',
        rationale:
          'Que la cuenta del servidor web (www-data) ejecute un programa oculto conectado a una IP externa es un indicador claro de explotación y comunicación de Comando y Control (C2).',
        steps: [
          {
            action: 'Tome nota del PID de polilla_emisora y envíe una señal SIGTERM limpia (código -15):',
            command: 'sudo kill -15 <PID>',
            detail: 'SIGTERM solicita al proceso cerrar sus conexiones y descriptores antes de finalizar, permitiendo que el sistema registre el evento en las bitácoras forenses.',
          },
          {
            action: 'Si el proceso persiste congelado, use SIGKILL para que el kernel lo desaloje de la RAM:',
            command: 'sudo kill -9 <PID>',
          },
        ],
      },
    ],
    verification: [
      {
        id: 'v2-edr',
        label: 'El script riego_nocturno.sh continúa en ejecución (running) y su alerta fue descartada como falso positivo.',
      },
      {
        id: 'v2-kill',
        label: 'El proceso malicioso polilla_emisora ha sido terminado y ya no figura en la salida de ps aux.',
      },
    ],
  },
  {
    id: 'fase-3',
    number: '03',
    title: 'FASE 3: Control de Identidades, Privilegios y Criptografía Local',
    subtitle: 'Aplicación del principio de mínimo privilegio y protección de credenciales.',
    directives: [
      {
        title: 'Protección del archivo de contraseñas cifradas',
        text: 'En Linux, mientras que la lista de usuarios es pública para el sistema, el archivo que almacena los hashes de las contraseñas en /etc/ debe ser estrictamente confidencial. Audite sus permisos actuales y corríjalos para que ningún usuario estándar pueda leerlo.',
      },
      {
        title: 'Reparación de llaves criptográficas SSH',
        text: 'El cuidador utilizaba un par de claves asimétricas (Ed25519) alojadas en su directorio oculto de configuración SSH para conectarse a otros módulos del invernadero. Actualmente, el cliente SSH se niega a operar debido a que la clave privada tiene permisos excesivamente abiertos. Restrinja los permisos de la clave privada para que sea legible y modificable exclusivamente por su propietario.',
      },
      {
        title: 'Endurecimiento del demonio SSH',
        text: 'Edite el archivo de configuración del servidor SSH en /etc/ssh/ para deshabilitar el inicio de sesión directo del superusuario (root), obligando a que toda administración se realice mediante cuentas nominales con elevación temporal de privilegios.',
      },
    ],
    hints: [
      {
        tool: 'Inspección de permisos actuales',
        description: 'Auditar permisos octales y pertenencia de archivos críticos.',
        command: 'ls -l /etc/shadow && ls -la /home/cuidador/.ssh/',
      },
      {
        tool: 'Modificación de permisos octales (POSIX)',
        description: 'Aplicar permisos restrictivos 600 (rw-------).',
        command: 'sudo chmod 600 /etc/shadow && chmod 600 ~/.ssh/id_ed25519',
      },
      {
        tool: 'Edición de configuración SSH',
        description: 'Editar configuración con nano (Ctrl+O para guardar, Ctrl+X para salir).',
        command: 'sudo nano /etc/ssh/sshd_config',
      },
      {
        tool: 'Reinicio de servicio tras cambios',
        description: 'Aplicar la nueva configuración del demonio SSH.',
        command: 'sudo systemctl restart ssh.service',
      },
    ],
    pedagogicalGuide: [
      {
        sectionTitle: '1. Separación entre /etc/passwd y /etc/shadow',
        rationale:
          'El archivo /etc/passwd enumera las cuentas del sistema y necesita ser legible por todos los procesos (644). Por el contrario, /etc/shadow contiene los hashes criptográficos de las contraseñas. Si /etc/shadow tiene permisos 777 (o lectura pública), cualquier atacante local puede copiar los hashes y descifrarlos mediante fuerza bruta fuera de línea.',
        steps: [
          {
            action: 'Verifique los permisos permisivos actuales:',
            command: 'ls -l /etc/shadow',
          },
          {
            action: 'Aplique el Principio de Mínimo Privilegio restringiendo los permisos a 600:',
            command: 'sudo chmod 600 /etc/shadow',
            detail: '600 otorga lectura (4) y escritura (2) exclusivamente a root, y cero permisos al resto de usuarios.',
          },
        ],
      },
      {
        sectionTitle: '2. Permisos estrictos en claves privadas SSH (id_ed25519)',
        rationale:
          'La criptografía asimétrica utiliza una clave pública (que se comparte) y una clave privada (que jamás debe divulgarse). Por seguridad por diseño, el cliente OpenSSH bloquea cualquier conexión si detecta que otros usuarios locales tienen permiso de lectura sobre la clave privada (UNPROTECTED PRIVATE KEY FILE).',
        steps: [
          {
            action: 'Inspeccione la clave en la carpeta del usuario:',
            command: 'ls -la ~/.ssh',
          },
          {
            action: 'Ajuste los permisos de la clave privada a 600:',
            command: 'chmod 600 ~/.ssh/id_ed25519',
          },
        ],
      },
      {
        sectionTitle: '3. Prohibición de acceso directo como root en SSH',
        rationale:
          'Permitir que múltiples operadores o atacantes intenten conectarse directamente como root destruye la trazabilidad (accountability) y facilita ataques de diccionario. Toda administración debe realizarse mediante cuentas nominales con elevación temporal (sudo).',
        steps: [
          {
            action: 'Abra la configuración del servidor SSH:',
            command: 'sudo nano /etc/ssh/sshd_config',
          },
          {
            action: 'Localice la directiva PermitRootLogin yes y cámbiela por PermitRootLogin no.',
          },
          {
            action: 'Reinicie el demonio SSH para cargar la directiva:',
            command: 'sudo systemctl restart ssh.service',
          },
        ],
      },
    ],
    verification: [
      {
        id: 'v3-shadow',
        label: '/etc/shadow posee permisos restrictivos (600 o 640).',
      },
      {
        id: 'v3-sshkey',
        label: '/home/cuidador/.ssh/id_ed25519 posee permisos 600 y no arroja advertencias al invocar ssh.',
      },
      {
        id: 'v3-sshd',
        label: '/etc/ssh/sshd_config establece PermitRootLogin no y el servicio fue reiniciado.',
      },
    ],
  },
  {
    id: 'fase-4',
    number: '04',
    title: 'FASE 4: Higiene de Red, Puertos en Escucha y Resolución DNS',
    subtitle: 'Reducción de la superficie de ataque, reemplazo de protocolos en texto plano y corrección de enrutamiento de nombres.',
    directives: [
      {
        title: 'Auditoría de puertos y sockets en escucha',
        text: 'Enumere todas las conexiones TCP y UDP que se encuentran esperando solicitudes entrantes (LISTEN) en el servidor, identificando qué proceso mantiene abierto cada puerto.',
      },
      {
        title: 'Transición de protocolos obsoletos a cifrados',
        text: 'Si observa el Monitor de Tráfico, notará que las sesiones de administración remota por el puerto TCP 23 exponen las credenciales letra por letra en texto plano. Desactive de forma definitiva este servicio obsoleto y asegúrese de que únicamente el servicio de administración remota cifrada en el puerto TCP 22 permanezca activo. (Recuerde no detener el servidor web en el puerto 80 para no interrumpir el panel hidropónico).',
      },
      {
        title: 'Restauración de la resolución de nombres (DNS)',
        text: 'Investigue cómo el sistema operativo está traduciendo los nombres de dominio. Inspeccione el archivo de configuración del resolutor DNS local en /etc/, elimine la dirección IP del servidor DNS no autorizado y apúntelo al servidor DNS legítimo de la red interna (10.0.2.1 o 1.1.1.1).',
      },
    ],
    hints: [
      {
        tool: 'Inspección de interfaces y puertos en escucha',
        description: 'Enumerar sockets TCP/UDP con números de puerto y procesos.',
        command: 'sudo ss -tulpn',
      },
      {
        tool: 'Desactivación de servicios inseguros',
        description: 'Detener y deshabilitar Telnet para evitar reinicios automáticos.',
        command: 'sudo systemctl stop telnet.service && sudo systemctl disable telnet.service',
      },
      {
        tool: 'Diagnóstico DNS y cabeceras web',
        description: 'Comprobar resolución de nombres y respuesta del panel web.',
        command: 'dig invernadero.local && curl -I http://127.0.0.1',
      },
      {
        tool: 'Corrección del resolutor DNS',
        description: 'Consultar y editar el archivo de servidores de nombres.',
        command: 'cat /etc/resolv.conf && sudo nano /etc/resolv.conf',
      },
    ],
    pedagogicalGuide: [
      {
        sectionTitle: '1. Identificación de servicios expuestos con ss',
        rationale:
          'Un servicio en escucha (listening service) es un programa que aguarda conexiones en un socket (combinación de dirección IP y puerto). Para reducir la superficie de ataque, todo servicio innecesario o inseguro debe cerrarse.',
        steps: [
          {
            action: 'Liste todos los puertos TCP (-t) y UDP (-u) en estado de escucha (-l):',
            command: 'sudo ss -tulpn',
            detail: 'Identificará el puerto :23 asociado a Telnet, un protocolo antiguo que carece de cifrado en tránsito.',
          },
        ],
      },
      {
        sectionTitle: '2. Reemplazo de Telnet por SSH',
        rationale:
          'Cualquier atacante que realice packet sniffing en la red puede leer contraseñas transmitidas por Telnet (TCP 23) en texto plano, mientras que SSH (TCP 22) protege la confidencialidad e integridad mediante un túnel criptográfico.',
        steps: [
          {
            action: 'Detenga y deshabilite Telnet definitivamente:',
            command: 'sudo systemctl stop telnet.service && sudo systemctl disable telnet.service',
          },
          {
            action: 'Verifique que SSH se encuentre activo:',
            command: 'systemctl status ssh.service',
          },
          {
            action: 'Confirme con ss -tulpn que el puerto 23 ya no figura en escucha.',
          },
        ],
      },
      {
        sectionTitle: '3. Remediación de envenenamiento / desvío DNS',
        rationale:
          'El protocolo DNS traduce nombres legibles (como panel.invernadero.local) en direcciones IP. Si un atacante modifica el archivo /etc/resolv.conf, puede redirigir a los operadores hacia sitios falsos de suplantación (phishing).',
        steps: [
          {
            action: 'Consulte qué servidor DNS está utilizando el sistema:',
            command: 'cat /etc/resolv.conf',
            detail: 'Verá la línea nameserver 10.66.6.6 (un servidor malicioso no autorizado).',
          },
          {
            action: 'Edite el archivo y cambie la dirección por el DNS confiable (nameserver 10.0.2.1 o 1.1.1.1):',
            command: 'sudo nano /etc/resolv.conf',
          },
          {
            action: 'Compruebe con dig que el dominio ahora resuelve a la IP legítima del invernadero:',
            command: 'dig invernadero.local',
          },
        ],
      },
    ],
    verification: [
      {
        id: 'v4-telnet',
        label: 'El puerto TCP 23 (telnet.service) se encuentra cerrado y deshabilitado.',
      },
      {
        id: 'v4-ports',
        label: 'Los puertos TCP 22 (SSH) y TCP 80 (Servidor Web del panel) permanecen activos y operativos.',
      },
      {
        id: 'v4-dns',
        label: 'El archivo /etc/resolv.conf apunta a un servidor DNS confiable y el navegador interno carga el panel legítimo.',
      },
    ],
  },
  {
    id: 'fase-5',
    number: '05',
    title: 'FASE 5: Segmentación de Red, Defensa en Profundidad y Cierre de Bitácora',
    subtitle: 'Aislamiento de zonas de confianza, contención del radio de explosión y validación final de la Tríada CIA.',
    directives: [
      {
        title: 'Aislamiento y Segmentación en el Firewall',
        text: 'Abra el Tablero de Zonas y Firewall. Configure las reglas de filtrado para limitar el movimiento lateral (tráfico este-oeste) y la exposición externa (tráfico norte-sur): Bloquee el acceso directo desde Internet (Zona Pública) hacia la subred de Sensores IoT y hacia la base de datos interna. Restrinja el acceso de administración remota (SSH, puerto 22) para que solo se permita desde el segmento interno autorizado y no desde cualquier dirección pública (0.0.0.0/0). Atención a la Disponibilidad: Mantenga permitido el canal de comunicación estrictamente necesario entre la subred de Sensores IoT (10.0.3.0/24) y el servidor central del invernadero para que los reportes de humedad y temperatura sigan llegando.',
      },
      {
        title: 'Comprobación del equilibrio CIA y entrega de Bitácora',
        text: 'Verifique que los indicadores de Confidencialidad, Integridad y Disponibilidad se encuentren simultáneamente en niveles óptimos (superiores al 90%) y complete el reporte final en su Cuaderno de Campo detallando los activos protegidos, las vulnerabilidades mitigadas y el estado en el que queda la estación.',
      },
    ],
    hints: [
      {
        tool: 'Verificación de conectividad y rutas',
        description: 'Comprobar tabla de enrutamiento y respuesta de telemetría de sensores.',
        command: 'ip route && ping -c 4 10.0.3.10',
      },
      {
        tool: 'Tablero de Control de Acceso (ACL / Firewall)',
        description: 'Alternar reglas de filtrado entre la Zona Pública, Laboratorio y Sensores IoT.',
      },
      {
        tool: 'Documentación Final',
        description: 'Registrar la bitácora y conclusiones en la app Cuaderno de Campo.',
      },
    ],
    pedagogicalGuide: [
      {
        sectionTitle: '1. ¿Por qué segmentar los dispositivos IoT?',
        rationale:
          'Los sensores automatizados (cámaras, medidores de humedad, controladores lumínicos) suelen poseer capacidades de seguridad limitadas y configuraciones vulnerables. En una red plana, si un atacante compromete una lámpara UV conectada a Internet, puede desplazarse lateralmente hacia el servidor principal. La segmentación divide la red en zonas de confianza aisladas mediante subredes y reglas de firewall (ACL), conteniendo el radio de explosión (blast radius).',
        steps: [
          {
            action: 'Configure las reglas en el Tablero de Firewall:',
            detail: 'Tráfico Norte-Sur (Internet -> Sensores IoT 10.0.3.0/24): BLOQUEAR (DENY). Los sensores no deben ser accesibles desde el exterior.',
          },
          {
            action: 'Tráfico Norte-Sur (Internet -> Puerto 22 SSH): BLOQUEAR (DENY) o restringir a la red de administración.',
          },
          {
            action: 'Tráfico Este-Oeste (Sensores IoT -> Servidor Puerto 80/443): PERMITIR (ALLOW) para no interrumpir el flujo botánico vital.',
          },
          {
            action: 'Compruebe desde la terminal que aún recibe respuesta de los sensores:',
            command: 'ping -c 4 10.0.3.10',
          },
        ],
      },
      {
        sectionTitle: '2. Registro y Auditoría Continua (NIST CSF 2.0)',
        rationale:
          'La seguridad no es un estado estático, sino un ciclo continuo de identificación, protección, detección, respuesta y recuperación. Finalice su intervención completando las secciones asistidas del Cuaderno de Campo, dejando constancia clara para cualquier operador futuro.',
        steps: [
          {
            action: 'Abra la aplicación Cuaderno de Campo (Notas) y complete el informe de custodia con las mitigaciones aplicadas.',
          },
        ],
      },
    ],
    verification: [
      {
        id: 'v5-firewall',
        label: 'El tráfico directo desde Internet hacia la subred de Sensores IoT y hacia el puerto 22 público está bloqueado.',
      },
      {
        id: 'v5-sensors',
        label: 'La comunicación interna de telemetría entre los sensores y el servidor central sigue activa (ping y reporte web exitosos).',
      },
      {
        id: 'v5-cia',
        label: 'El medidor de la Tríada CIA registra niveles óptimos en Confidencialidad, Integridad y Disponibilidad simultáneamente.',
      },
      {
        id: 'v5-notes',
        label: 'El Cuaderno de Campo (Bitácora) ha sido completado y guardado.',
      },
    ],
  },
]

export interface MatrixRowItem {
  id: string
  asset: string
  threat: string
  vulnerability: string
  ciaPillars: ('C' | 'I' | 'A')[]
  riskLevel: 'Crítico' | 'Alto' | 'Medio' | 'Bajo'
  cisControl: string
  mitigated: boolean
}

const STORAGE_KEY_MATRIX = 'tulip_lab_01_risk_matrix_v3'
const STORAGE_KEY_CHECKLIST = 'tulip_lab_01_playbook_checklist_v1'
const STORAGE_KEY_PHASES_DONE = 'tulip_lab_01_phases_completed_v1'

const INITIAL_MATRIX_ROWS: MatrixRowItem[] = [
  {
    id: 'row-1',
    asset: 'Clave privada SSH (~/.ssh/id_ed25519)',
    threat: 'Lectura no autorizada por usuarios locales o procesos anómalos',
    vulnerability: 'Permisos POSIX globales excesivos (644 en lugar de 600)',
    ciaPillars: ['C'],
    riskLevel: 'Alto',
    cisControl: 'CIS 3.3 — Protección de credenciales criptográficas en reposo',
    mitigated: false,
  },
  {
    id: 'row-2',
    asset: 'Proceso y C2 polilla_emisora (:4444)',
    threat: 'Canal encubierto hacia IP externa 198.51.100.44',
    vulnerability: 'Binario ejecutado bajo usuario www-data consumiendo >60% CPU',
    ciaPillars: ['I', 'A'],
    riskLevel: 'Crítico',
    cisControl: 'CIS 10.5 — Terminación ordenada de software no documentado (kill -15)',
    mitigated: false,
  },
  {
    id: 'row-3',
    asset: 'Hashes de contraseñas (/etc/shadow)',
    threat: 'Extracción de hashes de contraseñas para ataque de fuerza bruta offline',
    vulnerability: 'Permisos permisivos globales en archivo confidencial',
    ciaPillars: ['C', 'I'],
    riskLevel: 'Alto',
    cisControl: 'CIS 3.3 — Restricción de permisos POSIX (600 / root)',
    mitigated: false,
  },
  {
    id: 'row-4',
    asset: 'Demonio Telnet en texto plano (:23)',
    threat: 'Intercepción de credenciales en tránsito por falta de cifrado',
    vulnerability: 'Servicio Telnet obsoleto activo en 0.0.0.0:23',
    ciaPillars: ['C', 'I'],
    riskLevel: 'Alto',
    cisControl: 'CIS 4.8 — Deshabilitación de protocolos no seguros en texto plano',
    mitigated: false,
  },
  {
    id: 'row-5',
    asset: 'Resolución de nombres (/etc/resolv.conf)',
    threat: 'Redirección maliciosa del tráfico interno hacia DNS ilegítimo (10.66.6.6)',
    vulnerability: 'Servidor DNS no autorizado configurado en el sistema',
    ciaPillars: ['I', 'A'],
    riskLevel: 'Alto',
    cisControl: 'CIS 9.2 — Configuración de resolutores DNS autorizados',
    mitigated: false,
  },
]

export function TulipPlaybookApp({ focused }: AppContentProps) {
  const theme = useTheme()
  const desktopContext = useDesktopContext()
  const { openWindow } = useWindowManager()

  // Live state from Lab1 store
  const lab1LiveState = useLab1Store()

  // Interactive Checklist state
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_CHECKLIST)
        if (saved) return JSON.parse(saved)
      } catch (err) {
        console.warn('[TulipPlaybookApp] Error loading checklist:', err)
      }
    }
    return {}
  })

  // Phase completion state
  const [completedPhases, setCompletedPhases] = useState<Record<string, boolean>>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_PHASES_DONE)
        if (saved) return JSON.parse(saved)
      } catch (err) {
        console.warn('[TulipPlaybookApp] Error loading phases done:', err)
      }
    }
    return {}
  })

  // Collapsible dropdowns per phase: Pista (hint) & Solución (solution)
  const [openPistas, setOpenPistas] = useState<Record<string, boolean>>({})
  const [openSoluciones, setOpenSoluciones] = useState<Record<string, boolean>>({})

  // Findings and reference docs from service
  const [findings, setFindings] = useState<FindingItem[]>(() =>
    labVerificationService.getFindings()
  )
  const [referenceDocs, setReferenceDocs] = useState<ReferenceDocItem[]>(() =>
    labVerificationService.getReferences()
  )

  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  // Collapsible Native Drawers (Matrix, Expediente, Frameworks)
  const [showMatrix, setShowMatrix] = useState(false)
  const [showExpediente, setShowExpediente] = useState(false)
  const [showFrameworks, setShowFrameworks] = useState(false)

  // Risk Matrix State
  const [matrixRows, setMatrixRows] = useState<MatrixRowItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY_MATRIX)
        if (saved) return JSON.parse(saved)
      } catch (err) {
        console.warn('[TulipPlaybookApp] Error loading matrix:', err)
      }
    }
    return INITIAL_MATRIX_ROWS
  })

  // New Finding form state
  const [newFindingAsset, setNewFindingAsset] = useState('')
  const [newFindingThreat, setNewFindingThreat] = useState('')
  const [newFindingRisk, setNewFindingRisk] = useState<'Crítica' | 'Alta' | 'Medio' | 'Bajo'>('Alta')
  const [newFindingCia, setNewFindingCia] = useState<('C' | 'I' | 'A')[]>(['C'])

  // New PDF / Reference form state
  const [newDocTitle, setNewDocTitle] = useState('')
  const [newDocCategory, setNewDocCategory] = useState<'Framework' | 'Guía' | 'Estándar'>('Framework')
  const [newDocUrl, setNewDocUrl] = useState('')
  const [newDocFilename, setNewDocFilename] = useState('')

  // Subscriptions to service
  useEffect(() => {
    const unsubFindings = labVerificationService.subscribeFindings((updated) => {
      setFindings(updated)
    })
    const unsubDocs = labVerificationService.subscribeReferences((updated) => {
      setReferenceDocs(updated)
    })
    return () => {
      unsubFindings()
      unsubDocs()
    }
  }, [])

  // Dynamic automatic verification based on lab1LiveState
  useEffect(() => {
    if (!lab1LiveState) return

    const newChecks: Record<string, boolean> = { ...checkedItems }

    // Fase 1: NTP running
    if (lab1LiveState.isNtpSynced) {
      newChecks['v1-ntp'] = true
    }
    // Fase 1: Calibracion orquideas check
    if (!lab1LiveState.fs['/tmp/catalogo_orquideas.pdf']) {
      newChecks['v1-tmp'] = true
    }

    // Fase 2: Threat polilla_emisora terminated
    const polillaProc = lab1LiveState.processes.find((p) =>
      p.command.includes('polilla_emisora') && p.status === 'running'
    )
    if (!polillaProc) {
      newChecks['v2-kill'] = true
    }
    // Fase 2: Riego nocturno false positive resolved
    const edrRiego = lab1LiveState.edrAlerts.find((a) =>
      a.targetIdentifier.includes('riego_nocturno')
    )
    if (edrRiego && (edrRiego.resolved || edrRiego.status.includes('Legítima'))) {
      newChecks['v2-edr'] = true
    }

    // Fase 3: shadow perms
    const shadowNode = lab1LiveState.fs['/etc/shadow']
    if (shadowNode && (shadowNode.perms === '600' || shadowNode.perms === '640')) {
      newChecks['v3-shadow'] = true
    }
    // Fase 3: ssh key perms
    const sshKeyNode = lab1LiveState.fs['/home/cuidador/.ssh/id_ed25519']
    if (sshKeyNode && sshKeyNode.perms === '600') {
      newChecks['v3-sshkey'] = true
    }
    // Fase 3: sshd PermitRootLogin no
    const sshdConf = lab1LiveState.fs['/etc/ssh/sshd_config']
    if (sshdConf?.content?.includes('PermitRootLogin no')) {
      newChecks['v3-sshd'] = true
    }

    // Fase 4: Telnet stopped
    const telnetProc = lab1LiveState.processes.find((p) =>
      p.serviceName === 'telnet.service' && p.status === 'running'
    )
    if (!telnetProc) {
      newChecks['v4-telnet'] = true
    }
    // Fase 4: SSH and Web operational
    const sshRunning = lab1LiveState.processes.some((p) => p.serviceName === 'ssh.service' && p.status === 'running')
    const webRunning = lab1LiveState.processes.some((p) => p.serviceName === 'nginx.service' && p.status === 'running')
    if (sshRunning && webRunning) {
      newChecks['v4-ports'] = true
    }
    // Fase 4: DNS restored
    if (lab1LiveState.dnsServer !== '10.66.6.6') {
      newChecks['v4-dns'] = true
    }

    // Fase 5: CIA Triad
    if (lab1LiveState.cia.overallScore >= 80) {
      newChecks['v5-cia'] = true
    }

    // Determine phase completion based on checklist items
    const newPhasesDone: Record<string, boolean> = { ...completedPhases }
    for (const phase of PLAYBOOK_PHASES) {
      const allVerified = phase.verification.every((v) => newChecks[v.id])
      if (allVerified) {
        newPhasesDone[phase.id] = true
      }
    }

    setCheckedItems(newChecks)
    setCompletedPhases(newPhasesDone)

    try {
      localStorage.setItem(STORAGE_KEY_CHECKLIST, JSON.stringify(newChecks))
      localStorage.setItem(STORAGE_KEY_PHASES_DONE, JSON.stringify(newPhasesDone))
    } catch {
      // ignore
    }
  }, [lab1LiveState])

  const toggleCheckItem = (id: string, phaseId: string) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      try {
        localStorage.setItem(STORAGE_KEY_CHECKLIST, JSON.stringify(next))
      } catch {
        // ignore
      }

      // Check if all items in phase are now checked
      const targetPhase = PLAYBOOK_PHASES.find((p) => p.id === phaseId)
      if (targetPhase) {
        const allChecked = targetPhase.verification.every((v) =>
          v.id === id ? next[id] : next[v.id]
        )
        setCompletedPhases((pPrev) => {
          const pNext = { ...pPrev, [phaseId]: allChecked }
          try {
            localStorage.setItem(STORAGE_KEY_PHASES_DONE, JSON.stringify(pNext))
          } catch {
            // ignore
          }
          return pNext
        })
      }

      return next
    })
  }

  const togglePhaseCompleted = (phaseId: string) => {
    setCompletedPhases((prev) => {
      const isDone = !prev[phaseId]
      const next = { ...prev, [phaseId]: isDone }
      try {
        localStorage.setItem(STORAGE_KEY_PHASES_DONE, JSON.stringify(next))
      } catch {
        // ignore
      }

      // If marking as done, auto-check all verification items in that phase
      if (isDone) {
        const targetPhase = PLAYBOOK_PHASES.find((p) => p.id === phaseId)
        if (targetPhase) {
          setCheckedItems((cPrev) => {
            const cNext = { ...cPrev }
            for (const v of targetPhase.verification) {
              cNext[v.id] = true
            }
            try {
              localStorage.setItem(STORAGE_KEY_CHECKLIST, JSON.stringify(cNext))
            } catch {
              // ignore
            }
            return cNext
          })
        }
      }

      return next
    })
  }

  const togglePista = (phaseId: string) => {
    setOpenPistas((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }))
  }

  const toggleSolucion = (phaseId: string) => {
    setOpenSoluciones((prev) => ({ ...prev, [phaseId]: !prev[phaseId] }))
  }

  const completedCount = useMemo(
    () => PLAYBOOK_PHASES.filter((p) => completedPhases[p.id]).length,
    [completedPhases]
  )
  const percent = useMemo(
    () => Math.round((completedCount / (PLAYBOOK_PHASES.length || 1)) * 100),
    [completedCount]
  )

  const handleCopy = (text: string, key: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {})
      setCopiedKey(key)
      setTimeout(() => setCopiedKey(null), 2000)
    }
  }

  const handleVerifyNow = async () => {
    if (isChecking) return
    setIsChecking(true)
    try {
      // Refresh lab verification service if VM is active
      await labVerificationService.evaluateLab()

      // Notify user with current phase status
      const count = completedCount
      notify({
        title: count === 5 ? '¡Estación Asegurada!' : 'Auditoría de la Estación',
        body: `${count} de 5 fases completadas exitosamente. Tríada CIA: ${lab1LiveState?.cia.overallScore ?? 0}%.`,
        appId: 'playbook',
        level: count === 5 ? 'success' : 'info',
      })
    } finally {
      setTimeout(() => setIsChecking(false), 500)
    }
  }

  const handleFireToast = () => {
    notify({
      title: 'Manual de Operaciones — Invernadero Central',
      body: 'Nodo invernadero-central en línea. Modo Autónomo activo. Tríada CIA bajo supervisión.',
      appId: 'playbook',
      level: 'success',
    })
  }

  const handleAddRecentIncidentNote = () => {
    if (desktopContext?.storage) {
      const entryName = `Bitácora Invernadero ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      addRecent(desktopContext.storage, {
        name: entryName,
        kind: 'md',
      })
      notify({
        title: 'Elemento añadido a Recents',
        body: `Se ha generado "${entryName}" en el escritorio.`,
        appId: 'playbook',
        level: 'info',
      })
    }
  }

  const handleResetPhases = () => {
    if (
      typeof window !== 'undefined' &&
      window.confirm('¿Deseas reiniciar el progreso de las 5 fases del manual operativo?')
    ) {
      setCheckedItems({})
      setCompletedPhases({})
      try {
        localStorage.removeItem(STORAGE_KEY_CHECKLIST)
        localStorage.removeItem(STORAGE_KEY_PHASES_DONE)
      } catch {
        // ignore
      }
      notify({
        title: 'Fases Reiniciadas',
        body: 'El progreso del manual de operaciones ha vuelto a su estado inicial.',
        appId: 'playbook',
        level: 'info',
      })
    }
  }

  const saveMatrix = (rows: MatrixRowItem[]) => {
    setMatrixRows(rows)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_MATRIX, JSON.stringify(rows))
      } catch (err) {
        console.warn('[TulipPlaybookApp] Error saving matrix:', err)
      }
    }
  }

  const handleAddFinding = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFindingAsset.trim() || !newFindingThreat.trim()) return

    labVerificationService.addFinding({
      title: `Hallazgo: ${newFindingAsset}`,
      affectedAsset: newFindingAsset.trim(),
      observation: newFindingThreat.trim(),
      classification: 'Vulnerabilidad',
      ciaImpact: newFindingCia,
      priority: newFindingRisk,
      evidence: 'Inspección en estación invernadero-central',
      proposedAction: 'Aplicar principio de mínimo privilegio y remediación defensiva.',
      verification: 'Verificar atributos y auditoría con evaluadores del sistema.',
      status: 'Pendiente',
      source: 'Manual',
    })

    setNewFindingAsset('')
    setNewFindingThreat('')
    notify({
      title: 'Hallazgo Registrado',
      body: `Se incorporó "${newFindingAsset}" al expediente forense.`,
      appId: 'playbook',
      level: 'success',
    })
  }

  const handleToggleFindingStatus = (finding: FindingItem) => {
    const nextStatus = finding.status === 'Mitigado' ? 'Pendiente' : 'Mitigado'
    labVerificationService.updateFinding(finding.id, { status: nextStatus })
  }

  const handleAddCustomDoc = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDocTitle.trim()) return

    labVerificationService.addReference({
      title: newDocTitle.trim(),
      category: newDocCategory,
      description: newDocUrl ? `Vínculo externo: ${newDocUrl}` : `Documento adjunto: ${newDocFilename || 'pdf'}`,
      url: newDocUrl.trim() || undefined,
      filename: newDocFilename.trim() || undefined,
      isCustom: true,
      tags: ['Usuario', newDocCategory.toLowerCase()],
    })

    setNewDocTitle('')
    setNewDocUrl('')
    setNewDocFilename('')
    notify({
      title: 'Documento Vinculado',
      body: `"${newDocTitle}" agregado a la biblioteca de referencia.`,
      appId: 'playbook',
      level: 'success',
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setNewDocFilename(file.name)
      if (!newDocTitle) {
        setNewDocTitle(file.name.replace(/\.[^/.]+$/, ''))
      }
    }
  }

  // OS theme adaptations
  const dynamicBtnStyle: CSSProperties = {
    borderRadius: theme.shape.small || 6,
    borderColor: theme.palette.border,
  }

  const dynamicKbdStyle: CSSProperties = {
    borderRadius: theme.shape.small || 4,
    borderColor: theme.palette.border,
  }

  return (
    <div className={styles.container}>
      {/* ── Header: Atmospheric Lore from lab1-playbook.md ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 10.5, letterSpacing: '0.06em', textTransform: 'uppercase', opacity: 0.65, fontWeight: 700 }}>
            CLASIFICACIÓN: Confidencial / Operador Asignado
          </span>
          <span style={{ fontSize: 10, padding: '1px 6px', borderRadius: 4, background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', fontWeight: 600 }}>
            Modo Autónomo
          </span>
        </div>

        <h2 className={styles.title} style={{ marginTop: 2 }}>
          Manual de Operaciones y Auditoría: Estación `invernadero-central`
        </h2>

        <p className={styles.paragraph} style={{ marginTop: 2 }}>
          Bienvenido a la consola de administración de <strong>invernadero-central</strong>. Usted ha sido convocado de manera anónima para asumir el control técnico de esta estación botánica y observatorio de señales. El cuidador anterior interrumpió toda comunicación de forma abrupta; sin embargo, los registros locales sugieren que dejó notas y rastros deliberados en el sistema antes de su desaparición.
        </p>

        {/* ── Operational Continuity Warning Box ── */}
        <div
          style={{
            padding: '8px 12px',
            borderRadius: theme.shape.small || 6,
            background: 'rgba(245, 158, 11, 0.08)',
            borderLeft: '3px solid #fbbf24',
            borderTop: '1px solid rgba(245, 158, 11, 0.2)',
            borderRight: '1px solid rgba(245, 158, 11, 0.2)',
            borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
            fontSize: 12,
            lineHeight: 1.45,
            marginTop: 4,
          }}
        >
          <strong style={{ color: '#fbbf24', display: 'block', marginBottom: 2 }}>
            ADVERTENCIA CRÍTICA DE CONTINUIDAD OPERATIVA (TRÍADA CIA):
          </strong>
          Las especies botánicas alojadas en los sectores hidropónicos dependen estrictamente de los sistemas automatizados de riego, telemetría y control lumínico. En ciberseguridad, proteger un sistema no significa apagarlo: usted debe garantizar en todo momento el equilibrio de la <strong>Tríada CIA (Confidencialidad, Integridad y Disponibilidad)</strong>. Si detiene servicios vitales por precaución excesiva, la Disponibilidad caerá a cero y los especímenes biológicos perecerán.
        </div>
      </div>

      {/* ── Action Buttons matching Native OS pattern ── */}
      <div className={styles.actionsRow}>
        <button
          type="button"
          onClick={handleVerifyNow}
          disabled={isChecking}
          className={`${styles.demoButton} ${styles.demoButtonPrimary}`}
          style={dynamicBtnStyle}
        >
          {isChecking ? 'Verificando...' : '+ Verificar Estado'}
        </button>

        <button
          type="button"
          onClick={handleAddRecentIncidentNote}
          className={styles.demoButton}
          style={dynamicBtnStyle}
        >
          + Add to Recents
        </button>

        <button
          type="button"
          onClick={handleFireToast}
          className={styles.demoButton}
          style={dynamicBtnStyle}
        >
          + Fire a toast
        </button>

        <button
          type="button"
          onClick={() => setShowMatrix((prev) => !prev)}
          className={styles.demoButton}
          style={dynamicBtnStyle}
        >
          {showMatrix ? 'Ocultar Matriz CIS' : '+ Matriz de Riesgo'}
        </button>

        <button
          type="button"
          onClick={() => setShowExpediente((prev) => !prev)}
          className={styles.demoButton}
          style={dynamicBtnStyle}
        >
          {showExpediente ? 'Ocultar Expediente' : '+ El Expediente'}
        </button>

        <button
          type="button"
          onClick={() => setShowFrameworks((prev) => !prev)}
          className={styles.demoButton}
          style={dynamicBtnStyle}
        >
          {showFrameworks ? 'Ocultar Marcos & PDFs' : '+ Marcos & PDFs'}
        </button>

        {/* Quick Launchers */}
        <button
          type="button"
          onClick={() => openWindow({ kind: 'app', appId: 'terminal' })}
          className={styles.demoButton}
          style={dynamicBtnStyle}
          title="Abrir terminal Linux de la estación"
        >
          Terminal.sh
        </button>


        <button
          type="button"
          onClick={() => openWindow({ kind: 'app', appId: 'notes' })}
          className={styles.demoButton}
          style={dynamicBtnStyle}
          title="Abrir Cuaderno de Campo (Bitácora de Peritaje)"
        >
          Cuaderno de Campo
        </button>
      </div>

      {/* ── Native Status Line ── */}
      <p className={styles.statusLine}>
        Window focused: <strong>{focused ? 'yes' : 'no'}</strong>
        <span>•</span>
        <span>
          Progreso: <strong>{completedCount} de {PLAYBOOK_PHASES.length} fases</strong>{' '}
          {percent === 100 ? '(Estación Asegurada 🎉)' : `(${percent}%)`}
        </span>
        {lab1LiveState && (
          <>
            <span>•</span>
            <span>
              Tríada CIA: <strong>{lab1LiveState.cia.overallScore}%</strong> (C:{lab1LiveState.cia.confidentiality.score}% I:{lab1LiveState.cia.integrity.score}% A:{lab1LiveState.cia.availability.score}%)
            </span>
          </>
        )}
      </p>

      <div className={styles.divider} />

      {/* ── 5 PHASES: Operational Instructions, Pista (Dropdown), Solución (Dropdown) ── */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>
          Directivas y Fases de Auditoría — Invernadero Central
        </span>
        <button
          type="button"
          onClick={handleResetPhases}
          className={styles.copyBtn}
          title="Reiniciar progreso de las fases"
          style={dynamicBtnStyle}
        >
          ↺ Reiniciar Fases
        </button>
      </div>

      <div className={styles.milestonesList}>
        {PLAYBOOK_PHASES.map((phase) => {
          const isPhaseDone = Boolean(completedPhases[phase.id])
          const isPistaOpen = Boolean(openPistas[phase.id])
          const isSolucionOpen = Boolean(openSoluciones[phase.id])

          return (
            <div
              key={phase.id}
              className={`${styles.milestoneItem} ${
                isPhaseDone ? styles.milestoneItemCompleted : ''
              }`}
              style={{ borderRadius: theme.shape.small || 6 }}
            >
              {/* Phase Header */}
              <div className={styles.milestoneHead}>
                <div
                  className={`${styles.milestoneCheckbox} ${
                    isPhaseDone ? styles.milestoneCheckboxCompleted : ''
                  }`}
                  onClick={() => togglePhaseCompleted(phase.id)}
                  title={isPhaseDone ? 'Marcar fase como pendiente' : 'Marcar fase como completada'}
                  style={{ cursor: 'pointer' }}
                >
                  {isPhaseDone && (
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>

                <div className={styles.milestoneMeta}>
                  <div className={styles.milestoneTitleRow}>
                    <span className={styles.milestoneTitle}>
                      {phase.title}
                    </span>
                    <span className={styles.milestonePhase}>
                      FASE {phase.number}
                    </span>
                  </div>
                  <p className={styles.milestoneDesc}>{phase.subtitle}</p>
                </div>
              </div>

              {/* ── SUBSECTION A: Instrucciones Operativas (Default View) ── */}
              <div className={styles.phaseInstructions}>
                <div className={styles.phaseSubheader}>
                  <span style={{ color: '#34d399' }}>A.</span> Instrucciones Operativas
                  <span style={{ fontSize: 10, opacity: 0.6, fontWeight: 400, textTransform: 'none' }}>
                    (Directivas sin comandos específicos — Mentalidad Assume Breach & CIA)
                  </span>
                </div>

                {phase.directives.map((dir, idx) => (
                  <div key={idx} className={styles.instructionItem}>
                    <span className={styles.instructionIndex}>{idx + 1}.</span>
                    <div>
                      <strong>{dir.title}: </strong>
                      <span>{dir.text}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ── Subsection Toggles: Pista & Solución ── */}
              <div className={styles.phaseButtonsRow}>
                <button
                  type="button"
                  onClick={() => togglePista(phase.id)}
                  className={`${styles.pistaBtn} ${isPistaOpen ? styles.pistaBtnActive : ''}`}
                >
                  💡 {isPistaOpen ? 'Ocultar Pista' : 'Pista / Herramientas'}
                </button>

                <button
                  type="button"
                  onClick={() => toggleSolucion(phase.id)}
                  className={`${styles.solucionBtn} ${isSolucionOpen ? styles.solucionBtnActive : ''}`}
                >
                  📖 {isSolucionOpen ? 'Ocultar Solución' : 'Guía Pedagógica y Solución'}
                </button>

                <div style={{ flex: 1 }} />

                <span style={{ fontSize: 10.5, opacity: 0.55, fontStyle: 'italic' }}>
                  {phase.verification.filter((v) => checkedItems[v.id]).length} de {phase.verification.length} verificados
                </span>
              </div>

              {/* ── SUBSECTION B: Pista / Herramientas y Comandos Sugeridos (Dropdown) ── */}
              {isPistaOpen && (
                <div className={styles.pistaDropdown}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#fbbf24', textTransform: 'uppercase' }}>
                      B. Pista: Caja de Herramientas y Comandos Sugeridos
                    </span>
                    <button
                      type="button"
                      className={styles.copyBtn}
                      onClick={() => {
                        const commands = phase.hints
                          .filter((h) => h.command)
                          .map((h) => `# ${h.tool}\n${h.command}`)
                          .join('\n\n')
                        handleCopy(commands, `pista-${phase.id}`)
                      }}
                    >
                      {copiedKey === `pista-${phase.id}` ? '✓ Copiado' : 'Copiar Comandos'}
                    </button>
                  </div>

                  <div className={styles.pistaToolRow}>
                    {phase.hints.map((hint, hIdx) => (
                      <div key={hIdx} className={styles.pistaToolItem}>
                        <span style={{ fontWeight: 600, color: '#fbbf24' }}>• {hint.tool}:</span>
                        <span>{hint.description}</span>
                        {hint.command && (
                          <code className={styles.codeSnippet}>{hint.command}</code>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── SUBSECTION C: Guía Pedagógica y Solución Asistida (Dropdown) ── */}
              {isSolucionOpen && (
                <div className={styles.solucionDropdown}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase' }}>
                      C. Guía Pedagógica y Solución Asistida (Paso a Paso & El Porqué)
                    </span>
                    <button
                      type="button"
                      className={styles.copyBtn}
                      onClick={() => {
                        const guideText = phase.pedagogicalGuide
                          .map((g) => `## ${g.sectionTitle}\n${g.rationale}\n` + g.steps.map((s) => `- ${s.action} ${s.command ? `(${s.command})` : ''}`).join('\n'))
                          .join('\n\n')
                        handleCopy(guideText, `sol-${phase.id}`)
                      }}
                    >
                      {copiedKey === `sol-${phase.id}` ? '✓ Copiado' : 'Copiar Guía'}
                    </button>
                  </div>

                  {phase.pedagogicalGuide.map((guide, gIdx) => (
                    <div key={gIdx} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <strong style={{ color: '#93c5fd', fontSize: 12 }}>
                        {guide.sectionTitle}
                      </strong>
                      <p style={{ margin: 0, opacity: 0.85, fontSize: 11.5 }}>
                        {guide.rationale}
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 2, paddingLeft: 8 }}>
                        {guide.steps.map((step, sIdx) => (
                          <div key={sIdx} style={{ fontSize: 11.5 }}>
                            <span>→ {step.action}</span>
                            {step.command && (
                              <div style={{ margin: '2px 0 2px 8px' }}>
                                <code className={styles.codeSnippet}>{step.command}</code>
                              </div>
                            )}
                            {step.detail && (
                              <div style={{ fontStyle: 'italic', opacity: 0.75, fontSize: 11, marginLeft: 8 }}>
                                {step.detail}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ── Verification Checklist ── */}
              <div className={styles.verificationBox}>
                <span style={{ fontSize: 10.5, fontWeight: 600, opacity: 0.7, textTransform: 'uppercase' }}>
                  Verificación de Fase {phase.number}:
                </span>
                {phase.verification.map((v) => {
                  const isChecked = Boolean(checkedItems[v.id])
                  return (
                    <div
                      key={v.id}
                      className={`${styles.verificationItem} ${
                        isChecked ? styles.verificationItemChecked : ''
                      }`}
                      onClick={() => toggleCheckItem(v.id, phase.id)}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCheckItem(v.id, phase.id)}
                        style={{ cursor: 'pointer' }}
                      />
                      <span>{v.label}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* ── Collapsible Native Drawer: Matriz de Riesgo CIS Controls IG1 ── */}
      {showMatrix && (
        <div className={styles.matrixContainer} style={{ borderRadius: theme.shape.small || 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', opacity: 0.75 }}>
              Matriz de Riesgo CIS Controls IG1 — Invernadero Central
            </span>
            <button
              type="button"
              className={styles.copyBtn}
              onClick={() => {
                const reportContent = matrixRows
                  .map(
                    (r) =>
                      `[${r.mitigated ? 'MITIGADO' : 'PENDIENTE'}] ${r.asset} (${r.riskLevel})\nAmenaza: ${r.threat}\nControl: ${r.cisControl}\n`
                  )
                  .join('\n')
                handleCopy(reportContent, 'matrix-report')
              }}
              style={dynamicBtnStyle}
            >
              {copiedKey === 'matrix-report' ? '✓ Reporte Copiado' : 'Copiar Reporte'}
            </button>
          </div>

          <table className={styles.matrixTable}>
            <thead>
              <tr>
                <th style={{ width: '28px' }}>Estado</th>
                <th>Activo Detectado</th>
                <th>Riesgo</th>
                <th>Control CIS</th>
              </tr>
            </thead>
            <tbody>
              {matrixRows.map((row) => (
                <tr key={row.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={row.mitigated}
                      onChange={(e) => {
                        const updated = matrixRows.map((r) =>
                          r.id === row.id ? { ...r, mitigated: e.target.checked } : r
                        )
                        saveMatrix(updated)
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                  </td>
                  <td>
                    <strong>{row.asset}</strong>
                    <div style={{ fontSize: 10.5, opacity: 0.65 }}>{row.threat}</div>
                  </td>
                  <td>
                    <span
                      className={`${styles.matrixRiskBadge} ${
                        row.riskLevel === 'Crítico'
                          ? styles.riskCritico
                          : row.riskLevel === 'Alto'
                          ? styles.riskAlto
                          : styles.riskMedio
                      }`}
                    >
                      {row.riskLevel}
                    </span>
                  </td>
                  <td style={{ fontSize: 10.5, opacity: 0.8 }}>{row.cisControl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Collapsible Native Drawer: El Expediente (Hallazgos Forenses) ── */}
      {showExpediente && (
        <div className={styles.matrixContainer} style={{ borderRadius: theme.shape.small || 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', opacity: 0.75 }}>
              El Expediente — Hallazgos y Trazabilidad Forense
            </span>
            <button
              type="button"
              className={styles.copyBtn}
              onClick={() => {
                const report = findings
                  .map(
                    (f) =>
                      `[${f.status.toUpperCase()}] ${f.title}\nActivo: ${f.affectedAsset} | Prioridad: ${f.priority} | CIA: ${f.ciaImpact.join(', ')}\nObs: ${f.observation}\nAcción: ${f.proposedAction}\n`
                  )
                  .join('\n')
                handleCopy(report, 'expediente-report')
              }}
              style={dynamicBtnStyle}
            >
              {copiedKey === 'expediente-report' ? '✓ Expediente Copiado' : 'Copiar Expediente'}
            </button>
          </div>

          <p style={{ margin: '2px 0 6px 0', fontSize: 12, opacity: 0.72 }}>
          Registra los hallazgos identificados en la estación a través de la terminal Linux, clasificando su impacto en la Tríada CIA.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {findings.map((f) => (
              <div
                key={f.id}
                className={`${styles.findingCardNative} ${
                  f.status === 'Mitigado' ? styles.findingCardNativeMitigated : ''
                }`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input
                      type="checkbox"
                      checked={f.status === 'Mitigado'}
                      onChange={() => handleToggleFindingStatus(f)}
                      style={{ cursor: 'pointer' }}
                    />
                    <strong style={{ fontSize: 12 }}>{f.title}</strong>
                    <span style={{ fontSize: 10, opacity: 0.6 }}>({f.affectedAsset})</span>
                  </div>
                  <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                    {f.ciaImpact.map((pillar) => (
                      <span
                        key={pillar}
                        style={{
                          fontSize: 9.5,
                          fontWeight: 700,
                          padding: '1px 4px',
                          borderRadius: 3,
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.15)',
                        }}
                      >
                        {pillar}
                      </span>
                    ))}
                    <span
                      className={`${styles.matrixRiskBadge} ${
                        f.priority === 'Crítica'
                          ? styles.riskCritico
                          : f.priority === 'Alta'
                          ? styles.riskAlto
                          : styles.riskMedio
                      }`}
                    >
                      {f.priority}
                    </span>
                    <button
                      type="button"
                      onClick={() => labVerificationService.deleteFinding(f.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'inherit',
                        opacity: 0.45,
                        cursor: 'pointer',
                        padding: '0 2px',
                      }}
                      title="Eliminar hallazgo"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <p style={{ margin: '2px 0 0 20px', fontSize: 11.5, opacity: 0.75 }}>
                  {f.observation}
                </p>
              </div>
            ))}
          </div>

          {/* Form to add a finding */}
          <form
            onSubmit={handleAddFinding}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              marginTop: 6,
              paddingTop: 8,
              borderTop: '1px dashed var(--rui-border, rgba(255,255,255,0.1))',
            }}
          >
            <input
              type="text"
              placeholder="Activo afectado (ej: /tmp/catalogo_orquideas.pdf)"
              value={newFindingAsset}
              onChange={(e) => setNewFindingAsset(e.target.value)}
              className={styles.nativeInput}
              style={{ flex: 1, minWidth: 160 }}
              required
            />
            <input
              type="text"
              placeholder="Observación / Amenaza detectada"
              value={newFindingThreat}
              onChange={(e) => setNewFindingThreat(e.target.value)}
              className={styles.nativeInput}
              style={{ flex: 2, minWidth: 200 }}
              required
            />
            <select
              value={newFindingRisk}
              onChange={(e) =>
                setNewFindingRisk(
                  e.target.value as 'Crítica' | 'Alta' | 'Medio' | 'Bajo'
                )
              }
              className={styles.nativeInput}
              style={{ width: 85 }}
            >
              <option value="Crítica">Crítica</option>
              <option value="Alta">Alta</option>
              <option value="Medio">Medio</option>
              <option value="Bajo">Bajo</option>
            </select>
            <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
              {(['C', 'I', 'A'] as const).map((pillar) => {
                const active = newFindingCia.includes(pillar)
                return (
                  <button
                    key={pillar}
                    type="button"
                    onClick={() => {
                      setNewFindingCia((prev) =>
                        prev.includes(pillar) ? prev.filter((p) => p !== pillar) : [...prev, pillar]
                      )
                    }}
                    style={{
                      padding: '2px 6px',
                      fontSize: 10,
                      fontWeight: 600,
                      borderRadius: 3,
                      border: '1px solid var(--rui-border, rgba(255,255,255,0.2))',
                      background: active ? '#34d399' : 'transparent',
                      color: active ? '#051b11' : 'inherit',
                      cursor: 'pointer',
                    }}
                  >
                    {pillar}
                  </button>
                )
              })}
            </div>
            <button
              type="submit"
              className={styles.demoButton}
              style={{ ...dynamicBtnStyle, padding: '4px 10px', fontSize: 11 }}
            >
              + Registrar Hallazgo
            </button>
          </form>
        </div>
      )}

      {/* ── Collapsible Native Drawer: Marcos de Referencia & Carga de PDFs ── */}
      {showFrameworks && (
        <div className={styles.matrixContainer} style={{ borderRadius: theme.shape.small || 6 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', opacity: 0.75 }}>
              Marcos de Referencia y Biblioteca de PDFs
            </span>
          </div>

          <p style={{ margin: '2px 0 6px 0', fontSize: 12, opacity: 0.72 }}>
            Consulta los marcos estándar (CIS Controls v8, NIST CSF 2.0, Tríada CIA) o carga tus propios PDFs y documentos de referencia para guiar la auditoría.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {referenceDocs.map((doc) => (
              <div key={doc.id} className={styles.docItemNative}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <PdfDocIcon size={16} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <strong style={{ fontSize: 12 }}>{doc.title}</strong>
                      <span
                        style={{
                          fontSize: 9.5,
                          padding: '1px 4px',
                          borderRadius: 3,
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.12)',
                        }}
                      >
                        {doc.category}
                      </span>
                    </div>
                    <p style={{ margin: '2px 0 0 0', fontSize: 11, opacity: 0.65 }}>
                      {doc.description}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {doc.url && (
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.copyBtn}
                      style={{ textDecoration: 'none' }}
                    >
                      Abrir Enlace ↗
                    </a>
                  )}
                  {doc.isCustom && (
                    <button
                      type="button"
                      onClick={() => labVerificationService.removeReference(doc.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'inherit',
                        opacity: 0.45,
                        cursor: 'pointer',
                        padding: '0 4px',
                      }}
                      title="Eliminar documento"
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Form to load / link a PDF */}
          <form
            onSubmit={handleAddCustomDoc}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 6,
              marginTop: 6,
              paddingTop: 8,
              borderTop: '1px dashed var(--rui-border, rgba(255,255,255,0.1))',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder="Título del documento o framework"
              value={newDocTitle}
              onChange={(e) => setNewDocTitle(e.target.value)}
              className={styles.nativeInput}
              style={{ flex: 1, minWidth: 160 }}
              required
            />
            <select
              value={newDocCategory}
              onChange={(e) =>
                setNewDocCategory(
                  e.target.value as 'Framework' | 'Guía' | 'Estándar'
                )
              }
              className={styles.nativeInput}
              style={{ width: 100 }}
            >
              <option value="Framework">Framework</option>
              <option value="Guía">Guía</option>
              <option value="Estándar">Estándar</option>
            </select>
            <input
              type="url"
              placeholder="URL del PDF o sitio web (opcional)"
              value={newDocUrl}
              onChange={(e) => setNewDocUrl(e.target.value)}
              className={styles.nativeInput}
              style={{ flex: 1.5, minWidth: 160 }}
            />
            <label
              className={styles.demoButton}
              style={{
                ...dynamicBtnStyle,
                padding: '4px 8px',
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              <input
                type="file"
                accept=".pdf,.txt,.md"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
              {newDocFilename ? `📎 ${newDocFilename}` : '📎 Cargar archivo PDF'}
            </label>
            <button
              type="submit"
              className={styles.demoButton}
              style={{ ...dynamicBtnStyle, padding: '4px 10px', fontSize: 11 }}
            >
              + Vincular
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default TulipPlaybookApp
