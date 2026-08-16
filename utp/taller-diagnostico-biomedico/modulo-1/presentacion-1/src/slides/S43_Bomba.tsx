import FamiliaEquipo from './FamiliaEquipo'
import { Hydro, Lunar } from './SlideLayout'

/** 7.2 — Bomba de infusión. */
export default function S43_Bomba() {
  return (
    <FamiliaEquipo
      num="7.2"
      icono="bomba"
      tone="cyan"
      nombre={
        <>
          <span>Bomba de</span> <Hydro><span>infusión</span></Hydro>
        </>
      }
      subtitulo={<span>PERISTÁLTICA O DE JERINGA</span>}
      principio={
        <span>
          Administra un volumen preciso de líquido en el tiempo mediante un mecanismo accionado por un motor
          controlado, vigilando oclusión y aire en línea.
        </span>
      }
      criticos={[
        'Mecanismo de bombeo (motor, engranajes)',
        'Sensor de oclusión',
        'Sensor de aire en línea',
        'Sensor de gota / caudal',
        'Control y alarmas',
      ]}
      fallas={[
        <>
          Desgaste mecánico que altera la exactitud del caudal: <Lunar>falla degradada peligrosa</Lunar>.
        </>,
        <>Falsas alarmas de oclusión o de aire por sensores sucios o descalibrados.</>,
        <>Error de caudal por set de infusión no compatible.</>,
      ]}
      verificacion={[
        <>Analizador de flujo o de infusión para confirmar exactitud del volumen y del caudal.</>,
        <>Prueba de la alarma de oclusión.</>,
        <>Prueba de la alarma de aire en línea.</>,
      ]}
    />
  )
}
