import { LoaderArgs } from '@remix-run/node';
import { DateTime } from 'luxon';
import { CurrencyDollarIcon } from '@heroicons/react/outline';
import { typedjson, useTypedLoaderData } from 'remix-typedjson';
import { Link, Outlet } from '@remix-run/react';
import { Stack, Transaction } from '.prisma/client';
import { ContentAction, ContentLayout, ContentMain } from '~/components/layout';
import { db } from '~/lib/db.server';
import { centsToDollars } from '~/lib/modules/money/money-utils';

import { requireAuthenticatedUser } from '~/lib/modules/user/utils/user.server';

export async function loader({ request }: LoaderArgs) {
  const user = await requireAuthenticatedUser(request);
  const budget = await db.budget.findFirst({ where: { userId: user.id } });

  if (!budget) {
    throw Error('TODO');
  }

  const transactions = await db.transaction.findMany({ where: { budgetId: budget.id }, include: { stack: true } });
  return typedjson({ transactions });
}

export default function TransactionsPage() {
  const { transactions } = useTypedLoaderData<typeof loader>();

  return (
    <ContentLayout>
      <ContentMain>
        <div className="flex flex-col">
          {transactions.length === 0 ? (
            <div className="flex flex-col justify-center items-center text-lg self-center">
              <CurrencyDollarIcon className="mt-3 md:mt-0 h-48 text-black text-opacity-20" />
              <p className="font-bold text-xl">You do not have any transactions</p>
              <p className="text-md mt-1">
                <span className="text-gray-500">You can begin adding transactions </span>
                <Link
                  to="new"
                  className="text-purple-600 border-b-2 border-purple-100 hover:bg-purple-100 transition-colors duration-150 hover:no-underline hover:text-purple-600"
                >
                  here
                </Link>
              </p>
            </div>
          ) : (
            transactions.map((t) => (
              <Link
                to={`${t.id}`}
                key={t.id}
                className="hover:no-underline hover:text-inherit focus:outline-none focus:bg-gray-200"
              >
                <TransactionCard transaction={t} />
              </Link>
            ))
          )}
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
        <p className="text-zinc-600">{DateTime.fromJSDate(date, { zone: 'UTC' }).toFormat('yyyy-MM-dd')}</p>
      </div>
    </div>
  );
}
