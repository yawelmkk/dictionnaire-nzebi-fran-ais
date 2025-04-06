
import React from 'react';
import WordCard from './WordCard';
import { DictionaryEntry } from '@/lib/dictionaryData';
import { Star } from 'lucide-react';

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
    <div className="space-y-4 pb-20">
      {entries.map((entry) => (
        <div key={entry.id} className="bg-white rounded-3xl shadow-sm p-4 flex justify-between items-center">
          <span className="text-lg font-medium text-gray-800">
            {entry.nzebi}
          </span>
          <button className="text-yellow-400">
            <Star size={24} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default WordsList;
