import z from 'zod';

export const fileFormSchema = z.object({
  file: z.file()
});
export type FileFormData = z.infer<typeof fileFormSchema>;
