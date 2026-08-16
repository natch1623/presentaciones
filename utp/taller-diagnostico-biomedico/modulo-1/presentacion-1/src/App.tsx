import { useState, useEffect, useCallback, useRef } from 'react'
import { slides } from './slides'
import CustomSlide from './slides/CustomSlide'
import CelestialField from './components/CelestialField'
import HydroVeil from './components/HydroVeil'
import { Moon } from './components/Celestial'
import { EditorProvider, useDeck } from './editor/DeckContext'
import EditableSlide from './editor/EditableSlide'
import EditorPanel from './editor/EditorPanel'

type Direction = 'forward' | 'back'

/** Cuánto dura la salida antes de montar la diapositiva siguiente. */
const OUT_MS = { forward: 440, back: 380 }
/** Cuánto dura la entrada, para saber cuándo liberar el candado. */
const IN_MS = { forward: 860, back: 720 }
/** La onda sobrevive al corte: cruza la salida y la entrada. */
const VEIL_MS = 1180

// Lienzo de diseño fijo: todo el deck se compone contra esta
// resolución y luego se escala uniformemente al viewport, así en una
// pantalla grande no queda diminuto con márgenes enormes.
const CANVAS_W = 1280
const CANVAS_H = 800

// Identifica el deck en el almacenamiento del navegador. Si se clona
// esta presentación para otro taller, cambiar este id evita que las
// dos compartan (y se pisen) las mismas ediciones.
const DECK_ID = 'utp-taller-diagnostico-biomedico'

export default function App() {
  return (
    <EditorProvider deckId={DECK_ID} baseSlides={slides} renderCustom={data => <CustomSlide data={data} />}>
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
  const [veil, setVeil] = useState<'ripple' | 'eclipse' | null>(null)
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
      setVeil(null)
      setCurrent(clamped)
      setDisplayIndex(clamped)
      anchorRef.current = visibleSlides[clamped]?.key ?? null
    },
    [visibleSlides],
  )

  const goTo = useCallback(
    (index: number, dir: Direction) => {
      if (lockRef.current || index < 0 || index >= visibleSlides.length) return
      // Editando no hay transición: la onda dejaría el texto en
      // movimiento justo cuando se le quiere hacer clic.
      if (editing) return jump(index)

      lockRef.current = true
      setIsAnimating(true)
      setVeil(dir === 'forward' ? 'ripple' : 'eclipse')

      setOutClass(dir === 'forward' ? 'anim-hydro-out' : 'anim-eclipse-out')
      setInClass('')

      timers.current.push(
        window.setTimeout(() => {
          setDisplayIndex(index)
          setCurrent(index)
          anchorRef.current = visibleSlides[index]?.key ?? null
          setOutClass('')
          setInClass(dir === 'forward' ? 'anim-moon-in' : 'anim-eclipse-in')

          timers.current.push(
            window.setTimeout(() => {
              setInClass('')
              lockRef.current = false
              setIsAnimating(false)
            }, IN_MS[dir]),
          )
        }, OUT_MS[dir]),
      )

      timers.current.push(window.setTimeout(() => setVeil(null), VEIL_MS))
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
  const total = visibleSlides.length
  const progress = total ? ((current + 1) / total) * 100 : 0

  return (
    <div
      ref={stageRef}
      style={{
        width: '100vw',
        height: '100vh',
        background: 'var(--night)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // `clip` y no `hidden`: `hidden` deja un contenedor desplazable,
        // y al enfocar un botón del pie el navegador arrastra el lienzo
        // fuera de cuadro cuando el viewport es menor que 1280×800.
        overflow: 'clip',
        position: 'relative',
      }}
    >
      <CelestialField />

      {/* ── Lienzo de diseño escalado ──
          Va posicionado en absoluto, fuera del flujo: como hijo del
          flex, en un viewport más chico el navegador desplazaría el
          contenedor al enfocar un botón del pie. */}
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
            padding: '10px 30px',
            borderBottom: '1px solid var(--edge)',
            background: 'rgba(8,13,36,0.82)',
            backdropFilter: 'blur(16px)',
            flexShrink: 0,
            zIndex: 10,
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <Moon size={15} phase="crescent" tone="hydro" />
            <span className="font-mono" style={{ fontSize: 9.5, color: 'var(--hydro)', letterSpacing: '0.16em' }}>
              TALLER DE DIAGNÓSTICO BIOMÉDICO · UTP PANAMÁ OESTE
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <span className="font-mono" style={{ fontSize: 9.5, color: 'var(--moon-faint)', letterSpacing: '0.06em' }}>
              Prof. Ing. Bryan Rodríguez · Ingeniería Biomédica
            </span>

            {/* 01 ◐ 68 — el contador es parte del dominio, no un widget */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
              <span className="font-mono" style={{ fontSize: 11.5, color: 'var(--cyan)', fontWeight: 500 }}>
                {String(current + 1).padStart(2, '0')}
              </span>
              <Moon size={11} phase="crescent" tone="violet" halo={false} />
              <span className="font-mono" style={{ fontSize: 9.5, color: 'var(--moon-faint)' }}>
                {String(total).padStart(2, '0')}
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
              willChange: 'transform, opacity, filter',
            }}
          >
            {shown && <EditableSlide slideKey={shown.key}>{renderSlide(shown.key)}</EditableSlide>}
          </div>

          <HydroVeil phase={veil} />
        </div>

        {/* ── Pie ── */}
        <footer
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '10px 30px',
            borderTop: '1px solid var(--edge)',
            background: 'rgba(8,13,36,0.82)',
            backdropFilter: 'blur(16px)',
            flexShrink: 0,
            zIndex: 10,
            position: 'relative',
          }}
        >
          {/* Órbita de progreso */}
          <div style={{ flex: 1, height: 2, background: 'rgba(184,231,255,0.08)', borderRadius: 2, position: 'relative' }}>
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                borderRadius: 2,
                background: 'linear-gradient(90deg, var(--violet), var(--hydro) 60%, var(--cyan))',
                transition: 'width 0.7s cubic-bezier(0.22,1,0.36,1)',
                boxShadow: '0 0 12px rgba(114,199,255,0.6)',
                position: 'relative',
              }}
            >
              <div className="sheen-bar" style={{ position: 'absolute', inset: 0, borderRadius: 2 }} />
              {/* La luna que recorre la órbita */}
              <span
                style={{
                  position: 'absolute',
                  right: -3.5,
                  top: -2.5,
                  width: 7,
                  height: 7,
                  borderRadius: '50%',
                  background: 'var(--cyan)',
                  boxShadow: '0 0 10px var(--cyan)',
                }}
              />
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
                  width: i === current ? 14 : hoveredDot === i ? 7 : 3,
                  height: 3,
                  border: 'none',
                  borderRadius: 2,
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.45s cubic-bezier(0.22,1,0.36,1)',
                  background:
                    i === current
                      ? 'linear-gradient(90deg, var(--violet), var(--cyan))'
                      : i < current
                        ? 'rgba(114,199,255,0.42)'
                        : 'rgba(245,247,255,0.13)',
                  boxShadow: i === current ? '0 0 9px rgba(189,248,255,0.8)' : 'none',
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
            <NavBtn onClick={next} disabled={current === total - 1 || isAnimating} label="→" />
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
        width: 30,
        height: 30,
        borderRadius: '50%',
        border: '1px solid',
        borderColor: disabled
          ? 'rgba(184,231,255,0.09)'
          : hover
            ? 'rgba(184,231,255,0.60)'
            : 'rgba(184,231,255,0.26)',
        background: disabled ? 'transparent' : hover ? 'rgba(114,199,255,0.14)' : 'rgba(114,199,255,0.05)',
        color: disabled ? 'rgba(245,247,255,0.18)' : 'var(--cyan)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: 13,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s cubic-bezier(0.22,1,0.36,1)',
        fontFamily: 'inherit',
        boxShadow: !disabled && hover ? '0 0 18px rgba(114,199,255,0.30)' : 'none',
      }}
    >
      {label}
    </button>
  )
}
