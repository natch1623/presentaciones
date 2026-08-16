import { SlideLayout, SlideTag, SlideTitle, Glass, SpecTable, Hydro, Lunar, Badge, Callout } from './SlideLayout'
import { Moon, Spark } from '../components/Celestial'

/**
 * Qué viene en la Clase 3 y cómo se evalúa. Cierra la parte teórica
 * anunciando dónde se aplica todo: el laboratorio de 4 h con fallas
 * insertadas de forma controlada.
 */
export default function S54_Clase3() {
  const BLOQUES = [
    { t: 'Manejo de instrumentos', d: 'Multímetro, osciloscopio, simuladores y analizador de seguridad sobre el banco.', tono: 'hydro' as const },
    { t: 'Casos guiados I y II', d: 'Diagnóstico completo de dos fallas insertadas, siguiendo los siete pasos.', tono: 'violet' as const },
    { t: 'Seguridad eléctrica', d: 'Continuidad de tierra y corrientes de fuga sobre equipo real.', tono: 'cyan' as const },
    { t: 'Evaluación práctica final', d: 'Una falla insertada: diagnosticar, corregir, verificar y documentar.', tono: 'rose' as const },
  ]

  const EVALUACION: string[][] = [
    ['Desempeño en casos guiados', '40 %', 'Método correcto, seguridad, uso de instrumentos'],
    ['Reto práctico final', '40 %', 'Diagnóstico + corrección + verificación de una falla insertada'],
    ['Documentación de la orden de trabajo', '20 %', 'Registro completo y trazable'],
  ]

  return (
    <SlideLayout>
      <SlideTag tone="cyan">
        <span>Lo que viene</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>Clase 3 · Práctica</span> <Hydro><span>4 h de laboratorio</span></Hydro>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.05fr', gap: 28, flex: 1, minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, minWidth: 0 }}>
          {BLOQUES.map((b, i) => (
            <Glass
              key={b.t}
              tone={b.tono}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '14px 18px',
                animation: `glideIn 0.75s cubic-bezier(0.22,1,0.36,1) ${0.12 + i * 0.1}s both`,
              }}
            >
              <Moon size={34} phase="ring" tone={b.tono} halo={false}>
                <span className="font-mono" style={{ fontSize: 10, color: 'var(--moon)' }}>
                  {`0${i + 1}`}
                </span>
              </Moon>

              <div style={{ minWidth: 0 }}>
                <div className="font-display" style={{ fontSize: 21, color: 'var(--moon)', lineHeight: 1.15 }}>
                  <span>{b.t}</span>
                </div>
                <p style={{ fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.5, margin: '3px 0 0' }}>
                  <span>{b.d}</span>
                </p>
              </div>
            </Glass>
          ))}

          <Callout kind="hydro" title="Sobre equipo real">
            Las fallas se insertan de forma controlada. Lo que se evalúa no es adivinar cuál es, sino{' '}
            <Lunar>cómo se llega a ella</Lunar>.
          </Callout>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0, justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <Spark size={12} tone="cyan" />
            <span
              className="font-mono"
              style={{ fontSize: 10, letterSpacing: '0.16em', color: 'var(--cyan)', textTransform: 'uppercase' }}
            >
              <span>Esquema de evaluación</span>
            </span>
            <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(189,248,255,0.3), transparent)' }} />
          </div>

          <SpecTable
            head={['Componente', 'Peso', 'Qué evalúa']}
            cols="1.5fr 0.5fr 1.8fr"
            fontSize={12.5}
            tone="cyan"
            rows={EVALUACION}
            toneOf={(_r, c) => (c === 1 ? 'cyan' : undefined)}
          />

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 4 }}>
            <Badge tone="violet">Se mantiene del programa original</Badge>
            <Badge tone="hydro">80 % es desempeño en banco</Badge>
          </div>

          <Callout kind="verdant" title="Qué llevar a la práctica">
            Los siete pasos del método, la tabla de límites de fuga y el modelo de bloques. Con eso se resuelve
            cualquier caso del laboratorio.
          </Callout>
        </div>
      </div>
    </SlideLayout>
  )
}
