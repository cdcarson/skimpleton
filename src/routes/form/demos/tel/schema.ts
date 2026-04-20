import z from 'zod';

export const telFormSchema = z.object({
  phone: z.string().min(1, 'Required.')
});
export type TelFormData = z.infer<typeof telFormSchema>;
