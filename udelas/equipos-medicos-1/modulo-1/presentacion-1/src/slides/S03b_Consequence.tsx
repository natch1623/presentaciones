import { At, Ghost, Halo, Eyebrow, GO, GOD, WH, WD, dly } from './Stage'

/**
 * La consecuencia. Una sola frase ocupa la escena entera: es el
 * argumento que justifica todo el resto del módulo, y una lámina
 * que dice una sola cosa la dice más fuerte.
 */
export default function S03b_Consequence() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="Falla" side="left" size={330} top={392} opacity={0.03} color={GO} />
      <Halo x={1150} y={250} size={880} color="rgba(245,158,11,0.16)" />
      <Halo x={230} y={700} size={620} color="rgba(109,40,217,0.16)" />

      <At l={100} t={188} anim="none">
        <Eyebrow d={0} color={GO}>Consecuencia para el ingeniero biomédico</Eyebrow>
      </At>

      <At l={96} t={244} w={1160} anim="none">
        <p
          className="font-display wipe"
          style={{ fontSize: 52, lineHeight: 1.22, color: WH, margin: 0, fontWeight: 400, ...dly(1) }}
        >
          En el quirófano, una falla de equipo genera un{' '}
          <span style={{ color: GO, textShadow: `0 0 50px ${GO}55` }}>
            evento adverso con paciente anestesiado y cavidad abierta
          </span>
          .
        </p>
      </At>

      <At l={-80} t={556} w={620} h={2} z={1} anim="none">
        <div
          className="span-x"
          style={{ width: '100%', height: 2, background: `linear-gradient(90deg, transparent, ${GOD})`, boxShadow: `0 0 16px ${GOD}66`, ...dly(5) }}
        />
      </At>

      <At l={96} t={600} w={780} d={6}>
        <p style={{ fontSize: 25, lineHeight: 1.6, color: WD, margin: 0, fontWeight: 300 }}>
          El nivel de exigencia de mantenimiento y verificación es el más alto del hospital.
        </p>
      </At>
    </div>
  )
}
