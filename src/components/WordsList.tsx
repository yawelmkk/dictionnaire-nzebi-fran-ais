import React, { useState } from 'react';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { categories } from '@/lib/dictionaryData';

interface Entry {
  id: string;
  nzebi_word: string;
  french_word: string;
  part_of_speech: string;
  example_nzebi?: string;
  example_french?: string;
  plural_form?: string;
  synonyms?: string;
}

interface WordsListProps {
  entries: Entry[];
}

const WordsList: React.FC<WordsListProps> = ({ entries }) => {
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  if (entries.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Aucun mot trouvé.</p>
      </div>
    );
  }

  const toggleExpand = (entryId: string) => {
    if (expandedEntry === entryId) {
      setExpandedEntry(null);
    } else {
      setExpandedEntry(entryId);
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : categoryId;
  };

  return (
    <div className="space-y-4">
      {entries.map((entry) => {
        const isExpanded = expandedEntry === entry.id;
        const hasExamples = entry.example_nzebi || entry.example_french;
        
        return (
          <div 
            key={entry.id} 
            className="bg-white rounded-3xl shadow-sm overflow-hidden"
          >
            <div 
              className="p-4 flex justify-between items-center cursor-pointer"
              onClick={() => toggleExpand(entry.id)}
            >
              <div className="flex items-center">
                <span className="text-2xl md:text-3xl font-extrabold text-green-900" translate="no">
                  {entry.nzebi_word}
                </span>
                {isExpanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
              </div>
              <button className="text-yellow-400">
                <Star size={24} />
              </button>
            </div>

            {isExpanded && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="mt-2 space-y-2">
                  <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                    <p className="text-lg text-gray-700 font-medium">Traduction : <span className="text-gray-900 font-semibold">{entry.french_word}</span></p>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 font-semibold text-xs px-2 py-1 rounded">
                      {getCategoryName(entry.part_of_speech)}
                    </Badge>
                  </div>
                  {entry.plural_form && (
                    <div className="text-sm text-blue-800"><span className="font-semibold">Pluriel :</span> {entry.plural_form}</div>
                  )}
                  {entry.synonyms && (
                    <div className="text-sm text-purple-800"><span className="font-semibold">Synonymes :</span> {entry.synonyms}</div>
                  )}
                  {hasExamples && (
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <p className="font-bold text-sm text-gray-800 mb-1">Exemples :</p>
                      {entry.example_nzebi && <p className="italic text-base text-green-900 leading-tight">{entry.example_nzebi}</p>}
                      {entry.example_french && <p className="text-sm text-gray-600 leading-tight">{entry.example_french}</p>}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default WordsList;
