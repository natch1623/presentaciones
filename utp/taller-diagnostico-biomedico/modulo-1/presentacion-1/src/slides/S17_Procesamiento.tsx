import EtapaCadena from './EtapaCadena'
import { Glass, Formula, Hydro, Lunar, Bullet, Callout } from './SlideLayout'

/** Etapa 4 — procesamiento. Digitaliza y calcula; también se autodiagnostica. */
export default function S17_Procesamiento() {
  return (
    <EtapaCadena
      num="2.4"
      activo={3}
      titulo={
        <>
          <span>Procesamiento:</span> <Hydro><span>digitalizar sin perder información</span></Hydro>
        </>
      }
      principio={
        <span>
          Digitaliza la señal con un convertidor analógico‑digital y ejecuta los algoritmos: frecuencia cardíaca,
          saturación, detección de arritmias, lógica de alarma. Dos parámetros gobiernan la fidelidad —la resolución
          en bits y la frecuencia de muestreo—.
        </span>
      }
      fallas={[
        <>Tarjeta lógica dañada.</>,
        <>Memoria corrupta.</>,
        <>Firmware que requiere actualización.</>,
        <>ADC defectuoso.</>,
      ]}
    >
      <Glass tone="cyan" ornament style={{ padding: '8px 18px 16px' }}>
        <Formula
          tone="cyan"
          size={30}
          note={
            <span>
              El teorema de muestreo de Nyquist: hay que muestrear al menos al doble de la frecuencia máxima de la
              señal para no perder información.
            </span>
          }
        >
          <span>fs ≥ 2 · f máx</span>
        </Formula>
      </Glass>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Bullet tone="violet">
          El «cerebro» es un microcontrolador o DSP que corre firmware.
        </Bullet>
        <Bullet tone="violet">
          Muchas fallas de esta etapa se manifiestan como <Lunar>códigos de error</Lunar> generados por el
          autodiagnóstico interno.
        </Bullet>
      </div>

      <Callout kind="hydro" title="Regla práctica">
        Antes de medir, leer el código que muestre el propio equipo y consultar la tabla del manual de servicio.
      </Callout>
    </EtapaCadena>
  )
}
