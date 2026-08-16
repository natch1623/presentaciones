import { useState, useEffect, useCallback, useRef } from 'react'
import { slides } from './slides'
import CustomSlide from './slides/CustomSlide'
import ParticleCanvas from './components/ParticleCanvas'
import { EditorProvider, useDeck } from './editor/DeckContext'
import EditableSlide from './editor/EditableSlide'
import EditorPanel from './editor/EditorPanel'

type Direction = 'forward' | 'back'

const TRANSITION_MS = 380

// Escenario de diseño fijo: el deck entero se compone contra esta resolución
// y luego se escala uniformemente para llenar el viewport (incluida la
// pantalla completa real en monitores grandes), así nada se ve diminuto con
// márgenes enormes. Misma técnica que el modo presentador de PowerPoint.
//
// 1440×810 es 16:9 EXACTO — que es la proporción de todo proyector y todo
// televisor de salón. Con el 1280×800 anterior (16:10) la lámina se escalaba
// por el alto y dejaba una franja negra a cada lado en pantalla completa.
// A 1920×1080 esto escala ×1.333 y llena el panel sin recorte.
const CANVAS_W = 1440
const CANVAS_H = 810

// Identifica el deck en el almacenamiento del navegador. Si se clona esta
// presentación para otro módulo, cambiar este id evita que las dos compartan
// (y se pisen) las mismas ediciones.
const DECK_ID = 'udelas-em1-m1-p1'

export default function App() {
  return (
    <EditorProvider
      deckId={DECK_ID}
      baseSlides={slides}
      renderCustom={data => <CustomSlide data={data} />}
    >
      <Deck />
    </EditorProvider>
  )
}

function Deck() {
  const { visibleSlides, renderSlide, editing, nonce } = useDeck()

  const [current, setCurrent] = useState(0)
  const [displayIndex, setDisplayIndex] = useState(0)
  const [outClass, setOutClass] = useState('')
  const [inClass, setInClass] = useState('')
  const [scanning, setScanning] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hoveredDot, setHoveredDot] = useState<number | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [scale, setScale] = useState(1)
  const lockRef = useRef(false)
  const stageRef = useRef<HTMLDivElement>(null)
  // Qué diapositiva queremos tener en pantalla, por clave y no por posición:
  // reordenar u ocultar cambia los índices bajo los pies del presentador.
  const anchorRef = useRef<string | null>(null)

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      stageRef.current?.requestFullscreen().catch(() => {})
    } else {
      document.exitFullscreen().catch(() => {})
    }
  }, [])

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  useEffect(() => {
    const updateScale = () => {
      setScale(Math.min(window.innerWidth / CANVAS_W, window.innerHeight / CANVAS_H))
    }
    updateScale()
    window.addEventListener('resize', updateScale)
    document.addEventListener('fullscreenchange', updateScale)
    return () => {
      window.removeEventListener('resize', updateScale)
      document.removeEventListener('fullscreenchange', updateScale)
    }
  }, [])

  /** Salto inmediato, sin transición: para el editor y para reencuadrar. */
  const jump = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, visibleSlides.length - 1))
      lockRef.current = false
      setIsAnimating(false)
      setOutClass('')
      setInClass('')
      setScanning(false)
      setCurrent(clamped)
      setDisplayIndex(clamped)
      anchorRef.current = visibleSlides[clamped]?.key ?? null
    },
    [visibleSlides],
  )

  const goTo = useCallback(
    (index: number, dir: Direction) => {
      if (lockRef.current || index < 0 || index >= visibleSlides.length) return
      // Editando no hay transición: el vuelo de 3D dejaría el texto en
      // movimiento justo cuando se le quiere hacer clic.
      if (editing) return jump(index)

      lockRef.current = true
      setIsAnimating(true)
      setScanning(true)

      const outAnim = dir === 'forward' ? 'anim-forward-out' : 'anim-back-out'
      const inAnim = dir === 'forward' ? 'anim-forward-in' : 'anim-back-in'

      setOutClass(outAnim)
      setInClass('')

      setTimeout(() => {
        setDisplayIndex(index)
        setCurrent(index)
        anchorRef.current = visibleSlides[index]?.key ?? null
        setOutClass('')
        setInClass(inAnim)
        setScanning(false)

        setTimeout(() => {
          setInClass('')
          lockRef.current = false
          setIsAnimating(false)
        }, 600)
      }, TRANSITION_MS)
    },
    [visibleSlides, editing, jump],
  )

  const next = useCallback(() => goTo(current + 1, 'forward'), [current, goTo])
  const prev = useCallback(() => goTo(current - 1, 'back'), [current, goTo])

  // Reordenar, ocultar o agregar cambia la lista bajo el índice actual: seguimos
  // a la diapositiva por su clave para no terminar mirando otra cosa.
  useEffect(() => {
    if (visibleSlides.length === 0) return
    if (anchorRef.current === null) {
      anchorRef.current = visibleSlides[Math.min(current, visibleSlides.length - 1)]?.key ?? null
    }
    const wanted = visibleSlides.findIndex(s => s.key === anchorRef.current)
    const target = wanted >= 0 ? wanted : Math.min(current, visibleSlides.length - 1)
    if (target !== current || target !== displayIndex) jump(target)
  }, [visibleSlides]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Escribiendo en la diapositiva o en el panel, el teclado es del campo.
      const t = e.target as HTMLElement | null
      if (t?.isContentEditable || t?.tagName === 'INPUT' || t?.tagName === 'TEXTAREA' || t?.closest?.('[data-dk-ui]')) {
        return
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); next() }
      if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   prev()
      if (e.key === 'f' || e.key === 'F') toggleFullscreen()
      if (e.key === 'Escape' && document.fullscreenElement) document.exitFullscreen().catch(() => {})
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [next, prev, toggleFullscreen])

  const shown = visibleSlides[displayIndex]
  const progress = visibleSlides.length ? ((current + 1) / visibleSlides.length) * 100 : 0

  return (
    <div
      ref={stageRef}
      style={{
        width: '100vw',
        height: '100vh',
        background: 'var(--bg-deep)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* ── Particle field ── */}
      <ParticleCanvas />

      {/* ── Animated background orbs ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div
          className="animate-pulse-glow"
          style={{
            position: 'absolute', width: 700, height: 700, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(37,99,235,0.22) 0%, transparent 65%)',
            filter: 'blur(60px)', top: -250, right: -150,
          }}
        />
        <div
          className="animate-pulse-glow"
          style={{
            position: 'absolute', width: 500, height: 500, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,212,255,0.14) 0%, transparent 65%)',
            filter: 'blur(50px)', bottom: -150, left: -80,
            animationDelay: '2s',
          }}
        />
        <div
          className="animate-pulse-glow"
          style={{
            position: 'absolute', width: 350, height: 350, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(109,40,217,0.18) 0%, transparent 65%)',
            filter: 'blur(50px)', top: '35%', left: '55%',
            animationDelay: '1s',
          }}
        />
        {/* Animated grid */}
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `
              linear-gradient(rgba(0,212,255,0.025) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,212,255,0.025) 1px, transparent 1px)
            `,
            backgroundSize: '44px 44px',
            animation: 'gridDrift 8s linear infinite',
          }}
        />
      </div>

      {/* ── Scaled design canvas — fixed CANVAS_W×CANVAS_H, scaled to fill the viewport ── */}
      <div
        style={{
          width: CANVAS_W,
          height: CANVAS_H,
          flexShrink: 0,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 2,
        }}
      >
      {/* ── Scanline overlay ── */}
      {scanning && (
        <div
          className="scan-wipe"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '30%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.12) 40%, rgba(0,212,255,0.3) 50%, rgba(0,212,255,0.12) 60%, transparent)',
            zIndex: 50,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* ── Chrome flotante ──
          Ni cabecera ni pie: barras con borde y fondo propio
          convertían el escenario en una ventana de navegador. Lo
          que queda son marcas sueltas sobre la escena, tan tenues
          que la lámina puede sangrar por debajo de ellas. */}

      {/* Hilo de progreso, pegado al borde superior */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, zIndex: 40, pointerEvents: 'none' }}>
        <div
          style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, rgba(37,99,235,0), #2563eb 30%, #00d4ff)',
            transition: 'width 0.55s cubic-bezier(0.22,1,0.36,1)',
            boxShadow: '0 0 14px rgba(0,212,255,0.7)',
          }}
        />
      </div>

      {/* Rótulo del módulo, arriba a la izquierda */}
      <div
        style={{
          position: 'absolute', top: 26, left: 46, zIndex: 40,
          display: 'flex', alignItems: 'center', gap: 10, pointerEvents: 'none',
        }}
      >
        <span
          style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--cyan-bright)', boxShadow: '0 0 10px var(--cyan-bright)',
          }}
        />
        <span
          className="font-mono"
          style={{ fontSize: 9.5, color: 'rgba(56,189,248,0.6)', letterSpacing: '0.24em', textTransform: 'uppercase' }}
        >
          Módulo N°1 · Equipos de Salón de Operaciones
        </span>
      </div>

      {/* Contador y pantalla completa, arriba a la derecha */}
      <div
        style={{
          position: 'absolute', top: 20, right: 44, zIndex: 40,
          display: 'flex', alignItems: 'center', gap: 18,
        }}
      >
        <span className="font-mono" style={{ fontSize: 9.5, color: 'rgba(240,249,255,0.26)', letterSpacing: '0.16em' }}>
          Ing. Bryan Rodríguez S. · UDELAS
        </span>
        <span className="font-mono" style={{ fontSize: 12, color: 'var(--cyan-bright)', letterSpacing: '0.1em' }}>
          {String(current + 1).padStart(2, '0')}
          <span style={{ color: 'rgba(240,249,255,0.22)' }}> / {String(visibleSlides.length).padStart(2, '0')}</span>
        </span>
        <NavBtn onClick={toggleFullscreen} disabled={false} label={isFullscreen ? '⤡' : '⤢'} title={isFullscreen ? 'Salir de pantalla completa (Esc)' : 'Pantalla completa (F)'} />
      </div>

      {/* ── Escenario ──
          Ocupa el canvas entero: una escena tiene que poder tocar
          los cuatro bordes para que algo pueda salirse por ellos. */}
      <div
        data-stage="slide"
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          zIndex: 5,
          perspective: '1200px',
        }}
      >
        <div
          key={`${shown?.key ?? 'empty'}-${nonce}`}
          className={inClass || outClass}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            inset: 0,
            transformStyle: 'preserve-3d',
            willChange: 'transform, opacity, filter',
          }}
        >
          {shown && (
            <EditableSlide slideKey={shown.key}>{renderSlide(shown.key)}</EditableSlide>
          )}
        </div>
      </div>

      {/* Navegación por puntos, centrada abajo y sin suelo bajo ella */}
      <div
        style={{
          position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 4, alignItems: 'center', zIndex: 40,
        }}
      >
        {visibleSlides.map((s, i) => (
          <button
            key={s.key}
            onClick={() => !isAnimating && goTo(i, i > current ? 'forward' : 'back')}
            onMouseEnter={() => setHoveredDot(i)}
            onMouseLeave={() => setHoveredDot(null)}
            title={`${i + 1}. ${s.label}`}
            style={{
              width: i === current ? 22 : hoveredDot === i ? 9 : 4,
              height: 4,
              borderRadius: 2,
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
              background:
                i === current
                  ? 'linear-gradient(90deg, #2563eb, #00d4ff)'
                  : i < current
                  ? 'rgba(0,212,255,0.4)'
                  : 'rgba(240,249,255,0.13)',
              boxShadow: i === current ? '0 0 10px rgba(0,212,255,0.8)' : 'none',
            }}
          />
        ))}
      </div>

      {/* Flechas, abajo a la derecha */}
      <div style={{ position: 'absolute', bottom: 18, right: 44, display: 'flex', gap: 8, zIndex: 40 }}>
        <NavBtn onClick={prev} disabled={current === 0 || isAnimating} label="←" />
        <NavBtn onClick={next} disabled={current === visibleSlides.length - 1 || isAnimating} label="→" />
      </div>
      </div>

      <EditorPanel current={current} onGoTo={jump} />
    </div>
  )
}

function NavBtn({ onClick, disabled, label, title }: { onClick: () => void; disabled: boolean; label: string; title?: string }) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      /* Sin caja: un botón con borde en la esquina reintroduce
         justamente el rectángulo que la composición evita. Queda
         el glifo, y el disco de acento solo aparece al pasar. */
      style={{
        width: 30, height: 30,
        borderRadius: '50%',
        border: 'none',
        background: !disabled && hover ? 'rgba(0,212,255,0.14)' : 'transparent',
        color: disabled ? 'rgba(240,249,255,0.14)' : hover ? 'var(--cyan-bright)' : 'rgba(0,212,255,0.55)',
        cursor: disabled ? 'default' : 'pointer',
        fontSize: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.22s ease',
        fontFamily: 'inherit',
        textShadow: !disabled && hover ? '0 0 12px rgba(0,212,255,0.8)' : 'none',
      }}
    >
      {label}
    </button>
  )
}
