import { Stack } from ".prisma/client";
import { ChangeEvent } from "react";
import { MetaFunction, LoaderFunction, ActionFunction, Form, useSubmit } from "remix";
import { useLoaderData, json, Outlet, Link } from "remix";
import { db } from "~/utils/db.server";

type IndexData = {
  stacks: Stack[]
};

// Loaders provide data to components and are only ever called on the server, so
// you can connect to a database or run any server side code you want right next
// to the component that renders it.
// https://remix.run/api/conventions#loader
export let loader: LoaderFunction = async () => {
  const stacks = await db.stack.findMany({ where: { user: { email: 'trevordebard@gmail.com' } } })


  // https://remix.run/api/remix#json
  return json({ stacks });
};

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: "Remix Starter",
    description: "Welcome to remix!"
  };
};

export let action: ActionFunction = async ({ request }) => {
  let form = await request.formData();
  console.log(form.entries())
  console.log(form)
  const input = form.forEach(async (value, key) => {
    await db.stack.update({ where: { label_userId: { label: key, userId: 'ckw4acmxk00126mw2qp8polop' } }, data: { amount: Number(value) } })
    console.log('value: ' + value + "; key: " + key)
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
        <h2 className="text-blue-600 text-xl">Dead Simple Budget</h2>
        <div>
          <Form method="post" id="stack-form">
            <div className="divide-y divide-gray-300">
              {data.stacks.map((stack, i) => (
                <div className="flex justify-between items-center p-4" key={i}>
                  <label htmlFor={stack.label}>
                    {stack.label}
                  </label>
                  <div className="flex items-center space-x-3">
                    <input type="text" name={stack.label} id={stack.id.toString()} defaultValue={stack.amount} className="text-right border-0 rounded-md max-w-xs hover:bg-gray-100 py-6" onBlur={e => submit(e.currentTarget.form)} />
                    <Link to={`/budget/stack/${stack.id}`} className="text-gray-600">edit</Link>
                  </div>
                </div>
              ))
              }
            </div>
          </Form>
        </div>
      </main>
      <aside>
        <Outlet />
      </aside>

    </div>
  );
}
