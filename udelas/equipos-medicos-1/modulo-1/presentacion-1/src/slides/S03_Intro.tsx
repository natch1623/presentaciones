import { SlideLayout, SlideTitle, CyanAccent, Card } from './SlideLayout'
import iconBiologico from '../assets/icons/s03-01-biologico.png'
import iconSoporteVital from '../assets/icons/s03-02-soporte-vital.png'
import iconDensidadTec from '../assets/icons/s03-03-densidad-tec.png'

const pillars = [
  {
    icon: iconBiologico,
    label: 'Control Biológico',
    desc: 'Barrera anatómica abierta; aire, superficies y personal son vectores potenciales de infección.',
    color: '#00d4ff',
    shadow: 'rgba(0,212,255,0.25)',
    accent: 'cyan' as const,
    facts: [
      { stat: '3', label: 'zonas de restricción (negra / gris / blanca)' },
      { stat: 'HEPA', label: 'filtración y presión diferencial positiva' },
    ],
  },
  {
    icon: iconSoporteVital,
    label: 'Soporte Vital Activo',
    desc: 'Paciente bajo anestesia; funciones respiratoria y hemodinámica sostenidas artificialmente por equipos.',
    color: '#a78bfa',
    shadow: 'rgba(167,139,250,0.25)',
    accent: 'violet' as const,
    facts: [
      { stat: '100%', label: 'dependencia de ventilación mecánica' },
      { stat: '1:1', label: 'monitorización continua por paciente' },
    ],
  },
  {
    icon: iconDensidadTec,
    label: 'Alta Densidad Tecnológica',
    desc: 'Más de 15 dispositivos electromédicos operando en simultáneo, con gases, energía de alta frecuencia y líquidos.',
    color: '#fbbf24',
    shadow: 'rgba(251,191,36,0.2)',
    accent: 'gold' as const,
    facts: [
      { stat: '15+', label: 'equipos electromédicos simultáneos' },
      { stat: '4', label: 'servicios críticos: gases, energía, datos, líquidos' },
    ],
  },
]

export default function S03_Intro() {
  return (
    <SlideLayout>
      <SlideTitle size="md">
        El quirófano: el ambiente más <CyanAccent>controlado</CyanAccent> del hospital
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, flex: 1 }}>
        {pillars.map((p, i) => (
          <Card
            key={p.label}
            accent={p.accent}
            style={{
              display: 'flex', flexDirection: 'column', gap: 14,
              animation: `scaleIn 0.5s cubic-bezier(0.22,1,0.36,1) ${0.1 + i * 0.12}s both`,
              position: 'relative', overflow: 'hidden',
              height: '100%',
            }}
          >
            {/* Top glow bar */}
            <div
              style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                background: `linear-gradient(90deg, transparent, ${p.color}, transparent)`,
                boxShadow: `0 0 10px ${p.color}`,
              }}
            />
            {/* Icon with glow */}
            <div
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: 64, height: 64, borderRadius: 16,
                background: `radial-gradient(circle, ${p.shadow} 0%, transparent 70%)`,
              }}
            >
              <img
                src={p.icon}
                alt=""
                style={{ width: 46, height: 46, objectFit: 'contain', filter: `drop-shadow(0 0 10px ${p.color})` }}
              />
            </div>
            <h3 className="font-display" style={{ fontSize: 22, margin: 0, color: p.color, textShadow: `0 0 20px ${p.shadow}` }}>
              {p.label}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--white-dim)', lineHeight: 1.7, margin: 0 }}>{p.desc}</p>

            <div style={{ flex: 1 }} />

            <div style={{ height: 1, background: `linear-gradient(90deg, ${p.color}35, transparent)` }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {p.facts.map((f) => (
                <div key={f.label} style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span
                    className="font-display"
                    style={{ fontSize: 20, color: p.color, textShadow: `0 0 14px ${p.shadow}`, flexShrink: 0, minWidth: 44 }}
                  >
                    {f.stat}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--white-faint)', lineHeight: 1.5 }}>{f.label}</span>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div
        style={{
          marginTop: 16,
          padding: '14px 20px',
          background: 'linear-gradient(90deg, rgba(245,158,11,0.08), rgba(10,26,74,0.6))',
          border: '1px solid rgba(245,158,11,0.28)',
          borderLeft: '3px solid #f59e0b',
          borderRadius: 10,
          animation: 'fadeSlideUp 0.5s ease 0.5s both',
        }}
      >
        <p style={{ fontSize: 13, color: 'rgba(245,158,11,0.9)', margin: 0, lineHeight: 1.65 }}>
          <strong>Consecuencia para el ingeniero biomédico:</strong>{' '}
          <span style={{ color: 'var(--white-dim)' }}>
            En el quirófano, una falla de equipo genera un{' '}
            <strong style={{ color: '#fbbf24' }}>evento adverso con paciente anestesiado y cavidad abierta</strong>.
            El nivel de exigencia de mantenimiento y verificación es el más alto del hospital.
          </span>
        </p>
      </div>
    </SlideLayout>
  )
}
