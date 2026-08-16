import {
  Fragment, useState, useEffect, useCallback, useRef, useContext, createContext,
  type ReactNode, type CSSProperties,
} from 'react'
import {
  Ambient, Backdrop, Ornament, THEMES, STAGE_W, STAGE_H, prefersReducedMotion,
  type DeckTheme,
} from './theme'

export { THEMES, STAGE_W, STAGE_H, prefersReducedMotion, type DeckTheme }

/* Which room the deck is standing in. Every layout below reads it from
   context rather than having it threaded through as a prop, because a
   theme is ambient by definition — it is not any one slide's business. */
const ThemeCtx = createContext<DeckTheme>(THEMES.coulomb)
export const useTheme = () => useContext(ThemeCtx)

/* ═══════════════════════════════════════════════════════════
   DESIGN TOKENS

   The deck's thesis: electrostatics is charge *frozen* in place.
   Nothing moves, so everything can be solved with geometry and
   symmetry. The palette is a winter throne hall — and the single
   warm value in it is reserved, never decorative.
═══════════════════════════════════════════════════════════ */
export const ABISMO   = '#070B18'   /* background floor */
export const ACERO    = '#14203A'   /* panel surfaces */
export const ESCARCHA = '#7FC8E8'   /* glacial cyan — primary accent */
export const HIELO    = '#DCEEF8'   /* type */
export const ORO      = '#C9A24A'   /* heraldic gold — laws and theorems only */
export const BRASA    = '#E4572E'   /* the one warm value */
export const AURORA   = '#6EE7C7'
export const VIOLETA  = '#A88BE0'

/* Charge sign is a colour, and it is the SAME colour everywhere in
   the deck: warm is positive, cold is negative. This is why BRASA is
   rationed — if it showed up as decoration, the sign code would stop
   meaning anything. */
export const POS = BRASA
export const NEG = ESCARCHA

/* STAGE_W, STAGE_H and prefersReducedMotion live in theme.tsx, which
   needs them and must not import from here. They are re-exported above
   so nothing else has to care where they came from. */

/* Pixels per unit in the interactive diagrams — the live
   readouts divide by this so the numbers mean something. */
export const U = 20

/* ═══════════════════════════════════════════════════════════
   MATH TYPOGRAPHY

   Mini-syntax used by every formula string in this deck:
     _x   _{xy}       → subscript
     ^2   ^{-1}       → superscript
     *A*              → bold (vector quantity, per Hayt's convention)
     @{num}{den}      → stacked fraction, the way LaTeX sets one

   The fraction groups are read with brace matching, so they can nest
   and can contain any of the other markers: @{∂^2V}{∂x^2} works.
═══════════════════════════════════════════════════════════ */
export type FxAtom = { kind: 'atom'; text: string; sub?: boolean; sup?: boolean; bold?: boolean }
export type FxFrac = { kind: 'frac'; num: FxPiece[]; den: FxPiece[] }
export type FxPiece = FxAtom | FxFrac

/* Reads a balanced {...} starting at src[i] === '{'. Returns the inner
   text and the index just past the closing brace. */
function readGroup(src: string, i: number): [string, number] {
  let depth = 0
  let out = ''
  for (; i < src.length; i++) {
    const c = src[i]
    if (c === '{') {
      depth++
      if (depth === 1) continue
    } else if (c === '}') {
      depth--
      if (depth === 0) return [out, i + 1]
    }
    out += c
  }
  return [out, i]
}

function parseFx(src: string, boldInit = false): FxPiece[] {
  const out: FxPiece[] = []
  let bold = boldInit
  let buf = ''
  let i = 0
  const flush = () => {
    if (buf) out.push({ kind: 'atom', text: buf, bold })
    buf = ''
  }
  while (i < src.length) {
    const c = src[i]
    if (c === '*') {
      flush()
      bold = !bold
      i++
      continue
    }
    if (c === '@' && src[i + 1] === '{') {
      flush()
      const [numRaw, afterNum] = readGroup(src, i + 1)
      let den = ''
      let next = afterNum
      if (src[next] === '{') {
        const [denRaw, afterDen] = readGroup(src, next)
        den = denRaw
        next = afterDen
      }
      out.push({ kind: 'frac', num: parseFx(numRaw, bold), den: parseFx(den, bold) })
      i = next
      continue
    }
    if (c === '_' || c === '^') {
      const isSub = c === '_'
      i++
      let group = ''
      if (src[i] === '{') {
        const [g, after] = readGroup(src, i)
        group = g
        i = after
      } else if (i < src.length) {
        group = src[i]
        i++
      }
      flush()
      out.push({ kind: 'atom', text: group, bold, sub: isSub, sup: !isSub })
      continue
    }
    buf += c
    i++
  }
  flush()
  return out
}

/* HTML renderer */
function fxNodes(pieces: FxPiece[]): ReactNode[] {
  return pieces.map((p, i) => {
    if (p.kind === 'frac') {
      return (
        <span key={i} className="fx-frac">
          <span className="fx-num">{fxNodes(p.num)}</span>
          <span className="fx-den">{fxNodes(p.den)}</span>
        </span>
      )
    }
    const w = p.bold ? { fontWeight: 700 } : undefined
    if (p.sub) return <sub key={i} style={w}>{p.text}</sub>
    if (p.sup) return <sup key={i} style={w}>{p.text}</sup>
    return <span key={i} style={w}>{p.text}</span>
  })
}

export function Fx({ s, style, className }: { s: string; style?: CSSProperties; className?: string }) {
  return (
    <span className={`fx ${className ?? ''}`} style={style}>
      {fxNodes(parseFx(s))}
    </span>
  )
}

/* SVG renderer — <sub>/<sup> do not exist inside <text>, so the
   baseline is walked manually. dy is expressed in the tspan's own
   em, hence the division by the tspan's font scale.

   A single <text> cannot stack a fraction, so one met here degrades to
   inline num/den. Anything that should really show a stacked fraction
   inside the SVG goes through <FxHtml> instead. */
export function fxTspans(src: string): ReactNode[] {
  let baseline = 0
  const flat: FxAtom[] = []
  const walk = (pieces: FxPiece[]) => {
    for (const p of pieces) {
      if (p.kind === 'frac') {
        walk(p.num)
        flat.push({ kind: 'atom', text: '/' })
        walk(p.den)
      } else {
        flat.push(p)
      }
    }
  }
  walk(parseFx(src))

  return flat.map((p, i) => {
    const target = p.sub ? 0.3 : p.sup ? -0.45 : 0
    const scale = p.sub || p.sup ? 0.68 : 1
    const dy = (target - baseline) / scale
    baseline = target
    return (
      <tspan key={i} dy={`${dy.toFixed(3)}em`}
        fontSize={scale === 1 ? undefined : `${scale}em`}
        fontWeight={p.bold ? 700 : undefined}>
        {p.text}
      </tspan>
    )
  })
}

/* Real stacked fractions inside an SVG, by handing the run back to the
   HTML renderer through a <foreignObject>. Sizes are in user units, so
   it scales with the board like everything else. */
export function FxHtml({ x, y, w, h, text, color, size, family = 'JetBrains Mono,monospace', weight, justify = 'center' }: {
  x: number; y: number; w: number; h: number; text: string; color: string
  size: number; family?: string; weight?: number; justify?: 'center' | 'flex-start'
}) {
  return (
    <foreignObject x={x - w / 2} y={y - h / 2} width={w} height={h} style={{ pointerEvents: 'none' }}>
      <div style={{
        width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: justify,
        color, fontSize: size, fontFamily: family, fontWeight: weight,
        lineHeight: 1.1, whiteSpace: 'nowrap',
      }}>
        <Fx s={text}/>
      </div>
    </foreignObject>
  )
}

/* Stagger helper — replaces the old `d${i}` class names, which
   silently left an element at opacity 0 once i went past d10. */
export const dly = (i: number): CSSProperties => ({ animationDelay: `${0.05 + i * 0.045}s` })

/* ═══════════════════════════════════════════════════════════
   CONTINUOUS MOTION
═══════════════════════════════════════════════════════════ */

/* Elapsed seconds, driven by rAF. Only the diagram that calls it
   re-renders, so the cost stays inside one SVG. */
export function useTick(): number {
  const [t, setT] = useState(0)
  useEffect(() => {
    if (prefersReducedMotion()) return
    let raf = 0
    const start = performance.now()
    const loop = (now: number) => {
      /* rAF reports the frame's start time, which can predate the
         performance.now() captured when this effect ran. Without the
         clamp t goes slightly negative on the first frame, and every
         `(t * k) % 1` phase built on it turns negative with it — which
         is enough to index an array at -1. */
      setT(Math.max(0, (now - start) / 1000))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [])
  return t
}

/* A dot that walks a polyline on a loop — used to trace vector
   routes inside the diagrams. */
export function travel(points: { x: number; y: number }[], u: number) {
  const segs = points.slice(1).map((p, i) => Math.hypot(p.x - points[i].x, p.y - points[i].y))
  const total = segs.reduce((a, b) => a + b, 0)
  if (total === 0) return points[0]
  let d = (u % 1) * total
  for (let i = 0; i < segs.length; i++) {
    if (d <= segs[i]) {
      const f = segs[i] === 0 ? 0 : d / segs[i]
      return {
        x: points[i].x + (points[i + 1].x - points[i].x) * f,
        y: points[i].y + (points[i + 1].y - points[i].y) * f,
      }
    }
    d -= segs[i]
  }
  return points[points.length - 1]
}

export function Traveler({ x, y, color, r = 4 }: { x: number; y: number; color: string; r?: number }) {
  return (
    <g style={{ pointerEvents: 'none' }}>
      <circle cx={x} cy={y} r={r * 2.6} fill={color} opacity=".13"/>
      <circle cx={x} cy={y} r={r} fill={color} opacity=".95"/>
    </g>
  )
}

/* ═══════════════════════════════════════════════════════════
   SHARED SVG DEFS
═══════════════════════════════════════════════════════════ */
export function SharedDefs() {
  return (
    <defs>
      <pattern id="grid20" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(160,200,232,.07)" strokeWidth=".5"/>
      </pattern>
      {/* Glow filters deliberately use userSpaceOnUse over the whole
          board. With the default objectBoundingBox units, a perfectly
          vertical or horizontal line has a zero-extent bbox, the filter
          region collapses to nothing, and the element renders as
          *blank* — which would silently eat every axis-aligned field
          arrow in this deck. A fixed region cannot degenerate. */}
      {([['gB', ESCARCHA], ['gR', BRASA], ['gG', ORO], ['gGr', AURORA], ['gV', VIOLETA]] as const).map(([id, c]) => (
        <filter key={id} id={id} filterUnits="userSpaceOnUse" x="-60" y="-60" width="420" height="420">
          <feGaussianBlur stdDeviation="4" result="b"/>
          <feFlood floodColor={c} floodOpacity=".7" result="c"/>
          <feComposite in="c" in2="b" operator="in" result="g"/>
          <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      ))}
      {/* markerUnits="userSpaceOnUse" keeps every arrowhead the same
          physical size. On the default (strokeWidth) units a 3-wide
          stroke produced a 24×18 head, which swallowed short arrows
          whole. */}
      {([['aB', ESCARCHA], ['aR', BRASA], ['aG', ORO], ['aGr', AURORA], ['aV', VIOLETA],
         ['aW', 'rgba(220,238,248,.5)']] as const).map(([id, c]) => (
        <marker key={id} id={id} markerUnits="userSpaceOnUse"
          markerWidth="10" markerHeight="7.5" refX="9" refY="3.75" orient="auto">
          <polygon points="0 0,10 3.75,0 7.5" fill={c}/>
        </marker>
      ))}
      {/* smaller heads, for the short field arrows that fill a plane */}
      <marker id="aBs" markerUnits="userSpaceOnUse"
        markerWidth="5.5" markerHeight="4.2" refX="5" refY="2.1" orient="auto">
        <polygon points="0 0,5.5 2.1,0 4.2" fill={ESCARCHA}/>
      </marker>
      <marker id="aRs" markerUnits="userSpaceOnUse"
        markerWidth="5.5" markerHeight="4.2" refX="5" refY="2.1" orient="auto">
        <polygon points="0 0,5.5 2.1,0 4.2" fill={BRASA}/>
      </marker>
      <marker id="aGs" markerUnits="userSpaceOnUse"
        markerWidth="5.5" markerHeight="4.2" refX="5" refY="2.1" orient="auto">
        <polygon points="0 0,5.5 2.1,0 4.2" fill={ORO}/>
      </marker>
    </defs>
  )
}

export function Dot({ cx, cy, color = HIELO }: { cx: number; cy: number; color?: string }) {
  return <circle className="pop d0" cx={cx} cy={cy} r="4.5" fill={color} opacity=".9"/>
}

/* A charge, drawn the same way every time it appears in this deck:
   warm disc with a +, cold disc with a −. */
export function Charge({ x, y, sign, r = 11, label, delay = 'd1' }:
  { x: number; y: number; sign: 1 | -1; r?: number; label?: string; delay?: string }) {
  const c = sign > 0 ? POS : NEG
  return (
    <g className={`pop ${delay}`}>
      <circle cx={x} cy={y} r={r * 2.1} fill={c} opacity=".12"/>
      <circle cx={x} cy={y} r={r} fill={`${c}33`} stroke={c} strokeWidth="1.8"/>
      <line x1={x - r * 0.46} y1={y} x2={x + r * 0.46} y2={y} stroke={c} strokeWidth="2.1" strokeLinecap="round"/>
      {sign > 0 && (
        <line x1={x} y1={y - r * 0.46} x2={x} y2={y + r * 0.46} stroke={c} strokeWidth="2.1" strokeLinecap="round"/>
      )}
      {label && (
        <text x={x} y={y - r - 7} fill={c} fontSize="11.5" fontWeight="700"
          fontFamily="'Sora',system-ui,sans-serif" textAnchor="middle">
          {fxTspans(label)}
        </text>
      )}
    </g>
  )
}

/* Display label — accepts the Fx mini-syntax */
export function VLabel({ x, y, text, color, delay = 'd2', anchor = 'middle', size = 15 }:
  { x: number; y: number; text: string; color: string; delay?: string; anchor?: string; size?: number }) {
  return (
    <text className={`rise ${delay}`} x={x} y={y} fill={color} fontSize={size} fontWeight="700"
      fontFamily="'Sora',system-ui,sans-serif" textAnchor={anchor as 'middle' | 'start' | 'end'}>
      {fxTspans(text)}
    </text>
  )
}

/* Mono label — accepts the Fx mini-syntax */
export function MLabel({ x, y, text, color = 'rgba(220,238,248,.5)', delay = 'd5', anchor = 'middle', size = 11.5 }:
  { x: number; y: number; text: string; color?: string; delay?: string; anchor?: string; size?: number }) {
  return (
    <text className={`rise ${delay}`} x={x} y={y} fill={color} fontSize={size}
      fontFamily="JetBrains Mono,monospace" textAnchor={anchor as 'middle' | 'start' | 'end'}>
      {fxTspans(text)}
    </text>
  )
}

/* Static (non-animated) mono label, for live readouts */
export function RLabel({ x, y, text, color, size = 10.5, anchor = 'start' }:
  { x: number; y: number; text: string; color: string; size?: number; anchor?: string }) {
  return (
    <text x={x} y={y} fill={color} fontSize={size} fontFamily="JetBrains Mono,monospace"
      textAnchor={anchor as 'middle' | 'start' | 'end'}>
      {fxTspans(text)}
    </text>
  )
}

export function Vec({ x1, y1, x2, y2, color, marker, delay = 'd1', width = 2.5, glow = true }:
  { x1: number; y1: number; x2: number; y2: number; color: string; marker: string; delay?: string; width?: number; glow?: boolean }) {
  const len = Math.hypot(x2 - x1, y2 - y1)
  return (
    <line className={`svg-draw ${delay}`} filter={glow ? `url(#g${marker.slice(1)})` : ''}
      x1={x1} y1={y1} x2={x2} y2={y2}
      stroke={color} strokeWidth={width} markerEnd={`url(#${marker})`}
      style={{ strokeDasharray: len + 20, strokeDashoffset: len + 20 } as CSSProperties}/>
  )
}

/* Shared drag behaviour. `start(id)` returns the pointer-down handler,
   so a diagram can carry more than one handle and tell them apart. */
export function useDrag(onMove: (x: number, y: number, id: string) => void) {
  const svgRef = useRef<SVGSVGElement>(null)
  const active = useRef<string | null>(null)
  const handleMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!active.current || !svgRef.current) return
    const pt = svgRef.current.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const s = pt.matrixTransform(svgRef.current.getScreenCTM()!.inverse())
    onMove(s.x, s.y, active.current)
  }
  const start = (id = 'b') => (e: React.PointerEvent<SVGElement>) => {
    e.preventDefault()
    e.stopPropagation()
    active.current = id
    svgRef.current?.setPointerCapture(e.pointerId)
  }
  const stop = () => { active.current = null }
  return { svgRef, handleMove, start, stop }
}

export function DragHandle({ x, y, onDown, color = ESCARCHA }:
  { x: number; y: number; onDown: (e: React.PointerEvent<SVGElement>) => void; color?: string }) {
  return (
    <g>
      <circle cx={x} cy={y} r="17" fill={color} fillOpacity=".1"
        stroke={color} strokeWidth="1.5" className="drag-pulse"
        style={{ cursor: 'grab' } as CSSProperties}
        onPointerDown={onDown}/>
      <circle cx={x} cy={y} r="5" fill={color} style={{ pointerEvents: 'none' } as CSSProperties}/>
    </g>
  )
}

/* ═══════════════════════════════════════════════════════════
   THE DIAGRAM BOARD

   Every diagram is authored on the same 300×300 board with three
   reserved bands, so nothing can wander into a readout:

     header   y   8 …  50    formula chip
     stage    y  54 … 226    the drawing itself
     footer   y 234 … 292    live readout

   Anything drawn in the stage band must stay inside x 14 … 286 too,
   which is why the field radii below look like oddly specific numbers.
═══════════════════════════════════════════════════════════ */
export const MID = 140          /* vertical centre of the stage band */

export function Board({
  chip, chipSub, chipColor = ORO,
  foot, footTop = 234, footH = 58,
  children, svgRef, onPointerMove, onPointerUp, onPointerLeave, grab,
}: {
  chip?: string
  chipSub?: string
  chipColor?: string
  foot?: ReactNode
  footTop?: number
  footH?: number
  children: ReactNode
  svgRef?: React.RefObject<SVGSVGElement | null>
  onPointerMove?: (e: React.PointerEvent<SVGSVGElement>) => void
  onPointerUp?: () => void
  onPointerLeave?: () => void
  grab?: boolean
}) {
  return (
    <svg ref={svgRef} viewBox="0 0 300 300" className="w-full h-full"
      style={grab ? { userSelect: 'none' } as CSSProperties : undefined}
      onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onPointerLeave}>
      <SharedDefs/>
      <rect width="100%" height="100%" fill="url(#grid20)"/>

      {chip && (() => {
        /* Both lines live in ONE foreignObject laid out as a column.
           Two stacked boxes clipped the numerator of any fraction —
           a foreignObject crops to its bounds, and a stacked fraction
           is roughly twice as tall as the line box it replaces. */
        const h = chipSub ? 44 : 30
        return (
          <g className="pop d0">
            <rect x="12" y="6" width="276" height={h} rx="8"
              fill={`${chipColor}14`} stroke={chipColor} strokeWidth=".8" strokeOpacity=".42"/>
            <foreignObject x="12" y="6" width="276" height={h} style={{ pointerEvents: 'none' }}>
              <div style={{
                width: 276, height: h, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                lineHeight: 1.1, whiteSpace: 'nowrap',
                fontFamily: 'JetBrains Mono,monospace',
              }}>
                <div style={{ color: chipColor, fontSize: 11 }}><Fx s={chip}/></div>
                {chipSub && (
                  <div style={{ color: 'rgba(220,238,248,.42)', fontSize: 8.4, marginTop: 1 }}>
                    <Fx s={chipSub}/>
                  </div>
                )}
              </div>
            </foreignObject>
          </g>
        )
      })()}

      {children}

      {foot && (
        <g>
          <rect className="pop d6" x="12" y={footTop} width="276" height={footH} rx="7"
            fill="rgba(7,11,24,.72)" stroke="rgba(160,200,232,.13)" strokeWidth=".8"/>
          {foot}
        </g>
      )}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════
   SLIDE SCHEMA
═══════════════════════════════════════════════════════════ */
export interface Act { n: string; title: string; range: string; desc: string; color: string }
export interface Practice { code: string; q: string; a: string[] }

export interface SD {
  id: number
  layout: 'cover' | 'agenda' | 'visual' | 'concept' | 'formula' | 'example' | 'table' | 'pitfalls' | 'summary' | 'end'
  tag?: string
  section?: string
  act?: string
  accent?: string
  title: string
  subtitle?: string
  meta?: string
  body?: string
  given?: string
  items?: string[]
  formulas?: string[]
  fCaption?: string
  note?: string
  practice?: Practice
  acts?: Act[]
  pitfalls?: [string, string][]
  tableHead?: string[]
  tableRows?: string[][]
  dense?: boolean
  diagram?: ReactNode
  interactive?: boolean
  hint?: string
  backdrop?: boolean
  /* cover only — the module numeral engraved into the far wall */
  numeral?: string
  /* end only — the line that closes the deck */
  footer?: string
}
/* ═══════════════════════════════════════════════════════════
   MAIN APP
═══════════════════════════════════════════════════════════ */
function useStageScale() {
  const [k, setK] = useState(1)
  useEffect(() => {
    const fit = () => setK(Math.min(window.innerWidth / STAGE_W, window.innerHeight / STAGE_H))
    fit()
    window.addEventListener('resize', fit)
    document.addEventListener('fullscreenchange', fit)
    return () => {
      window.removeEventListener('resize', fit)
      document.removeEventListener('fullscreenchange', fit)
    }
  }, [])
  return k
}

/* Fullscreen toggle for the whole stage — presenting from a browser
   tab reads much better without the address bar and chrome. */
function useFullscreen(ref: React.RefObject<HTMLElement | null>) {
  const [isFs, setIsFs] = useState(false)
  useEffect(() => {
    const h = () => setIsFs(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', h)
    return () => document.removeEventListener('fullscreenchange', h)
  }, [])
  const toggle = useCallback(() => {
    if (!document.fullscreenElement) ref.current?.requestFullscreen?.()
    else document.exitFullscreen?.()
  }, [ref])
  return { isFs, toggle }
}

/* Each layout family gets its own transition flavour, so the deck
   changes rhythm as it moves between kinds of material. */
/* Each kind of material keeps its own transition, so the deck changes
   rhythm as it moves between kinds — but which family a plain content
   slide uses is the theme's call. That is what makes paging through
   the potential deck feel like climbing and the current deck feel like
   drifting, without either one saying so. */
function flavourFor(layout: SD['layout'], theme: DeckTheme): 'slide' | 'zoom' | 'side' | 'flip' | 'rise' {
  if (layout === 'cover' || layout === 'end' || layout === 'summary') return 'zoom'
  if (layout === 'agenda' || layout === 'table' || layout === 'pitfalls') return 'side'
  if (layout === 'example') return 'flip'
  return theme.flow
}

/* Everything a deck supplies. The parameters are destructured under the
   names the body already used when this was one file, so the shell below
   is untouched by the split. */
export interface DeckConfig {
  slides: SD[]
  accentFor: (s: SD) => string
  actLabel: (s: SD) => string | null
  actNumeral: (s: SD) => string | null
  /* which of the five rooms this deck stands in */
  theme: DeckTheme
  /* the way back to the course. Decks live at <curso>/modulo-N/parte-X/,
     so two levels up is the course index in every case. */
  backHref?: string
  backLabel?: string
}

export function Deck({
  slides: SLIDES, accentFor, actLabel, actNumeral, theme,
  backHref = '../../', backLabel = 'Volver al curso',
}: DeckConfig) {
  const [cur, setCur] = useState(0)
  const [animCls, setAnimCls] = useState<string>('zoom-enter-fwd')
  const [slideKey, setSlideKey] = useState(0)
  const busy = useRef(false)
  const scale = useStageScale()
  const stageRef = useRef<HTMLDivElement>(null)
  const { isFs, toggle: toggleFs } = useFullscreen(stageRef)

  const goTo = useCallback((idx: number) => {
    if (busy.current) return
    if (idx < 0 || idx >= SLIDES.length || idx === cur) return
    busy.current = true
    const fwd = idx > cur
    const dir = fwd ? 'fwd' : 'bwd'
    setAnimCls(`${flavourFor(SLIDES[cur].layout, theme)}-exit-${dir}`)
    setTimeout(() => {
      setCur(idx)
      setSlideKey(k => k + 1)
      setAnimCls(`${flavourFor(SLIDES[idx].layout, theme)}-enter-${dir}`)
      setTimeout(() => { busy.current = false }, 620)
    }, 250)
  }, [cur, theme])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') goTo(cur + 1)
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') goTo(cur - 1)
      if (e.key === 'Home') goTo(0)
      if (e.key === 'End') goTo(SLIDES.length - 1)
      if (e.key === 'f' || e.key === 'F') toggleFs()
      /* Esc leaves the deck — but only once it is no longer leaving
         fullscreen. In fullscreen the browser consumes the first Esc
         itself, and stealing it would drop the presenter out of the
         projector and out of the deck in one keystroke. */
      if (e.key === 'Escape' && !document.fullscreenElement) window.location.href = backHref
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [goTo, cur, toggleFs, backHref])

  const slide = SLIDES[cur]
  const accent = accentFor(slide)
  const act = actLabel(slide)
  const numeral = actNumeral(slide)
  const pct = ((cur + 1) / SLIDES.length) * 100

  return (
   <ThemeCtx.Provider value={theme}>
    <div ref={stageRef} className="w-full h-full flex items-center justify-center"
      style={{ background: '#04070F', fontFamily: "'Inter Tight',system-ui,sans-serif" }}>
      <div style={{
        width: STAGE_W, height: STAGE_H,
        transform: `scale(${scale})`,
        position: 'relative',
        overflow: 'hidden',
        background: theme.base,
        flex: '0 0 auto',
      }}>

        {/* The room itself — shards, shells, contours, streams or
            dipoles — tinted by whichever act is on screen */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ transition: 'opacity .8s ease', opacity: .85 }}>
          <Ambient theme={theme} accent={accent}/>
        </div>

        {/* Two slow glows, so the black never reads as flat paint */}
        <div className="absolute pointer-events-none drift-loop"
          style={{
            width: 900, height: 900, borderRadius: '50%',
            background: `radial-gradient(circle, ${accent}1f 0%, transparent 70%)`,
            top: '52%', left: '46%', marginTop: -450, marginLeft: -450,
            transition: 'background .8s ease',
          }}/>
        <div className="absolute pointer-events-none drift-loop"
          style={{
            width: 540, height: 540, borderRadius: '50%',
            background: `radial-gradient(circle, ${theme.panel}aa 0%, transparent 70%)`,
            top: '18%', left: '78%', marginTop: -270, marginLeft: -270,
            animationDelay: '-4.5s', animationDuration: '13s',
          }}/>

        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 z-40" style={{ height: 3, background: 'rgba(160,200,232,.07)' }}>
          <div className="progress-fill h-full"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${accent}aa, ${accent})`,
              transition: 'width .5s cubic-bezier(.22,1,.36,1), background .5s ease',
            }}/>
        </div>

        {/* The spine: act numeral in engraved caps, running down the outer
            margin. It is the only place Cinzel appears in the body of the
            deck, and it tells you which of the four acts you are standing
            in without spending a line of the slide on it.

            It rides the margin on the type's side of the composition —
            otherwise it lands on top of the diagram every second slide,
            since the layout alternates. */}
        {numeral && (
          /* explicit top, not translateY(-50%): `rise` animates transform
             and would overwrite the centring, leaving the spine low */
          <div key={numeral} className="absolute z-30 rise pointer-events-none"
            style={{
              ...dly(1), top: 293,
              [lean(slide) === 1 ? 'left' : 'right']: 22,
            } as CSSProperties}>
            <div style={{
              fontFamily: "'Cinzel',Georgia,serif", fontWeight: 900, fontSize: 30,
              color: accent, opacity: .28, letterSpacing: '.04em', textAlign: 'center',
            }}>
              {numeral}
            </div>
            <div style={{
              width: 1, height: 92, margin: '12px auto 0',
              background: `linear-gradient(to bottom, ${accent}66, transparent)`,
            }}/>
          </div>
        )}

        {/* Top-left rail: the way out, then where you are.

            A deck opened from the course page used to be a dead end —
            no link back, and Esc only left fullscreen. The way out comes
            first in the row because that is where a reader looks for it. */}
        <div className="absolute z-40 flex items-center" style={{ top: 24, left: 64, gap: 12 }}
          onClick={e => e.stopPropagation()}>
          <a href={backHref} className="back-link rise" style={{ ...dly(0) }}
            title={`${backLabel} (Esc)`} aria-label={`Volver a ${backLabel}`}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            <span>{backLabel}</span>
          </a>

          {slide.section && (
            <div key={slide.section} className="rise flex items-center gap-2" style={{ ...dly(1) }}>
              <span style={{ width: 1, height: 13, background: 'rgba(160,200,232,.2)' }}/>
              <span style={{
                color: accent, fontSize: 11, fontWeight: 600,
                letterSpacing: '.22em', textTransform: 'uppercase',
              }}>
                {slide.section}
              </span>
              {act && (
                <span style={{ color: 'rgba(220,238,248,.32)', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase' }}>
                  {act}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Counter + fullscreen toggle */}
        <div className="absolute z-40 flex items-center gap-4" style={{ top: 20, right: 56 }}
          onClick={e => e.stopPropagation()}>
          <div className="rise"
            style={{ color: 'rgba(220,238,248,.32)', fontSize: 12, letterSpacing: '.15em', fontFamily: 'JetBrains Mono,monospace' }}>
            {String(cur + 1).padStart(2, '0')}<span style={{ opacity: .4 }}> / </span>{String(SLIDES.length).padStart(2, '0')}
          </div>
          <button className="arrow-btn" onClick={toggleFs} aria-label={isFs ? 'Salir de pantalla completa' : 'Pantalla completa'}>
            {isFs ? (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 4v4a1 1 0 0 1-1 1H4M20 9h-4a1 1 0 0 1-1-1V4M15 20v-4a1 1 0 0 1 1-1h4M4 15h4a1 1 0 0 1 1 1v4"/>
              </svg>
            ) : (
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 8V5a1 1 0 0 1 1-1h3M20 8V5a1 1 0 0 1-1-1h-3M4 16v3a1 1 0 0 0 1 1h3M20 16v3a1 1 0 0 1-1 1h-3"/>
              </svg>
            )}
          </button>
        </div>

        {/* Click zones. They sit *under* the slide: the slide's own
            animation (transform + blur) opens a stacking context, so a
            z-index on the diagram panel could never escape it. Instead
            the slide is pointer-transparent and only the interactive
            panel opts back in. */}
        <div className="absolute top-0 right-0 z-10" style={{ width: '55%', height: '100%', cursor: 'pointer' }} onClick={() => goTo(cur + 1)}/>
        <div className="absolute top-0 left-0 z-10" style={{ width: '45%', height: '100%', cursor: 'pointer' }} onClick={() => goTo(cur - 1)}/>

        {/* Slide */}
        <div key={slideKey} className={`absolute inset-0 z-20 ${animCls}`} style={{ pointerEvents: 'none' }}>
          <SlideView s={slide} accent={accent}/>
        </div>

        {/* Accent bar sweeping across on every change, plus a slower,
            wider pass behind it so the change registers as depth. */}
        <div key={`sweep-${slideKey}`} className="sweep absolute pointer-events-none"
          style={{
            top: 0, left: 0, width: '100%', height: 2, zIndex: 35,
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
          }}/>
        <div key={`sweepsoft-${slideKey}`} className="sweep-soft absolute pointer-events-none"
          style={{
            top: 0, left: 0, width: '100%', height: '100%', zIndex: 34,
            background: `linear-gradient(100deg, transparent 42%, ${accent}0f 50%, transparent 58%)`,
          }}/>

        {/* Nav dots */}
        <div className="absolute z-40 flex items-center gap-[5px]"
          style={{ bottom: 24, left: '50%', transform: 'translateX(-50%)' }}
          onClick={e => e.stopPropagation()}>
          {SLIDES.map((sl, i) => (
            <button key={i} className="nav-dot" onClick={() => goTo(i)}
              style={{
                width: i === cur ? 26 : 6, height: 6, borderRadius: 3,
                background: i === cur ? accent : accentFor(sl) + (i < cur ? '66' : '2e'),
              }}
              /* the native tooltip is enough here, and it survives
                 fullscreen — handy when jumping around mid-class */
              title={`${i + 1}. ${sl.title.replace(/\n/g, ' ')}`}
              aria-label={`Lámina ${i + 1}: ${sl.title.replace(/\n/g, ' ')}`}/>
          ))}
        </div>

        {/* Arrow buttons */}
        <div className="absolute z-40 flex items-center gap-2"
          style={{ bottom: 20, right: 56 }}
          onClick={e => e.stopPropagation()}>
          <button className="arrow-btn" onClick={() => goTo(cur - 1)} disabled={cur === 0} aria-label="Anterior">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button className="arrow-btn" onClick={() => goTo(cur + 1)} disabled={cur === SLIDES.length - 1} aria-label="Siguiente">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
   </ThemeCtx.Provider>
  )
}

/* ═══════════════════════════════════════════════════════════
   COMPOSITION

   These slides are scenes, not pages. The rules that hold:

     · nothing is contained. No cards, no bordered panels, no
       floating rectangles. Structure comes from type, rules,
       and negative space
     · the diagram bleeds off the edge of the stage and dissolves
       into the room instead of sitting in a frame
     · the composition is asymmetric, and which way it leans
       alternates from slide to slide so no two in a row rhyme
     · depth comes from layers — a ghosted numeral behind, the
       diagram in the middle, the type in front
═══════════════════════════════════════════════════════════ */

/* Which way a slide leans. Derived from the slide's own number, so the
   deck alternates on its own and no two neighbours are composed alike. */
function lean(s: SD): 1 | -1 { return s.id % 2 === 0 ? -1 : 1 }

/* A giant numeral or glyph, set in the far background. It is the only
   thing in the deck allowed to be enormous and nearly invisible. */
function Ghost({ text, side = 'right', size = 340, top }:
  { text: string; side?: 'left' | 'right'; size?: number; top?: number }) {
  return (
    <div className="absolute pointer-events-none select-none" style={{
      [side]: -size * 0.14, top: top ?? -size * 0.12,
      fontFamily: "'Cinzel',Georgia,serif", fontWeight: 900,
      fontSize: size, lineHeight: .78, letterSpacing: '.01em',
      color: 'rgba(220,238,248,.028)', zIndex: 0,
    } as CSSProperties}>
      {text}
    </div>
  )
}

/* A hairline that crosses the composition on a diagonal. One per slide
   at most — it is there to break the horizontal grain, not to decorate. */
function Diagonal({ accent, from = 'tl' }: { accent: string; from?: 'tl' | 'tr' }) {
  return (
    <div className="absolute pointer-events-none rise" style={{
      ...dly(1), top: 0, left: 0, width: '100%', height: '100%', zIndex: 0,
      background: from === 'tl'
        ? `linear-gradient(104deg, transparent calc(50% - .5px), ${accent}26 50%, transparent calc(50% + .5px))`
        : `linear-gradient(76deg, transparent calc(50% - .5px), ${accent}26 50%, transparent calc(50% + .5px))`,
    }}/>
  )
}

/* The diagram, oversized and cropped by the edge of the stage. A mask
   frame, and sits on a glow that does.

   The diagram itself is NEVER cropped and NEVER masked. It is not a
   photograph: it carries a formula chip along its top edge and a live
   numeric readout along its bottom, both authored right up against the
   edge of its own 300×300 canvas. Bleeding it off the stage — or fading
   it under a mask — deletes the very numbers the slide is about.

   So the cinema comes from what is *behind* it: an oversized glow and a
   ring that run off the edge of the stage and give the composition its
   depth, while every pixel of data stays on screen. */
const DIAGRAM = 512          /* fits beside a 600-wide text column at 1280 */

/* Centring is done with an explicit `top`, never with translateY(-50%).
   Both `spring` and `drift-loop` animate `transform`, so a centring
   transform on the same element gets overwritten by the animation — and
   because these animations are fill-mode: forwards, it stays overwritten
   after they finish. That is what pushed the diagram off the bottom of
   the stage. The stage height is fixed, so arithmetic is simpler anyway. */
const midTop = (size: number) => (STAGE_H - size) / 2

function Bleed({ children, side, interactive, hint, accent }:
  { children: ReactNode; side: 1 | -1; interactive?: boolean; hint?: string; accent: string }) {
  const right = side === 1
  const edge = right ? 'right' : 'left'
  return (
    <>
      {/* the layer that does bleed: a glow and a ring, both cropped by
          the stage on purpose, sitting behind the diagram */}
      <div className="absolute pointer-events-none" style={{
        top: midTop(760), [edge]: -190,
        width: 760, height: 760, borderRadius: '50%', zIndex: 0,
        background: `radial-gradient(circle, ${accent}1c 0%, ${accent}09 42%, transparent 68%)`,
      } as CSSProperties}/>
      <div className="absolute pointer-events-none drift-loop" style={{
        top: midTop(640), [edge]: -150,
        width: 640, height: 640, borderRadius: '50%', zIndex: 0,
        border: `1px solid ${accent}1f`,
      } as CSSProperties}/>

      {/* the diagram: whole, unframed, unmasked */}
      <div className="absolute spring" style={{
        ...dly(3),
        top: midTop(DIAGRAM), [edge]: 34,
        width: DIAGRAM, height: DIAGRAM,
        zIndex: 1,
        pointerEvents: interactive ? 'auto' : 'none',
      } as CSSProperties}>
        {children}
      </div>

      {interactive && (
        /* the wrapper centres; only the inner element animates, so the
           entrance transform has nothing of ours to overwrite */
        <div className="absolute flex justify-center" style={{
          bottom: 58, [edge]: 34, width: DIAGRAM, zIndex: 2,
        } as CSSProperties}>
          <div className="rise" style={{
            ...dly(8), display: 'flex', alignItems: 'center', gap: 7,
            fontSize: 11.5, color: 'rgba(220,238,248,.5)', whiteSpace: 'nowrap',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: accent }}/>
            {hint ?? 'Arrastra el punto'}
          </div>
        </div>
      )}
    </>
  )
}

/* ── Shared micro-components ── */

/* An eyebrow, not a badge. No pill, no border — just letterspaced caps
   over a short accent tick. */
export function TagBadge({ text, accent }: { text: string; accent: string }) {
  return (
    <div className="rise" style={{
      ...dly(0), display: 'flex', alignItems: 'center', gap: 10,
      marginBottom: 14, width: 'fit-content',
    }}>
      <span style={{ width: 22, height: 2, background: accent }}/>
      <span style={{
        color: accent, fontSize: 11, fontWeight: 600,
        letterSpacing: '.28em', textTransform: 'uppercase',
      }}>{text}</span>
    </div>
  )
}


/* The heading's rule and its ornament. Which ornament it ends in comes
   from the theme, so this is the same component in all five decks and
   still looks like five different decks. */
export function ShardRule({ accent, delay = 3, width = 300 }: { accent: string; delay?: number; width?: number }) {
  const theme = useTheme()
  return <Ornament theme={theme} accent={accent} delay={delay} width={width}/>
}

/* Word-by-word arrival — the one loud gesture a slide is allowed. The
   animation itself lives on the wrapper's theme class, so a word only
   has to carry its delay.

   The tilt is for the dielectric deck: each word starts at its own
   random angle and snaps into line, which is what polarisation is. */
export function SHeading({ children, delay = 1, size, rule }:
  { children: ReactNode; delay?: number; size: number; rule?: string }) {
  const theme = useTheme()
  const lines = String(children).split('\n')
  let idx = 0
  return (
    <>
      <h2 className={`title-glow ${theme.word}`} style={{
        fontFamily: "'Sora',system-ui,sans-serif", color: HIELO,
        fontWeight: 700, letterSpacing: '-.028em', lineHeight: 1.0,
        fontSize: size,
      }}>
        {lines.map((line, li) => (
          <span key={li} style={{ display: 'block' }}>
            {line.split(' ').map((w, wi) => {
              const i = idx++
              /* deterministic per word position, so a title always
                 crystallises the same way it did last lecture */
              const tilt = ((Math.sin(i * 12.9898) * 43758.5453 % 1) * 14 - 7).toFixed(1)
              return (
                /* the space sits between the boxes so lines can still break */
                <Fragment key={wi}>
                  <span className="word" style={{
                    ...dly(delay + i * 0.85),
                    ['--tilt' as string]: `${tilt}deg`,
                  }}>{w}</span>{' '}
                </Fragment>
              )
            })}
          </span>
        ))}
      </h2>
      {rule && <ShardRule accent={rule} delay={delay + idx + 0.5}/>}
    </>
  )
}

/* Headings run large. A slide carries one idea, and the title is that
   idea — it should be the first and loudest thing in the room. */
export function titleSize(t: string): number {
  if (t.length > 46) return 44
  if (t.length > 34) return 52
  if (t.length > 22) return 60
  return 68
}

export function Body({ text, delay = 2, width = 560 }: { text: string; delay?: number; width?: number }) {
  return (
    <p className="rise" style={{
      ...dly(delay),
      color: 'rgba(220,238,248,.60)', fontSize: 17.5, fontWeight: 300,
      lineHeight: 1.62, maxWidth: width,
    }}>
      <Fx s={text}/>
    </p>
  )
}

/* Kept for compatibility with decks that still name it; nothing in the
   composition uses a clipped panel any more. */
export const CUT = 'none'

/* A result does not need a box around it. An accent bar in the margin
   and a jump in type size do the same job with none of the furniture. */
export function FormulaBox({ lines, caption, delay, accent }:
  { lines: string[]; caption?: string; delay: number; accent: string }) {
  return (
    <div className="rise" style={{
      ...dly(delay),
      marginTop: 22, paddingLeft: 20,
      borderLeft: `2px solid ${accent}`,
    }}>
      {lines.map((l, i) => (
        <div key={i} className="wipe" style={{
          ...dly(delay + 1 + i * 1.1),
          color: HIELO, fontFamily: 'JetBrains Mono,monospace',
          fontSize: 19, lineHeight: 1.75, whiteSpace: 'pre-wrap',
        }}>
          <Fx s={l}/>
        </div>
      ))}
      {caption && (
        <div style={{ marginTop: 10, fontSize: 13.5, color: 'rgba(220,238,248,.42)', lineHeight: 1.5, maxWidth: 520 }}>
          <Fx s={caption}/>
        </div>
      )}
    </div>
  )
}

export function NoteBar({ text, accent, delay = 9 }: { text: string; accent: string; delay?: number }) {
  return (
    <div className="rise" style={{
      ...dly(delay),
      marginTop: 18, paddingTop: 12, fontSize: 14, maxWidth: 560,
      color: 'rgba(220,238,248,.50)', lineHeight: 1.55,
      borderTop: '1px solid rgba(160,200,232,.12)',
    }}>
      <span style={{ color: accent, marginRight: 9 }}>◆</span><Fx s={text}/>
    </div>
  )
}

export function GivenBar({ text, accent, delay = 1 }: { text: string; accent: string; delay?: number }) {
  return (
    <div className="rise" style={{ ...dly(delay), marginTop: 20, marginBottom: 6, paddingLeft: 20, borderLeft: `2px solid ${accent}66` }}>
      <div style={{ fontSize: 10, letterSpacing: '.28em', textTransform: 'uppercase', color: accent, marginBottom: 7 }}>
        Dado
      </div>
      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 16, color: HIELO, lineHeight: 1.6, maxWidth: 560 }}>
        <Fx s={text}/>
      </div>
    </div>
  )
}

export function PracticeCard({ p, accent, delay }: { p: Practice; accent: string; delay: number }) {
  return (
    <div className="rise" style={{
      ...dly(delay), marginTop: 20, paddingTop: 14, maxWidth: 560,
      borderTop: '1px solid rgba(160,200,232,.12)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 7 }}>
        <span style={{ color: accent, fontFamily: 'JetBrains Mono,monospace', fontSize: 10.5, fontWeight: 600, letterSpacing: '.08em' }}>
          {p.code}
        </span>
        <span style={{ width: 14, height: 1, background: 'rgba(160,200,232,.3)' }}/>
        <span style={{ fontSize: 10, letterSpacing: '.24em', textTransform: 'uppercase', color: 'rgba(220,238,248,.3)' }}>
          {p.a.length ? 'Práctica' : 'Nota'}
        </span>
      </div>
      <div style={{ fontSize: 13.5, color: 'rgba(220,238,248,.6)', lineHeight: 1.6, marginBottom: p.a.length ? 9 : 0 }}>
        <Fx s={p.q}/>
      </div>
      {p.a.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 20px' }}>
          {p.a.map((ans, i) => (
            <span key={i} style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12.5, color: accent, opacity: .8 }}>
              <Fx s={ans}/>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/* Kept only so older deck code that imports it still compiles. The
   composition puts diagrams in <Bleed>, which has no frame at all. */
export function RightPanel({ children }: { children: ReactNode; interactive?: boolean; hint?: string; accent: string }) {
  return <>{children}</>
}

/* A list where the marker hangs in the margin and the text runs free.
   No bullets in circles, no chips — the indent is the structure. */
function Hang({ items, accent, start, marker = 'tick', width = 560 }:
  { items: string[]; accent: string; start: number; marker?: 'tick' | 'num'; width?: number }) {
  return (
    <ul style={{ display: 'flex', flexDirection: 'column', gap: 13, marginTop: 20 }}>
      {items.map((item, i) => (
        <li key={i} className="rise" style={{ ...dly(start + i), display: 'flex', alignItems: 'baseline', gap: 14 }}>
          {marker === 'num' ? (
            <span style={{
              flexShrink: 0, minWidth: 24, color: accent, opacity: .75,
              fontFamily: 'JetBrains Mono,monospace', fontSize: 13, fontWeight: 600,
            }}>{String(i + 1).padStart(2, '0')}</span>
          ) : (
            <span style={{ flexShrink: 0, width: 14, height: 1, background: accent, opacity: .7, transform: 'translateY(-5px)' }}/>
          )}
          <span style={{ fontSize: 16.5, fontWeight: 300, lineHeight: 1.58, color: 'rgba(220,238,248,.78)', maxWidth: width }}>
            <Fx s={item}/>
          </span>
        </li>
      ))}
    </ul>
  )
}

/* ═══════════════════════════════════════════════════════════
   SLIDE LAYOUTS
═══════════════════════════════════════════════════════════ */
function SlideView({ s, accent }: { s: SD; accent: string }) {
  switch (s.layout) {
    case 'cover':    return <Cover s={s}/>
    case 'agenda':   return <Agenda s={s}/>
    case 'visual':   return <Visual s={s} accent={accent}/>
    case 'concept':  return <Concept s={s} accent={accent}/>
    case 'formula':  return <Formula s={s} accent={accent}/>
    case 'example':  return <Example s={s} accent={accent}/>
    case 'table':    return <TableSlide s={s} accent={accent}/>
    case 'pitfalls': return <Pitfalls s={s}/>
    case 'summary':  return <Summary s={s}/>
    case 'end':      return <End s={s}/>
    default: return null
  }
}

/* ── The scene shell ──
   Type on one side, the diagram bleeding off the other, and which side
   is which flips with every slide. */
function Scene({ s, accent, children }: { s: SD; accent: string; children: ReactNode }) {
  const side = lean(s)
  const right = side === 1
  return (
    <div className="relative h-full">
      {s.diagram && (
        <Bleed side={side} interactive={s.interactive} hint={s.hint} accent={accent}>
          {s.diagram}
        </Bleed>
      )}
      {/* The type column is sized so it always clears the diagram: at
          1280 the diagram takes 34+512, which leaves 612 of usable
          column after the 84 margin, on either side. */}
      <div className="absolute flex flex-col justify-center" style={{
        top: 0, height: '100%', zIndex: 2,
        left: right ? 84 : undefined,
        right: right ? undefined : 84,
        width: s.diagram ? 612 : 940,
        alignItems: 'flex-start',
      }}>
        {children}
      </div>
    </div>
  )
}

/* ── Layouts ── */
function Cover({ s }: { s: SD }) {
  const theme = useTheme()
  return (
    <div className="relative h-full overflow-hidden">
      {s.backdrop && <>
        <Backdrop theme={theme} accent={theme.glow}/>
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${theme.base} 30%, rgba(0,0,0,.35) 74%, transparent)` }}/>
        <div className="absolute inset-0" style={{ background: `linear-gradient(105deg, ${theme.base} 22%, transparent 78%)` }}/>
      </>}

      {/* the module numeral, cropped by the corner of the stage */}
      {s.numeral && (
        <div className="absolute pointer-events-none select-none" style={{
          right: -46, bottom: -132, fontFamily: "'Cinzel',Georgia,serif",
          fontWeight: 900, fontSize: 420, lineHeight: .78,
          color: 'rgba(220,238,248,.045)',
        }}>
          {s.numeral}
        </div>
      )}

      <div className="absolute" style={{ left: 84, bottom: 104, maxWidth: 880, zIndex: 2 }}>
        {s.tag && (
          <div className="rise" style={{
            ...dly(0), fontFamily: "'Cinzel',Georgia,serif", fontSize: 13, fontWeight: 700,
            letterSpacing: '.44em', textTransform: 'uppercase', color: ORO, marginBottom: 22,
          }}>
            {s.tag}
          </div>
        )}
        <SHeading delay={1} size={112}>{s.title}</SHeading>
        <ShardRule accent={ORO} delay={7} width={440}/>
        {s.subtitle && (
          <p className="rise" style={{ ...dly(4), marginTop: 24, fontSize: 19, fontWeight: 300, color: 'rgba(220,238,248,.56)', maxWidth: 560, lineHeight: 1.55 }}>
            {s.subtitle}
          </p>
        )}
        {s.meta && (
          <p className="rise" style={{ ...dly(5), marginTop: 12, fontSize: 12.5, fontFamily: 'JetBrains Mono,monospace', color: 'rgba(220,238,248,.3)' }}>
            {s.meta}
          </p>
        )}
      </div>
      <div className="rise absolute" style={{ ...dly(7), left: 84, bottom: 52, fontSize: 11.5, color: 'rgba(220,238,248,.24)', letterSpacing: '.12em' }}>
        ← → para navegar · clic en cualquier lado para avanzar · F pantalla completa
      </div>
    </div>
  )
}

/* Four acts as a staircase, not a grid. Each numeral hangs into the
   margin, each row steps further right, and hairlines do the dividing
   that boxes used to do. */
function Agenda({ s }: { s: SD }) {
  return (
    <div className="relative h-full flex flex-col justify-center" style={{ paddingLeft: 84, paddingRight: 72 }}>
      <Ghost text="IV" side="right" size={400} top={-40}/>
      <div style={{ zIndex: 2 }}>
        {s.tag && <TagBadge text={s.tag} accent={ORO}/>}
        <SHeading size={54} rule={ORO}>{s.title}</SHeading>
        {s.body && <div style={{ marginTop: 16 }}><Body text={s.body} width={700}/></div>}

        <div style={{ marginTop: 28 }}>
          {s.acts?.map((a, i) => (
            <div key={i} className="rise" style={{
              ...dly(i + 3),
              display: 'flex', alignItems: 'baseline', gap: 24,
              /* the staircase: each act steps further into the page */
              marginLeft: i * 34,
              paddingTop: 13, paddingBottom: 13,
              borderTop: i === 0 ? 'none' : '1px solid rgba(160,200,232,.10)',
            }}>
              <span style={{
                fontFamily: "'Cinzel',Georgia,serif", fontWeight: 900, fontSize: 34,
                color: a.color, lineHeight: 1, minWidth: 58, opacity: .92,
              }}>
                {a.n}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span style={{ fontFamily: "'Sora',system-ui,sans-serif", fontSize: 20, fontWeight: 600, color: HIELO }}>{a.title}</span>
                  <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 11.5, color: a.color, opacity: .7 }}>{a.range}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 300, color: 'rgba(220,238,248,.5)', lineHeight: 1.5, marginTop: 3, maxWidth: 620 }}>
                  <Fx s={a.desc}/>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Visual({ s, accent }: { s: SD; accent: string }) {
  const theme = useTheme()
  const side = lean(s)
  return (
    <div className="relative h-full overflow-hidden">
      {s.backdrop && (
        <div className="absolute top-0 h-full" style={{ [side === 1 ? 'right' : 'left']: 0, width: '54%' } as CSSProperties}>
          <Backdrop theme={theme} accent={accent} flip={side === -1}/>
          <div className="absolute inset-0" style={{
            background: side === 1
              ? `linear-gradient(to right, ${theme.base} 0%, transparent 62%)`
              : `linear-gradient(to left, ${theme.base} 0%, transparent 62%)`,
          }}/>
        </div>
      )}
      <div className="absolute flex flex-col justify-center" style={{
        top: 0, height: '100%', zIndex: 2,
        left: side === 1 ? 84 : undefined, right: side === 1 ? undefined : 84,
        width: 600,
      }}>
        {s.tag && <TagBadge text={s.tag} accent={accent}/>}
        <SHeading size={titleSize(s.title)} rule={accent}>{s.title}</SHeading>
        {s.body && <div style={{ marginTop: 20 }}><Body text={s.body} width={580}/></div>}
        {s.items && <Hang items={s.items} accent={accent} start={3} width={560}/>}
      </div>
    </div>
  )
}

function Concept({ s, accent }: { s: SD; accent: string }) {
  const n = s.items?.length ?? 0
  return (
    <div className="relative h-full flex flex-col justify-center" style={{ paddingLeft: 84, paddingRight: 96 }}>
      <Diagonal accent={accent} from="tr"/>
      <div style={{ maxWidth: 940, zIndex: 2 }}>
        {s.tag && <TagBadge text={s.tag} accent={accent}/>}
        <SHeading size={titleSize(s.title)} rule={accent}>{s.title}</SHeading>
        {s.body && <div style={{ marginTop: 18 }}><Body text={s.body} width={760}/></div>}
        {s.items && <Hang items={s.items} accent={accent} start={3} marker="num" width={760}/>}
        {s.formulas && <FormulaBox lines={s.formulas} caption={s.fCaption} delay={n + 4} accent={accent}/>}
        {s.practice && <PracticeCard p={s.practice} accent={accent} delay={n + 5}/>}
        {s.note && <NoteBar text={s.note} accent={accent} delay={n + 5}/>}
      </div>
    </div>
  )
}

function Formula({ s, accent }: { s: SD; accent: string }) {
  const n = s.items?.length ?? 0
  return (
    <Scene s={s} accent={accent}>
      {s.tag && <TagBadge text={s.tag} accent={accent}/>}
      <SHeading size={titleSize(s.title)} rule={accent}>{s.title}</SHeading>
      {s.body && <div style={{ marginTop: 16 }}><Body text={s.body} width={s.diagram ? 578 : 860}/></div>}
      {s.items && <Hang items={s.items} accent={accent} start={3} width={s.diagram ? 552 : 820}/>}
      {s.formulas && <FormulaBox lines={s.formulas} caption={s.fCaption} delay={n + 4} accent={accent}/>}
      {s.note && <NoteBar text={s.note} accent={accent} delay={n + 5}/>}
    </Scene>
  )
}

function Example({ s, accent }: { s: SD; accent: string }) {
  const n = s.items?.length ?? 0
  return (
    <Scene s={s} accent={accent}>
      {s.tag && <TagBadge text={s.tag} accent={accent}/>}
      <SHeading size={titleSize(s.title)} rule={accent}>{s.title}</SHeading>
      {s.given && <GivenBar text={s.given} accent={accent} delay={3}/>}
      {s.items && (
        <ol style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 9 }}>
          {s.items.map((item, i) => (
            <li key={i} className="rise" style={{ ...dly(i + 4), display: 'flex', alignItems: 'baseline', gap: 14 }}>
              <span style={{
                flexShrink: 0, minWidth: 18, color: accent, fontWeight: 700, opacity: .75,
                fontFamily: 'JetBrains Mono,monospace', fontSize: 14,
              }}>{i + 1}</span>
              <span style={{
                fontSize: 15, lineHeight: 1.6, color: 'rgba(220,238,248,.82)',
                fontFamily: 'JetBrains Mono,monospace', maxWidth: s.diagram ? 545 : 800,
              }}>
                <Fx s={item}/>
              </span>
            </li>
          ))}
        </ol>
      )}
      {s.formulas && (
        <div className="rise" style={{ ...dly(n + 5), marginTop: 20, paddingLeft: 20, borderLeft: `2px solid ${accent}` }}>
          {s.formulas.map((f, i) => (
            <div key={i} style={{ fontSize: 18, lineHeight: 1.75, color: HIELO, fontFamily: 'JetBrains Mono,monospace' }}>
              <Fx s={f}/>
            </div>
          ))}
          {s.fCaption && (
            <div style={{ marginTop: 9, fontSize: 13, color: 'rgba(220,238,248,.44)', lineHeight: 1.5, maxWidth: 520 }}>
              <Fx s={s.fCaption}/>
            </div>
          )}
        </div>
      )}
      {s.practice && <PracticeCard p={s.practice} accent={accent} delay={n + 6}/>}
    </Scene>
  )
}

/* A table with no table around it: a rule under the head, air between
   the rows, and the first column carrying the accent. */
function TableSlide({ s, accent }: { s: SD; accent: string }) {
  const pad = s.dense ? '11px 26px 11px 0' : '15px 30px 15px 0'
  const fs = s.dense ? 13.5 : 16
  return (
    <div className="relative h-full flex flex-col justify-center" style={{ paddingLeft: 84, paddingRight: 84 }}>
      <Ghost text="=" side="right" size={460} top={40}/>
      <div style={{ maxWidth: 1090, zIndex: 2 }}>
        {s.tag && <TagBadge text={s.tag} accent={accent}/>}
        <SHeading size={titleSize(s.title)} rule={accent}>{s.title}</SHeading>
        {s.body && <div style={{ marginTop: 16 }}><Body text={s.body} width={780}/></div>}
        {s.tableHead && s.tableRows && (
          <table className="rise" style={{ ...dly(4), width: '100%', borderCollapse: 'collapse', marginTop: 24 }}>
            <thead>
              <tr>
                {s.tableHead.map((h, i) => (
                  <th key={i} style={{
                    padding: '0 30px 10px 0', textAlign: 'left', fontWeight: 600, fontSize: 11,
                    letterSpacing: '.2em', textTransform: 'uppercase', color: accent,
                    borderBottom: `1px solid ${accent}55`,
                    width: i === 0 ? 168 : undefined,
                  }}>
                    <Fx s={h}/>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {s.tableRows.map((row, ri) => (
                <tr key={ri} className="rise" style={dly(ri + 5)}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{
                      padding: pad, fontSize: fs,
                      color: ci === 0 ? accent : 'rgba(220,238,248,.82)',
                      borderBottom: '1px solid rgba(160,200,232,.07)',
                      fontFamily: 'JetBrains Mono,monospace',
                      whiteSpace: ci === 0 ? 'nowrap' : 'normal',
                      lineHeight: 1.5, verticalAlign: 'baseline',
                    }}>
                      <Fx s={cell}/>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {s.note && <NoteBar text={s.note} accent={accent} delay={(s.tableRows?.length ?? 0) + 5}/>}
      </div>
    </div>
  )
}

/* The wrong reading, struck through and set back; the right one below
   it, brighter and indented. No two-column grid of coloured rectangles. */
function Pitfalls({ s }: { s: SD }) {
  return (
    <div className="relative h-full flex flex-col justify-center" style={{ paddingLeft: 84, paddingRight: 84 }}>
      <Ghost text="✕" side="right" size={420} top={20}/>
      <div style={{ zIndex: 2, maxWidth: 1050 }}>
        {s.tag && <TagBadge text={s.tag} accent={BRASA}/>}
        <SHeading size={50} rule={BRASA}>{s.title}</SHeading>
        {s.body && <div style={{ marginTop: 14 }}><Body text={s.body} width={760}/></div>}
        <div style={{ marginTop: 22 }}>
          {s.pitfalls?.map(([wrong, right], i) => (
            <div key={i} className="rise" style={{
              ...dly(i + 3), paddingTop: 11, paddingBottom: 11,
              borderTop: i === 0 ? 'none' : '1px solid rgba(160,200,232,.08)',
            }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                <span style={{ color: BRASA, fontSize: 13, flexShrink: 0, width: 14 }}>✕</span>
                <span style={{ fontSize: 14.5, fontWeight: 300, lineHeight: 1.45, color: 'rgba(220,238,248,.44)' }}>
                  <Fx s={wrong}/>
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 4, paddingLeft: 34 }}>
                <span style={{ color: AURORA, fontSize: 13, flexShrink: 0, width: 14 }}>✓</span>
                <span style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.5, color: 'rgba(220,238,248,.86)' }}>
                  <Fx s={right}/>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* Two uneven columns of numbered lines. Uneven on purpose: a 4/4 split
   reads as a grid, a 5/3 reads as a composition. */
function Summary({ s }: { s: SD }) {
  const theme = useTheme()
  const items = s.items ?? []
  const split = Math.ceil(items.length * 0.55)
  const cols = [items.slice(0, split), items.slice(split)]
  return (
    <div className="relative h-full flex flex-col justify-center overflow-hidden" style={{ paddingLeft: 84, paddingRight: 84 }}>
      {s.backdrop && <>
        <div className="absolute inset-0" style={{ opacity: .42 }}><Backdrop theme={theme} accent={theme.glow}/></div>
        <div className="absolute inset-0" style={{ background: `linear-gradient(118deg, ${theme.base} 44%, rgba(0,0,0,.72))` }}/>
      </>}
      <div className="relative" style={{ zIndex: 2 }}>
        {s.tag && (
          <div className="rise" style={{
            ...dly(0), fontFamily: "'Cinzel',Georgia,serif", fontSize: 12, fontWeight: 700,
            letterSpacing: '.34em', textTransform: 'uppercase', color: ORO, marginBottom: 14,
          }}>
            {s.tag}
          </div>
        )}
        <SHeading size={52} rule={ORO}>{s.title}</SHeading>
        <div style={{ display: 'flex', gap: 56, marginTop: 26, alignItems: 'flex-start' }}>
          {cols.map((col, ci) => (
            <div key={ci} style={{ flex: ci === 0 ? '1 1 56%' : '1 1 44%', marginTop: ci === 1 ? 26 : 0 }}>
              {col.map((item, i) => {
                const n = ci === 0 ? i : split + i
                return (
                  <div key={i} className="rise" style={{
                    ...dly(n + 3), display: 'flex', alignItems: 'baseline', gap: 14,
                    paddingTop: 9, paddingBottom: 9,
                    borderTop: i === 0 ? 'none' : '1px solid rgba(160,200,232,.08)',
                  }}>
                    <span style={{ flexShrink: 0, fontSize: 11.5, fontWeight: 700, color: ORO, opacity: .7, fontFamily: 'JetBrains Mono,monospace' }}>
                      {String(n + 1).padStart(2, '0')}
                    </span>
                    <span style={{ fontSize: 14.5, fontWeight: 300, lineHeight: 1.55, color: 'rgba(220,238,248,.76)' }}>
                      <Fx s={item}/>
                    </span>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function End({ s }: { s: SD }) {
  const theme = useTheme()
  return (
    <div className="relative h-full flex flex-col justify-center overflow-hidden" style={{ paddingLeft: 84 }}>
      {s.backdrop && <>
        <Backdrop theme={theme} accent={theme.glow} flip/>
        <div className="absolute inset-0" style={{ background: `linear-gradient(96deg, ${theme.base} 34%, rgba(0,0,0,.30))` }}/>
      </>}
      <div className="relative" style={{ zIndex: 2, maxWidth: 840 }}>
        <SHeading delay={1} size={100}>{s.title}</SHeading>
        <ShardRule accent={ORO} delay={6} width={420}/>
        {s.subtitle && (
          <p className="rise" style={{
            ...dly(3), marginTop: 28, fontSize: 18.5, fontWeight: 300,
            color: 'rgba(220,238,248,.52)', maxWidth: 640, lineHeight: 1.7, whiteSpace: 'pre-line',
          }}>
            {s.subtitle}
          </p>
        )}
        {s.footer && (
          <div className="rise" style={{ ...dly(5), marginTop: 42, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 2, background: ORO }}/>
            <span style={{
              fontFamily: "'Cinzel',Georgia,serif", fontSize: 11.5, letterSpacing: '.28em',
              textTransform: 'uppercase', fontWeight: 700, color: 'rgba(220,238,248,.3)',
            }}>
              {s.footer}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
