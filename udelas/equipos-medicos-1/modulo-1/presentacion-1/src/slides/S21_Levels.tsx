import React from 'react'
import { SlideLayout, SlideTitle, CyanAccent } from './SlideLayout'

const levels = [
  {
    level: 'NIVEL I',
    sub: 'Básico',
    color: '#64748b',
    location: 'Centros de salud, policlínicas, clínicas ambulatorias',
    anesthesia: 'Local / sedación; sin anestesia general',
    equipment: 'Mesa simple, lámpara, ESU básica, aspirador, autoclave',
    hvac: 'Ventilación filtrada, presión positiva',
    procedures: 'Sutura, drenaje de abscesos, exéresis superficiales, biopsias',
    support: 'Referencia inmediata',
    biomed: 'Mantenimiento preventivo básico, verificación eléctrica',
  },
  {
    level: 'NIVEL II',
    sub: 'Intermedio',
    color: '#38bdf8',
    location: 'Hospitales regionales y distritales',
    anesthesia: 'General y regional; máquina con monitorización básica-intermedia',
    equipment: 'Mesa multiposición, ESU con REM, torre de laparoscopía, arco en C',
    hvac: 'Presión positiva controlada, ≥20 ACH, monitoreo continuo',
    procedures: 'Apendicectomía, herniorrafia, colecistectomía, cesárea, ortopedia',
    support: 'URPA + UCI disponible',
    biomed: 'MP programado + calibraciones + gestión de repuestos',
  },
  {
    level: 'NIVEL III',
    sub: 'Alta especialización',
    color: '#00d4ff',
    location: 'Hospitales de referencia nacional y universitarios',
    anesthesia: 'General avanzada; BIS, hemodinámica invasiva, monitorización de profundidad',
    equipment: 'Cirugía robótica, neuronavegación, imagen intraoperatoria, CEC, quirófano híbrido',
    hvac: 'Aire ultralimpio / flujo unidireccional, control validado',
    procedures: 'Neurocirugía, cardiovascular, trasplantes, oncológica compleja, cirugía fetal',
    support: 'UCI + Banco de sangre 24/7 + Patología intraoperatoria',
    biomed: 'Ingeniería clínica especializada, validación, gestión de riesgo y ciclo de vida',
  },
]

const rows = [
  { key: 'location', label: 'Ubicación' },
  { key: 'anesthesia', label: 'Anestesia' },
  { key: 'equipment', label: 'Equipamiento' },
  { key: 'hvac', label: 'HVAC' },
  { key: 'procedures', label: 'Procedimientos' },
  { key: 'support', label: 'Soporte' },
  { key: 'biomed', label: 'Rol Biomédico' },
]

export default function S21_Levels() {
  return (
    <SlideLayout>
      <SlideTitle size="md">
        Niveles de <CyanAccent>complejidad</CyanAccent> del salón de operaciones
      </SlideTitle>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '100px repeat(3, 1fr)',
          gridTemplateRows: 'auto repeat(7, 1fr)',
          gap: 8,
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Header row */}
        <div />
        {levels.map((l) => (
          <div
            key={l.level}
            style={{
              padding: '12px 16px',
              background: `${l.color}10`,
              border: `1px solid ${l.color}30`,
              borderTop: `3px solid ${l.color}`,
              borderRadius: '8px 8px 0 0',
              textAlign: 'center',
            }}
          >
            <p className="font-mono" style={{ fontSize: 13, color: l.color, margin: 0, fontWeight: 700 }}>
              {l.level}
            </p>
            <p style={{ fontSize: 12, color: 'var(--white-faint)', margin: '4px 0 0' }}>{l.sub}</p>
          </div>
        ))}

        {/* Data rows */}
        {rows.map((row, ri) => (
          <React.Fragment key={row.key}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '10px 0',
              }}
            >
              <span
                className="font-mono"
                style={{
                  fontSize: 10,
                  color: 'var(--cyan-mid)',
                  letterSpacing: '0.06em',
                  lineHeight: 1.3,
                }}
              >
                {row.label.toUpperCase()}
              </span>
            </div>
            {levels.map((l) => (
              <div
                key={l.level + row.key}
                style={{
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  background: ri % 2 === 0 ? 'rgba(10,26,74,0.4)' : 'rgba(6,15,46,0.5)',
                  borderTop: 'none',
                  borderRight: 'none',
                  borderBottom: 'none',
                  borderLeft: ri === 6 ? `2px solid ${l.color}` : 'none',
                }}
              >
                <p
                  style={{
                    fontSize: 12,
                    color: ri === 6 ? l.color : 'var(--white-dim)',
                    margin: 0,
                    lineHeight: 1.5,
                    fontWeight: ri === 6 ? 500 : 400,
                  }}
                >
                  {(l as any)[row.key]}
                </p>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </SlideLayout>
  )
}
