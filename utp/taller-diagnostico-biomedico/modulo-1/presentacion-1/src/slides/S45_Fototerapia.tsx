import FamiliaEquipo from './FamiliaEquipo'
import { Hydro, Lunar } from './SlideLayout'

/**
 * 7.4 — Lámpara de fototerapia. Es el caso que se retoma en la Clase 3
 * sobre equipo real (Comen BL70), y el ejemplo canónico de falla
 * degradada: sigue encendida, pero por debajo de la dosis terapéutica.
 */
export default function S45_Fototerapia() {
  return (
    <FamiliaEquipo
      num="7.4"
      icono="fototerapia"
      tone="violet"
      nombre={
        <>
          <span>Lámpara de</span> <Hydro><span>fototerapia</span></Hydro>
        </>
      }
      subtitulo={<span>CASO COMEN BL70 · LUZ AZUL ~450–470 NM</span>}
      principio={
        <span>
          Emite luz azul sobre la piel del neonato para fotoisomerizar la bilirrubina. La eficacia depende de
          mantener la irradiancia terapéutica sobre el área tratada.
        </span>
      }
      criticos={['Fuentes luminosas (LED o tubos)', 'Óptica y filtros', 'Control de tiempo e intensidad', 'Sensor y display']}
      fallas={[
        <>
          Caída de irradiancia por envejecimiento de LED o tubos: <Lunar>sigue encendida pero por debajo de la
          dosis terapéutica</Lunar>.
        </>,
        <>Óptica y filtros sucios o deteriorados, que reducen la fracción útil del espectro azul.</>,
        <>Códigos de error de la unidad.</>,
      ]}
      verificacion={[
        <>
          Radiómetro para medir la irradiancia en <Lunar>µW/cm²/nm</Lunar> y confirmar dosis.
        </>,
        <>Inspección de óptica y filtros.</>,
        <>Lectura de la tabla de códigos de error del manual.</>,
      ]}
    />
  )
}
