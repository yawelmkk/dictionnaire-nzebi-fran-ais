import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Layout from '@/components/Layout';
import Index from '@/pages/Index';
import Search from '@/pages/Search';
import WordDetail from '@/pages/WordDetail';
import NotFound from '@/pages/NotFound';
import { useState } from 'react';

function App() {
  // Utiliser l'URL de base fournie par Vite pour tous les environnements
  // Réduire la barre finale pour éviter les doublons dans React Router
  const basename = (import.meta as any).env?.BASE_URL
    ? (import.meta as any).env.BASE_URL.replace(/\/$/, '')
    : '/';
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <BrowserRouter basename={basename}>
      <Layout searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
        <Routes>
          <Route path="/" element={<Index searchTerm={searchTerm} />} />
          <Route path="/recherche" element={<Search />} />
          <Route path="/mot/:id" element={<WordDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;


