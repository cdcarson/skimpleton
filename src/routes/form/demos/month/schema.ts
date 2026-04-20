import z from 'zod';

export const monthFormSchema = z.object({
  month: z.string().min(1, 'Required.')
});
export type MonthFormData = z.infer<typeof monthFormSchema>;
