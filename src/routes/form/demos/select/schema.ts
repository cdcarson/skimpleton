import z from 'zod';
import { US_STATES } from '$demo/data/states.js';
export const schema = z.object({
  state: z.enum(US_STATES, {error: 'Required.'})
});
export type Shape = z.infer<typeof schema>;