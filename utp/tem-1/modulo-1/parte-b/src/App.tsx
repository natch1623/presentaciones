import { Fragment, useState, useEffect, useCallback, useRef, type ReactNode, type CSSProperties } from 'react'

/* ─── Design tokens ─────────────────────────────────────── */
const GOLD   = '#f0c040'
const BLUE   = '#60a5fa'
const RED    = '#f87171'
const GREEN  = '#4ade80'
const VIOLET = '#c084fc'
const DIM    = 'rgba(240,192,64,.14)'

/* Fixed 16:9 stage. Everything is authored at these pixel
   dimensions and scaled to fit, so a slide can never reflow
   or clip on a different projector. */
const STAGE_W = 1280
const STAGE_H = 720

/* Pixels per unit in the interactive diagrams — the live
   readouts divide by this so the numbers mean something. */
const U = 20

/* ─── Image URLs ────────────────────────────────────────── */
const IMG_SPIRAL   = 'https://images.unsplash.com/photo-1612521480285-e668f583d2c8?w=1400&h=900&fit=crop&auto=format'
const IMG_ABSTRACT = 'https://images.unsplash.com/photo-1758073519996-6d3c63b4922c?w=1400&h=900&fit=crop&auto=format'
const IMG_GRID     = 'https://images.unsplash.com/photo-1769120062289-15b5b8025abf?w=1400&h=900&fit=crop&auto=format'
const IMG_BLUE     = 'https://images.unsplash.com/photo-1755456068187-c2f56ad73d09?w=1400&h=900&fit=crop&auto=format'

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
type FxAtom = { kind: 'atom'; text: string; sub?: boolean; sup?: boolean; bold?: boolean }
type FxFrac = { kind: 'frac'; num: FxPiece[]; den: FxPiece[] }
type FxPiece = FxAtom | FxFrac

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

function Fx({ s, style, className }: { s: string; style?: CSSProperties; className?: string }) {
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
function fxTspans(src: string): ReactNode[] {
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
function FxHtml({ x, y, w, h, text, color, size, family = 'JetBrains Mono,monospace', weight, justify = 'center' }: {
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
const dly = (i: number): CSSProperties => ({ animationDelay: `${0.06 + i * 0.075}s` })

/* ═══════════════════════════════════════════════════════════
   CONTINUOUS MOTION
═══════════════════════════════════════════════════════════ */

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}

/* Elapsed seconds, driven by rAF. Only the diagram that calls it
   re-renders, so the cost stays inside one SVG. */
function useTick(): number {
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

/* Ambient vector field behind every slide. Drawn straight to a
   canvas so it never triggers a React render. */
function AmbientField({ accent }: { accent: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const accentRef = useRef(accent)
  accentRef.current = accent

  useEffect(() => {
    if (prefersReducedMotion()) return
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    const STEP = 74
    const cols = Math.ceil(STAGE_W / STEP) + 1
    const rows = Math.ceil(STAGE_H / STEP) + 1
    let raf = 0
    const start = performance.now()

    const draw = (now: number) => {
      const t = (now - start) / 1000
      ctx.clearRect(0, 0, STAGE_W, STAGE_H)
      ctx.strokeStyle = accentRef.current
      ctx.lineWidth = 1.2
      ctx.lineCap = 'round'
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * STEP + 24
          const y = j * STEP + 24
          /* Cheap smooth field: two out-of-phase sinusoids */
          const ang = Math.sin(x * 0.0055 + t * 0.26) * 1.5
                    + Math.cos(y * 0.0071 - t * 0.19) * 1.5
          const len = 13 + 5 * Math.sin(t * 0.5 + i * 0.6 + j * 0.4)
          const dx = Math.cos(ang) * len
          const dy = Math.sin(ang) * len
          ctx.globalAlpha = 0.055 + 0.045 * (0.5 + 0.5 * Math.sin(t * 0.7 + i * 0.35 - j * 0.28))
          ctx.beginPath()
          ctx.moveTo(x - dx / 2, y - dy / 2)
          ctx.lineTo(x + dx / 2, y + dy / 2)
          ctx.stroke()
          /* arrow head */
          ctx.beginPath()
          ctx.arc(x + dx / 2, y + dy / 2, 1.5, 0, Math.PI * 2)
          ctx.fillStyle = accentRef.current
          ctx.fill()
        }
      }
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <canvas ref={ref} width={STAGE_W} height={STAGE_H}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}/>
  )
}

/* A dot that walks a polyline on a loop — used to trace vector
   routes inside the diagrams. */
function travel(points: { x: number; y: number }[], u: number) {
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

function Traveler({ x, y, color, r = 4 }: { x: number; y: number; color: string; r?: number }) {
  return (
    <g style={{ pointerEvents: 'none' }}>
      <circle cx={x} cy={y} r={r * 2.6} fill={color} opacity=".13"/>
      <circle cx={x} cy={y} r={r} fill={color} opacity=".95"/>
    </g>
  )
}

/* ═══════════════════════════════════════════════════════════
   ANIMATED SVG DIAGRAMS
═══════════════════════════════════════════════════════════ */

/* Glowing filter definition */
function GlowFilter({ id, color, stdDev = 4 }: { id: string; color: string; stdDev?: number }) {
  return (
    <filter id={id} x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation={stdDev} result="blur"/>
      <feFlood floodColor={color} floodOpacity="0.7" result="color"/>
      <feComposite in="color" in2="blur" operator="in" result="glow"/>
      <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  )
}

/* ── Shared defs used by every diagram ── */
function SharedDefs() {
  return (
    <defs>
      <pattern id="grid20" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,.055)" strokeWidth=".5"/>
      </pattern>
      {/* Glow filters deliberately use userSpaceOnUse over the whole
          board. With the default objectBoundingBox units, a perfectly
          vertical or horizontal line has a zero-extent bbox, the filter
          region collapses to nothing, and the element renders as
          *blank* — which silently ate the ∂/∂z axis, the ∇T arrow
          whenever it pointed straight up, and each paddlewheel blade as
          it swept through 0°. A fixed region cannot degenerate. */}
      {([['gB', BLUE], ['gR', RED], ['gG', GOLD], ['gGr', GREEN], ['gV', VIOLET]] as const).map(([id, c]) => (
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
          like ∇T whole. */}
      {([['aB', BLUE], ['aR', RED], ['aG', GOLD], ['aGr', GREEN], ['aV', VIOLET],
         ['aW', 'rgba(255,255,255,.5)']] as const).map(([id, c]) => (
        <marker key={id} id={id} markerUnits="userSpaceOnUse"
          markerWidth="10" markerHeight="7.5" refX="9" refY="3.75" orient="auto">
          <polygon points="0 0,10 3.75,0 7.5" fill={c}/>
        </marker>
      ))}
      {/* a smaller head, for the short field arrows that fill a plane */}
      <marker id="aBs" markerUnits="userSpaceOnUse"
        markerWidth="5.5" markerHeight="4.2" refX="5" refY="2.1" orient="auto">
        <polygon points="0 0,5.5 2.1,0 4.2" fill={BLUE}/>
      </marker>
    </defs>
  )
}

function Dot({ cx, cy, color = 'white' }: { cx: number; cy: number; color?: string }) {
  return <circle className="pop d0" cx={cx} cy={cy} r="4.5" fill={color} opacity=".9"/>
}

/* Serif label — accepts the Fx mini-syntax */
function VLabel({ x, y, text, color, delay = 'd2', anchor = 'middle', size = 15 }:
  { x: number; y: number; text: string; color: string; delay?: string; anchor?: string; size?: number }) {
  return (
    <text className={`rise ${delay}`} x={x} y={y} fill={color} fontSize={size} fontWeight="700"
      fontFamily="'Fraunces',Georgia,serif" textAnchor={anchor as 'middle' | 'start' | 'end'}>
      {fxTspans(text)}
    </text>
  )
}

/* Mono label — accepts the Fx mini-syntax */
function MLabel({ x, y, text, color = 'rgba(255,255,255,.5)', delay = 'd5', anchor = 'middle', size = 11.5 }:
  { x: number; y: number; text: string; color?: string; delay?: string; anchor?: string; size?: number }) {
  return (
    <text className={`rise ${delay}`} x={x} y={y} fill={color} fontSize={size}
      fontFamily="JetBrains Mono,monospace" textAnchor={anchor as 'middle' | 'start' | 'end'}>
      {fxTspans(text)}
    </text>
  )
}

/* Static (non-animated) mono label, for live readouts */
function RLabel({ x, y, text, color, size = 10.5, anchor = 'start' }:
  { x: number; y: number; text: string; color: string; size?: number; anchor?: string }) {
  return (
    <text x={x} y={y} fill={color} fontSize={size} fontFamily="JetBrains Mono,monospace"
      textAnchor={anchor as 'middle' | 'start' | 'end'}>
      {fxTspans(text)}
    </text>
  )
}

function Vec({ x1, y1, x2, y2, color, marker, delay = 'd1', width = 2.5, glow = true }:
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
function useDrag(onMove: (x: number, y: number, id: string) => void) {
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

function DragHandle({ x, y, onDown, color = RED }:
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
   reserved bands. The earlier versions let level curves, arrows and
   drag handles wander into the readout boxes; pinning the bands here
   makes that impossible by construction.

     header   y   8 …  46    formula chip
     stage    y  54 … 226    the drawing itself
     footer   y 234 … 292    live readout

   Anything drawn in the stage band must stay inside x 14 … 286 too,
   which is why the field radii below look like oddly specific numbers.
═══════════════════════════════════════════════════════════ */
const MID = 140          /* vertical centre of the stage band */

function Board({
  chip, chipSub, chipColor = GOLD,
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
                  <div style={{ color: 'rgba(255,255,255,.42)', fontSize: 8.4, marginTop: 1 }}>
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
            fill="rgba(0,0,0,.62)" stroke="rgba(255,255,255,.1)" strokeWidth=".8"/>
          {foot}
        </g>
      )}
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════
   ANIMATED SVG DIAGRAMS
═══════════════════════════════════════════════════════════ */

/* ── ∇ as a right-handed triad of derivative operators ── */
function NablaDiagram() {
  const t = useTick()
  const O = { x: 150, y: 142 }
  /* A genuine isometric triad, not an arbitrary spider: the same
     visual language as the cartesian axes in part A, so ∇'s three
     components read as real spatial directions. */
  const Xe = { x: O.x + 68, y: O.y + 38 }
  const Ye = { x: O.x - 68, y: O.y + 38 }
  const Ze = { x: O.x, y: O.y - 80 }
  const Far = { x: O.x, y: O.y + 76 }          /* far corner of the floor */

  const axes = [
    { label: '@{∂}{∂x}', tip: Xe, color: RED,   marker: 'aR',  lx: Xe.x + 26, ly: Xe.y + 14 },
    { label: '@{∂}{∂y}', tip: Ye, color: GREEN, marker: 'aGr', lx: Ye.x - 26, ly: Ye.y + 14 },
    { label: '@{∂}{∂z}', tip: Ze, color: BLUE,  marker: 'aB',  lx: Ze.x + 28, ly: Ze.y + 4  },
  ]

  const legend = [
    { op: '∇T', name: 'gradiente',   io: 'escalar → vector', color: RED },
    { op: '∇·A', name: 'divergencia', io: 'vector → escalar', color: GOLD },
    { op: '∇×A', name: 'rotacional',  io: 'vector → vector',  color: GREEN },
  ]

  return (
    <Board
      chip="∇ = *a*_x @{∂}{∂x} + *a*_y @{∂}{∂y} + *a*_z @{∂}{∂z}"
      chipSub="un operador vectorial — no es un vector"
      foot={legend.map((l, i) => (
        <g key={i}>
          <circle cx={22} cy={248 + i * 16} r="3" fill={l.color}/>
          <RLabel x={30} y={252 + i * 16} text={`${l.op}  ${l.name}`} color={l.color} size={9.4}/>
          <RLabel x={176} y={252 + i * 16} text={l.io} color="rgba(255,255,255,.42)" size={8.5}/>
        </g>
      ))}>

      {/* floor parallelogram, so the triad reads as 3-D */}
      <polygon className="pop d1" points={`${O.x},${O.y} ${Xe.x},${Xe.y} ${Far.x},${Far.y} ${Ye.x},${Ye.y}`}
        fill="rgba(255,255,255,.03)" stroke="rgba(255,255,255,.07)" strokeWidth="1"/>

      {axes.map((a, i) => {
        /* a bead runs out along each axis — "this slot holds a derivative" */
        const u = (t * 0.36 + i / 3) % 1
        const b = { x: O.x + (a.tip.x - O.x) * u, y: O.y + (a.tip.y - O.y) * u }
        return (
          <g key={i}>
            <Vec x1={O.x} y1={O.y} x2={a.tip.x} y2={a.tip.y} color={a.color} marker={a.marker} delay={`d${3 + i}`} width={2.6}/>
            <circle cx={b.x} cy={b.y} r="3" fill={a.color} opacity={0.75 * (1 - Math.abs(u * 2 - 1) * 0.6)}/>
            {/* h generous: a stacked fraction is ~2× a line box, and a
                foreignObject crops rather than overflows */}
            <FxHtml x={a.lx} y={a.ly} w={48} h={36} text={a.label} color={a.color} size={12}/>
          </g>
        )
      })}

      <Dot cx={O.x} cy={O.y}/>
      <MLabel x={150} y={228} text="tres derivadas parciales en un solo símbolo"
        color="rgba(255,255,255,.34)" delay="d8" size={9}/>
    </Board>
  )
}

/* ── Gradient: level curves of a Gaussian hill + steepest ascent ──
   T(r) = 5·exp(−(r/60)²), so |∇T| genuinely peaks where the level
   curves crowd together — which is the whole lesson of the slide. */
function GradientDiagram() {
  const t = useTick()
  const C = { x: 150, y: 132 }
  const R_MIN = 26, R_MAX = 68

  const [P, setP] = useState(() => ({ x: C.x + 48, y: C.y - 28 }))

  const { svgRef, handleMove, start, stop } = useDrag((x, y) => {
    const d = Math.hypot(x - C.x, y - C.y)
    const rr = Math.max(R_MIN, Math.min(R_MAX, d))
    const a = Math.atan2(y - C.y, x - C.x)
    setP({ x: C.x + rr * Math.cos(a), y: C.y + rr * Math.sin(a) })
  })

  const T = (rr: number) => 5 * Math.exp(-((rr / 60) ** 2))
  const gradMag = (rr: number) => 5 * (2 * rr / 3600) * Math.exp(-((rr / 60) ** 2))

  const r = Math.hypot(P.x - C.x, P.y - C.y)
  const ang = Math.atan2(P.y - C.y, P.x - C.x)
  const out = { x: Math.cos(ang), y: Math.sin(ang) }
  const up = { x: -out.x, y: -out.y }                    /* uphill = toward the peak */
  const tan = { x: -out.y, y: out.x }

  /* Scaled so the arrow is longest near r ≈ 42, where this hill really
     is steepest, and capped so it can never shoot past the summit —
     otherwise it reads as "a line to the top" instead of "the slope
     right here". */
  const gLen = Math.min(420 * gradMag(r), r * 0.6)
  const gTip = { x: P.x + up.x * gLen, y: P.y + up.y * gLen }
  const gMid = { x: P.x + up.x * gLen / 2, y: P.y + up.y * gLen / 2 }
  const gAng = Math.atan2(up.y, up.x)

  /* level curves for T = 4, 3, 2, 1 */
  const levels = [4, 3, 2, 1].map(v => ({ v, r: 60 * Math.sqrt(Math.log(5 / v)) }))

  /* One rival direction, climbing only cos(θ) of what ∇T climbs. Two
     of them crowded the ∇T label off its own arrow, and one already
     makes the point. */
  const decoys = [0.85].map(off => ({ off, a: gAng + off, f: Math.cos(off) }))

  return (
    <Board grab
      svgRef={svgRef} onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}
      chip="∇T = @{∂T}{∂x} *a*_x + @{∂T}{∂y} *a*_y + @{∂T}{∂z} *a*_z"
      chipSub="la dirección de máximo ascenso de T"
      foot={<>
        <RLabel x={26} y={252} text={`T(P) = ${T(r).toFixed(2)}`} color={GOLD}/>
        <RLabel x={166} y={252} text={`|∇T| = ${gradMag(r).toFixed(3)}`} color={RED}/>
        <RLabel x={26} y={268} text="∇T ⟂ curva de nivel · ninguna dirección sube más" color="rgba(255,255,255,.46)" size={8.4}/>
        <RLabel x={26} y={284} text="donde las curvas se juntan, |∇T| es mayor" color="rgba(255,255,255,.34)" size={8.4}/>
      </>}>

      <defs>
        <radialGradient id="gradHeat" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={GOLD} stopOpacity=".26"/>
          <stop offset="100%" stopColor={GOLD} stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx={C.x} cy={C.y} r="84" fill="url(#gradHeat)"/>

      {levels.map((lv, i) => (
        <g key={i}>
          <circle className="pop" style={dly(i)} cx={C.x} cy={C.y} r={lv.r}
            fill="none" stroke={GOLD} strokeOpacity={0.34 - i * 0.06} strokeWidth="1.1"/>
          {/* labels ride a 225° diagonal so they fan out instead of
              stacking in a column the way a fixed x would */}
          <RLabel x={C.x - lv.r * 0.707} y={C.y + lv.r * 0.707 + 3}
            text={`${lv.v}`} color="rgba(240,192,64,.5)" size={8.2} anchor="middle"/>
        </g>
      ))}

      {/* a bead riding the level curve through P: T never changes there */}
      <circle cx={C.x + r * Math.cos(t * 0.3)} cy={C.y + r * Math.sin(t * 0.3)}
        r="2.6" fill={GOLD} opacity=".6"/>

      <circle className="halo" cx={C.x} cy={C.y} fill="none" stroke={GOLD} strokeWidth="1.2"/>
      <circle cx={C.x} cy={C.y} r="3.5" fill={GOLD}/>

      {/* rival directions, labelled with how much of the climb they get */}
      {gLen > 17 && decoys.map((d, i) => {
        const L = gLen * Math.max(0.25, d.f)
        const tip = { x: P.x + Math.cos(d.a) * L, y: P.y + Math.sin(d.a) * L }
        return (
          <g key={i}>
            <line x1={P.x} y1={P.y} x2={tip.x} y2={tip.y}
              stroke="rgba(255,255,255,.3)" strokeWidth="1.5" markerEnd="url(#aW)" strokeDasharray="3 3"/>
            <RLabel x={tip.x + Math.cos(d.a) * 12} y={tip.y + Math.sin(d.a) * 12 + 3}
              text={`×${d.f.toFixed(2)}`} color="rgba(255,255,255,.4)" size={7.6} anchor="middle"/>
          </g>
        )
      })}

      {/* tangent to the level curve — the one direction where dT = 0 */}
      <line x1={P.x - tan.x * 28} y1={P.y - tan.y * 28} x2={P.x + tan.x * 28} y2={P.y + tan.y * 28}
        stroke={GREEN} strokeWidth="1.6" strokeDasharray="4 4" opacity=".55"/>
      <MLabel x={P.x + tan.x * 38} y={P.y + tan.y * 38 + 3} text="dT = 0" color={GREEN} delay="d6" size={9}/>

      <line x1={P.x} y1={P.y} x2={gTip.x} y2={gTip.y}
        stroke={RED} strokeWidth="2.6" markerEnd="url(#aR)" filter="url(#gR)" strokeLinecap="round"/>
      <VLabel x={gMid.x - out.y * 15} y={gMid.y + out.x * 15 + 4} text="∇T" color={RED} delay="d5" size={13}/>

      <DragHandle x={P.x} y={P.y} onDown={start()} color={BLUE}/>

      <MLabel x={150} y={222} text="T crece hacia el centro" color="rgba(255,255,255,.32)" delay="d8" size={8.6}/>
    </Board>
  )
}

/* ── Circulation: the conservative case beside the one that fails ── */
function CirculationDiagram() {
  const t = useTick()
  const L = { x: 82, y: 136 }, R = { x: 218, y: 136 }

  /* Left: a closed path whose radius wobbles with V(θ) = cos θ.
     It ends exactly where it started — that is ∮E·dL = 0. */
  const V = (a: number) => Math.cos(a)
  const N = 72
  const loop = Array.from({ length: N + 1 }, (_, i) => {
    const a = (i / N) * Math.PI * 2
    const rr = 40 + V(a) * 8
    return { x: L.x + rr * Math.cos(a), y: L.y + rr * Math.sin(a) }
  })
  const loopPath = 'M ' + loop.map(p => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ') + ' Z'

  const theta = ((t * 0.15) % 1) * Math.PI * 2
  const vNow = V(theta)
  const rNow = 40 + vNow * 8
  const P = { x: L.x + rNow * Math.cos(theta), y: L.y + rNow * Math.sin(theta) }
  const pc = vNow > 0.15 ? GOLD : vNow < -0.15 ? RED : '#fff'

  /* Right: a spiral that keeps drifting outward — every lap ends on a
     different value, so the closed-path integral cannot vanish. */
  const M = 110
  const spiral = Array.from({ length: M }, (_, i) => {
    const u = i / (M - 1)
    const a = u * Math.PI * 2 * 2.3
    const rr = 9 + u * 37
    return { x: R.x + rr * Math.cos(a), y: R.y + rr * Math.sin(a) }
  })
  const spiralPath = 'M ' + spiral.map(p => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' L ')
  const su = (t * 0.2) % 1
  const sp = spiral[Math.min(M - 1, Math.floor(su * (M - 1)))]

  return (
    <Board
      chip="∮ *A* · d*L*   sobre una curva cerrada"
      chipSub="¿el campo regresa al mismo valor?"
      foot={<>
        <RLabel x={26} y={252} text={`V(θ) = ${vNow.toFixed(2)}`} color={GOLD}/>
        <RLabel x={166} y={252} text="→ vuelve a V(0)" color="rgba(255,255,255,.45)" size={9}/>
        <RLabel x={26} y={268} text="Izquierda: cierra el lazo ⇒ trabajo neto cero" color="rgba(255,255,255,.44)" size={8.3}/>
        <RLabel x={26} y={284} text="Derecha: *F* = sen ϕ *a*_ϕ ⇒ ∮ = 2π sen ϕ₁ ≠ 0" color="rgba(255,255,255,.34)" size={8.3}/>
      </>}>

      <defs>
        <linearGradient id="circGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={GOLD}/>
          <stop offset="50%" stopColor={RED}/>
          <stop offset="100%" stopColor={GOLD}/>
        </linearGradient>
      </defs>

      <line x1="150" y1="62" x2="150" y2="216" stroke="rgba(255,255,255,.08)" strokeWidth="1" strokeDasharray="3 5"/>

      {/* ── conservative ── */}
      <MLabel x={L.x} y={72} text="conservativo" color={GOLD} delay="d1" size={10}/>
      <path className="pop d2" d={loopPath} fill="none" stroke="url(#circGrad)" strokeWidth="2.4" strokeLinejoin="round"/>
      <path className="ants" d={loopPath} fill="none" stroke="rgba(255,255,255,.16)" strokeWidth="1" strokeDasharray="4 6"/>
      {/* one marker only: the point the walk starts from and returns to */}
      <circle cx={L.x + 48} cy={L.y} r="3.2" fill="#fff" opacity=".95"/>
      <RLabel x={L.x + 36} y={L.y - 7} text="A" color="rgba(255,255,255,.55)" size={9} anchor="end"/>
      <RLabel x={L.x} y={L.y + 3} text="inicio = fin" color="rgba(255,255,255,.3)" size={7.6} anchor="middle"/>
      <circle cx={P.x} cy={P.y} r="11" fill={pc} opacity=".15"/>
      <circle cx={P.x} cy={P.y} r="4.5" fill={pc}/>
      <MLabel x={L.x} y={202} text="∮*E*·d*L* = 0" color={GOLD} delay="d4" size={10}/>

      {/* ── non-conservative ── */}
      <MLabel x={R.x} y={72} text="no conservativo" color={RED} delay="d1" size={10}/>
      <path className="pop d3" d={spiralPath} fill="none" stroke={RED} strokeWidth="1.9"
        strokeLinecap="round" markerEnd="url(#aR)" opacity=".85"/>
      <circle cx={R.x + 9} cy={R.y} r="3" fill="#fff" opacity=".9"/>
      <circle cx={sp.x} cy={sp.y} r="10" fill={RED} opacity=".14"/>
      <circle cx={sp.x} cy={sp.y} r="4" fill={RED}/>
      <MLabel x={R.x} y={202} text="∮*F*·d*L* ≠ 0" color={RED} delay="d5" size={10}/>
    </Board>
  )
}

/* ── Divergence: a source/sink whose strength you drag ── */
function DivergenceDiagram() {
  const t = useTick()
  const O = { x: 128, y: MID }
  const SL = { x: 256, y: MID, half: 58 }        /* slider geometry */
  const [s, setS] = useState(0.62)

  const { svgRef, handleMove, start, stop } = useDrag((_x, y) => {
    setS(Math.max(-1, Math.min(1, (SL.y - y) / SL.half)))
  })

  const N = 10
  const inner = 26
  const outer = inner + Math.abs(s) * 46

  const state = s > 0.12
    ? { txt: 'fuente   ∇·D > 0', c: GOLD }
    : s < -0.12
      ? { txt: 'sumidero   ∇·D < 0', c: RED }
      : { txt: 'incompresible   ∇·D = 0', c: GREEN }

  return (
    <Board grab
      svgRef={svgRef} onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}
      chip="∇·*A* = lím_{Δv→0} @{∮_S *A*·d*S*}{Δv}"
      chipSub="flujo neto que sale, por unidad de volumen"
      foot={<>
        <RLabel x={26} y={252} text={state.txt} color={state.c} size={11}/>
        <RLabel x={190} y={252} text={`∝ ${s.toFixed(2)}`} color="rgba(255,255,255,.45)" size={9}/>
        {/* misma terminología que el estado y el deslizador: fuente /
            sumidero, como en Hayt — no "manantial" y "desagüe" */}
        <circle cx={24} cy={265} r="3" fill={GOLD}/><RLabel x={32} y={268} text="fuente" color="rgba(255,255,255,.45)" size={8.4}/>
        <circle cx={100} cy={265} r="3" fill={GREEN}/><RLabel x={108} y={268} text="ni entra ni sale" color="rgba(255,255,255,.45)" size={8.4}/>
        <circle cx={210} cy={265} r="3" fill={RED}/><RLabel x={218} y={268} text="sumidero" color="rgba(255,255,255,.45)" size={8.4}/>
        <RLabel x={26} y={284} text="el resultado es un escalar: no lleva vectores unitarios" color="rgba(255,255,255,.34)" size={8.3}/>
      </>}>

      <circle className="ants" cx={O.x} cy={O.y} r={inner}
        fill={`${state.c}1a`} stroke={state.c} strokeWidth="1.2" strokeDasharray="4 3"/>
      <RLabel x={O.x} y={O.y + 17} text="ΔS" color="rgba(255,255,255,.45)" size={9} anchor="middle"/>

      {Array.from({ length: N }, (_, i) => {
        const a = (i / N) * Math.PI * 2
        const d = { x: Math.cos(a), y: Math.sin(a) }
        const A = { x: O.x + d.x * inner, y: O.y + d.y * inner }
        const B = { x: O.x + d.x * outer, y: O.y + d.y * outer }
        /* arrows point outward for a source, inward for a sink */
        const [x1, y1, x2, y2] = s >= 0 ? [A.x, A.y, B.x, B.y] : [B.x, B.y, A.x, A.y]
        const u = (t * 0.4 + i / N) % 1
        const fr = s >= 0 ? inner + (outer - inner) * u : outer - (outer - inner) * u
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={state.c} strokeWidth="2.2"
              markerEnd="url(#aG)" opacity={0.32 + 0.42 * Math.abs(s)} strokeLinecap="round"/>
            {Math.abs(s) > 0.08 && (
              <circle cx={O.x + d.x * fr} cy={O.y + d.y * fr} r="2.2" fill={state.c} opacity=".85"/>
            )}
          </g>
        )
      })}

      <circle cx={O.x} cy={O.y} r="6" fill={state.c} filter="url(#gG)"/>

      {/* slider: the tick marks make −1 / 0 / +1 read as real bounds */}
      <line x1={SL.x} y1={SL.y - SL.half} x2={SL.x} y2={SL.y + SL.half}
        stroke="rgba(255,255,255,.18)" strokeWidth="2" strokeLinecap="round"/>
      {[-1, 0, 1].map(v => (
        <line key={v} x1={SL.x - 6} y1={SL.y - v * SL.half} x2={SL.x + 6} y2={SL.y - v * SL.half}
          stroke="rgba(255,255,255,.3)" strokeWidth="1.4"/>
      ))}
      <RLabel x={SL.x} y={SL.y - SL.half - 12} text="fuente" color="rgba(255,255,255,.4)" size={8} anchor="middle"/>
      <RLabel x={SL.x} y={SL.y + SL.half + 18} text="sumidero" color="rgba(255,255,255,.4)" size={8} anchor="middle"/>
      <DragHandle x={SL.x} y={SL.y - s * SL.half} onDown={start()} color={BLUE}/>
    </Board>
  )
}

/* ── Curl: a rotating field turning a paddlewheel ── */
function CurlDiagram() {
  const t = useTick()
  const O = { x: 126, y: MID }
  const SL = { y: 224, x0: 46, x1: 206 }
  const mid = (SL.x0 + SL.x1) / 2, half = (SL.x1 - SL.x0) / 2
  const [w, setW] = useState(0.72)

  const { svgRef, handleMove, start, stop } = useDrag((x) => {
    setW(Math.max(-1, Math.min(1, (x - mid) / half)))
  })

  const sign = Math.sign(w) || 1
  /* SVG's y axis points down, so a naive tangent makes w > 0 spin
     *clockwise* on screen while the readout claims "antihorario" and
     the badge claims "sale de la página". Negating y puts what the
     student sees back in agreement with the right-hand rule. */
  const rings = [26, 46, 66]
  const arrows: { x: number; y: number; dx: number; dy: number; op: number }[] = []
  rings.forEach((rr, ri) => {
    const n = 6 + ri * 2
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 - t * 0.14 * sign
      const tg = { x: Math.sin(a), y: -Math.cos(a) }
      const mag = Math.abs(w) * (16 - ri * 2.5)
      arrows.push({
        x: O.x + rr * Math.cos(a), y: O.y + rr * Math.sin(a),
        dx: tg.x * mag * sign, dy: tg.y * mag * sign,
        op: 0.18 + 0.09 * ri,
      })
    }
  })

  const blades = [0, 1, 2, 3].map(i => -t * w * 2.1 + (i * Math.PI) / 2)
  const cc = w >= 0 ? GREEN : RED

  return (
    <Board grab
      svgRef={svgRef} onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}
      chip="(∇×*H*)·*a*_N = lím_{ΔS→0} @{∮ *H*·d*L*}{ΔS}"
      chipSub="circulación por unidad de área"
      footTop={246} footH={46}
      foot={<>
        <RLabel x={26} y={264} text={`|∇×H| ∝ ${Math.abs(w).toFixed(2)}`} color={GOLD}/>
        <RLabel x={166} y={264} text={w >= 0 ? 'giro antihorario' : 'giro horario'} color={cc} size={9}/>
        <RLabel x={26} y={280} text="un molinete puesto ahí giraría con el campo" color="rgba(255,255,255,.38)" size={8.3}/>
      </>}>

      {arrows.map((a, i) => (
        <line key={i} x1={a.x - a.dx / 2} y1={a.y - a.dy / 2} x2={a.x + a.dx / 2} y2={a.y + a.dy / 2}
          stroke={BLUE} strokeWidth="1.7" opacity={a.op + Math.abs(w) * 0.3}
          strokeLinecap="round" markerEnd={Math.abs(w) > 0.12 ? 'url(#aBs)' : undefined}/>
      ))}

      {/* A curved arrow spelling out the sense of rotation. It rides the
          top of the field, clear of both the paddlewheel and the slider —
          at the radius it used to have it sliced straight through them. */}
      {Math.abs(w) > 0.05 && (() => {
        const rr = 80
        const a0 = sign > 0 ? -Math.PI * 0.15 : -Math.PI * 0.85
        const a1 = sign > 0 ? -Math.PI * 0.85 : -Math.PI * 0.15
        const p0 = { x: O.x + rr * Math.cos(a0), y: O.y + rr * Math.sin(a0) }
        const p1 = { x: O.x + rr * Math.cos(a1), y: O.y + rr * Math.sin(a1) }
        return (
          <path d={`M ${p0.x} ${p0.y} A ${rr} ${rr} 0 0 ${sign > 0 ? 0 : 1} ${p1.x} ${p1.y}`}
            fill="none" stroke={GOLD} strokeWidth="1.8" strokeOpacity=".55" markerEnd="url(#aG)"/>
        )
      })()}

      {blades.map((b, i) => (
        <line key={i} x1={O.x} y1={O.y} x2={O.x + 20 * Math.cos(b)} y2={O.y + 20 * Math.sin(b)}
          stroke={GOLD} strokeWidth="3" strokeLinecap="round" filter="url(#gG)"/>
      ))}
      <circle cx={O.x} cy={O.y} r="5" fill={GOLD}/>

      {/* the curl vector itself: out of, or into, the page */}
      <RLabel x={252} y={86} text={w >= 0 ? 'sale de la página' : 'entra a la página'}
        color="rgba(255,255,255,.42)" size={7.4} anchor="middle"/>
      <circle cx={252} cy={110} r="16" fill={`${cc}22`} stroke={cc} strokeWidth="1.4"/>
      {w >= 0
        ? <circle cx={252} cy={110} r="4.5" fill={cc}/>
        : <g stroke={cc} strokeWidth="2.2">
            <line x1={245} y1={103} x2={259} y2={117}/><line x1={245} y1={117} x2={259} y2={103}/>
          </g>}
      <VLabel x={252} y={142} text="∇×*H*" color={cc} delay="d4" size={13}/>
      <RLabel x={252} y={164} text="mano derecha:" color="rgba(255,255,255,.3)" size={7.2} anchor="middle"/>
      <RLabel x={252} y={175} text="dedos siguen el giro," color="rgba(255,255,255,.3)" size={7.2} anchor="middle"/>
      <RLabel x={252} y={186} text="pulgar → ∇×H" color="rgba(255,255,255,.3)" size={7.2} anchor="middle"/>

      <line x1={SL.x0} y1={SL.y} x2={SL.x1} y2={SL.y}
        stroke="rgba(255,255,255,.18)" strokeWidth="2" strokeLinecap="round"/>
      {[-1, 0, 1].map(v => (
        <line key={v} x1={mid + v * half} y1={SL.y - 6} x2={mid + v * half} y2={SL.y + 6}
          stroke="rgba(255,255,255,.3)" strokeWidth="1.4"/>
      ))}
      <DragHandle x={mid + w * half} y={SL.y} onDown={start()} color={VIOLET}/>
    </Board>
  )
}

/* ── Laplacian: a point against the average of its neighbours,
      shown twice — as a star, and as the curvature of a slice ── */
function LaplacianDiagram() {
  const t = useTick()
  const O = { x: 88, y: 130 }
  const R = 42
  const dirs = [{ x: 1, y: 0 }, { x: 0, y: -1 }, { x: -1, y: 0 }, { x: 0, y: 1 }]
  const base = [0.9, 0.5, 1.1, 0.7]

  const center = 1.4 + 0.15 * Math.sin(t * 0.9)
  const nb = dirs.map((_, i) => base[i] + 0.35 * Math.sin(t * 0.7 + i * 1.7))
  const avg = nb.reduce((a, b) => a + b, 0) / nb.length
  const lap = avg - center
  const rad = (v: number) => 6 + v * 7

  /* the same three values as a 1-D slice: concavity you can see */
  const X0 = 172, W = 110, BASE = 196
  const toY = (v: number) => BASE - v * 28
  const vw = nb[2], ve = nb[0]
  const ctrl = 2 * center - (vw + ve) / 2              /* Bézier ctrl so the curve passes through `center` */
  const curve = `M ${X0} ${toY(vw)} Q ${X0 + W / 2} ${toY(ctrl)} ${X0 + W} ${toY(ve)}`

  return (
    <Board
      chip="∇^2V = ∇ · (∇V)"
      chipSub="compara V(P) con el promedio de sus vecinos"
      foot={<>
        <RLabel x={26} y={252} text={`∇²V ≈ V̄ − V(P) = ${lap >= 0 ? '+' : ''}${lap.toFixed(2)}`} color={lap >= 0 ? GREEN : RED}/>
        <RLabel x={26} y={268} text="verde: vecino por encima de V(P) · rojo: por debajo" color="rgba(255,255,255,.44)" size={8.3}/>
        <RLabel x={26} y={284} text="∇²V = 0 ⇒ V(P) es exactamente el promedio (Laplace)" color="rgba(255,255,255,.34)" size={8.3}/>
      </>}>

      {dirs.map((d, i) => (
        <line key={i} x1={O.x} y1={O.y} x2={O.x + d.x * R} y2={O.y + d.y * R}
          stroke="rgba(255,255,255,.12)" strokeWidth="1" strokeDasharray="3 4"/>
      ))}

      {dirs.map((d, i) => {
        const v = nb[i]
        const up = v > center
        const p = { x: O.x + d.x * R, y: O.y + d.y * R }
        /* labels sit radially outward from the centre: stacking them
           all above their dot put the south one straight on top of the
           centre's own caption */
        const off = rad(v) + 10
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={rad(v) + 5} fill={up ? GREEN : RED} opacity=".14"/>
            <circle cx={p.x} cy={p.y} r={rad(v)} fill={up ? GREEN : RED} opacity=".85"/>
            <RLabel x={p.x + d.x * off} y={p.y + d.y * off + 3}
              text={v.toFixed(2)} color={up ? GREEN : RED} anchor="middle" size={8.2}/>
          </g>
        )
      })}

      <circle cx={O.x} cy={O.y} r={rad(center) + 6} fill={GOLD} opacity=".18"/>
      <circle cx={O.x} cy={O.y} r={rad(center)} fill={GOLD} opacity=".95" filter="url(#gG)"/>
      <RLabel x={16} y={216} text={`V(P) = ${center.toFixed(2)}`} color={GOLD} size={9.2}/>

      {/* the slice */}
      <RLabel x={X0 + W / 2} y={126} text="corte O–E por P" color="rgba(255,255,255,.36)" size={8.6} anchor="middle"/>
      <line x1={X0 - 8} y1={BASE + 8} x2={X0 + W + 8} y2={BASE + 8} stroke="rgba(255,255,255,.14)" strokeWidth="1"/>
      <path d={curve} fill="none" stroke={lap >= 0 ? GREEN : RED} strokeWidth="2.2" strokeLinecap="round"/>
      <circle cx={X0} cy={toY(vw)} r="3" fill={vw > center ? GREEN : RED}/>
      <circle cx={X0 + W} cy={toY(ve)} r="3" fill={ve > center ? GREEN : RED}/>
      <circle cx={X0 + W / 2} cy={toY(center)} r="3.6" fill={GOLD}/>
      <RLabel x={X0} y={BASE + 20} text="O" color="rgba(255,255,255,.34)" size={8} anchor="middle"/>
      <RLabel x={X0 + W / 2} y={BASE + 20} text="P" color={GOLD} size={8} anchor="middle"/>
      <RLabel x={X0 + W} y={BASE + 20} text="E" color="rgba(255,255,255,.34)" size={8} anchor="middle"/>
      <RLabel x={X0 + W / 2} y={toY(center) + (lap >= 0 ? 17 : -11)}
        text={lap >= 0 ? 'cóncava ↑' : 'cóncava ↓'} color={lap >= 0 ? GREEN : RED} size={8.6} anchor="middle"/>
    </Board>
  )
}

/* ── Divergence theorem: sources inside ⟷ flux through the skin ── */
function DivergenceTheoremDiagram() {
  const t = useTick()
  const O = { x: 150, y: MID }
  const Rx = 86, Ry = 56
  const N = 12

  /* the half-step offset leaves a clean gap at the bottom of the
     ellipse, which is where the "S" label lives */
  const rim = Array.from({ length: N }, (_, i) => {
    const a = ((i + 0.5) / N) * Math.PI * 2
    return { a, x: O.x + Rx * Math.cos(a), y: O.y + Ry * Math.sin(a) }
  })

  const sources = [
    { x: O.x - 30, y: O.y - 8 }, { x: O.x + 22, y: O.y + 16 },
    { x: O.x - 6, y: O.y + 30 }, { x: O.x + 36, y: O.y - 20 },
    { x: O.x - 44, y: O.y + 22 },
  ]

  return (
    <Board
      chip="∮_S *D*·d*S* = ∫∫∫_V (∇·*D*) dv"
      chipSub="teorema de la divergencia (Ostrogradsky–Green)"
      foot={<>
        <RLabel x={26} y={252} text={`${sources.length} fuentes dentro de V`} color={GREEN} size={9.5}/>
        <RLabel x={166} y={252} text={`${N} flechas cruzan S`} color={RED} size={9.5}/>
        <RLabel x={26} y={268} text="una integral triple en V ⟷ una doble sobre S" color="rgba(255,255,255,.44)" size={8.3}/>
        <RLabel x={26} y={284} text="vale para cualquier campo vectorial, no solo *D*" color="rgba(255,255,255,.34)" size={8.3}/>
      </>}>

      <defs>
        <radialGradient id="dtFill" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={GOLD} stopOpacity=".12"/>
          <stop offset="100%" stopColor={GOLD} stopOpacity="0"/>
        </radialGradient>
      </defs>

      <ellipse cx={O.x} cy={O.y} rx={Rx} ry={Ry} fill="url(#dtFill)" stroke={GOLD} strokeWidth="1.4" strokeOpacity=".5"/>
      <ellipse className="ants" cx={O.x} cy={O.y} rx={Rx} ry={Ry} fill="none"
        stroke="rgba(255,255,255,.16)" strokeWidth="1" strokeDasharray="4 5"/>

      {sources.map((s, i) => {
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.4 + i)
        return (
          <g key={i}>
            <circle cx={s.x} cy={s.y} r={5 + pulse * 3} fill={GREEN} opacity={0.1 + pulse * 0.14}/>
            <circle cx={s.x} cy={s.y} r="3.2" fill={GREEN} opacity=".85"/>
            <line x1={s.x - 4} y1={s.y} x2={s.x + 4} y2={s.y} stroke="#07130a" strokeWidth="1.1"/>
            <line x1={s.x} y1={s.y - 4} x2={s.x} y2={s.y + 4} stroke="#07130a" strokeWidth="1.1"/>
          </g>
        )
      })}

      {rim.map((p, i) => {
        /* true outward normal of the ellipse, not the radial direction */
        const n = { x: Math.cos(p.a) / Rx, y: Math.sin(p.a) / Ry }
        const m = Math.hypot(n.x, n.y) || 1
        const d = { x: n.x / m, y: n.y / m }
        const u = (t * 0.5 + i / N) % 1
        return (
          <g key={i}>
            <line x1={p.x} y1={p.y} x2={p.x + d.x * 20} y2={p.y + d.y * 20}
              stroke={RED} strokeWidth="2" markerEnd="url(#aR)" opacity=".75"/>
            <circle cx={p.x + d.x * 20 * u} cy={p.y + d.y * 20 * u} r="1.8" fill={RED} opacity=".85"/>
          </g>
        )
      })}

      <VLabel x={O.x} y={O.y + 6} text="V" color={GREEN} delay="d2" size={15}/>
      <VLabel x={O.x} y={214} text="S" color={GOLD} delay="d3" size={13}/>
    </Board>
  )
}

/* ── Stokes: circulation on C ⟷ curl through any surface on C ── */
function StokesDiagram() {
  const t = useTick()
  const O = { x: 150, y: 178 }
  const Rx = 86, Ry = 26
  const N = 14

  /* Negative angle so that walking rim[i] → rim[i+1] reads as
     counter-clockwise on screen. With the naive +angle the beads ran
     clockwise while the caption promised "antihorario" and a_N pointed
     up — the right-hand rule then disagreed with the picture. */
  const rim = Array.from({ length: N }, (_, i) => {
    const a = -(i / N) * Math.PI * 2
    return { a, x: O.x + Rx * Math.cos(a), y: O.y + Ry * Math.sin(a) }
  })

  /* Two different caps on the same rim — the point of the slide. A
     cubic with both handles raised gives an actual dome; the quadratic
     version this replaces came out as a flat-topped trapezoid. */
  const cap = (h: number) => {
    const k = h * 1.333
    return `M ${O.x - Rx} ${O.y} C ${O.x - Rx} ${O.y - k} ${O.x + Rx} ${O.y - k} ${O.x + Rx} ${O.y} Z`
  }

  const swirls = [
    { x: O.x - 36, y: O.y - 40 }, { x: O.x + 2, y: O.y - 58 }, { x: O.x + 38, y: O.y - 38 },
  ]

  return (
    <Board
      chip="∮_C *H*·d*L* = ∫∫_S (∇×*H*)·d*S*"
      chipSub="teorema de Stokes"
      foot={<>
        <RLabel x={26} y={252} text="C antihorario ⇒ *a*_N hacia afuera (mano derecha)" color={GOLD} size={9}/>
        <RLabel x={26} y={268} text="cualquier superficie apoyada en C da el mismo resultado" color="rgba(255,255,255,.44)" size={8.3}/>
        <RLabel x={26} y={284} text="la cúpula punteada es otra S igual de válida" color="rgba(255,255,255,.34)" size={8.3}/>
      </>}>

      <defs>
        <linearGradient id="capFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={VIOLET} stopOpacity=".24"/>
          <stop offset="100%" stopColor={VIOLET} stopOpacity=".04"/>
        </linearGradient>
      </defs>

      {/* the alternative cap, drawn first and faint */}
      <path d={cap(32)} fill="none" stroke={VIOLET} strokeWidth="1.1" strokeOpacity=".35" strokeDasharray="4 4"/>
      <path d={cap(72)} fill="url(#capFill)" stroke={VIOLET} strokeWidth="1.3" strokeOpacity=".6"/>

      {swirls.map((p, i) => {
        const a = t * 1.6 + i
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="9" fill="none" stroke={VIOLET} strokeOpacity=".4" strokeWidth="1"/>
            <circle cx={p.x + 9 * Math.cos(a)} cy={p.y + 9 * Math.sin(a)} r="1.8" fill={VIOLET}/>
          </g>
        )
      })}

      <VLabel x={110} y={128} text="S" color={VIOLET} delay="d2" size={14}/>

      {/* outward normal — tied to C's direction by the right-hand rule */}
      <line x1={O.x} y1={O.y - 42} x2={O.x} y2={O.y - 80}
        stroke={VIOLET} strokeWidth="2" markerEnd="url(#aV)" opacity=".85"/>
      <VLabel x={O.x + 18} y={O.y - 66} text="*a*_N" color={VIOLET} delay="d3" size={11} anchor="start"/>

      <ellipse cx={O.x} cy={O.y} rx={Rx} ry={Ry} fill="none" stroke={GOLD} strokeWidth="1.7" strokeOpacity=".75"/>
      {rim.map((p, i) => {
        const nx = rim[(i + 1) % N]
        const u = (t * 0.42 + i / N) % 1
        return (
          <circle key={i} cx={p.x + (nx.x - p.x) * u} cy={p.y + (nx.y - p.y) * u} r="2" fill={GOLD} opacity=".85"/>
        )
      })}
      {[2, 9].map(i => {
        const p = rim[i], nx = rim[(i + 1) % N]
        const a = Math.atan2(nx.y - p.y, nx.x - p.x) * 180 / Math.PI
        return (
          <g key={i} transform={`translate(${p.x},${p.y}) rotate(${a})`}>
            <polygon points="0,-4 8,0 0,4" fill={GOLD}/>
          </g>
        )
      })}
      <VLabel x={O.x} y={O.y + 36} text="C" color={GOLD} delay="d4" size={13}/>
      <RLabel x={O.x} y={O.y + 50} text="borde cerrado" color="rgba(255,255,255,.36)" size={8.4} anchor="middle"/>
    </Board>
  )
}

/* ═══════════════════════════════════════════════════════════
   SLIDE DATA
═══════════════════════════════════════════════════════════ */
interface Act { n: string; title: string; range: string; desc: string; color: string }
interface Practice { code: string; q: string; a: string[] }

interface SD {
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
  image?: string
}

const ACTS: Act[] = [
  { n: '01', title: 'Los operadores', range: '§ 3.5 · 3.7 · 4.6 · 8.3', color: GOLD,
    desc: 'Nabla, gradiente, divergencia, rotacional y laplaciano: qué hace cada uno y sobre qué tipo de campo actúa.' },
  { n: '02', title: 'Propiedad del gradiente', range: '§ 4.5 – 4.6', color: BLUE,
    desc: 'Circulación nula de un campo conservativo, y la relación E = −∇V entre el campo y el potencial.' },
  { n: '03', title: 'Teoremas integrales', range: '§ 3.7 · 8.4', color: GREEN,
    desc: 'El teorema de la divergencia y el teorema de Stokes: de una integral sobre un contorno a una integral en el interior.' },
  { n: '04', title: 'Identidades y aplicación', range: 'Síntesis', color: VIOLET,
    desc: 'Las identidades que ligan a los cinco operadores entre sí, y problemas resueltos paso a paso.' },
]

const SLIDES: SD[] = [
  { id: 1, layout: 'cover', tag: 'MÓDULO 1 · PARTE B',
    title: 'Operadores\nDiferenciales',
    subtitle: 'Teoría Electromagnética I · Análisis vectorial, segunda parte',
    meta: 'Hayt & Buck · Teoría electromagnética · §3.5 – 3.7 · §4.5 – 4.6 · §7.4 · §8.3 – 8.4',
    image: IMG_SPIRAL },

  { id: 2, layout: 'agenda', tag: 'Ruta',
    title: 'Cómo se arma esta parte',
    body: 'Cuatro bloques. Primero se definen los operadores; después, dos teoremas los convierten en las ecuaciones de Maxwell en forma puntual.',
    acts: ACTS },

  { id: 3, layout: 'visual', tag: 'Introducción', section: 'Intro',
    title: '¿Por qué operadores diferenciales?',
    body: 'La primera parte armó el álgebra vectorial. Ahora ese álgebra se combina con el cálculo: hace falta describir cómo cambia un campo de un punto a otro.',
    items: [
      'La ley de Gauss y la ley circuital de Ampère se enuncian sobre superficies y contornos — su forma puntual necesita derivadas',
      'Nabla (∇) empaqueta esas derivadas en un solo operador, tratado formalmente como un vector',
      'Los teoremas de la divergencia y de Stokes son el puente entre la forma integral y la forma puntual de cada ecuación de Maxwell',
    ],
    image: IMG_ABSTRACT },

  { id: 4, layout: 'formula', tag: '§ 3.7', section: 'Nabla',
    title: 'El operador nabla ∇',
    body: 'Del mismo modo en que D/dx sustituye a d/dx en ecuaciones diferenciales, ∇ empaqueta las tres derivadas parciales cartesianas en un solo símbolo.',
    items: [
      '∇ = *a*_x @{∂}{∂x} + *a*_y @{∂}{∂y} + *a*_z @{∂}{∂z} — se trata como un vector ordinario, salvo que produce derivadas parciales en vez de productos',
      'No tiene una forma propia en cilíndricas ni esféricas: en esos sistemas cada operación (∇·, ∇, ∇×) se define por separado',
      'Sobre un escalar produce un vector (gradiente); "punteado" con un vector produce un escalar (divergencia); en producto cruz con un vector produce otro vector (rotacional)',
    ],
    note: 'Nabla no es un vector: es un operador. Solo tiene sentido cuando actúa sobre algo — un campo escalar o vectorial.',
    diagram: <NablaDiagram/> },

  { id: 5, layout: 'formula', tag: '§ 4.6', section: '4.6',
    title: 'El Gradiente',
    body: 'El gradiente de un escalar T es un vector que apunta hacia donde T crece más rápido, y cuya magnitud es esa máxima razón de cambio.',
    items: [
      'Piensa en T como la altura de un terreno: las curvas de nivel son donde T es constante, igual que en un mapa topográfico',
      'Moverse a lo largo de una curva de nivel no cambia T — por eso ∇T siempre resulta perpendicular a ella',
      'Cualquier otra dirección de salida desde un punto sube más lento que ∇T; ninguna es más empinada',
    ],
    formulas: [
      'grad T = ∇T = @{dT}{dN} *a*_N              (26)',
      '∇T = @{∂T}{∂x} *a*_x + @{∂T}{∂y} *a*_y + @{∂T}{∂z} *a*_z    (29)',
    ],
    fCaption: '*a*_N es normal a la superficie de nivel de T, en el sentido en que T aumenta.',
    diagram: <GradientDiagram/>, interactive: true,
    hint: 'Arrastra el punto azul sobre el campo' },

  { id: 6, layout: 'example', tag: 'Ejemplo 4.3', section: '4.6',
    title: 'Del potencial al campo eléctrico',
    given: 'V = 2x^2y − 5z,   evaluado en P(−4, 3, 6)',
    items: [
      'Potencial en P:  V_P = 2(−4)^2(3) − 5(6) = 66 V',
      'Gradiente:  ∇V = 4xy *a*_x + 2x^2 *a*_y − 5 *a*_z',
      'Campo eléctrico:  *E* = −∇V = −4xy *a*_x − 2x^2 *a*_y + 5 *a*_z',
      'En P:  *E*_P = 48*a*_x − 32*a*_y + 5*a*_z V/m',
    ],
    formulas: ['|*E*_P| = √(48^2 + (−32)^2 + 5^2) = 57.9 V/m'],
    fCaption: 'E apunta en sentido opuesto al de mayor crecimiento de V: hacia donde el potencial disminuye.',
    practice: {
      code: 'Comprobación',
      q: 'La relación general es *E* = −∇V. El signo negativo no es un detalle: es la razón por la que el campo eléctrico "cae" de + a −, igual que el agua fluye cuesta abajo.',
      a: [],
    } },

  { id: 7, layout: 'formula', tag: '§ 4.5', section: '4.5',
    title: 'Propiedad del gradiente: circulación',
    body: 'Un campo es conservativo cuando su integral de línea cerrada vale cero — el trabajo para ir y volver es siempre nulo.',
    items: [
      '∮ *E* · d*L* = 0   para cualquier trayectoria cerrada, en un campo conservativo',
      'El campo electrostático es conservativo: es la generalización vectorial de la ley de voltajes de Kirchhoff',
      'Contraejemplo: *F* = sen ϕ *a*_ϕ da ∮*F*·d*L* = 2π sen ϕ₁, que no es cero salvo para trayectorias particulares — ese campo no es conservativo',
    ],
    note: 'Más adelante, ∇×E = 0 será la versión puntual exacta de esta misma propiedad.',
    diagram: <CirculationDiagram/> },

  { id: 8, layout: 'formula', tag: 'Aplicación', section: '4.6',
    title: 'Relación entre el campo E y el potencial V',
    body: 'Combinando el gradiente con la propiedad conservativa se obtiene el resultado más usado del capítulo.',
    formulas: [
      '*E* = −grad V = −∇V              (30)',
    ],
    items: [
      'La magnitud de *E* es la máxima razón espacial de cambio de V',
      'La dirección de *E* es normal a las superficies equipotenciales, apuntando hacia donde V disminuye',
      'Si el gradiente de (V₁ − V₂) es cero en todas partes, entonces V₁ y V₂ difieren a lo sumo en una constante',
    ],
    fCaption: 'En coordenadas cilíndricas y esféricas, ∇V reemplaza cada d por una ∂ en la expresión de dL de ese sistema.' },

  { id: 9, layout: 'formula', tag: '§ 3.5', section: '3.5',
    title: 'La Divergencia',
    body: 'La divergencia de un campo tipo densidad de flujo A es el flujo neto que sale de una superficie cerrada, por unidad de volumen, cuando ese volumen tiende a cero.',
    items: [
      'El agua de una tina es incompresible: la misma cantidad entra y sale de cualquier superficie cerrada dentro de ella — su divergencia es cero',
      'El aire que escapa por un agujero en un tubo se expande: hay flujo neto saliendo de cualquier superficie que rodee ese punto — divergencia positiva',
      'Divergencia positiva marca una fuente; negativa, un sumidero; nunca lleva vectores unitarios en el resultado',
    ],
    formulas: [
      'div A = ∇ · A = lím_{Δv→0} @{∮_S *A* · d*S*}{Δv}        (13)',
      '∇ · *A* = @{∂A_x}{∂x} + @{∂A_y}{∂y} + @{∂A_z}{∂z}          (rectangular)',
    ],
    fCaption: 'Es una operación sobre un vector cuyo resultado es un escalar — igual que el producto punto.',
    diagram: <DivergenceDiagram/>, interactive: true,
    hint: 'Arrastra el punto azul: fuente ↔ sumidero' },

  { id: 10, layout: 'example', tag: 'Ejemplo 3.4', section: '3.5',
    title: 'Divergencia y densidad de carga',
    given: '*D* = e^{−x} sen y *a*_x − e^{−x} cos y *a*_y + 2z *a*_z',
    items: [
      '@{∂D_x}{∂x} = −e^{−x} sen y',
      '@{∂D_y}{∂y} = e^{−x} sen y',
      '@{∂D_z}{∂z} = 2',
      'div *D* = −e^{−x}sen y + e^{−x}sen y + 2 = 2  (constante, no depende del punto)',
    ],
    formulas: ['ρ_v = ∇ · *D* = 2 C/m³'],
    fCaption: 'La divergencia de D es directamente la densidad volumétrica de carga que la produce.',
    practice: {
      code: 'D3.7 (a)',
      q: 'Halla ∇·*D* en P(2, 3, −1) si *D* = (2xyz − y^2)*a*_x + (x^2z − 2xy)*a*_y + x^2y *a*_z C/m².',
      a: ['∇·*D* = 2yz − 2x', '∇·*D*|_P = 2(3)(−1) − 2(2) = −10.00'],
    } },

  { id: 11, layout: 'formula', tag: '§ 3.6', section: '3.6',
    title: 'Primera ecuación de Maxwell',
    body: 'Aplicando la divergencia a la densidad de flujo eléctrico se llega a la forma puntual de la ley de Gauss.',
    formulas: [
      '∇ · *D* = ρ_v              (20)',
    ],
    items: [
      'El flujo eléctrico que sale de un volumen unitario es exactamente la densidad de carga volumétrica encerrada',
      'Es la forma diferencial de la ley de Gauss: la integral se colapsó a un punto',
      'Para una carga puntual en el origen, div D = 0 en todas partes salvo en el origen, donde ρ_v es infinita',
    ],
    fCaption: 'Esta es la primera de las cuatro ecuaciones de Maxwell en su forma puntual.' },

  { id: 12, layout: 'formula', tag: '§ 8.3', section: '8.3',
    title: 'El Rotacional',
    body: 'El rotacional de H es un vector cuya componente en cualquier dirección a_N es la circulación de H por unidad de área, maximizada sobre la orientación de esa área.',
    items: [
      'Si H circula alrededor de un punto —como el campo magnético alrededor de un alambre con corriente— un pequeño molinete puesto ahí giraría',
      'El sentido del giro, por la regla de la mano derecha, da la dirección de ∇×H; su rapidez da la magnitud',
      'Un campo sin remolinos en ningún punto (como *E* electrostático) tiene rotacional cero en todas partes',
    ],
    formulas: [
      '(∇×*H*)·*a*_N = lím_{ΔS→0} @{∮ *H*·d*L*}{ΔS}               (rizo)',
      '∇×*H* = (@{∂H_z}{∂y} − @{∂H_y}{∂z})*a*_x + (@{∂H_x}{∂z} − @{∂H_z}{∂x})*a*_y + (@{∂H_y}{∂x} − @{∂H_x}{∂y})*a*_z',
    ],
    fCaption: 'Un rotacional distinto de cero indica que un pequeño molinete colocado en ese punto giraría.',
    diagram: <CurlDiagram/>, interactive: true,
    hint: 'Arrastra el control violeta' },

  { id: 13, layout: 'example', tag: 'Ejemplo', section: '8.3',
    title: 'Cálculo directo del rotacional',
    given: '*H* = 3y *a*_x + 2z *a*_y + x *a*_z',
    items: [
      '(∇×H)_x = @{∂H_z}{∂y} − @{∂H_y}{∂z} = 0 − 2 = −2',
      '(∇×H)_y = @{∂H_x}{∂z} − @{∂H_z}{∂x} = 0 − 1 = −1',
      '(∇×H)_z = @{∂H_y}{∂x} − @{∂H_x}{∂y} = 0 − 3 = −3',
    ],
    formulas: ['∇×*H* = −2*a*_x − *a*_y − 3*a*_z   (constante en todo el espacio)'],
    fCaption: 'El campo H no es conservativo: circula alrededor de este eje en todo punto.' },

  { id: 14, layout: 'formula', tag: '§ 7.4', section: '7.4',
    title: 'El Laplaciano',
    body: 'El laplaciano de un escalar es la divergencia de su gradiente: compara el valor en un punto con el promedio de sus vecinos inmediatos.',
    items: [
      'Donde ∇²V = 0 (ecuación de Laplace), V en cada punto es exactamente el promedio de sus vecinos — ni colina ni valle local',
      'Donde hay carga (ecuación de Poisson), V se "hunde" por debajo del promedio en las regiones con ρ_v positiva',
      'Es un escalar: mide curvatura, no dirección — por eso combina div (escalar) con grad (vector) y el resultado vuelve a ser escalar',
    ],
    formulas: [
      '∇^2V = ∇ · (∇V)              (4)',
      '∇^2V = @{∂^2V}{∂x^2} + @{∂^2V}{∂y^2} + @{∂^2V}{∂z^2}       (rectangular)      (8)',
      '∇^2V = −@{ρ_v}{ε}   (Poisson)     ·     ∇^2V = 0   (Laplace, ρ_v = 0)',
    ],
    fCaption: '∇²V > 0 indica un punto "por debajo" del promedio de su entorno; ∇²V < 0, un punto "por encima".',
    diagram: <LaplacianDiagram/> },

  { id: 15, layout: 'table', tag: 'Referencia', section: 'Op.',
    title: 'Los cinco operadores, de un vistazo',
    body: 'Qué recibe cada uno, qué entrega, y su forma cartesiana compacta.',
    tableHead: ['Operador', 'Entrada', 'Salida', 'Forma cartesiana'],
    tableRows: [
      ['∇', 'operador', 'operador', '*a*_x@{∂}{∂x} + *a*_y@{∂}{∂y} + *a*_z@{∂}{∂z}'],
      ['∇T (grad)', 'escalar', 'vector', '@{∂T}{∂x} *a*_x + @{∂T}{∂y} *a*_y + @{∂T}{∂z} *a*_z'],
      ['∇·A (div)', 'vector', 'escalar', '@{∂A_x}{∂x} + @{∂A_y}{∂y} + @{∂A_z}{∂z}'],
      ['∇×A (rot)', 'vector', 'vector', 'determinante 3×3 de derivadas'],
      ['∇²T (lap)', 'escalar', 'escalar', '@{∂^2T}{∂x^2} + @{∂^2T}{∂y^2} + @{∂^2T}{∂z^2}'],
    ],
    dense: true,
    note: 'Confundir la naturaleza escalar/vectorial de la salida es el error más común al empezar este tema.' },

  { id: 16, layout: 'table', tag: 'Referencia', section: 'Op.',
    title: 'Divergencia, gradiente y laplaciano por sistema',
    body: 'Las mismas tres operaciones, expresadas en cada sistema de coordenadas.',
    tableHead: ['', 'Cartesianas', 'Cilíndricas', 'Esféricas'],
    tableRows: [
      ['∇·A', '@{∂A_x}{∂x}+@{∂A_y}{∂y}+@{∂A_z}{∂z}', '@{1}{ρ}@{∂(ρA_ρ)}{∂ρ}+@{1}{ρ}@{∂A_ϕ}{∂ϕ}+@{∂A_z}{∂z}', '@{1}{r^2}@{∂(r^2A_r)}{∂r}+@{1}{r senθ}@{∂(A_θ senθ)}{∂θ}+@{1}{r senθ}@{∂A_ϕ}{∂ϕ}'],
      ['∇T', '@{∂T}{∂x}*a*_x+@{∂T}{∂y}*a*_y+@{∂T}{∂z}*a*_z', '@{∂T}{∂ρ}*a*_ρ+@{1}{ρ}@{∂T}{∂ϕ}*a*_ϕ+@{∂T}{∂z}*a*_z', '@{∂T}{∂r}*a*_r+@{1}{r}@{∂T}{∂θ}*a*_θ+@{1}{r senθ}@{∂T}{∂ϕ}*a*_ϕ'],
      ['∇²T', '@{∂^2T}{∂x^2}+@{∂^2T}{∂y^2}+@{∂^2T}{∂z^2}', '@{1}{ρ}@{∂}{∂ρ}(ρ@{∂T}{∂ρ})+@{1}{ρ^2}@{∂^2T}{∂ϕ^2}+@{∂^2T}{∂z^2}', '@{1}{r^2}@{∂}{∂r}(r^2@{∂T}{∂r})+…+@{1}{r^2sen^2θ}@{∂^2T}{∂ϕ^2}'],
    ],
    dense: true,
    note: 'Se derivan aplicando la definición de cada operador al elemento diferencial de volumen de ese sistema (Apéndice A).' },

  { id: 17, layout: 'formula', tag: '§ 3.7', section: '3.7',
    title: 'Teorema de la Divergencia',
    body: '(Ostrogradsky–Green) El flujo total que atraviesa una superficie cerrada equivale a la integral de la divergencia en todo el volumen que encierra.',
    formulas: [
      '∮_S *D* · d*S* = ∫∫∫_vol (∇ · *D*) dv              (22)',
    ],
    fCaption: 'Convierte una integral doble sobre S en una integral triple sobre el volumen que S encierra — y es válido para cualquier campo vectorial, no solo para D.',
    diagram: <DivergenceTheoremDiagram/> },

  { id: 18, layout: 'example', tag: 'Aplicación', section: '3.7',
    title: 'Forma puntual de la ley de Gauss',
    given: 'Ley de Gauss:  ∮_S *D* · d*S* = Q',
    items: [
      'Escribir Q como integral de volumen:  Q = ∫∫∫_vol ρ_v dv',
      'Aplicar el teorema de la divergencia al lado izquierdo:  ∮_S *D*·d*S* = ∫∫∫_vol (∇·*D*) dv',
      'Igualar ambos lados: ∫∫∫_vol (∇·*D*) dv = ∫∫∫_vol ρ_v dv, para cualquier volumen',
      'Como vale para todo volumen, los integrandos deben ser iguales punto a punto',
    ],
    formulas: ['∇ · *D* = ρ_v'],
    fCaption: 'Así se deriva la primera ecuación de Maxwell directamente del teorema de la divergencia, sin pasar por el límite de la sección 3.6.' },

  { id: 19, layout: 'formula', tag: '§ 8.4', section: '8.4',
    title: 'Teorema de Stokes',
    body: 'La circulación de un campo alrededor de un contorno cerrado C equivale al flujo de su rotacional a través de cualquier superficie S que tenga a C como borde.',
    formulas: [
      '∮_C *H* · d*L* = ∫∫_S (∇ × *H*) · d*S*',
    ],
    fCaption: 'S puede ser cualquier superficie abierta apoyada en C — plana o curva: el resultado no cambia mientras la orientación sea consistente con C por la regla de la mano derecha.',
    diagram: <StokesDiagram/> },

  { id: 20, layout: 'example', tag: 'Aplicación', section: '8.4',
    title: 'Forma puntual de la II Ecuación de Maxwell',
    given: 'Ley circuital de Ampère:  ∮_C *H* · d*L* = I_{enc} = ∫∫_S *J* · d*S*',
    items: [
      'Aplicar el teorema de Stokes al lado izquierdo:  ∮_C *H*·d*L* = ∫∫_S (∇×*H*)·d*S*',
      'Igualar ambos lados:  ∫∫_S (∇×*H*)·d*S* = ∫∫_S *J*·d*S*, para cualquier superficie S apoyada en C',
      'Como vale para toda superficie, los integrandos deben coincidir punto a punto',
    ],
    formulas: ['∇ × *H* = *J*'],
    fCaption: 'La segunda ecuación de Maxwell (caso estático): el rotacional de H en un punto es exactamente la densidad de corriente ahí.' },

  { id: 21, layout: 'concept', tag: 'Síntesis', section: 'Id.',
    title: 'Identidades con los operadores diferenciales',
    body: 'Dos son identidades puras — se cumplen siempre, sin importar el campo — y son la razón matemática detrás de dos propiedades físicas ya vistas.',
    items: [
      '∇ × (∇T) = 0 — el rotacional de cualquier gradiente es idénticamente cero; por eso *E* = −∇V garantiza ∮*E*·d*L* = 0',
      '∇ · (∇ × *A*) = 0 — la divergencia de cualquier rotacional es idénticamente cero; un campo rotacional puro no tiene fuentes',
      '∇²T = ∇ · (∇T) — el laplaciano es, por definición, la divergencia del gradiente',
      '∇ · (f*A*) = f(∇·*A*) + *A*·∇f — regla del producto para la divergencia',
      '∇ × (f*A*) = f(∇×*A*) + (∇f)×*A* — regla del producto para el rotacional',
      '∇ × (∇×*A*) = ∇(∇·*A*) − ∇²*A* — el doble rotacional, útil al derivar la ecuación de onda',
    ] },

  { id: 22, layout: 'pitfalls', tag: 'Advertencia',
    title: 'Los errores que sí cuestan puntos',
    body: 'Cinco confusiones que se repiten cada vez que se introducen estos operadores.',
    pitfalls: [
      ['Pensar que ∇ es un vector con existencia propia',
       'Es un operador: solo tiene sentido junto al escalar o vector sobre el que actúa'],
      ['Escribir la divergencia repartiendo *a*_x, *a*_y, *a*_z entre las derivadas',
       'div A es un escalar puro — no lleva vectores unitarios en el resultado'],
      ['Omitir los vectores unitarios en el gradiente',
       'El gradiente sí es un vector: al contrario que la divergencia, cada término los necesita'],
      ['Usar las fórmulas cartesianas de ∇· o ∇² en cilíndricas o esféricas',
       'Cada sistema tiene su propia expresión — no existe una forma de ∇ genérica'],
      ['Aplicar Stokes con una superficie que no comparte el borde C',
       'S debe apoyarse exactamente en C; cualquier superficie que lo haga da el mismo resultado'],
    ] },

  { id: 23, layout: 'example', tag: 'Problema de aplicación 1', section: 'App.',
    title: 'Verificar el teorema de Stokes',
    given: '*H* = y *a*_x   sobre un cuadrado de lado a = 2, en el plano xy, recorrido en sentido antihorario',
    items: [
      'Rotacional: ∇×*H* = (@{∂H_x}{∂y})(−*a*_z) = −*a*_z  (constante)',
      'Flujo de superficie: ∫∫_S(∇×*H*)·d*S* = −*a*_z · *a*_z · a^2 = −a^2 = −4',
      'Integral de línea, lado por lado: los tramos verticales no aportan (H_y = 0); el tramo inferior (y=0) tampoco aporta',
      'Solo el tramo superior (y = a, recorrido de x=a a x=0) aporta: ∫ a dx de a a 0 = −a^2 = −4',
    ],
    formulas: ['∮_C *H*·d*L* = −4  =  ∫∫_S (∇×*H*)·d*S*'],
    fCaption: 'Ambos lados coinciden: el teorema de Stokes se verifica para este contorno.' },

  { id: 24, layout: 'example', tag: 'Problema de aplicación 2', section: 'App.',
    title: 'Verificar el teorema de la divergencia',
    given: '*D* = 2r *a*_r  (esférico),  sobre una esfera de radio r = 3',
    items: [
      'Divergencia: ∇·*D* = @{1}{r^2}@{∂(r^2 · 2r)}{∂r} = @{1}{r^2}(6r^2) = 6',
      'Integral de volumen: ∫∫∫_vol (∇·*D*) dv = 6 · (4/3)π(3)^3 = 6 · 36π = 216π',
      'Integral de superficie: ∮_S *D*·d*S* = D_r(r=3) · 4π(3)^2 = 6 · 4π(9) = 216π',
    ],
    formulas: ['∮_S *D*·d*S* = 216π = ∫∫∫_vol (∇·*D*) dv'],
    fCaption: 'El mismo resultado por dos caminos — la superficie cerrada de una esfera y el volumen que encierra.' },

  { id: 25, layout: 'summary', tag: 'Resumen',
    title: 'Conceptos clave',
    items: [
      '§3.7  ∇ = *a*_x@{∂}{∂x}+*a*_y@{∂}{∂y}+*a*_z@{∂}{∂z} · operador, no vector',
      '§4.6  Gradiente ∇T · vector, máxima razón de cambio · *E* = −∇V',
      '§4.5  Campo conservativo · ∮E·dL = 0',
      '§3.5  Divergencia ∇·A · escalar, flujo neto por unidad de volumen',
      '§3.6  Primera ec. de Maxwell · ∇·D = ρ_v',
      '§8.3  Rotacional ∇×A · vector, circulación por unidad de área',
      '§8.4  Segunda ec. de Maxwell (estática) · ∇×H = J',
      '§7.4  Laplaciano ∇²T = ∇·(∇T) · ecuaciones de Poisson y Laplace',
      'Teoremas · Divergencia: ∮D·dS=∫∫∫∇·D dv  ·  Stokes: ∮H·dL=∫∫(∇×H)·dS',
    ],
    image: IMG_GRID },

  { id: 26, layout: 'end',
    title: 'Operadores\nDiferenciales',
    subtitle: 'Con esto, las cuatro ecuaciones de Maxwell ya pueden escribirse en forma puntual.\nLo que sigue es aplicarlas: campos electrostáticos, capítulo a capítulo.',
    image: IMG_BLUE },
]

/* Accent colour per section — the four acts of this part */
function accentFor(s: SD): string {
  const sec = s.section ?? ''
  if (sec === '4.5' || sec === '4.6') return BLUE
  if (sec === '3.7' || sec === '8.4' || sec === 'App.') return GREEN
  if (sec === 'Op.' || sec === 'Id.') return VIOLET
  return GOLD
}

function actLabel(s: SD): string | null {
  const sec = s.section ?? ''
  if (sec === 'Nabla' || sec === '3.5' || sec === '3.6' || sec === '8.3' || sec === '7.4') return 'Los operadores'
  if (sec === '4.5' || sec === '4.6') return 'Propiedad del gradiente'
  if (sec === '3.7' || sec === '8.4') return 'Teoremas integrales'
  if (sec === 'Op.' || sec === 'Id.' || sec === 'App.') return 'Identidades y aplicación'
  if (sec === 'Intro') return 'Introducción'
  return null
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
function flavourFor(layout: SD['layout']): 'slide' | 'zoom' | 'side' | 'flip' {
  if (layout === 'cover' || layout === 'end' || layout === 'summary') return 'zoom'
  if (layout === 'agenda' || layout === 'table' || layout === 'pitfalls') return 'side'
  if (layout === 'example') return 'flip'
  return 'slide'
}

export default function App() {
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
    setAnimCls(`${flavourFor(SLIDES[cur].layout)}-exit-${dir}`)
    setTimeout(() => {
      setCur(idx)
      setSlideKey(k => k + 1)
      setAnimCls(`${flavourFor(SLIDES[idx].layout)}-enter-${dir}`)
      setTimeout(() => { busy.current = false }, 700)
    }, 265)
  }, [cur])

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') goTo(cur + 1)
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') goTo(cur - 1)
      if (e.key === 'Home') goTo(0)
      if (e.key === 'End') goTo(SLIDES.length - 1)
      if (e.key === 'f' || e.key === 'F') toggleFs()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [goTo, cur, toggleFs])

  const slide = SLIDES[cur]
  const accent = accentFor(slide)
  const act = actLabel(slide)
  const pct = ((cur + 1) / SLIDES.length) * 100

  return (
    <div ref={stageRef} className="w-full h-full flex items-center justify-center"
      style={{ background: '#050505', fontFamily: "'Inter',system-ui,sans-serif" }}>
      <div style={{
        width: STAGE_W, height: STAGE_H,
        transform: `scale(${scale})`,
        position: 'relative',
        overflow: 'hidden',
        background: '#080808',
        flex: '0 0 auto',
      }}>

        {/* Ambient vector field, tinted by the current act */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ transition: 'opacity .8s ease', opacity: .9 }}>
          <AmbientField accent={accent}/>
        </div>

        {/* Ambient glow, drifting slowly behind everything */}
        <div className="absolute pointer-events-none drift-loop"
          style={{
            width: 820, height: 820, borderRadius: '50%',
            background: `radial-gradient(circle, ${accent}22 0%, transparent 70%)`,
            top: '50%', left: '50%', marginTop: -410, marginLeft: -410,
            transition: 'background .8s ease',
          }}/>
        <div className="absolute pointer-events-none drift-loop"
          style={{
            width: 520, height: 520, borderRadius: '50%',
            background: `radial-gradient(circle, ${accent}14 0%, transparent 70%)`,
            top: '22%', left: '74%', marginTop: -260, marginLeft: -260,
            animationDelay: '-4.5s', animationDuration: '13s',
            transition: 'background .8s ease',
          }}/>

        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 z-40" style={{ height: 3, background: 'rgba(255,255,255,.06)' }}>
          <div className="progress-fill h-full"
            style={{
              width: `${pct}%`,
              background: `linear-gradient(90deg, ${accent}aa, ${accent})`,
              transition: 'width .5s cubic-bezier(.22,1,.36,1), background .5s ease',
            }}/>
        </div>

        {/* Section pill */}
        {slide.section && (
          <div key={slide.section} className="absolute z-40 rise flex items-center gap-2"
            style={{ top: 26, left: 64 }}>
            <span style={{
              background: `${accent}22`, color: accent,
              fontSize: 11, fontWeight: 600, letterSpacing: '.22em',
              textTransform: 'uppercase', padding: '4px 11px', borderRadius: 4,
            }}>
              {slide.section}
            </span>
            {act && (
              <span style={{ color: 'rgba(255,255,255,.3)', fontSize: 11, letterSpacing: '.14em', textTransform: 'uppercase' }}>
                {act}
              </span>
            )}
          </div>
        )}

        {/* Counter + fullscreen toggle */}
        <div className="absolute z-40 flex items-center gap-4" style={{ top: 20, right: 56 }}
          onClick={e => e.stopPropagation()}>
          <div className="rise"
            style={{ color: 'rgba(255,255,255,.3)', fontSize: 12, letterSpacing: '.15em', fontFamily: 'JetBrains Mono,monospace' }}>
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

/* ── Shared micro-components ── */
function TagBadge({ text, accent }: { text: string; accent: string }) {
  return (
    <div className="rise inline-block" style={{
      ...dly(0),
      background: `${accent}22`, color: accent,
      fontSize: 11, fontWeight: 600, letterSpacing: '.22em', textTransform: 'uppercase',
      padding: '5px 12px', borderRadius: 4, marginBottom: 20, width: 'fit-content',
    }}>
      {text}
    </div>
  )
}

/* Word-by-word arrival. Each word is its own inline block so it can
   tip in on the X axis without disturbing the line box. */
function SHeading({ children, delay = 1, size }: { children: ReactNode; delay?: number; size: number }) {
  const lines = String(children).split('\n')
  let idx = 0
  return (
    <h2 className="title-glow" style={{
      fontFamily: "'Fraunces',Georgia,serif", color: '#fff',
      fontWeight: 900, letterSpacing: '-.03em', lineHeight: 1.03,
      fontSize: size, perspective: 900,
    }}>
      {lines.map((line, li) => (
        <span key={li} style={{ display: 'block' }}>
          {line.split(' ').map((w, wi) => (
            /* the space sits between the boxes so lines can still break */
            <Fragment key={wi}>
              <span className="word" style={dly(delay + idx++ * 0.85)}>{w}</span>{' '}
            </Fragment>
          ))}
        </span>
      ))}
    </h2>
  )
}

/* Title size adapts to length so long headings never wrap to three lines */
function titleSize(t: string): number {
  if (t.length > 42) return 34
  if (t.length > 30) return 40
  return 46
}

function Body({ text, delay = 2, width = 640 }: { text: string; delay?: number; width?: number }) {
  return (
    <p className="rise" style={{
      ...dly(delay),
      color: 'rgba(255,255,255,.62)', fontSize: 18, fontWeight: 300,
      lineHeight: 1.55, maxWidth: width,
    }}>
      <Fx s={text}/>
    </p>
  )
}

function FormulaBox({ lines, caption, delay, accent }:
  { lines: string[]; caption?: string; delay: number; accent: string }) {
  return (
    <div className="rise" style={{
      ...dly(delay),
      marginTop: 20, borderRadius: 10, padding: '18px 22px',
      background: 'rgba(255,255,255,.045)', borderLeft: `3px solid ${accent}`,
      color: accent,
      animationName: 'riseIn, borderGlow',
      animationDuration: '.65s, 4.5s',
      animationTimingFunction: 'cubic-bezier(.22,1,.36,1), ease-in-out',
      animationIterationCount: '1, infinite',
      animationFillMode: 'forwards, none',
    }}>
      {lines.map((l, i) => (
        <div key={i} className="wipe" style={{
          ...dly(delay + 1.4 + i * 1.5),
          color: '#efe9d2', fontFamily: 'JetBrains Mono,monospace',
          fontSize: 17, lineHeight: 1.85, whiteSpace: 'pre-wrap',
        }}>
          <Fx s={l}/>
        </div>
      ))}
      {caption && (
        <div style={{ marginTop: 12, fontSize: 13.5, color: 'rgba(255,255,255,.42)', lineHeight: 1.5 }}>
          <Fx s={caption}/>
        </div>
      )}
    </div>
  )
}

function NoteBar({ text, accent, delay = 9 }: { text: string; accent: string; delay?: number }) {
  return (
    <div className="rise" style={{
      ...dly(delay),
      marginTop: 16, padding: '11px 16px', borderRadius: 6, fontSize: 14,
      background: 'rgba(255,255,255,.03)', color: 'rgba(255,255,255,.5)',
      borderTop: '1px solid rgba(255,255,255,.07)', lineHeight: 1.5,
    }}>
      <span style={{ color: accent, marginRight: 8 }}>▸</span><Fx s={text}/>
    </div>
  )
}

function GivenBar({ text, accent, delay = 1 }: { text: string; accent: string; delay?: number }) {
  return (
    <div className="rise" style={{
      ...dly(delay),
      marginTop: 18, marginBottom: 4, padding: '12px 18px', borderRadius: 8,
      background: `${accent}14`, border: `1px solid ${accent}33`,
    }}>
      <div style={{ fontSize: 10.5, letterSpacing: '.2em', textTransform: 'uppercase', color: accent, marginBottom: 6 }}>
        Dado
      </div>
      <div style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 16, color: '#f2edd6', lineHeight: 1.6 }}>
        <Fx s={text}/>
      </div>
    </div>
  )
}

function PracticeCard({ p, accent, delay }: { p: Practice; accent: string; delay: number }) {
  return (
    <div className="rise" style={{
      ...dly(delay),
      marginTop: 18, padding: '14px 18px', borderRadius: 8,
      background: 'rgba(255,255,255,.028)', border: '1px solid rgba(255,255,255,.07)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{
          background: `${accent}22`, color: accent, fontFamily: 'JetBrains Mono,monospace',
          fontSize: 10.5, fontWeight: 600, padding: '2px 7px', borderRadius: 3,
        }}>{p.code}</span>
        <span style={{ fontSize: 10.5, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,.32)' }}>
          {p.a.length ? 'Problema de práctica' : 'Nota'}
        </span>
      </div>
      <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.62)', lineHeight: 1.55, marginBottom: p.a.length ? 9 : 0 }}>
        <Fx s={p.q}/>
      </div>
      {p.a.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 18px' }}>
          {p.a.map((ans, i) => (
            <span key={i} style={{
              fontFamily: 'JetBrains Mono,monospace', fontSize: 12.5, color: 'rgba(255,255,255,.45)',
            }}>
              <Fx s={ans}/>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/* Right column. Interactive diagrams get z-30 so the navigation
   click zones (z-20) do not swallow their pointer events. */
function RightPanel({ children, interactive, hint, accent }:
  { children: ReactNode; interactive?: boolean; hint?: string; accent: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full spring"
      style={{
        ...dly(2),
        flex: '0 0 470px',
        background: 'rgba(255,255,255,.018)',
        borderLeft: '1px solid rgba(255,255,255,.05)',
        position: 'relative',
        pointerEvents: interactive ? 'auto' : 'none',
      }}>
      <div style={{ width: 400, maxWidth: '88%' }}>{children}</div>
      {interactive && (
        <div className="rise" style={{
          ...dly(9),
          marginTop: 10, display: 'flex', alignItems: 'center', gap: 7,
          fontSize: 11.5, color: 'rgba(255,255,255,.42)',
          background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
          padding: '5px 12px', borderRadius: 999,
        }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: RED, display: 'inline-block' }}/>
          {hint ?? 'Arrastra el punto rojo'}
        </div>
      )}
      <div style={{ position: 'absolute', top: 0, left: 0, width: 1, height: '100%', background: `linear-gradient(to bottom, transparent, ${accent}44, transparent)` }}/>
    </div>
  )
}

/* ── Layouts ── */
function Cover({ s }: { s: SD }) {
  return (
    <div className="relative flex flex-col justify-end h-full" style={{ padding: '0 72px 92px' }}>
      {s.image && <>
        <img src={s.image} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'brightness(.22) saturate(.5)' }}/>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #080808 35%, rgba(8,8,8,.6) 70%, transparent)' }}/>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #080808 30%, transparent)' }}/>
      </>}
      <div className="relative z-10" style={{ maxWidth: 760 }}>
        {s.tag && (
          <div className="rise" style={{ ...dly(0), fontSize: 12, fontWeight: 600, letterSpacing: '.35em', textTransform: 'uppercase', color: GOLD, marginBottom: 28 }}>
            {s.tag}
          </div>
        )}
        <div className="rise" style={{ ...dly(1), width: 60, height: 3, background: GOLD, marginBottom: 26 }}/>
        <SHeading delay={2} size={104}>{s.title}</SHeading>
        {s.subtitle && (
          <p className="rise" style={{ ...dly(3), marginTop: 30, fontSize: 20, fontWeight: 300, color: 'rgba(255,255,255,.55)', maxWidth: 560, lineHeight: 1.5 }}>
            {s.subtitle}
          </p>
        )}
        {s.meta && (
          <p className="rise" style={{ ...dly(4), marginTop: 14, fontSize: 13, fontFamily: 'JetBrains Mono,monospace', color: 'rgba(255,255,255,.3)' }}>
            {s.meta}
          </p>
        )}
      </div>
      <div className="rise absolute pointer-events-none select-none"
        style={{ ...dly(0), right: 56, bottom: 60, fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900, color: 'rgba(255,255,255,.028)', fontSize: 300, lineHeight: .8, letterSpacing: '-.05em' }}>
        2
      </div>
      <div className="rise absolute" style={{ ...dly(6), left: 72, bottom: 52, fontSize: 12, color: 'rgba(255,255,255,.25)', letterSpacing: '.1em' }}>
        ← → para navegar · clic en cualquier lado para avanzar · F pantalla completa
      </div>
    </div>
  )
}

function Agenda({ s }: { s: SD }) {
  return (
    <div className="flex flex-col justify-center h-full" style={{ padding: '0 72px' }}>
      {s.tag && <TagBadge text={s.tag} accent={GOLD}/>}
      <SHeading size={46}>{s.title}</SHeading>
      {s.body && <div style={{ marginTop: 16 }}><Body text={s.body}/></div>}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 34 }}>
        {s.acts?.map((a, i) => (
          <div key={i} className="rise lift" style={{
            ...dly(i + 3),
            padding: '20px 22px', borderRadius: 12,
            background: `${a.color}0d`, border: `1px solid ${a.color}33`,
            display: 'flex', gap: 18, alignItems: 'flex-start',
            pointerEvents: 'auto',
          }}>
            <span style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900, fontSize: 34, color: a.color, lineHeight: 1, opacity: .85 }}>
              {a.n}
            </span>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
                <span style={{ fontSize: 19, fontWeight: 600, color: '#fff' }}>{a.title}</span>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12, color: a.color, opacity: .8 }}>{a.range}</span>
              </div>
              <div style={{ fontSize: 14.5, fontWeight: 300, color: 'rgba(255,255,255,.55)', lineHeight: 1.5 }}>{a.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Visual({ s, accent }: { s: SD; accent: string }) {
  return (
    <div className="relative flex h-full">
      <div className="flex flex-col justify-center z-10" style={{ flex: '0 0 58%', padding: '0 0 0 72px' }}>
        {s.tag && <TagBadge text={s.tag} accent={accent}/>}
        <SHeading size={titleSize(s.title)}>{s.title}</SHeading>
        {s.body && <div style={{ marginTop: 18, marginBottom: 26 }}><Body text={s.body} width={600}/></div>}
        {s.items && (
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {s.items.map((item, i) => (
              <li key={i} className="rise" style={{ ...dly(i + 3), display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <span style={{
                  flexShrink: 0, marginTop: 2, width: 24, height: 24,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: '50%', fontSize: 11.5, fontWeight: 700,
                  background: `${accent}22`, color: accent,
                }}>{i + 1}</span>
                <span style={{ fontSize: 17, fontWeight: 300, lineHeight: 1.5, color: 'rgba(255,255,255,.75)', maxWidth: 560 }}>
                  <Fx s={item}/>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
      {s.image && (
        <div className="absolute right-0 top-0 h-full" style={{ width: '46%', background: '#111' }}>
          <img src={s.image} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'brightness(.35) saturate(.5)' }}/>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #080808 0%, transparent 45%)' }}/>
        </div>
      )}
    </div>
  )
}

function Concept({ s, accent }: { s: SD; accent: string }) {
  const n = s.items?.length ?? 0
  return (
    <div className="flex flex-col justify-center h-full" style={{ padding: '0 72px' }}>
      <div style={{ maxWidth: 1000 }}>
        {s.tag && <TagBadge text={s.tag} accent={accent}/>}
        <SHeading size={titleSize(s.title)}>{s.title}</SHeading>
        {s.body && <div style={{ marginTop: 16 }}><Body text={s.body} width={760}/></div>}
        {s.items && (
          <ul style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {s.items.map((item, i) => (
              <li key={i} className="rise" style={{ ...dly(i + 3), display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <span style={{
                  flexShrink: 0, minWidth: 32, fontFamily: "'Fraunces',Georgia,serif",
                  fontWeight: 900, fontSize: 22, lineHeight: 1.2, color: accent, opacity: .9,
                }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: 17, fontWeight: 300, lineHeight: 1.55, color: 'rgba(255,255,255,.78)' }}>
                  <Fx s={item}/>
                </span>
              </li>
            ))}
          </ul>
        )}
        {s.formulas && <FormulaBox lines={s.formulas} caption={s.fCaption} delay={n + 4} accent={accent}/>}
        {s.practice && <PracticeCard p={s.practice} accent={accent} delay={n + 5}/>}
        {s.note && <NoteBar text={s.note} accent={accent} delay={n + 5}/>}
      </div>
    </div>
  )
}

function Formula({ s, accent }: { s: SD; accent: string }) {
  const hasDiag = !!s.diagram
  const n = s.items?.length ?? 0
  return (
    <div className="flex h-full">
      <div className="flex flex-col justify-center"
        style={{ flex: hasDiag ? '1 1 0' : '1', padding: hasDiag ? '0 40px 0 72px' : '0 72px', minWidth: 0 }}>
        {s.tag && <TagBadge text={s.tag} accent={accent}/>}
        <SHeading size={titleSize(s.title)}>{s.title}</SHeading>
        {s.body && <div style={{ marginTop: 14 }}><Body text={s.body} width={hasDiag ? 660 : 860}/></div>}
        {s.items && (
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
            {s.items.map((item, i) => (
              <li key={i} className="rise" style={{ ...dly(i + 3), display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{ flexShrink: 0, color: accent, fontSize: 16, lineHeight: 1.5 }}>→</span>
                <span style={{ fontSize: 16.5, fontWeight: 300, lineHeight: 1.5, color: 'rgba(255,255,255,.75)' }}>
                  <Fx s={item}/>
                </span>
              </li>
            ))}
          </ul>
        )}
        {s.formulas && <FormulaBox lines={s.formulas} caption={s.fCaption} delay={n + 4} accent={accent}/>}
        {s.note && <NoteBar text={s.note} accent={accent} delay={n + 5}/>}
      </div>
      {hasDiag && <RightPanel interactive={s.interactive} hint={s.hint} accent={accent}>{s.diagram}</RightPanel>}
    </div>
  )
}

function Example({ s, accent }: { s: SD; accent: string }) {
  const hasDiag = !!s.diagram
  const n = s.items?.length ?? 0
  return (
    <div className="flex h-full">
      <div className="flex flex-col justify-center"
        style={{ flex: hasDiag ? '1 1 0' : '1', padding: hasDiag ? '0 40px 0 72px' : '0 72px', minWidth: 0 }}>
        <div className="rise" style={{
          ...dly(0),
          width: 'fit-content', marginBottom: 16, padding: '5px 12px', borderRadius: 4,
          fontSize: 11, fontWeight: 600, letterSpacing: '.22em', textTransform: 'uppercase',
          background: `${accent}33`, color: accent,
        }}>
          {s.tag}
        </div>
        <SHeading size={titleSize(s.title)}>{s.title}</SHeading>
        {s.given && <GivenBar text={s.given} accent={accent} delay={2}/>}
        {s.items && (
          <ol style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 11 }}>
            {s.items.map((item, i) => (
              <li key={i} className="rise" style={{ ...dly(i + 3), display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <span style={{
                  flexShrink: 0, minWidth: 20, color: accent, fontWeight: 700,
                  fontFamily: 'JetBrains Mono,monospace', fontSize: 15,
                }}>{i + 1}.</span>
                <span style={{
                  fontSize: 15.5, lineHeight: 1.55, color: 'rgba(255,255,255,.8)',
                  fontFamily: 'JetBrains Mono,monospace',
                }}>
                  <Fx s={item}/>
                </span>
              </li>
            ))}
          </ol>
        )}
        {s.formulas && (
          <div className="rise" style={{
            ...dly(n + 4),
            marginTop: 18, borderRadius: 10, padding: '16px 22px',
            background: `${accent}12`, borderLeft: `3px solid ${accent}`,
          }}>
            {s.formulas.map((f, i) => (
              <div key={i} style={{ fontSize: 16.5, lineHeight: 1.8, color: '#f5f0d8', fontFamily: 'JetBrains Mono,monospace' }}>
                <Fx s={f}/>
              </div>
            ))}
            {s.fCaption && (
              <div style={{ marginTop: 10, fontSize: 13.5, color: 'rgba(255,255,255,.45)', lineHeight: 1.5 }}>
                <Fx s={s.fCaption}/>
              </div>
            )}
          </div>
        )}
        {s.practice && <PracticeCard p={s.practice} accent={accent} delay={n + 5}/>}
      </div>
      {hasDiag && <RightPanel interactive={s.interactive} hint={s.hint} accent={accent}>{s.diagram}</RightPanel>}
    </div>
  )
}

function TableSlide({ s, accent }: { s: SD; accent: string }) {
  const pad = s.dense ? '12px 16px' : '16px 26px'
  const fs = s.dense ? 13 : 16
  return (
    <div className="flex flex-col justify-center h-full" style={{ padding: '0 72px' }}>
      <div style={{ maxWidth: 1140 }}>
        {s.tag && <TagBadge text={s.tag} accent={accent}/>}
        <SHeading size={titleSize(s.title)}>{s.title}</SHeading>
        {s.body && <div style={{ marginTop: 14 }}><Body text={s.body} width={800}/></div>}
        {s.tableHead && s.tableRows && (
          <div className="rise" style={{
            ...dly(3), marginTop: 26, borderRadius: 12, overflow: 'hidden',
            border: '1px solid rgba(255,255,255,.1)',
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: `${accent}12` }}>
                  {s.tableHead.map((h, i) => (
                    <th key={i} style={{
                      padding: pad, textAlign: 'left', fontWeight: 600, fontSize: fs, color: accent,
                      borderBottom: '1px solid rgba(255,255,255,.1)',
                      fontFamily: 'JetBrains Mono,monospace',
                      width: i === 0 ? 96 : undefined,
                    }}>
                      <Fx s={h}/>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {s.tableRows.map((row, ri) => (
                  <tr key={ri} className="rise" style={{ ...dly(ri + 4), background: ri % 2 === 0 ? 'rgba(255,255,255,.022)' : 'transparent' }}>
                    {row.map((cell, ci) => (
                      <td key={ci} style={{
                        padding: pad, fontSize: fs,
                        color: ci === 0 ? accent : 'rgba(255,255,255,.82)',
                        borderBottom: '1px solid rgba(255,255,255,.05)',
                        fontFamily: 'JetBrains Mono,monospace',
                        whiteSpace: ci === 0 ? 'nowrap' : 'normal',
                        lineHeight: 1.5,
                      }}>
                        <Fx s={cell}/>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {s.note && <NoteBar text={s.note} accent={accent} delay={(s.tableRows?.length ?? 0) + 4}/>}
      </div>
    </div>
  )
}

function Pitfalls({ s }: { s: SD }) {
  return (
    <div className="flex flex-col justify-center h-full" style={{ padding: '0 72px' }}>
      {s.tag && <TagBadge text={s.tag} accent={RED}/>}
      <SHeading size={46}>{s.title}</SHeading>
      {s.body && <div style={{ marginTop: 14 }}><Body text={s.body} width={800}/></div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 26 }}>
        {s.pitfalls?.map(([wrong, right], i) => (
          <div key={i} className="rise" style={{
            ...dly(i + 3),
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0,
            borderRadius: 9, overflow: 'hidden', border: '1px solid rgba(255,255,255,.07)',
          }}>
            <div style={{ padding: '13px 18px', background: 'rgba(248,113,113,.06)', display: 'flex', gap: 11, alignItems: 'flex-start' }}>
              <span style={{ color: RED, fontSize: 15, lineHeight: 1.4, flexShrink: 0 }}>✕</span>
              <span style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.45, color: 'rgba(255,255,255,.66)' }}>
                <Fx s={wrong}/>
              </span>
            </div>
            <div style={{ padding: '13px 18px', background: 'rgba(74,222,128,.05)', display: 'flex', gap: 11, alignItems: 'flex-start', borderLeft: '1px solid rgba(255,255,255,.07)' }}>
              <span style={{ color: GREEN, fontSize: 15, lineHeight: 1.4, flexShrink: 0 }}>✓</span>
              <span style={{ fontSize: 15, fontWeight: 300, lineHeight: 1.45, color: 'rgba(255,255,255,.8)' }}>
                <Fx s={right}/>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Summary({ s }: { s: SD }) {
  return (
    <div className="relative flex flex-col justify-center h-full" style={{ padding: '0 72px' }}>
      {s.image && <>
        <img src={s.image} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'brightness(.13) saturate(.3)' }}/>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg,#080808 50%,rgba(8,8,8,.9))' }}/>
      </>}
      <div className="relative z-10" style={{ maxWidth: 1140 }}>
        {s.tag && (
          <div className="rise" style={{ ...dly(0), fontSize: 12, fontWeight: 600, letterSpacing: '.25em', textTransform: 'uppercase', color: GOLD, marginBottom: 18 }}>
            {s.tag}
          </div>
        )}
        <SHeading size={46}>{s.title}</SHeading>
        {s.items && (
          <div style={{ marginTop: 30, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {s.items.map((item, i) => (
              <div key={i} className="rise" style={{
                ...dly(i + 2),
                display: 'flex', alignItems: 'flex-start', gap: 13,
                padding: '13px 18px', borderRadius: 9,
                background: 'rgba(255,255,255,.045)', border: '1px solid rgba(255,255,255,.08)',
              }}>
                <span style={{ flexShrink: 0, fontSize: 12, fontWeight: 700, color: GOLD, fontFamily: 'JetBrains Mono,monospace', paddingTop: 2 }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: 14.5, fontWeight: 300, lineHeight: 1.5, color: 'rgba(255,255,255,.72)' }}>
                  <Fx s={item}/>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function End({ s }: { s: SD }) {
  return (
    <div className="relative flex flex-col justify-center h-full" style={{ padding: '0 72px' }}>
      {s.image && <>
        <img src={s.image} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'brightness(.17) saturate(.4)' }}/>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right,#080808 40%,transparent)' }}/>
      </>}
      <div className="relative z-10" style={{ maxWidth: 760 }}>
        <div className="rise" style={{ ...dly(0), width: 60, height: 3, background: GOLD, marginBottom: 40 }}/>
        <SHeading delay={1} size={92}>{s.title}</SHeading>
        {s.subtitle && (
          <p className="rise" style={{
            ...dly(2), marginTop: 34, fontSize: 20, fontWeight: 300, fontStyle: 'italic',
            fontFamily: "'Fraunces',Georgia,serif", color: 'rgba(255,255,255,.48)',
            maxWidth: 580, lineHeight: 1.6, whiteSpace: 'pre-line',
          }}>
            {s.subtitle}
          </p>
        )}
        <div className="rise" style={{ ...dly(3), marginTop: 48, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 2, background: GOLD }}/>
          <span style={{ fontSize: 11, letterSpacing: '.25em', textTransform: 'uppercase', fontWeight: 500, color: 'rgba(255,255,255,.28)' }}>
            Módulo 1 · Parte B completa
          </span>
        </div>
      </div>
    </div>
  )
}
