/* =========================================================
   Motor de la presentación · EM III · Módulo II · Tomografía computarizada
   Navegación, estados internos, transiciones, cromo, índice y notas.
   Adaptado del motor de TECNOLOGÍA ELÉCTRICA (Módulo D · NFPA 70E).
   ========================================================= */
import 'katex/dist/katex.min.css'
import './styles.css'
import katex from 'katex'
import { startAmbient } from './ambient.js'
import { Scenes } from './scenes.js'

// Fórmulas: <span class="tex" data-tex="…"> (en línea) o <div class="tex d" …> (bloque)
document.querySelectorAll('.tex[data-tex]').forEach(el => {
  katex.render(el.dataset.tex, el, { displayMode: el.classList.contains('d'), throwOnError: false, output: 'html' })
})

const Ambient = startAmbient(document.getElementById('sky'))
const stage = document.getElementById('stage')
const slides = [...stage.querySelectorAll('.slide')]
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const scene = s => Scenes[s.id] || {}

let idx = 0
let scale = 0.5

/* ---------- Escala 16:9 ---------- */
function fit() {
  scale = Math.min(innerWidth / 1920, innerHeight / 1080)
  stage.style.setProperty('--s', scale)
  anchorTo(slides[idx])
}
function toWin(x, y) {
  const r = stage.getBoundingClientRect()
  return [r.left + x * scale, r.top + y * scale]
}
function anchorTo(s) {
  if (!s) return
  const [x, y] = (s.dataset.anchor || '1500 300').split(' ').map(Number)
  Ambient.setAnchor(...toWin(x, y))
}
addEventListener('resize', fit)

/* ---------- API para las escenas ---------- */
const api = {
  set: (s, n) => setState(s, n),
  burst: (x, y, c, n) => Ambient.burst(...toWin(x, y), c, n),
  active: s => s.classList.contains('is-active'),
}

/* ---------- Construcción de escenas ---------- */
slides.forEach(s => { s.dataset.s = 0; try { scene(s).build?.(s, api) } catch (err) { console.error(s.id, err) } })
slides.forEach(slide => {
  slide.querySelectorAll('.rv').forEach((el, i) => el.style.setProperty('--d', `${180 + i * 70}ms`))
  slide.querySelectorAll('h1 .w > span').forEach((el, i) => el.style.setProperty('--d', `${250 + i * 80}ms`))
})

/* ---------- Estados internos ---------- */
const nStates = s => scene(s).states ?? (+s.dataset.states || 0)
function setState(s, n, { from = null } = {}) {
  n = Math.max(0, Math.min(nStates(s), n))
  const prev = from ?? (+s.dataset.s || 0)
  s.dataset.s = n
  s.querySelectorAll('[data-at]').forEach(e => e.classList.toggle('on', n >= +e.dataset.at))
  s.querySelectorAll('[data-only]').forEach(e => e.classList.toggle('on', ('' + e.dataset.only).split(' ').includes(String(n))))
  if (s.classList.contains('is-active')) scene(s).state?.(s, n, prev)
  updateDots()
}

/* ---------- Navegación ---------- */
const fxG = document.getElementById('fx-g')
const cRef = document.getElementById('c-ref')
const cBlock = document.getElementById('c-block')
const cCount = document.getElementById('c-count')
const cProg = document.getElementById('c-prog')
const cDots = document.getElementById('c-dots')
let leaving = null

function go(n, { back = false, state = null } = {}) {
  n = Math.max(0, Math.min(slides.length - 1, n))
  const prev = slides[idx]
  const next = slides[n]
  if (n === idx && next.classList.contains('is-active')) return
  back = back || n < idx

  if (leaving) { leaving.getAnimations().forEach(a => a.cancel()); leaving.classList.remove('is-leaving'); leaving.style.zIndex = '' }
  if (prev && prev !== next) {
    scene(prev).leave?.(prev)
    prev.classList.remove('is-active')
    prev.classList.add('is-leaving')
    prev.style.zIndex = 2
    leaving = prev
  }

  next.getAnimations().forEach(a => a.cancel())
  next.classList.remove('is-active')
  void next.offsetWidth
  next.classList.add('is-active')
  next.style.zIndex = 3
  idx = n

  stage.dataset.mood = next.dataset.mood || 'origin'
  Ambient.setMood(next.dataset.mood || 'origin')
  anchorTo(next)

  scene(next).enter?.(next)
  setState(next, state ?? (back ? nStates(next) : 0), { from: -1 })
  transition(prev !== next ? prev : null, next, back)
  updateChrome()
}

function next() {
  const s = slides[idx]
  if (+s.dataset.s < nStates(s)) { setState(s, +s.dataset.s + 1); return }
  if (idx < slides.length - 1) go(idx + 1)
}
function prev() {
  const s = slides[idx]
  if (+s.dataset.s > 0) { setState(s, +s.dataset.s - 1); return }
  if (idx > 0) go(idx - 1, { back: true })
}

/* ---------- Transiciones ----------
   slash   corte de espada: inicio de bloque
   rift    grieta diagonal
   sweep   barrido vertical
   rise    emerge desde abajo
   expand  se abre desde un punto del contenido (data-origin)
   gantry  el corte gira alrededor del isocentro como el tubo (data-origin)
   scan    reconstrucción por franjas (bloque de reconstrucción)
   dissolve fundido sereno */
const EASE = 'cubic-bezier(.77,0,.175,1)'
const EXPO = 'cubic-bezier(.16,1,.3,1)'
const W = 1920, H = 1080
const pt = s => (s || '960 540').split(' ').map(Number)
const mix = (a, b, p) => a + (b - a) * p
const poly = points => `polygon(${points.map(([x, y]) => `${x.toFixed(1)}px ${y.toFixed(1)}px`).join(',')})`
const line = points => 'M' + points.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L')
const sample = (n, f) => Array.from({ length: n + 1 }, (_, i) => f(i / n))
const REWIND = new Set(['slash', 'rift', 'sweep', 'rise'])
const SLOW = 1.25

const TX = {
  rift: back => ({
    dur: 950, easing: EASE, dir: 'v',
    frames: sample(1, p => {
      const xt = mix(-600, 2520, back ? 1 - p : p), xb = xt + 384
      const left = poly([[-800, 0], [xt, 0], [xb, H], [-800, H]])
      const right = poly([[xt, 0], [3000, 0], [3000, H], [xb, H]])
      return { next: back ? right : left, prev: back ? left : right, edge: line([[xt - 14, -40], [xb + 14, H + 40]]) }
    }),
  }),
  sweep: back => ({
    dur: 1100, easing: EASE, dir: 'v',
    frames: sample(1, p => {
      const x = W * (back ? 1 - p : p)
      const left = `inset(0 ${W - x}px 0 0)`, right = `inset(0 0 0 ${x}px)`
      return { next: back ? right : left, prev: back ? left : right, edge: line([[x, -40], [x, H + 40]]) }
    }),
  }),
  rise: back => ({
    dur: 1100, easing: EXPO, dir: 'h',
    frames: sample(1, p => {
      const y = H * (back ? p : 1 - p)
      const top = `inset(0 0 ${H - y}px 0)`, bottom = `inset(${y}px 0 0 0)`
      return { next: back ? top : bottom, prev: back ? bottom : top, edge: line([[-40, y], [W + 40, y]]) }
    }),
  }),
  expand: (back, o) => ({
    dur: 1300, easing: 'cubic-bezier(.7,0,.2,1)', dir: 'c',
    frames: sample(1, p => {
      const r = 2300 * p
      return { next: `circle(${r}px at ${o[0]}px ${o[1]}px)`, edge: `M${o[0] - r} ${o[1]} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0` }
    }),
  }),
  // Un radio que barre 360° desde el isocentro: la nueva lámina entra por el
  // sector ya "irradiado", igual que un giro completo del tubo.
  gantry: (back, o) => ({
    dur: 1500, easing: 'cubic-bezier(.45,0,.25,1)', dir: 'c',
    frames: sample(36, p => {
      const a0 = -Math.PI / 2, a1 = a0 + p * Math.PI * 2, R = 2600
      const arc = [[o[0], o[1]]]
      const steps = Math.max(2, Math.ceil(p * 36))
      for (let k = 0; k <= steps; k++) {
        const a = a0 + ((a1 - a0) * k) / steps
        arc.push([o[0] + Math.cos(a) * R, o[1] + Math.sin(a) * R])
      }
      // Todos los cuadros con la misma cantidad de vértices para que interpolen
      while (arc.length < 39) arc.push(arc[arc.length - 1])
      return { next: poly(arc), edge: line([[o[0], o[1]], [o[0] + Math.cos(a1) * R, o[1] + Math.sin(a1) * R]]) }
    }),
  }),
  dissolve: back => ({
    raw: [{ opacity: 0, filter: 'blur(14px)', transform: 'scale(1.03)' }, { opacity: 1, filter: 'blur(0px)', transform: 'none' }],
    dur: back ? 800 : 1100, easing: EXPO,
  }),
  scan: () => bands(14),
}
TX.slash = TX.rift

// Franjas: cada una avanza con su propio retraso; su frente es el borde de luz
function bands(n) {
  const h = H / n
  return {
    dur: 1250, easing: 'linear', dir: 'v',
    frames: sample(12, p => {
      const pts = [], edge = []
      for (let k = 0; k < n; k++) {
        const kk = (k * 5) % n
        const q = Math.max(0, Math.min(1, p * 1.5 - kk * (0.5 / n)))
        const w = W * (1 - Math.pow(1 - q, 3))
        const y0 = k * h, y1 = (k + 1) * h + 0.5
        const rtl = k % 2
        const x0 = rtl ? W - w : 0
        pts.push([x0, y0], [x0 + w, y0], [x0 + w, y1], [x0, y1])
        const fx = q <= 0 ? (rtl ? W + 40 : -40) : q >= 1 ? (rtl ? -40 : W + 40) : rtl ? W - w : w
        edge.push(line([[fx, y0], [fx, y1]]))
      }
      return { next: poly(pts), edge: edge.join(' ') }
    }),
  }
}

function transition(prevEl, nextEl, back) {
  const kind = back ? (REWIND.has(prevEl?.dataset.tx) ? prevEl.dataset.tx : 'dissolve') : nextEl.dataset.tx || 'dissolve'
  if (reduced || !prevEl) {
    nextEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: reduced ? 400 : 900, easing: 'ease-out' })
    if (prevEl) leave(prevEl, 400, false)
    return
  }
  const origin = pt(nextEl.dataset.origin)
  const t = (TX[kind] || TX.dissolve)(back, origin)
  const opt = { duration: t.dur * SLOW, easing: t.easing, delay: (t.delay || 0) * SLOW }

  if (t.frames?.[0].prev) {
    prevEl.animate(t.frames.map(f => ({ clipPath: f.prev })), { ...opt, fill: 'forwards' })
    leave(prevEl, opt.duration + opt.delay, true)
  } else {
    leave(prevEl, (back ? 500 : 650) * SLOW, false)
  }

  nextEl.animate(t.raw || t.frames.map(f => ({ clipPath: f.next })), { ...opt, fill: 'backwards' })
  if (t.frames?.[0].edge != null) edgeLight(t.frames.map(f => f.edge), opt, t.dir, kind === 'slash')
  if (kind === 'expand' || kind === 'gantry') Ambient.burst(...toWin(...origin), [143, 227, 255], 36)
}

function leave(el, dur, custom) {
  if (!custom) el.animate([{ opacity: 1, filter: 'blur(0px)', transform: 'none' }, { opacity: 0, filter: 'blur(8px)', transform: 'scale(.975)' }], { duration: dur, easing: EXPO, fill: 'forwards' })
  setTimeout(() => {
    if (el.classList.contains('is-active')) return
    el.getAnimations().forEach(a => a.cancel())
    el.classList.remove('is-leaving')
    el.style.zIndex = ''
    if (leaving === el) leaving = null
  }, dur + 60)
}

const canMorphD = window.CSS?.supports?.('d', 'path("M0 0")')
function edgeLight(ds, opt, dir, blade) {
  fxG.replaceChildren()
  if (!canMorphD) return
  fxG.setAttribute('class', blade ? 'blade' : '')
  const frames = ds.map(d => ({ d: `path("${d}")` }))
  ;['fx-halo', 'fx-glow', 'fx-core'].forEach(c => {
    const p = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    p.setAttribute('class', `${c} ${dir}`)
    p.setAttribute('d', ds[0])
    fxG.appendChild(p)
    p.animate(frames, { ...opt, fill: 'both' })
  })
  fxG.animate([{ opacity: 0 }, { opacity: 1, offset: 0.1 }, { opacity: 1, offset: 0.72 }, { opacity: 0 }], { ...opt, easing: 'linear', fill: 'both' })
}

/* ---------- Cromo ---------- */
function updateChrome() {
  const s = slides[idx]
  stage.classList.toggle('is-hero', idx === 0)
  cRef.textContent = s.dataset.ref || ''
  cBlock.innerHTML = s.dataset.block ? `<b>${s.dataset.block.split('·')[0].trim()}</b> · ${(s.dataset.block.split('·')[1] || '').trim()}` : ''
  ;[cRef, cBlock, cCount].forEach((el, i) => el.animate([{ opacity: 0, transform: i ? 'translateY(10px)' : 'translateX(12px)' }, { opacity: 1, transform: 'none' }],
    { duration: 700, delay: i * 70, easing: EXPO, fill: 'backwards' }))
  cCount.innerHTML = `<b>${String(idx + 1).padStart(2, '0')}</b> / ${String(slides.length).padStart(2, '0')}`
  cProg.parentElement.style.setProperty('--p', (idx + 1) / slides.length)
  history.replaceState(null, '', `${location.search}#${idx + 1}`)
  updateNotes()
  renderMenu()
  updateDots()
}
function updateDots() {
  const s = slides[idx]
  const n = nStates(s)
  const cur = +s.dataset.s
  if (cDots.dataset.k !== String(idx)) {
    cDots.dataset.k = idx
    cDots.innerHTML = n ? Array.from({ length: n + 1 }, (_, i) => `<i style="--i:${i}"></i>`).join('') : ''
  }
  ;[...cDots.children].forEach((d, i) => { d.classList.toggle('on', i <= cur); d.classList.toggle('cur', i === cur) })
}

;(() => {
  const svg = document.querySelector('.chrome .ruler')
  let d = ''
  for (let x = 150; x <= 1770; x += 30) d += `M${x} 1080 v${x % 150 === 0 ? -10 : -5}`
  for (let y = 150; y <= 930; y += 30) d += `M1920 ${y} h${y % 150 === 0 ? -10 : -5}`
  svg.innerHTML = `<path d="${d}"/>`
})()

/* ---------- Notas ---------- */
const drawer = document.getElementById('drawer')
function updateNotes() {
  const s = slides[idx]
  const n = s.querySelector('aside.notes')
  document.getElementById('d-meta').innerHTML = `<span>${String(idx + 1).padStart(2, '0')} · ${s.dataset.title}</span><span>${s.dataset.ref || ''}</span>`
  document.getElementById('d-txt').innerHTML = n ? n.innerHTML : '<p>Sin notas.</p>'
}

/* ---------- Índice ---------- */
const menu = document.getElementById('menu')
const menuList = document.getElementById('menu-list')
function renderMenu() {
  menuList.innerHTML = slides.map((s, i) =>
    `<li style="--i:${i}"><button data-i="${i}" class="${i === idx ? 'cur' : ''}"><span class="n">${String(i + 1).padStart(2, '0')}</span><span>${s.dataset.title}</span><span class="w">${(s.dataset.block || '').split('·')[0].trim()}</span></button></li>`
  ).join('')
}
menuList.addEventListener('click', e => {
  const b = e.target.closest('button')
  if (!b) return
  closeOverlays()
  go(+b.dataset.i)
})
const anyOpen = () => document.querySelector('.overlay.open') || drawer.classList.contains('open')
function closeOverlays() { document.querySelectorAll('.overlay.open').forEach(o => o.classList.remove('open')); drawer.classList.remove('open') }
document.querySelectorAll('.overlay').forEach(o => o.addEventListener('click', e => { if (e.target === o) o.classList.remove('open') }))

/* ---------- Teclado, clic y gestos ---------- */
addEventListener('keydown', e => {
  if (e.altKey || e.ctrlKey || e.metaKey) return
  if (e.target.closest?.('input, textarea, select')) {
    if (e.key !== 'Escape') return
  }
  const k = e.key
  if (k === 'Escape') {
    // Primero cierra lo que esté abierto; si no hay nada y no estamos en
    // pantalla completa, vuelve al índice del curso (dos niveles arriba).
    if (anyOpen()) { closeOverlays(); return }
    if (!document.fullscreenElement) location.href = '../../'
    return
  }
  if (['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter'].includes(k)) {
    if (k === 'Enter' && document.activeElement?.closest?.('.hit, button')) { document.activeElement.dispatchEvent(new MouseEvent('click', { bubbles: true })); e.preventDefault(); return }
    e.preventDefault(); next()
  }
  else if (['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace'].includes(k)) { e.preventDefault(); prev() }
  else if (k === 'Home') go(0)
  else if (k === 'End') go(slides.length - 1)
  else if (k === 'm' || k === 'M') { document.getElementById('help').classList.remove('open'); menu.classList.toggle('open') }
  else if (k === '?' || k === 'h' || k === 'H') { menu.classList.remove('open'); document.getElementById('help').classList.toggle('open') }
  else if (k === 'n' || k === 'N') drawer.classList.toggle('open')
  else if (k === 'f' || k === 'F') toggleFullscreen()
})

stage.addEventListener('click', e => {
  if (e.target.closest('button, a, input, label, .hit, .ctl, canvas')) return
  const r = stage.getBoundingClientRect()
  if (e.clientX - r.left < r.width * 0.25) prev(); else next()
})

let tx0 = null
addEventListener('touchstart', e => { tx0 = e.touches[0].clientX }, { passive: true })
addEventListener('touchend', e => {
  if (tx0 === null) return
  const dx = e.changedTouches[0].clientX - tx0
  if (Math.abs(dx) > 50 && !e.target.closest?.('input')) (dx < 0 ? next : prev)()
  tx0 = null
})

function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {})
  else document.exitFullscreen?.().catch(() => {})
}
document.getElementById('c-fs')?.addEventListener('click', e => { e.stopPropagation(); toggleFullscreen() })

const hint = document.getElementById('hint')
setTimeout(() => { hint.style.opacity = 0 }, 6000)

/* ---------- Inicio ---------- */
fit()
// #12 abre la escena 12; #12.2 la abre directamente en su estado 2
const [start, st0] = location.hash.slice(1).split('.').map(v => parseInt(v, 10))
const first = Number.isFinite(start) ? Math.max(0, Math.min(slides.length - 1, start - 1)) : 0
idx = first
go(first, { state: Number.isFinite(st0) ? st0 : null })
addEventListener('hashchange', () => {
  const h = parseInt(location.hash.slice(1), 10)
  if (Number.isFinite(h) && h - 1 !== idx) go(h - 1)
})
