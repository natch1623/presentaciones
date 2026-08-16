import type { ReactNode } from 'react'
import { SlideLayout, TONE, type Tone } from './SlideLayout'
import { Moon, Wings, Spark, WaveLine } from '../components/Celestial'

/**
 * Separador de clase. Se usa dos veces —una por sesión teórica— así
 * que vive en su propio archivo en vez de duplicado.
 *
 * Aquí las alas aparecen sólo en silueta: completas en la portada,
 * insinuadas en los separadores, en fragmentos en el contenido y
 * abiertas otra vez en el cierre. Esa progresión es la narrativa
 * visual del deck.
 */
export default function ClaseSeparador({
  numero,
  duracion,
  titulo,
  bajada,
  bloques,
  tone = 'violet',
}: {
  numero: string
  duracion: string
  titulo: ReactNode
  bajada: ReactNode
  bloques: string[]
  tone?: Tone
}) {
  return (
    <SlideLayout style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 0 }}>
      {/* Silueta de alas, apenas visible tras el número */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '50%',
          top: '44%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      >
        <Wings width={760} tone={tone === 'violet' ? 'violet' : 'hydro'} variant="silhouette" opacity={0.16} />
      </div>

      {/* La luna del capítulo, con el numeral dentro */}
      <div style={{ position: 'relative', zIndex: 2, marginBottom: 24 }}>
        <Moon size={148} phase="ring" tone={tone === 'violet' ? 'violet' : 'hydro'} className="crystal-in">
          {/* «01» y no «1»: en la serif de titulares el uno solo se
              confunde con una I mayúscula. */}
          <span
            className="font-display"
            style={{
              fontSize: 54,
              color: TONE[tone].fg,
              textShadow: `0 0 40px ${TONE[tone].glow}`,
              letterSpacing: '0.04em',
            }}
          >
            {numero.padStart(2, '0')}
          </span>
        </Moon>
      </div>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 820 }}>
        <div
          className="font-mono tag-reveal"
          style={{
            fontSize: 10,
            letterSpacing: '0.32em',
            color: TONE[tone].fg,
            textTransform: 'uppercase',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <Spark size={9} tone="cyan" />
          <span>{`Clase ${numero} · Teoría · ${duracion}`}</span>
          <Spark size={9} tone="cyan" />
        </div>

        <h2
          className="font-display title-reveal"
          style={{ fontSize: 50, lineHeight: 1.1, color: 'var(--moon)', margin: '0 0 18px', fontWeight: 400 }}
        >
          {titulo}
        </h2>

        <div
          style={{
            width: 180,
            height: 1,
            margin: '0 auto 20px',
            background: `linear-gradient(90deg, transparent, ${TONE[tone].fg}, transparent)`,
            boxShadow: `0 0 12px ${TONE[tone].glow}`,
          }}
        />

        <p
          className="stagger-item"
          style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.75, margin: '0 auto 28px', maxWidth: 620 }}
        >
          {bajada}
        </p>

        <div className="stagger-item" style={{ display: 'flex', gap: 9, justifyContent: 'center', flexWrap: 'wrap' }}>
          {bloques.map(b => (
            <span
              key={b}
              className="font-mono"
              style={{
                fontSize: 10,
                letterSpacing: '0.08em',
                padding: '6px 14px',
                color: 'var(--moon-dim)',
                background: 'rgba(23,36,74,0.5)',
                border: `1px solid ${TONE[tone].edge}`,
                borderRadius: 999,
                backdropFilter: 'blur(6px)',
              }}
            >
              <span>{b}</span>
            </span>
          ))}
        </div>
      </div>

      <div
        aria-hidden
        style={{ position: 'absolute', left: 0, right: 0, bottom: 26, display: 'flex', justifyContent: 'center' }}
      >
        <WaveLine width={620} height={36} tone="hydro" opacity={0.28} />
      </div>
    </SlideLayout>
  )
}
