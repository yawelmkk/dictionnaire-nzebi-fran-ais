
import { supabase } from "@/integrations/supabase/client";
import { WordFormValues } from "@/components/word-form/WordFormSchema";

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
