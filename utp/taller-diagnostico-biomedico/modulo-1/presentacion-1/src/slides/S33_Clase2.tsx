import ClaseSeparador from './ClaseSeparador'

/** Separador de la segunda clase teórica. */
export default function S33_Clase2() {
  return (
    <ClaseSeparador
      numero="2"
      duracion="3.0 h"
      tone="hydro"
      titulo={<span>La condición que no se negocia</span>}
      bajada={
        <span>
          Un equipo puede funcionar perfectamente y ser eléctricamente inseguro. Esta sesión añade el criterio de
          seguridad, el catálogo de fallas por familia y el registro que cierra el ciclo.
        </span>
      }
      bloques={['06 · Seguridad eléctrica IEC 60601‑1', '07 · Fallas por familia', '08 · Documentación y cierre']}
    />
  )
}
