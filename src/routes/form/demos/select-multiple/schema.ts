import z from 'zod';
export const PLANETS = [
  'Mercury',
  'Venus',
  'Earth',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
  'Pluto'
] as const;
export const selectMultipleFormSchema = z.object({
  planetsVisited: z.array(z.enum(PLANETS, { error: 'Required.' }))
});
export type SelectMultipleFormFormData = z.infer<typeof selectMultipleFormSchema>;
