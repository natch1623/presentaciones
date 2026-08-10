import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from 'react'
import { clearState, downloadState, loadState, pickStateFile, saveState } from './storage'
import { EMPTY_STATE, textKey, type CustomKind, type CustomSlide, type DeckSlide, type DeckState } from './types'

export interface BaseSlide {
  id: string
  title?: string
  component: ComponentType
}

interface ProviderProps {
  /** Identifica el deck en localStorage; cámbialo si clonas la presentación. */
  deckId: string
  baseSlides: BaseSlide[]
  /** Dibuja las slides creadas desde el editor, con el estilo del deck. */
  renderCustom: (slide: CustomSlide) => ReactNode
  children: ReactNode
}

interface DeckApi {
  editing: boolean
  panelOpen: boolean
  setPanelOpen: (v: boolean) => void
  setEditing: (v: boolean) => void

  /** Todas las slides en orden, incluidas las ocultas (para el panel). */
  allSlides: DeckSlide[]
  /** Las que se presentan, en orden. */
  visibleSlides: DeckSlide[]
  renderSlide: (key: string) => ReactNode
  customOf: (key: string) => CustomSlide | undefined

  overrides: Record<string, string>
  setText: (slideKey: string, path: string, value: string) => void
  resetText: (slideKey: string, path: string) => void

  toggleHidden: (key: string) => void
  moveTo: (from: number, to: number) => void
  duplicate: (key: string) => string
  addCustom: (kind: CustomKind, afterKey?: string) => string
  removeSlide: (key: string) => void
  setItems: (key: string, items: number) => void
  setLabel: (key: string, label: string) => void

  exportJson: () => void
  importJson: () => Promise<boolean>
  resetAll: () => void
  editCount: number
  /** Cambia cuando hay que remontar la slide desde cero (deshacer un texto). */
  nonce: number
}

const Ctx = createContext<DeckApi | null>(null)

export function useDeck(): DeckApi {
  const api = useContext(Ctx)
  if (!api) throw new Error('useDeck debe usarse dentro de <EditorProvider>')
  return api
}

const DEFAULT_LABEL: Record<CustomKind, string> = {
  section: 'Nueva sección',
  bullets: 'Nueva slide con viñetas',
  text: 'Nueva slide de texto',
  twocol: 'Nueva slide a dos columnas',
}

const DEFAULT_ITEMS: Record<CustomKind, number> = {
  section: 0,
  bullets: 4,
  text: 0,
  twocol: 3,
}

export function EditorProvider({ deckId, baseSlides, renderCustom, children }: ProviderProps) {
  const [state, setState] = useState<DeckState>(() => loadState(deckId))
  const [editing, setEditing] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [nonce, setNonce] = useState(0)
  const firstRun = useRef(true)

  // No escribimos en el primer render: cargar y volver a guardar lo mismo solo
  // gastaría una escritura y borraría un estado válido si el parseo falló.
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    saveState(deckId, state)
  }, [deckId, state])

  // Salir del modo edición cierra cualquier campo abierto; el panel puede
  // seguir abierto para reordenar sin riesgo de escribir sobre una slide.
  const setEditingSafe = useCallback((v: boolean) => {
    if (!v) (document.activeElement as HTMLElement | null)?.blur?.()
    setEditing(v)
  }, [])

  const baseById = useMemo(() => new Map(baseSlides.map(s => [s.id, s])), [baseSlides])
  const customByKey = useMemo(() => new Map(state.custom.map(c => [c.key, c])), [state.custom])

  // El orden efectivo se calcula siempre a partir de un estado concreto. Los
  // mutadores lo recalculan dentro del updater en lugar de leer el `order` del
  // render: dos cambios seguidos dentro del mismo lote de React partirían del
  // mismo valor viejo y el segundo borraría al primero.
  const baseIdsRef = useRef<string[]>([])
  baseIdsRef.current = baseSlides.map(s => s.id)

  const orderOf = useCallback(
    (s: DeckState) => mergeOrder(baseIdsRef.current, s.order, s.custom.map(c => c.key), Object.keys(s.dups)),
    [],
  )

  const order = useMemo(() => orderOf(state), [orderOf, state])

  const allSlides = useMemo<DeckSlide[]>(() => {
    const hidden = new Set(state.hidden)
    return order.map(key => {
      const custom = customByKey.get(key)
      if (custom) {
        return {
          key,
          label: state.labels[key] ?? DEFAULT_LABEL[custom.kind],
          hidden: hidden.has(key),
          kind: 'custom' as const,
          baseId: '',
        }
      }
      const baseId = state.dups[key] ?? key
      const base = baseById.get(baseId)
      const fallback = base?.title ?? baseId
      return {
        key,
        label: state.labels[key] ?? (state.dups[key] ? `${fallback} (copia)` : fallback),
        hidden: hidden.has(key),
        kind: state.dups[key] ? ('dup' as const) : ('base' as const),
        baseId,
      }
    })
  }, [order, state.hidden, state.labels, state.dups, baseById, customByKey])

  const visibleSlides = useMemo(() => allSlides.filter(s => !s.hidden), [allSlides])

  const renderSlide = useCallback(
    (key: string): ReactNode => {
      const custom = customByKey.get(key)
      if (custom) return renderCustom(custom)
      const base = baseById.get(state.dups[key] ?? key)
      if (!base) return null
      const C = base.component
      return <C />
    },
    [baseById, customByKey, renderCustom, state.dups],
  )

  const customOf = useCallback((key: string) => customByKey.get(key), [customByKey])

  const setText = useCallback((slideKey: string, path: string, value: string) => {
    setState(s => ({ ...s, text: { ...s.text, [textKey(slideKey, path)]: value } }))
  }, [])

  const resetText = useCallback((slideKey: string, path: string) => {
    setState(s => {
      const text = { ...s.text }
      delete text[textKey(slideKey, path)]
      return { ...s, text }
    })
    // El DOM ya tiene el texto editado y React no lo volvería a tocar, así que
    // remontamos la slide para que vuelva a nacer con el contenido original.
    setNonce(n => n + 1)
  }, [])

  const toggleHidden = useCallback((key: string) => {
    setState(s => ({
      ...s,
      hidden: s.hidden.includes(key) ? s.hidden.filter(k => k !== key) : [...s.hidden, key],
    }))
  }, [])

  const moveTo = useCallback(
    (from: number, to: number) => {
      setState(s => {
        const next = orderOf(s)
        if (from < 0 || from >= next.length || to < 0 || to >= next.length || from === to) return s
        const [moved] = next.splice(from, 1)
        next.splice(to, 0, moved)
        return { ...s, order: next }
      })
    },
    [orderOf],
  )

  const duplicate = useCallback(
    (key: string) => {
      const newKey = `${key}~${uid()}`
      setState(s => {
        const baseId = s.dups[key] ?? key
        const nextOrder = orderOf(s)
        const at = nextOrder.indexOf(key)
        nextOrder.splice(at < 0 ? nextOrder.length : at + 1, 0, newKey)

        // Una copia arranca con los textos ya editados del original, pero desde
        // ahí las dos versiones evolucionan por separado.
        const text = { ...s.text }
        const prefix = `${key}::`
        for (const [k, v] of Object.entries(s.text)) {
          if (k.startsWith(prefix)) text[`${newKey}::${k.slice(prefix.length)}`] = v
        }

        const custom = s.custom.find(c => c.key === key)
        return {
          ...s,
          order: nextOrder,
          text,
          custom: custom ? [...s.custom, { ...custom, key: newKey }] : s.custom,
          dups: custom ? s.dups : { ...s.dups, [newKey]: baseId },
        }
      })
      return newKey
    },
    [orderOf],
  )

  const addCustom = useCallback(
    (kind: CustomKind, afterKey?: string) => {
      const key = `nueva-${uid()}`
      setState(s => {
        const nextOrder = orderOf(s)
        const at = afterKey ? nextOrder.indexOf(afterKey) : nextOrder.length - 1
        nextOrder.splice(at < 0 ? nextOrder.length : at + 1, 0, key)
        return {
          ...s,
          order: nextOrder,
          custom: [...s.custom, { key, kind, items: DEFAULT_ITEMS[kind] }],
        }
      })
      return key
    },
    [orderOf],
  )

  const removeSlide = useCallback((key: string) => {
    setState(s => {
      const text = { ...s.text }
      const prefix = `${key}::`
      for (const k of Object.keys(text)) if (k.startsWith(prefix)) delete text[k]
      const labels = { ...s.labels }
      delete labels[key]
      const dups = { ...s.dups }
      delete dups[key]
      return {
        ...s,
        order: orderOf(s).filter(k => k !== key),
        hidden: s.hidden.filter(k => k !== key),
        custom: s.custom.filter(c => c.key !== key),
        dups,
        labels,
        text,
      }
    })
  }, [orderOf])

  const setItems = useCallback((key: string, items: number) => {
    setState(s => ({
      ...s,
      custom: s.custom.map(c => (c.key === key ? { ...c, items: Math.max(0, Math.min(8, items)) } : c)),
    }))
  }, [])

  const setLabel = useCallback((key: string, label: string) => {
    setState(s => {
      const labels = { ...s.labels }
      if (label.trim()) labels[key] = label.trim()
      else delete labels[key]
      return { ...s, labels }
    })
  }, [])

  const exportJson = useCallback(() => downloadState(deckId, { ...state, order }), [deckId, state, order])

  const importJson = useCallback(async () => {
    const loaded = await pickStateFile()
    if (!loaded) return false
    setState(loaded)
    setNonce(n => n + 1)
    return true
  }, [])

  const resetAll = useCallback(() => {
    clearState(deckId)
    setState({ ...EMPTY_STATE })
    setNonce(n => n + 1)
  }, [deckId])

  const editCount = useMemo(
    () =>
      Object.keys(state.text).length +
      state.hidden.length +
      state.custom.length +
      Object.keys(state.dups).length +
      (state.order.length ? 1 : 0),
    [state],
  )

  const api = useMemo<DeckApi>(
    () => ({
      editing,
      setEditing: setEditingSafe,
      panelOpen,
      setPanelOpen,
      allSlides,
      visibleSlides,
      renderSlide,
      customOf,
      overrides: state.text,
      setText,
      resetText,
      toggleHidden,
      moveTo,
      duplicate,
      addCustom,
      removeSlide,
      setItems,
      setLabel,
      exportJson,
      importJson,
      resetAll,
      editCount,
      nonce,
    }),
    [
      editing, setEditingSafe, panelOpen, allSlides, visibleSlides, renderSlide, customOf,
      state.text, setText, resetText, toggleHidden, moveTo, duplicate, addCustom, removeSlide,
      setItems, setLabel, exportJson, importJson, resetAll, editCount, nonce,
    ],
  )

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}

/**
 * Une el orden guardado con el del código.
 *
 * Si mañana se agrega una slide nueva al array del deck, aparece junto a su
 * vecina original en lugar de caer al final; y si se borra una del código, su
 * entrada guardada desaparece sin dejar un hueco.
 */
function mergeOrder(baseIds: string[], saved: string[], customKeys: string[], dupKeys: string[]): string[] {
  const known = new Set([...baseIds, ...customKeys, ...dupKeys])
  const result = saved.filter(k => known.has(k))
  const present = new Set(result)

  baseIds.forEach((id, i) => {
    if (present.has(id)) return
    // Ancla en la última slide base anterior que sí esté colocada.
    let at = 0
    for (let j = i - 1; j >= 0; j--) {
      const idx = result.indexOf(baseIds[j])
      if (idx >= 0) {
        at = idx + 1
        break
      }
    }
    result.splice(at, 0, id)
    present.add(id)
  })

  for (const k of [...customKeys, ...dupKeys]) if (!present.has(k)) result.push(k)
  return result
}

let counter = 0
const uid = () => `${Date.now().toString(36)}${(counter++).toString(36)}`
