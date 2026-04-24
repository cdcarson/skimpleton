import z from 'zod';

export const textFormSchema = z.object({
  username: z.string().min(2, 'Must be at least 2 characters'),
  email: z.string().email('Must be a valid email'),
  bio: z.string().max(300, 'Must be 300 characters or fewer').optional(),
  country: z.enum(['us', 'ca', 'gb', 'au']),
  gender: z.enum(['male', 'female', 'nonbinary', 'prefer_not']),
  correlationId: z.string().default(() => crypto.randomUUID())
});

export type TextFormData = z.infer<typeof textFormSchema>;
