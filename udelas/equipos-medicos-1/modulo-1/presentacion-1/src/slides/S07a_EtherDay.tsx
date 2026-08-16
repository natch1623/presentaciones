import { At, Ghost, Halo, Photo, Eyebrow, Quote, CY, CYM, WH, WD, dly } from './Stage'
import etherDomePhoto from '../assets/photos/ether-dome-daguerreotype.png'

/**
 * El Ether Day. El daguerrotipo ocupa la derecha entera a sangre y
 * la cita se le monta encima por el borde disuelto: la lámina es la
 * escena de 1846, no una ficha sobre ella.
 */
export default function S07a_EtherDay() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Photo
        src={etherDomePhoto}
        alt="Daguerrotipo histórico de una cirugía con éter en el Massachusetts General Hospital, 1846"
        side="right"
        w={880}
        fade="diagonal"
        filter="sepia(0.42) saturate(0.7) brightness(0.6) contrast(1.12)"
        d={1}
        credit="Daguerrotipo de una cirugía con éter en el MGH, 1846 · Southworth & Hawes — dominio público"
      />

      <Ghost text="1846" side="left" size={300} top={520} opacity={0.03} font="mono" />
      <Halo x={160} y={280} size={760} color="rgba(0,212,255,0.16)" />

      <At l={100} t={128} anim="none" z={4}>
        <Eyebrow d={0}>16 de octubre de 1846</Eyebrow>
      </At>

      <At l={94} t={166} w={620} anim="none" z={4}>
        <h2
          className="font-display wipe"
          style={{ fontSize: 86, lineHeight: 0.98, color: WH, margin: 0, fontWeight: 400, ...dly(1) }}
        >
          El <span style={{ color: CY, textShadow: `0 0 60px ${CY}55` }}>"Ether Day"</span>
        </h2>
      </At>

      <At l={100} t={294} d={4} z={4}>
        <p style={{ fontSize: 19, color: WD, margin: 0, fontWeight: 300 }}>
          Massachusetts General Hospital, Boston
        </p>
      </At>

      <At l={-60} t={352} w={640} h={1} z={3} anim="none">
        <div
          className="span-x"
          style={{ width: '100%', height: 1, background: `linear-gradient(90deg, transparent, ${CY}66)`, ...dly(5) }}
        />
      </At>

      <At l={98} t={392} w={640} anim="none" z={4}>
        <Quote cite="— John Collins Warren, cirujano" size={46} d={5} w={600}>
          "Gentlemen, this is no humbug."
        </Quote>
      </At>

      <At l={100} t={608} w={520} d={9} z={4}>
        <p style={{ fontSize: 15, color: 'rgba(240,249,255,0.5)', lineHeight: 1.65, margin: 0 }}>
          El anfiteatro donde ocurrió se conserva como el{' '}
          <strong style={{ color: CYM, fontWeight: 600 }}>"Ether Dome"</strong>.
        </p>
      </At>
    </div>
  )
}
