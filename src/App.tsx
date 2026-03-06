import { useState } from 'react';
import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Layout from '@/components/Layout';
import Index from '@/pages/Index';
import Search from '@/pages/Search';
import WordDetail from '@/pages/WordDetail';
import NotFound from '@/pages/NotFound';

function App() {
  const baseUrl = (import.meta as any).env?.BASE_URL || '/';
  const basename = String(baseUrl).replace(/\/$/, '');

  const isGithubPages = typeof window !== 'undefined' && /\.github\.io$/i.test(window.location.hostname);
  const Router: React.ComponentType<any> = isGithubPages ? (HashRouter as any) : (BrowserRouter as any);
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <Router basename={isGithubPages ? '/' : basename}>
      <Layout searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
        <Routes>
          <Route path="/" element={<Index searchTerm={searchTerm} />} />
          <Route path="/recherche" element={<Search />} />
          <Route path="/mot/:id" element={<WordDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router>
  );
}

export default App;
