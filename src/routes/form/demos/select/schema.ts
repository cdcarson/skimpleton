import z from 'zod';
export const COLORS = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'indigo',
  'violet'
] as const;
export const selectFormSchema = z.object({
  favoriteColor: z.enum(COLORS, { error: 'Required.' })
});
export type SelectFormData = z.infer<typeof selectFormSchema>;
