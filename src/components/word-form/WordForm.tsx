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
  initialValues?: Partial<WordFormValues>;
  categories: { id: string; name: string; subcategories?: { id: string; name: string }[] }[];
}

const WordForm = ({ defaultCategory = 'uncategorized', onSubmit, isSubmitting, initialValues, categories }: WordFormProps) => {
  const form = useForm<WordFormValues>({
    resolver: zodResolver(wordFormSchema),
    defaultValues: {
      nzebi: '',
      french: '',
      categoryId: defaultCategory,
      exampleNzebi: '',
      exampleFrench: '',
      synonyms: '',
      pluralForm: '',
      ...initialValues,
    },
  });

  React.useEffect(() => {
    if (initialValues) {
      form.reset({
        nzebi: initialValues.nzebi || '',
        french: initialValues.french || '',
        categoryId: initialValues.categoryId || defaultCategory,
        exampleNzebi: initialValues.exampleNzebi || '',
        exampleFrench: initialValues.exampleFrench || '',
        synonyms: initialValues.synonyms || '',
        pluralForm: initialValues.pluralForm || '',
      });
    } else {
      form.reset({
        nzebi: '',
        french: '',
        categoryId: defaultCategory,
        exampleNzebi: '',
        exampleFrench: '',
        synonyms: '',
        pluralForm: '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues, defaultCategory]);

  const handleSubmit = async (data: WordFormValues) => {
    await onSubmit(data);
    // Reset form after successful submission
    form.reset({
      nzebi: '',
      french: '',
      categoryId: defaultCategory,
      exampleNzebi: '',
      exampleFrench: '',
      synonyms: '',
      pluralForm: '',
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
                  {categories.map((category) => (
                    <React.Fragment key={category.id}>
                      <option value={category.id} className="font-semibold">
                        {category.name}
                      </option>
                      {category.subcategories?.map((subcat) => (
                        <option key={subcat.id} value={subcat.id} className="pl-4">
                          {subcat.name}
                        </option>
                      ))}
                    </React.Fragment>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Nouveau champ pour la forme plurielle */}
        <FormField
          control={form.control}
          name="pluralForm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Forme plurielle (optionnel)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: bana (pour 'mwana')" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Nouveau champ pour les synonymes */}
        <FormField
          control={form.control}
          name="synonyms"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Synonymes (optionnel)</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ex: mwana munto, mwana ndomi (séparés par des virgules)" 
                  {...field} 
                />
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

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Save className="mr-2 h-4 w-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Enregistrer le mot
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default WordForm;
