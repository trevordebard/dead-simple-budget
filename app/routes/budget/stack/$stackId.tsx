import { Stack, StackCategory } from ".prisma/client";
import { Form, useLoaderData, LoaderFunction, ActionFunction } from "remix";
import { db } from "~/utils/db.server";


interface LoaderData {
  stack: Stack & {
    category: StackCategory | null;
  };
  categories: StackCategory[]
}
export let loader: LoaderFunction = async ({ params }) => {
  const stack = await db.stack.findUnique({ where: { id: Number(params.stackId) }, include: { category: true } })
  const categories = await db.stackCategory.findMany({ where: { userId: 'ckw4acmxk00126mw2qp8polop' } })
  if (!stack) {
    throw Error('Stack not found!')
  }
  return { stack, categories };
};

export let action: ActionFunction = async ({ request, params }) => {
  let form = await request.formData();
  let label = String(form.get('label'))
  let amount = Number(form.get('amount'))
  let categoryId = Number(form.get('category'))

  await db.stack.update({ where: { id: Number(params.stackId) }, data: { amount, label, stackCategoryId: categoryId } })

  return null;
};

export default function StackId() {
  const { stack, categories } = useLoaderData<LoaderData>()
  return (
    <Form method="post">
      <div className="space-y-4">
        <div>
          <label htmlFor="label">Stack</label>
          <input type="text" name="label" defaultValue={stack.label} />
        </div>
        <div>
          <label htmlFor="amount">Amount</label>
          <input type="text" name="amount" defaultValue={stack.amount} />
        </div>
        <div>
          <label htmlFor="catgory">Category</label>
          <select name="category" defaultValue={stack.stackCategoryId || -1}>
            {categories.map(cat => <option value={cat.id} key={cat.id}>{cat.category}</option>)}
          </select>
        </div>
        <input type="submit" value="Submit" className="rounded-md cursor-pointer px-4 py-2 bg-blue-500 text-blue-100 hover:bg-blue-600" />
      </div>
    </Form >
  )
}
