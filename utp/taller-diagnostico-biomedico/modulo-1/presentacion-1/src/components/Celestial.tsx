import type { CSSProperties, ReactNode } from 'react'

/* ═══════════════════════════════════════════════════════════════
   Motivos del dominio: luna, alas, ondas y destellos.

   Son las piezas que se repiten a lo largo del deck. Todas están
   dibujadas en código —nada de imágenes— así que escalan sin perder
   filo y se recolorean con las variables de la paleta.
   ═══════════════════════════════════════════════════════════════ */

/* ── Luna ──────────────────────────────────────────────────────
   El elemento recurrente: numera secciones, separa capítulos y
   marca los conceptos importantes. Cuatro fases, según el papel:
     full     — disco completo, para portadas y numerales
     crescent — media luna, para marcas discretas
     eclipse  — anillo de fuego alrededor de un disco oscuro
     ring     — sólo el halo, para colgar un número dentro
   ────────────────────────────────────────────────────────────── */

export type MoonPhase = 'full' | 'crescent' | 'eclipse' | 'ring'
/** Los mismos nombres de tono que `SlideLayout`, para poder pasarlos tal cual. */
export type MoonTone = 'moon' | 'hydro' | 'violet' | 'cyan' | 'rose' | 'alert' | 'ember' | 'verdant'

const MOON_INK: Record<MoonTone, { a: string; b: string; rgb: string }> = {
  moon:    { a: '#f5f7ff', b: '#b8e7ff', rgb: '245,247,255' },
  hydro:   { a: '#b8e7ff', b: '#72c7ff', rgb: '114,199,255' },
  violet:  { a: '#c7b5ff', b: '#8d82e8', rgb: '141,130,232' },
  cyan:    { a: '#bdf8ff', b: '#72c7ff', rgb: '189,248,255' },
  rose:    { a: '#e5b8e8', b: '#c7b5ff', rgb: '229,184,232' },
  alert:   { a: '#ff8fa8', b: '#e5b8e8', rgb: '255,143,168' },
  ember:   { a: '#f3c98b', b: '#e5b8e8', rgb: '243,201,139' },
  verdant: { a: '#8fe3c8', b: '#72c7ff', rgb: '143,227,200' },
}

let uid = 0
const nextId = () => `cel${++uid}`

export function Moon({
  size = 120,
  phase = 'full',
  tone = 'moon',
  /** Anillos orbitales alrededor del disco. */
  rings = 0,
  /** Halo radial detrás. Apagarlo cuando la luna va sobre un panel. */
  halo = true,
  /** Un número, un símbolo o nada: va centrado dentro del disco. */
  children,
  style,
  className,
}: {
  size?: number
  phase?: MoonPhase
  tone?: MoonTone
  rings?: number
  halo?: boolean
  children?: ReactNode
  style?: CSSProperties
  className?: string
}) {
  const id = nextId()
  const ink = MOON_INK[tone]
  const r = 42

  return (
    <div
      className={className}
      style={{ position: 'relative', width: size, height: size, flexShrink: 0, ...style }}
    >
      {halo && (
        <div
          className="animate-halo"
          aria-hidden
          style={{
            position: 'absolute',
            inset: '-45%',
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(${ink.rgb},0.26) 0%, transparent 66%)`,
            filter: 'blur(14px)',
          }}
        />
      )}

      <svg aria-hidden viewBox="0 0 100 100" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <radialGradient id={`${id}disc`} cx="36%" cy="30%">
            <stop offset="0%" stopColor={ink.a} stopOpacity="0.95" />
            <stop offset="52%" stopColor={ink.b} stopOpacity="0.42" />
            <stop offset="100%" stopColor={ink.b} stopOpacity="0.10" />
          </radialGradient>
          <linearGradient id={`${id}rim`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={ink.a} stopOpacity="0.9" />
            <stop offset="100%" stopColor={ink.b} stopOpacity="0.25" />
          </linearGradient>
          {/* La sombra que recorta la media luna */}
          <mask id={`${id}crescent`}>
            <circle cx="50" cy="50" r={r} fill="#fff" />
            <circle cx="64" cy="43" r={r * 0.94} fill="#000" />
          </mask>
        </defs>

        {rings > 0 &&
          Array.from({ length: rings }, (_, i) => (
            <g key={i} className={i % 2 === 0 ? 'animate-ring' : 'animate-ring-r'} style={{ transformOrigin: '50px 50px' }}>
              <ellipse
                cx="50"
                cy="50"
                rx={r + 9 + i * 7}
                ry={(r + 9 + i * 7) * (i % 2 === 0 ? 0.34 : 0.72)}
                fill="none"
                stroke={`rgba(${ink.rgb},${0.30 - i * 0.06})`}
                strokeWidth="0.7"
                transform={`rotate(${i % 2 === 0 ? -14 : 22} 50 50)`}
              />
            </g>
          ))}

        {phase === 'full' && (
          <>
            <circle cx="50" cy="50" r={r} fill={`url(#${id}disc)`} />
            <circle cx="50" cy="50" r={r} fill="none" stroke={`url(#${id}rim)`} strokeWidth="0.9" />
          </>
        )}

        {phase === 'crescent' && (
          <g mask={`url(#${id}crescent)`}>
            <circle cx="50" cy="50" r={r} fill={`url(#${id}disc)`} />
            <circle cx="50" cy="50" r={r} fill="none" stroke={ink.a} strokeOpacity="0.75" strokeWidth="1" />
          </g>
        )}

        {phase === 'eclipse' && (
          <>
            <circle cx="50" cy="50" r={r} fill="rgba(8,13,36,0.94)" />
            <circle
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={ink.a}
              strokeOpacity="0.85"
              strokeWidth="1.6"
              style={{ filter: `drop-shadow(0 0 6px rgba(${ink.rgb},0.9))` }}
            />
            <circle cx="50" cy="50" r={r - 4} fill="none" stroke={ink.b} strokeOpacity="0.25" strokeWidth="0.6" />
          </>
        )}

        {phase === 'ring' && (
          <>
            <circle cx="50" cy="50" r={r} fill={`rgba(${ink.rgb},0.05)`} />
            <circle cx="50" cy="50" r={r} fill="none" stroke={`rgba(${ink.rgb},0.55)`} strokeWidth="1" />
            <circle cx="50" cy="50" r={r - 5} fill="none" stroke={`rgba(${ink.rgb},0.18)`} strokeWidth="0.6" />
          </>
        )}
      </svg>

      {children != null && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

/* ── Alas ──────────────────────────────────────────────────────
   No aparecen en todas las diapositivas: completas en la portada y
   el cierre, en silueta parcial en los separadores, en fragmentos
   sueltos en el resto. Esa progresión es la narrativa visual.

   La aparición sigue el guion de la guía: primero partículas, luego
   la estructura, después la expansión, el brillo y por último la
   flotación permanente.
   ────────────────────────────────────────────────────────────── */

/** Cada pluma: largo, ángulo desde la horizontal y ancho del cuerpo. */
const PRIMARIES = [
  { len: 206, ang: -33, w: 15 },
  { len: 252, ang: -21, w: 17 },
  { len: 288, ang: -10, w: 18 },
  { len: 306, ang: 1,   w: 19 },
  { len: 296, ang: 12,  w: 18 },
  { len: 264, ang: 22,  w: 16 },
  { len: 222, ang: 32,  w: 14 },
  { len: 176, ang: 43,  w: 12 },
  { len: 128, ang: 55,  w: 10 },
]
/** Plumas cortas junto al hombro: dan cuerpo al nacimiento del ala. */
const COVERTS = [
  { len: 104, ang: -20, w: 12 },
  { len: 118, ang: -4,  w: 13 },
  { len: 110, ang: 12,  w: 12 },
  { len: 88,  ang: 28,  w: 10 },
]

/** Dibuja una pluma como una hoja: sale del hombro y vuelve a él. */
function featherPath(len: number, angDeg: number, w: number): string {
  const a = (angDeg * Math.PI) / 180
  const tx = -len * Math.cos(a)
  const ty = len * Math.sin(a)
  const mx = tx * 0.52
  const my = ty * 0.52
  // Perpendicular unitaria al eje de la pluma, escalada al ancho
  const px = (-Math.sin(a) * w) / 1
  const py = (-Math.cos(a) * w) / 1
  return `M 0 0 Q ${mx + px} ${my + py} ${tx} ${ty} Q ${mx - px} ${my - py} 0 0 Z`
}

/** Chispas que preceden a la formación del ala. */
const SPARKS = [
  { x: -70, y: -46, r: 2.4, d: 0.30 },
  { x: -142, y: -20, r: 1.8, d: 0.42 },
  { x: -196, y: 24, r: 2.2, d: 0.36 },
  { x: -96, y: 58, r: 1.6, d: 0.50 },
  { x: -244, y: -34, r: 2.0, d: 0.46 },
  { x: -168, y: 78, r: 1.5, d: 0.54 },
  { x: -40, y: 30, r: 1.9, d: 0.26 },
  { x: -288, y: 12, r: 1.7, d: 0.58 },
]

export function Wings({
  width = 760,
  tone = 'moon',
  /** `full` para portada y cierre; `silhouette` sólo insinúa el trazo. */
  variant = 'full',
  opacity = 1,
  style,
}: {
  width?: number
  tone?: MoonTone
  variant?: 'full' | 'silhouette'
  opacity?: number
  style?: CSSProperties
}) {
  const id = nextId()
  const ink = MOON_INK[tone]
  const silhouette = variant === 'silhouette'

  // Las plumas no nacen todas del mismo punto: sus arranques se
  // reparten sobre un hombro corto. Sin ese desplazamiento el ala se
  // lee como un abanico de púas saliendo de un vértice.
  const hombro = (i: number, n: number) => ({ ox: -4 - (i / n) * 34, oy: -16 + (i / n) * 40 })

  const wing = (
    <>
      {PRIMARIES.map((f, i) => {
        const { ox, oy } = hombro(i, PRIMARIES.length)
        return (
          <path
            key={`p${i}`}
            className="wing-feather"
            transform={`translate(${ox} ${oy})`}
            d={featherPath(f.len, f.ang, f.w)}
            fill={silhouette ? 'none' : `url(#${id}fill)`}
            fillOpacity={silhouette ? 0 : 0.62}
            stroke={`rgba(${ink.rgb},${silhouette ? 0.34 : 0.26})`}
            strokeWidth="1"
            style={{ animationDelay: `${0.62 + i * 0.055}s` }}
          />
        )
      })}
      {!silhouette &&
        COVERTS.map((f, i) => {
          const { ox, oy } = hombro(i, COVERTS.length * 1.6)
          return (
            <path
              key={`c${i}`}
              className="wing-feather"
              transform={`translate(${ox} ${oy})`}
              d={featherPath(f.len, f.ang, f.w)}
              fill={`url(#${id}fill)`}
              fillOpacity={0.75}
              stroke={`rgba(${ink.rgb},0.24)`}
              strokeWidth="0.8"
              style={{ animationDelay: `${0.86 + i * 0.05}s` }}
            />
          )
        })}
    </>
  )

  return (
    <svg
      aria-hidden
      viewBox="-420 -200 840 400"
      style={{ width, height: (width * 400) / 840, overflow: 'visible', opacity, ...style }}
    >
      <defs>
        <linearGradient id={`${id}fill`} x1="1" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={ink.a} stopOpacity="0.85" />
          <stop offset="55%" stopColor={ink.b} stopOpacity="0.30" />
          <stop offset="100%" stopColor={ink.b} stopOpacity="0.04" />
        </linearGradient>
        <radialGradient id={`${id}glow`} cx="50%" cy="50%">
          <stop offset="0%" stopColor={ink.a} stopOpacity="0.28" />
          <stop offset="100%" stopColor={ink.a} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Brillo que enciende detrás de las alas ya formadas */}
      <ellipse className="wing-glow" cx="0" cy="0" rx="360" ry="150" fill={`url(#${id}glow)`} />

      {/* Chispas previas a la formación */}
      {SPARKS.map((s, i) => (
        <g key={i}>
          <circle className="wing-spark" cx={s.x} cy={s.y} r={s.r} fill={ink.a} style={{ animationDelay: `${s.d}s` }} />
          <circle className="wing-spark" cx={-s.x} cy={s.y} r={s.r} fill={ink.a} style={{ animationDelay: `${s.d + 0.06}s` }} />
        </g>
      ))}

      <g className="wing-expand" style={{ transformOrigin: '0px 0px' }}>
        <g className="wing-float">
          <g>{wing}</g>
          <g transform="scale(-1,1)">{wing}</g>
        </g>
      </g>
    </svg>
  )
}

/* ── Ondas hydro ───────────────────────────────────────────────
   El agua nunca se dibuja como gotas: son anillos concéntricos que
   nacen de un punto, o una onda que recorre el pie de la lámina.
   ────────────────────────────────────────────────────────────── */

export function Ripples({
  size = 260,
  tone = 'hydro',
  count = 4,
  style,
}: {
  size?: number
  tone?: MoonTone
  count?: number
  style?: CSSProperties
}) {
  const ink = MOON_INK[tone]
  return (
    <div aria-hidden style={{ position: 'relative', width: size, height: size, flexShrink: 0, ...style }}>
      {Array.from({ length: count }, (_, i) => {
        const s = ((i + 1) / count) * 100
        return (
          <div
            key={i}
            className="animate-halo"
            style={{
              position: 'absolute',
              left: `${50 - s / 2}%`,
              top: `${50 - s / 2}%`,
              width: `${s}%`,
              height: `${s}%`,
              borderRadius: '50%',
              border: `1px solid rgba(${ink.rgb},${0.34 - i * 0.06})`,
              animationDelay: `${i * 0.85}s`,
            }}
          />
        )
      })}
    </div>
  )
}

/** Onda larga y suave: para el pie de una composición. */
export function WaveLine({
  width = 420,
  height = 40,
  tone = 'hydro',
  opacity = 0.5,
  style,
}: {
  width?: number
  height?: number
  tone?: MoonTone
  opacity?: number
  style?: CSSProperties
}) {
  const ink = MOON_INK[tone]
  return (
    <svg aria-hidden viewBox="0 0 256 40" preserveAspectRatio="none" style={{ width, height, opacity, ...style }}>
      <g className="hydro-wave">
        <path
          d="M -64 20 Q -32 4 0 20 T 64 20 T 128 20 T 192 20 T 256 20 T 320 20"
          fill="none"
          stroke={`rgba(${ink.rgb},0.55)`}
          strokeWidth="1"
        />
        <path
          d="M -64 28 Q -32 14 0 28 T 64 28 T 128 28 T 192 28 T 256 28 T 320 28"
          fill="none"
          stroke={`rgba(${ink.rgb},0.24)`}
          strokeWidth="1"
        />
      </g>
    </svg>
  )
}

/* ── Destellos ─────────────────────────────────────────────────
   El ✦ de cuatro puntas que remata esquinas y marca conceptos.
   ────────────────────────────────────────────────────────────── */

export function Spark({
  size = 12,
  tone = 'cyan',
  style,
  className,
}: {
  size?: number
  tone?: MoonTone
  style?: CSSProperties
  className?: string
}) {
  const ink = MOON_INK[tone]
  return (
    <svg
      aria-hidden
      className={className}
      viewBox="0 0 24 24"
      style={{ width: size, height: size, flexShrink: 0, filter: `drop-shadow(0 0 4px rgba(${ink.rgb},0.8))`, ...style }}
    >
      {/* Cuatro puntas cóncavas: una estrella de destello, no un asterisco */}
      <path
        d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z"
        fill={ink.a}
      />
    </svg>
  )
}

/** Pluma suelta: el motivo de las alas reducido a un fragmento. */
export function Feather({
  size = 26,
  tone = 'hydro',
  rotate = 0,
  opacity = 0.7,
  style,
  className,
}: {
  size?: number
  tone?: MoonTone
  rotate?: number
  opacity?: number
  style?: CSSProperties
  className?: string
}) {
  const ink = MOON_INK[tone]
  return (
    <svg
      aria-hidden
      className={className}
      viewBox="-4 -22 108 44"
      style={{ width: size, height: size * 0.4, opacity, transform: `rotate(${rotate}deg)`, flexShrink: 0, ...style }}
    >
      <path d={featherPath(96, 0, 15)} fill={`rgba(${ink.rgb},0.22)`} stroke={`rgba(${ink.rgb},0.6)`} strokeWidth="1.2" />
      <path d="M 0 0 L -92 0" stroke={`rgba(${ink.rgb},0.45)`} strokeWidth="0.8" transform="scale(1,1)" />
    </svg>
  )
}

/* ── Órbita vertical ───────────────────────────────────────────
   Sustituye la flecha de los diagramas de proceso: los pasos cuelgan
   de un arco lunar en vez de encadenarse con puntas de flecha.
   ────────────────────────────────────────────────────────────── */

export function OrbitTrack({
  height = 420,
  tone = 'hydro',
  style,
}: {
  height?: number
  tone?: MoonTone
  style?: CSSProperties
}) {
  const ink = MOON_INK[tone]
  return (
    <svg aria-hidden viewBox="0 0 20 400" preserveAspectRatio="none" style={{ width: 20, height, ...style }}>
      <line
        x1="10" y1="0" x2="10" y2="400"
        stroke={`rgba(${ink.rgb},0.28)`}
        strokeWidth="1"
        strokeDasharray="3 6"
      />
    </svg>
  )
}
