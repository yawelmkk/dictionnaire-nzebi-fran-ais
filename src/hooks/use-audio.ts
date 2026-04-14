import { useState, useCallback } from 'react';
<<<<<<< HEAD
import { playWordAudio } from '@/services/audioService';

export interface UseAudioOptions {
  wordId: string;
  fallbackUrl?: string | null;
}

export const useAudio = (options: UseAudioOptions) => {
  const { wordId, fallbackUrl } = options;
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

=======
import { playWordAudio, checkAudioExists } from '@/services/audioService';

export interface UseAudioOptions {
  wordId: string;
  fileName?: string;
}

export const useAudio = (options: UseAudioOptions) => {
  const { wordId, fileName } = options;
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasAudio, setHasAudio] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if audio exists
  const checkAudio = useCallback(async () => {
    try {
      const exists = await checkAudioExists(wordId, fileName);
      setHasAudio(exists);
      return exists;
    } catch (err) {
      console.error('Error checking audio:', err);
      setHasAudio(false);
      return false;
    }
  }, [wordId, fileName]);

  // Play audio
>>>>>>> origin/main
  const play = useCallback(async () => {
    try {
      setIsPlaying(true);
      setError(null);
<<<<<<< HEAD
      await playWordAudio(wordId, fallbackUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to play audio');
      console.error('Audio playback error:', err);
    } finally {
      setIsPlaying(false);
    }
  }, [wordId, fallbackUrl]);

  return { isPlaying, error, play };
=======
      
      await playWordAudio(wordId, fileName);
      
      setIsPlaying(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to play audio';
      setError(errorMessage);
      setIsPlaying(false);
      console.error('Audio playback error:', err);
    }
  }, [wordId, fileName]);

  return {
    isPlaying,
    hasAudio,
    error,
    play,
    checkAudio,
  };
>>>>>>> origin/main
};
