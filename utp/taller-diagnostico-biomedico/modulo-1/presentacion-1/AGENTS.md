# figma-make-app

React + Vite + Tailwind CSS project running inside Figma Make.

## Development Server

A Vite development server is **already running** on `$PORT` (default 8443). You don't need to start it manually.

- Preview URL: The user can access the running app through the preview panel
- Hot reload: Changes to source files are reflected immediately

## Project Structure

This is the canonical project structure. Start with task-relevant files below. Only follow imports or inspect other files when required, when a documented path is missing, or when the repository contradicts this guide.

- `src/main.tsx` - React entrypoint; imports `src/index.css` and mounts `src/App.tsx` into the `#root` element
- `src/App.tsx` - Primary application component and the usual starting point for UI work
- `src/index.css` - Global CSS entrypoint and Tailwind CSS v4 import
- `index.html` - Vite HTML shell containing the `#root` element and loading `src/main.tsx`
- `package.json` - Project dependencies and the Vite build, development, preview, and formatting scripts
- `vite.config.ts` - Vite configuration with React, Tailwind CSS v4, and Figma Make plugins plus the `@` alias for `src`
- `.mise.toml` - Toolchain versions for Node.js and pnpm

## Dependencies

- Runtime: React 19 and React DOM 19
- Styling: Tailwind CSS v4 with the `@tailwindcss/vite` plugin
- Build tooling: Vite 8, TypeScript 5.7, and `@vitejs/plugin-react`
- Formatting: oxfmt

## Styling

This project uses **Tailwind CSS v4** through the `@tailwindcss/vite` plugin configured in `vite.config.ts`. `src/index.css` imports Tailwind with `@import 'tailwindcss';`. Use Tailwind utility classes directly in JSX and put global CSS or Tailwind v4 theme customization in `src/index.css`. This scaffold does not need a Tailwind config file or PostCSS config.

`src/main.tsx` imports `src/index.css`, so global font wiring belongs in `src/index.css`. Keep CSS `@import` statements first, then add any `@font-face` rules and font-family defaults there.

## Code quality

- Use double quotes for strings containing apostrophes (`"We're here to help"`), or escape them in single-quoted strings. An unescaped apostrophe in a single-quoted string breaks the build.
- Ensure JSX tags are closed and braces are balanced.
- Export components as default exports.

---

# Deck — Taller de Diagnóstico Biomédico (UTP)

Presentación de las Clases 1 y 2 (teoría) del taller. La fuente de contenido es
`../Taller_Diagnostico_Biomedico_Teoria_Ampliado_1.docx`: los ocho bloques del material se
corresponden uno a uno con las secciones del deck.

## Cómo está armado

- `src/slides/index.tsx` — el orden del deck, como array `{ id, title, component }`. Es el
  único sitio donde se agrega, quita o reordena una diapositiva.
- `src/slides/SlideLayout.tsx` — el vocabulario visual: `Glass`, `Panel`, `SpecTable`,
  `Callout`, `Formula`, `BlockCover`… Antes de maquetar algo nuevo, mirar si ya existe.
- `src/components/Celestial.tsx` — los motivos del dominio: `Moon`, `Wings`, `Ripples`,
  `Spark`, `Feather`, `WaveLine`. Todo dibujado en SVG; no hay imágenes en el deck.
- `src/components/CelestialField.tsx` — el fondo de cinco capas, montado una sola vez en
  `App.tsx`. Las diapositivas no repiten fondo.
- `src/components/HydroVeil.tsx` — la capa del corte entre diapositivas (onda al avanzar,
  eclipse al retroceder).
- `src/editor/` — modo editor portable. Ver su `README.md`.

## Plantillas que se repiten

Tres estructuras aparecen muchas veces y viven en un solo archivo:

- `BlockCover` (en `SlideLayout.tsx`) — la portadilla de cada uno de los ocho bloques.
- `EtapaCadena.tsx` — las etapas de la cadena funcional del bloque 2, con la cadena en
  miniatura al pie y la etapa encendida.
- `FamiliaEquipo.tsx` — las siete familias de equipo del bloque 7: principio, bloques
  críticos, fallas frecuentes y verificación.
- `ClaseSeparador.tsx` — los separadores de las dos clases.

Si hay que agregar una etapa o una familia, se crea el archivo que llama a la plantilla; no
se copia la maqueta.

## Lenguaje visual

Sigue la guía «Columbina»: dominio lunar, azul noche dominante, cristal translúcido, alas
sólo en portada / separadores / cierre, y agua siempre abstracta (ondas y anillos, nunca
gotas). Las reglas concretas —paleta por rol, duraciones de animación, easing— están
comentadas en `src/index.css`.

- Las animaciones de contenido duran 0,6–1,2 s; las ambientales, 3–8 s.
- El easing por defecto es `cubic-bezier(0.22, 1, 0.36, 1)`.
- Los acentos cálidos (`--alert`, `--ember`, `--verdant`) son funcionales: peligro real,
  advertencia y «dentro de tolerancia». No se usan por variedad cromática.

## Al editar una diapositiva

El modo editor identifica cada texto por su ruta de índices en el DOM. Cambiar estilos o el
texto original es inofensivo; **cambiar el orden o la cantidad de elementos de una
diapositiva puede desalinear las ediciones guardadas de esa diapositiva**. Ante la duda,
exportar el JSON desde el panel antes de tocar el código.
