import { SlideLayout, SlideTitle, CyanAccent } from './SlideLayout'

const gases = [
  { gas: 'Oxígeno (O₂)', use: 'Ventilación, mezcla anestésica', pressure: '345–380 kPa (50–55 psi)', nfpa: 'Verde', iso: 'Blanco' },
  { gas: 'Aire medicinal', use: 'Gas portador, ventiladores', pressure: '345–380 kPa (50–55 psi)', nfpa: 'Amarillo', iso: 'Blanco/Negro' },
  { gas: 'Óxido nitroso (N₂O)', use: 'Coadyuvante anestésico', pressure: '345 kPa (50 psi)', nfpa: 'Azul', iso: 'Azul' },
  { gas: 'Vacío / succión clínica', use: 'Aspiración de fluidos y humo', pressure: '≥ 300 mmHg (≥ 12 inHg)', nfpa: 'Blanco', iso: 'Amarillo' },
  { gas: 'CO₂', use: 'Insuflación en laparoscopía', pressure: 'Regulado en el insuflador', nfpa: 'Gris', iso: 'Gris' },
  { gas: 'AGSS', use: 'Evacuación de gases anestésicos espirados', pressure: 'Sistema de vacío dedicado', nfpa: '—', iso: '—' },
  { gas: 'Aire de instrumentos', use: 'Herramientas neumáticas ortopédicas', pressure: '1100–1380 kPa (160–200 psi)', nfpa: '—', iso: '—' },
]

const colorMap: Record<string, string> = {
  Verde: '#22c55e',
  Amarillo: '#eab308',
  Azul: '#3b82f6',
  Blanco: '#e2e8f0',
  'Blanco/Negro': '#94a3b8',
  Gris: '#6b7280',
  '—': '#374151',
}

export default function S16_Gases() {
  return (
    <SlideLayout>
      <SlideTitle size="md">
        Gases medicinales en el <CyanAccent>salón de operaciones</CyanAccent>
      </SlideTitle>

      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
        {/* Table header */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '160px 1fr 160px 80px 80px',
            gap: 10,
            padding: '8px 16px',
            marginBottom: 6,
          }}
        >
          {['Gas', 'Uso en quirófano', 'Presión nominal', 'NFPA 99', 'ISO 32'].map((h) => (
            <span key={h} className="font-mono" style={{ fontSize: 10, color: 'var(--cyan-mid)', letterSpacing: '0.1em' }}>
              {h.toUpperCase()}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
          {gases.map((g, i) => (
            <div
              key={g.gas}
              className="card-hover"
              style={{
                display: 'grid',
                gridTemplateColumns: '160px 1fr 160px 80px 80px',
                gap: 10,
                padding: '13px 16px',
                background: i % 2 === 0 ? 'rgba(10,26,74,0.4)' : 'rgba(6,15,46,0.6)',
                border: '1px solid rgba(240,249,255,0.05)',
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: 13, color: 'var(--white)', fontWeight: 500 }}>{g.gas}</span>
              <span style={{ fontSize: 12, color: 'var(--white-dim)' }}>{g.use}</span>
              <span className="font-mono" style={{ fontSize: 11, color: 'var(--cyan-mid)' }}>{g.pressure}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: colorMap[g.nfpa] || '#374151', flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: 'var(--white-faint)' }}>{g.nfpa}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: colorMap[g.iso] || '#374151', flexShrink: 0 }} />
                <span style={{ fontSize: 11, color: 'var(--white-faint)' }}>{g.iso}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: 14,
          padding: '14px 18px',
          background: 'rgba(239,68,68,0.06)',
          border: '1px solid rgba(239,68,68,0.25)',
          borderLeft: '3px solid #ef4444',
          borderRadius: 10,
        }}
      >
        <p style={{ fontSize: 13, color: '#fca5a5', margin: 0, lineHeight: 1.65 }}>
          ⚠️ <strong>Punto crítico de seguridad — códigos de color NO son universales.</strong>{' '}
          <span style={{ color: 'var(--white-dim)' }}>
            En Panamá conviven equipos de ambos mercados. Nunca identifiques una línea por color: verifica etiqueta, conector DISS/NIST y prueba de pureza. La{' '}
            <strong>conexión cruzada de gases medicinales</strong> es una de las causas históricas de mortalidad prevenible en quirófano.
          </span>
        </p>
      </div>
    </SlideLayout>
  )
}
