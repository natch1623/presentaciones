import { SlideLayout, SlideTag, Glass, Hydro, Lunar, Chip } from './SlideLayout'
import { Wings, Moon, Spark } from '../components/Celestial'

/**
 * Punto clave del bloque 7. Es una de las tres diapositivas donde
 * reaparece el motivo de las alas —aquí en silueta, muy tenue— porque
 * marca el momento en que las siete familias se resuelven en una sola
 * conclusión.
 */
export default function S49_PatronTransversal() {
  const ACCESORIOS = ['Cables', 'Sensores', 'Sets de infusión', 'Electrodos', 'Celdas de O₂', 'Palas y parches']

  return (
    <SlideLayout style={{ justifyContent: 'center' }}>
      <div
        aria-hidden
        style={{
          position: 'absolute',
          left: '50%',
          top: '46%',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      >
        <Wings width={880} tone="hydro" variant="silhouette" opacity={0.14} />
      </div>

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>
          <SlideTag tone="violet">
            <span>Bloque 7 · patrón transversal</span>
          </SlideTag>
        </div>

        <h2
          className="font-display title-reveal"
          style={{ fontSize: 42, lineHeight: 1.18, color: 'var(--moon)', margin: '0 0 22px', fontWeight: 400 }}
        >
          <span>En casi todas las familias, las fallas de mayor riesgo clínico</span>{' '}
          <Hydro>
            <span>son las degradadas</span>
          </Hydro>
        </h2>

        <div
          style={{
            width: 190,
            height: 1,
            margin: '0 auto 30px',
            background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)',
            boxShadow: '0 0 12px rgba(189,248,255,0.5)',
          }}
        />
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 22,
          maxWidth: 940,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <Glass tone="alert" ornament style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Moon size={34} phase="eclipse" tone="alert" halo={false} />
            <span className="font-display" style={{ fontSize: 22, color: 'var(--moon)' }}>
              <span>El equipo opera fuera de tolerancia</span>
            </span>
          </div>
          <p style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.7, margin: 0 }}>
            <span>
              No hay alarma, no hay apagado, no hay síntoma que reportar. La falla degradada sólo aparece cuando
              alguien mide contra un patrón.
            </span>
          </p>
        </Glass>

        <Glass tone="cyan" ornament style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Moon size={34} phase="full" tone="cyan" halo={false} />
            <span className="font-display" style={{ fontSize: 22, color: 'var(--moon)' }}>
              <span>Los accesorios concentran las fallas reales</span>
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {ACCESORIOS.map(a => (
              <Chip key={a} tone="cyan">
                {a}
              </Chip>
            ))}
          </div>
        </Glass>
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 13,
          marginTop: 28,
        }}
      >
        <Spark size={13} tone="cyan" />
        <p className="font-display" style={{ fontSize: 25, color: 'var(--lilac)', margin: 0, textAlign: 'center' }}>
          <span>Empezar por accesorios y verificar tolerancia al cerrar es, estadísticamente, la mejor estrategia.</span>
        </p>
        <Spark size={13} tone="cyan" />
      </div>

      <p
        style={{
          position: 'relative',
          zIndex: 2,
          fontSize: 12,
          color: 'var(--moon-faint)',
          textAlign: 'center',
          margin: '14px auto 0',
          maxWidth: 720,
          lineHeight: 1.6,
        }}
      >
        <span>Y es también la razón por la que el método termina en </span>
        <Lunar>
          <span>verificación y documentación</span>
        </Lunar>
        <span>, no en la reparación.</span>
      </p>
    </SlideLayout>
  )
}
