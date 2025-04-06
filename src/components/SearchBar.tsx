
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

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
    <form onSubmit={handleSearch} className="relative w-full max-w-md mx-auto">
      <div className="flex items-center">
        <Input
          type="text"
          placeholder="Rechercher un mot en Nzébi ou Français..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pr-10"
        />
        <Button 
          type="submit" 
          size="sm" 
          variant="ghost" 
          className="absolute right-0 p-2"
        >
          <Search size={20} className="text-muted-foreground" />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
