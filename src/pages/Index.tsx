
import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import WordsList from '@/components/WordsList';
import Layout from '@/components/Layout';
import { getAllWords } from '@/services/wordsService';
import { toast } from 'sonner';

const Index = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [allWords, setAllWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const data = await getAllWords();
        // Sort words alphabetically by nzebi_word
        const sortedData = [...data].sort((a, b) => 
          a.nzebi_word.localeCompare(b.nzebi_word, 'fr')
        );
        setAllWords(sortedData);
        setSearchResults(sortedData);
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
      setSearchResults(allWords);
      return;
    }
    
    const filtered = allWords.filter(word => {
      return word.nzebi_word.toLowerCase().includes(query.toLowerCase()) ||
             word.french_word.toLowerCase().includes(query.toLowerCase());
    });
    
    setSearchResults(filtered);
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Sticky search bar container */}
        <div className="sticky top-0 pt-2 pb-3 bg-slate-100 z-10">
          <SearchBar onSearch={handleSearch} />
        </div>
        
        <div className="mt-2 pb-20">
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
