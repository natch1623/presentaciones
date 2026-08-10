TEMA 6 — UNIDAD DE ENDOSCOPÍA / LAPAROSCOPÍA
Contenido listo para copiar y pegar
LÁMINA 6.1 — Portada

MÓDULO N°1 — EQUIPOS DE SALÓN DE OPERACIONES
Tema 6: Torre de Endoscopía / Laparoscopía

Equipos Médicos I — Código 5827
Ing. Bryan Rodríguez S. | UDELAS

LÁMINA 6.2 — Objetivos de aprendizaje

Al finalizar este tema, el estudiante será capaz de:

Describir la arquitectura funcional de una torre de endoscopía y la función de cada módulo.
Explicar el principio óptico de la varilla de Hopkins y la diferencia entre endoscopio rígido, fibroscopio y videoendoscopio.
Analizar el funcionamiento del insuflador de CO₂ y justificar el uso de este gas.
Explicar la imagen por fluorescencia NIR con verde de indocianina (ICG).
Aplicar el protocolo de reprocesamiento conforme a ANSI/AAMI ST91 y la clasificación de Spaulding.
Diagnosticar fallas de imagen, iluminación e insuflación.
Identificar los riesgos de quemadura, embolia gaseosa e infección cruzada.
LÁMINA 6.3 — Definición y terminología

Torre de endoscopía/laparoscopía: conjunto integrado de equipos electromédicos que permite visualizar, iluminar, distender y operar dentro de una cavidad corporal a través de accesos mínimos (puertos) o de orificios naturales, sustituyendo la visión directa del cirujano por una imagen de video en tiempo real.

Términos que hay que distinguir:

Término	Significado
Endoscopía	Término general: visualización del interior del cuerpo con un endoscopio
Laparoscopía	Endoscopía de la cavidad abdominal, con neumoperitoneo
Toracoscopía / VATS	Endoscopía de la cavidad torácica (sin insuflación a presión, por colapso pulmonar controlado)
Artroscopía	Endoscopía articular, con distensión por líquido, no por gas
Histeroscopía / cistoscopía / ureteroscopía	Endoscopía de cavidad uterina, vesical o ureteral (con líquido)
Endoscopía flexible digestiva	Gastroscopía, colonoscopía, CPRE (duodenoscopio), broncoscopía
Cirugía mínimamente invasiva (CMI)	Concepto clínico global
NOTES / puerto único (SILS)	Variantes de acceso

Ventajas clínicas de la CMI: menor dolor postoperatorio, menor pérdida sanguínea, menor tasa de infección de herida, estancia hospitalaria más corta, reincorporación laboral temprana, mejor resultado estético.
Desventajas técnicas: pérdida de la visión estereoscópica (en 2D), pérdida de la sensación táctil, efecto fulcro (movimiento invertido), curva de aprendizaje pronunciada, dependencia total del equipamiento.

📌 Consecuencia para el biomédico: en cirugía abierta, si falla un equipo el cirujano puede continuar. En CMI, si falla la torre, la cirugía se detiene o se convierte a cirugía abierta. La disponibilidad del equipo es un factor clínico directo.

LÁMINA 6.4 — Evolución histórica
Año	Hito
1806	Philipp Bozzini presenta el Lichtleiter: un tubo con espejo y vela — primer endoscopio
1853	Antonin Desormeaux usa una lámpara de alcohol; se le considera "padre de la endoscopía"
1879	Maximilian Nitze desarrolla el cistoscopio con lente y filamento incandescente
1901	Georg Kelling realiza la primera "celioscopía" en perro, insuflando aire filtrado
1910	Hans Christian Jacobaeus publica la primera serie de laparoscopías y toracoscopías en humanos
1938	Janos Veress desarrolla la aguja de Veress para neumotórax; se adopta para el neumoperitoneo
1952–1960	Basil Hirschowitz desarrolla el fibroscopio flexible basado en fibra óptica
1966	⭐ Harold Hopkins patenta el sistema de varillas de vidrio (rod-lens) — revoluciona la calidad de imagen del endoscopio rígido
1960s	Kurt Semm desarrolla el insuflador automático de CO₂ y la instrumentación laparoscópica ginecológica
1980–1982	Aparece la videocámara CCD acoplada al endoscopio: todo el equipo puede ver la imagen
1987	Philippe Mouret (Lyon) realiza la primera colecistectomía laparoscópica con video. Nace la cirugía mínimamente invasiva moderna
1990s	Difusión mundial; fuentes de luz de xenón; instrumental especializado
2000s	Imagen HD; alta definición y monitores planos
2011	Primeros equipos de laparoscopía 3D
2012	Primeros equipos con fluorescencia ICG
2018	Primeras cámaras 4K
2019–hoy	Plataformas integradas 4K + 3D + fluorescencia; fuentes LED; integración digital del quirófano

(Cronología reciente coincidente con lo reportado por la industria: en 2011 se diseña el primer equipo para cirugía laparoscópica en 3D; en 2012 se lanza el primer equipo con posibilidad de técnicas basadas en verde de indocianina; de 2018 data la primera cámara 4K.) 
Iisgetafe

⚙️ PRINCIPIO DE FUNCIONAMIENTO
LÁMINA 6.5 — Arquitectura de la torre (diagrama de bloques)
                    ┌──────────────────┐
                    │  MONITOR 4K/3D   │ ← señal de video
                    └────────▲─────────┘
                             │
   ┌─────────────────────────┴──────────────────────┐
   │  UNIDAD DE CONTROL DE CÁMARA (CCU/procesador)  │
   └─────────────────────────▲──────────────────────┘
                             │ cable de cámara
                    ┌────────┴─────────┐
                    │ CABEZAL DE CÁMARA│──acopla──► ÓPTICA (endoscopio)
                    └──────────────────┘                  ▲
   ┌────────────────────────────┐                         │ cable de luz
   │  FUENTE DE LUZ FRÍA (LED/  │─────────────────────────┘
   │  Xenón) + módulo NIR/ICG   │
   └────────────────────────────┘
   ┌────────────────────────────┐
   │  INSUFLADOR DE CO₂          │──manguera + filtro──► TROCAR
   └────────────────────────────┘
   ┌────────────────────────────┐
   │  BOMBA DE IRRIGACIÓN/       │──► cánula de lavado-aspiración
   │  SUCCIÓN                    │
   └────────────────────────────┘
   ┌────────────────────────────┐
   │  GRABADOR / SISTEMA DE      │
   │  INTEGRACIÓN Y ARCHIVO      │
   └────────────────────────────┘
   ┌────────────────────────────┐
   │  CARRO CON BRAZOS, UPS,     │
   │  TRANSFORMADOR DE AISLAMIENTO│
   └────────────────────────────┘

Un pliego típico de alta complejidad exige que el sistema esté integrado por: procesador de video, cabezal de cámara, fuente de luz, ópticas de laparoscopía, insuflador de alto flujo, monitor color de alta resolución, almacenamiento y carro de transporte, y que se declare marca y modelo de cada módulo. 
Buenos Aires Government

LÁMINA 6.6 — Los endoscopios: tres familias
Tipo	Construcción	Transmisión de imagen	Uso típico
Rígido (con varillas de Hopkins)	Tubo metálico con varillas de vidrio y lentes de aire; haz de fibras para iluminación	Óptica directa hasta el ocular; la cámara se acopla afuera	Laparoscopía, artroscopía, histeroscopía, cistoscopía
Fibroscopio flexible	Haz coherente de miles de fibras ópticas (una fibra = un píxel)	La imagen viaja por el haz coherente hasta el ocular	En desuso; reemplazado por videoendoscopio
Videoendoscopio flexible	Sensor CCD/CMOS en la punta distal; solo cables eléctricos y canales por dentro	La señal ya sale digitalizada	Gastroscopía, colonoscopía, broncoscopía, CPRE

⭐ El principio de Hopkins (1966) — explicación para ingeniería:

En el endoscopio clásico, el tubo estaba lleno de aire con lentes de vidrio delgadas espaciadas. Poca luz, imagen pobre.
Hopkins invirtió la relación: llenó el tubo con varillas largas de vidrio separadas por finas capas de aire que actúan como lentes.
Resultado: mayor índice de refracción en la mayor parte del trayecto → mayor transmisión de luz (hasta 8–10 veces), mayor campo de visión y mejor resolución con el mismo diámetro.

Parámetros del endoscopio rígido a especificar:

Diámetro: 10 mm (óptica principal), 5 mm, 3 mm (mini/pediátrico).
Ángulo de visión: 0° (visión frontal, más intuitivo), 30° (el más versátil, permite "mirar alrededor" rotando la óptica), 45°, 70° (artroscopía, ORL).
Longitud útil: 300–330 mm en laparoscopía de adulto.
Campo de visión (FOV): típicamente 80°–90°.
Autoclavable vs. solo esterilizable por métodos a baja temperatura.
LÁMINA 6.7 — Cámara y procesador de video (CCU)

Cabezal de cámara:

Contiene el sensor de imagen (CCD o CMOS) y el acoplador óptico al endoscopio.
1 chip: un sensor con filtro de Bayer. Económico, menor fidelidad de color.
3 chips: un prisma divide la luz en R, G y B hacia tres sensores. Mejor color y resolución, mayor costo.
Enfoque y zoom manual; botones programables en el cabezal (captura de foto, video, balance de blancos, cambio de modo).
Debe ser sumergible y esterilizable.

Resoluciones:

Formato	Píxeles	Notas
SD	720 × 480	Obsoleto
HD (Full HD)	1920 × 1080	Base actual
4K UHD	3840 × 2160	Cuatro veces la resolución de 1080p y nueve veces la de los sistemas HD; permite ver estructuras finas y cambios sutiles durante el procedimiento 
Made-in-China

4K DCI	4096 × 2160	Según monitor
3D	Dos canales ópticos independientes	Restituye la percepción de profundidad; requiere monitor y gafas compatibles

Funciones del procesador (CCU):

Balance de blancos — calibración del color con la óptica y la fuente instaladas. Debe hacerse antes de cada caso.
Control automático de ganancia y de obturador — control automático del obturador para evitar destellos por reflexión sobre instrumentos metálicos. 
El Digital de Albacete
Filtros de mejora de imagen en tiempo real (realce de contraste, realce vascular).
Grabación: grabación 4K integrada con tasa de bits variable y codificación H.265 a través de puerto USB. 
STAGLIFE
Salidas de video: salidas digitales con resolución Full HD (1920×1080p) y 4K (3840×2160p); SDI, DVI, HDMI, IP. 
Contratación del Sector Público
LÁMINA 6.8 — Fuente de luz fría y transmisión

¿Por qué se llama "luz fría"? Porque la fuente filtra el infrarrojo antes de acoplar la luz a la fibra. El calor queda en la fuente, no viaja al paciente. Pero la punta del cable sí se calienta (ver riesgos).

Tecnología	Potencia típica	Vida útil	CCT	Observaciones
Halógena	150–250 W	500–1 000 h	~3 200 K	Obsoleta; luz amarillenta
Xenón	300 W	500–1 000 h	~6 000 K	Excelente espectro; el estándar histórico
LED ⭐	Equivalente a 300 W xenón	Más de 60 000 horas 
STAGLIFE
	Ajustable	Fuente de luz LED con potencia lumínica similar a 300 W de xenón, con modo de ajuste de intensidad automático. 
Contratación del Sector Público
 Estándar actual

Transmisión de la luz:

Cable de fibra óptica: haz de miles de fibras de vidrio. Robusto pero pierde transmisión conforme se rompen fibras.
Cable de fluido (líquido): mayor transmisión, sobre todo en el azul; más rígido y sensible al autoclave.
⚠️ Pérdidas en las conexiones: cada acople fuente–cable y cable–endoscopio introduce pérdidas significativas. Una imagen oscura suele ser un problema de cable o de acoples, no de la fuente.
Prueba de campo rápida: apuntar el cable desconectado hacia una superficie blanca con luz baja. Los puntos negros son fibras rotas. Con más de ~20–30 % de fibras rotas, el cable debe reemplazarse.
LÁMINA 6.9 — Imagen por fluorescencia NIR con verde de indocianina (ICG)

Principio físico:

Se administra verde de indocianina (ICG) por vía intravenosa (o local). Es un colorante que se une a proteínas plasmáticas y circula por el torrente sanguíneo y los vasos linfáticos.
La fuente de luz emite en el infrarrojo cercano (NIR), con excitación en torno a ~800–810 nm.
El ICG absorbe esa energía y reemite fluorescencia en torno a ~830 nm (también NIR, invisible al ojo humano).
El sensor de la cámara, con filtros ópticos específicos, capta esa emisión y el procesador la superpone como una capa de color sobre la imagen visible.

Aplicaciones clínicas:

Evaluación de perfusión tisular (viabilidad de anastomosis intestinales, colgajos).
Identificación de la vía biliar (colangiografía por fluorescencia).
Ganglio centinela y mapeo linfático en oncología.
Identificación de uréteres (evitando la lesión ureteral).

Ejemplo comercial: el modo ENV proporciona visualización en tiempo real de la anatomía durante cirugía mínimamente invasiva utilizando ICG fluorescente para evaluar flujo sanguíneo, perfusión tisular y conductos biliares; la tecnología IRIS ilumina un stent que transilumina los uréteres para reducir el riesgo de daño ureteral. 
MedGill Ltd

⚠️ Requisito de sistema completo: la fluorescencia no es solo la fuente de luz. Requiere que la fuente, el cabezal de cámara, el procesador Y la óptica sean compatibles con NIR. Si se ofrece el cabezal de cámara con fluorescencia, la óptica también debe ser apta para cirugía guiada por fluorescencia. Comprar solo la fuente NIR y esperar fluorescencia es un error de especificación costoso. 
El Digital de Albacete

LÁMINA 6.10 — Insuflador de CO₂

Función: crear y mantener el neumoperitoneo — la cavidad de trabajo — a presión y flujo controlados.

¿Por qué CO₂ y no aire, oxígeno o nitrógeno?

Criterio	CO₂	Por qué importa
Inflamabilidad	❌ No es comburente ni combustible	Compatible con electrocirugía y láser. El O₂ sería catastrófico
Solubilidad en sangre	✅ Muy alta (~20× la del oxígeno; ~50× la del nitrógeno)	Si entra a un vaso, se disuelve rápidamente → menor riesgo de embolia gaseosa clínicamente significativa
Eliminación	✅ Se elimina por vía pulmonar	Fisiológicamente manejable
Costo y disponibilidad	✅ Bajo	Viable en cualquier hospital
Desventaja	⚠️ Se absorbe al torrente → hipercapnia y acidosis respiratoria; irrita el peritoneo (dolor referido en hombro)	El anestesiólogo debe compensar con ventilación

Parámetros de operación:

Parámetro	Valor típico
Presión intraabdominal de trabajo	12 – 15 mmHg (adulto); menor en pediatría (6–10 mmHg)
Presión máxima ajustable	Limitada por seguridad, típicamente ≤ 20–25 mmHg
Flujo	Bajo flujo 1–3 L/min (inicio con aguja de Veress); alto flujo 30–50 L/min en mantenimiento
Presión de entrada	Desde cilindro con regulador o desde red central
Volumen de neumoperitoneo	3–6 L en adulto

Ejemplo de especificación comercial: medio de insuflación CO₂, caudal máximo de gas 50 L/min, con manguera de alta presión para botella de CO₂ o gas central de pared. 
STAGLIFE

Funciones de seguridad obligatorias:

Control de presión en lazo cerrado: mide la presión real y regula el flujo.
Alarma y venteo automático por sobrepresión.
Detección de oclusión de la manguera o el trocar.
Alarma de cilindro con presión baja.
Filtro hidrofóbico de 0,2 µm entre insuflador y paciente (bidireccional: protege al paciente del equipo y al equipo del reflujo de fluidos y aerosoles).
Calentamiento y humidificación del gas (opcional): reduce hipotermia y empañamiento de la óptica.
LÁMINA 6.11 — Irrigación, succión y monitor

Bomba de irrigación/succión:

Bomba peristáltica que impulsa solución salina para lavado del campo.
Presión y flujo ajustables; en artroscopía e histeroscopía la irrigación sustituye al gas como medio de distensión → ⚠️ requiere control estricto del balance de líquidos (riesgo de síndrome de absorción intravascular).
La succión se conecta a la red de vacío del quirófano o a bomba dedicada, con trampa de fluidos.

Monitor quirúrgico:

Resolución acorde a la cámara (no sirve una cámara 4K en un monitor Full HD).
Monitor de gran tamaño —32", con posibilidad de 55"— y conexión simultánea de hasta 3 monitores. 
STAGLIFE
Grado médico: calibración de color, brillo alto, sin retardo perceptible (low latency), carcasa sellada y limpiable, conforme a IEC 60601-1.
Posicionamiento ergonómico: a la altura de los ojos del cirujano, alineado con el eje de trabajo.

Carro / torre:

Con transformador de aislamiento interno: todos los módulos comparten una fuente aislada y una sola conexión a la red → controla las corrientes de fuga sumadas del sistema.
⚠️ Concepto normativo importante: al conectar varios equipos en un carro se forma un SISTEMA ELECTROMÉDICO (IEC 60601-1, cláusula 16). Las corrientes de fuga se suman. El sistema completo debe verificarse como un todo, no equipo por equipo.
🏭 MARCAS Y ESPECIFICACIÓN
LÁMINA 6.12 — Principales fabricantes
Fabricante	Origen	Plataformas representativas	Notas
Karl Storz	🇩🇪	Image1 S, Rubina (4K/3D/ICG), fuentes Power LED	Referencia en endoscopía rígida; heredera de la patente Hopkins
Olympus	🇯🇵	Visera Elite III, EndoEye 3D, CV-1500	Líder en endoscopía flexible digestiva; insufladores UHI
Stryker	🇺🇸	1588 AIM, 1788, PneumoSure (insuflador), SPY-PHI	Modos ENV e IRIS para fluorescencia y visualización ureteral 
MedGill Ltd

Richard Wolf	🇩🇪	Endocam Logic 4K	Gama alta
Arthrex	🇺🇸	Synergy UHD4, bombas de artroscopía	Fuerte en artroscopía
Medtronic	🇺🇸	Visualización y energía integradas	—
Fujifilm / Pentax Medical	🇯🇵	Endoscopía flexible	Digestiva y broncoscopía
Mindray	🇨🇳	Torres HD/4K	Gama media; presencia regional
Fabricantes emergentes	🇨🇳🇰🇷	Diversos (4K/ICG)	Gama de entrada-media
LÁMINA 6.13 — Criterios de especificación técnica

Ficha técnica mínima de una torre de laparoscopía:

Procesador y cámara

✅ Resolución de salida nativa: 4K (3840×2160p) y/o 3D nativo.
✅ Tipo de sensor (CMOS/CCD), número de chips.
✅ Modos de fluorescencia ICG — indicar cuántos y cuáles: tres modos de visualización de fluorescencia guiada por ICG. 
Contratación del Sector Público
✅ Balance de blancos, control automático de obturador, filtros de realce en tiempo real.
✅ Botones programables con diferentes funciones y grabación de video y foto desde el cabezal. 
Contratación del Sector Público
✅ Cabezal sumergible y esterilizable; método admitido.

Fuente de luz

✅ LED con vida útil declarada y potencia equivalente a xenón 300 W.
✅ Compatible con NIR/ICG.
✅ Modo de ajuste automático de intensidad; modo de espera (standby) al desacoplar.

Insuflador

✅ Flujo máximo ≥ 40–50 L/min.
✅ Rango de presión y precisión de regulación; alarma y venteo por sobrepresión.
✅ Calentamiento del gas (deseable); conexión a cilindro y a red central.
✅ Filtro de 0,2 µm incluido, con costo y disponibilidad declarados.

Ópticas

✅ Cantidad, diámetro (10 y 5 mm), ángulos (0° y 30°), longitud, aptas para ICG si aplica.
✅ Método de esterilización admitido (autoclavable es un plus operativo enorme).

Sistema

✅ Monitor de grado médico con resolución igual o superior a la cámara.
✅ Carro con transformador de aislamiento, brazos articulados y tomas suficientes.
✅ Almacenamiento/grabación y salidas de video.
✅ Costo y disponibilidad local de consumibles y de reparación de ópticas (una óptica dañada cuesta una fracción importante del equipo).
✅ Registro sanitario vigente ante la Dirección Nacional de Farmacia y Drogas del MINSA.

💡 Consejo de compra: solicitar siempre la cotización de reparación de una óptica y de un cable de luz, y el tiempo de reposición. Es el costo oculto que más impacta al servicio.

🔧 MANTENIMIENTO PREVENTIVO
LÁMINA 6.14 — Protocolo de mantenimiento preventivo
Frecuencia	Actividad	Responsable
Antes de cada caso	Balance de blancos; verificar imagen y color; verificar cilindro de CO₂ con presión suficiente; prueba de fugas del endoscopio flexible; verificar filtro de insuflación nuevo	Enfermería / usuario
Diaria	Limpieza externa de módulos y monitor; inspección de cables (luz, cámara, alimentación); verificar ventilación del carro	Usuario
Semanal	🔦 Prueba de fibras del cable de luz (proyección sobre superficie blanca, contar puntos negros); inspección visual de ópticas (imagen empañada, rayas, empañamiento interno)	Biomédico / Usuario
Mensual	Verificación de calibración del insuflador: presión indicada vs. medida con manómetro patrón; prueba de alarmas de sobrepresión y oclusión; limpieza de filtros de aire de los módulos	Biomédico
Trimestral	Verificación de la fuente de luz (intensidad, temperatura de color, estado del LED/lámpara y horas acumuladas); revisión de conectores de video; prueba del sistema de grabación	Biomédico
Semestral	🔬 Pruebas de seguridad eléctrica IEC 62353 del SISTEMA completo (todos los módulos del carro, con corrientes de fuga sumadas); verificación del transformador de aislamiento; calibración del insuflador con patrón trazable	Biomédico
Anual	Servicio OEM; recalibración de cámara y fuente; actualización de firmware; evaluación del estado de todas las ópticas con criterio de reparación o reemplazo	Biomédico / OEM
Continuo	Registro del número de ciclos de esterilización de ópticas y cabezales; historial de reparaciones por óptica	Biomédico

Herramientas específicas: manómetro patrón para insuflador, caudalímetro, luxómetro, patrón de resolución óptica (carta de prueba), boroscopio para inspección de canales de endoscopios flexibles, analizador de seguridad eléctrica.

🧼 ASEPSIA Y REPROCESAMIENTO

(La sección más crítica de este tema)

LÁMINA 6.15 — Clasificación y nivel de procesamiento requerido
Dispositivo	Categoría de Spaulding	Procesamiento requerido
Laparoscopio, artroscopio, toracoscopio, trocares, instrumental rígido	CRÍTICO (entra a cavidad estéril)	✅ ESTERILIZACIÓN — los endoscopios rígidos que entran a cavidades corporales estériles, como laparoscopios y artroscopios, requieren esterilización 
Pure Processing

Cabezal de cámara y cable de luz (entran al campo estéril)	CRÍTICO	Esterilización o funda estéril según IFU del fabricante
Endoscopio flexible digestivo o respiratorio (gastroscopio, colonoscopio, broncoscopio)	SEMICRÍTICO (contacta mucosas)	Para los endoscopios GI flexibles clasificados como semicríticos bajo el sistema de Spaulding, la desinfección de alto nivel (DAN) es el estándar mínimo 
Pure Processing

Endoscopios de alto riesgo (duodenoscopio, ecoendoscopio)	Semicrítico de alto riesgo	La esterilización es preferible cuando es factible; ANSI/AAMI ST91:2021 recomienda que las instalaciones comiencen a planificar hacia la esterilización para endoscopios flexibles de alto riesgo, y la guía SHEA de 2025 aborda específicamente cuándo debe preferirse la esterilización sobre la DAN para dispositivos de mayor riesgo como los duodenoscopios 
Pure Processing

Flexibles que entran al torrente sanguíneo o a tejido estéril	CRÍTICO	Todos los endoscopios flexibles que se introducen directamente en el torrente sanguíneo o que contactan tejido o espacio corporal normalmente estéril son dispositivos críticos y deben esterilizarse 
Infection Control Today

Carro, monitor, procesador, insuflador	No crítico	Desinfección de nivel bajo/intermedio
LÁMINA 6.16 — Etapas del reprocesamiento de endoscopios flexibles

La norma ST91 establece procedimientos para tratamiento en el punto de uso, transporte de endoscopios contaminados, prueba de fugas, limpieza manual y automatizada, enjuague, secado, inspección y verificación de limpieza. 
Infection Control Today

Secuencia obligatoria:

Tratamiento en el punto de uso — limpieza inicial inmediatamente al terminar el procedimiento, antes de que la materia orgánica se seque.
Transporte contenido al área de descontaminación (contenedor cerrado e identificado).
🔍 PRUEBA DE FUGAS (leak test) — antes de sumergir. Si hay fuga y el endoscopio se sumerge, entra líquido al interior y el equipo se pierde o requiere reparación mayor. Es la prueba que más equipos salva.
Limpieza manual — inmersión, cepillado de todos los canales y válvulas, con detergente enzimático según IFU.
Enjuague — con agua de calidad controlada. Con la publicación de AAMI ST108:2023, "Agua para el reprocesamiento de dispositivos médicos", debe referenciarse ST108 para la calidad del agua en el procesamiento de endoscopios. 
Infection Control Today
Inspección y verificación de limpieza — ⭐ ver lámina siguiente.
Desinfección de alto nivel o esterilización — manual o en reprocesador automático de endoscopios (AER). Deben conectarse todos los conectores de canal conforme a las instrucciones del AER y del fabricante del endoscopio para asegurar la exposición de todas las superficies internas al desinfectante; solo deben usarse conectores aprobados. Si el ciclo se interrumpe, debe repetirse un ciclo completo. 
ASGE
Secado activo con aire filtrado — el secado incompleto permite proliferación bacteriana durante el almacenamiento.
Almacenamiento — en gabinete ventilado, en posición vertical, sin acodamientos.
Documentación y trazabilidad — debe mantenerse documentación de todas las pruebas de equipos, procesos y monitores de calidad usados durante el reprocesamiento, así como registros de entrenamiento del personal. 
ASGE
LÁMINA 6.17 — Verificación de limpieza: lo que la vista no detecta

⚠️ La inspección visual NO es suficiente. Un endoscopio que parece limpio puede albergar residuos que no pueden verse sin magnificación. Los estudios han mostrado consistentemente que endoscopios con residuo detectado mediante pruebas indicadoras de verificación de limpieza pueden parecer limpios en la inspección visual. 
News
Pure Processing

Herramientas de verificación:

Pruebas de verificación de limpieza mediante indicadores rápidos de ATP residual, proteína o hemoglobina, recomendadas después de cada uso de endoscopios de alto riesgo. 
Pure Processing
La versión actualizada recomienda realizar la verificación de limpieza después de cada uso de endoscopios de alto riesgo, en particular duodenoscopios, ecoendoscopios lineales (EUS), broncoscopios, endoscopios de ultrasonido endobronquial (EBUS), ureteroscopios y cistoscopios. 
News
La inspección con boroscopio de los canales internos de trabajo se recomienda para aseguramiento periódico de la calidad y tras cualquier evento sospechoso de daño. 
Pure Processing
Si queda suciedad visible, se retorna a la limpieza manual. Si se encuentra daño estructural, se retira de servicio y se sigue la política de reparación. 
Pure Processing

Por qué importa — la evidencia:

Se han documentado brotes de infección por microorganismos multirresistentes relacionados con endoscopios flexibles; la revisión de los procesos de reprocesamiento reveló fallas en pasos que podían comprometer la seguridad del paciente. Múltiples publicaciones revisadas por pares en varios países han documentado brechas de procesamiento que llevaron a exposición de pacientes a endoscopios flexibles y semirrígidos procesados inadecuadamente, y a infecciones subsecuentes. 
News
En estudios de vigilancia posmercado exigidos por la FDA se detectaron microorganismos de alta preocupación en el 5 % de los duodenoscopios, y recuentos superiores a 100 UFC en entre 0,6 % y 4,4 % de ellos. 
American Journal of Infection Control

Competencias del personal: ST91 aclara que las competencias del personal deben incluir cada marca y modelo específico de endoscopio, equipo, conexiones de equipo y procedimientos de verificación de limpieza; si la institución tiene 8 endoscopios distintos, cada empleado debe demostrar entrenamiento y competencia específicos para cada marca y modelo. 
Infection Control Today

📌 Rol del ingeniero biomédico aquí: aunque el reprocesamiento lo ejecuta la CEyE o la unidad de endoscopía, el biomédico es responsable del desempeño del AER, de la lavadora-desinfectadora, del sistema de agua tratada y del secador, y de la verificación periódica de sus parámetros. Es un punto de integración directo con el Módulo N°4 (CEyE).

⚠️ FALLAS Y DAÑOS COMUNES
LÁMINA 6.18 — Tabla de diagnóstico
#	Síntoma	Causas probables	Acción del biomédico
1	Imagen oscura	⭐ Cable de luz con fibras rotas (causa #1); acoples sucios; LED/lámpara al final de su vida; intensidad baja; óptica con transmisión degradada	Probar cable de repuesto primero; luego óptica; luego fuente
2	Imagen borrosa o empañada	Empañamiento por diferencia térmica; humedad dentro de la óptica (falla del sellado — daño irreparable en campo); lente sucia	Distinguir empañamiento externo (se limpia) de interno (reparación OEM)
3	Imagen con manchas fijas o "medialunas"	Varilla de Hopkins rota o desalineada por golpe o flexión	Óptica dañada → reparación; revisar manejo y almacenamiento
4	Color incorrecto (verdoso/rosado)	Balance de blancos no realizado; temperatura de color desajustada; falla en un canal del prisma 3-chip	Rehacer balance de blancos con la óptica y el cable definitivos
5	No hay imagen en el monitor	Cable de video; entrada de monitor incorrecta; cabezal desconectado; CCU en falla	Verificar la cadena de video de extremo a extremo
6	Imagen con ruido o "nieve"	Ganancia alta por poca luz; cable de cámara dañado; interferencia (ESU)	Corregir la iluminación antes de subir la ganancia
7	No se logra o no se mantiene el neumoperitoneo	Fuga por los trocares o por la incisión; cilindro de CO₂ vacío; manguera o filtro obstruido; llave del trocar cerrada; aguja de Veress mal posicionada	Verificar cilindro y filtro; probar manguera; verificar con manómetro patrón
8	Insuflador marca sobrepresión constante	Manguera acodada u obstruida; trocar contra tejido; sensor de presión descalibrado; filtro saturado	Cambiar filtro; verificar permeabilidad; calibrar
9	Presión indicada ≠ presión real	Sensor descalibrado	Calibración con patrón; es un riesgo directo para el paciente
10	Cabezal de cámara con líquido dentro	Falla del sellado por esterilización inadecuada o golpe	Retirar de servicio; reparación OEM; revisar el procedimiento de reprocesamiento
11	Endoscopio flexible con fuga detectada	Perforación del canal o del recubrimiento externo, mordedura, daño por manejo	NO sumergir; enviar a reparación de inmediato
12	El sistema dispara el diferencial del quirófano	Corrientes de fuga sumadas de los módulos del carro; transformador de aislamiento en falla	Medir el sistema completo conforme a IEC 60601-1 cláusula 16
🛡️ RIESGOS
LÁMINA 6.19 — Riesgos para el PACIENTE
Riesgo	Mecanismo	Prevención
⭐ Quemadura por la punta del cable de luz	La punta del cable concentra energía radiante: puede superar 200 °C y encender campos textiles o quemar la piel en segundos	Nunca apoyar el cable encendido sobre el paciente ni sobre los campos; usar el modo standby al desacoplar; colocar el cable en su soporte
Quemadura por electrocirugía en laparoscopía	Acoplamiento capacitivo y falla de aislamiento del instrumental — lesión fuera del campo visual (ver Tema 4)	Evitar sistemas híbridos metal/plástico; prueba de aislamiento en cada reprocesamiento; mínima potencia y modo de menor voltaje
Embolia gaseosa por CO₂	Insuflación directa en un vaso (mal posicionamiento de la aguja de Veress) o alta presión	Verificación de posición antes de insuflar; iniciar con flujo bajo; alarmas de presión funcionales
Compromiso hemodinámico y ventilatorio	Presión intraabdominal elevada → ↓ retorno venoso, ↑ presión de vía aérea, hipercapnia	Mantener presión en 12–15 mmHg; comunicación con anestesia; calibración correcta del insuflador
Hipotermia	Insuflación de grandes volúmenes de gas frío y seco	Calentamiento y humidificación del gas; manta térmica
Lesión por trocar	Punción de vaso o víscera durante el acceso	Técnica; visión directa (trocar óptico); no es un riesgo del equipo
Infección cruzada	Reprocesamiento deficiente — el riesgo #1 del tema	ST91; verificación de limpieza; trazabilidad; AER validado
Lesión ureteral / de vía biliar	Identificación anatómica errónea	Fluorescencia ICG e IRIS como ayuda; no sustituye la técnica
Retraso o conversión de cirugía	Falla del equipo intraoperatoria	MP riguroso; equipo de respaldo disponible (óptica y cable de luz de repuesto en sala)
LÁMINA 6.20 — Riesgos para el PERSONAL BIOMÉDICO
Riesgo	Fuente	Control
Biológico	Endoscopios y accesorios contaminados; canales con material orgánico; aerosoles en el área de descontaminación	Recibir el equipo descontaminado y documentado; EPP completo (bata impermeable, guantes largos, protección facial); nunca abrir un endoscopio sin reprocesamiento previo
Químico	Glutaraldehído, ácido peracético y OPA en el área de reprocesamiento (irritantes respiratorios y sensibilizantes)	Ventilación local extractora; EPP; nunca intervenir un AER cargado con desinfectante sin drenarlo y purgarlo
Fotobiológico	Exposición ocular directa a la salida de la fuente de luz (300 W equivalente) o al láser NIR	Nunca mirar la salida de la fuente ni el extremo del cable encendido; la radiación NIR es invisible pero dañina para la retina
Quemadura	Punta del cable de luz y conector de la fuente tras uso prolongado	Apagar y esperar enfriamiento antes de manipular
Eléctrico	Sistema multi-equipo con corrientes de fuga sumadas; transformador de aislamiento	LOTO; medición del sistema completo
Ergonómico	Movilización del carro (60–120 kg) por rampas y pasillos	Empujar, no arrastrar; frenos; dos personas en rampa
Presión	Cilindro de CO₂ de alta presión	Sujeción del cilindro; despresurizar la línea antes de desconectar; nunca golpear la válvula