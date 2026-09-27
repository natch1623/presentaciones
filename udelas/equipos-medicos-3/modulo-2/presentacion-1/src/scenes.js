/* =========================================================
   Escenas: construcción y estados de cada diagrama.
   Cada entrada: { build(s, api), enter(s), leave(s), state(s, n, prev), states }
   Coordenadas siempre en el escenario de 1920 × 1080.
   ========================================================= */
import * as CT from './ct.js'

const NS = 'http://www.w3.org/2000/svg'
const el = (tag, attrs = {}, parent) => {
  const e = document.createElementNS(NS, tag)
  for (const k in attrs) e.setAttribute(k, attrs[k])
  if (parent) parent.appendChild(e)
  return e
}
const txt = (parent, x, y, s, cls, extra = {}) => { const t = el('text', { x, y, class: cls, ...extra }, parent); t.textContent = s; return t }
const $ = (s, q) => s.querySelector(q)
const f1 = v => v.toFixed(1)
const deg = d => (d * Math.PI) / 180
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const fmt = (v, d = 1) => v.toFixed(d).replace('.', ',')

/* ---------- Cálculos de TC, perezosos y en caché ---------- */
const NA = 180, ND = 229
const cache = {}
const memo = (k, f) => cache[k] ?? (cache[k] = f())
const sino = name => memo('s-' + name, () => CT.sinogram(CT.PHANTOMS[name], NA, ND))
const fbpImg = (name, N = 200) => memo(`f-${name}-${N}`, () => CT.fbp(sino(name), NA, ND, N))
// Precalcula en segundo plano lo que pesa, para que ninguna transición tartamudee
const idle = window.requestIdleCallback || (f => setTimeout(f, 60))
;[() => sino('craneo'), () => sino('torax'), () => fbpImg('torax'), () => fbpImg('craneo')].reduce(
  (p, job) => p.then(() => new Promise(r => idle(() => { job(); r() }))), new Promise(r => setTimeout(r, 1500)))

export const Scenes = {}

/* ======================= 01 · Portada ======================= */
Scenes.s01 = {
  build(s) {
    const g = $(s, '.det-arc')
    for (let a = 58; a <= 122; a += 2) {
      const c = Math.cos(deg(a)), n = Math.sin(deg(a))
      el('line', { x1: f1(550 + c * 362), y1: f1(550 + n * 362), x2: f1(550 + c * (a % 8 ? 376 : 386)), y2: f1(550 + n * (a % 8 ? 376 : 386)) }, g)
    }
  },
}

/* ======================= 03 · Proyección ======================= */
Scenes.s03 = {
  build(s) {
    const g = $(s, '.pix')
    for (let x = 1220; x < 1740; x += 40) el('line', { x1: x, y1: 300, x2: x, y2: 760, class: 'grid' }, g)
    for (let y = 340; y < 760; y += 40) el('line', { x1: 1180, y1: y, x2: 1740, y2: y, class: 'grid' }, g)
  },
}

/* ======================= 04 · Rayo por vóxeles ======================= */
Scenes.s04 = {
  build(s) {
    const g = $(s, '.ray-row')
    const shades = [0.08, 0.22, 0.5, 0.3, 0.14, 0.4]
    el('path', { d: 'M170 490 H1040', class: 'ray-core' }, g)
    shades.forEach((a, i) => {
      const x = 330 + i * 105
      el('rect', { x, y: 440, width: 100, height: 100, class: 'vox', style: `--a:${a}; --pd:${300 + i * 90}ms` }, g).classList.add('pop')
      txt(g, x + 50, 500, `μ${'₁₂₃₄₅₆'[i]}`, 'vox-l', { 'text-anchor': 'middle' })
    })
    // Intensidad que cae tramo a tramo
    let I = 1
    shades.forEach((a, i) => {
      const x = 330 + i * 105
      I *= Math.exp(-a * 1.2)
      el('rect', { x: x + 20, y: 580, width: 60, height: f1(6 + 70 * I), class: 'ibar', transform: `translate(0 ${f1(76 - 70 * I)})` }, g)
    })
    el('rect', { x: 1040, y: 430, width: 24, height: 120, class: 'det' }, g)
    txt(g, 170, 460, 'I₀', 'io-l')
    txt(g, 1080, 500, 'I', 'io-l')
    txt(g, 330, 678, 'INTENSIDAD RESTANTE', 'tick-s')
    txt(g, 1040, 580, 'DETECTOR', 'tick-s')
    el('circle', { cx: 170, cy: 490, r: 9, class: 'src' }, g)
  },
}

/* ======================= 05 · Línea de tiempo ======================= */
const EVENTS = [
  ['1917', 'Radon', 'Una función se recupera de todas sus integrales de línea.'],
  ['1963', 'Cormack', 'Publica la base teórica de la reconstrucción.'],
  ['1971', 'Primer paciente', 'Hounsfield · EMI · Atkinson Morley, Londres. Matriz de 80 × 80.', true],
  ['1974', 'Cuerpo entero', 'ACTA (Ledley): el primer tomógrafo de cuerpo.'],
  ['1979', 'Nobel', 'Hounsfield y Cormack, Fisiología o Medicina.'],
  ['1983', 'EBCT', 'Haz de electrones, 50 ms por corte.'],
  ['1989', 'Helicoidal', 'Anillo deslizante y mesa continua (Kalender).', true],
  ['1998', 'Multicorte', '4 filas de detectores.', true],
  ['2004', '64 cortes', 'El cardiaco se vuelve rutina.'],
  ['2007', '320 filas', '16 cm por giro: un órgano en una rotación.'],
  ['2021', 'Conteo de fotones', 'Primer tomógrafo clínico con detector de conteo.', true],
]
Scenes.s05 = {
  build(s) {
    const g = $(s, '.tl'), box = $(s, '.tl-labels')
    const x0 = 240, x1 = 1680, y = 640
    el('line', { x1: 150, y1: y, x2: 1770, y2: y, class: 'axis draw', pathLength: 1 }, g)
    EVENTS.forEach(([yr, h, p, key], i) => {
      const x = x0 + ((x1 - x0) * i) / (EVENTS.length - 1)
      const up = i % 2 === 0
      el('line', { x1: x, y1: y, x2: x, y2: up ? y - 34 : y + 34, class: 'tick' }, g)
      el('circle', { cx: x, cy: y, r: key ? 8 : 5, class: 'pop ' + (key ? 'dm key' : 'dm'), style: `--pd:${250 + i * 80}ms` }, g)
      const d = document.createElement('div')
      d.className = `ev rv ${up ? 'up' : 'dn'} ${key ? 'key' : ''}`
      d.style.left = `${x}px`
      d.style.top = `${up ? y - 46 : y + 46}px`
      d.innerHTML = `<b>${yr}</b><h4>${h}</h4><p>${p}</p>`
      box.appendChild(d)
    })
  },
}

/* ======================= 06 · Componentes del gantry ======================= */
const COMP = [
  { x: 600, y: 358, lx: 648, ly: 336, a: 'start', t: 'Tubo de rayos X', r: 'PARTE ROTATORIA',
    p: 'Ánodo giratorio de gran capacidad térmica. Trabaja segundos o decenas de segundos seguidos, girando con el gantry. Refrigerado por aceite e intercambiador a bordo.' },
  { x: 600, y: 412, lx: 648, ly: 420, a: 'start', t: 'Filtro y colimador', r: 'PRE-PACIENTE',
    p: 'Filtración plana (Al, Cu), filtro de moño según el campo, y mordazas que definen el ancho del haz en z. Aquí se decide gran parte de la dosis.' },
  { x: 696, y: 923, lx: 730, ly: 950, a: 'start', t: 'Detectores', r: 'ARCO · 700–900 CANALES × FILA',
    p: 'Centelleador cerámico + fotodiodo en cada canal, de 16 a 320 filas en z. En equipos de conteo de fotones: semiconductor de conversión directa.' },
  { x: 477, y: 923, lx: 445, ly: 950, a: 'end', t: 'DAS', r: 'ADQUISICIÓN DE DATOS',
    p: 'Amplifica, integra, digitaliza y toma el logaritmo de cada canal, del orden de mil a pocos miles de veces por rotación (vistas).' },
  { x: 388, y: 448, lx: 350, ly: 420, a: 'end', t: 'Anillo deslizante', r: 'SLIP RING',
    p: 'Escobillas sobre anillos conductores llevan potencia a la parte rotatoria sin cables; los datos salen por enlace óptico o de RF. Hace posible el giro continuo y el helicoidal.' },
  { x: 330, y: 660, lx: 358, ly: 730, a: 'end', t: 'Generador', r: 'ALTA FRECUENCIA · A BORDO',
    p: '60–120 kW, montado en el gantry. Cambia kV y mA en milisegundos: modulación de corriente y energía dual por conmutación de kV.' },
  { x: 880, y: 780, lx: 900, ly: 830, a: 'start', t: 'Mesa', r: 'EJE Z',
    p: 'Desplazamiento longitudinal con precisión submilimétrica y cargas de 200 a 300 kg. Su velocidad frente a la rotación define el pitch.' },
  { x: 1060, y: 440, lx: 1060, ly: 500, a: 'middle', t: 'Consola', r: 'FUERA DEL GANTRY',
    p: 'Planifica sobre el topograma, controla la adquisición, reconstruye (FBP, iterativa, IA) y envía las imágenes al PACS en formato DICOM.' },
]
Scenes.s06 = {
  build(s) {
    const svg = $(s, 'svg.scene')
    const cx = 600, cy = 660
    el('circle', { cx, cy, r: 330, class: 'housing fade' }, svg)
    el('circle', { cx, cy, r: 300, class: 'slip fade', style: '--pd:200ms' }, svg)
    el('circle', { cx, cy, r: 178, class: 'bore fade', style: '--pd:250ms' }, svg)
    el('path', { d: `M600 380 L${f1(cx + 280 * Math.cos(deg(60)))} ${f1(cy + 280 * Math.sin(deg(60)))} A280 280 0 0 1 ${f1(cx + 280 * Math.cos(deg(120)))} ${f1(cy + 280 * Math.sin(deg(120)))} Z`, class: 'fan-f fade', style: '--pd:400ms' }, svg)
    const arc = el('g', { class: 'det-ticks' }, svg)
    for (let a = 60; a <= 120; a += 2.5) {
      const c = Math.cos(deg(a)), n = Math.sin(deg(a))
      el('line', { x1: f1(cx + c * 280), y1: f1(cy + n * 280), x2: f1(cx + c * 294), y2: f1(cy + n * 294) }, arc)
    }
    el('rect', { x: 566, y: 336, width: 68, height: 40, rx: 3, class: 'tube' }, svg)
    el('path', { d: 'M572 398 H628 L618 424 H582 Z', class: 'coll' }, svg)
    el('rect', { x: 298, y: 628, width: 60, height: 64, class: 'box-v' }, svg)
    el('rect', { x: 540, y: 950, width: 120, height: 22, class: 'box-v' }, svg)
    el('ellipse', { cx, cy: 690, rx: 130, ry: 88, class: 'pat' }, svg)
    el('rect', { x: 380, y: 772, width: 640, height: 14, class: 'table' }, svg)
    el('rect', { x: 1010, y: 404, width: 100, height: 64, rx: 4, class: 'box-v' }, svg)
    el('path', { d: 'M1044 468 v14 h32 v-14', class: 'box-v', fill: 'none' }, svg)

    const det = $(s, '.detail')
    const select = i => {
      const c = COMP[i]
      s.querySelectorAll('.node').forEach((n, k) => n.classList.toggle('sel', k === i))
      $(det, '.dn').textContent = String(i + 1).padStart(2, '0')
      $(det, '.dh').textContent = c.t
      $(det, '.dr').textContent = c.r
      $(det, '.dp').textContent = c.p
      det.classList.remove('swap'); void det.offsetWidth; det.classList.add('swap')
    }
    COMP.forEach((c, i) => {
      const n = el('g', { class: 'node hit', tabindex: 0, role: 'button', 'aria-label': c.t }, svg)
      el('circle', { cx: c.x, cy: c.y, r: 30, class: 'hitbox' }, n)
      el('circle', { cx: c.x, cy: c.y, r: 20, class: 'halo' }, n)
      el('circle', { cx: c.x, cy: c.y, r: 7, class: 'core pop', style: `--pd:${500 + i * 70}ms` }, n)
      txt(n, c.lx, c.ly, c.t, 'node-l', { 'text-anchor': c.a })
      n.addEventListener('click', e => { e.stopPropagation(); select(i) })
    })
    select(0)
  },
}

/* ======================= 07 · Generaciones 1–4 ======================= */
const GENS = [
  { m: 'Traslación – rotación', h: 'Lápiz (pencil beam)', d: '1 detector (2 en el EMI Mark I)', t: '≈ 4,5–5 min', n: 'Barre en línea recta, gira 1° y repite hasta cubrir 180°.' },
  { m: 'Traslación – rotación', h: 'Abanico estrecho ≈ 10°', d: '3 a 52 detectores', t: '20 s – 2 min', n: 'Cada barrido capta varios ángulos a la vez: los giros pueden ser mayores.' },
  { m: 'Rotación – rotación', h: 'Abanico ancho 30–60° que cubre al paciente', d: 'Arco de cientos de detectores que gira con el tubo', t: '< 1 s · hoy 0,25 s', n: 'Base de todos los equipos actuales. Riesgo: un canal descalibrado dibuja un anillo.' },
  { m: 'Rotación – estacionario', h: 'Abanico ancho', d: 'Anillo fijo de 600 a 4800 detectores', t: '< 1 s', n: 'Sin anillos, pero más dispersión y muchos más detectores. Desapareció del mercado.' },
]
Scenes.s07 = {
  states: 3,
  build(s) {
    const svg = $(s, 'svg.scene')
    const cx = 620, cy = 640
    el('circle', { cx, cy, r: 318, class: 'housing' }, svg)
    el('ellipse', { cx, cy, rx: 120, ry: 92, class: 'pat' }, svg)
    el('circle', { cx, cy, r: 4, class: 'iso' }, svg)
    // 1.ª
    const g1 = el('g', { class: 'gen g1', 'data-only': '0' }, svg)
    const r1 = el('g', { class: 'rot-steps' }, g1)
    const t1 = el('g', { class: 'transl' }, r1)
    el('line', { x1: 340, y1: cy, x2: 900, y2: cy, class: 'beam-line' }, t1)
    el('rect', { x: 306, y: cy - 18, width: 34, height: 36, class: 'tube' }, t1)
    el('rect', { x: 900, y: cy - 10, width: 18, height: 20, class: 'detb' }, t1)
    // 2.ª
    const g2 = el('g', { class: 'gen g2', 'data-only': '1' }, svg)
    const r2 = el('g', { class: 'rot-steps' }, g2)
    const t2 = el('g', { class: 'transl' }, r2)
    el('path', { d: `M340 ${cy} L900 ${cy - 52} L900 ${cy + 52} Z`, class: 'fan-f' }, t2)
    el('rect', { x: 306, y: cy - 18, width: 34, height: 36, class: 'tube' }, t2)
    for (let k = 0; k < 6; k++) el('rect', { x: 900, y: cy - 54 + k * 18, width: 18, height: 16, class: 'detb' }, t2)
    // 3.ª
    const g3 = el('g', { class: 'gen g3', 'data-only': '2' }, svg)
    const r3 = el('g', { class: 'rot-cont' }, g3)
    const R = 290
    el('path', { d: `M${cx} ${cy - R} L${f1(cx + R * Math.cos(deg(58)))} ${f1(cy + R * Math.sin(deg(58)))} A${R} ${R} 0 0 1 ${f1(cx + R * Math.cos(deg(122)))} ${f1(cy + R * Math.sin(deg(122)))} Z`, class: 'fan-f' }, r3)
    for (let a = 58; a <= 122; a += 2.5) el('line', { x1: f1(cx + R * Math.cos(deg(a))), y1: f1(cy + R * Math.sin(deg(a))), x2: f1(cx + (R + 16) * Math.cos(deg(a))), y2: f1(cy + (R + 16) * Math.sin(deg(a))), class: 'det-l' }, r3)
    el('rect', { x: cx - 20, y: cy - R - 26, width: 40, height: 30, class: 'tube' }, r3)
    // 4.ª
    const g4 = el('g', { class: 'gen g4', 'data-only': '3' }, svg)
    for (let a = 0; a < 360; a += 3) el('line', { x1: f1(cx + 296 * Math.cos(deg(a))), y1: f1(cy + 296 * Math.sin(deg(a))), x2: f1(cx + 312 * Math.cos(deg(a))), y2: f1(cy + 312 * Math.sin(deg(a))), class: 'det-l' }, g4)
    const r4 = el('g', { class: 'rot-cont' }, g4)
    const Rt = 250
    el('path', { d: `M${cx} ${cy - Rt} L${f1(cx + 296 * Math.cos(deg(62)))} ${f1(cy + 296 * Math.sin(deg(62)))} A296 296 0 0 1 ${f1(cx + 296 * Math.cos(deg(118)))} ${f1(cy + 296 * Math.sin(deg(118)))} Z`, class: 'fan-f' }, r4)
    el('rect', { x: cx - 18, y: cy - Rt - 24, width: 36, height: 28, class: 'tube' }, r4)
  },
  state(s, n) {
    s.querySelectorAll('.rail.gens li').forEach((li, i) => { li.classList.toggle('cur', i === n); li.classList.toggle('done', i < n) })
    const g = GENS[n]
    const d = $(s, '.gen-d')
    d.innerHTML = `<div class="gn">${n + 1}.ª</div>
      <div class="rows"><div class="row"><div class="h">Movimiento</div><div class="d"><b>${g.m}</b></div></div>
      <div class="row"><div class="h">Haz</div><div class="d">${g.h}</div></div>
      <div class="row"><div class="h">Detectores</div><div class="d">${g.d}</div></div>
      <div class="row"><div class="h">Tiempo por corte</div><div class="d"><b>${g.t}</b></div></div></div>
      <p class="gnote">${g.n}</p>`
    d.classList.remove('swap'); void d.offsetWidth; d.classList.add('swap')
  },
}

/* ======================= 11 · Filtración y moño ======================= */
// Cuerda de un rayo desde el foco F hacia el detector en x, a través de una elipse
function chord([fx, fy], x, cx, cy, a, b) {
  const dx = x - fx, dy = 790 - fy, L = Math.hypot(dx, dy)
  const ux = dx / L, uy = dy / L, px = fx - cx, py = fy - cy
  const A = (ux * ux) / (a * a) + (uy * uy) / (b * b)
  const B = 2 * ((px * ux) / (a * a) + (py * uy) / (b * b))
  const C = (px * px) / (a * a) + (py * py) / (b * b) - 1
  const disc = B * B - 4 * A * C
  return disc > 0 ? Math.sqrt(disc) / A : 0
}
const PAT = { cx: 560, cy: 610, a: 150, b: 112 }
Scenes.s11 = {
  states: 2,
  build(s) {
    const svg = $(s, 'svg.scene')
    this.F = [560, 350]
    el('path', { d: 'M560 350 L250 790 L870 790 Z', class: 'fan-f' }, svg)
    el('rect', { x: 524, y: 318, width: 72, height: 32, rx: 3, class: 'tube' }, svg)
    el('rect', { x: 500, y: 356, width: 120, height: 8, class: 'flat' }, svg)
    el('path', { d: 'M470 372 H650 V414 Q560 382 470 414 Z', class: 'bowtie', 'data-at': '1' }, svg)
    const pat = el('g', { class: 'pat-g' }, svg)
    el('ellipse', { cx: PAT.cx, cy: PAT.cy, rx: PAT.a, ry: PAT.b, class: 'pat' }, pat)
    el('ellipse', { cx: PAT.cx, cy: PAT.cy, rx: PAT.a, ry: PAT.b, class: 'skin' }, pat)
    el('rect', { x: 380, y: 734, width: 360, height: 10, class: 'table' }, svg)
    for (let x = 250; x <= 870; x += 12) el('line', { x1: x, y1: 796, x2: x, y2: 810, class: 'det-l' }, svg)
    txt(svg, 250, 846, 'SEÑAL EN EL DETECTOR', 'tick-s')
    el('line', { x1: 250, y1: 980, x2: 870, y2: 980, class: 'axis' }, svg)
    this.curve = el('path', { class: 'prof-c' }, svg)
    this.tag = txt(svg, 250, 872, '', 'tick-s')
    this.pat = pat
  },
  state(s, n) {
    const shift = n === 2 ? 110 : 0
    this.pat.setAttribute('transform', `translate(${shift} 0)`)
    const bow = n >= 1, mu = 0.006
    const c0 = chord(this.F, 560, PAT.cx, PAT.cy, PAT.a, PAT.b)
    const vals = []
    for (let x = 250; x <= 870; x += 4) {
      const ch = chord(this.F, x, PAT.cx + shift, PAT.cy, PAT.a, PAT.b)
      // El moño está diseñado para el paciente centrado: compensa su cuerda
      const bt = bow ? 0.92 * mu * (c0 - chord(this.F, x, PAT.cx, PAT.cy, PAT.a, PAT.b)) : 0
      vals.push([x, Math.exp(-mu * ch - bt)])
    }
    const max = Math.max(...vals.map(v => v[1]))
    const d = vals.map(([x, I], i) => `${i ? 'L' : 'M'}${x} ${f1(980 - 100 * (I / max))}`).join(' ')
    this.curve.setAttribute('d', d)
    this.curve.setAttribute('class', 'prof-c ' + (n === 0 ? 'bad' : n === 2 ? 'warn' : 'ok'))
    this.tag.textContent = n === 0 ? 'BORDES SATURADOS · CENTRO CON POCOS FOTONES' : n === 1 ? 'PERFIL CASI PLANO' : 'PACIENTE DESCENTRADO · PERFIL ASIMÉTRICO'
  },
}

/* ======================= 12 · Colimación ======================= */
Scenes.s12 = {
  states: 2,
  build(s) {
    const svg = $(s, 'svg.scene')
    // Foco finito (penumbra) → mordazas → paciente → filas de detectores
    el('rect', { x: 520, y: 330, width: 80, height: 30, rx: 3, class: 'tube' }, svg)
    el('rect', { x: 552, y: 360, width: 16, height: 4, class: 'focal' }, svg)
    el('rect', { x: 380, y: 420, width: 150, height: 26, class: 'jaw' }, svg)
    el('rect', { x: 590, y: 420, width: 150, height: 26, class: 'jaw' }, svg)
    // umbra: desde los bordes del foco pasando por las mordazas
    el('path', { d: 'M560 364 L380 830 L740 830 Z', class: 'fan-f' }, svg)
    el('path', { d: 'M552 364 L530 446 L346 830 L380 830 Z M568 364 L590 446 L774 830 L740 830 Z', class: 'penumbra', 'data-at': '1' }, svg)
    el('rect', { x: 180, y: 590, width: 760, height: 130, class: 'slab' }, svg)
    txt(svg, 190, 616, 'PACIENTE', 'tick-s')
    txt(svg, 945, 866, 'z →', 'axis-t', { 'text-anchor': 'end' })
    for (let k = 0; k < 8; k++) el('rect', { x: 380 + k * 45, y: 830, width: 43, height: 26, class: 'row-d' }, svg)
    el('rect', { x: 330, y: 830, width: 48, height: 26, class: 'row-off' }, svg)
    el('rect', { x: 742, y: 830, width: 48, height: 26, class: 'row-off' }, svg)
    el('path', { d: 'M380 880 v10 H740 v-10', class: 'brk' }, svg)
    txt(svg, 560, 918, 'N × T', 'nt-l', { 'text-anchor': 'middle' })
    txt(svg, 330, 818, 'FILAS INACTIVAS', 'tick-s', { 'data-at': '1' })
    // Sobre-rango (estado 2)
    const o = el('g', { 'data-at': '2' }, svg)
    el('line', { x1: 300, y1: 955, x2: 820, y2: 955, class: 'plan' }, o)
    el('line', { x1: 230, y1: 955, x2: 300, y2: 955, class: 'over' }, o)
    el('line', { x1: 820, y1: 955, x2: 890, y2: 955, class: 'over' }, o)
    txt(o, 560, 984, 'RANGO PLANIFICADO', 'tick-s', { 'text-anchor': 'middle' })
    txt(o, 230, 940, '+ ½ VUELTA', 'tick-s c-danger-f')
    txt(o, 890, 940, '+ ½ VUELTA', 'tick-s c-danger-f', { 'text-anchor': 'end' })
  },
}

/* ======================= 13 · AEC ======================= */
Scenes.s13 = {
  states: 2,
  build(s) {
    const svg = $(s, 'svg.scene')
    const body = 'M300 452 C300 420 320 396 345 380 C380 362 420 372 470 378 L620 386 C680 390 720 398 760 398 L880 396 C930 388 980 380 1010 392 L1150 404 L1150 462 L1010 466 L1010 474 L1150 478 L1150 536 L1010 548 C980 560 930 552 880 544 L760 542 C720 542 680 550 620 554 L470 562 C420 568 380 578 345 560 C320 544 300 520 300 488 Z'
    const g = el('g', { class: 'topo' }, svg)
    el('path', { d: body, class: 'body' }, g)
    el('ellipse', { cx: 215, cy: 470, rx: 56, ry: 48, class: 'body' }, g)
    el('rect', { x: 268, y: 452, width: 36, height: 36, class: 'body' }, g)
    el('ellipse', { cx: 500, cy: 430, rx: 110, ry: 40, class: 'lung' }, g)
    el('ellipse', { cx: 500, cy: 512, rx: 110, ry: 40, class: 'lung' }, g)
    el('rect', { x: 920, y: 452, width: 60, height: 36, rx: 12, class: 'bone' }, g)
    txt(svg, 150, 350, 'TOPOGRAMA', 'tick-s')
    // Eje del mA
    el('line', { x1: 150, y1: 930, x2: 1160, y2: 930, class: 'axis' }, svg)
    el('line', { x1: 150, y1: 930, x2: 150, y2: 650, class: 'axis' }, svg)
    txt(svg, 160, 668, 'mA', 'axis-t')
    txt(svg, 1160, 962, 'z', 'axis-t', { 'text-anchor': 'end' })
    const A = z => {
      // atenuación relativa a lo largo de z (x de pantalla)
      const k = [[160, 0.5], [270, 0.42], [345, 1], [420, 0.62], [520, 0.4], [620, 0.55], [720, 0.8], [880, 0.78], [950, 1], [1010, 0.9], [1080, 0.6], [1150, 0.55]]
      for (let i = 0; i < k.length - 1; i++) if (z <= k[i + 1][0]) { const t = (z - k[i][0]) / (k[i + 1][0] - k[i][0]); const e = t * t * (3 - 2 * t); return k[i][1] + (k[i + 1][1] - k[i][1]) * e }
      return 0.55
    }
    const path = (fz) => { let d = ''; for (let z = 160; z <= 1150; z += 3) d += `${d ? ' L' : 'M'}${z} ${f1(fz(z))}`; return d }
    this.flat = path(() => 700)
    this.zmod = path(z => 930 - 240 * A(z))
    this.ang = path(z => 930 - 240 * A(z) * (1 + 0.07 * Math.sin(z / 11)))
    this.area = el('path', { class: 'dose-area' }, svg)
    this.c = el('path', { class: 'ma-c' }, svg)
  },
  state(s, n) {
    const d = [this.flat, this.zmod, this.ang][n]
    this.c.setAttribute('d', d)
    this.c.setAttribute('class', 'ma-c ' + (n ? 'ok' : 'bad'))
    this.area.setAttribute('d', `${d} L1150 930 L160 930 Z`)
    this.area.setAttribute('class', 'dose-area ' + (n ? 'ok' : 'bad'))
  },
}

/* ======================= 15 · Cadena de detección ======================= */
const CHAIN = [
  ['Fotón X', 'Sale del paciente con la información de atenuación'],
  ['Centelleador', 'GOS cerámico, CdWO₄: convierte el fotón en luz'],
  ['Fotodiodo', 'Convierte la luz en corriente eléctrica'],
  ['DAS', 'Amplifica, integra, digitaliza y toma el logaritmo'],
  ['Proyección p', 'Un número por canal y por vista: ln(I₀/I)'],
]
Scenes.s15 = {
  states: 1,
  build(s) {
    const svg = $(s, 'svg.scene'), box = $(s, '.chain-l')
    const y = 470, xs = CHAIN.map((_, i) => 250 + i * 355)
    el('line', { x1: xs[0], y1: y, x2: xs[4], y2: y, class: 'base' }, svg)
    xs.forEach((x, i) => {
      el('circle', { cx: x, cy: y, r: 22, class: 'cn ' + (i === 0 ? 'x' : i === 4 ? 'p' : ''), style: `--i:${i}` }, svg)
      txt(svg, x, y - 44, String(i + 1).padStart(2, '0'), 'cn-n', { 'text-anchor': 'middle' })
      const d = document.createElement('div')
      d.className = 'lk rv' + (i === 4 ? ' p' : '')
      d.style.left = `${x}px`
      d.innerHTML = `<div class="t">${CHAIN[i][0]}</div><div class="s">${CHAIN[i][1]}</div>`
      box.appendChild(d)
    })
    el('circle', { cx: xs[0], cy: y, r: 8, class: 'pulse-dot' }, svg)
  },
}

/* ======================= 16 · Indirecta vs directa ======================= */
Scenes.s16 = {
  states: 1,
  build(s) {
    const svg = $(s, 'svg.scene')
    // Indirecta
    const L = el('g', {}, svg)
    for (let k = 0; k < 6; k++) {
      const x = 200 + k * 100
      el('rect', { x, y: 440, width: 92, height: 120, class: 'scint' }, L)
      el('rect', { x: x + 92, y: 440, width: 8, height: 120, class: 'septa' }, L)
      el('rect', { x, y: 566, width: 92, height: 18, class: 'pd' }, L)
    }
    el('line', { x1: 450, y1: 350, x2: 450, y2: 500, class: 'xray' }, L)
    el('circle', { cx: 450, cy: 505, r: 36, class: 'glow-light' }, L)
    txt(L, 200, 420, 'CENTELLEADOR', 'tick-s')
    txt(L, 200, 610, 'FOTODIODOS', 'tick-s')
    el('path', { d: 'M200 700 C300 700 330 640 450 640 C570 640 600 700 800 700', class: 'integ' }, L)
    txt(L, 200, 730, 'SEÑAL = Σ ENERGÍA + RUIDO ELECTRÓNICO', 'tick-s')
    // Directa
    const R = el('g', {}, svg)
    el('rect', { x: 1060, y: 440, width: 600, height: 120, class: 'cdte' }, R)
    txt(R, 1060, 420, 'CdTe · −HV', 'tick-s')
    for (let k = 0; k < 12; k++) el('rect', { x: 1064 + k * 50, y: 566, width: 44, height: 12, class: 'pix-e' }, R)
    el('line', { x1: 1300, y1: 350, x2: 1300, y2: 470, class: 'xray' }, R)
    for (let k = 0; k < 7; k++) el('line', { x1: 1296 + k * 1.5, y1: 478, x2: 1286 + k * 4, y2: 560, class: 'drift' }, R)
    txt(R, 1060, 610, 'PÍXELES · SIN TABIQUES', 'tick-s')
    // Pulso y umbrales
    el('path', { d: 'M1060 720 H1250 C1280 720 1290 640 1320 640 C1350 640 1370 720 1420 720 H1660', class: 'pulse-p' }, R)
    const th = el('g', { 'data-at': '1' }, R)
    ;[700, 680, 660, 645].forEach((y, i) => {
      el('line', { x1: 1060, y1: y, x2: 1660, y2: y, class: 'thr' }, th)
      txt(th, 1668, y + 5, `U${i + 1}`, 'thr-l')
    })
    txt(R, 1060, 748, 'UN PULSO POR FOTÓN · ALTURA ∝ ENERGÍA', 'tick-s')
  },
}

/* ======================= 17 · Multicorte ======================= */
const MC = [
  { n: 1, T: 10, name: 'Un solo corte', cfg: '1 × 1–10 mm', cov: '≤ 10 mm', use: 'Helicoidal de los años 90: tórax en varias apneas.' },
  { n: 16, T: 1.25, name: '16 filas', cfg: '16 × 1,25 mm', cov: '20 mm', use: 'Cortes submilimétricos de rutina; angio-TC.' },
  { n: 64, T: 0.625, name: '64 filas', cfg: '64 × 0,625 mm', cov: '40 mm', use: 'Coronarias en pocos latidos: el estándar hospitalario.' },
  { n: 320, T: 0.5, name: '320 filas', cfg: '320 × 0,5 mm', cov: '160 mm', use: 'Corazón o cerebro completo en una rotación, sin mover la mesa.' },
]
Scenes.s17 = {
  states: 3,
  build(s) {
    const svg = $(s, 'svg.scene')
    const cy = 610
    // Silueta del corazón a escala (≈ 12 cm en z = 360 px), sin iconografía
    el('ellipse', { cx: 570, cy, rx: 230, ry: 180, class: 'heart', transform: `rotate(-18 570 ${cy})` }, svg)
    txt(svg, 820, cy - 150, 'CORAZÓN ≈ 12 cm', 'tick-s')
    this.rows = el('g', {}, svg)
    this.band = el('rect', { x: 180, width: 780, class: 'mc-band' }, svg)
    this.lbl = txt(svg, 180, 0, '', 'nt-l')
    el('line', { x1: 150, y1: cy - 260, x2: 150, y2: cy + 260, class: 'axis' }, svg)
    txt(svg, 140, cy - 270, 'z', 'axis-t', { 'text-anchor': 'end' })
    txt(svg, 960, cy + 290, 'CANALES (x) →', 'tick-s', { 'text-anchor': 'end' })
  },
  state(s, n) {
    const m = MC[n], cy = 610, px = 3 // 3 px por mm
    const h = Math.min(480, m.n * m.T * px)
    this.band.setAttribute('y', f1(cy - h / 2)); this.band.setAttribute('height', f1(h))
    this.rows.replaceChildren()
    const step = h / m.n
    if (m.n <= 64) for (let k = 1; k < m.n; k++) el('line', { x1: 180, x2: 960, y1: f1(cy - h / 2 + k * step), y2: f1(cy - h / 2 + k * step), class: 'mc-row' }, this.rows)
    for (let x = 180; x <= 960; x += 12) el('line', { x1: x, x2: x, y1: f1(cy - h / 2), y2: f1(cy + h / 2), class: 'mc-ch' }, this.rows)
    this.lbl.setAttribute('y', f1(cy - h / 2 - 14))
    this.lbl.textContent = `${m.cfg}  ·  ${m.cov}`
    const d = $(s, '.mc-d')
    d.innerHTML = `<div class="gn">${m.name}</div><div class="rows">
      <div class="row"><div class="h">Configuración</div><div class="d"><b>${m.cfg}</b></div></div>
      <div class="row"><div class="h">Cobertura por giro</div><div class="d"><b>${m.cov}</b></div></div></div>
      <p class="gnote">${m.use}</p>`
    d.classList.remove('swap'); void d.offsetWidth; d.classList.add('swap')
  },
}

/* ======================= 18–19 · Hélice ======================= */
// Cinta del haz sobre un cilindro: cada media vuelta frontal es una banda
// de ancho N·T; donde se solapan se ven más claras, donde no llegan hay hueco.
function helix(g, { x0, x1, cy, R, w, adv, axial = false }) {
  g.replaceChildren()
  const turns = Math.ceil((x1 - x0) / adv) + 1
  for (let k = 0; k < turns; k++) {
    const pts = [], back = []
    const base = x0 + k * adv
    if (base > x1) break
    for (let i = 0; i <= 24; i++) {
      const t = (i / 24) * Math.PI
      const dx = axial ? 0 : (adv * t) / (2 * Math.PI)
      pts.push([base + dx, cy - R * Math.cos(t)])
      const tb = Math.PI + t
      back.push([base + (axial ? 0 : (adv * tb) / (2 * Math.PI)), cy - R * Math.cos(tb)])
    }
    const fwd = pts.map(p => `${f1(p[0])} ${f1(p[1])}`).join(' L')
    const rev = [...pts].reverse().map(p => `${f1(p[0] + w)} ${f1(p[1])}`).join(' L')
    el('path', { d: `M${fwd} L${rev} Z`, class: 'ribbon' }, g)
    el('path', { d: 'M' + back.map(p => `${f1(p[0] + w / 2)} ${f1(p[1])}`).join(' L'), class: 'ribbon-back' }, g)
  }
}
function cylinder(svg, x0, x1, cy, R, id) {
  const cp = el('clipPath', { id }, el('defs', {}, svg))
  el('rect', { x: x0, y: cy - R - 20, width: x1 - x0, height: 2 * R + 40 }, cp)
  el('path', { d: `M${x0} ${cy - R} H${x1} M${x0} ${cy + R} H${x1}`, class: 'cyl' }, svg)
  el('ellipse', { cx: x0, cy, rx: 34, ry: R, class: 'cyl' }, svg)
  el('ellipse', { cx: x1, cy, rx: 34, ry: R, class: 'cyl' }, svg)
  el('line', { x1: x0 - 60, y1: cy, x2: x1 + 80, y2: cy, class: 'base' }, svg)
  txt(svg, x1 + 80, cy - 14, 'z', 'axis-t', { 'text-anchor': 'end' })
}
Scenes.s18 = {
  states: 1,
  build(s) {
    const svg = $(s, 'svg.scene')
    cylinder(svg, 220, 1300, 540, 150, 'cyl18')
    this.g = el('g', { 'clip-path': 'url(#cyl18)' }, svg)
    this.tag = txt(svg, 220, 360, '', 'tick-s')
  },
  state(s, n) {
    helix(this.g, { x0: 250, x1: 1250, cy: 540, R: 150, w: 70, adv: n ? 160 : 190, axial: !n })
    this.tag.textContent = n ? 'HELICOIDAL · EL TUBO NUNCA SE DETIENE' : 'AXIAL · UN GIRO, AVANZA, OTRO GIRO'
    s.querySelectorAll('.mode-rows .row').forEach(r => r.classList.toggle('cur', +r.dataset.m === n))
  },
}
Scenes.s19 = {
  build(s) {
    const svg = $(s, 'svg.scene')
    cylinder(svg, 180, 1080, 560, 170, 'cyl19')
    const g = el('g', { 'clip-path': 'url(#cyl19)' }, svg)
    const tag = txt(svg, 180, 360, '', 'tick-s')
    const inp = $(s, '#pitch-in'), out = $(s, '#pitch-out'), read = $(s, '.pitch-read')
    const NT = 40 // mm, 64 × 0,625
    const draw = () => {
      const p = +inp.value
      const pxmm = 3.3
      helix(g, { x0: 200, x1: 1040, cy: 560, R: 170, w: NT * pxmm, adv: p * NT * pxmm })
      out.textContent = fmt(p)
      tag.textContent = p < 0.95 ? 'VUELTAS SOLAPADAS · MÁS DOSIS' : p <= 1.05 ? 'VUELTAS CONTIGUAS' : 'HUECOS ENTRE VUELTAS · SE INTERPOLA'
      tag.setAttribute('class', 'tick-s ' + (p < 0.95 ? 'c-danger-f' : p > 1.05 ? 'c-ice-f' : ''))
      const t = (400 / (p * NT)) * 0.5
      read.innerHTML = `
        <div><b>${fmt(p * NT)} mm</b><span>avance de mesa por vuelta (N·T = 64 × 0,625 = 40 mm)</span></div>
        <div><b>${fmt(t)} s</b><span>para cubrir 40 cm de tórax a 0,5 s por vuelta</span></div>
        <div><b class="${p < 1 ? 'c-danger' : 'c-ctrl'}">×${fmt(1 / p, 2)}</b><span>dosis relativa si el mA queda fijo (mAs efectivo = mAs / pitch)</span></div>`
    }
    inp.addEventListener('input', draw)
    ;['click', 'pointerdown'].forEach(ev => inp.addEventListener(ev, e => e.stopPropagation()))
    draw()
  },
}

/* ======================= 21 · Sinograma ======================= */
Scenes.s21 = {
  states: 1,
  build(s) {
    this.obj = $(s, '.cv-obj'); this.sin = $(s, '.cv-sino'); this.over = $(s, '.ct-over')
    this.prof = $(s, 'svg.prof'); this.cap = s.querySelectorAll('.cap-l')[1]
    this.cursor = $(s, '.sino-cursor')
    el('line', { class: 'axis', x1: 150, y1: 900, x2: 550, y2: 900 }, this.prof)
    txt(this.prof, 150, 940, 'PERFIL p(t) EN EL ÁNGULO ACTUAL', 'tick-s')
    this.pc = el('path', { class: 'prof-c ok' }, this.prof)
    this.rays = el('g', {}, this.over)
    this.tube = el('rect', { width: 0.16, height: 0.1, class: 'tube-s' }, this.over)
  },
  enter(s) {
    const N = 200
    CT.paintHU(this.obj, memo('r-craneo', () => CT.rasterize(CT.PHANTOMS.craneo, N)), N, 160, 50)
    this.S = sino('craneo')
    this.sorted = memo('sino-max', () => this.S.reduce((m, v) => Math.max(m, v), 0))
    // El hematoma, solo: su sinusoide se pinta en carmesí sobre el sinograma
    this.Hm = memo('sino-hem', () => CT.sinogram(CT.PHANTOMS.craneo.slice(-1), NA, ND))
    this.drawTo(-1)
  },
  leave() { cancelAnimationFrame(this.raf) },
  // Rellena el sinograma hasta la vista k (−1 = vacío) y dibuja el perfil en k
  drawTo(k, only = false) {
    const c = this.sin, ctx = c.getContext('2d')
    if (c.width !== NA || c.height !== ND) { c.width = NA; c.height = ND }
    const id = ctx.createImageData(NA, ND)
    for (let a = 0; a < NA; a++) {
      const on = only ? a === k : a <= k
      for (let d = 0; d < ND; d++) {
        const v = on ? Math.min(1, this.S[a * ND + d] / this.sorted) : 0
        const h = on && this.Hm[a * ND + d] > 0.5
        const p = 4 * (d * NA + a)
        if (h) { id.data[p] = 255; id.data[p + 1] = 77; id.data[p + 2] = 109; id.data[p + 3] = 255; continue }
        id.data[p] = 94 + 150 * v; id.data[p + 1] = 110 + 130 * v; id.data[p + 2] = 140 + 115 * v; id.data[p + 3] = on ? 255 * (0.15 + 0.85 * v) : 0
      }
    }
    ctx.putImageData(id, 0, 0)
    if (k < 0) { this.pc.setAttribute('d', ''); this.rays.replaceChildren(); return }
    // Perfil
    let d = ''
    for (let j = 0; j < ND; j++) d += `${j ? ' L' : 'M'}${f1(150 + (400 * j) / (ND - 1))} ${f1(900 - 100 * (this.S[k * ND + j] / this.sorted))}`
    this.pc.setAttribute('d', d)
    // Rayos paralelos al ángulo actual (dirección de la integral)
    const th = (Math.PI * k) / NA
    const ux = -Math.sin(th), uy = -Math.cos(th) // dirección del rayo en coordenadas de pantalla
    this.rays.replaceChildren()
    for (let t = -0.9; t <= 0.91; t += 0.15) {
      const cx = t * Math.cos(th), cy = -t * Math.sin(th)
      el('line', { x1: f1(cx - ux * 1.2), y1: f1(cy - uy * 1.2), x2: f1(cx + ux * 1.2), y2: f1(cy + uy * 1.2), class: 'ray-s' }, this.rays)
    }
    this.tube.setAttribute('transform', `translate(${f1(-ux * 0.9 - 0.08)} ${f1(-uy * 0.9 - 0.05)})`)
    this.cap.textContent = `SINOGRAMA · θ = ${Math.round((180 * k) / NA)}°`
    this.cursor.style.left = `${(k / NA) * 100}%`
  },
  state(s, n) {
    cancelAnimationFrame(this.raf)
    if (!this.S) return
    if (n === 0) { this.drawTo(30, true); return }
    if (reduced) { this.drawTo(NA - 1); return }
    const t0 = performance.now(), dur = 4800
    const step = now => {
      const k = Math.min(NA - 1, Math.floor(((now - t0) / dur) * NA))
      this.drawTo(k)
      if (k < NA - 1) this.raf = requestAnimationFrame(step)
    }
    this.raf = requestAnimationFrame(step)
  },
}

/* ======================= 22 · Retroproyección ======================= */
const BP_VIEWS = [1, 2, 4, 16, 180]
Scenes.s22 = {
  states: 4,
  build(s) { this.cv = $(s, '.cv-bp'); this.read = $(s, '.bp-read') },
  state(s, n) {
    const v = BP_VIEWS[n]
    const img = memo('bp-' + v, () => CT.backproject(sino('craneo'), NA, ND, 200, CT.spread(NA, v)))
    CT.paintAuto(this.cv, img, 200, 200, [214, 255, 240], 0.02, 0.998)
    this.read.textContent = `${v} ${v === 1 ? 'VISTA' : 'VISTAS'} · SIN FILTRO`
    s.querySelectorAll('.rail.views li').forEach((li, i) => { li.classList.toggle('cur', i === n); li.classList.toggle('done', i < n) })
  },
}

/* ======================= 23 · Filtrado ======================= */
Scenes.s23 = {
  states: 2,
  build(s) {
    this.cv = $(s, '.cv-fbp'); this.read = $(s, '.fbp-read')
    const svg = $(s, 'svg.scene')
    // Núcleo espacial h(t): pico central y lóbulos negativos
    const k = el('g', { 'data-at': '1' }, svg)
    el('line', { x1: 880, y1: 520, x2: 1280, y2: 520, class: 'axis' }, k)
    txt(k, 880, 350, 'NÚCLEO h(t)', 'tick-s')
    const tau = 1
    for (let i = -10; i <= 10; i++) {
      const h = -2 / (Math.PI * Math.PI * tau * tau * (4 * i * i - 1))
      const x = 1080 + i * 19, y = 520 - h * 220
      el('line', { x1: x, y1: 520, x2: x, y2: f1(y), class: 'stem ' + (h < 0 ? 'neg' : 'pos') }, k)
      el('circle', { cx: x, cy: f1(y), r: 3.5, class: 'stem-d ' + (h < 0 ? 'neg' : 'pos') }, k)
    }
    // Perfil antes y después del filtro (vista 0 del cráneo)
    const P = el('g', { 'data-at': '1' }, svg)
    el('line', { x1: 1370, y1: 520, x2: 1770, y2: 520, class: 'axis' }, P)
    txt(P, 1370, 350, 'PERFIL · ANTES Y DESPUÉS', 'tick-s')
    this.pRaw = el('path', { class: 'prof-c dim' }, P)
    this.pFil = el('path', { class: 'prof-c ok' }, P)
  },
  enter() {
    const S = sino('craneo')
    const F = memo('fil-craneo', () => CT.filter(S, NA, ND))
    let mr = 0, mf = 0
    for (let j = 0; j < ND; j++) { mr = Math.max(mr, S[j]); mf = Math.max(mf, Math.abs(F[j])) }
    const path = (A, m, h, y0) => { let d = ''; for (let j = 0; j < ND; j++) d += `${j ? ' L' : 'M'}${f1(1370 + (400 * j) / (ND - 1))} ${f1(y0 - (h * A[j]) / m)}`; return d }
    this.pRaw.setAttribute('d', path(S, mr, 130, 520))
    this.pFil.setAttribute('d', path(F, mf, 150, 520))
  },
  state(s, n) {
    if (n === 0) {
      const img = memo('bp-180', () => CT.backproject(sino('craneo'), NA, ND, 200, CT.spread(NA, 180)))
      CT.paintAuto(this.cv, img, 200, 200, [214, 255, 240], 0.02, 0.998)
      this.read.textContent = 'RETROPROYECCIÓN · SIN FILTRAR'
    } else if (n === 1) {
      const img = memo('fbp-12', () => CT.fbp(sino('craneo'), NA, ND, 200, 'shepp', CT.spread(NA, 12)))
      CT.paintHU(this.cv, img, 200, 400, 40)
      this.read.textContent = 'FILTRADA · SOLO 12 VISTAS (RAYAS)'
    } else {
      CT.paintHU(this.cv, fbpImg('craneo'), 200, 120, 40)
      this.read.textContent = 'FBP · 180 VISTAS · VENTANA 120 / 40'
    }
  },
}

/* ======================= 24 · Kernels ======================= */
Scenes.s24 = {
  build(s) { this.soft = $(s, '.cv-soft'); this.sharp = $(s, '.cv-sharp') },
  enter() {
    const noisy = memo('noisy', () => CT.addNoise(sino('craneo'), 9))
    const soft = memo('k-soft', () => CT.fbp(noisy, NA, ND, 200, 'soft'))
    const sharp = memo('k-sharp', () => CT.fbp(noisy, NA, ND, 200, 'ramlak'))
    CT.paintHU(this.soft, soft, 200, 160, 40)
    CT.paintHU(this.sharp, sharp, 200, 160, 40)
  },
}

/* ======================= 27 · Escala HU ======================= */
const TISSUE = [
  ['Aire', -1000, -1000, 'Referencia inferior de la escala, por definición.'],
  ['Pulmón', -900, -500, 'Aire con un poco de tejido: muy negativo. Se estudia con ventana de pulmón.'],
  ['Grasa', -120, -60, 'El único tejido blando con HU negativo: marcador diagnóstico (lipomas, hígado graso).'],
  ['Agua', 0, 0, 'Referencia de la escala, por definición, a cualquier kV.'],
  ['LCR', 0, 15, 'Líquido cefalorraquídeo: casi agua.'],
  ['Sustancia blanca', 20, 30, 'Menos densa que la gris por su contenido de mielina (lípidos).'],
  ['Sustancia gris', 35, 45, 'La diferencia gris-blanca es de apenas ≈ 10–15 HU: exige ventana estrecha.'],
  ['Músculo', 35, 55, 'Tejido blando típico.'],
  ['Hígado', 50, 65, 'Sin contraste. Baja con la infiltración grasa.'],
  ['Hematoma agudo', 60, 80, 'La sangre coagulada es más densa que el encéfalo: por eso se ve blanca en la TC de urgencia.'],
  ['Contraste yodado', 100, 300, 'Z alto del yodo (53): sube mucho más a kV bajo.'],
  ['Hueso esponjoso', 300, 400, 'Trabecular: depende de la densidad mineral.'],
  ['Hueso cortical', 700, 1900, 'Muy positivo; se estudia con ventana ósea.'],
  ['Metal', 3000, 3000, 'Fuera de escala útil: satura y produce rayas.'],
]
// Escala por tramos: se expande el tramo de tejidos blandos
const HU_SEG = [[-1000, 960], [-100, 740], [100, 540], [1000, 420], [3000, 340]]
const huY = h => {
  for (let i = 0; i < HU_SEG.length - 1; i++) {
    const [a, ya] = HU_SEG[i], [b, yb] = HU_SEG[i + 1]
    if (h <= b) return ya + ((h - a) / (b - a)) * (yb - ya)
  }
  return 340
}
Scenes.s27 = {
  build(s) {
    const svg = $(s, 'svg.scene')
    const defs = el('defs', {}, svg)
    const lg = el('linearGradient', { id: 'hu-g', x1: 0, y1: 1, x2: 0, y2: 0 }, defs)
    ;[[-1000, 0], [-100, 0.3], [100, 0.55], [1000, 0.9], [3000, 1]].forEach(([h, g]) => {
      const v = Math.round(40 + 200 * g)
      el('stop', { offset: f1(((960 - huY(h)) / 620) * 100) + '%', 'stop-color': `rgb(${v},${v},${Math.min(255, v + 12)})` }, lg)
    })
    el('rect', { x: 380, y: 340, width: 26, height: 620, fill: 'url(#hu-g)', class: 'hu-bar' }, svg)
    ;[-1000, -500, -100, 0, 100, 500, 1000, 3000].forEach(h => {
      const y = huY(h)
      el('line', { x1: 360, y1: y, x2: 380, y2: y, class: 'tick' }, svg)
      txt(svg, 350, y + 6, (h > 0 ? '+' : '') + h, 'tick-l', { 'text-anchor': 'end' })
    })
    // Etiquetas repartidas sin solaparse
    const items = TISSUE.map((t, i) => ({ i, y: (huY(t[1]) + huY(t[2])) / 2 }))
    const sorted = [...items].sort((a, b) => b.y - a.y)
    // De abajo arriba sin solaparse; si la pila se sale por arriba, se empuja hacia abajo
    const gap = 44, top = 360, bot = 950
    sorted.forEach((it, k) => { it.ly = Math.min(it.y, bot, k ? sorted[k - 1].ly - gap : bot) })
    for (let k = sorted.length - 1; k >= 0; k--) sorted[k].ly = Math.max(sorted[k].ly, k === sorted.length - 1 ? top : sorted[k + 1].ly + gap)
    const det = $(s, '.hu-detail')
    const nodes = []
    const select = i => {
      const [n, a, b, p] = TISSUE[i]
      nodes.forEach((g, k) => g.classList.toggle('sel', k === i))
      $(det, '.dn').textContent = a === b ? (a > 0 ? '+' : '') + a : `${a > 0 ? '+' : ''}${a} … ${b > 0 ? '+' : ''}${b}`
      $(det, '.dh').textContent = n
      $(det, '.dr').textContent = 'UNIDADES HOUNSFIELD · ORIENTATIVO'
      $(det, '.dp').textContent = p
      det.classList.remove('swap'); void det.offsetWidth; det.classList.add('swap')
    }
    items.sort((a, b) => a.i - b.i).forEach(it => {
      const [n, a, b] = TISSUE[it.i]
      const g = el('g', { class: 'tis hit', tabindex: 0, role: 'button', 'aria-label': n }, svg)
      const y0 = huY(a), y1 = huY(b)
      const col = 430 + (it.i % 3) * 16
      if (a === b) el('circle', { cx: col, cy: y0, r: 5, class: 'tis-m' }, g)
      else el('line', { x1: col, y1: y0, x2: col, y2: y1, class: 'tis-m' }, g)
      el('path', { d: `M${col + 6} ${f1((y0 + y1) / 2)} C${col + 60} ${f1((y0 + y1) / 2)} 560 ${f1(it.ly)} 610 ${f1(it.ly)}`, class: 'tis-lead' }, g)
      el('rect', { x: 600, y: f1(it.ly - 20), width: 520, height: 40, class: 'hitbox' }, g)
      txt(g, 620, f1(it.ly + 8), n, 'tis-l')
      txt(g, 1100, f1(it.ly + 8), a === b ? String(a) : `${a} … ${b}`, 'tis-v', { 'text-anchor': 'end' })
      g.addEventListener('click', e => { e.stopPropagation(); select(it.i) })
      nodes.push(g)
    })
    select(3)
  },
}

/* ======================= 28 · Ventana y nivel ======================= */
const PRESETS = {
  torax: [['Mediastino', 350, 50], ['Pulmón', 1500, -600], ['Hueso', 1800, 400]],
  craneo: [['Cerebro', 80, 40], ['Subdural', 200, 75], ['Hueso', 2000, 500]],
}
Scenes.s28 = {
  build(s) {
    this.s = s
    this.cv = $(s, '.cv-win')
    this.ph = 'torax'
    this.w = $(s, '.w-in'); this.l = $(s, '.l-in')
    const bar = $(s, '.win-bar')
    const X = h => 870 + ((h + 1000) / 3000) * 900
    this.X = X
    el('line', { x1: 870, y1: 860, x2: 1770, y2: 860, class: 'axis' }, bar)
    ;[-1000, -500, 0, 500, 1000, 1500, 2000].forEach(h => {
      el('line', { x1: X(h), y1: 860, x2: X(h), y2: 870, class: 'tick' }, bar)
      txt(bar, X(h), 896, (h > 0 ? '+' : '') + h, 'tick-l sm', { 'text-anchor': 'middle' })
    })
    this.blk = el('rect', { y: 800, height: 50, class: 'wb-black' }, bar)
    this.ramp = el('rect', { y: 800, height: 50, fill: 'url(#wb-g)' }, bar)
    this.wht = el('rect', { y: 800, height: 50, class: 'wb-white' }, bar)
    const defs = el('defs', {}, bar)
    const lg = el('linearGradient', { id: 'wb-g' }, defs)
    el('stop', { offset: '0', 'stop-color': '#000' }, lg); el('stop', { offset: '1', 'stop-color': '#fff' }, lg)
    this.brk = el('path', { class: 'wb-brk' }, bar)
    this.wl = txt(bar, 870, 768, '', 'tick-s')
    const presets = $(s, '.presets')
    const setPresets = () => {
      presets.innerHTML = PRESETS[this.ph].map(([n, w, l]) => `<button data-w="${w}" data-l="${l}">${n}<small>${w} / ${l}</small></button>`).join('')
    }
    setPresets()
    presets.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return
      e.stopPropagation()
      this.animateTo(+b.dataset.w, +b.dataset.l)
    })
    s.querySelectorAll('.seg button').forEach(b => b.addEventListener('click', e => {
      e.stopPropagation()
      s.querySelectorAll('.seg button').forEach(x => x.classList.toggle('on', x === b))
      this.ph = b.dataset.ph
      setPresets()
      const [, w, l] = PRESETS[this.ph][0]
      this.w.value = w; this.l.value = l
      this.paint()
    }))
    ;[this.w, this.l].forEach(i => {
      i.addEventListener('input', () => this.paint())
      ;['click', 'pointerdown'].forEach(ev => i.addEventListener(ev, e => e.stopPropagation()))
    })
  },
  animateTo(w, l) {
    cancelAnimationFrame(this.raf)
    const w0 = +this.w.value, l0 = +this.l.value, t0 = performance.now(), dur = reduced ? 1 : 600
    const step = now => {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3)
      this.w.value = w0 + (w - w0) * e; this.l.value = l0 + (l - l0) * e
      this.paint()
      if (p < 1) this.raf = requestAnimationFrame(step)
    }
    this.raf = requestAnimationFrame(step)
  },
  enter() { this.paint() },
  leave() { cancelAnimationFrame(this.raf) },
  paint() {
    const W = +this.w.value, L = +this.l.value
    CT.paintHU(this.cv, fbpImg(this.ph), 200, W, L)
    this.s.querySelector('.w-out').textContent = Math.round(W)
    this.s.querySelector('.l-out').textContent = Math.round(L)
    const X = this.X, lo = Math.max(-1000, L - W / 2), hi = Math.min(2000, L + W / 2)
    this.blk.setAttribute('x', 870); this.blk.setAttribute('width', f1(Math.max(0, X(lo) - 870)))
    this.ramp.setAttribute('x', f1(X(lo))); this.ramp.setAttribute('width', f1(Math.max(1, X(hi) - X(lo))))
    this.wht.setAttribute('x', f1(X(hi))); this.wht.setAttribute('width', f1(Math.max(0, 1770 - X(hi))))
    this.brk.setAttribute('d', `M${f1(X(lo))} 790 v-10 H${f1(X(hi))} v10`)
    this.wl.setAttribute('x', f1((X(lo) + X(hi)) / 2))
    this.wl.setAttribute('text-anchor', 'middle')
    this.wl.textContent = `NEGRO < ${Math.round(L - W / 2)} HU · BLANCO > ${Math.round(L + W / 2)} HU`
  },
}
