/**
 * Los pasos de un procedimiento colgados de una órbita lunar, en
 * lugar de encadenados con flechas (§22 de la guía visual).
 *
 * La curva no es decorativa: separa visualmente los pasos que ya se
 * recorrieron de los que faltan, y el nodo activo se enciende como una
 * luna en su punto más alto.
 */
export default function OrbitaPasos({
  total,
  /** Pasos encendidos, 1‑indexados. El resto queda en penumbra. */
  activos,
  height = 440,
  tone = 'hydro',
}: {
  total: number
  activos: number[]
  height?: number
  tone?: 'hydro' | 'violet' | 'cyan'
}) {
  const INK = {
    hydro: { c: '#72c7ff', rgb: '114,199,255' },
    violet: { c: '#c7b5ff', rgb: '199,181,255' },
    cyan: { c: '#bdf8ff', rgb: '189,248,255' },
  }[tone]

  const H = 440
  const W = 120
  const top = 34
  const paso = (H - top * 2) / (total - 1)
  // La órbita se abomba hacia la derecha: un arco, no una recta.
  const xs = Array.from({ length: total }, (_, i) => 44 + 30 * Math.sin((i / (total - 1)) * Math.PI))
  const ys = Array.from({ length: total }, (_, i) => top + paso * i)

  const curva = xs
    .map((x, i) => (i === 0 ? `M ${x} ${ys[i]}` : `Q ${x + 12} ${ys[i] - paso / 2} ${x} ${ys[i]}`))
    .join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: W, height, flexShrink: 0 }} aria-hidden>
      <defs>
        <filter id={`opGlow${tone}`} x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <path d={curva} fill="none" stroke={`rgba(${INK.rgb},0.26)`} strokeWidth="1" strokeDasharray="3 6" />

      {/* Destello arriba y abajo: la órbita entra y sale del cuadro */}
      <path d="M 44 8 l 3 8 l 8 3 l -8 3 l -3 8 l -3 -8 l -8 -3 l 8 -3 Z" fill={INK.c} fillOpacity="0.5" />
      <path
        d={`M ${xs[total - 1]} ${H - 22} l 3 8 l 8 3 l -8 3 l -3 8 l -3 -8 l -8 -3 l 8 -3 Z`}
        fill={INK.c}
        fillOpacity="0.35"
      />

      {ys.map((y, i) => {
        const on = activos.includes(i + 1)
        const x = xs[i]
        return (
          <g
            key={i}
            style={{
              animation: `constellationPop 0.7s cubic-bezier(0.22,1,0.36,1) ${0.18 + i * 0.09}s both`,
              transformOrigin: `${x}px ${y}px`,
            }}
          >
            {on && <circle cx={x} cy={y} r="20" fill={`rgba(${INK.rgb},0.08)`} stroke={`rgba(${INK.rgb},0.24)`} strokeWidth="0.7" />}
            <circle
              cx={x}
              cy={y}
              r="13"
              fill="rgba(8,13,36,0.9)"
              stroke={on ? INK.c : `rgba(${INK.rgb},0.30)`}
              strokeWidth={on ? 1.4 : 0.9}
              filter={on ? `url(#opGlow${tone})` : undefined}
            />
            <text
              x={x}
              y={y + 4}
              textAnchor="middle"
              fill={on ? INK.c : 'rgba(170,184,214,0.55)'}
              style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11 }}
            >
              {i + 1}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
