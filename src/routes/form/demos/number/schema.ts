import z from 'zod';

export const numberFormSchema = z.object({
  quantity: z.number({ error: 'Required.' }).int().min(1, { error: 'Must be at least 1.' }).max(100, { error: 'Must be 100 or less.' })
});

export type NumberFormData = z.infer<typeof numberFormSchema>;
