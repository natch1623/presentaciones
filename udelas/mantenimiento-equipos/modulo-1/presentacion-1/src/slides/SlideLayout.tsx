import type { ReactNode, CSSProperties } from 'react'

/* ═══════════════════════════════════════════════════════════════
   Vocabulario visual del deck.
   Todo lo que se repite entre diapositivas vive acá: si el módulo
   crece, se reutiliza esto en vez de volver a maquetar tarjetas.
   ═══════════════════════════════════════════════════════════════ */

export type Tone = 'frost' | 'rift' | 'crimson' | 'amber' | 'mint' | 'ice'

export const TONE: Record<Tone, { fg: string; edge: string; bg: string; glow: string }> = {
  frost:   { fg: 'var(--frost)',    edge: 'rgba(143,220,255,0.34)', bg: 'rgba(143,220,255,0.08)', glow: 'rgba(143,220,255,0.30)' },
  rift:    { fg: 'var(--rift-soft)', edge: 'rgba(125,99,255,0.40)',  bg: 'rgba(125,99,255,0.10)',  glow: 'rgba(125,99,255,0.34)' },
  crimson: { fg: 'var(--crimson)',  edge: 'rgba(255,77,106,0.38)',  bg: 'rgba(255,77,106,0.09)',  glow: 'rgba(255,77,106,0.30)' },
  amber:   { fg: 'var(--amber)',    edge: 'rgba(255,180,77,0.34)',  bg: 'rgba(255,180,77,0.08)',  glow: 'rgba(255,180,77,0.26)' },
  mint:    { fg: 'var(--mint)',     edge: 'rgba(79,227,193,0.34)',  bg: 'rgba(79,227,193,0.08)',  glow: 'rgba(79,227,193,0.26)' },
  ice:     { fg: 'var(--ice)',      edge: 'rgba(234,246,255,0.20)', bg: 'rgba(234,246,255,0.05)', glow: 'rgba(234,246,255,0.18)' },
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
        padding: '26px 46px',
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

export function SlideTag({ children, tone = 'frost' }: { children: ReactNode; tone?: Tone }) {
  return (
    <div
      className="font-mono tag-reveal"
      style={{
        fontSize: 10,
        letterSpacing: '0.18em',
        color: TONE[tone].fg,
        textTransform: 'uppercase',
        marginBottom: 9,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <span
        style={{
          width: 26,
          height: 1.5,
          background: `linear-gradient(90deg, ${TONE[tone].fg}, transparent)`,
          boxShadow: `0 0 7px ${TONE[tone].glow}`,
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
  const sizes = { xl: 54, lg: 42, md: 32, sm: 25 }
  return (
    <h2
      className="font-display title-reveal"
      style={{
        fontSize: sizes[size],
        lineHeight: 1.12,
        color: 'var(--ice)',
        margin: 0,
        marginBottom: 16,
        fontWeight: 400,
        letterSpacing: '0.01em',
        ...style,
      }}
    >
      {children}
    </h2>
  )
}

export function Frost({ children }: { children: ReactNode }) {
  return <span style={{ color: 'var(--frost)', textShadow: '0 0 24px rgba(143,220,255,0.45)' }}>{children}</span>
}

export function Rift({ children }: { children: ReactNode }) {
  return <span style={{ color: 'var(--rift-soft)', textShadow: '0 0 24px rgba(125,99,255,0.5)' }}>{children}</span>
}

export function Crimson({ children }: { children: ReactNode }) {
  return <span style={{ color: 'var(--crimson)', textShadow: '0 0 22px rgba(255,77,106,0.4)' }}>{children}</span>
}

/* ── Superficies ─────────────────────────────────────────────── */

/**
 * Esquinas achaflanadas. Alternar el corte entre tarjetas vecinas es
 * lo que evita que una rejilla de seis se lea como seis cuadrados:
 * cada pieza parece un fragmento distinto de la misma lámina rota.
 */
export type Cut = 'tl-br' | 'tr-bl' | 'tl' | 'tr' | 'bl' | 'br' | 'none'

export function cutPath(cut: Cut, r = 14): string | undefined {
  const p = `${r}px`
  const q = `calc(100% - ${r}px)`
  switch (cut) {
    case 'tl-br': return `polygon(${p} 0, 100% 0, 100% ${q}, ${q} 100%, 0 100%, 0 ${p})`
    case 'tr-bl': return `polygon(0 0, ${q} 0, 100% ${p}, 100% 100%, ${p} 100%, 0 ${q})`
    case 'tl':    return `polygon(${p} 0, 100% 0, 100% 100%, 0 100%, 0 ${p})`
    case 'tr':    return `polygon(0 0, ${q} 0, 100% ${p}, 100% 100%, 0 100%)`
    case 'bl':    return `polygon(0 0, 100% 0, 100% 100%, ${p} 100%, 0 ${q})`
    case 'br':    return `polygon(0 0, 100% 0, 100% ${q}, ${q} 100%, 0 100%)`
    default:      return undefined
  }
}

export function Card({
  children,
  tone = 'frost',
  style,
  hover = true,
  cut = 'tl-br',
  radius = 14,
  /** Sin marco completo: sólo el filo lateral. Alivia mucho la rejilla. */
  open = false,
}: {
  children: ReactNode
  tone?: Tone
  style?: CSSProperties
  hover?: boolean
  cut?: Cut
  radius?: number
  open?: boolean
}) {
  // `border` y `borderLeft` en el mismo objeto se pisan entre renders y
  // React lo advierte, así que cada variante arma su propio bloque.
  const frame: CSSProperties = open
    ? {
        background: 'linear-gradient(100deg, rgba(19,26,64,0.55) 0%, rgba(7,10,26,0.10) 85%)',
        borderLeft: `2px solid ${TONE[tone].fg}`,
      }
    : {
        background: 'linear-gradient(148deg, rgba(19,26,64,0.82) 0%, rgba(7,10,26,0.92) 100%)',
        border: `1px solid ${TONE[tone].edge}`,
        clipPath: cutPath(cut, radius),
        boxShadow: `inset 0 0 26px rgba(0,0,0,0.28), 0 0 26px ${TONE[tone].bg}`,
      }

  return (
    <div
      className={hover && !open ? 'shard-card' : undefined}
      style={{
        position: 'relative',
        padding: '15px 18px',
        transition: 'transform 0.32s cubic-bezier(0.16,1,0.3,1), border-color 0.32s ease',
        ...frame,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/**
 * Bloque sin caja: sólo una regla superior y una etiqueta. Para
 * agrupar contenido sin sumar otro rectángulo a la diapositiva.
 */
export function Panel({
  label,
  tone = 'frost',
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
              letterSpacing: '0.14em',
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
 * Marco para imagen o diagrama.
 *
 * Reserva el hueco aunque todavía no exista el archivo: mientras `src`
 * esté vacío muestra la ficha de lo que va ahí, con la ruta sugerida,
 * de modo que la diapositiva ya está compuesta y sólo falta soltar el
 * archivo en `src/assets/`.
 */
export function Figure({
  src,
  alt,
  caption,
  hint,
  file,
  tone = 'frost',
  height,
  fit = 'contain',
  children,
  style,
}: {
  src?: string
  alt?: string
  caption?: ReactNode
  /** Qué debería mostrar la imagen, para quien la vaya a conseguir. */
  hint?: ReactNode
  /** Nombre de archivo sugerido dentro de `src/assets/`. */
  file?: string
  tone?: Tone
  height?: number | string
  fit?: 'contain' | 'cover'
  /** Diagrama SVG dibujado en código, en lugar de un archivo. */
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
          padding: children || src ? 8 : 14,
          background:
            'linear-gradient(150deg, rgba(19,26,64,0.42) 0%, rgba(4,5,14,0.62) 100%)',
          borderWidth: 1,
          borderColor: TONE[tone].edge,
          // El marco punteado señala el hueco todavía sin imagen.
          borderStyle: src || children ? 'solid' : 'dashed',
          clipPath: cutPath('tl-br', 16),
        }}
      >
        {/* Marcas de esquina: dan el aire de visor sin cerrar una caja */}
        <CornerTicks tone={tone} />

        {children ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {children}
          </div>
        ) : src ? (
          <img
            src={src}
            alt={alt ?? ''}
            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: fit, display: 'block' }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '0 16px' }}>
            <div
              className="font-mono animate-void-pulse"
              style={{
                fontSize: 9,
                letterSpacing: '0.18em',
                color: TONE[tone].fg,
                textTransform: 'uppercase',
                marginBottom: 8,
              }}
            >
              Imagen pendiente
            </div>
            {hint && (
              <div style={{ fontSize: 11.5, color: 'var(--ice-dim)', lineHeight: 1.5, maxWidth: 320, margin: '0 auto' }}>
                {hint}
              </div>
            )}
            {file && (
              <div
                className="font-mono"
                style={{ fontSize: 9.5, color: 'var(--ice-faint)', marginTop: 9, letterSpacing: '0.04em' }}
              >
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
            color: 'var(--ice-faint)',
            lineHeight: 1.45,
            marginTop: 7,
            paddingLeft: 2,
            borderLeft: `2px solid ${TONE[tone].edge}`,
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
function CornerTicks({ tone = 'frost', size = 13 }: { tone?: Tone; size?: number }) {
  const c = TONE[tone].fg
  const base: CSSProperties = { position: 'absolute', width: size, height: size, opacity: 0.55 }
  return (
    <>
      <span style={{ ...base, top: 6, left: 6, borderTop: `1px solid ${c}`, borderLeft: `1px solid ${c}` }} />
      <span style={{ ...base, top: 6, right: 6, borderTop: `1px solid ${c}`, borderRight: `1px solid ${c}` }} />
      <span style={{ ...base, bottom: 6, left: 6, borderBottom: `1px solid ${c}`, borderLeft: `1px solid ${c}` }} />
      <span style={{ ...base, bottom: 6, right: 6, borderBottom: `1px solid ${c}`, borderRight: `1px solid ${c}` }} />
    </>
  )
}

export function Divider({ style }: { style?: CSSProperties }) {
  return <div className="rift-divider" style={{ margin: '12px 0', ...style }} />
}

export function Badge({ children, tone = 'frost' }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className="font-mono"
      style={{
        fontSize: 9.5,
        letterSpacing: '0.12em',
        padding: '3px 9px',
        background: TONE[tone].bg,
        color: TONE[tone].fg,
        border: `1px solid ${TONE[tone].edge}`,
        clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)',
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
  tone = 'frost',
}: {
  value: string
  unit?: string
  label: string
  tone?: Tone
}) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div
        className="font-rune"
        style={{
          fontSize: 40,
          lineHeight: 1,
          color: TONE[tone].fg,
          textShadow: `0 0 28px ${TONE[tone].glow}`,
          marginBottom: 5,
        }}
      >
        {value}
        {unit && (
          <span className="font-mono" style={{ fontSize: 15, marginLeft: 3, opacity: 0.8 }}>
            {unit}
          </span>
        )}
      </div>
      <div style={{ fontSize: 10.5, color: 'var(--ice-faint)', lineHeight: 1.35 }}>{label}</div>
    </div>
  )
}

/**
 * Tabla técnica. `cols` define el ancho relativo de cada columna y
 * `tones` colorea celdas puntuales (por ejemplo, la tolerancia fuera
 * de rango). Sin bordes de caja: sólo filos horizontales, para que
 * una tabla de 8 filas no se lea como una reja.
 */
export function SpecTable({
  head,
  rows,
  cols,
  toneOf,
  fontSize = 11.5,
}: {
  head: string[]
  rows: ReactNode[][]
  cols?: string
  toneOf?: (row: number, col: number) => Tone | undefined
  fontSize?: number
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
          padding: '7px 12px',
          background: 'rgba(143,220,255,0.06)',
          borderTop: '1px solid rgba(143,220,255,0.16)',
          borderRight: '1px solid rgba(143,220,255,0.16)',
          borderBottom: '1px solid rgba(143,220,255,0.16)',
          borderLeft: '2px solid var(--frost)',
          fontSize: 9.5,
          letterSpacing: '0.11em',
          textTransform: 'uppercase',
          color: 'var(--frost)',
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
            padding: '8px 12px',
            borderBottom: '1px solid rgba(234,246,255,0.07)',
            background: ri % 2 === 0 ? 'rgba(234,246,255,0.014)' : 'transparent',
            fontSize,
            lineHeight: 1.35,
            color: 'var(--ice-dim)',
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
                      ? { color: 'var(--ice)', fontWeight: 500 }
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

/** Paso numerado de un procedimiento. El número va en una esquirla. */
export function Step({
  n,
  title,
  children,
  tone = 'frost',
}: {
  n: number | string
  title: ReactNode
  children?: ReactNode
  tone?: Tone
}) {
  return (
    <div className="stagger-item" style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <div
        className="font-mono"
        style={{
          flexShrink: 0,
          width: 26,
          height: 26,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 500,
          color: TONE[tone].fg,
          background: TONE[tone].bg,
          border: `1px solid ${TONE[tone].edge}`,
          clipPath: 'polygon(50% 0, 100% 28%, 100% 72%, 50% 100%, 0 72%, 0 28%)',
          boxShadow: `0 0 12px ${TONE[tone].bg}`,
        }}
      >
        {n}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: 'var(--ice)', fontWeight: 500, lineHeight: 1.3 }}>{title}</div>
        {children && (
          <div style={{ fontSize: 11.5, color: 'var(--ice-faint)', lineHeight: 1.45, marginTop: 3 }}>
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

/** Ítem de lista con filo lateral. */
export function Bullet({
  children,
  tone = 'frost',
  icon,
}: {
  children: ReactNode
  tone?: Tone
  icon?: ReactNode
}) {
  return (
    <div
      className="stagger-item"
      style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 12, lineHeight: 1.5 }}
    >
      <span
        style={{
          flexShrink: 0,
          marginTop: 5,
          width: 7,
          height: 7,
          background: TONE[tone].fg,
          clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
          boxShadow: `0 0 8px ${TONE[tone].glow}`,
          display: icon ? 'none' : 'block',
        }}
      />
      {icon && <span style={{ flexShrink: 0, marginTop: 1 }}>{icon}</span>}
      <span style={{ color: 'var(--ice-dim)' }}>{children}</span>
    </div>
  )
}

/**
 * Aviso destacado. `crimson` para riesgo real (eléctrico, biológico,
 * presión), `amber` para error frecuente, `mint` para buena práctica.
 */
export function Callout({
  kind = 'crimson',
  title,
  children,
}: {
  kind?: 'crimson' | 'amber' | 'mint' | 'rift'
  title: ReactNode
  children: ReactNode
}) {
  const label = { crimson: '⚠', amber: '!', mint: '✓', rift: '◆' }[kind]
  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        padding: '11px 15px 11px 13px',
        // Se apaga hacia la derecha en vez de cerrarse con un borde: el
        // aviso se lee como una marca al margen, no como otra caja.
        background: `linear-gradient(95deg, ${TONE[kind].bg} 0%, rgba(4,5,14,0) 88%)`,
        borderLeft: `2px solid ${TONE[kind].fg}`,
        clipPath: cutPath('br', 12),
      }}
    >
      <span
        className="font-mono"
        style={{ color: TONE[kind].fg, fontSize: 15, lineHeight: 1.1, flexShrink: 0 }}
      >
        {label}
      </span>
      <div style={{ minWidth: 0 }}>
        <div
          className="font-mono"
          style={{
            fontSize: 9.5,
            letterSpacing: '0.13em',
            textTransform: 'uppercase',
            color: TONE[kind].fg,
            marginBottom: 3,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--ice-dim)', lineHeight: 1.45 }}>{children}</div>
      </div>
    </div>
  )
}

/** Etiqueta de frecuencia de rutina: D · S · M · T · A */
export function Freq({ children, tone = 'rift' }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className="font-mono"
      style={{
        fontSize: 9,
        letterSpacing: '0.1em',
        padding: '2px 7px',
        color: TONE[tone].fg,
        background: TONE[tone].bg,
        border: `1px solid ${TONE[tone].edge}`,
        borderRadius: 2,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

/** Chip de herramienta o insumo. */
export function Tool({ children, tone = 'ice' }: { children: ReactNode; tone?: Tone }) {
  return (
    <span
      className="stagger-item"
      style={{
        fontSize: 11,
        padding: '5px 11px',
        color: 'var(--ice-dim)',
        background: 'rgba(234,246,255,0.04)',
        border: `1px solid ${TONE[tone].edge}`,
        clipPath: 'polygon(6px 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%, 0 6px)',
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

/** Numeral grande de sección, con la tipografía rúnica. */
export function SectionNumeral({ children, tone = 'rift' }: { children: ReactNode; tone?: Tone }) {
  return (
    <div
      className="font-rune"
      style={{
        fontSize: 128,
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
