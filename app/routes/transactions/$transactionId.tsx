import { Form, useLoaderData, LoaderFunction, ActionFunction, redirect, Link, json } from 'remix';
import { Transaction, Stack } from '.prisma/client';
import { db } from '~/utils/db.server';
import { Button } from '~/components/button';
import { centsToDollars, dollarsToCents } from '~/utils/money-fns';
import { recalcToBeBudgeted, requireAuthenticatedUser } from '~/utils/server/index.server';

interface LoaderData {
  transaction?: Transaction;
  stacks: Stack[];
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const user = await requireAuthenticatedUser(request);
  const transactionPromise = db.transaction.findFirst({
    where: { id: Number(params.transactionId), budget: { userId: user.id } },
  });
  const stacksPromise = db.stack.findMany({ where: { budget: { userId: user.id } } });

  const [transaction, stacks] = await Promise.all([transactionPromise, stacksPromise]);

  return json({ transaction, stacks });
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  const user = await requireAuthenticatedUser(request);
  const description = String(form.get('description'));
  let amount = Number(form.get('amount'));
  const stackId = Number(form.get('stack'));

  amount = dollarsToCents(amount);

  // TODO:z Refactor side effects below into separate function

  // Get the previous transaction
  const prevTransactionPromise = db.transaction.findFirst({
    where: { id: Number(params.transactionId), budget: { userId: user.id } },
  });
  const budgetPromise = db.budget.findFirst({ where: { userId: user.id } });

  const [prevTransaction, budget] = await Promise.all([prevTransactionPromise, budgetPromise]);

  if (!prevTransaction || !budget) {
    throw Error('TODO');
  }

  // Reset previous stack amount by previous transaction amount
  const resetStackPromise = db.stack.update({
    where: { id: prevTransaction.stackId },
    data: { amount: { decrement: prevTransaction.amount } },
  });

  // Reset budget total by previous transaction amount
  const resetBudgetPromise = db.budget.update({
    where: { id: budget.id },
    data: { total: { decrement: prevTransaction.amount } },
  });

  // Update transaction
  const updateTransactionPromise = db.transaction.update({
    where: { id: Number(params.transactionId) },
    data: { amount, description, stackId },
  });

  // Increment/decrement stack by new amount
  const updateStackPromise = db.stack.update({
    where: { id: stackId },
    data: { amount: { increment: amount } },
  });

  // Increment/decrement budget total by new amount
  const updateBudgetPromise = db.budget.update({
    where: { id: budget.id },
    data: { total: { increment: amount } },
  });

  const [_a, _b, _c, _d, updatedBudget] = await db.$transaction([
    resetStackPromise,
    resetBudgetPromise,
    updateTransactionPromise,
    updateStackPromise,
    updateBudgetPromise,
  ]);

  // Recalc to be budgeteds
  await recalcToBeBudgeted(updatedBudget);

  return redirect('/transactions');
};

export default function TransactionIdPage() {
  const { transaction, stacks } = useLoaderData<LoaderData>();
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
            <input type="text" name="amount" defaultValue={centsToDollars(transaction.amount)} />
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
