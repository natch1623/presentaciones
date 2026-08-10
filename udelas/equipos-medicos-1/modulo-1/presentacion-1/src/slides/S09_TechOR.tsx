import { SlideLayout, SlideTitle, CyanAccent, Card } from './SlideLayout'

const milestones = [
  { year: '1926', item: 'Electrobisturí (Bovie & Cushing)', area: 'Energía quirúrgica' },
  { year: '1926–30', item: 'Máquinas de anestesia con circuito circular y absorbedor de CO₂ (Dräger)', area: 'Anestesia' },
  { year: '1930–40', item: 'Lámpara quirúrgica sin sombra con múltiples reflectores; iluminación fría', area: 'Iluminación' },
  { year: '1950s', item: 'ECG intraoperatorio, primeros ventiladores mecánicos', area: 'Monitorización' },
  { year: '1953', item: 'Primera cirugía a corazón abierto con bomba de CEC (John Gibbon)', area: 'Cirugía cardíaca' },
  { year: '1960s', item: 'Aire ultralimpio de flujo unidireccional para artroplastia (John Charnley)', area: 'HVAC' },
  { year: '1970–80s', item: 'Oximetría de pulso, capnografía, electrocirugía con retorno monitorizado (REM)', area: 'Seguridad' },
  { year: '1987', item: 'Primera colecistectomía laparoscópica con video (Philippe Mouret)', area: 'Mínimamente invasiva' },
]

const areaColors: Record<string, string> = {
  'Energía quirúrgica': '#f59e0b',
  'Anestesia': '#00d4ff',
  'Iluminación': '#fbbf24',
  'Monitorización': '#38bdf8',
  'Cirugía cardíaca': '#ef4444',
  'HVAC': '#10b981',
  'Seguridad': '#a78bfa',
  'Mínimamente invasiva': '#06b6d4',
}

export default function S09_TechOR() {
  return (
    <SlideLayout>
      <SlideTitle size="md">
        El quirófano se vuelve <CyanAccent>tecnológico</CyanAccent> — S. XX
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, flex: 1 }}>
        {milestones.map((m) => (
          <div
            key={m.year}
            style={{
              display: 'flex',
              gap: 14,
              padding: '14px 16px',
              background: 'rgba(10,26,74,0.5)',
              border: '1px solid rgba(240,249,255,0.07)',
              borderRadius: 10,
              alignItems: 'flex-start',
            }}
          >
            <span
              className="font-mono"
              style={{ fontSize: 11, color: 'var(--cyan-mid)', minWidth: 52, paddingTop: 2 }}
            >
              {m.year}
            </span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, color: 'var(--white)', margin: '0 0 4px', lineHeight: 1.5 }}>
                {m.item}
              </p>
              <span
                style={{
                  fontSize: 10,
                  padding: '2px 8px',
                  borderRadius: 4,
                  background: `${areaColors[m.area]}15`,
                  color: areaColors[m.area],
                  border: `1px solid ${areaColors[m.area]}30`,
                  fontFamily: 'JetBrains Mono, monospace',
                  letterSpacing: '0.05em',
                }}
              >
                {m.area}
              </span>
            </div>
          </div>
        ))}
      </div>
    </SlideLayout>
  )
}
