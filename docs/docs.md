# 1) Comprender <!-- id: layer-1 -->

Everything you need to set up and run the Cyber Range locally for the first time.

## Fundamentos <!-- id: introduction, icon: Book02Icon -->

La ciberseguridad consiste en proteger los sistemas, la información y las operaciones frente a amenazas que puedan comprometer su funcionamiento. Para una organización, esto no implica únicamente prevenir ataques: también significa preservar la confianza, reducir pérdidas y mantener la continuidad del negocio.

## 1.1. Fundamentos de ciberseguridad y gestión del riesgo

Tradicionalmente, la ciberseguridad ha sido considerada un problema exclusivo de los departamentos de tecnología. Sin embargo, en el entorno interconectado actual, un fallo en los sistemas de información detiene por completo la producción, la facturación y la prestación de servicios.

La ciberseguridad es la práctica de garantizar la confidencialidad, integridad y disponibilidad de la información mediante la protección de redes, dispositivos, personas y datos contra el acceso no autorizado o la explotación delictiva. Su propósito fundamental es minimizar riesgos y posibles daños para garantizar la continuidad operativa del negocio.

Para las pequeñas y medianas empresas (PyMEs), la ciberseguridad es una necesidad de supervivencia. Estas organizaciones suelen tener una tolerancia muy baja al tiempo de inactividad, ya que su principal preocupación es mantener las operaciones comerciales diarias. Además, las PyMEs suelen contar con experiencia técnica limitada y presupuestos ajustados, lo que las convierte en objetivos atractivos y altamente vulnerables si no adoptan medidas defensivas fundamentales.

### El impacto en el negocio

Un incidente de seguridad rara vez se limita a la pérdida de un equipo o a la caída temporal de un servidor. Las consecuencias se extienden a través de toda la estructura de la organización y pueden clasificarse en varias dimensiones críticas:

- **Impacto financiero:** Las brechas de seguridad y los ataques de software malicioso generan consecuencias económicas directas. Esto incluye la interrupción de operaciones, los costos asociados a la recuperación de sistemas y restauración de datos, y las posibles sanciones legales o multas por el incumplimiento de normativas de protección de datos.

- **Impacto operativo y en la disponibilidad:** Los incidentes dirigidos a los sistemas de tecnología de la información afectan directamente el servicio que estos ofrecen. Cuando los datos no están disponibles o los sistemas colapsan, la empresa no puede cumplir con sus compromisos diarios, afectando la cadena de suministro y la entrega de valor.

- **Robo de información y exposición legal:** Almacenar datos sensibles de clientes, empleados y proveedores implica un riesgo inherente. La filtración de Información de Identificación Personal (PII, por sus siglas en inglés) expone a las personas a fraudes y acarrea graves responsabilidades legales para la organización que no supo custodiarla.

- **Daño a la reputación:** Una brecha de seguridad puede afectar gravemente la confianza del mercado. Los clientes pueden optar por trasladar su negocio a competidores que les brinden mayor seguridad, dificultando la retención y la atracción de nuevos clientes o inversores.

### La tríada CIA: El núcleo de la protección

Para comprender qué se intenta proteger, la industria utiliza un modelo fundamental conocido como la tríada CIA (por sus siglas en inglés: _Confidentiality, Integrity, Availability_). Este modelo ayuda a las organizaciones a evaluar los riesgos y a establecer controles y políticas de seguridad adecuados.

Cualquier esfuerzo defensivo debe apuntar a preservar - uno o más- de estos tres pilares:

| Principio            | Definición                                                                                                                                                        | Ejemplo en el entorno empresarial                                                                                                                                |
| :------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Confidencialidad** | Implica que solo los usuarios autorizados pueden acceder a datos o activos específicos. Se enfoca en restringir la visualización y copia de información sensible. | Un sistema de nómina donde solo el departamento de Recursos Humanos y la gerencia pueden ver los salarios de los empleados.                                      |
| **Integridad**       | Implica que los datos son correctos, auténticos y confiables. Asegura que la información no ha sido alterada o destruida de forma no autorizada.                  | El uso de controles de acceso y cifrado para evitar que un atacante o un empleado modifique los números de cuenta bancaria en el sistema de pagos a proveedores. |
| **Disponibilidad**   | Conlleva que quien esté autorizado tenga acceso a los datos y sistemas cuando los necesite. Los datos inaccesibles no son útiles y paralizan el trabajo.          | Mantener los servidores de una tienda en línea operativos durante un pico de ventas, utilizando medidas contra ataques de sobrecarga.                            |

_La Tríada CIA como base de la protección corporativa._

### El ecosistema del riesgo

Para gestionar la seguridad, es imperativo establecer un lenguaje común. Los conceptos de activo, amenaza, vulnerabilidad y riesgo suelen confundirse, pero representan componentes distintos de una misma ecuación.

1. **Activo:** Es cualquier elemento percibido como valioso para una organización. Puede ser físico (servidores, computadoras de escritorio, espacios de oficina) o digital (bases de datos de clientes, propiedad intelectual, aplicaciones corporativas). El valor del activo determina el nivel de protección que requiere.

2. **Amenaza:** Es una circunstancia o evento que puede afectar negativamente a los activos. Las amenazas pueden ser externas (hackers, desastres naturales) o internas (empleados que abusan de su acceso o cometen errores accidentales).

3. **Vulnerabilidad:** Es una debilidad o fallo en un sistema, proceso o configuración que puede ser aprovechada por una amenaza. Ejemplos comunes incluyen software desactualizado, contraseñas débiles, datos confidenciales desprotegidos o la falta de capacitación del personal.

4. **Riesgo:** Es la probabilidad de que una amenaza explote una vulnerabilidad y cause un impacto negativo en la confidencialidad, integridad o disponibilidad de un activo.

> [!NOTE]
> Para que exista un riesgo real, debe existir tanto una amenaza activa como una vulnerabilidad explotable. Por ejemplo: Si un sistema tiene una vulnerabilidad pero está completamente aislado y desconectado de cualquier red o interacción física, el riesgo se reduce drásticamente.

### Introducción a la gestión del riesgo

Las organizaciones no pueden eliminar todos los riesgos; los recursos son limitados y las defensas absolutas no existen. La gestión de riesgos es el proceso que busca identificar qué controles o medidas se pueden tomar para minimizar los problemas antes de que ocurran. Estas actividades de gestión deben estar integradas en los procesos generales de gestión de riesgos empresariales (ERM, por sus siglas en inglés).

La gestión estructurada del riesgo permite a los directivos tomar decisiones operativas basadas en datos, alineando la seguridad con los objetivos comerciales.

### Procedimiento: Identificación y priorización básica

Para una PyME que recién comienza a estructurar su seguridad, el proceso de gestión de riesgos se puede abordar mediante los siguientes pasos fundamentales:

:::steps

### 1. Identificar los activos críticos

Catalogar qué información y qué sistemas necesitan protegerse. Identificar los activos de alto riesgo (información regulada o crítica), riesgo medio (información no pública que afectaría las finanzas) y bajo riesgo (información pública).

### 2. Identificar amenazas y vulnerabilidades

Reconocer qué podría salir mal. ¿Existen sistemas operativos sin parches de seguridad? ¿Los empleados utilizan la misma contraseña para todo? ¿Alguien podría tener excesivos privilegios de acceso al sistema?

### 3. Evaluar el impacto y la probabilidad

Estimar el daño que causaría la materialización de la amenaza (pérdida económica, daño reputacional) y la probabilidad real de que ocurra basándose en el panorama actual.

### 4. Definir la respuesta al riesgo

Una vez priorizados, la organización debe decidir cómo abordar cada riesgo. Las estrategias habituales son:
:::

- **Aceptación:** Reconocer el riesgo pero decidir no actuar, generalmente porque el costo de la solución es mayor que el impacto potencial, aceptando el riesgo para no interrumpir la continuidad del negocio.

- **Prevención (o Evitación):** Crear un plan o alterar la arquitectura para evitar el riesgo por completo (por ejemplo, deshabilitar un servicio innecesario y vulnerable).

- **Transferencia:** Trasladar el riesgo financiero a un tercero, como la contratación de una póliza de seguro de ciberseguridad o la externalización a un proveedor especializado.

- **Mitigación:** Implementar controles técnicos o administrativos para disminuir la probabilidad o el impacto de un riesgo conocido (por ejemplo, instalar un `firewall` o requerir autenticación multifactor).
  :::

### Verificación de la gestión del riesgo

La gestión del riesgo no es un documento estático. Para comprobar que el proceso es efectivo, la organización debe auditar periódicamente sus decisiones.

**Cómo verificar:**

- Revisar el registro de activos y verificar si los sistemas adquiridos en los últimos seis meses fueron incorporados y clasificados.
- Analizar un incidente de seguridad reciente (por menor que sea) y cruzarlo con la matriz de riesgos: ¿La vulnerabilidad explotada estaba identificada? ¿El impacto real coincidió con el impacto estimado? Si la respuesta es negativa, los criterios de estimación deben ajustarse.

> [!WARNING:Limitaciones]
> La gestión del riesgo se basa en predicciones y en el conocimiento disponible en el momento. No garantiza que no ocurran incidentes (especialmente frente a vulnerabilidades de "día cero" o amenazas no documentadas), sino que asegura que la organización invierte sus recursos defensivos en los problemas que estadísticamente causarán el mayor daño.

## Panorama de amenazas <!-- id: threats-attacks, icon: threat -->

## 1.2. Panorama de amenazas y vectores de ataque

Comprender una amenaza requiere entender quién ejecuta los ataques, qué busca, por dónde ingresa y qué herramientas utiliza. Un entorno tecnológico se vuelve vulnerable cuando no se mapean adecuadamente estos factores frente a la infraestructura de la organización.

Las amenazas a la seguridad pueden tener orígenes diversos, pero todas persiguen vulnerar la confidencialidad, la integridad o la disponibilidad de los activos corporativos.

### Actores de amenazas y motivaciones

Los incidentes no ocurren en el vacío; son perpetrados por entidades con objetivos, capacidades y recursos específicos. Conocer el perfil del atacante permite a las organizaciones ajustar sus defensas.

| Tipo de actor             | Descripción                                                                                                     | Motivación principal |
| ------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------- |
| **Sindicatos criminales** | Grupos organizados que operan como empresas ilícitas. Utilizan ataques masivos o dirigidos para obtener dinero. |

| Beneficio económico (ej. extorsión mediante _ransomware_ o venta de datos).

|
| **Amenazas Internas (_Insiders_)** | Empleados, proveedores o excolaboradores que abusan de su acceso autorizado. Pueden actuar con intención o por negligencia.

| Sabotaje, espionaje corporativo, corrupción o error humano accidental.

|
| **Amenaza Avanzada Persistente (APT)** | Procesos informáticos sigilosos realizados por terceros (frecuentemente actores estatales o patrocinados por Estados) con gran capacidad técnica.

| Espionaje, robo de propiedad intelectual, sabotaje estratégico a infraestructuras críticas.

|
| **Hacktivistas** | Individuos o grupos que utilizan ataques cibernéticos para promover una agenda ideológica.

| Protesta social, propaganda, búsqueda de notoriedad, difamación de marcas.

|
| _Clasificación de actores de amenazas y sus objetivos operativos._ | | |

### Superficie de ataque y vectores de entrada

La superficie de ataque comprende todas las vulnerabilidades potenciales que un atacante puede aprovechar en un sistema dado.

Un vector de ataque es la ruta o método específico que utiliza un actor de la amenaza para penetrar en la red. Los vectores de entrada más comunes incluyen:

- **Usuarios:** Manipulación directa del personal mediante tácticas de engaño.

- **Servicios expuestos y software:** Aplicaciones con configuraciones de seguridad incorrectas, sistemas heredados (_legacy_) obsoletos y software sin parches de seguridad.

- **Proveedores y cadena de suministro:** Acceso a través de terceros o servicios externalizados que tienen permisos en la red de la organización.

- **Dispositivos de red y configuraciones de fábrica:** Dispositivos instalados con credenciales predeterminadas, protocolos antiguos o servicios innecesarios habilitados.

### Ingeniería social y manipulación humana

La ingeniería social es una técnica de manipulación que explota el error humano para engañar a las personas y lograr que revelen información confidencial o realicen acciones perjudiciales. Es a menudo el camino de menor resistencia para un atacante.

- **Phishing (Suplantación de identidad):** Uso de comunicaciones digitales masivas (generalmente correo electrónico) simulando ser una fuente confiable para robar datos o distribuir _malware_.

- **Spear phishing:** Un ataque de _phishing_ focalizado y personalizado contra un individuo o grupo específico.

- **Whaling:** Variante de _spear phishing_ dirigida exclusivamente a altos ejecutivos o personal con altos privilegios.

- **BEC (Compromiso del correo electrónico empresarial):** El atacante falsifica o compromete una cuenta corporativa legítima para solicitar transferencias de fondos o información sensible, buscando un beneficio financiero directo.

- **Vishing y Smishing:** Uso de llamadas telefónicas (_vishing_) o mensajes de texto SMS/WhatsApp (_smishing_) para suplantar identidades.

- **Baiting (Cebo):** Engaño que ofrece una recompensa falsa o utiliza medios físicos (ej. dejar un USB infectado, conocido como cebo USB) para infectar una red.

> [!CRITICAL]
> Los ataques BEC (_Business Email Compromise_) y el _phishing_ representan los vectores de amenaza más comunes y efectivos contra las empresas, ya que eluden los controles técnicos perimetrales al interactuar directamente con el usuario final.

### Malware (Software Malicioso)

El _malware_ es código diseñado para infiltrarse, dañar o explotar sistemas informáticos sin el consentimiento del usuario.

- **Ransomware:** Cifra los datos de una organización o bloquea el acceso a los sistemas, exigiendo el pago de un rescate. Las variantes modernas también exfiltran datos antes de cifrarlos para extorsionar a la víctima con su publicación.

- **Troyanos:** Programas que se presentan como software legítimo para engañar al usuario, pero que ocultan funciones maliciosas, actuando frecuentemente como puerta de entrada para otras amenazas.

- **Gusanos (_Worms_):** _Malware_ autónomo que se duplica y se propaga a través de la red sin necesidad de intervención humana, saturando recursos y sistemas.

- **Spyware:** Diseñado para recopilar información personal, correos y credenciales de forma encubierta y enviarla al atacante.

- **Botnets:** Red de equipos infectados (zombis) controlados remotamente por un atacante para lanzar ataques a gran escala, como ataques de denegación de servicio distribuido (DDoS).

### Explotación de vulnerabilidades y control de acceso

Cuando los atacantes no utilizan la ingeniería social, buscan explotar debilidades técnicas o fallos en el control de acceso.

- **Software sin actualizar:** Las vulnerabilidades en sistemas operativos o aplicaciones que no han recibido sus parches de seguridad son explotadas rutinariamente. Los _exploits de día cero_ (_zero-days_) atacan vulnerabilidades aún desconocidas por el fabricante.

- **Software mal codificado:** Aquellos sistemas que han sido programados y distribuidos sin tener en cuenta las buenas prácticas de seguridad.

- **Configuraciones inseguras:** El uso de componentes con ajustes de fábrica, cuentas predeterminadas o la falta de cifrado facilita la infiltración.

- **Compromiso de credenciales:** Los atacantes obtienen acceso mediante el robo de contraseñas, la reutilización de claves comprometidas en otros servicios, o mediante **ataques de fuerza bruta** (prueba sistemática de combinaciones). El uso de _tablas Arcoíris_ (_Rainbow tables_) permite revertir contraseñas almacenadas de forma insegura.

### El ciclo de vida de un ataque

Un ciberataque rara vez es un evento instantáneo; sigue una progresión táctica. El **Cyber Kill Chain** (Cadena de Muerte Cibernética) es un modelo utilizado en la industria para explicar las fases secuenciales que los adversarios suelen atravesar para ejecutar un ataque con éxito:

:::steps

### 1. Reconocimiento (_Reconnaissance_)

El atacante recopila información sobre su objetivo sin contacto directo. Esto incluye búsqueda en fuentes abiertas (OSINT), escaneo de puertos y análisis de la superficie de ataque pública.

### 2. Armado (_Weaponization_)

Creación o adaptación del arma combinando un _exploit_ con un _payload_. El producto resultante es un arma entregable: un documento malicioso, un ejecutable empaquetado o un script ofuscado.

### 3. Entrega (_Delivery_)

Transmisión del arma al objetivo a través de un vector de entrada como el correo electrónico (_phishing_).

### 4. Explotación (_Exploitation_)

El arma se activa y aprovecha la vulnerabilidad para ejecutar código malicioso en el sistema víctima. La vulnerabilidad explotada puede ser técnica (_bug_ de software) o humana (factor social).

### 5. Instalación (_Installation_)

Se instala un mecanismo persistente en el sistema comprometido para garantizar el acceso futuro, incluso tras reinicios.

### 6. Comando y Control (_Command & Control_)

Se establece un canal de comunicación cifrado entre el _malware_ y el servidor del atacante (C2). El canal permite al atacante enviar instrucciones y recibir resultados.

### 7. Acción sobre objetivos (_Actions on Objectives_)

El atacante ejecuta su objetivo final. Puede incluir exfiltración de datos, cifrado de archivos (_ransomware_), sabotaje de sistemas, creación de accesos adicionales o movimiento hacia otros objetivos.
:::

### Defensa y reducción del riesgo: El Marco del NIST

La mitigación de estas amenazas requiere una estrategia de **defensa en profundidad**, agregando múltiples capas de seguridad para que, si una falla, otra detenga el ataque.

[Referencia oficial](nist.gov/cyberframework 'NIST CSF')

El Marco de Ciberseguridad del NIST (NIST CSF 2.0) organiza las medidas defensivas en seis _Core Functions_. Estas funciones no son pasos aislados, sino un ciclo continuo que abarca toda la seguridad:

- **Gobernar (_Govern_):** Establece, comunica y monitorea la estrategia de gestión de riesgos, las expectativas y las políticas corporativas. Esta función central guía a todas las demás, asegurando que las decisiones de ciberseguridad se alineen con la misión del negocio, los requisitos legales y las expectativas de las partes interesadas.

- **Identificar (_Identify_):** Permite comprender los riesgos actuales de ciberseguridad a los que se enfrenta la organización. Implica mantener un inventario exhaustivo y priorizado de los activos, servicios y proveedores de la cadena de suministro para dirigir los esfuerzos defensivos.

- **Proteger (_Protect_):** Implementa las salvaguardas necesarias para prevenir o reducir la probabilidad y el impacto de los eventos cibernéticos adversos. Abarca desde el control de acceso y la autenticación, hasta la capacitación del personal y la seguridad de los datos.

- **Detectar (_Detect_):** Facilita el descubrimiento y análisis oportuno de posibles ataques e incidentes. Implica el monitoreo continuo para identificar anomalías o indicadores de compromiso (IoC) que señalen que las barreras de protección han sido superadas.

- **Responder (_Respond_):** Ejecuta acciones críticas frente a un incidente de ciberseguridad previamente detectado. El objetivo es contener los efectos del ataque mediante la gestión del incidente, el análisis forense, la mitigación técnica y la comunicación obligatoria con las partes afectadas.

- **Recuperar (_Recover_):** Restaura los activos y las operaciones comerciales afectadas por el incidente de seguridad. Garantiza el restablecimiento oportuno de la normalidad operativa y la coordinación de las comunicaciones públicas e internas durante la recuperación.

> [!NOTE]
> Las primeras 4 funciones pueden operan de manera simultánea y continua para prevenir amenazas, mientras que "Responder" y "Recuperar" se mantienen preparadas en todo momento para activarse en el instante en que ocurre una brecha.

## Frameworks y Referencias <!-- id: frameworks-references, icon: Bookmark01Icon -->

## 1.3. Marcos de trabajo, controles y referencias oficiales

Construir la seguridad de una organización desde cero mediante prueba y error es ineficiente y peligroso. Para estructurar las defensas, la industria ha desarrollado conocimientos estandarizados que evitan reinventar soluciones a problemas ya resueltos. Comprender la distinción entre estos recursos es el primer paso para diseñar una arquitectura de seguridad coherente y auditable.

### Conceptos fundamentales de la gobernanza de seguridad

A menudo, los términos asociados a la regulación y gestión de la seguridad se utilizan indistintamente, pero cumplen roles operativos muy distintos dentro de una organización:

| Concepto                         | Definición técnica                                                                                               | Propósito práctico |
| -------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------ |
| **Framework (Marco de trabajo)** | Pautas utilizadas para crear planes que ayuden a mitigar el riesgo y organizar el ciclo de vida de la seguridad. |

| Proporcionar una estructura organizativa y un enfoque sistemático para gestionar qué proteger y cómo hacerlo.

|
| **Control de seguridad** | Medidas de protección (administrativas, técnicas o físicas) diseñadas para reducir ciertos riesgos específicos.

| Reducir la probabilidad o el impacto de una amenaza concreta (ej. exigir autenticación multifactor).

|
| **Playbook (Manual de estrategias)** | Guías que proporcionan detalles sobre cualquier acción operativa de forma prescrita, independientemente de quién trabaje en el caso.

| Traducir las políticas y los controles en pasos ejecutables para manejar incidentes antes, durante y después de que ocurran.

|
| **Estándar** | Conjunto de reglas, criterios y metodologías técnicas reconocidas por la industria. | Unificar la forma en que se implementan configuraciones o procesos para garantizar interoperabilidad y seguridad comprobada. |
| **Normativa / Regulación** | Reglamentos internos y regulaciones externas de cumplimiento obligatorio (compliance).

| Imponer obligaciones legales (con posibles multas o auditorías) sobre el procesamiento y protección de datos, como el RGPD.

|
| _Diferencias estructurales entre las herramientas de gobernanza y protección._ | | |

> [!NOTE]
> La adopción de marcos y controles puede ser una decisión estratégica (voluntaria) o una obligación legal (mandatoria), dependiendo de la industria y la ubicación de la organización.

### NIST Cybersecurity Framework (CSF) 2.0

El Instituto Nacional de Estándares y Tecnología (NIST) desarrolló el Cybersecurity Framework (CSF) como un marco voluntario que incluye estándares, pautas y prácticas recomendadas para manejar riesgos de ciberseguridad a corto y largo plazo.

El CSF 2.0 no prescribe qué herramientas exactas comprar, sino que organiza los resultados de ciberseguridad en seis funciones básicas -explicadas en detalle en la sección anterior-: Gobernar, Identificar, Proteger, Detectar, Responder y Recuperar. Su utilidad principal radica en la creación de Perfiles Organizacionales (Current Profile y Target Profile. Funciona como un mapa que compara la realidad técnica de la empresa con sus verdaderas necesidades de protección, traduciendo problemas informáticos en decisiones de negocio.

Para entender su utilidad, es necesario desglosar sus tres fases de aplicación:

- **Current Profile (Perfil Actual):** Es una radiografía del momento presente. Describe detalladamente qué resultados de ciberseguridad y controles técnicos está logrando la organización en la actualidad.
- **Target Profile (Perfil Objetivo):** Es la meta a alcanzar. Especifica los resultados de seguridad que la organización ha seleccionado y priorizado como necesarios, considerando su misión comercial, sus requisitos legales y las amenazas específicas a las que se enfrenta.
- **Identificación de brechas (Gap Analysis):** Al superponer ambos perfiles, se analizan las diferencias o "brechas" entre lo que se hace hoy y lo que se debería hacer para estar protegido.

[Referencia oficial](nist.gov/cyberframework 'NIST CSF')

### NIST Risk Management Framework (RMF)

Mientras que el CSF organiza la postura general de la empresa, el Risk Management Framework (RMF) del NIST proporciona un proceso táctico, detallado y sistemático para integrar la seguridad y la gestión de riesgos en el ciclo de vida de sistemas de información individuales. Se compone de siete pasos secuenciales:

:::steps

### 1. Preparar

Tomar medidas organizativas para gestionar los riesgos de seguridad y privacidad antes de que ocurra un problema, identificando qué controles pueden minimizar las amenazas.

### 2. Categorizar

Analizar cómo la confidencialidad, integridad y disponibilidad de la información y los sistemas pueden verse afectados, para definir las tareas necesarias para proteger los activos más importantes.

### 3. Seleccionar

Elegir, adaptar y documentar los controles de seguridad específicos que protegerán el sistema en función de su categorización previa.

### 4. Implementar

Poner en marcha los planes de seguridad, la privacidad y los controles técnicos definidos previamente para minimizar el impacto de los riesgos.

### 5. Evaluar

Determinar si los controles implementados funcionan correctamente, satisfacen las necesidades de la organización y son efectivos, identificando puntos débiles para realizar ajustes.

### 6. Autorizar

Asumir la responsabilidad formal sobre los riesgos de seguridad y privacidad, determinando quién tiene la autoridad para aceptar el riesgo y aprobar la operación del sistema.

### 7. Monitorear

Realizar un seguimiento constante de las operaciones de los sistemas para garantizar que los controles sigan funcionando y cumplan con los objetivos de seguridad de la organización a lo largo del tiempo.
:::

[Referencia oficial](csrc.nist.gov/projects/risk-management 'NIST RMF')

### CIS Critical Security Controls y Benchmarks

El Center for Internet Security (CIS) proporciona un enfoque sumamente pragmático. Los Controles Críticos de Seguridad de CIS son un conjunto prescriptivo y priorizado de buenas prácticas de ciberseguridad diseñado para proteger los sistemas, redes y datos de una organización contra los ataques más comunes.

La versión actual (v8) consta de 18 controles principales que cubren desde el inventario de hardware y software, gestión de vulnerabilidades, hasta la protección del correo electrónico y la respuesta a incidentes. A diferencia de los marcos de gestión puramente teóricos, los controles CIS están estructurados en **Grupos de Implementación (IG)** para facilitar una adopción progresiva:

- **IG1 (Higiene Cibernética Esencial):** Conjunto fundamental de salvaguardas que toda organización -especialmente las PyMEs sin una estructura de ciberseguridad robusta- debería aplicar para protegerse de ataques no dirigidos y mantener la continuidad del negocio.

- **IG2 e IG3:** Controles avanzados para organizaciones con mayor madurez tecnológica, expertos en seguridad y cargas de cumplimiento regulatorio.

A lo largo de este _playbook_, nos apoyaremos recurrentemente en los fundamentos de CIS, particularmente en la gestión de inventarios de activos (Control 1 y 2), la protección de datos (Control 3), la configuración segura (Control 4) y la gestión de accesos y cuentas (Controles 5 y 6).

> [!NOTE]
> **Controles vs. Benchmarks**
> Mientras que los Controles CIS dictan _qué_ medidas de seguridad priorizar, sin hacer hincapié en las herramientas específicas, los **CIS Benchmarks**, son otra rama que responde al _cómo_. Son líneas base de seguridad y listas de verificación muy detalladas para asegurar sistemas operativos, bases de datos y aplicaciones específicas.

[Referencia oficial](cisecurity.org/controls 'CIS Controls')

### MITRE ATT&CK

La MITRE ATT&CK (Adversarial Tactics, Techniques, and Common Knowledge) es una base de conocimiento global y un marco de referencia estructurado que clasifica y describe los comportamientos en ataques reales de los adversarios cibernéticos. A diferencia de otros marcos, ATT&CK modela la ciberseguridad directamente desde la perspectiva ofensiva. Este enfoque técnico permite organizar las acciones observadas en intrusiones del mundo real mediante la categorización sistemática de Tácticas, Técnicas y Procedimientos (TTP).

- **Tácticas:** Representan el objetivo técnico que el adversario intenta alcanzar en una fase específica del ataque (por ejemplo, obtener acceso inicial, escalar privilegios o evadir defensas).
- **Técnicas:** Describen el método específico o la vía que utiliza el atacante para lograr ese objetivo táctico (por ejemplo, enviar correos de phishing con archivos adjuntos maliciosos).
- **Procedimientos:** Detallan la implementación exacta, la secuencia de comandos o la herramienta particular empleada para ejecutar la técnica.

[Referencia oficial](attack.mitre.org 'MITRE ATT&CK')

### OWASP y la seguridad de aplicaciones

El Open Web Application Security Project (OWASP) es una organización sin fines de lucro enfocada en mejorar la seguridad del software. A medida que las operaciones comerciales dependen de aplicaciones web y APIs, OWASP proporciona los estándares para prevenir vulnerabilidades de código.

- **OWASP Top 10:** Es un documento de concienciación que destaca los riesgos más críticos para las aplicaciones web (como fallas en el control de acceso, fallas criptográficas, inyecciones de código y diseño inseguro), sirviendo como punto de partida para que los desarrolladores eviten errores comunes.

- **Application Security Verification Standard (ASVS) y Web Security Testing Guide (WSTG):** Son referencias complementarias esenciales. ASVS establece una lista de requisitos detallados para diseñar y verificar la seguridad de una aplicación según su nivel de riesgo, mientras que WSTG proporciona una metodología rigurosa sobre cómo evaluar técnicamente la existencia de esas vulnerabilidades.

[Referencia oficial](owasp.org 'OWASP')

### Cómo convertir referencias en decisiones prácticas

Las organizaciones, especialmente las PyMEs, suelen sentirse abrumadas por la cantidad de marcos, estándares y normativas disponibles. Por ello, **el punto de partida recomendado para cualquier empresa** que busque estructurar su ciberseguridad es comenzar por este enfoque: aplicar una trazabilidad directa en la toma de decisiones.

Para evitar la adopción ciega de herramientas sin comprender qué problema resuelven, proponemos que la implementación de cualquier referencia responda siempre a este flujo lógico y secuencial:

:::steps

### 1. Riesgo (El problema a resolver)

Identificar la amenaza específica y la vulnerabilidad operativa que exponen a la organización a un impacto negativo. La ciberseguridad no debe consistir en proteger "por proteger", sino en defenderse de escenarios concretos.
_Ejemplo práctico:_ Detectar que existe un alto riesgo de robo de credenciales en las conexiones de trabajo remoto.

### 2. Objetivo de Seguridad (El marco de trabajo)

Utilizar un marco general (como NIST CSF) para definir la meta estratégica y alinearla con las prioridades del negocio, sin prescribir todavía la tecnología exacta.
_Ejemplo práctico:_ Establecer el objetivo de proteger el acceso lógico a la red asegurando la identidad de cada usuario de forma rigurosa.

### 3. Control (La medida preventiva)

Seleccionar una salvaguarda específica a partir de catálogos priorizados (como los Controles CIS) para reducir directamente la probabilidad o el impacto del riesgo identificado.
_Ejemplo práctico:_ Seleccionar la salvaguarda técnica que exige el uso de Autenticación Multifactor (MFA) para todo acceso remoto a la red.

### 4. Procedimiento y Herramienta (La implementación)

Traducir el control seleccionado en una acción técnica o administrativa ejecutable, definiendo cómo se configurará la tecnología disponible en el entorno particular de la empresa.
_Ejemplo práctico:_ Configurar la VPN corporativa para requerir MFA, combinando una contraseña (algo que el usuario sabe) con un código temporal generado en una aplicación móvil (algo que el usuario tiene).

### 5. Verificación (La comprobación de eficacia)

Establecer un mecanismo de auditoría para confirmar de manera empírica y continua que el control funciona como se espera y cumple su propósito sin afectar la operación legítima.
_Ejemplo práctico:_ Revisar periódicamente los registros de inicio de sesión de la VPN para confirmar que ninguna cuenta logra autenticarse externamente utilizando únicamente una contraseña.
:::

> [!TIP]
> Si no se cuenta con un equipo de seguridad formal, la mejor forma de avanzar es aplicar este ciclo paso a paso para los procesos más críticos del negocio antes de intentar cumplir con un estándar completo.

De esta forma, los marcos orientan la gestión de la seguridad, los controles reducen riesgos específicos, y los procedimientos convierten las decisiones estratégicas en acciones verificables. Ninguna referencia garantiza por sí sola la seguridad de una organización; su verdadero valor depende enteramente de cómo se adapta al contexto del negocio, cómo se implementa en la infraestructura y cómo se verifica su efectividad operativa de forma continua.

## Kit de Herramientas <!-- id: toolkit, icon: ToolsIcon -->

## 1.4. El ecosistema de herramientas de defensa

Proteger la infraestructura digital de una organización es muy similar a proteger un edificio físico. De nada sirve invertir en la bóveda más costosa del mercado si las ventanas quedan abiertas por descuido o si no hay guardias prestando atención a las cámaras de vigilancia.

En ciberseguridad, un ecosistema de defensa es un sistema coordinado donde las herramientas tecnológicas, los procesos operativos y las personas trabajan en conjunto para proteger los activos del negocio. El objetivo de este ecosistema no sino cumplir con tres funciones fundamentales:

- **Prevenir:** Bloquear la mayor cantidad de amenazas automatizadas o comunes antes de que ingresen a la red.
- **Detectar:** Identificar rápidamente aquellas amenazas silenciosas que lograron evadir la barrera inicial.
- **Responder:** Proveer la información y los mecanismos necesarios para contener el incidente antes de que paralice la operación.

Este conocimiento permite a la organización aplicar el principio de "defensa en profundidad" (construir seguridad por capas que se respaldan entre sí), garantizando que su arquitectura defensiva sea estrictamente proporcional a sus amenazas reales y a su capacidad técnica.

### 1. Seguridad de red e infraestructura

Las herramientas de seguridad de red establecen controles sobre el tráfico que ingresa, sale y se desplaza dentro de la organización.

- **Firewall y NGFW:** Un "cortafuegos" (_firewall_) es un dispositivo o software que autoriza o bloquea el tráfico de red basándose en reglas predefinidas, como direcciones IP y puertos. Los cortafuegos de próxima generación (NGFW) son una variante más actualizada que incorporan la inspección profunda de paquetes (DPI), examinando el contenido de los mismos para detectar elementos maliciosos con mayor precisión.

- **IDS e IPS:** Los sistemas de detección (IDS: Intrusion Detection System) y prevención (IPS: Intrusion Prevention System) de intrusiones analizan el tráfico de red en busca de anomalías o firmas(*) de ataques conocidos. Mientras el IDS se limita a generar alertas de forma pasiva, el IPS suma la capacidad de operar activamente interceptando el flujo de datos para bloquear amenazas en tiempo real.

- **VPN:** Una red privada virtual (VPN) protege las comunicaciones de los usuarios remotos (ej. empleados que se conectan a las redes de la organización desde otro país) cifrando los datos y encapsulando el tráfico a través de un túnel seguro. Esto evita que, aunque el usuario remoto se conecte a una red insegura, ajena a la empresa, un atacante pueda interceptar los datos.

> [!NOTE:¿Qué significa la detección basada en "firmas"?]
> (*)En ciberseguridad, una "firma" es un patrón específico o huella digital única (como una secuencia de código malicioso o un valor hash) que identifica de manera inequívoca a una amenaza previamente documentada. Las herramientas que operan bajo este modelo, como los antivirus tradicionales o los sistemas IDS, comparan constantemente los archivos o el tráfico contra una base de datos de estas huellas conocidas. Aunque es una técnica muy eficiente para frenar ataques repetitivos y bien caracterizados, su gran limitación es que resulta "ciega" frente a vulnerabilidades nuevas (de "día cero") o ante malware avanzado que modifica su propio código para evadir los controles.

Las herramientas de red por sí solas no pueden prevenir incidentes si un atacante utiliza credenciales legítimas comprometidas o si la amenaza se origina desde dentro de la organización. Por ello, es necesario agregar capas de seguridad más allá del perímetro.

### 2. Gestión de identidades y accesos (IAM)

La identidad digital constituye uno de los principales puntos de control de una arquitectura de seguridad. Gestionar quién puede acceder a cada recurso, bajo qué condiciones y con qué nivel de privilegios permite reducir el riesgo de accesos no autorizados y limitar el impacto del compromiso de credenciales.

- **Autenticación y Permisos:** IAM (Identity and Access Management, o Gestión de Identidades y Accesos) es el marco de procesos y tecnologías que administra las identidades digitales. Se basa en el principio de mínimo privilegio, otorgando únicamente el acceso estrictamente necesario para que un usuario cumpla su función.

- **MFA (Autenticación Multifactor):** Exige al usuario presentar más de un tipo de evidencia para verificar su identidad (por ejemplo, una contraseña combinada con un código temporal o un token físico). Este principio se estructura formalmente a través de tres categorías: el factor de conocimiento (una cosa que sabes, como una contraseña), el factor de posesión (una cosa que tienes, como un token criptográfico) y el factor de inherencia (una cosa que eres, como los datos biométricos).

> [!CRITICAL]
> Aunque el MFA reduce drásticamente el impacto de contraseñas débiles o robadas, no es infalible. Los atacantes pueden evadir métodos básicos de MFA mediante ingeniería social avanzada o ataques de intermediario (AiTM). Además, el robo de una _cookie_ o identificador de sesión (_session hijacking_) permite a un atacante suplantar al usuario eludiendo por completo el proceso de inicio de sesión.

### 3. Protección de endpoints y datos

El esfuerzo de proteger la red y las identidades converge en los dispositivos de usuario final (computadoras, teléfonos, servidores). Estos equipos, conocidos como _endpoints_, son el campo de batalla donde los usuarios abren correos electrónicos, descargan archivos e interactúan con los datos. En consecuencia, representan uno de los puntos de entrada más explotados por el _malware_ y los ataques dirigidos. Antes de implementar herramientas de monitoreo avanzadas, es fundamental aplicar el fortalecimiento del sistema (_hardening_) y una gestión rigurosa de parches para reducir la superficie de ataque.

- **Antivirus (AV):** Software enfocado principalmente en la prevención y eliminación de _malware_ mediante el escaneo de archivos en busca de firmas o patrones conocidos. Actualmente ha evolucionado hacia herramientas más sofisticadas como los EDR y XDR.
- **EDR (Endpoint Detection and Response):** Solución que monitorea continuamente la actividad del dispositivo (_telemetría_) para detectar comportamientos sospechosos y facilitar la respuesta. El EDR no depende exclusivamente de firmas, sino que utiliza reglas de comportamiento y heurística para identificar ataques en curso.
- **XDR (Extended Detection and Response):** Evolución del EDR que integra la telemetría de los _endpoints_ con datos de la red, la nube y las identidades, ofreciendo una visibilidad unificada.
- **DLP (Prevención de Pérdida de Datos):** Herramientas automatizadas que identifican y controlan el flujo de datos sensibles para evitar su divulgación no autorizada o exfiltración.

> [!NOTE]
> Las herramientas de detección de comportamiento como el EDR y el XDR generan inevitablemente falsos positivos (actividades legítimas mal marcadas como amenazas). Requieren personal capacitado para validar las alertas y afinar los sistemas.

### 4. Gestión de vulnerabilidades

El _software_ y el _hardware_ rara vez son perfectos; con el tiempo, se descubren fallas de programación o diseño que los atacantes pueden utilizar como vías de acceso no autorizadas. La gestión de vulnerabilidades es el esfuerzo proactivo de la organización por auditar su propia infraestructura, asumiendo la mentalidad de un atacante para encontrar y reparar estas debilidades antes de que sean explotadas. No se trata de un evento único, sino de un proceso continuo de descubrimiento, análisis y mitigación.

- **Escáneres de vulnerabilidades:** Herramientas que examinan los activos en busca de configuraciones erróneas, software sin parchear y debilidades conocidas.
- **CVE y CVSS:** El sistema CVE (_Common Vulnerabilities and Exposures_) proporciona un diccionario estándar de vulnerabilidades conocidas públicamente. El CVSS (_Common Vulnerability Scoring System_) asigna una puntuación de 0 a 10 que mide la **severidad técnica** de la vulnerabilidad.

> [!TIP]
> Un escaneo automatizado no equivale a una auditoría profunda ni a una prueba de penetración (_pentesting_). Además, la puntuación CVSS no determina por sí sola el riesgo real para la organización; la remediación debe priorizarse combinando la severidad técnica con el contexto del entorno (por ejemplo, si un sistema es de misión crítica o si está expuesto directamente a Internet).

### 5. Centralización y análisis de eventos

A medida que una organización incorpora _firewalls_, controles de identidad y protección de _endpoints_, se enfrenta a un nuevo problema: la fragmentación de la información. Cada dispositivo genera miles de registros (_logs_) diarios. Un atacante avanzado rara vez dispara una alarma general en un solo sistema; en su lugar, deja pequeñas huellas dispersas. Para detectar estas amenazas complejas, es indispensable centralizar la información y correlacionar los eventos.

- **Logs (Registros de auditoría):** Documentan eventos en los sistemas, detallando quién ejecutó una acción, qué ocurrió, cuándo se produjo y desde dónde. Los _logs_ registran hechos observables, pero no indican la intención o el motivo subyacente detrás de la acción.
- **SIEM (Gestión de Información y Eventos de Seguridad):** Plataforma que recopila, agrega, normaliza y correlaciona los _logs_ de múltiples fuentes para detectar anomalías y generar alertas sobre posibles incidentes de seguridad.

:::group title="Consideraciones de centralización de logs"

- **Retención de datos**: El tiempo que se conservan los _logs_ no debe regirse por reglas arbitrarias, sino que debe definirse mediante políticas basadas en el análisis de riesgo, requerimientos operativos, normativas legales y obligaciones de cumplimiento.
- **Calidad sobre cantidad**: Un SIEM requiere _logs_ bien configurados y de alta fidelidad; ingerir datos irrelevantes aumenta los costos y el "ruido" en las alertas.
- **Convergencia**: En el ecosistema moderno, las capacidades de SIEM, EDR, XDR y SOAR suelen superponerse, no siendo plataformas mutuamente excluyentes.
  :::

### 6. Orquestación y gestión de incidentes

Identificar un ataque en curso es solo la mitad del desafío. Cuando se genera una alerta crítica, la organización no puede depender de la improvisación; los analistas deben saber exactamente qué pasos seguir para contener la amenaza y recopilar evidencias sin destruir información valiosa. Las herramientas de orquestación y gestión están diseñadas para estructurar la respuesta, reducir el trabajo manual repetitivo y asegurar que los incidentes se manejen con precisión y rapidez.

- **SOAR (Security Orchestration, Automation, and Response):** Tecnologías que automatizan los flujos de trabajo de operaciones de seguridad mediante manuales de estrategias (_playbooks_).

- **Ticketing / ITSM:** Sistemas que centralizan el control de incidentes registrando evidencias, responsables y todo el historial de cambios en un solo lugar desde que se reporta el problema hasta que se resuelve de forma definitiva.

El uso de SOAR es ideal para automatizar tareas repetitivas de triaje y enriquecimiento de datos. Sin embargo, la automatización no reemplaza un plan de respuesta a incidentes; las decisiones críticas de contención y el análisis de causa raíz generalmente requieren aprobación y el criterio de los analistas de seguridad.

### 7. Inteligencia artificial aplicada a la defensa

El volumen de datos que procesa una red corporativa moderna supera ampliamente la capacidad de análisis humano en tiempo real. La Inteligencia Artificial (IA) y el aprendizaje automático (_machine learning_) se han introducido en el arsenal defensivo para equilibrar la balanza, procesando millones de eventos para encontrar patrones que indicarían un ataque en curso. Se utilizan principalmente en el análisis de comportamiento dentro de soluciones EDR y sistemas de monitoreo, permitiendo identificar desviaciones de una línea de base en lugar de depender únicamente de firmas estáticas.

Sin embargo, su adopción introduce nuevas consideraciones. Es vital distinguir entre los ataques asistidos por IA (donde un atacante utiliza modelos de lenguaje para redactar correos de _phishing_ convincentes) y el aprendizaje automático antagónico (_adversarial machine learning_). Este último es una técnica donde los atacantes manipulan los propios modelos de inteligencia artificial o envenenan los datos de entrenamiento para que los sistemas de defensa fallen. Por lo tanto, las herramientas de IA no son infalibles, conllevan el riesgo de "alucinaciones" (conclusiones incorrectas), pueden exponer información confidencial y requieren validación humana constante.

### Cómo construir un toolkit proporcional al riesgo

El mayor error estratégico de muchas organizaciones es adquirir tecnología de seguridad avanzada sin tener la madurez operativa para configurarla, administrarla y monitorearla. Por ello, la adopción de herramientas debe ser un proceso reflexivo, escalonado y guiado por las necesidades reales del negocio, los recursos disponibles y las amenazas identificadas.

Los Grupos de Implementación (IG) de los Controles CIS ofrecen una estructura acumulativa y escalable para aplicar defensas proporcionales al contexto organizativo:

:::steps

### 1. Evaluar según el Grupo de Implementación (IG)

Identificar la clasificación de la organización:

- **IG1:** Organizaciones con experiencia limitada en TI cuyo objetivo es aplicar la higiene cibernética esencial para mantener la operatividad y mitigar ataques no dirigidos.

- **IG2:** Organizaciones con personal de TI dedicado, que manejan información sensible y requieren defensas para gestionar mayor complejidad operativa. Incluye las salvaguardas de IG1.

- **IG3:** Entidades altamente reguladas o con personal especializado que deben contrarrestar amenazas avanzadas. Incluye todas las salvaguardas de IG1 e IG2.

### 2. Priorizar controles sobre herramientas

Una herramienta comercial costosa no sustituye un buen control. Alternativas _open source_ pueden ser viables si el equipo tiene el tiempo y la experiencia para integrarlas y mantenerlas; de lo contrario, los costos ocultos de mantenimiento pueden superar el precio de una licencia comercial.

### 3. Evaluar la interoperabilidad

Asegurarse de que las herramientas seleccionadas (por ejemplo, el EDR y el firewall) puedan compartir información o integrarse a través de un SIEM/SOAR para evitar silos de información que retrasen la detección de incidentes.
:::

## Fundamentos de Redes <!-- id: networks-operating-systems-networks, icon: ServerIcon -->

## 1.5.A. Fundamentos de Redes

Una red informática es el conjunto de dispositivos, medios de transmisión y protocolos que permite a los sistemas de una organización intercambiar información, compartir recursos y acceder a servicios internos o externos. La red constituye una parte importante de la superficie de ataque de una organización: los servicios expuestos, las comunicaciones mal configuradas y los protocolos vulnerables pueden permitir accesos no autorizados, interceptación de información o desplazamientos laterales después de comprometer un dispositivo. Por eso, conocer la arquitectura de red permite comprender tanto cómo circulan los datos, como también dónde aplicar controles de seguridad para evitar posibles incidentes.

### Fundamentos de comunicación entre sistemas

En un entorno digital, la comunicación entre dispositivos puede organizarse mediante distintos modelos. En el modelo **cliente-servidor**, un cliente solicita recursos o servicios que otro sistema proporciona como servidor. En el modelo **_peer-to-peer_** (P2P), los nodos pueden compartir recursos directamente y actuar como clientes o servidores según la interacción. Ambos modelos pueden coexistir dentro de una misma infraestructura.

Un **_host_** es un dispositivo conectado a una red que puede enviar, recibir o procesar información mediante protocolos de comunicación. La comunicación puede desarrollarse dentro de una misma red local o entre redes diferentes. También puede ser síncrona, cuando las partes necesitan coordinarse temporalmente durante el intercambio (como hacer una llamada telefónica), o asíncrona, cuando los mensajes pueden enviarse y procesarse en momentos distintos (como enviar un correo electrónico).

Para que dispositivos de distintos fabricantes y sistemas operativos puedan comunicarse, utilizan **protocolos**: Estos protocolos son conjuntos de reglas estandarizadas que dictan exactamente cómo se formatea, transmite y recibe la información en una red.

Durante el proceso de envío de datos, estos atraviesan un proceso llamado **encapsulación**. Se puede pensar como el envío de un paquete postal: el contenido se introduce en un sobre, luego, el sobre va dentro de un paquete de envío más grande con la dirección postal, y, después, el paquete se transporta por una serie de centros de distribución. Cada nueva capa o "caja" añade información de control indispensable para el viaje. En una red, cada capa de comunicación incorpora información necesaria para cumplir su función, como puertos de origen y destino, direcciones IP o direcciones de enlace.

Al llegar a su destino, ocurre el proceso inverso, conocido como **desencapsulación**. El dispositivo receptor va abriendo y retirando progresivamente estas "cajas" o capas de control, verificando que la información sea para él, hasta revelar el mensaje original para que la aplicación pueda leerlo.

El proceso de comunicación ocurre paso a paso de la siguiente manera:

:::steps

### 1. Datos (Capa de Aplicación)

Comienza con el mensaje original que un usuario o sistema desea enviar. Puede ser un correo electrónico, la carga de una imagen, un archivo o una solicitud a una base de datos. En esta etapa inicial, la información se encuentra en su formato original de **Datos** (_Data_), comprensible únicamente para la aplicación de software que lo generó.

### 2. Segmentos o Datagramas (Capa de Transporte)

Como los datos suelen ser demasiado grandes para enviarse de una sola vez por la red, el protocolo de transporte se encarga de dividirlos en porciones más pequeñas y manejables. A cada porción se le añade un encabezado de control que contiene los **números de puerto** (etiqueta que identifica un servicio, aplicación o programa específico dentro de un dispositivo conectado a una red) de origen y destino, asegurando que la información llegue al programa correcto dentro del dispositivo receptor.

- Si se utiliza el protocolo TCP (que garantiza la entrega ordenada), esta unidad se denomina **Segmento**.
- Si se utiliza el protocolo UDP (más rápido pero sin garantía de entrega), se denomina **Datagrama**.

### 3. Paquetes (Capa de Red)

El segmento (o datagrama) desciende a la capa de red, donde opera el protocolo de Internet (IP). Aquí, se lo introduce dentro de un nuevo "sobre" lógico añadiéndole un encabezado IP. Este nuevo encabezado contiene la **dirección IP de origen** y la **dirección IP de destino**. Esta información es vital, ya que permite a los _routers_ intermedios leer el destino y decidir cuál es el mejor camino para enviar la información a través de distintas redes o de Internet hasta alcanzar su red final. En esta etapa, la unidad de información toma el nombre de **Paquete** de red (_Packet_).

### 4. Tramas (Capa de Enlace de Datos)

Una vez que el paquete sabe a qué red IP dirigirse, necesita saber cómo moverse físicamente en cada salto local (de un equipo al _switch_, o del _switch_ al _router_). En esta etapa, el paquete se encapsula nuevamente y se le añaden las **direcciones físicas o MAC** del dispositivo emisor y del próximo dispositivo receptor inmediato en la red local. Al agregar este encabezado (y frecuentemente un cierre al final para verificar errores), el paquete se convierte en una **Trama** (_Frame_).

### 5. Bits (Capa Física)

Finalmente, la tarjeta de red (NIC) del dispositivo toma esa trama completa y la traduce a **bits** (una secuencia fundamental de ceros y unos). Estos bits se transmiten a través del medio físico, viajando como impulsos eléctricos a través de un cable de cobre, como pulsos de luz en un cable de fibra óptica, o como ondas de radio en una conexión inalámbrica Wi-Fi. Los "ceros y unos" viajan por el medio físico hasta alcanzar el próximo equipo, donde comenzará el proceso inverso de desencapsulación.

:::

> [!NOTE]
> **Una primera aproximación:** En esta representación se introducen conceptos técnicos como los protocolos IP, TCP y UDP, y los componentes de hardware involucrados en la comunicación. Todos ellos se profundizarán en los siguientes apartados. Por ahora, el objetivo es comprender de forma general cómo los datos se encapsulan, viajan a través de la red y se desencapsulan al llegar a su destino.

El rendimiento de una red se evalúa mediante distintos indicadores:

- **Ancho de banda**: define la capacidad máxima teórica de datos que un enlace puede transportar en un segundo

- **Rendimiento (_throughput_)**: cantidad de datos que se transmite efectivamente por unidad de tiempo. Puede verse afectado por la congestión, la sobrecarga de los protocolos y las condiciones del enlace.

- **Latencia**: tiempo que tarda un paquete en viajar desde el origen hasta el destinos, mientras menos latencia, más rápida es una red. Puede medirse en un solo sentido o como tiempo de ida y vuelta (_round-trip time_, RTT).

- **Pérdida de paquetes**: proporción de paquetes que no llegan a destino. Puede provocar retransmisiones, interrupciones o degradación de las aplicaciones.

Independientemente de si los sistemas operan en computadoras físicas, máquinas virtuales, contenedores o infraestructura en la nube, siguen utilizando protocolos y principios de comunicación comunes. Sin embargo, las interfaces virtuales, las redes superpuestas y los mecanismos de encapsulación adicionales pueden introducir capas y comportamientos específicos de
cada entorno.

### Modelos de referencia: OSI y TCP/IP

Para estudiar las redes informáticas, se utilizan modelos de referencia que dividen las funciones de comunicación en capas lógicas. Esta separación facilita comprender cómo cooperan los protocolos, diagnosticar fallos y determinar en qué parte de una comunicación puede estar un problema.

El modelo de Interconexión de Sistemas Abiertos (**OSI**, por sus siglas en inglés), organiza las funciones de red en siete capas. El modelo **TCP/IP** (Protocolo de Control de Transmisión/Protocolo de Internet) representa la arquitectura de protocolos práctica en la que se basa Internet y condensa estas funciones en cuatro capas principales.

> [!NOTE]
> Aunque el modelo TCP/IP es el que se implementa en la práctica en los dispositivos modernos, los profesionales de ciberseguridad utilizan el modelo OSI como lenguaje común para aislar e identificar el origen de los problemas o las vulnerabilidades.

La encapsulación, explicada anteriormente, es la que permite a estas capas trabajar en conjunto sin interferir entre sí. Cuando un usuario envía un dato, este desciende por las capas del modelo y cada capa añade su propia cabecera o control con instrucciones específicas. Luego el proceso se invierte.

| Capa Modelo OSI | Capa Modelo TCP/IP | Función Principal e Información de Control                                                        | Ejemplos de Protocolos y Dispositivos | Ejemplos de Fallos Comunes |
| --------------- | ------------------ | ------------------------------------------------------------------------------------------------- | ------------------------------------- | -------------------------- |
| 7. Aplicación   | Aplicación         | Permite la interacción del usuario y proporciona servicios de red a las aplicaciones de software. |

| HTTP, HTTPS, DNS, SMTP. Navegadores web.

| Un certificado TLS inválido o caducado que bloquea la conexión segura. |
| 6. Presentación | Aplicación | Traduce, formatea, comprime y cifra los datos para que sean comprensibles por la aplicación.

| SSL/TLS, formatos como JPEG, ASCII.

| Errores de codificación de caracteres o problemas al descifrar un paquete. |
| 5. Sesión | Aplicación | Establece, mantiene, sincroniza y finaliza los diálogos de comunicación entre los dispositivos.

| NetBIOS, RPC, PPTP.

| Desconexión abrupta o tiempo de espera de sesión agotado (_timeout_). |
| 4. Transporte | Transporte | Divide los datos en segmentos, controla el flujo y garantiza (o no) la entrega ordenada mediante puertos.

| TCP (confiable), UDP (rápido).

| Un puerto de comunicación cerrado en el firewall del servidor. |
| 3. Red | Internet | Enruta los paquetes entre redes distintas basándose en direcciones lógicas (Direcciones IP).

| IPv4, IPv6, ICMP. Routers.

| Una dirección IP incorrecta o una ruta no configurada hacia el destino. |
| 2. Enlace de Datos | Acceso a la Red | Organiza los bits en tramas y controla el acceso al medio local usando direcciones físicas (MAC).

| Ethernet, Wi-Fi (802.11). Switches, Tarjetas de red (NIC).

| Conflicto o suplantación de direcciones MAC en la red local. |
| 1. Física | Acceso a la Red | Transmite los bits en forma de señales eléctricas, ópticas o de radio a través del medio físico.

| Cables de cobre, fibra óptica, ondas de radio. Hubs, Módems.

| Un cable de red desenchufado, cortado o un puerto de red dañado. |
| _Comparativa entre el modelo OSI, el modelo TCP/IP y sus características principales en la arquitectura de red._ | | | | |

### Tipos de redes, topologías y componentes

Las redes informáticas se clasifican principalmente según su cobertura geográfica, estas categorías son orientativas y no siempre tienen límites rígidos:

- **PAN (_Personal Area Network_)**: conecta dispositivos cercanos a una persona en un espacio muy reducido, generalmente de unos pocos centímetros hasta unos pocos metros. Por ejemplo, mediante Bluetooth o la conexión de un celular a una impresora.

- **LAN (_Local Area Network_)**: abarca un espacio limitado, como una vivienda, una oficina o un edificio.

- **MAN (_Metropolitan Area Network_)**: interconecta redes o ubicaciones dentro de un área metropolitana.

- **WAN (_Wide Area Network_):** conecta redes a grandes distancias geográficas. Internet es una red global de redes y puede entenderse como el ejemplo más conocido de interconexión a gran escala.

> [!NOTE]
> Las redes empresariales frecuentemente emplean la virtualización para dividir una misma infraestructura de red física en varias redes lógicas (virtuales) independientes. Una **VLAN** (_Virtual Local Area Network_) segmenta los dispositivos en una red según su función o las necesidades de la organización. Por ejemplo, una empresa puede crear VLAN separadas para los departamentos de RRHH, IT e invitados. Esta segmentación permite mejorar la seguridad al limitar la comunicación entre grupos de dispositivos.

Los datos en estas redes deben viajar a través de **medios de transmisión**, que pueden ser físicos (redes cableadas) o basados en radiofrecuencias (redes inalámbricas). El cableado de cobre, típicamente utilizando el estándar Ethernet, transmite datos mediante impulsos eléctricos y es el más utilizado en redes locales por su bajo costo y confiabilidad. La fibra óptica, por su parte, utiliza pulsos de luz para alcanzar velocidades y distancias muy superiores, siendo el pilar de las conexiones troncales y redes WAN, mientras que las transmisiones inalámbricas (como Wi-Fi) ofrecen flexibilidad mediante el uso de ondas electromagnéticas a través del aire.

El funcionamiento fluido de estas redes depende de una serie de dispositivos de hardware especializados:

1. **Tarjeta de Interfaz de Red (NIC):** Es el componente de hardware es un componente de hardware que conecta una computadora o servidor a una red de datos (como Internet o una red local LAN).

2. **Switch (Conmutador):** El dispositivo que conecta múltiples equipos por cable dentro de una misma red local (LAN), enviando las tramas únicamente al dispositivo receptor específico mediante su dirección MAC.

3. **Router (Enrutador):** Encargado de conecta una LAN (como la de una casa u oficina) con Internet y dirige el tráfico de datos entre los diferentes dispositivos, decidiendo la ruta más eficiente para enviar los paquetes de datos hacia su destino final basándose en direcciones IP. Un router doméstico puede integrar también otras funciones, como firewall, NAT y punto de acceso inalámbrico.

4. **Punto de Acceso Inalámbrico (WAP):** Es la parte del hardware que permite que computadoras portátiles y teléfonos móviles se unan a la red local mediante señales Wi-Fi, sin necesidad de cables. Actúa como un puente entre la red cableada y los dispositivos inalámbricos.

5. **Módem y ONT:** Son dispositivos que traducen las señales de la red del proveedor de servicios de Internet (ISP) a un formato que la red local puede entender, pero funcionan con tecnologías distintas: la ONT se usa exclusivamente en conexiones de fibra óptica para convertir los pulsos de luz en una señal eléctrica digital, mientras que el módem tradicional se conecta a líneas telefónicas (ADSL) o cable coaxial para modular y demodular señales analógicas. Hoy en día, los ISPs suelen entregar un único aparato que integra la ONT o el módem con el router.

6. **Firewall (Cortafuegos):** Es un dispositivo de seguridad que monitorea y controla estrictamente el tráfico entrante y saliente. unciona como una barrera de control —similar a un guardián o portero— que decide qué información puede pasar y cuál debe bloquearse según reglas preestablecidas. para proteger la red de amenazas externas.

### Direccionamiento y comunicación dentro de una red

Para que la información alcance su destino exacto en un mundo con millones de dispositivos interconectados, se requieren sistemas de direccionamiento que operen en distintas capas del modelo de comunicación.

A nivel de enlace, las interfaces de red utilizan **direcciones MAC** (_Media Access Control_) para identificar dispositivos dentro de una red local. Funciona como la identificación permanente del hardware en una LAN. Una dirección MAC Ethernet suele tener 48 bits y representarse como seis pares de dígitos hexadecimales -por ejemplo: 00:1A:2B:3C:4D:5E. Aunque muchas direcciones se asignan de fábrica, no todas están grabadas de forma inmutable en el hardware: algunas pueden configurarse por software o modificarse mediante técnicas de suplantación.

La MAC opera exclusivamente en la Capa 2 (Enlace de datos) y su alcance está estrictamente limitado a la red local; un dispositivo no puede usarla para comunicarse directamente a través de Internet porque los _routers_ no propagan esta información más allá de su segmento de red.

Para habilitar la comunicación global y el enrutamiento entre redes diferentes, se emplea la dirección del **Protocolo de Internet (IP _adress_)**, la cual funciona como un identificador lógico (virtual) asignado al dispositivo. Actualmente conviven dos versiones de este protocolo:

- **IPv4**: utiliza direcciones de 32 bits representadas habitualmente en cuatro números decimales separados por puntos, como 192.168.1.10. La cantidad limitada de direcciones IPv4 disponibles impulsó el uso de mecanismos como NAT y la adopción de IPv6.

- **IPv6**: utiliza direcciones de 128 bits, representadas en hexadecimal y separadas por dos puntos, como 2001:db8:85a3::8a2e:370:7334. Su espacio de direccionamiento es mucho mayor y su diseño incorpora mejoras importantes respecto de IPv4, entre ellas la ausencia de broadcast.

Estas direcciones IP se dividen funcionalmente en públicas -que son directamente enrutables en Internet y deben ser exclusivas globalmente-, y privadas -que se utilizan internamente en redes corporativas o domésticas y no tienen validez en la red pública.

La dirección IP de un equipo puede cambiar con el tiempo y una misma máquina puede tener varias interfaces o direcciones. Por eso, no debe interpretarse como un identificador permanente del dispositivo.

Según la cantidad y el tipo de destinatarios, la comunicación puede clasificarse de la siguiente manera:

- _Unicast_: Dirigido de un host a otro host específico. El paquete de datos lleva la dirección IP o MAC exacta del destinatario. Por ejemplo, enviar un mail o descargar un archivo.
- _Multicast_: • Comunicación de uno a muchos (o de muchos a muchos) dirigida a un grupo específico de dispositivos que se han suscripto previamente para recibir esa información. El emisor envía un único paquete utilizando una dirección IP especial. Los routers y switches se encargan de replicar el tráfico únicamente hacia los nodos que pertenecen al grupo. Ejemplo: Salas de juegos en línea.
- _Broadcast_: Dirigido desde un host hacia absolutamente todos los hosts presentes en la red local. El emisor envía el mensaje y todos los equipos de la red lo reciben y lo procesan, lo necesiten o no. En IPv4, 255.255.255.255 es la dirección de broadcast limitada. IPv6 no utiliza broadcast; utiliza multicast para funciones equivalentes cuando corresponde.

Además, las direcciones IP pueden configurarse de forma **estática**, donde un administrador asigna los valores manualmente para que nunca cambien hasta volver a ser actualizados; O configurarse de forma **dinámica** mediante el protocolo DHCP (_Dynamic Host Configuration Protocol_), encargado de alquilar direcciones automáticamente a los dispositivos que se conectan, simplificando la administración.

:::steps

### 1. Entender la estructura de una dirección IP

Una dirección IPv4 se representa mediante cuatro octetos (cuatro grupos de 8 bits), separados por puntos. Para comprender cómo se organiza una dirección IP, es necesario distinguir dos partes: **la porción de red**, que identifica la subred (ej.: red de una casa) a la que pertenece la dirección, y **la porción de host**, que identifica una interfaz dentro de esa subred (ej.: un celular conectado a la red de esa casa). La **máscara de subred** determina qué bits corresponden a cada porción, permitiendo que un dispositivo identifique si una dirección de destino pertenece a su misma subred o si debe enviar el tráfico a un router para alcanzar otra red.

### 2. Comprender la notación CIDR

La notación CIDR (_Classless Inter-Domain Routing_) permite expresar de forma compacta qué cantidad de bits de una dirección IPv4 corresponde a la red. Se escribe mediante una barra diagonal seguida de un número entre 0 y 32, que indica la longitud del prefijo de red.

```text
# Ejemplo de notación CIDR
192.168.10.0/24
```

En este ejemplo, `/24` indica que los primeros 24 bits identifican la red, mientras que los 8 bits restantes corresponden a la porción de _host_. Esto equivale a la máscara de subred `255.255.255.0`. En una subred IPv4 convencional como esta, se obtienen 256 direcciones en total, de las cuales 254 suelen poder asignarse a dispositivos: se reservan una para identificar la red y otra para broadcast.

### 3. Identificar direcciones especiales en IPv4

En una subred IPv4 convencional, algunas direcciones tienen funciones específicas. La **dirección de red** se obtiene colocando en cero todos los bits de la porción de host y se utiliza para identificar la subred. Por ejemplo, en `192.168.1.0/24`, la dirección de red es `192.168.1.0`. En cambio, la **dirección de broadcast** se obtiene colocando en uno todos los bits de host y permite enviar un paquete a todos los dispositivos de esa subred; en este ejemplo, es `192.168.1.255`. Por eso, en una subred `/24` convencional, las direcciones comprendidas entre `192.168.1.1` y `192.168.1.254` suelen poder asignarse a interfaces.

Otra dirección importante es `127.0.0.1`, conocida como _loopback_. Esta dirección permite que un equipo se comunique consigo mismo para probar servicios y componentes de su propia pila de red, sin enviar el tráfico a una red física.
:::

Cuando un dispositivo necesita enviar información, primero determina si la dirección IP de destino se encuentra en su misma subred utilizando su propia máscara de red. Si el destino es local, el emisor utiliza en IPv4 el protocolo **ARP (_Address Resolution Protocol_)** o en IPv6 el protocolo _Neighbor Discovery_ para averiguar qué dirección MAC corresponde a esa dirección IP local y enviar la trama directamente a través del _switch_. Si el destino está en una red diferente, el dispositivo debe enviar el paquete a su _gateway_ predeterminado (puerta de enlace), que generalmente es la dirección IP local del _router_ principal que conecta la organización con el exterior.

El _router_ recibe este paquete y consulta su tabla de enrutamiento, que es un mapa interno que contiene rutas estáticas (configuradas manualmente por el administrador) y rutas dinámicas (aprendidas automáticamente mediante protocolos de enrutamiento comunicándose con otros routers). Dado que los dispositivos de la red interna suelen usar direcciones IP privadas que no pueden navegar por Internet, el _router_ o el firewall aplican un proceso llamado **NAT (_Network Address Translation_)** o PAT (_Port Address Translation_). Este proceso intercepta el paquete, reemplaza la dirección IP privada de origen por la dirección IP pública del _router_, y lleva un registro interno para que, cuando regrese la respuesta, pueda traducir la dirección nuevamente y entregar el paquete al dispositivo interno correcto.

### Diferencias entre IP, MAC, Puerto y Socket

Para que la comunicación en una red sea exitosa, los datos no solo deben llegar al dispositivo correcto, sino también a la aplicación exacta que los está esperando. Este proceso se gestiona mediante una combinación de direcciones, protocolos de transporte y conexiones lógicas.

Para comprender el enrutamiento de la información, es útil pensar en la red como un sistema postal:

- **Dirección IP:** Como vimos antes, identifica de forma única la ubicación lógica de un dispositivo en una red (como la dirección de un edificio). Puede cambiar y no identifica de forma permanente a un dispositivo.
- **Dirección MAC:** Es el identificador físico único asignado de fábrica a la tarjeta de red (NIC) del dispositivo para su identificación a nivel local. Funciona como la huella digital del hardware.
- **Puerto:** Es un punto virtual que organiza la transmisión y permite a los protocolos dirigir los datos al programa o servicio correcto dentro del dispositivo (como el número de departamento dentro del edificio).
- **Socket**: Es un punto de conexión virtual que permite que dos programas o computadoras hablen entre sí a través de una red o internet (por ejemplo, cuando carga una página web). Funciona como una puerta con una dirección IP y un número de puerto.

> [!NOTE]
> Para entender los sockets: La dirección IP identifica un equipo en la red y el puerto permite dirigir los datos al servicio correspondiente con el que se quiere comunicar. Por ejemplo, 192.168.1.50:443 representa una dirección IP y el puerto habitualmente utilizado por HTTPS.

### Protocolos orientados a conexión y sin conexión: TCP vs. UDP

La capa de transporte permite que las aplicaciones intercambien datos entre procesos que se ejecutan en distintos dispositivos. TCP y UDP son dos de los protocolos de transporte más utilizados, pero ofrecen servicios diferentes.

#### TCP (Transmission Control Protocol)

Es un protocolo orientado a conexión que permite a dos dispositivos conectarse y transmitir datos de forma ordenada y confiable. TCP gestiona la información implementando mecanismos de secuenciación (ordenando los paquetes), confirmaciones (acuse de recibo) y control de flujo para evitar la congestión de la red e intentar enviar los paquetes de forma fiable y en orden.

Para lograr esto, TCP requiere establecer una sesión previa mediante un proceso de tres pasos (_Three-way Handshake_):

1. El cliente envía una solicitud de sincronización (**SYN**) al servidor.
2. El servidor responde con un mensaje de confirmación y sincronización (**SYN/ACK**).
3. El cliente responde con una confirmación final o _acknowledgement_ (**ACK**), estableciendo la conexión.

Una vez finalizada la transmisión, TCP realiza un proceso de cierre de conexión utilizando banderas **FIN** (finalizar) para cerrar ordenadamente la sesión. Si ocurre un error irrecuperable, se puede forzar el cierre mediante la bandera **RST** (reset).

Las conexiones TCP transitan por diferentes estados (como `LISTEN`, `ESTABLISHED` o `TIME_WAIT`), lo que permite a los _firewalls_ realizar un seguimiento de estado (_stateful tracking_) para filtrar proactivamente las amenazas.

#### UDP (User Datagram Protocol)

UDP es un protocolo de transporte sin conexión. Envía datagramas sin establecer previamente una conexión equivalente al handshake de TCP y no proporciona garantías de entrega, orden ni retransmisión. Al eliminar los mecanismos de control, reduce al mínimo la sobrecarga en la red y la latencia. Esto lo hace ideal para transmisiones en tiempo real donde la velocidad es más crítica que la precisión absoluta, como videollamadas, juegos en línea o consultas DNS.

### ICMP e ICMPv6 para control y diagnóstico

El Protocolo de Mensajes de Control de Internet (**ICMP, _Internet Control Message Protocol_**) se utiliza en la capa de red para diagnosticar una red: compartir información de errores, actualizaciones de estado y probar la conectividad entre dispositivos. ICMPv6 cumple la misma función para redes IPv6, incorporando funciones adicionales de descubrimiento de vecinos.

El comando `ping` utiliza normalmente mensajes ICMP Echo Request y Echo Reply para comprobar si un destino responde a ese tipo de solicitud y medir el tiempo de ida y vuelta. Ejemplo: Una computadora envía un paquete Echo Request hacia la dirección IP o dominio de destino (por ejemplo, ping google.com); Si el equipo de destino está encendido y permite este tráfico, recibe el paquete y devuelve otro paquete ICMP llamado Eco Reply. Luego, el comando mide el tiempo exacto que tarda el paquete en ir y volver (latencia) e indica si hubo pérdida de datos

Es útil imaginar a ICMP es como un camión de mantenimiento de carreteras: Su único trabajo es asegurarse de que las vías funcionen bien e informar si hay problemas. Por ejemplo, una computadora puede enviar un mensaje ICMP a un sitio web para ver si está activo y cuánto tarda en responder, o, si un paquete de datos no puede llegar a su destino porque un servidor se cayó, el router puede devolver un mensaje ICMP indicando "Destino inalcanzable".

> [!WARNING]
> Los atacantes pueden abusar de ICMP para realizar reconocimiento de red o ataques de denegación de servicio (DoS), como la "Inundación ICMP" o el "Ping de la muerte" (_Ping of Death_), que envían paquetes masivos o malformados para agotar el ancho de banda del servidor.

### Puertos de origen y destino

Cada vez que se inicia una comunicación TCP o UDP, los puertos permiten distinguir los procesos que participan en el intercambio. Se distinguen dos puertos:

- **Puerto de origen:** Identifica el extremo de transporte del emisor. En conexiones iniciadas por un cliente, el sistema operativo suele seleccionar un puerto temporal, denominado puerto efímero, dentro del rango configurado en el sistema.
- **Puerto de destino:** Identifica el servicio o proceso al que se dirige el tráfico en el extremo receptor. Por convención, servicios como HTTP y HTTPS suelen utilizar TCP 80 y TCP 443, respectivamente, aunque una aplicación puede configurarse para escuchar en otros puertos.

Los puertos TCP y UDP se dividen en tres rangos definidos por la IANA:

- **Puertos conocidos (_well-known ports_)**: 0–1023.
- **Puertos registrados (_registered ports_)**: 1024–49151.
- **Puertos dinámicos o privados** (_dynamic/private ports_): 49152–65535.

Estos rangos no significan que todo servicio deba utilizar un puerto determinado ni que todos los sistemas operativos seleccionen los puertos efímeros de la misma forma. La asignación efectiva depende del sistema y de su configuración.

### Servicios en escucha y estado de los puertos

Un **servicio en escucha** (_listening service_) es un programa o proceso que se mantiene activo en segundo plano, esperando recibir solicitudes entrantes en un puerto específico. Al auditar qué puertos y servicios están abiertos en el sistema (por ejemplo, ejecutando `ss -tulpn` en la terminal), es fundamental observar la **dirección IP de enlace** (_bind address_) para entender el alcance y la exposición real del servicio:

- **`127.0.0.1` (o `::1` en IPv6) — Interfaz de bucle local (_loopback_):** El servicio únicamente escucha solicitudes originadas dentro de la propia máquina local. Ningún dispositivo externo de la red ni de Internet puede alcanzar este puerto. Es ideal para bases de datos locales, colas internas o paneles administrativos que no deben exponerse al exterior.
- **`0.0.0.0` (o `*` / `::` en IPv6) — Dirección comodín (_wildcard_):** Significa que el servicio está **escuchando en todas las interfaces de red del equipo simultáneamente** (hacia adentro y hacia afuera). Esto implica que el puerto está expuesto a cualquier dispositivo con conectividad hacia la máquina (en la red local, en la VPN o directamente en Internet si no hay un firewall intermedio o local que lo restrinja).

Distinguir entre `127.0.0.1` y `0.0.0.0` al tirar comandos como `ss -tulpn` es vital para saber de inmediato qué servicio es solo interno y cuál está expuesto a toda la red como una potencial superficie de ataque.

Desde la perspectiva de una prueba de conectividad (escaneo de red), un puerto puede presentar tres estados:

1. **Abierto:** Hay un servicio activo escuchando en ese puerto y aceptando conexiones. Indica que el servicio o el puerto acepta el tipo de conexión probado.
2. **Cerrado:** El puerto es accesible, pero no hay ningún servicio escuchando en él.
3. **Filtrado:** Las sondas de red no pueden alcanzar el puerto, generalmente porque un _firewall_ o regla de red está bloqueando el tráfico e impidiendo determinar si está abierto o cerrado.

> [!CRITICAL]
> Cada servicio expuesto (puerto abierto) en una red puede convertirse un vector de entrada si contiene vulnerabilidades. Deshabilitar servicios innecesarios, limitar las interfaces en las que escuchan y restringir quién puede conectarse a ciertos puertos son buenas prácticas para reducir la superficie de ataque.

### DNS (Sistema de Nombres de Dominio)

Las redes dependen de servicios que suelen pasar inadvertidos para el usuario, pero que son esenciales para localizar sistemas, configurar dispositivos y coordinar operaciones.

**DNS (_Domain Name System_)** es como el directorio telefónico de Internet. Es el protocolo encargado de traducir nombres de dominio legibles para los humanos (como `www.google.com`) a direcciones IP necesarias para que los routers ubiquen el servidor correcto, operando generalmente a través del puerto UDP 53.

El proceso de **resolución de nombres** depende de un trabajo en equipo entre distintos tipos de servidores y estrategias de búsqueda:

- **Consultas recursivas vs. iterativas:** En una consulta recursiva, el equipo le pide una IP al servidor DNS local y le delega la responsabilidad ("busca la respuesta final o devuélveme un error"). Para cumplir con esto, ese servidor local realiza consultas iterativas: va preguntando paso a paso a diferentes servidores en la jerarquía de internet, saltando de uno a otro hasta dar con la IP correcta.
- **Servidores Autoritativos vs. Recursivos:** Tienen roles complementarios. Los recursivos (usualmente provistos por el ISP o la red local) actúan como intermediarios o "investigadores" que hacen el trabajo de búsqueda DNS. Los **autoritativos**, en cambio, son la fuente oficial: guardan la verdad absoluta y final sobre la configuración de un dominio específico, y sólo se llega a ellos como recurso final cuando una consulta no pudo ser respondida por el servidor recursivo.

Además de ¨traducir¨ nombres web a direcciones IP, DNS utiliza el mismo flujo para tomar el tráfico que llega a un nombre único y lo redirige dinámicamente hacia los servidores especializados (de correo, de aplicaciones, de bases de datos, etc.) según lo que el cliente esté solicitando. Para ello, utiliza distintos **tipos de registros**:

- **A:** Asocia un dominio con una dirección **IPv4**.
- **AAAA:** Asocia un dominio con una dirección **IPv6**.
- **CNAME:** Crea un alias (un nombre alternativo que apunta a otro dominio principal).
- **MX (Mail Exchange):** Indica qué servidor se encarga de recibir los correos electrónicos del dominio.
- **NS (Name Server):** Señala cuáles son los servidores DNS autoritativos para ese dominio.
- **TXT (Texto):** Almacena información de configuración y verificación (muy importante para configuraciones de ciberseguridad y validación de correos).
- **PTR (Pointer):** Hace el camino inverso, relacionando una dirección IP con un nombre de dominio (resolución inversa).

> [!NOTE]
> Para evitar muchas consultas repetidas, los sistemas operativos y los servidores DNS pueden almacenar en **caché** respuestas durante un tiempo definido por el **TTL** (_Time to Live_). Además, las organizaciones pueden utilizar DNS interno para resolver nombres privados y DNS público para publicar servicios accesibles desde Internet.

### DHCP (Protocolo de Configuración Dinámica de Host)

El protocolo DHCP (_Dynamic Host Configuration Protocol_) asigna automáticamente una dirección IP a cada dispositivo que se conecta a la red -junto con otros parámetros como la máscara de subred, la puerta de enlace predeterminada (_gateway_), etc. Esto, evitando la configuración manual.

DHCPv4 utiliza el puerto UDP 67 en el servidor y UDP 68 en el cliente. Las direcciones suelen asignarse mediante concesiones temporales (_leases_), que pueden renovarse. También pueden configurarse reservas con la dirección MAC con una dirección IP específica y estática: Cuando el servidor ve que esa MAC pide conexión, le asigna automáticamente esa IP fija reservada.

Si bien DHCP automatiza la administración, también es un vector de ataque crítico. La amenaza principal es el despliegue de un servidor DHCP no autorizado (_Rogue DHCP_). El atacante puede entregar parámetros alterados (como un DNS o puerta de enlace maliciosa) para redirigir e interceptar el tráfico de los usuarios. Para mitigarlo, se debe implementar **_DHCP Snooping_** en los switches para admitir respuestas DHCP solo desde puertos confiables.

Acá tenés la versión mejorada. Mantuve la misma estructura y el formato, pero le inyecté un poco más de contexto técnico y de ciberseguridad para que explique no solo _qué_ hace cada protocolo, sino _por qué_ es tan crítico en la vida real de una infraestructura.

### Protocolos NTP, SNMP, Syslog y Directorios

- **NTP (Network Time Protocol):** Sincroniza los relojes de todos los dispositivos de la infraestructura. Una estricta precisión temporal no solo es indispensable para correlacionar _logs_ en un SIEM y trazar la línea de tiempo exacta de un ataque, sino que es un requisito técnico: protocolos de seguridad como Kerberos (usado en Windows) o la validación de certificados TLS fallan automáticamente y bloquean accesos si los relojes se encuentran desfasados.
- **SNMP (Simple Network Management Protocol):** Es el estándar para administrar, configurar y monitorear la "salud" de equipos de red como _routers_, _switches_ o _firewalls_. Funciona recolectando métricas de estado y enviando alertas automáticas (_Traps_) cuando ocurre una anomalía. A nivel de seguridad, es vital implementar la versión **SNMPv3**, ya que incluye cifrado y autenticación (las versiones anteriores transmiten los datos en texto plano).
- **Syslog:** Actúa como el sistema nervioso del monitoreo. Permite a múltiples dispositivos enviar continuamente registros de eventos (_logs_) hacia un servidor central. En lugar de auditar máquina por máquina, Syslog consolida la información en un solo lugar para que las herramientas de análisis la procesen y detecten amenazas en tiempo real.
- **Directorios de red (LDAP / Active Directory):** Funcionan como el mapa central de una organización, almacenando cuentas de usuarios, dispositivos, grupos y políticas de permisos. **LDAP** es el protocolo de red utilizado para consultar, leer y modificar esa información. **Active Directory (AD)**, por su parte, es el ecosistema de Microsoft que agrupa LDAP para organizar la estructura, DNS para que los equipos se encuentren entre sí, y Kerberos para la autenticación segura.

> Es crucial entender la diferencia operativa en la gestión de accesos (IAM): La **gestión de identidades** define quiénes son los usuarios y qué atributos tienen en el directorio (LDAP/AD); la **autenticación** verifica que el usuario es quien dice ser (validando credenciales); y la **autorización** determina a qué recursos específicos tiene permiso de acceder una vez validado.

Estos servicios no operan de forma aislada; forman una cadena de dependencias críticas. Si el servidor DNS se cae, la red queda a ciegas y los equipos no pueden localizar el Active Directory. Si un servidor DHCP fraudulento reparte parámetros maliciosos, el tráfico interno es secuestrado. Si el NTP pierde sincronización, los procesos de autenticación fallan y se destruye la trazabilidad forense de los _logs_. Proteger la integridad de la infraestructura de redes es el paso cero en cualquier arquitectura de seguridad.

### Protocolos de aplicación y servicios de red

Comprender los protocolos de aplicación permite identificar cómo interactúan los sistemas, qué servicios necesitan estar accesibles y qué riesgos pueden surgir de una configuración incorrecta, de protocolos obsoletos o de una exposición innecesaria.

### Navegación web y comunicación con aplicaciones

| Protocolo | Función                                                                                                                          | Puertos | Consideraciones de Seguridad |
| --------- | -------------------------------------------------------------------------------------------------------------------------------- | ------- | ---------------------------- |
| **HTTP**  | Permite la comunicación entre navegadores web y servidores mediante solicitudes (GET, POST) y códigos de estado (200, 404, 500). |

| TCP 80 | Transmite toda la información en texto plano sin cifras. Considerado inherentemente inseguro para datos sensibles como contraseñas.

|
| **HTTPS** | Protege los datos para evitar que sean interceptados por terceros durante la transmisión. Es la versión segura de HTTP, transportado sobre una conexión protegida mediante TLS.

| TCP 443 | Protege la comunicación mediante cifrado y mecanismos de integridad, y permite autenticar el servidor mediante certificados. Aunque no garantiza que la aplicación sea segura ni que el usuario esté autenticado.

|

**TLS** (_Transport Layer Security_) es el estándar actual de cifrado para proteger la integridad y confidencialidad en tránsito. SSL es su predecesor histórico yus versiones están obsoletas y contienen vulnerabilidades; Su uso debe estar prohibido en configuraciones modernas.

HTTPS utiliza certificados digitales TLS para autenticar el nombre del servidor y establecer parámetros criptográficos. En el uso habitual de la web pública, el cliente verifica la cadena de certificados contra autoridades certificantes (_Certificate Authorities_, CA) de confianza. Esto garantiza que sitio es legítimo y no una suplantación, y que los datos transmitidos no han sido alterados en el camino.

Existen diferentes niveles de certificados TLS:

Tipos de certificados TLS

- **DV (Validación de Dominio)**: Nivel básico; verifica solo que el solicitante controla el dominio (lo ideal para blogs o webs informativas).
- **OV (Validación de Organización)**: Nivel medio; valida la identidad y datos de la empresa propietaria.
- **EV (Validación Extendida)**: Nivel alto; requiere un proceso de verificación exhaustivo (utilizado por bancos y comercio electrónico).

> [!TIP]
> Es vital distinguir entre **cifrado en tránsito** (como TLS, que protege los datos mientras viajan por la red), **cifrado en reposo** (que protege los archivos almacenados en el disco mediante algoritmos como AES) y la **autenticación** (que verifica la identidad del usuario). Una conexión puede estar cifrada (HTTPS) pero carecer de autenticación, permitiendo que cualquiera acceda a la aplicación de forma anónima.

### Acceso remoto y administración

El acceso remoto administrativo es el mecanismo que permite gestionar sistemas sin presencia física. Esto es una ventaja, pero amplía la superficie de ataque si los servicios quedan expuestos o sus mecanismos de autenticación son débiles.

- **SSH (Secure Shell):** Permite conectarse de forma segura a servidores u otros dispositivos de forma remota, cifrando toda la comunicación. Soporta autenticación mediante contraseñas robustas o, preferentemente, mediante pares de claves criptográficas. Opera sobre el puerto TCP 22.

- **Telnet:** Permite conectarse a otro dispositivo remotamente mediante una consola de texto, pero no cifra la información, exponiendo comandos y contraseñas en texto claro. Su uso está obsoleto y fue reemplazado por SSH. Opera en el puerto TCP 23.

- **RDP (Remote Desktop Protocol):** Utilizado en entornos Windows para acceder a interfaces gráficas de escritorio remoto (puerto TCP 3389). Es un objetivo primario para ataques de fuerza bruta y despliegue de _ransomware_ si se expone directamente a Internet.
- **VPN (_Virtual Private Network_):** Establece un túnel lógico que protege el tráfico entre extremos según el protocolo y la configuración utilizados. Oculta la dirección IP y cifra los datos mediante un proceso de encapsulamiento, permitiendo a usuarios o sucursales conectarse de forma segura a la red interna corporativa a través de redes públicas.
- **IPsec:** Es una suite de protocolos que permite proteger comunicaciones IP mediante mecanismos de autenticación, integridad y, según la configuración, cifrado. Se utiliza en diversos escenarios de VPN, especialmente para conectar redes o dispositivos a nivel de IP.

> [!CRITICAL]
> **Riesgo de exposición:** Los servicios de administración remota, como SSH y RDP, deben tener una exposición cuidadosamente controlada. Siempre que sea posible, se recomienda evitar su acceso directo desde Internet y permitirlo únicamente mediante canales protegidos, como una VPN, un servicio ZTNA (Zero Trust Network Access) o un bastión de acceso.

### Transferencia y compartición de archivos

- **FTP (File Transfer Protocol) y FTPS:** Permite transferir archivos. En el modo activo tradicional suele utilizar TCP 21 para el canal de control y TCP 20 para el canal de datos; en modo pasivo, el canal de datos utiliza puertos negociados. FTP no cifra por sí mismo las credenciales ni el contenido. **FTPS** es FTP protegido mediante cifrado TLS.

- **SFTP** (_SSH File Transfer Protocol_): Permite transfierir archivos de forma segura operando a través de una conexión SSH (puerto TCP 22).

- **SMB y NFS:** Son protocolos utilizados para compartir archivos y recursos en red. SMB (_Server Message Block_) es común en entornos Windows y suele utilizar TCP 445. NFS (_Network File System_) es el equivalente en sistemas Unix/Linux y puede utilizar distintos servicios y puertos según la versión. Ambos deben limitarse a los segmentos y usuarios que realmente los necesitan. La exposición innecesaria de servicios de compartición a Internet aumenta significativamente el riesgo; el incidente de _ransomware WannaCry_ es un ejemplo histórico de ello.

### Monitoreo y otros protocolos relevantes

- **SNMP:** Permite supervisar y, según los permisos, administrar dispositivos de red. SNMPv1 y SNMPv2c carecen de las protecciones criptográficas de SNMPv3 y utilizan cadenas de comunidad como mecanismo de acceso. Siempre que sea posible, debe preferirse SNMPv3 con autenticación y privacidad, además de restricciones de acceso y supervisión.

- **QUIC y HTTP/3:** QUIC es un protocolo de transporte moderno que funciona sobre UDP y proporciona mecanismos de establecimiento de conexión, fiabilidad y seguridad criptográfica. HTTP/3 utiliza QUIC para transportar HTTP y busca mejorar el rendimiento en diferentes condiciones de red.

> [!TIP]
> **Estrategia de transición y buenas prácticas**
> Como regla general, conviene deshabilitar los protocolos obsoletos cuando ya no sean necesarios y migrar a alternativas que proporcionen las garantías de seguridad requeridas:
>
> - Reemplazar **Telnet** por **SSH** para la administración remota.
> - Sustituir **FTP** por **SFTP** o **FTPS** para la transferencia de archivos.
> - Forzar la redirección de todo el tráfico **HTTP** hacia **HTTPS**.
> - Bloquear estrictamente el tráfico de protocolos de red local (como **SMB** o **NFS**) en el perímetro, impidiendo por completo su exposición a Internet.

### Lectura de tráfico y diagnóstico de conectividad

Analizar el tráfico de red permite verificar cómo se comunican los sistemas, investigar fallos y buscar indicios de actividad maliciosa. La comunicación en red se basa en el envío de paquetes de datos, los cuales contienen una **cabecera** (_header_) con información de enrutamiento (IP de origen y destino, puertos, protocolos) y una **carga útil** (_payload_) con la información real (datos transportados). La información visible depende del nivel de captura y de los mecanismos de cifrado utilizados.

La captura y el análisis de paquetes (_packet sniffing_) es la práctica de inspeccionar este tráfico utilizando analizadores de protocolos de red.

- **Wireshark:** Es una herramienta con interfaz gráfica (GUI) que permite capturar y analizar tráfico y lo muestra en un formato legible, permitiendo aplicar filtros y ver estadísticas de una red. Por ejemplo, el filtro `ip.addr == 192.168.1.10` muestra paquetes IPv4 cuya dirección de origen o destino coincida con esa dirección.

- **tcpdump:** Es la alternativa de línea de comandos (CLI), que permite capturar y filtrar tráfico desde una terminal (CLI). Puede guardar capturas en archivos `.pcap` o formatos compatibles para analizarlas posteriormente.

Estas herramientas son muy útiles para examinar aspectos como el establecimiento de conexiones TCP, consultas DNS, solicitudes web y mensajes de control. Sin embargo, cuando el tráfico está cifrado, el _payload_ no suele ser legible sin claves u otros mecanismos de análisis autorizados. Incluso en ese caso, pueden seguir siendo visibles metadatos relevantes, como direcciones, puertos, tamaños y tiempos de los paquetes para identificar posibles ataques, por ejemplo.

### Segmentación en arquitectura de red

La arquitectura de red define cómo se conectan los sistemas, cómo circula el tráfico y qué controles limitan la comunicación entre ellos. En una red plana, los dispositivos comparten un mismo segmento o dominio de comunicación amplio y, según la configuración, pueden tener conectividad directa con muchos otros sistemas Este modelo es altamente vulnerable para una empresa: si un atacante compromete un equipo, podría acceder sin restricciones a otros dipositivos y propagar el incidente.

Para resolver este problema, se implementa la **segmentación**, que consiste en dividir una red en zonas o segmentos con límites de comunicación definidos. Su objetivo es reducir la exposición innecesaria, limitar el movimiento lateral y aplicar controles adecuados a cada tipo de recurso. Y no basta sólo con crear segmentos: es necesario definir y verificar las reglas que determinan qué tráfico puede atravesarlos.

### Separación física y lógica

- **Segmentación física:** Implica usar cableado y hardware (switches, routers) completamente independientes para separar redes. Puede proporcionar aislamiento seguro pero implica costos y necesidades de administración mayores.
- **Segmentación lógica (Capa 2 y Capa 3):** Se logra a través de configuraciones de software en los equipos de red. En la Capa 2 (Enlace de datos), se utilizan VLANs (_Virtual Local Area Networks_) en los _switches_ para agrupar dispositivos como si estuvieran en redes físicas distintas, aislando el tráfico de _broadcast_. En la Capa 3 (Red), el _subnetting_, divide el espacio de direcciones IP en grupos lógicos, organizando mejor a los dispositivos y mejorando la eficiencia del tráfico.

Una VLAN y una subred IP son conceptos diferentes, aunque en muchas redes se asigna una subred IP a cada VLAN para facilitar la administración. Crear VLAN no garantiza por sí solo que los dispositivos estén aislados a nivel de IP: si existe enrutamiento entre ellas, se deben aplicar políticas que controlen ese tráfico. Del mismo modo, utilizar subredes diferentes no garantiza aislamiento si los routers permiten la comunicación sin restricciones.

### Zonas de confianza y filtrado de tráfico

Una zona de seguridad es un segmento o conjunto de recursos que comparte requisitos y políticas de protección. Las zonas habituales pueden incluir redes exclusivas para servidores, redes para usuarios regulares, redes aisladas para invitados y redes segregadas para dispositivos IoT como cámaras de seguridad o sensores (que suelen tener configuraciones inseguras y no requieren acceso a los servidores internos). La clasificación debe basarse en el riesgo, la función de los activos y las comunicaciones que realmente necesitan.

> [!NOTE]
> La **DMZ** (_Demilitarized Zone_ o Zona Desmilitarizada) es un área externa expuesta que contiene los servicios públicos de la organización (como servidores web o DNS). Idealmente, la DMZ se sitúa entre dos _firewalls_: uno que filtra el tráfico desde Internet hacia la DMZ, y otro que controla lo que entra desde la DMZ hacia la red corporativa. Lo esencial es que existan límites claros y reglas explícitas entre Internet, la DMZ y las redes internas.

El tráfico dentro y entre estas zonas se clasifica por su dirección:

- **Tráfico norte-sur (_north-south_)**: entra o sale de un entorno definido, por ejemplo, entre la red corporativa e Internet.
- **Tráfico este-oeste (_east-west_)**: circula entre sistemas o segmentos dentro de ese entorno, por ejemplo, entre un servidor web y uno de bases de dato en la misma empresa.

Para controlar estos flujos, se emplean **Listas de Control de Acceso (ACL)** y _**firewalls**_. Una ACL permite o deniega tráfico según criterios definidos por la tecnología que la implementa, como direcciones IP, protocolos y puertos. Un firewall puede incorporar funciones adicionales, como seguimiento de estado, inspección de aplicaciones o integración con identidades.

La segmentación es, entonces, tanto una decisión de arquitectura como un control defensivo. Su eficacia debe verificarse comprobando que las comunicaciones permitidas funcionan y que las no autorizadas quedan efectivamente bloqueadas (disponibilidad y confidencialidad).

## Fundamentos de Sistemas Operativos <!-- id: networks-operating-systems-os, icon: CpuIcon -->

## 1.5.B. Fundamentos de Sistemas Operativos

### Fundamentos de sistemas operativos

Un **Sistema Operativo (SO)** es la interfaz esencial que actúa como intermediario entre el hardware físico de la computadora y los programas o usuarios, administrando los recursos finitos del equipo como el procesador, la memoria RAM, los discos de almacenamiento y las interfaces de comunicación. Comprender la arquitectura y el comportamiento del sistema operativo resulta indispensable en ciberseguridad: cualquier debilidad, servicio expuesto o error de configuración en esta capa puede comprometer la totalidad de los datos y de la infraestructura conectada.

En el ámbito corporativo y personal contemporáneo, tres familias principales concentran casi la totalidad de los despliegues tecnológicos:

- **Windows:** Desarrollado por Microsoft, es una plataforma de código cerrado (_closed-source_) y la más extendida en estaciones de trabajo y puestos de oficina. Por su amplia adopción, representa el blanco más frecuente de ataques masivos, ransomware y amenazas automatizadas, exigiendo una supervisión constante de parches, directivas de seguridad centralizadas y soluciones defensivas de punto final.
- **macOS:** Desarrollado por Apple, opera sobre una base basada en UNIX (su núcleo Darwin). Destaca por su estabilidad y su estricto modelo de permisos para aplicaciones gráficas. Aunque cuenta con sólidas protecciones integradas, no es invulnerable frente a exploits dirigidos o técnicas de ingeniería social.
- **Linux:** Sistema de código abierto (_open-source_) que sustenta la gran mayoría de servidores de Internet, infraestructuras en la nube, supercomputadoras, dispositivos móviles (mediante Android) y sistemas embebidos de IoT. Su transparencia, modularidad y potencia operativa lo posicionan como el entorno principal para la administración de sistemas y la ingeniería de seguridad.

A diferencia de las soluciones cerradas provistas por un único fabricante, la palabra "Linux" hace referencia estricta a su **Kernel** o núcleo, creado por Linus Torvalds en 1991. Para construir un sistema utilizable, el núcleo se integra con herramientas del proyecto GNU (iniciado por Richard Stallman), gestores de paquetes y entornos de usuario. Esta unión conforma lo que se denomina una **distribución** (o _distro_). Gracias a las licencias de código abierto, organizaciones y comunidades pueden adaptar Linux a necesidades concretas:

| Distribución                        | Enfoque Principal                                                             | Tipo de Licencia y Soporte                                        |
| :---------------------------------- | :---------------------------------------------------------------------------- | :---------------------------------------------------------------- |
| **Ubuntu**                          | Servidores generales, estaciones de desarrollo y nube. Gran facilidad de uso. | Código abierto, respaldo y ciclo regular por Canonical.           |
| **Red Hat Enterprise Linux (RHEL)** | Entornos empresariales de misión crítica y banca.                             | Comercial con suscripción y soporte técnico garantizado.          |
| **Debian**                          | Servidores caracterizados por su extrema estabilidad. Base de Ubuntu y Kali.  | Código abierto, gestionada de forma comunitaria y rigurosa.       |
| **AlmaLinux / Rocky Linux**         | Reemplazos binarios directos de CentOS para centros de datos.                 | Código abierto, impulsadas por fundaciones sin coste de licencia. |
| **Kali Linux**                      | Pruebas de penetración, auditoría de seguridad y análisis forense.            | Código abierto, mantenida por la organización Offensive Security. |

_Principales distribuciones de Linux presentes en infraestructuras y laboratorios de seguridad._

### ¿Por qué Linux es el estándar en ciberseguridad?

El liderazgo de Linux en la defensa informática, la gestión de servidores y la auditoría de seguridad responde a propiedades fundamentales de su diseño:

1. **Transparencia y auditoría completa:** Al contar con código fuente abierto, es posible inspeccionar cada componente del sistema operativo para verificar qué instrucciones ejecuta y cómo manipula la memoria o los paquetes de red, sin depender de cajas negras comerciales.
2. **Control granular desde la línea de comandos (CLI):** Linux fue concebido para ser administrado íntegramente desde la terminal. El intérprete de comandos permite gestionar servicios, consultar telemetría del sistema y orquestar flujos de trabajo sin requerir interfaces gráficas que consuman recursos innecesarios.
3. **Ecosistema de distribuciones especializadas:** Existen distribuciones que incorporan de fábrica herramientas para análisis de vulnerabilidades, auditoría forense y monitorización de tráfico, ahorrando tiempo en la preparación de entornos de prueba.

> [!WARNING:Uso de Distribuciones de Seguridad]
> Las distribuciones como Kali Linux están orientadas a pruebas de seguridad y omiten intencionalmente ciertas restricciones defensivas habituales (como barreras en la ejecución de scripts o servicios auxiliares) para facilitar la labor técnica. Por este motivo, **nunca deben utilizarse como sistema operativo habitual de escritorio para navegación personal o gestión de cuentas diarias**, sino en entornos aislados como máquinas virtuales o unidades de inicio dedicadas.

### Arquitectura del Sistema: El Kernel y la Superficie de Ataque

El **Kernel** es el corazón operativo del equipo. Reside en memoria permanente mientras la máquina esté encendida y asume la responsabilidad de arbitrar el acceso al procesador, proteger los espacios de memoria asignados a cada aplicación, controlar los discos y comunicarse con los dispositivos mediante controladores (_drivers_).

Para evitar que una falla o un programa malicioso altere la máquina completa, las arquitecturas de hardware modernas segmentan la ejecución en niveles de privilegio conocidos como **anillos de protección** (_Protection Rings_):

| Nivel de Protección | Denominación                       | Quién opera en este nivel                                                      | Implicación para la seguridad                                                                                            |
| :------------------ | :--------------------------------- | :----------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------- |
| **Ring 0**          | Espacio de Kernel (_Kernel Space_) | El Kernel y controladores críticos del sistema.                                | Privilegios absolutos sobre el hardware y la memoria. Una intrusión aquí compromete todo el equipo.                      |
| **Ring 1 y Ring 2** | Espacio de Controladores           | Controladores auxiliares y servicios intermedios.                              | Rara vez utilizados en sistemas operativos modernos de propósito general.                                                |
| **Ring 3**          | Espacio de Usuario (_User Space_)  | Aplicaciones de usuario, navegadores, servicios de red y comandos de terminal. | Entorno estrictamente restringido. Cada solicitud al hardware debe tramitarse mediante llamadas al sistema (_syscalls_). |

Las aplicaciones cotidianas se ejecutan en el espacio de usuario (**Ring 3**). Si un navegador web o un procesador de texto necesita leer un archivo del disco o abrir una conexión de red, no puede comunicarse directamente con la tarjeta de red ni con el disco duro: debe invocar una **llamada al sistema** (_system call_ o _syscall_) para que el Kernel verifique la legitimidad de la acción y la ejecute en su nombre. Este aislamiento impide que un error en una aplicación derrumbe el sistema entero. Un ataque de **escalada de privilegios** busca justamente romper esta barrera para obtener control total en el Ring 0.

#### El proceso de arranque y la supervisión inicial con systemd

Entender la secuencia que sigue una máquina desde que se presiona el botón de encendido hasta que está lista para su uso permite identificar en qué fase puede intervenir un atacante para lograr persistencia:

1. **Firmware (UEFI / BIOS):** Código almacenado en un chip físico de la placa base. Se encarga de verificar el hardware básico (POST) y transferir el control al gestor de arranque. Tecnologías como _Secure Boot_ validan la firma criptográfica del gestor para impedir que se cargue software adulterado antes de iniciar el sistema.
2. **Gestor de arranque (_Bootloader_, comúnmente GRUB):** Pequeño programa residente en el almacenamiento que localiza la imagen del Kernel de Linux en el disco, la carga en la memoria RAM y le entrega el control de la computadora.
3. **Inicialización del Kernel:** El Kernel toma el control, detecta los componentes del hardware, activa los controladores esenciales y monta el sistema de archivos raíz (`/`).
4. **Inicio del gestor del sistema (`systemd` con PID 1):** El Kernel ejecuta el primer proceso del espacio de usuario, conocido como `systemd`. Al ser el proceso número 1, se convierte en el padre o antecesor de todos los demás procesos y servicios que correrán en la máquina.

En la mayoría de distribuciones modernas, `systemd` organiza las tareas mediante **unidades** (_units_), tales como:

- **`.service`:** Representa un servicio en segundo plano (_daemon_), como el servidor web (`nginx.service`) o el acceso remoto (`ssh.service`).
- **`.target`:** Agrupa múltiples unidades para definir el estado deseado del sistema (por ejemplo, `multi-user.target` para un servidor en modo texto con red activa).
- **`.timer`:** Programa tareas repetitivas en el tiempo, funcionando como alternativa moderna a los cronjobs tradicionales.

Para inspeccionar y gestionar estos servicios se utiliza la herramienta `systemctl`:

```bash:terminal
# Consultar el estado del servicio de acceso seguro SSH
systemctl status ssh.service
```

- **`systemctl`:** Es el comando principal para interactuar y enviar órdenes al gestor `systemd`.
- **Acción `status`:** Indica al comando que no debe modificar nada, sino recopilar e imprimir en pantalla el estado actual del servicio: si está activo (_running_), inactivo (_dead_) o si presentó errores, junto con sus líneas de registro (_logs_) más recientes.
- **Argumento `ssh.service`:** Especifica sobre qué unidad concreta se desea realizar la consulta.

Cuando es necesario activar o detener un servicio manualmente durante labores de mantenimiento, se emplean órdenes directas con privilegios administrativos:

```bash:terminal
# Iniciar o detener un servicio específico
sudo systemctl start nginx.service
sudo systemctl stop nginx.service
```

- **`sudo`:** Ejecuta la orden con facultades de superusuario, necesarias para alterar el estado operativo del sistema.
- **Acción `start`:** Ordena a `systemd` levantar y ejecutar el servicio indicado si se encontraba detenido.
- **Acción `stop`:** Señaliza al servicio que debe cerrar sus conexiones y finalizar su ejecución de manera ordenada.

### El Ecosistema Linux: Primer Contacto con la Terminal

La terminal o consola de comandos es el medio directo para interactuar con el sistema operativo sin depender de interfaces gráficas. Proporciona precisión absoluta, bajo consumo de recursos y la posibilidad de auditar con rapidez el estado interno de cualquier servidor remoto.

#### Entendiendo el Prompt

Al abrir una sesión de terminal, el sistema presenta una línea de texto introductoria denominada **prompt**, la cual aporta contexto vital sobre la sesión activa:

```
usuario@servidor-produccion:~/documentos$
│       │                   │           │
│       │                   │           └── Símbolo de privilegio:
│       │                   │               $ = usuario estándar sin privilegios
│       │                   │               # = superusuario (root)
│       │                   └── Ubicación actual (~ representa el directorio personal)
│       └── Nombre del equipo en la red (hostname)
└── Nombre de la cuenta de usuario conectada
```

> [!IMPORTANT]
> El símbolo final del prompt indica el nivel de autorización en ese instante: el signo `$` corresponde a un usuario común con permisos acotados, mientras que `#` revela que se opera como `root`, la cuenta con facultades absolutas sobre el sistema. Por seguridad, conviene evitar trabajar de forma permanente bajo el símbolo `#`, recurriendo a elevaciones temporales solo cuando sea estrictamente imprescindible.

#### Anatomía de un Comando

La interacción en la terminal sigue una estructura regular compuesta por tres elementos fundamentales:

```
comando  [opciones]  [argumentos]
   │          │           │
   │          │           └── Destino: archivo, ruta o recurso sobre el que opera
   │          └── Modificadores: alteran el comportamiento predeterminado
   └── Acción principal: nombre del programa ejecutable que se invoca
```

- **Opciones cortas:** Comienzan con un único guión y una letra (por ejemplo `-l` o `-a`). Pueden agruparse en un solo bloque, como `-la`.
- **Opciones largas:** Utilizan dos guiones seguidos de una palabra descriptiva (por ejemplo `--all` o `--human-readable`), lo que facilita la lectura comprensiva de la orden.

#### Atajos Esenciales de la Terminal

Dominar combinaciones de teclas básicas agiliza la navegación y permite recuperar el control ante comandos bloqueados:

| Atajo                   | Función Práctica                                                                                                      |
| :---------------------- | :-------------------------------------------------------------------------------------------------------------------- |
| `Tab`                   | Autocompleta nombres de comandos, archivos y carpetas. Al pulsarlo dos veces, muestra todas las opciones disponibles. |
| `↑` / `↓`               | Navega cronológicamente por el historial de comandos ejecutados con anterioridad.                                     |
| `Ctrl + C`              | **Interrupción inmediata:** Cancela y detiene el proceso que se esté ejecutando en primer plano en la terminal.       |
| `Ctrl + L`              | Limpia la pantalla de la terminal para despejar la vista (equivalente al comando `clear`).                            |
| `Ctrl + D`              | Envía una señal de fin de transmisión (EOF), cerrando de forma segura la sesión activa o saliendo de un programa.     |
| `Ctrl + A` / `Ctrl + E` | Mueven el cursor al principio (`Ctrl + A`) o al final (`Ctrl + E`) de la línea de texto en edición.                   |

#### Errores Comunes y Cómo Interpretarlos

La terminal devuelve mensajes claros cuando una instrucción no puede completarse. Comprenderlos previene bloqueos en el aprendizaje:

| Mensaje de Error            | Causa Raíz                                                                                   | Solución Didáctica                                                                                                              |
| :-------------------------- | :------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| `command not found`         | El programa invocado no está instalado o no se encuentra en las rutas del sistema (`$PATH`). | Verificar la ortografía del comando o instalar el paquete correspondiente.                                                      |
| `Permission denied`         | El usuario carece de los permisos necesarios sobre el archivo o recurso solicitado.          | Revisar los permisos del archivo o anteponer `sudo` si la tarea requiere facultades administrativas legítimas.                  |
| `No such file or directory` | La ruta o archivo especificado no existe o se escribió con diferencias en mayúsculas.        | Comprobar la existencia con `ls` recordando que Linux distingue estrictamente entre mayúsculas y minúsculas (_case-sensitive_). |
| `Is a directory`            | Se intentó realizar una operación de lectura de archivo sobre una carpeta entera.            | Utilizar herramientas de directorio o parámetros recursivos apropiados.                                                         |

#### Consultar la Documentación en el Sistema

En Linux no es necesario memorizar todos los parámetros de memoria; el propio sistema operativo incluye manuales completos fuera de línea:

- **`man` (Manual):** Abre la documentación exhaustiva oficial de cualquier herramienta instalada.
  - Ejemplo: `man ls` muestra la descripción completa, la sintaxis formal y la totalidad de los parámetros admitidos. Para salir de este visor basta presionar la tecla `q`.
- **Parámetro `--help`:** Muestra un resumen rápido y sintético de las opciones más utilizadas directamente en la ventana de terminal sin abandonar la sesión actual (por ejemplo: `mkdir --help`).
- **`whatis`:** Proporciona una explicación breve de una sola línea sobre la función principal que cumple una herramienta (por ejemplo: `whatis grep`).

### Jerarquía del Sistema de Archivos (FHS)

En este SO rige un principio fundacional: **en Linux, prácticamente todo se representa como un archivo**. Los documentos de texto, los directorios, las particiones de disco, las conexiones de red y la telemetría de los procesos en ejecución se consultan a través de una jerarquía de carpetas unificada que parte de una única raíz denominada `/` (_root_):

```
/ (Raíz del sistema)
├── bin       -> Programas y comandos fundamentales para todos los usuarios (ls, cp, rm, bash)
├── sbin      -> Comandos esenciales para la administración del sistema (ip, reboot, fdisk)
├── etc       -> ⚠️ Archivos de configuración del sistema y de los servicios instalados
├── var       -> Información dinámica y variable generada durante el funcionamiento
│   └── log   -> ⚠️ Registros de auditoría y eventos (auth.log, syslog, accesos web)
├── home      -> Espacio personal para los usuarios convencionales (/home/usuario)
├── root      -> Directorio privado exclusivo del superusuario administrador
├── tmp       -> ⚠️ Almacenamiento temporal accesible por cualquier usuario (se purga al reiniciar)
├── dev       -> Nodos que representan dispositivos físicos y virtuales (discos, puertos, urandom)
├── proc      -> ⚠️ Sistema de archivos virtual en memoria con información en vivo de los procesos
└── usr       -> Programas, librerías y documentación instalados para los usuarios
```

> [!IMPORTANT:Ubicaciones Clave para la Seguridad]
> Quien administra o supervisa un entorno Linux presta atención prioritaria a cuatro ubicaciones esenciales:
>
> - **`/etc`:** Aloja la configuración del sistema. Cualquier modificación no autorizada en esta carpeta puede indicar un cambio malicioso de políticas o la creación de puertas traseras.
> - **`/var/log`:** Contiene las pistas de auditoría que evidencian qué ha ocurrido en la máquina (inicios de sesión, fallos de autenticación y alertas de seguridad).
> - **`/tmp`:** Al ser un directorio de escritura compartida donde cualquier cuenta puede guardar archivos, suele ser la primera escala de malware para descargar cargas útiles.
> - **`/proc`:** Permite inspeccionar el estado interno del procesador y los procesos activos directamente como si fuesen archivos de texto.

### Navegación y Operaciones Básicas del Sistema

Moverse con agilidad a través de los directorios y manipular archivos de forma segura constituye la base práctica para cualquier tarea operativa en Linux.

:::steps

### 1. Conocer la ubicación actual con `pwd`

Antes de crear, mover o eliminar elementos, es vital saber con exactitud en qué punto del sistema de archivos nos encontramos:

```bash:terminal
pwd
```

- **`pwd` (Print Working Directory):** Imprime en pantalla la ruta completa y absoluta de la carpeta en la que nos encontramos trabajando en ese instante (por ejemplo: `/home/usuario/proyectos`).

### 2. Explorar el contenido de carpetas con `ls`

El comando `ls` permite inspeccionar qué elementos residen dentro de un directorio:

```bash:terminal
# Listado detallado incluyendo archivos ocultos
ls -la
```

- **`ls` (List):** Comando fundamental para enumerar los elementos de una carpeta. Si se ejecuta de forma solitaria, solo enseña los nombres visibles de los archivos.
- **Parámetro `-l` (Long format):** Transforma la salida en una lista detallada que exhibe tipo de archivo, permisos de acceso, usuario propietario, grupo, tamaño en bytes y fecha de última modificación.
- **Parámetro `-a` (All):** Muestra todos los elementos sin excepción, incluidos los archivos y carpetas ocultos (cuyo nombre inicia con un punto `.`, como `.bashrc` o carpetas de configuración donde a menudo se alojan configuraciones sensibles).
- **Parámetro `-h` (Human-readable):** Suele agregarse junto a `-l` (`ls -lah`) para expresar los tamaños de archivo en unidades comprensibles para las personas (como KB, MB o GB) en vez de números de bytes sin formatear.

Anatomía de una línea en `ls -l`:

```
drwxr-xr-x  2 usuario grupo 4096 oct 15 10:30 documentos
│└──┘└──┘└──┘  │       │     │    │            └── Nombre del archivo o carpeta
│  u   g   o   │       │     │    └── Fecha y hora de modificación
│              │       │     └── Tamaño en disco
│              │       └── Grupo asignado
│              └── Propietario del archivo
└── Indicador de tipo: d = directorio, - = archivo regular, l = enlace simbólico
```

### 3. Trasladarse entre carpetas con `cd`

Para cambiar la ubicación activa hacia otro directorio del árbol de carpetas se emplea el comando `cd`:

```bash:terminal
# Desplazamiento hacia una ruta absoluta y regreso
cd /var/log
cd ..
```

- **`cd` (Change Directory):** Modifica la carpeta de trabajo actual por la que se indique como destino.
- **Rutas absolutas:** Indican el camino completo desde la raíz del sistema, comenzando siempre con `/` (por ejemplo: `cd /var/log/nginx`).
- **Rutas relativas:** Indican un camino relativo a la posición actual (por ejemplo: `cd nginx` para ingresar a una subcarpeta).
- **Destino `..` (dos puntos):** Hace retroceder un nivel hacia la carpeta contenedora superior (directorio padre).
- **Destino `~` (virgulilla) o `cd` solo:** Conduce de manera inmediata al directorio personal del usuario (`/home/usuario`).
- **Destino `-` (guión):** Vuelve de manera alternada al último directorio visitado previamente.

### 4. Crear y organizar directorios con `mkdir`

La estructuración de carpetas para aislar información se efectúa mediante `mkdir`:

```bash:terminal
# Crear una estructura jerárquica de carpetas de una sola vez
mkdir -p auditoria/2026/evidencias
```

- **`mkdir` (Make Directory):** Genera una nueva carpeta vacía con el nombre que se le indique.
- **Parámetro `-p` (Parents):** Instruye al comando a crear toda la cadena de carpetas intermedias si aún no existían, evitando mensajes de error cuando los directorios padres no han sido creados previamente.

### 5. Duplicar y respaldar información con `cp`

Hacer copias de seguridad de archivos de configuración antes de modificarlos es una norma obligatoria en seguridad:

```bash:terminal
# Respaldar un archivo individual y copiar directorios
cp configuracion.conf configuracion.conf.bak
cp -r carpeta_origen/ carpeta_destino/
```

- **`cp` (Copy):** Realiza una copia exacta del archivo origen hacia el destino señalado, manteniendo intacto el archivo inicial.
- **Parámetro `-r` (Recursive):** Habilita la copia en profundidad cuando el origen es un directorio, duplicando tanto la carpeta como la totalidad de subcarpetas y archivos contenidos en su interior.

### 6. Mover y renombrar con `mv`

El comando `mv` cumple una doble función según la ruta indicada:

```bash:terminal
# Renombrar un archivo o trasladarlo de carpeta
mv borrador.txt informe_final.txt
mv informe_final.txt /home/usuario/documentos/
```

- **`mv` (Move):** Traslada un archivo o directorio de una ubicación a otra sin duplicar datos en disco. Si el destino especificado se encuentra en la misma carpeta pero con otro nombre, actúa simplemente como renombrador del elemento.

### 7. Eliminación controlada de elementos con `rm`

Cuando es necesario purgar archivos descartables, se utiliza `rm`:

```bash:terminal
# Eliminar un archivo común
rm archivo_temporal.txt
```

- **`rm` (Remove):** Suprime de manera definitiva el archivo indicado del sistema de almacenamiento.

> [!CAUTION:Irreversibilidad de la Eliminación en Linux]
> En la terminal de Linux **no existe papelera de reciclaje**. Cuando se elimina un elemento mediante `rm`, los bloques de datos quedan marcados como libres y la recuperación es sumamente compleja. El uso del modificador recursivo forzado `rm -rf` borra carpetas enteras sin solicitar confirmación alguna; un error en la ruta puede destruir el sistema completo en cuestión de segundos.

:::

#### Inspección Segura de Archivos

Al evaluar incidentes o analizar reportes, abrir un archivo desconocido con programas gráficos o suites ofimáticas puede alterar sus fechas de acceso o desencadenar scripts ocultos. En la terminal existen herramientas seguras y directas para inspeccionar el contenido:

:::steps

### 1. Visualizar texto directo con `cat`

Para leer rápidamente archivos de configuración breves o salidas de texto compactas:

```bash:terminal
cat /etc/os-release
```

- **`cat` (Concatenate):** Vuelca la totalidad del contenido del archivo en la pantalla de la terminal. Es idóneo para archivos cortos de pocas líneas.
- **Parámetro `-n` (Numbers):** Numera cada línea impresa en pantalla, lo que facilita referenciar líneas concretas al contrastar configuraciones.

### 2. Lectura paginada y cómoda de archivos extensos con `less`

Cuando un archivo tiene cientos o miles de líneas (como un log del sistema), volcarlo entero con `cat` saturaría la pantalla. En su lugar se utiliza un visor paginado:

```bash:terminal
less /var/log/syslog
```

- **`less`:** Abre el archivo en un visor interactivo que no satura la memoria. Permite desplazarse hacia arriba y hacia abajo mediante las flechas del teclado o la barra espaciadora.
- **Búsqueda interna:** Al presionar la tecla `/` seguida de una palabra y presionar Enter, `less` localiza y resalta las coincidencias dentro del documento.
- **Salida:** Para cerrar la visualización y regresar a la terminal, basta pulsar la letra `q`.

### 3. Inspeccionar extremos de un archivo con `head` y `tail`

Con frecuencia solo necesitamos examinar los primeros registros de un documento o las entradas más recientes de un registro de eventos:

```bash:terminal
# Ver las primeras y las últimas líneas de un archivo
head -n 10 /var/log/auth.log
tail -n 20 /var/log/auth.log
```

- **`head` (Cabeza):** Muestra por defecto las primeras 10 líneas de un archivo.
- **`tail` (Cola):** Muestra por defecto las últimas 10 líneas de un archivo.
- **Parámetro `-n` (Number):** Define con precisión cuántas líneas iniciales o finales se desean mostrar (en los ejemplos anteriores, 10 y 20 líneas respectivamente).
- **Parámetro `-f` (Follow):** Convierte a `tail` (`tail -f /var/log/auth.log`) en un monitor dinámico en tiempo real que mantiene el archivo abierto y muestra en pantalla cada nueva línea que el sistema operativo registre en ese mismo instante. Para finalizar el seguimiento basta presionar `Ctrl + C`.

### 4. Búsqueda de patrones y palabras clave con `grep`

Para localizar cadenas específicas dentro de montañas de información textual se recurre a `grep`:

```bash:terminal
grep -i "error" /var/log/syslog
```

- **`grep` (Global Regular Expression Print):** Escanea el archivo indicado y devuelve exclusivamente aquellas líneas que contengan el texto o patrón solicitado.
- **Parámetro `-i` (Ignore case):** Realiza la búsqueda sin distinguir entre mayúsculas y minúsculas, asegurando capturar términos como "Error", "ERROR" o "error".
- **Parámetro `-n` (Line number):** Imprime en pantalla el número exacto de línea en el archivo donde se produjo la coincidencia.
- **Parámetro `-r` (Recursive):** Permite buscar un término de manera simultánea en todos los archivos contenidos dentro de una carpeta y sus subcarpetas (por ejemplo: `grep -r "token" /var/www/`).

### 5. Identificar la naturaleza real de un archivo con `file`

En entornos de seguridad, no se puede confiar ciegamente en la extensión de un archivo (`.txt`, `.pdf`, `.jpg`), ya que un atacante puede camuflar un ejecutable malicioso con un nombre engañoso:

```bash:terminal
file muestra_sospechosa.txt
```

- **`file`:** Examina los primeros bytes de encabezado (_magic numbers_) del archivo para determinar con certeza su formato real. Si una muestra nombrada `factura.pdf` revela ser en realidad un binario ejecutable de tipo _ELF 64-bit_, se descubre de inmediato el engaño sin necesidad de ejecutarlo.

:::

#### Editores de Texto en la Terminal

Al configurar servidores o modificar políticas de acceso, es habitual trabajar a través de conexiones de texto sin entorno gráfico. Conocer editores de terminal resulta imprescindible:

| Editor     | Dificultad inicial                                             | Uso recomendado                                                                        |
| :--------- | :------------------------------------------------------------- | :------------------------------------------------------------------------------------- |
| **`nano`** | Muy baja. Muestra atajos en pantalla todo el tiempo.           | Modificaciones rápidas de archivos y primeros pasos en Linux.                          |
| **`vim`**  | Media / Alta. Opera por modos (modo comando y modo inserción). | Estándar en la mayoría de servidores. Extremadamente veloz y potente una vez dominado. |

Para principiantes, `nano` es la opción más directa:

```bash:terminal
# El comando "nano" seguido de un archivo, lo abre en dicho editor de texto.
nano /etc/hosts
```

- **Guardar cambios:** Se presiona `Ctrl + O` seguido de la tecla Enter.
- **Salir del editor:** Se presiona `Ctrl + X` para retornar a la línea de comandos.

### Búsqueda, Filtros y Procesamiento de Datos

Una de las grandes fortalezas de Linux reside en su filosofía modular: en lugar de contar con un único programa monolítico y pesado que intente resolverlo todo, el sistema provee herramientas pequeñas y especializadas que pueden conectarse entre sí con facilidad.

#### Tuberías (`|`) y Redirecciones: El Concepto de Mangueras de Datos

Para comprender cómo se interconectan los comandos en Linux, resulta útil visualizar el flujo de datos como si fuesen mangueras conectadas entre sí:

- **Entrada estándar (`stdin`):** La vía por la que un programa recibe datos para procesar (habitualmente el teclado).
- **Salida estándar (`stdout`):** El canal por donde el programa emite sus resultados normales (habitualmente la pantalla).
- **Salida de error (`stderr`):** El canal independiente reservado para mensajes de fallo y advertencias.

El símbolo de **tubería** (`|`, conocido como _pipe_) toma la salida estándar generada por el comando ubicado a su izquierda y la conecta directamente como entrada del comando ubicado a su derecha:

```bash:terminal
# Conectar la salida de un listado con el visor paginado
ls -la /etc | less
```

- **A la izquierda del símbolo `|` (`ls -la /etc`):** Se genera una lista detallada con todos los archivos de configuración existentes en el sistema. En lugar de proyectarse en la pantalla y perderse rápidamente hacia arriba, los datos son capturados en la tubería.
- **El símbolo `|`:** Conecta la salida del listado con la entrada del visor siguiente.
- **A la derecha del símbolo `|` (`less`):** Recibe esa corriente de texto y la presenta en un visor navegable y cómodo donde es posible desplazarse página por página con las flechas del teclado.

Otro ejemplo sumamente común consiste en filtrar la salida de un archivo mediante una búsqueda directa:

```bash:terminal
# Filtrar líneas de un archivo que contengan una palabra específica
cat /var/log/syslog | grep "failed"
```

- **A la izquierda (`cat /var/log/syslog`):** Emite el texto íntegro del registro del sistema.
- **A la derecha (`grep "failed"`):** Filtra esa corriente y muestra únicamente las líneas donde se mencione la palabra "failed", descartando el resto del ruido.

Por su parte, los símbolos de **redirección** permiten enviar los resultados hacia archivos en disco en vez de mostrarlos en pantalla:

- **Operador `>` (Sobreescritura):** Guarda la salida de un comando en un archivo de texto. Si el archivo ya existía, reemplaza completamente su contenido anterior (por ejemplo: `ls /etc > lista_archivos.txt`).
- **Operador `>>` (Anexar):** Guarda la salida al final del archivo sin alterar lo que ya estaba escrito, resultando ideal para acumular reportes o bitácoras periódicas.

#### Localización de Archivos con `find`

Cuando se desconoce en qué rincón del disco reside un archivo o se necesita encontrar elementos según sus propiedades básicas, se recurre a `find`:

```bash:terminal
# Localizar archivos por nombre o extensión
find /var/log -name "*.log"
```

- **`find`:** Es el buscador oficial del sistema de archivos. Recorre el árbol de directorios de manera exhaustiva.
- **Ruta inicial (`/var/log`):** Especifica a partir de qué carpeta debe comenzar el rastreo.
- **Parámetro `-name` (Nombre):** Establece el criterio de búsqueda por nombre exacto o con patrones comodín (como `"*.log"` para hallar todos los archivos con esa extensión).
- **Parámetro `-type` (Tipo):** Permite restringir los resultados; por ejemplo, `-type f` limita la búsqueda a archivos regulares, mientras que `-type d` busca únicamente carpetas.

#### Verificación de Integridad con `sha256sum`

En seguridad defensiva es prioritario confirmar que los instaladores, imágenes de sistemas o documentos no han sufrido modificaciones maliciosas ni daños durante su descarga. Para ello se emplean las **funciones hash**, algoritmos matemáticos que generan una huella digital alfanumérica única para cada archivo:

```bash:terminal
sha256sum instalador.iso
```

- **`sha256sum`:** Procesa el archivo y devuelve una cadena de 64 caracteres hexadecimales (el hash SHA-256). Si un archivo de varios gigabytes sufre la alteración de un único carácter o bit, la huella digital resultante cambiará por completo. Al contrastar este valor con el publicado oficialmente por los creadores del software, se garantiza de forma irrefutable su autenticidad.

> [!TIP:Validación con Servicios de Inteligencia]
> Los valores hash no solo sirven para verificar descargas oficiales. Si se detecta un archivo con comportamiento dudoso en un equipo, se puede calcular su hash y consultarlo en plataformas colaborativas de reputación como **VirusTotal**, determinando al instante si esa misma huella ya ha sido catalogada como maliciosa por motores antivirus de todo el mundo sin requerir la subida física del archivo.

#### Introducción a la Automatización con Scripts

Cuando una serie de instrucciones operativas o de diagnóstico debe ejecutarse con frecuencia sobre múltiples máquinas, no es necesario escribirlas manualmente una y otra vez en la consola. Linux permite agrupar comandos secuenciales dentro de archivos de texto estructurados denominados **scripts** (generalmente utilizando el lenguaje propio de la shell, como Bash, o lenguajes versátiles como Python). De esta manera, tareas como la verificación periódica de espacio en disco, la rotación de bitácoras o la recolección inicial de telemetría ante una sospecha pueden ejecutarse de forma automática, uniforme y sin errores humanos.

### Usuarios, Permisos y Privilegios en Linux

Linux es por diseño un sistema operativo multiusuario y multitarea. Para garantizar que un usuario no pueda leer la información privada de otro ni comprometer la estabilidad del sistema, cada recurso en el disco posee reglas estrictas de autorización.

#### El Modelo de Permisos y su Notación

Cada archivo y carpeta en Linux asocia sus permisos a tres **entidades** diferentes y define tres **acciones** posibles:

- **Entidades de acceso:**
  - **Usuario propietario (`u` - User):** La cuenta específica que creó el archivo o a quien fue asignado.
  - **Grupo asignado (`g` - Group):** Un conjunto de cuentas que comparten facultades comunes sobre el recurso.
  - **Otros (`o` - Others):** Cualquier otra cuenta existente en el sistema que no sea el dueño ni pertenezca al grupo.

- **Acciones y valores numéricos (Notación Octal):**
  - **Lectura (`r` - Read):** Otorga el derecho a visualizar el contenido del archivo o listar los nombres de una carpeta. Tiene asignado el valor numérico **4**.
  - **Escritura (`w` - Write):** Permite modificar el contenido de un archivo, o crear y suprimir archivos dentro de un directorio. Tiene asignado el valor numérico **2**.
  - **Ejecución (`x` - Execute):** Autoriza a ejecutar un archivo si se trata de un programa ejecutable o script, o a ingresar dentro de una carpeta mediante el comando `cd`. Tiene asignado el valor numérico **1**.
  - **Sin permiso (`-`):** Ausencia de autorización para esa acción, con valor numérico **0**.

Sumando los valores de cada acción se obtiene la representación octal de 3 dígitos (uno para el usuario, uno para el grupo y uno para los demás):

| Código Octal | Notación Simbólica | Interpretación y Caso de Uso Típico                                                                                                       |
| :----------- | :----------------- | :---------------------------------------------------------------------------------------------------------------------------------------- |
| **`644`**    | `rw-r--r--`        | Permiso habitual para documentos y configuraciones: el dueño puede leer y modificar; el grupo y los demás solo pueden leer.               |
| **`755`**    | `rwxr-xr-x`        | Estándar para programas ejecutables y directorios públicos: el dueño tiene control total; el grupo y otros pueden leer y entrar/ejecutar. |
| **`600`**    | `rw-------`        | Máxima privacidad: solo el dueño puede leer y modificar; nadie más en el equipo tiene acceso alguno (ejemplo: claves privadas SSH).       |
| **`700`**    | `rwx------`        | Carpeta de uso estrictamente privado: solo el usuario propietario puede ingresar y gestionar su contenido.                                |
| **`777`**    | `rwxrwxrwx`        | **Riesgo crítico de seguridad:** Cualquier cuenta del sistema puede leer, modificar o borrar el recurso. Nunca debe usarse en producción. |

#### Modificación de Permisos con `chmod`

El comando `chmod` permite redefinir las autorizaciones sobre cualquier elemento del que seamos propietarios:

```bash:terminal
# Asignar permisos estrictos a un archivo confidencial
chmod 600 clave_privada.pem
```

- **`chmod` (Change Mode):** Instrucción encargada de alterar los permisos de un archivo o directorio.
- **Argumento numérico `600`:** Establece lectura y escritura (`4 + 2 = 6`) para el propietario, y cero permisos (`0` y `0`) para el grupo y los demás usuarios.
- **Parámetro `-R` (Recursive):** Si se aplica sobre una carpeta (`chmod -R 755 public_html/`), replica los nuevos permisos a todos los subdirectorios y archivos internos.

También puede usarse la sintaxis simbólica para conceder o revocar permisos puntuales de forma intuitiva:

- `chmod u+x script.sh` agrega (`+`) permiso de ejecución (`x`) exclusivamente al usuario propietario (`u`).
- `chmod go-w archivo.txt` quita (`-`) el permiso de escritura (`w`) al grupo (`g`) y a otros (`o`).

> [!NOTE:Archivos de Configuración e Historial en Auditorías Reales]
> En auditorías de seguridad y peritajes forenses se revisa minuciosamente el archivo de historial `~/.bash_history` para comprobar qué comandos ejecutó un operador o intruso con anterioridad. De igual manera, las credenciales de bases de datos y tokens de APIs suelen filtrarse con frecuencia debido al error de dejar archivos de configuración (`.env` o `.conf`) con permisos de lectura global (`644` o `777`), en lugar de restringir su acceso exclusivamente al propietario legítimo con permisos estrictos (`chmod 600`).

#### Cambio de Propietario con `chown`

Cuando un servicio o usuario transfiere la custodia de un recurso a otra cuenta, se utiliza `chown`:

```bash:terminal
# Reasignar el propietario y el grupo de un archivo
sudo chown usuario_nuevo:grupo_nuevo reporte.txt
```

- **`chown` (Change Owner):** Comando reservado al administrador para traspasar la propiedad de archivos y directorios.
- **Argumento `usuario_nuevo:grupo_nuevo`:** Define simultáneamente quién será la cuenta propietaria y a qué grupo de trabajo quedará enlazado el elemento.
- **Parámetro `-R`:** Permite aplicar el traspaso de titularidad de manera recursiva sobre árboles completos de carpetas.

#### Permisos Especiales: SUID, SGID y Sticky Bit

Además de los permisos estándar, Linux cuenta con tres mecanismos especiales destinados a casos operativos concretos:

| Permiso Especial          | Efecto Operativo                                                                                                                                                   | Implicación Defensiva                                                                                                                                                   |
| :------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SUID** (_Set User ID_)  | Cuando un usuario ejecuta el archivo, este corre temporalmente con los privilegios del **dueño del archivo** en lugar de los privilegios del usuario que lo lanzó. | Si un binario con propietario `root` tiene activo el SUID y posee fallas de programación, un atacante podría manipularlo para convertirse en administrador del sistema. |
| **SGID** (_Set Group ID_) | En archivos, corre con los derechos del grupo propietario. En directorios, los nuevos archivos creados heredan automáticamente el grupo de la carpeta.             | Facilita el trabajo compartido entre equipos de desarrollo sin desajustar los grupos de trabajo.                                                                        |
| **Sticky Bit**            | En carpetas compartidas donde todos tienen permisos de escritura (como `/tmp`), solo el dueño original de un archivo tiene autorización para borrarlo.             | Evita que usuarios malintencionados o desatentos eliminen o renombren los archivos temporales de otras cuentas.                                                         |

Un ejemplo legítimo y clásico de SUID es `/usr/bin/passwd`:

```bash:terminal
ls -l /usr/bin/passwd
```

La salida muestra `-rwsr-xr-x`, donde la letra `s` en el espacio de ejecución indica la presencia del SUID. Esto es indispensable para que cualquier usuario regular pueda cambiar su propia contraseña, ya que para grabarla debe escribir en el archivo protegido `/etc/shadow`, algo que solo el superusuario puede hacer.

#### Cuentas de Usuario y Archivos del Sistema

La identidad de los usuarios se administra a través de dos archivos estructurales ubicados en `/etc`:

- **`/etc/passwd`:** Registro legible por cualquier programa del sistema que enumera las cuentas creadas, su identificador numérico (UID), su carpeta personal y la shell predeterminada asignada.
- **`/etc/shadow`:** Archivo de máxima seguridad, legible únicamente por el superusuario `root`, que almacena las contraseñas de las cuentas convertidas en hashes criptográficos robustos con sal (_salt_).

> [!IMPORTANT:Integridad de /etc/shadow]
> Si los permisos de `/etc/shadow` se relajan por descuido y permiten lectura a usuarios convencionales, cualquier usuario local podría copiar las contraseñas hasheadas e intentar descifrarlas mediante ataques de fuerza bruta fuera de línea. Debe mantener siempre permisos restringidos (`640` o `600`).

Para dar de alta cuentas de forma segura en distribuciones basadas en Debian/Ubuntu:

```bash:terminal
# Crear un nuevo usuario de forma asistida
sudo adduser operador
```

- **`adduser`:** Script amigable e interactivo que crea el directorio personal (`/home/operador`), copia los perfiles base y solicita la contraseña de acceso de manera segura.
- **`passwd`:** Permite cambiar la clave de acceso de una cuenta (`sudo passwd operador`).

#### Elevación de Privilegios: `sudo` vs `su`

Para llevar a cabo tareas de configuración administrativa existen dos aproximaciones radicalmente distintas:

| Criterio                    | `sudo comando`                                                                                                           | `su -`                                                                                                    |
| :-------------------------- | :----------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| **Mecanismo**               | Ejecuta una **única instrucción específica** con privilegios elevados y retorna de inmediato a la cuenta estándar.       | Abre una sesión interactiva permanente como superusuario `root`.                                          |
| **Autenticación**           | Requiere la contraseña del propio usuario (siempre que esté autorizado en el archivo `/etc/sudoers`).                    | Exige conocer la contraseña compartida del superusuario `root`.                                           |
| **Trazabilidad**            | Excelente: cada orden individual queda registrada con nombre de usuario, hora y comando exacto en los logs de auditoría. | Baja: una vez abierta la sesión de root, es más difícil discernir qué persona física ejecutó cada acción. |
| **Recomendación defensiva** | **Estándar preferido en la industria** por apegarse al principio de menor privilegio.                                    | Desaconsejado salvo en procedimientos técnicos excepcionales de recuperación del sistema.                 |

> [!CAUTION:El Peligro de las Cuentas Compartidas]
> Compartir credenciales de administración entre varias personas destruye la **responsabilidad individual** (_accountability_). Si se produce un borrado accidental o un sabotaje interno, resulta imposible saber quién fue el responsable. La buena práctica dicta que cada persona disponga de su propia cuenta de usuario nominal y utilice `sudo` para sus tareas autorizadas.

### Gestión de Procesos y Servicios: Supervisión del Sistema

Un **proceso** es cualquier programa o instrucción en estado de ejecución en la memoria del equipo. Cada proceso cuenta con un número identificador único denominado **PID** (_Process ID_), pertenece a un usuario específico y consume una porción determinada de procesador y memoria RAM.

Para supervisar la salud de una máquina y detectar actividad anómala, el personal de seguridad monitorea constantemente los procesos activos.

#### `ps`: El Fotógrafo de Procesos

Cuando se necesita obtener una instantánea estática del estado de la memoria en un instante preciso:

```bash:terminal
# Ver todos los procesos activos con información detallada
ps aux
```

- **`ps` (Process Status):** Emite el estado de los procesos que corren en el sistema.
- **Parámetro `a` (All):** Muestra los procesos de todos los usuarios de la máquina, no solo los del usuario actual.
- **Parámetro `u` (User format):** Despliega la información con un formato legible orientado al usuario, indicando consumo porcentual de CPU y memoria RAM.
- **Parámetro `x`:** Incluye aquellos procesos que no están vinculados a una terminal física (como los servicios del sistema y _daemons_ en segundo plano).

Columnas principales que se observan al ejecutar `ps aux`:

- **`USER`:** La cuenta bajo cuyos privilegios se ejecuta el proceso. Un proceso como `bash` ejecutándose bajo la cuenta de un servidor web (`www-data`) constituye una anomalía que exige revisión inmediata.
- **`PID`:** El identificador numérico indispensable si se necesita interactuar con el proceso o detenerlo.
- **`%CPU` y `%MEM`:** Porcentaje de recursos consumidos.
- **`COMMAND`:** La línea de comandos y parámetros con la que fue iniciado el programa.

#### `top` y `htop`: Supervisión Interactiva en Tiempo Real

A diferencia de `ps`, que captura una fotografía fija, `top` proporciona un monitor dinámico que se actualiza cada pocos segundos:

```bash:terminal
top
```

- **`top`:** Presenta una tabla interactiva con el uso global de la CPU, la memoria libre y la lista de procesos ordenada por mayor consumo de recursos.
  - Al presionar la letra `q`, se cierra el monitor.
  - Al presionar la letra `M`, ordena los procesos por mayor uso de memoria RAM.
  - Al presionar la letra `P`, vuelve a ordenar por consumo de procesador.
- **`htop`:** Versión visualmente mejorada de `top` (disponible en la mayoría de repositorios) que incorpora barras de color y soporte de navegación con cursor.

#### `kill`: Control y Terminación de Procesos

Cuando un programa deja de responder, consume recursos indebidos o se identifica como no autorizado, el sistema operativo permite enviarle señales para solicitar su detención:

```bash:terminal
# Enviar señal de terminación ordenada (siendo 2840 el PID con el que queremos operar)
kill -15 2840
```

- **`kill`:** Es la herramienta para enviar señales de control a un proceso indicando su número de PID.
- **Señal `-15` (`SIGTERM` - Terminación limpia):** Es la vía educada y recomendada. Le pide al programa que guarde sus estados pendientes, cierre conexiones de red y finalice ordenadamente.
- **Señal `-9` (`SIGKILL` - Terminación forzada):** Si el proceso está completamente congelado y no responde a la señal 15, `kill -9 2840` ordena al propio Kernel desalojar el proceso de la memoria de inmediato. No debe utilizarse como primera opción, ya que puede dejar datos corruptos o impedir el registro de logs forenses.

#### `systemctl`: Control de Servicios en Segundo Plano

Los **servicios** (o _daemons_) son procesos diseñados para ejecutarse de manera silenciosa en segundo plano esperando peticiones (por ejemplo, atendiendo solicitudes web o conexiones SSH). Como vimos en la arquitectura del sistema, su gestión se realiza a través de `systemctl`:

```bash:terminal
# Consultar el estado y gestionar un servicio
systemctl status nginx.service
sudo systemctl restart nginx.service
```

- **`systemctl status`:** Muestra si el servicio se encuentra activo, su consumo de memoria y sus últimos eventos.
- **`sudo systemctl restart`:** Detiene y vuelve a iniciar el servicio en un solo paso, útil tras modificar archivos de configuración.
- **`sudo systemctl enable / disable / allow`:** Define si el servicio debe arrancar automáticamente cada vez que el equipo se enciende (`enable`), si sólo se va a permitir durante esa sesión activa en la terminal (`allow`) o si solo se iniciará cuando se ordene manualmente (`disable`).

> [!IMPORTANT:Disco vs. Memoria RAM y Persistencia]
> **Borrar un ejecutable no detiene el proceso:** Eliminar un archivo ejecutable del disco (`rm script.sh` o `rm binario`) **no detiene el proceso** si este ya se encuentra corriendo en la memoria RAM. El sistema continuará ejecutándolo hasta que sea terminado explícitamente mediante una señal enviada con el comando `kill`.
> **Detener un servicio no previene su inicio tras reiniciar:** De forma similar, apagar un servicio activo con `systemctl stop` detiene su ejecución inmediata, pero **no evita que vuelva a encenderse al reiniciar el equipo** a menos que se deshabilite su arranque persistente con `systemctl disable`.

### Diagnóstico y Comandos de Red desde la Terminal

Cualquier equipo conectado a una red intercambia tráfico a través de direcciones lógicas (IP) y puntos de enlace específicos denominados **puertos**. Dominar las herramientas de red en la terminal permite verificar la conectividad, identificar qué servicios están escuchando y diagnosticar fallas de comunicación.

:::steps

### 1. Inspeccionar interfaces y direcciones locales con `ip`

El comando contemporáneo para toda la gestión de red en Linux es `ip`:

```bash:terminal
# Listar las interfaces de red y sus direcciones IP asociadas
ip addr
```

- **`ip addr` (o abreviado `ip a`):** Enumera las interfaces de red instaladas (como `eth0` para ethernet por cable, `wlan0` para Wi-Fi o `lo` para el bucle local _loopback_), detallando la dirección IP asignada a cada una y su máscara de subred.
- **`ip route` (o abreviado `ip r`):** Exhibe la tabla de enrutamiento del equipo, revelando cuál es la puerta de enlace predeterminada (_gateway_) a través de la cual el tráfico sale hacia Internet.

### 2. Comprobar la conectividad básica con `ping`

Para validar si un destino remoto está encendido y accesible a través de la red se emplea `ping`:

```bash:terminal
# Enviar 4 paquetes de prueba hacia un destino (en este caso 8.8.8.8 es el servidor DNS público y gratuito de Google, se suele utilizar para comprobar si se posee una conexión activa a internet)
ping -c 4 8.8.8.8
```

- **`ping`:** Envía mensajes de solicitud de eco mediante el protocolo ICMP hacia la dirección indicada y mide el tiempo de respuesta en milisegundos.
- **Parámetro `-c` (Count):** En Linux, a diferencia de Windows, `ping` continúa transmitiendo paquetes de forma indefinida hasta que el usuario lo detenga. El parámetro `-c 4` limita el envío a cuatro paquetes y genera un reporte estadístico final.

### 3. Auditar puertos y conexiones abiertas con `ss`

Conocer qué programas están esperando conexiones del exterior es una de las revisiones más importantes en seguridad:

```bash:terminal
# Enumerar puertos TCP y UDP en escucha con números y procesos
ss -tulpn
```

- **`ss` (Socket Statistics):** Herramienta moderna de alto rendimiento que reemplazó al comando clásico `netstat`.
- **Parámetro `-t` (TCP):** Filtra para mostrar sockets que utilicen el protocolo TCP.
- **Parámetro `-u` (UDP):** Incluye sockets que operen sobre el protocolo UDP.
- **Parámetro `-l` (Listening):** Muestra exclusivamente aquellos puertos que se encuentran abiertos y **en escucha**, es decir, esperando conexiones entrantes.
- **Parámetro `-p` (Processes):** Muestra el nombre y PID del programa responsable de mantener abierto ese puerto (requiere `sudo` para ver procesos de otros usuarios).
- **Parámetro `-n` (Numeric):** Muestra los números de puerto de forma directa (como `:80` o `:22`) en lugar de intentar traducirlos a nombres de servicios, lo que acelera la salida y evita ambigüedades.
- **Lectura de la columna `Local Address:Port`:** Es fundamental revisar la dirección IP antes del puerto. Si muestra `127.0.0.1:puerto`, el servicio escucha exclusivamente en la interfaz local interna (_loopback_) y no es alcanzable desde la red; en cambio, si figura `0.0.0.0:puerto` (o `*:puerto`), la dirección comodín revela que escucha en **todas las interfaces de red**, quedando expuesto hacia afuera a cualquier equipo de la red.

### 4. Rastreo de rutas y resolución DNS

Para investigar el camino que siguen los paquetes y cómo se traducen los nombres de dominio:

```bash:terminal
# Rastrear los saltos intermedios y consultar registros de nombres
traceroute google.com
dig google.com
```

- **`traceroute`:** Lista cada uno de los enrutadores (_routers_ o saltos) por los que transita la conexión desde la máquina local hasta alcanzar el destino final, permitiendo detectar en qué punto intermedio se interrumpe el tráfico.
- **`dig` (Domain Information Groper):** Consulta los servidores DNS para verificar la traducción de un nombre de dominio hacia su dirección IP pública correspondiente.
- **Archivo `/etc/resolv.conf`:** Es el archivo local donde el sistema operativo consulta cuáles son las direcciones IP de los servidores DNS que debe utilizar para navegar.

### 5. Peticiones e inspección web con `curl`

Para interactuar con servidores web o consultar APIs directamente desde la consola:

```bash:terminal
# Consultar únicamente las cabeceras HTTP que responde un servidor
curl -I https://ejemplo.com
```

- **`curl`:** Herramienta versátil para transferir datos con servidores utilizando diversos protocolos (HTTP, HTTPS, FTP).
- **Parámetro `-I` (Head):** Solicita únicamente los encabezados de respuesta del servidor web sin descargar el cuerpo de la página, permitiendo comprobar el código de respuesta (como `200 OK` o `404 Not Found`) y tecnologías utilizadas.

:::

### Buenas Prácticas de Hardening del Sistema

El **hardening** (o endurecimiento) consiste en configurar un sistema operativo y sus aplicaciones de manera restrictiva para reducir su superficie de ataque al mínimo indispensable, dificultando cualquier intento de intrusión.

> [!IMPORTANT:Investigación Contextual vs Pánico Operativo]
> En la administración de sistemas es fundamental comprender que **no toda anomalía aparente representa un incidente de seguridad**. La aparición de un puerto nuevo en escucha puede deberse a un servicio recién configurado por un compañero de equipo, y un proceso con consumo elevado de memoria puede corresponder a una tarea legítima de mantenimiento. La labor defensiva exige indagar, documentar y contrastar antes de emitir un veredicto apresurado.

Un programa de buenas prácticas defensivas en sistemas operativos incluye las siguientes medidas esenciales:

- **Desactivación de servicios y puertos prescindibles:** Todo servicio en red que no cumpla una función vital para el negocio debe detenerse y deshabilitarse con `systemctl`. Cuantos menos puertos escuchen al exterior, menores serán las oportunidades para un atacante.
- **Aplicación rigurosa del principio de menor privilegio:** Ningún usuario ni proceso debe contar con mayores derechos de los estrictamente necesarios para su labor. El acceso directo como superusuario `root` debe restringirse en favor del uso justificado de `sudo`.
- **Protección de archivos sensibles y permisos restrictivos:** Verificar que archivos críticos como `/etc/shadow` o las claves criptográficas privadas mantengan permisos que impidan la lectura por parte de cuentas no autorizadas (como `600` o `640`).
- **Eliminación o bloqueo de cuentas inactivas:** Las cuentas pertenecientes a colaboradores desvinculados o servicios en desuso representan puertas abiertas para intrusiones si sus accesos no son revocados con prontitud.
- **Centralización y preservación de logs:** Configurar los registros para que no solo se almacenen localmente, sino que se transmitan a un servidor de monitoreo centralizado, asegurando que si un equipo es vulnerado, los atacantes no puedan borrar las evidencias.
- **Mantenimiento continuo de parches:** La inmensa mayoría de intrusiones exitosas explotan vulnerabilidades conocidas para las que ya existía una corrección disponible. Mantener el kernel y las aplicaciones actualizadas cierra la puerta a exploits automatizados.

### Virtualización y Contenedores: Entornos Seguros y Aislamiento

La experimentación segura en ciberseguridad requiere entornos donde sea posible probar configuraciones y ejecutar software potencialmente riesgoso sin poner en peligro el equipo anfitrión ni la red corporativa.

#### Máquinas Virtuales (VM): El Laboratorio de Seguridad

Una **máquina virtual (VM, _Virtual Machine_)** es un sistema informático simulado por software que recrea por completo los componentes de una computadora física (procesador, memoria RAM, tarjeta gráfica, disco duro e interfaz de red) ejecutándose de manera aislada dentro de un sistema anfitrión (_host_). En otras palabras, funcionan como bóvedas de alta seguridad que emulan una computadora completa (con su propio hardware virtual y sistema operativo) dentro de tu equipo físico. Se suelen utilizar en contextos de prácticas de ciberseguridad, donde se necesita un entorno aislado y seguro para tratar con archivos maliciosos, testear configuraciones peligrosas, o utilizar un SO diferente del anfitrión.

El software encargado de orquestar y repartir los recursos físicos hacia las máquinas virtuales se denomina **hipervisor**:

| Característica           | Hipervisor Tipo 1 (_Bare-Metal_)                                                                                       | Hipervisor Tipo 2 (_Hosted_)                                                                          |
| :----------------------- | :--------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------- |
| **Punto de instalación** | Se instala directamente sobre el hardware físico del servidor, prescindiendo de un sistema operativo anfitrión previo. | Se instala como una aplicación más dentro de un sistema operativo existente (Windows, macOS o Linux). |
| **Ejemplos frecuentes**  | VMware ESXi, Proxmox VE, Microsoft Hyper-V.                                                                            | VirtualBox, VMware Workstation, UTM, Parallels.                                                       |
| **Rendimiento**          | Máximo rendimiento y latencia mínima al dialogar directamente con los componentes de la máquina.                       | Rendimiento moderado, ya que comparte recursos con el sistema operativo principal y sus aplicaciones. |
| **Ámbito común**         | Centros de cómputo empresariales, servidores de producción e infraestructura en la nube.                               | Estaciones de estudio, pruebas locales, desarrollo y laboratorios personales.                         |

Conceptos esenciales para organizar un laboratorio con máquinas virtuales:

- **Instantáneas (_Snapshots_):** Permiten capturar una fotografía exacta del estado completo de la máquina virtual (disco y memoria) en un instante dado. Si una prueba o actualización corrompe el sistema, basta un clic para regresar la máquina al estado limpio previo en segundos.
- **Red en modo NAT:** La máquina virtual navega hacia Internet compartiendo la dirección IP del anfitrión, pero permanece invisible e inaccesible para los dispositivos externos de la red local. Es el modo más seguro y recomendado para prácticas habituales.
- **Red en modo Puente (_Bridged_):** La máquina virtual solicita su propia dirección IP directamente al router principal, comportándose exactamente como si fuese una computadora física más conectada al cable o red Wi-Fi.
- **Red Solo Anfitrión / Interna (_Host-Only_):** Aísla por completo a las máquinas virtuales del acceso a Internet, permitiendo comunicación únicamente entre las VMs y el equipo anfitrión, ideal para pruebas de malware donde se prohíbe cualquier salida al exterior.

#### Contenedores: Docker y el Aislamiento Ligero

A diferencia de una máquina virtual, que emula una computadora física completa y corre un sistema operativo invitado independiente con su propio Kernel, los **contenedores** son unidades de empaquetado ligeras que **comparten el Kernel del sistema operativo anfitrión**: Estos contenedores actúan como cápsulas ligeras que empaquetan únicamente una aplicación específica junto con sus dependencias directas, compartiendo el núcleo (Kernel) de tu sistema operativo base.

Docker es la herramienta se utiliza para operar y levantar contenedores. Aunque no ofrece el aislamiento profundo de una máquina virtual para detonar malware desconocido, su ligereza y portabilidad lo hacen fundamental para otras tareas de ciberseguridad: Como laboratorios interactivos y entornos CTF (_Capture The Flag_), los contenedores permiten empaquetar de forma segura aplicaciones web con vulnerabilidades intencionales para realizar prácticas. O en lugar de instalar docenas de herramientas de escaneo (como Nmap, escáneres de vulnerabilidades o frameworks de explotación) que pueden generar conflictos de dependencias en el sistema operativo base, los analistas ejecutan estas herramientas desde contenedores.

```
MÁQUINAS VIRTUALES (VM)                     CONTENEDORES DOCKER
┌─────────────┬─────────────┐               ┌─────────────┬─────────────┐
│ Aplicación A│ Aplicación B│               │ Aplicación A│ Aplicación B│
├─────────────┼─────────────┤               ├─────────────┴─────────────┤
│   SO Guest  │   SO Guest  │               │   Motor Docker (Runtime)  │
├─────────────┴─────────────┤               ├───────────────────────────┤
│        Hipervisor         │               │     Kernel del Anfitrión  │
├───────────────────────────┤               ├───────────────────────────┤
│      Hardware Físico      │               │      Hardware Físico      │
└───────────────────────────┘               └───────────────────────────┘
```

Mediante funciones internas del Kernel de Linux (llamadas _namespaces_ para aislar la visión de los procesos y _cgroups_ para limitar el consumo de memoria y CPU), un contenedor se ejecuta en un espacio de usuario totalmente confinado.

| Aspecto comparativo          | Máquina Virtual                                                       | Contenedor Docker                                                                         |
| :--------------------------- | :-------------------------------------------------------------------- | :---------------------------------------------------------------------------------------- |
| **Tiempo de arranque**       | Minutos (debe iniciar todo el sistema operativo).                     | Segundos o fracciones de segundo (inicia solo la app).                                    |
| **Consumo de recursos**      | Elevado (requiere reservar gigabytes de memoria fija).                | Mínimo (consume solo la memoria que la app demande).                                      |
| **Aislamiento de seguridad** | **Muy fuerte:** La frontera está protegida por hardware e hipervisor. | **Moderado:** Al compartir el Kernel, una falla en el núcleo podría afectar al anfitrión. |

Los cuatro comandos elementales para interactuar con Docker son:

- **`docker pull <imagen>`:** Descarga una plantilla de software empaquetada (imagen) desde un repositorio público o privado (por ejemplo: `docker pull ubuntu:22.04`).
- **`docker run -d --name <nombre> <imagen>`:** Crea y pone en ejecución un nuevo contenedor basado en la imagen descargada. El parámetro `-d` hace que corra en segundo plano sin bloquear la terminal.
- **`docker ps`:** Lista todos los contenedores que se encuentran en ejecución activa en ese momento. Si se añade la opción `-a` (`docker ps -a`), muestra también aquellos que fueron detenidos.
- **`docker stop <nombre>`:** Señaliza al contenedor en ejecución para que detenga sus procesos y finalice de manera ordenada.

> [!CAUTION:Peligro de Contenedores Privilegiados]
> Si se inicia un contenedor con el modificador `--privileged` (`docker run --privileged`), se eliminan casi todas las barreras de aislamiento que impone Docker, otorgándole acceso casi irrestricto al Kernel del equipo físico. Si una aplicación dentro de ese contenedor sufre una intrusión, el atacante puede escapar del contenedor y apoderarse de la máquina principal. En producción debe evitarse terminantemente el uso de esta bandera.

### Fundamentos de Seguridad en la Nube (Cloud Security)

La computación en la nube (_Cloud Computing_) es la provisión bajo demanda de recursos informáticos (servidores, almacenamiento, redes y bases de datos) a través de Internet. En lugar de comprar y mantener hardware físico, las organizaciones utilizan servicios gestionados por proveedores como Amazon Web Services (AWS), Microsoft Azure o Google Cloud (GCP) mediante un modelo de pago por uso.

#### Modelos de servicio y responsabilidad compartida

Al migrar a la nube, la responsabilidad de proteger el entorno se divide entre el proveedor y el cliente. Esta línea de división cambia drásticamente según el tipo de servicio contratado:

| Modelo de Servicio                       | Definición                                                                                                                                                                                     | Lo que administra el Proveedor de la Nube                                                               | Lo que debe proteger y configurar el Cliente                                                     |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **IaaS** — _Infrastructure as a Service_ | El proveedor alquila infraestructura básica (servidores virtuales, almacenamiento y redes). El cliente controla todo lo que corre encima. _Ejemplo: AWS EC2, Azure VM, Google Compute Engine._ | La infraestructura física, los centros de datos, la energía, los servidores base y el hipervisor.       | El sistema operativo instalado, sus parches, el firewall de red, las aplicaciones y los datos.   |
| **PaaS** — _Platform as a Service_       | El proveedor ofrece una plataforma lista para desarrollar y desplegar aplicaciones sin gestionar el servidor subyacente. _Ejemplo: AWS RDS, Google App Engine, Azure SQL Database._            | La infraestructura física, el sistema operativo base, los parches del servidor y el entorno subyacente. | El código de la aplicación propia, la configuración de los accesos y la información almacenada.  |
| **SaaS** — _Software as a Service_       | El proveedor entrega una aplicación completa, lista para usar, directamente al usuario final a través del navegador. _Ejemplo: Google Workspace, Microsoft 365, Slack, Dropbox._               | Toda la infraestructura, el código del software, las bases de datos y la disponibilidad del servicio.   | La gestión de usuarios, las contraseñas, la activación de MFA y los permisos sobre los archivos. |

> [!WARNING:El Modelo de Responsabilidad Compartida]
> Creer que la información está automáticamente protegida solo por estar "en la nube" es uno de los errores más comunes y peligrosos. El proveedor garantiza la **seguridad de la nube** (que los servidores no fallen y su red física sea segura), pero la **seguridad en la nube** (quién accede a los datos, qué puertos están abiertos y si las contraseñas son fuertes) es responsabilidad exclusiva del cliente.

#### Gestión de Identidades y Accesos (IAM)

En las redes corporativas tradicionales, el perímetro de seguridad era físico: las paredes de la oficina y el firewall principal. En la nube, ese límite físico desaparece por completo. Hoy, el nuevo perímetro es la **identidad**: cualquier persona (o atacante) con las credenciales correctas puede acceder a la infraestructura de la empresa desde cualquier parte del mundo.

El sistema de **Gestión de Identidades y Accesos** (IAM, _Identity and Access Management_) es el mecanismo central que controla quién puede hacer qué sobre qué recurso. Sus conceptos básicos son:

- **Usuarios:** Cuentas individuales asignadas a personas físicas, protegidas con credenciales.
- **Roles:** Identidades temporales que asumen los propios sistemas. Sirven, por ejemplo, para que un servidor web tenga permiso para leer una base de datos sin necesidad de guardar contraseñas vulnerables en su código fuente.
- **Políticas:** Reglas estrictas que definen qué acciones exactas están permitidas o denegadas.
- **Principio de menor privilegio:** Es la regla de oro. Nunca se debe dar acceso total por comodidad; los usuarios y sistemas solo deben tener los permisos mínimos e indispensables para realizar su tarea.
- **Autenticación Multifactor (MFA):** Una capa de seguridad obligatoria (como un código dinámico en el celular) que bloquea el acceso de un atacante incluso si logra robar una contraseña.

#### Redes Virtuales y Segmentación

Para evitar que los servidores queden expuestos directamente a los peligros de Internet, las organizaciones diseñan redes privadas aisladas dentro de la nube:

```text
                    NUBE PÚBLICA (VPC - Red Privada 10.0.0.0/16)
                    ┌────────────────────────────────────────────────────────┐
                    │                                                        │
                    │  Subred Pública (10.0.1.0/24)                          │
Internet ──────────►│  ┌─────────────────────────┐                           │
                    │  │  Servidor Web Público   │                           │
                    │  └────────────┬────────────┘                           │
                    │               │ (Tráfico interno permitido)            │
                    │               ▼                                        │
                    │  Subred Privada (10.0.2.0/24 - Sin salida a Internet)  │
                    │  ┌─────────────────────────┐                           │
                    │  │  Base de Datos Interna  │                           │
                    │  └─────────────────────────┘                           │
                    └────────────────────────────────────────────────────────┘

```

- **VPC (_Virtual Private Cloud_):** Es una red lógica y privada dentro de la nube del proveedor. Funciona como el equivalente a la red local tradicional de una oficina.
- **Segmentación:** La arquitectura segura dicta que lo que debe hablar con Internet (como una página web) se ubica en una **subred pública**. Por el contrario, lo que almacena información crítica (como una base de datos) se oculta en una **subred privada**, totalmente inaccesible desde el exterior, frustrando así los ataques directos.
- **Grupos de Seguridad (_Security Groups_):** Son firewalls virtuales que protegen a cada servidor de forma individual. Una buena configuración bloquea cualquier tráfico innecesario, por ejemplo, impidiendo que alguien intente administrar un servidor por SSH desde cualquier IP pública (`0.0.0.0/0`).

#### Infraestructura como Código (IaC)

En arquitecturas modernas, los servidores y redes ya no se crean haciendo clics manuales en una pantalla. La **Infraestructura como Código (IaC)** permite programar toda la arquitectura escribiéndola en archivos de texto estructurados.

- **Ventaja defensiva:** Permite guardar la configuración en sistemas como Git para rastrear exactamente quién hizo un cambio y auditar la infraestructura en busca de vulnerabilidades antes de que el servidor exista realmente.
- **El riesgo a gran escala:** La automatización es un arma de doble filo. Si un programador comete un error en el código (como configurar un almacén de datos con acceso "público"), esa mala configuración se desplegará instantáneamente en cientos de servidores, exponiendo la información de la empresa en cuestión de segundos.

### Acceso Remoto Seguro con SSH

El protocolo **SSH** (_Secure Shell_) es el mecanismo estándar en la industria para administrar sistemas y servidores remotos de forma cifrada a través de redes inseguras. Nació como reemplazo de protocolos antiguos y desprotegidos como Telnet o rlogin, los cuales transmitían las contraseñas y las instrucciones en texto plano sin cifrar.

SSH emplea algoritmos de **criptografía asimétrica** (par de clave pública y clave privada):

- **Clave pública:** Es la pieza que se puede compartir y depositar libremente en los servidores a los que se desea ingresar. Actúa como el cerrojo de una puerta.
- **Clave privada:** Es el elemento secreto que reside exclusivamente en el equipo de quien administra y nunca debe compartirse ni enviarse por la red. Actúa como la llave física que encaja en el cerrojo.

:::steps

### 1. Conectarse a un sistema remoto con `ssh`

Para iniciar una sesión de trabajo cifrada en una máquina distante:

```bash:terminal
ssh usuario@192.168.1.50
```

- **`ssh`:** Cliente de conexión segura que establece el canal cifrado.
- **Argumento `usuario@192.168.1.50`:** Especifica el nombre de la cuenta con la que se desea ingresar y la dirección IP o nombre de dominio del servidor remoto.
- **Parámetro `-p` (Port):** Permite especificar un puerto de conexión diferente si el servidor fue configurado en un puerto alternativo para evadir escaneos masivos (por ejemplo: `ssh -p 2222 usuario@servidor.com`).

### 2. Generación de claves criptográficas con `ssh-keygen`

La autenticación mediante claves criptográficas es significativamente más segura que el empleo de contraseñas tradicionales, pues anula por completo los ataques de fuerza bruta basados en diccionarios:

```bash:terminal
ssh-keygen -t ed25519 -C "admin@empresa.com"
```

- **`ssh-keygen`:** Utilidad encargada de fabricar pares de claves criptográficas.
- **Parámetro `-t ed25519`:** Determina el algoritmo matemático que se empleará para generar las claves. `Ed25519` es en la actualidad el estándar moderno recomendado por su alta seguridad y rapidez operativa.
- **Parámetro `-C` (Comment):** Agrega un comentario o etiqueta identificativa al final de la clave pública para reconocer fácilmente a qué persona o equipo pertenece.
- **Resultado generado:** Se crean dos archivos en el directorio oculto `~/.ssh/`: `id_ed25519` (la clave privada secreta) y `id_ed25519.pub` (la clave pública que se instalará en los servidores).

### 3. Validación de la identidad del servidor (_Fingerprint_)

La primera ocasión en que nos conectamos a un equipo remoto por SSH, el cliente despliega una huella digital criptográfica (_fingerprint_) y solicita confirmar si reconocemos la máquina. Al aceptar, esa huella se memoriza en el archivo local `~/.ssh/known_hosts`. Si en una conexión futura la huella del servidor cambia inesperadamente, SSH emitirá una alerta visual advirtiendo un posible ataque de intermediario (_Man-in-the-Middle_).

:::

#### Buenas Prácticas en la Configuración del Servidor SSH

La configuración defensiva del servicio SSH se centraliza en el archivo `/etc/ssh/sshd_config`. Para asegurar un servidor contra accesos no autorizados y ataques automatizados de fuerza bruta, existen **tres reglas de oro indispensables**:

1. **`PermitRootLogin no`:** Prohíbe que el superusuario `root` inicie sesión directamente a través de la red. Obliga a que cualquier operador ingrese primero con su propia cuenta personal nominativa y luego eleve privilegios mediante `sudo`, asegurando la trazabilidad y la responsabilidad individual en los registros.
2. **`PasswordAuthentication no`:** Desactiva la autenticación mediante contraseñas tradicionales y exige el uso exclusivo de llaves SSH criptográficas (`PubkeyAuthentication yes`), neutralizando por completo los ataques de diccionario y fuerza bruta provenientes de Internet.
3. **Limitar qué usuarios pueden conectarse (`AllowUsers`):** Define de forma explícita qué cuentas específicas están autorizadas a conectarse por SSH (por ejemplo: `AllowUsers operador admin`). Cualquier otra cuenta local del sistema, aunque posea credenciales válidas, tendrá vetado el inicio de sesión remoto.

Principales directivas defensivas a auditar en `/etc/ssh/sshd_config`:

| Directiva en `sshd_config` | Valor Seguro Recomendado        | Justificación Defensiva                                                                                                                  |
| :------------------------- | :------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------------- |
| `PermitRootLogin`          | `no`                            | **Regla de oro 1:** Impide que el superusuario `root` inicie sesión directamente por red; exige acceso nominal con `sudo`.              |
| `PasswordAuthentication`   | `no`                            | **Regla de oro 2:** Desactiva contraseñas comunes y obliga a usar exclusivamente llaves SSH criptográficas.                            |
| `AllowUsers`               | `usuario1 usuario2`             | **Regla de oro 3:** Restringe el acceso SSH exclusivamente a las cuentas listadas; bloquea a cualquier otro usuario del sistema.        |
| `PubkeyAuthentication`     | `yes`                           | Habilita formalmente el ingreso validado por el par de claves pública y privada.                                                         |
| `MaxAuthTries`             | `3`                             | Limita la cantidad de intentos fallidos antes de interrumpir la conexión, dificultando ataques de sondeo.                                |
| `Port`                     | Puerto no estándar (ej. `2222`) | Cambiar el puerto predeterminado (22) reduce notablemente el ruido generado por escáneres automatizados de Internet.                     |

> [!TIP]
> Recuerde que cualquier cambio efectuado en `/etc/ssh/sshd_config` requiere reiniciar o recargar el servicio para surtir efecto en el sistema: `sudo systemctl restart ssh.service`. Es una excelente práctica mantener una sesión SSH abierta de respaldo mientras se comprueba la nueva configuración desde otra terminal para evitar quedar bloqueado fuera del servidor ante un posible error de sintaxis.

### Implicaciones de Seguridad de Redes y Sistemas

Los conceptos revisados a lo largo de este capítulo convergen en un principio rector: **la seguridad de una organización es tan fuerte como su eslabón más desprotegido**. La superficie de ataque de cualquier entidad engloba la totalidad de puntos de contacto, configuraciones de sistemas operativos, puertos en escucha y credenciales que un adversario podría aprovechar para ganar acceso.

En la práctica, la gran mayoría de incidentes y brechas no derivan de técnicas sumamente complejas o desconocidas, sino de la desatención de fundamentos elementales:

- **Configuraciones de fábrica y contraseñas predeterminadas:** Equipos y servicios expuestos con credenciales conocidas o configuraciones pensadas para facilitar la instalación inicial sin controles de seguridad.
- **Falta de segmentación en redes locales y en la nube:** Entornos donde una vez comprometido un punto final secundario, nada impide al atacante moverse lateralmente hacia los servidores de bases de datos o controladores de acceso.
- **Ausencia de cifrado y falta de autenticación multifactor (MFA):** La persistencia de protocolos en texto plano o la carencia de MFA en accesos de administración facilita el robo de sesiones y credenciales.
- **Desactualización del software y parches pendientes:** Servidores y dependencias operando con vulnerabilidades públicas conocidas (CVE) que cuentan con exploits automatizados fácilmente accesibles.
- **Asignación de permisos excesivos:** Cuentas con privilegios administrativos universales, permisos `777` en el sistema de archivos o roles IAM en la nube con facultades irrestrictas que amplifican exponencialmente el impacto de cualquier falla.

## Mentalidad de Seguridad <!-- id: security-mentality, icon: BrainIcon -->

## 1.6. Mentalidad de Seguridad

La ciberseguridad efectiva no se logra simplemente adquiriendo herramientas tecnológicas aisladas o memorizando la teoría técnica de redes y sistemas operativos. Todo el conocimiento estructurado a lo largo de este primer módulo, incluyendo la tríada CIA y la gestión del riesgo, pasando por los actores de amenazas y los marcos normativos, hasta la mecánica de paquetes, protocolos, procesos y permisos— converge en un elemento determinante: el desarrollo de una **mentalidad de seguridad** (_security mindset_).

Esta mentalidad va a ser como la brújula que orienta el diseño de arquitecturas y la selección de controles de seguridad. Su objetivo es construir organizaciones resilientes fundamentadas en la reducción continua del riesgo, la contención activa del impacto y la verificación sistemática de cada medida de seguridad.

### Principios fundamentales de diseño seguro

Para establecer una postura defensiva sólida, las organizaciones deben interiorizar un conjunto de principios que guíen las decisiones técnicas y procedimentales:

- **Defensa en profundidad (_Defense in Depth_):** Consiste en estructurar las defensas mediante controles superpuestos e independientes en múltiples capas (perímetro, segmentación de red, gestión de identidades, aplicaciones y datos). De esta forma, si un adversario evade una barrera externa, encontrará capas sucesivas de protección interna que detendrán su avance o darán tiempo a los defensores para neutralizar la amenaza.

- **Mínimo privilegio y separación de funciones (_Least Privilege & Separation of Duties_):** Conceder exclusivamente el nivel de acceso, autorizaciones y privilegios estrictamente necesarios para que un usuario, servicio o proceso complete su tarea asignada, durante el tiempo indispensable. De manera complementaria, la separación de responsabilidades garantiza que las operaciones críticas o irreversibles requieran autorizaciones compartidas o controles cruzados, evitando que una sola cuenta comprometida o un error humano individual cause un daño irreparable.

- **Gestión de confianza y Confianza Cero (_Zero Trust_):** Bajo la premisa de _"nunca confiar, verificar siempre de forma explícita"_, este paradigma descarta por completo la suposición de que los elementos dentro del perímetro corporativo son inherentemente confiables. Cada solicitud de acceso a recursos, servicios o segmentos de red debe autenticarse, autorizarse y cifrarse de manera continua, evaluando la identidad del solicitante, el estado de salud del dispositivo y las políticas corporativas vigentes en tiempo real.

- **Asumir la brecha (_Assume Breach_):** Diseñar sistemas y procedimientos partiendo del hecho innegable de que los atacantes conseguirán o ya han conseguido eludir alguna capa defensiva. Este principio traslada el foco de la mera prevención hacia la contención activa del radio de explosión (_blast radius_), la microsegmentación de redes, la limitación del movimiento lateral y la capacidad de respuesta rápida.

- **Reducción de la superficie de ataque (_Attack Surface Reduction_):** Minimizar sistemáticamente la cantidad total de puntos de entrada, servicios expuestos y dependencias que un adversario podría explotar. Esto implica deshabilitar puertos y protocolos no utilizados, desinstalar servicios innecesarios, retirar software obsoleto y restringir rigurosamente las interfaces de administración accesibles desde redes públicas.

- **Seguridad por diseño y por defecto (_Security by Design & by Default_):** La protección debe integrarse desde la fase inicial de concepción y arquitectura de cualquier sistema o infraestructura, nunca como un agregado posterior o un parche apresurado. Asimismo, el estado operativo más seguro debe ser la configuración predeterminada (puertos cerrados, contraseñas únicas, cifrado habilitado y privilegios restringidos), requiriendo un esfuerzo deliberado y justificado para relajar cualquier control.

- **Verificación, auditoría y mejora continua:** Los controles de seguridad no son estáticos ni infalibles: su efectividad operativa debe comprobarse de forma permanente mediante auditorías de configuración, análisis de registros y pruebas de penetración autorizadas (_pen testing_). La organización debe retroalimentar continuamente sus defensas a medida que evolucionan las técnicas de los adversarios, cambian las tecnologías o se detectan nuevas vulnerabilidades.

> [!CRITICAL:Asumir el compromiso y limitar el impacto]
> La seguridad absoluta frente a un adversario con tiempo y recursos es inviable. Asumir el compromiso (_Assume Breach_) no es una postura derrotista, sino el pilar de la resiliencia operativa: permite proyectar entornos segmentados, monitoreados y redundantes donde el compromiso de un componente individual jamás desencadena el colapso integral de la organización.

### La mentalidad de seguridad en el ciclo operativo

El dominio de estos fundamentos y la asimilación del pensamiento de seguridad no son un fin en sí mismos, sino el marco conceptual indispensable que orienta las etapas operativas de este manual. Cada módulo posterior se apoya directamente en los conceptos de este primer capítulo:

- **Descubrir (Módulo 2):** Conocer la superficie de ataque real mapeando activos, servicios en escucha y topologías de red para identificar debilidades antes que el adversario.
- **Diseñar (Módulo 3):** Modelar amenazas y proyectar arquitecturas resilientes integrando defensa en profundidad, segmentación y el paradigma Zero Trust desde el inicio.
- **Proteger (Módulo 4):** Endurecer sistemas operativos y redes (_hardening_), aplicar el mínimo privilegio, gestionar identidades y cifrar información crítica.
- **Detectar (Módulo 5):** Recolectar telemetría y auditar eventos del sistema para identificar oportunamente comportamientos anómalos o intrusiones activas.
- **Responder y Recuperar (Módulo 6):** Aislar amenazas para contener el radio de explosión, restablecer operaciones confiables mediante copias de seguridad y capitalizar lecciones aprendidas.

### Enfoque didáctico: Anatomía de un ataque en una organización

Para comprender cómo interactúan estos principios en la práctica, consideremos un escenario cotidiano dentro de una PyME: un atacante remite un correo de suplantación de identidad (_phishing_) sumamente convincente a un empleado del área de administración financiera. Engañado por el tono de urgencia del mensaje fraudulento, el colaborador introduce inadvertidamente sus credenciales corporativas en un sitio web clonado, otorgándole al adversario acceso a su cuenta.

¿Cómo responde una arquitectura guiada por la mentalidad de seguridad ante este escenario?

**¿Qué ocurre si roban esta cuenta?**
Bajo una arquitectura tradicional sin principios de seguridad aplicados, el atacante obtendría acceso indiscriminado a los recursos internos y a la información financiera confidencial. Sin embargo, si la organización aplica estrictamente el principio de **Mínimo Privilegio**, la cuenta comprometida únicamente cuenta con permisos restringidos para sus tareas operativas cotidianas. El adversario no puede modificar la infraestructura de red, acceder a sistemas ajenos a su función ni aprovisionar cuentas con privilegios administrativos, limitando drásticamente el valor del vector comprometido.

**¿Qué otras barreras tendría que superar el adversario?**
Si el atacante intenta autenticarse desde un dispositivo no reconocido o una ubicación geográfica inusual, los controles de **Zero Trust** evalúan el contexto y desestiman cualquier confianza implícita. Al contar con una **Defensa en Profundidad** adecuadamente estructurada, la contraseña resulta insuficiente: la obligatoriedad de un segundo factor de autenticación (MFA) o de una validación basada en claves criptográficas bloquea el intento de acceso, neutralizando el ataque en la etapa inicial de autenticación.

**¿Hasta dónde podría llegar si lograse eludir la autenticación?**
Asumiendo que el atacante logre traspasar el acceso inicial, el principio de **Asumir el Compromiso** se activa de inmediato para mitigar el impacto. La red corporativa, diseñada bajo esquemas de **segmentación estricta** (mediante VLANs, subredes aisladas y reglas de firewall interno), separa el segmento de administración del resto de los servidores de producción y bases de datos. Al intentar realizar movimientos laterales o escaneos hacia activos críticos, los filtros internos bloquean la conexión y contienen el radio de explosión a un único host.

**¿Cómo se detecta el incidente y se restablece la continuidad operativa?**
El principio de **Verificación y Mejora Continua** asegura la recolección constante de telemetría y registros de auditoría (logs de autenticación en el sistema operativo e inspección de tráfico de red). Los inicios de sesión inusuales o los intentos de sondeo disparan alertas automáticas que permiten al equipo de respuesta aislar el equipo afectado y revocar credenciales de manera inmediata. En caso de daño o alteración de datos, la organización recurre a sus respaldos desconectados (_offline_) o inmutables para restaurar los sistemas a un estado íntegro, aplicando luego las lecciones aprendidas para reforzar las defensas y prevenir incidentes similares.

# 2) Descubrir <!-- id: layer-2 -->

High-level design decisions and conventions used across the codebase.

# 3) Diseñar <!-- id: layer-3 -->

High-level design decisions and conventions used across the codebase.

# 4) Proteger <!-- id: layer-4 -->

High-level design decisions and conventions used across the codebase.

# 5) Detectar <!-- id: layer-5 -->

High-level design decisions and conventions used across the codebase.

# 3) Responder y Recuperar <!-- id: layer-6 -->

High-level design decisions and conventions used across the codebase.

# Component Showcase <!-- id: showcase, hidden: true, icon: ToolsIcon -->

Catálogo exhaustivo y entorno interactivo de pruebas para todos los componentes de la plataforma de documentación y diseño de Cyber Range. Esta sección oculta sirve como banco de pruebas visual y guía de implementación técnica para desarrolladores y autores de contenido.

## Callouts & Alertas <!-- id: callouts, icon: Alert01Icon -->

Los callouts comunican información contextual clasificada por severidad. Se adaptan a notas informativas, consejos de optimización, advertencias operativas y riesgos críticos.

### Variantes Estándar

> [!NOTE]
> Este es un callout informativo (`note`). Se utiliza para contextualizar conceptos, citar estándares como ISO/IEC 27001 o detallar dependencias arquitectónicas secundarias.

> [!TIP]
> Este es un callout de consejo (`tip`). Es ideal para resaltar buenas prácticas, optimizaciones de rendimiento y trucos como el uso de índices b-tree o cachés distribuidas.

> [!WARNING]
> Este es un callout de advertencia (`warning`). Debe utilizarse cuando una acción puede ocasionar fallos de sincronización, incompatibilidades de versión o fugas accidentales de parámetros en endpoints públicos.

> [!CRITICAL]
> Este es un callout de severidad crítica (`critical`). Empléalo ante riesgos inminentes de seguridad, compromiso del kernel, ejecución remota de código (RCE) o borrado destructivo de particiones.

### Etiquetas Personalizadas

Puedes sobreescribir la etiqueta por defecto agregando un sufijo tras los dos puntos:

> [!WARNING:Acceso Restringido al Kernel]
> La modificación de parámetros `sysctl` en caliente requiere privilegios de `CAP_SYS_ADMIN` en el contenedor Docker.

> [!CRITICAL:Amenaza Activa Detectada]
> Se ha detectado una anomalía de tráfico outbound hacia una IP catalogada en la lista de bloqueo de C2 (Command & Control). Proceda con aislamiento perimetral.

> [!NOTE:Requisito de Cumplimiento NIST CSF]
> Esta política satisface el control PR.AC-4 del marco NIST para la segregación de privilegios en el plano de control.

### Callouts con Listas de Viñetas

Los callouts admiten listas de viñetas (`-`) para agrupar recomendaciones, controles o procedimientos clave:

> [!TIP:Buenas Prácticas de Red]
> Pautas esenciales para mitigar vectores de ataque en infraestructura crítica:
>
> - Deshabilitar servicios legados no cifrados como Telnet, FTP o HTTP plano.
> - Habilitar autenticación multifactor (MFA) obligatoria en todas las sesiones VPN.
> - Segmentar la red en zonas DMZ con firewalls perimetrales e inspección profunda de paquetes (DPI).

### Especificación de Sintaxis

```markdown:docs.md
> [!NOTE]
> Nota informativa con soporte para `código en línea` y **texto en negrita**.

> [!WARNING:Título Personalizado]
> Advertencia con etiqueta adaptada al contexto del procedimiento.

> [!TIP:Recomendaciones]
> Texto introductorio con lista de viñetas:
>
> - Primer punto clave
> - Segundo punto clave
```

## Bloques de Código <!-- id: code-blocks, icon: CommandLineIcon -->

Los bloques de código ofrecen soporte para resaltado de sintaxis enriquecido, numeración de líneas, botón integrado de copiado al portapapeles y barra de cabecera con pestaña de archivo o terminal.

### Comandos de Terminal (`bash`)

```bash:terminal
# Clonar el entorno seguro de pruebas
git clone https://github.com/cyber-range/telemetry-agent.git
cd telemetry-agent

# Instalar dependencias del sistema y compilar binarios
npm install
npm run build -- --production
```

### TypeScript y Tipado Estricto

```typescript:src/middleware/jwtValidator.ts
import type { Request, Response, NextFunction } from 'express'
import { verifyJwtToken } from '@/utils/crypto'

export interface AuthenticatedUser {
  id: string
  role: 'operator' | 'admin' | 'observer'
  fingerprint: string
}

export async function requireAuthorization(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace(/^Bearer\s+/, '')
  if (!token) {
    return res.status(401).json({ error: 'Missing session authorization token' })
  }

  try {
    const session = await verifyJwtToken<AuthenticatedUser>(token)
    req.user = session
    next()
  } catch (error) {
    res.status(403).json({ error: 'Invalid or revoked token signature' })
  }
}
```

### Configuración en Formato JSON

```json:config/cyber-range.production.json
{
  "environment": "production",
  "telemetry": {
    "enabled": true,
    "port": 8443,
    "flushIntervalMs": 500,
    "maxBatchSize": 2048
  },
  "security": {
    "tls": {
      "minVersion": "TLSv1.3",
      "cipherSuites": ["TLS_AES_256_GCM_SHA384", "TLS_CHACHA20_POLY1305_SHA256"]
    },
    "rateLimiting": {
      "requestsPerMinute": 120,
      "burstCapacity": 30
    }
  }
}
```

### Script de Detección en Python

```python:scripts/honeypot_sniffer.py
import socket
import json
from datetime import datetime

def inspect_inbound_packet(packet_payload: bytes, source_addr: str) -> bool:
    """Inspecciona paquetes de red capturados en busca de cadenas maliciosas."""
    signatures = [b"union select", b"cmd.exe", b"/bin/sh", b"powershell -nop"]
    for signature in signatures:
        if signature in packet_payload.lower():
            print(f"[{datetime.utcnow().isoformat()}] ALERTA: Coincidencia con {signature} desde {source_addr}")
            return True
    return False
```

## Pasos Interactivos <!-- id: interactive-steps, icon: Layers01Icon -->

El componente de pasos interactivos (`:::steps`) permite modelar flujos de trabajo secuenciales, instrucciones de instalación y procedimientos operativos de respuesta a incidentes.

:::steps

### 1. Identificar y aislar el host comprometido

Desconecta la máquina afectada de la red local para impedir el movimiento lateral del atacante, manteniendo la máquina encendida para preservar la memoria volátil:

```bash:terminal
sudo iptables -A INPUT -j DROP
sudo iptables -A OUTPUT -p tcp --dport 514 -j ACCEPT  # Permitir exclusivamente syslog forense
```

### 2. Capturar volcado de memoria RAM (Forense)

Extrae una instantánea de la memoria volátil utilizando herramientas especializadas como LiME o LiME-Forensics antes de reiniciar o alterar procesos en memoria:

```bash:terminal
sudo lime-collector --output /mnt/external-drive/incident-dump-01.raw
```

> outcome: Volcado de 16 GB completado y verificado con suma SHA-256

### 3. Ejecutar análisis heurístico de firmas con Yara

Analiza los binarios en ejecución contra la base de datos de firmas de software malicioso para determinar el vector de ataque y la familia de malware:

```bash:terminal
yara -r /rules/ransomware_signatures.yar /proc/*/exe
```

> outcome: Coincidencia detectada: Trojan.Linux.Backdoor.Generic (PID 4821)

### 4. [x] Revocar tokens de sesión y claves comprometidas

Deshabilita de forma inmediata todas las claves SSH activas y expira las sesiones JWT del usuario sospechoso en el proveedor de identidad central:

> outcome: 38 tokens de sesión invalidados y 4 pares de claves SSH revocados

### 5. Restaurar servicios a partir de respaldos inmutables

Restaura la configuración limpia y los datos desde una copia de seguridad fuera de línea (_Air-Gapped_) cuya integridad haya sido auditada previamente:

> outcome: Servicios restablecidos exitosamente con verificación de integridad

:::

## Tablas de Datos <!-- id: tables, icon: Database01Icon -->

Las tablas permiten organizar matrices de riesgo, especificaciones de hardware, comparativas de herramientas y parámetros de configuración con scroll horizontal responsivo.

### Matriz de Evaluación de Amenazas Cibernéticas

| Amenaza / CVE    | Severidad          | Vector de Ataque             | Impacto en el Negocio                      | Mitigación Recomendada                                  |
| :--------------- | :----------------- | :--------------------------- | :----------------------------------------- | :------------------------------------------------------ |
| `CVE-2024-3094`  | **Crítico (9.8)**  | Inyección en `xz-utils`      | Acceso root no autenticado en SSH          | Degradar de inmediato a versión `5.4.6` aislada         |
| `CVE-2023-4863`  | **Alto (8.8)**     | Desbordamiento en `libwebp`  | Ejecución de código arbitrario             | Aplicar parche oficial y actualizar dependencias        |
| `CVE-2023-44487` | **Alto (7.5)**     | Ataque HTTP/2 Rapid Reset    | Caída por denegación de servicio (DoS)     | Habilitar limitadores de tasa en reverse proxy          |
| `CVE-2021-44228` | **Crítico (10.0)** | Inyección JNDI en Log4j      | Control total del servidor de aplicaciones | Actualizar a Log4j 2.17+ y deshabilitar búsqueda remota |
| Fuerza Bruta RDP | **Medio (5.3)**    | Diccionario en puerto `3389` | Intento de intrusión por credencial débil  | Requerir VPN con MFA y bloquear tras 5 intentos         |

_Matriz de Evaluación de Amenazas Cibernéticas y Respuestas Operativas._

### Requisitos Mínimos de Infraestructura

| Componente         | Requisito Mínimo                      | Recomendado                          | Verificación de Estado   |
| :----------------- | :------------------------------------ | :----------------------------------- | :----------------------- |
| **CPU**            | 2 núcleos (x86_64 / ARM64)            | 4 núcleos de alta frecuencia         | `nproc` o `lscpu`        |
| **Memoria RAM**    | 4 GB dedicados                        | 8 GB con memoria swap activa         | `free -h`                |
| **Almacenamiento** | 20 GB SSD NVMe                        | 50 GB con cifrado LUKS               | `df -h /`                |
| **Node.js**        | Versión 18.x LTS                      | Versión 20.x o 22.x LTS              | `node -v`                |
| **Navegador Web**  | Chrome 110+, Safari 16+, Firefox 115+ | Última versión con aceleración WebGL | Verificación en DevTools |

_Especificaciones técnicas para despliegue y simulación local._

## Grupos y Parámetros <!-- id: groups-badges, icon: ServerIcon -->

Los grupos estructuran variables de entorno, banderas CLI y opciones de configuración con etiquetas visuales de obligatoriedad (`[required]`, `[optional]`, `[default]`).

:::group title="Variables de Entorno del Cyber Range" description=".env.production"

- **CYBER_RANGE_API_URL** [required]: Dirección base del backend de telemetría y escenarios simulados.
- **DATABASE_REPLICA_URL** [required]: Cadena de conexión cifrada hacia la base de datos réplica de solo lectura.
- **PORT** [default]: Puerto de escucha para el servidor web local. Por defecto `5173`.
- **TELEMETRY_LOG_LEVEL** [default]: Nivel de detalle de registro en consola. Valores: `info`, `warn`, `debug`.
- **METRICS_SAMPLING_RATE** [optional]: Tasa de muestreo de trazas de rendimiento entre `0.0` y `1.0`.
- **ENABLE_ANOMALY_DETECTOR**: Activa el motor heurístico local para alertar sobre patrones de red inusuales.
  :::

:::group title="Banderas CLI de Ejecución" description="npx cyber-range-cli run [opciones]"

- **--scenario** [required]: Nombre o identificador del escenario de ciberseguridad a ejecutar (ej. `ransomware-triage`).
- **--concurrency** [default]: Número de agentes defensivos simultáneos en la simulación. Por defecto `4`.
- **--dry-run** [optional]: Ejecuta la simulación en modo solo lectura sin persistir cambios en disco.
- **--output-dir** [optional]: Directorio de destino para el informe forense final en formato JSON y PDF.
  :::

## Árbol de Archivos <!-- id: file-trees, icon: Folder01Icon -->

El bloque de árbol de archivos representa esquemas de directorios y arquitectura de proyectos con tipografía monospace y anotaciones explicativas.

```filetree:Estructura del Repositorio Cyber Range
cyber-range/
├── docs/
│   └── docs.md                # Fuente principal de documentación Markdown
├── scripts/
│   └── md-to-docs.mjs         # Compilador Markdown a estructura JSON
├── src/
│   ├── components/            # Biblioteca de componentes visuales
│   │   ├── CodeBlock.tsx      # Visor de código con pestañas y copiado
│   │   ├── DocsCallout.tsx    # Mensajes de advertencia y notas
│   │   ├── DocsContent.tsx    # Orquestador y renderizador dinámico
│   │   ├── DocsList.tsx       # Listas y tarjetas de grupos clave-valor
│   │   ├── DocsSidebar.tsx    # Navegación en árbol lateral (BranchedMenu)
│   │   ├── DocsSteps.tsx      # Pasos numerados con estados de éxito
│   │   ├── DocsTable.tsx      # Tablas responsivas con formato markdown
│   │   ├── Pill.tsx           # Píldoras de estado, badges e indicadores
│   │   ├── RubberSegment.tsx  # Conmutador táctil segmentado con física
│   │   └── SpecularButton.tsx # Botón 3D con reflejo especular en WebGL
│   ├── data/
│   │   ├── docs.json          # Árbol de documentación compilado
│   │   └── docs.ts            # Tipos e interfaces TypeScript estrictas
│   ├── pages/
│   │   ├── DocsPage.tsx       # Navegador dinámico de documentación
│   │   └── HomePage.tsx       # Página principal con hero y BentoGrid
│   └── utils/
│       ├── docIcons.ts        # Registro centralizado de iconos HugeIcons
│       └── renderInline.tsx   # Parser de negrita, cursiva y código
├── package.json               # Dependencias y scripts de construcción
└── vite.config.ts             # Configuración del empaquetador Vite
```

## Tipografía y Listas <!-- id: typography-lists, icon: Book02Icon -->

Demostración de jerarquía de encabezados, ritmo vertical de párrafos y listas ordenadas y no ordenadas.

### Jerarquía de Encabezados

#### Encabezado de Nivel 4 (H4)

Este es un encabezado menor utilizado para subsecciones específicas y notas técnicas directas.

### Formato de Texto en Línea

Los párrafos soportan múltiples tipos de formato combinables de manera fluida:

- **Texto en negrita (`strong`):** Para destacar conceptos críticos como **Gestión de Riesgos** o **Integridad de Datos**.
- _Texto en cursiva (`em`):_ Para términos técnicos en otros idiomas como _zero-day exploit_ o _man-in-the-middle_.
- `Código en línea (`code`):` Para comandos como `npm test`, rutas como `src/data/docs.ts` o variables como `process.env.NODE_ENV`.
- **Combinaciones:** Puedes combinar negrita con código: **`TOKEN_SECRET`**, o negrita con cursiva: **_Prioridad Alta_**.

### Listas con Viñetas (No Ordenadas) y Sub-niveles

- **Prevención proactiva:** Implementación de cortafuegos de aplicaciones web (WAF) y filtrado DNS.
- **Monitoreo continuo y auditoría:** Recolección de registros de eventos en un sistema centralizado de gestión de información y eventos de seguridad (SIEM).
  - **Detección de anomalías:** Análisis comportamental de tráfico anómalo en tiempo real.
  - **Correlación de eventos:** Agrupación automatizada de trazas provenientes de múltiples sensores.
- **Capacitación del personal:** Programas periódicos de concienciación sobre ingeniería social.
- **Pruebas de penetración periódicas:** Evaluaciones de seguridad ofensiva para identificar vulnerabilidades.

### Listas Numeradas (Ordenadas) con Sub-niveles

1. **Fase de Preparación:** Establecer políticas defensivas y herramientas forenses.
2. **Fase de Detección y Análisis:** Identificar anomalías y determinar el alcance.
   a) **Triaje inicial:** Clasificación de severidad y recolección de telemetría.
   b) **Análisis forense:** Examen de volcados de memoria y artefactos en disco.
3. **Fase de Contención:** Aislar los sistemas afectados para prevenir la propagación.
4. **Fase de Erradicación:** Eliminar puertas traseras y cuentas comprometidas.
5. **Fase de Lecciones Aprendidas:** Documentar el incidente, revisar la matriz de riesgos y actualizar los procedimientos de defensa.

## Componentes UI Interactivos <!-- id: ui-components, icon: CpuIcon -->

Además de los bloques de documentación de texto, Cyber Range cuenta con una suite de componentes UI de diseño avanzado diseñados para interacción en tiempo real:

:::preview component="all"
:::

### Guía de Uso de Componentes en Código TSX

```tsx:src/components/MyCustomPage.tsx
import SpecularButton from '@/components/SpecularButton'
import { Pill } from '@/components/Pill'
import RubberSegment from '@/components/RubberSegment'

export function DashboardHeader() {
  return (
    <div className="header-container">
      {/* Botón con reflejo dinámico en WebGL */}
      <SpecularButton onClick={() => console.log('Simulating...')}>
        Ejecutar Simulación
      </SpecularButton>

      {/* Píldoras de estado con indicadores pulsantes */}
      <Pill variant="dark" dot dotActive badge="PRO">
        Sistema en Línea
      </Pill>

      {/* Selector elástico con física de resorte */}
      <RubberSegment
        items={['Monitoreo', 'Defensa', 'Forense']}
        defaultValue="Monitoreo"
        onChange={(val) => console.log('Modo seleccionado:', val)}
      />
    </div>
  )
}
```

## Kitchen Sink (Todos Juntos) <!-- id: kitchen-sink, icon: Wrench01Icon -->

Esta página integra **absolutamente todos** los componentes de la documentación en un escenario real y cohesivo de respuesta ante un ciberataque de ransomware empresarial.

### 01. Contexto del Incidente

A las `03:42 UTC`, el sistema de detección perimetral generó una alarma tras registrar múltiples intentos de cifrado de archivos en el clúster de base de datos de producción `db-node-04`.

> [!CRITICAL:Amenaza Activa de Ransomware]
> Se ha detectado una cepa de ransomware con propagación lateral activa mediante explotación de SMB. Proceda de inmediato a la contención física y lógica de la subred `10.240.12.0/24`.

:::group title="Credenciales de Operación de Emergencia" description="Gestor de Secretos Vault"

- **INCIDENT_TICKET_ID** [required]: Identificador único de seguimiento `INC-2026-9042`.
- **WAR_ROOM_BRIDGE** [required]: Enlace seguro a la sala de crisis técnica.
- **ISOLATION_STRATEGY** [default]: Modalidad de aislamiento `StrictQuarantine` con preservación de RAM.
- **FORENSIC_OFFICER**: Responsable a cargo de la custodia de evidencias digitales.
  :::

### 02. Protocolo de Aislamiento y Contención

Siga de manera rigurosa los pasos indicados a continuación para mitigar el avance del ataque:

:::steps

### 1. Desconectar la interfaz de red del nodo afectado

Ejecuta el corte de conectividad inmediata a nivel de hipervisor o tabla de enrutamiento local:

```bash:terminal
ip link set dev eth0 down
```

### 2. Preservar la memoria RAM para análisis de claves criptográficas

Extrae la memoria antes de reiniciar el nodo, ya que las claves de descifrado temporal suelen residir en memoria volátil:

```bash:terminal
sudo dd if=/dev/fmem of=/evidence/ram_snapshot.bin bs=1M
```

> outcome: Volcado de 32 GB guardado en almacenamiento externo cifrado

### 3. [x] Aislar credenciales de dominio de Active Directory

Inhabilita la cuenta de servicio comprometida y fuerza el cambio de contraseña en todas las cuentas con privilegios de administrador de dominio:

> outcome: 12 cuentas de administración temporalmente bloqueadas

:::

### 03. Evaluación de Daños y Superficie Afectada

| Servidor / Host   | Rol del Sistema             | Estado Actual                    | Datos Comprometidos | Nivel de Riesgo |
| :---------------- | :-------------------------- | :------------------------------- | :------------------ | :-------------- |
| `db-node-04`      | Base de datos relacional    | **Aislado / En cuarentena**      | 14 tablas cifradas  | **Crítico**     |
| `api-gateway-01`  | Puerta de enlace perimetral | **Operativo (Monitoreado)**      | Ninguno detectado   | **Bajo**        |
| `storage-nas-02`  | Almacenamiento de archivos  | **Bloqueado (Solo lectura)**     | Respaldos a salvo   | **Medio**       |
| `auth-service-01` | Servidor de autenticación   | **Operativo (Claves renovadas)** | Sin anomalías       | **Bajo**        |

_Resumen de auditoría de hosts inspeccionados en la primera hora de crisis._

### 04. Inspección del Binario Involucrado

```python:scripts/ransomware_triage.py
import hashlib
import os

def calculate_evidence_hash(filepath: str) -> str:
    """Calcula el hash SHA-256 de una muestra sospechosa preservando metadatos."""
    sha256 = hashlib.sha256()
    with open(filepath, 'rb') as f:
        while chunk := f.read(8192):
            sha256.update(chunk)
    return sha256.hexdigest()

sample_path = "/quarantine/payload.elf"
if os.path.exists(sample_path):
    print("Firma del artefacto:", calculate_evidence_hash(sample_path))
```

### 05. Topología de Infraestructura en Cuarentena

```filetree:Topología de Segmentos Aislados
datacenter-prod/
├── dmz-zone/             # Zona perimetral accesible desde Internet
│   ├── web-proxy-01      [ONLINE]
│   └── web-proxy-02      [ONLINE]
├── internal-zone/        # Red interna de aplicaciones
│   ├── app-cluster-01    [ONLINE]
│   └── app-cluster-02    [ONLINE]
└── secure-db-zone/       # Subred de bases de datos
    ├── db-node-01        [ONLINE]
    ├── db-node-02        [ONLINE]
    ├── db-node-03        [ONLINE]
    └── db-node-04        [AISLADO / CUARENTENA]
```

### 06. Conclusiones y Tareas de Cierre

- **Confirmación de copias inmutables:** Se verificó que los respaldos en frío (_air-gapped_) de las 00:00 UTC están intactos.
- **Análisis de causa raíz:** El vector inicial de entrada fue una credencial VPN sin segundo factor de autenticación (MFA).
- **Notificación regulatoria:** Se activó el plazo legal de 72 horas para reporte ante el organismo de protección de datos.
- **Refuerzo defensivo:** Se habilitó autenticación basada en hardware FIDO2 en todas las cuentas de infraestructura.
