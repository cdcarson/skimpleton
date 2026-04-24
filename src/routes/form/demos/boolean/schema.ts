import z from 'zod';

export const booleanFormSchema = z.object({
  iLikeCats: z.boolean(),
  iOwnACat: z.boolean(),
  iAgreeToTheOnerousTerms: z
    .boolean()
    .refine((val) => val, { error: 'You must agree to the onerous terms.' }),
  demoHiddenBoolean: z.boolean()
});
export type BooleanFormFormData = z.infer<typeof booleanFormSchema>;
