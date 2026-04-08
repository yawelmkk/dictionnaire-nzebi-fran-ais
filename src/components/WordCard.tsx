import { memo, useEffect, useState } from 'react';
import { getCategoryName } from '@/lib/dictionaryData';
import { Star, Volume2 } from 'lucide-react';
import { Word } from '@/services/wordsService';
import { useAudio } from '@/hooks/use-audio';
import { useDisplayMode } from '@/context/DisplayContext';
import { generateAudioUrl } from '@/services/audioRoutes';

interface WordCardProps {
  word: Word;
  isFavorite: boolean;
  onToggleFavorite: (wordId: string) => void;
  isMobile: boolean;
  isExpanded?: boolean;
  onToggleExpand?: (wordId: string) => void;
}

const WordCard = memo(({ word, isFavorite, onToggleFavorite, isMobile }: WordCardProps) => {
  const audio = useAudio({ wordId: word.nzebi_word });
  const { displayMode } = useDisplayMode();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (word.nzebi_word) {
      audio.checkAudio();
    }
  }, [word.nzebi_word]);

  return (
    <div
      data-word-id={word.id}
      className={`card-modern p-4 md:p-5 group ${isMobile ? '' : 'animate-fade-in'} hover-scale`}
    >
      <div className="flex flex-col gap-4">
        {/* En-tête avec titre et catégorie */}
        <div className="flex items-start justify-between gap-3 md:gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 md:gap-3 mb-3 flex-wrap">
              <h3 className="text-xl md:text-2xl font-bold text-nzebi-primary dark:text-nzebi-accent group-hover:text-nzebi-primary-light dark:group-hover:text-nzebi-accent-light transition-colors duration-150">
                {displayMode === 'nzebi-first' ? word.nzebi_word : word.french_word}
              </h3>
              <span className="badge-category text-xs">
                {getCategoryName(word.part_of_speech)}
              </span>
            </div>
          </div>
          {/* Boutons d'action */}
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            <button
              onClick={async (e) => {
                e.stopPropagation();
                setIsPlaying(true);
                try {
                  const audioUrl = generateAudioUrl(word.nzebi_word);
                  console.log('Tentative lecture audio:', audioUrl);
                  const audioEl = new Audio(audioUrl);
                  audioEl.onended = () => setIsPlaying(false);
                  audioEl.onerror = (error) => {
                    console.error('Erreur audio:', error, 'URL:', audioUrl);
                    setIsPlaying(false);
                    if (word.url_prononciation) {
                      const fallback = new Audio(word.url_prononciation);
                      fallback.onended = () => setIsPlaying(false);
                      fallback.play().catch(err => {
                        console.error('Erreur de lecture audio fallback:', err);
                        setIsPlaying(false);
                      });
                    }
                  };
                  await audioEl.play();
                } catch (err) {
                  console.error('Erreur lors de la lecture audio:', err);
                  setIsPlaying(false);
                  if (word.url_prononciation) {
                    const fallback = new Audio(word.url_prononciation);
                    fallback.onended = () => setIsPlaying(false);
                    fallback.play().catch(e => {
                      console.error('Erreur de lecture audio fallback:', e);
                      setIsPlaying(false);
                    });
                  }
                }
              }}
              disabled={isPlaying}
              className={`p-1.5 md:p-2 rounded-lg hover:bg-nzebi-primary/10 dark:hover:bg-nzebi-accent/20 transition-transform duration-150 active:scale-90 ${
                isPlaying ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              aria-label="Écouter la prononciation"
            >
              <Volume2 size={20} />
            </button>

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
          </div>
        </div>

        {/* Traduction */}
        <div className="space-y-3">
          <div className="border-l-4 border-nzebi-primary dark:border-nzebi-accent pl-3">
            <p className="text-sm md:text-base font-medium text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary">
              {displayMode === 'nzebi-first' ? 'Traduction' : 'Mot nzébi'}
            </p>
            <p className="text-base md:text-lg font-semibold text-nzebi-text dark:text-nzebi-text-dark mt-1">
              {displayMode === 'nzebi-first' ? word.french_word : word.nzebi_word}
            </p>
          </div>

          {/* Exemple */}
          {word.example_nzebi && (
            <div className="pt-2 border-t border-nzebi-surface dark:border-nzebi-surface-dark">
              <p className="text-xs md:text-sm font-medium text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary uppercase tracking-wide mb-2">
                Exemple
              </p>
              <div className="space-y-2">
                <div className="bg-nzebi-surface/50 dark:bg-nzebi-surface-dark/50 rounded p-3">
                  <p className="text-sm md:text-base italic text-nzebi-text dark:text-nzebi-text-dark">
                    "{word.example_nzebi}"
                  </p>
                  <p className="text-xs md:text-sm text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary mt-2">
                    {word.example_french}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Informations supplémentaires */}
          {(word.plural_form || word.synonyms || word.scientific_name) && (
            <div className="pt-2 border-t border-nzebi-surface dark:border-nzebi-surface-dark space-y-2">
              {word.plural_form && (
                <div>
                  <p className="text-xs md:text-sm font-medium text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary uppercase tracking-wide">
                    Pluriel
                  </p>
                  <p className="text-sm md:text-base text-nzebi-text dark:text-nzebi-text-dark">
                    {word.plural_form}
                  </p>
                </div>
              )}
              {word.synonyms && (
                <div>
                  <p className="text-xs md:text-sm font-medium text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary uppercase tracking-wide">
                    Synonymes
                  </p>
                  <p className="text-sm md:text-base text-nzebi-text dark:text-nzebi-text-dark">
                    {word.synonyms}
                  </p>
                </div>
              )}
              {word.scientific_name && (
                <div>
                  <p className="text-xs md:text-sm font-medium text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary uppercase tracking-wide">
                    Nom scientifique
                  </p>
                  <p className="text-sm md:text-base italic text-nzebi-text dark:text-nzebi-text-dark">
                    {word.scientific_name}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

WordCard.displayName = 'WordCard';

export default WordCard;

