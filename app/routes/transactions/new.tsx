import { ActionArgs, json, LoaderArgs, redirect, SerializeFrom } from '@remix-run/node';
import { Link, useFetcher, useLoaderData } from '@remix-run/react';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { z } from 'zod';
import { useRef, useState } from 'react';
import { db } from '~/lib/db.server';
import { Button } from '~/components/button';
import { Budget } from '.prisma/client';
import { dollarsToCents } from '~/lib/modules/money';
import { requireAuthenticatedUser } from '~/lib/modules/user';
import { ErrorText } from '~/components/error-text';
import { ActionResponse, NewTransactionSchema, validateAction } from '~/lib/modules/validation';
import { createTransaction } from '~/lib/modules/transactions';

export const loader = async ({ request }: LoaderArgs) => {
  const user = await requireAuthenticatedUser(request);
  const budget = await db.budget.findFirst({ where: { userId: user.id }, include: { stacks: true } });
  const stacks = budget?.stacks;
  return json(stacks);
};

type ActionData = z.infer<typeof NewTransactionSchema>;
const badRequest = (data: ActionResponse<ActionData>) => json(data, { status: 400 });

export async function action({ request }: ActionArgs) {
  const user = await requireAuthenticatedUser(request);
  let budget: Budget | null;
  try {
    budget = await db.budget.findFirst({ where: { userId: user.id } });
  } catch (e) {
    return badRequest({ errors: { formErrors: ['Unable to find budget for user'] } });
  }
  if (!budget) {
    return badRequest({ errors: { formErrors: ['Unable to find budget for user'] } });
  }

  const rawFormData = await request.formData();
  try {
    const { formData, errors } = await validateAction({
      schema: NewTransactionSchema,
      formData: rawFormData,
    });
    if (errors) {
      console.error(errors);
      return badRequest({ errors });
    }

    const { description, amount, stackId, type, date } = formData;
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

    return badRequest({ errors: { formErrors: ['There was a problem creating transaction'] } });
  }
}

export default function NewTransaction() {
  const formRef = useRef<HTMLFormElement>(null);
  const [transactionType, setTransactionType] = useState<string>('withdrawal');
  const stacks = useLoaderData<typeof loader>();
  const fetcher = useFetcher<SerializeFrom<typeof action>>();
  const actionData = fetcher.data;

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 md:relative p-5 md:p-0">
      <h3 className="text-lg mb-3 divide-y-2 text-center">New Transaction</h3>
      <fetcher.Form method="post" id="new-transaction" ref={formRef} className="space-y-4">
        {actionData?.errors?.formErrors?.map((message) => (
          <ErrorText>{message}</ErrorText>
        ))}
        <div>
          <label htmlFor="description">
            Description{' '}
            {actionData?.errors?.fieldErrors?.description && (
              <ErrorText>{actionData?.errors.fieldErrors.description[0]}</ErrorText>
            )}
          </label>
          <input required type="text" name="description" id="description-input" />
        </div>
        <div>
          <label htmlFor="amount">
            Amount{' '}
            {actionData?.errors?.fieldErrors?.amount && (
              <ErrorText>{actionData?.errors?.fieldErrors.amount[0]}</ErrorText>
            )}
          </label>
          <input required type="text" name="amount" id="amount-input" />
        </div>
        <div>
          <label htmlFor="stackId">
            Stack{' '}
            {actionData?.errors?.fieldErrors?.stackId && (
              <ErrorText>{actionData?.errors?.fieldErrors.stackId[0]}</ErrorText>
            )}
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
          <label htmlFor="date">
            Date{' '}
            {actionData?.errors?.fieldErrors?.date && <ErrorText>{actionData?.errors?.fieldErrors.date[0]}</ErrorText>}
          </label>
          <input required type="date" name="date" id="date-input" className="block w-full" />
        </div>
        <div>
          {actionData?.errors?.fieldErrors?.type && <ErrorText>{actionData?.errors?.fieldErrors?.type[0]}</ErrorText>}
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
          <Button type="submit" variant="outline" className="w-full">
            Add Transaction
          </Button>
          <Link to="/transactions" className="hover:text-purple-700">
            Cancel
          </Link>
        </div>
      </fetcher.Form>
    </div>
  );
}
