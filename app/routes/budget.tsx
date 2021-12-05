import { Stack, StackCategory } from ".prisma/client";
import { MetaFunction, LoaderFunction, ActionFunction, Form, useSubmit } from "remix";
import { useLoaderData, json, Outlet, Link } from "remix";
import { db } from "~/utils/db.server";
import { createStack, getAuthenticatedUser } from "~/utils/server";

type IndexData = {
  stacks: Stack[],
  categorized: (StackCategory & {
    Stack: Stack[];
  })[]
};

export let loader: LoaderFunction = async ({ request }) => {
  const user = await getAuthenticatedUser(request);
  const categorized = await db.stackCategory.findMany({ where: { budget: { user: { id: user.id } } }, include: { Stack: true } })
  return json({ categorized });
};

export let meta: MetaFunction = () => {
  return {
    title: "Dead Simple Budget",
    description: "Budget home page"
  };
};

export let action: ActionFunction = async ({ request }) => {
  const user = await getAuthenticatedUser(request)

  let formData = await request.formData();
  const isAddStackForm = formData.has('new-stack-label')

  if (isAddStackForm) {
    const label = String(formData.get('new-stack-label'));
    const newStack = await createStack(user, { label })
    return newStack
  }
  const input = formData.forEach(async (value, key) => {
    await db.stack.update({ where: { label_budgetId: { budgetId: user.Budget.id, label: key } }, data: { amount: Number(value) } })
  })

  return null;
};

// https://remix.run/guides/routing#index-routes
export default function Index() {
  let data = useLoaderData<IndexData>();
  let submit = useSubmit();
  return (
    <div className="remix__page">
      <main>
        <h2 className="text-purple-600 text-xl">Dead Simple Budget</h2>
        <div>
          <Form method="post" id="stack-form">
            <div>
              {data.categorized.map(category => (
                <div key={category.id}>
                  <h3 className="text-lg">{category.label}</h3>
                  {category.Stack.map(stack => (
                    <div key={stack.id} className="flex justify-between items-center ml-3 border-b ">
                      <label htmlFor={stack.label}>
                        {stack.label}
                      </label>
                      <div className="flex items-center space-x-3">
                        <input type="text" name={stack.label} id={stack.id.toString()} defaultValue={stack.amount} className="text-right border-0 rounded-md max-w-xs hover:bg-gray-100 py-6" onBlur={e => submit(e.currentTarget.form)} />
                        <Link to={`/budget/stack/${stack.id}`} className="text-gray-600">edit</Link>
                      </div>
                    </div>))}
                </div>
              ))}

            </div>
          </Form>
          <Form method="post" id="add-stack-form">
            <div className="flex justify-between space-x-4 items-center">
              <input type="text" name="new-stack-label" placeholder="New Stack Name" />
              <input type="submit" defaultValue="Submit" className="rounded-md cursor-pointer px-4 py-2 bg-blue-500 text-blue-100 hover:bg-blue-600" />
            </div>
          </Form>
        </div>
      </main>
      <aside>
        <Outlet />
      </aside>
      <form action="/logout" method="post">
        <button>Logout</button>
      </form>
    </div>
  );
}
