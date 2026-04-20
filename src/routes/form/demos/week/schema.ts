import z from 'zod';

export const weekFormSchema = z.object({
  week: z.string().min(1, 'Required.')
});
export type WeekFormData = z.infer<typeof weekFormSchema>;
