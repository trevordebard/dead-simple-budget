import { ActionArgs, json, LoaderArgs, TypedResponse } from '@remix-run/node';
import { Form, Outlet, useActionData, useLoaderData, useTransition } from '@remix-run/react';
import { useEffect, useRef } from 'react';
import * as Accordion from '@radix-ui/react-accordion';
import { resetServerContext } from 'react-beautiful-dnd';
import { PlusCircleIcon } from '@heroicons/react/outline';
import z, { ZodError } from 'zod';
import { db } from '~/lib/db.server';
import { ContentAction, ContentLayout, ContentMain } from '~/components/layout';
import { BudgetTotal, recalcToBeBudgeted } from '~/lib/modules/budget';
import {
  addCategory,
  CategorizedStacks,
  createCategoriesOptimistically,
  tCategorizedStacks,
} from '~/lib/modules/stack-categories';
import { requireAuthenticatedUser } from '~/lib/modules/user';
import { Button } from '~/components/button';
import { Prisma } from '@prisma/client';
import { ErrorText } from '~/components/error-text';
import { ActionResult } from '~/lib/utils/response-types';
import { createStack } from '~/lib/modules/stacks';
import { dollarsToCents } from '~/lib/modules/money';

export async function loader(args: LoaderArgs) {
  const user = await requireAuthenticatedUser(args.request);

  const budget = await db.budget.findFirst({
    where: { userId: user.id },
  });

  if (!budget) {
    throw Error('Unable to find budget');
  }

  const categorized = await db.stackCategory.findMany({
    where: { budget: { id: budget.id } },
    include: { Stack: true },
  });

  const spendingSummary = await db.transaction.groupBy({
    by: ['stackId'],
    where: { budgetId: budget.id },
    _sum: { amount: true },
  });

  const toBeBudgeted = getToBeBudgeted(categorized);

  if (!categorized || categorized.length < 1 || !user || !budget) {
    throw Error('hmm');
  }

  // Required for server rendering the drag and drop stack categories
  resetServerContext();

  return json({ categorized, user, budget, toBeBudgeted, spendingSummary });
}

const zPossibleActions = z.enum(['add-stack', 'add-category', 'edit-stack', 'update-total']);

export const action = async ({ request }: ActionArgs): Promise<TypedResponse<ActionResult>> => {
  await requireAuthenticatedUser(request);

  const formData = await request.formData();
  const rawAction = formData.get('_action');
  const parsedAction = zPossibleActions.safeParse(rawAction);

  if (!parsedAction.success) {
    return json({ errors: ['Unable to read data'] }, { status: 500 });
  }

  switch (parsedAction.data) {
    case 'add-category': {
      const resp = await addCategoryAction(formData);
      if (resp.status === 'error') {
        return json(resp, { status: 400 });
      }
      return json(resp);
    }
    case 'add-stack': {
      const response = await addStackAction(formData);
      if (response.status === 'error') {
        return json(response, { status: 500 });
      }
      return json(response);
    }
    case 'update-total': {
      const response = await updateTotalAction(formData);
      if (response.status === 'error') {
        return json(response, { status: 500 });
      }
      return json(response);
    }
    default: {
      const response = json({ status: 'error', errors: [{ message: 'Invalid action' }] }, { status: 400 });
      return response;
    }
  }
};

// https://remix.run/guides/routing#index-routes
export default function BudgetPage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const transition = useTransition();
  const isAddingStack = transition.submission && transition.submission.formData.get('_action') === 'add-stack';
  const addStackFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isAddingStack) {
      addStackFormRef?.current?.reset();
    }
  }, [isAddingStack]);

  if (!data.budget || !data.categorized) {
    return null;
  }

  return (
    <ContentLayout>
      <ContentMain>
        <BudgetTotal budget={data.budget} toBeBudgeted={data.toBeBudgeted.amount} />
        {actionData?.status === 'error' && actionData.errors
          ? actionData?.errors.map((msg) => <ErrorText>{msg.message}</ErrorText>)
          : null}
        <Accordion.Root type="single" collapsible>
          <Accordion.Item value="add-category-accordion">
            <Accordion.Header>
              <Accordion.Trigger>
                <div className="flex space-x-1 text-gray-900 hover:text-gray-600 items-center">
                  <PlusCircleIcon className="w-5 h-5" />
                  <p>Category</p>
                </div>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Accordion.Item value="add-category-form">
                <Form method="post" id="add-category-form">
                  <div className="flex justify-between space-x-4 items-center">
                    <input type="text" name="label" placeholder="New Category Name" />
                    <input type="hidden" name="budgetId" value={data.budget.id} />
                    <Button type="submit" variant="outline" className="border" name="_action" value="add-category">
                      Add
                    </Button>
                  </div>
                </Form>
              </Accordion.Item>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
        {isAddingStack ? (
          <CategorizedStacks
            categorized={createCategoriesOptimistically(data.categorized, transition.submission.formData)}
            spendingSummary={data.spendingSummary}
          />
        ) : (
          <CategorizedStacks categorized={data.categorized} spendingSummary={data.spendingSummary} />
        )}
        <Form method="post" id="add-stack-form" className="mt-5" ref={addStackFormRef}>
          <fieldset disabled={transition.state !== 'idle'} className="flex">
            <input type="hidden" name="budgetId" value={data.budget.id} />
            <input type="text" name="newStack" required placeholder="New Stack Name" className="mr-2" />
            <Button type="submit" className="whitespace-nowrap" name="_action" value="add-stack">
              Add Stack
            </Button>
          </fieldset>
        </Form>
      </ContentMain>
      <ContentAction>
        <Outlet />
      </ContentAction>
    </ContentLayout>
  );
}

const AddCategoryFormSchema = z.object({
  label: z.string(),
  budgetId: z.string(),
});

// function should return errors or formErrors
async function addCategoryAction(formData: FormData): Promise<ActionResult> {
  const body = Object.fromEntries(formData);
  try {
    const parsed = AddCategoryFormSchema.parse(body);
    const category = await addCategory({ budgetId: parsed.budgetId, label: parsed.label });
    return { status: 'success', data: category };
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        status: 'error',
        formErrors: err.flatten(),
      };
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        return { status: 'error', errors: [{ message: 'A category with that name already exists' }], formErrors: null };
      }
      return { status: 'error', errors: [{ message: 'An unexpected database error occurred' }], formErrors: null };
    }
    return {
      status: 'error',
      errors: [{ message: 'An unknown error occurred while creating stack category' }],
      formErrors: null,
    };
  }
}

function getToBeBudgeted(categorized: tCategorizedStacks) {
  const toBeBudgeted = categorized.find((c) => c.label === 'Hidden')?.Stack.find((s) => s.label === 'To Be Budgeted');
  if (!toBeBudgeted) {
    // Create it
    throw Error('This should not happen');
  }
  return toBeBudgeted;
}

const AddStackFormSchema = z.object({
  budgetId: z.string(),
  newStack: z.string(),
});
async function addStackAction(formData: FormData): Promise<ActionResult> {
  // TODO: verify stack id and budget id belong to authenticated user
  try {
    const body = Object.fromEntries(formData);
    const validatedForm = AddStackFormSchema.parse(body);
    const newStack = await createStack(validatedForm.budgetId, { label: validatedForm.newStack });

    return { status: 'success', data: newStack };
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        status: 'error',
        formErrors: err.flatten(),
      };
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        return { status: 'error', errors: [{ message: 'A category with that name already exists' }], formErrors: null };
      }
      return { status: 'error', errors: [{ message: 'An unexpected database error occurred' }], formErrors: null };
    }
    return {
      status: 'error',
      errors: [{ message: 'An unknown error occurred while creating stack' }],
      formErrors: null,
    };
  }
}

const UpdateTotalFormSchema = z.object({
  total: z.coerce.number(),
  budgetId: z.string(),
});

async function updateTotalAction(formData: FormData): Promise<ActionResult> {
  // TODO: verify stack id and budget id belong to authenticated user
  try {
    const body = Object.fromEntries(formData);
    const validatedForm = UpdateTotalFormSchema.parse(body);
    const { total, budgetId } = validatedForm;
    const newBudget = await db.budget.update({ where: { id: budgetId }, data: { total: dollarsToCents(total) } });

    // TODO: more side effects may be needed here?
    const recalcedBudget = await recalcToBeBudgeted({ budget: newBudget });
    return { status: 'success', data: recalcedBudget };
  } catch (err) {
    if (err instanceof ZodError) {
      return {
        status: 'error',
        formErrors: err.flatten(),
      };
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      if (err.code === 'P2002') {
        return { status: 'error', errors: [{ message: 'A category with that name already exists' }], formErrors: null };
      }
      return { status: 'error', errors: [{ message: 'An unexpected database error occurred' }], formErrors: null };
    }
    return {
      status: 'error',
      errors: [{ message: 'An unknown error occurred while creating stack' }],
      formErrors: null,
    };
  }
}
