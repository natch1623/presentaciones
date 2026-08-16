import { SlideLayout } from './SlideLayout'
import { Moon, Wings, Spark, WaveLine } from '../components/Celestial'

/**
 * Conclusión. Recupera la estética de la portada —mucho espacio, poco
 * texto— y aquí sí se abren las alas: es el punto de la narrativa
 * visual donde la oscuridad del inicio se ha convertido en luz.
 *
 * Aun así se mantienen tenues: el protagonista es la frase.
 */
export default function S56_Conclusion() {
  return (
    <SlideLayout style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 0 }}>
      {/* Las alas se abren por debajo del texto, no detrás: cruzadas
          con los renglones el plumaje se lee como un destello de
          púas en vez de un ala. */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '50%',
          top: '82%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      >
        <Wings width={1120} tone="moon" opacity={0.30} />
      </div>

      {/* Halo suave que sostiene la frase */}
      <div
        aria-hidden
        className="animate-halo"
        style={{
          position: 'absolute',
          left: '50%',
          top: '44%',
          width: 780,
          height: 520,
          marginLeft: -390,
          marginTop: -260,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(141,130,232,0.16) 0%, transparent 68%)',
          filter: 'blur(48px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 2, marginBottom: 30 }}>
        <Moon size={120} phase="eclipse" tone="violet" rings={2} className="crystal-in" />
      </div>

      <div style={{ position: 'relative', zIndex: 2, maxWidth: 860 }}>
        <div
          className="font-mono tag-reveal"
          style={{
            fontSize: 10,
            letterSpacing: '0.32em',
            color: 'var(--hydro)',
            textTransform: 'uppercase',
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
          }}
        >
          <Spark size={9} tone="cyan" />
          <span>Conclusión</span>
          <Spark size={9} tone="cyan" />
        </div>

        <h2
          className="font-display title-reveal"
          style={{ fontSize: 40, lineHeight: 1.35, color: 'var(--moon)', margin: '0 0 30px', fontWeight: 300 }}
        >
          <span>
            El diagnóstico no termina cuando el equipo vuelve a encender: termina cuando se verifica que opera
            dentro de tolerancia, que es seguro, y queda escrito.
          </span>
        </h2>

        <div
          style={{
            width: 200,
            height: 1,
            margin: '0 auto 28px',
            background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)',
            boxShadow: '0 0 14px rgba(189,248,255,0.55)',
          }}
        />

        <p
          className="stagger-item"
          style={{ fontSize: 14.5, color: 'var(--text-2)', lineHeight: 1.8, margin: '0 auto', maxWidth: 620 }}
        >
          <span>
            Oscuridad, conocimiento, iluminación: del síntoma con el que llega el equipo, al método que lo explica,
            al registro que lo deja disponible para el próximo que lo necesite.
          </span>
        </p>
      </div>

      <div
        aria-hidden
        style={{ position: 'absolute', left: 0, right: 0, bottom: 34, display: 'flex', justifyContent: 'center' }}
      >
        <WaveLine width={680} height={40} tone="hydro" opacity={0.3} />
      </div>
    </SlideLayout>
  )
}
