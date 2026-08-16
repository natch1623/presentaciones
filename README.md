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
│   │   ├── modulo-1/                Fundamentos matemáticos
│   │   │   ├── parte-a/
│   │   │   └── parte-b/
│   │   ├── modulo-2/                Campos Electrostáticos
│   │   │   ├── parte-a/
│   │   │   ├── parte-b/
│   │   │   └── parte-c/
│   │   └── modulo-3/                Materiales Eléctricos
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

## Navegación

Cada nivel tiene que poder salir del que está. Son dos mecanismos:

- **En el hub** (portada, institución, curso), una miga de pan `.miga` arriba
  del encabezado: `Presentaciones / UTP / Teoría Electromagnética I`. La
  portada no lleva porque es la raíz.
- **Dentro de una presentación**, un enlace al curso arriba a la izquierda,
  más `Esc`. Los decks viven en `<curso>/modulo-N/<deck>/`, así que el destino
  es siempre `../../`.

`Esc` sólo sale del deck **cuando no está en pantalla completa**: en fullscreen
el navegador se queda con el primer `Esc`, y robárselo sacaría al expositor del
proyector y de la presentación de un solo golpe.

Los decks de los módulos 2 y 3 de TEM I traen el enlace en `deck.tsx` (prop
`backLabel`). Los otros siete lo llevan en su `index.html`, fuera del `#root`:
cada uno tiene su propia arquitectura interna — algunos son un `App.tsx` de
2500 líneas — y el enlace no debe depender de ninguna. Al agregar un deck
nuevo, comprobar que tenga una de las dos.

## Cómo está armado un deck

Los decks del módulo 1 de TEM I son un solo `src/App.tsx` de ~2500 líneas. A
partir del módulo 2 están partidos en dos archivos, y conviene mantenerlo así:

- **`src/theme.tsx`** — las cinco salas: paletas, los fondos animados en canvas,
  los telones a pantalla completa y el adorno de cada título.
- **`src/deck.tsx`** — el motor: el renderizador de fórmulas `Fx`, el tablero de
  300×300 de los diagramas, la capa de composición y el componente `<Deck>` con
  la navegación y los atajos de teclado.
- **`src/App.tsx`** — sólo lo propio del deck: sus diagramas SVG, el arreglo
  `SLIDES`, las tres funciones que dicen de qué acto es cada lámina
  (`accentFor`, `actLabel`, `actNumeral`) y qué tema usa.

Para un deck nuevo, copiar una carpeta del módulo 2 o 3 y reescribir **sólo**
`App.tsx`. Si hay que tocar el motor, el cambio se replica a los otros cuatro
copiando `deck.tsx`, `theme.tsx` e `index.css` — son copias independientes a
propósito, para que un ajuste de estilo en un módulo no altere los decks ya
dictados.

### La estética

Cada deck tiene su propia sala, construida con su propio tema — no es un
recoloreado del anterior. `src/theme.tsx` define las cinco:

| Deck | Tema | La sala | Los títulos |
|---|---|---|---|
| M2·A | `coulomb` | esquirlas de hielo alineadas a un campo quieto | cristalizan |
| M2·B | `gauss` | cascarones de flujo saliendo de sus fuentes | se expanden |
| M2·C | `potencial` | un mapa de curvas de nivel que respira | suben |
| M3·A | `corriente` | una red cristalina por la que derivan portadores | derivan |
| M3·B | `dielectrico` | dipolos que se alinean y se relajan | se alinean |

El tema también decide el fondo a pantalla completa, la familia de transición
(el deck de potencial *sube* entre láminas, el de corriente se desliza), el
adorno que cierra la regla de cada título y la silueta de las superficies.

Tres reglas que no conviene romper:

- **El código de signo es la paleta.** Naranja `#E4572E` es carga positiva y
  nada más; cian `#7FC8E8` es carga negativa. Es lo único que no cambia entre
  temas — si el naranja se usa de adorno, los diagramas dejan de poder leerse
  de un vistazo.
- **La atmósfera va al fondo y tenue.** Un diagrama de campo tiene que leerse
  desde la última fila del salón; ninguna sala compite con él.
- **Un solo elemento con entrada fuerte por lámina: el título.** Todo lo demás
  llega en silencio, con 45 ms de separación entre ítems. Una lámina que anima
  ocho viñetas en secuencia es una lámina que todavía no se puede leer.

### La composición

Las láminas son escenas, no páginas. No hay tarjetas, ni paneles con borde, ni
grids: la estructura la dan la tipografía, las reglas de un pelo y el espacio
negativo. En concreto:

- El diagrama **sangra** fuera del escenario y se disuelve con una máscara en
  vez de terminar en un marco (`<Bleed>`).
- La composición es asimétrica y **alterna de lado según el número de lámina**,
  para que dos consecutivas nunca rimen (`lean()`).
- Los actos de la agenda son una escalera, no un cuadro de cuatro tarjetas.
- La profundidad viene por capas: numeral fantasma al fondo (`<Ghost>`),
  diagrama en medio, tipografía adelante.

### El mini-lenguaje de las fórmulas

Todo texto que pase por `<Fx>`, `MLabel`, `RLabel`, `FxHtml` o los campos
`formulas` / `items` de una lámina acepta:

| Marca | Efecto |
|---|---|
| `_x` `_{enc}` | subíndice |
| `^2` `^{-1}` | superíndice |
| `*A*` | negrita (cantidad vectorial, según el convenio de Hayt) |
| `@{num}{den}` | fracción apilada |

Sin llaves, `_` y `^` toman **un solo carácter**: `Q_enc` se ve como *Qₑnc*.
Para subíndices de más de una letra hay que escribir `Q_{enc}`. Un `<text>` de
SVG escrito a mano no pasa por el renderizador — hay que envolverlo en
`fxTspans(...)` o los asteriscos salen impresos.

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
