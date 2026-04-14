import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// In development, unregister any old service worker and clear caches to avoid stale builds
if ('serviceWorker' in navigator && !import.meta.env.PROD) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    if (registrations.length > 0) {
      console.log('[SW] Unregistering old service workers in development');
    }
    registrations.forEach((registration) => {
      registration.unregister().then((success) => {
        console.log('[SW] Unregistered service worker:', registration.scope, success);
      });
    });
  });
  if ('caches' in window) {
    caches.keys().then((cacheNames) => {
      cacheNames.forEach((cacheName) => {
        caches.delete(cacheName).then((deleted) => {
          console.log('[SW] Deleted cache:', cacheName, deleted);
        });
      });
    });
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


