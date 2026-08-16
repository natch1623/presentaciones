import { useEffect, useRef, type CSSProperties } from 'react'

/* ═══════════════════════════════════════════════════════════
   DECK THEMES

   The five decks of this course teach five different things, and
   each one gets a room built out of its own subject rather than a
   recoloured copy of the others:

     coulomb      charge frozen in place        → a hall of ice shards
     gauss        flux through closed surfaces  → nested shells
     potencial    a scalar field with levels    → a contour map
     corriente    charge that finally moves     → a drifting lattice
     dielectrico  dipoles snapping into line    → aligning dipoles

   Two things stay fixed across all five, on purpose. The sign code —
   warm is a positive charge, cold is a negative one — never moves,
   or the diagrams stop being readable at a glance. And every ambient
   layer stays faint: a field diagram has to read from the back row,
   and no atmosphere is worth losing that.
═══════════════════════════════════════════════════════════ */

/* Fixed 16:9 stage. Everything is authored at these pixel dimensions
   and scaled to fit, so a slide can never reflow on a projector. */
export const STAGE_W = 1280
export const STAGE_H = 720

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true
}

export type AmbientKind = 'shards' | 'shells' | 'contours' | 'streams' | 'dipoles'

export interface DeckTheme {
  id: AmbientKind
  /* the room */
  base: string          /* the floor the whole stage sits on */
  panel: string         /* card and viewport surfaces */
  glow: string          /* the slow drifting light behind everything */
  /* how the room behaves */
  ambient: AmbientKind
  /* how a heading arrives — one CSS class, defined in index.css */
  word: string
  /* which transition family a plain content slide uses */
  flow: 'slide' | 'zoom' | 'side' | 'rise'
  /* the ornament that closes a heading's rule */
  ornament: 'shards' | 'arcs' | 'levels' | 'flow' | 'dipoles'
  /* silhouette of panels: cut corners, or square, or soft */
  cut: string
}

const CUT_SHARD = 'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))'
const CUT_NOTCH = 'polygon(0 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%)'
const CUT_NONE  = 'none'

export const THEMES: Record<string, DeckTheme> = {
  /* ── Charge at rest. The origin identity: a winter throne hall. ── */
  coulomb: {
    id: 'shards',
    base: '#070B18', panel: '#14203A', glow: '#7FC8E8',
    ambient: 'shards', word: 'w-frost', flow: 'slide',
    ornament: 'shards', cut: CUT_SHARD,
  },
  /* ── Flux through closed surfaces. Warmer, and built of shells. ── */
  gauss: {
    id: 'shells',
    base: '#0A0A12', panel: '#1D1B2E', glow: '#C9A24A',
    ambient: 'shells', word: 'w-flux', flow: 'zoom',
    ornament: 'arcs', cut: CUT_SHARD,
  },
  /* ── A scalar field. Topography, so the room is a contour map. ── */
  potencial: {
    id: 'contours',
    base: '#04120F', panel: '#0F2B2C', glow: '#6EE7C7',
    ambient: 'contours', word: 'w-rise', flow: 'rise',
    ornament: 'levels', cut: CUT_NOTCH,
  },
  /* ── Charge finally moves. The only deck whose room flows. ── */
  corriente: {
    id: 'streams',
    base: '#060F14', panel: '#0E2833', glow: '#6EE7C7',
    ambient: 'streams', word: 'w-drift', flow: 'side',
    ornament: 'flow', cut: CUT_NONE,
  },
  /* ── Bound charge snapping into alignment. Violet, and ordered. ── */
  dielectrico: {
    id: 'dipoles',
    base: '#0A0714', panel: '#211838', glow: '#A88BE0',
    ambient: 'dipoles', word: 'w-align', flow: 'slide',
    ornament: 'dipoles', cut: CUT_NOTCH,
  },
}

/* Deterministic pseudo-random. Every ambient layer and backdrop below
   uses it so the rooms look carved rather than noisy, and so the PDF
   export renders identically on every machine. */
function rnd(i: number, salt = 0): number {
  const v = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453
  return v - Math.floor(v)
}

/* ═══════════════════════════════════════════════════════════
   THE AMBIENT LAYER

   One canvas, one rAF loop, painted directly so it never triggers a
   React render. Which painter runs is the theme's decision.
═══════════════════════════════════════════════════════════ */
type Painter = (ctx: CanvasRenderingContext2D, t: number, accent: string) => void

/* ── charge at rest: shards aligned to a field that does not move ── */
const paintShards: Painter = (ctx, t, accent) => {
  const STEP = 82
  const cols = Math.ceil(STAGE_W / STEP) + 1
  const rows = Math.ceil(STAGE_H / STEP) + 1
  ctx.strokeStyle = accent
  ctx.fillStyle = accent
  ctx.lineWidth = 1

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = i * STEP + 30
      const y = j * STEP + 26
      const ang = Math.sin(x * 0.0052 + t * 0.20) * 1.5
                + Math.cos(y * 0.0068 - t * 0.15) * 1.5
      const len = 15 + 6 * Math.sin(t * 0.4 + i * 0.6 + j * 0.4)
      const wdt = 2.4 + 1.2 * Math.cos(t * 0.33 + i * 0.5 - j * 0.7)
      const ca = Math.cos(ang)
      const sa = Math.sin(ang)
      ctx.globalAlpha = 0.05 + 0.04 * (0.5 + 0.5 * Math.sin(t * 0.55 + i * 0.35 - j * 0.28))
      /* a thin rhombus: sharp at both tips, widest in the middle */
      ctx.beginPath()
      ctx.moveTo(x + ca * len, y + sa * len)
      ctx.lineTo(x - sa * wdt, y + ca * wdt)
      ctx.lineTo(x - ca * len * 0.55, y - sa * len * 0.55)
      ctx.lineTo(x + sa * wdt, y - ca * wdt)
      ctx.closePath()
      ctx.fill()
      ctx.stroke()
    }
  }
}

/* ── flux: shells expanding out of scattered sources, forever ── */
const paintShells: Painter = (ctx, t, accent) => {
  const SRC = 6
  ctx.strokeStyle = accent
  ctx.lineWidth = 1.1

  for (let s = 0; s < SRC; s++) {
    const cx = 90 + rnd(s, 1) * (STAGE_W - 180)
    const cy = 70 + rnd(s, 2) * (STAGE_H - 140)
    const speed = 0.05 + rnd(s, 3) * 0.05
    /* four shells per source, evenly spaced in phase, so the wavefront
       reads as continuous rather than as a pulse */
    for (let k = 0; k < 4; k++) {
      const u = ((t * speed) + k / 4 + rnd(s, 4)) % 1
      const r = u * 300
      /* born bright at the centre, gone by the time it leaves */
      ctx.globalAlpha = 0.11 * Math.sin(u * Math.PI) ** 1.4
      ctx.beginPath()
      ctx.arc(cx, cy, r, 0, Math.PI * 2)
      ctx.stroke()
    }
    /* the radial lines the shells are counting */
    ctx.globalAlpha = 0.045
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 + rnd(s, 5) * 6
      ctx.beginPath()
      ctx.moveTo(cx + Math.cos(a) * 26, cy + Math.sin(a) * 26)
      ctx.lineTo(cx + Math.cos(a) * 300, cy + Math.sin(a) * 300)
      ctx.stroke()
    }
  }
}

/* ── potential: a topographic map, its levels breathing slowly ── */
const paintContours: Painter = (ctx, t, accent) => {
  ctx.strokeStyle = accent
  ctx.lineWidth = 1.2

  /* two hills, each drawn as a stack of closed level curves */
  const hills = [
    { cx: 330, cy: 300, k: 1.0, ph: 0 },
    { cx: 940, cy: 440, k: 0.82, ph: 2.1 },
  ]
  for (const h of hills) {
    for (let L = 1; L <= 9; L++) {
      const base = L * 34 * h.k
      ctx.globalAlpha = 0.10 * (1 - L / 11)
      ctx.beginPath()
      for (let i = 0; i <= 72; i++) {
        const a = (i / 72) * Math.PI * 2
        /* the wobble grows with the level, the way real contours
           get more irregular as they leave the summit */
        const w = 1
          + 0.10 * (L / 9) * Math.sin(3 * a + t * 0.22 + h.ph)
          + 0.06 * (L / 9) * Math.cos(5 * a - t * 0.15 + h.ph)
        const x = h.cx + Math.cos(a) * base * w * 1.35
        const y = h.cy + Math.sin(a) * base * w
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.stroke()
    }
  }
}

/* ── current: the only room that actually flows ── */
const paintStreams: Painter = (ctx, t, accent) => {
  const LANES = 11
  const gap = STAGE_H / LANES

  /* the lattice the carriers have to get past */
  ctx.globalAlpha = 0.05
  ctx.fillStyle = accent
  for (let i = 0; i < 22; i++) {
    for (let j = 0; j < LANES; j++) {
      ctx.beginPath()
      ctx.arc(30 + i * 60, gap * (j + 0.5), 2.4, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  /* carriers drifting right, each lane at its own pace */
  ctx.lineCap = 'round'
  for (let j = 0; j < LANES; j++) {
    const y = gap * (j + 0.5) + (rnd(j, 7) - 0.5) * 14
    const v = 26 + rnd(j, 8) * 44
    for (let i = 0; i < 9; i++) {
      const x = ((rnd(j * 9 + i, 9) * STAGE_W) + t * v) % (STAGE_W + 140) - 70
      const trail = 16 + v * 0.34
      ctx.globalAlpha = 0.055 + 0.035 * Math.sin(t * 0.8 + i + j)
      ctx.strokeStyle = accent
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(x - trail, y)
      ctx.lineTo(x, y)
      ctx.stroke()
    }
  }
}

/* ── dielectric: dipoles drifting between disorder and alignment ── */
const paintDipoles: Painter = (ctx, t, accent) => {
  const STEP = 76
  const cols = Math.ceil(STAGE_W / STEP) + 1
  const rows = Math.ceil(STAGE_H / STEP) + 1
  /* the whole field polarises and relaxes on a long slow cycle */
  const align = 0.5 + 0.5 * Math.sin(t * 0.16)

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = i * STEP + 34
      const y = j * STEP + 30
      const rest = rnd(i * 37 + j, 11) * Math.PI * 2
      /* every dipole rotates from its own random rest angle toward the
         field direction, and back — that is polarisation, drawn */
      const ang = rest * (1 - align)
      const L = 11 + align * 4
      const dx = Math.cos(ang) * L
      const dy = Math.sin(ang) * L

      ctx.globalAlpha = 0.05 + align * 0.05
      ctx.strokeStyle = accent
      ctx.lineWidth = 1.6
      ctx.beginPath()
      ctx.moveTo(x - dx, y - dy)
      ctx.lineTo(x + dx, y + dy)
      ctx.stroke()

      ctx.globalAlpha = 0.09 + align * 0.07
      ctx.fillStyle = accent
      ctx.beginPath()
      ctx.arc(x + dx, y + dy, 2.2, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}

const PAINTERS: Record<AmbientKind, Painter> = {
  shards: paintShards,
  shells: paintShells,
  contours: paintContours,
  streams: paintStreams,
  dipoles: paintDipoles,
}

export function Ambient({ theme, accent }: { theme: DeckTheme; accent: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  /* the accent follows the current act, and it must not restart the
     loop when it changes — hence the ref rather than a dependency */
  const accentRef = useRef(accent)
  accentRef.current = accent

  useEffect(() => {
    if (prefersReducedMotion()) return
    const cv = ref.current
    if (!cv) return
    const ctx = cv.getContext('2d')
    if (!ctx) return

    const paint = PAINTERS[theme.ambient]
    let raf = 0
    const start = performance.now()
    const loop = (now: number) => {
      const t = Math.max(0, (now - start) / 1000)
      ctx.clearRect(0, 0, STAGE_W, STAGE_H)
      ctx.save()
      paint(ctx, t, accentRef.current)
      ctx.restore()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [theme.ambient])

  return (
    <canvas ref={ref} width={STAGE_W} height={STAGE_H}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}/>
  )
}

/* ═══════════════════════════════════════════════════════════
   THE BACKDROP

   The full-bleed scene behind covers, section openers, the summary
   and the closing slide. Authored as SVG rather than sourced as
   photography: it costs no network request, it can be tinted per
   act, and it can actually depict the subject.
═══════════════════════════════════════════════════════════ */
function Motes({ accent, n = 30 }: { accent: string; n?: number }) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => (
        <circle key={i} cx={rnd(i, 21) * 600} cy={rnd(i, 22) * 720}
          r={0.6 + rnd(i, 23) * 1.9} fill={accent} opacity=".3"
          className="float-loop"
          style={{ animationDelay: `${-rnd(i, 24) * 6}s`, animationDuration: `${5 + rnd(i, 25) * 6}s` }}/>
      ))}
    </>
  )
}

export function Backdrop({ theme, accent, flip = false }:
  { theme: DeckTheme; accent: string; flip?: boolean }) {
  const A = accent
  return (
    <svg viewBox="0 0 600 720" preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 w-full h-full"
      style={{ transform: flip ? 'scaleX(-1)' : undefined }}>
      <defs>
        <linearGradient id="bdShaft" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={A} stopOpacity=".22"/>
          <stop offset="55%" stopColor={A} stopOpacity=".07"/>
          <stop offset="100%" stopColor={A} stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="bdBody" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor={A} stopOpacity=".30"/>
          <stop offset="100%" stopColor={theme.panel} stopOpacity=".05"/>
        </linearGradient>
        <linearGradient id="bdFloor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={theme.base} stopOpacity="0"/>
          <stop offset="100%" stopColor={theme.base} stopOpacity=".96"/>
        </linearGradient>
        <radialGradient id="bdCore">
          <stop offset="0%" stopColor={A} stopOpacity=".55"/>
          <stop offset="100%" stopColor={A} stopOpacity="0"/>
        </radialGradient>
      </defs>

      <rect width="600" height="720" fill={theme.base}/>

      {/* ── charge at rest: a hall of ice, shards rising from the floor ── */}
      {theme.ambient === 'shards' && (
        <>
          <polygon points="300,-40 420,720 180,720" fill="url(#bdShaft)"/>
          {[
            'M 20 720 L 62 356 L 108 720 Z',
            'M 96 720 L 138 452 L 176 720 Z',
            'M 168 720 L 232 214 L 288 720 Z',
            'M 262 720 L 318 132 L 372 720 Z',
            'M 348 720 L 402 300 L 450 720 Z',
            'M 428 720 L 476 424 L 522 720 Z',
            'M 508 720 L 556 268 L 600 720 Z',
          ].map((d, i) => (
            <path key={i} d={d} fill="url(#bdBody)" stroke={A} strokeWidth=".8" strokeOpacity=".18"/>
          ))}
          {[
            'M 66 -20 L 104 168 L 132 -20 Z',
            'M 214 -20 L 246 112 L 276 -20 Z',
            'M 392 -20 L 424 196 L 452 -20 Z',
            'M 512 -20 L 540 96 L 566 -20 Z',
          ].map((d, i) => (
            <path key={`v${i}`} d={d} fill="url(#bdBody)" stroke={A} strokeWidth=".7" strokeOpacity=".14"/>
          ))}
        </>
      )}

      {/* ── flux: nested closed surfaces, all counting the same charge ── */}
      {theme.ambient === 'shells' && (
        <>
          <circle cx="300" cy="330" r="150" fill="url(#bdCore)" opacity=".5"/>
          {[70, 122, 178, 240, 308, 384].map((r, i) => (
            <path key={i}
              d={Array.from({ length: 73 }, (_, k) => {
                const a = (k / 72) * Math.PI * 2
                /* each shell is a little more irregular than the last —
                   the theorem does not care, and saying so is the point */
                const w = 1 + 0.06 * (i / 5) * Math.sin(3 * a + i)
                          + 0.04 * (i / 5) * Math.cos(5 * a - i)
                return `${k ? 'L' : 'M'} ${(300 + Math.cos(a) * r * w).toFixed(1)} ${(330 + Math.sin(a) * r * w * 0.94).toFixed(1)}`
              }).join(' ') + ' Z'}
              fill="none" stroke={A} strokeWidth="1.1" strokeOpacity={0.30 - i * 0.04}/>
          ))}
          {Array.from({ length: 20 }, (_, i) => {
            const a = (i / 20) * Math.PI * 2
            return (
              <line key={`r${i}`}
                x1={300 + Math.cos(a) * 40} y1={330 + Math.sin(a) * 40}
                x2={300 + Math.cos(a) * 460} y2={330 + Math.sin(a) * 460}
                stroke={A} strokeWidth=".8" strokeOpacity=".12"/>
            )
          })}
        </>
      )}

      {/* ── potential: a hill drawn as the level curves of a scalar ── */}
      {theme.ambient === 'contours' && (
        <>
          {Array.from({ length: 14 }, (_, i) => {
            const r = 34 + i * 34
            return (
              <path key={i}
                d={Array.from({ length: 73 }, (_, k) => {
                  const a = (k / 72) * Math.PI * 2
                  const w = 1 + 0.13 * (i / 13) * Math.sin(3 * a + 0.7)
                            + 0.08 * (i / 13) * Math.cos(5 * a - 1.2)
                  return `${k ? 'L' : 'M'} ${(268 + Math.cos(a) * r * w * 1.4).toFixed(1)} ${(430 + Math.sin(a) * r * w).toFixed(1)}`
                }).join(' ') + ' Z'}
                fill={i === 0 ? `${A}22` : 'none'}
                stroke={A} strokeWidth="1.1" strokeOpacity={0.34 - i * 0.021}/>
            )
          })}
          {/* the gradient: perpendicular to every level it crosses */}
          <line x1="268" y1="430" x2="268" y2="96" stroke={A} strokeWidth="2" strokeOpacity=".3"/>
          <polygon points="268,84 262,102 274,102" fill={A} opacity=".38"/>
        </>
      )}

      {/* ── current: the inside of a conductor, seen down its length ── */}
      {theme.ambient === 'streams' && (
        <>
          <polygon points="0,150 600,60 600,660 0,570" fill={`${A}08`}/>
          {/* the lattice, receding */}
          {Array.from({ length: 13 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={150 + i * 35} x2="600" y2={60 + i * 50}
              stroke={A} strokeWidth=".7" strokeOpacity=".13"/>
          ))}
          {Array.from({ length: 13 }, (_, i) => (
            <line key={`v${i}`} x1={i * 50} y1={150 + i * 7.5} x2={i * 50} y2={570 + i * 7.5}
              stroke={A} strokeWidth=".7" strokeOpacity=".09"/>
          ))}
          {/* carriers streaking through it */}
          {Array.from({ length: 16 }, (_, i) => {
            const y = 180 + rnd(i, 31) * 400
            const x = rnd(i, 32) * 540
            const L = 40 + rnd(i, 33) * 90
            return (
              <line key={`s${i}`} x1={x} y1={y} x2={x + L} y2={y - L * 0.14}
                stroke={A} strokeWidth="2" strokeOpacity=".22" strokeLinecap="round"
                className="float-loop"
                style={{ animationDelay: `${-rnd(i, 34) * 5}s`, animationDuration: `${4 + rnd(i, 35) * 4}s` }}/>
            )
          })}
        </>
      )}

      {/* ── dielectric: slabs of material, with the dipoles lined up ── */}
      {theme.ambient === 'dipoles' && (
        <>
          {[110, 300, 490].map((y, s) => (
            <g key={s}>
              <rect x="-20" y={y} width="640" height="112" fill={`${A}0b`}
                stroke={A} strokeWidth=".9" strokeOpacity=".18"/>
              {Array.from({ length: 11 }, (_, i) => {
                const cx = 20 + i * 58
                const cy = y + 56
                /* rows nearer the plates are more perfectly aligned */
                const tilt = (rnd(i * 3 + s, 41) - 0.5) * (0.5 + s * 0.18)
                const dx = Math.cos(tilt) * 15
                const dy = Math.sin(tilt) * 15
                return (
                  <g key={i}>
                    <line x1={cx - dx} y1={cy - dy} x2={cx + dx} y2={cy + dy}
                      stroke={A} strokeWidth="1.6" strokeOpacity=".3"/>
                    <circle cx={cx + dx} cy={cy + dy} r="3" fill={A} opacity=".34"/>
                    <circle cx={cx - dx} cy={cy - dy} r="3" fill={A} opacity=".16"/>
                  </g>
                )
              })}
            </g>
          ))}
          <rect x="-20" y="86" width="640" height="8" fill={A} opacity=".22"/>
          <rect x="-20" y="608" width="640" height="8" fill={A} opacity=".22"/>
        </>
      )}

      <Motes accent={A}/>
      <rect y="430" width="600" height="290" fill="url(#bdFloor)"/>
    </svg>
  )
}

/* ═══════════════════════════════════════════════════════════
   THE HEADING ORNAMENT

   Every heading rests on a rule that ends in something. What it ends
   in is the deck's signature, and it says what the deck is about:
   ice that shatters, a wavefront, a stack of levels, a flow, an
   alignment.
═══════════════════════════════════════════════════════════ */
export function Ornament({ theme, accent, delay = 3, width = 300 }:
  { theme: DeckTheme; accent: string; delay?: number; width?: number }) {
  const d = (i: number): CSSProperties => ({ animationDelay: `${0.06 + i * 0.075}s` })

  return (
    <svg width={width} height="16" viewBox="0 0 300 16"
      style={{ display: 'block', marginTop: 16, overflow: 'visible' }}>
      <line className="rule-grow" x1="0" y1="8" x2="178" y2="8"
        stroke={accent} strokeWidth="2" strokeLinecap="round" style={d(delay)}/>

      {theme.ornament === 'shards' && [
        { x: 186, s: 5.4, o: 0.95 }, { x: 205, s: 4.4, o: 0.72 },
        { x: 227, s: 3.4, o: 0.5 }, { x: 252, s: 2.6, o: 0.32 },
        { x: 278, s: 1.8, o: 0.18 },
      ].map((sh, i) => (
        <polygon key={i} className="orn-land"
          points={`${sh.x},${8 - sh.s} ${sh.x + sh.s},8 ${sh.x},${8 + sh.s} ${sh.x - sh.s},8`}
          fill={accent} opacity={sh.o} style={d(delay + 1.2 + i * 0.5)}/>
      ))}

      {/* a wavefront leaving the rule, the way flux leaves a charge */}
      {theme.ornament === 'arcs' && [0, 1, 2, 3].map(i => (
        <path key={i} className="orn-land"
          d={`M ${188 + i * 22} 0 Q ${196 + i * 22} 8 ${188 + i * 22} 16`}
          fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round"
          opacity={0.9 - i * 0.2} style={d(delay + 1.2 + i * 0.6)}/>
      ))}

      {/* a stack of levels, like the contours of a scalar field */}
      {theme.ornament === 'levels' && [0, 1, 2, 3].map(i => (
        <line key={i} className="orn-land"
          x1={188} y1={8 - 6 + i * 4} x2={188 + 74 - i * 16} y2={8 - 6 + i * 4}
          stroke={accent} strokeWidth="1.6" strokeLinecap="round"
          opacity={0.85 - i * 0.18} style={d(delay + 1.2 + i * 0.5)}/>
      ))}

      {/* chevrons, pointing the way the carriers go */}
      {theme.ornament === 'flow' && [0, 1, 2, 3].map(i => (
        <polyline key={i} className="orn-land"
          points={`${186 + i * 20},2 ${196 + i * 20},8 ${186 + i * 20},14`}
          fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          opacity={0.9 - i * 0.2} style={d(delay + 1.2 + i * 0.5)}/>
      ))}

      {/* dipoles, snapping into line */}
      {theme.ornament === 'dipoles' && [0, 1, 2, 3, 4].map(i => (
        <g key={i} className="orn-land" style={d(delay + 1.2 + i * 0.45)}
          opacity={0.9 - i * 0.16}>
          <line x1={186 + i * 20} y1={12} x2={196 + i * 20} y2={4}
            stroke={accent} strokeWidth="1.7" strokeLinecap="round"/>
          <circle cx={196 + i * 20} cy={4} r="2.2" fill={accent}/>
        </g>
      ))}
    </svg>
  )
}
