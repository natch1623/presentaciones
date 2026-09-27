import { defineConfig } from 'vite'

// Rutas relativas: el deck se publica en <curso>/modulo-2/presentacion-1/
export default defineConfig({
  base: './',
  server: { strictPort: true },
})
