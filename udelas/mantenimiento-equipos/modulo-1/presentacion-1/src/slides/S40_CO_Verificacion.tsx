import { SlideLayout, SlideTag, SlideTitle, Frost, Step, Figure, Panel, Callout } from './SlideLayout'

/**
 * Verificación de las tres variables. El punto que más se equivoca es
 * el tiempo: medir sin estabilizar da un número que no significa nada,
 * así que la línea de tiempo va dibujada.
 */
export default function S40_CO_Verificacion() {
  return (
    <SlideLayout>
      <SlideTag tone="mint">06 · Incubadora de CO₂ — verificación</SlideTag>
      <SlideTitle size="md">
        <span>Medir las tres variables </span>
        <Frost><span>y respetar el tiempo de estabilización</span></Frost>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 15, minWidth: 0 }}>
          <Panel label="CO₂ · analizador independiente" tone="mint">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <Step n="1" title="Cámara cerrada y estabilizada" tone="mint">
                Sin aperturas durante al menos 30 min antes de muestrear.
              </Step>
              <Step n="2" title="Muestrear por el puerto" tone="mint">
                Nunca abriendo la puerta: el aire de la sala falsea la lectura de inmediato.
              </Step>
              <Step n="3" title="Comparar y ajustar" tone="mint">
                Contra el valor del display. Ajustar sólo con el procedimiento del fabricante.
              </Step>
            </div>
          </Panel>

          <Panel label="Temperatura · termómetro patrón" tone="frost">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <Step n="1" title="Sonda en el centro">
                Sobre la bandeja de trabajo, no pegada a la pared ni al sensor del equipo.
              </Step>
              <Step n="2" title="Esperar de 30 a 60 min">
                Hasta lectura estable; recién ahí se compara con el display.
              </Step>
              <Step n="3" title="Uniformidad">
                Repetir en las cuatro esquinas y anotar la diferencia máxima entre posiciones.
              </Step>
            </div>
          </Panel>

          <Panel label="Recuperación · la prueba que revela fugas" tone="amber">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              <Step n="1" title="Abrir 30 segundos" tone="amber">
                Con la cámara en régimen y el cronómetro corriendo.
              </Step>
              <Step n="2" title="Cronometrar el retorno" tone="amber">
                Tiempo hasta volver al valor ajustado de CO₂ y de temperatura.
              </Step>
              <Step n="3" title="Comparar con el histórico" tone="amber">
                Una recuperación cada vez más lenta anuncia fuga, filtro tapado o solenoide gastado.
              </Step>
            </div>
          </Panel>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <Figure tone="mint" caption="Qué pasa al abrir la puerta y cuándo tiene sentido medir.">
            <LineaEstabilizacion />
          </Figure>

          <Callout kind="mint" title="Buscar la fuga con jabón">
            Solución jabonosa en el marco de la puerta y en las conexiones de la línea de CO₂, con
            el equipo presurizado. La burbuja aparece donde el consumo se está yendo.
          </Callout>

          <Callout kind="amber" title="El consumo también es un instrumento">
            Anotar cuánto dura un cilindro. Si la duración cae de dos meses a tres semanas sin que
            cambie el uso, hay una fuga aunque todas las lecturas se vean bien.
          </Callout>
        </div>
      </div>
    </SlideLayout>
  )
}

/* ── Línea de tiempo de la recuperación tras abrir la puerta ── */
function LineaEstabilizacion() {
  const ICE = '#eaf6ff'
  const MINT = '#4fe3c1'
  const AMBER = '#ffb44d'
  const CRIMSON = '#ff4d6a'

  return (
    <svg viewBox="0 0 440 230" style={{ width: '100%', height: '100%' }}>
      {/* zona no válida para medir */}
      <rect x="52" y="26" width="150" height="132" fill="rgba(255,77,106,0.09)" />
      <text x="127" y="44" textAnchor="middle" fill={CRIMSON} fontSize="9" fontFamily="JetBrains Mono, monospace">
        no medir aquí
      </text>

      {/* zona válida */}
      <rect x="202" y="26" width="204" height="132" fill="rgba(79,227,193,0.07)" />
      <text x="304" y="44" textAnchor="middle" fill={MINT} fontSize="9" fontFamily="JetBrains Mono, monospace">
        lectura válida
      </text>

      {/* ejes */}
      <line x1="52" y1="158" x2="406" y2="158" stroke={ICE} strokeOpacity="0.4" strokeWidth="1.2" />
      <line x1="52" y1="26" x2="52" y2="158" stroke={ICE} strokeOpacity="0.4" strokeWidth="1.2" />

      {/* setpoint */}
      <line x1="52" y1="60" x2="406" y2="60" stroke={MINT} strokeOpacity="0.45" strokeWidth="1" strokeDasharray="5 4" />
      <text x="410" y="63" fill={MINT} fontSize="8.5" fontFamily="JetBrains Mono, monospace">
        5 %
      </text>

      {/* curva de CO2 */}
      <path
        d="M 52,60 L 74,60 L 84,146 L 110,104 L 140,78 L 176,66 L 220,61 L 406,60"
        fill="none"
        stroke={AMBER}
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* apertura de puerta */}
      <line x1="79" y1="26" x2="79" y2="158" stroke={CRIMSON} strokeWidth="1.4" />
      <text x="79" y="20" textAnchor="middle" fill={CRIMSON} fontSize="8.5" fontFamily="JetBrains Mono, monospace">
        puerta
      </text>

      {/* marca de recuperación */}
      <line x1="202" y1="26" x2="202" y2="158" stroke={MINT} strokeWidth="1.2" strokeDasharray="4 3" />
      <path d="M 84,176 L 200,176 M 90,172 L 82,176 L 90,180 M 194,172 L 202,176 L 194,180" stroke={MINT} strokeWidth="1" fill="none" />
      <text x="143" y="192" textAnchor="middle" fill={MINT} fontSize="9" fontFamily="JetBrains Mono, monospace">
        tiempo de recuperación
      </text>

      {/* eje x */}
      <text x="52" y="214" fill={ICE} fillOpacity="0.45" fontSize="8.5" fontFamily="JetBrains Mono, monospace">
        0
      </text>
      <text x="406" y="214" textAnchor="end" fill={ICE} fillOpacity="0.45" fontSize="8.5" fontFamily="JetBrains Mono, monospace">
        minutos
      </text>
    </svg>
  )
}
