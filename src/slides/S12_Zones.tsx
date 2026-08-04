import { SlideLayout, SlideTitle } from './SlideLayout'

const zones = [
  {
    id: 'NEGRA',
    icon: '🖤',
    label: 'No Restringida',
    color: '#6b7280',
    glow: 'rgba(107,114,128,0.2)',
    bg: 'linear-gradient(180deg, rgba(25,25,30,0.9) 0%, rgba(10,10,15,0.95) 100%)',
    border: 'rgba(107,114,128,0.35)',
    items: [
      'Primera barrera de acceso a la unidad',
      'Acceso de médicos, enfermeras, técnicos y camilleros',
      'Comunicación con zona gris: trampa de botas y camillas',
      'Contiene: recepción, vestidores, sanitarios, oficinas',
    ],
  },
  {
    id: 'GRIS',
    icon: '🩶',
    label: 'Semirrestringida',
    color: '#64748b',
    glow: 'rgba(100,116,139,0.2)',
    bg: 'linear-gradient(180deg, rgba(20,25,45,0.9) 0%, rgba(12,16,30,0.95) 100%)',
    border: 'rgba(100,116,139,0.4)',
    items: [
      'Requiere uniforme quirúrgico + gorro + mascarilla',
      'Área de lavado quirúrgico (preparación del equipo)',
      'Central de Equipos y Esterilización (CEyE)',
      'Cuarto de anestesia · sala de recuperación (URPA)',
      '🔧 Principal área de trabajo del Ingeniero Biomédico',
    ],
  },
  {
    id: 'BLANCA',
    icon: '🤍',
    label: 'Restringida · Estéril',
    color: '#00d4ff',
    glow: 'rgba(0,212,255,0.25)',
    bg: 'linear-gradient(180deg, rgba(0,20,50,0.85) 0%, rgba(0,10,30,0.95) 100%)',
    border: 'rgba(0,212,255,0.4)',
    items: [
      'Zona de máxima restricción del bloque quirúrgico',
      'Sala de operaciones y corredores de acceso directo',
      'Puertas corredizas cerradas en todo momento',
      'Acceso exclusivo: equipo quirúrgico + paciente',
      'Vestimenta estéril completa obligatoria',
    ],
  },
]

export default function S12_Zones() {
  return (
    <SlideLayout>
      <SlideTitle size="md">
        Zonificación quirúrgica:{' '}
        <span style={{ color: 'var(--cyan-bright)', textShadow: '0 0 24px rgba(0,212,255,0.45)' }}>
          las tres zonas
        </span>
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, flex: 1 }}>
        {zones.map((z, i) => (
          <div
            key={z.id}
            className="card-hover"
            style={{
              background: z.bg,
              border: `1px solid ${z.border}`,
              borderTop: `3px solid ${z.color}`,
              borderRadius: 14,
              padding: '22px 20px',
              display: 'flex', flexDirection: 'column', gap: 14,
              position: 'relative', overflow: 'hidden',
              animation: `slideForwardIn 0.55s cubic-bezier(0.22,1,0.36,1) ${0.08 + i * 0.14}s both`,
              boxShadow: `0 0 40px ${z.glow}, inset 0 0 30px rgba(0,0,0,0.2)`,
            }}
          >
            {/* Corner glow */}
            <div
              style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: 60,
                background: `radial-gradient(ellipse at 50% -20%, ${z.glow} 0%, transparent 80%)`,
                pointerEvents: 'none',
              }}
            />

            {/* Zone badge */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 28 }}>{z.icon}</span>
                <div>
                  <p className="font-mono" style={{ fontSize: 13, fontWeight: 700, color: z.color, margin: 0, textShadow: `0 0 16px ${z.color}60` }}>
                    ZONA {z.id}
                  </p>
                  <p style={{ fontSize: 11, color: 'rgba(240,249,255,0.45)', margin: '2px 0 0' }}>{z.label}</p>
                </div>
              </div>
              {/* Restriction level dots */}
              <div style={{ display: 'flex', gap: 3 }}>
                {[0, 1, 2].map(d => (
                  <div
                    key={d}
                    style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: d <= i ? z.color : 'rgba(240,249,255,0.1)',
                      boxShadow: d <= i ? `0 0 6px ${z.color}` : 'none',
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={{ height: 1, background: `linear-gradient(90deg, ${z.color}40, transparent)` }} />

            <ul style={{ padding: '0 0 0 14px', margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {z.items.map((item, j) => (
                <li
                  key={j}
                  style={{
                    fontSize: 12.5,
                    color: item.includes('🔧') || item.includes('Zona') ? z.color : 'rgba(240,249,255,0.7)',
                    lineHeight: 1.55,
                    fontWeight: item.includes('🔧') ? 600 : 400,
                    animation: `fadeSlideLeft 0.4s ease ${0.25 + i * 0.1 + j * 0.06}s both`,
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
          marginTop: 14,
          padding: '12px 20px',
          background: 'rgba(0,212,255,0.05)',
          border: '1px solid rgba(0,212,255,0.2)',
          borderRadius: 8, textAlign: 'center',
          animation: 'fadeSlideUp 0.5s ease 0.55s both',
        }}
      >
        <p style={{ fontSize: 13, color: 'var(--cyan-bright)', margin: 0, fontWeight: 600 }}>
          Regla de oro: limpio y sucio <em>nunca</em> se cruzan.
        </p>
        <p style={{ fontSize: 12, color: 'var(--white-faint)', margin: '4px 0 0' }}>
          Cada apertura de puerta rompe la presión diferencial y arrastra partículas al interior.
        </p>
      </div>
    </SlideLayout>
  )
}
