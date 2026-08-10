# Modo editor

Permite editar el contenido de la presentación desde el navegador —sin tocar el código—
y guardar los cambios en el equipo de quien la presenta.

## Cómo se usa

- **`E`** abre y cierra el panel. También está el botón `✎ Editar` abajo a la derecha.
- **Textos:** con la edición activada, haz clic sobre cualquier texto y escribe.
  `Enter` guarda, `Esc` descarta, dejarlo vacío lo devuelve a su versión original.
  - Borde **cian** = se edita ahí mismo.
  - Borde **naranja punteado** = ese texto comparte elemento con otros (`Nota: **algo**`),
    así que se edita desde la lista *Textos de esta diapositiva* del panel.
    Esa lista incluye **todos** los textos de la diapositiva, sin excepción.
- **Diapositivas:** el panel lista las 24 del deck. Cada fila permite ocultarla del pase
  (`👁`), moverla (`↑ ↓` o arrastrando por `⠿`), duplicarla (`⧉`) y renombrarla —el nombre
  es solo para el panel—. Las copias y las nuevas también se pueden eliminar (`✕`).
- **Nuevas:** `＋ Nueva diapositiva` inserta una plantilla después de la actual y salta a
  ella. Las plantillas viven en [`../slides/CustomSlide.tsx`](../slides/CustomSlide.tsx) y
  usan los mismos componentes que el resto del deck.
- **Guardar:** todo se guarda solo en `localStorage`. `Exportar` descarga un JSON para
  respaldarlo o pasarlo a otra computadora; `Importar` lo vuelve a cargar.

Con la edición apagada el deck se comporta exactamente como antes: mismas transiciones,
mismos atajos.

## Cómo funciona

El editor no reescribe el JSX de las diapositivas: aplica un **parche sobre el DOM ya
renderizado**. Cada texto se identifica por su ruta de índices desde la raíz de la
diapositiva (`0.8.4.0`), y reemplazar el contenido de un nodo de texto no altera la
estructura del árbol, así que las rutas siguen siendo válidas.

Eso es lo que hace que sirva para cualquier diapositiva por compleja que sea —tablas,
tarjetas, líneas de tiempo— sin convertir su contenido a un esquema de datos.

**La consecuencia a tener en cuenta:** si se edita el JSX de una diapositiva y se cambia
el *orden o la cantidad* de sus elementos, las ediciones guardadas de esa diapositiva
pueden quedar apuntando a otro texto. Cambiar estilos, colores o el texto original es
inofensivo. Ante la duda: exportar el JSON antes de tocar el código.

## Archivos

| Archivo | Qué hace |
|---|---|
| `DeckContext.tsx` | Estado del parche (orden, ocultas, copias, nuevas, textos) y su API |
| `EditableSlide.tsx` | Aplica los textos editados y gestiona la edición in-place |
| `EditorPanel.tsx` | El panel: lista de diapositivas, textos, exportar/importar |
| `textPath.ts` | Rutas estables a los nodos de texto |
| `storage.ts` | `localStorage` + export/import JSON |
| `activeSlide.ts` | Puntero a la diapositiva en pantalla, para que el panel la lea |
| `types.ts` | Modelo del parche |

## Llevarlo a otra presentación

1. Copiar la carpeta `src/editor/` completa.
2. Copiar `src/slides/CustomSlide.tsx` y ajustar sus plantillas al estilo de ese deck.
3. El deck necesita exponer sus diapositivas como un array de
   `{ id, title, component }`. Los decks con todo en un `App.tsx` monolítico hay que
   partirlos primero en ese array (los componentes pueden seguir en el mismo archivo).
4. En `App.tsx`: envolver con `<EditorProvider deckId="…" baseSlides={…} renderCustom={…}>`,
   leer `visibleSlides` / `renderSlide` con `useDeck()`, envolver la diapositiva con
   `<EditableSlide slideKey={…}>` y montar `<EditorPanel current={…} onGoTo={…} />`.
5. Usar un **`deckId` distinto por presentación**: es la clave de `localStorage` y dos
   decks con el mismo id se pisarían las ediciones.

El manejador global de teclado del deck debe ignorar los eventos cuyo destino sea un
campo de texto, o el `→` avanzará la diapositiva mientras se escribe:

```ts
const t = e.target as HTMLElement | null
if (t?.isContentEditable || t?.tagName === 'INPUT' || t?.tagName === 'TEXTAREA' || t?.closest?.('[data-dk-ui]')) return
```
