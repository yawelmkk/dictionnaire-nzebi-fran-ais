import React, { useState } from 'react';
import { Star, ChevronDown, ChevronUp, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { categories } from '@/lib/dictionaryData';
import { Word } from '@/services/wordsService';
import AddWordDialog from './AddWordDialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Entry extends Word {}

interface WordsListProps {
  entries: Entry[];
  onEditWord: (word: Entry) => void;
  onDeleteWord: (id: string) => void;
}

const WordsList: React.FC<WordsListProps> = ({ entries, onEditWord, onDeleteWord }) => {
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [editingWord, setEditingWord] = useState<Entry | null>(null);
  const [favorites, setFavorites] = useState<string[]>(() => {
    // On peut utiliser localStorage ici si on veut persister les favoris
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('favorites');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const toggleFavorite = (entryId: string) => {
    setFavorites(prev => {
      const updated = prev.includes(entryId)
        ? prev.filter(id => id !== entryId)
        : [...prev, entryId];
      localStorage.setItem('favorites', JSON.stringify(updated));
      return updated;
    });
  };

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

  const handleEditClick = (entry: Entry, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingWord(entry);
  };

  const handleDeleteClick = (entryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onDeleteWord(entryId);
  };

  return (
    <div className="space-y-4">
      {entries.map((entry) => {
        const isExpanded = expandedEntry === entry.id;
        const hasExamples = (entry.example_nzebi && entry.example_nzebi.trim() !== '') || (entry.example_french && entry.example_french.trim() !== '');
        const isFavorite = favorites.includes(entry.id);

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
              <div className="flex items-center gap-2">
                <button
                  className={isFavorite ? "text-yellow-400" : "text-gray-300"}
                  onClick={e => { e.stopPropagation(); toggleFavorite(entry.id); }}
                  title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                >
                  <Star fill={isFavorite ? "#facc15" : "none"} size={24} />
                </button>
              </div>
            </div>

            {isExpanded && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="mt-2 space-y-2">
                  <div className="flex flex-wrap justify-between items-center mb-2 gap-2">
                    <p className="text-lg text-gray-700 font-medium">Traduction : <span className="text-2xl text-gray-900 font-semibold">{entry.french_word}</span></p>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 font-semibold text-xs px-2 py-1 rounded">
                      {getCategoryName(entry.part_of_speech)}
                    </Badge>
                  </div>
                  {entry.plural_form && entry.plural_form.trim() !== '' && (
                    <div className="text-lg text-blue-800"><span className="font-semibold">Pluriel :</span> <span className="text-xl">{entry.plural_form}</span></div>
                  )}
                  {entry.synonyms && entry.synonyms.trim() !== '' && (
                    <div className="text-lg text-purple-800"><span className="font-semibold">Synonymes :</span> <span className="text-xl">{entry.synonyms}</span></div>
                  )}
                  {entry.scientific_name && entry.scientific_name.trim() !== '' && (
                    <div className="text-sm text-green-800"><span className="font-semibold">Nom scientifique :</span> {entry.scientific_name}</div>
                  )}
                  {entry.imperative && entry.imperative.trim() !== '' && (
                    <div className="text-lg text-pink-800"><span className="font-semibold">Impératif :</span> <span className="text-xl">{entry.imperative}</span></div>
                  )}
                  {(entry.is_verb === true || entry.is_verb === "VRAI" || entry.is_verb === "true") && (
                    <div className="text-sm text-orange-800"><span className="font-semibold">Verbe</span></div>
                  )}
                  {entry.url_prononciation && (
                    <div className="text-sm text-gray-600"><span className="font-semibold">Prononciation :</span> <a href={entry.url_prononciation} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Écouter</a></div>
                  )}
                  {hasExamples && (
                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <p className="font-bold text-sm text-gray-800 mb-1">Exemples :</p>
                      {entry.example_nzebi && entry.example_nzebi.trim() !== '' && <p className="italic text-xl text-green-900 leading-tight">{entry.example_nzebi}</p>}
                      {entry.example_french && entry.example_french.trim() !== '' && <p className="text-lg text-gray-600 leading-tight">{entry.example_french}</p>}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {editingWord && (
        <AddWordDialog
          editingWord={editingWord}
          onClose={() => setEditingWord(null)}
          onWordAdded={() => {
            setEditingWord(null);
            onEditWord(editingWord);
          }}
        />
      )}
    </div>
  );
};

export default WordsList;
