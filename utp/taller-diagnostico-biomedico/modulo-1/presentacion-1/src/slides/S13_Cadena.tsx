import { SlideLayout, SlideTag, SlideTitle, Hydro, Callout } from './SlideLayout'
import CadenaFuncional from '../components/CadenaFuncional'

/**
 * La cadena completa. Es la diapositiva que hay que dejar proyectada
 * mientras se desarrolla el bloque: todo lo que sigue —las cinco
 * etapas, las técnicas del bloque 4, las familias del bloque 7— se
 * refiere a este dibujo.
 */
export default function S13_Cadena() {
  return (
    <SlideLayout>
      <SlideTag>
        <span>Bloque 2 · el modelo</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>La señal atraviesa</span> <Hydro><span>una cadena de bloques</span></Hydro>
      </SlideTitle>

      <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.7, margin: '0 0 6px', maxWidth: 960 }}>
        <span>
          Cada etapa recibe algo, lo transforma y lo entrega a la siguiente. Si el flujo se corta o se distorsiona,
          ocurre en un punto concreto de esta cadena —y ese punto se puede encontrar midiendo—.
        </span>
      </p>

      <div style={{ flex: 1, minHeight: 0, display: 'flex', alignItems: 'center' }}>
        <CadenaFuncional activo={-1} />
      </div>

      <Callout kind="violet" title="Por qué el modelo funciona">
        Convierte un problema grande e indefinido —«el equipo falla»— en una serie de preguntas pequeñas y
        verificables: ¿llega alimentación al bloque X?, ¿sale la señal correcta del bloque X? Esa descomposición es
        la base de la técnica de división a la mitad.
      </Callout>
    </SlideLayout>
  )
}
