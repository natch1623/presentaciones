import type { ReactNode } from 'react'
import { SlideLayout, Figure, Badge, type Tone } from './SlideLayout'

/**
 * Portadilla de equipo. Se repite seis veces, así que vive acá y no
 * copiada en cada archivo: cambiar el ritmo de la sección se hace en
 * un solo sitio.
 *
 * Anuncia el equipo, deja el hueco de la foto y adelanta las tres o
 * cuatro tareas concretas que se van a practicar — no una definición.
 */
export default function EquipoIntro({
  numeral,
  nombre,
  bajada,
  tareas,
  tone = 'frost',
  figura,
  riesgo,
}: {
  numeral: string
  nombre: string
  bajada: ReactNode
  tareas: { t: string; d: string }[]
  tone?: Tone
  figura: { file: string; hint: string; caption?: string }
  riesgo?: string
}) {
  return (
    <SlideLayout style={{ justifyContent: 'center' }}>
      {/* Numeral enorme al fondo — ancla la sección sin ocupar sitio */}
      <div
        aria-hidden
        className="font-rune"
        style={{
          position: 'absolute',
          left: 26,
          bottom: -46,
          fontSize: 290,
          lineHeight: 0.8,
          color: 'transparent',
          WebkitTextStroke: '1.2px rgba(125,99,255,0.20)',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        {numeral}
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.08fr 0.92fr',
          gap: 40,
          alignItems: 'center',
          position: 'relative',
          zIndex: 2,
        }}
      >
        {/* ── Texto ── */}
        <div style={{ minWidth: 0 }}>
          <div
            className="font-mono tag-reveal"
            style={{
              fontSize: 10,
              letterSpacing: '0.24em',
              color: 'var(--frost)',
              textTransform: 'uppercase',
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 11,
            }}
          >
            <span
              style={{
                width: 30,
                height: 1.5,
                background: 'linear-gradient(90deg, var(--frost), transparent)',
                boxShadow: '0 0 8px var(--frost)',
              }}
            />
            <span>{`Equipo ${numeral} de 06`}</span>
            {riesgo && <Badge tone={tone}>{riesgo}</Badge>}
          </div>

          <h2
            className="font-display title-reveal"
            style={{
              fontSize: 58,
              lineHeight: 1.04,
              color: 'var(--ice)',
              margin: '0 0 14px',
              fontWeight: 400,
            }}
          >
            <span>{nombre}</span>
          </h2>

          <div
            style={{
              width: 150,
              height: 2,
              marginBottom: 18,
              background: 'linear-gradient(90deg, var(--rift), var(--frost) 60%, transparent)',
              boxShadow: '0 0 12px rgba(143,220,255,0.55)',
            }}
          />

          <p
            className="stagger-item"
            style={{ fontSize: 15, color: 'var(--ice-dim)', lineHeight: 1.65, margin: '0 0 24px', maxWidth: 560 }}
          >
            <span>{bajada}</span>
          </p>

          <div
            className="font-mono"
            style={{
              fontSize: 9.5,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--rift-soft)',
              marginBottom: 12,
            }}
          >
            <span>Lo que vas a practicar</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tareas.map((t, i) => (
              <div
                key={t.t}
                className="stagger-item"
                style={{ display: 'flex', gap: 12, alignItems: 'baseline', animationDelay: `${0.3 + i * 0.08}s` }}
              >
                <span
                  className="font-mono"
                  style={{ fontSize: 10, color: 'var(--frost)', minWidth: 18, letterSpacing: '0.08em' }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: 13, color: 'var(--ice)', fontWeight: 500, minWidth: 152 }}>
                  <span>{t.t}</span>
                </span>
                <span style={{ fontSize: 11.5, color: 'var(--ice-faint)', lineHeight: 1.5, flex: 1 }}>
                  <span>{t.d}</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Hueco de la imagen ── */}
        <Figure
          tone={tone}
          height={392}
          file={figura.file}
          hint={figura.hint}
          caption={figura.caption}
        />
      </div>
    </SlideLayout>
  )
}
