import { ActionArgs, LoaderArgs } from '@remix-run/node';
import { Form, Link, useParams, useTransition } from '@remix-run/react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { typedjson, useTypedActionData, useTypedLoaderData, redirect } from 'remix-typedjson';
import { DateTime } from 'luxon';
import { db } from '~/lib/db.server';
import { Button } from '~/components/button';
import { centsToDollars, dollarsToCents } from '~/lib/modules/money';
import { requireAuthenticatedUser } from '~/lib/modules/user';
import { ActionResponse, EditTransactionSchema, validateAction } from '~/lib/modules/validation';
import { ErrorText } from '~/components/error-text';
import { editTransaction } from '~/lib/modules/transactions';

export async function loader({ request, params }: LoaderArgs) {
  const user = await requireAuthenticatedUser(request);
  const transactionPromise = db.transaction.findFirst({
    where: { id: String(params.transactionId), budget: { userId: user.id } },
  });
  const stacksPromise = db.stack.findMany({ where: { budget: { userId: user.id } } });

  const [transaction, stacks] = await Promise.all([transactionPromise, stacksPromise]);

  return typedjson({ transaction, stacks });
}

type ActionData = z.infer<typeof EditTransactionSchema>;
const badRequest = (data: ActionResponse<ActionData>) => typedjson(data, { status: 400 });

export async function action({ request, params }: ActionArgs) {
  const user = await requireAuthenticatedUser(request);

  // TODO:z Refactor side effects below into separate function
  const budget = await db.budget.findFirst({ where: { userId: user.id } });

  if (!budget || !params.transactionId) {
    throw Error('TODO');
  }
  const rawFormData = await request.formData();
  const { formData, errors } = await validateAction({
    formData: rawFormData,
    schema: EditTransactionSchema,
  });

  if (errors) {
    return badRequest({ errors });
  }

  const { description, amount, stackId, type, id, date } = formData;

  const amountInCents = dollarsToCents(amount);

  await editTransaction({
    description,
    amount: amountInCents,
    id,
    stackId,
    type,
    date,
  });

  return redirect('/transactions');
}

export default function TransactionIdPage() {
  const { transaction, stacks } = useTypedLoaderData<typeof loader>();
  const [transactionType, setTransactionType] = useState<string>(transaction?.type || 'deposit');
  const { transactionId } = useParams();
  const actionData = useTypedActionData<typeof action>();
  const transition = useTransition();
  useEffect(() => {
    if (transaction?.type) {
      setTransactionType(transaction?.type);
    }
  }, [transaction, setTransactionType]);

  if (!transaction) {
    return <div>Transaction not found</div>;
  }
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 md:relative p-5 md:p-0">
      <h3 className="text-lg mb-3 divide-y-2 text-center">Edit Transaction</h3>
      {actionData?.errors?.formErrors
        ? actionData.errors.formErrors.map((message: string) => <ErrorText>{message}</ErrorText>)
        : null}
      <Form method="post" key={transaction.id}>
        <div className="space-y-4">
          <div>
            <label htmlFor="description" className="inline-block mb-1">
              Description{' '}
              {actionData?.errors?.fieldErrors?.description && (
                <ErrorText>{actionData.errors.fieldErrors.description[0]}</ErrorText>
              )}
            </label>
            <input type="text" name="description" required defaultValue={transaction.description} />
          </div>
          <div>
            <label htmlFor="amount" className="inline-block mb-1">
              Amount{' '}
              {actionData?.errors?.fieldErrors?.amount && (
                <ErrorText>{actionData.errors.fieldErrors.amount[0]}</ErrorText>
              )}
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
              Stack{' '}
              {actionData?.errors?.fieldErrors?.stackId && (
                <ErrorText>{actionData.errors.fieldErrors.stackId[0]}</ErrorText>
              )}
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
            <label htmlFor="date">
              Date{' '}
              {actionData?.errors?.fieldErrors?.date && (
                <ErrorText>{actionData?.errors?.fieldErrors.date[0]}</ErrorText>
              )}
            </label>
            <input
              required
              type="date"
              name="date"
              id="date-input"
              className="block w-full"
              defaultValue={DateTime.fromJSDate(transaction.date, { zone: 'UTC' }).toFormat('yyyy-MM-dd')}
            />
          </div>
          <div>
            <input type="hidden" name="type" id="trans-type" value={transactionType} />
            <input type="hidden" name="id" id="transactionId" value={transactionId} />
            {actionData?.errors?.fieldErrors?.type && <ErrorText>{actionData.errors.fieldErrors.type[0]}</ErrorText>}
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
          <fieldset disabled={transition.state !== 'idle'} className="flex flex-col items-center space-y-2">
            <Button type="submit" variant="outline" className="w-full">
              {transition.state === 'submitting' ? 'Saving' : 'Save'}
            </Button>
            <Link to="/transactions" className="hover:text-purple-700">
              Cancel
            </Link>
          </fieldset>
        </div>
      </Form>
    </div>
  );
}
