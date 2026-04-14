/**
 * Unified Audio Service
 * Single source of truth for all audio functionality
 */

const getBasePath = (): string => {
  const baseUrl = (import.meta as any).env?.BASE_URL || '/';
  return String(baseUrl).replace(/\/$/, '');
};

/**
 * Generate the audio URL for a word
 */
export const getAudioUrl = (wordName: string, format: string = 'mp3'): string => {
  return `${getBasePath()}/audio/${wordName.toLowerCase()}.${format}`;
};

/**
 * Play audio for a word with fallback to pronunciation URL
 */
export const playWordAudio = async (
  wordName: string,
  fallbackUrl?: string | null
): Promise<void> => {
  const audioUrl = getAudioUrl(wordName);

  return new Promise((resolve, reject) => {
    const audio = new Audio(audioUrl);

    audio.onended = () => resolve();
    audio.onerror = () => {
      if (fallbackUrl) {
        const fallback = new Audio(fallbackUrl);
        fallback.onended = () => resolve();
        fallback.onerror = () => reject(new Error(`Failed to play audio for: ${wordName}`));
        fallback.play().catch(reject);
      } else {
        reject(new Error(`Failed to play audio for: ${wordName}`));
      }
    };

    audio.play().catch((err) => {
      if (fallbackUrl) {
        const fallback = new Audio(fallbackUrl);
        fallback.onended = () => resolve();
        fallback.onerror = () => reject(err);
        fallback.play().catch(reject);
      } else {
        reject(err);
      }
    });
  });
};
