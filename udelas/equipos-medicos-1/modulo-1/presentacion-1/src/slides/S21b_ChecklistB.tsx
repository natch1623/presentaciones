import { At, Ghost, Halo, Eyebrow, CY, WF, dly } from './Stage'
import { Moment } from './S21a_ChecklistA'

const salida = [
  'Nombre del procedimiento registrado',
  'Conteo de gasas, agujas e instrumental',
  'Etiquetado de muestras de patología',
  '🔧 Problemas de equipamiento a resolver ← IB',
  'Plan de recuperación postoperatoria',
]

const evidence = [
  { stat: '1.5% → 0.8%', label: 'Reducción mortalidad postoperatoria (Haynes et al., NEJM 2009)' },
  { stat: 'RR 0.77', label: 'Reducción de mortalidad en países de ingresos bajos/medios (White et al., 2021, n=47 estudios)' },
]

/**
 * El tercer momento —el único de los tres en que el ingeniero
 * biomédico aparece por nombre— y la evidencia de que la lista
 * funciona. Las dos cifras corren a tamaño de titular porque son
 * el argumento entero.
 */
export default function S21b_ChecklistB() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="0.8%" side="right" size={300} top={470} opacity={0.03} font="mono" />
      <Halo x={240} y={340} size={760} color="rgba(56,189,248,0.15)" />
      <Halo x={1180} y={660} size={700} color="rgba(0,212,255,0.14)" />

      <At l={100} t={92} anim="none">
        <Eyebrow d={0}>Lista de Verificación OMS · continuación</Eyebrow>
      </At>

      <Moment
        id="SALIDA"
        sub="Sign out — antes de que el paciente salga"
        items={salida.map((s, i) =>
          i === 3 ? <span key={s} style={{ color: '#38bdf8', fontWeight: 500 }}>{s}</span> : s
        )}
        color="#38bdf8"
        num="3"
        l={100}
        t={182}
        d={1}
      />

      {evidence.map((e, i) => (
        <At key={e.stat} l={800} t={252 + i * 226} w={520} d={5 + i * 3} anim="drift-r">
          <p
            className="font-display bloom"
            style={{ fontSize: 56, lineHeight: 1, color: CY, margin: '0 0 18px', textShadow: `0 0 48px ${CY}55`, ...dly(5 + i * 3) }}
          >
            {e.stat}
          </p>
          <div
            className="span-x"
            style={{ width: 240, height: 1, background: `linear-gradient(90deg, ${CY}88, transparent)`, marginBottom: 16, ...dly(6 + i * 3) }}
          />
          <p style={{ fontSize: 14.5, color: WF, margin: 0, lineHeight: 1.6, maxWidth: 460 }}>{e.label}</p>
        </At>
      ))}
    </div>
  )
}
