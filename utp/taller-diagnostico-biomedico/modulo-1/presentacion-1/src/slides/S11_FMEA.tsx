import { SlideLayout, SlideTag, SlideTitle, Glass, Formula, Hydro, Lunar, Bullet, Callout } from './SlideLayout'
import { Moon, Spark } from '../components/Celestial'

/**
 * El FMEA como marco mental. No se hace un FMEA completo en el taller,
 * pero su lógica es exactamente la que ordena qué comprobar primero.
 *
 * Las tres preguntas cuelgan de una órbita: la prioridad no sale de
 * una lista, sale de multiplicar tres criterios.
 */
export default function S11_FMEA() {
  const PREGUNTAS = [
    { n: '01', p: '¿De qué manera puede fallar este bloque?', tono: 'hydro' as const },
    { n: '02', p: '¿Qué efecto tiene esa falla sobre el paciente o el usuario?', tono: 'violet' as const },
    { n: '03', p: '¿Qué tan probable es, y qué tan detectable?', tono: 'cyan' as const },
  ]

  return (
    <SlideLayout>
      <SlideTag tone="violet">
        <span>Bloque 1 · 1.4</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>El FMEA como</span> <Hydro><span>marco mental</span></Hydro>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 420px', gap: 34, flex: 1, minHeight: 0, alignItems: 'center' }}>
        <div>
          <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.8, margin: '0 0 20px', maxWidth: 600 }}>
            <span>
              El Análisis de Modos de Falla y sus Efectos es la herramienta formal que interroga cada bloque
              funcional con tres preguntas. Aunque el taller no levanta un FMEA completo, esa lógica es la que guía
              la formulación de hipótesis.
            </span>
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 22 }}>
            {PREGUNTAS.map((q, i) => (
              <div
                key={q.n}
                style={{
                  display: 'flex',
                  gap: 14,
                  alignItems: 'center',
                  animation: `glideIn 0.75s cubic-bezier(0.22,1,0.36,1) ${0.16 + i * 0.12}s both`,
                }}
              >
                <Moon size={34} phase="ring" tone={q.tono} halo={false}>
                  <span className="font-mono" style={{ fontSize: 10, color: 'var(--moon)' }}>
                    {q.n}
                  </span>
                </Moon>
                <p style={{ fontSize: 14.5, color: 'var(--moon-dim)', margin: 0, lineHeight: 1.5 }}>
                  <span>{q.p}</span>
                </p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            <Bullet tone="violet">
              Pensar por adelantado, <Lunar>para cada familia de equipo</Lunar>, cuáles son sus modos de falla más
              probables y de mayor consecuencia.
            </Bullet>
            <Bullet tone="violet">Empezar por lo más probable y más barato de descartar.</Bullet>
          </div>
        </div>

        <Glass tone="cyan" ornament style={{ padding: '24px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 6 }}>
            <Spark size={11} tone="cyan" />
            <span
              className="font-mono"
              style={{ fontSize: 9.5, letterSpacing: '0.16em', color: 'var(--cyan)', textTransform: 'uppercase' }}
            >
              <span>Criterio de prioridad</span>
            </span>
          </div>

          <Formula
            tone="cyan"
            size={22}
            note={
              <span>
                Ese producto es el que ordena qué se comprueba primero. Una falla poco probable pero catastrófica e
                indetectable puede pesar más que una frecuente y evidente.
              </span>
            }
          >
            <span>probabilidad × severidad × dificultad de detección</span>
          </Formula>
        </Glass>
      </div>

      <div style={{ marginTop: 14 }}>
        <Callout kind="hydro" title="Enlace con el bloque 7">
          Esta es exactamente la razón por la que la Clase 2 dedica un bloque entero a las fallas típicas de cada
          familia de equipo: es el catálogo de hipótesis con el que se llega al banco sin partir de cero.
        </Callout>
      </div>
    </SlideLayout>
  )
}
