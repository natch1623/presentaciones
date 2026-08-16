import { BlockCover, Hydro } from './SlideLayout'

/** Portadilla del Bloque 1 — fundamentos, confiabilidad y modos de falla. */
export default function S06_B1_Portada() {
  return (
    <BlockCover
      block="Bloque 01"
      clase="Clase 1 · Teoría"
      tone="violet"
      title={
        <>
          <span>Falla, confiabilidad</span>
          <br />
          <span>y modos de falla</span>
        </>
      }
      lead={
        <span>
          Diagnosticar es razonar sobre cómo y por qué un sistema deja de cumplir su función. Antes de tocar un
          instrumento conviene fijar el vocabulario y los modelos de confiabilidad que sostienen todo el método.
        </span>
      }
      points={[
        <>
          Falla, error y avería: <Hydro>tres conceptos distintos</Hydro>
        </>,
        <>La curva de la bañera y la tasa de fallas λ(t)</>,
        <>MTBF, MTTR y disponibilidad</>,
        <>Clasificación operativa de los modos de falla</>,
        <>El FMEA como marco mental para priorizar</>,
      ]}
    />
  )
}
