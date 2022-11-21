import { z, ZodError, ZodSchema } from 'zod';
import { DateTime } from 'luxon';

// TODO: find a new file for this
export type ActionResponse<FormSchema> = {
  errors?: {
    fieldErrors?: Partial<Record<keyof FormSchema, string[]>>;
    formErrors?: string[];
  };
};

type ValidationInput<T> = {
  schema: ZodSchema<T>;
  formData: FormData;
};

export async function validateAction<Schema>({ schema, formData }: ValidationInput<Schema>) {
  const body = Object.fromEntries(formData);
  try {
    const input = schema.parse(body) as Schema;
    return { formData: input, errors: null };
  } catch (e) {
    const errors = e as ZodError<Schema>;
    return {
      errors: errors.flatten(),
    };
  }
}

export const NewTransactionSchema = z.object({
  stackId: z.nullable(z.string().optional()), // TODO: make not nullable once default select value is figured out
  description: z.string().min(1, 'Required'),
  amount: z.preprocess(
    (num) => parseFloat(z.string().parse(num).replace(',', '')), // strip commas and convert to number
    z.number({ invalid_type_error: 'Expected a number' })
  ),
  date: z.preprocess((d) => DateTime.fromISO(d as string, { zone: 'UTC' }).toJSDate(), z.date()),
  type: z.enum(['withdrawal', 'deposit']),
});

export const EditTransactionSchema = NewTransactionSchema.extend({
  stackId: z.nullable(z.string()),
  id: z.string(),
});

export const DeleteStackSchema = z.object({
  stackId: z.string(),
});

export const EditStackSchema = z.object({
  stackId: z.string().min(1, 'Required'),
  label: z.string().min(1, 'Required'),
  amount: z.preprocess(
    (num) => parseFloat(z.string().parse(num).replace(',', '')), // strip commas and convert to number
    z.number({ invalid_type_error: 'Expected a number' })
  ),
  categoryId: z.string().min(1),
});
