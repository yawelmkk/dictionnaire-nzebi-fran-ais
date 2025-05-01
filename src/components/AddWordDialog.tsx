import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { addWord } from '@/services/wordsService';
import WordForm from './word-form/WordForm';
import { WordFormValues } from './word-form/WordFormSchema';
import { categories } from '@/lib/dictionaryData';

interface AddWordDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  defaultCategory?: string;
}

const AddWordDialog: React.FC<AddWordDialogProps> = ({ 
  trigger, 
  onSuccess, 
  defaultCategory = 'noun' 
}) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: WordFormValues) => {
    setIsSubmitting(true);
    try {
      await addWord(data);
      
      // Afficher un message de succès
      toast.success('Mot ajouté avec succès !');
      
      // Fermer la boîte de dialogue
      setOpen(false);
      
      // Rappel pour le composant parent pour actualiser les données
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting word:', error);
      toast.error('Erreur lors de l\'ajout du mot.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      ) : null}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ajouter un mot</DialogTitle>
          <DialogDescription>
            Complétez le formulaire pour ajouter un nouveau mot au dictionnaire.
          </DialogDescription>
        </DialogHeader>
        <WordForm 
          defaultCategory={defaultCategory}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          categories={categories}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddWordDialog;
