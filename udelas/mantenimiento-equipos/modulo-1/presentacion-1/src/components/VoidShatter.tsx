/**
 * VoidShatter — la capa que vende el corte entre diapositivas.
 *
 * No toca el contenido: se superpone. Al avanzar dibuja la fractura
 * (líneas de quiebre que destellan), suelta las esquirlas hacia afuera
 * y abre una grieta luminosa en el centro. Al retroceder hace lo
 * inverso: las esquirlas vuelven y la grieta se cierra.
 *
 * Las esquirlas son un abanico fijo calculado una sola vez, no aleatorio
 * por render: si cambiaran en cada transición el corte se sentiría
 * distinto cada vez y perdería la lectura de "la misma lámina que se
 * rompe siempre igual".
 */

type Phase = 'break' | 'gather' | null

/** Punto del anillo de fractura, en porcentaje del lienzo. */
interface RingPoint {
  x: number
  y: number
}

const CX = 50
const CY = 50

/* Anillo irregular de 15 vértices. El radio alterna para que las
   esquirlas salgan de distinto tamaño, como vidrio real. */
const RING: RingPoint[] = (() => {
  const radii = [78, 62, 88, 55, 74, 95, 60, 82, 68, 92, 58, 79, 86, 64, 90]
  return radii.map((r, i) => {
    const a = (i / radii.length) * Math.PI * 2 - Math.PI / 2
    return {
      x: CX + Math.cos(a) * r * 0.9,
      y: CY + Math.sin(a) * r * 0.62,
    }
  })
})()

/** Una esquirla = triángulo centro → dos vértices contiguos del anillo. */
interface Shard {
  clip: string
  /** Desplazamiento final, en px sobre el lienzo de 1280×800. */
  sx: number
  sy: number
  sr: number
  ss: number
  sd: number
  sdel: number
}

const SHARDS: Shard[] = RING.map((p, i) => {
  const q = RING[(i + 1) % RING.length]
  // Dirección de fuga: la bisectriz del triángulo, alejándose del centro.
  const mx = (p.x + q.x) / 2 - CX
  const my = (p.y + q.y) / 2 - CY
  const len = Math.hypot(mx, my) || 1
  const push = 300 + (i % 5) * 46

  return {
    clip: `polygon(${CX}% ${CY}%, ${p.x.toFixed(2)}% ${p.y.toFixed(2)}%, ${q.x.toFixed(2)}% ${q.y.toFixed(2)}%)`,
    sx: (mx / len) * push,
    sy: (my / len) * push * 0.72,
    sr: (i % 2 === 0 ? 1 : -1) * (8 + (i % 4) * 5),
    ss: 1.12 + (i % 3) * 0.08,
    sd: 0.54 + (i % 4) * 0.06,
    sdel: (i % 6) * 0.018,
  }
})

/* Líneas de fractura: radiales desde el centro hasta el anillo, más
   un par de fisuras transversales que las cruzan. */
const CRACKS: string[] = [
  ...RING.map(p => `M ${CX} ${CY} L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`),
  'M 18 22 L 42 47 L 30 74',
  'M 84 26 L 58 49 L 72 78',
]

export default function VoidShatter({ phase }: { phase: Phase }) {
  if (!phase) return null

  const shardClass = phase === 'break' ? 'shard-fly' : 'shard-gather'

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 60,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* ── Esquirlas de cristal ── */}
      {SHARDS.map((s, i) => (
        <div
          key={i}
          className={shardClass}
          style={
            {
              position: 'absolute',
              inset: 0,
              clipPath: s.clip,
              background:
                i % 3 === 0
                  ? 'linear-gradient(140deg, rgba(184,236,255,0.30) 0%, rgba(125,99,255,0.16) 55%, rgba(4,5,14,0.05) 100%)'
                  : i % 3 === 1
                    ? 'linear-gradient(200deg, rgba(143,220,255,0.22) 0%, rgba(11,16,48,0.34) 100%)'
                    : 'linear-gradient(90deg, rgba(234,246,255,0.16) 0%, rgba(67,39,184,0.22) 100%)',
              mixBlendMode: 'screen',
              '--sx': `${s.sx}px`,
              '--sy': `${s.sy}px`,
              '--sr': `${s.sr}deg`,
              '--ss': `${s.ss}`,
              '--sd': `${s.sd}s`,
              '--sdel': `${s.sdel}s`,
            } as React.CSSProperties
          }
        />
      ))}

      {/* ── Líneas de quiebre ── */}
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <defs>
          <linearGradient id="crackGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#b8ecff" />
            <stop offset="55%" stopColor="#8fdcff" />
            <stop offset="100%" stopColor="#7d63ff" />
          </linearGradient>
          <filter id="crackGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.7" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {CRACKS.map((d, i) => (
          <path
            key={i}
            className="crack-line"
            d={d}
            fill="none"
            stroke="url(#crackGrad)"
            strokeWidth={i < RING.length ? 0.22 : 0.16}
            strokeLinecap="round"
            filter="url(#crackGlow)"
            vectorEffect="non-scaling-stroke"
            style={{
              animationDelay: `${(i % 7) * 0.016}s`,
              animationDirection: phase === 'gather' ? 'reverse' : 'normal',
            }}
          />
        ))}
      </svg>

      {/* ── La grieta: núcleo blanco con halo violeta ── */}
      <div
        className="rift-flare"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          width: 3,
          marginLeft: -1.5,
          background:
            'linear-gradient(180deg, transparent 0%, rgba(234,246,255,0.95) 18%, #ffffff 50%, rgba(234,246,255,0.95) 82%, transparent 100%)',
          boxShadow:
            '0 0 26px 8px rgba(143,220,255,0.55), 0 0 70px 26px rgba(125,99,255,0.32)',
          animationDirection: phase === 'gather' ? 'reverse' : 'normal',
        }}
      />
    </div>
  )
}
