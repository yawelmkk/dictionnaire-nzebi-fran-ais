import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/playfair-display/600.css'
import '@fontsource/playfair-display/700.css'
import '@fontsource/playfair-display/700-italic.css'

// Force the iOS-style dark earthen theme everywhere
document.documentElement.classList.add('dark')

const rootEl = document.getElementById('root')!;

// Hide splash screen helper (idempotent)
const hideSplash = () => {
  const splash = document.getElementById('splash');
  if (!splash) return;
  splash.classList.add('splash-hidden');
  setTimeout(() => splash.remove(), 350);
};

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Remove splash as soon as React has mounted into #root.
// Multiple triggers ensure it always disappears, even if one path fails.
requestAnimationFrame(() => {
  if (rootEl.childElementCount > 0) {
    hideSplash();
    return;
  }
  const observer = new MutationObserver(() => {
    if (rootEl.childElementCount > 0) {
      observer.disconnect();
      hideSplash();
    }
  });
  observer.observe(rootEl, { childList: true });
  // Safety net: force-remove after 4s no matter what
  setTimeout(() => {
    observer.disconnect();
    hideSplash();
  }, 4000);
});

// In development, unregister any old service worker and clear caches to avoid stale builds
if ('serviceWorker' in navigator && !import.meta.env.PROD) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => registration.unregister());
  });
  if ('caches' in window) {
    caches.keys().then((names) => names.forEach((n) => caches.delete(n)));
  }
}

// In production, force a one-time purge of stale caches from the previous theme
const THEME_VERSION_KEY = 'nzebi-theme-version';
const CURRENT_THEME_VERSION = 'v2-nzebi-dark';
if (typeof window !== 'undefined' && localStorage.getItem(THEME_VERSION_KEY) !== CURRENT_THEME_VERSION) {
  if ('caches' in window) {
    caches.keys().then((names) => Promise.all(names.map((n) => caches.delete(n))))
      .then(() => {
        localStorage.setItem(THEME_VERSION_KEY, CURRENT_THEME_VERSION);
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.getRegistrations().then((regs) => {
            if (regs.length > 0) {
              Promise.all(regs.map((r) => r.update())).finally(() => {
                // Reload once so the freshly served assets take effect
                if (!sessionStorage.getItem('nzebi-theme-reloaded')) {
                  sessionStorage.setItem('nzebi-theme-reloaded', '1');
                  window.location.reload();
                }
              });
            } else {
              localStorage.setItem(THEME_VERSION_KEY, CURRENT_THEME_VERSION);
            }
          });
        }
      });
  } else {
    localStorage.setItem(THEME_VERSION_KEY, CURRENT_THEME_VERSION);
  }
}

// Register Service Worker for offline support in production only
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    const baseUrl = (import.meta as any).env?.BASE_URL || './';
    const swPath = './service-worker.js';
    
    navigator.serviceWorker.register(swPath, { scope: baseUrl })
      .then((registration) => {
        console.log('[SW] Registration successful:', registration);
      })
      .catch((error) => {
        console.error('[SW] Registration failed:', error);
      });
  });
}


