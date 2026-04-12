import z from 'zod';

// Exceeds Number.MAX_SAFE_INTEGER (9007199254740991)
export const bigintFormSchema = z.object({
  amount: z
    .bigint({ error: 'Required.' })
});

export type BigintFormData = z.infer<typeof bigintFormSchema>;
