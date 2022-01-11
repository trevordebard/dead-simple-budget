import { Form, useLoaderData, LoaderFunction, ActionFunction, redirect } from 'remix';
import { StackCategory } from '.prisma/client';
import { authenticator } from '~/auth/auth.server';
import { db } from '~/utils/db.server';
import { deleteStackCateogry } from '~/utils/server/index.server';
import { Button } from '~/components/button';

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
