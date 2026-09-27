/* =========================================================
   Tomografía de verdad, en miniatura.
   Fantomas de elipses con proyecciones ANALÍTICAS (transformada de Radon
   exacta de una elipse), retroproyección simple y filtrada (Shepp-Logan),
   y ventana/nivel sobre números de Hounsfield. Nada de lo que se ve en las
   láminas de reconstrucción es una imagen pregrabada: se calcula aquí.
   ========================================================= */

// Cada elipse suma su valor a lo que ya hay (como en Shepp-Logan), en
// "HU + 1000": el aire vale 0, el agua 1000. Así la proyección es lineal
// y la imagen final se lee en HU restando 1000.
// [cx, cy, a, b, ángulo°, valor]   — coordenadas normalizadas en [-1, 1]
export const PHANTOMS = {
  craneo: [
    [0, 0, 0.69, 0.92, 0, 2000],          // hueso (≈ +1000 HU)
    [0, -0.0184, 0.6624, 0.874, 0, -970],  // encéfalo (≈ +30 HU)
    [0.22, 0, 0.11, 0.31, -18, -22],       // ventrículo derecho (LCR ≈ +8 HU)
    [-0.22, 0, 0.16, 0.41, 18, -22],       // ventrículo izquierdo
    [0, 0.35, 0.21, 0.25, 0, 12],          // sustancia gris profunda (+42)
    [0, 0.1, 0.046, 0.046, 0, 10],
    [0, -0.1, 0.046, 0.046, 0, 10],
    [-0.08, -0.605, 0.046, 0.023, 0, 14],
    [0.06, -0.605, 0.023, 0.046, 0, 14],
    [0.38, -0.48, 0.07, 0.05, 30, 40],     // hematoma (≈ +70 HU)
  ],
  torax: [
    [0, 0, 0.9, 0.62, 0, 900],             // grasa subcutánea (−100 HU)
    [0, 0, 0.84, 0.56, 0, 140],            // pared/músculo (+40)
    [-0.38, -0.02, 0.3, 0.42, 0, -890],    // pulmón derecho (−850)
    [0.4, 0.0, 0.28, 0.4, 0, -890],        // pulmón izquierdo
    [0.08, 0.12, 0.19, 0.2, -20, 10],      // corazón (+50)
    [-0.06, -0.14, 0.07, 0.07, 0, 140],    // aorta con contraste (+190)
    [0, 0.44, 0.1, 0.09, 0, 700],          // cuerpo vertebral (+740)
    [0, 0.31, 0.035, 0.035, 0, -730],      // canal medular (+10)
    [0, -0.47, 0.13, 0.03, 0, 800],        // esternón
    [-0.52, 0.2, 0.03, 0.022, 0, 30],      // vaso pulmonar
    [0.5, -0.18, 0.025, 0.02, 0, 30],
    [-0.3, -0.28, 0.022, 0.018, 0, 30],
    [0.34, 0.26, 0.05, 0.045, 0, 60],      // nódulo (≈ −790 → sólido tenue)
    [-0.8, 0.12, 0.04, 0.03, 20, 900],     // costillas
    [0.8, 0.12, 0.04, 0.03, -20, 900],
    [-0.62, -0.42, 0.04, 0.03, 40, 900],
    [0.62, -0.42, 0.04, 0.03, -40, 900],
  ],
}

const rad = d => (d * Math.PI) / 180

/** Imagen del fantoma en HU, N×N (fila 0 arriba). */
export function rasterize(ph, N) {
  const img = new Float32Array(N * N)
  for (let j = 0; j < N; j++) {
    const y = 1 - (2 * (j + 0.5)) / N
    for (let i = 0; i < N; i++) {
      const x = (2 * (i + 0.5)) / N - 1
      let v = 0
      for (const [cx, cy, a, b, ang, val] of ph) {
        const c = Math.cos(rad(ang)), s = Math.sin(rad(ang))
        const dx = x - cx, dy = y + cy // cy positivo = hacia abajo en pantalla
        const u = dx * c + dy * s, w = -dx * s + dy * c
        if ((u * u) / (a * a) + (w * w) / (b * b) <= 1) v += val
      }
      img[j * N + i] = v - 1000
    }
  }
  return img
}

/**
 * Sinograma analítico: nA vistas en [0, π), nD canales sobre [-√2, √2].
 * Para una elipse de semiejes A, B girada α, centrada en (x0, y0):
 *   a²(θ) = A² cos²(θ−α) + B² sin²(θ−α)
 *   p(t)  = 2·v·A·B·√(a² − τ²) / a²,   τ = t − (x0 cos θ + y0 sin θ)
 */
export function sinogram(ph, nA, nD) {
  const sino = new Float32Array(nA * nD)
  const tMax = Math.SQRT2
  for (let k = 0; k < nA; k++) {
    const th = (Math.PI * k) / nA
    const ct = Math.cos(th), st = Math.sin(th)
    for (const [cx, cy, A, B, ang, val] of ph) {
      const al = rad(ang) // mismo sentido que en rasterize (antihorario, y hacia arriba)
      const c2 = Math.cos(th - al) ** 2, s2 = Math.sin(th - al) ** 2
      const a2 = A * A * c2 + B * B * s2
      const off = cx * ct + -cy * st
      for (let d = 0; d < nD; d++) {
        const t = -tMax + (2 * tMax * (d + 0.5)) / nD
        const tau = t - off
        if (tau * tau < a2) sino[k * nD + d] += (2 * val * A * B * Math.sqrt(a2 - tau * tau)) / a2
      }
    }
  }
  return sino
}

/** Ruido gaussiano sobre las proyecciones (simula pocos fotones). */
export function addNoise(sino, sigma, seed = 7) {
  let s = seed >>> 0
  const r = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 }
  const out = new Float32Array(sino.length)
  for (let i = 0; i < sino.length; i++) {
    const g = Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(2 * Math.PI * r())
    out[i] = sino[i] + g * sigma
  }
  return out
}

/** Núcleo espacial de Shepp-Logan, muestreado a paso τ. */
export function kernel(nD, tau, kind = 'shepp') {
  const n = nD
  const h = new Float32Array(2 * n - 1)
  for (let i = -(n - 1); i <= n - 1; i++) {
    let v
    if (kind === 'ramlak') v = i === 0 ? 1 / (4 * tau * tau) : i % 2 ? -1 / (i * i * Math.PI * Math.PI * tau * tau) : 0
    else v = -2 / (Math.PI * Math.PI * tau * tau * (4 * i * i - 1))
    h[i + n - 1] = v
  }
  if (kind === 'soft') {
    // Suavizado: Shepp-Logan convolucionado con una ventana binomial ancha
    const w = [1, 6, 15, 20, 15, 6, 1].map(x => x / 64)
    const g = new Float32Array(h.length)
    for (let i = 0; i < h.length; i++) {
      let acc = 0
      for (let k = -3; k <= 3; k++) {
        const j = i + k
        if (j >= 0 && j < h.length) acc += h[j] * w[k + 3]
      }
      g[i] = acc
    }
    return g
  }
  return h
}

/** Filtra cada vista por convolución con el núcleo. */
export function filter(sino, nA, nD, kind = 'shepp') {
  const tau = (2 * Math.SQRT2) / nD
  const h = kernel(nD, tau, kind)
  const out = new Float32Array(sino.length)
  for (let k = 0; k < nA; k++) {
    const row = k * nD
    for (let d = 0; d < nD; d++) {
      let acc = 0
      for (let e = 0; e < nD; e++) acc += sino[row + e] * h[d - e + nD - 1]
      out[row + d] = acc * tau
    }
  }
  return out
}

/**
 * Retroproyección sobre N×N usando las vistas indicadas.
 * Devuelve la imagen cruda (sin normalizar) y deja al llamador la escala.
 */
export function backproject(sino, nA, nD, N, views) {
  const img = new Float32Array(N * N)
  const tMax = Math.SQRT2
  const dt = (2 * tMax) / nD
  for (const k of views) {
    const th = (Math.PI * k) / nA
    const ct = Math.cos(th), st = Math.sin(th)
    const row = k * nD
    for (let j = 0; j < N; j++) {
      const y = 1 - (2 * (j + 0.5)) / N
      for (let i = 0; i < N; i++) {
        const x = (2 * (i + 0.5)) / N - 1
        const t = x * ct + y * st
        const f = (t + tMax) / dt - 0.5
        const d0 = Math.floor(f)
        if (d0 < 0 || d0 >= nD - 1) continue
        const w = f - d0
        img[j * N + i] += sino[row + d0] * (1 - w) + sino[row + d0 + 1] * w
      }
    }
  }
  return img
}

/** Índices de n vistas repartidas uniformemente en 180°. */
export const spread = (nA, n) => Array.from({ length: n }, (_, i) => Math.floor((i * nA) / n))

/** FBP completa, escalada a HU. */
export function fbp(sino, nA, nD, N, kind = 'shepp', views = null) {
  const v = views || spread(nA, nA)
  const f = filter(sino, nA, nD, kind)
  const img = backproject(f, nA, nD, N, v)
  const k = Math.PI / v.length
  for (let i = 0; i < img.length; i++) img[i] = img[i] * k - 1000
  return img
}

/** Pinta HU en un canvas con ventana (W) y nivel (L). */
export function paintHU(canvas, img, N, W, L) {
  if (canvas.width !== N) { canvas.width = N; canvas.height = N }
  const ctx = canvas.getContext('2d')
  const id = ctx.createImageData(N, N)
  const lo = L - W / 2
  for (let p = 0; p < N * N; p++) {
    let g = ((img[p] - lo) / W) * 255
    g = g < 0 ? 0 : g > 255 ? 255 : g
    id.data[4 * p] = g; id.data[4 * p + 1] = g; id.data[4 * p + 2] = g; id.data[4 * p + 3] = 255
  }
  ctx.putImageData(id, 0, 0)
}

/** Pinta una imagen cualquiera autoescalada entre sus percentiles. */
export function paintAuto(canvas, img, w, h, tint = [236, 240, 255], lowQ = 0.01, highQ = 0.995) {
  if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h }
  const sorted = Float32Array.from(img).sort()
  const lo = sorted[Math.floor(lowQ * (sorted.length - 1))]
  const hi = sorted[Math.floor(highQ * (sorted.length - 1))] || lo + 1
  const ctx = canvas.getContext('2d')
  const id = ctx.createImageData(w, h)
  for (let p = 0; p < w * h; p++) {
    let g = (img[p] - lo) / (hi - lo || 1)
    g = g < 0 ? 0 : g > 1 ? 1 : g
    id.data[4 * p] = tint[0] * g; id.data[4 * p + 1] = tint[1] * g; id.data[4 * p + 2] = tint[2] * g; id.data[4 * p + 3] = 255
  }
  ctx.putImageData(id, 0, 0)
}
