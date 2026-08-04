import { SlideLayout, SlideTitle, CyanAccent, Card } from './SlideLayout'

export default function S17_Electrical() {
  return (
    <SlideLayout>
      <SlideTitle size="md">
        Seguridad <CyanAccent>Eléctrica</CyanAccent> del quirófano
      </SlideTitle>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, flex: 1, minHeight: 0 }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 0, justifyContent: 'space-between' }}>
          {[
            { label: 'Categoría 1 (NFPA 99)', text: 'La falla del equipo o del sistema causaría daño grave o muerte al paciente.' },
            { label: 'Sistema de Potencia Aislada (IT)', text: 'Con monitor de aislamiento de línea (LIM) o protección GFCI. Ubicación de procedimiento húmedo.' },
            { label: 'Sistema Eléctrico Esencial', text: 'Transferencia a generador en ≤10s. Equipos críticos con UPS adicional.' },
            { label: 'Equipotencialización', text: 'Todas las masas metálicas se unen a barra equipotencial única para eliminar diferencias de potencial.' },
          ].map((item) => (
            <Card key={item.label} accent="none" style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--cyan-mid)', margin: '0 0 6px' }}>
                {item.label}
              </p>
              <p style={{ fontSize: 13.5, color: 'var(--white-dim)', margin: 0, lineHeight: 1.6 }}>
                {item.text}
              </p>
            </Card>
          ))}
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
          {/* Macro/microshock */}
          <Card accent="violet" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p className="font-mono" style={{ fontSize: 10, color: '#a78bfa', marginBottom: 12, letterSpacing: '0.1em' }}>
              RIESGOS ELÉCTRICOS DEL PACIENTE
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {[
                { type: 'Macroshock', path: 'Corriente a través de la piel íntegra', threshold: '~100 mA → fibrilación ventricular', color: '#f87171' },
                { type: 'Microshock', path: 'Corriente directa al miocardio por catéter o electrodo', threshold: '~10–100 µA → fibrilación ventricular', color: '#fbbf24' },
              ].map((r) => (
                <div
                  key={r.type}
                  style={{
                    padding: '12px',
                    background: `${r.color}10`,
                    border: `1px solid ${r.color}30`,
                    borderRadius: 8,
                  }}
                >
                  <p style={{ fontSize: 14, fontWeight: 700, color: r.color, margin: '0 0 6px' }}>
                    {r.type}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--white-dim)', margin: '0 0 6px', lineHeight: 1.5 }}>
                    {r.path}
                  </p>
                  <p className="font-mono" style={{ fontSize: 10, color: r.color }}>
                    {r.threshold}
                  </p>
                </div>
              ))}
            </div>
            <p style={{ fontSize: 11, color: 'var(--white-faint)', margin: '12px 0 0', lineHeight: 1.6 }}>
              IEC 60601-1 limita corriente de fuga del paciente a <strong style={{ color: 'var(--cyan-bright)' }}>≤10 µA</strong> (condición normal, tipo CF). Verificación periódica por IEC 62353.
            </p>
          </Card>

          {/* Fire triangle */}
          <Card accent="gold" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p className="font-mono" style={{ fontSize: 10, color: '#fbbf24', marginBottom: 10, letterSpacing: '0.1em' }}>
              TRIÁNGULO DE FUEGO QUIRÚRGICO 🔥
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                { label: 'Comburente', items: 'O₂/N₂O enriquecido en atmósfera', color: '#f97316' },
                { label: 'Ignición', items: 'Electrobisturí, láser, fuente de luz endoscopía', color: '#ef4444' },
                { label: 'Combustible', items: 'Campos textiles, antisépticos alcohólicos, tubo endotraqueal', color: '#f59e0b' },
              ].map((t) => (
                <div key={t.label} style={{ textAlign: 'center' }}>
                  <p className="font-mono" style={{ fontSize: 9, color: t.color, margin: '0 0 4px', letterSpacing: '0.08em' }}>
                    {t.label.toUpperCase()}
                  </p>
                  <p style={{ fontSize: 11, color: 'var(--white-dim)', margin: 0, lineHeight: 1.5 }}>
                    {t.items}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </SlideLayout>
  )
}
