import { At, Ghost, Halo, Title, Ac, CY, WH, WF, dly } from './Stage'

const reqs = [
  { el: 'Superficie', req: 'Mínimo ~36 m²; 42–60 m² para cardiovascular, ortopédica o robótica', reason: 'Espacio para equipos, circulación estéril y personal' },
  { el: 'Altura libre', req: '≥ 3.00 m', reason: 'Alojar lámpara, brazos pendulares y difusores de aire' },
  { el: 'Puertas', req: 'Correderas/deslizantes, nunca abatibles; con visor', reason: 'Las abatibles provocan fluctuaciones de aire y riesgo de contaminación' },
  { el: 'Paredes y techo', req: 'Lisos, duros, impermeables, no porosos, juntas selladas', reason: 'Facilitar limpieza terminal y evitar reservorios microbianos' },
]

/**
 * Requisitos de zona blanca. El elemento cuelga en el margen, el
 * requisito corre en cuerpo grande y la razón técnica baja en gris:
 * tres columnas de información sin una sola celda dibujada.
 */
export function ReqRow({
  r, i, indent, top, gap = 128, d,
}: {
  r: { el: string; req: string; reason: string }
  i: number; indent: number; top: number; gap?: number; d: number
}) {
  return (
    <At l={indent} t={top + i * gap} w={1310 - indent} d={d} anim="drift">
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 26 }}>
        <span
          className="font-mono"
          style={{ width: 152, textAlign: 'right', flexShrink: 0, fontSize: 12.5, color: CY, opacity: 0.85, letterSpacing: '0.05em' }}
        >
          {r.el}
        </span>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 21, color: WH, lineHeight: 1.4, margin: '0 0 9px', fontWeight: 300, maxWidth: 960 }}>
            {r.req}
          </p>
          <p style={{ fontSize: 13.5, color: WF, lineHeight: 1.5, margin: 0, maxWidth: 920 }}>
            {r.reason}
          </p>
        </div>
      </div>
      <div
        className="span-x"
        style={{
          width: 820, height: 1, marginTop: 22, marginLeft: 178,
          background: 'linear-gradient(90deg, rgba(0,212,255,0.16), transparent)',
          ...dly(d + 1),
        }}
      />
    </At>
  )
}

export default function S13a_ArchitectureA() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="36 m²" side="right" size={230} top={80} opacity={0.028} font="mono" />
      <Halo x={1280} y={280} size={700} color="rgba(0,212,255,0.14)" />
      <Halo x={120} y={700} size={620} color="rgba(37,99,235,0.16)" />

      <At l={96} t={94} w={880} anim="none">
        <Title size={48} d={0}>
          Requisitos arquitectónicos de la <Ac>Zona Blanca</Ac>
        </Title>
      </At>

      {reqs.map((r, i) => (
        <ReqRow key={r.el} r={r} i={i} indent={100 + i * 22} top={232} d={2 + i} />
      ))}
    </div>
  )
}
