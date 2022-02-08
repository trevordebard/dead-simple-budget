import { Form, useLoaderData, LoaderFunction, ActionFunction, redirect, Link, useTransition } from 'remix';
import { TrashIcon, XIcon } from '@heroicons/react/solid';
import { Stack, StackCategory } from '.prisma/client';
import { db } from '~/utils/db.server';
import { Button } from '~/components/button';
import { centsToDollars, dollarsToCents } from '~/utils/money-fns';
import { recalcToBeBudgeted } from '~/utils/server/budget.server';
import { requireAuthenticatedUser } from '~/utils/server/user-utils.server';

interface LoaderData {
  stack: Stack & {
    category: StackCategory | null;
  };
  categories: StackCategory[];
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const user = await requireAuthenticatedUser(request);
  const budget = await db.budget.findFirst({ where: { userId: user.id } });

  if (!user || !budget) {
    return redirect('/login');
  }
  const stack = await db.stack.findUnique({ where: { id: params.stackId }, include: { category: true } });
  const categories = await db.stackCategory.findMany({ where: { budgetId: budget.id } });
  if (!stack) {
    throw Error('Stack not found!');
  }
  return { stack, categories };
};

// TODO: verify the stacks being modified belong to the logged in user
export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  await requireAuthenticatedUser(request);
  const formAction = form.get('_action');

  if (formAction === 'save-stack') {
    const label = String(form.get('label'));
    const amountInput = String(form.get('amount'));
    const categoryId = String(form.get('category'));

    const amount = dollarsToCents(amountInput);

    const updatedStack = await db.stack.update({
      where: { id: params.stackId },
      data: { amount, label, stackCategoryId: categoryId },
      include: { budget: true },
    });

    await recalcToBeBudgeted({ budget: updatedStack.budget });
    return redirect('/budget');
  }
  if (formAction === 'delete-stack') {
    await db.stack.delete({ where: { id: params.stackId } });
    return redirect('/budget');
  }
  return null;
};

export default function StackId() {
  const { stack, categories } = useLoaderData<LoaderData>();
  const transition = useTransition();
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 md:relative bg-white p-5 md:p-0">
      <h3 className="text-lg mb-3 divide-y-2 text-center">Edit Stack</h3>
      <Form method="post" key={stack.id}>
        <div className="space-y-4">
          <div>
            <label htmlFor="label" className="inline-block mb-1">
              Stack
            </label>
            <input type="text" name="label" defaultValue={stack.label} />
          </div>
          <div>
            <label htmlFor="amount" className="inline-block mb-1">
              Amount
            </label>
            <input type="text" name="amount" defaultValue={centsToDollars(stack.amount)} />
          </div>
          <div>
            <label htmlFor="category" className="inline-block mb-1">
              Category
            </label>
            <select name="category" defaultValue={stack.stackCategoryId || -1} className="block w-full">
              {categories.map((cat) => (
                <option value={cat.id} key={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <fieldset disabled={transition.state !== 'idle'} className="flex flex-col items-center space-y-2">
            <Button name="_action" value="save-stack" type="submit" variant="primary" className="w-full">
              Save Stack
            </Button>
            <div className="flex justify-end space-x-1 w-full">
              <Link to="/budget" className="hover:no-underline hover:text-inherit focus:outline-none" tabIndex={-1}>
                <Button
                  variant="transparent"
                  className="bg-grey-light hover:bg-grey text-grey-darkest rounded inline-flex items-center"
                >
                  <XIcon className="h-4 w-4" />
                  <span> Cancel</span>
                </Button>
              </Link>
              <Button
                type="submit"
                variant="transparent"
                className="bg-grey-light hover:bg-grey text-red-700 hover:bg-red-100 rounded inline-flex items-center"
                name="_action"
                value="delete-stack"
              >
                <TrashIcon className="h-4 w-4" />
                <span> Delete</span>
              </Button>
            </div>
          </fieldset>
        </div>
      </Form>
    </div>
  );
}
