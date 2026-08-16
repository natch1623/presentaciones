/**
 * El fondo del dominio lunar.
 *
 * Cinco capas, de atrás hacia adelante, tal como pide la guía visual:
 *   1. base           — azul noche plano
 *   2. nebulosa       — manchas muy difusas de azul, violeta y cian
 *   3. partículas     — polvo luminoso con tres derivas distintas
 *   4. elementos      — anillos orbitales y una luna lejana
 *   5. iluminación    — un halo radial que sostiene la composición
 *
 * Es puramente decorativo: `aria-hidden`, sin eventos y fuera del
 * flujo. Las posiciones están fijadas a mano —no aleatorias— para que
 * la composición sea la misma en cada pase y no baile entre renders.
 */

/** Polvo luminoso. `k` elige la deriva: pulso, caída u órbita. */
const MOTES: { x: number; y: number; r: number; k: 'pulse' | 'sink' | 'orbit'; d: number; o?: number }[] = [
  { x: 8,  y: 18, r: 1.6, k: 'pulse', d: 0 },
  { x: 14, y: 62, r: 1.1, k: 'sink',  d: 1.4 },
  { x: 21, y: 34, r: 2.0, k: 'orbit', d: 0.6, o: 18 },
  { x: 27, y: 78, r: 1.3, k: 'pulse', d: 2.1 },
  { x: 33, y: 12, r: 1.0, k: 'sink',  d: 3.2 },
  { x: 39, y: 47, r: 1.7, k: 'pulse', d: 1.1 },
  { x: 46, y: 88, r: 1.2, k: 'orbit', d: 2.6, o: 11 },
  { x: 52, y: 26, r: 1.5, k: 'sink',  d: 0.4 },
  { x: 58, y: 68, r: 1.0, k: 'pulse', d: 3.6 },
  { x: 64, y: 14, r: 2.2, k: 'orbit', d: 1.8, o: 22 },
  { x: 69, y: 52, r: 1.3, k: 'sink',  d: 2.9 },
  { x: 74, y: 82, r: 1.6, k: 'pulse', d: 0.9 },
  { x: 80, y: 30, r: 1.1, k: 'sink',  d: 4.3 },
  { x: 85, y: 60, r: 1.9, k: 'orbit', d: 3.1, o: 15 },
  { x: 90, y: 20, r: 1.2, k: 'pulse', d: 2.4 },
  { x: 94, y: 74, r: 1.4, k: 'sink',  d: 1.7 },
  { x: 4,  y: 44, r: 1.0, k: 'pulse', d: 5.0 },
  { x: 44, y: 6,  r: 1.3, k: 'orbit', d: 4.0, o: 9 },
  { x: 61, y: 94, r: 1.1, k: 'pulse', d: 3.3 },
  { x: 17, y: 90, r: 1.5, k: 'sink',  d: 0.2 },
]

const MOTE_ANIM = { pulse: 'animate-mote', sink: 'animate-sink', orbit: 'animate-orbit' } as const

export default function CelestialField() {
  return (
    <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      {/* ── 2 · Nebulosa ── */}
      <div
        className="animate-halo"
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(141,130,232,0.22) 0%, transparent 66%)',
          filter: 'blur(80px)',
          top: -340,
          right: -200,
        }}
      />
      <div
        className="animate-halo"
        style={{
          position: 'absolute',
          width: 640,
          height: 640,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(114,199,255,0.16) 0%, transparent 68%)',
          filter: 'blur(66px)',
          bottom: -220,
          left: -140,
          animationDelay: '2.6s',
        }}
      />
      <div
        className="animate-halo"
        style={{
          position: 'absolute',
          width: 420,
          height: 420,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(189,248,255,0.10) 0%, transparent 70%)',
          filter: 'blur(58px)',
          top: '34%',
          left: '48%',
          animationDelay: '1.3s',
        }}
      />

      {/* ── 5 · Iluminación general: el halo que sostiene la escena ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 55% at 50% 46%, rgba(23,36,74,0.55) 0%, transparent 72%)',
        }}
      />

      {/* ── 1 · Viñeta: el borde del dominio se oscurece ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 92% 88% at 50% 50%, transparent 42%, rgba(4,7,20,0.78) 100%)',
        }}
      />

      <div className="astral-grid" style={{ position: 'absolute', inset: 0 }} />

      {/* ── 4 · Elementos astrales: órbitas y una luna lejana ── */}
      <svg
        viewBox="0 0 1280 800"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <defs>
          <radialGradient id="cfMoon" cx="38%" cy="34%">
            <stop offset="0%" stopColor="#f5f7ff" stopOpacity="0.22" />
            <stop offset="55%" stopColor="#b8e7ff" stopOpacity="0.09" />
            <stop offset="100%" stopColor="#8d82e8" stopOpacity="0.02" />
          </radialGradient>
        </defs>

        {/* Luna lejana, arriba a la izquierda: presente pero nunca protagonista */}
        <circle cx="146" cy="118" r="86" fill="url(#cfMoon)" />
        <circle cx="146" cy="118" r="86" fill="none" stroke="rgba(184,231,255,0.10)" strokeWidth="0.8" />

        {/* Líneas orbitales muy tenues */}
        <g style={{ transformOrigin: '146px 118px' }} className="animate-ring">
          <ellipse
            cx="146" cy="118" rx="150" ry="52"
            fill="none" stroke="rgba(199,181,255,0.09)" strokeWidth="0.8"
          />
        </g>
        <g style={{ transformOrigin: '1080px 640px' }} className="animate-ring-r">
          <ellipse
            cx="1080" cy="640" rx="210" ry="74"
            fill="none" stroke="rgba(114,199,255,0.07)" strokeWidth="0.8"
          />
        </g>
      </svg>

      {/* ── 3 · Partículas ── */}
      {MOTES.map((m, i) => (
        <span
          key={i}
          className={MOTE_ANIM[m.k]}
          style={{
            position: 'absolute',
            left: `${m.x}%`,
            top: `${m.y}%`,
            width: m.r * 2,
            height: m.r * 2,
            borderRadius: '50%',
            background: i % 5 === 0 ? 'var(--lilac)' : i % 3 === 0 ? 'var(--cyan)' : 'var(--hydro-soft)',
            boxShadow: `0 0 ${m.r * 5}px rgba(184,231,255,0.7)`,
            animationDelay: `${m.d}s`,
            ...(m.o ? ({ ['--orb' as string]: `${m.o}px` } as Record<string, string>) : null),
          }}
        />
      ))}
    </div>
  )
}
