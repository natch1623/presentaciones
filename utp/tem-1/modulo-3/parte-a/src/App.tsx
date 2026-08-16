import { Fragment, useState, type CSSProperties } from 'react'
import {
  ORO, ESCARCHA, AURORA, VIOLETA, BRASA, HIELO, POS, NEG, U, MID,
  Board, Charge, Vec, MLabel, VLabel, RLabel, DragHandle, useDrag, useTick, FxHtml,
  Deck, THEMES, type Act, type SD,
} from './deck'

/* ═══════════════════════════════════════════════════════════
   ANIMATED SVG DIAGRAMS

   Same 300×300 board and the same three bands as every other deck
   in this course: chip 6…50, stage 54…226, readout 234…292.
═══════════════════════════════════════════════════════════ */

/* ── 01 · What the electrons can and cannot do, per material ── */
function MaterialsDiagram() {
  const [mode, setMode] = useState(0)
  const t = useTick()

  const TABS = [
    { k: 'conductor',   free: 22, sigma: '≈ 10^7 S/m',    note: 'un electrón libre por átomo' },
    { k: 'semicond.',   free: 6,  sigma: '≈ 10^{−3} S/m', note: 'pocos portadores, y muy sensibles' },
    { k: 'dieléctrico', free: 0,  sigma: '≈ 10^{−15} S/m', note: 'la carga está ligada, no viaja' },
  ]
  const tab = TABS[mode]

  /* the lattice ions stay put; only the free electrons drift */
  const ions = Array.from({ length: 24 }, (_, i) => ({
    x: 46 + (i % 6) * 42,
    y: 84 + Math.floor(i / 6) * 38,
  }))
  const frees = Array.from({ length: tab.free }, (_, i) => {
    const seed = Math.sin(i * 12.9898) * 43758.5453
    const f = seed - Math.floor(seed)
    const lane = 84 + (i % 4) * 38
    const x = 34 + ((f * 240 + t * 26 * (mode === 0 ? 1 : 0.35)) % 236)
    return { x, y: lane + (f - 0.5) * 20 }
  })

  return (
    <Board
      foot={<>
        <RLabel x={24} y={251} text={`σ ${tab.sigma}`} color={ESCARCHA} size={11}/>
        <RLabel x={24} y={268} text={tab.note} color="rgba(220,238,248,.5)" size={9.4}/>
        <RLabel x={24} y={284} text="lo que distingue a los materiales es σ, nada más" color="rgba(220,238,248,.32)" size={9}/>
      </>}>
      {TABS.map((tb, i) => (
        <g key={i} onPointerDown={() => setMode(i)} style={{ cursor: 'pointer' }}>
          <rect x={14 + i * 92} y={8} width="88" height="26" rx="6"
            fill={i === mode ? `${ESCARCHA}26` : 'rgba(160,200,232,.05)'}
            stroke={i === mode ? ESCARCHA : 'rgba(160,200,232,.18)'} strokeWidth="1"/>
          <text x={58 + i * 92} y={25} textAnchor="middle"
            fill={i === mode ? ESCARCHA : 'rgba(220,238,248,.45)'}
            fontSize="9.5" fontFamily="JetBrains Mono,monospace">{tb.k}</text>
        </g>
      ))}

      {/* the applied field, same in all three cases */}
      <line x1={30} y1={206} x2={270} y2={206} stroke={AURORA} strokeWidth="1.6"
        opacity=".55" markerEnd="url(#aGs)"/>
      <MLabel x={150} y={220} text="*E* aplicado — el mismo en los tres casos"
        color="rgba(220,238,248,.4)" size={9} delay="d4"/>

      {ions.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="6" fill={`${BRASA}18`} stroke={POS}
          strokeWidth="1" strokeOpacity=".45"/>
      ))}
      {frees.map((p, i) => (
        <circle key={`f${i}`} cx={p.x} cy={p.y} r="3.2" fill={NEG} opacity=".9"/>
      ))}
      {tab.free === 0 && (
        <MLabel x={150} y={64} text="ningún portador libre" color={VIOLETA} size={11} delay="d3"/>
      )}
    </Board>
  )
}

/* ── 02 · Current is the flux of J through a surface ── */
function CurrentDensityDiagram() {
  const [ang, setAng] = useState(0.32)
  const C = { x: 168, y: MID }

  const { svgRef, handleMove, start, stop } = useDrag((x, y) => {
    setAng(Math.max(-1.35, Math.min(1.35, Math.atan2(y - C.y, x - C.x) + Math.PI / 2)))
  })

  const S = 3.0                              /* m², the plate area */
  const J = 5.0                              /* A/m² */
  const I = J * S * Math.cos(ang)

  const ca = Math.cos(ang)
  const sa = Math.sin(ang)
  /* the plate, drawn edge-on and tilted by `ang` about its centre */
  const half = 52
  const p1 = { x: C.x - sa * half, y: C.y + ca * half }
  const p2 = { x: C.x + sa * half, y: C.y - ca * half }

  return (
    <Board grab svgRef={svgRef} onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}
      chip="I = ∫_S *J* · d*S*"
      chipSub="la corriente es el flujo de *J*, no *J* misma"
      chipColor={ESCARCHA}
      foot={<>
        <RLabel x={24} y={251} text={`θ = ${((ang * 180) / Math.PI).toFixed(0)}°`} color={ESCARCHA} size={11}/>
        <RLabel x={112} y={251} text={`I = ${I.toFixed(2)} A`} color={ORO} size={11}/>
        <RLabel x={24} y={268} text={`|*J*| = 5 A/m²    S = 3 m²    I = J S cos θ`} color="rgba(220,238,248,.5)" size={9.2}/>
        <RLabel x={24} y={284} text="a 90° no pasa corriente: la superficie va de canto" color="rgba(220,238,248,.32)" size={9}/>
      </>}>
      {/* the current density field, uniform and horizontal */}
      {[86, 112, 138, 164, 190].map((y, i) => (
        <line key={i} x1={34} y1={y} x2={286} y2={y}
          stroke={AURORA} strokeWidth="1.5" opacity=".38" markerEnd="url(#aGs)"/>
      ))}
      <MLabel x={54} y={72} text="*J*" color={AURORA} size={13} delay="d2"/>

      {/* the surface, tilted */}
      <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
        stroke={ESCARCHA} strokeWidth="4" strokeLinecap="round"/>
      {/* its normal — the vector that the dot product actually cares about */}
      <Vec x1={C.x} y1={C.y} x2={C.x + ca * 42} y2={C.y + sa * 42}
        color={ORO} marker="aG" delay="d3" width={2.4}/>
      <MLabel x={C.x + ca * 56} y={C.y + sa * 56 + 4} text="d*S*" color={ORO} size={11} delay="d5"/>
      <DragHandle x={p2.x} y={p2.y} onDown={start('a')} color={ESCARCHA}/>
    </Board>
  )
}

/* ── 03 · Convection: charge carried along by bulk motion ── */
function ConvectionDiagram() {
  const t = useTick()
  const drift = (t * 34) % 300

  return (
    <Board
      chip="*J* = ρ_v *v*"
      chipSub="carga que viaja porque el medio la lleva"
      chipColor={VIOLETA}
      foot={<>
        <RLabel x={24} y={252} text="no necesita conductor: pasa en el vacío y en gases" color={VIOLETA} size={9.4}/>
        <RLabel x={24} y={268} text="ejemplos: el haz de un tubo de rayos catódicos, un cohete iónico" color="rgba(220,238,248,.5)" size={8.8}/>
        <RLabel x={24} y={284} text="no obedece la ley de Ohm — no hay colisiones que la frenen" color="rgba(220,238,248,.32)" size={8.8}/>
      </>}>
      {/* the beam envelope */}
      <path d="M 30 108 L 270 108 L 270 176 L 30 176 Z"
        fill={`${VIOLETA}0c`} stroke={VIOLETA} strokeWidth="1.2" strokeDasharray="5 4"/>

      {/* the charge cloud, streaming right */}
      {Array.from({ length: 26 }, (_, i) => {
        const seed = Math.sin(i * 12.9898) * 43758.5453
        const f = seed - Math.floor(seed)
        const x = 20 + ((f * 260 + drift) % 264)
        const y = 116 + f * 52
        return <circle key={i} cx={x} cy={y} r="3.4" fill={POS} opacity=".85"/>
      })}

      <Vec x1={90} y1={92} x2={166} y2={92} color={VIOLETA} marker="aV" delay="d3" width={2.6}/>
      <MLabel x={176} y={96} text="*v*" color={VIOLETA} size={13} anchor="start" delay="d4"/>
      <MLabel x={150} y={200} text="ρ_v = densidad de carga del haz"
        color="rgba(220,238,248,.42)" size={10} delay="d5"/>
      <MLabel x={150} y={76} text="la carga se mueve en bloque, sin red que la frene"
        color="rgba(220,238,248,.35)" size={9} delay="d5"/>
    </Board>
  )
}

/* ── 04 · Conduction: Ohm's law in point form ── */
function ConductionDiagram() {
  const [ex, setEx] = useState(58)
  const t = useTick()

  const { svgRef, handleMove, start, stop } = useDrag((x) => {
    setEx(Math.max(10, Math.min(96, x - 150)))
  })

  const E = ex / 8                       /* V/m */
  const sigma = 5.8                      /* MS/m — copper */
  const J = sigma * E                    /* MA/m² */
  const vd = E * 0.0032                  /* mm/s, drift velocity, illustrative */
  const drift = (t * ex * 0.9) % 240

  return (
    <Board grab svgRef={svgRef} onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}
      chip="*J* = σ *E*"
      chipSub="la ley de Ohm, escrita en un punto"
      chipColor={AURORA}
      foot={<>
        <RLabel x={24} y={251} text={`E = ${E.toFixed(1)} V/m`} color={ESCARCHA} size={11}/>
        <RLabel x={128} y={251} text={`|*J*| = ${J.toFixed(1)} MA/m²`} color={AURORA} size={10.5}/>
        <RLabel x={24} y={268} text={`cobre: σ = 5.8 MS/m     v_d ≈ ${vd.toFixed(3)} mm/s`} color="rgba(220,238,248,.5)" size={9.2}/>
        <RLabel x={24} y={284} text="el electrón va lentísimo; la señal, casi a c" color="rgba(220,238,248,.32)" size={9}/>
      </>}>
      {/* the conductor */}
      <rect x={28} y={104} width="244" height="76" rx="4"
        fill={`${ESCARCHA}0a`} stroke={NEG} strokeWidth="1.4"/>

      {/* the lattice */}
      {Array.from({ length: 21 }, (_, i) => (
        <circle key={i} cx={44 + (i % 7) * 36} cy={122 + Math.floor(i / 7) * 22} r="5"
          fill={`${BRASA}16`} stroke={POS} strokeWidth=".9" strokeOpacity=".4"/>
      ))}

      {/* electrons drifting against E, faster when E grows */}
      {Array.from({ length: 16 }, (_, i) => {
        const seed = Math.sin(i * 45.233) * 12345.678
        const f = seed - Math.floor(seed)
        const x = 262 - ((f * 236 + drift) % 240)
        const y = 114 + f * 58
        return <circle key={`e${i}`} cx={x} cy={y} r="3" fill={NEG} opacity=".92"/>
      })}

      {/* the applied field */}
      <Vec x1={150} y1={80} x2={150 + ex} y2={80} color={AURORA} marker="aGr" delay="d2" width={2.6}/>
      <MLabel x={150 + ex + 12} y={84} text="*E*" color={AURORA} size={12.5} anchor="start"/>
      <MLabel x={150} y={68} text="arrastra para cambiar el campo"
        color="rgba(220,238,248,.3)" size={8.5} delay="d5"/>
      <MLabel x={150} y={202} text="los electrones se mueven en contra de *E*"
        color="rgba(220,238,248,.4)" size={9.5} delay="d5"/>
      <DragHandle x={150 + ex} y={80} onDown={start('e')} color={ESCARCHA}/>
    </Board>
  )
}

/* ── 05 · Resistance from geometry ── */
function ResistanceDiagram() {
  const [len, setLen] = useState(150)
  const [rad, setRad] = useState(26)

  const { svgRef, handleMove, start, stop } = useDrag((x, y, id) => {
    if (id === 'L') setLen(Math.max(70, Math.min(216, x - 44)))
    else setRad(Math.max(10, Math.min(38, MID - y)))
  })

  const L = len / 40                              /* m */
  const r = rad / 200                             /* m */
  const S = Math.PI * r * r                       /* m² */
  const sigma = 5.8e7                             /* S/m, copper */
  const R = L / (sigma * S) * 1e6                 /* µΩ */

  return (
    <Board grab svgRef={svgRef} onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}
      chip="R = @{L}{σ S}"
      chipSub="sólo vale si J es uniforme sobre toda la sección"
      chipColor={ORO}
      foot={<>
        <RLabel x={24} y={251} text={`L = ${L.toFixed(2)} m`} color={ESCARCHA} size={10.5}/>
        <RLabel x={110} y={251} text={`S = ${(S * 1e6).toFixed(1)} mm²`} color={ESCARCHA} size={10.5}/>
        <RLabel x={210} y={251} text={`R = ${R.toFixed(0)} µΩ`} color={ORO} size={10.5}/>
        <RLabel x={24} y={268} text="cobre, σ = 5.8 × 10^7 S/m" color="rgba(220,238,248,.5)" size={9.2}/>
        <RLabel x={24} y={284} text="doblar el radio divide R entre cuatro: S va con r²" color="rgba(220,238,248,.32)" size={9}/>
      </>}>
      {/* the wire, drawn as a cylinder */}
      <rect x={44} y={MID - rad} width={len} height={rad * 2}
        fill={`${BRASA}12`} stroke={POS} strokeWidth="1.6"/>
      <ellipse cx={44} cy={MID} rx="9" ry={rad} fill={`${BRASA}22`} stroke={POS} strokeWidth="1.6"/>
      <ellipse cx={44 + len} cy={MID} rx="9" ry={rad} fill={`${BRASA}2c`} stroke={POS} strokeWidth="1.6"/>

      {/* uniform current density inside */}
      {[-0.5, 0, 0.5].map((f, i) => (
        <line key={i} x1={56} y1={MID + rad * f} x2={44 + len - 12} y2={MID + rad * f}
          stroke={AURORA} strokeWidth="1.4" opacity=".5" markerEnd="url(#aGs)"/>
      ))}
      <MLabel x={44 + len / 2} y={MID - rad - 12} text="*J* uniforme" color={AURORA} size={9.5} delay="d3"/>

      {/* the two controls */}
      <line x1={44} y1={MID + 58} x2={44 + len} y2={MID + 58}
        stroke="rgba(220,238,248,.3)" strokeWidth="1" strokeDasharray="4 4"/>
      <MLabel x={44 + len / 2} y={MID + 72} text="L" color="rgba(220,238,248,.6)" size={11} delay="d4"/>
      <DragHandle x={44 + len} y={MID + 58} onDown={start('L')} color={ESCARCHA}/>
      <DragHandle x={44 + len + 26} y={MID - rad} onDown={start('r')} color={AURORA}/>
      <MLabel x={44 + len + 44} y={MID - rad - 6} text="r" color={AURORA} size={11} anchor="start" delay="d4"/>
    </Board>
  )
}

/* ── 06 · Continuity: what leaves has to come from somewhere ── */
function ContinuityDiagram() {
  const t = useTick()
  const O = { x: 150, y: 136 }
  const shrink = 0.5 + 0.5 * Math.sin(t * 0.9)
  const n = Math.max(2, Math.round(3 + shrink * 5))

  return (
    <Board
      chip="∇ · *J* = − @{∂ρ_v}{∂t}"
      chipSub="la carga no se pierde: si sale, adentro queda menos"
      chipColor={AURORA}
      foot={<>
        <RLabel x={24} y={251} text="forma integral:  ∮_S *J* · d*S* = − @{dQ}{dt}" color={AURORA} size={10}/>
        <RLabel x={24} y={269} text="es la conservación de la carga, en forma de ecuación" color="rgba(220,238,248,.5)" size={9.2}/>
        <RLabel x={24} y={285} text="en régimen estacionario ∂ρ_v/∂t = 0 ⇒ ∇·*J* = 0" color="rgba(220,238,248,.32)" size={9}/>
      </>}>
      <circle cx={O.x} cy={O.y} r="60" fill={`${AURORA}0b`} stroke={AURORA}
        strokeWidth="2" strokeDasharray="6 4"/>

      {/* charge draining out through the surface */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        return (
          <line key={i} x1={O.x + Math.cos(a) * 52} y1={O.y + Math.sin(a) * 52}
            x2={O.x + Math.cos(a) * 88} y2={O.y + Math.sin(a) * 88}
            stroke={AURORA} strokeWidth="1.5" opacity=".55" markerEnd="url(#aGs)"/>
        )
      })}
      <MLabel x={O.x + 96} y={O.y - 62} text="*J*" color={AURORA} size={12} delay="d3"/>

      {/* what is left inside, shrinking as it drains */}
      {Array.from({ length: 8 }, (_, i) => {
        const a = (i / 8) * Math.PI * 2 + 0.4
        return i < n ? (
          <circle key={i} cx={O.x + Math.cos(a) * 26} cy={O.y + Math.sin(a) * 26}
            r="5" fill={POS} opacity=".85"/>
        ) : null
      })}
      <MLabel x={O.x} y={O.y + 4} text="Q(t)" color={POS} size={11}/>
      <MLabel x={150} y={214} text="lo que atraviesa la superficie sale de adentro"
        color="rgba(220,238,248,.4)" size={9.5} delay="d5"/>
    </Board>
  )
}

/* ── 07 · The two boundary conditions at a conductor surface ── */
function ConductorBoundaryDiagram() {
  const [ang, setAng] = useState(0.55)
  const P = { x: 150, y: 150 }

  const { svgRef, handleMove, start, stop } = useDrag((x, y) => {
    setAng(Math.max(0.03, Math.min(1.45, Math.atan2(P.y - y, Math.abs(x - P.x) || 0.001))))
  })

  /* the field the user is trying to impose, and its two components */
  const Lp = 76
  const ex = Math.cos(ang) * Lp
  const ey = -Math.sin(ang) * Lp
  const tangential = Math.abs(ex)

  return (
    <Board grab svgRef={svgRef} onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}
      chip="E_t = 0        D_N = ρ_S"
      chipSub="en la superficie, *E* sólo puede ser normal"
      chipColor={VIOLETA}
      foot={<>
        <RLabel x={24} y={251} text={`componente tangencial: ${tangential.toFixed(0)} → se anula`} color={BRASA} size={9.6}/>
        <RLabel x={24} y={268} text="una E_t movería la carga superficial hasta cancelarla" color="rgba(220,238,248,.5)" size={9}/>
        <RLabel x={24} y={284} text="dentro del conductor, en estático, *E* = 0 siempre" color="rgba(220,238,248,.32)" size={9}/>
      </>}>
      {/* the conductor occupies the lower half */}
      <rect x={20} y={150} width="260" height="76" fill={`${BRASA}12`} stroke={POS} strokeWidth="1.6"/>
      {Array.from({ length: 13 }, (_, i) => (
        <text key={i} x={34 + i * 19} y={146} fill={POS} fontSize="10"
          fontFamily="JetBrains Mono,monospace" textAnchor="middle">+</text>
      ))}
      <MLabel x={150} y={196} text="*E* = 0  dentro" color={POS} size={12} delay="d3"/>
      <MLabel x={150} y={214} text="toda la carga vive en la superficie" color="rgba(220,238,248,.4)" size={9} delay="d4"/>

      {/* the field the user proposes, and what actually survives */}
      <line x1={P.x} y1={P.y} x2={P.x + ex} y2={P.y + ey}
        stroke="rgba(220,238,248,.3)" strokeWidth="1.6" strokeDasharray="4 4"/>
      <MLabel x={P.x + ex + 8} y={P.y + ey - 4} text="propuesto"
        color="rgba(220,238,248,.35)" size={8.5} anchor="start"/>

      {/* the tangential part is struck out */}
      <line x1={P.x} y1={P.y} x2={P.x + ex} y2={P.y}
        stroke={BRASA} strokeWidth="2" opacity=".7"/>
      <line x1={P.x + ex / 2 - 7} y1={P.y - 7} x2={P.x + ex / 2 + 7} y2={P.y + 7}
        stroke={BRASA} strokeWidth="2"/>
      <MLabel x={P.x + ex / 2} y={P.y + 22} text="E_t = 0" color={BRASA} size={10}/>

      {/* the normal part is the only one that survives */}
      <Vec x1={P.x} y1={P.y} x2={P.x} y2={P.y + ey} color={VIOLETA} marker="aV" delay="d3" width={3}/>
      <MLabel x={P.x - 14} y={P.y + ey + 10} text="D_N = ρ_S" color={VIOLETA} size={10.5} anchor="end" delay="d5"/>
      <DragHandle x={P.x + ex} y={P.y + ey} onDown={start('a')} color={ESCARCHA}/>
    </Board>
  )
}

/* ── 08 · Method of images: replacing the plane with a mirror charge ── */
function ImageChargeDiagram() {
  const [h, setH] = useState(52)
  const PY = 150

  const { svgRef, handleMove, start, stop } = useDrag((x, y) => {
    setH(Math.max(26, Math.min(80, PY - y)))
  })

  const d = h / U

  return (
    <Board grab svgRef={svgRef} onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}
      chip="F = − @{Q^2}{4πε_0 (2h)^2}"
      chipSub="el plano se reemplaza por una carga espejo"
      chipColor={AURORA}
      foot={<>
        <RLabel x={24} y={251} text={`h = ${d.toFixed(2)} m`} color={ESCARCHA} size={11}/>
        <RLabel x={116} y={251} text={`separación = ${(2 * d).toFixed(2)} m`} color={AURORA} size={10}/>
        <RLabel x={24} y={268} text="el plano a tierra impone V = 0: la imagen lo reproduce" color="rgba(220,238,248,.5)" size={8.8}/>
        <RLabel x={24} y={284} text="la carga siempre es atraída hacia el plano" color="rgba(220,238,248,.32)" size={9}/>
      </>}>
      {/* the grounded plane */}
      <line x1={22} y1={PY} x2={278} y2={PY} stroke={NEG} strokeWidth="3.4"/>
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={30 + i * 21} y1={PY} x2={22 + i * 21} y2={PY + 11}
          stroke={NEG} strokeWidth="1.2" opacity=".5"/>
      ))}
      <MLabel x={278} y={PY - 8} text="V = 0" color={NEG} size={10} anchor="end" delay="d4"/>

      {/* real charge above, image below */}
      <Charge x={150} y={PY - h} sign={1} r={11} label="Q"/>
      <g opacity=".5">
        <Charge x={150} y={PY + h} sign={-1} r={11} label="−Q"/>
      </g>

      {/* field lines meeting the plane at right angles */}
      {[-1, -0.5, 0.5, 1].map((k, i) => (
        <path key={i} d={`M 150 ${PY - h + 12} Q ${150 + k * 96} ${PY} 150 ${PY + h - 12}`}
          fill="none" stroke={POS} strokeWidth="1.2" opacity=".32"/>
      ))}

      <line x1={150} y1={PY - h} x2={150} y2={PY + h}
        stroke="rgba(220,238,248,.28)" strokeWidth="1" strokeDasharray="4 4"/>
      <Vec x1={172} y1={PY - h} x2={172} y2={PY - 12} color={AURORA} marker="aGr" delay="d5" width={2.4}/>
      <MLabel x={186} y={PY - h / 2} text="*F*" color={AURORA} size={12} anchor="start" delay="d6"/>
      <DragHandle x={150} y={PY - h} onDown={start('h')} color={ESCARCHA}/>
      <MLabel x={150} y={216} text="la mitad de abajo no existe: es un truco de cálculo"
        color="rgba(220,238,248,.36)" size={9} delay="d7"/>
    </Board>
  )
}

/* ═══════════════════════════════════════════════════════════
   CONTENT
═══════════════════════════════════════════════════════════ */

const ACTS: Act[] = [
  { n: 'I', title: 'Corriente y densidad', range: '§ 5.1', color: ORO,
    desc: 'De la carga quieta a la carga en movimiento: corriente I, densidad *J*, y las dos formas de transportarla.' },
  { n: 'II', title: 'Conducción y Ohm', range: '§ 5.2 – 5.3', color: ESCARCHA,
    desc: 'Conductividad, resistividad y la ley de Ohm en su forma puntual *J* = σ*E*.' },
  { n: 'III', title: 'Continuidad', range: '§ 5.2', color: AURORA,
    desc: 'La conservación de la carga escrita como ecuación, y el tiempo de relajación de un conductor.' },
  { n: 'IV', title: 'Fronteras del conductor', range: '§ 5.4 – 5.5', color: VIOLETA,
    desc: 'Por qué *E* = 0 dentro de un metal, qué pasa justo en su superficie, y el método de las imágenes.' },
]

const SLIDES: SD[] = [
  { id: 1, layout: 'cover', tag: 'MÓDULO III · PARTE A',
    title: 'Conductores\ny Corriente',
    subtitle: 'Teoría Electromagnética I · Materiales eléctricos, densidad de corriente y continuidad',
    meta: 'Hayt & Buck · Teoría electromagnética · cap. 5 · §5.1 – 5.5',
    numeral: 'III', backdrop: true },

  { id: 2, layout: 'agenda', tag: 'Ruta',
    title: 'Cómo se arma esta parte',
    body: 'El Módulo II trabajó en el vacío y con la carga quieta. Aquí se rompen las dos condiciones a la vez: aparece materia, y la carga empieza a moverse dentro de ella.',
    acts: ACTS },

  { id: 3, layout: 'visual', tag: 'Introducción', section: 'Intro',
    title: 'Cuando la carga se mueve',
    body: 'Todo el Módulo II descansó sobre una hipótesis: nada se mueve. Levantarla cambia menos de lo que parece — las herramientas siguen siendo las mismas — pero abre la mitad práctica del curso.',
    items: [
      'Con carga en movimiento aparece la corriente, y con ella la resistencia, la potencia y los circuitos',
      'La conservación de la carga, que hasta aquí era un comentario, se vuelve una ecuación que hay que usar',
      'Y los materiales dejan de ser un detalle: lo que un cuerpo hace con un campo depende de una sola constante, σ',
    ],
    backdrop: true },

  { id: 4, layout: 'formula', tag: 'Clasificación', section: '5.0',
    title: 'Conductores, dieléctricos y semiconductores',
    body: 'Los materiales se clasifican por lo que sus cargas pueden hacer cuando se les aplica un campo. Todo se resume en un número: la conductividad σ.',
    items: [
      '*Conductores* — hay electrones libres que se mueven por todo el material: σ ≈ 10^7 S/m',
      '*Dieléctricos* — la carga está ligada a su átomo; puede desplazarse un poco, pero no viajar: σ ≈ 10^{−15} S/m',
      '*Semiconductores* — quedan en medio, y su σ cambia mucho con la temperatura o con impurezas',
      'Entre un buen conductor y un buen aislante hay veintidós órdenes de magnitud de diferencia',
    ],
    note: 'Esta parte se ocupa de los conductores. Los dieléctricos son el tema de la Parte B.',
    diagram: <MaterialsDiagram/>, interactive: true,
    hint: 'Toca conductor · semicond. · dieléctrico' },

  { id: 5, layout: 'formula', tag: '§ 5.1', section: '5.1',
    title: 'Corriente eléctrica',
    body: 'La definición es directa: corriente es carga que atraviesa una frontera por unidad de tiempo.',
    items: [
      'Se mide en amperes: 1 A = 1 C/s',
      'Es un *escalar*, aunque se le asigne un sentido de recorrido en un circuito',
      'Por convenio, el sentido positivo es el del movimiento de la carga positiva — opuesto al de los electrones',
    ],
    formulas: ['I = @{dQ}{dt}'],
    fCaption: 'Ese convenio de signo es histórico: se fijó antes de saber que quienes se mueven en un metal son los electrones.' },

  { id: 6, layout: 'formula', tag: '§ 5.1', section: '5.1',
    title: 'Densidad de corriente J',
    body: 'La corriente es una magnitud global: depende de la superficie que se elija. Para tener una descripción local hace falta un vector.',
    items: [
      '*J* es la corriente por unidad de área, en A/m², y tiene la dirección del movimiento de la carga',
      'La corriente por una superficie es el flujo de *J* a través de ella: I = ∫_S *J* · d*S*',
      'Igual que con el flujo eléctrico, sólo la componente normal aporta — una superficie de canto no deja pasar corriente',
    ],
    formulas: ['I = ∫_S *J* · d*S*'],
    fCaption: 'Misma estructura que ∮*D*·d*S* en la ley de Gauss: un campo vectorial integrado sobre una superficie.',
    diagram: <CurrentDensityDiagram/>, interactive: true,
    hint: 'Gira la superficie y mira caer I' },

  { id: 7, layout: 'formula', tag: '§ 5.1', section: '5.1',
    title: 'Corriente de convección',
    body: 'La primera de las dos formas de transportar carga: un cuerpo cargado que simplemente se mueve, llevando su carga consigo.',
    items: [
      'Si una densidad ρ_v se mueve con velocidad *v*, la densidad de corriente es *J* = ρ_v *v*',
      'No hace falta ningún material: pasa en el vacío, en un gas ionizado o en un haz de electrones',
      'No obedece la ley de Ohm — no hay red cristalina que frene a los portadores',
    ],
    formulas: ['*J* = ρ_v *v*'],
    fCaption: 'Un tubo de rayos catódicos, un propulsor iónico o un rayo son corrientes de convección.',
    diagram: <ConvectionDiagram/> },

  { id: 8, layout: 'example', tag: 'Ejemplo', section: '5.1',
    title: 'Corriente en un haz',
    given: 'Un haz cilíndrico de 2 mm de radio lleva ρ_v = −0.1 C/m³ a v = 3 × 10^6 m/s.',
    items: [
      'Densidad de corriente:  J = ρ_v v = (−0.1)(3×10^6) = −3×10^5 A/m²',
      'El signo dice que *J* apunta en contra de *v*, porque la carga es negativa',
      'Área de la sección:  S = πr^2 = π(2×10^{−3})^2 = 1.257×10^{−5} m²',
      'Corriente total:  I = J S = (3×10^5)(1.257×10^{−5})',
    ],
    formulas: ['|I| = 3.77 A'],
    fCaption: 'Como J es uniforme sobre la sección, la integral se reduce a un producto.',
    practice: {
      code: 'Nota',
      q: 'Si J variara con el radio — por ejemplo J = J_0(1 − r²/a²) — habría que integrar de verdad: I = ∫J(r) 2πr dr.',
      a: [],
    } },

  { id: 9, layout: 'formula', tag: '§ 5.3', section: '5.3',
    title: 'Corriente de conducción',
    body: 'La segunda forma, y la que ocurre dentro de un metal: los electrones libres son acelerados por el campo pero chocan constantemente con la red, y acaban derivando a velocidad constante.',
    items: [
      'La velocidad de deriva es proporcional al campo:  *v*_d = −μ_e *E*, con μ_e la movilidad',
      'Combinando con *J* = ρ_v *v* aparece una constante que agrupa todo lo del material',
      'Esa constante es la conductividad σ, y el resultado es la ley de Ohm en forma puntual',
      'Los electrones derivan a fracciones de milímetro por segundo; la señal viaja casi a la velocidad de la luz',
    ],
    formulas: ['*J* = σ *E*'],
    fCaption: 'La señal es la propagación del campo, no el viaje de los electrones. Por eso la luz enciende al instante.',
    diagram: <ConductionDiagram/>, interactive: true,
    hint: 'Arrastra E y mira acelerar la deriva' },

  { id: 10, layout: 'formula', tag: '§ 5.3', section: '5.3',
    title: 'Conductividad y resistividad',
    body: 'Dos nombres para la misma propiedad, uno el recíproco del otro. Cuál se use depende sólo de la costumbre de cada rama.',
    items: [
      'Conductividad σ, en siemens por metro (S/m) — mide qué tan bien conduce el material',
      'Resistividad ρ = 1/σ, en ohm·metro (Ω·m) — mide qué tanto se opone',
      'Cuidado con la notación: esa ρ no es una densidad de carga, aunque comparta la letra',
      'En los metales σ *baja* al subir la temperatura; en los semiconductores, sube',
    ],
    formulas: ['σ = @{1}{ρ}     *J* = σ*E* = @{*E*}{ρ}'],
    note: 'El signo del coeficiente de temperatura es lo que distingue a un metal de un semiconductor mucho mejor que el valor de σ.' },

  { id: 11, layout: 'table', tag: 'Datos', section: '5.3', dense: true,
    title: 'Conductividad de materiales comunes',
    body: 'El rango es enorme, y por eso conviene pensar en órdenes de magnitud antes que en cifras exactas.',
    tableHead: ['Material', 'σ (S/m)', 'Tipo', 'Uso típico'],
    tableRows: [
      ['Plata', '6.17 × 10^7', 'conductor', 'contactos de alta calidad'],
      ['Cobre', '5.80 × 10^7', 'conductor', 'todo el cableado eléctrico'],
      ['Aluminio', '3.82 × 10^7', 'conductor', 'líneas de transmisión'],
      ['Silicio', '4.4 × 10^{−4}', 'semiconductor', 'toda la electrónica'],
      ['Vidrio', '10^{−12}', 'dieléctrico', 'aisladores'],
      ['Cuarzo', '10^{−17}', 'dieléctrico', 'el mejor aislante práctico'],
    ],
    note: 'Del cuarzo al cobre hay veinticuatro órdenes de magnitud — el rango más amplio de toda la física de materiales.' },

  { id: 12, layout: 'formula', tag: '§ 5.3', section: '5.3',
    title: 'De J = σE a V = IR',
    body: 'La ley de Ohm de los circuitos no es una ley aparte: sale de integrar la forma puntual sobre un conductor de sección uniforme.',
    items: [
      'Con *J* uniforme sobre la sección S:  I = J S = σ E S',
      'Con *E* uniforme a lo largo de L:  V = E L, de modo que E = V/L',
      'Sustituyendo:  I = σ S V / L,  es decir  V = I · @{L}{σS}',
      'El paréntesis es una propiedad puramente geométrica del cuerpo: su resistencia',
    ],
    formulas: ['R = @{L}{σ S}     ⇒     V = I R'],
    fCaption: 'La hipótesis de uniformidad es esencial: si J o E varían sobre la sección, hay que integrar.',
    diagram: <ResistanceDiagram/>, interactive: true,
    hint: 'Arrastra el largo y el radio' },

  { id: 13, layout: 'example', tag: 'Ejemplo', section: '5.3',
    title: 'Resistencia de un alambre',
    given: 'Alambre de cobre calibre 16 (radio 0.64 mm), de 100 m de largo, a temperatura ambiente.',
    items: [
      'Sección:  S = π(0.64×10^{−3})^2 = 1.287×10^{−6} m²',
      'Conductividad del cobre:  σ = 5.80×10^7 S/m',
      'R = @{L}{σS} = @{100}{(5.80×10^7)(1.287×10^{−6})}',
      'R = 1.34 Ω',
    ],
    formulas: ['R = 1.34 Ω   ⇒   con 10 A, la caída es V = 13.4 V'],
    fCaption: 'Esa caída es la razón por la que las instalaciones largas usan calibre grueso: R baja con el cuadrado del radio.',
    practice: {
      code: 'D5.4',
      q: 'Un alambre de aluminio (σ = 3.82×10^7 S/m) de 2 mm de diámetro debe tener R = 0.1 Ω. ¿Qué longitud debe tener?',
      a: ['S = π(10^{−3})^2 = 3.14×10^{−6} m²', 'L = R σ S = 12.0 m'],
    } },

  { id: 14, layout: 'formula', tag: '§ 5.2', section: '5.2',
    title: 'La ecuación de continuidad',
    body: 'La carga no se crea ni se destruye. Escrito como ecuación, ese principio relaciona lo que sale de una región con lo que queda dentro.',
    items: [
      'Forma integral:  ∮_S *J* · d*S* = − @{dQ_i}{dt} — lo que atraviesa la frontera sale del interior',
      'El signo menos es lo esencial: flujo saliente positivo significa carga interior decreciendo',
      'Aplicando el teorema de la divergencia y haciendo el volumen infinitesimal se obtiene la forma puntual',
      'En régimen estacionario nada cambia con el tiempo ⇒ ∇·*J* = 0, y la corriente no se acumula en ningún punto',
    ],
    formulas: [
      '∇ · *J* = − @{∂ρ_v}{∂t}',
    ],
    fCaption: '∇·*J* = 0 en estado estacionario es exactamente la ley de corrientes de Kirchhoff: lo que entra a un nodo, sale.',
    diagram: <ContinuityDiagram/> },

  { id: 15, layout: 'formula', tag: '§ 5.2', section: '5.2',
    title: 'Tiempo de relajación',
    body: 'Combinando continuidad, la ley de Ohm puntual y la primera ecuación de Maxwell se obtiene con qué rapidez un conductor expulsa la carga que se le meta dentro.',
    items: [
      'De ∇·*J* = −∂ρ_v/∂t, con *J* = σ*E* y ∇·*E* = ρ_v/ε:  @{∂ρ_v}{∂t} + @{σ}{ε} ρ_v = 0',
      'La solución es una exponencial decreciente:  ρ_v = ρ_0 e^{−(σ/ε)t}',
      'La constante de tiempo τ = ε/σ se llama tiempo de relajación',
      'Para el cobre τ ≈ 1.5 × 10^{−19} s — la carga interior desaparece instantáneamente para cualquier fin práctico',
    ],
    formulas: ['τ = @{ε}{σ}     ρ_v = ρ_0 e^{−t/τ}'],
    fCaption: 'Ese τ ridículamente pequeño es la justificación cuantitativa de todo lo que sigue: dentro de un conductor no hay carga.' },

  { id: 16, layout: 'concept', tag: '§ 5.4', section: '5.4',
    title: 'Propiedades de un conductor',
    body: 'En condiciones estáticas, cuatro consecuencias se siguen de lo anterior. Se usan constantemente, y casi siempre sin justificarlas.',
    items: [
      'La densidad de carga en el *interior* es cero — el tiempo de relajación se encargó de eso',
      'Toda la carga se distribuye en la *superficie*, como una densidad ρ_S',
      'El campo eléctrico dentro del conductor es nulo:  *E* = 0',
      'En consecuencia el conductor entero es un *volumen equipotencial*: V es el mismo en todos sus puntos',
    ],
    note: 'Si *E* no fuera cero dentro, movería a los electrones libres — y entonces no sería una situación estática. La condición estática obliga al resultado.' },

  { id: 17, layout: 'formula', tag: '§ 5.4', section: '5.4',
    title: 'Condiciones de frontera',
    body: 'Justo en la superficie de un conductor, el campo tiene sólo dos grados de libertad, y ambos quedan fijados.',
    items: [
      'La componente *tangencial* se anula:  E_t = 0.  Si no lo hiciera, arrastraría la carga superficial hasta anularla',
      'La componente *normal* queda fijada por la carga superficial:  D_N = ρ_S',
      'Juntas dicen que las líneas de campo salen siempre *perpendiculares* a la superficie de un conductor',
      'Y como E_t = 0, la superficie es una equipotencial — coherente con que todo el volumen lo sea',
    ],
    formulas: ['E_t = 0        D_N = ε_0 E_N = ρ_S'],
    fCaption: 'Estas dos condiciones son las que hacen resoluble el problema de Laplace del que se ocupa la Parte B.',
    diagram: <ConductorBoundaryDiagram/>, interactive: true,
    hint: 'Intenta inclinar el campo en la superficie' },

  { id: 18, layout: 'example', tag: 'Ejemplo', section: '5.4',
    title: 'Campo en la superficie de un conductor',
    given: 'Un conductor tiene una densidad superficial ρ_S = 12 nC/m² en cierto punto de su superficie.',
    items: [
      'Componente normal:  D_N = ρ_S = 12 nC/m²',
      'Campo:  E_N = D_N/ε_0 = 12×10^{−9} / 8.854×10^{−12}',
      'E_N = 1355 V/m,  dirigido hacia afuera del conductor',
      'Componente tangencial:  E_t = 0, por la condición de frontera',
    ],
    formulas: ['*E* = 1355 *a*_N V/m,  exactamente normal a la superficie'],
    fCaption: 'El campo dentro es cero y justo afuera vale ρ_S/ε_0: hay un salto discontinuo al cruzar la superficie.',
    practice: {
      code: 'Comparación',
      q: 'Nótese que aquí sale ρ_S/ε_0, no ρ_S/2ε_0 como en la lámina aislada de la Parte A del Módulo II. La diferencia: en un conductor el campo interior es cero, así que todo el flujo sale por un solo lado.',
      a: [],
    } },

  { id: 19, layout: 'formula', tag: '§ 5.5', section: '5.5',
    title: 'El método de las imágenes',
    body: 'Un truco que aprovecha las condiciones de frontera: si una configuración ficticia produce las mismas condiciones en la frontera, produce el mismo campo en toda la región de interés.',
    items: [
      'Una carga Q a una altura h sobre un plano conductor a tierra impone V = 0 en el plano',
      'Una carga −Q colocada a −h, sin ningún plano, impone exactamente lo mismo por simetría',
      'Entonces el campo por encima del plano es el de ese par de cargas — un problema ya resuelto',
      'La fuerza sobre Q resulta de atracción, con la separación 2h entre carga e imagen',
    ],
    formulas: ['*F* = − @{Q^2}{4πε_0 (2h)^2} *a*_z'],
    fCaption: 'La imagen no existe: es un artificio de cálculo válido sólo por encima del plano. Debajo, el campo real es cero.',
    diagram: <ImageChargeDiagram/>, interactive: true,
    hint: 'Arrastra la carga y cambia h' },

  { id: 20, layout: 'table', tag: 'Síntesis', section: '5.5', dense: true,
    title: 'Las dos corrientes, lado a lado',
    body: 'Comparten la definición de *J* y poco más. Confundirlas es el error más costoso de esta parte.',
    tableHead: ['', 'Convección', 'Conducción'],
    tableRows: [
      ['Expresión', '*J* = ρ_v *v*', '*J* = σ *E*'],
      ['Dónde ocurre', 'vacío, gases, haces', 'dentro de un conductor'],
      ['Portadores', 'la carga viaja en bloque', 'electrones libres que derivan'],
      ['¿Ley de Ohm?', 'no — nada los frena', 'sí, es su forma puntual'],
      ['Velocidad típica', '10^6 m/s o más', 'fracciones de mm/s'],
    ],
    note: 'La velocidad es lo que más sorprende: los electrones de un cable van lentísimos, pero el campo que los empuja se propaga casi a c.' },

  { id: 21, layout: 'pitfalls', tag: 'Advertencia', section: 'Síntesis',
    title: 'Los errores que sí cuestan puntos',
    body: 'Esta parte introduce muchas letras nuevas, y varias chocan con las del Módulo anterior.',
    pitfalls: [
      ['Confundir la resistividad ρ con la densidad de carga ρ_v',
       'Son cosas distintas con la misma letra. La resistividad va en Ω·m; la densidad, en C/m³'],
      ['Escribir I = *J* S sin verificar que *J* sea uniforme y normal a la superficie',
       'En general I = ∫_S *J*·d*S*. El producto sólo vale si J es uniforme y perpendicular a S'],
      ['Aplicar *J* = σ*E* a una corriente de convección',
       'La ley de Ohm sólo describe conducción. Un haz en el vacío usa *J* = ρ_v *v*'],
      ['Olvidar el signo menos en la ecuación de continuidad',
       '∇·*J* = −∂ρ_v/∂t. Sin el signo, la carga se crearía en vez de conservarse'],
      ['Usar E = ρ_S/2ε_0 en la superficie de un conductor',
       'Ahí vale ρ_S/ε_0: el campo interior es cero, así que todo el flujo sale por un solo lado'],
    ] },

  { id: 22, layout: 'example', tag: 'Integrador', section: 'Síntesis',
    title: 'Resistencia de un tronco de cono',
    given: 'Conductor con forma de cono truncado, de radio a en un extremo y b en el otro, largo L, conductividad σ.',
    items: [
      'La sección cambia con la posición, así que R = L/σS no se puede aplicar directamente',
      'Se toma un disco de espesor dz a la altura z, con radio r(z) = a + (b−a)@{z}{L}',
      'Su resistencia diferencial es  dR = @{dz}{σ π r(z)^2}',
      'Las rodajas están en serie, así que las resistencias se suman:  R = ∫_0^L dR',
    ],
    formulas: ['R = @{L}{σ π a b}'],
    fCaption: 'El resultado es la fórmula de siempre con el área evaluada en la *media geométrica* de los dos radios, no en la aritmética.',
    practice: {
      code: 'Verificación',
      q: 'Si a = b, la expresión se reduce a L/(σπa²) = L/σS — la fórmula del cilindro. Todo resultado integrado debería pasar esa prueba.',
      a: [],
    } },

  { id: 23, layout: 'summary', tag: 'Cierre', section: 'Síntesis',
    title: 'Conceptos clave',
    items: [
      'Los materiales se clasifican por σ, y el rango cubre veinticuatro órdenes de magnitud',
      'Corriente:  I = dQ/dt, en amperes — un escalar',
      'Densidad de corriente:  I = ∫_S *J*·d*S* — la versión local y vectorial',
      'Convección:  *J* = ρ_v*v*, sin material de por medio y sin ley de Ohm',
      'Conducción:  *J* = σ*E*, la ley de Ohm en forma puntual',
      'Resistencia:  R = L/σS, válida sólo con *J* uniforme sobre la sección',
      'Continuidad:  ∇·*J* = −∂ρ_v/∂t — la conservación de la carga, en ecuación',
      'En un conductor estático: ρ_v = 0 dentro, *E* = 0 dentro, E_t = 0 y D_N = ρ_S en la superficie',
    ],
    backdrop: true },

  { id: 24, layout: 'end',
    title: 'Conductores\ny Corriente',
    subtitle: 'Un conductor resuelve el problema del campo expulsándolo: adentro no hay nada.\nUn dieléctrico hace algo mucho más interesante — no puede expulsarlo,\nasí que lo debilita desde dentro. Eso es la Parte B.',
    footer: 'Módulo III · Parte A completa', backdrop: true },
]

function accentFor(s: SD): string {
  const sec = s.section ?? ''
  if (sec === '5.0' || sec === '5.1') return ORO
  if (sec === '5.3') return ESCARCHA
  if (sec === '5.2') return AURORA
  if (sec === '5.4' || sec === '5.5') return VIOLETA
  if (sec === 'Síntesis') return ORO
  return ESCARCHA
}

function actLabel(s: SD): string | null {
  const sec = s.section ?? ''
  if (sec === '5.0' || sec === '5.1') return 'Corriente y densidad'
  if (sec === '5.3') return 'Conducción y Ohm'
  if (sec === '5.2') return 'Continuidad'
  if (sec === '5.4' || sec === '5.5') return 'Fronteras del conductor'
  return null
}

function actNumeral(s: SD): string | null {
  const sec = s.section ?? ''
  if (sec === '5.0' || sec === '5.1') return 'I'
  if (sec === '5.3') return 'II'
  if (sec === '5.2') return 'III'
  if (sec === '5.4' || sec === '5.5') return 'IV'
  return null
}

export default function App() {
  return <Deck slides={SLIDES} accentFor={accentFor} actLabel={actLabel} actNumeral={actNumeral} theme={THEMES.corriente}/>
}
