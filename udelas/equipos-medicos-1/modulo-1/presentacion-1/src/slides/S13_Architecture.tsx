import { SlideLayout, SlideTitle, CyanAccent, Card } from './SlideLayout'

const reqs = [
  { el: 'Superficie', req: 'Mínimo ~36 m²; 42–60 m² para cardiovascular, ortopédica o robótica', reason: 'Espacio para equipos, circulación estéril y personal' },
  { el: 'Altura libre', req: '≥ 3.00 m', reason: 'Alojar lámpara, brazos pendulares y difusores de aire' },
  { el: 'Puertas', req: 'Correderas/deslizantes, nunca abatibles; con visor', reason: 'Las abatibles provocan fluctuaciones de aire y riesgo de contaminación' },
  { el: 'Paredes y techo', req: 'Lisos, duros, impermeables, no porosos, juntas selladas', reason: 'Facilitar limpieza terminal y evitar reservorios microbianos' },
  { el: 'Ángulos', req: 'Uniones pared-piso y pared-pared redondeadas (sanitarias)', reason: 'Eliminan esquinas donde se acumula suciedad' },
  { el: 'Piso', req: 'Continuo, antideslizante, conductivo/disipativo, sin juntas', reason: 'Evita acumulación de carga electrostática' },
  { el: 'Ventanas', req: 'No recomendadas; si existen, selladas y de doble vidrio', reason: 'Compromete la presión diferencial' },
  { el: 'Instalaciones', req: 'Preferentemente por brazos pendulares de techo', reason: 'Elimina cables en la zona de circulación (caída y contaminación)' },
]

export default function S13_Architecture() {
  return (
    <SlideLayout>
      <SlideTitle size="md">
        Requisitos arquitectónicos de la <CyanAccent>Zona Blanca</CyanAccent>
      </SlideTitle>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        {/* Header row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '140px 1fr 1fr',
            gap: 12,
            padding: '8px 16px',
            marginBottom: 6,
          }}
        >
          {['Elemento', 'Requisito típico', 'Razón técnica'].map((h) => (
            <span key={h} className="font-mono" style={{ fontSize: 10, color: 'var(--cyan-mid)', letterSpacing: '0.1em' }}>
              {h.toUpperCase()}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
          {reqs.map((r, i) => (
            <div
              key={r.el}
              className="card-hover"
              style={{
                display: 'grid',
                gridTemplateColumns: '140px 1fr 1fr',
                gap: 12,
                padding: '14px 18px',
                background: i % 2 === 0 ? 'rgba(10,26,74,0.4)' : 'rgba(6,15,46,0.6)',
                border: '1px solid rgba(240,249,255,0.05)',
                borderRadius: 8,
              }}
            >
              <span
                className="font-mono"
                style={{ fontSize: 11, color: 'var(--cyan-bright)', opacity: 0.8 }}
              >
                {r.el}
              </span>
              <p style={{ fontSize: 13.5, color: 'var(--white)', margin: 0, lineHeight: 1.5 }}>
                {r.req}
              </p>
              <p style={{ fontSize: 12.5, color: 'var(--white-faint)', margin: 0, lineHeight: 1.5 }}>
                {r.reason}
              </p>
            </div>
          ))}
        </div>
      </div>
    </SlideLayout>
  )
}
