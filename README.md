# Teoría Electromagnética I

Presentaciones interactivas del curso (UDELAS). Cada presentación es una aplicación
independiente de Vite + React + TypeScript, con diagramas SVG animados y manipulables.

**Sitio publicado:** https://natch1623.github.io/teoria_electromagnetica_I/

## Estructura

```
.
├── index.html              menú principal (HTML estático, sin build)
├── presentaciones.json     qué módulos y partes aparecen en el menú
├── modulo-1/
│   ├── parte-a/            Análisis Vectorial
│   └── parte-b/            Operadores Diferenciales
└── .github/workflows/      compila todo y publica en Pages
```

## Agregar una presentación nueva

1. Copia una carpeta existente como plantilla:

   ```bash
   cp -r modulo-1/parte-b modulo-2/parte-a
   rm -rf modulo-2/parte-a/node_modules modulo-2/parte-a/dist
   ```

2. Edita el contenido en `modulo-2/parte-a/src/App.tsx` y el título en
   `modulo-2/parte-a/.figma/make/site.json`.

3. Añade su entrada en `presentaciones.json`, dentro del módulo correspondiente:

   ```json
   { "id": "parte-a", "etiqueta": "Parte A", "titulo": "...",
     "descripcion": "...", "referencia": "...", "laminas": 24,
     "estado": "disponible" }
   ```

4. `git push`. El workflow descubre por sí solo cualquier carpeta `modulo-*/*/`
   que tenga `package.json`, así que no hay que tocarlo.

Con `"estado": "pendiente"` la tarjeta aparece atenuada y sin enlace — útil para
anunciar una parte antes de terminarla.

## Desarrollo local

```bash
cd modulo-1/parte-b
npm install
npm run dev
```

Para ver el menú junto a las presentaciones compiladas:

```bash
npm --prefix modulo-1/parte-a run build && npm --prefix modulo-1/parte-b run build
# servir la raíz del repo con las carpetas dist/ en su sitio
```

## Notas

- Cada app usa `base: './'` en `vite.config.ts`. Es lo que permite servirlas desde
  una subcarpeta de GitHub Pages; si lo cambias a `/`, los assets darán 404.
- La carpeta `_fuentes/` (libros de texto y escaneos del programa) está en
  `.gitignore` a propósito: son obras con derechos de autor y este repositorio
  es público.

## Atajos de teclado

| Tecla | Acción |
|---|---|
| `→` `↓` `espacio` | Siguiente lámina |
| `←` `↑` | Lámina anterior |
| `Inicio` / `Fin` | Primera / última |
| `F` | Pantalla completa |
