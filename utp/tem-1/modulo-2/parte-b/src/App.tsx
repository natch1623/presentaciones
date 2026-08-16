import { Fragment, useState, type CSSProperties } from 'react'
import {
  ORO, ESCARCHA, AURORA, VIOLETA, BRASA, HIELO, POS, NEG, U, MID,
  Board, Charge, Vec, MLabel, VLabel, RLabel, DragHandle, useDrag, useTick, fxTspans, FxHtml,
  Deck, THEMES, type Act, type SD,
} from './deck'

/* ═══════════════════════════════════════════════════════════
   ANIMATED SVG DIAGRAMS

   Same 300×300 board and the same three bands as every other deck
   in this course: chip 6…50, stage 54…226, readout 234…292.
═══════════════════════════════════════════════════════════ */

/* ── 01 · Faraday's concentric spheres: flux equals the charge ── */
function FluxDiagram() {
  const O = { x: 150, y: MID }
  const t = useTick()
  const march = (t * 14) % 26

  return (
    <Board
      chip="Ψ = Q"
      chipSub="el flujo que sale vale exactamente la carga encerrada"
      chipColor={ORO}
      foot={<>
        <RLabel x={24} y={252} text="Faraday: la esfera exterior tomó −Q, sin excepción" color={ORO} size={9.6}/>
        <RLabel x={24} y={268} text="pasó con cada dieléctrico que probó entre las esferas" color="rgba(220,238,248,.5)" size={9.2}/>
        <RLabel x={24} y={283} text="el flujo es independiente del medio: sólo cuenta Q" color="rgba(220,238,248,.34)" size={9.2}/>
      </>}>
      {/* the dielectric shell between the two conductors */}
      <circle cx={O.x} cy={O.y} r="82" fill={`${ESCARCHA}0a`} stroke={NEG}
        strokeWidth="2.4" className="pop d2"/>
      <circle cx={O.x} cy={O.y} r="70" fill="none" stroke={NEG}
        strokeWidth=".8" strokeOpacity=".3" strokeDasharray="3 4"/>

      {/* flux lines, marching outward */}
      {Array.from({ length: 16 }, (_, i) => {
        const a = (i / 16) * Math.PI * 2
        const ca = Math.cos(a)
        const sa = Math.sin(a)
        return (
          <line key={i} x1={O.x + ca * 26} y1={O.y + sa * 26}
            x2={O.x + ca * 80} y2={O.y + sa * 80}
            stroke={ORO} strokeWidth="1.3" opacity=".5"
            strokeDasharray="6 20" strokeDashoffset={-march}/>
        )
      })}

      <circle cx={O.x} cy={O.y} r="24" fill={`${BRASA}20`} stroke={POS}
        strokeWidth="2.2" className="pop d1"/>
      <MLabel x={O.x} y={O.y + 5} text="+Q" color={POS} size={14} delay="d3"/>
      <MLabel x={O.x} y={O.y - 92} text="−Q" color={NEG} size={13} delay="d4"/>
      <MLabel x={O.x} y={O.y + 106} text="dieléctrico" color="rgba(220,238,248,.36)" size={9.5} delay="d5"/>
    </Board>
  )
}

/* ── 02 · Flux density: the same flux spread over a growing area ── */
function FluxDensityDiagram() {
  const O = { x: 150, y: MID }
  const [r, setR] = useState(62)

  const { svgRef, handleMove, start, stop } = useDrag((x, y) => {
    setR(Math.max(34, Math.min(84, Math.hypot(x - O.x, y - O.y))))
  })

  const R = r / U                       /* board units → metres */
  const Q = 10                          /* nC */
  const area = 4 * Math.PI * R * R      /* m² */
  const D = Q / area                    /* nC/m² */

  return (
    <Board grab svgRef={svgRef} onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}
      chip="*D* = @{Q}{4πR^2} *a*_R"
      chipSub="el mismo flujo Ψ repartido sobre un área que crece"
      chipColor={ESCARCHA}
      foot={<>
        <RLabel x={24} y={251} text={`R = ${R.toFixed(2)} m`} color={ESCARCHA} size={11}/>
        <RLabel x={148} y={251} text={`|*D*| = ${D.toFixed(3)} nC/m²`} color={ORO} size={10.5}/>
        <RLabel x={24} y={268} text={`Ψ = Q = 10 nC     área = ${area.toFixed(1)} m²`} color="rgba(220,238,248,.5)" size={9.4}/>
        <RLabel x={24} y={283} text="Ψ no cambia; el área crece como R², y D cae igual" color="rgba(220,238,248,.34)" size={9.2}/>
      </>}>
      {/* three reference shells */}
      {[38, 58, 80].map((rr, i) => (
        <circle key={i} cx={O.x} cy={O.y} r={rr} fill="none"
          stroke={NEG} strokeWidth=".7" strokeOpacity=".18" strokeDasharray="3 5"/>
      ))}

      {/* a fixed number of flux lines — that is the whole point */}
      {Array.from({ length: 14 }, (_, i) => {
        const a = (i / 14) * Math.PI * 2
        return (
          <line key={i} x1={O.x + Math.cos(a) * 16} y1={O.y + Math.sin(a) * 16}
            x2={O.x + Math.cos(a) * 92} y2={O.y + Math.sin(a) * 92}
            stroke={ORO} strokeWidth="1.1" opacity=".3"/>
        )
      })}

      <circle cx={O.x} cy={O.y} r={r} fill={`${ESCARCHA}12`} stroke={ESCARCHA}
        strokeWidth="2" className="breathe-loop"/>
      <Charge x={O.x} y={O.y} sign={1} r={10} label="Q"/>
      <DragHandle x={O.x + r} y={O.y} onDown={start('r')} color={ESCARCHA}/>
      <MLabel x={O.x + r / 2} y={O.y - 6} text="R" color="rgba(220,238,248,.6)" size={11} delay="d3"/>
    </Board>
  )
}

/* ── 03 · Gauss: the surface can be any shape at all ── */
function GaussSurfaceDiagram() {
  const O = { x: 132, y: MID }
  const [lump, setLump] = useState(0.22)

  const { svgRef, handleMove, start, stop } = useDrag((x) => {
    setLump(Math.max(0, Math.min(0.42, (x - 150) / 260 + 0.2)))
  })

  /* r(θ) = R₀(1 + a·sin3θ) — a closed surface that deforms without ever
     letting the charge out, which is exactly the claim being made */
  const R0 = 72
  const pts = Array.from({ length: 96 }, (_, i) => {
    const a = (i / 96) * Math.PI * 2
    const rr = R0 * (1 + lump * Math.sin(3 * a + 0.6) + lump * 0.45 * Math.cos(5 * a))
    return `${(O.x + Math.cos(a) * rr).toFixed(1)},${(O.y + Math.sin(a) * rr * 0.86).toFixed(1)}`
  }).join(' ')

  return (
    <Board grab svgRef={svgRef} onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}
      chip="∮_S *D* · d*S* = Q_{enc}"
      chipSub="el flujo neto no depende de la forma de la superficie"
      chipColor={ORO}
      foot={<>
        <RLabel x={24} y={251} text="∮ *D* · d*S* = 5 nC" color={ORO} size={11.5}/>
        <RLabel x={24} y={268} text="deformar la superficie no cambia el resultado" color="rgba(220,238,248,.5)" size={9.4}/>
        <RLabel x={24} y={283} text="la carga de afuera aporta cero: entra y sale igual" color="rgba(220,238,248,.34)" size={9.2}/>
      </>}>
      <polygon points={pts} fill={`${ORO}0e`} stroke={ORO} strokeWidth="2" strokeLinejoin="round"/>

      {/* the enclosed charge and its outgoing flux */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2
        return (
          <line key={i} x1={O.x + Math.cos(a) * 14} y1={O.y + Math.sin(a) * 14}
            x2={O.x + Math.cos(a) * 46} y2={O.y + Math.sin(a) * 40}
            stroke={POS} strokeWidth="1.3" opacity=".45" markerEnd="url(#aRs)"/>
        )
      })}
      <Charge x={O.x} y={O.y} sign={1} r={10} label="Q_{enc}"/>

      {/* a charge outside: its lines go in one side and out the other */}
      <Charge x={268} y={72} sign={-1} r={7}/>
      <path d={`M 258 78 Q 210 108 ${O.x + 30} 176`} fill="none"
        stroke={NEG} strokeWidth="1.1" opacity=".4" strokeDasharray="4 4"/>
      <MLabel x={268} y={58} text="fuera" color={NEG} size={9} delay="d5"/>

      {/* the deformation control */}
      <line x1={44} y1={216} x2={256} y2={216} stroke="rgba(160,200,232,.22)" strokeWidth="3" strokeLinecap="round"/>
      <text x={44} y={230} textAnchor="middle" fill="rgba(220,238,248,.4)" fontSize="9"
        fontFamily="JetBrains Mono,monospace">esfera</text>
      <text x={256} y={230} textAnchor="middle" fill="rgba(220,238,248,.4)" fontSize="9"
        fontFamily="JetBrains Mono,monospace">deforme</text>
      <DragHandle x={150 + (lump - 0.2) * 260} y={216} onDown={start('l')} color={ORO}/>
    </Board>
  )
}

/* ── 04 · Choosing the gaussian surface that matches the symmetry ── */
function GaussianChoiceDiagram() {
  const [mode, setMode] = useState(0)
  const TABS = [
    { k: 'esfera',  src: 'carga puntual',    law: '*D* 4πr^2 = Q' },
    { k: 'cilindro', src: 'línea infinita',  law: '*D* 2πρL = ρ_L L' },
    { k: 'caja',    src: 'lámina infinita',  law: '*D* 2A = ρ_S A' },
  ]
  const tab = TABS[mode]

  return (
    <Board
      foot={<>
        <RLabel x={24} y={251} text={tab.law} color={AURORA} size={11.5}/>
        <RLabel x={24} y={268} text={`fuente: ${tab.src}`} color="rgba(220,238,248,.5)" size={9.4}/>
        <RLabel x={24} y={283} text="D es constante y normal sobre toda la superficie" color="rgba(220,238,248,.34)" size={9.2}/>
      </>}>
      {TABS.map((tb, i) => (
        <g key={i} onPointerDown={() => setMode(i)} style={{ cursor: 'pointer' }}>
          <rect x={14 + i * 92} y={8} width="88" height="26" rx="6"
            fill={i === mode ? `${AURORA}26` : 'rgba(160,200,232,.05)'}
            stroke={i === mode ? AURORA : 'rgba(160,200,232,.18)'} strokeWidth="1"/>
          <text x={58 + i * 92} y={25} textAnchor="middle"
            fill={i === mode ? AURORA : 'rgba(220,238,248,.45)'}
            fontSize="10.5" fontFamily="JetBrains Mono,monospace">{tb.k}</text>
        </g>
      ))}

      {mode === 0 && (
        <g className="pop d1">
          <circle cx={150} cy={MID} r="70" fill={`${AURORA}0e`} stroke={AURORA} strokeWidth="2"/>
          <ellipse cx={150} cy={MID} rx="70" ry="22" fill="none" stroke={AURORA}
            strokeWidth=".8" strokeOpacity=".35" strokeDasharray="4 4"/>
          {Array.from({ length: 12 }, (_, i) => {
            const a = (i / 12) * Math.PI * 2
            return (
              <line key={i} x1={150 + Math.cos(a) * 58} y1={MID + Math.sin(a) * 58}
                x2={150 + Math.cos(a) * 82} y2={MID + Math.sin(a) * 82}
                stroke={AURORA} strokeWidth="1.5" opacity=".7" markerEnd="url(#aGs)"/>
            )
          })}
          <Charge x={150} y={MID} sign={1} r={10} label="Q"/>
          <MLabel x={150} y={228} text="r constante ⇒ D sale de la integral" color="rgba(220,238,248,.4)" size={9} delay="d4"/>
        </g>
      )}

      {mode === 1 && (
        <g className="pop d1">
          <rect x={104} y={72} width="92" height="136" fill={`${AURORA}0e`} stroke={AURORA} strokeWidth="2"/>
          <ellipse cx={150} cy={72} rx="46" ry="14" fill={`${AURORA}14`} stroke={AURORA} strokeWidth="2"/>
          <ellipse cx={150} cy={208} rx="46" ry="14" fill="none" stroke={AURORA}
            strokeWidth="1" strokeOpacity=".4" strokeDasharray="4 4"/>
          <line x1={150} y1={50} x2={150} y2={230} stroke={NEG} strokeWidth="3.4" strokeLinecap="round"/>
          {[100, 140, 180].map((yy, i) => (
            <Fragment key={i}>
              <line x1={172} y1={yy} x2={206} y2={yy} stroke={AURORA} strokeWidth="1.6" opacity=".75" markerEnd="url(#aGs)"/>
              <line x1={128} y1={yy} x2={94} y2={yy} stroke={AURORA} strokeWidth="1.6" opacity=".75" markerEnd="url(#aGs)"/>
            </Fragment>
          ))}
          <MLabel x={150} y={44} text="ρ_L" color={NEG} size={11} delay="d3"/>
          <MLabel x={150} y={244} text="las tapas no aportan flujo" color="rgba(220,238,248,.4)" size={9} delay="d4"/>
        </g>
      )}

      {mode === 2 && (
        <g className="pop d1">
          <line x1={46} y1={MID} x2={254} y2={MID} stroke={NEG} strokeWidth="3.4" strokeLinecap="round"/>
          <rect x={104} y={MID - 44} width="92" height="88" fill={`${AURORA}0e`} stroke={AURORA} strokeWidth="2"/>
          {[126, 150, 174].map((xx, i) => (
            <Fragment key={i}>
              <line x1={xx} y1={MID - 20} x2={xx} y2={MID - 56} stroke={AURORA} strokeWidth="1.6" opacity=".75" markerEnd="url(#aGs)"/>
              <line x1={xx} y1={MID + 20} x2={xx} y2={MID + 56} stroke={AURORA} strokeWidth="1.6" opacity=".75" markerEnd="url(#aGs)"/>
            </Fragment>
          ))}
          <MLabel x={68} y={MID - 10} text="ρ_S" color={NEG} size={11} delay="d3"/>
          <MLabel x={150} y={228} text="sólo las dos tapas aportan flujo" color="rgba(220,238,248,.4)" size={9} delay="d4"/>
        </g>
      )}
    </Board>
  )
}

/* ── 05 · Coaxial cable: D across the three regions ── */
function CoaxDiagram() {
  const O = { x: 150, y: 128 }
  const A = 26          /* inner conductor radius, board units */
  const B = 78          /* outer shell radius */
  const [pr, setPr] = useState(50)

  const { svgRef, handleMove, start, stop } = useDrag((x, y) => {
    setPr(Math.max(8, Math.min(100, Math.hypot(x - O.x, y - O.y))))
  })

  const rho = pr / U
  const a = A / U
  const b = B / U
  /* ρ_L = 30 nC/m on the inner conductor */
  const inside = pr < A
  const between = pr >= A && pr <= B
  const D = between ? 30 / (2 * Math.PI * rho) : 0
  const zone = inside ? 'ρ < a — dentro del conductor' : between ? 'a < ρ < b — el dieléctrico' : 'ρ > b — fuera del cable'

  const ang = Math.atan2(0, 1)
  const px = O.x + Math.cos(ang) * pr
  const py = O.y + Math.sin(ang) * pr

  return (
    <Board grab svgRef={svgRef} onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}
      chip="*D* = @{ρ_L}{2πρ} *a*_ρ   (a < ρ < b)"
      chipSub="fuera del cable el flujo neto encerrado es cero"
      chipColor={AURORA}
      foot={<>
        <RLabel x={24} y={251} text={`ρ = ${rho.toFixed(2)} m`} color={ESCARCHA} size={11}/>
        <RLabel x={140} y={251} text={`|*D*| = ${D.toFixed(2)} nC/m²`} color={D > 0 ? AURORA : 'rgba(220,238,248,.35)'} size={10.5}/>
        <RLabel x={24} y={268} text={zone} color="rgba(220,238,248,.5)" size={9.4}/>
        <RLabel x={24} y={283} text={`a = ${a.toFixed(1)} m   b = ${b.toFixed(1)} m   ρ_L = 30 nC/m`} color="rgba(220,238,248,.34)" size={9.2}/>
      </>}>
      {/* outer shell carries −ρ_L, so the field is confined */}
      <circle cx={O.x} cy={O.y} r={B} fill="none" stroke={NEG} strokeWidth="5" opacity=".55"/>
      <circle cx={O.x} cy={O.y} r={B} fill={`${ESCARCHA}07`} stroke="none"/>
      <circle cx={O.x} cy={O.y} r={A} fill={`${BRASA}22`} stroke={POS} strokeWidth="2.4"/>

      {/* D in the dielectric only */}
      {Array.from({ length: 14 }, (_, i) => {
        const aa = (i / 14) * Math.PI * 2
        return (
          <line key={i} x1={O.x + Math.cos(aa) * (A + 4)} y1={O.y + Math.sin(aa) * (A + 4)}
            x2={O.x + Math.cos(aa) * (B - 5)} y2={O.y + Math.sin(aa) * (B - 5)}
            stroke={AURORA} strokeWidth="1.3" opacity=".42" markerEnd="url(#aGs)"/>
        )
      })}

      <MLabel x={O.x} y={O.y + 4} text="a" color={POS} size={11} delay="d3"/>
      <MLabel x={O.x} y={O.y - B - 8} text="b" color={NEG} size={11} delay="d3"/>

      <line x1={O.x} y1={O.y} x2={px} y2={py} stroke="rgba(220,238,248,.3)" strokeWidth="1" strokeDasharray="4 4"/>
      <DragHandle x={px} y={py} onDown={start('r')} color={ESCARCHA}/>
      <MLabel x={O.x + 10} y={O.y - 8} text="ρ" color="rgba(220,238,248,.55)" size={10.5} anchor="start" delay="d4"/>
      <MLabel x={150} y={218} text="conductor interior +ρ_L · malla exterior −ρ_L"
        color="rgba(220,238,248,.35)" size={9} delay="d6"/>
    </Board>
  )
}

/* ── 06 · The differential volume element behind the point form ── */
function DiffVolumeDiagram() {
  const O = { x: 138, y: 168 }
  const w = 74, h = 56, dx = 44, dy = -30

  return (
    <Board
      chip="∇ · *D* = @{∂D_x}{∂x} + @{∂D_y}{∂y} + @{∂D_z}{∂z}"
      chipSub="el flujo neto de un volumen que se encoge a un punto"
      chipColor={VIOLETA}
      foot={<>
        <RLabel x={24} y={252} text="cara de entrada:  −D_x Δy Δz" color={NEG} size={10}/>
        <RLabel x={24} y={268} text="cara de salida:  (D_x + @{∂D_x}{∂x}Δx) Δy Δz" color={POS} size={10}/>
        <RLabel x={24} y={285} text="la diferencia deja la derivada — eso es la divergencia" color="rgba(220,238,248,.4)" size={9.2}/>
      </>}>
      {/* the cube */}
      <polygon points={`${O.x},${O.y} ${O.x + w},${O.y} ${O.x + w},${O.y - h} ${O.x},${O.y - h}`}
        fill={`${VIOLETA}12`} stroke={VIOLETA} strokeWidth="1.8" className="pop d1"/>
      <polygon points={`${O.x},${O.y - h} ${O.x + w},${O.y - h} ${O.x + w + dx},${O.y - h + dy} ${O.x + dx},${O.y - h + dy}`}
        fill={`${VIOLETA}0a`} stroke={VIOLETA} strokeWidth="1.8" className="pop d2"/>
      <polygon points={`${O.x + w},${O.y} ${O.x + w + dx},${O.y + dy} ${O.x + w + dx},${O.y - h + dy} ${O.x + w},${O.y - h}`}
        fill={`${VIOLETA}06`} stroke={VIOLETA} strokeWidth="1.8" className="pop d2"/>

      {/* flux in one face, out the opposite one — larger on the way out */}
      <line x1={O.x - 42} y1={O.y - h / 2} x2={O.x - 6} y2={O.y - h / 2}
        stroke={NEG} strokeWidth="2.2" markerEnd="url(#aB)" className="svg-marker d3"/>
      <line x1={O.x + w + 6} y1={O.y - h / 2} x2={O.x + w + 54} y2={O.y - h / 2}
        stroke={POS} strokeWidth="2.6" markerEnd="url(#aR)" className="svg-marker d4"/>

      <MLabel x={O.x - 24} y={O.y - h / 2 - 10} text="entra" color={NEG} size={9.5} delay="d5"/>
      <MLabel x={O.x + w + 30} y={O.y - h / 2 - 10} text="sale" color={POS} size={9.5} delay="d5"/>

      <MLabel x={O.x + w / 2} y={O.y + 16} text="Δx" color="rgba(220,238,248,.45)" size={10} delay="d6"/>
      <MLabel x={O.x - 12} y={O.y - h / 2 + 22} text="Δz" color="rgba(220,238,248,.45)" size={10} delay="d6"/>
      <MLabel x={O.x + w + dx / 2 + 8} y={O.y - h + dy / 2 - 4} text="Δy" color="rgba(220,238,248,.45)" size={10} delay="d6"/>
      <VLabel x={150} y={74} text="Δv → 0" color={VIOLETA} size={13} delay="d7"/>
    </Board>
  )
}

/* ── 07 · Force between two parallel line charges ── */
function LineForceDiagram() {
  const LX = 92
  const [px, setPx] = useState(206)

  const { svgRef, handleMove, start, stop } = useDrag((x) => {
    setPx(Math.max(136, Math.min(272, x)))
  })

  const d = (px - LX) / U
  /* ρ_{L1} = ρ_{L2} = 20 nC/m ⇒ F/L = ρ₁ρ₂ / (2πε₀d) = 2k ρ₁ρ₂ / d */
  const FL = (2 * 9e9 * 20e-9 * 20e-9) / d * 1e6      /* µN/m */
  const arrow = Math.max(14, Math.min(50, 120 / d))

  return (
    <Board grab svgRef={svgRef} onPointerMove={handleMove} onPointerUp={stop} onPointerLeave={stop}
      chip="@{F}{L} = @{ρ_{L1} ρ_{L2}}{2πε_0 d}"
      chipSub="fuerza por unidad de longitud — la total sería infinita"
      chipColor={VIOLETA}
      foot={<>
        <RLabel x={24} y={251} text={`d = ${d.toFixed(2)} m`} color={ESCARCHA} size={11}/>
        <RLabel x={132} y={251} text={`F/L = ${FL.toFixed(1)} µN/m`} color={VIOLETA} size={10.5}/>
        <RLabel x={24} y={268} text="ρ_{L1} = ρ_{L2} = 20 nC/m — se repelen" color="rgba(220,238,248,.5)" size={9.4}/>
        <RLabel x={24} y={283} text="una línea infinita no admite una fuerza total finita" color="rgba(220,238,248,.34)" size={9.2}/>
      </>}>
      {[LX, px].map((x, i) => (
        <Fragment key={i}>
          <line x1={x} y1={58} x2={x} y2={210} stroke={POS} strokeWidth="3.6" strokeLinecap="round"/>
          {Array.from({ length: 11 }, (_, j) => (
            <line key={j} x1={x - 5} y1={62 + j * 14} x2={x + 5} y2={62 + j * 14}
              stroke={POS} strokeWidth="1" opacity=".4"/>
          ))}
        </Fragment>
      ))}

      {/* they push each other apart */}
      <Vec x1={LX - 8} y1={MID} x2={LX - 8 - arrow} y2={MID} color={VIOLETA} marker="aV" delay="d3" width={2.6}/>
      <Vec x1={px + 8} y1={MID} x2={px + 8 + arrow} y2={MID} color={VIOLETA} marker="aV" delay="d3" width={2.6}/>

      <line x1={LX} y1={196} x2={px} y2={196} stroke="rgba(220,238,248,.3)" strokeWidth="1" strokeDasharray="4 4"/>
      <MLabel x={(LX + px) / 2} y={190} text="d" color="rgba(220,238,248,.6)" size={11} delay="d4"/>
      <MLabel x={LX} y={50} text="ρ_{L1}" color={POS} size={10.5} delay="d2"/>
      <MLabel x={px} y={50} text="ρ_{L2}" color={POS} size={10.5} delay="d2"/>
      <DragHandle x={px} y={MID} onDown={start('d')} color={ESCARCHA}/>
    </Board>
  )
}

/* ── 08 · Electrostatic pressure on a charged surface ── */
function PlateForceDiagram() {
  return (
    <Board
      chip="@{F}{A} = @{ρ_S^2}{2ε_0}"
      chipSub="presión electrostática — siempre de tracción, hacia el campo"
      chipColor={VIOLETA}
      foot={<>
        <RLabel x={24} y={252} text="cada elemento dQ = ρ_S dS siente el campo del resto" color={VIOLETA} size={9.5}/>
        <RLabel x={24} y={268} text="ese campo es ρ_S/2ε_0, no ρ_S/ε_0: la placa no se atrae sola" color="rgba(220,238,248,.5)" size={9}/>
        <RLabel x={24} y={283} text="las placas de un capacitor siempre se atraen" color="rgba(220,238,248,.34)" size={9.2}/>
      </>}>
      {/* two plates of a capacitor */}
      <rect x={72} y={74} width="156" height="12" fill={`${BRASA}33`} stroke={POS} strokeWidth="2" className="pop d1"/>
      <rect x={72} y={192} width="156" height="12" fill={`${ESCARCHA}33`} stroke={NEG} strokeWidth="2" className="pop d1"/>
      <MLabel x={54} y={84} text="+ρ_S" color={POS} size={10.5} anchor="end" delay="d2"/>
      <MLabel x={54} y={202} text="−ρ_S" color={NEG} size={10.5} anchor="end" delay="d2"/>

      {/* the uniform field between them */}
      {[92, 122, 152, 182, 212].map((x, i) => (
        <line key={i} x1={x} y1={92} x2={x} y2={186}
          stroke={AURORA} strokeWidth="1.4" opacity=".45" markerEnd="url(#aGs)"
          className="svg-marker" style={{ animationDelay: `${0.24 + i * 0.05}s` } as CSSProperties}/>
      ))}
      <FxHtml x={150} y={140} w={120} h={26} text="*E* = ρ_S/ε_0" color={AURORA} size={12}/>

      {/* the attraction */}
      <Vec x1={248} y1={82} x2={248} y2={128} color={VIOLETA} marker="aV" delay="d5" width={2.8}/>
      <Vec x1={248} y1={198} x2={248} y2={152} color={VIOLETA} marker="aV" delay="d5" width={2.8}/>
      <MLabel x={272} y={144} text="*F*" color={VIOLETA} size={12} delay="d7"/>
    </Board>
  )
}

/* ═══════════════════════════════════════════════════════════
   CONTENT
═══════════════════════════════════════════════════════════ */

const ACTS: Act[] = [
  { n: 'I', title: 'El flujo eléctrico', range: '§ 3.1', color: ORO,
    desc: 'Los experimentos de Faraday, el flujo Ψ y la densidad de flujo *D* — la magnitud que no depende del medio.' },
  { n: 'II', title: 'La ley de Gauss', range: '§ 3.2', color: ESCARCHA,
    desc: 'El flujo que sale de cualquier superficie cerrada es la carga que encierra, y sólo eso.' },
  { n: 'III', title: 'Aplicaciones por simetría', range: '§ 3.3', color: AURORA,
    desc: 'Elegir la superficie gaussiana correcta convierte una integral difícil en una multiplicación.' },
  { n: 'IV', title: 'Forma puntual y fuerzas', range: '§ 3.4 · 3.6', color: VIOLETA,
    desc: 'La primera ecuación de Maxwell, y la fuerza eléctrica sobre líneas, placas y volúmenes de carga.' },
]

const SLIDES: SD[] = [
  { id: 1, layout: 'cover', tag: 'MÓDULO II · PARTE B',
    title: 'La Ley\nde Gauss',
    subtitle: 'Teoría Electromagnética I · Flujo eléctrico, superficies gaussianas y la primera ecuación de Maxwell',
    meta: 'Hayt & Buck · Teoría electromagnética · cap. 3 · §3.1 – 3.6',
    numeral: 'II', backdrop: true },

  { id: 2, layout: 'agenda', tag: 'Ruta',
    title: 'Cómo se arma esta parte',
    body: 'La Parte A calculó cada campo integrando. Esta parte se dedica a no tener que hacerlo: una sola ley, aplicada con criterio, reemplaza la integral por un argumento de simetría.',
    acts: ACTS },

  { id: 3, layout: 'visual', tag: 'Introducción', section: 'Intro',
    title: 'El precio de integrar',
    body: 'La ley de Coulomb es correcta siempre, y prácticamente inservible cuando la geometría se complica. La integral de la Parte A se puede plantear para cualquier distribución — y resolver casi para ninguna.',
    items: [
      'Una carga puntual, una línea recta y un plano infinito salen a mano; casi nada más lo hace',
      'Gauss no dice nada nuevo sobre la física: es la ley de Coulomb reescrita en términos de flujo',
      'Lo que cambia es el método — cuando hay simetría, la integral se colapsa a una multiplicación',
    ],
    backdrop: true },

  { id: 4, layout: 'formula', tag: '§ 3.1', section: '3.1',
    title: 'Los experimentos de Faraday',
    body: 'Faraday montó dos esferas concéntricas separadas por un dieléctrico, cargó la interior y midió la carga inducida en la exterior. El resultado no dependía del material.',
    items: [
      'La esfera exterior siempre tomaba exactamente −Q, cualquiera fuera el dieléctrico entre ambas',
      'Eso sugiere algo que va de una esfera a la otra y sólo depende de la carga: el *flujo eléctrico* Ψ',
      'Por definición, Ψ = Q, y se mide en coulombs — el flujo *es* la carga que lo produce',
    ],
    note: 'La independencia del medio es la razón de ser de *D*. El campo *E* sí depende del material; el flujo no.',
    diagram: <FluxDiagram/> },

  { id: 5, layout: 'formula', tag: '§ 3.1', section: '3.1',
    title: 'Densidad de flujo eléctrico D',
    body: 'Si el flujo total es Q, repartirlo sobre el área por la que pasa da una densidad. Esa densidad es un campo vectorial, y es la magnitud con la que trabaja la ley de Gauss.',
    items: [
      'En la esfera interior de Faraday, de radio a:  *D* = Q/(4πa^2) *a*_r',
      'En la exterior, de radio b, el mismo flujo se reparte sobre más área: *D* = Q/(4πb^2) *a*_r',
      'Se mide en C/m², y en el vacío se relaciona con el campo por *D* = ε_0*E*',
    ],
    formulas: [
      '*D* = ε_0 *E*          Ψ = ∫_S *D* · d*S*',
    ],
    fCaption: 'El producto punto en la integral es esencial: sólo la componente normal a la superficie aporta flujo.',
    diagram: <FluxDensityDiagram/>, interactive: true,
    hint: 'Arrastra el radio de la esfera' },

  { id: 6, layout: 'formula', tag: '§ 3.2', section: '3.2',
    title: 'La ley de Gauss',
    body: 'Generalizando el experimento de Faraday a una superficie cualquiera se llega al enunciado central del capítulo.',
    items: [
      'El flujo eléctrico que atraviesa cualquier superficie cerrada es igual a la carga encerrada',
      'La forma de la superficie no importa: puede ser esférica, cúbica o irregular, y el resultado no cambia',
      'La carga de *fuera* aporta cero: sus líneas entran por un lado y salen por el otro',
    ],
    formulas: [
      '∮_S *D* · d*S* = Q_{enc}',
      'Q_{enc} = Σ Q_n   ó   ∫_{vol} ρ_v dv',
    ],
    fCaption: 'd*S* apunta siempre hacia *afuera* de la superficie cerrada; ese convenio es el que fija el signo del flujo.',
    diagram: <GaussSurfaceDiagram/>, interactive: true,
    hint: 'Deforma la superficie: el flujo no cambia' },

  { id: 7, layout: 'concept', tag: '§ 3.3', section: '3.3',
    title: 'La superficie gaussiana',
    body: 'La ley vale para cualquier superficie, pero sólo sirve para *calcular* si se elige bien. La superficie no es parte del problema: la elige quien lo resuelve.',
    items: [
      'La superficie debe ser *cerrada*, y la carga que interesa debe quedar dentro',
      'En cada punto, *D* debe ser normal a la superficie o tangente a ella — nunca algo intermedio',
      'Donde *D* es normal, su magnitud debe ser *constante*, para poder sacarla de la integral',
      'Donde *D* es tangente, el producto punto vale cero y esa porción simplemente no aporta',
    ],
    formulas: [
      '∮ *D* · d*S* = D ∮ dS = D · S_{normal} = Q_{enc}',
    ],
    fCaption: 'Cumplidas esas condiciones, la integral desaparece y queda una ecuación algebraica con una incógnita.',
    note: 'Si no hay simetría, no hay superficie gaussiana útil, y hay que volver a integrar. Gauss no es un atajo universal.' },

  { id: 8, layout: 'formula', tag: '§ 3.3', section: '3.3',
    title: 'Las tres simetrías',
    body: 'Cada tipo de fuente admite una y sólo una superficie gaussiana razonable, y la elección la dicta la simetría de la distribución.',
    items: [
      'Simetría *esférica* — carga puntual o esfera cargada ⇒ superficie esférica concéntrica',
      'Simetría *cilíndrica* — línea infinita o cilindro ⇒ cilindro coaxial, con sus tapas',
      'Simetría *plana* — lámina infinita ⇒ una caja o "píldora" que atraviesa la lámina',
    ],
    diagram: <GaussianChoiceDiagram/>, interactive: true,
    hint: 'Toca esfera · cilindro · caja' },

  { id: 9, layout: 'example', tag: 'Aplicación 1', section: '3.3',
    title: 'Carga puntual',
    given: 'Carga puntual Q en el origen. Superficie gaussiana: esfera de radio r centrada en ella.',
    items: [
      'Por simetría, *D* es radial y su magnitud sólo puede depender de r',
      '*D* es normal a la esfera en todo punto ⇒ *D* · d*S* = D dS',
      'D es constante sobre la esfera ⇒ ∮ D dS = D (4πr^2)',
      'Igualando a la carga encerrada:  D(4πr^2) = Q',
    ],
    formulas: ['*D* = @{Q}{4πr^2} *a*_r     ⇒     *E* = @{Q}{4πε_0 r^2} *a*_r'],
    fCaption: 'Se recuperó el resultado de la Parte A sin plantear una sola integral — sólo un argumento de simetría.',
    practice: {
      code: 'Nota',
      q: 'Que Gauss reproduzca la ley de Coulomb no es casualidad: las dos son la misma física. Gauss es la forma útil cuando hay simetría.',
      a: [],
    } },

  { id: 10, layout: 'example', tag: 'Aplicación 2', section: '3.3',
    title: 'Línea infinita de carga',
    given: 'Línea infinita sobre el eje z con densidad ρ_L. Superficie: cilindro de radio ρ y longitud L, coaxial con ella.',
    items: [
      'Por simetría *D* es radial: *D* = D_ρ *a*_ρ, y no depende ni de z ni de ϕ',
      'En las *tapas*, *D* es tangente a la superficie ⇒ el producto punto es cero, no aportan flujo',
      'En la *pared lateral*, *D* es normal y constante ⇒ ∮ *D*·d*S* = D_ρ (2πρL)',
      'Carga encerrada: la que hay en un tramo de longitud L ⇒ Q_{enc} = ρ_L L',
    ],
    formulas: ['D_ρ (2πρL) = ρ_L L   ⇒   *D* = @{ρ_L}{2πρ} *a*_ρ'],
    fCaption: 'La longitud L se cancela sola. Si no lo hiciera, sería señal de que la superficie estaba mal elegida.',
    practice: {
      code: 'D3.4',
      q: 'Una línea con ρ_L = 8 nC/m está sobre el eje z. Halla |*D*| y |*E*| en ρ = 2 m.',
      a: ['|*D*| = 8/(2π·2) = 0.637 nC/m²', '|*E*| = D/ε_0 = 71.9 V/m'],
    } },

  { id: 11, layout: 'example', tag: 'Aplicación 3', section: '3.3',
    title: 'Cable coaxial',
    given: 'Conductor interior de radio a con ρ_L, malla exterior de radio b con −ρ_L. Hallar *D* en las tres regiones.',
    items: [
      'ρ < a — dentro del conductor no hay carga encerrada ⇒ *D* = 0',
      'a < ρ < b — se encierra la carga del conductor interior ⇒ *D* = ρ_L/(2πρ) *a*_ρ',
      'ρ > b — se encierran las dos cargas, +ρ_L y −ρ_L ⇒ Q_{enc} = 0 ⇒ *D* = 0',
      'Ese último resultado es el que hace útil al cable: el campo queda confinado',
    ],
    formulas: ['*D* = @{ρ_L}{2πρ} *a*_ρ    sólo en  a < ρ < b'],
    fCaption: 'El blindaje de un coaxial no es un detalle de fabricación: es una consecuencia directa de la ley de Gauss.',
    diagram: <CoaxDiagram/>, interactive: true,
    hint: 'Arrastra el punto por las tres regiones' },

  { id: 12, layout: 'example', tag: 'Aplicación 4', section: '3.3',
    title: 'Esfera con carga volumétrica',
    given: 'Esfera de radio a con densidad uniforme ρ_v. Hallar *D* dentro y fuera.',
    items: [
      'Fuera (r > a): se encierra toda la carga ⇒ Q_{tot} = ρ_v (4/3)πa^3',
      'D(4πr^2) = ρ_v @{4}{3}πa^3   ⇒   D = @{ρ_v a^3}{3r^2}',
      'Dentro (r < a): sólo se encierra la carga de la esfera de radio r ⇒ Q_{enc} = ρ_v (4/3)πr^3',
      'D(4πr^2) = ρ_v @{4}{3}πr^3   ⇒   D = @{ρ_v r}{3}',
    ],
    formulas: ['Dentro: D crece con r.     Fuera: D cae como 1/r^2.'],
    fCaption: 'En r = a las dos expresiones coinciden: el campo es continuo, como tiene que ser.',
    practice: {
      code: 'Comprobación',
      q: 'Desde afuera, la esfera se comporta exactamente como una carga puntual Q_{tot} en su centro. Ese resultado se usa constantemente.',
      a: [],
    } },

  { id: 13, layout: 'table', tag: 'Síntesis', section: '3.3', dense: true,
    title: 'Qué superficie usar',
    body: 'La elección no es cuestión de gusto: la dicta la simetría de la fuente, y con ella la ley se resuelve en una línea.',
    tableHead: ['Fuente', 'Superficie', 'Área que aporta', 'Resultado'],
    tableRows: [
      ['Carga puntual', 'esfera de radio r', '4πr^2', '*D* = Q / 4πr^2'],
      ['Línea infinita', 'cilindro ρ, largo L', '2πρL  (sin tapas)', '*D* = ρ_L / 2πρ'],
      ['Lámina infinita', 'caja que la atraviesa', '2A  (sólo las tapas)', '*D* = ρ_S / 2'],
      ['Coaxial', 'cilindro a < ρ < b', '2πρL', '*D* = ρ_L / 2πρ,  cero fuera'],
      ['Esfera uniforme', 'esfera r < a', '4πr^2', '*D* = ρ_v r / 3'],
    ],
    note: 'En todos los casos el largo L o el área A de la superficie se cancela. Si sobrevive en el resultado, hay un error.' },

  { id: 14, layout: 'formula', tag: '§ 3.4', section: '3.4',
    title: 'Un volumen que se encoge',
    body: 'La forma integral relaciona una superficie con la carga que encierra. Para obtener una ley *puntual* hay que hacer esa superficie infinitamente pequeña.',
    items: [
      'Se toma un cubo diferencial de lados Δx, Δy, Δz alrededor del punto de interés',
      'En cada par de caras opuestas, lo que sale menos lo que entra es la derivada parcial por el espesor',
      'Sumando las tres direcciones:  ∮ *D*·d*S* ≈ (@{∂D_x}{∂x} + @{∂D_y}{∂y} + @{∂D_z}{∂z}) Δv',
      'Y la carga encerrada en ese volumen es, por definición, ρ_v Δv',
    ],
    fCaption: 'Dividir entre Δv y hacerlo tender a cero deja una identidad entre dos densidades, válida punto a punto.',
    diagram: <DiffVolumeDiagram/> },

  { id: 15, layout: 'formula', tag: '§ 3.6', section: '3.6',
    title: 'Primera ecuación de Maxwell',
    body: 'El límite del proceso anterior es la forma puntual de la ley de Gauss, y la primera de las cuatro ecuaciones de Maxwell.',
    formulas: [
      '∇ · *D* = ρ_v',
    ],
    items: [
      'Dice que el flujo eléctrico que sale de un volumen unitario es la densidad de carga que hay ahí',
      'Donde no hay carga, ∇·*D* = 0: el campo no tiene ni fuentes ni sumideros en ese punto',
      'Es la misma ley de Gauss, pero enunciada en un punto en vez de sobre una superficie',
    ],
    fCaption: 'La divergencia se definió en el Módulo I; aquí aparece su primer uso físico concreto.',
    note: 'La forma integral sirve para calcular; la forma puntual sirve para escribir ecuaciones diferenciales — Poisson y Laplace, en el Módulo III.' },

  { id: 16, layout: 'formula', tag: '§ 3.7', section: '3.6',
    title: 'El puente entre las dos formas',
    body: 'El teorema de la divergencia es lo que garantiza que la forma integral y la forma puntual dicen exactamente lo mismo.',
    formulas: [
      '∮_S *D* · d*S* = ∫_{vol} (∇ · *D*) dv',
    ],
    items: [
      'A la izquierda, el flujo por la frontera; a la derecha, la suma de lo que cada punto interior aporta',
      'Igualando con la ley de Gauss: ∫_{vol} (∇·*D*) dv = ∫_{vol} ρ_v dv, para *cualquier* volumen',
      'Si dos integrales coinciden sobre todo volumen, sus integrandos son iguales ⇒ ∇·*D* = ρ_v',
    ],
    fCaption: 'Ese "para cualquier volumen" es el paso clave: sin él sólo se tendría una igualdad promedio, no puntual.' },

  { id: 17, layout: 'example', tag: 'Verificación', section: '3.6',
    title: 'Comprobar ∇·D = ρ_v',
    given: '*D* = @{ρ_v r}{3} *a*_r  dentro de una esfera uniformemente cargada.',
    items: [
      'En esféricas:  ∇·*D* = @{1}{r^2} @{∂}{∂r}(r^2 D_r)',
      'r^2 D_r = r^2 · @{ρ_v r}{3} = @{ρ_v r^3}{3}',
      '@{∂}{∂r}(@{ρ_v r^3}{3}) = ρ_v r^2',
      '∇·*D* = @{1}{r^2} · ρ_v r^2 = ρ_v   ✓',
    ],
    formulas: ['La forma puntual reproduce la densidad de partida.'],
    fCaption: 'Fuera de la esfera D cae como 1/r², y el mismo cálculo da ∇·D = 0 — que es justo lo que debe pasar donde no hay carga.',
    practice: {
      code: 'D3.7',
      q: 'Halla ∇·*D* en P(2, 3, −1) si *D* = (2xyz − y^2)*a*_x + (x^2 z − 2xy)*a*_y + x^2 y *a*_z C/m².',
      a: ['∇·*D* = 2yz − 2x', '∇·*D*|_P = 2(3)(−1) − 2(2) = −10.0 C/m³'],
    } },

  { id: 18, layout: 'formula', tag: 'Aplicación', section: 'Fuerza',
    title: 'Fuerza sobre cuerpos continuos',
    body: 'Conocido el campo, la fuerza sobre una distribución de carga sale del mismo modo que la carga total: integrando el aporte de cada elemento.',
    items: [
      'Sobre un elemento dQ la fuerza es d*F* = *E* dQ, con *E* el campo producido por *todo lo demás*',
      'Según la geometría, dQ vale ρ_L dL, ρ_S dS o ρ_v dv',
      'El campo del propio elemento no cuenta: un cuerpo no se ejerce fuerza a sí mismo',
    ],
    formulas: [
      '*F* = ∫_L *E* ρ_L dL     *F* = ∫_S *E* ρ_S dS     *F* = ∫_{vol} *E* ρ_v dv',
    ],
    fCaption: 'Ese "todo lo demás" es la trampa habitual: usar el campo total, incluido el propio, da resultados infinitos.' },

  { id: 19, layout: 'formula', tag: 'Fuerzas', section: 'Fuerza',
    title: 'Fuerza sobre líneas de carga',
    body: 'Dos líneas paralelas infinitas no admiten una fuerza total finita — hay carga infinita en ambas. Lo que sí tiene sentido es la fuerza por unidad de longitud.',
    items: [
      'El campo de la primera línea en la posición de la segunda es E = ρ_{L1}/(2πε_0 d)',
      'Sobre un tramo dL de la segunda actúa dF = E ρ_{L2} dL',
      'Dividiendo entre la longitud queda una cantidad finita e independiente del tramo elegido',
      'Cae con 1/d, no con 1/d² — es el mismo comportamiento del campo de una línea',
    ],
    formulas: ['@{F}{L} = @{ρ_{L1} ρ_{L2}}{2πε_0 d}'],
    fCaption: 'Del mismo signo se repelen; de signos opuestos se atraen — igual que dos cargas puntuales.',
    diagram: <LineForceDiagram/>, interactive: true,
    hint: 'Arrastra la segunda línea' },

  { id: 20, layout: 'formula', tag: 'Fuerzas', section: 'Fuerza',
    title: 'Fuerza sobre placas',
    body: 'Sobre una superficie cargada la fuerza se expresa mejor como una presión: fuerza por unidad de área. Aparece un factor 1/2 que hay que justificar.',
    items: [
      'El campo *dentro* del metal es cero y *fuera* vale ρ_S/ε_0; el campo que actúa sobre la carga es el promedio, ρ_S/2ε_0',
      'La presión resulta entonces F/A = ρ_S · (ρ_S/2ε_0) = ρ_S^2/2ε_0',
      'Siempre es de tracción: la superficie es empujada hacia la región donde está el campo',
      'En un capacitor, eso significa que las placas se atraen — sin importar el signo de la carga',
    ],
    formulas: ['@{F}{A} = @{ρ_S^2}{2ε_0} = @{ε_0 E^2}{2}'],
    fCaption: 'La segunda forma anticipa el Módulo siguiente: ε_0 E²/2 es también la densidad de energía del campo.',
    diagram: <PlateForceDiagram/> },

  { id: 21, layout: 'example', tag: 'Aplicación', section: 'Fuerza',
    title: 'Fuerza entre las placas de un capacitor',
    given: 'Placas paralelas de área A = 100 cm², con ±ρ_S = ±2 μC/m². Hallar la fuerza de atracción.',
    items: [
      'Presión electrostática:  F/A = ρ_S^2/(2ε_0)',
      'F/A = (2×10^{−6})^2 / (2 · 8.854×10^{−12}) = 0.226 N/m²',
      'Área en metros:  A = 100 cm² = 0.01 m²',
      'Fuerza total:  F = 0.226 × 0.01 = 2.26 mN',
    ],
    formulas: ['F = 2.26 mN,  de atracción'],
    fCaption: 'Es una fuerza pequeña, pero medible — y es el principio de funcionamiento de los micrófonos de condensador y los MEMS.',
    practice: {
      code: 'Cuidado',
      q: 'Usar E = ρ_S/ε_0 en vez de ρ_S/2ε_0 duplica el resultado. El factor 1/2 sale de que la placa no ejerce fuerza sobre sí misma.',
      a: [],
    } },

  { id: 22, layout: 'formula', tag: 'Fuerzas', section: 'Fuerza',
    title: 'Fuerza sobre volúmenes de carga',
    body: 'El caso general: una nube de carga inmersa en un campo externo. La integral es sobre el volumen, y casi siempre hay que resolverla numéricamente.',
    items: [
      'd*F* = *E* ρ_v dv, sumado sobre toda la región donde hay carga',
      'Si *E* es uniforme sobre la nube, sale de la integral y queda simplemente *F* = Q_{tot} *E*',
      'Si no lo es, hay que integrar componente a componente, en el sistema de coordenadas de la geometría',
    ],
    formulas: ['*F* = ∫_{vol} ρ_v *E* dv     (si *E* es uniforme:  *F* = Q_{tot} *E*)'],
    note: 'Este es el término que, cuando la carga se mueve, se convierte en la fuerza de Lorentz y da origen a los motores eléctricos.' },

  { id: 23, layout: 'pitfalls', tag: 'Advertencia', section: 'Síntesis',
    title: 'Los errores que sí cuestan puntos',
    body: 'La ley de Gauss es corta de enunciar y fácil de aplicar mal. Estos son los cinco tropiezos habituales.',
    pitfalls: [
      ['Usar Gauss en una distribución sin simetría y "sacar" D de la integral',
       'Sin simetría, D no es constante sobre la superficie y no puede salir. Hay que volver a integrar por Coulomb'],
      ['Contar la carga que está fuera de la superficie gaussiana',
       'Sólo entra Q_{enc}. La carga exterior aporta cero flujo neto, aunque sí afecte al campo en cada punto'],
      ['Olvidar que las tapas del cilindro no aportan flujo en una línea de carga',
       'Ahí *D* es tangente a la tapa, y el producto punto *D*·d*S* se anula'],
      ['Confundir *D* con *E* y arrastrar un ε_0 de más o de menos',
       '*D* = ε_0*E* en el vacío. *D* se mide en C/m² y no depende del medio; *E* en V/m y sí depende'],
      ['Usar E = ρ_S/ε_0 al calcular la fuerza sobre una placa cargada',
       'El campo que actúa sobre la carga de la placa es ρ_S/2ε_0 — la placa no se atrae a sí misma'],
    ] },

  { id: 24, layout: 'example', tag: 'Integrador', section: 'Síntesis',
    title: 'Esfera hueca con dos capas',
    given: 'Esfera conductora de radio a con carga Q, rodeada de una capa esférica de a a b con ρ_v uniforme y carga total Q. Hallar *D* en las cuatro regiones.',
    items: [
      'r < a — dentro del conductor:  Q_{enc} = 0  ⇒  *D* = 0',
      'r = a^+ — justo afuera:  Q_{enc} = Q  ⇒  D = Q/(4πr^2)',
      'a < r < b — se suma parte de la capa:  Q_{enc} = Q + Q·@{r^3 − a^3}{b^3 − a^3}',
      'r > b — se encierra todo:  Q_{enc} = 2Q  ⇒  D = 2Q/(4πr^2)',
    ],
    formulas: ['Cada frontera cambia sólo Q_{enc}; la forma de la ley no cambia nunca.'],
    fCaption: 'El método completo es siempre el mismo: elegir la superficie, contar lo que encierra, despejar.',
    practice: {
      code: 'Verificación',
      q: 'Muy lejos (r ≫ b) el conjunto se comporta como una carga puntual 2Q. Todo resultado de Gauss debería pasar esa prueba de límite.',
      a: [],
    } },

  { id: 25, layout: 'summary', tag: 'Cierre', section: 'Síntesis',
    title: 'Conceptos clave',
    items: [
      'Flujo eléctrico:  Ψ = Q — no depende del medio, sólo de la carga que lo produce',
      'Densidad de flujo:  *D* = ε_0*E* en el vacío, medida en C/m²',
      'Ley de Gauss, forma integral:  ∮_S *D*·d*S* = Q_{enc}, para cualquier superficie cerrada',
      'La superficie gaussiana la elige quien resuelve: útil sólo si *D* es normal y constante sobre ella',
      'Tres simetrías, tres superficies: esfera, cilindro coaxial y caja que atraviesa la lámina',
      'Forma puntual:  ∇·*D* = ρ_v — la primera ecuación de Maxwell',
      'El teorema de la divergencia es lo que conecta la forma integral con la puntual',
      'Fuerza sobre cuerpos continuos:  *F* = ∫ *E* dQ, con el campo de todo lo demás excepto el propio elemento',
    ],
    backdrop: true },

  { id: 26, layout: 'end',
    title: 'La Ley\nde Gauss',
    subtitle: 'Con esto ya se sabe calcular el campo de cualquier distribución con simetría.\nLo que falta es la pregunta de la energía: cuánto trabajo cuesta armar\nesa distribución, y cuánto se recupera al deshacerla.',
    footer: 'Módulo II · Parte B completa', backdrop: true },
]

function accentFor(s: SD): string {
  const sec = s.section ?? ''
  if (sec === '3.1') return ORO
  if (sec === '3.2') return ESCARCHA
  if (sec === '3.3' || sec === '3.4') return AURORA
  if (sec === '3.6' || sec === 'Fuerza') return VIOLETA
  if (sec === 'Síntesis') return ORO
  return ESCARCHA
}

function actLabel(s: SD): string | null {
  const sec = s.section ?? ''
  if (sec === '3.1') return 'El flujo eléctrico'
  if (sec === '3.2') return 'La ley de Gauss'
  if (sec === '3.3' || sec === '3.4') return 'Aplicaciones por simetría'
  if (sec === '3.6') return 'Forma puntual'
  if (sec === 'Fuerza') return 'Fuerzas sobre cuerpos continuos'
  if (sec === 'Síntesis' || sec === 'Intro') return null
  return null
}

function actNumeral(s: SD): string | null {
  const sec = s.section ?? ''
  if (sec === '3.1') return 'I'
  if (sec === '3.2') return 'II'
  if (sec === '3.3' || sec === '3.4') return 'III'
  if (sec === '3.6' || sec === 'Fuerza') return 'IV'
  return null
}

export default function App() {
  return <Deck slides={SLIDES} accentFor={accentFor} actLabel={actLabel} actNumeral={actNumeral} theme={THEMES.gauss}/>
}
