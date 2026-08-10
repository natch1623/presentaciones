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

// ─── slide registry ───────────────────────────────────────────────────────────
type SEntry = { type:string; ei?:number }
const EQUIPO_BLOCKS: SEntry[][] = EQUIPOS.map((e,i) => [
  {type:'equipo-cover',ei:i},{type:'intro',ei:i},{type:'principio',ei:i},
  {type:'componentes',ei:i},{type:'manejo',ei:i},{type:'marcas',ei:i},
  {type:'mantenimiento',ei:i},{type:'fallas',ei:i},{type:'conclusion',ei:i},
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

// ─── SHARED UI ────────────────────────────────────────────────────────────────
function Card({ title, color, children, style, animIdx=0 }: { title:string; color:string; children:React.ReactNode; style?:React.CSSProperties; animIdx?:number }) {
  return (
    <div className="glow-card" style={{
      background:'linear-gradient(135deg,rgba(5,15,45,0.88) 0%,rgba(8,22,60,0.72) 100%)',
      backdropFilter:'blur(20px)', border:`1px solid ${color}1e`,
      borderRadius:16, padding:'12px 14px',
      boxShadow:`0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 ${color}10`,
      animation:`elemFadeUp 0.48s ${0.06+animIdx*0.11}s both`,
      // @ts-expect-error custom css vars for hover glow
      '--accent': color, '--accent-glow': `${color}59`,
      ...style,
    }}>
      <h3 style={{ color, fontWeight:700, fontSize:'0.73rem', letterSpacing:'0.09em', textTransform:'uppercase', marginBottom:8, display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ width:3, height:14, borderRadius:2, background:`linear-gradient(to bottom,${color},${color}44)`, display:'inline-block', flexShrink:0 }} />
        {title}
      </h3>
      {children}
    </div>
  )
}

function DotRow({ text, last, color=C.cyan, animIdx=0 }: { text:string; last:boolean; color?:string; animIdx?:number }) {
  return (
    <div style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'4px 0', borderBottom:last?'none':'1px solid rgba(255,255,255,0.04)', fontSize:'0.79rem', color:'rgba(232,244,255,0.8)', lineHeight:1.4, animation:`elemFadeRight 0.38s ${animIdx*0.07}s both` }}>
      <span style={{ width:5, height:5, borderRadius:'50%', background:color, flexShrink:0, marginTop:5, boxShadow:`0 0 6px ${color}` }} />
      {text}
    </div>
  )
}

function DataTable({ headers, rows, ac, aColor }: { headers:string[]; rows:string[][]; ac?:number; aColor?:string }) {
  return (
    <table style={{ width:'100%', borderCollapse:'collapse' }}>
      <thead>
        <tr style={{ animation:'rowFadeIn 0.35s 0.05s both' }}>{headers.map((h,i)=><th key={i} style={{ color:'rgba(0,212,255,0.75)', fontWeight:700, fontSize:'0.67rem', textTransform:'uppercase', letterSpacing:'0.09em', padding:'5px 10px', borderBottom:'1px solid rgba(0,212,255,0.15)', textAlign:'left' }}>{h}</th>)}</tr>
      </thead>
      <tbody>
        {rows.map((row,ri)=>(
          <tr key={ri} style={{ animation:`rowFadeIn 0.38s ${0.1+ri*0.07}s both` }}>
            {row.map((cell,ci)=><td key={ci} style={{ padding:'6px 10px', fontSize:'0.8rem', color:ci===ac?(aColor||C.cyan):'rgba(232,244,255,0.78)', fontWeight:ci===ac?600:400, borderBottom:ri<rows.length-1?'1px solid rgba(255,255,255,0.04)':'none' }}>{cell}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function LineLabel({ text, color=C.cyan }: { text:string; color?:string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:10 }}>
      <div style={{ flex:1, height:'1px', background:`linear-gradient(to right,transparent,${color}70)` }} />
      <span style={{ fontFamily:'JetBrains Mono,monospace', color, fontSize:'0.65rem', letterSpacing:'0.2em' }}>{text}</span>
      <div style={{ flex:1, height:'1px', background:`linear-gradient(to left,transparent,${color}70)` }} />
    </div>
  )
}

function SlideH({ num, label, color=C.cyan }: { num:string; label:string; color?:string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14, animation:'titleReveal 0.42s 0.02s both' }}>
      <span style={{ fontFamily:'JetBrains Mono,monospace', color, fontWeight:700, fontSize:'0.68rem', opacity:0.65, animation:'badgeSlide 0.4s 0.06s both' }}>{num}</span>
      <div style={{ width:1, height:18, background:'rgba(0,212,255,0.15)' }} />
      <h2 style={{ fontFamily:'Playfair Display,serif', color:C.white, fontWeight:800, fontSize:'clamp(0.95rem,1.7vw,1.28rem)', margin:0 }}>{label}</h2>
    </div>
  )
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
function Header({ idx, isFullscreen, onToggleFullscreen }: { idx:number; isFullscreen:boolean; onToggleFullscreen:()=>void }) {
  const slide = ALL_SLIDES[idx]
  const equipo = slide.ei !== undefined ? EQUIPOS[slide.ei] : null
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', height:44, flexShrink:0, zIndex:20, borderBottom:'1px solid rgba(0,212,255,0.08)', background:'linear-gradient(to bottom,rgba(3,8,15,0.97),rgba(3,8,15,0.85))', backdropFilter:'blur(20px)' }}>
      <div style={{ fontFamily:'JetBrains Mono,monospace', color:C.cyan, fontSize:'0.67rem', letterSpacing:'0.13em', display:'flex', alignItems:'center', gap:10 }}>
        <span style={{ width:7, height:7, borderRadius:'50%', background:C.cyan, display:'inline-block', animation:'pulseDot 2s ease-in-out infinite' }} />
        EQUIPOS DE SALÓN DE OPERACIONES — EQUIPOS MÉDICOS I
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:14 }}>
        {equipo && <span style={{ color:equipo.color, fontSize:'0.7rem', fontWeight:600, fontFamily:'JetBrains Mono,monospace', letterSpacing:'0.05em' }}>E{equipo.num} · {equipo.name}</span>}
        <span style={{ color:C.muted, fontSize:'0.7rem' }}>Ing. Bryan Rodríguez S. · UDELAS</span>
        <div style={{ border:`1px solid ${C.cyan}45`, borderRadius:6, padding:'2px 10px', color:C.cyan, fontSize:'0.74rem', fontWeight:700, fontFamily:'JetBrains Mono,monospace', background:'rgba(0,212,255,0.05)' }}>
          {String(idx+1).padStart(2,'0')} / {String(TOTAL).padStart(2,'0')}
        </div>
        <button onClick={onToggleFullscreen} title={isFullscreen?'Salir de pantalla completa (F)':'Pantalla completa (F)'} style={{
          display:'flex', alignItems:'center', justifyContent:'center', width:26, height:26, borderRadius:6,
          border:`1px solid ${C.cyan}45`, background:'rgba(0,212,255,0.05)', color:C.cyan, cursor:'pointer', padding:0,
          transition:'background 0.2s, transform 0.2s',
        }}
          onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.background='rgba(0,212,255,0.16)';(e.currentTarget as HTMLElement).style.transform='scale(1.08)'}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.background='rgba(0,212,255,0.05)';(e.currentTarget as HTMLElement).style.transform='scale(1)'}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            {isFullscreen
              ? <path d="M9 3v4a2 2 0 0 1-2 2H3M15 3v4a2 2 0 0 0 2 2h4M21 15h-4a2 2 0 0 0-2 2v4M3 15h4a2 2 0 0 1 2 2v4" />
              : <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />}
          </svg>
        </button>
      </div>
    </div>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ cur, onPrev, onNext, onJump }: { cur:number; onPrev:()=>void; onNext:()=>void; onJump:(i:number)=>void }) {
  const jumps = [0, 1, ...EQUIPO_STARTS]
  const activeJumpIndex = cur<=1 ? cur : 1 + EQUIPO_STARTS.filter(s => s<=cur).length
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', height:42, flexShrink:0, zIndex:20, borderTop:'1px solid rgba(0,212,255,0.08)', background:'linear-gradient(to top,rgba(3,8,15,0.97),rgba(3,8,15,0.85))', backdropFilter:'blur(20px)' }}>
      <div style={{ display:'flex', gap:5, alignItems:'center' }}>
        {jumps.map((start,i) => {
          const active = i === activeJumpIndex
          const color = i<2 ? C.cyan : EQUIPOS[i-2]?.color || C.cyan
          return (
            <button key={i} onClick={()=>onJump(start)} title={i<2?['Portada','Índice'][i]:`Equipo ${i-1}`} style={{ width:active?22:5, height:5, borderRadius:3, background:active?color:'rgba(255,255,255,0.08)', border:'none', cursor:'pointer', padding:0, transition:'all 0.4s cubic-bezier(0.34,1.56,0.64,1)', boxShadow:active?`0 0 12px ${color}80`:'none' }} />
          )
        })}
      </div>
      <div style={{ display:'flex', gap:22, alignItems:'center' }}>
        <button onClick={onPrev} disabled={cur===0} style={{ background:'none', border:'none', cursor:cur===0?'not-allowed':'pointer', color:cur===0?'rgba(0,212,255,0.18)':C.muted, fontSize:'0.7rem', fontFamily:'JetBrains Mono,monospace', letterSpacing:'0.12em', transition:'color 0.2s' }}
          onMouseEnter={e=>{if(cur>0)(e.currentTarget as HTMLElement).style.color=C.cyan}}
          onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.color=cur===0?'rgba(0,212,255,0.18)':C.muted as string}}>
          ← ANTERIOR
        </button>
        <button onClick={onNext} disabled={cur===TOTAL-1} style={{ background:'none', border:'none', cursor:cur===TOTAL-1?'not-allowed':'pointer', color:cur===TOTAL-1?'rgba(0,212,255,0.18)':C.cyan, fontSize:'0.7rem', fontFamily:'JetBrains Mono,monospace', letterSpacing:'0.12em', transition:'color 0.2s' }}>
          {cur===0 ? '· PRESIONA → PARA COMENZAR ·' : cur===TOTAL-1 ? '· FIN ·' : 'SIGUIENTE →'}
        </button>
      </div>
    </div>
  )
}

// ─── SLIDE CONTENTS ───────────────────────────────────────────────────────────
function SlideCover({ color }: { color:string }) {
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', position:'relative', zIndex:5, padding:'0 48px' }}>
      <div style={{ animation:'coverSub 0.5s 0.05s both' }}><LineLabel text="UDELAS · INGENIERÍA BIOMÉDICA" /></div>
      <p style={{ fontFamily:'JetBrains Mono,monospace', color:C.cyan, fontSize:'0.67rem', letterSpacing:'0.2em', margin:'20px 0 24px', animation:'coverSub 0.5s 0.15s both' }}>MÓDULO N°2</p>
      <h1 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(2.4rem,5vw,4.5rem)', fontWeight:900, lineHeight:1.1, marginBottom:0 }}>
        <span style={{ color:C.white, display:'block', animation:'coverWord 0.6s 0.22s both' }}>Equipos de</span>
        <span style={{ color:C.cyan, textShadow:`0 0 80px ${C.cyan}50, 0 0 160px ${C.cyan}20`, display:'block', animation:'coverWord 0.65s 0.34s both' }}>Salón de Operaciones</span>
      </h1>
      <div style={{ width:220, height:1, margin:'24px auto', background:`linear-gradient(to right,transparent,${C.purple}cc,${C.cyan}cc,transparent)`, animation:'lineDraw 0.8s 0.55s both' }} />
      <p style={{ color:C.muted, fontSize:'0.93rem', fontStyle:'italic', marginBottom:44, letterSpacing:'0.02em', animation:'coverSub 0.5s 0.65s both' }}>Equipos Médicos I — Estructura por equipo</p>
      <div style={{ display:'flex', gap:12, animation:'elemFadeUp 0.5s 0.75s both' }}>
        <div style={{ border:`1px solid ${C.cyan}40`, borderRadius:10, padding:'11px 24px', color:C.cyan, fontSize:'0.82rem', background:'rgba(0,212,255,0.06)', backdropFilter:'blur(8px)' }}>Ing. Bryan Rodríguez S.</div>
      </div>
    </div>
  )
}

function SlideIndex({ onJump }: { onJump:(i:number)=>void }) {
  return (
    <div style={{ height:'100%', position:'relative', zIndex:5, padding:'22px 44px 14px', display:'flex', flexDirection:'column' }}>
      <SlideH num="00" label="Índice de equipos" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14, flex:1 }}>
        {EQUIPOS.map((e,i) => (
          <button key={i} className="idx-card" onClick={()=>onJump(EQUIPO_STARTS[i])} style={{
            background:`linear-gradient(135deg,rgba(5,15,45,0.9) 0%,${e.color}0a 100%)`,
            border:`1px solid ${e.color}25`, borderRadius:16, padding:'20px 18px', textAlign:'left', cursor:'pointer',
            boxShadow:`0 4px 24px rgba(0,0,0,0.45), 0 0 0 0 ${e.color}00`,
            animation:`elemFadeUp 0.48s ${0.06+i*0.09}s both`,
          }}>
            <div style={{ fontSize:'2rem', marginBottom:10, filter:`drop-shadow(0 0 12px ${e.color}60)` }}>{e.icon}</div>
            <div style={{ fontFamily:'JetBrains Mono,monospace', color:e.color, fontSize:'0.64rem', letterSpacing:'0.12em', marginBottom:5 }}>EQUIPO {e.num}</div>
            <div style={{ fontFamily:'Playfair Display,serif', color:C.white, fontWeight:700, fontSize:'0.93rem', marginBottom:8, lineHeight:1.25 }}>{e.name}</div>
            <p style={{ color:C.muted, fontSize:'0.75rem', lineHeight:1.5, margin:0 }}>{e.desc}</p>
            <div style={{ marginTop:14, color:e.color, fontSize:'0.67rem', fontFamily:'JetBrains Mono,monospace', opacity:0.75 }}>VER EQUIPO →</div>
          </button>
        ))}
      </div>
    </div>
  )
}

function SlideEquipoCover({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  const tags = ['Introducción','Principio','Componentes','Manejo','Marcas','Mantenimiento','Fallas','Conclusión']
  if (e.img) {
    return (
      <div style={{ height:'100%', display:'grid', gridTemplateColumns:'0.95fr 1.05fr', alignItems:'center', position:'relative', zIndex:5, padding:'0 40px', gap:20 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
          <ZoomableImg src={e.img} alt={e.name} style={{
            width:'100%', maxWidth:400, aspectRatio:'1/1',
            filter:`drop-shadow(0 0 40px ${e.color}55)`,
            animation:'zoomIn 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both',
            borderRadius:18, border:`1px solid ${e.color}30`, background:'rgba(0,0,0,0.35)', padding:14,
          }} imgStyle={{ objectFit:'contain' }} />
        </div>
        <div style={{ textAlign:'left' }}>
          <p style={{ fontFamily:'JetBrains Mono,monospace', color:C.muted, fontSize:'0.65rem', letterSpacing:'0.2em', marginBottom:14 }}>EQUIPOS DE SALÓN DE OPERACIONES</p>
          <p style={{ fontFamily:'JetBrains Mono,monospace', color:e.color, fontSize:'0.7rem', letterSpacing:'0.18em', marginBottom:14 }}>EQUIPO N°{e.num}</p>
          <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(1.8rem,3.6vw,3.1rem)', fontWeight:900, color:C.white, lineHeight:1.1, marginBottom:0 }}>
            <span style={{ display:'block', animation:'coverWord 0.55s 0.25s both' }}>{e.name.split(' ').slice(0,-1).join(' ')}{' '}</span>
            <span style={{ color:e.color, textShadow:`0 0 60px ${e.color}50`, display:'block', animation:'coverWord 0.6s 0.38s both' }}>{e.name.split(' ').slice(-1)[0]}</span>
          </h2>
          <div style={{ width:90, height:2, margin:'18px 0', borderRadius:1, background:`linear-gradient(to right,${e.color},transparent)`, boxShadow:`0 0 16px ${e.color}60`, animation:'lineDraw 0.7s 0.55s both' }} />
          <p style={{ color:C.muted, fontSize:'0.85rem', maxWidth:420, fontStyle:'italic', lineHeight:1.6, animation:'coverSub 0.5s 0.65s both' }}>{e.desc}</p>
          <div style={{ marginTop:22, display:'flex', gap:7, flexWrap:'wrap' }}>
            {tags.map((s,i)=>(
              <span key={i} style={{ background:`${e.color}0f`, border:`1px solid ${e.color}28`, color:e.color, borderRadius:999, padding:'3px 11px', fontSize:'0.64rem', fontFamily:'JetBrains Mono,monospace', opacity:0.85, animation:`tagBounce 0.45s ${0.7+i*0.07}s both` }}>{i+1}. {s}</span>
            ))}
          </div>
        </div>
      </div>
    )
  }
  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center', position:'relative', zIndex:5, padding:'0 48px' }}>
      <p style={{ fontFamily:'JetBrains Mono,monospace', color:C.muted, fontSize:'0.65rem', letterSpacing:'0.2em', marginBottom:18 }}>EQUIPOS DE SALÓN DE OPERACIONES</p>
      <div style={{ fontSize:'4rem', marginBottom:22, animation:'iconFloat 4s ease-in-out infinite', filter:`drop-shadow(0 0 30px ${e.color}70)` }}>{e.icon}</div>
      <p style={{ fontFamily:'JetBrains Mono,monospace', color:e.color, fontSize:'0.7rem', letterSpacing:'0.18em', marginBottom:16 }}>EQUIPO N°{e.num}</p>
      <h2 style={{ fontFamily:'Playfair Display,serif', fontSize:'clamp(2rem,4.5vw,3.6rem)', fontWeight:900, color:C.white, lineHeight:1.1, marginBottom:0 }}>
        <span style={{ display:'block', animation:'coverWord 0.55s 0.25s both' }}>{e.name.split(' ').slice(0,-1).join(' ')}{' '}</span>
        <span style={{ color:e.color, textShadow:`0 0 60px ${e.color}50`, display:'block', animation:'coverWord 0.6s 0.38s both' }}>{e.name.split(' ').slice(-1)[0]}</span>
      </h2>
      <div style={{ width:100, height:2, margin:'22px auto', borderRadius:1, background:`linear-gradient(to right,transparent,${e.color},transparent)`, boxShadow:`0 0 16px ${e.color}60`, animation:'lineDraw 0.7s 0.55s both' }} />
      <p style={{ color:C.muted, fontSize:'0.9rem', maxWidth:460, fontStyle:'italic', lineHeight:1.65, animation:'coverSub 0.5s 0.65s both' }}>{e.desc}</p>
      <div style={{ marginTop:32, display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
        {tags.map((s,i)=>(
          <span key={i} style={{ background:`${e.color}0f`, border:`1px solid ${e.color}28`, color:e.color, borderRadius:999, padding:'3px 12px', fontSize:'0.67rem', fontFamily:'JetBrains Mono,monospace', opacity:0.85, animation:`tagBounce 0.45s ${0.7+i*0.07}s both` }}>{i+1}. {s}</span>
        ))}
      </div>
    </div>
  )
}

function SlideIntro({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  return (
    <div style={{ height:'100%', position:'relative', zIndex:5, padding:'26px 48px 16px', display:'flex', flexDirection:'column' }}>
      <SlideH num="01" label="Introducción y función clínica" color={e.color} />
      <div style={{ display:'grid', gridTemplateColumns:'1.4fr 0.6fr', gap:30, flex:1, minHeight:0 }}>
        <div style={{ position:'relative', display:'flex', flexDirection:'column', justifyContent:'center', minHeight:0, overflow:'auto' }}>
          <span style={{ position:'absolute', top:-46, left:-10, fontFamily:'Playfair Display,serif', fontWeight:900, fontSize:'11rem', lineHeight:1, color:`${e.color}10`, userSelect:'none', pointerEvents:'none', zIndex:0 }}>01</span>
          <span style={{ position:'absolute', bottom:-10, right:6, fontSize:'6.5rem', lineHeight:1, opacity:0.08, filter:`drop-shadow(0 0 30px ${e.color})`, userSelect:'none', pointerEvents:'none', zIndex:0 }}>{e.icon}</span>
          <div style={{ position:'relative', zIndex:1 }}>
            <h3 style={{ fontFamily:'JetBrains Mono,monospace', color:e.color, fontSize:'0.68rem', letterSpacing:'0.2em', marginBottom:10, animation:'elemFadeRight 0.4s 0.05s both' }}>¿QUÉ ES?</h3>
            <p style={{ color:C.white, fontSize:'1.08rem', fontWeight:300, lineHeight:1.85, marginBottom:26, maxWidth:660, animation:'elemFadeUp 0.5s 0.1s both' }}>{e.intro.que}</p>
            <h3 style={{ fontFamily:'JetBrains Mono,monospace', color:e.color, fontSize:'0.68rem', letterSpacing:'0.2em', marginBottom:8, animation:'elemFadeRight 0.4s 0.16s both' }}>FUNCIONES PRINCIPALES</h3>
            <div style={{ display:'flex', flexDirection:'column' }}>
              {e.intro.funciones.map((f,i,a)=><DotRow key={i} text={f} last={i===a.length-1} color={e.color} animIdx={i} />)}
            </div>
          </div>
        </div>
        <div style={{ position:'relative', borderLeft:`1px solid ${e.color}25`, paddingLeft:24, display:'flex', flexDirection:'column', justifyContent:'center', minHeight:0, overflow:'auto' }}>
          <h3 style={{ fontFamily:'JetBrains Mono,monospace', color:'#c4a9f0', fontSize:'0.68rem', letterSpacing:'0.2em', marginBottom:16 }}>APLICACIONES CLÍNICAS</h3>
          <div style={{ display:'flex', flexDirection:'column', flex:1, justifyContent:'space-evenly', maxHeight:'100%' }}>
            {e.intro.apps.map((a,i,arr)=>(
              <div key={i} style={{ padding:'9px 0', borderBottom:i===arr.length-1?'none':'1px solid rgba(139,92,246,0.15)', color:'#c4a9f0', fontSize:'0.85rem', lineHeight:1.45, animation:`tagBounce 0.42s ${0.28+i*0.08}s both` }}>{a}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function SlidePrincipio({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  return (
    <div style={{ height:'100%', position:'relative', zIndex:5, padding:'22px 44px 14px', display:'flex', flexDirection:'column' }}>
      <SlideH num="02" label="Principio de funcionamiento" color={e.color} />
      <div style={{ display:'grid', gridTemplateColumns:'1.15fr 0.85fr', gap:14, flex:1, overflow:'auto' }}>
        <Card title="Diagrama de bloques" color={e.color} animIdx={0} style={{ display:'flex', flexDirection:'column' }}>
          <p style={{ color:'rgba(232,244,255,0.7)', fontSize:'0.82rem', marginBottom:14, lineHeight:1.55 }}>{e.principio.concepto}</p>
          <div style={{ position:'relative', flex:1, display:'flex', flexDirection:'column', justifyContent:'space-evenly', gap:8, minHeight:0 }}>
            <div style={{ position:'absolute', left:'50%', top:4, bottom:4, width:1, background:`linear-gradient(to bottom, ${e.color}00, ${e.color}45, ${e.color}00)`, transform:'translateX(-50%)', zIndex:0 }} />
            {e.principio.bloques.map((b,i)=>{
              const rightSide = i%2===1
              return (
                <div key={i} style={{ position:'relative', zIndex:1, display:'flex', justifyContent: rightSide?'flex-end':'flex-start' }}>
                  <div style={{ width:'84%', background:`${e.color}0c`, border:`1px solid ${e.color}30`, borderRadius:7, padding:'8px 14px', color:e.color, fontWeight:600, fontSize:'0.8rem', lineHeight:1.4, animation:`blockPop 0.38s ${0.12+i*0.08}s both` }}>{b}</div>
                </div>
              )
            })}
          </div>
        </Card>
        <Card title="Principios involucrados" color="#8b5cf6" animIdx={1} style={{ display:'flex', flexDirection:'column' }}>
          <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'space-evenly', minHeight:0 }}>
            {e.principio.principios.map(([t,d],i,a)=>(
              <div key={i} style={{ padding:'8px 0', borderBottom:i<a.length-1?'1px solid rgba(255,255,255,0.04)':'none' }}>
                <div style={{ color:'#c4a9f0', fontWeight:700, fontSize:'0.83rem', marginBottom:4 }}>{t}</div>
                <div style={{ color:'rgba(232,244,255,0.68)', fontSize:'0.8rem', lineHeight:1.55 }}>{d}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

// Fotos reales de referencia (manual del fabricante) — solo disponibles para Máquina de Anestesia por ahora
const COMPONENT_PHOTOS: Record<number, { src:string; label:string }[]> = {
  0: [
    { src: imgAnestesiaCircuito, label: 'Bolsa reservorio, absorbedor de CO₂ y vaporizador' },
    { src: imgAnestesiaConector, label: 'Conexión de cilindro — Yugo / PISS' },
  ],
}

function SlideComponentes({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  const photos = COMPONENT_PHOTOS[ei]
  return (
    <div style={{ height:'100%', position:'relative', zIndex:5, padding:'22px 44px 14px', display:'flex', flexDirection:'column' }}>
      <SlideH num="03" label="Componentes principales" color={e.color} />
      <div style={{ display:'grid', gridTemplateColumns: photos ? '1.75fr 1fr' : '1fr', gap:14, flex:1, overflow:'auto' }}>
        <div style={{ display:'grid', gridTemplateColumns: photos ? 'repeat(2,1fr)' : 'repeat(3,1fr)', gridAutoRows:'1fr', gap:14, overflow:'auto' }}>
          {e.componentes.map(([name,desc],i)=>(
            <div key={i} className="glow-card" style={{
              position:'relative', overflow:'hidden', display:'flex', flexDirection:'column', justifyContent:'center',
              background:'linear-gradient(135deg,rgba(5,15,45,0.88) 0%,rgba(8,22,60,0.72) 100%)',
              backdropFilter:'blur(20px)', border:`1px solid ${e.color}1e`, borderRadius:14,
              padding: photos ? '14px 16px' : '20px 24px', boxShadow:'0 8px 24px rgba(0,0,0,0.35)',
              animation:`elemFadeUp 0.45s ${0.05+i*0.06}s both`,
              // @ts-expect-error custom css vars for hover glow
              '--accent': e.color, '--accent-glow': `${e.color}59`,
            }}>
              <span style={{ position:'absolute', right:8, top:-20, fontFamily:'Playfair Display,serif', fontWeight:900, fontSize: photos ? '4rem' : '5.2rem', lineHeight:1, color:`${e.color}16`, userSelect:'none', pointerEvents:'none' }}>{String(i+1).padStart(2,'0')}</span>
              <div style={{ position:'relative', color:e.color, fontWeight:700, fontSize: photos ? '0.85rem' : '1rem', marginBottom:6, maxWidth:'88%' }}>{name}</div>
              <div style={{ position:'relative', color:'rgba(232,244,255,0.72)', fontSize: photos ? '0.73rem' : '0.82rem', lineHeight:1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
        {photos && (
          <Card title="Foto de referencia" color={e.color} animIdx={1} style={{ overflow:'auto' }}>
            <div style={{ display:'grid', gridTemplateColumns:`repeat(${photos.length},1fr)`, gap:10 }}>
              {photos.map((p,i) => (
                <div key={i} style={{ animation:`elemFadeUp 0.45s ${0.15+i*0.1}s both` }}>
                  <ZoomableImg src={p.src} alt={p.label} style={{ borderRadius:12, overflow:'hidden', border:`1px solid ${e.color}25`, background:'#000' }} imgStyle={{ objectFit:'cover', aspectRatio:'1/1' }} />
                  <p style={{ color:C.muted, fontSize:'0.66rem', marginTop:6, lineHeight:1.35, fontStyle:'italic' }}>{p.label}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

function SlideManejo({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  const stages = [
    { label:'Antes', color:e.color, items:e.manejo.antes },
    { label:'Durante', color:'#5b8fff', items:e.manejo.durante },
    { label:'Después', color:'#8b5cf6', items:e.manejo.despues },
  ]
  return (
    <div style={{ height:'100%', position:'relative', zIndex:5, padding:'22px 44px 14px', display:'flex', flexDirection:'column' }}>
      <SlideH num="04" label="Manejo básico" color={e.color} />
      {/* timeline rail */}
      <div style={{ position:'relative', display:'flex', justifyContent:'space-around', alignItems:'center', margin:'10px 20px 26px' }}>
        <div style={{ position:'absolute', left:'8%', right:'8%', top:'50%', height:1, background:`linear-gradient(to right, ${stages[0].color}70, ${stages[1].color}70, ${stages[2].color}70)`, transform:'translateY(-50%)' }} />
        {stages.map((s,i)=>(
          <div key={i} style={{ position:'relative', width:28, height:28, borderRadius:'50%', background:C.bg, border:`2px solid ${s.color}`, display:'flex', alignItems:'center', justifyContent:'center', color:s.color, fontFamily:'JetBrains Mono,monospace', fontWeight:700, fontSize:'0.72rem', boxShadow:`0 0 14px ${s.color}70`, animation:`tagBounce 0.4s ${0.05+i*0.1}s both` }}>{i+1}</div>
        ))}
      </div>
      <div style={{ position:'relative', display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:20, flex:1, minHeight:0 }}>
        <span style={{ position:'absolute', bottom:-10, right:'6%', fontSize:'7.5rem', lineHeight:1, opacity:0.06, filter:`drop-shadow(0 0 30px ${e.color})`, userSelect:'none', pointerEvents:'none', zIndex:0 }}>{e.icon}</span>
        {stages.map((s,i)=>(
          <div key={i} style={{ position:'relative', zIndex:1, transform: i===1 ? 'translateY(-14px)' : 'none', display:'flex', flexDirection:'column', minHeight:0, overflow:'auto' }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
              <span style={{ width:8, height:8, borderRadius:'50%', background:s.color, boxShadow:`0 0 8px ${s.color}`, flexShrink:0 }} />
              <h3 style={{ color:s.color, fontWeight:700, fontSize:'0.8rem', letterSpacing:'0.09em', textTransform:'uppercase', margin:0 }}>{s.label}</h3>
            </div>
            <div style={{ borderLeft:`2px dashed ${s.color}35`, paddingLeft:14, flex:1, display:'flex', flexDirection:'column', justifyContent:'space-evenly', gap:2 }}>
              {s.items.map((t,ti,a)=><DotRow key={ti} text={t} last={ti===a.length-1} color={s.color} animIdx={ti} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SlideMarcas({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  return (
    <div style={{ height:'100%', position:'relative', zIndex:5, padding:'22px 44px 14px', display:'flex', flexDirection:'column' }}>
      <SlideH num="05" label="Marcas y gama de equipos" color={e.color} />
      <Card title="Comparación de marcas" color={e.color} animIdx={0} style={{ flex:1, overflow:'auto' }}>
        <DataTable headers={e.marcas.headers} rows={e.marcas.rows} />
      </Card>
    </div>
  )
}

function SlideMantenimiento({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  const prev = e.mantenimiento.preventivo
  return (
    <div style={{ height:'100%', position:'relative', zIndex:5, padding:'20px 40px 14px', display:'flex', flexDirection:'column' }}>
      <SlideH num="06" label="Mantenimiento y limpieza" color={e.color} />
      <div style={{ position:'relative', flex:'1.3 1 0', display:'flex', flexDirection:'column', justifyContent:'center', padding:'10px 4px', marginBottom:14, minHeight:0 }}>
        <span style={{ position:'absolute', top:'-6%', right:'2%', fontSize:'7rem', lineHeight:1, opacity:0.06, filter:`drop-shadow(0 0 30px ${e.color})`, userSelect:'none', pointerEvents:'none' }}>{e.icon}</span>
        <div style={{ position:'absolute', left:0, right:0, top:'50%', height:1, background:`linear-gradient(to right, transparent, ${e.color}45 8%, ${e.color}45 92%, transparent)`, transform:'translateY(-1px)' }} />
        <div style={{ display:'flex', gap:8 }}>
          {prev.map(([freq,act],i)=>{
            const up = i%2===0
            const box = (
              <div title={act} style={{ background:`${e.color}0c`, border:`1px solid ${e.color}28`, borderRadius:10, padding:'9px 10px', fontSize:'0.7rem', color:'rgba(232,244,255,0.8)', lineHeight:1.4, textAlign:'center', display:'-webkit-box', WebkitLineClamp:6, WebkitBoxOrient:'vertical', overflow:'hidden' }}>{act}</div>
            )
            return (
              <div key={i} style={{ flex:1, position:'relative', display:'flex', flexDirection:'column', alignItems:'center', transform:`translateY(${up?-30:30}px)`, animation:`elemFadeUp 0.45s ${0.06+i*0.09}s both` }}>
                {up && <div style={{ marginBottom:11, width:'100%' }}>{box}</div>}
                <div style={{ width:11, height:11, borderRadius:'50%', background:e.color, boxShadow:`0 0 10px ${e.color}`, border:`2px solid ${C.bg}`, flexShrink:0 }} />
                <div style={{ fontFamily:'JetBrains Mono,monospace', color:e.color, fontSize:'0.63rem', fontWeight:700, marginTop:6, textAlign:'center', letterSpacing:'0.02em' }}>{freq}</div>
                {!up && <div style={{ marginTop:11, width:'100%' }}>{box}</div>}
              </div>
            )
          })}
        </div>
      </div>
      <Card title="Limpieza — qué hacer / evitar" color={C.cyan} animIdx={1} style={{ flex:'1 1 0', overflow:'auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 22px' }}>
          <div>{e.mantenimiento.realizar.map((t,i,a)=><DotRow key={i} text={`✓ ${t}`} last={i===a.length-1} color={C.cyan} animIdx={i} />)}</div>
          <div>{e.mantenimiento.evitar.map((t,i,a)=><DotRow key={i} text={`✕ ${t}`} last={i===a.length-1} color="#f87171" animIdx={i} />)}</div>
        </div>
      </Card>
    </div>
  )
}

function SlideFallas({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  return (
    <div style={{ height:'100%', position:'relative', zIndex:5, padding:'22px 44px 14px', display:'flex', flexDirection:'column' }}>
      <SlideH num="07" label="Fallas comunes y riesgos" color={e.color} />
      <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:14, flex:1, overflow:'auto' }}>
        <Card title="Fallas comunes" color="#f87171" animIdx={0} style={{ overflow:'auto' }}><DataTable headers={['Falla','Causa']} rows={e.fallas.tabla} ac={0} aColor="#fca5a5" /></Card>
        <div style={{ display:'flex', flexDirection:'column', gap:10, overflow:'auto' }}>
          <Card title="Riesgos — paciente" color="#f87171" animIdx={1}>{e.fallas.paciente.map((t,i,a)=><DotRow key={i} text={t} last={i===a.length-1} color="#f87171" animIdx={i} />)}</Card>
          <Card title="Riesgos — biomédico" color="#fbbf24" animIdx={2}>{e.fallas.biomedico.map((t,i,a)=><DotRow key={i} text={t} last={i===a.length-1} color="#fbbf24" animIdx={i} />)}</Card>
        </div>
      </div>
    </div>
  )
}

function SlideConclusion({ ei }: { ei:number }) {
  const e = EQUIPOS[ei]
  return (
    <div style={{ height:'100%', position:'relative', zIndex:5, padding:'22px 44px 14px', display:'flex', flexDirection:'column' }}>
      <SlideH num="08" label="Caso real y conclusión" color={e.color} />
      <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:24, flex:1, overflow:'auto' }}>
        <div style={{ position:'relative', display:'flex', flexDirection:'column' }}>
          <div style={{ position:'relative', background:'linear-gradient(135deg,rgba(38,26,4,0.55),rgba(8,22,60,0.68))', border:'1px solid rgba(251,191,36,0.25)', borderRadius:16, padding:'24px 24px 32px', overflow:'hidden', animation:'elemFadeUp 0.5s 0.05s both' }}>
            <span style={{ position:'absolute', top:-20, left:8, fontFamily:'Playfair Display,serif', fontWeight:900, fontSize:'5.5rem', color:'rgba(251,191,36,0.16)', lineHeight:1, userSelect:'none' }}>&ldquo;</span>
            <h3 style={{ position:'relative', color:'#fbbf24', fontWeight:700, fontSize:'0.7rem', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:10 }}>Caso real</h3>
            <p style={{ position:'relative', color:C.white, fontWeight:600, fontSize:'0.9rem', fontStyle:'italic', lineHeight:1.68, margin:0 }}>{e.conclusion.caso}</p>
          </div>
          <div className="glow-card" style={{
            position:'relative', marginTop:-18, marginLeft:28, marginRight:-6, zIndex:2,
            background:'linear-gradient(135deg,rgba(5,15,45,0.95) 0%,rgba(8,22,60,0.88) 100%)',
            border:`1px solid ${e.color}30`, borderRadius:14, padding:'14px 18px 12px',
            boxShadow:'0 16px 44px rgba(0,0,0,0.5)', animation:'elemFadeUp 0.5s 0.22s both',
            // @ts-expect-error custom css vars for hover glow
            '--accent': e.color, '--accent-glow': `${e.color}59`,
          }}>
            <h3 style={{ color:e.color, fontWeight:700, fontSize:'0.7rem', letterSpacing:'0.09em', textTransform:'uppercase', marginBottom:8 }}>Lecciones aprendidas</h3>
            {e.conclusion.lecciones.map((t,i,a)=><DotRow key={i} text={t} last={i===a.length-1} color={e.color} animIdx={i} />)}
          </div>
        </div>
        <div style={{ position:'relative', borderLeft:'1px solid rgba(139,92,246,0.2)', paddingLeft:24, display:'flex', flexDirection:'column', justifyContent:'center', minHeight:0, overflow:'auto' }}>
          <span style={{ position:'absolute', bottom:-6, right:2, fontFamily:'Playfair Display,serif', fontWeight:900, fontSize:'7rem', lineHeight:1, color:'rgba(139,92,246,0.08)', userSelect:'none', pointerEvents:'none' }}>§</span>
          <h3 style={{ fontFamily:'JetBrains Mono,monospace', color:'#c4a9f0', fontSize:'0.68rem', letterSpacing:'0.12em', textTransform:'uppercase', marginBottom:16 }}>Normativas relacionadas</h3>
          <div style={{ display:'flex', flexDirection:'column', flex:1, justifyContent:'space-evenly', maxHeight:'100%' }}>
            {e.conclusion.normas.map(([id,desc],i,a)=>(
              <div key={i} style={{ padding:'8px 0', borderBottom:i<a.length-1?'1px solid rgba(255,255,255,0.05)':'none', position:'relative', zIndex:1, animation:`rowFadeIn 0.38s ${0.12+i*0.07}s both` }}>
                <div style={{ fontFamily:'JetBrains Mono,monospace', color:'#c4a9f0', fontWeight:700, fontSize:'0.7rem', marginBottom:3 }}>{id}</div>
                <div style={{ color:'rgba(232,244,255,0.7)', fontSize:'0.8rem', lineHeight:1.45 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
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
    <div style={{ height:'100%', position:'relative', zIndex:5, padding:'20px 44px 16px', display:'flex', flexDirection:'column', alignItems:'center' }}>
      <SlideH num="▶" label={`Video demostrativo — ${e.name}`} color={e.color} />
      <div style={{ flex:1, width:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:14, minHeight:0 }}>
        <div style={{
          position:'relative', maxWidth:'min(100%, 860px)', width:'100%', flex:'0 1 auto', minHeight:0,
          borderRadius:16, overflow:'hidden', border:`1px solid ${e.color}35`,
          boxShadow:`0 12px 44px rgba(0,0,0,0.55), 0 0 50px ${e.color}25`,
          background:'#000', animation:'elemFadeUp 0.5s 0.08s both',
        }}>
          <video
            ref={videoRef}
            src={e.video}
            controls
            style={{ display:'block', width:'100%', maxHeight:'56vh', background:'#000' }}
            onPlay={()=>setPlaying(true)}
            onPause={()=>setPlaying(false)}
          />
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10, animation:'elemFadeUp 0.5s 0.2s both' }}>
          <button onClick={()=>skip(-10)} title="Retroceder 10s" style={{ display:'flex', alignItems:'center', gap:6, background:`${e.color}0f`, border:`1px solid ${e.color}35`, color:e.color, borderRadius:10, padding:'8px 16px', fontSize:'0.78rem', fontFamily:'JetBrains Mono,monospace', cursor:'pointer' }}>◀◀ 10s</button>
          <button onClick={togglePlay} title={playing?'Pausar':'Reproducir'} style={{ display:'flex', alignItems:'center', gap:6, background:e.color, border:'none', color:'#03080f', borderRadius:10, padding:'9px 22px', fontSize:'0.82rem', fontWeight:700, fontFamily:'JetBrains Mono,monospace', cursor:'pointer', boxShadow:`0 0 20px ${e.color}70` }}>{playing ? '❚❚ Pausar' : '▶ Reproducir'}</button>
          <button onClick={()=>skip(10)} title="Adelantar 10s" style={{ display:'flex', alignItems:'center', gap:6, background:`${e.color}0f`, border:`1px solid ${e.color}35`, color:e.color, borderRadius:10, padding:'8px 16px', fontSize:'0.78rem', fontFamily:'JetBrains Mono,monospace', cursor:'pointer' }}>10s ▶▶</button>
        </div>
        <p style={{ color:C.muted, fontSize:'0.78rem', fontStyle:'italic', textAlign:'center', maxWidth:600, animation:'coverSub 0.5s 0.3s both' }}>
          Muestra al grupo el funcionamiento real del equipo antes de continuar con el siguiente.
        </p>
      </div>
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
  return (
    <div style={{ height:'100%', position:'relative', zIndex:5, padding:'22px 44px 20px', display:'flex', flexDirection:'column' }}>
      <SlideH num="FIN" label="Cuadro comparativo de equipos" />
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center' }}>
        <div style={{ background:'linear-gradient(135deg,rgba(5,15,45,0.9),rgba(8,22,60,0.75))', backdropFilter:'blur(20px)', border:'1px solid rgba(0,212,255,0.12)', borderRadius:18, overflow:'hidden', animation:'elemFadeUp 0.5s 0.08s both' }}>
          {/* Header row */}
          <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1.5fr 1.4fr 1.2fr', background:'rgba(0,212,255,0.06)', borderBottom:'1px solid rgba(0,212,255,0.15)', padding:'12px 20px' }}>
            {['Equipo','Energía principal','Variable controlada','Riesgo principal'].map((h,i) => (
              <span key={i} style={{ fontFamily:'JetBrains Mono,monospace', color:'rgba(0,212,255,0.75)', fontSize:'0.67rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.09em', animation:`rowFadeIn 0.35s ${0.1+i*0.06}s both` }}>{h}</span>
            ))}
          </div>
          {/* Data rows */}
          {CUADRO_ROWS.map(([equipo, energia, variable, riesgo, color], ri) => (
            <div key={ri} style={{ display:'grid', gridTemplateColumns:'1.6fr 1.5fr 1.4fr 1.2fr', padding:'0 20px', borderBottom:ri<CUADRO_ROWS.length-1?'1px solid rgba(255,255,255,0.05)':'none', animation:`rowFadeIn 0.42s ${0.18+ri*0.09}s both`, transition:'background 0.2s' }}
              onMouseEnter={e=>(e.currentTarget as HTMLElement).style.background=`${color}0a`}
              onMouseLeave={e=>(e.currentTarget as HTMLElement).style.background='transparent'}>
              {/* Equipo name with color accent */}
              <div style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 0' }}>
                <span style={{ width:3, height:28, borderRadius:2, background:color, flexShrink:0, boxShadow:`0 0 8px ${color}60` }} />
                <span style={{ color:C.white, fontWeight:600, fontSize:'0.84rem' }}>{equipo}</span>
              </div>
              {/* Energía */}
              <div style={{ display:'flex', alignItems:'center', padding:'14px 0' }}>
                <span style={{ background:`${color}10`, border:`1px solid ${color}28`, color, borderRadius:6, padding:'3px 10px', fontSize:'0.76rem', fontFamily:'JetBrains Mono,monospace' }}>{energia}</span>
              </div>
              {/* Variable */}
              <div style={{ display:'flex', alignItems:'center', padding:'14px 0' }}>
                <span style={{ color:'rgba(232,244,255,0.78)', fontSize:'0.83rem' }}>{variable}</span>
              </div>
              {/* Riesgo */}
              <div style={{ display:'flex', alignItems:'center', padding:'14px 0' }}>
                <span style={{ background:'rgba(248,113,113,0.08)', border:'1px solid rgba(248,113,113,0.22)', color:'#fca5a5', borderRadius:6, padding:'3px 10px', fontSize:'0.76rem' }}>{riesgo}</span>
              </div>
            </div>
          ))}
        </div>
        <p style={{ textAlign:'center', color:C.muted, fontSize:'0.72rem', fontFamily:'JetBrains Mono,monospace', letterSpacing:'0.08em', marginTop:18, animation:'coverSub 0.5s 0.8s both' }}>
          EQUIPOS DE SALÓN DE OPERACIONES — EQUIPOS MÉDICOS I · UDELAS
        </p>
      </div>
    </div>
  )
}

function RenderContent({ slide, onJump }: { slide:SEntry; onJump:(i:number)=>void }) {
  const ei = slide.ei ?? 0
  const e = ei < EQUIPOS.length ? EQUIPOS[ei] : EQUIPOS[0]
  switch (slide.type) {
    case 'cover':              return <SlideCover color={C.cyan} />
    case 'index':              return <SlideIndex onJump={onJump} />
    case 'equipo-cover':       return <SlideEquipoCover ei={ei} />
    case 'intro':              return <SlideIntro ei={ei} />
    case 'principio':          return <SlidePrincipio ei={ei} />
    case 'componentes':        return <SlideComponentes ei={ei} />
    case 'manejo':             return <SlideManejo ei={ei} />
    case 'marcas':             return <SlideMarcas ei={ei} />
    case 'mantenimiento':      return <SlideMantenimiento ei={ei} />
    case 'fallas':             return <SlideFallas ei={ei} />
    case 'conclusion':         return <SlideConclusion ei={ei} />
    case 'video':              return <SlideVideo ei={ei} />
    case 'cuadro':             return <SlideCuadro />
    default: return null
  }
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
const TRANSITION_MS = 480

export default function App() {
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
      <div ref={rootRef} style={{ width:'100vw', height:'100dvh', background:C.bg, display:'flex', flexDirection:'column', overflow:'hidden', fontFamily:'Outfit,sans-serif', position:'relative' }}>
        <style>{CSS}</style>

        {/* Persistent animated background */}
        <AnimatedBg key={bgTheme} accentColor={accentColor} theme={bgTheme} />

        <Header idx={cur} isFullscreen={isFullscreen} onToggleFullscreen={toggleFullscreen} />

        {/* Slide stack */}
        <div style={{ flex:1, position:'relative', overflow:'hidden' }}>
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

        <Footer cur={cur} onPrev={()=>go(-1)} onNext={()=>go(1)} onJump={jump} />

        {zoomImage && <Lightbox src={zoomImage.src} alt={zoomImage.alt} onClose={()=>setZoomImage(null)} />}
      </div>
    </ImageZoomCtx.Provider>
  )
}
