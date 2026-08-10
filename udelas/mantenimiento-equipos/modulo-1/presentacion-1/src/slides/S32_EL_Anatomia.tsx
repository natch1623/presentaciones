import { SlideLayout, SlideTag, SlideTitle, Rift, Figure, Panel, Callout } from './SlideLayout'

/**
 * Circuito de fluidos y geometría del par de agujas. Se dibujan los
 * dos: el circuito explica de dónde viene una falla de volumen, y el
 * detalle del pozo explica por qué la altura de la aguja aspiradora
 * decide el volumen residual.
 */
export default function S32_EL_Anatomia() {
  const PARTES = [
    { n: 1, k: 'Depósito de buffer', d: 'Nivel y filtro de succión. El buffer viejo precipita y arrastra sales al circuito.' },
    { n: 2, k: 'Bomba de dispensación', d: 'Peristáltica o de diafragma. El tubo peristáltico se aplasta y baja el volumen de forma gradual.' },
    { n: 3, k: 'Válvulas y tubería', d: 'Solenoides que abren cada canal. Una válvula sucia gotea entre ciclos.' },
    { n: 4, k: 'Agujas dispensadoras', d: 'Las cortas. Entregan el volumen programado contra la pared del pozo.' },
    { n: 5, k: 'Agujas aspiradoras', d: 'Las largas. Su altura sobre el fondo define el volumen residual.' },
    { n: 6, k: 'Carro portaplacas', d: 'Ejes de posicionamiento y sensor de origen. Un desajuste dobla las agujas contra el borde.' },
    { n: 7, k: 'Trampa y filtro', d: 'Frasco de residuos con filtro hidrofóbico: si se moja, el vacío cae y deja de aspirar.' },
    { n: 8, k: 'Bomba de vacío', d: 'Genera la aspiración. Sellos y nivel de ruido son sus indicadores de desgaste.' },
  ]

  return (
    <SlideLayout>
      <SlideTag tone="rift">05 · Lavador de ELISA — anatomía</SlideTag>
      <SlideTitle size="md">
        <span>Un circuito de fluidos y </span>
        <Rift><span>dos agujas por pozo</span></Rift>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1.08fr 0.92fr', gap: 28, flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
          <Figure tone="rift" caption="Circuito de dispensación y de aspiración, y el par de agujas dentro del pozo.">
            <CircuitoLavador />
          </Figure>

          <Callout kind="amber" title="La altura decide el residual">
            La aguja aspiradora debe quedar lo más cerca posible del fondo sin tocarlo. Un milímetro
            de más deja residual suficiente para subir el fondo del ensayo; un milímetro de menos
            raya el pozo y desprende el recubrimiento.
          </Callout>
        </div>

        <Panel label="Partes de servicio" tone="rift" style={{ minWidth: 0 }}>
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
                    color: 'var(--rift-soft)',
                    background: 'rgba(125,99,255,0.11)',
                    border: '1px solid rgba(125,99,255,0.35)',
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

/* ── Circuito de fluidos + detalle del pozo ── */
function CircuitoLavador() {
  const ICE = '#eaf6ff'
  const RIFT = '#7d63ff'
  const FROST = '#8fdcff'
  const MINT = '#4fe3c1'

  const Pin = ({ n, x, y, lx, ly }: { n: number; x: number; y: number; lx: number; ly: number }) => (
    <g>
      <line x1={x} y1={y} x2={lx} y2={ly} stroke={RIFT} strokeWidth="0.8" strokeOpacity="0.55" />
      <circle cx={lx} cy={ly} r="1.6" fill={RIFT} />
      <g transform={`translate(${x} ${y})`}>
        <path d="M0,-8 L8,0 L0,8 L-8,0 Z" fill="#04050e" stroke={RIFT} strokeWidth="1" />
        <text x="0" y="3" textAnchor="middle" fill={RIFT} fontSize="8.5" fontFamily="JetBrains Mono, monospace">
          {n}
        </text>
      </g>
    </g>
  )

  return (
    <svg viewBox="0 0 500 300" style={{ width: '100%', height: '100%' }}>
      {/* ─── circuito, mitad izquierda ─── */}
      {/* depósito buffer */}
      <path d="M 30,74 L 74,74 L 70,124 L 34,124 Z" fill="#0b1030" stroke={FROST} strokeWidth="1.2" />
      <line x1="32" y1="90" x2="72" y2="90" stroke={FROST} strokeOpacity="0.5" strokeWidth="1" />

      {/* línea de dispensación */}
      <path d="M 70,100 L 104,100" stroke={FROST} strokeWidth="1.4" />
      {/* bomba */}
      <circle cx="120" cy="100" r="16" fill="#04050e" stroke={FROST} strokeWidth="1.3" />
      <path d="M 120,86 A 14,14 0 0 1 134,100" fill="none" stroke={FROST} strokeWidth="1.3" />
      <path d="M 136,100 L 168,100" stroke={FROST} strokeWidth="1.4" />
      {/* válvula */}
      <path d="M 168,92 L 184,100 L 168,108 Z M 200,92 L 184,100 L 200,108 Z" fill="none" stroke={FROST} strokeWidth="1.2" />
      <path d="M 200,100 L 226,100 L 226,140" stroke={FROST} strokeWidth="1.4" fill="none" />

      {/* cabezal */}
      <rect x="196" y="140" width="60" height="16" fill="#0b1030" stroke={ICE} strokeOpacity="0.55" strokeWidth="1.2" />
      {/* agujas */}
      {[0, 1, 2, 3].map(i => (
        <g key={i}>
          <line x1={206 + i * 14} y1="156" x2={206 + i * 14} y2="176" stroke={FROST} strokeWidth="1.3" />
          <line x1={211 + i * 14} y1="156" x2={211 + i * 14} y2="186" stroke={MINT} strokeWidth="1.3" />
        </g>
      ))}

      {/* placa */}
      <rect x="188" y="188" width="80" height="26" fill="#04050e" stroke={ICE} strokeOpacity="0.5" strokeWidth="1.2" />
      {[0, 1, 2, 3].map(i => (
        <rect key={i} x={200 + i * 14} y="190" width="10" height="20" fill="none" stroke={ICE} strokeOpacity="0.3" strokeWidth="0.8" />
      ))}
      {/* carro */}
      <path d="M 176,214 L 280,214 M 182,220 L 274,220" stroke={ICE} strokeOpacity="0.3" strokeWidth="1.1" />

      {/* línea de aspiración */}
      <path d="M 256,148 L 288,148 L 288,88" stroke={MINT} strokeWidth="1.4" fill="none" strokeDasharray="5 3" />
      {/* trampa */}
      <path d="M 268,88 L 312,88 L 308,142 L 272,142 Z" fill="#0b1030" stroke={MINT} strokeWidth="1.2" />
      <line x1="270" y1="118" x2="310" y2="118" stroke={MINT} strokeOpacity="0.5" strokeWidth="1" />
      {/* filtro hidrofóbico */}
      <rect x="282" y="70" width="16" height="10" fill="none" stroke={MINT} strokeWidth="1.2" strokeDasharray="2 2" />
      {/* bomba de vacío */}
      <path d="M 298,74 L 330,74" stroke={MINT} strokeWidth="1.4" />
      <circle cx="346" cy="74" r="15" fill="#04050e" stroke={MINT} strokeWidth="1.3" />
      <path d="M 340,68 L 352,74 L 340,80 Z" fill={MINT} fillOpacity="0.7" />

      {/* ─── detalle del pozo, derecha ─── */}
      <g transform="translate(378 118)">
        <text x="52" y="-24" textAnchor="middle" fill={ICE} fillOpacity="0.5" fontSize="9" fontFamily="JetBrains Mono, monospace">
          detalle del pozo
        </text>
        {/* pozo */}
        <path d="M 20,0 L 20,110 Q 20,124 52,124 Q 84,124 84,110 L 84,0" fill="#04050e" stroke={ICE} strokeOpacity="0.55" strokeWidth="1.6" />
        {/* líquido residual */}
        <path d="M 21,108 Q 21,122 52,122 Q 83,122 83,108 Z" fill={RIFT} fillOpacity="0.5" />
        {/* aguja dispensadora */}
        <line x1="38" y1="-6" x2="38" y2="42" stroke={FROST} strokeWidth="2.6" />
        <path d="M 38,44 q 6,16 10,34" fill="none" stroke={FROST} strokeWidth="1" strokeDasharray="3 3" />
        {/* aguja aspiradora */}
        <line x1="66" y1="-6" x2="66" y2="104" stroke={MINT} strokeWidth="2.6" />
        {/* cota de altura */}
        <path d="M 76,104 L 76,116 M 73,107 L 76,102 L 79,107 M 73,113 L 76,118 L 79,113" stroke={MINT} strokeWidth="0.9" fill="none" />
        <text x="94" y="113" fill={MINT} fontSize="8.5" fontFamily="JetBrains Mono, monospace">
          h
        </text>
        <text x="30" y="146" fill={FROST} fontSize="8.5" fontFamily="JetBrains Mono, monospace">
          dispensa
        </text>
        <text x="30" y="158" fill={MINT} fontSize="8.5" fontFamily="JetBrains Mono, monospace">
          aspira
        </text>
      </g>

      {/* marcadores */}
      <Pin n={1} x={52} y={52} lx={52} ly={72} />
      <Pin n={2} x={120} y={62} lx={120} ly={84} />
      <Pin n={3} x={184} y={70} lx={184} ly={92} />
      <Pin n={4} x={168} y={182} lx={204} ly={168} />
      <Pin n={5} x={168} y={210} lx={209} ly={182} />
      <Pin n={6} x={294} y={230} lx={272} ly={217} />
      <Pin n={7} x={330} y={128} lx={308} ly={120} />
      <Pin n={8} x={346} y={38} lx={346} ly={58} />
    </svg>
  )
}
