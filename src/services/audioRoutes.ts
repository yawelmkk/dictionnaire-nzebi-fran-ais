/**
 * Audio Routes Handler
 * Manages routing and serving of audio files for words
 * 
 * URL Pattern: /api/audio/:wordId or /api/audio/:wordId.mp3
 */

export interface AudioRouteConfig {
  basePath: string;
  uploadDir: string;
  supportedFormats: string[];
  maxFileSize: number; // in bytes
}

export const DEFAULT_AUDIO_CONFIG: AudioRouteConfig = {
  basePath: '/audio',
  uploadDir: 'public/audio',
  supportedFormats: ['mp3', 'ogg', 'wav', 'm4a'],
  maxFileSize: 5 * 1024 * 1024, // 5MB
};

/**
 * Get the audio file path for a word
 * @param wordId - The ID or name of the word
 * @param format - File format (defaults to mp3)
 * @returns The relative file path
 */
export const getAudioFilePath = (
  wordId: string,
  format: string = 'mp3'
): string => {
  // Sanitize wordId to create safe filename
  const sanitized = wordId
    .toLowerCase()
    .replace(/[^a-z0-9-_]/g, '-')
    .replace(/-+/g, '-')
    .trim();
  
  return `${DEFAULT_AUDIO_CONFIG.basePath}/${sanitized}.${format}`;
};

/**
 * Get all possible audio routes for a word
 * @param wordId - The ID or name of the word
 * @returns Array of possible audio routes
 */
export const getAudioRoutes = (wordId: string): string[] => {
  return DEFAULT_AUDIO_CONFIG.supportedFormats.map(format =>
    getAudioFilePath(wordId, format)
  );
};

/**
 * Extract word ID from audio route
 * @param route - The audio route (e.g., /audio/wordname.mp3)
 * @returns The word ID/name without extension
 */
export const extractWordIdFromRoute = (route: string): string => {
  // Remove /audio/ prefix and file extension
  const withoutPrefix = route.replace(/^\/audio\//, '');
  const withoutExtension = withoutPrefix.replace(/\.\w+$/, '');
  return withoutExtension;
};

/**
 * Validate audio file format
 * @param format - File format to validate
 * @returns boolean - true if format is supported
 */
export const isValidAudioFormat = (format: string): boolean => {
  return DEFAULT_AUDIO_CONFIG.supportedFormats.includes(format.toLowerCase());
};

/**
 * Generate audio route URL for use in frontend
 * @param wordId - The ID or name of the word
 * @param baseUrl - The base URL of the application
 * @param format - File format (defaults to mp3)
 * @returns Full URL to audio file
 */
export const generateAudioUrl = (
  wordId: string,
  baseUrl: string = '/',
  format: string = 'mp3'
): string => {
  const path = getAudioFilePath(wordId, format);
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');
  return `${cleanBaseUrl}${path}`;
};

/**
 * Generate fallback audio URLs (in order of preference)
 * @param wordId - The ID or name of the word
 * @param baseUrl - The base URL of the application
 * @returns Array of audio URLs to try in order
 */
export const generateAudioUrlFallbacks = (
  wordId: string,
  baseUrl: string = '/'
): string[] => {
  return ['mp3', 'ogg', 'wav', 'm4a'].map(format =>
    generateAudioUrl(wordId, baseUrl, format)
  );
};
