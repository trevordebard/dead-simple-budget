import {
  Form,
  useLoaderData,
  LoaderFunction,
  ActionFunction,
  redirect,
  Link,
  useTransition,
  json,
  useActionData,
} from 'remix';
import { TrashIcon, XIcon } from '@heroicons/react/solid';
import { z, ZodError } from 'zod';
import { Stack, StackCategory } from '.prisma/client';
import { db } from '~/utils/db.server';
import { Button } from '~/components/button';
import { centsToDollars, dollarsToCents } from '~/utils/money-fns';
import { requireAuthenticatedUser } from '~/utils/server/user-utils.server';
import { updateStack } from '~/utils/server/stack.server';
import { ErrorText } from '~/components/error-text';

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

type ActionData = {
  success: boolean;
  formErrors?: string[];
  fieldErrors?: {
    [k: string]: string[];
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

const deleteStackSchema = z.object({
  stackId: z.string(),
});

const saveStackSchema = z.object({
  stackId: z.string().nonempty(),
  label: z.string().nonempty(),
  amount: z.preprocess((num) => parseFloat(z.string().nonempty().parse(num).replace(',', '')), z.number()), // strip commas and convert to number
  categoryId: z.string().nonempty(),
});

// TODO: verify the stacks being modified belong to the logged in user
export const action: ActionFunction = async ({ request, params }) => {
  const form = await request.formData();

  const PossibleActionsEnum = z.enum(['save-stack', 'delete-stack']);
  type StackIdAction = z.infer<typeof PossibleActionsEnum>;

  const formAction: StackIdAction = PossibleActionsEnum.parse(form.get('_action'));

  if (formAction === 'save-stack') {
    try {
      const {
        amount: amountInput,
        stackId,
        categoryId,
        label,
      } = saveStackSchema.parse({
        label: form.get('label'),
        stackId: form.get('stackId'),
        amount: form.get('amount'),
        categoryId: form.get('categoryId'),
      });
      const amount = dollarsToCents(amountInput);
      await updateStack({ amount, stackId, categoryId, label });
    } catch (e) {
      if (e instanceof ZodError) {
        return badRequest({ ...e.flatten(), success: false });
      }
      throw e;
    }

    return redirect('/budget');
  }

  if (formAction === 'delete-stack') {
    try {
      const { stackId } = deleteStackSchema.parse(form);
      if (stackId !== params.stackId) {
        return badRequest({ formErrors: ['Stack IDs do not match.'], success: false });
      }
      await db.stack.delete({ where: { id: stackId } });
      return redirect('/budget');
    } catch (e) {
      if (e instanceof ZodError) {
        return badRequest({
          formErrors: ['Unable to delete stack.', ...e.flatten().formErrors],
          fieldErrors: e.flatten().fieldErrors,
          success: false,
        });
      }
      throw e;
    }
  }
  return null;
};

export default function StackId() {
  const actionData = useActionData<ActionData>();
  const { stack, categories } = useLoaderData<LoaderData>();
  const transition = useTransition();
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 md:relative bg-white p-5 md:p-0">
      <h3 className="text-lg mb-3 divide-y-2 text-center">Edit Stack</h3>
      <Form method="post" key={stack.id}>
        {actionData?.formErrors?.map((message) => (
          <ErrorText>{message}</ErrorText>
        ))}
        <input type="hidden" name="stackId" value={stack.id} />
        <div className="space-y-4">
          <div>
            <label htmlFor="label" className="mb-1">
              Stack {actionData?.fieldErrors?.label && <ErrorText>{actionData.fieldErrors.label[0]}</ErrorText>}
            </label>
            <input type="text" name="label" defaultValue={stack.label} />
          </div>
          <div>
            <label htmlFor="amount" className=" mb-1">
              Amount {actionData?.fieldErrors?.amount && <ErrorText>{actionData.fieldErrors.amount[0]}</ErrorText>}
            </label>
            <input type="text" name="amount" defaultValue={centsToDollars(stack.amount)} />
          </div>
          <div>
            <label htmlFor="categoryId" className="inline-block mb-1">
              Category
              {actionData?.fieldErrors?.categoryId && <ErrorText>{actionData.fieldErrors.categoryId[0]}</ErrorText>}
            </label>
            <select name="categoryId" defaultValue={stack.stackCategoryId || -1} className="block w-full">
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
