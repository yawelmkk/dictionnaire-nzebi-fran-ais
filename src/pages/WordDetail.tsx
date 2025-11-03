import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllWords, Word } from '@/services/wordsService';
import { getCategoryName } from '@/lib/dictionaryData';
import { ArrowLeft, BookOpen, Volume2, Star, Link as LinkIcon } from 'lucide-react';

// Fonction utilitaire pour vérifier si une valeur est "vide"
const isValueSet = (value: string | boolean | null | undefined): boolean => {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'string') {
    return value.trim() !== '';
  }
  return true;
};

export default function WordDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [word, setWord] = useState<Word | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    loadWord();
    loadFavoriteStatus();
  }, [id]);

  const loadWord = async () => {
    const words = await getAllWords();
    const foundWord = words.find(w => w.id === id);
    setWord(foundWord || null);
  };

  const loadFavoriteStatus = () => {
    const stored = localStorage.getItem('nzebi_favorites');
    if (stored) {
      const favorites = new Set(JSON.parse(stored));
      setIsFavorite(favorites.has(id!));
    }
  };

  const toggleFavorite = () => {
    const stored = localStorage.getItem('nzebi_favorites');
    const favorites = stored ? new Set<string>(JSON.parse(stored)) : new Set<string>();
    
    if (isFavorite) {
      favorites.delete(id!);
    } else {
      favorites.add(id!);
    }
    
    localStorage.setItem('nzebi_favorites', JSON.stringify([...favorites]));
    setIsFavorite(!isFavorite);
  };

  if (!word) {
    return (
      <div className="text-center py-16">
        <p className="text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary text-lg">
          Mot introuvable
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn-primary mt-4"
        >
          Retour à l'accueil
        </button>
      </div>
    );
  }

  const playPronunciation = () => {
    if (word.url_prononciation) {
      const audio = new Audio(word.url_prononciation);
      audio.play().catch(error => console.error('Erreur de lecture audio:', error));
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Bouton retour */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary hover:text-nzebi-primary dark:hover:text-nzebi-accent transition-colors duration-200 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="font-medium">Retour</span>
      </button>

      {/* Carte principale */}
      <div className="card-modern p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="flex-1">
            <div className="flex items-center flex-wrap gap-3 mb-3">
              <h1 className="text-4xl md:text-5xl font-bold text-nzebi-primary dark:text-nzebi-accent">
                {word.nzebi_word}
              </h1>
              {isValueSet(word.part_of_speech) && (
                <span className="badge-category text-sm">
                  {getCategoryName(word.part_of_speech)}
                </span>
              )}
            </div>
            {isValueSet(word.french_word) && (
              <p className="text-2xl font-medium text-nzebi-text dark:text-nzebi-text-dark">
                {word.french_word}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isValueSet(word.url_prononciation) && (
              <button
                onClick={playPronunciation}
                className="p-3 rounded-xl bg-nzebi-surface dark:bg-nzebi-surface-dark 
                         text-nzebi-primary dark:text-nzebi-accent
                         hover:bg-nzebi-primary/10 dark:hover:bg-nzebi-accent/20
                         active:scale-95 transition-all duration-200"
                aria-label="Écouter la prononciation"
              >
                <Volume2 size={24} />
              </button>
            )}
            <button
              onClick={toggleFavorite}
              className="p-3 rounded-xl bg-nzebi-surface dark:bg-nzebi-surface-dark 
                       hover:bg-nzebi-primary/10 dark:hover:bg-nzebi-accent/20
                       active:scale-95 transition-all duration-200"
              aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <Star
                size={24}
                className={`transition-all duration-200 animate-pop ${
                  isFavorite
                    ? 'fill-nzebi-primary text-nzebi-primary dark:fill-nzebi-accent dark:text-nzebi-accent'
                    : 'text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Exemple */}
        {isValueSet(word.example_nzebi) && (
          <div className="mt-6 pt-6 border-t border-nzebi-surface dark:border-nzebi-surface-dark">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-nzebi-primary/10 dark:bg-nzebi-accent/20">
                <BookOpen size={20} className="text-nzebi-primary dark:text-nzebi-accent" />
              </div>
              <h3 className="font-bold text-lg text-nzebi-text dark:text-nzebi-text-dark">
                Exemple
              </h3>
            </div>
            <div className="space-y-3 pl-2">
              <p className="text-lg italic text-nzebi-text dark:text-nzebi-text-dark">
                "{word.example_nzebi}"
              </p>
              <p className="text-base text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary">
                {word.example_french}
              </p>
            </div>
          </div>
        )}

        {/* Informations additionnelles */}
        {(isValueSet(word.plural_form) || isValueSet(word.synonyms) || isValueSet(word.scientific_name) || (isValueSet(word.is_verb) && isValueSet(word.imperative))) && (
          <div className="mt-6 pt-6 border-t border-nzebi-surface dark:border-nzebi-surface-dark space-y-4">
            {isValueSet(word.plural_form) && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-nzebi-surface/50 dark:bg-nzebi-surface-dark/30">
                <span className="text-sm font-semibold text-nzebi-primary dark:text-nzebi-accent min-w-[110px]">
                  Pluriel :
                </span>
                <span className="text-base text-nzebi-text dark:text-nzebi-text-dark font-medium">
                  {word.plural_form}
                </span>
              </div>
            )}

            {isValueSet(word.is_verb) && isValueSet(word.imperative) && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-nzebi-surface/50 dark:bg-nzebi-surface-dark/30">
                <span className="text-sm font-semibold text-nzebi-primary dark:text-nzebi-accent min-w-[110px]">
                  Impératif :
                </span>
                <span className="text-base text-nzebi-text dark:text-nzebi-text-dark font-medium">
                  {word.imperative}
                </span>
              </div>
            )}

            {isValueSet(word.synonyms) && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-nzebi-surface/50 dark:bg-nzebi-surface-dark/30">
                <span className="text-sm font-semibold text-nzebi-primary dark:text-nzebi-accent min-w-[110px]">
                  Synonymes :
                </span>
                <span className="text-base text-nzebi-text dark:text-nzebi-text-dark">
                  {word.synonyms}
                </span>
              </div>
            )}

            {isValueSet(word.scientific_name) && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-nzebi-surface/50 dark:bg-nzebi-surface-dark/30">
                <span className="text-sm font-semibold text-nzebi-primary dark:text-nzebi-accent min-w-[110px]">
                  Nom scientifique :
                </span>
                <span className="text-base text-nzebi-text dark:text-nzebi-text-dark italic">
                  {word.scientific_name}
                </span>
              </div>
            )}

            {isValueSet(word.url_prononciation) && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-nzebi-surface/50 dark:bg-nzebi-surface-dark/30">
                <LinkIcon size={18} className="text-nzebi-primary dark:text-nzebi-accent" />
                <a
                  href={word.url_prononciation}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-nzebi-primary dark:text-nzebi-accent hover:underline"
                >
                  Écouter la prononciation
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


