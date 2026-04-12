import z from 'zod';

export const PLAN = ['free', 'pro', 'enterprise'] as const;
export const CONTACT_PREFERENCE = ['email', 'phone', 'none'] as const;

export const radioGroupFormSchema = z.object({
  plan: z.enum(PLAN, { error: 'Required.' }),
  contactPreference: z.enum(CONTACT_PREFERENCE, { error: 'Required.' })
});

export type RadioGroupFormData = z.infer<typeof radioGroupFormSchema>;
