import { ActionArgs, json, LoaderArgs, redirect, SerializeFrom, TypedResponse } from '@remix-run/node';
import { Link, useFetcher, useLoaderData } from '@remix-run/react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { useState } from 'react';
import { db } from '~/lib/db.server';
import { Button } from '~/components/button';
import { Budget } from '@prisma/client';
import { dollarsToCents } from '~/lib/modules/money';
import { requireAuthenticatedUser } from '~/lib/modules/user';
import { ErrorText } from '~/components/error-text';
import { NewTransactionSchema, validateForm } from '~/lib/modules/validation';
import { createTransaction } from '~/lib/modules/transactions';
import { DateTime } from 'luxon';
import { ActionResult } from '~/lib/utils/response-types';

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireAuthenticatedUser(request);
  const budget = await db.budget.findFirst({ where: { userId: user.id }, include: { stacks: true } });
  const stacks = budget?.stacks;
  return json(stacks);
};

export async function action({ request }: ActionArgs): Promise<TypedResponse<ActionResult>> {
  const user = await requireAuthenticatedUser(request);
  let budget: Budget | null;
  try {
    budget = await db.budget.findFirst({ where: { userId: user.id } });
  } catch (e) {
    return json({ status: 'error', errors: [{ message: 'Unable to find budget' }] }, { status: 500 });
  }
  if (!budget) {
    return json({ status: 'error', errors: [{ message: 'Unable to find budget' }] }, { status: 500 });
  }

  const rawFormData = await request.formData();
  try {
    const validatedForm = validateForm({
      schema: NewTransactionSchema,
      formData: rawFormData,
    });
    if (validatedForm.status === 'error') {
      return json({ formErrors: validatedForm.formErrors, status: 'error' });
    }

    const { description, amount, stackId, type, date } = validatedForm.data;
    let amountInCents = dollarsToCents(amount);

    if (type === 'withdrawal') {
      amountInCents *= -1;
    }

    const newTransactionInput = {
      description,
      amount: amountInCents,
      stackId,
      budgetId: budget.id,
      date,
      type,
    };
    await createTransaction(newTransactionInput);
    return redirect('/transactions');
  } catch (e) {
    console.error(e);

    return json({ status: 'error', errors: [{ message: 'There was a problem creating the transaction' }] });
  }
}

export default function NewTransaction() {
  const [transactionType, setTransactionType] = useState<string>('withdrawal');
  const stacks = useLoaderData<typeof loader>();
  const fetcher = useFetcher<SerializeFrom<typeof action>>();
  const actionData = fetcher.data;
  const isSubmitting = fetcher.state !== 'idle';
  const formIsInError = actionData?.status === 'error';

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 md:relative p-5 md:p-0">
      <h3 className="text-lg mb-3 divide-y-2 text-center">New Transaction</h3>
      <fetcher.Form method="post" id="new-transaction" className="space-y-4">
        {formIsInError && actionData.errors?.map((err) => <ErrorText>{err.message}</ErrorText>)}
        <div>
          <label htmlFor="description">
            Description{' '}
            {formIsInError && actionData.formErrors?.fieldErrors?.description && (
              <ErrorText>{actionData?.formErrors.fieldErrors.description[0]}</ErrorText>
            )}
          </label>
          <input type="text" name="description" id="description-input" />
        </div>
        <div>
          <label htmlFor="amount">
            Amount{' '}
            {formIsInError && actionData?.formErrors?.fieldErrors?.amount && (
              <ErrorText>{actionData?.formErrors?.fieldErrors.amount[0]}</ErrorText>
            )}
          </label>
          <input required type="text" name="amount" id="amount-input" />
        </div>
        <div>
          <label htmlFor="stackId">
            Stack{' '}
            {formIsInError && actionData?.formErrors?.fieldErrors?.stackId && (
              <ErrorText>{actionData?.formErrors?.fieldErrors.stackId[0]}</ErrorText>
            )}
          </label>
          <select
            name="stackId"
            id="stackId"
            className="w-full"
            defaultValue={stacks.find((s) => s.label === 'To Be Budgeted')?.id}
          >
            <option disabled>Choose a Stack</option>
            {stacks?.map((stack) => (
              <option value={stack.id} key={stack.id}>
                {stack.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="date">
            Date{' '}
            {formIsInError && actionData?.formErrors?.fieldErrors?.date && (
              <ErrorText>{actionData?.formErrors?.fieldErrors.date[0]}</ErrorText>
            )}
          </label>
          <input
            required
            type="date"
            name="date"
            id="date-input"
            className="block w-full"
            defaultValue={DateTime.now().toFormat('yyyy-MM-dd')}
          />
        </div>
        <div>
          {formIsInError && actionData?.formErrors?.fieldErrors?.type && (
            <ErrorText>{actionData?.formErrors?.fieldErrors?.type[0]}</ErrorText>
          )}
          <input type="hidden" name="type" id="trans-type" value={transactionType} />
          <ToggleGroup.Root
            type="single"
            defaultValue="withdrawal"
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
          <fieldset className="w-full" disabled={isSubmitting}>
            <Button type="submit" variant="outline" className="w-full">
              Add Transaction
            </Button>
          </fieldset>
          <Link to="/transactions" className="hover:text-purple-700">
            Cancel
          </Link>
        </div>
      </fetcher.Form>
    </div>
  );
}
