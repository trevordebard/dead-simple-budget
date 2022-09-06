import { z } from 'zod';

export const TransactionSchema = z.object({
  stackId: z.nullable(z.string().optional()), // TODO: make not nullable once default select value is figured out
  description: z.string().nonempty('Required!!'),
  amount: z.preprocess(
    (num) => parseFloat(z.string().nonempty('Required!').parse(num).replace(',', '')), // strip commas and convert to number
    z.number({ invalid_type_error: 'Must be a number' })
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
  stackId: z.string().nonempty('Required'),
  label: z.string().nonempty('Required'),
  amount: z.preprocess(
    (num) => parseFloat(z.string().nonempty('Required!').parse(num).replace(',', '')), // strip commas and convert to number
    z.number({ invalid_type_error: 'Must be a number' })
  ),
  categoryId: z.string().nonempty(),
});
