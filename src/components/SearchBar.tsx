import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Languages } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setSearchQuery(newQuery);
    onSearch(newQuery); // Recherche en temps réel
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-xl mx-auto sticky top-0 z-10 bg-slate-100 py-2">
      <div className="relative flex items-center bg-white rounded-full p-1 border border-gray-300 shadow-sm">
        <Input
          type="text"
          placeholder="Rechercher un mot en Nzébi ou Français..."
          value={searchQuery}
          onChange={handleInputChange}
          className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full pl-4"
          translate="no"
        />
        <div className="flex items-center space-x-1 pr-2">
          <Button 
            type="submit" 
            size="sm" 
            variant="ghost" 
            className="p-1 bg-green-600 hover:bg-green-700 text-white rounded-md h-8 w-8 flex items-center justify-center"
            aria-label="Rechercher"
          >
            <Search size={18} />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
