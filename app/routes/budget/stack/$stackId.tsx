import { Form, useLoaderData, LoaderFunction, ActionFunction, redirect, Link } from 'remix';
import { Stack, StackCategory } from '.prisma/client';
import { authenticator } from '~/auth/auth.server';
import { db } from '~/utils/db.server';

interface LoaderData {
  stack: Stack & {
    category: StackCategory | null;
  };
  categories: StackCategory[];
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const user = await authenticator.isAuthenticated(request);

  if (!user || !user.Budget) {
    return redirect('/login');
  }
  const stack = await db.stack.findUnique({ where: { id: Number(params.stackId) }, include: { category: true } });
  const categories = await db.stackCategory.findMany({ where: { budgetId: user.Budget.id } });
  if (!stack) {
    throw Error('Stack not found!');
  }
  return { stack, categories };
};

export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();
  const label = String(form.get('label'));
  const amount = Number(form.get('amount'));
  const categoryId = Number(form.get('category'));

  await db.stack.update({
    where: { id: Number(params.stackId) },
    data: { amount, label, stackCategoryId: categoryId },
  });

  return null;
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
            <input type="text" name="amount" defaultValue={stack.amount} />
          </div>
          <div>
            <label htmlFor="catgory" className="inline-block mb-1">
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
            <input
              type="submit"
              value="Submit"
              className="rounded-md cursor-pointer px-4 py-2 border border-gray-700  hover:bg-gray-700 hover:text-gray-50 w-full"
            />
            <Link to="/budget" className="hover:text-purple-700">
              Cancel
            </Link>
          </div>
        </div>
      </Form>
    </div>
  );
}
