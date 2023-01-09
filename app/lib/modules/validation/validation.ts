import { z, ZodError, ZodSchema } from 'zod';
import { evaluate } from 'mathjs';

type FormValidationInput<T> = {
  schema: ZodSchema<T>;
  formData: FormData;
};

type FormValidationResult<T> =
  | {
      data: T;
      status: 'success';
      formErrors?: never;
    }
  | {
      status: 'error';
      formErrors: z.typeToFlattenedError<T, string>;
      data?: T;
    };

export function validateForm<Schema>({ schema, formData }: FormValidationInput<Schema>): FormValidationResult<Schema> {
  const body = Object.fromEntries(formData);
  try {
    const input = schema.parse(body);
    return { data: input, status: 'success' };
  } catch (e) {
    const errors = e as ZodError<Schema>;
    return {
      status: 'error',
      formErrors: errors.flatten(),
    };
  }
}

export const NewTransactionSchema = z.object({
  stackId: z.nullable(z.string().optional()), // TODO: make not nullable once default select value is figured out
  description: z.string().min(1, 'Required'),
  amount: validateAmount(),
  date: z.coerce.date({}),
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
