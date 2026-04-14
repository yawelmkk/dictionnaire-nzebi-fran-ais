import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary pointer-events-none" size={20} />
      <input
        type="text"
        placeholder="Rechercher un mot en nzébi ou en français..."
        value={value}
        onChange={e => onChange(e.target.value)}
        className="search-input pl-10 py-3 text-base"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg hover:bg-nzebi-primary/10 dark:hover:bg-nzebi-accent/20 transition-colors duration-200"
          aria-label="Effacer la recherche"
        >
          <svg className="w-4 h-4 text-nzebi-text-secondary dark:text-nzebi-text-dark-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
