import React, { ReactNode, useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'sonner';
import { useDisplayMode } from '@/context/DisplayContext';
import Header from '@/components/layout/Header';
import SearchBar from '@/components/layout/SearchBar';
import CategoryFilter from '@/components/layout/CategoryFilter';

interface LayoutProps {
  children: ReactNode;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, searchTerm, setSearchTerm, activeCategory, onCategoryChange }) => {
  const { displayMode, setDisplayMode } = useDisplayMode();
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [displayedSearchTerm, setDisplayedSearchTerm] = useState(searchTerm);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleSearchChange = useCallback((value: string) => {
    setDisplayedSearchTerm(value);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = setTimeout(() => setSearchTerm(value), 300);
  }, [setSearchTerm]);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    setDisplayedSearchTerm(searchTerm);
  }, [searchTerm]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  }, []);

  const handleToggleDisplayMode = useCallback(() => {
    const newMode = displayMode === 'nzebi-first' ? 'french-first' : 'nzebi-first';
    setDisplayMode(newMode);
    toast.success(newMode === 'nzebi-first'
      ? 'Affichage : Nzébi en premier'
      : 'Affichage : Français en premier');
  }, [displayMode, setDisplayMode]);

  const handleAboutClick = useCallback(() => {
    toast.info(
      <div className="flex flex-col gap-3 max-w-2xl">
        <h3 className="font-bold text-lg">Le dictionnaire Nzébi-français</h3>
        <div className="space-y-3 text-sm overflow-y-auto max-h-[500px]">
          <p>Le dictionnaire Nzébi-français est une application conçue pour préserver, valoriser et transmettre la langue et le patrimoine culturel de l'ethnie Nzébi du Gabon et du Congo.</p>
          <p>Elle permet à tout utilisateur de découvrir des mots en langue nzébi, leur traduction en français, et dans certains cas, leur prononciation audio.</p>
          <h4 className="font-bold text-base mt-4">Origine des données linguistiques</h4>
          <p>Les données de ce dictionnaire proviennent d'un travail réalisé par Luc de NADAILLAC. Ce dictionnaire numérique vise à le valoriser et le rendre plus accessible.</p>
          <h4 className="font-bold text-base mt-4">Qui sont les Nzébi ?</h4>
          <p>Les Nzébi sont un peuple bantou du Gabon et du Congo-Brazzaville, présents dans le sud-est du pays. Leur langue fait partie du groupe B.50 des langues bantoues.</p>
          <p className="font-semibold">Merci d'utiliser cette application et de soutenir la mission de Langue Nzébi Officiel.</p>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => toast.dismiss()}
            className="px-4 py-2 bg-slate-700 text-white rounded-md hover:bg-slate-600 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>,
      {
        duration: Infinity,
        className: "bg-white text-black",
        style: { maxWidth: "600px", padding: "1.5rem", borderRadius: "0.5rem" }
      }
    );
  }, []);

  const handleContactClick = useCallback(() => {
    window.location.href = 'mailto:languenzebiofficiel@gmail.com';
  }, []);

  return (
    <div className="min-h-screen bg-nzebi-background dark:bg-nzebi-background-dark transition-colors duration-300">
      <div className="sticky top-0 z-50 backdrop-blur-lg bg-white/90 dark:bg-nzebi-background-dark/90 border-b border-nzebi-surface dark:border-nzebi-surface-dark">
        <header className="max-w-4xl mx-auto px-4 sm:px-6">
          <Header
            isDarkMode={isDarkMode}
            onToggleDarkMode={toggleDarkMode}
            onSettingsClick={handleToggleDisplayMode}
            onAboutClick={handleAboutClick}
            onContactClick={handleContactClick}
          />
        </header>
        <div className="max-w-4xl mx-auto px-4 pb-2 sm:px-6">
          <SearchBar value={displayedSearchTerm} onChange={handleSearchChange} />
          <CategoryFilter activeCategory={activeCategory} onCategoryChange={onCategoryChange} />
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;