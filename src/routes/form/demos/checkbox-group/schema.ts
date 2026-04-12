import z from 'zod';

export const INTERESTS = ['design', 'engineering', 'product', 'marketing', 'data'] as const;
export const NOTIFICATIONS = ['email', 'sms', 'push'] as const;

export const checkboxGroupFormSchema = z.object({
  interests: z
    .array(z.enum(INTERESTS), { error: 'Required.' })
    .min(1, { error: 'Select at least one interest.' }),
  notifications: z.array(z.enum(NOTIFICATIONS))
});

export type CheckboxGroupFormData = z.infer<typeof checkboxGroupFormSchema>;
