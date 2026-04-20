import z from 'zod';

export const dateFormSchema = z.object({
  date: z.string().min(1, 'Required.')
});
export type DateFormData = z.infer<typeof dateFormSchema>;
