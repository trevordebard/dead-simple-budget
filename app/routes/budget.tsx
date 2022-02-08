import { LoaderFunction, ActionFunction, Form, useLoaderData, json, Outlet, useTransition } from 'remix';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@reach/disclosure';
import { useEffect, useRef, useState } from 'react';
import { User } from '@prisma/client';
import { resetServerContext } from 'react-beautiful-dnd';
import { PlusCircleIcon } from '@heroicons/react/outline';
import { Stack, Budget } from '.prisma/client';
import { db } from '~/utils/db.server';
import { createStack } from '~/utils/server/index.server';
import { ContentAction, ContentLayout, ContentMain } from '~/components/layout';
import { Button } from '~/components/button';
import { recalcToBeBudgeted } from '~/utils/server/budget.server';
import CategorizedStacks, { CategoryWithStack } from '../components/categorized-stacks';
import { requireAuthenticatedUser } from '~/utils/server/user-utils.server';
import { BudgetTotal } from '~/components/budget-total';
import { dollarsToCents } from '~/utils/money-fns';
import { createCategoriesOptimistically } from '~/utils/ui/stack-categories';

type IndexData = {
  user: User;
  categorized: CategoryWithStack[];
  budget: Budget;
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireAuthenticatedUser(request);
  const categorized = await db.stackCategory.findMany({
    where: { budget: { user: { id: user.id } } },
    include: { Stack: true },
  });
  const budget = await db.budget.findFirst({
    where: { userId: user.id },
    include: { stackCategories: { include: { Stack: true } } },
  });

  // Required for server rendering the drag and drop stack categories
  resetServerContext();

  return json({ categorized, user, budget });
};

export const action: ActionFunction = async ({ request }) => {
  const user = await requireAuthenticatedUser(request);
  const budget = await db.budget.findFirst({ where: { userId: user.id } });

  if (!budget) {
    throw Error('TODO');
  }

  const formData = await request.formData();

  if (formData.get('_action') === 'add-stack') {
    const label = String(formData.get('new-stack'));
    const newStack = await createStack(user, { label });
    return newStack;
  }

  if (formData.get('_action') === 'add-category') {
    const label = String(formData.get('new-category'));
    const newCategory = await db.stackCategory.create({ data: { label, budgetId: budget.id } });
    return newCategory;
  }

  // Edit stack amount
  if (formData.get('_action') === 'edit-stack') {
    // Action input is no longer needed
    formData.delete('_action');

    // Use array of promises to increase efficiency and avoid using await in a forEach loop,
    // which would cause recalcToBeBudgeted to be run prior to stack update completion
    const promises: Promise<Stack>[] = [];
    formData.forEach((value, key) => {
      promises.push(
        db.stack.update({
          where: { label_budgetId: { budgetId: budget.id, label: key } },
          data: { amount: dollarsToCents(value) },
        })
      );
    });

    try {
      await Promise.all(promises);
    } catch (e) {
      console.log('error??');
    }

    await recalcToBeBudgeted({ budgetId: budget.id });
  }
  if (formData.get('_action') === 'update-total') {
    const total = Number(formData.get('total'));

    const newBudget = await db.budget.update({ where: { id: budget.id }, data: { total: dollarsToCents(total) } });
    const recalcedBudget = await recalcToBeBudgeted({ budget: newBudget });
    return recalcedBudget;
  }

  return json({ success: true }, { status: 200 });
};

// https://remix.run/guides/routing#index-routes
export default function BudgetPage() {
  const data = useLoaderData<IndexData>();
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(false);
  const transition = useTransition();
  const isAddingStack = transition.submission && transition.submission.formData.get('_action') === 'add-stack';
  const addStackFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isAddingStack) {
      addStackFormRef?.current?.reset();
    }
  }, [isAddingStack]);

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
          <fieldset disabled={transition.state !== 'idle'} className="flex justify-between space-x-4 items-center">
            <input type="text" name="new-stack" required placeholder="New Stack Name" />
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
