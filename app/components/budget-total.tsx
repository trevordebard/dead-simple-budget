import { Budget } from '@prisma/client';
import { useState } from 'react';
import { Form, useSubmit, useTransition } from '@remix-run/react';
import { PencilAltIcon } from '@heroicons/react/outline';
import { XIcon, CheckIcon } from '@heroicons/react/solid';
import { centsToDollars } from '~/utils/money-fns';

export function BudgetTotal({ budget }: { budget: Budget }) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const transition = useTransition();
  const submit = useSubmit();

  // Optimistic UI response
  if (transition.submission) {
    const newTotal = transition.submission.formData.get('total');
    const change = Number(newTotal) - budget.total / 100;
    const newToBeBudgeted = budget.toBeBudgeted / 100 + change;
    return (
      <div className="text-xl flex flex-col items-center">
        <h2>
          <span className="font-medium">${newTotal}</span>{' '}
          <span className="font-normal">
            in account{' '}
            <PencilAltIcon
              tabIndex={0}
              className="w-5 h-5 inline mb-1 cursor-pointer text-zinc-400 hover:text-purple-600"
            />
          </span>
        </h2>
        <h2>
          <span className="font-medium">${newToBeBudgeted}</span> to be budgeted
        </h2>
      </div>
    );
  }

  if (isEditing) {
    return (
      <Form method="post" action="/budget" className="text-xl flex justify-center  space-x-1">
        <input type="hidden" name="_action" value="update-total" />
        <input type="hidden" name="budgetId" value={budget.id} />
        <input
          type="text"
          name="total"
          className="w-20 inline !py-0 !rounded-sm"
          defaultValue={centsToDollars(budget.total)}
        />
        <div className="align-baseline">in account</div>
        {transition.state === 'loading' ? (
          <div>loading</div>
        ) : (
          <span>
            <XIcon
              tabIndex={0}
              onClick={() => setIsEditing(!isEditing)}
              className="stroke- w-5 h-5 inline mb-1 cursor-pointer text-zinc-400 hover:text-red-600"
            />

            <button
              type="button"
              onClick={(e) => {
                setIsEditing(false);
                submit(e.currentTarget.form);
              }}
              disabled={transition.state !== 'idle'}
            >
              <CheckIcon className="stroke- w-5 h-5 inline mb-1 cursor-pointer text-zinc-400 hover:text-purple-600" />
            </button>
          </span>
        )}
      </Form>
    );
  }
  return (
    <div className="text-xl flex flex-col items-center">
      <h2>
        <span className="font-medium">${centsToDollars(budget.total)}</span>{' '}
        <span className="font-normal">
          in account{' '}
          <PencilAltIcon
            tabIndex={0}
            onClick={() => setIsEditing(!isEditing)}
            onKeyDown={() => setIsEditing(!isEditing)}
            className="w-5 h-5 inline mb-1 cursor-pointer text-zinc-400 hover:text-purple-600"
          />
        </span>
      </h2>
      <h2>
        <span className="font-medium">${centsToDollars(budget.toBeBudgeted)}</span> to be budgeted
      </h2>
    </div>
  );
}
