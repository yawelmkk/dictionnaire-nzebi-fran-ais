import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Layout from '@/components/Layout';
import Index from '@/pages/Index';
import Search from '@/pages/Search';
import WordDetail from '@/pages/WordDetail';
import NotFound from '@/pages/NotFound';
import { useState } from 'react';

function App() {
  // Utiliser le basename uniquement en production (pour GitHub Pages)
  const basename = import.meta.env.PROD ? '/dictionnaire-nzebi-fran-ais' : '/';
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


