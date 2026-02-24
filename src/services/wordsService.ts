import { WordFormValues } from "@/components/word-form/WordFormSchema";

export interface Word {
  id: string;
  nzebi_word: string;
  french_word: string;
  part_of_speech: string;
  example_nzebi: string | null;
  example_french: string | null;
  url_prononciation: string | null;
  is_verb: boolean | null;
  plural_form: string | null;
  synonyms: string | null;
  scientific_name: string | null;
  imperative: string | null;
}

const LOCAL_STORAGE_KEY = 'nzebi_dictionary_words';
let cachedAllWords: Word[] | null = null;

const loadWordsFromLocal = (): Word[] => {
  try {
    const serializedWords = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (serializedWords === null) {
      return [];
    }
    return JSON.parse(serializedWords);
  } catch (error) {
    console.error("Erreur lors du chargement des mots depuis le stockage local:", error);
    return [];
  }
};

const saveWordsToLocal = (words: Word[]) => {
  try {
    const serializedWords = JSON.stringify(words);
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedWords);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des mots dans le stockage local:", error);
  }
};

const loadWordsFromJson = async (): Promise<Word[]> => {
  try {
    const startTime = performance.now();
    const response = await fetch('./dictionnaire.json', {
      cache: 'force-cache', // Use cached version if available (Service Worker)
    });
    
    if (!response.ok) {
      console.error(`Erreur lors du chargement: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    const endTime = performance.now();
    console.log(`Dictionnaire chargé: ${data.length} mots (${(endTime - startTime).toFixed(2)}ms)`);

    return data.map((item: any) => ({
      id: item.id,
      nzebi_word: item.nzebi_word,
      french_word: item.french_word,
      part_of_speech: item.part_of_speech,
      example_nzebi: item.example_nzebi || null,
      example_french: item.example_french || null,
      url_prononciation: item.pronunciation_url || null,
      is_verb: typeof item.is_verb === 'string' ? (item.is_verb.toLowerCase() === 'vrai') : (item.is_verb || null),
      plural_form: item.plural_form || null,
      synonyms: item.synonyms || null,
      scientific_name: item.scientific_name || null,
      imperative: item.imperative || null,
    })) as Word[];
  } catch (error) {
    console.error("Erreur lors du chargement de dictionnaire.json:", error);
    
    // Try to get from IndexedDB cache as fallback
    try {
      const cachedData = await getCachedWordsFromIndexedDB();
      if (cachedData.length > 0) {
        console.log('[Offline] Utilisation de la cache IndexedDB:', cachedData.length, 'mots');
        return cachedData;
      }
    } catch (dbError) {
      console.error('IndexedDB fallback failed:', dbError);
    }
    
    return [];
  }
};

// IndexedDB cache for extra resilience
const initIndexedDB = async (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('nzebi-dictionary', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains('words')) {
        db.createObjectStore('words', { keyPath: 'id' });
      }
    };
  });
};

const getCachedWordsFromIndexedDB = async (): Promise<Word[]> => {
  try {
    const db = await initIndexedDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('words', 'readonly');
      const store = transaction.objectStore('words');
      const request = store.getAll();
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result as Word[]);
    });
  } catch (error) {
    console.error('Error accessing IndexedDB:', error);
    return [];
  }
};

const cacheWordsToIndexedDB = async (words: Word[]): Promise<void> => {
  try {
    const db = await initIndexedDB();
    const transaction = db.transaction('words', 'readwrite');
    const store = transaction.objectStore('words');
    
    // Clear old cache
    store.clear();
    
    // Add new words
    words.forEach(word => {
      store.add(word);
    });
    
    return new Promise((resolve, reject) => {
      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve();
    });
  } catch (error) {
    console.error('Error caching to IndexedDB:', error);
  }
};

const loadAllWordsInternal = async (): Promise<Word[]> => {
  const wordsFromJson = await loadWordsFromJson();
  if (wordsFromJson.length > 0) {
    // Cache words to IndexedDB for offline access
    await cacheWordsToIndexedDB(wordsFromJson);
    console.log(`Dictionnaire chargé: ${wordsFromJson.length} mots depuis dictionnaire.json`);
    return wordsFromJson;
  }
  
  console.error("Impossible de charger le dictionnaire.json");
  return [];
};

export const getAllWords = async (): Promise<Word[]> => {
  if (cachedAllWords !== null) {
    return cachedAllWords;
  }
  
  cachedAllWords = await loadAllWordsInternal();
  return cachedAllWords;
};

export const clearWordsCache = () => {
  cachedAllWords = null;
};

export interface PaginatedWordsResult {
  words: Word[];
  hasMore: boolean;
  total: number;
}

export const getWordsPaginated = async (
  _offset: number = 0,
  _limit: number = 50,
  searchTerm: string = ''
): Promise<PaginatedWordsResult> => {
  const allWords = await getAllWords();
  
  let filteredWords = allWords;
  if (searchTerm.trim()) {
    const searchLower = searchTerm.toLowerCase();
    filteredWords = allWords.filter(
      word =>
        word.nzebi_word.toLowerCase().includes(searchLower) ||
        word.french_word.toLowerCase().includes(searchLower)
    );
  }
  
  // On renvoie tous les mots filtrés, sans pagination, pour s'assurer
  // que l'utilisateur voit l'intégralité du dictionnaire.
  return {
    words: filteredWords,
    hasMore: false,
    total: filteredWords.length,
  };
};

export const addWord = async (wordData: WordFormValues) => {
  const newWord: Word = {
    id: Date.now().toString(),
    nzebi_word: wordData.nzebi,
    french_word: wordData.french,
    part_of_speech: wordData.categoryId,
    example_nzebi: wordData.exampleNzebi || null,
    example_french: wordData.exampleFrench || null,
    url_prononciation: wordData.urlPrononciation || null,
    is_verb: wordData.estVerbe || null,
    plural_form: wordData.pluralForm || null,
    synonyms: wordData.synonyms || null,
    scientific_name: wordData.scientificName || null,
    imperative: wordData.imperative || null,
  };

  const currentWords = loadWordsFromLocal();
  const updatedWords = [...currentWords, newWord];
  saveWordsToLocal(updatedWords);
  console.log("Mot ajouté localement.");
  
  clearWordsCache();
  
  return newWord;
};

export const editWord = async (wordData: WordFormValues) => {
  if (!wordData.id) {
    throw new Error("L'ID du mot est requis pour la modification.");
  }

  const updatedWord: Word = {
    id: wordData.id,
    nzebi_word: wordData.nzebi,
    french_word: wordData.french,
    part_of_speech: wordData.categoryId,
    example_nzebi: wordData.exampleNzebi || null,
    example_french: wordData.exampleFrench || null,
    url_prononciation: wordData.urlPrononciation || null,
    is_verb: wordData.estVerbe || null,
    plural_form: wordData.pluralForm || null,
    synonyms: wordData.synonyms || null,
    scientific_name: wordData.scientificName || null,
    imperative: wordData.imperative || null,
  };

  const currentWords = loadWordsFromLocal();
  const updatedWordsList = currentWords.map(word => 
    word.id === updatedWord.id ? updatedWord : word
  );
  saveWordsToLocal(updatedWordsList);
  console.log("Mot modifié localement.");
  
  clearWordsCache();
  
  return updatedWord;
};

export const getWordsByCategory = async (categoryId: string) => {
  const allWords = await getAllWords();
  return allWords.filter(word => word.part_of_speech === categoryId);
};

export const deleteWord = async (id: string) => {
  let currentWords = loadWordsFromLocal();
  const updatedWords = currentWords.filter(word => word.id !== id);
  saveWordsToLocal(updatedWords);
  console.log("Mot supprimé localement.");
  
  clearWordsCache();
  
  return true;
};
