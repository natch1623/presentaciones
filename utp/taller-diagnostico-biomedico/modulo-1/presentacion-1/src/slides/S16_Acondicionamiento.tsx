import EtapaCadena from './EtapaCadena'
import { Glass, Formula, Hydro, Lunar, Bullet } from './SlideLayout'

/**
 * Etapa 3 — acondicionamiento. Amplifica, filtra y aísla.
 *
 * Es la etapa más "biomédica" de la cadena: el aislamiento del
 * paciente no existe en electrónica común y define la parte aplicada
 * flotante que se mide en el bloque de seguridad.
 */
export default function S16_Acondicionamiento() {
  return (
    <EtapaCadena
      num="2.3"
      activo={2}
      titulo={
        <>
          <span>Acondicionamiento:</span> <Hydro><span>amplificar, filtrar y aislar</span></Hydro>
        </>
      }
      principio={
        <span>
          El corazón de esta etapa es el amplificador de instrumentación, elegido por su alta impedancia de entrada
          y su elevado rechazo al modo común, que suprime la interferencia de 60 Hz de la red —la que aparece por
          igual en ambos electrodos—.
        </span>
      }
      fallas={[
        <>Amplificador dañado.</>,
        <>Filtro deteriorado que deja pasar ruido.</>,
        <>
          <Lunar>Aislamiento comprometido</Lunar>: además de la falla, es un riesgo eléctrico.
        </>,
        <>Saturación por offset de electrodos.</>,
      ]}
    >
      <Glass tone="cyan" ornament style={{ padding: '8px 18px 16px' }}>
        <Formula
          tone="cyan"
          size={26}
          note={
            <span>
              Ad es la ganancia diferencial —la deseada— y Amc la ganancia de modo común, la parásita. En equipo de
              ECG el CMRR supera típicamente los 100 dB.
            </span>
          }
        >
          <span>CMRR (dB) = 20 · log₁₀ ( Ad / Amc )</span>
        </Formula>
      </Glass>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <Bullet tone="violet">
          La <Lunar>barrera de aislamiento</Lunar> —óptica o capacitiva— impide que corrientes peligrosas alcancen
          al paciente.
        </Bullet>
        <Bullet tone="violet">
          Esa barrera es la que define la parte aplicada «flotante»: exactamente lo que el bloque 6 clasifica como
          tipo BF o CF.
        </Bullet>
      </div>
    </EtapaCadena>
  )
}
