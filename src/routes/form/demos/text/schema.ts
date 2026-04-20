import z from 'zod';

export const textFormSchema = z.object({
  text: z.string().min(1, 'Required.')
});
export type TextFormData = z.infer<typeof textFormSchema>;
