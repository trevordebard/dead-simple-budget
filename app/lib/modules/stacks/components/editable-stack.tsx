import { Stack } from '@prisma/client';
import { Link, useFetcher } from '@remix-run/react';
import { centsToDollars } from '~/lib/modules/money';

export function EditableStack({ stack }: { stack: Stack }) {
  // using fetcher to avoid redirect
  const stackFetcher = useFetcher();
  return (
    <div className="flex justify-between items-center hover:bg-gray-100 px-3 rounded-md">
      <label htmlFor={stack.label}>{stack.label}</label>
      <div className="flex items-center space-x-3">
        <stackFetcher.Form method="post" action="/budget" key={stack.id}>
          <input type="hidden" name="_action" value="edit-stack" />
          <input type="hidden" name="stackId" value={stack.id} />
          <input type="hidden" name="budgetId" value={stack.budgetId} />
          <input
            type="text"
            name="amount"
            id={stack.id.toString()}
            defaultValue={centsToDollars(stack.amount)}
            className="bg-inherit text-right border-none max-w-xs w-32 hover:bg-gray-200 px-4"
            onBlur={(e) => stackFetcher.submit(e.currentTarget.form)}
          />
        </stackFetcher.Form>
        <Link to={`/budget/stack/${stack.id}`} className="text-gray-600">
          edit
        </Link>
      </div>
    </div>
  );
}
