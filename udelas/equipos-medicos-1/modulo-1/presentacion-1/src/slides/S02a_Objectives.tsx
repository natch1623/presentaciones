import { At, Ghost, Halo, Photo, Eyebrow, Title, Ac, Lead, CY, CYM, WD, WF, dly } from './Stage'
import modernOrPhoto from '../assets/photos/modern-or-surgery.jpg'

/**
 * Apertura del tema. La foto del quirófano ocupa media escena a
 * sangre y se disuelve hacia la izquierda: el texto no está *al
 * lado* de la imagen, está encima del mismo espacio.
 */
export default function S02a_Objectives() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Photo
        src={modernOrPhoto}
        alt="Equipo quirúrgico operando en un quirófano moderno"
        side="right"
        w={760}
        fade="diagonal"
        d={1}
        credit="Equipo quirúrgico en un quirófano moderno · U.S. Navy — dominio público"
      />

      <Ghost text="Objetivos" side="left" size={230} top={470} opacity={0.028} />
      <Halo x={180} y={300} size={720} color="rgba(37,99,235,0.2)" />

      <At l={100} t={168} d={0} anim="none">
        <Eyebrow d={0}>Tema 1 · Apertura</Eyebrow>
      </At>

      <At l={96} t={210} w={600} anim="none">
        <Title size={78} d={1}>
          Objetivos de <Ac>Aprendizaje</Ac>
        </Title>
      </At>

      <At l={100} t={412} w={480} d={4}>
        <Lead d={0} w={480} size={19}>
          Al finalizar este tema, el estudiante será capaz de:
        </Lead>
      </At>

      {/* La pregunta que abre la clase: no va en una caja, va en el
          cuerpo tipográfico más grande de la lámina después del título */}
      <At l={100} t={498} w={560} d={6}>
        <p className="font-mono" style={{ fontSize: 10.5, color: CYM, letterSpacing: '0.2em', margin: '0 0 16px', textTransform: 'uppercase' }}>
          💡 Pregunta de apertura
        </p>
        <p
          className="font-display"
          style={{
            fontSize: 33, lineHeight: 1.28, color: CY, fontStyle: 'italic', margin: 0,
            textShadow: `0 0 46px ${CY}44`, maxWidth: 540,
          }}
        >
          "¿Qué diferencia a un quirófano de cualquier otro cuarto del hospital?"
        </p>
      </At>

      <At l={-40} t={462} w={620} h={1} z={1} anim="none">
        <div
          className="span-x"
          style={{ width: '100%', height: 1, background: `linear-gradient(90deg, transparent, ${CY}55)`, ...dly(5) }}
        />
      </At>

    </div>
  )
}
