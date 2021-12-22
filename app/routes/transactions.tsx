import { Outlet, LoaderFunction, useLoaderData, Form, ActionFunction } from 'remix';
import CheckIcon from '@heroicons/react/solid/CheckIcon';
import { Transaction } from '.prisma/client';
import { ContentAction, ContentLayout, ContentMain } from '~/components/layout';
import { db } from '~/utils/db.server';
import { requireAuthenticatedUser } from '~/utils/server/index.server';

type LoaderData = {
  transactions: Transaction[];
};
export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
  const user = await requireAuthenticatedUser(request);
  const transactions = await db.transaction.findMany({ where: { budgetId: user.Budget.id } });
  return { transactions };
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const description = String(formData.get('description'));
  const stack = String(formData.get('stack'));
  const transactionId = Number(formData.get('transaction-id'));

  const trnsactionRes = await db.transaction.update({ where: { id: transactionId }, data: { stack, description } });
  return null;
};

export default function Transctions() {
  const { transactions } = useLoaderData<LoaderData>();
  return (
    <ContentLayout>
      <ContentMain>
        <div className="flex flex-col items-center">
          {transactions.map((t) => (
            <TransactionCard transaction={t} key={t.id} />
          ))}
        </div>
      </ContentMain>
      <ContentAction>
        <Outlet />
      </ContentAction>
    </ContentLayout>
  );
}

type iTransactionCardProps = {
  transaction: Transaction;
};

export function TransactionCard({ transaction }: iTransactionCardProps) {
  const { description, amount, stack } = transaction;

  return (
    <Form method="post" className="flex justify-between w-full border-b p-1 hover:bg-slate-100">
      <input type="hidden" value={transaction.id} name="transaction-id" />
      {/* <div className="flex items-center"> */}
      {/* <input
          type="checkbox"
          // disabled={date.toLowerCase() === 'pending'}
          onChange={() => {
            // do nothing
          }}
        /> */}
      <div className="mx-4">
        <input name="description" defaultValue={description} className="bg-transparent hover:bg-slate-300 px-3 py-2" />
        <input name="stack" defaultValue={stack} className="bg-transparent hover:bg-slate-300 px-3 py-2" />
      </div>
      {/* </div> */}
      <div className="flex items-center space-x-4">
        <div className="text-right w-52">
          <p>{amount}</p>
          <p>2021-12-09</p>
        </div>
        <button type="submit" className="p-0 h-min">
          <CheckIcon className="h-5 w-5 text-blue-500" />
        </button>
        {/* <input type="submit" value="Save" className="bg-slate-400 px-8" /> */}
      </div>
    </Form>
  );
}
