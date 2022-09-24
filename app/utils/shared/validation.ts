import { z, ZodError, Schema } from 'zod';

// TODO: find a new file for this
export type ActionResponse<FormSchema> = {
  errors?: {
    fieldErrors?: Partial<Record<keyof FormSchema, string[]>>;
    formErrors?: string[];
  };
};

type ValidationInput = {
  schema: Schema;
  formData: FormData;
};

export async function validateAction<ActionInput>({ schema, formData }: ValidationInput) {
  const body = Object.fromEntries(formData);
  try {
    const input = schema.parse(body) as ActionInput;
    return { formData: input, errors: null };
  } catch (e) {
    const errors = e as ZodError<ActionInput>;
    console.log('--------');
    console.log(e);
    console.log('--------');
    return {
      errors: errors.flatten(),
    };
  }
}

export const TransactionSchema = z.object({
  stackId: z.nullable(z.string().optional()), // TODO: make not nullable once default select value is figured out
  description: z.string().nonempty('Required'),
  amount: z.preprocess(
    (num) => parseFloat(z.string().parse(num).replace(',', '')), // strip commas and convert to number
    z.number({ invalid_type_error: 'Expected a number' }).min(1, 'Required')
  ),
  type: z.enum(['withdrawal', 'deposit']),
});

export const EditTransactionSchema = TransactionSchema.extend({
  stackId: z.nullable(z.string()),
  id: z.string(),
});

export const DeleteStackSchema = z.object({
  stackId: z.string(),
});

export const SaveStackSchema = z.object({
  stackId: z.string().min(1, 'Required'),
  label: z.string().min(1, 'Required'),
  amount: z.preprocess(
    (num) => parseFloat(z.string().parse(num).replace(',', '')), // strip commas and convert to number
    z.number({ invalid_type_error: 'Expected a number' }).min(1, 'Required')
  ),
  categoryId: z.string().min(1),
});
