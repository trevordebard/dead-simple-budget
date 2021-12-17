import {
  MetaFunction,
  LoaderFunction,
  ActionFunction,
  Form,
  useSubmit,
  useLoaderData,
  json,
  Outlet,
  Link,
} from 'remix';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@reach/disclosure';
import { useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/outline';
import { Stack, StackCategory } from '.prisma/client';
import { db } from '~/utils/db.server';
import { createStack, requireAuthenticatedUser } from '~/utils/server/index.server';
import { AuthenticatedUser } from '~/types/user';
import { ContentAction, ContentLayout, ContentMain } from '~/components/layout';

type IndexData = {
  user: AuthenticatedUser;
  categorized: (StackCategory & {
    Stack: Stack[];
  })[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireAuthenticatedUser(request);
  const categorized = await db.stackCategory.findMany({
    where: { budget: { user: { id: user.id } } },
    include: { Stack: true },
  });
  return json({ categorized, user });
};

export const meta: MetaFunction = () => {
  return {
    title: 'Dead Simple Budget',
    description: 'Budget homepage',
  };
};

export const action: ActionFunction = async ({ request }) => {
  const user = await requireAuthenticatedUser(request);

  const formData = await request.formData();
  const isAddStackForm = formData.has('new-stack');
  const isAddCategoryForm = formData.has('new-category');

  if (isAddStackForm) {
    const label = String(formData.get('new-stack'));
    const newStack = await createStack(user, { label });
    return newStack;
  }
  if (isAddCategoryForm) {
    const label = String(formData.get('new-category'));
    const newCategory = await db.stackCategory.create({ data: { label, budgetId: user.Budget.id } });
    return newCategory;
  }
  const input = formData.forEach(async (value, key) => {
    await db.stack.update({
      where: { label_budgetId: { budgetId: user.Budget.id, label: key } },
      data: { amount: Number(value) },
    });
  });

  return null;
};

// https://remix.run/guides/routing#index-routes
export default function Budget() {
  const data = useLoaderData<IndexData>();
  const submit = useSubmit();
  const [isDisclosureOpen, setIsDisclosureOpen] = useState(false);

  return (
    <ContentLayout>
      <ContentMain>
        <div className="text-xl flex flex-col items-center">
          <h2>
            <span className="font-medium">${data.user.Budget.total}</span>{' '}
            <span className="font-normal">in account</span>
          </h2>
          <h2>
            <span className="font-medium">${data.user.Budget.toBeBudgeted}</span> to be budgeted
          </h2>
        </div>
        <Disclosure open={isDisclosureOpen} onChange={() => setIsDisclosureOpen(!isDisclosureOpen)}>
          <div className="py-2">
            <DisclosureButton className="outline-none text-left w-full">
              <div className="flex space-x-1 text-gray-900 hover:text-gray-600 items-center">
                <PlusCircleIcon className="w-5 h-5" />
                <p>Cateogry</p>
              </div>
            </DisclosureButton>
            <DisclosurePanel>
              <Form method="post" id="add-category-form">
                <div className="flex justify-between space-x-4 items-center">
                  <input
                    type="text"
                    name="new-category"
                    placeholder="New Category Name"
                    className="rounded-md border-gray-400 py-4"
                  />
                  <input
                    type="submit"
                    value="Add"
                    className="rounded-md cursor-pointer px-4 py-1 border border-gray-700 text-gray-700 hover:bg-gray-600 hover:text-gray-100"
                  />
                </div>
              </Form>
            </DisclosurePanel>
          </div>
        </Disclosure>
        <Form method="post" id="stack-form">
          {data.categorized.map((category) => (
            <div key={category.id}>
              <Link to={`/budget/stack-category/${category.id}`} className="text-lg">
                {category.label}
              </Link>
              {category.Stack.map((stack) => (
                <div key={stack.id} className="flex justify-between items-center ml-3 border-b ">
                  <label htmlFor={stack.label}>{stack.label}</label>
                  <div className="flex items-center space-x-3 py-2">
                    <input
                      type="text"
                      name={stack.label}
                      id={stack.id.toString()}
                      defaultValue={stack.amount}
                      className="text-right border-0 rounded-md max-w-xs w-32 hover:bg-gray-100 py-5 px-4"
                      onBlur={(e) => submit(e.currentTarget.form)}
                    />
                    <Link to={`/budget/stack/${stack.id}`} className="text-gray-600">
                      edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </Form>
        <Form method="post" id="add-stack-form" className="mt-5">
          <div className="flex justify-between space-x-4 items-center">
            <input
              type="text"
              name="new-stack"
              placeholder="New Stack Name"
              className="rounded-md border-gray-400 py-5"
            />
            <input
              type="submit"
              value="Add Stack"
              className="rounded-md cursor-pointer px-4 py-2 bg-gray-700 text-gray-50 hover:bg-gray-600 font-normal"
            />
          </div>
        </Form>
      </ContentMain>
      <ContentAction>
        <Outlet />
      </ContentAction>
    </ContentLayout>
  );
}
