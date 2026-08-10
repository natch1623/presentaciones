import { SlideLayout, SlideTag, SlideTitle, Rift, Figure, Panel, Callout } from './SlideLayout'

/**
 * Anatomía y, sobre todo, la distinción que decide el protocolo: una
 * cabina de flujo laminar protege el producto; una de bioseguridad
 * protege además al operador. Confundirlas es el error más caro del
 * bloque, así que va en la misma diapositiva que el recorrido del aire.
 */
export default function S20_FL_Anatomia() {
  const PARTES = [
    { n: 1, k: 'Prefiltro', d: 'Retiene polvo grueso y alarga la vida del HEPA. Se lava o se cambia: es lo primero a revisar ante flujo bajo.' },
    { n: 2, k: 'Ventilador y plenum', d: 'Genera la presión. Rodamientos, balanceo y ajuste de velocidad para compensar la carga del filtro.' },
    { n: 3, k: 'Filtro HEPA', d: 'Retiene ≥ 99,97 % de partículas de 0,3 µm. No se limpia ni se sopla: se prueba y se reemplaza.' },
    { n: 4, k: 'Sello del filtro', d: 'Marco de gel o empaque. Una fuga aquí anula el filtro entero aunque el medio esté sano.' },
    { n: 5, k: 'Plano de trabajo', d: 'Rejillas de entrada libres. Todo lo que se apoye encima altera el patrón de flujo.' },
    { n: 6, k: 'Ventana y enclavamiento', d: 'Altura de trabajo, contrapesos y el interruptor que apaga el UV al abrirla.' },
    { n: 7, k: 'Lámpara UV', d: 'Pierde intensidad con las horas aunque siga encendiendo. Se limpia y se mide.' },
    { n: 8, k: 'Manómetro diferencial', d: 'La presión que sube con el tiempo es la señal de que el HEPA se está colmatando.' },
  ]

  return (
    <SlideLayout>
      <SlideTag tone="rift">03 · Flujo laminar — anatomía</SlideTag>
      <SlideTitle size="md">
        <span>El recorrido del aire y </span>
        <Rift><span>a quién protege realmente la cabina</span></Rift>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 28, flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
          <Figure tone="rift" caption="Cabina de flujo vertical: el aire baja filtrado sobre la zona de trabajo.">
            <CabinaCorte />
          </Figure>

          <Callout kind="crimson" title="No son lo mismo">
            La cabina de flujo laminar protege sólo el producto: el aire sale hacia el operador. Con
            material biológico se necesita cabina de bioseguridad Clase II, que además extrae y
            filtra. Verificar la placa antes de asignarle un uso.
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

/* ── Corte de la cabina, flujo vertical ── */
function CabinaCorte() {
  const ICE = '#eaf6ff'
  const RIFT = '#7d63ff'
  const FROST = '#8fdcff'

  const Pin = ({ n, x, y, lx, ly }: { n: number; x: number; y: number; lx: number; ly: number }) => (
    <g>
      <line x1={x} y1={y} x2={lx} y2={ly} stroke={RIFT} strokeWidth="0.8" strokeOpacity="0.55" />
      <circle cx={lx} cy={ly} r="1.7" fill={RIFT} />
      <g transform={`translate(${x} ${y})`}>
        <path d="M0,-8.5 L8.5,0 L0,8.5 L-8.5,0 Z" fill="#04050e" stroke={RIFT} strokeWidth="1" />
        <text x="0" y="3.2" textAnchor="middle" fill={RIFT} fontSize="9" fontFamily="JetBrains Mono, monospace">
          {n}
        </text>
      </g>
    </g>
  )

  return (
    <svg viewBox="0 0 480 300" style={{ width: '100%', height: '100%' }}>
      {/* carcasa */}
      <polygon
        points="96,282 96,44 108,32 372,32 384,44 384,282"
        fill="#070a1a"
        fillOpacity="0.85"
        stroke={ICE}
        strokeOpacity="0.32"
        strokeWidth="1.4"
      />

      {/* plenum superior */}
      <rect x="108" y="44" width="264" height="34" fill="#0b1030" stroke={ICE} strokeOpacity="0.28" strokeWidth="1" />
      {/* ventilador */}
      <circle cx="150" cy="61" r="13" fill="none" stroke={FROST} strokeWidth="1.2" />
      <path d="M150,48 A13,13 0 0 1 163,61 M150,74 A13,13 0 0 1 137,61" stroke={FROST} strokeWidth="1.2" fill="none" />
      {/* prefiltro */}
      <rect x="300" y="46" width="62" height="10" fill="none" stroke={FROST} strokeWidth="1.1" strokeDasharray="3 2" />

      {/* HEPA */}
      <g>
        <rect x="118" y="84" width="244" height="18" fill="#04050e" stroke={RIFT} strokeWidth="1.4" />
        {Array.from({ length: 22 }, (_, i) => (
          <path
            key={i}
            d={`M ${122 + i * 11},84 L ${127 + i * 11},102 L ${132 + i * 11},84`}
            fill="none"
            stroke={RIFT}
            strokeOpacity="0.55"
            strokeWidth="0.8"
          />
        ))}
      </g>
      {/* sello */}
      <line x1="118" y1="103.5" x2="362" y2="103.5" stroke="#4fe3c1" strokeWidth="2.2" />

      {/* flujo descendente */}
      {Array.from({ length: 9 }, (_, i) => {
        const x = 136 + i * 26
        return (
          <g key={i}>
            <line x1={x} y1="112" x2={x} y2="196" stroke={FROST} strokeOpacity="0.45" strokeWidth="1.1" />
            <path d={`M ${x - 3},190 L ${x},197 L ${x + 3},190`} fill="none" stroke={FROST} strokeOpacity="0.7" strokeWidth="1.1" />
          </g>
        )
      })}

      {/* ventana */}
      <line x1="108" y1="112" x2="108" y2="176" stroke={ICE} strokeOpacity="0.55" strokeWidth="2.4" />
      <rect x="98" y="110" width="14" height="70" fill={FROST} fillOpacity="0.10" stroke={FROST} strokeOpacity="0.4" strokeWidth="1" />

      {/* lámpara UV */}
      <rect x="316" y="112" width="46" height="8" rx="4" fill="none" stroke="#a08cff" strokeWidth="1.3" />

      {/* plano de trabajo y rejillas */}
      <rect x="112" y="202" width="256" height="9" fill="#0b1030" stroke={ICE} strokeOpacity="0.5" strokeWidth="1.2" />
      <g stroke={ICE} strokeOpacity="0.4" strokeWidth="1">
        {Array.from({ length: 7 }, (_, i) => (
          <line key={i} x1={120 + i * 5} y1="204" x2={120 + i * 5} y2="209" />
        ))}
        {Array.from({ length: 7 }, (_, i) => (
          <line key={`r${i}`} x1={330 + i * 5} y1="204" x2={330 + i * 5} y2="209" />
        ))}
      </g>

      {/* retorno lateral */}
      <path d="M 120,211 L 120,262 L 360,262 L 360,211" fill="none" stroke={FROST} strokeOpacity="0.35" strokeWidth="1.1" strokeDasharray="4 3" />

      {/* manómetro */}
      <circle cx="410" cy="70" r="15" fill="#04050e" stroke={FROST} strokeWidth="1.2" />
      <line x1="410" y1="70" x2="418" y2="61" stroke={FROST} strokeWidth="1.2" />
      <line x1="396" y1="76" x2="384" y2="90" stroke={FROST} strokeOpacity="0.5" strokeWidth="0.9" strokeDasharray="3 2" />

      {/* marcadores */}
      <Pin n={1} x={444} y={44} lx={362} ly={50} />
      <Pin n={2} x={62} y={54} lx={137} ly={61} />
      <Pin n={3} x={40} y={92} lx={118} ly={92} />
      <Pin n={4} x={40} y={120} lx={120} ly={104} />
      <Pin n={5} x={240} y={244} lx={240} ly={210} />
      <Pin n={6} x={68} y={176} lx={100} ly={166} />
      <Pin n={7} x={444} y={122} lx={364} ly={116} />
      <Pin n={8} x={444} y={186} lx={416} ly={86} />
    </svg>
  )
}
