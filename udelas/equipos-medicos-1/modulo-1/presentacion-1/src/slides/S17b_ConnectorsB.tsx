import { At, Ghost, Halo, Eyebrow, GO, RE, RED, WD, WF, dly } from './Stage'
import { Pieces } from './S17a_ConnectorsA'
import ohmedaMale from '../assets/connectors/ohmeda-diamond-male.png'
import ohmedaFemale from '../assets/connectors/ohmeda-diamond-female.png'

export default function S17b_ConnectorsB() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="Ohmeda" side="left" size={190} top={-4} opacity={0.024} />
      <Halo x={340} y={380} size={820} color="rgba(251,191,36,0.14)" />
      <Halo x={1160} y={680} size={660} color="rgba(239,68,68,0.12)" />

      <At l={100} t={96} anim="none">
        <Eyebrow d={0} color={GO}>Conectores de gases · continuación</Eyebrow>
      </At>

      <At l={100} t={158} w={520} d={1} anim="drift">
        <h3 className="font-display" style={{ fontSize: 44, color: GO, margin: 0, lineHeight: 1, textShadow: `0 0 42px ${GO}55` }}>
          Ohmeda / Diamond
        </h3>
        <p className="font-mono" style={{ fontSize: 10.5, color: WF, margin: '12px 0 5px', letterSpacing: '0.14em' }}>
          Acople rápido tipo Ohmeda (Diamond)
        </p>
        <p className="font-mono" style={{ fontSize: 10.5, color: GO, margin: 0, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
          Quick-connect
        </p>
      </At>

      <At l={98} t={296} d={2} anim="none">
        <Pieces
          images={[
            { src: ohmedaMale, alt: 'Acople macho Ohmeda Diamond' },
            { src: ohmedaFemale, alt: 'Acople hembra Ohmeda Diamond' },
          ]}
          size={186}
          color={GO}
          d={2}
        />
      </At>

      <At l={100} t={528} w={470} d={4}>
        <p style={{ fontSize: 15.5, color: WD, lineHeight: 1.62, margin: '0 0 18px', fontWeight: 300 }}>
          Mismo principio de empuje que Chemetron, pero con indexado y forma propios: NO son intercambiables entre
          sí aunque sea el mismo gas. Igual de común en el mercado estadounidense.
        </p>
        <div
          className="span-x"
          style={{ width: 210, height: 1, background: `linear-gradient(90deg, ${GO}88, transparent)`, marginBottom: 12, ...dly(5) }}
        />
        <p className="font-mono" style={{ fontSize: 9.5, color: GO, margin: 0, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
          Tomas de pared, cabeceras de cama, brazos de techo
        </p>
      </At>

      {/* El rol del ingeniero, cruzando a la derecha */}
      <At l={780} t={286} w={580} d={6} anim="drift-r">
        <p className="font-mono" style={{ fontSize: 10.5, color: RE, letterSpacing: '0.22em', textTransform: 'uppercase', margin: '0 0 18px' }}>
          🔧 Rol del ingeniero biomédico
        </p>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20 }}>
          <span
            className="span-y"
            style={{ width: 2, height: 220, flexShrink: 0, background: `linear-gradient(180deg, ${RED}, transparent)`, ...dly(7) }}
          />
          <p style={{ fontSize: 19, color: WD, lineHeight: 1.62, margin: 0, fontWeight: 300 }}>
            Al especificar, instalar o dar mantenimiento a tomas de gases, verificar siempre que el sistema de
            acople (DISS, Chemetron u Ohmeda/Diamond) sea consistente en toda la instalación — mezclar sistemas
            obliga a usar adaptadores, y cada adaptador es un punto adicional de falla.
          </p>
        </div>
      </At>
    </div>
  )
}
