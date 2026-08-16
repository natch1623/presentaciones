import { At, Ghost, Halo, Eyebrow, CY, CYM, WH, WD, dly } from './Stage'

const conditions = [
  {
    label: 'Dónde se operaba',
    text: 'Anfiteatros públicos, mesas de cocina, campos de batalla o el domicilio del paciente.',
  },
  {
    label: 'Sin asepsia ni antisepsia',
    text: 'El cirujano operaba con levita de calle y usaba el mismo instrumental entre pacientes sin limpieza alguna.',
  },
  {
    label: 'Limitaciones extremas',
    text: 'El dolor y la hemorragia limitaban la duración. Las amputaciones se medían en segundos.',
  },
  {
    label: 'Mortalidad postoperatoria',
    text: 'La "gangrena de hospital", sepsis y fiebre puerperal superaban el 40–50% en cirugía mayor.',
  },
]

/**
 * Las condiciones de las que salió el quirófano, y la idea que
 * ordena todo el tema. El rótulo de cada condición cuelga sobre su
 * texto en lugar de encerrarlo: la jerarquía la da el color y el
 * cuerpo, no un recuadro.
 */
export default function S05b_Origins() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="40–50%" side="right" size={210} top={54} opacity={0.03} font="mono" />
      <Halo x={1270} y={140} size={640} color="rgba(239,68,68,0.12)" />
      <Halo x={120} y={640} size={700} color="rgba(0,212,255,0.13)" />

      <At l={100} t={82} anim="none">
        <Eyebrow d={0}>El quirófano antes del quirófano</Eyebrow>
      </At>

      {conditions.map((c, i) => (
        <At key={c.label} l={100 + i * 34} t={140 + i * 116} w={980} d={1 + i} anim="drift">
          <p
            className="font-mono"
            style={{ fontSize: 10.5, color: CYM, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 10px' }}
          >
            {c.label}
          </p>
          <p style={{ fontSize: 20, color: WD, lineHeight: 1.55, margin: 0, fontWeight: 300, maxWidth: 900 }}>
            {c.text}
          </p>
        </At>
      ))}

      <At l={-60} t={604} w={560} h={2} z={1} anim="none">
        <div
          className="span-x"
          style={{ width: '100%', height: 2, background: `linear-gradient(90deg, transparent, ${CY})`, boxShadow: `0 0 16px ${CY}66`, ...dly(6) }}
        />
      </At>

      <At l={100} t={640} w={1220} d={7}>
        <p style={{ fontSize: 25, color: WH, lineHeight: 1.55, margin: 0, fontWeight: 300 }}>
          <span className="font-mono" style={{ fontSize: 12, color: CY, letterSpacing: '0.2em', textTransform: 'uppercase', marginRight: 14 }}>
            Idea clave
          </span>
          El quirófano moderno no nació de la arquitectura, sino de la necesidad de controlar tres enemigos:{' '}
          <strong style={{ color: CY, fontWeight: 600 }}>el dolor</strong>,{' '}
          <strong style={{ color: CY, fontWeight: 600 }}>la infección</strong> y{' '}
          <strong style={{ color: CY, fontWeight: 600 }}>la hemorragia</strong>.
        </p>
      </At>
    </div>
  )
}
