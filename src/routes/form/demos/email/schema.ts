import z from 'zod';

export const emailFormSchema = z.object({
  email: z
    .string({ error: 'Required.' })
    .trim()
    .toLowerCase()
    .min(1, { error: 'Required.' })
    .pipe(z.email({ error: 'Invalid email.' }))
});
export type EmailFormData = z.infer<typeof emailFormSchema>;
