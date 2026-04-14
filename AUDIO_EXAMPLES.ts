/**
 * Audio System - Quick Start Example
 * Demonstrates how to use the audio system in your components
 */

// ============================================================================
// EXAMPLE 1: Simple audio playback in a component
// ============================================================================

import { useAudio } from '@/hooks/use-audio';
import { Volume2 } from 'lucide-react';

function SimpleAudioExample() {
  const { wordId } = { wordId: 'mambo' }; // In real code, get from props
  const audio = useAudio({ wordId });

  return (
    <button
      onClick={audio.play}
      disabled={audio.isPlaying}
      className="flex items-center gap-2 px-4 py-2 rounded bg-blue-500 text-white"
    >
      <Volume2 size={20} />
      {audio.isPlaying ? 'Playing...' : 'Play Audio'}
    </button>
  );
}

// ============================================================================
// EXAMPLE 2: Using audioService directly
// ============================================================================

import { getAudioUrl, playWordAudio, checkAudioExists } from '@/services/audioService';

async function AudioServiceExample() {
  const wordId = 'mambo';

  // Get the audio URL
  const url = getAudioUrl(wordId);
  console.log('Audio URL:', url); // Output: /audio/mambo.mp3

  // Check if audio exists
  const exists = await checkAudioExists(wordId);
  console.log('Audio exists:', exists);

  // Play audio
  if (exists) {
    try {
      await playWordAudio(wordId);
      console.log('Audio played successfully');
    } catch (error) {
      console.error('Failed to play audio:', error);
    }
  }
}

// ============================================================================
// EXAMPLE 3: Using audioRoutes for URL generation
// ============================================================================

import { generateAudioUrl, generateAudioUrlFallbacks } from '@/services/audioRoutes';

function AudioRoutesExample() {
  const wordId = 'ekala';

  // Generate single audio URL
  const primaryUrl = generateAudioUrl(wordId);
  console.log('Primary URL:', primaryUrl); // /audio/ekala.mp3

  // Generate fallback URLs (in order of preference)
  const urls = generateAudioUrlFallbacks(wordId);
  console.log('All URLs:', urls); 
  // Output: ['/audio/ekala.mp3', '/audio/ekala.ogg', '/audio/ekala.wav', '/audio/ekala.m4a']

  return (
    <audio controls>
      {urls.map((url) => (
        <source key={url} src={url} />
      ))}
    </audio>
  );
}

// ============================================================================
// EXAMPLE 4: Using audioIntegration with Word objects
// ============================================================================

import { Word } from '@/services/wordsService';
import { 
  getBestAudioUrl, 
  getAllAudioUrls,
  createAudioElement,
  preloadAudio 
} from '@/services/audioIntegration';

function AudioIntegrationExample(word: Word) {
  // Get the best audio URL (prioritizes local audio)
  const bestUrl = getBestAudioUrl(word);

  // Get all possible audio URLs
  const allUrls = getAllAudioUrls(word);

  // Create an audio element with fallback support
  const audioElement = createAudioElement(word);
  
  const handlePlay = () => {
    audioElement.play();
  };

  return (
    <div>
      <button onClick={handlePlay}>Play with Fallback</button>
      <p>Primary URL: {bestUrl}</p>
      <p>All URLs: {allUrls.join(', ')}</p>
    </div>
  );
}

// ============================================================================
// EXAMPLE 5: Preloading audio for multiple words
// ============================================================================

import { getAllWords } from '@/services/wordsService';

async function PreloadExample() {
  const words = await getAllWords();

  // Preload audio for all words
  // This improves performance by downloading audio files in advance
  await preloadAudio(words);
  console.log('All audio preloaded!');
}

// ============================================================================
// EXAMPLE 6: Checking which words have audio available
// ============================================================================

import { checkAudioAvailability } from '@/services/audioIntegration';

async function CheckAudioAvailabilityExample() {
  const words = await getAllWords();

  // Check which words have audio available
  const wordsWithAudio = await checkAudioAvailability(words);

  console.log(`${wordsWithAudio.size} words have audio available`);

  // Filter words that don't have audio
  const wordsWithoutAudio = words.filter(w => !wordsWithAudio.has(w.id));
  console.log('Words without audio:', wordsWithoutAudio.map(w => w.nzebi_word));
}

// ============================================================================
// EXAMPLE 7: Complete word detail component with audio
// ============================================================================

import { useState, useEffect } from 'react';

function WordDetailWithAudio({ word }: { word: Word }) {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const audio = useAudio({ wordId: word.nzebi_word });

  useEffect(() => {
    // Check if audio exists when word changes
    audio.checkAudio();
  }, [word.id]);

  const handlePlayAudio = async () => {
    setIsPlayingAudio(true);
    try {
      await audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  return (
    <div className="word-detail">
      <h1>{word.nzebi_word}</h1>
      <p>{word.french_word}</p>

      {(audio.hasAudio || word.url_prononciation) && (
        <button
          onClick={handlePlayAudio}
          disabled={isPlayingAudio}
          className="play-button"
        >
          {isPlayingAudio ? 'Playing...' : 'Listen to pronunciation'}
        </button>
      )}

      {audio.error && <p className="error">{audio.error}</p>}
    </div>
  );
}

// ============================================================================
// FILE STRUCTURE
// ============================================================================

/*
Your audio files should be organized like this:

project/
├── public/
│   └── audio/
│       ├── mambo.mp3
│       ├── ekala.mp3
│       ├── botsi.mp3
│       ├── obia.mp3
│       └── ... more audio files
├── src/
│   ├── services/
│   │   ├── audioService.ts       (Main audio functions)
│   │   ├── audioRoutes.ts        (Route generation)
│   │   ├── audioIntegration.ts   (Word integration)
│   │   └── wordsService.ts       (Word data)
│   ├── hooks/
│   │   └── use-audio.ts          (React hook for audio)
│   ├── components/
│   │   ├── AudioWordCard.tsx     (Word card with audio)
│   │   └── ...
│   └── pages/
│       ├── WordDetail.tsx        (Updated with audio support)
│       └── ...
└── AUDIO_SETUP_GUIDE.md          (This guide)
*/

// ============================================================================
// NAMING CONVENTIONS
// ============================================================================

/*
Audio file names should follow these rules:

✓ CORRECT:
  - mambo.mp3
  - ekala.mp3
  - obia-moni.mp3
  - obia_moni.mp3
  - my-word.mp3

✗ INCORRECT:
  - Mambo.mp3 (uppercase)
  - ekala .mp3 (spaces)
  - ékala.mp3 (special characters)
  - my word.mp3 (spaces)
  - my'word.mp3 (apostrophe)

The audio service will automatically:
1. Convert to lowercase
2. Replace special characters with hyphens
3. Remove spaces
*/

// ============================================================================
// FALLBACK SYSTEM
// ============================================================================

/*
The audio system uses a smart fallback mechanism:

1. Try /audio/{word}.mp3
2. If fails, try /audio/{word}.ogg
3. If fails, try /audio/{word}.wav
4. If fails, try /audio/{word}.m4a
5. If all fail, try word.url_prononciation (legacy)

This ensures compatibility across different browsers and provides
a graceful degradation if some formats aren't supported.
*/

export { SimpleAudioExample, AudioServiceExample, AudioRoutesExample };
