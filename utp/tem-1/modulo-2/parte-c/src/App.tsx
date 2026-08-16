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

/* ── 01 · Work done pushing a charge against the field ── */
function WorkDiagram() {
  const t = useTick()
  /* the charge creeps from A to B against the field, on a loop */
  const u = (t * 0.22) % 1
  const A = { x: 62, y: 190 }
  const B = { x: 236, y: 92 }
  const cx = A.x + (B.x - A.x) * u
  const cy = A.y + (B.y - A.y) * u

  return (
    <Board
      chip="dW = −Q *E* · d*L*"
      chipSub="el signo dice que mover contra el campo cuesta trabajo"
      chipColor={ORO}
      foot={<>
        <RLabel x={24} y={252} text="W > 0 : lo hace un agente externo, contra *E*" color={ORO} size={9.6}/>
        <RLabel x={24} y={268} text="W < 0 : lo hace el campo, y la carga gana energía" color="rgba(220,238,248,.5)" size={9.2}/>
        <RLabel x={24} y={283} text="sólo cuenta la componente de d*L* paralela a *E*" color="rgba(220,238,248,.34)" size={9.2}/>
      </>}>
      {/* a uniform field pointing left-down */}
      {[76, 112, 148, 184].map((y, i) => (
        <Fragment key={i}>
          {[70, 130, 190, 250].map((x, j) => (
            <line key={j} x1={x + 14} y1={y - 8} x2={x - 14} y2={y + 8}
              stroke={NEG} strokeWidth="1.2" opacity=".28" markerEnd="url(#aBs)"/>
          ))}
        </Fragment>
      ))}
      <MLabel x={264} y={214} text="*E*" color={NEG} size={12} delay="d2"/>

      {/* the path from A to B */}
      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={ORO} strokeWidth="2"
        strokeDasharray="5 5" opacity=".7"/>
      <circle cx={A.x} cy={A.y} r="5" fill={HIELO} opacity=".85"/>
      <circle cx={B.x} cy={B.y} r="5" fill={HIELO} opacity=".85"/>
      <MLabel x={A.x - 4} y={A.y + 20} text="A" color={HIELO} size={12} delay="d3"/>
      <MLabel x={B.x + 6} y={B.y - 12} text="B" color={HIELO} size={12} delay="d3"/>

      {/* the moving charge, and the force that has to push it */}
      <Charge x={cx} y={cy} sign={1} r={9}/>
      <line x1={cx} y1={cy} x2={cx + 30} y2={cy - 17}
        stroke={ORO} strokeWidth="2.2" markerEnd="url(#aG)"/>
      <MLabel x={cx + 40} y={cy - 22} text="*F*_{ext}" color={ORO} size={10.5} anchor="start"/>
      <MLabel x={150} y={66} text="empujar de A a B cuesta trabajo" color="rgba(220,238,248,.42)" size={10} delay="d5"/>
    </Board>
  )
}

/* ── 02 · Path independence: two routes, identical work ── */
function PathDiagram() {
  const [bow, setBow] = useState(58)
  const A = { x: 56, y: 186 }
  const B = { x: 244, y: 106 }

  const { svgRef, handleMove, start, stop } = useDrag((x, y) => {
    setBow(Math.max(-70, Math.min(78, 150 - y)))
  })

  /* the curved route bulges by `bow`; the straight one never moves */
  const mx = (A.x + B.x) / 2
  const my = (A.y + B.y) / 2 - bow

  return (
    <Board grab svgRef={svgRef} onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}
      chip="W = −Q ∫_A^B *E* · d*L*"
      chipSub="el resultado no depende del camino elegido"
      chipColor={ORO}
      foot={<>
        <RLabel x={24} y={251} text="W (recta) = W (curva)" color={ORO} size={11.5}/>
        <RLabel x={24} y={268} text="el campo electrostático es conservativo" color="rgba(220,238,248,.5)" size={9.4}/>
        <RLabel x={24} y={283} text="por eso V_{AB} está bien definido: sólo depende de A y B" color="rgba(220,238,248,.32)" size={8.8}/>
      </>}>
      {/* radial field of a charge sitting off to one side */}
      {Array.from({ length: 10 }, (_, i) => {
        const a = -0.9 + (i / 10) * 2.4
        return (
          <line key={i} x1={150 + Math.cos(a) * 20} y1={252 + Math.sin(a) * 20}
            x2={150 + Math.cos(a) * 200} y2={252 + Math.sin(a) * 200}
            stroke={NEG} strokeWidth="1" opacity=".16"/>
        )
      })}

      <path d={`M ${A.x} ${A.y} Q ${mx} ${my} ${B.x} ${B.y}`} fill="none"
        stroke={AURORA} strokeWidth="2.4" strokeLinecap="round"/>
      <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke={ORO} strokeWidth="2.4"
        strokeDasharray="6 5" strokeLinecap="round"/>

      <circle cx={A.x} cy={A.y} r="6" fill={HIELO}/>
      <circle cx={B.x} cy={B.y} r="6" fill={HIELO}/>
      <MLabel x={A.x - 2} y={A.y + 22} text="A" color={HIELO} size={12} delay="d3"/>
      <MLabel x={B.x + 4} y={B.y - 14} text="B" color={HIELO} size={12} delay="d3"/>

      <MLabel x={mx + 40} y={my - 10} text="camino 2" color={AURORA} size={9.5} anchor="start" delay="d4"/>
      <MLabel x={mx - 30} y={my + bow + 26} text="camino 1" color={ORO} size={9.5} anchor="end" delay="d4"/>
      <DragHandle x={mx} y={150 - bow} onDown={start('b')} color={AURORA}/>
    </Board>
  )
}

/* ── 03 · Potential of a point charge: 1/R against the field's 1/R² ── */
function PointPotentialDiagram() {
  const O = { x: 150, y: 118 }
  const [r, setR] = useState(58)

  const { svgRef, handleMove, start, stop } = useDrag((x, y) => {
    setR(Math.max(26, Math.min(92, Math.hypot(x - O.x, y - O.y))))
  })

  const R = r / U
  /* Q = 5 nC ⇒ V = 9e9·5e-9/R = 45/R volts, E = 45/R² V/m */
  const V = 45 / R
  const E = 45 / (R * R)

  /* the little comparison plot in the stage band */
  const px = (i: number) => 44 + i * 2.12          /* 0…100 → 44…256 */
  const curve = (f: (x: number) => number, k: number) =>
    Array.from({ length: 101 }, (_, i) => {
      const rr = 0.7 + (i / 100) * 4.3
      return `${px(i).toFixed(1)},${(214 - Math.min(46, f(rr) * k)).toFixed(1)}`
    }).join(' ')

  return (
    <Board grab svgRef={svgRef} onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}
      chip="V = @{Q}{4πε_0 R}"
      chipSub="escalar, y con referencia cero en el infinito"
      chipColor={ESCARCHA}
      foot={<>
        <RLabel x={24} y={251} text={`R = ${R.toFixed(2)} m`} color={ESCARCHA} size={11}/>
        <RLabel x={120} y={251} text={`V = ${V.toFixed(1)} V`} color={ORO} size={11}/>
        <RLabel x={214} y={251} text={`E = ${E.toFixed(1)} V/m`} color={AURORA} size={10}/>
        <RLabel x={24} y={268} text="Q = 5 nC — V cae con 1/R, E con 1/R²" color="rgba(220,238,248,.5)" size={9.4}/>
        <RLabel x={24} y={283} text="V es un escalar: se suma sin descomponer en componentes" color="rgba(220,238,248,.32)" size={8.8}/>
      </>}>
      {/* equipotential rings — circles, because V depends only on R */}
      {[30, 46, 64, 86].map((rr, i) => (
        <circle key={i} cx={O.x} cy={O.y} r={rr} fill="none" stroke={ORO}
          strokeWidth="1" strokeOpacity={0.34 - i * 0.06} strokeDasharray="4 4"/>
      ))}
      <circle cx={O.x} cy={O.y} r={r} fill="none" stroke={ORO} strokeWidth="2" opacity=".85"/>
      <Charge x={O.x} y={O.y} sign={1} r={9} label="Q"/>
      <DragHandle x={O.x + r} y={O.y} onDown={start('r')} color={ESCARCHA}/>

      {/* 1/R against 1/R², drawn to the same scale */}
      <line x1={44} y1={214} x2={258} y2={214} stroke="rgba(160,200,232,.25)" strokeWidth="1"/>
      <polyline points={curve(rr => 1 / rr, 34)} fill="none" stroke={ORO} strokeWidth="1.8"/>
      <polyline points={curve(rr => 1 / (rr * rr), 34)} fill="none" stroke={AURORA} strokeWidth="1.8"/>
      <MLabel x={262} y={192} text="V" color={ORO} size={10} anchor="start"/>
      <MLabel x={262} y={210} text="E" color={AURORA} size={10} anchor="start"/>
      <MLabel x={44} y={226} text="R →" color="rgba(220,238,248,.35)" size={8.5} anchor="start"/>
    </Board>
  )
}

/* ── 04 · Equipotentials and the gradient that crosses them ── */
function EquipotentialDiagram() {
  const O = { x: 150, y: MID }
  const [P, setP] = useState({ x: 216, y: 104 })

  const { svgRef, handleMove, start, stop } = useDrag((x, y) => {
    const dx = x - O.x
    const dy = y - O.y
    const rr = Math.max(38, Math.min(84, Math.hypot(dx, dy)))
    const a = Math.atan2(dy, dx)
    setP({ x: O.x + Math.cos(a) * rr, y: O.y + Math.sin(a) * rr })
  })

  const dx = P.x - O.x
  const dy = P.y - O.y
  const d = Math.hypot(dx, dy)
  const ux = dx / d
  const uy = dy / d
  const R = d / U
  const V = 45 / R

  return (
    <Board grab svgRef={svgRef} onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}
      chip="*E* = −∇V"
      chipSub="normal a la equipotencial, hacia donde V disminuye"
      chipColor={AURORA}
      foot={<>
        <RLabel x={24} y={251} text={`V = ${V.toFixed(1)} V`} color={ORO} size={11}/>
        <RLabel x={132} y={251} text="*E* ⊥ equipotencial" color={AURORA} size={10}/>
        <RLabel x={24} y={268} text="moverse sobre la equipotencial no cuesta trabajo" color="rgba(220,238,248,.5)" size={9.2}/>
        <RLabel x={24} y={283} text="el signo − es lo que hace que E caiga de + a −" color="rgba(220,238,248,.32)" size={9}/>
      </>}>
      {[40, 56, 72, 88].map((rr, i) => (
        <circle key={i} cx={O.x} cy={O.y} r={rr} fill="none" stroke={ORO}
          strokeWidth="1.1" strokeOpacity={0.4 - i * 0.06} strokeDasharray="5 4"/>
      ))}
      <circle cx={O.x} cy={O.y} r={d} fill="none" stroke={ORO} strokeWidth="2" opacity=".8"/>
      <MLabel x={O.x} y={O.y - d - 7} text="V constante" color={ORO} size={9.5} delay="d4"/>

      <Charge x={O.x} y={O.y} sign={1} r={9} label="Q"/>

      {/* E outward (normal), and the tangent along which nothing changes */}
      <Vec x1={P.x} y1={P.y} x2={P.x + ux * 40} y2={P.y + uy * 40}
        color={AURORA} marker="aGr" delay="d3" width={2.8}/>
      <line x1={P.x - uy * 34} y1={P.y + ux * 34} x2={P.x + uy * 34} y2={P.y - ux * 34}
        stroke={NEG} strokeWidth="1.6" opacity=".6" strokeDasharray="4 3"/>

      <MLabel x={P.x + ux * 54} y={P.y + uy * 54 + 4} text="*E*" color={AURORA} size={12} delay="d5"/>
      <MLabel x={P.x - uy * 46} y={P.y + ux * 46 + 4} text="d*L*" color={NEG} size={10} delay="d5"/>
      <DragHandle x={P.x} y={P.y} onDown={start('p')} color={ESCARCHA}/>
    </Board>
  )
}

/* ── 05 · Zero circulation around any closed path ── */
function CirculationDiagram() {
  const t = useTick()
  const u = (t * 0.16) % 1
  const O = { x: 150, y: 136 }

  /* a closed loop that visits four different potentials and comes back */
  const loop = Array.from({ length: 5 }, (_, i) => {
    const a = (i / 4) * Math.PI * 2 - Math.PI / 2
    return { x: O.x + Math.cos(a) * (58 + (i % 2) * 22), y: O.y + Math.sin(a) * (52 + (i % 2) * 18) }
  })
  const path = loop.map((p, i) => `${i ? 'L' : 'M'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z'

  /* walk a dot around it */
  const seg = Math.floor(u * 4)
  const f = u * 4 - seg
  const a0 = loop[seg]
  const a1 = loop[(seg + 1) % 4]
  const tx = a0.x + (a1.x - a0.x) * f
  const ty = a0.y + (a1.y - a0.y) * f

  return (
    <Board
      chip="∮ *E* · d*L* = 0"
      chipSub="ir y volver por cualquier camino no cuesta nada"
      chipColor={AURORA}
      foot={<>
        <RLabel x={24} y={252} text="es la ley de voltajes de Kirchhoff, en forma vectorial" color={AURORA} size={9.4}/>
        <RLabel x={24} y={268} text="V_{AB} + V_{BC} + V_{CD} + V_{DA} = 0, siempre" color="rgba(220,238,248,.5)" size={9.2}/>
        <RLabel x={24} y={283} text="su forma puntual es ∇ × *E* = 0" color="rgba(220,238,248,.34)" size={9.2}/>
      </>}>
      {/* the field this loop lives in */}
      {Array.from({ length: 24 }, (_, i) => {
        const cx = 40 + (i % 6) * 44
        const cy = 68 + Math.floor(i / 6) * 42
        return (
          <line key={i} x1={cx - 11} y1={cy} x2={cx + 11} y2={cy}
            stroke={NEG} strokeWidth="1" opacity=".16" markerEnd="url(#aBs)"/>
        )
      })}

      <path d={path} fill={`${AURORA}0a`} stroke={AURORA} strokeWidth="2.2" strokeLinejoin="round"/>
      {loop.slice(0, 4).map((p, i) => (
        <Fragment key={i}>
          <circle cx={p.x} cy={p.y} r="5" fill={HIELO} opacity=".9"/>
          <text x={p.x + (p.x > O.x ? 12 : -12)} y={p.y + 4} fill={HIELO} fontSize="11"
            fontFamily="JetBrains Mono,monospace" textAnchor={p.x > O.x ? 'start' : 'end'}>
            {'ABCD'[i]}
          </text>
        </Fragment>
      ))}
      <circle cx={tx} cy={ty} r="10" fill={ORO} opacity=".16"/>
      <circle cx={tx} cy={ty} r="4.5" fill={ORO}/>
      <FxHtml x={150} y={210} w={220} h={22} text="W_{total} = 0" color={ORO} size={13}/>
    </Board>
  )
}

/* ── 06 · The electric dipole ── */
function DipoleDiagram() {
  const t = useTick()
  const O = { x: 150, y: 138 }
  const d = 26
  const pulse = 0.5 + 0.5 * Math.sin(t * 1.4)

  /* dipole field lines, drawn as arcs from + to − */
  const arcs = [0.5, 0.9, 1.5, 2.4]

  return (
    <Board
      chip="V = @{Q d cos θ}{4πε_0 r^2}"
      chipSub="cae con 1/r², no con 1/r — las cargas casi se cancelan"
      chipColor={VIOLETA}
      foot={<>
        <RLabel x={24} y={252} text="momento dipolar:  *p* = Q *d*,  en C·m" color={VIOLETA} size={10}/>
        <RLabel x={24} y={268} text="V = *p* · *a*_r / 4πε_0 r^2 — depende del ángulo" color="rgba(220,238,248,.5)" size={9.2}/>
        <RLabel x={24} y={283} text="en el plano θ = 90° el potencial vale cero" color="rgba(220,238,248,.34)" size={9.2}/>
      </>}>
      {/* the two lobes of field lines */}
      {arcs.map((k, i) => (
        <Fragment key={i}>
          <path d={`M ${O.x} ${O.y - d} C ${O.x + 60 * k} ${O.y - d - 30 * k} ${O.x + 60 * k} ${O.y + d + 30 * k} ${O.x} ${O.y + d}`}
            fill="none" stroke={POS} strokeWidth="1.4" opacity={0.5 - i * 0.08}/>
          <path d={`M ${O.x} ${O.y - d} C ${O.x - 60 * k} ${O.y - d - 30 * k} ${O.x - 60 * k} ${O.y + d + 30 * k} ${O.x} ${O.y + d}`}
            fill="none" stroke={POS} strokeWidth="1.4" opacity={0.5 - i * 0.08}/>
        </Fragment>
      ))}

      {/* the θ = 90° plane, where V = 0 */}
      <line x1={38} y1={O.y} x2={262} y2={O.y} stroke={AURORA} strokeWidth="1.2"
        strokeDasharray="6 4" opacity={0.4 + pulse * 0.3}/>
      <MLabel x={258} y={O.y - 8} text="V = 0" color={AURORA} size={9.5} anchor="end" delay="d5"/>

      <Charge x={O.x} y={O.y - d} sign={1} r={9}/>
      <Charge x={O.x} y={O.y + d} sign={-1} r={9}/>
      <line x1={O.x} y1={O.y + d} x2={O.x} y2={O.y - d} stroke={VIOLETA} strokeWidth="2.4"
        markerEnd="url(#aV)" opacity=".9"/>
      <MLabel x={O.x + 16} y={O.y + 4} text="*p*" color={VIOLETA} size={12} anchor="start" delay="d4"/>
      <MLabel x={O.x - 16} y={O.y + 4} text="d" color="rgba(220,238,248,.5)" size={10} anchor="end" delay="d4"/>
      <MLabel x={150} y={64} text="θ" color="rgba(220,238,248,.42)" size={11} delay="d5"/>
    </Board>
  )
}

/* ── 07 · Assembling a distribution, one charge at a time ── */
function EnergyAssemblyDiagram() {
  const [step, setStep] = useState(3)
  const Q = [
    { x: 96,  y: 108 },
    { x: 208, y: 108 },
    { x: 208, y: 196 },
    { x: 96,  y: 196 },
  ]
  /* work to bring in charge n: it feels the n−1 already placed */
  const cost = ['0', 'Q²/4πε₀d', '2.71 Q²/4πε₀d', '4.41 Q²/4πε₀d']

  return (
    <Board
      chip="W_E = @{1}{2} Σ Q_m V_m"
      chipSub="el ½ evita contar cada par de cargas dos veces"
      chipColor={VIOLETA}
      foot={<>
        <RLabel x={24} y={251} text={`traer la carga ${step + 1} cuesta:`} color="rgba(220,238,248,.5)" size={9.4}/>
        <RLabel x={24} y={268} text={cost[step]} color={VIOLETA} size={11}/>
        <RLabel x={24} y={284} text="la primera es gratis: no hay campo todavía" color="rgba(220,238,248,.32)" size={9}/>
      </>}>
      {/* step selector */}
      {[0, 1, 2, 3].map(i => (
        <g key={i} onPointerDown={() => setStep(i)} style={{ cursor: 'pointer' }}>
          <rect x={16 + i * 68} y={8} width="64" height="26" rx="6"
            fill={i === step ? `${VIOLETA}26` : 'rgba(160,200,232,.05)'}
            stroke={i === step ? VIOLETA : 'rgba(160,200,232,.18)'} strokeWidth="1"/>
          <text x={48 + i * 68} y={25} textAnchor="middle"
            fill={i === step ? VIOLETA : 'rgba(220,238,248,.45)'}
            fontSize="10.5" fontFamily="JetBrains Mono,monospace">{i + 1} carga{i ? 's' : ''}</text>
        </g>
      ))}

      {/* every pair already in place contributes one interaction */}
      {Q.slice(0, step + 1).map((a, i) =>
        Q.slice(0, step + 1).map((b, j) => (
          j > i ? (
            <line key={`${i}-${j}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={VIOLETA} strokeWidth="1.4" opacity=".4" strokeDasharray="4 4"/>
          ) : null
        ))
      )}

      {Q.map((q, i) => (
        i <= step ? (
          <Charge key={i} x={q.x} y={q.y} sign={1} r={11}
            label={i === step ? `Q_${i + 1}` : undefined}
            delay={`d${1 + i}`}/>
        ) : (
          <circle key={i} cx={q.x} cy={q.y} r="11" fill="none"
            stroke="rgba(160,200,232,.16)" strokeWidth="1.2" strokeDasharray="3 3"/>
        )
      ))}

      <MLabel x={150} y={232} text={`${(step * (step + 1)) / 2} pares de interacción`}
        color="rgba(220,238,248,.4)" size={9.5} delay="d6"/>
    </Board>
  )
}

/* ── 08 · Energy stored in the field of a capacitor ── */
function EnergyDensityDiagram() {
  const [gap, setGap] = useState(84)

  const { svgRef, handleMove, start, stop } = useDrag((x, y) => {
    setGap(Math.max(30, Math.min(120, (y - 82) * 2)))
  })

  const top = 140 - gap / 2
  const bot = 140 + gap / 2
  /* A real capacitor gap: millimetres, not metres. E is held fixed by the
     surface charge, so all that changes with the drag is the volume. */
  const d = gap / 8                          /* mm */
  const E = 400e3                            /* V/m — a realistic field */
  const w = 0.5 * 8.854e-12 * E * E * 1e3    /* mJ/m³ */
  const W = w * (d / 1000)                   /* mJ per m² of plate */

  return (
    <Board grab svgRef={svgRef} onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}
      chip="w_E = @{1}{2} *D* · *E* = @{1}{2} ε_0 E^2"
      chipSub="la energía no está en las cargas: está en el campo"
      chipColor={VIOLETA}
      foot={<>
        <RLabel x={24} y={251} text={`d = ${d.toFixed(1)} mm`} color={ESCARCHA} size={11}/>
        <RLabel x={116} y={251} text={`w_E = ${w.toFixed(2)} mJ/m³`} color={VIOLETA} size={10}/>
        <RLabel x={24} y={268} text={`W = w_E · vol = ${W.toFixed(3)} mJ por m² de placa`} color="rgba(220,238,248,.5)" size={9}/>
        <RLabel x={24} y={284} text="con E fijo, separar las placas guarda más energía" color="rgba(220,238,248,.32)" size={9}/>
      </>}>
      <rect x={64} y={top - 11} width="172" height="11" fill={`${BRASA}33`} stroke={POS} strokeWidth="2"/>
      <rect x={64} y={bot} width="172" height="11" fill={`${ESCARCHA}33`} stroke={NEG} strokeWidth="2"/>

      {/* the volume that holds the energy */}
      <rect x={64} y={top} width="172" height={gap} fill={`${VIOLETA}14`}
        stroke={VIOLETA} strokeWidth="1" strokeDasharray="4 4"/>
      {[86, 116, 146, 176, 206].map((x, i) => (
        <line key={i} x1={x} y1={top + 6} x2={x} y2={bot - 6}
          stroke={AURORA} strokeWidth="1.3" opacity=".42" markerEnd="url(#aGs)"/>
      ))}

      <MLabel x={46} y={top + 4} text="+ρ_S" color={POS} size={10} anchor="end" delay="d2"/>
      <MLabel x={46} y={bot + 10} text="−ρ_S" color={NEG} size={10} anchor="end" delay="d2"/>
      <line x1={250} y1={top} x2={250} y2={bot} stroke="rgba(220,238,248,.4)" strokeWidth="1"/>
      <MLabel x={262} y={140} text="d" color="rgba(220,238,248,.6)" size={11} anchor="start" delay="d3"/>
      <DragHandle x={250} y={bot} onDown={start('g')} color={ESCARCHA}/>
      <MLabel x={150} y={218} text="toda la energía vive entre las placas"
        color="rgba(220,238,248,.38)" size={9.5} delay="d6"/>
    </Board>
  )
}

/* ═══════════════════════════════════════════════════════════
   CONTENT
═══════════════════════════════════════════════════════════ */

const ACTS: Act[] = [
  { n: 'I', title: 'Trabajo y potencial', range: '§ 4.1 – 4.3', color: ORO,
    desc: 'Lo que cuesta mover una carga contra el campo, y la diferencia de potencial que resume ese costo.' },
  { n: 'II', title: 'El campo potencial', range: '§ 4.4', color: ESCARCHA,
    desc: 'V de una carga puntual y de distribuciones — un escalar que se suma sin descomponer nada.' },
  { n: 'III', title: 'Gradiente y circulación', range: '§ 4.5 – 4.6', color: AURORA,
    desc: '*E* = −∇V, la circulación nula del campo electrostático, y la segunda ecuación de Maxwell.' },
  { n: 'IV', title: 'Energía electrostática', range: '§ 4.7 – 4.8', color: VIOLETA,
    desc: 'El dipolo, la energía de armar una distribución y la densidad de energía guardada en el campo.' },
]

const SLIDES: SD[] = [
  { id: 1, layout: 'cover', tag: 'MÓDULO II · PARTE C',
    title: 'Potencial\ny Energía',
    subtitle: 'Teoría Electromagnética I · Del trabajo al potencial, y del potencial a la energía del campo',
    meta: 'Hayt & Buck · Teoría electromagnética · cap. 4 · §4.1 – 4.8',
    numeral: 'II', backdrop: true },

  { id: 2, layout: 'agenda', tag: 'Ruta',
    title: 'Cómo se arma esta parte',
    body: 'Un cambio de estrategia: en vez de sumar vectores, se suma un escalar. Todo lo que se calculó con *E* vuelve a salir, con mucho menos trabajo, a partir de V.',
    acts: ACTS },

  { id: 3, layout: 'visual', tag: 'Introducción', section: 'Intro',
    title: 'Por qué un escalar',
    body: 'Hasta aquí cada campo se armó sumando vectores: tres componentes, tres integrales, y un unitario que construir en cada término. Hay una descripción equivalente que no necesita nada de eso.',
    items: [
      'El potencial V es un *escalar*: sumar aportes es sumar números, sin componentes ni ángulos',
      'De V se recupera *E* derivando, así que no se pierde información en el camino',
      'Y aparece algo que con *E* solo no se veía: cuánta energía cuesta armar una distribución de carga',
    ],
    backdrop: true },

  { id: 4, layout: 'formula', tag: '§ 4.1', section: '4.1',
    title: 'Trabajo para mover una carga',
    body: 'Mover una carga dentro de un campo eléctrico cuesta o rinde energía, según si se va contra el campo o a favor.',
    items: [
      'La fuerza que el campo ejerce es *F* = Q*E*; para mover la carga hay que oponerse a ella',
      'El trabajo de un desplazamiento d*L* es dW = −Q *E* · d*L*',
      'El producto punto se encarga de que sólo cuente la componente del movimiento paralela al campo',
      'Moverse perpendicular a *E* no cuesta absolutamente nada',
    ],
    formulas: ['W = −Q ∫_{inicial}^{final} *E* · d*L*'],
    fCaption: 'El signo negativo es lo que hace que W sea positivo cuando se empuja contra el campo.',
    diagram: <WorkDiagram/> },

  { id: 5, layout: 'formula', tag: '§ 4.2', section: '4.2',
    title: 'La integral de línea',
    body: 'La integral se evalúa a lo largo de un camino concreto, y el resultado — en este caso — no depende de cuál se elija.',
    items: [
      'Se parametriza la trayectoria y se expresa d*L* en el sistema de coordenadas de la geometría',
      'Cartesianas: d*L* = dx *a*_x + dy *a*_y + dz *a*_z',
      'Cilíndricas: d*L* = dρ *a*_ρ + ρ dϕ *a*_ϕ + dz *a*_z  — la ρ del término angular es el error clásico',
      'Esféricas: d*L* = dr *a*_r + r dθ *a*_θ + r senθ dϕ *a*_ϕ',
    ],
    note: 'Un campo cuya integral de línea no depende del camino se llama *conservativo*. El campo electrostático lo es; el inducido por un campo magnético variable, no.',
    diagram: <PathDiagram/>, interactive: true,
    hint: 'Deforma el camino 2: el trabajo no cambia' },

  { id: 6, layout: 'example', tag: 'Ejemplo', section: '4.2',
    title: 'El mismo trabajo por dos caminos',
    given: '*E* = @{ρ_L}{2πε_0 ρ} *a*_ρ. Mover una carga de ρ = a a ρ = b, por dos rutas distintas.',
    items: [
      'Camino 1 — radial directo:  W = −Q ∫_a^b @{ρ_L}{2πε_0 ρ} dρ = −@{Qρ_L}{2πε_0} ln@{b}{a}',
      'Camino 2 — primero un arco a ρ = a, después radial hasta b',
      'En el arco, d*L* = ρ dϕ *a*_ϕ es perpendicular a *E* = E_ρ *a*_ρ ⇒ el producto punto es cero',
      'El tramo radial da exactamente lo mismo que antes ⇒ los dos caminos coinciden',
    ],
    formulas: ['W = −@{Q ρ_L}{2πε_0} ln @{b}{a}'],
    fCaption: 'El arco no aporta nada porque el movimiento es perpendicular al campo: la misma razón por la que no cuesta caminar en curva de nivel.',
    practice: {
      code: 'Nota',
      q: 'Que el resultado sea independiente del camino es lo que permite hablar de "el potencial en un punto" sin decir cómo se llegó hasta él.',
      a: [],
    } },

  { id: 7, layout: 'formula', tag: '§ 4.3', section: '4.3',
    title: 'Diferencia de potencial',
    body: 'Dividir el trabajo entre la carga movida quita la carga del resultado, igual que en la Parte A dividir la fuerza dio el campo.',
    items: [
      'V_{AB} es el trabajo por unidad de carga para llevarla de B hasta A, contra el campo',
      'Se mide en volts: 1 V = 1 J/C',
      'V_{AB} es positivo si hay que hacer trabajo, es decir si A está a mayor potencial que B',
      'V_{AB} = −V_{BA}: recorrer al revés cambia el signo, nunca la magnitud',
    ],
    formulas: [
      'V_{AB} = −∫_B^A *E* · d*L* = V_A − V_B',
    ],
    fCaption: 'Un voltímetro no mide "el potencial": mide siempre una diferencia entre dos puntos.' },

  { id: 8, layout: 'concept', tag: '§ 4.3', section: '4.3',
    title: 'Potencial absoluto y referencia',
    body: 'Sólo las diferencias tienen sentido físico. Para hablar del potencial *de un punto* hay que elegir dónde vale cero, y esa elección es un convenio.',
    items: [
      'La referencia habitual es el *infinito*: V → 0 cuando R → ∞',
      'Con esa referencia, V_A es el trabajo por unidad de carga para traerla desde el infinito hasta A',
      'En circuitos la referencia suele ser la tierra o el chasis — es el mismo convenio, en otro punto',
      'Cambiar la referencia suma una constante a todos los potenciales y no altera ninguna diferencia',
    ],
    note: 'Y como *E* = −∇V, esa constante desaparece al derivar: el campo no depende de dónde se puso el cero.' },

  { id: 9, layout: 'formula', tag: '§ 4.4', section: '4.4',
    title: 'Potencial de una carga puntual',
    body: 'Integrando el campo de una carga puntual desde el infinito hasta un radio R se obtiene el potencial más usado del capítulo.',
    items: [
      'V = −∫_∞^R @{Q}{4πε_0 r^2} dr = @{Q}{4πε_0 R}',
      'Cae con 1/R, mientras que el campo cae con 1/R² — una potencia menos, por la integración',
      'Las superficies equipotenciales son esferas concéntricas con la carga',
      'Si la carga es negativa, V es negativo en todas partes',
    ],
    formulas: ['V = @{Q}{4πε_0 R}'],
    fCaption: 'Un escalar sin dirección: aquí no hay ningún unitario que construir.',
    diagram: <PointPotentialDiagram/>, interactive: true,
    hint: 'Arrastra R y compara V con E' },

  { id: 10, layout: 'formula', tag: '§ 4.4', section: '4.4',
    title: 'Potencial de distribuciones',
    body: 'La ventaja del escalar se ve aquí: superponer potenciales es sumar números, sin descomponer nada en componentes.',
    items: [
      'Cargas discretas: V(*r*) = Σ @{Q_m}{4πε_0 |*r*−*r*_m|}',
      'Línea: V = ∫_L @{ρ_L dL′}{4πε_0 |*r*−*r*′|}',
      'Superficie: V = ∫_S @{ρ_S dS′}{4πε_0 |*r*−*r*′|}',
      'Volumen: V = ∫_{vol} @{ρ_v dv′}{4πε_0 |*r*−*r*′|}',
    ],
    fCaption: 'Comparar con la integral de *E* de la Parte A: allí había además un vector unitario dentro de la integral.',
    note: 'Estrategia general: calcular V, que es una sola integral escalar, y después obtener *E* derivando. Casi siempre es más corto que integrar *E* directamente.' },

  { id: 11, layout: 'example', tag: 'Ejemplo', section: '4.4',
    title: 'Potencial de un anillo de carga',
    given: 'Anillo de radio a con densidad uniforme ρ_L. Hallar V sobre el eje, a una altura z.',
    items: [
      'Todo punto del anillo está a la misma distancia del punto del eje:  r = √(a^2 + z^2)',
      'Esa distancia sale de la integral, porque no depende de la variable de integración',
      'V = @{1}{4πε_0 √(a^2+z^2)} ∫_0^{2π} ρ_L a dϕ',
      'La integral vale la carga total del anillo:  Q = 2πa ρ_L',
    ],
    formulas: ['V = @{Q}{4πε_0 √(a^2 + z^2)}'],
    fCaption: 'Con *E* habría hecho falta un argumento de simetría para cancelar las componentes radiales; con V no hace falta ninguno.',
    practice: {
      code: 'Verificación',
      q: 'Para z ≫ a queda V ≈ Q/4πε₀z: desde lejos, el anillo se ve como una carga puntual. Y derivando, E_z = Qz/[4πε₀(a²+z²)^{3/2}].',
      a: [],
    } },

  { id: 12, layout: 'formula', tag: '§ 4.5', section: '4.5',
    title: 'La circulación',
    body: 'Si el trabajo no depende del camino, entonces ir de A a B y volver por otra ruta cuesta exactamente cero. Esa es la propiedad que define a un campo conservativo.',
    items: [
      'Recorrer un lazo cerrado devuelve la carga a su punto de partida, y a su potencial de partida',
      'Es la ley de voltajes de Kirchhoff: la suma de las caídas de tensión en una malla es cero',
      'Vale para el campo electrostático; deja de valer cuando hay un campo magnético variando en el tiempo',
    ],
    formulas: ['∮ *E* · d*L* = 0'],
    fCaption: 'Kirchhoff no es una ley aparte: es este resultado, aplicado a un circuito.',
    diagram: <CirculationDiagram/> },

  { id: 13, layout: 'formula', tag: '§ 4.5', section: '4.5',
    title: 'Segunda ecuación de Maxwell',
    body: 'Aplicando el teorema de Stokes a la circulación nula se obtiene su forma puntual.',
    formulas: [
      '∮ *E* · d*L* = ∫_S (∇ × *E*) · d*S* = 0     ⇒     ∇ × *E* = 0',
    ],
    items: [
      'Si la integral es cero sobre *cualquier* superficie, el integrando tiene que ser cero',
      'El campo electrostático no tiene remolinos: un molinete puesto en cualquier punto no giraría',
      'Es la segunda ecuación de Maxwell, en su versión estática',
    ],
    fCaption: 'En el caso dinámico el miembro derecho deja de ser cero: ∇ × *E* = −∂*B*/∂t. Ahí nace la inducción.',
    note: '∇ × *E* = 0 es también la condición matemática para que *E* pueda escribirse como el gradiente de algo — que es exactamente lo que sigue.' },

  { id: 14, layout: 'formula', tag: '§ 4.6', section: '4.6',
    title: 'Relación entre E y V',
    body: 'El resultado que cierra el círculo: conocido el potencial, el campo se obtiene derivando, sin ninguna integral.',
    formulas: [
      '*E* = −∇V',
      '∇V = @{∂V}{∂x} *a*_x + @{∂V}{∂y} *a*_y + @{∂V}{∂z} *a*_z',
    ],
    items: [
      'La magnitud de *E* es la máxima razón espacial de cambio de V',
      'La dirección de *E* es normal a las superficies equipotenciales',
      'El signo menos orienta el campo hacia donde V *disminuye* — de + a −, como el agua cuesta abajo',
    ],
    fCaption: 'Moverse sobre una equipotencial no cambia V, y por eso no cuesta trabajo: *E* es perpendicular a ese movimiento.',
    diagram: <EquipotentialDiagram/>, interactive: true,
    hint: 'Arrastra el punto sobre la equipotencial' },

  { id: 15, layout: 'example', tag: 'Ejemplo 4.3', section: '4.6',
    title: 'Del potencial al campo',
    given: 'V = 2x^2 y − 5z,   evaluado en P(−4, 3, 6)',
    items: [
      'Potencial en P:  V_P = 2(−4)^2(3) − 5(6) = 66 V',
      'Gradiente:  ∇V = 4xy *a*_x + 2x^2 *a*_y − 5 *a*_z',
      'Campo:  *E* = −∇V = −4xy *a*_x − 2x^2 *a*_y + 5 *a*_z',
      'En P:  *E*_P = 48*a*_x − 32*a*_y + 5*a*_z V/m',
    ],
    formulas: ['|*E*_P| = √(48^2 + 32^2 + 5^2) = 57.9 V/m'],
    fCaption: 'Tres derivadas parciales y un cambio de signo. Obtener este mismo campo integrando habría costado bastante más.',
    practice: {
      code: 'D4.6',
      q: 'Si V = 2xy^2z^3 + 3 ln(x^2+2y^2+3z^2) V, halla *E* en P(3, 2, −1).',
      a: ['E_x = −(2y^2z^3 + 6x/(x^2+2y^2+3z^2))', '*E*_P = 7.1*a*_x + 22.8*a*_y − 71.1*a*_z V/m'],
    } },

  { id: 16, layout: 'table', tag: 'Síntesis', section: '4.6', dense: true,
    title: 'Potencial de cada configuración',
    body: 'Las mismas fuentes de la Parte A, ahora descritas por un escalar. Nótese que cada potencial tiene una potencia menos que su campo.',
    tableHead: ['Fuente', 'Potencial V', 'Campo *E* = −∇V', 'Referencia'],
    tableRows: [
      ['Carga puntual', '@{Q}{4πε_0 R}', '@{Q}{4πε_0 R^2} *a*_R', 'V = 0 en el infinito'],
      ['Anillo (en su eje)', '@{Q}{4πε_0 √(a^2+z^2)}', 'sólo componente z', 'V = 0 en el infinito'],
      ['Línea infinita', '@{ρ_L}{2πε_0} ln@{ρ_0}{ρ}', '@{ρ_L}{2πε_0 ρ} *a*_ρ', 'V = 0 en ρ = ρ_0'],
      ['Dipolo', '@{Q d cos θ}{4πε_0 r^2}', 'cae como 1/r^3', 'V = 0 en el infinito'],
    ],
    note: 'La línea infinita no admite referencia en el infinito: el logaritmo diverge. Hay que fijar el cero a una distancia finita ρ_0.' },

  { id: 17, layout: 'formula', tag: '§ 4.7', section: '4.7',
    title: 'El dipolo eléctrico',
    body: 'Dos cargas iguales y opuestas, muy juntas. Es el modelo con el que el Módulo III describirá a los dieléctricos, así que conviene tenerlo a mano.',
    items: [
      'Momento dipolar:  *p* = Q *d*, un vector que va de la carga negativa a la positiva',
      'El potencial cae con 1/r², más rápido que el de una carga sola — las dos cargas casi se cancelan',
      'Y el campo cae con 1/r³, una potencia más que el de una carga puntual',
      'En el plano perpendicular al dipolo (θ = 90°) el potencial vale exactamente cero',
    ],
    formulas: [
      'V = @{Q d cos θ}{4πε_0 r^2} = @{*p* · *a*_r}{4πε_0 r^2}',
    ],
    fCaption: 'La dependencia con cos θ es lo que hace que el dipolo tenga orientación — algo que una carga puntual no tiene.',
    diagram: <DipoleDiagram/> },

  { id: 18, layout: 'formula', tag: '§ 4.8', section: '4.8',
    title: 'Energía de armar una distribución',
    body: 'Las cargas de una distribución no llegaron solas: alguien tuvo que traerlas desde el infinito, venciendo la repulsión de las ya colocadas. Ese trabajo queda guardado.',
    items: [
      'La primera carga es gratis: no hay campo todavía que se le oponga',
      'La segunda cuesta Q_2 V_{21}, la tercera cuesta Q_3(V_{31} + V_{32}), y así sucesivamente',
      'Sumando en el orden inverso y promediando aparece un factor 1/2 — cada par se contó dos veces',
    ],
    formulas: [
      'W_E = @{1}{2} Σ_{m=1}^{N} Q_m V_m',
    ],
    fCaption: 'V_m es el potencial en la posición de Q_m debido a *todas las demás* cargas, nunca a ella misma.',
    diagram: <EnergyAssemblyDiagram/>, interactive: true,
    hint: 'Toca 1 · 2 · 3 · 4 cargas' },

  { id: 19, layout: 'example', tag: 'Ejemplo', section: '4.8',
    title: 'Energía de cuatro cargas',
    given: 'Cuatro cargas iguales Q en los vértices de un cuadrado de lado d.',
    items: [
      'Hay que contar los pares, no las cargas: en cuatro vértices hay 6 pares',
      'Cuatro pares son lados, a distancia d; dos son diagonales, a distancia d√2',
      'W_E = @{Q^2}{4πε_0}(@{4}{d} + @{2}{d√2})',
      'W_E = @{Q^2}{4πε_0 d}(4 + √2) = @{5.41 Q^2}{4πε_0 d}',
    ],
    formulas: ['W_E = @{5.41 Q^2}{4πε_0 d}'],
    fCaption: 'Es positiva: cargas del mismo signo se repelen, así que juntarlas siempre cuesta energía.',
    practice: {
      code: 'Cuidado',
      q: 'El error habitual es contar 12 pares (4 cargas × 3 vecinas) en vez de 6. El factor 1/2 de la fórmula es justamente el que corrige esa doble cuenta.',
      a: [],
    } },

  { id: 20, layout: 'formula', tag: '§ 4.8', section: '4.8',
    title: 'Distribuciones continuas',
    body: 'El mismo razonamiento, con la suma reemplazada por una integral.',
    formulas: [
      'W_E = @{1}{2} ∫_{vol} ρ_v V dv',
    ],
    items: [
      'ρ_v dv es el elemento de carga, y V es el potencial en su posición',
      'La integral se extiende sólo sobre la región donde hay carga: donde ρ_v = 0 no aporta nada',
      'Sustituyendo ρ_v = ∇·*D* e integrando por partes se llega a una forma mucho más reveladora',
    ],
    fCaption: 'Esa manipulación traslada la integral de la región cargada a *todo el espacio* — y con ella, la energía.' },

  { id: 21, layout: 'formula', tag: '§ 4.8', section: '4.8',
    title: 'Densidad de energía',
    body: 'El resultado del cambio de variable anterior es la interpretación moderna: la energía no está guardada en las cargas, sino repartida por todo el campo.',
    formulas: [
      'W_E = @{1}{2} ∫_{vol} *D* · *E* dv     ⇒     w_E = @{1}{2} *D* · *E* = @{1}{2} ε_0 E^2',
    ],
    items: [
      'w_E se mide en J/m³, y hay energía en cada punto donde el campo sea distinto de cero',
      'La integral cubre todo el espacio, no sólo donde hay carga',
      'Es la misma cantidad que apareció como presión electrostática en la Parte B — J/m³ y N/m² son la misma unidad',
    ],
    fCaption: 'Que la energía viva en el campo y no en las cargas es lo que permite que una onda electromagnética transporte energía por el vacío.',
    diagram: <EnergyDensityDiagram/>, interactive: true,
    hint: 'Arrastra la placa inferior' },

  { id: 22, layout: 'example', tag: 'Aplicación', section: '4.8',
    title: 'Energía en un cable coaxial',
    given: 'Coaxial de radios a y b, longitud L, con ρ_L en el conductor interior.',
    items: [
      'Del Módulo anterior:  E = @{ρ_L}{2πε_0 ρ}  entre los conductores, y cero fuera',
      'Densidad de energía:  w_E = @{1}{2}ε_0 E^2 = @{ρ_L^2}{8π^2 ε_0 ρ^2}',
      'Elemento de volumen en cilíndricas:  dv = ρ dρ dϕ dz',
      'W_E = ∫_0^L ∫_0^{2π} ∫_a^b @{ρ_L^2}{8π^2 ε_0 ρ^2} ρ dρ dϕ dz',
    ],
    formulas: ['W_E = @{ρ_L^2 L}{4πε_0} ln @{b}{a}'],
    fCaption: 'La ρ del diferencial de volumen cancela una de las dos del denominador — de ahí que salga un logaritmo y no una potencia.',
    practice: {
      code: 'Adelanto',
      q: 'Comparando con W = ½CV², de aquí sale la capacitancia por unidad de longitud del coaxial: C/L = 2πε₀ / ln(b/a). Es el primer capacitor del Módulo III.',
      a: [],
    } },

  { id: 23, layout: 'pitfalls', tag: 'Advertencia', section: 'Síntesis',
    title: 'Los errores que sí cuestan puntos',
    body: 'El potencial parece más fácil que el campo, y por eso mismo se maltrata con más confianza.',
    pitfalls: [
      ['Sumar potenciales como si fueran vectores, con componentes y ángulos',
       'V es un escalar: se suman los números y ya. La ventaja del método es exactamente esa'],
      ['Escribir *E* = ∇V, sin el signo menos',
       '*E* = −∇V. El campo apunta hacia donde V disminuye, no hacia donde crece'],
      ['Poner la referencia V = 0 en el infinito para una línea infinita de carga',
       'Ahí el logaritmo diverge. Hay que fijar el cero en una distancia finita ρ_0'],
      ['Contar cada par de cargas dos veces al calcular la energía',
       'Para eso está el factor 1/2 en W_E = ½ΣQ_mV_m. Con N cargas hay N(N−1)/2 pares, no N(N−1)'],
      ['Incluir el potencial que una carga produce sobre sí misma',
       'V_m es el potencial debido a todas las *demás*. El término propio es infinito y no tiene sentido físico'],
    ] },

  { id: 24, layout: 'summary', tag: 'Cierre', section: 'Síntesis',
    title: 'Conceptos clave',
    items: [
      'Trabajo:  W = −Q ∫ *E*·d*L* — negativo cuando lo hace el campo, positivo contra él',
      'El campo electrostático es conservativo: la integral no depende del camino',
      'Diferencia de potencial:  V_{AB} = −∫_B^A *E*·d*L* = V_A − V_B,  en volts',
      'Carga puntual:  V = Q/4πε_0R — cae con 1/R, una potencia menos que el campo',
      'V es escalar: superponer distribuciones es sumar números, sin componentes',
      'Circulación nula:  ∮*E*·d*L* = 0,  cuya forma puntual es ∇ × *E* = 0',
      'Relación fundamental:  *E* = −∇V — normal a las equipotenciales',
      'Energía:  W_E = ½ΣQ_mV_m, y densidad w_E = ½*D*·*E* repartida por todo el campo',
    ],
    backdrop: true },

  { id: 25, layout: 'end',
    title: 'Potencial\ny Energía',
    subtitle: 'El Módulo II queda cerrado: fuentes, campo, flujo, potencial y energía,\ntodo en el vacío. El Módulo III mete materia de por medio — conductores\nque no admiten campo dentro, y dieléctricos que lo debilitan.',
    footer: 'Módulo II completo', backdrop: true },
]

function accentFor(s: SD): string {
  const sec = s.section ?? ''
  if (sec === '4.1' || sec === '4.2' || sec === '4.3') return ORO
  if (sec === '4.4') return ESCARCHA
  if (sec === '4.5' || sec === '4.6') return AURORA
  if (sec === '4.7' || sec === '4.8') return VIOLETA
  if (sec === 'Síntesis') return ORO
  return ESCARCHA
}

function actLabel(s: SD): string | null {
  const sec = s.section ?? ''
  if (sec === '4.1' || sec === '4.2' || sec === '4.3') return 'Trabajo y potencial'
  if (sec === '4.4') return 'El campo potencial'
  if (sec === '4.5' || sec === '4.6') return 'Gradiente y circulación'
  if (sec === '4.7' || sec === '4.8') return 'Energía electrostática'
  return null
}

function actNumeral(s: SD): string | null {
  const sec = s.section ?? ''
  if (sec === '4.1' || sec === '4.2' || sec === '4.3') return 'I'
  if (sec === '4.4') return 'II'
  if (sec === '4.5' || sec === '4.6') return 'III'
  if (sec === '4.7' || sec === '4.8') return 'IV'
  return null
}

export default function App() {
  return <Deck slides={SLIDES} accentFor={accentFor} actLabel={actLabel} actNumeral={actNumeral} theme={THEMES.potencial}/>
}
