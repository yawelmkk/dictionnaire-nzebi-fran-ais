
import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import WordsList from '@/components/WordsList';
import CategoryFilter from '@/components/CategoryFilter';
import Layout from '@/components/Layout';
import { getAllWords } from '@/services/wordsService';
import { toast } from 'sonner';

const Index = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [allWords, setAllWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const data = await getAllWords();
        setAllWords(data);
        setSearchResults(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching words:', error);
        toast.error('Erreur lors du chargement des mots');
        setLoading(false);
      }
    };

    fetchWords();
  }, []);

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults(selectedCategory 
        ? allWords.filter(word => word.part_of_speech === selectedCategory)
        : allWords);
      return;
    }
    
    const filtered = allWords.filter(word => {
      const matchesQuery = 
        word.nzebi_word.toLowerCase().includes(query.toLowerCase()) ||
        word.french_word.toLowerCase().includes(query.toLowerCase());
        
      return selectedCategory 
        ? matchesQuery && word.part_of_speech === selectedCategory
        : matchesQuery;
    });
    
    setSearchResults(filtered);
  };

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    
    if (categoryId) {
      setSearchResults(allWords.filter(word => word.part_of_speech === categoryId));
    } else {
      setSearchResults(allWords);
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
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Chargement des mots...</p>
            </div>
          ) : (
            <WordsList entries={searchResults} />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
