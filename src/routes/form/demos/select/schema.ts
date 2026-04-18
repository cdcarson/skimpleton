import z from 'zod';
import { US_STATES } from '$demo/data/states.js';
export const selectFormSchema = z.object({
  state: z.enum(US_STATES, { error: 'Required.' })
});
export type SelectFormData = z.infer<typeof selectFormSchema>;

export const deleteSavedFormSchema = z.object({});
