import { At, Ghost, Halo, Title, Ac, CY, CYM, WD, WF, dly } from './Stage'

const params = [
  { param: 'Temperatura', value: '20–24 °C', norm: 'ASHRAE 170', icon: '🌡️' },
  { param: 'Humedad relativa', value: '20–60 %', norm: 'ASHRAE 170', icon: '💧' },
  { param: 'Cambios de aire totales', value: '≥ 20 ACH', norm: 'ASHRAE 170, Tabla 7-1', icon: '🔄' },
  { param: 'Aire exterior', value: '≥ 4 ACH', norm: 'ASHRAE 170', icon: '🌬️' },
  { param: 'Presión diferencial', value: '+2.5 Pa (positiva)', norm: 'ASHRAE 170', icon: '📊' },
  { param: 'Filtración', value: 'MERV 7 + MERV 14 (HEPA en ultralimpio)', norm: 'ASHRAE 170', icon: '🔬' },
  { param: 'Clasificación de partículas', value: 'ISO 14644-1 Clase 7 / Clase 5 ultralimpio', norm: 'ISO 14644-1', icon: '📐' },
]

/**
 * Los parámetros normados. A la derecha, el flujo unidireccional
 * mismo: columnas de aire que entran por arriba del cuadro y salen
 * por abajo, cortadas por los dos bordes. La lista se lee sobre
 * ese aire, no dentro de una tabla.
 */
export default function S14a_HVAC() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="20 ACH" side="right" size={170} top={720} opacity={0.03} font="mono" />
      <Halo x={1220} y={380} size={860} color="rgba(0,212,255,0.14)" />

      {/* El aire descendente, a sangre por arriba y por abajo */}
      <svg
        viewBox="0 0 1440 810"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}
      >
        <defs>
          <linearGradient id="airFade" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,212,255,0.55)" />
            <stop offset="55%" stopColor="rgba(0,212,255,0.16)" />
            <stop offset="100%" stopColor="rgba(0,212,255,0)" />
          </linearGradient>
        </defs>
        {Array.from({ length: 15 }, (_, i) => {
          const x = 900 + i * 36
          return (
            <g key={i} className="span-y" style={{ transformOrigin: 'top center', ...dly(3 + i * 0.35) }}>
              <line x1={x} y1={-20} x2={x} y2={640 + (i % 3) * 60} stroke="url(#airFade)" strokeWidth="1.2" />
              <polygon
                points={`${x - 4},${560 + (i % 3) * 60} ${x + 4},${560 + (i % 3) * 60} ${x},${576 + (i % 3) * 60}`}
                fill={CY}
                opacity="0.28"
              />
            </g>
          )
        })}
      </svg>

      <At l={96} t={92} w={780} anim="none">
        <Title size={44} d={0}>
          Condiciones Ambientales Normadas <Ac>(HVAC)</Ac>
        </Title>
      </At>

      <At l={100} t={186} w={720} d={1}>
        <p style={{ fontSize: 15, color: WF, margin: 0, lineHeight: 1.5 }}>
          El aire es un equipo médico más — ANSI/ASHRAE/ASHE Standard 170-2025
        </p>
      </At>

      {params.map((p, i) => (
        <At key={p.param} l={100} t={252 + i * 72} w={780} d={2 + i} anim="drift">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <span style={{ fontSize: 17, flexShrink: 0, width: 26 }}>{p.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 17.5, color: WD, margin: '0 0 4px', fontWeight: 300 }}>{p.param}</p>
              <p className="font-mono" style={{ fontSize: 9.5, color: 'rgba(240,249,255,0.26)', margin: 0, letterSpacing: '0.1em' }}>
                {p.norm}
              </p>
            </div>
            <span
              className="font-mono"
              style={{ fontSize: 14, color: CY, flexShrink: 0, textAlign: 'right', maxWidth: 300, lineHeight: 1.4 }}
            >
              {p.value}
            </span>
          </div>
          <div
            className="span-x"
            style={{
              width: 770, height: 1, marginTop: 14,
              background: `linear-gradient(90deg, ${CYM}22, transparent)`,
              ...dly(3 + i),
            }}
          />
        </At>
      ))}
    </div>
  )
}
