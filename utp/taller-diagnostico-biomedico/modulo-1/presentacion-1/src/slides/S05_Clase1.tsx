import ClaseSeparador from './ClaseSeparador'

/** Separador de la primera clase teórica. */
export default function S05_Clase1() {
  return (
    <ClaseSeparador
      numero="1"
      duracion="3.0 h"
      tone="violet"
      titulo={<span>Del síntoma a la causa raíz</span>}
      bajada={
        <span>
          Antes de tocar un instrumento hay que fijar el vocabulario de la falla, el modelo que la localiza y el
          método que la persigue. Esta sesión construye ese andamiaje completo.
        </span>
      }
      bloques={[
        '01 · Fundamentos',
        '02 · Bloques funcionales',
        '03 · Metodología',
        '04 · Técnicas',
        '05 · Instrumentos',
      ]}
    />
  )
}
