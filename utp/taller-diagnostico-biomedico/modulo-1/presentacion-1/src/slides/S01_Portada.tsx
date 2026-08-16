import { SlideLayout } from './SlideLayout'
import { Moon, Spark, Feather } from '../components/Celestial'

/**
 * Portada.
 *
 * Composición sobria y descentrada: el texto se apoya a la izquierda y
 * el dominio lunar queda al fondo, a la derecha, apenas insinuado —una
 * luna grande y muy tenue que se sale del cuadro, un arco orbital y
 * unas pocas plumas a la deriva—. Nada de alas desplegadas ni discos
 * en primer plano: el motivo se reserva para el cierre, y aquí sólo se
 * anuncia.
 */
export default function S01_Portada() {
  /** Plumas sueltas, a distintas alturas y velocidades. */
  const PLUMAS = [
    { x: 62, y: 22, s: 44, r: -14, o: 0.16, cls: 'animate-drift' },
    { x: 78, y: 62, s: 34, r: 8, o: 0.13, cls: 'animate-drift-s' },
    { x: 88, y: 34, s: 26, r: -26, o: 0.10, cls: 'animate-drift' },
    { x: 54, y: 78, s: 30, r: 18, o: 0.09, cls: 'animate-drift-s' },
  ]

  return (
    <SlideLayout style={{ padding: 0, justifyContent: 'center' }}>
      {/* ── Dominio al fondo, a la derecha ── */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {/* Luna enorme, casi apagada, cortada por el borde. Sin anillos:
            un disco con anillos se lee como un globo terráqueo de
            alambre, no como una luna. */}
        <div style={{ position: 'absolute', right: -210, top: '50%', transform: 'translateY(-50%)', opacity: 0.26 }}>
          <Moon size={640} phase="full" tone="moon" halo={false} />
        </div>

        {/* Un solo arco orbital, muy abierto, cruzando por detrás */}
        <svg
          viewBox="0 0 1280 800"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.5 }}
        >
          <ellipse
            cx="1030"
            cy="400"
            rx="430"
            ry="286"
            fill="none"
            stroke="rgba(199,181,255,0.13)"
            strokeWidth="0.8"
            transform="rotate(-18 1030 400)"
          />
        </svg>

        {/* Halo suave que la sostiene */}
        <div
          className="animate-halo"
          style={{
            position: 'absolute',
            right: -120,
            top: '50%',
            transform: 'translateY(-50%)',
            width: 620,
            height: 620,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(141,130,232,0.16) 0%, transparent 66%)',
            filter: 'blur(60px)',
          }}
        />

        {PLUMAS.map((p, i) => (
          <div
            key={i}
            className={p.cls}
            style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${i * 1.3}s` }}
          >
            <Feather size={p.s} tone={i % 2 === 0 ? 'hydro' : 'violet'} rotate={p.r} opacity={p.o} />
          </div>
        ))}
      </div>

      {/* ── Bloque de texto ── */}
      <div style={{ position: 'relative', zIndex: 3, padding: '0 78px', maxWidth: 820 }}>
        <div
          className="font-mono tag-reveal"
          style={{
            fontSize: 9.5,
            letterSpacing: '0.26em',
            color: 'var(--hydro)',
            textTransform: 'uppercase',
            marginBottom: 26,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span
            style={{
              width: 30,
              height: 1,
              background: 'linear-gradient(90deg, var(--hydro), transparent)',
              boxShadow: '0 0 8px rgba(114,199,255,0.6)',
            }}
          />
          <span>Universidad Tecnológica de Panamá · Centro Regional de Panamá Oeste</span>
        </div>

        <h1
          className="font-display title-reveal"
          style={{
            fontSize: 34,
            lineHeight: 1.1,
            fontWeight: 300,
            color: 'var(--hydro-soft)',
            margin: '0 0 4px',
            letterSpacing: '0.03em',
          }}
        >
          <span>Taller de</span>
        </h1>

        <h1
          className="font-display title-reveal"
          style={{
            fontSize: 72,
            lineHeight: 1.02,
            fontWeight: 400,
            color: 'var(--moon)',
            margin: '0 0 2px',
            letterSpacing: '0.01em',
            textShadow: '0 0 44px rgba(184,231,255,0.28)',
            animationDelay: '0.16s',
          }}
        >
          <span>Diagnóstico</span>
        </h1>

        <h1
          className="font-display title-reveal"
          style={{
            fontSize: 72,
            lineHeight: 1.02,
            fontWeight: 400,
            color: 'var(--lilac)',
            margin: '0 0 26px',
            letterSpacing: '0.01em',
            textShadow: '0 0 44px rgba(199,181,255,0.30)',
            animationDelay: '0.26s',
          }}
        >
          <span>Biomédico</span>
        </h1>

        <div
          style={{
            width: 170,
            height: 1,
            marginBottom: 24,
            background: 'linear-gradient(90deg, var(--cyan), transparent)',
            boxShadow: '0 0 12px rgba(189,248,255,0.5)',
          }}
        />

        <p
          className="stagger-item"
          style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.75, margin: '0 0 30px', maxWidth: 520 }}
        >
          <span>
            Método sistemático, instrumentación de prueba y seguridad eléctrica para el mantenimiento de equipo
            médico.
          </span>
        </p>

        <div className="stagger-item" style={{ display: 'flex', gap: 9, marginBottom: 34, flexWrap: 'wrap' }}>
          {['Clase 1 · Teoría 3 h', 'Clase 2 · Teoría 3 h', 'Clase 3 · Práctica 4 h'].map(c => (
            <span
              key={c}
              className="font-mono"
              style={{
                fontSize: 10,
                letterSpacing: '0.09em',
                padding: '5px 13px',
                color: 'var(--moon-dim)',
                background: 'rgba(23,36,74,0.42)',
                border: '1px solid rgba(184,231,255,0.16)',
                borderRadius: 999,
                backdropFilter: 'blur(6px)',
              }}
            >
              <span>{c}</span>
            </span>
          ))}
        </div>

        <div className="stagger-item" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <span
            style={{
              width: 1.5,
              height: 40,
              background: 'linear-gradient(180deg, transparent, var(--cyan), var(--violet), transparent)',
              boxShadow: '0 0 10px rgba(189,248,255,0.5)',
            }}
          />
          <div>
            <div style={{ fontSize: 15, color: 'var(--moon)', lineHeight: 1.3 }}>
              <span>Prof. Ing. Bryan Rodríguez</span>
            </div>
            <div
              className="font-mono"
              style={{ fontSize: 9.5, color: 'var(--moon-faint)', letterSpacing: '0.14em', marginTop: 3 }}
            >
              <span>INGENIERÍA BIOMÉDICA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Remate discreto en la esquina, como el ✦ del §12 */}
      <Spark
        size={11}
        tone="cyan"
        className="animate-mote"
        style={{ position: 'absolute', left: 78, bottom: 34, opacity: 0.5 }}
      />
    </SlideLayout>
  )
}
