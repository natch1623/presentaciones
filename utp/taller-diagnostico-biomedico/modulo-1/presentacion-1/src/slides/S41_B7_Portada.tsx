import { BlockCover, Hydro, Lunar } from './SlideLayout'

/** Portadilla del Bloque 7 — fallas típicas por familia de equipo. */
export default function S41_B7_Portada() {
  return (
    <BlockCover
      block="Bloque 07"
      clase="Clase 2 · Teoría"
      tone="violet"
      title={
        <>
          <span>Fallas típicas</span>
          <br />
          <span>por familia de equipo</span>
        </>
      }
      lead={
        <span>
          Cada familia tiene modos de falla y puntos críticos característicos. Conocerlos permite formular hipótesis
          dirigidas —el paso 3 del método— en lugar de partir de cero.
        </span>
      }
      points={[
        <>
          Siete familias, siempre las mismas cuatro preguntas: <Hydro>principio, bloques críticos, fallas
          frecuentes y verificación</Hydro>
        </>,
        <>Monitor · bomba de infusión · ventilador · fototerapia</>,
        <>Electrobisturí · desfibrilador · incubadora neonatal</>,
        <>
          El patrón transversal: las fallas más peligrosas son las <Lunar>degradadas</Lunar>, y los accesorios
          concentran la mayoría
        </>,
      ]}
    />
  )
}
