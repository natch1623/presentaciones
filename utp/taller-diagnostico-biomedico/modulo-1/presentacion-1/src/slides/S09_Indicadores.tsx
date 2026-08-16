import { SlideLayout, SlideTag, SlideTitle, Glass, Formula, Hydro, Lunar, Callout, Divider } from './SlideLayout'
import { Moon, Ripples } from '../components/Celestial'

/**
 * MTBF, MTTR y disponibilidad. Las dos ecuaciones que convierten el
 * diagnóstico en un indicador de gestión —y que explican por qué
 * diagnosticar rápido y bien vale dinero para el servicio clínico—.
 */
export default function S09_Indicadores() {
  return (
    <SlideLayout>
      <SlideTag tone="violet">
        <span>Bloque 1 · 1.2</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>De la tasa de fallas a</span> <Hydro><span>la disponibilidad</span></Hydro>
      </SlideTitle>

      <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, margin: '0 0 6px', maxWidth: 940 }}>
        <span>
          En la región de tasa constante —la vida útil— el tiempo medio entre fallas es el recíproco de λ, y la
          disponibilidad combina ese tiempo con lo que tarda la reparación.
        </span>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26, flex: 1, minHeight: 0, alignItems: 'center' }}>
        <Glass tone="hydro" ornament style={{ padding: '10px 18px 18px' }}>
          <Formula
            tone="cyan"
            size={34}
            note={
              <span>
                λ es la tasa de fallas en la región de vida útil. Un MTBF alto significa que el equipo pasa mucho
                tiempo sin fallar.
              </span>
            }
          >
            <span>MTBF = 1 / λ</span>
          </Formula>

          <Divider style={{ margin: '6px 0 10px' }} />

          <Formula
            tone="violet"
            size={30}
            note={
              <span>
                La disponibilidad es la fracción del tiempo en que el equipo está apto para uso. MTTR es el tiempo
                medio de reparación.
              </span>
            }
          >
            <span>A = MTBF / (MTBF + MTTR)</span>
          </Formula>
        </Glass>

        {/* La lectura del taller, sobre un dominio de ondas */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 16 }}>
          <div
            aria-hidden
            style={{ position: 'absolute', right: -30, top: -20, opacity: 0.5, pointerEvents: 'none' }}
          >
            <Ripples size={260} tone="hydro" count={3} />
          </div>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
            <Moon size={54} phase="crescent" tone="hydro" />
            <p className="font-display" style={{ fontSize: 26, color: 'var(--moon)', margin: 0, lineHeight: 1.25 }}>
              <span>Un diagnóstico certero baja el MTTR</span>
            </p>
          </div>

          <p style={{ position: 'relative', fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.75, margin: 0 }}>
            <span>
              Y si baja el MTTR, sube la disponibilidad del equipo en el servicio. La confiabilidad no depende sólo
              del fabricante: depende también de la calidad del mantenimiento.
            </span>
          </p>

          <Callout kind="violet" title="Lectura para el taller">
            Reconocer <Lunar>en qué región de la curva</Lunar> está un equipo —por ejemplo, una lámpara de
            fototerapia entrando en desgaste— orienta la decisión entre reparar, calibrar o dar de baja.
          </Callout>
        </div>
      </div>
    </SlideLayout>
  )
}
