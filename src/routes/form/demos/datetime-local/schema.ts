import z from 'zod';

export const datetimeLocalFormSchema = z.object({
  datetime: z.string().min(1, 'Required.')
});
export type DatetimeLocalFormData = z.infer<typeof datetimeLocalFormSchema>;
