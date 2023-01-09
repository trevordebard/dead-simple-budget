import { Stack } from '@prisma/client';
import { Link, useFetcher } from '@remix-run/react';
import { centsToDollars } from '~/lib/modules/money';
import { DotsVerticalIcon } from '@heroicons/react/solid';
import * as React from 'react';
import clsx from 'clsx';
import { ErrorText } from '~/components/error-text';
import { useState, useRef, useEffect } from 'react';
import { ActionResult, FormErrors } from '~/lib/utils/response-types';

export function EditableStack({ stack, totalSpent }: { stack: Stack; totalSpent: number }) {
  // using fetcher to avoid redirect
  const stackFetcher = useFetcher<ActionResult>();
  const [error, setError] = useState<FormErrors>();
  const available = centsToDollars(stack.amount + totalSpent);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (stackFetcher?.data?.status === 'error' && stackFetcher?.submission?.action.startsWith(`/budget/stack/`)) {
      setError(stackFetcher?.data?.formErrors);
    } else if (stackFetcher?.state === 'submitting' || stackFetcher.state === 'loading') {
      setError(null);
    }
  }, [stackFetcher]);

  const submitForm = (e: React.FocusEvent<HTMLInputElement, Element>) => {
    stackFetcher.submit(e.currentTarget.form);
  };

  return (
    <stackFetcher.Form
      method="post"
      action={`/budget/stack/${stack.id}`}
      key={stack.id}
      ref={formRef}
      onFocus={() => setError(null)}
    >
      <input type="hidden" name="_action" value="edit-stack" />
      <input type="hidden" name="stackId" value={stack.id} />
      <input type="hidden" name="categoryId" value={stack.stackCategoryId || -1} />
      <input type="hidden" name="budgetId" value={stack.budgetId} />
      <div
        className={clsx(
          'flex items-center justify-between hover:bg-gray-100 rounded-md',
          error && 'border border-red-600'
        )}
      >
        <input
          type="text"
          name="label"
          onBlur={submitForm}
          defaultValue={stack.label}
          className="p-1 border-none my-1 bg-inherit hover:bg-gray-200"
        />
        <div className="flex items-center space-x-2" key={stack.amount}>
          <input
            type="text"
            name="amount"
            id={stack.id.toString()}
            defaultValue={centsToDollars(stack.amount)}
            className="w-24 text-right p-1 border-none my-1 bg-inherit hover:bg-gray-200"
            onBlur={submitForm}
          />

          <div className="flex justify-end w-24 text-right font-semibold">
            <div className={clsx('rounded-md px-2', stack.amount + totalSpent < 0 && 'text-red-700 bg-red-300')}>
              {available}
            </div>
          </div>
          <Link to={`/budget/stack/${stack.id}`} className="text-gray-600">
            <DotsVerticalIcon className="w-5 h-5 inline mb-1 cursor-pointer text-zinc-400 hover:text-purple-600" />
          </Link>
        </div>
      </div>
      {stackFetcher.data?.status === 'error' && stackFetcher?.data?.formErrors?.fieldErrors?.amount ? (
        <ErrorText>{stackFetcher.data.formErrors.fieldErrors.amount[0]}</ErrorText>
      ) : null}
    </stackFetcher.Form>
  );
}
