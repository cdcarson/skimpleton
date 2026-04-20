import z from 'zod';

export const textareaFormSchema = z.object({
  message: z.string().min(1, 'Required.')
});
export type TextareaFormData = z.infer<typeof textareaFormSchema>;
