import { SlideLayout, SlideTag, SlideTitle, Card, CyanAccent } from './SlideLayout'
import type { CustomSlide as CustomSlideData } from '../editor/types'

/**
 * Plantillas para las diapositivas que se crean desde el modo editor.
 *
 * Solo aportan el esqueleto y textos de relleno con el estilo del deck: el
 * contenido real se escribe encima con el editor, igual que en cualquier otra
 * diapositiva.
 *
 * Cada texto va envuelto en su propio elemento (un `<span>` incluso donde no
 * haría falta) para que el editor pueda tomarlo con un clic: un elemento que
 * mezcla texto con otros elementos solo se puede editar desde el panel.
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
      <SlideTag><span>Nueva sección</span></SlideTag>
      <h2
        className="font-display title-reveal"
        style={{ fontSize: 54, lineHeight: 1.14, color: 'var(--white)', margin: '0 0 18px', fontWeight: 400, maxWidth: 900 }}
      >
        <span>Título de la sección</span>
      </h2>
      <div
        style={{
          width: 120, height: 2, marginBottom: 22,
          background: 'linear-gradient(90deg, transparent, var(--cyan-bright), transparent)',
          boxShadow: '0 0 12px var(--cyan-bright)',
        }}
      />
      <p className="stagger-item" style={{ fontSize: 17, color: 'var(--white-dim)', margin: 0, maxWidth: 640, lineHeight: 1.7 }}>
        <span>Una bajada breve que anuncie de qué trata el bloque que viene.</span>
      </p>
    </SlideLayout>
  )
}

function BulletsTemplate({ items }: { items: number }) {
  return (
    <SlideLayout>
      <SlideTag><span>Sección</span></SlideTag>
      <SlideTitle size="md">
        <span>Título de la diapositiva</span>
      </SlideTitle>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flex: 1, minHeight: 0, justifyContent: 'center' }}>
        {range(items).map(i => (
          <div
            key={i}
            className="card-hover"
            style={{
              display: 'flex', gap: 14, alignItems: 'flex-start',
              padding: '14px 18px',
              background: 'linear-gradient(90deg, rgba(10,26,74,0.7), rgba(6,15,46,0.9))',
              border: '1px solid rgba(0,212,255,0.12)',
              borderLeft: '2px solid rgba(0,212,255,0.5)',
              borderRadius: 10,
              animation: `fadeSlideLeft 0.45s cubic-bezier(0.22,1,0.36,1) ${0.08 + i * 0.08}s both`,
            }}
          >
            <span
              className="font-mono"
              style={{ fontSize: 13, color: 'var(--cyan-bright)', flexShrink: 0, paddingTop: 1, minWidth: 22 }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
            <p style={{ fontSize: 14, color: 'var(--white-dim)', margin: 0, lineHeight: 1.65 }}>
              {/* Una sola expresión, no texto + {i}: así el `span` contiene un
                  único nodo de texto y el editor puede tomarlo con un clic. */}
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
      <SlideTag><span>Sección</span></SlideTag>
      <SlideTitle size="md">
        <span>Título de la diapositiva</span>
      </SlideTitle>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18, flex: 1, minHeight: 0, justifyContent: 'center' }}>
        <p className="stagger-item" style={{ fontSize: 16, color: 'var(--white-dim)', margin: 0, lineHeight: 1.8, maxWidth: 900 }}>
          <span>
            Escribe aquí el desarrollo de la idea. Este párrafo admite el largo que necesites; la
            diapositiva se acomoda sola.
          </span>
        </p>

        <Card style={{ maxWidth: 900 }}>
          <p className="font-mono" style={{ fontSize: 12.5, color: 'var(--cyan-mid)', margin: 0, lineHeight: 1.7 }}>
            <span>Nota, dato clave o pregunta para la clase.</span>
          </p>
        </Card>
      </div>
    </SlideLayout>
  )
}

function TwoColTemplate({ items }: { items: number }) {
  return (
    <SlideLayout>
      <SlideTag><span>Sección</span></SlideTag>
      <SlideTitle size="md">
        <span>Comparación</span> <CyanAccent><span>lado a lado</span></CyanAccent>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, flex: 1, minHeight: 0 }}>
        {(['cyan', 'violet'] as const).map((accent, col) => (
          <Card key={accent} accent={accent} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <p
              className="font-display"
              style={{ fontSize: 22, color: accent === 'cyan' ? 'var(--cyan-bright)' : '#a78bfa', margin: 0 }}
            >
              <span>{`Columna ${col + 1}`}</span>
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {range(items).map(i => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span
                    style={{
                      width: 5, height: 5, borderRadius: '50%', flexShrink: 0, marginTop: 7,
                      background: accent === 'cyan' ? 'var(--cyan-bright)' : '#a78bfa',
                    }}
                  />
                  <p style={{ fontSize: 13.5, color: 'var(--white-dim)', margin: 0, lineHeight: 1.6 }}>
                    <span>{`Punto ${i + 1} de la columna ${col + 1}.`}</span>
                  </p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </SlideLayout>
  )
}
