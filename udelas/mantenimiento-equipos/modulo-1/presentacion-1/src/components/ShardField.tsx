import { useEffect, useRef } from 'react'

/**
 * ShardField — el fondo vivo del deck.
 *
 * Esquirlas de hielo a la deriva en el vacío, con tres planos de
 * profundidad: las lejanas son pequeñas, opacas y lentas; las cercanas
 * son grandes, brillantes y giran más rápido. Cada cierto tiempo una
 * grieta se abre y se cierra en algún punto del lienzo.
 *
 * Todo se dibuja en un canvas y no en el DOM: 60 esquirlas como nodos
 * con filtros CSS costarían cuadros en cada transición.
 */

interface Shard {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rot: number
  vrot: number
  /** 0 = fondo lejano, 1 = primer plano */
  depth: number
  hue: 'ice' | 'frost' | 'rift'
  /** vértices del polígono, en radios relativos */
  verts: { a: number; r: number }[]
}

interface Rift {
  x: number
  y: number
  h: number
  /** 0 → 1 → 0 a lo largo de la vida de la grieta */
  t: number
  life: number
}

const TINTS: Record<Shard['hue'], [number, number, number]> = {
  ice: [234, 246, 255],
  frost: [143, 220, 255],
  rift: [125, 99, 255],
}

/** Polígono irregular de 4–6 lados: un fragmento de cristal, no una estrella. */
function makeVerts(sides: number): { a: number; r: number }[] {
  const out: { a: number; r: number }[] = []
  for (let i = 0; i < sides; i++) {
    out.push({
      a: (i / sides) * Math.PI * 2 + (Math.random() - 0.5) * 0.5,
      r: 0.55 + Math.random() * 0.65,
    })
  }
  return out
}

export default function ShardField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let raf = 0
    let W = 0
    let H = 0
    let dpr = 1

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width = Math.floor(W * dpr)
      canvas.height = Math.floor(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const shards: Shard[] = []
    const COUNT = 58
    for (let i = 0; i < COUNT; i++) {
      const depth = Math.random()
      shards.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * (0.08 + depth * 0.24),
        vy: -(0.04 + depth * 0.16) - Math.random() * 0.05,
        size: 2.5 + depth * depth * 16,
        rot: Math.random() * Math.PI * 2,
        vrot: (Math.random() - 0.5) * (0.0015 + depth * 0.005),
        depth,
        hue: Math.random() < 0.12 ? 'rift' : Math.random() < 0.45 ? 'ice' : 'frost',
        verts: makeVerts(4 + Math.floor(Math.random() * 3)),
      })
    }

    const rifts: Rift[] = []
    let nextRift = 90

    const drawShard = (s: Shard) => {
      const [r, g, b] = TINTS[s.hue]
      const alpha = 0.06 + s.depth * 0.34

      ctx.save()
      ctx.translate(s.x, s.y)
      ctx.rotate(s.rot)

      ctx.beginPath()
      s.verts.forEach((v, i) => {
        const px = Math.cos(v.a) * v.r * s.size
        const py = Math.sin(v.a) * v.r * s.size * 0.82
        if (i === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      })
      ctx.closePath()

      // Relleno: el cristal es casi transparente en el centro…
      const grad = ctx.createLinearGradient(-s.size, -s.size, s.size, s.size)
      grad.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.85})`)
      grad.addColorStop(0.5, `rgba(${r},${g},${b},${alpha * 0.18})`)
      grad.addColorStop(1, `rgba(${r},${g},${b},${alpha * 0.6})`)
      ctx.fillStyle = grad
      ctx.fill()

      // …y sólo el filo brilla.
      ctx.strokeStyle = `rgba(${r},${g},${b},${Math.min(alpha * 1.9, 0.75)})`
      ctx.lineWidth = 0.5 + s.depth * 0.7
      if (s.depth > 0.6) {
        ctx.shadowColor = `rgba(${r},${g},${b},0.55)`
        ctx.shadowBlur = 8 * s.depth
      }
      ctx.stroke()

      ctx.restore()
    }

    const drawRift = (rf: Rift) => {
      // Envolvente suave: abre rápido, sostiene, cierra.
      const e = Math.sin(Math.min(rf.t, 1) * Math.PI)
      if (e <= 0) return
      const h = rf.h * e
      const w = 1.4 + e * 1.2

      ctx.save()
      ctx.globalCompositeOperation = 'lighter'

      const glow = ctx.createRadialGradient(rf.x, rf.y, 0, rf.x, rf.y, h * 0.85)
      glow.addColorStop(0, `rgba(143,220,255,${0.20 * e})`)
      glow.addColorStop(0.45, `rgba(125,99,255,${0.10 * e})`)
      glow.addColorStop(1, 'rgba(125,99,255,0)')
      ctx.fillStyle = glow
      ctx.beginPath()
      ctx.arc(rf.x, rf.y, h * 0.85, 0, Math.PI * 2)
      ctx.fill()

      const core = ctx.createLinearGradient(rf.x, rf.y - h / 2, rf.x, rf.y + h / 2)
      core.addColorStop(0, 'rgba(234,246,255,0)')
      core.addColorStop(0.5, `rgba(255,255,255,${0.85 * e})`)
      core.addColorStop(1, 'rgba(234,246,255,0)')
      ctx.fillStyle = core
      ctx.fillRect(rf.x - w / 2, rf.y - h / 2, w, h)

      ctx.restore()
    }

    const tick = () => {
      ctx.clearRect(0, 0, W, H)

      for (const s of shards) {
        s.x += s.vx
        s.y += s.vy
        s.rot += s.vrot

        const m = s.size * 2
        if (s.x < -m) s.x = W + m
        if (s.x > W + m) s.x = -m
        if (s.y < -m) s.y = H + m
        if (s.y > H + m) s.y = -m

        drawShard(s)
      }

      // Grietas ocasionales: una cada ~2,5–5 s, nunca dos en el mismo sitio.
      if (--nextRift <= 0) {
        rifts.push({
          x: 60 + Math.random() * Math.max(W - 120, 1),
          y: 60 + Math.random() * Math.max(H - 120, 1),
          h: 90 + Math.random() * 210,
          t: 0,
          life: 55 + Math.random() * 45,
        })
        nextRift = 150 + Math.floor(Math.random() * 150)
      }
      for (let i = rifts.length - 1; i >= 0; i--) {
        rifts[i].t += 1 / rifts[i].life
        drawRift(rifts[i])
        if (rifts[i].t >= 1) rifts.splice(i, 1)
      }

      raf = requestAnimationFrame(tick)
    }

    if (reduced) {
      // Sin movimiento: un solo cuadro estático, que el campo igual aporta textura.
      for (const s of shards) drawShard(s)
    } else {
      tick()
    }

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
