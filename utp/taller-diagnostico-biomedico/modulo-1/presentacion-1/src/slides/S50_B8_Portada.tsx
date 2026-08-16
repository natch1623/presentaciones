import { BlockCover, Hydro, Lunar } from './SlideLayout'

/** Portadilla del Bloque 8 — documentación, verificación y cierre. */
export default function S50_B8_Portada() {
  return (
    <BlockCover
      block="Bloque 08"
      clase="Clase 2 · Teoría"
      tone="hydro"
      title={
        <>
          <span>Documentación,</span>
          <br />
          <span>verificación y cierre</span>
        </>
      }
      lead={
        <span>
          El diagnóstico no concluye con la reparación, sino con la verificación de que el equipo es funcionalmente
          correcto y seguro, y con el registro que deja trazabilidad.
        </span>
      }
      points={[
        <>
          La OMS subraya que la documentación es <Hydro>parte integral del mantenimiento</Hydro>, no un trámite
          posterior
        </>,
        <>La orden de trabajo y su contenido mínimo</>,
        <>El historial del equipo y los indicadores que alimenta</>,
        <>
          El criterio de <Lunar>equipo apto para uso</Lunar>: las tres condiciones que hay que cumplir
        </>,
      ]}
    />
  )
}
