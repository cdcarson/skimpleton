import z from 'zod';

export const searchFormSchema = z.object({
  query: z.string().min(1, 'Required.')
});
export type SearchFormData = z.infer<typeof searchFormSchema>;
