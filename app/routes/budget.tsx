import { LoaderFunction, ActionFunction, Form, useLoaderData, json, Outlet } from 'remix';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@reach/disclosure';
import { useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/outline';
import { User } from '@prisma/client';
import { resetServerContext } from 'react-beautiful-dnd';
import { Stack, StackCategory, Budget } from '.prisma/client';
import { db } from '~/utils/db.server';
import { createStack, requireAuthenticatedUser } from '~/utils/server/index.server';
import { ContentAction, ContentLayout, ContentMain } from '~/components/layout';
import { Button } from '~/components/button';
import { centsToDollars, dollarsToCents } from '~/utils/money-fns';
import { recalcToBeBudgeted } from '~/utils/server/budget.server';
import CategorizedStacks from '../components/categorized-stacks';

type IndexData = {
  user: User;
  categorized: (StackCategory & {
    Stack: Stack[];
  })[];
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

  return json({ success: true }, { status: 200 });
};

// https://remix.run/guides/routing#index-routes
export default function BudgetPage() {
  const data = useLoaderData<IndexData>();
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(false);

  return (
    <ContentLayout>
      <ContentMain>
        <div className="text-xl flex flex-col items-center">
          <h2>
            <span className="font-medium">${centsToDollars(data.budget.total)}</span>{' '}
            <span className="font-normal">in account</span>
          </h2>
          <h2>
            <span className="font-medium">${centsToDollars(data.budget.toBeBudgeted)}</span> to be budgeted
          </h2>
        </div>
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
        <CategorizedStacks categorized={data.categorized} />
        <Form method="post" id="add-stack-form" className="mt-5">
          <div className="flex justify-between space-x-4 items-center">
            <input type="text" name="new-stack" placeholder="New Stack Name" />
            <Button type="submit" className="whitespace-nowrap" name="_action" value="add-stack">
              Add Stack
            </Button>
          </div>
        </Form>
      </ContentMain>
      <ContentAction>
        <Outlet />
      </ContentAction>
    </ContentLayout>
  );
}
