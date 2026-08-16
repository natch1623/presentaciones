import { SlideLayout, SlideTag, SlideTitle, Glass, Hydro, Badge, Callout } from './SlideLayout'
import { Moon, Spark } from '../components/Celestial'

/**
 * Estructura general del taller: tres sesiones, dos de teoría y una de
 * laboratorio. Cada clase es una luna en distinta fase —el taller
 * avanza de la oscuridad a la luz, como pide la regla de oro (§31)—.
 */
export default function S03_Estructura() {
  const CLASES = [
    {
      n: '01',
      fase: 'crescent' as const,
      tono: 'violet' as const,
      titulo: 'Clase 1 · Teoría',
      dur: '3.0 h',
      bloques: [
        'Fundamentos y modos de falla',
        'Modelo de bloques funcionales',
        'Metodología del diagnóstico',
        'Técnicas y árboles de decisión',
        'Instrumentos de prueba',
      ],
    },
    {
      n: '02',
      fase: 'eclipse' as const,
      tono: 'hydro' as const,
      titulo: 'Clase 2 · Teoría',
      dur: '3.0 h',
      bloques: [
        'Seguridad eléctrica IEC 60601‑1',
        'Fallas por familia de equipo',
        'Documentación, verificación y cierre',
      ],
    },
    {
      n: '03',
      fase: 'full' as const,
      tono: 'cyan' as const,
      titulo: 'Clase 3 · Práctica',
      dur: '4.0 h',
      bloques: [
        'Manejo de instrumentos',
        'Casos guiados I y II',
        'Seguridad eléctrica en banco',
        'Evaluación práctica final',
      ],
    },
  ]

  return (
    <SlideLayout>
      <SlideTag>
        <span>Estructura general</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>Tres sesiones,</span> <Hydro><span>un solo método</span></Hydro>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, flex: 1, minHeight: 0 }}>
        {CLASES.map((c, i) => (
          <Glass
            key={c.n}
            tone={c.tono}
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '20px 20px 18px',
              animation: `veilRise 0.85s cubic-bezier(0.22,1,0.36,1) ${0.1 + i * 0.12}s both`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 14 }}>
              <Moon size={46} phase={c.fase} tone={c.tono} halo={false} />
              <div>
                <div className="font-display" style={{ fontSize: 22, color: 'var(--moon)', lineHeight: 1.1 }}>
                  <span>{c.titulo}</span>
                </div>
                <div className="font-mono" style={{ fontSize: 9.5, color: 'var(--moon-faint)', letterSpacing: '0.14em', marginTop: 3 }}>
                  <span>{c.dur}</span>
                </div>
              </div>
            </div>

            <div className="orbit-divider" style={{ marginBottom: 14 }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {c.bloques.map(b => (
                <div key={b} style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                  <Spark size={8} tone={c.tono} style={{ marginTop: 4 }} />
                  <span style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>
                    <span>{b}</span>
                  </span>
                </div>
              ))}
            </div>

            <div style={{ flex: 1 }} />

            <div style={{ marginTop: 14 }}>
              <Badge tone={c.tono}>{i === 2 ? 'Laboratorio' : 'Expositiva'}</Badge>
            </div>
          </Glass>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <Callout kind="hydro" title="Cómo usar este material">
          Las Clases 1 y 2 son expositivas: conviene proyectar los diagramas de bloques, las tablas de referencia y
          los árboles de decisión mientras se desarrolla cada apartado. La Clase 3 retoma todo sobre equipo real con
          fallas insertadas de forma controlada.
        </Callout>
      </div>
    </SlideLayout>
  )
}
