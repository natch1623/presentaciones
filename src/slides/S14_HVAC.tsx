import { SlideLayout, SlideTitle, CyanAccent, Card } from './SlideLayout'

const params = [
  { param: 'Temperatura', value: '20–24 °C', norm: 'ASHRAE 170', icon: '🌡️' },
  { param: 'Humedad relativa', value: '20–60 %', norm: 'ASHRAE 170', icon: '💧' },
  { param: 'Cambios de aire totales', value: '≥ 20 ACH', norm: 'ASHRAE 170, Tabla 7-1', icon: '🔄' },
  { param: 'Aire exterior', value: '≥ 4 ACH', norm: 'ASHRAE 170', icon: '🌬️' },
  { param: 'Presión diferencial', value: '+2.5 Pa (positiva)', norm: 'ASHRAE 170', icon: '📊' },
  { param: 'Filtración', value: 'MERV 7 + MERV 14 (HEPA en ultralimpio)', norm: 'ASHRAE 170', icon: '🔬' },
  { param: 'Clasificación de partículas', value: 'ISO 14644-1 Clase 7 / Clase 5 ultralimpio', norm: 'ISO 14644-1', icon: '📐' },
]

const notes = [
  { label: 'Temperatura baja', text: 'Confort del equipo quirúrgico, pero ↑ riesgo de hipotermia perioperatoria del paciente → sistemas de calentamiento activo.' },
  { label: 'Humedad', text: 'Exceso: favorece moho. Deficiencia: ↑ electricidad estática y riesgo de ignición con electrobisturí y O₂.' },
  { label: 'Presión positiva', text: 'Garantiza que el aire fluya del quirófano hacia afuera, nunca al revés.' },
]

export default function S14_HVAC() {
  return (
    <SlideLayout>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, height: '100%' }}>
        <div>
          <SlideTitle size="sm">
            Condiciones Ambientales Normadas <CyanAccent>(HVAC)</CyanAccent>
          </SlideTitle>
          <p style={{ fontSize: 12, color: 'var(--white-faint)', marginBottom: 16 }}>
            El aire es un equipo médico más — ANSI/ASHRAE/ASHE Standard 170-2025
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {params.map((p) => (
              <div
                key={p.param}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '32px 1fr auto',
                  gap: 10,
                  padding: '10px 14px',
                  background: 'rgba(10,26,74,0.5)',
                  border: '1px solid rgba(0,212,255,0.1)',
                  borderRadius: 8,
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 16 }}>{p.icon}</span>
                <div>
                  <p style={{ fontSize: 12, color: 'var(--white-dim)', margin: 0 }}>{p.param}</p>
                  <p className="font-mono" style={{ fontSize: 10, color: 'var(--white-faint)', margin: '2px 0 0' }}>
                    {p.norm}
                  </p>
                </div>
                <span
                  className="font-mono"
                  style={{ fontSize: 12, color: 'var(--cyan-bright)', textAlign: 'right', whiteSpace: 'nowrap' }}
                >
                  {p.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'center' }}>
          <h3
            className="font-display"
            style={{ fontSize: 20, color: 'var(--white)', margin: 0 }}
          >
            Por qué cada parámetro importa <em>clínicamente</em>
          </h3>

          {notes.map((n) => (
            <Card key={n.label} accent="none" style={{ borderLeft: '2px solid var(--cyan-bright)', padding: '14px 18px' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--cyan-mid)', margin: '0 0 6px' }}>
                {n.label}
              </p>
              <p style={{ fontSize: 13, color: 'var(--white-dim)', margin: 0, lineHeight: 1.6 }}>
                {n.text}
              </p>
            </Card>
          ))}

          <div
            style={{
              padding: '14px 18px',
              background: 'rgba(109,40,217,0.08)',
              border: '1px solid rgba(109,40,217,0.25)',
              borderRadius: 10,
            }}
          >
            <p style={{ fontSize: 12, color: '#a78bfa', margin: 0, lineHeight: 1.6 }}>
              ⚠️ <strong>Edición vigente:</strong> ANSI/ASHRAE/ASHE 170-2025. En Panamá se usa como referencia ASHRAE 170 y guías FGI, además de las normas de habilitación del MINSA.
            </p>
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
