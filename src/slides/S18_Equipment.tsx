import { SlideLayout, SlideTitle, CyanAccent } from './SlideLayout'

const equipment = [
  { system: 'Soporte anestésico', equipment: 'Máquina de anestesia + ventilador + vaporizadores + AGSS', function: 'Administrar mezcla y sostener ventilación', topic: 'Tema 2', color: '#00d4ff' },
  { system: 'Monitorización', equipment: 'Monitor multiparámetro (ECG, SpO₂, PANI/PAI, EtCO₂, T°, BIS, TOF)', function: 'Vigilancia continua del paciente', topic: '', color: '#38bdf8' },
  { system: 'Iluminación', equipment: 'Lámpara quirúrgica cielítica y satélite', function: 'Iluminar cavidad sin sombras ni calor', topic: 'Tema 3', color: '#fbbf24' },
  { system: 'Energía quirúrgica', equipment: 'ESU mono/bipolar, sellador de vasos, ultrasónico', function: 'Corte, coagulación y hemostasia', topic: 'Tema 4', color: '#f59e0b' },
  { system: 'Posicionamiento', equipment: 'Mesa quirúrgica, accesorios, colchón térmico', function: 'Exponer el campo y proteger al paciente', topic: 'Tema 5', color: '#a78bfa' },
  { system: 'Visualización', equipment: 'Torre de laparoscopía: cámara, fuente de luz, insuflador, monitor', function: 'Cirugía mínimamente invasiva', topic: 'Tema 6', color: '#6d28d9' },
  { system: 'Soporte circulatorio', equipment: 'Bomba de CEC, oxigenador, intercambiador de calor', function: 'Sustituir corazón y pulmón', topic: 'Tema 7', color: '#ef4444' },
  { system: 'Complementarios', equipment: 'Bombas de infusión, desfibrilador, calentador de fluidos, aspirador, arco en C', function: 'Soporte perioperatorio', topic: '', color: '#64748b' },
]

export default function S18_Equipment() {
  return (
    <SlideLayout>
      <SlideTitle size="md">
        Equipamiento base del <CyanAccent>salón de operaciones</CyanAccent>
      </SlideTitle>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '140px 1fr 180px 70px',
          gap: 8,
          padding: '8px 14px',
          marginBottom: 6,
        }}
      >
        {['Sistema', 'Equipo', 'Función', 'Tema'].map((h) => (
          <span key={h} className="font-mono" style={{ fontSize: 10, color: 'var(--cyan-mid)', letterSpacing: '0.1em' }}>
            {h.toUpperCase()}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, justifyContent: 'space-between', overflow: 'auto' }} className="slide-scroll">
        {equipment.map((eq) => (
          <div
            key={eq.system}
            className="card-hover"
            style={{
              display: 'grid',
              gridTemplateColumns: '140px 1fr 180px 70px',
              gap: 8,
              padding: '13px 14px',
              background: 'rgba(10,26,74,0.4)',
              border: '1px solid rgba(240,249,255,0.06)',
              borderLeft: `3px solid ${eq.color}`,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 12, color: eq.color, fontWeight: 600 }}>{eq.system}</span>
            <p style={{ fontSize: 12, color: 'var(--white-dim)', margin: 0, lineHeight: 1.4 }}>{eq.equipment}</p>
            <p style={{ fontSize: 11, color: 'var(--white-faint)', margin: 0, lineHeight: 1.4 }}>{eq.function}</p>
            {eq.topic ? (
              <span
                className="font-mono"
                style={{
                  fontSize: 10,
                  padding: '3px 8px',
                  borderRadius: 4,
                  background: `${eq.color}15`,
                  color: eq.color,
                  border: `1px solid ${eq.color}30`,
                  whiteSpace: 'nowrap',
                }}
              >
                {eq.topic}
              </span>
            ) : (
              <span />
            )}
          </div>
        ))}
      </div>
    </SlideLayout>
  )
}
