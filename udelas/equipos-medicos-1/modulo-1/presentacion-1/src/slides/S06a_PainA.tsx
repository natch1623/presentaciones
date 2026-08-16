import { At, Ghost, Halo, Title, Ac, CYM, WD, WF, dly } from './Stage'

const rows = [
  { period: 'Antigüedad', method: 'Opio, mandrágora, cannabis, alcohol, compresión nerviosa, hipotermia', limit: 'Dosis incontrolable, efecto impredecible' },
  { period: 'S. XVI–XVII', method: '"Esponja soporífera", alcohol destilado, láudano', limit: 'Sin control de profundidad; riesgo de muerte' },
  { period: '1772–1800', method: 'Joseph Priestley aísla N₂O; Humphry Davy describe efecto analgésico (1800)', limit: 'No se aplicó a cirugía por décadas' },
  { period: '1842', method: 'Crawford Long usa éter en Georgia (no lo publica hasta 1849)', limit: 'Sin difusión → sin impacto' },
]

/**
 * Los intentos que no cuajaron. El periodo cuelga en el margen
 * izquierdo, el método corre grande y la limitación baja en gris:
 * una tabla de tres columnas sin una sola línea de tabla.
 */
export default function S06a_PainA() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="Éter" side="right" size={300} top={470} opacity={0.028} />
      <Halo x={1280} y={620} size={720} color="rgba(0,212,255,0.14)" />
      <Halo x={140} y={150} size={560} color="rgba(109,40,217,0.18)" />

      <At l={96} t={86} w={840} anim="none">
        <Title size={50} d={0}>
          Del opio al <Ac>éter</Ac>: evolución analgésica
        </Title>
      </At>

      {rows.map((r, i) => (
        <At key={r.period} l={100} t={238 + i * 128} w={1240} d={2 + i} anim="drift">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 28 }}>
            <span
              className="font-mono"
              style={{ width: 150, textAlign: 'right', flexShrink: 0, fontSize: 13, color: CYM, letterSpacing: '0.06em' }}
            >
              {r.period}
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 21, color: WD, lineHeight: 1.45, margin: '0 0 9px', fontWeight: 300 }}>
                {r.method}
              </p>
              <p style={{ fontSize: 13.5, color: WF, lineHeight: 1.5, margin: 0 }}>
                {r.limit}
              </p>
            </div>
          </div>
          <div
            className="span-x"
            style={{
              width: 860, height: 1, marginTop: 24, marginLeft: 178,
              background: 'linear-gradient(90deg, rgba(240,249,255,0.1), transparent)',
              ...dly(3 + i),
            }}
          />
        </At>
      ))}
    </div>
  )
}
