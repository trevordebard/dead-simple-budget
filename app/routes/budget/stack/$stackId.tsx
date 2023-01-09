import { ActionArgs, json, LoaderFunction, redirect, TypedResponse } from '@remix-run/node';
import { Form, Link, useActionData, useLoaderData, useTransition } from '@remix-run/react';
import { TrashIcon, XIcon } from '@heroicons/react/solid';
import { z } from 'zod';
import { Stack, StackCategory } from '@prisma/client';
import { db } from '~/lib/db.server';
import { Button } from '~/components/button';
import { centsToDollars, dollarsToCents } from '~/lib/modules/money';
import { requireAuthenticatedUser } from '~/lib/modules/user';
import { updateStack } from '~/lib/modules/stacks';
import { ErrorText } from '~/components/error-text';
import { DeleteStackSchema, EditStackSchema, validateForm } from '~/lib/modules/validation';
import { ActionResult } from '~/lib/utils/response-types';

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
    throw Error(`Stack with id ${params.stackId} was not found.`);
  }
  return { stack, categories };
};

const PossibleActionsEnum = z.enum(['edit-stack', 'delete-stack']);
type StackIdAction = z.infer<typeof PossibleActionsEnum>;

// TODO: verify the stacks being modified belong to the logged in user
export const action = async ({ request }: ActionArgs): Promise<TypedResponse<ActionResult>> => {
  const form = await request.formData();

  const formAction: StackIdAction = PossibleActionsEnum.parse(form.get('_action'));

  if (formAction === 'edit-stack') {
    const validatedForm = validateForm({
      schema: EditStackSchema,
      formData: form,
    });

    if (validatedForm.status === 'error') {
      return json({ status: 'error', formErrors: validatedForm.formErrors });
    }

    const { amount: amountInput, stackId, categoryId, label } = validatedForm.data;
    try {
      const amount = dollarsToCents(amountInput);
      await updateStack({ amount, stackId, categoryId, label });
    } catch (e) {
      return json({ status: 'error', errors: [{ message: ['There was a problem updating the stack'] }] });
    }

    return redirect('/budget');
  }

  if (formAction === 'delete-stack') {
    const validatedForm = validateForm<z.infer<typeof DeleteStackSchema>>({
      schema: DeleteStackSchema,
      formData: form,
    });
    if (validatedForm.status === 'error') {
      return json({ status: 'error', formErrors: validatedForm.formErrors }, { status: 400 });
    }
    try {
      await db.stack.delete({ where: { id: validatedForm.data.stackId } });
    } catch (e) {
      console.error(e);
      return json({ status: 'error', errors: [{ message: 'Unable to delete stack' }] }, { status: 500 });
    }
    return redirect('/budget');
  }

  return json({ status: 'error', errors: [{ message: 'Unsupported action' }] }, { status: 400 });
};

export default function StackId() {
  const actionData = useActionData<typeof action>();
  const formIsInError = actionData?.status === 'error';

  const { stack, categories } = useLoaderData<LoaderData>();
  const transition = useTransition();

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 md:relative p-5 md:p-0 bg-white">
      <h3 className="text-lg mb-3 divide-y-2 text-center">Edit Stack</h3>
      {formIsInError ? actionData?.errors?.map((err) => <ErrorText>{err.message}</ErrorText>) : null}
      <Form method="post" key={stack.id}>
        <input type="hidden" name="stackId" value={stack.id} />
        <div className="space-y-4">
          <div>
            <label htmlFor="label" className="mb-1">
              Stack{' '}
              {formIsInError && actionData?.formErrors?.fieldErrors?.label && (
                <ErrorText>{actionData.formErrors.fieldErrors.label[0]}</ErrorText>
              )}
            </label>
            <input type="text" required name="label" defaultValue={stack.label} />
          </div>
          <div>
            <label htmlFor="amount" className=" mb-1">
              Amount{' '}
              {formIsInError && actionData?.formErrors?.fieldErrors?.amount && (
                <ErrorText>{actionData.formErrors.fieldErrors.amount[0]}</ErrorText>
              )}
            </label>
            <input type="text" required name="amount" defaultValue={centsToDollars(stack.amount)} />
          </div>
          <div>
            <label htmlFor="categoryId" className="inline-block mb-1">
              Category
              {formIsInError && actionData?.formErrors?.fieldErrors?.categoryId && (
                <ErrorText>{actionData.formErrors.fieldErrors.categoryId[0]}</ErrorText>
              )}
            </label>
            <select name="categoryId" defaultValue={stack.stackCategoryId || -1} className="block w-full" required>
              {categories.map((cat) => (
                <option value={cat.id} key={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <fieldset disabled={transition.state !== 'idle'} className="flex flex-col items-center space-y-2">
            <Button name="_action" value="edit-stack" type="submit" variant="primary" className="w-full">
              {transition.state === 'submitting' ? 'Saving' : 'Save Stack'}
            </Button>
            <div className="flex justify-end space-x-1 w-full">
              <Link to="/budget" className="hover:no-underline hover:text-inherit focus:outline-none" tabIndex={-1}>
                <Button
                  variant="transparent"
                  className="bg-grey-light hover:bg-grey text-grey-darkest rounded inline-flex items-center"
                >
                  <XIcon className="h-4 w-4" />
                  <span>Cancel</span>
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

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <html lang="en">
      <head />
      <body>
        <ErrorText>{error.message || 'There was a problem loading stack.'}</ErrorText>
      </body>
    </html>
  );
}
