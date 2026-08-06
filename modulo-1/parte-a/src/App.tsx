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
     _x   _{xy}   → subscript
     ^2   ^{-1}   → superscript
     *A*          → bold (vector quantity, per Hayt's convention)
═══════════════════════════════════════════════════════════ */
interface FxPiece { text: string; sub?: boolean; sup?: boolean; bold?: boolean }

function parseFx(src: string): FxPiece[] {
  const out: FxPiece[] = []
  let bold = false
  let buf = ''
  let i = 0
  const flush = () => {
    if (buf) out.push({ text: buf, bold })
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
    if (c === '_' || c === '^') {
      const isSub = c === '_'
      i++
      let group = ''
      if (src[i] === '{') {
        i++
        while (i < src.length && src[i] !== '}') group += src[i++]
        i++
      } else if (i < src.length) {
        group = src[i]
        i++
      }
      flush()
      out.push({ text: group, bold, sub: isSub, sup: !isSub })
      continue
    }
    buf += c
    i++
  }
  flush()
  return out
}

/* HTML renderer */
function Fx({ s, style, className }: { s: string; style?: CSSProperties; className?: string }) {
  return (
    <span className={`fx ${className ?? ''}`} style={style}>
      {parseFx(s).map((p, i) => {
        const w = p.bold ? { fontWeight: 700 } : undefined
        if (p.sub) return <sub key={i} style={w}>{p.text}</sub>
        if (p.sup) return <sup key={i} style={w}>{p.text}</sup>
        return <span key={i} style={w}>{p.text}</span>
      })}
    </span>
  )
}

/* SVG renderer — <sub>/<sup> do not exist inside <text>, so the
   baseline is walked manually. dy is expressed in the tspan's own
   em, hence the division by the tspan's font scale. */
function fxTspans(src: string): ReactNode[] {
  let baseline = 0
  return parseFx(src).map((p, i) => {
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
      setT((now - start) / 1000)
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
      <filter id="gB" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="4" result="b"/><feFlood floodColor={BLUE} floodOpacity=".7" result="c"/>
        <feComposite in="c" in2="b" operator="in" result="g"/>
        <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="gR" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="4" result="b"/><feFlood floodColor={RED} floodOpacity=".7" result="c"/>
        <feComposite in="c" in2="b" operator="in" result="g"/>
        <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="gG" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="4" result="b"/><feFlood floodColor={GOLD} floodOpacity=".7" result="c"/>
        <feComposite in="c" in2="b" operator="in" result="g"/>
        <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <filter id="gGr" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="4" result="b"/><feFlood floodColor={GREEN} floodOpacity=".7" result="c"/>
        <feComposite in="c" in2="b" operator="in" result="g"/>
        <feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      <marker id="aB" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill={BLUE}/></marker>
      <marker id="aR" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill={RED}/></marker>
      <marker id="aG" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill={GOLD}/></marker>
      <marker id="aGr" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill={GREEN}/></marker>
      <marker id="aV" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill={VIOLET}/></marker>
      <marker id="aW" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto"><polygon points="0 0,8 3,0 6" fill="rgba(255,255,255,.5)"/></marker>
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

/* ── Vector Addition (both vectors draggable) ── */
function VectorAdditionDiagram() {
  const t = useTick()
  const O = { x: 52, y: 206 }

  /* Tips are held in the upper-right quadrant within a magnitude band.
     Capping each vector alone would force a band too narrow to feel
     responsive, so instead the *sum* is what gets kept in frame: the
     dragged vector is eased back only when A+B would run off. */
  const MIN = 28, MAX = 100
  const LO = -100 * Math.PI / 180, HI = 0
  const SAFE = { x0: 26, x1: 266, y0: 34, y1: 212 }

  const clampTip = (x: number, y: number) => {
    const ang = Math.min(HI, Math.max(LO, Math.atan2(y - O.y, x - O.x)))
    const mag = Math.min(MAX, Math.max(MIN, Math.hypot(x - O.x, y - O.y)))
    return { x: O.x + mag * Math.cos(ang), y: O.y + mag * Math.sin(ang) }
  }

  /* Shrink `tip` until O + tip + other lands inside SAFE. Converges
     because at k→0 the sum is just O + other, itself always in frame. */
  const settle = (tip: { x: number; y: number }, other: { x: number; y: number }) => {
    const v = { x: tip.x - O.x, y: tip.y - O.y }
    const w = { x: other.x - O.x, y: other.y - O.y }
    let k = 1
    for (let n = 0; n < 24; n++) {
      const rx = O.x + v.x * k + w.x, ry = O.y + v.y * k + w.y
      if (rx >= SAFE.x0 && rx <= SAFE.x1 && ry >= SAFE.y0 && ry <= SAFE.y1) break
      k *= 0.93
    }
    return { x: O.x + v.x * k, y: O.y + v.y * k }
  }

  const [aTip, setATip] = useState(() => clampTip(O.x + 84, O.y))
  const [bTip, setBTip] = useState(() => clampTip(O.x + 39, O.y - 63))

  const { svgRef, handleMove, start, stop } = useDrag((x, y, id) => {
    const p = clampTip(x, y)
    if (id === 'a') setATip(settle(p, bTip))
    else setBTip(settle(p, aTip))
  })

  const Av = { x: aTip.x - O.x, y: aTip.y - O.y }
  const Bv = { x: bTip.x - O.x, y: bTip.y - O.y }
  const R = { x: O.x + Av.x + Bv.x, y: O.y + Av.y + Bv.y }

  const magA = (Math.hypot(Av.x, Av.y) / U).toFixed(1)
  const magB = (Math.hypot(Bv.x, Bv.y) / U).toFixed(1)
  const magR = (Math.hypot(R.x - O.x, R.y - O.y) / U).toFixed(1)

  /* Pull each label off its own arrow so they never sit on the stroke */
  const off = (v: { x: number; y: number }, d: number) => {
    const m = Math.hypot(v.x, v.y) || 1
    return { x: -v.y / m * d, y: v.x / m * d }
  }
  const la = off(Av, 16), lb = off(Bv, -16), lr = off({ x: R.x - O.x, y: R.y - O.y }, 18)

  return (
    <svg ref={svgRef} viewBox="0 0 300 288" className="w-full h-full"
      style={{ userSelect: 'none' } as CSSProperties}
      onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}>
      <SharedDefs/>
      <rect width="100%" height="100%" fill="url(#grid20)"/>
      <line x1="30" y1={O.y} x2="272" y2={O.y} stroke="rgba(255,255,255,.18)" strokeWidth="1" markerEnd="url(#aW)"/>
      <line x1={O.x} y1="228" x2={O.x} y2="24" stroke="rgba(255,255,255,.18)" strokeWidth="1" markerEnd="url(#aW)"/>

      {/* Parallelogram, with the outline marching */}
      <polygon className="ants" points={`${O.x},${O.y} ${aTip.x},${aTip.y} ${R.x},${R.y} ${bTip.x},${bTip.y}`}
        fill="rgba(240,192,64,.07)" stroke="rgba(240,192,64,.22)" strokeWidth="1" strokeDasharray="5 3"/>

      {/* Head-to-tail ghosts: B moved onto A, and A moved onto B */}
      <line className="ants" x1={aTip.x} y1={aTip.y} x2={R.x} y2={R.y}
        stroke="rgba(248,113,113,.32)" strokeWidth="1.4" strokeDasharray="5 3" markerEnd="url(#aR)"/>
      <line className="ants" x1={bTip.x} y1={bTip.y} x2={R.x} y2={R.y}
        stroke="rgba(96,165,250,.32)" strokeWidth="1.4" strokeDasharray="5 3" markerEnd="url(#aB)"/>

      {/* Resultant, drawn first so the operands sit on top of it */}
      <line x1={O.x} y1={O.y} x2={R.x} y2={R.y}
        stroke={GOLD} strokeWidth="3.5" markerEnd="url(#aG)" filter="url(#gG)" strokeLinecap="round"/>
      <text x={(O.x + R.x) / 2 + lr.x} y={(O.y + R.y) / 2 + lr.y}
        fill={GOLD} fontSize="15" fontWeight="700" textAnchor="middle" fontFamily="Fraunces,serif">A+B</text>

      {/* A — draggable */}
      <line x1={O.x} y1={O.y} x2={aTip.x} y2={aTip.y}
        stroke={BLUE} strokeWidth="3" markerEnd="url(#aB)" filter="url(#gB)" strokeLinecap="round"/>
      <text x={(O.x + aTip.x) / 2 + la.x} y={(O.y + aTip.y) / 2 + la.y + 5}
        fill={BLUE} fontSize="16" fontWeight="700" textAnchor="middle" fontFamily="Fraunces,serif">A</text>

      {/* B — draggable */}
      <line x1={O.x} y1={O.y} x2={bTip.x} y2={bTip.y}
        stroke={RED} strokeWidth="3" markerEnd="url(#aR)" filter="url(#gR)" strokeLinecap="round"/>
      <text x={(O.x + bTip.x) / 2 + lb.x} y={(O.y + bTip.y) / 2 + lb.y + 5}
        fill={RED} fontSize="16" fontWeight="700" textAnchor="middle" fontFamily="Fraunces,serif">B</text>

      {/* Walker retracing the head-to-tail route O → A → A+B */}
      {(() => {
        const p = travel([O, aTip, R], (t * 0.28) % 1)
        return <Traveler x={p.x} y={p.y} color="#fff"/>
      })()}
      <circle className="halo" cx={R.x} cy={R.y} fill="none" stroke={GOLD} strokeWidth="1.4"/>

      <DragHandle x={aTip.x} y={aTip.y} onDown={start('a')} color={BLUE}/>
      <DragHandle x={bTip.x} y={bTip.y} onDown={start('b')} color={RED}/>

      {/* Live readout as a full-width footer, clear of the drawing area */}
      {/* Caption clears y=232: a horizontal A puts its own label at ~227 */}
      <MLabel x={150} y={242} text="Ley del paralelogramo · A + B = B + A" delay="d7" size={10.5}/>
      <rect x="10" y="250" width="280" height="32" rx="6"
        fill="rgba(0,0,0,.6)" stroke="rgba(255,255,255,.09)" strokeWidth=".8"/>
      <RLabel x={24} y={270} text={`|A| = ${magA}`} color={BLUE}/>
      <RLabel x={112} y={270} text={`|B| = ${magB}`} color={RED}/>
      <RLabel x={198} y={270} text={`|A+B| = ${magR}`} color={GOLD}/>

      <Dot cx={O.x} cy={O.y}/>
      <MLabel x={38} y={222} text="O" color="rgba(255,255,255,.4)" delay="d0"/>
    </svg>
  )
}

/* ── Cartesian Axes — true isometric ──
   Origin O=(145,175). Iso unit: x→(+26,+15), y→(−26,+15), z→(0,−30).
   P(1,2,3) therefore lands at (119,130). */
function CartesianAxesDiagram() {
  const t = useTick()
  const O = { x: 145, y: 175 }
  const iso = (xi: number, yi: number, zi = 0) => ({
    x: O.x + xi * 26 - yi * 26,
    y: O.y + xi * 15 + yi * 15 - zi * 30,
  })
  const Xe = iso(3, 0)
  const Ye = iso(0, 3)
  const Ze = iso(0, 0, 4)
  const P = iso(1, 2, 3)

  const gridX = [0, 1, 2, 3].map(j => ({ s: iso(0, j), e: iso(3, j) }))
  const gridY = [0, 1, 2, 3].map(i => ({ s: iso(i, 0), e: iso(i, 3) }))

  return (
    <svg viewBox="0 0 300 250" className="w-full h-full">
      <SharedDefs/>
      <defs>
        <linearGradient id="floorGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,.04)"/>
          <stop offset="100%" stopColor="rgba(255,255,255,.01)"/>
        </linearGradient>
      </defs>

      {/* Floor plane fill */}
      <polygon className="pop d1"
        points={`${iso(0, 0).x},${iso(0, 0).y} ${iso(3, 0).x},${iso(3, 0).y} ${iso(3, 3).x},${iso(3, 3).y} ${iso(0, 3).x},${iso(0, 3).y}`}
        fill="url(#floorGrad)" stroke="rgba(255,255,255,.06)" strokeWidth="1"/>

      {/* Floor grid */}
      {gridX.map((l, i) => (
        <line key={`gx${i}`} className="svg-draw d1"
          x1={l.s.x} y1={l.s.y} x2={l.e.x} y2={l.e.y}
          stroke="rgba(255,255,255,.09)" strokeWidth={i === 0 ? 1.2 : .6}
          style={{ strokeDasharray: 200, strokeDashoffset: 200 } as CSSProperties}/>
      ))}
      {gridY.map((l, i) => (
        <line key={`gy${i}`} className="svg-draw d1"
          x1={l.s.x} y1={l.s.y} x2={l.e.x} y2={l.e.y}
          stroke="rgba(255,255,255,.09)" strokeWidth={i === 0 ? 1.2 : .6}
          style={{ strokeDasharray: 200, strokeDashoffset: 200 } as CSSProperties}/>
      ))}

      {/* Tick marks */}
      {[1, 2, 3].map(i => (
        <line key={`tx${i}`} className="rise d2"
          x1={O.x + i * 26 - 2} y1={O.y + i * 15 - 4} x2={O.x + i * 26 + 2} y2={O.y + i * 15 + 4}
          stroke={RED} strokeWidth="1" opacity=".5"/>
      ))}
      {[1, 2, 3].map(i => (
        <line key={`ty${i}`} className="rise d2"
          x1={O.x - i * 26 - 2} y1={O.y + i * 15 - 4} x2={O.x - i * 26 + 2} y2={O.y + i * 15 + 4}
          stroke={GREEN} strokeWidth="1" opacity=".5"/>
      ))}
      {[1, 2, 3, 4].map(i => (
        <line key={`tz${i}`} className="rise d2"
          x1={O.x - 4} y1={O.y - i * 30} x2={O.x + 4} y2={O.y - i * 30}
          stroke={BLUE} strokeWidth="1" opacity=".5"/>
      ))}

      {/* Axes */}
      <Vec x1={O.x} y1={O.y} x2={Xe.x} y2={Xe.y} color={RED}   marker="aR"  delay="d1" width={2.5}/>
      <Vec x1={O.x} y1={O.y} x2={Ye.x} y2={Ye.y} color={GREEN} marker="aGr" delay="d2" width={2.5}/>
      <Vec x1={O.x} y1={O.y} x2={Ze.x} y2={Ze.y} color={BLUE}  marker="aB"  delay="d3" width={2.5}/>

      <VLabel x={Xe.x + 12} y={Xe.y + 5} text="x" color={RED}   delay="d2" anchor="start"/>
      <VLabel x={Ye.x - 12} y={Ye.y + 5} text="y" color={GREEN} delay="d3" anchor="end"/>
      <VLabel x={Ze.x + 8}  y={Ze.y - 2} text="z" color={BLUE}  delay="d4" anchor="start"/>

      {/* Position vector and projections to the axes */}
      <line className="svg-draw d5" x1={O.x} y1={O.y} x2={P.x} y2={P.y}
        stroke="rgba(255,255,255,.15)" strokeWidth="1.5"
        style={{ strokeDasharray: 120, strokeDashoffset: 120 } as CSSProperties}/>
      <line className="ants" x1={iso(1, 0).x} y1={iso(1, 0).y} x2={P.x} y2={P.y}
        stroke="rgba(248,113,113,.32)" strokeWidth="1" strokeDasharray="4 3"/>
      <line className="ants" x1={iso(0, 0, 3).x} y1={iso(0, 0, 3).y} x2={P.x} y2={P.y}
        stroke="rgba(96,165,250,.32)" strokeWidth="1" strokeDasharray="4 3"/>

      {/* Walker taking the route x → y → z that spells out P(1,2,3) */}
      {(() => {
        const p = travel([O, iso(1, 0), iso(1, 2), P], (t * 0.22) % 1)
        return <Traveler x={p.x} y={p.y} color="#fff" r={3.6}/>
      })()}
      <line className="ants-slow" x1={O.x} y1={O.y} x2={iso(1, 0).x} y2={iso(1, 0).y}
        stroke={RED} strokeWidth="2" strokeDasharray="3 4" opacity=".5"/>
      <line className="ants-slow" x1={iso(1, 0).x} y1={iso(1, 0).y} x2={iso(1, 2).x} y2={iso(1, 2).y}
        stroke={GREEN} strokeWidth="2" strokeDasharray="3 4" opacity=".5"/>
      <line className="ants-slow" x1={iso(1, 2).x} y1={iso(1, 2).y} x2={P.x} y2={P.y}
        stroke={BLUE} strokeWidth="2" strokeDasharray="3 4" opacity=".5"/>

      {/* Point P, bobbing gently */}
      <g style={{ transform: `translateY(${Math.sin(t * 1.1) * 2.4}px)` }}>
        <circle className="halo" cx={P.x} cy={P.y} fill="none" stroke={GOLD} strokeWidth="1.4"/>
        <circle className="pop d6" cx={P.x} cy={P.y} r="7" fill={GOLD} opacity=".95"/>
        <MLabel x={P.x + 12} y={P.y - 3} text="P(1,2,3)" color={GOLD} delay="d7" anchor="start"/>
      </g>

      <Dot cx={O.x} cy={O.y}/>
      <MLabel x={O.x - 14} y={O.y + 16} text="O" color="rgba(255,255,255,.4)" delay="d0"/>
      <MLabel x={150} y={242} text="Sistema de mano derecha" delay="d8"/>
    </svg>
  )
}

/* ── Vector Components ── */
function VectorComponentsDiagram() {
  const t = useTick()
  const O = { x: 50, y: 208 }, Bx = { x: 210, y: 208 }, By = { x: 50, y: 85 }, Btip = { x: 210, y: 85 }
  return (
    <svg viewBox="0 0 300 250" className="w-full h-full">
      <SharedDefs/>
      <rect width="100%" height="100%" fill="url(#grid20)"/>

      <polygon className="pop d3"
        points={`${O.x},${O.y} ${Bx.x},${Bx.y} ${Btip.x},${Btip.y} ${By.x},${By.y}`}
        fill="rgba(255,255,255,.04)" stroke="rgba(255,255,255,.08)" strokeWidth="1" strokeDasharray="5 3"/>

      <line className="svg-draw d0" x1={O.x} y1={O.y} x2="268" y2={O.y} stroke="rgba(255,255,255,.2)" strokeWidth="1.4" markerEnd="url(#aW)"
        style={{ strokeDasharray: 300, strokeDashoffset: 300 } as CSSProperties}/>
      <line className="svg-draw d0" x1={O.x} y1={O.y} x2={O.x} y2="20" stroke="rgba(255,255,255,.2)" strokeWidth="1.4" markerEnd="url(#aW)"
        style={{ strokeDasharray: 280, strokeDashoffset: 280 } as CSSProperties}/>
      <VLabel x={276} y={O.y + 4} text="x" color="rgba(255,255,255,.4)" delay="d1" anchor="start" size={13}/>
      <VLabel x={O.x + 8} y={18} text="y" color="rgba(255,255,255,.4)" delay="d1" anchor="start" size={13}/>

      {/* Projection dashes, marching towards the tip */}
      <line className="ants" x1={By.x} y1={By.y} x2={Btip.x} y2={Btip.y}
        stroke="rgba(255,255,255,.16)" strokeWidth="1.2" strokeDasharray="5 4"/>
      <line className="ants" x1={Bx.x} y1={Bx.y} x2={Btip.x} y2={Btip.y}
        stroke="rgba(255,255,255,.16)" strokeWidth="1.2" strokeDasharray="5 4"/>

      {/* The two components take turns lighting up, then B itself */}
      <Vec x1={O.x} y1={O.y} x2={Bx.x - 6} y2={Bx.y} color={RED} marker="aR" delay="d4" width={2.5}/>
      <line x1={O.x} y1={O.y} x2={Bx.x - 6} y2={Bx.y} stroke={RED} strokeWidth="4"
        strokeLinecap="round" opacity={0.55 * Math.max(0, Math.sin(t * 1.1))}/>
      <MLabel x={(O.x + Bx.x) / 2} y={O.y + 20} text="B_x a_x" color={RED} delay="d5"/>

      <Vec x1={O.x} y1={O.y} x2={By.x} y2={By.y + 6} color={GREEN} marker="aGr" delay="d5" width={2.5}/>
      <line x1={O.x} y1={O.y} x2={By.x} y2={By.y + 6} stroke={GREEN} strokeWidth="4"
        strokeLinecap="round" opacity={0.55 * Math.max(0, Math.sin(t * 1.1 - Math.PI / 2))}/>
      <MLabel x={O.x - 24} y={(O.y + By.y) / 2} text="B_y a_y" color={GREEN} delay="d6"/>

      <Vec x1={O.x} y1={O.y} x2={Btip.x - 6} y2={Btip.y + 6} color={GOLD} marker="aG" delay="d2" width={3.5}/>
      {/* Bead retracing B_x then B_y, arriving at the tip of B */}
      {(() => {
        const p = travel([O, Bx, Btip], (t * 0.24) % 1)
        return <Traveler x={p.x} y={p.y} color="#fff" r={3.4}/>
      })()}
      <circle className="halo" cx={Btip.x} cy={Btip.y} fill="none" stroke={GOLD} strokeWidth="1.4"/>
      <VLabel x={138} y={138} text="B" color={GOLD} delay="d3" size={17}/>

      {/* Right angle marks */}
      <path className="svg-draw d6" d={`M ${O.x} ${O.y - 16} L ${O.x + 16} ${O.y - 16} L ${O.x + 16} ${O.y}`}
        fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="1.2"
        style={{ strokeDasharray: 50, strokeDashoffset: 50 } as CSSProperties}/>
      <path className="svg-draw d6" d={`M ${Bx.x - 16} ${Bx.y} L ${Bx.x - 16} ${Bx.y - 16} L ${Bx.x} ${Bx.y - 16}`}
        fill="none" stroke="rgba(255,255,255,.22)" strokeWidth="1.2"
        style={{ strokeDasharray: 50, strokeDashoffset: 50 } as CSSProperties}/>

      <rect className="pop d7" x="52" y="12" width="202" height="32" rx="6"
        style={{ fill: 'rgba(240,192,64,.08)', stroke: GOLD, strokeWidth: .8, strokeOpacity: .35 }}/>
      <MLabel x={153} y={33} text="|B| = √(B_x^2 + B_y^2 + B_z^2)" color={GOLD} delay="d7"/>

      <Dot cx={O.x} cy={O.y}/>
      <MLabel x={O.x - 14} y={O.y + 18} text="O" color="rgba(255,255,255,.4)" delay="d0"/>
    </svg>
  )
}

/* ── Dot Product (interactive) ── */
function DotProductDiagram() {
  const t = useTick()
  const O = { x: 80, y: 162 }
  const lenA = 158, lenB = 100
  const [theta, setTheta] = useState(-0.82)

  const { svgRef, handleMove, start, stop } = useDrag((x, y) => {
    const a = Math.atan2(y - O.y, x - O.x)
    setTheta(Math.max(-Math.PI + 0.08, Math.min(-0.04, a)))
  })

  const cosT = Math.cos(theta)
  const Btip = { x: O.x + lenB * Math.cos(theta), y: O.y + lenB * Math.sin(theta) }
  const foot = { x: Btip.x, y: O.y }

  const arcR = 40
  const arcX = O.x + arcR * Math.cos(theta), arcY = O.y + arcR * Math.sin(theta)
  const sweep = theta < 0 ? 0 : 1
  const sectorPath = `M ${O.x} ${O.y} L ${O.x + arcR} ${O.y} A ${arcR} ${arcR} 0 0 ${sweep} ${arcX} ${arcY} Z`
  const arcPath = `M ${O.x + arcR} ${O.y} A ${arcR} ${arcR} 0 0 ${sweep} ${arcX} ${arcY}`

  const mid = theta / 2
  const tLx = O.x + (arcR + 18) * Math.cos(mid), tLy = O.y + (arcR + 18) * Math.sin(mid)

  const proj = lenB * cosT
  const projEnd = O.x + Math.max(0, Math.min(proj, lenA))

  const thetaDeg = Math.abs(theta * 180 / Math.PI).toFixed(0)
  const dotVal = ((lenA / U) * (lenB / U) * cosT).toFixed(1)

  return (
    <svg ref={svgRef} viewBox="0 0 300 266" className="w-full h-full"
      style={{ userSelect: 'none' } as CSSProperties}
      onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}>
      <SharedDefs/>
      <defs>
        <radialGradient id="dpSecGrad" cx="0%" cy="100%" r="100%">
          <stop offset="0%" stopColor={GOLD} stopOpacity=".3"/>
          <stop offset="100%" stopColor={GOLD} stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="dpProjGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={GREEN} stopOpacity=".6"/>
          <stop offset="100%" stopColor={GREEN} stopOpacity=".15"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid20)"/>

      <line x1={O.x - 20} y1={O.y} x2={O.x + lenA + 30} y2={O.y}
        stroke="rgba(255,255,255,.15)" strokeWidth="1" markerEnd="url(#aW)"/>

      <path d={sectorPath} fill="url(#dpSecGrad)" stroke="none"/>

      <line className="ants-fast" x1={Btip.x} y1={Btip.y} x2={foot.x} y2={foot.y}
        stroke="rgba(255,255,255,.22)" strokeWidth="1.3" strokeDasharray="5 4"/>
      <path d={`M ${foot.x - 10} ${foot.y} L ${foot.x - 10} ${foot.y - 10} L ${foot.x} ${foot.y - 10}`}
        fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="1.2"/>

      {proj > 6 && <>
        <rect x={O.x} y={O.y + 8} width={projEnd - O.x} height="12" rx="3" fill="url(#dpProjGrad)" opacity=".7"/>
        <line x1={O.x} y1={O.y + 20} x2={projEnd} y2={O.y + 20}
          stroke={GREEN} strokeWidth="2.5" markerEnd="url(#aGr)" filter="url(#gGr)" strokeLinecap="round"/>
        {/* A pulse running down the projection, showing it is a length on A */}
        <circle cx={O.x + ((t * 0.5) % 1) * (projEnd - O.x)} cy={O.y + 14} r="3.4" fill={GREEN} opacity=".85"/>
      </>}

      {/* Beads sliding along A, so the reference direction reads as a flow */}
      {[0, 1, 2].map(k => (
        <circle key={k} cx={O.x + (((t * 0.3 + k / 3) % 1)) * (lenA - 10)} cy={O.y}
          r="2.6" fill={BLUE} opacity=".55"/>
      ))}

      <path d={arcPath} fill="none" stroke={GOLD} strokeWidth="2.2" strokeLinecap="round"/>
      <text x={tLx} y={tLy + 4} fill={GOLD} fontSize="15" fontWeight="600"
        textAnchor="middle" fontFamily="Fraunces,serif">θ</text>

      <Vec x1={O.x} y1={O.y} x2={O.x + lenA - 8} y2={O.y} color={BLUE} marker="aB" delay="d1" width={3}/>
      <VLabel x={O.x + lenA + 14} y={O.y + 4} text="A" color={BLUE} delay="d2" anchor="start" size={17}/>

      <line x1={O.x} y1={O.y} x2={Btip.x} y2={Btip.y}
        stroke={RED} strokeWidth="3" markerEnd="url(#aR)" filter="url(#gR)" strokeLinecap="round"/>
      <text x={Btip.x + 9} y={Btip.y - 4} fill={RED} fontSize="16" fontWeight="700" fontFamily="Fraunces,serif">B</text>

      <DragHandle x={Btip.x} y={Btip.y} onDown={start()}/>

      <rect x="14" y="10" width="228" height="32" rx="7"
        style={{ fill: 'rgba(96,165,250,.08)', stroke: BLUE, strokeWidth: .8, strokeOpacity: .4 }}/>
      <MLabel x={128} y={31} text="A · B = |A||B| cos θ" color={BLUE} delay="d0" size={12.5}/>

      {/* Live readout as a full-width footer. On the right it used to
          swallow the "A" label and the projection bar. */}
      <MLabel x={150} y={206} text="A·B = A_xB_x + A_yB_y + A_zB_z" color="rgba(255,255,255,.35)" delay="d8" size={10.5}/>
      <rect x="10" y="216" width="280" height="44" rx="6"
        fill="rgba(0,0,0,.6)" stroke="rgba(255,255,255,.09)" strokeWidth=".8"/>
      <RLabel x={22} y={233} text="|A| = 7.9" color={BLUE}/>
      <RLabel x={104} y={233} text="|B| = 5.0" color={RED}/>
      <RLabel x={190} y={233} text={`θ = ${thetaDeg}°`} color={GOLD}/>
      <RLabel x={22} y={250} text={`cos θ = ${cosT.toFixed(3)}`} color={GOLD}/>
      <RLabel x={150} y={250} text={`A · B = ${dotVal}`} color={GREEN}/>

      <Dot cx={O.x} cy={O.y}/>
      <MLabel x={O.x - 14} y={O.y + 18} text="O" color="rgba(255,255,255,.4)" delay="d0"/>
    </svg>
  )
}

/* ── Cross Product (interactive) ── */
function CrossProductDiagram() {
  const t = useTick()
  const O = { x: 80, y: 195 }
  const lenA = 120, lenB = 90
  const [theta, setTheta] = useState(-1.05)

  const { svgRef, handleMove, start, stop } = useDrag((x, y) => {
    const a = Math.atan2(y - O.y, x - O.x)
    setTheta(Math.max(-Math.PI + 0.08, Math.min(-0.04, a)))
  })

  const sinAbs = Math.abs(Math.sin(theta))
  const Btip = { x: O.x + lenB * Math.cos(theta), y: O.y + lenB * Math.sin(theta) }
  const Atip = { x: O.x + lenA, y: O.y }
  const Rtip = { x: Atip.x + lenB * Math.cos(theta), y: Atip.y + lenB * Math.sin(theta) }

  const axbLen = 145 * sinAbs
  const axbTip = { x: O.x, y: O.y - axbLen }

  const arcR = 36
  const arcX = O.x + arcR * Math.cos(theta), arcY = O.y + arcR * Math.sin(theta)
  const sweep = theta < 0 ? 0 : 1
  const arcPath = `M ${O.x + arcR} ${O.y} A ${arcR} ${arcR} 0 0 ${sweep} ${arcX} ${arcY}`

  const mid = theta / 2
  const tLx = O.x + (arcR + 16) * Math.cos(mid), tLy = O.y + (arcR + 16) * Math.sin(mid)

  const thetaDeg = Math.abs(theta * 180 / Math.PI).toFixed(0)
  const area = ((lenA / U) * (lenB / U) * sinAbs).toFixed(1)

  return (
    <svg ref={svgRef} viewBox="0 0 300 240" className="w-full h-full"
      style={{ userSelect: 'none' } as CSSProperties}
      onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}>
      <SharedDefs/>
      <defs>
        <radialGradient id="cpAreaGrad" cx="20%" cy="100%" r="100%">
          <stop offset="0%" stopColor={GREEN} stopOpacity=".14"/>
          <stop offset="100%" stopColor={GREEN} stopOpacity=".02"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid20)"/>

      <polygon points={`${O.x},${O.y} ${Atip.x},${Atip.y} ${Rtip.x},${Rtip.y} ${Btip.x},${Btip.y}`}
        fill="url(#cpAreaGrad)" stroke={GREEN} strokeWidth=".7" strokeOpacity=".3"/>
      <text x={(O.x + Atip.x + Rtip.x + Btip.x) / 4} y={(O.y * 2 + Btip.y * 2) / 4 + 4}
        fill="rgba(255,255,255,.3)" fontSize="10" textAnchor="middle" fontFamily="JetBrains Mono,monospace">
        Área = {area}
      </text>

      <line className="ants" x1={Atip.x} y1={Atip.y} x2={Rtip.x} y2={Rtip.y}
        stroke="rgba(255,255,255,.12)" strokeWidth="1.1" strokeDasharray="4 4"/>
      <line className="ants" x1={Btip.x} y1={Btip.y} x2={Rtip.x} y2={Rtip.y}
        stroke="rgba(255,255,255,.12)" strokeWidth="1.1" strokeDasharray="4 4"/>

      {/* Right-hand rule: a curl running from A round to B, over and over */}
      {(() => {
        const u = (t * 0.45) % 1
        const a = u * theta
        const rr = 22
        return (
          <circle cx={O.x + rr * Math.cos(a)} cy={O.y + rr * Math.sin(a)}
            r="3" fill={GOLD} opacity={0.9 * (1 - Math.abs(u * 2 - 1) * 0.55)}/>
        )
      })()}

      <path d={arcPath} fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round"/>
      <text x={tLx} y={tLy + 4} fill={GOLD} fontSize="15" fontWeight="600"
        textAnchor="middle" fontFamily="Fraunces,serif">θ</text>

      <Vec x1={O.x} y1={O.y} x2={Atip.x - 8} y2={Atip.y} color={BLUE} marker="aB" delay="d1" width={3}/>
      <VLabel x={Atip.x + 14} y={Atip.y + 4} text="A" color={BLUE} delay="d2" anchor="start" size={17}/>

      <line x1={O.x} y1={O.y} x2={Btip.x} y2={Btip.y}
        stroke={RED} strokeWidth="3" markerEnd="url(#aR)" filter="url(#gR)" strokeLinecap="round"/>
      <text x={Btip.x - 12} y={Btip.y - 8} fill={RED} fontSize="16" fontWeight="700"
        textAnchor="middle" fontFamily="Fraunces,serif">B</text>

      {axbLen > 8 && <>
        <line x1={O.x} y1={O.y} x2={axbTip.x} y2={axbTip.y}
          stroke={GREEN} strokeWidth="3.5" markerEnd="url(#aGr)" filter="url(#gGr)" strokeLinecap="round"/>
        {/* Pulse climbing A×B, reading as "out of the plane" */}
        <circle cx={O.x} cy={O.y - ((t * 0.6) % 1) * axbLen} r="3.6" fill={GREEN}
          opacity={0.9 * (1 - ((t * 0.6) % 1))}/>
        <circle className="halo" cx={axbTip.x} cy={axbTip.y} fill="none" stroke={GREEN} strokeWidth="1.4"/>
        <text x={axbTip.x + 10} y={axbTip.y + 4}
          fill={GREEN} fontSize="13" fontWeight="700" fontFamily="JetBrains Mono,monospace">A×B</text>
      </>}
      <path d="M 80 185 L 90 185 L 90 195" fill="none" stroke={GREEN} strokeWidth="1.3" opacity=".4"/>

      <DragHandle x={Btip.x} y={Btip.y} onDown={start()}/>

      <rect x="146" y="40" width="146" height="32" rx="7"
        style={{ fill: 'rgba(74,222,128,.07)', stroke: GREEN, strokeWidth: .8, strokeOpacity: .4 }}/>
      <MLabel x={219} y={61} text="A×B = a_n|A||B| sen θ" color={GREEN} delay="d7" size={12}/>

      <rect x="146" y="78" width="146" height="54" rx="6"
        fill="rgba(0,0,0,.6)" stroke="rgba(255,255,255,.09)" strokeWidth=".8"/>
      <RLabel x={154} y={96} text={`θ = ${thetaDeg}°`} color={GOLD}/>
      <RLabel x={154} y={111} text={`|sen θ| = ${sinAbs.toFixed(3)}`} color={GOLD}/>
      <RLabel x={154} y={126} text={`|A×B| = ${area}`} color={GREEN}/>

      <Dot cx={O.x} cy={O.y}/>
    </svg>
  )
}

/* ── Cylindrical Coords ── */
function CylindricalDiagram() {
  const t = useTick()
  const O = { x: 145, y: 200 }
  const RX = 85, RY = 22, H = 100

  /* P travels around the cylinder so that ρ stays fixed while ϕ runs.
     a_ρ follows it, which is exactly the point of the next slide. */
  const phi = t * 0.5
  const cP = Math.cos(phi), sP = Math.sin(phi)
  const foot = { x: O.x + RX * cP, y: O.y + RY * sP }          /* on the base rim */
  const P = { x: foot.x, y: foot.y - H }                        /* on the top rim */
  /* Outward radial direction in the flattened projection */
  const rn = Math.hypot(RX * cP, RY * sP) || 1
  const ur = { x: (RX * cP) / rn, y: (RY * sP) / rn }
  /* ϕ arc on the base, from +x round to P */
  const arcEnd = { x: O.x + 40 * cP, y: O.y + 10 * sP }
  const arcSweep = phi % (2 * Math.PI) > Math.PI ? 1 : 0
  const arcPath = `M ${O.x + 40} ${O.y} A 40 10 0 ${arcSweep} 1 ${arcEnd.x} ${arcEnd.y}`

  return (
    <svg viewBox="0 0 300 260" className="w-full h-full">
      <SharedDefs/>
      <defs>
        <linearGradient id="cylFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={BLUE} stopOpacity=".18"/>
          <stop offset="100%" stopColor={BLUE} stopOpacity=".03"/>
        </linearGradient>
        <radialGradient id="cylSide" cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor={BLUE} stopOpacity=".12"/>
          <stop offset="100%" stopColor={BLUE} stopOpacity=".02"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid20)"/>

      <ellipse cx={O.x} cy={O.y} rx="85" ry="22"
        fill="rgba(96,165,250,.04)" stroke={BLUE} strokeWidth="1" strokeOpacity=".2"/>

      <path
        d={`M ${O.x - 85} ${O.y} L ${O.x - 85} ${O.y - 100} A 85 22 0 0 0 ${O.x} ${O.y - 122} L ${O.x} ${O.y - 100} A 85 22 0 0 1 ${O.x - 85} ${O.y}`}
        fill="url(#cylSide)" stroke="none"/>

      <line className="svg-draw d1" x1={O.x - 85} y1={O.y} x2={O.x - 85} y2={O.y - 100}
        stroke={BLUE} strokeWidth="1.2" strokeOpacity=".3"
        style={{ strokeDasharray: 120, strokeDashoffset: 120 } as CSSProperties}/>
      <line className="svg-draw d1" x1={O.x + 85} y1={O.y} x2={O.x + 85} y2={O.y - 100}
        stroke={BLUE} strokeWidth="1.2" strokeOpacity=".3"
        style={{ strokeDasharray: 120, strokeDashoffset: 120 } as CSSProperties}/>

      <ellipse className="svg-draw d2" cx={O.x} cy={O.y - 100} rx="85" ry="22"
        fill="url(#cylFill)" stroke={BLUE} strokeWidth="1.4" strokeOpacity=".45"
        style={{ strokeDasharray: 440, strokeDashoffset: 440 } as CSSProperties}/>

      <Vec x1={O.x} y1={O.y + 40} x2={O.x} y2={22} color={BLUE} marker="aB" delay="d0" width={2.5}/>
      <VLabel x={O.x + 10} y={20} text="z" color={BLUE} delay="d1" anchor="start"/>

      <line className="svg-draw d5" x1={O.x} y1={O.y} x2={O.x} y2={O.y - 100}
        stroke="rgba(96,165,250,.3)" strokeWidth="1" strokeDasharray="4 3"
        style={{ strokeDasharray: 110, strokeDashoffset: 110 } as CSSProperties}/>
      <MLabel x={O.x - 12} y={O.y - 48} text="z" color="rgba(96,165,250,.6)" delay="d6" anchor="end"/>

      {/* ρ radial on the base, following P */}
      <line x1={O.x} y1={O.y} x2={foot.x - ur.x * 4} y2={foot.y - ur.y * 4}
        stroke={RED} strokeWidth="2.5" markerEnd="url(#aR)" filter="url(#gR)" strokeLinecap="round"/>
      <VLabel x={(O.x + foot.x) / 2} y={(O.y + foot.y) / 2 + 18} text="ρ" color={RED} delay="d4"/>

      {/* ϕ arc on the base, growing with P */}
      <path d={arcPath}
        fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round"/>
      <VLabel x={O.x + 30 * Math.cos(phi / 2) + 6} y={O.y + 14 * Math.sin(phi / 2) - 8}
        text="ϕ" color={GOLD} delay="d5"/>

      {/* Base point, vertical rise to P, and the diagonal from O */}
      <circle cx={foot.x} cy={foot.y} r="3.5" fill={RED} opacity=".75"/>
      <line className="ants" x1={foot.x} y1={foot.y} x2={P.x} y2={P.y}
        stroke="rgba(96,165,250,.45)" strokeWidth="1.2" strokeDasharray="4 4"/>
      <line className="ants" x1={O.x} y1={O.y} x2={P.x} y2={P.y}
        stroke="rgba(255,255,255,.14)" strokeWidth="1" strokeDasharray="5 4"/>

      {/* P on the top rim */}
      <circle className="halo" cx={P.x} cy={P.y} fill="none" stroke={GOLD} strokeWidth="1.5"/>
      <circle cx={P.x} cy={P.y} r="4.5" fill={GOLD}/>
      <MLabel x={P.x + 12} y={P.y - 6} text="P(ρ,ϕ,z)" color={GOLD} delay="d7" anchor="start"/>

      {/* Unit vectors riding along with P */}
      <line x1={P.x} y1={P.y} x2={P.x} y2={P.y - 34} stroke={BLUE} strokeWidth="2"
        markerEnd="url(#aB)" strokeLinecap="round"/>
      <MLabel x={P.x + 8} y={P.y - 38} text="a_z" color={BLUE} delay="d9" anchor="start"/>
      <line x1={P.x} y1={P.y} x2={P.x + ur.x * 32} y2={P.y + ur.y * 32} stroke={RED} strokeWidth="2"
        markerEnd="url(#aR)" strokeLinecap="round"/>
      <MLabel x={P.x + ur.x * 44} y={P.y + ur.y * 44 + 4} text="a_ρ" color={RED} delay="d9"/>

      <Dot cx={O.x} cy={O.y}/>
    </svg>
  )
}

/* ── Curvilinear unit vectors are not constant ── */
function VaryingUnitVectorsDiagram() {
  const t = useTick()
  const O = { x: 152, y: 140 }
  const R = 76
  /* The three stations orbit continuously — watching a_ρ and a_ϕ
     swing around is the whole point of this slide. */
  const spin = t * 16
  const stations = [
    { deg: 35 + spin, label: true },
    { deg: 118 + spin, label: true },
    { deg: 215 + spin, label: false },
  ]
  return (
    <svg viewBox="0 0 300 250" className="w-full h-full">
      <SharedDefs/>
      <rect width="100%" height="100%" fill="url(#grid20)"/>

      {/* Reference axes of the plane z = cte */}
      <line x1={O.x - 118} y1={O.y} x2={O.x + 118} y2={O.y} stroke="rgba(255,255,255,.13)" strokeWidth="1" markerEnd="url(#aW)"/>
      <line x1={O.x} y1={O.y + 100} x2={O.x} y2={O.y - 118} stroke="rgba(255,255,255,.13)" strokeWidth="1" markerEnd="url(#aW)"/>
      <MLabel x={O.x + 124} y={O.y + 4} text="x" color="rgba(255,255,255,.35)" delay="d0" anchor="start" size={11}/>
      <MLabel x={O.x + 7} y={O.y - 122} text="y" color="rgba(255,255,255,.35)" delay="d0" anchor="start" size={11}/>

      {/* Circle ρ = cte, with the dashes marching around it */}
      <circle className="ants" cx={O.x} cy={O.y} r={R}
        fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="1" strokeDasharray="4 5"/>
      <circle cx={O.x} cy={O.y} r={R} fill="none" stroke={GOLD} strokeWidth="1"
        strokeDasharray="3 340" strokeDashoffset={-(R * 2 * Math.PI) * ((t * 0.267) % 1)}
        opacity=".5"/>

      {stations.map((st, i) => {
        const t = st.deg * Math.PI / 180
        const ux = Math.cos(t), uy = -Math.sin(t)       /* a_ρ direction (screen y is inverted) */
        const tx = -Math.sin(t), ty = -Math.cos(t)      /* a_ϕ direction */
        const P = { x: O.x + R * ux, y: O.y + R * uy }
        const L = 34
        const d = `d${3 + i * 2}`
        return (
          <g key={i}>
            <line className="rise" style={dly(3 + i * 2)}
              x1={O.x} y1={O.y} x2={P.x} y2={P.y}
              stroke="rgba(255,255,255,.14)" strokeWidth="1" strokeDasharray="3 3"/>
            <Vec x1={P.x} y1={P.y} x2={P.x + L * ux} y2={P.y + L * uy} color={RED} marker="aR" delay={d} width={2.4}/>
            <Vec x1={P.x} y1={P.y} x2={P.x + L * tx} y2={P.y + L * ty} color={GOLD} marker="aG" delay={d} width={2.4}/>
            <circle className="pop" style={dly(3 + i * 2)} cx={P.x} cy={P.y} r="4" fill="#fff" opacity=".8"/>
            {st.label && <>
              <MLabel x={P.x + L * ux * 1.34 + 4} y={P.y + L * uy * 1.34 + 4}
                text="a_ρ" color={RED} delay={`d${4 + i * 2}`} anchor="middle" size={12}/>
              <MLabel x={P.x + L * tx * 1.36} y={P.y + L * ty * 1.36 + 4}
                text="a_ϕ" color={GOLD} delay={`d${4 + i * 2}`} anchor="middle" size={12}/>
            </>}
          </g>
        )
      })}

      <Dot cx={O.x} cy={O.y}/>

      {/* Contrast: the cartesian triad never moves */}
      <rect className="pop d8" x="8" y="196" width="128" height="46" rx="7"
        fill="rgba(96,165,250,.07)" stroke={BLUE} strokeWidth=".8" strokeOpacity=".35"/>
      <MLabel x={72} y={212} text="a_x  a_y  a_z" color={BLUE} delay="d9" size={12}/>
      <MLabel x={72} y={230} text="iguales en todo punto" color="rgba(255,255,255,.4)" delay="d9" size={9.5}/>

      <rect className="pop d8" x="160" y="196" width="132" height="46" rx="7"
        fill="rgba(240,192,64,.07)" stroke={GOLD} strokeWidth=".8" strokeOpacity=".35"/>
      <MLabel x={226} y={212} text="a_ρ  a_ϕ" color={GOLD} delay="d9" size={12}/>
      <MLabel x={226} y={230} text="giran con ϕ" color="rgba(255,255,255,.4)" delay="d9" size={9.5}/>
    </svg>
  )
}

/* ── Spherical Coords ── */
function SphericalDiagram() {
  const t = useTick()
  const cx = 148, cy = 142, R = 84
  const FLAT = 0.24   /* the same flattening used to draw the equator */

  /* P sweeps in ϕ while θ breathes, so both angles are always visible
     in motion. Projection matches how the equator ellipse is drawn:
     x = cx + R senθ cosϕ ,  y = cy − R cosθ + R senθ senϕ · FLAT */
  const phi = t * 0.55
  const th = 1.02 + 0.34 * Math.sin(t * 0.37)
  const sT = Math.sin(th), cT = Math.cos(th)
  const rP = R * 0.86
  const P = {
    x: cx + rP * sT * Math.cos(phi),
    y: cy - rP * cT + rP * sT * Math.sin(phi) * FLAT,
  }
  /* Foot of P on the equatorial plane, for the drop lines */
  const F = { x: P.x, y: cy + rP * sT * Math.sin(phi) * FLAT }
  /* θ arc from +z round to r */
  const ar = 38
  const aEnd = {
    x: cx + ar * sT * Math.cos(phi),
    y: cy - ar * cT + ar * sT * Math.sin(phi) * FLAT,
  }
  const thetaArc = `M ${cx} ${cy - ar} A ${ar} ${ar} 0 0 1 ${aEnd.x} ${aEnd.y}`
  /* ϕ arc on the equator */
  const pe = { x: cx + 30 * Math.cos(phi), y: cy + 30 * Math.sin(phi) * FLAT }
  const phiSweep = phi % (2 * Math.PI) > Math.PI ? 1 : 0
  const phiArc = `M ${cx + 30} ${cy} A 30 ${30 * FLAT} 0 ${phiSweep} 1 ${pe.x} ${pe.y}`

  return (
    <svg viewBox="0 0 300 260" className="w-full h-full">
      <SharedDefs/>
      <defs>
        <radialGradient id="spGrad" cx="38%" cy="32%" r="70%">
          <stop offset="0%" stopColor="rgba(255,255,255,.06)"/>
          <stop offset="100%" stopColor="rgba(0,0,0,.0)"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid20)"/>

      <circle cx={cx} cy={cy} r={R} fill="url(#spGrad)" stroke="rgba(255,255,255,.18)" strokeWidth="1.5"/>

      <ellipse className="svg-draw d2" cx={cx} cy={cy} rx={R} ry={R * 0.24}
        fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="1.1"
        style={{ strokeDasharray: 500, strokeDashoffset: 500 } as CSSProperties}/>
      <ellipse className="svg-draw d2" cx={cx} cy={cy} rx={R * 0.24} ry={R}
        fill="none" stroke="rgba(255,255,255,.08)" strokeWidth="1.1"
        style={{ strokeDasharray: 500, strokeDashoffset: 500 } as CSSProperties}/>
      {/* A meridian slowly precessing, to read the sphere as a solid */}
      <ellipse cx={cx} cy={cy} rx={Math.abs(R * Math.cos(t * 0.3)) + 2} ry={R}
        fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="1"/>
      <ellipse cx={cx} cy={cy} rx={Math.abs(R * Math.sin(t * 0.3)) + 2} ry={R}
        fill="none" stroke="rgba(255,255,255,.045)" strokeWidth="1"/>
      {/* Parallel at the current θ, sliding up and down with it */}
      <ellipse cx={cx} cy={cy - rP * cT} rx={rP * sT} ry={rP * sT * FLAT}
        fill="none" stroke={RED} strokeWidth="1" strokeOpacity=".22" strokeDasharray="3 4"/>

      <Vec x1={cx} y1={cy + R + 18} x2={cx} y2={cy - R - 22} color={BLUE} marker="aB" delay="d0" width={2.5}/>
      <VLabel x={cx + 10} y={cy - R - 26} text="z" color={BLUE} delay="d1" anchor="start"/>

      {/* Drop lines from P down to the equatorial plane */}
      <line className="ants" x1={P.x} y1={P.y} x2={F.x} y2={F.y}
        stroke="rgba(255,255,255,.16)" strokeWidth="1.2" strokeDasharray="5 4"/>
      <line className="ants" x1={cx} y1={cy} x2={F.x} y2={F.y}
        stroke="rgba(255,255,255,.16)" strokeWidth="1.2" strokeDasharray="5 4"/>

      {/* Position vector, orbiting */}
      <line x1={cx} y1={cy} x2={P.x} y2={P.y} stroke={GOLD} strokeWidth="3"
        markerEnd="url(#aG)" filter="url(#gG)" strokeLinecap="round"/>
      <VLabel x={(cx + P.x) / 2 - 12} y={(cy + P.y) / 2 - 6} text="r" color={GOLD} delay="d4"/>

      <circle className="halo" cx={P.x} cy={P.y} fill="none" stroke={GOLD} strokeWidth="1.5"/>
      <circle cx={P.x} cy={P.y} r="4.5" fill={GOLD}/>
      <MLabel x={P.x + 12} y={P.y - 8} text="P(r,θ,ϕ)" color={GOLD} delay="d5" anchor="start"/>

      {/* θ arc, from +z round to r */}
      <path d={thetaArc} fill="none" stroke={RED} strokeWidth="2.2" strokeLinecap="round"/>
      <VLabel x={cx + 15} y={cy - 42} text="θ" color={RED} delay="d5"/>

      {/* ϕ arc on the equator */}
      <path d={phiArc} fill="none" stroke={GREEN} strokeWidth="2.2" strokeLinecap="round"/>
      <VLabel x={cx + 24 * Math.cos(phi / 2)} y={cy + 24 * Math.sin(phi / 2) * FLAT + 20}
        text="ϕ" color={GREEN} delay="d7"/>

      <Dot cx={cx} cy={cy}/>
      <MLabel x={150} y={250} text="θ se mide desde +z · ϕ en el plano xy" color="rgba(255,255,255,.35)" delay="d8" size={10.5}/>
    </svg>
  )
}

/* ── Unit Vector ── */
function UnitVectorDiagram() {
  const t = useTick()
  /* G = (2,−2,−1), |G| = 3, so a_G is one third of G. */
  const O = { x: 60, y: 158 }
  const dx = 170, dy = -78
  const ux = dx / 3, uy = dy / 3
  return (
    /* 250 tall, not 210: the scale-comparison labels below the bars
       used to fall outside the box and get clipped. */
    <svg viewBox="0 0 300 250" className="w-full h-full">
      <SharedDefs/>
      <rect width="100%" height="100%" fill="url(#grid20)"/>

      <rect className="pop d0" x="12" y="10" width="274" height="46" rx="8"
        style={{ fill: 'rgba(74,222,128,.07)', stroke: GREEN, strokeWidth: .8, strokeOpacity: .45 }}/>
      <MLabel x={150} y={29} text="a_G = G / |G|" color={GREEN} delay="d0" size={13}/>
      <MLabel x={150} y={48} text="a_G = (2a_x − 2a_y − a_z) / 3" color="rgba(255,255,255,.5)" delay="d1" size={11}/>

      {[1, 2].map(i => (
        <g key={i} className="pop" style={dly(6 + i)}>
          <circle cx={O.x + i * ux} cy={O.y + i * uy} r="4" fill={GREEN} opacity=".55"/>
          <line x1={O.x + i * ux - 5} y1={O.y + i * uy - 2} x2={O.x + i * ux + 5} y2={O.y + i * uy + 2}
            stroke="rgba(255,255,255,.2)" strokeWidth="1"/>
          <text x={O.x + i * ux + 8} y={O.y + i * uy + 4} fill="rgba(255,255,255,.35)" fontSize="9.5" fontFamily="JetBrains Mono,monospace">{i}</text>
        </g>
      ))}

      <Vec x1={O.x} y1={O.y} x2={O.x + dx} y2={O.y + dy} color={GOLD} marker="aG" delay="d2" width={3}/>
      <VLabel x={O.x + dx + 14} y={O.y + dy + 4} text="G" color={GOLD} delay="d3" anchor="start" size={17}/>

      {/* A pulse running the length of G, so the 3:1 ratio is felt */}
      {(() => {
        const u = (t * 0.35) % 1
        return <Traveler x={O.x + dx * u} y={O.y + dy * u} color={GOLD} r={3.4}/>
      })()}

      <Vec x1={O.x} y1={O.y} x2={O.x + ux} y2={O.y + uy} color={GREEN} marker="aGr" delay="d4" width={3.5}/>
      <line x1={O.x} y1={O.y} x2={O.x + ux} y2={O.y + uy} stroke={GREEN} strokeWidth="5"
        strokeLinecap="round" opacity={0.3 + 0.3 * Math.sin(t * 1.6)}/>
      {/* Label sits below its own arrow — on the old position it landed
          straight on the G stroke and became unreadable. */}
      <MLabel x={O.x + ux + 4} y={O.y + uy + 22} text="a_G" color={GREEN} delay="d5" size={12}/>

      {/* Scale comparison: the unit vector against the full length of G */}
      <rect className="pop d6" x={O.x} y={O.y + 34} width={Math.hypot(dx, dy)} height="8" rx="4"
        fill="none" stroke={GOLD} strokeWidth="1" opacity=".45"/>
      <rect className="pop d6" x={O.x} y={O.y + 34} width={Math.hypot(ux, uy)} height="8" rx="4"
        fill={GREEN} opacity=".55"/>
      <MLabel x={O.x + Math.hypot(ux, uy) / 2} y={O.y + 58} text="|a_G| = 1" color={GREEN} delay="d7" size={10.5}/>
      <MLabel x={O.x + Math.hypot(dx, dy) - 28} y={O.y + 58} text="|G| = 3" color={GOLD} delay="d7" size={10.5}/>
      <MLabel x={150} y={O.y + 80} text="a_G es G reducido a un tercio" color="rgba(255,255,255,.35)" delay="d8" size={10}/>

      <Dot cx={O.x} cy={O.y}/>
    </svg>
  )
}

/* ── Field Vectors ── */
function FieldDiagram() {
  const t = useTick()
  const pts: [number, number, number, number][] = [
    [55, 55, 16, 9], [95, 48, 18, 11], [135, 52, 20, 7], [175, 46, 22, 10], [215, 54, 15, 12],
    [55, 100, 14, 13], [95, 96, 18, 9], [135, 100, 16, 15], [175, 93, 21, 7], [215, 99, 17, 11],
    [55, 145, 21, 6], [95, 140, 22, 9], [135, 137, 19, 11], [175, 142, 17, 13], [215, 134, 20, 8],
    [55, 190, 18, 9], [95, 185, 18, 10], [135, 182, 19, 9], [175, 188, 17, 12], [215, 182, 22, 6],
  ]

  return (
    <svg viewBox="0 0 280 240" className="w-full h-full">
      <defs>
        <marker id="fArr" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
          <polygon points="0 0,6 2.5,0 5" fill={GOLD} opacity=".7"/>
        </marker>
        <GlowFilter id="fGlow" color={GOLD} stdDev={2}/>
      </defs>
      {pts.map(([x, y, dx, dy], i) => {
        /* The whole field breathes: every arrow swings around its own
           direction with a phase set by its position. */
        const base = Math.atan2(dy, dx)
        const len = Math.hypot(dx, dy)
        const phase = x * 0.021 + y * 0.017
        const ang = base + 0.42 * Math.sin(t * 1.05 + phase)
        const mag = len * (0.82 + 0.28 * Math.sin(t * 0.8 - phase))
        return (
          <line key={i} className="rise" style={{ animationDelay: `${i * .04}s` } as CSSProperties}
            x1={x} y1={y} x2={x + Math.cos(ang) * mag} y2={y + Math.sin(ang) * mag}
            stroke={GOLD} strokeWidth="1.8" markerEnd="url(#fArr)"
            opacity={0.34 + 0.26 * (0.5 + 0.5 * Math.sin(t * 0.9 + phase))}/>
        )
      })}
      {/* A probe wandering through the field, sampling it */}
      <g style={{ pointerEvents: 'none' }}>
        <circle cx={140 + 92 * Math.cos(t * 0.42)} cy={120 + 66 * Math.sin(t * 0.55)}
          r="16" fill={GOLD} opacity=".07"/>
        <circle cx={140 + 92 * Math.cos(t * 0.42)} cy={120 + 66 * Math.sin(t * 0.55)}
          r="4" fill={GOLD} opacity=".8"/>
      </g>
      <text className="rise d7" x="140" y="230" fill="rgba(255,255,255,.35)" fontSize="11.5"
        textAnchor="middle" fontFamily="JetBrains Mono,monospace">
        Campo vectorial G(r)
      </text>
    </svg>
  )
}

/* ── Dot Projection (interactive) ── */
function DotProjectionDiagram() {
  const t = useTick()
  const O = { x: 42, y: 138 }
  const lenB = 110
  const [theta, setTheta] = useState(-0.9)

  const { svgRef, handleMove, start, stop } = useDrag((x, y) => {
    const a = Math.atan2(y - O.y, x - O.x)
    setTheta(Math.max(-Math.PI + 0.08, Math.min(-0.04, a)))
  })

  const cosT = Math.cos(theta)
  const Btip = { x: O.x + lenB * Math.cos(theta), y: O.y + lenB * Math.sin(theta) }
  const foot = { x: Btip.x, y: O.y }
  const proj = lenB * cosT

  const arcR = 44
  const arcX = O.x + arcR * Math.cos(theta), arcY = O.y + arcR * Math.sin(theta)
  const sweep = theta < 0 ? 0 : 1
  const sectorPath = `M ${O.x} ${O.y} L ${O.x + arcR} ${O.y} A ${arcR} ${arcR} 0 0 ${sweep} ${arcX} ${arcY} Z`
  const arcPath = `M ${O.x + arcR} ${O.y} A ${arcR} ${arcR} 0 0 ${sweep} ${arcX} ${arcY}`

  const mid = theta / 2
  const tLx = O.x + (arcR + 18) * Math.cos(mid), tLy = O.y + (arcR + 18) * Math.sin(mid)

  const thetaDeg = Math.abs(theta * 180 / Math.PI).toFixed(0)
  const projClamped = Math.max(0, Math.min(proj, 220))

  return (
    <svg ref={svgRef} viewBox="0 0 300 210" className="w-full h-full"
      style={{ userSelect: 'none' } as CSSProperties}
      onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}>
      <SharedDefs/>
      <defs>
        <radialGradient id="dpjSecGrad" cx="0%" cy="100%" r="100%">
          <stop offset="0%" stopColor={GOLD} stopOpacity=".28"/>
          <stop offset="100%" stopColor={GOLD} stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="dpjProjGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={GREEN} stopOpacity=".55"/>
          <stop offset="100%" stopColor={GREEN} stopOpacity=".1"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid20)"/>

      <line x1={O.x - 14} y1={O.y} x2="268" y2={O.y}
        stroke="rgba(255,255,255,.25)" strokeWidth="1.8" markerEnd="url(#aW)"/>
      <VLabel x={274} y={O.y + 5} text="a" color="rgba(255,255,255,.55)" delay="d0" anchor="start" size={15}/>

      <path d={sectorPath} fill="url(#dpjSecGrad)" stroke="none"/>

      <line className="ants-fast" x1={Btip.x} y1={Btip.y} x2={foot.x} y2={foot.y}
        stroke="rgba(255,255,255,.24)" strokeWidth="1.3" strokeDasharray="5 4"/>
      <path d={`M ${foot.x - 10} ${foot.y} L ${foot.x - 10} ${foot.y - 10} L ${foot.x} ${foot.y - 10}`}
        fill="none" stroke="rgba(255,255,255,.28)" strokeWidth="1.2"/>

      {proj > 6 && <>
        <rect x={O.x} y={O.y + 6} width={projClamped} height="14" rx="3" fill="url(#dpjProjGrad)" opacity=".7"/>
        {/* The shadow of B falling onto a, replayed on a loop */}
        <line x1={O.x + ((t * 0.42) % 1) * projClamped} y1={O.y + 4}
          x2={O.x + ((t * 0.42) % 1) * projClamped} y2={O.y + 22}
          stroke={GREEN} strokeWidth="1.6" opacity=".7"/>
      </>}

      {/* Beads flowing along the reference direction a */}
      {[0, 1, 2, 3].map(k => (
        <circle key={k} cx={O.x + (((t * 0.26 + k / 4) % 1)) * 216} cy={O.y}
          r="2.4" fill="rgba(255,255,255,.5)"/>
      ))}

      <path d={arcPath} fill="none" stroke={GOLD} strokeWidth="2.2" strokeLinecap="round"/>
      <text x={tLx} y={tLy + 4} fill={GOLD} fontSize="15" fontWeight="600"
        textAnchor="middle" fontFamily="Fraunces,serif">θ</text>

      <line x1={O.x} y1={O.y} x2={Btip.x} y2={Btip.y}
        stroke={RED} strokeWidth="3" markerEnd="url(#aR)" filter="url(#gR)" strokeLinecap="round"/>
      <text x={Btip.x + 9} y={Btip.y - 5} fill={RED} fontSize="16" fontWeight="700" fontFamily="Fraunces,serif">B</text>

      {proj > 6 && (
        <line x1={O.x} y1={O.y + 26} x2={O.x + projClamped} y2={O.y + 26}
          stroke={GREEN} strokeWidth="3" markerEnd="url(#aGr)" filter="url(#gGr)" strokeLinecap="round"/>
      )}

      <DragHandle x={Btip.x} y={Btip.y} onDown={start()}/>

      <rect x="166" y="120" width="126" height="54" rx="6"
        fill="rgba(0,0,0,.6)" stroke="rgba(255,255,255,.09)" strokeWidth=".8"/>
      <RLabel x={174} y={138} text={`θ = ${thetaDeg}°`} color={GOLD}/>
      <RLabel x={174} y={153} text={`cos θ = ${cosT.toFixed(3)}`} color={GOLD}/>
      <RLabel x={174} y={168} text={`B·a = ${(proj / lenB).toFixed(3)}|B|`} color={GREEN}/>

      <Dot cx={O.x} cy={O.y}/>
      <MLabel x={O.x - 14} y={O.y + 20} text="O" color="rgba(255,255,255,.35)" delay="d0" anchor="end"/>
      <MLabel x={150} y={202} text="Componente escalar de B en la dirección a" color="rgba(255,255,255,.35)" delay="d8" size={10.5}/>
    </svg>
  )
}

/* ── Transform map ──
   Three stacked cards instead of the old hub-and-spokes: at panel
   width the curved connectors put their equation labels on top of the
   boxes, and the icons collided with their own captions. Now each
   card owns a full row and the connectors live in the gaps. */
function TransformDiagram() {
  const CARD_H = 62
  const rows = [
    { top: 8,   color: BLUE,  name: 'Cartesianas', coords: '(x, y, z)', units: 'a_x  a_y  a_z', use: 'placas y fronteras planas' },
    { top: 102, color: RED,   name: 'Cilíndricas', coords: '(ρ, ϕ, z)', units: 'a_ρ  a_ϕ  a_z', use: 'coaxiales y solenoides' },
    { top: 196, color: GREEN, name: 'Esféricas',   coords: '(r, θ, ϕ)', units: 'a_r  a_θ  a_ϕ', use: 'cargas puntuales y antenas' },
  ]

  const icon = (i: number, c: string) => {
    const cx = 34, cy = rows[i].top + CARD_H / 2
    if (i === 0) return (
      <g stroke={c} strokeWidth="1.4" opacity=".55" fill="none">
        <line x1={cx - 8} y1={cy + 9} x2={cx - 8} y2={cy - 9}/>
        <line x1={cx - 8} y1={cy + 9} x2={cx + 10} y2={cy + 9}/>
        <line x1={cx - 8} y1={cy + 9} x2={cx + 2} y2={cy + 1}/>
      </g>
    )
    if (i === 1) return (
      <g stroke={c} strokeWidth="1.3" opacity=".55" fill="none">
        <ellipse cx={cx} cy={cy - 8} rx="11" ry="3.6"/>
        <ellipse cx={cx} cy={cy + 8} rx="11" ry="3.6" opacity=".6"/>
        <line x1={cx - 11} y1={cy - 8} x2={cx - 11} y2={cy + 8}/>
        <line x1={cx + 11} y1={cy - 8} x2={cx + 11} y2={cy + 8}/>
      </g>
    )
    return (
      <g stroke={c} strokeWidth="1.3" opacity=".55" fill="none">
        <circle cx={cx} cy={cy} r="12"/>
        <ellipse cx={cx} cy={cy} rx="12" ry="4.2" opacity=".6"/>
        <line x1={cx} y1={cy - 12} x2={cx} y2={cy + 12} opacity=".4"/>
      </g>
    )
  }

  return (
    <svg viewBox="0 0 300 272" className="w-full h-full">
      <SharedDefs/>
      <defs>
        <marker id="trDown" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto">
          <polygon points="0 0,7 3,0 6" fill="rgba(255,255,255,.55)"/>
        </marker>
        <marker id="trUp" markerWidth="7" markerHeight="6" refX="6" refY="3" orient="auto">
          <polygon points="0 0,7 3,0 6" fill="rgba(255,255,255,.3)"/>
        </marker>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid20)"/>

      {rows.map((r, i) => (
        <g key={i}>
          <rect className="pop" style={dly(i * 1.6)} x="6" y={r.top} width="288" height={CARD_H} rx="11"
            fill={r.color} fillOpacity=".09" stroke={r.color} strokeWidth="1.3" strokeOpacity=".5"/>
          {icon(i, r.color)}
          {/* Two rows: name/units on top, coords/use below. Keeping the
              long "use" string on its own row is what stops it running
              into the coordinate triple. */}
          <text className="rise" style={dly(i * 1.6 + 0.6)} x="66" y={r.top + 24}
            fill={r.color} fontSize="12.5" fontWeight="700">{r.name}</text>
          <MLabel x={286} y={r.top + 24} text={r.units} color="rgba(255,255,255,.5)"
            delay="d3" anchor="end" size={10.5}/>
          <MLabel x={66} y={r.top + 45} text={r.coords} color="rgba(255,255,255,.72)"
            delay="d2" anchor="start" size={11}/>
          <MLabel x={286} y={r.top + 45} text={r.use} color="rgba(255,255,255,.3)"
            delay="d4" anchor="end" size={9}/>
        </g>
      ))}

      {/* Gaps between the cards carry the transformation equations */}
      {[0, 1].map(i => {
        const y1 = rows[i].top + CARD_H
        const y2 = rows[i + 1].top
        const id = `trGap${i}`
        return (
          <g key={i}>
            <path id={id} d={`M 40 ${y1 + 3} L 40 ${y2 - 5}`} fill="none"
              stroke="rgba(255,255,255,.35)" strokeWidth="1.5" markerEnd="url(#trDown)"/>
            <circle r="2.8" fill={rows[i + 1].color}>
              <animateMotion dur={i === 0 ? '2.4s' : '2.8s'} repeatCount="indefinite">
                <mpath href={`#${id}`}/>
              </animateMotion>
            </circle>
            <path className="ants" d={`M 262 ${y2 - 5} L 262 ${y1 + 3}`} fill="none"
              stroke="rgba(255,255,255,.22)" strokeWidth="1.2" strokeDasharray="4 4"
              markerEnd="url(#trUp)"/>
            <MLabel x={54} y={(y1 + y2) / 2 + 4} text={i === 0 ? 'Ec. (10)–(11)' : 'Ec. (15)–(16)'}
              color={rows[i + 1].color} delay="d5" anchor="start" size={10}/>
            <MLabel x={254} y={(y1 + y2) / 2 + 4} text="inversa"
              color="rgba(255,255,255,.28)" delay="d6" anchor="end" size={9}/>
          </g>
        )
      })}
    </svg>
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
  { n: '01', title: 'Fundamentos', range: '§ 1.1 – 1.2', color: GOLD,
    desc: 'Qué distingue a un vector de un escalar, y cómo se suma, resta y escala.' },
  { n: '02', title: 'Espacio y campos', range: '§ 1.3 – 1.5', color: BLUE,
    desc: 'Coordenadas rectangulares, descomposición en componentes, y la idea de campo.' },
  { n: '03', title: 'Los dos productos', range: '§ 1.6 – 1.7', color: GREEN,
    desc: 'Punto: proyección y trabajo. Cruz: área, dirección normal y momento.' },
  { n: '04', title: 'Sistemas curvilíneos', range: '§ 1.8 – 1.9', color: VIOLET,
    desc: 'Cilíndricas y esféricas: dejar que la simetría del problema elija el sistema.' },
]

const SLIDES: SD[] = [
  { id: 1, layout: 'cover', tag: 'CAPÍTULO 1',
    title: 'Análisis\nVectorial',
    subtitle: 'Teoría Electromagnética I · Primer módulo',
    meta: 'Hayt & Buck · Teoría electromagnética, cap. 1 · §1.1 – 1.9',
    image: IMG_SPIRAL },

  { id: 2, layout: 'agenda', tag: 'Ruta',
    title: 'Cómo se arma el capítulo',
    body: 'Cuatro bloques. Los dos primeros construyen el lenguaje; los dos últimos lo ponen a trabajar.',
    acts: ACTS },

  { id: 3, layout: 'visual', tag: 'Introducción', section: 'Intro',
    title: '¿Por qué análisis vectorial?',
    body: 'Es la taquigrafía matemática del electromagnetismo: una sola ecuación vectorial dice lo que tres ecuaciones escalares.',
    items: [
      'Un vector carga magnitud y dirección al mismo tiempo — no se puede separar una de la otra',
      'Las cuatro ecuaciones de Maxwell están escritas en forma vectorial; sin este lenguaje no se leen',
      'La simetría del problema decide el sistema de coordenadas, y ese sí es un ahorro real de álgebra',
    ],
    image: IMG_ABSTRACT },

  { id: 4, layout: 'concept', tag: '§ 1.1', section: '1.1',
    title: 'Escalares y Vectores',
    body: 'Un escalar queda descrito por un número real. Un vector necesita además una dirección en el espacio.',
    items: [
      'Escalares: temperatura T, distancia L, voltaje V, masa m',
      'Vectores: fuerza F, velocidad v, campo eléctrico E',
      'Notación de Hayt: negritas *A* para el vector, cursiva A para su magnitud',
      'A mano se usa flecha sobre la letra — omitirla es la primera fuente de errores del curso',
    ],
    note: 'Un campo asocia un valor a cada punto del espacio: escalar si ese valor es un número, vectorial si es un vector.' },

  { id: 5, layout: 'formula', tag: '§ 1.2', section: '1.2',
    title: 'Álgebra vectorial: suma',
    body: 'La suma sigue la ley del paralelogramo. Equivale al método del triángulo: la punta de A es el origen de B.',
    formulas: [
      '*A* + *B* = *B* + *A*        (conmutativa)',
      '*A* + (*B* + *C*) = (*A* + *B*) + *C*     (asociativa)',
      '*A* − *B* = *A* + (−*B*)',
    ],
    fCaption: 'La resta es sumar el opuesto: se invierte B y se aplica la misma regla.',
    diagram: <VectorAdditionDiagram/>, interactive: true,
    hint: 'Arrastra A y B — la diagonal es la suma' },

  { id: 6, layout: 'concept', tag: '§ 1.2', section: '1.2',
    title: 'Multiplicación por escalar',
    body: 'Escalar un vector cambia su longitud, y solo cambia su sentido si el escalar es negativo.',
    items: [
      'r > 0 : altera la magnitud, conserva la dirección',
      'r < 0 : altera la magnitud e invierte el sentido',
      'Distributiva: (r+s)(*A*+*B*) = r*A* + r*B* + s*A* + s*B*',
      'División: *A*/r = *A*·(1/r), definida solo para r ≠ 0',
      'Dos vectores son iguales si coinciden en magnitud y dirección, sin importar dónde estén dibujados',
    ],
    note: 'En un campo vectorial solo tiene sentido sumar vectores definidos en el mismo punto del espacio.' },

  { id: 7, layout: 'formula', tag: '§ 1.3', section: '1.3',
    title: 'Sistema rectangular',
    body: 'Tres ejes mutuamente perpendiculares en orientación de mano derecha. Un punto es la intersección de tres planos coordenados.',
    items: [
      'Mano derecha: al girar x hacia y, el tornillo avanza en +z',
      'P queda definido por x = cte, y = cte, z = cte',
    ],
    formulas: [
      'd*L* = √(dx^2 + dy^2 + dz^2)',
      'dv = dx dy dz',
    ],
    diagram: <CartesianAxesDiagram/> },

  { id: 8, layout: 'formula', tag: '§ 1.4', section: '1.4',
    title: 'Componentes y vectores unitarios',
    body: 'Todo vector B se descompone de forma única en las tres direcciones cartesianas.',
    formulas: [
      '*B* = B_x *a*_x + B_y *a*_y + B_z *a*_z',
      '|*B*| = √(B_x^2 + B_y^2 + B_z^2)          (1)',
      '*a*_B = *B* / |*B*|                       (2)',
    ],
    fCaption: '*a*_x·*a*_x = *a*_y·*a*_y = *a*_z·*a*_z = 1    ·    *a*_x·*a*_y = *a*_y·*a*_z = *a*_z·*a*_x = 0',
    diagram: <VectorComponentsDiagram/> },

  { id: 9, layout: 'example', tag: 'Ejemplo 1.1', section: '1.4',
    title: 'Vector unitario en la dirección de G',
    given: '*G* = 2*a*_x − 2*a*_y − *a*_z',
    items: [
      'Componentes: G_x = 2,  G_y = −2,  G_z = −1',
      'Magnitud: |*G*| = √(4 + 4 + 1) = 3',
      'Dividir el vector entre su magnitud: *a*_G = *G* / |*G*|',
    ],
    formulas: ['*a*_G = ⅔*a*_x − ⅔*a*_y − ⅓*a*_z  =  0.667*a*_x − 0.667*a*_y − 0.333*a*_z'],
    practice: {
      code: 'D1.1',
      q: 'Dados M(−1, 2, 1), N(3, −3, 0) y P(−2, −3, −4), halla (a) *R*_{MN}; (b) *R*_{MN} + *R*_{MP}; (c) |*r*_M|; (d) |2*r*_P − 3*r*_N|.',
      a: ['(a) 4*a*_x − 5*a*_y − *a*_z', '(b) 3*a*_x − 10*a*_y − 6*a*_z', '(c) 2.45', '(d) 15.56'],
    },
    diagram: <UnitVectorDiagram/> },

  { id: 10, layout: 'formula', tag: '§ 1.5', section: '1.5',
    title: 'El campo vectorial',
    body: 'Un campo vectorial G(r) asigna un vector a cada punto del espacio: tanto la magnitud como la dirección cambian con la posición.',
    items: [
      '*G*(*r*) = G_x(*r*)*a*_x + G_y(*r*)*a*_y + G_z(*r*)*a*_z',
      'Se evalúa sustituyendo las coordenadas del punto: *G*(*r*_Q) en Q(x₀, y₀, z₀)',
    ],
    formulas: ['*v* = 2e^{z/100} *a*_x    →    2 m/s en la superficie (z = 0)'],
    fCaption: 'Ejemplo clásico: corriente en un canal, donde la velocidad decae con la profundidad.',
    diagram: <FieldDiagram/> },

  { id: 11, layout: 'formula', tag: '§ 1.6', section: '1.6',
    title: 'Producto punto (escalar)',
    body: 'Producto de las magnitudes por el coseno del ángulo entre ambos vectores. El resultado es un escalar.',
    formulas: [
      '*A* · *B* = |*A*||*B*| cos θ_{AB}              (3)',
      '*A* · *B* = *B* · *A*     (conmutativo)      (4)',
      '*A* · *B* = A_xB_x + A_yB_y + A_zB_z        (5)',
      '*A* · *A* = A^2 = |*A*|^2                   (6)',
    ],
    fCaption: 'Los unitarios cartesianos son ortonormales, y por eso (3) colapsa a la forma (5).',
    diagram: <DotProductDiagram/>, interactive: true },

  { id: 12, layout: 'formula', tag: '§ 1.6', section: '1.6',
    title: 'Proyección: para qué sirve',
    body: 'La proyección es la aplicación más valiosa del producto punto: extrae cuánto de un vector apunta en una dirección dada.',
    items: [
      'Trabajo mecánico: W = *F* · *L* = FL cos θ',
      'Flujo magnético a través de una superficie: Φ = ∫ *B* · d*S*',
    ],
    formulas: [
      'Componente escalar de *B* en la dirección *a*:   *B* · *a* = |*B*| cos θ',
      'Componente vectorial de *B* en la dirección *a*:  (*B* · *a*) *a*',
    ],
    fCaption: 'La escalar es un número con signo; la vectorial vuelve a apuntar a lo largo de *a*.',
    diagram: <DotProjectionDiagram/>, interactive: true },

  { id: 13, layout: 'example', tag: 'Ejemplo 1.2', section: '1.6',
    title: 'Componente de un campo en una dirección',
    given: '*G* = y*a*_x − 2.5x*a*_y + 3*a*_z   en   Q(4, 5, 2),   con   *a*_N = ⅓(2*a*_x + *a*_y − 2*a*_z)',
    items: [
      'Evaluar el campo en Q:  *G*(*r*_Q) = 5*a*_x − 10*a*_y + 3*a*_z',
      'Componente escalar:  *G*·*a*_N = ⅓(10 − 10 − 6) = −2',
      'Componente vectorial:  (*G*·*a*_N)*a*_N = −1.333*a*_x − 0.667*a*_y + 1.333*a*_z',
      'El signo negativo dice que *G* apunta al lado opuesto de *a*_N',
    ],
    formulas: ['θ_{Ga} = cos^{−1}( −2 / √134 ) = 99.9°'],
    practice: {
      code: 'D1.3',
      q: 'Los vértices de un triángulo están en A(6, −1, 2), B(−2, 3, −4) y C(−3, 1, 5). Halla (a) *R*_{AB}; (b) el ángulo θ_{BAC} en el vértice A; (c) la proyección vectorial de *R*_{AB} sobre *R*_{AC}.',
      a: ['(a) −8*a*_x + 4*a*_y − 6*a*_z', '(b) 53.6°', '(c) −5.94*a*_x + 1.319*a*_y + 1.979*a*_z'],
    } },

  { id: 14, layout: 'formula', tag: '§ 1.7', section: '1.7',
    title: 'Producto cruz (vectorial)',
    body: 'A × B es un vector perpendicular al plano que contiene a A y a B, con sentido dado por la regla de la mano derecha.',
    formulas: [
      '*A* × *B* = *a*_n |*A*||*B*| sen θ_{AB}          (7)',
      '*B* × *A* = −(*A* × *B*)     ← no conmutativo',
      '*a*_x×*a*_y = *a*_z   ·   *a*_y×*a*_z = *a*_x   ·   *a*_z×*a*_x = *a*_y',
    ],
    fCaption: '|*A*×*B*| es el área del paralelogramo que forman *A* y *B*: cero si son paralelos, máxima si son perpendiculares.',
    diagram: <CrossProductDiagram/>, interactive: true },

  { id: 15, layout: 'concept', tag: '§ 1.7', section: '1.7',
    title: 'Cálculo por determinante',
    body: 'En la práctica el producto cruz se calcula como un determinante 3×3, no con la definición geométrica.',
    items: [
      '*A*×*B* = (A_yB_z − A_zB_y)*a*_x + (A_zB_x − A_xB_z)*a*_y + (A_xB_y − A_yB_x)*a*_z    (8)',
      'Verificación rápida: el resultado debe cumplir (*A*×*B*)·*A* = 0 y (*A*×*B*)·*B* = 0',
    ],
    formulas: [
      '*A* = 2*a*_x − 3*a*_y + *a*_z ,   *B* = −4*a*_x − 2*a*_y + 5*a*_z',
      '*A* × *B* = −13*a*_x − 14*a*_y − 16*a*_z',
    ],
    practice: {
      code: 'D1.4',
      q: 'Con los mismos vértices A(6, −1, 2), B(−2, 3, −4), C(−3, 1, 5), halla (a) *R*_{AB} × *R*_{AC}; (b) el área del triángulo; (c) un unitario normal al plano del triángulo.',
      a: ['(a) 24*a*_x + 78*a*_y + 20*a*_z', '(b) 42.0', '(c) 0.286*a*_x + 0.928*a*_y + 0.238*a*_z'],
    } },

  { id: 16, layout: 'formula', tag: '§ 1.8', section: '1.8',
    title: 'Coordenadas cilíndricas',
    body: 'Tres superficies mutuamente perpendiculares: un cilindro, un semiplano vertical y un plano horizontal.',
    items: [
      'ρ = cte  →  cilindro   (ρ ≥ 0)',
      'ϕ = cte  →  semiplano  (0° ≤ ϕ < 360°)',
      'z = cte  →  plano horizontal',
    ],
    formulas: [
      'x = ρ cos ϕ    y = ρ sen ϕ    z = z              (10)',
      'ρ = √(x^2+y^2)    ϕ = tan^{−1}(y/x)    z = z     (11)',
      'dv = ρ dρ dϕ dz',
    ],
    fCaption: 'El factor ρ en dv es el jacobiano: sin él las integrales de volumen salen mal.',
    diagram: <CylindricalDiagram/> },

  { id: 17, layout: 'formula', tag: '§ 1.8', section: '1.8',
    title: 'Los unitarios curvilíneos no son constantes',
    body: 'Aquí está la diferencia de fondo con el sistema cartesiano, y el error más caro del capítulo.',
    items: [
      '*a*_x, *a*_y, *a*_z apuntan igual en todo punto del espacio',
      '*a*_ρ y *a*_ϕ dependen de ϕ: giran al moverse alrededor del eje z',
      '*a*_z es el único unitario que las tres coordenadas cilíndricas comparten con el cartesiano',
    ],
    formulas: [
      '∂*a*_ρ/∂ϕ = *a*_ϕ        ∂*a*_ϕ/∂ϕ = −*a*_ρ',
    ],
    fCaption: 'Consecuencia: no se pueden sacar de una derivada ni de una integral respecto de ϕ.',
    diagram: <VaryingUnitVectorsDiagram/> },

  { id: 18, layout: 'table', tag: 'Tabla 1.1', section: '1.8',
    title: 'Unitarios cilíndricos × cartesianos',
    body: 'Cada casilla es un producto punto. Sirve para pasar las componentes de un vector de un sistema al otro.',
    tableHead: ['', '*a*_ρ', '*a*_ϕ', '*a*_z'],
    tableRows: [
      ['*a*_x', 'cos ϕ', '−sen ϕ', '0'],
      ['*a*_y', 'sen ϕ', 'cos ϕ', '0'],
      ['*a*_z', '0', '0', '1'],
    ],
    note: 'Para obtener B_ρ se proyecta: B_ρ = *B*·*a*_ρ = B_x cos ϕ + B_y sen ϕ.' },

  { id: 19, layout: 'example', tag: 'Ejemplo 1.3', section: '1.8',
    title: 'Un campo cartesiano llevado a cilíndricas',
    given: '*B* = y*a*_x − x*a*_y + z*a*_z',
    items: [
      'B_ρ = *B*·*a*_ρ = y cos ϕ − x sen ϕ = ρ sen ϕ cos ϕ − ρ cos ϕ sen ϕ = 0',
      'B_ϕ = *B*·*a*_ϕ = −y sen ϕ − x cos ϕ = −ρ sen^2ϕ − ρ cos^2ϕ = −ρ',
      'B_z = z  (no cambia: *a*_z es común a ambos sistemas)',
    ],
    formulas: ['*B* = −ρ *a*_ϕ + z *a*_z'],
    fCaption: 'El campo era un remolino alrededor del eje z, y en cilíndricas eso se vuelve evidente.',
    practice: {
      code: 'D1.5',
      q: 'Dados C(ρ = 4.4, ϕ = −115°, z = 2) y D(x = −3.1, y = 2.6, z = −3), halla (a) las coordenadas rectangulares de C; (b) las cilíndricas de D; (c) la distancia de C a D.',
      a: ['(a) C(−1.860, −3.99, 2)', '(b) D(ρ = 4.05, ϕ = 140.0°, z = −3)', '(c) 8.36'],
    } },

  { id: 20, layout: 'formula', tag: '§ 1.9', section: '1.9',
    title: 'Coordenadas esféricas',
    body: 'Ahora las tres superficies perpendiculares son una esfera, un cono y un semiplano.',
    items: [
      'r = cte  →  esfera    (r ≥ 0)',
      'θ = cte  →  cono      (0° ≤ θ ≤ 180°, medido desde +z)',
      'ϕ = cte  →  semiplano (el mismo ϕ de las cilíndricas)',
    ],
    formulas: [
      'x = r sen θ cos ϕ    y = r sen θ sen ϕ    z = r cos θ        (15)',
      'r = √(x^2+y^2+z^2)    θ = cos^{−1}(z/r)    ϕ = tan^{−1}(y/x)  (16)',
      'dv = r^2 sen θ dr dθ dϕ',
    ],
    fCaption: 'Cuidado: θ es el ángulo polar desde +z, no el azimutal. Otros textos invierten los nombres.',
    diagram: <SphericalDiagram/> },

  { id: 21, layout: 'table', tag: 'Tabla 1.2', section: '1.9',
    title: 'Unitarios esféricos × cartesianos',
    body: 'Misma lógica que la Tabla 1.1, con una fila más de trigonometría.',
    tableHead: ['', '*a*_r', '*a*_θ', '*a*_ϕ'],
    tableRows: [
      ['*a*_x', 'sen θ cos ϕ', 'cos θ cos ϕ', '−sen ϕ'],
      ['*a*_y', 'sen θ sen ϕ', 'cos θ sen ϕ', 'cos ϕ'],
      ['*a*_z', 'cos θ', '−sen θ', '0'],
    ],
    note: 'La última fila es la más útil: un campo dirigido en *a*_z se reparte entre *a*_r y *a*_θ.' },

  { id: 22, layout: 'example', tag: 'Ejemplo 1.4', section: '1.9',
    title: 'Un campo cartesiano llevado a esféricas',
    given: '*G* = (xz / y) *a*_x',
    items: [
      'Sustituir (15):  xz/y = r cos θ cot ϕ',
      'G_r = *G*·*a*_r = r sen θ cos θ cos^2ϕ / sen ϕ',
      'G_θ = *G*·*a*_θ = r cos^2θ cos^2ϕ / sen ϕ',
      'G_ϕ = *G*·*a*_ϕ = −r cos θ cos ϕ',
    ],
    formulas: ['*G* = r cos θ cos ϕ ( sen θ cot ϕ *a*_r + cos θ cot ϕ *a*_θ − *a*_ϕ )'],
    fCaption: 'No siempre transformar simplifica: aquí el sistema esférico no era el adecuado para este campo.',
    practice: {
      code: 'D1.7',
      q: 'Dados C(−3, 2, 1) y D(r = 5, θ = 20°, ϕ = −70°), halla (a) las coordenadas esféricas de C; (b) las rectangulares de D; (c) la distancia de C a D.',
      a: ['(a) C(r = 3.74, θ = 74.5°, ϕ = 146.3°)', '(b) D(0.585, −1.607, 4.70)', '(c) 6.29'],
    } },

  { id: 23, layout: 'table', tag: 'Referencia', section: 'Coord.',
    title: 'Elementos diferenciales',
    body: 'La tabla que más se consulta en los capítulos siguientes, cuando toque integrar.',
    tableHead: ['', 'Cartesianas', 'Cilíndricas', 'Esféricas'],
    tableRows: [
      ['d*L*', '√(dx^2 + dy^2 + dz^2)', '√(dρ^2 + ρ^2dϕ^2 + dz^2)', '√(dr^2 + r^2dθ^2 + r^2sen^2θ dϕ^2)'],
      ['dS', 'dy dz  ·  dx dz  ·  dx dy', 'ρ dϕ dz  ·  dρ dz  ·  ρ dρ dϕ', 'r^2sen θ dθ dϕ  ·  r sen θ dr dϕ  ·  r dr dθ'],
      ['dv', 'dx dy dz', 'ρ dρ dϕ dz', 'r^2 sen θ dr dθ dϕ'],
    ],
    dense: true,
    note: 'Los factores ρ y r^2 sen θ son los jacobianos. Olvidarlos es el error número uno al integrar.' },

  { id: 24, layout: 'formula', tag: 'Síntesis', section: 'Coord.',
    title: 'Elegir el sistema correcto',
    body: 'Los tres sistemas describen el mismo espacio. La única razón para preferir uno es la simetría del problema.',
    items: [
      'Cartesiano (x, y, z) — placas, cajas, cualquier frontera plana',
      'Cilíndrico (ρ, ϕ, z) — cables coaxiales, solenoides, conductores largos',
      'Esférico (r, θ, ϕ) — cargas puntuales, antenas, radiación al espacio libre',
    ],
    fCaption: 'Elegir bien no cambia la respuesta, pero puede reducir una integral triple a una sola.',
    diagram: <TransformDiagram/> },

  { id: 25, layout: 'pitfalls', tag: 'Advertencia',
    title: 'Los errores que sí cuestan puntos',
    body: 'Cinco confusiones que se repiten en cada examen de este capítulo.',
    pitfalls: [
      ['Escribir A = B para dos vectores solo porque |*A*| = |*B*|',
       'La igualdad vectorial exige magnitud *y* dirección iguales'],
      ['Sumar vectores de un campo tomados en puntos distintos',
       'Solo se suman vectores definidos en el mismo punto del espacio'],
      ['Sacar *a*_ρ o *a*_ϕ fuera de una derivada o integral en ϕ',
       'Giran con ϕ; solo *a*_x, *a*_y, *a*_z son constantes'],
      ['Usar ϕ = tan^{−1}(y/x) directo de la calculadora',
       'Hay que corregir el cuadrante: tan^{−1} solo devuelve −90° a 90°'],
      ['Integrar en cilíndricas con dv = dρ dϕ dz',
       'Falta el jacobiano: dv = ρ dρ dϕ dz, y r^2 sen θ en esféricas'],
    ] },

  { id: 26, layout: 'summary', tag: 'Resumen',
    title: 'Conceptos clave',
    items: [
      '§1.1  Escalar vs. vector · negritas *A* para el vector',
      '§1.2  Suma, resta y escalado · ley del paralelogramo',
      '§1.3  Cartesiano de mano derecha · dv = dx dy dz',
      '§1.4  Componentes · |*B*| = √(B_x^2+B_y^2+B_z^2) · *a*_B = *B*/|*B*|',
      '§1.5  Campo vectorial *G*(*r*) · un vector por punto',
      '§1.6  Producto punto *A*·*B* = A_xB_x+A_yB_y+A_zB_z · proyección',
      '§1.7  Producto cruz *A*×*B* · no conmutativo · área',
      '§1.8  Cilíndricas (ρ, ϕ, z) · dv = ρ dρ dϕ dz',
      '§1.9  Esféricas (r, θ, ϕ) · dv = r^2 sen θ dr dθ dϕ',
    ],
    image: IMG_GRID },

  { id: 27, layout: 'end',
    title: 'Análisis\nVectorial',
    subtitle: 'El lenguaje matemático del electromagnetismo.\nDominar estas herramientas es lo que hace que el resto del curso fluya.',
    image: IMG_BLUE },
]

/* Accent colour per section — the four acts of the chapter */
function accentFor(s: SD): string {
  const sec = s.section ?? ''
  if (sec === '1.3' || sec === '1.4' || sec === '1.5') return BLUE
  if (sec === '1.6' || sec === '1.7') return GREEN
  if (sec === '1.8' || sec === '1.9' || sec === 'Coord.') return VIOLET
  return GOLD
}

function actLabel(s: SD): string | null {
  const sec = s.section ?? ''
  if (sec === '1.1' || sec === '1.2') return 'Fundamentos'
  if (sec === '1.3' || sec === '1.4' || sec === '1.5') return 'Espacio y campos'
  if (sec === '1.6' || sec === '1.7') return 'Los dos productos'
  if (sec === '1.8' || sec === '1.9' || sec === 'Coord.') return 'Sistemas curvilíneos'
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
    return () => window.removeEventListener('resize', fit)
  }, [])
  return k
}

/* Each layout family gets its own transition flavour, so the deck
   changes rhythm as it moves between kinds of material. */
function flavourFor(layout: SD['layout']): 'slide' | 'zoom' | 'side' {
  if (layout === 'cover' || layout === 'end' || layout === 'summary') return 'zoom'
  if (layout === 'agenda' || layout === 'table' || layout === 'pitfalls') return 'side'
  return 'slide'
}

export default function App() {
  const [cur, setCur] = useState(0)
  const [animCls, setAnimCls] = useState<string>('zoom-enter-fwd')
  const [slideKey, setSlideKey] = useState(0)
  const busy = useRef(false)
  const scale = useStageScale()

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
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [goTo, cur])

  const slide = SLIDES[cur]
  const accent = accentFor(slide)
  const act = actLabel(slide)
  const pct = ((cur + 1) / SLIDES.length) * 100

  return (
    <div className="w-full h-full flex items-center justify-center"
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

        {/* Counter */}
        <div className="absolute z-40 rise"
          style={{ top: 26, right: 64, color: 'rgba(255,255,255,.3)', fontSize: 12, letterSpacing: '.15em', fontFamily: 'JetBrains Mono,monospace' }}>
          {String(cur + 1).padStart(2, '0')}<span style={{ opacity: .4 }}> / </span>{String(SLIDES.length).padStart(2, '0')}
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

        {/* Accent bar sweeping across on every change */}
        <div key={`sweep-${slideKey}`} className="sweep absolute pointer-events-none"
          style={{
            top: 0, left: 0, width: '100%', height: 2, zIndex: 35,
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
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
              aria-label={`Lámina ${i + 1}`}/>
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
    <h2 style={{
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
          Problema de práctica
        </span>
      </div>
      <div style={{ fontSize: 13.5, color: 'rgba(255,255,255,.62)', lineHeight: 1.55, marginBottom: 9 }}>
        <Fx s={p.q}/>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 18px' }}>
        {p.a.map((ans, i) => (
          <span key={i} style={{
            fontFamily: 'JetBrains Mono,monospace', fontSize: 12.5, color: 'rgba(255,255,255,.45)',
          }}>
            <Fx s={ans}/>
          </span>
        ))}
      </div>
    </div>
  )
}

/* Right column. Interactive diagrams get z-30 so the navigation
   click zones (z-20) do not swallow their pointer events. */
function RightPanel({ children, interactive, hint, accent }:
  { children: ReactNode; interactive?: boolean; hint?: string; accent: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full pop"
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
        1
      </div>
      <div className="rise absolute" style={{ ...dly(6), left: 72, bottom: 52, fontSize: 12, color: 'rgba(255,255,255,.25)', letterSpacing: '.1em' }}>
        ← → para navegar · clic en cualquier lado para avanzar
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
          <div key={i} className="rise" style={{
            ...dly(i + 3),
            padding: '20px 22px', borderRadius: 12,
            background: `${a.color}0d`, border: `1px solid ${a.color}33`,
            display: 'flex', gap: 18, alignItems: 'flex-start',
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
  const fs = s.dense ? 14 : 16
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
                        whiteSpace: 'nowrap',
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
            Capítulo 1 completo
          </span>
        </div>
      </div>
    </div>
  )
}
