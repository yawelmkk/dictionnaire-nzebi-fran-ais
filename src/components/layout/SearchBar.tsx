import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-nzebi-text-dark-secondary/60 pointer-events-none" size={16} />
      <input
        type="text"
        placeholder="Rechercher un mot..."
        value={value}
        onChange={e => onChange(e.target.value)}
        className="search-input"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-nzebi-surface-elevated transition-colors duration-150"
          aria-label="Effacer la recherche"
        >
          <svg className="w-3.5 h-3.5 text-nzebi-text-dark-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;
