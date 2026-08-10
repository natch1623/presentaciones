import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
// Imported before index.css so the dark-palette overrides there win, and
// bundled by Vite so the Computer Modern webfonts are served locally.
import 'katex/dist/katex.min.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
