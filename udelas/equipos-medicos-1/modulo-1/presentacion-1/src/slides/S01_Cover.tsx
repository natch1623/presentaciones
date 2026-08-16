import { useEffect, useState } from 'react'
import { At, Halo, CY, WF, WD, dly } from './Stage'

const TITLE_WORDS = ['Salón', 'de', 'Operaciones']

/**
 * Portada. El sistema de anillos no está centrado detrás del
 * texto —eso sería un logotipo—: está desplazado a la derecha y
 * cortado por el borde, de modo que la sala continúa fuera del
 * cuadro y el título se apoya contra ella desde la izquierda.
 */
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
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {/* El domo: anillos concéntricos con centro fuera del cuadro */}
      <Halo x={1170} y={370} size={900} color="rgba(37,99,235,0.3)" blur={70} />
      <Halo x={1290} y={330} size={420} color="rgba(0,212,255,0.22)" blur={40} />

      {[360, 520, 700, 900, 1140].map((size, i) => (
        <div
          key={size}
          style={{
            position: 'absolute',
            left: 1170 - size / 2, top: 370 - size / 2,
            width: size, height: size,
            borderRadius: '50%',
            border: `1px solid rgba(0,212,255,${0.22 - i * 0.038})`,
            animation: `spin-slow ${18 + i * 9}s linear infinite ${i % 2 === 0 ? '' : 'reverse'}`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        >
          {i < 3 && (
            <span
              style={{
                position: 'absolute',
                width: i === 0 ? 9 : 5, height: i === 0 ? 9 : 5,
                borderRadius: '50%',
                background: CY,
                boxShadow: `0 0 14px ${CY}`,
                top: '50%', left: -4, transform: 'translateY(-50%)',
              }}
            />
          )}
        </div>
      ))}

      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: 1170 - 130, top: 370 - 130,
            width: 260, height: 260, borderRadius: '50%',
            border: '1px solid rgba(0,212,255,0.4)',
            animation: `ringExpand ${3.4 + i * 0.6}s ease-out ${i}s infinite`,
            pointerEvents: 'none', zIndex: 0,
          }}
        />
      ))}

      {/* Núcleo */}
      <Halo x={1170} y={370} size={340} color="rgba(0,212,255,0.3)" blur={44} drift={false} />

      {/* ── El título se apoya contra el domo desde la izquierda ── */}
      <div
        style={{
          position: 'absolute', left: 104, top: 196, zIndex: 3,
          opacity: metaVisible ? 1 : 0,
          transform: metaVisible ? 'translateY(0)' : 'translateY(-14px)',
          transition: 'all 0.6s ease',
          display: 'flex', alignItems: 'center', gap: 12,
        }}
      >
        <span style={{ width: 30, height: 2, background: CY, boxShadow: `0 0 10px ${CY}` }} />
        <span
          className="font-mono"
          style={{ fontSize: 10.5, color: 'var(--cyan-mid)', letterSpacing: '0.26em', textTransform: 'uppercase' }}
        >
          UDELAS · Ingeniería Biomédica
        </span>
      </div>

      <div
        style={{
          position: 'absolute', left: 106, top: 234, zIndex: 3,
          opacity: metaVisible ? 1 : 0, transition: 'opacity 0.5s ease 0.2s',
        }}
      >
        <span className="font-mono" style={{ fontSize: 11, letterSpacing: '0.3em', color: 'rgba(0,212,255,0.5)' }}>
          MÓDULO N°1
        </span>
      </div>

      <h1
        className="font-display"
        style={{
          position: 'absolute', left: 100, top: 272, zIndex: 3,
          fontSize: 104, lineHeight: 0.98, margin: 0, fontWeight: 400, maxWidth: 700,
        }}
      >
        {TITLE_WORDS.map((word, i) => (
          <span
            key={word + i}
            style={{
              display: 'inline-block',
              marginRight: i < TITLE_WORDS.length - 1 ? '0.24em' : 0,
              opacity: wordVisible[i] ? 1 : 0,
              transform: wordVisible[i] ? 'translateY(0) scale(1)' : 'translateY(38px) scale(0.92)',
              transition: 'all 0.6s cubic-bezier(0.22,1,0.36,1)',
              color: i === 2 ? CY : 'var(--white)',
              textShadow: i === 2 ? '0 0 60px rgba(0,212,255,0.5)' : 'none',
              filter: wordVisible[i] ? 'blur(0)' : 'blur(8px)',
            }}
          >
            {word}
          </span>
        ))}
      </h1>

      {/* La regla sale del cuadro por la izquierda */}
      <div
        style={{
          position: 'absolute', left: -60, top: 520, height: 2, zIndex: 3,
          background: `linear-gradient(90deg, transparent, ${CY}, #6d28d9, transparent)`,
          boxShadow: '0 0 18px rgba(0,212,255,0.5)',
          width: subVisible ? 700 : 0,
          transition: 'width 0.9s cubic-bezier(0.22,1,0.36,1) 0.1s',
        }}
      />

      <p
        style={{
          position: 'absolute', left: 104, top: 556, zIndex: 3, margin: 0, maxWidth: 560,
          fontSize: 19, color: WD, fontWeight: 300, lineHeight: 1.55,
          opacity: subVisible ? 1 : 0,
          transform: subVisible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 0.6s ease 0.2s',
        }}
      >
        Tema 1: Historia y Conceptos Básicos del Salón de Operaciones
      </p>

      <p
        className="font-mono"
        style={{
          position: 'absolute', left: 104, top: 646, zIndex: 3, margin: 0,
          fontSize: 12, color: 'var(--cyan-mid)', letterSpacing: '0.12em',
          opacity: metaVisible ? 1 : 0,
          transform: metaVisible ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease 0.4s',
        }}
      >
        Ing. Bryan Rodríguez S.
      </p>

      <div
        className="animate-float"
        style={{
          position: 'absolute', left: 104, top: 700, zIndex: 3,
          display: 'flex', alignItems: 'center', gap: 9,
          opacity: metaVisible ? 0.65 : 0, transition: 'opacity 0.6s ease 0.8s',
        }}
      >
        <span
          className="animate-blink"
          style={{ width: 5, height: 5, borderRadius: '50%', background: CY, boxShadow: `0 0 8px ${CY}` }}
        />
        <span className="font-mono" style={{ fontSize: 9.5, color: WF, letterSpacing: '0.2em' }}>
          PRESIONA → PARA COMENZAR
        </span>
      </div>

      {/* Hairline diagonal que ata el texto con el domo */}
      <At l={0} t={0} w={1440} h={810} z={1} anim="none" style={{ pointerEvents: 'none' }}>
        <div
          className="span-x"
          style={{
            position: 'absolute', left: 60, top: 792, width: 1340, height: 1,
            background: `linear-gradient(90deg, transparent, ${CY}22 40%, transparent)`,
            transform: 'rotate(-24deg)', transformOrigin: 'left center',
            ...dly(6),
          }}
        />
      </At>
    </div>
  )
}
