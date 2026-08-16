import { At, Ghost, Halo, CY, GO, VI, WH, WD, dly } from './Stage'

const terms = [
  { term: 'Sala de operaciones / quirófano', scope: 'El recinto donde se opera (zona blanca)' },
  { term: 'Unidad quirúrgica / bloque quirúrgico', scope: 'Conjunto funcional: quirófanos + preoperatorio + URPA + CEyE + vestidores + lavabos' },
  { term: 'Área quirúrgica', scope: 'Delimitación arquitectónica que incluye las tres zonas de restricción' },
  { term: 'Campo estéril', scope: 'Superficie delimitada por textiles estériles alrededor del sitio operatorio' },
]

/**
 * Cuatro términos que el informe técnico confunde. Van uno sobre
 * otro con su alcance colgando debajo, en escalera: la distinción
 * se ve en el ritmo antes de leerse.
 */
export default function S11b_Terms() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="≠" side="right" size={520} top={140} opacity={0.03} color={GO} />
      <Halo x={1220} y={340} size={760} color="rgba(245,158,11,0.12)" />
      <Halo x={140} y={140} size={560} color="rgba(0,212,255,0.14)" />

      <At l={100} t={92} anim="none">
        <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
          <span style={{ width: 26, height: 2, background: GO, boxShadow: `0 0 10px ${GO}` }} />
          <span className="font-mono" style={{ fontSize: 10.5, color: GO, letterSpacing: '0.26em', textTransform: 'uppercase' }}>
            ⚠️ Términos que NO son sinónimos
          </span>
        </div>
      </At>

      {terms.map((t, i) => (
        <At key={t.term} l={100 + i * 40} t={158 + i * 126} w={1120} d={1 + i * 2} anim="drift">
          <h3
            style={{
              fontSize: 27, color: i === 0 ? CY : WH, margin: '0 0 10px', lineHeight: 1.2,
              fontWeight: i === 0 ? 500 : 400,
              textShadow: i === 0 ? `0 0 34px ${CY}44` : 'none',
            }}
          >
            {t.term}
          </h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
            <span
              className="span-x"
              style={{ width: 34, height: 1, flexShrink: 0, background: i === 0 ? CY : 'rgba(240,249,255,0.28)', transform: 'translateY(-6px)', ...dly(2 + i * 2) }}
            />
            <p style={{ fontSize: 16.5, color: WD, lineHeight: 1.55, margin: 0, fontWeight: 300, maxWidth: 980 }}>
              {t.scope}
            </p>
          </div>
        </At>
      ))}

      <At l={100} t={672} w={1160} d={9}>
        <div style={{ paddingLeft: 20, borderLeft: `2px solid ${VI}` }}>
          <p style={{ fontSize: 15.5, color: WD, margin: 0, lineHeight: 1.65 }}>
            🎙️ Error frecuente en informes técnicos: usar "quirófano" y "bloque quirúrgico" como intercambiables.
          </p>
        </div>
      </At>
    </div>
  )
}
