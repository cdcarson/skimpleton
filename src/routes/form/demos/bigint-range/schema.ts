import z from 'zod';

// Range sits just above Number.MAX_SAFE_INTEGER (9007199254740991)
const MIN = 9007199254740992n;
const MAX = 9007199254741092n; // MIN + 100

export const bigintRangeFormSchema = z.object({
  level: z.bigint({ error: 'Required.' }).min(MIN).max(MAX)
});

export type BigintRangeFormData = z.infer<typeof bigintRangeFormSchema>;
