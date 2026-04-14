import { useState, useCallback } from 'react';
import { playWordAudio } from '@/services/audioService';

export interface UseAudioOptions {
  wordId: string;
  fallbackUrl?: string | null;
}

export const useAudio = (options: UseAudioOptions) => {
  const { wordId, fallbackUrl } = options;
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const play = useCallback(async () => {
    try {
      setIsPlaying(true);
      setError(null);
      await playWordAudio(wordId, fallbackUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to play audio');
      console.error('Audio playback error:', err);
    } finally {
      setIsPlaying(false);
    }
  }, [wordId, fallbackUrl]);

  return { isPlaying, error, play };
};
