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
    const response = await fetch(`${import.meta.env.BASE_URL}dictionnaire.json`);
    if (!response.ok) {
      // Si le fichier n'existe pas ou n'est pas accessible, ne pas lever d'erreur
      // mais retourner un tableau vide, indiquant qu'il n'est pas la source active.
      console.log("Fichier dictionnaire.json non trouvé ou inaccessible, bascule vers Supabase.");
      return [];
    }
    const data = await response.json();
    // Valider que les données JSON correspondent à l'interface Word
    // Pour cet exemple, nous allons simplement les caster, mais une validation plus robuste serait préférable.
    return data as Word[];
  } catch (error) {
    console.error("Erreur lors du chargement de dictionnaire.json:", error);
    return [];
  }
};

// Variable pour savoir si nous utilisons le dictionnaire.json ou Supabase
let usingJsonDictionary = false;

export const getAllWords = async (): Promise<Word[]> => {
  // Tentative de charger le dictionnaire.json
  const jsonWords = await loadJsonDictionary();

  if (jsonWords.length > 0) {
    // Si dictionnaire.json est trouvé et contient des données, nous l'utilisons comme base
    console.log("Utilisation de dictionnaire.json comme source principale.");
    usingJsonDictionary = true;

    // Effacer le localStorage pour éviter la fusion d'anciennes données Supabase
    localStorage.removeItem(LOCAL_STORAGE_KEY);

    // Charger les modifications locales (ajouts/suppressions) et les fusionner
    const localChanges = loadWordsFromLocal();
    const mergedWords = new Map<string, Word>();

    // Ajouter d'abord les mots du JSON
    jsonWords.forEach(word => mergedWords.set(word.id, word));

    // Ensuite, appliquer les modifications locales (priorité au local)
    localChanges.forEach(word => mergedWords.set(word.id, word));

    // Filtrer les mots marqués comme supprimés localement (si nous implémentons la suppression locale)
    // Pour l'instant, on suppose que localChanges contient des mots ajoutés ou modifiés

    return Array.from(mergedWords.values());
  } else {
    // Si dictionnaire.json n'est pas présent ou est vide, basculer sur Supabase
    console.log("dictionnaire.json non trouvé ou vide, bascule vers Supabase.");
    usingJsonDictionary = false;

    // Charger depuis localStorage en premier (si des mots Supabase ont été mis en cache)
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
          saveWordsToLocal(supabaseWords); // Mise en cache des mots de Supabase dans localStorage
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
    id: Date.now().toString(), // Générer un ID unique pour le local
    nzebi_word: wordData.nzebi,
    french_word: wordData.french,
    part_of_speech: wordData.categoryId, // Mappage de categoryId à part_of_speech
    example_nzebi: wordData.exampleNzebi || null,
    example_french: wordData.exampleFrench || null,
    url_prononciation: wordData.urlPrononciation || null,
    is_verb: wordData.estVerbe || null,
    forme_plurielle: wordData.pluralForm || null,
    synonymes: wordData.synonyms || null,
    scientific_name: wordData.scientificName || null,
    imperatif: wordData.imperative || null,
  };

  if (usingJsonDictionary) {
    // Si le dictionnaire.json est la source, ajouter seulement au localStorage
    const currentWords = loadWordsFromLocal();
    const updatedWords = [...currentWords, newWord];
    saveWordsToLocal(updatedWords);
    console.log("Mot ajouté localement (dictionnaire.json actif).");
    return newWord;
  } else {
    // Sinon, ajouter à Supabase
    try {
      const { data, error } = await supabase
        .from('words')
        .insert({
          nzebi_word: newWord.nzebi_word,
          french_word: newWord.french_word,
          part_of_speech: newWord.part_of_speech,
          example_nzebi: newWord.example_nzebi,
          example_french: newWord.example_french,
          pronunciation_url: newWord.url_prononciation,
          is_verb: newWord.is_verb,
          plural_form: newWord.forme_plurielle,
          synonyms: newWord.synonymes,
          scientific_name: newWord.scientific_name,
          imperative: newWord.imperatif,
        })
        .select();

      if (error) {
        console.error('Erreur Supabase lors de l\'ajout:', error);
        throw error;
      }
      console.log("Mot ajouté à Supabase.", data);
      // Optionnel: Mettre à jour le localStorage après l'ajout Supabase pour cohérence
      const currentWords = loadWordsFromLocal();
      saveWordsToLocal([...currentWords, newWord]);
      return newWord;
    } catch (error) {
      console.error('Error adding word to Supabase:', error);
      throw error;
    }
  }
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

  if (usingJsonDictionary) {
    // Si le dictionnaire.json est la source, modifier seulement dans localStorage
    const currentWords = loadWordsFromLocal();
    const updatedWordsList = currentWords.map(word => 
      word.id === updatedWord.id ? updatedWord : word
    );
    saveWordsToLocal(updatedWordsList);
    console.log("Mot modifié localement (dictionnaire.json actif).");
    return updatedWord;
  } else {
    // Sinon, modifier dans Supabase
    try {
      const { data, error } = await supabase
        .from('words')
        .update({
          nzebi_word: updatedWord.nzebi_word,
          french_word: updatedWord.french_word,
          part_of_speech: updatedWord.part_of_speech,
          example_nzebi: updatedWord.example_nzebi,
          example_french: updatedWord.example_french,
          pronunciation_url: updatedWord.url_prononciation,
          is_verb: updatedWord.is_verb,
          plural_form: updatedWord.forme_plurielle,
          synonyms: updatedWord.synonymes,
          scientific_name: updatedWord.scientific_name,
          imperative: updatedWord.imperatif,
        })
        .eq('id', updatedWord.id)
        .select();

      if (error) {
        console.error('Erreur Supabase lors de la modification:', error);
        throw error;
      }
      console.log("Mot modifié dans Supabase.", data);
      // Mettre à jour le localStorage après la modification Supabase pour cohérence
      const currentWords = loadWordsFromLocal();
      const updatedWordsList = currentWords.map(word => 
        word.id === updatedWord.id ? updatedWord : word
      );
      saveWordsToLocal(updatedWordsList);
      return updatedWord;
    } catch (error) {
      console.error('Error editing word in Supabase:', error);
      throw error;
    }
  }
};

export const getWordsByCategory = async (categoryId: string) => {
  const allWords = await getAllWords(); // Utiliser la logique de getAllWords pour la source
  return allWords.filter(word => word.part_of_speech === categoryId);
};

export const deleteWord = async (id: string) => {
  if (usingJsonDictionary) {
    // Si le dictionnaire.json est la source, supprimer seulement du localStorage
    let currentWords = loadWordsFromLocal();
    const updatedWords = currentWords.filter(word => word.id !== id);
    saveWordsToLocal(updatedWords);
    console.log("Mot supprimé localement (dictionnaire.json actif).");
    return true;
  } else {
    // Sinon, supprimer de Supabase
    try {
      const { error } = await supabase
        .from('words')
        .delete()
        .eq('id', id);
      if (error) {
        console.error('Erreur Supabase lors de la suppression:', error);
        throw error;
      }
      console.log("Mot supprimé de Supabase.");
      // Optionnel: Mettre à jour le localStorage après la suppression Supabase pour cohérence
      let currentWords = loadWordsFromLocal();
      const updatedWords = currentWords.filter(word => word.id !== id);
      saveWordsToLocal(updatedWords);
      return true;
    } catch (error) {
      console.error('Error deleting word from Supabase:', error);
      throw error;
    }
  }
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

  return categoryId; // Retourne l'ID si la catégorie n'est pas trouvée
};
