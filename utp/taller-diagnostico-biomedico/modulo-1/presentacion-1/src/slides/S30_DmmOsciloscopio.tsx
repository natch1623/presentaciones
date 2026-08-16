import { SlideLayout, SlideTag, SlideTitle, Glass, Hydro, Lunar, Bullet, Badge, Callout } from './SlideLayout'
import { Moon } from '../components/Celestial'

/**
 * Multímetro y osciloscopio, como dos dominios enfrentados (§21).
 *
 * La comparación es el contenido: uno mide magnitudes que no cambian
 * rápido, el otro revela la forma y la temporización. Confundirlos es
 * la razón más común por la que una medición «no dice nada».
 */
export default function S30_DmmOsciloscopio() {
  return (
    <SlideLayout>
      <SlideTag>
        <span>Bloque 5 · 5.1 y 5.2</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>Dos dominios de medición:</span> <Hydro><span>el valor y la forma</span></Hydro>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, flex: 1, minHeight: 0, position: 'relative' }}>
        {/* La línea orbital que separa los dos dominios */}
        <div
          aria-hidden
          style={{
            position: 'absolute',
            left: '50%',
            top: 10,
            bottom: 10,
            width: 1,
            transform: 'translateX(-50%)',
            background: 'linear-gradient(180deg, transparent, rgba(199,181,255,0.35) 30%, rgba(189,248,255,0.35) 70%, transparent)',
          }}
        />

        {/* ── DMM ── */}
        <Glass tone="hydro" ornament style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <Moon size={40} phase="crescent" tone="hydro" halo={false} />
            <div>
              <div className="font-display" style={{ fontSize: 25, color: 'var(--moon)', lineHeight: 1.1 }}>
                <span>Multímetro digital</span>
              </div>
              <div className="font-mono" style={{ fontSize: 9.5, color: 'var(--moon-faint)', letterSpacing: '0.14em', marginTop: 3 }}>
                <span>DMM · MAGNITUDES DE ESTADO</span>
              </div>
            </div>
          </div>

          <p style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.65, margin: 0 }}>
            <span>
              Mide lo que no cambia rápido: tensión CC y CA, corriente, resistencia y continuidad.
            </span>
          </p>

          <div className="orbit-divider" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <Bullet tone="hydro">Verificar tensiones de fuente contra el valor del manual.</Bullet>
            <Bullet tone="hydro">Comprobar fusibles y continuidad de cables y de tierra.</Bullet>
            <Bullet tone="hydro">Localizar circuitos abiertos o en corto.</Bullet>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 2 }}>
            <Badge tone="cyan">exactitud ± % lectura + dígitos</Badge>
            <Badge tone="cyan">true‑RMS</Badge>
            <Badge tone="cyan">CAT II / III / IV</Badge>
          </div>

          <p style={{ fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>
            <span>
              El true‑RMS es necesario para señales no senoidales; la categoría de medición indica la seguridad del
              instrumento frente a transitorios según el punto de la instalación.
            </span>
          </p>

          <div style={{ flex: 1 }} />

          <Callout kind="ember" title="Limitación">
            No muestra la forma ni la temporización de señales dinámicas.
          </Callout>
        </Glass>

        {/* ── Osciloscopio ── */}
        <Glass tone="cyan" ornament style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '20px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
            <Moon size={40} phase="full" tone="cyan" halo={false} />
            <div>
              <div className="font-display" style={{ fontSize: 25, color: 'var(--moon)', lineHeight: 1.1 }}>
                <span>Osciloscopio</span>
              </div>
              <div className="font-mono" style={{ fontSize: 9.5, color: 'var(--moon-faint)', letterSpacing: '0.14em', marginTop: 3 }}>
                <span>TENSIÓN EN FUNCIÓN DEL TIEMPO</span>
              </div>
            </div>
          </div>

          <p style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.65, margin: 0 }}>
            <span>
              Revela forma de onda, amplitud, frecuencia, tiempos de subida, ruido y distorsión. Indispensable en el
              rastreo de señal por las etapas de acondicionamiento y procesamiento.
            </span>
          </p>

          <div className="orbit-divider" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <Bullet tone="cyan">
              El <Lunar>ancho de banda</Lunar> debe superar varias veces la frecuencia de la señal.
            </Bullet>
            <Bullet tone="cyan">Base de tiempo (eje X) y escala vertical (eje Y).</Bullet>
            <Bullet tone="cyan">Acoplamiento CA/CC y disparo, para estabilizar la traza.</Bullet>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 2 }}>
            <Badge tone="violet">frecuencia de muestreo</Badge>
            <Badge tone="violet">sondas ×1 / ×10</Badge>
          </div>

          <p style={{ fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>
            <span>
              Las sondas y su compensación afectan la medida y deben ajustarse antes de dar por buena una lectura.
            </span>
          </p>

          <div style={{ flex: 1 }} />

          <Callout kind="verdant" title="Cuándo elegirlo">
            Cuando importa <Lunar>cuándo</Lunar> y <Lunar>cómo</Lunar> ocurre la señal, no sólo cuánto vale.
          </Callout>
        </Glass>
      </div>
    </SlideLayout>
  )
}
