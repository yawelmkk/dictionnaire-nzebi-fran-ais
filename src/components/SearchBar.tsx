
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

  return (
    <form onSubmit={handleSearch} className="w-full max-w-xl mx-auto mb-6">
      <div className="relative flex items-center bg-white rounded-full p-1 border border-gray-300 shadow-sm">
        <Input
          type="text"
          placeholder="Rechercher un mot en Nzébi ou Français..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 border-none focus-visible:ring-0 focus-visible:ring-offset-0 rounded-full pl-4"
        />
        <div className="flex items-center space-x-1 pr-2">
          <Button 
            type="submit" 
            size="sm" 
            variant="ghost" 
            className="p-1 bg-green-600 hover:bg-green-700 text-white rounded-md h-8 w-8 flex items-center justify-center"
          >
            <Search size={18} />
          </Button>
          <Button 
            type="button" 
            size="sm" 
            variant="ghost" 
            className="p-1 bg-blue-400 text-white rounded-md h-8 w-8 flex items-center justify-center"
          >
            <Languages size={18} />
          </Button>
          <Button 
            type="button" 
            size="sm" 
            variant="ghost" 
            className="p-1 bg-white border border-gray-200 rounded-md h-8 w-8 flex items-center justify-center"
          >
            <img src="/lovable-uploads/a0b60ee2-a054-4897-9eb1-b1b10be935dd.png" alt="Flag" className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;
