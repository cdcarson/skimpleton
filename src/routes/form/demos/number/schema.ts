import z from 'zod';

export const numberFormSchema = z.object({
  count: z.number({ error: 'Required.' }).int('Must be a whole number.')
});
export type NumberFormData = z.infer<typeof numberFormSchema>;
