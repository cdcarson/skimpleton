import z from 'zod';

export const booleanFormSchema = z.object({
  thinkTheEarthIsFlat: z.boolean(),
  agreeToTerms: z.boolean()
});
export type BooleanFormData = z.infer<typeof booleanFormSchema>