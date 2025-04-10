
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
        <SearchBar onSearch={handleSearch} />
        
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
