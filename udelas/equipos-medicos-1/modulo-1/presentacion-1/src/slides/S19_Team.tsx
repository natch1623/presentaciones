import { SlideLayout, SlideTitle, CyanAccent, Card } from './SlideLayout'

const team = [
  { role: 'Cirujano principal', icon: '🔪', function: 'Ejecuta el procedimiento', biomed: 'Reporta fallas de ESU, óptica, mesa', color: '#38bdf8' },
  { role: 'Primer y segundo ayudante', icon: '🤝', function: 'Exposición y asistencia', biomed: '—', color: '#64748b' },
  { role: 'Anestesiólogo', icon: '💨', function: 'Anestesia, vía aérea y estabilidad hemodinámica', biomed: 'Usuario crítico de la máquina de anestesia y monitores', color: '#a78bfa' },
  { role: 'Enfermera instrumentista', icon: '🩺', function: 'Maneja instrumental estéril; conteo de gasas y material', biomed: 'Manejo de instrumental y cables', color: '#06b6d4' },
  { role: 'Enfermera circulante', icon: '🔄', function: 'Enlace entre campo estéril y exterior; documenta', biomed: 'Primer contacto ante falla de equipo', color: '#f59e0b' },
  { role: 'Técnico perfusionista', icon: '❤️', function: 'Opera la bomba de CEC', biomed: 'Coordina calibraciones y mantenimiento', color: '#ef4444' },
  { role: 'Técnico / Ingeniero biomédico', icon: '⚙️', function: 'Disponibilidad, seguridad y desempeño del equipamiento', biomed: '← Ustedes', color: '#00d4ff' },
]

export default function S19_Team() {
  return (
    <SlideLayout>
      <SlideTitle size="md">
        El equipo humano del <CyanAccent>quirófano</CyanAccent>
      </SlideTitle>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, justifyContent: 'space-between' }}>
        {team.map((member) => (
          <div
            key={member.role}
            className="card-hover"
            style={{
              display: 'grid',
              gridTemplateColumns: '40px 200px 1fr 1fr',
              gap: 14,
              padding: '14px 16px',
              background:
                member.role.includes('Ingeniero')
                  ? 'linear-gradient(135deg, rgba(0,212,255,0.1) 0%, rgba(10,26,74,0.8) 100%)'
                  : 'rgba(10,26,74,0.4)',
              border: `1px solid ${member.role.includes('Ingeniero') ? 'rgba(0,212,255,0.3)' : 'rgba(240,249,255,0.06)'}`,
              borderLeft: `3px solid ${member.color}`,
              borderRadius: 8,
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: 20 }}>{member.icon}</span>
            <span
              style={{
                fontSize: 13,
                color: member.role.includes('Ingeniero') ? 'var(--cyan-bright)' : 'var(--white)',
                fontWeight: member.role.includes('Ingeniero') ? 600 : 400,
              }}
            >
              {member.role}
            </span>
            <p style={{ fontSize: 12, color: 'var(--white-dim)', margin: 0, lineHeight: 1.5 }}>
              {member.function}
            </p>
            <p
              style={{
                fontSize: 12,
                color:
                  member.biomed === '—'
                    ? 'var(--white-faint)'
                    : member.role.includes('Ingeniero')
                    ? 'var(--cyan-bright)'
                    : 'var(--cyan-mid)',
                margin: 0,
                lineHeight: 1.5,
                fontStyle: member.biomed === '—' ? 'normal' : undefined,
              }}
            >
              {member.biomed}
            </p>
          </div>
        ))}
      </div>
    </SlideLayout>
  )
}
