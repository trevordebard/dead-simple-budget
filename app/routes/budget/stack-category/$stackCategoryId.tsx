import { ActionFunction, LoaderFunction, redirect } from '@remix-run/node';
import { Form, useLoaderData } from '@remix-run/react';
import { StackCategory } from '.prisma/client';
import { db } from '~/lib/db.server';
import { Button } from '~/components/button';
import { requireAuthenticatedUser } from '~/lib/modules/user';
import { deleteStackCateogry } from '~/lib/modules/stack-categories';

interface LoaderData {
  category: StackCategory;
}

export const loader: LoaderFunction = async ({ params, request }) => {
  const user = await requireAuthenticatedUser(request);
  const budget = await db.budget.findFirst({ where: { userId: user.id } });

  if (!user || !budget || !params.stackCategoryId) {
    return redirect('/login');
  }
  const category = await db.stackCategory.findUnique({ where: { id: params.stackCategoryId } });
  if (!category) {
    throw Error('Stack category not found!');
  }
  return { category };
};

export const action: ActionFunction = async ({ request, params }) => {
  const user = await requireAuthenticatedUser(request);
  const budget = await db.budget.findFirst({ where: { userId: user.id } });

  if (!user || !budget || !params.stackCategoryId) {
    return redirect('/login');
  }
  const form = await request.formData();

  if (form.get('_method') === 'delete') {
    await deleteStackCateogry({ budgetId: budget.id, categoryId: params.stackCategoryId });
    return redirect('/budget');
  }
  const label = String(form.get('stack-category'));

  await db.stackCategory.update({ where: { id: params.stackCategoryId }, data: { label } });

  return redirect('/budget');
};

export default function StackCategoryId() {
  const { category } = useLoaderData<LoaderData>();
  return (
    <div className="space-y-4">
      <Form method="post" key={category.id}>
        <div className="space-y-4">
          <input type="hidden" name="_method" value="update" />
          <div>
            <label htmlFor="stack-category">Stack Category</label>
            <input type="text" name="stack-category" defaultValue={category.label} />
          </div>
          <Button type="submit" className="w-full">
            Save
          </Button>
        </div>
      </Form>
      <Form method="post" key={category.label} className="flex flex-col">
        <input type="hidden" name="_method" value="delete" />
        <Button type="submit" variant="danger">
          Delete
        </Button>
      </Form>
    </div>
  );
}
