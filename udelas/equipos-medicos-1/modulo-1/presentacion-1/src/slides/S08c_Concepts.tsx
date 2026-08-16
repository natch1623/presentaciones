import { At, Ghost, Halo, Eyebrow, CYM, CY, CYS, VI, WD, WF, dly } from './Stage'

const concepts = [
  { term: 'Antisepsia',    def: 'Eliminación de microorganismos sobre tejido vivo',                     example: 'Clorhexidina en piel del paciente',          color: CYM },
  { term: 'Asepsia',       def: 'Barreras que impiden la llegada del microorganismo',                   example: 'Ropa estéril, campos, presión positiva',     color: CY },
  { term: 'Desinfección',  def: 'Eliminación de microorganismos en superficies inertes',                example: 'Limpieza terminal del salón',                color: CYS },
  { term: 'Esterilización', def: 'Destrucción de toda forma de vida microbiana, incluidas esporas',     example: 'Autoclave 121–134 °C',                       color: VI },
]

/**
 * Los cuatro términos que el oficio confunde. Escalera creciente:
 * cada uno entra más adentro y su color se aleja del cian, de modo
 * que la lámina misma dibuja la gradación de exigencia.
 */
export default function S08c_Concepts() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="04" side="right" size={440} top={210} opacity={0.026} font="mono" />
      <Halo x={200} y={200} size={620} color="rgba(56,189,248,0.14)" />
      <Halo x={1200} y={660} size={700} color="rgba(167,139,250,0.16)" />

      <At l={100} t={88} anim="none">
        <Eyebrow d={0}>Asepsia · terminología</Eyebrow>
      </At>

      {concepts.map((c, i) => (
        <At key={c.term} l={100 + i * 48} t={158 + i * 148} w={1060} d={1 + i * 2} anim="drift">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
            <h3
              className="font-display"
              style={{
                fontSize: 36, color: c.color, margin: 0, lineHeight: 1,
                textShadow: `0 0 30px ${c.color}55`, flexShrink: 0,
              }}
            >
              {c.term}
            </h3>
            <div
              className="span-x"
              style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${c.color}55, transparent)`, ...dly(2 + i * 2) }}
            />
          </div>
          <p style={{ fontSize: 18, color: WD, lineHeight: 1.55, margin: '16px 0 8px', fontWeight: 300, maxWidth: 860 }}>
            {c.def}
          </p>
          <p className="font-mono" style={{ fontSize: 11.5, color: WF, margin: 0, letterSpacing: '0.06em' }}>
            Ej: {c.example}
          </p>
        </At>
      ))}
    </div>
  )
}
