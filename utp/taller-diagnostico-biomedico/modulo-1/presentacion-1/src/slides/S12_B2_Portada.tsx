import { BlockCover, Hydro } from './SlideLayout'

/** Portadilla del Bloque 2 — el modelo de bloques funcionales. */
export default function S12_B2_Portada() {
  return (
    <BlockCover
      block="Bloque 02"
      clase="Clase 1 · Teoría"
      tone="hydro"
      title={
        <>
          <span>El modelo de</span>
          <br />
          <span>bloques funcionales</span>
        </>
      }
      lead={
        <span>
          La idea central de todo el taller: dejar de ver el equipo como una caja negra y verlo como una cadena de
          bloques por la que fluye la señal, desde la variable fisiológica hasta la salida al usuario.
        </span>
      }
      points={[
        <>
          Cromwell y Webster: casi <Hydro>cualquier instrumento biomédico</Hydro> responde al mismo esquema
        </>,
        <>Seis etapas en serie, más alarmas y seguridad como bloque transversal</>,
        <>Diagnosticar es localizar en qué bloque se interrumpe o distorsiona el flujo</>,
        <>La descomposición que hace posible la división a la mitad del bloque 4</>,
      ]}
    />
  )
}
