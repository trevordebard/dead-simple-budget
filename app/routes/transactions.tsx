import { Outlet, LoaderFunction, useLoaderData } from 'remix';
import { ContentAction, ContentLayout, ContentMain } from '~/components/layout';
import { db } from '~/utils/db.server';
import { requireAuthenticatedUser } from '~/utils/server/index.server';

export const loader: LoaderFunction = async ({ request }) => {
  const user = await requireAuthenticatedUser(request);
  const transactions = await db.transaction.findMany({ where: { budgetId: user.Budget.id } });
  return transactions;
};
export default function Transctions() {
  const data = useLoaderData();
  return (
    <ContentLayout>
      <ContentMain>
        <div className="text-xl flex flex-col items-center">
          <p>transactions placeholder</p>
        </div>
      </ContentMain>
      <ContentAction>
        <Outlet />
      </ContentAction>
    </ContentLayout>
  );
}
