import { SlideLayout, SlideTag, SlideTitle, Frost, Figure, Panel, SpecTable } from './SlideLayout'

/**
 * Anatomía y la distinción TC / IR del sensor de CO₂, que decide la
 * frecuencia de recalibración y explica por qué una incubadora «se
 * desajusta» después de cada descontaminación.
 */
export default function S38_CO_Anatomia() {
  const PARTES = [
    { n: 1, k: 'Camisa térmica', d: 'De agua o de aire. La de agua es más estable pero exige controlar el nivel y el biocida.' },
    { n: 2, k: 'Sensor de temperatura', d: 'Su ubicación no coincide con el centro de la cámara: por eso se verifica con patrón.' },
    { n: 3, k: 'Sensor de CO₂', d: 'Conductividad térmica o infrarrojo. Determina cuándo hay que recalibrar.' },
    { n: 4, k: 'Válvula solenoide de CO₂', d: 'Inyecta al caer el porcentaje. Si gotea, el CO₂ se dispara al abrir la puerta.' },
    { n: 5, k: 'Filtro de línea 0,2 µm', d: 'Entre el cilindro y la cámara. Tapado, la reposición se vuelve lenta.' },
    { n: 6, k: 'Bandeja de agua', d: 'Da la humedad y es el principal reservorio de contaminación del equipo.' },
    { n: 7, k: 'Puerta interior de vidrio', d: 'Permite ver sin perder atmósfera. Su empaque es el que se revisa por fugas.' },
    { n: 8, k: 'Filtro HEPA interno', d: 'Limpia el aire que recircula. Se reemplaza, no se lava.' },
  ]

  const SENSORES: [string, string, string][] = [
    ['Conductividad térmica (TC)', 'Le afectan la humedad y la temperatura', 'Recalibrar tras cada descontaminación y esperar 12–24 h de estabilización'],
    ['Infrarrojo (IR)', 'Indiferente a la humedad', 'Más estable; verificación periódica según fabricante'],
  ]

  return (
    <SlideLayout>
      <SlideTag tone="mint">06 · Incubadora de CO₂ — anatomía</SlideTag>
      <SlideTitle size="md">
        <span>Tres variables sostenidas y </span>
        <Frost><span>un sensor que define el mantenimiento</span></Frost>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1.02fr 0.98fr', gap: 28, flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
          <Figure tone="mint" caption="Corte esquemático: camisa, cámara, línea de CO₂ y bandeja de humedad.">
            <IncubadoraCorte />
          </Figure>

          <Panel label="El tipo de sensor cambia la rutina" tone="rift">
            <SpecTable
              head={['Sensor', 'Comportamiento', 'Consecuencia práctica']}
              cols="1fr 1fr 1.5fr"
              rows={SENSORES}
              fontSize={10.5}
            />
          </Panel>
        </div>

        <Panel label="Partes de servicio" tone="mint" style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PARTES.map((p, i) => (
              <div
                key={p.n}
                className="stagger-item"
                style={{
                  display: 'flex',
                  gap: 11,
                  alignItems: 'flex-start',
                  paddingBottom: 7,
                  borderBottom: i < PARTES.length - 1 ? '1px solid rgba(234,246,255,0.06)' : 'none',
                }}
              >
                <span
                  className="font-mono"
                  style={{
                    flexShrink: 0,
                    width: 21,
                    height: 21,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 10,
                    color: 'var(--mint)',
                    background: 'rgba(79,227,193,0.11)',
                    border: '1px solid rgba(79,227,193,0.35)',
                    clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
                  }}
                >
                  {p.n}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, color: 'var(--ice)', fontWeight: 500, lineHeight: 1.25 }}>
                    <span>{p.k}</span>
                  </div>
                  <p style={{ fontSize: 10.8, color: 'var(--ice-faint)', lineHeight: 1.45, margin: '2px 0 0' }}>
                    <span>{p.d}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </SlideLayout>
  )
}

/* ── Corte de la incubadora ── */
function IncubadoraCorte() {
  const ICE = '#eaf6ff'
  const MINT = '#4fe3c1'
  const FROST = '#8fdcff'
  const AMBER = '#ffb44d'

  const Pin = ({ n, x, y, lx, ly }: { n: number; x: number; y: number; lx: number; ly: number }) => (
    <g>
      <line x1={x} y1={y} x2={lx} y2={ly} stroke={MINT} strokeWidth="0.8" strokeOpacity="0.55" />
      <circle cx={lx} cy={ly} r="1.6" fill={MINT} />
      <g transform={`translate(${x} ${y})`}>
        <path d="M0,-8 L8,0 L0,8 L-8,0 Z" fill="#04050e" stroke={MINT} strokeWidth="1" />
        <text x="0" y="3" textAnchor="middle" fill={MINT} fontSize="8.5" fontFamily="JetBrains Mono, monospace">
          {n}
        </text>
      </g>
    </g>
  )

  return (
    <svg viewBox="0 0 460 290" style={{ width: '100%', height: '100%' }}>
      {/* carcasa exterior */}
      <rect x="96" y="26" width="240" height="238" fill="#070a1a" stroke={ICE} strokeOpacity="0.32" strokeWidth="1.4" />
      {/* camisa */}
      <rect x="110" y="40" width="212" height="210" fill="rgba(143,220,255,0.07)" stroke={FROST} strokeOpacity="0.5" strokeWidth="1.2" />
      <g stroke={FROST} strokeOpacity="0.28" strokeWidth="0.9">
        {Array.from({ length: 8 }, (_, i) => (
          <line key={i} x1="114" y1={54 + i * 25} x2="124" y2={54 + i * 25} />
        ))}
      </g>
      {/* cámara */}
      <rect x="128" y="58" width="176" height="174" fill="#04050e" stroke={ICE} strokeOpacity="0.45" strokeWidth="1.2" />

      {/* bandejas */}
      {[0, 1, 2].map(i => (
        <line key={i} x1="136" y1={88 + i * 38} x2="296" y2={88 + i * 38} stroke={ICE} strokeOpacity="0.35" strokeWidth="1.6" />
      ))}

      {/* bandeja de agua */}
      <path d="M 156,214 L 276,214 L 272,228 L 160,228 Z" fill="rgba(79,227,193,0.24)" stroke={MINT} strokeWidth="1.2" />

      {/* puerta interior de vidrio */}
      <rect x="304" y="58" width="10" height="174" fill="rgba(143,220,255,0.12)" stroke={FROST} strokeOpacity="0.6" strokeWidth="1.2" />
      {/* puerta exterior */}
      <rect x="336" y="26" width="14" height="238" fill="#0b1030" stroke={ICE} strokeOpacity="0.4" strokeWidth="1.2" />
      {/* empaque */}
      <line x1="333" y1="30" x2="333" y2="260" stroke={AMBER} strokeWidth="2.4" />

      {/* sensores */}
      <rect x="140" y="66" width="22" height="10" fill="#0b1030" stroke={FROST} strokeWidth="1.1" />
      <rect x="170" y="66" width="26" height="10" fill="#0b1030" stroke={MINT} strokeWidth="1.1" />

      {/* filtro HEPA interno */}
      <rect x="252" y="64" width="44" height="9" fill="none" stroke={FROST} strokeWidth="1.1" strokeDasharray="3 2" />

      {/* línea de CO2 */}
      <path d="M 40,180 L 40,120 L 96,120" fill="none" stroke={AMBER} strokeWidth="1.5" />
      {/* cilindro */}
      <path d="M 26,182 L 54,182 L 54,252 Q 40,262 26,252 Z" fill="#0b1030" stroke={AMBER} strokeWidth="1.3" />
      <rect x="34" y="172" width="12" height="12" fill="none" stroke={AMBER} strokeWidth="1.1" />
      <text x="40" y="222" textAnchor="middle" fill={AMBER} fontSize="9" fontFamily="JetBrains Mono, monospace">
        CO₂
      </text>
      {/* solenoide */}
      <rect x="60" y="112" width="18" height="16" fill="#04050e" stroke={AMBER} strokeWidth="1.2" />
      {/* filtro de línea */}
      <circle cx="88" cy="120" r="6" fill="none" stroke={AMBER} strokeWidth="1.1" strokeDasharray="2 2" />

      {/* puerto de muestreo */}
      <circle cx="320" cy="150" r="5" fill="#04050e" stroke={MINT} strokeWidth="1.2" />
      <text x="366" y="153" fill={MINT} fontSize="8.5" fontFamily="JetBrains Mono, monospace">
        puerto
      </text>
      <line x1="326" y1="150" x2="362" y2="150" stroke={MINT} strokeWidth="0.9" strokeDasharray="3 2" />

      {/* marcadores */}
      <Pin n={1} x={118} y={16} lx={118} ly={44} />
      <Pin n={2} x={152} y={40} lx={151} ly={64} />
      <Pin n={3} x={196} y={34} lx={183} ly={64} />
      <Pin n={4} x={69} y={92} lx={69} ly={110} />
      <Pin n={5} x={88} y={94} lx={88} ly={113} />
      <Pin n={6} x={216} y={252} lx={216} ly={228} />
      <Pin n={7} x={309} y={264} lx={309} ly={236} />
      <Pin n={8} x={274} y={40} lx={274} ly={62} />
    </svg>
  )
}
