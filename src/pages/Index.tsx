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

  // Mettre à jour les refs
  useEffect(() => {
    wordsRef.current = words;
  }, [words]);

  useEffect(() => {
    currentOffsetRef.current = currentOffset;
  }, [currentOffset]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  // Sauvegarder l'état simplement
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

  // Restaurer l'état simplement
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

  // Mettre à jour la ref de loadMoreWords
  useEffect(() => {
    loadMoreWordsRef.current = loadMoreWords;
  }, [loadMoreWords]);

  // Charger les favoris
  useEffect(() => {
    loadFavorites();
  }, []);

  // Initialiser ou restaurer
  useEffect(() => {
    const wasRestored = restoreState();
    if (!wasRestored) {
      loadInitialWords();
    } else {
      // Si on a restauré, réinitialiser le flag de scroll pour permettre la restauration
      scrollRestoredRef.current = false;
      setIsInitialLoad(false);
    }
  }, []);

  // Restaurer le scroll après que les mots soient complètement rendus
  useEffect(() => {
    // Restaurer le scroll si on a des mots et qu'on n'a pas encore restauré
    // Permettre la restauration même si isInitialLoad est true (cas du retour depuis WordDetail)
    // Mais attendre que le chargement initial soit terminé pour éviter les conflits
    if (words.length > 0 && !isInitialLoad && !scrollRestoredRef.current) {
      const lastWordId = localStorage.getItem(LAST_WORD_ID_KEY);
      const savedScroll = localStorage.getItem(SCROLL_STORAGE_KEY);
      
      // Fonction pour restaurer le scroll de manière précise
      const restoreScroll = (attempt = 0) => {
        // Limiter à 10 tentatives
        if (attempt > 10) {
          scrollRestoredRef.current = true;
          return;
        }
        
        // Utiliser plusieurs requestAnimationFrame pour s'assurer que le rendu est terminé
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // Attendre que le DOM soit complètement rendu
            setTimeout(() => {
              let targetScroll = 0;
              
              // Priorité 1: Essayer de trouver l'élément du mot par son ID et utiliser scrollIntoView
              if (lastWordId) {
                // Vérifier d'abord si le mot est dans la liste actuelle
                const wordIndex = words.findIndex(w => w.id === lastWordId);
                if (wordIndex === -1 && hasMoreRef.current && !isLoadingRef.current) {
                  // Le mot n'est pas encore chargé, charger plus de mots
                  if (loadMoreWordsRef.current) {
                    loadMoreWordsRef.current();
                  }
                  // Réessayer après le chargement
                  if (attempt < 5) {
                    setTimeout(() => restoreScroll(attempt + 1), 500);
                    return;
                  }
                }
                
                // Chercher l'élément WordCard qui contient ce mot
                const wordCard = document.querySelector(`[data-word-id="${lastWordId}"]`) as HTMLElement;
                if (wordCard) {
                  // Utiliser scrollIntoView directement - c'est la méthode la plus fiable du navigateur
                  // Mais d'abord, s'assurer qu'on est au top pour un calcul précis
                  const currentScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
                  
                  // Obtenir la position absolue de l'élément
                  // On utilise getBoundingClientRect qui donne la position relative à la viewport
                  // puis on ajoute le scroll actuel pour obtenir la position absolue
                  const rect = wordCard.getBoundingClientRect();
                  const absoluteTop = rect.top + currentScroll;
                  
                  // Scroller directement à la position avec offset
                  const targetPosition = Math.max(0, absoluteTop - 120);
                  window.scrollTo({
                    top: targetPosition,
                    behavior: 'auto'
                  });
                  
                  // Attendre que le scroll soit terminé puis vérifier/préciser
                  setTimeout(() => {
                    // Vérifier si on est à la bonne position
                    const newScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
                    const newRect = wordCard.getBoundingClientRect();
                    const newAbsoluteTop = newRect.top + newScroll;
                    const expectedTop = absoluteTop;
                    const positionDiff = Math.abs(newAbsoluteTop - expectedTop);
                    
                    // Si la position n'est pas assez précise (plus de 10px de différence), utiliser scrollIntoView
                    if (positionDiff > 10) {
                      // Utiliser scrollIntoView pour un positionnement précis
                      wordCard.scrollIntoView({
                        behavior: 'auto',
                        block: 'start',
                        inline: 'nearest'
                      });
                      
                      // Ajuster avec l'offset pour le header après scrollIntoView
                      setTimeout(() => {
                        const finalScroll = window.pageYOffset || document.documentElement.scrollTop || 0;
                        window.scrollTo({
                          top: Math.max(0, finalScroll - 120),
                          behavior: 'auto'
                        });
                        
                        scrollRestoredRef.current = true;
                        if (lastWordId) {
                          localStorage.removeItem(LAST_WORD_ID_KEY);
                        }
                      }, 100);
                    } else {
                      // Position déjà correcte
                      scrollRestoredRef.current = true;
                      if (lastWordId) {
                        localStorage.removeItem(LAST_WORD_ID_KEY);
                      }
                    }
                  }, 150);
                  
                  return; // Sortir de la fonction car on a géré le scroll
                }
              }
              
              // Priorité 2: Si on n'a pas trouvé l'élément, utiliser la position sauvegardée
              if (targetScroll === 0 && savedScroll) {
                const scrollPos = parseInt(savedScroll, 10);
                if (scrollPos > 0) {
                  targetScroll = scrollPos;
                }
              }
              
              // Si on a une position cible (fallback), restaurer le scroll
              if (targetScroll > 0) {
                const docHeight = Math.max(
                  document.body.scrollHeight,
                  document.body.offsetHeight,
                  document.documentElement.clientHeight,
                  document.documentElement.scrollHeight,
                  document.documentElement.offsetHeight
                );
                
                // S'assurer que la position cible est valide
                if (docHeight >= targetScroll - 100) {
                  // Restaurer la position
                  window.scrollTo({ 
                    top: Math.max(0, targetScroll), 
                    behavior: 'auto' 
                  });
                  
                  // Vérifier après un délai si la position est correcte
                  setTimeout(() => {
                    const currentScroll = window.scrollY || document.documentElement.scrollTop || 0;
                    const diff = Math.abs(currentScroll - targetScroll);
                    
                    // Si la position est correcte (à 50px près pour le fallback), on a réussi
                    if (diff <= 50) {
                      scrollRestoredRef.current = true;
                      // Nettoyer l'ID sauvegardé après restauration réussie
                      if (lastWordId) {
                        localStorage.removeItem(LAST_WORD_ID_KEY);
                      }
                    } else if (attempt < 6) {
                      // Réessayer si la différence est importante
                      restoreScroll(attempt + 1);
                    } else {
                      scrollRestoredRef.current = true;
                    }
                  }, 200);
                } else if (attempt < 8) {
                  // Si le document n'est pas assez haut, réessayer après un délai
                  setTimeout(() => restoreScroll(attempt + 1), 300);
                } else {
                  scrollRestoredRef.current = true;
                }
              } else {
                // Pas de position à restaurer
                scrollRestoredRef.current = true;
              }
            }, 150 + (attempt * 50)); // Augmenter le délai à chaque tentative
          });
        });
      };
      
      // Première tentative après un délai pour laisser le temps au rendu
      setTimeout(() => {
        if (!scrollRestoredRef.current) {
          restoreScroll(0);
        }
      }, 300);
      
      // Tentative de secours après un délai plus long
      setTimeout(() => {
        if (!scrollRestoredRef.current) {
          restoreScroll(0);
        }
      }, 800);
    }
  }, [words.length, isInitialLoad]);

  // Réinitialiser quand la recherche change
  useEffect(() => {
    if (!isInitialLoad) {
      localStorage.removeItem(STATE_STORAGE_KEY);
      localStorage.removeItem(SCROLL_STORAGE_KEY);
      localStorage.removeItem(LAST_WORD_ID_KEY);
      scrollRestoredRef.current = false;
      resetAndLoadWords();
    }
  }, [searchTerm]);

  // Observer pour infinite scroll
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

  // Sauvegarder au scroll (debounced)
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

  // Sauvegarder périodiquement
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
              // Sauvegarder l'ID du mot cliqué pour une restauration précise
              localStorage.setItem(LAST_WORD_ID_KEY, wordId);
              
              // Sauvegarder aussi la position de scroll comme backup
              const scrollY = window.scrollY || window.pageYOffset;
              const docScroll = document.documentElement.scrollTop;
              const bodyScroll = document.body.scrollTop;
              const currentScroll = scrollY || docScroll || bodyScroll || 0;
              
              // Sauvegarder immédiatement
              localStorage.setItem(SCROLL_STORAGE_KEY, currentScroll.toString());
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
