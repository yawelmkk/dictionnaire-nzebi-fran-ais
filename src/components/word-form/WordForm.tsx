
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { wordFormSchema, WordFormValues } from './WordFormSchema';

interface WordFormProps {
  defaultCategory?: string;
  onSubmit: (data: WordFormValues) => Promise<void>;
  isSubmitting: boolean;
}

const WordForm = ({ defaultCategory = 'noun', onSubmit, isSubmitting }: WordFormProps) => {
  const form = useForm<WordFormValues>({
    resolver: zodResolver(wordFormSchema),
    defaultValues: {
      nzebi: '',
      french: '',
      categoryId: defaultCategory,
      exampleNzebi: '',
      exampleFrench: '',
    },
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          control={form.control}
          name="nzebi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot en Nzébi</FormLabel>
              <FormControl>
                <Input placeholder="Ex: mwana" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="french"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mot en Français</FormLabel>
              <FormControl>
                <Input placeholder="Ex: enfant" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catégorie</FormLabel>
              <FormControl>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...field}
                >
                  <option value="noun">Nom</option>
                  <option value="verb">Verbe</option>
                  <option value="adjective">Adjectif</option>
                  <option value="adverb">Adverbe</option>
                  <option value="pronoun">Pronom</option>
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="exampleNzebi"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exemple en Nzébi (optionnel)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Ex: Mwana a bakè na ndzo." 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="exampleFrench"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Exemple en Français (optionnel)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Ex: L'enfant est rentré à la maison." 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
          <Save className="mr-2" />
          {isSubmitting ? 'Enregistrement...' : 'Enregistrer le mot'}
        </Button>
      </form>
    </Form>
  );
};

export default WordForm;
