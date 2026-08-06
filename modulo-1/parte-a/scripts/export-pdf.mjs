// Renders every slide of the deck to a full-page PDF via a headless
// browser. Run against the Vite dev server (npm run dev) so the
// interactive diagrams and web fonts load exactly as in the preview.
import { chromium } from 'playwright'
import { PDFDocument } from 'pdf-lib'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const OUT_DIR = path.join(__dirname, '..', '.pdf-build')
const OUT_FILE = path.join(__dirname, '..', 'Analisis-Vectorial-Cap1.pdf')
const URL = process.env.DECK_URL ?? 'http://localhost:5183'
const STAGE_W = 1280
const STAGE_H = 720

fs.rmSync(OUT_DIR, { recursive: true, force: true })
fs.mkdirSync(OUT_DIR, { recursive: true })

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: STAGE_W, height: STAGE_H } })

// `media: 'screen'` keeps Chromium's print pipeline from swapping in
// print user-agent styles; `reducedMotion` freezes the continuous
// loops so no diagram is caught mid-frame.
await page.emulateMedia({ media: 'screen', reducedMotion: 'reduce' })
await page.goto(URL, { waitUntil: 'networkidle' })

const total = await page.evaluate(() => document.querySelectorAll('.nav-dot').length)
console.log(`Found ${total} slides`)

for (let i = 0; i < total; i++) {
  await page.evaluate(idx => {
    document.querySelectorAll('.nav-dot')[idx].click()
  }, i)
  // Entrance animations run up to ~1.3s after the DOM swap; give them
  // room to finish, then a little more so images have decoded.
  await page.waitForTimeout(900)
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(300)

  const pdfPath = path.join(OUT_DIR, `slide-${String(i + 1).padStart(2, '0')}.pdf`)
  await page.pdf({
    path: pdfPath,
    width: `${STAGE_W}px`,
    height: `${STAGE_H}px`,
    printBackground: true,
    margin: { top: 0, bottom: 0, left: 0, right: 0 },
    pageRanges: '1',
  })
  console.log(`  slide ${i + 1}/${total} -> ${path.basename(pdfPath)}`)
}

await browser.close()

// Merge the per-slide single-page PDFs into one deck, in order.
const merged = await PDFDocument.create()
for (let i = 0; i < total; i++) {
  const bytes = fs.readFileSync(path.join(OUT_DIR, `slide-${String(i + 1).padStart(2, '0')}.pdf`))
  const src = await PDFDocument.load(bytes)
  const [copied] = await merged.copyPages(src, [0])
  merged.addPage(copied)
}
fs.writeFileSync(OUT_FILE, await merged.save())
fs.rmSync(OUT_DIR, { recursive: true, force: true })
console.log(`\nWrote ${OUT_FILE}`)
