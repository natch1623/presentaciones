import { BlockCover, Hydro, Lunar } from './SlideLayout'

/** Portadilla del Bloque 5 — instrumentos de prueba, introducción teórica. */
export default function S29_B5_Portada() {
  return (
    <BlockCover
      block="Bloque 05"
      clase="Clase 1 · Teoría"
      tone="hydro"
      title={
        <>
          <span>Instrumentos de prueba:</span>
          <br />
          <span>qué mide cada uno</span>
        </>
      }
      lead={
        <span>
          Base conceptual previa al manejo práctico de la Clase 3: no cómo se aprietan los botones, sino qué
          magnitud entrega cada instrumento y cómo se interpreta su lectura.
        </span>
      }
      points={[
        <>
          Multímetro y osciloscopio: <Hydro>magnitudes de estado</Hydro> frente a señales dinámicas
        </>,
        <>Analizador de seguridad eléctrica y fuente de poder variable</>,
        <>Simuladores de paciente: la entrada de referencia del banco</>,
        <>
          Regla de oro sobre equipo energizado: <Lunar>la seguridad primero</Lunar>
        </>,
      ]}
    />
  )
}
