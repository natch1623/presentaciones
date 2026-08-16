/**
 * La capa que cubre el corte entre diapositivas.
 *
 * Avanzar (`ripple`) — una onda hydro nace del centro y se expande
 * mientras plumas y partículas cruzan la pantalla hacia afuera.
 * Retroceder (`eclipse`) — un disco oscuro barre la escena y las
 * partículas convergen al centro, como atraídas por gravedad.
 *
 * Vive por encima de la diapositiva y sobrevive al cambio de montaje:
 * su animación cruza la salida de una lámina y la entrada de la otra,
 * que es lo que hace que el corte se lea como un solo gesto.
 */

type Phase = 'ripple' | 'eclipse' | null

/** Trayectorias de las plumas. Ninguna se mueve como la de al lado. */
const FEATHERS = [
  { x: -420, y: -190, r: -38, s: 1.5, d: 0.86, del: 0.00, w: 26, h: 7,  c: 'var(--hydro-soft)' },
  { x: 380,  y: -240, r: 44,  s: 1.7, d: 0.94, del: 0.05, w: 22, h: 6,  c: 'var(--cyan)' },
  { x: -300, y: 250,  r: 26,  s: 1.3, d: 0.80, del: 0.10, w: 30, h: 8,  c: 'var(--lilac)' },
  { x: 460,  y: 180,  r: -52, s: 1.9, d: 1.00, del: 0.03, w: 18, h: 5,  c: 'var(--hydro)' },
  { x: -180, y: -300, r: 62,  s: 1.4, d: 0.88, del: 0.14, w: 24, h: 6,  c: 'var(--moon)' },
  { x: 240,  y: 320,  r: -30, s: 1.6, d: 0.92, del: 0.08, w: 20, h: 6,  c: 'var(--hydro-soft)' },
  { x: -520, y: 60,   r: 18,  s: 1.8, d: 0.98, del: 0.12, w: 28, h: 7,  c: 'var(--cyan)' },
  { x: 520,  y: -60,  r: -22, s: 1.5, d: 0.84, del: 0.06, w: 16, h: 5,  c: 'var(--lilac)' },
  { x: -60,  y: 360,  r: 48,  s: 1.2, d: 0.90, del: 0.16, w: 22, h: 6,  c: 'var(--moon)' },
  { x: 100,  y: -370, r: -44, s: 1.7, d: 0.96, del: 0.02, w: 26, h: 7,  c: 'var(--hydro)' },
]

/** Los tres anillos de la onda, escalonados para dar espesor. */
const RINGS = [
  { size: 260, d: '0.95s', del: '0s',    w: 1.5, c: 'rgba(184,231,255,0.75)' },
  { size: 260, d: '1.05s', del: '0.10s', w: 1,   c: 'rgba(114,199,255,0.55)' },
  { size: 260, d: '1.15s', del: '0.20s', w: 0.8, c: 'rgba(199,181,255,0.40)' },
]

export default function HydroVeil({ phase }: { phase: Phase }) {
  if (!phase) return null

  const gathering = phase === 'eclipse'

  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 40,
        overflow: 'hidden',
      }}
    >
      {/* ── Destello lunar en el centro del corte ── */}
      <div
        className={gathering ? 'eclipse-disc' : 'ripple-ring'}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 340,
          height: 340,
          marginLeft: -170,
          marginTop: -170,
          borderRadius: '50%',
          background: gathering
            ? 'radial-gradient(circle, rgba(4,7,20,0.92) 38%, rgba(141,130,232,0.20) 62%, transparent 74%)'
            : 'radial-gradient(circle, rgba(245,247,255,0.30) 0%, rgba(114,199,255,0.14) 40%, transparent 68%)',
          ['--rd' as string]: '0.9s',
        }}
      />

      {/* ── Onda hydro: sólo al avanzar ── */}
      {!gathering &&
        RINGS.map((r, i) => (
          <div
            key={i}
            className="ripple-ring"
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: r.size,
              height: r.size,
              marginLeft: -r.size / 2,
              marginTop: -r.size / 2,
              borderRadius: '50%',
              border: `${r.w}px solid ${r.c}`,
              boxShadow: `0 0 22px ${r.c}, inset 0 0 22px ${r.c}`,
              ['--rd' as string]: r.d,
              ['--rdel' as string]: r.del,
            }}
          />
        ))}

      {/* ── Plumas ── */}
      {FEATHERS.map((f, i) => (
        <div
          key={i}
          className={gathering ? 'feather-gather' : 'feather-cross'}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: f.w,
            height: f.h,
            marginLeft: -f.w / 2,
            marginTop: -f.h / 2,
            // Una pluma es una lágrima alargada: redonda de un lado,
            // afilada del otro.
            borderRadius: '50% 6% 50% 50%',
            background: `linear-gradient(90deg, ${f.c}, transparent)`,
            opacity: 0,
            filter: 'blur(0.4px)',
            boxShadow: `0 0 12px ${f.c}`,
            ['--fx' as string]: `${f.x}px`,
            ['--fy' as string]: `${f.y}px`,
            ['--fr' as string]: `${f.r}deg`,
            ['--fs' as string]: `${f.s}`,
            ['--fd' as string]: `${f.d}s`,
            ['--fdel' as string]: `${f.del}s`,
          }}
        />
      ))}
    </div>
  )
}
