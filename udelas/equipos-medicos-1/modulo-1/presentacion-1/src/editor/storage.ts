import { EMPTY_STATE, type DeckState } from './types'

/**
 * Persistencia del parche del editor.
 *
 * localStorage es suficiente: el parche son solo cadenas de texto y listas de
 * ids, no imágenes, así que queda muy por debajo de la cuota del navegador.
 * El export a JSON es la vía para respaldarlo o moverlo a otra máquina.
 */

const PREFIX = 'deck-editor:'

export function loadState(deckId: string): DeckState {
  try {
    const raw = localStorage.getItem(PREFIX + deckId)
    if (!raw) return { ...EMPTY_STATE }
    return normalize(JSON.parse(raw))
  } catch {
    return { ...EMPTY_STATE }
  }
}

export function saveState(deckId: string, state: DeckState) {
  try {
    localStorage.setItem(PREFIX + deckId, JSON.stringify(state))
  } catch (err) {
    // Cuota llena o almacenamiento bloqueado (modo incógnito estricto). El
    // editor sigue funcionando en memoria; solo se pierde al recargar.
    console.warn('[editor] no se pudo guardar el estado:', err)
  }
}

export function clearState(deckId: string) {
  try {
    localStorage.removeItem(PREFIX + deckId)
  } catch {
    /* ignorado */
  }
}

/** Rellena campos ausentes para que un JSON viejo o recortado no rompa nada. */
export function normalize(raw: unknown): DeckState {
  const s = (raw ?? {}) as Partial<DeckState>
  return {
    version: 1,
    order: Array.isArray(s.order) ? s.order.filter(x => typeof x === 'string') : [],
    hidden: Array.isArray(s.hidden) ? s.hidden.filter(x => typeof x === 'string') : [],
    dups: isRecord(s.dups) ? (s.dups as Record<string, string>) : {},
    custom: Array.isArray(s.custom) ? (s.custom as DeckState['custom']) : [],
    text: isRecord(s.text) ? (s.text as Record<string, string>) : {},
    labels: isRecord(s.labels) ? (s.labels as Record<string, string>) : {},
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v)
}

export function downloadState(deckId: string, state: DeckState) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${deckId}-ediciones.json`
  document.body.appendChild(a)
  a.click()
  a.remove()
  // El objeto URL se libera en el siguiente tick: revocarlo de inmediato
  // cancela la descarga en algunos navegadores.
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function pickStateFile(): Promise<DeckState | null> {
  return new Promise(resolve => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json,.json'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return resolve(null)
      try {
        resolve(normalize(JSON.parse(await file.text())))
      } catch {
        resolve(null)
      }
    }
    input.click()
  })
}
