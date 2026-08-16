import { At, Ghost, Halo, Eyebrow, VI, VID, WH, dly } from './Stage'

/**
 * El puente al Tema 2. Nada más que el nombre del próximo tema y la
 * frase que lo justifica — la última lámina tiene que dejar una
 * sola cosa en la cabeza.
 */
export default function S24b_NextTopic() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="02" side="right" size={560} top={140} opacity={0.03} font="mono" color={VI} />
      <Halo x={1020} y={380} size={980} color="rgba(109,40,217,0.26)" />
      <Halo x={180} y={720} size={620} color="rgba(0,212,255,0.14)" />

      {/* Anillos que anuncian la sala siguiente, cortados por el borde */}
      {[520, 760, 1020].map((size, i) => (
        <div
          key={size}
          style={{
            position: 'absolute',
            left: 1040 - size / 2, top: 400 - size / 2,
            width: size, height: size, borderRadius: '50%',
            border: `1px solid rgba(167,139,250,${0.2 - i * 0.05})`,
            animation: `spin-slow ${22 + i * 10}s linear infinite ${i % 2 ? 'reverse' : ''}`,
            pointerEvents: 'none', zIndex: 0,
          }}
        />
      ))}

      <At l={100} t={214} anim="none">
        <Eyebrow d={0} color={VI}>Próximo tema</Eyebrow>
      </At>

      <At l={94} t={258} w={800} anim="none">
        <h2
          className="font-display wipe"
          style={{
            fontSize: 88, lineHeight: 0.98, color: WH, margin: 0, fontWeight: 400,
            textShadow: `0 0 70px ${VI}33`, ...dly(1),
          }}
        >
          Máquina de <span style={{ color: VI, textShadow: `0 0 60px ${VI}66` }}>Anestesia</span>
        </h2>
      </At>

      <At l={-70} t={470} w={660} h={2} z={1} anim="none">
        <div
          className="span-x"
          style={{ width: '100%', height: 2, background: `linear-gradient(90deg, transparent, ${VID}, ${VI})`, boxShadow: `0 0 20px ${VI}66`, ...dly(4) }}
        />
      </At>

      <At l={98} t={514} w={860} d={5}>
        <p
          className="font-display"
          style={{ fontSize: 30, color: VI, fontStyle: 'italic', lineHeight: 1.45, margin: 0, textShadow: `0 0 44px ${VI}44` }}
        >
          "Si el quirófano es el sistema, la máquina de anestesia es el equipo que sostiene la vida mientras el
          cirujano trabaja."
        </p>
      </At>
    </div>
  )
}
