import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Ajouter from "./pages/Ajouter";
import React, { useState, useEffect } from 'react';

const queryClient = new QueryClient();

const SplashScreen = () => (
  <div
    id="splash-screen"
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: '#232b38',
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'opacity 0.8s',
      opacity: 1,
      pointerEvents: 'all',
    }}
    className="fade-splash"
  >
    <img
      src="/splash-nzebi.png"
      alt="Splash Dictionnaire Nzebi-Français"
      style={{
        maxWidth: '90vw',
        maxHeight: '90vh',
        borderRadius: '2rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25)'
      }}
    />
  </div>
);

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Fade out
      const splash = document.getElementById('splash-screen');
      if (splash) {
        splash.style.opacity = '0';
        splash.style.pointerEvents = 'none';
      }
      setTimeout(() => setShowSplash(false), 800); // attendre la fin du fade-out
    }, 4500); // splash visible 4.5s
    return () => clearTimeout(timer);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        {showSplash && <SplashScreen />}
        {!showSplash && (
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/ajouter" element={<Ajouter />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        )}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;