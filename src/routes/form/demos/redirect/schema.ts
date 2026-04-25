import z from 'zod';

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'Required.'),
  email: z
    .string({ error: 'Required.' })
    .trim()
    .toLowerCase()
    .min(1, { error: 'Required.' })
    .pipe(z.email({ error: 'Invalid email.' }))
});
export const contactRecordSchema = contactFormSchema.extend({
  id: z.uuid()
});
export type ContactRecord = z.infer<typeof contactRecordSchema>;
export const contactRecordsSchema = z.array(contactRecordSchema);
export type ContactRecords = z.infer<typeof contactRecordsSchema>;

export const emptySchema = z.object({});
