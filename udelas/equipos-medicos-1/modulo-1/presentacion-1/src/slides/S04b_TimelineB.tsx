import { useState } from 'react'
import { At, Ghost, Halo, Eyebrow, CY, VI, WF, dly } from './Stage'
import { EventRow } from './S04a_TimelineA'

/**
 * Segunda mitad: el siglo del equipo. La escalera se invierte —
 * ahora entra desde la derecha— para que las dos mitades de la
 * cronología no se lean como la misma lámina repetida.
 */
const events = [
  { year: '1926', event: 'Electrobisturí (Bovie & Cushing)', impact: 'Quirófano eléctrico', era: 'modern' },
  { year: '1953', event: 'Bomba de circulación extracorpórea', impact: '🫀 Cirugía a corazón abierto (Gibbon)', era: 'modern' },
  { year: '1987', event: 'Colecistectomía laparoscópica', impact: 'Era mínimamente invasiva', era: 'digital' },
  { year: '2000', event: 'Sistema da Vinci — FDA', impact: '🤖 Cirugía robótica', era: 'digital' },
  { year: '2001', event: '"Operación Lindbergh"', impact: 'Telecirugía NY–Estrasburgo', era: 'digital' },
  { year: '2008', event: 'Lista de Verificación OMS', impact: 'Seguridad como sistema', era: 'digital' },
  { year: '2010–hoy', event: 'Quirófano híbrido + IA', impact: 'Sala como plataforma de datos', era: 'future' },
]

export default function S04b_TimelineB() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="hoy" side="left" size={340} top={410} opacity={0.03} />
      <Halo x={180} y={180} size={720} color="rgba(109,40,217,0.2)" />
      <Halo x={1320} y={700} size={620} color="rgba(0,212,255,0.14)" />

      <At l={96} t={74} anim="none">
        <Eyebrow d={0}>El siglo del equipo · continuación</Eyebrow>
      </At>

      <At l={92} t={104} w={1000} anim="none">
        <h2
          className="font-display wipe"
          style={{ fontSize: 44, lineHeight: 1.04, color: '#f0f9ff', margin: 0, fontWeight: 400, ...dly(1) }}
        >
          Del electrobisturí a la <span style={{ color: VI, textShadow: `0 0 38px ${VI}66` }}>sala como plataforma de datos</span>
        </h2>
      </At>

      <At l={0} t={0} w={1440} h={810} z={0} anim="none" style={{ pointerEvents: 'none' }}>
        <div
          className="span-x"
          style={{
            position: 'absolute', left: 1250, top: 176, width: 700, height: 1.5,
            background: `linear-gradient(90deg, ${VI}, rgba(56,189,248,0.6) 55%, ${CY})`,
            boxShadow: `0 0 14px ${VI}55`,
            transform: 'rotate(139deg)', transformOrigin: 'left center', ...dly(2),
          }}
        />
      </At>

      {events.map((e, i) => (
        <EventRow
          key={e.year}
          e={e}
          i={i}
          indent={252 - i * 26}
          top={202}
          gap={80}
          selected={selected === i}
          onSelect={() => setSelected(selected === i ? null : i)}
        />
      ))}
    </div>
  )
}
