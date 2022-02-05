import { Form, useLoaderData, LoaderFunction, ActionFunction, redirect, Link, json } from 'remix';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useEffect, useState } from 'react';
import { Transaction, Stack } from '.prisma/client';
import { db } from '~/utils/db.server';
import { Button } from '~/components/button';
import { centsToDollars, dollarsToCents } from '~/utils/money-fns';
import { editTransactionAndUpdBudget, requireAuthenticatedUser } from '~/utils/server/index.server';

interface LoaderData {
  transaction?: Transaction;
  stacks: Stack[];
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const user = await requireAuthenticatedUser(request);
  const transactionPromise = db.transaction.findFirst({
    where: { id: String(params.transactionId), budget: { userId: user.id } },
  });
  const stacksPromise = db.stack.findMany({ where: { budget: { userId: user.id } } });

  const [transaction, stacks] = await Promise.all([transactionPromise, stacksPromise]);

  return json({ transaction, stacks });
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  const user = await requireAuthenticatedUser(request);
  const description = String(form.get('description'));
  const amountInput = String(form.get('amount'));
  const stackId = String(form.get('stack'));
  const transType = String(form.get('trans-type'));

  const amount = dollarsToCents(amountInput);

  // TODO:z Refactor side effects below into separate function
  const budget = await db.budget.findFirst({ where: { userId: user.id } });

  if (!budget || !params.transactionId) {
    throw Error('TODO');
  }

  editTransactionAndUpdBudget({
    description,
    amount,
    id: String(params.transactionId),
    stackId,
    budget,
    type: transType,
  });

  return redirect('/transactions');
};

export default function TransactionIdPage() {
  const { transaction, stacks } = useLoaderData<LoaderData>();
  const [transactionType, setTransactionType] = useState<string>(transaction?.type || 'deposit');

  useEffect(() => {
    if (transaction?.type) {
      setTransactionType(transaction?.type);
    }
  }, [transaction, setTransactionType]);

  if (!transaction) {
    return <div>Transaction not found</div>;
  }
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 md:relative bg-white p-5 md:p-0">
      <h3 className="text-lg mb-3 divide-y-2 text-center">Edit Transaction</h3>
      <Form method="post" key={transaction.id}>
        <div className="space-y-4">
          <div>
            <label htmlFor="description" className="inline-block mb-1">
              Description
            </label>
            <input type="text" name="description" defaultValue={transaction.description} />
          </div>
          <div>
            <label htmlFor="amount" className="inline-block mb-1">
              Amount
            </label>
            <input type="text" name="amount" defaultValue={Math.abs(parseFloat(centsToDollars(transaction.amount)))} />
          </div>
          <div>
            <label htmlFor="stack" className="inline-block mb-1">
              Stack
            </label>
            <select name="stack" defaultValue={transaction.stackId || -1} className="block w-full">
              {stacks.map((stack) => (
                <option value={stack.id} key={stack.id}>
                  {stack.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <input type="hidden" name="trans-type" id="trans-type" value={transactionType} />
            <ToggleGroup.Root
              type="single"
              value={transactionType}
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
              Save
            </Button>
            <Link to="/budget" className="hover:text-purple-700">
              Cancel
            </Link>
          </div>
        </div>
      </Form>
    </div>
  );
}
