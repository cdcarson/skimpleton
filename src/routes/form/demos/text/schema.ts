import z from 'zod';

export const textFormSchema = z.object({
  name: z.string({ error: 'Required.' }).trim().min(1, { error: 'Required.' }),
  email: z
    .string({ error: 'Required.' })
    .trim()
    .min(1, { message: 'Required.' })
    .pipe(z.email({ message: 'Invalid email.' })),
  bio: z.string().trim()
});
export type TextFormData = z.infer<typeof textFormSchema>;
