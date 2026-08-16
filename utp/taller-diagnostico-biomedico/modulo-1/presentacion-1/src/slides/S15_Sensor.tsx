import { SlideLayout, SlideTag, SlideTitle, SpecTable, Hydro, Lunar, Callout } from './SlideLayout'
import CadenaFuncional from '../components/CadenaFuncional'

/**
 * Etapa 2 — sensor / transductor, con la tabla de órdenes de magnitud
 * de las señales fisiológicas.
 *
 * Esta tabla es de las más útiles del taller: saber que un ECG son
 * milivoltios y un EEG microvoltios es lo que permite decir si lo que
 * marca el osciloscopio tiene sentido o no.
 */
export default function S15_Sensor() {
  const SENALES: string[][] = [
    ['ECG (electrocardiograma)', '0,5 – 4 mV', '0,05 – 150 Hz', 'Electrodo Ag/AgCl'],
    ['EEG (electroencefalograma)', '10 – 100 µV', '0,5 – 40 Hz', 'Electrodo de superficie'],
    ['EMG (electromiograma)', '0,1 – 5 mV', '10 Hz – 1 kHz', 'Electrodo de superficie o aguja'],
    ['Presión arterial invasiva', 'según transductor', '0 – 50 Hz', 'Galga extensométrica'],
    ['Temperatura', '—', 'cuasi‑CC', 'Termistor / RTD'],
    ['SpO₂ (pletismografía)', 'señal óptica pequeña', '0 – 20 Hz', 'LED + fotodiodo'],
    ['Flujo respiratorio', '—', '0 – 30 Hz', 'Neumotacógrafo / hilo caliente'],
  ]

  return (
    <SlideLayout>
      <SlideTag>
        <span>Bloque 2 · 2.2</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>Sensor y transductor:</span> <Hydro><span>señales diminutas en medio del ruido</span></Hydro>
      </SlideTitle>

      <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, margin: '0 0 16px', maxWidth: 980 }}>
        <span>
          Convierte la magnitud fisiológica en una señal eléctrica. La dificultad de ingeniería es que estas señales
          son muy pequeñas y de baja frecuencia, inmersas en ruido e interferencia. Conocer sus órdenes de magnitud
          es esencial para saber qué se espera medir en cada punto.
        </span>
      </p>

      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <SpecTable
          head={['Señal / variable', 'Amplitud típica', 'Ancho de banda', 'Transductor habitual']}
          cols="1.5fr 1fr 1fr 1.4fr"
          fontSize={12}
          rows={SENALES}
          toneOf={(r, c) => (c === 1 && (r === 0 || r === 1) ? 'cyan' : undefined)}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'center', marginTop: 12 }}>
        <Callout kind="alert" title="Fallas típicas de la etapa">
          Electrodo o sensor roto o sucio · <Lunar>cable con contacto intermitente</Lunar>, que es la causa número
          uno de artefactos · transductor descalibrado · celda agotada (O₂, SpO₂).
        </Callout>

        <div style={{ height: 78 }}>
          <CadenaFuncional activo={1} variant="mini" />
        </div>
      </div>
    </SlideLayout>
  )
}
