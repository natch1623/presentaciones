/**
 * Puntero al nodo DOM de la slide que se está mostrando.
 *
 * El panel vive fuera del lienzo escalado, así que no puede llegar a la slide
 * por props ni por contexto de React. Este registro mínimo le da acceso al
 * elemento real para leer sus textos y resaltarlos.
 */

let host: HTMLElement | null = null
let key = ''
const subscribers = new Set<() => void>()

export function setActiveSlide(el: HTMLElement | null, slideKey: string) {
  host = el
  key = slideKey
  subscribers.forEach(fn => fn())
}

export function getActiveSlide(): { host: HTMLElement | null; key: string } {
  return { host, key }
}

export function subscribeActiveSlide(fn: () => void): () => void {
  subscribers.add(fn)
  return () => subscribers.delete(fn)
}

/** Avisa al panel de que el contenido de la slide cambió y debe releerlo. */
export function notifySlideChanged() {
  subscribers.forEach(fn => fn())
}
