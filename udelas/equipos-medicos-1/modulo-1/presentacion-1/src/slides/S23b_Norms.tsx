import { At, Ghost, Halo, CY, WH, WD, dly } from './Stage'

const norms = [
  { code: 'IEC 60601-1',     desc: 'Seguridad básica y desempeño esencial de equipos electromédicos' },
  { code: 'IEC 62353',       desc: 'Ensayos recurrentes y tras reparación de equipos electromédicos' },
  { code: 'NFPA 99',         desc: 'Código de instalaciones para cuidados de la salud (gases, eléctrico)' },
  { code: 'ASHRAE 170-2025', desc: 'Ventilación de instalaciones de salud' },
  { code: 'ISO 14644-1',     desc: 'Clasificación de limpieza del aire por concentración de partículas' },
  { code: 'ISO 13485',       desc: 'Sistemas de gestión de calidad para dispositivos médicos' },
  { code: 'ISO/IEC 80001-1', desc: 'Gestión de riesgo de redes de TI con dispositivos médicos' },
]

/**
 * Las normas de referencia. El código va en mono a la izquierda y
 * el alcance corre a su derecha; la hairline que los separa se
 * desvanece antes de llegar al borde, de modo que la lista no
 * dibuja nunca una columna cerrada.
 */
export default function S23b_Norms() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="ISO" side="right" size={370} top={490} opacity={0.026} />
      <Halo x={1260} y={250} size={720} color="rgba(0,212,255,0.14)" />
      <Halo x={140} y={660} size={640} color="rgba(37,99,235,0.16)" />

      <At l={96} t={96} w={860} anim="none">
        <h2
          className="font-display wipe"
          style={{ fontSize: 48, lineHeight: 1.08, color: WH, margin: 0, fontWeight: 400, ...dly(0) }}
        >
          Normas de referencia <span style={{ color: CY, textShadow: `0 0 44px ${CY}55` }}>esenciales</span>
        </h2>
      </At>

      {norms.map((n, i) => (
        <At key={n.code} l={100} t={214 + i * 78} w={1240} d={2 + i} anim="drift">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 28 }}>
            <span
              className="font-mono"
              style={{ width: 210, textAlign: 'right', flexShrink: 0, fontSize: 17, color: CY, letterSpacing: '0.04em' }}
            >
              {n.code}
            </span>
            <p style={{ flex: 1, fontSize: 18, color: WD, margin: 0, lineHeight: 1.5, fontWeight: 300, maxWidth: 960 }}>
              {n.desc}
            </p>
          </div>
          <div
            className="span-x"
            style={{
              width: 1060, height: 1, marginTop: 18, marginLeft: 238,
              background: 'linear-gradient(90deg, rgba(0,212,255,0.16), transparent)',
              ...dly(3 + i),
            }}
          />
        </At>
      ))}
    </div>
  )
}
