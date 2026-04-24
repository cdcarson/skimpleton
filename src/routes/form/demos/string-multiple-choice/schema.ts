import z from 'zod';

export const stringMultipleChoiceFormSchema = z.object({
  favoriteColors: z.array(z.enum(['red', 'green', 'blue', 'yellow'])),
  categories: z.array(z.enum(['news', 'sports', 'tech', 'arts'])).default([])
});

export type StringMultipleChoiceFormData = z.infer<
  typeof stringMultipleChoiceFormSchema
>;
