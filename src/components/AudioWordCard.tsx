/**
 * Word Card Component with Audio Support
 * Displays word cards with audio playback capability
 */

import { Word } from '@/services/wordsService';
import { getCategoryName } from '@/lib/dictionaryData';
import { useAudio } from '@/hooks/use-audio';
import { generateAudioUrl } from '@/services/audioRoutes';
import { Volume2 } from 'lucide-react';

interface AudioWordCardProps {
  word: Word;
  onClick?: () => void;
}

export function AudioWordCard({ word, onClick }: AudioWordCardProps) {
  const audio = useAudio({
    wordId: word.nzebi_word,
  });

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking the audio button
    if ((e.target as HTMLElement).closest('button[aria-label*="Écouter"]')) {
      return;
    }
    onClick?.();
  };

  const handlePlayAudio = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Try audio route first
      const audioUrl = generateAudioUrl(word.nzebi_word);
      const audio = new Audio(audioUrl);
      
      audio.onerror = () => {
        // Fallback to URL prononciation
        if (word.url_prononciation) {
          const fallbackAudio = new Audio(word.url_prononciation);
          fallbackAudio.play().catch(error => console.error('Error playing audio:', error));
        }
      };
      
      audio.play().catch(error => {
        if (word.url_prononciation) {
          const fallbackAudio = new Audio(word.url_prononciation);
          fallbackAudio.play().catch(err => console.error('Error playing audio:', err));
        } else {
          console.error('Error playing audio:', error);
        }
      });
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="p-4 rounded-lg border border-nzebi-surface dark:border-nzebi-surface-dark 
                 bg-white dark:bg-nzebi-surface-dark 
                 hover:shadow-md dark:hover:shadow-lg
                 transition-all duration-200 cursor-pointer
                 group"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-nzebi-primary dark:text-nzebi-accent 
                        group-hover:text-nzebi-primary/80 dark:group-hover:text-nzebi-accent/80
                        transition-colors">
            {word.nzebi_word}
          </h3>
          <p className="text-sm text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary">
            {word.french_word}
          </p>
        </div>
        
        {(word.url_prononciation || audio.hasAudio !== false) && (
          <button
            onClick={handlePlayAudio}
            disabled={audio.isPlaying}
            aria-label="Écouter la prononciation"
            className="p-2 rounded-lg bg-nzebi-primary/10 dark:bg-nzebi-accent/20 
                       text-nzebi-primary dark:text-nzebi-accent
                       hover:bg-nzebi-primary/20 dark:hover:bg-nzebi-accent/30
                       disabled:opacity-50
                       transition-all duration-200"
          >
            {audio.isPlaying ? (
              <Volume2 size={18} className="animate-pulse" />
            ) : (
              <Volume2 size={18} />
            )}
          </button>
        )}
      </div>

      {word.part_of_speech && (
        <div className="text-xs text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary">
          <span className="inline-block px-2 py-1 rounded-full 
                          bg-nzebi-surface dark:bg-nzebi-surface-dark">
            {getCategoryName(word.part_of_speech)}
          </span>
        </div>
      )}
    </div>
  );
}
