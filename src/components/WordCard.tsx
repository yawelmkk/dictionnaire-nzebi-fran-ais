import { memo } from 'react';
import { getCategoryName } from '@/lib/dictionaryData';
import { ChevronDown, Star } from 'lucide-react';
import { Word } from '@/services/wordsService';

interface WordCardProps {
  word: Word;
  isFavorite: boolean;
  onToggleFavorite: (wordId: string) => void;
  isMobile: boolean;
  isExpanded: boolean;
  onToggleExpand: (wordId: string) => void;
}

const WordCard = memo(({ word, isFavorite, onToggleFavorite, isMobile, isExpanded, onToggleExpand }: WordCardProps) => {
  const handleClick = () => {
    onToggleExpand(word.id);
  };

  return (
    <div
      data-word-id={word.id}
      className={`card-modern p-4 md:p-5 group ${isMobile ? '' : 'animate-fade-in'} hover-scale`}
    >
      <button
        type="button"
        onClick={handleClick}
        className="w-full flex items-start justify-between gap-3 md:gap-4 text-left"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 md:gap-3 mb-2 flex-wrap">
            <h3 className="text-xl md:text-2xl font-bold text-nzebi-primary dark:text-nzebi-accent truncate group-hover:text-nzebi-primary-light dark:group-hover:text-nzebi-accent-light transition-colors duration-150">
              {word.nzebi_word}
            </h3>
            <span className="badge-category text-xs">
              {getCategoryName(word.part_of_speech)}
            </span>
          </div>
          {isExpanded && (
            <div className="mt-1 space-y-2 animate-accordion-down">
              <p className="text-sm md:text-base text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary">
                {word.french_word}
              </p>
              {word.example_nzebi && (
                <div className="mt-2 pt-2 border-t border-nzebi-surface dark:border-nzebi-surface-dark">
                  <p className="text-xs md:text-sm italic text-nzebi-text dark:text-nzebi-text-dark">
                    "{word.example_nzebi}"
                  </p>
                  <p className="text-xs md:text-sm text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary">
                    {word.example_french}
                  </p>
                </div>
              )}
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
          <ChevronDown
            size={20}
            className={`text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary transition-transform duration-150 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>
    </div>
  );
});

WordCard.displayName = 'WordCard';

export default WordCard;

