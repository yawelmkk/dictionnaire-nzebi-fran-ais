
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { dictionaryEntries } from '@/lib/dictionaryData';

// Schema for form validation
const formSchema = z.object({
  nzebi: z.string().min(1, { message: "Le mot en Nzébi est requis" }),
  french: z.string().min(1, { message: "Le mot en Français est requis" }),
  categoryId: z.string().min(1, { message: "La catégorie est requise" }),
  exampleNzebi: z.string().min(1, { message: "L'exemple en Nzébi est requis" }),
  exampleFrench: z.string().min(1, { message: "L'exemple en Français est requis" }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddWordDialogProps {
  trigger?: React.ReactNode;
}

const AddWordDialog: React.FC<AddWordDialogProps> = ({ trigger }) => {
  const [open, setOpen] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nzebi: '',
      french: '',
      categoryId: 'noun', // Default category
      exampleNzebi: '',
      exampleFrench: '',
    },
  });

  const onSubmit = (data: FormValues) => {
    // Generate a new unique ID (simple implementation)
    const newId = (dictionaryEntries.length + 1).toString();
    
    // Create a new dictionary entry
    const newEntry = {
      id: newId,
      nzebi: data.nzebi,
      french: data.french,
      categoryId: data.categoryId,
      example: {
        nzebi: data.exampleNzebi,
        french: data.exampleFrench,
      }
    };
    
    // Add the new entry to the dictionary
    dictionaryEntries.push(newEntry);
    
    // Show success message
    toast.success('Mot ajouté avec succès !');
    
    // Log the updated dictionary (for debugging)
    console.log('Dictionary updated:', dictionaryEntries);
    
    // Close the dialog and reset the form
    setOpen(false);
    form.reset();
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <FormLabel>Exemple en Nzébi</FormLabel>
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
                  <FormLabel>Exemple en Français</FormLabel>
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
            <DialogFooter className="pt-4">
              <Button type="submit">Ajouter</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddWordDialog;
