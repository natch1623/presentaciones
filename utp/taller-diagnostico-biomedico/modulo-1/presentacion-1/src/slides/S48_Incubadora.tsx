import FamiliaEquipo from './FamiliaEquipo'
import { Hydro, Lunar } from './SlideLayout'

/** 7.7 — Incubadora neonatal. */
export default function S48_Incubadora() {
  return (
    <FamiliaEquipo
      num="7.7"
      icono="incubadora"
      tone="cyan"
      nombre={
        <>
          <span>Incubadora</span> <Hydro><span>neonatal</span></Hydro>
        </>
      }
      subtitulo={<span>MICROAMBIENTE TÉRMICO ESTABLE</span>}
      principio={
        <span>
          Mantiene un microambiente térmico estable para el neonato mediante un calefactor, circulación de aire y
          control por sensores de temperatura de aire y de piel, con humidificación.
        </span>
      }
      criticos={[
        'Elemento calefactor',
        'Sensor de temperatura de aire',
        'Sensor de temperatura de piel',
        'Control de temperatura y humedad',
        'Circulación de aire',
        'Alarmas',
      ]}
      fallas={[
        <>
          Sensores de temperatura descalibrados: riesgo de hipotermia o hipertermia.{' '}
          <Lunar>Falla degradada</Lunar>.
        </>,
        <>Ventilador de circulación deteriorado.</>,
        <>Alarmas de temperatura no funcionales.</>,
        <>Fugas en la humidificación.</>,
      ]}
      verificacion={[
        <>Analizador de incubadoras, o termómetros patrón multipunto.</>,
        <>Exactitud y uniformidad de temperatura dentro de la cúpula.</>,
        <>Prueba de alarmas de temperatura.</>,
      ]}
    />
  )
}
