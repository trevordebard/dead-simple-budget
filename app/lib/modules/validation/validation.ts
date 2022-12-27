import { z, ZodError, ZodSchema } from 'zod';
import { DateTime } from 'luxon';
import { evaluate } from 'mathjs';

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

export function validateAction<Schema>({ schema, formData }: ValidationInput<Schema>) {
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
  amount: validateAmount(),
  date: z
    .string()
    .regex(/\d{4}-\d{2}-\d{2}/, 'Use date format yyyy-mm-dd')
    .transform((d) => DateTime.fromFormat(d, 'yyyy-MM-dd').toJSDate()),
  type: z.enum(['withdrawal', 'deposit']),
});

// z.preprocess((d) => DateTime.fromISO(d as string, { zone: 'UTC' }).toJSDate(), z.date()),
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
  amount: validateAmount(),
  categoryId: z.string().min(1),
});

function validateAmount() {
  return z.string().transform((val) => {
    try {
      // calculates any math expressions
      return evaluate(val.replace(',', ''));
    } catch (e) {
      console.error(e);
      throw new ZodError([
        {
          message: 'Only use numbers or math expressions',
          code: 'custom',
          path: ['amount'],
        },
      ]);
    }
  });
}
