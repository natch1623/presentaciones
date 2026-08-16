import { At, Ghost, Halo, Title, Ac, CY, CYM, VI, WD, WF, dly } from './Stage'
import dissOutlet from '../assets/connectors/diss-outlet.png'
import dissConnector from '../assets/connectors/diss-connector.png'
import chemetronMale from '../assets/connectors/chemetron-male.png'
import chemetronFemale from '../assets/connectors/chemetron-female.png'

/**
 * Las piezas van sueltas sobre el fondo, con su propia sombra y su
 * halo: un conector fotografiado sobre negro no necesita un cuadro
 * gris alrededor para leerse, y el cuadro es justamente lo que
 * convertía esta lámina en una galería de fichas.
 */
export function Pieces({
  images, size, color, d,
}: {
  images: { src: string; alt: string }[]; size: number; color: string; d: number
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: size * 0.14 }}>
      {images.map((img, i) => (
        <div key={img.alt} style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
          <div
            style={{
              position: 'absolute', inset: '-18%', borderRadius: '50%',
              background: `radial-gradient(circle, ${color}22 0%, transparent 66%)`,
            }}
          />
          <img
            src={img.src}
            alt={img.alt}
            className="bloom"
            style={{
              position: 'relative', width: '100%', height: '100%', objectFit: 'contain',
              filter: `drop-shadow(0 10px 22px rgba(0,0,0,0.6)) drop-shadow(0 0 16px ${color}55)`,
              ...dly(d + i),
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default function S17a_ConnectorsA() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="DISS" side="right" size={230} top={-6} opacity={0.026} />
      <Halo x={280} y={480} size={800} color="rgba(0,212,255,0.16)" />
      <Halo x={1040} y={560} size={640} color="rgba(167,139,250,0.14)" />

      <At l={96} t={72} w={940} anim="none">
        <Title size={44} d={0}>
          Conectores de gases: <Ac>tres sistemas, cero intercambio</Ac>
        </Title>
      </At>

      <At l={100} t={152} w={900} d={1}>
        <p style={{ fontSize: 15.5, color: WF, margin: 0, lineHeight: 1.6 }}>
          La seguridad no depende del color de la etiqueta, sino de que el acople sea{' '}
          <strong style={{ color: CYM, fontWeight: 600 }}>físicamente imposible de conectar al gas equivocado</strong>.
        </p>
      </At>

      {/* DISS — el dominante */}
      <At l={100} t={228} w={480} d={2} anim="drift">
        <h3 className="font-display" style={{ fontSize: 40, color: CY, margin: 0, lineHeight: 1, textShadow: `0 0 40px ${CY}55` }}>
          DISS
        </h3>
        <p className="font-mono" style={{ fontSize: 10, color: WF, margin: '10px 0 4px', letterSpacing: '0.14em' }}>
          Diameter Index Safety System
        </p>
        <p className="font-mono" style={{ fontSize: 10.5, color: CY, margin: 0, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
          Roscado
        </p>
      </At>

      <At l={98} t={348} d={3} anim="none">
        <Pieces
          images={[
            { src: dissOutlet, alt: 'Toma de pared DISS de oxígeno' },
            { src: dissConnector, alt: 'Conector roscado DISS' },
          ]}
          size={158}
          color={CY}
          d={3}
        />
      </At>

      <At l={100} t={546} w={400} d={5}>
        <p style={{ fontSize: 14.5, color: WD, lineHeight: 1.62, margin: '0 0 16px', fontWeight: 300 }}>
          Cada gas tiene un diámetro y paso de rosca distintos e incompatibles entre sí. Se usa en tomas de
          techo/columna, mangueras de alta presión y equipos portátiles.
        </p>
        <div
          className="span-x"
          style={{ width: 200, height: 1, background: `linear-gradient(90deg, ${CY}88, transparent)`, marginBottom: 12, ...dly(6) }}
        />
        <p className="font-mono" style={{ fontSize: 9.5, color: CY, margin: 0, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
          Columnas, brazos pendulares, mangueras a equipos
        </p>
      </At>

      {/* Chemetron — medio escalón abajo */}
      <At l={780} t={310} w={440} d={6} anim="drift">
        <h3 className="font-display" style={{ fontSize: 30, color: VI, margin: 0, lineHeight: 1, textShadow: `0 0 32px ${VI}55` }}>
          Chemetron
        </h3>
        <p className="font-mono" style={{ fontSize: 10, color: WF, margin: '9px 0 4px', letterSpacing: '0.14em' }}>
          Acople rápido tipo Chemetron
        </p>
        <p className="font-mono" style={{ fontSize: 10, color: VI, margin: 0, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
          Quick-connect
        </p>
      </At>

      <At l={778} t={412} d={7} anim="none">
        <Pieces
          images={[
            { src: chemetronMale, alt: 'Acople macho Chemetron' },
            { src: chemetronFemale, alt: 'Acople hembra Chemetron' },
          ]}
          size={118}
          color={VI}
          d={7}
        />
      </At>

      <At l={780} t={562} w={430} d={8}>
        <p style={{ fontSize: 13.5, color: WD, lineHeight: 1.6, margin: '0 0 14px', fontWeight: 300 }}>
          Conexión de empuje (push-to-connect) sin rosca; cada gas tiene una geometría de pines y cuerpo única.
          Muy común en tomas de pared en EE. UU. y hospitales con equipos de ese mercado.
        </p>
        <div
          className="span-x"
          style={{ width: 170, height: 1, background: `linear-gradient(90deg, ${VI}88, transparent)`, marginBottom: 11, ...dly(9) }}
        />
        <p className="font-mono" style={{ fontSize: 9.5, color: VI, margin: 0, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
          Tomas de pared, cabeceras de cama, brazos de techo
        </p>
      </At>
    </div>
  )
}
