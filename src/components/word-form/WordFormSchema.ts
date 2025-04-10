
import { z } from 'zod';

// Schema for form validation
export const wordFormSchema = z.object({
  nzebi: z.string().min(1, { message: "Le mot en Nzébi est requis" }),
  french: z.string().min(1, { message: "Le mot en Français est requis" }),
  categoryId: z.string().min(1, { message: "La catégorie est requise" }),
  exampleNzebi: z.string().min(1, { message: "L'exemple en Nzébi est requis" }),
  exampleFrench: z.string().min(1, { message: "L'exemple en Français est requis" }),
});

export type WordFormValues = z.infer<typeof wordFormSchema>;
