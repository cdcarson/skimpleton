import z from 'zod';

export const successFormSchema = z.object({
  name: z.string().min(2, 'Must be at least 2 characters'),
  email: z.string().email('Must be a valid email')
});

export type SuccessFormData = z.infer<typeof successFormSchema>;
