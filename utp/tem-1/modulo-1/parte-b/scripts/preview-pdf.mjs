// Rasterizes selected single-page PDFs (see split-pages.mjs) to PNG
// for a visual sanity check, using Chrome's built-in PDF viewer.
import { chromium } from 'playwright'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PAGES_DIR = path.join(__dirname, '..', '.pdf-pages')
const OUT = path.join(__dirname, '..', '.pdf-preview')
const pages = process.argv.slice(2).map(Number)

fs.mkdirSync(OUT, { recursive: true })

// The Playwright-managed Chromium build treats PDFs as a download;
// system Chrome ships the built-in viewer we need to rasterize.
const browser = await chromium.launch({ channel: 'chrome' })
const page = await browser.newPage({ viewport: { width: 1360, height: 780 } })

for (const n of pages) {
  const single = path.join(PAGES_DIR, `p${String(n).padStart(2, '0')}.pdf`)
  await page.goto(`file:///${single.replace(/\\/g, '/')}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  await page.screenshot({ path: path.join(OUT, `p${String(n).padStart(2, '0')}.png`) })
  console.log(`page ${n} -> p${String(n).padStart(2, '0')}.png`)
}

await browser.close()
