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
import { addWord, editWord } from '@/services/wordsService';
import WordForm from './word-form/WordForm';
import { WordFormValues } from './word-form/WordFormSchema';
import { categories } from '@/lib/dictionaryData';

interface AddWordDialogProps {
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  defaultCategory?: string;
  initialValues?: Partial<WordFormValues>;
}

const AddWordDialog: React.FC<AddWordDialogProps> = ({ 
  trigger, 
  onSuccess, 
  defaultCategory = 'noun', 
  initialValues,
}) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: WordFormValues) => {
    setIsSubmitting(true);
    try {
      if (data.id) {
        await editWord(data);
        toast.success('Mot modifié avec succès !');
      } else {
        await addWord(data);
        toast.success('Mot ajouté avec succès !');
      }

      setOpen(false);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Erreur lors de la soumission du mot:', error);
      toast.error('Erreur lors de la soumission du mot.');
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
          <DialogTitle>{initialValues ? 'Modifier le mot' : 'Ajouter un mot'}</DialogTitle>
          <DialogDescription>
            {initialValues 
              ? 'Modifiez les informations du mot existant.' 
              : 'Complétez le formulaire pour ajouter un nouveau mot au dictionnaire.'}
          </DialogDescription>
        </DialogHeader>
        <WordForm 
          defaultCategory={defaultCategory}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          categories={categories}
          initialValues={initialValues}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddWordDialog;
