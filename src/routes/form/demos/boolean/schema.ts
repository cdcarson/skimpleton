import z from 'zod';

export const booleanFormSchema = z.object({
  iLikeCats: z.boolean(),
  iAgreeToTheOnerousTerms: z.boolean().refine(val => val, {error: 'You must agree to the onerous terms.'})
});
export type BooleanFormFormData = z.infer<typeof booleanFormSchema>;
