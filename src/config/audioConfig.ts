// AUDIO_SYSTEM_CONFIG.ts
// Configuration et constants pour le système d'audio

export const AUDIO_CONFIG = {
  // Chemins
  AUDIO_BASE_PATH: '/audio',
  AUDIO_UPLOAD_DIR: 'public/audio',

  // Formats supportés et ordre de préférence
  SUPPORTED_FORMATS: ['mp3', 'ogg', 'wav', 'm4a'] as const,
  
  // Format par défaut
  DEFAULT_FORMAT: 'mp3' as const,

  // Limites
  MAX_FILE_SIZE_MB: 5,
  MAX_FILE_SIZE_BYTES: 5 * 1024 * 1024,

  // Timeouts
  AUDIO_LOAD_TIMEOUT_MS: 5000,
  AUDIO_CHECK_TIMEOUT_MS: 3000,

  // MIME types
  MIME_TYPES: {
    mp3: 'audio/mpeg',
    ogg: 'audio/ogg',
    wav: 'audio/wav',
    m4a: 'audio/mp4',
  } as const,

  // Configuration de préchargement
  PRELOAD_BATCH_SIZE: 10,
  PRELOAD_TIMEOUT_PER_WORD_MS: 5000,

  // Options de l'élément audio
  AUDIO_ELEMENT_OPTIONS: {
    preload: 'none' as const, // 'none' | 'metadata' | 'auto'
    crossOrigin: 'anonymous' as const,
  },

  // Messages d'erreur
  ERRORS: {
    FILE_NOT_FOUND: 'Audio file not found',
    LOAD_TIMEOUT: 'Audio file took too long to load',
    PLAYBACK_FAILED: 'Failed to play audio',
    NO_AUDIO_AVAILABLE: 'No audio available for this word',
  },

  // Messages de succès
  SUCCESS: {
    AUDIO_LOADED: 'Audio loaded successfully',
    AUDIO_PLAYING: 'Audio is now playing',
    AUDIO_FINISHED: 'Audio finished playing',
  },
};

// Types
export type AudioFormat = typeof AUDIO_CONFIG.SUPPORTED_FORMATS[number];
export type MimeType = typeof AUDIO_CONFIG.MIME_TYPES[keyof typeof AUDIO_CONFIG.MIME_TYPES];

/**
 * Obtenir le MIME type pour un format
 */
export function getMimeType(format: AudioFormat): MimeType {
  return AUDIO_CONFIG.MIME_TYPES[format];
}

/**
 * Vérifier si un format est supporté
 */
export function isFormatSupported(format: string): format is AudioFormat {
  return AUDIO_CONFIG.SUPPORTED_FORMATS.includes(format as any);
}

/**
 * Obtenir l'extension avec le point
 */
export function getFileExtension(format: AudioFormat): string {
  return `.${format}`;
}

/**
 * Créer un nom de fichier audio valide
 */
export function sanitizeAudioFileName(wordName: string, format: AudioFormat = 'mp3'): string {
  // Convertir en minuscules
  let sanitized = wordName.toLowerCase();

  // Remplacer les caractères spéciaux par des tirets
  sanitized = sanitized.replace(/[^a-z0-9-_]/g, '-');

  // Remplacer les tirets multiples par un seul
  sanitized = sanitized.replace(/-+/g, '-');

  // Supprimer les tirets au début et à la fin
  sanitized = sanitized.trim().replace(/^-+|-+$/g, '');

  return `${sanitized}.${format}`;
}

/**
 * Valider un nom de fichier audio
 */
export function isValidAudioFileName(fileName: string): boolean {
  // Le fichier doit avoir un format valide
  const parts = fileName.split('.');
  if (parts.length !== 2) return false;

  const [name, format] = parts;

  // Le nom doit contenir au moins un caractère
  if (!name || name.length === 0) return false;

  // Le format doit être supporté
  if (!isFormatSupported(format)) return false;

  // Vérifier les caractères valides
  const validNameRegex = /^[a-z0-9-_]+$/;
  return validNameRegex.test(name);
}

/**
 * Exemple d'utilisation
 */
export function getAudioFileExample(wordName: string): string {
  return `public/audio/${sanitizeAudioFileName(wordName)}`;
}

// Export de la configuration complète
export default AUDIO_CONFIG;
