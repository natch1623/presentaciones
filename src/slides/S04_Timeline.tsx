import { useState } from 'react'
import { SlideLayout, CyanAccent } from './SlideLayout'

const events = [
  { year: '~7000 a.C.', event: 'Trepanaciones craneales', impact: 'Primeros instrumentos quirúrgicos líticos', era: 'ancient' },
  { year: '~1600 a.C.', event: 'Papiro de Edwin Smith', impact: 'Primer texto quirúrgico sistemático', era: 'ancient' },
  { year: '1545', event: 'Ambroise Paré', impact: 'Ligadura vascular reemplaza cauterización', era: 'early' },
  { year: '1846', event: 'Éter — Morton, Boston', impact: '🔑 Nace la anestesia moderna', era: 'key' },
  { year: '1867', event: 'Antisepsia — Joseph Lister', impact: 'Fenol: caen tasas de mortalidad', era: 'key' },
  { year: '1886', event: 'Esterilización por vapor — von Bergmann', impact: 'De antisepsia a asepsia', era: 'key' },
  { year: '1890', event: 'Guantes de goma — Halsted', impact: 'Barrera personal-paciente', era: 'modern' },
  { year: '1926', event: 'Electrobisturí (Bovie & Cushing)', impact: 'Quirófano eléctrico', era: 'modern' },
  { year: '1953', event: 'Bomba de circulación extracorpórea', impact: '🫀 Cirugía a corazón abierto (Gibbon)', era: 'modern' },
  { year: '1987', event: 'Colecistectomía laparoscópica', impact: 'Era mínimamente invasiva', era: 'digital' },
  { year: '2000', event: 'Sistema da Vinci — FDA', impact: '🤖 Cirugía robótica', era: 'digital' },
  { year: '2001', event: '"Operación Lindbergh"', impact: 'Telecirugía NY–Estrasburgo', era: 'digital' },
  { year: '2008', event: 'Lista de Verificación OMS', impact: 'Seguridad como sistema', era: 'digital' },
  { year: '2010–hoy', event: 'Quirófano híbrido + IA', impact: 'Sala como plataforma de datos', era: 'future' },
]

const eraStyle: Record<string, { dot: string; row: string; border: string; text: string; label: string }> = {
  ancient: { dot: 'rgba(240,249,255,0.32)', row: 'transparent',                                                       border: 'rgba(240,249,255,0.06)', text: 'rgba(240,249,255,0.5)',  label: 'Antigüedad' },
  early:   { dot: 'rgba(56,189,248,0.55)',  row: 'rgba(56,189,248,0.04)',                                             border: 'rgba(56,189,248,0.14)',  text: 'rgba(240,249,255,0.65)', label: 'Pre-moderno' },
  key:     { dot: '#00d4ff',                row: 'rgba(0,212,255,0.09)',                                              border: 'rgba(0,212,255,0.3)',    text: '#f0f9ff',                label: 'Hito clave' },
  modern:  { dot: 'rgba(96,165,250,0.8)',   row: 'rgba(37,99,235,0.05)',                                              border: 'rgba(37,99,235,0.16)',   text: 'rgba(240,249,255,0.8)',  label: 'Era moderna' },
  digital: { dot: 'rgba(0,212,255,0.85)',   row: 'rgba(0,212,255,0.05)',                                              border: 'rgba(0,212,255,0.18)',   text: 'rgba(240,249,255,0.85)', label: 'Era digital' },
  future:  { dot: '#00d4ff',                row: 'linear-gradient(90deg,rgba(0,212,255,0.12),rgba(109,40,217,0.1))', border: 'rgba(0,212,255,0.35)',   text: '#f0f9ff',                label: 'Presente / futuro' },
}

const legend = ['ancient', 'early', 'key', 'modern', 'digital', 'future']

export default function S04_Timeline() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <SlideLayout>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '4px 20px' }}>
        <div>
          <h2 className="font-display title-reveal" style={{ fontSize: 30, color: 'var(--white)', margin: '0 0 4px' }}>
            De la mesa de cocina al <CyanAccent>quirófano híbrido</CyanAccent>
          </h2>
          <p className="tag-reveal" style={{ fontSize: 12, color: 'var(--white-faint)', margin: 0 }}>
            9,000 años de evolución quirúrgica · {events.length} hitos · toca un hito para ver el detalle
          </p>
        </div>

        {/* Era legend */}
        <div className="tag-reveal" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
          {legend.map((era) => (
            <div key={era} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: eraStyle[era].dot,
                  boxShadow: era === 'key' || era === 'future' ? `0 0 8px ${eraStyle[era].dot}` : 'none',
                }}
              />
              <span className="font-mono" style={{ fontSize: 9, color: 'var(--white-faint)', letterSpacing: '0.05em' }}>
                {eraStyle[era].label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', paddingLeft: 28, marginTop: 18, flex: 1, minHeight: 0 }}>
        {/* Animated vertical spine */}
        <div
          className="timeline-spine"
          style={{
            position: 'absolute', left: 2, top: 4, bottom: 4, width: 2,
            background: 'linear-gradient(180deg, transparent 0%, var(--cyan-bright) 4%, rgba(56,189,248,0.7) 45%, rgba(109,40,217,0.85) 85%, transparent 100%)',
            boxShadow: '0 0 12px rgba(0,212,255,0.5)',
            transformOrigin: 'top',
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
          {events.map((e, i) => {
            const s = eraStyle[e.era]
            const isKey = e.era === 'key' || e.era === 'future'
            const isSelected = selected === i
            return (
              <div
                key={i}
                onClick={() => setSelected(isSelected ? null : i)}
                className="timeline-row card-hover"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '92px 1fr',
                  gap: 16,
                  position: 'relative',
                  borderRadius: 8,
                  cursor: 'pointer',
                  animationDelay: `${0.32 + i * 0.055}s`,
                  transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                  transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1)',
                }}
              >
                {/* Node */}
                <div
                  style={{
                    position: 'absolute', left: -32, top: '50%', transform: 'translateY(-50%)',
                    width: isSelected ? 17 : isKey ? 13 : 9, height: isSelected ? 17 : isKey ? 13 : 9,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'width 0.25s ease, height 0.25s ease',
                  }}
                >
                  {(isKey || isSelected) && (
                    <span
                      className={isSelected ? '' : 'animate-pulse-glow'}
                      style={{
                        position: 'absolute', inset: isSelected ? -7 : -5, borderRadius: '50%',
                        border: `1px solid ${isSelected ? 'var(--cyan-bright)' : s.dot}`,
                        boxShadow: isSelected ? '0 0 12px rgba(0,212,255,0.6)' : 'none',
                      }}
                    />
                  )}
                  <span
                    style={{
                      width: '100%', height: '100%', borderRadius: '50%',
                      background: isSelected ? 'var(--cyan-bright)' : s.dot,
                      boxShadow: isSelected
                        ? '0 0 20px var(--cyan-bright), 0 0 6px #fff'
                        : isKey ? `0 0 16px ${s.dot}, 0 0 4px #fff` : `0 0 4px ${s.dot}`,
                      border: isKey || isSelected ? '1.5px solid rgba(255,255,255,0.5)' : 'none',
                    }}
                  />
                </div>

                <span
                  className="font-mono"
                  style={{
                    fontSize: isSelected ? 11.5 : 10.5, color: isSelected ? 'var(--cyan-bright)' : s.dot, textAlign: 'right',
                    paddingTop: 8, lineHeight: 1.4, flexShrink: 0,
                    fontWeight: isSelected ? 800 : isKey ? 700 : 500,
                  }}
                >
                  {e.year}
                </span>

                <div
                  style={{
                    background: isSelected ? 'rgba(0,212,255,0.16)' : s.row,
                    border: `1px solid ${isSelected ? 'var(--cyan-bright)' : s.border}`,
                    borderLeft: isSelected ? `3px solid var(--cyan-bright)` : isKey ? `2px solid ${s.dot}` : `1px solid ${s.border}`,
                    borderRadius: 7,
                    padding: '7px 16px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 12,
                    backdropFilter: isKey || isSelected ? 'blur(6px)' : 'none',
                    boxShadow: isSelected ? '0 0 24px rgba(0,212,255,0.2), inset 0 0 20px rgba(0,212,255,0.06)' : 'none',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <span style={{ fontSize: 13, color: isSelected ? '#fff' : s.text, fontWeight: isSelected ? 700 : isKey ? 600 : 400 }}>{e.event}</span>
                  <span style={{ fontSize: 11, color: isSelected ? 'var(--cyan-mid)' : 'var(--white-faint)', flexShrink: 0, textAlign: 'right', fontWeight: isSelected ? 600 : 400 }}>{e.impact}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </SlideLayout>
  )
}
