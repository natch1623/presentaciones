/* =========================================================
   Ambiente vivo · estrellas → nebulosa → partículas → geometría
   Lenguaje abisal heredado de TECNOLOGÍA ELÉCTRICA, reescrito para la TC:
   los anillos del ancla son un gantry y cada bloque tiene su propio "modo".
     origin  violeta, deriva lenta             (I · generalidades)
     beam    hielo, rayos que salen del foco   (II · radiación emitida)
     detect  partículas sobre trazas de canal  (III · detección y escaneo)
     recon   líneas que cruzan el ancla a todos los ángulos (IV · reconstrucción)
     hu      vóxeles que titilan en rejilla    (V · Hounsfield)
   ========================================================= */
export function startAmbient(cv) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  const ctx = cv.getContext('2d')
  const neb = document.createElement('canvas')
  const nctx = neb.getContext('2d')

  const MOODS = {
    origin: { a: [165, 139, 255], b: [143, 227, 255], c: [91, 63, 214], mode: 'drift', speed: 1, glow: 0.24 },
    beam:   { a: [143, 227, 255], b: [201, 184, 255], c: [36, 72, 170], mode: 'beam', speed: 1.3, glow: 0.27 },
    detect: { a: [143, 227, 255], b: [165, 139, 255], c: [40, 60, 160], mode: 'circuit', speed: 1.2, glow: 0.25 },
    recon:  { a: [94, 240, 200], b: [143, 227, 255], c: [26, 90, 120], mode: 'radial', speed: 1, glow: 0.25 },
    hu:     { a: [236, 233, 247], b: [94, 240, 200], c: [60, 60, 110], mode: 'voxel', speed: 0.9, glow: 0.22 },
    calm:   { a: [201, 184, 255], b: [94, 240, 200], c: [70, 48, 160], mode: 'drift', speed: 0.6, glow: 0.2 },
  }
  let mood = MOODS.origin
  const pal = { a: [...mood.a], b: [...mood.b], c: [...mood.c], glow: mood.glow, speed: mood.speed }

  let W, H, dpr
  let stars = [], parts = [], bursts = [], rays = []
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
  const anchor = { x: 0, y: 0, tx: 0, ty: 0 }
  let anchorSet = false

  function resize() {
    dpr = Math.min(1.25, devicePixelRatio || 1)
    W = cv.width = Math.max(1, innerWidth * dpr)
    H = cv.height = Math.max(1, innerHeight * dpr)
    neb.width = Math.ceil(W / 8)
    neb.height = Math.ceil(H / 8)
    const n = Math.round((innerWidth * innerHeight) / 4200)
    stars = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: (Math.random() ** 3 * 1.5 + 0.3) * dpr,
      z: 0.15 + Math.random() * 0.85,
      a: Math.random() * Math.PI * 2, tw: 0.3 + Math.random() * 1.4,
      hue: Math.random() < 0.25 ? 1 : Math.random() < 0.3 ? 2 : 0,
    })).sort((a, b) => a.hue - b.hue)
    if (!anchorSet) { anchor.x = anchor.tx = W * 0.78; anchor.y = anchor.ty = H * 0.3 }
    if (reduced) draw(0)
  }

  const rgba = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`
  const lerp = (a, b, t) => a + (b - a) * t

  function spawn(fresh) {
    const m = mood.mode
    const p = { mode: m, life: 0, max: 400 + Math.random() * 500, x: Math.random() * W, y: Math.random() * H, vx: 0, vy: 0, s: (0.6 + Math.random() * 1.6) * dpr, trail: [] }
    if (m === 'drift' || m === 'beam' || m === 'radial') { p.vx = (Math.random() - 0.5) * 0.25 * dpr; p.vy = (Math.random() - 0.5) * 0.25 * dpr }
    if (m === 'circuit') {
      const g = 72 * dpr
      p.x = Math.round(p.x / g) * g; p.y = Math.round(p.y / g) * g
      const d = [[1, 0], [-1, 0], [0, 1], [0, -1]][(Math.random() * 4) | 0]
      p.vx = d[0] * 1.3 * dpr; p.vy = d[1] * 1.3 * dpr; p.g = g; p.max = 260 + Math.random() * 260
    }
    if (m === 'voxel') {
      const g = 36 * dpr
      p.x = Math.floor(p.x / g) * g; p.y = Math.floor(p.y / g) * g; p.g = g
      p.max = 120 + Math.random() * 260; p.v = Math.random()
    }
    if (!fresh && m === 'voxel') p.life = 0
    return p
  }
  const COUNT = 80

  function setMood(name) {
    const m = MOODS[name] || MOODS.origin
    if (m === mood) return
    const modeChanged = m.mode !== mood.mode
    mood = m
    if (modeChanged) parts.forEach(p => { p.max = Math.min(p.max, p.life + 50 + Math.random() * 60) })
  }

  function setAnchor(x, y) {
    anchor.tx = x * dpr; anchor.ty = y * dpr
    if (!anchorSet) { anchor.x = anchor.tx; anchor.y = anchor.ty; anchorSet = true }
  }

  function burst(x, y, c = [201, 184, 255], n = 46) {
    if (reduced) return
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2
      const v = (1 + Math.random() * 6) * dpr
      bursts.push({ x: x * dpr, y: y * dpr, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, c, s: (0.8 + Math.random() * 1.8) * dpr })
    }
  }

  addEventListener('mousemove', e => {
    mouse.tx = (e.clientX / innerWidth) * 2 - 1
    mouse.ty = (e.clientY / innerHeight) * 2 - 1
  })

  let frameN = 0, lastT = -1e9
  function draw(t) {
    if (!reduced && t - lastT < 15) { requestAnimationFrame(draw); return }
    lastT = t
    frameN++
    for (const k of ['a', 'b', 'c']) for (let i = 0; i < 3; i++) pal[k][i] = lerp(pal[k][i], mood[k][i], 0.02)
    pal.glow = lerp(pal.glow, mood.glow, 0.02)
    pal.speed = lerp(pal.speed, mood.speed, 0.02)
    mouse.x = lerp(mouse.x, mouse.tx, 0.04)
    mouse.y = lerp(mouse.y, mouse.ty, 0.04)
    anchor.x = lerp(anchor.x, anchor.tx, 0.03)
    anchor.y = lerp(anchor.y, anchor.ty, 0.03)

    ctx.globalCompositeOperation = 'source-over'

    // Nebulosa a baja resolución
    if (frameN % 2 === 1 || reduced) {
      const w = neb.width, h = neb.height, s = t * 0.00005
      nctx.fillStyle = '#07060f'
      nctx.fillRect(0, 0, w, h)
      const blob = (x, y, r, c, a) => {
        const g = nctx.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0, rgba(c, a)); g.addColorStop(1, rgba(c, 0))
        nctx.fillStyle = g; nctx.fillRect(0, 0, w, h)
      }
      const ax = anchor.x / 8, ay = anchor.y / 8
      blob(ax + Math.sin(s * 3) * w * 0.05, ay + Math.cos(s * 2) * h * 0.05, w * 0.5, pal.c, pal.glow)
      blob(w * (0.18 + Math.sin(s * 2.3) * 0.04), h * (0.82 + Math.cos(s * 1.7) * 0.04), w * 0.42, pal.a, 0.07)
      blob(w * (0.5 + Math.cos(s * 1.3) * 0.08), h * (0.5 + Math.sin(s * 1.1) * 0.06), w * 0.6, pal.b, 0.035)
    }
    ctx.imageSmoothingEnabled = true
    ctx.drawImage(neb, 0, 0, W, H)

    // Estrellas con parallax
    const px = mouse.x * 16 * dpr, py = mouse.y * 12 * dpr
    const cols = [[244, 241, 255], pal.a, pal.b]
    let hue = -1
    ctx.lineWidth = 0.6 * dpr
    for (const st of stars) {
      if (st.hue !== hue) { hue = st.hue; ctx.fillStyle = ctx.strokeStyle = rgba(cols[hue], 1) }
      if (!reduced) { st.x -= 0.04 * st.z * dpr * pal.speed; if (st.x < -5) st.x = W + 5 }
      const x = st.x - px * st.z, y = st.y - py * st.z
      const al = 0.3 + 0.7 * Math.abs(Math.sin(st.a + t * 0.001 * st.tw))
      ctx.globalAlpha = al * (0.4 + st.z * 0.6)
      if (st.r < 1.1 * dpr) ctx.fillRect(x - st.r, y - st.r, st.r * 2, st.r * 2)
      else { ctx.beginPath(); ctx.arc(x, y, st.r, 0, 6.283); ctx.fill() }
      if (st.r > 1.45 * dpr) {
        ctx.globalAlpha = al * 0.35
        ctx.beginPath()
        ctx.moveTo(x - st.r * 4, y); ctx.lineTo(x + st.r * 4, y)
        ctx.moveTo(x, y - st.r * 4); ctx.lineTo(x, y + st.r * 4)
        ctx.stroke()
      }
    }
    ctx.globalAlpha = 1

    // Geometría del ancla: un gantry que respira. Anillo de canales (marcas
    // cortas y largas, como un arco de detectores) y un abanico que gira.
    const ax = anchor.x - px * 0.4, ay = anchor.y - py * 0.4
    const br = 1 + Math.sin(t * 0.0006) * 0.018
    ctx.lineWidth = dpr
    ;[[190, 0.07, null], [300, 0.05, [2 * dpr, 12 * dpr]], [470, 0.045, null], [680, 0.03, [30 * dpr, 10 * dpr, 3 * dpr, 10 * dpr]]].forEach(([r, a, dash], i) => {
      ctx.save()
      ctx.translate(ax, ay)
      ctx.rotate(t * 0.00002 * (i % 2 ? -1 : 1) * (i + 1))
      ctx.setLineDash(dash || [])
      ctx.strokeStyle = rgba(pal.a, a)
      ctx.beginPath(); ctx.arc(0, 0, r * dpr * br, 0, 6.283); ctx.stroke()
      if (i === 2) {
        ctx.setLineDash([])
        for (let k = 0; k < 96; k++) {
          const an = (k / 96) * 6.283, r0 = r * dpr * br, r1 = r0 + (k % 8 ? 6 : 16) * dpr
          ctx.moveTo(Math.cos(an) * r0, Math.sin(an) * r0); ctx.lineTo(Math.cos(an) * r1, Math.sin(an) * r1)
        }
        ctx.stroke()
      }
      ctx.restore()
    })
    // Abanico tenue que gira con el "tubo" sobre el anillo de 470
    if (!reduced) {
      const ang = t * 0.00018
      const R = 470 * dpr * br
      const fx = ax + Math.cos(ang) * R, fy = ay + Math.sin(ang) * R
      const half = 0.42
      const g = ctx.createRadialGradient(fx, fy, 0, fx, fy, 2 * R)
      g.addColorStop(0, rgba(pal.b, 0.07)); g.addColorStop(1, rgba(pal.b, 0))
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.moveTo(fx, fy)
      ctx.arc(fx, fy, 2 * R, ang + Math.PI - half, ang + Math.PI + half)
      ctx.closePath(); ctx.fill()
      ctx.fillStyle = rgba([244, 241, 255], 0.5)
      ctx.beginPath(); ctx.arc(fx, fy, 2.2 * dpr, 0, 6.283); ctx.fill()
    }
    ctx.setLineDash([])
    ctx.strokeStyle = rgba(pal.a, 0.03)
    ctx.beginPath(); ctx.moveTo(0, ay); ctx.lineTo(W, ay); ctx.moveTo(ax, 0); ctx.lineTo(ax, H); ctx.stroke()

    if (reduced) return

    while (parts.length < COUNT) parts.push(spawn(frameN < 3))
    ctx.globalCompositeOperation = 'lighter'
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]
      p.life++
      const k = Math.sin(Math.PI * Math.min(1, p.life / p.max))
      const sp = pal.speed
      if (p.mode === 'drift' || p.mode === 'beam' || p.mode === 'radial') {
        p.x += p.vx * sp; p.y += p.vy * sp
        ctx.fillStyle = rgba(i % 3 ? pal.a : pal.b, 0.55 * k)
        ctx.beginPath(); ctx.arc(p.x, p.y, p.s, 0, 6.283); ctx.fill()
      } else if (p.mode === 'circuit') {
        p.trail.push(p.x, p.y); if (p.trail.length > 36) p.trail.splice(0, 2)
        p.x += p.vx * sp; p.y += p.vy * sp
        const g = p.g
        if (Math.abs(p.x / g - Math.round(p.x / g)) < 0.02 && Math.abs(p.y / g - Math.round(p.y / g)) < 0.02 && Math.random() < 0.35) {
          const v = Math.hypot(p.vx, p.vy)
          if (p.vx) { p.vy = (Math.random() < 0.5 ? -1 : 1) * v; p.vx = 0 } else { p.vx = (Math.random() < 0.5 ? -1 : 1) * v; p.vy = 0 }
        }
        ctx.strokeStyle = rgba(pal.a, 0.35 * k); ctx.lineWidth = 1.1 * dpr
        ctx.beginPath(); ctx.moveTo(p.trail[0] ?? p.x, p.trail[1] ?? p.y)
        for (let j = 2; j < p.trail.length; j += 2) ctx.lineTo(p.trail[j], p.trail[j + 1])
        ctx.lineTo(p.x, p.y); ctx.stroke()
        ctx.fillStyle = rgba(pal.b, 0.8 * k)
        ctx.fillRect(p.x - 1.5 * dpr, p.y - 1.5 * dpr, 3 * dpr, 3 * dpr)
      } else if (p.mode === 'voxel') {
        const g = p.g
        ctx.strokeStyle = rgba(p.v > 0.7 ? pal.b : pal.a, 0.16 * k)
        ctx.lineWidth = dpr
        ctx.strokeRect(p.x + 3 * dpr, p.y + 3 * dpr, g - 6 * dpr, g - 6 * dpr)
        ctx.fillStyle = rgba(p.v > 0.7 ? pal.b : pal.a, 0.05 * k * (0.4 + p.v))
        ctx.fillRect(p.x + 3 * dpr, p.y + 3 * dpr, g - 6 * dpr, g - 6 * dpr)
      }
      if (p.life >= p.max) parts.splice(i, 1)
    }

    // Rayos: en 'beam' salen del foco hacia fuera; en 'radial' cruzan el
    // ancla a un ángulo cualquiera y se apagan (una vista retroproyectada).
    if (mood.mode === 'beam' && Math.random() < 0.035) {
      const a = Math.random() * 6.283
      rays.push({ kind: 'beam', a, r: 60 * dpr, v: (14 + Math.random() * 14) * dpr, len: (160 + Math.random() * 260) * dpr, life: 1 })
    }
    if (mood.mode === 'radial' && Math.random() < 0.03) {
      rays.push({ kind: 'line', a: Math.random() * Math.PI, off: (Math.random() - 0.5) * 520 * dpr, life: 1 })
    }
    for (let i = rays.length - 1; i >= 0; i--) {
      const s = rays[i]
      if (s.kind === 'beam') {
        s.r += s.v
        const c = Math.cos(s.a), sn = Math.sin(s.a)
        const x1 = ax + c * s.r, y1 = ay + sn * s.r, x0 = ax + c * Math.max(0, s.r - s.len), y0 = ay + sn * Math.max(0, s.r - s.len)
        const g = ctx.createLinearGradient(x0, y0, x1, y1)
        g.addColorStop(0, rgba(pal.a, 0)); g.addColorStop(1, rgba(pal.a, 0.45))
        ctx.strokeStyle = g; ctx.lineWidth = 1.2 * dpr
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke()
        if (s.r - s.len > Math.hypot(W, H)) rays.splice(i, 1)
      } else {
        s.life -= 0.012
        const c = Math.cos(s.a), sn = Math.sin(s.a)
        const cx = ax - sn * s.off, cy = ay + c * s.off, L = Math.hypot(W, H)
        ctx.strokeStyle = rgba(pal.a, 0.16 * Math.sin(Math.PI * s.life))
        ctx.lineWidth = 1 * dpr
        ctx.beginPath(); ctx.moveTo(cx - c * L, cy - sn * L); ctx.lineTo(cx + c * L, cy + sn * L); ctx.stroke()
        if (s.life <= 0) rays.splice(i, 1)
      }
    }

    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i]
      b.x += b.vx; b.y += b.vy; b.vx *= 0.94; b.vy *= 0.94; b.life -= 0.018
      ctx.fillStyle = rgba(b.c, Math.max(0, b.life))
      ctx.beginPath(); ctx.arc(b.x, b.y, b.s, 0, 6.283); ctx.fill()
      if (b.life <= 0) bursts.splice(i, 1)
    }
    ctx.globalCompositeOperation = 'source-over'
    requestAnimationFrame(draw)
  }

  addEventListener('resize', resize)
  resize()
  if (!reduced) requestAnimationFrame(draw)

  return { setMood, setAnchor, burst }
}
