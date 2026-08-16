import type { ReactNode, CSSProperties } from 'react'
import { Moon, Spark } from '../components/Celestial'

/* ═══════════════════════════════════════════════════════════════
   Vocabulario visual del deck.

   Todo lo que se repite entre diapositivas vive acá. Las superficies
   son fragmentos de cristal lunar —transparencia, filo de 1 px, halo
   difuso— nunca tarjetas blancas, y los bordes nunca pasan de 2 px.
   ═══════════════════════════════════════════════════════════════ */

export type Tone = 'hydro' | 'violet' | 'cyan' | 'moon' | 'alert' | 'ember' | 'verdant' | 'rose'

export const TONE: Record<Tone, { fg: string; edge: string; bg: string; glow: string }> = {
  hydro:   { fg: 'var(--hydro)',   edge: 'rgba(114,199,255,0.30)', bg: 'rgba(114,199,255,0.07)', glow: 'rgba(114,199,255,0.28)' },
  violet:  { fg: 'var(--lilac)',   edge: 'rgba(199,181,255,0.30)', bg: 'rgba(141,130,232,0.09)', glow: 'rgba(199,181,255,0.30)' },
  cyan:    { fg: 'var(--cyan)',    edge: 'rgba(189,248,255,0.28)', bg: 'rgba(189,248,255,0.06)', glow: 'rgba(189,248,255,0.30)' },
  moon:    { fg: 'var(--moon)',    edge: 'rgba(245,247,255,0.18)', bg: 'rgba(245,247,255,0.04)', glow: 'rgba(245,247,255,0.20)' },
  alert:   { fg: 'var(--alert)',   edge: 'rgba(255,143,168,0.32)', bg: 'rgba(255,143,168,0.08)', glow: 'rgba(255,143,168,0.26)' },
  ember:   { fg: 'var(--ember)',   edge: 'rgba(243,201,139,0.30)', bg: 'rgba(243,201,139,0.07)', glow: 'rgba(243,201,139,0.24)' },
  verdant: { fg: 'var(--verdant)', edge: 'rgba(143,227,200,0.30)', bg: 'rgba(143,227,200,0.07)', glow: 'rgba(143,227,200,0.24)' },
  rose:    { fg: 'var(--rose)',    edge: 'rgba(229,184,232,0.28)', bg: 'rgba(229,184,232,0.06)', glow: 'rgba(229,184,232,0.24)' },
}

/* ── Contenedor ──────────────────────────────────────────────── */

export function SlideLayout({
  children,
  style,
  scrollable,
}: {
  children: ReactNode
  style?: CSSProperties
  scrollable?: boolean
}) {
  return (
    <div
      className={scrollable ? 'slide-scroll' : ''}
      style={{
        width: '100%',
        height: '100%',
        padding: '26px 48px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: scrollable ? 'auto' : 'hidden',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/* ── Encabezados ─────────────────────────────────────────────── */

export function SlideTag({ children, tone = 'hydro' }: { children: ReactNode; tone?: Tone }) {
  return (
    <div
      className="font-mono tag-reveal"
      style={{
        fontSize: 10,
        letterSpacing: '0.20em',
        color: TONE[tone].fg,
        textTransform: 'uppercase',
        marginBottom: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <span
        style={{
          width: 24,
          height: 1,
          background: `linear-gradient(90deg, ${TONE[tone].fg}, transparent)`,
          boxShadow: `0 0 6px ${TONE[tone].glow}`,
        }}
      />
      {children}
    </div>
  )
}

export function SlideTitle({
  children,
  size = 'lg',
  style,
}: {
  children: ReactNode
  size?: 'xl' | 'lg' | 'md' | 'sm'
  style?: CSSProperties
}) {
  const sizes = { xl: 58, lg: 44, md: 34, sm: 26 }
  return (
    <h2
      className="font-display title-reveal"
      style={{
        fontSize: sizes[size],
        lineHeight: 1.1,
        color: 'var(--moon)',
        margin: '0 0 16px',
        fontWeight: 400,
        letterSpacing: '0.005em',
        ...style,
      }}
    >
      {children}
    </h2>
  )
}

/** Palabra importante: azul hydro. */
export function Hydro({ children }: { children: ReactNode }) {
  return <span style={{ color: '#8dccff', textShadow: '0 0 22px rgba(114,199,255,0.45)' }}>{children}</span>
}

/** Concepto especial del dominio: lila. */
export function Lunar({ children }: { children: ReactNode }) {
  return <span style={{ color: 'var(--lilac)', textShadow: '0 0 22px rgba(199,181,255,0.5)' }}>{children}</span>
}

/** Riesgo real. Se usa poquísimo, y siempre significa peligro. */
export function Alert({ children }: { children: ReactNode }) {
  return <span style={{ color: 'var(--alert)', textShadow: '0 0 20px rgba(255,143,168,0.4)' }}>{children}</span>
}

/* ── Superficies ─────────────────────────────────────────────── */

/**
 * Fragmento de cristal lunar. `ornament` cuelga un destello en la
 * esquina superior izquierda y una luna en la inferior derecha —el
 * remate discreto que pide la guía para los paneles.
 */
export function Glass({
  children,
  tone = 'hydro',
  style,
  hover = true,
  /** Sin marco: sólo el filo lateral. Alivia mucho una rejilla densa. */
  open = false,
  ornament = false,
}: {
  children: ReactNode
  tone?: Tone
  style?: CSSProperties
  hover?: boolean
  open?: boolean
  ornament?: boolean
}) {
  // `border` y `borderLeft` en el mismo objeto se pisan entre renders
  // y React lo advierte, así que cada variante arma su propio bloque.
  const frame: CSSProperties = open
    ? {
        background: 'linear-gradient(100deg, rgba(23,36,74,0.52) 0%, rgba(8,13,36,0.06) 88%)',
        borderLeft: `1.5px solid ${TONE[tone].fg}`,
        borderRadius: '2px 10px 10px 2px',
      }
    : {
        background: 'linear-gradient(152deg, rgba(23,36,74,0.70) 0%, rgba(8,13,36,0.86) 100%)',
        border: `1px solid ${TONE[tone].edge}`,
        borderRadius: 10,
        boxShadow: `inset 0 1px 0 rgba(245,247,255,0.05), 0 8px 30px rgba(4,7,22,0.42), 0 0 24px ${TONE[tone].bg}`,
      }

  return (
    <div
      className={hover && !open ? 'moon-panel' : undefined}
      style={{
        position: 'relative',
        padding: '15px 18px',
        ...frame,
        ...style,
      }}
    >
      {ornament && (
        <>
          <Spark size={9} tone="cyan" style={{ position: 'absolute', top: 8, left: 9, opacity: 0.5 }} />
          <Moon
            size={12}
            phase="crescent"
            tone="violet"
            halo={false}
            style={{ position: 'absolute', bottom: 8, right: 9, opacity: 0.55 }}
          />
        </>
      )}
      {children}
    </div>
  )
}

/**
 * Bloque sin caja: una etiqueta y una línea orbital. Para agrupar
 * contenido sin sumar otro rectángulo a la diapositiva.
 */
export function Panel({
  label,
  tone = 'hydro',
  children,
  style,
}: {
  label?: ReactNode
  tone?: Tone
  children: ReactNode
  style?: CSSProperties
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, ...style }}>
      {label && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 9 }}>
          <span
            className="font-mono"
            style={{
              fontSize: 9.5,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: TONE[tone].fg,
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </span>
          <span
            style={{
              flex: 1,
              height: 1,
              background: `linear-gradient(90deg, ${TONE[tone].edge}, transparent)`,
            }}
          />
        </div>
      )}
      {children}
    </div>
  )
}

/**
 * Marco para un diagrama dibujado en código (o para una imagen, si
 * alguna vez se suma una). Sin `children` ni `src` reserva el hueco y
 * dice qué debería ir ahí.
 */
export function Figure({
  src,
  alt,
  caption,
  hint,
  file,
  tone = 'hydro',
  height,
  fit = 'contain',
  children,
  style,
}: {
  src?: string
  alt?: string
  caption?: ReactNode
  hint?: ReactNode
  file?: string
  tone?: Tone
  height?: number | string
  fit?: 'contain' | 'cover'
  children?: ReactNode
  style?: CSSProperties
}) {
  return (
    <figure
      style={{
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        minHeight: 0,
        flex: height ? undefined : 1,
        ...style,
      }}
    >
      <div
        style={{
          position: 'relative',
          flex: height ? undefined : 1,
          height,
          minHeight: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: children || src ? 10 : 16,
          background: 'linear-gradient(150deg, rgba(23,36,74,0.40) 0%, rgba(8,13,36,0.62) 100%)',
          borderWidth: 1,
          borderColor: TONE[tone].edge,
          borderStyle: src || children ? 'solid' : 'dashed',
          borderRadius: 10,
        }}
      >
        <CornerTicks tone={tone} />

        {children ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {children}
          </div>
        ) : src ? (
          <img src={src} alt={alt ?? ''} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: fit, display: 'block' }} />
        ) : (
          <div style={{ textAlign: 'center', padding: '0 16px' }}>
            <div
              className="font-mono animate-halo"
              style={{
                fontSize: 9,
                letterSpacing: '0.18em',
                color: TONE[tone].fg,
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              Diagrama pendiente
            </div>
            {hint && (
              <div style={{ fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.5, maxWidth: 320, margin: '0 auto' }}>
                {hint}
              </div>
            )}
            {file && (
              <div className="font-mono" style={{ fontSize: 9.5, color: 'var(--moon-faint)', marginTop: 9 }}>
                src/assets/{file}
              </div>
            )}
          </div>
        )}
      </div>

      {caption && (
        <figcaption
          style={{
            fontSize: 10.5,
            color: 'var(--moon-faint)',
            lineHeight: 1.45,
            marginTop: 7,
            borderLeft: `1.5px solid ${TONE[tone].edge}`,
            paddingInlineStart: 8,
          }}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

/** Cuatro ángulos en las esquinas — visor, no marco. */
function CornerTicks({ tone = 'hydro', size = 12 }: { tone?: Tone; size?: number }) {
  const c = TONE[tone].fg
  const base: CSSProperties = { position: 'absolute', width: size, height: size, opacity: 0.45 }
  return (
    <>
      <span style={{ ...base, top: 7, left: 7, borderTop: `1px solid ${c}`, borderLeft: `1px solid ${c}`, borderTopLeftRadius: 4 }} />
      <span style={{ ...base, top: 7, right: 7, borderTop: `1px solid ${c}`, borderRight: `1px solid ${c}`, borderTopRightRadius: 4 }} />
      <span style={{ ...base, bottom: 7, left: 7, borderBottom: `1px solid ${c}`, borderLeft: `1px solid ${c}`, borderBottomLeftRadius: 4 }} />
      <span style={{ ...base, bottom: 7, right: 7, borderBottom: `1px solid ${c}`, borderRight: `1px solid ${c}`, borderBottomRightRadius: 4 }} />
    </>
  )
}

export function Divider({ style }: { style?: CSSProperties }) {
  return <div className="orbit-divider" style={{ margin: '12px 0', ...style }} />
}

export function Badge({ children, tone = 'hydro' }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className="font-mono"
      style={{
        fontSize: 9.5,
        letterSpacing: '0.12em',
        padding: '3px 10px',
        background: TONE[tone].bg,
        color: TONE[tone].fg,
        border: `1px solid ${TONE[tone].edge}`,
        borderRadius: 999,
        textTransform: 'uppercase',
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

/* ── Datos ───────────────────────────────────────────────────── */

export function Stat({
  value,
  unit,
  label,
  tone = 'hydro',
}: {
  value: string
  unit?: string
  label: string
  tone?: Tone
}) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        className="font-display"
        style={{
          fontSize: 42,
          lineHeight: 1,
          color: TONE[tone].fg,
          textShadow: `0 0 30px ${TONE[tone].glow}`,
          marginBottom: 5,
        }}
      >
        {value}
        {unit && (
          <span className="font-mono" style={{ fontSize: 14, marginLeft: 3, opacity: 0.75 }}>
            {unit}
          </span>
        )}
      </div>
      <div style={{ fontSize: 10.5, color: 'var(--moon-faint)', lineHeight: 1.35 }}>{label}</div>
    </div>
  )
}

/**
 * Tabla técnica. Sin bordes de caja: sólo filos horizontales, para
 * que ocho filas no se lean como una reja. `toneOf` colorea celdas
 * puntuales —el valor fuera de límite, la fila crítica—.
 */
export function SpecTable({
  head,
  rows,
  cols,
  toneOf,
  fontSize = 11.5,
  tone = 'hydro',
}: {
  head: string[]
  rows: ReactNode[][]
  cols?: string
  toneOf?: (row: number, col: number) => Tone | undefined
  fontSize?: number
  tone?: Tone
}) {
  const grid = cols ?? `repeat(${head.length}, 1fr)`
  return (
    <div style={{ width: '100%' }}>
      <div
        className="font-mono"
        style={{
          display: 'grid',
          gridTemplateColumns: grid,
          gap: 10,
          padding: '7px 13px',
          background: TONE[tone].bg,
          borderBottom: `1px solid ${TONE[tone].edge}`,
          borderLeft: `1.5px solid ${TONE[tone].fg}`,
          borderRadius: '2px 6px 0 0',
          fontSize: 9.5,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: TONE[tone].fg,
        }}
      >
        {head.map((h, i) => (
          <span key={i}>{h}</span>
        ))}
      </div>

      {rows.map((r, ri) => (
        <div
          key={ri}
          className="stagger-item"
          style={{
            display: 'grid',
            gridTemplateColumns: grid,
            gap: 10,
            padding: '8px 13px',
            borderBottom: '1px solid rgba(245,247,255,0.06)',
            background: ri % 2 === 0 ? 'rgba(245,247,255,0.014)' : 'transparent',
            fontSize,
            lineHeight: 1.35,
            color: 'var(--text-2)',
            alignItems: 'center',
          }}
        >
          {r.map((c, ci) => {
            const t = toneOf?.(ri, ci)
            return (
              <span
                key={ci}
                style={
                  t
                    ? { color: TONE[t].fg, fontWeight: 500 }
                    : ci === 0
                      ? { color: 'var(--moon)', fontWeight: 500 }
                      : undefined
                }
              >
                {c}
              </span>
            )
          })}
        </div>
      ))}
    </div>
  )
}

/** Paso numerado. El número va dentro de una luna, no en un círculo. */
export function Step({
  n,
  title,
  children,
  tone = 'hydro',
}: {
  n: number | string
  title: ReactNode
  children?: ReactNode
  tone?: Tone
}) {
  return (
    <div className="stagger-item" style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
      <div
        className="font-mono"
        style={{
          flexShrink: 0,
          width: 27,
          height: 27,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          color: TONE[tone].fg,
          background: `radial-gradient(circle at 34% 30%, ${TONE[tone].bg}, transparent 72%)`,
          border: `1px solid ${TONE[tone].edge}`,
          borderRadius: '50%',
          boxShadow: `0 0 14px ${TONE[tone].bg}, inset 0 0 10px ${TONE[tone].bg}`,
        }}
      >
        {n}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: 'var(--moon)', fontWeight: 500, lineHeight: 1.3 }}>{title}</div>
        {children && (
          <div style={{ fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.5, marginTop: 3 }}>{children}</div>
        )}
      </div>
    </div>
  )
}

/** Ítem de lista. La viñeta es un cristal, no un punto. */
export function Bullet({
  children,
  tone = 'hydro',
  icon,
}: {
  children: ReactNode
  tone?: Tone
  icon?: ReactNode
}) {
  return (
    <div
      className="stagger-item"
      style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 12.5, lineHeight: 1.55 }}
    >
      {icon ? (
        <span style={{ flexShrink: 0, marginTop: 1 }}>{icon}</span>
      ) : (
        <span
          style={{
            flexShrink: 0,
            marginTop: 6,
            width: 7,
            height: 7,
            border: `1px solid ${TONE[tone].fg}`,
            background: TONE[tone].bg,
            transform: 'rotate(45deg)',
            borderRadius: 1,
            boxShadow: `0 0 8px ${TONE[tone].glow}`,
          }}
        />
      )}
      <span style={{ color: 'var(--text-2)' }}>{children}</span>
    </div>
  )
}

/**
 * Aviso al margen. `alert` para riesgo real (eléctrico, paciente),
 * `ember` para el error frecuente, `verdant` para la buena práctica,
 * `violet` para la lectura conceptual del taller.
 */
export function Callout({
  kind = 'alert',
  title,
  children,
}: {
  kind?: 'alert' | 'ember' | 'verdant' | 'violet' | 'hydro'
  title: ReactNode
  children: ReactNode
}) {
  const mark = { alert: '⚠', ember: '!', verdant: '✓', violet: '☾', hydro: '◇' }[kind]
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        padding: '11px 16px 11px 14px',
        // Se apaga hacia la derecha en vez de cerrarse con un borde:
        // el aviso se lee como una marca al margen, no como otra caja.
        background: `linear-gradient(95deg, ${TONE[kind].bg} 0%, rgba(8,13,36,0) 90%)`,
        borderLeft: `1.5px solid ${TONE[kind].fg}`,
        borderRadius: '2px 10px 10px 2px',
      }}
    >
      <span className="font-mono" style={{ color: TONE[kind].fg, fontSize: 14, lineHeight: 1.2, flexShrink: 0 }}>
        {mark}
      </span>
      <div style={{ minWidth: 0 }}>
        <div
          className="font-mono"
          style={{
            fontSize: 9.5,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: TONE[kind].fg,
            marginBottom: 3,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--text-2)', lineHeight: 1.5 }}>{children}</div>
      </div>
    </div>
  )
}

/** Chip de instrumento, accesorio o insumo. */
export function Chip({ children, tone = 'moon' }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className="stagger-item"
      style={{
        fontSize: 11,
        padding: '5px 12px',
        color: 'var(--text-2)',
        background: 'rgba(245,247,255,0.035)',
        border: `1px solid ${TONE[tone].edge}`,
        borderRadius: 999,
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

/**
 * Ecuación destacada.
 *
 * Va sobre un halo lunar en vez de una caja: la fórmula es el centro
 * de gravedad de la diapositiva, no un recuadro más. `note` explica
 * qué significa cada símbolo, debajo y en pequeño.
 */
export function Formula({
  children,
  note,
  tone = 'cyan',
  size = 30,
  style,
}: {
  children: ReactNode
  note?: ReactNode
  tone?: Tone
  size?: number
  style?: CSSProperties
}) {
  return (
    <div
      className="crystal-in"
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '22px 30px',
        textAlign: 'center',
        ...style,
      }}
    >
      <div
        aria-hidden
        className="animate-halo"
        style={{
          position: 'absolute',
          inset: '-10% 8%',
          borderRadius: '50%',
          background: `radial-gradient(ellipse, ${TONE[tone].bg} 0%, transparent 68%)`,
          filter: 'blur(18px)',
        }}
      />

      <div
        className="font-display"
        style={{
          position: 'relative',
          fontSize: size,
          lineHeight: 1.2,
          color: TONE[tone].fg,
          textShadow: `0 0 34px ${TONE[tone].glow}`,
          letterSpacing: '0.03em',
        }}
      >
        {children}
      </div>

      {note && (
        <div
          style={{
            position: 'relative',
            fontSize: 11.5,
            color: 'var(--text-2)',
            lineHeight: 1.55,
            marginTop: 12,
            maxWidth: 460,
          }}
        >
          {note}
        </div>
      )}
    </div>
  )
}

/** Numeral hueco de sección, con la serif de titulares. */
export function SectionNumeral({ children, tone = 'violet' }: { children: ReactNode; tone?: Tone }) {
  return (
    <div
      className="font-rune"
      style={{
        fontSize: 120,
        lineHeight: 0.85,
        color: 'transparent',
        WebkitTextStroke: `1px ${TONE[tone].edge}`,
        textShadow: `0 0 60px ${TONE[tone].glow}`,
        userSelect: 'none',
      }}
    >
      {children}
    </div>
  )
}

/**
 * Portadilla de bloque. Se repite ocho veces —una por bloque del
 * material— así que vive acá y no copiada en cada diapositiva.
 *
 * Composición del §19 de la guía: el texto a la izquierda, un círculo
 * lunar grande a la derecha con el número del bloque dentro.
 */
export function BlockCover({
  block,
  clase,
  title,
  lead,
  points,
  tone = 'hydro',
}: {
  block: string
  clase: string
  title: ReactNode
  lead: ReactNode
  points: ReactNode[]
  tone?: Tone
}) {
  return (
    <SlideLayout style={{ justifyContent: 'center', padding: '26px 64px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 48, alignItems: 'center' }}>
        <div>
          <SlideTag tone={tone}>{clase}</SlideTag>

          <div
            className="font-mono stagger-item"
            style={{ fontSize: 12, letterSpacing: '0.32em', color: TONE[tone].fg, marginBottom: 12 }}
          >
            <span>{block}</span>
          </div>

          <h2
            className="font-display title-reveal"
            style={{ fontSize: 50, lineHeight: 1.08, color: 'var(--moon)', margin: '0 0 18px', fontWeight: 400 }}
          >
            {title}
          </h2>

          <div
            style={{
              width: 150,
              height: 1.5,
              marginBottom: 20,
              background: `linear-gradient(90deg, ${TONE[tone].fg}, transparent)`,
              boxShadow: `0 0 12px ${TONE[tone].glow}`,
            }}
          />

          <p
            className="stagger-item"
            style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.75, margin: '0 0 22px', maxWidth: 560 }}
          >
            {lead}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {points.map((p, i) => (
              <Bullet key={i} tone={tone}>
                {p}
              </Bullet>
            ))}
          </div>
        </div>

        {/* Luna del bloque. Un disco difuso con el numeral encima: con
            anillos orbitales alrededor se leería como un globo de
            alambre, no como una luna. */}
        <div
          className="crystal-in"
          style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}
        >
          <Moon
            size={290}
            phase="full"
            tone={tone === 'hydro' ? 'hydro' : 'violet'}
            style={{ position: 'absolute', opacity: 0.42 }}
          />
          <span
            className="font-display"
            style={{
              position: 'relative',
              fontSize: 104,
              lineHeight: 1,
              color: 'var(--moon)',
              textShadow: `0 0 46px ${TONE[tone].glow}, 0 0 90px rgba(8,13,36,0.9)`,
              letterSpacing: '0.02em',
            }}
          >
            {block.replace(/[^0-9]/g, '')}
          </span>
        </div>
      </div>
    </SlideLayout>
  )
}
