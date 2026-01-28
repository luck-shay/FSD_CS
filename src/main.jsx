import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css' // Keeping this if there are default vite styles, but might remove later
import './styles/global.css' // My global styles
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
