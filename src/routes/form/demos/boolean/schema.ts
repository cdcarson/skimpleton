import z from 'zod';

export const booleanFormSchema = z.object({
  iLikeCats: z.boolean()
});
export type BooleanFormFormData = z.infer<typeof booleanFormSchema>;
