import { SlideLayout, SlideTag, SlideTitle, Glass, Hydro, Lunar, Badge } from './SlideLayout'
import { Moon, Spark } from '../components/Celestial'

/**
 * Simuladores de paciente: la entrada de referencia del banco.
 *
 * Se presentan como cuatro dominios porque cada uno pertenece a una
 * familia de equipo distinta —y porque el radiómetro es el que se usa
 * en el caso Comen BL70 de la Clase 3—.
 */
export default function S32_Simuladores() {
  const SIMULADORES = [
    {
      t: 'Simulador de ECG / SpO₂ / PNI',
      tono: 'hydro' as const,
      fase: 'crescent' as const,
      d: 'ECG con frecuencia y amplitud programables, curva pletismográfica con saturación conocida y presiones no invasivas patrón.',
      verifica: 'Monitores de signos vitales',
    },
    {
      t: 'Analizador de flujo de gases',
      tono: 'violet' as const,
      fase: 'eclipse' as const,
      d: 'Mide y verifica volúmenes, flujos, presiones y FiO₂ entregados por el equipo.',
      verifica: 'Ventiladores mecánicos',
    },
    {
      t: 'Radiómetro / fotómetro',
      tono: 'cyan' as const,
      fase: 'full' as const,
      d: 'Mide la irradiancia en µW/cm²/nm de las lámparas de fototerapia para confirmar que la dosis es terapéutica.',
      verifica: 'Caso Comen BL70',
      destacado: true,
    },
    {
      t: 'Analizadores específicos',
      tono: 'rose' as const,
      fase: 'ring' as const,
      d: 'De desfibrilador (energía entregada), de electrocirugía (potencia de RF) y de incubadora (temperatura y uniformidad).',
      verifica: 'Equipo de alto riesgo',
    },
  ]

  return (
    <SlideLayout>
      <SlideTag>
        <span>Bloque 5 · 5.5</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>Simuladores de paciente:</span> <Hydro><span>señales patrón sin paciente real</span></Hydro>
      </SlideTitle>

      <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.7, margin: '0 0 18px', maxWidth: 960 }}>
        <span>
          Generan señales fisiológicas conocidas y repetibles para probar y calibrar. Son la entrada de referencia
          del rastreo de señal: sin ellas no hay con qué comparar la salida.
        </span>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, flex: 1, minHeight: 0 }}>
        {SIMULADORES.map((s, i) => (
          <Glass
            key={s.t}
            tone={s.tono}
            ornament
            style={{
              display: 'flex',
              gap: 15,
              padding: '17px 20px',
              animation: `veilRise 0.82s cubic-bezier(0.22,1,0.36,1) ${0.12 + i * 0.11}s both`,
            }}
          >
            <Moon size={42} phase={s.fase} tone={s.tono} halo={false} style={{ marginTop: 2 }} />

            <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
              <div className="font-display" style={{ fontSize: 21, color: 'var(--moon)', lineHeight: 1.15 }}>
                <span>{s.t}</span>
              </div>

              <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>
                <span>{s.d}</span>
              </p>

              <div style={{ flex: 1 }} />

              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {s.destacado && <Spark size={10} tone="cyan" />}
                <Badge tone={s.tono}>{s.verifica}</Badge>
              </div>
            </div>
          </Glass>
        ))}
      </div>

      <p style={{ fontSize: 12.5, color: 'var(--moon-dim)', lineHeight: 1.65, margin: '16px 0 0', maxWidth: 980 }}>
        <span>El simulador provee una </span>
        <Lunar>
          <span>entrada conocida</span>
        </Lunar>
        <span>; el analizador o el osciloscopio verifican la </span>
        <Lunar>
          <span>salida medida</span>
        </Lunar>
        <span>. Comparar una contra la otra es, en el fondo, toda la técnica de rastreo aplicada al banco.</span>
      </p>
    </SlideLayout>
  )
}
