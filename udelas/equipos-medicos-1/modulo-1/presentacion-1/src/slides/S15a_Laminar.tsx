import { At, Ghost, Halo, Eyebrow, Title, Ac, CY, VI, RE, WD, WF, dly } from './Stage'

const beats = [
  {
    kicker: 'El paradigma clásico — Charnley, 1960s',
    color: CY,
    body: (
      <>
        El flujo laminar/unidireccional reduce las partículas portadoras de microorganismos sobre el campo
        quirúrgico → debería reducir las infecciones del sitio quirúrgico (ISQ).
      </>
    ),
    l: 100, t: 232, w: 620,
  },
  {
    kicker: 'El giro — OMS, 2016–2018',
    color: VI,
    body: (
      <>
        <strong style={{ color: '#c4b5fd', fontWeight: 600 }}>Recomendación condicional contraria:</strong> los
        sistemas de ventilación de flujo laminar{' '}
        <strong style={{ color: RE, fontWeight: 600 }}>no deberían usarse</strong> para reducir el riesgo de ISQ en
        artroplastia total. Datos del registro neozelandés sugieren que podrían <em>incrementar</em> las tasas de infección.
      </>
    ),
    l: 760, t: 336, w: 620,
  },
  {
    kicker: 'La controversia continúa',
    color: 'rgba(240,249,255,0.5)',
    body: (
      <>
        Grupos europeos argumentaron que los datos de registros subestimaban la incidencia de ISQ hasta en un 40%,
        y varios servicios continuaron utilizando flujo laminar.
      </>
    ),
    l: 240, t: 574, w: 700,
  },
]

/**
 * Tres tiempos de una misma discusión, colocados en zigzag: el
 * paradigma arriba a la izquierda, el giro cruzando a la derecha y
 * la controversia volviendo abajo. La lectura hace el mismo
 * recorrido que hizo la evidencia.
 */
export default function S15a_Laminar() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="ISQ" side="right" size={420} top={520} opacity={0.026} />
      <Halo x={240} y={280} size={700} color="rgba(0,212,255,0.14)" />
      <Halo x={1120} y={430} size={720} color="rgba(167,139,250,0.16)" />

      <At l={100} t={72} anim="none">
        <Eyebrow d={0}>Pensamiento crítico</Eyebrow>
      </At>

      <At l={96} t={112} w={840} anim="none">
        <Title size={48} d={1}>
          Mito vs. Evidencia: el <Ac>flujo laminar</Ac>
        </Title>
      </At>

      {/* El zigzag que ata los tres tiempos */}
      <At l={0} t={0} w={1440} h={810} z={0} anim="none" style={{ pointerEvents: 'none' }}>
        <div
          className="span-x"
          style={{
            position: 'absolute', left: 300, top: 300, width: 560, height: 1,
            backgroundImage: `linear-gradient(90deg, ${CY}44, ${VI}44)`,
            transform: 'rotate(14deg)', transformOrigin: 'left center', ...dly(4),
          }}
        />
        <div
          className="span-x"
          style={{
            position: 'absolute', left: 1040, top: 500, width: 520, height: 1,
            backgroundImage: `linear-gradient(90deg, ${VI}44, rgba(240,249,255,0.16))`,
            transform: 'rotate(151deg)', transformOrigin: 'left center', ...dly(6),
          }}
        />
      </At>

      {beats.map((b, i) => (
        <At key={b.kicker} l={b.l} t={b.t} w={b.w} d={3 + i * 3} anim={i === 1 ? 'drift-r' : 'drift'}>
          <p
            className="font-mono"
            style={{ fontSize: 10.5, color: b.color, letterSpacing: '0.22em', textTransform: 'uppercase', margin: '0 0 14px' }}
          >
            {b.kicker}
          </p>
          <p style={{ fontSize: i === 2 ? 16 : 17.5, color: i === 2 ? WF : WD, lineHeight: 1.65, margin: 0, fontWeight: 300 }}>
            {b.body}
          </p>
        </At>
      ))}
    </div>
  )
}
