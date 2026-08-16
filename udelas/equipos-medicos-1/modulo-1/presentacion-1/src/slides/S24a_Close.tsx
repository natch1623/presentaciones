import { At, Ghost, Halo, Eyebrow, CY, CYM, VI, GO, WH, dly } from './Stage'

const ideas = [
  {
    num: '01',
    text: 'El quirófano moderno es el resultado de resolver secuencialmente tres problemas:',
    highlight: 'dolor (1846) → infección (1867–1886) → soporte vital (s. XX)',
    color: CY,
  },
  {
    num: '02',
    text: 'Un salón de operaciones no es un cuarto: es un',
    highlight: 'sistema integrado de aire, energía, gases, iluminación y equipamiento — con parámetros medibles y auditables.',
    color: CYM,
  },
  {
    num: '03',
    text: 'Cada parámetro ambiental tiene una justificación clínica;',
    highlight: 'el ingeniero biomédico debe poder explicarla, no solo medirla.',
    color: VI,
  },
  {
    num: '04',
    text: 'La evidencia clínica puede contradecir la intuición técnica (caso flujo laminar):',
    highlight: 'valida siempre contra desenlace en el paciente.',
    color: GO,
  },
]

/**
 * El cierre. Cuatro ideas, cada una en su sangría, con el numeral
 * grande y traslúcido colgando en el margen. Lo que hay que
 * recordar de cada una va en el color de su idea.
 */
export default function S24a_Close() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="04" side="right" size={480} top={220} opacity={0.028} font="mono" />
      <Halo x={200} y={200} size={700} color="rgba(0,212,255,0.15)" />
      <Halo x={1220} y={720} size={760} color="rgba(109,40,217,0.2)" />

      <At l={100} t={92} anim="none">
        <Eyebrow d={0}>Cierre y transición</Eyebrow>
      </At>

      <At l={94} t={134} w={900} anim="none">
        <h2
          className="font-display wipe"
          style={{ fontSize: 74, lineHeight: 1.02, color: WH, margin: 0, fontWeight: 400, ...dly(1) }}
        >
          Ideas para <span style={{ color: CY, textShadow: `0 0 60px ${CY}55` }}>llevarse</span>
        </h2>
      </At>

      {ideas.map((idea, i) => (
        <At key={idea.num} l={100 + i * 30} t={296 + i * 116} w={1220 - i * 30} d={3 + i} anim="drift">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 22 }}>
            <span
              className="font-mono"
              style={{ fontSize: 26, color: idea.color, opacity: 0.35, flexShrink: 0, width: 46 }}
            >
              {idea.num}
            </span>
            <p style={{ fontSize: 18, color: 'rgba(240,249,255,0.78)', margin: 0, lineHeight: 1.72, fontWeight: 300, maxWidth: 1060 }}>
              {idea.text}{' '}
              <strong style={{ color: idea.color, fontWeight: 600, textShadow: `0 0 22px ${idea.color}44` }}>
                {idea.highlight}
              </strong>
            </p>
          </div>
        </At>
      ))}
    </div>
  )
}
