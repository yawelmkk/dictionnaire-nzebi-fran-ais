import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllWords, Word } from '@/services/wordsService';
import { getCategoryName } from '@/lib/dictionaryData';
import { Search, ChevronRight, Star } from 'lucide-react';

interface IndexProps {
  searchTerm: string;
}

export default function Index({ searchTerm }: IndexProps) {
  const navigate = useNavigate();
  const [words, setWords] = useState<Word[]>([]);
  const [filteredWords, setFilteredWords] = useState<Word[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadWords();
    loadFavorites();
  }, []);

  useEffect(() => {
    filterWords();
  }, [searchTerm, words]);

  const loadWords = async () => {
    const data = await getAllWords();
    setWords(data);
  };

  const loadFavorites = () => {
    const stored = localStorage.getItem('nzebi_favorites');
    if (stored) {
      setFavorites(new Set(JSON.parse(stored)));
    }
  };

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

  const filterWords = () => {
    let filtered = words;

    if (searchTerm) {
      filtered = filtered.filter(
        word =>
          word.nzebi_word.toLowerCase().includes(searchTerm.toLowerCase()) ||
          word.french_word.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredWords(filtered);
  };

  return (
    <div className="space-y-6 animate-fade-in pt-6">
      {/* Barre de recherche moderne */}
      {/* This is now in Layout.tsx */}

      {/* Liste des résultats */}
      <div className="space-y-3">
        {filteredWords.map((word, index) => (
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

      {/* Message vide */}
      {filteredWords.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-nzebi-primary/10 dark:bg-nzebi-accent/20 flex items-center justify-center">
            <Search size={40} className="text-nzebi-primary dark:text-nzebi-accent" />
          </div>
          <p className="text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary text-lg">
            Aucun mot trouvé
          </p>
          <p className="text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary text-sm mt-2">
            Essayez avec un autre terme de recherche
          </p>
        </div>
      )}
    </div>
  );
}


