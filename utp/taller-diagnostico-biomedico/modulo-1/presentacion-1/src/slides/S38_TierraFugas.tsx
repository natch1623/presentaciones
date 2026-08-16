import { SlideLayout, SlideTag, SlideTitle, Glass, Hydro, Lunar, Bullet, Badge, Callout, Stat } from './SlideLayout'
import { Moon, Spark } from '../components/Celestial'

/**
 * Tierra de protección y corrientes de fuga: qué se mide y por qué.
 *
 * La condición de primer defecto es el concepto que más cuesta y el que
 * explica por qué las pruebas se repiten en cuatro configuraciones, así
 * que tiene su propio recuadro.
 */
export default function S38_TierraFugas() {
  const FUGAS = [
    { t: 'A tierra', d: 'Circula por el conductor de tierra de protección hacia tierra.', tono: 'hydro' as const },
    { t: 'Por la envolvente', d: 'La que fluiría desde una parte accesible hacia tierra a través de una persona que la tocara.', tono: 'hydro' as const },
    { t: 'De paciente', d: 'Entre la parte aplicada y el paciente. La más crítica: fija los límites más bajos, sobre todo en CF.', tono: 'alert' as const, critica: true },
    { t: 'Auxiliar de paciente', d: 'La que circula entre partes aplicadas a través del paciente en operación normal, como la corriente de polarización entre electrodos.', tono: 'violet' as const },
  ]

  const DEFECTOS = ['Tierra abierta', 'Neutro abierto', 'Polaridad invertida']

  return (
    <SlideLayout>
      <SlideTag>
        <span>Bloque 6 · 6.5 y 6.6</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>Tierra de protección y</span> <Hydro><span>corrientes de fuga</span></Hydro>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '0.85fr 1.25fr', gap: 24, flex: 1, minHeight: 0 }}>
        {/* ── Tierra ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <Glass tone="hydro" ornament style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <Moon size={32} phase="crescent" tone="hydro" halo={false} />
              <span className="font-display" style={{ fontSize: 22, color: 'var(--moon)' }}>
                <span>Continuidad de tierra</span>
              </span>
            </div>

            <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.65, margin: 0 }}>
              <span>
                En equipo Clase I la tierra de protección es la principal medida de seguridad: deriva a tierra
                cualquier corriente de falla y mantiene la envolvente a potencial seguro.
              </span>
            </p>

            <div className="orbit-divider" />

            <Stat value="≤ 0,1 – 0,2 Ω" label="entre el pin de tierra del enchufe y las partes metálicas accesibles" tone="cyan" />

            <p style={{ fontSize: 11, color: 'var(--moon-faint)', lineHeight: 1.5, margin: 0, textAlign: 'center' }}>
              <span>El valor exacto depende de la edición de la norma y del tipo de cable.</span>
            </p>
          </Glass>

          <Callout kind="alert" title="Un valor alto lo dice todo">
            Indica conexión deteriorada y equipo inseguro, <Lunar>aunque funcione</Lunar>.
          </Callout>
        </div>

        {/* ── Fugas ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
          <p style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.65, margin: 0 }}>
            <span>
              Son corrientes no funcionales que escapan por caminos no deseados, principalmente por el acoplamiento
              capacitivo del aislamiento y los capacitores de filtro EMI —los capacitores «Y»— hacia tierra.
            </span>
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
            {FUGAS.map((f, i) => (
              <Glass
                key={f.t}
                tone={f.tono}
                style={{
                  padding: '12px 15px',
                  animation: `veilRise 0.8s cubic-bezier(0.22,1,0.36,1) ${0.14 + i * 0.09}s both`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
                  <Spark size={9} tone={f.tono} />
                  <span style={{ fontSize: 13, color: 'var(--moon)', fontWeight: 500 }}>
                    <span>{f.t}</span>
                  </span>
                  {f.critica && <Badge tone="alert">crítica</Badge>}
                </div>
                <p style={{ fontSize: 11, color: 'var(--text-2)', lineHeight: 1.5, margin: 0 }}>
                  <span>{f.d}</span>
                </p>
              </Glass>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, flex: 1, minHeight: 0 }}>
            <Glass tone="violet" ornament style={{ padding: '14px 16px' }}>
              <div
                className="font-mono"
                style={{ fontSize: 9.5, letterSpacing: '0.15em', color: 'var(--lilac)', textTransform: 'uppercase', marginBottom: 8 }}
              >
                <span>La red de medición</span>
              </div>
              <p style={{ fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>
                <span>
                  El analizador interpone una red resistiva‑capacitiva que emula la impedancia del cuerpo humano
                  —su elemento base es del orden de 1 kΩ— y pondera la respuesta en frecuencia según el riesgo
                  fisiológico.
                </span>
              </p>
            </Glass>

            <Glass tone="ember" ornament style={{ padding: '14px 16px' }}>
              <div
                className="font-mono"
                style={{ fontSize: 9.5, letterSpacing: '0.15em', color: 'var(--ember)', textTransform: 'uppercase', marginBottom: 8 }}
              >
                <span>Condición de primer defecto</span>
              </div>
              <p style={{ fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.6, margin: '0 0 9px' }}>
                <span>
                  Las mediciones se hacen en condición normal y con un fallo simulado: la norma exige que el equipo
                  siga siendo seguro incluso ante el primero.
                </span>
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {DEFECTOS.map(d => (
                  <Badge key={d} tone="ember">
                    {d}
                  </Badge>
                ))}
              </div>
            </Glass>
          </div>

          <Bullet tone="hydro">
            De ahí que cada parámetro se reporte dos veces: <Lunar>NC</Lunar> (condición normal) y{' '}
            <Lunar>SFC</Lunar> (primer defecto).
          </Bullet>
        </div>
      </div>
    </SlideLayout>
  )
}
