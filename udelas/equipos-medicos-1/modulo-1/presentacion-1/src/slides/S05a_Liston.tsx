import { At, Ghost, Halo, Photo, Title, Ac, Label, Stat, VI, WD, WF, dly } from './Stage'
import listonPortrait from '../assets/photos/robert-liston-portrait.jpg'

/**
 * Liston. El retrato ocupa el tercio izquierdo a sangre y la cifra
 * se le monta encima por el borde disuelto: el récord no está *al
 * lado* del cirujano, está sobre él.
 */
export default function S05a_Liston() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Photo
        src={listonPortrait}
        alt="Retrato de Robert Liston, cirujano, 1840"
        side="left"
        w={640}
        fade="diagonal"
        filter="sepia(0.34) saturate(0.8) brightness(0.66) contrast(1.1)"
        d={1}
      />

      <Ghost text="30" side="right" size={430} top={300} opacity={0.03} font="mono" />
      <Halo x={1120} y={420} size={820} color="rgba(167,139,250,0.18)" />

      {/* Pie del retrato, sobre la propia foto */}
      <At l={66} t={620} d={4} z={3}>
        <p
          style={{
            fontSize: 22, color: '#e9d5ff', fontWeight: 600, margin: '0 0 6px',
            textShadow: `0 0 26px ${VI}88`,
          }}
        >
          Robert Liston
        </p>
        <p className="font-mono" style={{ fontSize: 10.5, color: 'rgba(233,213,255,0.62)', margin: 0, letterSpacing: '0.1em' }}>
          1794–1847 · retrato de C. Turner, 1840
        </p>
      </At>

      <At l={764} t={104} w={600} anim="none" z={4}>
        <Title size={50} d={0}>
          Antes de 1846: rapidez como <Ac>única anestesia</Ac>
        </Title>
      </At>

      <At l={-40} t={310} w={860} h={1} z={3} anim="none">
        <div
          className="span-x"
          style={{ width: '100%', height: 1, background: `linear-gradient(90deg, transparent 30%, ${VI}66)`, ...dly(4) }}
        />
      </At>

      <At l={700} t={348} z={5} anim="none">
        <Label d={4} color="#a78bfa" size={10.5}>Récord de velocidad quirúrgica</Label>
      </At>

      <At l={688} t={378} z={5} anim="none">
        <Stat value={'<30'} unit="seg" color="#f0f9ff" size={158} d={5} />
      </At>

      <At l={768} t={588} w={560} d={7} z={5}>
        <p style={{ fontSize: 19, color: WD, lineHeight: 1.62, margin: 0, fontWeight: 300 }}>
          Amputaba un muslo en menos de 30 segundos. La velocidad era la única protección contra el dolor.
        </p>
      </At>

    </div>
  )
}
