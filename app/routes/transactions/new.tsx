import { ActionArgs, json, LoaderFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { DateTime } from 'luxon';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
import { z } from 'zod';
import { ChangeEventHandler, useRef, useState } from 'react';
import { useTypedActionData, useTypedFetcher, typedjson, redirect } from 'remix-typedjson';
import { db } from '~/utils/db.server';
import { createTransactionAndUpdBudget } from '~/utils/server/index.server';
import { Button } from '~/components/button';
import { Stack, Budget } from '.prisma/client';
import { dollarsToCents } from '~/utils/money-fns';
import { requireAuthenticatedUser } from '~/utils/server/user-utils.server';
import { ErrorText } from '~/components/error-text';
import { ActionResponse, TransactionSchema, validateAction } from '~/utils/shared/validation';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireAuthenticatedUser(request);
  const budget = await db.budget.findFirst({ where: { userId: user.id }, include: { stacks: true } });
  const stacks = budget?.stacks;
  return stacks;
};

type ActionData = z.infer<typeof TransactionSchema>;
const badRequest = (data: ActionResponse<ActionData>) => typedjson(data, { status: 400 });

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
      schema: TransactionSchema,
      formData: rawFormData,
    });
    if (errors) {
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
    const transaction = await createTransactionAndUpdBudget(newTransactionInput, budget.id);
    return typedjson(transaction);
    // return typedjson(transaction);
  } catch (e) {
    console.error(e);

    return badRequest({ errors: { formErrors: ['There was a problem creating transaction'] } });
  }
}

export default function NewTransaction() {
  const formRef = useRef<HTMLFormElement>(null);
  const [transactionType, setTransactionType] = useState<string>('deposit');
  const stacks = useLoaderData<Stack[] | null>();
  const actionData = useTypedActionData<typeof action>();
  const fetcher = useTypedFetcher<typeof action>();

  const addTransaction: ChangeEventHandler<HTMLInputElement> = () => {
    const form = formRef.current;
    if (!form) return;
    const formData = new FormData(form);
    const inputDate = formData.get('date') as string;

    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const dt = DateTime.fromFormat(inputDate, 'yyyy-MM-dd', { zone });
    const dateInUTC = dt.setZone('UTC').toJSDate();

    formData.set('date', dateInUTC.toISOString());

    fetcher.submit(formData, { method: 'post' });
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 md:relative p-5 md:p-0">
      <h3 className="text-lg mb-3 divide-y-2 text-center">New Transaction</h3>
      <fetcher.Form method="post" id="new-transaction" ref={formRef} className="space-y-4">
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
          <label htmlFor="date">
            Date {actionData?.fieldErrors?.date && <ErrorText>{actionData.fieldErrors.date[0]}</ErrorText>}
          </label>
          <input required type="date" name="date" id="date-input" className="block w-full" />
        </div>
        <div>
          {actionData?.fieldErrors?.type && <ErrorText>{actionData.fieldErrors?.type[0]}</ErrorText>}
          <input type="hidden" name="type" id="trans-type" value={transactionType} />
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
          <Button type="button" variant="outline" className="w-full" onClick={(e) => addTransaction(e)}>
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
