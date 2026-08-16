import { SlideLayout } from './SlideLayout'
import { Moon, Spark, Feather } from '../components/Celestial'

/**
 * Diapositiva final: prácticamente una escena. Fondo oscuro, luna,
 * partículas y un halo detrás del título. No hace falta más.
 */
export default function S57_Gracias() {
  const PLUMAS = [
    { x: 16, y: 26, s: 40, r: -12, o: 0.14 },
    { x: 82, y: 32, s: 34, r: 16, o: 0.12 },
    { x: 26, y: 74, s: 28, r: 22, o: 0.10 },
    { x: 76, y: 70, s: 36, r: -20, o: 0.11 },
  ]

  return (
    <SlideLayout style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 0 }}>
      {/* Halo detrás del título */}
      <div
        aria-hidden
        className="animate-halo"
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 700,
          height: 700,
          marginLeft: -350,
          marginTop: -350,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(141,130,232,0.22) 0%, rgba(114,199,255,0.07) 42%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />

      {PLUMAS.map((p, i) => (
        <div
          key={i}
          aria-hidden
          className={i % 2 === 0 ? 'animate-drift' : 'animate-drift-s'}
          style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${i * 1.1}s` }}
        >
          <Feather size={p.s} tone={i % 2 === 0 ? 'hydro' : 'violet'} rotate={p.r} opacity={p.o} />
        </div>
      ))}

      <div style={{ position: 'relative', zIndex: 2, marginBottom: 34 }}>
        <Moon size={150} phase="crescent" tone="moon" className="crystal-in" />
      </div>

      <div style={{ position: 'relative', zIndex: 2 }}>
        <h1
          className="font-display title-reveal"
          style={{
            fontSize: 76,
            lineHeight: 1.05,
            fontWeight: 300,
            color: 'var(--moon)',
            margin: '0 0 18px',
            letterSpacing: '0.08em',
            textShadow: '0 0 50px rgba(184,231,255,0.35), 0 0 100px rgba(141,130,232,0.25)',
          }}
        >
          <span>Gracias</span>
        </h1>

        <div
          style={{
            width: 160,
            height: 1,
            margin: '0 auto 22px',
            background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)',
            boxShadow: '0 0 12px rgba(189,248,255,0.6)',
          }}
        />

        <div
          className="stagger-item"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            fontSize: 17,
            color: 'var(--hydro-soft)',
            letterSpacing: '0.14em',
            marginBottom: 40,
          }}
        >
          <Spark size={10} tone="cyan" />
          <span>Preguntas</span>
          <Spark size={10} tone="cyan" />
        </div>

        <div className="stagger-item" style={{ fontSize: 14, color: 'var(--moon-dim)', lineHeight: 1.6 }}>
          <span>Prof. Ing. Bryan Rodríguez</span>
        </div>
        <div
          className="stagger-item font-mono"
          style={{ fontSize: 9.5, color: 'var(--moon-faint)', letterSpacing: '0.18em', marginTop: 6 }}
        >
          <span>UNIVERSIDAD TECNOLÓGICA DE PANAMÁ · CENTRO REGIONAL DE PANAMÁ OESTE</span>
        </div>
      </div>
    </SlideLayout>
  )
}
