TEMA 3 — LÁMPARA QUIRÚRGICA
Contenido listo para copiar y pegar
LÁMINA 3.1 — Portada

MÓDULO N°1 — EQUIPOS DE SALÓN DE OPERACIONES
Tema 3: Lámpara Quirúrgica (Luminaria Quirúrgica)

Equipos Médicos I — Código 5827
Ing. Bryan Rodríguez S. | UDELAS

LÁMINA 3.2 — Objetivos de aprendizaje

Al finalizar este tema, el estudiante será capaz de:

Explicar el principio óptico de la dilución de sombras y la formación del campo luminoso.
Interpretar y verificar los parámetros fotométricos exigidos por la norma IEC 60601-2-41.
Comparar tecnologías de fuente luminosa (halógena, fibra óptica, LED) con criterio técnico y económico.
Ejecutar el mantenimiento preventivo de una lámpara cielítica, incluyendo la suspensión mecánica.
Diagnosticar fallas eléctricas, ópticas y mecánicas.
Identificar los riesgos térmicos y fotobiológicos para el paciente, y los riesgos mecánicos para el técnico.
LÁMINA 3.3 — Definición y función

Lámpara quirúrgica (luminaria quirúrgica): equipo electromédico de iluminación diseñado para producir un campo luminoso de alta intensidad, dirigido, con mínima generación de calor y sin sombras proyectadas, que permite al equipo quirúrgico distinguir estructuras anatómicas y sus colores reales en el interior de una cavidad, sin producir fatiga visual ni daño térmico al tejido expuesto.

El problema técnico que debe resolver (cuatro exigencias en conflicto):

Exigencia	Conflicto que genera
Alta intensidad luminosa (hasta 160 000 lux)	↑ Energía radiante → ↑ calor sobre el tejido y sobre el cirujano
Sin sombras, pese a manos, cabezas e instrumental	Requiere múltiples fuentes desde distintos ángulos → ↑ tamaño y peso
Color fiel del tejido (distinguir arteria/vena/nervio/tumor)	Requiere alto índice de reproducción cromática, no solo brillo
Profundidad en cavidad estrecha	Requiere haz muy colimado, opuesto a la dilución de sombras

🎙️ Nota del docente: toda la ingeniería de una lámpara quirúrgica consiste en balancear estas cuatro exigencias contradictorias. Ese es el mensaje central del tema.

LÁMINA 3.4 — Evolución histórica
Época	Solución de iluminación	Limitación
Hasta 1880	Luz solar: quirófanos con grandes ventanales orientados al norte y anfiteatros con cúpula de vidrio	Dependiente del clima y de la hora; cirugías programadas al mediodía
1880–1900	Lámparas de gas y luz eléctrica incandescente general	Muy poca intensidad; sombras severas; calor
~1910–1930	Primeras lámparas con reflector parabólico montadas sobre pedestal	Sombras marcadas; calor intenso sobre el campo
1940–1960	Lámpara cielítica multireflector "sin sombra"; se difunde el concepto de dilución de sombras	Bombillas incandescentes de vida corta; alta emisión infrarroja
1960–1990	Lámpara halógena con reflector dicroico (filtro de infrarrojo)	Vida útil 500–1500 h; el reflector envejece; alto consumo
1990–2005	Fibra óptica: fuente remota + guía de luz	Costo, fragilidad de la fibra, pérdida por envejecimiento
2005–hoy	LED de alta potencia	Estándar actual
2015–hoy	Lámparas inteligentes: gestión automática de sombras, control de luminancia, cámara integrada, CCT ajustable	Costo, complejidad, dependencia de software
⚙️ PRINCIPIO DE FUNCIONAMIENTO
LÁMINA 3.5 — Dilución de sombras: el principio óptico central

Problema: cualquier obstáculo entre la fuente y el campo (mano, cabeza, separador) proyecta una sombra.

Solución: múltiples fuentes desde ángulos distintos.

Una fuente puntual única → sombra total (umbra) perfectamente definida.
Múltiples fuentes distribuidas en la cúpula → cada obstáculo bloquea solo algunas fuentes; el resto sigue iluminando la zona → la sombra se convierte en penumbra de baja densidad.
Dilución de sombras (shadow dilution): porcentaje de iluminancia que se conserva en el centro del campo cuando se obstruye parcialmente el haz. Cuanto mayor, mejor.

Dos arquitecturas ópticas:

Arquitectura	Cómo funciona	Uso
Multireflector	Una o varias lámparas con un reflector segmentado en múltiples facetas; cada faceta redirige luz al mismo punto focal desde un ángulo distinto	Clásica en lámparas halógenas
Multi-LED (multifuente)	Decenas o cientos de LED individuales, cada uno con su lente/colimador, todos apuntando al mismo punto focal	Estándar actual

Consecuencia práctica: cuando un LED individual o un segmento se apaga, la lámpara sigue iluminando pero se degrada la dilución de sombras y baja la iluminancia central. Por eso una lámpara con LEDs quemados "que todavía alumbra" no está apta: perdió su desempeño esencial.

LÁMINA 3.6 — Parámetros fotométricos normados (IEC 60601-2-41)

La norma IEC 60601-2-41:2021 (Edición 3) establece los requisitos particulares para la seguridad básica y el desempeño esencial de las luminarias quirúrgicas y de diagnóstico, con criterios estrictos de calidad de iluminación, seguridad térmica y confiabilidad mecánica. 
Getinge

Parámetro	Símbolo	Definición	Valor de referencia
Iluminancia central	Ec	Iluminancia medida a 1000 mm de distancia desde el área emisora, en el centro del campo luminoso, sin obstrucción del haz 
LISUN
	Entre 40 000 y 160 000 lux 
uspto

Diámetro del campo d₅₀	d₅₀	Diámetro del campo luminoso alrededor del centro, hasta donde la iluminancia cae al 50 % de Ec (promedio de cuatro cortes transversales) 
Frankshospitalworkshop
	Típico 15–30 cm (ajustable)
Diámetro del campo d₁₀	d₁₀	Diámetro hasta donde la iluminancia cae al 10 % de Ec	—
Uniformidad del haz	d₅₀/d₁₀	Razón entre ambos diámetros; a mayor valor, más nítido es el borde del campo iluminado 
uspto
	d₅₀ debe ser al menos el 50 % de d₁₀ 
uspto

Profundidad de iluminación	L₁ + L₂	Rango de trabajo alrededor de los 1000 mm en el que la iluminancia alcanza al menos el 60 % de Ec 
LISUN
	Típico 60–140 cm
Índice de reproducción cromática	Ra (CRI)	Fidelidad con que se reproducen los colores respecto a una fuente de referencia	Entre 85 y 100 
uspto
 (moderno: ≥ 95)
Índice R9 (rojo saturado)	R9	Fidelidad específica del rojo — crítico para distinguir tejidos y sangrados	≥ 90 deseable
Temperatura de color correlacionada	CCT	Tonalidad de la luz blanca	3 000 – 5 000 K (ajustable en gama alta)
Irradiancia total	Ee	Potencia radiante total (visible + no visible) por unidad de área	Debe ser inferior a 1000 W/m² 
Pacific Northwest National Laboratory

Razón irradiancia/iluminancia	Ee/Ec	Medida indirecta de la carga térmica por lux entregado	No puede exceder 6 mW/(m²·lx) 
Pacific Northwest National Laboratory

Radiación UV	—	La norma restringe la emisión UV, permitiendo solo UVA limitada cerca de los 400 nm 
iTech
	Prácticamente nula

⚠️ Riesgo por superposición de campos: la norma recomienda informar al personal quirúrgico sobre los riesgos asociados a la superposición de campos luminosos cuando la irradiancia supera los 700 W/m². Con dos o tres domos apuntando al mismo punto, las irradiancias se suman. 
Getinge

📌 El parámetro que casi nadie mira y es el más importante: Ee/Ec. Traduce "cuánto calor cuesta cada lux". Es el número que separa una lámpara LED buena de una barata: ambas pueden dar 130 000 lux, pero con carga térmica muy distinta sobre el tejido.

LÁMINA 3.7 — Tecnologías de fuente luminosa
Característica	Incandescente / Halógena	Fibra óptica	LED
Principio	Filamento de tungsteno incandescente	Fuente remota + guía de luz	Electroluminiscencia en unión p-n semiconductora
Eficacia luminosa	~15–25 lm/W	Baja (pérdidas en la guía)	80–150 lm/W
Vida útil	500–1 500 h	500–1 000 h (fuente)	Más de 60 000 h 
Getinge

Emisión infrarroja	Muy alta (~85 % de la energía)	Baja (IR filtrado en la fuente)	Muy baja
Carga térmica sobre el campo	Alta — requiere filtro dicroico	Baja	Mínima
CRI (Ra)	Excelente (~99)	Bueno	Fijado en 95 
Getinge
 en gama alta
CCT ajustable	No	No	Sí
Consumo típico	300–500 W por domo	250–400 W	40–120 W por domo
Encendido	Inmediato, pero con derating térmico	Inmediato	Inmediato, sin degradación por ciclado
Costo inicial	Bajo	Alto	Medio-alto
Costo de operación	Alto (lámparas + energía + A/C)	Alto	Bajo
Falla típica	Filamento quemado	Rotura de fibra	Degradación del driver o del disipador

Por qué el LED desplazó todo lo demás:

Elimina el infrarrojo → menos desecación del tejido expuesto y menos calor sobre el cirujano.
Vida útil 40–100 veces mayor → desaparece el cambio de bombilla, la falla más frecuente del servicio.
Menor consumo → menor carga sobre el sistema de aire acondicionado del quirófano (efecto en cascada sobre costos).
Permite control electrónico: intensidad, diámetro de campo, temperatura de color y compensación de sombras.
LÁMINA 3.8 — El LED en detalle: lo que el biomédico debe entender

Principio físico: al polarizar directamente una unión p-n de un semiconductor de banda prohibida ancha (InGaN, AlInGaP), los electrones se recombinan con huecos emitiendo fotones de energía E = hν ≈ Eg. La longitud de onda depende del material, no de la temperatura.

Cómo se obtiene la luz blanca:

LED azul + fósforo amarillo (YAG:Ce) — el método dominante. Económico, pero con "hueco" en el rojo → R9 bajo si no se corrige.
LED azul + fósforos múltiples (verde + rojo) — mejor CRI y R9. Es lo que usan las lámparas quirúrgicas de calidad.
RGB o multicanal — permite ajustar la CCT electrónicamente.

Los tres subsistemas que realmente fallan (no el LED):

Subsistema	Función	Modo de falla
Driver de corriente constante	El LED se controla por corriente, no por voltaje (relación I-V exponencial)	Falla de condensadores electrolíticos, sobrecalentamiento → parpadeo o apagado
Gestión térmica (disipador + PCB metálico)	La unión debe mantenerse típicamente por debajo de 85–120 °C	Suciedad en el disipador, pasta térmica degradada → caída de flujo y desplazamiento de color
Compensación de flujo	Los LED pueden perder hasta un 20 % de intensidad tras solo dos horas de uso; el programa de estabilidad de flujo aumenta la corriente mediante electrónica inteligente para mantener una iluminación constante durante todo el procedimiento 
Getinge
	Sin esta función, la iluminancia decae durante la cirugía

Regla de oro: la vida útil de un LED la determina su temperatura de unión. Un disipador sucio no "ensucia la luz": acorta la vida del LED y desplaza la temperatura de color. Por eso la limpieza del disipador es una tarea de mantenimiento, no de estética.

LÁMINA 3.9 — Estructura mecánica y suspensión

Componentes del sistema de suspensión cielítico:

Placa/tubo de anclaje al techo estructural — debe fijarse a la losa, nunca al cielo falso.
Eje central rotatorio con anillos colectores (slip rings) que permiten giro de 360° sin torcer los cables.
Brazo horizontal (extensión) — define el alcance sobre la mesa.
Brazo de resorte / brazo de equilibrio (spring arm) — permite el ajuste vertical y mantiene la posición sin deriva.
Horquilla o cardán — orientación del domo.
Frenos por fricción ajustables en cada eje.
Domo (cúpula) con la manija central estéril.

⚠️ ADVERTENCIA DE SEGURIDAD CRÍTICA: el brazo de resorte contiene un resorte de gas o helicoidal fuertemente precargado que almacena energía mecánica considerable. Desmontarlo sin seguir el procedimiento del fabricante y sin la herramienta de bloqueo puede causar una liberación violenta con lesión grave o amputación. Esta es la principal causa de accidentes ocupacionales en el mantenimiento de lámparas quirúrgicas.

Configuraciones:

Cielítica de un domo — quirófanos de nivel I o salas de procedimientos.
Cielítica de dos domos (mayor + satélite) — configuración estándar de quirófano general.
Tres domos o domo + brazo de cámara + brazo de monitor — alta especialización.
Móvil rodable — respaldo, emergencias, salas de parto, ambulatorio.
De pared o de pedestal — consultorios y salas de curación.
LÁMINA 3.10 — Sistema eléctrico y protección contra fallas
Alimentación típica: 100–240 VAC → fuente conmutada → 24 VDC o 48 VDC hacia el domo (tensión de seguridad).
Conexión obligatoria al sistema eléctrico esencial del hospital (transferencia a generador ≤ 10 s).
Muchos modelos incluyen batería de respaldo interna para operar 1–3 h ante corte total.
Requisito de tolerancia a fallo (fail-safe) de la norma: una luminaria individual sin protección contra la interrupción de la luz en condición de primer defecto no es a prueba de fallos; una lámpara con dos luminarias menores con transformadores, fusibles, cableado y anillos colectores separados sí lo sería. Ejemplos de condición de primer defecto: rotura de un cable interno, falla del anillo colector, de un fusible, de una lámpara o del aislamiento, falla del dispositivo electrónico, o desconexión de los cables de alimentación. 
Getinge

📌 Traducción de diseño: por eso las lámparas quirúrgicas serias tienen el domo dividido en dos o más circuitos independientes. Si falla uno, la mitad de los LED sigue encendida. Es un requisito normativo, no un lujo.

LÁMINA 3.11 — Funcionalidades avanzadas (gama alta)
Función	Qué hace	Ejemplo comercial
Compensación automática de sombras	Compensa automáticamente las obstrucciones aportando luz adicional desde los LED no enmascarados 
Getinge
	AIM — Automatic Illumination Management (Getinge/Maquet)
Gestión de luminancia	Mantiene la agudeza visual óptima ajustando automáticamente la luminancia ante tejidos claros u oscuros, y mantiene los niveles de seguridad de irradiancia incluso con dos lámparas superpuestas 
Getinge
	LMD — Luminance Management Device (Getinge/Maquet)
Guía láser de posicionamiento	Permite colocar fácilmente la cúpula a la distancia y en el lugar adecuados. 
Getinge
 ⚠️ Láser de clase II: la exposición ocular prolongada puede provocar lesiones; no dirigir el haz a los ojos del paciente sin protección 
Getinge
	Maquet PowerLED II
CCT ajustable	Permite cambiar entre luz cálida (3500 K) y fría (5000 K) según especialidad y preferencia	Múltiples fabricantes
Modo endoscópico / "luz verde"	Reduce drásticamente la iluminancia ambiental para no lavar la imagen del monitor laparoscópico	Casi todos los modelos LED modernos
Cámara integrada en el domo	Grabación y transmisión del campo quirúrgico (docencia, telemedicina)	Getinge, Dräger, Steris, Skytron
Recubrimiento antibacteriano	Recubrimiento en superficies de alto contacto como pantallas táctiles, teclados y asas externas, para reducir el riesgo de contaminación cruzada 
Getinge
	Maquet PowerLED II
🏭 MARCAS Y COMPARATIVA
LÁMINA 3.12 — Principales fabricantes

Entre las empresas que participan en el comité técnico de la norma IEC se encuentran: Steris (EE. UU.), Getinge (Suecia), Berchtold/Stryker (Alemania/EE. UU.), KLS Martin (Alemania), Rimsa (Italia), Brandon (Reino Unido), Dräger (Alemania) y Skylux (Japón). 
Getinge

Fabricante	Origen	Líneas representativas	Posicionamiento
Getinge / Maquet	🇸🇪🇫🇷	PowerLED II, Volista, Lucea, HLED	Gama alta; referencia en AIM/LMD
Dräger	🇩🇪	Polaris (100 / 200 / 600 / 700)	Gama media-alta; integración con brazos pendulares
Stryker (Berchtold)	🇺🇸🇩🇪	Chromophare F-Generation	Gama alta
Steris	🇺🇸	Harmony LED, Amsco	Gama alta; fuerte en integración de quirófano
Skytron	🇺🇸	Aurora, Stellar	Gama media-alta
KLS Martin	🇩🇪	marLED serie E/V/X	Gama alta
Trumpf Medical (Baxter/Hillrom)	🇩🇪	TruLight serie 3000/5000	Gama alta
Mindray	🇨🇳	HyLED serie 6/7/9	Gama media; muy presente en Latinoamérica
Amico	🇨🇦	Bender, Flex LED	Gama de entrada-media
Fabricantes asiáticos varios	🇨🇳	Múltiples	Gama de entrada

⚠️ Advertencia para tus estudiantes: en el segmento de gama de entrada abundan lámparas que declaran 160 000 lux sin declarar Ee/Ec, CRI, R9 ni dilución de sombras. Una ficha técnica que solo indica lux es una señal de alerta.

LÁMINA 3.13 — Criterios para especificar una lámpara quirúrgica

Lo que SIEMPRE debe exigirse en una ficha técnica de compra:

✅ Declaración de conformidad con IEC 60601-2-41 (edición y fecha).
✅ Iluminancia central Ec a 1 m, con rango de regulación.
✅ d₅₀ y d₁₀ y su razón; diámetro de campo ajustable con rango declarado.
✅ Profundidad de iluminación (L₁ + L₂) al 60 % de Ec.
✅ Ra (CRI) y R9 declarados por separado.
✅ CCT y si es ajustable.
✅ Irradiancia total Ee y razón Ee/Ec.
✅ Dilución de sombras con una y dos obstrucciones, y con la manija instalada.
✅ Vida útil declarada de los LED (horas al 70 % del flujo inicial, L70).
✅ Configuración a prueba de fallo (circuitos independientes) y respaldo por batería.
✅ Tipo y cantidad de manijas esterilizables incluidas; método de esterilización admitido.
✅ Altura mínima de techo requerida y tipo de anclaje estructural.
✅ Disponibilidad de repuestos y servicio técnico en Panamá, con tiempo de respuesta comprometido.
✅ Registro sanitario vigente ante la Dirección Nacional de Farmacia y Drogas (MINSA).
🔧 MANTENIMIENTO PREVENTIVO
LÁMINA 3.14 — Protocolo de mantenimiento preventivo
Frecuencia	Actividad	Responsable
Diaria / por caso	Limpieza de la cúpula y la manija; verificación de encendido de todos los módulos; prueba de movilidad y frenos	Enfermería / usuario
Semanal	Inspección visual de cables visibles, panel de control y manijas; verificación de que no haya deriva del brazo (que el domo no "caiga" solo)	Usuario / Biomédico
Mensual	Limpieza del disipador y rejillas de ventilación; verificación de LEDs apagados o de color desviado; prueba del modo de emergencia/batería; revisión de tornillería accesible	Biomédico
Trimestral	Ajuste de frenos de fricción en todos los ejes; verificación de torque de la tornillería estructural; inspección de los anillos colectores (arco eléctrico, desgaste); prueba de rotación 360°	Biomédico
Semestral	Medición de iluminancia central con luxómetro calibrado a 1 m y comparación con el valor de fábrica; verificación de la fuente/driver; prueba de seguridad eléctrica IEC 62353 (resistencia de tierra de protección, corriente de fuga del equipo)	Biomédico
Anual	Inspección estructural completa del anclaje al techo; verificación del brazo de resorte según procedimiento OEM; reemplazo de manijas desgastadas; actualización de firmware; recalibración del sistema	Biomédico certificado / OEM
Según OEM	Reemplazo del resorte de gas del brazo de equilibrio; reemplazo del módulo LED por degradación (L70)	OEM

Herramientas mínimas: luxómetro calibrado (con certificado vigente), cinta métrica, analizador de seguridad eléctrica, llaves dinamométricas, termómetro infrarrojo (para verificar temperatura del disipador).

📌 Criterio de aceptación práctico: si la iluminancia central medida cae por debajo del 70 % del valor nominal de fábrica, o si más del 10 % de los módulos LED están apagados, la lámpara no cumple su desempeño esencial y debe intervenirse.

🧼 ASEPSIA Y LIMPIEZA
LÁMINA 3.15 — Limpieza, desinfección y esterilización

Clasificación de Spaulding aplicada:

Componente	Categoría	Procesamiento
Manija central estéril (desmontable)	Semicrítico/crítico — la toca el cirujano con guantes estériles	Esterilización (autoclave a 134 °C) o manija desechable estéril por caso
Cúpula, carcasa, brazos, panel de control	No crítico	Desinfección de nivel bajo/intermedio entre casos y limpieza terminal
Cristal/lente frontal	No crítico	Paño suave con desinfectante compatible; nunca abrasivos

Reglas operativas:

La manija estéril se retira, procesa y reinstala en cada procedimiento. Es el punto de mayor riesgo de contaminación cruzada de la lámpara.
⚠️ Atención al material: algunas manijas están fabricadas con material poroso — lo que exige un método de procesamiento específico. Los detergentes enzimáticos pueden deteriorar el material y no deben usarse en remojos prolongados; deben eliminarse por enjuague. 
Getinge
Getinge
No utilizar métodos de desinfección por fumigación. 
Getinge
Secar siempre: limpiar con un paño limpio sin pelusa. 
Getinge

Impacto en el flujo de aire — dato poco conocido:
La lámpara quirúrgica se ubica directamente bajo el difusor de flujo unidireccional. Su cúpula constituye un obstáculo que:

Genera turbulencia y estelas en el flujo descendente.
Puede crear una zona de recirculación sobre el campo quirúrgico.
Acumula polvo en su superficie superior que puede desprenderse.

Por eso: la limpieza de la cara superior de la cúpula es parte del protocolo de limpieza terminal del quirófano, y el diseño moderno favorece cúpulas delgadas, aerodinámicas y de superficie curva lisa — una superficie curva para facilitar la limpieza y un diseño estrecho que permite su colocación en un quirófano concurrido. 
Getinge

⚠️ FALLAS Y DAÑOS COMUNES
LÁMINA 3.16 — Tabla de diagnóstico
#	Síntoma	Causas probables	Acción del biomédico
1	La lámpara no enciende	Breaker disparado; fusible; fuente conmutada dañada; cable de alimentación desconectado en el eje	Verificar tensión de entrada y de salida de la fuente; revisar fusibles antes que la electrónica
2	Parpadeo o intensidad inestable	Driver de corriente constante fallando (condensadores); anillo colector sucio o desgastado; conexión floja	Limpiar/reemplazar slip rings; medir rizado en la salida del driver
3	Se apaga sola después de varios minutos	Sobrecalentamiento: disipador obstruido, ventilador detenido, pasta térmica degradada; protección térmica actuando	Limpiar disipador; medir temperatura con IR; verificar ventilación
4	Iluminancia por debajo del nominal	Degradación normal de LED (L70); módulos apagados; cristal opaco o rayado; driver limitando corriente	Medir con luxómetro; contar módulos apagados; evaluar reemplazo de módulo
5	Zonas oscuras / sombras marcadas	Grupo de LEDs apagado o segmento del reflector deteriorado	Inspección con la lámpara al 100 %; reemplazo del módulo afectado
6	Cambio de tonalidad (luz azulada o amarillenta)	Envejecimiento diferencial de los fósforos; sobrecalentamiento crónico; mezcla de módulos de lotes distintos	Verificar CCT; reemplazar módulos por lote completo, no unitariamente
7	El domo "cae" solo o no se mantiene en posición	Resorte del brazo de equilibrio fatigado; frenos de fricción desajustados	⚠️ Ajuste de frenos según OEM. El resorte solo lo interviene personal capacitado con la herramienta de bloqueo
8	Movimiento duro o con chirrido	Rodamientos secos o contaminados; frenos sobreajustados; suciedad en los ejes	Lubricar según especificación OEM (nunca con lubricantes genéricos que atraigan polvo)
9	Vibración u oscilación tras posicionar	Anclaje estructural flojo; brazo sobreextendido; balanceo mal ajustado	Verificar torque del anclaje al techo de inmediato — riesgo de caída
10	Panel de control no responde	Falla de la membrana/táctil por líquido derramado; cable plano desconectado; falla de la placa de control	Inspeccionar por ingreso de líquido; reemplazar teclado
11	No funciona el respaldo por batería	Batería agotada (vida típica 2–4 años); circuito de carga defectuoso	Reemplazo programado de batería con registro de fecha
12	Manija estéril no encaja o gira suelta	Desgaste del mecanismo de bayoneta por ciclos de autoclave	Reemplazo de la manija y/o del receptáculo
🛡️ RIESGOS
LÁMINA 3.17 — Riesgos para el PACIENTE
Riesgo	Mecanismo	Prevención
Quemadura o desecación tisular	Irradiancia elevada sostenida sobre tejido expuesto; superposición de dos o tres domos	Respetar Ee/Ec ≤ 6 mW/(m²·lx); usar la mínima intensidad necesaria; irrigar el tejido expuesto; alerta cuando se superan 700 W/m²
Lesión ocular por láser de posicionamiento	Guía láser clase II dirigida a los ojos	No dirigir el haz láser a los ojos del paciente sin protección; evitar exposición ocular prolongada 
Getinge

Lesión ocular / retiniana en cirugía oftálmica	Luz intensa directa sobre el ojo abierto	Filtros específicos; protocolos de intensidad reducida
Trauma por caída del domo o del brazo	Falla del anclaje estructural o del brazo	Verificación anual de torque y estado del anclaje; nunca fijar al cielo falso
Contaminación / infección	Manija no estéril; polvo desprendido de la cúpula; turbulencia del flujo de aire	Manija estéril por caso; limpieza de la cara superior; diseño aerodinámico
Error quirúrgico por mala reproducción cromática	CRI/R9 insuficiente → dificultad para distinguir tejido isquémico, planos o sangrado	Exigir Ra ≥ 95 y R9 alto; verificar CCT
Interrupción de la cirugía por apagón	Falla eléctrica sin respaldo	Conexión al sistema esencial + batería interna + diseño a prueba de fallo
LÁMINA 3.18 — Riesgos para el PERSONAL BIOMÉDICO
Riesgo	Fuente	Control
⚠️ Mecánico — energía almacenada	Resorte precargado del brazo de equilibrio. Su liberación descontrolada puede causar lesión grave	Nunca desmontar sin la herramienta de bloqueo y el procedimiento OEM. Capacitación obligatoria antes de intervenir
⚠️ Caída de altura	Trabajo sobre escalera o andamio en el anclaje del techo	Escalera certificada, dos personas, arnés cuando aplique, señalización del área
Golpe por caída de componente	Domo o brazo desprendido durante el desmontaje	Soportar el peso antes de liberar la fijación; delimitar el área bajo la lámpara
Eléctrico	Trabajo en la fuente conmutada; condensadores cargados	LOTO (bloqueo/etiquetado); verificar descarga de capacitores antes de manipular
Térmico / quemadura	Disipadores y módulos LED calientes tras uso prolongado	Esperar el enfriamiento; usar guantes; medir con termómetro IR
Fotobiológico	Exposición ocular directa al domo a máxima intensidad durante pruebas	No mirar directamente el domo encendido; usar el luxómetro a distancia; reducir intensidad al inspeccionar
Ergonómico	Posturas forzadas con brazos elevados durante períodos largos	Pausas; plataforma de trabajo a la altura adecuada
Biológico	Intervención en quirófano en uso o recién usado	Coordinar el mantenimiento fuera del horario quirúrgico; EPP; respetar la limpieza terminal

📌 Regla operativa: el mantenimiento de la lámpara quirúrgica nunca se hace con el quirófano habilitado. Requiere coordinación previa con enfermería de quirófano y bloqueo formal de la sala en el sistema de programación.