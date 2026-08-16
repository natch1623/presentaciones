import { SlideLayout, SlideTag, SlideTitle, Glass, Hydro, Lunar, Callout } from './SlideLayout'
import { Moon } from '../components/Celestial'

/**
 * Árbol de decisión para «el equipo no enciende».
 *
 * Cada rama termina en una acción concreta o en una nueva medición,
 * nunca en ambigüedad: eso es lo que distingue un árbol de una lista de
 * cosas que revisar.
 */
export default function S27_ArbolDecision() {
  const RAMAS = [
    {
      q: '¿Hay tensión de red en la toma?',
      no: 'Corregir la instalación o la toma.',
      tono: 'hydro' as const,
    },
    {
      q: '¿El cable y el fusible están íntegros?',
      no: 'Reemplazar el fusible y averiguar por qué se abrió.',
      tono: 'hydro' as const,
    },
    {
      q: '¿La fuente entrega sus tensiones de salida?',
      no: 'Falla en la fuente: rectificador, regulador o capacitor.',
      tono: 'violet' as const,
    },
    {
      q: '¿La tarjeta de control arranca (LED o beep de encendido)?',
      no: 'Falla en lógica o procesamiento.',
      tono: 'violet' as const,
      si: 'Revisar display y backlight.',
    },
  ]

  return (
    <SlideLayout>
      <SlideTag>
        <span>Bloque 4 · 4.6</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>Árboles de decisión:</span> <Hydro><span>preguntas sí / no que dirigen el paso siguiente</span></Hydro>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 28, flex: 1, minHeight: 0 }}>
        {/* ── El árbol ── */}
        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
          {/* La órbita que baja por el margen izquierdo */}
          <div
            aria-hidden
            style={{
              position: 'absolute',
              left: 15,
              top: 24,
              bottom: 30,
              width: 1,
              background:
                'linear-gradient(180deg, rgba(114,199,255,0.45), rgba(199,181,255,0.45) 70%, transparent)',
            }}
          />

          {RAMAS.map((r, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'stretch',
                gap: 14,
                animation: `veilRise 0.8s cubic-bezier(0.22,1,0.36,1) ${0.14 + i * 0.12}s both`,
              }}
            >
              <Moon size={32} phase="ring" tone={r.tono} halo={false} style={{ marginTop: 12, zIndex: 1 }}>
                <span className="font-mono" style={{ fontSize: 10, color: 'var(--moon)' }}>
                  {i + 1}
                </span>
              </Moon>

              <Glass tone={r.tono} style={{ flex: 1, padding: '13px 16px', minWidth: 0 }}>
                <p style={{ fontSize: 14, color: 'var(--moon)', margin: '0 0 9px', lineHeight: 1.4 }}>
                  <span>{r.q}</span>
                </p>

                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5 }}>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: 9,
                        letterSpacing: '0.12em',
                        color: 'var(--alert)',
                        border: '1px solid rgba(255,143,168,0.35)',
                        borderRadius: 999,
                        padding: '1px 8px',
                      }}
                    >
                      NO
                    </span>
                    <span style={{ color: 'var(--text-2)' }}>
                      <span>{r.no}</span>
                    </span>
                  </span>

                  <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 11.5 }}>
                    <span
                      className="font-mono"
                      style={{
                        fontSize: 9,
                        letterSpacing: '0.12em',
                        color: 'var(--verdant)',
                        border: '1px solid rgba(143,227,200,0.35)',
                        borderRadius: 999,
                        padding: '1px 8px',
                      }}
                    >
                      SÍ
                    </span>
                    <span style={{ color: 'var(--text-2)' }}>
                      <span>{r.si ?? 'Seguir con la pregunta siguiente.'}</span>
                    </span>
                  </span>
                </div>
              </Glass>
            </div>
          ))}
        </div>

        {/* ── Para qué sirven ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center' }}>
          <Glass tone="cyan" ornament style={{ padding: '18px 20px' }}>
            <div
              className="font-mono"
              style={{ fontSize: 9.5, letterSpacing: '0.16em', color: 'var(--cyan)', textTransform: 'uppercase', marginBottom: 10 }}
            >
              <span>Qué aporta el formato</span>
            </div>
            <p style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.7, margin: '0 0 10px' }}>
              <span>
                Estandarizan el diagnóstico: cualquier técnico que siga el árbol llega a la misma conclusión.
              </span>
            </p>
            <p style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>
              <span>
                Y capturan el conocimiento experto en un formato reutilizable, que no se va del taller cuando se va
                la persona que lo sabía.
              </span>
            </p>
          </Glass>

          <Callout kind="violet" title="De dónde salen">
            Los fabricantes los incluyen en los manuales de servicio; también se construyen{' '}
            <Lunar>desde el modelo de bloques</Lunar> del bloque 2.
          </Callout>
        </div>
      </div>
    </SlideLayout>
  )
}
