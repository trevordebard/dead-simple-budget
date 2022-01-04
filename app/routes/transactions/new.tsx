import { ActionFunction, Form, Link } from 'remix';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useState } from 'react';
import { db } from '~/utils/db.server';
import { requireAuthenticatedUser } from '~/utils/server/index.server';

// TODO: error handling
// TODO: budget side effects
export const action: ActionFunction = async ({ request }) => {
  const user = await requireAuthenticatedUser(request);
  const formData = await request.formData();

  const description = String(formData.get('description'));
  let amount = Number(formData.get('amount'));
  const stack = String(formData.get('stack'));
  const type = String(formData.get('trans-type'));

  if (!amount || !stack || !description || !type) {
    throw Error('TODO');
  }
  if (type === 'withdrawal') {
    amount *= -1;
  }

  const create = await db.transaction.create({
    data: { description, amount, stack, budgetId: user.Budget.id, date: new Date(), type },
  });
  return create;
};

export default function NewTransaction() {
  const [transactionType, setTransactionType] = useState<string>('deposit');
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 md:relative bg-white p-5 md:p-0">
      <h3 className="text-lg mb-3 divide-y-2 text-center">New Transaction</h3>
      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="description">Description</label>
          <input type="text" name="description" id="description-input" />
        </div>
        <div>
          <label htmlFor="amount">Amount</label>
          <input type="text" name="amount" id="amount-input" />
        </div>
        <div>
          <label htmlFor="stack">Stack</label>
          <input type="text" name="stack" id="stack-input" />
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
              className="flex items-center justify-center w-full h-9 border-gray-300 border hover:bg-gray-100 first:rounded-l-md last:rounded-r-md radix-state-on:border-transparent radix-state-on:bg-purple-900 radix-state-on:text-purple-50 focus:outline-none "
            >
              Deposit
            </ToggleGroup.Item>
            <ToggleGroup.Item
              value="withdrawal"
              className="flex items-center justify-center w-full h-9 border-gray-300 border hover:bg-gray-100 first:rounded-l-md last:rounded-r-md radix-state-on:border-transparent radix-state-on:bg-purple-900 radix-state-on:text-purple-50 focus:outline-none "
            >
              Withdrawal
            </ToggleGroup.Item>
          </ToggleGroup.Root>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <input
            type="submit"
            className="rounded-md cursor-pointer px-4 py-2 border border-gray-700  hover:bg-gray-700 hover:text-gray-50 w-full"
            value="Add Transaction"
          />
          <Link to="/transactions" className="hover:text-purple-700">
            Cancel
          </Link>
        </div>
      </Form>
    </div>
  );
}
