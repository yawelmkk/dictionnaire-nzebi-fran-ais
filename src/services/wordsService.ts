import { supabase } from "@/integrations/supabase/client";
import { WordFormValues } from "@/components/word-form/WordFormSchema";
import { categories } from "@/lib/dictionaryData";
import { createClient } from "@supabase/supabase-js"; // Supposons que vous ayez besoin de createClient pour supabase_functions_url

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
let usingJsonDictionary = false;

const SUPABASE_FUNCTIONS_URL = "https://thymkjtnggytmiemzenp.supabase.co/functions/v1"; // REMPLACEZ PAR VOTRE URL RÉELLE DE SUPABASE FUNCTIONS

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

// Nouvelle implémentation utilisant la fonction Edge Supabase
const loadWordsFromEdgeFunction = async (lettre?: string): Promise<Word[]> => {
  let url = `${SUPABASE_FUNCTIONS_URL}/get-dictionnaire`;
  if (lettre) {
    url += `?lettre=${lettre}`;
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        // 'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY, // Cette ligne est maintenant commentée ou supprimée
      },
    });
    if (!response.ok) {
      console.error(`Erreur de la fonction Edge: ${response.status} ${response.statusText}`);
      return [];
    }
    const data = await response.json();
    return data as Word[];
  } catch (error) {
    console.error("Erreur lors de l'appel de la fonction Edge get-dictionnaire:", error);
    return [];
  }
};

export const getAllWords = async (): Promise<Word[]> => {
  // Charger les mots via la nouvelle fonction Edge
  const wordsFromEdge = await loadWordsFromEdgeFunction();
  
  if (wordsFromEdge.length > 0) {
    console.log("Utilisation de la fonction Edge comme source principale.");
    // Vous pouvez toujours implémenter une logique de fusion avec localStorage si nécessaire pour les ajouts/modifications locales.
    // Pour l'instant, nous retournons simplement les mots de la fonction Edge.
    return wordsFromEdge;
  } else {
    // Si la fonction Edge échoue, vous pouvez revenir à Supabase Database directement (ou localStorage si vous le conservez)
    console.log("La fonction Edge n'a pas renvoyé de mots. Bascule vers Supabase Database.");
    let words = loadWordsFromLocal(); // Conserver cette ligne si vous voulez garder la persistance locale

    if (words.length === 0) {
      try {
        console.log("LocalStorage vide, chargement depuis Supabase Database...");
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
            is_verb: null,
            plural_form: null,
            synonyms: null,
            scientific_name: null,
            imperative: null,
          }));
          saveWordsToLocal(supabaseWords);
          words = supabaseWords;
        }
      } catch (supabaseError) {
        console.warn('Supabase: Impossible de se connecter ou de charger les mots (hors ligne).', supabaseError);
        return [];
      }
    }
    return words;
  }
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

  // Ajouter au localStorage pour persistance locale
  const currentWords = loadWordsFromLocal();
  const updatedWords = [...currentWords, newWord];
  saveWordsToLocal(updatedWords);
  console.log("Mot ajouté localement.");
  
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
  
  return true;
};

export const getCategoryName = (categoryId: string) => {
  // Recherche dans les catégories principales
  const mainCategory = categories.find(cat => cat.id === categoryId);
  if (mainCategory) return mainCategory.name;

  // Recherche dans les sous-catégories
  for (const category of categories) {
    if (category.subcategories) {
      const subCategory = category.subcategories.find(sub => sub.id === categoryId);
      if (subCategory) return subCategory.name;
    }
  }

  return categoryId;
};

// Assurez-vous d'exporter la fonction si elle doit être utilisée ailleurs, par exemple pour le filtrage par lettre
export const getWordsByLetter = async (lettre: string): Promise<Word[]> => {
  return loadWordsFromEdgeFunction(lettre);
};