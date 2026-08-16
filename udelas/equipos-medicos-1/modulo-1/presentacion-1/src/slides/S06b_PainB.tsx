import { At, Ghost, Halo, Eyebrow, CY, CYM, VI, WH, WD, WF, dly } from './Stage'

/**
 * El hito. 1844 y 1847 quedan pequeños a los lados y 1846 crece
 * hasta ocupar el centro de la escena: la jerarquía cuenta la
 * historia sin necesidad de marcar ninguna fila.
 */
export default function S06b_PainB() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="1846" side="right" size={400} top={200} opacity={0.035} font="mono" color={CY} />
      <Halo x={980} y={380} size={900} color="rgba(0,212,255,0.2)" />

      <At l={100} t={78} anim="none">
        <Eyebrow d={0}>El hito · 16 de octubre de 1846</Eyebrow>
      </At>

      {/* Antes: Wells fracasa */}
      <At l={100} t={140} w={1060} d={1} anim="drift">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 26 }}>
          <span className="font-mono" style={{ width: 130, textAlign: 'right', flexShrink: 0, fontSize: 12, color: WF }}>
            1844
          </span>
          <div>
            <p style={{ fontSize: 17, color: WF, lineHeight: 1.45, margin: '0 0 6px', fontWeight: 300 }}>
              Horace Wells demuestra N₂O públicamente… y fracasa
            </p>
            <p style={{ fontSize: 12.5, color: 'rgba(240,249,255,0.28)', margin: 0 }}>
              Dosificación insuficiente
            </p>
          </div>
        </div>
      </At>

      {/* El hito, a otra escala */}
      <At l={-40} t={268} w={700} h={2} z={1} anim="none">
        <div
          className="span-x"
          style={{ width: '100%', height: 2, background: `linear-gradient(90deg, transparent, ${CY})`, boxShadow: `0 0 18px ${CY}88`, ...dly(3) }}
        />
      </At>

      <At l={100} t={296} d={3}>
        <span className="font-mono" style={{ fontSize: 14, color: CY, letterSpacing: '0.16em', fontWeight: 700 }}>
          16 OCT 1846
        </span>
      </At>

      <At l={96} t={330} w={1040} anim="none">
        <p
          className="font-display wipe"
          style={{ fontSize: 42, lineHeight: 1.2, color: WH, margin: 0, fontWeight: 400, ...dly(4) }}
        >
          W.T.G. Morton administra éter con inhalador de vidrio — <span style={{ color: CY, textShadow: `0 0 44px ${CY}55` }}>MGH Boston</span>
        </p>
      </At>

      <At l={100} t={478} d={6}>
        <p style={{ fontSize: 20, color: CY, margin: 0, fontWeight: 500 }}>
          ✅ Éxito público y reproducible
        </p>
      </At>

      {/* Después: cloroformo */}
      <At l={100} t={554} w={1060} d={7} anim="drift">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 26 }}>
          <span className="font-mono" style={{ width: 130, textAlign: 'right', flexShrink: 0, fontSize: 12, color: CYM }}>
            1847
          </span>
          <div>
            <p style={{ fontSize: 17, color: WD, lineHeight: 1.45, margin: '0 0 6px', fontWeight: 300 }}>
              James Young Simpson introduce el cloroformo en obstetricia
            </p>
            <p style={{ fontSize: 12.5, color: WF, margin: 0 }}>
              Hepatotoxicidad y arritmias (abandonado en s. XX)
            </p>
          </div>
        </div>
      </At>

      <At l={100} t={664} w={1120} d={9}>
        <div style={{ paddingLeft: 20, borderLeft: `2px solid ${VI}` }}>
          <p style={{ fontSize: 15, color: WD, margin: 0, lineHeight: 1.65 }}>
            💡 <strong style={{ color: VI }}>Nota:</strong> Morton no fue el primero, fue el primero en documentarlo
            públicamente y hacerlo <em>reproducible</em>. Ese es el criterio que define un hito tecnológico.
          </p>
        </div>
      </At>
    </div>
  )
}
