import z from 'zod';

export const urlFormSchema = z.object({
  website: z
    .string({ error: 'Required.' })
    .trim()
    .min(1, { error: 'Required.' })
    .pipe(z.url({ error: 'Invalid URL.' }))
});
export type UrlFormData = z.infer<typeof urlFormSchema>;
