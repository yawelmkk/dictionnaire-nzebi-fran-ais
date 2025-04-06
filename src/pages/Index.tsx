
import React, { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import WordsList from '@/components/WordsList';
import CategoryFilter from '@/components/CategoryFilter';
import Layout from '@/components/Layout';
import { searchEntries, getEntriesByCategory, dictionaryEntries } from '@/lib/dictionaryData';

const Index = () => {
  const [searchResults, setSearchResults] = useState(dictionaryEntries);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const handleSearch = (query: string) => {
    const results = searchEntries(query);
    
    if (selectedCategory) {
      setSearchResults(results.filter(entry => entry.categoryId === selectedCategory));
    } else {
      setSearchResults(results);
    }
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    
    if (categoryId) {
      setSearchResults(getEntriesByCategory(categoryId));
    } else {
      setSearchResults(dictionaryEntries);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">Dictionnaire Nzébi-Français</h1>
          <p className="text-gray-600">Trouvez la traduction des mots entre Nzébi et Français</p>
        </div>
        
        <SearchBar onSearch={handleSearch} />
        
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          onSelectCategory={handleCategorySelect} 
        />
        
        <div className="mt-6 pb-20">
          <WordsList entries={searchResults} />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
