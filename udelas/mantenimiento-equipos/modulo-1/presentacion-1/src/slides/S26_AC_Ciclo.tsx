import { SlideLayout, SlideTag, SlideTitle, Crimson, Figure, Panel, Callout, SpecTable } from './SlideLayout'

/**
 * El ciclo y la relación presión‑temperatura del vapor saturado.
 *
 * Esta pareja de datos es la herramienta de diagnóstico más potente del
 * equipo: si la presión corresponde y la temperatura no, hay aire en la
 * cámara, y eso se resuelve en la purga, no en el control.
 */
export default function S26_AC_Ciclo() {
  const PT: [string, string, string][] = [
    ['121 °C', '≈ 1,05 bar man · 15 psi', '15–20 min de exposición'],
    ['126 °C', '≈ 1,40 bar man · 20 psi', '10 min de exposición'],
    ['134 °C', '≈ 2,10 bar man · 30 psi', '3–4 min de exposición'],
  ]

  return (
    <SlideLayout>
      <SlideTag tone="crimson">04 · Esterilizador — cómo leer el ciclo</SlideTag>
      <SlideTitle size="md">
        <span>Presión y temperatura van juntas: </span>
        <Crimson><span>si se separan, hay aire adentro</span></Crimson>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 28, flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <Figure tone="crimson" caption="Fases del ciclo. La meseta es la única que esteriliza.">
            <CurvaCiclo />
          </Figure>

          <Callout kind="crimson" title="El enemigo es el aire, no la falta de calor">
            El aire no se mezcla con el vapor: forma bolsas frías dentro del paquete. Ahí el material
            alcanza la presión del ciclo pero nunca la temperatura, y el indicador externo vira
            igual. Por eso existen la purga, el prevacío y la prueba de Bowie‑Dick.
          </Callout>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>
          <Panel label="Vapor saturado · a cada presión le corresponde una temperatura" tone="frost">
            <SpecTable
              head={['Temperatura', 'Presión manométrica', 'Tiempo típico']}
              cols="0.7fr 1.2fr 1fr"
              rows={PT}
              fontSize={11}
            />
          </Panel>

          <Panel label="Las cinco fases" tone="rift">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {[
                ['Purga', 'Se expulsa el aire por gravedad o con bomba de vacío. Si falla, todo lo demás es inútil.'],
                ['Calentamiento', 'Sube presión y temperatura juntas. Si se separan, hay aire o el sensor miente.'],
                ['Exposición', 'La meseta. Se cuenta desde que el punto más frío de la carga alcanza la temperatura.'],
                ['Descarga', 'Escape de vapor. Rápido para material sólido, lento para líquidos.'],
                ['Secado', 'Vacío o calor residual. Un paquete húmedo se considera no estéril.'],
              ].map(([k, v], i) => (
                <div key={k} style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
                  <span
                    className="font-mono"
                    style={{ fontSize: 9.5, color: 'var(--rift-soft)', minWidth: 16 }}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--ice)', fontWeight: 500, minWidth: 96 }}>
                    <span>{k}</span>
                  </span>
                  <span style={{ fontSize: 10.8, color: 'var(--ice-faint)', lineHeight: 1.45, flex: 1 }}>
                    <span>{v}</span>
                  </span>
                </div>
              ))}
            </div>
          </Panel>

          <Callout kind="amber" title="Paquete mojado, paquete no estéril">
            La humedad al final del ciclo abre un camino para la recontaminación. Casi siempre es
            sobrecarga, envoltura equivocada o secado recortado, no una falla del equipo.
          </Callout>
        </div>
      </div>
    </SlideLayout>
  )
}

/* ── Curva de presión y temperatura del ciclo ── */
function CurvaCiclo() {
  const ICE = '#eaf6ff'
  const CRIMSON = '#ff4d6a'
  const FROST = '#8fdcff'

  // Fases en el eje X del gráfico (viewBox 460 × 250)
  const fases = [
    { x0: 52, x1: 118, k: 'purga' },
    { x0: 118, x1: 186, k: 'calentamiento' },
    { x0: 186, x1: 300, k: 'exposición' },
    { x0: 300, x1: 360, k: 'descarga' },
    { x0: 360, x1: 428, k: 'secado' },
  ]

  return (
    <svg viewBox="0 0 460 250" style={{ width: '100%', height: '100%' }}>
      {/* bandas de fase */}
      {fases.map((f, i) => (
        <g key={f.k}>
          <rect
            x={f.x0}
            y="26"
            width={f.x1 - f.x0}
            height="158"
            fill={i === 2 ? 'rgba(255,77,106,0.09)' : 'rgba(234,246,255,0.018)'}
          />
          <line x1={f.x1} y1="26" x2={f.x1} y2="184" stroke={ICE} strokeOpacity="0.12" strokeWidth="1" />
          <text
            x={(f.x0 + f.x1) / 2}
            y="200"
            textAnchor="middle"
            fill={i === 2 ? CRIMSON : ICE}
            fillOpacity={i === 2 ? 1 : 0.45}
            fontSize="8.5"
            fontFamily="JetBrains Mono, monospace"
          >
            {f.k}
          </text>
        </g>
      ))}

      {/* ejes */}
      <line x1="52" y1="184" x2="428" y2="184" stroke={ICE} strokeOpacity="0.4" strokeWidth="1.2" />
      <line x1="52" y1="26" x2="52" y2="184" stroke={ICE} strokeOpacity="0.4" strokeWidth="1.2" />
      <text x="46" y="34" textAnchor="end" fill={ICE} fillOpacity="0.5" fontSize="8.5" fontFamily="JetBrains Mono, monospace">
        134
      </text>
      <text x="46" y="70" textAnchor="end" fill={ICE} fillOpacity="0.5" fontSize="8.5" fontFamily="JetBrains Mono, monospace">
        121
      </text>
      <text x="46" y="180" textAnchor="end" fill={ICE} fillOpacity="0.5" fontSize="8.5" fontFamily="JetBrains Mono, monospace">
        20
      </text>

      {/* línea objetivo 121 °C */}
      <line x1="52" y1="66" x2="428" y2="66" stroke={CRIMSON} strokeOpacity="0.4" strokeWidth="1" strokeDasharray="5 4" />

      {/* temperatura */}
      <path
        d="M 52,178 L 80,168 L 100,176 L 118,166 L 186,66 L 300,64 L 330,110 L 360,150 L 428,166"
        fill="none"
        stroke={CRIMSON}
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* presión */}
      <path
        d="M 52,180 L 80,150 L 100,172 L 118,168 L 186,74 L 300,72 L 330,140 L 360,178 L 428,180"
        fill="none"
        stroke={FROST}
        strokeWidth="1.6"
        strokeDasharray="6 3"
        strokeLinejoin="round"
      />

      {/* marca de la meseta */}
      <path d="M 186,52 L 300,52 M 190,48 L 184,52 L 190,56 M 296,48 L 302,52 L 296,56" stroke={CRIMSON} strokeWidth="1" fill="none" />
      <text x="243" y="45" textAnchor="middle" fill={CRIMSON} fontSize="9" fontFamily="JetBrains Mono, monospace">
        exposición efectiva
      </text>

      {/* dientes de la purga por gravedad */}
      <text x="85" y="146" textAnchor="middle" fill={ICE} fillOpacity="0.42" fontSize="8" fontFamily="JetBrains Mono, monospace">
        pulsos
      </text>

      {/* leyenda */}
      <g fontFamily="JetBrains Mono, monospace" fontSize="9">
        <line x1="52" y1="232" x2="74" y2="232" stroke={CRIMSON} strokeWidth="2" />
        <text x="80" y="235" fill={ICE} fillOpacity="0.65">
          temperatura °C
        </text>
        <line x1="204" y1="232" x2="226" y2="232" stroke={FROST} strokeWidth="1.6" strokeDasharray="6 3" />
        <text x="232" y="235" fill={ICE} fillOpacity="0.65">
          presión bar
        </text>
      </g>
    </svg>
  )
}
