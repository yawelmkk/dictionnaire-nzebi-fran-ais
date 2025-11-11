import { useEffect, useState, useRef, useCallback } from 'react';
import { getWordsPaginated, Word } from '@/services/wordsService';
import { Search, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import WordCard from '@/components/WordCard';

interface IndexProps {
  searchTerm: string;
}

export default function Index({ searchTerm }: IndexProps) {
  const isMobile = useIsMobile();
  const [words, setWords] = useState<Word[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const observerTarget = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  // Définir toutes les fonctions AVANT les useEffect qui les utilisent
  const loadFavorites = () => {
    const stored = localStorage.getItem('nzebi_favorites');
    if (stored) {
      setFavorites(new Set(JSON.parse(stored)));
    }
  };

  const loadInitialWords = useCallback(async () => {
    setIsLoading(true);
    isLoadingRef.current = true;
    setIsInitialLoad(true);
    try {
      const initialLimit = isMobile ? 20 : 50;
      const result = await getWordsPaginated(0, initialLimit, searchTerm);
      setWords(result.words);
      setHasMore(result.hasMore);
      hasMoreRef.current = result.hasMore;
      setCurrentOffset(initialLimit);
    } catch (error) {
      console.error('Erreur lors du chargement initial:', error);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
      setIsInitialLoad(false);
    }
  }, [isMobile, searchTerm]);

  const resetAndLoadWords = useCallback(async () => {
    setIsLoading(true);
    isLoadingRef.current = true;
    setCurrentOffset(0);
    try {
      const initialLimit = isMobile ? 20 : 50;
      const result = await getWordsPaginated(0, initialLimit, searchTerm);
      setWords(result.words);
      setHasMore(result.hasMore);
      hasMoreRef.current = result.hasMore;
      setCurrentOffset(initialLimit);
    } catch (error) {
      console.error('Erreur lors du rechargement:', error);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [isMobile, searchTerm]);

  const loadMoreWords = useCallback(async () => {
    // Vérifier l'état actuel via les refs pour éviter les problèmes de dépendances
    if (isLoadingRef.current || !hasMoreRef.current) return;

    isLoadingRef.current = true;
    setIsLoading(true);
    
    try {
      const batchSize = isMobile ? 30 : 100;
      const result = await getWordsPaginated(currentOffset, batchSize, searchTerm);
      setWords((prevWords) => [...prevWords, ...result.words]);
      setHasMore(result.hasMore);
      hasMoreRef.current = result.hasMore;
      setCurrentOffset((prevOffset) => prevOffset + batchSize);
    } catch (error) {
      console.error('Erreur lors du chargement supplémentaire:', error);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [currentOffset, searchTerm, isMobile]);

  // Charger les favoris au montage
  useEffect(() => {
    loadFavorites();
  }, []);

  // Charger les premiers mots au montage
  useEffect(() => {
    loadInitialWords();
  }, [loadInitialWords]);

  // Réinitialiser et recharger quand le terme de recherche change
  useEffect(() => {
    if (!isInitialLoad) {
      resetAndLoadWords();
    }
  }, [searchTerm, isInitialLoad, resetAndLoadWords]);

  // Observer pour détecter l'arrivée en bas de page
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Utiliser les refs pour vérifier l'état actuel sans dépendances
        if (entries[0].isIntersecting && hasMoreRef.current && !isLoadingRef.current) {
          loadMoreWords();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMoreWords]);

  const toggleFavorite = (wordId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(wordId)) {
      newFavorites.delete(wordId);
    } else {
      newFavorites.add(wordId);
    }
    setFavorites(newFavorites);
    localStorage.setItem('nzebi_favorites', JSON.stringify([...newFavorites]));
  };

  return (
    <div className={`space-y-4 md:space-y-6 pt-4 md:pt-6 ${isMobile ? '' : 'animate-fade-in'}`}>
      {/* Liste des résultats optimisée pour mobile */}
      <div className="space-y-2 md:space-y-3">
        {words.map((word, index) => (
          <WordCard
            key={word.id}
            word={word}
            isFavorite={favorites.has(word.id)}
            onToggleFavorite={toggleFavorite}
            index={index}
            isMobile={isMobile}
          />
        ))}
      </div>

      {/* Indicateur de chargement et cible pour l'Intersection Observer */}
      {isLoading && isInitialLoad && (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-nzebi-primary dark:text-nzebi-accent mx-auto" />
          <p className="text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary mt-2">
            Chargement...
          </p>
        </div>
      )}

      {/* Cible pour l'Intersection Observer (chargement infini) */}
      {hasMore && !isInitialLoad && (
        <div ref={observerTarget} className="py-4">
          {isLoading && (
            <div className="text-center">
              <Loader2 className="w-6 h-6 animate-spin text-nzebi-primary dark:text-nzebi-accent mx-auto" />
              <p className="text-sm text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary mt-2">
                Chargement de plus de mots...
              </p>
            </div>
          )}
        </div>
      )}

      {/* Message vide */}
      {words.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-nzebi-primary/10 dark:bg-nzebi-accent/20 flex items-center justify-center">
            <Search size={40} className="text-nzebi-primary dark:text-nzebi-accent" />
          </div>
          <p className="text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary text-lg">
            Aucun mot trouvé
          </p>
          <p className="text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary text-sm mt-2">
            {searchTerm ? 'Essayez avec un autre terme de recherche' : 'Aucun mot disponible'}
          </p>
        </div>
      )}

      {/* Message de fin de liste */}
      {words.length > 0 && !hasMore && !isLoading && (
        <div className="text-center py-8">
          <p className="text-sm text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary">
            Tous les mots ont été chargés
          </p>
        </div>
      )}
    </div>
  );
}


