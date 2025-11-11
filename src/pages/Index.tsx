import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWordsPaginated, Word } from '@/services/wordsService';
import { getCategoryName } from '@/lib/dictionaryData';
import { Search, ChevronRight, Star, Loader2 } from 'lucide-react';

interface IndexProps {
  searchTerm: string;
}

export default function Index({ searchTerm }: IndexProps) {
  const navigate = useNavigate();
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

  const loadInitialWords = async () => {
    setIsLoading(true);
    isLoadingRef.current = true;
    setIsInitialLoad(true);
    try {
      const result = await getWordsPaginated(0, 50, searchTerm);
      setWords(result.words);
      setHasMore(result.hasMore);
      hasMoreRef.current = result.hasMore;
      setCurrentOffset(50);
    } catch (error) {
      console.error('Erreur lors du chargement initial:', error);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
      setIsInitialLoad(false);
    }
  };

  const resetAndLoadWords = async () => {
    setIsLoading(true);
    isLoadingRef.current = true;
    setCurrentOffset(0);
    try {
      const result = await getWordsPaginated(0, 50, searchTerm);
      setWords(result.words);
      setHasMore(result.hasMore);
      hasMoreRef.current = result.hasMore;
      setCurrentOffset(50);
    } catch (error) {
      console.error('Erreur lors du rechargement:', error);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  };

  const loadMoreWords = useCallback(async () => {
    // Vérifier l'état actuel via les refs pour éviter les problèmes de dépendances
    if (isLoadingRef.current || !hasMoreRef.current) return;

    isLoadingRef.current = true;
    setIsLoading(true);
    
    try {
      const result = await getWordsPaginated(currentOffset, 100, searchTerm);
      setWords((prevWords) => [...prevWords, ...result.words]);
      setHasMore(result.hasMore);
      hasMoreRef.current = result.hasMore;
      setCurrentOffset((prevOffset) => prevOffset + 100);
    } catch (error) {
      console.error('Erreur lors du chargement supplémentaire:', error);
    } finally {
      setIsLoading(false);
      isLoadingRef.current = false;
    }
  }, [currentOffset, searchTerm]);

  // Charger les favoris au montage
  useEffect(() => {
    loadFavorites();
  }, []);

  // Charger les 50 premiers mots au montage
  useEffect(() => {
    loadInitialWords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Réinitialiser et recharger quand le terme de recherche change
  useEffect(() => {
    if (!isInitialLoad) {
      resetAndLoadWords();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

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
    <div className="space-y-6 animate-fade-in pt-6">
      {/* Liste des résultats */}
      <div className="space-y-3">
        {words.map((word, index) => (
          <div
            key={word.id}
            className="card-modern p-5 cursor-pointer animate-fade-in group"
            style={{ animationDelay: `${Math.min(index * 50, 500)}ms` }}
            onClick={() => navigate(`/mot/${word.id}`)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl font-bold text-nzebi-primary dark:text-nzebi-accent truncate group-hover:text-nzebi-primary-light dark:group-hover:text-nzebi-accent-light transition-colors duration-200">
                    {word.nzebi_word}
                  </h3>
                  <span className="badge-category">
                    {getCategoryName(word.part_of_speech)}
                  </span>
                </div>
                <p className="text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary mb-3">
                  {word.french_word}
                </p>
                {word.example_nzebi && (
                  <div className="mt-3 pt-3 border-t border-nzebi-surface dark:border-nzebi-surface-dark">
                    <p className="text-sm italic text-nzebi-text dark:text-nzebi-text-dark">
                      "{word.example_nzebi}"
                    </p>
                    <p className="text-sm text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary">
                      {word.example_french}
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(word.id);
                  }}
                  className="p-2 rounded-lg hover:bg-nzebi-primary/10 dark:hover:bg-nzebi-accent/20 transition-all duration-200 active:scale-90"
                  aria-label={favorites.has(word.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  <Star
                    size={24}
                    className={`transition-all duration-200 animate-pop ${
                      favorites.has(word.id)
                        ? 'fill-nzebi-primary text-nzebi-primary dark:fill-nzebi-accent dark:text-nzebi-accent'
                        : 'text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary'
                    }`}
                  />
                </button>
                <ChevronRight
                  size={24}
                  className="text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary group-hover:text-nzebi-primary dark:group-hover:text-nzebi-accent group-hover:translate-x-1 transition-all duration-200"
                />
              </div>
            </div>
          </div>
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


