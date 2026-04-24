import z from 'zod';

export const fileFormSchema = z.object({
  avatar: z.file({ error: 'Required.' }),
  attachments: z.array(z.file()).default([])
});

export type FileFormData = z.infer<typeof fileFormSchema>;
