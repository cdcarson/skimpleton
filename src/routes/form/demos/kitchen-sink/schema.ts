import z from 'zod';

export const kitchenSinkSchema = z.object({
  // StringField: text, email, textarea
  name: z.string().trim().min(1, 'Required.'),
  email: z
    .string({ error: 'Required.' })
    .trim()
    .min(1, 'Required.')
    .pipe(z.email('Invalid email.')),
  bio: z.string().trim(),
  // BooleanField: checkbox
  agreeToTerms: z.boolean(),
  // NumericField: number input
  quantity: z.number().int().min(1).max(100),
  // NumericField: range input (bigint)
  rating: z.bigint().min(1n).max(5n),
  // SingleChoiceField: radio group
  plan: z.enum(['free', 'pro', 'enterprise']),
  // MultipleChoiceField: checkbox group
  interests: z
    .array(z.enum(['coding', 'design', 'devops', 'product']))
    .min(1, 'Select at least one.'),
  // FileField: single file upload
  avatar: z.file().optional(),
  // Controls which server response path to exercise
  resultMode: z.enum(['succeed', 'redirect'])
});

export type KitchenSinkData = z.infer<typeof kitchenSinkSchema>;
