
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
        <SearchBar onSearch={handleSearch} />
        
        <div className="mb-4">
          <CategoryFilter 
            selectedCategory={selectedCategory} 
            onSelectCategory={handleCategorySelect} 
          />
        </div>
        
        <div className="mt-6 pb-20">
          <WordsList entries={searchResults} />
        </div>
      </div>
    </Layout>
  );
};

export default Index;
