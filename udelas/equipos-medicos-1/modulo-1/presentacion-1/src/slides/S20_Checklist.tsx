import { SlideLayout, SlideTitle, CyanAccent } from './SlideLayout'

const moments = [
  {
    id: 'ENTRADA',
    sub: 'Sign in — antes de la inducción anestésica',
    color: '#22c55e',
    items: [
      'Identidad, sitio y procedimiento confirmados',
      'Consentimiento informado firmado',
      'Marcado del sitio quirúrgico',
      'Verificación del equipo de anestesia y medicación',
      'Pulsioxímetro funcionando',
      'Alergias, vía aérea difícil, riesgo de sangrado',
    ],
  },
  {
    id: 'PAUSA',
    sub: 'Time out — antes de la incisión',
    color: '#f59e0b',
    items: [
      'Presentación nominal del equipo completo',
      'Confirmación en voz alta: paciente/sitio/procedimiento',
      'Eventos críticos previstos',
      'Profilaxis antibiótica en los últimos 60 min',
      'Imágenes esenciales desplegadas',
    ],
  },
  {
    id: 'SALIDA',
    sub: 'Sign out — antes de que el paciente salga',
    color: '#38bdf8',
    items: [
      'Nombre del procedimiento registrado',
      'Conteo de gasas, agujas e instrumental',
      'Etiquetado de muestras de patología',
      '🔧 Problemas de equipamiento a resolver ← IB',
      'Plan de recuperación postoperatoria',
    ],
  },
]

export default function S20_Checklist() {
  return (
    <SlideLayout>
      <SlideTitle size="md">
        Lista de Verificación <CyanAccent>OMS</CyanAccent>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, flex: 1 }}>
        {moments.map((m, i) => (
          <div
            key={m.id}
            className="card-hover"
            style={{
              background: 'linear-gradient(180deg, rgba(10,26,74,0.75), rgba(6,15,46,0.95))',
              border: `1px solid ${m.color}25`,
              borderTop: `3px solid ${m.color}`,
              borderRadius: 14, padding: '20px',
              display: 'flex', flexDirection: 'column', gap: 12,
              position: 'relative', overflow: 'hidden',
              animation: `slideForwardIn 0.5s cubic-bezier(0.22,1,0.36,1) ${0.1 + i * 0.13}s both`,
              boxShadow: `0 0 30px ${m.color}08, 0 4px 20px rgba(0,0,0,0.3)`,
            }}
          >
            {/* Step number */}
            <div
              style={{
                position: 'absolute', top: 16, right: 18,
                fontFamily: 'DM Serif Display, serif',
                fontSize: 56, color: `${m.color}10`,
                lineHeight: 1, userSelect: 'none',
              }}
            >
              {i + 1}
            </div>

            <div>
              <p className="font-mono" style={{ fontSize: 15, fontWeight: 700, color: m.color, margin: 0, textShadow: `0 0 16px ${m.color}60` }}>
                {m.id}
              </p>
              <p style={{ fontSize: 11.5, color: 'var(--white-faint)', margin: '4px 0 0' }}>{m.sub}</p>
            </div>
            <div style={{ height: 1, background: `linear-gradient(90deg, ${m.color}40, transparent)` }} />
            <ul style={{ padding: '0 0 0 16px', margin: 0, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {m.items.map((item, j) => (
                <li
                  key={j}
                  style={{
                    fontSize: 12.5,
                    color: item.includes('IB') || item.includes('🔧') ? m.color : 'var(--white-dim)',
                    lineHeight: 1.55,
                    fontWeight: item.includes('IB') ? 600 : 400,
                    animation: `fadeSlideLeft 0.38s ease ${0.3 + i * 0.1 + j * 0.06}s both`,
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 14, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
          animation: 'fadeSlideUp 0.45s ease 0.55s both',
        }}
      >
        {[
          { stat: '1.5% → 0.8%', label: 'Reducción mortalidad postoperatoria (Haynes et al., NEJM 2009)' },
          { stat: 'RR 0.77', label: 'Reducción de mortalidad en países de ingresos bajos/medios (White et al., 2021, n=47 estudios)' },
        ].map((e) => (
          <div
            key={e.stat}
            style={{
              display: 'flex', gap: 16,
              padding: '11px 18px',
              background: 'rgba(0,212,255,0.05)',
              border: '1px solid rgba(0,212,255,0.15)',
              borderRadius: 8, alignItems: 'center',
            }}
          >
            <span className="font-display" style={{ fontSize: 24, color: 'var(--cyan-bright)', flexShrink: 0, textShadow: '0 0 20px rgba(0,212,255,0.4)' }}>
              {e.stat}
            </span>
            <p style={{ fontSize: 12, color: 'var(--white-faint)', margin: 0, lineHeight: 1.5 }}>{e.label}</p>
          </div>
        ))}
      </div>
    </SlideLayout>
  )
}
