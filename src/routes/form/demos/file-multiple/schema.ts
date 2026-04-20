import z from 'zod';

export const fileMultipleFormSchema = z.object({
  files: z.array(z.file())
});
export type FileMultipleFormData = z.infer<typeof fileMultipleFormSchema>;
