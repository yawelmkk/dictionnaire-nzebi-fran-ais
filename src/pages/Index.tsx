import { useEffect, useState, useCallback, useMemo } from 'react';
import { getAllWords, Word } from '@/services/wordsService';
import { getMatchingPOS } from '@/components/layout/CategoryFilter';import { Search, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useDisplayMode } from '@/context/DisplayContext';
import WordCard from '@/components/WordCard';

interface IndexProps {
  searchTerm: string;
  activeCategory: string;
}

export default function Index({ searchTerm, activeCategory }: IndexProps) {
  const isMobile = useIsMobile();
  const { displayMode } = useDisplayMode();
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  // Load all words once
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const words = await getAllWords();
        setAllWords(words);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  // Load favorites once
  useEffect(() => {    const stored = localStorage.getItem('nzebi_favorites');
    if (stored) {
      setFavorites(new Set(JSON.parse(stored)));
    }
  }, []);

  // Filter, search and sort
  const sortedWords = useMemo(() => {
    let filtered = allWords;

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        w =>
          w.nzebi_word.toLowerCase().includes(searchLower) ||
          w.french_word.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    const matchingPOS = getMatchingPOS(activeCategory);
    if (matchingPOS) {
      filtered = filtered.filter(w => matchingPOS.includes(w.part_of_speech?.toLowerCase() || ''));
    }

    // Sort
    if (displayMode === 'french-first') {
      return [...filtered].sort((a, b) => a.french_word.localeCompare(b.french_word, 'fr'));
    }
    return [...filtered].sort((a, b) => a.nzebi_word.localeCompare(b.nzebi_word, 'fr'));
  }, [allWords, searchTerm, displayMode, activeCategory]);

  const toggleFavorite = useCallback((wordId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(wordId)) {
        next.delete(wordId);
      } else {
        next.add(wordId);
      }
      localStorage.setItem('nzebi_favorites', JSON.stringify([...next]));
      return next;
    });
  }, []);

  return (
    <div className={`space-y-4 md:space-y-6 pt-4 md:pt-6 ${isMobile ? '' : 'animate-fade-in'}`}>
      <div className="space-y-2 md:space-y-3">
        {sortedWords.map((word) => (          <WordCard
            key={word.id}
            word={word}
            isFavorite={favorites.has(word.id)}
            onToggleFavorite={toggleFavorite}
            isMobile={isMobile}
          />
        ))}
      </div>

      {isLoading && (        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-nzebi-primary dark:text-nzebi-accent mx-auto" />
          <p className="text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary mt-2">
            Chargement...
          </p>
        </div>
      )}

      {allWords.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-nzebi-primary/10 dark:bg-nzebi-accent/20 flex items-center justify-center">
            <Search size={40} className="text-nzebi-primary dark:text-nzebi-accent" />
          </div>
          <p className="text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary text-lg">
            Aucun mot disponible
          </p>
        </div>
      )}

      {sortedWords.length === 0 && allWords.length > 0 && !isLoading && (        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-nzebi-primary/10 dark:bg-nzebi-accent/20 flex items-center justify-center">
            <Search size={40} className="text-nzebi-primary dark:text-nzebi-accent" />
          </div>
          <p className="text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary text-lg">
            Aucun mot trouvé
          </p>
          <p className="text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary text-sm mt-2">
            Essayez avec un autre terme ou une autre catégorie          </p>
        </div>
      )}
    </div>
  );
}
