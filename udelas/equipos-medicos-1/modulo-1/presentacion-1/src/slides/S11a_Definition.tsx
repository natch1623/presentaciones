import { At, Ghost, Halo, Eyebrow, CY, WH, dly } from './Stage'

/**
 * La definición operativa. Es la frase que el estudiante tiene que
 * poder reproducir, así que ocupa la lámina entera puesta como
 * texto corrido de gran cuerpo — sin recuadro, porque un recuadro
 * la haría parecer una cita de otro y es la definición del curso.
 */
export default function S11a_Definition() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="Definición" side="right" size={200} top={-4} opacity={0.026} />
      <Halo x={1220} y={180} size={780} color="rgba(0,212,255,0.16)" />
      <Halo x={180} y={720} size={700} color="rgba(37,99,235,0.18)" />

      <At l={100} t={92} anim="none">
        <Eyebrow d={0}>Definición operativa</Eyebrow>
      </At>

      <At l={-70} t={148} w={560} h={2} z={1} anim="none">
        <div
          className="span-x"
          style={{ width: '100%', height: 2, background: `linear-gradient(90deg, transparent, ${CY})`, boxShadow: `0 0 18px ${CY}66`, ...dly(1) }}
        />
      </At>

      <At l={96} t={186} w={1240} anim="none">
        <p
          className="font-display wipe"
          style={{ fontSize: 33, lineHeight: 1.6, color: WH, margin: 0, fontWeight: 400, ...dly(2) }}
        >
          <strong style={{ color: CY, fontWeight: 400, textShadow: `0 0 40px ${CY}44` }}>
            Salón de operaciones (quirófano):
          </strong>{' '}
          ambiente hospitalario de{' '}
          <em>ubicación terminal en la circulación —sin tránsito de paso—</em>, totalmente equipado y de
          acceso restringido, con control activo de las condiciones de{' '}
          <strong style={{ color: CY, fontWeight: 500 }}>
            aire, temperatura, humedad, presión diferencial, iluminación, gases medicinales y energía eléctrica
          </strong>
          , destinado a la ejecución de procedimientos quirúrgicos bajo técnica aséptica y soporte anestésico
          monitorizado.
        </p>
      </At>
    </div>
  )
}
