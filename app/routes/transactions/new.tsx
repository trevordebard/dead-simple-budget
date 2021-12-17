import { ActionFunction, Form } from 'remix';
import { db } from '~/utils/db.server';
import { requireAuthenticatedUser } from '~/utils/server/index.server';

// TODO: error handling
// TODO: budget side effects
export const action: ActionFunction = async ({ request }) => {
  const user = await requireAuthenticatedUser(request);
  const formData = await request.formData();

  const description = String(formData.get('description'));
  const amount = Number(formData.get('amount'));
  const stack = String(formData.get('stack'));
  const type = String(formData.get('trans-type'));

  if (!amount || !stack || !description || !type) {
    throw Error('TODO');
  }

  const create = await db.transaction.create({
    data: { description, amount, stack, budgetId: user.Budget.id, date: new Date(), type },
  });
  return create;
};

export default function NewTransaction() {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 md:relative bg-white p-5 md:p-0">
      <Form method="post">
        <label htmlFor="description">Description</label>
        <input type="text" name="description" id="description-input" />
        <label htmlFor="amount">Amount</label>
        <input type="text" name="amount" id="amount-input" />
        <label htmlFor="stack">Stack</label>
        <input type="text" name="stack" id="stack-input" />
        <div className="flex justify-between">
          <div>
            <input id="deposit" value="deposit" type="radio" name="trans-type" />
            <label htmlFor="deposit">Deposit</label>
          </div>
          <div>
            <input id="withdrawal" value="withdrawal" type="radio" name="trans-type" />
            <label htmlFor="withdrawal">Withdrawal</label>
          </div>
        </div>
        <input
          type="submit"
          className="rounded-md cursor-pointer px-4 py-2 bg-gray-700 text-gray-50 hover:bg-gray-600 font-normal"
          value="Add"
        />
      </Form>
    </div>
  );
}
