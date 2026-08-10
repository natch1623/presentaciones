import { SlideLayout, SlideTag, SlideTitle, Frost, SpecTable, Figure, Callout, Panel } from './SlideLayout'

/**
 * Verificación de desempeño: el paso que convierte «le hice
 * mantenimiento» en «el equipo cumple». Se separa de la rutina porque
 * aquí no se ajusta nada, sólo se mide y se decide.
 */
export default function S10_CF_Verificacion() {
  const ENSAYOS: [string, string, string, string][] = [
    [
      'Velocidad',
      'Tacómetro óptico',
      'Marca reflectiva en el rotor. Esperar 60 s a régimen y tomar tres lecturas.',
      'Media dentro de ±5 % del nominal',
    ],
    [
      'Tiempo de ciclo',
      'Cronómetro patrón',
      'Programar 10 min y cronometrar de arranque a detención completa.',
      'Desviación ≤ ±10 %',
    ],
    [
      'Temperatura (refrigerada)',
      'Sonda + termómetro patrón',
      'Tubo testigo con glicerina en el rotor, ciclo de 30 min a 4 °C.',
      'Desviación ≤ ±2 °C del ajustado',
    ],
    [
      'Detección de desbalance',
      'Juego de tubos',
      'Cargar el desbalance máximo que admita el manual y arrancar.',
      'El equipo aborta y avisa',
    ],
    [
      'Enclavamiento',
      'Inspección funcional',
      'Arrancar con la tapa abierta y forzar la apertura en marcha.',
      'Ambas acciones deben ser imposibles',
    ],
    [
      'Frenado',
      'Cronómetro',
      'Medir el tiempo de detención desde la velocidad máxima.',
      'Dentro de lo declarado, sin ruido',
    ],
    [
      'Seguridad eléctrica',
      'Analizador',
      'Continuidad de tierra de protección y corriente de fuga.',
      'Tierra ≤ 0,2 Ω · fuga en norma',
    ],
  ]

  return (
    <SlideLayout>
      <SlideTag tone="mint">01 · Centrífuga — verificación</SlideTag>
      <SlideTitle size="md">
        <span>Siete ensayos y </span>
        <Frost><span>una decisión: apto, en observación o fuera de servicio</span></Frost>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1.32fr 1fr', gap: 26, flex: 1, minHeight: 0 }}>
        <div style={{ minWidth: 0 }}>
          <SpecTable
            head={['Ensayo', 'Instrumento', 'Método', 'Criterio']}
            cols="1fr 0.86fr 1.5fr 1fr"
            rows={ENSAYOS}
            fontSize={10.6}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <Figure tone="mint" caption="Montaje de la medición de velocidad." style={{ flex: 1 }}>
            <MontajeTacometro />
          </Figure>

          <Panel label="Lo que en realidad importa" tone="rift">
            <div
              style={{
                padding: '11px 14px',
                background: 'linear-gradient(100deg, rgba(125,99,255,0.10), rgba(4,5,14,0))',
                borderLeft: '2px solid var(--rift)',
              }}
            >
              <div
                className="font-mono"
                style={{ fontSize: 13, color: 'var(--ice)', letterSpacing: '0.02em', marginBottom: 6 }}
              >
                <span>RCF = 1,118 × 10⁻⁵ × r × rpm²</span>
              </div>
              <p style={{ fontSize: 10.8, color: 'var(--ice-dim)', lineHeight: 1.5, margin: 0 }}>
                <span>
                  El protocolo del laboratorio pide fuerza relativa (× g), no rpm. Con r en
                  centímetros: cambiar el rotor cambia el radio y, con las mismas rpm, el resultado
                  de la separación. Verificar siempre qué rotor está montado.
                </span>
              </p>
            </div>
          </Panel>
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <Callout kind="crimson" title="Fuera de servicio no es opcional">
          Si falla el enclavamiento, la detección de desbalance o la continuidad de tierra, el equipo
          se etiqueta y se retira del uso el mismo día. Esas tres protegen a la persona, no al resultado.
        </Callout>
      </div>
    </SlideLayout>
  )
}

/* ── Montaje del tacómetro óptico sobre el rotor ── */
function MontajeTacometro() {
  const ICE = '#eaf6ff'
  const MINT = '#4fe3c1'
  const FROST = '#8fdcff'

  return (
    <svg viewBox="0 0 420 250" style={{ width: '100%', height: '100%' }}>
      {/* cuba y rotor vistos desde arriba */}
      <ellipse cx="180" cy="140" rx="112" ry="78" fill="#04050e" stroke={ICE} strokeOpacity="0.3" strokeWidth="1.3" />
      <ellipse cx="180" cy="140" rx="72" ry="50" fill="none" stroke={FROST} strokeOpacity="0.55" strokeWidth="1.4" />
      <circle cx="180" cy="140" r="9" fill="#0b1030" stroke={FROST} strokeWidth="1.2" />

      {/* pozos de tubo */}
      {[0, 60, 120, 180, 240, 300].map(a => {
        const rad = (a * Math.PI) / 180
        return (
          <ellipse
            key={a}
            cx={180 + Math.cos(rad) * 48}
            cy={140 + Math.sin(rad) * 33}
            rx="11"
            ry="8"
            fill="#0b1030"
            stroke={ICE}
            strokeOpacity="0.35"
            strokeWidth="1"
          />
        )
      })}

      {/* marca reflectiva */}
      <rect x="240" y="132" width="16" height="9" fill={MINT} />
      <text x="248" y="122" textAnchor="middle" fill={MINT} fontSize="8.5" fontFamily="JetBrains Mono, monospace">
        marca
      </text>

      {/* haz del tacómetro */}
      <line x1="352" y1="72" x2="252" y2="132" stroke={MINT} strokeWidth="1.2" strokeDasharray="5 3" />
      <line x1="252" y1="139" x2="352" y2="86" stroke={MINT} strokeWidth="1.2" strokeDasharray="5 3" strokeOpacity="0.55" />

      {/* tacómetro */}
      <g>
        <polygon points="348,52 408,52 408,102 348,102 340,77" fill="#0b1030" stroke={MINT} strokeWidth="1.3" />
        <rect x="354" y="60" width="46" height="18" fill="#04050e" stroke={MINT} strokeOpacity="0.5" strokeWidth="0.9" />
        <text x="377" y="73" textAnchor="middle" fill={MINT} fontSize="10" fontFamily="JetBrains Mono, monospace">
          3480
        </text>
        <text x="377" y="93" textAnchor="middle" fill={ICE} fillOpacity="0.6" fontSize="8" fontFamily="JetBrains Mono, monospace">
          rpm
        </text>
      </g>

      {/* radio */}
      <line x1="180" y1="140" x2="252" y2="140" stroke={FROST} strokeWidth="1" strokeDasharray="3 3" />
      <text x="214" y="155" textAnchor="middle" fill={FROST} fontSize="9" fontFamily="JetBrains Mono, monospace">
        r
      </text>

      {/* nota */}
      <text x="26" y="232" fill={ICE} fillOpacity="0.45" fontSize="9" fontFamily="JetBrains Mono, monospace">
        Tapa cerrada · 60 s a régimen · 3 lecturas
      </text>
    </svg>
  )
}
