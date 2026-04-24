import z from 'zod';

export const numericFormSchema = z.object({
  age: z.number().int().min(0).max(120),
  rating: z.number().min(0).max(10).default(5),
  accountId: z.bigint().default(0n),
  version: z.number().int().default(1)
});

export type NumericFormData = z.infer<typeof numericFormSchema>;
