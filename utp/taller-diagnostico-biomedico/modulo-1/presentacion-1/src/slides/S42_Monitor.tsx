import FamiliaEquipo from './FamiliaEquipo'
import { Hydro, Lunar } from './SlideLayout'

/** 7.1 — Monitor de signos vitales. */
export default function S42_Monitor() {
  return (
    <FamiliaEquipo
      num="7.1"
      icono="monitor"
      tone="hydro"
      nombre={
        <>
          <span>Monitor de</span> <Hydro><span>signos vitales</span></Hydro>
        </>
      }
      subtitulo={<span>ECG · SPO₂ · PNI · TEMPERATURA · CAPNOGRAFÍA</span>}
      principio={
        <span>
          Adquiere señales fisiológicas mediante sensores, las acondiciona con amplificación aislada y las procesa
          para mostrar parámetros y disparar alarmas.
        </span>
      }
      criticos={['Sensores y derivaciones', 'Amplificación aislada (CMRR)', 'Procesamiento', 'Display', 'Alarmas']}
      fallas={[
        <>
          Cables y electrodos rotos o con contacto intermitente: <Lunar>causa número 1 de artefactos</Lunar>.
        </>,
        <>Módulos de parámetro dañados: SpO₂, PNI, capnografía.</>,
        <>Ruido de 60 Hz por mala referencia a tierra o filtro deteriorado.</>,
        <>Alarmas mal configuradas o silenciadas.</>,
      ]}
      verificacion={[
        <>Simulador de ECG / SpO₂ / PNI comparando la lectura con el patrón.</>,
        <>Osciloscopio para rastrear la señal por las etapas.</>,
        <>Prueba de alarmas en todos los parámetros activos.</>,
      ]}
    />
  )
}
