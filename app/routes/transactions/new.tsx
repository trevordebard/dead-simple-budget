import { ActionFunction, Form, json, Link, LoaderFunction, useActionData, useLoaderData } from 'remix';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useState } from 'react';
import { z, ZodError } from 'zod';
import { db } from '~/utils/db.server';
import { createTransactionAndUpdBudget } from '~/utils/server/index.server';
import { Button } from '~/components/button';
import { Stack, Budget, Transaction } from '.prisma/client';
import { dollarsToCents } from '~/utils/money-fns';
import { requireAuthenticatedUser } from '~/utils/server/user-utils.server';
import { ErrorText } from '~/components/error-text';

type ActionData = {
  success: boolean;
  formErrors?: string[];
  fieldErrors?: {
    [k: string]: string[];
  };
  data?: Transaction;
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

const CreateTransactionSchema = z.object({
  stackId: z.nullable(z.string().optional()), // TODO: make not nullable once default select value is figured out
  description: z.string().nonempty('Required!!'),
  amount: z.preprocess(
    (num) => parseFloat(z.string().nonempty('Required!').parse(num).replace(',', '')), // strip commas and convert to number
    z.number({ invalid_type_error: 'Must be a number' })
  ),
  type: z.enum(['withdrawal', 'deposit']),
});

export const action: ActionFunction = async ({ request }) => {
  const user = await requireAuthenticatedUser(request);
  let budget: Budget | null;
  try {
    budget = await db.budget.findFirst({ where: { userId: user.id } });
  } catch (e) {
    return badRequest({ success: false, formErrors: ['Unable to find budget for user'] });
  }
  if (!budget) {
    return badRequest({ success: false, formErrors: ['Unable to find budget for user'] });
  }

  const formData = await request.formData();

  try {
    const { description, amount, stackId, type } = CreateTransactionSchema.parse({
      stackId: formData.get('stackId'),
      description: formData.get('description'),
      amount: formData.get('amount'),
      type: formData.get('trans-type'),
    });

    let amountInCents = dollarsToCents(amount);

    if (type === 'withdrawal') {
      amountInCents *= -1;
    }

    const newTransactionInput = {
      description,
      amount: amountInCents,
      stackId,
      budgetId: budget.id,
      date: new Date(),
      type,
    };
    const transaction = await createTransactionAndUpdBudget(newTransactionInput, budget.id);
    return { success: true, data: transaction };
  } catch (e) {
    console.error(e);
    if (e instanceof ZodError) {
      return badRequest({ success: false, ...e.flatten() });
    }
    return badRequest({ success: false, formErrors: ['An unknown error occurred'] });
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireAuthenticatedUser(request);
  const budget = await db.budget.findFirst({ where: { userId: user.id }, include: { stacks: true } });
  const stacks = budget?.stacks;
  return stacks;
};

export default function NewTransaction() {
  const [transactionType, setTransactionType] = useState<string>('deposit');
  const stacks = useLoaderData<Stack[] | null>();
  const actionData = useActionData<ActionData>();

  // TODO: on success action data, reset the form
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 md:relative bg-white p-5 md:p-0">
      <h3 className="text-lg mb-3 divide-y-2 text-center">New Transaction</h3>
      <Form method="post" className="space-y-4">
        {actionData?.formErrors?.map((message) => (
          <ErrorText>{message}</ErrorText>
        ))}
        <div>
          <label htmlFor="description">
            Description{' '}
            {actionData?.fieldErrors?.description && <ErrorText>{actionData.fieldErrors.description[0]}</ErrorText>}
          </label>
          <input required type="text" name="description" id="description-input" />
        </div>
        <div>
          <label htmlFor="amount">
            Amount {actionData?.fieldErrors?.amount && <ErrorText>{actionData.fieldErrors.amount[0]}</ErrorText>}
          </label>
          <input required type="text" name="amount" id="amount-input" />
        </div>
        <div>
          <label htmlFor="stackId">
            Stack {actionData?.fieldErrors?.stackId && <ErrorText>{actionData.fieldErrors.stackId[0]}</ErrorText>}
          </label>
          <select name="stackId" id="stackId" className="w-full">
            <option selected disabled>
              Choose a Stack
            </option>
            {stacks?.map((stack) => (
              <option value={stack.id} key={stack.id}>
                {stack.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          {actionData?.fieldErrors?.type && <ErrorText>{actionData.fieldErrors?.type[0]}</ErrorText>}
          <input type="hidden" name="trans-type" id="trans-type" value={transactionType} />
          <ToggleGroup.Root
            type="single"
            defaultValue="deposit"
            className="inline-flex rounded-md w-full"
            onValueChange={(val) => setTransactionType(val)}
          >
            <ToggleGroup.Item
              value="deposit"
              className="flex items-center justify-center w-full h-9 border-gray-300 border hover:bg-gray-100 first:rounded-l-md last:rounded-r-md radix-state-on:border-transparent radix-state-on:bg-purple-900 radix-state-on:text-purple-50"
            >
              Deposit
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="withdrawal"
              className="flex items-center justify-center w-full h-9 border-gray-300 border hover:bg-gray-100 first:rounded-l-md last:rounded-r-md radix-state-on:border-transparent radix-state-on:bg-purple-900 radix-state-on:text-purple-50"
            >
              Withdrawal
            </ToggleGroup.Item>
          </ToggleGroup.Root>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <Button type="submit" variant="outline" className="w-full">
            Add Transaction
          </Button>
          <Link to="/transactions" className="hover:text-purple-700">
            Cancel
          </Link>
        </div>
      </Form>
    </div>
  );
}
