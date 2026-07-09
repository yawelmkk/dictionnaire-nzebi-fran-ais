import { memo, useState, useCallback } from 'react';
import { getCategoryName } from '@/lib/dictionaryData';
import { Star, Volume2 } from 'lucide-react';
import { Word } from '@/services/wordsService';
import { useDisplayMode } from '@/context/DisplayContext';
import { playWordAudio } from '@/services/audioService';

interface WordCardProps {
  word: Word;
  isFavorite: boolean;
  onToggleFavorite: (wordId: string) => void;
  isMobile: boolean;
}

const WordCard = memo(({ word, isFavorite, onToggleFavorite }: WordCardProps) => {
  const { displayMode } = useDisplayMode();
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) return;
    setIsPlaying(true);
    try {
      await playWordAudio(word.nzebi_word, word.url_prononciation);
    } catch (err) {
      console.error('Erreur audio:', err);
    } finally {
      setIsPlaying(false);
    }
  }, [isPlaying, word.nzebi_word, word.url_prononciation]);

  const handleToggleFavorite = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(word.id);
  }, [onToggleFavorite, word.id]);

  const headword = displayMode === 'nzebi-first' ? word.nzebi_word : word.french_word;
  const translation = displayMode === 'nzebi-first' ? word.french_word : word.nzebi_word;

  return (
    <div
      data-word-id={word.id}
      className="card-modern px-5 py-4 cursor-pointer active:scale-[0.98] transition-transform duration-150"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3
            className="font-serif text-2xl font-bold italic text-nzebi-accent leading-tight truncate"
          >
            {headword}
          </h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-nzebi-text-dark-secondary mt-0.5">
            {getCategoryName(word.part_of_speech)}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={handlePlay}
            disabled={isPlaying}
            className={`w-10 h-10 rounded-full bg-nzebi-surface-elevated text-nzebi-accent flex items-center justify-center active:scale-90 transition-transform duration-150 ${
              isPlaying ? 'opacity-50' : ''
            }`}
            aria-label="Écouter la prononciation"
          >
            <Volume2 size={18} />
          </button>
          <button
            onClick={handleToggleFavorite}
            className="w-10 h-10 rounded-full bg-nzebi-surface-elevated flex items-center justify-center active:scale-90 transition-transform duration-150"
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <Star
              size={18}
              className={
                isFavorite
                  ? 'fill-nzebi-accent text-nzebi-accent'
                  : 'text-nzebi-text-dark-secondary'
              }
            />
          </button>
        </div>
      </div>

      <div className="mt-3">
        <p className="text-base font-medium text-nzebi-text-dark">{translation}</p>
        {word.example_nzebi && (
          <p className="text-sm italic text-nzebi-text-dark-secondary mt-1">
            “{word.example_nzebi}”
            {word.example_french && (
              <span className="block not-italic text-xs text-nzebi-text-dark-secondary/80 mt-1">
                {word.example_french}
              </span>
            )}
          </p>
        )}

        {(word.plural_form || word.synonyms || word.scientific_name || word.imperative) && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {word.imperative && (
              <span className="badge-category">Impératif · {word.imperative}</span>
            )}
            {word.plural_form && (
              <span className="badge-category">Pluriel · {word.plural_form}</span>
            )}
            {word.synonyms && (
              <span className="badge-category">Syn. · {word.synonyms}</span>
            )}
            {word.scientific_name && (
              <span className="badge-category italic normal-case tracking-normal">
                {word.scientific_name}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

WordCard.displayName = 'WordCard';

export default WordCard;
