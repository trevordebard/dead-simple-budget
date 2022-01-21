import { Outlet, LoaderFunction, useLoaderData, Form, ActionFunction, Link } from 'remix';
import { useState } from 'react';
import { DateTime } from 'luxon';
import { Stack, Transaction } from '.prisma/client';
import { ContentAction, ContentLayout, ContentMain } from '~/components/layout';
import { db } from '~/utils/db.server';
import { requireAuthenticatedUser } from '~/utils/server/index.server';
import { centsToDollars } from '~/utils/money-fns';

type LoaderData = {
  transactions: (Transaction & {
    stack: Stack | null;
  })[];
};
export const loader: LoaderFunction = async ({ request }): Promise<LoaderData> => {
  const user = await requireAuthenticatedUser(request);
  const budget = await db.budget.findFirst({ where: { userId: user.id } });

  if (!budget) {
    throw Error('TODO');
  }

  const transactions = await db.transaction.findMany({ where: { budgetId: budget.id }, include: { stack: true } });
  return { transactions };
};

export default function TransactionsPage() {
  const { transactions } = useLoaderData<LoaderData>();
  return (
    <ContentLayout>
      <ContentMain>
        <div className="flex flex-col">
          {transactions.map((t) => (
            <Link
              to={`${t.id}`}
              key={t.id}
              className="hover:no-underline hover:text-inherit focus:outline-none focus:bg-gray-200"
            >
              <TransactionCard transaction={t} />
            </Link>
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
  transaction: Transaction & {
    stack: Stack | null;
  };
};

export function TransactionCard({ transaction }: iTransactionCardProps) {
  const { description, amount, stack, date } = transaction;
  return (
    <div className="flex justify-between p-2 border-b hover:bg-slate-100">
      <div>
        <p className="">{description}</p>
        <p className="text-zinc-600">{stack?.label}</p>
      </div>
      <div>
        <p className="text-right">${centsToDollars(amount)}</p>
        <p className="text-zinc-600">{DateTime.fromISO(String(date)).toFormat('yyyy-MM-dd')}</p>
      </div>
    </div>
  );
}

export function EditableTransactionCard({ transaction }: iTransactionCardProps) {
  const { description, amount, stack } = transaction;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  return (
    <Form method="post" className="border-b hover:bg-slate-100 md:py-2" onFocus={() => setIsEditing(true)}>
      <input type="hidden" value={transaction.id} name="transaction-id" />
      <div className="flex justify-between">
        <div className="flex flex-col">
          <input
            name="description"
            defaultValue={description}
            className="bg-transparent hover:bg-slate-300 p-2 rounded-md"
          />
          <input name="stack" defaultValue={stack} className="bg-transparent hover:bg-slate-300 p-2 rounded-md" />
        </div>
        <div className="text-right flex flex-col">
          <input name="amount" defaultValue={amount} className="bg-transparent hover:bg-slate-300 p-2 rounded-md" />
          <input name="amount" defaultValue="2021-12-13" className="bg-transparent hover:bg-slate-300 p-2 rounded-md" />
        </div>
      </div>
      {isEditing ? (
        <button
          type="submit"
          className="flex items-center justify-center px-2 py-1 text-sm border border-gray-300 rounded-lg hover:border-green-600 hover:bg-green-100 focus:border-green-500"
        >
          Save
        </button>
      ) : null}
    </Form>
  );
}
