import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDeck } from './DeckContext'
import { getActiveSlide, subscribeActiveSlide } from './activeSlide'
import { collectTexts, nodeAtPath, type TextEntry } from './textPath'
import { textKey, type CustomKind } from './types'
import './editor.css'

const TEMPLATES: Array<{ kind: CustomKind; name: string; desc: string }> = [
  { kind: 'section', name: 'Portada / sección', desc: 'Título grande y bajada' },
  { kind: 'bullets', name: 'Título + viñetas', desc: 'Lista numerada' },
  { kind: 'text', name: 'Título + texto', desc: 'Párrafo y nota' },
  { kind: 'twocol', name: 'Dos columnas', desc: 'Comparar A vs. B' },
]

interface Props {
  /** Índice actual dentro de las slides visibles. */
  current: number
  onGoTo: (index: number) => void
}

export default function EditorPanel({ current, onGoTo }: Props) {
  const deck = useDeck()
  const {
    allSlides, visibleSlides, editing, setEditing, panelOpen, setPanelOpen,
    toggleHidden, moveTo, duplicate, addCustom, removeSlide, setLabel, setItems,
    customOf, overrides, setText, resetText, exportJson, importJson, resetAll, editCount,
  } = deck

  const currentKey = visibleSlides[current]?.key ?? ''
  const [showTemplates, setShowTemplates] = useState(false)
  const [pendingKey, setPendingKey] = useState<string | null>(null)

  // Saltar a la diapositiva recién creada, pero solo cuando React ya la montó:
  // su índice no existe hasta que el nuevo orden llega al render.
  useEffect(() => {
    if (!pendingKey) return
    const at = visibleSlides.findIndex(s => s.key === pendingKey)
    if (at >= 0) {
      onGoTo(at)
      setPendingKey(null)
    }
  }, [pendingKey, visibleSlides, onGoTo])

  // ── Atajos globales ──────────────────────────────────────────────────────
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t?.isContentEditable || t?.tagName === 'INPUT' || t?.tagName === 'TEXTAREA') return
      if (e.key === 'e' || e.key === 'E') {
        e.preventDefault()
        if (panelOpen && editing) {
          setEditing(false)
          setPanelOpen(false)
        } else {
          setPanelOpen(true)
          setEditing(true)
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [panelOpen, editing, setEditing, setPanelOpen])

  if (!panelOpen) {
    return (
      <>
        {editing && <div className="dk-editing-flag" />}
        <button
          data-dk-ui=""
          className="dk-launcher"
          onClick={() => {
            setPanelOpen(true)
            setEditing(true)
          }}
          title="Abrir el modo editor (tecla E)"
        >
          ✎ Editar{editCount > 0 ? ` · ${editCount}` : ''}
        </button>
      </>
    )
  }

  return (
    <>
      {editing && <div className="dk-editing-flag" />}
      <aside data-dk-ui="" className="dk-panel" onKeyDown={e => e.stopPropagation()}>
        <div className="dk-panel-head">
          <span className="dk-title">Modo editor</span>
          <button
            className="dk-icon"
            title="Cerrar el panel (tecla E)"
            onClick={() => {
              setEditing(false)
              setPanelOpen(false)
            }}
          >
            ✕
          </button>
        </div>

        <div className="dk-scroll">
          <div className="dk-toolbar" style={{ marginBottom: 10 }}>
            <button
              className={editing ? 'dk-btn is-on' : 'dk-btn'}
              onClick={() => setEditing(!editing)}
              style={{ flex: 1 }}
            >
              {editing ? '✎ Editando textos' : '✎ Activar edición'}
            </button>
          </div>

          <div className="dk-hint">
            {editing ? (
              <>
                Haz clic en cualquier texto de la diapositiva y escribe. <b>Enter</b> guarda,{' '}
                <b>Esc</b> descarta. Los textos con borde <b>naranja</b> se editan desde la lista
                de abajo. Vaciar un texto lo devuelve a su versión original.
              </>
            ) : (
              <>
                La edición está apagada: puedes reordenar y ocultar diapositivas sin riesgo de
                escribir encima. Pulsa <b>E</b> para abrir y cerrar este panel.
              </>
            )}
          </div>

          <div className="dk-section">Diapositivas · {visibleSlides.length} visibles de {allSlides.length}</div>
          <SlideList
            slides={allSlides}
            currentKey={currentKey}
            visibleKeys={visibleSlides.map(s => s.key)}
            onGoTo={onGoTo}
            onMove={moveTo}
            onToggleHidden={toggleHidden}
            onDuplicate={duplicate}
            onRemove={removeSlide}
            onLabel={setLabel}
          />

          <div style={{ padding: '8px 4px 0' }}>
            <button className="dk-btn" style={{ width: '100%' }} onClick={() => setShowTemplates(v => !v)}>
              ＋ Nueva diapositiva
            </button>
          </div>
          {showTemplates && (
            <div className="dk-templates" style={{ marginTop: 6 }}>
              {TEMPLATES.map(t => (
                <button
                  key={t.kind}
                  className="dk-template"
                  onClick={() => {
                    // La nueva entra justo después de la actual y el efecto de
                    // arriba salta a ella en cuanto esté montada.
                    setPendingKey(addCustom(t.kind, currentKey || undefined))
                    setShowTemplates(false)
                    setEditing(true)
                  }}
                >
                  {t.name}
                  <small>{t.desc}</small>
                </button>
              ))}
            </div>
          )}

          <CustomControls slideKey={currentKey} customOf={customOf} setItems={setItems} />

          <TextList
            slideKey={currentKey}
            overrides={overrides}
            onSet={setText}
            onReset={resetText}
            editing={editing}
          />

          <div className="dk-section">Guardar y compartir</div>
          <div className="dk-toolbar">
            <button className="dk-btn ghost" onClick={exportJson} title="Descargar los cambios como archivo JSON">
              ↓ Exportar
            </button>
            <button
              className="dk-btn ghost"
              onClick={async () => {
                const ok = await importJson()
                if (!ok) alert('No se pudo leer ese archivo. Debe ser un JSON exportado desde aquí.')
              }}
              title="Cargar un JSON exportado antes"
            >
              ↑ Importar
            </button>
            <button
              className="dk-btn danger"
              onClick={() => {
                if (confirm('Se descartan todos los cambios: textos, orden, ocultas y diapositivas nuevas. ¿Continuar?')) {
                  resetAll()
                  onGoTo(0)
                }
              }}
            >
              Restablecer
            </button>
          </div>
          <p style={{ fontSize: 10.5, color: 'rgba(240,249,255,0.35)', padding: '8px 6px 0', lineHeight: 1.5, margin: 0 }}>
            Los cambios se guardan solos en este navegador. Exporta el JSON para respaldarlos o
            llevarlos a otra computadora.
          </p>
        </div>
      </aside>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Lista de diapositivas
   ───────────────────────────────────────────────────────────────────────── */

function SlideList({
  slides, currentKey, visibleKeys, onGoTo, onMove, onToggleHidden, onDuplicate, onRemove, onLabel,
}: {
  slides: ReturnType<typeof useDeck>['allSlides']
  currentKey: string
  visibleKeys: string[]
  onGoTo: (i: number) => void
  onMove: (from: number, to: number) => void
  onToggleHidden: (key: string) => void
  onDuplicate: (key: string) => string
  onRemove: (key: string) => void
  onLabel: (key: string, label: string) => void
}) {
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)
  const [armed, setArmed] = useState<number | null>(null)

  const drop = (to: number) => {
    if (dragIdx !== null && dragIdx !== to) onMove(dragIdx, to)
    setDragIdx(null)
    setOverIdx(null)
    setArmed(null)
  }

  return (
    <div>
      {slides.map((s, i) => {
        const visIdx = visibleKeys.indexOf(s.key)
        const cls = [
          'dk-row',
          s.key === currentKey ? 'is-current' : '',
          s.hidden ? 'is-hidden' : '',
          dragIdx === i ? 'is-dragging' : '',
          overIdx === i && dragIdx !== null && dragIdx > i ? 'is-drop-before' : '',
          overIdx === i && dragIdx !== null && dragIdx < i ? 'is-drop-after' : '',
        ].filter(Boolean).join(' ')

        return (
          <div
            key={s.key}
            className={cls}
            draggable={armed === i}
            onDragStart={() => setDragIdx(i)}
            onDragEnd={() => {
              setDragIdx(null)
              setOverIdx(null)
              setArmed(null)
            }}
            onDragOver={e => {
              e.preventDefault()
              setOverIdx(i)
            }}
            onDrop={e => {
              e.preventDefault()
              drop(i)
            }}
          >
            {/* La fila solo se vuelve arrastrable al tomarla por el asa, para
                que se pueda seleccionar texto en el campo del nombre. */}
            <span
              onMouseDown={() => setArmed(i)}
              onMouseUp={() => setArmed(null)}
              title="Arrastra para reordenar"
              style={{ cursor: 'grab', color: 'rgba(240,249,255,0.28)', fontSize: 12, lineHeight: 1, userSelect: 'none' }}
            >
              ⠿
            </span>
            <span className="dk-num">{s.hidden ? '—' : String(visIdx + 1).padStart(2, '0')}</span>
            <input
              className="dk-label"
              defaultValue={s.label}
              key={s.label}
              title={s.label}
              onBlur={e => onLabel(s.key, e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
              }}
              onDoubleClick={e => e.stopPropagation()}
            />
            {s.kind === 'custom' && <span className="dk-chip nueva">nueva</span>}
            {s.kind === 'dup' && <span className="dk-chip copia">copia</span>}

            <button className="dk-icon" title="Subir" disabled={i === 0} onClick={() => onMove(i, i - 1)}>↑</button>
            <button className="dk-icon" title="Bajar" disabled={i === slides.length - 1} onClick={() => onMove(i, i + 1)}>↓</button>
            <button
              className="dk-icon"
              title={s.hidden ? 'Mostrar en la presentación' : 'Ocultar de la presentación'}
              onClick={() => onToggleHidden(s.key)}
            >
              {s.hidden ? '🚫' : '👁'}
            </button>
            <button className="dk-icon" title="Duplicar" onClick={() => onDuplicate(s.key)}>⧉</button>
            {(s.kind === 'custom' || s.kind === 'dup') && (
              <button
                className="dk-icon danger"
                title="Eliminar esta diapositiva"
                onClick={() => {
                  if (confirm('¿Eliminar esta diapositiva y sus textos?')) onRemove(s.key)
                }}
              >
                ✕
              </button>
            )}
            {!s.hidden && (
              <button
                className="dk-icon"
                title="Ir a esta diapositiva"
                onClick={() => onGoTo(visIdx)}
              >
                ▸
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Controles propios de las diapositivas creadas desde el editor
   ───────────────────────────────────────────────────────────────────────── */

function CustomControls({
  slideKey, customOf, setItems,
}: {
  slideKey: string
  customOf: (key: string) => { key: string; kind: CustomKind; items: number } | undefined
  setItems: (key: string, n: number) => void
}) {
  const custom = slideKey ? customOf(slideKey) : undefined
  if (!custom || custom.kind === 'section' || custom.kind === 'text') return null
  const noun = custom.kind === 'bullets' ? 'viñetas' : 'filas por columna'
  return (
    <>
      <div className="dk-section">Diapositiva nueva</div>
      <div className="dk-toolbar" style={{ alignItems: 'center' }}>
        <span style={{ fontSize: 11.5, color: 'rgba(240,249,255,0.6)', flex: 1, paddingLeft: 4 }}>
          {custom.items} {noun}
        </span>
        <button className="dk-btn ghost" onClick={() => setItems(custom.key, custom.items - 1)} disabled={custom.items <= 1}>
          −
        </button>
        <button className="dk-btn ghost" onClick={() => setItems(custom.key, custom.items + 1)} disabled={custom.items >= 8}>
          ＋
        </button>
      </div>
    </>
  )
}

/* ─────────────────────────────────────────────────────────────────────────
   Todos los textos de la diapositiva en pantalla
   ───────────────────────────────────────────────────────────────────────── */

function TextList({
  slideKey, overrides, onSet, onReset, editing,
}: {
  slideKey: string
  overrides: Record<string, string>
  onSet: (slideKey: string, path: string, value: string) => void
  onReset: (slideKey: string, path: string) => void
  editing: boolean
}) {
  const [entries, setEntries] = useState<TextEntry[]>([])
  const [query, setQuery] = useState('')
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [hl, setHl] = useState<DOMRect | null>(null)
  const hostRef = useRef<HTMLElement | null>(null)

  const refresh = useCallback(() => {
    const { host } = getActiveSlide()
    hostRef.current = host
    setEntries(host ? collectTexts(host) : [])
  }, [])

  useEffect(() => {
    refresh()
    return subscribeActiveSlide(refresh)
  }, [refresh])

  // El texto vive en el DOM, así que al cambiar de diapositiva hay que soltar
  // los borradores: apuntarían a rutas de la anterior.
  useEffect(() => setDrafts({}), [slideKey])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return entries
    return entries.filter(e => e.text.toLowerCase().includes(q))
  }, [entries, query])

  const commit = (path: string, value: string) => {
    const clean = value.replace(/\s+/g, ' ').trim()
    if (!clean) onReset(slideKey, path)
    else onSet(slideKey, path, clean)
    setDrafts(d => {
      const next = { ...d }
      delete next[path]
      return next
    })
  }

  const highlight = (path: string) => {
    const host = hostRef.current
    if (!host) return
    const node = nodeAtPath(host, path)
    const el = node?.parentElement
    if (!el) return setHl(null)
    setHl(el.getBoundingClientRect())
  }

  if (!slideKey) return null

  return (
    <>
      <div className="dk-section">
        Textos de esta diapositiva · {entries.length}
      </div>
      <div style={{ padding: '0 4px' }}>
        <input
          className="dk-search"
          placeholder="Buscar un texto…"
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {entries.length === 0 && (
          <p style={{ fontSize: 11, color: 'rgba(240,249,255,0.35)', margin: '0 0 8px' }}>
            {editing
              ? 'Esta diapositiva no tiene textos editables.'
              : 'Activa la edición para trabajar sobre los textos.'}
          </p>
        )}
        {filtered.map(entry => {
          const edited = overrides[textKey(slideKey, entry.path)] !== undefined
          const value = drafts[entry.path] ?? entry.text
          const rows = Math.min(6, Math.max(1, Math.ceil(value.length / 42)))
          return (
            <div className="dk-text-row" key={entry.path}>
              <textarea
                className={edited ? 'dk-text-input is-edited' : 'dk-text-input'}
                value={value}
                rows={rows}
                title={entry.leaf ? 'También puedes editarlo directamente en la diapositiva' : 'Este texto solo se edita desde aquí'}
                onFocus={() => highlight(entry.path)}
                onBlur={e => {
                  setHl(null)
                  commit(entry.path, e.target.value)
                }}
                onChange={e => setDrafts(d => ({ ...d, [entry.path]: e.target.value }))}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    ;(e.target as HTMLTextAreaElement).blur()
                  }
                  if (e.key === 'Escape') {
                    setDrafts(d => {
                      const next = { ...d }
                      delete next[entry.path]
                      return next
                    })
                    ;(e.target as HTMLTextAreaElement).blur()
                  }
                }}
              />
              <button
                className="dk-icon"
                title={edited ? 'Volver al texto original' : 'Sin cambios'}
                disabled={!edited}
                onClick={() => onReset(slideKey, entry.path)}
                style={{ marginTop: 3 }}
              >
                ⟲
              </button>
            </div>
          )
        })}
      </div>
      {hl &&
        createPortal(
          <div
            data-dk-ui=""
            style={{
              position: 'fixed',
              left: hl.left - 4,
              top: hl.top - 4,
              width: hl.width + 8,
              height: hl.height + 8,
              border: '1.5px solid #00d4ff',
              borderRadius: 6,
              background: 'rgba(0,212,255,0.08)',
              boxShadow: '0 0 22px rgba(0,212,255,0.45)',
              pointerEvents: 'none',
              zIndex: 9998,
            }}
          />,
          document.body,
        )}
    </>
  )
}
