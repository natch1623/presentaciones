import { SlideLayout, SlideTag, SlideTitle, Glass, Hydro, Lunar, Callout } from './SlideLayout'
import { Moon, Spark } from '../components/Celestial'

/**
 * El criterio de «equipo apto para uso»: tres condiciones, todas
 * obligatorias.
 *
 * Es la salvaguarda final frente a las fallas degradadas y el cierre
 * conceptual del método completo, así que las tres condiciones van
 * como tres lunas alineadas convergiendo en el veredicto.
 */
export default function S53_AptoParaUso() {
  const CONDICIONES = [
    {
      n: 'a',
      t: 'El síntoma original se resolvió',
      d: 'La avería con la que llegó el equipo ya no se reproduce.',
      tono: 'hydro' as const,
      fase: 'crescent' as const,
    },
    {
      n: 'b',
      t: 'Opera dentro de tolerancia funcional verificada',
      d: 'Comprobado con simuladores y analizadores frente al patrón, no a ojo.',
      tono: 'violet' as const,
      fase: 'eclipse' as const,
    },
    {
      n: 'c',
      t: 'Cumple los límites de seguridad eléctrica',
      d: 'Continuidad de tierra y corrientes de fuga dentro de los límites de IEC 60601‑1.',
      tono: 'cyan' as const,
      fase: 'full' as const,
    },
  ]

  return (
    <SlideLayout>
      <SlideTag>
        <span>Bloque 8 · 8.3 y 8.4</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>Equipo</span> <Hydro><span>apto para uso</span></Hydro>
      </SlideTitle>

      <p style={{ fontSize: 13.5, color: 'var(--text-2)', lineHeight: 1.7, margin: '0 0 20px', maxWidth: 960 }}>
        <span>
          Antes de devolver el equipo se comprueban dos dimensiones —funcional y de seguridad—, ambas obligatorias.
          Un equipo se declara apto sólo cuando se cumplen las tres condiciones siguientes.
        </span>
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          flex: 1,
          minHeight: 0,
          alignContent: 'center',
          alignItems: 'start',
        }}
      >
        {CONDICIONES.map((c, i) => (
          <Glass
            key={c.n}
            tone={c.tono}
            ornament
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              gap: 14,
              padding: '24px 22px',
              animation: `gravityPull 0.95s cubic-bezier(0.22,1,0.36,1) ${0.14 + i * 0.15}s both`,
            }}
          >
            <Moon size={72} phase={c.fase} tone={c.tono} rings={1}>
              <span className="font-rune" style={{ fontSize: 26, color: 'var(--moon)' }}>
                {c.n}
              </span>
            </Moon>

            <div className="font-display" style={{ fontSize: 22, color: 'var(--moon)', lineHeight: 1.25 }}>
              <span>{c.t}</span>
            </div>

            <p style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.6, margin: 0 }}>
              <span>{c.d}</span>
            </p>
          </Glass>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 18 }}>
        <Callout kind="alert" title="Si falta cualquiera de las tres">
          El equipo permanece <Lunar>fuera de servicio</Lunar> y etiquetado como tal. No es una decisión negociable
          con el servicio clínico.
        </Callout>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '11px 16px',
            borderRadius: '2px 10px 10px 2px',
            borderLeft: '1.5px solid var(--verdant)',
            background: 'linear-gradient(95deg, rgba(143,227,200,0.08) 0%, rgba(8,13,36,0) 90%)',
          }}
        >
          <Spark size={13} tone="verdant" />
          <p style={{ fontSize: 12.5, color: 'var(--moon-dim)', margin: 0, lineHeight: 1.6 }}>
            <span>
              Verificar dentro de tolerancia, verificar seguridad y documentar: eso es lo que distingue el
              mantenimiento biomédico profesional de la simple reparación electrónica.
            </span>
          </p>
        </div>
      </div>
    </SlideLayout>
  )
}
