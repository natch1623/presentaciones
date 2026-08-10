import { SlideLayout, SlideTag, SlideTitle, Frost, Figure, Panel, Callout } from './SlideLayout'

/**
 * Trayecto óptico y partes de servicio. Se presenta como recorrido de
 * la luz porque casi todo defecto de imagen se localiza preguntando
 * en qué punto del camino se metió el problema.
 */
export default function S14_MI_Anatomia() {
  const PARTES = [
    { n: 1, k: 'Fuente (halógena o LED)', d: 'Se reemplaza sin tocar el vidrio con los dedos. En LED, revisar disipador y driver.' },
    { n: 2, k: 'Diafragma de campo', d: 'Recorta el haz. Es el que se cierra para centrar en la alineación de Köhler.' },
    { n: 3, k: 'Condensador', d: 'Sube y baja. Su altura define la nitidez del borde del diafragma de campo.' },
    { n: 4, k: 'Diafragma de apertura', d: 'Iris del condensador: regula contraste y resolución. No se usa para bajar brillo.' },
    { n: 5, k: 'Platina mecánica', d: 'Carro X‑Y. Se limpia y engrasa; el juego excesivo hace perder el campo.' },
    { n: 6, k: 'Objetivos y revólver', d: 'Rosca limpia, sin aceite seco. El de inmersión se limpia después de cada jornada.' },
    { n: 7, k: 'Oculares y prisma', d: 'La mancha que gira al rotar el ocular está en el ocular. Ajuste dióptrico y distancia interpupilar.' },
    { n: 8, k: 'Enfoque macro y micro', d: 'Coaxial: tensión regulable y tope de seguridad para no golpear el objetivo contra el porta.' },
  ]

  return (
    <SlideLayout>
      <SlideTag>02 · Microscopio — anatomía</SlideTag>
      <SlideTitle size="md">
        <span>El recorrido de la luz, </span>
        <Frost><span>que es también el mapa de las fallas</span></Frost>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '0.82fr 1.18fr', gap: 30, flex: 1, minHeight: 0 }}>
        <Figure tone="frost" caption="Trayecto óptico de abajo hacia arriba.">
          <TrayectoOptico />
        </Figure>

        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Panel label="Partes de servicio" tone="frost" style={{ flex: 1, minHeight: 0 }}>
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
            <Callout kind="amber" title="El iris no es un regulador de brillo">
              Cerrar el diafragma de apertura para atenuar la luz destruye la resolución del objetivo.
              El brillo se baja con el reóstato o con filtros de densidad neutra; el iris se ajusta al
              70–80 % de la apertura del objetivo en uso.
            </Callout>
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}

/* ── Trayecto óptico ── */
function TrayectoOptico() {
  const ICE = '#eaf6ff'
  const FROST = '#8fdcff'
  const AMBER = '#ffb44d'

  const Pin = ({ n, x, y, lx, ly }: { n: number; x: number; y: number; lx: number; ly: number }) => (
    <g>
      <line x1={x} y1={y} x2={lx} y2={ly} stroke={FROST} strokeWidth="0.8" strokeOpacity="0.5" />
      <circle cx={lx} cy={ly} r="1.7" fill={FROST} />
      <g transform={`translate(${x} ${y})`}>
        <path d="M0,-8.5 L8.5,0 L0,8.5 L-8.5,0 Z" fill="#04050e" stroke={FROST} strokeWidth="1" />
        <text x="0" y="3.2" textAnchor="middle" fill={FROST} fontSize="9" fontFamily="JetBrains Mono, monospace">
          {n}
        </text>
      </g>
    </g>
  )

  return (
    <svg viewBox="0 0 300 420" style={{ width: '100%', height: '100%' }}>
      {/* haz de luz */}
      <path
        d="M 150,392 L 150,340 L 132,300 L 132,268 L 150,240 L 150,214 L 128,196 L 128,150 L 150,120 L 150,52"
        fill="none"
        stroke={AMBER}
        strokeOpacity="0.28"
        strokeWidth="14"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M 150,392 L 150,340 L 132,300 L 132,268 L 150,240 L 150,214 L 128,196 L 128,150 L 150,120 L 150,52"
        fill="none"
        stroke={AMBER}
        strokeOpacity="0.75"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* 1 · fuente */}
      <rect x="126" y="386" width="48" height="16" fill="#0b1030" stroke={AMBER} strokeWidth="1.2" />
      <path d="M 138,386 L 150,372 L 162,386" fill="none" stroke={AMBER} strokeWidth="1" />

      {/* 2 · diafragma de campo */}
      <g stroke={FROST} strokeWidth="1.6">
        <line x1="104" y1="344" x2="140" y2="344" />
        <line x1="160" y1="344" x2="196" y2="344" />
      </g>

      {/* 3 · condensador */}
      <polygon points="112,300 188,300 168,268 132,268" fill="none" stroke={ICE} strokeOpacity="0.6" strokeWidth="1.3" />
      {/* flecha de altura */}
      <path d="M 200,268 L 200,300 M 196,272 L 200,266 L 204,272 M 196,296 L 200,302 L 204,296" stroke={FROST} strokeWidth="0.9" fill="none" />

      {/* 4 · diafragma de apertura */}
      <g stroke={FROST} strokeWidth="1.6">
        <line x1="110" y1="312" x2="138" y2="312" />
        <line x1="162" y1="312" x2="190" y2="312" />
      </g>

      {/* 5 · platina y muestra */}
      <line x1="72" y1="240" x2="228" y2="240" stroke={ICE} strokeOpacity="0.6" strokeWidth="2.4" />
      <rect x="118" y="234" width="64" height="5" fill={FROST} fillOpacity="0.5" />
      {/* carro X-Y */}
      <rect x="74" y="242" width="26" height="12" fill="none" stroke={ICE} strokeOpacity="0.4" strokeWidth="1" />

      {/* 6 · objetivo y revólver */}
      <polygon points="132,214 168,214 160,186 140,186" fill="#0b1030" stroke={ICE} strokeOpacity="0.65" strokeWidth="1.3" />
      <path d="M 96,182 Q 150,158 204,182" fill="none" stroke={ICE} strokeOpacity="0.55" strokeWidth="1.6" />
      <polygon points="104,182 122,182 118,200 108,200" fill="none" stroke={ICE} strokeOpacity="0.35" strokeWidth="1" />
      <polygon points="182,182 200,182 196,200 186,200" fill="none" stroke={ICE} strokeOpacity="0.35" strokeWidth="1" />

      {/* 7 · prisma y oculares */}
      <polygon points="128,150 172,150 150,118" fill="none" stroke={ICE} strokeOpacity="0.6" strokeWidth="1.3" />
      <rect x="120" y="62" width="24" height="46" rx="3" fill="#0b1030" stroke={ICE} strokeOpacity="0.6" strokeWidth="1.2" />
      <rect x="158" y="62" width="24" height="46" rx="3" fill="#0b1030" stroke={ICE} strokeOpacity="0.6" strokeWidth="1.2" />
      <line x1="144" y1="112" x2="158" y2="112" stroke={ICE} strokeOpacity="0.4" strokeWidth="1" />

      {/* 8 · enfoque coaxial */}
      <circle cx="242" cy="222" r="15" fill="none" stroke={ICE} strokeOpacity="0.5" strokeWidth="1.3" />
      <circle cx="242" cy="222" r="7" fill="none" stroke={ICE} strokeOpacity="0.35" strokeWidth="1" />

      {/* marcadores */}
      <Pin n={1} x={54} y={394} lx={124} ly={394} />
      <Pin n={2} x={230} y={344} lx={196} ly={344} />
      <Pin n={3} x={244} y={288} lx={206} ly={284} />
      <Pin n={4} x={60} y={314} lx={108} ly={312} />
      <Pin n={5} x={44} y={248} lx={74} ly={246} />
      <Pin n={6} x={238} y={172} lx={204} ly={182} />
      <Pin n={7} x={64} y={78} lx={118} ly={84} />
      <Pin n={8} x={272} y={222} lx={258} ly={222} />
    </svg>
  )
}
