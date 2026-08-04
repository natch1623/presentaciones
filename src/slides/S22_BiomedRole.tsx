import { SlideLayout, SlideTitle, CyanAccent, Card } from './SlideLayout'

const lifecycle = [
  { phase: '01', name: 'Planificación y adquisición', desc: 'Especificación técnica, evaluación de necesidades, análisis de costo total de propiedad, compatibilidad con infraestructura existente.' },
  { phase: '02', name: 'Instalación y aceptación', desc: 'Pruebas de aceptación, verificación vs. especificación, línea base de mediciones (IEC 62353), capacitación al usuario.' },
  { phase: '03', name: 'Operación', desc: 'Soporte al usuario, gestión de alarmas, respuesta a fallas intraoperatorias.' },
  { phase: '04', name: 'Mantenimiento', desc: 'Preventivo programado, correctivo, calibración y verificación de desempeño.' },
  { phase: '05', name: 'Seguridad y vigilancia', desc: 'Pruebas eléctricas periódicas, tecnovigilancia, reporte de eventos adversos y alertas ECRI.' },
  { phase: '06', name: 'Baja y reemplazo', desc: 'Evaluación de obsolescencia, disposición final, gestión de residuos de equipos médicos.' },
]

const norms = [
  { code: 'IEC 60601-1', desc: 'Seguridad básica y desempeño esencial de equipos electromédicos' },
  { code: 'IEC 62353', desc: 'Ensayos recurrentes y tras reparación de equipos electromédicos' },
  { code: 'NFPA 99', desc: 'Código de instalaciones para cuidados de la salud (gases, eléctrico)' },
  { code: 'ASHRAE 170-2025', desc: 'Ventilación de instalaciones de salud' },
  { code: 'ISO 14644-1', desc: 'Clasificación de limpieza del aire por concentración de partículas' },
  { code: 'ISO 13485', desc: 'Sistemas de gestión de calidad para dispositivos médicos' },
  { code: 'ISO/IEC 80001-1', desc: 'Gestión de riesgo de redes de TI con dispositivos médicos' },
]

export default function S22_BiomedRole() {
  return (
    <SlideLayout>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, height: '100%', minHeight: 0 }}>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <SlideTitle size="sm">
            Ciclo de vida del <CyanAccent>equipamiento quirúrgico</CyanAccent>
          </SlideTitle>
          <div style={{ position: 'relative', paddingLeft: 20, flex: 1, minHeight: 0 }}>
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 8,
                bottom: 8,
                width: 2,
                background: 'linear-gradient(180deg, var(--cyan-bright), #6d28d9)',
                boxShadow: '0 0 6px rgba(0,212,255,0.4)',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
              {lifecycle.map((phase) => (
                <div key={phase.phase} style={{ display: 'flex', gap: 12, position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: -24,
                      top: 10,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: 'var(--cyan-bright)',
                      boxShadow: '0 0 6px var(--cyan-bright)',
                    }}
                  />
                  <div
                    className="card-hover"
                    style={{
                      padding: '12px 16px',
                      background: 'rgba(10,26,74,0.5)',
                      border: '1px solid rgba(0,212,255,0.1)',
                      borderRadius: 8,
                      flex: 1,
                    }}
                  >
                    <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 4 }}>
                      <span className="font-mono" style={{ fontSize: 10, color: 'var(--cyan-mid)', letterSpacing: '0.05em' }}>
                        {phase.phase}
                      </span>
                      <span style={{ fontSize: 13.5, color: 'var(--white)', fontWeight: 500 }}>{phase.name}</span>
                    </div>
                    <p style={{ fontSize: 11.5, color: 'var(--white-faint)', margin: 0, lineHeight: 1.5 }}>
                      {phase.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          <h3
            className="font-display"
            style={{ fontSize: 20, color: 'var(--white)', margin: '0 0 16px' }}
          >
            Normas de referencia esenciales
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
            {norms.map((n) => (
              <div
                key={n.code}
                className="card-hover"
                style={{
                  display: 'flex',
                  gap: 14,
                  padding: '13px 16px',
                  background: 'rgba(10,26,74,0.4)',
                  border: '1px solid rgba(0,212,255,0.1)',
                  borderRadius: 8,
                  alignItems: 'center',
                }}
              >
                <span
                  className="font-mono"
                  style={{
                    fontSize: 11,
                    color: 'var(--cyan-bright)',
                    minWidth: 130,
                    flexShrink: 0,
                  }}
                >
                  {n.code}
                </span>
                <p style={{ fontSize: 12.5, color: 'var(--white-dim)', margin: 0, lineHeight: 1.5 }}>
                  {n.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}
