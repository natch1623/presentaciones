import { Fragment, useState, type CSSProperties, type ReactNode } from 'react'
import {
  ORO, ESCARCHA, AURORA, VIOLETA, BRASA, HIELO, POS, NEG, U, MID,
  Board, Charge, Vec, MLabel, VLabel, RLabel, DragHandle, useDrag, useTick, fxTspans,
  Deck, THEMES, type Act, type SD,
} from './deck'

/* ═══════════════════════════════════════════════════════════
   ANIMATED SVG DIAGRAMS
═══════════════════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════════════════
   ANIMATED SVG DIAGRAMS
═══════════════════════════════════════════════════════════ */

/* ── 01 · Charge is quantised: a frozen lattice, one cell circled ── */
function ChargeQuantumDiagram() {
  const t = useTick()
  /* A triangular lattice — the closest thing to a crystal that still
     reads at this size. Signs alternate in a fixed pattern so the
     picture is a neutral solid with charge locked inside it. */
  const cells: { x: number; y: number; s: 1 | -1 }[] = []
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 8; c++) {
      const x = 42 + c * 30 + (r % 2 ? 15 : 0)
      const y = 72 + r * 26
      if (x > 272) continue
      cells.push({ x, y, s: (r + c) % 2 === 0 ? 1 : -1 })
    }
  }
  const hi = { x: 162, y: 150 }
  const pulse = 0.5 + 0.5 * Math.sin(t * 1.6)

  return (
    <Board
      chip="Q = N · e"
      chipSub="toda carga es un múltiplo entero de la carga elemental"
      chipColor={ORO}
      foot={<>
        <RLabel x={24} y={252} text="e = 1.602 × 10^{−19} C" color={ORO} size={11}/>
        <RLabel x={24} y={268} text="1 C ≙ 6.24 × 10^{18} cargas elementales" color="rgba(220,238,248,.5)" size={9.6}/>
        <RLabel x={24} y={283} text="la carga se conserva y no depende de la velocidad" color="rgba(220,238,248,.35)" size={9.6}/>
      </>}>
      {cells.map((c, i) => (
        <g key={i} className="pop" style={{ animationDelay: `${0.05 + i * 0.012}s` }}>
          <circle cx={c.x} cy={c.y} r="3.4"
            fill={c.s > 0 ? POS : NEG}
            opacity={c.x === hi.x && c.y === hi.y ? 1 : 0.42}/>
        </g>
      ))}
      {/* lattice bonds, faint — this is a solid, not a gas */}
      {cells.map((c, i) => {
        const right = cells.find(o => Math.abs(o.x - c.x - 30) < 1 && o.y === c.y)
        return right ? (
          <line key={`b${i}`} x1={c.x} y1={c.y} x2={right.x} y2={right.y}
            stroke={ESCARCHA} strokeWidth=".5" opacity=".13"/>
        ) : null
      })}
      <circle cx={hi.x} cy={hi.y} r={13 + pulse * 3} fill="none"
        stroke={ORO} strokeWidth="1.3" opacity={0.85 - pulse * 0.3}/>
      <line className="svg-draw d5" x1={hi.x + 14} y1={hi.y - 8} x2={228} y2={202}
        stroke={ORO} strokeWidth="1" opacity=".55"
        style={{ strokeDasharray: 90, strokeDashoffset: 90 } as CSSProperties}/>
      <MLabel x={232} y={214} text="e" color={ORO} anchor="start" size={13} delay="d7"/>
      <VLabel x={150} y={62} text="carga congelada en la red" color="rgba(220,238,248,.42)" size={10.5} delay="d3"/>
    </Board>
  )
}

/* ── 02 · The three charge densities, one at a time ── */
function ChargeDistributionsDiagram() {
  const [mode, setMode] = useState(0)
  const t = useTick()
  const glow = 0.55 + 0.45 * Math.sin(t * 2)

  const TABS = [
    { k: 'ρ_L', name: 'línea',      u: 'C/m',  q: 'Q = ∫_L ρ_L dL' },
    { k: 'ρ_S', name: 'superficie', u: 'C/m²', q: 'Q = ∫_S ρ_S dS' },
    { k: 'ρ_v', name: 'volumen',    u: 'C/m³', q: 'Q = ∫_{vol} ρ_v dv' },
  ]
  const tab = TABS[mode]

  return (
    <Board
      foot={<>
        <RLabel x={24} y={252} text={tab.q} color={ESCARCHA} size={12}/>
        <RLabel x={24} y={269} text={`${tab.k} en ${tab.u} — densidad de carga por ${tab.name}`}
          color="rgba(220,238,248,.5)" size={9.4}/>
        <RLabel x={24} y={284} text="el elemento naranja es dQ, la carga de un trozo"
          color="rgba(220,238,248,.34)" size={9.2}/>
      </>}>
      {/* tab strip, in the header band */}
      {TABS.map((tb, i) => (
        <g key={i} onPointerDown={() => setMode(i)} style={{ cursor: 'pointer' }}>
          <rect x={14 + i * 92} y={8} width="88" height="26" rx="6"
            fill={i === mode ? `${ESCARCHA}26` : 'rgba(160,200,232,.05)'}
            stroke={i === mode ? ESCARCHA : 'rgba(160,200,232,.18)'} strokeWidth="1"/>
          <text x={58 + i * 92} y={25} textAnchor="middle"
            fill={i === mode ? ESCARCHA : 'rgba(220,238,248,.45)'}
            fontSize="12" fontFamily="JetBrains Mono,monospace">
            {fxTspans(tb.k)}
          </text>
        </g>
      ))}

      {mode === 0 && (
        <g>
          <line className="svg-draw d1" x1={44} y1={MID} x2={256} y2={MID}
            stroke={NEG} strokeWidth="4" strokeLinecap="round"
            style={{ strokeDasharray: 232, strokeDashoffset: 232 } as CSSProperties}/>
          {Array.from({ length: 15 }, (_, i) => (
            <line key={i} x1={48 + i * 15} y1={MID - 7} x2={48 + i * 15} y2={MID + 7}
              stroke={NEG} strokeWidth="1" opacity=".4"/>
          ))}
          <rect x={148} y={MID - 9} width="26" height="18" rx="3"
            fill={POS} fillOpacity={0.18 + glow * 0.2} stroke={POS} strokeWidth="1.4"/>
          <MLabel x={161} y={MID - 18} text="dL" color={POS} size={11} delay="d4"/>
          <MLabel x={161} y={MID + 34} text="dQ = ρ_L dL" color="rgba(220,238,248,.62)" size={11} delay="d5"/>
          <VLabel x={150} y={82} text="un alambre delgado" color="rgba(220,238,248,.4)" size={10.5} delay="d2"/>
        </g>
      )}

      {mode === 1 && (
        <g>
          <polygon className="pop d1" points="52,178 150,132 248,178 150,224"
            fill={`${NEG}1c`} stroke={NEG} strokeWidth="1.8"/>
          {/* ruling lines, so the sheet reads as a surface in perspective */}
          {[0.25, 0.5, 0.75].map((f, i) => (
            <line key={i}
              x1={52 + (150 - 52) * f} y1={178 - (178 - 132) * f}
              x2={150 + (248 - 150) * f} y2={224 - (224 - 178) * f}
              stroke={NEG} strokeWidth=".7" opacity=".3"/>
          ))}
          {[0.25, 0.5, 0.75].map((f, i) => (
            <line key={`b${i}`}
              x1={52 + (150 - 52) * f} y1={178 + (224 - 178) * f}
              x2={150 + (248 - 150) * f} y2={132 + (178 - 132) * f}
              stroke={NEG} strokeWidth=".7" opacity=".3"/>
          ))}
          <polygon points="150,166 172,177 150,188 128,177"
            fill={POS} fillOpacity={0.2 + glow * 0.22} stroke={POS} strokeWidth="1.4"/>
          <MLabel x={150} y={204} text="dS" color={POS} size={11} delay="d4"/>
          <MLabel x={150} y={244 - 32} text="dQ = ρ_S dS" color="rgba(220,238,248,.62)" size={11} delay="d5"/>
          <VLabel x={150} y={104} text="una lámina o una placa" color="rgba(220,238,248,.4)" size={10.5} delay="d2"/>
        </g>
      )}

      {mode === 2 && (() => {
        /* an isometric box: front face, top face, right face */
        const ox = 150, oy = 178, w = 74, h = 52, dx = 40, dy = -26
        return (
          <g className="pop d1">
            <polygon points={`${ox - w / 2},${oy} ${ox + w / 2},${oy} ${ox + w / 2},${oy - h} ${ox - w / 2},${oy - h}`}
              fill={`${NEG}1c`} stroke={NEG} strokeWidth="1.6"/>
            <polygon points={`${ox - w / 2},${oy - h} ${ox + w / 2},${oy - h} ${ox + w / 2 + dx},${oy - h + dy} ${ox - w / 2 + dx},${oy - h + dy}`}
              fill={`${NEG}12`} stroke={NEG} strokeWidth="1.6"/>
            <polygon points={`${ox + w / 2},${oy} ${ox + w / 2 + dx},${oy + dy} ${ox + w / 2 + dx},${oy - h + dy} ${ox + w / 2},${oy - h}`}
              fill={`${NEG}0a`} stroke={NEG} strokeWidth="1.6"/>
            <rect x={ox - 10} y={oy - 34} width="20" height="16"
              fill={POS} fillOpacity={0.2 + glow * 0.22} stroke={POS} strokeWidth="1.4"/>
            <MLabel x={ox} y={oy + 22} text="dv" color={POS} size={11} delay="d4"/>
            <MLabel x={ox} y={oy + 38} text="dQ = ρ_v dv" color="rgba(220,238,248,.62)" size={11} delay="d5"/>
            <VLabel x={150} y={104} text="un cuerpo con espesor" color="rgba(220,238,248,.4)" size={10.5} delay="d2"/>
          </g>
        )
      })()}
    </Board>
  )
}

/* ── 03 · Coulomb's law, with a draggable second charge ── */
function CoulombDiagram() {
  const A = { x: 82, y: 152 }                      /* Q1, fixed, positive */
  const [B, setB] = useState({ x: 188, y: 106 })   /* Q2, draggable, negative */

  const { svgRef, handleMove, start, stop } = useDrag((x, y) => {
    /* keep it inside the stage band, and never let the two charges
       overlap — the 1/R² arrow would blow up off the board */
    const cx = Math.max(120, Math.min(272, x))
    const cy = Math.max(66, Math.min(214, y))
    const d = Math.hypot(cx - A.x, cy - A.y)
    if (d < 62) return
    setB({ x: cx, y: cy })
  })

  const dx = B.x - A.x
  const dy = B.y - A.y
  const dist = Math.hypot(dx, dy)
  const ux = dx / dist
  const uy = dy / dist
  const R = dist / U                                /* board units → metres */

  /* Q1 = +20 µC, Q2 = −10 µC  ⇒  |F| = 9e9·20e-6·10e-6 / R² = 1.8/R² N */
  const Fmag = 1.8 / (R * R)
  const arrow = Math.max(16, Math.min(58, 340 / (R * R)))

  return (
    <Board grab svgRef={svgRef} onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}
      chip="*F* = @{Q_1 Q_2}{4πε_0 R^2} *a*_{12}"
      chipSub="cargas opuestas → la fuerza es de atracción"
      chipColor={ORO}
      foot={<>
        <RLabel x={24} y={251} text={`R = ${R.toFixed(2)} m`} color={ESCARCHA} size={11}/>
        <RLabel x={150} y={251} text={`|*F*| = ${Fmag.toFixed(3)} N`} color={ORO} size={11}/>
        <RLabel x={24} y={268} text="Q_1 = +20 µC     Q_2 = −10 µC" color="rgba(220,238,248,.5)" size={9.4}/>
        <RLabel x={24} y={283} text="al duplicar R la fuerza cae a la cuarta parte" color="rgba(220,238,248,.34)" size={9.2}/>
      </>}>
      {/* line of action */}
      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y}
        stroke="rgba(220,238,248,.22)" strokeWidth="1" strokeDasharray="4 4"/>
      <MLabel x={(A.x + B.x) / 2 + 8} y={(A.y + B.y) / 2 - 8} text="R"
        color="rgba(220,238,248,.5)" anchor="start" size={11} delay="d3"/>

      {/* the two forces: equal in magnitude, opposite in direction */}
      <Vec x1={A.x + ux * 16} y1={A.y + uy * 16}
        x2={A.x + ux * (16 + arrow)} y2={A.y + uy * (16 + arrow)}
        color={ORO} marker="aG" delay="d4" width={2.6}/>
      <Vec x1={B.x - ux * 16} y1={B.y - uy * 16}
        x2={B.x - ux * (16 + arrow)} y2={B.y - uy * (16 + arrow)}
        color={ORO} marker="aG" delay="d4" width={2.6}/>

      <Charge x={A.x} y={A.y} sign={1} label="Q_1"/>
      <g>
        <Charge x={B.x} y={B.y} sign={-1} label="Q_2"/>
        <DragHandle x={B.x} y={B.y} onDown={start('b')} color={NEG}/>
      </g>
    </Board>
  )
}

/* ── 04 · Superposition: three forces and their resultant ── */
function SuperpositionDiagram() {
  const P = { x: 152, y: 150 }
  /* sources: two positive, one negative, so both senses appear */
  const src: { x: number; y: number; s: 1 | -1; q: number }[] = [
    { x: 62,  y: 86,  s: 1,  q: 6 },
    { x: 250, y: 96,  s: 1,  q: 4 },
    { x: 146, y: 222, s: -1, q: 5 },
  ]

  /* Compute the real resultant rather than eyeballing it: a wrong
     parallelogram on a superposition slide is worse than no diagram. */
  const parts = src.map(s => {
    const dx = P.x - s.x
    const dy = P.y - s.y
    const r = Math.hypot(dx, dy)
    const m = (s.q * 1400) / (r * r)         /* ∝ q/r², scaled to the board */
    /* on a positive test charge: pushed away from +, pulled toward − */
    const sign = s.s > 0 ? 1 : -1
    return { fx: (dx / r) * m * sign, fy: (dy / r) * m * sign }
  })
  const Rx = parts.reduce((a, p) => a + p.fx, 0)
  const Ry = parts.reduce((a, p) => a + p.fy, 0)

  return (
    <Board
      chip="*F* = *F*_1 + *F*_2 + *F*_3"
      chipSub="suma vectorial — nunca suma de magnitudes"
      chipColor={ORO}
      foot={<>
        <RLabel x={24} y={252} text="cada fuente actúa como si el resto no existiera" color={ESCARCHA} size={9.8}/>
        <RLabel x={24} y={268} text="sin términos de interferencia: sólo se suman" color="rgba(220,238,248,.5)" size={9.2}/>
        <RLabel x={24} y={283} text="la resultante en oro cierra el polígono" color="rgba(220,238,248,.34)" size={9.2}/>
      </>}>
      {src.map((s, i) => (
        <Fragment key={i}>
          <line x1={s.x} y1={s.y} x2={P.x} y2={P.y}
            stroke="rgba(220,238,248,.13)" strokeWidth=".8" strokeDasharray="3 4"/>
          <Vec x1={P.x} y1={P.y} x2={P.x + parts[i].fx} y2={P.y + parts[i].fy}
            color={s.s > 0 ? POS : NEG} marker={s.s > 0 ? 'aR' : 'aB'}
            delay={`d${3 + i}`} width={1.9} glow={false}/>
          <Charge x={s.x} y={s.y} sign={s.s} r={9} label={`Q_${i + 1}`} delay={`d${1 + i}`}/>
        </Fragment>
      ))}

      {/* the resultant, drawn last and heaviest */}
      <Vec x1={P.x} y1={P.y} x2={P.x + Rx} y2={P.y + Ry}
        color={ORO} marker="aG" delay="d7" width={3}/>
      <MLabel x={P.x + Rx + 6} y={P.y + Ry + 4} text="*F*" color={ORO} anchor="start" size={13} delay="d8"/>

      <circle cx={P.x} cy={P.y} r="5" fill={HIELO} opacity=".9" className="pop d6"/>
      <MLabel x={P.x - 10} y={P.y + 16} text="q" color="rgba(220,238,248,.7)" anchor="end" size={11} delay="d6"/>
    </Board>
  )
}

/* ── 05 · Field of a point charge, with a draggable field point ── */
function PointChargeFieldDiagram() {
  const O = { x: 150, y: MID }
  const [P, setP] = useState({ x: 232, y: 104 })

  const { svgRef, handleMove, start, stop } = useDrag((x, y) => {
    const dx = x - O.x
    const dy = y - O.y
    const r = Math.max(44, Math.min(88, Math.hypot(dx, dy)))
    const a = Math.atan2(dy, dx)
    setP({ x: O.x + Math.cos(a) * r, y: O.y + Math.sin(a) * r })
  })

  const dx = P.x - O.x
  const dy = P.y - O.y
  const dist = Math.hypot(dx, dy)
  const ux = dx / dist
  const uy = dy / dist
  const R = dist / U

  /* Q = +4 nC ⇒ E = 9e9·4e-9 / R² = 36/R² V/m */
  const E = 36 / (R * R)
  const arrow = Math.max(18, Math.min(52, 300 / (R * R)))

  return (
    <Board grab svgRef={svgRef} onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}
      chip="*E* = @{Q}{4πε_0 R^2} *a*_R"
      chipSub="radial hacia afuera, y cae con el cuadrado de la distancia"
      chipColor={AURORA}
      foot={<>
        <RLabel x={24} y={251} text={`R = ${R.toFixed(2)} m`} color={ESCARCHA} size={11}/>
        <RLabel x={144} y={251} text={`|*E*| = ${E.toFixed(1)} V/m`} color={AURORA} size={11}/>
        <RLabel x={24} y={268} text="Q = +4 nC     E = 36 / R^2  V/m" color="rgba(220,238,248,.5)" size={9.4}/>
        <RLabel x={24} y={283} text="*a*_R va de la carga al punto de campo" color="rgba(220,238,248,.34)" size={9.2}/>
      </>}>
      {/* the radial field itself: two rings of arrows, shorter further out */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        const ca = Math.cos(a)
        const sa = Math.sin(a)
        return (
          <Fragment key={i}>
            <line x1={O.x + ca * 22} y1={O.y + sa * 22}
              x2={O.x + ca * 44} y2={O.y + sa * 44}
              stroke={POS} strokeWidth="1.5" opacity=".5" markerEnd="url(#aRs)"/>
            <line x1={O.x + ca * 58} y1={O.y + sa * 58}
              x2={O.x + ca * 70} y2={O.y + sa * 70}
              stroke={POS} strokeWidth="1.2" opacity=".26" markerEnd="url(#aRs)"/>
          </Fragment>
        )
      })}

      <line x1={O.x} y1={O.y} x2={P.x} y2={P.y}
        stroke="rgba(220,238,248,.28)" strokeWidth="1" strokeDasharray="4 4"/>
      <MLabel x={(O.x + P.x) / 2 - 10} y={(O.y + P.y) / 2 - 6} text="R"
        color="rgba(220,238,248,.55)" anchor="end" size={11} delay="d3"/>

      <Vec x1={P.x} y1={P.y} x2={P.x + ux * arrow} y2={P.y + uy * arrow}
        color={AURORA} marker="aGr" delay="d4" width={2.8}/>
      <MLabel x={P.x + ux * (arrow + 14)} y={P.y + uy * (arrow + 14) + 4}
        text="*E*" color={AURORA} size={13} delay="d6"/>

      <Charge x={O.x} y={O.y} sign={1} label="Q"/>
      <DragHandle x={P.x} y={P.y} onDown={start('p')} color={ESCARCHA}/>
      <MLabel x={P.x + 20} y={P.y - 14} text="P" color={ESCARCHA} anchor="start" size={11.5} delay="d5"/>
    </Board>
  )
}

/* ── 06 · Discrete distribution: the resultant field at a moving P ── */
function DiscreteChargesDiagram() {
  const Q: { x: number; y: number; s: 1 | -1; q: number; n: string }[] = [
    { x: 76,  y: 196, s: 1,  q: 5, n: 'Q_1' },
    { x: 226, y: 196, s: -1, q: 5, n: 'Q_2' },
  ]
  const [P, setP] = useState({ x: 150, y: 104 })

  const { svgRef, handleMove, start, stop } = useDrag((x, y) => {
    const cx = Math.max(38, Math.min(262, x))
    const cy = Math.max(66, Math.min(178, y))
    /* stay clear of the sources, or the 1/r² arrows leave the board */
    for (const q of Q) if (Math.hypot(cx - q.x, cy - q.y) < 46) return
    setP({ x: cx, y: cy })
  })

  const parts = Q.map(q => {
    const dx = P.x - q.x
    const dy = P.y - q.y
    const r = Math.hypot(dx, dy)
    const m = (q.q * 1100) / (r * r)
    const sign = q.s > 0 ? 1 : -1
    return { fx: (dx / r) * m * sign, fy: (dy / r) * m * sign }
  })
  const Rx = parts.reduce((a, p) => a + p.fx, 0)
  const Ry = parts.reduce((a, p) => a + p.fy, 0)
  const Rmag = Math.hypot(Rx, Ry)
  const ang = (Math.atan2(-Ry, Rx) * 180) / Math.PI

  return (
    <Board grab svgRef={svgRef} onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}
      chip="*E* = Σ @{Q_m}{4πε_0 |*r*−*r*_m|^2} *a*_m"
      chipSub="una suma vectorial, término por término"
      chipColor={AURORA}
      foot={<>
        <RLabel x={24} y={251} text={`|*E*| ∝ ${(Rmag / 10).toFixed(1)}`} color={AURORA} size={11}/>
        <RLabel x={150} y={251} text={`∠ ${ang.toFixed(0)}°`} color={ESCARCHA} size={11}/>
        <RLabel x={24} y={268} text="dos cargas iguales y opuestas — un dipolo" color="rgba(220,238,248,.5)" size={9.4}/>
        <RLabel x={24} y={283} text="en la mediatriz, E va siempre de + hacia −" color="rgba(220,238,248,.34)" size={9.2}/>
      </>}>
      {Q.map((q, i) => (
        <Fragment key={i}>
          <line x1={q.x} y1={q.y} x2={P.x} y2={P.y}
            stroke="rgba(220,238,248,.12)" strokeWidth=".8" strokeDasharray="3 4"/>
          <Vec x1={P.x} y1={P.y} x2={P.x + parts[i].fx} y2={P.y + parts[i].fy}
            color={q.s > 0 ? POS : NEG} marker={q.s > 0 ? 'aR' : 'aB'}
            delay={`d${3 + i}`} width={1.8} glow={false}/>
          <Charge x={q.x} y={q.y} sign={q.s} r={10} label={q.n} delay={`d${1 + i}`}/>
        </Fragment>
      ))}

      <Vec x1={P.x} y1={P.y} x2={P.x + Rx} y2={P.y + Ry}
        color={AURORA} marker="aGr" delay="d6" width={3}/>
      <MLabel x={P.x + Rx + 8} y={P.y + Ry - 4} text="*E*" color={AURORA} anchor="start" size={13} delay="d7"/>

      <DragHandle x={P.x} y={P.y} onDown={start('p')} color={ESCARCHA}/>
      <MLabel x={P.x - 20} y={P.y - 12} text="P" color={ESCARCHA} anchor="end" size={11.5} delay="d5"/>
    </Board>
  )
}

/* ── 07 · Infinite line of charge: the 1/ρ falloff ── */
function LineChargeDiagram() {
  const LX = 78                      /* the line sits on the z axis, edge-on */
  const [px, setPx] = useState(206)

  const { svgRef, handleMove, start, stop } = useDrag((x) => {
    setPx(Math.max(120, Math.min(272, x)))
  })

  const rho = (px - LX) / U          /* board units → metres */
  /* ρ_L = 8 nC/m ⇒ E = ρ_L / (2πε₀ρ) = 2k·ρ_L/ρ = 144/ρ V/m */
  const E = 144 / rho
  const arrow = Math.max(14, Math.min(54, 190 / rho))

  /* three fixed samples, so the falloff is visible before anyone drags */
  const samples = [128, 176, 240]

  return (
    <Board grab svgRef={svgRef} onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}
      chip="*E* = @{ρ_L}{2πε_0 ρ} *a*_ρ"
      chipSub="cae con 1/ρ — no con 1/ρ²"
      chipColor={VIOLETA}
      foot={<>
        <RLabel x={24} y={251} text={`ρ = ${rho.toFixed(2)} m`} color={ESCARCHA} size={11}/>
        <RLabel x={144} y={251} text={`|*E*| = ${E.toFixed(1)} V/m`} color={VIOLETA} size={11}/>
        <RLabel x={24} y={268} text="ρ_L = 8 nC/m     E = 144 / ρ  V/m" color="rgba(220,238,248,.5)" size={9.4}/>
        <RLabel x={24} y={283} text="ρ se mide desde la línea, no desde el origen" color="rgba(220,238,248,.34)" size={9.2}/>
      </>}>
      {/* the line of charge, running off both ends of the board */}
      <line className="svg-draw d1" x1={LX} y1={54} x2={LX} y2={226}
        stroke={NEG} strokeWidth="4" strokeLinecap="round"
        style={{ strokeDasharray: 180, strokeDashoffset: 180 } as CSSProperties}/>
      {Array.from({ length: 13 }, (_, i) => (
        <line key={i} x1={LX - 6} y1={58 + i * 14} x2={LX + 6} y2={58 + i * 14}
          stroke={NEG} strokeWidth="1" opacity=".38"/>
      ))}
      <MLabel x={LX} y={46} text="ρ_L" color={NEG} size={12} delay="d2"/>
      <MLabel x={LX} y={240} text="infinita en z" color="rgba(220,238,248,.34)" size={9} delay="d3"/>

      {/* sampled field arrows at three radii — same rule, shorter each time */}
      {samples.map((sx, i) => {
        const r = (sx - LX) / U
        const L = Math.max(12, Math.min(52, 190 / r))
        return (
          <Fragment key={i}>
            <line x1={sx} y1={84 + i * 0} x2={sx + L} y2={84}
              stroke={NEG} strokeWidth="1.6" opacity=".42" markerEnd="url(#aBs)"/>
            <line x1={sx} y1={196} x2={sx + L} y2={196}
              stroke={NEG} strokeWidth="1.6" opacity=".42" markerEnd="url(#aBs)"/>
          </Fragment>
        )
      })}

      {/* the draggable radius */}
      <line x1={LX} y1={MID} x2={px} y2={MID}
        stroke="rgba(220,238,248,.3)" strokeWidth="1" strokeDasharray="4 4"/>
      <MLabel x={(LX + px) / 2} y={MID - 9} text="ρ" color="rgba(220,238,248,.6)" size={11.5} delay="d3"/>
      <Vec x1={px} y1={MID} x2={px + arrow} y2={MID}
        color={VIOLETA} marker="aV" delay="d4" width={2.8}/>
      <MLabel x={px + arrow + 10} y={MID + 4} text="*E*" color={VIOLETA} anchor="start" size={13} delay="d6"/>
      <DragHandle x={px} y={MID} onDown={start('p')} color={ESCARCHA}/>
    </Board>
  )
}

/* ── 08 · Sheet of charge: the field that does not fall off ── */
function SheetChargeDiagram() {
  const SX = 150
  const rows = [78, 108, 138, 168, 198]
  const dists = [30, 58, 86]

  return (
    <Board
      chip="*E* = @{ρ_S}{2ε_0} *a*_N"
      chipSub="uniforme — la distancia no aparece en la fórmula"
      chipColor={VIOLETA}
      foot={<>
        <RLabel x={24} y={252} text="todas las flechas miden igual, a toda distancia" color={VIOLETA} size={9.8}/>
        <RLabel x={24} y={268} text="*a*_N es normal a la lámina y sale de ella" color="rgba(220,238,248,.5)" size={9.2}/>
        <RLabel x={24} y={283} text="un plano infinito no tiene centro del que alejarse" color="rgba(220,238,248,.34)" size={9.2}/>
      </>}>
      {/* the sheet, edge-on */}
      <line className="svg-draw d1" x1={SX} y1={58} x2={SX} y2={222}
        stroke={NEG} strokeWidth="4" strokeLinecap="round"
        style={{ strokeDasharray: 172, strokeDashoffset: 172 } as CSSProperties}/>
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={SX - 7} y1={62 + i * 14} x2={SX + 7} y2={62 + i * 14 - 6}
          stroke={NEG} strokeWidth="1" opacity=".34"/>
      ))}
      <MLabel x={SX} y={48} text="ρ_S" color={NEG} size={12} delay="d2"/>
      <MLabel x={SX} y={238} text="infinita en y, z" color="rgba(220,238,248,.34)" size={9} delay="d3"/>

      {rows.map((ry, i) =>
        dists.map((d, j) => (
          <Fragment key={`${i}-${j}`}>
            <line className="svg-marker" style={{ animationDelay: `${0.2 + (i + j) * 0.05}s` }}
              x1={SX + 12 + d - 22} y1={ry} x2={SX + 12 + d} y2={ry}
              stroke={VIOLETA} strokeWidth="1.8" opacity=".72" markerEnd="url(#aV)"/>
            <line className="svg-marker" style={{ animationDelay: `${0.2 + (i + j) * 0.05}s` }}
              x1={SX - 12 - d + 22} y1={ry} x2={SX - 12 - d} y2={ry}
              stroke={VIOLETA} strokeWidth="1.8" opacity=".72" markerEnd="url(#aV)"/>
          </Fragment>
        ))
      )}
      <MLabel x={262} y={MID - 46} text="*a*_N" color={VIOLETA} anchor="middle" size={11.5} delay="d7"/>
      <MLabel x={38} y={MID - 46} text="−*a*_N" color={VIOLETA} anchor="middle" size={11.5} delay="d7"/>
    </Board>
  )
}

/* ── 09 · Field lines: sign and density, on a slider ── */
function FieldLinesDiagram() {
  const O = { x: 150, y: 128 }
  const TRACK = { x0: 46, x1: 254, y: 212 }
  const [hx, setHx] = useState(196)

  const { svgRef, handleMove, start, stop } = useDrag((x) => {
    setHx(Math.max(TRACK.x0, Math.min(TRACK.x1, x)))
  })

  /* handle position → q ∈ [−3, +3] nC */
  const f = (hx - TRACK.x0) / (TRACK.x1 - TRACK.x0)
  const q = (f - 0.5) * 6
  const sign: 1 | -1 = q >= 0 ? 1 : -1
  const mag = Math.abs(q)
  /* line count tracks |q| — that is exactly what "density of lines is
     proportional to the magnitude" means, so the picture teaches the
     convention instead of merely obeying it */
  const n = Math.max(4, Math.round(mag * 5) + 3)
  const col = sign > 0 ? POS : NEG
  const r0 = 15
  const r1 = 74

  return (
    <Board grab svgRef={svgRef} onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}
      chip="líneas de campo eléctrico"
      chipSub="tangentes a *E*, densidad ∝ |*E*|, nunca se cruzan"
      chipColor={VIOLETA}
      foot={<>
        <RLabel x={24} y={251} text={`q = ${q >= 0 ? '+' : '−'}${mag.toFixed(1)} nC`} color={col} size={11}/>
        <RLabel x={150} y={251} text={`${n} líneas`} color="rgba(220,238,248,.6)" size={11}/>
        <RLabel x={24} y={268} text="salen de las positivas, entran en las negativas" color="rgba(220,238,248,.5)" size={9.2}/>
        <RLabel x={24} y={283} text="no se cruzan: E tendría dos direcciones ahí" color="rgba(220,238,248,.34)" size={9.2}/>
      </>}>
      {Array.from({ length: n }, (_, i) => {
        const a = (i / n) * Math.PI * 2 - Math.PI / 2
        const ca = Math.cos(a)
        const sa = Math.sin(a)
        const x1 = O.x + ca * (sign > 0 ? r0 : r1)
        const y1 = O.y + sa * (sign > 0 ? r0 : r1)
        const x2 = O.x + ca * (sign > 0 ? r1 : r0)
        const y2 = O.y + sa * (sign > 0 ? r1 : r0)
        return (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
            stroke={col} strokeWidth="1.7" opacity=".72" markerEnd="url(#aBs)"
            style={{ markerEnd: `url(#${sign > 0 ? 'aRs' : 'aBs'})` } as CSSProperties}/>
        )
      })}

      <Charge x={O.x} y={O.y} sign={sign} r={11 + mag * 1.4}/>

      {/* the slider */}
      <line x1={TRACK.x0} y1={TRACK.y} x2={TRACK.x1} y2={TRACK.y}
        stroke="rgba(160,200,232,.22)" strokeWidth="3" strokeLinecap="round"/>
      <line x1={150} y1={TRACK.y - 7} x2={150} y2={TRACK.y + 7}
        stroke="rgba(160,200,232,.35)" strokeWidth="1"/>
      <text x={TRACK.x0} y={TRACK.y + 20} textAnchor="middle" fill={NEG}
        fontSize="11" fontFamily="JetBrains Mono,monospace">−3 nC</text>
      <text x={TRACK.x1} y={TRACK.y + 20} textAnchor="middle" fill={POS}
        fontSize="11" fontFamily="JetBrains Mono,monospace">+3 nC</text>
      <DragHandle x={hx} y={TRACK.y} onDown={start('h')} color={col}/>
    </Board>
  )
}


/* ═══════════════════════════════════════════════════════════
   CONTENT
═══════════════════════════════════════════════════════════ */

/* The acts are numbered because they genuinely are a sequence: each
   one is unusable without the one before it. Roman numerals, because
   that is how the module itself is numbered in the programme. */
const ACTS: Act[] = [
  { n: 'I', title: 'La carga como fuente', range: '§ 2.1 · 2.3', color: ORO,
    desc: 'La carga eléctrica estática y las tres densidades con que se reparte: ρ_L, ρ_S y ρ_v.' },
  { n: 'II', title: 'La ley de Coulomb', range: '§ 2.1 – 2.2', color: ESCARCHA,
    desc: 'La fuerza entre dos cargas puntuales, su forma vectorial y el principio de superposición.' },
  { n: 'III', title: 'El campo eléctrico E', range: '§ 2.2 – 2.3', color: AURORA,
    desc: 'De la fuerza al campo: carga puntual, distribuciones discretas y el paso de la suma a la integral.' },
  { n: 'IV', title: 'Configuraciones y líneas', range: '§ 2.4 – 2.6', color: VIOLETA,
    desc: 'Línea infinita, lámina de carga y el trazado de las líneas de campo eléctrico.' },
]

const SLIDES: SD[] = [
  { id: 1, layout: 'cover', tag: 'MÓDULO II · PARTE A',
    title: 'Campos\nElectrostáticos',
    subtitle: 'Teoría Electromagnética I · Fuentes, ley de Coulomb y campo eléctrico',
    meta: 'Hayt & Buck · Teoría electromagnética · cap. 2 · §2.1 – 2.6',
    numeral: 'II', backdrop: true },

  { id: 2, layout: 'agenda', tag: 'Ruta',
    title: 'Cómo se arma esta parte',
    body: 'Cuatro bloques encadenados. Cada uno hace falta para el siguiente: sin carga no hay fuerza, sin fuerza no hay campo, y sin campo no hay nada que dibujar.',
    acts: ACTS },

  { id: 3, layout: 'visual', tag: 'Introducción', section: 'Intro',
    title: 'Carga en reposo',
    body: 'El módulo anterior armó el lenguaje: nabla, las integrales de línea y de superficie, los tres sistemas de coordenadas. Ahora hay algo físico que describir con él, y se empieza por el caso más quieto que existe.',
    items: [
      '"Electrostática" significa exactamente eso: las cargas están fijas y no cambian con el tiempo',
      'Esa quietud es lo que permite resolverlo todo con geometría — simetría, distancias y ángulos, nada más',
      'Todo lo que sigue en el curso (corrientes, campos magnéticos, ondas) aparece cuando esta condición se rompe',
    ],
    backdrop: true },

  { id: 4, layout: 'formula', tag: '§ 2.1', section: 'Carga',
    title: 'La carga eléctrica estática',
    body: 'La carga es la fuente de todo lo que viene: no se deduce de nada más, se mide. Tiene tres propiedades que se usan sin nombrarlas en cada problema del capítulo.',
    items: [
      'Está *cuantizada*: cualquier carga es un múltiplo entero de e = 1.602 × 10^{−19} C',
      'Se *conserva*: no se crea ni se destruye, sólo se traslada de un cuerpo a otro',
      'Es *invariante*: no cambia con la velocidad del observador, a diferencia de la masa',
    ],
    note: 'El coulomb es enorme comparado con e. Por eso, aunque la carga sea discreta, tratarla como un continuo es una aproximación excelente.',
    diagram: <ChargeQuantumDiagram/> },

  { id: 5, layout: 'formula', tag: '§ 2.3', section: 'Carga',
    title: 'Las tres densidades de carga',
    body: 'Casi nunca hay cargas puntuales sueltas: hay carga repartida. Según la geometría del cuerpo se idealiza en una, dos o tres dimensiones.',
    items: [
      'ρ_L en C/m — un alambre delgado, cuando el grosor no importa para el problema',
      'ρ_S en C/m² — una placa o una superficie conductora, cuando el espesor no importa',
      'ρ_v en C/m³ — un cuerpo con volumen; es la densidad de la que las otras dos son casos límite',
    ],
    formulas: [
      'Q = ∫_L ρ_L dL   Q = ∫_S ρ_S dS   Q = ∫_{vol} ρ_v dv',
    ],
    fCaption: 'La carga total siempre se obtiene integrando la densidad sobre la región donde vive.',
    diagram: <ChargeDistributionsDiagram/>, interactive: true,
    hint: 'Toca ρ_L · ρ_S · ρ_v para cambiar' },

  { id: 6, layout: 'example', tag: 'Ejemplo 2.2', section: 'Carga',
    title: 'Carga total por integración',
    given: 'ρ_v = 5 e^{−10^5 ρz} μC/m³  en el cilindro ρ ≤ 2 cm,  0 ≤ z ≤ 4 cm',
    items: [
      'La carga total es la integral triple de ρ_v sobre el volumen del cilindro',
      'En cilíndricas el diferencial es dv = ρ dρ dϕ dz — la ρ extra no es opcional',
      'Q = ∫_0^{0.04} ∫_0^{2π} ∫_0^{0.02} ρ_v · ρ dρ dϕ dz',
      'La integral en ϕ sólo aporta un factor 2π, porque nada depende del ángulo',
    ],
    formulas: ['Q ≈ 1.42 mC'],
    fCaption: 'Antes de integrar conviene preguntarse de qué variables depende ρ_v: cada independencia ahorra una integral.',
    practice: {
      code: 'D2.3',
      q: 'Calcula la carga total encerrada si ρ_v = 10 e^{−2z} C/m³ dentro del cubo 0 ≤ x, y, z ≤ 1.',
      a: ['Q = ∫∫∫ 10 e^{−2z} dx dy dz', 'Q = 5(1 − e^{−2}) = 4.32 C'],
    } },

  { id: 7, layout: 'formula', tag: '§ 2.1', section: '2.1',
    title: 'La ley de Coulomb',
    body: 'Coulomb midió con una balanza de torsión lo que hoy se enuncia en una línea: dos cargas puntuales se atraen o se repelen con una fuerza que cae con el cuadrado de la distancia.',
    items: [
      'La fuerza va a lo largo de la recta que une las cargas — no hay ninguna otra dirección disponible',
      'Es proporcional al producto de las cargas, así que el signo del producto decide atracción o repulsión',
      'ε_0 = 8.854 × 10^{−12} F/m, de donde 1/4πε_0 ≈ 9 × 10^9 m/F',
    ],
    formulas: ['F = @{Q_1 Q_2}{4πε_0 R^2}'],
    fCaption: 'La misma forma que la ley de gravitación de Newton — salvo que aquí la fuerza puede ser negativa.',
    diagram: <CoulombDiagram/>, interactive: true,
    hint: 'Arrastra Q₂ y observa |F|' },

  { id: 8, layout: 'formula', tag: '§ 2.1', section: '2.1',
    title: 'Forma vectorial de la fuerza',
    body: 'La expresión escalar da la magnitud pero pierde la dirección. La forma vectorial es la que realmente se usa, y se arma siempre en el mismo orden.',
    items: [
      'Primero el vector separación:  *R*_{12} = *r*_2 − *r*_1  — del punto fuente al punto de campo',
      'Después su unitario:  *a*_{12} = *R*_{12} / |*R*_{12}|  — sólo dirección, magnitud 1',
      'Y por último la fuerza, que usa |*R*_{12}|^2 en el denominador y *a*_{12} para orientarse',
    ],
    formulas: [
      '*F*_2 = @{Q_1 Q_2}{4πε_0 |*R*_{12}|^2} *a*_{12}',
    ],
    fCaption: 'Si Q_1 Q_2 > 0 la fuerza sale a lo largo de *a*_{12} (repulsión); si es negativo, apunta al revés.',
    note: 'Ese orden — separación, unitario, fuerza — resuelve solo la mitad de los problemas del capítulo. Vale la pena hacerlo siempre igual.' },

  { id: 9, layout: 'example', tag: 'Ejemplo 2.1', section: '2.1',
    title: 'Fuerza entre dos cargas puntuales',
    given: 'Q_1 = 3 × 10^{−4} C en M(1, 2, 3);   Q_2 = −10^{−4} C en N(2, 0, 5)',
    items: [
      'Separación:  *R*_{12} = *r*_2 − *r*_1 = (2−1)*a*_x + (0−2)*a*_y + (5−3)*a*_z = *a*_x − 2*a*_y + 2*a*_z',
      'Magnitud:  |*R*_{12}| = √(1 + 4 + 4) = 3',
      'Unitario:  *a*_{12} = @{1}{3}(*a*_x − 2*a*_y + 2*a*_z)',
      'Fuerza:  *F*_2 = @{(3×10^{−4})(−10^{−4})}{4π(8.854×10^{−12})(3^2)} · *a*_{12}',
    ],
    formulas: ['*F*_2 = −30 (@{*a*_x − 2*a*_y + 2*a*_z}{3}) N'],
    fCaption: 'El signo negativo dice que la fuerza sobre Q₂ apunta hacia Q₁: cargas opuestas, atracción.',
    practice: {
      code: 'Comprobación',
      q: 'La fuerza sobre Q_1 es *F*_1 = −*F*_2. Tercera ley de Newton: la misma magnitud, sentido opuesto, sobre la misma recta.',
      a: [],
    } },

  { id: 10, layout: 'formula', tag: '§ 2.1', section: '2.1',
    title: 'Superposición de fuerzas',
    body: 'Con más de dos cargas no hace falta una ley nueva. La fuerza total sobre una carga es la suma vectorial de las fuerzas que cada una de las demás ejerce por separado.',
    items: [
      'Cada par se calcula como si el resto no existiera: no hay términos de interferencia entre pares',
      'Esa linealidad es lo que hace tratable todo el electromagnetismo — y lo que justifica pasar de la suma a la integral',
      'La suma es de *vectores*: hay que descomponer en componentes, no sumar magnitudes',
    ],
    formulas: [
      '*F* = *F*_1 + *F*_2 + … + *F*_N = Σ_{m=1}^{N} @{Q Q_m}{4πε_0 |*r*−*r*_m|^2} *a*_m',
    ],
    diagram: <SuperpositionDiagram/> },

  { id: 11, layout: 'formula', tag: '§ 2.2', section: '2.2',
    title: 'Intensidad de campo eléctrico',
    body: 'Dividir la fuerza entre la carga de prueba quita del resultado toda referencia a esa carga. Lo que queda ya no describe a un par, sino al espacio mismo.',
    items: [
      'Se define con una carga de prueba positiva y unitaria, así que *E* tiene la dirección de la fuerza sobre una carga positiva',
      'Sus unidades son N/C, que más adelante se escribirán como V/m',
      'El campo existe en un punto aunque no haya nadie ahí para sentirlo: es una propiedad de la región, no del par',
    ],
    formulas: [
      '*E* = @{*F*_t}{Q_t}          *F* = Q *E*',
    ],
    fCaption: 'La segunda forma es la que se usa al revés: conocido el campo, la fuerza sobre cualquier carga sale de multiplicar.',
    note: 'La carga de prueba tiene que ser lo bastante pequeña para no perturbar la distribución que se quiere medir.' },

  { id: 12, layout: 'formula', tag: '§ 2.2', section: '2.2',
    title: 'Campo de una carga puntual',
    body: 'El primer campo concreto, y el ladrillo con el que se construyen todos los demás.',
    items: [
      'Es radial: no hay ninguna dirección privilegiada alrededor de un punto, así que sólo puede apuntar hacia afuera o hacia adentro',
      'Cae con 1/R², igual que la fuerza — es la misma ley dividida entre la carga de prueba',
      'Si la carga está en *r*′ en vez del origen, R se mide desde ahí: *R* = *r* − *r*′',
    ],
    formulas: [
      '*E* = @{Q}{4πε_0 R^2} *a*_R',
      '*E*(*r*) = @{Q}{4πε_0 |*r*−*r*′|^2} @{*r*−*r*′}{|*r*−*r*′|}',
    ],
    fCaption: 'La segunda forma parece peor, pero es la que se puede meter dentro de una integral.',
    diagram: <PointChargeFieldDiagram/>, interactive: true,
    hint: 'Arrastra P alrededor de la carga' },

  { id: 13, layout: 'example', tag: 'Ejemplo', section: '2.2',
    title: 'Campo de una carga puntual en P',
    given: 'Q = 4 nC en el origen. Hallar *E* en P(1, 2, 3), con las distancias en metros.',
    items: [
      'Vector de posición:  *R* = *a*_x + 2*a*_y + 3*a*_z',
      'Distancia:  R = √(1 + 4 + 9) = √14 = 3.742 m',
      'Unitario:  *a*_R = @{*a*_x + 2*a*_y + 3*a*_z}{3.742}',
      'Magnitud:  |*E*| = @{9×10^9 · 4×10^{−9}}{14} = 2.571 V/m',
    ],
    formulas: ['*E* = 0.687*a*_x + 1.374*a*_y + 2.061*a*_z V/m'],
    fCaption: 'R² = 14 va sin raíz en el denominador; la raíz sólo aparece al normalizar el unitario.',
    practice: {
      code: 'D2.4',
      q: 'Una carga de −0.3 μC está en A(25, −30, 15) cm. Halla |*E*| en el origen, con las coordenadas en centímetros.',
      a: ['*R* = −0.25*a*_x + 0.30*a*_y − 0.15*a*_z m', '|*R*| = 0.4183 m', '|*E*| = 15.4 kV/m'],
    } },

  { id: 14, layout: 'formula', tag: '§ 2.2', section: '2.2',
    title: 'Campo de distribuciones discretas',
    body: 'Con varias cargas puntuales el campo total es, otra vez, una suma vectorial. Ninguna carga altera el campo que produce otra.',
    items: [
      'Cada término tiene su propia distancia y su propio unitario, medidos desde *esa* carga',
      'Conviene descomponer en componentes desde el principio y sumar componente a componente',
      'Un truco constante: si la configuración es simétrica, algunas componentes se cancelan antes de calcular nada',
    ],
    formulas: [
      '*E*(*r*) = Σ_{m=1}^{N} @{Q_m}{4πε_0 |*r*−*r*_m|^2} @{*r*−*r*_m}{|*r*−*r*_m|}',
    ],
    fCaption: 'Dos cargas iguales y opuestas separadas una distancia pequeña forman un dipolo — el caso de la derecha.',
    diagram: <DiscreteChargesDiagram/>, interactive: true,
    hint: 'Arrastra P y mira girar la resultante' },

  { id: 15, layout: 'example', tag: 'Simetría', section: '2.2',
    title: 'Cuatro cargas en un cuadrado',
    given: 'Cuatro cargas iguales Q en los vértices de un cuadrado de lado a.',
    items: [
      'En el *centro*: cada carga tiene enfrente otra idéntica a la misma distancia',
      'Los cuatro vectores se cancelan por pares opuestos ⇒ *E* = 0, sin hacer una sola cuenta',
      'Sobre el *eje perpendicular* al centro, a una altura h: las componentes horizontales se cancelan',
      'Sólo sobrevive la componente axial, multiplicada por cuatro: E_z = 4 · @{Q}{4πε_0 r^2} · @{h}{r},  con r = √(h^2 + a^2/2)',
    ],
    formulas: ['*E* = @{Q h}{πε_0 (h^2 + a^2/2)^{3/2}} *a*_z'],
    fCaption: 'Buscar la simetría antes de integrar es lo que separa un problema de dos líneas de uno de dos páginas.',
    practice: {
      code: 'Verificación',
      q: 'Cuando h ≫ a, la expresión tiende a 4Q/(4πε_0 h^2): las cuatro cargas se ven como una sola carga 4Q. Todo resultado debería pasar esta prueba de límite.',
      a: [],
    } },

  { id: 16, layout: 'formula', tag: '§ 2.3', section: '2.2',
    title: 'De la suma a la integral',
    body: 'Una distribución continua es una suma con infinitos términos infinitamente pequeños. El paso es mecánico, y siempre es el mismo.',
    items: [
      'Se toma un elemento de carga dQ = ρ_v dv′ en el punto fuente *r*′',
      'Ese elemento se trata como una carga puntual: aporta d*E* con la ley de la lámina anterior',
      'Se integra sobre toda la región donde hay carga — las variables primadas son las que se integran',
    ],
    formulas: [
      '*E*(*r*) = ∫_{vol} @{ρ_v(*r*′) dv′}{4πε_0 |*r*−*r*′|^2} @{*r*−*r*′}{|*r*−*r*′|}',
    ],
    fCaption: 'El punto de campo *r* es constante durante la integración; lo que recorre la región es *r*′.',
    note: 'Esta integral es correcta siempre y resoluble casi nunca. Los dos casos que siguen son los que sí salen a mano — y la ley de Gauss, en la Parte B, evitará tener que plantearla.' },

  { id: 17, layout: 'formula', tag: '§ 2.4', section: '2.4',
    title: 'Línea infinita de carga',
    body: 'Una línea recta infinita con densidad ρ_L uniforme. La simetría hace casi todo el trabajo antes de integrar.',
    items: [
      'Nada distingue un valor de z de otro, ni un ángulo ϕ de otro: el campo no puede depender de ninguno de los dos',
      'Las componentes en z de dos elementos simétricos se cancelan, así que sólo queda la componente radial',
      'El resultado cae con 1/ρ, no con 1/ρ² — hay carga a lo largo de toda la línea compensando la distancia',
    ],
    formulas: [
      '*E* = @{ρ_L}{2πε_0 ρ} *a*_ρ',
    ],
    fCaption: 'ρ es la distancia perpendicular *desde la línea*, la coordenada cilíndrica — no la distancia al origen.',
    diagram: <LineChargeDiagram/>, interactive: true,
    hint: 'Arrastra el punto y compara las flechas' },

  { id: 18, layout: 'example', tag: 'Aplicación', section: '2.4',
    title: 'Línea de carga fuera del eje z',
    given: 'Línea infinita paralela a *a*_z que pasa por (a, b, 0), con densidad ρ_L. Hallar *E* en P(x, y, z).',
    items: [
      'La fórmula sólo sabe de distancia perpendicular y dirección radial — hay que construirlas a mano',
      'Vector perpendicular:  *R* = (x − a)*a*_x + (y − b)*a*_y   — la componente z se descarta, la línea es infinita en z',
      'Distancia:  ρ = √((x−a)^2 + (y−b)^2)',
      'Unitario:  *a*_ρ = *R* / ρ',
    ],
    formulas: ['*E* = @{ρ_L}{2πε_0 ρ^2} [(x−a)*a*_x + (y−b)*a*_y]'],
    fCaption: 'Al escribir *a*_ρ = *R*/ρ, el ρ del unitario y el ρ de la fórmula se juntan en ρ² — de ahí el cuadrado.',
    practice: {
      code: 'D2.5',
      q: 'Una línea infinita con ρ_L = 2 nC/m está sobre el eje z. Halla |*E*| en el punto (3, 4, 5) m.',
      a: ['ρ = √(9 + 16) = 5 m', '|*E*| = 2·(9×10^9)·(2×10^{−9}) / 5 = 7.2 V/m'],
    } },

  { id: 19, layout: 'formula', tag: '§ 2.5', section: '2.5',
    title: 'Lámina infinita de carga',
    body: 'El resultado más contraintuitivo del capítulo: el campo de un plano cargado infinito no depende de a qué distancia se mida.',
    items: [
      'Al alejarse, cada elemento de carga aporta menos — pero entran en juego más elementos, y los dos efectos se cancelan exactamente',
      'La dirección es normal a la lámina, y se aleja de ella si ρ_S es positiva',
      'Ninguna lámina real es infinita; la fórmula vale mientras la distancia sea pequeña frente al tamaño de la placa',
    ],
    formulas: [
      '*E* = @{ρ_S}{2ε_0} *a*_N',
    ],
    fCaption: '*a*_N es el unitario normal que va *desde* la lámina *hacia* el punto de campo — cambia de sentido al cruzarla.',
    diagram: <SheetChargeDiagram/> },

  { id: 20, layout: 'example', tag: 'Aplicación', section: '2.5',
    title: 'Dos láminas paralelas',
    given: 'Dos planos paralelos, uno con +ρ_S y el otro con −ρ_S, separados una distancia d.',
    items: [
      'Entre las láminas ambos campos apuntan de la positiva hacia la negativa: se suman',
      'E_{dentro} = ρ_S/2ε_0 + ρ_S/2ε_0 = ρ_S/ε_0, uniforme en toda la región interior',
      'Fuera, los dos campos tienen sentidos opuestos y la misma magnitud: se cancelan',
      'E_{fuera} = 0 — todo el campo queda confinado entre las placas',
    ],
    formulas: ['*E* = @{ρ_S}{ε_0} *a*_N   (entre las placas)     *E* = 0   (fuera)'],
    fCaption: 'Es el modelo del capacitor de placas paralelas, y la razón de que se lo trate como un campo uniforme.',
    practice: {
      code: 'Nota',
      q: 'El confinamiento del campo es lo que hace útil al capacitor: la energía queda guardada en un volumen conocido en vez de dispersarse por todo el espacio.',
      a: [],
    } },

  { id: 21, layout: 'table', tag: 'Síntesis', section: '2.5', dense: true,
    title: 'Las cuatro configuraciones',
    body: 'La misma ley integrada sobre geometrías distintas da dependencias radicalmente distintas con la distancia. Vale la pena memorizar la columna del medio.',
    tableHead: ['Fuente', 'Campo *E*', 'Con la distancia', 'Simetría usada'],
    tableRows: [
      ['Carga puntual', '@{Q}{4πε_0 R^2} *a*_R', '1 / R^2', 'esférica — nada depende de θ ni ϕ'],
      ['Línea infinita', '@{ρ_L}{2πε_0 ρ} *a*_ρ', '1 / ρ', 'cilíndrica — nada depende de z ni ϕ'],
      ['Lámina infinita', '@{ρ_S}{2ε_0} *a*_N', 'constante', 'plana — nada depende de la posición'],
      ['Dos láminas', '@{ρ_S}{ε_0} *a*_N', 'constante y confinado', 'plana, más superposición'],
    ],
    note: 'La regla detrás del patrón: cada dimensión que se añade a la fuente le resta una potencia a la caída con la distancia.' },

  { id: 22, layout: 'formula', tag: '§ 2.6', section: '2.6',
    title: 'Líneas de campo eléctrico',
    body: 'Un campo vectorial tiene un vector en cada punto del espacio, y dibujarlos todos es imposible. Las líneas de flujo son el convenio que resuelve eso.',
    items: [
      'La línea es *tangente* a *E* en cada uno de sus puntos: su dirección es la del campo ahí',
      'Su *densidad* codifica la magnitud: donde las líneas se aprietan, el campo es más intenso',
      'Salen de las cargas positivas y terminan en las negativas — nunca empiezan ni acaban en el vacío',
      'Dos líneas nunca se cruzan: en el cruce el campo tendría dos direcciones a la vez',
    ],
    diagram: <FieldLinesDiagram/>, interactive: true,
    hint: 'Mueve el control de −3 nC a +3 nC' },

  { id: 23, layout: 'example', tag: '§ 2.6', section: '2.6',
    title: 'Trazar las líneas de campo',
    given: 'Las líneas son tangentes a *E*, así que su pendiente es la razón de las componentes.',
    items: [
      'Condición de tangencia:  @{dy}{dx} = @{E_y}{E_x}',
      'Ejemplo — línea de carga sobre el eje z:  *E* ∝ (x*a*_x + y*a*_y)/(x^2+y^2)',
      'Entonces @{dy}{dx} = @{y}{x},  que se separa como @{dy}{y} = @{dx}{x}',
      'Integrando:  ln y = ln x + C  ⇒  y = C_1 x',
    ],
    formulas: ['y = C_1 x — rectas que pasan por el origen'],
    fCaption: 'El resultado confirma lo que la simetría ya anunciaba: el campo de una línea de carga es puramente radial.',
    practice: {
      code: 'D2.7',
      q: 'Si *E* = 2x*a*_x − 4y*a*_y, halla la ecuación de la línea de campo que pasa por P(2, 3).',
      a: ['dy/dx = −2y/x  ⇒  dy/2y = −dx/x', 'ln y^{1/2} = −ln x + C', 'x^2 y = 12'],
    } },

  { id: 24, layout: 'pitfalls', tag: 'Advertencia', section: 'Síntesis',
    title: 'Los errores que sí cuestan puntos',
    body: 'Cinco confusiones que aparecen una y otra vez en las evaluaciones de este módulo.',
    pitfalls: [
      ['Sumar las magnitudes |*E*_1| + |*E*_2| para hallar el campo total',
       'Descomponer cada campo en componentes y sumar componente a componente'],
      ['Confundir R (la distancia, un escalar) con *a*_R (el unitario que da la dirección)',
       'R^2 va en el denominador; *a*_R sólo orienta. Si aparece |*R*|^3, es porque se escribió *R*/|*R*| sin simplificar'],
      ['Aplicar 1/R^2 a una línea o a una lámina de carga',
       'Sólo la carga puntual cae con 1/R². La línea cae con 1/ρ y la lámina no cae'],
      ['Medir ρ desde el origen en un problema con línea de carga',
       'ρ es la distancia perpendicular desde la línea — si la línea no pasa por el eje z, hay que construirla'],
      ['Perder el signo de la carga y dejar *E* apuntando hacia el lado que no es',
       'El signo entra en el numerador y voltea el vector: hacia afuera si es positiva, hacia adentro si es negativa'],
    ] },

  { id: 25, layout: 'example', tag: 'Integrador', section: 'Síntesis',
    title: 'Carga puntual y línea, juntas',
    given: 'Una línea infinita con ρ_L = 5 nC/m sobre el eje z, y una carga puntual Q = −2 nC en (4, 0, 0) m. Hallar *E* en (2, 0, 0).',
    items: [
      'Campo de la línea, en ρ = 2 m:  E_L = 2(9×10^9)(5×10^{−9})/2 = 45 V/m, en +*a*_x',
      'Campo de la carga, a R = 2 m:  E_Q = (9×10^9)(2×10^{−9})/4 = 4.5 V/m, hacia la carga ⇒ +*a*_x',
      'Ambos apuntan en el mismo sentido, así que aquí sí se suman directamente',
      'Total:  *E* = 49.5 *a*_x V/m',
    ],
    formulas: ['¿Dónde se anula el campo?  45/ρ = 18/(4−ρ)^2  para 0 < ρ < 4'],
    fCaption: 'La superposición es la única herramienta que hace falta: cada fuente aporta con su propia ley.',
    practice: {
      code: 'Discusión',
      q: 'Los dos campos coinciden en sentido a la izquierda de la carga, pero se oponen a su derecha. Ahí es donde hay que buscar el punto de campo nulo.',
      a: [],
    } },

  { id: 26, layout: 'summary', tag: 'Cierre', section: 'Síntesis',
    title: 'Conceptos clave',
    items: [
      'La carga es la fuente: cuantizada, conservada e invariante, y repartida como ρ_L, ρ_S o ρ_v',
      'Ley de Coulomb:  *F* = Q_1 Q_2 *a*_{12} / 4πε_0 R^2 — siempre a lo largo de la recta que une las cargas',
      'Campo eléctrico:  *E* = *F*/Q_t — quita la carga de prueba y deja una propiedad del espacio',
      'Carga puntual:  *E* = Q *a*_R / 4πε_0 R^2, con caída 1/R^2',
      'Línea infinita:  *E* = ρ_L *a*_ρ / 2πε_0 ρ, con caída 1/ρ',
      'Lámina infinita:  *E* = ρ_S *a*_N / 2ε_0 — el campo no depende de la distancia',
      'Superposición: toda configuración se resuelve sumando, y la suma es siempre vectorial',
      'Las líneas de campo son tangentes a *E*, su densidad es su magnitud, y no se cruzan nunca',
    ],
    backdrop: true },

  { id: 27, layout: 'end',
    title: 'Campos\nElectrostáticos',
    subtitle: 'Hasta aquí, cada campo salió de plantear una integral y resolverla.\nLa Parte B empieza justo donde eso deja de ser necesario: la ley de Gauss\nobtiene el mismo resultado con un argumento de simetría.',
    footer: 'Módulo II · Parte A completa', backdrop: true },
]

function accentFor(s: SD): string {
  const sec = s.section ?? ''
  if (sec === 'Carga') return ORO
  if (sec === '2.1') return ESCARCHA
  if (sec === '2.2') return AURORA
  if (sec === '2.4' || sec === '2.5' || sec === '2.6') return VIOLETA
  if (sec === 'Síntesis') return ORO
  return ESCARCHA
}

function actLabel(s: SD): string | null {
  const sec = s.section ?? ''
  if (sec === 'Carga') return 'La carga como fuente'
  if (sec === '2.1') return 'La ley de Coulomb'
  if (sec === '2.2') return 'El campo eléctrico E'
  if (sec === '2.4' || sec === '2.5' || sec === '2.6') return 'Configuraciones y líneas'
  /* 'Síntesis' and 'Intro' already name themselves in the pill — repeating
     the act label beside them just prints the same word twice */
  if (sec === 'Síntesis' || sec === 'Intro') return null
  return null
}

/* Roman numeral of the act a slide belongs to — used by the spine. */
function actNumeral(s: SD): string | null {
  const sec = s.section ?? ''
  if (sec === 'Carga') return 'I'
  if (sec === '2.1') return 'II'
  if (sec === '2.2') return 'III'
  if (sec === '2.4' || sec === '2.5' || sec === '2.6') return 'IV'
  return null
}


export default function App() {
  return <Deck slides={SLIDES} accentFor={accentFor} actLabel={actLabel} actNumeral={actNumeral} theme={THEMES.coulomb}/>
}
