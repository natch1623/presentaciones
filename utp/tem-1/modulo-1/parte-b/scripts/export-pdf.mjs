// Renderiza cada lámina a un PDF de una página y las une en un solo
// archivo. Se sirve a sí mismo la carpeta dist/ en un puerto efímero, así
// que no hace falta levantar Vite aparte: `npm run export:pdf` basta.
//
// El nombre de salida sale de .figma/make/site.json, para que al copiar
// esta carpeta como plantilla de un módulo nuevo el PDF se nombre solo.
import { chromium } from 'playwright'
import { PDFDocument } from 'pdf-lib'
import { fileURLToPath } from 'node:url'
import http from 'node:http'
import path from 'node:path'
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const DIST = path.join(ROOT, 'dist')
const TMP = path.join(ROOT, '.pdf-build')

const STAGE_W = 1280
const STAGE_H = 720

/* ── nombre de salida ── */
function nombreSalida() {
  if (process.env.PDF_OUT) return process.env.PDF_OUT
  try {
    const site = JSON.parse(fs.readFileSync(path.join(ROOT, '.figma/make/site.json'), 'utf8'))
    // "Operadores Diferenciales · Teoría Electromagnética I" → "Operadores Diferenciales"
    const base = String(site.title ?? '').split('·')[0].trim()
    if (base) {
      return base
        .normalize('NFD').replace(/[̀-ͯ]/g, '')   // sin acentos
        .replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-') + '.pdf'
    }
  } catch { /* cae al nombre de la carpeta */ }
  return path.basename(ROOT) + '.pdf'
}
const OUT_FILE = path.join(ROOT, nombreSalida())

if (!fs.existsSync(path.join(DIST, 'index.html'))) {
  console.error('No existe dist/. Ejecuta primero: npm run build')
  process.exit(1)
}

/* ── servidor estático mínimo sobre dist/ ── */
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.woff': 'font/woff', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
}
const server = http.createServer((req, res) => {
  let rel = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  if (rel.endsWith('/')) rel += 'index.html'
  // no salir de dist/
  const file = path.join(DIST, path.normalize(rel).replace(/^([/\\])+/, ''))
  if (!file.startsWith(DIST) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404).end('no encontrado')
    return
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(file)] ?? 'application/octet-stream' })
  fs.createReadStream(file).pipe(res)
})
await new Promise(r => server.listen(0, '127.0.0.1', r))
const URL_BASE = `http://127.0.0.1:${server.address().port}/`

fs.rmSync(TMP, { recursive: true, force: true })
fs.mkdirSync(TMP, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: STAGE_W, height: STAGE_H } })

// `media: 'screen'` evita que Chromium meta estilos de impresión.
// `reducedMotion: 'reduce'` congela los bucles continuos y hace que las
// animaciones de entrada terminen al instante, así ninguna lámina se
// captura a medio aparecer.
await page.emulateMedia({ media: 'screen', reducedMotion: 'reduce' })
await page.goto(URL_BASE, { waitUntil: 'networkidle' })

const total = await page.evaluate(() => document.querySelectorAll('.nav-dot').length)
if (!total) { console.error('No se encontró ninguna lámina'); process.exit(1) }
console.log(`${total} láminas · destino: ${path.basename(OUT_FILE)}`)

for (let i = 0; i < total; i++) {
  await page.evaluate(idx => document.querySelectorAll('.nav-dot')[idx].click(), i)
  // goTo() bloquea ~965 ms entre cambios (265 de salida + 700 de guarda);
  // esperar menos haría que se ignoren clics y se repitan láminas.
  await page.waitForTimeout(1100)
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(250)

  await page.pdf({
    path: path.join(TMP, `slide-${String(i + 1).padStart(3, '0')}.pdf`),
    width: `${STAGE_W}px`, height: `${STAGE_H}px`,
    printBackground: true, margin: { top: 0, bottom: 0, left: 0, right: 0 },
    pageRanges: '1',
  })
  process.stdout.write(`\r  lámina ${i + 1}/${total}   `)
}
console.log()

await browser.close()
server.close()

/* ── unir en un solo PDF ── */
const merged = await PDFDocument.create()
for (let i = 0; i < total; i++) {
  const src = await PDFDocument.load(fs.readFileSync(path.join(TMP, `slide-${String(i + 1).padStart(3, '0')}.pdf`)))
  const [p] = await merged.copyPages(src, [0])
  merged.addPage(p)
}
try {
  const site = JSON.parse(fs.readFileSync(path.join(ROOT, '.figma/make/site.json'), 'utf8'))
  if (site.title) merged.setTitle(site.title)
  if (site.description) merged.setSubject(site.description)
} catch { /* metadatos opcionales */ }
merged.setProducer('playwright + pdf-lib')

fs.writeFileSync(OUT_FILE, await merged.save())
fs.rmSync(TMP, { recursive: true, force: true })
console.log(`Listo: ${OUT_FILE}  (${total} páginas, ${(fs.statSync(OUT_FILE).size / 1048576).toFixed(1)} MB)`)
