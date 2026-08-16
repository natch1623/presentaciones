import { At, Ghost, Halo, Eyebrow, dly } from './Stage'
import { MilestoneRow } from './S09a_TechA'

const milestones = [
  { year: '1953', item: 'Primera cirugía a corazón abierto con bomba de CEC (John Gibbon)', area: 'Cirugía cardíaca' },
  { year: '1960s', item: 'Aire ultralimpio de flujo unidireccional para artroplastia (John Charnley)', area: 'HVAC' },
  { year: '1970–80s', item: 'Oximetría de pulso, capnografía, electrocirugía con retorno monitorizado (REM)', area: 'Seguridad' },
  { year: '1987', item: 'Primera colecistectomía laparoscópica con video (Philippe Mouret)', area: 'Mínimamente invasiva' },
]

/** Segunda mitad del siglo. La escalera se cierra hacia adentro. */
export default function S09b_TechB() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="87" side="left" size={470} top={250} opacity={0.026} font="mono" />
      <Halo x={200} y={240} size={700} color="rgba(239,68,68,0.12)" />
      <Halo x={1240} y={640} size={720} color="rgba(6,182,212,0.14)" />

      <At l={100} t={104} anim="none">
        <Eyebrow d={0}>El quirófano se vuelve tecnológico · continuación</Eyebrow>
      </At>

      <At l={0} t={0} w={1440} h={810} z={0} anim="none" style={{ pointerEvents: 'none' }}>
        <div
          className="span-x"
          style={{
            position: 'absolute', left: 260, top: 210, width: 580, height: 1,
            backgroundImage: 'linear-gradient(90deg, rgba(239,68,68,0.45), rgba(6,182,212,0.35), transparent)',
            transform: 'rotate(104deg)', transformOrigin: 'left center', ...dly(2),
          }}
        />
      </At>

      {milestones.map((m, i) => (
        <MilestoneRow key={m.year} m={m} i={i} indent={172 - i * 24} top={196} d={2 + i} />
      ))}
    </div>
  )
}
