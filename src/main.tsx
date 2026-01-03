import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// remove splash screen once React has mounted, but ensure a minimum visible duration
(() => {
  const MIN_DISPLAY = 600; // milliseconds
  const removeSplash = () => {
    try {
      const splash = document.getElementById('splash');
      if (splash) {
        splash.classList.add('splash-hidden');
        setTimeout(() => splash.remove(), 350);
      }
    } catch (e) {
      // ignore
    }
  };

  const start = (window as any).__splashStart || Date.now();
  const elapsed = Date.now() - start;
  const wait = Math.max(0, MIN_DISPLAY - elapsed);
  setTimeout(removeSplash, wait);
})();


