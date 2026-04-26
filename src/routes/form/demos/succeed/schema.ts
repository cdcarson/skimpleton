import z from 'zod';

export const signInForm = z.object({
  email: z
    .string({ error: 'Required.' })
    .trim()
    .toLowerCase()
    .min(1, { error: 'Required.' })
    .pipe(z.email({ error: 'Invalid email.' }))
});
