
import React, { useState } from 'react';
import { DictionaryEntry, getCategoryById } from '@/lib/dictionaryData';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface WordsListProps {
  entries: DictionaryEntry[];
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

  return (
    <div className="space-y-4 pb-20">
      {entries.map((entry) => {
        const isExpanded = expandedEntry === entry.id;
        const category = getCategoryById(entry.categoryId);
        
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
                <span className="text-lg font-medium text-gray-800">
                  {entry.nzebi}
                </span>
                {isExpanded ? <ChevronUp className="ml-2 h-4 w-4" /> : <ChevronDown className="ml-2 h-4 w-4" />}
              </div>
              <button className="text-yellow-400">
                <Star size={24} />
              </button>
            </div>

            {isExpanded && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="mt-2">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-700">{entry.french}</p>
                    <Badge variant="outline" className="bg-green-100">
                      {category?.name || entry.categoryId}
                    </Badge>
                  </div>
                  
                  <div className="mt-3 pt-2 border-t border-gray-100">
                    <p className="font-semibold text-sm text-gray-700">Exemple:</p>
                    <p className="italic text-sm text-gray-600">{entry.example.nzebi}</p>
                    <p className="text-sm text-gray-600">{entry.example.french}</p>
                  </div>
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
