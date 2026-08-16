import { SlideLayout, SlideTag, SlideTitle, Glass, Hydro, Lunar, Alert, Callout, Stat } from './SlideLayout'
import { Moon, Ripples } from '../components/Celestial'

/**
 * Macroshock y microshock, como dos dominios enfrentados.
 *
 * El contraste de órdenes de magnitud —100 mA contra 10 µA— es todo el
 * argumento: cuando la corriente no tiene que dispersarse, hace falta
 * diez mil veces menos para provocar fibrilación.
 */
export default function S36_MacroMicro() {
  return (
    <SlideLayout>
      <SlideTag>
        <span>Bloque 6 · 6.2</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>Macroshock y microshock:</span> <Hydro><span>el camino importa más que la magnitud</span></Hydro>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 26, flex: 1, minHeight: 0, position: 'relative' }}>
        {/* Línea orbital que separa los dos dominios */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: '50%',
            top: 6,
            bottom: 6,
            width: 1,
            transform: 'translateX(-50%)',
            background: 'linear-gradient(180deg, transparent, rgba(114,199,255,0.32) 28%, rgba(255,143,168,0.32) 72%, transparent)',
          }}
        />

        {/* ── Macroshock ── */}
        <Glass tone="hydro" ornament style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '22px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <Moon size={40} phase="full" tone="hydro" halo={false} />
            <div>
              <div className="font-display" style={{ fontSize: 27, color: 'var(--moon)', lineHeight: 1.1 }}>
                <span>Macroshock</span>
              </div>
              <div className="font-mono" style={{ fontSize: 9.5, color: 'var(--moon-faint)', letterSpacing: '0.14em', marginTop: 3 }}>
                <span>POR LA SUPERFICIE DEL CUERPO</span>
              </div>
            </div>
          </div>

          <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.75, margin: 0 }}>
            <span>
              Corriente que circula por la superficie del cuerpo. Sólo una fracción de esa corriente llega al
              corazón: el resto se dispersa por los tejidos.
            </span>
          </p>

          <div style={{ padding: '14px 0' }}>
            <Stat value="~ 100 mA" label="umbral de fibrilación a través del tórax" tone="hydro" />
          </div>

          <div style={{ flex: 1 }} />

          <Callout kind="hydro" title="Situación típica">
            Envolvente metálica energizada por una falla de aislamiento, con la tierra de protección interrumpida.
          </Callout>
        </Glass>

        {/* ── Microshock ── */}
        <Glass tone="alert" ornament style={{ display: 'flex', flexDirection: 'column', gap: 14, padding: '22px 24px', position: 'relative' }}>
          <div aria-hidden style={{ position: 'absolute', right: 10, bottom: 6, opacity: 0.3 }}>
            <Ripples size={200} tone="alert" count={3} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 13, position: 'relative' }}>
            <Moon size={40} phase="eclipse" tone="alert" halo={false} />
            <div>
              <div className="font-display" style={{ fontSize: 27, color: 'var(--moon)', lineHeight: 1.1 }}>
                <span>Microshock</span>
              </div>
              <div className="font-mono" style={{ fontSize: 9.5, color: 'var(--moon-faint)', letterSpacing: '0.14em', marginTop: 3 }}>
                <span>CAMINO CONDUCTOR INTRACARDÍACO</span>
              </div>
            </div>
          </div>

          <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.75, margin: 0, position: 'relative' }}>
            <span>
              Corriente aplicada directamente al corazón por un catéter, un electrodo o un marcapasos temporal. Al no
              dispersarse, toda la corriente atraviesa el miocardio.
            </span>
          </p>

          <div style={{ padding: '14px 0', position: 'relative' }}>
            <Stat value="~ 10 – 100 µA" label="basta para inducir fibrilación" tone="alert" />
          </div>

          <div style={{ flex: 1 }} />

          <Callout kind="alert" title="Consecuencia normativa">
            Este es el motivo de que los límites de fuga para partes aplicadas cardíacas —<Lunar>tipo CF</Lunar>—
            sean tan estrictos. <Alert>Diez mil veces menos corriente</Alert> para el mismo daño.
          </Callout>
        </Glass>
      </div>

      <Callout kind="violet" title="Consecuencia de diseño">
        Los límites de la norma se fijan muy por debajo de estos umbrales, con margen de seguridad. El técnico no
        decide los límites: los mide y los compara contra los valores normativos. Un equipo puede funcionar
        perfectamente y ser eléctricamente inseguro.
      </Callout>
    </SlideLayout>
  )
}
