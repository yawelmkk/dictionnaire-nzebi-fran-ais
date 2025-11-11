import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategoryName } from '@/lib/dictionaryData';
import { ChevronRight, Star } from 'lucide-react';
import { Word } from '@/services/wordsService';

interface WordCardProps {
  word: Word;
  isFavorite: boolean;
  onToggleFavorite: (wordId: string) => void;
  index: number;
  isMobile: boolean;
}

const WordCard = memo(({ word, isFavorite, onToggleFavorite, index, isMobile }: WordCardProps) => {
  const navigate = useNavigate();

  // Sur mobile, pas d'animation delay pour améliorer les performances
  const animationStyle = isMobile 
    ? {} 
    : { animationDelay: `${Math.min(index * 20, 300)}ms` };

  return (
    <div
      className={`card-modern p-4 md:p-5 cursor-pointer group ${isMobile ? '' : 'animate-fade-in'}`}
      style={animationStyle}
      onClick={() => navigate(`/mot/${word.id}`)}
    >
      <div className="flex items-start justify-between gap-3 md:gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
            <h3 className="text-xl md:text-2xl font-bold text-nzebi-primary dark:text-nzebi-accent truncate group-hover:text-nzebi-primary-light dark:group-hover:text-nzebi-accent-light transition-colors duration-150">
              {word.nzebi_word}
            </h3>
            <span className="badge-category text-xs">
              {getCategoryName(word.part_of_speech)}
            </span>
          </div>
          <p className="text-sm md:text-base text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary mb-2 md:mb-3">
            {word.french_word}
          </p>
          {word.example_nzebi && (
            <div className="mt-2 md:mt-3 pt-2 md:pt-3 border-t border-nzebi-surface dark:border-nzebi-surface-dark">
              <p className="text-xs md:text-sm italic text-nzebi-text dark:text-nzebi-text-dark">
                "{word.example_nzebi}"
              </p>
              <p className="text-xs md:text-sm text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary">
                {word.example_french}
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(word.id);
            }}
            className="p-1.5 md:p-2 rounded-lg hover:bg-nzebi-primary/10 dark:hover:bg-nzebi-accent/20 active:scale-90 transition-transform duration-150"
            aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Star
              size={20}
              className={`transition-colors duration-150 ${
                isFavorite
                  ? 'fill-nzebi-primary text-nzebi-primary dark:fill-nzebi-accent dark:text-nzebi-accent'
                  : 'text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary'
              }`}
            />
          </button>
          <ChevronRight
            size={20}
            className="text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary group-hover:text-nzebi-primary dark:group-hover:text-nzebi-accent transition-colors duration-150 hidden md:block"
          />
        </div>
      </div>
    </div>
  );
});

WordCard.displayName = 'WordCard';

export default WordCard;

