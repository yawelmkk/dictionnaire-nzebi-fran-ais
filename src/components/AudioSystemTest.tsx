/**
 * Audio System Test Component
 * Use this component to test the audio system and verify configuration
 */

import { useState, useEffect } from 'react';
import { getAllWords, Word } from '@/services/wordsService';
import {
  checkAudioAvailability,
  getAllAudioUrls,
  createAudioElement,
} from '@/services/audioIntegration';
import { useAudio } from '@/hooks/use-audio';
import { Volume2, Check, X, AlertCircle } from 'lucide-react';

export function AudioSystemTest() {
  const [words, setWords] = useState<Word[]>([]);
  const [audioStats, setAudioStats] = useState<{
    total: number;
    withAudio: number;
    tested: boolean;
  }>({ total: 0, withAudio: 0, tested: false });
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadWords = async () => {
      try {
        const loadedWords = await getAllWords();
        setWords(loadedWords);
        setAudioStats(prev => ({ ...prev, total: loadedWords.length }));
      } catch (error) {
        console.error('Error loading words:', error);
      }
    };
    loadWords();
  }, []);

  const testAudioAvailability = async () => {
    setLoading(true);
    try {
      const availableIds = await checkAudioAvailability(words);
      setAudioStats({
        total: words.length,
        withAudio: availableIds.size,
        tested: true,
      });
    } catch (error) {
      console.error('Error testing audio:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 bg-white dark:bg-nzebi-surface-dark rounded-lg">
      <div>
        <h2 className="text-2xl font-bold text-nzebi-primary dark:text-nzebi-accent mb-4">
          🎵 Audio System Test
        </h2>
        <p className="text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary">
          Test your audio configuration and check which words have audio files available.
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
          <p className="text-sm text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary">
            Total Words
          </p>
          <p className="text-2xl font-bold text-nzebi-primary dark:text-nzebi-accent">
            {audioStats.total}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
          <p className="text-sm text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary">
            With Audio
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {audioStats.withAudio}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20">
          <p className="text-sm text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary">
            Coverage
          </p>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {audioStats.total > 0
              ? Math.round((audioStats.withAudio / audioStats.total) * 100)
              : 0}
            %
          </p>
        </div>
      </div>

      {/* Test Button */}
      <button
        onClick={testAudioAvailability}
        disabled={loading}
        className="w-full px-4 py-2 bg-nzebi-primary text-white rounded-lg hover:bg-nzebi-primary/90 disabled:opacity-50 transition-all"
      >
        {loading ? 'Testing...' : 'Test Audio Availability'}
      </button>

      {audioStats.tested && (
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <Check size={20} />
            <span>Audio test completed!</span>
          </div>
        </div>
      )}

      {/* Word Selection */}
      <div>
        <label className="block text-sm font-medium mb-2 text-nzebi-text dark:text-nzebi-text-dark">
          Select a word to test
        </label>
        <select
          value={selectedWord?.id || ''}
          onChange={e => {
            const word = words.find(w => w.id === e.target.value);
            setSelectedWord(word || null);
          }}
          className="w-full px-3 py-2 rounded border border-nzebi-surface dark:border-nzebi-surface-dark bg-white dark:bg-nzebi-surface-dark"
        >
          <option value="">Choose a word...</option>
          {words.map(word => (
            <option key={word.id} value={word.id}>
              {word.nzebi_word} - {word.french_word}
            </option>
          ))}
        </select>
      </div>

      {/* Word Detail and Audio Test */}
      {selectedWord && (
        <WordAudioTest word={selectedWord} />
      )}
    </div>
  );
}

interface WordAudioTestProps {
  word: Word;
}

function WordAudioTest({ word }: WordAudioTestProps) {
  const audio = useAudio({ wordId: word.nzebi_word });
  const [urls, setUrls] = useState<string[]>([]);
  const [urlStatuses, setUrlStatuses] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const testUrls = async () => {
      const allUrls = getAllAudioUrls(word);
      setUrls(allUrls);

      // Test each URL
      const statuses: { [key: string]: boolean } = {};
      for (const url of allUrls) {
        try {
          const response = await fetch(url, { method: 'HEAD' });
          statuses[url] = response.ok;
        } catch (error) {
          statuses[url] = false;
        }
      }
      setUrlStatuses(statuses);
    };

    testUrls();
    audio.checkAudio();
  }, [word.id]);

  return (
    <div className="p-4 rounded-lg border border-nzebi-surface dark:border-nzebi-surface-dark">
      <h3 className="font-bold text-lg mb-4 text-nzebi-text dark:text-nzebi-text-dark">
        {word.nzebi_word} - {word.french_word}
      </h3>

      {/* Play Button */}
      <button
        onClick={audio.play}
        disabled={audio.isPlaying}
        className="flex items-center gap-2 px-4 py-2 bg-nzebi-primary text-white rounded-lg hover:bg-nzebi-primary/90 disabled:opacity-50 mb-4"
      >
        <Volume2 size={20} />
        {audio.isPlaying ? 'Playing...' : 'Play Audio'}
      </button>

      {audio.error && (
        <div className="p-3 mb-4 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <X size={18} />
            <span>{audio.error}</span>
          </div>
        </div>
      )}

      {audio.hasAudio === false && !audio.error && (
        <div className="p-3 mb-4 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
            <AlertCircle size={18} />
            <span>No audio file found</span>
          </div>
        </div>
      )}

      {audio.hasAudio && (
        <div className="p-3 mb-4 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
            <Check size={18} />
            <span>Audio file available</span>
          </div>
        </div>
      )}

      {/* URL Status */}
      <div>
        <h4 className="font-medium text-sm mb-2 text-nzebi-text dark:text-nzebi-text-dark">
          Audio URLs (tested):
        </h4>
        <div className="space-y-2">
          {urls.map(url => (
            <div
              key={url}
              className="flex items-center gap-2 p-2 rounded bg-gray-50 dark:bg-gray-900/20 text-sm"
            >
              {urlStatuses[url] ? (
                <Check size={16} className="text-green-600 dark:text-green-400" />
              ) : (
                <X size={16} className="text-red-600 dark:text-red-400" />
              )}
              <code className="flex-1 break-all text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary">
                {url}
              </code>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-4 p-3 rounded bg-blue-50 dark:bg-blue-900/20 text-sm text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary">
        <p>
          <strong>Word ID:</strong> {word.id}
        </p>
        <p>
          <strong>Word Name:</strong> {word.nzebi_word}
        </p>
        {word.url_prononciation && (
          <p>
            <strong>Legacy Pronunciation URL:</strong>{' '}
            <code className="break-all">{word.url_prononciation}</code>
          </p>
        )}
      </div>
    </div>
  );
}
