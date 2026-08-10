import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { useDeck } from './DeckContext'
import { notifySlideChanged, setActiveSlide } from './activeSlide'
import { isLeaf, nodeAtPath, pathOf } from './textPath'

const TEXT_NODE = 3
const NBSP = ' '

interface Props {
  slideKey: string
  children: ReactNode
}

type Ring = { rect: DOMRect; mode: 'leaf' | 'mixed' | 'active' } | null

/**
 * Envuelve una slide y le añade edición de texto sobre lo ya renderizado.
 *
 * Trabajar sobre el DOM en vez de sobre el JSX es lo que hace que el editor
 * sirva para cualquier slide del deck sin reescribirla: da igual si el texto
 * está en un título, en una celda de tabla o dentro de una tarjeta.
 */
export default function EditableSlide({ slideKey, children }: Props) {
  const { editing, overrides, setText, resetText, nonce } = useDeck()
  const hostRef = useRef<HTMLDivElement>(null)
  const [ring, setRing] = useState<Ring>(null)

  // Datos de la edición en curso. Viven en un ref porque los listeners nativos
  // que escuchan al elemento editable no ven el estado de React.
  const active = useRef<{ el: HTMLElement; path: string; original: string } | null>(null)

  // ── Aplicar los textos editados después de que la slide se renderiza ──────
  useLayoutEffect(() => {
    const host = hostRef.current
    if (!host) return
    const prefix = `${slideKey}::`
    for (const [k, value] of Object.entries(overrides)) {
      if (!k.startsWith(prefix)) continue
      const node = nodeAtPath(host, k.slice(prefix.length))
      if (node && node.nodeType === TEXT_NODE && node.nodeValue !== value) node.nodeValue = value
    }
    notifySlideChanged()
  }, [slideKey, overrides, nonce, children])

  useLayoutEffect(() => {
    setActiveSlide(hostRef.current, slideKey)
    return () => setActiveSlide(null, '')
  }, [slideKey, nonce])

  const finish = useCallback(
    (mode: 'commit' | 'cancel') => {
      const cur = active.current
      if (!cur) return
      active.current = null
      const { el, path, original } = cur

      el.removeAttribute('contenteditable')
      el.removeAttribute('spellcheck')
      window.getSelection()?.removeAllRanges()

      const typed = (el.textContent ?? '').replace(new RegExp(NBSP, 'g'), ' ')
      // Reponer el texto como un único nodo deja el árbol igual que antes de
      // editar, así que la ruta guardada sigue apuntando al mismo sitio.
      if (mode === 'cancel' || !typed.trim()) {
        el.textContent = original
        // Vaciar un texto se lee como "devuélvelo a su original": guardarlo en
        // blanco eliminaría la única manija que queda para recuperarlo.
        if (mode === 'commit') resetText(slideKey, path)
      } else {
        el.textContent = typed
        if (typed !== original) setText(slideKey, path, typed)
      }
      setRing(null)
    },
    [slideKey, setText, resetText],
  )

  const beginEdit = useCallback(
    (el: HTMLElement, x: number, y: number) => {
      const host = hostRef.current
      if (!host || !el.firstChild) return
      const path = pathOf(el.firstChild, host)
      if (!path) return

      finish('commit')
      active.current = { el, path, original: el.textContent ?? '' }

      // plaintext-only impide que el navegador inyecte <div>/<br> al escribir o
      // pegar. Donde no exista (Firefox antiguo) se cae a true y se filtra el
      // pegado a mano.
      el.setAttribute('contenteditable', 'plaintext-only')
      if (el.contentEditable !== 'plaintext-only') el.setAttribute('contenteditable', 'true')
      el.setAttribute('spellcheck', 'false')
      el.focus({ preventScroll: true })

      const range = document.caretRangeFromPoint?.(x, y)
      const sel = window.getSelection()
      if (sel) {
        sel.removeAllRanges()
        if (range && el.contains(range.startContainer)) {
          sel.addRange(range)
        } else {
          const all = document.createRange()
          all.selectNodeContents(el)
          sel.addRange(all)
        }
      }
      setRing({ rect: el.getBoundingClientRect(), mode: 'active' })
    },
    [finish],
  )

  // ── Teclado y pegado mientras hay un campo abierto ────────────────────────
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!active.current) return
      // Las flechas y la barra espaciadora navegan el deck; mientras se escribe
      // tienen que quedarse dentro del campo.
      e.stopPropagation()
      if (e.key === 'Enter') {
        e.preventDefault()
        finish('commit')
      } else if (e.key === 'Escape') {
        e.preventDefault()
        finish('cancel')
      }
    }
    const onPaste = (e: ClipboardEvent) => {
      const cur = active.current
      if (!cur || cur.el.contentEditable === 'plaintext-only') return
      e.preventDefault()
      const text = e.clipboardData?.getData('text/plain')?.replace(/\s+/g, ' ') ?? ''
      document.execCommand('insertText', false, text)
    }
    const onFocusOut = (e: FocusEvent) => {
      if (active.current && e.target === active.current.el) finish('commit')
    }
    document.addEventListener('keydown', onKeyDown, true)
    document.addEventListener('paste', onPaste, true)
    document.addEventListener('focusout', onFocusOut, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.removeEventListener('paste', onPaste, true)
      document.removeEventListener('focusout', onFocusOut, true)
    }
  }, [finish])

  // Salir del modo edición cierra el campo abierto.
  useEffect(() => {
    if (!editing) finish('commit')
  }, [editing, finish])

  const onPointerDown = (e: ReactPointerEvent) => {
    if (!editing) return
    const el = e.target as HTMLElement
    if (!(el instanceof HTMLElement) || el.closest('[data-dk-ui]')) return
    if (classify(el) !== 'leaf') return
    e.preventDefault()
    e.stopPropagation()
    beginEdit(el, e.clientX, e.clientY)
  }

  const onPointerMove = (e: ReactPointerEvent) => {
    if (!editing || active.current) return
    const el = e.target as HTMLElement
    const mode = el instanceof HTMLElement ? classify(el) : null
    setRing(mode ? { rect: el.getBoundingClientRect(), mode } : null)
  }

  return (
    <>
      <div
        ref={hostRef}
        className={editing ? 'dk-host dk-flat' : 'dk-host'}
        style={{ width: '100%', height: '100%' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerLeave={() => {
          if (!active.current) setRing(null)
        }}
      >
        {children}
      </div>
      {editing && ring && <HoverRing rect={ring.rect} mode={ring.mode} />}
    </>
  )
}

/**
 * El anillo se dibuja en `document.body` con coordenadas de viewport: dentro
 * del lienzo escalado un `position: fixed` se mediría contra la transformación
 * del lienzo y quedaría descuadrado.
 */
function HoverRing({ rect, mode }: { rect: DOMRect; mode: 'leaf' | 'mixed' | 'active' }) {
  const color = mode === 'mixed' ? '#f59e0b' : '#00d4ff'
  return createPortal(
    <div
      data-dk-ui=""
      style={{
        position: 'fixed',
        left: rect.left - 3,
        top: rect.top - 3,
        width: rect.width + 6,
        height: rect.height + 6,
        border: `1.5px ${mode === 'mixed' ? 'dashed' : 'solid'} ${color}`,
        borderRadius: 5,
        boxShadow: mode === 'active' ? `0 0 0 3px ${color}22, 0 0 18px ${color}55` : `0 0 12px ${color}33`,
        background: mode === 'active' ? `${color}0f` : 'transparent',
        pointerEvents: 'none',
        zIndex: 9998,
        transition: 'all 0.09s ease-out',
      }}
    />,
    document.body,
  )
}

/**
 * Clasifica el elemento que está bajo el cursor:
 *  - `leaf`  → solo contiene ese texto; se edita aquí mismo.
 *  - `mixed` → mezcla texto suelto con otros elementos; se edita en el panel.
 *  - `null`  → es puro contenedor, no hay nada que escribir.
 */
function classify(el: HTMLElement): 'leaf' | 'mixed' | null {
  if (!el.textContent?.trim()) return null
  if (isLeaf(el)) return 'leaf'
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType === TEXT_NODE && node.nodeValue?.trim()) return 'mixed'
  }
  return null
}
