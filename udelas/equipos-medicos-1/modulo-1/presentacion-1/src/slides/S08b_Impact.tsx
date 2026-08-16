import { At, Ghost, Halo, Eyebrow, RE, GRE, WD, WF, dly } from './Stage'

const bars = [
  { label: 'Sin lavado de manos', value: 18, display: '18%', color: RE },
  { label: 'Con antisepsia (hipoclorito)', value: 2, display: '<2%', color: GRE },
]

const MAX_W = 1000

/**
 * El dato de Semmelweis, a escala real. Las dos barras corren a lo
 * ancho de la lámina y la diferencia entre ellas —que es todo el
 * argumento— se ve desde la última fila sin leer una sola cifra.
 */
export default function S08b_Impact() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="1847" side="right" size={360} top={40} opacity={0.03} font="mono" />
      <Halo x={220} y={300} size={780} color="rgba(239,68,68,0.14)" />
      <Halo x={1120} y={640} size={720} color="rgba(74,222,128,0.12)" />

      <At l={100} t={104} anim="none">
        <Eyebrow d={0} color={RE}>Impacto medible</Eyebrow>
      </At>

      <At l={96} t={144} w={1040} anim="none">
        <h2
          className="font-display wipe"
          style={{ fontSize: 44, lineHeight: 1.1, color: '#f0f9ff', margin: 0, fontWeight: 400, ...dly(1) }}
        >
          Mortalidad por fiebre puerperal — Semmelweis, 1847
        </h2>
      </At>

      {bars.map((b, i) => (
        <At key={b.label} l={100} t={300 + i * 210} w={1260} d={3 + i * 3} anim="drift">
          <p style={{ fontSize: 19, color: WD, margin: '0 0 18px', fontWeight: 300 }}>{b.label}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <div
              className="span-x"
              style={{
                width: (b.value / 18) * MAX_W, height: 14,
                background: `linear-gradient(90deg, ${b.color}, ${b.color}55)`,
                boxShadow: `0 0 26px ${b.color}88`,
                ...dly(4 + i * 3),
              }}
            />
            <span
              className="font-display bloom"
              style={{
                fontSize: 76, lineHeight: 0.9, color: b.color,
                textShadow: `0 0 48px ${b.color}66`, ...dly(5 + i * 3),
              }}
            >
              {b.display}
            </span>
          </div>
        </At>
      ))}
    </div>
  )
}
