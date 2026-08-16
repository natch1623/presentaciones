import { SlideLayout, SlideTag, SlideTitle, Glass, Hydro, Lunar, Callout } from './SlideLayout'
import { Moon, Spark } from '../components/Celestial'

/**
 * Falla · error · avería. Tres términos que el habla cotidiana mezcla
 * y que el método necesita separados.
 *
 * Los tres paneles se leen de derecha a izquierda —de lo que se ve a
 * lo que hay que encontrar—, y debajo la flecha invierte el sentido:
 * el daño se propaga hacia afuera, el diagnóstico camina hacia adentro.
 */
export default function S07_TresConceptos() {
  const CONCEPTOS = [
    {
      t: 'Falla',
      en: 'fault',
      tono: 'violet' as const,
      fase: 'crescent' as const,
      d: 'La causa física o condición anómala en el nivel del componente o del circuito.',
      ej: 'Una resistencia abierta, una soldadura fría, un electrodo descalibrado, un contacto oxidado.',
      rol: 'Es lo que hay que encontrar y corregir.',
    },
    {
      t: 'Error',
      en: 'error',
      tono: 'hydro' as const,
      fase: 'eclipse' as const,
      d: 'La manifestación de la falla en el valor de una señal o variable interna.',
      ej: 'Una tensión que debía ser 5 V y es 0 V; una SpO₂ calculada errónea.',
      rol: 'Es el rastro medible que deja la falla.',
    },
    {
      t: 'Avería',
      en: 'failure',
      tono: 'cyan' as const,
      fase: 'full' as const,
      d: 'La pérdida de la función esperada, tal como la percibe el usuario.',
      ej: '«No enciende», «no infunde», «marca un valor imposible».',
      rol: 'Es el síntoma con el que llega el equipo al taller.',
    },
  ]

  return (
    <SlideLayout>
      <SlideTag tone="violet">
        <span>Bloque 1 · 1.1</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>Falla, error y avería:</span> <Hydro><span>tres conceptos distintos</span></Hydro>
      </SlideTitle>

      <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6, margin: '0 0 18px', maxWidth: 940 }}>
        <span>
          La norma y la literatura de confiabilidad los distinguen con precisión. Mantenerlos separados es lo que
          evita confundir el síntoma con la causa.
        </span>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, flex: 1, minHeight: 0 }}>
        {CONCEPTOS.map((c, i) => (
          <Glass
            key={c.t}
            tone={c.tono}
            ornament
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '20px 20px 22px',
              animation: `gravityPull 0.95s cubic-bezier(0.22,1,0.36,1) ${0.12 + i * 0.14}s both`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <Moon size={40} phase={c.fase} tone={c.tono} halo={false} />
              <div>
                <div className="font-display" style={{ fontSize: 27, color: 'var(--moon)', lineHeight: 1 }}>
                  <span>{c.t}</span>
                </div>
                <div
                  className="font-mono"
                  style={{ fontSize: 9.5, color: 'var(--moon-faint)', letterSpacing: '0.16em', marginTop: 4 }}
                >
                  <span>{c.en.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <p style={{ fontSize: 13, color: 'var(--moon-dim)', lineHeight: 1.6, margin: '0 0 12px' }}>
              <span>{c.d}</span>
            </p>

            <p style={{ fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.55, margin: '0 0 14px', fontStyle: 'italic' }}>
              <span>{c.ej}</span>
            </p>

            <div style={{ flex: 1 }} />

            <div style={{ display: 'flex', gap: 9, alignItems: 'flex-start' }}>
              <Spark size={10} tone={c.tono} style={{ marginTop: 3 }} />
              <span style={{ fontSize: 12, color: 'var(--moon)', lineHeight: 1.5 }}>
                <span>{c.rol}</span>
              </span>
            </div>
          </Glass>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <Callout kind="violet" title="El camino inverso">
          El daño se propaga de la <Lunar>falla</Lunar> al <Lunar>error</Lunar> y de ahí a la <Lunar>avería</Lunar>.
          El diagnóstico recorre esa cadena al revés: se parte de la avería, se localiza el error y se llega a la
          causa raíz.
        </Callout>
      </div>
    </SlideLayout>
  )
}
