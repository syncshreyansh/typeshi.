import '@fontsource-variable/google-sans-flex/wght.css'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/pixelify-sans/400.css'
import './index.css'
document.documentElement.classList.add('intro-pending')
window.setTimeout(() => document.documentElement.classList.remove('intro-pending'), 3000)
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
