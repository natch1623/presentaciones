/**
 * Direcciones estables a los nodos de texto de una slide.
 *
 * La ruta es la secuencia de índices de `childNodes` desde la raíz de la slide
 * hasta el nodo de texto: "1.0.3.0". Mientras el JSX de la slide no cambie, la
 * ruta identifica siempre el mismo texto — y como reemplazar el contenido de un
 * nodo de texto no altera la estructura del árbol, las rutas siguen siendo
 * válidas después de aplicar los overrides.
 */

const TEXT_NODE = 3

export function pathOf(node: Node, root: Element): string | null {
  const parts: number[] = []
  let cur: Node | null = node
  while (cur && cur !== root) {
    const parent: Node | null = cur.parentNode
    if (!parent) return null
    parts.push(Array.prototype.indexOf.call(parent.childNodes, cur))
    cur = parent
  }
  if (cur !== root) return null
  return parts.reverse().join('.')
}

export function nodeAtPath(root: Element, path: string): Node | null {
  let cur: Node = root
  for (const seg of path.split('.')) {
    const child: Node | undefined = cur.childNodes[Number(seg)]
    if (!child) return null
    cur = child
  }
  return cur
}

export interface TextEntry {
  path: string
  text: string
  /** Elemento que contiene el texto; sirve para hacer scroll y resaltar. */
  el: HTMLElement
  /** true si se puede editar in-place (el elemento solo contiene ese texto). */
  leaf: boolean
}

/**
 * Todos los textos visibles de la slide, en orden de lectura.
 *
 * Ignora los nodos en blanco (los separadores que produce JSX) y cualquier cosa
 * marcada como interfaz del editor.
 */
export function collectTexts(root: Element): TextEntry[] {
  const out: TextEntry[] = []
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT
      const parent = node.parentElement
      if (!parent || parent.closest('[data-dk-ui]')) return NodeFilter.FILTER_REJECT
      return NodeFilter.FILTER_ACCEPT
    },
  })
  while (walker.nextNode()) {
    const node = walker.currentNode as Text
    const parent = node.parentElement
    if (!parent) continue
    const path = pathOf(node, root)
    if (!path) continue
    out.push({ path, text: node.nodeValue ?? '', el: parent, leaf: isLeaf(parent) })
  }
  return out
}

/**
 * Un elemento es editable in-place cuando su único hijo es ese texto.
 *
 * La restricción es deliberada: si el elemento mezclara texto con otros
 * elementos (`<p>Nota: <strong>x</strong></p>`), editarlo con contentEditable
 * podría reordenar o borrar hijos y todas las rutas de esa rama quedarían
 * apuntando a otra cosa. Esos textos se editan igual, pero desde la lista del
 * panel, que escribe directamente sobre el nodo correcto.
 */
export function isLeaf(el: Element): boolean {
  return el.childNodes.length === 1 && el.firstChild?.nodeType === TEXT_NODE
}

/** Título representativo de una slide: el encabezado más grande que tenga. */
export function guessTitle(root: Element): string {
  const heading = root.querySelector('h1, h2, h3, .font-display')
  const text = (heading?.textContent ?? root.textContent ?? '').replace(/\s+/g, ' ').trim()
  return text.slice(0, 60)
}
