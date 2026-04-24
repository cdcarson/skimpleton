import z from 'zod';

export const numericMultipleChoiceFormSchema = z.object({
  ratings: z.array(z.number().int().min(1).max(5)).default([]),
  priorities: z.array(z.number().int()).default([]),
  selectedIds: z.array(z.bigint()).default([])
});

export type NumericMultipleChoiceFormData = z.infer<
  typeof numericMultipleChoiceFormSchema
>;
