import type { ReactNode, CSSProperties } from 'react'

/* ═══════════════════════════════════════════════════════════
   EL ESCENARIO

   Estas láminas son escenas, no páginas. Las reglas que rigen:

     · nada está contenido. No hay tarjetas, ni paneles con
       borde, ni rectángulos flotantes. La estructura la dan la
       tipografía, las reglas y el espacio negativo
     · las imágenes salen a sangre y se disuelven en el fondo,
       nunca se recortan dentro de un marco redondeado
     · la composición es asimétrica y alterna de lado entre
       láminas, para que dos vecinas no rimen
     · la profundidad viene por capas: una palabra fantasma
       enorme detrás, la figura en medio, el texto delante
     · un solo elemento por lámina tiene entrada fuerte —el
       título—; el resto llega detrás con 50 ms de separación

   Todo se coloca en absoluto sobre 1280×800. Coordenadas
   explícitas, no `flex` ni `grid`: es lo que permite que un
   elemento se salga del cuadro o se monte sobre otro.
═══════════════════════════════════════════════════════════ */

/* El escenario es 16:9 exacto — la proporción de cualquier proyector. Todas
   las coordenadas de las láminas se escriben contra estas medidas. */
export const W = 1440
export const H = 810

/* Paleta del curso. El cian es el color del quirófano; el oro
   está racionado para lo que el ingeniero tiene que recordar
   aunque olvide el resto, y el rojo solo para lo que mata. */
export const CY   = '#00d4ff'
export const CYM  = '#38bdf8'
export const CYS  = '#7dd3fc'
export const VI   = '#a78bfa'
export const VID  = '#6d28d9'
export const GO   = '#fbbf24'
export const GOD  = '#f59e0b'
export const RE   = '#f87171'
export const RED  = '#ef4444'
export const GRE  = '#4ade80'
export const WH   = '#f0f9ff'
export const WD   = 'rgba(240,249,255,0.72)'
export const WF   = 'rgba(240,249,255,0.40)'
export const WG   = 'rgba(240,249,255,0.26)'

/* Escalón de entrada. Todo lo que no sea el título usa este
   índice: ocho viñetas animadas en secuencia son una lámina que
   todavía no se puede leer. */
export const dly = (i: number): CSSProperties => ({ animationDelay: `${0.08 + i * 0.05}s` })

type Anim = 'rise' | 'drift' | 'drift-r' | 'wipe' | 'bloom' | 'plate' | 'none'

interface AtProps {
  l?: number; r?: number; t?: number; b?: number
  w?: number | string; h?: number | string
  z?: number; d?: number
  anim?: Anim
  className?: string
  style?: CSSProperties
  children: ReactNode
}

/**
 * Coloca un elemento en el escenario y le da su entrada.
 *
 * Los valores negativos son deliberados: un bloque en `l={-40}`
 * queda cortado por el borde, que es justamente lo que hace que
 * la escena continúe fuera del cuadro.
 */
export function At({ l, r, t, b, w, h, z = 2, d = 0, anim = 'rise', className, style, children }: AtProps) {
  return (
    <div
      className={`${anim === 'none' ? '' : anim} ${className ?? ''}`}
      style={{
        position: 'absolute',
        left: l, right: r, top: t, bottom: b,
        width: w, height: h,
        zIndex: z,
        ...(anim === 'none' ? {} : dly(d)),
        ...style,
      }}
    >
      {children}
    </div>
  )
}

/* ── Capas de fondo ────────────────────────────────────────── */

/**
 * Una palabra o numeral gigantesco al fondo del todo. Es lo único
 * en el deck que puede ser enorme y casi invisible a la vez: da
 * la profundidad sin gastar una línea de la lámina.
 */
export function Ghost({
  text, side = 'right', size = 300, top = -40, opacity = 0.035, color = '#f0f9ff', font = 'display',
}: {
  text: string; side?: 'left' | 'right'; size?: number; top?: number
  opacity?: number; color?: string; font?: 'display' | 'mono'
}) {
  return (
    <div
      className="ghost-in select-none"
      style={{
        position: 'absolute',
        [side]: -size * 0.1, top,
        fontFamily: font === 'display' ? "'DM Serif Display', serif" : "'JetBrains Mono', monospace",
        fontSize: size, lineHeight: 0.82, letterSpacing: font === 'mono' ? '-0.04em' : '0.01em',
        color, opacity, zIndex: 0, pointerEvents: 'none', whiteSpace: 'nowrap',
        animationDelay: '0.1s',
        /* la animación lee su opacidad final de aquí; sin esto
           terminaría en 1 y el fantasma dejaría de serlo */
        ['--ghost-o' as string]: String(opacity),
      } as CSSProperties}
    >
      {text}
    </div>
  )
}

/** Masa de luz. Se sale del cuadro a propósito. */
export function Halo({
  x, y, size = 620, color = 'rgba(0,212,255,0.14)', blur = 40, drift = true, z = 0,
}: {
  x: number; y: number; size?: number; color?: string; blur?: number; drift?: boolean; z?: number
}) {
  return (
    <div
      className={drift ? 'drift-loop' : ''}
      style={{
        position: 'absolute',
        left: x - size / 2, top: y - size / 2,
        width: size, height: size, borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 68%)`,
        filter: `blur(${blur}px)`,
        pointerEvents: 'none', zIndex: z,
      }}
    />
  )
}

/**
 * Una hairline que cruza la composición. `angle` en grados, y el
 * ancho puede pasarse de 1280 sin problema: se corta sola contra
 * el borde del escenario.
 */
export function Rule({
  l, t, w = 420, angle = 0, color = 'rgba(0,212,255,0.28)', d = 2, z = 1, thick = 1,
}: {
  l: number; t: number; w?: number; angle?: number; color?: string; d?: number; z?: number; thick?: number
}) {
  return (
    <div
      className="span-x"
      style={{
        position: 'absolute', left: l, top: t, width: w, height: thick,
        background: `linear-gradient(90deg, ${color}, transparent)`,
        transform: `rotate(${angle}deg)`, transformOrigin: 'left center',
        zIndex: z, pointerEvents: 'none', ...dly(d),
      }}
    />
  )
}

/** Regla vertical: la usa el margen para anclar una columna. */
export function VRule({
  l, t, h: height = 260, color = 'rgba(0,212,255,0.3)', d = 2, z = 1,
}: {
  l: number; t: number; h?: number; color?: string; d?: number; z?: number
}) {
  return (
    <div
      className="span-y"
      style={{
        position: 'absolute', left: l, top: t, width: 1, height,
        background: `linear-gradient(180deg, ${color}, transparent)`,
        zIndex: z, pointerEvents: 'none', ...dly(d),
      }}
    />
  )
}

/* ── Tipografía ────────────────────────────────────────────── */

/**
 * Un ojal, no una insignia: versalitas espaciadas sobre un tic de
 * color. Sin píldora, sin borde, sin fondo.
 */
export function Eyebrow({ children, color = CY, d = 0 }: { children: ReactNode; color?: string; d?: number }) {
  return (
    <div className="drift" style={{ display: 'flex', alignItems: 'center', gap: 11, ...dly(d) }}>
      <span style={{ width: 26, height: 2, background: color, boxShadow: `0 0 10px ${color}`, flexShrink: 0 }} />
      <span
        className="font-mono"
        style={{ fontSize: 10.5, color, letterSpacing: '0.26em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}
      >
        {children}
      </span>
    </div>
  )
}

/**
 * El título. Corre grande porque la lámina lleva una idea y el
 * título *es* esa idea: debe ser lo primero y lo más alto de la
 * escena. Se descubre con un barrido —el único gesto fuerte.
 */
export function Title({
  children, size = 64, d = 1, w, color = WH, style,
}: {
  children: ReactNode; size?: number; d?: number; w?: number; color?: string; style?: CSSProperties
}) {
  return (
    <h2
      className="font-display wipe"
      style={{
        fontSize: size, lineHeight: 1.03, letterSpacing: '-0.015em',
        color, margin: 0, fontWeight: 400, maxWidth: w,
        ...dly(d), ...style,
      }}
    >
      {children}
    </h2>
  )
}

/** El fragmento del título que lleva el acento del curso. */
export function Ac({ children, color = CY }: { children: ReactNode; color?: string }) {
  return <span style={{ color, textShadow: `0 0 38px ${color}66` }}>{children}</span>
}

/** Bajada. Ligera, ancha, con aire. */
export function Lead({
  children, d = 3, w = 520, size = 18.5, color = WD, style,
}: {
  children: ReactNode; d?: number; w?: number; size?: number; color?: string; style?: CSSProperties
}) {
  return (
    <p
      className="rise"
      style={{
        fontSize: size, lineHeight: 1.68, fontWeight: 300, color,
        margin: 0, maxWidth: w, ...dly(d), ...style,
      }}
    >
      {children}
    </p>
  )
}

/** Etiqueta mono: la que nombra un dato sin encerrarlo. */
export function Label({ children, color = CYM, d = 2, size = 10 }: { children: ReactNode; color?: string; d?: number; size?: number }) {
  return (
    <p
      className="font-mono drift"
      style={{
        fontSize: size, color, letterSpacing: '0.18em', textTransform: 'uppercase',
        margin: 0, ...dly(d),
      }}
    >
      {children}
    </p>
  )
}

/**
 * Una cifra que manda en la escena. Sin caja: el tamaño y el
 * resplandor ya son toda la jerarquía que necesita.
 */
export function Stat({
  value, unit, color = CY, size = 118, d = 4, style,
}: {
  value: ReactNode; unit?: ReactNode; color?: string; size?: number; d?: number; style?: CSSProperties
}) {
  return (
    <div
      className="font-display bloom"
      style={{
        fontSize: size, lineHeight: 0.9, color,
        textShadow: `0 0 60px ${color}55`, ...dly(d), ...style,
      }}
    >
      {value}
      {unit && (
        <span style={{ fontSize: size * 0.28, marginLeft: 6, opacity: 0.75 }}>{unit}</span>
      )}
    </div>
  )
}

/**
 * Una nota al margen. La barra de acento es una regla, no un
 * marco: solo toca el texto por un lado.
 */
export function Aside({
  children, color = GOD, d = 8, w = 560, size = 14, style,
}: {
  children: ReactNode; color?: string; d?: number; w?: number; size?: number; style?: CSSProperties
}) {
  return (
    <div
      className="rise"
      style={{ paddingLeft: 20, borderLeft: `2px solid ${color}`, maxWidth: w, ...dly(d), ...style }}
    >
      <p style={{ fontSize: size, color: WD, margin: 0, lineHeight: 1.68 }}>{children}</p>
    </div>
  )
}

/**
 * Una lista donde el marcador cuelga en el margen y el texto corre
 * libre. Sin viñetas dentro de círculos, sin chips: la sangría es
 * toda la estructura.
 */
export function Hang({
  items, color = CY, d = 4, marker = 'tick', size = 16, w = 560, gap = 15, lead = 1.6,
}: {
  items: ReactNode[]; color?: string; d?: number
  marker?: 'tick' | 'num' | 'dot' | 'none'
  size?: number; w?: number; gap?: number; lead?: number
}) {
  return (
    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap }}>
      {items.map((item, i) => (
        <li key={i} className="rise" style={{ display: 'flex', alignItems: 'baseline', gap: 14, ...dly(d + i) }}>
          {marker === 'num' && (
            <span
              className="font-mono"
              style={{ flexShrink: 0, minWidth: 26, color, opacity: 0.7, fontSize: size * 0.78, fontWeight: 600 }}
            >
              {String(i + 1).padStart(2, '0')}
            </span>
          )}
          {marker === 'tick' && (
            <span
              style={{
                flexShrink: 0, width: 16, height: 1, background: color, opacity: 0.7,
                transform: `translateY(-${size * 0.3}px)`,
              }}
            />
          )}
          {marker === 'dot' && (
            <span
              style={{
                flexShrink: 0, width: 5, height: 5, borderRadius: '50%', background: color,
                boxShadow: `0 0 8px ${color}`, transform: `translateY(-${size * 0.2}px)`,
              }}
            />
          )}
          <span style={{ fontSize: size, fontWeight: 300, lineHeight: lead, color: WD, maxWidth: w }}>
            {item}
          </span>
        </li>
      ))}
    </ul>
  )
}

/**
 * Una entrada de registro: rótulo mono colgando en el margen y el
 * contenido corriendo a su derecha. Es la forma en que este deck
 * dice "tabla" sin dibujar una.
 */
export function Entry({
  tag, tagColor = CYM, tagW = 130, children, d = 4, style,
}: {
  tag: ReactNode; tagColor?: string; tagW?: number; children: ReactNode; d?: number; style?: CSSProperties
}) {
  return (
    <div className="rise" style={{ display: 'flex', alignItems: 'baseline', gap: 20, ...dly(d), ...style }}>
      <span
        className="font-mono"
        style={{
          flexShrink: 0, width: tagW, textAlign: 'right', color: tagColor,
          fontSize: 11.5, letterSpacing: '0.04em', lineHeight: 1.5,
        }}
      >
        {tag}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </div>
  )
}

/** Hairline horizontal entre entradas de un registro. */
export function Sep({ w = 640, d = 4, color = 'rgba(240,249,255,0.09)' }: { w?: number; d?: number; color?: string }) {
  return (
    <div
      className="span-x"
      style={{ width: w, height: 1, background: `linear-gradient(90deg, ${color}, transparent)`, ...dly(d) }}
    />
  )
}

/**
 * Una foto a sangre: cortada por el borde del escenario y disuelta
 * hacia el interior de la composición. Nunca lleva marco ni radio.
 */
export function Photo({
  src, alt, side = 'right', w: width = 640, h: height = H, t = 0, credit, filter, d = 2, z = 1, fade = 'edge', opacity = 1,
}: {
  src: string; alt: string; side?: 'left' | 'right'
  w?: number; h?: number; t?: number
  credit?: string; filter?: string; d?: number; z?: number
  fade?: 'edge' | 'diagonal'; opacity?: number
}) {
  /* La foto se disuelve por el borde que da *hacia adentro* de la
     composición, no por el que toca el marco: una foto pegada al
     borde derecho se desvanece hacia la izquierda. */
  const cls =
    fade === 'diagonal'
      ? side === 'right' ? 'fade-lb' : 'fade-rb'
      : side === 'right' ? 'fade-l' : 'fade-r'
  return (
    <div
      className="plate"
      style={{
        position: 'absolute', top: t, [side]: 0, width, height,
        zIndex: z, pointerEvents: 'none', ...dly(d),
      } as CSSProperties}
    >
      <div className={cls} style={{ position: 'absolute', inset: 0, opacity }}>
        <img
          src={src}
          alt={alt}
          style={{
            width: '100%', height: '100%', objectFit: 'cover', display: 'block',
            filter: filter ?? 'saturate(0.8) brightness(0.72) contrast(1.08)',
          }}
        />
        {/* La foto se hunde en el suelo del escenario por abajo */}
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(2,7,26,0.55) 0%, transparent 26%, transparent 58%, rgba(2,7,26,0.92) 100%)',
          }}
        />
      </div>
      {credit && (
        /* Por encima del marco: a 18 px del borde el crédito caía justo
           sobre las flechas de navegación y los puntos. */
        <p
          className="font-mono"
          style={{
            position: 'absolute', bottom: 56, [side]: 34, margin: 0,
            fontSize: 9.5, color: WG, letterSpacing: '0.04em', maxWidth: width - 80,
            textAlign: side === 'right' ? 'right' : 'left',
          } as CSSProperties}
        >
          {credit}
        </p>
      )}
    </div>
  )
}

/**
 * Un icono suelto. Sin contenedor circular, sin fondo: solo el
 * dibujo y su halo, flotando en el espacio negativo.
 */
export function Icon({
  src, size = 44, color = CY, d = 3, style, className,
}: {
  src: string; size?: number; color?: string; d?: number; style?: CSSProperties; className?: string
}) {
  return (
    <img
      src={src}
      alt=""
      className={`bloom ${className ?? ''}`}
      style={{
        width: size, height: size, objectFit: 'contain',
        filter: `drop-shadow(0 0 14px ${color}aa) drop-shadow(0 0 3px ${color})`,
        ...dly(d), ...style,
      }}
    />
  )
}

/** Cita a gran escala. La lámina entera es la cita. */
export function Quote({
  children, cite, color = CY, size = 46, d = 4, w = 760,
}: {
  children: ReactNode; cite?: ReactNode; color?: string; size?: number; d?: number; w?: number
}) {
  return (
    <div style={{ maxWidth: w }}>
      <p
        className="font-display wipe"
        style={{
          fontSize: size, lineHeight: 1.22, color, fontStyle: 'italic', margin: 0,
          textShadow: `0 0 60px ${color}44`, ...dly(d),
        }}
      >
        {children}
      </p>
      {cite && (
        <p
          className="font-mono rise"
          style={{ fontSize: 12, color: WF, margin: '22px 0 0', letterSpacing: '0.08em', ...dly(d + 2) }}
        >
          {cite}
        </p>
      )}
    </div>
  )
}
