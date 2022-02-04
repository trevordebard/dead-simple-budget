import { Form, useLoaderData, LoaderFunction, ActionFunction, redirect, Link } from 'remix';
import { Stack, StackCategory } from '.prisma/client';
import { db } from '~/utils/db.server';
import { Button } from '~/components/button';
import { centsToDollars, dollarsToCents } from '~/utils/money-fns';
import { requireAuthenticatedUser } from '~/utils/server/index.server';
import { recalcToBeBudgeted } from '~/utils/server/budget.server';

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

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
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
};

export default function StackId() {
  const { stack, categories } = useLoaderData<LoaderData>();
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
          <div className="flex flex-col items-center space-y-2">
            <Button type="submit" variant="outline" className="w-full">
              Save Stack
            </Button>
            <Link to="/budget" className="hover:text-purple-700">
              Cancel
            </Link>
          </div>
        </div>
      </Form>
    </div>
  );
}