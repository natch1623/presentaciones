import { At, Ghost, Halo, Eyebrow, CY, RE, GO, WD, WF, dly } from './Stage'

const risks = [
  {
    type: 'Macroshock',
    path: 'Corriente a través de la piel íntegra',
    threshold: '~100 mA',
    outcome: '→ fibrilación ventricular',
    color: RE,
    l: 100, t: 200, size: 92,
  },
  {
    type: 'Microshock',
    path: 'Corriente directa al miocardio por catéter o electrodo',
    threshold: '~10–100 µA',
    outcome: '→ fibrilación ventricular',
    color: GO,
    l: 760, t: 372, size: 78,
  },
]

/**
 * Los dos caminos de la corriente. La diferencia entre 100 mA y
 * 100 µA es de tres órdenes de magnitud, y ponerlos en dos celdas
 * del mismo tamaño la escondía. Aquí uno está arriba y a la
 * izquierda, el otro abajo y a la derecha, y el cuerpo de cada
 * cifra dice cuál de los dos es el que sorprende.
 */
export default function S18b_Shock() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="µA" side="right" size={460} top={430} opacity={0.03} font="mono" color={GO} />
      <Halo x={260} y={300} size={780} color="rgba(239,68,68,0.16)" />
      <Halo x={1120} y={520} size={720} color="rgba(251,191,36,0.14)" />

      <At l={100} t={110} anim="none">
        <Eyebrow d={0} color={RE}>Riesgos eléctricos del paciente</Eyebrow>
      </At>

      <At l={0} t={0} w={1440} h={810} z={0} anim="none" style={{ pointerEvents: 'none' }}>
        <div
          className="span-x"
          style={{
            position: 'absolute', left: 200, top: 300, width: 900, height: 1,
            backgroundImage: `linear-gradient(90deg, ${RE}44, ${GO}44)`,
            transform: 'rotate(17deg)', transformOrigin: 'left center', ...dly(4),
          }}
        />
      </At>

      {risks.map((r, i) => (
        <At key={r.type} l={r.l} t={r.t} w={540} d={2 + i * 3} anim={i === 0 ? 'drift' : 'drift-r'}>
          <h3
            className="font-display"
            style={{ fontSize: 34, color: r.color, margin: '0 0 12px', lineHeight: 1, textShadow: `0 0 34px ${r.color}55` }}
          >
            {r.type}
          </h3>
          <p style={{ fontSize: 16.5, color: WD, margin: '0 0 22px', lineHeight: 1.55, fontWeight: 300, maxWidth: 460 }}>
            {r.path}
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 18 }}>
            <span
              className="font-display bloom"
              style={{
                fontSize: r.size, lineHeight: 0.9, color: r.color,
                textShadow: `0 0 50px ${r.color}55`, ...dly(3 + i * 3),
              }}
            >
              {r.threshold}
            </span>
            <span className="font-mono" style={{ fontSize: 13, color: r.color, opacity: 0.85 }}>
              {r.outcome}
            </span>
          </div>
        </At>
      ))}

      <At l={-60} t={620} w={600} h={1} z={1} anim="none">
        <div
          className="span-x"
          style={{ width: '100%', height: 1, background: `linear-gradient(90deg, transparent, ${CY}66)`, ...dly(8) }}
        />
      </At>

      <At l={100} t={654} w={1180} d={9}>
        <p style={{ fontSize: 17, color: WF, lineHeight: 1.65, margin: 0, fontWeight: 300 }}>
          IEC 60601-1 limita corriente de fuga del paciente a{' '}
          <strong style={{ color: CY, fontWeight: 600 }}>≤10 µA</strong> (condición normal, tipo CF). Verificación
          periódica por IEC 62353.
        </p>
      </At>
    </div>
  )
}
