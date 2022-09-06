import { Form, useLoaderData, LoaderFunction, ActionFunction, redirect, Link, json, useParams } from 'remix';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useEffect, useState } from 'react';
import z, { Schema, ZodError } from 'zod';
import type { Transaction, Stack } from '@prisma/client';
import { db } from '~/utils/db.server';
import { Button } from '~/components/button';
import { centsToDollars, dollarsToCents } from '~/utils/money-fns';
import { editTransactionAndUpdBudget } from '~/utils/server/index.server';
import { requireAuthenticatedUser } from '~/utils/server/user-utils.server';
import { EditTransactionSchema } from '~/utils/shared/validation';

interface LoaderData {
  transaction?: Transaction;
  stacks: Stack[];
}

type ValidationInput = {
  request: Request;
  schema: Schema;
};

async function validationAction<ActionInput>({ request, schema }: ValidationInput) {
  const formData = await request.formData();
  const body = Object.fromEntries(formData);
  console.log('--------');
  console.log(body);
  try {
    const input = schema.parse(body) as ActionInput;
    return { formData: input, errors: null };
  } catch (e) {
    const errors = e as ZodError<ActionInput>;
    return {
      formData: body,
      errors: errors.flatten(),
    };
  }
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
  const user = await requireAuthenticatedUser(request);

  // TODO:z Refactor side effects below into separate function
  const budget = await db.budget.findFirst({ where: { userId: user.id } });

  if (!budget || !params.transactionId) {
    throw Error('TODO');
  }

  const { formData, errors } = await validationAction<z.infer<typeof EditTransactionSchema>>({
    request,
    schema: EditTransactionSchema,
  });

  if (errors) {
    return json({ errors, formData }, 400);
  }

  const { description, amount, stackId, type, id } = formData;

  const amountInCents = dollarsToCents(amount);

  editTransactionAndUpdBudget({
    description,
    amount: amountInCents,
    id,
    stackId,
    budget,
    type,
  });

  return redirect('/transactions');
};

export default function TransactionIdPage() {
  const { transaction, stacks } = useLoaderData<LoaderData>();
  const [transactionType, setTransactionType] = useState<string>(transaction?.type || 'deposit');
  const { transactionId } = useParams();

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
            <input type="text" name="description" required defaultValue={transaction.description} />
          </div>
          <div>
            <label htmlFor="amount" className="inline-block mb-1">
              Amount
            </label>
            <input
              type="text"
              name="amount"
              required
              defaultValue={Math.abs(parseFloat(centsToDollars(transaction.amount)))}
            />
          </div>
          <div>
            <label htmlFor="stackId" className="inline-block mb-1">
              Stack
            </label>
            <select
              id="stackId"
              name="stackId"
              defaultValue={transaction.stackId || -1}
              className="block w-full"
              required
            >
              {stacks.map((stack) => (
                <option value={stack.id} key={stack.id}>
                  {stack.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <input type="hidden" name="type" id="trans-type" value={transactionType} />
            <input type="hidden" name="id" id="transactionId" value={transactionId} />
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
            <Link to="/transactions" className="hover:text-purple-700">
              Cancel
            </Link>
          </div>
        </div>
      </Form>
    </div>
  );
}
