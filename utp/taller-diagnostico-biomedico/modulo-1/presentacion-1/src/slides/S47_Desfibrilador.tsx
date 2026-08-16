import FamiliaEquipo from './FamiliaEquipo'
import { Hydro, Lunar } from './SlideLayout'

/** 7.6 — Desfibrilador. La batería es crítica por ser equipo de emergencia. */
export default function S47_Desfibrilador() {
  return (
    <FamiliaEquipo
      num="7.6"
      icono="desfibrilador"
      tone="rose"
      nombre={
        <>
          <span>Desfibrilador</span> <Hydro><span>y DEA</span></Hydro>
        </>
      }
      subtitulo={<span>CARGA DE CAPACITOR · DESCARGA CONTROLADA DE ENERGÍA</span>}
      principio={
        <span>
          Carga un capacitor a alta tensión y entrega una descarga controlada de energía, en joules, al miocardio
          para revertir una arritmia. En el DEA, además, analiza el ritmo automáticamente.
        </span>
      }
      criticos={[
        'Circuito de carga y almacenamiento',
        'Capacitor de alta tensión',
        'Circuito de descarga',
        'Control',
        'Batería',
        'Análisis de ritmo (DEA)',
      ]}
      fallas={[
        <>Energía entregada fuera de tolerancia.</>,
        <>
          Batería degradada: <Lunar>crítico por tratarse de equipo de emergencia</Lunar>.
        </>,
        <>Tiempos de carga excesivos.</>,
        <>Palas o parches deteriorados.</>,
      ]}
      verificacion={[
        <>Analizador de desfibrilador para energía entregada y tiempos de carga.</>,
        <>Prueba de autonomía y estado de la batería.</>,
        <>
          Seguridad: el capacitor almacena energía peligrosa aun desconectado. <Lunar>Descargar antes de
          intervenir.</Lunar>
        </>,
      ]}
    />
  )
}
