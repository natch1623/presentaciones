import { At, Ghost, Halo, CYM, CY, VI, WH, WD, dly } from './Stage'

const notes = [
  { label: 'Temperatura baja', text: 'Confort del equipo quirúrgico, pero ↑ riesgo de hipotermia perioperatoria del paciente → sistemas de calentamiento activo.' },
  { label: 'Humedad', text: 'Exceso: favorece moho. Deficiencia: ↑ electricidad estática y riesgo de ignición con electrobisturí y O₂.' },
  { label: 'Presión positiva', text: 'Garantiza que el aire fluya del quirófano hacia afuera, nunca al revés.' },
]

/**
 * El porqué clínico de cada número. Tres bloques en escalera, con
 * el rótulo colgando sobre el texto: la lámina anterior daba las
 * cifras, esta da las razones, y por eso se lee más despacio y en
 * cuerpo más grande.
 */
export default function S14b_HVACWhy() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="Por qué" side="right" size={230} top={-6} opacity={0.026} />
      <Halo x={220} y={260} size={720} color="rgba(0,212,255,0.14)" />
      <Halo x={1200} y={680} size={680} color="rgba(109,40,217,0.18)" />

      <At l={96} t={104} w={980} anim="none">
        <h2
          className="font-display wipe"
          style={{ fontSize: 46, lineHeight: 1.08, color: WH, margin: 0, fontWeight: 400, ...dly(0) }}
        >
          Por qué cada parámetro importa <em style={{ color: CY, textShadow: `0 0 40px ${CY}44` }}>clínicamente</em>
        </h2>
      </At>

      {notes.map((n, i) => (
        <At key={n.label} l={100 + i * 44} t={240 + i * 138} w={1060} d={2 + i * 2} anim="drift">
          <p
            className="font-mono"
            style={{ fontSize: 11, color: CYM, letterSpacing: '0.22em', textTransform: 'uppercase', margin: '0 0 12px' }}
          >
            {n.label}
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
            <span
              className="span-y"
              style={{ width: 2, height: 58, flexShrink: 0, background: `linear-gradient(180deg, ${CY}, transparent)`, ...dly(3 + i * 2) }}
            />
            <p style={{ fontSize: 20, color: WD, lineHeight: 1.6, margin: 0, fontWeight: 300, maxWidth: 980 }}>
              {n.text}
            </p>
          </div>
        </At>
      ))}

      <At l={100} t={670} w={1160} d={9}>
        <div style={{ paddingLeft: 20, borderLeft: `2px solid ${VI}` }}>
          <p style={{ fontSize: 15, color: WD, margin: 0, lineHeight: 1.65 }}>
            ⚠️ <strong style={{ color: VI }}>Edición vigente:</strong> ANSI/ASHRAE/ASHE 170-2025. En Panamá se usa
            como referencia ASHRAE 170 y guías FGI, además de las normas de habilitación del MINSA.
          </p>
        </div>
      </At>
    </div>
  )
}
