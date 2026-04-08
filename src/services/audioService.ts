/**
 * Service for managing audio files for words
 * Audio files are stored in /public/audio/ directory
 * Audio filenames correspond to word IDs or nzebi_word names
 */

/**
 * Generate the audio URL for a word based on its ID or name
 * @param wordId - The ID of the word or the word itself
 * @param fileName - Optional: specific filename (without extension)
 * @returns The audio file URL path
 */
export const getAudioUrl = (wordId: string, fileName?: string): string => {
  const baseUrl = (import.meta as any).env?.BASE_URL || '/';
  const basePath = String(baseUrl).replace(/\/$/, '');
  
  // Use custom fileName if provided, otherwise use wordId
  const audioFileName = fileName || wordId;
  
  // Return audio URL - assumes .mp3 extension
  return `${basePath}/audio/${audioFileName}.mp3`;
};

/**
 * Generate alternative audio URLs for fallback (different formats)
 * @param wordId - The ID of the word or the word itself
 * @param fileName - Optional: specific filename (without extension)
 * @returns Array of audio file URLs in order of preference
 */
export const getAudioUrlOptions = (wordId: string, fileName?: string): string[] => {
  const baseUrl = (import.meta as any).env?.BASE_URL || '/';
  const basePath = String(baseUrl).replace(/\/$/, '');
  
  const audioFileName = fileName || wordId;
  
  return [
    `${basePath}/audio/${audioFileName}.mp3`,
    `${basePath}/audio/${audioFileName}.ogg`,
    `${basePath}/audio/${audioFileName}.wav`,
  ];
};

/**
 * Check if an audio file exists for a word (client-side check)
 * @param wordId - The ID of the word or the word itself
 * @param fileName - Optional: specific filename (without extension)
 * @returns Promise<boolean> - true if audio file exists
 */
export const checkAudioExists = async (wordId: string, fileName?: string): Promise<boolean> => {
  try {
    const audioUrl = getAudioUrl(wordId, fileName);
    const response = await fetch(audioUrl, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error(`Error checking audio file: ${wordId}`, error);
    return false;
  }
};

/**
 * Play audio for a word
 * @param wordId - The ID of the word or the word itself
 * @param fileName - Optional: specific filename (without extension)
 * @returns Promise that resolves when audio finishes or rejects on error
 */
export const playWordAudio = async (wordId: string, fileName?: string): Promise<void> => {
  try {
    const audioUrl = getAudioUrl(wordId, fileName);
    const audio = new Audio(audioUrl);
    
    return new Promise((resolve, reject) => {
      audio.onended = () => resolve();
      audio.onerror = () => reject(new Error(`Failed to play audio: ${wordId}`));
      
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error initializing audio:', error);
    throw error;
  }
};

/**
 * Get audio file statistics (for admin/debug purposes)
 * Returns information about available audio files
 */
export const getAudioStats = () => {
  const baseUrl = (import.meta as any).env?.BASE_URL || '/';
  const basePath = String(baseUrl).replace(/\/$/, '');
  
  return {
    audioBasePath: `${basePath}/audio/`,
    supportedFormats: ['mp3', 'ogg', 'wav'],
    documentationUrl: 'See README.md for audio file naming conventions'
  };
};
