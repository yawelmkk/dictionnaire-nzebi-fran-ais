import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import WordsList from '@/components/WordsList';
import Layout from '@/components/Layout';
import { getAllWords, editWord, deleteWord, Word } from '@/services/wordsService';
import { toast } from 'sonner';
import { categories } from '@/lib/dictionaryData';

const getAllCategoryIds = (categoryId: string) => {
  const cat = categories.find(c => c.id === categoryId);
  if (!cat) return [categoryId];
  const subIds = cat.subcategories ? cat.subcategories.map(sub => sub.id) : [];
  return [categoryId, ...subIds];
};

const removeAccents = (str: string) => {
  return str.normalize("NFD").replace(/[^\w\s]/g, "");
};

const Index = () => {
  const [searchResults, setSearchResults] = useState<Word[]>([]);
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentQuery, setCurrentQuery] = useState('');

  const fetchWords = async () => {
    try {
      setLoading(true);
      const data = await getAllWords();
      const sortedData = [...data].sort((a, b) => 
        a.nzebi_word.localeCompare(b.nzebi_word, 'fr')
      );
      setAllWords(sortedData);
      setSearchResults(getFilteredWords(sortedData, currentQuery, selectedCategory));
    } catch (error) {
      console.error('Error fetching words:', error);
      toast.error('Erreur lors du chargement des mots');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredWords = (words: Word[], query: string, categoryId: string | null): Word[] => {
    let filtered = words;

    if (query.trim()) {
      const lowerCaseQuery = removeAccents(query.toLowerCase());
      filtered = filtered.filter(word => {
        const nzebiNormalized = removeAccents(word.nzebi_word.toLowerCase());
        const frenchNormalized = removeAccents(word.french_word.toLowerCase());
        return nzebiNormalized.includes(lowerCaseQuery) || frenchNormalized.includes(lowerCaseQuery);
      });
    }

    if (categoryId) {
      const ids = getAllCategoryIds(categoryId);
      filtered = filtered.filter(word => ids.includes(word.part_of_speech));
    }

    return filtered;
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const handleSearch = (query: string) => {
    setCurrentQuery(query);
    setSearchResults(getFilteredWords(allWords, query, selectedCategory));
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSearchResults(getFilteredWords(allWords, currentQuery, categoryId));
  };

  const handleWordAddedOrEdited = () => {
    fetchWords();
  };

  const handleDeleteWord = async (id: string) => {
    try {
      await deleteWord(id);
      toast.success('Mot supprimé avec succès !');
      fetchWords();
    } catch (error) {
      console.error('Erreur lors de la suppression du mot:', error);
      toast.error('Erreur lors de la suppression du mot.');
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto min-h-screen">
        {/* <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={handleCategorySelect} /> */}
        <div className="sticky top-[72px] z-40 bg-slate-100 py-2">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        <div className="mt-2 pb-0">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Chargement des mots...</p>
            </div>
          ) : (
            <WordsList 
              entries={searchResults}
              onEditWord={handleWordAddedOrEdited}
              onDeleteWord={handleDeleteWord}
            />
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
