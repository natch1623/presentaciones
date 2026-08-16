import { SlideLayout, SlideTag, SlideTitle, Glass, Hydro } from './SlideLayout'
import { Moon, Spark } from '../components/Celestial'
import type { CustomSlide as CustomSlideData } from '../editor/types'

/**
 * Plantillas para las diapositivas que se crean desde el modo editor.
 *
 * Solo aportan el esqueleto y textos de relleno con el estilo del deck:
 * el contenido real se escribe encima con el editor, igual que en
 * cualquier otra diapositiva.
 *
 * Cada texto va envuelto en su propio elemento (un `<span>` incluso
 * donde no haría falta) para que el editor pueda tomarlo con un clic:
 * un elemento que mezcla texto con otros elementos solo se puede editar
 * desde el panel.
 */
export default function CustomSlide({ data }: { data: CustomSlideData }) {
  switch (data.kind) {
    case 'section':
      return <SectionTemplate />
    case 'bullets':
      return <BulletsTemplate items={data.items} />
    case 'twocol':
      return <TwoColTemplate items={data.items} />
    default:
      return <TextTemplate />
  }
}

const range = (n: number) => Array.from({ length: n }, (_, i) => i)

function SectionTemplate() {
  return (
    <SlideLayout style={{ alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <Moon size={92} phase="crescent" tone="violet" rings={1} style={{ marginBottom: 22 }} />

      <SlideTag tone="violet">
        <span>Nueva sección</span>
      </SlideTag>

      <h2
        className="font-display title-reveal"
        style={{ fontSize: 52, lineHeight: 1.14, color: 'var(--moon)', margin: '0 0 18px', fontWeight: 400, maxWidth: 900 }}
      >
        <span>Título de la sección</span>
      </h2>

      <div
        style={{
          width: 120,
          height: 1.5,
          marginBottom: 22,
          background: 'linear-gradient(90deg, transparent, var(--hydro), transparent)',
          boxShadow: '0 0 12px var(--hydro)',
        }}
      />

      <p className="stagger-item" style={{ fontSize: 17, color: 'var(--text-2)', margin: 0, maxWidth: 640, lineHeight: 1.75 }}>
        <span>Una bajada breve que anuncie de qué trata el bloque que viene.</span>
      </p>
    </SlideLayout>
  )
}

function BulletsTemplate({ items }: { items: number }) {
  return (
    <SlideLayout>
      <SlideTag>
        <span>Sección</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>Título de la diapositiva</span>
      </SlideTitle>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0, justifyContent: 'center' }}>
        {range(items).map(i => (
          <div
            key={i}
            className="moon-panel"
            style={{
              display: 'flex',
              gap: 14,
              alignItems: 'flex-start',
              padding: '14px 18px',
              animation: `glideIn 0.7s cubic-bezier(0.22,1,0.36,1) ${0.08 + i * 0.08}s both`,
            }}
          >
            <span className="font-mono" style={{ fontSize: 13, color: 'var(--hydro)', flexShrink: 0, paddingTop: 1, minWidth: 22 }}>
              {String(i + 1).padStart(2, '0')}
            </span>
            <p style={{ fontSize: 14, color: 'var(--text-2)', margin: 0, lineHeight: 1.65 }}>
              {/* Una sola expresión, no texto + {i}: así el `span` contiene
                  un único nodo de texto y el editor lo toma con un clic. */}
              <span>{`Escribe aquí el punto ${i + 1}.`}</span>
            </p>
          </div>
        ))}
      </div>
    </SlideLayout>
  )
}

function TextTemplate() {
  return (
    <SlideLayout>
      <SlideTag>
        <span>Sección</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>Título de la diapositiva</span>
      </SlideTitle>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, flex: 1, minHeight: 0, justifyContent: 'center' }}>
        <p className="stagger-item" style={{ fontSize: 16, color: 'var(--text-2)', margin: 0, lineHeight: 1.85, maxWidth: 900 }}>
          <span>
            Escribe aquí el desarrollo de la idea. Este párrafo admite el largo que necesites; la diapositiva se
            acomoda sola.
          </span>
        </p>

        <Glass style={{ maxWidth: 900 }} ornament>
          <p className="font-mono" style={{ fontSize: 12.5, color: 'var(--hydro)', margin: 0, lineHeight: 1.7 }}>
            <span>Nota, dato clave o pregunta para la clase.</span>
          </p>
        </Glass>
      </div>
    </SlideLayout>
  )
}

function TwoColTemplate({ items }: { items: number }) {
  return (
    <SlideLayout>
      <SlideTag>
        <span>Sección</span>
      </SlideTag>
      <SlideTitle size="md">
        <span>Comparación</span> <Hydro><span>lado a lado</span></Hydro>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, flex: 1, minHeight: 0 }}>
        {(['hydro', 'violet'] as const).map((tone, col) => (
          <Glass key={tone} tone={tone} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Moon size={22} phase={col === 0 ? 'crescent' : 'full'} tone={tone} halo={false} />
              <p
                className="font-display"
                style={{ fontSize: 23, color: tone === 'hydro' ? 'var(--hydro)' : 'var(--lilac)', margin: 0 }}
              >
                <span>{`Dominio ${col + 1}`}</span>
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {range(items).map(i => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <Spark size={9} tone={tone} style={{ marginTop: 5 }} />
                  <p style={{ fontSize: 13.5, color: 'var(--text-2)', margin: 0, lineHeight: 1.6 }}>
                    <span>{`Punto ${i + 1} del dominio ${col + 1}.`}</span>
                  </p>
                </div>
              ))}
            </div>
          </Glass>
        ))}
      </div>
    </SlideLayout>
  )
}
