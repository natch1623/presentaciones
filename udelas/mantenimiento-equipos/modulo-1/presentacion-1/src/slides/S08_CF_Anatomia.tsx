import { SlideLayout, SlideTag, SlideTitle, Frost, Figure, Panel, Callout } from './SlideLayout'

/**
 * Anatomía de servicio de la centrífuga: no el despiece del fabricante,
 * sino las ocho zonas que el técnico abre, mide o reemplaza.
 */
export default function S08_CF_Anatomia() {
  const PARTES = [
    { n: 1, k: 'Tapa y enclavamiento', d: 'Bisagra, cierre y microswitch. Se prueba en cada rutina: sin él, la máquina se abre girando.' },
    { n: 2, k: 'Cámara o cuba', d: 'Recibe todo derrame. Limpieza y secado; buscar picaduras y corrosión en el fondo.' },
    { n: 3, k: 'Rotor y asiento cónico', d: 'Inspección de fisuras y corrosión, limpieza de la rosca, grasa del fabricante y par de apriete.' },
    { n: 4, k: 'Portatubos y copas', d: 'Juego completo, mismo peso, sin grietas. Una copa faltante obliga a cargar en cruz.' },
    { n: 5, k: 'Eje y rodamientos', d: 'Se escuchan en desaceleración libre: ruido metálico o vibración creciente los delata.' },
    { n: 6, k: 'Motor y escobillas', d: 'Longitud de escobilla sobre el mínimo, conmutador sin surcos ni carbonilla.' },
    { n: 7, k: 'Amortiguadores y pies', d: 'Soportes antivibración endurecidos transmiten todo al mesón. Nivelación con burbuja.' },
    { n: 8, k: 'Control y sensor de velocidad', d: 'Lectura del display contra el tacómetro externo; temporizador y detección de desbalance.' },
  ]

  return (
    <SlideLayout>
      <SlideTag>01 · Centrífuga — anatomía</SlideTag>
      <SlideTitle size="md">
        <span>Las ocho zonas que </span>
        <Frost><span>se abren, se miden o se reemplazan</span></Frost>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1.02fr 0.98fr', gap: 30, flex: 1, minHeight: 0 }}>
        <Figure
          tone="frost"
          caption="Corte esquemático. Los números corresponden a la lista de la derecha."
        >
          <CentrifugaCorte />
        </Figure>

        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Panel label="Interfaz de servicio" tone="frost" style={{ flex: 1, minHeight: 0 }}>
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
                      color: 'var(--frost)',
                      background: 'rgba(143,220,255,0.09)',
                      border: '1px solid rgba(143,220,255,0.3)',
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

          <div style={{ marginTop: 12 }}>
            <Callout kind="rift" title="Ángulo fijo o basculante">
              El rotor de ángulo fijo mantiene el tubo inclinado y sedimenta contra la pared; el
              basculante lo lleva a la horizontal y da una interfase plana. Cambiar de uno a otro
              cambia el tiempo de separación aunque las rpm sean las mismas.
            </Callout>
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}

/* ═══════════════════════════════════════════════════════════════
   Corte esquemático de la centrífuga
   ═══════════════════════════════════════════════════════════════ */

function CentrifugaCorte() {
  const ICE = '#eaf6ff'
  const FROST = '#8fdcff'
  const RIFT = '#7d63ff'

  /** Marcador numerado con guía hasta la pieza. */
  const Pin = ({ n, x, y, lx, ly }: { n: number; x: number; y: number; lx: number; ly: number }) => (
    <g>
      <line x1={x} y1={y} x2={lx} y2={ly} stroke={FROST} strokeWidth="0.8" strokeOpacity="0.5" />
      <circle cx={lx} cy={ly} r="1.8" fill={FROST} />
      <g transform={`translate(${x} ${y})`}>
        <path d="M0,-9 L9,0 L0,9 L-9,0 Z" fill="#04050e" stroke={FROST} strokeWidth="1" />
        <text
          x="0"
          y="3.4"
          textAnchor="middle"
          fill={FROST}
          fontSize="9.5"
          fontFamily="JetBrains Mono, monospace"
        >
          {n}
        </text>
      </g>
    </g>
  )

  return (
    <svg viewBox="0 0 500 350" style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id="cfBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#131a40" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#070a1a" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="cfRotor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8fdcff" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#7d63ff" stopOpacity="0.3" />
        </linearGradient>
        <radialGradient id="cfSpin" cx="50%" cy="50%">
          <stop offset="40%" stopColor="#8fdcff" stopOpacity="0" />
          <stop offset="100%" stopColor="#8fdcff" stopOpacity="0.12" />
        </radialGradient>
      </defs>

      {/* ── Cuerpo ── */}
      <polygon
        points="92,318 92,152 112,132 388,132 408,152 408,318"
        fill="url(#cfBody)"
        stroke={ICE}
        strokeOpacity="0.32"
        strokeWidth="1.4"
      />

      {/* ── Tapa cerrada, con bisagra y pestillo ── */}
      <path
        d="M 112,132 Q 250,58 388,132"
        fill="none"
        stroke={ICE}
        strokeOpacity="0.5"
        strokeWidth="1.6"
      />
      <path
        d="M 112,132 Q 250,58 388,132 L 388,140 Q 250,68 112,140 Z"
        fill="#0b1030"
        fillOpacity="0.75"
        stroke="none"
      />
      {/* bisagra */}
      <circle cx="388" cy="134" r="4.5" fill="none" stroke={FROST} strokeWidth="1.2" />
      {/* pestillo / enclavamiento */}
      <rect x="103" y="126" width="15" height="9" fill="#04050e" stroke="#ff4d6a" strokeWidth="1.2" />
      <path d="M 106,135 L 106,144 L 115,144" fill="none" stroke="#ff4d6a" strokeWidth="1.2" />

      {/* ── Cámara ── */}
      <path
        d="M 128,158 L 372,158 L 350,286 Q 250,306 150,286 Z"
        fill="#04050e"
        fillOpacity="0.75"
        stroke={ICE}
        strokeOpacity="0.28"
        strokeWidth="1.2"
      />
      <ellipse cx="250" cy="205" rx="118" ry="52" fill="url(#cfSpin)" />

      {/* ── Rotor de ángulo fijo ── */}
      <g>
        <polygon
          points="186,176 314,176 292,236 208,236"
          fill="url(#cfRotor)"
          stroke={FROST}
          strokeWidth="1.4"
        />
        {/* pozos de tubo, inclinados */}
        <g stroke={ICE} strokeOpacity="0.62" strokeWidth="1.1" fill="#04050e" fillOpacity="0.8">
          <polygon points="196,182 214,178 230,222 213,227" />
          <polygon points="304,182 286,178 270,222 287,227" />
        </g>
        {/* sedimento en el fondo del tubo */}
        <polygon points="218,214 230,222 213,227 210,218" fill={RIFT} fillOpacity="0.75" />
        <polygon points="282,214 270,222 287,227 290,218" fill={RIFT} fillOpacity="0.75" />
        {/* tuerca de asiento */}
        <polygon points="242,168 258,168 262,178 238,178" fill="#0b1030" stroke={FROST} strokeWidth="1.1" />
      </g>

      {/* ── Eje ── */}
      <rect x="245" y="236" width="10" height="34" fill="#0b1030" stroke={ICE} strokeOpacity="0.45" strokeWidth="1.1" />
      {/* rodamiento */}
      <circle cx="250" cy="256" r="9" fill="none" stroke={FROST} strokeWidth="1.2" strokeDasharray="3 2.5" />

      {/* ── Motor ── */}
      <rect x="212" y="270" width="76" height="40" rx="3" fill="#0b1030" stroke={ICE} strokeOpacity="0.45" strokeWidth="1.2" />
      <line x1="212" y1="283" x2="288" y2="283" stroke={ICE} strokeOpacity="0.2" strokeWidth="0.8" />
      <line x1="212" y1="297" x2="288" y2="297" stroke={ICE} strokeOpacity="0.2" strokeWidth="0.8" />
      {/* escobillas */}
      <rect x="203" y="282" width="10" height="16" fill="#04050e" stroke="#ffb44d" strokeWidth="1.2" />
      <rect x="287" y="282" width="10" height="16" fill="#04050e" stroke="#ffb44d" strokeWidth="1.2" />

      {/* ── Amortiguadores ── */}
      <path d="M 168,318 q 6,-7 12,0 q 6,-7 12,0" fill="none" stroke={FROST} strokeWidth="1.3" />
      <path d="M 308,318 q 6,-7 12,0 q 6,-7 12,0" fill="none" stroke={FROST} strokeWidth="1.3" />
      <line x1="92" y1="326" x2="408" y2="326" stroke={ICE} strokeOpacity="0.3" strokeWidth="1.6" />

      {/* ── Tarjeta de control ── */}
      <rect x="344" y="212" width="52" height="70" fill="#04050e" stroke={RIFT} strokeOpacity="0.75" strokeWidth="1.2" />
      <g fill={RIFT} fillOpacity="0.85">
        <rect x="351" y="220" width="16" height="7" />
        <rect x="373" y="220" width="16" height="7" />
        <rect x="351" y="234" width="38" height="5" />
        <rect x="351" y="246" width="24" height="5" />
      </g>
      <text x="370" y="270" textAnchor="middle" fill={RIFT} fontSize="8.5" fontFamily="JetBrains Mono, monospace">
        CTRL
      </text>

      {/* ── Marcadores ── */}
      <Pin n={1} x={64} y={112} lx={108} ly={130} />
      <Pin n={2} x={132} y={306} lx={158} ly={290} />
      <Pin n={3} x={250} y={110} lx={250} ly={172} />
      <Pin n={4} x={356} y={98} lx={300} ly={190} />
      <Pin n={5} x={168} y={256} lx={241} ly={256} />
      <Pin n={6} x={172} y={300} lx={205} ly={290} />
      <Pin n={7} x={330} y={332} lx={318} ly={318} />
      <Pin n={8} x={444} y={222} lx={396} ly={230} />
    </svg>
  )
}
