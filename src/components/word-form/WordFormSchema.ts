import { z } from 'zod';

// Schema for form validation
export const wordFormSchema = z.object({
  id: z.string().optional(),
  nzebi: z.string().min(1, { message: "Le mot en Nzébi est requis" }),
  french: z.string().min(1, { message: "Le mot en Français est requis" }),
  categoryId: z.string().min(1, { message: "La catégorie est requise" }),
  exampleNzebi: z.string().optional(),
  exampleFrench: z.string().optional(),
  synonyms: z.string().optional(),
  pluralForm: z.string().optional(),
  scientificName: z.string().optional(),
  imperative: z.string().optional(),
  urlPrononciation: z.string().optional(),
  estVerbe: z.boolean().optional(),
});

export type WordFormValues = z.infer<typeof wordFormSchema>;
