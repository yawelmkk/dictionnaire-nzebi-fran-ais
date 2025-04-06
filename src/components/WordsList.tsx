
import React from 'react';
import WordCard from './WordCard';
import { DictionaryEntry } from '@/lib/dictionaryData';

interface WordsListProps {
  entries: DictionaryEntry[];
}

const WordsList: React.FC<WordsListProps> = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun mot trouvé.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <WordCard key={entry.id} entry={entry} />
      ))}
    </div>
  );
};

export default WordsList;
