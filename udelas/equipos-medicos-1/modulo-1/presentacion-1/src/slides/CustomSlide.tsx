import { At, Ghost, Halo, Eyebrow, Title, Ac, CY, VI, WD, WF, dly } from './Stage'
import type { CustomSlide as CustomSlideData } from '../editor/types'

/**
 * Plantillas para las diapositivas que se crean desde el modo editor.
 *
 * Solo aportan el esqueleto y textos de relleno con el lenguaje del deck: el
 * contenido real se escribe encima con el editor, igual que en cualquier otra
 * diapositiva. Componen igual que las demás —en absoluto sobre el escenario, sin
 * tarjetas— para que una lámina agregada a mitad de clase no rompa el ritmo.
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
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="§" side="right" size={480} top={190} opacity={0.03} />
      <Halo x={260} y={340} size={860} color="rgba(0,212,255,0.16)" />
      <Halo x={1200} y={700} size={620} color="rgba(109,40,217,0.18)" />

      <At l={100} t={244} anim="none">
        <Eyebrow d={0}><span>Nueva sección</span></Eyebrow>
      </At>

      <At l={94} t={292} w={860} anim="none">
        <Title size={76} d={1}>
          <span>Título de la sección</span>
        </Title>
      </At>

      <At l={-60} t={452} w={620} h={2} z={1} anim="none">
        <div
          className="span-x"
          style={{ width: '100%', height: 2, background: `linear-gradient(90deg, transparent, ${CY})`, boxShadow: `0 0 16px ${CY}66`, ...dly(3) }}
        />
      </At>

      <At l={100} t={492} w={700} d={4}>
        <p style={{ fontSize: 21, color: WD, margin: 0, lineHeight: 1.65, fontWeight: 300 }}>
          <span>Una bajada breve que anuncie de qué trata el bloque que viene.</span>
        </p>
      </At>
    </div>
  )
}

function BulletsTemplate({ items }: { items: number }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="•" side="right" size={420} top={220} opacity={0.026} />
      <Halo x={180} y={240} size={660} color="rgba(0,212,255,0.14)" />
      <Halo x={1220} y={680} size={640} color="rgba(37,99,235,0.16)" />

      <At l={100} t={84} anim="none">
        <Eyebrow d={0}><span>Sección</span></Eyebrow>
      </At>

      <At l={94} t={124} w={880} anim="none">
        <Title size={52} d={1}>
          <span>Título de la diapositiva</span>
        </Title>
      </At>

      {range(items).map(i => (
        <At key={i} l={100 + i * 26} t={244 + i * 84} w={940} d={2 + i} anim="drift">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}>
            <span
              className="font-mono"
              style={{ fontSize: 14, color: CY, opacity: 0.55, flexShrink: 0, width: 34 }}
            >
              <span>{String(i + 1).padStart(2, '0')}</span>
            </span>
            <p style={{ fontSize: 20, color: WD, margin: 0, lineHeight: 1.6, fontWeight: 300, maxWidth: 820 }}>
              <span>{`Escribe aquí el punto ${i + 1}.`}</span>
            </p>
          </div>
        </At>
      ))}
    </div>
  )
}

function TextTemplate() {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="¶" side="right" size={440} top={210} opacity={0.026} />
      <Halo x={240} y={280} size={720} color="rgba(0,212,255,0.15)" />
      <Halo x={1200} y={700} size={640} color="rgba(109,40,217,0.16)" />

      <At l={100} t={92} anim="none">
        <Eyebrow d={0}><span>Sección</span></Eyebrow>
      </At>

      <At l={94} t={132} w={900} anim="none">
        <Title size={54} d={1}>
          <span>Título de la diapositiva</span>
        </Title>
      </At>

      <At l={100} t={286} w={900} d={3}>
        <p style={{ fontSize: 22, color: WD, margin: 0, lineHeight: 1.72, fontWeight: 300 }}>
          <span>
            Escribe aquí el desarrollo de la idea. Este párrafo admite el largo que necesites; la
            diapositiva se acomoda sola.
          </span>
        </p>
      </At>

      <At l={100} t={520} w={860} d={6}>
        <div style={{ paddingLeft: 20, borderLeft: `2px solid ${CY}` }}>
          <p className="font-mono" style={{ fontSize: 15, color: WF, margin: 0, lineHeight: 1.7 }}>
            <span>Nota, dato clave o pregunta para la clase.</span>
          </p>
        </div>
      </At>
    </div>
  )
}

function TwoColTemplate({ items }: { items: number }) {
  const cols = [
    { color: CY, l: 100, t: 250 },
    { color: VI, l: 800, t: 330 },
  ]
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <Ghost text="II" side="right" size={460} top={200} opacity={0.026} font="mono" />
      <Halo x={260} y={420} size={720} color="rgba(0,212,255,0.14)" />
      <Halo x={1120} y={560} size={700} color="rgba(167,139,250,0.16)" />

      <At l={100} t={84} anim="none">
        <Eyebrow d={0}><span>Sección</span></Eyebrow>
      </At>

      <At l={94} t={124} w={900} anim="none">
        <Title size={52} d={1}>
          <span>Comparación</span> <Ac><span>lado a lado</span></Ac>
        </Title>
      </At>

      {cols.map((c, col) => (
        <At key={col} l={c.l} t={c.t} w={480} d={2 + col * 3} anim={col === 0 ? 'drift' : 'drift-r'}>
          <h3
            className="font-display"
            style={{ fontSize: 30, color: c.color, margin: '0 0 16px', textShadow: `0 0 30px ${c.color}55` }}
          >
            <span>{`Columna ${col + 1}`}</span>
          </h3>
          <div
            className="span-x"
            style={{ width: 200, height: 1, background: `linear-gradient(90deg, ${c.color}88, transparent)`, marginBottom: 22, ...dly(3 + col * 3) }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {range(items).map(i => (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
                <span
                  style={{
                    width: 14, height: 1, flexShrink: 0, background: c.color, opacity: 0.7,
                    transform: 'translateY(-5px)',
                  }}
                />
                <p style={{ fontSize: 16.5, color: WD, margin: 0, lineHeight: 1.6, fontWeight: 300 }}>
                  <span>{`Punto ${i + 1} de la columna ${col + 1}.`}</span>
                </p>
              </div>
            ))}
          </div>
        </At>
      ))}
    </div>
  )
}
