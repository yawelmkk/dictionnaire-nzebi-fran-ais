import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// remove splash screen once React has mounted
setTimeout(() => {
  try {
    const splash = document.getElementById('splash');
    if (splash) {
      splash.classList.add('splash-hidden');
      setTimeout(() => splash.remove(), 350);
    }
  } catch (e) {
    // ignore
  }
}, 0);


