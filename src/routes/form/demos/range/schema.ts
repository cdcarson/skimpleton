import z from 'zod';

export const rangeFormSchema = z.object({
  value: z.number({ error: 'Required.' }).min(0).max(100)
});
export type RangeFormData = z.infer<typeof rangeFormSchema>;
