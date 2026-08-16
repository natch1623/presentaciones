import { At, Ghost, Halo, Title, Ac, CY, CYM, WD, dly } from './Stage'

const reqs = [
  { label: 'Categoría 1 (NFPA 99)', text: 'La falla del equipo o del sistema causaría daño grave o muerte al paciente.' },
  { label: 'Sistema de Potencia Aislada (IT)', text: 'Con monitor de aislamiento de línea (LIM) o protección GFCI. Ubicación de procedimiento húmedo.' },
  { label: 'Sistema Eléctrico Esencial', text: 'Transferencia a generador en ≤10s. Equipos críticos con UPS adicional.' },
  { label: 'Equipotencialización', text: 'Todas las masas metálicas se unen a barra equipotencial única para eliminar diferencias de potencial.' },
]

/**
 * Los cuatro requisitos eléctricos. Cada rótulo cuelga sobre su
 * explicación y la escalera avanza hacia adentro; una barra
 * vertical de acento marca el bloque sin cerrarlo por los cuatro
 * lados.
 */
export default function S18a_Electrical() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="10s" side="right" size={380} top={420} opacity={0.028} font="mono" />
      <Halo x={1260} y={300} size={720} color="rgba(0,212,255,0.14)" />
      <Halo x={140} y={680} size={620} color="rgba(37,99,235,0.18)" />

      <At l={96} t={96} w={820} anim="none">
        <Title size={52} d={0}>
          Seguridad <Ac>Eléctrica</Ac> del quirófano
        </Title>
      </At>

      {reqs.map((r, i) => (
        <At key={r.label} l={100 + i * 38} t={230 + i * 132} w={1100} d={2 + i * 2} anim="drift">
          <p
            className="font-mono"
            style={{ fontSize: 11, color: CYM, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 12px' }}
          >
            {r.label}
          </p>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18 }}>
            <span
              className="span-y"
              style={{ width: 2, height: 54, flexShrink: 0, background: `linear-gradient(180deg, ${CY}, transparent)`, ...dly(3 + i * 2) }}
            />
            <p style={{ fontSize: 20, color: WD, lineHeight: 1.58, margin: 0, fontWeight: 300, maxWidth: 960 }}>
              {r.text}
            </p>
          </div>
        </At>
      ))}
    </div>
  )
}
