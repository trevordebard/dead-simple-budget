import { ActionFunction, json, LoaderArgs } from '@remix-run/node';
import { Form, Outlet, useLoaderData, useTransition } from '@remix-run/react';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@reach/disclosure';
import { useEffect, useRef, useState } from 'react';
import { resetServerContext } from 'react-beautiful-dnd';
import { PlusCircleIcon } from '@heroicons/react/outline';
import z from 'zod';
import { db } from '~/utils/db.server';
import { createStack } from '~/utils/server/index.server';
import { ContentAction, ContentLayout, ContentMain } from '~/components/layout';
import { Button } from '~/components/button';
import { recalcToBeBudgeted } from '~/utils/server/budget.server';
import CategorizedStacks from '../components/categorized-stacks';
import { requireAuthenticatedUser } from '~/utils/server/user-utils.server';
import { BudgetTotal } from '~/components/budget-total';
import { dollarsToCents } from '~/utils/money-fns';
import { createCategoriesOptimistically } from '~/utils/ui/stack-categories';

export async function loader(args: LoaderArgs) {
  const user = await requireAuthenticatedUser(args.request);
  const categorized = await db.stackCategory.findMany({
    where: { budget: { user: { id: user.id } } },
    include: { Stack: true },
  });
  const budget = await db.budget.findFirst({
    where: { userId: user.id },
    include: { stackCategories: { include: { Stack: true } } },
  });

  if (!categorized || categorized.length < 1) {
    throw Error('hmm');
  }

  // Required for server rendering the drag and drop stack categories
  resetServerContext();

  return json({ categorized, user, budget });
}

const zPossibleActions = z.enum(['add-stack', 'add-category', 'edit-stack', 'update-total']);

export const action: ActionFunction = async ({ request }) => {
  const user = await requireAuthenticatedUser(request);
  const budget = await db.budget.findFirst({ where: { userId: user.id } });

  if (!budget) {
    throw Error('TODO');
  }

  const formData = await request.formData();
  const rawAction = formData.get('_action');
  const parsedAction = zPossibleActions.safeParse(rawAction);

  if (!parsedAction.success) {
    throw Error('TODO');
  }

  switch (parsedAction.data) {
    case 'add-category':
      addCategoryAction(formData);
      break;
    case 'add-stack':
      addStackAction(formData);
      break;
    case 'edit-stack':
      editStackAction(formData);
      break;
    case 'update-total':
      updateTotalAction(formData);
      break;
    default:
      console.error('this should not happen');
  }

  return json({ success: true }, { status: 200 });
};

// https://remix.run/guides/routing#index-routes
export default function BudgetPage() {
  const data = useLoaderData<typeof loader>();
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(false);
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
        <BudgetTotal budget={data.budget} />
        <Disclosure open={isDisclosureOpen} onChange={() => setIsDisclosureOpen(!isDisclosureOpen)}>
          <div className="py-2">
            <DisclosureButton className="outline-none text-left w-full">
              <div className="flex space-x-1 text-gray-900 hover:text-gray-600 items-center">
                <PlusCircleIcon className="w-5 h-5" />
                <p>Category</p>
              </div>
            </DisclosureButton>
            <DisclosurePanel>
              <Form method="post" id="add-category-form">
                <div className="flex justify-between space-x-4 items-center">
                  <input type="text" name="new-category" placeholder="New Category Name" />
                  <input type="hidden" name="budgetId" value={data.budget.id} />
                  <Button type="submit" variant="outline" className="border" name="_action" value="add-category">
                    Add
                  </Button>
                </div>
              </Form>
            </DisclosurePanel>
          </div>
        </Disclosure>
        {isAddingStack ? (
          <CategorizedStacks
            categorized={createCategoriesOptimistically(data.categorized, transition.submission.formData)}
          />
        ) : (
          <CategorizedStacks categorized={data.categorized} />
        )}
        <Form method="post" id="add-stack-form" className="mt-5" ref={addStackFormRef}>
          <fieldset disabled={transition.state !== 'idle'} className="flex">
            <input type="hidden" name="budgetId" value={data.budget.id} />
            <input type="text" name="new-stack" required placeholder="New Stack Name" className="mr-2" />
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

async function addStackAction(formData: FormData) {
  // TODO: verify stack id and budget id belong to authenticated user
  const budgetId = formData.get('budgetId') as string;
  const label = String(formData.get('new-stack'));
  const newStack = await createStack(budgetId, { label });
  return newStack;
}

async function updateTotalAction(formData: FormData) {
  // TODO: verify stack id and budget id belong to authenticated user
  const total = Number(formData.get('total'));
  const budgetId = formData.get('budgetId') as string;

  const newBudget = await db.budget.update({ where: { id: budgetId }, data: { total: dollarsToCents(total) } });
  const recalcedBudget = await recalcToBeBudgeted({ budget: newBudget });
  return recalcedBudget;
}

async function editStackAction(formData: FormData) {
  // TODO: verify stack id and budget id belong to authenticated user
  const amount = formData.get('amount') as string;
  const stackId = formData.get('stackId') as string;
  const budgetId = formData.get('budgetId') as string;
  // Loop through form data because input elements will have different keys

  await db.stack.update({
    where: { id: stackId },
    data: { amount: dollarsToCents(amount) },
  });

  await recalcToBeBudgeted({ budgetId });
}

async function addCategoryAction(formData: FormData) {
  const label = String(formData.get('new-category'));
  const budgetId = formData.get('budgetId') as string;

  const newCategory = await db.stackCategory.create({ data: { label, budgetId } });
  return newCategory;
}
