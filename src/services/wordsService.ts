
import { supabase } from "@/integrations/supabase/client";
import { WordFormValues } from "@/components/word-form/WordFormSchema";
import { categories } from "@/lib/dictionaryData";

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
  forme_plurielle: string | null;
  synonymes: string | null;
  scientific_name: string | null;
  imperatif: string | null;
}

const LOCAL_STORAGE_KEY = 'nzebi_dictionary_words';

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

// Fonction pour charger le dictionnaire depuis dictionnaire.json
const loadJsonDictionary = async (): Promise<Word[]> => {
  try {
    const response = await fetch('/dictionnaire.json');
    if (!response.ok) {
      console.log("Fichier dictionnaire.json non trouvé ou inaccessible.");
      return [];
    }
    const data = await response.json();
    console.log("Dictionnaire.json chargé avec succès:", data.length, "mots");
    return data as Word[];
  } catch (error) {
    console.error("Erreur lors du chargement de dictionnaire.json:", error);
    return [];
  }
};

export const getAllWords = async (): Promise<Word[]> => {
  // Charger d'abord le dictionnaire.json comme source principale
  const jsonWords = await loadJsonDictionary();
  
  if (jsonWords.length > 0) {
    console.log("Utilisation de dictionnaire.json comme source principale.");
<<<<<<< HEAD
    usingJsonDictionary = true;

    // Effacer le localStorage pour éviter la fusion d'anciennes données Supabase
    localStorage.removeItem(LOCAL_STORAGE_KEY);

=======
    
>>>>>>> e7e0f7f10bde8a335ce067a054916044f2f83216
    // Charger les modifications locales (ajouts/suppressions) et les fusionner
    const localChanges = loadWordsFromLocal();
    const mergedWords = new Map<string, Word>();

    // Ajouter d'abord les mots du JSON
    jsonWords.forEach(word => mergedWords.set(word.id, word));

    // Ensuite, appliquer les modifications locales (priorité au local)
    localChanges.forEach(word => mergedWords.set(word.id, word));

    return Array.from(mergedWords.values());
  } else {
    // Si dictionnaire.json n'est pas présent, charger depuis localStorage puis Supabase
    console.log("dictionnaire.json non trouvé, bascule vers localStorage puis Supabase.");
    
    let words = loadWordsFromLocal();

    if (words.length === 0) {
      try {
        console.log("LocalStorage vide, chargement depuis Supabase...");
        const { data, error } = await supabase
          .from('words')
          .select('*');

        if (error) {
          console.error('Erreur Supabase lors du chargement:', error);
          return [];
        }

        if (data) {
          // Mappage des données Supabase vers l'interface Word
          const supabaseWords: Word[] = data.map(dbWord => ({
            id: dbWord.id,
            nzebi_word: dbWord.nzebi_word,
            french_word: dbWord.french_word,
            part_of_speech: dbWord.part_of_speech,
            example_nzebi: dbWord.example_nzebi,
            example_french: dbWord.example_french,
            url_prononciation: dbWord.pronunciation_url || null,
            is_verb: null,
            forme_plurielle: null,
            synonymes: null,
            scientific_name: null,
            imperatif: null,
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
    forme_plurielle: wordData.pluralForm || null,
    synonymes: wordData.synonyms || null,
    scientific_name: wordData.scientificName || null,
    imperatif: wordData.imperative || null,
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
    forme_plurielle: wordData.pluralForm || null,
    synonymes: wordData.synonyms || null,
    scientific_name: wordData.scientificName || null,
    imperatif: wordData.imperative || null,
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
