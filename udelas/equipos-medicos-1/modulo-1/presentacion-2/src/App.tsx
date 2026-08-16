import { useState, useCallback, useEffect, useRef, createContext, useContext } from 'react'
import imgAnestesia from './imports/equipos/anestesia.jpg'
import imgLampara from './imports/equipos/lampara.jpg'
import imgElectrocirugia from './imports/equipos/electrocirugia.jpg'
import imgMesa from './imports/equipos/mesa.jpg'
import imgTorre from './imports/equipos/torre.jpg'
import imgBomba from './imports/equipos/bomba.jpg'
import imgAnestesiaReal from './imports/equipos/anestesia-real.jpg'
import imgAnestesiaCircuito from './imports/equipos/anestesia-circuito.jpg'
import imgAnestesiaConector from './imports/equipos/anestesia-conector.jpg'
import { At, Ghost, Halo, Eyebrow, Hang, dly, VI, GO, RE, WH, WD, WF, WG } from './Stage'

// ─── image zoom (fullscreen lightbox) ──────────────────────────────────────────
const ImageZoomCtx = createContext<(src:string, alt?:string) => void>(() => {})
function ZoomableImg({ src, alt, style, imgStyle }: { src:string; alt?:string; style?:React.CSSProperties; imgStyle?:React.CSSProperties }) {
  const openImage = useContext(ImageZoomCtx)
  return (
    <div
      onClick={() => openImage(src, alt)}
      title="Click para ver en pantalla completa"
      style={{ position:'relative', cursor:'zoom-in', ...style }}
      className="zoomable-img"
    >
      <img src={src} alt={alt} style={{ display:'block', width:'100%', height:'100%', ...imgStyle }} />
      <div className="zoom-hint" style={{
        position:'absolute', bottom:8, right:8, width:26, height:26, borderRadius:8,
        background:'rgba(3,8,15,0.75)', border:'1px solid rgba(255,255,255,0.2)',
        display:'flex', alignItems:'center', justifyContent:'center', opacity:0, transition:'opacity 0.2s',
      }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#eef6ff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
      </div>
    </div>
  )
}
function Lightbox({ src, alt, onClose }: { src:string; alt?:string; onClose:()=>void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])
  return (
    <div
      onClick={onClose}
      style={{
        position:'fixed', inset:0, zIndex:200, background:'rgba(2,6,14,0.94)', backdropFilter:'blur(6px)',
        display:'flex', alignItems:'center', justifyContent:'center', padding:'6vh 6vw', cursor:'zoom-out',
        animation:'lightboxFadeIn 0.22s ease both',
      }}>
      <img src={src} alt={alt} onClick={e => e.stopPropagation()} style={{
        maxWidth:'100%', maxHeight:'100%', objectFit:'contain', borderRadius:10,
        boxShadow:'0 20px 80px rgba(0,0,0,0.7)', animation:'lightboxZoomIn 0.25s cubic-bezier(0.22,1,0.36,1) both', cursor:'default',
      }} />
      <button onClick={onClose} title="Cerrar (Esc)" style={{
        position:'absolute', top:22, right:28, width:40, height:40, borderRadius:10,
        background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.25)', color:'#eef6ff',
        fontSize:'1.3rem', lineHeight:1, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
      }}>×</button>
      {alt && <div style={{ position:'absolute', bottom:22, left:'50%', transform:'translateX(-50%)', color:'rgba(238,246,255,0.7)', fontFamily:'JetBrains Mono,monospace', fontSize:'0.75rem', letterSpacing:'0.06em' }}>{alt}</div>}
    </div>
  )
}

// ─── palette ──────────────────────────────────────────────────────────────────
const C = {
  bg:'#03080f', cyan:'#00d4ff', purple:'#7c3aed',
  white:'#eef6ff', muted:'rgba(140,185,230,0.6)', border:'rgba(0,212,255,0.15)',
  card:'rgba(5,15,40,0.78)',
}

// ─── DATA ─────────────────────────────────────────────────────────────────────
const EQUIPOS = [
  { num:1, icon:'⚗', img:imgAnestesia, video:`${import.meta.env.BASE_URL}videos/maquina-anestesia.mp4` as string|undefined, name:'Máquina de Anestesia', color:'#00d4ff', desc:'Estación de trabajo electromédica que regula, mezcla y administra gases y vapores anestésicos al paciente con ventilación y monitorización integradas',
    intro:{
      que:'Sistema electromédico compuesto por subsistemas neumáticos, mecánicos y electrónicos que recibe gases medicinales desde una fuente central o cilindros, los regula, mide, mezcla y enriquece con vapor anestésico en concentraciones exactas, los administra al paciente por vía pulmonar mediante ventilación espontánea, asistida o controlada, elimina el CO₂ espirado, evacúa los gases residuales, y monitoriza simultáneamente el desempeño del equipo y las variables fisiológicas del paciente. Normativa vigente: ISO 80601-2-13:2022.',
      funciones:['Suministrar O₂ con concentración conocida y verificable','Mezclar gases y vapores en proporciones exactas con protección contra mezcla hipóxica','Habilitar ventilación espontánea, asistida o controlada','Minimizar riesgos: evacuación AGSS, alarmas y dispositivos de protección','Monitorizar gases inspirados/espirados (O₂, CO₂, agente halogenado)','Autotest automatizado con prueba de fugas y distensibilidad'],
      apps:['Cirugía general y laparoscópica','Cirugía cardiovascular y torácica','Neurocirugía','Cirugía pediátrica y neonatal','Anestesia de bajo flujo / circuito cerrado','Trasplantes y cirugías de larga duración']
    },
    principio:{
      concepto:'Todo el flujo de gases sigue una caída de presión a través de tres zonas: Alta (cilindro → regulador, hasta 13 800 kPa), Intermedia (345–380 kPa) y Baja (> atmósfera). Los flujómetros operan por orificio variable a presión diferencial constante: la caída de presión es fija y el flotador asciende hasta que la fuerza del gas iguala su peso.',
      bloques:['Suministro de gases (toma central + cilindros de reserva)','Medición y dosificación (flujómetros, válvulas de aguja, guardia hipóxica)','Vaporización (vaporizadores calibrados + interlock)','Circuito del paciente y ventilación (sistema circular, absorbedor CO₂, AGSS)','Monitorización y alarmas (gases, presión, volumen, flujo, parámetros vitales)'],
      principios:[['Tres zonas de presión','Alta (cilindro) → Intermedia (red) → Baja (flujómetros/vaporizador). El regulador de 1.ª etapa baja a ~310 kPa, por debajo de la red (50 psi) para usar la red como fuente preferente.'],['Orificio variable (rotámetro)','Flujos bajos: régimen laminar, gobierna viscosidad. Flujos altos: régimen turbulento, gobierna densidad. Cada tubo está calibrado para un gas específico; no son intercambiables.'],['Guardia hipóxica (4 barreras)','PISS/DISS → válvula fail-safe → dispositivo de proporción O₂/N₂O → analizador de O₂ inspirado. Solo el analizador verifica lo que llega realmente al paciente.'],['Vaporización por bypass variable','El flujo se divide: una fracción se satura de agente y el resto lo evita. El dial controla el splitting ratio. Compensación de temperatura (bimetálico) y de flujo.']]
    },
    componentes:[
      ['Yugo / PISS','Conexión segura de cilindro; pines únicos por gas impiden conexión cruzada'],
      ['Regulador de 1.ª etapa','Reduce presión del cilindro a ~310 kPa; activa red como fuente preferente'],
      ['Válvula fail-safe','Corta N₂O y otros gases si la presión de O₂ cae por debajo de 140–200 kPa'],
      ['Flujómetros (rotámetros)','Miden caudal de cada gas; O₂ siempre en el extremo derecho (aguas abajo)'],
      ['Vaporizador calibrado','Convierte anestésico líquido en vapor de concentración exacta; con interlock'],
      ['Sistema circular / absorbedor CO₂','7 componentes: válvulas unidireccionales, ramas, pieza en Y, bolsa, APL, cal sodada'],
      ['Ventilador (fuelle/pistón/turbina)','Genera ventilación mecánica; fuelle ascendente es el estándar actual de seguridad'],
      ['AGSS','Evacúa gases residuales; protege al personal, no al paciente; con válvulas de alivio'],
      ['Monitor de gases y alarmas','Mide O₂, CO₂, agente, presión, volumen y flujo; alarmas obligatorias por norma']
    ],
    manejo:{
      antes:['Verificar bolsa autoinflable (Ambu) presente y funcional','Cilindro E de O₂ con al menos ~1000 psi y válvula abierta','Mangueras de red conectadas y con presión ~50 psi (~345 kPa)','Completar autotest sin fallas; prueba de fuga < 150 mL/min','Vaporizadores llenos, bien asentados y con tapas cerradas','Absorbente de CO₂ no agotado (verificar con capnografía, no solo color)','Analizador de O₂ calibrado a 21 % y a 100 %','Alarmas activas con límites apropiados para el paciente'],
      durante:['FiO₂ y agente halogenado inspirado/espirado','EtCO₂ y CO₂ inspirado (> 0 mmHg = absorbente agotado)','Presión pico, meseta y PEEP de vía aérea','Volumen corriente y volumen minuto espirado','Frecuencia respiratoria y patrón ventilatorio','Nivel del vaporizador y lectura del flujómetro de O₂'],
      despues:['Cambiar circuito desechable y filtro bacteriano-viral','Desinfectar carcasa, pantalla, perillas y cajones','No rociar desinfectante sobre pantallas ni rejillas de ventilación','Cerrar flujo de gas fresco al finalizar la jornada (previene CO por absorbente desecado)','Registrar incidencias, valores de calibración y repuestos utilizados']
    },
    marcas:{
      headers:['Criterio','Gama entrada','Gama media','Gama alta'],
      rows:[
        ['Dosificación','Rotámetros mecánicos','Rotámetros o mezclador electrónico','Mezclador electrónico + respaldo neumático'],
        ['Ventilador','Fuelle neumático','Fuelle o pistón','Pistón o turbina'],
        ['Modos vent.','VCV, manual','VCV, PCV, SIMV, PSV','+ PCV-VG, APRV, pediátrico/neonatal'],
        ['Autotest','Manual o parcial','Automatizado','Automatizado + distensibilidad cuantificada'],
        ['Monitor de gases','Módulo externo opcional','Integrado','Integrado + guía de bajo flujo'],
        ['Conectividad','Ninguna','HL7 / puerto serie','HL7, expediente electrónico, red hospitalaria'],
        ['Mantenimiento','Bajo (mecánico)','Medio','Alto — software OEM + licencias'],
        ['Ejemplos','Penlon Prima, Comen AX','Mindray WATO/A7, GE Aespire','Dräger Perseus/Atlan, GE Carestation 750']
      ]
    },
    mantenimiento:{
      preventivo:[
        ['Antes de cada caso','Checkout completo: gases, autotest, fugas, circuito, absorbente, vaporizadores, alarmas, Ambu'],
        ['Diaria','Autotest al encender; inspección visual; nivel de agentes; estado del absorbente'],
        ['Mensual','Prueba de fugas alta/baja presión; cilindros de reserva; AGSS; conectores DISS/PISS'],
        ['Trimestral','Exactitud de flujómetros; guardia hipóxica O₂/N₂O; válvula fail-safe; alarmas'],
        ['Semestral','Calibración de vaporizadores con analizador de agente; reemplazar celda de O₂ galvánica (~1 año)'],
        ['Anual','MP mayor OEM: sellos, diafragmas, válvulas, filtros, baterías; IEC 62353; firmware']
      ],
      pruebas:['Prueba de fugas baja presión (< 150 mL/min a 30 cmH₂O)','Prueba de fugas alta presión (yugo y cilindros)','Verificación de guardia hipóxica (proporción O₂/N₂O)','Calibración de vaporizadores con analizador de agente certificado','Prueba funcional de válvula fail-safe','Corriente de fuga y resistencia de tierra (IEC 62353)'],
      realizar:['Cambiar circuito, máscara y filtro HME/bacteriano-viral entre pacientes','Limpiar superficies de alto contacto con desinfectante compatible con el material','Cambiar absorbente de CO₂ según indicación (color + capnografía)','Usar EPP al manipular absorbente agotado (pH > 12, cáustico)'],
      evitar:['Rociar desinfectante sobre pantalla táctil o rejillas de ventilación','Usar solventes agresivos o alcohol concentrado en plásticos ABS/policarbonato','Lubricar conectores de O₂ con aceite o vaselina (riesgo de ignición)','Dejar flujo de gas fresco abierto al finalizar la jornada (genera CO en absorbente desecado)']
    },
    fallas:{
      tabla:[
        ['Autotest falla por fuga','Vaporizador mal asentado; sello del absorbedor deteriorado; circuito con fisura'],
        ['Vt entregado < programado','Fuga en fuelle; sensor de flujo descalibrado; distensibilidad no compensada'],
        ['CO₂ inspirado > 0 mmHg','Absorbente agotado; válvula unidireccional pegada o incompetente'],
        ['Presión de vía aérea alta','Circuito obstruido; válvula APL cerrada; AGSS bloqueado; agua en tubos'],
        ['Alarma de O₂ bajo persistente','Manguera aplastada; regulador defectuoso; cilindro vacío o válvula cerrada'],
        ['Concentración de agente nula','Vaporizador vacío o mal montado; celda de O₂ galvánica agotada (~12 meses vida útil']
      ],
      paciente:['Hipoxia por mezcla hipóxica o falla de suministro de O₂','Barotrauma/volutrauma por válvula APL cerrada o flush de O₂ prolongado','Despertar intraoperatorio (awareness) por vaporizador vacío o descalibrado','Toxicidad por Compuesto A o CO en absorbente desecado con bases fuertes','Infección respiratoria cruzada por circuito reutilizado sin reprocesamiento'],
      biomedico:['Exposición a gases anestésicos residuales (WAG): N₂O límite NIOSH 25 ppm; halogenados 2 ppm','Riesgo químico: absorbente de CO₂ cáustico (pH > 12); usar EPP al cambiar canister','Riesgo eléctrico: capacitores y circuitos energizados — aplicar LOTO antes de intervenir','Riesgo de presión: cilindros hasta 13 800 kPa; nunca lubricar con hidrocarburos','Riesgo biológico: trampas de agua y circuitos contaminados con secreciones del paciente']
    },
    conclusion:{
      caso:'Un análisis retrospectivo de reclamaciones por eventos adversos en administración de gases anestésicos encontró que el 85 % involucraba error del operador y no falla mecánica del equipo; del subconjunto ligado al circuito respiratorio, el 75 % fue calificado como prevenible con un checkout pre-anestésico completo. El caso índice más citado ocurrió en 2013: un anestesiólogo montó el circuito desechable al inicio de la jornada pero omitió la prueba de fuga y la verificación de la bolsa Ambu antes del primer caso — el ensamblaje quedó con una desconexión parcial no visible a simple vista. Durante la inducción, la ventilación mecánica no llegó al paciente; el equipo tardó minutos críticos en identificar la desconexión porque el monitor de CO₂ fue el único que alertó el problema, no una alarma del propio ventilador. El paciente falleció por hipoxia. La investigación posterior confirmó que el checkout completo — incluida la prueba de fuga — habría detectado el defecto en menos de un minuto, antes de tocar al paciente.',
      lecciones:['El checkout pre-anestésico no es opcional: la bolsa Ambu es el paso #1 de la lista ASA','Nunca confiar solo en el color del absorbente: solo la capnografía confirma el agotamiento real','Un circuito con fuga de 300 mL/min obliga a usar flujos altos; el MP es también una medida ambiental','La guardia hipóxica protege contra N₂O, NO contra aire medicinal: el analizador de O₂ es obligatorio'],
      normas:[
        ['ISO 80601-2-13:2022','Seguridad y desempeño esencial de la estación de trabajo de anestesia (2.ª ed.)'],
        ['IEC 60601-1','Seguridad eléctrica general de equipos electromédicos'],
        ['IEC 62353','Pruebas periódicas de seguridad eléctrica en mantenimiento'],
        ['ISO 14971','Gestión de riesgos para dispositivos médicos'],
        ['NFPA 99','Sistemas de gases medicinales en instalaciones de salud'],
        ['NIOSH REL','N₂O: 25 ppm; agentes halogenados: 2 ppm (límites de exposición ocupacional)']
      ]
    }
  },
  { num:2, icon:'☀', img:imgLampara, video:undefined as string|undefined, name:'Lámpara Quirúrgica', color:'#fbbf24', desc:'Luminaria electromédica que produce un campo de alta intensidad sin sombras, con color fiel y mínima carga térmica sobre el tejido expuesto',
    intro:{
      que:'Equipo electromédico de iluminación diseñado para producir un campo luminoso de alta intensidad, dirigido, con mínima generación de calor y sin sombras proyectadas, que permite al equipo quirúrgico distinguir estructuras anatómicas y sus colores reales en el interior de una cavidad, sin producir fatiga visual ni daño térmico al tejido expuesto. Normativa vigente: IEC 60601-2-41:2021 (Edición 3).',
      funciones:[
        'Iluminancia central Ec entre 40 000 y 160 000 lux a 1 m del campo',
        'Dilución de sombras: múltiples fuentes reducen la umbra a penumbra tolerable',
        'CRI Ra ≥ 95 y R9 alto para distinguir arteria, vena, nervio y tumor por color',
        'Carga térmica mínima: Ee/Ec ≤ 6 mW/(m²·lx) — el parámetro clave de seguridad',
        'Profundidad de iluminación ajustable (L₁+L₂ al 60 % de Ec)',
        'Tolerancia a fallo: dos circuitos independientes; respaldo por batería 1–3 h'
      ],
      apps:['Cirugía general y laparoscópica','Neurocirugía','Cirugía cardiovascular','Traumatología y ortopedia','Ginecología y obstetricia','Cirugía plástica y reconstructiva']
    },
    principio:{
      concepto:'La ingeniería de la lámpara quirúrgica resuelve cuatro exigencias en conflicto: alta intensidad (hasta 160 000 lux) vs. baja carga térmica; sin sombras vs. tamaño compacto; color fiel vs. brillo; y haz profundo para cavidad vs. dilución de sombras. La solución central es la dilución de sombras (shadow dilution): múltiples fuentes distribuidas en la cúpula hacen que cada obstáculo bloquee solo algunas, mientras el resto sigue iluminando el campo.',
      bloques:[
        'Fuente de red → fuente conmutada → 24/48 VDC al domo',
        'Driver de corriente constante → módulos LED',
        'Gestión térmica (disipador + PCB metálico + pasta térmica)',
        'Sistema óptico (lentes colimadores / reflectores multifaceta)',
        'Suspensión cielítica (anclaje estructural, brazo de resorte, slip rings)'
      ],
      principios:[
        ['Dilución de sombras','Múltiples fuentes distribuidas en la cúpula: cada obstáculo (mano, cabeza) bloquea solo algunas; el resto sigue iluminando. Cuando un módulo LED se apaga, se pierde dilución aunque haya luz — la lámpara deja de cumplir su desempeño esencial.'],
        ['Parámetros fotométricos (IEC 60601-2-41)','Ec (iluminancia central) 40 000–160 000 lux; d₅₀/d₁₀ ≥ 0.5 (uniformidad); Ee/Ec ≤ 6 mW/(m²·lx) (carga térmica); Ra ≥ 85–100; R9 ≥ 90 (rojo saturado, crítico para tejidos).'],
        ['Electroluminiscencia LED','Polarización directa de unión p-n (InGaN) → recombinación electrón-hueco → fotón. Luz blanca por LED azul + fósforos múltiples. Los tres subsistemas que realmente fallan: driver de corriente, gestión térmica y compensación de flujo (el LED puede perder 20 % en 2 h de uso).'],
        ['Diseño a prueba de fallo','El domo se divide en dos o más circuitos independientes (cables, transformadores y anillos colectores separados). Si falla uno, la mitad de los LED sigue encendida. Exigido por IEC 60601-2-41 — no es lujo sino requisito normativo.']
      ]
    },
    componentes:[
      ['Módulos LED + driver','Driver de corriente constante controla el LED (relación I-V exponencial); falla de condensadores → parpadeo'],
      ['Lentes colimadores / reflectores','Dirigen la luz de cada LED al mismo punto focal; determinan d₅₀ y la dilución de sombras'],
      ['Disipador + PCB metálico','Mantiene la unión LED por debajo de 85–120 °C; suciedad acorta la vida y desplaza la CCT'],
      ['Fuente conmutada','100–240 VAC → 24/48 VDC; conexión obligatoria al sistema eléctrico esencial del hospital'],
      ['Batería de respaldo','Operación 1–3 h ante corte total; vida típica 2–4 años; reemplazo programado con registro'],
      ['Brazo de resorte (spring arm)','Permite ajuste vertical y mantiene posición; contiene resorte precargado — NUNCA desmontar sin herramienta OEM'],
      ['Anillos colectores (slip rings)','Permiten rotación 360° sin retorcer cables; desgaste → arco eléctrico → parpadeo'],
      ['Panel de control / pantalla','Ajusta Ec, d₅₀, CCT y modos (endoscópico, emergencia)'],
      ['Manija central estéril','Contacta guantes del cirujano; semicrítica → esterilización en autoclave 134 °C o desechable por caso']
    ],
    manejo:{
      antes:[
        'Verificar encendido de TODOS los módulos al 100 % de intensidad',
        'Probar movilidad del brazo y que los frenos mantengan la posición sin deriva',
        'Confirmar que la manija estéril está correctamente instalada y es del caso actual',
        'Seleccionar CCT y diámetro de campo apropiados para la especialidad',
        'Verificar funcionamiento del respaldo por batería (modo emergencia)',
        'Comprobar que el anclaje al techo no presenta vibración ni holgura'
      ],
      durante:[
        'Usar la mínima intensidad necesaria para el procedimiento',
        'No superponer dos o tres domos sobre el mismo punto (irradiancia acumulada > 700 W/m²)',
        'Activar modo endoscópico al usar laparoscopio (evita lavado de imagen en monitor)',
        'Irrigar el tejido expuesto en cirugías prolongadas para prevenir desecación',
        'No dirigir la guía láser de posicionamiento hacia los ojos del paciente'
      ],
      despues:[
        'Retirar, reprocesar y esterilizar la manija central (autoclave o desechable)',
        'Limpiar cúpula (incluida la cara superior) con paño sin pelusa y desinfectante compatible',
        'No rociar directamente sobre el panel ni las rejillas de ventilación',
        'Registrar si algún módulo LED quedó apagado o con color distinto'
      ]
    },
    marcas:{
      headers:['Característica','Halógena','Fibra óptica','LED (actual)'],
      rows:[
        ['Eficacia luminosa','~15–25 lm/W','Baja (pérdidas en guía)','80–150 lm/W'],
        ['Vida útil','500–1 500 h','500–1 000 h (fuente)','> 60 000 h (L70)'],
        ['Carga térmica','Alta — requiere filtro dicroico','Baja (IR filtrado en fuente)','Mínima'],
        ['CRI / Ra','Excelente (~99)','Bueno','≥ 95 en gama alta'],
        ['CCT ajustable','No','No','Sí (3 000–5 000 K)'],
        ['Consumo por domo','300–500 W','250–400 W','40–120 W'],
        ['Falla típica','Filamento quemado','Rotura de fibra','Driver o disipador'],
        ['Ejemplos actuales','En desuso','En desuso','Getinge PowerLED II, Dräger Polaris, Mindray HyLED, Stryker Chromophare']
      ]
    },
    mantenimiento:{
      preventivo:[
        ['Diaria / por caso','Limpieza de cúpula y manija; verificar encendido de todos los módulos; probar movilidad y frenos'],
        ['Mensual','Limpiar disipador y rejillas; verificar LEDs apagados o de color desviado; probar batería'],
        ['Trimestral','Ajustar frenos de fricción; verificar torque de tornillería estructural; inspeccionar slip rings'],
        ['Semestral','Medir Ec con luxómetro a 1 m (criterio: ≥ 70 % del nominal); prueba IEC 62353'],
        ['Anual','Inspección estructural del anclaje al techo; brazo de resorte según OEM; firmware; manijas'],
        ['Según OEM','Reemplazo del resorte de gas del brazo de equilibrio y del módulo LED por degradación L70']
      ],
      pruebas:[
        'Iluminancia central Ec con luxómetro calibrado a 1 m (comparar con fábrica)',
        'Conteo de módulos apagados (criterio de retiro: > 10 % del total)',
        'Temperatura del disipador con termómetro IR (< límite OEM)',
        'Prueba de batería de respaldo (tiempo real de operación)',
        'Resistencia de tierra de protección y corriente de fuga (IEC 62353)',
        'Torque de tornillería de anclaje al techo (con llave dinamométrica)'
      ],
      realizar:[
        'Limpiar la cara superior de la cúpula (acumula polvo que cae al campo quirúrgico)',
        'Usar paño sin pelusa con desinfectante compatible — consultar manual del fabricante',
        'Reprocesar la manija estéril en autoclave a 134 °C o usar manija desechable por caso',
        'Lubricar ejes y rodamientos solo con el lubricante especificado por el OEM'
      ],
      evitar:[
        'Rociar desinfectante directamente sobre pantalla, rejillas o entradas de ventilación',
        'Usar detergentes enzimáticos en remojos prolongados en manijas porosas',
        'No utilizar métodos de desinfección por fumigación',
        'Desmontar el brazo de resorte sin herramienta de bloqueo OEM (riesgo de lesión grave)'
      ]
    },
    fallas:{
      tabla:[
        ['No enciende','Breaker disparado; fusible fundido; fuente conmutada dañada; cable suelto en el eje rotatorio'],
        ['Parpadeo / intensidad inestable','Driver de corriente fallando (condensadores); anillo colector sucio o desgastado'],
        ['Se apaga tras varios minutos','Sobrecalentamiento: disipador obstruido; pasta térmica degradada; protección térmica activada'],
        ['Iluminancia por debajo del nominal','Degradación L70 de LEDs; módulos apagados; cristal rayado u opaco; driver limitando corriente'],
        ['Domo cae solo / no mantiene posición','Resorte del brazo de equilibrio fatigado; frenos de fricción desajustados'],
        ['Vibración u oscilación al posicionar','Anclaje estructural al techo flojo — riesgo inmediato de caída; verificar torque de inmediato']
      ],
      paciente:[
        'Quemadura o desecación tisular por irradiancia sostenida > 700 W/m² (especialmente con dos domos superpuestos)',
        'Lesión ocular por guía láser de posicionamiento clase II dirigida sin precaución',
        'Trauma por caída del domo ante falla del anclaje estructural o del brazo de resorte',
        'Infección cruzada por manija no estéril o polvo desprendido de la cara superior de la cúpula',
        'Interrupción de la cirugía por apagón sin respaldo eléctrico o batería agotada'
      ],
      biomedico:[
        'CRÍTICO — energía mecánica almacenada: el resorte precargado del brazo puede causar amputación si se desmonta sin herramienta OEM',
        'Caída de altura durante trabajos de anclaje en el techo (escalera certificada + arnés)',
        'Eléctrico: condensadores de la fuente conmutada cargados — aplicar LOTO y verificar descarga',
        'Térmico: módulos LED y disipadores calientes tras uso — esperar enfriamiento o usar guantes',
        'Fotobiológico: no mirar el domo encendido a máxima intensidad durante pruebas'
      ]
    },
    conclusion:{
      caso:'En un procedimiento de cirugía general que se extendió más de 5 horas, el equipo quirúrgico notó hacia el final que distinguir planos de tejido se había vuelto progresivamente más difícil. El cirujano lo atribuyó a fatiga visual acumulada tras horas de cirugía y el caso terminó sin incidente reportado. Semanas después, durante una inspección de rutina del servicio de biomédica, se encontró que el 18 % de los módulos LED del domo principal llevaban apagados desde antes de esa cirugía — probablemente semanas — sin que ninguna alarma lo hubiera señalado, porque la lámpara seguía "encendiendo" con normalidad. Al reconstruir el caso se determinó que la iluminancia real disponible ese día había caído muy por debajo del 70 % del valor nominal de fábrica, el umbral de referencia para retirar el equipo de servicio. La causa raíz no fue una falla puntual sino la ausencia de dos controles preventivos básicos: la medición periódica de iluminancia con luxómetro y la inspección visual de que los 100 % de los módulos LED encendieran antes de cada jornada.',
      lecciones:[
        'Una lámpara con LEDs quemados que todavía alumbra NO está apta: perdió su desempeño esencial de dilución de sombras',
        'El parámetro Ee/Ec es el número que separa una lámpara LED buena de una barata: ambas dan 130 000 lux con carga térmica muy distinta',
        'La limpieza del disipador es mantenimiento crítico, no estético: el polvo acorta la vida del LED y desplaza la CCT',
        'El mantenimiento de la lámpara quirúrgica nunca se hace con el quirófano habilitado'
      ],
      normas:[
        ['IEC 60601-2-41:2021','Requisitos para luminarias quirúrgicas y de diagnóstico (Edición 3)'],
        ['IEC 60601-1','Seguridad eléctrica general de equipos electromédicos'],
        ['IEC 62353','Pruebas periódicas de seguridad eléctrica en mantenimiento'],
        ['ISO 14971','Gestión de riesgos para dispositivos médicos'],
        ['IEC 62471','Seguridad fotobiológica de lámparas y sistemas de lámparas LED'],
        ['ASHRAE 170','Ventilación en instalaciones de atención de salud']
      ]
    }
  },
  { num:3, icon:'⚡', img:imgElectrocirugia, video:undefined as string|undefined, name:'Unidad de Electrocirugía', color:'#f87171', desc:'Generador de alta frecuencia (300 kHz–5 MHz) que produce efectos térmicos controlados en tejido por densidad de corriente sin estimulación neuromuscular',
    intro:{
      que:'Unidad electroquirúrgica (ESU): generador de corriente alterna de alta frecuencia que, al circular a través del tejido biológico, produce en él un efecto térmico controlado (corte, coagulación o ambos) por conversión de energía eléctrica en calor mediante el efecto Joule, sin producir estimulación neuromuscular ni electrocución. Normativa vigente: IEC 60601-2-2:2017 (6.ª ed.) + AMD1:2023. Nota: electrocirugía ≠ electrocauterio (en el cauterio el tejido no conduce corriente; en la ESU sí).',
      funciones:[
        'Corte: arco continuo → vaporización explosiva del agua celular a ~100 °C',
        'Coagulación/desecación: calentamiento lento → desnaturalización proteica a 60–90 °C',
        'Fulguración: arcos largos e intermitentes → coagulación superficial de área amplia',
        'Sellado de vasos hasta 7 mm (bipolar avanzado con realimentación de impedancia)',
        'Coagulación con plasma de argón (APC): sin contacto, hemostasia de grandes superficies'
      ],
      apps:['Cirugía general y laparoscópica','Neurocirugía (modo bipolar preferente)','Ginecología y urología','Cirugía endoscópica y colonoscopía','Dermatología y cirugía plástica','Ortopedia y cirugía torácica']
    },
    principio:{
      concepto:'La ecuación central de toda la electrocirugía: p = ρ · J² = ρ · (I/A)². La misma corriente que vaporiza tejido bajo la punta activa (A ≈ 1 mm²) es inofensiva bajo el electrodo neutro (A ≈ 100 cm²): el área es 100 000 veces mayor y la potencia por volumen cae 10¹⁰ veces. Por encima de ~100 kHz (efecto de alta frecuencia) cada semiciclo dura < 5 µs — la membrana nerviosa no alcanza a despolarizarse; la corriente pasa sin estimular aunque el calor se siga generando.',
      bloques:[
        'Red 120/240 VAC → fuente conmutada + filtro EMI',
        'Microprocesador de control ↔ panel/pantalla de usuario',
        'Oscilador RF 300–500 kHz → modulador (define forma de onda)',
        'Amplificador de potencia → transformador de salida (AISLAMIENTO)',
        'Circuito CQM/REM → electrodo activo → paciente → electrodo neutro'
      ],
      principios:[
        ['Alta frecuencia (> 100 kHz)','Cada semiciclo dura < 5 µs; la membrana nerviosa no alcanza el umbral de despolarización. Rango operativo: 300–500 kHz. Por debajo de 200 kHz: riesgo de estimulación. La alta frecuencia no hace el corte — hace que el corte sea seguro.'],
        ['Formas de onda y factor de cresta','Corte (FC ~1.4–2): senoidal continua, potencia alta localizada, vaporización. Blend (FC ~3–6): modulada en ráfagas 50–80 %. Coagulación (FC ~6–10): ráfagas muy espaciadas 5–10 %, voltaje pico hasta 9 kV. A igual potencia media, coagulación tiene mayor voltaje → mayor riesgo de ruptura de aislamiento.'],
        ['Monopolar vs bipolar','Monopolar: corriente atraviesa todo el cuerpo hasta el electrodo neutro; versatil pero con vías alternas y riesgos a distancia. Bipolar: corriente solo entre las dos puntas; mucho más seguro, sin electrodo neutro, preferente en neurocirugía y pacientes con marcapasos/DAI.'],
        ['CQM (Monitor de Calidad de Contacto)','El electrodo neutro dividido permite inyectar una corriente de prueba de baja intensidad y medir la impedancia entre ambas mitades. Si la placa se despega parcialmente, la impedancia cambia → el generador inhibe la salida y alarma. IEC 60601-2-2 (6.ª ed.) exige electrodo neutro con CQM en adultos.']
      ]
    },
    componentes:[
      ['Oscilador y modulador RF','Genera la señal de 300–500 kHz y le aplica la envolvente que define el modo (corte/blend/coag)'],
      ['Amplificador de potencia','Eleva la señal a potencias de 30–400 W; su realimentación ajusta voltaje/corriente en tiempo real según la impedancia del tejido'],
      ['Transformador de salida aislado','Aísla galvánicamente el circuito del paciente respecto de tierra — componente de seguridad crítico'],
      ['Circuito CQM / REM','Monitoriza continuamente la impedancia entre las dos mitades del electrodo neutro dividido; inhibe la salida ante despegue'],
      ['Electrodo activo (lápiz / pinza)','Concentra la densidad de corriente en el punto de acción; la punta carbonizada aumenta la impedancia y obliga a subir potencia'],
      ['Electrodo neutro dividido','Placa adhesiva de uso único (nunca reutilizar ni recortar); contacto uniforme sobre masa muscular ≥ 100 cm²'],
      ['Pedal / botones del lápiz','Activan el modo elegido; falla por líquido dentro puede causar activación involuntaria'],
      ['Sistema de evacuación de humo','El humo quirúrgico contiene VPH viable, carcinógenos y partículas < 1 µm; evacuación obligatoria en el punto de origen'],
      ['Panel de control / microprocesador','Gestiona modos, potencias, alarmas y el log de eventos para diagnóstico']
    ],
    manejo:{
      antes:[
        'Colocar el electrodo neutro sobre masa muscular bien vascularizada (muslo/glúteo), limpia, seca y sin vello',
        'Orientar el eje mayor de la placa hacia el sitio quirúrgico; evitar prominencias óseas, cicatrices y prótesis',
        'Verificar que el CQM/REM esté activo y que la alarma audible suene correctamente',
        'Seleccionar el modo de menor voltaje que logre el efecto deseado (corte < blend < coag)',
        'Confirmar que el lápiz activo está en su funda aislante y que el evacuador de humo está operativo',
        'En pacientes con marcapasos/DAI: preferir bipolar o ultrasónico y coordinar con cardiología'
      ],
      durante:[
        'Usar la mínima potencia eficaz; nunca dejar el lápiz activo encendido sobre el campo',
        'Colocar el lápiz en su funda aislante cuando no se use — es la principal causa de incendio quirúrgico',
        'Limpiar la punta carbonizada con almohadilla abrasiva estéril (no con bisturí ni gasa seca)',
        'Evitar activación cuando haya antiséptico alcohólico húmedo o atmósfera enriquecida en O₂',
        'Mantener físicamente separados los cables de ESU y de monitorización para reducir interferencia EMI'
      ],
      despues:[
        'Retirar la placa adhesiva y desecharla — nunca reutilizar (el gel pierde sus propiedades)',
        'Inspeccionar cables del lápiz y del electrodo neutro; detectar microfisuras en el aislamiento',
        'Descontaminar el generador, pedal y carro antes de entregarlo al biomédico para mantenimiento',
        'Registrar cualquier alarma, código de error o incidente ocurrido durante el uso'
      ]
    },
    marcas:{
      headers:['Criterio','Gama entrada','Gama media','Gama alta'],
      rows:[
        ['Modos','Corte + coag monopolar','+ Bipolar, blend, autostart','+ Sellado vasos, APC, multienergía'],
        ['CQM/REM','No siempre','Incluido','Incluido + monitorización avanzada'],
        ['Realimentación de impedancia','No','Básica','En tiempo real (miles de ciclos/s)'],
        ['Evacuación de humo','No integrado','Externo compatible','Integrado o conexión nativa'],
        ['Potencia máx.','80–120 W','200–300 W','300–400 W + bipolar 50–80 W'],
        ['Conectividad/log','No','Puerto serie','Red hospitalaria, exportación de logs'],
        ['Fabricantes representativos','Mindray, Apyx/Bovie, asiáticos','Medtronic FT10, ConMed 5000','Erbe VIO 3, Medtronic Force Triad, Olympus ESG-400']
      ]
    },
    mantenimiento:{
      preventivo:[
        ['Antes de cada uso','Autotest; integridad de cables y lápiz; alarmas audibles; CQM activo al colocar la placa'],
        ['Mensual','Inspección de cables (aislamiento, dobleces en prensacables); revisión del pedal (ingreso de líquidos); rejillas de ventilación'],
        ['Trimestral','Prueba funcional del CQM (simulación de despegue); verificación del corte automático de salida; alarmas'],
        ['Semestral / Anual','Verificación con analizador de electrocirugía: potencia vs carga patrón (100/300/500/1000 Ω), corriente de fuga de RF, prueba de CQM, tiempo de respuesta; IEC 62353'],
        ['Anual','Calibración OEM; reemplazo de fusibles y filtros; actualización de firmware; verificación de la puesta a tierra del chasis'],
        ['Según OEM','Revisión de la etapa de amplificador de potencia; reemplazo de condensadores de la fuente conmutada']
      ],
      pruebas:[
        'Potencia de salida a 100, 300, 500 y 1000 Ω (desviación ≤ ±20 % del valor indicado en panel)',
        'Corriente de fuga de alta frecuencia (RF) según límites de IEC 60601-2-2',
        'Prueba de CQM: impedancia a la que alarma e inhibe la salida (dentro del rango declarado)',
        'Prueba de activación involuntaria del pedal (detección de cortocircuito por líquidos)',
        'Resistencia del conductor de tierra y corriente de fuga del equipo (IEC 62353)',
        'Verificación del nivel mínimo de alarma audible (la norma exige un mínimo no anulable)'
      ],
      realizar:[
        'Limpiar el generador, pedal y carro con desinfectante de nivel intermedio',
        'Inspeccionar el aislamiento de instrumentos laparoscópicos con probador específico en cada reprocesamiento',
        'Recibir siempre el equipo descontaminado antes de intervenir; tratar todos los accesorios como material contaminado'
      ],
      evitar:[
        'Nunca recortar un electrodo neutro: reduce el área, aumenta J y provoca quemadura',
        'Nunca reutilizar una placa adhesiva: el gel conductor pierde propiedades',
        'No sumergir el pedal si no está certificado IP para ello',
        'Nunca probar la salida de RF sin una carga patrón resistiva (riesgo de quemadura por RF y de incendio)'
      ]
    },
    fallas:{
      tabla:[
        ['Alarma de electrodo neutro persistente','Placa mal adherida, vencida, reutilizada o con pelo/humedad bajo ella; verificar placa antes de sospechar del equipo'],
        ['No hay salida en ningún modo','Fusible fundido; pedal desconectado; falla de la etapa de potencia; leer código de error del log'],
        ['Potencia insuficiente / no corta','Punta carbonizada (limpiar con almohadilla abrasiva); medir con analizador a 300 Ω antes de calibrar'],
        ['Activación involuntaria / salida espontánea','Pedal con líquido interno; botón del lápiz pegado — RETIRAR DE SERVICIO INMEDIATO (riesgo de incendio)'],
        ['Alarma sonora ausente o muy baja','Buzzer dañado; norma exige mínimo no anulable — documentar como no conformidad de seguridad crítica'],
        ['Interferencia en monitor de ECG / pulsioxímetro','Cables de ESU y monitorización entrelazados; verificar tierra de ambos equipos; filtros del monitor degradados']
      ],
      paciente:[
        'Quemadura bajo el electrodo neutro por contacto parcial: toda la corriente se concentra en el área remanente → J elevada',
        'Quemadura en sitio remoto por acoplamiento capacitivo en laparoscopía (sistema híbrido metal/plástico a 500 kHz)',
        'Incendio quirúrgico: ESU es la causa más frecuente — triángulo del fuego (O₂ + antiséptico alcohólico + lápiz activo)',
        'Inhibición del marcapasos o descarga inapropiada del DAI por corriente de RF interpretada como actividad cardíaca',
        'Quemadura por vía alterna piel-metal (mesa, soportes) o piel-piel (brazos en contacto con el tórax)'
      ],
      biomedico:[
        'Eléctrico / RF: alta tensión hasta 9 kV pico en la etapa de potencia — LOTO y descarga de capacitores antes de intervenir',
        'Quemadura por RF: activación accidental durante pruebas — usar siempre analizador con carga patrón, nunca en circuito abierto',
        'Humo quirúrgico: contiene VPH viable, carcinógenos y partículas < 1 µm — mascarilla quirúrgica NO protege; usar N95 o superior',
        'EMI: la ESU es una fuente potente de interferencia electromagnética para otros equipos del quirófano'
      ]
    },
    conclusion:{
      caso:'Una colecistectomía laparoscópica transcurrió sin ninguna complicación visible en el monitor: el cirujano activó electrocirugía monopolar varias veces con un instrumento cuya cánula metálica estaba anclada en un trocar híbrido (cuerpo metálico, punta de plástico). Cada activación generaba, a 500 kHz, una carga capacitiva en la cánula que se descargaba silenciosamente sobre el intestino delgado, fuera del campo de visión de la cámara — un mecanismo invisible tanto para el cirujano como para el generador, cuya salida aislada solo protege contra rutas de corriente directas, no contra acoplamiento capacitivo. El paciente fue dado de alta sin signos de alarma. 48 horas después reingresó por urgencias con dolor abdominal progresivo, fiebre y signos de irritación peritoneal; la reintervención confirmó una perforación intestinal en el trayecto exacto donde había pasado el instrumento. La revisión biomédica del caso, ya con el paciente estabilizado, fue la que identificó el sistema híbrido metal-plástico como la causa mecánica del acoplamiento capacitivo.',
      lecciones:[
        'La salida aislada NO elimina el acoplamiento capacitivo ni la falla de aislamiento del instrumento laparoscópico',
        'La placa de electrodo neutro de una sola pieza ya no cumple la norma en adultos desde IEC 60601-2-2:2017',
        'Sin analizador de electrocirugía no hay mantenimiento preventivo real de una ESU — solo hay limpieza',
        'La punta activa carbonizada obliga a subir potencia → mayor voltaje → mayor riesgo de incendio y quemadura'
      ],
      normas:[
        ['IEC 60601-2-2:2017','Requisitos para equipos de cirugía de alta frecuencia (6.ª ed.) + AMD1:2023'],
        ['IEC 60601-1','Seguridad eléctrica general de equipos electromédicos'],
        ['IEC 62353','Pruebas periódicas de seguridad eléctrica en mantenimiento'],
        ['ISO 14971','Gestión de riesgos para dispositivos médicos'],
        ['NFPA 99','Sistemas de gases medicinales; protocolo de incendio quirúrgico'],
        ['IEC 60601-1-2','Compatibilidad electromagnética (EMC) de equipos médicos']
      ]
    }
  },
  { num:4, icon:'🛏️', img:imgMesa, video:undefined as string|undefined, name:'Mesa Quirúrgica', color:'#34d399', desc:'Equipo electromecánico que posiciona al paciente de forma estable, ajustable y radiotransparente con múltiples grados de libertad para exposición óptima del campo quirúrgico',
    intro:{
      que:'Mesa quirúrgica (mesa de operaciones): equipo electromecánico de soporte del paciente que permite posicionarlo de forma estable, segura, reproducible y ajustable en múltiples ejes, con el fin de exponer óptimamente el sitio quirúrgico, facilitar el acceso del equipo quirúrgico y del anestesiólogo, permitir la obtención de imágenes intraoperatorias y prevenir lesiones derivadas de la posición. Normativa: IEC 60601-2-46:2023 (4.ª ed.).',
      funciones:[
        'Soportar el peso del paciente con estabilidad y sin deriva en cualquier configuración',
        'Posicionar en altura, Trendelenburg, anti-Trendelenburg, inclinación lateral, flex/reflex y deslizamiento longitudinal',
        'Exponer el campo quirúrgico mediante posiciones específicas por especialidad',
        'Permitir imagen intraoperatoria: tablero radiotransparente de fibra de carbono y espacio libre para el arco en C',
        'Proteger al paciente: distribución de presiones, alineación fisiológica, superficie antiestática y equipotencializada'
      ],
      apps:['Cirugía general y laparoscópica','Neurocirugía (columna en prono)','Ortopedia y traumatología','Urología y ginecología','Cirugía robótica integrada','Cirugía bariátrica']
    },
    principio:{
      concepto:'Principio hidráulico de Pascal: P = F/A → F = P·A. Una bomba genera presión (80–200 bar) en un fluido incompresible. El cilindro de gran diámetro multiplica la fuerza — duplicar el diámetro cuadruplica la fuerza (A ∝ d²). Por eso el sistema electrohidráulico levanta 300 kg con un motor pequeño. La válvula de retención + válvula de descarga controlada evita que el tablero descienda al apagarse el motor. Los segmentos articulados usan actuadores lineales de husillo (sistema electromecánico) para posicionamiento preciso por software.',
      bloques:[
        'Red 100–240 VAC → cargador → banco baterías 24 VDC (la mesa opera en batería, no en red)',
        'Motor eléctrico → bomba hidráulica → manifold con electroválvulas proporcionales',
        'Cilindro telescópico principal (columna) → eleva toda la carga; válvula de retención antideriva',
        'Actuadores por segmento: electrohidráulico o husillo electromecánico según eje',
        'Microprocesador de control → software de prevención de colisiones → mando colgante / inalámbrico'
      ],
      principios:[
        ['Ley de Pascal (hidráulico)','P = F/A — misma presión, más área de pistón, más fuerza. Permite cargar 300 kg con un motor de baja potencia. La válvula de retención es la que mantiene la posición sin consumo de energía.'],
        ['Carga segura de trabajo (SWL)','El valor de catálogo (típico: 250–360 kg) corresponde a carga estática centrada con tablero plano. En posiciones articuladas extremas o con deslizamiento longitudinal, el brazo de palanca aumenta el momento y la SWL se reduce hasta 180–200 kg.'],
        ['Radiotransparencia','Tablero de fibra de carbono: alta resistencia mecánica y mínima atenuación de rayos X sin artefactos. Menos atenuación = menos kVp/mAs = menos dosis al paciente y al personal. La zona radiotransparente útil debe declararse en mm.'],
        ['Alimentación en batería','La mesa opera normalmente con batería (no conectada a la red) para eliminar el cable del piso y desacoplar galvánicamente al paciente de la red. El control manual de emergencia es obligatorio para bajar la mesa ante fallo total de energía.']
      ]
    },
    componentes:[
      ['Base / pedestal','Contiene el sistema motriz; móvil (ruedas + frenos en 4 puntos) o fija empotrada para tablero intercambiable'],
      ['Columna telescópica','Pistón hidráulico principal que da el movimiento vertical (560–1050 mm); crítica: su sello es el que falla en la "deriva"'],
      ['Tablero seccionado (4–5 segmentos)','Cabecera, dorso, asiento, piernas independientes; fibra de carbono para radiotransparencia; articulados por actuadores'],
      ['Colchonetas','Espuma de alta densidad o gel viscoelástico; forro impermeable, antiestático, sin costuras; criterio de reemplazo: cualquier fisura'],
      ['Rieles laterales estándar','Para accesorios: soportes de brazo, arco de anestesia, separadores, estribos; compatibilidad entre fabricantes'],
      ['Mando colgante / inalámbrico','Control de todos los movimientos; falla más frecuente: ingreso de líquidos — protegido por IP declarado en ficha técnica'],
      ['Control manual de emergencia','Manivela mecánica o bomba manual que permite al menos bajar la mesa en fallo total de energía — su verificación es parte del MP'],
      ['Banco de baterías 24 VDC','Autonomía típica: varios días de uso; alarma de batería baja obligatoria; reemplazo programado cada 2–4 años'],
      ['Conexión equipotencial','Clavija dedicada a la barra equipotencial del quirófano — equipotencialización del paciente respecto a todos los equipos']
    ],
    manejo:{
      antes:[
        'Verificar todos los movimientos y que los frenos fijan firmemente en los 4 puntos de apoyo',
        'Inspeccionar colchonetas (fisuras, humedad interna) y correas de sujeción',
        'Confirmar carga de batería y que la alarma de batería baja funciona',
        'Seleccionar colchoneta y accesorios de posicionamiento según especialidad y tiempo quirúrgico previsto',
        'Verificar el control manual de emergencia (parte del checklist preoperatorio del biomédico)',
        'En cirugía robótica: confirmar que la mesa es compatible con el sistema robótico y que existe protocolo de desacople previo a mover la mesa'
      ],
      durante:[
        'Almohadillar todas las prominencias óseas antes de inducir la anestesia',
        'No abducir el brazo más de 90°; los soportes de hombro deben colocarse lateralmente a la articulación acromioclavicular',
        'Verificar visualmente la posición de extremidades antes de cada movimiento de la mesa',
        'En Trendelenburg pronunciado: sujetar al paciente con correas al nivel del tórax, no de los hombros',
        'En litotomía prolongada (> 2 h): advertir al equipo sobre síndrome compartimental; priorizar estribos tipo Yellow Fin'
      ],
      despues:[
        'Desinfección de nivel bajo/intermedio en la superficie del tablero y colchonetas entre cada paciente',
        'Limpiar las ranuras de los rieles y articulaciones entre segmentos (se acumula sangre coagulada)',
        'Conectar a carga al finalizar la jornada; no dejar sin cargar por más de una semana',
        'Registrar cualquier evento de deriva, ruido o movimiento anormal para el biomédico'
      ]
    },
    marcas:{
      headers:['Criterio','Gama entrada','Gama media','Gama alta'],
      rows:[
        ['Accionamiento','Hidráulico manual o electrohidráulico básico','Electrohidráulico completo','Electrohidráulico + actuadores electromecánicos (híbrido)'],
        ['Movimientos','Elevación + Trendelenburg + lateral','+ Segmentos independientes + deslizamiento','+ Prevención de colisiones por software, control robótico'],
        ['Tablero','Acero inoxidable / composite','Fibra de carbono parcial','Fibra de carbono completa, zona radiotransparente declarada'],
        ['SWL','150–200 kg','200–250 kg','250–360 kg (tabla completa por configuración)'],
        ['Batería','No siempre','Incluida, recambio costoso','Incluida + gestión inteligente + recambio local'],
        ['Fabricantes representativos','Mindray HyBase, asiáticos varios','Skytron, Steris Amsco 3085','Getinge/Maquet Magnus, Trumpf TruSystem 7500, Schaerer Arcus']
      ]
    },
    mantenimiento:{
      preventivo:[
        ['Antes de cada caso','Verificar movimientos, frenos, colchonetas, batería y control de emergencia — responsabilidad compartida usuario/biomédico'],
        ['Diaria','Limpieza y desinfección; conectar a carga al finalizar la jornada; inspección visual del mando y su cable'],
        ['Mensual','Inspección del sistema hidráulico: fugas de aceite en base, columna y cilindros; rieles laterales (deformación, holgura); ajuste de tornillería'],
        ['Trimestral','Verificar todos los rangos de movimiento contra la especificación; prueba del control manual de emergencia; medición del estado de baterías (voltaje en carga y bajo carga); lubricación de guías y pivotes'],
        ['Semestral','Prueba de deriva: elevar con carga de prueba, marcar posición, verificar que no desciende en 15–30 min; prueba de frenos con carga; seguridad eléctrica IEC 62353'],
        ['Anual','Cambio de aceite hidráulico y filtros; reemplazo de sellos y O-rings; reemplazo programado de baterías (vida típica 2–4 años); revisión estructural de soldaduras; actualización de firmware']
      ],
      pruebas:[
        'Prueba de deriva: sin descenso visible bajo carga en 15–30 min (fuga interna en válvula de retención o sello del cilindro)',
        'Prueba de frenos: la mesa no debe desplazarse al aplicar fuerza lateral con la carga máxima',
        'Control manual de emergencia: debe bajar la mesa completamente en fallo total de energía',
        'Continuidad de tierra de protección y corriente de fuga (IEC 62353)',
        'Verificación de la conexión equipotencial (resistencia < 0.1 Ω a la barra del quirófano)',
        'Medición de baterías: voltaje en reposo y bajo carga; descartar banco completo, nunca una sola batería'
      ],
      realizar:[
        'Recibir siempre el equipo descontaminado; tratar la base como zona contaminada (acumula fluidos bajo la cubierta)',
        'Nunca trabajar bajo la mesa sin soporte mecánico — nunca confiar solo en el sistema hidráulico para sostener el tablero',
        'Gestionar el aceite hidráulico usado como residuo peligroso'
      ],
      evitar:[
        'Nunca rociar líquido directamente sobre el mando colgante sin conocer su grado IP — el ingreso de líquido es la falla #1 de los mandos',
        'No usar productos clorados en alta concentración de forma rutinaria: degradan el poliuretano del forro de las colchonetas',
        'No "reparar" colchonetas con fisuras con cinta adhesiva — son reservorios microbianos y deben reemplazarse',
        'Nunca presurizar el circuito hidráulico para buscar fugas con la mano — una inyección de aceite a 100+ bar es una urgencia quirúrgica'
      ]
    },
    fallas:{
      tabla:[
        ['Deriva vertical (mesa baja sola)','Fuga interna en válvula de retención o sello del cilindro — RETIRAR DE SERVICIO INMEDIATO; prueba de deriva con carga'],
        ['No sube o sube muy lento','Batería baja (verificar primero); nivel bajo de aceite; bomba desgastada; sobrecarga (paciente sobre el SWL)'],
        ['Fuga de aceite visible en la base','Sello de cilindro, manguera o racor deteriorado — nunca operar con fuga activa: riesgo de caída y resbalón'],
        ['Mando colgante no responde','Ingreso de líquido; cable roto en prensacables; membrana perforada — probar con mando de repuesto'],
        ['Frenos no fijan / la mesa se desplaza','Falla de seguridad crítica — RETIRAR DE SERVICIO INMEDIATO; sistema de frenado desajustado o pastillas desgastadas'],
        ['Un solo movimiento no funciona','Electroválvula del eje afectado; actuador lineal quemado; fin de carrera pegado — medir continuidad de la bobina'],
        ['Control de emergencia no funciona','Mecanismo agarrotado por falta de uso — hallazgo grave: es el último recurso ante falla total. Reparar y probar en cada MP'],
        ['Batería no carga / no enciende','Banco al final de su vida; cargador dañado; fusible — medir voltaje en reposo y bajo carga; reemplazar el banco completo']
      ],
      paciente:[
        'Caída por deriva vertical (fallo hidráulico) o por frenos no aplicados — evento adverso grave prevenible con prueba de deriva en MP',
        'Lesión por posicionamiento: úlceras en sacro/talones/occipucio, lesión del nervio peroneo (litotomía), plexo braquial (hombreras mal colocadas)',
        'Pérdida de visión perioperatoria en decúbito prono por isquemia del nervio óptico — posición ocular y presión deben verificarse cada 30 min',
        'Atrapamiento/cizallamiento entre segmentos articulados al mover sin verificar la posición de extremidades',
        'Quemadura por electrocirugía si el paciente contacta partes metálicas de la mesa no equipotencializadas'
      ],
      biomedico:[
        'Aplastamiento: nunca trabajar bajo el tablero o columna sostenido solo por el sistema hidráulico — usar soportes mecánicos de bloqueo',
        'Inyección de fluido a alta presión (80–200 bar): localizar fugas solo con cartón o papel, nunca con la mano — es urgencia quirúrgica',
        'Eléctrico: banco de baterías con alta corriente de cortocircuito — retirar herramientas metálicas y joyas; LOTO',
        'La mesa pesa 150–300 kg: técnica de empuje (no arrastre), dos personas, plataforma rodante para desplazamientos'
      ]
    },
    conclusion:{
      caso:'En una colecistectomía laparoscópica bariátrica (paciente de 140 kg), el cirujano solicitó Trendelenburg pronunciado combinado con inclinación lateral izquierda para exponer el campo — una configuración articulada extrema que ya reduce la SWL efectiva de la mesa. Durante los primeros 40 minutos del procedimiento, el equipo notó que el campo quirúrgico se había "hundido" respecto a la posición inicial: la mesa había descendido cerca de 8 cm sin que nadie accionara el mando, un fenómeno de deriva vertical que obligó a reposicionar al paciente a mitad de cirugía. El caso se completó sin lesión al paciente, pero el evento fue reportado y el biomédico retiró el equipo de servicio para inspección. Al desarmar la columna telescópica encontró el sello del cilindro hidráulico principal con fuga interna: el aceite seguía circulando dentro del sistema sin que hubiera fuga visible al exterior, por lo que ninguna inspección superficial previa lo había detectado. Al revisar el historial se confirmó que la mesa llevaba 4 años sin mantenimiento de sellos y que la prueba de deriva con carga — el único método capaz de detectar este tipo de fuga interna antes de un incidente — nunca había estado incluida en el protocolo de mantenimiento preventivo del hospital.',
      lecciones:[
        'La prueba de deriva con carga debe incluirse en el MP semestral — es la única forma de detectar la fuga interna antes del incidente',
        'La SWL de catálogo (capacidad máxima) aplica a tablero plano y carga centrada; en Trendelenburg + lateral, la capacidad real es menor',
        'En cirugía robótica, mover la mesa con brazos acoplados sin desacople previo puede causar desgarro de tejidos',
        'La colchoneta con fisura es reservorio microbiano — no se repara con cinta, se reemplaza'
      ],
      normas:[
        ['IEC 60601-2-46:2023','Requisitos de seguridad para mesas de operaciones (4.ª ed.) — aplica a mesas con y sin partes eléctricas'],
        ['IEC 60601-1','Seguridad eléctrica general de equipos electromédicos'],
        ['IEC 62353','Pruebas periódicas de seguridad eléctrica en mantenimiento (continuidad de tierra, corriente de fuga)'],
        ['ISO 14971','Gestión de riesgos para dispositivos médicos'],
        ['NFPA 99','Equipotencialización del quirófano y sistemas de gases medicinales'],
        ['IEC 60601-1-2','Compatibilidad electromagnética (EMC) — interacción con ESU y C-arm']
      ]
    }
  },
  { num:5, icon:'🔬', img:imgTorre, video:undefined as string|undefined, name:'Torre de Endoscopía', color:'#a78bfa', desc:'Conjunto integrado de equipos (cámara 4K/3D, fuente de luz LED/NIR, insuflador de CO₂, monitor) que permite operar dentro de cavidades corporales a través de accesos mínimos con imagen en tiempo real',
    intro:{
      que:'Torre de endoscopía/laparoscopía: conjunto integrado de equipos electromédicos que permite visualizar, iluminar, distender y operar dentro de una cavidad corporal a través de accesos mínimos (puertos) o de orificios naturales, sustituyendo la visión directa del cirujano por una imagen de video en tiempo real. Consecuencia para el biomédico: en CMI si falla la torre, la cirugía se detiene o se convierte a cirugía abierta — la disponibilidad del equipo es un factor clínico directo.',
      funciones:[
        'Visualización: imagen 4K o 3D en tiempo real dentro de la cavidad con la óptica Hopkins o chip-on-tip',
        'Iluminación: fuente de luz LED fría (>60 000 h) o xenón 300 W con transmisión por fibra o fluido',
        'Fluorescencia NIR/ICG: identificación de vía biliar, uréteres, perfusión tisular y ganglio centinela',
        'Insuflación: neumoperitoneo a 12–15 mmHg con CO₂ a flujo controlado (hasta 50 L/min)',
        'Irrigación/succión: lavado del campo con bomba peristáltica y control del balance de líquidos',
        'Documentación: grabación 4K con H.265, exportación a red hospitalaria, imagen y video desde el cabezal'
      ],
      apps:['Laparoscopía (colecistectomía, apendicectomía, bariátrica)','Cirugía colorrectal y ginecológica','Urología (cistoscopía, ureteroscopía)','Artroscopía (rodilla, hombro)','Broncoscopía y toracoscopía','Cirugía robótica (visión del sistema)']
    },
    principio:{
      concepto:'El sistema Hopkins (1966) invertió la relación vidrio/aire en el endoscopio rígido: en vez de lentes de vidrio delgadas en un tubo de aire, usa varillas largas de vidrio separadas por finas capas de aire que actúan como lentes. Mayor índice de refracción en la mayor parte del trayecto → hasta 8–10 veces más luz transmitida, mayor campo de visión y mejor resolución con el mismo diámetro. El insuflador aplica la ley de Boyle/Pascal: el lazo de control mide la presión real en el abdomen y ajusta el flujo de CO₂ para mantener exactamente la presión de trabajo, independientemente de las fugas de los trocares.',
      bloques:[
        'Fuente de luz LED/Xenón + módulo NIR → cable de fibra óptica → óptica Hopkins (laparoscopio)',
        'Cabezal de cámara (CCD/CMOS 1-chip o 3-chip) acoplado a la óptica → cable de cámara',
        'CCU / procesador de video: balance de blancos, realce vascular, modos ICG → salidas 4K/SDI/HDMI',
        'Monitor de grado médico 32–55" 4K + grabador / sistema de integración quirúrgica',
        'Insuflador CO₂ (lazo cerrado, flujo máx. 50 L/min, alarma de sobrepresión) → trocar → paciente',
        'Carro con transformador de aislamiento: todos los módulos = SISTEMA ELECTROMÉDICO (IEC 60601-1 cl. 16)'
      ],
      principios:[
        ['Óptica de varillas de Hopkins','Tubo lleno de vidrio con lentes de aire: mayor índice de refracción → más luz, mejor resolución, mayor campo con el mismo diámetro. El ángulo de la óptica (0°, 30°, 45°, 70°) define el campo de visión; el 30° es el más versátil en laparoscopía.'],
        ['Fluorescencia NIR con ICG','El ICG excitado a ~800 nm reemite fluorescencia a ~830 nm (invisible al ojo). La cámara con filtros específicos capta esa emisión y la superpone sobre la imagen visible. Requiere que fuente, cabezal, procesador Y óptica sean todos compatibles con NIR — error frecuente de especificación.'],
        ['Insuflación con CO₂','CO₂ se usa porque: no es comburente (el O₂ sería catastrófico con la ESU), su solubilidad en sangre es ~20 veces la del O₂ (embolia gaseosa clínicamente manejable), y es eliminado por vía pulmonar. Precio: hipercapnia y acidosis — el anestesiólogo debe compensar con ventilación.'],
        ['Sistema electromédico (IEC 60601-1 cl. 16)','Al conectar varios equipos en un carro se forman corrientes de fuga sumadas. El sistema completo debe verificarse como un todo con IEC 62353 — no equipo por equipo. El transformador de aislamiento interno es el que mantiene las corrientes de fuga del sistema dentro de los límites.']
      ]
    },
    componentes:[
      ['Óptica (laparoscopio rígido)','Varillas de Hopkins; diámetros 10/5/3 mm; ángulos 0°/30°; longitud ~330 mm; certificar si es autoclavable'],
      ['Cabezal de cámara','Sensor CCD o CMOS 1-chip (bayer) o 3-chip (prisma RGB); sumergible y esterilizable; botones programables'],
      ['CCU / procesador de video','Balance de blancos, control de obturador, realce de imagen, modos NIR/ICG, grabación 4K H.265, salidas SDI/HDMI/IP'],
      ['Fuente de luz fría','LED (>60 000 h) o xenón 300 W; módulo NIR para fluorescencia ICG; modo standby obligatorio al desacoplar'],
      ['Insuflador de CO₂','Flujo máx. 50 L/min; lazo cerrado de presión; alarma de sobrepresión; filtro hidrofóbico 0.2 µm; alarma de cilindro vacío'],
      ['Monitor de grado médico','32–55" 4K; baja latencia; calibración de color; carcasa sellada; conforme a IEC 60601-1'],
      ['Cable de luz','Haz de fibras ópticas o fluido; pierde transmisión con fibras rotas; probar proyectando sobre superficie blanca'],
      ['Bomba de irrigación/succión','Peristáltica; lavado con solución salina; en artroscopía/histeroscopía requiere control estricto de balance hídrico'],
      ['Carro con transformador de aislamiento','Estructura que integra todos los módulos en un sistema; el transformador aislado controla las corrientes de fuga sumadas']
    ],
    manejo:{
      antes:[
        'Realizar el balance de blancos con la óptica y el cable de luz definitivos antes de cada caso — un color incorrecto durante la cirugía es una emergencia de imagen',
        'Verificar la presión del cilindro de CO₂ o la disponibilidad de la red central; confirmar que el filtro de 0.2 µm está instalado y no saturado',
        'Probar imagen: encender la fuente de luz y verificar que la imagen en el monitor sea nítida, sin manchas ni empañamiento',
        'En fluorescencia ICG: confirmar que fuente, cabezal, procesador Y óptica son todos compatibles con NIR antes de administrar el colorante',
        'Comprobar que el cable de luz está en su soporte — nunca apoyarlo encendido sobre el paciente o los campos (>200 °C en la punta)'
      ],
      durante:[
        'No apoyar el cable de luz sobre paños ni sobre la piel: la punta puede superar 200 °C y causar ignición o quemadura en segundos',
        'Activar el modo standby de la fuente al desacoplar la óptica del campo — es la principal causa de quemadura en laparoscopía',
        'Mantener la presión del neumoperitoneo en 12–15 mmHg; alertar al anestesiólogo ante hipercapnia o cambios hemodinámicos',
        'Si se pierde imagen: verificar primero el cable de luz (causa #1), luego los acoples, luego la óptica — antes de culpar a la fuente',
        'Tener óptica y cable de luz de repuesto disponibles en sala — la falla intraoperatoria puede obligar a conversión a cirugía abierta'
      ],
      despues:[
        'Tratamiento inmediato en el punto de uso antes de que la materia orgánica se seque — la limpieza diferida es la causa principal de falla en la DAN',
        'Prueba de fugas (leak test) al endoscopio flexible antes de sumergirlo — si hay fuga y se sumerge, el equipo se pierde',
        'Limpieza manual con detergente enzimático y cepillado de todos los canales; enjuague con agua de calidad ST108',
        'Desinfección de alto nivel (DAN) en AER o esterilización según la clasificación de Spaulding del dispositivo',
        'Secado activo con aire filtrado — el secado incompleto permite proliferación bacteriana durante el almacenamiento'
      ]
    },
    marcas:{
      headers:['Criterio','Gama entrada','Gama media','Gama alta'],
      rows:[
        ['Resolución cámara','Full HD 1080p','4K UHD nativo','4K + 3D nativo + NIR/ICG integrado'],
        ['Fuente de luz','Halógena/LED básico','LED 300 W equivalente','LED + NIR, modo ICG, standby automático'],
        ['Insuflador','20–30 L/min','40 L/min, alarmas básicas','50 L/min, calentamiento de gas, AiSeal (presión adaptativa)'],
        ['Fluorescencia NIR','No','Opcional (requiere upgrade)','Integrada: ENV (perfusión), IRIS (uréteres), ganglio centinela'],
        ['Monitor','Full HD, grado médico básico','4K grado médico','4K 55", multi-pantalla, integración quirúrgica digital'],
        ['Fabricantes representativos','Mindray, fabricantes asiáticos','Stryker 1588 AIM, Olympus Visera','Karl Storz Rubina 4K, Stryker 1788, Richard Wolf 4K']
      ]
    },
    mantenimiento:{
      preventivo:[
        ['Antes de cada caso','Balance de blancos; verificar imagen y color; confirmar presión del cilindro de CO₂; verificar filtro de insuflación; prueba de fugas de endoscopio flexible'],
        ['Semanal','Prueba del cable de luz: proyectar sobre superficie blanca con luz baja — los puntos negros son fibras rotas; con >20–30 % de fibras rotas reemplazar'],
        ['Mensual','Verificación del insuflador: presión indicada vs. medida con manómetro patrón; prueba de alarmas de sobrepresión y oclusión; limpieza de filtros de aire de los módulos'],
        ['Trimestral','Verificar fuente de luz (intensidad, horas acumuladas del LED/lámpara); revisión de conectores de video; prueba del sistema de grabación'],
        ['Semestral','Pruebas de seguridad eléctrica IEC 62353 del SISTEMA COMPLETO (todos los módulos del carro, corrientes de fuga sumadas); verificación del transformador de aislamiento; calibración del insuflador con patrón trazable'],
        ['Continuo','Registrar ciclos de esterilización de ópticas y cabezales; historial de reparaciones por óptica (una óptica dañada puede costar 30–60 % de su precio nuevo en reparación)']
      ],
      pruebas:[
        'Insuflador: presión indicada vs. manómetro patrón trazable (error directo sobre el paciente si está descalibrado)',
        'Prueba de fibras del cable de luz: contar puntos negros — >20–30 % de fibras rotas: reemplazar',
        'Prueba de fugas del endoscopio flexible antes de cada inmersión',
        'Corrientes de fuga del SISTEMA COMPLETO con IEC 62353 (carro con todos los módulos conectados)',
        'Verificación del transformador de aislamiento (resistencia de aislamiento)',
        'Verificación de limpieza post-reprocesamiento: ATP residual o test de proteína (no confiar en inspección visual)'
      ],
      realizar:[
        'Recibir siempre el equipo descontaminado y documentado antes de intervenir; EPP completo en el área de descontaminación',
        'Nunca abrir o reparar un endoscopio sin reprocesamiento previo verificado',
        'Intervenir el AER y el sistema de agua tratada como parte del MP del servicio de endoscopía'
      ],
      evitar:[
        'Nunca mirar directamente la salida de la fuente de luz ni el extremo del cable encendido — la radiación NIR es invisible pero daña la retina',
        'No comprimir los cilindros de CO₂ ni golpear su válvula; despresurizar la línea antes de desconectar la manguera',
        'No intervenir un AER cargado con desinfectante sin drenarlo y purgarlo primero (glutaraldehído, OPA y ácido peracético son irritantes respiratorios graves)'
      ]
    },
    fallas:{
      tabla:[
        ['Imagen oscura','Cable de luz con fibras rotas (causa #1); acoples sucios; LED/lámpara al final de vida — probar cable de repuesto primero, luego óptica, luego fuente'],
        ['Imagen borrosa o empañada','Empañamiento externo (diferencia térmica — se limpia) vs. humedad interna en la óptica (sellado roto — reparación OEM)'],
        ['Imagen con manchas fijas o medialunas','Varilla de Hopkins rota o desalineada por golpe — óptica dañada: reparación o reemplazo'],
        ['Color incorrecto (verdoso/rosado)','Balance de blancos no realizado o con óptica/cable incorrectos; falla en canal del prisma 3-chip'],
        ['No se logra o mantiene el neumoperitoneo','Fuga por trocares; cilindro vacío; manguera o filtro obstruido; verificar con manómetro patrón'],
        ['Insuflador marca sobrepresión constante','Manguera acodada; trocar contra tejido; sensor descalibrado; filtro saturado — calibrar antes de culpar al paciente'],
        ['Presión indicada ≠ presión real','Sensor del insuflador descalibrado — RIESGO DIRECTO PARA EL PACIENTE; calibrar con patrón trazable de inmediato'],
        ['El sistema dispara el diferencial del quirófano','Corrientes de fuga sumadas de los módulos; transformador de aislamiento en falla — medir el sistema completo por IEC 60601-1 cl. 16']
      ],
      paciente:[
        'Quemadura por la punta del cable de luz: concentra energía radiante >200 °C — puede encender campos textiles o quemar la piel en segundos si se apoya encendido',
        'Infección cruzada por reprocesamiento deficiente: riesgo #1 del servicio; brotes documentados por microorganismos multirresistentes en endoscopios flexibles',
        'Embolia gaseosa por CO₂ ante mal posicionamiento de la aguja de Veress o alarmas de presión no funcionales',
        'Conversión a cirugía abierta por falla intraoperatoria de la torre — evento adverso prevenible con MP riguroso y equipo de respaldo en sala'
      ],
      biomedico:[
        'Fotobiológico: nunca mirar la salida de la fuente de luz ni el cable encendido — la radiación NIR (800–830 nm) es invisible y daña la retina sin dolor inmediato',
        'Biológico: canales internos de endoscopios flexibles albergan materia orgánica aun después de la DAN — EPP completo, recibir el equipo documentado y descontaminado',
        'Químico: glutaraldehído, OPA y ácido peracético en el AER son sensibilizantes respiratorios — ventilación local extractora y purga completa antes de intervenir el equipo',
        'Eléctrico: sistema multi-equipo con corrientes de fuga sumadas — medir el sistema completo, nunca equipo por equipo'
      ]
    },
    conclusion:{
      caso:'En una colecistectomía laparoscópica rutinaria, el cirujano visualizó la anatomía biliar con claridad normal en luz blanca 4K y avanzó con confianza en la disección. Como paso adicional de seguridad, antes de clipar el conducto cístico activó el modo de fluorescencia ICG del sistema — recientemente adquirido por el hospital precisamente para reducir el riesgo de lesión de vía biliar — pero el procesador no mostró ninguna señal de fluorescencia, como si el colorante nunca hubiera sido administrado. El caso se completó con la técnica estándar sin usar la fluorescencia, sin incidente para el paciente, pero el hallazgo generó una revisión técnica inmediata del carro de endoscopía. La ingeniería biomédica determinó que la óptica rígida instalada era perfectamente apta para laparoscopía estándar en luz blanca, pero no tenía el tratamiento antirreflejo necesario para transmitir la banda NIR de 830 nm — un detalle que la especificación de compra del carro nunca exigió. El hospital había invertido en la fuente de luz NIR y en el cabezal de cámara compatible con ICG, pero la óptica, el único componente que faltaba verificar, bloqueaba por completo la emisión de fluorescencia antes de que llegara al sensor.',
      lecciones:[
        'La fluorescencia NIR requiere que TODOS los componentes sean compatibles: fuente + cabezal + procesador + óptica — un solo componente incompatible inhabilita todo el sistema',
        'La calibración del insuflador es crítica para la seguridad: una presión indicada mayor que la real puede causar daño vascular o ventilatorio sin alarma',
        'El cable de luz es la causa #1 de imagen oscura y debe ser el primer componente a intercambiar — no la fuente',
        'La infección cruzada en endoscopía flexible es el riesgo #1 del servicio: la inspección visual no detecta residuos; se requiere verificación con ATP o proteína'
      ],
      normas:[
        ['IEC 60601-1 cl. 16','Sistema electromédico: verificación del sistema completo (corrientes de fuga sumadas de todos los módulos del carro)'],
        ['IEC 60601-2-18','Requisitos para accesorios de endoscopía'],
        ['IEC 62353','Pruebas periódicas de seguridad eléctrica en mantenimiento'],
        ['ANSI/AAMI ST91:2021','Reprocesamiento de endoscopios flexibles — secuencia obligatoria, AER, trazabilidad'],
        ['AAMI ST108:2023','Calidad del agua para el reprocesamiento de dispositivos médicos'],
        ['ISO 14971','Gestión de riesgos para dispositivos médicos']
      ]
    }
  },
  { num:6, icon:'🫀', img:imgBomba, video:undefined as string|undefined, name:'Bomba de CEC', color:'#fb923c', desc:'Sistema corazón-pulmón artificial que sustituye temporalmente la función de bombeo y oxigenación durante cirugía cardíaca a corazón abierto — el único equipo cuya falla de segundos es incompatible con la vida del paciente',
    intro:{
      que:'Circulación extracorpórea (CEC) / Cardiopulmonary Bypass (CPB): técnica mediante la cual un sistema mecánico sustituye temporalmente las funciones del corazón y de los pulmones, desviando la sangre venosa fuera del organismo para oxigenarla, eliminar CO₂, controlar su temperatura y devolverla al sistema arterial. Permite detener el corazón y operar en campo exangüe e inmóvil. Primera cirugía exitosa con CEC: John Gibbon, 6 de mayo de 1953.',
      funciones:[
        'Bombear la sangre (corazón artificial): bomba arterial de rodillo o centrífuga, flujo 4–6 L/min',
        'Oxigenar y eliminar CO₂ (pulmón artificial): oxigenador de membrana de fibras huecas + mezclador de gases',
        'Controlar la temperatura corporal: intercambiador de calor integrado + unidad de hipotermia/normotermia',
        'Filtrar émbolos gaseosos y particulados: filtro arterial 20–40 µm antes del paciente',
        'Proteger el miocardio durante el paro cardíaco: sistema de cardioplejía (solución rica en K⁺)'
      ],
      apps:['Cirugía de válvulas cardíacas','Bypass coronario (CABG)','Corrección de cardiopatías congénitas','Cirugía de aorta y grandes vasos','Trasplante cardíaco','ECMO (soporte extracorpóreo prolongado)']
    },
    principio:{
      concepto:'La CEC es el único equipo del quirófano donde la física, la fisiología y la ingeniería de seguridad convergen con consecuencias de vida o muerte en tiempo real. Principio de la bomba de rodillo: dos rodillos comprimen un segmento de tubo contra una pista semicircular, desplazando el volumen contenido (flujo = volumen del tubo × RPM). El ajuste de oclusión "casi oclusiva" es crítico: con la línea arterial elevada ~75–100 cm, la columna debe descender ~1 cm/min. Exceso: hemólisis + spallation. Defecto: flujo real menor al calculado.',
      bloques:[
        'Cánula venosa → drenaje por gravedad (40–70 cm bajo el paciente) → reservorio venoso',
        'Bomba arterial (rodillo o centrífuga) → oxigenador de membrana + intercambiador de calor',
        'Filtro arterial 20–40 µm + detector de burbujas + sensor de presión → cánula arterial → paciente',
        'Líneas auxiliares: cardioplejía, succión de campo → cardiotomía, vent ventricular → reservorio',
        'Dispositivos de seguridad: sensor de nivel, pinza automática de línea, UPS, manivela manual por bomba'
      ],
      principios:[
        ['Bomba de rodillo vs centrífuga','Rodillo: desplazamiento positivo, flujo = RPM × volumen de tubo, puede generar presión ilimitada ante oclusión. Centrífuga: autolimitada en presión, requiere flujómetro ultrasónico obligatorio, puede fluir en reversa si se detiene sin pinzar la línea. Uso: rodillo para CEC convencional y cardioplejía; centrífuga para ECMO y perfusiones largas.'],
        ['Oxigenador de membrana de fibras huecas','Haz de fibras microporosas de polimetilpenteno (PMP): gas por dentro, sangre por fuera. Área ~1.5–2.5 m². Dos controles independientes: FiO₂ controla la PaO₂ (como O₂ del ventilador); flujo de barrido (sweep gas) controla la PaCO₂ (como volumen minuto). Son independientes.'],
        ['Gradiente térmico y riesgo de microembolia','REGLA DE ORO: gradiente agua-sangre ≤ 10 °C; agua de recalentamiento ≤ 37–38 °C. La solubilidad del O₂ disminuye al calentar: un gradiente excesivo hace que el O₂ disuelto salga de solución formando microburbujas dentro del circuito → microembolia gaseosa cerebral. Física pura aplicada a seguridad del paciente.'],
        ['Arquitectura de redundancia por independencia','Cada módulo de bomba puede trabajar de forma autónoma — sin punto de falla central. Es el diseño tolerante a fallos más importante en equipamiento médico. Más la manivela manual de emergencia en cada rodillo, el UPS interno y el detector de burbujas con pinza automática de línea.']
      ]
    },
    componentes:[
      ['Bomba arterial principal','Rodillo (CEC convencional) o centrífuga (ECMO, cirugía de aorta); cada módulo es independiente y tiene manivela manual de emergencia'],
      ['Oxigenador de membrana + intercambiador de calor','Fibras huecas PMP; área 1.5–2.5 m²; intercambiador de calor integrado (agua nunca en contacto con sangre)'],
      ['Reservorio venoso','Abierto/rígido (con cardiotomía, interfase sangre-aire) o cerrado/colapsable (MiECC, ECMO, sin interfase); el vaciamiento es la vía más rápida de embolia masiva'],
      ['Filtro arterial 20–40 µm','Última barrera antes del paciente; línea de purga permanente al reservorio para drenar burbujas continuas'],
      ['Detector de burbujas ultrasónico','Detecta aire en la línea arterial; detiene la bomba y/o cierra la pinza automática — dispositivo de seguridad obligatorio'],
      ['Sensor de nivel del reservorio','Alarma y reducción de la bomba antes del vaciamiento — su falla o su silenciamiento es la causa más común de embolia gaseosa masiva'],
      ['Sistema de cardioplejía','Solución rica en K⁺ para detener el corazón en diástole; bomba independiente; controla flujo, presión, temperatura y relación de mezcla'],
      ['Monitor de gases en línea (CDI)','Mide SvO₂, hematocrito, pH, PaO₂, PaCO₂, K⁺ en tiempo real en la línea de sangre'],
      ['UPS + manivelas manuales','UPS con autonomía declarada y probada periódicamente; manivela manual obligatoria en cada bomba de rodillo — sin esto no se puede usar el equipo']
    ],
    manejo:{
      antes:[
        'Lista de chequeo pre-bomba ESCRITA con verificación cruzada: integridad del circuito montado, cebado sin burbujas visibles, prueba de todos los dispositivos de seguridad',
        'Probar cada manivela manual con la bomba montada — es el último recurso ante falla eléctrica total',
        'Verificar la carga real del UPS bajo carga (no solo que "indique lleno") y las fuentes de O₂ y CO₂',
        'Ajuste de oclusión de cada bomba de rodillo: columna de 75–100 cm debe descender ~1 cm/min (ni más ni menos)',
        'Confirmar que el detector de burbujas y el sensor de nivel están activos y no silenciados — nunca desactivar estos dispositivos'
      ],
      durante:[
        'Mantener índice cardíaco 2.2–2.4 L/min/m², PAM 50–80 mmHg y SvO₂ > 65 % durante toda la perfusión',
        'Gradiente agua-sangre en el intercambiador ≤ 10 °C; agua de recalentamiento ≤ 37–38 °C — no acelerar el recalentamiento',
        'Monitorizar ACT cada 20–30 min; mantener > 400–480 s durante toda la CEC',
        'Ante falla eléctrica: manivelas manuales de inmediato; ante embolia gaseosa: parada, pinzado, Trendelenburg, purga, retroperfusión',
        'Mantener la máquina de respaldo verificada y disponible durante toda la cirugía'
      ],
      despues:[
        'El circuito sanguíneo completo (oxigenador, reservorio, tubería, filtros, cánulas, cabezal centrífugo) se descarta íntegro como residuo biopeligroso — NUNCA reutilizar ni reesterilizar',
        'Desinfección de la consola y pistas según protocolo; desinfección programada del circuito de agua de la unidad térmica',
        'Documentar todos los parámetros de la perfusión en el registro de CEC (flujo, presión, temperatura, gases, ACT, eventos)'
      ]
    },
    marcas:{
      headers:['Criterio','Sistema LivaNova','Sistema Getinge/Maquet','Sistema Terumo'],
      rows:[
        ['Consola principal','Stöckert S5 / Essenz','HL30','Sarns System 1 / APS-1'],
        ['Bomba centrífuga','Revolution','Rotaflow','Capiox'],
        ['Oxigenador','Inspire','Quadrox','Capiox FX'],
        ['Monitor de gases','Integrado / CDI compatible','CDI 500 (Terumo)','CDI 500'],
        ['Modularidad','3–5 bombas rodillo + centrífuga, montaje flexible','Hasta 6 módulos','Hasta 8 bombas (2 centrífugas)'],
        ['Punto diferenciador','Sin punto central de falla; módulos 100 % independientes','Oxigenador Quadrox: referencia en ECMO','Calibración de oclusión con retroalimentación audible en marcha']
      ]
    },
    mantenimiento:{
      preventivo:[
        ['Antes de cada caso','Lista de chequeo escrita con verificación cruzada: circuito, cebado, dispositivos de seguridad, manivelas, UPS, gases, sensores calibrados'],
        ['Mensual','Ajuste de oclusión de cada bomba de rodillo (prueba de caída de columna); prueba funcional del detector de burbujas y sensor de nivel con simuladores; verificación de pinzas automáticas'],
        ['Trimestral','Calibración de flujo por comparación gravimétrica (bombear volumen conocido en tiempo medido vs. lectura del panel); calibración de sensores de presión y temperatura con patrones trazables; verificación del mezclador y analizador de O₂'],
        ['Semestral','Prueba real de autonomía del UPS bajo carga — no solo "indicador de carga"; verificación de tiempos de respuesta de dispositivos de seguridad; IEC 62353 del sistema completo; muestreo microbiológico del agua de la unidad térmica'],
        ['Semanal','Desinfección del circuito de agua de la unidad de hipotermia según protocolo OEM; inspección de mangueras de agua'],
        ['Anual','Servicio mayor OEM: baterías, escobillas/rodamientos de motores, pistas de rodillo desgastadas, sellos; firmware; recalibración integral con certificado']
      ],
      pruebas:[
        'Prueba de caída de columna: oclusión de rodillo ajustada a ~1 cm/min con columna de 75–100 cm',
        'Verificación gravimétrica del flujo: bombear volumen conocido en tiempo medido, comparar con lectura del panel',
        'Prueba real de autonomía del UPS bajo carga real de la máquina (no solo indicador visual)',
        'Prueba de cada manivela manual con la bomba montada en la pista',
        'Prueba del detector de burbujas con simulador de burbuja; verificación de la pinza automática de línea',
        'Muestreo microbiológico del agua del circuito de hipotermia (vigilancia de M. chimaera y NTM)'
      ],
      realizar:[
        'Programar el MP con el servicio de cirugía cardíaca: la máquina sale formalmente fuera de servicio y la de respaldo debe estar verificada y disponible',
        'Nunca improvisar en este equipo — toda intervención debe seguir un protocolo escrito aprobado',
        'Manejar el circuito usado como residuo biopeligroso con EPP completo (bata impermeable, doble guante, protección facial)'
      ],
      evitar:[
        'Nunca introducir dedos ni herramientas en una pista de rodillo energizada — atrapamiento mecánico inmediato',
        'Nunca silenciar ni desactivar el detector de burbujas ni el sensor de nivel — es la primera causa de embolia gaseosa masiva prevenible',
        'Nunca reutilizar, reesterilizar ni "recuperar" componentes del circuito sanguíneo — no existe justificación económica',
        'Nunca iniciar o finalizar un caso sin la prueba de autonomía real del UPS verificada'
      ]
    },
    fallas:{
      tabla:[
        ['Embolia gaseosa masiva','Vaciamiento del reservorio; aire en línea venosa; rodillo bombeando aire; recalentamiento con gradiente > 10 °C — PARADA INMEDIATA, pinzado, Trendelenburg, purga, retroperfusión'],
        ['Falla eléctrica total','Corte de red + falla del UPS — manivelas manuales de inmediato; prueba periódica del UPS es obligatoria'],
        ['Presión de línea arterial elevada','Cánula acodada, mal posicionada o pinza olvidada; disección aórtica — alarma de presión + verificación de la cánula'],
        ['Falla de oxigenación','Oxigenador saturado, trombosado o con fuga de plasma; desconexión de gas; mezclador en falla — cambio de oxigenador de emergencia (procedimiento ensayado)'],
        ['Hemólisis excesiva','Oclusión mal ajustada (causa #1); succiones a alta presión; turbulencia — ajustar oclusión; reducir vacío; vigilar hemoglobina libre'],
        ['Reflujo por bomba centrífuga detenida','Bomba parada sin pinzar la línea — PINZAR SIEMPRE antes de detener una centrífuga'],
        ['Alarma silenciada / dispositivo desactivado','Práctica inadecuada — nunca desactivar dispositivos de seguridad; auditoría de configuración en el MP'],
        ['Contaminación por M. chimaera / NTM','Biofilm en el circuito de agua de la unidad térmica; infección aparece meses o años después — desinfección programada, agua tratada, escape fuera del quirófano']
      ],
      paciente:[
        'Embolia gaseosa cerebral: causa principal de ictus y disfunción neurocognitiva postoperatoria — el detector de burbujas y el sensor de nivel son la primera línea de defensa',
        'Respuesta inflamatoria sistémica (SIRS): contacto de la sangre con superficies no endoteliales activa complemento, leucocitos y plaquetas — circuitos biocompatibles y minimizar tiempo de CEC',
        'Hemólisis: estrés mecánico por oclusión mal ajustada, succiones a alta presión o turbulencia — monitorizar hemoglobina libre en perfusiones largas',
        'Infección tardía por micobacterias no tuberculosas (M. chimaera): el aerosol del ventilador de la unidad térmica puede contaminar el campo quirúrgico; la infección aparece 1–3 años después de la cirugía'
      ],
      biomedico:[
        'Biológico: circuito con grandes volúmenes de sangre; EPP completo (bata impermeable, doble guante, protección facial); vacunación contra hepatitis B obligatoria',
        'Mecánico: rodillos y pistas en movimiento a alta velocidad — nunca introducir dedos ni herramientas en una pista energizada; bloqueo antes de intervenir',
        'Psicológico: intervención sobre el único equipo cuya falla de segundos es incompatible con la vida — nunca improvisar; protocolo escrito; nunca intervenir con un caso programado inminente sin plan de contingencia documentado',
        'Eléctrico: consola multi-módulo, UPS y banco de baterías con alta corriente de cortocircuito — LOTO, retirar joyas, aislar terminales'
      ]
    },
    conclusion:{
      caso:'Durante una cirugía de reemplazo valvular aórtico ya en circulación extracorpórea, la alarma del sensor de nivel del reservorio venoso comenzó a activarse repetidamente por falsos positivos asociados a la turbulencia normal del retorno venoso. Unos 20 minutos antes del evento, el perfusionista decidió silenciar la alarma para poder concentrarse en el manejo de la perfusión sin la interrupción constante del sonido — una decisión tomada bajo presión, sin protocolo escrito que la respaldara. Poco después se produjo una desconexión parcial, no evidente a simple vista, en la línea de la cánula venosa; el nivel del reservorio comenzó a bajar rápidamente y, sin el sensor activo para detenerla, la bomba de rodillo continuó bombeando con normalidad hasta que el nivel cayó por debajo del mínimo seguro, impulsando aire hacia la línea arterial y hacia el paciente durante aproximadamente 4 segundos antes de que el equipo lo notara por observación directa y detuviera la bomba. Se ejecutaron de inmediato las maniobras de rescate: pinzado de la línea, Trendelenburg y purga del circuito. El paciente sobrevivió a la cirugía pero quedó con déficits neurológicos permanentes atribuidos a la embolia gaseosa cerebral. La investigación posterior al evento identificó el silenciamiento del sensor de nivel, sin procedimiento de respaldo ni límite de tiempo, como la causa raíz técnica directa.',
      lecciones:[
        'El detector de burbujas y el sensor de nivel no son "alarmas molestas" — son los únicos dispositivos que pueden detener la bomba antes de que el aire llegue al cerebro; nunca silenciarlos',
        'La prueba real de autonomía del UPS bajo carga real no es opcional — la batería que "indica carga" pero no sostiene la máquina en el quirófano es un dispositivo de seguridad fallido',
        'La verificación gravimétrica del flujo de la bomba de rodillo (no solo leer las RPM) es la única forma de detectar una oclusión incorrecta antes de que cause hemólisis',
        'M. chimaera: la infección por micobacterias del circuito de agua de la unidad térmica puede tardar 1–3 años en manifestarse — la desinfección programada es responsabilidad directa del biomédico'
      ],
      normas:[
        ['IEC 60601-1','Seguridad eléctrica general de equipos electromédicos'],
        ['ISO 7199','Oxigenadores e intercambiadores de gas sanguíneo para CEC (edición vigente)'],
        ['IEC 62353','Pruebas periódicas de seguridad eléctrica en mantenimiento del sistema completo'],
        ['ISO 14971','Gestión de riesgos para dispositivos médicos'],
        ['Guías EACTS/EACTAIC/EBCP 2024','Circulación extracorpórea en cirugía cardíaca de adultos — estándar clínico de referencia actual'],
        ['ANSI/AAMI/ISO 10651-4','Dispositivos de soporte cardiopulmonar']
      ]
    }
  },
]

// Fotos reales de referencia (manual del fabricante) — solo disponibles para
// Máquina de Anestesia por ahora. Va antes del registro porque éste decide con
// ella si el equipo lleva o no su lámina de fotos.
const COMPONENT_PHOTOS: Record<number, { src:string; label:string }[]> = {
  0: [
    { src: imgAnestesiaCircuito, label: 'Bolsa reservorio, absorbedor de CO₂ y vaporizador' },
    { src: imgAnestesiaConector, label: 'Conexión de cilindro — Yugo / PISS' },
  ],
}

// ─── slide registry ───────────────────────────────────────────────────────────
// Cada entrada es *una escena*: una idea, una composición. Donde antes una
// lámina apilaba el caso real, las lecciones y las normativas en tres columnas,
// ahora hay dos o tres láminas. El texto es exactamente el mismo — lo que se
// reparte es la carga, para que cada golpe visual se lea desde la última fila.
type SEntry = { type:string; ei?:number }
const EQUIPO_BLOCKS: SEntry[][] = EQUIPOS.map((e,i) => [
  {type:'equipo-cover',ei:i},
  {type:'intro-que',ei:i}, {type:'intro-func',ei:i},
  {type:'principio-concepto',ei:i}, {type:'principio-ppios',ei:i},
  {type:'componentes',ei:i},
  ...(COMPONENT_PHOTOS[i] ? [{type:'componentes-fotos',ei:i}] : []),
  {type:'manejo-antes',ei:i}, {type:'manejo-durante',ei:i},
  {type:'marcas',ei:i},
  {type:'mant-calendario',ei:i}, {type:'mant-pruebas',ei:i}, {type:'mant-limpieza',ei:i},
  {type:'fallas-tabla',ei:i}, {type:'fallas-riesgos',ei:i},
  {type:'conclusion-caso',ei:i}, {type:'conclusion-cierre',ei:i},
  ...(e.video ? [{type:'video',ei:i}] : []),
])
const ALL_SLIDES: SEntry[] = [
  { type:'cover' }, { type:'index' },
  ...EQUIPO_BLOCKS.flat(),
  { type:'cuadro' },
]
const TOTAL = ALL_SLIDES.length
// starting slide index (in ALL_SLIDES) of each equipo's block
const EQUIPO_STARTS: number[] = (() => {
  let idx = 2
  return EQUIPO_BLOCKS.map(block => { const s = idx; idx += block.length; return s })
})()

// ─── CSS ──────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  button:focus{outline:none;}
  ::-webkit-scrollbar{width:3px;}
  ::-webkit-scrollbar-track{background:transparent;}
  ::-webkit-scrollbar-thumb{background:rgba(0,212,255,0.2);border-radius:2px;}

  /* ECG scroll */
  @keyframes ecgScroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  @keyframes ecgScroll2{from{transform:translateX(-50%)}to{transform:translateX(0)}}

  /* Circuit trace pulse */
  @keyframes tracePulse{0%,100%{stroke-opacity:0.06}50%{stroke-opacity:0.16}}

  /* Per-equipo hero band animations */
  @keyframes bgThemeFadeIn{0%{opacity:0}100%{opacity:1}}
  @keyframes rayPulse{0%,100%{opacity:0.06}50%{opacity:0.22}}
  @keyframes irisPulse{0%,100%{transform:scale(0.9);opacity:0.08}50%{transform:scale(1.06);opacity:0.24}}
  @keyframes tableSway{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}
  @keyframes scanSweep{0%{top:0%;opacity:0}10%{opacity:0.6}90%{opacity:0.6}100%{top:100%;opacity:0}}
  @keyframes flowDash{to{stroke-dashoffset:-200}}

  /* Cell particles */
  @keyframes twinkle{0%,100%{opacity:0.15;transform:scale(1)}50%{opacity:0.55;transform:scale(1.3)}}
  @keyframes drift{0%{transform:translate(0,0)}25%{transform:translate(5px,-7px)}50%{transform:translate(-4px,-12px)}75%{transform:translate(-7px,-4px)}100%{transform:translate(0,0)}}

  /* Cross glow */
  @keyframes crossGlow{0%,100%{opacity:0.05}50%{opacity:0.13}}

  /* ── Slide transition variants ── */
  @keyframes enterRight{0%{opacity:0;transform:translateX(70px) scale(0.95);filter:blur(10px)}60%{filter:blur(0)}100%{opacity:1;transform:translateX(0) scale(1);filter:blur(0)}}
  @keyframes enterLeft{0%{opacity:0;transform:translateX(-70px) scale(0.95);filter:blur(10px)}60%{filter:blur(0)}100%{opacity:1;transform:translateX(0) scale(1);filter:blur(0)}}
  @keyframes exitLeft{0%{opacity:1;transform:translateX(0) scale(1)}100%{opacity:0;transform:translateX(-60px) scale(0.96);filter:blur(8px)}}
  @keyframes exitRight{0%{opacity:1;transform:translateX(0) scale(1)}100%{opacity:0;transform:translateX(60px) scale(0.96);filter:blur(8px)}}
  /* Zoom — cover & conclusion */
  @keyframes zoomIn{0%{opacity:0;transform:scale(0.86);filter:blur(16px)}65%{filter:blur(0)}100%{opacity:1;transform:scale(1)}}
  @keyframes zoomOut{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(1.12);filter:blur(14px)}}
  /* Circle wipe — index */
  @keyframes clipReveal{0%{clip-path:circle(0% at 50% 50%);opacity:0.5}100%{clip-path:circle(150% at 50% 50%);opacity:1}}
  @keyframes clipOut{0%{clip-path:circle(150% at 50% 50%)}100%{clip-path:circle(0% at 50% 50%);opacity:0}}
  /* Vertical rise — equipo-cover */
  @keyframes slideUp{0%{opacity:0;transform:translateY(60px) scale(0.96);filter:blur(8px)}65%{filter:blur(0)}100%{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes slideOutDown{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(50px) scale(0.97);filter:blur(8px)}}
  /* Perspective flip — principio */
  @keyframes flipIn{0%{opacity:0;transform:perspective(800px) rotateY(22deg) scale(0.93);filter:blur(8px)}70%{filter:blur(0)}100%{opacity:1;transform:perspective(800px) rotateY(0) scale(1)}}
  @keyframes flipOut{0%{opacity:1;transform:perspective(800px) rotateY(0)}100%{opacity:0;transform:perspective(800px) rotateY(-20deg) scale(0.95);filter:blur(8px)}}
  /* Vertical drop — mantenimiento */
  @keyframes dropIn{0%{opacity:0;transform:translateY(-55px) scale(0.96);filter:blur(8px)}65%{filter:blur(0)}100%{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes dropOut{0%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-45px);filter:blur(8px)}}
  /* Skew reveal — intro */
  @keyframes skewIn{0%{opacity:0;transform:perspective(900px) rotateX(14deg) translateY(36px) scale(0.94);filter:blur(9px)}70%{filter:blur(0)}100%{opacity:1;transform:perspective(900px) rotateX(0) translateY(0) scale(1)}}
  @keyframes skewOut{0%{opacity:1;transform:perspective(900px) rotateX(0) translateY(0) scale(1)}100%{opacity:0;transform:perspective(900px) rotateX(-10deg) translateY(-24px) scale(0.96);filter:blur(9px)}}
  /* Scale-grid pop — componentes */
  @keyframes scaleGridIn{0%{opacity:0;transform:scale(1.16);filter:blur(12px)}60%{filter:blur(0)}100%{opacity:1;transform:scale(1)}}
  @keyframes scaleGridOut{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(0.88);filter:blur(10px)}}
  /* Split reveal — manejo/marcas */
  @keyframes splitIn{0%{opacity:0;transform:translateX(0) scaleX(0.9);clip-path:inset(0 42% 0 42%);filter:blur(8px)}65%{filter:blur(0)}100%{opacity:1;transform:scaleX(1);clip-path:inset(0 0 0 0)}}
  @keyframes splitOut{0%{opacity:1;clip-path:inset(0 0 0 0)}100%{opacity:0;clip-path:inset(0 46% 0 46%);filter:blur(8px)}}

  /* ── In-slide element animations ── */
  @keyframes elemFadeUp{0%{opacity:0;transform:translateY(24px) scale(0.97)}100%{opacity:1;transform:translateY(0) scale(1)}}
  @keyframes elemFadeRight{0%{opacity:0;transform:translateX(-20px)}100%{opacity:1;transform:translateX(0)}}
  @keyframes rowFadeIn{0%{opacity:0;transform:translateX(-12px)}100%{opacity:1;transform:translateX(0)}}
  @keyframes titleReveal{0%{opacity:0;transform:translateY(-14px)}100%{opacity:1;transform:translateY(0)}}
  @keyframes tagBounce{0%{opacity:0;transform:scale(0.78) translateY(10px)}70%{transform:scale(1.06) translateY(-2px)}100%{opacity:1;transform:scale(1) translateY(0)}}
  @keyframes blockPop{0%{opacity:0;transform:scaleY(0.85) translateY(8px)}70%{transform:scaleY(1.03) translateY(-1px)}100%{opacity:1;transform:scaleY(1) translateY(0)}}
  @keyframes lineDraw{0%{transform:scaleX(0);opacity:0;transform-origin:left}100%{transform:scaleX(1);opacity:1;transform-origin:left}}
  @keyframes badgeSlide{0%{opacity:0;transform:translateX(20px)}100%{opacity:1;transform:translateX(0)}}
  @keyframes coverWord{0%{opacity:0;transform:translateY(30px) skewY(3deg)}100%{opacity:1;transform:translateY(0) skewY(0)}}
  @keyframes coverSub{0%{opacity:0;transform:translateY(18px)}100%{opacity:1;transform:translateY(0)}}

  /* Equipo cover icon float */
  @keyframes iconFloat{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-10px) scale(1.05)}}

  /* Pulse dot */
  @keyframes pulseDot{0%,100%{box-shadow:0 0 0 0 rgba(0,212,255,0.5),0 0 8px rgba(0,212,255,0.8)}50%{box-shadow:0 0 0 5px rgba(0,212,255,0),0 0 16px rgba(0,212,255,0.4)}}

  /* Index card hover */
  .idx-card{transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1)!important;}
  .idx-card:hover{transform:translateY(-6px) scale(1.02)!important;}

  /* Content card hover glow — used across intro/principio/componentes/manejo/mantenimiento/conclusion */
  .glow-card{transition:transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease, border-color 0.35s ease;}
  .glow-card:hover{transform:translateY(-5px) scale(1.012);border-color:var(--accent,${C.cyan})!important;box-shadow:0 14px 40px rgba(0,0,0,0.45), 0 0 28px var(--accent-glow,rgba(0,212,255,0.35)), inset 0 1px 0 var(--accent,${C.cyan})33!important;}

  /* Zoomable image — click to view fullscreen */
  .zoomable-img{transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease;}
  .zoomable-img:hover{transform:scale(1.015);}
  .zoomable-img:hover .zoom-hint{opacity:1!important;}
  @keyframes lightboxFadeIn{0%{opacity:0}100%{opacity:1}}
  @keyframes lightboxZoomIn{0%{opacity:0;transform:scale(0.92)}100%{opacity:1;transform:scale(1)}}

  /* ── COMPOSICIÓN EDITORIAL ──────────────────────────────────
     Las láminas se componen en absoluto sobre un escenario de
     1440×810: nada está contenido en tarjetas, así que la entrada
     de cada elemento es lo único que ordena la lectura. Una sola
     entrada fuerte por lámina (el título); el resto llega detrás,
     con 50 ms de separación, para que la escena se lea de una vez
     y no se vea "armarse" pieza por pieza.
  ─────────────────────────────────────────────────────────── */
  .font-display{font-family:'Playfair Display',serif;}
  .font-mono{font-family:'JetBrains Mono',monospace;}
  .select-none{user-select:none;}

  @keyframes riseIn{from{opacity:0;transform:translateY(26px);filter:blur(7px)}to{opacity:1;transform:translateY(0);filter:blur(0)}}
  @keyframes driftIn{from{opacity:0;transform:translateX(-34px);filter:blur(7px)}to{opacity:1;transform:translateX(0);filter:blur(0)}}
  @keyframes driftInRight{from{opacity:0;transform:translateX(34px);filter:blur(7px)}to{opacity:1;transform:translateX(0);filter:blur(0)}}
  /* El título se descubre de izquierda a derecha, como un rótulo
     que se ilumina. Es el único gesto ruidoso que se permite. */
  @keyframes wipeIn{from{opacity:0;clip-path:inset(0 100% 0 0);transform:translateY(14px)}to{opacity:1;clip-path:inset(0 -12% 0 0);transform:translateY(0)}}
  @keyframes bloomIn{from{opacity:0;transform:scale(1.06);filter:blur(14px)}to{opacity:1;transform:scale(1);filter:blur(0)}}
  @keyframes plateIn{from{opacity:0;transform:scale(1.09)}to{opacity:1;transform:scale(1)}}
  @keyframes spanIn{from{transform:scaleX(0)}to{transform:scaleX(1)}}
  @keyframes spanInY{from{transform:scaleY(0)}to{transform:scaleY(1)}}
  @keyframes strokeIn{from{stroke-dashoffset:var(--len,1200)}to{stroke-dashoffset:0}}
  /* La palabra fantasma sube hasta SU propia opacidad, no hasta 1:
     una animación CSS gana sobre el estilo en línea, y un
     to{opacity:1} dejaría el numeral gigante del fondo a plena luz. */
  @keyframes ghostIn{from{opacity:0;transform:translateY(40px) scale(1.04)}to{opacity:var(--ghost-o,1);transform:translateY(0) scale(1)}}
  @keyframes driftLoop{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-22px,16px) scale(1.05)}66%{transform:translate(18px,-14px) scale(0.97)}}

  .rise{opacity:0;animation:riseIn 0.62s cubic-bezier(0.22,1,0.36,1) both;}
  .drift{opacity:0;animation:driftIn 0.62s cubic-bezier(0.22,1,0.36,1) both;}
  .drift-r{opacity:0;animation:driftInRight 0.62s cubic-bezier(0.22,1,0.36,1) both;}
  .wipe{opacity:0;animation:wipeIn 0.85s cubic-bezier(0.22,1,0.36,1) both;}
  .bloom{opacity:0;animation:bloomIn 0.75s cubic-bezier(0.22,1,0.36,1) both;}
  .plate{opacity:0;animation:plateIn 1.10s cubic-bezier(0.22,1,0.36,1) both;}
  .ghost-in{opacity:0;animation:ghostIn 1.20s cubic-bezier(0.22,1,0.36,1) both;}
  .span-x{transform-origin:left center;animation:spanIn 0.75s cubic-bezier(0.22,1,0.36,1) both;}
  .span-y{transform-origin:top center;animation:spanInY 0.85s cubic-bezier(0.22,1,0.36,1) both;}
  .stroke-in{animation:strokeIn 1.4s cubic-bezier(0.22,1,0.36,1) both;}
  .drift-loop{animation:driftLoop 16s ease-in-out infinite;}

  /* Una foto a sangre no lleva marco: se disuelve en el fondo por
     el lado que da hacia adentro de la composición. */
  .fade-l{-webkit-mask-image:linear-gradient(90deg,transparent 0%,#000 26%,#000 100%);mask-image:linear-gradient(90deg,transparent 0%,#000 26%,#000 100%);}
  .fade-r{-webkit-mask-image:linear-gradient(270deg,transparent 0%,#000 26%,#000 100%);mask-image:linear-gradient(270deg,transparent 0%,#000 26%,#000 100%);}
  .fade-lb{-webkit-mask-image:linear-gradient(75deg,transparent 0%,#000 34%,#000 100%);mask-image:linear-gradient(75deg,transparent 0%,#000 34%,#000 100%);}
  .fade-rb{-webkit-mask-image:linear-gradient(285deg,transparent 0%,#000 34%,#000 100%);mask-image:linear-gradient(285deg,transparent 0%,#000 34%,#000 100%);}

  @media (prefers-reduced-motion: reduce){
    .rise,.drift,.drift-r,.wipe,.bloom,.plate,.ghost-in,.span-x,.span-y,.stroke-in{animation-duration:0.01ms!important;animation-delay:0ms!important;}
    .drift-loop{animation:none!important;}
  }
`

// ─── ANIMATED BACKGROUND ─────────────────────────────────────────────────────
// ─── scrolling waveform path builder ───────────────────────────────────────────
function buildScrollPath(unit: string, unitWidth: number, count: number, offset = 0) {
  return Array.from({length:count},(_,i)=>
    unit.replace(/(-?\d+\.?\d*),(-?\d+\.?\d*)/g,(_,x,y)=>`${+x+(offset+i)*unitWidth},${y}`)
  ).join(' ')
}
// ECG waveform path — one unit = 320px wide, baseline at y=45, total h=80
// Represents: isoelectric → P wave → PR → QRS complex → ST → T wave → isoelectric
const ECG_UNIT = "M0,45 L70,45 L78,41 L86,33 L94,41 L110,45 L115,47 L120,4 L125,68 L130,45 L142,38 L152,28 L162,38 L200,45 L320,45"
const ECG_PATH = buildScrollPath(ECG_UNIT, 320, 8) + ' ' + buildScrollPath(ECG_UNIT, 320, 8, 8)
// RF / electrosurgery spark burst — sharp narrow spikes (high-frequency energy delivery)
const RF_UNIT = "M0,40 L60,40 L64,10 L68,65 L72,18 L76,58 L80,25 L84,50 L88,40 L160,40 L164,12 L168,64 L172,40 L320,40"
const RF_PATH = buildScrollPath(RF_UNIT, 320, 8) + ' ' + buildScrollPath(RF_UNIT, 320, 8, 8)
// CEC circulation loop — closed rounded rectangle path (tubing loop)
const CEC_LOOP = "M40,20 H260 A20,20 0 0 1 280,40 V60 A20,20 0 0 1 260,80 H40 A20,20 0 0 1 20,60 V40 A20,20 0 0 1 40,20 Z"

// Per-equipo background theme: hero band + calibration labels + accent shapes
const BG_THEMES = [
  { labels:['SpO₂','ECG','bpm','mmHg','EtCO₂'] },                 // 0 anestesia
  { labels:['lux','Ra CRI','CCT K','W','Ec'] },                    // 1 lámpara
  { labels:['kHz','W','Ω','mA','CQM'] },                           // 2 electrocirugía
  { labels:['kg','°','mm','Trend.','PSI'] },                       // 3 mesa
  { labels:['fps','lux','CO₂','mmHg','4K'] },                      // 4 torre endoscopía
  { labels:['L/min','ACT','SvO₂','°C','Hct'] },                    // 5 bomba CEC
]
const DEFAULT_LABELS = ['SpO₂','ECG','bpm','mmHg','EtCO₂']

function HeroBand({ theme, accentColor }: { theme:number; accentColor:string }) {
  // 0 = Máquina de Anestesia · undefined/-1 = generic slides (cover/index/cuadro)
  if (theme === undefined || theme < 0 || theme === 0) {
    return (
      <>
        <div style={{ position:'absolute', top:'28%', left:0, width:'100%', height:80, overflow:'hidden' }}>
          <svg style={{ position:'absolute', width:'200%', height:80, animation:'ecgScroll 10s linear infinite' }}
               viewBox={`0 0 ${8*320*2} 80`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="ecgGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={accentColor} stopOpacity="0"/>
                <stop offset="15%" stopColor={accentColor} stopOpacity="0.35"/>
                <stop offset="85%" stopColor={accentColor} stopOpacity="0.35"/>
                <stop offset="100%" stopColor={accentColor} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d={ECG_PATH} fill="none" stroke="url(#ecgGrad1)" strokeWidth="1.5"/>
          </svg>
        </div>
        <div style={{ position:'absolute', top:'65%', left:0, width:'100%', height:60, overflow:'hidden', opacity:0.4 }}>
          <svg style={{ position:'absolute', width:'200%', height:60, animation:'ecgScroll2 14s linear infinite' }}
               viewBox={`0 0 ${8*320*2} 80`} preserveAspectRatio="none">
            <path d={ECG_PATH} fill="none" stroke={accentColor} strokeWidth="0.8" strokeOpacity="0.2"/>
          </svg>
        </div>
      </>
    )
  }
  // 1 — Lámpara Quirúrgica: dilución de sombras — rayos radiando desde un domo + anillos de intensidad
  if (theme === 1) {
    return (
      <>
        <div style={{ position:'absolute', top:'-6%', left:'50%', transform:'translateX(-50%)', width:640, height:640, pointerEvents:'none' }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ position:'absolute', inset:0, borderRadius:'50%', border:`1px solid ${accentColor}`, opacity:0.12, animation:`irisPulse ${4+i*1.3}s ${i*0.6}s ease-in-out infinite` }} />
          ))}
          <svg width="640" height="640" viewBox="0 0 640 640" style={{ position:'absolute', inset:0 }}>
            {Array.from({length:16},(_,i) => {
              const a = (i/16)*Math.PI*2
              const x2 = 320+Math.cos(a)*300, y2 = 320+Math.sin(a)*300
              return <line key={i} x1="320" y1="320" x2={x2} y2={y2} stroke={accentColor} strokeWidth="1" strokeOpacity="0.08" style={{ animation:`rayPulse ${3+(i%5)*0.5}s ${i*0.15}s ease-in-out infinite` }} />
            })}
          </svg>
        </div>
      </>
    )
  }
  // 2 — Electrocirugía: forma de onda RF de alta frecuencia (chispas/arco)
  if (theme === 2) {
    return (
      <>
        <div style={{ position:'absolute', top:'30%', left:0, width:'100%', height:80, overflow:'hidden' }}>
          <svg style={{ position:'absolute', width:'200%', height:80, animation:'ecgScroll 3.2s linear infinite' }}
               viewBox={`0 0 ${8*320*2} 80`} preserveAspectRatio="none">
            <defs>
              <linearGradient id="rfGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor={accentColor} stopOpacity="0"/>
                <stop offset="15%" stopColor={accentColor} stopOpacity="0.4"/>
                <stop offset="85%" stopColor={accentColor} stopOpacity="0.4"/>
                <stop offset="100%" stopColor={accentColor} stopOpacity="0"/>
              </linearGradient>
            </defs>
            <path d={RF_PATH} fill="none" stroke="url(#rfGrad1)" strokeWidth="1.3"/>
          </svg>
        </div>
        <div style={{ position:'absolute', top:'64%', left:0, width:'100%', height:60, overflow:'hidden', opacity:0.35 }}>
          <svg style={{ position:'absolute', width:'200%', height:60, animation:'ecgScroll2 4.6s linear infinite' }}
               viewBox={`0 0 ${8*320*2} 80`} preserveAspectRatio="none">
            <path d={RF_PATH} fill="none" stroke={accentColor} strokeWidth="0.7" strokeOpacity="0.25"/>
          </svg>
        </div>
      </>
    )
  }
  // 3 — Mesa Quirúrgica: silueta cinemática articulada (respaldo / asiento / piernera) meciéndose
  if (theme === 3) {
    return (
      <svg style={{ position:'absolute', top:'30%', left:'50%', transform:'translateX(-50%)', width:420, height:160, opacity:0.16 }} viewBox="0 0 420 160">
        <g stroke={accentColor} strokeWidth="2" fill="none" strokeLinecap="round">
          <g style={{ transformOrigin:'150px 70px', animation:'tableSway 6s ease-in-out infinite' }}>
            <rect x="60" y="55" width="90" height="14" rx="3" />
          </g>
          <rect x="150" y="55" width="120" height="14" rx="3" />
          <g style={{ transformOrigin:'270px 70px', animation:'tableSway 6s 0.3s ease-in-out infinite reverse' }}>
            <rect x="270" y="55" width="80" height="14" rx="3" />
          </g>
          <line x1="200" y1="69" x2="200" y2="120" />
          <line x1="150" y1="120" x2="250" y2="120" />
          <circle cx="150" cy="128" r="8" />
          <circle cx="250" cy="128" r="8" />
        </g>
      </svg>
    )
  }
  // 4 — Torre de Endoscopía: iris/apertura de cámara pulsando + barrido de escaneo
  if (theme === 4) {
    return (
      <>
        <div style={{ position:'absolute', top:'18%', left:'50%', transform:'translateX(-50%)', width:320, height:320 }}>
          {[0,1,2,3].map(i => (
            <div key={i} style={{ position:'absolute', inset:0, borderRadius:'50%', border:`1px solid ${accentColor}`, opacity:0.1, animation:`irisPulse ${3.5+i*0.9}s ${i*0.4}s ease-in-out infinite` }} />
          ))}
        </div>
        <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
          <div style={{ position:'absolute', left:0, width:'100%', height:2, background:`linear-gradient(to right,transparent,${accentColor}55,transparent)`, animation:'scanSweep 5s linear infinite' }} />
        </div>
      </>
    )
  }
  // 5 — Bomba de CEC: circuito de circulación con flujo continuo (lazo cerrado de tubería)
  return (
    <svg style={{ position:'absolute', top:'26%', left:'50%', transform:'translateX(-50%)', width:340, height:110, opacity:0.4 }} viewBox="0 0 300 100">
      <path d={CEC_LOOP} fill="none" stroke={accentColor} strokeWidth="1.4" strokeOpacity="0.22" />
      <path d={CEC_LOOP} fill="none" stroke={accentColor} strokeWidth="1.4" strokeDasharray="6 14" style={{ animation:'flowDash 2.2s linear infinite' }} />
    </svg>
  )
}

function AnimatedBg({ accentColor = C.cyan, theme = -1 }: { accentColor?: string; theme?: number }) {
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', zIndex:0, pointerEvents:'none', animation:'bgThemeFadeIn 0.7s ease both' }}>

      {/* Subtle ambient glow — top-left and bottom-right corners */}
      <div style={{ position:'absolute', width:500, height:500, borderRadius:'50%', background:`radial-gradient(circle, ${accentColor}10 0%, transparent 70%)`, top:-120, left:-80, filter:'blur(60px)' }} />
      <div style={{ position:'absolute', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)', bottom:-80, right:-80, filter:'blur(50px)' }} />

      {/* Technical grid — like graph paper in a lab */}
      <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%' }}>
        <defs>
          <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0 L0 0 0 20" fill="none" stroke={accentColor} strokeWidth="0.3" strokeOpacity="0.06"/>
          </pattern>
          <pattern id="bigGrid" width="100" height="100" patternUnits="userSpaceOnUse">
            <rect width="100" height="100" fill="url(#smallGrid)"/>
            <path d="M100 0 L0 0 0 100" fill="none" stroke={accentColor} strokeWidth="0.6" strokeOpacity="0.1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#bigGrid)" />
      </svg>

      {/* Signature hero animation — themed per equipo */}
      <HeroBand theme={theme} accentColor={accentColor} />

      {/* Circuit traces — corner decorations */}
      <svg style={{ position:'absolute', top:0, left:0, width:260, height:200 }}>
        <g stroke={accentColor} fill="none" style={{ animation:'tracePulse 5s ease-in-out infinite' }}>
          <polyline points="0,60 40,60 60,40 120,40 140,20 200,20" strokeWidth="1"/>
          <polyline points="0,100 30,100 50,80 90,80" strokeWidth="0.7"/>
          <circle cx="120" cy="40" r="3" fill={accentColor} fillOpacity="0.2" strokeWidth="0.8"/>
          <circle cx="200" cy="20" r="4" fill={accentColor} fillOpacity="0.15" strokeWidth="1"/>
          <circle cx="90" cy="80" r="2.5" fill={accentColor} fillOpacity="0.15" strokeWidth="0.7"/>
          <line x1="140" y1="20" x2="140" y2="0" strokeWidth="0.7"/>
          <line x1="90" y1="80" x2="90" y2="60" strokeWidth="0.5"/>
        </g>
      </svg>
      <svg style={{ position:'absolute', bottom:44, right:0, width:260, height:180 }}>
        <g stroke={accentColor} fill="none" style={{ animation:'tracePulse 6s 2s ease-in-out infinite' }}>
          <polyline points="260,40 220,40 200,60 140,60 120,80 60,80" strokeWidth="1"/>
          <polyline points="260,90 230,90 210,110 170,110" strokeWidth="0.7"/>
          <circle cx="140" cy="60" r="3" fill={accentColor} fillOpacity="0.18" strokeWidth="0.8"/>
          <circle cx="60" cy="80" r="4" fill={accentColor} fillOpacity="0.12" strokeWidth="1"/>
          <circle cx="170" cy="110" r="2.5" fill={accentColor} fillOpacity="0.15" strokeWidth="0.7"/>
        </g>
      </svg>

      {/* Medical cross symbols — floating faintly */}
      {[{x:12,y:18,s:18,d:0},{x:85,y:12,s:14,d:1.5},{x:6,y:72,s:12,d:3},{x:91,y:75,s:16,d:0.8},{x:50,y:8,s:10,d:2.2},{x:48,y:88,s:13,d:1}].map((m,i) => (
        <svg key={i} style={{ position:'absolute', left:`${m.x}%`, top:`${m.y}%`, width:m.s, height:m.s, animation:`crossGlow ${4+i}s ${m.d}s ease-in-out infinite` }}
             viewBox="0 0 24 24">
          <rect x="9" y="2" width="6" height="20" rx="1" fill={accentColor}/>
          <rect x="2" y="9" width="20" height="6" rx="1" fill={accentColor}/>
        </svg>
      ))}

      {/* Cell particles — small glowing dots (erythrocytes / signal nodes) */}
      {Array.from({length:18},(_,i) => ({
        x:(i*41+17)%98, y:(i*59+11)%95,
        s: i%4===0?4:i%3===0?2.5:1.5,
        isCell: i%5===0,
        col: i%6===0?'#a78bfa':accentColor,
        td:3+i%5, dd:-(i*0.7), driftD:9+i%7,
      })).map((p,i) => (
        <div key={i} style={{ position:'absolute', left:`${p.x}%`, top:`${p.y}%`, pointerEvents:'none' }}>
          {p.isCell ? (
            // Ring cell (erythrocyte-like)
            <svg width={p.s*4} height={p.s*4} style={{ overflow:'visible', animation:`twinkle ${p.td}s ${p.dd}s ease-in-out infinite, drift ${p.driftD}s ${p.dd}s ease-in-out infinite` }}>
              <circle cx={p.s*2} cy={p.s*2} r={p.s*2} fill="none" stroke={p.col} strokeWidth="0.8" strokeOpacity="0.6"/>
              <circle cx={p.s*2} cy={p.s*2} r={p.s*0.6} fill={p.col} fillOpacity="0.4"/>
            </svg>
          ) : (
            <div style={{ width:p.s, height:p.s, borderRadius:'50%', background:p.col, boxShadow:`0 0 ${p.s*5}px ${p.col}80`, animation:`twinkle ${p.td}s ${p.dd}s ease-in-out infinite, drift ${p.driftD}s ${p.dd}s ease-in-out infinite` }} />
          )}
        </div>
      ))}

      {/* Measurement labels — like calibration marks on monitoring equipment, themed per equipo */}
      {(BG_THEMES[theme]?.labels ?? DEFAULT_LABELS).map((lbl,i) => (
        <div key={i} style={{ position:'absolute', left:`${[4,82,4,88,44][i]}%`, top:`${[35,35,60,60,4][i]}%`, fontFamily:'JetBrains Mono,monospace', fontSize:'0.56rem', color:accentColor, opacity:0.1, letterSpacing:'0.1em', pointerEvents:'none' }}>{lbl}</div>
      ))}
    </div>
  )
}

// ─── SLIDE TRANSITION SYSTEM ──────────────────────────────────────────────────
type TSlide = { id: number; slideIdx: number; phase: 'enter'|'active'|'exit'; dir: 1|-1 }

// ─── CHROME FLOTANTE ──────────────────────────────────────────────────────────
// Ni cabecera ni pie: barras con borde y fondo propio convertían el escenario
// en una ventana de navegador y le robaban 86 px de alto a cada lámina. Lo que
// queda son marcas sueltas sobre la escena, tan tenues que la lámina puede
// sangrar por debajo de ellas hasta tocar los cuatro bordes.
function TopChrome({ idx, isFullscreen, onToggleFullscreen }: { idx:number; isFullscreen:boolean; onToggleFullscreen:()=>void }) {
  const slide = ALL_SLIDES[idx]
  const equipo = slide.ei !== undefined ? EQUIPOS[slide.ei] : null
  const accent = equipo?.color ?? C.cyan
  return (
    <>
      {/* Hilo de progreso pegado al borde superior */}
      <div style={{ position:'absolute', top:0, left:0, right:0, height:2, zIndex:40, pointerEvents:'none' }}>
        <div style={{
          height:'100%', width:`${((idx+1)/TOTAL)*100}%`,
          background:`linear-gradient(90deg, ${C.purple}00, ${C.purple} 26%, ${accent})`,
          transition:'width 0.55s cubic-bezier(0.22,1,0.36,1), background 0.5s ease',
          boxShadow:`0 0 14px ${accent}b0`,
        }} />
      </div>

      <div style={{ position:'absolute', top:26, left:46, zIndex:40, display:'flex', alignItems:'center', gap:10, pointerEvents:'none' }}>
        <span style={{ width:6, height:6, borderRadius:'50%', background:accent, boxShadow:`0 0 10px ${accent}`, animation:'pulseDot 2s ease-in-out infinite' }} />
        <span className="font-mono" style={{ fontSize:9.5, color:'rgba(140,185,230,0.62)', letterSpacing:'0.24em', textTransform:'uppercase' }}>
          Equipos de Salón de Operaciones — Equipos Médicos I
        </span>
        {equipo && (
          <>
            <span style={{ width:1, height:12, background:'rgba(140,185,230,0.22)' }} />
            <span className="font-mono" style={{ fontSize:9.5, color:accent, letterSpacing:'0.18em', textTransform:'uppercase' }}>
              E{equipo.num} · {equipo.name}
            </span>
          </>
        )}
      </div>

      <div style={{ position:'absolute', top:20, right:44, zIndex:40, display:'flex', alignItems:'center', gap:18 }}>
        <span className="font-mono" style={{ fontSize:9.5, color:'rgba(238,246,255,0.26)', letterSpacing:'0.16em' }}>
          Ing. Bryan Rodríguez S. · UDELAS
        </span>
        <span className="font-mono" style={{ fontSize:12, color:accent, letterSpacing:'0.1em' }}>
          {String(idx+1).padStart(2,'0')}
          <span style={{ color:'rgba(238,246,255,0.22)' }}> / {String(TOTAL).padStart(2,'0')}</span>
        </span>
        <GlyphBtn onClick={onToggleFullscreen} title={isFullscreen?'Salir de pantalla completa (F)':'Pantalla completa (F)'} color={accent}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            {isFullscreen
              ? <path d="M9 3v4a2 2 0 0 1-2 2H3M15 3v4a2 2 0 0 0 2 2h4M21 15h-4a2 2 0 0 0-2 2v4M3 15h4a2 2 0 0 1 2 2v4" />
              : <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />}
          </svg>
        </GlyphBtn>
      </div>
    </>
  )
}

/* Sin caja: un botón con borde en la esquina reintroduce justamente el
   rectángulo que la composición evita. Queda el glifo, y el disco de acento
   solo aparece al pasar el puntero. */
function GlyphBtn({ onClick, title, color, disabled, children }: { onClick:()=>void; title?:string; color:string; disabled?:boolean; children:React.ReactNode }) {
  const [hover, setHover] = useState(false)
  return (
    <button onClick={onClick} title={title} disabled={disabled}
      onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{
        width:30, height:30, borderRadius:'50%', border:'none', padding:0,
        background: !disabled && hover ? `${color}24` : 'transparent',
        color: disabled ? 'rgba(238,246,255,0.14)' : hover ? color : `${color}8c`,
        cursor: disabled ? 'default' : 'pointer',
        display:'flex', alignItems:'center', justifyContent:'center',
        transition:'all 0.22s ease',
      }}>
      {children}
    </button>
  )
}

function BottomChrome({ cur, onPrev, onNext, onJump }: { cur:number; onPrev:()=>void; onNext:()=>void; onJump:(i:number)=>void }) {
  const jumps = [0, 1, ...EQUIPO_STARTS]
  const activeJumpIndex = cur<=1 ? cur : 1 + EQUIPO_STARTS.filter(s => s<=cur).length
  const accent = ALL_SLIDES[cur].ei !== undefined ? EQUIPOS[ALL_SLIDES[cur].ei!].color : C.cyan
  return (
    <>
      {/* Puntos de salto, centrados y sin suelo debajo */}
      <div style={{ position:'absolute', bottom:22, left:'50%', transform:'translateX(-50%)', display:'flex', gap:5, alignItems:'center', zIndex:40 }}>
        {jumps.map((start,i) => {
          const active = i === activeJumpIndex
          const color = i<2 ? C.cyan : EQUIPOS[i-2]?.color || C.cyan
          return (
            <button key={i} onClick={()=>onJump(start)} title={i<2?['Portada','Índice'][i]:`Equipo ${i-1}`} style={{
              width:active?24:5, height:4, borderRadius:2, background:active?color:'rgba(255,255,255,0.1)',
              border:'none', cursor:'pointer', padding:0,
              transition:'all 0.4s cubic-bezier(0.34,1.56,0.64,1)',
              boxShadow:active?`0 0 12px ${color}90`:'none',
            }} />
          )
        })}
      </div>

      <div style={{ position:'absolute', bottom:18, right:44, display:'flex', gap:6, alignItems:'center', zIndex:40 }}>
        <GlyphBtn onClick={onPrev} title="Anterior" color={accent} disabled={cur===0}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </GlyphBtn>
        <GlyphBtn onClick={onNext} title="Siguiente" color={accent} disabled={cur===TOTAL-1}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </GlyphBtn>
      </div>

      {cur===0 && (
        <div style={{ position:'absolute', bottom:20, left:46, zIndex:40, pointerEvents:'none' }}>
          <span className="font-mono" style={{ fontSize:9.5, color:'rgba(238,246,255,0.3)', letterSpacing:'0.2em' }}>
            PRESIONA → PARA COMENZAR
          </span>
        </div>
      )}
    </>
  )
}

// ─── SLIDE CONTENTS ───────────────────────────────────────────────────────────
// Cada tipo de lámina es una escena compuesta en absoluto sobre 1440×810 con el
// vocabulario de `Stage.tsx`: nada de tarjetas, nada de rejillas, nada de
// paneles con borde. La estructura la dan la tipografía, las reglas que se
// desvanecen y el espacio negativo; la profundidad, las capas.

/** Rótulo de escena: número de sección y su nombre, sin píldora ni caja. */
function Head({ num, label, color, d = 0 }: { num:string; label:string; color:string; d?:number }) {
  return (
    <div className="drift" style={{ display:'flex', alignItems:'center', gap:14, ...dly(d) }}>
      <span className="font-mono" style={{ fontSize:11, color, letterSpacing:'0.14em', fontWeight:700, opacity:0.8 }}>{num}</span>
      <span style={{ width:22, height:1, background:color, opacity:0.55 }} />
      <span className="font-mono" style={{ fontSize:10.5, color, letterSpacing:'0.26em', textTransform:'uppercase', whiteSpace:'nowrap' }}>{label}</span>
    </div>
  )
}

/**
 * Una imagen de equipo, suelta sobre el fondo. Los productos vienen
 * fotografiados contra fondos distintos, así que no se sangran a los bordes
 * (recortaría mal): se apoyan en su propio halo y su sombra, sin marco.
 */
function Plate({ src, alt, size, color, d = 2, style }: { src:string; alt:string; size:number; color:string; d?:number; style?:React.CSSProperties }) {
  return (
    <div style={{ position:'relative', width:size, height:size, ...style }}>
      <div style={{
        position:'absolute', inset:'-16%', borderRadius:'50%',
        background:`radial-gradient(circle, ${color}26 0%, transparent 66%)`, pointerEvents:'none',
      }} />
      <ZoomableImg
        src={src} alt={alt}
        style={{ position:'relative', width:'100%', height:'100%', animation:`bloomIn 0.75s cubic-bezier(0.22,1,0.36,1) ${0.08 + d * 0.05}s both` }}
        imgStyle={{ objectFit:'contain', filter:`drop-shadow(0 18px 40px rgba(0,0,0,0.6)) drop-shadow(0 0 26px ${color}44)` }}
      />
    </div>
  )
}

/** Dos corrientes de texto enfrentadas, sin una sola caja entre ellas. */
function TwoStreams({
  a, b, accentA, accentB, top = 210,
}: {
  a: { label:string; items:string[] }
  b: { label:string; items:string[] }
  accentA:string; accentB:string; top?:number
}) {
  return (
    <>
      <At l={100} t={top} w={560} d={1} anim="drift">
        <p className="font-mono" style={{ fontSize:11, color:accentA, letterSpacing:'0.24em', textTransform:'uppercase', margin:'0 0 14px' }}>{a.label}</p>
        <div className="span-x" style={{ width:300, height:1, background:`linear-gradient(90deg, ${accentA}, transparent)`, marginBottom:24, ...dly(2) }} />
        <Hang items={a.items} color={accentA} d={3} marker="tick" size={16.5} w={520} gap={16} />
      </At>
      <At l={790} t={top + 88} w={560} d={5} anim="drift-r">
        <p className="font-mono" style={{ fontSize:11, color:accentB, letterSpacing:'0.24em', textTransform:'uppercase', margin:'0 0 14px' }}>{b.label}</p>
        <div className="span-x" style={{ width:300, height:1, background:`linear-gradient(90deg, ${accentB}, transparent)`, marginBottom:24, ...dly(6) }} />
        <Hang items={b.items} color={accentB} d={7} marker="tick" size={16.5} w={520} gap={16} />
      </At>
    </>
  )
}

function SlideCover() {
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <Ghost text="02" side="right" size={520} top={150} opacity={0.03} font="mono" />
      <Halo x={1120} y={360} size={900} color="rgba(0,212,255,0.2)" />
      <Halo x={220} y={720} size={640} color="rgba(124,58,237,0.24)" />

      <At l={100} t={214} anim="none">
        <Eyebrow d={0}>UDELAS · Ingeniería Biomédica</Eyebrow>
      </At>

      <At l={104} t={252} d={1} anim="drift">
        <span className="font-mono" style={{ fontSize:11, letterSpacing:'0.3em', color:'rgba(0,212,255,0.5)' }}>MÓDULO N°2</span>
      </At>

      <At l={94} t={288} w={880} anim="none">
        <h1 className="font-display wipe" style={{ fontSize:96, lineHeight:0.98, margin:0, fontWeight:900, ...dly(2) }}>
          <span style={{ color:WH, display:'block' }}>Equipos de</span>
          <span style={{ color:C.cyan, textShadow:`0 0 90px ${C.cyan}55`, display:'block' }}>Salón de Operaciones</span>
        </h1>
      </At>

      <At l={-70} t={532} w={700} h={2} z={1} anim="none">
        <div className="span-x" style={{ width:'100%', height:2, background:`linear-gradient(90deg, transparent, ${C.purple}, ${C.cyan})`, boxShadow:`0 0 18px ${C.cyan}66`, ...dly(5) }} />
      </At>

      <At l={100} t={572} w={620} d={6}>
        <p style={{ fontSize:20, color:WD, fontStyle:'italic', lineHeight:1.55, margin:0, fontWeight:300 }}>
          Equipos Médicos I — Estructura por equipo
        </p>
      </At>

      <At l={100} t={646} d={8}>
        <span className="font-mono" style={{ fontSize:12, color:C.cyan, letterSpacing:'0.14em' }}>Ing. Bryan Rodríguez S.</span>
      </At>
    </div>
  )
}

function SlideIndex({ onJump }: { onJump:(i:number)=>void }) {
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <Ghost text="06" side="right" size={460} top={210} opacity={0.026} font="mono" />
      <Halo x={200} y={220} size={640} color="rgba(0,212,255,0.14)" />
      <Halo x={1180} y={700} size={700} color="rgba(124,58,237,0.2)" />

      <At l={100} t={78} anim="none">
        <Head num="00" label="Índice de equipos" color={C.cyan} />
      </At>

      {EQUIPOS.map((e,i) => (
        <At key={i} l={100 + i * 22} t={146 + i * 104} w={1240 - i * 22} d={1 + i} anim="drift">
          <button onClick={()=>onJump(EQUIPO_STARTS[i])} title={`Ir a ${e.name}`} style={{
            display:'flex', alignItems:'baseline', gap:22, width:'100%',
            background:'none', border:'none', padding:0, textAlign:'left', cursor:'pointer',
          }}>
            <span className="font-mono" style={{ fontSize:12, color:e.color, opacity:0.7, flexShrink:0, width:78, letterSpacing:'0.14em' }}>
              EQUIPO {e.num}
            </span>
            <span style={{ fontSize:26, flexShrink:0, filter:`drop-shadow(0 0 14px ${e.color}90)` }}>{e.icon}</span>
            <span className="font-display" style={{
              fontSize:29, fontWeight:700, color:e.color, flexShrink:0, lineHeight:1.2,
              textShadow:`0 0 30px ${e.color}44`, minWidth:290,
            }}>{e.name}</span>
            <span style={{ fontSize:14, color:WF, lineHeight:1.5, fontWeight:300, flex:1 }}>{e.desc}</span>
          </button>
          <div className="span-x" style={{
            width:1160 - i * 22, height:1, marginTop:16,
            background:`linear-gradient(90deg, ${e.color}44, ${e.color}0d, transparent)`, ...dly(2 + i),
          }} />
        </At>
      ))}
    </div>
  )
}

function SlideEquipoCover({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  const tags = ['Introducción','Principio','Componentes','Manejo','Marcas','Mantenimiento','Fallas','Conclusión']
  const words = e.name.split(' ')
  const last = words[words.length - 1]
  const head = words.slice(0, -1).join(' ')
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <Ghost text={String(e.num)} side="right" size={620} top={90} opacity={0.032} color={e.color} font="mono" />
      <Halo x={1080} y={410} size={940} color={`${e.color}30`} />
      <Halo x={180} y={740} size={620} color="rgba(124,58,237,0.18)" />

      {e.img && (
        <At l={880} t={172} z={1} anim="none">
          <Plate src={e.img} alt={e.name} size={420} color={e.color} d={2} />
        </At>
      )}

      <At l={100} t={172} anim="none" z={3}>
        <Eyebrow d={0} color={e.color}>Equipo N°{e.num}</Eyebrow>
      </At>

      <At l={94} t={218} w={760} anim="none" z={3}>
        <h2 className="font-display wipe" style={{ fontSize: head ? 66 : 78, lineHeight:1.0, fontWeight:900, margin:0, ...dly(1) }}>
          {head && <span style={{ color:WH, display:'block' }}>{head}</span>}
          <span style={{ color:e.color, textShadow:`0 0 70px ${e.color}55`, display:'block' }}>{last}</span>
        </h2>
      </At>

      <At l={-60} t={head ? 402 : 348} w={620} h={2} z={2} anim="none">
        <div className="span-x" style={{ width:'100%', height:2, background:`linear-gradient(90deg, transparent, ${e.color})`, boxShadow:`0 0 16px ${e.color}88`, ...dly(3) }} />
      </At>

      <At l={100} t={head ? 440 : 386} w={660} d={4} z={3}>
        <p style={{ fontSize:19, color:WD, fontStyle:'italic', lineHeight:1.62, margin:0, fontWeight:300 }}>{e.desc}</p>
      </At>

      {/* El recorrido del bloque: una línea de texto, no ocho píldoras */}
      <At l={100} t={640} w={720} d={7} z={3}>
        <p className="font-mono" style={{ fontSize:10.5, color:`${e.color}b0`, letterSpacing:'0.14em', lineHeight:2, margin:0, textTransform:'uppercase' }}>
          {tags.map((s,i) => (
            <span key={i}>
              <span style={{ opacity:0.5 }}>{i+1}.</span> {s}
              {i < tags.length-1 && <span style={{ opacity:0.3, margin:'0 10px' }}>·</span>}
            </span>
          ))}
        </p>
      </At>
    </div>
  )
}

function SlideIntroQue({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <Ghost text="01" side="right" size={480} top={190} opacity={0.028} color={e.color} font="mono" />
      <Halo x={1140} y={300} size={780} color={`${e.color}22`} />
      <Halo x={160} y={740} size={620} color="rgba(124,58,237,0.16)" />

      <At l={100} t={92} anim="none">
        <Head num="01" label="Introducción y función clínica" color={e.color} />
      </At>

      <At l={94} t={148} w={900} anim="none">
        <h2 className="font-display wipe" style={{ fontSize:56, lineHeight:1.06, color:WH, margin:0, fontWeight:800, ...dly(1) }}>
          ¿Qué es <span style={{ color:e.color, textShadow:`0 0 50px ${e.color}55` }}>{e.name.toLowerCase()}</span>?
        </h2>
      </At>

      <At l={-70} t={292} w={640} h={2} z={1} anim="none">
        <div className="span-x" style={{ width:'100%', height:2, background:`linear-gradient(90deg, transparent, ${e.color})`, boxShadow:`0 0 16px ${e.color}66`, ...dly(3) }} />
      </At>

      <At l={98} t={336} w={1180} d={4}>
        <p style={{ fontSize:24, color:WD, lineHeight:1.76, margin:0, fontWeight:300 }}>{e.intro.que}</p>
      </At>

      <span style={{
        position:'absolute', right:110, bottom:40, fontSize:150, lineHeight:1, opacity:0.06, zIndex:0,
        filter:`drop-shadow(0 0 40px ${e.color})`, userSelect:'none', pointerEvents:'none',
      }}>{e.icon}</span>
    </div>
  )
}

function SlideIntroFunc({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <Ghost text="Función" side="left" size={190} top={-4} opacity={0.024} />
      <Halo x={240} y={300} size={720} color={`${e.color}20`} />
      <Halo x={1120} y={660} size={680} color="rgba(124,58,237,0.2)" />

      <At l={100} t={92} anim="none">
        <Head num="01" label="Funciones y aplicaciones" color={e.color} />
      </At>

      <TwoStreams
        a={{ label:'Funciones principales', items:e.intro.funciones }}
        b={{ label:'Aplicaciones clínicas', items:e.intro.apps }}
        accentA={e.color}
        accentB={VI}
        top={168}
      />
    </div>
  )
}

function SlidePrincipioConcepto({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <Ghost text="02" side="right" size={470} top={430} opacity={0.026} color={e.color} font="mono" />
      <Halo x={280} y={280} size={760} color={`${e.color}20`} />
      <Halo x={1140} y={680} size={660} color="rgba(0,212,255,0.14)" />

      <At l={100} t={92} anim="none">
        <Head num="02" label="Principio de funcionamiento" color={e.color} />
      </At>

      <At l={98} t={148} w={620} d={1}>
        <p style={{ fontSize:17.5, color:WD, lineHeight:1.68, margin:0, fontWeight:300 }}>{e.principio.concepto}</p>
      </At>

      {/* La cadena de bloques desciende en diagonal, unida por una hairline */}
      <At l={0} t={0} w={1440} h={810} z={0} anim="none" style={{ pointerEvents:'none' }}>
        <div className="span-x" style={{
          position:'absolute', left:790, top:190, width:520, height:1,
          background:`linear-gradient(90deg, ${e.color}88, ${e.color}18, transparent)`,
          transform:'rotate(72deg)', transformOrigin:'left center', ...dly(3),
        }} />
      </At>

      {/* La cadena en flujo, con la sangría creciendo bloque a bloque. El
          ancho se encoge al mismo ritmo que crece la sangría —si no, el
          último bloque se sale por la derecha— y el hueco se cierra cuando
          el equipo tiene más de cinco, para no salirse por abajo. */}
      <At l={786} t={168} w={534} d={3} anim="none">
        <div style={{ display:'flex', flexDirection:'column', gap: e.principio.bloques.length > 5 ? 22 : 34 }}>
          {e.principio.bloques.map((b,i) => (
            <div key={i} className="drift-r" style={{
              display:'flex', alignItems:'baseline', gap:18,
              marginLeft: i * 22, width: 534 - i * 22, ...dly(3 + i),
            }}>
              <span className="font-mono" style={{ fontSize:12, color:e.color, opacity:0.55, flexShrink:0, width:28 }}>
                {String(i+1).padStart(2,'0')}
              </span>
              <span style={{ fontSize: e.principio.bloques.length > 5 ? 16.5 : 18, color:WH, lineHeight:1.5, fontWeight:400 }}>{b}</span>
            </div>
          ))}
        </div>
      </At>
    </div>
  )
}

function SlidePrincipioPpios({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  const ps = e.principio.principios
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <Ghost text="Principios" side="right" size={180} top={-4} opacity={0.024} />
      <Halo x={220} y={260} size={700} color={`${e.color}1e`} />
      <Halo x={1160} y={680} size={680} color="rgba(124,58,237,0.2)" />

      <At l={100} t={88} anim="none">
        <Head num="02" label="Principios involucrados" color={e.color} />
      </At>

      {/* En flujo, no una posición fija por principio: el largo de estos
          textos varía muchísimo entre equipos (la torre de endoscopía tiene
          los más largos) y con un paso fijo el último se salía por abajo.
          La escalera se conserva con la sangría de cada bloque. */}
      <At l={100} t={148} w={1240} d={1} anim="none">
        <div style={{ display:'flex', flexDirection:'column', gap: ps.length > 3 ? 24 : 34 }}>
          {ps.map(([t,d],i) => {
            const c = i % 2 === 0 ? e.color : VI
            return (
              <div key={i} className="drift" style={{ marginLeft: i * 28, ...dly(1 + i * 2) }}>
                <h3 style={{ fontSize: ps.length > 3 ? 22 : 25, color:c, margin:'0 0 9px', fontWeight:600, lineHeight:1.25 }}>{t}</h3>
                <div style={{ display:'flex', alignItems:'stretch', gap:18 }}>
                  <span className="span-y" style={{
                    width:2, flexShrink:0,
                    background:`linear-gradient(180deg, ${c}, transparent)`, ...dly(2 + i * 2),
                  }} />
                  <p style={{
                    fontSize: ps.length > 3 ? 15 : 16.5, color:WD, lineHeight:1.58, margin:0,
                    fontWeight:300, maxWidth: 1090 - i * 28,
                  }}>{d}</p>
                </div>
              </div>
            )
          })}
        </div>
      </At>
    </div>
  )
}

function SlideComponentes({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  const n = e.componentes.length
  /* El registro se aprieta cuando hay muchos componentes, para que entre
     entero entre el rótulo y el borde inferior. No basta con cerrar el
     hueco: con nueve o diez entradas hay que bajar también el cuerpo y
     estrechar la columna del nombre, o las descripciones largas parten en
     tres líneas y el último renglón se sale del escenario. */
  const dense = n >= 9
  const gap = dense ? 10 : n > 6 ? 20 : 26
  const fs = dense ? 13.5 : 15
  const nameW = dense ? 250 : 290
  const rule = dense ? 8 : 12
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <Ghost text="03" side="right" size={500} top={220} opacity={0.026} color={e.color} font="mono" />
      <Halo x={180} y={240} size={680} color={`${e.color}1e`} />
      <Halo x={1180} y={700} size={660} color="rgba(0,212,255,0.13)" />

      <At l={100} t={82} anim="none">
        <Head num="03" label="Componentes principales" color={e.color} />
      </At>

      <At l={100} t={138} w={1240} d={1} anim="none">
        <div style={{ display:'flex', flexDirection:'column', gap }}>
          {e.componentes.map(([name,desc],i) => (
            <div key={i} className="drift" style={dly(1 + i)}>
              <div style={{ display:'flex', alignItems:'baseline', gap:22 }}>
                <span className="font-mono" style={{ fontSize:12, color:e.color, opacity:0.45, flexShrink:0, width:30 }}>
                  {String(i+1).padStart(2,'0')}
                </span>
                <span style={{ width:nameW, flexShrink:0, fontSize:fs + 1.5, color:e.color, fontWeight:600, lineHeight:1.35 }}>{name}</span>
                <span style={{ flex:1, fontSize:fs, color:WD, lineHeight:1.5, fontWeight:300 }}>{desc}</span>
              </div>
              <div className="span-x" style={{
                width:1180, height:1, marginTop:rule, marginLeft:52,
                background:`linear-gradient(90deg, ${e.color}22, transparent)`, ...dly(2 + i),
              }} />
            </div>
          ))}
        </div>
      </At>
    </div>
  )
}

function SlideComponentesFotos({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  const photos = COMPONENT_PHOTOS[ei] ?? []
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <Ghost text="Real" side="left" size={230} top={-6} opacity={0.024} />
      <Halo x={720} y={400} size={980} color={`${e.color}24`} />

      <At l={100} t={92} anim="none">
        <Head num="03" label="Fotos de referencia — manual del fabricante" color={e.color} />
      </At>

      {photos.map((p,i) => (
        <At key={i} l={190 + i * 560} t={200 + i * 54} w={470} d={2 + i * 2} anim="none">
          <Plate src={p.src} alt={p.label} size={420} color={e.color} d={2 + i * 2} />
          <p className="rise" style={{
            fontSize:14, color:WF, marginTop:22, lineHeight:1.5, fontStyle:'italic', maxWidth:400, ...dly(4 + i * 2),
          }}>{p.label}</p>
        </At>
      ))}

      <At l={100} b={64} d={8}>
        <span className="font-mono" style={{ fontSize:9.5, color:WG, letterSpacing:'0.2em' }}>
          CLIC EN UNA FOTO PARA VERLA A PANTALLA COMPLETA
        </span>
      </At>
    </div>
  )
}

function SlideManejoAntes({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <Ghost text="Antes" side="right" size={250} top={-8} opacity={0.026} color={e.color} />
      <Halo x={240} y={340} size={820} color={`${e.color}24`} />
      <Halo x={1180} y={720} size={620} color="rgba(0,212,255,0.12)" />

      <At l={100} t={92} anim="none">
        <Head num="04" label="Manejo básico · antes del procedimiento" color={e.color} />
      </At>

      <At l={94} t={148} w={860} anim="none">
        <h2 className="font-display wipe" style={{ fontSize:52, lineHeight:1.06, color:WH, margin:0, fontWeight:800, ...dly(1) }}>
          Lo que se verifica <span style={{ color:e.color, textShadow:`0 0 44px ${e.color}55` }}>antes</span>
        </h2>
      </At>

      <At l={100} t={252} w={1220} d={3} anim="none">
        <Hang items={e.manejo.antes} color={e.color} d={3} marker="num" size={18} w={1120} gap={17} />
      </At>

      <span style={{
        position:'absolute', right:120, bottom:60, fontSize:140, lineHeight:1, opacity:0.05, zIndex:0,
        filter:`drop-shadow(0 0 36px ${e.color})`, userSelect:'none', pointerEvents:'none',
      }}>{e.icon}</span>
    </div>
  )
}

function SlideManejoDurante({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <Ghost text="Después" side="left" size={190} top={-4} opacity={0.024} />
      <Halo x={260} y={300} size={720} color="rgba(91,143,255,0.2)" />
      <Halo x={1140} y={680} size={700} color="rgba(124,58,237,0.22)" />

      <At l={100} t={92} anim="none">
        <Head num="04" label="Manejo básico · durante y después" color={e.color} />
      </At>

      <TwoStreams
        a={{ label:'Durante el procedimiento', items:e.manejo.durante }}
        b={{ label:'Después del procedimiento', items:e.manejo.despues }}
        accentA="#5b8fff"
        accentB="#a78bfa"
        top={168}
      />
    </div>
  )
}

function SlideMarcas({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  const { headers, rows } = e.marcas
  const cols = [300, 300, 320, 320]
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <Ghost text="05" side="right" size={470} top={250} opacity={0.026} color={e.color} font="mono" />
      <Halo x={200} y={260} size={680} color={`${e.color}1e`} />
      <Halo x={1180} y={700} size={640} color="rgba(0,212,255,0.13)" />

      <At l={100} t={82} anim="none">
        <Head num="05" label="Marcas y gama de equipos" color={e.color} />
      </At>

      {/* Encabezados sueltos sobre las columnas — sin barra ni fondo */}
      <At l={100} t={140} w={1240} d={1}>
        <div style={{ display:'flex', gap:16 }}>
          {headers.map((h,i) => (
            <span key={i} className="font-mono" style={{
              width:cols[i], flexShrink:0, fontSize:9.5, letterSpacing:'0.2em', textTransform:'uppercase',
              color: i === 0 ? WG : `${e.color}c0`,
            }}>{h}</span>
          ))}
        </div>
      </At>

      <At l={100} t={180} w={1240} d={2} anim="none">
        <div style={{ display:'flex', flexDirection:'column', gap: rows.length > 7 ? 14 : 20 }}>
          {rows.map((row,ri) => (
            <div key={ri} className="drift" style={dly(2 + ri)}>
              <div style={{ display:'flex', gap:16, alignItems:'baseline' }}>
                {row.map((cell,ci) => (
                  <span key={ci} style={{
                    width:cols[ci], flexShrink:0, lineHeight:1.45,
                    fontSize: ci === 0 ? 15 : 14.5,
                    color: ci === 0 ? e.color : WD,
                    fontWeight: ci === 0 ? 600 : 300,
                  }}>{cell}</span>
                ))}
              </div>
              <div className="span-x" style={{
                width:1200, height:1, marginTop:11,
                background:'linear-gradient(90deg, rgba(238,246,255,0.09), transparent)', ...dly(3 + ri),
              }} />
            </div>
          ))}
        </div>
      </At>
    </div>
  )
}

function SlideMantCalendario({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <Ghost text="06" side="right" size={480} top={230} opacity={0.026} color={e.color} font="mono" />
      <Halo x={200} y={280} size={700} color={`${e.color}20`} />
      <Halo x={1160} y={700} size={660} color="rgba(0,212,255,0.13)" />

      <At l={100} t={88} anim="none">
        <Head num="06" label="Mantenimiento preventivo · calendario" color={e.color} />
      </At>

      {/* La espina del calendario baja por el margen */}
      <At l={266} t={158} w={2} h={520} z={1} anim="none">
        <div className="span-y" style={{
          width:2, height:'100%',
          background:`linear-gradient(180deg, ${e.color}, ${C.purple})`,
          boxShadow:`0 0 12px ${e.color}66`, ...dly(1),
        }} />
      </At>

      <At l={100} t={150} w={1240} d={2} anim="none">
        <div style={{ display:'flex', flexDirection:'column', gap: e.mantenimiento.preventivo.length > 6 ? 26 : 34 }}>
          {e.mantenimiento.preventivo.map(([freq,act],i) => (
            <div key={i} className="drift" style={{ display:'flex', alignItems:'baseline', gap:20, ...dly(2 + i) }}>
              <span className="font-mono" style={{
                width:146, textAlign:'right', flexShrink:0, fontSize:12.5, color:e.color,
                fontWeight:700, letterSpacing:'0.04em', lineHeight:1.4,
              }}>{freq}</span>
              <span style={{
                width:10, height:10, borderRadius:'50%', flexShrink:0, background:e.color,
                boxShadow:`0 0 12px ${e.color}`, transform:'translateY(-3px)',
              }} />
              <span style={{ flex:1, fontSize:17, color:WD, lineHeight:1.55, fontWeight:300, maxWidth:1000 }}>{act}</span>
            </div>
          ))}
        </div>
      </At>
    </div>
  )
}

function SlideMantPruebas({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <Ghost text="Pruebas" side="left" size={200} top={-4} opacity={0.024} />
      <Halo x={1120} y={300} size={780} color={`${e.color}22`} />
      <Halo x={200} y={720} size={620} color="rgba(0,212,255,0.13)" />

      <At l={100} t={92} anim="none">
        <Head num="06" label="Mantenimiento · pruebas de verificación" color={e.color} />
      </At>

      <At l={94} t={148} w={900} anim="none">
        <h2 className="font-display wipe" style={{ fontSize:50, lineHeight:1.06, color:WH, margin:0, fontWeight:800, ...dly(1) }}>
          Lo que hay que <span style={{ color:e.color, textShadow:`0 0 44px ${e.color}55` }}>medir</span>, no solo mirar
        </h2>
      </At>

      <At l={-70} t={272} w={620} h={2} z={1} anim="none">
        <div className="span-x" style={{ width:'100%', height:2, background:`linear-gradient(90deg, transparent, ${e.color})`, boxShadow:`0 0 16px ${e.color}66`, ...dly(3) }} />
      </At>

      <At l={100} t={318} w={1240} d={4} anim="none">
        <Hang items={e.mantenimiento.pruebas} color={e.color} d={4} marker="num" size={19} w={1140} gap={20} />
      </At>
    </div>
  )
}

function SlideMantLimpieza({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <Ghost text="✕" side="right" size={420} top={330} opacity={0.03} color={RE} />
      <Halo x={260} y={300} size={720} color="rgba(0,212,255,0.16)" />
      <Halo x={1140} y={680} size={700} color="rgba(248,113,113,0.16)" />

      <At l={100} t={92} anim="none">
        <Head num="06" label="Limpieza · qué hacer y qué evitar" color={e.color} />
      </At>

      <At l={100} t={176} w={560} d={1} anim="drift">
        <p className="font-mono" style={{ fontSize:11, color:C.cyan, letterSpacing:'0.24em', textTransform:'uppercase', margin:'0 0 14px' }}>
          ✓ Qué hacer
        </p>
        <div className="span-x" style={{ width:300, height:1, background:`linear-gradient(90deg, ${C.cyan}, transparent)`, marginBottom:24, ...dly(2) }} />
        <Hang items={e.mantenimiento.realizar} color={C.cyan} d={3} marker="tick" size={16.5} w={520} gap={18} />
      </At>

      <At l={790} t={264} w={560} d={5} anim="drift-r">
        <p className="font-mono" style={{ fontSize:11, color:RE, letterSpacing:'0.24em', textTransform:'uppercase', margin:'0 0 14px' }}>
          ✕ Qué evitar
        </p>
        <div className="span-x" style={{ width:300, height:1, background:`linear-gradient(90deg, ${RE}, transparent)`, marginBottom:24, ...dly(6) }} />
        <Hang items={e.mantenimiento.evitar} color={RE} d={7} marker="tick" size={16.5} w={520} gap={18} />
      </At>
    </div>
  )
}

function SlideFallasTabla({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <Ghost text="07" side="right" size={470} top={250} opacity={0.026} color={RE} font="mono" />
      <Halo x={220} y={280} size={720} color="rgba(248,113,113,0.16)" />
      <Halo x={1160} y={700} size={640} color={`${e.color}18`} />

      <At l={100} t={88} anim="none">
        <Head num="07" label="Fallas comunes" color={RE} />
      </At>

      <At l={100} t={148} w={1240} d={1}>
        <div style={{ display:'flex', gap:26 }}>
          <span className="font-mono" style={{ width:440, flexShrink:0, fontSize:9.5, color:'rgba(252,165,165,0.8)', letterSpacing:'0.2em', textTransform:'uppercase' }}>Falla</span>
          <span className="font-mono" style={{ fontSize:9.5, color:WG, letterSpacing:'0.2em', textTransform:'uppercase' }}>Causa probable</span>
        </div>
      </At>

      {/* Un solo contenedor en flujo, no una fila por posición absoluta: el
          largo de la causa varía mucho entre equipos y con filas fijas las
          últimas se salían del escenario por abajo. */}
      <At l={100} t={188} w={1240} d={2} anim="none">
        <div style={{ display:'flex', flexDirection:'column', gap: e.fallas.tabla.length > 6 ? 14 : 20 }}>
          {e.fallas.tabla.map(([falla,causa],i) => (
            <div key={i} className="drift" style={dly(2 + i)}>
              <div style={{ display:'flex', gap:26, alignItems:'baseline' }}>
                <span style={{ width:440, flexShrink:0, fontSize:17, color:'#fca5a5', fontWeight:600, lineHeight:1.4 }}>{falla}</span>
                <span style={{ flex:1, fontSize:15, color:WD, lineHeight:1.5, fontWeight:300 }}>{causa}</span>
              </div>
              <div className="span-x" style={{
                width:1200, height:1, marginTop: e.fallas.tabla.length > 6 ? 12 : 16,
                background:'linear-gradient(90deg, rgba(248,113,113,0.2), transparent)', ...dly(3 + i),
              }} />
            </div>
          ))}
        </div>
      </At>
    </div>
  )
}

function SlideFallasRiesgos({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <Ghost text="Riesgo" side="left" size={210} top={-4} opacity={0.026} color={RE} />
      <Halo x={250} y={300} size={740} color="rgba(248,113,113,0.18)" />
      <Halo x={1150} y={680} size={700} color="rgba(251,191,36,0.16)" />

      <At l={100} t={92} anim="none">
        <Head num="07" label="Riesgos asociados" color={RE} />
      </At>

      <TwoStreams
        a={{ label:'Riesgos — paciente', items:e.fallas.paciente }}
        b={{ label:'Riesgos — biomédico', items:e.fallas.biomedico }}
        accentA={RE}
        accentB={GO}
        top={168}
      />
    </div>
  )
}

function SlideConclusionCaso({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <Ghost text="&ldquo;" side="right" size={620} top={90} opacity={0.04} color={GO} />
      <Halo x={300} y={340} size={900} color="rgba(251,191,36,0.16)" />
      <Halo x={1140} y={730} size={620} color={`${e.color}1c`} />

      <At l={100} t={92} anim="none">
        <Head num="08" label="Caso real" color={GO} />
      </At>

      <At l={-70} t={158} w={620} h={2} z={1} anim="none">
        <div className="span-x" style={{ width:'100%', height:2, background:`linear-gradient(90deg, transparent, ${GO})`, boxShadow:`0 0 16px ${GO}66`, ...dly(1) }} />
      </At>

      <At l={98} t={200} w={1220} d={2}>
        <p style={{ fontSize:20, color:WH, lineHeight:1.78, margin:0, fontWeight:300, fontStyle:'italic' }}>
          {e.conclusion.caso}
        </p>
      </At>
    </div>
  )
}

function SlideConclusionCierre({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <Ghost text="§" side="right" size={520} top={210} opacity={0.028} color={VI} />
      <Halo x={240} y={280} size={740} color={`${e.color}22`} />
      <Halo x={1160} y={690} size={700} color="rgba(124,58,237,0.22)" />

      <At l={100} t={92} anim="none">
        <Head num="08" label="Lecciones y normativas" color={e.color} />
      </At>

      <At l={100} t={168} w={620} d={1} anim="drift">
        <p className="font-mono" style={{ fontSize:11, color:e.color, letterSpacing:'0.24em', textTransform:'uppercase', margin:'0 0 14px' }}>
          Lecciones aprendidas
        </p>
        <div className="span-x" style={{ width:300, height:1, background:`linear-gradient(90deg, ${e.color}, transparent)`, marginBottom:24, ...dly(2) }} />
        <Hang items={e.conclusion.lecciones} color={e.color} d={3} marker="tick" size={16} w={560} gap={20} />
      </At>

      <At l={790} t={244} w={560} d={5} anim="drift-r">
        <p className="font-mono" style={{ fontSize:11, color:VI, letterSpacing:'0.24em', textTransform:'uppercase', margin:'0 0 14px' }}>
          Normativas relacionadas
        </p>
        <div className="span-x" style={{ width:300, height:1, background:`linear-gradient(90deg, ${VI}, transparent)`, marginBottom:22, ...dly(6) }} />
        {e.conclusion.normas.map(([id,desc],i) => (
          <div key={i} className="rise" style={{ marginBottom:16, ...dly(7 + i) }}>
            <span className="font-mono" style={{ fontSize:13, color:VI, fontWeight:700, letterSpacing:'0.04em' }}>{id}</span>
            <p style={{ fontSize:14, color:WD, lineHeight:1.5, margin:'5px 0 0', fontWeight:300, maxWidth:540 }}>{desc}</p>
          </div>
        ))}
      </At>
    </div>
  )
}

function SlideVideo({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const skip = (s: number) => { const v = videoRef.current; if (v) v.currentTime = Math.max(0, Math.min(v.duration||Infinity, v.currentTime + s)) }
  const togglePlay = () => { const v = videoRef.current; if (!v) return; if (v.paused) v.play(); else v.pause() }
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <Ghost text="▶" side="left" size={330} top={330} opacity={0.03} color={e.color} />
      <Halo x={760} y={400} size={1000} color={`${e.color}26`} />

      <At l={100} t={80} anim="none">
        <Head num="▶" label={`Video demostrativo — ${e.name}`} color={e.color} />
      </At>

      {/* El video sin marco: solo su propia sombra y el halo detrás */}
      <At l={310} t={136} w={820} z={3} d={1} anim="none">
        <div className="plate" style={{
          borderRadius:6, overflow:'hidden', background:'#000',
          boxShadow:`0 24px 70px rgba(0,0,0,0.7), 0 0 70px ${e.color}30`, ...dly(1),
        }}>
          <video
            ref={videoRef}
            src={e.video}
            controls
            style={{ display:'block', width:'100%', maxHeight:462, background:'#000' }}
            onPlay={()=>setPlaying(true)}
            onPause={()=>setPlaying(false)}
          />
        </div>
      </At>

      <At l={310} t={628} w={820} z={3} d={4}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:12 }}>
          <button onClick={()=>skip(-10)} title="Retroceder 10s" className="font-mono" style={{
            background:'none', border:'none', color:`${e.color}c0`, fontSize:13, cursor:'pointer',
            letterSpacing:'0.1em', padding:'8px 12px',
          }}>◀◀ 10s</button>
          <button onClick={togglePlay} title={playing?'Pausar':'Reproducir'} className="font-mono" style={{
            background:e.color, border:'none', color:'#03080f', borderRadius:999, padding:'11px 30px',
            fontSize:14, fontWeight:700, cursor:'pointer', boxShadow:`0 0 26px ${e.color}80`,
          }}>{playing ? '❚❚ Pausar' : '▶ Reproducir'}</button>
          <button onClick={()=>skip(10)} title="Adelantar 10s" className="font-mono" style={{
            background:'none', border:'none', color:`${e.color}c0`, fontSize:13, cursor:'pointer',
            letterSpacing:'0.1em', padding:'8px 12px',
          }}>10s ▶▶</button>
        </div>
      </At>

      <At l={310} t={700} w={820} z={3} d={6}>
        <p style={{ fontSize:15, color:WF, fontStyle:'italic', textAlign:'center', margin:0, lineHeight:1.5 }}>
          Muestra al grupo el funcionamiento real del equipo antes de continuar con el siguiente.
        </p>
      </At>
    </div>
  )
}

const CUADRO_ROWS = [
  ['Máquina de anestesia', 'Neumática + eléctrica',    'Gases y ventilación', 'Hipoxia',            '#00d4ff'],
  ['Lámpara quirúrgica',   'Eléctrica',                'Iluminación',         'Baja visibilidad',   '#fbbf24'],
  ['Electrobisturí',       'Radiofrecuencia',          'Potencia',            'Quemaduras',         '#f87171'],
  ['Mesa quirúrgica',      'Eléctrica / Hidráulica',   'Posición',            'Caídas',             '#34d399'],
  ['Torre de endoscopía',  'Óptica + electrónica',     'Imagen/insuflación',  'Infección / quemadura', '#a78bfa'],
  ['Bomba de CEC',         'Electromecánica + neumática','Flujo / oxigenación', 'Embolia gaseosa',    '#fb923c'],
]

function SlideCuadro() {
  const cols = [330, 330, 300, 280]
  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden' }}>
      <Ghost text="06" side="right" size={520} top={200} opacity={0.026} font="mono" />
      <Halo x={220} y={260} size={720} color="rgba(0,212,255,0.16)" />
      <Halo x={1180} y={700} size={680} color="rgba(124,58,237,0.2)" />

      <At l={100} t={82} anim="none">
        <Head num="FIN" label="Cuadro comparativo de equipos" color={C.cyan} />
      </At>

      <At l={100} t={148} w={1240} d={1}>
        <div style={{ display:'flex', gap:16 }}>
          {['Equipo','Energía principal','Variable controlada','Riesgo principal'].map((h,i) => (
            <span key={i} className="font-mono" style={{
              width:cols[i], flexShrink:0, fontSize:9.5, letterSpacing:'0.2em', textTransform:'uppercase',
              color: i === 3 ? 'rgba(252,165,165,0.75)' : 'rgba(0,212,255,0.7)',
            }}>{h}</span>
          ))}
        </div>
      </At>

      <At l={100} t={198} w={1240} d={2} anim="none">
        <div style={{ display:'flex', flexDirection:'column', gap:30 }}>
      {CUADRO_ROWS.map(([equipo, energia, variable, riesgo, color], ri) => (
        <div key={ri} className="drift" style={dly(2 + ri)}>
          <div style={{ display:'flex', gap:16, alignItems:'baseline' }}>
            <span style={{ width:cols[0], flexShrink:0, display:'flex', alignItems:'baseline', gap:14 }}>
              <span style={{ width:3, height:22, borderRadius:2, background:color, boxShadow:`0 0 10px ${color}90`, flexShrink:0, transform:'translateY(4px)' }} />
              <span style={{ fontSize:19, color:WH, fontWeight:600, lineHeight:1.3 }}>{equipo}</span>
            </span>
            <span className="font-mono" style={{ width:cols[1], flexShrink:0, fontSize:13.5, color, lineHeight:1.45 }}>{energia}</span>
            <span style={{ width:cols[2], flexShrink:0, fontSize:15, color:WD, lineHeight:1.45, fontWeight:300 }}>{variable}</span>
            <span style={{ width:cols[3], flexShrink:0, fontSize:15, color:'#fca5a5', lineHeight:1.45, fontWeight:400 }}>{riesgo}</span>
          </div>
          <div className="span-x" style={{
            width:1200, height:1, marginTop:14,
            background:`linear-gradient(90deg, ${color}33, transparent)`, ...dly(3 + ri),
          }} />
        </div>
      ))}
        </div>
      </At>

      <At l={100} b={64} d={10}>
        <span className="font-mono" style={{ fontSize:9.5, color:WG, letterSpacing:'0.2em' }}>
          EQUIPOS DE SALÓN DE OPERACIONES — EQUIPOS MÉDICOS I · UDELAS
        </span>
      </At>
    </div>
  )
}

function RenderContent({ slide, onJump }: { slide:SEntry; onJump:(i:number)=>void }) {
  const ei = slide.ei ?? 0
  switch (slide.type) {
    case 'cover':               return <SlideCover />
    case 'index':               return <SlideIndex onJump={onJump} />
    case 'equipo-cover':        return <SlideEquipoCover ei={ei} />
    case 'intro-que':           return <SlideIntroQue ei={ei} />
    case 'intro-func':          return <SlideIntroFunc ei={ei} />
    case 'principio-concepto':  return <SlidePrincipioConcepto ei={ei} />
    case 'principio-ppios':     return <SlidePrincipioPpios ei={ei} />
    case 'componentes':         return <SlideComponentes ei={ei} />
    case 'componentes-fotos':   return <SlideComponentesFotos ei={ei} />
    case 'manejo-antes':        return <SlideManejoAntes ei={ei} />
    case 'manejo-durante':      return <SlideManejoDurante ei={ei} />
    case 'marcas':              return <SlideMarcas ei={ei} />
    case 'mant-calendario':     return <SlideMantCalendario ei={ei} />
    case 'mant-pruebas':        return <SlideMantPruebas ei={ei} />
    case 'mant-limpieza':       return <SlideMantLimpieza ei={ei} />
    case 'fallas-tabla':        return <SlideFallasTabla ei={ei} />
    case 'fallas-riesgos':      return <SlideFallasRiesgos ei={ei} />
    case 'conclusion-caso':     return <SlideConclusionCaso ei={ei} />
    case 'conclusion-cierre':   return <SlideConclusionCierre ei={ei} />
    case 'video':               return <SlideVideo ei={ei} />
    case 'cuadro':              return <SlideCuadro />
    default: return null
  }
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
const TRANSITION_MS = 480

// Escenario de diseño fijo: el deck se compone contra esta resolución y luego
// se escala uniformemente. 1440×810 es 16:9 EXACTO —la proporción de todo
// proyector—, así que a 1920×1080 escala ×1.333 y llena la pantalla sin
// franjas negras. Antes el deck era fluido con tipografía en clamp(): la
// composición cambiaba de una pantalla a otra y no se podía componer nada.
const CANVAS_W = 1440
const CANVAS_H = 810

function useStageScale() {
  const [k, setK] = useState(1)
  useEffect(() => {
    const fit = () => setK(Math.min(window.innerWidth / CANVAS_W, window.innerHeight / CANVAS_H))
    fit()
    window.addEventListener('resize', fit)
    document.addEventListener('fullscreenchange', fit)
    return () => {
      window.removeEventListener('resize', fit)
      document.removeEventListener('fullscreenchange', fit)
    }
  }, [])
  return k
}

export default function App() {
  const scale = useStageScale()
  const [cur, setCur] = useState(0)
  const [slides, setSlides] = useState<TSlide[]>([{ id:0, slideIdx:0, phase:'active', dir:1 }])
  const idRef = useRef(1)
  const timerRef = useRef<ReturnType<typeof setTimeout>|null>(null)
  const rootRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [zoomImage, setZoomImage] = useState<{src:string; alt?:string}|null>(null)
  const openImage = useCallback((src:string, alt?:string) => setZoomImage({ src, alt }), [])

  const accentColor = ALL_SLIDES[cur].ei !== undefined ? EQUIPOS[ALL_SLIDES[cur].ei!].color : C.cyan
  const bgTheme = ALL_SLIDES[cur].ei !== undefined ? ALL_SLIDES[cur].ei! : -1

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      rootRef.current?.requestFullscreen?.().catch(() => {})
    } else {
      document.exitFullscreen?.().catch(() => {})
    }
  }, [])

  useEffect(() => {
    const h = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', h)
    return () => document.removeEventListener('fullscreenchange', h)
  }, [])

  const go = useCallback((d: 1|-1) => {
    const next = Math.max(0, Math.min(TOTAL-1, cur+d))
    if (next === cur) return
    if (timerRef.current) clearTimeout(timerRef.current)

    const newId = idRef.current++
    setSlides(prev => [
      ...prev.slice(-1).map(s => ({ ...s, phase:'exit' as const, dir:d })),
      { id:newId, slideIdx:next, phase:'enter' as const, dir:d },
    ])
    setCur(next)

    timerRef.current = setTimeout(() => {
      setSlides([{ id:newId, slideIdx:next, phase:'active', dir:d }])
    }, TRANSITION_MS)
  }, [cur])

  const jump = useCallback((i: number) => {
    const d: 1 | -1 = i > cur ? 1 : -1
    if (i === cur) return
    if (timerRef.current) clearTimeout(timerRef.current)

    const newId = idRef.current++
    setSlides(prev => [
      ...prev.slice(-1).map(s => ({ ...s, phase:'exit' as const, dir:d })),
      { id:newId, slideIdx:i, phase:'enter' as const, dir:d },
    ])
    setCur(i)

    timerRef.current = setTimeout(() => {
      setSlides([{ id:newId, slideIdx:i, phase:'active', dir:d }])
    }, TRANSITION_MS)
  }, [cur])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key==='ArrowRight'||e.key==='ArrowDown') go(1)
      if (e.key==='ArrowLeft'||e.key==='ArrowUp') go(-1)
      if (e.key==='f'||e.key==='F') toggleFullscreen()
    }
    window.addEventListener('keydown', h)
    return () => { window.removeEventListener('keydown', h); if(timerRef.current) clearTimeout(timerRef.current) }
  }, [go, toggleFullscreen])

  const getAnim = (phase: string, dir: 1|-1, slideIdx: number) => {
    const type = ALL_SLIDES[slideIdx]?.type ?? 'intro'
    const spring = 'cubic-bezier(0.22,1,0.36,1)'
    const easeIn = 'cubic-bezier(0.55,0,1,0.45)'
    const T = TRANSITION_MS
    if (phase === 'enter') {
      if (type === 'cover' || type === 'conclusion') return `zoomIn ${T}ms ${spring} both`
      if (type === 'index')                          return `clipReveal ${T}ms ${spring} both`
      if (type === 'equipo-cover')                   return `slideUp ${T}ms ${spring} both`
      if (type === 'principio')                      return `flipIn ${T}ms ${spring} both`
      if (type === 'mantenimiento')                  return `dropIn ${T}ms ${spring} both`
      if (type === 'intro')                          return `skewIn ${T*1.05}ms ${spring} both`
      if (type === 'componentes')                    return `scaleGridIn ${T}ms ${spring} both`
      if (type === 'manejo')                         return `splitIn ${T*1.05}ms ${spring} both`
      return `${dir===1?'enterRight':'enterLeft'} ${T}ms ${spring} both`
    }
    if (phase === 'exit') {
      if (type === 'cover' || type === 'conclusion') return `zoomOut ${T*0.7}ms ${easeIn} both`
      if (type === 'index')                          return `clipOut ${T*0.65}ms ${easeIn} both`
      if (type === 'equipo-cover')                   return `slideOutDown ${T*0.7}ms ${easeIn} both`
      if (type === 'principio')                      return `flipOut ${T*0.7}ms ${easeIn} both`
      if (type === 'mantenimiento')                  return `dropOut ${T*0.7}ms ${easeIn} both`
      if (type === 'intro')                          return `skewOut ${T*0.7}ms ${easeIn} both`
      if (type === 'componentes')                    return `scaleGridOut ${T*0.65}ms ${easeIn} both`
      if (type === 'manejo')                         return `splitOut ${T*0.7}ms ${easeIn} both`
      return `${dir===1?'exitLeft':'exitRight'} ${T*0.75}ms ${easeIn} both`
    }
    return 'none'
  }

  return (
    <ImageZoomCtx.Provider value={openImage}>
      <div ref={rootRef} style={{ width:'100vw', height:'100dvh', background:C.bg, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden', fontFamily:'Outfit,sans-serif', position:'relative' }}>
        <style>{CSS}</style>

        {/* El fondo animado vive fuera del lienzo y cubre todo el viewport:
            en pantallas más anchas que 16:9 sigue habiendo atmósfera hasta
            los bordes, aunque la lámina esté escalada al centro. */}
        <AnimatedBg key={bgTheme} accentColor={accentColor} theme={bgTheme} />

        {/* Lienzo de diseño fijo, escalado para llenar el viewport */}
        <div style={{
          width:CANVAS_W, height:CANVAS_H, flexShrink:0,
          transform:`scale(${scale})`, transformOrigin:'center center',
          position:'relative', overflow:'hidden', zIndex:2,
        }}>
          <TopChrome idx={cur} isFullscreen={isFullscreen} onToggleFullscreen={toggleFullscreen} />

          {/* Escenario: ocupa el lienzo entero, para que algo pueda salirse
              por cualquiera de los cuatro bordes */}
          <div data-stage="slide" style={{ position:'absolute', inset:0, overflow:'hidden', zIndex:5 }}>
            {slides.map(s => (
              <div key={s.id} style={{
                position:'absolute', inset:0, overflow:'hidden',
                animation: getAnim(s.phase, s.dir, s.slideIdx),
                zIndex: s.phase === 'enter' ? 2 : 1,
                willChange:'transform,opacity,filter',
              }}>
                <RenderContent slide={ALL_SLIDES[s.slideIdx]} onJump={jump} />
              </div>
            ))}
          </div>

          <BottomChrome cur={cur} onPrev={()=>go(-1)} onNext={()=>go(1)} onJump={jump} />
        </div>

        {zoomImage && <Lightbox src={zoomImage.src} alt={zoomImage.alt} onClose={()=>setZoomImage(null)} />}
      </div>
    </ImageZoomCtx.Provider>
  )
}
