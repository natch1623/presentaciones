/**
 * Modelo de datos del modo editor.
 *
 * El editor nunca toca el código fuente de las slides: guarda un "parche"
 * (DeckState) que se aplica encima del deck original. Por eso el JSX de cada
 * slide puede seguir siendo tan libre como quiera — el editor trabaja sobre el
 * DOM ya renderizado, no sobre el código.
 */

/** Plantillas disponibles para las slides que crea el usuario. */
export type CustomKind = 'section' | 'bullets' | 'text' | 'twocol'

export interface CustomSlide {
  /** Clave de instancia; también es la clave de sus overrides de texto. */
  key: string
  kind: CustomKind
  /** Cuántas viñetas/filas dibuja la plantilla (el texto vive en overrides). */
  items: number
}

export interface DeckState {
  version: 1
  /** Orden completo de instancias, incluidas las ocultas. */
  order: string[]
  /** Claves de instancia ocultas en la presentación. */
  hidden: string[]
  /** instanceKey → id de la slide base que duplica. */
  dups: Record<string, string>
  /** Slides creadas desde el editor. */
  custom: CustomSlide[]
  /** `${instanceKey}::${path}` → texto reemplazado. */
  text: Record<string, string>
  /** Nombre mostrado en el panel, cuando el usuario lo cambia. */
  labels: Record<string, string>
}

export const EMPTY_STATE: DeckState = {
  version: 1,
  order: [],
  hidden: [],
  dups: {},
  custom: [],
  text: {},
  labels: {},
}

/** Una slide ya resuelta y lista para navegar o listar en el panel. */
export interface DeckSlide {
  key: string
  label: string
  hidden: boolean
  kind: 'base' | 'dup' | 'custom'
  /** Slide base de la que proviene ('' para las custom). */
  baseId: string
}

export const textKey = (slideKey: string, path: string) => `${slideKey}::${path}`
