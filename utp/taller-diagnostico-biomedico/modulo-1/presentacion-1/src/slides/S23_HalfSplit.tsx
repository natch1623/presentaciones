import { SlideLayout, SlideTag, SlideTitle, Glass, SpecTable, Hydro, Lunar, Bullet } from './SlideLayout'
import { Spark } from '../components/Celestial'

/**
 * División a la mitad. La técnica más eficiente cuando la falla está
 * en una cadena de bloques en serie.
 *
 * El gráfico contrapone las dos curvas —n frente a log₂ n— porque el
 * argumento no es «es más rápido», es «crece muchísimo más despacio».
 */
export default function S23_HalfSplit() {
  const AHORRO: string[][] = [
    ['4', '4 mediciones', '2 mediciones'],
    ['8', '8 mediciones', '3 mediciones'],
    ['16', '16 mediciones', '4 mediciones'],
    ['32', '32 mediciones', '5 mediciones'],
  ]

  return (
    <SlideLayout>
      <SlideTag>
        <span>Bloque 4 · 4.1</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>División a la mitad:</span> <Hydro><span>cada medición descarta la mitad</span></Hydro>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26, flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <p style={{ fontSize: 13.5, color: 'var(--moon-dim)', lineHeight: 1.75, margin: 0 }}>
            <span>
              En lugar de comprobar bloque por bloque desde el inicio, se mide en el punto medio de la cadena y se
              decide con una sola lectura.
            </span>
          </p>

          <Glass tone="cyan" ornament style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                <Spark size={12} tone="cyan" style={{ marginTop: 3 }} />
                <p style={{ fontSize: 13, color: 'var(--moon-dim)', margin: 0, lineHeight: 1.6 }}>
                  <span>Si la señal en el punto medio es correcta → la falla está aguas abajo, hacia la salida.</span>
                </p>
              </div>
              <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
                <Spark size={12} tone="rose" style={{ marginTop: 3 }} />
                <p style={{ fontSize: 13, color: 'var(--moon-dim)', margin: 0, lineHeight: 1.6 }}>
                  <span>Si es incorrecta → la falla está aguas arriba, hacia la entrada.</span>
                </p>
              </div>
            </div>
          </Glass>

          <Bullet tone="violet">
            Es una <Lunar>búsqueda binaria</Lunar>: para una cadena de n bloques, el número de mediciones crece como
            log₂(n) en vez de n.
          </Bullet>

          <div style={{ flex: 1, minHeight: 0 }}>
            <SpecTable
              head={['Bloques (n)', 'Búsqueda secuencial', 'División a la mitad']}
              cols="0.7fr 1.2fr 1.2fr"
              fontSize={12}
              rows={AHORRO}
              toneOf={(_r, c) => (c === 2 ? 'cyan' : c === 1 ? 'ember' : undefined)}
            />
          </div>
        </div>

        {/* El ahorro, dibujado: dos curvas que se separan */}
        <div style={{ display: 'flex', alignItems: 'center', minWidth: 0 }}>
          <svg viewBox="0 0 480 400" style={{ width: '100%', height: '100%' }}>
            <defs>
              <filter id="hsGlow" x="-40%" y="-60%" width="180%" height="260%">
                <feGaussianBlur stdDeviation="3.5" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {[60, 128, 196, 264, 332].map(y => (
              <line key={y} x1="56" y1={y} x2="452" y2={y} stroke="rgba(184,231,255,0.05)" strokeWidth="0.6" />
            ))}
            <line x1="56" y1="332" x2="452" y2="332" stroke="rgba(184,231,255,0.26)" strokeWidth="1" />
            <line x1="56" y1="44" x2="56" y2="332" stroke="rgba(184,231,255,0.26)" strokeWidth="1" />

            {/* Secuencial: recta que se dispara */}
            <path
              d="M 56 332 L 188 264 L 320 128 L 452 50"
              fill="none"
              stroke="#f3c98b"
              strokeWidth="1.8"
              strokeOpacity="0.85"
              filter="url(#hsGlow)"
              style={{ strokeDasharray: 800, animation: 'constellationDraw 1.3s cubic-bezier(0.22,1,0.36,1) 0.35s both' }}
            />
            {/* Half-split: casi plana */}
            <path
              d="M 56 332 L 188 314 L 320 296 L 452 278"
              fill="none"
              stroke="#bdf8ff"
              strokeWidth="1.8"
              filter="url(#hsGlow)"
              style={{ strokeDasharray: 800, animation: 'constellationDraw 1.3s cubic-bezier(0.22,1,0.36,1) 0.55s both' }}
            />

            {[
              [56, 332],
              [188, 314],
              [320, 296],
              [452, 278],
            ].map(([x, y]) => (
              <circle key={`b${x}`} cx={x} cy={y} r="3.5" fill="#bdf8ff" />
            ))}

            <text x="446" y="38" textAnchor="end" fill="#f3c98b" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
              secuencial · n
            </text>
            <text x="446" y="268" textAnchor="end" fill="#bdf8ff" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}>
              half‑split · log₂ n
            </text>

            <text x="62" y="34" fill="#aab8d6" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10.5 }}>
              mediciones necesarias
            </text>
            {['4', '8', '16', '32'].map((n, i) => (
              <text
                key={n}
                x={56 + i * 132}
                y="354"
                textAnchor="middle"
                fill="#aab8d6"
                style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}
              >
                {n}
              </text>
            ))}
            <text x="254" y="378" textAnchor="middle" fill="rgba(170,184,214,0.7)" style={{ fontFamily: 'Inter, sans-serif', fontSize: 11 }}>
              bloques en la cadena
            </text>
          </svg>
        </div>
      </div>
    </SlideLayout>
  )
}
