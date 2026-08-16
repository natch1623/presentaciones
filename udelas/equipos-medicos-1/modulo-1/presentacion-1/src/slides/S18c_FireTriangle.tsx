import { At, Ghost, Halo, Eyebrow, GO, WH, WD, dly } from './Stage'

const vertices = [
  { label: 'Comburente', items: 'O₂/N₂O enriquecido en atmósfera',                          color: '#f97316', l: 916,  t: 40,  w: 320, align: 'center' as const },
  { label: 'Ignición',    items: 'Electrobisturí, láser, fuente de luz endoscopía',          color: '#ef4444', l: 532,  t: 592, w: 290, align: 'left' as const },
  { label: 'Combustible', items: 'Campos textiles, antisépticos alcohólicos, tubo endotraqueal', color: '#f59e0b', l: 1066, t: 592, w: 330, align: 'left' as const },
]

/**
 * El triángulo, dibujado como triángulo. El vértice derecho sale
 * por el borde del escenario, de modo que la figura no se lee como
 * un gráfico metido en un recuadro sino como algo que estaba ahí
 * antes de que empezara la lámina.
 */
export default function S18c_FireTriangle() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="🔥" side="left" size={300} top={430} opacity={0.04} />
      <Halo x={1080} y={430} size={900} color="rgba(249,115,22,0.16)" />
      <Halo x={180} y={220} size={620} color="rgba(239,68,68,0.12)" />

      <svg
        viewBox="0 0 1440 810"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}
      >
        <defs>
          <linearGradient id="fireFill" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="rgba(249,115,22,0.16)" />
            <stop offset="100%" stopColor="rgba(245,158,11,0.03)" />
          </linearGradient>
          <linearGradient id="fireEdge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="50%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        <polygon
          points="1070,128 720,548 1460,548"
          fill="url(#fireFill)"
          stroke="url(#fireEdge)"
          strokeWidth="2"
          className="stroke-in"
          style={{ strokeDasharray: 1900, ['--len' as string]: 1900, animationDelay: '0.25s', filter: 'drop-shadow(0 0 20px rgba(249,115,22,0.4))' }}
        />

        {[
          { x: 1070, y: 128, c: '#f97316' },
          { x: 720, y: 548, c: '#ef4444' },
          { x: 1460, y: 548, c: '#f59e0b' },
        ].map((v, i) => (
          <g key={i} className="bloom" style={{ ...dly(6 + i) }}>
            <circle cx={v.x} cy={v.y} r="18" fill={v.c} opacity="0.14" />
            <circle cx={v.x} cy={v.y} r="7" fill={v.c} style={{ filter: `drop-shadow(0 0 12px ${v.c})` }} />
          </g>
        ))}
      </svg>

      <At l={100} t={214} anim="none" z={3}>
        <Eyebrow d={0} color={GO}>Seguridad eléctrica · continuación</Eyebrow>
      </At>

      <At l={96} t={262} w={430} anim="none" z={3}>
        <h2
          className="font-display wipe"
          style={{ fontSize: 54, lineHeight: 1.08, color: WH, margin: 0, fontWeight: 400, ...dly(1) }}
        >
          Triángulo de fuego quirúrgico 🔥
        </h2>
      </At>

      {vertices.map((v, i) => (
        <At key={v.label} l={v.l} t={v.t} w={v.w} d={7 + i} z={3} anim="rise">
          <p
            className="font-mono"
            style={{
              fontSize: 12, color: v.color, letterSpacing: '0.22em', textTransform: 'uppercase',
              margin: '0 0 10px', textAlign: v.align, textShadow: `0 0 18px ${v.color}66`,
            }}
          >
            {v.label}
          </p>
          <p style={{ fontSize: 15, color: WD, margin: 0, lineHeight: 1.55, fontWeight: 300, textAlign: v.align }}>
            {v.items}
          </p>
        </At>
      ))}
    </div>
  )
}
