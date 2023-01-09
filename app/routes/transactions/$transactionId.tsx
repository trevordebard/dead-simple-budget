import { ActionArgs, json, LoaderArgs, redirect, TypedResponse } from '@remix-run/node';
import { Form, Link, useActionData, useLoaderData, useParams, useTransition } from '@remix-run/react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { db } from '~/lib/db.server';
import { Button } from '~/components/button';
import { centsToDollars, dollarsToCents } from '~/lib/modules/money';
import { requireAuthenticatedUser } from '~/lib/modules/user';
import { EditTransactionSchema, validateForm } from '~/lib/modules/validation';
import { ErrorText } from '~/components/error-text';
import { editTransaction } from '~/lib/modules/transactions';
import { ActionResult } from '~/lib/utils/response-types';
import { Prisma } from '@prisma/client';

export async function loader({ request, params }: LoaderArgs) {
  const user = await requireAuthenticatedUser(request);
  const transactionPromise = db.transaction.findFirst({
    where: { id: String(params.transactionId), budget: { userId: user.id } },
  });
  const stacksPromise = db.stack.findMany({ where: { budget: { userId: user.id } } });

  const [transaction, stacks] = await Promise.all([transactionPromise, stacksPromise]);

  return json({ transaction, stacks });
}

export async function action({ request, params }: ActionArgs): Promise<TypedResponse<ActionResult>> {
  const user = await requireAuthenticatedUser(request);

  const budget = await db.budget.findFirst({ where: { userId: user.id } });

  if (!budget || !params.transactionId) {
    console.error(`Required parameters were not provided. Budget: ${budget}, transactionId: ${params.transactionId}`);
    return json({ status: 'error', errors: [{ message: 'An unexpected error occurred' }] });
  }
  const rawFormData = await request.formData();
  const validationResult = validateForm({
    formData: rawFormData,
    schema: EditTransactionSchema,
  });

  if (validationResult.status === 'error') {
    const resp: ActionResult = { formErrors: validationResult.formErrors, status: 'error' };
    return json(resp, { status: 400 });
  }

  const { description, amount, stackId, type, id, date } = validationResult.data;

  const amountInCents = dollarsToCents(amount);
  try {
    await editTransaction({
      description,
      amount: amountInCents,
      id,
      stackId,
      type,
      date,
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        return json(
          { status: 'error', errors: [{ message: 'A duplicate transaction was added' }], formErrors: null },
          { status: 400 }
        );
      }
      return json(
        {
          status: 'error',
          errors: [{ message: 'An unexpected database error occurred' }],
          formErrors: null,
        },
        { status: 500 }
      );
    }
  }

  return redirect('/transactions');
}

export default function TransactionIdPage() {
  const { transaction, stacks } = useLoaderData<typeof loader>();
  const [transactionType, setTransactionType] = useState<string>(transaction?.type || 'deposit');
  const { transactionId } = useParams();
  const actionData = useActionData<typeof action>();
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
      {actionData?.status === 'error' ? actionData?.errors?.map((err) => <ErrorText>{err.message}</ErrorText>) : null}
      <Form method="post" key={transaction.id}>
        <div className="space-y-4">
          <div>
            <label htmlFor="description" className="inline-block mb-1">
              Description{' '}
              {actionData?.status === 'error' && actionData?.formErrors?.fieldErrors?.description && (
                <ErrorText>{actionData?.formErrors.fieldErrors.description[0]}</ErrorText>
              )}
            </label>
            <input type="text" name="description" defaultValue={transaction.description} />
          </div>
          <div>
            <label htmlFor="amount" className="inline-block mb-1">
              Amount{' '}
              {actionData?.status === 'error' && actionData?.formErrors?.fieldErrors?.amount && (
                <ErrorText>{actionData?.formErrors.fieldErrors.amount[0]}</ErrorText>
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
              {actionData?.status === 'error' && actionData?.formErrors?.fieldErrors?.stackId && (
                <ErrorText>{actionData?.formErrors.fieldErrors.stackId[0]}</ErrorText>
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
              {actionData?.status === 'error' && actionData?.formErrors?.fieldErrors?.date && (
                <ErrorText>{actionData?.formErrors.fieldErrors.date[0]}</ErrorText>
              )}
            </label>
            <input
              required
              type="date"
              name="date"
              id="date-input"
              className="block w-full"
              defaultValue={
                transaction.date && DateTime.fromISO(transaction.date, { zone: 'UTC' }).toFormat('yyyy-MM-dd')
              }
            />
          </div>
          <div>
            <input type="hidden" name="type" id="trans-type" value={transactionType} />
            <input type="hidden" name="id" id="transactionId" value={transactionId} />
            {actionData?.status === 'error' && actionData?.formErrors?.fieldErrors?.type && (
              <ErrorText>{actionData.formErrors.fieldErrors.type[0]}</ErrorText>
            )}
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
