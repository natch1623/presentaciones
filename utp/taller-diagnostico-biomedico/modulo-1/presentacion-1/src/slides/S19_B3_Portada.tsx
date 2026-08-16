import { BlockCover, Hydro, Lunar } from './SlideLayout'

/** Portadilla del Bloque 3 — metodología del diagnóstico sistemático. */
export default function S19_B3_Portada() {
  return (
    <BlockCover
      block="Bloque 03"
      clase="Clase 1 · Teoría"
      tone="violet"
      title={
        <>
          <span>Metodología del</span>
          <br />
          <span>diagnóstico sistemático</span>
        </>
      }
      lead={
        <span>
          Floyd formaliza el diagnóstico como un procedimiento ordenado —análisis, planificación, medición—. Aquí se
          adapta al equipo biomédico en siete pasos.
        </span>
      }
      points={[
        <>
          La disciplina de seguirlos <Hydro>en orden</Hydro> separa al técnico que diagnostica del que cambia piezas
          hasta que funciona
        </>,
        <>Cada paso produce una decisión, no una sensación</>,
        <>
          El método no termina en la reparación: termina en la <Lunar>verificación y el registro</Lunar>
        </>,
      ]}
    />
  )
}
