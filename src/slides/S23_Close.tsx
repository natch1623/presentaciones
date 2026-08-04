import { useEffect, useState } from 'react'

const ideas = [
  {
    num: '01',
    text: 'El quirófano moderno es el resultado de resolver secuencialmente tres problemas:',
    highlight: 'dolor (1846) → infección (1867–1886) → soporte vital (s. XX)',
    color: '#00d4ff',
  },
  {
    num: '02',
    text: 'Un salón de operaciones no es un cuarto: es un',
    highlight: 'sistema integrado de aire, energía, gases, iluminación y equipamiento — con parámetros medibles y auditables.',
    color: '#38bdf8',
  },
  {
    num: '03',
    text: 'Cada parámetro ambiental tiene una justificación clínica;',
    highlight: 'el ingeniero biomédico debe poder explicarla, no solo medirla.',
    color: '#a78bfa',
  },
  {
    num: '04',
    text: 'La evidencia clínica puede contradecir la intuición técnica (caso flujo laminar):',
    highlight: 'valida siempre contra desenlace en el paciente.',
    color: '#fbbf24',
  },
]

export default function S23_Close() {
  const [visible, setVisible] = useState<boolean[]>([false, false, false, false])
  const [nextVisible, setNextVisible] = useState(false)

  useEffect(() => {
    const timers = ideas.map((_, i) =>
      setTimeout(() => setVisible(prev => { const n = [...prev]; n[i] = true; return n }), 200 + i * 180)
    )
    const t = setTimeout(() => setNextVisible(true), 1100)
    return () => { timers.forEach(clearTimeout); clearTimeout(t) }
  }, [])

  return (
    <div
      style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden', padding: '28px 44px',
      }}
    >
      {/* Background decorations */}
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          animation: 'gridDrift 10s linear infinite',
        }}
      />
      {/* Center violet orb */}
      <div
        className="animate-pulse-glow"
        style={{
          position: 'absolute',
          width: 600, height: 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(109,40,217,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          bottom: -100, right: -100,
        }}
      />

      <div style={{ position: 'relative', width: '100%', maxWidth: 900, zIndex: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 36, height: 2, background: 'var(--cyan-bright)', boxShadow: '0 0 10px var(--cyan-bright)' }} />
          <span className="font-mono" style={{ fontSize: 10, color: 'var(--cyan-bright)', letterSpacing: '0.22em' }}>
            CIERRE Y TRANSICIÓN
          </span>
        </div>

        <h2
          className="font-display title-reveal"
          style={{ fontSize: 46, color: 'var(--white)', margin: '0 0 28px', lineHeight: 1.15 }}
        >
          Ideas para{' '}
          <span style={{ color: 'var(--cyan-bright)', textShadow: '0 0 40px rgba(0,212,255,0.5)' }}>
            llevarse
          </span>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {ideas.map((idea, i) => (
            <div
              key={idea.num}
              style={{
                display: 'flex', gap: 20,
                padding: '14px 20px',
                background: `linear-gradient(90deg, ${idea.color}08, rgba(10,26,74,0.7))`,
                border: `1px solid ${idea.color}20`,
                borderLeft: `3px solid ${idea.color}`,
                borderRadius: 10,
                opacity: visible[i] ? 1 : 0,
                transform: visible[i] ? 'translateX(0)' : 'translateX(-30px)',
                transition: 'all 0.5s cubic-bezier(0.22,1,0.36,1)',
                boxShadow: visible[i] ? `0 2px 20px ${idea.color}10` : 'none',
              }}
            >
              <span
                className="font-mono"
                style={{ fontSize: 22, color: idea.color, flexShrink: 0, lineHeight: 1.4, opacity: 0.4 }}
              >
                {idea.num}
              </span>
              <p style={{ fontSize: 14, color: 'var(--white)', margin: 0, lineHeight: 1.75 }}>
                {idea.text}{' '}
                <strong style={{ color: idea.color, textShadow: `0 0 16px ${idea.color}50` }}>
                  {idea.highlight}
                </strong>
              </p>
            </div>
          ))}
        </div>

        {/* Next topic */}
        <div
          style={{
            padding: '22px 28px',
            background: 'linear-gradient(135deg, rgba(109,40,217,0.15), rgba(10,26,74,0.85))',
            border: '1px solid rgba(109,40,217,0.4)',
            borderRadius: 14,
            display: 'flex', alignItems: 'center', gap: 22,
            opacity: nextVisible ? 1 : 0,
            transform: nextVisible ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
            transition: 'all 0.6s cubic-bezier(0.22,1,0.36,1)',
            boxShadow: nextVisible ? '0 0 40px rgba(109,40,217,0.15)' : 'none',
          }}
        >
          <div
            style={{
              width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
              background: 'rgba(109,40,217,0.2)',
              border: '1px solid rgba(109,40,217,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
              boxShadow: '0 0 20px rgba(109,40,217,0.3)',
            }}
          >
            →
          </div>
          <div>
            <p className="font-mono" style={{ fontSize: 10, color: '#a78bfa', margin: '0 0 5px', letterSpacing: '0.18em' }}>
              PRÓXIMO TEMA
            </p>
            <p className="font-display" style={{ fontSize: 24, color: 'var(--white)', margin: '0 0 5px' }}>
              Máquina de Anestesia
            </p>
            <p style={{ fontSize: 13, color: '#a78bfa', margin: 0, fontStyle: 'italic' }}>
              "Si el quirófano es el sistema, la máquina de anestesia es el equipo que sostiene la vida mientras el cirujano trabaja."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
