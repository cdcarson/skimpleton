import z from 'zod';

export const timeFormSchema = z.object({
  time: z.string().min(1, 'Required.')
});
export type TimeFormData = z.infer<typeof timeFormSchema>;
