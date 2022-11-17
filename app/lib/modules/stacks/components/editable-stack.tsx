import { Stack } from '@prisma/client';
import { Link, useFetcher } from '@remix-run/react';
import { centsToDollars } from '~/lib/modules/money';
import { DotsVerticalIcon } from '@heroicons/react/solid';
import * as React from 'react';

export function EditableStack({ stack }: { stack: Stack }) {
  // using fetcher to avoid redirect
  const stackFetcher = useFetcher();

  const submitForm = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    stackFetcher.submit(e.currentTarget.form);
  };
  return (
    <stackFetcher.Form method="post" action={`/budget/stack/${stack.id}`} key={stack.id}>
      <input type="hidden" name="_action" value="edit-stack" />
      <input type="hidden" name="stackId" value={stack.id} />
      <input type="hidden" name="categoryId" value={stack.stackCategoryId || -1} />
      <input type="hidden" name="budgetId" value={stack.budgetId} />
      <input type="hidden" name="label" value={stack.budgetId} />
      <div className="flex items-center justify-between hover:bg-gray-100 rounded-md">
        <input
          type="text"
          name="label"
          onBlur={submitForm}
          defaultValue={stack.label}
          className="p-1 border-none my-1 bg-inherit hover:bg-gray-200"
        />
        <div className="flex items-center space-x-2">
          <input
            type="text"
            name="amount"
            id={stack.id.toString()}
            defaultValue={centsToDollars(stack.amount)}
            className="w-24 text-right p-1 border-none my-1 bg-inherit hover:bg-gray-200"
            onBlur={submitForm}
          />
          <div className="w-20 text-right">{centsToDollars(stack.amount)}</div>
          <Link to={`/budget/stack/${stack.id}`} className="text-gray-600">
            <DotsVerticalIcon className="w-5 h-5 inline mb-1 cursor-pointer text-zinc-400 hover:text-purple-600" />
          </Link>
        </div>
      </div>
    </stackFetcher.Form>
  );
}
