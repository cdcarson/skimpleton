import z from 'zod';

export const passwordFormSchema = z.object({
  password: z.string().min(8, 'At least 8 characters required.')
});
export type PasswordFormData = z.infer<typeof passwordFormSchema>;
