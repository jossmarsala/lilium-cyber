# Misión 01 — La Estación Olvidada

**TULIP · Laboratorio 01 · CIS Controls IG1**

## Hola, operador.

Hay sistemas que dejan de recibir mantenimiento mucho antes de dejar de funcionar.

Esta estación volvió a encenderse después de un tiempo indefinido fuera de servicio. No hay un informe de estado reciente, sus registros están incompletos y algunas de sus configuraciones todavía conservan rastros de quienes la utilizaron.

Has sido reclutado de forma anónima para auditar e **investigar el sistema, comprender sus riesgos y devolverle una base de seguridad confiable sin perder información importante en el proceso.&#x20;**&#x54;u rol es el de un _custodio de sistemas_: alguien que inspecciona, documenta, protege y verifica antes de dar algo por seguro.

No necesitas resolver todo de inmediato. Puedes explorar los archivos, revisar los registros, observar el comportamiento del sistema y utilizar las herramientas disponibles para construir tu propio diagnóstico.

Algunas pistas están a la vista. Otras aparecen cuando sabes dónde mirar.

### Antes de empezar

- Explorá las aplicaciones disponibles y familiarizate con el entorno.
- Investigá libremente: no hay una única secuencia válida para recorrer el sistema.
- Antes de modificar algo, intentá comprender qué es, para qué sirve y qué podría ocurrir si lo cambiás.
- Registrá tus hallazgos en la plantilla y distingue riesgos, amenazas y vulnerabilidades.
- Si una acción puede afectar la disponibilidad, la integridad o la confidencialidad de la información, evalua sus consecuencias antes de ejecutarla.
- Si necesitas ayuda, consulta las pistas disponibles. Están pensadas para orientarte, no para reemplazar tu investigación.

Este es un entorno de práctica aislado. Puedes experimentar dentro de los límites del laboratorio y reiniciar la estación si necesitas recuperar su estado inicial.

---

# Tu misión

Tu objetivo es reconstruir el estado de seguridad de la estación, identificar los riesgos más relevantes y aplicar mejoras justificadas. Cada hito representa una capacidad que deberías poder demostrar.

## 01. Reconstruir el estado de la estación

Antes de proteger un sistema, necesitás saber qué estás protegiendo.

Explorá la estación para comprender cómo está organizada, qué identidad estás utilizando, qué componentes forman parte del entorno y dónde se conserva la información relevante para investigar su estado.

Prestá atención a los usuarios, los archivos, los directorios de configuración y los registros del sistema. Buscá señales que ayuden a reconstruir qué ocurrió antes de tu llegada.

**Tu objetivo**

- Comprender tu identidad y el alcance de tus permisos.
- Reconocer la estructura básica del sistema de archivos y sus directorios relevantes.
- Identificar usuarios, archivos de configuración y registros que puedan aportar evidencia.
- Diferenciar los componentes conocidos de aquellos cuyo propósito todavía no está claro.

**Hito completado cuando:** podés describir qué encontraste, qué información resulta relevante y qué preguntas todavía necesitás responder.

## 02. Inventariar activos y evaluar riesgos

La estación contiene recursos, información y servicios que no necesariamente tienen el mismo valor ni requieren el mismo nivel de protección.

Construí un inventario inicial de los activos relevantes. Para cada uno, determiná qué función cumple, qué información maneja y qué consecuencias tendría que alguien pudiera acceder a ella sin autorización, modificarla o impedir su disponibilidad.

Después, examiná las amenazas y vulnerabilidades que podrían afectarlos. No confundas una amenaza con una vulnerabilidad ni una vulnerabilidad con un riesgo: necesitás relacionar los elementos para explicar qué podría ocurrir y por qué importa.

**Tu objetivo**

- Clasificar manualmente los activos identificados.
- Reconocer amenazas plausibles y debilidades observables.
- Relacionar activos, amenazas, vulnerabilidades y riesgos.
- Evaluar los posibles impactos sobre la confidencialidad, la integridad y la disponibilidad.
- Priorizar los hallazgos según su impacto, probabilidad y contexto.

**Hito completado cuando:** construiste una primera matriz de riesgos y podés justificar cuáles requieren atención prioritaria.

## 03. Seguir las señales de la red

La estación no existe en el vacío. Intercambia información con otros componentes y puede depender de servicios que no están dentro de ella.

Investigá sus interfaces de red, observá qué comunicaciones aparecen en los registros disponibles y examiná el tráfico de la estación cuando corresponda. Intentá reconstruir qué dispositivos o servicios participan en esas comunicaciones y qué función podría cumplir cada uno.

Cuando identifiques protocolos, relacioná su comportamiento con los conceptos estudiados en el módulo. Si encontrás una conexión remota, investigá su propósito y evaluá qué condiciones deberían cumplirse para considerarla segura.

**Tu objetivo**

- Reconocer la configuración de red de la estación.
- Identificar comunicaciones, protocolos y servicios relevantes.
- Relacionar las observaciones con los registros y el escenario.
- Examinar una conexión remota de forma controlada y determinar qué información útil permite obtener.
- Distinguir entre una comunicación esperada, una que requiere contexto adicional y una que podría representar un riesgo.

**Hito completado cuando:** podés explicar qué observaste en la red, qué conclusiones respaldan los datos y qué aspectos todavía no podés confirmar.

## 04. Investigar las señales de actividad

Algunos indicios no aparecen en los archivos de configuración ni en el inventario. Se manifiestan mientras el sistema funciona.

Inspeccioná los procesos activos y los recursos que utilizan. Contrastá lo observado con los registros y el comportamiento esperado de la estación. Si encontrás una actividad inusual, no la consideres maliciosa automáticamente: buscá evidencias que permitan evaluar su origen, su función y su posible impacto.

Disponés de dos herramientas de análisis que representan tecnologías habituales en un entorno defensivo:

**SIEM — Centro de análisis de eventos**

Revisá los eventos recopilados por la estación y sus fuentes asociadas. Buscá relaciones entre registros, usuarios, actividad de red y procesos. Evaluá qué eventos merecen atención y cuáles necesitan más contexto antes de generar una conclusión.

**EDR — Detección y respuesta en endpoints**

Examiná las señales de actividad del equipo, los procesos observados y los indicadores disponibles. Investigá las alertas, contrastalas con la evidencia local y determiná si corresponde profundizar el análisis o considerar una medida de contención.

Ambas herramientas son complementarias: una alerta no demuestra por sí sola que exista un incidente, y la ausencia de alertas tampoco garantiza que el sistema sea seguro.

**Tu objetivo**

- Identificar procesos y actividades que merezcan investigación.
- Correlacionar evidencias locales con eventos de seguridad.
- Interpretar alertas de la SIEM y del EDR.
- Decidir si una actividad requiere observación, investigación adicional o contención.
- Justificar cualquier medida que pueda afectar el funcionamiento del sistema.

**Hito completado cuando:** documentaste al menos una investigación de actividad y justificaste tu decisión a partir de evidencias.

## 05. Recuperar una base de seguridad confiable

Ya tenés una visión más clara de la estación. Ahora es momento de transformar el diagnóstico en mejoras concretas.

Revisá los permisos de los archivos relevantes, evaluá si las cuentas tienen únicamente los privilegios que necesitan y examiná las configuraciones que podrían facilitar accesos indebidos. Considerá qué cambios son necesarios y cuáles podrían introducir nuevos problemas.

Cuando corresponda, prepará una cuenta individual para trabajar con responsabilidad identificable. Aplicá el principio de mínimo privilegio: los permisos elevados deben ser excepcionales, justificados y limitados a las tareas que realmente los necesitan.

Si modificás una configuración, procurá conservar la evidencia original, registrar el cambio y comprobar su efecto. Antes de eliminar o detener algo sospechoso, evaluá si necesitás preservar información para continuar la investigación.

**Tu objetivo**

- Identificar permisos o configuraciones que no sean adecuados para el contexto.
- Establecer una separación razonable entre las cuentas y sus privilegios.
- Aplicar restricciones de acceso a información sensible.
- Evaluar las condiciones de seguridad de un acceso remoto.
- Realizar mejoras reversibles y verificar que no introduzcan problemas innecesarios.

**Hito completado cuando:** aplicaste al menos una mejora justificada, comprobaste su resultado y documentaste qué cambió.

## 06. Verificar, documentar y cerrar el diagnóstico

Una modificación no equivale automáticamente a una mejora. Necesitás comprobar el estado final del sistema y conservar información suficiente para explicar tus decisiones.

Revisá los cambios realizados, verificá la integridad de los archivos relevantes cuando exista una referencia confiable y compará el estado final con el diagnóstico inicial. Identificá qué riesgos fueron mitigados, cuáles siguen presentes y qué medidas requerirían una intervención posterior.

Finalmente, organizá tus hallazgos en un informe breve. Priorizá la información que le permitiría a otra persona comprender el estado de la estación, reproducir tus comprobaciones y continuar el trabajo.

**Tu objetivo**

- Verificar los cambios y sus efectos.
- Evaluar la integridad de archivos relevantes con referencias adecuadas.
- Actualizar la matriz de riesgos.
- Documentar decisiones, evidencias, limitaciones y tareas pendientes.
- Relacionar las medidas implementadas con buenas prácticas defensivas.

**Hito completado cuando:** otra persona puede entender qué investigaste, qué cambiaste, cómo lo verificaste y qué queda por resolver.

---

# Tu cuaderno de custodia

Una buena investigación no termina cuando encontrás algo: termina cuando podés explicar qué significa y por qué importa.

Usá este espacio para registrar los hallazgos que consideres relevantes. No necesitás completar una ficha por cada archivo o evento; priorizá aquello que aporte evidencia o ayude a tomar decisiones.

### Ficha de hallazgo

- **Identificador:** un nombre breve para reconocer el hallazgo.
- **Activo afectado:** equipo, cuenta, archivo, servicio o información relacionada.
- **Observación:** qué encontraste y dónde.
- **Clasificación:** activo, amenaza, vulnerabilidad, riesgo o evidencia.
- **Impacto potencial:** consecuencias para la confidencialidad, la integridad o la disponibilidad.
- **Evidencia:** registros, configuraciones, eventos u observaciones que respaldan tu conclusión.
- **Prioridad:** qué tan urgente es investigar o tratar el hallazgo y por qué.
- **Acción propuesta:** qué harías, con qué objetivo y qué efectos secundarios considerarías.
- **Verificación:** cómo comprobarías que la medida funcionó.
- **Estado:** pendiente, en investigación, mitigado o aceptado con justificación.

Podés guardar hallazgos provisionales. Señalá cuándo una conclusión es una hipótesis y qué evidencia te falta para confirmarla.

---

# Marcos de referencia: de la teoría a la práctica

La estación es un entorno pequeño, pero las decisiones que tomás se relacionan con prácticas utilizadas en organizaciones reales.

A medida que investigues, consultá las referencias disponibles para reconocer qué principio defensivo estás aplicando y qué alcance tiene.

- **CIS Controls IG1:** utilizalo como referencia de prácticas esenciales de higiene de ciberseguridad. Relaciona tus acciones con medidas básicas de inventario, protección de cuentas, configuración segura, gestión de registros y respuesta, según corresponda.
- **NIST Cybersecurity Framework:** organiza tu razonamiento alrededor de identificar, proteger, detectar, responder y recuperar.
- **Tríada CIA:** evalúa si cada riesgo afecta la confidencialidad, la integridad, la disponibilidad o más de una de ellas.
- **Principios de seguridad:** aplica mínimo privilegio, defensa en profundidad, trazabilidad y verificación antes de confiar.

Estas referencias te ayudan a explicar por qué una medida tiene sentido. No sustituyen la evidencia ni convierten automáticamente una práctica aislada en una implementación completa de un control.

---

# Una última nota

La estación puede volver a funcionar sin que todos sus riesgos hayan desaparecido.

Tu trabajo no consiste en conseguir que todo parezca normal. Consiste en comprender qué está pasando, reducir los riesgos que podés justificar y dejar un registro claro de lo que todavía necesita atención.

**La misión no termina cuando la estación enciende. Termina cuando puedes explicar por qué es más confiable que antes.**

Y si encuentras algo que no encaja, no lo descartes demasiado rápido. A veces, lo más importante de un sistema está en aquello que todavía no sabemos interpretar.
