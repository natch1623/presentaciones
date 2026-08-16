import FamiliaEquipo from './FamiliaEquipo'
import { Hydro, Lunar } from './SlideLayout'

/** 7.5 — Electrobisturí (unidad electroquirúrgica). */
export default function S46_Electrobisturi() {
  return (
    <FamiliaEquipo
      num="7.5"
      icono="electrobisturi"
      tone="rose"
      nombre={
        <>
          <span>Electrobisturí</span> <Hydro><span>(unidad electroquirúrgica)</span></Hydro>
        </>
      }
      subtitulo={<span>CORRIENTE DE RADIOFRECUENCIA · CORTE Y COAGULACIÓN</span>}
      principio={
        <span>
          Aplica corriente de radiofrecuencia de alta densidad en el electrodo activo para cortar o coagular tejido.
          La corriente retorna por un electrodo dispersivo de gran área cuya integridad de contacto es vital.
        </span>
      }
      criticos={[
        'Generador de RF',
        'Electrodo activo',
        'Electrodo de retorno',
        'Monitor de calidad de contacto',
        'Control y alarmas',
      ]}
      fallas={[
        <>Potencia de salida fuera de tolerancia.</>,
        <>
          Fallas en el sistema de monitoreo del electrodo de retorno: <Lunar>riesgo de quemadura al paciente</Lunar>.
        </>,
        <>Cables y conectores deteriorados.</>,
      ]}
      verificacion={[
        <>Analizador de electrocirugía para la potencia de salida.</>,
        <>Prueba del monitor del electrodo de retorno.</>,
        <>Inspección de cables y conectores del electrodo activo.</>,
      ]}
    />
  )
}
