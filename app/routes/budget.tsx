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
import { Stack, StackCategory } from '.prisma/client';
import { Nav } from '~/components/nav';
import { AuthenticatedUser } from '~/types/user';
import { db } from '~/utils/db.server';
import { createStack, requireAuthenticatedUser } from '~/utils/server';

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
export default function Index() {
  const data = useLoaderData<IndexData>();
  const submit = useSubmit();
  return (
    <div>
      <Nav user={data.user} />
      <div className="grid grid-cols-2 gap-14">
        <main>
          <Form method="post" id="stack-form">
            <div>
              {data.categorized.map((category) => (
                <div key={category.id}>
                  <h3 className="text-lg">{category.label}</h3>
                  {category.Stack.map((stack) => (
                    <div key={stack.id} className="flex justify-between items-center ml-3 border-b ">
                      <label htmlFor={stack.label}>{stack.label}</label>
                      <div className="flex items-center space-x-3">
                        <input
                          type="text"
                          name={stack.label}
                          id={stack.id.toString()}
                          defaultValue={stack.amount}
                          className="text-right border-0 rounded-md max-w-xs hover:bg-gray-100 py-6 px-4"
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
            </div>
          </Form>
          <Form method="post" id="add-stack-form">
            <div className="flex justify-between space-x-4 items-center">
              <input type="text" name="new-stack" placeholder="New Stack Name" />
              <input
                type="submit"
                defaultValue="Submit"
                className="rounded-md cursor-pointer px-4 py-2 bg-blue-500 text-blue-100 hover:bg-blue-600"
              />
            </div>
          </Form>
          <Form method="post" id="add-category-form">
            <div className="flex justify-between space-x-4 items-center">
              <input type="text" name="new-category" placeholder="New Category Name" />
              <input
                type="submit"
                defaultValue="Submit"
                className="rounded-md cursor-pointer px-4 py-2 bg-blue-500 text-blue-100 hover:bg-blue-600"
              />
            </div>
          </Form>
        </main>
        <aside>
          <Outlet />
        </aside>
      </div>
    </div>
  );
}
