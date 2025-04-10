
import { z } from 'zod';

// Schema for form validation
export const wordFormSchema = z.object({
  nzebi: z.string().min(1, { message: "Le mot en Nzébi est requis" }),
  french: z.string().min(1, { message: "Le mot en Français est requis" }),
  categoryId: z.string().min(1, { message: "La catégorie est requise" }),
  exampleNzebi: z.string().optional(),
  exampleFrench: z.string().optional(),
});

export type WordFormValues = z.infer<typeof wordFormSchema>;
