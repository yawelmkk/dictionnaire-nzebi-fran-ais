import { useEffect, useState, useRef, useCallback } from 'react';
import { getWordsPaginated, Word } from '@/services/wordsService';
import { Search, Loader2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import WordCard from '@/components/WordCard';

interface IndexProps {
  searchTerm: string;
}

const STATE_STORAGE_KEY = 'nzebi_dictionary_state';
const SCROLL_STORAGE_KEY = 'nzebi_dictionary_scroll';
const LAST_WORD_ID_KEY = 'nzebi_last_word_id';

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
  const scrollRestoredRef = useRef(false);
  const wordsRef = useRef<Word[]>([]);
  const currentOffsetRef = useRef(0);
  const loadMoreWordsRef = useRef<() => Promise<void>>();

  useEffect(() => {
    wordsRef.current = words;
  }, [words]);

  useEffect(() => {
    currentOffsetRef.current = currentOffset;
  }, [currentOffset]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const saveState = useCallback(() => {
    try {
      const state = {
        words: wordsRef.current,
        currentOffset: currentOffsetRef.current,
        hasMore: hasMoreRef.current,
        searchTerm,
        timestamp: Date.now()
      };
      localStorage.setItem(STATE_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
    }
  }, [searchTerm]);

  const restoreState = useCallback((): boolean => {
    try {
      const savedState = localStorage.getItem(STATE_STORAGE_KEY);
      if (!savedState) return false;

      const state = JSON.parse(savedState);
      if (state.searchTerm !== searchTerm) return false;
      
      const age = Date.now() - state.timestamp;
      if (age > 3600000) return false;

      setWords(state.words);
      setCurrentOffset(state.currentOffset);
      setHasMore(state.hasMore);
      hasMoreRef.current = state.hasMore;
      setIsInitialLoad(false);
      scrollRestoredRef.current = false;
      return true;
    } catch (error) {
      return false;
    }
  }, [searchTerm]);

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
    if (isLoadingRef.current || !hasMoreRef.current) return;

    isLoadingRef.current = true;
    setIsLoading(true);
    
    try {
      const batchSize = isMobile ? 30 : 100;
      const result = await getWordsPaginated(currentOffsetRef.current, batchSize, searchTerm);
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

  useEffect(() => {
    loadMoreWordsRef.current = loadMoreWords;
  }, [loadMoreWords]);

  useEffect(() => {
    loadFavorites();
  }, []);

  useEffect(() => {
    const wasRestored = restoreState();
    if (!wasRestored) {
      loadInitialWords();
    } else {
      scrollRestoredRef.current = false;
      setIsInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    if (words.length > 0 && !isInitialLoad && !scrollRestoredRef.current) {
      const lastWordId = localStorage.getItem(LAST_WORD_ID_KEY);
      const savedScroll = localStorage.getItem(SCROLL_STORAGE_KEY);
      
      const restoreScroll = (attempt = 0) => {
        if (attempt > 10) {
          scrollRestoredRef.current = true;
          return;
        }
        
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setTimeout(() => {
              let targetScroll = 0;
              
              if (lastWordId) {
                const wordIndex = words.findIndex(w => w.id === lastWordId);
                if (wordIndex === -1 && hasMoreRef.current && !isLoadingRef.current) {
                  if (loadMoreWordsRef.current) {
                    loadMoreWordsRef.current();
                  }
                  if (attempt < 5) {
                    setTimeout(() => restoreScroll(attempt + 1), 500);
                    return;
                  }
                }
                
                const wordCard = document.querySelector(`[data-word-id="${lastWordId}"]`) as HTMLElement;
                if (wordCard) {
                  const currentScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
                  const rect = wordCard.getBoundingClientRect();
                  const absoluteTop = rect.top + currentScroll;
                  const targetPosition = Math.max(0, absoluteTop - 120);
                  window.scrollTo({
                    top: targetPosition,
                    behavior: 'auto'
                  });
                  
                  setTimeout(() => {
                    scrollRestoredRef.current = true;
                    if (lastWordId) {
                      localStorage.removeItem(LAST_WORD_ID_KEY);
                    }
                  }, 150);
                  
                  return;
                }
              }
              
              if (targetScroll === 0 && savedScroll) {
                const scrollPos = parseInt(savedScroll, 10);
                if (scrollPos > 0) {
                  targetScroll = scrollPos;
                }
              }
              
              if (targetScroll > 0) {
                window.scrollTo({ 
                  top: Math.max(0, targetScroll), 
                  behavior: 'auto' 
                });
                
                setTimeout(() => {
                  scrollRestoredRef.current = true;
                  if (lastWordId) {
                    localStorage.removeItem(LAST_WORD_ID_KEY);
                  }
                }, 200);
              } else {
                scrollRestoredRef.current = true;
              }
            }, 150 + (attempt * 50));
          });
        });
      };
      
      setTimeout(() => {
        if (!scrollRestoredRef.current) {
          restoreScroll(0);
        }
      }, 300);
    }
  }, [words.length, isInitialLoad]);

  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.removeItem(STATE_STORAGE_KEY);
      localStorage.removeItem(SCROLL_STORAGE_KEY);
      localStorage.removeItem(LAST_WORD_ID_KEY);
      scrollRestoredRef.current = false;
      resetAndLoadWords();
    }
  }, [searchTerm]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
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

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const scrollY = window.scrollY;
        localStorage.setItem(SCROLL_STORAGE_KEY, scrollY.toString());
      }, 200);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  useEffect(() => {
    if (words.length === 0) return;
    
    const interval = setInterval(() => {
      saveState();
    }, 3000);

    return () => clearInterval(interval);
  }, [words.length, saveState]);

  return (
    <div className={`space-y-4 md:space-y-6 pt-4 md:pt-6 ${isMobile ? '' : 'animate-fade-in'}`}>
      <div className="space-y-2 md:space-y-3">
        {words.map((word, index) => (
          <WordCard
            key={word.id}
            word={word}
            isFavorite={favorites.has(word.id)}
            onToggleFavorite={toggleFavorite}
            index={index}
            isMobile={isMobile}
            onNavigate={(wordId) => {
              localStorage.setItem(LAST_WORD_ID_KEY, wordId);
              const scrollY = window.scrollY || window.pageYOffset;
              localStorage.setItem(SCROLL_STORAGE_KEY, scrollY.toString());
              saveState();
            }}
          />
        ))}
      </div>

      {isLoading && isInitialLoad && (
        <div className="text-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-nzebi-primary dark:text-nzebi-accent mx-auto" />
          <p className="text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary mt-2">
            Chargement...
          </p>
        </div>
      )}

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
