// Splits the merged deck PDF back into single-page files for a quick
// visual spot check via Chrome's built-in viewer (which needs a
// single-page PDF per screenshot — no reliable way to script "jump
// to page N" against its shadow-DOM toolbar).
import { PDFDocument } from 'pdf-lib'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SRC = path.join(__dirname, '..', 'Analisis-Vectorial-Cap1.pdf')
const OUT = path.join(__dirname, '..', '.pdf-pages')
fs.mkdirSync(OUT, { recursive: true })

const pages = process.argv.slice(2).map(Number)
const src = await PDFDocument.load(fs.readFileSync(SRC))

for (const n of pages) {
  const doc = await PDFDocument.create()
  const [p] = await doc.copyPages(src, [n - 1])
  doc.addPage(p)
  fs.writeFileSync(path.join(OUT, `p${String(n).padStart(2, '0')}.pdf`), await doc.save())
}
console.log('done')
