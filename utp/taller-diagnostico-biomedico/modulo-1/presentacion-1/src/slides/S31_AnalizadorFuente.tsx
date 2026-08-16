import { SlideLayout, SlideTag, SlideTitle, Glass, Hydro, Lunar, Bullet, Chip, Callout } from './SlideLayout'
import { Moon, Ripples } from '../components/Celestial'

/**
 * Analizador de seguridad eléctrica y fuente de poder variable.
 *
 * El analizador es el instrumento que da el veredicto apto / no apto,
 * así que se presenta aquí y se desarrolla entero en el bloque 6.
 */
export default function S31_AnalizadorFuente() {
  const MIDE = [
    'Resistencia y continuidad de tierra de protección',
    'Corriente de fuga a tierra',
    'Corriente de fuga por la envolvente',
    'Corriente de fuga de y al paciente',
    'Resistencia de aislamiento',
  ]

  return (
    <SlideLayout>
      <SlideTag>
        <span>Bloque 5 · 5.3 y 5.4</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>El instrumento que</span> <Hydro><span>dicta el veredicto</span></Hydro>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: 24, flex: 1, minHeight: 0 }}>
        {/* ── Analizador de seguridad ── */}
        <Glass tone="violet" ornament style={{ display: 'flex', flexDirection: 'column', gap: 13, padding: '20px 22px', position: 'relative' }}>
          <div aria-hidden style={{ position: 'absolute', right: 14, bottom: 10, opacity: 0.3 }}>
            <Ripples size={210} tone="violet" count={3} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <Moon size={40} phase="eclipse" tone="violet" halo={false} />
            <div>
              <div className="font-display" style={{ fontSize: 25, color: 'var(--moon)', lineHeight: 1.1 }}>
                <span>Analizador de seguridad eléctrica</span>
              </div>
              <div className="font-mono" style={{ fontSize: 9.5, color: 'var(--moon-faint)', letterSpacing: '0.14em', marginTop: 3 }}>
                <span>PARÁMETROS DE IEC 60601‑1</span>
              </div>
            </div>
          </div>

          <p style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.7, margin: 0, position: 'relative' }}>
            <span>
              Instrumento especializado que mide los parámetros de seguridad de la norma aplicando condiciones
              normales y de primer defecto.
            </span>
          </p>

          <div className="orbit-divider" />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, position: 'relative' }}>
            {MIDE.map(m => (
              <Chip key={m} tone="violet">
                {m}
              </Chip>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9, position: 'relative' }}>
            <Bullet tone="violet">
              Incorpora la <Lunar>red de medición</Lunar> que emula la impedancia del cuerpo humano.
            </Bullet>
            <Bullet tone="violet">
              Su lectura se compara con los valores límite normativos para el veredicto de seguridad{' '}
              <Lunar>apto / no apto</Lunar>.
            </Bullet>
          </div>

          <div style={{ flex: 1 }} />

          <Callout kind="violet" title="Se desarrolla en el bloque 6">
            Qué mide exactamente cada corriente de fuga, qué es la condición de primer defecto y cuáles son los
            valores límite: todo eso es el contenido de la Clase 2.
          </Callout>
        </Glass>

        {/* ── Fuente de poder variable ── */}
        <Glass tone="hydro" ornament style={{ display: 'flex', flexDirection: 'column', gap: 13, padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <Moon size={38} phase="crescent" tone="hydro" halo={false} />
            <div>
              <div className="font-display" style={{ fontSize: 24, color: 'var(--moon)', lineHeight: 1.1 }}>
                <span>Fuente de poder variable</span>
              </div>
              <div className="font-mono" style={{ fontSize: 9.5, color: 'var(--moon-faint)', letterSpacing: '0.14em', marginTop: 3 }}>
                <span>TENSIÓN CONTROLADA</span>
              </div>
            </div>
          </div>

          <p style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>
            <span>
              Alimenta una tarjeta o subsistema con tensión controlada y limitación de corriente, para probarlo
              aislado del resto o sustituir temporalmente una fuente sospechosa.
            </span>
          </p>

          <div className="orbit-divider" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <Bullet tone="hydro">
              La <Lunar>limitación de corriente</Lunar> protege el circuito bajo prueba ante un corto.
            </Bullet>
            <Bullet tone="hydro">
              Permite subir la tensión de forma controlada mientras se vigila el consumo.
            </Bullet>
          </div>

          <div style={{ flex: 1 }} />

          <Callout kind="verdant" title="Uso típico en el banco">
            Confirmar que una tarjeta arranca cuando recibe sus tensiones correctas, y así separar la falla de la
            fuente de la falla de la lógica.
          </Callout>
        </Glass>
      </div>
    </SlideLayout>
  )
}
