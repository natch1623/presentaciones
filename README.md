# Presentaciones

Hub de presentaciones interactivas de los cursos, organizado por institución → curso →
módulo → presentación. Cada presentación es una aplicación independiente de
Vite + React + TypeScript.

**Sitio publicado:** https://natch1623.github.io/presentaciones/

## Estructura

```
.
├── index.html                       portada: elige institución
├── instituciones.json               qué instituciones aparecen en la portada
├── udelas/
│   ├── index.html                   elige curso
│   ├── cursos.json
│   ├── equipos-medicos-1/           Salón de Operaciones
│   │   ├── index.html
│   │   ├── presentaciones.json
│   │   └── modulo-1/
│   │       ├── presentacion-1/
│   │       └── presentacion-2/
│   ├── equipos-medicos-3/           Equipos de Radiodiagnóstico
│   │   ├── index.html
│   │   ├── presentaciones.json
│   │   └── modulo-1/
│   │       └── presentacion-1/
│   └── mantenimiento-equipos/       Mantenimiento en equipos de laboratorio clínico
│       ├── index.html
│       ├── presentaciones.json
│       └── modulo-1/
│           └── presentacion-1/
├── utp/
│   ├── index.html
│   ├── cursos.json
│   ├── tem-1/                       Teoría Electromagnética I
│   │   ├── index.html
│   │   ├── presentaciones.json
│   │   └── modulo-1/
│   │       ├── parte-a/
│   │       └── parte-b/
│   └── taller-diagnostico-biomedico/  Taller de Diagnóstico Biomédico
│       ├── index.html
│       ├── presentaciones.json
│       └── modulo-1/
│           └── presentacion-1/
└── .github/workflows/                compila todo y publica en Pages
```

Cada nivel es un HTML estático (sin build) que lee el `.json` de su propia
carpeta para pintar su menú. Agregar contenido es editar JSON y añadir
carpetas — nunca hay que tocar el HTML de un nivel superior.

## Agregar una presentación nueva a un curso existente

1. Copia una carpeta existente como plantilla, p. ej.:

   ```bash
   cp -r udelas/equipos-medicos-3/modulo-1/presentacion-1 udelas/equipos-medicos-3/modulo-1/presentacion-2
   rm -rf udelas/equipos-medicos-3/modulo-1/presentacion-2/node_modules
   rm -rf udelas/equipos-medicos-3/modulo-1/presentacion-2/dist
   ```

2. Edita el contenido en `src/App.tsx` y el título en `.figma/make/site.json`.

3. Añade su entrada en el `presentaciones.json` del curso, dentro del módulo
   correspondiente:

   ```json
   { "id": "presentacion-2", "etiqueta": "Presentación 2", "titulo": "...",
     "descripcion": "...", "laminas": 30, "estado": "disponible" }
   ```

4. `git push`. El workflow descubre por sí solo cualquier carpeta
   `institución/curso/modulo-*/<presentación>/` que tenga `package.json`, así
   que no hay que tocarlo.

Con `"estado": "pendiente"` la tarjeta aparece atenuada y sin enlace — útil
para anunciar una presentación antes de terminarla.

## Agregar un curso nuevo

1. Crea la carpeta del curso (p. ej. `udelas/mantenimiento-equipos/`) con su
   propio `index.html` + `presentaciones.json` — copia los de
   `udelas/equipos-medicos-3/` como plantilla y ajusta los textos.
2. Añade su entrada en el `cursos.json` de la institución correspondiente.
3. Crea al menos una presentación dentro (ver sección anterior).

## Agregar una institución nueva

1. Crea su carpeta con `index.html` + `cursos.json` — copia `udelas/` o
   `utp/` como plantilla.
2. Añade su entrada en `instituciones.json`, en la raíz.

## Desarrollo local

```bash
cd udelas/equipos-medicos-3/modulo-1/presentacion-1
npm install
npm run dev
```

Para ver el hub completo con las presentaciones ya compiladas, hay que
construir cada una y servir la raíz del repo con sus `dist/` en su sitio —
es exactamente lo que hace el workflow de despliegue.

## Notas

- Cada app usa `base: './'` en `vite.config.ts`. Es lo que permite servirlas
  desde una subcarpeta de GitHub Pages; si lo cambias a `/`, los assets
  darán 404.
- Los binarios (PDF, PNG, etc.) van por Git LFS — cada presentación trae su
  propio `.gitattributes` con las reglas de tracking.
- `Teoría Electromagnética I` (UTP) y `Equipos Médicos I · Presentación 1`
  (UDELAS) se migraron aquí desde sus repos originales (`teoria_electromagnetica_I`
  y `equiposmedicos`) conservando el historial completo de commits vía
  `git subtree`. Esos repos siguen existiendo en GitHub tal cual, pero esta
  carpeta es ahora la ubicación canónica de trabajo.
- `udelas/equipos-medicos-1/modulo-1/presentacion-2/recursos/` (manuales de
  fabricante, ~400 MB) está en `.gitignore` a propósito: no lo usa la app,
  y tiene derechos de terceros — mismo trato que `utp/tem-1/_fuentes/`.
  `presentacion-2/public/videos/` sí se publica (es el video que muestra la
  presentación), vía Git LFS — pesa ~146 MB, así que cada clon completo del
  repo consume una buena parte de la cuota gratuita de LFS de GitHub.

## Atajos de teclado (dentro de cada presentación)

| Tecla | Acción |
|---|---|
| `→` `↓` `espacio` | Siguiente lámina |
| `←` `↑` | Lámina anterior |
| `F` | Pantalla completa |
