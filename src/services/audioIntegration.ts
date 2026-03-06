/**
 * Audio Integration Helper
 * Provides utilities to work with audio files for words
 */

import { Word } from '@/services/wordsService';
import { generateAudioUrl, generateAudioUrlFallbacks } from '@/services/audioRoutes';

export interface WordWithAudio extends Word {
  audioUrl?: string;
  audioAvailable: boolean;
}

/**
 * Enhance a word with audio information
 * @param word - The word object
 * @returns Word object with audio information
 */
export const enhanceWordWithAudio = (word: Word): WordWithAudio => {
  const audioUrl = generateAudioUrl(word.nzebi_word);
  
  return {
    ...word,
    audioUrl,
    audioAvailable: !!word.url_prononciation, // This will be updated once audio files are checked
  };
};

/**
 * Enhance multiple words with audio information
 * @param words - Array of words
 * @returns Array of words with audio information
 */
export const enhanceWordsWithAudio = (words: Word[]): WordWithAudio[] => {
  return words.map(word => enhanceWordWithAudio(word));
};

/**
 * Get the best audio URL for a word
 * Prioritizes local audio files over prononciation URLs
 * @param word - The word object
 * @returns The audio URL to use
 */
export const getBestAudioUrl = (word: Word): string | null => {
  const localAudioUrl = generateAudioUrl(word.nzebi_word);
  return localAudioUrl || word.url_prononciation || null;
};

/**
 * Get all possible audio URLs for a word in order of preference
 * @param word - The word object
 * @returns Array of audio URLs to try
 */
export const getAllAudioUrls = (word: Word): string[] => {
  const localUrls = generateAudioUrlFallbacks(word.nzebi_word);
  const allUrls = [...localUrls];
  
  // Add fallback URL if it exists
  if (word.url_prononciation && !allUrls.includes(word.url_prononciation)) {
    allUrls.push(word.url_prononciation);
  }
  
  return allUrls;
};

/**
 * Create an HTML Audio element with fallback support
 * @param word - The word object
 * @returns HTMLAudioElement with all available sources
 */
export const createAudioElement = (word: Word): HTMLAudioElement => {
  const audio = new Audio();
  const urls = getAllAudioUrls(word);
  
  // Try to load from each URL
  urls.forEach(url => {
    const source = document.createElement('source');
    source.src = url;
    // Try to infer type from URL
    if (url.includes('.mp3')) source.type = 'audio/mpeg';
    else if (url.includes('.ogg')) source.type = 'audio/ogg';
    else if (url.includes('.wav')) source.type = 'audio/wav';
    else if (url.includes('.m4a')) source.type = 'audio/mp4';
    audio.appendChild(source);
  });
  
  return audio;
};

/**
 * Batch create audio elements for multiple words
 * @param words - Array of words
 * @returns Map of word IDs to audio elements
 */
export const createAudioElements = (
  words: Word[]
): Map<string, HTMLAudioElement> => {
  const audioMap = new Map<string, HTMLAudioElement>();
  
  words.forEach(word => {
    audioMap.set(word.id, createAudioElement(word));
  });
  
  return audioMap;
};

/**
 * Preload audio for words (useful for performance)
 * @param words - Array of words to preload
 * @returns Promise that resolves when all audio is preloaded
 */
export const preloadAudio = async (words: Word[]): Promise<void> => {
  const preloadPromises = words.map(word => {
    return new Promise<void>((resolve) => {
      const audio = createAudioElement(word);
      audio.addEventListener('canplay', () => resolve(), { once: true });
      audio.addEventListener('error', () => resolve(), { once: true });
      audio.load();
      
      // Timeout after 5 seconds
      setTimeout(() => resolve(), 5000);
    });
  });
  
  try {
    await Promise.all(preloadPromises);
  } catch (error) {
    console.warn('Error preloading audio:', error);
  }
};

/**
 * Check which words have audio available
 * @param words - Array of words
 * @returns Promise that resolves to a Set of word IDs that have audio
 */
export const checkAudioAvailability = async (words: Word[]): Promise<Set<string>> => {
  const availableIds = new Set<string>();
  
  await Promise.all(
    words.map(async word => {
      const urls = getAllAudioUrls(word);
      
      for (const url of urls) {
        try {
          const response = await fetch(url, { method: 'HEAD' });
          if (response.ok) {
            availableIds.add(word.id);
            break;
          }
        } catch (error) {
          // Continue to next URL
          continue;
        }
      }
    })
  );
  
  return availableIds;
};
