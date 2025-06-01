import { supabase } from "@/integrations/supabase/client";
import { WordFormValues } from "@/components/word-form/WordFormSchema";
import { categories } from "@/lib/dictionaryData";

export const addWord = async (wordData: WordFormValues) => {
  try {
    const { data, error } = await supabase
      .from('words')
      .insert({
        nzebi_word: wordData.nzebi,
        french_word: wordData.french,
        part_of_speech: wordData.categoryId,
        example_nzebi: wordData.exampleNzebi || null,
        example_french: wordData.exampleFrench || null,
        plural_form: wordData.pluralForm || null,
        synonyms: wordData.synonyms || null,
        // Ne pas inclure created_by puisque nous l'avons rendu nullable
      })
      .select();

    if (error) {
      console.error('Erreur Supabase:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error adding word:', error);
    throw error;
  }
};

export const getAllWords = async () => {
  try {
    const { data, error } = await supabase
      .from('words')
      .select('*');

    if (error) {
      console.error('Erreur Supabase:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching all words:', error);
    throw error;
  }
};

export const getWordsByCategory = async (categoryId: string) => {
  try {
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .eq('part_of_speech', categoryId);

    if (error) {
      console.error('Erreur Supabase:', error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching words by category:', error);
    throw error;
  }
};

export const deleteWord = async (id: string) => {
  try {
    const { error } = await supabase
      .from('words')
      .delete()
      .eq('id', id);
    if (error) {
      console.error('Erreur Supabase:', error);
      throw error;
    }
    return true;
  } catch (error) {
    console.error('Error deleting word:', error);
    throw error;
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
