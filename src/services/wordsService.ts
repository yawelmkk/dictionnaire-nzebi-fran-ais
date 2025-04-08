
import { supabase } from "@/integrations/supabase/client";

export interface WordFormValues {
  nzebi: string;
  french: string;
  categoryId: string;
  exampleNzebi: string;
  exampleFrench: string;
}

export const addWord = async (wordData: WordFormValues) => {
  try {
    const { data, error } = await supabase
      .from('words')
      .insert({
        nzebi_word: wordData.nzebi,
        french_word: wordData.french,
        part_of_speech: wordData.categoryId,
        example_nzebi: wordData.exampleNzebi,
        example_french: wordData.exampleFrench,
      })
      .select();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error adding word:', error);
    throw error;
  }
};

export const getWordsByCategory = async (category: string) => {
  try {
    const { data, error } = await supabase
      .from('words')
      .select('*')
      .eq('part_of_speech', category);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching words by category:', error);
    throw error;
  }
};

export const getAllWords = async () => {
  try {
    const { data, error } = await supabase
      .from('words')
      .select('*');

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching all words:', error);
    throw error;
  }
};
