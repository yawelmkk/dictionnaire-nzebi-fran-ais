import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom'; // <-- Garder HashRouter
import { Toaster } from '@/components/ui/sonner';
// ... (le reste des imports et variables)

function App() {
  // Basename basé sur la configuration Vite
  const baseUrl = (import.meta as any).env?.BASE_URL || '/';
  const basename = String(baseUrl).replace(/\/$/, '');

  // Sur GitHub Pages, privilégier HashRouter pour éviter les 404 et pages blanches
  const isGithubPages = typeof window !== 'undefined' && /\.github\.io$/i.test(window.location.hostname);
  const Router: React.ComponentType<any> = isGithubPages ? (HashRouter as any) : (BrowserRouter as any);
  const [searchTerm, setSearchTerm] = useState('');
  
  return (
    <Router basename={isGithubPages ? '/' : basename}> // <-- Garder cette ligne de début de retour
      <Layout searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
        <Routes>
          <Route path="/" element={<Index searchTerm={searchTerm} />} />
          <Route path="/recherche" element={<Search />} />
          <Route path="/mot/:id" element={<WordDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <Toaster />
    </Router> // <-- Garder cette ligne de fin de retour (et supprimer toutes les lignes du bloc du milieu/distant)
  );
}

export default App;