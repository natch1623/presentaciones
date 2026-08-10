import {
  SlideLayout,
  SlideTag,
  SlideTitle,
  Frost,
  SpecTable,
  Callout,
  Freq,
  Tool,
  Panel,
  Figure,
} from './SlideLayout'

/**
 * Rutina preventiva de la centrífuga.
 *
 * El formato —punto, cada cuánto, cómo, contra qué se acepta— es el que
 * repiten los seis equipos: una rutina sin criterio de aceptación no se
 * puede auditar ni discutir con el usuario del equipo.
 */
export default function S09_CF_Rutina() {
  const RUTINA: [string, React.ReactNode, string, string][] = [
    [
      'Cámara y rotor',
      <Freq tone="frost">Cada uso</Freq>,
      'Inspección visual y limpieza de derrames con desinfectante compatible con aluminio.',
      'Sin residuo, sin corrosión ni picaduras.',
    ],
    [
      'Enclavamiento de tapa',
      <Freq tone="frost">Cada uso</Freq>,
      'Intentar abrir con el rotor girando y arrancar con la tapa abierta.',
      'No arranca abierta · no abre en movimiento.',
    ],
    [
      'Tubos, copas y adaptadores',
      <Freq tone="rift">Semanal</Freq>,
      'Revisar fisuras y deformación; verificar juego completo y del mismo peso.',
      'Se descarta toda pieza con grieta, aunque sea capilar.',
    ],
    [
      'Rosca y asiento del rotor',
      <Freq tone="rift">Mensual</Freq>,
      'Limpiar, secar y lubricar con la grasa indicada por el fabricante.',
      'Asienta a fondo · tuerca al par especificado.',
    ],
    [
      'Nivelación y amortiguadores',
      <Freq tone="rift">Mensual</Freq>,
      'Nivel de burbuja sobre la carcasa; revisar soportes antivibración endurecidos.',
      'Nivelada · sin desplazamiento del equipo en arranque.',
    ],
    [
      'Velocidad (rpm)',
      <Freq tone="amber">Semestral</Freq>,
      'Tacómetro óptico sobre marca reflectiva, tapa cerrada y a régimen.',
      'Desviación ≤ ±5 % del valor nominal.',
    ],
    [
      'Temporizador',
      <Freq tone="amber">Semestral</Freq>,
      'Cronómetro patrón contra un ciclo programado de 10 min.',
      'Desviación ≤ ±10 % del tiempo programado.',
    ],
    [
      'Escobillas y rodamientos',
      <Freq tone="amber">Semestral</Freq>,
      'Medir longitud de escobilla; escuchar el eje en desaceleración libre.',
      'Sobre el mínimo · sin ruido metálico ni vibración.',
    ],
    [
      'Seguridad eléctrica',
      <Freq tone="crimson">Anual</Freq>,
      'Continuidad de tierra de protección y corriente de fuga con analizador.',
      'Tierra ≤ 0,2 Ω · fuga dentro de norma.',
    ],
  ]

  return (
    <SlideLayout>
      <SlideTag>01 · Centrífuga — rutina</SlideTag>
      <SlideTitle size="md">
        <span>Qué se toca, cada cuánto y </span>
        <Frost><span>contra qué valor se acepta</span></Frost>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 286px', gap: 22, flex: 1, minHeight: 0 }}>
        <div style={{ minWidth: 0 }}>
          <SpecTable
            head={['Punto', 'Frecuencia', 'Procedimiento', 'Criterio de aceptación']}
            cols="146px 84px 1fr 0.86fr"
            rows={RUTINA}
            fontSize={10.6}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13, minWidth: 0 }}>
          <Figure
            tone="frost"
            height={132}
            file="centrifuga/rotor-inspeccion.jpg"
            hint="Rotor desmontado sobre el banco, con la rosca y el asiento cónico a la vista."
          />

          <Panel label="Con qué se hace" tone="frost">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <Tool>Tacómetro óptico</Tool>
              <Tool>Cronómetro patrón</Tool>
              <Tool>Analizador de seguridad</Tool>
              <Tool>Torquímetro</Tool>
              <Tool>Pie de rey</Tool>
              <Tool>Nivel de burbuja</Tool>
              <Tool>Detergente pH 6–8</Tool>
            </div>
          </Panel>

          <Callout kind="amber" title="Error frecuente">
            Limpiar la cámara con hipoclorito: ataca el aluminio del rotor y deja picaduras que
            después nadie asocia con la falla.
          </Callout>

          <Callout kind="mint" title="Se firma lo que se mide">
            La rutina cierra con el valor obtenido, no con un visto bueno. «rpm 3 480 / nominal
            3 500» vale; «OK» no vale.
          </Callout>
        </div>
      </div>

      <div
        className="font-mono stagger-item"
        style={{ marginTop: 10, fontSize: 9.5, color: 'var(--ice-faint)', letterSpacing: '0.05em' }}
      >
        <span>
          Frecuencias y tolerancias de referencia: se ajustan a lo que indique el manual de servicio
          del modelo y a la carga de trabajo del laboratorio.
        </span>
      </div>
    </SlideLayout>
  )
}
