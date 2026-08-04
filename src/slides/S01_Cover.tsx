import { useEffect, useState } from 'react'

const TITLE_WORDS = ['Salón', 'de', 'Operaciones']

export default function S01_Cover() {
  const [wordVisible, setWordVisible] = useState<boolean[]>([false, false, false])
  const [subVisible, setSubVisible] = useState(false)
  const [metaVisible, setMetaVisible] = useState(false)

  useEffect(() => {
    const timers = TITLE_WORDS.map((_, i) =>
      setTimeout(() => setWordVisible(prev => { const n = [...prev]; n[i] = true; return n }), 300 + i * 160)
    )
    const t1 = setTimeout(() => setSubVisible(true), 900)
    const t2 = setTimeout(() => setMetaVisible(true), 1200)
    return () => { timers.forEach(clearTimeout); clearTimeout(t1); clearTimeout(t2) }
  }, [])

  return (
    <div
      style={{
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}
    >
      {/* ── Rotating ring system ── */}
      {[280, 420, 560, 700].map((size, i) => (
        <div
          key={size}
          style={{
            position: 'absolute',
            width: size, height: size,
            borderRadius: '50%',
            border: `1px solid rgba(0,212,255,${0.18 - i * 0.04})`,
            animation: `spin-slow ${16 + i * 10}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
            boxShadow: `0 0 ${8 + i * 4}px rgba(0,212,255,${0.06 - i * 0.01})`,
          }}
        >
          {/* Glowing node on ring */}
          {i < 2 && (
            <div
              style={{
                position: 'absolute',
                width: i === 0 ? 8 : 5,
                height: i === 0 ? 8 : 5,
                borderRadius: '50%',
                background: 'var(--cyan-bright)',
                boxShadow: '0 0 12px var(--cyan-bright)',
                top: '50%',
                left: -4,
                transform: 'translateY(-50%)',
              }}
            />
          )}
        </div>
      ))}

      {/* Expanding ring pulse */}
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            position: 'absolute',
            width: 200, height: 200,
            borderRadius: '50%',
            border: '1px solid rgba(0,212,255,0.4)',
            animation: `ringExpand ${3 + i * 0.5}s ease-out ${i * 1}s infinite`,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* ── Center glow core ── */}
      <div
        className="animate-pulse-glow"
        style={{
          position: 'absolute',
          width: 300, height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.35) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />

      {/* ── Content ── */}
      <div style={{ position: 'relative', textAlign: 'center', maxWidth: 840, padding: '0 40px', zIndex: 2 }}>

        {/* Module tag */}
        <div
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            marginBottom: 28,
            opacity: metaVisible ? 1 : 0,
            transform: metaVisible ? 'translateY(0)' : 'translateY(-12px)',
            transition: 'all 0.6s ease',
          }}
        >
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.6))', maxWidth: 80 }} />
          <span
            className="font-mono"
            style={{ fontSize: 10, color: 'var(--cyan-mid)', letterSpacing: '0.25em', textTransform: 'uppercase' }}
          >
            UDELAS · Ingeniería Biomédica
          </span>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(0,212,255,0.6), transparent)', maxWidth: 80 }} />
        </div>

        <span
          className="font-mono"
          style={{
            display: 'block', fontSize: 11, letterSpacing: '0.2em', color: 'rgba(0,212,255,0.55)',
            marginBottom: 6,
            opacity: metaVisible ? 1 : 0, transition: 'opacity 0.5s ease 0.2s',
          }}
        >
          MÓDULO N°1
        </span>

        {/* Animated title */}
        <h1
          className="font-display"
          style={{ fontSize: 66, lineHeight: 1.12, margin: '0 0 10px', fontWeight: 400 }}
        >
          {TITLE_WORDS.map((word, i) => (
            <span
              key={word + i}
              style={{
                display: 'inline-block',
                marginRight: i < TITLE_WORDS.length - 1 ? '0.25em' : 0,
                opacity: wordVisible[i] ? 1 : 0,
                transform: wordVisible[i] ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.9)',
                transition: 'all 0.5s cubic-bezier(0.22,1,0.36,1)',
                color: i === 2 ? 'var(--cyan-bright)' : 'var(--white)',
                textShadow: i === 2 ? '0 0 40px rgba(0,212,255,0.5)' : 'none',
                filter: wordVisible[i] ? 'blur(0)' : 'blur(6px)',
              }}
            >
              {word}
            </span>
          ))}
        </h1>

        {/* Animated divider */}
        <div
          style={{
            height: 2,
            background: 'linear-gradient(90deg, transparent, var(--cyan-bright), #6d28d9, transparent)',
            margin: '18px auto',
            boxShadow: '0 0 16px rgba(0,212,255,0.5)',
            width: subVisible ? 440 : 0,
            transition: 'width 0.8s cubic-bezier(0.22,1,0.36,1) 0.1s',
          }}
        />

        <p
          style={{
            fontSize: 18,
            color: 'var(--white-dim)',
            margin: '0 0 8px',
            fontWeight: 300,
            opacity: subVisible ? 1 : 0,
            transform: subVisible ? 'translateY(0)' : 'translateY(16px)',
            transition: 'all 0.6s ease 0.2s',
          }}
        >
          Tema 1: Historia y Conceptos Básicos del Salón de Operaciones
        </p>

        {/* Author / institution badges */}
        <div
          style={{
            marginTop: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
            opacity: metaVisible ? 1 : 0,
            transform: metaVisible ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.6s ease 0.4s',
          }}
        >
          {[
            { label: 'Ing. Bryan Rodríguez S.', color: 'rgba(0,212,255,0.15)', border: 'rgba(0,212,255,0.3)', text: 'var(--cyan-mid)' },
          ].map(b => (
            <div
              key={b.label}
              style={{
                background: b.color, border: `1px solid ${b.border}`,
                borderRadius: 8, padding: '9px 18px',
              }}
            >
              <p className="font-mono" style={{ fontSize: 11, color: b.text, margin: 0, letterSpacing: '0.07em' }}>
                {b.label}
              </p>
            </div>
          ))}
        </div>

        {/* Hint */}
        <div
          className="animate-float"
          style={{
            marginTop: 48, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            opacity: metaVisible ? 0.7 : 0, transition: 'opacity 0.6s ease 0.8s',
          }}
        >
          <div
            className="animate-blink"
            style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--cyan-bright)', boxShadow: '0 0 8px var(--cyan-bright)' }}
          />
          <span className="font-mono" style={{ fontSize: 10, color: 'var(--white-faint)', letterSpacing: '0.12em' }}>
            PRESIONA → PARA COMENZAR
          </span>
        </div>
      </div>
    </div>
  )
}
