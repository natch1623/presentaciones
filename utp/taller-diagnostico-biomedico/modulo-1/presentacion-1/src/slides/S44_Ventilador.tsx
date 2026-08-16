import FamiliaEquipo from './FamiliaEquipo'
import { Hydro, Lunar } from './SlideLayout'

/** 7.3 — Ventilador mecánico. */
export default function S44_Ventilador() {
  return (
    <FamiliaEquipo
      num="7.3"
      icono="ventilador"
      tone="hydro"
      nombre={
        <>
          <span>Ventilador</span> <Hydro><span>mecánico</span></Hydro>
        </>
      }
      subtitulo={<span>VOLUMEN · PRESIÓN · FRECUENCIA · FIO₂</span>}
      principio={
        <span>
          Entrega gas al paciente con volumen, presión, frecuencia y FiO₂ controlados, mediante un mezclador,
          válvulas inspiratoria y espiratoria, y realimentación de sensores de flujo y presión.
        </span>
      }
      criticos={[
        'Suministro de gases y mezclador',
        'Válvulas inspiratoria / espiratoria',
        'Sensores de flujo y presión',
        'Sensor de O₂',
        'Control y alarmas',
      ]}
      fallas={[
        <>Fugas en el circuito paciente.</>,
        <>
          Celda de O₂ agotada, con la consiguiente <Lunar>deriva de la FiO₂</Lunar>.
        </>,
        <>Sensores de flujo descalibrados.</>,
        <>Válvulas con respuesta lenta.</>,
        <>Alarmas de presión o volumen mal ajustadas.</>,
      ]}
      verificacion={[
        <>Analizador de flujo de gases para volúmenes, presiones y FiO₂.</>,
        <>Prueba de fugas del circuito.</>,
        <>Prueba de alarmas de presión y de volumen.</>,
      ]}
    />
  )
}
