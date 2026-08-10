import { SlideLayout } from './SlideLayout'

/**
 * Portada. La composición imita una lámina de espacio quebrada: un
 * núcleo de vacío del que salen esquirlas, con el título apoyado
 * sobre el filo.
 */
export default function S01_Cover() {
  const EQUIPOS = [
    'Centrífuga',
    'Microscopio',
    'Cámara de flujo laminar',
    'Esterilizador de vapor',
    'Lavador de ELISA',
    'Incubadora de CO₂',
  ]

  return (
    <SlideLayout style={{ padding: 0, justifyContent: 'center' }}>
      {/* ── Composición de esquirlas al fondo ── */}
      <ShatteredSpace />

      {/* ── Numeral del módulo, enorme y hueco ── */}
      <div
        aria-hidden
        className="font-rune"
        style={{
          position: 'absolute',
          right: 54,
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: 400,
          lineHeight: 0.8,
          color: 'transparent',
          WebkitTextStroke: '1.5px rgba(125,99,255,0.28)',
          textShadow: '0 0 90px rgba(125,99,255,0.30)',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        I
      </div>

      {/* ── Bloque de texto ── */}
      <div style={{ position: 'relative', zIndex: 3, padding: '0 62px', maxWidth: 900 }}>
        <div
          className="font-mono tag-reveal"
          style={{
            fontSize: 10,
            letterSpacing: '0.28em',
            color: 'var(--frost)',
            textTransform: 'uppercase',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <span
            style={{
              width: 34,
              height: 1.5,
              background: 'linear-gradient(90deg, var(--frost), transparent)',
              boxShadow: '0 0 8px var(--frost)',
            }}
          />
          <span>UDELAS · Técnico en Biomédica · II Semestre</span>
        </div>

        <div
          className="font-mono stagger-item"
          style={{
            fontSize: 13,
            letterSpacing: '0.34em',
            color: 'var(--rift-soft)',
            marginBottom: 10,
            textShadow: '0 0 22px rgba(125,99,255,0.55)',
          }}
        >
          <span>MÓDULO I</span>
        </div>

        <h1
          className="font-display title-reveal"
          style={{
            fontSize: 68,
            lineHeight: 1.02,
            fontWeight: 400,
            color: 'var(--ice)',
            margin: '0 0 6px',
            letterSpacing: '0.005em',
          }}
        >
          <span>Mantenimiento en equipos</span>
        </h1>
        <h1
          className="font-display title-reveal"
          style={{
            fontSize: 68,
            lineHeight: 1.02,
            fontWeight: 400,
            color: 'var(--frost)',
            margin: '0 0 26px',
            textShadow: '0 0 40px rgba(143,220,255,0.4)',
            animationDelay: '0.16s',
          }}
        >
          <span>de laboratorio clínico</span>
        </h1>

        <div
          style={{
            width: 190,
            height: 2,
            marginBottom: 24,
            background: 'linear-gradient(90deg, var(--rift), var(--frost) 55%, transparent)',
            boxShadow: '0 0 14px rgba(143,220,255,0.6)',
          }}
        />

        {/* Los seis equipos del módulo, como esquirlas alineadas */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 30, maxWidth: 700 }}>
          {EQUIPOS.map((e, i) => (
            <span
              key={e}
              className="stagger-item font-mono"
              style={{
                fontSize: 10.5,
                letterSpacing: '0.06em',
                padding: '6px 13px',
                color: 'var(--ice-dim)',
                background: 'rgba(234,246,255,0.035)',
                border: '1px solid rgba(143,220,255,0.20)',
                clipPath:
                  'polygon(7px 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%, 0 7px)',
                animationDelay: `${0.34 + i * 0.06}s`,
              }}
            >
              <span>{e}</span>
            </span>
          ))}
        </div>

        <div
          className="stagger-item"
          style={{ display: 'flex', alignItems: 'center', gap: 14, animationDelay: '0.8s' }}
        >
          <div
            style={{
              width: 3,
              height: 42,
              background: 'linear-gradient(180deg, var(--frost), var(--rift))',
              boxShadow: '0 0 12px rgba(143,220,255,0.7)',
            }}
          />
          <div>
            <div style={{ fontSize: 15, color: 'var(--ice)', lineHeight: 1.3 }}>
              <span>Ing. Bryan Rodríguez S.</span>
            </div>
            <div
              className="font-mono"
              style={{ fontSize: 10, color: 'var(--ice-faint)', letterSpacing: '0.12em', marginTop: 2 }}
            >
              <span>CÓDIGO 5524 · GRUPO 19349LA</span>
            </div>
          </div>
        </div>
      </div>
    </SlideLayout>
  )
}

/**
 * Lámina de espacio quebrada. Polígonos de vidrio irradiando desde un
 * núcleo oscuro a la derecha, atravesados por dos fisuras luminosas.
 * Es decorativa: `aria-hidden` y sin texto.
 */
function ShatteredSpace() {
  const shards = [
    { p: '820,120 1010,60 980,250 845,235', o: 0.30, d: '0s' },
    { p: '990,240 1180,175 1215,360 1010,395', o: 0.22, d: '0.6s' },
    { p: '860,250 985,255 940,430 830,390', o: 0.34, d: '1.2s' },
    { p: '1000,410 1195,375 1150,565 1015,545', o: 0.18, d: '0.3s' },
    { p: '845,405 935,445 900,620 780,545', o: 0.26, d: '1.6s' },
    { p: '925,455 1010,560 940,700 860,635', o: 0.20, d: '0.9s' },
    { p: '1160,90 1275,140 1230,270 1130,190', o: 0.16, d: '1.9s' },
    { p: '700,300 800,265 815,395 715,415', o: 0.14, d: '2.3s' },
    { p: '1035,590 1180,600 1140,715 1030,690', o: 0.12, d: '1.4s' },
  ]

  return (
    <svg
      aria-hidden
      viewBox="0 0 1280 740"
      preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1, pointerEvents: 'none' }}
    >
      <defs>
        <linearGradient id="cvShard" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#eaf6ff" stopOpacity="0.85" />
          <stop offset="48%" stopColor="#8fdcff" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#7d63ff" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="cvEdge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b8ecff" />
          <stop offset="100%" stopColor="#7d63ff" />
        </linearGradient>
        <radialGradient id="cvCore" cx="50%" cy="50%">
          <stop offset="0%" stopColor="#04050e" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#0b1030" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#0b1030" stopOpacity="0" />
        </radialGradient>
        <filter id="cvGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Núcleo de vacío del que nace la fractura */}
      <ellipse cx="985" cy="380" rx="330" ry="330" fill="url(#cvCore)" />

      {shards.map((s, i) => (
        <polygon
          key={i}
          className="animate-float-slow"
          points={s.p}
          fill="url(#cvShard)"
          fillOpacity={s.o}
          stroke="url(#cvEdge)"
          strokeOpacity={0.55}
          strokeWidth={1}
          style={{ animationDelay: s.d, transformOrigin: 'center' }}
        />
      ))}

      {/* Dos fisuras que cruzan la lámina */}
      <path
        d="M 1250 40 L 1010 300 L 1085 430 L 900 690"
        fill="none"
        stroke="url(#cvEdge)"
        strokeWidth="1.6"
        strokeOpacity="0.75"
        filter="url(#cvGlow)"
      />
      <path
        d="M 660 250 L 820 350 L 760 470 L 930 600"
        fill="none"
        stroke="url(#cvEdge)"
        strokeWidth="1"
        strokeOpacity="0.4"
        filter="url(#cvGlow)"
      />
    </svg>
  )
}
