import { Fragment, useState, type CSSProperties } from 'react'
import {
  ORO, ESCARCHA, AURORA, VIOLETA, BRASA, HIELO, POS, NEG, U, MID,
  Board, Charge, Vec, MLabel, VLabel, RLabel, DragHandle, useDrag, useTick, FxHtml, fxTspans,
  Deck, THEMES, type Act, type SD,
} from './deck'

/* ═══════════════════════════════════════════════════════════
   ANIMATED SVG DIAGRAMS

   Same 300×300 board and the same three bands as every other deck
   in this course: chip 6…50, stage 54…226, readout 234…292.
═══════════════════════════════════════════════════════════ */

/* ── 01 · A dielectric polarising under an applied field ── */
function PolarizationDiagram() {
  const [ex, setEx] = useState(56)

  const { svgRef, handleMove, start, stop } = useDrag((x) => {
    setEx(Math.max(0, Math.min(96, x - 150)))
  })

  /* alignment goes from random to fully lined up with the field */
  const align = ex / 96
  const cells = Array.from({ length: 20 }, (_, i) => {
    const seed = Math.sin(i * 12.9898) * 43758.5453
    const f = seed - Math.floor(seed)
    const rest = f * Math.PI * 2                 /* the random orientation */
    const ang = rest * (1 - align)               /* rotated toward 0 as E grows */
    return {
      x: 54 + (i % 5) * 48,
      y: 96 + Math.floor(i / 5) * 34,
      a: ang,
      len: 9 + align * 4,
    }
  })

  return (
    <Board grab svgRef={svgRef} onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}
      chip="*P* = lím @{Σ *p*}{Δv}"
      chipSub="momento dipolar por unidad de volumen"
      chipColor={VIOLETA}
      foot={<>
        <RLabel x={24} y={251} text={`alineación: ${(align * 100).toFixed(0)} %`} color={VIOLETA} size={11}/>
        <RLabel x={24} y={268} text="sin campo los dipolos apuntan al azar y *P* = 0" color="rgba(220,238,248,.5)" size={9.2}/>
        <RLabel x={24} y={284} text="la carga no viaja: sólo se desplaza dentro del átomo" color="rgba(220,238,248,.32)" size={9}/>
      </>}>
      <rect x={30} y={78} width="240" height="126" rx="4"
        fill={`${VIOLETA}09`} stroke={VIOLETA} strokeWidth="1.4"/>

      {cells.map((c, i) => {
        const dx = Math.cos(c.a) * c.len
        const dy = Math.sin(c.a) * c.len
        return (
          <g key={i}>
            <line x1={c.x - dx} y1={c.y - dy} x2={c.x + dx} y2={c.y + dy}
              stroke={VIOLETA} strokeWidth="1.6" opacity={0.35 + align * 0.4}/>
            <circle cx={c.x - dx} cy={c.y - dy} r="3.1" fill={NEG} opacity=".85"/>
            <circle cx={c.x + dx} cy={c.y + dy} r="3.1" fill={POS} opacity=".85"/>
          </g>
        )
      })}

      {/* the bound surface charge that alignment leaves exposed */}
      {align > 0.12 && (
        <>
          <rect x={26} y={78} width="5" height="126" fill={NEG} opacity={align * 0.6}/>
          <rect x={269} y={78} width="5" height="126" fill={POS} opacity={align * 0.6}/>
          <MLabel x={18} y={216} text="−ρ_{ps}" color={NEG} size={9.5} anchor="start"
            delay="d5"/>
          <MLabel x={282} y={216} text="+ρ_{ps}" color={POS} size={9.5} anchor="end" delay="d5"/>
        </>
      )}

      <Vec x1={150} y1={64} x2={150 + ex} y2={64} color={AURORA} marker="aGr" delay="d2" width={2.6}/>
      <MLabel x={150 + ex + 12} y={68} text="*E*" color={AURORA} size={12.5} anchor="start"/>
      <DragHandle x={150 + ex} y={64} onDown={start('e')} color={ESCARCHA}/>
    </Board>
  )
}

/* ── 02 · The three vectors, and why D ignores the material ── */
function DEPDiagram() {
  const [er, setEr] = useState(3)

  const { svgRef, handleMove, start, stop } = useDrag((x) => {
    setEr(Math.max(1, Math.min(8, 1 + (x - 44) / 28)))
  })

  const D = 92                       /* D is fixed by the free charge alone */
  const E = D / er
  const P = D - E

  const bar = (y: number, w: number, color: string, label: string) => (
    <g>
      <rect x={44} y={y} width={Math.max(2, w)} height="20" rx="3"
        fill={`${color}33`} stroke={color} strokeWidth="1.4"/>
      {/* the label carries Fx markup, so it has to go through the same
          renderer every other formula in the deck uses */}
      <text x={36} y={y + 15} textAnchor="end" fill={color} fontSize="12"
        fontFamily="JetBrains Mono,monospace">{fxTspans(label)}</text>
    </g>
  )

  return (
    <Board grab svgRef={svgRef} onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}
      chip="*D* = ε_0*E* + *P* = ε_0 ε_r *E*"
      chipSub="con la carga libre fija, *D* no cambia nunca"
      chipColor={ESCARCHA}
      foot={<>
        <RLabel x={24} y={251} text={`ε_r = ${er.toFixed(1)}`} color={ESCARCHA} size={11}/>
        <RLabel x={104} y={251} text={`χ_e = ${(er - 1).toFixed(1)}`} color={VIOLETA} size={10.5}/>
        <RLabel x={24} y={268} text="*D* lo fija la carga libre; *E* y *P* se reparten el resto" color="rgba(220,238,248,.5)" size={8.8}/>
        <RLabel x={24} y={284} text="a mayor ε_r, el material apantalla más y *E* queda menor" color="rgba(220,238,248,.32)" size={8.8}/>
      </>}>
      {bar(78, D, ESCARCHA, '*D*')}
      {bar(118, E, AURORA, 'ε_0*E*')}
      {bar(158, P, VIOLETA, '*P*')}

      {/* the sum brace: E + P must always add back up to D */}
      <line x1={44} y1={186} x2={44 + D} y2={186} stroke="rgba(220,238,248,.3)"
        strokeWidth="1" strokeDasharray="3 3"/>
      <MLabel x={44 + D / 2} y={200} text="ε_0*E* + *P* = *D*"
        color="rgba(220,238,248,.45)" size={9.5} delay="d4"/>

      {/* the permittivity control */}
      <line x1={44} y1={218} x2={240} y2={218} stroke="rgba(160,200,232,.22)" strokeWidth="3" strokeLinecap="round"/>
      <text x={44} y={232} textAnchor="middle" fill="rgba(220,238,248,.4)" fontSize="8.5"
        fontFamily="JetBrains Mono,monospace">vacío</text>
      <text x={240} y={232} textAnchor="middle" fill="rgba(220,238,248,.4)" fontSize="8.5"
        fontFamily="JetBrains Mono,monospace">{fxTspans("ε_r = 8")}</text>
      <DragHandle x={44 + (er - 1) * 28} y={218} onDown={start('e')} color={ESCARCHA}/>
      <MLabel x={150} y={68} text="la misma carga libre, distinto material"
        color="rgba(220,238,248,.4)" size={9.5} delay="d3"/>
    </Board>
  )
}

/* ── 03 · Field lines refracting at a dielectric interface ── */
function DielectricBoundaryDiagram() {
  const [ang, setAng] = useState(0.9)
  const IY = 140
  const er1 = 1
  const er2 = 4

  const { svgRef, handleMove, start, stop } = useDrag((x, y) => {
    setAng(Math.max(0.12, Math.min(1.42, Math.atan2(IY - y, Math.abs(x - 150) || 0.001))))
  })

  /* tan θ₁ / tan θ₂ = ε₁ / ε₂  — tangential E continuous, normal D continuous */
  const t1 = Math.tan(Math.PI / 2 - ang)
  const t2 = t1 * (er2 / er1)
  const ang2 = Math.PI / 2 - Math.atan(t2)

  const L = 74
  const up = { x: 150 + Math.cos(ang) * L, y: IY - Math.sin(ang) * L }
  const dn = { x: 150 + Math.cos(ang2) * L, y: IY + Math.sin(ang2) * L }

  return (
    <Board grab svgRef={svgRef} onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}
      chip="E_{t1} = E_{t2}      D_{N1} = D_{N2}"
      chipSub="tangencial de *E* y normal de *D* se conservan"
      chipColor={AURORA}
      foot={<>
        <RLabel x={24} y={251} text={`θ_1 = ${(90 - (ang * 180) / Math.PI).toFixed(0)}°`} color={ESCARCHA} size={10.5}/>
        <RLabel x={110} y={251} text={`θ_2 = ${(90 - (ang2 * 180) / Math.PI).toFixed(0)}°`} color={AURORA} size={10.5}/>
        <RLabel x={196} y={251} text="ε_1=1  ε_2=4" color="rgba(220,238,248,.5)" size={9.5}/>
        <RLabel x={24} y={268} text="tan θ_1 / tan θ_2 = ε_1 / ε_2" color="rgba(220,238,248,.5)" size={9.4}/>
        <RLabel x={24} y={284} text="las líneas se alejan de la normal al entrar al ε mayor" color="rgba(220,238,248,.32)" size={8.8}/>
      </>}>
      {/* the two media */}
      <rect x={20} y={58} width="260" height={IY - 58} fill={`${ESCARCHA}07`}/>
      <rect x={20} y={IY} width="260" height={224 - IY} fill={`${VIOLETA}12`}/>
      <line x1={20} y1={IY} x2={280} y2={IY} stroke={HIELO} strokeWidth="1.6" opacity=".55"/>
      <MLabel x={38} y={74} text="ε_1  (vacío)" color={ESCARCHA} size={9.5} anchor="start" delay="d2"/>
      <MLabel x={38} y={216} text="ε_2  (dieléctrico)" color={VIOLETA} size={9.5} anchor="start" delay="d2"/>

      {/* the normal to the interface */}
      <line x1={150} y1={70} x2={150} y2={212} stroke="rgba(220,238,248,.25)"
        strokeWidth="1" strokeDasharray="4 4"/>
      <MLabel x={158} y={80} text="normal" color="rgba(220,238,248,.3)" size={8.5} anchor="start"/>

      {/* the field line, kinked at the interface */}
      <Vec x1={up.x} y1={up.y} x2={150} y2={IY} color={ESCARCHA} marker="aB" delay="d3" width={2.6}/>
      <Vec x1={150} y1={IY} x2={dn.x} y2={dn.y} color={AURORA} marker="aGr" delay="d4" width={2.6}/>

      <MLabel x={up.x + 8} y={up.y - 6} text="*E*_1" color={ESCARCHA} size={11} anchor="start" delay="d5"/>
      <MLabel x={dn.x + 8} y={dn.y + 10} text="*E*_2" color={AURORA} size={11} anchor="start" delay="d5"/>
      <DragHandle x={up.x} y={up.y} onDown={start('a')} color={ESCARCHA}/>
    </Board>
  )
}

/* ── 04 · Capacitance of a parallel-plate capacitor ── */
function CapacitorDiagram() {
  const [gap, setGap] = useState(64)
  const [er, setEr] = useState(2.5)

  const { svgRef, handleMove, start, stop } = useDrag((x, y, id) => {
    if (id === 'd') setGap(Math.max(24, Math.min(104, (y - 108) * 2)))
    else setEr(Math.max(1, Math.min(10, 1 + (x - 44) / 22)))
  })

  const top = 140 - gap / 2
  const bot = 140 + gap / 2
  const d = gap / 8                          /* mm */
  const S = 100                              /* cm² */
  /* C = ε₀ εr S / d, with S in cm² and d in mm ⇒ picofarads */
  const C = (8.854e-12 * er * (S * 1e-4)) / (d * 1e-3) * 1e12

  return (
    <Board grab svgRef={svgRef} onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}
      chip="C = @{ε_0 ε_r S}{d}"
      chipSub="sólo geometría y material — nunca carga ni voltaje"
      chipColor={ORO}
      foot={<>
        <RLabel x={24} y={251} text={`d = ${d.toFixed(1)} mm`} color={ESCARCHA} size={10.5}/>
        <RLabel x={112} y={251} text={`ε_r = ${er.toFixed(1)}`} color={VIOLETA} size={10.5}/>
        <RLabel x={190} y={251} text={`C = ${C.toFixed(0)} pF`} color={ORO} size={10.5}/>
        <RLabel x={24} y={268} text={`S = 100 cm²   —   C sube al juntar las placas`} color="rgba(220,238,248,.5)" size={9}/>
        <RLabel x={24} y={284} text="y sube otro tanto al meter un dieléctrico entre ellas" color="rgba(220,238,248,.32)" size={9}/>
      </>}>
      <rect x={58} y={top - 10} width="150" height="10" fill={`${BRASA}33`} stroke={POS} strokeWidth="1.8"/>
      <rect x={58} y={bot} width="150" height="10" fill={`${ESCARCHA}33`} stroke={NEG} strokeWidth="1.8"/>

      {/* the dielectric filling, denser as εr grows */}
      <rect x={58} y={top} width="150" height={gap} fill={`${VIOLETA}${Math.min(40, Math.round(er * 5)).toString(16).padStart(2, '0')}`}
        stroke={VIOLETA} strokeWidth="1" strokeDasharray="4 4"/>
      {Array.from({ length: Math.round(er * 2) }, (_, i) => (
        <line key={i} x1={64 + i * 8} y1={top + 4} x2={64 + i * 8} y2={bot - 4}
          stroke={VIOLETA} strokeWidth="1" opacity=".28"/>
      ))}
      {[80, 110, 140, 170].map((x, i) => (
        <line key={`e${i}`} x1={x} y1={top + 5} x2={x} y2={bot - 5}
          stroke={AURORA} strokeWidth="1.3" opacity=".5" markerEnd="url(#aGs)"/>
      ))}

      <MLabel x={46} y={top + 2} text="+Q" color={POS} size={10} anchor="end" delay="d2"/>
      <MLabel x={46} y={bot + 10} text="−Q" color={NEG} size={10} anchor="end" delay="d2"/>
      <line x1={224} y1={top} x2={224} y2={bot} stroke="rgba(220,238,248,.4)" strokeWidth="1"/>
      <MLabel x={236} y={140} text="d" color="rgba(220,238,248,.6)" size={11} anchor="start" delay="d3"/>
      <DragHandle x={224} y={bot} onDown={start('d')} color={ESCARCHA}/>

      {/* the permittivity slider */}
      <line x1={44} y1={214} x2={242} y2={214} stroke="rgba(160,200,232,.22)" strokeWidth="3" strokeLinecap="round"/>
      <text x={44} y={228} textAnchor="middle" fill="rgba(220,238,248,.38)" fontSize="8.5"
        fontFamily="JetBrains Mono,monospace">aire</text>
      <text x={242} y={228} textAnchor="middle" fill="rgba(220,238,248,.38)" fontSize="8.5"
        fontFamily="JetBrains Mono,monospace">{fxTspans("ε_r = 10")}</text>
      <DragHandle x={44 + (er - 1) * 22} y={214} onDown={start('r')} color={VIOLETA}/>
    </Board>
  )
}

/* ── 05 · The three classic capacitor geometries ── */
function CapacitorTypesDiagram() {
  const [mode, setMode] = useState(0)
  const TABS = [
    { k: 'placas',  f: 'C = @{εS}{d}' },
    { k: 'coaxial', f: 'C = @{2πεL}{ln(b/a)}' },
    { k: 'esfera',  f: 'C = @{4πε}{1/a − 1/b}' },
  ]

  return (
    <Board
      foot={<>
        <FxHtml x={150} y={252} w={260} h={22} text={TABS[mode].f} color={ORO} size={13}/>
        <RLabel x={24} y={273} text="todas dependen sólo de geometría y de ε" color="rgba(220,238,248,.5)" size={9.4}/>
        <RLabel x={24} y={288} text="método: suponer Q, hallar E, integrar V, dividir C = Q/V" color="rgba(220,238,248,.32)" size={8.8}/>
      </>}
      footTop={236} footH={58}>
      {TABS.map((tb, i) => (
        <g key={i} onPointerDown={() => setMode(i)} style={{ cursor: 'pointer' }}>
          <rect x={14 + i * 92} y={8} width="88" height="26" rx="6"
            fill={i === mode ? `${ORO}26` : 'rgba(160,200,232,.05)'}
            stroke={i === mode ? ORO : 'rgba(160,200,232,.18)'} strokeWidth="1"/>
          <text x={58 + i * 92} y={25} textAnchor="middle"
            fill={i === mode ? ORO : 'rgba(220,238,248,.45)'}
            fontSize="10.5" fontFamily="JetBrains Mono,monospace">{tb.k}</text>
        </g>
      ))}

      {mode === 0 && (
        <g className="pop d1">
          <rect x={70} y={104} width="160" height="10" fill={`${BRASA}33`} stroke={POS} strokeWidth="1.8"/>
          <rect x={70} y={176} width="160" height="10" fill={`${ESCARCHA}33`} stroke={NEG} strokeWidth="1.8"/>
          <rect x={70} y={114} width="160" height="62" fill={`${VIOLETA}14`} stroke={VIOLETA} strokeWidth="1" strokeDasharray="4 4"/>
          {[96, 126, 156, 186].map((x, i) => (
            <line key={i} x1={x} y1={119} x2={x} y2={171} stroke={AURORA} strokeWidth="1.3"
              opacity=".5" markerEnd="url(#aGs)"/>
          ))}
          <MLabel x={246} y={148} text="d" color="rgba(220,238,248,.55)" size={11} anchor="start" delay="d3"/>
          <MLabel x={150} y={210} text="campo uniforme, área S" color="rgba(220,238,248,.4)" size={9.5} delay="d4"/>
        </g>
      )}

      {mode === 1 && (
        <g className="pop d1">
          <circle cx={150} cy={144} r="72" fill="none" stroke={NEG} strokeWidth="4.4" opacity=".6"/>
          <circle cx={150} cy={144} r="24" fill={`${BRASA}26`} stroke={POS} strokeWidth="2.2"/>
          {Array.from({ length: 14 }, (_, i) => {
            const a = (i / 14) * Math.PI * 2
            return (
              <line key={i} x1={150 + Math.cos(a) * 28} y1={144 + Math.sin(a) * 28}
                x2={150 + Math.cos(a) * 66} y2={144 + Math.sin(a) * 66}
                stroke={AURORA} strokeWidth="1.3" opacity=".45" markerEnd="url(#aGs)"/>
            )
          })}
          <MLabel x={150} y={148} text="a" color={POS} size={11}/>
          <MLabel x={150} y={62} text="b" color={NEG} size={11} delay="d3"/>
          <MLabel x={150} y={228} text="largo L, campo radial" color="rgba(220,238,248,.4)" size={9.5} delay="d4"/>
        </g>
      )}

      {mode === 2 && (
        <g className="pop d1">
          <circle cx={150} cy={144} r="74" fill="none" stroke={NEG} strokeWidth="2.6" strokeDasharray="6 4" opacity=".7"/>
          <circle cx={150} cy={144} r="28" fill={`${BRASA}26`} stroke={POS} strokeWidth="2.2"/>
          <ellipse cx={150} cy={144} rx="74" ry="24" fill="none" stroke={NEG} strokeWidth=".8" strokeOpacity=".3"/>
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2
            return (
              <line key={i} x1={150 + Math.cos(a) * 32} y1={144 + Math.sin(a) * 32}
                x2={150 + Math.cos(a) * 68} y2={144 + Math.sin(a) * 68}
                stroke={AURORA} strokeWidth="1.3" opacity=".45" markerEnd="url(#aGs)"/>
            )
          })}
          <MLabel x={150} y={148} text="a" color={POS} size={11}/>
          <MLabel x={150} y={60} text="b" color={NEG} size={11} delay="d3"/>
          <MLabel x={150} y={228} text="si b → ∞, queda C = 4πεa" color="rgba(220,238,248,.4)" size={9.5} delay="d4"/>
        </g>
      )}
    </Board>
  )
}

/* ── 06 · Poisson and Laplace ── */
function LaplaceDiagram() {
  const t = useTick()
  const wave = 0.5 + 0.5 * Math.sin(t * 0.8)

  /* the potential between two plates: a straight line, which is exactly
     what ∇²V = 0 in one dimension means */
  const V0 = 100
  const pts = Array.from({ length: 41 }, (_, i) => {
    const f = i / 40
    return `${(64 + f * 172).toFixed(1)},${(196 - f * 96).toFixed(1)}`
  }).join(' ')

  return (
    <Board
      chip="∇^2 V = − @{ρ_v}{ε}        ∇^2 V = 0"
      chipSub="Poisson donde hay carga, Laplace donde no la hay"
      chipColor={AURORA}
      foot={<>
        <RLabel x={24} y={252} text="entre las placas ρ_v = 0 ⇒ vale Laplace" color={AURORA} size={9.6}/>
        <RLabel x={24} y={268} text="en 1D, ∇^2V = d^2V/dx^2 = 0 ⇒ V es una recta" color="rgba(220,238,248,.5)" size={9.2}/>
        <RLabel x={24} y={284} text="las condiciones de frontera fijan las dos constantes" color="rgba(220,238,248,.32)" size={9}/>
      </>}>
      {/* the two plates, held at fixed potentials */}
      <rect x={52} y={92} width="12" height="112" fill={`${ESCARCHA}33`} stroke={NEG} strokeWidth="1.8"/>
      <rect x={236} y={92} width="12" height="112" fill={`${BRASA}33`} stroke={POS} strokeWidth="1.8"/>
      <MLabel x={58} y={84} text="V = 0" color={NEG} size={10} delay="d2"/>
      <MLabel x={242} y={84} text={`V = ${V0}`} color={POS} size={10} delay="d2"/>

      {/* the linear potential profile */}
      <polyline points={pts} fill="none" stroke={ORO} strokeWidth="2.4"/>
      <circle cx={64 + wave * 172} cy={196 - wave * 96} r="4.5" fill={ORO}/>
      <MLabel x={150} y={112} text="V(x) recta" color={ORO} size={10.5} delay="d4"/>

      {/* the uniform field that a linear V implies */}
      {[100, 140, 180].map((y, i) => (
        <line key={i} x1={228} y1={y} x2={76} y2={y}
          stroke={AURORA} strokeWidth="1.2" opacity=".28" markerEnd="url(#aGs)"/>
      ))}
      <MLabel x={150} y={218} text="*E* = −dV/dx = constante"
        color={AURORA} size={10} delay="d5"/>
    </Board>
  )
}

/* ── 07 · Energy stored, and the two ways of writing it ── */
function CapacitorEnergyDiagram() {
  const t = useTick()
  const fill = 0.5 + 0.5 * Math.sin(t * 0.7)

  return (
    <Board
      chip="W_E = @{1}{2}CV^2 = @{1}{2}@{Q^2}{C} = @{1}{2}QV"
      chipSub="tres formas de la misma energía"
      chipColor={VIOLETA}
      foot={<>
        <RLabel x={24} y={252} text="la energía está en el campo, no en las placas" color={VIOLETA} size={9.6}/>
        <RLabel x={24} y={268} text="w_E = ½ε E² integrada sobre el volumen da lo mismo" color="rgba(220,238,248,.5)" size={9}/>
        <RLabel x={24} y={284} text="a V fijo conviene C grande; a Q fijo, C pequeño" color="rgba(220,238,248,.32)" size={9}/>
      </>}>
      <rect x={64} y={92} width="172" height="10" fill={`${BRASA}33`} stroke={POS} strokeWidth="1.8"/>
      <rect x={64} y={186} width="172" height="10" fill={`${ESCARCHA}33`} stroke={NEG} strokeWidth="1.8"/>

      {/* the energy filling the gap */}
      <rect x={64} y={102} width="172" height="84" fill={`${VIOLETA}10`}
        stroke={VIOLETA} strokeWidth="1" strokeDasharray="4 4"/>
      <rect x={64} y={186 - 84 * fill} width="172" height={84 * fill} fill={`${VIOLETA}2a`}/>

      {[86, 116, 146, 176, 206].map((x, i) => (
        <line key={i} x1={x} y1={107} x2={x} y2={181} stroke={AURORA} strokeWidth="1.3"
          opacity=".42" markerEnd="url(#aGs)"/>
      ))}

      <FxHtml x={150} y={144} w={180} h={24} text="w_E = @{1}{2} ε E^2" color={HIELO} size={13}/>
      <MLabel x={150} y={212} text="el volumen entre placas es el depósito"
        color="rgba(220,238,248,.4)" size={9.5} delay="d4"/>
      <MLabel x={150} y={80} text="cargar el capacitor es llenar ese volumen"
        color="rgba(220,238,248,.34)" size={9} delay="d5"/>
    </Board>
  )
}

/* ═══════════════════════════════════════════════════════════
   CONTENT
═══════════════════════════════════════════════════════════ */

const ACTS: Act[] = [
  { n: 'I', title: 'La materia polarizada', range: '§ 5.7', color: ORO,
    desc: 'El dipolo, el vector de polarización *P* y las cargas ligadas que aparecen al polarizar un material.' },
  { n: 'II', title: 'D, E y P', range: '§ 5.7 – 5.8', color: ESCARCHA,
    desc: 'La permitividad relativa, la ley de Gauss en dieléctricos y las condiciones de frontera entre dos medios.' },
  { n: 'III', title: 'Capacitancia', range: '§ 6.3 – 6.4', color: AURORA,
    desc: 'Placas paralelas, coaxial y esférico; capacitores con varios dieléctricos y la energía almacenada.' },
  { n: 'IV', title: 'Poisson y Laplace', range: '§ 6.1 – 6.2', color: VIOLETA,
    desc: 'Las ecuaciones que resuelven el potencial cuando se conocen las fronteras en vez de las cargas.' },
]

const SLIDES: SD[] = [
  { id: 1, layout: 'cover', tag: 'MÓDULO III · PARTE B',
    title: 'Dieléctricos\ny Capacitores',
    subtitle: 'Teoría Electromagnética I · Polarización, permitividad, capacitancia y las ecuaciones de Poisson y Laplace',
    meta: 'Hayt & Buck · Teoría electromagnética · §5.7 – 5.10 · cap. 6',
    numeral: 'III', backdrop: true },

  { id: 2, layout: 'agenda', tag: 'Ruta',
    title: 'Cómo se arma esta parte',
    body: 'Un conductor resuelve el problema del campo expulsándolo. Un dieléctrico no puede: sus cargas están ligadas. Lo que hace en cambio es *debilitarlo* desde dentro, y esa capacidad es lo que se explota en un capacitor.',
    acts: ACTS },

  { id: 3, layout: 'visual', tag: 'Introducción', section: 'Intro',
    title: 'Materia que no puede huir',
    body: 'En la Parte A los electrones libres se reacomodaban hasta anular el campo interior. En un dieléctrico no hay electrones libres: cada carga está atada a su átomo y sólo puede desplazarse una fracción de su diámetro.',
    items: [
      'Ese desplazamiento minúsculo, repetido en cada átomo del material, produce un efecto macroscópico medible',
      'El resultado es un campo interno *opuesto* al aplicado, que lo debilita sin llegar a cancelarlo',
      'Cuánto lo debilita es una sola constante del material: la permitividad relativa ε_r',
    ],
    backdrop: true },

  { id: 4, layout: 'formula', tag: '§ 5.7', section: '5.7',
    title: 'El dipolo como modelo',
    body: 'Todo lo que sigue descansa sobre el dipolo eléctrico que apareció en el Módulo II. Un dieléctrico se describe como una nube de dipolos.',
    items: [
      'Momento dipolar:  *p* = Q *d*, con *d* el vector que va de la carga negativa a la positiva',
      'Moléculas *no polares* — sin campo no tienen momento; el campo se lo induce separando sus cargas',
      'Moléculas *polares* — ya tienen momento propio (el agua, por ejemplo), pero apuntan al azar',
      'En ambos casos el campo aplicado los alinea, y esa alineación es la polarización',
    ],
    formulas: ['*p* = Q *d*'],
    fCaption: 'La diferencia entre polares y no polares importa para la magnitud de ε_r, no para el mecanismo.' },

  { id: 5, layout: 'formula', tag: '§ 5.7', section: '5.7',
    title: 'El vector de polarización P',
    body: 'Seguir cada dipolo es imposible. Lo que se hace es promediarlos por unidad de volumen — el mismo salto que llevó de cargas puntuales a ρ_v.',
    items: [
      '*P* es la suma de los momentos dipolares por unidad de volumen, en C/m²',
      'Sin campo aplicado los dipolos apuntan al azar, la suma se cancela y *P* = 0',
      'Con campo se alinean parcialmente, y *P* apunta en la dirección de *E*',
      'En los materiales lineales e isotrópicos, *P* es simplemente proporcional a *E*',
    ],
    formulas: [
      '*P* = lím_{Δv→0} @{1}{Δv} Σ_{i=1}^{n Δv} *p*_i     *P* = χ_e ε_0 *E*',
    ],
    fCaption: 'χ_e es la susceptibilidad eléctrica: mide qué tan fácil es polarizar el material.',
    diagram: <PolarizationDiagram/>, interactive: true,
    hint: 'Arrastra E y mira alinearse los dipolos' },

  { id: 6, layout: 'formula', tag: '§ 5.7', section: '5.7',
    title: 'Cargas de polarización',
    body: 'Al alinearse, los dipolos del interior se cancelan entre sí — el extremo positivo de uno queda junto al negativo del siguiente. En los bordes no hay con quién cancelarse.',
    items: [
      'En la *superficie* queda una carga ligada:  ρ_{ps} = *P* · *a*_N',
      'En el *volumen*, si *P* no es uniforme, queda una densidad ligada:  ρ_{pv} = −∇ · *P*',
      'Estas cargas son reales y producen campo, pero no se pueden extraer del material',
      'Por eso se distinguen de la carga *libre*, que sí se puede poner y quitar',
    ],
    formulas: ['ρ_{ps} = *P* · *a*_N        ρ_{pv} = −∇ · *P*'],
    fCaption: 'La carga total de polarización de un cuerpo aislado siempre suma cero: sólo se redistribuyó.',
    note: 'La distinción libre/ligada es lo que justifica trabajar con *D*: esa magnitud sólo ve a la carga libre.' },

  { id: 7, layout: 'formula', tag: '§ 5.8', section: '5.8',
    title: 'Los tres vectores: D, E y P',
    body: 'La relación que reorganiza todo el capítulo. Con la carga libre fija, *D* no cambia por más dieléctrico que se ponga: lo que cambia es cómo se reparten *E* y *P*.',
    formulas: [
      '*D* = ε_0*E* + *P*     ⇒     *D* = ε_0(1 + χ_e)*E* = ε_0 ε_r *E*',
    ],
    items: [
      'ε_r = 1 + χ_e es la *permitividad relativa*, un número adimensional ≥ 1',
      'ε = ε_0 ε_r es la permitividad del material; en el vacío ε_r = 1 y todo se reduce a *D* = ε_0*E*',
      'A mayor ε_r, más apantalla el material y menor queda *E* para la misma carga libre',
      'El agua tiene ε_r ≈ 78; el aire, 1.0006; la mica, cerca de 6',
    ],
    fCaption: 'Toda la física del dieléctrico quedó comprimida en un solo número, y las ecuaciones no cambiaron de forma.',
    diagram: <DEPDiagram/>, interactive: true,
    hint: 'Arrastra ε_r de 1 a 8' },

  { id: 8, layout: 'formula', tag: '§ 5.8', section: '5.8',
    title: 'Ley de Gauss en dieléctricos',
    body: 'La ventaja de haber definido *D* así: la ley de Gauss conserva exactamente la forma que tenía en el vacío.',
    formulas: [
      '∮_S *D* · d*S* = Q_{libre}          ∇ · *D* = ρ_v',
    ],
    items: [
      'La carga ligada no aparece en ninguna parte: ya está contabilizada dentro de *D*',
      'Todo el método de la Parte B del Módulo II sigue valiendo, superficies gaussianas incluidas',
      'La única diferencia es el paso final: al convertir *D* en *E* hay que dividir entre ε, no entre ε_0',
    ],
    fCaption: 'Ese es el rendimiento del cambio de variable: una definición nueva a cambio de no reescribir ninguna ley.',
    note: 'Si el problema pide *D*, el dieléctrico es irrelevante. Sólo importa cuando se pide *E*, V o la energía.' },

  { id: 9, layout: 'formula', tag: '§ 5.10', section: '5.10',
    title: 'Frontera entre dos dieléctricos',
    body: 'Al pasar de un medio a otro, dos componentes del campo se conservan y dos dan un salto. Cuáles son cuáles sale de aplicar las dos leyes integrales a la interfaz.',
    items: [
      'De ∮*E*·d*L* = 0 sobre un lazo que cruza la frontera:  E_{t1} = E_{t2} — la tangencial de *E* se conserva',
      'De ∮*D*·d*S* = Q sobre una caja plana:  D_{N1} = D_{N2}, si no hay carga libre en la interfaz',
      'Las otras dos componentes saltan:  D_{t1}/D_{t2} = ε_1/ε_2  y  E_{N1}/E_{N2} = ε_2/ε_1',
      'El resultado geométrico es una refracción de las líneas de campo',
    ],
    formulas: ['@{tan θ_1}{tan θ_2} = @{ε_1}{ε_2}'],
    fCaption: 'Las líneas se alejan de la normal al entrar en el medio de mayor permitividad — igual que la luz al pasar del vidrio al aire.',
    diagram: <DielectricBoundaryDiagram/>, interactive: true,
    hint: 'Gira el campo incidente' },

  { id: 10, layout: 'example', tag: 'Ejemplo', section: '5.10',
    title: 'Refracción en la interfaz',
    given: '*E*_1 = 60 V/m formando 30° con la normal, en un medio con ε_{r1} = 2. El segundo medio tiene ε_{r2} = 5.',
    items: [
      'Componentes en el medio 1:  E_{N1} = 60cos30° = 51.96,  E_{t1} = 60sen30° = 30 V/m',
      'La tangencial se conserva:  E_{t2} = 30 V/m',
      'La normal de *D* se conserva:  D_{N2} = D_{N1} = 2ε_0(51.96) ⇒ E_{N2} = @{2}{5}(51.96) = 20.78 V/m',
      'Magnitud en el medio 2:  |*E*_2| = √(30^2 + 20.78^2) = 36.5 V/m',
    ],
    formulas: ['θ_2 = arctan(30/20.78) = 55.3°'],
    fCaption: 'El campo se debilitó y se acostó hacia la interfaz: es lo que siempre pasa al entrar en el medio de mayor ε.',
    practice: {
      code: 'Verificación',
      q: 'Comprobación rápida: tan30°/tan55.3° = 0.577/1.444 = 0.40 = 2/5 = ε₁/ε₂. ✓',
      a: [],
    } },

  { id: 11, layout: 'formula', tag: '§ 6.3', section: '6.3',
    title: 'Capacitancia',
    body: 'Dos conductores con cargas iguales y opuestas. La razón entre la carga y la diferencia de potencial resulta ser una constante que no depende de ninguna de las dos.',
    items: [
      'C = Q/V, en farads (1 F = 1 C/V). El farad es una unidad enorme: lo habitual son pF, nF y µF',
      'C depende sólo de la *geometría* de los conductores y del *dieléctrico* entre ellos',
      'Duplicar Q duplica V, y la razón no cambia — por eso C es una propiedad del dispositivo',
      'El método es siempre el mismo: suponer Q, hallar *E*, integrar para obtener V, y dividir',
    ],
    formulas: ['C = @{Q}{V_0} = @{∮_S ε *E* · d*S*}{−∫_-^+ *E* · d*L*}'],
    fCaption: 'Al dividir, la carga supuesta se cancela sola. Si sobrevive en el resultado, hay un error.',
    diagram: <CapacitorDiagram/>, interactive: true,
    hint: 'Arrastra la placa y el dieléctrico' },

  { id: 12, layout: 'example', tag: 'Deducción', section: '6.3',
    title: 'Capacitor de placas paralelas',
    given: 'Dos placas de área S separadas una distancia d, con un dieléctrico de permitividad ε entre ellas.',
    items: [
      'Se supone carga +Q en la placa superior ⇒ ρ_S = Q/S',
      'Entre las placas el campo es uniforme:  E = ρ_S/ε = Q/(εS)',
      'La diferencia de potencial es  V_0 = ∫ E dL = E d = @{Q d}{εS}',
      'Y entonces  C = Q/V_0, donde Q se cancela',
    ],
    formulas: ['C = @{ε S}{d} = @{ε_0 ε_r S}{d}'],
    fCaption: 'Para aumentar C: más área, menos separación, o un dieléctrico con ε_r más alto. Los tres tienen límites prácticos.',
    practice: {
      code: 'D6.3',
      q: 'Placas de 100 cm² separadas 1 mm, con mica (ε_r = 6). Halla C, y la carga con 50 V aplicados.',
      a: ['C = 6(8.854×10^{−12})(0.01)/0.001 = 531 pF', 'Q = CV = 531×10^{−12}(50) = 26.6 nC'],
    } },

  { id: 13, layout: 'formula', tag: '§ 6.4', section: '6.4',
    title: 'Otras geometrías',
    body: 'El mismo método de cuatro pasos, aplicado a las dos geometrías con simetría que ya se resolvieron con Gauss.',
    items: [
      'Coaxial — de *E* = ρ_L/(2περ) sale V = @{ρ_L}{2πε}ln@{b}{a}, y de ahí C',
      'Esférico — de *E* = Q/(4πεr²) sale V = @{Q}{4πε}(@{1}{a} − @{1}{b})',
      'Esfera aislada — es el caso b → ∞ del anterior: C = 4πεa',
      'La Tierra, como esfera aislada de 6370 km, tiene una capacitancia de unos 709 µF',
    ],
    formulas: [
      'C_{coax} = @{2πεL}{ln(b/a)}     C_{esf} = @{4πε}{1/a − 1/b}',
    ],
    fCaption: 'El logaritmo del coaxial es el mismo que apareció al calcular su energía en la Parte C del Módulo II.',
    diagram: <CapacitorTypesDiagram/>, interactive: true,
    hint: 'Toca placas · coaxial · esfera' },

  { id: 14, layout: 'formula', tag: '§ 6.4', section: '6.4',
    title: 'Varios dieléctricos',
    body: 'Cuando hay más de un material entre las placas, la disposición decide cómo se combinan las capacitancias.',
    items: [
      'Dieléctricos *apilados* (uno tras otro en la dirección del campo) — quedan en *serie*',
      'Serie:  @{1}{C} = @{1}{C_1} + @{1}{C_2}.  El mismo *D*, y las V se suman',
      'Dieléctricos *lado a lado* (cada uno ocupando parte del área) — quedan en *paralelo*',
      'Paralelo:  C = C_1 + C_2.  El mismo *E*, y las Q se suman',
    ],
    fCaption: 'La clave es preguntarse qué magnitud es común: si es *D*, están en serie; si es *E*, en paralelo.',
    note: 'El error típico es sumar directo. Un tabique perpendicular al campo va en serie, aunque "parezcan" dos capacitores juntos.' },

  { id: 15, layout: 'formula', tag: '§ 6.1', section: '6.1',
    title: 'Poisson y Laplace',
    body: 'Hasta aquí se conocían las cargas y se buscaba el campo. En la práctica suele pasar lo contrario: se conocen los potenciales de los electrodos y se busca todo lo demás.',
    items: [
      'De ∇·*D* = ρ_v con *D* = ε*E* y *E* = −∇V se obtiene la ecuación de *Poisson*',
      'Donde no hay carga libre, ρ_v = 0, y queda la ecuación de *Laplace*',
      'Son ecuaciones diferenciales en V: se resuelven imponiendo las condiciones de frontera',
      'La solución es *única*: si una función satisface la ecuación y las fronteras, es la solución, sin importar cómo se la haya encontrado',
    ],
    formulas: [
      '∇^2 V = − @{ρ_v}{ε}          ∇^2 V = 0',
    ],
    fCaption: 'El teorema de unicidad es lo que legitima adivinar la forma de la solución y verificarla — que es como se resuelven en la práctica.',
    diagram: <LaplaceDiagram/> },

  { id: 16, layout: 'example', tag: 'Ejemplo', section: '6.2',
    title: 'Laplace entre placas paralelas',
    given: 'Dos placas en x = 0 y x = d, a potenciales 0 y V_0. Sin carga entre ellas.',
    items: [
      'Nada depende de y ni de z ⇒ el laplaciano se reduce a  @{d^2V}{dx^2} = 0',
      'Integrando dos veces:  V = A x + B',
      'Condición en x = 0:  V = 0 ⇒ B = 0',
      'Condición en x = d:  V = V_0 ⇒ A = V_0/d',
    ],
    formulas: [
      'V = @{V_0 x}{d}     ⇒     *E* = −∇V = −@{V_0}{d} *a*_x',
    ],
    fCaption: 'El campo uniforme del capacitor de placas, deducido sin suponerlo: sale solo de la ecuación y las fronteras.',
    practice: {
      code: 'Cierre',
      q: 'Y con ρ_S = D_N = εV_0/d en la placa, se recupera C = εS/d — el mismo resultado por un camino completamente distinto.',
      a: [],
    } },

  { id: 17, layout: 'formula', tag: '§ 6.3', section: '6.3',
    title: 'Energía en un capacitor',
    body: 'La energía de la Parte C del Módulo II, especializada al caso de dos conductores. Tres formas equivalentes, y conviene tener las tres a mano.',
    formulas: [
      'W_E = @{1}{2}C V^2 = @{1}{2}@{Q^2}{C} = @{1}{2}Q V',
    ],
    items: [
      'Se obtiene integrando w_E = ½ε E² sobre el volumen entre los conductores',
      'A voltaje fijo conviene una C grande; a carga fija, una C pequeña — no son el mismo problema',
      'Cuál de las tres formas usar depende de qué se mantenga constante en el problema',
    ],
    fCaption: 'La energía vive en el campo del dieléctrico, no en las placas. Por eso la rigidez dieléctrica del material es el límite práctico.',
    diagram: <CapacitorEnergyDiagram/> },

  { id: 18, layout: 'table', tag: 'Datos', section: '6.4', dense: true,
    title: 'Permitividad de materiales comunes',
    body: 'ε_r decide cuánto se debilita el campo, y con él cuánta capacitancia se consigue en el mismo volumen.',
    tableHead: ['Material', 'ε_r', 'Rigidez (MV/m)', 'Uso'],
    tableRows: [
      ['Vacío', '1', '∞', 'referencia'],
      ['Aire', '1.0006', '3', 'capacitores variables'],
      ['Papel', '3', '15', 'capacitores de potencia'],
      ['Mica', '6', '200', 'alta frecuencia y precisión'],
      ['Agua', '78', '—', 'no se usa como aislante'],
      ['Titanato de bario', '1200', '7.5', 'capacitores cerámicos'],
    ],
    note: 'La rigidez dieléctrica importa tanto como ε_r: de nada sirve un ε_r alto si el material se perfora al primer kilovolt.' },

  { id: 19, layout: 'pitfalls', tag: 'Advertencia', section: 'Síntesis',
    title: 'Los errores que sí cuestan puntos',
    body: 'La mayoría de los tropiezos de esta parte vienen de olvidar cuál de las tres magnitudes vectoriales ve al material.',
    pitfalls: [
      ['Dividir *D* entre ε_0 en un dieléctrico para obtener *E*',
       'Hay que dividir entre ε = ε_0ε_r. Sólo en el vacío coinciden'],
      ['Incluir la carga de polarización en la ley de Gauss para *D*',
       '∮*D*·d*S* cuenta sólo la carga *libre*. La ligada ya está dentro de la definición de *D*'],
      ['Conservar la componente normal de *E* al cruzar una frontera',
       'Lo que se conserva es la normal de *D* y la tangencial de *E*. La normal de *E* sí salta'],
      ['Sumar directo dos dieléctricos apilados en la dirección del campo',
       'Apilados van en *serie*: 1/C = 1/C₁ + 1/C₂. Lado a lado sí van en paralelo'],
      ['Escribir ∇²V = ρ_v/ε con el signo positivo',
       'Poisson lleva signo negativo: ∇²V = −ρ_v/ε. Sale del signo menos de *E* = −∇V'],
    ] },

  { id: 20, layout: 'example', tag: 'Integrador', section: 'Síntesis',
    title: 'Capacitor con dos dieléctricos',
    given: 'Placas de área S separadas d. La mitad del espesor es mica (ε_{r1} = 6), la otra mitad aire (ε_{r2} = 1).',
    items: [
      'El campo cruza los dos materiales uno tras otro ⇒ están en *serie*',
      'Cada capa tiene espesor d/2:  C_1 = @{6ε_0 S}{d/2} = @{12ε_0S}{d},   C_2 = @{2ε_0S}{d}',
      'Serie:  @{1}{C} = @{d}{12ε_0S} + @{d}{2ε_0S} = @{7d}{12ε_0S}',
      'C = @{12ε_0S}{7d} = 1.71 @{ε_0S}{d}',
    ],
    formulas: ['C = 1.71 @{ε_0 S}{d}   —   apenas 1.71 veces la del aire solo'],
    fCaption: 'El aire domina el resultado: en serie, la capacitancia más chica manda. Poner mica en la mitad rinde mucho menos de lo que se esperaría.',
    practice: {
      code: 'Discusión',
      q: 'Y como *D* es común, el campo en el aire es seis veces mayor que en la mica: el aire se perfora primero. Ese es el modo de falla típico de un capacitor con un hueco.',
      a: [],
    } },

  { id: 21, layout: 'summary', tag: 'Cierre', section: 'Síntesis',
    title: 'Conceptos clave',
    items: [
      'Un dieléctrico no expulsa el campo: lo debilita polarizándose',
      'Polarización:  *P* = χ_e ε_0*E*, momento dipolar por unidad de volumen, en C/m²',
      'Cargas ligadas:  ρ_{ps} = *P*·*a*_N en la superficie y ρ_{pv} = −∇·*P* en el volumen',
      'La relación central:  *D* = ε_0*E* + *P* = ε_0ε_r*E*, con ε_r = 1 + χ_e',
      'Gauss no cambia de forma:  ∮*D*·d*S* = Q_{libre} — la carga ligada ya está contada',
      'Fronteras:  E_t y D_N se conservan; el resultado es la refracción tan θ_1/tan θ_2 = ε_1/ε_2',
      'Capacitancia:  C = Q/V, sólo geometría y material.  C = εS/d en placas paralelas',
      'Poisson ∇²V = −ρ_v/ε y Laplace ∇²V = 0: resolver el potencial desde las fronteras',
    ],
    backdrop: true },

  { id: 22, layout: 'end',
    title: 'Dieléctricos\ny Capacitores',
    subtitle: 'Aquí termina la electrostática: campos, potenciales, materiales y energía,\ncon la carga siempre quieta o derivando en régimen permanente.\nLo que sigue es lo que pasa cuando algo empieza a cambiar en el tiempo.',
    footer: 'Módulo III completo · fin del curso', backdrop: true },
]

function accentFor(s: SD): string {
  const sec = s.section ?? ''
  if (sec === '5.7') return ORO
  if (sec === '5.8' || sec === '5.10') return ESCARCHA
  if (sec === '6.3' || sec === '6.4') return AURORA
  if (sec === '6.1' || sec === '6.2') return VIOLETA
  if (sec === 'Síntesis') return ORO
  return ESCARCHA
}

function actLabel(s: SD): string | null {
  const sec = s.section ?? ''
  if (sec === '5.7') return 'La materia polarizada'
  if (sec === '5.8' || sec === '5.10') return 'D, E y P'
  if (sec === '6.3' || sec === '6.4') return 'Capacitancia'
  if (sec === '6.1' || sec === '6.2') return 'Poisson y Laplace'
  return null
}

function actNumeral(s: SD): string | null {
  const sec = s.section ?? ''
  if (sec === '5.7') return 'I'
  if (sec === '5.8' || sec === '5.10') return 'II'
  if (sec === '6.3' || sec === '6.4') return 'III'
  if (sec === '6.1' || sec === '6.2') return 'IV'
  return null
}

export default function App() {
  return <Deck slides={SLIDES} accentFor={accentFor} actLabel={actLabel} actNumeral={actNumeral} theme={THEMES.dielectrico}/>
}
