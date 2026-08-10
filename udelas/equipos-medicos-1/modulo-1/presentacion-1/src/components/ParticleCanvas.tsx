import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  alphaDir: number
  color: string
  type: 'dot' | 'cross' | 'diamond'
}

const COLORS = [
  'rgba(0,212,255,',
  'rgba(56,189,248,',
  'rgba(109,40,217,',
  'rgba(37,99,235,',
  'rgba(125,211,252,',
]

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    let W = 0, H = 0
    const particles: Particle[] = []

    const resize = () => {
      W = canvas.width = canvas.offsetWidth
      H = canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Spawn particles
    const count = 80
    const types: Particle['type'][] = ['dot', 'dot', 'dot', 'cross', 'diamond']
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3 - 0.05,
        size: Math.random() * 2.5 + 0.5,
        alpha: Math.random() * 0.6 + 0.1,
        alphaDir: Math.random() > 0.5 ? 1 : -1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        type: types[Math.floor(Math.random() * types.length)],
      })
    }

    const drawParticle = (p: Particle) => {
      ctx.save()
      ctx.globalAlpha = p.alpha
      const col = `${p.color}${p.alpha})`
      ctx.fillStyle = col
      ctx.strokeStyle = col

      if (p.type === 'dot') {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()
      } else if (p.type === 'cross') {
        const s = p.size * 2.5
        ctx.lineWidth = 0.8
        ctx.beginPath()
        ctx.moveTo(p.x - s, p.y)
        ctx.lineTo(p.x + s, p.y)
        ctx.moveTo(p.x, p.y - s)
        ctx.lineTo(p.x, p.y + s)
        ctx.stroke()
      } else {
        const s = p.size * 2
        ctx.beginPath()
        ctx.moveTo(p.x, p.y - s)
        ctx.lineTo(p.x + s, p.y)
        ctx.lineTo(p.x, p.y + s)
        ctx.lineTo(p.x - s, p.y)
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()
    }

    // Connection lines
    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.12
            ctx.save()
            ctx.strokeStyle = `rgba(0,212,255,${alpha})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
            ctx.restore()
          }
        }
      }
    }

    const tick = () => {
      ctx.clearRect(0, 0, W, H)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy

        // Wrap
        if (p.x < -10) p.x = W + 10
        if (p.x > W + 10) p.x = -10
        if (p.y < -10) p.y = H + 10
        if (p.y > H + 10) p.y = -10

        // Pulse alpha
        p.alpha += p.alphaDir * 0.003
        if (p.alpha > 0.7 || p.alpha < 0.05) p.alphaDir *= -1

        drawParticle(p)
      }
      drawConnections()
      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
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
