import { SlideLayout, SlideTag, SlideTitle, Hydro, Badge } from './SlideLayout'

/**
 * Los ocho bloques del material, dispuestos como una constelación
 * (§24). Las líneas finas marcan el orden en que se recorren; el color
 * separa las dos clases teóricas. Sirve de mapa: se vuelve a ella
 * mentalmente cada vez que se abre un bloque nuevo.
 */

type Nodo = { n: string; x: number; y: number; t: string; sub: string; clase: 1 | 2; anchor?: 'start' | 'middle' | 'end' }

const NODOS: Nodo[] = [
  { n: '1', x: 86,   y: 268, t: 'Fundamentos',   sub: 'falla · confiabilidad · modos', clase: 1, anchor: 'start' },
  { n: '2', x: 244,  y: 132, t: 'Bloques',       sub: 'la cadena funcional',           clase: 1, anchor: 'middle' },
  { n: '3', x: 408,  y: 292, t: 'Metodología',   sub: 'los siete pasos',               clase: 1, anchor: 'middle' },
  { n: '4', x: 572,  y: 118, t: 'Técnicas',      sub: 'half-split · rastreo · árboles', clase: 1, anchor: 'middle' },
  { n: '5', x: 726,  y: 286, t: 'Instrumentos',  sub: 'qué mide cada uno',             clase: 1, anchor: 'middle' },
  { n: '6', x: 880,  y: 126, t: 'Seguridad',     sub: 'IEC 60601‑1',                   clase: 2, anchor: 'middle' },
  { n: '7', x: 1010, y: 282, t: 'Familias',      sub: 'fallas típicas por equipo',      clase: 2, anchor: 'middle' },
  { n: '8', x: 1128, y: 146, t: 'Documentación', sub: 'verificación y cierre',         clase: 2, anchor: 'end' },
]

/** Enlaces secundarios: los bloques que se sostienen entre sí. */
const ATAJOS: [number, number][] = [
  [0, 2], // fundamentos ↔ metodología
  [1, 3], // bloques ↔ técnicas
  [1, 6], // bloques ↔ familias
  [4, 7], // instrumentos ↔ documentación
]

const INK = { 1: { c: '#c7b5ff', rgb: '199,181,255' }, 2: { c: '#72c7ff', rgb: '114,199,255' } }

export default function S04_Constelacion() {
  return (
    <SlideLayout>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <SlideTag tone="violet">
            <span>Mapa del taller</span>
          </SlideTag>
          <SlideTitle size="md" style={{ marginBottom: 8 }}>
            <span>Ocho bloques,</span> <Hydro><span>un solo recorrido</span></Hydro>
          </SlideTitle>
        </div>
        <div style={{ display: 'flex', gap: 10, paddingBottom: 14 }}>
          <Badge tone="violet">Clase 1 · bloques 1–5</Badge>
          <Badge tone="hydro">Clase 2 · bloques 6–8</Badge>
        </div>
      </div>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center' }}>
        <svg viewBox="0 0 1180 400" style={{ width: '100%', height: '100%' }}>
          <defs>
            <filter id="cnGlow" x="-120%" y="-120%" width="340%" height="340%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Enlaces secundarios: casi invisibles, dan textura de cielo */}
          {ATAJOS.map(([a, b], i) => (
            <line
              key={`s${i}`}
              x1={NODOS[a].x}
              y1={NODOS[a].y}
              x2={NODOS[b].x}
              y2={NODOS[b].y}
              stroke="rgba(245,247,255,0.10)"
              strokeWidth="0.7"
              strokeDasharray="2 7"
            />
          ))}

          {/* El recorrido principal */}
          {NODOS.slice(0, -1).map((nodo, i) => {
            const sig = NODOS[i + 1]
            const ink = INK[sig.clase]
            return (
              <line
                key={`l${i}`}
                x1={nodo.x}
                y1={nodo.y}
                x2={sig.x}
                y2={sig.y}
                stroke={`rgba(${ink.rgb},0.32)`}
                strokeWidth="1"
                style={{
                  strokeDasharray: 400,
                  animation: `constellationDraw 0.9s cubic-bezier(0.22,1,0.36,1) ${0.35 + i * 0.13}s both`,
                }}
              />
            )
          })}

          {NODOS.map((nodo, i) => {
            const ink = INK[nodo.clase]
            const arriba = nodo.y < 200
            const ty = arriba ? nodo.y - 42 : nodo.y + 50
            return (
              <g
                key={nodo.n}
                style={{ animation: `constellationPop 0.7s cubic-bezier(0.22,1,0.36,1) ${0.28 + i * 0.13}s both`, transformOrigin: `${nodo.x}px ${nodo.y}px` }}
              >
                <circle cx={nodo.x} cy={nodo.y} r="21" fill={`rgba(${ink.rgb},0.06)`} stroke={`rgba(${ink.rgb},0.28)`} strokeWidth="0.8" />
                <circle cx={nodo.x} cy={nodo.y} r="13" fill="rgba(8,13,36,0.9)" stroke={ink.c} strokeOpacity="0.75" strokeWidth="1" filter="url(#cnGlow)" />
                <text
                  x={nodo.x}
                  y={nodo.y + 4.5}
                  textAnchor="middle"
                  fill={ink.c}
                  style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}
                >
                  {nodo.n}
                </text>

                <text
                  x={nodo.x}
                  y={ty}
                  textAnchor={nodo.anchor ?? 'middle'}
                  fill="#f5f7ff"
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 21 }}
                >
                  {nodo.t}
                </text>
                <text
                  x={nodo.x}
                  y={ty + 16}
                  textAnchor={nodo.anchor ?? 'middle'}
                  fill="#aab8d6"
                  style={{ fontFamily: 'Inter, sans-serif', fontSize: 11 }}
                >
                  {nodo.sub}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <p style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.6, margin: 0, maxWidth: 940 }}>
        <span>
          El recorrido no es arbitrario: primero se fija el vocabulario de la falla, luego el modelo que la
          localiza, después el método que la persigue y las técnicas que lo hacen eficiente. La Clase 2 añade la
          condición que ningún hallazgo puede saltarse —la seguridad— y el registro que lo hace trazable.
        </span>
      </p>
    </SlideLayout>
  )
}
