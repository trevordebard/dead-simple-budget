import { ActionArgs, json, LoaderFunction, redirect, TypedResponse } from '@remix-run/node';
import { Form, useActionData, useLoaderData } from '@remix-run/react';
import { Prisma, StackCategory } from '@prisma/client';
import { db } from '~/lib/db.server';
import { Button } from '~/components/button';
import { requireAuthenticatedUser } from '~/lib/modules/user';
import { deleteStackCateogry } from '~/lib/modules/stack-categories';
import { z } from 'zod';
import { ActionResult } from '~/lib/utils/response-types';
import { ErrorText } from '~/components/error-text';

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

const UpdateStackCategoryFormSchema = z.object({ label: z.string() });

export const action = async ({ request, params }: ActionArgs): Promise<TypedResponse<ActionResult>> => {
  const user = await requireAuthenticatedUser(request);
  const budget = await db.budget.findFirst({ where: { userId: user.id } });

  if (!user || !budget || !params.stackCategoryId) {
    return redirect('/login');
  }
  const form = await request.formData();
  const formAction = form.get('_action');
  const body = Object.fromEntries(form);
  if (formAction === 'delete') {
    try {
      await deleteStackCateogry({ budgetId: budget.id, categoryId: params.stackCategoryId });
      return redirect('/budget');
    } catch (err) {
      console.error(err);
      return json({ status: 'error', errors: [{ message: 'There was an issue deleting stack category' }] });
    }
  }
  if (formAction === 'update') {
    try {
      const { label } = UpdateStackCategoryFormSchema.parse(body);
      await db.stackCategory.update({ where: { id: params.stackCategoryId }, data: { label } });
      return redirect('/budget');
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          return json({
            status: 'error',
            errors: [{ message: 'A category with that name already exists' }],
            formErrors: null,
          });
        }
        return json({
          status: 'error',
          errors: [{ message: 'An unexpected database error occurred' }],
          formErrors: null,
        });
      }
    }
  }
  return json({ status: 'error', errors: [{ message: 'Unsupported action' }] });
};

export default function StackCategoryId() {
  const { category } = useLoaderData<LoaderData>();
  const actionData = useActionData<typeof action>();

  return (
    <div className="space-y-4">
      {actionData?.status === 'error' ? actionData?.errors?.map((err) => <ErrorText>{err.message}</ErrorText>) : null}
      <Form method="post" key={category.id}>
        <div className="space-y-4">
          <input type="hidden" name="_action" value="update" />
          <div>
            <label htmlFor="label">Stack Category</label>
            <input type="text" name="label" defaultValue={category.label} />
          </div>
          <Button type="submit" className="w-full">
            Save
          </Button>
        </div>
      </Form>
      <Form method="post" key={category.label} className="flex flex-col">
        <input type="hidden" name="_action" value="delete" />
        <Button type="submit" variant="danger">
          Delete
        </Button>
      </Form>
    </div>
  );
}
