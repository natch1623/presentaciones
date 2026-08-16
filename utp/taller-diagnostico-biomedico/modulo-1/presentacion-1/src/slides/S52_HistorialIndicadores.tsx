import { SlideLayout, SlideTag, SlideTitle, Glass, Hydro, Lunar, Bullet, Stat, Callout } from './SlideLayout'
import { Moon, Ripples, Spark } from '../components/Celestial'

/**
 * El historial del equipo y los indicadores que alimenta.
 *
 * Cierra el círculo con el bloque 1: los mismos MTBF y MTTR que allí
 * eran teoría de la confiabilidad, aquí salen de las órdenes de trabajo
 * que llena el técnico.
 */
export default function S52_HistorialIndicadores() {
  const INDICADORES = [
    { v: 'MTBF', l: 'tiempo medio entre fallas', tono: 'hydro' as const },
    { v: 'MTTR', l: 'tiempo medio de reparación', tono: 'violet' as const },
    { v: 'A', l: 'disponibilidad del equipo', tono: 'cyan' as const },
    { v: '$', l: 'costo de mantenimiento por equipo', tono: 'ember' as const },
  ]

  return (
    <SlideLayout>
      <SlideTag>
        <span>Bloque 8 · 8.2</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>El historial:</span> <Hydro><span>lo que hace que el sistema mejore con el tiempo</span></Hydro>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, flex: 1, minHeight: 0, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <p style={{ fontSize: 14, color: 'var(--moon-dim)', lineHeight: 1.8, margin: 0 }}>
            <span>
              Cada orden de trabajo alimenta la hoja de vida del equipo. Ese historial acumulado es lo que convierte
              intervenciones sueltas en un sistema de mantenimiento.
            </span>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            <Bullet tone="hydro">Permite detectar fallas recurrentes.</Bullet>
            <Bullet tone="hydro">
              Sustenta la decisión entre <Lunar>reparar o dar de baja</Lunar>.
            </Bullet>
            <Bullet tone="hydro">
              Y en el próximo diagnóstico es la primera fuente del <Lunar>paso 2</Lunar> del método.
            </Bullet>
          </div>

          <Callout kind="violet" title="El círculo se cierra">
            Lo que en el bloque 1 era teoría de la confiabilidad —λ, MTBF, disponibilidad— sale, en la práctica, de
            las órdenes de trabajo que llena el técnico.
          </Callout>
        </div>

        {/* Los indicadores que alimenta, orbitando */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div aria-hidden style={{ position: 'absolute', opacity: 0.45 }}>
            <Ripples size={380} tone="violet" count={4} />
          </div>

          <Glass tone="hydro" ornament style={{ position: 'relative', padding: '24px 26px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11, marginBottom: 18 }}>
              <Moon size={30} phase="ring" tone="hydro" halo={false} />
              <span
                className="font-mono"
                style={{ fontSize: 9.5, letterSpacing: '0.16em', color: 'var(--hydro)', textTransform: 'uppercase' }}
              >
                <span>Indicadores de gestión que alimenta</span>
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 22 }}>
              {INDICADORES.map((ind, i) => (
                <div
                  key={ind.v}
                  style={{ animation: `veilRise 0.85s cubic-bezier(0.22,1,0.36,1) ${0.2 + i * 0.11}s both` }}
                >
                  <Stat value={ind.v} label={ind.l} tone={ind.tono} />
                </div>
              ))}
            </div>

            <div className="orbit-divider" style={{ margin: '18px 0 12px' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
              <Spark size={10} tone="cyan" />
              <span style={{ fontSize: 11.5, color: 'var(--moon-faint)', textAlign: 'center' }}>
                <span>Ninguno de estos números existe si nadie documenta.</span>
              </span>
            </div>
          </Glass>
        </div>
      </div>
    </SlideLayout>
  )
}
