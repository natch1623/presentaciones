import { useState, useEffect, useCallback, useRef } from 'react'
import { slides } from './slides'
import CustomSlide from './slides/CustomSlide'
import ShardField from './components/ShardField'
import VoidShatter from './components/VoidShatter'
import { EditorProvider, useDeck } from './editor/DeckContext'
import EditableSlide from './editor/EditableSlide'
import EditorPanel from './editor/EditorPanel'

type Direction = 'forward' | 'back'

/** Cuánto dura la salida antes de montar la diapositiva siguiente. */
const OUT_MS = { forward: 400, back: 360 }
/** Cuánto dura la entrada, para saber cuándo liberar el candado. */
const IN_MS = { forward: 740, back: 640 }
/** La capa de esquirlas sobrevive al corte: cruza salida y entrada. */
const SHATTER_MS = 820

// Lienzo de diseño fijo: todo el deck se compone contra esta resolución
// y luego se escala uniformemente al viewport, así en una pantalla
// grande no queda diminuto con márgenes enormes.
const CANVAS_W = 1280
const CANVAS_H = 800

// Identifica el deck en el almacenamiento del navegador. Si se clona
// esta presentación para otro módulo, cambiar este id evita que las dos
// compartan (y se pisen) las mismas ediciones.
const DECK_ID = 'udelas-mant-m1-p1'

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
  const [shatter, setShatter] = useState<'break' | 'gather' | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hoveredDot, setHoveredDot] = useState<number | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [scale, setScale] = useState(1)
  const lockRef = useRef(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])
  // Qué diapositiva queremos en pantalla, por clave y no por posición:
  // reordenar u ocultar cambia los índices bajo los pies del presentador.
  const anchorRef = useRef<string | null>(null)

  const clearTimers = () => {
    timers.current.forEach(clearTimeout)
    timers.current = []
  }
  useEffect(() => clearTimers, [])

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
      clearTimers()
      lockRef.current = false
      setIsAnimating(false)
      setOutClass('')
      setInClass('')
      setShatter(null)
      setCurrent(clamped)
      setDisplayIndex(clamped)
      anchorRef.current = visibleSlides[clamped]?.key ?? null
    },
    [visibleSlides],
  )

  const goTo = useCallback(
    (index: number, dir: Direction) => {
      if (lockRef.current || index < 0 || index >= visibleSlides.length) return
      // Editando no hay transición: la ruptura dejaría el texto en
      // movimiento justo cuando se le quiere hacer clic.
      if (editing) return jump(index)

      lockRef.current = true
      setIsAnimating(true)
      setShatter(dir === 'forward' ? 'break' : 'gather')

      setOutClass(dir === 'forward' ? 'anim-shatter-out' : 'anim-rift-close')
      setInClass('')

      timers.current.push(
        window.setTimeout(() => {
          setDisplayIndex(index)
          setCurrent(index)
          anchorRef.current = visibleSlides[index]?.key ?? null
          setOutClass('')
          setInClass(dir === 'forward' ? 'anim-rift-in' : 'anim-reform-in')

          timers.current.push(
            window.setTimeout(() => {
              setInClass('')
              lockRef.current = false
              setIsAnimating(false)
            }, IN_MS[dir]),
          )
        }, OUT_MS[dir]),
      )

      timers.current.push(window.setTimeout(() => setShatter(null), SHATTER_MS))
    },
    [visibleSlides, editing, jump],
  )

  const next = useCallback(() => goTo(current + 1, 'forward'), [current, goTo])
  const prev = useCallback(() => goTo(current - 1, 'back'), [current, goTo])

  // Reordenar, ocultar o agregar cambia la lista bajo el índice actual:
  // seguimos a la diapositiva por su clave para no terminar en otra.
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
      if (
        t?.isContentEditable ||
        t?.tagName === 'INPUT' ||
        t?.tagName === 'TEXTAREA' ||
        t?.closest?.('[data-dk-ui]')
      ) {
        return
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault()
        next()
      }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') prev()
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
        background: 'var(--void)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // `clip` y no `hidden`: `hidden` deja un contenedor desplazable, y
        // al enfocar un botón del pie el navegador arrastra el lienzo fuera
        // de cuadro cuando el viewport es menor que 1280×800. `clip` no
        // crea contenedor de scroll, así que no hay nada que arrastrar.
        overflow: 'clip',
        position: 'relative',
      }}
    >
      {/* ── Campo de esquirlas a la deriva ── */}
      <ShardField />

      {/* ── Halos del vacío ── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div
          className="animate-void-pulse"
          style={{
            position: 'absolute',
            width: 760,
            height: 760,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(67,39,184,0.26) 0%, transparent 66%)',
            filter: 'blur(66px)',
            top: -280,
            right: -170,
          }}
        />
        <div
          className="animate-void-pulse"
          style={{
            position: 'absolute',
            width: 540,
            height: 540,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(143,220,255,0.13) 0%, transparent 66%)',
            filter: 'blur(54px)',
            bottom: -170,
            left: -100,
            animationDelay: '2.2s',
          }}
        />
        <div
          className="animate-void-pulse"
          style={{
            position: 'absolute',
            width: 380,
            height: 380,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(125,99,255,0.20) 0%, transparent 66%)',
            filter: 'blur(52px)',
            top: '38%',
            left: '54%',
            animationDelay: '1.1s',
          }}
        />
        <div className="void-grid" style={{ position: 'absolute', inset: 0 }} />
      </div>

      {/* ── Lienzo de diseño escalado ──
          Va posicionado en absoluto, fuera del flujo: si quedara como
          hijo del flex, en un viewport más chico que 1280×800 el
          navegador desplazaría el contenedor al enfocar un botón del
          pie y la diapositiva se saldría de cuadro. */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: CANVAS_W,
          height: CANVAS_H,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: 'center center',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 2,
        }}
      >
        {/* ── Encabezado ── */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '9px 28px',
            borderBottom: '1px solid var(--edge)',
            background: 'rgba(4,5,14,0.86)',
            backdropFilter: 'blur(16px)',
            flexShrink: 0,
            zIndex: 10,
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ position: 'relative', width: 9, height: 9 }}>
              <div
                style={{
                  width: 9,
                  height: 9,
                  background: 'var(--frost)',
                  clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
                  boxShadow: '0 0 10px var(--frost)',
                }}
              />
              <div
                className="animate-void-pulse"
                style={{
                  position: 'absolute',
                  inset: -4,
                  background: 'rgba(143,220,255,0.18)',
                  clipPath: 'polygon(50% 0, 100% 50%, 50% 100%, 0 50%)',
                }}
              />
            </div>
            <span
              className="font-mono"
              style={{ fontSize: 9.5, color: 'var(--frost)', letterSpacing: '0.14em' }}
            >
              MÓDULO I — MANTENIMIENTO EN EQUIPOS DE LABORATORIO CLÍNICO
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span
              className="font-mono"
              style={{ fontSize: 9.5, color: 'var(--ice-faint)', letterSpacing: '0.06em' }}
            >
              Ing. Bryan Rodríguez · UDELAS · Téc. Biomédica
            </span>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '3px 10px',
                background: 'rgba(143,220,255,0.07)',
                border: '1px solid rgba(143,220,255,0.24)',
                clipPath: 'polygon(5px 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%, 0 5px)',
              }}
            >
              <span className="font-mono" style={{ fontSize: 11.5, color: 'var(--frost)', fontWeight: 500 }}>
                {String(current + 1).padStart(2, '0')}
              </span>
              <span className="font-mono" style={{ fontSize: 9.5, color: 'var(--ice-faint)' }}>
                / {String(visibleSlides.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </header>

        {/* ── Ventana de la diapositiva ── */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', zIndex: 5 }}>
          <div
            key={`${shown?.key ?? 'empty'}-${nonce}`}
            className={inClass || outClass}
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              inset: 0,
              willChange: 'transform, opacity, filter, clip-path',
            }}
          >
            {shown && <EditableSlide slideKey={shown.key}>{renderSlide(shown.key)}</EditableSlide>}
          </div>

          <VoidShatter phase={shatter} />
        </div>

        {/* ── Pie ── */}
        <footer
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '9px 28px',
            borderTop: '1px solid var(--edge)',
            background: 'rgba(4,5,14,0.86)',
            backdropFilter: 'blur(16px)',
            flexShrink: 0,
            zIndex: 10,
            position: 'relative',
          }}
        >
          <div
            style={{
              flex: 1,
              height: 3,
              background: 'rgba(143,220,255,0.07)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, var(--rift-deep), var(--rift), var(--frost))',
                transition: 'width 0.55s cubic-bezier(0.16,1,0.3,1)',
                boxShadow: '0 0 12px rgba(143,220,255,0.7)',
                position: 'relative',
              }}
            >
              <div className="sheen-bar" style={{ position: 'absolute', inset: 0 }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
            {visibleSlides.map((s, i) => (
              <button
                key={s.key}
                onClick={() => !isAnimating && goTo(i, i > current ? 'forward' : 'back')}
                onMouseEnter={() => setHoveredDot(i)}
                onMouseLeave={() => setHoveredDot(null)}
                title={`${i + 1}. ${s.label}`}
                style={{
                  width: i === current ? 18 : hoveredDot === i ? 9 : 4,
                  height: 5,
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transform: 'skewX(-24deg)',
                  transition: 'all 0.32s cubic-bezier(0.16,1,0.3,1)',
                  background:
                    i === current
                      ? 'linear-gradient(90deg, var(--rift), var(--frost))'
                      : i < current
                        ? 'rgba(143,220,255,0.40)'
                        : 'rgba(234,246,255,0.13)',
                  boxShadow: i === current ? '0 0 9px rgba(143,220,255,0.8)' : 'none',
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: 7 }}>
            <NavBtn
              onClick={toggleFullscreen}
              disabled={false}
              label={isFullscreen ? '⤡' : '⤢'}
              title={isFullscreen ? 'Salir de pantalla completa (Esc)' : 'Pantalla completa (F)'}
            />
            <NavBtn onClick={prev} disabled={current === 0 || isAnimating} label="←" />
            <NavBtn
              onClick={next}
              disabled={current === visibleSlides.length - 1 || isAnimating}
              label="→"
            />
          </div>
        </footer>
      </div>

      <EditorPanel current={current} onGoTo={jump} />
    </div>
  )
}

function NavBtn({
  onClick,
  disabled,
  label,
  title,
}: {
  onClick: () => void
  disabled: boolean
  label: string
  title?: string
}) {
  const [hover, setHover] = useState(false)
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        width: 32,
        height: 32,
        border: '1px solid',
        borderColor: disabled
          ? 'rgba(143,220,255,0.09)'
          : hover
            ? 'rgba(143,220,255,0.65)'
            : 'rgba(143,220,255,0.28)',
        background: disabled ? 'transparent' : hover ? 'rgba(143,220,255,0.14)' : 'rgba(143,220,255,0.05)',
        color: disabled ? 'rgba(234,246,255,0.18)' : 'var(--frost)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        fontFamily: 'inherit',
        clipPath: 'polygon(7px 0, 100% 0, 100% calc(100% - 7px), calc(100% - 7px) 100%, 0 100%, 0 7px)',
        boxShadow: !disabled && hover ? '0 0 16px rgba(143,220,255,0.28)' : 'none',
      }}
    >
      {label}
    </button>
  )
}
