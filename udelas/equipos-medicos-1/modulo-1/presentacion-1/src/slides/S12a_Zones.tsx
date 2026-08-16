import { At, Ghost, Halo, Title, Ac, CY, WD, WF, dly } from './Stage'

/**
 * Las tres zonas, dibujadas como lo que realmente son: campos de
 * presión concéntricos, no habitaciones en un plano. El sistema
 * está descentrado y cortado por el borde derecho, y las flechas
 * salen hacia afuera porque el quirófano empuja el aire hacia la
 * calle, nunca al revés.
 */
const zones = [
  { id: 'NEGRA',  label: 'No Restringida',        color: '#7c8496', r: 300, dots: 1 },
  { id: 'GRIS',   label: 'Semirrestringida',      color: '#8fa2c0', r: 205, dots: 2 },
  { id: 'BLANCA', label: 'Restringida · Estéril', color: CY,        r: 110, dots: 3 },
]

const CX = 1100
const CY_ = 430

export default function S12a_Zones() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="03" side="left" size={430} top={330} opacity={0.026} font="mono" />
      <Halo x={CX} y={CY_} size={880} color="rgba(0,212,255,0.16)" />

      {/* El sistema de presiones */}
      <svg
        viewBox="0 0 1440 810"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}
      >
        <defs>
          <radialGradient id="zBlanca" cx="50%" cy="50%">
            <stop offset="0%" stopColor="rgba(0,212,255,0.28)" />
            <stop offset="100%" stopColor="rgba(0,212,255,0.02)" />
          </radialGradient>
          <radialGradient id="zGris" cx="50%" cy="50%">
            <stop offset="55%" stopColor="rgba(100,116,139,0.02)" />
            <stop offset="100%" stopColor="rgba(100,116,139,0.14)" />
          </radialGradient>
        </defs>

        <circle cx={CX} cy={CY_} r={zones[0].r} fill="rgba(107,114,128,0.05)" stroke={zones[0].color} strokeWidth="1" strokeOpacity="0.4" />
        <circle cx={CX} cy={CY_} r={zones[1].r} fill="url(#zGris)" stroke={zones[1].color} strokeWidth="1.2" strokeOpacity="0.5" />
        <circle cx={CX} cy={CY_} r={zones[2].r} fill="url(#zBlanca)" stroke={CY} strokeWidth="2" strokeOpacity="0.9"
          style={{ filter: `drop-shadow(0 0 22px ${CY})` }} />

        {/* Presión positiva: el aire sale del centro hacia afuera */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => {
          const rad = (a * Math.PI) / 180
          const x1 = CX + Math.cos(rad) * 122
          const y1 = CY_ + Math.sin(rad) * 122
          const x2 = CX + Math.cos(rad) * 190
          const y2 = CY_ + Math.sin(rad) * 190
          return (
            <g key={a} className="rise" style={{ ...dly(6 + i * 0.4) }}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={CY} strokeWidth="1.4" strokeOpacity="0.45" />
              <circle cx={x2} cy={y2} r="2.6" fill={CY} opacity="0.6" />
            </g>
          )
        })}
      </svg>

      {/* Etiquetas de cada banda, colgando de una línea guía */}
      {zones.map((z, i) => (
        <At key={z.id} l={100} t={252 + i * 118} w={620} d={3 + i * 2} anim="drift" z={3}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
            <span
              className="font-mono"
              style={{ fontSize: 21, color: z.color, letterSpacing: '0.18em', fontWeight: 700, textShadow: `0 0 22px ${z.color}66` }}
            >
              ZONA {z.id}
            </span>
            <span style={{ display: 'flex', gap: 4 }}>
              {[0, 1, 2].map(d => (
                <span
                  key={d}
                  style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: d < z.dots ? z.color : 'rgba(240,249,255,0.1)',
                    boxShadow: d < z.dots ? `0 0 7px ${z.color}` : 'none',
                  }}
                />
              ))}
            </span>
          </div>
          <p style={{ fontSize: 15, color: WF, margin: '0 0 12px' }}>{z.label}</p>
          <div
            className="span-x"
            style={{
              width: 300 + i * 120, height: 1,
              background: `linear-gradient(90deg, ${z.color}88, ${z.color}22, transparent)`,
              ...dly(4 + i * 2),
            }}
          />
        </At>
      ))}

      <At l={96} t={92} w={860} anim="none" z={3}>
        <Title size={48} d={0}>
          Zonificación quirúrgica: <Ac>las tres zonas</Ac>
        </Title>
      </At>

      <At l={100} t={664} w={600} d={9} z={3}>
        <p style={{ fontSize: 16, color: WD, margin: 0, lineHeight: 1.6, fontWeight: 300 }}>
          Las flechas marcan la <strong style={{ color: CY, fontWeight: 500 }}>presión diferencial positiva</strong>:
          el aire sale siempre del centro hacia afuera.
        </p>
      </At>
    </div>
  )
}
