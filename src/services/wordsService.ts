import { supabase } from "@/integrations/supabase/client";
import { WordFormValues } from "@/components/word-form/WordFormSchema";
// import { categories, getCategoryName } from "@/lib/dictionaryData"; // Commenté car non utilisé
// import { createClient } from "@supabase/supabase-js"; // Not used if Edge Function is commented out

// Définition de l'interface Word avec tous les champs spécifiés
export interface Word {
  id: string;
  nzebi_word: string;
  french_word: string;
  part_of_speech: string; // Correspond à categoryId dans le formulaire
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
<<<<<<< HEAD
// Removed `let usingJsonDictionary = false;` as it's unused.
=======
// Cache pour stocker tous les mots chargés (évite de recharger à chaque pagination)
let cachedAllWords: Word[] | null = null;
>>>>>>> f199d3694392ca6e93a107dd066c483fb2b46c12

// Commented out Supabase Edge Function related code
// const SUPABASE_FUNCTIONS_URL = "https://thymkjtnggytmiemzenp.supabase.co/functions/v1"; // REMPLACEZ PAR VOTRE URL RÉELLE DE SUPABASE FUNCTIONS
// const loadWordsFromEdgeFunction = async (lettre?: string): Promise<Word[]> => {
//   let url = `${SUPABASE_FUNCTIONS_URL}/get-dictionnaire`;
//   if (lettre) {
//     url += `?lettre=${lettre}`;
//   }
//   try {
//     const response = await fetch(url, {
//       headers: {
//         'Content-Type': 'application/json',
//         // 'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
//       },
//     });
//     if (!response.ok) {
//       console.error(`Erreur de la fonction Edge: ${response.status} ${response.statusText}`);
//       return [];
//     }
//     const data = await response.json();
//     return data as Word[];
//   } catch (error) {
//     console.error("Erreur lors de l'appel de la fonction Edge get-dictionnaire:", error);
//     return [];
//   }
// };

// Fonction pour charger les mots depuis localStorage
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

// Fonction pour sauvegarder les mots dans localStorage
const saveWordsToLocal = (words: Word[]) => {
  try {
    const serializedWords = JSON.stringify(words);
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedWords);
  } catch (error) {
    console.error("Erreur lors de la sauvegarde des mots dans le stockage local:", error);
  }
};

// Nouvelle fonction pour charger les mots depuis le fichier JSON statique
const loadWordsFromJson = async (): Promise<Word[]> => {
  try {
    // Use import.meta.env.BASE_URL to get the correct base path for GitHub Pages
    const jsonPath = `${(import.meta as any).env?.BASE_URL || ''}dictionnaire.json`;
    console.log(`Tentative de chargement du dictionnaire depuis: ${jsonPath}`);
    const response = await fetch(jsonPath);
    if (!response.ok) {
      console.error(`Erreur lors du chargement de dictionnaire.json: ${response.status} ${response.statusText}`);
      return [];
    }
    const data = await response.json();
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
    return [];
  }
};

<<<<<<< HEAD
export const getAllWords = async (): Promise<Word[]> => {
=======
// Fonction interne pour charger tous les mots (utilisée pour le cache)
const loadAllWordsInternal = async (): Promise<Word[]> => {
>>>>>>> f199d3694392ca6e93a107dd066c483fb2b46c12
  // 1. Tenter de charger les mots depuis le fichier JSON statique local
  const wordsFromJson = await loadWordsFromJson();
  if (wordsFromJson.length > 0) {
    console.log("Utilisation du fichier JSON local comme source principale.");
<<<<<<< HEAD
    // Optionnel: Sauvegarder dans localStorage pour une première charge rapide en cas de besoin
    // saveWordsToLocal(wordsFromJson); // Uniquement si vous voulez les mettre en cache pour les sessions futures
=======
>>>>>>> f199d3694392ca6e93a107dd066c483fb2b46c12
    return wordsFromJson;
  } else {
    console.log("Le fichier JSON local n'a pas renvoyé de mots ou a échoué. Bascule vers d'autres sources.");

    // 2. Fallback au localStorage pour les mots ajoutés/modifiés localement
    let words = loadWordsFromLocal();
    if (words.length > 0) {
      console.log("Utilisation des mots du localStorage.");
      return words;
    }

    // 3. Fallback à Supabase Database (nécessite une connexion internet)
    console.log("LocalStorage vide, tentative de chargement depuis Supabase Database (nécessite une connexion).");
    try {
      const { data, error } = await supabase
        .from('words')
        .select('*');

      if (error) {
        console.error('Erreur Supabase lors du chargement:', error);
        return [];
      }

      if (data) {
        const supabaseWords: Word[] = data.map(dbWord => ({
          id: dbWord.id,
          nzebi_word: dbWord.nzebi_word,
          french_word: dbWord.french_word,
          part_of_speech: dbWord.part_of_speech,
          example_nzebi: dbWord.example_nzebi,
          example_french: dbWord.example_french,
          url_prononciation: dbWord.pronunciation_url || null,
          is_verb: null, // À mapper si ces champs existent dans votre DB Supabase
          plural_form: null,
          synonyms: null,
          scientific_name: null,
          imperative: null,
        }));
        saveWordsToLocal(supabaseWords); // Sauvegarder les mots de Supabase en local pour les sessions futures
        return supabaseWords;
      }
    } catch (supabaseError) {
      console.warn('Supabase: Impossible de se connecter ou de charger les mots (hors ligne).', supabaseError);
      return [];
    }
  }
  return []; // Retourne un tableau vide si aucune source ne fonctionne
};

<<<<<<< HEAD
=======
export const getAllWords = async (): Promise<Word[]> => {
  // Si le cache existe, le retourner
  if (cachedAllWords !== null) {
    return cachedAllWords;
  }
  
  // Sinon, charger et mettre en cache
  cachedAllWords = await loadAllWordsInternal();
  return cachedAllWords;
};

// Fonction pour réinitialiser le cache (utile après ajout/modification/suppression)
export const clearWordsCache = () => {
  cachedAllWords = null;
};

// Nouvelle fonction pour obtenir les mots paginés
export interface PaginatedWordsResult {
  words: Word[];
  hasMore: boolean;
  total: number;
}

export const getWordsPaginated = async (
  offset: number = 0,
  limit: number = 50,
  searchTerm: string = ''
): Promise<PaginatedWordsResult> => {
  // Charger tous les mots (utilise le cache si disponible)
  const allWords = await getAllWords();
  
  // Filtrer si un terme de recherche est fourni
  let filteredWords = allWords;
  if (searchTerm.trim()) {
    const searchLower = searchTerm.toLowerCase();
    filteredWords = allWords.filter(
      word =>
        word.nzebi_word.toLowerCase().includes(searchLower) ||
        word.french_word.toLowerCase().includes(searchLower)
    );
  }
  
  // Paginer
  const paginatedWords = filteredWords.slice(offset, offset + limit);
  const hasMore = offset + limit < filteredWords.length;
  
  return {
    words: paginatedWords,
    hasMore,
    total: filteredWords.length
  };
};

>>>>>>> f199d3694392ca6e93a107dd066c483fb2b46c12
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

  // Ajouter au localStorage pour persistance locale
  const currentWords = loadWordsFromLocal();
  const updatedWords = [...currentWords, newWord];
  saveWordsToLocal(updatedWords);
  console.log("Mot ajouté localement.");
  
<<<<<<< HEAD
=======
  // Réinitialiser le cache pour inclure le nouveau mot
  clearWordsCache();
  
>>>>>>> f199d3694392ca6e93a107dd066c483fb2b46c12
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

  // Modifier dans localStorage
  const currentWords = loadWordsFromLocal();
  const updatedWordsList = currentWords.map(word => 
    word.id === updatedWord.id ? updatedWord : word
  );
  saveWordsToLocal(updatedWordsList);
  console.log("Mot modifié localement.");
  
<<<<<<< HEAD
=======
  // Réinitialiser le cache pour inclure les modifications
  clearWordsCache();
  
>>>>>>> f199d3694392ca6e93a107dd066c483fb2b46c12
  return updatedWord;
};

export const getWordsByCategory = async (categoryId: string) => {
  const allWords = await getAllWords();
  return allWords.filter(word => word.part_of_speech === categoryId);
};

export const deleteWord = async (id: string) => {
  // Supprimer du localStorage
  let currentWords = loadWordsFromLocal();
  const updatedWords = currentWords.filter(word => word.id !== id);
  saveWordsToLocal(updatedWords);
  console.log("Mot supprimé localement.");
  
<<<<<<< HEAD
=======
  // Réinitialiser le cache pour refléter la suppression
  clearWordsCache();
  
>>>>>>> f199d3694392ca6e93a107dd066c483fb2b46c12
  return true;
};


// Assurez-vous d'exporter la fonction si elle doit être utilisée ailleurs, par exemple pour le filtrage par lettre
// export const getWordsByLetter = async (lettre: string): Promise<Word[]> => {
//   return loadWordsFromEdgeFunction(lettre);
// };