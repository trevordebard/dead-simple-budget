import { LoaderFunction, ActionFunction, Form, useSubmit, useLoaderData, json, Outlet, Link } from 'remix';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@reach/disclosure';
import { useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/outline';
import { User } from '@prisma/client';
import { Stack, StackCategory, Budget } from '.prisma/client';
import { db } from '~/utils/db.server';
import { createStack, requireAuthenticatedUser } from '~/utils/server/index.server';
import { ContentAction, ContentLayout, ContentMain } from '~/components/layout';
import { Button } from '~/components/button';
import { centsToDollars, dollarsToCents } from '~/utils/money-fns';
import { recalcToBeBudgeted } from '~/utils/server/budget.server';

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
  const budget = await db.budget.findFirst({ where: { userId: user.id } });
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
  const submit = useSubmit();
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(false);

  return (
    <ContentLayout>
      <ContentMain>
        <div className="text-xl flex flex-col items-center">
          <Link to="/sort">sort</Link>
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
        {data.categorized.map((category) => (
          <div key={category.id}>
            <Link to={`/budget/stack-category/${category.id}`} className="text-lg">
              {category.label}
            </Link>
            {category.Stack.map((stack) => (
              <div key={stack.id} className="flex justify-between items-center ml-3 border-b ">
                <label htmlFor={stack.label}>{stack.label}</label>
                <div className="flex items-center space-x-3 py-2">
                  <Form method="post" id="stack-form">
                    <input type="hidden" name="_action" value="edit-stack" />
                    <input
                      type="text"
                      name={stack.label}
                      id={stack.id.toString()}
                      defaultValue={centsToDollars(stack.amount)}
                      className="text-right border-none max-w-xs w-32 hover:bg-gray-100 px-4"
                      onBlur={(e) => submit(e.currentTarget.form)}
                    />
                  </Form>
                  <Link to={`/budget/stack/${stack.id}`} className="text-gray-600">
                    edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ))}
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
