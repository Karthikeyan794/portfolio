import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
// before the first render, so it hears every picture and clip load
import './mediaLoading'
import './styles.css'
import './lab.css'
import './cube.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
