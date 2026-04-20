import z from 'zod';

export const colorFormSchema = z.object({
  color: z.string().min(1, 'Required.')
});
export type ColorFormData = z.infer<typeof colorFormSchema>;
