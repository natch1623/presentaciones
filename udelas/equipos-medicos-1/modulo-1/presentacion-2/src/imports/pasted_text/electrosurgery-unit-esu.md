TEMA 4 — UNIDAD DE ELECTROCIRUGÍA (ESU)
Contenido listo para copiar y pegar
LÁMINA 4.1 — Portada

MÓDULO N°1 — EQUIPOS DE SALÓN DE OPERACIONES
Tema 4: Unidad Electroquirúrgica de Alta Frecuencia (ESU / Electrobisturí)

Equipos Médicos I — Código 5827
Ing. Bryan Rodríguez S. | UDELAS

LÁMINA 4.2 — Objetivos de aprendizaje

Al finalizar este tema, el estudiante será capaz de:

Explicar por qué la electrocirugía usa alta frecuencia y no corriente de red.
Relacionar densidad de corriente, potencia disipada y efecto térmico en el tejido.
Distinguir corte, desecación y fulguración a partir de la forma de onda y el factor de cresta.
Diferenciar modo monopolar y bipolar, y explicar la función del electrodo neutro y del sistema CQM/REM.
Aplicar el protocolo de verificación con analizador de electrocirugía.
Identificar los mecanismos de quemadura, incendio quirúrgico e interferencia con dispositivos implantados.
LÁMINA 4.3 — Repaso breve: conceptos eléctricos necesarios

Cinco ideas que hay que tener frescas:

Concepto	Expresión	Qué significa aquí
Valor eficaz (RMS)	V_rms = V_pico/√2 (solo para senoidal pura)	Es el valor que produce calor. La ESU trabaja con ondas no senoidales → el RMS no se obtiene dividiendo entre √2
Impedancia	Z = √(R² + X²)	El tejido no es una resistencia pura: tiene componente capacitivo. Su impedancia cambia durante el corte (de ~50 Ω a >1000 Ω al desecarse)
Potencia	P = V·I = I²·R = V²/R	La ESU debe regular la potencia mientras la impedancia del tejido varía enormemente
Densidad de corriente	J = I / A [A/m²]	⭐ El concepto central de todo el tema. La misma corriente concentrada en 1 mm² o dispersa en 100 cm² produce efectos opuestos
Potencia disipada por volumen (efecto Joule)	p = ρ · J² [W/m³]	El calentamiento del tejido crece con el cuadrado de la densidad de corriente

📌 La ecuación que explica toda la electrocirugía:
p = ρ · J² = ρ · (I/A)²
La misma corriente que vaporiza tejido bajo la punta del electrodo activo (A ≈ 1 mm²) es inofensiva bajo el electrodo neutro (A ≈ 100 cm²), porque el área es 100 000 veces mayor y la potencia por volumen cae 10¹⁰ veces.

Reactancia capacitiva: X_C = 1/(2πfC). A 500 kHz, un capacitor parásito de pocos picofaradios conduce. Este detalle explica el acoplamiento capacitivo en laparoscopía (lámina 4.22).

LÁMINA 4.4 — Definición y distinción fundamental

Unidad electroquirúrgica (ESU): generador de corriente eléctrica alterna de alta frecuencia que, al circular a través del tejido biológico, produce en él un efecto térmico controlado (corte, coagulación o ambos) por conversión de energía eléctrica en calor mediante el efecto Joule, sin producir estimulación neuromuscular ni electrocución.

⚠️ ELECTROCIRUGÍA ≠ ELECTROCAUTERIO — error terminológico universal que debes corregir:

	Electrocauterio	Electrocirugía (ESU)
Fuente de calor	Un filamento metálico se calienta por corriente (resistencia)	El tejido mismo es el que se calienta
¿Circula corriente por el paciente?	NO	SÍ
Frecuencia	Corriente continua o baja frecuencia	Alta frecuencia (300 kHz – 5 MHz)
Analogía	Un soldador / una plancha	Un horno de microondas focalizado
Uso actual	Oftalmología, dermatología menor, campos con marcapasos	Cirugía general en todas las especialidades

🎙️ Nota: en Panamá el personal clínico dice "el cauterio" para referirse a la ESU. Enseña la diferencia, pero explica que en el ambiente hospitalario tendrán que entender el uso coloquial.

LÁMINA 4.5 — Evolución histórica
Año	Hito
1891	d'Arsonval demuestra que corrientes > 10 kHz atraviesan el cuerpo sin producir contracción muscular ni electrocución — el descubrimiento fundacional
1900–1910	Primeros usos de "diatermia" y desecación con chispa (Doyen, De Forest)
1926	William T. Bovie (físico) desarrolla el generador de chispa; Harvey Cushing (neurocirujano) lo usa clínicamente para resecar un tumor cerebral vascularizado hasta entonces inoperable
1930–1960	Generadores de tubo de vacío y de chispa. Salida referida a tierra → época de las quemaduras por vías alternas
1968–1970	Generadores de estado sólido (transistorizados)
1970s	Salida aislada (isolated output) — se elimina la mayoría de las quemaduras por corrientes de fuga a tierra
1981	REM / CQM: monitorización de la calidad de contacto del electrodo neutro dividido
1990s	Generadores con control por microprocesador y realimentación de impedancia en tiempo real
1998–2000s	Sellado de vasos (LigaSure) y energía ultrasónica (Harmonic)
2010–hoy	Plataformas multienergía integradas, coagulación con plasma de argón, generadores en red, evacuación de humo integrada
⚙️ PRINCIPIO DE FUNCIONAMIENTO
LÁMINA 4.6 — ¿Por qué alta frecuencia?

Respuesta: para evitar la estimulación neuromuscular.

Las membranas de nervios y músculos responden a la corriente eléctrica solo si esta permanece en una dirección el tiempo suficiente para despolarizarlas (~ 0,1–1 ms).
A 60 Hz, cada semiciclo dura ~8,3 ms → más que suficiente para despolarizar → tetania, fibrilación ventricular, electrocución.
Por encima de ~100 kHz, cada semiciclo dura < 5 µs → la membrana no alcanza a responder; la corriente pasa sin estimular. Este es el efecto d'Arsonval (o efecto Faraday).
Pero la energía sí se disipa como calor en el tejido (el efecto Joule no depende de la frecuencia).

Frecuencias de trabajo:

Rango típico de las ESU: 300 kHz – 500 kHz (algunas hasta 4 MHz).
Por debajo de 200 kHz: riesgo de estimulación neuromuscular.
Por encima de ~5 MHz: aumentan las pérdidas por radiación y el acoplamiento capacitivo indeseado.

Resumen para el estudiante: La alta frecuencia no hace el corte. La alta frecuencia hace que el corte sea seguro.

LÁMINA 4.7 — Efecto térmico sobre el tejido

El tejido se calienta por efecto Joule y responde según la temperatura alcanzada:

Temperatura	Efecto en el tejido	Aplicación quirúrgica
37–40 °C	Sin cambio significativo	—
40–50 °C	Daño celular reversible (hipertermia)	Margen térmico lateral no deseado
50–60 °C	Muerte celular; desnaturalización de proteínas y colágeno	Inicio de la coagulación
60–90 °C	Coagulación: retracción del colágeno, sellado de vasos pequeños	Hemostasia / desecación
≈100 °C	El agua intracelular hierve y vaporiza explosivamente → la célula estalla	CORTE
> 200 °C	Carbonización, carbono orgánico, humo	Fulguración; efecto indeseado en corte

La clave está en la velocidad de calentamiento:

Calentamiento rápido y localizado (alta densidad de potencia) → vaporización → CORTE limpio, poco daño lateral.
Calentamiento lento y difuso (baja densidad de potencia) → coagulación progresiva → HEMOSTASIA, con mayor margen térmico lateral.
LÁMINA 4.8 — Formas de onda y factor de cresta

El factor de cresta (crest factor) es el parámetro que define el efecto clínico.

Definición normativa: valor adimensional igual al voltaje pico de salida dividido entre el voltaje RMS, medido en condición de circuito abierto a la salida del equipo de cirugía de alta frecuencia. 
iTech

Modo	Forma de onda	Ciclo de trabajo	Factor de cresta	Voltaje pico típico	Efecto
CORTE (pure cut)	Senoidal continua, no modulada	100 %	~1,4 – 2	500 – 1 500 V	Arco continuo → vaporización → corte limpio, poca hemostasia
BLEND / mezcla	Senoidal modulada en ráfagas	50 – 80 %	~3 – 6	1 500 – 3 000 V	Corte con hemostasia intermedia
COAGULACIÓN (coag)	Ráfagas amortiguadas muy espaciadas	5 – 10 %	~6 – 10	3 000 – 9 000 V	Calentamiento lento y profundo, arcos intermitentes → hemostasia

Regla que hay que memorizar:

A igual potencia media, la forma de onda de coagulación tiene un voltaje pico mucho mayor que la de corte.
Voltaje alto = mayor riesgo de ruptura de aislamiento, acoplamiento capacitivo, arcos indeseados e incendio quirúrgico.
Por eso la regla clínica es: usar la mínima potencia y el modo de menor voltaje que logre el efecto deseado.

LÁMINA 4.9 — Los tres efectos tisulares
Efecto	Contacto con el tejido	Forma de onda	Mecanismo	Resultado
CORTE	Electrodo sin tocar (a 1–2 mm), arco continuo	Corte (no modulada)	Vaporización explosiva del agua celular	Incisión limpia, mínimo daño lateral
DESECACIÓN	Electrodo en contacto directo	Corte o coag	Deshidratación lenta del tejido; sube la impedancia	Coagulación profunda; el tejido se pega al electrodo
FULGURACIÓN	Electrodo sin tocar, arcos largos e intermitentes	Coagulación (alto voltaje)	Arcos dispersos que carbonizan la superficie	Coagulación superficial de área amplia (sangrado en capa)

🎙️ Nota del docente: pregunta de examen clásica — "¿Qué determina si hay corte o coagulación: la perilla del generador o la técnica del cirujano?" Ambas. Con la onda de "corte" se puede coagular (desecación por contacto) y con la de "coag" se puede cortar mal. La técnica pesa tanto como el ajuste.

LÁMINA 4.10 — Monopolar vs bipolar
	MONOPOLAR	BIPOLAR
Trayecto de la corriente	Generador → electrodo activo → atraviesa todo el cuerpo del paciente → electrodo neutro → generador	Generador → una rama de la pinza → solo el tejido entre las puntas → otra rama → generador
Electrodo neutro	Obligatorio	No requerido
Densidad de corriente alta	Solo en la punta activa	Entre ambas puntas
Potencias típicas	30 – 120 W	10 – 50 W
Voltajes	Altos	Bajos
Ventajas	Versátil, corta y coagula, alcance amplio	Mucho más seguro: sin corrientes de desvío, sin quemaduras a distancia, mínima difusión térmica lateral
Desventajas	Riesgo de quemaduras por vías alternas, acoplamiento capacitivo, interferencia con implantes	No corta bien tejido; alcance limitado; requiere pinza específica
Indicaciones preferentes	Cirugía general, disección amplia	Neurocirugía, microcirugía, oftalmología, pacientes con marcapasos/DAI, cirugía pediátrica y neonatal

📌 Criterio de seguridad: siempre que el bipolar pueda hacer el trabajo, el bipolar es la opción correcta. Sobre todo en pacientes con dispositivos cardíacos implantados.

LÁMINA 4.11 — El electrodo neutro (placa/dispersivo)

Función: devolver la corriente al generador con una densidad de corriente tan baja que no produzca elevación térmica significativa.

Requisitos técnicos:

Área suficiente: típicamente ≥ 100 cm² en adultos (proporcionalmente menor en pediatría/neonatal, con placas específicas).
Contacto uniforme sobre toda la superficie — la falla parcial concentra la corriente en el área remanente.
Colocación sobre masa muscular bien vascularizada (muslo, glúteo, brazo), limpia, seca y sin vello.
Lo más cerca posible del sitio quirúrgico, con el eje mayor orientado hacia él.
Evitar: prominencias óseas, cicatrices, tatuajes, prótesis metálicas, tejido con mala perfusión, zonas de acumulación de líquidos.
La norma limita la elevación de temperatura de la piel bajo el electrodo neutro a ≤ 6 °C.

Sistemas de monitorización:

Sistema	Qué vigila	Limitación
Monitor de continuidad	Circuito que genera una alarma ante una discontinuidad eléctrica en el cable del electrodo neutro o sus conexiones 
iTech
	Solo detecta cable roto. No detecta despegue de la placa
CQM — Monitor de calidad de contacto (REM®, ARM, NESSY)	Circuito destinado a conectarse a un electrodo neutro de monitorización, que genera una alarma cuando el contacto del electrodo neutro con el paciente se vuelve insuficiente 
iTech
	Solo es funcional si se usa con un electrodo neutro de monitorización (dividido) 
iTech

Cómo funciona el CQM: el electrodo neutro está dividido en dos mitades. El generador inyecta una corriente de prueba de baja intensidad y mide continuamente la impedancia entre ambas mitades a través de la piel. Si la placa se despega parcialmente, esa impedancia cambia → el generador inhibe la salida y alarma.

⚠️ CAMBIO NORMATIVO IMPORTANTE: la sexta edición de IEC 60601-2-2 (2017) introdujo un nuevo requisito: los electrodos neutros para adultos deben ser electrodos neutros con monitorización de calidad de contacto. Traducción: la placa de una sola pieza (no dividida) ya no cumple la norma en adultos. Es un punto que debe estar en toda especificación de compra y en toda auditoría de inventario. 
IEC

LÁMINA 4.12 — Arquitectura del equipo (diagrama de bloques)
Red 120/240 V, 60 Hz
    ↓
[Fuente de poder + filtro EMI]
    ↓
[Etapa de control — microprocesador]  ←→  [Panel de usuario / pantalla]
    ↓                                    ↑
[Oscilador de RF 300–500 kHz]            │ realimentación
    ↓                                    │ (medición de impedancia,
[Modulador — define la forma de onda]    │  voltaje, corriente)
    ↓                                    │
[Amplificador de potencia]───────────────┘
    ↓
[Transformador de salida — AISLAMIENTO]
    ↓
[Circuito de monitorización CQM/REM]
    ↓
Electrodo activo ──► PACIENTE ──► Electrodo neutro
    
[Interfaces: pedal, mango con botones, alarmas sonoras]

Función de la realimentación (lo que distingue un generador moderno): el equipo mide miles de veces por segundo la impedancia del tejido y ajusta el voltaje/corriente para mantener el efecto clínico constante aunque la impedancia varíe de 50 Ω a 3000 Ω durante el mismo corte.

LÁMINA 4.13 — Salida aterrizada vs aislada
Tipo	Descripción	Riesgo
Referida a tierra (ground-referenced)	El retorno se cierra por tierra. Cualquier objeto aterrizado en contacto con el paciente (mesa, soportes, electrodos de ECG) es una vía alterna de retorno	❌ Obsoleta. Causa histórica de quemaduras en sitios remotos
Salida aislada (isolated output)	El transformador de salida aísla el circuito del paciente respecto de tierra. La corriente solo puede regresar por el electrodo neutro	✅ Estándar actual

Consecuencia práctica: con salida aislada, si el electrodo neutro se desconecta, el circuito simplemente no se cierra y el equipo no entrega energía. Con salida aterrizada, la corriente buscaba otra ruta — y quemaba al paciente en el punto de contacto más pequeño.

⚠️ Aun con salida aislada persisten dos riesgos: el acoplamiento capacitivo y la falla de aislamiento del instrumento (lámina 4.22). La salida aislada no los elimina.

LÁMINA 4.14 — Tecnologías de energía avanzada
Tecnología	Principio	Ventaja	Limitación
Sellado de vasos bipolar (LigaSure, Enseal, Caiman)	Bipolar de alto amperaje/bajo voltaje + compresión mecánica; realimentación de impedancia que corta la energía al completarse la fusión del colágeno	Sella vasos de hasta 7 mm sin clips ni suturas; mínima difusión térmica	Consumible costoso
Energía ultrasónica (Harmonic, Sonicision)	Cuchilla que vibra a ~55 kHz con excursión de 50–100 µm; el calor proviene de fricción mecánica, no de corriente eléctrica	No circula corriente por el paciente; sin humo eléctrico; temperaturas menores (~50–100 °C)	Corte más lento; la hoja queda caliente varios segundos tras el uso
Coagulación con plasma de argón (APC)	Chorro de argón ionizado que conduce la corriente monopolar al tejido sin contacto	Hemostasia superficial de grandes áreas; no se adhiere al tejido	⚠️ Riesgo de embolia gaseosa; requiere control de flujo
Bisturí armónico híbrido / multienergía	Combina bipolar avanzado y ultrasónico en un solo instrumento	Versatilidad	Costo alto
Radiofrecuencia de baja temperatura (coblation)	Plasma a ~40–70 °C que disocia enlaces moleculares	Mínimo daño térmico	Aplicaciones específicas (ORL, artroscopía)

🎙️ Punto clave para tus estudiantes: la energía ultrasónica no es electrocirugía — es un transductor piezoeléctrico. No requiere electrodo neutro y es la alternativa preferente en pacientes con dispositivos cardíacos implantados.

🏭 MARCAS Y COMPARATIVA
LÁMINA 4.15 — Principales fabricantes
Fabricante	Origen	Plataformas representativas	Notas
Medtronic (Valleylab / Covidien)	🇺🇸	Valleylab FT10, FX8, Force Triad; LigaSure; sistema REM®	Líder de mercado; REM es su marca del CQM
Erbe Elektromedizin	🇩🇪	VIO 3, VIO 300 D, APC 3, sistema NESSY	Referencia técnica; fuerte en endoscopía y APC
Ethicon / Johnson & Johnson	🇺🇸	Harmonic (ultrasónico), Enseal, Megadyne	Líder en energía ultrasónica
Olympus	🇯🇵	ESG-400, Thunderbeat (híbrido US+bipolar)	Fuerte en endoscopía/laparoscopía
ConMed	🇺🇸	System 5000, Beamer (APC), Altrus	Gama media-alta
KLS Martin	🇩🇪	maxium, maXium smart	Gama alta
Apyx Medical (Bovie)	🇺🇸	IDS-300/400, Bovie Ultimate	Gama media; marca histórica
Söring	🇩🇪	Ultrasónico y RF	Nicho
Mindray, Lepu, Shanghai Hutong	🇨🇳	Diversos	Gama de entrada-media; presencia creciente en la región

⚠️ Nota: verificar siempre el registro sanitario ante la Dirección Nacional de Farmacia y Drogas del MINSA y la disponibilidad de accesorios compatibles. En electrocirugía, el costo del consumible domina el costo total de propiedad — un generador barato con lápices y placas caros o de importación difícil es una mala compra.

LÁMINA 4.16 — Criterios de especificación técnica

Lo que debe exigirse en una ficha técnica de compra:

✅ Conformidad declarada con IEC 60601-2-2 (indicar edición: 6.ª ed. 2017 + AMD1:2023).
✅ Frecuencia de operación (kHz) y estabilidad.
✅ Potencia máxima de salida por modo (corte, blend, coag, bipolar) y curva potencia vs impedancia.
✅ Voltaje pico máximo por modo y factor de cresta.
✅ Salida aislada (no referida a tierra) — obligatorio.
✅ Sistema CQM con electrodo neutro dividido, con alarma audible y corte automático de salida.
✅ Modos bipolar con autostart y autostop.
✅ Modo de sellado de vasos con diámetro máximo declarado (si aplica).
✅ Interfaz de pedal y de lápiz con botones; compatibilidad de conectores.
✅ Alarmas audibles con volumen mínimo no anulable y tono distintivo por modo (requisito de la norma).
✅ Compatibilidad con evacuador de humo (integrado o externo).
✅ Costo y disponibilidad local del consumible (lápices, placas, pinzas bipolares) — pedir cotización de 1 año de consumo.
✅ Disponibilidad de manual de servicio y de software de calibración.
🔧 MANTENIMIENTO PREVENTIVO
LÁMINA 4.17 — Protocolo de mantenimiento preventivo
Frecuencia	Actividad	Responsable
Antes de cada uso	Autotest al encender; verificar integridad de cables, lápiz y pedal; verificar que las alarmas suenan; confirmar CQM activo al colocar la placa	Enfermería / usuario
Diaria	Limpieza externa; inspección de conectores (pines doblados, quemados); verificación del soporte aislante del lápiz	Usuario
Mensual	Inspección de cables (aislamiento, dobleces, tirones en el prensacables); revisión del pedal (ingreso de líquidos); limpieza de rejillas de ventilación	Biomédico
Trimestral	Prueba funcional de alarmas y del CQM (simulación de despegue de placa); verificación del corte automático de salida	Biomédico
Semestral / Anual	🔬 Verificación con analizador de electrocirugía: potencia de salida en cada modo contra carga resistiva patrón, corriente de fuga de alta frecuencia, prueba del CQM, tiempo de respuesta. Más pruebas de seguridad eléctrica IEC 62353	Biomédico
Anual	Calibración según OEM; reemplazo de fusibles y filtros; actualización de firmware; verificación de la puesta a tierra del chasis	Biomédico / OEM

🔬 Verificación con analizador de electrocirugía — lo esencial:

Prueba	Qué se mide	Criterio típico
Potencia de salida	P entregada a cargas patrón (p. ej. 100, 300, 500, 1000 Ω) en cada modo	Desviación ≤ ±20 % del valor indicado en el panel (verificar criterio del fabricante)
Curva P vs R	Comportamiento de la potencia al variar la impedancia	Debe seguir la curva declarada por el fabricante
Corriente de fuga de alta frecuencia	Corriente de RF a tierra	Según límites de IEC 60601-2-2
Prueba de CQM/REM	Impedancia a la que el equipo alarma e inhibe la salida	Debe inhibir dentro del rango declarado
Seguridad eléctrica (IEC 62353)	Resistencia del conductor de tierra, corriente de fuga del equipo y de la parte aplicada	Según categoría del equipo

📌 Sin analizador de electrocirugía no hay mantenimiento preventivo real de una ESU — solo hay limpieza. Este es un argumento sólido cuando tus estudiantes tengan que justificar la compra de instrumentación para un departamento de biomédica.

🧼 ASEPSIA Y LIMPIEZA
LÁMINA 4.18 — Limpieza, desinfección y reprocesamiento
Componente	Categoría (Spaulding)	Procesamiento
Lápiz/mango activo y punta	Crítico (entra al campo estéril)	Desechable estéril (preferente) o esterilización por autoclave si es reutilizable
Pinza bipolar	Crítico	Limpieza + esterilización validada; inspección del aislamiento
Electrodo neutro (placa adhesiva)	Semicrítico	Un solo uso, siempre. Nunca reutilizar ni recortar
Cable del electrodo neutro	Semicrítico	Desinfección de nivel intermedio; reutilizable con inspección
Generador, pedal, carro	No crítico	Desinfección de nivel bajo/intermedio; limpieza terminal
Manguera de evacuación de humo y filtro	Contaminado	Desechable; disponer como residuo biopeligroso

Puntos críticos:

⚠️ La punta activa carbonizada (escara) aumenta la impedancia y obliga al cirujano a subir la potencia → mayor voltaje → mayor riesgo. Limpiar la punta durante la cirugía con una almohadilla abrasiva estéril, nunca con bisturí ni gasa seca.
❌ Nunca recortar un electrodo neutro para "ajustarlo": reduce el área → aumenta J → quemadura.
❌ Nunca reutilizar una placa adhesiva: el gel conductor pierde propiedades y el contacto se vuelve irregular.
❌ No sumergir el pedal si no es sumergible (verificar grado IP).
⚠️ La inspección del aislamiento de instrumentos laparoscópicos es parte del reprocesamiento: microfisuras invisibles causan quemaduras. Existen probadores de aislamiento específicos.
⚠️ FALLAS Y DAÑOS COMUNES
LÁMINA 4.19 — Tabla de diagnóstico
#	Síntoma	Causas probables	Acción del biomédico
1	Alarma de electrodo neutro persistente	Placa mal adherida, vencida o reutilizada; piel con vello/húmeda; cable dañado; conector sucio; placa no dividida usada en equipo con CQM	Cambiar placa antes de sospechar del equipo; probar con cable nuevo; verificar tipo de placa
2	No hay salida en ningún modo	Fusible; falla de la etapa de potencia; pedal desconectado; error de autotest	Verificar fusibles y pedal; leer código de error
3	Potencia insuficiente / "no corta"	Punta carbonizada; ajuste bajo; placa mal ubicada; degradación de la etapa de potencia; cable en mal estado	Medir con analizador antes de calibrar; comparar contra carga patrón
4	Se activa sola (salida involuntaria)	Pedal con líquido dentro; botón del lápiz pegado; falla del optoacoplador de activación	Retirar de servicio de inmediato — riesgo de quemadura y de incendio
5	Alarma sonora ausente o muy baja	Buzzer dañado; volumen bajado (⚠️ la norma exige un mínimo no anulable)	Reparar; documentar como no conformidad de seguridad
6	Chispas en el conector del lápiz	Pines sucios, quemados o flojos	Limpiar/reemplazar el conector; verificar par de apriete
7	Interferencia en el monitor de ECG/pulsioxímetro	Ruido de RF; cables entrelazados; filtros del monitor degradados; mala tierra	Separar físicamente cables de ESU y de monitorización; verificar tierra de ambos equipos
8	Quemadura reportada en sitio remoto	Vía alterna de retorno (equipo antiguo aterrizado); contacto piel-metal; contacto piel-piel	Investigación de evento adverso: retirar el equipo, preservar accesorios, verificar aislamiento de salida y CQM
9	El generador se apaga durante el uso	Sobrecalentamiento (ventilación obstruida); protección por sobrecorriente; fuente conmutada degradada	Limpiar rejillas y ventilador; medir temperatura interna
10	Bipolar sin efecto	Pinza con puntas desalineadas o sucias; cable bipolar roto; umbral de autostart mal ajustado	Probar con pinza y cable de repuesto; verificar continuidad
11	Códigos de error recurrentes	Falla intermitente de placa de control o de sensores	Descargar el log de errores; escalar a OEM con evidencia
🛡️ RIESGOS
LÁMINA 4.20 — Riesgos para el PACIENTE (1): quemaduras

Cinco mecanismos de quemadura — hay que conocerlos todos:

Mecanismo	Cómo ocurre	Prevención
1. Bajo el electrodo neutro	Contacto parcial → toda la corriente se concentra en el área remanente → ↑ J → quemadura	Placa dividida con CQM; colocación correcta; nunca recortar
2. Vía alterna a tierra	En equipos con salida aterrizada, la corriente retorna por cualquier objeto aterrizado en contacto con el paciente	Salida aislada; el paciente no debe entrar en contacto con partes metálicas puestas a tierra o con capacitancia apreciable a tierra, como los soportes de la mesa quirúrgica 
iTech

3. Contacto piel-piel	La corriente cruza entre dos superficies corporales en contacto (brazo-tórax, muslo-muslo) → densidad de corriente alta en un punto pequeño	Debe evitarse el contacto piel con piel, por ejemplo mediante la interposición de gasa seca 
iTech

4. Acoplamiento capacitivo (laparoscopía)	A 500 kHz, un electrodo activo dentro de una cánula metálica forma un capacitor; la energía se acopla a la cánula. Si la cánula está en un anclaje plástico, la carga se descarga en un punto del intestino → quemadura fuera del campo visual	Evitar sistemas híbridos metal/plástico; usar la mínima potencia y modo corte (menor voltaje) en lugar de coag; usar sistemas de monitorización de electrodo activo (AEM)
5. Falla de aislamiento del instrumento	Microfisura en el aislante del instrumento laparoscópico → arco a órgano adyacente, no visible en la cámara	Prueba de aislamiento en cada reprocesamiento; retirar instrumentos con aislamiento dudoso

⚠️ Nota sobre monitorización simultánea: cuando se usan simultáneamente equipo quirúrgico de alta frecuencia y equipo de monitorización fisiológica en el mismo paciente, los electrodos de monitorización deben colocarse lo más lejos posible de los electrodos quirúrgicos. No se recomiendan electrodos de aguja para monitorización. En todos los casos se recomiendan sistemas de monitorización que incorporen dispositivos limitadores de corriente de alta frecuencia. 
iTech

LÁMINA 4.21 — Riesgos para el PACIENTE (2): incendio, implantes y humo

A. INCENDIO QUIRÚRGICO — el triángulo del fuego

Vértice	En el quirófano	Control
Fuente de ignición	ESU (la causa más frecuente), láser, fuente de luz de fibra óptica	Colocar el lápiz en su funda aislante al no usarlo; usar mínima potencia; nunca activar cerca de material inflamable
Comburente	O₂ y N₂O (atmósfera enriquecida bajo los campos)	FiO₂ ≤ 30 % siempre que sea posible; evacuar acumulaciones bajo los paños; pausa de 1 min tras bajar el O₂ antes de activar la ESU
Combustible	Antisépticos alcohólicos, campos textiles, tubo endotraqueal, gases intestinales, cabello	Dejar secar completamente el antiséptico alcohólico; evitar acumulación en pliegues; humedecer gasas

⚠️ Zona de máximo riesgo: cirugía de cabeza, cuello y vía aérea con oxígeno suplementario por cánula o mascarilla.

B. DISPOSITIVOS CARDÍACOS IMPLANTADOS (marcapasos / DAI)

La corriente de RF puede ser interpretada como actividad cardíaca o dañar el generador:

Inhibición del marcapasos en pacientes dependientes → asistolia.
Descarga inapropiada del DAI al interpretar el ruido como fibrilación.
Reprogramación o daño permanente del dispositivo.

Medidas:

✅ Preferir bipolar o ultrasónico.
✅ Si es imprescindible el monopolar: potencia mínima, ráfagas cortas (< 5 s) con pausas.
✅ Ubicar el electrodo neutro de modo que la línea electrodo activo–electrodo neutro NO cruce el generador ni los cables del implante.
✅ Coordinar con cardiología: reprogramación a modo asincrónico o desactivación de terapias del DAI, con monitorización continua y desfibrilador externo disponible.
✅ Reevaluar el dispositivo al terminar la cirugía.

C. HUMO QUIRÚRGICO

Subproducto gaseoso generado durante procedimientos como diatermia, electrocauterización, ablación con láser, electrocirugía, escisión ultrasónica y el taladrado o aserrado de alta velocidad. 
Redalyc

Estudios de campo han mostrado un aumento aproximadamente de diez veces en la cantidad de partículas finas (< 1 µm) producidas durante la electrocirugía, y la producción de cantidades significativas de carcinógenos e irritantes conocidos entre los compuestos orgánicos volátiles. 
SciELO
⚠️ Puede contener virus viables (VPH documentado), material celular y bacterias.
La forma más eficaz de prevenir la exposición es capturar el humo en el punto de origen con dispositivos adecuados de evacuación, complementados con EPI. 
Fundacionfenin
LÁMINA 4.22 — Riesgos para el PERSONAL y evacuación de humo

Exposición del personal al humo quirúrgico:

Síntomas reportados en estudios de personal de quirófano: cefalea (enfermeras 48,9 %, médicos 58,3 %), irritación ocular (40,0 % y 41,7 %), tos (48,9 % y 27,8 %), dolor de garganta y náuseas. 
SciELO
En un estudio, el 50 % de las enfermeras presentó irritación de garganta tras las electrocirugías y el 62,7 % refirió que sus familiares notaban el olor a humo de la cirugía al regresar a casa. 
SciELO
⚠️ La mascarilla quirúrgica estándar es ineficaz contra muchas partículas ultrafinas. 
Fundacionfenin

Tendencia normativa internacional: en EE. UU., varios estados —15 según AORN, equivalente al 28 % del país— han aprobado leyes estatales que obligan a evacuar el humo durante los procedimientos quirúrgicos, con entradas en vigor entre 2018 y 2025. El 25 de agosto de 2025, Delaware se convirtió en el vigésimo estado en promulgar legislación de evacuación de humo quirúrgico. 
Fundacionfenin
AORN

Riesgos específicos del ingeniero biomédico:

Riesgo	Fuente	Control
Eléctrico / RF	Trabajo en la etapa de potencia; alta tensión (hasta 9 kV pico); condensadores cargados	LOTO; descargar capacitores; nunca probar salida sin carga patrón
Quemadura por RF	Activación accidental durante pruebas	Usar analizador con carga; señalizar el área; retirar accesorios del alcance
Exposición a humo	Pruebas funcionales con tejido de prueba; presencia en quirófano	Evacuador de humo; respirador N95 o superior, no mascarilla quirúrgica
Biológico	Manipulación de cables, pedales y accesorios contaminados	Recibir el equipo descontaminado; EPP; superficie de trabajo delimitada
Interferencia electromagnética	La ESU es una fuente potente de EMI	Verificar EMC (IEC 60601-1-2); no colocar cables sobre otros equipos