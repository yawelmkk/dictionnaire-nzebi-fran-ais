
import React from 'react';
import Layout from '@/components/Layout';
import WordForm from '@/components/word-form/WordForm';
import { toast } from 'sonner';
import { addWord } from '@/services/wordsService';
import { WordFormValues } from '@/components/word-form/WordFormSchema';
import { useNavigate } from 'react-router-dom';

const Ajouter = () => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (data: WordFormValues) => {
    setIsSubmitting(true);
    try {
      await addWord(data);
      toast.success('Mot ajouté avec succès!');
      navigate('/');
    } catch (error) {
      console.error('Error adding word:', error);
      toast.error('Erreur lors de l\'ajout du mot');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Ajouter un mot</h1>
        <WordForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </div>
    </Layout>
  );
};

export default Ajouter;
