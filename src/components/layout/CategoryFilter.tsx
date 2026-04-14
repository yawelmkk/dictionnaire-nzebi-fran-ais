import React, { useRef } from 'react';

export const grammarCategories = [
  { id: 'all', label: 'Tout' },
  { id: 'verbe', label: 'Verbe' },
  { id: 'pronom_personnel', label: 'Pronom Personnel', match: ['pronom personel', 'pronom personnel'] },
  { id: 'pronom_other', label: 'Pronom', match: ['pronom', 'pronom relatif', 'pronom possessif', 'pronom demonstratif'] },
  { id: 'adjectif_group', label: 'Adjectif', match: ['adjectif', 'adjectif possessif', 'adjectif demonstratif', 'adjectif qualificatif', 'adjectif numeral', 'adjectif indéfini'] },
  { id: 'adverbe_simple', label: 'Adverbe', match: ['adverbe'] },
  { id: 'adverbe_group', label: 'Adverbe (T/I/D)', match: ['adverbe de temp', 'adverbe interrogatif', 'adverbe demonstratif'] },
  { id: 'assertion', label: 'Assertion' },
  { id: 'conjonction', label: 'Conjonction' },
  { id: 'article', label: 'Article' },
  { id: 'determinant', label: 'Déterminant' },
  { id: 'interjection', label: 'Interjection' },
  { id: 'locution prepositive', label: 'Loc. Prépositive' },
  { id: 'négation', label: 'Négation' },
  { id: 'nom propre', label: 'Nom Propre' },
  { id: 'nom commun', label: 'Nom Commun' },
  { id: 'préposition', label: 'Préposition' },
];

export const getMatchingPOS = (categoryId: string): string[] | null => {
  if (categoryId === 'all') return null;
  const cat = grammarCategories.find(c => c.id === categoryId);
  if (!cat) return null;
  if ('match' in cat && cat.match) return cat.match as string[];
  return [cat.id];
};

interface CategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ activeCategory, onCategoryChange }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={scrollRef}
      className="flex gap-2 overflow-x-auto scrollbar-hide py-2"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {grammarCategories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id === activeCategory ? 'all' : cat.id)}
          className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 whitespace-nowrap
            ${activeCategory === cat.id
              ? 'bg-nzebi-primary text-white dark:bg-nzebi-accent dark:text-nzebi-background-dark shadow-sm'
              : 'bg-nzebi-surface dark:bg-nzebi-surface-dark text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary hover:bg-nzebi-primary/10 dark:hover:bg-nzebi-accent/20'
            }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
