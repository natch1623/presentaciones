import { At, Ghost, Halo, Eyebrow, GO, GOD, VI, WH, WD, WF, dly } from './Stage'

/**
 * La lección. Es la frase que el módulo quiere que sobreviva al
 * examen, así que la lámina no contiene nada más que ella.
 */
export default function S15b_LaminarLesson() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="≠" side="right" size={560} top={130} opacity={0.028} color={GO} />
      <Halo x={280} y={340} size={900} color="rgba(245,158,11,0.16)" />
      <Halo x={1220} y={720} size={640} color="rgba(109,40,217,0.16)" />

      <At l={100} t={130} anim="none">
        <Eyebrow d={0} color={GO}>Lección para el ingeniero biomédico</Eyebrow>
      </At>

      <At l={96} t={184} w={1100} anim="none">
        <p
          className="font-display wipe"
          style={{ fontSize: 40, lineHeight: 1.38, color: WD, margin: 0, fontWeight: 400, ...dly(1) }}
        >
          Un sistema puede cumplir perfectamente su especificación técnica{' '}
          <span style={{ color: WF }}>(reducir UFC/m³)</span> sin producir el beneficio clínico esperado.
        </p>
      </At>

      <At l={-70} t={420} w={640} h={2} z={1} anim="none">
        <div
          className="span-x"
          style={{ width: '100%', height: 2, background: `linear-gradient(90deg, transparent, ${GOD})`, boxShadow: `0 0 18px ${GOD}88`, ...dly(4) }}
        />
      </At>

      <At l={96} t={462} w={1180} anim="none">
        <p
          className="font-display wipe"
          style={{
            fontSize: 62, lineHeight: 1.14, color: GO, margin: 0, fontWeight: 400,
            textShadow: `0 0 60px ${GO}44`, ...dly(5),
          }}
        >
          La validación técnica y la validación clínica no son lo mismo.
        </p>
      </At>

      <At l={100} t={668} w={1160} d={8}>
        <div style={{ paddingLeft: 20, borderLeft: `2px solid ${VI}` }}>
          <p style={{ fontSize: 16, color: WH, margin: 0, lineHeight: 1.65, fontWeight: 300 }}>
            🎙️ <strong style={{ color: VI, fontWeight: 600 }}>Debate:</strong> ¿Ustedes recomendarían comprar flujo
            laminar para un quirófano nuevo en Panamá? Justifiquen.
          </p>
        </div>
      </At>
    </div>
  )
}
