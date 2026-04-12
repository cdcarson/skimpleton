import z from 'zod';

export const numberRangeFormSchema = z.object({
  rating: z.number({ error: 'Required.' }).int().min(1).max(10)
});

export type NumberRangeFormData = z.infer<typeof numberRangeFormSchema>;
