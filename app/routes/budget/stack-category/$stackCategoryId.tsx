import { Form, useLoaderData, LoaderFunction, ActionFunction, redirect } from 'remix';
import { StackCategory } from '.prisma/client';
import { authenticator } from '~/auth/auth.server';
import { db } from '~/utils/db.server';
import { deleteStackCateogry } from '~/utils/server/index.server';

interface LoaderData {
  category: StackCategory;
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const user = await authenticator.isAuthenticated(request);

  if (!user || !user.Budget) {
    return redirect('/login');
  }
  const category = await db.stackCategory.findUnique({ where: { id: Number(params.stackCategoryId) } });
  if (!category) {
    throw Error('Stack category not found!');
  }
  return { category };
};

export const action: ActionFunction = async ({ request, params }) => {
  const user = await authenticator.isAuthenticated(request);
  if (!user || !user.Budget) {
    return redirect('/login');
  }
  const stackCatId = Number(params.stackCategoryId);
  const form = await request.formData();
  if (form.get('_method') === 'delete') {
    await deleteStackCateogry({ budgetId: user.Budget.id, categoryId: stackCatId });
    return redirect('/budget');
  }
  const label = String(form.get('stack-category'));

  await db.stackCategory.update({ where: { id: Number(params.stackCategoryId) }, data: { label } });

  return null;
};

export default function StackId() {
  const { category } = useLoaderData<LoaderData>();
  return (
    <div className="space-y-4">
      <Form method="post">
        <div className="space-y-4">
          <input type="hidden" name="_method" value="update" />
          <div>
            <label htmlFor="stack-category">Stack Category</label>
            <input type="text" name="stack-category" defaultValue={category.label} />
          </div>
          <input
            type="submit"
            value="Submit"
            className="rounded-md cursor-pointer px-4 py-2 bg-blue-500 text-blue-100 hover:bg-blue-600"
          />
        </div>
      </Form>
      <Form method="post">
        <input type="hidden" name="_method" value="delete" />
        <button type="submit" className="rounded-md cursor-pointer px-4 py-2 bg-red-700 text-red-100 hover:bg-red-600 ">
          Delete
        </button>
      </Form>
    </div>
  );
}
