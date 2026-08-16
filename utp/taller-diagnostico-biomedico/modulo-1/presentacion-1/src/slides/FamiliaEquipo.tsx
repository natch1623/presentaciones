import type { ReactNode } from 'react'
import { SlideLayout, SlideTag, SlideTitle, Glass, Bullet, Chip, Hydro } from './SlideLayout'
import IconoEquipo, { type EquipoId } from '../components/IconosEquipo'
import { Moon, Spark } from '../components/Celestial'

/**
 * Plantilla de las siete diapositivas de familias de equipo.
 *
 * Todas responden a las mismas cuatro preguntas —principio, bloques
 * críticos, fallas frecuentes y verificación— y ese paralelismo es
 * parte del contenido: enseña que el análisis se hace igual sea el
 * equipo que sea. Por eso la estructura vive acá y no repetida siete
 * veces.
 */
export default function FamiliaEquipo({
  num,
  icono,
  nombre,
  subtitulo,
  principio,
  criticos,
  fallas,
  verificacion,
  tone = 'hydro',
}: {
  num: string
  icono: EquipoId
  nombre: ReactNode
  subtitulo?: ReactNode
  principio: ReactNode
  criticos: string[]
  fallas: ReactNode[]
  verificacion: ReactNode[]
  tone?: 'hydro' | 'violet' | 'cyan' | 'rose'
}) {
  return (
    <SlideLayout>
      <SlideTag tone={tone}>
        <span>{`Bloque 7 · ${num}`}</span>
      </SlideTag>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, marginBottom: 4 }}>
        <div
          className="crystal-in"
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 62,
            height: 62,
            flexShrink: 0,
            borderRadius: '50%',
            border: '1px solid var(--edge)',
            background: 'radial-gradient(circle at 34% 30%, rgba(114,199,255,0.10), transparent 70%)',
          }}
        >
          <IconoEquipo id={icono} size={32} />
        </div>

        <div style={{ minWidth: 0 }}>
          <SlideTitle size="md" style={{ marginBottom: 4 }}>
            {nombre}
          </SlideTitle>
          {subtitulo && (
            <div className="font-mono" style={{ fontSize: 10, color: 'var(--moon-faint)', letterSpacing: '0.14em' }}>
              {subtitulo}
            </div>
          )}
        </div>
      </div>

      {/* `alignContent: center` deja que cada columna mida lo que su
          contenido pide y centra el conjunto: estirados a toda la
          altura los tres paneles quedaban vacíos por abajo. */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 1fr 1fr',
          gap: 20,
          flex: 1,
          minHeight: 0,
          marginTop: 14,
          alignContent: 'center',
          alignItems: 'start',
        }}
      >
        {/* ── Principio y bloques críticos ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minWidth: 0 }}>
          <Glass tone={tone} ornament style={{ padding: '16px 18px' }}>
            <div
              className="font-mono"
              style={{ fontSize: 9.5, letterSpacing: '0.16em', color: 'var(--hydro)', textTransform: 'uppercase', marginBottom: 9 }}
            >
              <span>Principio de funcionamiento</span>
            </div>
            <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.75, margin: 0 }}>{principio}</p>
          </Glass>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
              <Spark size={10} tone="violet" />
              <span
                className="font-mono"
                style={{ fontSize: 9.5, letterSpacing: '0.16em', color: 'var(--lilac)', textTransform: 'uppercase' }}
              >
                <span>Bloques críticos</span>
              </span>
              <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(199,181,255,0.3), transparent)' }} />
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
              {criticos.map(c => (
                <Chip key={c} tone="violet">
                  {c}
                </Chip>
              ))}
            </div>
          </div>
        </div>

        {/* ── Fallas frecuentes ── */}
        <Glass tone="alert" style={{ display: 'flex', flexDirection: 'column', gap: 11, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Moon size={24} phase="eclipse" tone="alert" halo={false} />
            <span
              className="font-mono"
              style={{ fontSize: 9.5, letterSpacing: '0.16em', color: 'var(--alert)', textTransform: 'uppercase' }}
            >
              <span>Fallas frecuentes</span>
            </span>
          </div>

          <div className="orbit-divider" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {fallas.map((f, i) => (
              <Bullet key={i} tone="alert">
                {f}
              </Bullet>
            ))}
          </div>
        </Glass>

        {/* ── Verificación ── */}
        <Glass tone="verdant" style={{ display: 'flex', flexDirection: 'column', gap: 11, padding: '16px 18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Moon size={24} phase="full" tone="verdant" halo={false} />
            <span
              className="font-mono"
              style={{ fontSize: 9.5, letterSpacing: '0.16em', color: 'var(--verdant)', textTransform: 'uppercase' }}
            >
              <span>Verificación</span>
            </span>
          </div>

          <div className="orbit-divider" />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {verificacion.map((v, i) => (
              <Bullet key={i} tone="verdant">
                {v}
              </Bullet>
            ))}
          </div>

          <div className="orbit-divider" style={{ marginTop: 2 }} />

          <p style={{ fontSize: 11, color: 'var(--moon-faint)', lineHeight: 1.55, margin: 0 }}>
            <span>Sin esta columna el diagnóstico no está cerrado: </span>
            <Hydro>
              <span>encender no es funcionar.</span>
            </Hydro>
          </p>
        </Glass>
      </div>
    </SlideLayout>
  )
}
