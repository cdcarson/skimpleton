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
export const radiosFormSchema = z.object({
  whatPlanetFrom: z.enum(PLANETS, { error: 'Required.' })
});
export type RadiosFormData = z.infer<typeof radiosFormSchema>;
