import { SlideLayout, SlideTag, SlideTitle, Glass, Hydro, Lunar, Callout, Bullet } from './SlideLayout'
import { Moon, Spark, Ripples } from '../components/Celestial'

/**
 * Tablas de códigos de error del fabricante. Cierra el bloque 4 porque
 * es el atajo que más tiempo ahorra —y el que más se malinterpreta—:
 * el código dice dónde el firmware detectó el problema, no siempre
 * dónde está la causa.
 */
export default function S28_CodigosError() {
  return (
    <SlideLayout>
      <SlideTag>
        <span>Bloque 4 · 4.7</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>Códigos de error:</span> <Hydro><span>el atajo del autodiagnóstico</span></Hydro>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, flex: 1, minHeight: 0, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 14, color: 'var(--moon-dim)', lineHeight: 1.8, margin: 0 }}>
            <span>
              Los equipos con microprocesador ejecutan autodiagnósticos y muestran un código al detectar una
              anomalía. La tabla del manual de servicio traduce cada código a un subsistema o causa probable, y con
              eso ataja gran parte del diagnóstico.
            </span>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Bullet tone="hydro">
              <Lunar>Regla práctica:</Lunar> antes de medir, leer el código y consultar la tabla.
            </Bullet>
            <Bullet tone="hydro">
              El código pertenece al paso 2 del método —recopilar información—, no al paso 4.
            </Bullet>
          </div>

          <Callout kind="ember" title="Advertencia">
            El código indica <Lunar>dónde el firmware detectó el problema</Lunar>, que no siempre es la causa raíz.
            Un código de «batería baja» puede deberse al cargador. El código orienta la hipótesis; no sustituye la
            verificación.
          </Callout>
        </div>

        {/* La cadena código → subsistema → hipótesis */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 14, alignItems: 'center' }}>
          <div aria-hidden style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
            <Ripples size={340} tone="hydro" count={4} />
          </div>

          {[
            { t: 'Código en pantalla', d: 'E‑07, ER 12, Alarm 3…', tono: 'cyan' as const, fase: 'full' as const },
            { t: 'Tabla del manual', d: 'traduce el código a un subsistema', tono: 'hydro' as const, fase: 'eclipse' as const },
            { t: 'Hipótesis dirigida', d: 'entra al paso 3 del método', tono: 'violet' as const, fase: 'crescent' as const },
          ].map((p, i) => (
            <div key={p.t} style={{ position: 'relative', width: '100%' }}>
              <Glass
                tone={p.tono}
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  animation: `gravityPull 0.9s cubic-bezier(0.22,1,0.36,1) ${0.2 + i * 0.16}s both`,
                }}
              >
                <Moon size={34} phase={p.fase} tone={p.tono} halo={false} />
                <div style={{ minWidth: 0 }}>
                  <div className="font-display" style={{ fontSize: 20, color: 'var(--moon)', lineHeight: 1.15 }}>
                    <span>{p.t}</span>
                  </div>
                  <div className="font-mono" style={{ fontSize: 10.5, color: 'var(--text-2)', marginTop: 3 }}>
                    <span>{p.d}</span>
                  </div>
                </div>
              </Glass>

              {i < 2 && (
                <div aria-hidden style={{ display: 'flex', justifyContent: 'center', marginTop: 4, marginBottom: -8 }}>
                  <Spark size={10} tone="cyan" className="animate-mote" style={{ animationDelay: `${i * 0.6}s` }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </SlideLayout>
  )
}
