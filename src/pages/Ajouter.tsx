import React from 'react';
import Layout from '@/components/Layout';
import WordForm from '@/components/word-form/WordForm';
import { toast } from 'sonner';
import { addWord } from '@/services/wordsService';
import { WordFormValues } from '@/components/word-form/WordFormSchema';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { categories } from '@/lib/dictionaryData';

const Ajouter = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: WordFormValues) => {
    setIsSubmitting(true);
    try {
      const result = await addWord(data);
      console.log('Résultat Supabase:', result);
      if (result && result.length > 0) {
        toast.success('Mot ajouté avec succès!');
      } else {
        toast.error("Erreur : le mot n'a pas été ajouté (aucune donnée retournée)");
      }
      setIsSubmitting(false);
    } catch (error: any) {
      console.error('Erreur détaillée lors de l\'ajout du mot:', error);
      toast.error(`Erreur Supabase : ${error.message || error}`);
      setIsSubmitting(false);
    }
  };
  
  const handleBack = () => {
    navigate('/');
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <Button 
          onClick={handleBack} 
          variant="outline" 
          className="mb-4 flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour au menu principal
        </Button>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">Ajouter un mot</h1>
          <WordForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
            categories={categories}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Ajouter;

