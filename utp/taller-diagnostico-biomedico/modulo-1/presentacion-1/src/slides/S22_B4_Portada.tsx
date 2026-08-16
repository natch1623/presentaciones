import { BlockCover, Hydro } from './SlideLayout'

/** Portadilla del Bloque 4 — técnicas de diagnóstico y árboles de decisión. */
export default function S22_B4_Portada() {
  return (
    <BlockCover
      block="Bloque 04"
      clase="Clase 1 · Teoría"
      tone="hydro"
      title={
        <>
          <span>Técnicas de diagnóstico</span>
          <br />
          <span>y árboles de decisión</span>
        </>
      }
      lead={
        <span>
          Existen técnicas estructuradas para localizar el bloque fallado con el mínimo número de mediciones. Floyd
          las presenta para circuitos; aquí se generalizan a la cadena funcional del equipo biomédico.
        </span>
      }
      points={[
        <>
          División a la mitad: una <Hydro>búsqueda binaria</Hydro> sobre la cadena
        </>,
        <>Rastreo de señal, sustitución y bracketing</>,
        <>Cuándo conviene cada una, y qué limita a cada una</>,
        <>Árboles de decisión y tablas de códigos de error del fabricante</>,
      ]}
    />
  )
}
