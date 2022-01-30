import { ActionFunction, Form, Link, LoaderFunction, redirect, useLoaderData } from 'remix';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useState } from 'react';
import { db } from '~/utils/db.server';
import { createTransactionAndUpdBudget, requireAuthenticatedUser } from '~/utils/server/index.server';
import { Button } from '~/components/button';
import { Stack } from '.prisma/client';
import { dollarsToCents } from '~/utils/money-fns';

// TODO: error handling
export const action: ActionFunction = async ({ request }) => {
  const user = await requireAuthenticatedUser(request);
  const budget = await db.budget.findFirst({ where: { userId: user.id } });

  const formData = await request.formData();

  const description = String(formData.get('description'));
  const amountInput = String(formData.get('amount'));

  // StackId is allowed to be null when creating a transaction. Automatically casting to a number would set the value to 0
  const stackId = formData.get('stack') ? Number(formData.get('stack')) : null;
  const type = String(formData.get('trans-type'));

  if (!amountInput || !description || !type || !budget) {
    throw Error('TODO');
  }

  let amountInCents = dollarsToCents(amountInput);

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

  await createTransactionAndUpdBudget(newTransactionInput, budget.id);

  return redirect('/transactions');
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

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 md:relative bg-white p-5 md:p-0">
      <h3 className="text-lg mb-3 divide-y-2 text-center">New Transaction</h3>
      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="description">Description</label>
          <input type="text" name="description" id="description-input" required />
        </div>
        <div>
          <label htmlFor="amount">Amount</label>
          <input type="text" name="amount" id="amount-input" required />
        </div>
        <div>
          <label htmlFor="stack">Stack</label>
          <select name="stack" id="stack-input" className="w-full">
            <option value="" disabled selected>
              Choose a Stack
            </option>
            {stacks?.map((stack) => (
              <option value={stack.id}>{stack.label}</option>
            ))}
          </select>
        </div>
        <div>
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
